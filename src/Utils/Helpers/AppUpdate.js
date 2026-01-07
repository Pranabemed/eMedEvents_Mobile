import React, { useEffect, useState } from 'react';
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
  IAUInstallStatus,
} from "sp-react-native-in-app-updates";
import {
  Platform,
  BackHandler,
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator
} from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

const AppUpdateHandler = ({ updateInfo }) => {
  const inAppUpdates = new SpInAppUpdates(false);
  const checkForUpdates = async () => {
    try {
      const currentVersion = updateInfo?.current_version; // optional field
      const updateResponse = await inAppUpdates.checkNeedsUpdate({ curVersion: currentVersion });
      if (Platform.OS === 'android') {
        const updateOptions = { updateType: IAUUpdateKind.FLEXIBLE }; // Flexible update

        if (updateResponse.shouldUpdate) {
          console.log("Update available, starting update.");
        } else {
          console.log("No update required, starting update anyway.");
        }

        await inAppUpdates.startUpdate(updateOptions);

        // Add status update listener for flexible updates
        inAppUpdates.addStatusUpdateListener(downloadStatus => {
          console.log('Download status', downloadStatus);

          if (downloadStatus.status === IAUInstallStatus.DOWNLOADED) {
            console.log('Downloaded');
            inAppUpdates.installUpdate();

            // Remove the status update listener after installation
            inAppUpdates.removeStatusUpdateListener(finalStatus => {
              console.log('Final status', finalStatus);
            });
          }
        });
      }
    } catch (error) {
      console.error("Error checking for updates: ", error);
    }
  };
  useEffect(()=>{
    checkForUpdates()
  },[updateInfo])
  // console.log(checkForUpdates, "sfsdfhdhdfhgkdf")
  return
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState('Checking for updates...');
  const [showProgress, setShowProgress] = useState(false);

  // const inAppUpdates = new InAppUpdates(false);

  // Compare version strings
  const isNewVersionAvailable = () => {
    const { previous_version, current_version } = updateInfo;

    if (!previous_version || !current_version) {
      return false;
    }

    const prevParts = previous_version.split('.').map(Number);
    const currParts = current_version.split('.').map(Number);

    for (let i = 0; i < Math.max(prevParts.length, currParts.length); i++) {
      const prevPart = prevParts[i] || 0;
      const currPart = currParts[i] || 0;

      if (currPart > prevPart) return true;
      if (currPart < prevPart) return false;
    }

    return false;
  };

  const handleForceUpdate = () => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => true);
    }
    setIsMandatory(true);
    setShowUpdateModal(true);
  };

  const startUpdate = async (isMandatory = false) => {
    try {
      setShowProgress(true);
      setUpdateStatus('Preparing update...');

      const updateOptions = {
        updateType: isMandatory
          ? InAppUpdates.UPDATE_TYPE.IMMEDIATE
          : InAppUpdates.UPDATE_TYPE.FLEXIBLE,
      };

      // Listen to update status
      inAppUpdates.addStatusUpdateListener((status) => {
        console.log('Update status:', status);
        switch (status.status) {
          case InAppUpdates.UPDATE_STATUS.DOWNLOADING:
            setUpdateStatus('Downloading update...');
            setUpdateProgress(status.bytesDownloaded / status.totalBytesToDownload);
            break;
          case InAppUpdates.UPDATE_STATUS.INSTALLING:
            setUpdateStatus('Installing update...');
            break;
          case InAppUpdates.UPDATE_STATUS.PENDING:
            setUpdateStatus('Update ready to install');
            break;
          case InAppUpdates.UPDATE_STATUS.FAILED:
            setUpdateStatus('Update failed. Please try again.');
            break;
          default:
            setUpdateStatus(`Status: ${status.status}`);
        }
      });

      await inAppUpdates.startUpdate(updateOptions);
    } catch (error) {
      console.error('Update failed:', error);
      setUpdateStatus(`Error: ${error.message}`);

      if (isMandatory) {
        // If mandatory update fails, show alert again
        setTimeout(() => handleForceUpdate(), 2000);
      }
    }
  };

  const openStore = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/app/com.emedevents.emedevents');
    } else {
      Linking.openURL('market://details?id=com.emedevents.newapp');
    }
  };

  const checkAppUpdate = async () => {
    if (!isNewVersionAvailable()) {
      console.log('No update available');
      return;
    }

    try {
      // For iOS, we need to show custom modal
      if (Platform.OS === 'ios') {
        if (updateInfo.force_update) {
          handleForceUpdate();
        } else {
          setIsMandatory(false);
          setShowUpdateModal(true);
        }
        return;
      }

      // For Android, use in-app updates
      const result = await inAppUpdates.checkNeedsUpdate();

      if (result.shouldUpdate) {
        if (updateInfo.force_update) {
          handleForceUpdate();
        } else {
          setIsMandatory(false);
          setShowUpdateModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking update:', error);
    }
  };

  useEffect(() => {
    checkAppUpdate();

    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress', () => true);
      }
    };
  }, []);

  return (
    <Modal
      visible={showUpdateModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => !isMandatory && setShowUpdateModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            {/* <Ionicons 
              name="cloud-download" 
              size={40} 
              color="#4285F4" 
              style={styles.icon}
            /> */}
            <Text style={styles.title}>App Update Available</Text>
            <Text style={styles.subtitle}>Version {updateInfo.current_version}</Text>
          </View>

          <View style={styles.updateInfo}>
            <View style={styles.infoRow}>
              {/* <Ionicons name="document-text" size={20} color="#5F6368" /> */}
              <Text style={styles.infoText}>Improved performance and bug fixes</Text>
            </View>
            <View style={styles.infoRow}>
              {/* <Ionicons name="shield-checkmark" size={20} color="#5F6368" /> */}
              <Text style={styles.infoText}>Security enhancements</Text>
            </View>
            <View style={styles.infoRow}>
              {/* <Ionicons name="star" size={20} color="#5F6368" /> */}
              <Text style={styles.infoText}>New features added</Text>
            </View>
          </View>

          {showProgress ? (
            <View style={styles.progressContainer}>
              <Text style={styles.statusText}>{updateStatus}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${updateProgress * 100}%` }
                  ]}
                />
              </View>
              <ActivityIndicator
                size="small"
                color="#4285F4"
                style={styles.spinner}
              />
              <Text style={styles.progressText}>
                {Math.round(updateProgress * 100)}% complete
              </Text>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              {!isMandatory && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowUpdateModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Later</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.updateButton]}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    openStore();
                  } else {
                    startUpdate(isMandatory);
                  }
                }}
              >
                <Text style={styles.updateButtonText}>
                  {isMandatory ? 'Update Now' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isMandatory
                ? 'You must update to continue using the app'
                : 'Recommended for the best experience'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Google-inspired color scheme
const colors = {
  primary: '#4285F4', // Google blue
  background: '#FFFFFF', // White
  text: '#202124', // Google dark gray
  secondaryText: '#5F6368', // Google light gray
  border: '#DADCE0', // Google border gray
  success: '#34A853', // Google green
  warning: '#FBBC05', // Google yellow
  error: '#EA4335', // Google red
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#F8F9FA',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  updateInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  progressContainer: {
    padding: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    width: '100%',
    backgroundColor: '#E8EAED',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  spinner: {
    marginVertical: 16,
  },
  progressText: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F1F3F4',
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: colors.primary,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
  },
});

export default AppUpdateHandler;