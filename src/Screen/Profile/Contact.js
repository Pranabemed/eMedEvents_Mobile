/**
 * Contact screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, status1, GOOGLE_API_KEY, isPhysicianProfessionalInformation, ContactProfile, SearchBack, detectCountry, getLabelStyle, handleFocus, handleBlur, closeProfessionModal, handleContactTake, handleCountry, handlePratice, handleCity, formatDobWithMoment, handlePlaceSelected, normalizeCountryName, fetchPostalCodeFromGeocode, handleCountrySet, handleStateshows, handlecityShows, countryReq, PraticingState, cityReq, formatPhoneNumber, styles.
 */

import { View, Text, Platform, TouchableOpacity, KeyboardAvoidingView, ScrollView, StyleSheet, Easing, Animated, Modal } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import TextFieldIn from '../../Components/Textfield';
import CustomTextField from '../../Components/CustomTextfiled';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../../Themes/Fonts'
import Buttons from '../../Components/Button';
import CalenderIcon from 'react-native-vector-icons/Feather';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ChecktwoCountry from '../DetailsPageWebcast/CheckoutModaltwo'
import CheckThreeCity from '../DetailsPageWebcast/CheckoutModalFourth'
import { useDispatch, useSelector } from 'react-redux';
import { cityRequest, countryRequest, stateRequest } from '../../Redux/Reducers/AuthReducer'
import connectionrequest from '../../Utils/Helpers/NetInfo'
import showErrorAlert from '../../Utils/Helpers/Toast'
import { searchCountryNameFunction } from '../DetailsPageWebcast/SearchCountryname'
import { searchStateNamePraticeFunction } from '../DetailsPageWebcast/SearchStateNamePratice'
import { searchCityNameFunction } from '../DetailsPageWebcast/SearchCityName'
import CheckStateShowCont from './StateContact';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment'
import { contactInfoRequest, personalInfoRequest } from '../../Redux/Reducers/ProfileReducer'
import Loader from '../../Utils/Helpers/Loader'
import InputField from '../../Components/CellInput'
import CustomInputTouchable from '../../Components/IconTextIn'
import AddressInput from '../../Components/AutoData'
import AddressField from '../../Components/AutoData';
import DropdownIcon from 'react-native-vector-icons/Entypo';
import { isNonUsaAccount, isUsaCountryCode, markNonUsaProfessionUpdateRequired, readNonUsaPermanentFlags, readNonUsaFlowState } from '../../Utils/Helpers/nonUsaFlow';
import { getCountryAndDialCode } from '../../Utils/Helpers/IPServer';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable isPhysicianProfessionalInformation component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

let status = "";
/**
 * Status1 string constant.
 * @returns {string}
 */
let status1 = "";
/**
 * Google api key constant.
 * @returns {string}
 */
const GOOGLE_API_KEY = 'AIzaSyBDnBivN-fdP6JxOcQFIyvhxIJSArru6Nk';
/**
 * Determines whether physician professional information is true.
 * @param {Object} info - Input value.
 * @returns {*}
 */
const isPhysicianProfessionalInformation = (info = {}) => {
    const profession = String(info?.profession || '').trim().toLowerCase();
    const professionType = String(info?.profession_type || '').trim().toLowerCase();

    if (profession !== 'physician') return false;
    return ['md', 'do', 'dpm'].includes(professionType);
};

const getValidDialCode = (callingCode, countryName, geoInfo, countryList) => {
    let code = callingCode ? String(callingCode).trim() : '';
    if (code && code !== 'null' && code !== 'undefined' && code !== '+null' && code !== '+undefined' && code !== '+') {
        return code.startsWith('+') ? code : `+${code}`;
    }
    if (geoInfo && geoInfo.dialCode && geoInfo.dialCode !== '+' && geoInfo.dialCode !== '+null' && geoInfo.dialCode !== '+undefined') {
        return geoInfo.dialCode.startsWith('+') ? geoInfo.dialCode : `+${geoInfo.dialCode}`;
    }
    const targetCountry = String(countryName || geoInfo?.country_name || geoInfo?.country || '').trim().toLowerCase();
    if (Array.isArray(countryList) && countryList.length > 0 && targetCountry) {
        const found = countryList.find(c =>
            String(c.name || '').toLowerCase() === targetCountry ||
            String(c.sortname || '').toLowerCase() === targetCountry
        );
        if (found && (found.callingcode || found.calling_code)) {
            let cCode = String(found.callingcode || found.calling_code).trim();
            return cCode.startsWith('+') ? cCode : `+${cCode}`;
        }
    }
    if (targetCountry.includes('india') || targetCountry === 'in') {
        return '+91';
    }
    return '+1';
};

const normalizeContactValue = (value) => {
    if (value === null || value === undefined) {
        return '';
    }
    const text = String(value).trim();
    if (!text || text.toLowerCase() === 'null' || text.toLowerCase() === 'undefined') {
        return '';
    }
    return text;
};

const getGeoFallbackAddress = (geoInfo) => {
    const stateName = normalizeContactValue(geoInfo?.state_name);
    const cityName = normalizeContactValue(geoInfo?.city_name);
    const countryName = normalizeContactValue(geoInfo?.country_name);

    return stateName || [cityName, stateName, countryName].filter(Boolean).join(', ') || [cityName, countryName].filter(Boolean).join(', ') || countryName || '';
};


/**
 * Contact profile component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const ContactProfile = (props) => {
    /**
* Search back component.
* @returns {void}
*/
    const SearchBack = () => {
        props.navigation.goBack();
    }
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [emailid, setEmailid] = useState("");
    const [dobdate, setDobdate] = useState("");
    const [dobpicker, setDobpicker] = useState(false);
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");
    const [countrypicker, setCountrypicker] = useState(false);
    const [state, setState] = useState("");
    const [statepicker, setStatepicker] = useState(false);
    const [city, setCity] = useState("");
    const [citypicker, setCitypicker] = useState(false);
    const [zipcode, setZipcode] = useState("");
    const [cellno, setCellno] = useState("");
    const [whatsappno, setWhatsappno] = useState("");
    const [countryall, setCountryall] = useState('');
    const [countryshow, setCountryshow] = useState([]);
    const [selectStatepratice, setSelectStatepratice] = useState([]);
    const [slistpratice, setSlistpratice] = useState('');
    const [cityAll, setCityAll] = useState('');
    const [cityshow, setCityshow] = useState([]);
    const [searchcountry, setSearchcountry] = useState('');
    const [country_id, setCountry_id] = useState("");
    const AuthReducer = useSelector(state => state.AuthReducer);
    const ProfileReducer = useSelector(state => state.ProfileReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const [pratice, setPratice] = useState(false);
    const [searchpratice, setSearchpratice] = useState('');
    const [state_id, setState_id] = useState("");
    const [city_id, setCity_id] = useState("");
    const [searchcity, setSearchcity] = useState('');
    const [dialcode, setDialcode] = useState("");
    const [loading, setLoading] = useState(false);
    const [isNonUsaFlow, setIsNonUsaFlow] = useState(false);
    const [nonUsaFlowState, setNonUsaFlowState] = useState(null);
    const [nonUsaPermanentFlags, setNonUsaPermanentFlags] = useState({
        professionUpdateRequired: false,
        stateLicenseFlowCompleted: false,
    });
    const [professionModalVisible, setProfessionModalVisible] = useState(false);
    const [pendingPersonal, setPendingPersonal] = useState(null);
    const dispatch = useDispatch();
    const dashboardProfessionalInformation = DashboardReducer?.mainprofileResponse?.professional_information;
    const hasExistingPhysicianDashboardProfile = isPhysicianProfessionalInformation(dashboardProfessionalInformation);
    const cellNoRegexwp = /^\d{10,15}$/;
    const filteredText = whatsappno && whatsappno?.length > 0 && whatsappno.replace(/[^\d]/g, '');
    const isValidWhatsappNo = filteredText?.length > 0 && !cellNoRegexwp.test(filteredText);
    const cellNoRegexwpcell = /^\d{10,15}$/;
    const filteredTextcell = cellno && cellno?.length > 0 && cellno.replace(/[^\d]/g, '');
    const isValidcell = filteredTextcell?.length > 0 && !cellNoRegexwpcell.test(filteredTextcell);
    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
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
    console.log(DashboardReducer?.mainprofileResponse?.professional_information, "ertrkjred===")
    if (status1 == '' || ProfileReducer.status != status1) {
        switch (ProfileReducer.status) {
            case 'Profile/contactInfoRequest':
                status1 = ProfileReducer.status;
                setLoading(true);
                break;
            case 'Profile/contactInfoSuccess':
                status1 = ProfileReducer.status;
                setLoading(false);
                if (ProfileReducer?.contactInfoResponse?.msg == "Contact inforamtion updated successfully.") {
                    const nextPersonal = DashboardReducer?.mainprofileResponse || ProfileReducer?.personalInfoResponse?.user ||
                        ProfileReducer?.contactInfoResponse?.user ||
                        props?.route?.params?.wholedata ||
                        {};
                    console.log(nextPersonal, "log-----------", nonUsaPermanentFlags);
                    if (
                        hasExistingPhysicianDashboardProfile ||
                        isPhysicianProfessionalInformation(nextPersonal?.professional_information)
                    ) {
                        props.navigation.goBack();
                    } else {
                        const shouldPromptNonUsaProfessionUpdate =
                            isNonUsaFlow ||
                            !isUsaCountryCode(dialcode)
                            ;
                        console.log(shouldPromptNonUsaProfessionUpdate, "shouldPromptNonUsaProfessionUpdate", isNonUsaFlow)
                        if (shouldPromptNonUsaProfessionUpdate) {
                            markNonUsaProfessionUpdateRequired();
                            setPendingPersonal(nextPersonal);
                            setProfessionModalVisible(true);
                        }
                    }
                }
                break;
            case 'Profile/contactInfoFailure':
                status1 = ProfileReducer.status;
                setLoading(false);
                break;

        }
    }
    const [isFieldFocused, setIsFieldFocused] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shouldBeUp = !!address || isFieldFocused;
        Animated.timing(animatedValue, {
            toValue: shouldBeUp ? 1 : 0,
            duration: 150,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [address, isFieldFocused]);

    useEffect(() => {
        /**
* Detect country utility.
*
* @async
* @returns {Promise<*>}
*/
        const detectCountry = async () => {
            try {
                const geoInfo = await getCountryAndDialCode();
                if (geoInfo) {
                    const ipCountry = String(geoInfo.country || '').trim().toUpperCase();
                    const isNonUsaIp = ipCountry && ipCountry !== 'US' && ipCountry !== 'USA';
                    console.log(isNonUsaIp, "dgjjfg");
                    setIsNonUsaFlow(isNonUsaIp);

                    setAddress(prev => {
                        const cleanPrev = normalizeContactValue(prev);
                        if (!cleanPrev) {
                            return getGeoFallbackAddress(geoInfo);
                        }
                        return cleanPrev;
                    });

                    setState(prev => {
                        const cleanPrev = normalizeContactValue(prev);
                        if (!cleanPrev) {
                            return normalizeContactValue(geoInfo?.state_name);
                        }
                        return cleanPrev;
                    });

                    setDialcode(prev => {
                        const cleanPrev = normalizeContactValue(prev);
                        if (!cleanPrev || cleanPrev === '+') {
                            return getValidDialCode(null, null, geoInfo, countryall);
                        }
                        return cleanPrev;
                    });
                }
            } catch (error) {
                console.log('Contact geo lookup failed', error);
            }
        };
        detectCountry();
    }, [countryall]);

    useEffect(() => {
        let mounted = true;
        Promise.all([
            readNonUsaFlowState(),
            readNonUsaPermanentFlags(),
        ]).then(([state, flags]) => {
            if (mounted) {
                setNonUsaFlowState(state);
                setNonUsaPermanentFlags(flags);
            }
        });
        return () => {
            mounted = false;
        };
    }, []);

    /**
* Returns label style.
* @returns {Object}
*/
    const getLabelStyle = () => {
        const isActive = isFieldFocused || !!address;
        return {
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 1,
            transform: [
                {
                    translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, -2],
                    }),
                },
            ],
            fontFamily: Fonts.InterRegular,
            fontSize: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [14, 14],
            }),
            color: isActive ? '#555555' : '#000000',
        };
    };

    /**
* Handles focus.
* @returns {void}
*/
    const handleFocus = () => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 150,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
        setIsFieldFocused(true);
    };

    /**
* Handles blur.
* @returns {void}
*/
    const handleBlur = () => {
        if (!address) {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 150,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }).start();
        }
        setIsFieldFocused(false);
    };
    /**
* Close profession modal utility.
* @returns {void}
*/
    const closeProfessionModal = () => {
        setProfessionModalVisible(false);
        if (pendingPersonal) {
            if (hasExistingPhysicianDashboardProfile) {
                props.navigation.goBack();
            } else {
                props.navigation.navigate("PersonalInfo", { personal: pendingPersonal });
            }
        }
    };
    /**
* Handles contact take.
* @returns {void}
*/
    const handleContactTake = () => {
        const cellNoRegex = /^\d{10,15}$/;
        const filteredTextcell = cellno && cellno?.length > 0 && cellno.replace(/[^\d]/g, '');
        if (!firstname) {
            showErrorAlert("Enter your first name")
        } else if (!lastname) {
            showErrorAlert("Enter your last name")
        } else if (!emailid) {
            showErrorAlert("Enter your email-id")
        } else if (!address) {
            showErrorAlert("Enter your address.");
        } else if (!country) {
            showErrorAlert("Enter your country name")
        } else if (!state) {
            showErrorAlert("Enter your state name")
        } else if (!city) {
            showErrorAlert("Enter your city name")
        } else if (!zipcode) {
            showErrorAlert("Enter your ZIP code.")
        } else if (!cellno) {
            showErrorAlert("Enter your cell number. ")
        } else if (!cellNoRegex.test(filteredTextcell)) {
            showErrorAlert("Invalid cell number. It must be 10-15 digits.")
        } else if (isValidWhatsappNo) {
            showErrorAlert("Invalid whatsapp number. It must be 10-15 digits.");
        } else {
            let obj = {
                "social_facebook": "",
                "social_twitter": "",
                "social_linkedin": "",
                "social_doximity": "",
                "address": address,
                "country_id": country_id,
                "state_id": state_id,
                "city_id": city_id,
                "postal_code": zipcode,
                "contact_number": cellno,
                "alternate_email": "",
                "skype": "",
                "whatapp_number": whatsappno
            }
            let userObj = {
                "first_name": firstname,
                "last_name": lastname,
                "dob": dobdate
            }
            connectionrequest()
                .then(() => {
                    dispatch(contactInfoRequest(obj));
                    dispatch(personalInfoRequest(userObj));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }
    /**
* Handles country.
* @param {*} text - Input value.
* @returns {void}
*/
    const handleCountry = (text) => {
        searchCountryNameFunction(text, countryshow, setCountryall, setSearchcountry, (countryfil, searchcount) => {
            console.log('countryfil Data:', countryfil, 'Search Text:', searchcount);
        })
    }
    /**
* Handles pratice.
* @param {*} text - Input value.
* @returns {void}
*/
    const handlePratice = (text) => {
        searchStateNamePraticeFunction(text, selectStatepratice, setSlistpratice, setSearchpratice, (praticefil, praticetxtcount) => {
            console.log('countryfil Data:', praticefil, 'Search Text:', praticetxtcount);
        })
    }
    /**
* Handles city.
* @param {*} text - Input value.
* @returns {void}
*/
    const handleCity = (text) => {
        searchCityNameFunction(text, cityshow, setCityAll, setSearchcity, (cityfill, citycountname) => {
            console.log('countryfil Data:', cityfill, 'Search Text:', citycountname);
        })
    }
    console.log("details==========", address, country_id, slistpratice, props?.route?.params?.wholedata);
    useEffect(() => {
        if (props?.route?.params?.wholedata) {
            /**
* Formats dob with moment.
* @param {*} dob - Input value.
* @returns {void}
*/
            const formatDobWithMoment = (dob) => {
                if (!dob || dob == "0000-00-00" || dob == "null" || dob == "undefined") {
                    return "";
                }
                try {
                    const formattedDate = moment(dob).format('MMM DD, YYYY');
                    if (formattedDate == 'Invalid date') {
                        return dob;
                    }
                    return formattedDate;
                } catch (error) {
                    return dob;
                }
            };
            setFirstname(props?.route?.params?.wholedata?.personal_information?.firstname);
            setLastname(props?.route?.params?.wholedata?.personal_information?.lastname);
            setEmailid(props?.route?.params?.wholedata?.personal_information?.email);

            const userAddr = props?.route?.params?.wholedata?.user_address || {};
            const rawAddr = normalizeContactValue(userAddr?.address);
            const rawState = normalizeContactValue(userAddr?.state_name);
            const rawCountry = normalizeContactValue(userAddr?.country_name);
            const rawCalling = normalizeContactValue(userAddr?.calling_code);

            setCountry(rawCountry);
            setCountry_id(userAddr?.country_id || "");

            getCountryAndDialCode().then(geoInfo => {
                if (!rawAddr) {
                    setAddress(getGeoFallbackAddress(geoInfo));
                } else {
                    setAddress(rawAddr);
                }

                if (!rawState) {
                    setState(normalizeContactValue(geoInfo?.state_name));
                } else {
                    setState(rawState);
                }

                const validDial = getValidDialCode(rawCalling, rawCountry, geoInfo, countryall);
                setDialcode(validDial);

                const isUSA = validDial === '+1' || validDial === '1';
                const rawCell = normalizeContactValue(userAddr?.contact_no);
                const rawWp = normalizeContactValue(props?.route?.params?.wholedata?.user_social?.social_whatsapp);

                setCellno(formatPhoneNumber(rawCell, isUSA));
                setWhatsappno(formatPhoneNumber(rawWp, isUSA));
            }).catch(() => {
                if (!rawAddr) {
                    setAddress('');
                } else {
                    setAddress(rawAddr);
                }
                if (rawState) {
                    setState(rawState);
                }
                const validDial = getValidDialCode(rawCalling, rawCountry, null, countryall);
                setDialcode(validDial);

                const isUSA = validDial === '+1' || validDial === '1';
                const rawCell = normalizeContactValue(userAddr?.contact_no);
                const rawWp = normalizeContactValue(props?.route?.params?.wholedata?.user_social?.social_whatsapp);

                setCellno(formatPhoneNumber(rawCell, isUSA));
                setWhatsappno(formatPhoneNumber(rawWp, isUSA));
            });

            setState_id(userAddr?.state_id || "");
            setCity(normalizeContactValue(userAddr?.city_name));
            setCity_id(userAddr?.city_id || "");
            setZipcode(normalizeContactValue(userAddr?.zipcode));
            setWhatsappno(normalizeContactValue(props?.route?.params?.wholedata?.user_social?.social_whatsapp));
            setDobdate(formatDobWithMoment(props?.route?.params?.wholedata?.personal_information?.dob && props?.route?.params?.wholedata?.personal_information?.dob !== "0000-00-00" ? props?.route?.params?.wholedata?.personal_information?.dob : ""));
            const resolvedUser = {
                ...(props?.route?.params?.wholedata || {}),
                ...(props?.route?.params?.wholedata?.user_address || {})
            };
            setIsNonUsaFlow(nonUsaFlowState?.isNonUsa === true || isNonUsaAccount(resolvedUser, nonUsaFlowState));
        }
    }, [props?.route?.params?.wholedata, nonUsaFlowState, countryall])
    /**
* Handles place selected.
*
* @async
* @param {*} data - Input value.
* @param {*} details - Input value.
* @returns {Promise<*>}
*/
    const handlePlaceSelected = async (data, details) => {
        console.log(details, "details==========");
        if (details) {
            try {
                const addressComponents = details.address_components;
                const country = addressComponents.find(comp => comp.types.includes('country'))?.long_name || 'Country not available';
                const state = addressComponents.find(comp => comp.types.includes('administrative_area_level_1'))?.long_name || 'State not available';
                const city = addressComponents.find(comp => comp.types.includes('locality') || comp.types.includes('sublocality'))?.long_name || 'City not available';
                const address = details?.formatted_address || 'Address not available';
                let postalCode = addressComponents.find(comp => comp.types.includes('postal_code'))?.long_name;
                // Fetch postal code if not found in address components
                if (!postalCode && details.geometry?.location) {
                    const { lat, lng } = details.geometry.location;
                    postalCode = await fetchPostalCodeFromGeocode(lat, lng) || 'Postal code not available';
                }
                if (state) {
                    setNewState(state);
                }
                if (city) {
                    setNewCity(city);
                }
                if (address) {
                    setAddress(address);
                }
                if (countryall) {
                    const normalizedCountry = normalizeCountryName(country);
                    const countryData = countryall.find(c => c.name.toLowerCase() == normalizedCountry.toLowerCase());
                    console.log(countryData, "countryData==========", state, city, address);
                    if (countryData) {
                        handleCountrySet(countryData);
                        const countryId = countryData?.id;
                        setCountry_id(countryId);
                        setCountry(countryData?.name);
                        setState(state ? state : 'State not available');
                        setCity(city ? city : 'City not available');
                        setZipcode(postalCode);
                        setAddress(address);
                        setDialcode(getValidDialCode(countryData?.callingcode, countryData?.name, null, countryall));
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
    /**
* Normalizes country name.
* @param {number} country - Input value.
* @returns {*}
*/
    const normalizeCountryName = (country) => {
        // Normalize country names to align with entries in countryall
        const countryMap = {
            "United States": "United States of America",
            // Add more mappings as needed
        };
        return countryMap[country] || country;
    };
    /**
* Fetch postal code from geocode utility.
*
* @async
* @param {*} latitude - Input value.
* @param {*} longitude - Input value.
* @returns {Promise<*>}
*/
    const fetchPostalCodeFromGeocode = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
            );
            const data = await response.json();
            const addressComponents = data.results[0]?.address_components;
            return addressComponents?.find(comp => comp.types.includes('postal_code'))?.long_name;
        } catch (error) {
            console.error('Geocode error:', error);
            return null;
        }
    };
    useEffect(() => {
        if (props?.route?.params?.wholedata) {
            countryReq();
        }
    }, [props?.route?.params?.wholedata])
    /**
* Handles country set.
* @param {*} didi - Input value.
* @returns {void}
*/
    const handleCountrySet = (didi) => {
        console.log(cellno, "cellno======", didi)
        PraticingState(didi?.id);
        setCountry(didi?.name);
        stateRequest(didi?.id);
        setCountry_id(didi?.id);
        setDialcode(getValidDialCode(didi?.callingcode, didi?.name, null, countryall));
        const tempAccount = { country_id: didi?.id, country_name: didi?.name, country_code: didi?.callingcode };
        setIsNonUsaFlow(nonUsaFlowState?.isNonUsa === true || isNonUsaAccount(tempAccount, nonUsaFlowState));
        const currentCell = normalizeContactValue(cellno);
        const currentWhatsapp = normalizeContactValue(whatsappno);
        if (didi?.callingcode && currentCell) {
            const isUSA = didi?.callingcode == '+1' || didi?.callingcode == '1';
            const formattedNumber = formatPhoneNumber(currentCell, isUSA);
            setCellno(formattedNumber);
        }
        if (didi?.callingcode && currentWhatsapp) {
            const isUSA = didi?.callingcode == '+1' || didi?.callingcode == '1';
            const formattedNumber = formatPhoneNumber(currentWhatsapp, isUSA);
            setWhatsappno(formattedNumber);
        }
    };
    /**
* Handles stateshows.
* @param {*} ctid - Input value.
* @returns {void}
*/
    const handleStateshows = (ctid) => {
        cityReq(ctid?.id)
        setState(ctid?.name);
        cityRequest(ctid?.id);
        setState_id(ctid?.id);
    }
    /**
* Handlecity shows utility.
* @param {*} ctshows - Input value.
* @returns {void}
*/
    const handlecityShows = (ctshows) => {
        setCity(ctshows?.name);
        setCity_id(ctshows?.id)
    }
    /**
* Country req utility.
* @returns {void}
*/
    const countryReq = () => {
        connectionrequest()
            .then(() => {
                dispatch(countryRequest())
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    const [selectedStateData, setSelectedStateData] = useState(null);
    const [selectedCityData, setSelectedCityData] = useState(null);
    const [newState, setNewState] = useState("");
    const [newCity, setNewCity] = useState("");

    useEffect(() => {
        if (slistpratice && newState) {
            const stateData = slistpratice.find(s => s.name === newState);
            if (stateData) {
                setSelectedStateData({ ...stateData });
            }
        }
    }, [slistpratice, newState]);

    useEffect(() => {
        if (selectedStateData) {
            handleStateshows(selectedStateData);
            setSelectedStateData(null);
        }
    }, [selectedStateData]);

    useEffect(() => {
        if (cityAll && newCity) {
            const CityData = cityAll.find(s => s.name === newCity);
            if (CityData) {
                setSelectedCityData({ ...CityData });
            }
        }
    }, [cityAll, newCity]);
    useEffect(() => {
        if (selectedCityData) {
            handlecityShows(selectedCityData);
            setSelectedCityData(null);
        }
    }, [selectedCityData]);
    /**
* Praticing state component.
* @param {number} index - Input value.
* @returns {void}
*/
    const PraticingState = (index) => {
        connectionrequest()
            .then(() => {
                dispatch(stateRequest(index));
            })
            .catch(err => {
                showErrorAlert('Please connect to Internet', err);
            });
    };

    /**
* City req utility.
* @param {*} itid - Input value.
* @returns {void}
*/
    const cityReq = (itid) => {
        connectionrequest()
            .then(() => {
                dispatch(cityRequest(itid));
            })
            .catch(err => {
                showErrorAlert('Please connect to Internet', err);
            });
    }
    useEffect(() => {
        if (country) {
            setSearchcountry("");
        }
    }, [country])
    useEffect(() => {
        if (state) {
            setSearchpratice("");
        }
    }, [state])
    useEffect(() => {
        if (city) {
            setSearchcity("");
        }
    }, [city])
    /**
* Formats phone number.
* @param {*} input - Input value.
* @param {boolean} isUSA - Input value.
* @returns {*}
*/
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
                {countrypicker ?
                    (<ChecktwoCountry
                        countrypicker={countrypicker}
                        setSearchcountry={setSearchcountry}
                        searchcountry={searchcountry}
                        handleCountrySet={handleCountrySet}
                        setCountrypicker={setCountrypicker}
                        searchCountryName={handleCountry}
                        countryall={countryall} />)
                    : statepicker ? (
                        <CheckStateShowCont
                            pratice={pratice}
                            setSearchState={setSearchpratice}
                            searchpratice={searchpratice}
                            handleStateshows={handleStateshows}
                            setPratice={setPratice}
                            searchStateNamePratice={handlePratice}
                            slistpratice={slistpratice}
                            statepicker={statepicker}
                            setStatepicker={setStatepicker}
                        />) :
                        citypicker ? (
                            <CheckThreeCity
                                handlecityShows={handlecityShows}
                                cityPicker={citypicker}
                                setCityPicker={setCitypicker}
                                setSearchcity={setSearchcity}
                                searchcity={searchcity}
                                searchCityName={handleCity}
                                cityAll={cityAll} />) : <>
                            <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                                {Platform.OS === "ios" ? (
                                    <PageHeader
                                        title="Contact Information"
                                        onBackPress={SearchBack}
                                    />
                                ) : (
                                    <PageHeader
                                        title="Contact Information"
                                        onBackPress={SearchBack}
                                    />

                                )}
                            </View>
                            <Loader visible={loading} />
                            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }} behavior={Platform.OS === 'ios' ? 'height' : undefined}>
                                <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ paddingBottom: normalize(50) }}>
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
                                                    value={firstname}
                                                    onChangeText={setFirstname}
                                                    placeholder=''
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
                                                    label='Last Name*'
                                                    value={lastname}
                                                    onChangeText={setLastname}
                                                    placeholder=''
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
                                                    label='Email ID*'
                                                    value={emailid}
                                                    onChangeText={setEmailid}
                                                    placeholder=''
                                                    placeholderTextColor="#949494"
                                                    keyboardType="default"
                                                    showCountryCode={false}
                                                    maxlength={100}
                                                    editable={false}
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
                                                    label={dobdate ? "Date Of Birth" : "Date Of Birth"}
                                                    value={dobdate}
                                                    placeholder={""}
                                                    placeholderTextColor="#949494"
                                                    rightIcon={<CalenderIcon name="calendar" size={25} color="#949494" />}
                                                    onPress={() => {
                                                        setDobpicker(!dobpicker);
                                                    }}
                                                    onIconpres={() => {
                                                        setDobpicker(!dobpicker);
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{
                                            marginBottom: 16,
                                            width: '100%',
                                            position: 'relative',
                                        }}>
                                            <View style={{
                                                borderBottomWidth: 0.5,
                                                borderBottomColor: "#000000",
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                paddingTop: normalize(20),
                                                position: 'relative',
                                            }}>
                                                <Animated.Text
                                                    pointerEvents="none"
                                                    style={getLabelStyle()}>
                                                    {"Address*"}
                                                </Animated.Text>

                                                <GooglePlacesAutocomplete
                                                    placeholder=""
                                                    onPress={(data, details = null) => {
                                                        handlePlaceSelected(data, details);
                                                    }}
                                                    fetchDetails={true}
                                                    styles={{
                                                        textInput: {
                                                            paddingHorizontal: 2,
                                                            paddingVertical: 0,
                                                            backgroundColor: Colorpath.Pagebg,
                                                            height: normalize(40),
                                                            fontSize: 14,
                                                            fontFamily: Fonts.InterRegular,
                                                            color: '#000000',
                                                        },
                                                        container: {
                                                            flex: 1,
                                                        },
                                                        listView: {
                                                            backgroundColor: '#fff',
                                                        },
                                                    }}
                                                    query={{
                                                        key: GOOGLE_API_KEY,
                                                        language: 'en',
                                                    }}
                                                    textInputProps={{
                                                        multiline: false,
                                                        value: address || '',
                                                        /**
* On change text helper.
* @param {*} val - Input value.
* @returns {void}
*/
                                                        onChangeText: (val) => {
                                                            setAddress(val);
                                                        },
                                                        /**
* On focus utility.
* @returns {*}
*/
                                                        onFocus: () => handleFocus(),
                                                        /**
* On blur utility.
* @returns {*}
*/
                                                        onBlur: () => handleBlur(),
                                                        placeholder: '',
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
                                                    value={country}
                                                    placeholder={""}
                                                    placeholderTextColor="#949494"
                                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                    onPress={() => {
                                                        setCountrypicker(!countrypicker);
                                                        countryReq();
                                                        setState("");
                                                        setCity("");
                                                    }}
                                                    onIconpres={() => {
                                                        setCountrypicker(!countrypicker);
                                                        countryReq();
                                                        setState("");
                                                        setCity("");
                                                    }}
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
                                                    value={state}
                                                    placeholder={""}
                                                    placeholderTextColor="#949494"
                                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                    onPress={() => {
                                                        setStatepicker(!statepicker);
                                                        PraticingState(country_id);
                                                        setCity("");
                                                    }}
                                                    onIconpres={() => {
                                                        setStatepicker(!statepicker);
                                                        PraticingState(country_id);
                                                        setCity("");
                                                    }}
                                                    disabled={country ? false : true}
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
                                                    value={city}
                                                    placeholder={""}
                                                    placeholderTextColor="#949494"
                                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                    onPress={() => {
                                                        setCitypicker(!citypicker);
                                                        cityReq(state_id);
                                                    }}
                                                    onIconpres={() => {
                                                        setCitypicker(!citypicker);
                                                        cityReq(state_id);
                                                    }}
                                                    disabled={state ? false : true}
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
                                                    value={zipcode}
                                                    onChangeText={setZipcode}
                                                    placeholder=''
                                                    placeholderTextColor="#949494"
                                                    keyboardType="phone-pad"
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
                                                    value={cellno}
                                                    onChangeText={(val) => {
                                                        const isUSA = dialcode == '+1' ||
                                                            dialcode == '1';
                                                        const formattedVal = formatPhoneNumber(val, isUSA);
                                                        setCellno(formattedVal);
                                                    }}
                                                    placeholder=""
                                                    placeholderTextColor="#949494"
                                                    keyboardType="numeric"
                                                    showCountryCode={true}
                                                    countryCode={dialcode}
                                                    maxlength={14}
                                                />
                                            </View>
                                        </View>
                                        {isValidcell && (
                                            <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterRegular,
                                                        fontSize: 12,
                                                        color: 'red',
                                                    }}>
                                                    {"Enter a valid mobile number"}
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
                                                    label="WhatsApp Number"
                                                    value={whatsappno}
                                                    onChangeText={(val) => {
                                                        const isUSA = dialcode == '+1' ||
                                                            dialcode == '1';
                                                        const formattedValwp = formatPhoneNumber(val, isUSA);
                                                        setWhatsappno(formattedValwp);
                                                    }}
                                                    placeholder=""
                                                    placeholderTextColor="#949494"
                                                    keyboardType="numeric"
                                                    showCountryCode={true}
                                                    countryCode={dialcode}
                                                    maxlength={14}
                                                />
                                            </View>
                                        </View>
                                        {isValidWhatsappNo && (
                                            <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterRegular,
                                                        fontSize: 12,
                                                        color: 'red',
                                                    }}>
                                                    {"Enter a valid WhatsApp number"}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <Buttons
                                        onPress={() => { handleContactTake(); }}
                                        height={normalize(45)}
                                        width={normalize(310)}
                                        backgroundColor={Colorpath.ButtonColr}
                                        borderRadius={normalize(9)}
                                        text="Update"
                                        color={Colorpath.white}
                                        fontSize={18}
                                        fontFamily={Fonts.InterSemiBold}
                                        marginTop={normalize(10)}
                                    />
                                </ScrollView>
                            </KeyboardAvoidingView>
                        </>}

            </SafeAreaView>
            <Modal
                visible={professionModalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeProfessionModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <TouchableOpacity
                            onPress={closeProfessionModal}
                            style={styles.modalClose}
                            activeOpacity={0.8}
                        >
                            <ArrowIcon name="close" size={20} color={Colorpath.white} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>eMedEvents</Text>
                        <Text style={styles.modalMessage}>Please change your Profession & Specialty.</Text>
                        <Buttons
                            onPress={closeProfessionModal}
                            height={normalize(42)}
                            width={normalize(120)}
                            backgroundColor={Colorpath.ButtonColr}
                            borderRadius={normalize(9)}
                            text="Done"
                            color={Colorpath.white}
                            fontSize={16}
                            fontFamily={Fonts.InterSemiBold}
                            marginTop={normalize(18)}
                        />
                    </View>
                </View>
            </Modal>
            <DateTimePickerModal
                isVisible={dobpicker}
                mode="date"
                minimumDate={new Date(1900, 0, 1)}
                maximumDate={new Date()}
                onConfirm={val => {
                    setDobdate(moment(val).format('MMM DD, YYYY'));
                    setDobpicker(false);
                }}
                onCancel={() => setDobpicker(false)}
                textColor="black"
            />
        </>
    )
}

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(24),
    },
    modalCard: {
        width: '100%',
        backgroundColor: Colorpath.white,
        borderRadius: normalize(16),
        paddingHorizontal: normalize(18),
        paddingTop: normalize(18),
        paddingBottom: normalize(22),
        alignItems: 'center',
    },
    modalClose: {
        position: 'absolute',
        right: normalize(10),
        top: normalize(10),
        width: normalize(28),
        height: normalize(28),
        borderRadius: normalize(14),
        backgroundColor: Colorpath.ButtonColr,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        marginTop: normalize(8),
        fontFamily: Fonts.InterSemiBold,
        fontSize: 18,
        color: Colorpath.black,
        textAlign: 'center',
    },
    modalMessage: {
        marginTop: normalize(12),
        fontFamily: Fonts.InterRegular,
        fontSize: 15,
        color: Colorpath.black,
        textAlign: 'center',
        lineHeight: 22,
    },
});

/**
 * Contact default export.
 *
 * @returns {*}
 */
export default ContactProfile
