// analyticsTracker.js

import analytics from '@react-native-firebase/analytics';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Store from '../../Redux/Store';

import { getPublicIP } from './IPServer';

// ─────────────────────────────────────────────────────────────────────────────
// Screen Name Mapping:
//   Key   → Route name used in navigator (code)
//   Value → Human-readable Analytics screen name shown in Firebase
//
// Screens NOT listed here will NOT send a screen_view_log analytics event.
// They will still receive the default Firebase automatic screen tracking.
// ─────────────────────────────────────────────────────────────────────────────
const SCREEN_NAME_MAP = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  Login: 'Sign In',
  SignUp: 'Sign Up',
  ForgotMPIN: 'Forgot Password',

  // ── Onboarding ────────────────────────────────────────────────────────────
  Splash: 'Splash Screen',
  Onboard: 'Onboard Screen',
  // ── Tab Navigator ─────────────────────────────────────────────────────────
  TabNav: 'Task Bar',
  Home: 'Dashboard',              // Tab: Home
  Profiles: 'Profile Tab',            // Tab: Profile
  Contact: 'CE Vault',               // Tab: Credit Vault tab

  // ── Dashboard / Home ──────────────────────────────────────────────────────
  Main: 'Dashboard',

  // ── Specialization / Signup flow ─────────────────────────────────────────
  CheckMembership: 'Prime Trial',
  ChooseSpecailization: 'State Compliance Courses',
  StateSpecification: 'State Compliance Courses',
  CourseRelevant: 'State Compliance Courses',
  AddCredits: 'Add CE Credits',
  AddLicense: 'Add State License',
  AddCertificate: 'Add Board Certification',

  // ── State Required Courses ────────────────────────────────────────────────
  StateCourse: 'State Recommended Course',
  BoardCourseSlide: 'MOC Recommended Course',
  SpecialityCourseSlide: 'Specialty Recommended Course',

  // ── CME Course ────────────────────────────────────────────────────────────
  Course: 'Registered Courses',
  OnlineCourse: 'Registered Courses',
  StartTest: 'Course Fulfillment',
  PreTest: 'Course Fulfillment',
  Survey: 'Course Fulfillment',
  VideoComponent: 'Course Fulfillment',


  // ── CME Credit Vault ──────────────────────────────────────────────────────
  DashoardVault: 'CE Vault',

  // ── CME Expense ───────────────────────────────────────────────────────────
  CMEListing: 'Search Listing',

  // ── Webcast / Details Page ────────────────────────────────────────────────
  Statewebcast: 'Activity Detail Page',
  Payment: 'Payment Checkout',
  Checkout: 'Activity Registration',
  HeaderSearch: 'Search',
  FiltersTopic: 'Search Filter',
  AddToCart: 'Add to Cart',
  InterestedChekout: 'Activity Interested',
  FilterScreen: 'Search Filter',
  BrowseScreen: 'Search Listing',
  SearchScreen: 'Search Listing',

  // ── Transaction ───────────────────────────────────────────────────────────
  Registration: 'Transaction Report',
  Wallets: 'Wallet Transaction',

  // ── Profile ───────────────────────────────────────────────────────────────
  ProfileMain: 'Profile',

  // ── Global Support / Search ───────────────────────────────────────────────
  GlobalSearch: 'Search Listing',
  Globalresult: 'Search Listing',
  VoiceSearchBar: 'Voice Search',
  Speaker: 'Speaker Profile',
  SpeakerProfile: 'Speaker Profile',
  ContactUs: 'Contact Us',

  // ── Tasks ─────────────────────────────────────────────────────────────────
  Mytasks: 'Pending Fulfillment',

  // ── Components used as screens ────────────────────────────────────────────
  RateReview: 'Activity Rating',
  DownloadCertificate: 'Download Certificate',
  PrimePayment: 'Prime Checkout',
};

// ─────────────────────────────────────────────────────────────────────────────
// Store current screen (raw route name set by navigator)
// ─────────────────────────────────────────────────────────────────────────────
let CURRENT_SCREEN = 'unknown';

// 👉 Called by StackNav's onStateChange
export const setCurrentScreen = (screenName) => {
  CURRENT_SCREEN = screenName;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: resolve the analytics-friendly name from the SCREEN_NAME_MAP.
// Returns null if the screen has no mapping (should NOT log analytics event).
// ─────────────────────────────────────────────────────────────────────────────
const resolveAnalyticsScreenName = (routeName) => {
  return SCREEN_NAME_MAP[routeName] ?? null;
};

// ─────────────────────────────────────────────────────────────────────────────
// IP Geo-lookup fallback
// ─────────────────────────────────────────────────────────────────────────────
const getCountryFromIP = async (ip) => {
  try {
    const res = await fetch(`https://ipinfo.io/${ip}/json`);
    const text = await res.text();
    if (text.startsWith('<')) {
      throw new Error('HTML response');
    }
    const data = JSON.parse(text);
    return data?.country || 'unknown';
  } catch (e) {
    console.log('Geo lookup failed:', e);
    return 'unknown';
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 👉 Generic event tracker — sends any custom Firebase event
// ─────────────────────────────────────────────────────────────────────────────
export const trackEvent = async (eventName, additionalParams = {}) => {
  try {
    const state = Store.getState();
    const AuthReducer = state.AuthReducer;
    const userId = AuthReducer?.loginResponse?.user?.id || "11211";

    let country = 'unknown';
    try {
      country = await DeviceInfo.getDeviceCountry();
    } catch (e) {
      country = 'unknown';
    }

    // Fallback to IP Geolocation if DeviceInfo fails
    if (!country || country === 'unknown') {
      const ip = getPublicIP();
      if (ip) {
        console.log('Attempting IP Geolocation with IP:', ip);
        country = await getCountryFromIP(ip);
      }
    }

    // Set User ID for all subsequent events in this session
    if (userId) {
      await analytics().setUserId(String(userId));
    }

    const defaultParams = {
      user_id: String(userId),
      screen_name: CURRENT_SCREEN,
      timestamp: new Date().toISOString(),
      device: `${Platform.OS}-${DeviceInfo.getModel()}`,
      country: country,
    };

    const params = {
      ...defaultParams,
      ...additionalParams,
    };

    console.log('📊 Sending Analytics:', eventName, params);

    await analytics().logEvent(eventName, params);
  } catch (error) {
    console.log('Analytics Error:', error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 👉 Screen tracking — called on every navigation state change.
//    Only screens present in SCREEN_NAME_MAP will fire analytics events.
//    The resolved human-readable name is used for Firebase logScreenView.
// ─────────────────────────────────────────────────────────────────────────────
export const trackScreen = async (routeName, screenClassOverride) => {
  try {
    // Resolve the analytics display name from the map
    const analyticsName = resolveAnalyticsScreenName(routeName);

    if (!analyticsName) {
      // Screen is not mapped → skip analytics event, just log for debugging
      console.log(`📍 Screen "${routeName}" — not mapped, skipping analytics.`);
      return;
    }

    const screenClass = screenClassOverride || analyticsName;

    // Keep CURRENT_SCREEN as the route name (used in trackEvent for context)
    setCurrentScreen(routeName);

    console.log(`📍 Tracking Screen: "${routeName}" → "${analyticsName}"`);

    // Log Firebase screen view with the human-readable analytics name
    await analytics().logScreenView({
      screen_name: analyticsName,
      screen_class: screenClass,
    });

    // Log custom event so user data is captured with the screen view
    await trackEvent('screen_view_log', {
      screen_name: analyticsName,
      screen_class: screenClass,
      route_name: routeName,
    });

  } catch (error) {
    console.log('Screen Analytics Error:', error);
  }
};
