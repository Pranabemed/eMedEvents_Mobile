import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Image, BackHandler, ActivityIndicator, Pressable } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import StateLicense from '../../Components/StateLicense';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import Imagepath from '../../Themes/Imagepath';
import { AppContext } from '../GlobalSupport/AppContext';
import HandleTextInput from './HandleTextInput';
import PrimeCard from '../../Components/PrimeCard';
import { PrimeCheckRequest } from '../../Redux/Reducers/WebcastReducer';
import { mainprofileRequest, dashPerRequest, dashboardRequest } from '../../Redux/Reducers/DashboardReducer';
import { licesensRequest } from '../../Redux/Reducers/AuthReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import Snackbar from 'react-native-snackbar';
import NewProfession from '../../Components/NewProfession';
import NonPhysicianCat from '../../Components/NonPhysicianCat';
import NetInfo from '@react-native-community/netinfo';
import { Freeze } from "react-freeze";
import { enableFreeze } from "react-native-screens";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import DashboardMainShimmer from '../../Components/DashboardMainShimmer';

const normalizeProfessionHandle = (professionHandle) =>
  String(professionHandle || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim();

const findMatchedProfessionHandle = (candidates, supportedHandles) => {
  for (const candidate of candidates) {
    const normalizedCandidate = normalizeProfessionHandle(candidate);
    if (!normalizedCandidate) continue;

    for (const handle of supportedHandles) {
      if (normalizedCandidate === handle || normalizedCandidate.includes(handle)) {
        return handle;
      }
    }
  }

  return '';
};

const Main = (props) => {
  const insets = useSafeAreaInsets();
  const {
    takestate,
    addit,
    setTakestate,
    setAddit,
    fulldashbaord,
    setFulldashbaord,
    stateCount,
    setStateCount,
    gtprof,
    totalcard,
    setTotalCred,
    stateid,
    setStateid,
    renewal,
    setRenewal,
    setPushnew,
    pushnew,
    pendingCount,
    completedCount,
    setGtprof
  } = useContext(AppContext);
  const [focusedInput, setFocusedInput] = useState(null);
  const [linearText, setLinearText] = useState(true);
  const [showLine, setShowLine] = useState(false);
  const DashboardReducer = useSelector(state => state.DashboardReducer);
  const WebcastReducer = useSelector(state => state.WebcastReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [cmecourse, setCmecourse] = useState(false);
  const [finalShow, setFinalShow] = useState(null);
  const [visible, setVisible] = useState(false);
  const [fetcheddt, setFetchdt] = useState(null);
  const [linedty, setLinedty] = useState();
  const [enables, setEnables] = useState(false);
  const [primeadd, setPrimeadd] = useState(false);
  const [finalverifyvaultmain, setFinalverifyvaultmain] = useState(null);
  const [finalProfessionmain, setFinalProfessionmain] = useState(null);
  const [freeTrail, setFreeTrail] = useState(false);
  const [daysleft, setDaysleft] = useState(false);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const [nettruedr, setNettruedr] = useState("");
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNettruedr(state.isConnected);
    });

    return () => unsubscribe();
  }, []);
  const { detectmain } = props?.route?.params || {}
  const physicianHandles = new Set(["physician-md", "physician-do", "physician-dpm"]);
  const nursingHandles = new Set(["nursing-rn", "nursing-aprn", "nursing-cna", "nursing-lpn"]);
  const supportedProfessionHandles = [...physicianHandles, ...nursingHandles];
  const authProfession =
    AuthReducer?.loginResponse?.user?.profession && AuthReducer?.loginResponse?.user?.profession_type
      ? `${AuthReducer?.loginResponse?.user?.profession} - ${AuthReducer?.loginResponse?.user?.profession_type}`
      : AuthReducer?.againloginsiginResponse?.user?.profession && AuthReducer?.againloginsiginResponse?.user?.profession_type
        ? `${AuthReducer?.againloginsiginResponse?.user?.profession} - ${AuthReducer?.againloginsiginResponse?.user?.profession_type}`
        : AuthReducer?.signupResponse?.user?.profession && AuthReducer?.signupResponse?.user?.profession_type
          ? `${AuthReducer?.signupResponse?.user?.profession} - ${AuthReducer?.signupResponse?.user?.profession_type}`
          : finalProfessionmain?.profession && finalProfessionmain?.profession_type
            ? `${finalProfessionmain?.profession} - ${finalProfessionmain?.profession_type}`
            : null;
  const profFromDashboard =
    DashboardReducer?.mainprofileResponse?.professional_information?.profession != null &&
      DashboardReducer?.mainprofileResponse?.professional_information?.profession_type != null
      ? `${DashboardReducer?.mainprofileResponse?.professional_information?.profession} - ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type}`
      : null;
  const resolvedProfessionHandle = findMatchedProfessionHandle(
    [
      profFromDashboard,
      DashboardReducer?.mainprofileResponse?.professional_information?.profession,
      `${DashboardReducer?.mainprofileResponse?.professional_information?.profession || ''} ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type || ''}`,
      authProfession,
      AuthReducer?.loginResponse?.user?.profession,
      `${AuthReducer?.loginResponse?.user?.profession || ''} ${AuthReducer?.loginResponse?.user?.profession_type || ''}`,
      AuthReducer?.againloginsiginResponse?.user?.profession,
      `${AuthReducer?.againloginsiginResponse?.user?.profession || ''} ${AuthReducer?.againloginsiginResponse?.user?.profession_type || ''}`,
      AuthReducer?.signupResponse?.user?.profession,
      `${AuthReducer?.signupResponse?.user?.profession || ''} ${AuthReducer?.signupResponse?.user?.profession_type || ''}`,
      finalProfessionmain?.profession,
      `${finalProfessionmain?.profession || ''} ${finalProfessionmain?.profession_type || ''}`,
      DashboardReducer?.dashPerResponse?.data?.user_information?.profession,
      `${DashboardReducer?.dashPerResponse?.data?.user_information?.profession || ''} ${DashboardReducer?.dashPerResponse?.data?.user_information?.profession_type || ''}`,
    ],
    supportedProfessionHandles
  );
  const allProfTake =
    resolvedProfessionHandle
      ? physicianHandles.has(resolvedProfessionHandle)
      : (gtprof || physicianHandles.has(normalizeProfessionHandle(authProfession)) || physicianHandles.has(normalizeProfessionHandle(profFromDashboard)));
  const isPhysicianFlow = allProfTake;
  const isNursingFlow = nursingHandles.has(resolvedProfessionHandle);
  const bottomBannerSpacing = useMemo(() => {
    if (enables && allProfTake) {
      return normalize(96);
    }
    if (freeTrail) {
      return normalize(150);
    }
    return Platform.OS === 'ios' ? normalize(16) : normalize(80);
  }, [allProfTake, enables, freeTrail]);
  const homeBottomSpacing = useMemo(
    () => bottomBannerSpacing + (Platform.OS === 'ios' ? 0 : Math.max(insets.bottom, normalize(8))),
    [bottomBannerSpacing, insets.bottom]
  );
  console.log("isPhysicianFlow", isPhysicianFlow);
  console.log("isNursingFlow", isNursingFlow);
  const lastLicenseProfRef = useRef(null);

  // 🔹 Sync licensure requirements when profession changes
  useEffect(() => {
    if (!isFocus) return;

    const profInfo = DashboardReducer?.mainprofileResponse?.professional_information || AuthReducer?.signupResponse?.user || AuthReducer?.loginResponse?.user || {};
    const profession = String(profInfo.profession || '').trim();
    const profType = String(profInfo.profession_type || '').trim();

    if (!profession) return;
    const professionLabel = profType ? `${profession} - ${profType}` : profession;

    if (lastLicenseProfRef.current !== professionLabel) {
      console.log('[Main.js/LicensureSync] Change detected:', { old: lastLicenseProfRef.current, new: professionLabel });
      lastLicenseProfRef.current = professionLabel;
      connectionrequest()
        .then(() => {
          console.log('[Main.js/LicensureSync] Dispatching licesensRequest for:', professionLabel);
          dispatch(licesensRequest(professionLabel));
        })
        .catch(err => console.log('Licensure refresh failed', err));
    } else {
      console.log('[Main.js/LicensureSync] No change, skipping.');
    }
  }, [isFocus, DashboardReducer?.mainprofileResponse, AuthReducer?.signupResponse, AuthReducer?.loginResponse, AuthReducer?.status]);

  // 🔹 Keep global context (gtprof) in sync with the latest detected profession
  useEffect(() => {
    if (resolvedProfessionHandle) {
      const isPhysicianNow = physicianHandles.has(resolvedProfessionHandle);
      if (isPhysicianNow !== gtprof) {
        setGtprof(isPhysicianNow);
      }
    }
  }, [resolvedProfessionHandle, gtprof]);
  // const isPhysicianFlow = gtprof || allProfTake || validHandles.has(cachedProfessionHandle);
  // const hasDashboardLicenses = Array.isArray(fulldashbaord) && fulldashbaord.length > 0;
  // const shouldRenderStateLicense = isPhysicianFlow || hasDashboardLicenses;
  useEffect(() => {
    if (!isFocus) return;
    connectionrequest()
      .then(() => {
        // 🔹 Only show shimmer if we don't have data yet (prevents flicker on tab switch)
        if (!DashboardReducer?.dashboardResponse?.data) {
          setShowLoader(false);
        }
        dispatch(PrimeCheckRequest({}));
        dispatch(mainprofileRequest({}));
        dispatch(dashPerRequest({}));
        dispatch(dashboardRequest({}));
      })
      .catch((err) => showErrorAlert("Please connect to internet", err));
  }, [detectmain, isFocus]);

  // 🔹 Synchronize the loading state with Redux responses
  useEffect(() => {
    const terminalStatuses = new Set([
      'Dashboard/dashboardSuccess',
      'Dashboard/dashboardFailure',
      'Dashboard/mainprofileSuccess',
      'Dashboard/mainprofileFailure',
      'Dashboard/dashPerSuccess',
      'Dashboard/dashPerFailure'
    ]);

    if (terminalStatuses.has(DashboardReducer?.status)) {
      // 🔹 ONLY SHOW once the profession logic has had a target to lock onto
      // This prevents jumping from NewProfession to StateLicense after mount.
      if (resolvedProfessionHandle || !!profFromDashboard) {
        setTimeout(() => setShowLoader(true), 150);
      } else {
        // Fallback if truly no profession is found after a few tries
        setTimeout(() => setShowLoader(true), 600);
      }
    }
  }, [DashboardReducer?.status, resolvedProfessionHandle, profFromDashboard]);
  const backPressCount = useRef(0);
  const isSnackbarVisible = useRef(false);
  const snackbarTimeout = useRef(null);
  useEffect(() => {
    const resetState = () => {
      backPressCount.current = 0;
      isSnackbarVisible.current = false;
      if (snackbarTimeout.current) {
        clearTimeout(snackbarTimeout.current);
        snackbarTimeout.current = null;
      }
    };

    const onBackPress = () => {
      if (isSnackbarVisible.current) {
        resetState();
        BackHandler.exitApp();
        return true;
      }
      backPressCount.current = 1;
      isSnackbarVisible.current = true;
      Snackbar.show({
        text: 'Press back again to exit',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#2C2C2C',
        textColor: '#FFFFFF',
        action: {
          text: 'EXIT',
          textColor: '#D87AF6',
          onPress: () => {
            resetState();
            BackHandler.exitApp();
          },
        },
      });
      snackbarTimeout.current = setTimeout(() => {
        isSnackbarVisible.current = false;
        backPressCount.current = 0;
      }, 3000);

      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      backHandler.remove();
      resetState();
    };
  }, []);
  const [showloader, setShowLoader] = useState(false);
  const [freeze, setFreeze] = useState(false);
  useEffect(() => {
    setShowLoader(false);
    setFreeze(false);
    enableFreeze(false);
  }, []);
  useEffect(() => {
    const token_handle_vault = () => {
      (async () => {
        try {
          const [board_special, profession_data] = await Promise.all([
            AsyncStorage.getItem(constants.VERIFYSTATEDATA),
            AsyncStorage.getItem(constants.PROFESSION)
          ]);
          const board_special_json = board_special ? JSON.parse(board_special) : null;
          const profession_data_json = profession_data ? JSON.parse(profession_data) : null;
          setFinalverifyvaultmain(board_special_json);
          setFinalProfessionmain(profession_data_json);
        } catch (error) {
          console.log('Error fetching data:', error);
        }
      })();
    };

    token_handle_vault();
  }, [isFocus]);
  const subscription = WebcastReducer?.PrimeCheckResponse?.subscription;
  const isPrimeTrial = useMemo(() => {
    return subscription == false && allProfTake;
  }, [subscription, allProfTake]);

  const takeSub = isPrimeTrial || finalProfessionmain?.subscription_user == "free" || AuthReducer?.loginResponse?.user?.subscription_user == "free" || AuthReducer?.againloginsiginResponse?.user?.subscription_user == "free" || finalverifyvaultmain?.subscription_user == "non-subscribed";
  const hsdSub = finalverifyvaultmain?.subscription_user == "non-subscribed" || isPrimeTrial;
  const endDateStringMain =
    WebcastReducer?.PrimeCheckResponse?.subscription?.end_date ||
    AuthReducer?.loginResponse?.user?.subscriptions?.[0]?.end_date || AuthReducer?.againloginsiginResponse?.user?.subscriptions?.[0]?.end_date ||
    finalProfessionmain?.subscriptions?.[0]?.end_date;
  useEffect(() => {
    if (endDateStringMain && allProfTake) {
      const endDateString =
        WebcastReducer?.PrimeCheckResponse?.subscription?.end_date ||
        AuthReducer?.loginResponse?.user?.subscriptions?.[0]?.end_date || AuthReducer?.againloginsiginResponse?.user?.subscriptions?.[0]?.end_date ||
        finalProfessionmain?.subscriptions?.[0]?.end_date;
      if (!endDateString) return;
      try {
        const endDate = new Date(endDateString);
        const currentDate = new Date();
        const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
        const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
        if (normalizedCurrentDate >= normalizedEndDate) {
          setEnables(true);
          setPushnew(true);
        } else {
          setEnables(false);
          setPushnew(false);
        }
        const timeDifference = normalizedEndDate - normalizedCurrentDate;
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        if (daysDifference <= 30) {
          setFreeTrail(true);
          const endDateString = endDateStringMain;
          const endDate = new Date(endDateString);
          const currentDate = new Date();
          const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
          const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
          const timeDiff = normalizedEndDate.getTime() - normalizedCurrentDate.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          setDaysleft(daysDiff);
        } else {
          setFreeTrail(false);
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    } else if (takeSub) {
      setFreeTrail(true);
      const endDateString = finalProfessionmain?.subscriptions?.[0]?.end_date
      if (endDateString) {
        const endDate = new Date(endDateString);
        const currentDate = new Date();
        const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
        const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
        const timeDiff = normalizedEndDate.getTime() - normalizedCurrentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        setDaysleft(daysDiff);
      } else {
        setDaysleft(null);
      }
    }
  }, [allProfTake, WebcastReducer?.PrimeCheckResponse, AuthReducer, finalProfessionmain, finalverifyvaultmain, takeSub]);
  useLayoutEffect(() => {
    props.navigation.setOptions({ gestureEnabled: false });
  }, []);
  return (
    <>
      <MyStatusBar
        barStyle={'light-content'}
        backgroundColor={Colorpath.Pagebg}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
          <View style={Platform.OS === 'android' ? { marginTop: normalize(0), paddingHorizontal: normalize(6) } : { paddingHorizontal: normalize(10) }}>
            <Image source={Imagepath.Logo} style={{ height: normalize(40), width: normalize(40) }} resizeMode="contain" />
          </View>
          <HandleTextInput showLine={showLine} nav={props.navigation} takestate={takestate} addit={addit} setFocusedInput={setFocusedInput} focusedInput={focusedInput} />
          <View style={{ flex: 1 }}>
            {showloader ? (
              <ScrollView
                style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: homeBottomSpacing,
                }}
                scrollEventThrottle={16}
              >
                <View>
                  <View style={{ bottom: normalize(10) }}>
                    {isPhysicianFlow
                      ? <StateLicense propsData={props?.route?.params} setRenewal={setRenewal} renewal={renewal} setStateid={setStateid} stateid={stateid} setTotalCred={setTotalCred} totalcard={totalcard} finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables} setStateCount={setStateCount} fetcheddt={fulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={fulldashbaord} setFulldashbaord={setFulldashbaord} />
                      : isNursingFlow
                        ? <NonPhysicianCat finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables} setStateCount={setStateCount} fetcheddt={fulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={fulldashbaord} setFulldashbaord={setFulldashbaord} />
                        : <NewProfession finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables} setStateCount={setStateCount} fetcheddt={fulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={fulldashbaord} setFulldashbaord={setFulldashbaord} />}
                  </View>
                </View>
              </ScrollView>
            ) : (
              <View style={{
                flex: 1,
                backgroundColor: Colorpath.Pagebg,
              }}>
                <DashboardMainShimmer />
              </View>
            )}
          </View>

          {enables && allProfTake ? <View style={{
            position: 'absolute',
            height: normalize(100),
            bottom: normalize(0),
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: insets.bottom + normalize(10),
          }}>
            <TouchableOpacity onPress={() => setPrimeadd(true)} style={{ flexDirection: "row", gap: normalize(10), justifyContent: "center", alignItems: "center", height: normalize(54), width: normalize(340), backgroundColor: "#FFEDCA", borderTopLeftRadius: normalize(25), borderTopRightRadius: normalize(25) }}>
              <Image source={Imagepath.CrownDone} style={{ height: normalize(30), width: normalize(30), resizeMode: "contain" }} />
              <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000", fontWeight: "bold", alignItems: "center" }}>{"Get Prime Membership"}</Text>
            </TouchableOpacity>
          </View> : freeTrail ? <View
            style={{
              position: 'absolute',
              bottom: normalize(0),
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: insets.bottom + normalize(10),
            }}
          >
            <Pressable
              onPress={() => setPrimeadd(true)}
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: normalize(340),
                backgroundColor: '#FFEDCA',
                borderTopLeftRadius: normalize(25),
                borderTopRightRadius: normalize(25),
                paddingVertical: normalize(20),
                paddingHorizontal: normalize(10),
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.InterSemiBold,
                  fontSize: 14,
                  color: '#000',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: normalize(15),
                }}
              >
                {freeTrail && hsdSub
                  ? 'Thank you for exploring Prime Membership.\nClick Subscribe now to join.'
                  : freeTrail && daysleft == 30
                    ? 'Thank you for exploring Prime Membership.\nClick Subscribe now to join.'
                    : daysleft
                      ? Math.abs(daysleft) > 29
                        ? 'Thank you for exploring Prime Membership.\nClick Subscribe now to join.'
                        : `Your free trial of premium subscription will end in ${Math.abs(
                          daysleft
                        )} day(s). Subscribe now to continue accessing premium features`
                      : ''}
              </Text>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: normalize(30),
                  width: normalize(150),
                  backgroundColor: Colorpath.ButtonColr,
                  borderRadius: normalize(5),
                  bottom: normalize(5)
                }}
              >
                <Pressable onPress={() => setPrimeadd(true)}>
                  <Text
                    style={{
                      fontFamily: Fonts.InterBold,
                      fontWeight: 'bold',
                      fontSize: 14,
                      color: '#fff',
                      textAlign: 'center',
                    }}
                  >
                    {'Subscribe Now'}
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </View>
            : null}
          {primeadd && <PrimeCard primeadd={primeadd} setPrimeadd={setPrimeadd} />}
        </SafeAreaView>
        <Freeze freeze={freeze} />
      </KeyboardAvoidingView>
    </>

  )
}

export default Main
