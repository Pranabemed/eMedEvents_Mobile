import { View, Text, Platform, TouchableOpacity, ScrollView, Alert, FlatList, PermissionsAndroid, Linking } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import CustomTextField from '../../Components/CustomTextfiled'
import TextFieldIn from '../../Components/Textfield';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../../Themes/Fonts';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import CalenderIcon from 'react-native-vector-icons/Feather';
import Buttons from '../../Components/Button';
// import Geolocation from '@react-native-community/geolocation';
// import Geocoder from 'react-native-geocoding';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { getCountryCallingCode } from 'libphonenumber-js';
import { cityRequest, countryRequest, specializationRequest, stateRequest } from '../../Redux/Reducers/AuthReducer'
import showErrorAlert from '../../Utils/Helpers/Toast'
import connectionrequest from '../../Utils/Helpers/NetInfo'
import ProfileSpeciality from '../Profile/ProfileSpecialty'
import { useDispatch, useSelector } from 'react-redux'
import { searchStateNameFunction } from '../DetailsPageWebcast/SearchStatename';
import Modal from 'react-native-modal';
import { styles } from '../Specialization/SpecialStyle'
import CheckThreeCity from '../DetailsPageWebcast/CheckoutModalFourth'
import CheckStateShow from '../DetailsPageWebcast/CheckoutModalthree'
import ChecktwoCountry from '../DetailsPageWebcast/CheckoutModaltwo'
import { searchCityNameFunction } from '../DetailsPageWebcast/SearchCityName'
import { searchStateNamePraticeFunction } from '../DetailsPageWebcast/SearchStateNamePratice'
import { searchCountryNameFunction } from '../DetailsPageWebcast/SearchCountryname';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment'
import Snackbar from 'react-native-snackbar'
import { contactusSpeakerRequest } from '../../Redux/Reducers/TransReducer'
import Loader from '../../Utils/Helpers/Loader'
import Geolocation from 'react-native-geolocation-service';
import ChecktwoCountryNew from '../DetailsPageWebcast/CheckCountryNew'
import InputField from '../../Components/CellInput'
import CustomInputTouchable from '../../Components/IconTextIn'
import DropdownIcon from 'react-native-vector-icons/Entypo';
import CustomInputTouchableX from '../Profile/CustomInputTouchableX'

const GOOGLE_API_KEY = 'AIzaSyBDnBivN-fdP6JxOcQFIyvhxIJSArru6Nk';
// Geocoder.init(GOOGLE_API_KEY);
let status = "";
let status1 = "";
const ContactUs = (props) => {
    const isFoucus = useIsFocused();
    const contactUsPage = () => {
        props.navigation.goBack();
    }
    const conf_Type = [{ id: 0, name: "In-Person" }, { id: 1, name: "Virtual" }, { id: 2, name: "In-Person & Virtual" }];
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const TransReducer = useSelector(state => state.TransReducer);
    const [confname, setConfname] = useState("");
    const [confget, setConfget] = useState(false);
    const [confformat, setConfformat] = useState("");
    const [country_cont, setCountry_cont] = useState("");
    const [state_cont, setState_cont] = useState("");
    const [city_cont, setCity_cont] = useState("");
    const [startdate, setStartdate] = useState("");
    const [enddate, setEnddate] = useState("");
    const [organ_name, setOrgan_name] = useState("");
    const [contact_name, setContact_name] = useState("");
    const [email_cont, setEmail_cont] = useState("");
    const [mob_cont, setMob_cont] = useState("");
    const [speaker_cont, setSpeaker_cont] = useState("");
    const [slist, setSlist] = useState('');
    const [selectState, setSelectState] = useState([]);
    const [statepicker, setstatepicker] = useState(false);
    const [searchState, setSearchState] = useState('');
    const [selectedSpecialities, setSelectedSpecialities] = useState([]);
    const [previousSpec, setPreviousSpec] = useState("");
    const [speciality_id, setSpeciality_id] = useState([]);
    const [speciality, setSpeciality] = useState("");
    const [formData, setFormData] = useState({});
    const [countryall, setCountryall] = useState('');
    const [countryshow, setCountryshow] = useState([]);
    const [countrypicker, setCountrypicker] = useState(false);
    const [searchcountry, setSearchcountry] = useState('');
    const [searchpratice, setSearchpratice] = useState('');
    const [pratice, setPratice] = useState(false);
    const [state_id, setState_id] = useState("");
    const [city_id, setCity_id] = useState("");
    const [cityAll, setCityAll] = useState('');
    const [cityshow, setCityshow] = useState([]);
    const [searchcity, setSearchcity] = useState('');
    const [cityPicker, setCityPicker] = useState(false);
    const [selectStatepratice, setSelectStatepratice] = useState([]);
    const [slistpratice, setSlistpratice] = useState('');
    const [statelistpratice, setStatelistpratice] = useState([]);
    const [country_id, setCountry_id] = useState("");
    const [countryCode, setCountryCode_cont] = useState('');
    const [phoneCountryCode, setPhoneCountryCode] = useState('');
    const [countryNew, setCountryNew] = useState("");
    const [statenew, setStatenew] = useState("");
    const [citynew, setCitynew] = useState("");
    const [startdatepick, setStartdatepick] = useState(false);
    const [enddatepick, setEnddatepick] = useState(false);
    const [getAcc, setGetAcc] = useState(false);
    const [newmob, setNewmob] = useState("");
    const [mobileHd, setMobileHd] = useState("");
    const [speids, setSpeids] = useState("");
    const countryReq = () => {
        connectionrequest()
            .then(() => {
                dispatch(countryRequest())
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    useEffect(() => {
        setConfformat(conf_Type?.[0]?.name);
    }, [])

    const specaillized = () => {
        const obj = { "master": "" }
        connectionrequest()
            .then(() => {
                dispatch(specializationRequest(obj));
            })
            .catch(err => {
                console.log(err);
                showErrorAlert('Please connect to Internet');
            });
    }
    useEffect(() => {
        specaillized();
        countryReq()
    }, [])
    const PraticingState = (index) => {
        connectionrequest()
            .then(() => {
                dispatch(stateRequest(index)); // Dispatch the API call with the country_id
            })
            .catch(err => {
                // Handle the error, maybe log it or show an alert
                showErrorAlert('Please connect to Internet', err);
            });
    };
    const handleSearch = (text) => {
        searchStateNameFunction(text, selectState, setSlist, setSearchState, (filteredList, searchText) => {
            console.log('Filtered Data:', filteredList, 'Search Text:', searchText);
        });
    };
    const handleCountry = (text) => {
        searchCountryNameFunction(text, countryshow, setCountryall, setSearchcountry, (countryfil, searchcount) => {
            console.log('countryfil Data:', countryfil, 'Search Text:', searchcount);
        })
    }
    const handlePratice = (text) => {
        searchStateNamePraticeFunction(text, selectStatepratice, setSlistpratice, setSearchpratice, (praticefil, praticetxtcount) => {
            console.log('countryfil Data:', praticefil, 'Search Text:', praticetxtcount);
        })
    }
    const handleCity = (text) => {
        searchCityNameFunction(text, cityshow, setCityAll, setSearchcity, (cityfill, citycountname) => {
            console.log('countryfil Data:', cityfill, 'Search Text:', citycountname);
        })
    }
    const handleSpecialitySelect = (selectedItems, formData) => {
        // Create a copy of the formData to avoid direct mutation
        const updatedForm = [...formData];
        // Extract selected names and IDs
        const selectedSpecialitiesNames = selectedItems.map(item => item?.name).join(', ');
        const selectedSpecialityIds = selectedItems.map(item => item?.id);

        // Update each entry in the form data
        updatedForm.forEach((entry) => {
            entry.speciality = selectedSpecialitiesNames;
            entry.speciality_ids = selectedSpecialityIds;
        });

        setFormData(updatedForm);
        setstatepicker(false);
        setSearchState("");
        setSelectedSpecialities([]);
    };

    const handleSpecialityChange = (selectedSpecialities, selectedIds) => {
        console.log(selectedSpecialities, selectedIds, "selectedIds============");
        let updatedFormData = formData || { speciality_ids: [], speciality: '' };
        const uniqueSpecialities = [...new Set(selectedSpecialities)];
        const uniqueIds = [...new Set(selectedIds)];
        const specialityString = uniqueSpecialities.join(', ').trim();
        updatedFormData = {
            ...updatedFormData,
            speciality: specialityString,
            speciality_ids: uniqueIds
        };
        setFormData(updatedFormData); // Update state
    };
    const removeSpeciality = (specialityId) => {
        const currentSpecialityIds = formData?.speciality_ids || [];
        const currentSpecialities = formData?.speciality?.split(', ') || [];
        const updatedSpecialityIds = currentSpecialityIds.filter(id => id !== specialityId);
        const updatedSpecialityNames = currentSpecialities.filter((_, index) => currentSpecialityIds[index] !== specialityId);
        handleSpecialityChange(updatedSpecialityNames, updatedSpecialityIds);
    };

    useEffect(() => {
        if (props?.route?.params?.makeIt?.specialities_All) {
            const specialtiesArray = props?.route?.params?.makeIt?.specialities_All && props?.route?.params?.makeIt?.specialities_All
                .split(',')
                .map(s => s.trim());
            const specialties = specialtiesArray.map((name, index) => ({
                id: String(index + 1),
                name: name,
            }));
            console.log(specialties, "specialties00000001222");
            const namesString = specialties.map(specialty => specialty.name).join(', ');
            const ids = specialties.map(specialty => specialty.id);

            setSpeciality(namesString);
            setSpeciality_id(ids);
            setPreviousSpec(specialties);
        }
    }, [props?.route?.params?.makeIt]);
    console.log(speciality, "initialFormData----------", speciality_id, formData, props?.route?.params?.makeIt);
    const memoizedSetFormData = useCallback((data) => setFormData(data), [setFormData]);
    useEffect(() => {
        if (speciality && speciality_id) {
            const initialFormData = {
                speciality: speciality || '',
                speciality_ids: Array.isArray(speciality_id) ? speciality_id : [],
            };
            console.log(initialFormData, "initialFormData----------");
            memoizedSetFormData(initialFormData);
        }
    }, [speciality, speciality_id, memoizedSetFormData]);
    const cityReq = (itid) => {
        connectionrequest()
            .then(() => {
                dispatch(cityRequest(itid));
            })
            .catch(err => {
                // console.log(err);
                showErrorAlert('Please connect to Internet', err);
            });
    }

    const normalizeCountryName = (country) => {
        // Normalize country names to align with entries in countryall
        const countryMap = {
            "United States": "United States of America",
            // Add more mappings as needed
        };
        return countryMap[country] || country;
    };

    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/specializationRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/specializationSuccess':
                status = AuthReducer.status;
                setSelectState(AuthReducer?.specializationResponse?.specialities);
                setSlist(AuthReducer?.specializationResponse?.specialities);
                break;
            case 'Auth/specializationFailure':
                status = AuthReducer.status;
                break;
            case 'Auth/countryRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/countrySuccess':
                status = AuthReducer.status;
                setCountryshow(AuthReducer?.countryResponse?.countries);
                setCountryall(AuthReducer?.countryResponse?.countries);
                break;
            case 'Auth/countryFailure':
                status = AuthReducer.status;
                break;
            case 'Auth/stateRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/stateSuccess':
                status = AuthReducer.status;
                setStatelistpratice(AuthReducer?.stateResponse?.states);
                setSelectStatepratice(AuthReducer?.stateResponse?.states);
                setSlistpratice(AuthReducer?.stateResponse?.states);
                break;
            case 'Auth/stateFailure':
                status = AuthReducer.status;
                break;
            case 'Auth/cityRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/citySuccess':
                status = AuthReducer.status;
                setCityAll(AuthReducer?.cityResponse?.cities);
                setCityshow(AuthReducer?.cityResponse?.cities);
                break;
            case 'Auth/cityFailure':
                status = AuthReducer.status;
                break;
        }
    }
    console.log(countryall, countryshow, "sfdgdjsgdsj-------")
    useEffect(() => {
        getCurrentLocation();
    }, [countryall, countryshow])
    // const getCurrentLocationd = async () => {
    //     try {
    //         const position = await new Promise((resolve, reject) => {
    //             Geolocation.getCurrentPosition(resolve, reject, {
    //                 enableHighAccuracy: true,
    //                 timeout: 15000,
    //                 maximumAge: 10000
    //             });
    //         });
    //         const { latitude, longitude } = position.coords;
    //         const geoData = await Geocoder.from(latitude, longitude);
    //         if (geoData?.results?.length > 0) {
    //             const address = geoData.results[0];
    //             const components = address.address_components;

    //             const getComponent = (types) => {
    //                 const component = components.find(c => types.some(t => c.types.includes(t)));
    //                 return component?.long_name || '';
    //             };
    //             const country = getComponent(['country']);
    //             if (countryall) {
    //                 const normalizedCountry = normalizeCountryName(country);
    //                 const matchedCountry = countryall.find(c => {
    //                     const countryName = c.name.trim().toLowerCase();
    //                     return countryName == normalizedCountry.trim().toLowerCase();
    //                 });
    //                 if (matchedCountry) {
    //                     setCountry_cont(matchedCountry.name);
    //                     setCountry_id(matchedCountry.id);
    //                     PraticingState(matchedCountry?.id);
    //                 } else {
    //                     console.warn(`Country "${country}" not found in country list`);
    //                 }
    //             }
    //             const state = getComponent(['administrative_area_level_1']);
    //             setStatenew(state);
    //             const city = getComponent(['locality', 'administrative_area_level_2', 'postal_town']);
    //             setCitynew(city);
    //             const countryComponent = components.find(c => c.types.includes('country'));
    //             const isoCountryCode = countryComponent?.short_name || '';
    //             setCountryCode_cont(isoCountryCode);
    //             if (isoCountryCode) {
    //                 try {
    //                     const phoneCode = `+${getCountryCallingCode(isoCountryCode)}`;
    //                     setPhoneCountryCode(phoneCode);
    //                 } catch (error) {
    //                     console.warn('Phone code error:', error);
    //                 }
    //             }
    //         }

    //     } catch (error) {
    //         console.error('Location Error:', error);
    //     }
    // };
    const getCurrentLocation = async () => {
        try {
            if (Platform.OS === 'android') {
                const hasPermission = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );

                if (!hasPermission) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Permission',
                            message: 'This app needs location access to detect your country',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        }
                    );
                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        throw { code: 1, message: 'Location permission denied' };
                    }
                }
            }
            if (Platform.OS === 'ios') {
                const status = await Geolocation.requestAuthorization('whenInUse');
                if (status !== 'granted') {
                    throw { code: 1, message: 'Location permission denied' };
                }
            }
            const position = await new Promise((resolve, reject) => {
                let timeoutFallback;
                Geolocation.getCurrentPosition(
                    resolve,
                    (error) => {
                        // Fallback to network-based location on Wi-Fi
                        if (error.code == 3 || error.code == 2) { // TIMEOUT or POSITION_UNAVAILABLE
                            console.log('Trying network-based location...');
                            Geolocation.getCurrentPosition(
                                resolve,
                                (fallbackError) => {
                                    clearTimeout(timeoutFallback);
                                    reject(fallbackError);
                                },
                                {
                                    enableHighAccuracy: false,
                                    timeout: 25000, // Longer timeout for network-based
                                    maximumAge: 0
                                }
                            );
                        } else {
                            reject(error);
                        }
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000
                    }
                );

                // Additional timeout safety
                timeoutFallback = setTimeout(() => {
                    reject({ code: 3, message: 'Final location timeout' });
                }, 40000);
            });

            // 3. Direct Google Geocoding API Call (More Reliable)
            const { latitude, longitude } = position.coords;
            const API_KEY = GOOGLE_API_KEY;
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
            );

            if (!response.ok) throw new Error('Geocoding API failure');

            const geoData = await response.json();
            if (geoData?.results?.length > 0) {
                const address = geoData.results[0];
                const components = address.address_components;

                const getComponent = (types) => {
                    const component = components.find(c => types.some(t => c.types.includes(t)));
                    return component?.long_name || '';
                };
                const country = getComponent(['country']);
                if (countryall) {
                    const normalizedCountry = normalizeCountryName(country);
                    const matchedCountry = countryall.find(c => {
                        const countryName = c.name.trim().toLowerCase();
                        return countryName == normalizedCountry.trim().toLowerCase();
                    });
                    if (matchedCountry) {
                        setCountry_cont(matchedCountry.name);
                        setCountry_id(matchedCountry.id);
                        PraticingState(matchedCountry?.id);
                    } else {
                        console.warn(`Country "${country}" not found in country list`);
                    }
                }
                const state = getComponent(['administrative_area_level_1']);
                setStatenew(state);
                const city = getComponent([
                    'administrative_area_level_2',  // Higher priority first
                    'administrative_area_level_3',
                    'locality',
                    'postal_town',
                    'sublocality_level_1'
                ]);
                console.log(city, "dsfkdk---------", geoData)
                setCitynew(city);
                const countryComponent = components.find(c => c.types.includes('country'));
                const isoCountryCode = countryComponent?.short_name || '';
                setCountryCode_cont(isoCountryCode);
                if (isoCountryCode) {
                    try {
                        const phoneCode = `+${getCountryCallingCode(isoCountryCode)}`;
                        setPhoneCountryCode(phoneCode);
                    } catch (error) {
                        console.warn('Phone code error:', error);
                    }
                }
            }
            console.log(geoData, "geoata----------")
            // 4. Handle Oppo Device Restrictions
            if (!geoData?.results?.length) {
                if (Platform.OS === 'android') {
                    Alert.alert(
                        'Device Restrictions Detected',
                        'Please ensure:\n1. Battery Optimization is disabled\n2. Background activity allowed\n3. Location set to "Always"',
                        [
                            {
                                text: 'Open Settings',
                                onPress: () => Linking.openSettings()
                            },
                            { text: 'Cancel' }
                        ]
                    );
                }
                throw new Error('No geocoding results');
            }

            // ... rest of your country code logic ...

        } catch (error) {
            console.error('Full Error:', JSON.stringify(error, null, 2));

            // Special handling for Oppo timeout issues
            if (error.code == 3 || error.message.includes('timeout')) {
                Alert.alert(
                    'Connection Issue',
                    'Wi-Fi location detection requires:\n' +
                    '1. Strong network connection\n' +
                    '2. Location enabled in device settings\n' +
                    '3. Google Play Services updated'
                );
            }
            // Optional: Retry logic
            if (error.code == 3) { // TIMEOUT
                setTimeout(() => {
                    Alert.alert('Retry?', 'Would you like to try location detection again?', [
                        { text: 'Yes', onPress: () => getCurrentLocation() },
                        { text: 'No' }
                    ]);
                }, 1000);
            }
        }
    };
    const handleCountrySet = (didi) => {
        PraticingState(didi?.id);
        setPhoneCountryCode(didi?.callingcode);
        setCountryCode_cont(didi?.country_code)
        setCountryNew(didi?.name);
        setCountry_cont(didi?.name);
        stateRequest(didi?.id);
        setCountry_id(didi?.id);
        if (didi?.callingcode && mobileHd) {
            const isUSA = didi?.callingcode == '+1' || didi?.callingcode == '1';
            const formattedNumber = formatPhoneNumber(mobileHd, isUSA);
            setMobileHd(formattedNumber);
        }
    };
    const handleStateshows = (ctid) => {
        cityReq(ctid?.id)
        setState_cont(ctid?.name);
        cityRequest(ctid?.id);
        setState_id(ctid?.id)
    }
    const handlecityShows = (ctshows) => {
        setCity_cont(ctshows?.name);
        setCity_id(ctshows?.id)
    }
    console.log(countryNew, "helloooooo--------");
    useEffect(() => {
        if (countryNew) {
            setState_cont("");
            setCity_cont("");
        }
    }, [countryNew])
    useEffect(() => {
        if (slistpratice && statenew) {
            const matchedState = slistpratice.find(c => {
                const stateName = c.name.trim().toLowerCase();
                return stateName == statenew.trim().toLowerCase();
            });
            if (matchedState) {
                setState_cont(matchedState.name);
                setState_id(matchedState.id);
                cityReq(matchedState?.id);
            } else {
                setState_cont("");
            }
        }
    }, [slistpratice, statenew])
    useEffect(() => {
        if (cityAll && citynew) {
            const matchedCity = cityAll.find(c => {
                const cityName = c.name.trim().toLowerCase();
                return cityName == citynew.trim().toLowerCase();
            });
            console.log(matchedCity, "fgkjdfjgfjd----------")
            if (matchedCity) {
                setCity_cont(matchedCity.name);
                setCity_id(matchedCity.id);
            } else {
                setCity_cont("");
            }
        }
    }, [cityAll, citynew])
    const onBackPress = () => {
        Snackbar.show({
            text: 'The tentative date should be at least 30 days from now.',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: '#2C2C2C',
            textColor: '#FFFFFF',
            fontFamily: Fonts.InterRegular,
            fontSize: 14,
            action: {},
            borderRadius: normalize(5),
            marginBottom: normalize(10),
            numberOfLines: 2,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        });
        return true;
    };
    const mobileRegex = /^\d{10}$/;
    const isButtonEnabled = mob_cont?.length > 0 && !mobileRegex.test(mob_cont);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailDetect = email_cont && !emailRegex.test(email_cont);
    useEffect(() => {
        const fullDisable = organ_name && contact_name && !isButtonEnabled && !emailDetect && speaker_cont;
        setGetAcc(fullDisable);
        console.log(fullDisable, "fullDisable--------")
    }, [organ_name, contact_name, isButtonEnabled, emailDetect, speaker_cont])
    const submitContact = () => {
        let obj = {
            "speaker_id": props?.route?.params?.makeIt?.speaker_id,
            "specialties": formData && formData?.speciality,
            "conference_type": confformat,
            "country_id": country_id || "",
            "state_id": state_id || "",
            "city_id": city_id || "",
            "start_date": startdate || "",
            "end_date": enddate || "",
            "organization_name": organ_name || "",
            "conference_name": confname,
            "name": contact_name,
            "email": email_cont,
            "country_code": `${countryCode}(${phoneCountryCode})`,
            "contact_number": mob_cont,
            "message": speaker_cont
        }
        console.log("fhdshg==========", obj)
        connectionrequest()
            .then(() => {
                dispatch(contactusSpeakerRequest(obj))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    if (status1 === '' || TransReducer.status !== status1) {
        switch (TransReducer.status) {
            case 'Transaction/contactusSpeakerRequest':
                status1 = TransReducer.status;
                break;
            case 'Transaction/contactusSpeakerSuccess':
                status1 = TransReducer.status;
                if (TransReducer?.contactusSpeakerResponse?.msg == "Enquiry sent Successfully.") {
                    showErrorAlert("Thank you for inquiring about the speaker for your upcoming event. Our team will connect with you within two business days.");
                    setTimeout(() => {
                        props.navigation.goBack();
                    }, 500);
                }
                break;
            case 'Transaction/contactusSpeakerFailure':
                status1 = TransReducer.status;
                break;
        }
    }
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
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {statepicker ? <ProfileSpeciality
                    formData={formData}
                    statepicker={statepicker}
                    setstatepicker={setstatepicker}
                    setSearchState={setSearchState}
                    searchState={searchState}
                    searchStateName={handleSearch}
                    slist={slist}
                    handleSpecialitySelect={handleSpecialitySelect}
                    selectedSpecialities={selectedSpecialities}
                    setSelectedSpecialities={setSelectedSpecialities}
                    removeSpeciality={removeSpeciality}
                    handleSpecialityChange={handleSpecialityChange}
                    setFormData={setFormData}
                    speciality_id={speciality_id}
                    speciality={speciality}
                    previousSpec={previousSpec}
                    controlled={"close"}
                    setSpeids={setSpeids}
                    speids={speids}
                /> : countrypicker ? <ChecktwoCountryNew setCountryNew={setCountryNew} countrypicker={countrypicker} setSearchcountry={setSearchcountry} searchcountry={searchcountry} handleCountrySet={handleCountrySet} setCountrypicker={setCountrypicker} searchCountryName={handleCountry} countryall={countryall} />
                    : pratice ? <CheckStateShow pratice={pratice} setSearchState={setSearchpratice} searchpratice={searchpratice} handleStateshows={handleStateshows} setPratice={setPratice} searchStateNamePratice={handlePratice} slistpratice={slistpratice} />
                        : cityPicker ? <CheckThreeCity handlecityShows={handlecityShows} cityPicker={cityPicker} setCityPicker={setCityPicker} setSearchcity={setSearchcity} searchcity={searchcity} searchCityName={handleCity} cityAll={cityAll} /> : <>
                            <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40) }}>
                                {Platform.OS === "ios" ? (
                                    <PageHeader
                                        title="Contact Us"
                                        onBackPress={contactUsPage}
                                    />
                                ) : (
                                    <PageHeader
                                        title="Contact Us"
                                        onBackPress={contactUsPage}
                                    />

                                )}
                            </View>
                            <Loader
                                visible={TransReducer?.status == 'Transaction/contactusSpeakerRequest'} />
                            {/* <View style={{paddingHorizontal:normalize(10),paddingVertical:normalize(10),flexDirection:"row",width:normalize(240)}}>
                                <Text style={{fontFamily:Fonts.InterMedium,fontSize:16,color:"#7885af"}}>{`I would like to invite`}</Text>
                                <Text style={{fontFamily:Fonts.InterMedium,fontSize:18,color:"#263d7d"}}>{ props?.route?.params?.makeIt?.Name}</Text>
                                <Text style={{fontFamily:Fonts.InterMedium,fontSize:16,color:"#7885af"}}>{" to speak at our upcoming conference"}</Text>
                            </View> */}
                            {props?.route?.params?.makeIt?.Name && <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 24, color: Colorpath.ButtonColr }}>{props?.route?.params?.makeIt?.Name}</Text>
                            </View>}
                            <ScrollView contentContainerStyle={{ paddingBottom: normalize(40) }}>
                                <>
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
                                                    label="Conference Name"
                                                    value={confname}
                                                    onChangeText={(val) => setConfname(val)}
                                                    placeholder=""
                                                    placeholderTextColor="#949494"
                                                    keyboardType="default"
                                                    showCountryCode={false}
                                                    maxlength={100}
                                                />
                                            </View>
                                        </View>
                                        {/* <View style={{
                                            flexDirection: 'row',
                                            flex: 1
                                        }}>
                                            <View style={{
                                                flex: 1,
                                                paddingRight: normalize(0)
                                            }}>
                                                <CustomInputTouchable
                                                    label={"Conference Target Specialties"}
                                                    value={formData?.speciality?.length > 0 ? '' : ""}
                                                    placeholder={""}
                                                    placeholderTextColor="#949494"
                                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                    onPress={() => {
                                                        setstatepicker(!statepicker);
                                                    }}
                                                    onIconpres={() => {
                                                        setstatepicker(!statepicker);
                                                    }}
                                                />
                                            </View>
                                        </View> */}
                                        {/* <View style={{
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            width: normalize(300),
                                            // marginBottom: normalize(10),
                                        }}>
                                            {formData?.speciality_ids?.map((id, i) => (
                                                <View key={id} style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: '#E0E0E0',
                                                    padding: normalize(5),
                                                    marginRight: normalize(5),
                                                    marginBottom: normalize(5),
                                                    borderRadius: normalize(5),
                                                }}>
                                                    <Text style={{ fontSize: 14, color: '#000', marginRight: normalize(5) }}>
                                                        {formData.speciality.split(', ')[i]}
                                                    </Text>
                                                    <TouchableOpacity onPress={() => removeSpeciality(id)}>
                                                        <Icon name="close" size={15} color="#000" />
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </View> */}
                                        <CustomInputTouchableX
                                            label={"Conference Target Specialties"}
                                            placeholder={""}
                                            placeholderTextColor="#949494"
                                            rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                            onPress={() => setstatepicker(!statepicker)}
                                            onIconpres={() => setstatepicker(!statepicker)}
                                            chipData={formData?.speciality ? formData.speciality.split(', ') : []}
                                            onRemoveChip={(index) => {
                                                const idToRemove = formData?.speciality_ids?.[index];
                                                if (idToRemove) {
                                                    removeSpeciality(idToRemove);
                                                }
                                            }}
                                        />
                                        <View style={{
                                            flexDirection: 'row',
                                            flex: 1
                                        }}>
                                            <View style={{
                                                flex: 1,
                                                paddingRight: normalize(0)
                                            }}>
                                                <CustomInputTouchable
                                                    label={'Conference Format'}
                                                    value={confformat}
                                                    placeholder={''}
                                                    placeholderTextColor="#949494"
                                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                    onPress={() => {
                                                        setConfget(!confget);
                                                    }}
                                                    onIconpres={() => {
                                                        setConfget(!confget);
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        {confformat !== "Virtual" && <View style={{
                                            flexDirection: 'row',
                                            flex: 1
                                        }}>
                                            <View style={{
                                                flex: 1,
                                                paddingRight: normalize(0)
                                            }}>
                                                <CustomInputTouchable
                                                    label={'Country'}
                                                    value={country_cont}
                                                    placeholder={''}
                                                    placeholderTextColor="#949494"
                                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                    onPress={() => setCountrypicker(!countrypicker)}
                                                    onIconpres={() => setCountrypicker(!countrypicker)}
                                                />
                                            </View>
                                        </View>}
                                        {confformat !== "Virtual" && <View style={{
                                            flexDirection: 'row',
                                            flex: 1
                                        }}>
                                            <View style={{
                                                flex: 1,
                                                paddingRight: normalize(0)
                                            }}>
                                                <CustomInputTouchable
                                                    disabled={country_cont ? false : true}
                                                    label={'State'}
                                                    value={state_cont}
                                                    placeholder={''}
                                                    placeholderTextColor="#949494"
                                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                    onPress={() => {
                                                        setPratice(!pratice);
                                                        setCity_cont("");
                                                    }}
                                                    onIconpres={() => {
                                                        if (country_cont) {
                                                            setPratice(!pratice);
                                                            setCity_cont("");
                                                        } else {
                                                            showErrorAlert("Please choose country")
                                                        };
                                                    }}
                                                />
                                            </View>
                                        </View>}
                                        {confformat !== "Virtual" &&
                                            <View style={{
                                                flexDirection: 'row',
                                                flex: 1
                                            }}>
                                                <View style={{
                                                    flex: 1,
                                                    paddingRight: normalize(0)
                                                }}>
                                                    <CustomInputTouchable
                                                        disabled={state_cont ? false : true}
                                                        label={'City'}
                                                        value={city_cont}
                                                        placeholder={''}
                                                        placeholderTextColor="#949494"
                                                        rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                        onPress={() => {
                                                            setCityPicker(!cityPicker)
                                                        }}
                                                        onIconpres={() => {
                                                            if (state_cont) {
                                                                setCityPicker(!cityPicker)
                                                            } else {
                                                                showErrorAlert("Please choose state")
                                                            }
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        }
                                        <View style={{
                                            flexDirection: 'row',
                                            flex: 1
                                        }}>
                                            <View style={{
                                                flex: 1,
                                                paddingRight: normalize(0)
                                            }}>
                                                <CustomInputTouchable
                                                    label={'Tentative Start Date'}
                                                    value={startdate}
                                                    placeholder={''}
                                                    placeholderTextColor="#949494"
                                                    rightIcon={<CalenderIcon name="calendar" size={25} color="#949494" />}
                                                    onPress={() => {
                                                        onBackPress();
                                                        setStartdatepick(!startdatepick);
                                                    }}
                                                    onIconpres={() => setStartdatepick(!startdatepick)}
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
                                                    label={'Tentative End Date'}
                                                    value={enddate}
                                                    placeholder={''}
                                                    placeholderTextColor="#949494"
                                                    rightIcon={<CalenderIcon name="calendar" size={25} color="#949494" />}
                                                    onPress={() => setEnddatepick(!enddatepick)}
                                                    onIconpres={() => setEnddatepick(!enddatepick)}
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
                                                    label="Organization Name*"
                                                    value={organ_name}
                                                    onChangeText={(val) => setOrgan_name(val)}
                                                    placeholder=""
                                                    placeholderTextColor="#949494"
                                                    keyboardType="default"
                                                    showCountryCode={false}
                                                    maxlength={100}
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
                                                    label="Contact Name*"
                                                    value={contact_name}
                                                    onChangeText={(val) => setContact_name(val)}
                                                    placeholder=""
                                                    placeholderTextColor="#949494"
                                                    keyboardType="default"
                                                    showCountryCode={false}
                                                    maxlength={100}
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
                                                    label="Email Address*"
                                                    value={email_cont}
                                                    onChangeText={(val) => setEmail_cont(val)}
                                                    placeholder=""
                                                    placeholderTextColor="#949494"
                                                    keyboardType="default"
                                                    showCountryCode={false}
                                                    maxlength={100}
                                                />
                                            </View>
                                        </View>
                                        {emailDetect && (
                                            <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterRegular,
                                                        fontSize: 12,
                                                        color: 'red',
                                                    }}>
                                                    {"Invalid email address."}
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
                                                    label="Cell Number*"
                                                    value={mobileHd}
                                                    onChangeText={(val) => {
                                                        const isUSA = phoneCountryCode == '+1' ||
                                                            phoneCountryCode == '1';
                                                        const formattedVal = formatPhoneNumber(val, isUSA);
                                                        setMobileHd(formattedVal);
                                                        const rawDigits = formattedVal.replace(/\D/g, '');
                                                        setMob_cont(rawDigits)
                                                    }}
                                                    placeholder=""
                                                    placeholderTextColor="#949494"
                                                    keyboardType="phone-pad"
                                                    showCountryCode={true}
                                                    countryCode={phoneCountryCode}
                                                    maxlength={14}
                                                />
                                            </View>
                                        </View>
                                        {isButtonEnabled && (
                                            <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterRegular,
                                                        fontSize: 12,
                                                        color: 'red',
                                                    }}>
                                                    {"Invalid cell number. It must be 10 digits."}
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
                                                    label="Speaker requirement*"
                                                    value={speaker_cont}
                                                    onChangeText={(val) => setSpeaker_cont(val)}
                                                    placeholder=""
                                                    placeholderTextColor="#949494"
                                                    keyboardType="default"
                                                    showCountryCode={false}
                                                    maxlength={100}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </>
                                <Buttons
                                    onPress={() => submitContact()}
                                    height={normalize(45)}
                                    width={normalize(310)}
                                    backgroundColor={getAcc ? Colorpath.ButtonColr : "#DADADA"}
                                    borderRadius={normalize(9)}
                                    text="Submit"
                                    color={Colorpath.white}
                                    fontSize={18}
                                    fontFamily={Fonts.InterSemiBold}
                                    marginTop={normalize(10)}
                                    disabled={!getAcc}
                                />
                            </ScrollView>
                        </>}

                <Modal
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    isVisible={confget}
                    backdropColor={Colorpath.black}
                    style={{
                        width: '100%',
                        alignSelf: 'center',
                        margin: 0,
                    }}
                    onBackdropPress={() => setConfget(false)}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setConfget(false)}>

                        <View
                            style={{
                                borderRadius: normalize(7),
                                height: Platform.OS === 'ios' ? normalize(180) : normalize(180),
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                backgroundColor: '#fff',
                            }}>
                            <FlatList
                                contentContainerStyle={{
                                    paddingBottom: normalize(70),
                                    paddingTop: normalize(7),
                                }}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={item => item.id}
                                data={conf_Type}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                setConfget(false);
                                                setConfformat(item?.name);
                                            }}
                                            style={[styles.dropDownItem]}>
                                            <Text style={[styles.dropDownItemText]}>
                                                {item?.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
                <DateTimePickerModal
                    isVisible={startdatepick}
                    mode="date"
                    date={
                        enddate
                            ? moment.min(moment(enddate), moment().add(1, 'month')).toDate()
                            : (() => {
                                const today = moment().add(1, 'day');
                                const isEndOfMonth = today.clone().add(1, 'day').month() !== today.month();
                                return isEndOfMonth
                                    ? today.clone().add(1, 'month').endOf('month').toDate()
                                    : today.clone().add(1, 'month').toDate();
                            })()
                    }
                    minimumDate={(() => {
                        const today = moment().add(1, 'day');
                        const isEndOfMonth = today.clone().add(1, 'day').month() !== today.month();
                        return isEndOfMonth
                            ? today.clone().add(1, 'month').endOf('month').toDate()
                            : today.clone().add(1, 'month').toDate();
                    })()}
                    maximumDate={enddate ? moment(enddate).toDate() : undefined}
                    onConfirm={val => {
                        const formattedDate = moment(val).format('YYYY-MM-DD');
                        setStartdate(formattedDate);
                        setStartdatepick(false);
                    }}
                    onCancel={() => setStartdatepick(false)}
                    textColor="black"
                />

                <DateTimePickerModal
                    isVisible={enddatepick}
                    mode="date"
                    date={
                        startdate
                            ? moment(startdate).toDate()
                            : (() => {
                                const today = moment().add(1, 'day');
                                const isEndOfMonth = today.clone().add(1, 'day').month() !== today.month();
                                return isEndOfMonth
                                    ? today.clone().add(1, 'month').endOf('month').toDate()
                                    : today.clone().add(1, 'month').toDate();
                            })()
                    }
                    minimumDate={startdate ? moment(startdate).toDate() : (() => {
                        const today = moment().add(1, 'day');
                        const isEndOfMonth = today.clone().add(1, 'day').month() !== today.month();
                        return isEndOfMonth
                            ? today.clone().add(1, 'month').endOf('month').toDate()
                            : today.clone().add(1, 'month').toDate();
                    })()}
                    onConfirm={val => {
                        const formattedDateEnd = moment(val).format('YYYY-MM-DD');
                        setEnddate(formattedDateEnd);
                        setEnddatepick(false);
                    }}
                    onCancel={() => setEnddatepick(false)}
                    textColor="black"
                />
            </SafeAreaView>
        </>
    )
}

export default ContactUs