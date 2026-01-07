import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ScrollView, Image, View, Text, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Button, TextInput, Alert, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import TextFieldIn from '../../Components/Textfield';
import CustomTextField from '../../Components/CustomTextfiled';
import Colorpath from '../../Themes/Colorpath';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import normalize from '../../Utils/Helpers/Dimen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../../Themes/Fonts';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import CalenderIcon from 'react-native-vector-icons/Feather';
import FileIcn from 'react-native-vector-icons/MaterialCommunityIcons'
import TickMark from 'react-native-vector-icons/Ionicons';
import DocumentPicker, { types } from 'react-native-document-picker';
import DropdownIcon from 'react-native-vector-icons/Entypo';
import InputField from '../../Components/CellInput';
import CustomInputTouchable from '../../Components/IconTextIn';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AddressField from '../../Components/AutoData';
import CustomInputTouchableZ from './Newmultiple';
import CustomInputTouchableY from './Multiple';
import { AppContext } from '../GlobalSupport/AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
const GOOGLE_API_KEY = 'AIzaSyBDnBivN-fdP6JxOcQFIyvhxIJSArru6Nk';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
const CheckoutInputbox = ({ handleInputChangeeamilad, activeIndexc,
  handleInputChanged,
  isEmailTouched,
  setIsEmailTouched,
  isCellNoTouched,
  setIsCellNoTouched,
  setAllmsg,
  allmsg,
  handleCountrySet,
  handlecityShows,
  handleStateshows,
  cityAll,
  slistpratice,
  countryall,
  activeIndexct,
  activeIndexs,
  errorFlags,
  setActiveIndexc,
  searchpratice,
  setActiveindexs,
  setProfindex,
  profindex,
  handleProfession,
  countrypickerprof,
  setcountrypickerprof,
  searchpraticelic,
  licstatepratice,
  setLicstatepratice,
  activeIndexslic,
  slistpraticelic,
  license_expiry_date,
  setLicense_expiry_date,
  license_state_id,
  setLicense_state_id,
  license_number,
  setLicense_number,
  handleLicStateshows,
  setActiveIndexslic,
  medicallics,
  setMedicallics,
  opendatelicyall,
  setOpendatelicyall,
  dateindex,
  setDateindex,
  errors,
  setErrors,
  customFields,
  setCustomFields,
  customFieldsLabels,
  setCustomFieldsLabels,
  dialcode,
  SetDialcode,
  setDateofbirth,
  dateofbirth,
  dobindex,
  setDobindex,
  setDobchoose,
  dobchoose,
  iseMededDo,
  setActiveIndexct, city_id, state_id, country_id, countrypicker, spanroute, ticketSave, speciality_id, setSpeciality, setSpeciality_id, activeIndex, removeSpeciality, selectedSpecialities, setSelectedSpecialities, slist, searchStateName, searchState, setSearchState, statepicker, handleSpecialitySelect, formData, setFormData, setActiveIndex, totalQuantity, firstname, setFirstname, lastname, setLastname, emailad, setEmailad, professionad, setProfessionad, setstatepicker, allProfession, specaillized, speciality, npino, setNpino, address, setAddress, setCountrypicker, countryReq, country, PraticingState, setPratice, state, setCityPicker, cityReq, city, zipcode, setZipcode, cellno, setCellno }) => {
  console.log(speciality, "totalQuantity122", slist, totalQuantity, spanroute)
  const {
    isConnected
  } = useContext(AppContext);
  useEffect(() => {
    if (totalQuantity) {
      countryReq();
      const initialFormData = Array.from({ length: totalQuantity }, (_, index) => ({
        firstname: index === 0 ? firstname || '' : '',
        lastname: index === 0 ? lastname || '' : '',
        emailad: index === 0 ? emailad || '' : '',
        professionad: index === 0 ? professionad || '' : '',
        speciality: index === 0 ? speciality || '' : '',
        speciality_ids: index === 0 ? (speciality_id ? speciality_id : []) : [],
        npino: index === 0 ? npino || '' : '',
        address: index === 0 ? address || '' : '',
        country: index === 0 ? country || '' : '',
        country_id: index === 0 ? (country_id ? country_id : []) || '' : '',
        state: index === 0 ? state || '' : '',
        state_id: index === 0 ? (state_id ? state_id : []) || '' : '',
        city: index === 0 ? city || '' : '',
        city_id: index === 0 ? (city_id ? city_id : []) || '' : '',
        zipcode: index === 0 ? zipcode || '' : '',
        cellno: index === 0 ? cellno || '' : '',
        searchpratice: '',
        medicallics: index === 0 ? medicallics || '' : '',
        license_number: index === 0 ? license_number || '' : '',
        license_expiry_date: index === 0 ? license_expiry_date || '' : '',
        license_state_id: index === 0 ? (license_state_id ? license_state_id : []) || '' : '',
        dialcode: index === 0 ? dialcode || '' : '',
        dateofbirth: index === 0 ? dateofbirth || '' : ''
      }));
      setFormData(initialFormData);
    }
  }, [totalQuantity, firstname, lastname, emailad, professionad, speciality, speciality_id, npino, address, medicallics, license_number, license_expiry_date, setFormData]);
  console.log(selectedSpecialities, "selectedSpecialities=----------", formData, country_id, errorFlags);
  const [newState, setNewState] = useState("");
  const [newIndex, setNewIndex] = useState("");
  const [pushSat, setPushSat] = useState("");
  const [newCity, setNewCity] = useState("");
  const [cityIndex, setCityIndex] = useState("");
  const [socheck, setSocheck] = useState(false);
  const [customdob, setCustomdob] = useState(false);
  const [indAd, setIndAd] = useState(0)
  const [dropdownModal, setDropdownModal] = useState({
    visible: false,
    index: null,
    fieldName: null,
    options: null
  });
  // State for date picker
  const [datePickerState, setDatePickerState] = useState({
    visible: false,
    index: null,
    fieldName: null
  });

  // Function to open date picker for a specific field
  const openDatePicker = (index, fieldName) => {
    setDatePickerState({
      visible: true,
      index: index,
      fieldName: fieldName
    });
  };

  // Function to close date picker
  const closeDatePicker = () => {
    setDatePickerState({
      visible: false,
      index: null,
      fieldName: null
    });
  };

  // Function to handle date selection
  const handleDateSelect = (date, index, fieldName) => {
    handleInputChange(index, fieldName, date.toISOString().split('T')[0]);
    closeDatePicker();
  };
  useEffect(() => {
    if (allmsg) {
      setFormData((prevData) => {
        const updatedData = [...prevData];
        if (updatedData[0]) {
          updatedData[0].emailad = '';
        }
        return updatedData;
      });
    }
  }, [allmsg]);
  const customHandle = spanroute?.inPersonTicket?.custom_fields || ticketSave?.custom_fields;
  console.log(customHandle, "customHandle--------------")
  const [conn, setConn] = useState("")
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection State:', state.isConnected);
      setConn(state.isConnected);
    });
    return () => unsubscribe();
  }, [isConnected]);
  const handleInputChange = (index, key, value) => {
    ensureAnimatedValue(index);
    const shouldBeUp = !!value;
    if (!isFieldFocused[index]) {
      animatedValues[index].setValue(shouldBeUp ? 1 : 0);
    }
    const updatedForm = [...formData];
    if (!updatedForm[index]) {
      updatedForm[index] = {};
    }
    updatedForm[index][key] = value;
    setFormData(updatedForm);
    if (key == 'npino') {
      if (value?.length == 0) {
        // If the input is empty, remove the error
        setErrors(prev => ({ ...prev, [index]: false }));
      } else if (/^\d{10}$/.test(value)) {
        // If input is exactly 10 digits, remove the error
        setErrors(prev => ({ ...prev, [index]: false }));
      } else {
        // If input is invalid (less than 10 digits or contains non-digits), show error
        setErrors(prev => ({ ...prev, [index]: true }));
      }
    }
    // Update custom fields
    const updatedCustomFields = [...customFields];
    updatedCustomFields[index] = {
      ...updatedCustomFields[index],
      [key]: value,  // Update the custom field with value for the specific attendee
    };
    setCustomFields(updatedCustomFields);

    // Update custom fields labels for display
    const updatedCustomFieldsLabels = [...customFieldsLabels];
    updatedCustomFieldsLabels[index] = {
      ...updatedCustomFieldsLabels[index],
      [key]: customHandle && customHandle.find(item => item.field_name === key)?.field_label || '',
    };
    setCustomFieldsLabels(updatedCustomFieldsLabels);
  };
  const fetchSpecialities = (index) => {
    if (allProfession?.profession) {
      const fetchedSpecialities = specaillized(allProfession.profession);
      if (Array.isArray(fetchedSpecialities)) {
        setSelectedSpecialities(fetchedSpecialities);
      }
    }
    setActiveIndex(index);
    setstatepicker(true);
  };
  const countryPick = (index) => {
    console.log(index, "fghekjghjfk123344")
    setActiveIndexc(index);
    setCountrypicker(true);
    countryReq();
  }
  const DatePick = (index) => {
    setDateindex(index);
    setOpendatelicyall(!opendatelicyall);
  }
  const DobPick = (index) => {
    setDobindex(index);
    setDobchoose(!dobchoose);
  }
  const statePick = (index) => {
    console.log(index, "fghekjghjfk123344")
    setActiveindexs(index);
    setPratice(true);
    // PraticingState();
  }
  const cityPick = (index) => {
    console.log(index, "fghekjghjfk123344")
    setActiveIndexct(index);
    setCityPicker(true);
    // PraticingState();
  }
  const professionTrack = (index) => {
    setProfindex(index);
    setcountrypickerprof(true)
  }
  const medicalState = (index) => {
    setActiveIndexslic(index);
    setLicstatepratice(true)
  }
  const normalizeCountryName = (country) => {
    // Normalize country names to align with entries in countryall
    const countryMap = {
      "United States": "United States of America",
      // Add more mappings as needed
    };
    return countryMap[country] || country;
  };
  console.log(slistpratice, "slistpratice=======", cityAll);
  const [selectedStateData, setSelectedStateData] = useState(null);
  const [selectedCityData, setSelectedCityData] = useState(null);
  useEffect(() => {
    // Set `selectedStateData` only when `newState` and `slistpratice` are valid
    if (slistpratice && newState) {
      const stateData = slistpratice.find(s => s.name === newState);
      if (stateData) {
        setSelectedStateData({ ...stateData, index: newIndex });
      }
    }
  }, [slistpratice, newState, newIndex]);

  useEffect(() => {
    // When `selectedStateData` changes, update only the specific index in `formData`
    if (selectedStateData && selectedStateData.index === newIndex) {
      const { id: newid, name } = selectedStateData;
      handleStateshows(selectedStateData, newIndex);
      setFormData(prevData => {
        // Clone `prevData` to avoid mutations
        const updatedData = [...prevData];

        // Update only the current index with new state data
        updatedData[newIndex] = {
          ...updatedData[newIndex],
          state_id: newid,
          state: name
        };

        return updatedData;
      });

      // Clear selectedStateData after updating to prevent unintended re-renders
      setSelectedStateData(null);
    }
  }, [selectedStateData, newIndex]);

  useEffect(() => {
    // Set `selectedStateData` only when `newState` and `slistpratice` are valid
    if (cityAll && newCity) {
      const CityData = cityAll.find(s => s.name === newCity);
      if (CityData) {
        setSelectedCityData({ ...CityData, index: cityIndex });
      }
    }
  }, [cityAll, newCity, cityIndex]);

  useEffect(() => {
    // When `selectedStateData` changes, update only the specific index in `formData`
    if (selectedCityData && selectedCityData.index === cityIndex) {
      const { id: newidcity, name: city_name } = selectedCityData;
      console.log(selectedCityData, "selectedCityData--------")
      handlecityShows(selectedCityData, cityIndex);
      setFormData(prevData => {
        // Clone `prevData` to avoid mutations
        const updatedData = [...prevData];

        // Update only the current index with new state data
        updatedData[cityIndex] = {
          ...updatedData[cityIndex],
          city_id: newidcity,
          city: city_name
        };

        return updatedData;
      });

      // Clear selectedCityData after updating to prevent unintended re-renders
      setSelectedCityData(null);
    }
  }, [selectedCityData, cityIndex]);
  async function btnClick_galeryUpload(ind, namx) {
    try {
      const response = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
        ],
        allowMultiSelection: false,
      });

      if (response && response.length > 0) {
        const fileObj = {
          name: response[0].name,
          type: response[0].type,
          uri: response[0].uri,
        };

        // Update formData
        setFormData((prev) => {
          const updatedFormData = [...prev];
          if (!updatedFormData[ind]) {
            updatedFormData[ind] = {}; // Initialize if index doesn't exist
          }
          updatedFormData[ind] = {
            ...updatedFormData[ind], // Preserve existing data
            [namx]: fileObj, // Add or update the new key
          };
          return updatedFormData;
        });

        const updatedCustomFields = [...customFields];
        updatedCustomFields[ind] = {
          ...updatedCustomFields[ind],
          [namx]: fileObj,  // Update the custom field with value for the specific attendee
        };
        setCustomFields(updatedCustomFields);

        // Update custom fields labels for display
        const updatedCustomFieldsLabels = [...customFieldsLabels];
        updatedCustomFieldsLabels[ind] = {
          ...updatedCustomFieldsLabels[ind],
          [namx]: customHandle && customHandle.find(item => item.field_name === namx)?.field_label || '',
        };
        setCustomFieldsLabels(updatedCustomFieldsLabels);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.log(err);
      }
    }
  }
  // const animated = useRef(new Animated.Value(formData[indAd]?.address ? 1 : 0)).current;
  const [isFieldFocused, setIsFieldFocused] = useState({});
  const animatedValues = useRef([]).current;
  useEffect(() => {
    formData.forEach((_, index) => {
      syncAnimatedValue(index);
    });
  }, [formData]);
  const syncAnimatedValue = (index) => {
    ensureAnimatedValue(index);
    const shouldBeUp = !!formData[index]?.address;
    if (!isFieldFocused[index]) { // sync only when not focused
      animatedValues[index].setValue(shouldBeUp ? 1 : 0);
    }
  };
  const ensureAnimatedValue = (index) => {
    if (!animatedValues[index]) {
      animatedValues[index] = new Animated.Value(formData[index]?.address ? 1 : 0);
    }
  };
  useEffect(() => {
    formData.forEach((item, index) => {
      ensureAnimatedValue(index);
      const shouldBeUp = !!item?.address || isFieldFocused[index]; // label up if value exists OR focused
      Animated.timing(animatedValues[index], {
        toValue: shouldBeUp ? 1 : 0,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });
  }, [formData, isFieldFocused]);
  const getLabelStyle = (index) => {
    ensureAnimatedValue(index);
    return {
      position: 'absolute',
      left: 0,
      transform: [
        {
          translateY: animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [20, -25],
          }),
        },
      ],
      fontFamily: Fonts.InterRegular,
      fontSize: 14,
      color: '#999999',
    };
  };

  const handleFocus = (index) => {
    ensureAnimatedValue(index);
    Animated.timing(animatedValues[index], {
      toValue: 1,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
    setIsFieldFocused(prev => ({ ...prev, [index]: true }));
  };

  const handleBlur = (index) => {
    ensureAnimatedValue(index);
    if (!formData[index]?.address) {
      Animated.timing(animatedValues[index], {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
    setIsFieldFocused(prev => ({ ...prev, [index]: false }));
  };

  const styles = StyleSheet.create({
    inputGroup: {
      marginBottom: 16,
      width: '100%',
      position: 'relative',
    },
    label: {
      fontSize: 14,
      fontFamily: Fonts.InterRegular,
      color: '#999999',
    },
    inputWrapper: {
      borderBottomWidth: 0.5,
      borderBottomColor: "#000000",
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: normalize(25),
      position: 'relative',
    },
    countryCodeContainer: {
      paddingRight: 5,
      paddingVertical: 10,
    },
    countryCodeText: {
      fontSize: 16,
      fontFamily: Fonts.InterRegular,
      color: '#000000',
    },
    input: {
      flex: 1,
      padding: 10,
      fontSize: 16,
      fontFamily: Fonts.InterRegular,
      color: '#000000',
      // paddingTop: 10,
      paddingHorizontal: -10,
    },
    inputWithCountryCode: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    inputWithRightIcon: {
      paddingRight: 40,
    },
    disabledInput: {
      opacity: 0.6,
    },
    iconContainer: {
      position: 'absolute',
      right: 12,
      padding: 4,
    },
    eyeIcon: {
      fontSize: 16,
      fontFamily: Fonts.InterRegular,
      color: '#000000',
    },
  });
  const handlePlaceSelected = async (data, details, index) => {
    console.log(details, "details==========", details?.formatted_address);

    if (details) {
      try {
        const addressComponents = details.address_components;
        const country = addressComponents.find(comp => comp.types.includes('country'))?.long_name || '';
        const state = addressComponents.find(comp => comp.types.includes('administrative_area_level_1'))?.long_name || '';
        const city = addressComponents.find(comp => comp.types.includes('locality') || comp.types.includes('sublocality'))?.long_name || '';
        const address = details?.formatted_address || 'Address not available';
        let postalCode = null;
        const postalComponent = addressComponents.find(comp => comp.types.includes('postal_code'));
        const extracted = postalComponent?.long_name;
        postalCode = extracted && /^[0-9]+$/.test(extracted) ? extracted : null;
        console.log(postalCode, "post0-------")
        if (state) {
          setNewState(state);
          setNewIndex(index);
        }
        if (city) {
          setNewCity(city);
          setCityIndex(index)
        }
        if (postalCode !== null && details.geometry?.location) {
          const { lat, lng } = details.geometry.location;
          postalCode = await fetchPostalCodeFromGeocode(lat, lng) || 'Postal code not available';
          console.log(postalCode, "postalCode==========");
        }
        if (countryall) {
          const normalizedCountry = normalizeCountryName(country);
          const countryData = countryall.find(c => c.name.toLowerCase() == normalizedCountry.toLowerCase());
          console.log(countryData, "countryData==========", state, city);
          if (countryData) {
            handleCountrySet(countryData, index);
            const countryId = countryData?.id;
            setFormData(prevData => {
              const updatedData = [...prevData];
              updatedData[index] = {
                ...updatedData[index],
                city: city ? city : '', // Only set city if cityId is found
                state: state ? state : '', // Only set state if stateId is found
                zipcode: postalCode,
                country: normalizedCountry,
                address,
                country_id: countryId,
                dialcode: countryData?.callingcode
              };
              return updatedData;
            });


          } else {
            console.error(`Country "${normalizedCountry}" not found in the predefined list.`);
          }
        } else {
          console.error("Country data (countryall) is not loaded.");
        }

      } catch (error) {
        console.error("Error fetching address details:", error);
      }
    }
  };
  console.log(newCity, "newcity++++++++")
  const fetchPostalCodeFromGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      const addressComponents = data.results[0]?.address_components;
      const postalCode = addressComponents?.find(comp =>
        comp.types.includes('postal_code')
      )?.long_name;
      if (postalCode && /^\d+$/.test(postalCode)) {
        return postalCode;
      }
      return null;
    } catch (error) {
      console.error('Geocode error:', error);
      return null;
    }
  };
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const toggleExpand = (sectionIndex) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [sectionIndex]: !prevState[sectionIndex]
    }));
  };
  const handleCheckboxChange = (index, fieldName, value) => {
    if (!formData[index]) {
      formData[index] = {};
    }

    if (!formData[index][fieldName]) {
      formData[index][fieldName] = [];
    }

    if (formData[index][fieldName].includes(value)) {
      // Remove value if already present
      formData[index][fieldName] = formData[index][fieldName].filter(item => item !== value);
    } else {
      // Add value if not present
      formData[index][fieldName].push(value);
    }
    if (formData[index][fieldName].length == 0) {
      delete formData[index][fieldName];
      if (Object.keys(formData[index]).length == 0) {
        formData.splice(index, 1);
      }
    }
    setFormData([...formData]);
    const updatedCustomFields = [...customFields];
    updatedCustomFields[index] = {
      ...updatedCustomFields[index],
      [fieldName]: [value],  // Update the custom field with value for the specific attendee
    };
    setCustomFields(updatedCustomFields);

    // Update custom fields labels for display
    const updatedCustomFieldsLabels = [...customFieldsLabels];
    updatedCustomFieldsLabels[index] = {
      ...updatedCustomFieldsLabels[index],
      [fieldName]: customHandle && customHandle.find(item => item.field_name === fieldName)?.field_label || '',
    };
    setCustomFieldsLabels(updatedCustomFieldsLabels);
  };
  const formatPhoneNumber = (input, isUSA = false) => {
    if (isUSA) {
      // USA format: (XXX) XXX-XXXX
      const cleaned = input.replace(/\D/g, '').slice(0, 10);
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

      if (match) {
        let formatted = '';
        if (match[1]) formatted = `(${match[1]}`;
        if (match[2]) formatted += `) ${match[2]}`;
        if (match[3]) formatted += `-${match[3]}`;
        return formatted;
      }
    } else {
      // International format: remove non-digits but allow up to 15 digits
      return input.replace(/[^0-9]/g, '').slice(0, 15);
    }
    return input;
  };
  console.log(ticketSave, "ticketime-----")

  const custom_fieldsTake = spanroute?.inPersonTicket?.custom_fields || ticketSave?.custom_fields
  const renderForms = () => {
    return Array.from({ length: totalQuantity }, (_, index) => (
      <View key={index} style={{ flex: 1 }}>
        {totalQuantity > 1 && <TouchableOpacity onPress={() => toggleExpand(index)} style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }}>
          <Text style={{ fontSize: 16, fontFamily: Fonts.InterMedium, color: "#000000", textAlign: 'center', paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
            {`Attendee ${index + 1} Information`}
          </Text>
          <TouchableOpacity onPress={() => toggleExpand(index)} style={{ paddingVertical: normalize(10), marginRight: normalize(10) }}>
            <ArrowIcon name={expandedSections[index] ? "keyboard-arrow-up" : "keyboard-arrow-down"} color={"#000000"} size={30} />
          </TouchableOpacity>
        </TouchableOpacity>}
        {totalQuantity > 1 && <View style={{ height: 0.8, width: normalize(300), backgroundColor: "#999999", alignSelf: "center" }} />}
        {syncAnimatedValue(index)}
        {expandedSections[index] && <>
          <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <InputField
                  label='First Name*'
                  value={formData[index]?.firstname || ''}
                  onChangeText={(val) => handleInputChange(index, 'firstname', val)}
                  placeholder=''
                  placeholderTextColor="#949494"
                  keyboardType="default"
                  showCountryCode={false}
                  maxlength={100}
                  editable={index !== 0}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <InputField
                  label='Last Name*'
                  value={formData[index]?.lastname || ''}
                  onChangeText={(val) => handleInputChange(index, 'lastname', val)}
                  placeholder=''
                  placeholderTextColor="#949494"
                  keyboardType="default"
                  showCountryCode={false}
                  maxlength={100}
                  editable={index !== 0}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <InputField
                  label='Email ID*'
                  value={formData[index]?.emailad || ''}
                  onChangeText={(val) => {
                    handleInputChangeeamilad(index, 'emailad', val);
                    handleInputChange(index, 'emailad', val);
                    handleInputChanged(index, 'emailad', val);
                  }}
                  placeholder=''
                  placeholderTextColor="#949494"
                  keyboardType="default"
                  showCountryCode={false}
                  maxlength={100}
                  editable={index === 0 ? !!allmsg : true}
                />
              </View>
            </View>
            {errorFlags[index]?.emailad && isEmailTouched[index] && <View style={{ marginLeft: normalize(0), bottom: normalize(10) }}>
              {errorFlags[index]?.emailad && <Text style={{ color: '#FF0000', fontFamily: Fonts.InterMedium, fontSize: 12 }}>{errorFlags[index].emailad}</Text>}
            </View>}
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <CustomInputTouchable
                  label={"Profession*"}
                  value={formData[index]?.professionad || ''}
                  placeholder={""}
                  placeholderTextColor="#949494"
                  rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                  onPress={() => professionTrack(index)}
                  onIconpres={() => professionTrack(index)}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <CustomInputTouchable
                  label={"Medical License State*"}
                  value={formData[index]?.medicallics || ''}
                  placeholder={""}
                  placeholderTextColor="#949494"
                  rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                  onPress={() => medicalState(index)}
                  onIconpres={() => medicalState(index)}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <CustomInputTouchableY
                  label={"Speciality*"}
                  value={formData[index]?.speciality?.length > 0 ? '' : ""}
                  placeholder={""}
                  placeholderTextColor="#949494"
                  rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                  onPress={() => fetchSpecialities(index)}
                  onIconpres={() => fetchSpecialities(index)}
                  chipData={index}
                  index={index}
                  formData={formData}
                >
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: normalize(300),
                    // marginBottom: normalize(10),
                  }}>
                    {formData[index]?.speciality_ids?.map((id, i) => (
                      <View key={id} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#E0E0E0',
                        padding: normalize(5),
                        marginRight: normalize(5),
                        marginBottom: normalize(5),
                        borderRadius: normalize(5),
                      }}>
                        <Text style={{ fontSize: normalize(12), color: '#000', marginRight: normalize(5) }}>
                          {formData[index].speciality.split(', ')[i]}
                        </Text>
                        <TouchableOpacity style={{ height: normalize(20), width: normalize(20), justifyContent: "center", alignItems: "center" }} onPress={() => removeSpeciality(index, id)}>
                          <Icon name="close" size={15} color="#000" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </CustomInputTouchableY>
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <InputField
                  label='NPI Number'
                  value={formData[index]?.npino || ''}
                  onChangeText={(val) => handleInputChange(index, 'npino', val)}
                  placeholder=""
                  placeholderTextColor="#949494"
                  keyboardType="default"
                  showCountryCode={false}
                  maxlength={10}
                />
              </View>
            </View>
            {errors[index] && (
              <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                <Text
                  style={{
                    fontFamily: Fonts.InterRegular,
                    fontSize: 12,
                    color: 'red',
                  }}>
                  {"Please enter a valid 10 digit NPI Number"}
                </Text>
              </View>
            )}
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <InputField
                  label='License Number*'
                  value={formData[index]?.license_number || ''}
                  onChangeText={(val) => handleInputChange(index, 'license_number', val)}
                  placeholder=""
                  placeholderTextColor="#949494"
                  keyboardType="default"
                  showCountryCode={false}
                  maxlength={10}
                />
              </View>
            </View>
            {custom_fieldsTake && custom_fieldsTake.length > 0 && custom_fieldsTake.map((field, openIndx) => (
              <View key={`${index}-${openIndx}`}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  {field.field_type === "text" && (
                    <View style={{
                      flexDirection: 'row',
                      flex: 1
                    }}>
                      <View style={{
                        flex: 1,
                        paddingRight: normalize(0)
                      }}>
                        <InputField
                          label={field.required === "1" ? `${field?.field_label}*` : field?.field_label}
                          value={formData[index]?.[field.field_name] || ''}
                          onChangeText={(val) => handleInputChange(index, field.field_name, val)}
                          placeholder={""}
                          placeholderTextColor="#949494"
                          keyboardType="default"
                          showCountryCode={false}
                          maxlength={100}
                        />
                      </View>
                    </View>
                  )}
                </View>
                {field.field_type === "radio" && field.options && (
                  <View>
                    <Text style={{ fontSize: 14, fontFamily: Fonts.InterRegular, color: "#999999", }}>
                      {field?.required == 1 ? `${field.field_label}*` : field.field_label}
                    </Text>
                    <View style={{ paddingHorizontal: normalize(5), paddingVertical: normalize(5) }}>
                      {Object.entries(JSON.parse(field.options)).map(([key, value]) => (
                        <TouchableOpacity
                          key={key}
                          onPress={() => handleInputChange(index, field.field_name, value)}
                          style={{ flexDirection: "row", alignItems: "center", margin: normalize(5) }}
                        >
                          <View
                            style={{
                              height: normalize(15),
                              width: normalize(15),
                              borderRadius: normalize(10),
                              borderWidth: 1,
                              borderColor: formData[index]?.[field.field_name] === value ? "green" : "#000",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: 5,
                            }}
                          >
                            {formData[index]?.[field.field_name] === value && (
                              <View style={{ height: normalize(8), width: normalize(8), borderRadius: normalize(8), backgroundColor: "green" }} />
                            )}
                          </View>
                          <Text style={{ fontSize: 14, fontFamily: Fonts.InterRegular, color: "#999999", alignSelf: "center" }}>
                            {value}
                          </Text>
                        </TouchableOpacity>
                      ))}

                    </View>
                  </View>
                )}
                <View key={field.id} style={{ justifyContent: "center", alignItems: "center" }}>
                  {field.field_type === "textarea" && (
                    <View style={{
                      flexDirection: 'row',
                      flex: 1
                    }}>
                      <View style={{
                        flex: 1,
                        paddingRight: normalize(0)
                      }}>
                        <InputField
                          label={field.required === "1" ? `${field?.field_label}*` : field?.field_label}
                          value={formData[index]?.[field.field_name] || ''}
                          onChangeText={(val) => handleInputChange(index, field.field_name, val)}
                          placeholder={""}
                          placeholderTextColor="#949494"
                          keyboardType="default"
                          showCountryCode={false}
                          maxlength={500}
                          multiline={true}
                        />
                      </View>
                    </View>
                  )}
                </View>

                {/* File Upload */}
                {field.field_type === "file" && (
                  <View style={{
                    flexDirection: 'row',
                    flex: 1
                  }}>
                    <View style={{
                      flex: 1,
                      paddingRight: normalize(0)
                    }}>
                      <CustomInputTouchable
                        label={field.required === "1" ? `${field?.field_label.charAt(0).toUpperCase() + field?.field_label.slice(1)}* (Allowed Format: PDF, DOCX)` : `${field?.field_label.charAt(0).toUpperCase() + field?.field_label.slice(1)} (Allowed Format: PDF, DOCX)`}
                        value={formData[index]?.[field.field_name]?.uri ? formData[index]?.[field.field_name]?.uri.split('/').pop().replace(/-/g, '').slice(-16) : ''}
                        placeholder={""}
                        placeholderTextColor="#949494"
                        rightIcon={formData[index]?.[field.field_name]?.uri ? <FileIcn name="delete" size={25} color="#949494" /> : <FileIcn name="file-multiple-outline" size={25} color="#949494" />}
                        onPress={() => btnClick_galeryUpload(index, field.field_name)}
                        onIconpres={() => {
                          if (formData[index]?.[field.field_name]?.uri) {
                            const updatedFormData = [...formData];
                            delete updatedFormData[index][field.field_name];
                            if (Object.keys(updatedFormData[index]).length == 0) {
                              updatedFormData.splice(index, 1);
                            }
                            setFormData(updatedFormData);
                          }
                        }}
                      />
                    </View>
                  </View>

                )}
                {field.field_type === "date" && (
                  <View>
                    <View style={{
                      flexDirection: 'row',
                      flex: 1
                    }}>
                      <View style={{
                        flex: 1,
                        paddingRight: normalize(0)
                      }}>
                        <CustomInputTouchable
                          label={field.required === "1" ? `${field?.field_label}*` : field?.field_label}
                          value={formData[index]?.[field.field_name]
                            ? new Date(formData[index][field.field_name]).toLocaleDateString()
                            : (field.required === "1" ? `${field.field_label}*` : field.field_label)}
                          placeholder={""}
                          placeholderTextColor="#949494"
                          rightIcon={<CalenderIcon name="calendar" size={25} color="#949494" />}
                          onPress={() => openDatePicker(index, field.field_name)}
                          onIconpres={() => openDatePicker(index, field.field_name)}
                        />
                      </View>
                    </View>
                    <DateTimePickerModal
                      isVisible={datePickerState.visible && datePickerState.index === index && datePickerState.fieldName === field.field_name}
                      minimumDate={new Date(1900, 0, 1)}
                      mode="date"
                      date={formData[index]?.[field.field_name] ? new Date(formData[index][field.field_name]) : new Date()}
                      maximumDate={new Date()}
                      onConfirm={val => handleDateSelect(val, index, field.field_name)}
                      onCancel={closeDatePicker}
                      textColor="black"
                    />
                  </View>
                )}

                {field.field_type === "dropdown" && (
                  <View>
                    <View style={{
                      flexDirection: 'row',
                      flex: 1,
                      top: normalize(10)
                    }}>
                      <View style={{
                        flex: 1,
                        paddingRight: normalize(0)
                      }}>
                        <CustomInputTouchable
                          label={field.required === "1" ? `${field?.field_label}*` : field?.field_label}
                          value={formData[index]?.[field.field_name] || (field.required === "1" ? `${field.field_label}*` : field.field_label)}
                          placeholder={""}
                          placeholderTextColor="#949494"
                          rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                          onPress={() => setDropdownModal({ visible: true, index, fieldName: field.field_name, options: JSON.parse(field.options) })}
                          onIconpres={() => setDropdownModal({ visible: true, index, fieldName: field.field_name, options: JSON.parse(field.options) })}
                        />
                      </View>
                    </View>
                    <Modal
                      visible={dropdownModal.visible && dropdownModal.index === index && dropdownModal.fieldName === field.field_name}
                      transparent={true}
                      animationType="slide"
                      onRequestClose={() => setDropdownModal({ visible: false, index: null, fieldName: null, options: null })}
                    >
                      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(252, 251, 251, 0.5)' }}>
                        <View style={{
                          backgroundColor: 'white',
                          // borderTopLeftRadius: 16,
                          // borderTopRightRadius: 16,
                          padding: normalize(16),
                          height: normalize(200),
                          // borderWidth:0.6,
                          // borderColor:"#949494"
                          // maxHeight: '50%'
                        }}>
                          <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: normalize(16)
                          }}>
                            <Text style={{
                              fontSize: 18,
                              fontFamily: Fonts.InterRegular,
                              fontWeight: 'bold',
                              color: '#000000'
                            }}>
                              {field.field_label}
                            </Text>
                            <TouchableOpacity
                              onPress={() => setDropdownModal({ visible: false, index: null, fieldName: null, options: null })}
                            >
                              <Text style={{
                                fontSize: 16,
                                fontFamily: Fonts.InterRegular,
                                color: '#007AFF'
                              }}>
                                Done
                              </Text>
                            </TouchableOpacity>
                          </View>

                          <FlatList
                            data={Object.entries(dropdownModal.options || {})}
                            keyExtractor={(item) => item[0]}
                            renderItem={({ item }) => {
                              const [key, value] = item;
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    handleInputChange(index, field.field_name, value);
                                    setDropdownModal({ visible: false, index: null, fieldName: null, options: null });
                                  }}
                                  style={{
                                    paddingVertical: normalize(12),
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#f0f0f0'
                                  }}
                                >
                                  <Text style={{
                                    fontSize: 16,
                                    fontFamily: Fonts.InterRegular,
                                    color: formData[index]?.[field.field_name] === value ? 'green' : '#000000'
                                  }}>
                                    {value}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }}
                          />
                        </View>
                      </View>
                    </Modal>
                  </View>
                )}
                {/* Checkbox */}
                {/* onPress={() => handleCheckboxChange(index, field.field_name, value)} */}
                {field.field_type === "checkbox" && field.options && (
                  <View>
                    <Text style={{
                      fontSize: 14,
                      // fontWeight: "bold",
                      fontFamily: Fonts.InterRegular,
                      color: "#999999"
                    }}>
                      {field.required == "1"
                        ? `${field?.field_label}*`
                        : field?.field_label}
                    </Text>
                    {Object.entries(JSON.parse(field.options)).map(([key, value]) => (
                      <View key={key} style={{ flexDirection: "row", paddingHorizontal: normalize(10) }}>
                        <View style={{ flexDirection: "row", gap: normalize(10) }}>
                          {/* Checkbox */}
                          <TouchableOpacity onPress={() => handleCheckboxChange(index, field.field_name, value)}>
                            {formData[index]?.[field.field_name]?.includes(value) ? (
                              <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: Colorpath.ButtonColr,
                                borderColor: Colorpath.ButtonColr,
                                height: normalize(15),
                                width: normalize(15),
                                borderRadius: normalize(5),
                                marginTop: normalize(5),
                                borderWidth: normalize(0.5)
                              }}>
                                <TickMark name="checkmark" color={Colorpath.white} size={15} />
                              </View>
                            ) : (
                              <View style={{
                                height: normalize(15),
                                width: normalize(15),
                                borderColor: Colorpath.black,
                                borderRadius: normalize(5),
                                marginTop: normalize(5),
                                borderWidth: normalize(0.5)
                              }} />
                            )}
                          </TouchableOpacity>

                          {/* Label */}
                          <View style={{ flexDirection: "row", paddingVertical: normalize(5) }}>
                            <TouchableOpacity onPress={() => handleCheckboxChange(index, field.field_name, value)}>
                              <Text style={{
                                fontFamily: Fonts.InterRegular,
                                fontSize: 14,
                                color: "#999999"
                              }}>
                                {value}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

              </View>
            ))}
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <CustomInputTouchable
                  label={'License Expiry Date*'}
                  value={formData[index]?.license_expiry_date && moment(formData[index]?.license_expiry_date, "YYYY-MM-DD", true).isValid()
                    ? moment(formData[index]?.license_expiry_date).format("MM-DD-YYYY")
                    : "" || ''}
                  placeholder={''}
                  placeholderTextColor="#949494"
                  rightIcon={<CalenderIcon name="calendar" size={25} color="#949494" />}
                  onPress={() => DatePick(index)}
                  onIconpres={() => DatePick(index)}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Animated.Text style={getLabelStyle(index)}>
                  {"Contact Address*"}
                </Animated.Text>

                <GooglePlacesAutocomplete
                  key={index}
                  placeholder={isFieldFocused[index] || formData[index]?.address ? "" : "Contact Address*"}
                  onPress={(data, details = null) => {
                    handlePlaceSelected(data, details, index);
                    setIndAd(index);
                  }}
                  fetchDetails={true}
                  styles={{ textInput: [{ paddingHorizontal: 2 }] }}
                  query={{
                    key: GOOGLE_API_KEY,
                    language: 'en',
                  }}
                  textInputProps={{
                    multiline: true,
                    value: formData[index]?.address || '',
                    onChangeText: (val) => {
                      handleInputChange(index, 'address', val);
                      ensureAnimatedValue(index);
                      const shouldBeUp = !!val;
                      animatedValues[index].setValue(shouldBeUp ? 1 : 0);
                    },
                    onFocus: () => handleFocus(index),
                    onBlur: () => handleBlur(index),
                    placeholderTextColor: '#999999',
                  }}
                  debounce={300}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <CustomInputTouchable
                  label={"Country*"}
                  value={formData[index]?.country || ''}
                  placeholder={""}
                  placeholderTextColor="#949494"
                  rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                  onPress={() => countryPick(index)}
                  onIconpres={() => countryPick(index)}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <CustomInputTouchable
                  label={"State*"}
                  value={formData[index]?.state || ''}
                  placeholder={""}
                  placeholderTextColor="#949494"
                  rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                  onPress={() => statePick(index)}
                  onIconpres={() => statePick(index)}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <CustomInputTouchable
                  label={"City*"}
                  value={formData[index]?.city || ''}
                  placeholder={""}
                  placeholderTextColor="#949494"
                  rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                  onPress={() => cityPick(index)}
                  onIconpres={() => cityPick(index)}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <InputField
                  label='Zipcode*'
                  value={formData[index]?.zipcode || ''}
                  onChangeText={(val) => handleInputChange(index, 'zipcode', val)}
                  placeholder=''
                  placeholderTextColor="#949494"
                  keyboardType="default"
                  showCountryCode={false}
                  maxlength={6}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <InputField
                  label="Cell Number*"
                  value={formData[index]?.cellno || ''}
                  onChangeText={(val) => {
                    const isUSA = formData[index]?.dialcode == '+1' ||
                      formData[index]?.dialcode == '1';
                    const formattedVal = formatPhoneNumber(val, isUSA);
                    handleInputChange(index, 'cellno', formattedVal);
                    handleInputChanged(index, 'cellno', formattedVal);
                  }}
                  placeholder=""
                  placeholderTextColor="#949494"
                  keyboardType="phone-pad"
                  showCountryCode={true}
                  countryCode={formData[index]?.dialcode ? (formData[index]?.dialcode.startsWith('+') ? formData[index]?.dialcode : `+${formData[index]?.dialcode}`) : ''}
                  maxlength={formData[index]?.dialcode == '+1' ||
                    formData[index]?.dialcode == '1' ? 14 : 15}
                />
              </View>
            </View>
            {errorFlags[index]?.cellno && isCellNoTouched[index] && <View style={{ marginLeft: normalize(0), bottom: normalize(10) }}>
              {errorFlags[index]?.cellno && <Text style={{ color: '#FF0000', fontFamily: Fonts.InterMedium, fontSize: 12 }}>{errorFlags[index].cellno}</Text>}
            </View>}
            {iseMededDo && <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <CustomInputTouchable
                  label={'Date of Birth*'}
                  value={formData[index]?.dateofbirth && moment(formData[index]?.dateofbirth, "YYYY-MM-DD", true).isValid()
                    ? moment(formData[index]?.dateofbirth).format("MM-DD-YYYY")
                    : "" || ''}
                  placeholder={''}
                  placeholderTextColor="#949494"
                  rightIcon={<CalenderIcon name="calendar" size={25} color="#949494" />}
                  onPress={() => DobPick(index)}
                  onIconpres={() => DobPick(index)}
                />
              </View>
            </View>}
          </View>
          {/* <View style={{ alignItems: 'center' }}>
            <View
              style={{
                borderBottomColor: '#000000',
                borderBottomWidth: 0.5,
                marginTop: normalize(5)
              }}>
              <TextFieldIn
                value={formData[index]?.professionad || ''}
                onChangeText={(val) => handleInputChange(index, 'professionad', val)}
                height={normalize(50)}
                width={normalize(300)}
                backgroundColor={Colorpath.white}
                color={"#000000"}
                placeholder="Profession*"
                placeholderTextColor="#AAAAAA"
                fontSize={16}
                fontFamily={Fonts.InterRegular}
              />
            </View>
          </View> */}
        </>}
      </View>
    ));
  };

  const billingForms = () => {
    const totalQuantity = 1
    return Array.from({ length: totalQuantity }, (_, index) => (
      <View key={index} style={{ flex: 1 }}>
        <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }}>
          <Text style={{ fontSize: 18, fontFamily: Fonts.InterSemiBold, color: "#000000", textAlign: 'center', paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
            {`Billing Information`}
          </Text>
          {/* <TouchableOpacity onPress={() => toggleExpand(index)} style={{ paddingVertical: normalize(10), marginRight: normalize(10) }}>
            <ArrowIcon name={expandedSections[index] ? "keyboard-arrow-up" : "keyboard-arrow-down"} color={"#000000"} size={30} />
          </TouchableOpacity> */}
        </TouchableOpacity>
        <View style={{ height: 0.8, width: normalize(300), backgroundColor: "#999999", alignSelf: "center" }} />
        {expandedSections[index] && <>
          <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <InputField
                  label='First Name*'
                  value={formData[index]?.firstname || ''}
                  onChangeText={(val) => handleInputChange(index, 'firstname', val)}
                  placeholder=''
                  placeholderTextColor="#949494"
                  keyboardType="default"
                  showCountryCode={false}
                  maxlength={100}
                  editable={index !== 0}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <InputField
                  label='Last Name*'
                  value={formData[index]?.lastname || ''}
                  onChangeText={(val) => handleInputChange(index, 'lastname', val)}
                  placeholder=''
                  placeholderTextColor="#949494"
                  keyboardType="default"
                  showCountryCode={false}
                  maxlength={100}
                  editable={index !== 0}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <InputField
                  label='Email ID*'
                  value={formData[index]?.emailad || ''}
                  onChangeText={(val) => {
                    handleInputChangeeamilad(index, 'emailad', val);
                    handleInputChange(index, 'emailad', val);
                    handleInputChanged(index, 'emailad', val);
                  }}
                  placeholder=''
                  placeholderTextColor="#949494"
                  keyboardType="default"
                  showCountryCode={false}
                  maxlength={100}
                  editable={index === 0 ? !!allmsg : true}
                />
              </View>
            </View>
            {errorFlags[index]?.emailad && isEmailTouched[index] && <View style={{ marginLeft: normalize(0), bottom: normalize(10) }}>
              {errorFlags[index]?.emailad && <Text style={{ color: '#FF0000', fontFamily: Fonts.InterMedium, fontSize: 12 }}>{errorFlags[index].emailad}</Text>}
            </View>}
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Animated.Text style={getLabelStyle(index)}>
                  {"Contact Address*"}
                </Animated.Text>

                <GooglePlacesAutocomplete
                  key={index}
                  placeholder={isFieldFocused[index] || formData[index]?.address ? "" : "Contact Address*"}
                  onPress={(data, details = null) => {
                    handlePlaceSelected(data, details, index);
                    setIndAd(index);
                  }}
                  fetchDetails={true}
                  styles={{ textInput: [{ paddingHorizontal: 2 }] }}
                  query={{
                    key: GOOGLE_API_KEY,
                    language: 'en',
                  }}
                  textInputProps={{
                    multiline: true,
                    value: formData[index]?.address || '',
                    onChangeText: (val) => {
                      handleInputChange(index, 'address', val);
                      ensureAnimatedValue(index);
                      const shouldBeUp = !!val;
                      animatedValues[index].setValue(shouldBeUp ? 1 : 0);
                    },
                    onFocus: () => handleFocus(index),
                    onBlur: () => handleBlur(index),
                    placeholderTextColor: '#999999',
                  }}
                  debounce={300}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <CustomInputTouchable
                  label={"Country*"}
                  value={formData[index]?.country || ''}
                  placeholder={""}
                  placeholderTextColor="#949494"
                  rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                  onPress={() => countryPick(index)}
                  onIconpres={() => countryPick(index)}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <CustomInputTouchable
                  label={"State*"}
                  value={formData[index]?.state || ''}
                  placeholder={""}
                  placeholderTextColor="#949494"
                  rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                  onPress={() => statePick(index)}
                  onIconpres={() => statePick(index)}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <CustomInputTouchable
                  label={"City*"}
                  value={formData[index]?.city || ''}
                  placeholder={""}
                  placeholderTextColor="#949494"
                  rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                  onPress={() => cityPick(index)}
                  onIconpres={() => cityPick(index)}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <InputField
                  label='Zipcode*'
                  value={formData[index]?.zipcode || ''}
                  onChangeText={(val) => handleInputChange(index, 'zipcode', val)}
                  placeholder=''
                  placeholderTextColor="#949494"
                  keyboardType="default"
                  showCountryCode={false}
                  maxlength={6}
                />
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              flex: 1
            }}>
              <View style={{
                flex: 1,
                paddingRight: normalize(0)
              }}>
                <InputField
                  label="Cell Number*"
                  value={formData[index]?.cellno || ''}
                  onChangeText={(val) => {
                    const isUSA = formData[index]?.dialcode == '+1' ||
                      formData[index]?.dialcode == '1';
                    const formattedVal = formatPhoneNumber(val, isUSA);
                    handleInputChange(index, 'cellno', formattedVal);
                    handleInputChanged(index, 'cellno', formattedVal);
                  }}
                  placeholder=""
                  placeholderTextColor="#949494"
                  keyboardType="phone-pad"
                  showCountryCode={true}
                  countryCode={formData[index]?.dialcode ? (formData[index]?.dialcode.startsWith('+') ? formData[index]?.dialcode : `+${formData[index]?.dialcode}`) : ''}
                  maxlength={formData[index]?.dialcode == '+1' ||
                    formData[index]?.dialcode == '1' ? 14 : 15}
                />
              </View>
            </View>
            {errorFlags[index]?.cellno && isCellNoTouched[index] && <View style={{ marginLeft: normalize(0), bottom: normalize(10) }}>
              {errorFlags[index]?.cellno && <Text style={{ color: '#FF0000', fontFamily: Fonts.InterMedium, fontSize: 12 }}>{errorFlags[index].cellno}</Text>}
            </View>}
          </View>
        </>}
      </View>
    ));
  };
  return (<>
    {conn == false ? <IntOff /> : <ScrollView keyboardShouldPersistTaps="handled">
      {spanroute?.cartData ? <View style={{ paddingBottom: normalize(10) }}>
        {billingForms()}
      </View> : <View style={{ paddingBottom: normalize(10) }}>
        {renderForms()}
      </View>}
    </ScrollView>}
  </>

  );
};


export default CheckoutInputbox;
