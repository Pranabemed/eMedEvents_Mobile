/**
 * AppUpdate.js
 *
 * Shows an update popup whenever the installed version is older than the store version.
 * No static version numbers are hardcoded — all checks are fully dynamic.
 *
 * ┌──────────────────────┬─────────────────────────────────────────────────────┐
 * │ Platform + Install   │ How version is fetched                              │
 * ├──────────────────────┼─────────────────────────────────────────────────────┤
 * │ iOS (any install)    │ Apple iTunes Lookup API → always works              │
 * │ iOS App Store        │ ✅ Popup shown if store > installed                 │
 * │ iOS sideloaded IPA   │ ✅ Popup shown if store > installed (API unrestricted)│
 * ├──────────────────────┼─────────────────────────────────────────────────────┤
 * │ Android Play Store   │ sp-react-native-in-app-updates (primary)            │
 * │                      │ ✅ Popup + native in-app download flow               │
 * │ Android release APK  │ Library throws APP_NOT_OWNED → Play Store scrape    │
 * │ (sideloaded)         │ ✅ Popup shown, opens Play Store link to update     │
 * │ Android DEV build    │ Scrape fallback only (library always fails in dev)  │
 * │                      │ ✅ Popup shown for UI testing                       │
 * └──────────────────────┴─────────────────────────────────────────────────────┘
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  Platform,
  Linking,
  Alert,
  AppState,
} from 'react-native';

import SpInAppUpdates, {
  IAUUpdateKind,
  IAUInstallStatus,
} from 'sp-react-native-in-app-updates';

import DeviceInfo from 'react-native-device-info';
import Colorpath from '../../Themes/Colorpath';

// ─── App identifiers — only change if you rename/republish the app ─────────────
const IOS_APP_STORE_ID = '1540770118';           // https://apps.apple.com/us/app/emedevents/id1540770118
const ANDROID_PACKAGE = 'com.emedevents.newapp';
const IOS_STORE_URL = `https://apps.apple.com/app/id${IOS_APP_STORE_ID}`;
const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
const UPDATE_RECHECK_MS = 30 * 60 * 1000; // 30 min periodic check while app is open
// ─────────────────────────────────────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Strict semver comparison.
 * Returns true only when storeVer is strictly greater than installedVer.
 * e.g. isNewerVersion("1.0.7", "1.0.8") → true
 *      isNewerVersion("1.0.8", "1.0.8") → false
 *      isNewerVersion("1.0.9", "1.0.8") → false
 */
const isNewerVersion = (installedVer, storeVer) => {
  if (!installedVer || !storeVer) return false;
  const clean = (v) => String(v).replace(/[^0-9.]/g, '');
  const a = clean(installedVer).split('.').map(Number);
  const b = clean(storeVer).split('.').map(Number);
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (bv > av) return true;
    if (bv < av) return false;
  }
  return false;
};

// Version helpers: avoid showing Android versionCode (e.g., "26") in the UI
const looksLikeSemver = (v) => /\d+\.\d+/.test(String(v ?? ''));
const isNumericVersionCode = (v) => /^[0-9]+$/.test(String(v ?? ''));

/**
 * iOS — Fetch latest version from Apple's iTunes Lookup API.
 * This is 100% dynamic; no version numbers are hardcoded.
 */
const fetchLatestIOSVersion = async () => {
  const bundleId = DeviceInfo.getBundleId();
  try {
    const resById = await fetch(
      `https://itunes.apple.com/lookup?id=${IOS_APP_STORE_ID}&country=us`,
    );
    const jsonById = await resById.json();
    const verById = jsonById?.results?.[0]?.version ?? null;
    if (verById) {
      console.log('AppUpdate [iOS]: iTunes store version (app id):', verById);
      return verById;
    }
  } catch (err) {
    console.log('AppUpdate [iOS]: iTunes lookup by id error:', err?.message);
  }

  // Fallback: lookup by bundleId (helps when id response is empty/cached unexpectedly)
  try {
    const resByBundle = await fetch(
      `https://itunes.apple.com/lookup?bundleId=${bundleId}&country=us`,
    );
    const jsonByBundle = await resByBundle.json();
    const verByBundle = jsonByBundle?.results?.[0]?.version ?? null;
    console.log('AppUpdate [iOS]: iTunes store version (bundle id):', verByBundle);
    return verByBundle;
  } catch (err) {
    console.log('AppUpdate [iOS]: iTunes lookup by bundle id error:', err?.message);
    return null;
  }
};

/**
 * Android fallback — fetches the latest version from the Play Store page.
 *
 * Works for:
 *  ✅ Sideloaded release APKs  (sp-react-native-in-app-updates throws APP_NOT_OWNED)
 *  ✅ DEV / debug builds       (library always fails in debug)
 *
 * Google changes their HTML structure occasionally, so we try multiple patterns
 * to maximise reliability.
 */
const fetchLatestAndroidVersion = async () => {
  try {
    const res = await fetch(
      // Use the ?hl=en to force English and avoid locale-specific page differences
      `${ANDROID_STORE_URL}&hl=en`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' } },
    );
    const html = await res.text();

    // Pattern 1: modern Play Store JSON embedding  [["1.0.8"]]
    const p1 = html.match(/\[\["(\d+\.\d+(?:\.\d+)*)"\]/);
    if (p1?.[1]) {
      console.log('AppUpdate [Android]: Scraped version (p1):', p1[1]);
      return p1[1];
    }

    // Pattern 2: older layout  ,"1.0.8",
    const p2 = html.match(/,"(\d+\.\d+(?:\.\d+)*)",/);
    if (p2?.[1]) {
      console.log('AppUpdate [Android]: Scraped version (p2):', p2[1]);
      return p2[1];
    }

    // Pattern 3: itemprop="softwareVersion">1.0.8<
    const p3 = html.match(/itemprop=["']softwareVersion["'][^>]*>([\d.]+)</);
    if (p3?.[1]) {
      console.log('AppUpdate [Android]: Scraped version (p3):', p3[1]);
      return p3[1];
    }

    console.log('AppUpdate [Android]: Could not extract version from Play Store page.');
    return null;
  } catch (err) {
    console.log('AppUpdate [Android]: Play Store scrape error:', err?.message);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const AppUpdateHandler = () => {
  // Pass `false` always — dev-mode guard is handled manually below
  const inAppUpdates = useRef(new SpInAppUpdates(false)).current;

  const [showModal, setShowModal] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');
  const [storeUrl, setStoreUrl] = useState('');

  const listenerAdded = useRef(false);  // Android download listener guard
  const isChecking = useRef(false);  // Debounce simultaneous checks
  const modalShown = useRef(false);  // Track shown state without closure issues

  // ─── Open update modal ───────────────────────────────────────────────────────
  const openUpdateModal = useCallback((version, mandatory, url) => {
    if (modalShown.current) return; // already visible, don't stack
    modalShown.current = true;
    setLatestVersion(version ?? '');
    setIsMandatory(!!mandatory);
    setStoreUrl(url ?? (Platform.OS === 'ios' ? IOS_STORE_URL : ANDROID_STORE_URL));
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    modalShown.current = false;
    setShowModal(false);
    setShowProgress(false);
    setProgress(0);
    setStatusText('');
  }, []);

  // ─── iOS check ───────────────────────────────────────────────────────────────
  const checkIOS = useCallback(async (currentVersion) => {
    console.log(`AppUpdate [iOS]: installed=${currentVersion}`);
    const storeVersion = await fetchLatestIOSVersion();
    if (!storeVersion) {
      console.log('AppUpdate [iOS]: Could not fetch store version.');
      return;
    }
    if (isNewerVersion(currentVersion, storeVersion)) {
      console.log(`AppUpdate [iOS]: Update available → ${storeVersion}`);
      openUpdateModal(storeVersion, false, IOS_STORE_URL);
    } else {
      console.log('AppUpdate [iOS]: Up to date.');
    }
  }, [openUpdateModal]);

  // ─── Android check ────────────────────────────────────────────────────────
  const checkAndroid = useCallback(async (currentVersion, currentBuild) => {
    console.log(`AppUpdate [Android]: installed=${currentVersion} (code: ${currentBuild})`);

    let libraryStoreVersion = null;
    let libraryMandatory = false;
    let libraryStoreUrl = ANDROID_STORE_URL;
    let libraryFailed = false;
    let librarySaysUpdate = false;

    // ── Step 1: Try sp-react-native-in-app-updates (works for Play Store installs) ──
    try {
      const result = await inAppUpdates.checkNeedsUpdate({ curVersion: currentVersion });
      console.log('AppUpdate [Android]: library result:', JSON.stringify(result));

      if (result?.shouldUpdate) {
        librarySaysUpdate = true;
        libraryStoreVersion = String(result.storeVersion || '');
        libraryMandatory = (result.updatePriority ?? 0) >= 4;
        libraryStoreUrl = result.storeUrl || ANDROID_STORE_URL;
        console.log(`AppUpdate [Android]: Library says update available → ${libraryStoreVersion}`);
      } else {
        console.log('AppUpdate [Android]: Library says up to date. Running scrape to verify...');
      }
    } catch (libErr) {
      libraryFailed = true;
      console.log('AppUpdate [Android]: Library threw error (e.g. APP_NOT_OWNED):', libErr?.message);
    }

    // ── Step 2: Always scrape Play Store as a second opinion ──────────────────
    const scrapeVersion = await fetchLatestAndroidVersion();
    console.log(`AppUpdate [Android]: Scrape version=${scrapeVersion}`);

    // ── Step 3: Decide if update is needed + choose display version ───────────
    const scrapeLooksSemver = looksLikeSemver(scrapeVersion);
    const libraryLooksSemver = looksLikeSemver(libraryStoreVersion);
    const libraryLooksLikeCode = isNumericVersionCode(libraryStoreVersion);

    // If both look like codes, compare them. If both look like semver, compare them.
    // If we have a mix, trust the semver one for the UI.
    let shouldUpdate = librarySaysUpdate;

    // Safety check: if library gives us a code (e.g. "28"), compare it against local buildNumber, NOT currentVersion.
    if (librarySaysUpdate && libraryLooksLikeCode) {
      if (!isNewerVersion(currentBuild, libraryStoreVersion)) {
        console.log('AppUpdate [Android]: Library code is NOT newer than current build. Ignoring.');
        shouldUpdate = false;
      }
    }

    // If scrape says update, it's usually the most reliable for version names.
    const scrapeSaysUpdate = scrapeLooksSemver && isNewerVersion(currentVersion, scrapeVersion);
    if (scrapeSaysUpdate) shouldUpdate = true;

    // Display version should ALWAYS be a versionName like "1.1.1", never a numeric code.
    const displayVersion =
      scrapeLooksSemver ? scrapeVersion
        : libraryLooksSemver ? libraryStoreVersion
          : ''; // Never show "28" - if we don't have a semver string, show blank and let UI handle it.

    if (shouldUpdate) {
      console.log(`AppUpdate [Android]: ✅ Update confirmed → ${displayVersion || 'unknown name'}`);
      openUpdateModal(
        displayVersion,
        libraryMandatory,
        libraryFailed ? ANDROID_STORE_URL : libraryStoreUrl,
      );
    } else {
      console.log('AppUpdate [Android]: ✅ App is up to date.');
    }
  }, [inAppUpdates, openUpdateModal]);

  // ─── Main entry point ────────────────────────────────────────────────────────
  const checkUpdate = useCallback(async () => {
    if (modalShown.current || isChecking.current) return;
    isChecking.current = true;

    try {
      const currentVersion = DeviceInfo.getVersion();
      const currentBuild = DeviceInfo.getBuildNumber();
      console.log(`AppUpdate: Checking update. Installed: ${currentVersion} (code: ${currentBuild})`);

      if (Platform.OS === 'ios') {
        // ✅ iOS: iTunes Lookup API works for ALL install types:
        //    - App Store official download
        //    - Sideloaded IPA (Ad Hoc / Enterprise / TestFlight)
        //    - DEV builds (for UI testing)
        await checkIOS(currentVersion);
      } else {
        // Android strategy:
        //
        // __DEV__ = true  → debug APK/Metro: library always throws APP_NOT_OWNED
        //                     → skip library, go straight to scrape fallback
        //
        // __DEV__ = false → release build:
        //   - Play Store install     → library works, full in-app update flow ✅
        //   - Sideloaded release APK → library throws APP_NOT_OWNED,
        //                              checkAndroid() catches it and runs scrape ✅
        if (__DEV__) {
          console.log('AppUpdate [Android]: DEV mode — scrape fallback only.');
          const scrapeVersion = await fetchLatestAndroidVersion();
          const scrapeLooksSemver = looksLikeSemver(scrapeVersion);

          if (scrapeVersion && isNewerVersion(currentVersion, scrapeVersion)) {
            // Even in DEV, only show the version string if it looks like semver
            openUpdateModal(scrapeLooksSemver ? scrapeVersion : '', false, ANDROID_STORE_URL);
          } else {
            console.log('AppUpdate [Android]: DEV — up to date or scrape returned null.');
          }
        } else {
          // checkAndroid tries library first, then automatically falls back to
          // scrape if library fails (handles sideloaded release APKs transparently)
          await checkAndroid(currentVersion, currentBuild);
        }
      }
    } catch (err) {
      console.log('AppUpdate: Unexpected error in checkUpdate:', err?.message);
    } finally {
      isChecking.current = false;
    }
  }, [checkIOS, checkAndroid, openUpdateModal]);

  // ─── Hardware back button — block when mandatory ──────────────────────────────
  useEffect(() => {
    if (!isMandatory || !showModal) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [isMandatory, showModal]);

  // ─── Run on mount + every time app comes to foreground ───────────────────────
  useEffect(() => {
    checkUpdate();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') checkUpdate();
    });
    const intervalId = setInterval(() => {
      checkUpdate();
    }, UPDATE_RECHECK_MS);

    return () => {
      sub.remove();
      clearInterval(intervalId);
    };
  }, [checkUpdate]);

  // ─── Android download-status listener (registered once) ──────────────────────
  useEffect(() => {
    if (Platform.OS !== 'android' || listenerAdded.current) return;
    listenerAdded.current = true;

    inAppUpdates.addStatusUpdateListener((status) => {
      console.log('AppUpdate: status event →', status?.status);
      switch (status.status) {
        case IAUInstallStatus.DOWNLOADING:
          setStatusText('Downloading update…');
          setProgress(
            status.totalBytesToDownload > 0
              ? status.bytesDownloaded / status.totalBytesToDownload
              : 0,
          );
          break;
        case IAUInstallStatus.DOWNLOADED:
          setStatusText('Installing update…');
          inAppUpdates.installUpdate();
          break;
        case IAUInstallStatus.INSTALLING:
          setStatusText('Installing…');
          break;
        case IAUInstallStatus.FAILED:
          setStatusText('Update failed');
          setShowProgress(false);
          Alert.alert('Update Failed', 'Please update manually from the Play Store.');
          break;
        default:
          break;
      }
    });

    return () => {
      try { inAppUpdates.removeStatusUpdateListener(); } catch (_) { }
    };
  }, [inAppUpdates]);

  // ─── Start update ─────────────────────────────────────────────────────────────
  const startUpdate = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL(storeUrl || IOS_STORE_URL);
        closeModal();
        return;
      }

      // Android in-app update flow
      const updateType = isMandatory
        ? IAUUpdateKind.IMMEDIATE
        : IAUUpdateKind.FLEXIBLE;

      if (updateType === IAUUpdateKind.FLEXIBLE) {
        setShowProgress(true);
        setStatusText('Preparing update…');
      }

      await inAppUpdates.startUpdate({ updateType });
    } catch (e) {
      console.log('AppUpdate: startUpdate error:', e?.message);
      setShowProgress(false);
      // Always fallback to opening the store page
      const url = storeUrl || (Platform.OS === 'ios' ? IOS_STORE_URL : ANDROID_STORE_URL);
      await Linking.openURL(url).catch(() =>
        Alert.alert('Error', 'Could not open the store. Please update manually.'),
      );
    }
  };

  // ─── Nothing to render until there's an update ───────────────────────────────
  if (!showModal) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={showModal}
      statusBarTranslucent
      onRequestClose={() => {
        if (!isMandatory) closeModal();
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* Badge */}
          <View style={styles.iconBadge}>
            <Text style={styles.iconText}>🚀</Text>
          </View>

          <Text style={styles.title}>Update Available</Text>

          {!!latestVersion && (
            <Text style={styles.subtitle}>
              Version {latestVersion} is now available!
            </Text>
          )}

          <Text style={styles.body}>
            {isMandatory
              ? 'This update is required to continue using the app.'
              : 'A new version of the app is available. Update now to enjoy the latest features and improvements.'}
          </Text>

          {showProgress ? (
            <View style={styles.progressContainer}>
              <Text style={styles.status}>{statusText}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.round(progress * 100)}%` },
                  ]}
                />
              </View>
              <ActivityIndicator
                style={{ marginTop: 16 }}
                color={Colorpath.ButtonColr || '#2C4DB9'}
              />
            </View>
          ) : (
            <View style={styles.actions}>
              {!isMandatory && (
                <TouchableOpacity
                  style={styles.laterBtn}
                  onPress={closeModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.laterText}>Later</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.updateBtn, isMandatory && styles.updateBtnFull]}
                onPress={startUpdate}
                activeOpacity={0.85}
              >
                <Text style={styles.updateText}>Update Now</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
};

export default AppUpdateHandler;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: { fontSize: 28 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colorpath.ButtonColr || '#2C4DB9',
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 21,
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  status: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#555',
    fontWeight: '500',
    fontSize: 14,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colorpath.ButtonColr || '#2C4DB9',
    borderRadius: 3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  laterBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  laterText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  updateBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colorpath.ButtonColr || '#2C4DB9',
    alignItems: 'center',
    shadowColor: Colorpath.ButtonColr || '#2C4DB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  updateBtnFull: { flex: 1 },
  updateText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
