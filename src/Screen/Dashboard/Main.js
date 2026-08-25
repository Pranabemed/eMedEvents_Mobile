/**
 * Main screen module. Renders a React Native screen or a screen-scoped support component. Exported members: GUEST_REGISTRATION_FLOW_KEY, GUEST_PRIME_VERIFICATION_PENDING_KEY, PRIME_MEMBERSHIP_SKIPPED_KEY, CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION_KEY, SUPPRESS_GUEST_HOME_PROMPTS_ONCE_KEY, PRIME_CARD_TEST_COUNTRY_CODE, normalizeProfessionHandle, findMatchedProfessionHandle, buildProfessionLabel, getCountryFromIP, isUsaBasedUser, parseStoredJson, requiresVerification, Main, loadExploreTrialClicked, resetState, onBackPress, renderMainAddLicenseCard, token_handle_vault, loadProfile, fetchCountry, loadForcedProfessionView, openGuestVerificationAlert, requestGuestVerificationCheck, setGuestPrimeVerificationPending, handleGuestPrimeSkip, handleGuestPrimeExploreTrial, handleGuestPrimeMembership, loadGuestVerifyModal, setFreeTrail, setDaysleft, closeGuestVerifyModal, proceedGuestVerification, handleGuestVerifyAccount.
 */

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
import { licesensRequest, verifyRequest, primeTrailRequest } from '../../Redux/Reducers/AuthReducer';
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
import { getPublicIP, getCountryAndDialCode } from '../../Utils/Helpers/IPServer';
import { isNonUsaAccount, readNonUsaFlowState, readNonUsaPermanentFlags, writeNonUsaFlowState, clearNonUsaFlowState, isUsaCountryCode } from '../../Utils/Helpers/nonUsaFlow';
import { isPrimeSubscriptionActive, isPrimeSubscriptionMissing } from '../../Utils/Helpers/primeSubscription';

/**
 * Reusable normalizeProfessionHandle component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
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
 * Prime membership prompt pending key constant.
 * @returns {string}
 */
const PRIME_MEMBERSHIP_PROMPT_PENDING_KEY = 'PrimeMembershipPromptPending';
/**
 * Check membership force new profession key constant.
 * @returns {string}
 */
const CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION_KEY = 'CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION';
/**
 * Suppress guest home prompts once key constant.
 * @returns {string}
 */
const SUPPRESS_GUEST_HOME_PROMPTS_ONCE_KEY = 'SUPPRESS_GUEST_HOME_PROMPTS_ONCE';
/**
 * Prime card test country code constant.
 * @returns {string}
 */
const PRIME_CARD_TEST_COUNTRY_CODE = '';
/**
 * Guest verification completed key constant.
 * @returns {string}
 */
const GUEST_VERIFICATION_COMPLETED_KEY = 'GUEST_VERIFICATION_COMPLETED';

/**
 * Normalizes profession handle.
 * @param {*} professionHandle - Input value.
 * @returns {*}
 */
const normalizeProfessionHandle = (professionHandle) =>
  String(professionHandle || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim();

/**
 * Find matched profession handle utility.
 * @param {*} candidates - Input value.
 * @param {*} supportedHandles - Input value.
 * @returns {string}
 */
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

/**
 * Build profession label utility.
 * @param {*} profession - Input value.
 * @param {*} professionType - Input value.
 * @returns {string}
 */
const buildProfessionLabel = (profession, professionType) => {
  const cleanProfession = String(profession || '').trim();
  const cleanProfessionType = String(professionType || '').trim();

  if (!cleanProfession || !cleanProfessionType) {
    return '';
  }

  return `${cleanProfession} - ${cleanProfessionType}`;
};

/**
 * Returns country from ip.
 *
 * @async
 * @param {*} ip - Input value.
 * @returns {Promise<*>}
 */
const getCountryFromIP = async (ip) => {
  try {
    const geo = await getCountryAndDialCode();
    if (geo && geo.country) {
      return String(geo.country).trim().toUpperCase();
    }
  } catch (e) {
    console.log('Main guest geo lookup failed:', e);
  }
  try {
    const url = ip ? `https://ipinfo.io/${ip}/json` : 'https://ipinfo.io/json';
    const res = await fetch(url);
    const text = await res.text();
    if (!text.startsWith('<')) {
      const data = JSON.parse(text);
      if (data?.country) return String(data.country).trim().toUpperCase();
    }
  } catch (e) {
    console.log('Main guest geo lookup fallback failed:', e);
  }
  try {
    const res = await fetch('https://freeipapi.com/api/json');
    const data = await res.json();
    if (data?.countryCode) return String(data.countryCode).trim().toUpperCase();
  } catch (e) { }
  return 'unknown';
};

/**
 * Determines whether usa based user is true.
 * @param {*} user - Input value.
 * @param {string} ipCountryCode - Input value.
 * @returns {*}
 */
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

/**
 * Parses stored json.
 * @param {*} value - Input value.
 * @returns {void}
 */
const parseStoredJson = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

/**
 * Requires verification utility.
 * @param {*} user - Input value.
 * @param {boolean} isNonUsa - Input value.
 * @param {*} verifyResponse - Input value.
 * @param {*} verifyData - Input value.
 * @returns {*}
 */
const requiresVerification = (user, isNonUsa = false, verifyResponse = null, verifyData = null) => {
  if (!user) return false;
  const primarySource = verifyResponse || {};
  const secondarySource = user || {};
  const tertiarySource = verifyData || {};

  const isEmailVerified = [
    primarySource?.is_verified,
    primarySource?.email_verified,
    primarySource?.user?.is_verified,
    primarySource?.user?.email_verified,
    secondarySource?.is_verified,
    secondarySource?.email_verified,
    secondarySource?.user?.is_verified,
    secondarySource?.user?.email_verified,
    tertiarySource?.is_verified,
    tertiarySource?.email_verified,
    tertiarySource?.user?.is_verified,
    tertiarySource?.user?.email_verified
  ].some(val => String(val) === '1' || val === true || val === 1);

  const isPhoneVerified = [
    primarySource?.phone_verified,
    primarySource?.user?.phone_verified,
    secondarySource?.phone_verified,
    secondarySource?.user?.phone_verified,
    tertiarySource?.phone_verified,
    tertiarySource?.user?.phone_verified
  ].some(val => String(val) === '1' || val === true || val === 1);

  return isNonUsa ? !isEmailVerified : (!isEmailVerified || !isPhoneVerified);
};
/**
 * Main component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
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
  const [primeCardReady, setPrimeCardReady] = useState(false);
  const [finalverifyvaultmain, setFinalverifyvaultmain] = useState(null);
  const [finalProfessionmain, setFinalProfessionmain] = useState(null);
  const [isAsyncStorageLoaded, setIsAsyncStorageLoaded] = useState(false);
  // freeTrail and daysleft state variables are replaced with synchronous memoized values below
  const [guestVerifyModalVisible, setGuestVerifyModalVisible] = useState(false);
  const [isSkippedFlow, setIsSkippedFlow] = useState(false);
  const [guestVerifyData, setGuestVerifyData] = useState(null);
  const [guestVerifyLoading, setGuestVerifyLoading] = useState(false);
  const [pendingGuestVerifyPayload, setPendingGuestVerifyPayload] = useState(null);
  const [forceNewProfession, setForceNewProfession] = useState(false);
  const [nonUsaFlowState, setNonUsaFlowState] = useState(null);
  const [nonUsaPermanentFlags, setNonUsaPermanentFlags] = useState({
    professionUpdateRequired: false,
    stateLicenseFlowCompleted: false,
  });
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isGuestPrimeUser, setIsGuestPrimeUser] = useState(false);
  const [isGuestPrimeReady, setIsGuestPrimeReady] = useState(false);
  const [hasAllProfTake, setHasAllProfTake] = useState(false);
  const [hasEnables, setHasEnables] = useState(false);
  const [exploreTrialClicked, setExploreTrialClicked] = useState(false);
  useEffect(() => {
    /**
* Load explore trial clicked utility.
*
* @async
* @returns {Promise<*>}
*/
    const loadExploreTrialClicked = async () => {
      try {
        const val = await AsyncStorage.getItem('ExploreTrialClicked');
        setExploreTrialClicked(val === 'true');
      } catch (error) {
        console.log('loadExploreTrialClicked error', error);
      }
    };
    if (isFocus) {
      loadExploreTrialClicked();
    }
  }, [isFocus]);
  const endDateStringMain =
    WebcastReducer?.PrimeCheckResponse?.subscription?.end_date ||
    AuthReducer?.loginResponse?.user?.subscriptions?.[0]?.end_date || AuthReducer?.againloginsiginResponse?.user?.subscriptions?.[0]?.end_date || AuthReducer?.loginsiginResponse?.user?.subscriptions?.[0]?.end_date ||
    finalProfessionmain?.subscriptions?.[0]?.end_date;
  const startDateStringMain =
    WebcastReducer?.PrimeCheckResponse?.subscription?.start_date ||
    AuthReducer?.loginResponse?.user?.subscriptions?.[0]?.start_date || AuthReducer?.againloginsiginResponse?.user?.subscriptions?.[0]?.start_date || AuthReducer?.loginsiginResponse?.user?.subscriptions?.[0]?.start_date ||
    finalProfessionmain?.subscriptions?.[0]?.start_date;
  const isSubscriptionExpiredSync = useMemo(() => {
    if (!endDateStringMain) return false;
    try {
      const endDate = new Date(endDateStringMain);
      const startDate = startDateStringMain ? new Date(startDateStringMain) : null;
      const currentDate = new Date();
      const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
      const normalizedStartDate = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
      return normalizedCurrentDate >= normalizedEndDate && (!normalizedStartDate || normalizedCurrentDate >= normalizedStartDate);
    } catch (e) {
      return false;
    }
  }, [endDateStringMain, startDateStringMain]);
  useEffect(() => {
    let mounted = true;
    if (isFocus) {
      readNonUsaFlowState().then(state => {
        if (mounted) {
          setNonUsaFlowState(state);
        }
      });
      readNonUsaPermanentFlags().then(flags => {
        if (mounted) {
          setNonUsaPermanentFlags(flags);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [isFocus]);

  const [showGuestPrimePrompt, setShowGuestPrimePrompt] = useState(false);
  const [resolvedIpCountryCode, setResolvedIpCountryCode] = useState(PRIME_CARD_TEST_COUNTRY_CODE);
  const [guestVerifyCheckRequested, setGuestVerifyCheckRequested] = useState(false);
  const guestVerifyNavigationRef = useRef(false);
  const guestVerifyRequestStartedRef = useRef(false);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const [nettruedr, setNettruedr] = useState("");
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const primePromptVisibleRef = useRef(false);
  const primeCardDelayRef = useRef(null);

  const isAccreditationUser =
    AuthReducer?.dircetloginResponse?.accreditation_user === true ||
    AuthReducer?.directloginResponse?.accreditation_user === true ||
    AuthReducer?.dircetloginResponse?.accreditation_user === 'true' ||
    AuthReducer?.directloginResponse?.accreditation_user === 'true' ||
    AuthReducer?.dircetloginResponse?.user?.accreditation_user === true ||
    AuthReducer?.directloginResponse?.user?.accreditation_user === true ||
    AuthReducer?.dircetloginResponse?.user?.accreditation_user === 'true' ||
    AuthReducer?.directloginResponse?.user?.accreditation_user === 'true';

  const mainProfileUserAddr = DashboardReducer?.mainprofileResponse?.user_address;
  const directUserAddr = AuthReducer?.dircetloginResponse?.user?.user_address || AuthReducer?.dircetloginResponse?.user_address || AuthReducer?.directloginResponse?.user?.user_address || AuthReducer?.directloginResponse?.user_address;

  const isAddressUsa = (
    mainProfileUserAddr?.country_code === 'US' ||
    mainProfileUserAddr?.country_code === 'USA' ||
    mainProfileUserAddr?.country_name === 'UNITED STATES' ||
    mainProfileUserAddr?.country_name === 'USA' ||
    directUserAddr?.country_code === 'US' ||
    directUserAddr?.country_code === 'USA' ||
    directUserAddr?.country_name === 'UNITED STATES' ||
    directUserAddr?.country_name === 'USA'
  );

  const isNonUsaUser = useMemo(() => {
    const userObj =
      DashboardReducer?.mainprofileResponse ||
      AuthReducer?.dircetloginResponse?.user ||
      AuthReducer?.dircetloginResponse ||
      AuthReducer?.directloginResponse?.user ||
      AuthReducer?.directloginResponse ||
      AuthReducer?.loginResponse?.user;

    const userCountryName = String(
      userObj?.user_address?.country_name ||
      userObj?.user_address?.country ||
      userObj?.country_name ||
      userObj?.country ||
      ''
    ).trim().toUpperCase();

    const userCountryCode = String(
      userObj?.user_address?.country_code ||
      userObj?.country_code ||
      ''
    ).trim().toUpperCase();

    const userCountryId = String(
      userObj?.user_address?.country_id ||
      userObj?.country_id ||
      ''
    ).trim();

    const ipCountry = String(resolvedIpCountryCode || nonUsaFlowState?.ipCountryCode || '').trim().toUpperCase();

    // 1. Check if IP Country is India or Non-USA
    if (ipCountry === 'IN' || ipCountry === 'INDIA' || (ipCountry !== '' && !isUsaCountryCode(ipCountry))) {
      return true;
    }

    // 2. Check if User Profile Country is India or non-USA ID (not 1 and not 233)
    if (userCountryName === 'INDIA' || userCountryName === 'IN' || userCountryCode === 'IN' || (userCountryId && userCountryId !== '1' && userCountryId !== '233' && userCountryId !== '0')) {
      return true;
    }

    // 3. Check explicit non-USA user flags
    if (userObj?.is_non_usa === true || userObj?.is_non_usa === 1 || userObj?.is_non_usa === '1' || nonUsaFlowState?.isNonUsa === true) {
      return true;
    }

    // 4. Check if USA location is positively confirmed
    const isUsaLocation = isUsaCountryCode(ipCountry) || isUsaCountryCode(userCountryName) || isUsaCountryCode(userCountryCode) || userCountryId === '1' || userCountryId === '233' || userObj?.usa_user === true || userObj?.usa_user === 1 || userObj?.usa_user === '1' || (ipCountry === '' && isAddressUsa && nonUsaFlowState?.isNonUsa !== true);

    if (isUsaLocation) {
      if (nonUsaFlowState?.isNonUsa) {
        clearNonUsaFlowState().catch(err => console.log('clearNonUsaFlowState error', err));
        setNonUsaFlowState(null);
      }
      return false;
    }
    return true;
  }, [resolvedIpCountryCode, nonUsaFlowState, isAddressUsa, DashboardReducer?.mainprofileResponse, AuthReducer?.dircetloginResponse]);
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
  useEffect(() => {
    if (primeCardDelayRef.current) {
      clearTimeout(primeCardDelayRef.current);
      primeCardDelayRef.current = null;
    }

    if (primeadd && !isDrawerVisible) {
      setPrimeCardReady(true);
    } else {
      setPrimeCardReady(false);
    }

    return () => {
      if (primeCardDelayRef.current) {
        clearTimeout(primeCardDelayRef.current);
        primeCardDelayRef.current = null;
      }
    };
  }, [primeadd, isDrawerVisible]);
  const { detectmain } = props?.route?.params || {}
  console.log(detectmain, "detectmain");
  const physicianHandles = new Set(["physician-md", "physician-do", "physician-dpm"]);
  const nursingHandles = new Set(["nursing-rn", "nursing-aprn", "nursing-cna", "nursing-lpn"]);
  const supportedProfessionHandles = [...physicianHandles, ...nursingHandles];
  const dashboardProfessionInfo = DashboardReducer?.mainprofileResponse?.professional_information;
  const authProfessionInfo =
    AuthReducer?.loginResponse?.user ||
    AuthReducer?.againloginsiginResponse?.user ||
    AuthReducer?.loginsiginResponse?.user ||
    AuthReducer?.signupResponse?.user ||
    AuthReducer?.verifymobileResponse?.user ||
    AuthReducer?.verifyemailResponse?.user ||
    AuthReducer?.verifyResponse?.user ||
    AuthReducer?.verifyResponse?.data ||
    (AuthReducer?.verifyResponse && typeof AuthReducer.verifyResponse === 'object' ? AuthReducer.verifyResponse : null) ||
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

  const cleanCurrentProf = String(dashboardProfession || authProfessionInfo?.profession || finalProfessionmain?.profession || '').toLowerCase();
  const cleanCurrentType = String(dashboardProfessionType || authProfessionInfo?.profession_type || finalProfessionmain?.profession_type || '').toLowerCase();

  const isPhysicianHandleMatch = physicianHandles.has(resolvedProfessionHandle) || cleanCurrentProf.includes('physician') || ['md', 'do', 'dpm'].includes(cleanCurrentType);
  const isNursingHandleMatch = nursingHandles.has(resolvedProfessionHandle) || cleanCurrentProf.includes('nursing') || ['rn', 'aprn', 'cna', 'lpn'].includes(cleanCurrentType);

  const allProfTake = isPhysicianHandleMatch;
  const isPhysicianFlow = allProfTake;
  const isNursingFlow = isNursingHandleMatch && !isPhysicianFlow;

  useEffect(() => {
    if (allProfTake) {
      setHasAllProfTake(true);
    }
  }, [allProfTake]);

  useEffect(() => {
    if (enables) {
      setHasEnables(true);
    }
  }, [enables]);
  const shouldHoldSkeleton = !isAsyncStorageLoaded;
  const dashboardLicenses = DashboardReducer?.dashMbResponse?.data?.licensures || DashboardReducer?.dashboardResponse?.data?.licensures || DashboardReducer?.dashPerResponse?.data?.licensures || [];
  const hasAnyLicenseData = dashboardLicenses.length > 0 || Boolean(
    DashboardReducer?.mainprofileResponse?.licensures?.length ||
    DashboardReducer?.mainprofileResponse?.license_number ||
    finalverifyvaultmain?.license_number ||
    finalProfessionmain?.license_number
  );
  const shouldShowMainAddLicenseCard =
    nonUsaPermanentFlags?.stateLicenseFlowCompleted === true &&
    !hasAnyLicenseData;
  const bottomBannerSpacing = useMemo(() => {
    if ((enables || isSubscriptionExpiredSync) && allProfTake) {
      return normalize(96);
    }
    if (freeTrail) {
      return normalize(150);
    }
    return Platform.OS === 'ios' ? normalize(16) : normalize(80);
  }, [allProfTake, enables, freeTrail, isSubscriptionExpiredSync]);
  const homeBottomSpacing = useMemo(
    () => bottomBannerSpacing + (Platform.OS === 'ios' ? 0 : Math.max(insets.bottom, normalize(8))),
    [bottomBannerSpacing, insets.bottom]
  );
  console.log("isPhysicianFlow", isPhysicianFlow, fulldashbaord);
  console.log("isNursingFlow", isNursingFlow, isSubscriptionExpiredSync);
  const lastLicenseProfRef = useRef(null);

  // 🔹 Sync licensure requirements when profession changes
  useEffect(() => {
    if (!isFocus) return;

    const profInfo = DashboardReducer?.mainprofileResponse?.professional_information || {};
    const professionRaw = String(profInfo.profession || '').trim();
    const profTypeRaw = String(profInfo.profession_type || profInfo.designation || '').trim();

    if (!professionRaw) return;
    const cleanProf = professionRaw.split(' - ')[0].trim();
    const cleanType = profTypeRaw || (professionRaw.split(' - ')[1] || '').trim();
    const professionLabel = cleanProf && cleanType ? `${cleanProf} - ${cleanType}` : professionRaw;

    if (lastLicenseProfRef.current !== professionLabel) {
      console.log('[Main.js/LicensureSync] Change detected:', { old: lastLicenseProfRef.current, new: professionLabel });
      lastLicenseProfRef.current = professionLabel;
      connectionrequest()
        .then(() => {
          console.log('[Main.js/LicensureSync] Dispatching licesensRequest for:', professionLabel);
          dispatch(licesensRequest(professionLabel));
        })
        .catch(err => console.log('Licensure refresh failed', err));
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
    if (!isAsyncStorageLoaded) {
      setShowLoader(false);
      return;
    }
    setShowLoader(true);
  }, [isFocus, isAsyncStorageLoaded, DashboardReducer?.status]);
  const backPressCount = useRef(0);
  const isSnackbarVisible = useRef(false);
  const snackbarTimeout = useRef(null);
  useEffect(() => {
    /**
* Reset state utility.
* @returns {void}
*/
    const resetState = () => {
      backPressCount.current = 0;
      isSnackbarVisible.current = false;
      if (snackbarTimeout.current) {
        clearTimeout(snackbarTimeout.current);
        snackbarTimeout.current = null;
      }
    };

    /**
* On back press utility.
* @returns {boolean}
*/
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
          /**
* On press utility.
* @returns {void}
*/
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
  const shouldRenderDashboardContent = !shouldHoldSkeleton && (showloader || isPhysicianFlow || (!isPhysicianFlow && !isNursingFlow));
  const dashboardLicensesMain = DashboardReducer?.dashMbResponse?.data?.licensures || DashboardReducer?.dashboardResponse?.data?.licensures || [];
  const hasNoLicensuresMain = !Array.isArray(dashboardLicensesMain) || dashboardLicensesMain.length === 0;
  const hasNonUsaStateDataMain = Boolean(DashboardReducer?.stateMandatoryResponse?.state_data?.['-1']);

  const shouldRenderNewProfession =
    (!isPhysicianFlow && !isNursingFlow) || forceNewProfession || (hasNoLicensuresMain && hasNonUsaStateDataMain);
  const normalizedFulldashbaord = Array.isArray(fulldashbaord) ? fulldashbaord : [];
  /**
* Render main add license card utility.
* @returns {JSX.Element}
*/
  const renderMainAddLicenseCard = () => (
    <View style={{
      marginHorizontal: normalize(10),
      marginTop: normalize(4),
      marginBottom: normalize(12),
    }}>
      <View style={{
        borderRadius: normalize(18),
        backgroundColor: '#FFF8EC',
        borderWidth: 1,
        borderColor: '#F5D39B',
        overflow: 'hidden',
      }}>
        <View style={{
          backgroundColor: '#FFEDCA',
          paddingVertical: normalize(12),
          paddingHorizontal: normalize(16),
        }}>
          <Text style={{
            fontFamily: Fonts.InterSemiBold,
            fontSize: 16,
            color: '#000000',
          }}>
            {'Add License'}
          </Text>
        </View>
        <View style={{
          paddingHorizontal: normalize(16),
          paddingVertical: normalize(16),
        }}>
          <Text style={{
            fontFamily: Fonts.InterRegular,
            fontSize: 14,
            lineHeight: 20,
            color: '#1F2937',
          }}>
            {'Add at least one valid state license to unlock Credit Vault access.'}
          </Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('AddLicense', { profile: 'main' })}
            style={{
              marginTop: normalize(14),
              alignSelf: 'flex-start',
              backgroundColor: Colorpath.ButtonColr,
              borderRadius: normalize(8),
              paddingHorizontal: normalize(16),
              paddingVertical: normalize(10),
            }}
          >
            <Text style={{
              fontFamily: Fonts.InterSemiBold,
              fontSize: 14,
              color: Colorpath.white,
            }}>
              {'Add License'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  useEffect(() => {
    setFreeze(false);
    enableFreeze(false);
  }, []);
  useEffect(() => {
    /**
* Token handle vault utility.
* @returns {void}
*/
    const token_handle_vault = () => {
      (async () => {
        try {
          const [board_special, profession_data, stablePrimeFlagRaw] = await Promise.all([
            AsyncStorage.getItem(constants.VERIFYSTATEDATA),
            AsyncStorage.getItem(constants.PROFESSION),
            AsyncStorage.getItem(constants.GUEST_PRIME_USER),
            AsyncStorage.getItem('activeProfile'),
          ]);
          const board_special_json = board_special ? JSON.parse(board_special) : null;
          const profession_data_json = profession_data ? JSON.parse(profession_data) : null;
          const professionSubscriptionUser = String(profession_data_json?.subscription_user || '').trim().toLowerCase();
          console.log(professionSubscriptionUser, 'professionData======112');
          const professionSubscriptions = Array.isArray(profession_data_json?.subscriptions) ? profession_data_json.subscriptions : [];
          const isPrimeProfileFromProfession = professionSubscriptionUser === 'non-subscribed' && professionSubscriptions.length === 0;
          setFinalverifyvaultmain(board_special_json);
          setFinalProfessionmain(profession_data_json);
          setIsGuestPrimeUser(isPrimeProfileFromProfession);
          setIsGuestPrimeReady(true);
          setIsAsyncStorageLoaded(true);
        } catch (error) {
          console.log('Error fetching data:', error);
          setIsGuestPrimeReady(true);
          setIsAsyncStorageLoaded(true);
        }
      })();
    };

    token_handle_vault();
  }, [isFocus]);
  useEffect(() => {
    if (AuthReducer?.status !== 'Auth/verifySuccess') return;

    let isMounted = true;
    const syncVerifiedState = async () => {
      try {
        const [verifyRaw, professionRaw, guestCompletedRaw] = await Promise.all([
          AsyncStorage.getItem(constants.VERIFYSTATEDATA),
          AsyncStorage.getItem(constants.PROFESSION),
          AsyncStorage.getItem(GUEST_VERIFICATION_COMPLETED_KEY),
        ]);
        if (!isMounted) return;

        const verifyData = parseStoredJson(verifyRaw);
        const professionData = parseStoredJson(professionRaw);
        const verifyResponseUser =
          AuthReducer?.verifyResponse?.user ||
          AuthReducer?.verifyResponse?.data ||
          (AuthReducer?.verifyResponse && typeof AuthReducer.verifyResponse === 'object'
            ? AuthReducer.verifyResponse
            : null);

        const mergedVerifyData = verifyResponseUser ? { ...(verifyData || {}), ...verifyResponseUser } : verifyData;
        const mergedProfessionData = professionData
          ? { ...professionData, ...(mergedVerifyData || {}) }
          : mergedVerifyData;

        if (mergedVerifyData) {
          setFinalverifyvaultmain(mergedVerifyData);
        }
        if (mergedProfessionData) {
          setFinalProfessionmain(mergedProfessionData);
        }
        setIsAsyncStorageLoaded(true);

        if (guestCompletedRaw === 'true') {
          setGuestVerifyModalVisible(false);
          setGuestVerifyData(null);
          setPrimeadd(false);
          primePromptVisibleRef.current = false;
          setShowGuestPrimePrompt(false);
        }

        connectionrequest()
          .then(() => {
            dispatch(mainprofileRequest({}));
          })
          .catch((err) => console.log('verifySuccess mainprofile refresh error', err));
      } catch (error) {
        console.log('syncVerifiedState error', error);
      }
    };

    syncVerifiedState();

    return () => {
      isMounted = false;
    };
  }, [AuthReducer?.status, AuthReducer?.verifyResponse]);
  console.log(isGuestPrimeUser, "isGuestPrimeUser=====", props?.route?.name)
  useEffect(() => {
    /**
* Load profile utility.
*
* @async
* @returns {Promise<*>}
*/
    const loadProfile = async () => {
      try {
        const [profile, stablePrimeFlagRaw, professionRaw] = await Promise.all([
          AsyncStorage.getItem('activeProfile'),
          AsyncStorage.getItem(constants.GUEST_PRIME_USER),
          AsyncStorage.getItem(constants.PROFESSION),
        ]);
        const stablePrimeFlag = stablePrimeFlagRaw === 'true';
        const professionData = parseStoredJson(professionRaw);
        const professionSubscriptionUser = String(professionData?.subscription_user || '').trim().toLowerCase();
        const professionSubscriptions = Array.isArray(professionData?.subscriptions) ? professionData.subscriptions : [];
        const isPrimeProfileFromProfession = professionSubscriptionUser === 'non-subscribed' && professionSubscriptions.length === 0;
        const isPrimeProfile = isPrimeProfileFromProfession;
        setIsGuestPrimeUser(isPrimeProfile);
        if (!isPrimeProfile) {
          if (profile === 'PrimeCard') {
            await AsyncStorage.removeItem('activeProfile');
          }
          setCurrentProfile(profile === 'PrimeCard' ? null : profile);
        } else {
          setCurrentProfile(profile || 'PrimeCard');
        }
        setIsGuestPrimeReady(true);
      } catch (error) {
        console.log('Error loading activeProfile', error);
        setIsGuestPrimeReady(true);
      }
    };
    if (isFocus) {
      loadProfile();
    }
  }, [isFocus]);
  useEffect(() => {
    const hasDashboardData = !!DashboardReducer?.dashboardResponse?.data;
    const user = DashboardReducer?.dashboardResponse?.data?.user_information || DashboardReducer?.mainprofileResponse?.user || DashboardReducer?.mainprofileResponse || AuthReducer?.loginResponse?.user || AuthReducer?.againloginsiginResponse?.user || AuthReducer?.loginsiginResponse?.user || AuthReducer?.verifymobileResponse?.user || finalverifyvaultmain || finalProfessionmain;

    console.log('[PrimeRedirection] Check:', {
      isFocus,
      hasDashboardData,
      user_usa: user?.usa_user,
      userExists: !!user,
    });
    if (!isGuestPrimeReady) {
      return;
    }
    if (currentProfile === 'SkipProfile') {
      return;
    }
    if (primePromptVisibleRef.current || primeadd || showGuestPrimePrompt) {
      return;
    }
    if (isFocus && hasDashboardData && user?.usa_user === true && isPhysicianFlow) {
      const primeTrailSuccess = AuthReducer?.status === 'Auth/primeTrailSuccess' || (AuthReducer?.primeTrailResponse && Object.keys(AuthReducer.primeTrailResponse).length > 0);
      const PrimePaymentSuccess = WebcastReducer?.status === 'WebCast/PrimePaymentSuccess' || WebcastReducer?.PrimePaymentResponse?.msg === 'You are now enrolled for subscription successfully.';
      const primeCheckResponse = WebcastReducer?.PrimeCheckResponse;
      const hasSubscriptionData = Array.isArray(user?.subscription) && user.subscription.length > 0;
      const isPrimeActive = primeTrailSuccess || PrimePaymentSuccess || isPrimeSubscriptionActive(primeCheckResponse) || hasSubscriptionData;
      const primeCheckCompleted = Object.keys(primeCheckResponse || {}).length > 0 || WebcastReducer?.status === 'WebCast/PrimeCheckFailure';

      console.log('[PrimeRedirection] Inside Condition:', {
        primeTrailSuccess,
        PrimePaymentSuccess,
        isPrimeActive,
        primeCheckCompleted,
        isPrimeSubscriptionMissing: isPrimeSubscriptionMissing(primeCheckResponse),
        primeCheckResponse
      });

      if (isPrimeActive || enables || isSubscriptionExpiredSync) {
        console.log('[PrimeRedirection] Prime Active or Expired (enables/sync), route:', props.route.name);
        AsyncStorage.getItem('activeProfile').then((activeProfile) => {
          if (activeProfile === 'PrimeCard') {
            return;
          }
          if (activeProfile !== 'SkipProfile') {
            AsyncStorage.removeItem('activeProfile').then(() => {
              setCurrentProfile(null);
            }).catch(err => console.log('Error removing activeProfile', err));
          }
        }).catch(err => console.log('Error checking activeProfile on redirection', err));
        if (props.route.name !== 'Home') {
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'TabNav' }]
            })
          );
        }
      }
    }
  }, [isFocus, DashboardReducer?.dashboardResponse?.data, DashboardReducer?.mainprofileResponse, AuthReducer.status, AuthReducer.primeTrailResponse, WebcastReducer.status, WebcastReducer.PrimePaymentResponse, WebcastReducer.PrimeCheckResponse, isPhysicianFlow, enables, isSubscriptionExpiredSync, primeadd, showGuestPrimePrompt, currentProfile, isGuestPrimeUser, isGuestPrimeReady]);

  const ipAddress = getPublicIP();
  useEffect(() => {
    if (PRIME_CARD_TEST_COUNTRY_CODE) {
      setResolvedIpCountryCode(PRIME_CARD_TEST_COUNTRY_CODE);
      return;
    }
    let isMounted = true;
    /**
* Fetch country utility.
*
* @async
* @returns {Promise<*>}
*/
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
    /**
* Load forced profession view utility.
*
* @async
* @returns {Promise<*>}
*/
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

  useEffect(() => {
    if (!isFocus || primeCardSessionSkipped) return;
    const directLoginUser =
      AuthReducer?.dircetloginResponse?.user ||
      AuthReducer?.dircetloginResponse ||
      AuthReducer?.directloginResponse?.user ||
      AuthReducer?.directloginResponse ||
      DashboardReducer?.mainprofileResponse ||
      AuthReducer?.loginResponse?.user ||
      finalProfessionmain;

    const subUser = String(directLoginUser?.subscription_user || '').trim().toLowerCase();
    const subList = Array.isArray(directLoginUser?.subscriptions) ? directLoginUser.subscriptions : [];
    const isNonSubscribedUser = (subUser === "non-subscribed" || subUser === "" || !directLoginUser?.subscription_user) && subList.length === 0;

    const isHasActiveFreeTrial =
      exploreTrialClicked ||
      AuthReducer?.status === 'Auth/primeTrailSuccess' ||
      (AuthReducer?.primeTrailResponse && Object.keys(AuthReducer.primeTrailResponse).length > 0) ||
      subUser === "free" ||
      subUser === "subscribed";

    if (!isNonUsaUser && (isPhysicianFlow || allProfTake || hasAllProfTake) && isNonSubscribedUser && !hasActivePrimeMembership && !isHasActiveFreeTrial) {
      setPrimeadd(true);
    }
  }, [isFocus, primeCardSessionSkipped, isNonUsaUser, isPhysicianFlow, allProfTake, hasAllProfTake, hasActivePrimeMembership, exploreTrialClicked, AuthReducer?.status, AuthReducer?.primeTrailResponse, AuthReducer?.dircetloginResponse, DashboardReducer?.mainprofileResponse, finalProfessionmain]);
  /**
* Open guest verification alert utility.
*
* @async
* @param {*} user - Input value.
* @param {boolean} shouldClearPendingKey - Input value.
* @returns {Promise<*>}
*/
  const openGuestVerificationAlert = async (user, shouldClearPendingKey = false) => {
    if (!user || isAccreditationUser) return;
    if (shouldClearPendingKey) {
      try {
        await AsyncStorage.removeItem(GUEST_PRIME_VERIFICATION_PENDING_KEY);
      } catch (error) {
        console.log('openGuestVerificationAlert clear pending error', error);
      }
    }
    setGuestVerifyData(user);
    setPrimeadd(false);
    primePromptVisibleRef.current = false;
    setShowGuestPrimePrompt(false);
    setTimeout(() => {
      setGuestVerifyModalVisible(true);
    }, 500);
  };
  /**
* Request guest verification check utility.
*
* @async
* @returns {Promise<*>}
*/
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
  /**
* Set guest prime verification pending utility.
*
* @async
* @returns {Promise<*>}
*/
  const setGuestPrimeVerificationPending = async () => {
    try {
      await AsyncStorage.setItem(GUEST_PRIME_VERIFICATION_PENDING_KEY, 'true');
    } catch (error) {
      console.log('setGuestPrimeVerificationPending error', error);
    }
  };
  /**
* Handles guest prime skip.
*
* @async
* @returns {Promise<*>}
*/
  const handleGuestPrimeSkip = async () => {
    try {
      await AsyncStorage.setItem('SessionPrimeSkipped', 'true');
      await AsyncStorage.setItem('PrimeMembershipSkipped', 'true');
      await AsyncStorage.setItem('activeProfile', 'SkipProfile');
      await AsyncStorage.removeItem('ExploreTrialClicked');
      setCurrentProfile('SkipProfile');
      setExploreTrialClicked(false);
      setPrimeCardSessionSkipped(true);
    } catch (error) {
      console.log('handleGuestPrimeSkip flag error', error);
    }
    setPrimeadd(false);
    primePromptVisibleRef.current = false;
    setShowGuestPrimePrompt(false);
  };
  const handlePrimeCardDismiss = async () => {
    try {
      await AsyncStorage.setItem('SessionPrimeSkipped', 'true');
      await AsyncStorage.setItem('PrimeMembershipSkipped', 'true');
      await AsyncStorage.setItem('activeProfile', 'SkipProfile');
      await AsyncStorage.removeItem('ExploreTrialClicked');
      setCurrentProfile('SkipProfile');
      setExploreTrialClicked(false);
      setPrimeCardSessionSkipped(true);
    } catch (error) {
      console.log('handlePrimeCardDismiss flag error', error);
    }
    primePromptVisibleRef.current = false;
    setPrimeadd(false);
    setShowGuestPrimePrompt(false);
  };
  /**
* Handles guest prime explore trial.
*
* @async
* @returns {Promise<*>}
*/
  const handleGuestPrimeExploreTrial = async () => {
    await setGuestPrimeVerificationPending();
    await AsyncStorage.removeItem('activeProfile');
    await AsyncStorage.setItem('ExploreTrialClicked', 'true');
    setExploreTrialClicked(true);
    try {
      dispatch(primeTrailRequest({}));
    } catch (error) {
      console.log('handleGuestPrimeExploreTrial flag error', error);
    }
    setPrimeadd(false);
    primePromptVisibleRef.current = false;
    setShowGuestPrimePrompt(false);
  };
  /**
* Handles guest prime membership.
*
* @async
* @returns {Promise<*>}
*/
  const handleGuestPrimeMembership = async () => {
    await AsyncStorage.setItem('activeProfile', 'PrimeCard');
    await AsyncStorage.removeItem('ExploreTrialClicked');
    setExploreTrialClicked(false);
    await AsyncStorage.setItem('PrimeCardFlowComplete', 'true');
    await AsyncStorage.setItem('PrimeMembershipSkipped', 'false');
    await AsyncStorage.removeItem('SessionPrimeSkipped');
    await AsyncStorage.removeItem(PRIME_MEMBERSHIP_PROMPT_PENDING_KEY);
    require('react-native').DeviceEventEmitter.emit('ACTIVE_PROFILE_CHANGED', 'PrimeCard');
    await setGuestPrimeVerificationPending();
    setPrimeadd(false);
    primePromptVisibleRef.current = false;
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
    /**
* Load guest verify modal utility.
*
* @async
* @returns {Promise<*>}
*/
    const loadGuestVerifyModal = async () => {
      try {
        const [accreditationUserRaw, bypassLicenseExpiryRaw] = await Promise.all([
          AsyncStorage.getItem('ACCREDITATION_USER'),
          AsyncStorage.getItem('BYPASS_LICENSE_EXPIRY'),
        ]);
        if (
          accreditationUserRaw === 'true' ||
          bypassLicenseExpiryRaw === 'true' ||
          isAccreditationUser
        ) {
          setShowGuestPrimePrompt(false);
          primePromptVisibleRef.current = false;
          setGuestVerifyModalVisible(false);
          setPrimeadd(false);
          return;
        }

        if (guestVerifyNavigationRef.current) {
          return;
        }
        if (AuthReducer?.status === 'Auth/verifyRequest') {
          return;
        }
        const [
          guestFlowRaw,
          verifyRaw,
          professionRaw,
          guestPrimeVerifyPendingRaw,
          guestVerificationCompletedRaw,
          primeMembershipSkippedRaw,
          primeCardFlowCompleteRaw,
          exploreTrialClickedRaw,
          suppressGuestPromptsOnceRaw,
          isGuestConvertedUserRaw,
          sessionPrimeSkippedRaw,
          primeMembershipPromptPendingRaw,
        ] = await Promise.all([
          AsyncStorage.getItem(GUEST_REGISTRATION_FLOW_KEY),
          AsyncStorage.getItem(constants.VERIFYSTATEDATA),
          AsyncStorage.getItem(constants.PROFESSION),
          AsyncStorage.getItem(GUEST_PRIME_VERIFICATION_PENDING_KEY),
          AsyncStorage.getItem(GUEST_VERIFICATION_COMPLETED_KEY),
          AsyncStorage.getItem(PRIME_MEMBERSHIP_SKIPPED_KEY),
          AsyncStorage.getItem('PrimeCardFlowComplete'),
          AsyncStorage.getItem('ExploreTrialClicked'),
          AsyncStorage.getItem(SUPPRESS_GUEST_HOME_PROMPTS_ONCE_KEY),
          AsyncStorage.getItem('IS_GUEST_CONVERTED_USER'),
          AsyncStorage.getItem('SessionPrimeSkipped'),
          AsyncStorage.getItem(PRIME_MEMBERSHIP_PROMPT_PENDING_KEY),
        ]);
        const suppressGuestPromptsOnce = suppressGuestPromptsOnceRaw === 'true';
        const guestFlowData = parseStoredJson(guestFlowRaw);
        const isGuestFlow = Boolean(guestFlowData);
        const isGuestConvertedUser = isGuestConvertedUserRaw === 'true';
        const isAnyGuestFlow = isGuestFlow || isGuestConvertedUser;
        const isSkippedFlowVal = primeMembershipSkippedRaw === 'true';
        setIsSkippedFlow(isSkippedFlowVal);
        const isSessionSkippedVal = sessionPrimeSkippedRaw === 'true';
        if (isSessionSkippedVal && !primeCardSessionSkipped) {
          setPrimeCardSessionSkipped(true);
        }
        const isVerificationPending = guestPrimeVerifyPendingRaw === 'true';
        const isPrimeCardFlowComplete = primeCardFlowCompleteRaw === 'true';
        const isExploreTrialClicked = exploreTrialClickedRaw === 'true';
        const isGuestVerificationCompleted = guestVerificationCompletedRaw === 'true';
        const isPrimeMembershipPromptPending = primeMembershipPromptPendingRaw === 'true';
        const verifyResponseData = AuthReducer?.verifyResponse?.user || AuthReducer?.verifyResponse || null;
        const hasFreshVerifyResponse =
          Boolean(verifyResponseData && Object.keys(verifyResponseData).length > 0);

        if (!resolvedIpCountryCode) {
          return;
        }

        if (primePromptVisibleRef.current) {
          return;
        }



        if (isGuestVerificationCompleted || isExploreTrialClicked) {
          setGuestVerifyModalVisible(false);
          setGuestVerifyData(null);
          setGuestVerifyLoading(false);
          return;
        }


        const verifyData = parseStoredJson(verifyRaw);
        const professionData = parseStoredJson(professionRaw);
        console.log(professionRaw, "professionRaw======456465456", professionData?.subscription_user);
        const user = verifyResponseData || verifyData || professionData || DashboardReducer?.mainprofileResponse || authProfessionInfo;
        const isUsaLocation = resolvedIpCountryCode === 'US' || resolvedIpCountryCode === 'USA';
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

        const isEligibleCountry = isUsaLocation;
        const isUsa =
          user?.usa_user === true ||
          user?.usa_user === 1 ||
          user?.usa_user === '1';

        const loginUser =
          professionData ||
          AuthReducer?.dircetloginResponse?.user ||
          AuthReducer?.dircetloginResponse ||
          AuthReducer?.directloginResponse?.user ||
          AuthReducer?.directloginResponse ||
          AuthReducer?.loginResponse?.user ||
          AuthReducer?.againloginsiginResponse?.user ||
          AuthReducer?.loginsiginResponse?.user ||
          AuthReducer?.signupResponse?.user;

        const activeUser = loginUser?.user ? loginUser.user : loginUser || professionData;
        const hasActivePrimeTrial =
          isExploreTrialClicked ||
          AuthReducer?.status === 'Auth/primeTrailSuccess' ||
          (AuthReducer?.primeTrailResponse && Object.keys(AuthReducer.primeTrailResponse).length > 0) ||
          activeUser?.subscription_user === "free" ||
          activeUser?.subscription_user === "subscribed";

        const isNonSubscribedNoSubscription =
          !hasActivePrimeTrial &&
          (activeUser?.subscription_user === "non-subscribed" ||
            !activeUser?.subscriptions ||
            activeUser?.subscriptions === 0 ||
            (Array.isArray(activeUser?.subscriptions) && activeUser?.subscriptions.length === 0)) &&
          (!activeUser?.subscription || activeUser?.subscription?.length === 0 || activeUser?.subscription === 0);

        const physicianHandles = isEligibleGuestPhysician;
        console.log(professionRaw, "ewerktkjerh", activeUser, isNonSubscribedNoSubscription);

        if (
          !isNonUsaUser &&
          !isPrimeCardFlowComplete &&
          !isExploreTrialClicked &&
          !hasActivePrimeTrial &&
          (isNonSubscribedNoSubscription || isPrimeMembershipPromptPending) &&
          physicianHandles &&
          !isSessionSkippedVal
        ) {
          await AsyncStorage.setItem(PRIME_MEMBERSHIP_PROMPT_PENDING_KEY, 'true');
          setGuestVerifyData(user);
          setGuestVerifyModalVisible(false);
          primePromptVisibleRef.current = true;
          setShowGuestPrimePrompt(true);
          setPrimeadd(true);
          return;
        }

        const accountAlreadyVerified = Boolean(
          user &&
          !requiresVerification(user, !isUsaLocation, AuthReducer?.verifyResponse, verifyData)
        );
        if (accountAlreadyVerified) {
          await Promise.all([
            AsyncStorage.removeItem(GUEST_REGISTRATION_FLOW_KEY),
            AsyncStorage.removeItem('IS_GUEST_CONVERTED_USER'),
            AsyncStorage.removeItem(GUEST_PRIME_VERIFICATION_PENDING_KEY),
            AsyncStorage.setItem(GUEST_VERIFICATION_COMPLETED_KEY, 'true'),
          ]);
          setGuestVerifyModalVisible(false);
          setGuestVerifyData(null);
          setGuestVerifyLoading(false);
          primePromptVisibleRef.current = false;
          setShowGuestPrimePrompt(false);
          return;
        }

        const shouldRequireVerification = Boolean(
          user &&
          requiresVerification(user, !isUsaLocation, AuthReducer?.verifyResponse, verifyData)
        );

        if (suppressGuestPromptsOnce) {
          await AsyncStorage.removeItem(SUPPRESS_GUEST_HOME_PROMPTS_ONCE_KEY);
          setGuestVerifyModalVisible(false);
          setGuestVerifyData(null);
          return;
        }

        if (!isAnyGuestFlow && !isSkippedFlowVal && !shouldRequireVerification) {
          return;
        }

        const isNonUsaGuest = !isUsaLocation;
        const shouldShowPrimeFirst = Boolean(
          isNonSubscribedNoSubscription &&
          physicianHandles &&
          !isSessionSkippedVal
        );

        const shouldCheckVerificationNow =
          !shouldShowPrimeFirst &&
          !isVerificationPending &&
          !hasFreshVerifyResponse &&
          !isGuestVerificationCompleted &&
          user;

        if (shouldCheckVerificationNow) {
          setGuestVerifyData(user);
          await setGuestPrimeVerificationPending();
          await requestGuestVerificationCheck();
          return;
        }

        if (isVerificationPending) {
          if (!hasFreshVerifyResponse) {
            setGuestVerifyModalVisible(false);
            return;
          }
          if (user) {
            if (requiresVerification(user, isNonUsaGuest, AuthReducer?.verifyResponse, verifyData)) {
              await openGuestVerificationAlert(user, true);
            } else {
              await AsyncStorage.removeItem(GUEST_REGISTRATION_FLOW_KEY);
              await AsyncStorage.removeItem('IS_GUEST_CONVERTED_USER');
              await AsyncStorage.removeItem(GUEST_PRIME_VERIFICATION_PENDING_KEY);
              await AsyncStorage.setItem(GUEST_VERIFICATION_COMPLETED_KEY, 'true');
              setGuestVerifyModalVisible(false);
              setGuestVerifyData(null);
            }
          }
          return;
        }

        if (hasFreshVerifyResponse && user) {
          if (requiresVerification(user, isNonUsaGuest, AuthReducer?.verifyResponse, verifyData)) {
            setGuestVerifyData(user);
            setTimeout(() => {
              setGuestVerifyModalVisible(true);
            }, 500);
          } else {
            await AsyncStorage.removeItem(GUEST_REGISTRATION_FLOW_KEY);
            await AsyncStorage.removeItem('IS_GUEST_CONVERTED_USER');
            await AsyncStorage.removeItem(GUEST_PRIME_VERIFICATION_PENDING_KEY);
            await AsyncStorage.setItem(GUEST_VERIFICATION_COMPLETED_KEY, 'true');
            setGuestVerifyModalVisible(false);
            setGuestVerifyData(null);
          }
        }
      } catch (error) {
        console.log('loadGuestVerifyModal error', error);
      }
    };
    loadGuestVerifyModal();
  }, [isFocus, hasActivePrimeMembership, allProfTake, dashboardProfessionType, dashboardProfessionInfo?.profession, authProfessionInfo?.profession, authProfessionInfo?.profession_type, resolvedIpCountryCode, AuthReducer?.status, AuthReducer?.verifyResponse, primeCardSessionSkipped, DashboardReducer?.mainprofileResponse, AuthReducer?.dircetloginResponse]);
  const subscription = WebcastReducer?.PrimeCheckResponse?.subscription;
  const isPrimePaymentSuccess =
    WebcastReducer?.PrimePaymentResponse?.msg === 'You are now enrolled for subscription successfully.';
  const hasActivePrimeMembership = Boolean(subscription || isPrimePaymentSuccess);
  const isPrimeTrial = useMemo(() => {
    return !hasActivePrimeMembership && subscription == false && allProfTake;
  }, [subscription, allProfTake, hasActivePrimeMembership]);

  const _subUserStates = [
    finalProfessionmain?.subscription_user,
    AuthReducer?.loginResponse?.user?.subscription_user,
    AuthReducer?.againloginsiginResponse?.user?.subscription_user,
    AuthReducer?.loginsiginResponse?.user?.subscription_user,
    finalverifyvaultmain?.subscription_user
  ];
  const takeSub = !hasActivePrimeMembership && (isPrimeTrial || _subUserStates.includes("free") || _subUserStates.includes("non-subscribed"));
  const hsdSub = !hasActivePrimeMembership && (_subUserStates.includes("non-subscribed") || isPrimeTrial);
  const { freeTrail, daysleft } = useMemo(() => {
    if (!endDateStringMain) {
      return { freeTrail: takeSub, daysleft: false };
    }
    try {
      const endDate = new Date(endDateStringMain);
      const currentDate = new Date();
      const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
      const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
      const timeDiff = normalizedEndDate.getTime() - normalizedCurrentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      const timeDifference = normalizedEndDate - normalizedCurrentDate;
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
      if (daysDifference <= 30) {
        return { freeTrail: true, daysleft: daysDiff };
      }
      return { freeTrail: false, daysleft: false };
    } catch (e) {
      return { freeTrail: takeSub, daysleft: false };
    }
  }, [endDateStringMain, takeSub]);
  const primeTrialMessage = useMemo(() => {
    return freeTrail && hsdSub
      ? 'Thank you for exploring Prime Membership.\nClick Subscribe now to join.'
      : freeTrail && daysleft == 30
        ? 'Thank you for exploring Prime Membership.\nClick Subscribe now to join.'
        : daysleft
          ? Math.abs(daysleft) > 29
            ? 'Thank you for exploring Prime Membership.\nClick Subscribe now to join.'
            : `Your free trial of premium subscription will end in ${Math.abs(
              daysleft,
            )} day(s). Subscribe now to continue accessing premium features`
          : '';
  }, [daysleft, freeTrail, hsdSub]);
  /**
* Set free trail utility.
* @returns {void}
*/
  const setFreeTrail = () => { };
  /**
* Set daysleft utility.
* @returns {void}
*/
  const setDaysleft = () => { };
  const isNonUsaIpUser = Boolean(
    resolvedIpCountryCode &&
    resolvedIpCountryCode !== 'US' &&
    resolvedIpCountryCode !== 'USA' &&
    resolvedIpCountryCode !== 'unknown'
  );
  useEffect(() => {
    if (endDateStringMain && allProfTake) {
      const endDateString =
        WebcastReducer?.PrimeCheckResponse?.subscription?.end_date ||
        AuthReducer?.loginResponse?.user?.subscriptions?.[0]?.end_date || AuthReducer?.againloginsiginResponse?.user?.subscriptions?.[0]?.end_date || AuthReducer?.loginsiginResponse?.user?.subscriptions?.[0]?.end_date ||
        finalProfessionmain?.subscriptions?.[0]?.end_date;
      const startDateString =
        WebcastReducer?.PrimeCheckResponse?.subscription?.start_date ||
        AuthReducer?.loginResponse?.user?.subscriptions?.[0]?.start_date || AuthReducer?.againloginsiginResponse?.user?.subscriptions?.[0]?.start_date || AuthReducer?.loginsiginResponse?.user?.subscriptions?.[0]?.start_date ||
        finalProfessionmain?.subscriptions?.[0]?.start_date;
      if (!endDateString) return;
      try {
        const endDate = new Date(endDateString);
        const startDate = startDateString ? new Date(startDateString) : null;
        const currentDate = new Date();
        const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
        const normalizedStartDate = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
        const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
        if (normalizedCurrentDate >= normalizedEndDate && (!normalizedStartDate || normalizedCurrentDate >= normalizedStartDate)) {
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
  /**
* Close guest verify modal utility.
*
* @async
* @returns {Promise<*>}
*/
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
  /**
* Proceed guest verification utility.
*
* @async
* @param {*} verifyPayload - Input value.
* @returns {Promise<*>}
*/
  const proceedGuestVerification = async verifyPayload => {
    const countryCode =
      verifyPayload?.countryCode ||
      verifyPayload?.callingCode ||
      (verifyPayload?.usa_user ? '+1' : '');
    const isEmailVerified = String(verifyPayload?.is_verified ?? verifyPayload?.email_verified ?? '0') === '1';
    const isPhoneVerified = String(verifyPayload?.phone_verified ?? '0') === '1';
    const isNonUsaUser = !(
      String(resolvedIpCountryCode || '').trim().toUpperCase() === 'US' ||
      String(resolvedIpCountryCode || '').trim().toUpperCase() === 'USA'
    );
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
      props.navigation.navigate(isNonUsaUser ? 'VerifyOTPEmail' : 'VerifyOTP', {
        nonUsaUser: isNonUsaUser,
        newMail: verifyPayload?.email,
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
        verifyemail: {
          verifyemail: verifyPayload,
          profession: verifyPayload?.profession,
          isNonUsaUser,
        },
      });
      return;
    }

    if (!isNonUsaUser && !isPhoneVerified) {
      if (!phoneValue || String(phoneValue).trim() === '' || String(phoneValue).trim() === 'null') {
        props.navigation.navigate('AddMobile');
        return;
      }
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
      await AsyncStorage.removeItem('IS_GUEST_CONVERTED_USER');
      await AsyncStorage.removeItem(GUEST_PRIME_VERIFICATION_PENDING_KEY);
      await AsyncStorage.setItem(GUEST_VERIFICATION_COMPLETED_KEY, 'true');
    } catch (error) {
      console.log('handleGuestVerifyAccount cleanup error', error);
    }
  };
  /**
* Handles guest verify account.
*
* @async
* @returns {Promise<*>}
*/
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
  console.log(isGuestPrimeUser ||
    showGuestPrimePrompt ||
    props?.route?.name == 'PrimeCard' ||
    isSubscriptionExpiredSync ||
    currentProfile == 'PrimeCard' ||
    exploreTrialClicked, "dgdfkjgjkjk12222", primeadd)
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
                    {/* {shouldShowMainAddLicenseCard ? renderMainAddLicenseCard() : null} */}
                    {currentProfile === 'SkipProfile'
                      ? (isPhysicianFlow
                        ? <StateLicense profileType="SkipProfile" propsData={props?.route?.params} setRenewal={setRenewal} renewal={renewal} setStateid={setStateid} stateid={stateid} setTotalCred={setTotalCred} totalcard={totalcard} finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables || isSubscriptionExpiredSync || currentProfile === 'SkipProfile' || props?.route?.name === 'PrimeCard'} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />
                        : isNursingFlow
                          ? <NonPhysicianCat finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables || isSubscriptionExpiredSync || currentProfile === 'SkipProfile' || props?.route?.name === 'PrimeCard'} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />
                          : <NewProfession profileType="SkipProfile" finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables || isSubscriptionExpiredSync || currentProfile === 'SkipProfile' || props?.route?.name === 'PrimeCard'} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />)
                      : shouldRenderNewProfession
                        ? <NewProfession finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables || isSubscriptionExpiredSync} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />
                        : props?.route?.name === 'PrimeCard' || isGuestPrimeUser
                          ? (isPhysicianFlow
                            ? ((exploreTrialClicked && currentProfile !== 'SkipProfile')
                              ? <StateLicense propsData={props?.route?.params} setRenewal={setRenewal} renewal={renewal} setStateid={setStateid} stateid={stateid} setTotalCred={setTotalCred} totalcard={totalcard} finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables || isSubscriptionExpiredSync} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />
                              : <StateLicense profileType="SkipProfile" propsData={props?.route?.params} setRenewal={setRenewal} renewal={renewal} setStateid={setStateid} stateid={stateid} setTotalCred={setTotalCred} totalcard={totalcard} finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables || isSubscriptionExpiredSync || currentProfile === 'SkipProfile' || props?.route?.name === 'PrimeCard'} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />)
                            : isNursingFlow
                              ? <NonPhysicianCat finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables || isSubscriptionExpiredSync || currentProfile === 'SkipProfile' || props?.route?.name === 'PrimeCard'} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />
                              : <NewProfession finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables || isSubscriptionExpiredSync || currentProfile === 'SkipProfile' || props?.route?.name === 'PrimeCard'} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />)
                          : isPhysicianFlow
                            ? <StateLicense propsData={props?.route?.params} setRenewal={setRenewal} renewal={renewal} setStateid={setStateid} stateid={stateid} setTotalCred={setTotalCred} totalcard={totalcard} finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables || isSubscriptionExpiredSync} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />
                            : isNursingFlow
                              ? <NonPhysicianCat finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables || isSubscriptionExpiredSync} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />
                              : <NewProfession finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables || isSubscriptionExpiredSync} setStateCount={setStateCount} fetcheddt={normalizedFulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={normalizedFulldashbaord} setFulldashbaord={setFulldashbaord} />}
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

          {(enables || hasEnables || isSubscriptionExpiredSync) && (allProfTake || hasAllProfTake) && (!isNonUsaUser || isSubscriptionExpiredSync) ? <View style={{
            position: 'absolute',
            height: normalize(56),
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 0,
          }}>
            <TouchableOpacity onPress={() => setPrimeadd(true)} style={{ flexDirection: "row", gap: normalize(10), justifyContent: "center", alignItems: "center", height: normalize(54), width: normalize(340), backgroundColor: "#FFEDCA", borderTopLeftRadius: normalize(25), borderTopRightRadius: normalize(25), marginBottom: normalize(-2) }}>
              <Image source={Imagepath.CrownDone} style={{ height: normalize(30), width: normalize(30), resizeMode: "contain" }} />
              <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000", fontWeight: "bold", alignItems: "center" }}>{"Get Prime Membership"}</Text>
            </TouchableOpacity>
          </View> : freeTrail && !isNonUsaUser && exploreTrialClicked ? <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingBottom: 0,
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
                {primeTrialMessage}
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
          {(() => {
            const userForSubCheck =
              AuthReducer?.dircetloginResponse?.user ||
              AuthReducer?.dircetloginResponse ||
              AuthReducer?.directloginResponse?.user ||
              AuthReducer?.directloginResponse ||
              DashboardReducer?.mainprofileResponse ||
              AuthReducer?.loginResponse?.user;

            const isNonSubscribedUserCalc =
              userForSubCheck?.subscription_user === "non-subscribed" ||
              !userForSubCheck?.subscriptions ||
              userForSubCheck?.subscriptions === 0 ||
              (Array.isArray(userForSubCheck?.subscriptions) && userForSubCheck?.subscriptions.length === 0);

            const shouldShowPrimeCardActions = isGuestPrimeUser ||
              showGuestPrimePrompt ||
              isNonSubscribedUserCalc ||
              props?.route?.name == 'PrimeCard' ||
              isSubscriptionExpiredSync ||
              currentProfile == 'PrimeCard' ||
              exploreTrialClicked;

            const hasActivePrimeTrialRender =
              exploreTrialClicked ||
              AuthReducer?.status === 'Auth/primeTrailSuccess' ||
              (AuthReducer?.primeTrailResponse && Object.keys(AuthReducer.primeTrailResponse).length > 0) ||
              userForSubCheck?.subscription_user === "free" ||
              userForSubCheck?.subscription_user === "subscribed";

            const subUserCheck = String(userForSubCheck?.subscription_user || finalProfessionmain?.subscription_user || '').trim().toLowerCase();
            const subListCheck = Array.isArray(userForSubCheck?.subscriptions) ? userForSubCheck.subscriptions : (Array.isArray(finalProfessionmain?.subscriptions) ? finalProfessionmain.subscriptions : []);
            const isStrictlyNonSubscribed = (subUserCheck === "non-subscribed" || subUserCheck === "" || !subUserCheck) && subListCheck.length === 0;

            return (!isAccreditationUser && !isNonUsaUser && isStrictlyNonSubscribed && !hasActivePrimeTrialRender && (allProfTake || isPhysicianFlow || hasAllProfTake) && primeadd && !isDrawerVisible) && <PrimeCard
              primeadd={primeadd}
              setPrimeadd={setPrimeadd}
              onDismiss={handlePrimeCardDismiss}
              primaryButtonText={(enables || hasEnables || isSubscriptionExpiredSync) && (allProfTake || hasAllProfTake) && (!isNonUsaUser || isSubscriptionExpiredSync) ? undefined : (shouldShowPrimeCardActions ? (isSkippedFlow ? 'Explore Free Trial 30 Days' : 'Explore Free Trial 30 Days') : undefined)}
              onPrimaryAction={shouldShowPrimeCardActions ? handleGuestPrimeExploreTrial : undefined}
              secondaryButtonText={shouldShowPrimeCardActions ? 'Get Prime Membership' : undefined}
              onSecondaryAction={shouldShowPrimeCardActions ? handleGuestPrimeMembership : undefined}
              showSkip={shouldShowPrimeCardActions}
              onSkip={isSubscriptionExpiredSync ? () => setPrimeadd(false) : (shouldShowPrimeCardActions ? handleGuestPrimeSkip : undefined)}
              hidePrimaryButton={(enables || hasEnables || isSubscriptionExpiredSync) && (allProfTake || hasAllProfTake) && (!isNonUsaUser || isSubscriptionExpiredSync)}
            />;
          })()}

          <Modal
            isVisible={!isAccreditationUser && guestVerifyModalVisible && !isDrawerVisible && !primeadd}
            onBackdropPress={() => { }}
            onBackButtonPress={() => { }}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropTransitionInTiming={300}
            backdropTransitionOutTiming={0}
            useNativeDriver={Platform.OS === 'android'}
            useNativeDriverForBackdrop={Platform.OS === 'android'}
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

/**
 * Main default export.
 *
 * @returns {*}
 */
export default Main
