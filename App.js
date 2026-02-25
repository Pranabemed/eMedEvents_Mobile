import React, { useEffect } from 'react'
import StackNav from './src/Navigator/StackNav'
import { tokenRequest } from './src/Redux/Reducers/AuthReducer'
import { useDispatch } from 'react-redux'
import showErrorAlert from './src/Utils/Helpers/Toast'
import connectionrequest from './src/Utils/Helpers/NetInfo'
import { boardcountRequest, countRequest } from './src/Redux/Reducers/DashboardReducer'
import Orientation from 'react-native-orientation-locker';
import { Platform } from 'react-native'
import { initPublicIP } from './src/Utils/Helpers/IPServer'
import AppUpdateHandler from './src/Utils/Helpers/AppUpdate';
import TokenManager from './src/Utils/Helpers/TokenManager';

const App = () => {
  const dispatch = useDispatch()

  // ─── Proactive token refresh: cold-start + app foreground ──────────────────
  // Refresh the token BEFORE any API call fires. Covers:
  //   • App killed and reopened (cold start)
  //   • App returns from background after 8+ minutes idle
  useEffect(() => {
    const cleanup = TokenManager.init();
    return cleanup;
  }, []);

  // ─── Standard app bootstrap ─────────────────────────────────────────────────
  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(tokenRequest());
        dispatch(countRequest());
        dispatch(boardcountRequest());
      })
      .catch(err => {
        showErrorAlert('Please connect to Internet', err);
      });
  }, [])

  useEffect(() => {
    initPublicIP(); // 🔥 runs once
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Orientation.lockToPortrait();
    }
  }, []);

  return (
    <>
      <StackNav />
      <AppUpdateHandler />
    </>
  )
}

export default App