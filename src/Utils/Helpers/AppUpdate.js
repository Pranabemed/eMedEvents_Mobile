import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
} from 'react-native';

import SpInAppUpdates, {
  IAUUpdateKind,
  IAUInstallStatus,
} from 'sp-react-native-in-app-updates';

import DeviceInfo from 'react-native-device-info';

const AppUpdateHandler = ({ updateInfo }) => {
  console.log(updateInfo,"updateinfo=====")
  const inAppUpdates = useRef(new SpInAppUpdates(false)).current;

  const [showModal, setShowModal] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [showProgress, setShowProgress] = useState(false);

  const hasCheckedRef = useRef(false);

  // 🔹 Version compare
  const isUpdateRequired = (installed, latest) => {
    const i = installed.split('.').map(Number);
    const l = latest.split('.').map(Number);

    for (let x = 0; x < Math.max(i.length, l.length); x++) {
      const a = i[x] || 0;
      const b = l[x] || 0;
      if (b > a) return true;
      if (b < a) return false;
    }
    return false;
  };

  // 🔹 Check update once
  useEffect(() => {
    if (!updateInfo?.current_version) return;
    if (hasCheckedRef.current) return;

    hasCheckedRef.current = true;

    const checkUpdate = async () => {
      const installedVersion = DeviceInfo.getVersion(); // e.g. 1.0.3
      const latestVersion = updateInfo.current_version;

      console.log('Installed:', installedVersion);
      console.log('Latest:', latestVersion);

      const shouldUpdate = isUpdateRequired(installedVersion, latestVersion);
      if (!shouldUpdate) return;

      setIsMandatory(!!updateInfo.force_update);
      setShowModal(true);

      if (updateInfo.force_update) {
        BackHandler.addEventListener('hardwareBackPress', () => true);
      }
    };

    checkUpdate();

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', () => true);
    };
  }, [updateInfo]);

  // 🔹 Start Android update
  const startUpdate = async () => {
    try {
      setShowProgress(true);
      setStatusText('Preparing update...');

      const updateType = isMandatory
        ? IAUUpdateKind.IMMEDIATE
        : IAUUpdateKind.FLEXIBLE;

      inAppUpdates.addStatusUpdateListener(status => {
        switch (status.status) {
          case IAUInstallStatus.DOWNLOADING:
            setStatusText('Downloading update...');
            setProgress(
              status.bytesDownloaded / status.totalBytesToDownload
            );
            break;

          case IAUInstallStatus.DOWNLOADED:
            setStatusText('Installing update...');
            inAppUpdates.installUpdate();
            break;

          case IAUInstallStatus.INSTALLING:
            setStatusText('Installing...');
            break;

          case IAUInstallStatus.FAILED:
            setStatusText('Update failed');
            break;
        }
      });

      await inAppUpdates.startUpdate({ updateType });
    } catch (e) {
      console.log('Update error:', e);
    }
  };

  if (!showModal) return null;

  return (
    <Modal transparent animationType="fade" visible>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.version}>
            Version {updateInfo.current_version}
          </Text>

          {showProgress ? (
            <>
              <Text style={styles.status}>{statusText}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress * 100}%` },
                  ]}
                />
              </View>
              <ActivityIndicator style={{ marginTop: 16 }} />
            </>
          ) : (
            <View style={styles.actions}>
              {!isMandatory && (
                <TouchableOpacity
                  style={styles.later}
                  onPress={() => setShowModal(false)}
                >
                  <Text>Later</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.update}
                onPress={startUpdate}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isMandatory && (
            <Text style={styles.footer}>
              You must update to continue using the app
            </Text>
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
  },
  card: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  version: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 16,
  },
  status: {
    textAlign: 'center',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4285F4',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  later: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
  },
  update: {
    flex: 1,
    backgroundColor: '#4285F4',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  footer: {
    marginTop: 16,
    textAlign: 'center',
    color: 'red',
    fontWeight: '600',
  },
});