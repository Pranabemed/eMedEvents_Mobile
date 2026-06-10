import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Image, BackHandler, ActivityIndicator, Pressable } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import StateLicense from '../../Components/StateLicense';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import Imagepath from '../../Themes/Imagepath';
import { AppContext } from '../GlobalSupport/AppContext';
import HandleTextInput from './HandleTextInput';
import PrimeCard from '../../Components/PrimeCard';
import { PrimeCheckRequest } from '../../Redux/Reducers/WebcastReducer';
import { mainprofileRequest, dashPerRequest, dashboardRequest } from '../../Redux/Reducers/DashboardReducer';
import { licesensRequest, verifyRequest } from '../../Redux/Reducers/AuthReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import Snackbar from 'react-native-snackbar';
import NewProfession from '../../Components/NewProfession';
import NonPhysicianCat from '../../Components/NonPhysicianCat';
import NetInfo from '@react-native-community/netinfo';
import { Freeze } from "react-freeze";
import { enableFreeze } from "react-native-screens";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import DashboardMainShimmer from '../../Components/DashboardMainShimmer';
import Modal from 'react-native-modal';
import { getPublicIP } from '../../Utils/Helpers/IPServer';

const GUEST_REGISTRATION_FLOW_KEY = 'GUEST_REGISTRATION_FLOW';
const GUEST_PRIME_VERIFICATION_PENDING_KEY = 'GUEST_PRIME_VERIFICATION_PENDING';
const PRIME_MEMBERSHIP_SKIPPED_KEY = 'PrimeMembershipSkipped';
const CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION_KEY = 'CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION';
const SUPPRESS_GUEST_HOME_PROMPTS_ONCE_KEY = 'SUPPRESS_GUEST_HOME_PROMPTS_ONCE';
const PRIME_CARD_TEST_COUNTRY_CODE = '';

const normalizeProfessionHandle = (professionHandle) =>
  String(professionHandle || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim();

const findMatchedProfessionHandle = (candidates, supportedHandles) => {
  for (const candidate of candidates) {
    const normalizedCandidate = normalizeProfessionHandle(candidate);
    if (!normalizedCandidate) continue;

    for (const handle of supportedHandles) {
      if (normalizedCandidate === handle || normalizedCandidate.includes(handle)) {
        return handle;
      }
    }
  }

  return '';
};

const buildProfessionLabel = (profession, professionType) => {
  const cleanProfession = String(profession || '').trim();
  const cleanProfessionType = String(professionType || '').trim();

  if (!cleanProfession || !cleanProfessionType) {
    return '';
  }

  return `${cleanProfession} - ${cleanProfessionType}`;
};

const getCountryFromIP = async (ip) => {
  try {
    const res = await fetch(`https://ipinfo.io/${ip}/json`);
    const text = await res.text();
    if (text.startsWith('<')) {
      throw new Error('HTML response');
    }
    const data = JSON.parse(text);
    return String(data?.country || 'unknown').trim().toUpperCase();
  } catch (e) {
    console.log('Main guest geo lookup failed:', e);
    return 'unknown';
  }
};

const isUsaBasedUser = (user, ipCountryCode = '') => {
  const countryId = String(
    user?.country_id ||
    user?.billing_address?.country_id ||
    user?.user_billing_address?.country_id ||
    user?.user_address?.country_id ||
    ''
  ).trim();
  const countryName = String(
    user?.country_name ||
    user?.billing_address?.country_name ||
    user?.user_billing_address?.country_name ||
    user?.user_address?.country_name ||
    ''
  ).trim().toLowerCase();
  const usaUser = String(user?.usa_user || '').trim().toLowerCase();
  const ipCountry = String(user?.ip_country || user?.country_code || '').trim().toLowerCase();
  const callingCode = String(user?.callingCode || user?.countryCode || '').trim();
  const normalizedResolvedIpCountry = String(ipCountryCode || '').trim().toLowerCase();

  if (countryId && countryId !== '1' && countryId !== '233' && countryId !== '0') {
    return false;
  }
  if (countryName && !countryName.includes('usa') && !countryName.includes('united states') && !countryName.includes('us')) {
    return false;
  }

  return (
    usaUser === '1' ||
    usaUser === 'true' ||
    countryId === '1' ||
    countryName.includes('usa') ||
    countryName.includes('united states') ||
    callingCode === '+1' ||
    normalizedResolvedIpCountry === 'us' ||
    normalizedResolvedIpCountry === 'usa' ||
    ipCountry === 'us' ||
    ipCountry === 'usa'
  );
};

const parseStoredJson = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const requiresVerification = (user) => {
  if (!user) return false;
  const isEmailVerified = String(user?.is_verified ?? user?.email_verified ?? '0') === '1';
  const isPhoneVerified = String(user?.phone_verified ?? '0') === '1';
  return !isEmailVerified || !isPhoneVerified;
};
const Main = (props) => {
  const insets = useSafeAreaInsets();
  const {
    takestate,
    addit,
    setTakestate,
    setAddit,
    fulldashbaord,
    setFulldashbaord,
    stateCount,
    setStateCount,
    gtprof,
    totalcard,
    setTotalCred,
    stateid,
    setStateid,
    renewal,
    setRenewal,
    setPushnew,
    pushnew,
    pendingCount,
    completedCount,
    setGtprof,
    primeCardSessionSkipped,
    setPrimeCardSessionSkipped
  } = useContext(AppContext);
  const [focusedInput, setFocusedInput] = useState(null);
  const [linearText, setLinearText] = useState(true);
  const [showLine, setShowLine] = useState(false);
  const DashboardReducer = useSelector(state => state.DashboardReducer);
  const WebcastReducer = useSelector(state => state.WebcastReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [cmecourse, setCmecourse] = useState(false);
  const [finalShow, setFinalShow] = useState(null);
  const [visible, setVisible] = useState(false);
  const [fetcheddt, setFetchdt] = useState(null);
  const [linedty, setLinedty] = useState();
  const [enables, setEnables] = useState(false);
  const [primeadd, setPrimeadd] = useState(false);
  const [finalverifyvaultmain, setFinalverifyvaultmain] = useState(null);
  const [finalProfessionmain, setFinalProfessionmain] = useState(null);
  const [freeTrail, setFreeTrail] = useState(false);
  const [daysleft, setDaysleft] = useState(false);
  const [guestVerifyModalVisible, setGuestVerifyModalVisible] = useState(false);
  const [guestVerifyData, setGuestVerifyData] = useState(null);
  const [guestVerifyLoading, setGuestVerifyLoading] = useState(false);
  const [pendingGuestVerifyPayload, setPendingGuestVerifyPayload] = useState(null);
  const [forceNewProfession, setForceNewProfession] = useState(false);
  const [showGuestPrimePrompt, setShowGuestPrimePrompt] = useState(false);
  const [resolvedIpCountryCode, setResolvedIpCountryCode] = useState(PRIME_CARD_TEST_COUNTRY_CODE);
  const [guestVerifyCheckRequested, setGuestVerifyCheckRequested] = useState(false);
  const guestVerifyNavigationRef = useRef(false);
  const guestVerifyRequestStartedRef = useRef(false);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const [nettruedr, setNettruedr] = useState("");
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  useEffect(() => {
    const emitter = require('react-native').DeviceEventEmitter;
    const sub = emitter.addListener('DRAWER_MODAL_VISIBILITY', (visible) => {
      setIsDrawerVisible(visible);
    });
    return () => sub.remove();
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNettruedr(state.isConnected);
    });

    return () => unsubscribe();
  }, []);
  const { detectmain } = props?.route?.params || {}
  const physicianHandles = new Set(["physician-md", "physician-do", "physician-dpm"]);
  const nursingHandles = new Set(["nursing-rn", "nursing-aprn", "nursing-cna", "nursing-lpn"]);
  const supportedProfessionHandles = [...physicianHandles, ...nursingHandles];
  const dashboardProfessionInfo = DashboardReducer?.mainprofileResponse?.professional_information;
  const authProfessionInfo =
    AuthReducer?.loginResponse?.user ||
    AuthReducer?.againloginsiginResponse?.user ||
    AuthReducer?.signupResponse?.user ||
    {};
  const dashboardProfession = String(dashboardProfessionInfo?.profession || '').trim();
  const dashboardProfessionType = String(dashboardProfessionInfo?.profession_type || '').trim();
  const isDashboardProfessionReady = Boolean(dashboardProfession && dashboardProfessionType);
  const profFromDashboard = buildProfessionLabel(dashboardProfession, dashboardProfessionType);
  const profFromAuth = buildProfessionLabel(
    authProfessionInfo?.profession,
    authProfessionInfo?.profession_type
  );
  const profFromSaved = buildProfessionLabel(
    finalProfessionmain?.profession || finalverifyvaultmain?.profession,
    finalProfessionmain?.profession_type || finalverifyvaultmain?.profession_type
  );
  const resolvedProfessionHandle = profFromDashboard
    ? findMatchedProfessionHandle(
      [
        profFromDashboard,
        dashboardProfession,
        `${dashboardProfession} ${dashboardProfessionType}`.trim(),
      ],
      supportedProfessionHandles
    )
    : profFromAuth
      ? findMatchedProfessionHandle(
        [
          profFromAuth,
          `${authProfessionInfo?.profession || ''} ${authProfessionInfo?.profession_type || ''}`.trim(),
        ],
        supportedProfessionHandles
      )
      : findMatchedProfessionHandle(
        [
          profFromSaved,
          `${finalProfessionmain?.profession || finalverifyvaultmain?.profession || ''} ${finalProfessionmain?.profession_type || finalverifyvaultmain?.profession_type || ''}`.trim(),
        ],
        supportedProfessionHandles
      );
  const allProfTake = resolvedProfessionHandle ? physicianHandles.has(resolvedProfessionHandle) : false;
  const isPhysicianFlow = allProfTake;
  const isNursingFlow = nursingHandles.has(resolvedProfessionHandle);
  const shouldHoldSkeleton = (isPhysicianFlow || isNursingFlow) && !isDashboardProfessionReady;
  const bottomBannerSpacing = useMemo(() => {
    if (enables && allProfTake) {
      return normalize(96);
    }
    if (freeTrail) {
      return normalize(150);
    }
    return Platform.OS === 'ios' ? normalize(16) : normalize(80);
  }, [allProfTake, enables, freeTrail]);
  const homeBottomSpacing = useMemo(
    () => bottomBannerSpacing + (Platform.OS === 'ios' ? 0 : Math.max(insets.bottom, normalize(8))),
    [bottomBannerSpacing, insets.bottom]
  );
  console.log("isPhysicianFlow", isPhysicianFlow, fulldashbaord);
  console.log("isNursingFlow", isNursingFlow);
  const lastLicenseProfRef = useRef(null);

  // 🔹 Sync licensure requirements when profession changes
  useEffect(() => {
    if (!isFocus) return;

    const profInfo = DashboardReducer?.mainprofileResponse?.professional_information || {};
    const profession = String(profInfo.profession || '').trim();
    const profType = String(profInfo.profession_type || '').trim();

    if (!profession || !profType) return;
    const professionLabel = `${profession} - ${profType}`;

    if (lastLicenseProfRef.current !== professionLabel) {
      console.log('[Main.js/LicensureSync] Change detected:', { old: lastLicenseProfRef.current, new: professionLabel });
      lastLicenseProfRef.current = professionLabel;
      connectionrequest()
        .then(() => {
          console.log('[Main.js/LicensureSync] Dispatching licesensRequest for:', professionLabel);
          dispatch(licesensRequest(professionLabel));
        })
        .catch(err => console.log('Licensure refresh failed', err));
    } else {
      console.log('[Main.js/LicensureSync] No change, skipping.');
    }
  }, [isFocus, DashboardReducer?.mainprofileResponse?.professional_information]);

  // 🔹 Keep global context (gtprof) in sync with the latest detected profession
  useEffect(() => {
    if (resolvedProfessionHandle) {
      const isPhysicianNow = physicianHandles.has(resolvedProfessionHandle);
      if (isPhysicianNow !== gtprof) {
        setGtprof(isPhysicianNow);
      }
    }
  }, [resolvedProfessionHandle, gtprof]);
  // const isPhysicianFlow = gtprof || allProfTake || validHandles.has(cachedProfessionHandle);
  // const hasDashboardLicenses = Array.isArray(fulldashbaord) && fulldashbaord.length > 0;
  // const shouldRenderStateLicense = isPhysicianFlow || hasDashboardLicenses;
  useEffect(() => {
    if (!isFocus) return;
    connectionrequest()
      .then(() => {
        // 🔹 Only show shimmer if we don't have data yet (prevents flicker on tab switch)
        if (!DashboardReducer?.dashboardResponse?.data) {
          setShowLoader(false);
        }
        dispatch(PrimeCheckRequest({}));
        dispatch(mainprofileRequest({}));
        dispatch(dashPerRequest({}));
        dispatch(dashboardRequest({}));
      })
      .catch((err) => showErrorAlert("Please connect to internet", err));
  }, [detectmain, isFocus]);

  // Keep the main page on skeleton until dashboard profession info is ready.
  useEffect(() => {
    if (!isFocus) return;
    if (shouldHoldSkeleton) {
      setShowLoader(false);
      return;
    }
    if (!isPhysicianFlow && !isNursingFlow) {
      setShowLoader(true);
      return;
    }
    if (DashboardReducer?.dashboardResponse?.data) {
      setShowLoader(true);
    }
  }, [isFocus, shouldHoldSkeleton, isPhysicianFlow, isNursingFlow, DashboardReducer?.dashboardResponse?.data]);
  const backPressCount = useRef(0);
  const isSnackbarVisible = useRef(false);
  const snackbarTimeout = useRef(null);
  useEffect(() => {
    const resetState = () => {
      backPressCount.current = 0;
      isSnackbarVisible.current = false;
      if (snackbarTimeout.current) {
        clearTimeout(snackbarTimeout.current);
        snackbarTimeout.current = null;
      }
    };

    const onBackPress = () => {
      if (isSnackbarVisible.current) {
        resetState();
        BackHandler.exitApp();
        return true;
      }
      backPressCount.current = 1;
      isSnackbarVisible.current = true;
      Snackbar.show({
        text: 'Press back again to exit',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#2C2C2C',
        textColor: '#FFFFFF',
        action: {
          text: 'EXIT',
          textColor: '#D87AF6',
          onPress: () => {
            resetState();
            BackHandler.exitApp();
          },
        },
      });
      snackbarTimeout.current = setTimeout(() => {
        isSnackbarVisible.current = false;
        backPressCount.current = 0;
      }, 3000);

      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      backHandler.remove();
      resetState();
    };
  }, []);
  const [showloader, setShowLoader] = useState(false);
  const [freeze, setFreeze] = useState(false);
  const shouldRenderDashboardContent = !shouldHoldSkeleton && (showloader || (!isPhysicianFlow && !isNursingFlow));
  const normalizedFulldashbaord = Array.isArray(fulldashbaord) ? fulldashbaord : [];
  useEffect(() => {
    setFreeze(false);
    enableFreeze(false);
  }, []);
  useEffect(() => {
    const token_handle_vault = () => {
      (async () => {
        try {
          const [board_special, profession_data] = await Promise.all([
            AsyncStorage.getItem(constants.VERIFYSTATEDATA),
            AsyncStorage.getItem(constants.PROFESSION)
          ]);
          console.log(profession_data, 'Fetched=====:', board_special);
          const board_special_json = board_special ? JSON.parse(board_special) : null;
          const profession_data_json = profession_data ? JSON.parse(profession_data) : null;
          setFinalverifyvaultmain(board_special_json);
          setFinalProfessionmain(profession_data_json);
        } catch (error) {
          console.log('Error fetching data:', error);
        }
      })();
    };

    token_handle_vault();
  }, [isFocus]);
  const ipAddress = getPublicIP();
  useEffect(() => {
    if (PRIME_CARD_TEST_COUNTRY_CODE) {
      setResolvedIpCountryCode(PRIME_CARD_TEST_COUNTRY_CODE);
      return;
    }
    if (!ipAddress) return;
    let isMounted = true;
    const fetchCountry = async () => {
      const countryCode = await getCountryFromIP(ipAddress);
      if (isMounted) {
        setResolvedIpCountryCode(countryCode || 'unknown');
      }
    };
    fetchCountry();
    return () => {
      isMounted = false;
    };
  }, [ipAddress]);
  useEffect(() => {
    if (!isFocus) return;
    const loadForcedProfessionView = async () => {
      try {
        const [forceNewProfessionRaw, primeMembershipSkippedRaw] = await Promise.all([
          AsyncStorage.getItem(CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION_KEY),
          AsyncStorage.getItem(PRIME_MEMBERSHIP_SKIPPED_KEY),
        ]);
        if ((forceNewProfessionRaw === '1' || primeMembershipSkippedRaw === 'true') && !hasActivePrimeMembership) {
          setForceNewProfession(true);
          if (forceNewProfessionRaw === '1') {
            await AsyncStorage.removeItem(CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION_KEY);
          }
        } else {
          setForceNewProfession(false);
        }
      } catch (error) {
        console.log('loadForcedProfessionView error', error);
      }
    };
    loadForcedProfessionView();
  }, [isFocus, hasActivePrimeMembership]);
  const openGuestVerificationAlert = async (user, shouldClearPendingKey = false) => {
    if (!user) return;
    if (shouldClearPendingKey) {
      try {
        await AsyncStorage.removeItem(GUEST_PRIME_VERIFICATION_PENDING_KEY);
      } catch (error) {
        console.log('openGuestVerificationAlert clear pending error', error);
      }
    }
    setGuestVerifyData(user);
    setPrimeadd(false);
    setShowGuestPrimePrompt(false);
    setTimeout(() => {
      setGuestVerifyModalVisible(true);
    }, 180);
  };
  const requestGuestVerificationCheck = async () => {
    const token = await AsyncStorage.getItem(constants.TOKEN);
    if (!token) return;
    setGuestVerifyCheckRequested(true);
    connectionrequest()
      .then(() => {
        dispatch(verifyRequest({ token, key: {} }));
      })
      .catch((err) => {
        setGuestVerifyCheckRequested(false);
        showErrorAlert("Please connect to internet", err);
      });
  };
  const setGuestPrimeVerificationPending = async () => {
    try {
      await AsyncStorage.setItem(GUEST_PRIME_VERIFICATION_PENDING_KEY, 'true');
    } catch (error) {
      console.log('setGuestPrimeVerificationPending error', error);
    }
  };
  const handleGuestPrimeSkip = async () => {
    await setGuestPrimeVerificationPending();
    try {
      await AsyncStorage.setItem(PRIME_MEMBERSHIP_SKIPPED_KEY, 'true');
      setForceNewProfession(true);
      await AsyncStorage.setItem(CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION_KEY, '1');
      setPrimeCardSessionSkipped(true);
    } catch (error) {
      console.log('handleGuestPrimeSkip flag error', error);
    }
    setPrimeadd(false);
    setShowGuestPrimePrompt(false);
    await requestGuestVerificationCheck();
  };
  const handleGuestPrimeExploreTrial = async () => {
    await AsyncStorage.removeItem(PRIME_MEMBERSHIP_SKIPPED_KEY);
    await AsyncStorage.setItem('PrimeCardFlowComplete', 'true');
    await setGuestPrimeVerificationPending();
    setPrimeadd(false);
    setShowGuestPrimePrompt(false);
    await requestGuestVerificationCheck();
  };
  const handleGuestPrimeMembership = async () => {
    await AsyncStorage.removeItem(PRIME_MEMBERSHIP_SKIPPED_KEY);
    await AsyncStorage.setItem('PrimeCardFlowComplete', 'true');
    await setGuestPrimeVerificationPending();
    setPrimeadd(false);
    setShowGuestPrimePrompt(false);
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'PrimePayment' }],
      })
    );
  };
  useEffect(() => {
    if (!isFocus) return;
    const loadGuestVerifyModal = async () => {
      try {
        if (guestVerifyNavigationRef.current) {
          return;
        }
        const [
          guestFlowRaw,
          verifyRaw,
          professionRaw,
          guestPrimeVerifyPendingRaw,
          primeMembershipSkippedRaw,
          primeCardFlowCompleteRaw,
          suppressGuestPromptsOnceRaw,
        ] = await Promise.all([
          AsyncStorage.getItem(GUEST_REGISTRATION_FLOW_KEY),
          AsyncStorage.getItem(constants.VERIFYSTATEDATA),
          AsyncStorage.getItem(constants.PROFESSION),
          AsyncStorage.getItem(GUEST_PRIME_VERIFICATION_PENDING_KEY),
          AsyncStorage.getItem(PRIME_MEMBERSHIP_SKIPPED_KEY),
          AsyncStorage.getItem('PrimeCardFlowComplete'),
          AsyncStorage.getItem(SUPPRESS_GUEST_HOME_PROMPTS_ONCE_KEY),
        ]);
        const suppressGuestPromptsOnce = suppressGuestPromptsOnceRaw === 'true';
        const guestFlowData = parseStoredJson(guestFlowRaw);
        const isGuestFlow = Boolean(guestFlowData);
        const isSkippedFlow = primeMembershipSkippedRaw === 'true';
        const isVerificationPending = guestPrimeVerifyPendingRaw === 'true';
        const isPrimeCardFlowComplete = primeCardFlowCompleteRaw === 'true';
        const verifyResponseData = AuthReducer?.verifyResponse?.user || AuthReducer?.verifyResponse || null;
        const hasFreshVerifyResponse =
          AuthReducer?.status === 'Auth/verifySuccess' &&
          Boolean(verifyResponseData);

        if (!resolvedIpCountryCode) {
          return;
        }

        if (suppressGuestPromptsOnce) {
          await AsyncStorage.removeItem(SUPPRESS_GUEST_HOME_PROMPTS_ONCE_KEY);
          setPrimeadd(false);
          setShowGuestPrimePrompt(false);
          setGuestVerifyModalVisible(false);
          setGuestVerifyData(null);
          return;
        }

        if (!isGuestFlow && !isSkippedFlow) {
          setGuestVerifyModalVisible(false);
          setGuestVerifyData(null);
          setShowGuestPrimePrompt(false);
          return;
        }
        const verifyData = parseStoredJson(verifyRaw);
        const professionData = parseStoredJson(professionRaw);
        const user = verifyResponseData || verifyData || professionData;
        const professionType = String(
          verifyData?.profession_type || professionData?.profession_type ||
          user?.profession_type ||
          dashboardProfessionType ||
          authProfessionInfo?.profession_type ||
          ''
        ).trim().toUpperCase();
        const professionLabel = buildProfessionLabel(
          verifyData?.profession || professionData?.profession ||
          user?.profession || dashboardProfessionInfo?.profession || authProfessionInfo?.profession,
          user?.profession_type || dashboardProfessionType || authProfessionInfo?.profession_type
        ).toUpperCase();

        const rawProfession =
          verifyData?.profession ||
          professionData?.profession ||
          user?.profession ||
          dashboardProfessionInfo?.profession ||
          authProfessionInfo?.profession ||
          '';
        const rawProfessionType =
          verifyData?.profession_type ||
          professionData?.profession_type ||
          user?.profession_type ||
          dashboardProfessionType ||
          authProfessionInfo?.profession_type ||
          '';

        const userProfession = (
          rawProfession.includes(' - ')
            ? rawProfession
            : rawProfession && rawProfessionType
              ? `${rawProfession} - ${rawProfessionType}`
              : rawProfession || rawProfessionType
        ).trim();

        const allowedProfessions = [
          "Physician - MD",
          "Physician - DO",
          "Physician - DPM"
        ];

        const isEligibleGuestPhysician =
          allowedProfessions.includes(userProfession) ||
          allProfTake ||
          ['MD', 'DO', 'DPM'].includes(professionType) ||
          professionLabel.includes('PHYSICIAN - MD') ||
          professionLabel.includes('PHYSICIAN - DO') ||
          professionLabel.includes('PHYSICIAN - DPM');

        const isEligibleCountry =
          resolvedIpCountryCode === 'US' ||
          resolvedIpCountryCode === 'USA' ||
          isUsaBasedUser(user, resolvedIpCountryCode);

        const isUSAAndPhysician = isEligibleGuestPhysician && isEligibleCountry;

        const shouldShowPrimeFirst =
          !hasActivePrimeMembership &&
          !isVerificationPending &&
          !isPrimeCardFlowComplete &&
          !primeCardSessionSkipped &&
          (isUSAAndPhysician || isSkippedFlow);

        console.log({
          shouldShowPrimeFirst,
          isUSAAndPhysician,
          isEligibleGuestPhysician,
          isEligibleCountry,
          isVerificationPending,
          isPrimeCardFlowComplete
        }, 'Fetched=====1222:');

        if (shouldShowPrimeFirst) {
          setGuestVerifyData(user);
          setGuestVerifyModalVisible(false);
          setShowGuestPrimePrompt(true);
          setPrimeadd(true);
          return;
        }

        if (!isGuestFlow) {
          setPrimeadd(false);
          setShowGuestPrimePrompt(false);
          return;
        }

        const shouldCheckVerificationNow =
          !shouldShowPrimeFirst &&
          !isVerificationPending &&
          !hasFreshVerifyResponse &&
          user;

        if (shouldCheckVerificationNow) {
          setGuestVerifyData(user);
          setPrimeadd(false);
          setShowGuestPrimePrompt(false);
          await setGuestPrimeVerificationPending();
          await requestGuestVerificationCheck();
          return;
        }

        if (isVerificationPending) {
          if (!hasFreshVerifyResponse) {
            setGuestVerifyModalVisible(false);
            setShowGuestPrimePrompt(false);
            return;
          }
          if (requiresVerification(user)) {
            await openGuestVerificationAlert(user, true);
          } else {
            await AsyncStorage.removeItem(GUEST_PRIME_VERIFICATION_PENDING_KEY);
            setGuestVerifyModalVisible(false);
            setGuestVerifyData(null);
            setShowGuestPrimePrompt(false);
          }
          return;
        }

        if (hasFreshVerifyResponse && user && requiresVerification(user)) {
          setShowGuestPrimePrompt(false);
          setGuestVerifyData(user);
          setGuestVerifyModalVisible(true);
        } else {
          setGuestVerifyModalVisible(false);
          setGuestVerifyData(null);
          setShowGuestPrimePrompt(false);
        }
      } catch (error) {
        console.log('loadGuestVerifyModal error', error);
      }
    };
    loadGuestVerifyModal();
  }, [isFocus, hasActivePrimeMembership, allProfTake, dashboardProfessionType, dashboardProfessionInfo?.profession, authProfessionInfo?.profession, authProfessionInfo?.profession_type, resolvedIpCountryCode, AuthReducer?.status, AuthReducer?.verifyResponse, primeCardSessionSkipped]);
  const subscription = WebcastReducer?.PrimeCheckResponse?.subscription;
  const isPrimePaymentSuccess =
    WebcastReducer?.PrimePaymentResponse?.msg === 'You are now enrolled for subscription successfully.';
  const hasActivePrimeMembership = Boolean(subscription || isPrimePaymentSuccess);
  const isPrimeTrial = useMemo(() => {
    return !hasActivePrimeMembership && subscription == false && allProfTake;
  }, [subscription, allProfTake, hasActivePrimeMembership]);

  const takeSub = !hasActivePrimeMembership && (isPrimeTrial || finalProfessionmain?.subscription_user == "free" || AuthReducer?.loginResponse?.user?.subscription_user == "free" || AuthReducer?.againloginsiginResponse?.user?.subscription_user == "free" || finalverifyvaultmain?.subscription_user == "non-subscribed");
  const hsdSub = !hasActivePrimeMembership && (finalverifyvaultmain?.subscription_user == "non-subscribed" || isPrimeTrial);
  const endDateStringMain =
    WebcastReducer?.PrimeCheckResponse?.subscription?.end_date ||
    AuthReducer?.loginResponse?.user?.subscriptions?.[0]?.end_date || AuthReducer?.againloginsiginResponse?.user?.subscriptions?.[0]?.end_date ||
    finalProfessionmain?.subscriptions?.[0]?.end_date;
  useEffect(() => {
    if (endDateStringMain && allProfTake) {
      const endDateString =
        WebcastReducer?.PrimeCheckResponse?.subscription?.end_date ||
        AuthReducer?.loginResponse?.user?.subscriptions?.[0]?.end_date || AuthReducer?.againloginsiginResponse?.user?.subscriptions?.[0]?.end_date ||
        finalProfessionmain?.subscriptions?.[0]?.end_date;
      if (!endDateString) return;
      try {
        const endDate = new Date(endDateString);
        const currentDate = new Date();
        const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
        const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
        if (normalizedCurrentDate >= normalizedEndDate) {
          setEnables(true);
          setPushnew(true);
        } else {
          setEnables(false);
          setPushnew(false);
        }
        const timeDifference = normalizedEndDate - normalizedCurrentDate;
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        if (daysDifference <= 30) {
          setFreeTrail(true);
          const endDateString = endDateStringMain;
          const endDate = new Date(endDateString);
          const currentDate = new Date();
          const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
          const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
          const timeDiff = normalizedEndDate.getTime() - normalizedCurrentDate.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          setDaysleft(daysDiff);
        } else {
          setFreeTrail(false);
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    } else if (takeSub) {
      setFreeTrail(true);
      const endDateString = finalProfessionmain?.subscriptions?.[0]?.end_date
      if (endDateString) {
        const endDate = new Date(endDateString);
        const currentDate = new Date();
        const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
        const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
        const timeDiff = normalizedEndDate.getTime() - normalizedCurrentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        setDaysleft(daysDiff);
      } else {
        setDaysleft(null);
      }
    }
  }, [allProfTake, WebcastReducer?.PrimeCheckResponse, AuthReducer, finalProfessionmain, finalverifyvaultmain, takeSub]);
  useLayoutEffect(() => {
    props.navigation.setOptions({ gestureEnabled: false });
  }, []);
  useEffect(() => {
    if (!isFocus || !isPrimePaymentSuccess) return;
    (async () => {
      const guestPrimeVerifyPendingRaw = await AsyncStorage.getItem(GUEST_PRIME_VERIFICATION_PENDING_KEY);
      if (guestPrimeVerifyPendingRaw === 'true') {
        await requestGuestVerificationCheck();
      }
    })().catch(error => {
      console.log('prime success verify trigger error', error);
    });
  }, [isFocus, isPrimePaymentSuccess]);
  const closeGuestVerifyModal = async () => {
    setGuestVerifyModalVisible(false);
  };
  const guestVerifyEmail =
    guestVerifyData?.email ||
    AuthReducer?.verifyResponse?.email ||
    AuthReducer?.verifyResponse?.user?.email ||
    finalverifyvaultmain?.email ||
    finalProfessionmain?.email ||
    '';
  const proceedGuestVerification = async verifyPayload => {
    const countryCode =
      verifyPayload?.countryCode ||
      verifyPayload?.callingCode ||
      (verifyPayload?.usa_user ? '+1' : '');
    const isEmailVerified = String(verifyPayload?.is_verified ?? verifyPayload?.email_verified ?? '0') === '1';
    const isPhoneVerified = String(verifyPayload?.phone_verified ?? '0') === '1';
    const phoneValue =
      verifyPayload?.phone ||
      verifyPayload?.mobile ||
      verifyPayload?.phone_number ||
      verifyPayload?.user?.phone;

    guestVerifyNavigationRef.current = true;
    setTimeout(() => {
      guestVerifyNavigationRef.current = false;
    }, 1200);
    await closeGuestVerifyModal();

    if (!isEmailVerified) {
      props.navigation.navigate('VerifyOTP', {
        NewEmail: {
          email: verifyPayload?.email,
          phoneNo: phoneValue,
          phone: phoneValue,
          countryCode,
          returnDat: { ...verifyPayload, phone: phoneValue, countryCode },
          forceResend: true,
        },
        user: {
          emailid: verifyPayload?.email,
          phoneData: phoneValue,
        },
      });
      return;
    }

    if (!isPhoneVerified) {
      props.navigation.navigate('VerifyMobileOTP', {
        validPh: {
          validPh: phoneValue,
          phonecode: countryCode,
        },
        forceResend: true,
      });
      return;
    }

    try {
      await AsyncStorage.removeItem(GUEST_REGISTRATION_FLOW_KEY);
    } catch (error) {
      console.log('handleGuestVerifyAccount cleanup error', error);
    }
  };
  const handleGuestVerifyAccount = async () => {
    const verifyPayload = guestVerifyData || finalverifyvaultmain || finalProfessionmain || AuthReducer?.verifyResponse || {};
    const token = await AsyncStorage.getItem(constants.TOKEN);
    const hasImmediateGuestContact =
      Boolean(verifyPayload?.email) &&
      Boolean(
        verifyPayload?.phone ||
        verifyPayload?.mobile ||
        verifyPayload?.phone_number ||
        verifyPayload?.user?.phone
      );

    if (token) {
      setGuestVerifyLoading(true);
      guestVerifyRequestStartedRef.current = false;
      if (!hasImmediateGuestContact) {
        setPendingGuestVerifyPayload(verifyPayload);
      }
      connectionrequest()
        .then(() => {
          dispatch(verifyRequest({ token, key: {} }));
        })
        .catch((err) => {
          setPendingGuestVerifyPayload(null);
          setGuestVerifyLoading(false);
          showErrorAlert("Please connect to internet", err);
        });
      if (hasImmediateGuestContact) {
        proceedGuestVerification(verifyPayload).catch(error => {
          console.log('handleGuestVerifyAccount immediate flow error', error);
          setGuestVerifyLoading(false);
        });
      }
      return;
    }

    await proceedGuestVerification(verifyPayload);
  };
  useEffect(() => {
    if (!pendingGuestVerifyPayload) return;
    if (AuthReducer?.status === 'Auth/verifyRequest') {
      guestVerifyRequestStartedRef.current = true;
      return;
    }
    if (!guestVerifyRequestStartedRef.current) {
      return;
    }
    if (AuthReducer?.status !== 'Auth/verifySuccess' && AuthReducer?.status !== 'Auth/verifyFailure') {
      return;
    }

    const verifyResponse = AuthReducer?.verifyResponse || {};
    const responseUser = verifyResponse?.user || {};
    const mergedVerifyPayload = {
      ...pendingGuestVerifyPayload,
      ...responseUser,
      ...verifyResponse,
      email:
        verifyResponse?.email ||
        responseUser?.email ||
        pendingGuestVerifyPayload?.email,
      phone:
        verifyResponse?.phone ||
        responseUser?.phone ||
        pendingGuestVerifyPayload?.phone,
    };

    guestVerifyRequestStartedRef.current = false;
    setPendingGuestVerifyPayload(null);
    setGuestVerifyLoading(false);
    setGuestVerifyCheckRequested(false);
    setGuestVerifyData(mergedVerifyPayload);
    proceedGuestVerification(mergedVerifyPayload).catch(error => {
      console.log('proceedGuestVerification error', error);
      setGuestVerifyLoading(false);
    });
  }, [AuthReducer?.status, AuthReducer?.verifyResponse, pendingGuestVerifyPayload]);
  useEffect(() => {
    if (!guestVerifyCheckRequested) return;
    if (AuthReducer?.status === 'Auth/verifyRequest') {
      return;
    }
    if (AuthReducer?.status !== 'Auth/verifySuccess' && AuthReducer?.status !== 'Auth/verifyFailure') {
      return;
    }
    setGuestVerifyCheckRequested(false);
  }, [guestVerifyCheckRequested, AuthReducer?.status]);
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
        <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
          <View style={Platform.OS === 'android' ? { marginTop: normalize(0), paddingHorizontal: normalize(6) } : { paddingHorizontal: normalize(10) }}>
            <Image source={Imagepath.Logo} style={{ height: normalize(40), width: normalize(40) }} resizeMode="contain" />
          </View>
          <HandleTextInput showLine={showLine} nav={props.navigation} takestate={takestate} addit={addit} setFocusedInput={setFocusedInput} focusedInput={focusedInput} />
          <View style={{ flex: 1 }}>
            {shouldRenderDashboardContent ? (
              <ScrollView
                style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: homeBottomSpacing,
                }}
                scrollEventThrottle={16}
              >
                <View>
                  <View style={{ bottom: normalize(10) }}>
                    {forceNewProfession
                      ? <NewProfession finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />
                      : isPhysicianFlow
                        ? <StateLicense propsData={props?.route?.params} setRenewal={setRenewal} renewal={renewal} setStateid={setStateid} stateid={stateid} setTotalCred={setTotalCred} totalcard={totalcard} finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />
                        : isNursingFlow
                          ? <NonPhysicianCat finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />
                          : <NewProfession finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />}
                  </View>
                </View>
              </ScrollView>
            ) : (
              <View style={{
                flex: 1,
                backgroundColor: Colorpath.Pagebg,
              }}>
                <DashboardMainShimmer />
              </View>
            )}
          </View>

          {enables && allProfTake ? <View style={{
            position: 'absolute',
            height: normalize(100),
            bottom: normalize(0),
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: Math.max(insets.bottom, normalize(2)),
          }}>
            <TouchableOpacity onPress={() => setPrimeadd(true)} style={{ flexDirection: "row", gap: normalize(10), justifyContent: "center", alignItems: "center", height: normalize(54), width: normalize(340), backgroundColor: "#FFEDCA", borderTopLeftRadius: normalize(25), borderTopRightRadius: normalize(25), marginBottom: normalize(-2) }}>
              <Image source={Imagepath.CrownDone} style={{ height: normalize(30), width: normalize(30), resizeMode: "contain" }} />
              <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000", fontWeight: "bold", alignItems: "center" }}>{"Get Prime Membership"}</Text>
            </TouchableOpacity>
          </View> : !hasActivePrimeMembership && freeTrail ? <View
            style={{
              position: 'absolute',
              bottom: normalize(0),
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: Math.max(insets.bottom, normalize(2)),
            }}
          >
            <Pressable
              onPress={() => setPrimeadd(true)}
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: normalize(340),
                backgroundColor: '#FFEDCA',
                borderTopLeftRadius: normalize(25),
                borderTopRightRadius: normalize(25),
                paddingVertical: normalize(20),
                paddingHorizontal: normalize(10),
                marginBottom: normalize(-2),
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.InterSemiBold,
                  fontSize: 14,
                  color: '#000',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: normalize(15),
                }}
              >
                {freeTrail && hsdSub
                  ? 'Thank you for exploring Prime Membership.\nClick Subscribe now to join.'
                  : freeTrail && daysleft == 30
                    ? 'Thank you for exploring Prime Membership.\nClick Subscribe now to join.'
                    : daysleft
                      ? Math.abs(daysleft) > 29
                        ? 'Thank you for exploring Prime Membership.\nClick Subscribe now to join.'
                        : `Your free trial of premium subscription will end in ${Math.abs(
                          daysleft
                        )} day(s). Subscribe now to continue accessing premium features`
                      : ''}
              </Text>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: normalize(30),
                  width: normalize(150),
                  backgroundColor: Colorpath.ButtonColr,
                  borderRadius: normalize(5),
                  bottom: normalize(5)
                }}
              >
                <Pressable onPress={() => setPrimeadd(true)}>
                  <Text
                    style={{
                      fontFamily: Fonts.InterBold,
                      fontWeight: 'bold',
                      fontSize: 14,
                      color: '#fff',
                      textAlign: 'center',
                    }}
                  >
                    {'Subscribe Now'}
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </View>
            : null}
           {(primeadd && !isDrawerVisible) && <PrimeCard
            primeadd={primeadd}
            setPrimeadd={setPrimeadd}
            primaryButtonText={showGuestPrimePrompt ? 'Explore Free Trial 30 Days' : undefined}
            onPrimaryAction={showGuestPrimePrompt ? handleGuestPrimeExploreTrial : undefined}
            secondaryButtonText={showGuestPrimePrompt ? 'Get Prime Membership' : undefined}
            onSecondaryAction={showGuestPrimePrompt ? handleGuestPrimeMembership : undefined}
            showSkip={showGuestPrimePrompt}
            onSkip={showGuestPrimePrompt ? handleGuestPrimeSkip : undefined}
          />}
          <Modal
            isVisible={guestVerifyModalVisible && !isDrawerVisible}
            onBackdropPress={() => { }}
            onBackButtonPress={() => { }}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropTransitionInTiming={300}
            backdropTransitionOutTiming={0}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            hideModalContentWhileAnimating={true}
            style={{ justifyContent: 'flex-end', margin: 0 }}
            coverScreen={true}
            hasBackdrop={true}
            backdropColor="#000000"
            backdropOpacity={0.7}
          >
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: normalize(24),
                borderTopRightRadius: normalize(24),
                paddingHorizontal: normalize(20),
                paddingTop: normalize(22),
                paddingBottom: Math.max(insets.bottom, normalize(18)),
              }}
            >
              <View
                style={{
                  alignSelf: 'center',
                  width: normalize(48),
                  height: normalize(5),
                  borderRadius: normalize(10),
                  backgroundColor: '#D1D5DB',
                  marginBottom: normalize(18),
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.InterBold,
                  fontSize: 22,
                  color: '#111827',
                  textAlign: 'center',
                  marginBottom: normalize(14),
                }}
              >
                {'Verification Alert !'}
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: Colorpath.ButtonColr,
                  width: '100%',
                  marginBottom: normalize(18),
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.InterSemiBold,
                  fontSize: 18,
                  color: '#111827',
                  textAlign: 'center',
                  marginBottom: normalize(20),
                  lineHeight: normalize(24),
                }}
              >
                {"We've sent a verification email to your registered email address "}
                {guestVerifyEmail ? (
                  <Text
                    style={{
                      color: '#FF773D',
                      fontFamily: Fonts.InterBold,
                      fontSize: 18,
                    }}
                  >
                    {guestVerifyEmail}
                  </Text>
                ) : null}
                {
                  '. Please verify your account to access all features of your eMedEvents account.'
                }
              </Text>
              <TouchableOpacity
                onPress={handleGuestVerifyAccount}
                disabled={guestVerifyLoading}
                style={{
                  height: normalize(48),
                  borderRadius: normalize(10),
                  backgroundColor: Colorpath.ButtonColr,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 0,
                  opacity: guestVerifyLoading ? 0.7 : 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.InterBold,
                    fontSize: 16,
                    color: '#FFFFFF',
                  }}
                >
                  {guestVerifyLoading ? 'Please wait...' : 'Verify your account'}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </SafeAreaView>
        <Freeze freeze={freeze} />
      </KeyboardAvoidingView>
    </>

  )
}

export default Main
