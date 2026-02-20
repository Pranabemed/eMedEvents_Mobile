import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, TextInput, StyleSheet, Image, BackHandler } from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { forgotRequest } from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import Imagepath from '../../Themes/Imagepath';
import Header from '../../Components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context'
const EnterOTP = (props) => {
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const [otpforgot, setotpforgot] = useState(new Array(6).fill(''));
    const inputsphone = useRef([]);
    const [countdown, setCountdown] = useState(300);
    const isEnabledMobile = countdown > 0;
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
    const handleChange = (text, index) => {
        if (text?.length > 1) {
            const pastedText = text.replace(/[^0-9]/g, '');
            const newOtp = [...otpforgot];
            let lastFilledIndex = index;
            for (let i = 0; i < pastedText.length && index + i < 6; i++) {
                newOtp[index + i] = pastedText[i];
                lastFilledIndex = index + i;
            }
            setotpforgot(newOtp);
            if (lastFilledIndex < 5) {
                inputsphone.current[lastFilledIndex + 1]?.focus();
            } else {
                inputsphone.current[lastFilledIndex]?.focus();
            }
            return;
        }
        const updatedOtp = [...otpforgot];
        updatedOtp[index] = text;
        setotpforgot(updatedOtp);

        if (text && index < 5) {
            inputsphone.current[index + 1].focus();
        }
    };
    const clearAllOTPFieldsPhone = () => {
        setotpforgot(new Array(6).fill(''));
        if (inputsphone.current[0]) {
            inputsphone.current[0].focus();
        }
    };
    const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === 'Backspace') {
            if (otpforgot[index] === '') {
                if (index > 0) inputsphone.current[index - 1].focus();
            } else {
                const updatedOtp = [...otpforgot];
                updatedOtp[index] = '';
                setotpforgot(updatedOtp);
            }
        }
    };
    console.log(props?.route?.params?.forgotPh, "props?.route?.params?.forgotPh------")
    const verifyHandleForgot = () => {
        const enteredOTPForgot = otpforgot && otpforgot.join('');
        console.log(enteredOTPForgot, typeof enteredOTPForgot, "manually otp");
        const forgotOTP = AuthReducer?.forgotResponse?.phone_otp
        console.log(forgotOTP, "forgotOTP=========");
        if (enteredOTPForgot == forgotOTP) {
            props.navigation.navigate('ResetMPIN');
        } else {
            showErrorAlert("Invalid OTP. Please try again.");
        }
    };
    const resendOTPNeed = () => {
        let obj = props?.route?.params?.forgotPh?.phoneCode == "email" ? {"email":props?.route?.params?.forgotPh?.forgotPh}:{
            "phone": props?.route?.params?.forgotPh?.forgotPh ? `${props?.route?.params?.forgotPh?.phoneCode}${props?.route?.params?.forgotPh?.forgotPh}` : ''
        }
        connectionrequest()
            .then(() => {
                dispatch(forgotRequest(obj));
            })
            .catch(err => {
                showErrorAlert("Please connect to internet", err)
            })
    };
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
                        visible={AuthReducer?.status == 'Auth/forgotRequest'} />
                    <View style={{marginTop:normalize(80)}}>
                        {/* <Header
                            onPress={() => props.navigation.goBack()}
                            tintColor={Colorpath.black}
                        /> */}
                        {/* <View style={{ top: normalize(18), marginRight: normalize(10), justifyContent: "center", alignContent: "center" }}>
                            <Image
                                source={Imagepath.eMedfulllogo}
                                style={{ alignSelf: "center", height: normalize(40), width: normalize(212), resizeMode: "contain" }}
                            />
                        </View> */}

                        <View style={{ width: normalize(40) }} />
                    </View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{"Enter OTP"}</Text>
                        <View style={{ flexDirection: "column", marginTop: normalize(5) }}>
                            <View style={{ flexDirection: "column" }}>
                                <Text style={styles.subHeaderText}>
                                    {"OTP will be sent to your registered"}
                                </Text>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={styles.subHeaderText}>
                                        {props?.route?.params?.forgotPh?.phoneCode == "email" ? "email": "cell number"}
                                    </Text>
                                    <Text style={styles.subHeaderphone}>
                                        {` ${props?.route?.params?.forgotPh?.phoneCode == "email" ? "": props?.route?.params?.forgotPh?.phoneCode} ${props?.route?.params?.forgotPh?.forgotPh}`}
                                    </Text>
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={{ flexDirection: "column", marginTop: normalize(20) }}>
                        <View style={styles.inputContainer}>
                            {otpforgot && otpforgot.map((digit, index) => (
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
                                    {"Didn't get verification code? "}
                                </Text>
                            </View>
                            <TouchableOpacity disabled={countdown == 0 ? false :true} onPress={() => {
                                resendOTP();
                                clearAllOTPFieldsPhone();
                                resendOTPNeed();
                            }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color:countdown == 0 ? Colorpath.ButtonColr:"#DADADA" }}>
                                    {"Resend?"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity>
                            <Buttons
                                onPress={verifyHandleForgot}
                                height={normalize(45)}
                                width={normalize(288)}
                                backgroundColor={isEnabledMobile ? Colorpath.ButtonColr : "#CCC"}
                                borderRadius={normalize(9)}
                                text="Submit"
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(30)}
                                Top={normalize(30)}
                                disabled={!isEnabledMobile}
                            />
                        </TouchableOpacity>
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
        marginTop: normalize(50)
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 32,
        color: "#000000",
        marginTop: normalize(0)
    },
    subHeaderText: {
        // marginTop: normalize(10),
        color: "#666666",
        fontSize: 18,
        fontFamily: Fonts.InterRegular,
        textAlign: 'center',
    },
    subHeaderphone: {
        // marginTop: normalize(10),
        color: "#000000",
        fontSize: 18,
        fontFamily: Fonts.InterRegular,
        textAlign: 'center',
        fontWeight: "bold"
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
        alignSelf: 'center',
        width: normalize(280),
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

export default EnterOTP;


