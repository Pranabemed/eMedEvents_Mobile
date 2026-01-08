import React, { useEffect } from 'react'
import StackNav from './src/Navigator/StackNav'
import { tokenRequest } from './src/Redux/Reducers/AuthReducer'
import { useDispatch } from 'react-redux'
import showErrorAlert from './src/Utils/Helpers/Toast'
import connectionrequest from './src/Utils/Helpers/NetInfo'
import { boardcountRequest, countRequest } from './src/Redux/Reducers/DashboardReducer'
import Orientation from 'react-native-orientation-locker';
import { Platform } from 'react-native'
import {initPublicIP} from './src/Utils/Helpers/IPServer'
const App = () => {
  // const AuthReducer = useSelector(state => state.AuthReducer);
  const dispatch = useDispatch()
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
    <StackNav />
  )
}

export default App