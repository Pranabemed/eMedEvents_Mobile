import { View, Text, Platform, KeyboardAvoidingView, ScrollView, TouchableOpacity, Animated, TextInput, Easing, Image, BackHandler } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import Header from '../../Components/Header';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { forgotRequest } from '../../Redux/Reducers/AuthReducer';
import TextFieldIn from '../../Components/Textfield';
import Loader from '../../Utils/Helpers/Loader';
import Imagepath from '../../Themes/Imagepath';
import InputField from '../../Components/CellInput';
let status = "";
import { SafeAreaView } from 'react-native-safe-area-context'
const ForgotMPIN = (props) => {
    const [mobilhd, setMobilhd] = useState("");
    const [cellCountry, setCellCountry] = useState("");
    const [mobile, setMobile] = useState("");
    const [showPassword, setShowPassword] = useState("");
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const fogotHandle = () => {
        const emailRegex = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
        const mobileRegex = /^\d{10}$/;
        if (!email) {
            showErrorAlert("Please enter your email or cell number!");
        } else if (!emailRegex.test(email) && !mobileRegex.test(email)) {
            showErrorAlert("Please enter a valid email address or 10 digit cell number!");
        } else {
            let obj = showPassword ? { "email": email } : {
                "phone": `${props?.route?.params?.phoneCode}${email}`
            }
            connectionrequest()
                .then(() => {
                    dispatch(forgotRequest(obj));
                })
                .catch(err => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }
    const emailRegex = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
    const mobileRegex = /^\d{10}$/;
    const cleanValue = email && email.trim().replace(/\s+/g, '');
    const isButtonEnabled =
        emailRegex.test(cleanValue) || mobileRegex.test(cleanValue);
    const animatedValuephone = useRef(new Animated.Value(1)).current;
    const scaleValuephone = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const targetScales = email ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuephone, {
                toValue: email ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuephone, {
                toValue: targetScales,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [email]);
    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/forgotRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/forgotSuccess':
                status = AuthReducer.status;
                props.navigation.navigate("EnterOTP", { forgotPh: { forgotPh: email, phoneCode: !showPassword ? props?.route?.params?.phoneCode : "email" } });
                break;
            case 'Auth/forgotFailure':
                status = AuthReducer.status;
                showErrorAlert("Your cell number is not registered with us. Please use your email and password to log in if you already have an account.");
                setTimeout(() => {
                    props.navigation.navigate("SignUp", { phoneCd: { phoneCd: props?.route?.params?.phoneCode } });
                }, 1000);
                break;
        }
    }
    const backEraFt = () => {
        props.navigation.goBack();
    }
    useEffect(() => {
        const onBackPress = () => {
            backEraFt();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
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
    const formatIndianPhoneNumber = (input) => {
        if (!input) return "";

        const strInput = String(input);
        const cleaned = strInput.replace(/\D/g, '').slice(0, 10);

        if (cleaned.length == 10) {
            return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
        }

        return strInput;
    };
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);
    useEffect(() => {
        if (props?.route?.params?.phoneCode) {
            setCellCountry(props?.route?.params?.phoneCode);
        }
    }, [props?.route?.params?.phoneCode])
    useEffect(() => {
        if (mobilhd && cellCountry == "+1") {
            const formatted = formatPhoneNumber(mobilhd);
            setMobilhd(formatted);
            setEmail(mobilhd);
            setCellCountry(cellCountry)
            setShowPassword(false);
            setMobile(true);
        } else if (mobilhd && cellCountry == "+91") {
            const formatted = formatIndianPhoneNumber(mobilhd);
            setMobilhd(formatted);
            setEmail(mobilhd);
            setCellCountry(cellCountry)
            setShowPassword(false);
            setMobile(true);
        }
    }, [mobilhd, cellCountry])
    const handleInputChange = (val) => {
        const emailRegex = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
        const mobileRegex = /^\d{10}$/;
        setEmail(val);
        if (mobile && val.length > 0) {
            setEmail(val);
        }
        if (val.trim() === '') {
            setMobile(false);
            setShowPassword(false);
            return;
        }
        if (emailRegex.test(val)) {
            setShowPassword(true);
        } else if (mobileRegex.test(val)) {
            setShowPassword(false);
        } else if (/^\d+$/.test(val)) {
            setMobile(true);
            setShowPassword(false);
        } else if (/^[a-zA-Z]/.test(val)) {
            setShowPassword(false);
        } else {
            setShowPassword(false);
            setMobile(false);
        }
    };
    const validateEmail = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
    const isValidEmail = !mobile && email?.length > 0 && !mobile && !validateEmail.test(email);
    const mobileReg = /^\d{10}$/;
    const cleanMobile = email && email.replace(/\s+/g, '');
    const isMobile = mobile && cleanMobile?.length > 0 && mobile && !mobileReg.test(cleanMobile);
    const phoneInputRef = useRef(null);
    useEffect(() => {
        if (mobile && phoneInputRef.current) {
            phoneInputRef.current.focus();
        }
    }, [mobile])
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ paddingBottom: normalize(60) }}>
                        <Loader
                            visible={AuthReducer?.status == 'Auth/forgotRequest'} />
                        <View>
                            <Header
                                onPress={() => props.navigation.goBack()}
                                tintColor={Colorpath.black}
                            />
                            {/* <View style={{ top: normalize(18), marginRight: normalize(10), justifyContent: "center", alignContent: "center" }}>
                                <Image
                                    source={Imagepath.eMedfulllogo}
                                    style={{ alignSelf: "center", height: normalize(40), width: normalize(212), resizeMode: "contain" }}
                                />
                            </View> */}
                            <View style={{ width: normalize(40) }} />
                        </View>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText}>{"Forgot Password"}</Text>
                            <Text style={styles.subHeaderText}>
                                {"Enter your registered email or cell number"}
                            </Text>
                        </View>

                        <View style={{ paddingHorizontal: normalize(20), paddingVertical: normalize(10) }}>
                            <View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>
                                <View style={{
                                    flex: 1,
                                    paddingRight: normalize(0)
                                }}>
                                    {mobile ? <InputField
                                        ref={phoneInputRef}
                                        label="Email / Cell Number"
                                        value={mobilhd}
                                        onChangeText={(val) => {
                                            if (cellCountry == "+91") {
                                                const formatted = formatIndianPhoneNumber(val);
                                                setMobilhd(formatted);
                                                const rawDigits = formatted.replace(/\D/g, '');
                                                handleInputChange(rawDigits);
                                                setEmail(rawDigits);
                                            } else if (cellCountry == "+1") {
                                                const formatted = formatPhoneNumber(val);
                                                setMobilhd(formatted);
                                                const rawDigits = formatted.replace(/\D/g, '');
                                                handleInputChange(rawDigits);
                                                setEmail(rawDigits);
                                            }
                                        }}
                                        placeholder=""
                                        placeholderTextColor="#949494"
                                        keyboardType="number-pad"
                                        showCountryCode={true}
                                        countryCode={cellCountry || "+91"}
                                        maxlength={14}
                                        labelStyle={{ top: 10 }}
                                    /> : <InputField
                                        label="Email / Cell Number"
                                        value={email}
                                        onChangeText={handleInputChange}
                                        placeholder=""
                                        placeholderTextColor="#949494"
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxlength={100}
                                    />}
                                    {isValidEmail && (
                                        <View style={{ bottom: normalize(10) }}>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterRegular,
                                                    fontSize: 12,
                                                    color: 'red',
                                                }}>
                                                {"Please enter a valid email address (e.g., abc@gmail.com)"}
                                            </Text>
                                        </View>
                                    )}
                                    {isMobile && (
                                        <View style={{ bottom: normalize(10) }}>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterRegular,
                                                    fontSize: 12,
                                                    color: 'red',
                                                }}>
                                                {"Please enter a valid cell number"}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                        <Buttons
                            onPress={fogotHandle}
                            height={normalize(45)}
                            width={normalize(280)}
                            backgroundColor={isButtonEnabled ? Colorpath.ButtonColr : "#CCC"}
                            borderRadius={normalize(9)}
                            text="Submit"
                            color={Colorpath.white}
                            fontSize={18}
                            fontFamily={Fonts.InterSemiBold}
                            marginTop={normalize(10)}
                            disabled={!isButtonEnabled}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
};

const styles = {
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: normalize(70)
        // backgroundColor:"red"
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 30,
        color: "#000000",
    },
    subHeaderText: {
        marginTop: normalize(8),
        color: "#666666",
        fontSize: 18,
        fontFamily: Fonts.InterRegular,
        textAlign: 'center',
    },
    inputContainer: {
        alignItems: 'center',
        marginTop: normalize(20)
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
};

export default ForgotMPIN;
