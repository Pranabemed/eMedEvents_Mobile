import { View, Text, Platform, ScrollView, KeyboardAvoidingView, Alert, Animated, Easing, BackHandler, Pressable } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import MyStatusBar from '../../Utils/MyStatusBar'
import PageHeader from '../../Components/PageHeader'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import CalenderIcon from 'react-native-vector-icons/Feather';
import Buttons from '../../Components/Button';
import DeleteIcon from 'react-native-vector-icons/MaterialIcons';
import ScanIcon from 'react-native-vector-icons/AntDesign';
import CameraPicker from '../../Components/CameraPicker'
import moment from 'moment'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { licesensRequest } from '../../Redux/Reducers/AuthReducer'
import { useDispatch, useSelector } from 'react-redux'
import connectionrequest from '../../Utils/Helpers/NetInfo'
import showErrorAlert from '../../Utils/Helpers/Toast';
import { dashboardRequest, stateLicesenseRequest, stateReportingRequest } from '../../Redux/Reducers/DashboardReducer';
import Loader from '../../Utils/Helpers/Loader';
import ImagePicker from 'react-native-image-crop-picker';
import { CommonActions, useIsFocused } from '@react-navigation/native'
import PraticingStateComponent from './PraticingStateComponent'
import AsyncStorage from '@react-native-async-storage/async-storage'
import constants from '../../Utils/Helpers/constants'
import CustomizedYear from '../StateSpecification/CustomizedYear'
import StateModa from '../../Components/StateModa'
import { AppContext } from '../GlobalSupport/AppContext'
import CustomInputTouchable from '../../Components/IconTextIn'
import DropdownIcon from 'react-native-vector-icons/Entypo';
import InputField from '../../Components/CellInput'
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
let status1 = "";
const AddLicense = (props) => {
    const {
        setFulldashbaord,
        fulldashbaord,
        setAddit,
        statepush,
        setStatepush,
        addit
    } = useContext(AppContext);
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const [selectlicsense, setSelectlicsense] = useState(false);
    const [licsenseno, setlicsenseno] = useState(false);
    const [isModalVisiblecred, setModalVisiblecred] = useState(false);
    const [cameraPickerlic, setCameraPickerlic] = useState(false);
    const [ProfilePicObjlic, setProfilePicObjlic] = useState('');
    const [ProfilePicUrilic, setProfilePicUrilic] = useState('');
    const [opendatelic, setOpendatelic] = useState(false);
    const [rdate, setRdate] = useState(
        props?.route?.params?.profiledet?.from_date && props?.route?.params?.profiledet?.from_date !== "0000-00-00"
            ? props?.route?.params?.profiledet?.from_date
            : props?.route?.params?.myTaskask?.addLic?.from_date && props?.route?.params?.myTaskask?.addLic?.from_date !== "0000-00-00"
                ? props?.route?.params?.myTaskask?.addLic?.from_date
                : null
    );

    const [cdate, setCdate] = useState(
        props?.route?.params?.profiledet?.to_date
            ? props?.route?.params?.profiledet?.to_date
            : props?.route?.params?.myTaskask?.addLic?.to_date
                ? props?.route?.params?.myTaskask?.addLic?.to_date
                : null
    );
    const [opendatelicy, setOpendatelicy] = useState(false);
    const [selectStatepratice, setSelectStatepratice] = useState([]);
    const [slistpratice, setSlistpratice] = useState('');
    const [praticelic, setPraticelic] = useState(false);
    const [serachpraticelic, setSearchpraticelic] = useState("");
    const [specialidpratice, setSpecailidpraticelic] = useState("");
    const [stateDateFetch, setStateDateFetch] = useState(null);
    const [finalDate, setFinalDate] = useState("");
    const [fetchdata, setFetchdata] = useState(null);
    const [citypickeryear, setCitypickeryear] = useState(false);
    const [newtake, setNewtake] = useState("");
    const [targt, setTargt] = useState(null)
    const isFoucs = useIsFocused();
    const addCreditBack = () => {
        if (props?.route?.params?.profile) {
            props.navigation.goBack();
        } else if (props?.route?.params?.myTaskask?.backData) {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: "Mytasks", params: {
                                backget:
                                {
                                    taskData: props?.route?.params?.myTaskask?.backData,
                                    creditID: { state_name: props?.route?.params?.myTaskask?.backState }
                                }
                            }
                        }
                    ],
                })
            );
        } else if (props?.route?.params?.myTaskask?.Back) {
            setStatepush(addit);
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: "TabNav", params: { initialRoute: "Home" } }
                    ],
                })
            );
        } else if (props?.route?.params?.myTaskask?.creditvault) {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: "TabNav", params: { initialRoute: "Contact" } }
                    ],
                })
            );
        } else if (props?.route?.params?.profiledet) {
            props.navigation.goBack();
        } else {
            setStatepush(addit);
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: "TabNav", params: { initialRoute: "Home" } }
                    ],
                })
            );
        }
    }

    const [finalverifyvault, setFinalverifyvault] = useState(null);
    const [finalProfession, setFinalProfession] = useState(null);
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
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            }, 100);
        };

        token_handle_vault();
    }, [isFoucs]);
    const [allProfession, setAllProfession] = useState(null);

    useEffect(() => {
        const professionData =
            AuthReducer?.loginResponse?.user ||
            AuthReducer?.againloginsiginResponse?.user ||
            AuthReducer?.verifymobileResponse?.user ||
            finalverifyvault ||
            finalProfession;

        setAllProfession(professionData);
    }, [
        AuthReducer?.loginResponse?.user,
        AuthReducer?.againloginsiginResponse?.user,
        AuthReducer?.verifymobileResponse?.user,
        finalverifyvault,
        finalProfession,
        isFoucs
    ]);
    const toggleModalcred = () => {
        setModalVisiblecred(!isModalVisiblecred);
    };
    const licesenseState = () => {
        if (allProfession) {
            let obj = `${allProfession?.profession} - ${allProfession?.profession_type}`;
            connectionrequest()
                .then(() => {
                    dispatch(licesensRequest(obj))
                })
                .catch(err => {
                    showErrorAlert('Please connect to Internet', err);
                });
        }
    }

    useEffect(() => {
        licesenseState();
    }, [allProfession, isFoucs])
    function convertDate(dateString) {
        const date = moment(dateString, 'MMM DD');
        date.year(2024);
        const formattedDate = date.format('YYYY-MM-DD');
        return formattedDate;
    }
    useEffect(() => {
        if (stateDateFetch) {
            const formattedDate = convertDate(stateDateFetch);
            setFinalDate(formattedDate);
        }
    }, [stateDateFetch])
    useEffect(() => {
        if (DashboardReducer?.dashboardResponse?.data?.licensures) {
            setFetchdata(DashboardReducer?.dashboardResponse?.data?.licensures);
        }
    }, [DashboardReducer?.dashboardResponse?.data?.licensures, isFoucs]);
    const animatedValuespass = useRef(new Animated.Value(1)).current;
    const scaleValuesespass = useRef(new Animated.Value(0)).current;
    const animatedValuesemail = useRef(new Animated.Value(1)).current;
    const scaleValuesemail = useRef(new Animated.Value(0)).current;
    const animatedValuesdate = useRef(new Animated.Value(1)).current;
    const scaleValuesesdate = useRef(new Animated.Value(0)).current;
    const animatedValuesyear = useRef(new Animated.Value(1)).current;
    const scaleValuesesyear = useRef(new Animated.Value(0)).current;
    const animatedValuesimg = useRef(new Animated.Value(1)).current;
    const scaleValuesesimg = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const targetImg = ProfilePicObjlic ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesimg, {
                toValue: ProfilePicObjlic ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesimg, {
                toValue: targetImg,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [ProfilePicObjlic]);
    useEffect(() => {
        const targetScaleprof = selectlicsense ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuespass, {
                toValue: selectlicsense ? 1 : 0,
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
    }, [selectlicsense]);
    useEffect(() => {
        if (selectlicsense) {
            setSearchpraticelic("");
        }
    }, [selectlicsense])
    useEffect(() => {
        const shouldAnimate = rdate || stateDateFetch;
        const targetScaleprofdate = shouldAnimate ? 1 : 0.8;

        Animated.parallel([
            Animated.timing(animatedValuesdate, {
                toValue: shouldAnimate ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesdate, {
                toValue: targetScaleprofdate,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [rdate, stateDateFetch]);
    useEffect(() => {
        const targetScaleprofyear = cdate ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesyear, {
                toValue: cdate ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesyear, {
                toValue: targetScaleprofyear,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [cdate]);
    useEffect(() => {
        const targetScales = licsenseno ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesemail, {
                toValue: licsenseno ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesemail, {
                toValue: targetScales,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [licsenseno]);
    useEffect(() => {
        const boardId = props?.route?.params?.myTaskask?.addLic?.board_data?.board_id;
        const takeState = DashboardReducer?.dashboardResponse?.data?.licensures;
        const finalget = takeState?.filter(item => item?.board_id == boardId);
        setTargt(finalget);
    }, [props?.route?.params?.myTaskask])
    useEffect(() => {
        const handleTakeIt = props?.route?.params?.profiledet || props?.route?.params?.myTaskask?.addLic;
        if (handleTakeIt && typeof stateDateFetch == "undefined" || !stateDateFetch) {
            const boardId = handleTakeIt?.board_id || handleTakeIt?.board_data?.board_id;
            const takeState = DashboardReducer?.dashboardResponse?.data?.licensures;
            const finalget = takeState?.filter(item => item?.board_id == boardId);
            if (finalget?.length > 0) {
                setSelectlicsense(finalget?.[0]?.state);
                setlicsenseno(handleTakeIt?.license_number);
                setSpecailidpraticelic(finalget?.[0]?.state_id);
                dispatch(stateReportingRequest({ "state_id": finalget?.[0]?.state_id }));
            }
            const fromDate =
                handleTakeIt?.from_date && handleTakeIt?.from_date !== "0000-00-00"
                    ? handleTakeIt?.from_date
                    : targt?.[0]?.from_date && targt?.[0]?.from_date !== "0000-00-00"
                        ? targt?.[0]?.from_date
                        : null;
            setRdate(fromDate);
            const toDate = handleTakeIt?.to_date && handleTakeIt?.to_date !== "0000-00-00"
                ? handleTakeIt?.to_date : targt?.[0]?.to_date && targt?.[0]?.to_date !== "0000-00-00"
                    ? targt?.[0]?.to_date : null
            setCdate(toDate);
            const handleFile = handleTakeIt?.license_file ? handleTakeIt?.license_file : targt?.[0]?.license_file
            if (handleFile) {
                setProfilePicObjlic(handleFile);
            }

        } else {
            const boardId = handleTakeIt?.board_id || handleTakeIt?.board_data?.board_id;
            const takeState = DashboardReducer?.dashboardResponse?.data?.licensures;
            const finalget = takeState?.filter(item => item?.board_id == boardId);
            if (finalget?.length > 0) {
                setSelectlicsense(finalget?.[0]?.state);
                setlicsenseno(handleTakeIt?.license_number);
                setSpecailidpraticelic(finalget?.[0]?.state_id);
                dispatch(stateReportingRequest({ "state_id": finalget?.[0]?.state_id }));
            }
            const fromDate =
                handleTakeIt?.from_date && handleTakeIt?.from_date !== "0000-00-00"
                    ? handleTakeIt?.from_date
                    : targt?.[0]?.from_date && targt?.[0]?.from_date !== "0000-00-00"
                        ? targt?.[0]?.from_date
                        : null;
            setRdate(fromDate);
            const toDate = handleTakeIt?.to_date && handleTakeIt?.to_date !== "0000-00-00"
                ? moment(handleTakeIt?.to_date, "YYYY-MM-DD").format("YYYY") : targt?.[0]?.to_date && targt?.[0]?.to_date !== "0000-00-00"
                    ? moment(targt?.[0]?.to_date, "YYYY-MM-DD").format("YYYY") : null
            setCdate(toDate);
            const handleFile = handleTakeIt?.license_file ? handleTakeIt?.license_file : targt?.[0]?.license_file;
            if (handleFile) {
                setProfilePicObjlic(handleFile);
            }
            setNewtake(toDate);
        }
    }, [props?.route?.params?.profiledet, stateDateFetch, props?.route?.params?.myTaskask, targt]);
    const handleFromDateConfirm = (val) => {
        const formattedDate = moment(val).format('YYYY-MM-DD');
        setRdate(formattedDate);
        setOpendatelic(false);
        setCdate("");
        setCdate(null); // Reset to_date when from_date changes
    };
    const handleToDateConfirm = (val) => {
        setCdate(moment(val).format('YYYY-MM-DD'));
        setOpendatelicy(false);
    };

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
                setSelectStatepratice(filteredStates);
                setSlistpratice(filteredStates);
                break;
            case 'Auth/licesensFailure':
                status = AuthReducer.status;
                break;
        }
    }
    if (status1 == '' || DashboardReducer.status != status1) {
        switch (DashboardReducer.status) {
            case 'Dashboard/stateReportingRequest':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/stateReportingSuccess':
                status1 = DashboardReducer.status;
                setStateDateFetch(DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_date);
                break;
            case 'Dashboard/stateReportingFailure':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/stateLicesenseRequest':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/stateLicesenseSuccess':
                status1 = DashboardReducer.status;
                dispatch(dashboardRequest({}));
                toggleModalcred();
                break;
            case 'Dashboard/stateLicesenseFailure':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/dashboardRequest':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/dashboardSuccess':
                status1 = DashboardReducer.status;
                const uniqueStates = DashboardReducer?.dashboardResponse?.data?.licensures?.filter((state, index, self) => {
                    return index === self.findIndex((s) =>
                        s.state_id === state.state_id &&
                        s.board_id === state.board_id
                    );
                });
                setFulldashbaord(uniqueStates);
                const getAda = fulldashbaord?.[0];
                setAddit(getAda);
                break;
            case 'Dashboard/dashboardFailure':
                status1 = DashboardReducer.status;
                break;
        }
    }
    const handleYearcust = (don) => {
        setCdate(don);
        setCitypickeryear(false);
        setNewtake(don)
    }
    function directCameraUpload() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
            mediaType: "photo",
            includeBase64: false,
            saveToPhotos: true,
        })
            .then(response => {
                let imageObj = {
                    name: response.filename
                        ? response.filename
                        : response.path.replace(/^.*[\\\/]/, ''),
                    type: response.mime,
                    uri: response.path.startsWith('file://') ? response.path : `file://${response.path}`,
                };
                setProfilePicObjlic(imageObj);
                setProfilePicUrilic(imageObj.uri);
            })
            .catch(err => {
                console.log('Error opening camera:', err);
            });
    }

    const searchStateNamePratice = text => {
        if (text) {
            const praticeState = selectStatepratice?.filter(function (item) {
                const itemData = item?.state_name
                    ? item?.state_name.toUpperCase() + item?.state_name.toUpperCase()
                    : ''.toUpperCase();
                const textDataPratice = text.trim().toUpperCase();
                const praticeStateFiltered = itemData.indexOf(textDataPratice) > -1;
                return praticeStateFiltered;
            });
            setSlistpratice(praticeState);
            setSearchpraticelic(text);
        } else {
            setSlistpratice(selectStatepratice);
            setSearchpraticelic(text);
        }
    };
    useEffect(() => {
        const onBackPress = () => {
            addCreditBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    const addLicsenseHandle = () => {
        if (!selectlicsense) {
            showErrorAlert("Please choose your practicing state");
            return;
        }
        if (!licsenseno) {
            showErrorAlert("Please enter your license number");
            return;
        }
        if (rdate && stateDateFetch && !stateDateFetch) {
            showErrorAlert("Select your licensure expiry date");
            return;
        } else if (rdate && !stateDateFetch && !rdate) {
            showErrorAlert("Select your license issue Date");
            return;
        } else if (!rdate && stateDateFetch && !stateDateFetch) {
            showErrorAlert("Select your license expiry date");
            return;
        } else if (!rdate && !stateDateFetch && !rdate) {
            showErrorAlert("Select your license issue date");
            return;
        }
        if (stateDateFetch && !cdate) {
            showErrorAlert("Select your license expiry year");
            return;
        } else if (!stateDateFetch && !cdate) {
            showErrorAlert("Select your license expiry date");
            return;
        }
        const val1 = stateDateFetch;
        const val2 = cdate;
        const dateString = `${val1}, ${val2}`;
        const formattedDate = moment(dateString, "MMMMDD, YYYY").format("YYYY-MM-DD");

        let obj = new FormData();
        obj.append("id", props?.route?.params?.profiledet?.id ?? props?.route?.params?.myTaskask?.addLic?.id ?? 0);
        obj.append("state_id", specialidpratice);
        obj.append("from_date", newtake ? "" : stateDateFetch ? stateDateFetch : rdate);
        obj.append("to_date", newtake ? formattedDate : cdate);
        obj.append("license_number", licsenseno);
        obj.append("license_file", ProfilePicObjlic ? ProfilePicObjlic : null);
        obj.append("delete_file", ProfilePicObjlic ? 0 : 1);
        connectionrequest()
            .then(() => {
                dispatch(stateLicesenseRequest(obj));
            })
            .catch(err => {
                showErrorAlert("Please connect to internet", err);
            });
    }
    const currentYear = new Date().getFullYear();
    const yearRange = Array.from(
        { length: 5 },
        (_, index) => currentYear + index
    );
    const handleAddState = (itemmode) => {
        setSelectlicsense(itemmode?.state_name);
        setSpecailidpraticelic(itemmode.id)
        setPraticelic(false);
        dispatch(stateReportingRequest({ "state_id": itemmode?.id }))
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
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>

                {praticelic ? (<PraticingStateComponent handlePratcing={handleAddState}
                    slistpratice={slistpratice}
                    setPratice={setPraticelic}
                    searchpratice={serachpraticelic}
                    searchStateNamePratice={searchStateNamePratice}
                    setSearchpratice={setSearchpraticelic}
                     />
                ) : citypickeryear ? (
                        <CustomizedYear yearRange={yearRange} setCitypickeryear={setCitypickeryear} handleYearcust={handleYearcust} />
                    ) : <>
                    {Platform.OS === 'ios' ? <PageHeader
                        title={props?.route?.params?.profiledet ?? props?.route?.params?.myTaskask ? "Edit License" : "Add License"}
                        onBackPress={addCreditBack}
                    /> : <View>
                        <PageHeader
                            title={props?.route?.params?.profiledet ?? props?.route?.params?.myTaskask ? "Edit License" : "Add License"}
                            onBackPress={addCreditBack}
                        />
                    </View>}
                    <Loader
                        visible={DashboardReducer?.status == 'Dashboard/stateLicesenseRequest'} />
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    >
                        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ flexGrow: 1, paddingBottom: normalize(50) }}>
                            <View style={{ paddingHorizontal: normalize(15), paddingVertical: normalize(5) }}>
                                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: "#000000" }}>
                                    {props?.route?.params?.profiledet || props?.route?.params?.myTaskask ? "Edit State license" : "Add Your New State License"}
                                </Text>
                            </View>
                            <View style={{ paddingHorizontal: normalize(15), paddingVertical: normalize(10) }}>
                                <View style={{
                                    flexDirection: 'row',
                                    flex: 1
                                }}>
                                    <View style={{
                                        flex: 1,
                                        paddingRight: normalize(0)
                                    }}>
                                        <InputField
                                            label={"Upload Your License Certificate"}
                                            value={ProfilePicObjlic
                                                ? ProfilePicObjlic.uri
                                                    ? ProfilePicObjlic.uri.split('/').pop().replace(/-/g, '').slice(-16)
                                                    : ProfilePicObjlic.split('/').pop()
                                                : ""}
                                            placeholder=""
                                            placeholderTextColor="#949494"
                                            keyboardType="default"
                                            showCountryCode={false}
                                            editable={false}
                                            leftIcon={ProfilePicObjlic ? <DeleteIcon name="delete" size={25} color="#949494" /> : <ScanIcon name="scan1" size={28} color="#949494" />}
                                            onLeftIconPress={() => {
                                                if (ProfilePicObjlic) {
                                                    Alert.alert("eMedEvents", "Are you sure want to delete this file ?", [{ text: "No", onPress: () => console.log("fbfg"), onCancel: "default" }, { text: "Yes", onPress: () => setProfilePicObjlic(""), onCancel: "default" }])
                                                } else {
                                                    directCameraUpload();
                                                }
                                            }}
                                            onwholePress={() => {
                                                if (ProfilePicObjlic) {
                                                    Alert.alert("eMedEvents", "Are you sure want to delete this file ?", [{ text: "No", onPress: () => console.log("fbfg"), onCancel: "default" }, { text: "Yes", onPress: () => setProfilePicObjlic(""), onCancel: "default" }])
                                                } else {
                                                    setCameraPickerlic(true);
                                                }
                                            }}
                                            marginleft={ProfilePicObjlic ? normalize(270) : normalize(265)}
                                            spaceneeded={true}
                                        />
                                    </View>
                                </View>

                                <Pressable onPress={() => setPraticelic(!praticelic)} disabled={props?.route?.params?.profiledet || props?.route?.params?.myTaskask ? true : false}>
                                    <View style={{
                                        flexDirection: 'row',
                                        flex: 1
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            paddingRight: normalize(0)
                                        }}>
                                            <InputField
                                                icondisable={props?.route?.params?.profiledet || props?.route?.params?.myTaskask ? true : false}
                                                label={"Licensure State*"}
                                                value={selectlicsense}
                                                placeholder=""
                                                placeholderTextColor="#949494"
                                                keyboardType="default"
                                                showCountryCode={false}
                                                editable={false}
                                                leftIcon={<DropdownIcon name="chevron-small-down" size={25} color="#949494" />}
                                                onLeftIconPress={() => setPraticelic(!praticelic)}
                                                marginleft={normalize(270)}
                                                onwholePress={() => setPraticelic(!praticelic)}
                                                spaceneeded={true}
                                            />
                                        </View>
                                    </View>
                                </Pressable>
                                <View style={{
                                    flexDirection: 'row',
                                    flex: 1
                                }}>
                                    <View style={{
                                        flex: 1,
                                        bottom: normalize(1)
                                    }}>
                                        <InputField
                                            label='License Number*'
                                            value={licsenseno}
                                            onChangeText={setlicsenseno}
                                            placeholder=''
                                            placeholderTextColor="#949494"
                                            keyboardType="default"
                                            showCountryCode={false}
                                            maxlength={100}
                                        />
                                    </View>
                                </View>
                                <Pressable onPress={() => {
                                    if (props?.route?.params?.profiledet?.from_date ?? props?.route?.params?.myTaskask?.addLic?.from_date) {
                                        setOpendatelic(true);
                                    } else {
                                        setOpendatelic(true);
                                    }
                                }} disabled={stateDateFetch ? true : false}>
                                    <View style={{
                                        flexDirection: 'row',
                                        flex: 1
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            paddingRight: normalize(0)
                                        }}>
                                            <InputField
                                                icondisable={stateDateFetch ? true : false}
                                                label={rdate && stateDateFetch ? "Licensure Expiry  Date*" : rdate ? "License Issue Date*" : stateDateFetch ? "License Expiry Date*" : "License Issue Date*"}
                                                value={(() => {
                                                    const rawDate = stateDateFetch || rdate || "";
                                                    // Check if date is in YYYY-MM-DD format
                                                    if (moment(rawDate, "YYYY-MM-DD", true).isValid()) {
                                                        return moment(rawDate, "YYYY-MM-DD").format("MM-DD-YYYY");
                                                    }
                                                    return rawDate;
                                                })()}
                                                placeholder=""
                                                placeholderTextColor="#949494"
                                                keyboardType="default"
                                                showCountryCode={false}
                                                editable={false}
                                                leftIcon={<CalenderIcon name="calendar" size={25} color="#949494" />}
                                                onLeftIconPress={() => {
                                                    if (props?.route?.params?.profiledet?.from_date ?? props?.route?.params?.myTaskask?.addLic?.from_date) {
                                                        setOpendatelic(true);
                                                    } else {
                                                        setOpendatelic(true);
                                                    }
                                                }}
                                                onwholePress={() => {
                                                    if (props?.route?.params?.profiledet?.from_date ?? props?.route?.params?.myTaskask?.addLic?.from_date) {
                                                        setOpendatelic(true);
                                                    } else {
                                                        setOpendatelic(true);
                                                    }
                                                }}
                                                marginleft={normalize(270)}
                                                spaceneeded={true}
                                            />
                                        </View>
                                    </View>
                                </Pressable>

                                <View style={{
                                    flexDirection: 'row',
                                    flex: 1
                                }}>
                                    <View style={{
                                        flex: 1,
                                        paddingRight: normalize(0)
                                    }}>
                                        <CustomInputTouchable
                                            label={cdate && stateDateFetch ? "License Expiry Year*" : cdate ? "License Expiry Date*" : null}
                                            value={cdate
                                                ? (() => {
                                                    // Only convert if it matches YYYY-MM-DD format
                                                    if (cdate && typeof cdate == 'string' && /^\d{4}-\d{2}-\d{2}$/.test(cdate)) {
                                                        const momentDate = moment(cdate);
                                                        if (momentDate.isValid()) {
                                                            return momentDate.format('MM-DD-YYYY');
                                                        }
                                                    }
                                                    // Return original value for year-only or other formats
                                                    return cdate;
                                                })()
                                                : stateDateFetch
                                                    ? (() => {
                                                        // Only convert if it matches YYYY-MM-DD format
                                                        if (stateDateFetch && typeof stateDateFetch == 'string' && /^\d{4}-\d{2}-\d{2}$/.test(stateDateFetch)) {
                                                            const momentDate = moment(stateDateFetch);
                                                            if (momentDate.isValid()) {
                                                                return `License Expiry Date: ${momentDate.format('MM-DD-YYYY')}*`;
                                                            }
                                                        }
                                                        // Return original label for year-only or other formats
                                                        return "License Expiry Year*";
                                                    })()
                                                    : ""}
                                            placeholder={cdate ? cdate : stateDateFetch ? "License Expiry Year*" : "License Expiry Date*"}
                                            placeholderTextColor="#949494"
                                            rightIcon={stateDateFetch ? <DropdownIcon name="chevron-small-down" size={25} color="#949494" /> : <CalenderIcon name="calendar" size={25} color="#949494" />}
                                            onPress={() => {
                                                if (stateDateFetch) {
                                                    setCitypickeryear(true);
                                                } else {
                                                    setOpendatelicy(true);
                                                }
                                            }}
                                            onIconpres={() => {
                                                if (stateDateFetch) {
                                                    setCitypickeryear(true);
                                                } else {
                                                    setOpendatelicy(true);
                                                }
                                            }}
                                        />

                                    </View>
                                </View>
                            </View>
                            <Buttons
                                onPress={addLicsenseHandle}
                                height={normalize(45)}
                                width={normalize(291)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(9)}
                                text="Save"
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(10)}
                            />
                            <Buttons
                                onPress={() => {
                                    if (props?.route?.params?.profile) {
                                        props.navigation.goBack();
                                    } else if (props?.route?.params?.myTaskask?.backData) {
                                        props.navigation.dispatch(
                                            CommonActions.reset({
                                                index: 0,
                                                routes: [
                                                    { name: "Mytasks", params: { backget: { taskData: props?.route?.params?.myTaskask?.backData, creditID: { state_name: props?.route?.params?.myTaskask?.backState } } } }
                                                ],
                                            })
                                        );
                                    } else if (props?.route?.params?.myTaskask?.Back) {
                                        props.navigation.dispatch(
                                            CommonActions.reset({
                                                index: 0,
                                                routes: [
                                                    { name: "TabNav", params: { initialRoute: "Home" } }
                                                ],
                                            })
                                        );
                                    } else if (props?.route?.params?.myTaskask?.creditvault) {
                                        props.navigation.dispatch(
                                            CommonActions.reset({
                                                index: 0,
                                                routes: [
                                                    { name: "TabNav", params: { initialRoute: "Contact" } }
                                                ],
                                            })
                                        );
                                    } else if (props?.route?.params?.profiledet) {
                                        props.navigation.goBack();
                                    } else {
                                        props.navigation.navigate("TabNav");
                                    }
                                }}
                                height={normalize(45)}
                                width={normalize(280)}
                                backgroundColor={Colorpath.Pagebg}
                                borderRadius={normalize(9)}
                                text="Cancel"
                                color={Colorpath.ButtonColr}
                                fontSize={14}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(10)}
                            />
                            <StateModa
                                isVisible={isModalVisiblecred}
                                onClose={toggleModalcred}
                                content={props?.route?.params?.profiledet ?? props?.route?.params?.myTaskask ?"State license information \n updated successfully.": "State license information \n added successfully."}
                                navigation={props.navigation}
                                profile={props?.route?.params?.myTaskask?.BackMyTask ? "" : props?.route?.params?.myTaskask?.Back ? "" : props?.route?.params?.profiledet ? "text" : props?.route?.params?.profile ? "text" : ""}
                            />
                            <CameraPicker
                                cropping={true}
                                pickerVisible={cameraPickerlic}
                                onBackdropPress={() => setCameraPickerlic(false)}
                                btnClick_cameraUpload={imgObj => {
                                    setProfilePicObjlic(imgObj);
                                    setProfilePicUrilic(imgObj.uri);
                                    setCameraPickerlic(false);
                                }}
                                btnClick_ImageUpload={(imgObj) => {
                                    setProfilePicObjlic(imgObj);
                                    setProfilePicUrilic(imgObj.uri);
                                    setCameraPickerlic(false);
                                }}
                                btnClick_galeryUpload={imgObj => {
                                    setProfilePicObjlic(imgObj);
                                    setProfilePicUrilic(imgObj.uri);
                                    setCameraPickerlic(false);
                                }}
                            />

                            <DateTimePickerModal
                                isVisible={opendatelic}
                                mode="date"
                                date={rdate ? new Date(rdate) : new Date()}
                                onConfirm={handleFromDateConfirm}
                                onCancel={() => setOpendatelic(false)}
                            />
                            <DateTimePickerModal
                                isVisible={opendatelicy}
                                mode="date"
                                minimumDate={rdate ? new Date(rdate) : new Date()}
                                date={cdate ? new Date(cdate) : new Date(rdate || new Date())}
                                onConfirm={handleToDateConfirm}
                                onCancel={() => setOpendatelicy(false)}
                            />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </>}

            </SafeAreaView>
        </>
    )
}

export default AddLicense
