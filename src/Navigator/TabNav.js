import React, { useState, useEffect, useContext } from 'react';
import { Image, Text, View, TouchableOpacity, Platform, Alert, Pressable, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import normalize from '../Utils/Helpers/Dimen';
import Colorpath from '../Themes/Colorpath';
import Main from '../Screen/Dashboard/Main';
import NavIcon from 'react-native-vector-icons/EvilIcons';
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import StateCourse from '../Screen/StateRequiredCourse/StateCourse';
import DrawerModal from '../Components/DrawerModal';
import DashoardVault from '../Screen/CMECreditValut/DashoardVault';
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
let status1 = "";
const Tab = createBottomTabNavigator();
function TabScreen() {
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
  } = useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const [tabtooltip, setTabtooltip] = useState("closeit");
  const [nettrue, setNettrue] = useState("");
  const navigation = useNavigation();
  const isFoucs = useIsFocused();
  const route = useRoute();
  const { detectmain, initialRoute } = route.params || {};
  const DashboardReducer = useSelector(state => state.DashboardReducer);
  const [lastActiveTab, setLastActiveTab] = useState(null);
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const WebcastReducer = useSelector(state => state.WebcastReducer);
  const [finalverifyvaulttab, setFinalverifyvaulttab] = useState(null);
  const [finalProfessiontab, setFinalProfessiontab] = useState(null);
  const [tabsub, setTabsub] = useState(false);
  const [tabmodal, setTabmodal] = useState(false);
  const [wholeProf, setWholeProf] = useState()
  useEffect(() => {
    const token_error = () => {
      setTimeout(() => {
        AsyncStorage.getItem(constants.TOKEN).then((loginHandleProccess) => {
          if (loginHandleProccess && !DashboardReducer?.dashPerResponse?.data?.licensures) {
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
      }, 500);
    };
    try {
      token_error();
    } catch (error) {
      console.log(error);
    }
  }, [lastActiveTab]);

useEffect(() => {
  const handleDeepLink = (event) => {
    console.log("New URL received while app active:", event.url);
    // Add your navigation logic here
  };

  const subscription = Linking.addEventListener('url', handleDeepLink);

  return () => {
    subscription.remove();
  };
}, []);
  useEffect(() => {
    const token_error = () => {
      setTimeout(() => {
        AsyncStorage.getItem(constants.PRODATA).then((profdatset) => {
          if (profdatset) {
            const parsedData = JSON.parse(profdatset);
            setWholeProf(parsedData);
          }
        });
      }, 500);
    };
    try {
      token_error();
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    if (DashboardReducer.status === 'Dashboard/dashPerSuccess') {
      const uniqueStates = DashboardReducer?.dashPerResponse?.data?.licensures?.filter((state, index, self) => {
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
        stateDashboardData(firstState.state_id);
        stateReport(firstState.state_id);
        const profInfo = DashboardReducer?.mainprofileResponse?.professional_information || AuthReducer?.signupResponse?.user || {};
        const profFromDashboard = profInfo.profession && profInfo.profession_type
          ? `${profInfo.profession} - ${profInfo.profession_type}`
          : null;
        licHandl(profFromDashboard);
      }
    }
  }, [DashboardReducer.status]);
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
    if (!AuthReducer?.licesensResponse?.licensure_states) {
      let obj = profFromDashboard;
      connectionrequest()
        .then(() => {
          dispatch(licesensRequest(obj))
        })
        .catch(err => {
          showErrorAlert('Please connect to Internet', err);
        });
    }
  }
  const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
  const profFromDashboard =
    DashboardReducer?.mainprofileResponse?.professional_information?.profession != null &&
      DashboardReducer?.mainprofileResponse?.professional_information?.profession_type != null
      ? `${DashboardReducer?.mainprofileResponse?.professional_information?.profession} - ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type}` : wholeProf?.profession != null &&
        wholeProf?.profession_type != null
        ? `${wholeProf?.profession} - ${wholeProf?.profession_type}`
        : null;
  const allProfTake = validHandles.has(profFromDashboard);
  useEffect(() => {
    const loadLastActiveTab = async () => {
      try {
        const lastTab = await AsyncStorage.getItem('lastActiveTab');
        if (lastTab) {
          setLastActiveTab(lastTab);
        }
      } catch (error) {
        console.error('Failed to load last active tab', error);
      }
    };
    loadLastActiveTab();
  }, []);
  const handleTabPress = async (tabName) => {
    try {
      await AsyncStorage.setItem('lastActiveTab', tabName);
      setLastActiveTab(tabName);
    } catch (error) {
      console.error('Failed to save last active tab', error);
    }
  };
  useEffect(() => {
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
      setTimeout(async () => {
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
      }, 100);
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
  const toggleDrawerModal = () => {
    connectionrequest()
      .then(() => {
        dispatch(mainprofileRequest({}))
      })
      .catch((err) => {
        showErrorAlert("Please connect to internet", err)
      })
    setVisible(!visible);
  };
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
      initialRouteName={lastActiveTab || initialRoute || "Home"}
      screenOptions={{
        unmountOnBlur: true,
        keyboardHidesTabBar: true,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          borderWidth: 0.8,
          borderColor: "#DADADA",
          backgroundColor: '#FFFFFF',
          height: Platform.OS === 'ios' ? normalize(70) : normalize(70),
        },
      }}
      screenListeners={({ route }) => ({
        tabPress: (e) => {
          if (route.name == "Contact" && tabsub) {
            e.preventDefault(); 
            setTabmodal(true);  
            return;             
          }
          handleTabPress(route.name);
        },
        focus: () => {
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
                if (item?.label == "CVault" && tabsub) {
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
                        top:normalize(7)
                      }}
                    />
                    <Text
                      style={{
                        color: focused ? Colorpath.ButtonColr : "#999999",
                        marginTop: normalize(7),
                        fontSize: 10,
                        fontFamily: Fonts.InterSemiBold,
                        textAlign: "center",
                        width:normalize(30),
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
            <Pressable onPress={toggleDrawerModal} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={Imagepath.Menubar}
                style={{
                  height: normalize(19),
                  width: normalize(19),
                  resizeMode: "contain",
                  tintColor: focused ? Colorpath.ButtonColr : "#999999",
                  top:normalize(7)
                }}
              />
              <Text
                style={{
                  color: focused ? Colorpath.ButtonColr : "#999999",
                  marginTop: normalize(7),
                  fontSize: 10,
                  textAlign: "center"
                }}
              >
                {"Menu"}
              </Text>
            </Pressable>
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
      onBackdropPress={() => setVisible(!visible)}
      onRequestClose={() => setVisible(false)}
      backButton={() => setVisible(!visible)}
      rentalNavigate={() => setVisible(!visible)}
      watchlistNavigate={() => setVisible(!visible)}
      subscribeNavigate={() => setVisible(!visible)}
      rewardNavigate={() => setVisible(!visible)}
      homeNavigate={() => setVisible(!visible)}
      expensesNav={() => setVisible(!visible)}
      interestedNav={() => setVisible(!visible)}
      drawerPress={() => setVisible(!visible)}
    />
  </> : nettrue == false ? <>
    <Tab.Navigator
      initialRouteName={lastActiveTab || initialRoute || "Home"}
      screenOptions={{
        unmountOnBlur: true,
        keyboardHidesTabBar: true,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          borderWidth: 0.8,
          borderColor: "#DADADA",
          backgroundColor: '#FFFFFF',
          height: Platform.OS === 'ios' ? normalize(70) : normalize(60),
        },
      }}
      screenListeners={({ route }) => ({
        tabPress: (e) => {
          handleTabPress(route.name);
        },
        focus: () => {
          handleTabPress(route.name);
        },
      })}
    >
      {[
        { name: "Home", component: MainInt, icon: Imagepath.Home, label: "Home" },
        { name: "Profiles", component: ProfileMain, icon: Imagepath.Profile, label: "Profile" },
        // { name: "Profile", component: CMEExDashboard, icon: Imagepath.CreditValut, label: "Expenses" },
      ].map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.name}
          component={item.component}
          initialParams={{ detectmain: "newadd" }}
          options={{
            tabBarIcon: ({ focused }) => {
              if (item?.label == "CVault" && tabsub) {
                return (
                  <Pressable onPress={() => setTabmodal(true)} style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      source={item.icon}
                      style={{
                        height: normalize(23),
                        width: normalize(23),
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
                      width: normalize(23),
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
            <Pressable onPress={toggleDrawerModal} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={Imagepath.Menubar}
                style={{
                  height: normalize(19),
                  width: normalize(19),
                  resizeMode: "contain",
                  tintColor: focused ? Colorpath.ButtonColr : "#999999"
                }}
              />
              <Text
                style={{
                  color: focused ? Colorpath.ButtonColr : "#999999",
                  marginTop: normalize(3),
                  fontSize: 10,
                  textAlign: "center"
                }}
              >
                {"Menu"}
              </Text>
            </Pressable>
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
      onBackdropPress={() => setVisible(!visible)}
      onRequestClose={() => setVisible(false)}
      backButton={() => setVisible(!visible)}
      rentalNavigate={() => setVisible(!visible)}
      watchlistNavigate={() => setVisible(!visible)}
      subscribeNavigate={() => setVisible(!visible)}
      rewardNavigate={() => setVisible(!visible)}
      homeNavigate={() => setVisible(!visible)}
      expensesNav={() => setVisible(!visible)}
      interestedNav={() => setVisible(!visible)}
      drawerPress={() => setVisible(!visible)}
    />
  </> : <>
    <Tab.Navigator
      initialRouteName={lastActiveTab || initialRoute || "Home"}
      screenOptions={{
        unmountOnBlur: true,
        keyboardHidesTabBar: true,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          borderWidth: 0.8,
          borderColor: "#DADADA",
          backgroundColor: '#FFFFFF',
          height: Platform.OS === 'ios' ? normalize(70) : normalize(60),
        },
      }}
      screenListeners={({ route }) => ({
        tabPress: (e) => {
          handleTabPress(route.name);
        },
        focus: () => {
          handleTabPress(route.name);
        },
      })}
    >
      {[
        { name: "Home", component: Main, icon: Imagepath.Home, label: "Home" },
        { name: "Profiles", component: ProfileMain, icon: Imagepath.Profile, label: "Profile" },
        // { name: "Profile", component: CMEExDashboard, icon: Imagepath.CreditValut, label: "Expenses" },
      ].map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.name}
          component={item.component}
          initialParams={{ detectmain: "newadd" }}
          options={{
            tabBarIcon: ({ focused }) => {
              if (item?.label == "CVault" && tabsub) {
                return (
                  <Pressable onPress={() => setTabmodal(true)} style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      source={item.icon}
                      style={{
                        height: normalize(23),
                        width: normalize(23),
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
                      width: normalize(23),
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
            <Pressable onPress={toggleDrawerModal} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={Imagepath.Menubar}
                style={{
                  height: normalize(19),
                  width: normalize(19),
                  resizeMode: "contain",
                  tintColor: focused ? Colorpath.ButtonColr : "#999999"
                }}
              />
              <Text
                style={{
                  color: focused ? Colorpath.ButtonColr : "#999999",
                  marginTop: normalize(3),
                  fontSize: 10,
                  textAlign: "center"
                }}
              >
                {"Menu"}
              </Text>
            </Pressable>
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
      onBackdropPress={() => setVisible(!visible)}
      onRequestClose={() => setVisible(false)}
      backButton={() => setVisible(!visible)}
      rentalNavigate={() => setVisible(!visible)}
      watchlistNavigate={() => setVisible(!visible)}
      subscribeNavigate={() => setVisible(!visible)}
      rewardNavigate={() => setVisible(!visible)}
      homeNavigate={() => setVisible(!visible)}
      expensesNav={() => setVisible(!visible)}
      interestedNav={() => setVisible(!visible)}
      drawerPress={() => setVisible(!visible)}
    />
  </>

  );
}


export default function TabNavigator() {
  return <TabScreen />;
}
