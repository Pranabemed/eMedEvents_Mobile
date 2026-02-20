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
import { AppContext } from '../GlobalSupport/AppContext';;
import HandleTextInput from './HandleTextInput';
import PrimeCard from '../../Components/PrimeCard';
import { PrimeCheckRequest } from '../../Redux/Reducers/WebcastReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import Snackbar from 'react-native-snackbar';
import NewProfession from '../../Components/NewProfession';
import NonPhysicianCat from '../../Components/NonPhysicianCat';
import NetInfo from '@react-native-community/netinfo';
import { Freeze } from "react-freeze";
import { enableFreeze } from "react-native-screens";
import { SafeAreaView } from 'react-native-safe-area-context'
const Main = (props) => {
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
    completedCount
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
  const [dynamicPadding, setDynamicPadding] = useState(0);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNettruedr(state.isConnected);
    });

    return () => unsubscribe();
  }, []);
  const { detectmain } = props?.route?.params || {}
  const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
  const authHigh = AuthReducer?.loginResponse?.user?.profession != null &&
    AuthReducer?.loginResponse?.user?.profession_type != null
    ? `${AuthReducer?.loginResponse?.user?.profession} - ${AuthReducer?.loginResponse?.user?.profession_typ}`
    : null;
  const profFromDashboard =
    DashboardReducer?.mainprofileResponse?.professional_information?.profession != null &&
      DashboardReducer?.mainprofileResponse?.professional_information?.profession_type != null
      ? `${DashboardReducer?.mainprofileResponse?.professional_information?.profession} - ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type}`
      : null;
  const allProfTake = validHandles.has(authHigh) || validHandles.has(profFromDashboard);
  useEffect(() => {
    if (detectmain == "newadd") {
      connectionrequest()
        .then(() => {
          dispatch(PrimeCheckRequest({}))
        })
        .catch((err) => showErrorAlert("Please connect to internet", err))
    } else {
      connectionrequest()
        .then(() => {
          dispatch(PrimeCheckRequest({}))
        })
        .catch((err) => showErrorAlert("Please connect to internet", err))
    }
  }, [detectmain, isFocus])
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
    // Simulate 2-second loading time
    const timeout = setTimeout(() => {
      setShowLoader(true);
      setFreeze(false)
      enableFreeze(false)
    }, 500);

    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    const token_handle_vault = () => {
      setTimeout(async () => {
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
      }, 100);
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
      const endDate = new Date(endDateString);
      const currentDate = new Date();
      const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
      const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
      const timeDiff = normalizedEndDate.getTime() - normalizedCurrentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setDaysleft(daysDiff);
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
          <View style={Platform.OS === 'android' ? { marginTop: normalize(0), paddingHorizontal: normalize(6) } : { paddingHorizontal: normalize(10) }}>
            <Image source={Imagepath.Logo} style={{ height: normalize(40), width: normalize(40) }} resizeMode="contain" />
          </View>
          <HandleTextInput showLine={showLine} nav={props.navigation} takestate={takestate} addit={addit} setFocusedInput={setFocusedInput} focusedInput={focusedInput} />
          <View>
            <ScrollView contentContainerStyle={{ paddingBottom: dynamicPadding }}
              onContentSizeChange={(w, h) => {
                const extraPadding = h * 0.18; // 15% of content height (can adjust)
                setDynamicPadding(extraPadding);
              }} scrollEventThrottle={16}>
              <View>
                <View style={{ bottom: normalize(10) }}>
                  {fulldashbaord == 0 ? <NewProfession finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables} setStateCount={setStateCount} fetcheddt={fulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={fulldashbaord} setFulldashbaord={setFulldashbaord} /> : gtprof ?
                    <StateLicense propsData={props?.route?.params} setRenewal={setRenewal} renewal={renewal} setStateid={setStateid} stateid={stateid} setTotalCred={setTotalCred} totalcard={totalcard} finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables} setStateCount={setStateCount} fetcheddt={fulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={fulldashbaord} setFulldashbaord={setFulldashbaord} /> : <NonPhysicianCat finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables} setStateCount={setStateCount} fetcheddt={fulldashbaord} stateCount={stateCount} setAddit={setAddit} addit={addit} takestate={takestate} setTakestate={setTakestate} cmecourse={cmecourse} fulldashbaord={fulldashbaord} setFulldashbaord={setFulldashbaord} />}
                </View>
              </View>
            </ScrollView>
            {!showloader && (
              <View style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 130,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999
              }}>

                <View style={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  height: normalize(40),
                  width: normalize(40),
                  borderRadius: normalize(40),
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <ActivityIndicator size={"large"} color={"white"} />
                </View>
              </View>
            )}
          </View>

          {enables && allProfTake ? <View style={{
            position: 'absolute',
            height: normalize(100),
            bottom: normalize(-40),
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: normalize(20),
          }}>
            <TouchableOpacity onPress={() => setPrimeadd(true)} style={{ flexDirection: "row", gap: normalize(10), justifyContent: "center", alignItems: "center", height: normalize(54), width: normalize(320), backgroundColor: "#FFEDCA", borderTopLeftRadius: normalize(20), borderTopRightRadius: normalize(20) }}>
              <Image source={Imagepath.CrownDone} style={{ height: normalize(30), width: normalize(30), resizeMode: "contain" }} />
              <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000", fontWeight: "bold", alignItems: "center" }}>{"Get Prime Membership"}</Text>
            </TouchableOpacity>
          </View> : freeTrail && !WebcastReducer?.PrimeCheckResponse?.subscription?.end_date ? <View
            style={{
              position: 'absolute',
              bottom: normalize(-40),
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: normalize(20),
            }}
          >
            <Pressable
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: normalize(320),
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
        <Freeze freeze={showloader} />
      </KeyboardAvoidingView>
    </>

  )
}

export default Main