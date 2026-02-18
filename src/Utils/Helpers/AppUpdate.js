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

const AppUpdateHandler = () => {
  // Use debug mode in development to ensure checkNeedsUpdate doesn't fail silently or works with debug builds
  // Passing true to constructor enables internal debug logging/mocking for the library if supported, 
  // or simply helps differentiate environments.
  const inAppUpdates = useRef(new SpInAppUpdates(__DEV__)).current;

  const [showModal, setShowModal] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');
  const [storeUrl, setStoreUrl] = useState('');



  // 🔹 Check update logic
  const checkUpdate = useCallback(async () => {
    const currentVersion = DeviceInfo.getVersion();
    console.log('AppUpdate: Current installed version:', currentVersion);

    // Skip update check in development/debug builds.
    // The Play Store In-App Updates API requires the app to be installed
    // from the Play Store (not sideloaded/debug). Running it in dev mode
    // will always throw APP_NOT_OWNED (-10) error.
    if (__DEV__) {
      console.log('AppUpdate: Skipping update check in development mode.');
      return;
    }

    // Automatic Store Check (Release builds only)
    try {
      console.log('AppUpdate: Checking store versions...');
      const result = await inAppUpdates.checkNeedsUpdate();

      if (result?.shouldUpdate) {
        console.log('AppUpdate: Update available:', result);
        setLatestVersion(result.storeVersion);
        setStoreUrl(result.storeUrl);

        // Android: Check update priority if available (0-5)
        // 4 or 5 usually implies high priority/mandatory
        if (Platform.OS === 'android' && result.updatePriority >= 4) {
          setIsMandatory(true);
        }

        setShowModal(true);
      } else {
        console.log('AppUpdate: No update needed');
      }
    } catch (error) {
      console.log('AppUpdate: check error:', error);
    }
  }, [inAppUpdates]);

  // 🔹 Handle Hardware Back Button
  useEffect(() => {
    if (isMandatory && showModal) {
      const backAction = () => {
        // If mandatory update, block back button
        return isMandatory;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        subscription.remove();
      };
    }
  }, [isMandatory, showModal]);

  // 🔹 Lifecycle & AppState checks
  useEffect(() => {
    checkUpdate();

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        checkUpdate();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [checkUpdate]);


  // 🔹 Start Update Flow
  const startUpdate = async () => {
    try {
      // iOS Handling
      if (Platform.OS === 'ios') {
        if (storeUrl) {
          Linking.openURL(storeUrl);
        } else {
          // Attempt asking lib to handle it (usually opens store)
          await inAppUpdates.startUpdate({ updateType: IAUUpdateKind.IMMEDIATE });
        }
        return;
      }

      // Android Handling
      const updateType = isMandatory
        ? IAUUpdateKind.IMMEDIATE
        : IAUUpdateKind.FLEXIBLE;

      if (updateType === IAUUpdateKind.FLEXIBLE) {
        setShowProgress(true);
        setStatusText('Preparing update...');
      }

      // Add Listener
      inAppUpdates.addStatusUpdateListener(status => {
        console.log('AppUpdate Status:', status);
        if (status.status === IAUInstallStatus.DOWNLOADING) {
          setStatusText('Downloading update...');
          const p =
            status.totalBytesToDownload > 0
              ? status.bytesDownloaded / status.totalBytesToDownload
              : 0;
          setProgress(p);
        } else if (status.status === IAUInstallStatus.DOWNLOADED) {
          setStatusText('Installing update...');
          inAppUpdates.installUpdate();
        } else if (status.status === IAUInstallStatus.INSTALLING) {
          setStatusText('Installing...');
        } else if (status.status === IAUInstallStatus.FAILED) {
          setStatusText('Update failed');
          setShowProgress(false);
          Alert.alert('Update Failed', 'Please update from the Play Store.');
        }
      });

      await inAppUpdates.startUpdate({ updateType });

    } catch (e) {
      console.log('AppUpdate: startUpdate error:', e);
      setShowProgress(false);
      // Fallback
      if (storeUrl) {
        Linking.openURL(storeUrl);
      } else {
        Alert.alert('Update Error', 'Could not start update.');
      }
    }
  };

  if (!showModal) return null;
  return (
    <Modal
      transparent
      animationType="fade"
      visible={showModal}
      onRequestClose={() => {
        // Block closing if mandatory
        if (!isMandatory) setShowModal(false);
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.version}>
            A new version {latestVersion ? `(${latestVersion})` : ''} is available.
            {isMandatory ? ' You must update to continue.' : ' Would you like to update now?'}
          </Text>

          {showProgress ? (
            <View style={styles.progressContainer}>
              <Text style={styles.status}>{statusText}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress * 100}%` },
                  ]}
                />
              </View>
              <ActivityIndicator style={{ marginTop: 16 }} color={Colorpath.ButtonColr || '#2C4DB9'} />
            </View>
          ) : (
            <View style={styles.actions}>
              {!isMandatory && (
                <TouchableOpacity
                  style={styles.laterBtn}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.laterText}>Later</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.updateBtn, isMandatory && styles.updateBtnFull]}
                onPress={startUpdate}
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 24,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  version: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 22,
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  status: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
    fontWeight: '500',
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
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  laterBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  laterText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  updateBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colorpath.ButtonColr || '#2C4DB9',
    alignItems: 'center',
  },
  updateBtnFull: {
    flex: 1,
  },
  updateText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});