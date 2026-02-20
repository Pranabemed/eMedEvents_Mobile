import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, TextInput, StyleSheet, Alert, Image, BackHandler } from 'react-native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { chooseStatecardRequest, licesensRequest, resendmobileotpRequest, verifymobileRequest } from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../../Utils/Helpers/Loader';
import CellModal from '../../Components/CellModal';
import Modal from 'react-native-modal';
import Imagepath from '../../Themes/Imagepath';
import { processPhoneNumber } from '../../Utils/Helpers/PhoneNormalize';
import { checkIfConfigIsValid } from 'react-native-reanimated/lib/typescript/animation/springUtils';
import { dashMbRequest, mainprofileRequest, stateDashboardRequest, stateReportingRequest } from '../../Redux/Reducers/DashboardReducer';
import { AppContext } from '../GlobalSupport/AppContext';
import { PrimeCheckRequest, walletCheckRequest } from '../../Redux/Reducers/WebcastReducer';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
let status1 = "";
const VerifyMobileOTP = (props) => {
    const {
        setFulldashbaord,
        setGtprof,
        setTakestate,
        setAddit,
        setTotalCred,
        setStateid,
        setRenewal,
        setTakedata,
        fulldashbaord,
        setStateCount,
        stateCount
    } = useContext(AppContext);
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    console.log(AuthReducer?.chooseStatecardResponse?.state_licensures, "state_licensures ===>====>", props?.route?.params, AuthReducer)
    console.log("1st", AuthReducer?.signupResponse?.phone_otp, "2nd", AuthReducer?.resendmobileotpResponse?.phone_otp, "3rd", props?.route?.params)
    const [mobiletrue, setMobiletrue] = useState(false);
    const [countdown, setCountdown] = useState(300);
    const [allotpcheckddd, setAllotpcheckddd] = useState("");
    const [finalCode, setFinalCode] = useState("")
    const [noload, setNoload] = useState(false)
    const isFocus = useIsFocused();
    const [otpmobile, setOtpmobile] = useState(new Array(6).fill(''));
    const inputsmobile = useRef([]);
    useEffect(() => {
        if (AuthReducer?.signupResponse?.token) {
            let objToken = { "token": AuthReducer?.signupResponse?.token, "key": {} }
            connectionrequest()
                .then(() => {
                    dispatch(walletCheckRequest(objToken))
                    dispatch(PrimeCheckRequest(objToken))
                    dispatch(mainprofileRequest(objToken))
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }, [AuthReducer?.signupResponse])
    useEffect(() => {
        const token_error_otp = () => {
            setTimeout(async () => {
                const loginHandleProccess = await AsyncStorage.getItem(constants.TOKEN);
                let objToken = { "token": loginHandleProccess, "key": {} }
                dispatch(walletCheckRequest(objToken))
                dispatch(PrimeCheckRequest(objToken));
                dispatch(mainprofileRequest(objToken));
                console.log(loginHandleProccess, "login===========")
                // loginHandleProccess ? verifyTOkenHandle() : "";
            }, 500);
        };
        try {
            token_error_otp();
        } catch (error) {
            console.log(error);
        }
    }, [isFocus]);
    console.log(DashboardReducer?.mainprofileResponse, "mainprofile---------", props?.route?.params)
    const handleChange = (text, index) => {
        if (text?.length > 1) {
            const pastedText = text.replace(/[^0-9]/g, '');
            const newOtp = [...otpmobile];
            let lastFilledIndex = index;
            for (let i = 0; i < pastedText.length && index + i < 6; i++) {
                newOtp[index + i] = pastedText[i];
                lastFilledIndex = index + i;
            }
            setOtpmobile(newOtp);
            if (lastFilledIndex < 5) {
                inputsmobile.current[lastFilledIndex + 1]?.focus();
            } else {
                inputsmobile.current[lastFilledIndex]?.focus();
            }
            return;
        }

        const updatedOtp = [...otpmobile];
        updatedOtp[index] = text;
        setOtpmobile(updatedOtp);

        if (text && index < 5) {
            inputsmobile.current[index + 1].focus();
        }
    };

    const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === 'Backspace') {
            if (otpmobile[index] === '') {
                if (index > 0) inputsmobile.current[index - 1].focus();
            } else {
                const updatedOtp = [...otpmobile];
                updatedOtp[index] = '';
                setOtpmobile(updatedOtp);
            }
        }
    };
    useEffect(() => {
        const token_handle = () => {
            setTimeout(async () => {
                const loginHandle = await AsyncStorage.getItem(constants.PHONE);
                setAllotpcheckddd(loginHandle)
            }, 100);
        };
        try {
            token_handle();
        } catch (error) {
            console.log(error);
        }
    }, [isFocus]);


    const startTimeRef = useRef(0);
    const initialDurationRef = useRef(0);
    const timerRef = useRef(null);
    useEffect(() => {
        const storedStartTime = AsyncStorage.getItem('otpStartTime');
        const storedDuration = AsyncStorage.getItem('otpInitialDuration');

        if (storedStartTime && storedDuration) {
            const parsedStartTime = parseInt(storedStartTime, 10);
            const parsedDuration = parseInt(storedDuration, 10);
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - parsedStartTime) / 1000);
            const remaining = Math.max(parsedDuration - elapsedSeconds, 0);

            if (remaining > 0) {
                startTimeRef.current = parsedStartTime;
                initialDurationRef.current = parsedDuration;
                setCountdown(remaining);
                startTimer();
            } else {
                AsyncStorage.removeItem('otpStartTime');
                AsyncStorage.removeItem('otpInitialDuration');
            }
        }

        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        startTimer();
        return () => clearInterval(timerRef.current);
    }, []);
    console.log("newphone------", props?.route?.params)


    const startTimer = useCallback(() => {
        clearInterval(timerRef.current);
        if (!startTimeRef.current) {
            startTimeRef.current = Date.now();
            initialDurationRef.current = countdown;
            AsyncStorage.setItem('otpStartTime', startTimeRef.current.toString());
            AsyncStorage.setItem('otpInitialDuration', initialDurationRef.current.toString());
        }

        timerRef.current = setInterval(() => {
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - startTimeRef.current) / 1000);
            const remaining = initialDurationRef.current - elapsedSeconds;

            if (remaining <= 0) {
                clearInterval(timerRef.current);
                setCountdown(0);
                AsyncStorage.removeItem('otpStartTime');
                AsyncStorage.removeItem('otpInitialDuration');
                startTimeRef.current = 0;
            } else {
                setCountdown(remaining);
            }
        }, 1000);
    }, [countdown]);

    const startNewTimer = useCallback((duration) => {
        clearInterval(timerRef.current);
        AsyncStorage.removeItem('otpStartTime');
        AsyncStorage.removeItem('otpInitialDuration');
        startTimeRef.current = 0;
        timerRef.current = null;
        setCountdown(duration);
    }, []);

    useEffect(() => {
        if (countdown > 0 && !timerRef.current) {
            startTimer();
        }
    }, [countdown, startTimer]);

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    const resendMobile = useCallback(() => {
        startNewTimer(300);
    }, [startNewTimer]);
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const verifyHandlevalid = () => {
        let obj = {
            "verify_type": "phone"
        }
        connectionrequest()
            .then(() => {
                dispatch(verifymobileRequest(obj))
            })
            .catch(err => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    const resendMobileOTP = () => {
        let obj = {
            "verify_type": "phone"
        }
        connectionrequest()
            .then(() => {
                dispatch(resendmobileotpRequest(obj));
            })
            .catch(err => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    const clearAllOTPFieldsMobile = () => {
        setOtpmobile(new Array(6).fill(''));
        if (inputsmobile.current[0]) {
            inputsmobile.current[0].focus();
        }
    };
    const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
    const profFromRoute = props?.route?.params?.validPh?.profall ?? null;
    const profFromDashboard =
        DashboardReducer?.mainprofileResponse?.professional_information?.profession != null &&
            DashboardReducer?.mainprofileResponse?.professional_information?.profession_type != null
            ? `${DashboardReducer?.mainprofileResponse?.professional_information?.profession} - ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type}`
            : null;
    const allProfTake = validHandles.has(profFromRoute) || validHandles.has(profFromDashboard);
    console.log(DashboardReducer?.mainprofileResponse, "mainprofile---------", allProfTake)
    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/verifymobileRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/verifymobileSuccess':
                status = AuthReducer.status;
                if (allProfTake) {
                    toggleModal();
                    dispatch(chooseStatecardRequest({}))
                } else {
                    setGtprof(false);
                    setNoload(true);
                    setTimeout(async () => {
                        const loginHandleProccess = await AsyncStorage.getItem(constants.TOKEN);
                        let objToken = { "token": loginHandleProccess || AuthReducer?.loginsiginResponse?.token, "key": {} }
                        dispatch(dashMbRequest(objToken));
                    }, 10);
                }
                break;
            case 'Auth/verifymobileFailure':
                status = AuthReducer.status;
                break;
            case 'Auth/chooseStatecardRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/chooseStatecardSuccess':
                status = AuthReducer.status;
                break;
            case 'Auth/chooseStatecardFailure':
                status = AuthReducer.status;
                break;
            case 'Auth/licesensRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/licesensSuccess':
                status = AuthReducer.status;
                break;
            case 'Auth/licesensFailure':
                status = AuthReducer.status;
                break;
        }
    }
    const filteredStates = useMemo(() => {
        if (!AuthReducer?.licesensResponse?.licensure_states) return [];
        const existingStateIds = new Set(Array.isArray(fulldashbaord) ? fulldashbaord.map(dash => dash.state_id) : []);
        const stateMap = new Map();
        AuthReducer.licesensResponse.licensure_states.forEach(state => {
            if (!stateMap.has(state.id)) {
                stateMap.set(state.id, state);
            }
        });
        return Array.from(stateMap.values())
            .filter(state => !existingStateIds.has(state.id));
    }, [AuthReducer?.licesensResponse, fulldashbaord]);
    useEffect(() => {
        setStateCount(filteredStates);
    }, [filteredStates]);
    console.log(mobiletrue, "mobilelogin-----", otpmobile)
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
                if (!allProfTake) {
                    toggleModal();
                    setNoload(false);
                }
                setFulldashbaord(uniqueStates);
                break;
            case 'Dashboard/dashMbFailure':
                status1 = DashboardReducer.status;
                break;
        }
    }
    useEffect(() => {
        if (DashboardReducer.status === 'Dashboard/dashMbSuccess') {
            const wholeLN = DashboardReducer.dashMbResponse.data?.licensures;
            const finalPush = wholeLN?.length > 0 ? wholeLN.map((l) => l?.license_number) : [];
            const uniqueStates = DashboardReducer?.dashMbResponse?.data?.licensures?.filter((state, index, self) => {
                return index === self.findIndex((s) =>
                    s.state_id === state.state_id &&
                    s.board_id === state.board_id
                );
            });
            setFulldashbaord(uniqueStates);
            if (uniqueStates?.length > 0) {
                const firstState = uniqueStates[0];
                setAddit(firstState);
                setTakedata(firstState);
                setTakestate(firstState.board_id);
                setStateid(firstState.state_id);
                const credits = firstState.credits_data || {};
                const total = (credits.topic_earned_credits || 0) +
                    (credits.total_general_earned_credits || 0);
                setTotalCred(total);
                stateDashboardData(firstState.state_id);
                stateReport(firstState.state_id);
                const profInfo = DashboardReducer?.mainprofileResponse?.professional_information || AuthReducer?.signupResponse?.user || {};
                const profFromDashboard = profInfo.profession && profInfo.profession_type
                    ? `${profInfo.profession} - ${profInfo.profession_type}`
                    : null;
                licHandl(profFromDashboard);
            }
        }
    }, [DashboardReducer.status]);
    const stateDashboardData = (id) => {
        let obj = {
            "state_id": id
        }
        connectionrequest()
            .then(() => {
                dispatch(stateDashboardRequest(obj));
            })
            .catch(err => { showErrorAlert("Please connect to internet", err) })
    }
    const stateReport = (did) => {
        let obj = {
            "state_id": did
        }
        connectionrequest()
            .then(() => {
                dispatch(stateReportingRequest(obj))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    const licHandl = (profFromDashboard) => {
        let obj = profFromDashboard;
        console.log(obj, "obj--------")
        connectionrequest()
            .then(() => {
                dispatch(licesensRequest(obj))
            })
            .catch(err => {
                showErrorAlert('Please connect to Internet', err);
            });
    }
    const renewalLink = useMemo(() => (
        DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link || null
    ), [DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link]);
    useEffect(() => {
        setRenewal(renewalLink);
    }, [renewalLink]);
    console.log("manually otp1222", props?.route?.params, AuthReducer);
    const verifyHandle = () => {
        console.log(props?.route?.params?.Newphone?.Verifycell, "manually otp1222", props?.route?.params);
        const enteredOTP = otpmobile && otpmobile.join('');
        console.log(enteredOTP, typeof enteredOTP, "manually otp");
        let serverOTP;
        if (mobiletrue && AuthReducer?.resendmobileotpResponse?.phone_otp) {
            serverOTP = AuthReducer?.resendmobileotpResponse?.phone_otp;
        } else if (props?.route?.params?.Newphone?.Verifycell) {
            serverOTP = props?.route?.params?.Newphone?.Verifycell;
        } else if (AuthReducer?.resendmobileotpResponse?.phone_otp) {
            serverOTP = AuthReducer?.resendmobileotpResponse?.phone_otp;
        }
        console.log(serverOTP, "frghjktfgk------");
        if (enteredOTP == serverOTP) {
            verifyHandlevalid();
        } else {
            showErrorAlert("Invalid OTP. Please try again.");
        }
    };
    const isEnabledMobile = countdown > 0;
    const phoneDetect = props?.route?.params?.Newphone?.allNo || props?.route?.params?.Newphone?.phoneCode || AuthReducer?.signupResponse?.user?.phone || props?.route?.params?.Newphone?.allNo || props?.route?.params?.validPh?.validPh || props?.route?.params?.Newphone?.phoneCode || props?.route?.params?.Newphone?.phone || allotpcheckddd || AuthReducer?.verifyResponse?.phone || props?.route?.params?.newPh || props?.route?.params?.mobileNo?.mobileNo;
    console.log(phoneDetect, "phonedetect=========", AuthReducer)
    const phoneFinal = phoneDetect?.startsWith('+')
        ? phoneDetect
        : `${props?.route?.params?.validPh?.phonecode || props?.route?.params?.mobileNo?.phoneCode || ''} - ${phoneDetect}`;
    useEffect(() => {
        if (phoneDetect?.startsWith('+')) {
            const finalget = processPhoneNumber(phoneDetect);
            setFinalCode(finalget);
            console.log(finalget, "finalget-------------")
        }
    }, [phoneDetect])
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
    useEffect(() => {
        if (props?.route?.params?.Newphone?.Verifycell) {
            resendMobile();
        }
    }, [props?.route?.params?.Newphone?.Verifycell])
    const isPrimeTrial = useMemo(() => {
        return !!WebcastReducer?.PrimeCheckResponse?.subscription;
    }, [WebcastReducer?.PrimeCheckResponse?.subscription]);

    const hasWalletBalance = useMemo(() => {
        const raw = WebcastReducer?.walletCheckResponse?.balance;
        const numeric = Number(String(raw || '0').replace(/,/g, ''));
        return numeric > 0;
    }, [WebcastReducer?.walletCheckResponse?.balance]);
    const profMerge = useMemo(() => {
        // If prime trial active OR wallet balance > 0
        if (isPrimeTrial || hasWalletBalance) {
            return "freetrail";
        }

        return allProfTake ? "nochange" : "duplicate";
    }, [isPrimeTrial, hasWalletBalance, allProfTake]);
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                    <Loader
                        visible={AuthReducer?.status == 'Auth/verifymobileRequest' || noload || AuthReducer?.status == 'Auth/resendmobileotpRequest'} />
                    {/* <View style={Platform.OS === 'ios' ? { top: normalize(10), justifyContent: "center", alignItems: "center" } : { top: normalize(40), marginRight: normalize(10), justifyContent: "center", alignContent: "center" }}>
                        <Image
                            source={Imagepath.eMedfulllogo}
                            style={{ alignSelf: "center", height: normalize(40), width: normalize(212), resizeMode: "contain" }}
                        />
                    </View> */}
                    <View style={styles.headerContainer}>
                        <Text style={[styles.headerText]}>{"Verify Cell Number"}</Text>

                        <View style={{ flexDirection: "column", marginTop: normalize(15) }}>
                            <View>
                                <Text style={styles.subHeaderText}>
                                    {"A 6-digit code has been sent to"}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", gap: 5, justifyContent: "center" }}>
                                <View>
                                    <Text style={[styles.subHeaderText, { fontWeight: "bold" }]}>
                                        {phoneFinal}
                                    </Text>
                                </View>
                                <TouchableOpacity disabled={countdown == 0 ? false : true} onPress={() => {
                                    props.navigation.navigate("ChangeMobileNo", { Newphone: { Newphone: phoneDetect || props?.route?.params?.validPh || finalCode?.nationalNumber || props?.route?.params?.newPh || props?.route?.params?.mobileNo?.mobileNo, phonoCd: finalCode, PhoneCdO: props?.route?.params?.validPh?.phonecode || props?.route?.params?.mobileNo?.phoneCode || props?.route?.params?.Newphone?.phoneCode } });
                                    clearAllOTPFieldsMobile();
                                    startNewTimer(0);
                                }} >
                                    <Text style={[styles.subHeaderText, { textDecorationLine: "underline", color: countdown == 0 ? Colorpath.ButtonColr : "#DADADA" }]}>
                                        {"Change"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                    <View style={{ flexDirection: "column", flex: 0.3 }}>
                        <View style={styles.inputContainer}>
                            {otpmobile && otpmobile.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    placeholder="0"
                                    placeholderTextColor={Colorpath.locText}
                                    ref={(ref) => (inputsmobile.current[index] = ref)}
                                    value={digit}
                                    onChangeText={(text) => {
                                        const filteredText = text.replace(/[^0-9]/g, '');
                                        handleChange(filteredText, index);
                                    }}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={6} // Allow paste
                                    style={styles.input}
                                    autoFocus={index === 0}
                                    textAlign="center"
                                    textContentType="oneTimeCode"
                                    autoComplete="sms-otp"
                                />
                            ))}
                        </View>
                        <View style={{ flexDirection: "row", marginLeft: normalize(17), gap: 5, marginTop: normalize(10) }}>
                            <View>
                                {!countdown ? <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "#FF5E62" }}>
                                    {"Verification code expired!"}
                                </Text> :
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "#FF5E62" }}>
                                        {`The code will be expired in ${countdown} seconds`}
                                    </Text>}
                            </View>

                        </View>
                        <View style={{ flexDirection: "row", marginLeft: normalize(17), gap: 5, marginTop: normalize(10) }}>
                            <View>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#666666" }}>
                                    {" Didn’t receive the code?"}
                                </Text>
                            </View>
                            <TouchableOpacity disabled={countdown == 0 ? false : true} onPress={() => {
                                resendMobileOTP();
                                resendMobile();
                                // setCountdown(300);
                                setMobiletrue(true);
                                clearAllOTPFieldsMobile();
                            }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: countdown == 0 ? Colorpath.ButtonColr : "#DADADA" }}>
                                    {"Resend"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Buttons
                                onPress={verifyHandle}
                                height={normalize(45)}
                                width={normalize(288)}
                                backgroundColor={isEnabledMobile ? Colorpath.ButtonColr : "#CCC"}
                                borderRadius={normalize(9)}
                                text="Verify"
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(30)}
                                disabled={!isEnabledMobile}
                            />
                            <CellModal
                                isVisible={isModalVisible}
                                onClose={toggleModal}
                                content={"Your cell number has been \n successfully verified"}
                                navigation={props.navigation}
                                name={AuthReducer?.chooseStatecardResponse?.state_licensures?.length > 0 ? "ChooseState" : "CreateStateInfor"}
                                profMerge={profMerge}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 0.35,
        marginHorizontal: normalize(20)
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 30,
        color: "#000000",
        marginTop: normalize(10),
        justifyContent: 'center',
        textAlign: "center"
    },
    subHeaderText: {
        // marginTop: normalize(10),
        color: "#666666",
        fontSize: 18,
        fontFamily: Fonts.InterRegular,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: normalize(15),
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "center",
        gap: normalize(8)
    },
    forgotContainer: {
        marginTop: normalize(10),
        alignSelf: 'center', // Align it with the input fields
        width: normalize(280), // Ensure it matches the width of the Textfield
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    forgotText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        color: Colorpath.ButtonColr,
    },
    input: {
        width: 45,
        height: 45,
        borderBottomWidth: 2,
        borderColor: '#ccc',
        fontSize: 20,
        color: "#000000",
        fontFamily: Fonts.InterMedium,
    }
});

export default VerifyMobileOTP;
