import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, ImageBackground, LogBox, StyleSheet, Text, View } from 'react-native';
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
import { retry } from 'redux-saga/effects';
import LottieView from 'lottie-react-native';
let status1 = "";
export default function Splash(props) {
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
    stateCount,
    isConnected
  } = useContext(AppContext);
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const DashboardReducer = useSelector(state => state.DashboardReducer);
  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [spalsh, setSplash] = useState("")
  const isFocus = useIsFocused();
  const [nettrue, setNettrue] = useState("");
  const [emaiV, setEmaiV] = useState("");
  const [phoneV, setPhoneV] = useState("")
  useEffect(() => {
    const handleNavigation = async () => {
      try {
        const [emaileer, mobilevr] = await Promise.all([
          AsyncStorage.getItem(constants.EMAVER),
          AsyncStorage.getItem(constants.MOBVER)
        ]);
        const emailEver = emaileer ? JSON.parse(emaileer) : null;
        const mobileEver = mobilevr ? JSON.parse(mobilevr) : null;
        console.log('Dashboard Data:111', emailEver);
        console.log('Profile Data:', mobileEver);
        setEmaiV(emailEver);
        setPhoneV(mobileEver);
      } catch (error) {
        console.error('Error handling navigation:', error);
      }
    };
    handleNavigation();
  }, [isFocus]);
  useEffect(() => {
    const token_error = () => {
      setTimeout(() => {
        AsyncStorage.getItem(constants.TOKEN).then((loginHandleProccess) => {
          if (loginHandleProccess) {
            console.log(loginHandleProccess, "loginHandleProccess--------")
            let objToken = { "token": loginHandleProccess, "key": {} }
            connectionrequest()
              .then(() => {
                dispatch(tokenRequest(objToken))
                dispatch(mainprofileRequest(objToken));
                dispatch(chooseStatecardRequest(objToken));
                dispatch(dashboardRequest(objToken))
                dispatch(verifyRequest(objToken))
                setLoadingDashboard(true)
              })
              .catch((err) => showErrorAlert("Please connect to internet", err))
          } else {
            setTimeout(() => {
              props.navigation.navigate("Onboard");
            }, 500);
          }
        });
      }, 500);
    };
    try {
      token_error();
    } catch (error) {
      console.log(error);
    }
  }, [isFocus]);
  
  useEffect(() => {
    const token_handle = () => {
      setTimeout(async () => {
        const loginHandle_verify = await AsyncStorage.getItem(constants.VERIFYSTATEDATA);
        console.log(loginHandle_verify, "statelicesene=================");
        const jsonObject = JSON.parse(loginHandle_verify);
        setSplash(jsonObject);
      }, 100);
    };

    try {
      token_handle();
    } catch (error) {
      console.log(error);
    }
  }, [isFocus]);
  console.log(nettrue, "netrur==========",spalsh)
  if (status1 == '' || DashboardReducer.status != status1) {
    switch (DashboardReducer.status) {
      case 'Dashboard/dashboardRequest':
        status1 = DashboardReducer.status;
        break;
      case 'Dashboard/dashboardSuccess':
        status1 = DashboardReducer.status;
        break;
      case 'Dashboard/dashboardFailure':
        status1 = DashboardReducer.status;
        break;
    }
  }
  useEffect(() => {
    if (DashboardReducer?.dashboardResponse?.data?.licensures?.length > 0) {
      const wholeLN = DashboardReducer?.dashboardResponse?.data?.licensures;
      const finalPush = wholeLN?.length > 0 ? wholeLN.map((l) => l?.license_number) : [];
      const uniqueStates = DashboardReducer?.dashboardResponse?.data?.licensures?.filter((state, index, self) => {
        return index === self.findIndex((s) =>
          s.state_id === state.state_id &&
          s.board_id === state.board_id
        );
      });
      setFulldashbaord(uniqueStates);
      setDashboard(finalPush);
      setLoadingDashboard(false);
      if (uniqueStates?.length > 0) {
        const firstState = uniqueStates[0];
        setAddit(firstState);
        setTakedata(firstState);
        setTakestate(firstState.board_id);
        setStateid(firstState.state_id);
        const credits = firstState.credits_data || {};
        const total = (credits.topic_earned_credits || 0) +
          (credits.total_general_earned_credits || 0);
        setTotalCred(total);
        stateDashboardData(firstState.state_id);
        stateReport(firstState.state_id);
        const profInfo = DashboardReducer?.mainprofileResponse?.professional_information || AuthReducer?.signupResponse?.user || {};
        const profFromDashboard = profInfo.profession && profInfo.profession_type
          ? `${profInfo.profession} - ${profInfo.profession_type}`
          : null;
        licHandl(profFromDashboard);
      }
    }
  }, [DashboardReducer?.dashboardResponse?.data, DashboardReducer?.mainprofileResponse, AuthReducer?.signupResponse]);
  const stateDashboardData = (id) => {
    let obj = {
      "state_id": id
    }
    connectionrequest()
      .then(() => {
        dispatch(stateDashboardRequest(obj));
      })
      .catch(err => { showErrorAlert("Please connect to internet", err) })
  }
  const stateReport = (did) => {
    let obj = {
      "state_id": did
    }
    connectionrequest()
      .then(() => {
        dispatch(stateReportingRequest(obj))
      })
      .catch((err) => {
        showErrorAlert("Please connect to internet", err)
      })
  }
  const licHandl = (profFromDashboard) => {
    let obj = profFromDashboard;
    console.log(obj, "obj--------")
    connectionrequest()
      .then(() => {
        dispatch(licesensRequest(obj))
      })
      .catch(err => {
        showErrorAlert('Please connect to Internet', err);
      });
  }
  const renewalLink = useMemo(() => (
    DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link || null
  ), [DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link]);
  useEffect(() => {
    setRenewal(renewalLink);
  }, [renewalLink]);
  const filteredStates = useMemo(() => {
    if (!AuthReducer?.licesensResponse?.licensure_states) return [];
    const existingStateIds = new Set(fulldashbaord?.map(dash => dash.state_id));
    const stateMap = new Map();
    AuthReducer.licesensResponse.licensure_states.forEach(state => {
      if (!stateMap.has(state.id)) {
        stateMap.set(state.id, state);
      }
    });
    return Array.from(stateMap.values())
      .filter(state => !existingStateIds.has(state.id));
  }, [AuthReducer?.licesensResponse, fulldashbaord]);
  useEffect(() => {
    setStateCount(filteredStates);
  }, [filteredStates]);
  console.log(stateCount, "ghfgnjgt===========", DashboardReducer)
  useEffect(() => {
    const loginResponse = AuthReducer?.loginResponse || {};
    const { is_verified, phone_verified, email, phone } = AuthReducer.verifyResponse || {};
    const profInfo = DashboardReducer?.mainprofileResponse?.professional_information || AuthReducer?.signupResponse?.user || DashboardReducer?.dashboardResponse?.data?.user_information || {};
    const profFromDashboard = profInfo.profession && profInfo.profession_type
      ? `${profInfo.profession} - ${profInfo.profession_type}`
      : null;
    const stateLicenses = AuthReducer?.chooseStatecardResponse?.state_licensures || [];
    const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
    const allProfTake = validHandles.has(profFromDashboard);
    const isVerified = is_verified == "1" || emaiV == "1";
    const isPhoneVerified = phone_verified == "1" || phoneV == "1";
    const noPhoneDt = !phone ;
    const bothVerified = isVerified && isPhoneVerified;
    const handleVerify = spalsh || bothVerified ;
    const isValidDashboard = !loadingDashboard &&
      Array.isArray(dashboard) &&
      dashboard.some(item => String(item || "").trim() !== "");

    if (loadingDashboard) return;

    // First check state licenses regardless of profession type
    if (stateLicenses?.length > 0 && !isValidDashboard && bothVerified ) {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{
            name: "ChooseState",
            params: {
              dataVr: stateLicenses,
              Loc: loginResponse?.user?.user_location
            }
          }]
        })
      );
      return;
    }
    console.log(allProfTake, bothVerified, isValidDashboard, "fgdfgbfjdg--------", DashboardReducer, isVerified, isPhoneVerified)
    if (allProfTake) {
      if (bothVerified) {
        if (isValidDashboard) {
          setGtprof(true);
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "TabNav" }]
            })
          );
        } else {
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{
                name: handleVerify ? "CreateStateInfor": fulldashbaord == 0 ? "TabNav" : "Onboard",
                params: handleVerify ? {
                  dataVerify: {
                    dataVerify: "Nodasta",
                    allDat: loginResponse?.user
                  }
                } : undefined
              }]
            })
          );
        }
      } else if (bothVerified) {
        setGtprof(false);
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "TabNav" }]
          })
        );
      } else {
        navigateToVerification();
      }
    } else {
      if (bothVerified) {
        setGtprof(false);
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "TabNav" }]
          })
        );
      } else {
        navigateToVerification();
      }
    }

    function navigateToVerification() {
      if (!isVerified) {
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{
              name: "VerifyOTPEmail",
              params: { newMail: email }
            }]
          })
        );
      }else if(noPhoneDt){
         props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{
              name: "AddMobile"
            }]
          })
        );
      } else if (!isPhoneVerified) {
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{
              name: "SplashMobile",
              params: { newPh:AuthReducer?.verifyResponse?.phone || phone }
            }]
          })
        );
      }
    }
  }, [
    emaiV,
    phoneV,
    dashboard,
    AuthReducer?.verifyResponse,
    AuthReducer?.chooseStatecardResponse?.state_licensures,
    DashboardReducer?.mainprofileResponse,
    AuthReducer?.signupResponse,
    isFocus,
    loadingDashboard,
    spalsh
  ]);
const splashJson = require('../../Lottie/Splash-Screen-Intro.json');
  const animation = useRef(null);
  useLayoutEffect(() => {
              props.navigation.setOptions({ gestureEnabled: false });
          }, []);
  return (
    <>
      <MyStatusBar
        barStyle={'light-content'}
        backgroundColor={Colorpath.ButtonColr}
      />
      <View style={styles.container}>
        <LottieView
          ref={animation}
          source={splashJson}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: "100%",
    // height: '80%', // optional
    aspectRatio: 0.2,
  },
});