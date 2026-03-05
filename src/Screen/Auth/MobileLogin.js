import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, TextInput, StyleSheet, Image, BackHandler } from 'react-native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import CustomModal from '../../Components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { againloginsiginRequest, chooseStatecardRequest } from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import { CommonActions } from '@react-navigation/native';
import Imagepath from '../../Themes/Imagepath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { processPhoneNumberUSA } from '../../Utils/Helpers/UsaPhone';
import { dashboardRequest, mainprofileRequest } from '../../Redux/Reducers/DashboardReducer';
import { AppContext } from '../GlobalSupport/AppContext';
let status1 = "";
let status = "";
import { SafeAreaView } from 'react-native-safe-area-context'
const MobileLoginOTP = (props) => {
    const {
        setFulldashbaord,
        setGtprof
    } = useContext(AppContext);
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    console.log(AuthReducer?.loginsiginResponse?.phone_otp, "props?.route?.params?.verifyemail?.phone", props?.route?.params)
    const [resendtrue, setResendtrue] = useState(false);
    const [countdown, setCountdown] = useState(300);
    const startTimeRef = useRef(0);
    const initialDurationRef = useRef(0);
    const timerRef = useRef(null);
    const [nonloadermb, setNonloadermb] = useState(false);
    const [otpphone, setOtpphone] = useState(new Array(6).fill(''));
    const inputsphone = useRef([]);
    const [nonloader, setNonloader] = useState(false);
    useEffect(() => {
        let mounted = true;
        const restoreTimerState = async () => {
            try {
                const [storedStartTime, storedDuration] = await Promise.all([
                    AsyncStorage.getItem('otpStartTime'),
                    AsyncStorage.getItem('otpInitialDuration')
                ]);
                if (!mounted || !storedStartTime || !storedDuration) return;
                const parsedStartTime = parseInt(storedStartTime, 10);
                const parsedDuration = parseInt(storedDuration, 10);
                if (Number.isNaN(parsedStartTime) || Number.isNaN(parsedDuration)) {
                    await AsyncStorage.removeItem('otpStartTime');
                    await AsyncStorage.removeItem('otpInitialDuration');
                    return;
                }
                const currentTime = Date.now();
                const elapsedSeconds = Math.floor((currentTime - parsedStartTime) / 1000);
                const remaining = Math.max(parsedDuration - elapsedSeconds, 0);
                if (remaining > 0) {
                    startTimeRef.current = parsedStartTime;
                    initialDurationRef.current = parsedDuration;
                    setCountdown(remaining);
                    startTimer();
                } else {
                    await AsyncStorage.removeItem('otpStartTime');
                    await AsyncStorage.removeItem('otpInitialDuration');
                }
            } catch (error) {
                console.log('Failed to restore OTP timer:', error);
            }
        };
        restoreTimerState();
        return () => clearInterval(timerRef.current);
    }, []);
    const VeirfyUserByMobile = (otpdata) => {
        let finalFormattedPhone = "";
        if (props?.route?.params?.mobileNo?.phoneCode == "+1" && props?.route?.params?.mobileNo?.mobileNo) {
            const finalCont = processPhoneNumberUSA(props?.route?.params?.mobileNo?.mobileNo);
            finalFormattedPhone = finalCont?.formattedNumber || "";
        }
        let obj = finalFormattedPhone ? {
            "phone": finalFormattedPhone,
            "phone_otp": otpdata
        } : {
            "phone": `${props?.route?.params?.mobileNo?.phoneCode}${props?.route?.params?.mobileNo?.mobileNo}`,
            "phone_otp": otpdata
        }
        connectionrequest()
            .then(() => {
                dispatch(againloginsiginRequest(obj));
            })
            .catch((err) => { showErrorAlert("Please connect to internet", err) })
    }

    useEffect(() => {
        startTimer();
        return () => clearInterval(timerRef.current);
    }, []);

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

    const resendOTP = useCallback(() => {
        startNewTimer(300);
    }, [startNewTimer]);
    const isEnabledMobile = countdown > 0;
    console.log(props?.route?.params, "enteredOTP === allotpcheck", isEnabledMobile, AuthReducer?.againloginsiginResponse?.phone_otp);
    const verifyHandle = () => {
        const enteredOTP = otpphone && otpphone.join('');
        if (!enteredOTP || enteredOTP.length !== 6) {
            showErrorAlert("Please enter a valid 6-digit OTP.");
            return;
        }
        setNonloader(true);
        // Do not compare OTP on client side; production APIs may not return phone_otp.
        // Backend verification decides validity and returns next auth state.
        VeirfyUserByMobile(enteredOTP);
    };
    console.log(props?.route?.params, "fdsgjkdfhkh----------")
    const resendMobileOTP = () => {
        let finalFormattedPhone = "";
        if (props?.route?.params?.mobileNo?.phoneCode == "+1" && props?.route?.params?.mobileNo?.mobileNo) {
            const finalCont = processPhoneNumberUSA(props?.route?.params?.mobileNo?.mobileNo);
            finalFormattedPhone = finalCont?.formattedNumber || "";
        }
        let obj = finalFormattedPhone ?
            {
                "phone": finalFormattedPhone
            } : {
                "phone": `${props?.route?.params?.mobileNo?.phoneCode}${props?.route?.params?.mobileNo?.mobileNo}`
            }
        connectionrequest()
            .then(() => {
                dispatch(againloginsiginRequest(obj));
            })
            .catch(err => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    if (status1 == '' || AuthReducer.status != status1) {
        switch (AuthReducer.status) {
            case 'Auth/againloginsiginRequest':
                status1 = AuthReducer.status;
                break;
            case 'Auth/againloginsiginSuccess':
                status1 = AuthReducer.status;
                // if (AuthReducer?.againloginsiginResponse?.user?.usa_user == true) {
                //     const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
                //     const profFromDashboard =
                //         AuthReducer?.againloginsiginResponse?.user?.profession != null &&
                //             AuthReducer?.againloginsiginResponse?.user?.profession_type != null
                //             ? `${AuthReducer?.againloginsiginResponse?.user?.profession} - ${AuthReducer?.againloginsiginResponse?.user?.profession_type}`
                //             : null;
                //     const allProfTake = validHandles.has(profFromDashboard);
                //     if (allProfTake) {
                //         let objToken = { "token": AuthReducer?.againloginsiginResponse?.token, "key": {} }
                //         dispatch(dashboardRequest(objToken));
                //         setNonloadermb(true);
                //         setGtprof(true);
                //     } else {
                //         let objToken = { "token": AuthReducer?.againloginsiginResponse?.token, "key": {} }
                //         dispatch(dashboardRequest(objToken));
                //         setNonloadermb(true);
                //         setGtprof(false);
                //     }
                //     // props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }));;
                // } else {
                //     showErrorAlert("Your cell number is not registered with us. Please use your email and password to log in if you already have an account.")
                // }
                break;
            case 'Auth/againloginsiginFailure':
                status1 = AuthReducer.status;
                setNonloader(false);
                break;
        }
    }

    const validHandles = useMemo(() => new Set([
        "Physician - MD",
        "Physician - DO",
        "Physician - DPM"
    ]), []);
    const normalizeFlag = (value) => {
        if (value === true || value === 1 || value === "1" || value === "true") return true;
        if (value === false || value === 0 || value === "0" || value === "false") return false;
        return null;
    };

    const loginResponse = AuthReducer?.againloginsiginResponse || {};
    const user = loginResponse?.user || {};
    const chooseStatecardResponse = AuthReducer?.chooseStatecardResponse || {};

    // Memoized derived values
    const profFromDashboard = useMemo(() => (
        user?.profession && user?.profession_type
            ? `${user.profession} - ${user.profession_type}`
            : null
    ), [user.profession, user.profession_type]);

    const allProfTake = useMemo(() => (
        validHandles.has(profFromDashboard)
    ), [validHandles, profFromDashboard]);

    const token = useMemo(() => loginResponse?.token, [loginResponse]);
    const tokenObj = useMemo(() => ({ token, key: {} }), [token]);
    const prevToken = useRef(null);

    // Track if we have valid state license data
    const hasStateLicenseData = useRef(false);
    const stateLicenseCheckComplete = useRef(false);

    // Dispatch license request on token change
    useEffect(() => {
        if (token && token !== prevToken.current) {
            // Reset flags when token changes
            hasStateLicenseData.current = false;
            stateLicenseCheckComplete.current = false;
            dispatch(chooseStatecardRequest(tokenObj));
            prevToken.current = token;
        }
    }, [token, tokenObj, dispatch]);

    // Monitor when state license response is valid
    useEffect(() => {
        if (chooseStatecardResponse?.state_licensures !== undefined) {
            hasStateLicenseData.current = true;
        }
    }, [chooseStatecardResponse]);

    // Main navigation logic
    useEffect(() => {
        const emailVerifiedFlag = normalizeFlag(loginResponse?.is_verified);
        const phoneVerifiedFlag = normalizeFlag(loginResponse?.phone_verified);
        const isEmailNotVerified = emailVerifiedFlag === false;
        const isPhoneNotVerified = phoneVerifiedFlag === false;
        const isEmailVerified = emailVerifiedFlag === true;
        const isSuccess = normalizeFlag(loginResponse?.success) === true || loginResponse?.success === true;
        const hasLicense = !!user.license_number;

        // Get state licenses only if we have valid data
        const stateLicenses = hasStateLicenseData.current
            ? chooseStatecardResponse?.state_licensures || []
            : [];

        const hasStateLicensures = stateLicenses.length > 0;

        // Track navigation state to prevent duplicate calls
        let navigationHandled = false;

        const handleNavigation = (destination, params = {}) => {
            if (!navigationHandled) {
                props?.navigation.navigate(destination, params);
                navigationHandled = true;
                stateLicenseCheckComplete.current = true;
            }
        };
        if (isEmailNotVerified && isPhoneNotVerified) {
            setNonloader(false);
            handleNavigation("VerifyOTP");
            return;
        }

        if (isEmailVerified && isPhoneNotVerified) {
            setNonloader(false);
            handleNavigation("VerifyMobileOTP", { validPh: { phonecode: props?.route?.params?.mobileNo?.phoneCode } });
            return;
        }
        if (!token) {
            // OTP verify responses without token should not force dashboard flow.
            // Keep user on current screen unless verification routes above are applicable.
            return;
        }

        if (allProfTake && !hasLicense && !hasStateLicenseData.current) {
            return;
        }
        if (allProfTake) {
            if (hasLicense) {
                setNonloader(true);
                dispatch(dashboardRequest(tokenObj));
                setGtprof(true);
            }
            else if (hasStateLicensures) {
                setNonloader(true);
                handleNavigation("ChooseState", {
                    dataVr: { dataVr: stateLicenses, Loc: loginResponse?.user?.user_location }
                });
            }
            else {
                setNonloader(true);
                handleNavigation("CreateStateInfor", { dataVerify: { dataVerify: "Nodasta", allDat: loginResponse?.user } });
            }
        }
        else if (isSuccess) {
            setNonloader(true);
            dispatch(dashboardRequest(tokenObj));
            setGtprof(false);
        }
        else {
            setNonloader(false);
            showErrorAlert(loginResponse.msg || "Something went wrong!");
        }
    }, [
        token,
        allProfTake,
        loginResponse,
        user?.license_number,
        chooseStatecardResponse, // Now watching the entire response object
        tokenObj
    ]);
    useEffect(() => {
        if (DashboardReducer?.status === 'Dashboard/dashboardSuccess') {
            const dashboardData = DashboardReducer?.dashboardResponse?.data;
            const uniqueStates = dashboardData?.licensures?.filter((state, index, self) =>
                index === self.findIndex((s) => s.state_id === state.state_id && s.board_id === state.board_id)
            );
            dispatch(mainprofileRequest({}));
            setFulldashbaord(uniqueStates || []);
            props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }));
        }
    }, [DashboardReducer?.status, DashboardReducer?.dashboardResponse?.data, dispatch, props.navigation, setFulldashbaord]);
    useEffect(() => {
        if (DashboardReducer?.dashboardResponse?.data) {
            setNonloadermb(false);
        }
    }, [DashboardReducer?.dashboardResponse])


    const handleChange = (text, index) => {
        if (text?.length > 1) {
            setOtpphone(prevOtp => {
                const newOtp = [...prevOtp];
                const pastedText = text.replace(/[^0-9]/g, '');
                const startIndex = pastedText.length === 6 ? 0 : index;
                let lastFilledIndex = startIndex;
                for (let i = 0; i < pastedText.length && startIndex + i < 6; i++) {
                    newOtp[startIndex + i] = pastedText[i];
                    lastFilledIndex = startIndex + i;
                }
                setTimeout(() => {
                    const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
                    inputsphone.current[focusIndex]?.focus();
                }, 10);
                return newOtp;
            });
            return;
        }

        setOtpphone(prevOtp => {
            const updatedOtp = [...prevOtp];
            updatedOtp[index] = text;
            return updatedOtp;
        });

        if (text && index < 5) {
            inputsphone.current[index + 1]?.focus();
        }
    };
    const clearAllOTPFieldsPhone = () => {
        setOtpphone(new Array(6).fill(''));
        if (inputsphone.current[0]) {
            inputsphone.current[0].focus();
        }
    };
    const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === 'Backspace') {
            if (otpphone[index] === '') {
                if (index > 0) inputsphone.current[index - 1].focus();
            } else {
                const updatedOtp = [...otpphone];
                updatedOtp[index] = '';
                setOtpphone(updatedOtp);
            }
        }
    };
    const loginBaack = () => {
        props.navigation.goBack();
    }
    useEffect(() => {
        const onBackPress = () => {
            loginBaack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
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
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                    <Loader
                        visible={AuthReducer?.status == 'Auth/againloginsiginRequest' || nonloadermb || nonloader} />
                    {/* <View style={Platform.OS === 'ios' ? { top: normalize(10), justifyContent: "center", alignItems: "center" } : { top: normalize(40), marginRight: normalize(10), justifyContent: "center", alignContent: "center" }}>
                        <Image
                            source={Imagepath.eMedfulllogo}
                            style={{ alignSelf: "center", height: normalize(40), width: normalize(212), resizeMode: "contain" }}
                        />
                    </View> */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{"Verify Cell Number"}</Text>
                        <View style={{ flexDirection: "column", marginTop: normalize(15) }}>
                            <View>
                                <Text style={styles.subHeaderText}>
                                    {"A 6-digit code has been sent to"}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", gap: 5 }}>
                                <View>
                                    <Text style={[styles.subHeaderText, { fontWeight: "bold" }]}>
                                        {`${props?.route?.params?.mobileNo?.phoneCode} - ${props?.route?.params?.mobileNo?.mobileNo ? props?.route?.params?.mobileNo?.mobileNo : props?.route?.params?.mobileNo?.mobileNo}`}
                                    </Text>
                                </View>
                                <TouchableOpacity disabled={countdown == 0 ? false : true} onPress={() => {
                                    props.navigation.navigate("Login");
                                    setCountdown(0);
                                    clearAllOTPFieldsPhone();
                                }}>
                                    <Text style={[styles.subHeaderText, { textDecorationLine: "underline", color: countdown == 0 ? Colorpath.ButtonColr : "#DADADA" }]}>
                                        {"Change"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                    <View style={{ flexDirection: "column", flex: 0.3 }}>
                        <View style={styles.inputContainer}>
                            {otpphone && otpphone.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    placeholder="0"
                                    placeholderTextColor={Colorpath.locText}
                                    ref={(ref) => (inputsphone.current[index] = ref)}
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
                                    {"Didn’t receive the code?"}
                                </Text>
                            </View>
                            <TouchableOpacity disabled={countdown == 0 ? false : true} onPress={() => {
                                resendMobileOTP();
                                resendOTP();
                                setResendtrue(true);
                                clearAllOTPFieldsPhone();
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
                            {/* <CustomModal
                                isVisible={isModalVisible}
                                onClose={toggleModal}
                                content={"Your email has been \n successfully verified."}
                                navigation={props.navigation}
                            /> */}
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
        flex: 0.35
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 22,
        color: "#000000",
        marginTop: normalize(20)
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

export default MobileLoginOTP;
