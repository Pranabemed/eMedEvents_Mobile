import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
import { Image, Text, View, TouchableOpacity, Platform, Alert, Pressable, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import normalize from '../Utils/Helpers/Dimen';
import Colorpath from '../Themes/Colorpath';
import Main from '../Screen/Dashboard/Main';
import NavIcon from 'react-native-vector-icons/EvilIcons';
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import StateCourse from '../Screen/StateRequiredCourse/StateCourse';
import DrawerModal from '../Components/DrawerModal';
import DashoardVault from '../Screen/CMECreditValut/DashoardVault';
import CertficateHandle from '../Screen/CMECreditValut/FileCheck';
import Statewebcast from '../Screen/DetailsPageWebcast/Statewebcast';
import Tooltip from 'react-native-walkthrough-tooltip';
import ProfileMain from '../Screen/Profile/ProfileMain';
import Registration from '../Screen/Transcation/Registration';
import DashboardTrans from '../Screen/Transcation/DashboardTrans';
import CMEExDashboard from '../Screen/CMEExpense.js/CMEExDashboard';
import Menu from '../Screen/Auth/Menu';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../Utils/Helpers/NetInfo';
import { dashPerRequest, mainprofileRequest, stateDashboardRequest, stateReportingRequest } from '../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../Utils/Helpers/Toast';
import VoiceSearchBar from '../Screen/GlobalSupport/Voice';
import NativeVoice from '../Screen/GlobalSupport/NativeVoice';
import { PrimeCheckRequest } from '../Redux/Reducers/WebcastReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../Utils/Helpers/constants';
import PrimeCard from '../Components/PrimeCard';
import NetInfo from '@react-native-community/netinfo';
import MainInt from '../Screen/Dashboard/NoIntData';
import { chooseStatecardRequest, licesensRequest, tokenRequest, verifyRequest } from '../Redux/Reducers/AuthReducer';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
import StackNav from './StackNav';
import { isNonUsaAccount, readNonUsaFlowState, readNonUsaPermanentFlags } from '../Utils/Helpers/nonUsaFlow';
let status1 = "";

const buildProfessionLabel = (profession, professionType) => {
  const cleanProfession = String(profession || '').trim();
  const cleanProfessionType = String(professionType || '').trim();

  if (!cleanProfession) return '';
  if (!cleanProfessionType) return cleanProfession;
  if (cleanProfession.toLowerCase().replace(/\s+/g, '').endsWith(`-${cleanProfessionType.toLowerCase().replace(/\s+/g, '')}`)) {
    return cleanProfession;
  }

  return `${cleanProfession} - ${cleanProfessionType}`;
};

const Tab = createBottomTabNavigator();
function TabScreen() {
  const insets = useSafeAreaInsets();
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
    isConnected,
    setIsConnected,
    primeCardSessionSkipped,
  } = useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const [tabtooltip, setTabtooltip] = useState("closeit");
  const [nettrue, setNettrue] = useState("");
  const [nonUsaFlowState, setNonUsaFlowState] = useState(null);
  const [nonUsaPermanentFlags, setNonUsaPermanentFlags] = useState({
    professionUpdateRequired: false,
    stateLicenseFlowCompleted: false,
  });
  useEffect(() => {
    let mounted = true;
    if (isFoucs) {
      Promise.all([
        readNonUsaFlowState(),
        readNonUsaPermanentFlags(),
      ]).then(([state, flags]) => {
        if (!mounted) return;
        setNonUsaFlowState(state);
        setNonUsaPermanentFlags(flags);
      });
    }
    return () => {
      mounted = false;
    };
  }, [isFoucs]);
  const navigation = useNavigation();
  const isFoucs = useIsFocused();
  const route = useRoute();
  const { detectmain, initialRoute, refreshLicensesAt } = route.params || {};
  const DashboardReducer = useSelector(state => state.DashboardReducer);
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  const [lastActiveTab, setLastActiveTab] = useState(null);
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const WebcastReducer = useSelector(state => state.WebcastReducer);
  const [finalverifyvaulttab, setFinalverifyvaulttab] = useState(null);
  const [finalProfessiontab, setFinalProfessiontab] = useState(null);
  const [tabsub, setTabsub] = useState(false);
  const [tabmodal, setTabmodal] = useState(false);
  const [wholeProf, setWholeProf] = useState()
  const [primeSkipped, setPrimeSkipped] = useState(false);
  useEffect(() => {
    const checkPrimeSkipped = async () => {
      try {
        const skipped = await AsyncStorage.getItem("PrimeMembershipSkipped");
        setPrimeSkipped(skipped === 'true');
      } catch (e) {
        console.log(e);
      }
    };
    if (isFoucs) {
      checkPrimeSkipped();
    }
  }, [isFoucs]);
  const hydratedStateIdRef = useRef(null);
  const processedRefreshAtRef = useRef(null);
  const lastLicensureProfessionRef = useRef('');
  const isOpeningDrawerRef = useRef(false);
  const bottomInset = Platform.OS === 'android' ? Math.max(insets.bottom, normalize(10)) : 0;
  const sharedTabBarStyle = {
    borderWidth: 0.8,
    borderColor: "#DADADA",
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'android' ? {
      height: normalize(60) + bottomInset,
      paddingBottom: bottomInset,
      paddingTop: normalize(6),
    } : {}),
  };
  useEffect(() => {
    const token_error = () => {
      AsyncStorage.getItem(constants.TOKEN).then((loginHandleProccess) => {
        if (loginHandleProccess) {
          hydratedStateIdRef.current = null; // ensure state dashboard fetch re-hydrates for new account
          let objToken = { "token": loginHandleProccess, "key": {} }
          connectionrequest()
            .then(() => {
              dispatch(tokenRequest(objToken))
              dispatch(mainprofileRequest(objToken))
              dispatch(dashPerRequest(objToken))
              dispatch(chooseStatecardRequest(objToken));
              dispatch(verifyRequest(objToken))
            })
            .catch((err) => showErrorAlert("Please connect to internet", err))
        }
      });
    };
    try {
      token_error();
    } catch (error) {
      console.log(error);
    }
  }, [lastActiveTab]);
  useEffect(() => {
    if (!refreshLicensesAt) return;
    if (processedRefreshAtRef.current === refreshLicensesAt) return;
    processedRefreshAtRef.current = refreshLicensesAt;
    lastLicensureProfessionRef.current = '';
    connectionrequest()
      .then(() => {
        dispatch(dashPerRequest({}));
        dispatch(mainprofileRequest({}));
        dispatch(chooseStatecardRequest({}));
      })
      .catch((err) => showErrorAlert("Please connect to internet", err));
  }, [refreshLicensesAt, dispatch]);

  useEffect(() => {
    const token_error = () => {
      AsyncStorage.getItem(constants.PRODATA).then((profdatset) => {
        if (profdatset) {
          const parsedData = JSON.parse(profdatset);
          setWholeProf(parsedData);
        }
      });
    };
    try {
      token_error();
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    const licensures = DashboardReducer?.dashPerResponse?.data?.licensures;
    if (!licensures?.length) return;
    const uniqueStates = licensures.filter((state, index, self) => {
      return index === self.findIndex((s) =>
        s.state_id === state.state_id &&
        s.board_id === state.board_id
      );
    });
    setFulldashbaord(uniqueStates);
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
      if (hydratedStateIdRef.current !== firstState.state_id) {
        hydratedStateIdRef.current = firstState.state_id;
        stateDashboardData(firstState.state_id);
        stateReport(firstState.state_id);
      }
      const latestProfessionLabel = buildProfessionLabel(
        DashboardReducer?.mainprofileResponse?.professional_information?.profession,
        DashboardReducer?.mainprofileResponse?.professional_information?.profession_type
      );
      licHandl(latestProfessionLabel);
    }
  }, [DashboardReducer?.status, DashboardReducer?.dashPerResponse?.data?.licensures, DashboardReducer?.mainprofileResponse?.professional_information, AuthReducer?.signupResponse?.user, ProfileReducer?.latestProfessionInfo, wholeProf]);
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
  const licHandl = (professionLabel) => {
    if (!professionLabel) return;
    if (professionLabel.toLowerCase().includes('undefined')) return;
    if (lastLicensureProfessionRef.current === professionLabel) return;
    lastLicensureProfessionRef.current = professionLabel;
    connectionrequest()
      .then(() => {
        dispatch(licesensRequest(professionLabel))
      })
      .catch(err => {
        showErrorAlert('Please connect to Internet', err);
      });
  }
  const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
  const dashboardProfessionInfo = DashboardReducer?.mainprofileResponse?.professional_information;
  const dashboardProfession = String(dashboardProfessionInfo?.profession || '').trim();
  const dashboardProfessionType = String(dashboardProfessionInfo?.profession_type || '').trim();
  const profFromDashboard =
    dashboardProfession && dashboardProfessionType
      ? `${dashboardProfession} - ${dashboardProfessionType}`
      : '';
  const allProfTake = validHandles.has(profFromDashboard);
  useEffect(() => {
    const loadLastActiveTab = async () => {
      try {
        const lastTab = await AsyncStorage.getItem('lastActiveTab');
        if (lastTab) {
          setLastActiveTab(lastTab == "Volts" ? "Home" : lastTab);
        }
      } catch (error) {
        console.error('Failed to load last active tab', error);
      }
    };
    loadLastActiveTab();
  }, []);
  const handleTabPress = async (tabName) => {
    if (tabName == "Volts") return;
    try {
      await AsyncStorage.setItem('lastActiveTab', tabName);
      setLastActiveTab(tabName);
    } catch (error) {
      console.error('Failed to save last active tab', error);
    }
  };
  useLayoutEffect(() => {
    if (initialRoute) {
      setTabtooltip("did");
      navigation.navigate(initialRoute);
    }
  }, [initialRoute, navigation]);
  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(PrimeCheckRequest({}))
      })
      .catch((err) => showErrorAlert("Please connect to internet", err))
  }, [isFoucs])
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNettrue(state.isConnected);
    });

    return () => unsubscribe();
  }, [isFoucs]);
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
          setFinalverifyvaulttab(board_special_json);
          setFinalProfessiontab(profession_data_json);
        } catch (error) {
          console.log('Error fetching data:', error);
        }
      })();
    };

    token_handle_vault();
  }, [isFoucs]);
  useEffect(() => {
    const endDateString =
      WebcastReducer?.PrimeCheckResponse?.subscription?.end_date || AuthReducer?.againloginsiginResponse?.user?.subscriptions?.[0]?.end_date ||
      AuthReducer?.loginResponse?.user?.subscriptions?.[0]?.end_date || finalProfessiontab?.subscriptions?.[0]?.end_date;
    if (!endDateString) return;
    try {
      const endDate = new Date(endDateString);
      const currentDate = new Date();
      const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
      const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
      if (normalizedCurrentDate >= normalizedEndDate) {
        setTabsub(true);
      } else {
        setTabsub(false);
      }
    } catch (error) {
      console.error('Error parsing date:', error);
      // Handle error case appropriately (maybe setEnables(false))
    }
  }, [WebcastReducer?.PrimeCheckResponse, AuthReducer, finalverifyvaulttab, finalProfessiontab]);
  const userObj = AuthReducer?.signupResponse?.user || AuthReducer?.loginResponse?.user || AuthReducer?.againloginsiginResponse?.user || AuthReducer?.verifymobileResponse?.user || finalverifyvaulttab || finalProfessiontab;
  const isUsaProfile =
    userObj?.usa_user === true ||
    userObj?.usa_user === 1 ||
    userObj?.usa_user === '1' ||
    userObj?.is_non_usa === false ||
    userObj?.is_non_usa === 0 ||
    userObj?.is_non_usa === '0';
  const isNonUsaUser = !isUsaProfile && (nonUsaFlowState?.isNonUsa === true || isNonUsaAccount(userObj || {}, nonUsaFlowState));
  const creditVaultComponent = nonUsaPermanentFlags?.stateLicenseFlowCompleted === true
    ? DashoardVault
    : (isNonUsaUser ? CertficateHandle : DashoardVault);
  const toggleDrawerModal = () => {
    if (visible || isOpeningDrawerRef.current) return;
    isOpeningDrawerRef.current = true;
    setVisible(true);
  };
  const closeDrawerModal = () => {
    setVisible(false);
  };
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        isOpeningDrawerRef.current = false;
      }, 400);
      return () => clearTimeout(timer);
    }
    isOpeningDrawerRef.current = false;
  }, [visible]);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        <StackNav />
      }
    });

    return () => unsubscribe();
  }, [isConnected]);
  return ((allProfTake && fulldashbaord?.length !== 0) ? <>
    <Tab.Navigator
      initialRouteName={initialRoute || lastActiveTab || "Home"}
      screenOptions={{
        unmountOnBlur: false,
        freezeOnBlur: true,
        keyboardHidesTabBar: true,
        tabBarShowLabel: false,
        headerShown: false,
        sceneStyle: {
          backgroundColor: Colorpath.Pagebg,
        },
        tabBarStyle: sharedTabBarStyle,
      }}
      screenListeners={({ route }) => ({
        tabPress: (e) => {
          if (route.name == "Volts") {
            e.preventDefault();
            toggleDrawerModal();
            return;
          }
          if (route.name == "Contact" && tabsub) {
            e.preventDefault();
            setTabmodal(true);
            return;
          }
          handleTabPress(route.name);
        },
        focus: (e) => {
          if (route.name == "Contact" && tabsub) {
            e.preventDefault();
            setTabmodal(true);
            return;
          }
          handleTabPress(route.name);
        },
      })}
    >
      {[
        { name: "Home", component: nettrue == false ? MainInt : Main, icon: Imagepath.Home, label: "Home" },
        { name: "Profiles", component: ProfileMain, icon: Imagepath.Profile, label: "Profile" },
        { name: "Contact", component: DashoardVault, icon: Imagepath.DocVault, label: "CVault " },
      ]
        .map((item, index) => (
          <Tab.Screen
            key={index}
            name={item.name}
            component={item.component}
            initialParams={{ detectmain: "newadd" }}
            options={{
              tabBarIcon: ({ focused }) => {
                if (item?.label?.trim() == "CVault" && tabsub) {
                  return (
                    <Pressable onPress={() => setTabmodal(true)} style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Image
                        source={item.icon}
                        style={{
                          height: normalize(23),
                          width: normalize(25),
                          tintColor: focused ? Colorpath.ButtonColr : "#999999",
                          resizeMode: "contain"
                        }}
                      />
                      <Text
                        style={{
                          color: focused ? Colorpath.ButtonColr : "#999999",
                          marginTop: normalize(3),
                          fontSize: 10,
                          fontFamily: Fonts.InterSemiBold,
                          textAlign: "center"
                        }}
                      >
                        {item?.label}
                      </Text>
                    </Pressable>
                  );
                }
                return (
                  <>
                    <Image
                      source={item.icon}
                      style={{
                        height: normalize(23),
                        width: normalize(25),
                        tintColor: focused ? Colorpath.ButtonColr : "#999999",
                        resizeMode: "contain",
                        top: normalize(7)
                      }}
                    />
                    <Text
                      style={{
                        color: focused ? Colorpath.ButtonColr : "#999999",
                        marginTop: normalize(7),
                        fontSize: 10,
                        fontFamily: Fonts.InterSemiBold,
                        textAlign: "center",
                        width: normalize(50),
                      }}
                    >
                      {item?.label}
                    </Text>
                  </>
                );
              },
            }}
          />
        ))}
      <Tab.Screen
        name="Volts"
        component={Menu}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={Imagepath.Menubar}
                style={{
                  height: normalize(22),
                  width: normalize(19),
                  resizeMode: "contain",
                  tintColor: visible ? Colorpath.ButtonColr : "#999999",
                  top: normalize(7)
                }}
              />
              <Text
                style={{
                  color: visible ? Colorpath.ButtonColr : "#999999",
                  marginTop: normalize(7),
                  fontSize: 10,
                  fontFamily: Fonts.InterSemiBold,
                  textAlign: "center",
                  width: normalize(50),
                }}
              >
                {"Menu"}
              </Text>
            </>
          ),
        }}
      />
    </Tab.Navigator>
    {tabmodal && <PrimeCard primeadd={tabmodal} setPrimeadd={setTabmodal} />}
    {/* Drawer Modal */}
    <DrawerModal
      lastActiveTab={lastActiveTab}
      handel={tabtooltip}
      isVisible={visible}
      onBackdropPress={closeDrawerModal}
      onRequestClose={closeDrawerModal}
      backButton={closeDrawerModal}
      rentalNavigate={closeDrawerModal}
      watchlistNavigate={closeDrawerModal}
      subscribeNavigate={closeDrawerModal}
      rewardNavigate={closeDrawerModal}
      homeNavigate={closeDrawerModal}
      expensesNav={closeDrawerModal}
      interestedNav={closeDrawerModal}
      drawerPress={closeDrawerModal}
    />
  </> : nettrue == false ? <>
    <Tab.Navigator
      initialRouteName={initialRoute || lastActiveTab || "Home"}
      screenOptions={{
        unmountOnBlur: false,
        freezeOnBlur: true,
        keyboardHidesTabBar: true,
        tabBarShowLabel: false,
        headerShown: false,
        sceneStyle: {
          backgroundColor: Colorpath.Pagebg,
        },
        tabBarStyle: sharedTabBarStyle,
      }}
      screenListeners={({ route }) => ({
        tabPress: (e) => {
          if (route.name == "Volts") {
            e.preventDefault();
            toggleDrawerModal();
            return;
          }
          if (route.name == "Contact" && tabsub) {
            e.preventDefault();
            setTabmodal(true);
            return;
          }
          handleTabPress(route.name);
        },
        focus: (e) => {
          if (route.name == "Contact" && tabsub) {
            e.preventDefault();
            setTabmodal(true);
            return;
          }
          handleTabPress(route.name);
        },
      })}
    >
      {[
        { name: "Home", component: MainInt, icon: Imagepath.Home, label: "Home" },
        { name: "Profiles", component: ProfileMain, icon: Imagepath.Profile, label: "Profile" },
        { name: "Contact", component: creditVaultComponent, icon: Imagepath.DocVault, label: "CVault " },
      ].map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.name}
          component={item.component}
          initialParams={{ detectmain: "newadd" }}
          options={{
            tabBarIcon: ({ focused }) => {
              if (item?.label?.trim() == "CVault" && tabsub) {
                return (
                  <Pressable onPress={() => setTabmodal(true)} style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      source={item.icon}
                      style={{
                        height: normalize(23),
                        width: normalize(25),
                        tintColor: focused ? Colorpath.ButtonColr : "#999999",
                        resizeMode: "contain",
                        top: normalize(7)
                      }}
                    />
                    <Text
                      style={{
                        color: focused ? Colorpath.ButtonColr : "#999999",
                        marginTop: normalize(7),
                        fontSize: 10,
                        fontFamily: Fonts.InterSemiBold,
                        textAlign: "center",
                        width: normalize(50)
                      }}
                    >
                      {item?.label}
                    </Text>
                  </Pressable>
                );
              }
              return (
                <>
                  <Image
                    source={item.icon}
                    style={{
                      height: normalize(23),
                      width: normalize(25),
                      tintColor: focused ? Colorpath.ButtonColr : "#999999",
                      resizeMode: "contain",
                      top: normalize(7)
                    }}
                  />
                  <Text
                    style={{
                      color: focused ? Colorpath.ButtonColr : "#999999",
                      marginTop: normalize(7),
                      fontSize: 10,
                      fontFamily: Fonts.InterSemiBold,
                      textAlign: "center",
                      width: normalize(50)
                    }}
                  >
                    {item?.label}
                  </Text>
                </>
              );
            },
          }}
        />
      ))}

      {/* Menu Button */}
      <Tab.Screen
        name="Volts"
        component={Menu}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={Imagepath.Menubar}
                style={{
                  height: normalize(22),
                  width: normalize(19),
                  resizeMode: "contain",
                  tintColor: visible ? Colorpath.ButtonColr : "#999999",
                  top: normalize(7)
                }}
              />
              <Text
                style={{
                  color: visible ? Colorpath.ButtonColr : "#999999",
                  marginTop: normalize(7),
                  fontSize: 10,
                  fontFamily: Fonts.InterSemiBold,
                  textAlign: "center",
                  width: normalize(50)
                }}
              >
                {"Menu"}
              </Text>
            </>
          ),
        }}
      />
    </Tab.Navigator>
    {tabmodal && <PrimeCard primeadd={tabmodal} setPrimeadd={setTabmodal} />}
    {/* Drawer Modal */}
    <DrawerModal
      lastActiveTab={lastActiveTab}
      handel={tabtooltip}
      isVisible={visible}
      onBackdropPress={closeDrawerModal}
      onRequestClose={closeDrawerModal}
      backButton={closeDrawerModal}
      rentalNavigate={closeDrawerModal}
      watchlistNavigate={closeDrawerModal}
      subscribeNavigate={closeDrawerModal}
      rewardNavigate={closeDrawerModal}
      homeNavigate={closeDrawerModal}
      expensesNav={closeDrawerModal}
      interestedNav={closeDrawerModal}
      drawerPress={closeDrawerModal}
    />
  </> : <>
    <Tab.Navigator
      initialRouteName={initialRoute || lastActiveTab || "Home"}
      screenOptions={{
        unmountOnBlur: false,
        freezeOnBlur: true,
        keyboardHidesTabBar: true,
        tabBarShowLabel: false,
        headerShown: false,
        sceneStyle: {
          backgroundColor: Colorpath.Pagebg,
        },
        tabBarStyle: sharedTabBarStyle,
      }}
      screenListeners={({ route }) => ({
        tabPress: (e) => {
          if (route.name == "Volts") {
            e.preventDefault();
            toggleDrawerModal();
            return;
          }
          if (route.name == "Contact" && tabsub) {
            e.preventDefault();
            setTabmodal(true);
            return;
          }
          handleTabPress(route.name);
        },
        focus: (e) => {
          if (route.name == "Contact" && tabsub) {
            e.preventDefault();
            setTabmodal(true);
            return;
          }
          handleTabPress(route.name);
        },
      })}
    >
      {[
        { name: "Home", component: Main, icon: Imagepath.Home, label: "Home" },
        { name: "Profiles", component: ProfileMain, icon: Imagepath.Profile, label: "Profile" },
        { name: "Contact", component: creditVaultComponent, icon: Imagepath.DocVault, label: "CVault " },
      ].map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.name}
          component={item.component}
          initialParams={{ detectmain: "newadd" }}
          options={{
            tabBarIcon: ({ focused }) => {
              if (item?.label?.trim() == "CVault" && tabsub) {
                return (
                  <Pressable onPress={() => setTabmodal(true)} style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      source={item.icon}
                      style={{
                        height: normalize(23),
                        width: normalize(25),
                        tintColor: focused ? Colorpath.ButtonColr : "#999999",
                        resizeMode: "contain",
                        top: normalize(7)
                      }}
                    />
                    <Text
                      style={{
                        color: focused ? Colorpath.ButtonColr : "#999999",
                        marginTop: normalize(7),
                        fontSize: 10,
                        fontFamily: Fonts.InterSemiBold,
                        textAlign: "center",
                        width: normalize(50)
                      }}
                    >
                      {item?.label}
                    </Text>
                  </Pressable>
                );
              }
              return (
                <>
                  <Image
                    source={item.icon}
                    style={{
                      height: normalize(23),
                      width: normalize(25),
                      tintColor: focused ? Colorpath.ButtonColr : "#999999",
                      resizeMode: "contain",
                      top: normalize(7)
                    }}
                  />
                  <Text
                    style={{
                      color: focused ? Colorpath.ButtonColr : "#999999",
                      marginTop: normalize(7),
                      fontSize: 10,
                      fontFamily: Fonts.InterSemiBold,
                      textAlign: "center",
                      width: normalize(50)
                    }}
                  >
                    {item?.label}
                  </Text>
                </>
              );
            },
          }}
        />
      ))}

      {/* Menu Button */}
      <Tab.Screen
        name="Volts"
        component={Menu}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={Imagepath.Menubar}
                style={{
                  height: normalize(22),
                  width: normalize(19),
                  resizeMode: "contain",
                  tintColor: visible ? Colorpath.ButtonColr : "#999999",
                  top: normalize(7)
                }}
              />
              <Text
                style={{
                  color: visible ? Colorpath.ButtonColr : "#999999",
                  marginTop: normalize(7),
                  fontSize: 10,
                  fontFamily: Fonts.InterSemiBold,
                  textAlign: "center",
                  width: normalize(50),
                }}
              >
                {"Menu"}
              </Text>
            </>
          ),
        }}
      />
    </Tab.Navigator>
    {tabmodal && <PrimeCard primeadd={tabmodal} setPrimeadd={setTabmodal} />}
    {/* Drawer Modal */}
    <DrawerModal
      lastActiveTab={lastActiveTab}
      handel={tabtooltip}
      isVisible={visible}
      onBackdropPress={closeDrawerModal}
      onRequestClose={closeDrawerModal}
      backButton={closeDrawerModal}
      rentalNavigate={closeDrawerModal}
      watchlistNavigate={closeDrawerModal}
      subscribeNavigate={closeDrawerModal}
      rewardNavigate={closeDrawerModal}
      homeNavigate={closeDrawerModal}
      expensesNav={closeDrawerModal}
      interestedNav={closeDrawerModal}
      drawerPress={closeDrawerModal}
    />
  </>

  );
}


export default function TabNavigator() {
  return <TabScreen />;
}
