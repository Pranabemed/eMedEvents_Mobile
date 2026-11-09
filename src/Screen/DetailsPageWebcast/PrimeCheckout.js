/**
 * Prime Checkout screen module.
 * Provides a dedicated checkout page for Prime Membership subscriptions,
 * matching the layout, validation, billing information, and coupon utility
 * of Checkout and CheckoutMain without modifying existing conference logic.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    StyleSheet,
    BackHandler,
    TextInput,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropdownIcon from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TickMark from 'react-native-vector-icons/Ionicons';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import normalize from '../../Utils/Helpers/Dimen';
import InputField from '../../Components/CellInput';
import CustomInputTouchable from '../../Components/IconTextIn';
import CustomInputTouchableY from './Multiple';
import Buttons from '../../Components/Button';
import Loader from '../../Utils/Helpers/Loader';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { formatUsPhone, isUsCallingCode, isValidUsPhone } from '../../Utils/Helpers/UsPhone';
import { getCountryDialCode } from '../../Utils/Helpers/PhoneCountry';
import { isUsCountry } from '../../Utils/Helpers/ApplicableCountry';
import { generateDeviceToken } from '../../Utils/Helpers/FirebaseToken';
import {
    checkstateRequest,
    countryRequest,
    professionRequest,
    specializationRequest,
    stateRequest,
    cityRequest,
    stateSuccess,
    citySuccess,
} from '../../Redux/Reducers/AuthReducer';
import {
    primepromoRequest,
    primetrialCheckRequest,
    saveUserSubscriptionRequest,
} from '../../Redux/Reducers/WebcastReducer';
import ProfessionInPerson from './InPersonProfession';
import CheckoutModalone from './CheckoutModalone';
import ChecktwoCountry from './CheckoutModaltwo';
import CheckStateShow from './CheckoutModalthree';
import CheckThreeCity from './CheckoutModalFourth';
import { searchCountryNameFunction } from './SearchCountryname';
import { searchStateNamePraticeFunction } from './SearchStateNamePratice';
import { searchCityNameFunction } from './SearchCityName';

const formatNumberWithCommas = (value) => {
    if (value == null || value === undefined) return '';
    const stringValue = value.toString().replace(/,/g, '');
    const parts = stringValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

const GOOGLE_API_KEY = 'AIzaSyBDnBivN-fdP6JxOcQFIyvhxIJSArru6Nk';

const BASE_PRIME_PRICE = 99;
const PRIME_PROFESSIONS = ['Physician - DO', 'Physician - DPM', 'Physician - MD'];

const PrimeCheckout = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const WebcastReducer = useSelector(state => state.WebcastReducer);

    // Profile fallback resolution
    const userProfile =
        DashboardReducer?.mainprofileResponse ||
        AuthReducer?.loginResponse?.user ||
        AuthReducer?.dircetloginResponse?.user ||
        AuthReducer?.directloginResponse?.user ||
        AuthReducer?.againloginsiginResponse?.user ||
        AuthReducer?.loginsiginResponse?.user ||
        {};

    const personalInfo = userProfile?.personal_information || userProfile;
    const professionalInfo = userProfile?.professional_information || userProfile;
    const userAddress =
        DashboardReducer?.mainprofileResponse?.user_address ||
        userProfile?.user_address ||
        userProfile?.contact_information ||
        {};
    const contactInfo = userProfile?.user_address || userProfile?.contact_information || userProfile;
    const userLicensure =
        userProfile?.licensures?.[0] ||
        DashboardReducer?.mainprofileResponse?.licensures?.[0] ||
        DashboardReducer?.dashMbResponse?.data?.licensures?.[0] ||
        DashboardReducer?.dashboardResponse?.data?.licensures?.[0] ||
        {};

    // Primary Registrant / Subscriber Form state
    const [firstname, setFirstname] = useState(personalInfo?.firstname || '');
    const [lastname, setLastname] = useState(personalInfo?.lastname || '');
    const [emailad, setEmailad] = useState(personalInfo?.email || userProfile?.email || '');
    const [dialcode, setDialcode] = useState(
        contactInfo?.dialcode ||
        contactInfo?.calling_code ||
        userAddress?.dialcode ||
        userAddress?.calling_code ||
        userProfile?.dialcode ||
        '+1'
    );
    const [cellno, setCellno] = useState(
        contactInfo?.contact_no ||
        contactInfo?.mobile ||
        userAddress?.contact_no ||
        userAddress?.mobile ||
        contactInfo?.phone ||
        userProfile?.phone ||
        userProfile?.mobile ||
        ''
    );
    const [professionad, setProfessionad] = useState(
        PRIME_PROFESSIONS.includes(professionalInfo?.profession_name || userProfile?.profession)
            ? (professionalInfo?.profession_name || userProfile?.profession) : ''
    );
    const [speciality, setSpeciality] = useState(
        professionalInfo?.specialty_name ||
        (Array.isArray(userProfile?.speciality) ? userProfile.speciality.join(', ') : userProfile?.speciality) ||
        ''
    );
    const [speciality_id, setSpeciality_id] = useState(
        Array.isArray(professionalInfo?.specialty_ids)
            ? professionalInfo.specialty_ids
            : Array.isArray(userProfile?.speciality_id)
                ? userProfile.speciality_id
                : Array.isArray(userProfile?.speciality_ids)
                    ? userProfile.speciality_ids
                    : []
    );
    const [address, setAddress] = useState(
        contactInfo?.address || userAddress?.address || userProfile?.address || ''
    );
    const [country, setCountry] = useState(
        contactInfo?.country_name || contactInfo?.country || userAddress?.country_name || userAddress?.country || userProfile?.country || 'United States'
    );
    const [country_id, setCountry_id] = useState(
        contactInfo?.country_id || userAddress?.country_id || userProfile?.country_id || '231'
    );
    const [state, setState] = useState(
        contactInfo?.state_name || contactInfo?.state || userAddress?.state_name || userAddress?.state || userProfile?.state || ''
    );
    const [state_id, setState_id] = useState(
        contactInfo?.state_id || userAddress?.state_id || userProfile?.state_id || ''
    );
    const [city, setCity] = useState(
        contactInfo?.city_name || contactInfo?.city || userAddress?.city_name || userAddress?.city || userProfile?.city || ''
    );
    const [city_id, setCity_id] = useState(
        contactInfo?.city_id || userAddress?.city_id || userProfile?.city_id || ''
    );
    const [zipcode, setZipcode] = useState(
        contactInfo?.zipcode || userAddress?.zipcode || userProfile?.zipcode || ''
    );

    const pendingAddressLocation = useRef(null);
    const [addressFocused, setAddressFocused] = useState(false);

    const [npiNumber, setNpiNumber] = useState(String(professionalInfo?.npi_number || userProfile?.npi_number || ''));
    const [address2, setAddress2] = useState(contactInfo?.address2 || userAddress?.address2 || '');
    const licenseStateEdited = useRef(false);
    const [licenseStateId, setLicenseStateId] = useState('');
    const [licenseState, setLicenseState] = useState('');
    const [licenseNumber, setLicenseNumber] = useState(String(userLicensure?.license_number || professionalInfo?.license_number || userProfile?.license_number || ''));
    const [licenseExpiry, setLicenseExpiry] = useState(userLicensure?.expiry_date || userLicensure?.license_expiry_date || professionalInfo?.license_expiry_date || userProfile?.license_expiry_date || '');
    const [licensePicker, setLicensePicker] = useState(false);
    const [licenseSearch, setLicenseSearch] = useState('');
    const [expiryPicker, setExpiryPicker] = useState(false);
    const licenseRequired = isUsCountry({ country, country_id });
    const licenseStates = Array.isArray(AuthReducer?.checkstateResponse?.states)
        ? AuthReducer.checkstateResponse.states : [];
    const licenseStateLabel = licenseStates.find(item => String(item.id) === String(licenseStateId))?.name || licenseState;

    useEffect(() => {
        dispatch(checkstateRequest('1'));
    }, [dispatch]);

    const dashboardLicense = DashboardReducer?.dashMbResponse?.data?.licensures?.[0] ||
        DashboardReducer?.dashboardResponse?.data?.licensures?.[0] ||
        DashboardReducer?.dashPerResponse?.data?.licensures?.[0] || userLicensure;
    const savedLicenseStateId = dashboardLicense?.license_state_id || dashboardLicense?.state_id || '';
    const savedLicenseStateName = dashboardLicense?.state_name || dashboardLicense?.license_state_name || '';

    useEffect(() => {
        if (licenseStateEdited.current) return;
        const match = licenseStates.find(item =>
            (savedLicenseStateId && String(item.id) === String(savedLicenseStateId)) ||
            (savedLicenseStateName && item.name?.trim().toLowerCase() === savedLicenseStateName.trim().toLowerCase())
        );
        if (match) {
            setLicenseStateId(match.id);
            setLicenseState(match.name);
        } else if (savedLicenseStateName) {
            setLicenseState(savedLicenseStateName);
            setLicenseStateId(savedLicenseStateId);
        }
    }, [savedLicenseStateId, savedLicenseStateName, AuthReducer?.checkstateResponse?.states]);

    const openLicensePicker = () => {
        clearTimeout(focusTimer.current);
        focusedInputRef.current = null;
        Keyboard.dismiss();
        setLicenseSearch('');
        if (!licenseStates.length) dispatch(checkstateRequest('1'));
        setLicensePicker(true);
    };

    // Device token state
    const [deviceToken, setDeviceToken] = useState('');
    useEffect(() => {
        generateDeviceToken().then(tok => {
            if (tok) setDeviceToken(tok);
        }).catch(() => { });
    }, []);

    // Pending payment parameters ref for navigation after saveUser API success
    const pendingPaymentParamsRef = useRef(null);

    const checkoutScrollRef = useRef(null);
    const focusedInputRef = useRef(null);
    const focusTimer = useRef(null);
    const couponPending = useRef(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const scrollToFocusedInput = useCallback(() => {
        clearTimeout(focusTimer.current);
        focusTimer.current = setTimeout(() => {
            if (focusedInputRef.current != null) {
                checkoutScrollRef.current?.scrollResponderScrollNativeHandleToKeyboard(
                    focusedInputRef.current, normalize(24), true
                );
            }
        }, 100);
    }, []);

    const handleInputFocus = event => {
        focusedInputRef.current = event.target;
        scrollToFocusedInput();
    };

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', event => {
            setKeyboardHeight(event.endCoordinates.height);
            scrollToFocusedInput();
        });
        const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
        return () => {
            show.remove();
            hide.remove();
            clearTimeout(focusTimer.current);
        };
    }, [scrollToFocusedInput]);

    // Coupon state
    const [promoEmail, setPromoEmail] = useState(null);
    const effectivePromoEmail = promoEmail ?? emailad;
    const [couponapp, setCouponapp] = useState('');
    const [codesave, setCodesave] = useState('');
    const [savefull, setSavefull] = useState(null);
    const [notadded, setNotadded] = useState(false);
    const [promoAttempted, setPromoAttempted] = useState(false);

    // Form validation errors
    const [errors, setErrors] = useState({});

    // Dropdown / Picker modal visibility states
    const [countrypickerprof, setcountrypickerprof] = useState(false);
    const [statepicker, setstatepicker] = useState(false); // Specialty modal
    const [countrypicker, setCountrypicker] = useState(false);
    const [pratice, setPratice] = useState(false); // State modal
    const [cityPicker, setCityPicker] = useState(false); // City modal

    // Modal data lists & search filters
    const [searchtext, setSearchtext] = useState('');
    const clist = PRIME_PROFESSIONS.filter(item => item.toLowerCase().includes(searchtext.trim().toLowerCase()));
    const [profindex, setProfindex] = useState(0);

    const [slist, setSlist] = useState([]);
    const [searchState, setSearchState] = useState('');
    const [selectedSpecialities, setSelectedSpecialities] = useState([]);

    const [countryall, setCountryall] = useState([]);
    const [countryshow, setCountryshow] = useState([]);
    const [searchcountry, setSearchcountry] = useState('');

    const [slistpratice, setSlistpratice] = useState([]);
    const [statelistpratice, setStatelistpratice] = useState([]);
    const [searchpratice, setSearchpratice] = useState('');

    const [cityAll, setCityAll] = useState([]);
    const [cityshow, setCityshow] = useState([]);
    const [searchcity, setSearchcity] = useState('');

    // Pre-fill profile on mount/change if fields are empty
    useEffect(() => {
        if (!firstname && (personalInfo?.firstname || userProfile?.firstname)) {
            setFirstname(personalInfo?.firstname || userProfile?.firstname);
        }
        if (!lastname && (personalInfo?.lastname || userProfile?.lastname)) {
            setLastname(personalInfo?.lastname || userProfile?.lastname);
        }
        if (!emailad && (personalInfo?.email || userProfile?.email)) {
            setEmailad(personalInfo?.email || userProfile?.email);
        }
        if (!cellno && (contactInfo?.mobile || userProfile?.mobile || contactInfo?.phone || userProfile?.phone)) {
            const rawPhone = contactInfo?.mobile || userProfile?.mobile || contactInfo?.phone || userProfile?.phone;
            setCellno(isUsCallingCode(dialcode) ? formatUsPhone(rawPhone) : rawPhone);
        }
        if (!professionad && PRIME_PROFESSIONS.includes(professionalInfo?.profession_name || userProfile?.profession)) {
            setProfessionad(professionalInfo?.profession_name || userProfile?.profession);
        }
        if (!speciality && (professionalInfo?.specialty_name || userProfile?.speciality)) {
            const specVal =
                professionalInfo?.specialty_name ||
                (Array.isArray(userProfile?.speciality) ? userProfile.speciality.join(', ') : userProfile?.speciality);
            setSpeciality(specVal);
        }
        if (!address && (contactInfo?.address || userProfile?.address)) {
            setAddress(contactInfo?.address || userProfile?.address);
        }
        if (!state && (contactInfo?.state || userProfile?.state)) {
            setState(contactInfo?.state || userProfile?.state);
            setState_id(contactInfo?.state_id || userProfile?.state_id || '');
        }
        if (!city && (contactInfo?.city || userProfile?.city)) {
            setCity(contactInfo?.city || userProfile?.city);
            setCity_id(contactInfo?.city_id || userProfile?.city_id || '');
        }
        if (!zipcode && (contactInfo?.zipcode || userProfile?.zipcode)) {
            setZipcode(contactInfo?.zipcode || userProfile?.zipcode);
        }
    }, [userProfile]);

    // Initial API requests for dropdowns
    useEffect(() => {
        connectionrequest().then(() => {
            dispatch(countryRequest());
            dispatch(professionRequest({}));
            if (country_id) {
                dispatch(stateRequest(country_id));
            }
            if (state_id) {
                dispatch(cityRequest(state_id));
            }
            if (professionad) {
                dispatch(specializationRequest(professionad.split(' - ')[0]));
            }
        }).catch(() => { });
    }, []);

    // Sync options from AuthReducer
    useEffect(() => {
        const options = AuthReducer?.specializationResponse?.specialities;
        if (Array.isArray(options)) {
            setSlist(options);
        }
    }, [AuthReducer?.specializationResponse?.specialities]);

    useEffect(() => {
        const options = AuthReducer?.countryResponse?.countries;
        if (Array.isArray(options)) {
            setCountryshow(options);
            setCountryall(options);
        }
    }, [AuthReducer?.countryResponse?.countries]);

    useEffect(() => {
        const options = AuthReducer?.stateResponse?.states;
        if (Array.isArray(options)) {
            setStatelistpratice(options);
            setSlistpratice(options);
            const pending = pendingAddressLocation.current;
            if (pending?.countryId && !pending.stateId) {
                const match = options.find(item => item.name?.toLowerCase() === pending.state.toLowerCase());
                if (match) {
                    pending.stateId = match.id;
                    setState(match.name);
                    setState_id(match.id);
                    dispatch(cityRequest(match.id));
                }
            }
        }
    }, [AuthReducer?.stateResponse?.states]);

    useEffect(() => {
        const options = AuthReducer?.cityResponse?.cities;
        if (Array.isArray(options)) {
            setCityAll(options);
            setCityshow(options);
            const pending = pendingAddressLocation.current;
            if (pending?.stateId) {
                const match = options.find(item => item.name?.toLowerCase() === pending.city.toLowerCase());
                if (match) {
                    setCity(match.name);
                    setCity_id(match.id);
                    pendingAddressLocation.current = null;
                }
            }
        }
    }, [AuthReducer?.cityResponse?.cities]);

    // A completed HTTP request alone does not confirm a valid promo code.
    useEffect(() => {
        const status = WebcastReducer?.primepromoStatus;
        if (!couponPending.current || !['WebCast/primepromotSuccess', 'WebCast/primepromoFailure'].includes(status)) return;
        couponPending.current = false;
        const result = status === 'WebCast/primepromotSuccess' ? WebcastReducer.primepromoResponse : WebcastReducer.primepromoError;
        const message = typeof result === 'string' ? result :
            [result?.msg, result?.message, result?.code, result?.error].find(value => typeof value === 'string' && value.trim()) || '';
        const explicitlyRejected = result?.success === false || result?.status === false || result?.valid === false ||
            /invalid|not valid|required|expired|not passed|failed|not found/i.test(message);
        const accepted = status === 'WebCast/primepromotSuccess' && !explicitlyRejected && (
            result?.success === true || result?.valid === true || result?.status === true ||
            result?.status === 'success' || /^(successfully applied|valid promo code|promo code is valid)[.!]?$/i.test(message.trim())
        );
        setCodesave(accepted ? message || 'Successfully applied.' : message || 'Unable to validate promo code.');
        setSavefull(accepted ? (result?.data || result) : null);
        setNotadded(accepted);
    }, [WebcastReducer?.primepromoStatus, WebcastReducer?.primepromoResponse, WebcastReducer?.primepromoError]);

    // Handle UserSubscription/saveUser response: "Success then moved Primepaymet"
    useEffect(() => {
        if (
            WebcastReducer?.status === 'WebCast/primetrialCheckSuccess' ||
            WebcastReducer?.status === 'WebCast/saveUserSubscriptionSuccess'
        ) {
            if (pendingPaymentParamsRef.current) {
                const params = pendingPaymentParamsRef.current;
                pendingPaymentParamsRef.current = null;
                navigation.navigate('PrimePayment', params);
            }
        } else if (
            WebcastReducer?.status === 'WebCast/primetrialCheckFailure' ||
            WebcastReducer?.status === 'WebCast/saveUserSubscriptionFailure'
        ) {
            pendingPaymentParamsRef.current = null;
            const errMsg =
                WebcastReducer?.primetrialCheckResponse?.message ||
                WebcastReducer?.saveUserSubscriptionResponse?.message ||
                WebcastReducer?.error?.message ||
                'Failed to save subscriber details. Please try again.';
            showErrorAlert(errMsg);
        }
    }, [WebcastReducer?.status]);

    // Ensure paid Prime checkout does not inherit free trial flags
    useEffect(() => {
        AsyncStorage.removeItem('ExploreTrialClicked').catch(() => {});
    }, []);

    const handleBackPress = useCallback(() => {
        AsyncStorage.removeItem('ExploreTrialClicked').catch(() => {});
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "TabNav", params: { initialRoute: "Home" } }],
                })
            );
        }
    }, [navigation]);

    // Hardware back press handler
    useEffect(() => {
        const backAction = () => {
            if (countrypickerprof) { setcountrypickerprof(false); return true; }
            if (statepicker) { setstatepicker(false); return true; }
            if (countrypicker) { setCountrypicker(false); return true; }
            if (pratice) { setPratice(false); return true; }
            if (licensePicker) { setLicensePicker(false); return true; }
            if (cityPicker) { setCityPicker(false); return true; }
            handleBackPress();
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [countrypickerprof, statepicker, countrypicker, pratice, cityPicker, licensePicker, handleBackPress]);

    // Profession selection
    const handleProfession = (item) => {
        if (!PRIME_PROFESSIONS.includes(item)) return;
        setProfessionad(item);
        setSpeciality('');
        setSpeciality_id([]);
        setSelectedSpecialities([]);
        setErrors(prev => ({ ...prev, profession: undefined, specialty: undefined }));
        dispatch(specializationRequest(item?.split(' - ')[0]));
    };

    const searchCountryNameProfession = (text) => {
        setSearchtext(text);
    };

    // Specialty selection
    const handleSpecialityChange = (index, names, ids) => {
        setSpeciality(names.join(', '));
        setSpeciality_id(ids);
        setErrors(prev => ({ ...prev, specialty: undefined }));
    };

    const handleSpecialitySelect = (selectedItems) => {
        const selectedSpecialitiesNames = selectedItems.map(item => item?.name).join(', ');
        const selectedSpecialityIds = selectedItems.map(item => item?.id);
        setSpeciality(selectedSpecialitiesNames);
        setSpeciality_id(selectedSpecialityIds);
        setErrors(prev => ({ ...prev, specialty: undefined }));
        setstatepicker(false);
        setSearchState('');
        setSelectedSpecialities([]);
    };

    const removeSpeciality = (index, idToRemove) => {
        const ids = Array.isArray(speciality_id) ? speciality_id : [];
        const names = speciality ? speciality.split(', ') : [];
        const filteredIds = ids.filter(id => String(id) !== String(idToRemove));
        const filteredNames = names.filter((_, i) => String(ids[i]) !== String(idToRemove));
        setSpeciality(filteredNames.join(', '));
        setSpeciality_id(filteredIds);
    };

    const handleSearchSpeciality = (text) => {
        setSearchState(text);
    };

    const handlePlaceSelected = (data, details) => {
        if (!details) return;
        const components = details.address_components || [];
        const component = type => components.find(item => item.types?.includes(type));
        const countryName = component('country')?.long_name || '';
        const countryCode = component('country')?.short_name;
        const selectedCountry = countryshow.find(item =>
            item.name?.toLowerCase() === countryName.toLowerCase() ||
            (countryCode === 'US' && ['United States', 'United States of America'].includes(item.name))
        );
        const stateName = component('administrative_area_level_1')?.long_name || '';
        const cityName = component('locality')?.long_name || component('sublocality')?.long_name || component('postal_town')?.long_name || '';
        pendingAddressLocation.current = null;
        if (selectedCountry) {
            handleCountrySet(selectedCountry);
            pendingAddressLocation.current = { countryId: selectedCountry.id, state: stateName, city: cityName };
        } else {
            setCountry(countryName);
            setCountry_id('');
            setState_id('');
            setCity_id('');
            dispatch(stateSuccess({ states: [] }));
            dispatch(citySuccess({ cities: [] }));
        }
        setAddress(details.formatted_address || data?.description || '');
        setState(stateName);
        setCity(cityName);
        setZipcode(component('postal_code')?.long_name || '');
        setErrors(prev => ({ ...prev, address: undefined, country: undefined, state: undefined, city: undefined, zipcode: undefined }));
    };

    // Country selection
    const handleCountrySet = (item) => {
        pendingAddressLocation.current = null;
        setCountry(item?.name);
        setCountry_id(item?.id);
        setDialcode(item?.callingcode ? `+${String(item.callingcode).replace(/^\+/, '')}` : '+1');
        setState('');
        setState_id('');
        setCity('');
        setCity_id('');
        setErrors(prev => ({ ...prev, country: undefined, state: undefined, city: undefined }));
        dispatch(citySuccess({ cities: [] }));
        dispatch(stateSuccess({ states: [] }));
        dispatch(stateRequest(item?.id));
    };

    const handleCountrySearch = (text) => {
        searchCountryNameFunction(text, countryshow, setCountryall, setSearchcountry, () => { });
    };

    // State selection
    const handleStateshows = (item) => {
        pendingAddressLocation.current = null;
        setState(item?.name);
        setState_id(item?.id);
        setCity('');
        setCity_id('');
        setErrors(prev => ({ ...prev, state: undefined, city: undefined }));
        dispatch(citySuccess({ cities: [] }));
        dispatch(cityRequest(item?.id));
    };

    const handleStateSearch = (text) => {
        searchStateNamePraticeFunction(text, statelistpratice, setSlistpratice, setSearchpratice, () => { });
    };

    // City selection
    const handlecityShows = (item) => {
        pendingAddressLocation.current = null;
        setCity(item?.name);
        setCity_id(item?.id);
        setErrors(prev => ({ ...prev, city: undefined }));
    };

    const handleCitySearch = (text) => {
        searchCityNameFunction(text, cityshow, setCityAll, setSearchcity, () => { });
    };

    // Apply coupon API utility
    const applyCoupon = () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effectivePromoEmail.trim())) {
            setCodesave('Please enter a valid Email ID');
            return;
        }
        if (!couponapp?.trim()) {
            showErrorAlert('Please enter a valid coupon');
            return;
        }
        setCodesave('');
        setSavefull(null);
        setNotadded(false);
        setPromoAttempted(true);
        const obj = {
            email: effectivePromoEmail.trim(),
            promo_code: couponapp.trim().toUpperCase(),
        };
        connectionrequest()
            .then(() => {
                couponPending.current = true;
                dispatch(primepromoRequest(obj));
            })
            .catch(err => {
                showErrorAlert('Please connect to internet', err);
            });
    };

    const resetPromoResult = () => {
        couponPending.current = false;
        setPromoAttempted(false);
        setCodesave('');
        setSavefull(null);
        setNotadded(false);
    };

    const removeCoupon = () => {
        setCouponapp('');
        resetPromoResult();
    };

    const handlePromoCodeChange = value => {
        setCouponapp(value.toUpperCase());
        resetPromoResult();
    };

    // Form Validation Logic
    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Primary Registrant validations
        if (!firstname.trim()) newErrors.firstname = 'Please enter First Name';
        if (!lastname.trim()) newErrors.lastname = 'Please enter Last Name';
        if (!emailad.trim()) {
            newErrors.emailad = 'Please enter Email ID';
        } else if (!emailRegex.test(emailad.trim())) {
            newErrors.emailad = 'Please enter a valid Email ID';
        }

        const isUSA = isUsCountry({ country, country_id });
        const cleanPhone = String(cellno || '').replace(/[^0-9]/g, '');
        if (!cellno.trim()) {
            newErrors.cellno = 'Please enter Cell Phone';
        } else if (isUSA && !isValidUsPhone(cellno)) {
            newErrors.cellno = 'Please enter a valid 10-digit Cell Phone';
        } else if (!isUSA && (cleanPhone.length < 7 || cleanPhone.length > 15)) {
            newErrors.cellno = 'Please enter a valid Cell Phone';
        }

        if (!PRIME_PROFESSIONS.includes(professionad)) newErrors.profession = 'Please select Physician - DO, DPM or MD';
        if (!speciality.trim() || !Array.isArray(speciality_id) || !speciality_id.length) newErrors.specialty = 'Please select Specialty';
        if (!address.trim()) newErrors.address = 'Please enter Contact Address';
        if (!country.trim() || !country_id) newErrors.country = 'Please select Country';
        if (!state.trim() || !state_id) newErrors.state = 'Please select State';
        if (!city.trim() || !city_id) newErrors.city = 'Please select City';
        if (!zipcode.trim()) {
            newErrors.zipcode = 'Please enter Zipcode';
        } else if (isUSA && !/^(\d{5,6}|\d{5}-\d{4})$/.test(zipcode.trim())) {
            newErrors.zipcode = 'Please enter a 5 or 6-digit ZIP code, or ZIP+4';
        }

        if (npiNumber.trim() && !/^\d{10}$/.test(npiNumber.trim())) {
            newErrors.npiNumber = 'Please enter a 10-digit NPI Number';
        }
        if (licenseRequired || licenseStateId || licenseNumber.trim() || licenseExpiry) {
            if (!licenseStateId) newErrors.licenseState = 'Please select Medical License State';
            if (!licenseNumber.trim()) newErrors.licenseNumber = 'Please enter License Number';
            const expiry = moment(licenseExpiry, [moment.ISO_8601, 'YYYY-MM-DD'], true);
            if (!licenseExpiry) newErrors.licenseExpiry = 'Please select License Expiry Date';
            else if (!expiry.isValid() || expiry.isBefore(moment(), 'day')) {
                newErrors.licenseExpiry = 'Please select a valid, unexpired license date';
            }
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstErrorMessage = Object.values(newErrors)[0];
            showErrorAlert(firstErrorMessage);
            return false;
        }
        return true;
    };

    // Calculate dynamic pricing
    const grossPrice = BASE_PRIME_PRICE;
    const discountAmount = Number(savefull?.discount_value || 0);
    const finalTotalAmount =
        savefull?.total_value != null
            ? Number(savefull.total_value)
            : Math.max(0, grossPrice - discountAmount);

    // Proceed to Payment handler
    const handleProceedToPayment = () => {
        if (!validateForm()) {
            return;
        }

        const formattedPhone = isUsCountry({ country, country_id }) ? formatUsPhone(cellno) : cellno.trim();

        const subscriberData = {
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            email: emailad.trim(),
            phone: formattedPhone,
            dialcode,
            profession: professionad,
            specialty: speciality,
            speciality_ids: speciality_id,
            npi_number: npiNumber.trim(),
            license_state_id: licenseStateId,
            license_number: licenseNumber.trim(),
            license_expiry_date: licenseExpiry,
            address: address.trim(),
            address2: address2.trim(),
            country,
            country_id,
            state,
            state_id,
            city,
            city_id,
            zipcode: zipcode.trim(),
        };

        const billingData = {
            address: address.trim(),
            address2: address2.trim(),
            country,
            country_id,
            state,
            state_id,
            city,
            city_id,
            zipcode: zipcode.trim(),
            sameAsPrimary: true,
        };

        const couponData = savefull ? {
            couponcode: couponapp.trim(),
            discount: discountAmount,
            total: finalTotalAmount,
        } : null;

        // Save pending payment navigation params for after saveUser succeeds
        pendingPaymentParamsRef.current = {
            subscriberData,
            billingData,
            couponData,
            totalAmount: finalTotalAmount,
        };

        const resolvedSpecialties = (Array.isArray(speciality_id) ? speciality_id : [])
            .map(item => (typeof item === 'object' && item !== null ? item.id : item))
            .filter(Boolean)
            .map(String);

        // Construct exact UserSubscription/saveUser API payload
        const saveUserPayload = {
            first_name: firstname.trim(),
            last_name: lastname.trim(),
            email: emailad.trim(),
            profession: professionad,
            speciality: resolvedSpecialties,
            npi_number: npiNumber.trim() || null,
            phone: formattedPhone,
            license_state_id: String(licenseStateId || ''),
            license_number: licenseNumber.trim(),
            license_expiry_date: licenseExpiry ? moment(licenseExpiry).toISOString() : '',
            address: address.trim(),
            address2: address2.trim(),
            country: String(country_id || ''),
            state: String(state_id || ''),
            city: String(city_id || ''),
            zipcode: zipcode.trim(),
            bill_address: address.trim(),
            bill_address2: address2.trim(),
            bill_country: String(country_id || ''),
            bill_state: String(state_id || ''),
            bill_city: String(city_id || ''),
            bill_zipcode: zipcode.trim(),
            deviceType: Platform.OS === 'web' ? 'web_chrome' : Platform.OS === 'ios' ? 'iOS' : 'Android',
            deviceToken: deviceToken || '',
        };

        console.log('UserSubscription/saveUser payload:', saveUserPayload);

        connectionrequest()
            .then(() => {
                dispatch(primetrialCheckRequest(saveUserPayload));
            })
            .catch(err => {
                showErrorAlert('Please connect to internet', err);
            });
    };

    const allPickersClosed =
        !countrypickerprof && !statepicker && !countrypicker && !pratice && !cityPicker && !licensePicker;

    // Synthetic attendee data for reusable specialty chip rendering
    const dummyFormData = [
        {
            speciality,
            speciality_ids: Array.isArray(speciality_id) ? speciality_id : [],
        },
    ];

    const isCouponLoading = WebcastReducer?.primepromoStatus === 'WebCast/primepromoRequest';
    const isSaveUserLoading =
        WebcastReducer?.status === 'WebCast/primetrialCheckRequest' ||
        WebcastReducer?.status === 'WebCast/saveUserSubscriptionRequest';

    return (
        <>
            <MyStatusBar
                barStyle="light-content"
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    style={styles.keyboardContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    {allPickersClosed && (
                        <PageHeader
                            title="Checkout"
                            onBackPress={handleBackPress}
                        />
                    )}

                    <Loader visible={isCouponLoading || isSaveUserLoading} />

                    <ScrollView
                        ref={checkoutScrollRef}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[styles.scrollContent, { paddingBottom: keyboardHeight ? normalize(100) : normalize(40) }]}
                        style={{ display: allPickersClosed ? 'flex' : 'none' }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Top Prime Membership Card */}
                        <View style={styles.topCard}>
                            <View style={styles.cartIconContainer}>
                                <Image
                                    source={Imagepath.CartPng}
                                    style={styles.cartIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={styles.topCardDetails}>
                                <Text style={styles.primeCardTitle}>Prime Membership</Text>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Amount - </Text>
                                    <Text style={styles.detailValue}>US$99</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Subscription: </Text>
                                    <Text style={styles.detailValue}>12 Months</Text>
                                </View>
                            </View>
                        </View>

                        {/* Stepper / Tab Indicator */}
                        {/* <View style={styles.stepperContainer}>
                            <View style={styles.stepperCard}>
                                <Text style={styles.stepperTitle}>Subscriber Information</Text>
                                <View style={styles.stepperLineRow}>
                                    <View style={styles.stepperLine} />
                                    <View style={styles.stepperCircleOuter}>
                                        <View style={styles.stepperCircleInner} />
                                    </View>
                                </View>
                            </View>
                        </View> */}

                        {/* Informational Guidance Notice (matches CheckoutMain) */}
                        {/* <View style={styles.infoBanner}>
                            <Image
                                source={Imagepath.Info}
                                style={styles.infoIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.infoText}>
                                Please fill in the registrant information, mailing address, and billing information and proceed to complete the payment.
                            </Text>
                        </View> */}

                        {/* Form Section: Subscriber Information */}
                        <View style={styles.subscriberCard}>
                            <Text style={styles.subscriberCardTitle}>Subscriber Information</Text>

                            {/* First Name */}
                            <View style={styles.fieldWrapper}>
                                <InputField onFocus={handleInputFocus}
                                    label="First Name*"
                                    value={firstname}
                                    onChangeText={(val) => {
                                        setFirstname(val);
                                        if (errors.firstname) setErrors(prev => ({ ...prev, firstname: undefined }));
                                    }}
                                    placeholder=""
                                    placeholderTextColor="#949494"
                                    keyboardType="default"
                                    showCountryCode={false}
                                    maxlength={100}
                                />
                                {errors.firstname && (
                                    <Text style={styles.errorText}>{errors.firstname}</Text>
                                )}
                            </View>

                            {/* Last Name */}
                            <View style={styles.fieldWrapper}>
                                <InputField onFocus={handleInputFocus}
                                    label="Last Name*"
                                    value={lastname}
                                    onChangeText={(val) => {
                                        setLastname(val);
                                        if (errors.lastname) setErrors(prev => ({ ...prev, lastname: undefined }));
                                    }}
                                    placeholder=""
                                    placeholderTextColor="#949494"
                                    keyboardType="default"
                                    showCountryCode={false}
                                    maxlength={100}
                                />
                                {errors.lastname && (
                                    <Text style={styles.errorText}>{errors.lastname}</Text>
                                )}
                            </View>

                            {/* Email ID */}
                            <View style={styles.fieldWrapper}>
                                <InputField onFocus={handleInputFocus}
                                    label="Email ID*"
                                    value={emailad}
                                    onChangeText={(val) => {
                                        setEmailad(val);
                                        if (errors.emailad) setErrors(prev => ({ ...prev, emailad: undefined }));
                                    }}
                                    placeholder=""
                                    placeholderTextColor="#949494"
                                    keyboardType="email-address"
                                    showCountryCode={false}
                                    maxlength={100}
                                    editable={!personalInfo?.email}
                                />
                                {errors.emailad && (
                                    <Text style={styles.errorText}>{errors.emailad}</Text>
                                )}
                            </View>

                            {/* Cell Phone */}
                            <View style={styles.fieldWrapper}>
                                <InputField onFocus={handleInputFocus}
                                    label="Cell Number*"
                                    value={cellno}
                                    onChangeText={(val) => {
                                        const isUSA = isUsCountry({ country, country_id });
                                        const formatted = isUSA ? formatUsPhone(val) : String(val).replace(/[^0-9]/g, '');
                                        setCellno(formatted);
                                        if (errors.cellno) setErrors(prev => ({ ...prev, cellno: undefined }));
                                    }}
                                    placeholder=""
                                    placeholderTextColor="#949494"
                                    keyboardType="phone-pad"
                                    showCountryCode={true}
                                    countryCode={dialcode || getCountryDialCode({ country, country_id })}
                                    phoneCountry={{ country, country_id }}
                                    maxlength={isUsCallingCode(dialcode) ? 14 : 12}
                                />
                                {errors.cellno && (
                                    <Text style={styles.errorText}>{errors.cellno}</Text>
                                )}
                            </View>

                            <View style={styles.fieldWrapper}>
                                <InputField onFocus={handleInputFocus} label="NPI Number" value={npiNumber}
                                    onChangeText={val => { setNpiNumber(val); setErrors(prev => ({ ...prev, npiNumber: undefined })); }}
                                    placeholder="" showCountryCode={false} keyboardType="number-pad" maxlength={10} />
                                {errors.npiNumber && <Text style={styles.errorText}>{errors.npiNumber}</Text>}
                            </View>

                            {/* Profession */}
                            <View style={styles.fieldWrapper}>
                                <CustomInputTouchable
                                    label="Profession*"
                                    showRequiredMark
                                    value={professionad}
                                    placeholder=""
                                    placeholderTextColor="#949494"
                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                    onPress={() => setcountrypickerprof(true)}
                                    onIconpres={() => setcountrypickerprof(true)}
                                />
                                {errors.profession && (
                                    <Text style={styles.errorText}>{errors.profession}</Text>
                                )}
                            </View>

                            {/* Specialty */}
                            <View style={styles.fieldWrapper}>
                                <CustomInputTouchableY
                                    disabled={!professionad}
                                    label="Specialty*"
                                    showRequiredMark
                                    value={speciality ? ' ' : ''}
                                    placeholder=""
                                    placeholderTextColor="#949494"
                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                    onPress={() => setstatepicker(true)}
                                    onIconpres={() => setstatepicker(true)}
                                    chipData={0}
                                    index={0}
                                    formData={dummyFormData}
                                >
                                    <View style={styles.chipWrapper}>
                                        {(Array.isArray(speciality_id) ? speciality_id : []).map((id, i) => (
                                            <View key={id} style={styles.chip}>
                                                <Text style={styles.chipText}>
                                                    {speciality.split(', ')[i] || ''}
                                                </Text>
                                                <TouchableOpacity
                                                    style={styles.chipRemove}
                                                    onPress={() => removeSpeciality(0, id)}
                                                >
                                                    <Icon name="close" size={15} color="#000" />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </CustomInputTouchableY>
                                {errors.specialty && (
                                    <Text style={styles.errorText}>{errors.specialty}</Text>
                                )}
                            </View>

                            <View style={styles.fieldWrapper}>
                                <CustomInputTouchable label={`Medical License State${licenseRequired ? '*' : ''}`}
                                    showRequiredMark={licenseRequired} value={licenseStateLabel}
                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                    onPress={openLicensePicker} onIconpres={openLicensePicker} />
                                {errors.licenseState && <Text style={styles.errorText}>{errors.licenseState}</Text>}
                            </View>
                            <View style={styles.fieldWrapper}>
                                <InputField onFocus={handleInputFocus} label={`License Number${licenseRequired ? '*' : ''}`} value={licenseNumber}
                                    onChangeText={val => { setLicenseNumber(val); setErrors(prev => ({ ...prev, licenseNumber: undefined })); }}
                                    placeholder="" showCountryCode={false} maxlength={50} />
                                {errors.licenseNumber && <Text style={styles.errorText}>{errors.licenseNumber}</Text>}
                            </View>
                            <View style={styles.fieldWrapper}>
                                <CustomInputTouchable label={`License Expiry Date${licenseRequired ? '*' : ''}`}
                                    showRequiredMark={licenseRequired}
                                    value={licenseExpiry && moment(licenseExpiry).isValid() ? moment(licenseExpiry).format('MM-DD-YYYY') : ''}
                                    rightIcon={<Icon name="date-range" size={25} color="#949494" />}
                                    onPress={() => setExpiryPicker(true)} onIconpres={() => setExpiryPicker(true)} />
                                {errors.licenseExpiry && <Text style={styles.errorText}>{errors.licenseExpiry}</Text>}
                            </View>
                        </View>
                        <View style={[styles.formContainer, styles.contactSection]}>
                            <Text style={styles.sectionHeader}>Contact Address</Text>

                            {/* Contact Address */}
                            <View style={styles.fieldWrapper}>
                                <View style={styles.addressInput}>
                                    {(addressFocused || Boolean(address)) && <Text style={styles.addressLabel}>Address 1*</Text>}
                                    <GooglePlacesAutocomplete
                                        placeholder={addressFocused || address ? '' : 'Address 1*'}
                                        fetchDetails
                                        onPress={handlePlaceSelected}
                                        query={{ key: GOOGLE_API_KEY, language: 'en' }}
                                        debounce={300}
                                        keyboardShouldPersistTaps="handled"
                                        styles={{ textInput: styles.addressTextInput }}
                                        textInputProps={{
                                            value: address,
                                            multiline: true,
                                            maxLength: 300,
                                            placeholderTextColor: '#999999',
                                            onFocus: event => { setAddressFocused(true); handleInputFocus(event); },
                                            onBlur: () => setAddressFocused(false),
                                            onChangeText: val => {
                                                setAddress(val);
                                                if (errors.address) setErrors(prev => ({ ...prev, address: undefined }));
                                            },
                                        }}
                                    />
                                </View>
                                {errors.address && (
                                    <Text style={styles.errorText}>{errors.address}</Text>
                                )}
                            </View>

                            <View style={styles.fieldWrapper}>
                                <InputField onFocus={handleInputFocus} label="Address 2" value={address2}
                                    onChangeText={val => { setAddress2(val); setErrors(prev => ({ ...prev, address2: undefined })); }}
                                    placeholder="" showCountryCode={false} multiline maxlength={300} />
                                {errors.address2 && <Text style={styles.errorText}>{errors.address2}</Text>}
                            </View>

                            {/* Country */}
                            <View style={styles.fieldWrapper}>
                                <CustomInputTouchable
                                    label="Country*"
                                    showRequiredMark
                                    value={country}
                                    placeholder=""
                                    placeholderTextColor="#949494"
                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                    onPress={() => setCountrypicker(true)}
                                    onIconpres={() => setCountrypicker(true)}
                                />
                                {errors.country && (
                                    <Text style={styles.errorText}>{errors.country}</Text>
                                )}
                            </View>

                            {/* State */}
                            <View style={styles.fieldWrapper}>
                                <CustomInputTouchable
                                    disabled={!country_id}
                                    label="State*"
                                    showRequiredMark
                                    value={state}
                                    placeholder=""
                                    placeholderTextColor="#949494"
                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                    onPress={() => setPratice(true)}
                                    onIconpres={() => setPratice(true)}
                                />
                                {errors.state && (
                                    <Text style={styles.errorText}>{errors.state}</Text>
                                )}
                            </View>

                            {/* City */}
                            <View style={styles.fieldWrapper}>
                                <CustomInputTouchable
                                    disabled={!country_id || !state_id}
                                    label="City*"
                                    showRequiredMark
                                    value={city}
                                    placeholder=""
                                    placeholderTextColor="#949494"
                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                    onPress={() => setCityPicker(true)}
                                    onIconpres={() => setCityPicker(true)}
                                />
                                {errors.city && (
                                    <Text style={styles.errorText}>{errors.city}</Text>
                                )}
                            </View>

                            {/* Zipcode */}
                            <View style={styles.fieldWrapper}>
                                <InputField onFocus={handleInputFocus}
                                    label="Zipcode*"
                                    value={zipcode}
                                    onChangeText={(val) => {
                                        setZipcode(val);
                                        if (errors.zipcode) setErrors(prev => ({ ...prev, zipcode: undefined }));
                                    }}
                                    placeholder=""
                                    placeholderTextColor="#949494"
                                    keyboardType="default"
                                    showCountryCode={false}
                                    maxlength={10}
                                />
                                {errors.zipcode && (
                                    <Text style={styles.errorText}>{errors.zipcode}</Text>
                                )}
                            </View>
                        </View>

                        {/* Billing Information Section (matches CheckoutMain: only text, no input box) */}
                        <View style={{ paddingVertical: normalize(10), marginTop: normalize(8) }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 16,
                                    color: '#333',
                                    fontWeight: 'bold',
                                }}
                            >
                                {'Billing Information'}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginBottom: normalize(8) }}>
                            <View style={{ flexDirection: 'row', flex: 1, paddingVertical: normalize(5), alignItems: 'center' }}>
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: Colorpath.ButtonColr,
                                    borderColor: Colorpath.ButtonColr,
                                    height: normalize(17),
                                    width: normalize(17),
                                    flexShrink: 0,
                                    borderRadius: normalize(5),
                                    borderWidth: normalize(0.5),
                                }}>
                                    <TickMark name="checkmark" color={Colorpath.white} size={15} />
                                </View>
                                <View style={{ flex: 1, paddingLeft: normalize(6) }}>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: '#000000' }}>
                                        {'Same as contact address'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Apply Coupon Section (matches CheckoutMain) */}
                        <View style={[styles.formContainer, { marginTop: normalize(16) }]}>
                            <Text style={styles.couponSectionTitle}>Apply Promocode</Text>
                            <TextInput
                                accessibilityLabel="Promo email"
                                accessibilityState={{ disabled: true }}
                                value={effectivePromoEmail}
                                onChangeText={value => { setPromoEmail(value); resetPromoResult(); }}
                                onFocus={handleInputFocus}
                                placeholder="Email ID"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={false}
                                style={styles.promoField}
                            />
                            <TextInput
                                accessibilityLabel="Promo code"
                                value={couponapp}
                                onChangeText={handlePromoCodeChange}
                                onFocus={handleInputFocus}
                                placeholder="PROMOCODE"
                                autoCapitalize="characters"
                                autoCorrect={false}
                                maxLength={30}
                                editable={!isCouponLoading}
                                style={styles.promoField}
                            />
                            <TouchableOpacity
                                accessibilityRole="button"
                                disabled={isCouponLoading}
                                onPress={promoAttempted ? removeCoupon : applyCoupon}
                                style={[styles.promoApply, promoAttempted && !isCouponLoading && { backgroundColor: '#D32F2F' }, isCouponLoading && { opacity: 0.5 }]}
                            >
                                <Text style={styles.couponBtnText}>{isCouponLoading ? 'Applying...' : promoAttempted ? 'Remove' : 'Apply'}</Text>
                            </TouchableOpacity>

                            {codesave ? (
                                <View style={styles.couponMsgContainer}>
                                    <Text style={[
                                        styles.couponMsgText,
                                        { color: notadded ? '#009E38' : 'red' }
                                    ]}>
                                        {codesave}
                                    </Text>
                                </View>
                            ) : null}

                            {/* Pricing breakdown */}
                            <View style={styles.pricingContainer}>
                                <View style={styles.priceRow}>
                                    <Text style={styles.priceItemName}>Prime Membership</Text>
                                    <Text style={styles.priceItemAmount}>US$99</Text>
                                </View>

                                {discountAmount > 0 && (
                                    <View style={styles.priceRow}>
                                        <Text style={styles.priceItemName}>Discount (-)</Text>
                                        <Text style={styles.priceDiscountAmount}>
                                            {`US$${formatNumberWithCommas(discountAmount)}`}
                                        </Text>
                                    </View>
                                )}

                                <View style={styles.priceDivider} />

                                <View style={styles.priceRow}>
                                    <Text style={styles.totalAmountLabel}>Total Amount</Text>
                                    <Text style={styles.totalAmountValue}>
                                        {`US$${formatNumberWithCommas(finalTotalAmount)}`}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Proceed to Payment Button */}
                        <View style={styles.buttonContainer}>
                            <Buttons
                                onPress={handleProceedToPayment}
                                height={normalize(45)}
                                width={normalize(300)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(9)}
                                text="Proceed to Payment"
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                            />
                        </View>
                    </ScrollView>

                    <DateTimePickerModal isVisible={expiryPicker} mode="date"
                        minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
                        date={licenseExpiry && moment(licenseExpiry).isValid() && !moment(licenseExpiry).isBefore(moment(), 'day') ? moment(licenseExpiry).toDate() : new Date()}
                        onCancel={() => setExpiryPicker(false)}
                        onConfirm={date => {
                            setLicenseExpiry(moment(date).format('YYYY-MM-DD'));
                            setExpiryPicker(false);
                            setErrors(prev => ({ ...prev, licenseExpiry: undefined }));
                        }} />
                    {licensePicker && <CheckStateShow standardized required={licenseRequired}
                        pratice={licensePicker} setPratice={setLicensePicker}
                        searchpratice={licenseSearch} setSearchState={setLicenseSearch}
                        searchStateNamePratice={setLicenseSearch} activeIndex={0}
                        slistpratice={licenseStates.filter(item => item.name?.toLowerCase().includes(licenseSearch.toLowerCase()))}
                        handleStateshows={item => {
                            licenseStateEdited.current = true;
                            setLicenseState(item.name);
                            setLicenseStateId(item.id);
                            setErrors(prev => ({ ...prev, licenseState: undefined }));
                        }} />}
                    {/* Modals for selection */}
                    {countrypickerprof && (
                        <ProfessionInPerson
                            setcountrypicker={setcountrypickerprof}
                            searchtext={searchtext}
                            searchCountryName={searchCountryNameProfession}
                            clist={clist}
                            handleProfession={handleProfession}
                            setProfindex={setProfindex}
                            profindex={profindex}
                            setSearchtext={setSearchtext}
                            countrypickerprof={countrypickerprof}
                        />
                    )}

                    {statepicker && (
                        <CheckoutModalone
                            formData={dummyFormData}
                            statepicker={statepicker}
                            setstatepicker={setstatepicker}
                            setSearchState={setSearchState}
                            searchState={searchState}
                            searchStateName={handleSearchSpeciality}
                            slist={slist}
                            handleSpecialitySelect={handleSpecialitySelect}
                            handleSpecialityChange={handleSpecialityChange}
                            selectedSpecialities={selectedSpecialities}
                            setSelectedSpecialities={setSelectedSpecialities}
                            removeSpeciality={removeSpeciality}
                            activeIndex={0}
                            setFormData={() => { }}
                            speciality_id={speciality_id}
                            speciality={speciality}
                            previousSpec=""
                        />
                    )}

                    {countrypicker && (
                        <ChecktwoCountry
                            standardized
                            countrypicker={countrypicker}
                            setSearchcountry={setSearchcountry}
                            activeIndex={0}
                            searchcountry={searchcountry}
                            handleCountrySet={handleCountrySet}
                            setCountrypicker={setCountrypicker}
                            searchCountryName={handleCountrySearch}
                            countryall={countryall}
                        />
                    )}

                    {pratice && (
                        <CheckStateShow
                            standardized
                            pratice={pratice}
                            setSearchState={setSearchpratice}
                            activeIndex={0}
                            searchpratice={searchpratice}
                            handleStateshows={handleStateshows}
                            setPratice={setPratice}
                            searchStateNamePratice={handleStateSearch}
                            slistpratice={slistpratice}
                        />
                    )}

                    {cityPicker && (
                        <CheckThreeCity
                            standardized
                            handlecityShows={handlecityShows}
                            cityPicker={cityPicker}
                            setCityPicker={setCityPicker}
                            setSearchcity={setSearchcity}
                            searchcity={searchcity}
                            searchCityName={handleCitySearch}
                            cityAll={cityAll}
                            activeIndex={0}
                        />
                    )}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colorpath.white,
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: normalize(10),
        paddingTop: normalize(12),
        paddingBottom: normalize(40),
    },
    topCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(8),
        padding: normalize(14),
        borderWidth: 1,
        borderColor: '#E8E8E8',
        marginBottom: normalize(16),
    },
    cartIconContainer: {
        width: normalize(70),
        height: normalize(70),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(14),
    },
    cartIcon: {
        width: normalize(65),
        height: normalize(65),
    },
    topCardDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    primeCardTitle: {
        fontFamily: Fonts.InterBold,
        fontSize: normalize(17),
        color: '#FF773D',
        marginBottom: normalize(4),
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: normalize(1),
    },
    detailLabel: {
        fontFamily: Fonts.InterMedium,
        fontSize: normalize(14),
        color: '#000000',
    },
    detailValue: {
        fontFamily: Fonts.InterBold,
        fontSize: normalize(14),
        color: '#FF773D',
    },
    stepperContainer: {
        marginBottom: normalize(14),
    },
    stepperCard: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: normalize(8),
        paddingHorizontal: normalize(14),
        paddingTop: normalize(12),
        paddingBottom: normalize(10),
        backgroundColor: '#FFFFFF',
    },
    stepperTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(14),
        color: '#FF773D',
        marginBottom: normalize(8),
    },
    stepperLineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    stepperLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#FF773D',
    },
    stepperCircleOuter: {
        width: normalize(12),
        height: normalize(12),
        borderRadius: normalize(6),
        borderWidth: 2,
        borderColor: '#FF773D',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -1,
    },
    stepperCircleInner: {
        width: normalize(4),
        height: normalize(4),
        borderRadius: normalize(2),
        backgroundColor: '#FF773D',
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: normalize(10),
        borderRadius: normalize(8),
        marginBottom: normalize(14),
        borderWidth: 0.5,
        borderColor: '#E2E8F0',
    },
    infoIcon: {
        height: normalize(18),
        width: normalize(18),
        marginRight: normalize(8),
    },
    infoText: {
        fontFamily: Fonts.InterMedium,
        fontSize: normalize(12),
        color: '#333333',
        flex: 1,
        lineHeight: normalize(17),
    },
    subscriberCard: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: normalize(8),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(14),
        marginBottom: normalize(14),
    },
    subscriberCardTitle: {
        fontFamily: Fonts.InterBold,
        fontSize: 16,
        color: '#333333',
        fontWeight: 'bold',
        marginBottom: normalize(12),
        letterSpacing: 0.5,
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 0,
        paddingVertical: normalize(10),
    },
    contactSection: {
        marginTop: normalize(12),
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
    },
    sectionHeader: {
        fontFamily: Fonts.InterMedium,
        fontSize: 16,
        color: '#000000',
        textAlign: 'left',
        paddingVertical: normalize(10),
    },
    addressInput: {
        marginBottom: normalize(16),
        paddingTop: normalize(24),
        borderBottomWidth: 0.8,
        borderBottomColor: '#000000',
    },
    addressLabel: {
        position: 'absolute',
        top: 0,
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        color: '#999999',
    },
    addressTextInput: {
        paddingHorizontal: 0,
        fontFamily: Fonts.InterRegular,
        fontSize: 15,
        color: '#000000',
        height: 'auto',
        minHeight: normalize(30),
    },
    fieldWrapper: {
        width: '100%',
    },
    errorText: {
        fontFamily: Fonts.InterRegular,
        fontSize: normalize(11),
        color: '#FF0000',
        bottom: normalize(10),
    },
    chipWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '100%',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0E0E0',
        padding: normalize(5),
        marginRight: normalize(5),
        marginBottom: normalize(5),
        borderRadius: normalize(5),
        maxWidth: '100%',
    },
    chipText: {
        fontSize: normalize(12),
        color: '#000',
        marginRight: normalize(5),
        flexShrink: 1,
    },
    chipRemove: {
        height: normalize(20),
        width: normalize(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    promoField: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#888888',
        borderRadius: normalize(4),
        minHeight: normalize(40),
        paddingHorizontal: normalize(10),
        marginBottom: normalize(5),
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        color: '#333333',
    },
    promoApply: {
        backgroundColor: '#304BBE',
        borderRadius: normalize(3),
        minHeight: normalize(34),
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    couponSectionTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(14),
        color: '#666666',
        marginBottom: normalize(8),
    },
    couponInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#666666',
        borderRadius: normalize(10),
        height: normalize(45),
        overflow: 'hidden',
    },
    couponInput: {
        flex: 1,
        height: normalize(45),
        paddingHorizontal: normalize(12),
        color: '#000000',
        fontFamily: Fonts.InterMedium,
        fontSize: normalize(15),
    },
    couponActionBtn: {
        height: normalize(45),
        paddingHorizontal: normalize(18),
        justifyContent: 'center',
        alignItems: 'center',
    },
    couponBtnText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(15),
        color: '#FFFFFF',
    },
    couponMsgContainer: {
        paddingVertical: normalize(6),
    },
    couponMsgText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(13),
    },
    pricingContainer: {
        marginTop: normalize(14),
        paddingTop: normalize(10),
        borderTopWidth: 0.5,
        borderTopColor: '#EEEEEE',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: normalize(5),
    },
    priceItemName: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(14),
        color: Colorpath.black,
        fontWeight: 'bold',
    },
    priceItemAmount: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(14),
        color: Colorpath.black,
        fontWeight: 'bold',
    },
    priceDiscountAmount: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(14),
        color: '#009E38',
        fontWeight: 'bold',
    },
    priceDivider: {
        height: 1,
        width: '100%',
        backgroundColor: '#DDDDDD',
        marginVertical: normalize(8),
    },
    totalAmountLabel: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(18),
        color: Colorpath.black,
        fontWeight: 'bold',
    },
    totalAmountValue: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(18),
        color: Colorpath.black,
        fontWeight: 'bold',
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: normalize(20),
        marginBottom: normalize(10),
    },
});

export default PrimeCheckout;
