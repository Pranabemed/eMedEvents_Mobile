import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, TextInput, StyleSheet, Image, Alert, BackHandler } from 'react-native';
import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import CustomModal from '../../Components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { resendemailotpRequest, verifyemailRequest } from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../../Utils/Helpers/Loader';
import Imagepath from '../../Themes/Imagepath';
import { mainprofileRequest } from '../../Redux/Reducers/DashboardReducer';
let status = "";
import { SafeAreaView } from 'react-native-safe-area-context'
const LoginEmail = (props) => {
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    console.log(props?.route?.params, AuthReducer?.signupResponse?.email_otp, "AuthReducer======", AuthReducer?.resendemailotpResponse?.email_otp, props?.route?.params?.verifyemail?.verifyemail, "props?.route?.params?.verifyemail?.phone")
    const isFocus = useIsFocused();
    const [allotpcheck, setAllotpcheck] = useState();
    const [resendtrue, setResendtrue] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const inputs = useRef([]);
    const [loginemail, setLoginemail] = useState("");
    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(mainprofileRequest({}))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }, [])
    const handleChange = (text, index) => {
        if (text.length > 1) {
            const pastedText = text.replace(/[^0-9]/g, '');
            const newOtp = [...otp];
            let lastFilledIndex = index;
            for (let i = 0; i < pastedText.length && index + i < 6; i++) {
                newOtp[index + i] = pastedText[i];
                lastFilledIndex = index + i;
            }
            setOtp(newOtp);
            if (lastFilledIndex < 5) {
                inputs.current[lastFilledIndex + 1]?.focus();
            } else {
                inputs.current[lastFilledIndex]?.focus();
            }
            return;
        }

        const updatedOtp = [...otp];
        updatedOtp[index] = text;
        setOtp(updatedOtp);

        if (text && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === 'Backspace') {
            if (otp[index] === '') {
                if (index > 0) inputs.current[index - 1].focus();
            } else {
                const updatedOtp = [...otp];
                updatedOtp[index] = '';
                setOtp(updatedOtp);
            }
        }
    };
    console.log(otp, "otp--------------", props?.route?.params)
    useEffect(() => {
        const token_handle = () => {
            setTimeout(async () => {
                const loginHandle = await AsyncStorage.getItem(constants.EMAIL);
                setAllotpcheck(loginHandle)
            }, 100);
        };
        try {
            token_handle();
        } catch (error) {
            console.log(error);
        }
    }, [isFocus]);
    console.log(allotpcheck, "statelicesene=================", otp)
    const [countdown, setCountdown] = useState(300);
    const timerRef = useRef(null);
    const startTimeRef = useRef(0);
    const initialDurationRef = useRef(0);

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
        startTimeRef.current = Date.now();
        initialDurationRef.current = duration;
        setCountdown(duration);

        // Save to AsyncStorage
        AsyncStorage.setItem('otpStartTime', startTimeRef.current.toString());
        AsyncStorage.setItem('otpInitialDuration', initialDurationRef.current.toString());

        // Start the timer
        startTimer();
    }, []);
    useEffect(() => {
        if (countdown > 0 && !timerRef.current) {
            startTimer();
        }
    }, [countdown, startTimer]);

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);
    useEffect(() => {
        resendOTP();
    }, [props?.route?.params?.NewEmail?.verifyotp])
    const resendOTP = useCallback(() => {
        startNewTimer(300);
    }, [startNewTimer]);

    console.log("enteredOTP === allotpcheck", AuthReducer?.resendemailotpResponse?.email_otp);
    const verifyHandle = () => {
        const enteredOTP = otp && otp.join('');
        console.log(enteredOTP, typeof enteredOTP, "manually otp");
        let serverOTP;
        if (resendtrue && AuthReducer?.resendemailotpResponse?.email_otp) {
            serverOTP = AuthReducer?.resendemailotpResponse?.email_otp;
        } else if (props?.route?.params?.NewEmail?.verifyotp) {
            serverOTP = props.route.params.NewEmail.verifyotp;
        } else {
            serverOTP = AuthReducer?.resendemailotpResponse?.email_otp;
        }
        console.log(serverOTP, "serverOTP", enteredOTP);
        if (enteredOTP == serverOTP) {
            verifyHandlevalid();
        } else {
            // setCountdown(0);
            setResendtrue(false);
            showErrorAlert("Invalid OTP. Please try again.");
        }
    };
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const verifyHandlevalid = () => {
        let obj = {
            "verify_type": "email"
        }
        connectionrequest()
            .then(() => {
                dispatch(verifyemailRequest(obj))
            })
            .catch(err => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    const resendEmailOTPA = () => {
        let obj = { "verify_type": "email" };
        connectionrequest()
            .then(() => {
                dispatch(resendemailotpRequest(obj));
            })
            .catch(err => {
                showErrorAlert("Please connect to internet", err);
            })
    };
    const resendEmailOTP = () => {
        let obj = {
            "verify_type": "email"
        }
        connectionrequest()
            .then(() => {
                dispatch(resendemailotpRequest(obj));
            })
            .catch(err => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    useEffect(() => {
        if (props?.route?.params?.user?.emailid && !AuthReducer?.resendemailotpResponse?.email_otp) {
            setTimeout(() => {
                setLoginemail("didtext");
            }, 2000);
        }
    }, [props?.route?.params?.user?.emailid, AuthReducer?.resendemailotpResponse?.email_otp]);
    useEffect(() => {
        if (loginemail == "didtext") {
            Alert.alert("eMedEvents", "Successfully fetched your existing data !", [{
                text: "Continue", onPress: () => {
                    setLoginemail("");
                    resendEmailOTPA();
                    setResendtrue(true);
                    resendOTP();
                }
            }])
        }
    }, [loginemail])
    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/verifyemailRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/verifyemailSuccess':
                status = AuthReducer.status;
                toggleModal();
                // props.navigation.navigate("VerifyMobileOTP");
                break;
            case 'Auth/verifyemailFailure':
                status = AuthReducer.status;
                break;
        }
    }
    const isEnabled = countdown > 0;
    const email = props?.route?.params?.NewEmail?.email || props?.route?.params?.NewEmail || props?.route?.params?.user?.emailid || props?.route?.params?.mobileNo || props?.route?.params?.user?.emailid || AuthReducer?.verifyResponse?.email || allotpcheck;
    const phoneTake = props?.route?.params?.user?.phoneData || props?.route?.params?.mobileNo?.phone || props?.route?.params?.verifyemail?.verifyemail?.phone || props?.route?.params?.NewEmail?.phoneNo || props?.route?.params?.NewEmail?.phone || props?.route?.params?.NewEmail?.returnDat?.phone || props?.route?.params?.NewEmail?.returnDat?.phoneNo;
    const countryCode = props?.route?.params?.verifyemail?.verifyemail?.countryCode || props?.route?.params?.NewEmail?.returnDat?.countryCode
    console.log(phoneTake, "phoneTake")
    const clearAllOTPFields = () => {
        setOtp(new Array(6).fill(''));
        if (inputs.current[0]) {
            inputs.current[0].focus();
        }
    };
    const finalPush = props?.route?.params?.verifyemail?.profession ||
        (DashboardReducer?.mainprofileResponse?.professional_information?.profession &&
            DashboardReducer?.mainprofileResponse?.professional_information?.profession_type
            ? `${DashboardReducer.mainprofileResponse.professional_information.profession} - ${DashboardReducer.mainprofileResponse.professional_information.profession_type}`
            : null);
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
    const high = props?.route?.params?.NewEmail?.email ? props?.route?.params?.NewEmail?.email : props?.route?.params?.NewEmail ? props?.route?.params?.NewEmail : props?.route?.params?.user?.emailid;
    console.log(high, "hight==========");
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
                        visible={AuthReducer?.status == 'Auth/verifyemailRequest' || AuthReducer?.status == 'Auth/resendemailotpRequest'} />

                    {/* <View style={Platform.OS === 'ios' ? { top: normalize(10), justifyContent: "center", alignItems: "center" } : { top: normalize(40), marginRight: normalize(10), justifyContent: "center", alignContent: "center" }}>
                        <Image
                            source={Imagepath.eMedfulllogo}
                            style={{ alignSelf: "center", height: normalize(40), width: normalize(212), resizeMode: "contain" }}
                        />
                    </View> */}

                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{"Verify Your Email"}</Text>
                        <View style={{ flexDirection: "column", marginTop: normalize(15) }}>
                            <View>
                                <Text style={styles.subHeaderText}>
                                    {"An 6-digit code has been sent to"}
                                </Text>
                            </View>

                            {email?.length < 15 ? <View style={{ flexDirection: "row", gap: 5 }}>
                                <View>
                                    <Text style={[styles.subHeaderText, { fontWeight: "bold", width: normalize(170) }]}>
                                        {email}
                                    </Text>
                                </View>
                                <TouchableOpacity disabled={countdown == 0 ? false : true} onPress={() => {
                                    props.navigation.navigate("LoginChangeMail", {
                                        wholeData: high,
                                    });
                                    startNewTimer(0);
                                    clearAllOTPFields();
                                    // AsyncStorage.removeItem(constants.EMAILOTP);
                                }}>
                                    <Text style={[styles.subHeaderText, { textDecorationLine: "underline", color: countdown == 0 ? Colorpath.ButtonColr : "#DADADA" }]}>
                                        {"Change"}
                                    </Text>
                                </TouchableOpacity>
                            </View> : <View style={{ gap: 5 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text
                                        style={[
                                            styles.subHeaderText,
                                            { fontWeight: "bold", width: normalize(320) }
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {email}
                                    </Text>
                                </View>
                                <TouchableOpacity disabled={countdown == 0 ? false : true}
                                    style={{ alignSelf: "center" }}
                                    onPress={() => {
                                        props.navigation.navigate("LoginChangeMail", {
                                            wholeData: high,
                                        });
                                        startNewTimer(0);
                                        clearAllOTPFields();
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.subHeaderText,
                                            {
                                                textDecorationLine: "underline",
                                                color: countdown == 0 ? Colorpath.ButtonColr : "#DADADA",
                                            },
                                        ]}
                                    >
                                        Change
                                    </Text>
                                </TouchableOpacity>
                            </View>}
                        </View>

                    </View>
                    <View style={{ flexDirection: "column", flex: 0.3 }}>
                        <View style={styles.inputContainer}>
                            {otp && otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    placeholder="0"
                                    placeholderTextColor={Colorpath.locText}
                                    ref={(ref) => (inputs.current[index] = ref)}
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
                                />
                            ))}
                        </View>
                        <View style={{ flexDirection: "row", marginLeft: normalize(17), gap: 5, marginTop: normalize(10) }}>
                            <View>
                                {countdown === 0 ? <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "#FF5E62" }}>
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
                                resendEmailOTP();
                                resendOTP()
                                setResendtrue(true);
                                clearAllOTPFields();
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
                                backgroundColor={isEnabled ? Colorpath.ButtonColr : "#CCC"}
                                borderRadius={normalize(9)}
                                text="Verify"
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(30)}
                                disabled={!isEnabled}
                            />
                            <CustomModal
                                isVisible={isModalVisible}
                                onClose={toggleModal}
                                content={"Your email has been \n successfully verified."}
                                navigation={props.navigation}
                                phoneno={phoneTake}
                                countrycode={countryCode}
                                norq={props?.route?.params?.user?.phoneData ? "call" : ""}
                                profession={finalPush}
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
        flex: 0.4
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 32,
        color: "#000000",
        marginTop: normalize(10)
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

export default LoginEmail;
