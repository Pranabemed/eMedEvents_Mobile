import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, FlatList, Animated, Easing, Image, BackHandler } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import normalize from '../../Utils/Helpers/Dimen';
import CalenderIcon from 'react-native-vector-icons/Feather';
import moment from 'moment'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomTextField from '../../Components/CustomTextfiled';
import Buttons from '../../Components/Button';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { cityWiseRequest, primeTrailRequest, stateInformSaveRequest, stateRequest } from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import TextFieldIn from '../../Components/Textfield';
import Loader from '../../Utils/Helpers/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { useIsFocused } from '@react-navigation/native';
import DropdownInputs from '../../Components/DropDownSec';
import CityComponent from './CityComponent';
import CustomizedYear from './CustomizedYear';
import Imagepath from '../../Themes/Imagepath';
import Header from '../../Components/Header';
import { dashMbRequest, mainprofileRequest } from '../../Redux/Reducers/DashboardReducer';
import { AppContext } from '../GlobalSupport/AppContext';
import CustomInput from '../../Components/NewTextIn';
import CustomInputTouchable from '../../Components/IconTextIn';
import DropdownIcon from 'react-native-vector-icons/Entypo';
import InputField from '../../Components/CellInput';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
let status1 = "";
const CreateStateInfor = (props) => {
    const {
        setFulldashbaord,
        setGtprof
    } = useContext(AppContext);
    console.log(props?.route?.params, "props?.route?.params?.dataVerify")
    const [finalverify, setFinalverify] = useState(null);
    const [takestate, setTakestate] = useState("");
    const [cityReq, setCityReq] = useState("");
    const [noloadnew, setNoloadnew] = useState(false);
    const [thoun, setThoun] = useState("")
    const isFocus = useIsFocused();
    useEffect(() => {
        const token_handle = () => {
            setTimeout(async () => {
                const loginHandle_verify = await AsyncStorage.getItem(constants.VERIFYSTATEDATA);
                console.log(loginHandle_verify, "statelicesene=================");
                const jsonObject = JSON.parse(loginHandle_verify);
                setFinalverify(jsonObject);
            }, 100);
        };

        try {
            token_handle();
        } catch (error) {
            console.log(error);
        }
    }, [props?.route?.params?.dataVerify]);
    useEffect(() => {
        if (props?.route?.params?.newData) {
            connectionrequest()
                .then(() => {
                    dispatch(mainprofileRequest({}))
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err);
                });
        }
    }, [props?.route?.params?.newData])
    const specialities = finalverify?.specialities || AuthReducer?.verifymobileResponse?.user?.specialities || props?.route?.params?.dataVerify?.specialities || props?.route?.params?.dataVerify?.allDat?.specialities;
    const specialityValue = specialities ? Object.values(specialities)[0] : null;
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    console.log(finalverify, "phonedata1111", finalverify?.renewal_date, "left", formattedDate?.dayMonth, AuthReducer?.verifymobileResponse?.user?.renewal_date);
    const currentYear = new Date().getFullYear();
    const yearRange = Array.from(
        { length: 11 },
        (_, index) => currentYear + index
    );
    console.log("Try programiz.pro", yearRange, cdate);
    const dispatch = useDispatch();
    const licenseStateId = useMemo(() => {
        return (
            finalverify?.license_state_id ||
            props?.route?.params?.dataVerify?.license_state_id ||
            props?.route?.params?.dataVerify?.allDat?.license_state_id ||
            AuthReducer?.verifymobileResponse?.user?.license_state_id
        );
    }, [
        finalverify,
        props?.route?.params,
        AuthReducer?.verifymobileResponse
    ]);
    useEffect(() => {
        if (!licenseStateId) return;
        connectionrequest()
            .then(() => {
                dispatch(cityWiseRequest(licenseStateId));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
            });
    }, [licenseStateId, isFocus]);
    const userLocation = AuthReducer?.verifymobileResponse?.user?.user_location || finalverify?.user_location || props?.route?.params?.dataVerify?.user_location || props?.route?.params?.dataVerify?.allDat?.user_location;
    const removeLastWord = (text) => {
        const words = text.split(',')[0].trim();
        return words;
    };
    const result = useMemo(() => {
        return userLocation ? removeLastWord(userLocation) : "";
    }, [userLocation]);
    const [opendatelic, setOpendatelic] = useState(false);
    const [rdate, setRdate] = useState("");
    const [opendatelicy, setOpendatelicy] = useState(false);
    const [cdate, setCdate] = useState(false);
    const [city, setCity] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [npino, setNpino] = useState("");
    const [licno, setLicno] = useState("");
    const [cityId, setCityId] = useState("");
    const [citypicker, setCitypicker] = useState(false);
    const [cityallfetched, setCityallfetched] = useState([]);
    const [citywiseallow, setCitywiseallow] = useState([]);
    const [citysave, setCitysave] = useState([]);
    const [citypickeryear, setCitypickeryear] = useState(false);
    const [yearOnly, setYearOnly] = useState(false);
    console.log("final verify", finalverify)
    const shouldCallPracticeState = useMemo(() => {
        return (
            !AuthReducer?.verifymobileResponse?.user?.license_state_id ||
            !props?.route?.params?.dataVerify?.license_state_id ||
            !finalverify?.license_state_id ||
            !props?.route?.params?.dataVerify?.allDat?.license_state_id
        );
    }, [
        AuthReducer?.verifymobileResponse?.user?.license_state_id,
        props?.route?.params?.dataVerify?.license_state_id,
        finalverify?.license_state_id,
        props?.route?.params?.dataVerify?.allDat?.license_state_id,
    ]);

    useEffect(() => {
        if (shouldCallPracticeState) {
            Praticing_State();
        }
    }, [isFocus, shouldCallPracticeState]);
    const Praticing_State = () => {
        connectionrequest()
            .then(() => {
                dispatch(stateRequest(1));
            })
            .catch(err => {
                // console.log(err);
                showErrorAlert('Please connect to Internet', err);
            });
    }
    const searchCityHandle = text => {
        console.log(text, 'text12333');
        if (text) {
            const praticeState = cityallfetched?.filter(function (item) {
                console.log('item+++++++++++++++++++state', item);
                const itemData = item?.name
                    ? item?.name.toUpperCase() + item?.name.toUpperCase()
                    : ''.toUpperCase();
                const textDataPratice = text.trim().toUpperCase();
                const cityWiseTestData = itemData.indexOf(textDataPratice) > -1;
                console.log('cityWiseTestDataState', cityWiseTestData);
                return cityWiseTestData;
            });
            setCitywiseallow(praticeState);
            setCitysave(text);
        } else {
            setCitywiseallow(cityallfetched);
            setCitysave(text);
        }
    };
    function splitFormattedDate(dateString) {
        if (!dateString || isNaN(Date.parse(dateString))) {
            return {
                dayMonth: 'Date',
                year: 'Year'
            };
        }
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const dayMonth = `${day} ${month}`;
        const yearStr = `${year}`;
        return {
            dayMonth,
            year: yearStr
        };
    }
    const dateStr = cdate ? cdate : "";
    const formattedDate = splitFormattedDate(dateStr);
    console.log(formattedDate?.dayMonth);
    console.log(formattedDate?.year);

    const finalShowDate = useMemo(() => {
        const renewalDate = AuthReducer?.verifymobileResponse?.user?.renewal_date || finalverify?.renewal_date || props?.route?.params?.dataVerify?.allDat?.renewal_date;
        console.log(renewalDate, "renewalDate----------")
        if (renewalDate) {
            return splitFormattedDate(renewalDate).dayMonth;
        } else if (formattedDate?.dayMonth !== 'Date') {
            return formattedDate.dayMonth;
        } else {
            return "";
        }
    }, [AuthReducer?.verifymobileResponse?.user?.renewal_date, finalverify?.renewal_date, formattedDate?.dayMonth, props?.route?.params?.dataVerify?.allDat?.renewal_date]);

    const wrapDataInDoubleArray = () => {
        const certificates = takestate;
        if (certificates) {
            return [certificates];
        }
        return [];
    };
    const fetchIdByName = (data, name) => {
        console.log(data, name, "name-------")
        const foundItem = data.find(item => item.name.toLowerCase() === name.toLowerCase());
        return foundItem ? foundItem.id : null;
    };

    useEffect(() => {
        if (takestate) {
            const takeAll = wrapDataInDoubleArray();
            const states = takeAll[0];
            const stateName = result;
            const stateId = fetchIdByName(states, stateName);
            cityTake(stateId);
            setCityReq(stateId);
            console.log(takeAll, "takeAll-----", stateId, states);
        }
    }, [takestate]);
    const cityTake = (handletake) => {
        const handleID = DashboardReducer?.mainprofileResponse?.user_address?.state_id || handletake;
        connectionrequest()
            .then(() => {
                dispatch(cityWiseRequest(handleID))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    useEffect(() => {
        const handleIDs = DashboardReducer?.mainprofileResponse?.user_address?.state_id || cityReq;
        connectionrequest()
            .then(() => {
                dispatch(cityWiseRequest(handleIDs))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }, [cityReq, DashboardReducer?.mainprofileResponse?.user_address?.state_id])
    console.log(finalShowDate, "finaldatae");
    const handleCityName = (did) => {
        setCity(did?.name);
        setCityId(did.id)
        setCitypicker(false);
    }
    useEffect(() => {
        if (city) {
            setCitysave("");
        }
    }, [city])
    useEffect(() => {
        if (!citysave && AuthReducer?.cityWiseResponse?.cities) {
            setCitywiseallow(AuthReducer?.cityWiseResponse?.cities)
        }
    }, [citysave])
    const animatedValuespass = useRef(new Animated.Value(1)).current;
    const scaleValuesespass = useRef(new Animated.Value(0)).current;
    const animatedValuesemail = useRef(new Animated.Value(1)).current;
    const scaleValuesemail = useRef(new Animated.Value(0)).current;
    const animatedValueslic = useRef(new Animated.Value(1)).current;
    const scaleValueselic = useRef(new Animated.Value(0)).current;
    const animatedValuesnpi = useRef(new Animated.Value(1)).current;
    const scaleValuesnpi = useRef(new Animated.Value(0)).current;
    const animatedValuesdate = useRef(new Animated.Value(1)).current;
    const scaleValuesesdate = useRef(new Animated.Value(0)).current;
    const animatedValuesyear = useRef(new Animated.Value(1)).current;
    const scaleValuesesyear = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const targetScaleprof = city ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuespass, {
                toValue: city ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesespass, {
                toValue: targetScaleprof,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [city]);
    useEffect(() => {
        const targetyear = cdate ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesyear, {
                toValue: cdate ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesyear, {
                toValue: targetyear,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [cdate]);
    useEffect(() => {
        const targetDate = AuthReducer?.verifymobileResponse?.user?.renewal_date
            || finalverify?.renewal_date || props?.route?.params?.dataVerify?.allDat?.renewal_date
            || formattedDate?.dayMonth ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesdate, {
                toValue: AuthReducer?.verifymobileResponse?.user?.renewal_date
                    || finalverify?.renewal_date || props?.route?.params?.dataVerify?.allDat?.renewal_date
                    || formattedDate?.dayMonth ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesdate, {
                toValue: targetDate,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [AuthReducer?.verifymobileResponse?.user?.renewal_date
        || finalverify?.renewal_date || props?.route?.params?.dataVerify?.allDat?.renewal_date
        || formattedDate?.dayMonth]);
    useEffect(() => {
        const targetlicno = licno ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValueslic, {
                toValue: licno ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValueselic, {
                toValue: targetlicno,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [licno]);
    useEffect(() => {
        const targetnpino = npino ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesnpi, {
                toValue: npino ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesnpi, {
                toValue: targetnpino,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [npino]);
    useEffect(() => {
        const targetScaleprofZipcode = zipcode ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesemail, {
                toValue: zipcode ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesemail, {
                toValue: targetScaleprofZipcode,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [zipcode]);
    const handleYearcust = (don) => {
        setCdate(don);
        setCitypickeryear(false);
    }
    const cellNoRegexwpdd = /^\d{10}$/;
    const isValidWhatsappNodd = npino?.length > 0 && !cellNoRegexwpdd.test(npino);
    const handleStateInforSave = () => {
        const renewalDate =
            AuthReducer?.verifymobileResponse?.user?.renewal_date ||
            finalverify?.renewal_date ||
            props?.route?.params?.dataVerify?.allDat?.renewal_date;
        if (!city) {
            showErrorAlert("Select your city");
        } else if (!zipcode) {
            showErrorAlert("Enter your zipcode")
        } else if (isValidWhatsappNodd) {
            showErrorAlert("NPI must be 10 digits only")
        } else if (!licno) {
            showErrorAlert("Enter your license number")
        } else if (!cdate) {
            if (!renewalDate) {
                showErrorAlert("Select your licensure renewal date and year");
            } else {
                showErrorAlert("Select your licensure renewal year");
            }
        } else {
            let obj1 = {}
            connectionrequest()
                .then(() => {
                    dispatch(primeTrailRequest(obj1))
                })
                .catch((err) => showErrorAlert("Please connect to internet", err))
            let obj = {
                "license_number": licno,
                "license_expiry_date": AuthReducer?.verifymobileResponse?.user?.renewal_date
                    ? `${moment(AuthReducer?.verifymobileResponse?.user?.renewal_date, "MMM DD").format("DD-MM")}-${cdate}`
                    : finalverify?.renewal_date
                        ? `${moment(finalverify?.renewal_date, "MMM DD").format("DD-MM")}-${cdate}`
                        : props?.route?.params?.dataVerify?.allDat?.renewal_date
                            ? `${moment(props?.route?.params?.dataVerify?.allDat?.renewal_date, "MMM DD").format("DD-MM")}-${cdate}`
                            : cdate,
                "zip_code": zipcode,
                "city_id": cityId,
                "npi_number": npino ? npino : ""
            }
            connectionrequest()
                .then(() => {
                    dispatch(stateInformSaveRequest(obj))
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) })
        }
    }
    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/stateRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/stateSuccess':
                status = AuthReducer.status;
                setTakestate(AuthReducer?.stateResponse?.states);
                // Output: The ID for "Alabama" is: 2
                break;
            case 'Auth/stateFailure':
                status = AuthReducer.status;
                break;
            case 'Auth/cityWiseRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/cityWiseSuccess':
                status = AuthReducer.status;
                setCityallfetched(AuthReducer?.cityWiseResponse?.cities);
                setCitywiseallow(AuthReducer?.cityWiseResponse?.cities);
                break;
            case 'Auth/cityWiseFailure':
                status = AuthReducer.status;
                break;
            case 'Auth/stateInformSaveRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/stateInformSaveSuccess':
                status = AuthReducer.status;
                setGtprof(true);
                setNoloadnew(true);
                setTimeout(async () => {
                    const loginHandleProccess = await AsyncStorage.getItem(constants.TOKEN);
                    let objToken = { "token": loginHandleProccess || AuthReducer?.loginsiginResponse?.token, "key": {} }
                    dispatch(dashMbRequest(objToken));
                }, 10);
                break;
            case 'Auth/stateInformSaveFailure':
                status = AuthReducer.status;
                break;
        }
    }
    if (status1 == '' || DashboardReducer.status != status1) {
        switch (DashboardReducer.status) {
            case 'Dashboard/dashMbRequest':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/dashMbSuccess':
                status1 = DashboardReducer.status;
                console.log("DashboardReducer999912222", DashboardReducer.dashMbResponse.data?.licensures);
                const uniqueStates = DashboardReducer?.dashMbResponse?.data?.licensures?.filter((state, index, self) => {
                    return index === self.findIndex((s) =>
                        s.state_id === state.state_id &&
                        s.board_id === state.board_id
                    );
                });
                setNoloadnew(false);
                dispatch(mainprofileRequest({}))
                setFulldashbaord(uniqueStates);
                props.navigation.navigate("CheckMembership");
                break;
            case 'Dashboard/dashMbFailure':
                status1 = DashboardReducer.status;
                break;
        }
    }
    useEffect(() => {
        const onBackPress = () => {
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );
        return () => backHandler.remove();
    }, []);
    const displayCity = city && city.length > 14
        ? `${city.substring(0, 10).trimEnd()}..`
        : city;
    useEffect(() => {
        const specialtyData = DashboardReducer?.mainprofileResponse?.specialities;

        if (specialtyData && typeof specialtyData == "object") {
            const finalDate = Object.values(specialtyData)?.[0];
            setThoun(finalDate);
        } else {
            setThoun(null);
        }
    }, [DashboardReducer?.mainprofileResponse?.specialities]);
    const selectedDate = useMemo(() => {
        if (!cdate) return new Date();
        const d = new Date(cdate);
        return isNaN(d) ? new Date() : d;
    }, [cdate]);
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {citypicker ? (<CityComponent
                    handleCityName={handleCityName}
                    setCitypicker={setCitypicker}
                    citysave={citysave}
                    searchCityHandle={searchCityHandle}
                    citywiseallow={citywiseallow} />) : citypickeryear ? (
                        <CustomizedYear yearRange={yearRange} setCitypickeryear={setCitypickeryear} handleYearcust={handleYearcust} />
                    ) : <>
                    <Loader
                        visible={AuthReducer?.status == 'Auth/stateInformSaveRequest' || noloadnew} />
                    <View style={Platform?.OS === 'ios' ? { flexDirection: "row", marginBottom: normalize(35) } : { marginTop: normalize(60) }}>
                        {/* <Header
                            onPress={() => props.navigation.goBack()}
                            tintColor={Colorpath.black}
                        /> */}
                        {/* <View style={{ top: normalize(18), marginRight: normalize(20), justifyContent: "center", alignContent: "center" }}>
                            <Image
                                source={Imagepath.eMedfulllogo}
                                style={{ alignSelf: "center", height: normalize(40), width: normalize(212), resizeMode: "contain" }}
                            />
                        </View> */}

                        {/* <View style={{ width: normalize(260) }} /> */}
                    </View>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    >
                        <ScrollView contentContainerStyle={{ paddingBottom: normalize(40) }}>
                            <View style={{ paddingHorizontal: normalize(14), paddingVertical: normalize(10) }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 22, color: '#000000' }}>
                                    {` ${result ? result : DashboardReducer?.mainprofileResponse?.user_address?.state_name || ""} State License \n Information`}
                                </Text>
                            </View>
                            <View style={{ paddingHorizontal: normalize(18) }}>
                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 13, color: '#666666' }}>
                                    {"Fill the remaining fields to complete the signup process"}
                                </Text>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                                <View
                                    style={{
                                        width: normalize(290),
                                        borderRadius: normalize(10),
                                        backgroundColor: "#FFFFFF",
                                        paddingHorizontal: normalize(10),
                                        paddingVertical: normalize(10),
                                    }}
                                >
                                    <View style={{ width: normalize(230) }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                                {"First Name"}
                                            </Text>
                                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                                {"Last Name"}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 16, color: "#000000" }}>
                                                {AuthReducer?.verifymobileResponse?.user?.firstname || finalverify?.firstname || props?.route?.params?.dataVerify?.firstname || props?.route?.params?.dataVerify?.allDat?.firstname || DashboardReducer?.mainprofileResponse?.personal_information?.firstname}
                                            </Text>
                                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 16, color: "#000000", width: Platform.OS === 'ios' ? normalize(50) : normalize(60) }}>
                                                {AuthReducer?.verifymobileResponse?.user?.lastname || finalverify?.lastname || props?.route?.params?.dataVerify?.lastname || props?.route?.params?.dataVerify?.allDat?.lastname || DashboardReducer?.mainprofileResponse?.personal_information?.lastname}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ width: normalize(230) }}>
                                        <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                                            {/* Header Row */}
                                            <View style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                paddingVertical: normalize(2)
                                            }}>
                                                <Text style={{
                                                    fontFamily: Fonts.InterMedium,
                                                    fontSize: 14,
                                                    color: "#999999",
                                                    flex: 1
                                                }}>
                                                    {"Profession"}
                                                </Text>
                                                <Text style={{
                                                    fontFamily: Fonts.InterMedium,
                                                    fontSize: 14,
                                                    color: "#999999",
                                                    textAlign: "right",
                                                    marginRight: normalize(7)
                                                    // width: normalize(90) // Fixed width for proper alignment
                                                }}>
                                                    {"Specialty"}
                                                </Text>
                                            </View>
                                            <View style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                paddingVertical: normalize(2)
                                            }}>
                                                <View style={{ flex: 0.8 }}>
                                                    <Text style={{
                                                        fontFamily: Fonts.InterSemiBold,
                                                        fontWeight: "bold",
                                                        fontSize: 16,
                                                        color: "#000000",
                                                    }}>
                                                        {(() => {
                                                            const prof = AuthReducer?.verifymobileResponse?.user?.profession ||
                                                                finalverify?.profession ||
                                                                props?.route?.params?.dataVerify?.profession ||
                                                                props?.route?.params?.dataVerify?.allDat?.profession || DashboardReducer?.mainprofileResponse?.professional_information?.profession;
                                                            const type = AuthReducer?.verifymobileResponse?.user?.profession_type ||
                                                                finalverify?.profession_type ||
                                                                props?.route?.params?.dataVerify?.profession_type ||
                                                                props?.route?.params?.dataVerify?.allDat?.profession_type || DashboardReducer?.mainprofileResponse?.professional_information?.profession_type;

                                                            return prof && type
                                                                ? `${prof}-${type}`
                                                                : prof || type || '';
                                                        })()}
                                                    </Text>
                                                </View>
                                                <View style={{ width: Platform.OS === 'ios' ? normalize(52) : normalize(60) }}>
                                                    <Text style={{
                                                        fontFamily: Fonts.InterSemiBold,
                                                        fontWeight: "bold",
                                                        fontSize: 16,
                                                        color: "#000000",
                                                        width: normalize(105),
                                                        // backgroundColor:"yellow"
                                                        // textAlign: "right",
                                                    }}>
                                                        {specialityValue ? specialityValue : thoun || ""}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#999999" }}>
                                                {"Licensure State"}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 16, color: "#000000" }}>
                                                {result ? result : DashboardReducer?.mainprofileResponse?.user_address?.state_name}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={{ flex: 1, paddingHorizontal: normalize(0), paddingVertical: normalize(0), marginRight: 8 }}>
                                            <View>
                                                <TouchableOpacity onPress={() => setCitypicker(!citypicker)} style={[styles.formContainerrow]}>
                                                    {/* <CustomInputTouchable
                                                        label="City*"
                                                        value={city ? `${city.split(' ')[0]}...` : ''}
                                                        placeholder=""
                                                        placeholderTextColor="#949494"
                                                        rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                        onPress={() => setCitypicker(!citypicker)}
                                                        onIconpres={() => setCitypicker(!citypicker)}
                                                    /> */}
                                                    <InputField
                                                        label="City*"
                                                        value={displayCity}
                                                        placeholder=""
                                                        placeholderTextColor="#949494"
                                                        keyboardType="default"
                                                        showCountryCode={false}
                                                        maxLength={15}
                                                        editable={false}
                                                        leftIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                        onLeftIconPress={() => setCitypicker(!citypicker)}
                                                        marginleft={normalize(105)}
                                                        onwholePress={() => setCitypicker(!citypicker)}
                                                        spaceneeded={true}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={{ flex: 1, paddingHorizontal: normalize(0), paddingVertical: normalize(0), marginLeft: 8 }}>
                                            <View>
                                                <View style={{
                                                    flex: 0.5,
                                                    top: normalize(0)
                                                }}>
                                                    <InputField
                                                        label="Zipcode*"
                                                        value={zipcode}
                                                        onChangeText={setZipcode}
                                                        placeholder=""
                                                        placeholderTextColor="#949494"
                                                        keyboardType="default"
                                                        showCountryCode={false}
                                                        maxLength={6}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    {/* <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(5) }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                            <TouchableOpacity onPress={() => { setCitypicker(!citypicker) }}>
                                                <DropdownInputs
                                                    label={city ? "City*" : null}
                                                    placeholder="Select city*"
                                                    value={city ? `${city.split(' ')[0]}...` : ''}
                                                    editable={false}
                                                    style={{ height: normalize(40), width: normalize(130), paddingVertical: 0, fontSize: 12, color: "#000000", fontFamily: Fonts.InterSemiBold, fontWeight: "bold" }}
                                                    dropdownIcon={true}
                                                    animatedValue={animatedValuespass}
                                                    scaleValue={scaleValuesespass}
                                                    dropdisable={false}
                                                    onDropdownPress={() => {
                                                        setCitypicker(!citypicker);
                                                    }}
                                                    isDatachange={city ? 'arrow-drop-up' : 'arrow-drop-down'}
                                                />
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: "column" }}>
                                                <Animated.View style={{ opacity: animatedValuesemail, transform: [{ scale: scaleValuesemail }] }}>
                                                    {zipcode ? (
                                                        <View>
                                                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                                                {"Zipcode*"}
                                                            </Text>
                                                        </View>
                                                    ) : null}
                                                </Animated.View>
                                                <View
                                                    style={{
                                                        borderBottomColor: '#000000',
                                                        borderBottomWidth: 0.5,
                                                        marginTop: zipcode ? normalize(0) : normalize(8)
                                                    }}>
                                                    <TextInput
                                                        editable
                                                        maxLength={6}
                                                        onChangeText={(val) => { setZipcode(val) }}
                                                        value={zipcode}
                                                        style={{ height: normalize(40), width: normalize(120), paddingVertical: 0, fontSize: 12, color: "#000000", fontFamily: Fonts.InterMedium }}
                                                        placeholder="Zipcode*"
                                                        placeholderTextColor={"RGB(170, 170, 170)"}
                                                        keyboardType="default"
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View> */}
                                    <View>
                                        <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(0) }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                flex: 1
                                            }}>
                                                <View style={{
                                                    flex: 1,
                                                    paddingRight: normalize(0)
                                                }}>
                                                    <InputField
                                                        label="NPI Number"
                                                        value={npino}
                                                        onChangeText={setNpino}
                                                        placeholder=""
                                                        placeholderTextColor="#949494"
                                                        keyboardType="default"
                                                        showCountryCode={false}
                                                        maxLength={10}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        {isValidWhatsappNodd && (
                                            <View style={{ bottom: normalize(5) }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterSemiBold,
                                                        fontSize: 12,
                                                        color: 'red',
                                                        fontWeight: "bold"
                                                    }}>
                                                    {"Please enter valid npi number"}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    {/* <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(0) }}>
                                        <Animated.View style={{ opacity: animatedValuesnpi, transform: [{ scale: scaleValuesnpi }] }}>
                                            {npino ? (
                                                <View>
                                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                                        {"NPI Number"}
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </Animated.View>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                // marginTop: normalize(5)
                                            }}>
                                            <TextInput
                                                editable
                                                maxLength={10}
                                                onChangeText={(val) => { setNpino(val) }}
                                                value={npino}
                                                style={{ height: normalize(40), width: normalize(270), paddingVertical: 0, fontSize: 12, color: "#000000", fontFamily: Fonts.InterMedium }}
                                                placeholder="NPI Number"
                                                placeholderTextColor={"RGB(170, 170, 170)"}
                                                keyboardType="number-pad"
                                            />
                                        </View>
                                       
                                    </View> */}
                                    {/* <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                                        <Animated.View style={{ opacity: animatedValueslic, transform: [{ scale: scaleValueselic }] }}>
                                            {licno ? (
                                                <View>
                                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                                        {"Licensure Number*"}
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </Animated.View>
                                        <View
                                            style={{
                                                borderBottomColor: '#000000',
                                                borderBottomWidth: 0.5,
                                                // marginTop: normalize(5)
                                            }}>
                                            <TextInput
                                                editable
                                                onChangeText={(val) => { setLicno(val) }}
                                                value={licno}
                                                style={{ height: normalize(40), width: normalize(270), paddingHorizontal: 5, top: 5, fontSize: 12, color: "#000000", fontFamily: Fonts.InterMedium, }}
                                                placeholder="Licensure Number*"
                                                placeholderTextColor={"RGB(170, 170, 170)"}
                                                keyboardType="default"
                                            />
                                        </View>
                                    </View> */}
                                    <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(0) }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            flex: 1
                                        }}>
                                            <View style={{
                                                flex: 1,
                                                paddingRight: normalize(0)
                                            }}>
                                                <InputField
                                                    label="Licensure Number*"
                                                    value={licno}
                                                    onChangeText={setLicno}
                                                    placeholder=""
                                                    placeholderTextColor="#949494"
                                                    keyboardType="default"
                                                    showCountryCode={false}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    {finalShowDate && !yearOnly ? <View style={{ flexDirection: "row" }}>
                                        <View style={{ flex: 1, paddingHorizontal: normalize(0), paddingVertical: normalize(0) }}>
                                            <View>
                                                <View style={[styles.formContainerrow]}>
                                                    {/* <CustomInput
                                                        label={AuthReducer?.verifymobileResponse?.user?.renewal_date
                                                            || finalverify?.renewal_date || props?.route?.params?.dataVerify?.allDat?.renewal_date
                                                            || formattedDate?.dayMonth ? "Date*" : "Date*"}
                                                        value={AuthReducer?.verifymobileResponse?.user?.renewal_date
                                                            || finalverify?.renewal_date || props?.route?.params?.dataVerify?.allDat?.renewal_date
                                                            || formattedDate?.dayMonth}
                                                        placeholder={""}
                                                        placeholderTextColor="#949494"
                                                        maxlength={100}
                                                        editab={false}
                                                    // rightIcon={<Icon name="visibility" size={20} color="#000" />}
                                                    // onRightIconPress={() => console.log('Icon pressed')}
                                                    /> */}
                                                    <InputField
                                                        label={AuthReducer?.verifymobileResponse?.user?.renewal_date
                                                            || finalverify?.renewal_date || props?.route?.params?.dataVerify?.allDat?.renewal_date
                                                            || formattedDate?.dayMonth ? "Renewal Date*" : "Renewal Date*"}
                                                        value={AuthReducer?.verifymobileResponse?.user?.renewal_date
                                                            || finalverify?.renewal_date || props?.route?.params?.dataVerify?.allDat?.renewal_date
                                                            || formattedDate?.dayMonth}
                                                        placeholder=""
                                                        placeholderTextColor="#949494"
                                                        keyboardType="default"
                                                        showCountryCode={false}
                                                        maxLength={100}
                                                        editable={false}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, paddingHorizontal: normalize(0), paddingVertical: normalize(0), marginLeft: 10 }}>
                                            <View>
                                                <TouchableOpacity onPress={() => setCitypickeryear(!citypickeryear)}>
                                                    <View style={{
                                                        flex: 0.5,
                                                    }}>
                                                        <InputField
                                                            label={cdate ? "Renewal Year*" : "Renewal Year*"}
                                                            value={cdate ? cdate.toString() : ""}
                                                            placeholder=""
                                                            placeholderTextColor="#949494"
                                                            keyboardType="default"
                                                            showCountryCode={false}
                                                            maxLength={100}
                                                            editable={false}
                                                            leftIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                            onLeftIconPress={() => setCitypickeryear(!citypickeryear)}
                                                            marginleft={normalize(105)}
                                                            onwholePress={() => setCitypickeryear(!citypickeryear)}
                                                            spaceneeded={true}
                                                        />
                                                        {/* <CustomInputTouchable
                                                        label={cdate ? "Year*" : "Year*"}
                                                        value={cdate ? cdate.toString() : ""}
                                                        placeholder={""}
                                                        placeholderTextColor="#949494"
                                                        rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                        onPress={() => setCitypickeryear(!citypickeryear)}
                                                        onIconpres={() => setCitypickeryear(!citypickeryear)}
                                                    /> */}
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View> : <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(0) }}>
                                        <View style={styles.content}>
                                            <View style={styles.formContainer}>
                                                <TouchableOpacity onPress={() => {
                                                    setOpendatelicy(true);
                                                    setYearOnly(true);
                                                }}>
                                                    <InputField
                                                        label={cdate ? "Licensure Renewal Date & Year*" : "Licensure Renewal Date & Year*"}
                                                        value={(() => {
                                                            const rawDate = cdate || "";
                                                            if (moment(rawDate, moment.ISO_8601, true).isValid() ||
                                                                moment(rawDate, "YYYY-MM-DD", true).isValid()) {
                                                                return moment(rawDate).format("MMM DD, YYYY");
                                                            }
                                                            return rawDate;
                                                        })()}
                                                        placeholder=""
                                                        placeholderTextColor="#949494"
                                                        keyboardType="default"
                                                        showCountryCode={false}
                                                        maxLength={100}
                                                        editable={false}
                                                        leftIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                        onLeftIconPress={() => {
                                                            setOpendatelicy(true);
                                                            setYearOnly(true);
                                                        }}
                                                        onwholePress={() => {
                                                            setOpendatelicy(true);
                                                            setYearOnly(true);
                                                        }}
                                                        marginleft={normalize(250)}
                                                        spaceneeded={true}
                                                    />
                                                </TouchableOpacity>
                                                {/* <CustomInputTouchable
                                                    label={cdate ? "Licensure Renewal Year*" : "Licensure Renewal Year*"}
                                                    value={cdate ? cdate.toString() : ""}
                                                    placeholder={""}
                                                    placeholderTextColor="#949494"
                                                    rightIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                    onPress={() => {
                                                        setOpendatelicy(true);
                                                        setYearOnly(true);
                                                    }}
                                                    onIconpres={() => {
                                                        setOpendatelicy(true);
                                                        setYearOnly(true);
                                                    }}
                                                /> */}
                                            </View>
                                        </View>
                                    </View>}
                                    {/* {finalShowDate && !yearOnly ? (<View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(5) }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(2) }}>
                                            <DropdownInputs
                                                label={AuthReducer?.verifymobileResponse?.user?.renewal_date
                                                    || finalverify?.renewal_date || props?.route?.params?.dataVerify?.allDat?.renewal_date
                                                    || formattedDate?.dayMonth ? "Licensure Renewal Date*" : null}
                                                placeholder="Date*"
                                                value={AuthReducer?.verifymobileResponse?.user?.renewal_date
                                                    || finalverify?.renewal_date || props?.route?.params?.dataVerify?.allDat?.renewal_date
                                                    || formattedDate?.dayMonth}
                                                editable={false}
                                                style={{ height: normalize(40), width: normalize(130), paddingVertical: 0, fontSize: 12, color: "#000", fontFamily: Fonts.InterSemiBold, fontWeight: "bold" }}
                                                dropdownIcon={true}
                                                animatedValue={animatedValuesdate}
                                                scaleValue={scaleValuesesdate}
                                                dropdisable={false}
                                                onDropdownPress={() => {
                                                    console.log("Hello");
                                                }}
                                                isDatachange={null}
                                            />
                                            <TouchableOpacity onPress={() => {
                                                setCitypickeryear(!citypickeryear);
                                            }}>
                                                <DropdownInputs
                                                    label={cdate ? "Licensure Renewal Year*" : null}
                                                    placeholder="Year*"
                                                    value={cdate ? cdate.toString() : ""}
                                                    editable={false}
                                                    style={{ height: normalize(40), width: normalize(130), paddingVertical: 0, fontSize: 12, color: "#000", fontFamily: Fonts.InterSemiBold, fontWeight: "bold" }}
                                                    dropdownIcons={true}
                                                    animatedValue={animatedValuesyear}
                                                    scaleValue={scaleValuesesyear}
                                                    dropdisable={false}
                                                    onDropdownPress={() => {
                                                        setCitypickeryear(!citypickeryear);
                                                    }}
                                                    isDatachange={cdate ? "calendar" : "calendar"}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>) : (
                                        <>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
                                                    {"Licensure Renewal Date & Year *"}
                                                </Text>
                                            </View>
                                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                <View
                                                    style={{
                                                        borderBottomColor: '#000000',
                                                        borderBottomWidth: 0.5,
                                                    }}>
                                                    <TouchableOpacity onPress={() => {
                                                        setOpendatelicy(true);
                                                        setYearOnly(true);
                                                    }}>
                                                        <CustomTextField
                                                            value={cdate ? cdate.toString() : ""}
                                                            onChangeText={(val) => setCdate(val)}
                                                            height={normalize(50)}
                                                            width={normalize(280)}
                                                            backgroundColor={Colorpath.white}
                                                            alignSelf={'center'}
                                                            color={"#000000"}
                                                            borderRadius={normalize(9)}
                                                            placeholder={'Date & Year*'}
                                                            placeholderTextColor={"RGB( 170, 170, 170 )"}
                                                            fontSize={normalize(12)}
                                                            fontFamily={Fonts.InterSemiBold}
                                                            autoCapitalize="none"
                                                            keyboardType='default'
                                                            paddingHorizontal={normalize(1)}
                                                            // borderWidth={1}
                                                            borderColor={"#DDDDDD"}
                                                            rightIcon={CalenderIcon}
                                                            rightIconName={"calendar"}
                                                            rightIconSize={25}
                                                            rightIconColor="#63748b"
                                                            editable={false}
                                                            onRightIconPress={() => { setOpendatelicy(true) }}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </>)} */}
                                </View>
                            </View>
                            <View>
                                <Buttons
                                    onPress={handleStateInforSave}
                                    height={normalize(45)}
                                    width={normalize(300)}
                                    backgroundColor={Colorpath.ButtonColr}
                                    borderRadius={normalize(9)}
                                    text={"Submit"}
                                    color={Colorpath.white}
                                    fontSize={18}
                                    fontFamily={Fonts.InterSemiBold}
                                    marginTop={normalize(30)}
                                    disabled={false}
                                />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </>}

                <DateTimePickerModal
                    isVisible={opendatelicy}
                    mode="date"
                    minimumDate={new Date()}
                    date={selectedDate}
                    onConfirm={(val) => {
                        setCdate(val.toISOString()); // safest format
                        setOpendatelicy(false);
                    }}
                    onCancel={() => setOpendatelicy(false)}
                    textColor="black"
                />
            </SafeAreaView>
        </>
    );
};

export default CreateStateInfor;
const styles = StyleSheet.create({
    input: {
        height: normalize(50),
        width: normalize(130), padding: 10,
        backgroundColor: Colorpath.white,
        borderRadius: normalize(9),
        fontFamily: Fonts.InterMedium,
        fontSize: 15,
        color: "#000",
        borderWidth: 0.5,
        borderColor: "#999999"
    },
    inputbig: {
        height: normalize(50),
        width: normalize(280), padding: 10,
        backgroundColor: Colorpath.white,
        borderRadius: normalize(9),
        fontFamily: Fonts.InterMedium,
        fontSize: 15,
        color: "#000",
        borderWidth: 0.5,
        borderColor: "#999999"
    },
    dropDownItem: {
        borderWidth: 1,
        marginTop: normalize(10),
        justifyContent: 'center',
        alignItems: 'center',
        height: normalize(40),
        width: '85%',
        alignSelf: 'center',
    },
    dropDownItemText: {
        fontSize: normalize(14),
        lineHeight: normalize(14),
        textAlign: 'center',
        color: Colorpath.black,
        textTransform: 'capitalize'
    },
    dropdown: {
        height: normalize(45),
        width: normalize(280),
        alignSelf: 'center',
        backgroundColor: Colorpath.textField,
        // borderBottomColor: 'gray',
        // borderBottomWidth: 0.5,
        marginTop: normalize(9),
        borderRadius: normalize(8),
    },
    content: {
        flexDirection: 'row',
        flex: 1,
    },
    formContainer: {
        flex: 1,
        paddingRight: normalize(0),
    },
    formContainerrow: {
        flex: 0.5,
        paddingRight: normalize(0),
    },
    inputGroup: {
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontFamily: Fonts.InterRegular,
        color: '#999999',
        // marginBottom: 8,
    },
    inputWrapper: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#000000',
    },
    inputd: {
        padding: 12,
        fontSize: 16,
        fontFamily: Fonts.InterRegular,
        color: '#000000',
        paddingHorizontal: -10
    },
})