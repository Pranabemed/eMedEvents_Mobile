import { formatUsPhone } from '../../Utils/Helpers/UsPhone';
/**
 * Forgot mpin screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, ForgotMPIN, fogotHandle, backEraFt, onBackPress, formatPhoneNumber, formatIndianPhoneNumber, handleInputChange, styles.
 */

import { View, Text, Platform, KeyboardAvoidingView, ScrollView, TouchableOpacity, Animated, TextInput, Easing, Image, BackHandler } from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import Header from '../../Components/Header';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { forgotRequest, clearForgotState } from '../../Redux/Reducers/AuthReducer';
import TextFieldIn from '../../Components/Textfield';
import Loader from '../../Utils/Helpers/Loader';
import Imagepath from '../../Themes/Imagepath';
import InputField from '../../Components/CellInput';
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable ForgotMPIN component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const ForgotMPIN = (props) => {
    const isNonUsaUser = Boolean(props?.route?.params?.isNonUsaUser);
    const [cellCountry, setCellCountry] = useState("");
    const [mobile, setMobile] = useState("");
    const [showPassword, setShowPassword] = useState("");
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const pendingRequestRef = useRef(false);
    const redirectTimerRef = useRef(null);
    const activeVisitRef = useRef(null);

    useFocusEffect(useCallback(() => {
        activeVisitRef.current = {};
        pendingRequestRef.current = false;
        dispatch(clearForgotState());
        return () => {
            activeVisitRef.current = null;
            pendingRequestRef.current = false;
            clearTimeout(redirectTimerRef.current);
            redirectTimerRef.current = null;
        };
    }, [dispatch]));

    /**
     * Fogot handle utility.
     * @returns {void}
     */
    const fogotHandle = () => {
        const emailRegex = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
        const mobileRegex = /^\d{10}$/;
        const trimmedVal = email ? email.trim() : '';
        const cleVal = trimmedVal.replace(/\D/g, '');
        if (!trimmedVal) {
            showErrorAlert(isNonUsaUser ? "Please enter your email address!" : "Please enter your email or cell number!");
        } else if (isNonUsaUser && !emailRegex.test(trimmedVal)) {
            showErrorAlert("Please enter a valid email address!");
        } else if (!isNonUsaUser && !emailRegex.test(trimmedVal) && !(mobile && mobileRegex.test(cleVal))) {
            showErrorAlert("Please enter a valid email address or 10 digit cell number!");
        } else {
            const phoneCode = props?.route?.params?.phoneCode || "+1";
            const phoneValue = phoneCode == '+1' ? formatPhoneNumber(cleVal) : cleVal;
            let obj = (showPassword || isNonUsaUser) ? { "email": trimmedVal } : {
                "phone": `${phoneCode}${phoneValue}`
            }
            if (pendingRequestRef.current || !activeVisitRef.current) return;
            const activeVisit = activeVisitRef.current;
            pendingRequestRef.current = true;
            clearTimeout(redirectTimerRef.current);
            connectionrequest()
                .then(() => {
                    if (activeVisitRef.current !== activeVisit) return;
                    dispatch(forgotRequest(obj));
                })
                .catch(err => {
                    if (activeVisitRef.current !== activeVisit) return;
                    pendingRequestRef.current = false;
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }
    const emailRegex = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
    const mobileRegex = /^\d{10}$/;
    const trimmedValue = email ? email.trim() : '';
    const cleanValue = trimmedValue.replace(/\D/g, '');
    const isButtonEnabled = isNonUsaUser
        ? emailRegex.test(trimmedValue)
        : (emailRegex.test(trimmedValue) || (mobile && mobileRegex.test(cleanValue)));
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
    useEffect(() => {
        if (activeVisitRef.current && pendingRequestRef.current) {
            if (AuthReducer.status === 'Auth/forgotSuccess') {
                pendingRequestRef.current = false;
                props.navigation.navigate("EnterOTP", { forgotPh: { forgotPh: email, phoneCode: !showPassword ? (props?.route?.params?.phoneCode || "+1") : "email" } });
            } else if (AuthReducer.status === 'Auth/forgotFailure') {
                pendingRequestRef.current = false;
                showErrorAlert(`Your ${showPassword || isNonUsaUser ? "email" : "cell number"} is not registered with us. Please use your email and password to log in if you already have an account.`);
                redirectTimerRef.current = setTimeout(() => {
                    redirectTimerRef.current = null;
                    if (!activeVisitRef.current) return;
                    props.navigation.navigate("SignUp", { phoneCd: { phoneCd: props?.route?.params?.phoneCode } });
                }, 1000);
            }
        }
    }, [AuthReducer.status, email, isNonUsaUser, props.navigation, props?.route?.params?.phoneCode, showPassword]);
        /**
 * Back era ft utility.
 * @returns {void}
 */
const backEraFt = () => {
        props.navigation.goBack();
    }
    useEffect(() => {
                /**
 * On back press utility.
 * @returns {boolean}
 */
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
        /**
 * Formats phone number.
 * @param {*} input - Input value.
 * @returns {*}
 */
const formatPhoneNumber = (input) => formatUsPhone(input);
        /**
 * Formats indian phone number.
 * @param {*} input - Input value.
 * @returns {*}
 */
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
        setCellCountry(props?.route?.params?.phoneCode || "+1");
    }, [props?.route?.params?.phoneCode])
        /**
 * Handles input change.
 * @param {*} val - Input value.
 * @returns {void}
 */
const handleInputChange = (val) => {
        const digits = val.replace(/\D/g, '');
        const isPhoneNumber = !isNonUsaUser && digits.length > 0 && !/[a-zA-Z]/.test(val);
        if (isPhoneNumber) {
            const cappedDigits = digits.slice(0, 10);
            const formatted = (cellCountry || "+1") === "+1" ? formatUsPhone(cappedDigits) : cappedDigits;
            setEmail(formatted);
            setMobile(true);
            setShowPassword(false);
        } else {
            setEmail(val);
            setMobile(false);
            setShowPassword(true);
        }
    };
    const validateEmail = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
    const isValidEmail = !mobile && email?.length > 0 && !validateEmail.test(email.trim());
    const mobileReg = /^\d{10}$/;
    const cleanMobile = email && email.replace(/\D/g, '');
    const isMobile = mobile && cleanMobile?.length > 0 && !mobileReg.test(cleanMobile);
    return (
        <>
            <MyStatusBar
                barStyle={'dark-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <Loader
                            visible={AuthReducer?.status == 'Auth/forgotRequest'} />
                        <Header
                            onPress={() => props.navigation.goBack()}
                            tintColor={Colorpath.black}
                        />
                        <View style={styles.content}>
                            <View style={styles.iconContainer}>
                                <Feather name="lock" size={30} color={Colorpath.ButtonColr} />
                            </View>
                            <Text style={styles.headerText}>Forgot Password?</Text>
                            <Text style={styles.subHeaderText}>
                                {isNonUsaUser
                                    ? "Enter your registered email address to receive a verification code."
                                    : "Enter your registered email address or cell number to receive a verification code."}
                            </Text>
                            <View style={styles.form}>
                                <InputField
                                    label={isNonUsaUser ? "Email Address" : "Email / Cell Number"}
                                    value={email}
                                    onChangeText={handleInputChange}
                                    placeholder=""
                                    placeholderTextColor="#949494"
                                    keyboardType={mobile ? "phone-pad" : "default"}
                                    showCountryCode={Boolean(mobile && email && email.length > 0)}
                                    countryCode={mobile && email?.length > 0 ? (cellCountry || "+1") : undefined}
                                    maxlength={100}
                                    containerStyle={styles.inputContainer}
                                    wrapperStyle={styles.inputWrapper}
                                />
                                <View style={styles.helperContainer}>
                                    <Text style={[styles.helperText, (isValidEmail || isMobile) && styles.errorText]}>
                                        {isValidEmail
                                            ? "Enter a valid email address, e.g. name@example.com."
                                            : isMobile
                                                ? "Enter your complete 10-digit cell number."
                                                : isNonUsaUser
                                                    ? "Use the email address linked to your account."
                                                    : "For cell numbers, enter all 10 digits."}
                                    </Text>
                                </View>
                                <Buttons
                                    onPress={fogotHandle}
                                    height={normalize(48)}
                                    width="100%"
                                    backgroundColor={isButtonEnabled ? Colorpath.ButtonColr : "#E4E7EC"}
                                    borderRadius={normalize(10)}
                                    text="Send Verification Code"
                                    color={isButtonEnabled ? Colorpath.white : "#667085"}
                                    fontSize={16}
                                    fontFamily={Fonts.InterSemiBold}
                                    marginTop={normalize(12)}
                                    disabled={!isButtonEnabled}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => props.navigation.goBack()}
                                accessibilityRole="button"
                                style={styles.backButton}
                            >
                                <Feather name="arrow-left" size={16} color={Colorpath.ButtonColr} />
                                <Text style={styles.backText}>Back to Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
};

/**
 * Styles object.
 * @returns {Object}
 */
const styles = {
    scrollContent: {
        flexGrow: 1,
        paddingBottom: normalize(32),
    },
    content: {
        width: '100%',
        maxWidth: 480,
        alignSelf: 'center',
        paddingHorizontal: normalize(24),
        paddingTop: normalize(28),
    },
    iconContainer: {
        width: normalize(64),
        height: normalize(64),
        borderRadius: normalize(20),
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: normalize(24),
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 28,
        color: '#101828',
    },
    subHeaderText: {
        marginTop: normalize(12),
        color: '#667085',
        fontSize: 15,
        lineHeight: 23,
        fontFamily: Fonts.InterRegular,
    },
    form: {
        marginTop: normalize(28),
    },
    inputContainer: {
        marginBottom: 0,
    },
    inputWrapper: {
        borderBottomColor: '#98A2B3',
        minHeight: normalize(54),
    },
    helperContainer: {
        minHeight: normalize(44),
        paddingTop: normalize(10),
    },
    helperText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 12,
        lineHeight: 18,
        color: '#667085',
    },
    errorText: {
        color: '#B42318',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        marginTop: normalize(20),
    },
    backText: {
        marginLeft: normalize(8),
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        color: Colorpath.ButtonColr,
    },
};

/**
 * Forgot mpin default export.
 *
 * @returns {*}
 */
export default ForgotMPIN;
