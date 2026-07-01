/**
 * Splash screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status1, GUEST_REGISTRATION_FLOW_KEY, GUEST_PRIME_VERIFICATION_PENDING_KEY, PRIME_MEMBERSHIP_SKIPPED_KEY, PRIME_CARD_FLOW_COMPLETE_KEY, DEEPLINK_BOOTSTRAP_KEY, INVALID_TOKEN_MESSAGES, isVerifiedFlag, getTokenErrorMessage, isInvalidTokenFailure, isEmedDeepLink, detectCountry, resetToSafeEntry, handleNavigation, token_error, token_handle, stateDashboardData, stateReport, licHandl, navigateToVerification, styles.
 */

import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, View, Text, Linking } from 'react-native';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { chooseStatecardRequest, headerRequest, licesensRequest, tokenRequest, verifyRequest } from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { dashboardRequest, mainprofileRequest, stateDashboardRequest, stateReportingRequest } from '../../Redux/Reducers/DashboardReducer';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import { AppContext } from '../GlobalSupport/AppContext';
import LottieView from 'lottie-react-native';
import TokenManager from '../../Utils/Helpers/TokenManager';
import { isNonUsaAccount, readNonUsaFlowState, readNonUsaPermanentFlags, clearNonUsaFlowState } from '../../Utils/Helpers/nonUsaFlow';
import { getCountryAndDialCode } from '../../Utils/Helpers/IPServer';
import { loginSuccess, signupSuccess, tokenSuccess } from '../../Redux/Reducers/AuthReducer';

/**
 * Reusable Splash component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
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
 * Deeplink bootstrap key constant.
 * @returns {string}
 */
const DEEPLINK_BOOTSTRAP_KEY = 'DEEPLINK_BOOTSTRAP';
/**
 * Invalid token messages constant.
 * @returns {Array}
 */
const INVALID_TOKEN_MESSAGES = [
  'missing or invalid token',
  'invalid token',
  'missing token',
  'token expired',
  'token is expired',
];

/**
 * Determines whether verified flag is true.
 * @param {*} value - Input value.
 * @returns {*}
 */
const isVerifiedFlag = (value) => value == "1" || value == 1 || value === true;
/**
 * Returns token error message.
 * @param {*} value - Input value.
 * @returns {*}
 */
const getTokenErrorMessage = (value) => (
  value?.data?.msg ||
  value?.data?.message ||
  value?.msg ||
  value?.message ||
  ''
).toLowerCase().trim();
/**
 * Determines whether invalid token failure is true.
 * @param {*} value - Input value.
 * @returns {*}
 */
const isInvalidTokenFailure = (value) => {
  const msg = getTokenErrorMessage(value);
  return INVALID_TOKEN_MESSAGES.some(pattern => msg === pattern || msg.startsWith(pattern));
};

/**
 * Determines whether emed deep link is true.
 * @param {*} url - Input value.
 * @returns {*}
 */
const isEmedDeepLink = (url) => {
  if (!url || typeof url !== 'string') return false;
  const lowerUrl = url.toLowerCase().trim();
  return lowerUrl.includes('emedevents.com') || lowerUrl.includes('emedevents.net');
};

/**
 * Splash default export.
 *
 * @returns {*}
 */
export default function Splash(props) {
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
    setFinddata,
    stateCount
  } = useContext(AppContext);

  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const DashboardReducer = useSelector(state => state.DashboardReducer);
  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [spalsh, setSplash] = useState("");
  const isFocus = useIsFocused();
  const [emaiV, setEmaiV] = useState("");
  const [phoneV, setPhoneV] = useState("");
  const [guestRegistrationFlowActive, setGuestRegistrationFlowActive] = useState(false);
  const [guestHomeGateActive, setGuestHomeGateActive] = useState(false);
  const [hasAuthToken, setHasAuthToken] = useState(false);
  const [deepLinkBootstrapActive, setDeepLinkBootstrapActive] = useState(false);
  const [nonUsaState, setNonUsaState] = useState(null);
  const [nonUsaPermanentFlags, setNonUsaPermanentFlags] = useState({
    professionUpdateRequired: false,
    stateLicenseFlowCompleted: false,
  });
  const [bootstrapChecked, setBootstrapChecked] = useState(false);
  const [professionState, setProfessionState] = useState(null);
  const [isGuestConvertedUser, setIsGuestConvertedUser] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState(null);
  const [loadingCountry, setLoadingCountry] = useState(true);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const hasNavigatedRef = useRef(false);
  const startupRequestedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
        /**
 * Detect country utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const detectCountry = async () => {
      try {
        const geoInfo = await getCountryAndDialCode();
        if (mounted && geoInfo) {
          const ipCountry = String(geoInfo.country || '').trim().toUpperCase();
          setDetectedCountry(ipCountry);
        }
        if (mounted) setLoadingCountry(false);
      } catch (error) {
        console.log('[Splash] geo lookup failed', error);
        if (mounted) setLoadingCountry(false);
      }
    };
    detectCountry();
    return () => {
      mounted = false;
    };
  }, []);

    /**
 * Reset to safe entry utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const resetToSafeEntry = async () => {
    try {
      const playerSession = await AsyncStorage.getItem('PLAYERSESSION');
      await Promise.all([
        AsyncStorage.removeItem(constants.TOKEN),
        AsyncStorage.removeItem(constants.REFRESH_TOKEN),
        AsyncStorage.removeItem(constants.VERIFYSTATEDATA),
        AsyncStorage.removeItem(constants.EMAVER),
        AsyncStorage.removeItem(constants.MOBVER),
      ]);

      if (!playerSession) {
        await AsyncStorage.removeItem('PLAYERSESSION');
      }

      if (hasNavigatedRef.current) return;
      hasNavigatedRef.current = true;

      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: playerSession ? "GuestUser" : "Onboard" }]
        })
      );
    } catch (error) {
      console.log('[Splash] Failed to clear auth state:', error);
    }
  };

  useEffect(() => {
        /**
 * Handles navigation.
 *
 * @async
 * @returns {Promise<*>}
 */
const handleNavigation = async () => {
      try {
        const [
          emaileer,
          mobilevr,
          currentToken,
          playerSession,
          guestFlowRaw,
          guestPrimePendingRaw,
          primeMembershipSkippedRaw,
          primeCardFlowCompleteRaw,
          deepLinkBootstrapRaw,
          initialUrl,
          nonUsaFlowState,
          nonUsaPermanentFlagsRaw,
          professionRaw,
          isGuestConvertedUserRaw,
        ] = await Promise.all([
          AsyncStorage.getItem(constants.EMAVER),
          AsyncStorage.getItem(constants.MOBVER),
          AsyncStorage.getItem(constants.TOKEN),
          AsyncStorage.getItem('PLAYERSESSION'),
          AsyncStorage.getItem(GUEST_REGISTRATION_FLOW_KEY),
          AsyncStorage.getItem(GUEST_PRIME_VERIFICATION_PENDING_KEY),
          AsyncStorage.getItem(PRIME_MEMBERSHIP_SKIPPED_KEY),
          AsyncStorage.getItem(PRIME_CARD_FLOW_COMPLETE_KEY),
          AsyncStorage.getItem(DEEPLINK_BOOTSTRAP_KEY),
          Linking.getInitialURL(),
          readNonUsaFlowState(),
          readNonUsaPermanentFlags(),
          AsyncStorage.getItem(constants.PROFESSION),
          AsyncStorage.getItem('IS_GUEST_CONVERTED_USER'),
        ]);
        const emailEver = emaileer ? JSON.parse(emaileer) : null;
        const mobileEver = mobilevr ? JSON.parse(mobilevr) : null;
        const professionData = professionRaw ? JSON.parse(professionRaw) : null;
        setNonUsaState(nonUsaFlowState);
        setNonUsaPermanentFlags(nonUsaPermanentFlagsRaw || {
          professionUpdateRequired: false,
          stateLicenseFlowCompleted: false,
        });
        setProfessionState(professionData);
        setEmaiV(emailEver);
        setPhoneV(mobileEver);
        setGuestRegistrationFlowActive(Boolean(guestFlowRaw));
        setGuestHomeGateActive(
          Boolean(guestFlowRaw) ||
          guestPrimePendingRaw === 'true' ||
          primeMembershipSkippedRaw === 'true' ||
          primeCardFlowCompleteRaw === 'true'
        );
        setDeepLinkBootstrapActive(Boolean(deepLinkBootstrapRaw) || isEmedDeepLink(initialUrl));
        setIsGuestConvertedUser(isGuestConvertedUserRaw === 'true');

        if (!nonUsaFlowState?.isNonUsa && !currentToken && !playerSession && !hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Onboard' }],
            })
          );
          return;
        }

        if (nonUsaFlowState?.isNonUsa && !currentToken) {
          const draft = nonUsaFlowState?.signupDraft || {};
          const nonUsaEmail = draft?.email || nonUsaFlowState?.email || '';
          const nonUsaProfessionDone = nonUsaFlowState?.professionCompleted === true;
          const nonUsaEmailVerified = nonUsaFlowState?.emailVerified === true;

          if (!nonUsaProfessionDone) {
            if (!hasNavigatedRef.current) {
              hasNavigatedRef.current = true;
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'AllSpecial', params: { Alldata: { ...draft, isNonUsaUser: true } } }],
                })
              );
            }
            return;
          }

          if (!nonUsaEmailVerified) {
            if (!hasNavigatedRef.current) {
              hasNavigatedRef.current = true;
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{
                    name: 'VerifyOTPEmail',
                    params: {
                      nonUsaUser: true,
                      newMail: nonUsaEmail,
                      NewEmail: {
                        email: nonUsaEmail,
                        returnDat: draft,
                      },
                      verifyemail: {
                        verifyemail: draft,
                        isNonUsaUser: true,
                      },
                    },
                  }],
                })
              );
            }
            return;
          }

          if (!hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Onboard' }],
              })
            );
          }
          return;
        }
      } catch (error) {
        console.error('Error handling navigation:', error);
      }
    };
    handleNavigation();
  }, [isFocus]);

  useEffect(() => {
    dispatch(headerRequest());
  }, [dispatch]);

  useEffect(() => {
        /**
 * Token error utility.
 * @returns {void}
 */
const token_error = () => {
      setTimeout(async () => {
        try {
          const initialUrl = await Linking.getInitialURL();
          if (deepLinkBootstrapActive || isEmedDeepLink(initialUrl)) {
            console.log('[Splash] Deep link launch detected, bypassing token_error reset');
            setBootstrapChecked(true);
            return;
          }

          const currentToken = await AsyncStorage.getItem(constants.TOKEN);
          const guestFlowRaw = await AsyncStorage.getItem(GUEST_REGISTRATION_FLOW_KEY);
          const hasGuestRegistrationFlow = Boolean(guestFlowRaw);
          const persistedAuthRaw = await AsyncStorage.getItem(constants.AUTH_USER_DATA);
          if (persistedAuthRaw && (!AuthReducer?.loginResponse || Object.keys(AuthReducer.loginResponse || {}).length === 0)) {
            try {
              const persistedAuthData = JSON.parse(persistedAuthRaw);
              if (persistedAuthData) {
                dispatch(loginSuccess(persistedAuthData));
                dispatch(signupSuccess(persistedAuthData));
              }
            } catch (error) {
              console.log('[Splash] Failed to restore persisted auth data:', error);
            }
          }

          if (hasGuestRegistrationFlow && !currentToken) {
            setHasAuthToken(false);
            setBootstrapChecked(true);
            if (!hasNavigatedRef.current) {
              hasNavigatedRef.current = true;
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'GuestUser' }],
                })
              );
            }
            return;
          }

          const loginHandleProccess = await TokenManager.ensureValidToken('splash-bootstrap');
          setHasAuthToken(Boolean(loginHandleProccess));
          if (loginHandleProccess) {
            dispatch(tokenSuccess(loginHandleProccess));
          }
          setBootstrapChecked(true);

          if (loginHandleProccess) {
            startupRequestedRef.current = true;
            let objToken = { "token": loginHandleProccess, "key": {} };
            setLoadingVerify(true);
            connectionrequest()
              .then(() => {
                dispatch(tokenRequest(objToken));
                dispatch(mainprofileRequest(objToken));
                dispatch(chooseStatecardRequest(objToken));
                dispatch(dashboardRequest(objToken));
                dispatch(verifyRequest(objToken));
                setLoadingDashboard(true);
              })
              .catch((err) => {
                showErrorAlert("Please connect to internet", err);
                setLoadingVerify(false);
              });
          } else {
            const playerSession = await AsyncStorage.getItem('PLAYERSESSION');
            if (playerSession) {
              if (!hasNavigatedRef.current) {
                hasNavigatedRef.current = true;
                props.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'GuestUser' }],
                  })
                );
              }
            } else {
              setTimeout(() => {
                resetToSafeEntry();
              }, 500);
            }
          }
        } catch (error) {
          console.log(error);
          setBootstrapChecked(true);
        }
      }, 500);
    };
    try {
      token_error();
    } catch (error) {
      console.log(error);
    }
  }, [deepLinkBootstrapActive, isFocus]);

  useEffect(() => {
    if (AuthReducer?.status === 'Auth/verifySuccess' || AuthReducer?.status === 'Auth/verifyFailure') {
      setLoadingVerify(false);
    }
  }, [AuthReducer?.status]);

  useEffect(() => {
        /**
 * Token handle utility.
 * @returns {void}
 */
const token_handle = () => {
      setTimeout(async () => {
        const loginHandle_verify = await AsyncStorage.getItem(constants.VERIFYSTATEDATA);
        const jsonObject = loginHandle_verify ? JSON.parse(loginHandle_verify) : null;
        setSplash(jsonObject);
      }, 100);
    };

    try {
      token_handle();
    } catch (error) {
      console.log(error);
    }
  }, [isFocus]);

  if (status1 == '' || DashboardReducer.status != status1) {
    switch (DashboardReducer.status) {
      case 'Dashboard/dashboardRequest':
        status1 = DashboardReducer.status;
        break;
      case 'Dashboard/dashboardSuccess':
        status1 = DashboardReducer.status;
        break;
      case 'Dashboard/dashboardFailure':
        status1 = DashboardReducer.status;
        break;
    }
  }

  const profFromDashboard = useMemo(() => {
    const profInfo = DashboardReducer?.mainprofileResponse?.professional_information || AuthReducer?.signupResponse?.user || {};
    return profInfo.profession && profInfo.profession_type
      ? `${profInfo.profession} - ${profInfo.profession_type}`
      : null;
  }, [DashboardReducer?.mainprofileResponse, AuthReducer?.signupResponse]);

  useEffect(() => {
    const data = DashboardReducer?.dashboardResponse?.data;
    if (!data) return;

    if (data?.licensures?.length > 0) {
      const wholeLN = data.licensures;
      const finalPush = wholeLN.map((l) => l?.license_number);
      const uniqueStates = data.licensures.filter((state, index, self) => {
        return index === self.findIndex((s) =>
          s.state_id === state.state_id &&
          s.board_id === state.board_id
        );
      });
      setFulldashbaord(uniqueStates);
      setDashboard(finalPush);
      setLoadingDashboard(false);

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
      }
    } else {
      setDashboard([]);
      setLoadingDashboard(false);
    }
  }, [DashboardReducer?.dashboardResponse?.data]);

  useEffect(() => {
    if (DashboardReducer?.status === 'Dashboard/dashboardFailure') {
      setLoadingDashboard(false);
    }
  }, [DashboardReducer?.status]);

  useEffect(() => {
    if (!startupRequestedRef.current || hasNavigatedRef.current) return;

    const dashboardInvalid = isInvalidTokenFailure(DashboardReducer?.dashboardResponse);
    const verifyInvalid = isInvalidTokenFailure(AuthReducer?.verifyResponse);

    if (dashboardInvalid || verifyInvalid) {
      resetToSafeEntry();
    }
  }, [
    DashboardReducer?.dashboardResponse,
    AuthReducer?.verifyResponse,
  ]);

  useEffect(() => {
    if (!loadingDashboard && profFromDashboard) {
      console.log('[Splash] Triggering licHandl for:', profFromDashboard);
      licHandl(profFromDashboard);
    }
  }, [profFromDashboard, loadingDashboard]);

  const lastStateIdHandledRef = useRef(null);
  const lastReportIdHandledRef = useRef(null);

    /**
 * State dashboard data utility.
 * @param {*} id - Input value.
 * @returns {void}
 */
const stateDashboardData = (id) => {
    if (!id || lastStateIdHandledRef.current === id) return;
    lastStateIdHandledRef.current = id;

    connectionrequest()
      .then(() => dispatch(stateDashboardRequest({ "state_id": id })))
      .catch(err => showErrorAlert("Please connect to internet", err));
  };

    /**
 * State report utility.
 * @param {*} did - Input value.
 * @returns {void}
 */
const stateReport = (did) => {
    if (!did || lastReportIdHandledRef.current === did) return;
    lastReportIdHandledRef.current = did;

    connectionrequest()
      .then(() => dispatch(stateReportingRequest({ "state_id": did })))
      .catch((err) => showErrorAlert("Please connect to internet", err));
  };

  const lastLicHandledRef = useRef(null);

    /**
 * Lic handl utility.
 * @param {*} profFromDashboard - Input value.
 * @returns {void}
 */
const licHandl = (profFromDashboard) => {
    if (!profFromDashboard || lastLicHandledRef.current === profFromDashboard) return;
    lastLicHandledRef.current = profFromDashboard;

    connectionrequest()
      .then(() => dispatch(licesensRequest(profFromDashboard)))
      .catch(err => showErrorAlert('Please connect to Internet', err));
  };

  const renewalLink = useMemo(() => (
    DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link || null
  ), [DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link]);

  useEffect(() => {
    setRenewal(renewalLink);
  }, [renewalLink]);

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

  useEffect(() => {
    if (!bootstrapChecked) return;
    if (hasNavigatedRef.current) return;
    if (loadingDashboard) return;
    if (loadingVerify) return;
    if (loadingCountry) return;

    const loginResponse = AuthReducer?.loginResponse || {};
    const verifyData = AuthReducer?.verifyResponse?.data || AuthReducer?.verifyResponse?.user || AuthReducer?.verifyResponse || {};
    const { is_verified, phone_verified, email, phone } = verifyData;

    const profInfo = DashboardReducer?.mainprofileResponse?.professional_information || AuthReducer?.signupResponse?.user || DashboardReducer?.dashboardResponse?.data?.user_information || {};
    const profFromDashboard = profInfo.profession && profInfo.profession_type
      ? `${profInfo.profession} - ${profInfo.profession_type}`
      : null;
    const stateLicenses = AuthReducer?.chooseStatecardResponse?.state_licensures || [];
    const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
    const allProfTake = validHandles.has(profFromDashboard);

    const isVerified = isVerifiedFlag(is_verified) || isVerifiedFlag(emaiV);
    const isPhoneVerified = isVerifiedFlag(phone_verified) || isVerifiedFlag(phoneV);
    const noPhoneDt = !phone;
    const bothVerified = isVerified && isPhoneVerified;
    const handleVerify = spalsh || bothVerified;

    // Guest Converted User redirect: Bypass all direct verification redirects and go straight to TabNav
    if (isGuestConvertedUser && hasAuthToken) {
      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'TabNav' }],
          })
        );
      }
      return;
    }

    const hasNonUsaPermanentFlow =
      nonUsaPermanentFlags?.professionUpdateRequired === true ||
      nonUsaPermanentFlags?.stateLicenseFlowCompleted === true;
    const isUsaProfile =
      verifyData?.usa_user === true ||
      verifyData?.usa_user === 1 ||
      verifyData?.usa_user === '1' ||
      verifyData?.is_non_usa === false ||
      verifyData?.is_non_usa === 0 ||
      verifyData?.is_non_usa === '0' ||
      professionState?.usa_user === true ||
      professionState?.usa_user === 1 ||
      professionState?.usa_user === '1' ||
      professionState?.is_non_usa === false ||
      professionState?.is_non_usa === 0 ||
      professionState?.is_non_usa === '0' ||
      loginResponse?.user?.usa_user === true ||
      loginResponse?.user?.usa_user === 1 ||
      loginResponse?.user?.usa_user === '1' ||
      loginResponse?.user?.is_non_usa === false ||
      loginResponse?.user?.is_non_usa === 0 ||
      loginResponse?.user?.is_non_usa === '0';

    if (isUsaProfile && nonUsaState?.isNonUsa) {
      clearNonUsaFlowState().catch(err => console.log('clearNonUsaFlowState error', err));
      setNonUsaState(null);
    }

    const ipCountry = String(detectedCountry || '').trim().toUpperCase();
    const isNonUsaIp = ipCountry && ipCountry !== 'US' && ipCountry !== 'USA';

    const isNonUsa = (
      !isUsaProfile && (
        isNonUsaAccount(verifyData) ||
        (nonUsaState?.isNonUsa === true) ||
        (professionState?.usa_user === false || professionState?.usa_user === 0 || professionState?.usa_user === '0') ||
        hasNonUsaPermanentFlow
      )
    ) || isNonUsaIp;
    const isNonUsaStateLicenseFlowCompleted = nonUsaPermanentFlags?.stateLicenseFlowCompleted === true;

    if (isNonUsa) {
      if (!hasAuthToken) {
        return;
      }
      if (isNonUsaStateLicenseFlowCompleted) {
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'TabNav' }],
            })
          );
        }
        return;
      }
      const isGuestNonUsaWithToken = (guestRegistrationFlowActive || guestHomeGateActive) && hasAuthToken;
      if (isGuestNonUsaWithToken) {
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'TabNav' }],
            })
          );
        }
      } else if (!isVerified) {
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{
                name: "VerifyOTPEmail",
                params: {
                  nonUsaUser: true,
                  newMail: email || loginResponse?.email || nonUsaState?.email || professionState?.email,
                  NewEmail: {
                    email: email || loginResponse?.email || nonUsaState?.email || professionState?.email,
                  },
                  verifyemail: {
                    verifyemail: verifyData,
                    isNonUsaUser: true,
                  },
                }
              }]
            })
          );
        }
      } else {
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'TabNav' }],
            })
          );
        }
      }
      return;
    }

    const isValidDashboard = !loadingDashboard &&
      Array.isArray(dashboard) &&
      dashboard.some(item => String(item || "").trim() !== "");

    if (loadingDashboard) return;

    if (deepLinkBootstrapActive) {
      return;
    }

    console.log('[Splash] Nav Progress:', { allProfTake, bothVerified, isValidDashboard, isVerified, isPhoneVerified });

    if (!hasAuthToken && (guestHomeGateActive || guestRegistrationFlowActive)) {
      hasNavigatedRef.current = true;
      props.navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "GuestUser", params: { detectmain: "newadd" } }] })
      );
      return;
    }

    // State licenses path
    if (stateLicenses?.length > 0 && !isValidDashboard && bothVerified) {
      hasNavigatedRef.current = true;
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{
            name: "ChooseState",
            params: {
              dataVr: stateLicenses,
              Loc: loginResponse?.user?.user_location
            }
          }]
        })
      );
      return;
    }

    if (allProfTake) {
      if (bothVerified) {
        if (isValidDashboard) {
          setGtprof(true);
          hasNavigatedRef.current = true;
          props.navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] })
          );
        } else {
          hasNavigatedRef.current = true;
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{
                name: handleVerify ? "CreateStateInfor" : fulldashbaord == 0 ? "TabNav" : "Onboard",
                params: handleVerify ? {
                  dataVerify: {
                    dataVerify: "Nodasta",
                    allDat: loginResponse?.user
                  }
                } : undefined
              }]
            })
          );
        }
      } else if (bothVerified) {
        setGtprof(false);
        hasNavigatedRef.current = true;
        props.navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] })
        );
      } else {
        navigateToVerification();
      }
    } else {
      if (bothVerified) {
        setGtprof(false);
        hasNavigatedRef.current = true;
        props.navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] })
        );
      } else {
        navigateToVerification();
      }
    }

        /**
 * Navigate to verification utility.
 * @returns {void}
 *
 * @remarks Does not return a value.
 */
function navigateToVerification() {
      if (!isVerified) {
        hasNavigatedRef.current = true;
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{
              name: "VerifyOTPEmail",
              params: { newMail: email }
            }]
          })
        );
      } else if (noPhoneDt) {
        hasNavigatedRef.current = true;
        props.navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: isNonUsa ? "TabNav" : "AddMobile" }] })
        );
      } else if (!isPhoneVerified) {
        hasNavigatedRef.current = true;
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{
              name: "SplashMobile",
              params: { newPh: AuthReducer?.verifyResponse?.phone || phone }
            }]
          })
        );
      }
    }
  }, [
    emaiV,
    phoneV,
    dashboard,
    AuthReducer?.verifyResponse,
    AuthReducer?.chooseStatecardResponse?.state_licensures,
    DashboardReducer?.mainprofileResponse,
    DashboardReducer?.dashboardResponse?.data,
    AuthReducer?.signupResponse,
    isFocus,
    loadingDashboard,
    spalsh,
    guestRegistrationFlowActive,
    guestHomeGateActive,
    hasAuthToken,
    deepLinkBootstrapActive,
    nonUsaState,
    nonUsaPermanentFlags,
    bootstrapChecked,
    professionState,
    isGuestConvertedUser,
    AuthReducer?.status,
    detectedCountry,
    loadingCountry,
    loadingVerify,
  ]);

  const splashJson = require('../../Lottie/Splash-Screen-Intro.json');
  const animation = useRef(null);

  useLayoutEffect(() => {
    props.navigation.setOptions({ gestureEnabled: false });
  }, []);

  return (
    <>
      <MyStatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <View style={styles.container}>
        <LottieView
          ref={animation}
          source={splashJson}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
      </View>
    </>
  );
}

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colorpath.ButtonColr,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
