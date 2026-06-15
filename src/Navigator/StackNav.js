import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { NavigationContainer, DarkTheme, CommonActions, createNavigationContainerRef, StackActions, useIsFocused } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import Onboard from '../Screen/OnboardScreen/Onboard';
import Splash from '../Screen/SplashScreen/Splash';
import Login from '../Screen/Auth/Login';
import SignUp from '../Screen/Auth/SignUp';
import VerifyOTP from '../Screen/Auth/VerifyOTP';
import ChangeMail from '../Screen/Auth/ChangeMail';
import VerifyMobileOTP from '../Screen/Auth/VerifyMobileOTP';
import ChangeMobileNo from '../Screen/Auth/ChangeMobileNo';
import AllSpecial from '../Screen/Specialization/AllSpecial';
import ForgotMPIN from '../Screen/Auth/ForgotMPIN';
import EnterOTP from '../Screen/Auth/EnterOTP';
import ResetMPIN from '../Screen/Auth/ResetMPIN';
import Main from '../Screen/Dashboard/Main';
import CheckMembership from '../Screen/Specialization/CheckMembership';
import TabNavigator from './TabNav';
import ChooseSpecailization from '../Screen/Specialization/ChooseSpecailization';
import StateSpecification from '../Screen/Specialization/StateSpecification';
import CourseRelevant from '../Screen/Specialization/CourseRelevant';
import AddCredits from '../Screen/Specialization/AddCredits';
import AddLicense from '../Screen/Specialization/AddLicense';
import MOCCertification from '../Screen/Specialization/MOCCertification';
import BoardCourse from '../Screen/Specialization/BoardCourse';
import AddCertificate from '../Screen/Specialization/AddCertificate';
import StateCourse from '../Screen/StateRequiredCourse/StateCourse';
import MobileLoginOTP from '../Screen/Auth/MobileLogin';
import ChooseState from '../Screen/StateSpecification/ChooseState';
import StateInformation from '../Screen/StateSpecification/StateInformation';
import CreateStateInfor from '../Screen/StateSpecification/CreateStateInfor';
import Course from '../Screen/CMECourse/Course';
import OnlineCourse from '../Screen/CMECourse/OnlineCourse';
import PDFViewer from '../Components/Download';
import RateReview from '../Components/RateReview';
import VideoComponent from '../Components/Video';
import StartTest from '../Screen/CMECourse/StartTest';
import PreTest from '../Screen/CMECourse/PreTest';
import PostTestFail from '../Screen/CMECourse/PostTestFail';
import Survey from '../Screen/CMECourse/Survey';
import DownloadCertificate from '../Components/FinalCertificate';
import CMEPlanner from '../Screen/CMECourse/CMEPlanner';
import Mytasks from '../Screen/Task/Mytasks';
import DashoardVault from '../Screen/CMECreditValut/DashoardVault';
import StateCertificate from '../Screen/CMECreditValut/StateCertificate';
import DownloadImage from '../Screen/CMECreditValut/PngFile';
import ImagePDF from '../Screen/CMECreditValut/ImagePDF';
import CertficateHandle from '../Screen/CMECreditValut/FileCheck';
import Statewebcast from '../Screen/DetailsPageWebcast/Statewebcast';
import StateDataComponent from '../Components/StateDataComponent';
import Payment from '../Screen/DetailsPageWebcast/Payment';
import Checkout from '../Screen/DetailsPageWebcast/Checkout';
import HeaderSearch from '../Screen/DetailsPageWebcast/HeaderSearch';
import ExploreCastCourse from '../Screen/DetailsPageWebcast/ExploreCastCourse';
import FiltersTopic from '../Screen/DetailsPageWebcast/FiltersTopic';
import AllDownlaodCatlog from '../Components/AllDownloadCatlog';
import ProfileMain from '../Screen/Profile/ProfileMain';
import AddToCart from '../Screen/DetailsPageWebcast/AddToCart';
import InPersonStatewebcast from '../Screen/InPersonWebcast/InPersonStatewebcast';
import GuestUser from '../Screen/HomePage/GuestUser';
import CMERequirement from '../Screen/CMERequirement/CMERequirement';
import GuestSpecialitySearch from '../Screen/HomePage/GuestSpecialitySearch';
import FilterScreen from '../Screen/HomePage/FilterScreen';
import PriceSlider from '../Screen/HomePage/PriceSlider';
import BrowseScreen from '../Screen/HomePage/BrowseScreen';
import SearchScreen from '../Screen/HomePage/SearchScreen';
import SearchResult from '../Screen/HomePage/SearchResult';
import Testing from '../Screen/HomePage/Testing';
import CMEExDashboard from '../Screen/CMEExpense.js/CMEExDashboard';
import CMEListing from '../Screen/CMEExpense.js/CMEListing';
import AddExpenses from '../Screen/CMEExpense.js/AddExpenses';
import CMEActivity from '../Screen/CMEExpense.js/CMEActivity';
import AddCME from '../Screen/CMEExpense.js/AddCME';
import BoardCertificate from '../Components/BoardCertificate';
import InterestedChekout from '../Screen/DetailsPageWebcast/InterestedChekout';
import Registration from '../Screen/Transcation/Registration';
import DashboardTrans from '../Screen/Transcation/DashboardTrans';
import Wallets from '../Screen/Transcation/Wallets';
import HCPSub from '../Screen/Transcation/HCPSub';
import Menu from '../Screen/Auth/Menu';
import AppProvider, { AppContext } from '../Screen/GlobalSupport/AppContext';
import PaymentSub from '../Screen/Transcation/PaymentSub';
import SubTransaction from '../Screen/Transcation/SubTransaction'
import BoardCourseSlide from '../Screen/StateRequiredCourse/BoardCourse';
import SpecialityCourseSlide from '../Screen/StateRequiredCourse/SpecialityCourse';
import GlobalSearch from '../Screen/GlobalSupport/GlobalSearch';
import ContactProfile from '../Screen/Profile/Contact';
import PersonalInfo from '../Screen/Profile/PersonalInfo';
import StateProfile from '../Screen/Profile/StateProfile';
import BoardProfile from '../Screen/Profile/BoardProfile';
import EmpInfo from '../Screen/Profile/EmpInfo';
import AddEmpInfo from '../Screen/Profile/AddEmpInfo';
import ProfMember from '../Screen/Profile/ProfMember';
import AddProfMemb from '../Screen/Profile/AddProfMemb';
import Globalresult from '../Screen/GlobalSupport/Globalresult';
import FullscreenMapScreen from '../Screen/DetailsPageWebcast/MapFull';
import VoiceSearchBar from '../Screen/GlobalSupport/Voice';
import NativeVoice from '../Screen/GlobalSupport/NativeVoice';
import PrimePayment from '../Components/PrimePayment';
import Speaker from '../Screen/GlobalSupport/Speaker';
import Internet from '../Screen/GlobalSupport/Internet';
import SpeakerProfile from '../Screen/GlobalSupport/SpeakerProfile';
import ContactUs from '../Screen/GlobalSupport/ContactUs';
import StickyFlatList from '../Screen/GlobalSupport/StickyFlatList';
import NonMain from '../Screen/NonPhysician/NonMain';
import { AppState, Linking, DeviceEventEmitter, Alert, Platform, BackHandler } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import SplashInt from '../Screen/SplashScreen/IntSplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../Utils/Helpers/constants';
import RegisterInterest from '../Screen/DetailsPageWebcast/RegisterInterest';
import InterestCard from '../Screen/DetailsPageWebcast/InterestCard';
import ChangePassword from '../Screen/Profile/ChangePassword';
import AddToCartNo from '../Screen/DetailsPageWebcast/NoCart';
import PrivacyPolicy from '../Screen/Auth/Privacy';
import TermsAndConditions from '../Screen/Auth/TermsCond';
import VerifyOTPEmail from '../Screen/Auth/SplashEmail';
import ChangeMailSplash from '../Screen/Auth/SplashChangeMail';
import LoginEmail from '../Screen/Auth/LoginEmail';
import SplashMobile from '../Screen/Auth/SplashMobile';
const GUEST_REGISTRATION_FLOW_KEY = 'GUEST_REGISTRATION_FLOW';
import LoginChangeMail from '../Screen/Auth/LoginChangeMail';
import SplashMobileChange from '../Screen/Auth/SplashMobileChange';
import LoginMobile from '../Screen/Auth/LoginMobile';
import LoginMobileChange from '../Screen/Auth/LoginMobileChange';
import AddMobile from '../Screen/Auth/AddMobile';
import AddMobileLogin from '../Screen/Auth/AddMobileLogin';
import { setCurrentScreen, trackEvent, trackScreen } from '../Utils/Helpers/Analytics';
import { navigationRef, getCurrentRoute } from "./RootNavigation";
import { useSelector } from 'react-redux';
const DEEPLINK_BOOTSTRAP_KEY = 'DEEPLINK_BOOTSTRAP';
const StackNav = props => {
  const [conn, setConn] = useState(null)
  const Stack = createStackNavigator();
  const mytheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
    },
  }

  useEffect(() => {
    NetInfo.fetch().then(state => {
      setConn(Boolean(state?.isConnected));
    }).catch(error => {
      console.log(error);
      setConn(true);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setConn(Boolean(state?.isConnected));
    });

    return () => unsubscribe();
  }, []);
  const Screens =
  {
    Splash: conn === false ? SplashInt : Splash,
    Onboard: Onboard,
    Login: Login,
    SignUp: SignUp,
    MobileLoginOTP: MobileLoginOTP,
    VerifyOTP: VerifyOTP,
    ChangeMail: ChangeMail,
    VerifyMobileOTP: VerifyMobileOTP,
    ChangeMobileNo: ChangeMobileNo,
    AllSpecial: AllSpecial,
    ForgotMPIN: ForgotMPIN,
    EnterOTP: EnterOTP,
    ResetMPIN: ResetMPIN,
    Main: Main,
    CheckMembership: CheckMembership,
    TabNav: TabNavigator,
    ChooseSpecailization: ChooseSpecailization,
    StateSpecification: StateSpecification,
    CourseRelevant: CourseRelevant,
    AddCredits: AddCredits,
    AddLicense: AddLicense,
    MOCCertification: MOCCertification,
    BoardCourse: BoardCourse,
    AddCertificate: AddCertificate,
    StateCourse: StateCourse,
    ChooseState: ChooseState,
    StateInformation: StateInformation,
    CreateStateInfor: CreateStateInfor,
    Course: Course,
    OnlineCourse: OnlineCourse,
    PDFViewer: PDFViewer,
    BoardCertificate: BoardCertificate,
    RateReview: RateReview,
    VideoComponent: VideoComponent,
    StartTest: StartTest,
    PreTest: PreTest,
    PostTestFail: PostTestFail,
    Survey: Survey,
    DownloadCertificate: DownloadCertificate,
    CMEPlanner: CMEPlanner,
    Mytasks: Mytasks,
    DashoardVault: DashoardVault,
    StateCertificate: StateCertificate,
    DownloadImage: DownloadImage,
    ImagePDF: ImagePDF,
    CertficateHandle: CertficateHandle,
    Statewebcast: Statewebcast,
    StateDataComponent: StateDataComponent,
    Payment: Payment,
    Checkout: Checkout,
    HeaderSearch: HeaderSearch,
    ExploreCastCourse: ExploreCastCourse,
    FiltersTopic: FiltersTopic,
    AllDownlaodCatlog: AllDownlaodCatlog,
    ProfileMain: ProfileMain,
    AddToCart: AddToCart,
    InPersonStatewebcast: InPersonStatewebcast,
    GuestUser: GuestUser,
    CMERequirement: CMERequirement,
    GuestSpecialitySearch: GuestSpecialitySearch,
    FilterScreen: FilterScreen,
    PriceSlider: PriceSlider,
    BrowseScreen: BrowseScreen,
    SearchScreen: SearchScreen,
    SearchResult: SearchResult,
    Testing: Testing,
    CMEExDashboard: CMEExDashboard,
    CMEListing: CMEListing,
    AddExpenses: AddExpenses,
    CMEActivity: CMEActivity,
    AddCME: AddCME,
    InterestedChekout: InterestedChekout,
    Registration: Registration,
    DashboardTrans: DashboardTrans,
    Wallets: Wallets,
    HCPSub: HCPSub,
    Menu: Menu,
    PaymentSub: PaymentSub,
    SubTransaction: SubTransaction,
    BoardCourseSlide: BoardCourseSlide,
    SpecialityCourseSlide: SpecialityCourseSlide,
    GlobalSearch: GlobalSearch,
    ContactProfile: ContactProfile,
    PersonalInfo: PersonalInfo,
    StateProfile: StateProfile,
    BoardProfile: BoardProfile,
    EmpInfo: EmpInfo,
    AddEmpInfo: AddEmpInfo,
    ProfMember: ProfMember,
    AddProfMemb: AddProfMemb,
    Globalresult: Globalresult,
    FullscreenMapScreen: FullscreenMapScreen,
    VoiceSearchBar: VoiceSearchBar,
    NativeVoice: NativeVoice,
    PrimePayment: PrimePayment,
    Speaker: Speaker,
    Internet: Internet,
    SpeakerProfile: SpeakerProfile,
    ContactUs: ContactUs,
    StickyFlatList: StickyFlatList,
    NonMain: NonMain,
    RegisterInterest: RegisterInterest,
    InterestCard: InterestCard,
    ChangePassword: ChangePassword,
    AddToCartNo: AddToCartNo,
    PrivacyPolicy: PrivacyPolicy,
    TermsAndConditions: TermsAndConditions,
    VerifyOTPEmail: VerifyOTPEmail,
    ChangeMailSplash: ChangeMailSplash,
    LoginEmail: LoginEmail,
    SplashMobile: SplashMobile,
    LoginChangeMail: LoginChangeMail,
    SplashMobileChange: SplashMobileChange,
    LoginMobile: LoginMobile,
    LoginMobileChange: LoginMobileChange,
    AddMobile: AddMobile,
    AddMobileLogin: AddMobileLogin
  }
  const wasBackgrounded = useRef(false);


  const resetToSplashScreen = useCallback(() => {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Splash' }],
      })
    );
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        // App was truly minimized
        wasBackgrounded.current = true;
      } else if (nextAppState === 'active' && wasBackgrounded.current) {
        // Only reset to Splash when returning from a real background (app minimized)
        // NOT on 'inactive' (keyboard dismiss, notification pull-down, alerts, etc.)
        wasBackgrounded.current = false;
        if (isExternalNavigationInProgress.current) {
          console.log('[DeepLink] Skipping Splash reset after intentional external navigation');
          isExternalNavigationInProgress.current = false;
          return;
        }
        Promise.all([
          AsyncStorage.getItem(constants.TOKEN),
          AsyncStorage.getItem('PLAYERSESSION'),
          AsyncStorage.getItem(GUEST_REGISTRATION_FLOW_KEY),
        ]).then(([token, playerSession, guestFlow]) => {
          if (!token && !playerSession && !guestFlow) {
            resetToSplashScreen();
          }
        });
      } else if (nextAppState === 'inactive') {
        // Do NOT reset — this fires during keyboard dismiss, calls, etc.
      }
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [resetToSplashScreen]);
  const [tokenever, setTokenever] = useState("");
  const [dashever, setDashever] = useState("");
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [pendingDeepLink, setPendingDeepLink] = useState(null);
  const isRedirectingToWeb = useRef(false);
  const isExternalNavigationInProgress = useRef(false);
  const initialUrlHandled = useRef(false);
  const lastProcessedUrl = useRef(null);
  const lastProcessedTime = useRef(0);
  const AuthReducer = useSelector(state => state.AuthReducer);

  const safeDecode = useCallback((value) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }, []);

  const normalizeUrlCandidate = useCallback((value) => {
    if (typeof value !== 'string') return value;

    const trimmedValue = value.trim();
    if (!trimmedValue) return trimmedValue;

    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmedValue)) {
      return trimmedValue;
    }

    return `https://${trimmedValue}`;
  }, []);

  const extractNestedTargetUrl = useCallback((rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return rawUrl;

    // 1. Initial normalization (ensure protocol for URL constructor)
    let current = normalizeUrlCandidate(rawUrl.trim());

    // 2. Loop to unwrap nested redirects (Google -> Mailtiply -> Target)
    // We increase to 10 iterations to be absolutely sure we hit the bottom
    for (let index = 0; index < 10; index += 1) {
      let parsedUrl;
      try {
        parsedUrl = new URL(current);
      } catch (error) {
        // If it's not a valid URL yet, try one final decode and see if that helps
        const decodedCandidate = safeDecode(current);
        if (decodedCandidate === current) break;
        current = normalizeUrlCandidate(decodedCandidate);
        continue;
      }

      const params = parsedUrl.searchParams;
      // Fetch nested URL from common tracking parameters
      let nestedUrl =
        params.get('ru') ||  // Mailtiply
        params.get('q') ||   // Google
        params.get('url') || // Common
        params.get('u');     // Common

      if (!nestedUrl) break;

      // 3. Robust decoding (handle multiple layers of encoding like %252f)
      let decodedNestedUrl = nestedUrl;
      for (let decodeIndex = 0; decodeIndex < 5; decodeIndex += 1) {
        const tempDecoded = safeDecode(decodedNestedUrl);
        if (tempDecoded === decodedNestedUrl) break;
        decodedNestedUrl = tempDecoded;
      }

      // 4. Normalize the result for the next iteration
      const nextCandidate = normalizeUrlCandidate(decodedNestedUrl.trim());

      // Stop if we stop making progress
      if (!nextCandidate || nextCandidate === current) break;

      current = nextCandidate;
    }

    return current;
  }, [normalizeUrlCandidate, safeDecode]);

  const cleanTrackingParams = useCallback((url) => {
    try {
      const parsedUrl = new URL(url);

      const paramsToDelete = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'sp_sid',
        'source', // often comes from gmail
        'ust',
        'usg'
      ];

      paramsToDelete.forEach((param) => parsedUrl.searchParams.delete(param));
      return parsedUrl.toString();
    } catch (error) {
      return url;
    }
  }, []);

  const parseDeepLinkDetails = useCallback((incomingUrl) => {
    console.log('[DeepLink] Processing incoming URL:', incomingUrl);

    if (!incomingUrl) {
      return { originalUrl: incomingUrl, resolvedUrl: incomingUrl, normalizedUrl: '', slug: null, refID: null, isInternalLink: false };
    }

    // Step 1: Unwrap tracking redirects
    let resolvedUrl = extractNestedTargetUrl(incomingUrl);

    // Step 2: Clean tracking garbage
    resolvedUrl = cleanTrackingParams(resolvedUrl);
    const normalizedUrl = resolvedUrl.toLowerCase();

    console.log('[DeepLink] Resolved URL after decoding:', resolvedUrl);

    let slug = null;
    let refID = null;
    let hostname = '';
    let pathname = '';

    try {
      const parsedUrl = new URL(resolvedUrl);
      hostname = parsedUrl.hostname.toLowerCase();
      pathname = parsedUrl.pathname.toLowerCase();

      const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
      slug = pathSegments.length ? pathSegments[pathSegments.length - 1] : null;

      // Extract RefID specifically or fallback to entire query
      refID = parsedUrl.searchParams.get('RefID') ||
        parsedUrl.searchParams.get('refid') ||
        (parsedUrl.search ? parsedUrl.search.slice(1) : null);

    } catch (error) {
      const [urlWithoutQuery, queryString] = resolvedUrl.split('?');
      const fallbackPath = urlWithoutQuery.includes('//') ? urlWithoutQuery.split('//')[1] : urlWithoutQuery;
      const pathSegments = fallbackPath.split('/').filter(Boolean);
      slug = pathSegments.length ? pathSegments[pathSegments.length - 1] : null;
      refID = queryString || null;

      // Basic hostname extraction for fallback
      if (urlWithoutQuery.includes('//')) {
        hostname = urlWithoutQuery.split('//')[1].split('/')[0].toLowerCase();
      }
    }

    // Comprehensive internal link check
    const isEmedHost = hostname.includes('emedevents.com') || hostname.includes('emedevents.net');

    const internalPathPatterns = [
      '/medical-hybrid-events-2026',
      '/c',
      '/online-cme-courses',
      '/webcasts/',
      '/webcast/',
      'course-bundle',
      'mandatory-topic',
      '/conference/',
      '/conferences/'
    ];

    const hasInternalPattern = internalPathPatterns.some(pattern =>
      pathname.includes(pattern.toLowerCase()) ||
      normalizedUrl.includes(pattern.toLowerCase())
    );

    const isInternalLink = isEmedHost && hasInternalPattern;

    console.log('[DeepLink] Analysis result:', { hostname, pathname, slug, refID, isInternalLink });

    return {
      originalUrl: incomingUrl,
      resolvedUrl,
      normalizedUrl,
      slug,
      refID,
      isInternalLink,
    };
  }, [cleanTrackingParams, extractNestedTargetUrl]);

  // 1. Move logic to a useCallback so it's stable
  const loadAuthData = useCallback(async () => {
    try {
      const [dashboardData, token, guestFlow] = await Promise.all([
        AsyncStorage.getItem(constants.WHOLEDATA),
        AsyncStorage.getItem(constants.TOKEN),
        AsyncStorage.getItem(GUEST_REGISTRATION_FLOW_KEY),
      ]);
      const hasGuestRegistrationFlow = Boolean(guestFlow);
      const effectiveToken = hasGuestRegistrationFlow ? null : token;

      const authData = {
        token: effectiveToken || null,
        dashboard: dashboardData || null,
      };

      if (effectiveToken) {
        setTokenever(true);
        if (dashboardData) setDashever(dashboardData);
      } else {
        setTokenever("");
        setDashever("");
      }

      return authData;
    } catch (error) {
      console.log('AsyncStorage Error:', error);
      return { token: null, dashboard: null };
    } finally {
      setIsAuthReady(true);
    }
  }, []);


  useEffect(() => {
    // 2. Initial trigger on mount
    loadAuthData();

    // 3. Listen for foreground events
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('App returned to foreground - re-syncing auth...');
        loadAuthData();
      }
    });

    return () => subscription.remove();
  }, [loadAuthData]);

  const navigateToScreen = useCallback(async (screen, params) => {
    const newKey = Date.now().toString();
    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{
          name: screen,
          params: { ...params, key: newKey }
        }]
      })
    );
    AsyncStorage.removeItem(DEEPLINK_BOOTSTRAP_KEY).catch(() => {});
  }, []);

  const openExternalBrowser = useCallback(async (url) => {
    if (!url) return;
    const browserUrl = normalizeUrlCandidate(url);

    try {
      isRedirectingToWeb.current = true;
      isExternalNavigationInProgress.current = true;

      console.log('[DeepLink] Triggering browser with:', browserUrl);

      await Linking.openURL(browserUrl);

      setTimeout(() => { isRedirectingToWeb.current = false; }, 4000);
      setTimeout(() => { isExternalNavigationInProgress.current = false; }, 4000);
    } catch (err) {
      console.log('Browser open failed', err);
      isRedirectingToWeb.current = false;
      isExternalNavigationInProgress.current = false;
    }
  }, [normalizeUrlCandidate]);

  const handleDeepLink = useCallback(async (url) => {
    if (!url) return;
    const trimmedUrl = url.trim();

    // Prevent duplicate navigation / processing within 2 seconds for the same URL
    const now = Date.now();
    if (lastProcessedUrl.current === trimmedUrl && (now - lastProcessedTime.current) < 2000) {
      console.log('[DeepLink] Ignoring duplicate URL trigger:', trimmedUrl);
      return;
    }
    lastProcessedUrl.current = trimmedUrl;
    lastProcessedTime.current = now;

    console.log('🌍 Incoming URL:', trimmedUrl);

    const {
      resolvedUrl,
      normalizedUrl,
      slug,
      refID,
      isInternalLink,
    } = parseDeepLinkDetails(trimmedUrl);

    console.log('🔥 FINAL CLEAN URL:', resolvedUrl);

    if (refID) {
      try {
        await AsyncStorage.setItem(constants.REFID, refID);
        console.log('[DeepLink] Full query string captured for RefID:', refID);
      } catch (e) {
        console.log('[DeepLink] Error parsing RefID:', e);
      }
    }

    // 🔒 Reject processing if we are currently mid-redirect to prevent infinite loops (especially on Android)
    if (isRedirectingToWeb.current) {
      console.log('[DeepLink] Loop prevention active, ignoring trigger:', resolvedUrl);
      return;
    }

    // Restrict /price-page/, /cmepackages and other specific URLs to open in the web browser only
    if (normalizedUrl.includes('/price-page/') || normalizedUrl.includes('/cmepackages')) {
      console.log('[DeepLink] Redirecting restricted URL to browser:', resolvedUrl);
      openExternalBrowser(resolvedUrl);
      return;
    }

    const [token, dashboard] = await Promise.all([
      AsyncStorage.getItem(constants.TOKEN),
      AsyncStorage.getItem(constants.WHOLEDATA),
    ]);

    // Parse host to check if it is eMedEvents
    let isEmedHost = false;
    try {
      const parsedUrl = new URL(resolvedUrl);
      const hostname = parsedUrl.hostname.toLowerCase();
      isEmedHost = hostname.includes('emedevents.com') || hostname.includes('emedevents.net');
    } catch (e) {
      if (resolvedUrl.includes('emedevents.com') || resolvedUrl.includes('emedevents.net')) {
        isEmedHost = true;
      }
    }

    // If it's not an eMedEvents link, open in external browser
    if (!isEmedHost) {
      console.log('[DeepLink] External link redirected to browser:', resolvedUrl);
      openExternalBrowser(resolvedUrl);
      return;
    }

    // Determine if the screen/URL requires authentication
    // Guest-permitted internal screens are the webcast/conference details pages
    const isGuestPermitted = isInternalLink;
    const requiresAuthentication = !isGuestPermitted;

    console.log('[DeepLink] Authentication check:', {
      hasToken: !!token,
      isGuestPermitted,
      requiresAuthentication,
    });

    if (requiresAuthentication && !token) {
      // 🔒 Storing the pending deep link for post-login redirection
      console.log('[DeepLink] Screen requires auth and no token. Storing pending deep link:', resolvedUrl);
      await AsyncStorage.setItem('PENDING_DEEP_LINK', resolvedUrl);
      
      // Redirect to Login
      navigateToScreen("Login");
      return;
    }

    // If we reach here: either (1) user is logged in OR (2) screen is guest-permitted
    if (isGuestPermitted) {
      // Check if navigation is ready (especially on cold launch)
      if (!isNavigationReady) {
        console.log('[DeepLink] Navigation not ready, storing pending link');
        setPendingDeepLink({ url: resolvedUrl, slug, refID });
        return;
      }

      navigateToScreen("Statewebcast", {
        webCastURL: {
          webCastURL: slug,
          creditData: dashboard,
          refID: refID,
          Realback: token ? undefined : 'guest'
        }
      });
    } else {
      // If user is logged in and it's a protected internal link, map to appropriate authenticated screen
      // Since it's a general protected page (like /profile or /dashboard), navigate to TabNav
      console.log('[DeepLink] User logged in, navigating to TabNav for internal protected link:', resolvedUrl);
      navigateToScreen("TabNav");
    }
  }, [isNavigationReady, navigateToScreen, openExternalBrowser, parseDeepLinkDetails]);

  useEffect(() => {
    const handleUrl = (event) => {
      const { url } = event;
      console.log('🌍 URL received:', url);
      handleDeepLink(url);
    };

    // Handle initial URL strictly once
    Linking.getInitialURL().then((url) => {
      if (url && !initialUrlHandled.current) {
        initialUrlHandled.current = true;
        console.log('Initial URL handled:', url);
        AsyncStorage.setItem(DEEPLINK_BOOTSTRAP_KEY, 'true').catch(() => {});
        handleDeepLink(url);
      } else {
        AsyncStorage.removeItem(DEEPLINK_BOOTSTRAP_KEY).catch(() => {});
      }
    });

    const subscription = Linking.addEventListener('url', handleUrl);
    return () => subscription.remove();
  }, [handleDeepLink, isNavigationReady]); // 🔥 Run when navigation is ready

  useEffect(() => {
    if (isAuthReady && isNavigationReady && pendingDeepLink) {
      console.log('Context ready, processing pending deep link:', pendingDeepLink);
      lastProcessedUrl.current = null;
      handleDeepLink(pendingDeepLink.url || pendingDeepLink.slug);
      setPendingDeepLink(null); // clear after processing
    }
  }, [handleDeepLink, isAuthReady, isNavigationReady, pendingDeepLink]);

  const checkAndProcessPendingDeepLinkAfterLogin = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(constants.TOKEN);
      if (token) {
        const pendingUrl = await AsyncStorage.getItem('PENDING_DEEP_LINK');
        if (pendingUrl) {
          console.log('[DeepLink] Found pending deep link after login:', pendingUrl);
          await AsyncStorage.removeItem('PENDING_DEEP_LINK');
          lastProcessedUrl.current = null;
          AsyncStorage.setItem(DEEPLINK_BOOTSTRAP_KEY, 'true').catch(() => {});
          handleDeepLink(pendingUrl);
        }
      }
    } catch (e) {
      console.log('[DeepLink] Error checking pending link after login:', e);
    }
  }, [handleDeepLink]);

  useEffect(() => {
    if (isAuthReady && isNavigationReady) {
      checkAndProcessPendingDeepLinkAfterLogin();
    }
  }, [AuthReducer?.status, isAuthReady, isNavigationReady, checkAndProcessPendingDeepLinkAfterLogin]);

  const linking = {
    prefixes: [
      'https://www.emedevents.com',
      'https://emedevents.com',
      'http://www.emedevents.com',
      'http://emedevents.com',
    ],
    config: {
      screens: {
        TabNavigator: "TabNav",   // ✅ dynamic parameter
      },
    },
  };
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('DEEP_LINK_URL', (data) => {
      console.log('[StackNav] Internal deep link trigger received:', data?.url);
      if (data?.url) {
        handleDeepLink(data.url);
      }
    });

    return () => subscription.remove();
  }, [handleDeepLink, isNavigationReady, isAuthReady]);
  console.log(dashever, tokenever, "hfghjh====111", conn, DeviceEventEmitter)
  const routeNameRef = useRef();
  return (
    <AppProvider>
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        onStateChange={async (state) => {
          // Recursive function to get the leaf route name
          const getActiveRouteName = (navigationState) => {
            if (!navigationState) return null;
            const route = navigationState.routes[navigationState.index];
            if (route.state) {
              return getActiveRouteName(route.state);
            }
            return route.name;
          };

          const currentRouteName = getActiveRouteName(state);
          const previousRouteName = routeNameRef.current;

          // Fallback if something goes wrong
          const screenName = currentRouteName || 'Unknown';

          setCurrentScreen(screenName);

          if (previousRouteName !== currentRouteName) {
            DeviceEventEmitter.emit('APP_UPDATE_NAVIGATION_CHANGE', {
              screenName,
            });
            await trackScreen(screenName);
          }

          routeNameRef.current = currentRouteName
        }}
        theme={mytheme}
        onReady={() => {
          setIsNavigationReady(true);
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
            gestureEnabled: true,
            cardStyleInterpolator:
              Platform.OS === 'ios'
                ? CardStyleInterpolators.forHorizontalIOS
                : CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        >
          {Object.entries({
            ...Screens,
          }).map(([name, component]) => {
            return (
              <Stack.Screen
                name={name}
                component={component}
                options={name === 'Onboard' ? { gestureEnabled: false } : undefined}
              />
            )
          })}

        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};
export default StackNav;
