const React = require('react');
const {act, create} = require('react-test-renderer');
const fs = require('fs');
const path = require('path');
const mockFocus = React.createContext(true);
let mockState;
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({useSelector: select => select(mockState), useDispatch: () => mockDispatch}));
jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => require('react').useContext(mockFocus),
  useFocusEffect: callback => {
    const React = require('react');
    const focused = React.useContext(mockFocus);
    React.useEffect(() => focused ? callback() : undefined, [callback, focused]);
  },
  useNavigation: () => ({navigate: jest.fn()}),
}));
jest.mock('../src/Utils/Helpers/NetInfo', () => ({__esModule: true, default: () => Promise.resolve()}));
jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {fetch: () => Promise.resolve({isConnected: true, isInternetReachable: true}), addEventListener: callback => {callback({isConnected: true}); return jest.fn();}},
  useNetInfo: () => ({isConnected: true, isInternetReachable: true}),
}));
jest.mock('../src/Utils/Helpers/IPServer', () => ({getCountryAndDialCode: () => Promise.resolve({country: 'GB'})}));
jest.mock('../src/Screen/GlobalSupport/AppContext', () => ({AppContext: require('react').createContext({setCartcount: jest.fn()})}));
jest.mock('../src/Utils/Helpers/Dimen', () => ({__esModule: true, default: n => n}));
jest.mock('../src/Utils/Helpers/Toast', () => ({__esModule: true, default: jest.fn()}));
jest.mock('../src/Utils/Hooks/useCheckoutPersonalization', () => ({__esModule: true, default: () => jest.fn()}));
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: props => require('react').createElement('View', props, props.children)}));

for (const name of ['DetailsPageWebcast/Checkout', 'DetailsPageWebcast/Payment', 'DetailsPageWebcast/AddToCart', 'InPersonWebcast/InPersonStatewebcast']) {
  const filename = path.resolve(__dirname, `../src/Screen/${name}.js`);
  const imports = require('@babel/parser').parse(fs.readFileSync(filename, 'utf8'), {sourceType: 'module', plugins: ['jsx']}).program.body.filter(n => n.type === 'ImportDeclaration');
  for (const item of imports) {
    const source = item.source.value;
    if (source.includes('Components/') || source.includes('Themes/') || source.includes('vector-icons') ||
        source.includes('/Loader') || source.includes('/MyStatusBar') || source.includes('/IntOff') ||
        /^\.\//.test(source) || source.includes('datetime-picker') || source === 'react-native-modal' || source === 'react-native-mask-input') {
      const modulePath = source.startsWith('.') ? path.resolve(path.dirname(filename), source) : source;
      jest.doMock(modulePath, () => ({__esModule: true, Masks: {CREDIT_CARD: []}, default: props => React.createElement(source, props, props.children)}));
    }
  }
}
const Checkout = require('../src/Screen/DetailsPageWebcast/Checkout').default;
const Payment = require('../src/Screen/DetailsPageWebcast/Payment').default;
const AddToCart = require('../src/Screen/DetailsPageWebcast/AddToCart').default;
const InPersonStatewebcast = require('../src/Screen/InPersonWebcast/InPersonStatewebcast').default;
const navigation = () => ({push: jest.fn(), navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn()});
const ticket = (invoice, amount) => ({invoice, total_amount_with_fee: amount, tickets: [{ticket_id: invoice, conference_id: invoice, quantity: 1, ticket_type: 'Paid', itemamt: amount, transaction_fee: 0}]});
const checkoutProps = (invoice, amount) => ({navigation: navigation(), route: {params: {checkoutSpan: {checkoutSpan: {conferenceId: invoice}, finalTicket: ticket(invoice, amount)}}}});
const paymentProps = (invoice, amount) => ({navigation: navigation(), route: {params: {invoiceTxt: {invoiceTxt: invoice, latestTicketSave: ticket(invoice, amount), latestPaymentPrice: {subtotalAmount: amount, total_amount_with_fee: amount, transaction_fee: 0}}}}});
let trees;
beforeEach(() => {
  jest.useFakeTimers();
  trees = [];
  mockState = {WebcastReducer: {status: ''}, AuthReducer: {status: ''}, DashboardReducer: {mainprofileResponse: {}}};
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(async () => {for (const tree of trees) await act(async () => tree.unmount()); jest.clearAllTimers(); jest.useRealTimers(); jest.restoreAllMocks();});
async function mount(Component, props, focused = true) {
  let tree;
  const element = focus => React.createElement(mockFocus.Provider, {value: focus}, React.createElement(Component, props));
  await act(async () => {tree = create(element(focused));});
  trees.push(tree);
  return {tree, update: async (focus = focused) => act(async () => tree.update(element(focus)))};
}

test.each(['direct', 'cart'])('only the active %s payment checks its own invoice after a second conference payment', async flow => {
  const first = await mount(Payment, paymentProps('FIRST', 100), false);
  const props = paymentProps('SECOND', 250);
  if (flow === 'cart') props.route.params = {cartInvoice: {...props.route.params.invoiceTxt, cartInvoice: 'SECOND'}};
  const paymentAction = flow === 'cart' ? 'cartPayment' : 'webcastPayment';
  const second = await mount(Payment, props);
  mockState.WebcastReducer = {status: 'WebCast/walletCheckSuccess', walletCheckResponse: {balance: 1000}};
  await first.update(); await second.update();
  mockDispatch.mockClear();
  await act(async () => second.tree.root.findAllByType('../../Components/Button').find(n => n.props.text === 'Submit').props.onPress());
  expect(mockDispatch.mock.calls).toContainEqual([expect.objectContaining({type: `WebCast/${paymentAction}Request`, payload: expect.objectContaining({invoice: 'SECOND'})})]);
  mockState.WebcastReducer = {status: `WebCast/${paymentAction}Request`};
  await first.update(); await second.update();
  mockDispatch.mockClear();
  mockState.WebcastReducer = {status: `WebCast/${paymentAction}Success`, [`${paymentAction}Response`]: {payment_status: 'success'}};
  await first.update(); await second.update();
  expect(mockDispatch.mock.calls.filter(([a]) => a.type === 'WebCast/PaymentCheckRequest')).toEqual([[expect.objectContaining({payload: {invoice: 'SECOND'}})]]);
  expect(JSON.stringify(second.tree.toJSON())).toContain('US$250');
});

test('a new payment does not treat the previous purchase as its own success', async () => {
  mockState.WebcastReducer = {status: 'WebCast/PaymentCheckSuccess', PaymentCheckResponse: {payment_status: 'success'}, webcastPaymentResponse: {payment_status: 'success'}};
  const props = paymentProps('SECOND', 250);
  const {tree} = await mount(Payment, props);
  expect(tree.root.findByType('../../Components/PayModal').props.isVisible).toBe(false);
  await act(async () => tree.root.findAllByType('../../Components/PageHeader')[0].props.onBackPress());
  expect(props.navigation.goBack).toHaveBeenCalled();
  expect(props.navigation.navigate).not.toHaveBeenCalled();
});

test('a checkout without a pending registration cannot open payment from cached success', async () => {
  const props = checkoutProps('SECOND', 250);
  const screen = await mount(Checkout, props);
  mockState.WebcastReducer = {status: 'WebCast/saveRegistSuccess', saveRegistResponse: {msg: 'Registration details saved successfully.'}};
  await screen.update();
  expect(props.navigation.push).not.toHaveBeenCalled();
});

test.each(['direct', 'in-person'])('%s consecutive registrations send the second invoice and price to Payment exactly once', async flow => {
  const propsFor = (invoice, amount) => {
    const props = checkoutProps(invoice, amount);
    if (flow === 'in-person') props.route.params = {inPersonTicket: {inPersonTicket: ticket(invoice, amount), inpersonSpanrole: {conferenceId: invoice}, subtotalAmount: amount, totalTicketPrice: amount}};
    return props;
  };
  const firstProps = propsFor('FIRST', 100);
  const first = await mount(Checkout, firstProps);
  const proceed = async screen => {
    const control = () => screen.tree.root.findByType('./CheckoutMain').props;
    await act(async () => control().setFormData([{
      firstname: 'Test', lastname: 'User', emailad: 'test@example.com', professionad: 'Nurse',
      speciality: 'Cardiology', address: 'Test Street', country: 'United Kingdom', country_id: '232',
      state: 'London', city: 'London', zipcode: 'SW1A', cellno: '1234567890',
    }]));
    expect(control().fullAccess).toBe(true);
    await act(async () => control().proceedPayment(control().ticketSave));
  };
  await proceed(first);
  mockState.WebcastReducer = {status: 'WebCast/saveRegistRequest'};
  await first.update();
  mockState.WebcastReducer = {status: 'WebCast/saveRegistSuccess', saveRegistResponse: {msg: 'Registration details saved successfully.'}};
  await first.update();
  expect(firstProps.navigation.push).toHaveBeenCalledTimes(1);
  await first.update(false);

  const secondProps = propsFor('SECOND', 250);
  const second = await mount(Checkout, secondProps);
  expect(secondProps.navigation.push).not.toHaveBeenCalled();
  await proceed(second);
  expect(mockDispatch.mock.calls).toContainEqual([expect.objectContaining({type: 'WebCast/saveRegistRequest', payload: expect.objectContaining({invoice: 'SECOND'})})]);
  mockState.WebcastReducer = {status: 'WebCast/saveRegistRequest'};
  await first.update(false); await second.update();
  mockState.WebcastReducer = {status: 'WebCast/saveRegistSuccess', saveRegistResponse: {msg: 'Registration details saved successfully.'}};
  await first.update(false); await second.update();
  expect(firstProps.navigation.push).toHaveBeenCalledTimes(1);
  expect(secondProps.navigation.push).toHaveBeenCalledTimes(1);
  const [name, params] = secondProps.navigation.push.mock.calls[0];
  expect(name).toBe('Payment');
  expect(params.invoiceTxt).toMatchObject({invoiceTxt: 'SECOND', latestPaymentPrice: {subtotalAmount: 250, totalTicketPrice: 250}});
});

test('cart checkout requires its own submission and uses its current price', async () => {
  const props = {navigation: navigation(), route: {params: {checkoutSpan: {subtotalAmount: 250, totalTicketPrice: 260, processingFeeAmount: 10, cartData: {tickets: [{payment_id: 'SECOND'}]}}}}};
  const screen = await mount(Checkout, props);
  mockState.WebcastReducer = {status: 'WebCast/cartCheckoutSuccess', cartCheckoutResponse: {invoiceNumber: 'OLD'}};
  await screen.update();
  expect(props.navigation.push).not.toHaveBeenCalled();
  await act(async () => screen.tree.root.findByType('./CheckoutMain').props.cartPayment());
  mockState.WebcastReducer = {status: 'WebCast/cartCheckoutRequest'};
  await screen.update();
  mockState.WebcastReducer = {status: 'WebCast/cartCheckoutSuccess', cartCheckoutResponse: {invoiceNumber: 'SECOND'}};
  await screen.update();
  expect(props.navigation.push).toHaveBeenCalledWith('Payment', {cartInvoice: expect.objectContaining({cartInvoice: 'SECOND', paymentprice: expect.objectContaining({subtotalAmount: 250, totalTicketPrice: 260})})});
  await screen.update();
  expect(props.navigation.push).toHaveBeenCalledTimes(1);
});

test('new cart ignores previous coupon price and inactive cart cannot run a free payment', async () => {
  const cartResponse = amount => ({cartData: {subtotal_amount: amount, total_paid_amount: amount, total_amount_with_fee: amount, tickets: [{payment_ticket_id: amount, payment_id: amount, paid_amount: amount, title: 'Conference', credits: []}]}});
  mockState.WebcastReducer = {status: 'WebCast/cartdetailsWebcastSuccess', cartdetailsWebcastResponse: cartResponse(100), couponWebcastResponse: {discount_value: 50, total_value: 50}};
  const old = await mount(AddToCart, {navigation: navigation(), route: {params: {addtocart: {}}}}, false);
  const props = {navigation: navigation(), route: {params: {addtocart: {}}}};
  const current = await mount(AddToCart, props);
  expect(current.tree.root.findAllByType('../../Components/Button').filter(n => n.props.text === 'Proceed')).toHaveLength(0);
  mockState.WebcastReducer = {...mockState.WebcastReducer, status: 'WebCast/cartdetailsWebcastRequest'};
  await old.update(); await current.update();
  mockState.WebcastReducer = {...mockState.WebcastReducer, status: 'WebCast/cartdetailsWebcastSuccess', cartdetailsWebcastResponse: cartResponse(250)};
  await old.update(); await current.update();
  await act(async () => current.tree.root.findAllByType('../../Components/Button').find(n => n.props.text === 'Proceed').props.onPress());
  expect(props.navigation.push).toHaveBeenCalledWith('Checkout', {checkoutSpan: expect.objectContaining({subtotalAmount: 250, totalTicketPrice: 250})});
  await current.update(false);
  mockDispatch.mockClear();
  mockState.WebcastReducer = {...mockState.WebcastReducer, status: 'WebCast/cartCheckoutSuccess', cartCheckoutResponse: {invoiceNumber: 'SECOND'}};
  await old.update(); await current.update(false);
  expect(mockDispatch.mock.calls.some(([a]) => a.type === 'WebCast/FreeCartRequest')).toBe(false);
});

test('in-person ticket screen does not navigate using a cached previous invoice', async () => {
  const props = {navigation: navigation(), route: {params: {realData: {realData: {conferenceId: 'SECOND'}, ticketall: [{id: 2, itemamt: 250, amount: 250}]}}}};
  const screen = await mount(InPersonStatewebcast, props);
  mockState.WebcastReducer = {status: 'WebCast/saveTicketInpersonSuccess', saveTicketInpersonResponse: ticket('FIRST', 100)};
  await screen.update();
  expect(props.navigation.push).not.toHaveBeenCalled();
});

test('changing India to USA clears attendee and primary profession/specialty defaults', async () => {
  const {tree} = await mount(Checkout, checkoutProps('COUNTRY', 100));
  const control = () => tree.root.findByType('./CheckoutMain').props;
  const attendee = {country: 'India', country_id: '99', professionad: 'Nurse', speciality: 'Cardiology', speciality_ids: ['12']};
  await act(async () => {
    control().setProfessionad('Nurse');
    control().setSpeciality('Cardiology');
    control().setSpeciality_id(['12']);
    control().setSelectedSpecialities([{id: '12', name: 'Cardiology'}]);
    control().setFormData([attendee, {...attendee}]);
  });
  await act(async () => control().handleCountrySet({id: '1', name: 'United States', callingcode: '+1'}, 0, {source: 'user'}));
  expect(control().formData[0]).toMatchObject({country: 'United States', professionad: '', speciality: '', speciality_ids: [], speciality_id: []});
  expect(control().professionad).toBe('');
  expect(control().speciality).toBe('');
  expect(control().speciality_id).toEqual([]);
  expect(control().selectedSpecialities).toEqual([]);
  expect(control().formData[1]).toEqual(attendee);
});
