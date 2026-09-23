const React = require('react');
const {act, create} = require('react-test-renderer');
const fs = require('fs');
const path = require('path');
const screenPath = path.resolve(__dirname, '../src/Screen/DetailsPageWebcast/RegisterInterest.js');
let mockState;
let mockFocused = true;
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({useSelector: select => select(mockState), useDispatch: () => mockDispatch}));
jest.mock('@react-navigation/native', () => ({useIsFocused: () => mockFocused}));
jest.mock('../src/Utils/Helpers/NetInfo', () => ({__esModule: true, default: () => Promise.resolve()}));
jest.mock('../src/Utils/Helpers/IPServer', () => ({getCountryAndDialCode: () => Promise.resolve({country: 'GB'})}));

// Keep the screen, Redux actions and country policy real; replace native UI children.
const imports = require('@babel/parser').parse(fs.readFileSync(screenPath, 'utf8'), {sourceType: 'module', plugins: ['jsx']}).program.body.filter(n => n.type === 'ImportDeclaration');
for (const item of imports) {
  const source = item.source.value;
  if (source.includes('Components/') || source.includes('Themes/') || source.includes('react-native-vector-icons') ||
      source.includes('ProfileSpecialty') || source.includes('ProfessionComponent') || source.includes('StateContact') ||
      source.includes('CustomInputTouchableX') || source.includes('datetime-picker') || source.includes('/Loader')) {
    const modulePath = source.startsWith('.') ? path.resolve(path.dirname(screenPath), source) : source;
    jest.doMock(modulePath, () => ({__esModule: true, default: props => React.createElement('TestControl', props, props.children)}));
  }
}
jest.mock('../src/Utils/Helpers/Dimen', () => ({__esModule: true, default: n => n}));
jest.mock('../src/Utils/Helpers/Toast', () => ({__esModule: true, default: jest.fn()}));
jest.mock('react-native-safe-area-context', () => ({SafeAreaView: props => require('react').createElement('View', props, props.children)}));
const RegisterInterest = require(screenPath).default;
const props = {navigation: {goBack: jest.fn(), dispatch: jest.fn(), setOptions: jest.fn()}, route: {params: {checkoutSpan: {checkoutSpan: {conferenceId: 9}}}}};
const profile = address => ({
  user_address: {...address, contact_no: '2125551234'},
  personal_information: {firstname: 'Test', lastname: 'User', email: 'test@example.com'},
  professional_information: {profession: 'Physician'},
  specialities: {10: 'Cardiology'},
  licensures: [{state_id: '5', state_name: 'California', license_number: 'OLD', to_date: '2028-01-01'}],
});
const labels = tree => tree.root.findAllByType('TestControl').map(n => n.props.label);
let tree;
beforeEach(async () => {
  await require('@react-native-async-storage/async-storage').clear();
  mockFocused = true;
  mockDispatch.mockClear();
  mockState = {DashboardReducer: {mainprofileResponse: {}}, AuthReducer: {status: ''}, WebcastReducer: {status: ''}};
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(async () => {if (tree) await act(async () => tree.unmount()); tree = null; jest.restoreAllMocks();});

test.each([{country_id: '232', country_name: 'United Kingdom'}, {country_name: 'Canada', calling_code: '+1'}, {country_name: 'India'}, {}])('non-US/unknown %j has no license fields or license requests', async address => {
  mockState.DashboardReducer.mainprofileResponse = profile(address);
  await act(async () => {tree = create(React.createElement(RegisterInterest, props));});
  expect(labels(tree)).not.toContain('Medical License State*');
  expect(labels(tree)).not.toContain('License Number*');
  expect(labels(tree)).not.toContain('License Expiry Date');
  expect(mockDispatch.mock.calls.some(([a]) => ['Auth/stateRequest', 'Auth/licesensRequest'].includes(a.type))).toBe(false);
  expect(mockDispatch.mock.calls).toContainEqual([expect.objectContaining({type: 'Auth/professionRequest', payload: {other_country: 1}})]);
});

test('delayed profile shows license inputs only after US is confirmed and hides them after UK update', async () => {
  await act(async () => {tree = create(React.createElement(RegisterInterest, props));});
  expect(labels(tree)).not.toContain('License Number*');
  mockState.DashboardReducer.mainprofileResponse = profile({country_id: '1', country_code: 'US'});
  mockState.AuthReducer = {status: 'Auth/stateSuccess', stateResponse: {states: [{id: '5', name: 'California'}]}};
  await act(async () => tree.update(React.createElement(RegisterInterest, {...props})));
  expect(labels(tree)).toContain('Medical License State*');
  expect(labels(tree)).toContain('License Number*');
  mockState.DashboardReducer.mainprofileResponse = profile({country_id: '232', country_code: 'GB'});
  await act(async () => tree.update(React.createElement(RegisterInterest, {...props})));
  expect(labels(tree)).not.toContain('Medical License State*');
  expect(labels(tree)).not.toContain('License Number*');
});

test('returning to checkout refreshes the profile', async () => {
  mockFocused = false;
  await act(async () => {tree = create(React.createElement(RegisterInterest, props));});
  mockDispatch.mockClear();
  mockFocused = true;
  await act(async () => tree.update(React.createElement(RegisterInterest, {...props})));
  expect(mockDispatch.mock.calls.some(([a]) => a.type === 'Dashboard/mainprofileRequest')).toBe(true);
});

test('UK submission needs no hidden licenses and sends UK contact IDs without a license state', async () => {
  mockState.DashboardReducer.mainprofileResponse = profile({country_id: '232', country_name: 'United Kingdom', state_id: 'UK-STATE'});
  await act(async () => {tree = create(React.createElement(RegisterInterest, props));});
  mockDispatch.mockClear();
  const submit = tree.root.findAllByType('TestControl').find(n => n.props.text === 'Submit');
  await act(async () => submit.props.onPress());
  const registration = mockDispatch.mock.calls.map(([a]) => a).find(a => a.type === 'WebCast/RegisterIntRequest');
  expect(registration).toBeDefined();
  expect(registration.payload.attendee[0]).toMatchObject({country_id: '232', state_id: 'UK-STATE'});
  expect(registration.payload.attendee[0]).not.toHaveProperty('license_state_id');
  expect(registration.payload.attendee[0]).not.toHaveProperty('license_number');
});

test('popup details prefill Interested Checkout without guest navigation flags and survive an empty API response', async () => {
  const {saveGuestSignupDraft} = require('../src/Utils/Helpers/GuestSignupDraft');
  await saveGuestSignupDraft({email: 'journey@example.com', profession: 'Nurse', specialty: 'Cardiology', specialtyId: '12'});
  await act(async () => {tree = create(React.createElement(RegisterInterest, props));});
  const field = label => tree.root.findAllByType('TestControl').find(n => n.props.label === label);
  expect(field('Email ID*').props.value).toBe('journey@example.com');
  expect(field('Profession*').props.value).toBe('Nurse');
  expect(field('Speciality(s)*').props.chipData).toEqual(['Cardiology']);
  mockState.DashboardReducer.mainprofileResponse = {personal_information: {email: null}, professional_information: {profession: null}, specialities: {}};
  await act(async () => tree.update(React.createElement(RegisterInterest, {...props})));
  expect(field('Email ID*').props.value).toBe('journey@example.com');
  expect(field('Profession*').props.value).toBe('Nurse');
  expect(field('Speciality(s)*').props.chipData).toEqual(['Cardiology']);
  await act(async () => field('Email ID*').props.onChangeText('edited@example.com'));
  mockState.DashboardReducer.mainprofileResponse = profile({country_code: 'GB'});
  await act(async () => tree.update(React.createElement(RegisterInterest, {...props})));
  expect(field('Email ID*').props.value).toBe('edited@example.com');
});

test('updated popup specialty ID and email are submitted after returning to logged-in checkout', async () => {
  const {saveGuestSignupDraft} = require('../src/Utils/Helpers/GuestSignupDraft');
  mockState.DashboardReducer.mainprofileResponse = profile({country_id: '232', country_code: 'GB'});
  await act(async () => {tree = create(React.createElement(RegisterInterest, props));});
  mockFocused = false;
  await act(async () => tree.update(React.createElement(RegisterInterest, {...props})));
  await saveGuestSignupDraft({email: 'latest@example.com', profession: 'Nurse', specialty: 'Neurology', specialtyId: '19'});
  mockFocused = true;
  await act(async () => tree.update(React.createElement(RegisterInterest, {...props})));
  mockDispatch.mockClear();
  const submit = tree.root.findAllByType('TestControl').find(n => n.props.text === 'Submit');
  await act(async () => submit.props.onPress());
  const registration = mockDispatch.mock.calls.map(([a]) => a).find(a => a.type === 'WebCast/RegisterIntRequest');
  expect(registration.payload.attendee[0]).toMatchObject({email: 'latest@example.com', profession: 'Nurse', speciality: ['19']});
});
