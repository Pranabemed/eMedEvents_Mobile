import { View, Text, Platform, KeyboardAvoidingView, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import PageHeader from '../../Components/PageHeader'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts'
import Imagepath from '../../Themes/Imagepath'
import CustomTextField from '../../Components/CustomTextfiled'
import TextFieldIn from '../../Components/Textfield';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfileSpeciality from '../Profile/ProfileSpecialty'
import { searchStateNameFunction } from './SearchStatename'
import { useDispatch, useSelector } from 'react-redux'
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import ProfessionComponent from '../Specialization/ProfessionComponent'
import { licesensRequest, professionRequest, specializationRequest, stateRequest } from '../../Redux/Reducers/AuthReducer'
import connectionrequest from '../../Utils/Helpers/NetInfo'
import showErrorAlert from '../../Utils/Helpers/Toast';
import CalenderIcon from 'react-native-vector-icons/Feather';
import Buttons from '../../Components/Button'
import { mainprofileRequest } from '../../Redux/Reducers/DashboardReducer'
import { searchStateNamePraticeFunction } from './SearchStateNamePratice'
import CheckStateShowCont from '../Profile/StateContact'
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { RegisterIntRequest } from '../../Redux/Reducers/WebcastReducer'
import Loader from '../../Utils/Helpers/Loader'
import CustomInputTouchable from '../../Components/IconTextIn'
import InputField from '../../Components/CellInput';
import DropdownIcon from 'react-native-vector-icons/Entypo';
import RegsiterModal from '../../Components/RegisterModal'
import CustomInputTouchableX from '../Profile/CustomInputTouchableX'
import { SafeAreaView } from 'react-native-safe-area-context'
let status1 = "";
let status = "";
const RegisterInterest = (props) => {
    console.log(props?.route?.params, "dfghfh------")
    const intBack = () => {
        props.navigation.goBack();
    }
    const [togglecard, setTogglecard] = useState(false);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [speciality_id, setSpeciality_id] = useState([]);
    const [speciality, setSpeciality] = useState("");
    const [formData, setFormData] = useState({});
    const [selectState, setSelectState] = useState([]);
    const [statepicker, setstatepicker] = useState(false);
    const [searchState, setSearchState] = useState('');
    const [selectedSpecialities, setSelectedSpecialities] = useState([]);
    const [previousSpec, setPreviousSpec] = useState("");
    const [slist, setSlist] = useState('');
    const [speids, setSpeids] = useState("");
    const [emailad, setEmailad] = useState("");
    const [selectCountry, setSelectCountry] = useState([]);
    const [clist, setClist] = useState('');
    const [countrypicker, setcountrypicker] = useState(false);
    const [country, setCountry] = useState('');
    const [searchtext, setSearchtext] = useState(false);
    const [licnumber, setLicnumber] = useState("");
    const [licdate, setLicdate] = useState("");
    const [cellnumber, setCellnumber] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [countryId, setCountryId] = useState("1");
    const [statepickerst, setStatepickerst] = useState(false);
    const [state, setState] = useState("");
    const [pratice, setPratice] = useState(false);
    const [searchpratice, setSearchpratice] = useState('');
    const [state_id, setState_id] = useState("");
    const [selectStatepratice, setSelectStatepratice] = useState([]);
    const [slistpratice, setSlistpratice] = useState('');
    const [opendatelic, setOpendatelic] = useState(false);
    const [rdate, setRdate] = useState("");
    const [fetchdata, setFetchdata] = useState(null);
    const [proftree, setProftree] = useState(false);
    const [zerocm, setZerocm] = useState(false);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const dispatch = useDispatch();
    useEffect(() => {
        if (DashboardReducer?.dashboardResponse?.data?.licensures) {
            setFetchdata(DashboardReducer?.dashboardResponse?.data?.licensures);
        }
    }, [DashboardReducer?.dashboardResponse?.data?.licensures]);
    useEffect(() => {
        setCountryId("1");
        PraticingState(countryId);
    }, [props?.route?.params?.checkoutSpan])
    const PraticingState = (index) => {
        connectionrequest()
            .then(() => {
                dispatch(stateRequest(index));
            })
            .catch(err => {
                showErrorAlert('Please connect to Internet', err);
            });
    };
    const handleProfession = (did) => {
        setCountry(did);
        setcountrypicker(false);
        specaillized(did?.split(' - ')[0])
        setFormData("");
        setState("");
        setState_id("");
        setProftree(false);
        licData(did);
    }
    const licData = (hill) => {
        const obj = hill;
        connectionrequest()
            .then(() => {
                dispatch(licesensRequest(obj));
            })
            .catch(err => {
                console.log(err);
                showErrorAlert('Please connect to Internet');
            });
    }
    const specaillized = (data) => {
        const obj = data
        connectionrequest()
            .then(() => {
                dispatch(specializationRequest(obj));
                dispatch(licesensRequest(obj));
            })
            .catch(err => {
                console.log(err);
                showErrorAlert('Please connect to Internet');
            });
    }
    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(mainprofileRequest({}))
                dispatch(professionRequest());
            })
            .catch(err => {
                console.log(err);
                showErrorAlert('Please connect to Internet');
            });
    }, [props?.route?.params?.checkoutSpan]);
    const searchCountryName = text => {
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
    const handlePratice = (text) => {
        searchStateNamePraticeFunction(text, selectStatepratice, setSlistpratice, setSearchpratice, (praticefil, praticetxtcount) => {
            console.log('countryfil Data:', praticefil, 'Search Text:', praticetxtcount);
        })
    }
    const handleSearch = (text) => {
        searchStateNameFunction(text, selectState, setSlist, setSearchState, (filteredList, searchText) => {
            console.log('Filtered Data:', filteredList, 'Search Text:', searchText);
        });
    };
    const handleSpecialitySelect = (selectedItems, formData) => {
        const updatedForm = [...formData];
        const selectedSpecialitiesNames = selectedItems.map(item => item?.name).join(', ');
        const selectedSpecialityIds = selectedItems.map(item => item?.id);
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
        if (DashboardReducer?.mainprofileResponse?.specialities) {
            const specialties = Object.entries(DashboardReducer?.mainprofileResponse?.specialities).map(([id, name]) => ({
                id: String(id),
                name: String(name),
            }));
            console.log(specialties, "specialties00000001222");
            const namesString = specialties.map(specialty => specialty.name).join(', ');
            const ids = specialties.map(specialty => specialty.id);
            setSpeciality(namesString);
            setSpeciality_id(ids);
            setPreviousSpec(specialties);
        }
    }, [props?.route?.params?.checkoutSpan, DashboardReducer?.mainprofileResponse?.specialities]);
    console.log(speciality, "initialFormData----------", speciality_id, formData, props?.route?.params);
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
    const handleStateshows = (ctid) => {
        setState(ctid?.name);
        setState_id(ctid?.id);
        setLicdate("");
        setRdate("")
        setLicnumber("");
    }
    const toggleHand = () => {
        setTogglecard(!togglecard);
    }
    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/licesensRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/licesensSuccess':
                status = AuthReducer.status;
                const uniqueStates = AuthReducer?.licesensResponse?.licensure_states?.filter((state, index, self) =>
                    index === self.findIndex((s) => s.id === state.id)
                );
                const filteredStates = uniqueStates?.filter((state) =>
                    !fetchdata?.some((dash) => dash.state_id === state.id)
                );
                console.log(filteredStates, "filteredStates>>>>>>>>>>>", AuthReducer?.licesensResponse?.licensure_states)
                setSelectStatepratice(filteredStates);
                setSlistpratice(filteredStates);
                break;
            case 'Auth/licesensFailure':
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
        }
    }
    const resultFinal = useMemo(() => {
        return selectStatepratice?.length > 0 ? setProftree(true) : setProftree(false);
    }, [selectStatepratice]);
    useEffect(() => {
        resultFinal
    }, [state])
    const handleFromDateConfirm = (val) => {
        const formattedDate = moment(val).format('YYYY-MM-DD');
        setLicdate(formattedDate);
        setOpendatelic(false);
    };
    useEffect(() => {
        if (DashboardReducer?.mainprofileResponse || AuthReducer?.verifyResponse?.phone) {
            const allDatashow = DashboardReducer?.mainprofileResponse?.user_address;
            const licAll = DashboardReducer.mainprofileResponse.licensures?.[0]
            setState(licAll?.state_name);
            setState_id(licAll?.state_id);
            setLicnumber(licAll?.license_number);
            const finaldate = licAll?.to_date && licAll?.to_date !== "0000-00-00"
                ? licAll?.to_date
                : null
            setLicdate(finaldate);

            const fromDate = licAll?.from_date && licAll?.from_date !== "0000-00-00"
                ? licAll?.from_date
                : null
                ;
            setRdate(fromDate);
            let phoneNumberToUse = allDatashow?.contact_no;
            let callingCodeToUse = allDatashow?.calling_code;
            if (!phoneNumberToUse && AuthReducer?.verifyResponse?.phone) {
                const authPhone = AuthReducer?.verifyResponse?.phone;
                const match = authPhone.match(/^\+(d{1,3})(\d+)$/);
                if (match) {
                    callingCodeToUse = match[1];
                    phoneNumberToUse = match[2];
                } else {
                    phoneNumberToUse = authPhone;
                }
            }

            let formattedCellNo = phoneNumberToUse;
            if (callingCodeToUse == "1" || callingCodeToUse == 1) {
                formattedCellNo = formatPhoneNumberno(phoneNumberToUse);
            } else if (callingCodeToUse == "91" || callingCodeToUse == 91) {
                formattedCellNo = formatIndianPhoneNumber(phoneNumberToUse);
            }
            setFirstname(DashboardReducer?.mainprofileResponse?.personal_information?.firstname);
            setLastname(DashboardReducer?.mainprofileResponse?.personal_information?.lastname);
            setEmailad(DashboardReducer?.mainprofileResponse?.personal_information?.email);
            const profession = DashboardReducer?.mainprofileResponse?.professional_information?.profession;
            const profession_type = DashboardReducer?.mainprofileResponse?.professional_information?.profession_type;
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

            setCountry(combinedValue || '');
            setCellnumber(formattedCellNo || phoneNumberToUse)
        }
    }, [DashboardReducer?.mainprofileResponse, AuthReducer?.verifyResponse?.phone])
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
    const formatPhoneNumber = (input) => {
        const cleaned = input.replace(/\D/g, '').slice(0, 10);
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

        if (match) {
            let formatted = '';
            if (match[1]) formatted = `(${match[1]}`;
            if (match[2]) formatted += `) ${match[2]}`;
            if (match[3]) formatted += `-${match[3]}`;
            return formatted;
        }
        return input;
    };
    console.log(selectStatepratice?.length, "selectStatepratice--------", proftree, cellnumber?.length);
    const validateEmail = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
    const isValidEmail = emailad?.length > 0 && !validateEmail.test(emailad);
    const cellNoRegexwpdd = /^\d{10}$/;
    const filteredTextcell = cellnumber && cellnumber?.length > 0 && cellnumber.replace(/[^\d]/g, '');
    const isValidcell = filteredTextcell?.length > 0 && !cellNoRegexwpdd.test(filteredTextcell);
    const interSubmit = () => {
        if (!country) {
            showErrorAlert("Please choose your profession ")
        } else if (formData?.speciality_ids?.length == 0) {
            showErrorAlert("Please choose your speciality(s)")
        } else {
            const buildConferencePayload = () => {
                const attendeeData = {
                    firstname: firstname || "",
                    lastname: lastname || "",
                    email: emailad || "",
                    profession: country || "",
                    license_state_id: state_id || "",
                    dob: "",
                    speciality: formData?.speciality_ids || [],
                    country_id: countryId || "",
                    state_id: state_id || "",
                    city_id: "",
                    zipcode: "",
                    phone: cellnumber || "",
                    job_title: ""
                };
                Object.keys(attendeeData).forEach(key => {
                    if (attendeeData[key] == "" || attendeeData[key]?.length == 0) {
                        delete attendeeData[key];
                    }
                });
                const payload = {
                    conference_id: props?.route?.params?.checkoutSpan?.checkoutSpan?.conferenceId,
                    attendee: [attendeeData]
                };
                return payload;
            };
            let obj = buildConferencePayload();
            connectionrequest()
                .then(() => {
                    dispatch(RegisterIntRequest(obj))
                })
                .catch((err) => showErrorAlert("Please connect to internet", err))
        }
    }
    const finalDis = useMemo(() => {
        return (
            firstname &&
            lastname &&
            !isValidEmail &&
            country &&
            (!proftree || state) &&
            formData?.speciality?.length > 0 &&
            licnumber &&
            licdate &&
            !isValidcell
        );
    }, [
        firstname,
        lastname,
        isValidEmail,
        country,
        ...(proftree ? [state] : []),
        formData?.speciality,
        licnumber,
        licdate,
        isValidcell,
        proftree
    ]);
    useEffect(() => {
        setZerocm(finalDis);
    }, [finalDis]);
    console.log(zerocm, "zercom=======");
    if (status1 == '' || WebcastReducer.status != status1) {
        switch (WebcastReducer.status) {
            case 'WebCast/RegisterIntRequest':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/RegisterIntSuccess':
                status1 = WebcastReducer.status;
                // if (WebcastReducer?.RegisterIntResponse?.payment_status == "success") {
                //     props.navigation.navigate("InterestCard", {
                //         invoiceTxt: {
                //             invoiceTxt: WebcastReducer?.RegisterIntResponse?.my_recommendations,
                //             creditDs: DashboardReducer.mainprofileResponse.licensures?.[0]
                //         }
                //     });
                // }
                toggleHand();
                break;
            case 'WebCast/RegisterIntFailure':
                status1 = WebcastReducer.status;
                showErrorAlert("Oops! Something went wrong. Please try again.")
                break;
        }
    }
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.white }}>
                {countrypicker ? <ProfessionComponent
                    setcountrypicker={setcountrypicker}
                    searchtext={searchtext}
                    searchCountryName={searchCountryName}
                    clist={clist}
                    handleProfession={handleProfession}
                    setSearchtext={setSearchtext}
                /> : statepicker ? <ProfileSpeciality
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
                    setSpeids={setSpeids}
                    speids={speids}
                /> : statepickerst ? (
                    <CheckStateShowCont
                        pratice={pratice}
                        setSearchState={setSearchpratice}
                        searchpratice={searchpratice}
                        handleStateshows={handleStateshows}
                        setPratice={setPratice}
                        searchStateNamePratice={handlePratice}
                        slistpratice={slistpratice}
                        statepicker={statepickerst}
                        setStatepicker={setStatepickerst}
                    />) : <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? "padding" : undefined}>
                    {Platform.OS === 'ios' ? (
                        <PageHeader title="Interest Checkout" onBackPress={intBack} />
                    ) : (
                        <View>
                            <PageHeader title="Interest Checkout" onBackPress={intBack} />
                        </View>
                    )
                    }
                    <Loader
                        visible={WebcastReducer?.status == 'WebCast/RegisterIntRequest'} />
                    <View style={{ backgroundColor: Colorpath.Pagebg, paddingBottom: normalize(5) }}>
                        <View
                            style={{
                                paddingHorizontal: normalize(10),
                                paddingVertical: normalize(3),
                            }}>
                            <Text numberOfLines={4}
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 18,
                                    color: '#000000',
                                    fontWeight: 'bold',
                                    textTransform: "capitalize"
                                }}>
                                {props?.route?.params?.checkoutSpan?.checkoutSpan?.title}
                            </Text>
                        </View>

                        <View
                            style={{
                                paddingHorizontal: normalize(10),
                                paddingVertical: normalize(0)
                            }}>
                            <Text numberOfLines={1}
                                style={{
                                    fontFamily: Fonts.InterRegular,
                                    fontSize: 14,
                                    color: '#000000',
                                    textTransform: "capitalize"
                                }}>
                                {`${props?.route?.params?.checkoutSpan?.checkoutSpan?.organizerName}`}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "column" }}>
                            <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(2) }}>
                                <Text numberOfLines={2} style={{
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 16,
                                    color: '#000000',
                                    width: normalize(120)
                                }}>
                                    {props?.route?.params?.checkoutSpan?.checkoutSpan?.conferenceTypeText}
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                flexWrap: 'wrap',
                                paddingHorizontal: normalize(11),
                                paddingVertical: normalize(0),
                                paddingBottom: normalize(5) // Added small padding to separate from the bottom gap
                            }}>
                                {props?.route?.params?.checkoutSpan?.checkoutSpan?.cmeCreditsData?.length > 0 ? (
                                    props?.route?.params?.checkoutSpan?.checkoutSpan?.cmeCreditsData?.map((d, index, array) => {
                                        const points = parseFloat(d?.points) || 0;
                                        const name = d?.name || "";

                                        // Special formatting for "Contact Hour"
                                        const displayName =
                                            name.toLowerCase() == "contact hour" ? "Contact Hour(s)" : name;

                                        return (
                                            <View key={index}>
                                                <Text
                                                    numberOfLines={5}
                                                    style={{
                                                        fontFamily: Fonts.InterMedium,
                                                        fontSize: 16,
                                                        color: "#000000",
                                                        paddingVertical: normalize(0),
                                                    }}
                                                >
                                                    {`${points} ${displayName}${index < array.length - 1 ? ', ' : ''}`}
                                                </Text>
                                            </View>
                                        );
                                    })
                                ) : null}
                            </View>
                        </View>
                    </View>
                    <ScrollView contentContainerStyle={{ paddingBottom: normalize(50) }}>
                        <View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: normalize(10),
                                paddingVertical: normalize(10)
                            }}>
                                <TouchableOpacity onPress={() => { console.log("helo") }}>
                                    <Image source={Imagepath.Info} style={{ height: normalize(18), width: normalize(18), resizeMode: "contain" }} />
                                </TouchableOpacity>
                                <Text style={Platform.OS === "ios" ? {
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 12,
                                    color: "#333",
                                    marginLeft: normalize(5),
                                    width: normalize(270)
                                } : {
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 12,
                                    color: "#333",
                                    marginLeft: normalize(5),
                                    width: normalize(290)
                                }}>
                                    {"Please fill in the information below to receive an update once registration opens for this activity."}
                                </Text>
                            </View>
                            <View style={{ marginLeft: normalize(14) }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16,
                                        color: '#333',
                                        fontWeight: 'bold',
                                    }}>
                                    {"Interested Participant Information"}
                                </Text>
                            </View>
                        </View>
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
                                        onChangeText={(val) => setFirstname(val)}
                                        placeholder=''
                                        placeholderTextColor="#949494"
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxlength={100}
                                    />
                                </View>
                            </View>
                            {!firstname && <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterRegular,
                                        fontSize: 12,
                                        color: 'red',
                                    }}>
                                    {"Please enter your first name"}
                                </Text>
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
                                    <InputField
                                        label='Last Name*'
                                        value={lastname}
                                        onChangeText={(val) => setLastname(val)}
                                        placeholder=''
                                        placeholderTextColor="#949494"
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxlength={100}
                                    />
                                </View>
                            </View>
                            {!lastname && <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterRegular,
                                        fontSize: 12,
                                        color: 'red',
                                    }}>
                                    {"Please enter your last name"}
                                </Text>
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
                                    <InputField
                                        label='Email ID*'
                                        value={emailad}
                                        onChangeText={(val) => {
                                            setEmailad(val)
                                        }}
                                        placeholder=''
                                        placeholderTextColor="#949494"
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxlength={100}
                                    />
                                </View>
                            </View>
                            {!emailad ? <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterRegular,
                                        fontSize: 12,
                                        color: 'red',
                                    }}>
                                    {"Please enter your EmailID"}
                                </Text>
                            </View> : isValidEmail && (
                                <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 12,
                                            color: 'red',
                                        }}>
                                        {"Email address must be in correct format i.e. abc@gmail.com"}
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
                                    <CustomInputTouchable
                                        label={"Profession*"}
                                        value={country}
                                        placeholder={""}
                                        placeholderTextColor="#949494"
                                        rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                        onPress={() => setcountrypicker(!countrypicker)}
                                        onIconpres={() => setcountrypicker(!countrypicker)}
                                    />
                                </View>
                            </View>
                            {proftree && <View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>
                                <View style={{
                                    flex: 1,
                                    paddingRight: normalize(0)
                                }}>
                                    <CustomInputTouchable
                                        label={"Medical License State*"}
                                        value={state}
                                        placeholder={""}
                                        placeholderTextColor="#949494"
                                        rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                        onPress={() => {
                                            setStatepickerst(!statepickerst);
                                            PraticingState(countryId);
                                        }}
                                        onIconpres={() => {
                                            setStatepickerst(!statepickerst);
                                            PraticingState(countryId);
                                        }}
                                    />
                                </View>
                            </View>}
                            <CustomInputTouchableX
                                label={"Speciality(s)*"}
                                placeholder={""}
                                placeholderTextColor="#949494"
                                rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                onPress={() => {
                                    specaillized(country?.split(' - ')[0])
                                    setstatepicker(!statepicker);
                                }}
                                onIconpres={() => {
                                    specaillized(country?.split(' - ')[0])
                                    setstatepicker(!statepicker);
                                }}
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
                                    <InputField
                                        label='License Number*'
                                        value={licnumber}
                                        onChangeText={(val) => setLicnumber(val)}
                                        placeholder=''
                                        placeholderTextColor="#949494"
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxlength={10}
                                    />
                                </View>
                            </View>
                            {!licnumber && (
                                <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 12,
                                            color: 'red',
                                        }}>
                                        {"Please enter your license number"}
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
                                    <CustomInputTouchable
                                        label={'License Expiry Date'}
                                        value={licdate && moment(licdate, "YYYY-MM-DD", true).isValid()
                                            ? moment(licdate).format("MM-DD-YYYY")
                                            : "" || ''}
                                        placeholder={''}
                                        placeholderTextColor="#949494"
                                        rightIcon={<CalenderIcon name="calendar" size={25} color="#949494" />}
                                        onPress={() => setOpendatelic(!opendatelic)}
                                        onIconpres={() => setOpendatelic(!opendatelic)}
                                    />
                                </View>
                            </View>

                            {!licdate && (
                                <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 12,
                                            color: 'red',
                                        }}>
                                        {"Please enter your license expiry date"}
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
                                        value={cellnumber}
                                        onChangeText={(val) => {
                                            const formatted = formatPhoneNumber(val);
                                            setCellnumber(formatted);
                                        }}
                                        placeholder=""
                                        placeholderTextColor="#949494"
                                        keyboardType="phone-pad"
                                        showCountryCode={true}
                                        countryCode={"+1"}
                                        maxlength={14}
                                    />
                                </View>
                            </View>
                            {cellnumber?.length == 0 ? <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterRegular,
                                        fontSize: 12,
                                        color: 'red',
                                    }}>
                                    {"Please enter your cell number"}
                                </Text>
                            </View> : isValidcell && (
                                <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 12,
                                            color: 'red',
                                        }}>
                                        {"Please enter a valid Cell number"}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Buttons
                            onPress={interSubmit}
                            height={normalize(45)}
                            width={normalize(310)}
                            backgroundColor={zerocm ? Colorpath.ButtonColr : "#DADADA"}
                            borderRadius={normalize(9)}
                            text="Submit"
                            color={Colorpath.white}
                            fontSize={18}
                            fontFamily={Fonts.InterSemiBold}
                            marginTop={normalize(10)}
                            disabled={!zerocm}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>}
                {/* <DateTimePickerModal
                    isVisible={opendatelic}
                    mode="date"
                    date={licdate ? new Date(licdate) : new Date()}
                    onConfirm={handleFromDateConfirm}
                    onCancel={() => setOpendatelic(false)}
                /> */}
                <DateTimePickerModal
                    isVisible={opendatelic}
                    mode="date"
                    minimumDate={rdate ? new Date(rdate) : new Date()}
                    date={licdate ? new Date(licdate) : new Date(rdate || new Date())}
                    onConfirm={handleFromDateConfirm}
                    onCancel={() => setOpendatelic(false)}
                />
                <RegsiterModal
                    isVisible={togglecard}
                    onClose={toggleHand}
                    navigation={props.navigation}
                />
            </SafeAreaView>
        </>
    )
}

export default RegisterInterest