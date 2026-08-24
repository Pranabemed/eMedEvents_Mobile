/**
 * Verify mobile otp screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, status1, GUEST_REGISTRATION_FLOW_KEY, GUEST_PRIME_VERIFICATION_PENDING_KEY, PRIME_MEMBERSHIP_SKIPPED_KEY, PRIME_CARD_FLOW_COMPLETE_KEY, VerifyMobileOTP, token_error_otp, handleChange, handleKeyPress, token_handle, toggleModal, verifyHandlevalid, resendMobileOTP, clearAllOTPFieldsMobile, stateDashboardData, stateReport, licHandl, verifyHandle, onBackPress, styles.
 */

import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, TextInput, StyleSheet, Alert, Image, BackHandler } from 'react-native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { chooseStatecardRequest, licesensRequest, resendmobileotpRequest, verifyRequest, verifymobileRequest } from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { CommonActions, useIsFocused } from '@react-navigation/native';
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
import { clearNonUsaFlowState, isUsaCountryCode } from '../../Utils/Helpers/nonUsaFlow';
import { isPrimeSubscriptionMissing } from '../../Utils/Helpers/primeSubscription';
import { getCountryAndDialCode } from '../../Utils/Helpers/IPServer';

/**
 * Reusable VerifyMobileOTP component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
let status = "";
/**
 * Status1 string constant.
 * @returns {string}
 */
let status1 = "";
/**
 * Guest registration flow key constant.
 * @returns {string}
 */
const GUEST_REGISTRATION_FLOW_KEY = 'GUEST_REGISTRATION_FLOW';
/**
 * Guest prime verification pending key constant.
 * @returns {string}
 */
const GUEST_PRIME_VERIFICATION_PENDING_KEY = 'GUEST_PRIME_VERIFICATION_PENDING';
/**
 * Guest verification completed key constant.
 * @returns {string}
 */
const GUEST_VERIFICATION_COMPLETED_KEY = 'GUEST_VERIFICATION_COMPLETED';
/**
 * Prime membership skipped key constant.
 * @returns {string}
 */
const PRIME_MEMBERSHIP_SKIPPED_KEY = 'PrimeMembershipSkipped';
/**
 * Prime card flow complete key constant.
 * @returns {string}
 */
const PRIME_CARD_FLOW_COMPLETE_KEY = 'PrimeCardFlowComplete';
/**
 * Validates the primary license record.
 * @param {*} license - Input value.
 * @returns {boolean}
 */
const hasValidLicenseRecord = (license) => {
    const licenseNumber = String(license?.license_number || '').trim();
    const fromDate = String(license?.from_date || '').trim();
    return Boolean(licenseNumber && fromDate && fromDate !== '0000-00-00');
};

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
 * Verify mobile otp component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
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

    const [isUsaIp, setIsUsaIp] = useState(false);

    useEffect(() => {
        if (!isFocus) return;

        let isActive = true;
        getCountryAndDialCode().then(info => {
            if (!isActive) return;
            const country = String(info?.country || info?.country_code || info?.countryCode || '').toUpperCase();
            setIsUsaIp(isUsaCountryCode(country));
        }).catch(err => console.log('VerifyMobileOTP IP lookup error:', err));

        return () => {
            isActive = false;
        };
    }, [isFocus]);
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
    const currentLicenseRecord =
        DashboardReducer?.mainprofileResponse?.licensures?.[0] ||
        DashboardReducer?.dashMbResponse?.data?.licensures?.[0] ||
        AuthReducer?.verifymobileResponse?.user?.licensures?.[0] ||
        {};
    const hasCurrentValidLicenseInfo = hasValidLicenseRecord(currentLicenseRecord);
    useEffect(() => {
        if (AuthReducer?.signupResponse?.token) {
            let objToken = { "token": AuthReducer?.signupResponse?.token, "key": {} }
            connectionrequest()
                .then(async () => {
                    await AsyncStorage.setItem(constants.GUEST_PRIME_USER, JSON.stringify(stableGuestPrimeUser));
                    await AsyncStorage.setItem('activeProfile', 'PrimeCard');
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
        /**
* Token error otp utility.
* @returns {void}
*/
        const token_error_otp = () => {
            setTimeout(async () => {
                const loginHandleProccess = await AsyncStorage.getItem(constants.TOKEN);
                let objToken = { "token": loginHandleProccess, "key": {} }
                if (loginHandleProccess) {
                    await AsyncStorage.setItem(constants.GUEST_PRIME_USER, JSON.stringify(stableGuestPrimeUser));
                    await AsyncStorage.setItem('activeProfile', 'PrimeCard');
                }
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
    }, [isFocus, stableGuestPrimeUser]);
    console.log(DashboardReducer?.mainprofileResponse, "mainprofile---------", props?.route?.params)
    /**
* Handles change.
* @param {*} text - Input value.
* @param {number} index - Input value.
* @returns {void}
*/
    const handleChange = (text, index) => {
        if (text?.length > 1) {
            setOtpmobile(prevOtp => {
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
                    inputsmobile.current[focusIndex]?.focus();
                }, 10);
                return newOtp;
            });
            return;
        }

        setOtpmobile(prevOtp => {
            const updatedOtp = [...prevOtp];
            updatedOtp[index] = text;
            return updatedOtp;
        });

        if (text && index < 5) {
            inputsmobile.current[index + 1]?.focus();
        }
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
                if (index > 0) inputsmobile.current[index - 1].focus();
            } else {
                const updatedOtp = [...otpmobile];
                updatedOtp[index] = '';
                setOtpmobile(updatedOtp);
            }
        }
    };
    useEffect(() => {
        /**
* Token handle utility.
* @returns {void}
*/
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
        return () => clearInterval(timerRef.current);
    }, []);

    const resendMobile = useCallback(() => {
        startNewTimer(300);
    }, [startNewTimer]);
    const [isModalVisible, setModalVisible] = useState(false);
    /**
* Toggle modal utility.
* @returns {void}
*/
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const autoResendHandledRef = useRef(false);
    /**
* Verify handlevalid utility.
* @returns {void}
*/
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
    /**
* Resend mobile otp utility.
* @returns {void}
*/
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
    /**
* Clear all otpfields mobile utility.
* @returns {void}
*/
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
                setNoload(false);
                (async () => {
                    await clearNonUsaFlowState();
                    const token = await AsyncStorage.getItem(constants.TOKEN);
                    if (token) {
                        dispatch(verifyRequest({ token, key: {} }));
                    }
                    const guestFlowRaw = await AsyncStorage.getItem(GUEST_REGISTRATION_FLOW_KEY);
                    const guestFlow = guestFlowRaw ? JSON.parse(guestFlowRaw) : null;
                    const verifiedUser = AuthReducer?.verifymobileResponse?.user || {};
                    const primaryLicense =
                        DashboardReducer?.mainprofileResponse?.licensures?.[0] ||
                        verifiedUser?.licensures?.[0] ||
                        verifiedUser ||
                        {};
                    const hasValidLicenseInfo = hasValidLicenseRecord(primaryLicense);
                    await Promise.all([
                        AsyncStorage.removeItem(GUEST_PRIME_VERIFICATION_PENDING_KEY),
                        AsyncStorage.setItem(GUEST_VERIFICATION_COMPLETED_KEY, 'true'),
                    ]);

                    if (guestFlow && !hasValidLicenseInfo) {
                        await Promise.all([
                            AsyncStorage.removeItem(GUEST_REGISTRATION_FLOW_KEY),
                            AsyncStorage.removeItem('IS_GUEST_CONVERTED_USER'),
                            AsyncStorage.removeItem('PLAYERSESSION'),
                        ]);
                        props.navigation.navigate("CreateStateInfor", {
                            dataVerify: {
                                dataVerify: "Nodasta",
                                allDat: verifiedUser,
                            }
                        });
                        return;
                    }

                    if (guestFlow && hasValidLicenseInfo) {
                        await Promise.all([
                            AsyncStorage.removeItem(GUEST_REGISTRATION_FLOW_KEY),
                            AsyncStorage.removeItem('IS_GUEST_CONVERTED_USER'),
                            AsyncStorage.removeItem('PLAYERSESSION'),
                        ]);
                        setNoload(false);
                        props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }));
                        return;
                    }

                    if (allProfTake || isUsaIp) {
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
                })().catch(error => {
                    console.log('guest verify redirect error', error);
                });
                break;
            case 'Auth/verifymobileFailure':
                status = AuthReducer.status;
                setNoload(false);
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
                const firstLicense =
                    DashboardReducer?.mainprofileResponse?.licensures?.[0] ||
                    DashboardReducer?.dashMbResponse?.data?.licensures?.[0] ||
                    {};
                const hasValidLicenseInfo = hasValidLicenseRecord(firstLicense);
                const uniqueStates = DashboardReducer?.dashMbResponse?.data?.licensures?.filter((state, index, self) => {
                    return index === self.findIndex((s) =>
                        s.state_id === state.state_id &&
                        s.board_id === state.board_id
                    );
                });
                if (hasValidLicenseInfo) {
                    setNoload(false);
                    setGtprof(false);
                    setFulldashbaord(uniqueStates || []);
                    props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }));
                    break;
                } else {
                    setNoload(false);
                    if (!allProfTake) {
                        toggleModal();
                    }
                    setFulldashbaord(uniqueStates || []);
                    break;
                }
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
            const firstLicense =
                DashboardReducer?.mainprofileResponse?.licensures?.[0] ||
                wholeLN?.[0] ||
                {};
            const hasValidLicenseInfo = hasValidLicenseRecord(firstLicense);
            if (hasValidLicenseInfo) {
                setFulldashbaord(uniqueStates);
            }
            if (hasValidLicenseInfo && uniqueStates?.length > 0) {
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
    /**
* State dashboard data utility.
* @param {*} id - Input value.
* @returns {void}
*/
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
    /**
* State report utility.
* @param {*} did - Input value.
* @returns {void}
*/
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
    /**
* Lic handl utility.
* @param {*} profFromDashboard - Input value.
* @returns {void}
*/
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
    /**
* Verify handle utility.
* @returns {void}
*/
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
            setNoload(true);
            verifyHandlevalid();
        } else {
            showErrorAlert("Invalid OTP. Please try again.");
        }
    };
    const isEnabledMobile = countdown > 0;
    const phoneDetect =
        props?.route?.params?.Newphone?.phone ||
        props?.route?.params?.Newphone?.allNo ||
        (typeof props?.route?.params?.Newphone === 'string' ? props?.route?.params?.Newphone : '') ||
        AuthReducer?.changephoneResponse?.phone ||
        AuthReducer?.changephoneResponse?.mobile ||
        AuthReducer?.changephoneResponse?.phone_number ||
        allotpcheckddd ||
        props?.route?.params?.validPh?.validPh ||
        (typeof props?.route?.params?.validPh === 'string' ? props?.route?.params?.validPh : '') ||
        props?.route?.params?.validPh?.cellno ||
        AuthReducer?.loginResponse?.user?.phone ||
        AuthReducer?.againloginsiginResponse?.user?.phone ||
        AuthReducer?.signupResponse?.user?.phone ||
        AuthReducer?.verifymobileResponse?.user?.phone ||
        AuthReducer?.verifyResponse?.phone ||
        props?.route?.params?.newPh ||
        props?.route?.params?.mobileNo?.mobileNo ||
        props?.route?.params?.Newphone?.phoneCode;

    const phoneCodeDetect = props?.route?.params?.Newphone?.phoneCode || props?.route?.params?.validPh?.phonecode || props?.route?.params?.mobileNo?.phoneCode || '';
    console.log(phoneDetect, "phonedetect=========", AuthReducer)
    const isUsaPhoneCode = isUsaCountryCode(phoneCodeDetect) || String(phoneCodeDetect || '').trim().toUpperCase().startsWith('+1');
    const phoneFinal = formatDisplayPhoneNumber(phoneDetect, phoneCodeDetect, isUsaIp || isUsaPhoneCode);
    useEffect(() => {
        if (phoneDetect?.startsWith('+')) {
            const finalget = processPhoneNumber(phoneDetect);
            setFinalCode(finalget);
            console.log(finalget, "finalget-------------")
        }
    }, [phoneDetect])
    useEffect(() => {
        /**
* On back press utility.
* @returns {boolean}
*/
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
    useEffect(() => {
        if (!props?.route?.params?.forceResend) return;
        if (autoResendHandledRef.current) return;
        autoResendHandledRef.current = true;
        setTimeout(() => {
            resendMobileOTP();
            resendMobile();
            setMobiletrue(true);
            clearAllOTPFieldsMobile();
        }, 200);
    }, [props?.route?.params?.forceResend, resendMobile]);
    const isPrimeTrial = useMemo(() => {
        return isPrimeSubscriptionMissing(WebcastReducer?.PrimeCheckResponse);
    }, [WebcastReducer?.PrimeCheckResponse]);

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
                style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                    <Loader
                        visible={AuthReducer?.status == 'Auth/verifymobileRequest' || noload || AuthReducer?.status == 'Auth/resendmobileotpRequest'} />
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
                                    editable={true}
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
                                name={(hasValidLicenseRecord(DashboardReducer?.mainprofileResponse?.licensures?.[0]) || hasValidLicenseRecord(AuthReducer?.verifymobileResponse?.user?.licensures?.[0]) || hasValidLicenseRecord(AuthReducer?.verifymobileResponse?.user) || !allProfTake) ? "TabNav" : (AuthReducer?.chooseStatecardResponse?.state_licensures?.length > 0 ? "ChooseState" : "CreateStateInfor")}
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

/**
 * Verify mobile otp default export.
 *
 * @returns {*}
 */
export default VerifyMobileOTP;
