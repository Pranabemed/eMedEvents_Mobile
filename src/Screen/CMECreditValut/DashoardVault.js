import { View, Text, Platform, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import PageHeader from '../../Components/PageHeader'
import { CommonActions, useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar'
import GradientButton from '../../Components/LinearButton'
import Statevault from './Statevault'
import Boardvault from './Boardvault'
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { stateCourseRequest, stateMandatoryRequest, stateReportingRequest } from '../../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Statevaultcomponet from './Statevaultcomponet';
import { styles } from './Statevaultstyes';
import moment from 'moment';
import CMEChecklistModal from './CMEChecklistModal';
import { boardvaultRequest, professionvaultRequest } from '../../Redux/Reducers/CreditVaultReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import StateVaultModal from './StateVaultModal';
import BoardVaultModal from './BoardVaultModal';
import Loader from '../../Utils/Helpers/Loader';
import NetInfo from '@react-native-community/netinfo';
import IntIcn from 'react-native-vector-icons/MaterialIcons';
import Buttons from '../../Components/Button';
import { AppContext } from '../GlobalSupport/AppContext';
import StackNav from '../../Navigator/StackNav';
import Imagepath from '../../Themes/Imagepath';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
let status1 = "";
const DashoardVault = (props) => {
    const {
        isConnected,
        setIsConnected,
    } = useContext(AppContext);
    // const [avoid, setAvoid] = useState(false);
    const isfocused = useIsFocused();
    const [valuttext, setValuttext] = useState(true);
    const [width, setWidth] = useState(true);
    const [statepick, setStatepick] = useState("");
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const CreditVaultReducer = useSelector(state => state.CreditVaultReducer);
    const AuthReducer = useSelector(state => state.AuthReducer);
    console.log(AuthReducer?.staticdataResponse, "staticdataResponse======")
    const [statewise, setStatewise] = useState("");
    const [clisttopic, setClisttopic] = useState('');
    const [selectCountrytopic, setSelectCountrytopic] = useState([]);
    const [searchtexttopic, setSearchtexttopic] = useState('');
    const [stateid, setStateid] = useState("");
    const [creditwise, setCreditwise] = useState(null);
    const [expireDatecredit, setExpireDatecredit] = useState(false);
    const [countdownMessagecredit, setCountdownMessagecredit] = useState('');
    const [loadingCreditwise, setLoadingCreditwise] = useState(false);
    const [loadingStatewise, setLoadingStatewise] = useState(false);
    const [boardname, setBoardname] = useState("");
    const [licesense, setLicesense] = useState("");
    const [totalCredit, setTotalCredit] = useState("");
    const [mancredit, setMancredit] = useState("");
    const [mantopiccredit, setMantopiccredit] = useState("");
    const [gencredit, setGencredit] = useState("");
    const [gentopiccredit, setGentopiccredit] = useState("");
    const [expirelicno, setExpirelicno] = useState("");
    const [certificatedata, setCertificatedata] = useState(null);
    const [cmemodal, setCmemodal] = useState(false);
    const [allProfessionData, setAllProfessionData] = useState(null);
    const [renewalvault, setRenewalvault] = useState("");
    const [renewalCheck, setRenewalCheck] = useState(null);
    const [modalshow, setModalShow] = useState(false);
    ////board ---- area /////
    console.log(CreditVaultReducer?.boardvaultResponse?.board_data, "CreditVaultReducer===>>>>======:::::");
    const [statepickboard, setStatepickboard] = useState("");
    const [statewiseboard, setStatewiseboard] = useState("");
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const calculatedHeight = Platform.OS === "ios" ? windowHeight * 0.84 : windowHeight * 0.75;
    const calculatedWidth = windowWidth * 0.92;
    const [clisttopicboard, setClisttopicboard] = useState('');
    const [selectCountrytopicboard, setSelectCountrytopicboard] = useState([]);
    const [searchtexttopicboard, setSearchtexttopicboard] = useState('');
    const [stateidboard, setStateidboard] = useState("");
    const [expireDatecreditboard, setExpireDatecreditboard] = useState(false);
    const [countdownMessagecreditboard, setCountdownMessagecreditboard] = useState('');
    const [loadingCreditwiseboard, setLoadingCreditwiseboard] = useState(false);
    const [loadingStatewiseboard, setLoadingStatewiseboard] = useState(false);
    const [boardnameboard, setBoardnameboard] = useState("");
    const [licesenseboard, setLicesenseboard] = useState("");
    const [totalCreditboard, setTotalCreditboard] = useState("");
    const [mancreditboard, setMancreditboard] = useState("");
    const [mantopiccreditboard, setMantopiccreditboard] = useState("");
    const [gencreditboard, setGencreditboard] = useState("");
    const [gentopiccreditboard, setGentopiccreditboard] = useState("");
    const [boardexpiredate, setBoardexpiredate] = useState("");
    const [certificateboard, setCertificatebaord] = useState(null);
    const [lengthcheck, setLengthcheck] = useState("");
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(boardvaultRequest({}))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }, [isfocused])
    if (status1 == '' || CreditVaultReducer.status != status1) {
        switch (CreditVaultReducer.status) {
            case 'CreditVault/boardvaultRequest':
                status1 = CreditVaultReducer.status;
                setLoadingStatewiseboard(true);
                console.log("Helolo===============")
                break;
            case 'CreditVault/boardvaultSuccess':
                status1 = CreditVaultReducer.status;
                setLoadingStatewiseboard(false);
                console.log(CreditVaultReducer?.boardvaultResponse?.board_data, ">>>>>>>1111BoardVaultReducer");
                const finalboard = CreditVaultReducer?.boardvaultResponse?.board_data;
                const takeFinalBoard = Object.keys(finalboard).map(key => ({
                    ...finalboard[key],
                    board_id: key,
                }));
                console.log(takeFinalBoard, "stateDataArray1111")
                setSelectCountrytopicboard(takeFinalBoard);
                setClisttopicboard(takeFinalBoard);
                break;
            case 'CreditVault/boardvaultFailure':
                status1 = CreditVaultReducer.status;
                setLoadingStatewiseboard(false);
                break;
        }
    }
    console.log(clisttopicboard, "clisttopicboard=====", clisttopic)
    useEffect(() => {
        if (clisttopicboard?.length > 0) {
            const defaultStated = clisttopicboard[0];
            setLengthcheck(defaultStated);
            console.log(moment(defaultStated?.board_data?.expiry_date).format('MMMM DD, YYYY'), "clisttopic statttt=========")
            // setStatewise(defaultState?.board_data?.board_name); 
            setCertificatebaord(defaultStated);
            setBoardnameboard(defaultStated?.board_data?.board_name);
            setLicesenseboard(defaultStated?.board_data?.certification_id);
            setMancreditboard(defaultStated?.credits_data?.topic_earned_credits);
            setMantopiccreditboard(defaultStated?.credits_data?.topic_credits);
            setGencreditboard(defaultStated?.credits_data?.total_general_earned_credits);
            setGentopiccreditboard(defaultStated?.credits_data?.total_general_credits);
            setTotalCreditboard(defaultStated?.credits_data?.total_credits)
            setBoardexpiredate(moment(defaultStated?.board_data?.expiry_date).format('MMMM DD, YYYY'));
            const targetDate = defaultStated?.board_data?.expiry_date;
            const today = new Date();
            const endDate = new Date(targetDate);
            const differenceMs = endDate - today;
            const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
            if (differenceDays < 0 || differenceDays === 0) {
                setExpireDatecreditboard(true);
                setCountdownMessagecreditboard('');
            } else {
                setExpireDatecreditboard(false);
                setCountdownMessagecreditboard(`${differenceDays}`);
            }
        }
    }, [clisttopicboard]);
    useEffect(() => {
        setBoardnameboard(boardnameboard);
    }, [isfocused])
    useEffect(() => {
        if (stateidboard) {
            const targetDate = stateidboard?.board_data?.expiry_date;
            const today = new Date();
            const endDate = new Date(targetDate);
            const differenceMs = endDate - today;
            const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
            if (differenceDays < 0 || differenceDays === 0) {
                setExpireDatecreditboard(true);
                setCountdownMessagecreditboard('');
            } else {
                setExpireDatecreditboard(false);
                setCountdownMessagecreditboard(`${differenceDays}`);
            }
        }
    }, [stateidboard])
    console.log(clisttopicboard, stateidboard, boardexpiredate, selectCountrytopicboard, "clisttopic new =====>>>>>>>>")
    const searchTopicNameboard = text => {
        console.log(text, 'text12333');
        if (text) {
            const listAllData = selectCountrytopicboard?.filter(function (item) {
                console.log('item+++++++++++++++++++1111', item?.board_data.board_name);
                const itemDataTopic = item?.board_data.board_name
                    ? item?.board_data.board_name?.toUpperCase()
                    : ''.toUpperCase();
                const textDataTopic = text.trim().toUpperCase();
                const AllDataFilter = itemDataTopic.indexOf(textDataTopic) > -1;
                console.log('AllDataFilter', AllDataFilter);
                return AllDataFilter;
            });
            setClisttopicboard(listAllData);
            setSearchtexttopicboard(text);
        } else {
            setClisttopicboard(selectCountrytopicboard);
            setSearchtexttopicboard(text);
        }
    };
    const handleBoardname = (did) => {
        setStateidboard(did)
        setBoardnameboard(did?.board_data?.board_name);
        setStatepickboard(false);
        setCertificatebaord(did);
    }



    /////////state--area///////

    const onhandle = () => {
        setCmemodal(false);
    }
    const oncmeModalclose = () => {
        setCmemodal(!cmemodal)
    }
    useFocusEffect(
        React.useCallback(() => {
            let obj = {};

            const fetchData = () => {
                connectionrequest()
                    .then(() => {
                        dispatch(stateMandatoryRequest(obj));
                    })
                    .catch((err) => {
                        showErrorAlert("Please connect to internet", err);
                    });
            };

            fetchData();

            // Cleanup if needed
            return () => {
                // Cleanup logic here if necessary
            };
        }, [])
    );
    if (status == '' || DashboardReducer.status != status) {
        switch (DashboardReducer.status) {
            case 'Dashboard/stateMandatoryRequest':
                status = DashboardReducer.status;
                setLoadingStatewise(true);
                break;
            case 'Dashboard/stateMandatorySuccess':
                status = DashboardReducer.status;
                setLoadingStatewise(false);
                console.log(DashboardReducer?.stateMandatoryResponse?.state_data, ">>>>>>>DashboardReducer");
                // const stateData = DashboardReducer?.stateMandatoryResponse?.state_data;
                // const stateDataArray = Object.keys(stateData).map(key => ({
                //     ...stateData[key],
                //     state_id: key,
                // }));
                // setSelectCountrytopic(stateDataArray);
                // setClisttopic(stateDataArray);
                // console.log(selectCountrytopic,"selectCountrytopic=========");
                // if (selectCountrytopic?.length > 0) {
                //     const defaultState = selectCountrytopic[0];
                //     setStatewise(defaultState?.state_name);
                //     setStateid(defaultState?.state_id);
                // }
                break;
            case 'Dashboard/stateMandatoryFailure':
                status = DashboardReducer.status;
                setLoadingStatewise(false);
                break;
            case 'Dashboard/stateCourseRequest':
                status = DashboardReducer.status;
                setLoadingCreditwise(true);
                break;
            case 'Dashboard/stateCourseSuccess':
                status = DashboardReducer.status;
                setLoadingCreditwise(false);
                console.log(DashboardReducer?.stateCourseResponse?.data?.state_data, ">>>>>>>statewisedata");
                setCreditwise(DashboardReducer?.stateCourseResponse?.data?.state_data);
                break;
            case 'Dashboard/stateCourseFailure':
                status = DashboardReducer.status;
                setLoadingCreditwise(false);
                break;
            case 'Dashboard/stateReportingRequest':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/stateReportingSuccess':
                status = DashboardReducer.status;
                setRenewalCheck(DashboardReducer?.stateReportingResponse?.renewal_report);
                if (DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link) {
                    setRenewalvault(DashboardReducer.stateReportingResponse.renewal_report.renewal_link);
                } else {
                    setRenewalvault(null);
                }
                break;
            case 'Dashboard/stateReportingFailure':
                status = DashboardReducer.status;
                break;
        }
    }
    if (status1 == '' || CreditVaultReducer.status != status1) {
        switch (CreditVaultReducer.status) {
            case 'CreditVault/professionvaultRequest':
                status1 = CreditVaultReducer.status;
                break;
            case 'CreditVault/professionvaultSuccess':
                status1 = CreditVaultReducer.status;
                console.log(CreditVaultReducer?.professionvaultResponse, ">>>>>>>professioVaultResponse");
                setAllProfessionData(CreditVaultReducer?.professionvaultResponse);
                break;
            case 'CreditVault/professionvaultFailure':
                status1 = CreditVaultReducer.status;
                break;
        }
    }
    useEffect(() => {
        const stateData = DashboardReducer?.stateMandatoryResponse?.state_data;

        if (stateData) {
            const stateDataArray = Object.keys(stateData).map(key => ({
                ...stateData[key],
                state_id: key,
            }));

            console.log("New stateDataArray:", stateDataArray);

            // Update state with the new data
            setSelectCountrytopic(stateDataArray);
            setClisttopic(stateDataArray);

            if (stateDataArray.length > 0) {
                const defaultState = stateDataArray[0];
                setCertificatedata(defaultState);
                setStatewise(defaultState?.state_name || "");
                setStateid(defaultState?.state_id || "");
            } else {
                setCertificatedata(null);
                setStatewise("");
                setStateid("");
            }
        } else {
            setSelectCountrytopic([]);
            setClisttopic([]);
            setCertificatedata(null);
            setStatewise("");
            setStateid("");
        }
    }, [JSON.stringify(DashboardReducer?.stateMandatoryResponse?.state_data)]);


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
                    console.log(board_special_json, "statelicesene=================");
                    console.log(profession_data_json, "profession=================");
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            }, 100);
        };

        token_handle_vault();
    }, [certificatedata]);
    const allProfession = AuthReducer?.loginResponse?.user?.profession || AuthReducer?.againloginsiginResponse?.user?.profession || AuthReducer?.verifymobileResponse?.user?.profession || finalverifyvault?.profession || finalProfession?.profession;
    useEffect(() => {
        if (certificatedata) {
            let obj = {
                "profession": allProfession,
                "stateId": certificatedata?.state_id
            }
            dispatch(professionvaultRequest(obj))
        }
    }, [certificatedata])
    console.log(CreditVaultReducer, creditwise, "defaultState===============", stateid, certificatedata, allProfessionData);
    console.log(AuthReducer?.loginResponse?.user?.profession,
        AuthReducer?.againloginsiginResponse?.user?.profession,
        AuthReducer?.verifymobileResponse?.user?.profession, "data ===========")
    useEffect(() => {
        if (stateid) {
            let obj = {
                "state_id": stateid
            }
            dispatch(stateCourseRequest(obj));
            dispatch(stateReportingRequest(obj))
        }
    }, [stateid]);
    useEffect(() => {
        if (creditwise) {
            if (creditwise?.board_data?.expiry_date) {
                const targetDate = creditwise?.board_data?.expiry_date ? new Date(creditwise.board_data.expiry_date) : null;
                const today = new Date();
                if (moment(today).format("YYYY-MM-DD") > creditwise?.board_data?.expiry_date) {
                    setModalShow(true);
                }
                if (targetDate) {
                    const ninetyDaysBefore = new Date(targetDate);
                    ninetyDaysBefore.setDate(targetDate.getDate() - 90);
                    if (today > targetDate) {
                        // setModalShow(true);
                        setExpireDatecredit(true);
                        setCountdownMessagecredit('');
                    } else {
                        const differenceMs = targetDate - today;
                        const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
                        console.log(differenceDays, "differenceDays0000=============");
                        if (differenceDays == 89) {
                            // setModalShow(true);
                            setExpireDatecredit(true);
                            setCountdownMessagecredit('');
                        } else if (differenceDays < 89) {
                            // setModalShow(true);
                            setExpireDatecredit(true);
                            setCountdownMessagecredit(`${differenceDays}`);
                        } else {
                            // setModalShow(false);
                            setExpireDatecredit(false);
                            setCountdownMessagecredit(`${differenceDays}`);
                        }
                    }
                } else {
                    // setModalShow(true);
                    setExpireDatecredit(true);
                    setCountdownMessagecredit('');
                }
            }
            if (creditwise?.board_data?.board_name) {
                setBoardname(creditwise?.board_data?.board_name);
            }
            if (creditwise?.board_data?.expiry_date) {
                setExpirelicno(moment(creditwise?.board_data?.expiry_date).format('MMMM DD, YYYY'))
            }
            if (creditwise?.license_number) {
                setLicesense(creditwise?.license_number);
            }
            if (creditwise?.credits_data?.total_credits) {
                setTotalCredit(creditwise?.credits_data?.total_credits);
            }
            if (creditwise?.credits_data?.topic_earned_credits) {
                setMancredit(creditwise?.credits_data?.topic_earned_credits)
            }
            if (creditwise?.credits_data?.topic_credits) {
                setMantopiccredit(creditwise?.credits_data?.topic_credits);
            }
            if (creditwise?.credits_data?.total_general_earned_credits) {
                setGencredit(creditwise?.credits_data?.total_general_earned_credits);
            }
            if (creditwise?.credits_data?.total_general_credits) {
                setGentopiccredit(creditwise?.credits_data?.total_general_credits);
            }
        }

    }, [creditwise]);
    console.log(creditwise, "item------allll")
    console.log(selectCountrytopic?.length, DashboardReducer?.dashboardResponse?.data?.board_certifications?.length, "againState=====>>>>>>>>", DashboardReducer?.status, AuthReducer?.staticdataResponse?.state)
    const searchTopicName = text => {
        console.log(text, 'text12333');
        if (text) {
            const listAllData = selectCountrytopic?.filter(function (item) {
                console.log('item+++++++++++++++++++1111', item?.state_name);
                const itemDataTopic = item?.state_name
                    ? item?.state_name?.toUpperCase()
                    : ''.toUpperCase();
                const textDataTopic = text.trim().toUpperCase();
                const AllDataFilter = itemDataTopic.indexOf(textDataTopic) > -1;
                console.log('AllDataFilter', AllDataFilter);
                return AllDataFilter;
            });
            setClisttopic(listAllData);
            setSearchtexttopic(text);
        } else {
            setClisttopic(selectCountrytopic);
            setSearchtexttopic(text);
        }
    };
    const vaultState = (vault) => {
        setStateid(vault?.state_id)
        setStatewise(vault?.state_name);
        setCertificatedata(vault);
        setStatepick(false);
        setCreditwise(null);
        if (stateid) {
            let obj = {
                "state_id": stateid
            }
            dispatch(stateCourseRequest(obj));
        }
    }
    useEffect(() => {
        if (statewise) {
            setSearchtexttopic("");
        }
    }, [statewise])
    useEffect(() => {
        const stateData = DashboardReducer?.stateMandatoryResponse?.state_data;
        if (stateData) {
            const stateDataArray = Object.keys(stateData).map(key => ({
                ...stateData[key],
                state_id: key,
            }));
            if (!searchtexttopic && stateDataArray) {
                setClisttopic(stateDataArray);
            }
        }
    }, [searchtexttopic])
    useEffect(() => {
        setStatewise(statewise);

    }, [isfocused])
    useEffect(() => {
        // setAvoid(true);
        setWidth(true);
    }, [isfocused])
    const downCredit = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: "TabNav", params: { initialRoute: "Home" } }
                ],
            })
        );

    }
    const handleRot = () => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                <StackNav />
                console.log("Internet is back!");
            }
        });

        return () => unsubscribe();
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
            {conn === false ? <SafeAreaView style={stylesd.container}>
                <View style={stylesd.centerContainer}>
                    <View style={{ height: normalize(100), width: normalize(120), borderRadius: normalize(20), bottom: normalize(50), justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { height: 3, width: 0 }, elevation: 10, backgroundColor: "#FFFFFF" }}>
                        <Image source={Imagepath.NoWifi} style={{ height: normalize(40), width: normalize(40), resizeMode: "contain" }} />
                    </View>
                    <Buttons
                        onPress={handleRot}
                        height={normalize(45)}
                        width={normalize(240)}
                        backgroundColor={Colorpath.ButtonColr}
                        borderRadius={normalize(5)}
                        text="Retry"
                        color={Colorpath.white}
                        fontSize={16}
                        fontFamily={Fonts.InterSemiBold}
                        fontWeight="bold"
                        marginTop={normalize(65)}
                    />
                </View>
                <View style={stylesd.internetCard}>
                    <Text style={stylesd.internetText}>{"No Internet Connection"}</Text>
                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000" }}>{"Please check your internet connection \n                    and try again"}</Text>
                </View>
            </SafeAreaView> : <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {statepick ? (
                    <StateVaultModal
                        vaultState={vaultState}
                        setStatepick={setStatepick}
                        searchtexttopic={searchtexttopic}
                        searchTopicName={searchTopicName}
                        clisttopic={clisttopic}
                    />
                ) : statepickboard ? (<BoardVaultModal
                    handleBoardname={handleBoardname}
                    setStatepickboard={setStatepickboard}
                    statepickboard={statepickboard}
                    searchtexttopicboard={searchtexttopicboard}
                    searchTopicNameboard={searchTopicNameboard}
                    clisttopicboard={clisttopicboard} />) : (<>
                        <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                            {Platform.OS === "ios" ? (
                                <PageHeader
                                    title="Credit Vault"
                                    onBackPress={downCredit}
                                />
                            ) : (
                                <PageHeader
                                    title="Credit Vault"
                                    onBackPress={downCredit}
                                />

                            )}
                        </View>
                        <Loader visible={creditwise == null} />
                        <View style={{ marginTop: normalize(10) }}>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between", // Changed from space-evenly to space-between
                                width: normalize(300),
                                height: normalize(48),
                                backgroundColor: "#FFFFFF",
                                borderRadius: normalize(5),
                                paddingHorizontal: normalize(2), // Added padding to prevent overflow
                                alignSelf: 'center',
                            }}>
                                <TouchableOpacity
                                    style={[
                                        {
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flex: 1,
                                            height: normalize(41),
                                            borderRadius: normalize(5),
                                            marginTop: normalize(3),
                                            marginHorizontal: normalize(2),
                                        },
                                        valuttext && {
                                            backgroundColor: "#DCE4FF"
                                        }
                                    ]}
                                    onPress={() => { setValuttext(true); }}
                                >
                                    <Text style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 16,
                                        color: valuttext ? Colorpath.ButtonColr : "#000000",
                                        fontWeight:"500"
                                    }}>
                                        State License{
                                            AuthReducer?.staticdataResponse?.state ? ` (${AuthReducer.staticdataResponse.state})` :
                                                selectCountrytopic ? ` (${selectCountrytopic?.length})` :
                                                    ''
                                        }
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        {
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flex: 1,
                                            height: normalize(41),
                                            borderRadius: normalize(5),
                                            marginTop: normalize(3),
                                            marginHorizontal: normalize(-1),
                                        },
                                        !valuttext && {
                                            backgroundColor: "#DCE4FF"
                                        }
                                    ]}
                                    onPress={() => { setValuttext(false) }}
                                >
                                    <Text style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 16,
                                        color: !valuttext ? Colorpath.ButtonColr : "#000000",
                                        fontWeight:"500"
                                    }}>
                                        Board Certifications{DashboardReducer?.dashboardResponse?.data?.boards ? `(${Object.keys(DashboardReducer?.dashboardResponse?.data?.boards || {}).length})`:
                                            AuthReducer?.staticdataResponse?.board && AuthReducer.staticdataResponse.board.length > 0
                                                ? ` (${AuthReducer.staticdataResponse.board})`
                                                : DashboardReducer?.dashboardResponse?.data?.board_certifications &&
                                                    DashboardReducer.dashboardResponse.data.board_certifications.length > 0
                                                    ? ` (${DashboardReducer.dashboardResponse.data.board_certifications.length})`
                                                    : '(0)'
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView contentContainerStyle={{ paddingBottom: normalize(0) }}>
                            <View>
                                {/* <View style={{ zIndex: 999, position: "relative", top: 1, flexDirection: "row", justifyContent: "space-evenly", marginRight: valuttext ? normalize(100) : undefined, marginLeft: !valuttext ? normalize(100) : undefined }}>
                                    <View>
                                        {valuttext && <GradientButton width={width} />}
                                    </View>
                                    <View>
                                        {!valuttext && <GradientButton />}
                                    </View>
                                </View> */}
                                <View style={{ bottom: normalize(10) }}>
                                    {valuttext && <Statevault
                                        modalshow={modalshow}
                                        setModalShow={setModalShow}
                                        allProfession={allProfession}
                                        count={AuthReducer?.staticdataResponse?.state}
                                        onhandle={onhandle}
                                        oncmeModalclose={oncmeModalclose}
                                        navigation={navigation}
                                        dispatch={dispatch}
                                        DashboardReducer={DashboardReducer}
                                        CreditVaultReducer={CreditVaultReducer}
                                        AuthReducer={AuthReducer}
                                        statewise={statewise}
                                        setStatewise={setStatewise}
                                        clisttopic={clisttopic}
                                        setClisttopic={setClisttopic}
                                        statepick={statepick}
                                        selectCountrytopic={selectCountrytopic}
                                        setSelectCountrytopic={setSelectCountrytopic}
                                        searchtexttopic={searchtexttopic}
                                        setSearchtexttopic={setSearchtexttopic}
                                        searchTopicName={searchTopicName}
                                        stateid={stateid}
                                        setStateid={setStateid}
                                        creditwise={creditwise}
                                        setCreditwise={setCreditwise}
                                        expireDatecredit={expireDatecredit}
                                        setExpireDatecredit={setExpireDatecredit}
                                        countdownMessagecredit={countdownMessagecredit}
                                        setCountdownMessagecredit={setCountdownMessagecredit}
                                        loadingCreditwise={loadingCreditwise}
                                        setLoadingCreditwise={setLoadingCreditwise}
                                        loadingStatewise={loadingStatewise}
                                        setLoadingStatewise={setLoadingStatewise}
                                        boardname={boardname}
                                        setBoardname={setBoardname}
                                        licesense={licesense}
                                        setLicesense={setLicesense}
                                        totalCredit={totalCredit}
                                        setTotalCredit={setTotalCredit}
                                        mancredit={mancredit}
                                        setMancredit={setMancredit}
                                        mantopiccredit={mantopiccredit}
                                        setMantopiccredit={setMantopiccredit}
                                        gencredit={gencredit}
                                        setGencredit={setGencredit}
                                        gentopiccredit={gentopiccredit}
                                        setGentopiccredit={setGentopiccredit}
                                        expirelicno={expirelicno}
                                        setExpirelicno={setExpirelicno}
                                        certificatedata={certificatedata}
                                        setCertificatedata={setCertificatedata}
                                        cmemodal={cmemodal}
                                        setCmemodal={setCmemodal}
                                        allProfessionData={allProfessionData}
                                        setAllProfessionData={setAllProfessionData}
                                        renewalvault={renewalvault}
                                        setRenewalvault={setRenewalvault}
                                        isfocused={isfocused}
                                        setStatepick={setStatepick}
                                        vaultState={vaultState}
                                        renewalCheck={renewalCheck} />}
                                </View>
                                <View style={{ bottom: normalize(10) }}>
                                    {!valuttext && <Boardvault
                                        isfocused={isfocused}
                                        navigation={navigation}
                                        dispatch={dispatch}
                                        statepickboard={statepickboard}
                                        setStatepickboard={setStatepickboard}
                                        statewiseboard={statewiseboard}
                                        setStatewiseboard={setStatewiseboard}
                                        clisttopicboard={clisttopicboard}
                                        setClisttopicboard={setClisttopicboard}
                                        selectCountrytopicboard={selectCountrytopicboard}
                                        setSelectCountrytopicboard={setSelectCountrytopicboard}
                                        searchtexttopicboard={searchtexttopicboard}
                                        setSearchtexttopicboard={setSearchtexttopicboard}
                                        stateidboard={stateidboard}
                                        setStateidboard={setStateidboard}
                                        expireDatecreditboard={expireDatecreditboard}
                                        setExpireDatecreditboard={setExpireDatecreditboard}
                                        countdownMessagecreditboard={countdownMessagecreditboard}
                                        setCountdownMessagecreditboard={setCountdownMessagecreditboard}
                                        loadingCreditwiseboard={loadingCreditwiseboard}
                                        setLoadingCreditwiseboard={setLoadingCreditwiseboard}
                                        loadingStatewiseboard={loadingStatewiseboard}
                                        setLoadingStatewiseboard={setLoadingStatewiseboard}
                                        boardnameboard={boardnameboard}
                                        setBoardnameboard={setBoardnameboard}
                                        licesenseboard={licesenseboard}
                                        setLicesenseboard={setLicesenseboard}
                                        totalCreditboard={totalCreditboard}
                                        setTotalCreditboard={setTotalCreditboard}
                                        mancreditboard={mancreditboard}
                                        setMancreditboard={setMancreditboard}
                                        mantopiccreditboard={mantopiccreditboard}
                                        setMantopiccreditboard={setMantopiccreditboard}
                                        gencreditboard={gencreditboard}
                                        setGencreditboard={setGencreditboard}
                                        gentopiccreditboard={gentopiccreditboard}
                                        setGentopiccreditboard={setGentopiccreditboard}
                                        boardexpiredate={boardexpiredate}
                                        setBoardexpiredate={setBoardexpiredate}
                                        certificateboard={certificateboard}
                                        setCertificatebaord={setCertificatebaord}
                                        lengthcheck={lengthcheck}
                                        setLengthcheck={setLengthcheck}
                                        searchTopicNameboard={searchTopicNameboard}
                                        handleBoardname={handleBoardname}
                                        styles={styles}
                                        takeID={CreditVaultReducer?.boardvaultResponse?.board_data}
                                    />}
                                </View>
                            </View>
                        </ScrollView>
                    </>)}

            </SafeAreaView>}


        </>
    )
}

export default DashoardVault
const stylesd = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colorpath.Pagebg,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        padding: normalize(10),
        flex: 1
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(20),
        zIndex: 2,
    },
    icon: {
        marginBottom: normalize(20),
    },
    internetCard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colorpath.Pagebg,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        padding: normalize(10),
        marginTop: normalize(10),
        flex: 1,
        gap: normalize(5)
    },
    internetText: {
        color: "#000000",
        fontFamily: Fonts.InterSemiBold,
        fontSize: 20,
    },
});