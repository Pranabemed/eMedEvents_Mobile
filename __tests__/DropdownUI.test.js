import React, {useState} from 'react';
import {Text, TextInput, Keyboard, Platform} from 'react-native';
import {render, fireEvent} from '@testing-library/react-native';
import DropDownHeader, {DropdownSearch, DropdownOption, DropdownList} from '../src/Components/DropDownHeader';
import StateVaultModal from '../src/Screen/CMECreditValut/StateVaultModal';
import CustomizedYear from '../src/Screen/StateSpecification/CustomizedYear';

jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');

beforeEach(() => jest.useFakeTimers());
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); jest.restoreAllMocks(); });

test('legacy header retains its existing close behavior for protected consumers', () => {
  const dismiss = jest.spyOn(Keyboard, 'dismiss');
  const close = jest.fn();
  const screen = render(<DropDownHeader title="Profession" onClosePress={close} />);
  expect(screen.queryByLabelText('Close dropdown')).toBeNull();
  fireEvent.press(screen.UNSAFE_getByType(require('react-native').TouchableOpacity));
  expect(close).toHaveBeenCalledTimes(1);
  expect(dismiss).not.toHaveBeenCalled();
});

test.each(['ios', 'android'])('search and selection retain full values on %s', platform => {
  const original = Platform.OS;
  Platform.OS = platform;
  const select = jest.fn();
  function Picker() {
    const [query, setQuery] = useState('');
    const data = [{state_id: '1', state_name: 'Alaska'}, {state_id: '10', state_name: 'California'}];
    return <StateVaultModal vaultState={select} setStatepick={jest.fn()} searchtexttopic={query}
      searchTopicName={setQuery} clisttopic={data.filter(item => item.state_name.toLowerCase().includes(query.toLowerCase()))} />;
  }
  const screen = render(<Picker />);
  const input = screen.getByPlaceholderText('Search State');
  fireEvent.changeText(input, 'cali');
  expect(screen.getByDisplayValue('cali')).toBeTruthy();
  expect(screen.queryByText('Alaska')).toBeNull();
  fireEvent.press(screen.getByText('California'));
  expect(select).toHaveBeenCalledWith({state_id: '10', state_name: 'California'});
  fireEvent.changeText(input, '');
  expect(screen.getByText('Alaska')).toBeTruthy();
  Platform.OS = original;
});

test('search input is not remounted across typing and focus changes', () => {
  function Search() { const [value, setValue] = useState(''); return <DropdownSearch value={value} onChangeText={setValue} placeholder="Search" />; }
  const screen = render(<Search />);
  const input = screen.UNSAFE_getByType(TextInput);
  fireEvent(input, 'focus');
  fireEvent.changeText(input, 'cardiology');
  expect(screen.UNSAFE_getByType(TextInput)).toBe(input);
  fireEvent(input, 'blur');
  expect(screen.getByDisplayValue('cardiology')).toBeTruthy();
});

test('non-searchable year picker preserves selection and close callbacks', () => {
  const select = jest.fn(), close = jest.fn();
  const screen = render(<CustomizedYear yearRange={[2026, 2027]} handleYearcust={select} setCitypickeryear={close} />);
  fireEvent.press(screen.getByText('2027'));
  expect(select).toHaveBeenCalledWith(2027);
  expect(close).toHaveBeenCalledWith(false);
  fireEvent.press(screen.getByLabelText('Close dropdown'));
  expect(close).toHaveBeenCalledTimes(2);
});

test('selected rows expose selection and large lists remain virtualized', () => {
  const screen = render(<DropdownList data={Array.from({length: 2000}, (_, id) => ({id}))}
    keyExtractor={item => String(item.id)} renderItem={({item}) => <DropdownOption selected={item.id === 0}><Text>{item.id}</Text></DropdownOption>} />);
  expect(screen.getAllByRole("button").length).toBeLessThan(2000);
  expect(screen.getAllByRole("button")[0].props.accessibilityState.selected).toBe(true);
});

test('standardized closed field preserves text/icon callbacks and disabled state', () => {
  const Field = require('../src/Components/IconTextIn').default;
  const open = jest.fn(), icon = jest.fn();
  const screen = render(<Field standardized label="State" value="California" onPress={open} onIconpres={icon} />);
  fireEvent.press(screen.getByLabelText('State'));
  fireEvent.press(screen.getByLabelText('Open State'));
  expect(open).toHaveBeenCalledTimes(1);
  expect(icon).toHaveBeenCalledTimes(1);
  screen.rerender(<Field standardized label="State" value="California" onPress={open} onIconpres={icon} disabled />);
  fireEvent.press(screen.getByLabelText('State'));
  fireEvent.press(screen.getByLabelText('Open State'));
  expect(open).toHaveBeenCalledTimes(1);
  expect(icon).toHaveBeenCalledTimes(1);
});

test('legacy closed fields do not opt into the new layout', () => {
  const Field = require('../src/Components/IconTextIn').default;
  const screen = render(<Field label="Country" value="USA" onPress={jest.fn()} />);
  expect(screen.queryByLabelText('Open Country')).toBeNull();
  expect(screen.getByText('USA')).toBeTruthy();
});

test('clear search retains the same mounted input', () => {
  function Search() {const [value, setValue] = useState('Alaska'); return <DropdownSearch value={value} onChangeText={setValue} placeholder="Search" />;}
  const screen = render(<Search />);
  const input = screen.UNSAFE_getByType(TextInput);
  fireEvent.press(screen.getByLabelText('Clear search'));
  expect(screen.UNSAFE_getByType(TextInput)).toBe(input);
  expect(input.props.value).toBe('');
});

jest.mock('../src/Components/PageHeader', () => 'LegacyHeader');
test('shared country selector uses Profile UI by default and preserves attendee selection', () => {
  const Country = require('../src/Screen/DetailsPageWebcast/CheckoutModaltwo').default;
  const selected = jest.fn(), close = jest.fn(), clear = jest.fn();
  const props = {countrypicker: true, setSearchcountry: clear, activeIndex: 2, searchcountry: '',
    handleCountrySet: selected, setCountrypicker: close, searchCountryName: jest.fn(), countryall: [{id: 1, name: 'USA'}]};
  const screen = render(<Country {...props} />);
  expect(screen.queryByText('LegacyHeader')).toBeNull();
  expect(screen.getByPlaceholderText('Search Country')).toBeTruthy();
  expect(screen.getByLabelText('Close dropdown')).toBeTruthy();
  fireEvent.press(screen.getByText('USA'));
  expect(selected).toHaveBeenCalledWith({id: 1, name: 'USA'}, 2);
  expect(close).toHaveBeenCalledWith(false);
  expect(clear).toHaveBeenCalledWith('');
});

jest.mock('react-native-safe-area-context', () => ({SafeAreaView: 'SafeAreaView'}));
test('CME state modal uses shared search and retains the selected item callback', () => {
  const Picker = require('../src/Screen/CMERequirement/ProfessionDropdown').default;
  const select = jest.fn();
  const state = {id: 10, name: 'California'};
  const screen = render(<Picker selectedProfession="Physician" onSelectProfession={jest.fn()}
    selectedState={null} onSelectState={select} statesList={[{id: 1, name: 'Alaska'}, state]} />);
  fireEvent.press(screen.getByText('Select State'));
  fireEvent.changeText(screen.getByPlaceholderText('Search State'), 'cali');
  fireEvent.press(screen.getByText('California'));
  expect(select).toHaveBeenCalledWith(state);
});

test('Checkout profession selection retains the attendee index and close behavior', () => {
  const Picker = require('../src/Screen/DetailsPageWebcast/InPersonProfession').default;
  const select = jest.fn(), close = jest.fn(), clear = jest.fn();
  const screen = render(<Picker handleProfession={select} profindex={2} clist={['Physician', 'Nurse']}
    setcountrypicker={close} countrypickerprof setSearchtext={clear} searchtext="" searchCountryName={jest.fn()} />);
  fireEvent.press(screen.getByText('Nurse'));
  expect(select).toHaveBeenCalledWith('Nurse', 2);
  expect(close).toHaveBeenCalledWith(false);
  expect(clear).toHaveBeenCalledWith('');
  expect(screen.getByLabelText('Close dropdown')).toBeTruthy();
});

test('Profile specialty chips retain their removal index with standardized styling', () => {
  const Field = require('../src/Screen/Profile/CustomInputTouchableX').default;
  const remove = jest.fn(), open = jest.fn();
  const screen = render(<Field standardized label="Specialty" chipData={['Cardiology', 'Neurology']}
    onRemoveChip={remove} onPress={open} onIconpres={open} />);
  fireEvent.press(screen.getByLabelText('Remove Neurology'));
  expect(remove).toHaveBeenCalledWith(1);
  fireEvent.press(screen.getByLabelText('Open Specialty'));
  expect(open).toHaveBeenCalledTimes(1);
});

test('Checkout specialty selection retains the attendee callback and selected state', () => {
  const Picker = require('../src/Screen/DetailsPageWebcast/CheckoutModalone').default;
  const change = jest.fn();
  const specialty = {id: 3, name: 'Cardiology'};
  const screen = render(<Picker statepicker selectedSpecialities={[[], []]}
    formData={[{}, {speciality_ids: [3]}]} activeIndex={1} previousSpec={[]}
    setSelectedSpecialities={fn => fn([[], []])} handleSpecialityChange={change}
    slist={[specialty]} searchState="" searchStateName={jest.fn()} setstatepicker={jest.fn()} setSearchState={jest.fn()} />);
  fireEvent.press(screen.getByText('Cardiology'));
  expect(change).toHaveBeenCalledWith(1, ['Cardiology'], [3]);
  expect(screen.getByRole('button', {selected: true})).toBeTruthy();
});

test.each(['state', 'city'])('Checkout %s dropdown preserves the selected attendee and value', kind => {
  const select = jest.fn(), close = jest.fn(), clear = jest.fn();
  const item = {id: 9, name: kind === 'state' ? 'California' : 'San Diego'};
  const Picker = kind === 'state'
    ? require('../src/Screen/DetailsPageWebcast/CheckoutModalthree').default
    : require('../src/Screen/DetailsPageWebcast/CheckoutModalFourth').default;
  const props = kind === 'state'
    ? {pratice: true, setSearchState: clear, searchpratice: '', handleStateshows: select, setPratice: close, searchStateNamePratice: jest.fn(), slistpratice: [item]}
    : {cityPicker: true, cityAll: [item], setSearchcity: clear, searchcity: '', handlecityShows: select, setCityPicker: close, searchCityName: jest.fn()};
  const screen = render(<Picker {...props} activeIndex={2} standardized />);
  fireEvent.press(screen.getByText(item.name));
  expect(select).toHaveBeenCalledWith(item, 2);
  expect(close).toHaveBeenCalledWith(false);
  expect(clear).toHaveBeenCalledWith('');
});


test('dropdown search inputs omit stars for required and optional selectors', () => {
  const change = jest.fn();
  const screen = render(<DropdownSearch placeholder="Search Country Name*" value="" onChangeText={change} />);
  expect(screen.queryByText('*')).toBeNull();
  fireEvent.changeText(screen.getByPlaceholderText('Search Country'), 'India');
  expect(change).toHaveBeenCalledWith('India');
  screen.rerender(<DropdownSearch placeholder="Search Country Name*" required={false} value="India" onChangeText={change} />);
  expect(screen.queryByText('*')).toBeNull();
});

test.each(['Profession', 'Specialty', 'Country', 'State', 'City', 'Year'])('dropdown placeholder for %s excludes required marker', field => {
  const {dropdownPlaceholder} = require('../src/Components/DropDownHeader');
  expect(dropdownPlaceholder(`${field} *`)).toBe(`Select ${field}`);
});

test('normal input labels keep their existing text and dropdown presentation is explicit', () => {
  const Input = require('../src/Components/CellInput').default;
  const screen = render(<Input label="First Name*" value="" editable />);
  expect(screen.getByText('First Name*')).toBeTruthy();
  screen.rerender(<Input dropdownPresentation label="City*" value="" editable={false} leftIcon={<Text>v</Text>} onwholePress={jest.fn()} />);
  expect(screen.getByText('Select City')).toBeTruthy();
});

test('optional country selector retains search and selection without required marker', () => {
  const Country = require('../src/Screen/DetailsPageWebcast/CheckoutModaltwo').default;
  const select = jest.fn(), close = jest.fn();
  const screen = render(<Country required={false} countrypicker countryall={[{id: 2, name: 'India'}]}
    searchcountry="" searchCountryName={jest.fn()} setSearchcountry={jest.fn()} setCountrypicker={close} handleCountrySet={select} />);
  expect(screen.queryByText('*')).toBeNull();
  fireEvent.press(screen.getByText('India'));
  expect(select).toHaveBeenCalledWith({id: 2, name: 'India'}, undefined);
  expect(close).toHaveBeenCalledWith(false);
});

test('employment status dropdown preserves selected value and close callback', () => {
  const Picker = require('../src/Screen/Profile/EmpStatus').default;
  const select = jest.fn(), close = jest.fn();
  const screen = render(<Picker profiletakeshow empstatusname="Full-Time" setEmpstatusname={select} setProfiletakeshow={close} />);
  fireEvent.press(screen.getByText('Part-Time'));
  expect(select).toHaveBeenCalledWith('Part-Time');
  expect(close).toHaveBeenCalledWith(false);
});

test('travel dropdown preserves the original option value', () => {
  const Picker = require('../src/Screen/CMEExpense.js/TravelMode').default;
  const select = jest.fn(), close = jest.fn();
  const screen = render(<Picker expenspicker dommyData={['Air', 'Train']} traveltake="Air" setTraveltake={select} setExpenspicker={close} />);
  fireEvent.press(screen.getByText('Train'));
  expect(select).toHaveBeenCalledWith('Train');
  expect(close).toHaveBeenCalledWith(false);
});


test.each(['Profession*', 'Speciality(s)*', 'Country *', 'State*', 'City*'])('dropdown heading consistently prefixes %s with Select', title => {
  const {dropdownPlaceholder} = require('../src/Components/DropDownHeader');
  const screen = render(<DropDownHeader standardized title={title} onClosePress={jest.fn()} />);
  expect(screen.getByText(dropdownPlaceholder(title))).toBeTruthy();
  expect(screen.queryByText('*')).toBeNull();
});

test('Checkout specialty chips do not share their row with placeholder text', () => {
  const Field = require('../src/Screen/DetailsPageWebcast/Multiple').default;
  const open = jest.fn();
  const screen = render(<Field label="Speciality*" value="" placeholder="" chipData={0} index={0}
    formData={[{speciality: 'Cardiology, Neurology', speciality_ids: [1, 2]}]}
    onPress={open} onIconpres={open} rightIcon={<Text>Open specialties</Text>}>
    <Text>Cardiology</Text><Text>Neurology</Text>
  </Field>);
  expect(screen.queryByText('Select Specialty')).toBeNull();
  expect(screen.getByText('Specialty')).toBeTruthy();
  expect(screen.getByText('Cardiology')).toBeTruthy();
  expect(screen.getByText('Neurology')).toBeTruthy();
  fireEvent.press(screen.getByText('Open specialties'));
  expect(open).toHaveBeenCalledWith(0);
  expect(screen.queryByText('Select Specialty')).toBeNull();
});
