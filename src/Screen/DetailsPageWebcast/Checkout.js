/**
 * Checkout screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, status1, GOOGLE_API_KEY, GUEST_REGISTRATION_FLOW_KEY, Checkout, cleanNumber, getRouteTransactionFee, buildPaymentPrice, persistGuestRegistrationSession, checkoutClear, handleSearch, handleCountry, handlePratice, handlePraticeLic, handleCity, toggleModalPaymentfree, toggleModalFailedfree, resetGuestCheckoutFields, searchCountryNameProfession, handleProfession, onBackPress, loadGuestRegistrationFlow, token_handle_vault, defaultCountryToGeo, clean, specaillized, countryReq, PraticingState, LicStateTakeDo, cityReq, handleFree, statusCheck, allTicketsFree, formatPhoneNumberno, formatIndianPhoneNumber, showModal, isUSASelected, getRequiredFieldsForAttendee, handleInputChange, validateEmail, validateCellNo, validateSingleAttendee, emailCheck, sendEmailCheckRequests, mergeCustomFieldsWithLabels, handleInputChangeeamilad, proceedPayment, convertToISODate, allTicketsFreeac, cartPayment, handleSpecialitySelect, handleSpecialityChange, removeSpeciality, formatPhoneNumber, handleCountrySet, handleStateshows, handleLicStateshows, handleLicDate, handleDobDate, handlecityShows, applyCoupon, styles.
 */

import { TouchableOpacity, Text, View, Image, Platform, KeyboardAvoidingView, ActivityIndicator, Alert, StyleSheet, BackHandler } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import PageHeader from '../../Components/PageHeader'
import Colorpath from '../../Themes/Colorpath'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import constants from '../../Utils/Helpers/constants';
import { checkstateRequest, cityRequest, countryRequest, professionRequest, specializationRequest, stateRequest, tokenSuccess } from '../../Redux/Reducers/AuthReducer';
import { isNonUsaAccount, readNonUsaFlowState, writeNonUsaFlowState } from '../../Utils/Helpers/nonUsaFlow';
import { getCountryAndDialCode } from '../../Utils/Helpers/IPServer';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { cancelcouponRequest, cartCheckoutRequest, couponWebcastRequest, FreeTransRequest, saveRegistRequest, StatusPaymentRequest, TransemailcheckRequest } from '../../Redux/Reducers/WebcastReducer';
import Loader from '../../Utils/Helpers/Loader';
import CheckoutModalone from './CheckoutModalone';
import CheckoutModaltwo from './CheckoutModaltwo';
import CheckoutModalthree from './CheckoutModalthree';
import CheckoutModalFourth from './CheckoutModalFourth';
import CheckoutMain from './CheckoutMain';
import { searchStateNameFunction } from './SearchStatename';
import { searchCountryNameFunction } from './SearchCountryname';
import { searchStateNamePraticeFunction } from './SearchStateNamePratice';
import { searchCityNameFunction } from './SearchCityName';
import ProfessionInPerson from './InPersonProfession';
import ChecktwoCountry from './CheckoutModaltwo';
import CheckStateShow from './CheckoutModalthree';
import CheckThreeCity from './CheckoutModalFourth';
import Imagepath from '../../Themes/Imagepath';
import Fonts from '../../Themes/Fonts';
import Modal from 'react-native-modal'
import { searchStateLicNamePraticeFunction } from './LicStateTake';
import LicStateTakeShow from './LicStateShowDt';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import CellModalPayemnt from '../../Components/PayemntModal';
import CellModalPayemntFailed from '../../Components/PaymentFailed';
import CellModal from '../../Components/CellModal';
import Snackbar from 'react-native-snackbar';
import { processPhoneNumber } from '../../Utils/Helpers/PhoneNormalize';
/**
 * Status string constant.
 * @returns {string}
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
import { SafeAreaView } from 'react-native-safe-area-context'
import { loadGuestSignupDraft } from '../../Utils/Helpers/GuestSignupDraft';

/**
 * Reusable Checkout component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const GUEST_REGISTRATION_FLOW_KEY = 'GUEST_REGISTRATION_FLOW';
/**
 * Checkout component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const Checkout = (props) => {
    const WebcastReducer = useSelector(state => state.WebcastReducer)
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    console.log(DashboardReducer?.mainprofileResponse, "log-----------");
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [emailad, setEmailad] = useState("");
    const [professionad, setProfessionad] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [npino, setNpino] = useState("");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [cellno, setCellno] = useState("");
    const [speciality_id, setSpeciality_id] = useState([]);
    const [country_id, setCountry_id] = useState("");
    const [statelistpratice, setStatelistpratice] = useState([]);
    const [statelistpraticelic, setStatelistpraticelic] = useState([]);
    const [selectStatepratice, setSelectStatepratice] = useState([]);
    const [selectStatepraticelic, setSelectStatepraticelic] = useState([]);
    const [slistpratice, setSlistpratice] = useState('');
    const [slistpraticelic, setSlistpraticelic] = useState('');
    const [slist, setSlist] = useState('');
    const [selectState, setSelectState] = useState([]);
    const [searchState, setSearchState] = useState('');
    const [statepicker, setstatepicker] = useState(false);
    const [countryall, setCountryall] = useState('');
    const [countryshow, setCountryshow] = useState([]);
    const [countrypicker, setCountrypicker] = useState(false);
    const [searchcountry, setSearchcountry] = useState('');
    const [searchpratice, setSearchpratice] = useState('');
    const [searchpraticelic, setSearchpraticelic] = useState('');
    const [pratice, setPratice] = useState(false);
    const [licstatepratice, setLicstatepratice] = useState(false);
    const [state_id, setState_id] = useState("");
    const [city_id, setCity_id] = useState("");
    const [cityAll, setCityAll] = useState('');
    const [cityshow, setCityshow] = useState([]);
    const [searchcity, setSearchcity] = useState('');
    const [cityPicker, setCityPicker] = useState(false);
    const [ticketSave, setTicketSave] = useState(null);
    const [formData, setFormData] = useState([]);
    const [nonUsaFlowState, setNonUsaFlowState] = useState(null);
    const [playerSessionID, setPlayerSessionID] = useState("");
    const [detectedCountry, setDetectedCountry] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [activeIndexc, setActiveIndexc] = useState(null);
    const [activeIndexs, setActiveIndexs] = useState(null);
    const [activeIndexslic, setActiveIndexslic] = useState(null);
    const [activeIndexct, setActiveIndexct] = useState(null);
    const [previousSpec, setPreviousSpec] = useState("");
    const [totalcounts, setTotalcounts] = useState("");
    const [clist, setClist] = useState('');
    const [selectCountry, setSelectCountry] = useState([]);
    const [searchtext, setSearchtext] = useState(false);
    const [countrypickerprof, setcountrypickerprof] = useState(false);
    const [profindex, setProfindex] = useState("")
    const isfocus = useIsFocused();
    const [allmsg, setAllmsg] = useState("");
    const [countrygo, setCountrygo] = useState("1");
    const [isVisibletext, setIsVisibletext] = useState(false);
    const [license_state_id, setLicense_state_id] = useState("");
    const [license_number, setLicense_number] = useState("");
    const [license_expiry_date, setLicense_expiry_date] = useState("");
    const [medicallics, setMedicallics] = useState("");
    const [opendatelicyall, setOpendatelicyall] = useState(false);
    const [dobchoose, setDobchoose] = useState(false);
    const [dobindex, setDobindex] = useState("");
    const [dialcode, SetDialcode] = useState("");
    const [dateindex, setDateindex] = useState("");
    const [dateofbirth, setDateofbirth] = useState("")
    const [errors, setErrors] = useState({});
    const [couponapp, setCouponapp] = useState("");
    const [codesave, setCodesave] = useState("");
    const [notadded, setNotadded] = useState(false);
    const [savefull, setSavefull] = useState(null);
    const [customFields, setCustomFields] = useState(Array.from({ length: formData?.length }, () => ({})));  // Store custom fields for each attendee
    const [customFieldsLabels, setCustomFieldsLabels] = useState(Array.from({ length: formData?.length }, () => ({})));
    const [guestSignupDraft, setGuestSignupDraft] = useState(null);
    console.log(countrypickerprof, "countrypickerprof", clist, props?.route?.params?.inPersonTicket?.totalTicketPrice)
    // const isInitialLoad = useRef(false); 
    console.log(ticketSave, props?.route?.params, "1cheochg", props?.route?.params?.inPersonTicket?.inpersonSpanrole?.conferenceTypeId == "2", formData, "checkoutSpan=============");
    const isInitialLoad = useRef(true);

    const [loaderVisible, setLoaderVisible] = useState(false);

    useEffect(() => {
        if (!isfocus) {
            setLoaderVisible(false);
            return;
        }

        const showStatuses = [
            'WebCast/saveRegistRequest',
            'WebCast/cartCheckoutRequest',
            'WebCast/FreeTransRequest',
            'WebCast/StatusPaymentRequest',
            'WebCast/couponWebcastRequest'
        ];

        const hideStatuses = [
            'WebCast/saveRegistSuccess',
            'WebCast/saveRegistFailure',
            'WebCast/cartCheckoutSuccess',
            'WebCast/cartCheckoutFailure',
            'WebCast/FreeTransSuccess',
            'WebCast/FreeTransFailure',
            'WebCast/StatusPaymentSuccess',
            'WebCast/StatusPaymentFailure',
            'WebCast/couponWebcastSuccess',
            'WebCast/couponWebcastFailure'
        ];

        if (showStatuses.includes(WebcastReducer.status)) {
            setLoaderVisible(true);
        } else if (hideStatuses.includes(WebcastReducer.status)) {
            setLoaderVisible(false);
        }
    }, [WebcastReducer.status, isfocus]);

    useEffect(() => {
        if (isInitialLoad.current && formData && formData[0]?.emailad) {
            console.log(formData[0].emailad, "Initial formData load");
            emailCheck(0, "emailad", formData[0].emailad);
            isInitialLoad.current = false; // Mark as loaded
        }
    }, [formData]);
    useEffect(() => {
        const checkoutSpan = props?.route?.params?.checkoutSpan || props?.route?.params?.inPersonTicket;
        console.log(checkoutSpan, "checkoutSpan-=-------")
        if (checkoutSpan?.finalTicket || checkoutSpan?.inPersonTicket || checkoutSpan?.user_billing_address || checkoutSpan?.billing_address || checkoutSpan?.inPersonTicket?.user_billing_address || checkoutSpan?.inPersonTicket?.billing_address) {
            const newTicketSave = checkoutSpan?.finalTicket || checkoutSpan?.inPersonTicket || checkoutSpan?.user_billing_address || checkoutSpan?.billing_address || checkoutSpan?.inPersonTicket?.user_billing_address || checkoutSpan?.inPersonTicket?.billing_address;
            console.log(newTicketSave, "newTicketSave");
            setTicketSave(newTicketSave);
        }
    }, [props?.route?.params?.checkoutSpan, props?.route?.params?.inPersonTicket]);
    useEffect(() => {
        if (props?.route?.params?.inPersonTicket?.inPersonTicket?.tickets) {
            const totalQuantity = props?.route?.params?.inPersonTicket?.inPersonTicket?.tickets?.reduce((total, ticket) => total + ticket.quantity, 0);
            console.log("Total Quantity:", totalQuantity);
        }
    }, [props?.route?.params?.inPersonTicket?.inPersonTicket])
    useEffect(() => {
        if (props?.route?.params?.checkoutSpan?.finalTicket?.tickets) {
            const totalQuantity = props?.route?.params?.checkoutSpan?.finalTicket?.tickets?.reduce((total, ticket) => total + ticket.quantity, 0);
            console.log("Total Quantity:webcast single", totalQuantity);
        }
    }, [props?.route?.params?.checkoutSpan?.finalTicket])

    useEffect(() => {
        if (props?.route?.params?.checkoutSpan?.cartData?.tickets) {
            const totalQuantity = props?.route?.params?.checkoutSpan?.cartData?.tickets?.reduce((total, ticket) => total + ticket.ticket_qty, 0);
            console.log("Total Quantity:webcast single cart", totalQuantity);
        }
    }, [props?.route?.params?.checkoutSpan?.cartData?.tickets])
    console.log(ticketSave, props?.route?.params?.checkoutSpan?.cartData?.tickets, "ticketSave========", props?.route?.params?.checkoutSpan?.finalTicket)
        /**
 * Clean number utility.
 * @param {*} value - Input value.
 * @returns {number}
 */
const cleanNumber = (value) => {
        if (typeof value == 'number') return value;
        if (typeof value == 'string') {
            const num = parseFloat(value.replace(/,/g, ''));
            return isNaN(num) ? 0 : num;
        }
        return 0;
    };
    const routePaymentPrice = props?.route?.params?.checkoutSpan || props?.route?.params?.inPersonTicket || {};
        /**
 * Returns route transaction fee.
 * @param {*} source - Input value.
 * @returns {number}
 */
const getRouteTransactionFee = (source = routePaymentPrice) => {
        if (source?.transaction_fee !== undefined) {
            return cleanNumber(source.transaction_fee);
        }
        if (source?.processingFeeAmount !== undefined) {
            return cleanNumber(source.processingFeeAmount);
        }
        if (source?.processing_fee_amount !== undefined) {
            return cleanNumber(source.processing_fee_amount);
        }
        if (source?.overall_transaction_fee !== undefined) {
            return cleanNumber(source.overall_transaction_fee);
        }
        if (source?.cartData?.overall_transaction_fee !== undefined) {
            return cleanNumber(source.cartData.overall_transaction_fee);
        }
        if (Array.isArray(source?.tickets)) {
            const ticketsFee = source.tickets.reduce((sum, ticket) => sum + cleanNumber(ticket?.transaction_fee), 0);
            if (ticketsFee > 0) return ticketsFee;
        }
        if (Array.isArray(source?.cartData?.tickets)) {
            const ticketsFee = source.cartData.tickets.reduce((sum, ticket) => sum + cleanNumber(ticket?.transaction_fee), 0);
            if (ticketsFee > 0) return ticketsFee;
        }
        if (ticketSave?.transaction_fee !== undefined) {
            return cleanNumber(ticketSave.transaction_fee);
        }
        if (Array.isArray(ticketSave?.tickets)) {
            return ticketSave.tickets.reduce((sum, ticket) => sum + cleanNumber(ticket?.transaction_fee), 0);
        }
        return 0;
    };
    const checkoutBaseAmount = routePaymentPrice?.subtotalAmount != null
        ? cleanNumber(routePaymentPrice?.subtotalAmount)
        : savefull?.discount_value != null && savefull?.total_value != null
            ? cleanNumber(savefull?.total_value)
            : cleanNumber(ticketSave?.tickets?.[0]?.itemamt || ticketSave?.tickets?.[0]?.gross_value || routePaymentPrice?.cartData?.subtotal_amount || routePaymentPrice?.cartData?.total_paid_amount || routePaymentPrice?.totalTicketPrice || 0);
    const checkoutProcessingFeeAmount = routePaymentPrice?.processingFeeAmount != null
        ? cleanNumber(routePaymentPrice?.processingFeeAmount)
        : getRouteTransactionFee();
    const checkoutTotalAmount = routePaymentPrice?.totalTicketPrice != null
        ? cleanNumber(routePaymentPrice?.totalTicketPrice)
        : routePaymentPrice?.total_amount_with_fee != null
            ? cleanNumber(routePaymentPrice?.total_amount_with_fee)
            : routePaymentPrice?.cartData?.total_amount_with_fee != null
                ? cleanNumber(routePaymentPrice?.cartData?.total_amount_with_fee)
                : cleanNumber((checkoutBaseAmount + checkoutProcessingFeeAmount).toFixed(2));
        /**
 * Build payment price utility.
 * @param {Object} source - Input value.
 * @returns {Object}
 */
const buildPaymentPrice = (source = {}) => ({
        subtotalAmount: checkoutBaseAmount,
        processingFeeAmount: checkoutProcessingFeeAmount,
        totalTicketPrice: checkoutTotalAmount,
        transaction_fee: checkoutProcessingFeeAmount,
        total_amount_with_fee: checkoutTotalAmount,
        ...source,
    });
        /**
 * Persist guest registration session utility.
 *
 * @async
 * @param {*} registrationResponse - Input value.
 * @returns {Promise<*>}
 */
const persistGuestRegistrationSession = async (registrationResponse) => {
        console.log('Persisting====', registrationResponse);
        const token = registrationResponse?.token;
        const refreshToken = registrationResponse?.refresh_token;
        const user = registrationResponse?.user;

        if (token) {
            await AsyncStorage.setItem(constants.TOKEN, token);
            dispatch(tokenSuccess(token));
        }
        if (refreshToken) {
            await AsyncStorage.setItem(constants.REFRESH_TOKEN, refreshToken);
        }
        if (user) {
            const updatedUser = {
                ...user,
                usa_user: isNonUsaUser ? false : (user?.usa_user ?? !isNonUsaUser),
            };
            const userString = JSON.stringify(updatedUser);
            await AsyncStorage.setItem(constants.VERIFYSTATEDATA, userString);
            await AsyncStorage.setItem(constants.PROFESSION, userString);
            await AsyncStorage.setItem(
                GUEST_REGISTRATION_FLOW_KEY,
                JSON.stringify({
                    license_state_id: updatedUser?.license_state_id || '',
                    license_number: updatedUser?.license_number || '',
                })
            );
            await AsyncStorage.setItem('IS_GUEST_CONVERTED_USER', 'true');
            if (isNonUsaUser) {
                await writeNonUsaFlowState({
                    userType: 'non_usa',
                    isNonUsa: true,
                    emailVerified: false,
                    professionCompleted: true,
                    email: updatedUser?.email || '',
                });
            }
        }
    };
        /**
 * Checkout clear utility.
 * @returns {void}
 */
const checkoutClear = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            return;
        }
        if (props?.route?.params?.checkoutSpan?.cartData) {
            navigation.navigate("AddToCart");
        } else {
            navigation.navigate("Statewebcast", guestCheckoutRouteParams || undefined);
        }
    }
    const [finalverifyvault, setFinalverifyvault] = useState(null);
    const [finalProfession, setFinalProfession] = useState(null);
    console.log(country_id, "country_id=======");
        /**
 * Handles search.
 * @param {*} text - Input value.
 * @returns {void}
 */
const handleSearch = (text) => {
        searchStateNameFunction(text, selectState, setSlist, setSearchState, (filteredList, searchText) => {
            console.log('Filtered Data:', filteredList, 'Search Text:', searchText);
        });
    };
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
 * Handles pratice lic.
 * @param {*} text - Input value.
 * @returns {void}
 */
const handlePraticeLic = (text) => {
        searchStateLicNamePraticeFunction(text, selectStatepraticelic, setSlistpraticelic, setSearchpraticelic, (praticefillic, praticetxtcountlic) => {
            console.log('countryfil Data:', praticefillic, 'Search Text:', praticetxtcountlic);
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
    const [paymentcardfree, setPaymentcardfree] = useState(false);
    const [paymentfdfree, setPaymentfdfree] = useState(false);
    const [guestRegistrationFlowActive, setGuestRegistrationFlowActive] = useState(false);
        /**
 * Toggle modal paymentfree utility.
 * @param {*} dd - Input value.
 * @returns {void}
 */
const toggleModalPaymentfree = (dd) => {
        console.log(paymentcardfree, "paymentcardfree-----", dd)
        setPaymentcardfree(dd);
    };
        /**
 * Toggle modal failedfree utility.
 * @param {*} tik - Input value.
 * @returns {void}
 */
const toggleModalFailedfree = (tik) => {
        console.log(paymentfdfree, "paymentcardfree-----", tik)
        setPaymentfdfree(tik);
    };
    console.log(paymentcardfree, "paymentcardfree-----", paymentfdfree)
    const guestOrigin =
        props?.route?.params?.checkoutSpan?.guestOrigin ||
        props?.route?.params?.inPersonTicket?.guestOrigin ||
        props?.route?.params?.checkoutSpan?.checkoutSpan?.Realback ||
        props?.route?.params?.inPersonTicket?.inpersonSpanrole?.Realback;
    const isGuestCheckout = ['guest', 'guestuser'].includes(
        String(guestOrigin || '').toLowerCase()
    );
    const guestCheckoutRouteParams = props?.route?.params?.checkoutSpan?.checkoutSpan
        ? {
            webCastURL: {
                ...(props?.route?.params?.checkoutSpan?.checkoutSpan || {}),
                Realback: 'guest',
                creditData:
                    props?.route?.params?.checkoutSpan?.checkoutSpan?.creditData ||
                    props?.route?.params?.checkoutSpan?.creditData,
            },
        }
        : props?.route?.params?.inPersonTicket?.inpersonSpanrole
            ? {
                webCastURL: {
                    ...(props?.route?.params?.inPersonTicket?.inpersonSpanrole || {}),
                    Realback: 'guest',
                    creditData:
                        props?.route?.params?.inPersonTicket?.inpersonSpanrole?.creditData ||
                        props?.route?.params?.inPersonTicket?.creditData,
                },
            }
            : null;
    const checkoutCompletionRoute = 'TabNav';
    useEffect(() => {
        if (!isfocus || !isGuestCheckout) {
            setGuestSignupDraft(null);
            return;
        }

        let isActive = true;

                /**
 * Hydrate guest signup draft utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const hydrateGuestSignupDraft = async () => {
            try {
                const draft = await loadGuestSignupDraft();
                if (!isActive) {
                    return;
                }
                setGuestSignupDraft(draft);
            } catch (error) {
                console.log('[Checkout] guest draft load error', error);
            }
        };

        hydrateGuestSignupDraft();

        return () => {
            isActive = false;
        };
    }, [isGuestCheckout, isfocus]);
    useEffect(() => {
        if (!isGuestCheckout || !guestSignupDraft?.email || emailad) {
            return;
        }

        setEmailad(guestSignupDraft.email);
    }, [emailad, guestSignupDraft?.email, isGuestCheckout]);
    useEffect(() => {
        if (!isGuestCheckout || !guestSignupDraft?.profession || professionad) {
            return;
        }

        const professionValue = String(guestSignupDraft.profession || '').trim();
        setProfessionad(professionValue);

        const professionKey = professionValue.split(' - ')[0].trim();
        if (professionKey) {
            specaillized(professionKey);
        }
    }, [guestSignupDraft?.profession, isGuestCheckout, professionad]);
    useEffect(() => {
        if (!isGuestCheckout || speciality_id?.length > 0 || !guestSignupDraft?.specialty) {
            return;
        }

        const targetSpecialty = String(guestSignupDraft.specialty || '').trim().toLowerCase();
        const availableSpecialities = Array.isArray(slist)
            ? slist
            : Array.isArray(selectState)
                ? selectState
                : [];
        const matchedSpeciality = availableSpecialities.find(item => {
            const candidate = String(item?.name ?? item?.label ?? item?.speciality_name ?? item?.specialty_name ?? '').trim().toLowerCase();
            return candidate === targetSpecialty;
        });

        if (matchedSpeciality) {
            const matchedName = String(matchedSpeciality?.name ?? matchedSpeciality?.label ?? '').trim();
            const matchedId = String(matchedSpeciality?.id ?? matchedSpeciality?.speciality_id ?? '');
            if (!speciality) {
                setSpeciality(matchedName || guestSignupDraft.specialty);
            }
            if (!Array.isArray(speciality_id) || speciality_id.length === 0) {
                setSpeciality_id(matchedId ? [matchedId] : []);
            }
            return;
        }

        if (!speciality) {
            setSpeciality(guestSignupDraft.specialty);
        }
    }, [guestSignupDraft?.specialty, isGuestCheckout, selectState, slist, speciality, speciality_id]);
    /**
 * Reset guest checkout fields utility.
 * @returns {void}
 */
const resetGuestCheckoutFields = () => {
        setFirstname("");
        setLastname("");
        setEmailad("");
        setProfessionad("");
        setSpeciality("");
        setNpino("");
        setAddress("");
        setCountry("");
        setState("");
        setCity("");
        setZipcode("");
        setCellno("");
        setCountry_id("");
        setState_id("");
        setCity_id("");
        SetDialcode("");
        setDateofbirth("");
        setLicense_state_id("");
        setLicense_number("");
        setLicense_expiry_date("");
        setSpeciality_id([]);
        setPreviousSpec("");
    };
        /**
 * Search country name profession utility.
 * @param {*} text - Input value.
 * @returns {void}
 */
const searchCountryNameProfession = text => {
        console.log(text, 'text12333');
        if (text) {
            const listData = selectCountry?.filter(function (item) {
                // console.log('item+++++++++++++++++++1111', item);
                const itemData = item
                    ? item?.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.trim().toUpperCase();
                const filteredData = itemData.indexOf(textData) > -1;
                // console.log('filteredData', filteredData);
                return filteredData;
            });
            setClist(listData);
            setSearchtext(text);
        } else {
            setClist(selectCountry);
            setSearchtext(text);
        }
    };
        /**
 * Handles profession.
 * @param {*} did - Input value.
 * @param {*} ixd - Input value.
 * @returns {void}
 */
const handleProfession = (did, ixd) => {
        console.log(did, "he;;;;======")
        specaillized(did?.split(' - ')[0])
        setFormData((prevFormData) => {
            const updatedFormData = [...prevFormData];
            updatedFormData[ixd] = {
                ...updatedFormData[ixd],
                professionad: did
            };
            return updatedFormData;
        });
    }
    useEffect(() => {
                /**
 * On back press utility.
 * @returns {boolean}
 */
const onBackPress = () => {
            checkoutClear();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    useEffect(() => {
                /**
 * Load guest registration flow utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const loadGuestRegistrationFlow = async () => {
            try {
                const guestFlowRaw = await AsyncStorage.getItem(GUEST_REGISTRATION_FLOW_KEY);
                setGuestRegistrationFlowActive(Boolean(guestFlowRaw));
            } catch (error) {
                console.log('loadGuestRegistrationFlow error', error);
                setGuestRegistrationFlowActive(false);
            }
        };

        loadGuestRegistrationFlow();
    }, [isfocus, props?.route?.params?.checkoutSpan?.checkoutSpan, props?.route?.params?.inPersonTicket?.inpersonSpanrole]);
    useEffect(() => {
                /**
 * Token handle vault utility.
 * @returns {void}
 */
const token_handle_vault = () => {
            setTimeout(async () => {
                try {
                    if (isGuestCheckout && !guestRegistrationFlowActive) {
                        setFinalverifyvault(null);
                        setFinalProfession(null);
                        return;
                    }
                    const [board_special, profession_data] = await Promise.all([
                        AsyncStorage.getItem(constants.VERIFYSTATEDATA),
                        AsyncStorage.getItem(constants.PROFESSION)
                    ]);
                    const board_special_json = board_special ? JSON.parse(board_special) : null;
                    const profession_data_json = profession_data ? JSON.parse(profession_data) : null;
                    setFinalverifyvault(board_special_json);
                    setFinalProfession(profession_data_json);
                    console.log(board_special_json, "statelicesene=================");
                    console.log(profession_data_json, "profession=================");
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            }, 100);
        };

        token_handle_vault();
    }, [props?.route?.params?.checkoutSpan?.checkoutSpan, props?.route?.params?.inPersonTicket?.inpersonSpanrole, isGuestCheckout, guestRegistrationFlowActive]);
    const guestCheckoutProfile = guestRegistrationFlowActive
        ? (AuthReducer?.verifymobileResponse?.user ||
            AuthReducer?.verifyResponse?.user ||
            finalverifyvault ||
            finalProfession ||
            AuthReducer?.verifyResponse)
        : null;
    const allProfession = isGuestCheckout
        ? guestCheckoutProfile
        : (DashboardReducer?.mainprofileResponse || AuthReducer?.loginResponse?.user || AuthReducer?.againloginsiginResponse?.user || AuthReducer?.verifymobileResponse?.user || finalverifyvault || finalProfession);
    console.log(allProfession, "allprofesss=========");
    useEffect(() => {
        if (isGuestCheckout && !guestRegistrationFlowActive) {
            resetGuestCheckoutFields();
        }
    }, [isGuestCheckout, guestRegistrationFlowActive]);

    useEffect(() => {
        if (!isGuestCheckout || !Array.isArray(countryall) || countryall.length === 0) return;
        if (country || country_id) return; // country already selected/initialized
        if (detectedCountry === null) return; // Wait until we know the detected country

                /**
 * Default country to geo utility.
 * @returns {void}
 */
const defaultCountryToGeo = () => {
            try {
                const targetCode = detectedCountry.toUpperCase();
                const matchedCountry = countryall.find(c => 
                    String(c?.code).toUpperCase() === targetCode ||
                    String(c?.shortname).toUpperCase() === targetCode ||
                    (targetCode === 'US' && (
                        String(c?.id) === '1' || 
                        String(c?.name).toLowerCase() === 'united states'
                    ))
                );
                if (matchedCountry) {
                    console.log('[Checkout] Automatically defaulting country for guest:', matchedCountry.name);
                    handleCountrySet(matchedCountry, 0);
                }
            } catch (err) {
                console.log('[Checkout] Failed to default country for guest:', err);
            }
        };
        defaultCountryToGeo();
    }, [countryall, isGuestCheckout, detectedCountry]);

    useEffect(() => {
        if (allProfession?.personal_information?.firstname || allProfession?.firstname) {
            setFirstname(allProfession?.personal_information?.firstname || allProfession?.firstname);
        }
    }, [allProfession])
    useEffect(() => {
        if (allProfession?.personal_information?.lastname || allProfession?.lastname) {
            setLastname(allProfession?.personal_information?.lastname || allProfession?.lastname);
        }
    }, [allProfession])
    useEffect(() => {
        if (allProfession?.personal_information?.email || allProfession?.email) {
            setEmailad(allProfession?.personal_information?.email || allProfession?.email);
        }
    }, [allProfession])
    useEffect(() => {
        if ((allProfession?.personal_information?.dob && allProfession.personal_information.dob !== "0000-00-00") ||
            (allProfession?.dob && allProfession.dob !== "0000-00-00")) {
            setDateofbirth(allProfession?.personal_information?.dob || allProfession?.dob);
        } else {
            setDateofbirth("");
        }
    }, [allProfession]);
    useEffect(() => {
        if (allProfession?.professional_information?.profession || allProfession?.profession) {
            const profession = allProfession?.professional_information?.profession || allProfession?.profession;
            const profession_type = allProfession?.professional_information?.profession_type || allProfession?.profession_type
                        /**
 * Clean utility.
 * @param {*} value - Input value.
 * @returns {*}
 */
const clean = (value) => {
                if (value == null) return '';
                return String(value).trim();
            };
            const cleanedProfession = clean(profession);
            const cleanedProfessionType = clean(profession_type);
            const combinedValue =
                cleanedProfession && cleanedProfessionType
                    ? `${cleanedProfession} - ${cleanedProfessionType}`
                    : cleanedProfession || cleanedProfessionType;

            specaillized(allProfession?.professional_information?.profession || allProfession?.profession);
            // setProfessionad(`${allProfession?.professional_information?.profession || allProfession?.profession} - ${allProfession?.professional_information?.profession_type || allProfession?.profession_type}`)
            setProfessionad(combinedValue || '');
        }
    }, [allProfession])
    useEffect(() => {
        if (allProfession?.specialities) {
            // Extracting specialties from allProfession
            const specialties = Object.entries(allProfession.specialities).map(([id, name]) => ({
                id: String(id),
                name: String(name),
            }));

            console.log(specialties, "specialties00000001222");

            // Creating a string of names for display
            const namesString = specialties.map(specialty => specialty.name).join(', ');

            // Mapping IDs to strings
            const ids = specialties.map(specialty => String(specialty.id));

            // Updating the state with specialties, names, IDs, and previousSpec
            setSpeciality(namesString);
            setSpeciality_id(ids);
            setPreviousSpec(specialties); // Store the full specialties for reference
        }
    }, [allProfession, setSpeciality, setSpeciality_id, setPreviousSpec]);


    console.log(previousSpec, "previousSpec=======12223", formData, ticketSave?.discounts)

        /**
 * Specaillized utility.
 * @param {*} data - Input value.
 * @returns {void}
 */
const specaillized = (data) => {
        const obj = data
        connectionrequest()
            .then(() => {
                dispatch(specializationRequest(obj));
            })
            .catch(err => {
                console.log(err);
                showErrorAlert('Please connect to Internet');
            });
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
        /**
 * Praticing state component.
 * @param {number} index - Input value.
 * @returns {void}
 */
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
    useEffect(() => {
        if (countrygo) {
            LicStateTakeDo(countrygo);
        }
    }, [isfocus])
        /**
 * Lic state take do component.
 * @param {*} kol - Input value.
 * @returns {void}
 */
const LicStateTakeDo = (kol) => {
        connectionrequest()
            .then(() => {
                dispatch(checkstateRequest(kol)); // Dispatch the API call with the country_id
            })
            .catch(err => {
                // Handle the error, maybe log it or show an alert
                showErrorAlert('Please connect to Internet', err);
            });
    }
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
                // console.log(err);
                showErrorAlert('Please connect to Internet', err);
            });
    }
    console.log(speciality, "specility======", props?.route?.params)
    // const toggleWeekSelection = (item) => {
    //     console.log(item, "autofetched")
    //     let updatedWeekname;
    //     if (weekname.includes(item.name)) {
    //         updatedWeekname = weekname.filter(week => week !== item.name);
    //     } else {
    //         updatedWeekname = [...weekname, item.name];
    //     }
    //     setWeekname(updatedWeekname);
    //     console.log(updatedWeekname, "updatedWeekname====")
    // };
    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/professionRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/professionSuccess':
                status = AuthReducer.status;
                setSelectCountry(AuthReducer?.professionResponse?.profession_credentials);
                setClist(AuthReducer?.professionResponse?.profession_credentials);
                break;
            case 'Auth/professionFailure':
                status = AuthReducer.status;
                break;
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
            case 'Auth/checkstateRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/checkstateSuccess':
                status = AuthReducer.status;
                setStatelistpraticelic(AuthReducer?.checkstateResponse?.states);
                setSelectStatepraticelic(AuthReducer?.checkstateResponse?.states);
                setSlistpraticelic(AuthReducer?.checkstateResponse?.states);
                break;
            case 'Auth/checkstateFailure':
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

        /**
 * Handles free.
 * @param {*} takeit - Input value.
 * @returns {void}
 */
const handleFree = (takeit) => {
        let obj = {
            "invoice": takeit
        }
        connectionrequest()
            .then(() => {
                dispatch(FreeTransRequest(obj))
            })
            .catch((err) => {
                showErrorAlert("Please connect to intenet", err)
            })
    }
        /**
 * Status check utility.
 * @param {*} dochall - Input value.
 * @returns {void}
 */
const statusCheck = (dochall) => {
        if (dochall) {
            let obj = { "invoice": dochall }
            connectionrequest()
                .then(() => {
                    dispatch(StatusPaymentRequest(obj))
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }
    if (status1 == '' || WebcastReducer.status != status1) {
        switch (WebcastReducer.status) {
            case 'WebCast/saveRegistRequest':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/saveRegistSuccess':
                status1 = WebcastReducer.status;
                const finaleMed = props?.route?.params?.checkoutSpan || props?.route?.params?.inPersonTicket;
                const emededAcc = finaleMed?.checkoutSpan?.emeded_acc || finaleMed?.inpersonSpanrole?.emeded_acc;
                const professionType = DashboardReducer?.mainprofileResponse?.professional_information?.profession_type;
                const iseMededDoPass =
                    (emededAcc == "1" || emededAcc == 1) &&
                    (professionType == "DO" || professionType == "MD" || professionType == "DPM");
                                /**
 * All tickets free utility.
 * @param {*} ticketsArray - Input value.
 * @returns {*}
 */
const allTicketsFree = (ticketsArray) =>
                    ticketsArray?.length > 0 && ticketsArray.every(ticket => ticket?.ticket_type == "Free");
                const isAllFree = allTicketsFree(props?.route?.params?.checkoutSpan?.finalTicket?.tickets) ||
                    allTicketsFree(props?.route?.params?.inPersonTicket?.inPersonTicket?.tickets);
                const handleDis = ticketSave?.discounts == true && !props?.route?.params?.inPersonTicket?.inPersonTicket && checkoutBaseAmount == 0;
                if (WebcastReducer?.saveRegistResponse?.msg == "Registration details saved successfully.") {
                    persistGuestRegistrationSession(WebcastReducer?.saveRegistResponse).catch(error => {
                        console.log('persistGuestRegistrationSession error', error);
                    });
                    if (isAllFree) {
                        handleFree(ticketSave?.invoice);
                    } else if (handleDis) {
                        handleFree(ticketSave?.invoice);
                    } else {
                    props.navigation.navigate("Payment", {
                        invoiceTxt: {
                            invoiceTxt: ticketSave?.invoice, webcastTake: props?.route?.params?.checkoutSpan?.checkoutSpan ? props?.route?.params?.checkoutSpan?.checkoutSpan : props?.route?.params?.inPersonTicket?.inpersonSpanrole,
                                paymentprice: buildPaymentPrice(props?.route?.params?.checkoutSpan || props?.route?.params?.inPersonTicket), ticketShow: ticketSave,
                                emeded_acc: iseMededDoPass ? "added" : "notadded"
                            }
                        });
                    }
                }
                break;
            case 'WebCast/saveRegistFailure':
                status1 = WebcastReducer.status;
                showErrorAlert("Oops! Something went wrong. Please try again.")
                break;
            case 'WebCast/FreeTransRequest':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/FreeTransSuccess':
                status1 = WebcastReducer.status;
                if (WebcastReducer?.FreeTransResponse?.payment_status == "success") {
                    statusCheck(ticketSave?.invoice || WebcastReducer?.cartCheckoutResponse?.invoiceNumber);
                }
                break;
            case 'WebCast/FreeTransFailure':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/StatusPaymentRequest':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/StatusPaymentSuccess':
                status1 = WebcastReducer.status;
                if (WebcastReducer?.StatusPaymentResponse?.payment_status == 'already paid') {
                    toggleModalFailedfree(true);
                } else if (WebcastReducer?.StatusPaymentResponse?.payment_status == "failed") {
                    toggleModalFailedfree(true);
                } else if (WebcastReducer?.StatusPaymentResponse?.payment_status == 'success') {
                    toggleModalPaymentfree(true);
                }
                console.log("payment12222=====", WebcastReducer?.StatusPaymentResponse)
                break;
            case 'WebCast/StatusPaymentFailure':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/cartCheckoutRequest':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/cartCheckoutSuccess':
                status1 = WebcastReducer.status;
                if (WebcastReducer?.cartCheckoutResponse?.invoiceNumber) {
                    props.navigation.navigate("Payment", {
                        cartInvoice: {
                            cartInvoice: WebcastReducer.cartCheckoutResponse.invoiceNumber,
                            webcastTake: props?.route?.params?.checkoutSpan?.checkoutSpan
                                ? props.route.params.checkoutSpan.checkoutSpan
                                : props?.route?.params?.inPersonTicket?.inpersonSpanrole,
                            paymentprice: buildPaymentPrice({
                                ...(props?.route?.params?.checkoutSpan || {}),
                                subtotalAmount: checkoutBaseAmount,
                                processingFeeAmount: checkoutProcessingFeeAmount,
                                totalTicketPrice: checkoutTotalAmount,
                            }),
                        },
                    });
                }
                break;
            case 'WebCast/cartCheckoutFailure':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/TransemailcheckRequest':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/TransemailcheckSuccess':
                status1 = WebcastReducer.status;
                console.log(WebcastReducer?.TransemailcheckResponse?.data?.isRegistered == true, "TransemailcheckResponse=====");
                if (WebcastReducer?.TransemailcheckResponse?.data?.isRegistered == true) {
                    setAllmsg(formData && formData[0]?.emailad);
                    showModal();
                    // showErrorAlert(`This user ${(formData && formData[0]?.emailad)} is already registered for the selected ticket.`);

                    // Alert.alert("eMedEvents",`This user ${(formData && formData[0]?.emailad)} is already registered for the selected ticket.`,
                    // [{text:"Yes",onPress:()=>{
                    //     if( (props?.route?.params?.checkoutSpan && props?.route?.params?.checkoutSpan?.checkoutSpan?.conferenceTypeId == "2")|| (props?.route?.params?.inPersonTicket && props?.route?.params?.inPersonTicket?.inpersonSpanrole?.conferenceTypeId == "2") || (props?.route?.params?.checkoutSpan && props?.route?.params?.checkoutSpan?.checkoutSpan?.conferenceTypeId == "3")|| (props?.route?.params?.inPersonTicket && props?.route?.params?.inPersonTicket?.inpersonSpanrole?.conferenceTypeId == "3") ||(props?.route?.params?.checkoutSpan && props?.route?.params?.checkoutSpan?.checkoutSpan?.conferenceTypeId == "4")|| (props?.route?.params?.inPersonTicket && props?.route?.params?.inPersonTicket?.inpersonSpanrole?.conferenceTypeId == "4")||(props?.route?.params?.checkoutSpan && props?.route?.params?.checkoutSpan?.checkoutSpan?.conferenceTypeId == "5")|| (props?.route?.params?.inPersonTicket && props?.route?.params?.inPersonTicket?.inpersonSpanrole?.conferenceTypeId == "5")){
                    //           navigation.navigate("TabNav")
                    //     }
                    // },style:"cancel"},{text:"No",onPress:()=>{console.log("hello")},style:"cancel"}])
                }
                break;
            case 'WebCast/TransemailcheckFailure':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/couponWebcastRequest':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/couponWebcastSuccess':
                status1 = WebcastReducer.status;
                if (WebcastReducer?.couponWebcastResponse) {
                    setCodesave(WebcastReducer?.couponWebcastResponse?.code);
                    setSavefull(WebcastReducer?.couponWebcastResponse);
                }
                console.log(WebcastReducer?.couponWebcastResponse, "Item deleted in cart successfully.")
                break;
            case 'WebCast/couponWebcastFailure':
                status1 = WebcastReducer.status;
                // setCodeText("Please check the code");
                break;
        }

    }
    useEffect(() => {
        if (isGuestCheckout && !guestRegistrationFlowActive) return;
        if (ticketSave?.billing_address) {
            const { zipcode, contact_no, country_name, state_name, city_name, address, country_id, state_id, city_id, callingCode } = ticketSave.billing_address;
            console.log(zipcode, "zipcode=======");
            if (zipcode) setZipcode(zipcode);
            if (contact_no) setCellno(contact_no);
            if (country_name) setCountry(country_name);
            if (state_name) setState(state_name);
            if (city_name) setCity(city_name);
            if (address) setAddress(address);
            if (country_id) setCountry_id(country_id);
            if (state_id) setState_id(state_id);
            if (city_id) setCity_id(city_id);
            if (callingCode) SetDialcode(callingCode);
        } else if (ticketSave) {
            const { zipcode, contact_no, country_name, state_name, city_name, address, country_id, state_id, city_id, license_state_id, license_number, license_expiry_date, callingCode } = ticketSave;
            console.log(zipcode, "zipcode=======");
            if (zipcode) setZipcode(zipcode);
            if (contact_no) setCellno(contact_no);
            if (country_name) setCountry(country_name);
            if (state_name) setState(state_name);
            if (city_name) setCity(city_name);
            if (address) setAddress(address);
            if (country_id) setCountry_id(country_id);
            if (state_id) setState_id(state_id);
            if (city_id) setCity_id(city_id);
            if (callingCode) SetDialcode(callingCode);
            if (license_state_id) setLicense_state_id(license_state_id);
            if (license_number) setLicense_number(license_number);
            if (license_expiry_date) setLicense_expiry_date(license_expiry_date);
        }
    }, [ticketSave, isGuestCheckout, guestRegistrationFlowActive]);
    useEffect(() => {
        if (isGuestCheckout && !guestRegistrationFlowActive) return;
        if (ticketSave) {
            const { license_state_id, license_number, license_expiry_date } = ticketSave;
            if (license_state_id) setLicense_state_id(license_state_id);
            if (license_number) setLicense_number(license_number);
            if (license_expiry_date) setLicense_expiry_date(license_expiry_date);
        }
    }, [ticketSave, isGuestCheckout, guestRegistrationFlowActive])
    useEffect(() => {
        if (isGuestCheckout) return;
        if (DashboardReducer?.mainprofileResponse || AuthReducer?.verifyResponse?.phone) {
            const allDatashow = DashboardReducer?.mainprofileResponse?.user_address;
            const NpiNo = DashboardReducer?.mainprofileResponse?.professional_information?.npi_number;

            let phoneNumberToUse = allDatashow?.contact_no;
            let callingCodeToUse = allDatashow?.contact_no ? allDatashow?.calling_code : null; // only use calling_code if contact_no exists

            // ✅ If Dashboard phone is missing, fallback to AuthReducer phone
            if (!phoneNumberToUse && AuthReducer?.verifyResponse?.phone) {
                const authPhone = AuthReducer?.verifyResponse?.phone.trim();

                // Extract country code and number from +<code><number> pattern
                const match = authPhone.match(/^\+(\d{1,2})(\d+)$/);
                console.log(match,"match========")
                if (match) {
                    callingCodeToUse = match[1];
                    phoneNumberToUse = match[2];
                } else {
                    // If not in international format, use entire string as number
                    phoneNumberToUse = authPhone;
                }
            }

            // ✅ Format number based on calling code
            let formattedCellNo = phoneNumberToUse;
            if (callingCodeToUse == "1" || callingCodeToUse == 1) {
                formattedCellNo = formatPhoneNumberno(phoneNumberToUse);
            } else if (callingCodeToUse == "91" || callingCodeToUse == 91) {
                formattedCellNo = formatIndianPhoneNumber(phoneNumberToUse);
            }

            // ✅ Set address & profile data
            PraticingState(allDatashow?.country_id);
            cityReq(allDatashow?.state_id);
            setZipcode(allDatashow?.zipcode);
            setCountry(allDatashow?.country_name);
            setState(allDatashow?.state_name);
            setCity(allDatashow?.city_name);
            setCountry_id(allDatashow?.country_id);
            setState_id(allDatashow?.state_id);
            setCity_id(allDatashow?.city_id);
            setNpino(NpiNo);

            // ✅ Only set calling code if valid
            SetDialcode(callingCodeToUse || null);
            setCellno(formattedCellNo || "");
        }
    }, [DashboardReducer?.mainprofileResponse, AuthReducer?.verifyResponse?.phone, isGuestCheckout]);


        /**
 * Formats phone numberno.
 * @param {*} input - Input value.
 * @returns {*}
 */
const formatPhoneNumberno = (input) => {
        // Handle null/undefined/empty cases
        if (!input) return "";

        // Convert to string in case input is a number
        const strInput = String(input);

        // Remove all non-digit characters and limit to 10 digits
        const cleaned = strInput.replace(/\D/g, '').slice(0, 10);
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

        if (match) {
            let formatted = '';
            if (match[1]) formatted = `(${match[1]}`;
            if (match[2]) formatted += `) ${match[2]}`;
            if (match[3]) formatted += `-${match[3]}`;
            return formatted;
        }

        return strInput; // Return original input if formatting fails
    };

        /**
 * Formats indian phone number.
 * @param {*} input - Input value.
 * @returns {*}
 */
const formatIndianPhoneNumber = (input) => {
        if (!input) return "";

        const strInput = String(input);
        const cleaned = strInput.replace(/\D/g, '').slice(0, 10);

        if (cleaned.length == 10) {
            return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
        }

        return strInput;
    };


    useEffect(() => {
        if (ticketSave?.license_state_id) {
            const targetId = ticketSave?.license_state_id;
            const resultTake = slistpraticelic && slistpraticelic?.length > 0 && slistpraticelic.filter(item => item.id === targetId).map(item => ({ id: item.id, name: item.name }));
            if (resultTake) {
                setMedicallics(resultTake?.[0]?.name);
                setLicense_state_id(resultTake?.[0]?.id);
            }
        }
    }, [ticketSave, slistpraticelic])
    console.log(ticketSave, "ticketSave===========122", formData, DashboardReducer?.mainprofileResponse);
    useEffect(() => {
        let mounted = true;
        readNonUsaFlowState().then(state => {
            if (mounted) setNonUsaFlowState(state);
        });
        AsyncStorage.getItem('PLAYERSESSION').then(session => {
            if (mounted && session) setPlayerSessionID(session);
        }).catch(err => console.log('Error reading PLAYERSESSION', err));
        getCountryAndDialCode().then(info => {
            if (mounted && info?.country) {
                setDetectedCountry(info.country);
            }
        }).catch(err => console.log('Error reading country', err));
        return () => {
            mounted = false;
        };
    }, [isfocus]);
        /**
 * Show modal utility.
 * @returns {void}
 */
const showModal = () => {
        setIsVisibletext(true);
        setTimeout(() => {
            setIsVisibletext(false);
            setAllmsg("");
        }, 5000);
    };

    useEffect(() => {
        if (allmsg) {
            showModal();
        }
    }, [allmsg]);
    // const requiredFields = [
    //     "firstname", "lastname", "emailad", "professionad",
    //     "speciality", "address", "country", "state",
    //     "city", "zipcode", "cellno"
    // ];
    // const attendeesFilledStatus = formData.map(attendee =>
    //     requiredFields.every(field => {
    //         const value = attendee[field];
    //         return value !== undefined && value !== null && value.trim() !== '';
    //     })
    // );
    // const fullAccess = attendeesFilledStatus.every(isFilled => isFilled);
    // console.log(fullAccess, "123--------", ticketSave);

    // Dynamically add customData field_name values to requiredFields
    const finaleMed = props?.route?.params?.checkoutSpan || props?.route?.params?.inPersonTicket;
    const emededAcc = finaleMed?.checkoutSpan?.emeded_acc || finaleMed?.inpersonSpanrole?.emeded_acc;
    const professionType = DashboardReducer?.mainprofileResponse?.professional_information?.profession_type;
    const iseMededDo =
        (emededAcc == "1" || emededAcc == 1) &&
        (professionType == "DO" || professionType == "MD" || professionType == "DPM");
    const baseRequiredFields = [
        "firstname", "lastname", "emailad", "professionad", "license_state_id",
        "speciality", "license_number", "license_expiry_date", "address", "country", "state",
        "city", "zipcode", "cellno"
    ];
    if (iseMededDo) {
        baseRequiredFields.push("dateofbirth");
    }
    const detectField = props?.route?.params?.checkoutSpan?.inPersonTicket?.custom_fields || props?.route?.params?.inPersonTicket?.inPersonTicket?.custom_fields || ticketSave?.custom_fields;
    console.log(detectField, "customField-------123", formData, iseMededDo)
    if (detectField && detectField?.length > 0) {
        // Loop through each item in detectField
        detectField.forEach(item => {
            // Check if the item has a field_name property
            if (item.required == 1) {
                // Add the field_name value to the requiredFields array
                baseRequiredFields.push(item.field_name);
            }
        });
    }
        /**
 * Determines whether usaselected is true.
 * @param {Object} attendee - Input value.
 * @returns {*}
 */
const isUSASelected = (attendee = {}) => {
        const countryName = String(attendee?.country || '').trim().toLowerCase();
        const countryIdentifier = String(attendee?.country_id || '').trim();
        const phoneDialCode = String(attendee?.dialcode || '').trim();

        return (
            countryName === 'usa' ||
            countryName === 'united states' ||
            countryName === 'united states of america' ||
            countryIdentifier === '1' ||
            phoneDialCode === '+1' ||
            phoneDialCode === '1'
        );
    };

    const attendeeCountry = formData?.[0]?.country;
    const attendeeCountryId = formData?.[0]?.country_id;
    const attendeeDialcode = formData?.[0]?.dialcode;

    const hasSelectedCountry = Boolean(attendeeCountry || attendeeCountryId || attendeeDialcode);
    const tempAttendee = {
        country: attendeeCountry,
        country_id: attendeeCountryId,
        dialcode: attendeeDialcode
    };
    const isNonUsaUser = hasSelectedCountry
        ? !isUSASelected(tempAttendee)
        : (nonUsaFlowState?.isNonUsa === true || isNonUsaAccount(allProfession || {}) || (detectedCountry && detectedCountry !== 'US'));

    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(professionRequest(isNonUsaUser ? { other_country: 1 } : {}));
            })
            .catch(err => {
                showErrorAlert('Please connect to Internet', err);
            });
    }, [isfocus, dispatch, isNonUsaUser]);

        /**
 * Returns required fields for attendee.
 * @param {Object} attendee - Input value.
 * @returns {*}
 */
const getRequiredFieldsForAttendee = (attendee = {}) => {
        if (isUSASelected(attendee)) {
            return baseRequiredFields;
        }

        return baseRequiredFields.filter(field =>
            field !== 'license_state_id' &&
            field !== 'license_number' &&
            field !== 'license_expiry_date'
        );
    };
    console.log(baseRequiredFields, "requiredFields-------", detectField, formData)
    const nonbillings = [
        "firstname", "lastname", "emailad", "address", "country", "state",
        "city", "zipcode", "cellno"
    ];
        /**
 * Handles input change.
 * @param {number} index - Input value.
 * @param {*} field - Input value.
 * @param {*} value - Input value.
 * @returns {void}
 */
const handleInputChange = (index, field, value) => {
        const updatedFormData = [...formData];
        updatedFormData[index][field] = value;
        setFormData(updatedFormData);

        if (field === 'emailad') {
            const updatedEmailTouched = [...isEmailTouched];
            updatedEmailTouched[index] = true;
            setIsEmailTouched(updatedEmailTouched);
        } else if (field === 'cellno') {
            const updatedCellNoTouched = [...isCellNoTouched];
            updatedCellNoTouched[index] = true;
            setIsCellNoTouched(updatedCellNoTouched);
        }
    };
        /**
 * Validate email utility.
 * @param {*} email - Input value.
 * @returns {*}
 */
const validateEmail = (email) => {
        // Regular expression to validate email format
        const emailRegex = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
        return emailRegex.test(email);
    };

        /**
 * Validate cell no utility.
 * @param {*} cellno - Input value.
 * @returns {*}
 */
const validateCellNo = (cellno) => {
        const cleaned = cellno.replace(/\D/g, '');
        return /^\d{10,15}$/.test(cleaned);
    };

    // Create an error tracking object for each attendee
    const errorFlags = formData.map(() => ({
        emailad: null, // Error message for invalid email
        cellno: null,  // Error message for invalid cell number
        general: null, // Error message for missing required fields
    }));
    const [isEmailTouched, setIsEmailTouched] = useState(formData.map(() => false));
    const [isCellNoTouched, setIsCellNoTouched] = useState(formData.map(() => false));
    // Validate each attendee
    const attendeesFilledStatus = formData.map((attendee, index) => {
        let isAttendeeValid = true;
        // Check if all required fields are filled
        const requiredFields = getRequiredFieldsForAttendee(attendee);
        const missingFields = requiredFields.filter(field => {
            const value = attendee[field];
            return !value || (typeof value == 'string' && value.trim() == '');
        });

        if (missingFields.length > 0) {
            isAttendeeValid = false;
            errorFlags[index].general = `Missing required fields: ${missingFields.join(', ')}`;
        } else {
            errorFlags[index].general = null;
        }

        // Validate specific fields: emailad
        const emailValid = validateEmail(attendee.emailad || '');
        if (!emailValid) {
            isAttendeeValid = false;
            errorFlags[index].emailad = "Invalid email address.";
        } else {
            errorFlags[index].emailad = null;
        }

        // Validate specific fields: cellno
        const cellNoValid = validateCellNo(attendee.cellno || '');
        if (!cellNoValid) {
            isAttendeeValid = false;
            errorFlags[index].cellno = "Invalid cell number. It must be 10-15 digits.";
        } else {
            errorFlags[index].cellno = null;
        }

        return isAttendeeValid;
    });

    // Determine if all attendees are valid
    const fullAccess = attendeesFilledStatus.every(isFilled => isFilled);
    console.log(fullAccess, "fullaccess---")
        /**
 * Validate single attendee utility.
 * @param {*} attendee - Input value.
 * @returns {*}
 */
const validateSingleAttendee = (attendee) => {
        if (!attendee) {
            console.error("No attendee to validate!");
            return false;
        }
        let isAttendeeValid = true;

        // Check if all required fields are filled
        const missingFields = nonbillings.filter(field => {
            const value = attendee[field];
            return !value || value.trim() === '';
        });

        if (missingFields.length > 0) {
            isAttendeeValid = false;
            errorFlags.general = `Missing required fields: ${missingFields.join(', ')}`;
        } else {
            errorFlags.general = null;
        }

        // Validate specific fields: emailad
        const emailValid = validateEmail(attendee.emailad || '');
        if (!emailValid) {
            isAttendeeValid = false;
            errorFlags.emailad = "Please enter a valid email address (e.g., abc@gmail.com)";
        } else {
            errorFlags.emailad = null;
        }

        // Validate specific fields: cellno
        const cellNoValid = validateCellNo(attendee.cellno || '');
        if (!cellNoValid) {
            isAttendeeValid = false;
            errorFlags.cellno = "Cell number must be 10–15 digits.";
        } else {
            errorFlags.cellno = null;
        }

        return isAttendeeValid;
    };

    // Perform validation for only the first attendee (index 0)
    const attendeeToValidate = formData?.[0]; // Get the first attendee
    const isSingleAttendeeValid = validateSingleAttendee(attendeeToValidate);
    // Debugging
    console.log(isSingleAttendeeValid, "Full Access Status:", fullAccess);
    console.log("Error Flags:", errorFlags);

    // Display errors dynamically (e.g., in a UI framework)
    formData.forEach((attendee, index) => {
        console.log(`Attendee ${index + 1}:`, {
            generalError: errorFlags[index].general,
            emailError: errorFlags[index].emailad,
            cellNoError: errorFlags[index].cellno,
        });
    });


        /**
 * Email check utility.
 * @param {number} index - Input value.
 * @param {*} key - Input value.
 * @param {*} value - Input value.
 * @returns {void}
 */
const emailCheck = (index, key, value) => {
        console.log(index, key, value, "updatedFormData============12222");
        const attendees = (Array.isArray(props?.route?.params?.inPersonTicket?.inPersonTicket?.tickets)
            ? props.route.params.inPersonTicket?.inPersonTicket?.tickets
            : props?.route?.params?.checkoutSpan?.finalTicket?.tickets
                ? props?.route?.params?.checkoutSpan?.finalTicket?.tickets
                : []
        ).flatMap(ticket => {
            const quantity = ticket.quantity || 1; // Default to 1 if quantity is missing
            return Array.from({ length: quantity }, () => ({
                ...ticket // Duplicate the entire ticket object, preserving ticket_id and other properties
            }));
        });

        console.log("Flattened Attendees with Duplicates by Quantity:", attendees[index], attendees);
        let emailCheckRequests = [];
        if (attendees?.length > 0) {
            const obj = {
                "conference": attendees[index].conference_id,
                "email": value,
                "ticket": attendees[index].ticket_id
            };
            emailCheckRequests.push(obj);
        }


        console.log(emailCheckRequests, "emailCheckRequests");

        // Function to send email check requests
                /**
 * Send email check requests utility.
 * @returns {*}
 */
const sendEmailCheckRequests = () => {
            const requests = emailCheckRequests.map((obj) =>
                dispatch(TransemailcheckRequest(obj))  // Ensure you have this dispatch function set up
            );
            return Promise.all(requests);
        };

        // Checking network connection before dispatching requests
        connectionrequest()
            .then(() => {
                sendEmailCheckRequests()
                    .then(() => {
                        console.log("All email check requests sent successfully.");
                    })
                    .catch((error) => {
                        showErrorAlert("An error occurred while sending requests", error);
                    });
            })
            .catch((err) => {
                showErrorAlert("Please connect to the internet", err);
            });
    };
    const customField = props?.route?.params?.checkoutSpan?.inPersonTicket?.custom_fields || props?.route?.params?.inPersonTicket?.inPersonTicket?.custom_fields || ticketSave?.custom_fields;
    const [mergedData, setMergedData] = useState({ custom_fields: [], custom_fields_labels: [] });

    useEffect(() => {
                /**
 * Merge custom fields with labels utility.
 * @returns {Object}
 */
const mergeCustomFieldsWithLabels = () => {
            const customFieldsMerged = [];
            const customFieldsLabelsMerged = [];

            customFields.forEach((fieldData, index) => {
                const mergedItem = {};
                const fieldLabelData = customFieldsLabels?.[index] || {}; // Ensure it's an object

                if (Array.isArray(customField)) {
                    customField.forEach(field => {
                        const fieldId = field?.id;
                        const fieldName = field?.field_name;

                        console.log(fieldLabelData, fieldId, fieldName, "ffild===========", fieldData);

                        if (fieldData?.[fieldName] !== undefined) {
                            mergedItem[fieldId] = fieldData[fieldName];
                        }

                        if (fieldLabelData?.[fieldName] !== undefined) {
                            customFieldsLabelsMerged.push({ [fieldId]: fieldLabelData[fieldName] });
                        }
                    });
                }

                if (Object.keys(mergedItem).length > 0) {
                    customFieldsMerged.push(mergedItem);
                }
            });

            return {
                custom_fields: customFieldsMerged,
                custom_fields_labels: customFieldsLabelsMerged
            };
        };

        const data = mergeCustomFieldsWithLabels();
        setMergedData(data); // Update state with the merged data
    }, [customFields, customFieldsLabels]);

    console.log(mergedData, "mergedData0-0----------", formData, customField)
        /**
 * Handles input changeeamilad.
 * @param {number} index - Input value.
 * @param {*} key - Input value.
 * @param {*} value - Input value.
 * @returns {void}
 */
const handleInputChangeeamilad = (index, key, value) => {
        console.log(value, "val======");
        const regexEmail = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
        const isValidEmail = regexEmail.test(value);
        if (isValidEmail) {
            emailCheck(index, key, value);
        }
    };
        /**
 * Proceed payment utility.
 * @returns {void}
 */
const proceedPayment = () => {
        // Flattening attendees based on their quantity
        const attendees = (Array.isArray(props?.route?.params?.inPersonTicket?.inPersonTicket?.tickets)
            ? props.route.params.inPersonTicket.inPersonTicket.tickets
            : Array.isArray(props?.route?.params?.checkoutSpan?.finalTicket?.tickets)
                ? props.route.params.checkoutSpan.finalTicket.tickets
                : []
        ).flatMap(ticket => {
            const quantity = ticket.quantity || 1; // Default to 1 if quantity is missing
            return Array.from({ length: quantity }, () => ({
                ...ticket // Duplicate the entire ticket object, preserving ticket_id and other properties
            }));
        });

        console.log("Flattened Attendees with Duplicates by Quantity:", attendees);

        const attendeeData = formData.map((data, index) => {
                        /**
 * Convert to isodate helper.
 * @param {*} dateString - Input value.
 * @returns {*}
 */
function convertToISODate(dateString) {
                const dateObj = new Date(dateString);
                if (isNaN(dateObj.getTime())) {
                    throw new Error("Invalid date string");
                }
                return dateObj.toISOString();
            }
            const ticket = attendees[index] || {}; // Get the ticket at the same index or an empty object if none exists
            const attendeeItem = {
                ticket_id: ticket.ticket_id || '', // Ensure ticket_id is available
                payment_ticket_id: ticket.payment_ticket_id || null, // Ensure payment_ticket_id is available
                firstname: data?.firstname || '', // Get the first name from formData
                lastname: data?.lastname || '', // Get the last name from formData
                email: data?.emailad || '', // Get the email from formData
                profession: data?.professionad || '', // Get profession from formData
                speciality: data?.speciality_ids || [], // Use speciality IDs from formData
                address: data?.address || '', // Use address from formData
                npi_number: data?.npino || '', // Assuming this is a constant value
                country_id: data?.country_id || null, // Use country_id from formData
                state_id: data?.state_id || null, // Use state_id from formData
                city_id: data?.city_id || null, // Use city_id from formData
                zipcode: data?.zipcode || '', // Use zipcode from formData
                phone: data?.cellno || '', // Use cell phone number from formData,
                dob: data?.dateofbirth || '',
                ...(isGuestCheckout && playerSessionID ? { playerSessionID } : {})
            };

            if (!isNonUsaUser) {
                attendeeItem.license_state_id = data?.license_state_id || null;
                attendeeItem.license_number = data?.license_number || null;
                attendeeItem.license_expiry_date = data?.license_expiry_date ? convertToISODate(data?.license_expiry_date) : "";
            } else {
                attendeeItem.license_expiry_date = "";
            }

            return attendeeItem;
        });

        // Prepare the billing information, using the first formData entry as the reference
        const billingInfo = {
            firstname: formData[0]?.firstname || '', // Default to empty string if data is missing
            lastname: formData[0]?.lastname || '',
            email: formData[0]?.emailad || '',
            address: formData[0]?.address || '',
            country_id: formData[0]?.country_id || null,
            state_id: formData[0]?.state_id || null,
            city_id: formData[0]?.city_id || null,
            zipcode: formData[0]?.zipcode || '',
            phone: formData[0]?.cellno || ''
        };
        const customFieldCheked = props?.route?.params?.checkoutSpan?.inPersonTicket?.custom_fields || props?.route?.params?.inPersonTicket?.inPersonTicket?.custom_fields || ticketSave?.custom_fields;
        const jsonString = JSON.stringify(mergedData);
        const jsonWithoutBraces = jsonString.slice(1, -1);
        // Create the final object to be sent
                /**
 * All tickets freeac utility.
 * @param {*} ticketsArray - Input value.
 * @returns {*}
 */
const allTicketsFreeac = (ticketsArray) =>
            ticketsArray?.length > 0 && ticketsArray.every(ticket => ticket?.ticket_type == "Free");
        const isAllFreeAccess = allTicketsFreeac(props?.route?.params?.checkoutSpan?.finalTicket?.tickets) ||
            allTicketsFreeac(props?.route?.params?.inPersonTicket?.inPersonTicket?.tickets);
        const obj = isAllFreeAccess ? {
            invoice: ticketSave?.invoice,
            attendee: attendeeData
        } : {
            invoice: ticketSave?.invoice,
            attendee: attendeeData,
            billing: billingInfo // Ensure this structure matches your requirements
        };
        if (customFieldCheked && customFieldCheked?.length > 0) {
            obj.jsonWithoutBraces = jsonWithoutBraces;
        }
        if (isGuestCheckout && playerSessionID) {
            obj.playerSessionID = playerSessionID;
        }
        console.log(obj, "Multiple data pushing", customFieldCheked);
        connectionrequest()
            .then(() => {
                dispatch(saveRegistRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
            });
    };

    const fullPaymentId = props?.route?.params?.checkoutSpan?.cartData?.tickets;

        /**
 * Cart payment utility.
 * @returns {void}
 */
const cartPayment = () => {
        let objcart = {
            "payment_id": fullPaymentId?.length > 0 && fullPaymentId?.map(item => item?.payment_id),
            "billing": {
                "firstname": allProfession?.firstname,
                "lastname": allProfession?.lastname,
                "email": allProfession?.email,
                "address": props?.route?.params?.checkoutSpan?.user_billing_address?.address,
                "country_id": props?.route?.params?.checkoutSpan?.user_billing_address?.country_id || country_id,
                "state_id": props?.route?.params?.checkoutSpan?.user_billing_address?.state_id || state_id,
                "city_id": props?.route?.params?.checkoutSpan?.user_billing_address?.city_id || city_id,
                "zipcode": zipcode,
                "phone": cellno
            }
        }
        connectionrequest()
            .then(() => {
                dispatch(cartCheckoutRequest(objcart))
            })
            .catch((err) => {
                showErrorAlert(err, "Please connect to internet");
            })
    }

    const [selectedSpecialities, setSelectedSpecialities] = useState([]); // Track selected specialties

    // Handle the speciality selection (multi-select only)
        /**
 * Handles speciality select.
 * @param {*} selectedItems - Input value.
 * @param {*} formData - Input value.
 * @returns {void}
 */
const handleSpecialitySelect = (selectedItems, formData) => {
        if (activeIndex !== null) {
            const updatedForm = [...formData];

            // Map the selected items to get the names and IDs
            const selectedSpecialitiesNames = selectedItems.map(item => item?.name).join(', '); // Join names for display
            const selectedSpecialityIds = selectedItems.map(item => item?.id); // Collect IDs for further use

            // Update the form data with selected specialities at the active index
            updatedForm[activeIndex].speciality = selectedSpecialitiesNames;
            updatedForm[activeIndex].speciality_ids = selectedSpecialityIds; // Store the selected IDs

            // Update the form state
            setFormData(updatedForm);

            // Reset states
            setstatepicker(false); // Close the modal
            setSearchState(""); // Clear search state
            setActiveIndex(null); // Reset active index
            setSelectedSpecialities([]); // Clear selected specialities
        }
    };
    // const handleSpecialityChange = (index, selectedSpecialities, selectedIds) => {
    //     setFormData(prevFormData => {
    //         const updatedForm = [...prevFormData];
    //         updatedForm[index] = {
    //             ...updatedForm[index],
    //             speciality: selectedSpecialities.join(', '), 
    //             speciality_ids: selectedIds, 
    //         };
    //         return updatedForm;
    //     });
    // };
        /**
 * Handles speciality change.
 * @param {number} index - Input value.
 * @param {*} selectedSpecialities - Input value.
 * @param {*} selectedIds - Input value.
 * @returns {void}
 */
const handleSpecialityChange = (index, selectedSpecialities, selectedIds) => {
        const updatedFormData = [...formData];

        // Initialize formData for the current index if not present
        if (!updatedFormData[index]) {
            updatedFormData[index] = { speciality_ids: [], speciality: '' };
        }

        // Update formData at the current index with the new selections
        updatedFormData[index] = {
            ...updatedFormData[index],
            speciality: selectedSpecialities.join(', '),  // Update selected names
            speciality_ids: selectedIds  // Update selected IDs
        };

        setFormData(updatedFormData);  // Update formData state
    };


        /**
 * Remove speciality utility.
 * @param {number} index - Input value.
 * @param {*} specialityId - Input value.
 * @returns {void}
 */
const removeSpeciality = (index, specialityId) => {
        const currentSpecialityIds = formData[index]?.speciality_ids || [];
        const currentSpecialities = formData[index]?.speciality.split(', ') || [];

        // Create new arrays to hold updated values
        let updatedSpecialityIds = [...currentSpecialityIds];
        let updatedSpecialityNames = [...currentSpecialities];

        // If the specialityId is present, remove it
        if (updatedSpecialityIds.includes(specialityId)) {
            updatedSpecialityIds = updatedSpecialityIds.filter(id => id !== specialityId);
            updatedSpecialityNames = updatedSpecialityNames.filter((_, i) => currentSpecialityIds[i] !== specialityId);
        }

        // Update formData for the specific index
        handleSpecialityChange(index, updatedSpecialityNames, updatedSpecialityIds);
    };
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
        /**
 * Handles country set.
 * @param {*} didi - Input value.
 * @param {number} index - Input value.
 * @returns {void}
 */
const handleCountrySet = (didi, index) => {
        if (!props?.route?.params?.checkoutSpan) {
            Snackbar.show({
                text: `Since you have updated the country for ${index == 0 ? "primary registrant" : `attendee ${index + 1}`}, kindly update your profession and specialty.`,
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: '#2C2C2C',
                textColor: '#FFFFFF',
            });
        }
        console.log(didi, "mmmm", index)
        PraticingState(didi?.id);
        setCountry(didi?.name);
        stateRequest(didi?.id);
        setCountry_id(didi?.id);
        if (didi?.callingcode && formData[index]?.cellno) {
            const isUSA = didi?.callingcode == '+1' || didi?.callingcode == '1';
            const formattedNumber = formatPhoneNumber(formData[index]?.cellno, isUSA);
            setFormData((prevFormData) => {
                const updatedFormData = [...prevFormData];
                updatedFormData[index] = {
                    ...updatedFormData[index],
                    dialcode: didi?.callingcode,
                    country: didi?.name,
                    country_id: didi?.id,
                    state: null,
                    state_id: null,
                    city: null,
                    city_id: null,
                    cellno: formattedNumber
                };

                return updatedFormData;
            });

        }
        setFormData((prevFormData) => {
            const updatedFormData = [...prevFormData];
            updatedFormData[index] = {
                ...updatedFormData[index],
                dialcode: didi?.callingcode,
                country: didi?.name,
                country_id: didi?.id,
                state: null,
                state_id: null,
                city: null,
                city_id: null
            };

            return updatedFormData;
        });
    };
        /**
 * Handles stateshows.
 * @param {*} ctid - Input value.
 * @param {number} indexsatte - Input value.
 * @returns {void}
 */
const handleStateshows = (ctid, indexsatte) => {
        cityReq(ctid?.id)
        setState(ctid?.name);
        cityRequest(ctid?.id);
        setState_id(ctid?.id)
        // setPratice(false);
        setFormData((prevFormData) => {
            const updatedFormData = [...prevFormData];
            updatedFormData[indexsatte] = {
                ...updatedFormData[indexsatte],
                state: ctid?.name,           // Set the selected country name
                state_id: ctid?.id           // Set the selected country ID
            };

            return updatedFormData; // Return the updated form data
        });
    }
        /**
 * Handles lic stateshows.
 * @param {*} lictid - Input value.
 * @param {number} indexsattelic - Input value.
 * @returns {void}
 */
const handleLicStateshows = (lictid, indexsattelic) => {
        setFormData((prevFormData) => {
            const updatedFormData = [...prevFormData];
            updatedFormData[indexsattelic] = {
                ...updatedFormData[indexsattelic],
                medicallics: lictid?.name,
                license_state_id: lictid?.id
            };

            return updatedFormData; // Return the updated form data
        });
    }
        /**
 * Handles lic date.
 * @param {*} expID - Input value.
 * @param {*} datInde - Input value.
 * @returns {void}
 */
const handleLicDate = (expID, datInde) => {
        const formattedDate = moment(expID).format('YYYY-MM-DD');
        setOpendatelicyall(false);
        setFormData(prevFormData => {
            if (datInde >= 0 && datInde < prevFormData.length) {
                const updatedFormData = prevFormData.map((item, index) => {
                    if (index === datInde) {
                        return {
                            ...item,
                            license_expiry_date: formattedDate
                        };
                    }
                    return item;
                });

                return updatedFormData;
            }
            return prevFormData;
        });
    };
        /**
 * Handles dob date.
 * @param {*} dobID - Input value.
 * @param {*} dobix - Input value.
 * @returns {void}
 */
const handleDobDate = (dobID, dobix) => {
        const formattedDateDob = moment(dobID).format('YYYY-MM-DD');
        setDobchoose(false);
        setFormData(prevFormData => {
            if (dobix >= 0 && dobix < prevFormData.length) {
                const updatedFormDataDob = prevFormData.map((item, index) => {
                    if (index === dobix) {
                        return {
                            ...item,
                            dateofbirth: formattedDateDob
                        };
                    }
                    return item;
                });

                return updatedFormDataDob;
            }
            return prevFormData;
        });
    };
        /**
 * Handlecity shows utility.
 * @param {*} ctshows - Input value.
 * @param {number} cityindex - Input value.
 * @returns {void}
 */
const handlecityShows = (ctshows, cityindex) => {
        console.log(ctshows, cityindex, "ctshows+++++cityindex")
        setCity(ctshows?.name);
        setCity_id(ctshows?.id)
        // setCityPicker(false);
        setFormData((prevFormData) => {
            const updatedFormData = [...prevFormData];
            updatedFormData[cityindex] = {
                ...updatedFormData[cityindex],
                city: ctshows?.name,           // Set the selected country name
                city_id: ctshows?.id           // Set the selected country ID
            };

            return updatedFormData; // Return the updated form data
        });
    }

        /**
 * Apply coupon utility.
 * @returns {void}
 */
const applyCoupon = () => {
        if (!couponapp) {
            showErrorAlert("Please enter a valid coupon ")
        } else {
            let obj = {
                "invoice": ticketSave?.invoice,
                "couponcode": couponapp
            }
            let objrm = {
                "invoice": ticketSave?.invoice,
            }
            connectionrequest()
                .then(() => {
                    if (couponapp) {
                        dispatch(couponWebcastRequest(obj))
                    } else {
                        dispatch(cancelcouponRequest(objrm))
                    }
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }
    console.log(!statepicker || !countrypicker || !pratice || !cityPicker, opendatelicyall, dateindex, "country========123", countrypickerprof);
    const allPickersAreFalse = !licstatepratice && !statepicker && !countrypicker && !pratice && !cityPicker && !countrypickerprof;
    useLayoutEffect(() => {
            props.navigation.setOptions({ gestureEnabled: false });
        }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={!statepicker ? { flex: 1, backgroundColor: Colorpath.white } : { flex: 1, backgroundColor: Colorpath.white }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? "padding" : undefined}>
                    {allPickersAreFalse && (
                        Platform.OS === 'ios' ? (
                            <PageHeader title="Checkout" onBackPress={checkoutClear} />
                        ) : (
                            <View>
                                <PageHeader title="Checkout" onBackPress={checkoutClear} />
                            </View>
                        )
                    )}
                    <Loader visible={loaderVisible} />
                    <CheckoutMain
                        savefull={savefull}
                        setSavefull={setSavefull}
                        setNotadded={setNotadded}
                        notadded={notadded}
                        codesave={codesave}
                        setCodesave={setCodesave}
                        setCouponapp={setCouponapp}
                        couponapp={couponapp}
                        applyCoupon={applyCoupon}
                        WebcastReducer={WebcastReducer}
                        setAllmsg={setAllmsg}
                        allmsg={allmsg}
                        setProfindex={setProfindex}
                        profindex={profindex}
                        handleProfession={handleProfession}
                        countrypickerprof={countrypickerprof}
                        setcountrypickerprof={setcountrypickerprof}
                        handlecityShows={handlecityShows}
                        handleStateshows={handleStateshows}
                        handleCountrySet={handleCountrySet}
                        cityAll={cityAll}
                        slistpratice={slistpratice}
                        countryall={countryall}
                        handleInputChange={handleInputChange}
                        isEmailTouched={isEmailTouched}
                        setIsEmailTouched={setIsEmailTouched}
                        isCellNoTouched={isCellNoTouched}
                        setIsCellNoTouched={setIsCellNoTouched}
                        handleInputChangeeamilad={handleInputChangeeamilad}
                        pratice={pratice}
                        cityPicker={cityPicker}
                        city_id={city_id}
                        setCity_id={setCity_id}
                        setState_id={setState_id}
                        state_id={state_id}
                        setCountry_id={setCountry_id}
                        country_id={country_id}
                        removeSpeciality={removeSpeciality}
                        selectedSpecialities={selectedSpecialities}
                        setSelectedSpecialities={setSelectedSpecialities}
                        formData={formData}
                        setFormData={setFormData}
                        activeIndex={activeIndex}
                        activeIndexc={activeIndexc}
                        activeIndexct={activeIndexct}
                        activeIndexs={activeIndexs}
                        setActiveIndexc={setActiveIndexc}
                        setActiveindexs={setActiveIndexs}
                        setActiveIndexct={setActiveIndexct}
                        setActiveIndex={setActiveIndex}
                        setSearchState={setSearchState}
                        searchState={searchState}
                        searchStateName={handleSearch}
                        slist={slist}
                        speciality={speciality}
                        setSpeciality={setSpeciality}
                        speciality_id={speciality_id}
                        setSpeciality_id={setSpeciality_id}
                        statepicker={statepicker}
                        fullAccess={props?.route?.params?.checkoutSpan?.cartData ? isSingleAttendeeValid : fullAccess}
                        errorFlags={errorFlags}
                        cartPayment={cartPayment}
                        proceedPayment={proceedPayment}
                        spanroute={props?.route?.params?.checkoutSpan || props?.route?.params?.inPersonTicket}
                        ticketSave={ticketSave}
                        searchpratice={searchpratice}
                        searchpraticelic={searchpraticelic}
                        licstatepratice={licstatepratice}
                        setLicstatepratice={setLicstatepratice}
                        activeIndexslic={activeIndexslic}
                        setActiveIndexslic={setActiveIndexslic}
                        slistpraticelic={slistpraticelic}
                        license_expiry_date={license_expiry_date}
                        setLicense_expiry_date={setLicense_expiry_date}
                        license_state_id={license_state_id}
                        setLicense_state_id={setLicense_state_id}
                        license_number={license_number}
                        setLicense_number={setLicense_number}
                        handleLicStateshows={handleLicStateshows}
                        medicallics={medicallics}
                        setMedicallics={setMedicallics}
                        opendatelicyall={opendatelicyall}
                        setOpendatelicyall={setOpendatelicyall}
                        dateindex={dateindex}
                        setDateindex={setDateindex}
                        dobindex={dobindex}
                        setDobindex={setDobindex}
                        setDobchoose={setDobchoose}
                        dobchoose={dobchoose}
                        errors={errors}
                        setErrors={setErrors}
                        customFields={customFields}
                        setCustomFields={setCustomFields}
                        customFieldsLabels={customFieldsLabels}
                        setCustomFieldsLabels={setCustomFieldsLabels}
                        setPaymentcardfree={setPaymentcardfree}
                        setPaymentfdfree={setPaymentfdfree}
                        checkoutBaseAmount={checkoutBaseAmount}
                        checkoutProcessingFeeAmount={checkoutProcessingFeeAmount}
                        checkoutTotalAmount={checkoutTotalAmount}
                        dialcode={dialcode}
                        SetDialcode={SetDialcode}
                        setDateofbirth={setDateofbirth}
                        dateofbirth={dateofbirth}
                        iseMededDo={iseMededDo}
                        firstname={firstname} setFirstname={setFirstname} lastname={lastname} setLastname={setLastname} emailad={emailad} setEmailad={setEmailad} professionad={professionad} setProfessionad={setProfessionad} setstatepicker={setstatepicker} allProfession={allProfession} specaillized={specaillized} npino={npino} setNpino={setNpino} address={address} setAddress={setAddress} setCountrypicker={setCountrypicker} countryReq={countryReq} country={country} PraticingState={PraticingState} setPratice={setPratice} state={state} setCityPicker={setCityPicker} cityReq={cityReq} city={city} zipcode={zipcode} setZipcode={setZipcode} cellno={cellno} setCellno={setCellno} />
                    {countrypickerprof && <ProfessionInPerson
                        setcountrypicker={setcountrypickerprof}
                        searchtext={searchtext}
                        searchCountryName={searchCountryNameProfession}
                        clist={clist}
                        handleProfession={handleProfession}
                        setProfindex={setProfindex}
                        profindex={profindex}
                        setSearchtext={setSearchtext}
                        countrypickerprof={countrypickerprof}
                    />}
                    {statepicker && <CheckoutModalone
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
                        activeIndex={activeIndex}
                        setFormData={setFormData}
                        speciality_id={speciality_id}
                        speciality={speciality}
                        previousSpec={previousSpec}
                    />}
                    {countrypicker && <ChecktwoCountry countrypicker={countrypicker} setSearchcountry={setSearchcountry} activeIndex={activeIndexc} searchcountry={searchcountry} handleCountrySet={handleCountrySet} setCountrypicker={setCountrypicker} searchCountryName={handleCountry} countryall={countryall} />}
                    {pratice && <CheckStateShow pratice={pratice} setSearchState={setSearchpratice} activeIndex={activeIndexs} searchpratice={searchpratice} handleStateshows={handleStateshows} setPratice={setPratice} searchStateNamePratice={handlePratice} slistpratice={slistpratice} />}
                    {licstatepratice && <LicStateTakeShow licstatepratice={licstatepratice} setSearchpraticelic={setSearchpraticelic} activeIndexslic={activeIndexslic} searchpraticelic={searchpraticelic} handleLicStateshows={handleLicStateshows} setLicstatepratice={setLicstatepratice} handlePraticeLicTake={handlePraticeLic} slistpraticelic={slistpraticelic} />}
                    {cityPicker && <CheckThreeCity handlecityShows={handlecityShows} cityPicker={cityPicker} setCityPicker={setCityPicker} setSearchcity={setSearchcity} searchcity={searchcity} searchCityName={handleCity} cityAll={cityAll} activeIndex={activeIndexct} />}

                </KeyboardAvoidingView>
                {allmsg ? <Modal
                    isVisible={isVisibletext}
                    onBackdropPress={() => {
                        setIsVisibletext(false);
                        setAllmsg("");
                    }}
                    onBackButtonPress={() => {
                        setIsVisibletext(false);
                        setAllmsg("");
                    }}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    backdropTransitionOutTiming={0}
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    style={styles.modal}
                >
                    <View style={styles.container}>
                        <Image source={Imagepath.Logo} style={{ height: normalize(50), width: normalize(50), resizeMode: "contain" }} />
                        <View style={{ marginTop: normalize(20) }}>
                            <Text style={styles.content}>{`This user ${allmsg} is already registered for the selected ticket.`}</Text>
                        </View>
                    </View>
                </Modal> : null}
                <DateTimePickerModal
                    isVisible={opendatelicyall}
                    mode="date"
                    // Always set today's date as the minimum
                    minimumDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                    // Open the picker with previously selected date or default to today
                    date={
                        formData[dateindex]?.license_expiry_date
                            ? new Date(formData[dateindex].license_expiry_date)
                            : new Date(new Date().setDate(new Date().getDate() + 1))
                    }
                    onConfirm={val => {
                        handleLicDate(val, dateindex);
                        setOpendatelicyall(false); // close after selection
                    }}
                    onCancel={() => setOpendatelicyall(false)}
                    textColor="black"
                />
                <DateTimePickerModal
                    isVisible={dobchoose}
                    minimumDate={new Date(1900, 0, 1)}
                    mode="date"
                    date={formData[dobindex]?.dateofbirth ? new Date(formData[dobindex].dateofbirth) : new Date()} // Shows current selected date
                    maximumDate={new Date()} // Disables future dates
                    onConfirm={val => {
                        handleDobDate(val, dobindex);
                    }}
                    onCancel={() => setDobchoose(false)}
                    textColor="black"
                />
                <CellModalPayemnt
                    isVisible={paymentcardfree}
                    setPaymentcardfree={setPaymentcardfree}
                    content={ticketSave?.tickets?.[0]?.itemamt > 0 && !notadded ? "Your payment has been \n successfully completed." : "Your registration has been \n successfully confirmed."}
                    navigation={navigation}
                    name={checkoutCompletionRoute}
                    dataPayemnt={WebcastReducer?.StatusPaymentResponse}
                    maindata={props?.route?.params?.checkoutSpan?.checkoutSpan ? props?.route?.params?.checkoutSpan?.checkoutSpan : props?.route?.params?.inPersonTicket?.inpersonSpanrole}
                />
                <CellModalPayemntFailed
                    isVisible={paymentfdfree}
                    setPaymentfdfree={setPaymentfdfree}
                    content={ticketSave?.tickets?.[0]?.itemamt > 0 ? "Your payment has been \n successfully completed." : "Your registration has been \n successfully confirmed."}
                    navigation={navigation}
                    name={checkoutCompletionRoute} />
            </SafeAreaView>

        </>
    )
}

/**
 * Checkout default export.
 *
 * @returns {*}
 */
export default Checkout
/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    container: {
        width: normalize(280),
        backgroundColor: Colorpath.white,
        borderRadius: normalize(10),
        padding: normalize(20),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: "center",
    },
    content: {
        fontFamily: Fonts.InterMedium,
        fontSize: 16,
        color: Colorpath.black,
        textAlign: 'center',
        marginBottom: normalize(10),
    },
});
