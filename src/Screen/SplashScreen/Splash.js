import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { chooseStatecardRequest, headerRequest, licesensRequest, tokenRequest, verifyRequest } from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { dashboardRequest, mainprofileRequest, stateDashboardRequest, stateReportingRequest } from '../../Redux/Reducers/DashboardReducer';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import { AppContext } from '../GlobalSupport/AppContext';
import LottieView from 'lottie-react-native';
import TokenManager from '../../Utils/Helpers/TokenManager';

let status1 = "";
const GUEST_REGISTRATION_FLOW_KEY = 'GUEST_REGISTRATION_FLOW';
const INVALID_TOKEN_MESSAGES = [
  'missing or invalid token',
  'invalid token',
  'missing token',
  'token expired',
  'token is expired',
];

const isVerifiedFlag = (value) => value == "1" || value == 1 || value === true;
const getTokenErrorMessage = (value) => (
  value?.data?.msg ||
  value?.data?.message ||
  value?.msg ||
  value?.message ||
  ''
).toLowerCase().trim();
const isInvalidTokenFailure = (value) => {
  const msg = getTokenErrorMessage(value);
  return INVALID_TOKEN_MESSAGES.some(pattern => msg === pattern || msg.startsWith(pattern));
};

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
    setFinddata,
    stateCount
  } = useContext(AppContext);

  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const DashboardReducer = useSelector(state => state.DashboardReducer);
  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [spalsh, setSplash] = useState("");
  const isFocus = useIsFocused();
  const [emaiV, setEmaiV] = useState("");
  const [phoneV, setPhoneV] = useState("");
  const [guestRegistrationFlowActive, setGuestRegistrationFlowActive] = useState(false);

  const hasNavigatedRef = useRef(false);
  const startupRequestedRef = useRef(false);

  const resetToOnboard = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(constants.TOKEN),
        AsyncStorage.removeItem(constants.REFRESH_TOKEN),
        AsyncStorage.removeItem(constants.VERIFYSTATEDATA),
        AsyncStorage.removeItem(constants.EMAVER),
        AsyncStorage.removeItem(constants.MOBVER),
      ]);
    } catch (error) {
      console.log('[Splash] Failed to clear auth state:', error);
    }

    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    props.navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "Onboard" }] })
    );
  };

  useEffect(() => {
    const handleNavigation = async () => {
      try {
        const [emaileer, mobilevr, guestFlowRaw] = await Promise.all([
          AsyncStorage.getItem(constants.EMAVER),
          AsyncStorage.getItem(constants.MOBVER),
          AsyncStorage.getItem(GUEST_REGISTRATION_FLOW_KEY),
        ]);
        const emailEver = emaileer ? JSON.parse(emaileer) : null;
        const mobileEver = mobilevr ? JSON.parse(mobilevr) : null;
        setEmaiV(emailEver);
        setPhoneV(mobileEver);
        setGuestRegistrationFlowActive(Boolean(guestFlowRaw));
      } catch (error) {
        console.error('Error handling navigation:', error);
      }
    };
    handleNavigation();
  }, [isFocus]);

  useEffect(() => {
    dispatch(headerRequest());
  }, [dispatch]);

  useEffect(() => {
    const token_error = () => {
      setTimeout(async () => {
        try {
          const loginHandleProccess = await TokenManager.ensureValidToken('splash-bootstrap');

          if (loginHandleProccess) {
            startupRequestedRef.current = true;
            let objToken = { "token": loginHandleProccess, "key": {} };
            connectionrequest()
              .then(() => {
                dispatch(tokenRequest(objToken));
                dispatch(mainprofileRequest(objToken));
                dispatch(chooseStatecardRequest(objToken));
                dispatch(dashboardRequest(objToken));
                dispatch(verifyRequest(objToken));
                setLoadingDashboard(true);
              })
              .catch((err) => showErrorAlert("Please connect to internet", err));
          } else {
            setTimeout(() => {
              resetToOnboard();
            }, 500);
          }
        } catch (error) {
          console.log(error);
        }
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
        const jsonObject = loginHandle_verify ? JSON.parse(loginHandle_verify) : null;
        setSplash(jsonObject);
      }, 100);
    };

    try {
      token_handle();
    } catch (error) {
      console.log(error);
    }
  }, [isFocus]);

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

  const profFromDashboard = useMemo(() => {
    const profInfo = DashboardReducer?.mainprofileResponse?.professional_information || AuthReducer?.signupResponse?.user || {};
    return profInfo.profession && profInfo.profession_type
      ? `${profInfo.profession} - ${profInfo.profession_type}`
      : null;
  }, [DashboardReducer?.mainprofileResponse, AuthReducer?.signupResponse]);

  useEffect(() => {
    const data = DashboardReducer?.dashboardResponse?.data;
    if (!data) return;

    if (data?.licensures?.length > 0) {
      const wholeLN = data.licensures;
      const finalPush = wholeLN.map((l) => l?.license_number);
      const uniqueStates = data.licensures.filter((state, index, self) => {
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
      }
    } else {
      setDashboard([]);
      setLoadingDashboard(false);
    }
  }, [DashboardReducer?.dashboardResponse?.data]);

  useEffect(() => {
    if (DashboardReducer?.status === 'Dashboard/dashboardFailure') {
      setLoadingDashboard(false);
    }
  }, [DashboardReducer?.status]);

  useEffect(() => {
    if (!startupRequestedRef.current || hasNavigatedRef.current) return;

    const dashboardInvalid = isInvalidTokenFailure(DashboardReducer?.dashboardResponse);
    const verifyInvalid = isInvalidTokenFailure(AuthReducer?.verifyResponse);

    if (dashboardInvalid || verifyInvalid) {
      resetToOnboard();
    }
  }, [
    DashboardReducer?.dashboardResponse,
    AuthReducer?.verifyResponse,
  ]);

  useEffect(() => {
    if (!loadingDashboard && profFromDashboard) {
      console.log('[Splash] Triggering licHandl for:', profFromDashboard);
      licHandl(profFromDashboard);
    }
  }, [profFromDashboard, loadingDashboard]);

  const lastStateIdHandledRef = useRef(null);
  const lastReportIdHandledRef = useRef(null);

  const stateDashboardData = (id) => {
    if (!id || lastStateIdHandledRef.current === id) return;
    lastStateIdHandledRef.current = id;

    connectionrequest()
      .then(() => dispatch(stateDashboardRequest({ "state_id": id })))
      .catch(err => showErrorAlert("Please connect to internet", err));
  };

  const stateReport = (did) => {
    if (!did || lastReportIdHandledRef.current === did) return;
    lastReportIdHandledRef.current = did;

    connectionrequest()
      .then(() => dispatch(stateReportingRequest({ "state_id": did })))
      .catch((err) => showErrorAlert("Please connect to internet", err));
  };

  const lastLicHandledRef = useRef(null);

  const licHandl = (profFromDashboard) => {
    if (!profFromDashboard || lastLicHandledRef.current === profFromDashboard) return;
    lastLicHandledRef.current = profFromDashboard;

    connectionrequest()
      .then(() => dispatch(licesensRequest(profFromDashboard)))
      .catch(err => showErrorAlert('Please connect to Internet', err));
  };

  const renewalLink = useMemo(() => (
    DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link || null
  ), [DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link]);

  useEffect(() => {
    setRenewal(renewalLink);
  }, [renewalLink]);

  const filteredStates = useMemo(() => {
    if (!AuthReducer?.licesensResponse?.licensure_states) return [];
    const existingStateIds = new Set(Array.isArray(fulldashbaord) ? fulldashbaord.map(dash => dash.state_id) : []);
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

  useEffect(() => {
    if (hasNavigatedRef.current) return;

    const loginResponse = AuthReducer?.loginResponse || {};
    const verifyData = AuthReducer?.verifyResponse?.data || AuthReducer?.verifyResponse?.user || AuthReducer?.verifyResponse || {};
    const { is_verified, phone_verified, email, phone } = verifyData;

    const profInfo = DashboardReducer?.mainprofileResponse?.professional_information || AuthReducer?.signupResponse?.user || DashboardReducer?.dashboardResponse?.data?.user_information || {};
    const profFromDashboard = profInfo.profession && profInfo.profession_type
      ? `${profInfo.profession} - ${profInfo.profession_type}`
      : null;
    const stateLicenses = AuthReducer?.chooseStatecardResponse?.state_licensures || [];
    const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
    const allProfTake = validHandles.has(profFromDashboard);

    const isVerified = isVerifiedFlag(is_verified) || isVerifiedFlag(emaiV);
    const isPhoneVerified = isVerifiedFlag(phone_verified) || isVerifiedFlag(phoneV);
    const noPhoneDt = !phone;
    const bothVerified = isVerified && isPhoneVerified;
    const handleVerify = spalsh || bothVerified;

    const isValidDashboard = !loadingDashboard &&
      Array.isArray(dashboard) &&
      dashboard.some(item => String(item || "").trim() !== "");

    if (loadingDashboard) return;

    console.log('[Splash] Nav Progress:', { allProfTake, bothVerified, isValidDashboard, isVerified, isPhoneVerified });

    if (guestRegistrationFlowActive) {
      hasNavigatedRef.current = true;
      props.navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "TabNav", params: { initialRoute: "Home", detectmain: "newadd" } }] })
      );
      return;
    }

    // State licenses path
    if (stateLicenses?.length > 0 && !isValidDashboard && bothVerified) {
      hasNavigatedRef.current = true;
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

    if (allProfTake) {
      if (bothVerified) {
        if (isValidDashboard) {
          setGtprof(true);
          hasNavigatedRef.current = true;
          props.navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] })
          );
        } else {
          hasNavigatedRef.current = true;
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{
                name: handleVerify ? "CreateStateInfor" : fulldashbaord == 0 ? "TabNav" : "Onboard",
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
        hasNavigatedRef.current = true;
        props.navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] })
        );
      } else {
        navigateToVerification();
      }
    } else {
      if (bothVerified) {
        setGtprof(false);
        hasNavigatedRef.current = true;
        props.navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] })
        );
      } else {
        navigateToVerification();
      }
    }

    function navigateToVerification() {
      if (!isVerified) {
        hasNavigatedRef.current = true;
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{
              name: "VerifyOTPEmail",
              params: { newMail: email }
            }]
          })
        );
      } else if (noPhoneDt) {
        hasNavigatedRef.current = true;
        props.navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: "AddMobile" }] })
        );
      } else if (!isPhoneVerified) {
        hasNavigatedRef.current = true;
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{
              name: "SplashMobile",
              params: { newPh: AuthReducer?.verifyResponse?.phone || phone }
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
    DashboardReducer?.dashboardResponse?.data,
    AuthReducer?.signupResponse,
    isFocus,
    loadingDashboard,
    spalsh,
    guestRegistrationFlowActive
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
        backgroundColor={'transparent'}
        translucent={true}
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
    backgroundColor: Colorpath.ButtonColr,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
