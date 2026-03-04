import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import Buttons from '../../Components/Button';
import Fonts from '../../Themes/Fonts';
import IntIcn from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Internet from './Internet';
import { useSelector } from 'react-redux';

export const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [takestate, setTakestate] = useState('');
  const [addit, setAddit] = useState('');
  const [fulldashbaord, setFulldashbaord] = useState(null);
  const [stateCount, setStateCount] = useState(null);
  const [isConnected, setIsConnected] = useState("");
  const [takedata, setTakedata] = useState(null);
  const [gtprof, setGtprof] = useState(false);
  const [totalcard, setTotalCred] = useState();
  const [stateid, setStateid] = useState();
  const [renewal, setRenewal] = useState("");
  const [cartcount, setCartcount] = useState("")
  const [expireDate, setExpireDate] = useState(false);
  const [finddata, setFinddata] = useState("");
  const [statepush, setStatepush] = useState("");
  const [pushnew, setPushnew] = useState(false);
  const [addresssort, setAddresssort] = useState("");
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const authToken = useSelector(state => state?.AuthReducer?.token);
  const dashboardLicensures = useSelector(
    state => state?.DashboardReducer?.dashboardResponse?.data?.licensures
  );
  const prevAuthTokenRef = useRef(authToken);

  const resetSessionContext = () => {
    setTakestate('');
    setAddit('');
    setFulldashbaord(null);
    setStateCount(null);
    setTakedata(null);
    setGtprof(false);
    setTotalCred(undefined);
    setStateid(undefined);
    setRenewal("");
    setCartcount("");
    setExpireDate(false);
    setFinddata(null);
    setStatepush("");
    setPushnew(false);
    setAddresssort("");
    setCompletedCount(0);
    setPendingCount(0);
  };

  useEffect(() => {
    if (dashboardLicensures === undefined || dashboardLicensures === null) return;

    if (dashboardLicensures === 0) {
      setFulldashbaord(0);
      return;
    }

    if (!Array.isArray(dashboardLicensures)) {
      setFulldashbaord([]);
      return;
    }

    const uniqueStates = dashboardLicensures.filter((state, index, self) => {
      return index === self.findIndex((s) =>
        s.state_id === state.state_id &&
        s.board_id === state.board_id
      );
    });
    setFulldashbaord(uniqueStates);
  }, [dashboardLicensures]);

  useEffect(() => {
    // Clear all stale in-memory dashboard/session data when account token changes.
    if (prevAuthTokenRef.current !== authToken) {
      resetSessionContext();
      prevAuthTokenRef.current = authToken;
    }
  }, [authToken]);
  const clearContextData = () => {
    setFinddata(null);
  };
  const values = {
    completedCount,
    setCompletedCount,
    pendingCount,
    setPendingCount,
    takestate,
    setTakestate,
    addit,
    setAddit,
    fulldashbaord,
    setFulldashbaord,
    setStateCount,
    stateCount,
    isConnected,
    setIsConnected,
    takedata,
    setTakedata,
    setGtprof,
    gtprof,
    totalcard,
    setTotalCred,
    stateid,
    setStateid,
    renewal,
    setRenewal,
    cartcount,
    setCartcount,
    expireDate,
    setExpireDate,
    finddata,
    setFinddata,
    statepush,
    setStatepush,
    setPushnew,
    pushnew,
    setAddresssort,
    addresssort,
    clearContextData
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection State:', state.isConnected);
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={values}>
      {children}
      {!isConnected && <Internet />}
    </AppContext.Provider>
  );
};

export default AppProvider;


