import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
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
import { AppContext } from '../GlobalSupport/AppContext';
import LottieView from 'lottie-react-native';
let status1 = "";
const safeJsonParse = (raw, fallback = null) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
};
const isVerifiedFlag = (value) => value == "1" || value == 1 || value === true;
const isUserVerifiedFromCache = ({ verifyCached, emailEver, mobileEver }) => {
  const emailVerified =
    isVerifiedFlag(verifyCached?.is_verified) ||
    isVerifiedFlag(emailEver);
  const phoneVerified =
    isVerifiedFlag(verifyCached?.phone_verified) ||
    isVerifiedFlag(mobileEver);
  return emailVerified && phoneVerified;
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
    setFinddata
  } = useContext(AppContext);
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const DashboardReducer = useSelector(state => state.DashboardReducer);
  const [dashboard, setDashboard] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [spalsh, setSplash] = useState("")
  const isFocus = useIsFocused();
  const [emaiV, setEmaiV] = useState("");
  const [phoneV, setPhoneV] = useState("")
  const hasRedirectedToOnboardRef = useRef(false);
  const hasDashboardCacheRef = useRef(false);
  const hasNavigatedRef = useRef(false);
  useEffect(() => {
    const handleNavigation = async () => {
      try {
        const [emaileer, mobilevr, professionRaw, dashboardCacheRaw, legacyStateRaw, tokenRaw, verifyRaw] = await Promise.all([
          AsyncStorage.getItem(constants.EMAVER),
          AsyncStorage.getItem(constants.MOBVER),
          AsyncStorage.getItem(constants.PROFESSION),
          AsyncStorage.getItem(constants.DASHBOARD_CACHE),
          AsyncStorage.getItem(constants.WHOLEDATA),
          AsyncStorage.getItem(constants.TOKEN),
          AsyncStorage.getItem(constants.VERIFYSTATEDATA)
        ]);
        const emailEver = safeJsonParse(emaileer, null);
        const mobileEver = safeJsonParse(mobilevr, null);
        const professionCached = safeJsonParse(professionRaw, null);
        const dashboardCached = safeJsonParse(dashboardCacheRaw, null);
        const legacyStateCached = safeJsonParse(legacyStateRaw, null);
        const verifyCached = safeJsonParse(verifyRaw, null);
        const professionHandle =
          professionCached?.profession && professionCached?.profession_type
            ? `${professionCached.profession} - ${professionCached.profession_type}`
            : null;
        const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
        setEmaiV(emailEver);
        setPhoneV(mobileEver);
        if (validHandles.has(professionHandle)) {
          setGtprof(true);
        }
        const cachedLicensures =
          Array.isArray(dashboardCached) && dashboardCached.length > 0
            ? dashboardCached
            : legacyStateCached
              ? [legacyStateCached]
              : [];
        const isCachedVerified = isUserVerifiedFromCache({
          verifyCached,
          emailEver,
          mobileEver
        });
        if (cachedLicensures.length > 0) {
          hasDashboardCacheRef.current = true;
          const uniqueStates = cachedLicensures.filter((state, index, self) =>
            index === self.findIndex((s) =>
              s?.state_id === state?.state_id &&
              s?.board_id === state?.board_id
            )
          );
          setFulldashbaord(uniqueStates);
          setDashboard(uniqueStates.map((l) => l?.license_number));
          setLoadingDashboard(false);
          const firstState = uniqueStates[0];
          if (firstState) {
            setAddit(firstState);
            setTakedata(firstState);
            setTakestate(firstState.board_id);
            setStateid(firstState.state_id);
            const credits = firstState.credits_data || {};
            setTotalCred((credits.topic_earned_credits || 0) + (credits.total_general_earned_credits || 0));
          }
        }
        // Fast path: on app reload, if token + verified cache are present, skip waiting for API.
        if (
          tokenRaw &&
          isCachedVerified &&
          !hasNavigatedRef.current
        ) {
          hasNavigatedRef.current = true;
          props.navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] })
          );
        }
      } catch (error) {
        console.error('Error handling navigation:', error);
      }
    };
    handleNavigation();
  }, [isFocus]);
  useEffect(() => {
    const token_error = () => {
      AsyncStorage.getItem(constants.TOKEN).then((loginHandleProccess) => {
        if (loginHandleProccess) {
          let objToken = { "token": loginHandleProccess, "key": {} }
          connectionrequest()
            .then(() => {
              dispatch(tokenRequest(objToken))
              dispatch(mainprofileRequest(objToken));
              dispatch(chooseStatecardRequest(objToken));
              dispatch(dashboardRequest(objToken))
              dispatch(verifyRequest(objToken))
              if (!hasDashboardCacheRef.current && !hasNavigatedRef.current) {
                setLoadingDashboard(true)
              }
            })
            .catch((err) => showErrorAlert("Please connect to internet", err))
        } else {
          // Prevent stale redirects from firing after user already navigated away.
          if (!props.navigation.isFocused() || hasRedirectedToOnboardRef.current) return;
          hasRedirectedToOnboardRef.current = true;
          props.navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: "Onboard" }] })
          );
        }
      });
    };
    try {
      token_error();
    } catch (error) {
      console.log(error);
    }
  }, [isFocus]);

  useEffect(() => {
    const token_handle = async () => {
      const loginHandle_verify = await AsyncStorage.getItem(constants.VERIFYSTATEDATA);
      const jsonObject = safeJsonParse(loginHandle_verify, null);
      setSplash(jsonObject);
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
  useEffect(() => {
    const data = DashboardReducer?.dashboardResponse?.data;
    if (!data) return; // API hasn't responded yet

    const licensures = Array.isArray(data?.licensures) ? data.licensures : [];
    if (licensures.length > 0) {
      const wholeLN = licensures;
      const finalPush = wholeLN.map((l) => l?.license_number);
      const uniqueStates = licensures.filter((state, index, self) => {
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
    } else {
      // No licensures — still mark loading as done so navigation logic can proceed
      setDashboard([]);
      setLoadingDashboard(false);
    }
  }, [DashboardReducer?.dashboardResponse?.data, DashboardReducer?.mainprofileResponse, AuthReducer?.signupResponse]);
  useEffect(() => {
    if (DashboardReducer?.status === 'Dashboard/dashboardFailure') {
      setLoadingDashboard(false);
    }
  }, [DashboardReducer?.status]);
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
    const noPhoneDt = !phone;
    const bothVerified = isVerified && isPhoneVerified;
    const handleVerify = spalsh || bothVerified;
    const hasCachedDashboard = Array.isArray(fulldashbaord) && fulldashbaord.length > 0;
    const isValidDashboard = !loadingDashboard &&
      ((Array.isArray(dashboard) &&
        dashboard.some(item => String(item || "").trim() !== "")) ||
        hasCachedDashboard);

    if (loadingDashboard || hasNavigatedRef.current) return;

    const isEmailVerifiedVR = AuthReducer?.verifyResponse?.is_verified == "1";
    const isPhoneVerifiedVR = AuthReducer?.verifyResponse?.phone_verified == "1";
    const isPhysician = profInfo?.profession == "Physician";
    // Physician with no licensures but fully verified → go to TabNav with fulldashboard=0
    if (isPhysician && isEmailVerifiedVR && isPhoneVerifiedVR && !isValidDashboard) {
      setFulldashbaord(0);
      dispatch(mainprofileRequest({}))
      hasNavigatedRef.current = true;
      props.navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] })
      );
      return;
    }

    // First check state licenses regardless of profession type
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
            CommonActions.reset({
              index: 0,
              routes: [{ name: "TabNav" }]
            })
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
        hasNavigatedRef.current = true;
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
          CommonActions.reset({
            index: 0,
            routes: [{
              name: "AddMobile"
            }]
          })
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
    spalsh
  ]);
  useEffect(() => {
    if (DashboardReducer?.stateDashboardResponse?.data) {
      setFinddata(DashboardReducer?.stateDashboardResponse?.data);
    }
  }, [DashboardReducer?.stateDashboardResponse])
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
