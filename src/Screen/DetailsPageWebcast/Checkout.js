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
import { checkstateRequest, cityRequest, countryRequest, professionRequest, specializationRequest, stateRequest } from '../../Redux/Reducers/AuthReducer';
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
let status = "";
let status1 = "";
const GOOGLE_API_KEY = 'AIzaSyBDnBivN-fdP6JxOcQFIyvhxIJSArru6Nk';
import { SafeAreaView } from 'react-native-safe-area-context'
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
    console.log(countrypickerprof, "countrypickerprof", clist, props?.route?.params?.inPersonTicket?.totalTicketPrice)
    // const isInitialLoad = useRef(false); 
    console.log(ticketSave, props?.route?.params, "1cheochg", props?.route?.params?.inPersonTicket?.inpersonSpanrole?.conferenceTypeId == "2", formData, "checkoutSpan=============");
    const isInitialLoad = useRef(true);

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
    const checkoutClear = () => {
        if (props?.route?.params?.checkoutSpan?.cartData) {
            navigation.navigate("AddToCart");
        } else {
            navigation.navigate("Statewebcast");
        }
    }
    const [finalverifyvault, setFinalverifyvault] = useState(null);
    const [finalProfession, setFinalProfession] = useState(null);
    console.log(country_id, "country_id=======");
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
    const handlePraticeLic = (text) => {
        searchStateLicNamePraticeFunction(text, selectStatepraticelic, setSlistpraticelic, setSearchpraticelic, (praticefillic, praticetxtcountlic) => {
            console.log('countryfil Data:', praticefillic, 'Search Text:', praticetxtcountlic);
        })
    }
    const handleCity = (text) => {
        searchCityNameFunction(text, cityshow, setCityAll, setSearchcity, (cityfill, citycountname) => {
            console.log('countryfil Data:', cityfill, 'Search Text:', citycountname);
        })
    }
    const [paymentcardfree, setPaymentcardfree] = useState(false);
    const [paymentfdfree, setPaymentfdfree] = useState(false);
    const toggleModalPaymentfree = (dd) => {
        console.log(paymentcardfree, "paymentcardfree-----", dd)
        setPaymentcardfree(dd);
    };
    const toggleModalFailedfree = (tik) => {
        console.log(paymentfdfree, "paymentcardfree-----", tik)
        setPaymentfdfree(tik);
    };
    console.log(paymentcardfree, "paymentcardfree-----", paymentfdfree)
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
        const token_handle_vault = () => {
            setTimeout(async () => {
                try {
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
    }, [props?.route?.params?.checkoutSpan?.checkoutSpan, props?.route?.params?.inPersonTicket?.inpersonSpanrole]);
    const allProfession = DashboardReducer?.mainprofileResponse || AuthReducer?.loginResponse?.user || AuthReducer?.againloginsiginResponse?.user || AuthReducer?.verifymobileResponse?.user || finalverifyvault || finalProfession;
    console.log(allProfession, "allprofesss=========");

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
    const countryReq = () => {
        connectionrequest()
            .then(() => {
                dispatch(countryRequest())
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
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
                const allTicketsFree = (ticketsArray) =>
                    ticketsArray?.length > 0 && ticketsArray.every(ticket => ticket?.ticket_type == "Free");
                const isAllFree = allTicketsFree(props?.route?.params?.checkoutSpan?.finalTicket?.tickets) ||
                    allTicketsFree(props?.route?.params?.inPersonTicket?.inPersonTicket?.tickets);
                const handleDis = ticketSave?.discounts == true && !props?.route?.params?.inPersonTicket?.inPersonTicket;
                if (WebcastReducer?.saveRegistResponse?.msg == "Registration details saved successfully.") {
                    if (isAllFree) {
                        handleFree(ticketSave?.invoice);
                    } else if (handleDis) {
                        handleFree(ticketSave?.invoice);
                    } else {
                        props.navigation.navigate("Payment", {
                            invoiceTxt: {
                                invoiceTxt: ticketSave?.invoice, webcastTake: props?.route?.params?.checkoutSpan?.checkoutSpan ? props?.route?.params?.checkoutSpan?.checkoutSpan : props?.route?.params?.inPersonTicket?.inpersonSpanrole,
                                paymentprice: props?.route?.params?.checkoutSpan || props?.route?.params?.inPersonTicket, ticketShow: ticketSave,
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
                            paymentprice: props?.route?.params?.checkoutSpan,
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
                    setIsVisibletext(!isVisibletext);
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
    }, [ticketSave]);
    useEffect(() => {
        if (ticketSave) {
            const { license_state_id, license_number, license_expiry_date } = ticketSave;
            if (license_state_id) setLicense_state_id(license_state_id);
            if (license_number) setLicense_number(license_number);
            if (license_expiry_date) setLicense_expiry_date(license_expiry_date);
        }
    }, [ticketSave])
    useEffect(() => {
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
    }, [DashboardReducer?.mainprofileResponse, AuthReducer?.verifyResponse?.phone]);


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
        connectionrequest()
            .then(() => {
                dispatch(professionRequest());
            })
            .catch(err => {
                showErrorAlert('Please connect to Internet', err);
            });
    }, [isfocus]);
    const showModal = () => {
        setIsVisibletext(true);
        setTimeout(() => {
            setIsVisibletext(false);
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
    const requiredFields = [
        "firstname", "lastname", "emailad", "professionad", "license_state_id",
        "speciality", "license_number", "license_expiry_date", "address", "country", "state",
        "city", "zipcode", "cellno"
    ];
    if (iseMededDo) {
        requiredFields.push("dateofbirth");
    }
    const detectField = props?.route?.params?.checkoutSpan?.inPersonTicket?.custom_fields || props?.route?.params?.inPersonTicket?.inPersonTicket?.custom_fields || ticketSave?.custom_fields;
    console.log(detectField, "customField-------123", formData, iseMededDo)
    if (detectField && detectField?.length > 0) {
        // Loop through each item in detectField
        detectField.forEach(item => {
            // Check if the item has a field_name property
            if (item.required == 1) {
                // Add the field_name value to the requiredFields array
                requiredFields.push(item.field_name);
            }
        });
    }
    console.log(requiredFields, "requiredFields-------", detectField, formData)
    const nonbillings = [
        "firstname", "lastname", "emailad", "address", "country", "state",
        "city", "zipcode", "cellno"
    ];
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
    const validateEmail = (email) => {
        // Regular expression to validate email format
        const emailRegex = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
        return emailRegex.test(email);
    };

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
    const handleInputChangeeamilad = (index, key, value) => {
        console.log(value, "val======");
        const regexEmail = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
        const isValidEmail = regexEmail.test(value);
        if (isValidEmail) {
            emailCheck(index, key, value);
        }
    };
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
            function convertToISODate(dateString) {
                const dateObj = new Date(dateString);
                if (isNaN(dateObj.getTime())) {
                    throw new Error("Invalid date string");
                }
                return dateObj.toISOString();
            }
            const ticket = attendees[index] || {}; // Get the ticket at the same index or an empty object if none exists
            return {
                ticket_id: ticket.ticket_id || '', // Ensure ticket_id is available
                payment_ticket_id: ticket.payment_ticket_id || null, // Ensure payment_ticket_id is available
                firstname: data?.firstname || '', // Get the first name from formData
                lastname: data?.lastname || '', // Get the last name from formData
                email: data?.emailad || '', // Get the email from formData
                profession: data?.professionad || '', // Get profession from formData
                license_state_id: data?.license_state_id || null,
                license_expiry_date: convertToISODate(data?.license_expiry_date || null),
                license_number: data?.license_number || null, // Use state_id from formData
                speciality: data?.speciality_ids || [], // Use speciality IDs from formData
                address: data?.address || '', // Use address from formData
                npi_number: data?.npino || '', // Assuming this is a constant value
                country_id: data?.country_id || null, // Use country_id from formData
                state_id: data?.state_id || null, // Use state_id from formData
                city_id: data?.city_id || null, // Use city_id from formData
                zipcode: data?.zipcode || '', // Use zipcode from formData
                phone: data?.cellno || '', // Use cell phone number from formData,
                dob: data?.dateofbirth || ''
            };
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
                    <Loader
                        visible={WebcastReducer?.status == 'WebCast/saveRegistRequest' || WebcastReducer?.status == 'WebCast/cartCheckoutRequest' || WebcastReducer?.status == 'WebCast/FreeTransRequest' || WebcastReducer?.status == 'WebCast/StatusPaymentRequest' || WebcastReducer?.status == 'WebCast/couponWebcastRequest'} />
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
                    name={"TabNav"}
                    dataPayemnt={WebcastReducer?.StatusPaymentResponse}
                    maindata={props?.route?.params?.checkoutSpan?.checkoutSpan ? props?.route?.params?.checkoutSpan?.checkoutSpan : props?.route?.params?.inPersonTicket?.inpersonSpanrole}
                />
                <CellModalPayemntFailed
                    isVisible={paymentfdfree}
                    setPaymentfdfree={setPaymentfdfree}
                    content={ticketSave?.tickets?.[0]?.itemamt > 0 ? "Your payment has been \n successfully completed." : "Your registration has been \n successfully confirmed."}
                    navigation={navigation}
                    name={"TabNav"} />
            </SafeAreaView>

        </>
    )
}

export default Checkout
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