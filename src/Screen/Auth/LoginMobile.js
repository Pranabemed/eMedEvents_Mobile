/**
 * Login mobile screen module. Renders a React Native screen or a screen-scoped support component. Exported members: _mobileOTPSentForPhone, LoginMobile, fetch, restore, handleChange, handleKeyPress, clearAllOTPFieldsMobile, verifyHandlevalid, verifyHandle, toggleModal, stateDashboardData, stateReport, licHandl, styles.
 */

import {
    View, Text, Platform, KeyboardAvoidingView,
    TouchableOpacity, TextInput, StyleSheet, BackHandler,
} from 'react-native';
import React, {
    useCallback, useContext, useEffect, useLayoutEffect,
    useMemo, useRef, useState,
} from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import {
    chooseStatecardRequest, licesensRequest,
    resendmobileotpRequest, verifymobileRequest,
} from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../../Utils/Helpers/Loader';
import CellModal from '../../Components/CellModal';
import { processPhoneNumber } from '../../Utils/Helpers/PhoneNormalize';
import {
    dashMbRequest, mainprofileRequest,
    stateDashboardRequest, stateReportingRequest,
} from '../../Redux/Reducers/DashboardReducer';
import { AppContext } from '../GlobalSupport/AppContext';
import { PrimeCheckRequest, walletCheckRequest } from '../../Redux/Reducers/WebcastReducer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isPrimeSubscriptionMissing } from '../../Utils/Helpers/primeSubscription';
import { getCountryAndDialCode } from '../../Utils/Helpers/IPServer';
import { isUsaCountryCode } from '../../Utils/Helpers/nonUsaFlow';

/**
 * Reusable LoginMobile component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

// ─── Module-level OTP send guard ─────────────────────────────────────────────
// Same pattern as LoginEmail. Stored outside the component so it:
//  • Survives React StrictMode's intentional unmount → remount cycle
//  • Is checked and set in the same synchronous tick (zero race condition)
//  • Tracks which phone the OTP was last sent for
//
// Reset on: Resend button tap, successful verification.
/**
 * Mobile otpsent for phone value.
 * @returns {*}
 */
let _mobileOTPSentForPhone = null;
// ─────────────────────────────────────────────────────────────────────────────

const formatDisplayPhoneNumber = (phoneStr, phoneCodeStr, isUsaIp = false) => {
    if (!phoneStr) return '';
    let raw = String(phoneStr).trim();
    let code = String(phoneCodeStr || '').trim();

    const digitsOnly = raw.replace(/\D/g, '');

    const isCodeUS =
        code === '+1' ||
        code === '1' ||
        code.toUpperCase() === 'US' ||
        code.toUpperCase() === 'USA' ||
        code.startsWith('+1') ||
        code.startsWith('1');

    const isRawUS =
        raw.startsWith('+1') ||
        (digitsOnly.length === 11 && digitsOnly.startsWith('1')) ||
        (digitsOnly.length === 10 && (isCodeUS || isUsaIp || !code || code === '+1' || code === '1'));

    const isUS = isUsaIp || isCodeUS || isRawUS;

    if (isUS && (digitsOnly.length === 10 || digitsOnly.length === 11)) {
        const last10 = digitsOnly.slice(-10);
        const match = last10.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
        }
    }

    if (raw.startsWith('+')) {
        const processed = processPhoneNumber(raw);
        if (processed && processed.isValid) {
            if (processed.countryCode === '+1' || processed.country === 'US') {
                const digits = processed.nationalNumber.slice(-10);
                const match = digits.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
                }
            }
            return processed.formattedNumber || raw;
        }
    }

    if (code && !code.startsWith('+') && !isNaN(code)) {
        code = `+${code}`;
    }
    return code && !raw.startsWith(code) ? `${code} ${raw}` : raw;
};

/**
 * Login mobile component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const LoginMobile = (props) => {
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
        stateCount,
    } = useContext(AppContext);

    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const stableGuestPrimeUser = useMemo(() => {
        const user =
            AuthReducer?.signupResponse?.user ||
            AuthReducer?.loginResponse?.user ||
            AuthReducer?.againloginsiginResponse?.user ||
            AuthReducer?.verifymobileResponse?.user ||
            {};
        const subscriptionUser = String(user?.subscription_user || '').trim().toLowerCase();
        const subscriptions = Array.isArray(user?.subscriptions) ? user.subscriptions : [];
        return subscriptionUser === 'non-subscribed' && subscriptions.length === 0;
    }, [AuthReducer?.signupResponse?.user, AuthReducer?.loginResponse?.user, AuthReducer?.againloginsiginResponse?.user, AuthReducer?.verifymobileResponse?.user]);

    const isFocus = useIsFocused();

    // ─── State ─────────────────────────────────────────────────────────────────
    const [mobiletrue, setMobiletrue] = useState(false);
    const [countdown, setCountdown] = useState(300);
    const [allotpcheckddd, setAllotpcheckddd] = useState('');
    const [finalCode, setFinalCode] = useState('');
    const [noload, setNoload] = useState(false);
    const [otpmobile, setOtpmobile] = useState(new Array(6).fill(''));
    const [isModalVisible, setModalVisible] = useState(false);
    const [isUsaIp, setIsUsaIp] = useState(false);

    useEffect(() => {
        if (!isFocus) return;
        let isActive = true;
        getCountryAndDialCode().then(info => {
            if (!isActive) return;
            const country = String(info?.country || info?.country_code || info?.countryCode || '').toUpperCase();
            setIsUsaIp(isUsaCountryCode(country));
        }).catch(err => console.log('LoginMobile IP lookup error:', err));
        return () => { isActive = false; };
    }, [isFocus]);

    // ─── Refs ──────────────────────────────────────────────────────────────────
    const inputsmobile = useRef([]);
    const timerRef = useRef(null);
    const startTimeRef = useRef(0);
    const initialDurationRef = useRef(0);
    // Tracks last handled auth/dashboard status — prevents double-opening modal
    const prevAuthStatus = useRef('');
    const prevDashStatus = useRef('');

    // ─── Disable gesture navigation ────────────────────────────────────────────
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);

    // ─── Hardware back block ───────────────────────────────────────────────────
    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => sub.remove();
    }, []);

    // ─── Fetch phone from AsyncStorage ────────────────────────────────────────
    useEffect(() => {
                /**
 * Fetch utility.
 * @returns {void}
 */
const fetch = () => {
            setTimeout(async () => {
                const ph = await AsyncStorage.getItem(constants.PHONE);
                setAllotpcheckddd(ph || '');
            }, 100);
        };
        try { fetch(); } catch (e) { console.log(e); }
    }, [isFocus]);

    // ─── Dispatch wallet/prime/profile checks when signupResponse arrives ─────
    useEffect(() => {
        if (AuthReducer?.signupResponse?.token) {
            const objToken = { token: AuthReducer.signupResponse.token, key: {} };
            connectionrequest()
                .then(async () => {
                    await AsyncStorage.setItem(constants.GUEST_PRIME_USER, JSON.stringify(stableGuestPrimeUser));
                    await AsyncStorage.setItem('activeProfile', 'PrimeCard');
                    dispatch(walletCheckRequest(objToken));
                    dispatch(PrimeCheckRequest(objToken));
                    dispatch(mainprofileRequest(objToken));
                })
                .catch(err => showErrorAlert('Please connect to internet', err));
        }
    }, [AuthReducer?.signupResponse]);

    // ─── Dispatch wallet/prime/profile checks on screen focus ─────────────────
    useEffect(() => {
        setTimeout(async () => {
            const token = await AsyncStorage.getItem(constants.TOKEN);
            const objToken = { token, key: {} };
            if (token) {
                await AsyncStorage.setItem(constants.GUEST_PRIME_USER, JSON.stringify(stableGuestPrimeUser));
                await AsyncStorage.setItem('activeProfile', 'PrimeCard');
            }
            dispatch(walletCheckRequest(objToken));
            dispatch(PrimeCheckRequest(objToken));
            dispatch(mainprofileRequest(objToken));
        }, 500);
    }, [isFocus, stableGuestPrimeUser]);

    // ─── Timer ────────────────────────────────────────────────────────────────
    // startTimer has NO deps — reads refs directly so it NEVER recreates.
    // This prevents the "timer restarts every second" loop.
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
    }, []); // ← intentionally empty deps

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
                /**
 * Restore utility.
 *
 * @async
 * @returns {Promise<*>}
 */
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
        return () => clearInterval(timerRef.current);
    }, []); // ← run once on mount only

    const resendMobile = useCallback(() => {
        startNewTimer(300);
    }, [startNewTimer]);

    // ─── Single shared dispatch for resend mobile OTP ─────────────────────────
    const dispatchResendMobileOTP = useCallback(() => {
        const obj = { verify_type: 'phone' };
        connectionrequest()
            .then(() => dispatch(resendmobileotpRequest(obj)))
            .catch(err => showErrorAlert('Please connect to internet', err));
    }, [dispatch]);

    // ─── Auto-trigger OTP ONCE when validPh.cellno param is present ──────────
    //
    // Uses a module-level variable (_mobileOTPSentForPhone) as the guard.
    // Immune to: StrictMode double-invoke, rapid unmount/remount, async races.
    // The guard stores the phone string so a genuinely new phone always triggers.
    //
    useEffect(() => {
        const phone = props?.route?.params?.validPh?.cellno;
        if (!phone) return;

        // Synchronous check + set — no await, no race condition possible
        if (_mobileOTPSentForPhone === phone) return;
        _mobileOTPSentForPhone = phone; // locked before any async work

        setMobiletrue(true);
        dispatchResendMobileOTP();
        resendMobile();
    }, [props?.route?.params?.validPh?.cellno]);

    // Watch for Newphone.Verifycell param (change phone flow)
    useEffect(() => {
        if (props?.route?.params?.Newphone?.Verifycell) {
            resendMobile();
            setMobiletrue(false);
        }
    }, [props?.route?.params?.Newphone?.Verifycell]);

    // ─── Auth status handler — open modal after verifymobileSuccess ───────────
    // useEffect pattern (not render-body switch) to avoid mutation during render
    useEffect(() => {
        const currentStatus = AuthReducer.status;
        if (currentStatus === prevAuthStatus.current) return;
        prevAuthStatus.current = currentStatus;

        if (currentStatus === 'Auth/verifymobileSuccess') {
            // Reset guard so a future phone-flow re-triggers correctly
            _mobileOTPSentForPhone = null;

            if (allProfTake || isUsaIp) {
                setModalVisible(true);
                dispatch(chooseStatecardRequest({}));
            } else {
                setGtprof(false);
                setNoload(true);
                setTimeout(async () => {
                    const token = await AsyncStorage.getItem(constants.TOKEN);
                    const objToken = { token: token || AuthReducer?.loginsiginResponse?.token, key: {} };
                    dispatch(dashMbRequest(objToken));
                }, 10);
            }
        }
    }, [AuthReducer.status]);

    // ─── Dashboard status handler — open modal after dashMbSuccess ────────────
    useEffect(() => {
        if (DashboardReducer.status === prevDashStatus.current) return;
        prevDashStatus.current = DashboardReducer.status;

        if (DashboardReducer.status === 'Dashboard/dashMbSuccess') {
            const wholeLN = DashboardReducer.dashMbResponse?.data?.licensures;
            const uniqueStates = wholeLN?.filter((state, index, self) =>
                index === self.findIndex(s =>
                    s.state_id === state.state_id && s.board_id === state.board_id
                )
            );

            setFulldashbaord(uniqueStates);

            if (!allProfTake) {
                setModalVisible(true);
                setNoload(false);
            }

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
                const profInfo = DashboardReducer?.mainprofileResponse?.professional_information ||
                    AuthReducer?.signupResponse?.user || {};
                const profLabel = profInfo.profession && profInfo.profession_type
                    ? `${profInfo.profession} - ${profInfo.profession_type}`
                    : null;
                licHandl(profLabel);
            }
        }
    }, [DashboardReducer.status]);

    // ─── OTP input handlers ───────────────────────────────────────────────────
        /**
 * Handles change.
 * @param {*} text - Input value.
 * @param {number} index - Input value.
 * @returns {void}
 */
const handleChange = (text, index) => {
        if (text?.length > 1) {
            const pasted = text.replace(/[^0-9]/g, '');
            const newOtp = [...otpmobile];
            let lastIndex = index;
            for (let i = 0; i < pasted.length && index + i < 6; i++) {
                newOtp[index + i] = pasted[i];
                lastIndex = index + i;
            }
            setOtpmobile(newOtp);
            inputsmobile.current[lastIndex < 5 ? lastIndex + 1 : lastIndex]?.focus();
            return;
        }
        const updated = [...otpmobile];
        updated[index] = text;
        setOtpmobile(updated);
        if (text && index < 5) inputsmobile.current[index + 1]?.focus();
    };

        /**
 * Handles key press.
 * @param {Object} props - Input object.
 * @param {*} props.nativeEvent - Nested property value.
 * @param {number} index - Input value.
 * @returns {void}
 */
const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === 'Backspace') {
            if (otpmobile[index] === '') {
                if (index > 0) inputsmobile.current[index - 1]?.focus();
            } else {
                const updated = [...otpmobile];
                updated[index] = '';
                setOtpmobile(updated);
            }
        }
    };

        /**
 * Clear all otpfields mobile utility.
 * @returns {void}
 */
const clearAllOTPFieldsMobile = () => {
        setOtpmobile(new Array(6).fill(''));
        inputsmobile.current[0]?.focus();
    };

    // ─── Verify OTP ───────────────────────────────────────────────────────────
        /**
 * Verify handlevalid utility.
 * @returns {void}
 */
const verifyHandlevalid = () => {
        const obj = { verify_type: 'phone' };
        connectionrequest()
            .then(() => dispatch(verifymobileRequest(obj)))
            .catch(err => showErrorAlert('Please connect to internet', err));
    };

        /**
 * Verify handle utility.
 * @returns {void}
 */
const verifyHandle = () => {
        const enteredOTP = otpmobile.join('');
        let serverOTP;
        if (mobiletrue && AuthReducer?.resendmobileotpResponse?.phone_otp) {
            serverOTP = AuthReducer.resendmobileotpResponse.phone_otp;
        } else if (props?.route?.params?.Newphone?.Verifycell) {
            serverOTP = props.route.params.Newphone.Verifycell;
        } else {
            serverOTP = AuthReducer?.resendemailotpResponse?.phone_otp;
        }

        if (enteredOTP == serverOTP) {
            verifyHandlevalid();
        } else {
            showErrorAlert('Invalid OTP. Please try again.');
        }
    };

        /**
 * Toggle modal utility.
 * @returns {*}
 */
const toggleModal = () => setModalVisible(v => !v);

    // ─── Helper API dispatchers ───────────────────────────────────────────────
        /**
 * State dashboard data utility.
 * @param {*} id - Input value.
 * @returns {void}
 */
const stateDashboardData = (id) => {
        connectionrequest()
            .then(() => dispatch(stateDashboardRequest({ state_id: id })))
            .catch(err => showErrorAlert('Please connect to internet', err));
    };

        /**
 * State report utility.
 * @param {*} id - Input value.
 * @returns {void}
 */
const stateReport = (id) => {
        connectionrequest()
            .then(() => dispatch(stateReportingRequest({ state_id: id })))
            .catch(err => showErrorAlert('Please connect to internet', err));
    };

        /**
 * Lic handl utility.
 * @param {*} prof - Input value.
 * @returns {void}
 */
const licHandl = (prof) => {
        connectionrequest()
            .then(() => dispatch(licesensRequest(prof)))
            .catch(err => showErrorAlert('Please connect to Internet', err));
    };

    // ─── Derived values ───────────────────────────────────────────────────────
    const validHandles = useMemo(() => new Set(['Physician - MD', 'Physician - DO', 'Physician - DPM']), []);

    const profFromRoute = props?.route?.params?.validPh?.profall ?? null;

    const profFromDashboard = useMemo(() => {
        const pi = DashboardReducer?.mainprofileResponse?.professional_information;
        return pi?.profession && pi?.profession_type
            ? `${pi.profession} - ${pi.profession_type}`
            : null;
    }, [DashboardReducer?.mainprofileResponse]);

    const allProfTake = validHandles.has(profFromRoute) || validHandles.has(profFromDashboard);

    const isEnabledMobile = countdown > 0;

    const phoneDetect =
        props?.route?.params?.Newphone?.phone ||
        props?.route?.params?.Newphone?.allNo ||
        props?.route?.params?.validPh?.validPh ||
        (typeof props?.route?.params?.validPh === 'string' ? props?.route?.params?.validPh : '') ||
        AuthReducer?.loginResponse?.user?.phone ||
        AuthReducer?.againloginsiginResponse?.user?.phone ||
        AuthReducer?.signupResponse?.user?.phone ||
        AuthReducer?.verifymobileResponse?.user?.phone ||
        AuthReducer?.verifyResponse?.phone ||
        props?.route?.params?.validPh?.cellno ||
        props?.route?.params?.newPh ||
        props?.route?.params?.mobileNo?.mobileNo ||
        DashboardReducer?.mainprofileResponse?.user_address?.contact_no ||
        props?.route?.params?.Newphone?.phoneCode ||
        allotpcheckddd;

    const phoneCode =
        props?.route?.params?.validPh?.phonecode ||
        props?.route?.params?.mobileNo?.phoneCode ||
        props?.route?.params?.Newphone?.allNo ||
        '';

    const isUsaPhoneCode = isUsaCountryCode(phoneCode) || String(phoneCode || '').trim().toUpperCase().startsWith('+1');
    const phoneFinal = formatDisplayPhoneNumber(phoneDetect, phoneCode, isUsaIp || isUsaPhoneCode);

    useEffect(() => {
        if (phoneDetect?.startsWith('+')) {
            setFinalCode(processPhoneNumber(phoneDetect));
        }
    }, [phoneDetect]);

    const renewalLink = useMemo(() =>
        DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link || null,
        [DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link]
    );
    useEffect(() => { setRenewal(renewalLink); }, [renewalLink]);

    const filteredStates = useMemo(() => {
        if (!AuthReducer?.licesensResponse?.licensure_states) return [];
        const existingIds = new Set(Array.isArray(fulldashbaord) ? fulldashbaord.map(d => d.state_id) : []);
        const stateMap = new Map();
        AuthReducer.licesensResponse.licensure_states.forEach(s => {
            if (!stateMap.has(s.id)) stateMap.set(s.id, s);
        });
        return Array.from(stateMap.values()).filter(s => !existingIds.has(s.id));
    }, [AuthReducer?.licesensResponse, fulldashbaord]);

    useEffect(() => { setStateCount(filteredStates); }, [filteredStates]);

    const isPrimeTrial = useMemo(() =>
        isPrimeSubscriptionMissing(WebcastReducer?.PrimeCheckResponse),
        [WebcastReducer?.PrimeCheckResponse]
    );

    const hasWalletBalance = useMemo(() => {
        const numeric = Number(String(WebcastReducer?.walletCheckResponse?.balance || '0').replace(/,/g, ''));
        return numeric > 0;
    }, [WebcastReducer?.walletCheckResponse?.balance]);

    const profMerge = useMemo(() => {
        if (isPrimeTrial || hasWalletBalance) return 'freetrail';
        return allProfTake ? 'nochange' : 'duplicate';
    }, [isPrimeTrial, hasWalletBalance, allProfTake]);

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
                            AuthReducer?.status === 'Auth/verifymobileRequest' ||
                            noload ||
                            AuthReducer?.status === 'Auth/resendmobileotpRequest'
                        }
                    />

                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{'Verify Cell Number'}</Text>

                        <View style={{ flexDirection: 'column', marginTop: normalize(15) }}>
                            <Text style={styles.subHeaderText}>
                                {'A 6-digit code has been sent to'}
                            </Text>

                            <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
                                <Text style={[styles.subHeaderText, { fontWeight: 'bold' }]}>
                                    {phoneFinal && phoneFinal === '+91'
                                        ? DashboardReducer?.mainprofileResponse?.user_address?.contact_no
                                        : phoneFinal}
                                </Text>
                                <TouchableOpacity
                                    disabled={countdown !== 0}
                                    onPress={() => {
                                        props.navigation.navigate('LoginMobileChange', {
                                            Newphone: {
                                                Newphone: phoneDetect === '+91'
                                                    ? DashboardReducer?.mainprofileResponse?.user_address?.contact_no
                                                    : phoneDetect || props?.route?.params?.validPh ||
                                                    finalCode?.nationalNumber ||
                                                    props?.route?.params?.newPh ||
                                                    props?.route?.params?.mobileNo?.mobileNo ||
                                                    props?.route?.params?.validPh?.cellno,
                                                phonoCd: finalCode,
                                                PhoneCdO: props?.route?.params?.validPh?.phonecode ||
                                                    props?.route?.params?.mobileNo?.phoneCode ||
                                                    props?.route?.params?.Newphone?.phoneCode,
                                            },
                                        });
                                        clearAllOTPFieldsMobile();
                                    }}
                                >
                                    <Text style={[styles.subHeaderText, {
                                        textDecorationLine: 'underline',
                                        color: countdown === 0 ? Colorpath.ButtonColr : '#DADADA',
                                    }]}>
                                        {'Change'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', flex: 0.3 }}>
                        <View style={styles.inputContainer}>
                            {otpmobile.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    placeholder="0"
                                    placeholderTextColor={Colorpath.locText}
                                    ref={(ref) => (inputsmobile.current[index] = ref)}
                                    value={digit}
                                    onChangeText={(text) => handleChange(text.replace(/[^0-9]/g, ''), index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    style={styles.input}
                                    autoFocus={index === 0}
                                    textAlign="center"
                                    textContentType="oneTimeCode"
                                    autoComplete="sms-otp"
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
                                    // Reset module-level guard so user can manually resend
                                    _mobileOTPSentForPhone = null;
                                    dispatchResendMobileOTP();
                                    resendMobile();
                                    setMobiletrue(true);
                                    clearAllOTPFieldsMobile();
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
                                backgroundColor={isEnabledMobile ? Colorpath.ButtonColr : '#CCC'}
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
                                content={'Your cell number has been \n successfully verified'}
                                navigation={props.navigation}
                                name={(DashboardReducer?.mainprofileResponse?.licensures?.[0]?.license_number || AuthReducer?.verifymobileResponse?.user?.license_number || !allProfTake) ? "TabNav" : (AuthReducer?.chooseStatecardResponse?.state_licensures?.length > 0 ? "ChooseState" : "CreateStateInfor")}
                                profMerge={profMerge}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </>
    );
};

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.35,
        marginHorizontal: normalize(20),
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 30,
        color: '#000000',
        marginTop: normalize(10),
        justifyContent: 'center',
        textAlign: 'center',
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
        color: '#000000',
        fontFamily: Fonts.InterMedium,
    },
});

/**
 * Login mobile default export.
 *
 * @returns {*}
 */
export default LoginMobile;
