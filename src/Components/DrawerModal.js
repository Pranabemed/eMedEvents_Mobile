/**
 * Drawer modal reusable component module. Provides a React Native UI building block used across screens. Exported members: checkPrimeSkipped, navigateSmooth, getInitials, handleToggle, token_handle_vault, clean, readProfileText, buildProfessionLabel, renderNestedItem, modalRender, handleRot, clearAllAsyncStorage, openEmail, modalDown, styles.
 */

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Linking,
  InteractionManager
} from 'react-native';
import { takeLatest, select, put, call } from 'redux-saga/effects';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import propstype from 'prop-types';
import normalize from '../Utils/Helpers/Dimen';
import Modal from 'react-native-modal';
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import { CommonActions, useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { againloginsiginRequest, againloginsiginSuccess, allreducerRequest, loginRequest, loginsiginRequest, loginsiginSuccess, loginSuccess, logoutRequest, signupRequest, tokenRequest } from '../Redux/Reducers/AuthReducer';
import { useDispatch, useSelector } from 'react-redux';
import ArrowIcn from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../Utils/Helpers/constants';
import connectionrequest from '../Utils/Helpers/NetInfo';
import { mainprofileRequest } from '../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../Utils/Helpers/Toast';
import Colorpath from '../Themes/Colorpath';
import { PrimeCheckRequest, saveRegistRequest } from '../Redux/Reducers/WebcastReducer';
import PrimeCard from './PrimeCard';
import Loader from '../Utils/Helpers/Loader';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import Buttons from './Button';
import StackNav from '../Navigator/StackNav';
import { navigationRef } from '../Navigator/RootNavigation';
import { isNonUsaAccount, readNonUsaFlowState, readNonUsaPermanentFlags, NON_USA_PROFESSION_UPDATE_REQUIRED_KEY, NON_USA_STATE_LICENSE_FLOW_COMPLETED_KEY, clearNonUsaFlowState } from '../Utils/Helpers/nonUsaFlow';
import { isPrimeSubscriptionMissing } from '../Utils/Helpers/primeSubscription';

/**
 * Reusable DrawerModal component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

export default function DrawerModal(props) {
  const insets = useSafeAreaInsets();
  const {
    takedata,
    setIsConnected,
    fulldashbaord,
    setAddit
  } = useContext(AppContext);
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const DashboardReducer = useSelector(state => state.DashboardReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);
  const WebcastReducer = useSelector(state => state.WebcastReducer);
  const dispatch = useDispatch();
  const [allHandled, setAllHandled] = useState(null);
  const [primeit, setPrimeit] = useState(false);
  const [primeits, setPrimeits] = useState(false);
  const [subit, setSubit] = useState(false);
  const [nettruedr, setNettruedr] = useState(true)
  const [primeSkipped, setPrimeSkipped] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [nonUsaFlowState, setNonUsaFlowState] = useState(null);
  const [nonUsaPermanentFlags, setNonUsaPermanentFlags] = useState({
    professionUpdateRequired: false,
    stateLicenseFlowCompleted: false,
  });
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isProfileReady, setIsProfileReady] = useState(false);
  const [storedAuthUser, setStoredAuthUser] = useState(null);
  const syncDrawerProfileState = useCallback(() => {
    let mounted = true;

    setIsProfileReady(false);
    Promise.all([
      readNonUsaFlowState(),
      readNonUsaPermanentFlags(),
      AsyncStorage.getItem(constants.AUTH_USER_DATA),
      AsyncStorage.getItem(constants.VERIFYSTATEDATA),
      AsyncStorage.getItem(constants.PROFESSION),
      AsyncStorage.getItem('activeProfile')
    ]).then(([state, flags, auth_user, board_special, profession_data, activeProfile]) => {
      if (!mounted) return;

      const auth_user_json = auth_user ? JSON.parse(auth_user) : null;

      setNonUsaFlowState(state);
      setNonUsaPermanentFlags(flags);
      setStoredAuthUser(auth_user_json);
      setCurrentProfile(activeProfile);
      setIsProfileReady(true);
    }).catch(err => {
      console.log('Error loading AsyncStorage drawer data', err);
      if (mounted) {
        setIsProfileReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);
  const hasActiveSession =
    AuthReducer?.signupResponse?.user ||
    AuthReducer?.loginResponse?.user ||
    AuthReducer?.againloginsiginResponse?.user ||
    AuthReducer?.verifymobileResponse?.user ||
    storedAuthUser;

  const resolvedUser = hasActiveSession
    ? (DashboardReducer?.mainprofileResponse && Object.keys(DashboardReducer.mainprofileResponse).length > 0
        ? DashboardReducer.mainprofileResponse
        : hasActiveSession)
    : null;

  const resolvedDrawerUser = resolvedUser;

  const loginUser =
    storedAuthUser ||
    AuthReducer?.loginResponse?.user ||
    resolvedUser;

  const activeUser = loginUser?.user
    ? loginUser.user
    : loginUser;

  const isNonSubscribedNoSubscription =
    activeUser?.subscription_user == "non-subscribed" &&
    (!activeUser?.subscription ||
      activeUser?.subscription?.length === 0) &&
    (!activeUser?.subscriptions ||
      activeUser?.subscriptions?.length === 0);
  useEffect(() => {
    const emitter = require('react-native').DeviceEventEmitter;
    emitter.emit('DRAWER_MODAL_VISIBILITY', props.isVisible);
  }, [props.isVisible]);
  useEffect(() => {
        /**
 * Check prime skipped utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const checkPrimeSkipped = async () => {
      try {
        const skipped = await AsyncStorage.getItem("PrimeMembershipSkipped");
        setPrimeSkipped(skipped === 'true');
      } catch (e) {
        console.log(e);
      }
    };
    if (isFocus || props.isVisible) {
      checkPrimeSkipped();
    }
  }, [isFocus, props.isVisible]);
  useEffect(() => {
    if (isFocus) {
      const cleanup = syncDrawerProfileState();
      return () => cleanup?.();
    }
  }, [isFocus, syncDrawerProfileState]);
  useEffect(() => {
    if (props.isVisible) {
      const cleanup = syncDrawerProfileState();
      return () => cleanup?.();
    }
  }, [props.isVisible, syncDrawerProfileState]);
  useEffect(() => {
    const authChanged =
      AuthReducer?.status === 'Auth/logoutSuccess' ||
      AuthReducer?.status === 'Auth/loginSuccess' ||
      AuthReducer?.status === 'Auth/signupSuccess' ||
      AuthReducer?.status === 'Auth/verifymobileSuccess' ||
      AuthReducer?.status === 'Auth/againloginsiginSuccess';

    if (authChanged) {
      const cleanup = syncDrawerProfileState();
      return () => cleanup?.();
    }
  }, [
    AuthReducer?.status,
    AuthReducer?.loginResponse?.user,
    AuthReducer?.againloginsiginResponse?.user,
    AuthReducer?.signupResponse?.user,
    AuthReducer?.verifymobileResponse?.user,
    syncDrawerProfileState,
  ]);
  useEffect(() => {
    const emitter = require('react-native').DeviceEventEmitter;
    const subscription = emitter.addListener('ACTIVE_PROFILE_CHANGED', syncDrawerProfileState);
    return () => subscription.remove();
  }, [syncDrawerProfileState]);
    /**
 * Navigate smooth utility.
 * @param {*} name - Input value.
 * @param {*} params - Input value.
 * @returns {void}
 */
const navigateSmooth = (name, params) => {
    props.drawerPress?.();
    props.onBackdropPress?.();
    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name, params }]
          })
        );
      });
    });
  };
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNettruedr(state.isConnected);
    });

    return () => unsubscribe();
  }, [isFocus]);
  const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
  const profFromDashboard =
    resolvedDrawerUser?.professional_information?.profession != null &&
      resolvedDrawerUser?.professional_information?.profession_type != null
      ? `${resolvedDrawerUser?.professional_information?.profession} - ${resolvedDrawerUser?.professional_information?.profession_type}`
      : null;
  const allProfTake = isProfileReady && currentProfile !== 'SkipProfile' && validHandles.has(profFromDashboard);
  useEffect(() => {
    if (AuthReducer.status === 'Auth/logoutSuccess') {
      setLogoutPending(false);
      setSubit(false);
      props.onBackdropPress?.();
      setTimeout(() => {
        navigationRef.current?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'GuestUser' }],
          })
        );
      }, Platform.OS === 'ios' ? 300 : 0);
      return;
    }

    if (AuthReducer.status === 'Auth/logoutFailure') {
      setLogoutPending(false);
    }
  }, [AuthReducer.status]);
  useEffect(() => {
    if (props?.handel == "closeit") {
      connectionrequest()
        .then(() => {
          dispatch(mainprofileRequest({}))
        })
        .catch((err) => showErrorAlert("Please connect to internet", err))
    }
  }, [props?.handel]);
  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(mainprofileRequest({}))
      })
      .catch((err) => showErrorAlert("Please connect to internet", err))
  }, [isFocus])
  useEffect(() => {
    if (resolvedDrawerUser) {
      setAllHandled(resolvedDrawerUser);
    }
  }, [resolvedDrawerUser]);

  useEffect(() => {
    if (props.isVisible) {
      connectionrequest()
        .then(() => {
          dispatch(mainprofileRequest({}));
          dispatch(PrimeCheckRequest({}));
        })
        .catch((err) => showErrorAlert("Please connect to internet", err));
    }
  }, [props.isVisible]);
    /**
 * Returns initials.
 * @param {*} firstname - Input value.
 * @param {*} lastname - Input value.
 * @returns {*}
 */
const getInitials = (firstname, lastname) => {
    const firstInitial = firstname ? firstname.charAt(0).toUpperCase() : "";
    const lastInitial = lastname ? lastname.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  };
  const userObj = resolvedUser || null;
  const isUsaProfile =
    userObj?.usa_user === true ||
    userObj?.usa_user === 1 ||
    userObj?.usa_user === '1' ||
    userObj?.is_non_usa === false ||
    userObj?.is_non_usa === 0 ||
    userObj?.is_non_usa === '0';

  const isNonUsaUser = isProfileReady && currentProfile !== 'SkipProfile' && !isUsaProfile && (nonUsaFlowState?.isNonUsa === true || isNonUsaAccount(userObj || {}, nonUsaFlowState));

  useEffect(() => {
    if (isUsaProfile && nonUsaFlowState?.isNonUsa) {
      clearNonUsaFlowState().catch(err => console.log('clearNonUsaFlowState error', err));
      setNonUsaFlowState(null);
    }
  }, [isUsaProfile, nonUsaFlowState]);
  const modalKey = currentProfile === 'SkipProfile' && !isNonSubscribedNoSubscription ? [
    { id: 0, name: "Dashboard", img: Imagepath.FourDot },
    { id: 4, name: "Specialty Courses", img: Imagepath.Brain },
    { id: 5, name: "Transactions", img: Imagepath.CreditCard, nestedItems: [{ id: 0, name: "Registrations" }, { id: 1, name: "Subscriptions Transaction" }, { id: 2, name: "Wallet Transactions" }, { id: 3, name: "Subscriptions" }] },
    { id: 6, name: "Interested Conferences", img: Imagepath.IntConf }
  ] : isNonUsaUser ? [
    { id: 0, name: "Dashboard", img: Imagepath.FourDot },
    { id: 1, name: "My CME/CE Courses ", img: Imagepath.CreditCard },
    { id: 4, name: "Specialty Courses", img: Imagepath.Brain },
    { id: 5, name: "Transactions", img: Imagepath.CreditCard, nestedItems: [{ id: 0, name: "Registrations" }, { id: 2, name: "Wallet Transactions" }] },
    { id: 6, name: "Interested Conferences", img: Imagepath.IntConf }
  ] : isNonSubscribedNoSubscription ? [
    { id: 0, name: "Dashboard", img: Imagepath.FourDot },
    { id: 1, name: "My CME/CE Courses ", img: Imagepath.CreditCard },
    { id: 2, name: "State Required Courses", img: Imagepath.GradCap },
    { id: 3, name: "Board Review Courses", img: Imagepath.BookBoard },
    { id: 4, name: "Specialty Courses", img: Imagepath.Brain },
    { id: 5, name: "Transactions", img: Imagepath.CreditCard, nestedItems: [{ id: 0, name: "Registrations" }, { id: 1, name: "Subscriptions Transaction" }, { id: 2, name: "Wallet Transactions" }, { id: 3, name: "Subscriptions" }] },
    { id: 6, name: "Interested Conferences", img: Imagepath.IntConf },
  ] : allProfTake ? [
    { id: 0, name: "Dashboard", img: Imagepath.FourDot },
    { id: 1, name: "My CME/CE Courses ", img: Imagepath.CreditCard },
    { id: 2, name: "State Required Courses", img: Imagepath.GradCap },
    { id: 3, name: "Board Review Courses", img: Imagepath.BookBoard },
    { id: 4, name: "Specialty Courses", img: Imagepath.Brain },
    { id: 5, name: "Transactions", img: Imagepath.CreditCard, nestedItems: [{ id: 0, name: "Registrations" }, { id: 1, name: "Subscriptions Transaction" }, { id: 2, name: "Wallet Transactions" }, { id: 3, name: "Subscriptions" }] },
    { id: 6, name: "Interested Conferences", img: Imagepath.IntConf },
  ] : !resolvedDrawerUser?.licensures?.[0]?.board_id
    ? [
      { id: 0, name: "Dashboard", img: Imagepath.FourDot },
      { id: 4, name: "Specialty Courses", img: Imagepath.Brain },
      { id: 5, name: "Transactions", img: Imagepath.CreditCard, nestedItems: [{ id: 0, name: "Registrations" }, { id: 1, name: "Subscriptions Transaction" }, { id: 2, name: "Wallet Transactions" }, { id: 3, name: "Subscriptions" }] },
      { id: 6, name: "Interested Conferences", img: Imagepath.IntConf }
    ]
    : [
      { id: 0, name: "Dashboard", img: Imagepath.FourDot },
      { id: 2, name: "State Required Courses", img: Imagepath.GradCap },
      { id: 4, name: "Specialty Courses", img: Imagepath.Brain },
      { id: 5, name: "Transactions", img: Imagepath.CreditCard, nestedItems: [{ id: 0, name: "Registrations" }, { id: 2, name: "Wallet Transactions" }] },
      { id: 6, name: "Interested Conferences", img: Imagepath.IntConf }
    ];
  const downKey = [
    { id: 0, name: "For Any Queries" },
    { id: 1, name: "support@emedevents.com" },
    { id: 2, name: "Sign Out" }
  ]
  const [expandedId, setExpandedId] = useState(0);
  const [finalverifyvault, setFinalverifyvault] = useState(null);
  const [finalProfession, setFinalProfession] = useState(null);
  const [alphaimg, setAlphaimg] = useState("");
    /**
 * Handles toggle.
 * @param {*} id - Input value.
 * @returns {void}
 */
const handleToggle = (id) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };
  useEffect(() => {
        /**
 * Token handle vault utility.
 * @returns {void}
 */
const token_handle_vault = () => {
      setTimeout(async () => {
        try {
          const [board_special, profession_data] = await Promise.all([
            AsyncStorage.getItem(constants.VERIFYSTATEDATA),
            AsyncStorage.getItem(constants.PROFESSION)
          ]);
          const board_special_json = board_special ? JSON.parse(board_special) : null;
          const profession_data_json = profession_data ? JSON.parse(profession_data) : null;
          setFinalverifyvault(board_special_json);
          setFinalProfession(profession_data_json);
        } catch (error) {
          console.log('Error fetching data:', error);
        }
      }, 100);
    };

    if (isFocus || props.isVisible) {
      token_handle_vault();
    }
  }, [isFocus, props.isVisible]);
  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(PrimeCheckRequest({}))
      })
      .catch((err) => showErrorAlert("Please connect to internet", err))
  }, [])
  const resolvedProfessionSource = useMemo(() => {
    return (
      resolvedDrawerUser?.professional_information ||
      AuthReducer?.loginResponse?.user ||
      AuthReducer?.againloginsiginResponse?.user ||
      AuthReducer?.verifymobileResponse?.user ||
      finalverifyvault ||
      finalProfession ||
      null
    );
  }, [
    resolvedDrawerUser?.professional_information,
    AuthReducer?.loginResponse?.user,
    AuthReducer?.againloginsiginResponse?.user,
    AuthReducer?.verifymobileResponse?.user,
    finalverifyvault,
    finalProfession,
  ]);
  const resolvedProfessionText = useMemo(() => {
        /**
 * Clean utility.
 * @param {*} value - Input value.
 * @returns {*}
 */
const clean = (value) => {
      if (value == null) return '';
      return String(value).trim();
    };
    const profession = clean(resolvedProfessionSource?.profession);
    const professionType = clean(resolvedProfessionSource?.profession_type);
    return profession && professionType
      ? `${profession} - ${professionType}`
      : profession || professionType || '';
  }, [resolvedProfessionSource]);
  const isPrimeTrial = useMemo(() => {
    return isPrimeSubscriptionMissing(WebcastReducer?.PrimeCheckResponse);
  }, [WebcastReducer?.PrimeCheckResponse]);
  const takeSub = isPrimeTrial || isNonSubscribedNoSubscription || finalProfession?.subscription_user == "free" || activeUser?.subscription_user == "free" || AuthReducer?.againloginsiginResponse?.user?.subscription_user == "free" || finalverifyvault?.subscription_user == "non-subscribed";
  const endDateStringTake =
    WebcastReducer?.PrimeCheckResponse?.subscription?.end_date || AuthReducer?.againloginsiginResponse?.user?.subscriptions?.[0]?.end_date ||
    AuthReducer?.loginResponse?.user?.subscriptions?.[0]?.end_date || finalProfession?.subscriptions?.[0]?.end_date;
  useEffect(() => {
    if (endDateStringTake) {
      const endDateString =
        WebcastReducer?.PrimeCheckResponse?.subscription?.end_date || AuthReducer?.againloginsiginResponse?.user?.subscriptions?.[0]?.end_date ||
        AuthReducer?.loginResponse?.user?.subscriptions?.[0]?.end_date || finalProfession?.subscriptions?.[0]?.end_date;
      if (!endDateString) return;
      try {
        const endDate = new Date(endDateString);
        const currentDate = new Date();
        const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
        const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
        if (normalizedCurrentDate >= normalizedEndDate) {
          setPrimeit(true);
        } else {
          setPrimeit(false);
        }
        const timeDifference = normalizedEndDate - normalizedCurrentDate;
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        if (daysDifference <= 30) {
          setPrimeits(true);
        } else {
          setPrimeits(false);
        }
      } catch (error) {
        console.error('Error parsing date:', error);
        // Handle error case appropriately (maybe setEnables(false))
      }
    } else if (takeSub) {
      setPrimeits(true);
    }
  }, [WebcastReducer?.PrimeCheckResponse, AuthReducer, finalverifyvault, finalProfession, takeSub, endDateStringTake]);
  const resolvedSpecialityText = useMemo(() => {
    const specialitiesObject =
      resolvedDrawerUser?.specialities ||
      resolvedProfessionSource?.professional_information?.specialities ||
      resolvedProfessionSource?.specialities;
    if (!specialitiesObject) return '';
    const valuesArray = Object.values(specialitiesObject).filter(Boolean);
    return valuesArray.join(', ');
  }, [resolvedDrawerUser?.specialities, resolvedProfessionSource]);
  const [stableProfileMetaText, setStableProfileMetaText] = useState('');
    /**
 * Read profile text utility.
 * @param {*} value - Input value.
 * @returns {*}
 */
const readProfileText = (value) => (value == null ? '' : String(value).trim());
    /**
 * Build profession label utility.
 * @param {*} source - Input value.
 * @returns {*}
 */
const buildProfessionLabel = (source) => {
    if (!source) return '';
    const profession = readProfileText(source?.professional_information?.profession || source?.profession);
    const professionType = readProfileText(source?.professional_information?.profession_type || source?.profession_type);
    if (profession && professionType) {
      return `${profession} - ${professionType}`;
    }
    return profession || professionType || '';
  };
  const currentProfileMetaText = useMemo(() => {
    const professionLabel = buildProfessionLabel(resolvedProfessionSource);
    return [professionLabel || resolvedProfessionText, resolvedSpecialityText].filter(Boolean).join(' | ');
  }, [resolvedProfessionSource, resolvedProfessionText, resolvedSpecialityText]);
  useEffect(() => {
    if (currentProfileMetaText) {
      setStableProfileMetaText(currentProfileMetaText);
    }
  }, [currentProfileMetaText]);
  useEffect(() => {
    if (resolvedDrawerUser || resolvedProfessionSource) {
      const firstName = resolvedDrawerUser?.personal_information?.firstname || resolvedProfessionSource?.firstname;
      const lastName = resolvedDrawerUser?.personal_information?.lastname || resolvedProfessionSource?.lastname;
      const initials = getInitials(firstName, lastName);
      setAlphaimg(initials)
    }
  }, [resolvedDrawerUser, resolvedProfessionSource])
    /**
 * Render nested item utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const renderNestedItem = ({ item, index }) => {
    return (
      <>
        <View style={{ paddingHorizontal: normalize(51), paddingVertical: normalize(5) }}>
          <Pressable onPress={() => {
            if (item?.id == 2) {
              navigateSmooth("Wallets", { name: item?.name });
            } else if (item?.id == 3) {
              navigateSmooth("HCPSub", { name: item?.name });
            } else if (item?.id == 0) {
              navigateSmooth("Registration", { name: item?.name });
            } else {
              navigateSmooth("SubTransaction", { name: item?.name });

            }
          }}>
            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#666", width: normalize(200), fontWeight: "500" }}>{item?.name}</Text>
          </Pressable>
        </View>
        {item?.id == 3 && <View style={{ paddingVertical: normalize(10), paddingHorizontal: normalize(10) }}>
          <View style={{ height: 1, width: Platform.OS === 'ios' ? normalize(230) : normalize(250), backgroundColor: "#DDD" }} />
        </View>}
      </>
    );
  }
    /**
 * Modal render utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const modalRender = ({ item, index }) => {
    return (
      <>
        <Pressable onPress={() => {
          if (item?.id == 0) {
            const getAda = fulldashbaord?.[0];
            setAddit(getAda);
            navigateSmooth("TabNav");
          } else if (item?.id == 1) {
            navigateSmooth("Course", {
              taskData: { statid: takedata?.board_id, creditID: takedata },
            });
          } else if (item?.id == 2) {
            if (primeit || isNonSubscribedNoSubscription) {
              setSubit(true);
              // props.expensesNav();
            } else {
              // props.expensesNav();
              navigateSmooth("StateCourse");
            }
          } else if (item?.id == 3) {
            // props.expensesNav();
            if (primeit || isNonSubscribedNoSubscription) {
              setSubit(true);
            } else {
              navigateSmooth("BoardCourseSlide");
            }
          } else if (item?.id == 4) {
            // props.expensesNav();
            if (primeit || isNonSubscribedNoSubscription) {
              setSubit(true);
            } else {
              navigateSmooth("SpecialityCourseSlide");
            }
          } else if (item?.id == 5 && expandedId == 5) {
            setExpandedId(0);
          } else if (item?.id == 5 && expandedId == 0) {
            item?.nestedItems && handleToggle(item?.id);
          } else if (item?.id == 6) {
            navigateSmooth("InterestedChekout");
          }
        }} style={{ flexDirection: "row", paddingHorizontal: normalize(15), paddingVertical: normalize(5), gap: 8 }}>
          <Image source={item.img} style={{ height: item?.id == 6 ? normalize(18) : normalize(20), width: item?.id == 6 ? normalize(18) : normalize(20), resizeMode: "contain", tintColor: "#000000" }} />
          <View style={{ flexDirection: "row" }}>
            <Text style={Platform.OS === 'ios' ? { fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#333", paddingHorizontal: normalize(8), paddingVertical: normalize(4), fontWeight: "500" } : { fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#333", paddingHorizontal: normalize(8) }}>{item?.name}</Text>
            {item?.nestedItems && (
              <ArrowIcn style={{ marginTop: normalize(-2), paddingHorizontal: normalize(80) }} name={expandedId == 0 ? expandedId == item.id ? "keyboard-arrow-up" : "keyboard-arrow-down" : (expandedId || props?.expandId) == item.id ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={30} color={"#000000"} />
            )}
          </View>
        </Pressable>
        <View style={{ paddingVertical: normalize(10), paddingHorizontal: normalize(10) }}>
          <View style={{ height: 1, width: Platform.OS === 'ios' ? normalize(230) : normalize(250), backgroundColor: "#DDD" }} />
        </View>

        {expandedId == 0 ? expandedId == item?.id && item?.nestedItems && (
          <FlatList
            data={item?.nestedItems}
            renderItem={renderNestedItem}
            keyExtractor={(nestedItem) => nestedItem.id.toString()}
          />) : (expandedId || props?.expandId) == item?.id && item?.nestedItems && (
            <FlatList
              data={item?.nestedItems}
              renderItem={renderNestedItem}
              keyExtractor={(nestedItem) => nestedItem.id.toString()}
            />)}
        {/* <View style={{ paddingVertical: normalize(10), paddingHorizontal: normalize(10) }}>
          <View style={{ height: 1, width: normalize(230), backgroundColor: "#DDD" }} />
        </View> */}
      </>
    )
  }
    /**
 * Handles rot.
 * @returns {*}
 */
const handleRot = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        <StackNav />
      }
    });

    return () => unsubscribe();
  }
    /**
 * Clear all async storage utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const clearAllAsyncStorage = async () => {
    try {
      const keepKeys = [
        'PRIME_CARD_SKIPPED_ONCE',
        'PrimeMembershipSkipped',
        'PrimeMembershipPromptPending',
        constants.NON_USA_FLOW_STATE,
        NON_USA_PROFESSION_UPDATE_REQUIRED_KEY,
        NON_USA_STATE_LICENSE_FLOW_COMPLETED_KEY,
      ];
      const preservedEntries = await AsyncStorage.multiGet(keepKeys);
      await AsyncStorage.removeItem('lastActiveTab')
      await AsyncStorage.removeItem('WHOLEDATA');
      await AsyncStorage.removeItem('PRODATA');
      await AsyncStorage.clear();
      for (const [key, value] of preservedEntries) {
        if (value !== null) {
          await AsyncStorage.setItem(key, value);
        }
      }
      console.log('All AsyncStorage keys cleared successfully!');
    } catch (e) {
      console.error('Error clearing AsyncStorage:', e);
    }
  };
    /**
 * Open email utility.
 * @returns {void}
 */
const openEmail = () => {
    Linking.openURL('mailto:support@emedevents.com');
  };
    /**
 * Modal down utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const modalDown = ({ item, index }) => {
    return (
      <View style={{ paddingHorizontal: normalize(15), paddingVertical: normalize(5) }}>
        <Pressable onPress={() => {
          if (item?.id == 2) {
            Alert.alert("eMedEvents", "Are you sure want to signout ?",
              [{ text: "No", style: "cancel",               /**
 * On press utility.
 * @returns {void}
 */
onPress: () => { console.log("hello") } },
              {
                text: "Yes", style: "default",
                                /**
 * On press utility.
 * @returns {void}
 */
onPress: () => {
                  setLogoutPending(true);
                  clearAllAsyncStorage()
                    .then(() => dispatch(logoutRequest()))
                    .then(() => dispatch(allreducerRequest({ "obj": "" })))
                    .catch(err => console.log("Logout flow error:", err));
                }
              }])
          } else if (item.id == 1) {
            openEmail();
          }
        }}>
          <Text style={{ fontWeight: "500", fontFamily: Fonts.InterSemiBold, fontSize: 16, color: item?.id == 1 ? Colorpath.ButtonColr : item?.id == 2 ? "#FF5E62" : "#333", marginTop: item?.id == 2 ? normalize(10) : 0 }}>{item?.name}</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <>
      <Modal
        backdropOpacity={0.5}
        backdropColor="rgba(0,0,0,0.5)"
        animationIn={'slideInLeft'}
        animationOut={'slideOutLeft'}
        animationInTiming={250}
        animationOutTiming={200}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        backdropTransitionOutTiming={0}
        onBackdropPress={() => {
          if (props?.lastActiveTab) {
            const getAda = fulldashbaord?.[0];
            setAddit(getAda);
            props.onBackdropPress();
            navigation.navigate("TabNav", { initialRoute: props?.lastActiveTab });
          } else if (props?.handel == 'drawerclose') {
            const getAda = fulldashbaord?.[0];
            setAddit(getAda);
            props.onBackdropPress();
            navigation.navigate("TabNav");
          } else if (props?.handel == "closeit") {
            const getAda = fulldashbaord?.[0];
            setAddit(getAda);
            props.onBackdropPress();
            navigation.navigate("TabNav");
          } else {
            props.onBackdropPress();
          }
        }}
        isVisible={props.isVisible}
        style={{ margin: normalize(0) }}
        onRequestClose={() => {
          props.onRequestClose();
        }}>
        <SafeAreaView
          style={{
            backgroundColor: "#FFFFFF",
            flex: 1,
            width: Platform.OS === 'ios' ? '83%' : '87%',
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3
          }}>
          {/* <Loader visible={DashboardReducer?.status == 'Dashboard/mainprofileRequest'} /> */}
          {nettruedr ? <ScrollView contentContainerStyle={{ paddingBottom: normalize(50) }}>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: normalize(32),
                paddingTop: Platform.OS === 'ios' ? normalize(20) : normalize(10),
                gap: 10
              }}>
              <Pressable onPress={() => {
                navigateSmooth("TabNav", { initialRoute: "Profiles" });
              }}>
                {resolvedDrawerUser?.personal_information?.image_name && resolvedDrawerUser?.personal_information?.image_path ? <ImageBackground source={resolvedDrawerUser?.personal_information?.image_name == null || resolvedDrawerUser?.personal_information?.image_name == "" || !resolvedDrawerUser?.personal_information?.image_name ||
                  resolvedDrawerUser?.personal_information?.image_path == null || !resolvedDrawerUser?.personal_information?.image_path || resolvedDrawerUser?.personal_information?.image_path == ""
                  ? Imagepath.HumanIcn
                  : { uri: `${resolvedDrawerUser?.personal_information?.image_path}${resolvedDrawerUser?.personal_information?.image_name}` }
                } resizeMode="cover" style={{ height: normalize(35), width: normalize(35) }} imageStyle={{ borderRadius: normalize(35) }} /> : <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: Colorpath.Pagebg,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <Text style={{
                    color: Colorpath.ButtonColr,
                    fontSize: 18,
                    fontWeight: "bold", fontFamily: Fonts.InterBold
                  }}>{alphaimg}</Text>
                </View>}
              </Pressable>
              <View style={{ flexDirection: "column" }}>
                <View style={{ flexDirection: "column" }}>
                  <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 20, color: "#000000", width: normalize(140), fontWeight: "500" }}>{`${resolvedDrawerUser?.personal_information?.firstname || resolvedProfessionSource?.firstname || AuthReducer?.loginResponse?.user?.firstname || AuthReducer?.againloginsiginResponse?.user?.firstname || 'Guest'} ${resolvedDrawerUser?.personal_information?.lastname || resolvedProfessionSource?.lastname || AuthReducer?.loginResponse?.user?.lastname || AuthReducer?.againloginsiginResponse?.user?.lastname || 'User'}`}</Text>
                  <Text numberOfLines={2} style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#666", width: normalize(160), fontWeight: "500" }}>
                    {stableProfileMetaText || 'Guest Profile'}
                  </Text>
                </View>
                {(isNonSubscribedNoSubscription || !isNonUsaUser && allProfTake) && (
                  <Pressable
                    style={{
                      alignSelf: 'flex-start', // Let content determine width
                      marginTop: normalize(8),
                    }}
                    disabled={isNonSubscribedNoSubscription ? false : (primeit ? !primeit : !primeits)}
                    onPress={() => setSubit(true)}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        paddingVertical: 3,
                        paddingHorizontal: 10,
                        borderRadius: normalize(20),
                        borderWidth: 0.8,
                        borderColor: "#FF773D",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <View
                        style={{
                          height: normalize(20),
                          width: normalize(20),
                          borderRadius: normalize(20),
                          backgroundColor: "#FF773D",
                          justifyContent: "center",
                          alignItems: "center",
                          shadowColor: "#000",
                          shadowOffset: { height: 3, width: 0 },
                          shadowOpacity: 0.3,
                          shadowRadius: 3,
                          elevation: 5,
                          right: normalize(5),
                          marginRight: normalize(-5)
                        }}
                      >
                        <Image
                          source={Imagepath.CrownHome}
                          style={{
                            height: normalize(15),
                            width: normalize(15),
                            resizeMode: "contain"
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          fontFamily: Fonts.InterMedium,
                          fontSize: 14,
                          color: "#FF773D",
                          textAlign: "center",
                          paddingVertical: 3,
                          fontWeight: "500"
                        }}
                      >
                        {isNonSubscribedNoSubscription || primeit || (primeits && !WebcastReducer?.PrimeCheckResponse?.subscription?.end_date)
                          ? "Become a Prime Member"
                          : "Prime Member"}
                      </Text>
                    </View>
                  </Pressable>
                )}
              </View>
            </View>
            <View style={{ paddingVertical: normalize(10), paddingHorizontal: normalize(10) }}>
              <View style={{ height: 1, width: Platform.OS === 'ios' ? normalize(230) : normalize(250), backgroundColor: "#DDD" }} />
            </View>
            <View>
              <FlatList
                data={modalKey}
                renderItem={modalRender}
                keyExtractor={(item, index) => index.toString()} />
            </View>
            <View>
              <FlatList
                data={downKey}
                renderItem={modalDown}
                keyExtractor={(item, index) => index.toString()} />
            </View>
          </ScrollView> : <SafeAreaView style={styles.container}>
            <View style={styles.centerContainer}>
              <View style={{
                height: normalize(100),
                width: normalize(120),
                borderRadius: normalize(20),
                bottom: normalize(20),
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { height: 3, width: 0 },
                elevation: 10,
                backgroundColor: "#FFFFFF"
              }}>
                <Image source={Imagepath.NoWifi} style={{ height: normalize(40), width: normalize(40), resizeMode: "contain" }} />
              </View>
              <Buttons
                onPress={handleRot}
                height={normalize(25)}
                width={normalize(240)}
                // backgroundColor={Colorpath.ButtonColr}
                borderRadius={normalize(5)}
                text="No Internet Connection"
                color={Colorpath.black}
                fontSize={20}
                fontFamily={Fonts.InterSemiBold}
                fontWeight="bold"
              // marginTop={normalize(5)}
              />
              <Buttons
                onPress={handleRot}
                height={normalize(45)}
                width={normalize(290)}
                // backgroundColor={Colorpath.ButtonColr}
                borderRadius={normalize(5)}
                text={`Please check your internet connection ${"\n"}and try again`}
                color={Colorpath.black}
                fontSize={16}
                fontFamily={Fonts.InterSemiBold}
                fontWeight="bold"
                marginTop={normalize(5)}
              />
              <Buttons
                onPress={() => {
                  props.onBackdropPress();
                  navigation.navigate("TabNav");
                  handleRot();
                }}
                height={normalize(45)}
                width={normalize(240)}
                backgroundColor={Colorpath.ButtonColr}
                borderRadius={normalize(5)}
                text="Retry"
                color={Colorpath.white}
                fontSize={16}
                fontFamily={Fonts.InterSemiBold}
                fontWeight="bold"
                marginTop={normalize(15)}
              />
            </View>
          </SafeAreaView>}
        </SafeAreaView>
        {subit && <PrimeCard primeadd={subit} setPrimeadd={setSubit} />}
      </Modal>
    </>
  );
}

DrawerModal.propstype = {
  isVisible: propstype.string,
  onBackdropPress: propstype.func,
  onRequestClose: propstype.func,
  editButton: propstype.func,
  backButton: propstype.func,
  loginlogoutNavigate: propstype.func,
  rentalNavigate: propstype.func,
  expensesNav: propstype.func,
  interestedNav: propstype.func,
  // feedbackNavigate: propstype.func,
  watchlistNavigate: propstype.func,
  subscribeNavigate: propstype.func,
  rewardNavigate: propstype.func,
  homeNavigate: propstype.func,
  logoutSucees: propstype.func,
  handel: propstype.string,
  expandId: propstype.number,
  drawerPress: propstype.func
};
/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: Colorpath.Pagebg,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    padding: normalize(10),
    // flex: 0.4
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    zIndex: 2,
  },
  internetCard: {
    // position: 'absolute',
    top: 400,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colorpath.Pagebg,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    padding: normalize(10),
    marginTop: normalize(10),
    flex: 1,
    gap: normalize(5)
  },
  internetText: {
    color: "#000000",
    fontFamily: Fonts.InterSemiBold,
    fontSize: 20,
  },
})
