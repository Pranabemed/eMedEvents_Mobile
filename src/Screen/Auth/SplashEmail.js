import {
    View, Text, Platform, KeyboardAvoidingView,
    TouchableOpacity, TextInput, StyleSheet, BackHandler,
} from 'react-native';
import React, {
    useEffect, useRef, useState, useCallback, useLayoutEffect,
} from 'react';
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
import { CommonActions, useIsFocused } from '@react-navigation/native';
import Loader from '../../Utils/Helpers/Loader';
import { mainprofileRequest } from '../../Redux/Reducers/DashboardReducer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { writeNonUsaFlowState } from '../../Utils/Helpers/nonUsaFlow';

// ─── Module-level OTP send guard ────────────────────────────────────────────
// Stored OUTSIDE the component so it:
//  • Survives React StrictMode's intentional unmount → remount cycle
//  • Is checked and set in the same synchronous tick (zero async race condition)
//  • Tracks which email the OTP was last sent for, so a new email always works
//
// Reset this to null on: Resend button tap, successful verification.
let _autoOTPSentForEmail = null;
// ─────────────────────────────────────────────────────────────────────────────

const VerifyOTPEmail = (props) => {
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const isFocus = useIsFocused();
    const isNonUsaUser = Boolean(props?.route?.params?.verifyemail?.isNonUsaUser || props?.route?.params?.nonUsaUser);

    // ─── State ────────────────────────────────────────────────────────────────
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [allotpcheck, setAllotpcheck] = useState();
    const [resendtrue, setResendtrue] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [countdown, setCountdown] = useState(300);

    // ─── Refs ─────────────────────────────────────────────────────────────────
    const inputs = useRef([]);
    const timerRef = useRef(null);
    const startTimeRef = useRef(0);
    const initialDurationRef = useRef(0);
    // Tracks last handled auth status to avoid double-opening the modal
    const prevAuthStatus = useRef('');

    // ─── Fetch email from AsyncStorage ───────────────────────────────────────
    useEffect(() => {
        const token_handle = () => {
            setTimeout(async () => {
                const loginHandle = await AsyncStorage.getItem(constants.EMAIL);
                setAllotpcheck(loginHandle);
            }, 100);
        };
        try { token_handle(); } catch (e) { console.log(e); }
    }, [isFocus]);

    // ─── Fetch main profile once on mount ────────────────────────────────────
    useEffect(() => {
        connectionrequest()
            .then(() => { dispatch(mainprofileRequest({})); })
            .catch(err => { showErrorAlert('Please connect to internet', err); });
    }, []);

    // ─── Block hardware back button ───────────────────────────────────────────
    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => sub.remove();
    }, []);

    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);

    // ─── Timer ────────────────────────────────────────────────────────────────
    // startTimer has NO deps — reads refs directly so it never recreates
    const startTimer = useCallback(() => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            const remaining = initialDurationRef.current - elapsed;
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
    }, []);

    const startNewTimer = useCallback((duration) => {
        clearInterval(timerRef.current);
        AsyncStorage.removeItem('otpStartTime');
        AsyncStorage.removeItem('otpInitialDuration');
        startTimeRef.current = Date.now();
        initialDurationRef.current = duration;
        setCountdown(duration);
        if (duration > 0) {
            AsyncStorage.setItem('otpStartTime', startTimeRef.current.toString());
            AsyncStorage.setItem('otpInitialDuration', initialDurationRef.current.toString());
            startTimer();
        }
    }, [startTimer]);

    // Restore persisted timer on mount (handles back-navigation scenario)
    useEffect(() => {
        const restore = async () => {
            const storedStart = await AsyncStorage.getItem('otpStartTime');
            const storedDuration = await AsyncStorage.getItem('otpInitialDuration');
            if (storedStart && storedDuration) {
                const parsedStart = parseInt(storedStart, 10);
                const parsedDuration = parseInt(storedDuration, 10);
                const elapsed = Math.floor((Date.now() - parsedStart) / 1000);
                const remaining = Math.max(parsedDuration - elapsed, 0);
                if (remaining > 0) {
                    startTimeRef.current = parsedStart;
                    initialDurationRef.current = parsedDuration;
                    setCountdown(remaining);
                    startTimer();
                } else {
                    AsyncStorage.removeItem('otpStartTime');
                    AsyncStorage.removeItem('otpInitialDuration');
                }
            } else {
                startNewTimer(300);
            }
        };
        restore();
        return () => {
            clearInterval(timerRef.current);
            _autoOTPSentForEmail = null;
        };
    }, []);

    const resendOTP = useCallback(() => {
        startNewTimer(300);
    }, [startNewTimer]);

    // ─── Single shared resend-OTP API dispatcher ──────────────────────────────
    const dispatchResendEmailOTP = useCallback(() => {
        const obj = { verify_type: 'email' };
        connectionrequest()
            .then(() => { dispatch(resendemailotpRequest(obj)); })
            .catch(err => { showErrorAlert('Please connect to internet', err); });
    }, [dispatch]);

    // ─── Auto-trigger OTP ONCE when newMail param is present ─────────────────
    //
    // Uses a module-level variable (_autoOTPSentForEmail) as the guard.
    // This is synchronous and lives outside React, so it is immune to:
    //   • React StrictMode double-invoke
    //   • Rapid unmount → remount from navigator
    //   • Async race conditions (no AsyncStorage read needed)
    //
    // The guard stores the exact email string so a genuinely new email
    // (different newMail param) will always trigger correctly.
    //
    useEffect(() => {
        const newMail = props?.route?.params?.newMail;
        if (!newMail) return;

        const forceResend = props?.route?.params?.NewEmail?.forceResend;
        if (forceResend) {
            _autoOTPSentForEmail = null;
        }

        // Synchronous check + set — no await, no race condition possible
        if (_autoOTPSentForEmail === newMail) return;
        _autoOTPSentForEmail = newMail; // locked before any async work

        setResendtrue(true);
        dispatchResendEmailOTP();
        resendOTP();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props?.route?.params?.newMail, props?.route?.params?.NewEmail?.forceResend]);



    // ─── Open success modal after verifyemailSuccess (safe, not during render) ─
    useEffect(() => {
        if (
            AuthReducer.status === 'Auth/verifyemailSuccess' &&
            prevAuthStatus.current !== 'Auth/verifyemailSuccess'
        ) {
            // Reset the module-level guard so a future newMail flow works correctly
            _autoOTPSentForEmail = null;
            if (isNonUsaUser) {
                writeNonUsaFlowState({
                    userType: 'non_usa',
                    isNonUsa: true,
                    emailVerified: true,
                    professionCompleted: true,
                });
                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'TabNav' }],
                    })
                );
            } else {
                setModalVisible(true);
            }
        }
        prevAuthStatus.current = AuthReducer.status;
    }, [AuthReducer.status]);

    // ─── OTP input handlers ───────────────────────────────────────────────────
    const handleChange = (text, index) => {
        if (text.length > 1) {
            const pasted = text.replace(/[^0-9]/g, '');
            const newOtp = [...otp];
            let lastIndex = index;
            for (let i = 0; i < pasted.length && index + i < 6; i++) {
                newOtp[index + i] = pasted[i];
                lastIndex = index + i;
            }
            setOtp(newOtp);
            inputs.current[lastIndex < 5 ? lastIndex + 1 : lastIndex]?.focus();
            return;
        }
        const updated = [...otp];
        updated[index] = text;
        setOtp(updated);
        if (text && index < 5) inputs.current[index + 1]?.focus();
    };

    const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === 'Backspace') {
            if (otp[index] === '') {
                if (index > 0) inputs.current[index - 1]?.focus();
            } else {
                const updated = [...otp];
                updated[index] = '';
                setOtp(updated);
            }
        }
    };

    const clearAllOTPFields = () => {
        setOtp(new Array(6).fill(''));
        inputs.current[0]?.focus();
    };

    // ─── Verify ───────────────────────────────────────────────────────────────
    const verifyHandle = () => {
        const enteredOTP = otp.join('');
        let serverOTP;
        if (resendtrue && AuthReducer?.resendemailotpResponse?.email_otp) {
            serverOTP = AuthReducer.resendemailotpResponse.email_otp;
        } else if (props?.route?.params?.NewEmail?.verifyotp) {
            serverOTP = props.route.params.NewEmail.verifyotp;
        } else {
            serverOTP = AuthReducer?.signupResponse?.email_otp || AuthReducer?.resendemailotpResponse?.email_otp;
        }

        if (enteredOTP == serverOTP) {
            const obj = { verify_type: 'email' };
            connectionrequest()
                .then(() => { dispatch(verifyemailRequest(obj)); })
                .catch(err => { showErrorAlert('Please connect to internet', err); });
        } else {
            setResendtrue(false);
            showErrorAlert('Invalid OTP. Please try again.');
        }
    };

    const toggleModal = () => setModalVisible(v => !v);

    // ─── Derived values ───────────────────────────────────────────────────────
    const isEnabled = countdown > 0;

    const email =
        props?.route?.params?.NewEmail?.email ||
        props?.route?.params?.NewEmail ||
        props?.route?.params?.newMail ||
        props?.route?.params?.mobileNo ||
        props?.route?.params?.user?.emailid ||
        AuthReducer?.verifyResponse?.email ||
        allotpcheck;

    const phoneTake =
        props?.route?.params?.user?.phoneData ||
        props?.route?.params?.mobileNo?.phone ||
        props?.route?.params?.verifyemail?.verifyemail?.phone ||
        props?.route?.params?.NewEmail?.phoneNo ||
        props?.route?.params?.NewEmail?.phone ||
        props?.route?.params?.NewEmail?.returnDat?.phone ||
        props?.route?.params?.NewEmail?.returnDat?.phoneNo ||
        AuthReducer?.verifyResponse?.phone;

    const countryCode =
        props?.route?.params?.verifyemail?.verifyemail?.countryCode ||
        props?.route?.params?.NewEmail?.returnDat?.countryCode;

    const finalPush =
        props?.route?.params?.verifyemail?.profession ||
        (DashboardReducer?.mainprofileResponse?.professional_information?.profession &&
            DashboardReducer?.mainprofileResponse?.professional_information?.profession_type
            ? `${DashboardReducer.mainprofileResponse.professional_information.profession} - ${DashboardReducer.mainprofileResponse.professional_information.profession_type}`
            : null);

    const high =
        props?.route?.params?.NewEmail?.email ||
        props?.route?.params?.NewEmail ||
        props?.route?.params?.newMail;

    // ─── Render ───────────────────────────────────────────────────────────────
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
                        visible={
                            AuthReducer?.status === 'Auth/verifyemailRequest' ||
                            AuthReducer?.status === 'Auth/resendemailotpRequest'
                        }
                    />

                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{'Verify Your Email'}</Text>
                        <View style={{ flexDirection: 'column', marginTop: normalize(15) }}>
                            <Text style={styles.subHeaderText}>
                                {'A 6-digit code has been sent to'}
                            </Text>

                            {email?.length < 15 ? (
                                <View style={{ flexDirection: 'row', gap: 5 }}>
                                    <View>
                                        <Text style={[styles.subHeaderText, { fontWeight: 'bold', width: normalize(170) }]}>
                                            {email}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        disabled={countdown !== 0}
                                        onPress={() => {
                                            props.navigation.navigate('ChangeMailSplash', { wholeData: high });
                                            startNewTimer(0);
                                            clearAllOTPFields();
                                        }}
                                    >
                                        <Text style={[styles.subHeaderText, { textDecorationLine: 'underline', color: Colorpath.ButtonColr }]}>
                                            {'Change'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={{ gap: 5 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text
                                            style={[styles.subHeaderText, { fontWeight: 'bold', width: normalize(320) }]}
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                        >
                                            {email}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        disabled={countdown !== 0}
                                        style={{ alignSelf: 'center' }}
                                        onPress={() => {
                                            props.navigation.navigate('ChangeMailSplash', { wholeData: high });
                                            startNewTimer(0);
                                            clearAllOTPFields();
                                        }}
                                    >
                                        <Text style={[styles.subHeaderText, {
                                            textDecorationLine: 'underline',
                                            color: countdown === 0 ? Colorpath.ButtonColr : '#DADADA',
                                        }]}>
                                            Change
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', flex: 0.3 }}>
                        <View style={styles.inputContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    placeholder="0"
                                    placeholderTextColor={Colorpath.locText}
                                    ref={(ref) => (inputs.current[index] = ref)}
                                    value={digit}
                                    onChangeText={(text) => {
                                        handleChange(text.replace(/[^0-9]/g, ''), index);
                                    }}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    style={styles.input}
                                    autoFocus={index === 0}
                                    textAlign="center"
                                />
                            ))}
                        </View>

                        <View style={{ flexDirection: 'row', marginLeft: normalize(17), gap: 5, marginTop: normalize(10) }}>
                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: '#FF5E62' }}>
                                {countdown === 0
                                    ? 'Verification code expired!'
                                    : `The code will be expired in ${countdown} seconds`}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginLeft: normalize(17), gap: 5, marginTop: normalize(10) }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: '#666666' }}>
                                {"Didn't receive the code?"}
                            </Text>
                            <TouchableOpacity
                                disabled={countdown !== 0}
                                onPress={() => {
                                    // Reset the module-level guard so user can resend manually
                                    _autoOTPSentForEmail = null;
                                    dispatchResendEmailOTP();
                                    resendOTP();
                                    setResendtrue(true);
                                    clearAllOTPFields();
                                }}
                            >
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: countdown === 0 ? Colorpath.ButtonColr : '#DADADA' }}>
                                    {'Resend'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Buttons
                                onPress={verifyHandle}
                                height={normalize(45)}
                                width={normalize(288)}
                                backgroundColor={isEnabled ? Colorpath.ButtonColr : '#CCC'}
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
                                content={'Your email has been \n successfully verified.'}
                                navigation={props.navigation}
                                phoneno={phoneTake}
                                countrycode={countryCode}
                                norq={props?.route?.params?.user?.phoneData ? 'call' : ''}
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
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.4,
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 32,
        color: '#000000',
        marginTop: normalize(10),
    },
    subHeaderText: {
        color: '#666666',
        fontSize: 18,
        fontFamily: Fonts.InterRegular,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: normalize(15),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: normalize(8),
    },
    input: {
        width: 45,
        height: 45,
        borderBottomWidth: 2,
        borderColor: '#ccc',
        fontSize: 20,
        color: '#000000',
        fontFamily: Fonts.InterMedium,
    },
});

export default VerifyOTPEmail;
