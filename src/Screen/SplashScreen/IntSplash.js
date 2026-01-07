import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Alert, Image, ImageBackground, LogBox, Text, View } from 'react-native';
import Imagepath from '../../Themes/Imagepath';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { chooseStatecardRequest, licesensRequest, tokenRequest, verifyRequest } from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { dashboardRequest, mainprofileRequest, stateDashboardRequest, stateReportingRequest } from '../../Redux/Reducers/DashboardReducer';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import { AppContext } from '../GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';

let status1 = "";
export default function SplashInt(props) {
  const {
    setFulldashbaord,
    setGtprof,
    setTakestate,
    setAddit,
    setTotalCred,
    setStateid,
    setRenewal,
    setTakedata,
    fulldashbaord,
    setStateCount,
    stateCount
  } = useContext(AppContext);
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const DashboardReducer = useSelector(state => state.DashboardReducer);
  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [spalsh, setSplash] = useState("")
  const isFocus = useIsFocused();
  const [nettrue, setNettrue] = useState("");
  // const logger = (() => {
  //   let oldConsole = {};
  //   return {
  //     disableLogger: () => {
  //       if (oldConsole.log) return; // Already disabled
  //       oldConsole.log = console.log;
  //       oldConsole.info = console.info;
  //       oldConsole.warn = console.warn;
  //       oldConsole.error = console.error;
  //       oldConsole.debug = console.debug;
  //       console.log = () => { };
  //       console.info = () => { };
  //       console.warn = () => { };
  //       console.error = () => { };
  //       console.debug = () => { };
  //     },
  //   };
  // })();
  useEffect(() => {
    const handleNavigation = async () => {
      try {
        const [wholeDashData, profdatset] = await Promise.all([
          AsyncStorage.getItem(constants.WHOLEDATA),
          AsyncStorage.getItem(constants.PRODATA)
        ]);
        const parsedDashData = wholeDashData ? JSON.parse(wholeDashData) : null;
        const parsedProfData = profdatset ? JSON.parse(profdatset) : null;
        console.log('Dashboard Data:111', parsedDashData);
        console.log('Profile Data:', parsedProfData);
        const navigateTo = () => {
          if (parsedDashData !== null) {
            setAddit(wholeDashData);
            setFulldashbaord([parsedDashData]);
            setGtprof(true);
            // logger.disableLogger();
            // console.log = function () { };
            return "TabNav";
          } else if (parsedProfData !== null) {
            setFulldashbaord(0);
            // logger.disableLogger();
            // console.log = function () { };
            return "TabNav";
          } else {
            // logger.disableLogger();
            // console.log = function () { };
            return "Onboard";
          }
        };
        setTimeout(() => {
          props.navigation.navigate(navigateTo());
        }, 5000);
      } catch (error) {
        console.error('Error handling navigation:', error);
      }
    };
    handleNavigation();
  }, [isFocus]);

useLayoutEffect(() => {
            props.navigation.setOptions({ gestureEnabled: false });
        }, []);
  return (
    <>
      <MyStatusBar
        barStyle={'light-content'}
        backgroundColor={Colorpath.ButtonColr}
      />
      <ImageBackground
        source={Imagepath.SpalshNew}
        style={{ flex: 1, resizeMode: "contain" }}
      >
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
          <Image source={Imagepath.NewLogo} style={{ justifyContent: "center", alignItems: "center", height: normalize(50), width: normalize(250), resizeMode: "contain" }} />
          {/* <Text style={{fontFamily:Fonts.InterMedium,fontSize:14,color:"#FFFFFF",alignSelf:"center",marginTop:normalize(10),marginLeft:normalize(10)}}>{"The Global Marketplace for CME/CE"}</Text> */}
        </View>
      </ImageBackground>
    </>
  );
}
