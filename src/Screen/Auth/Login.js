import { getCountryDialCode } from '../../Utils/Helpers/PhoneCountry';
import { formatUsPhone } from '../../Utils/Helpers/UsPhone';
/**
 * Login screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, status1, normalizeProfessionHandle, Login, handleInputChange, formatPhoneNumber, formatIndianPhoneNumber, handleLogin, verifyHandle, isTrueFlag, isFalseFlag, handleNavigation, proceedNonUsaLogin, backEra, goToGuestPage, onBackPress, styles.
 */

import { InteractionManager, View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, ScrollView, TextInput, Alert, Image, BackHandler, PermissionsAndroid, Linking, Keyboard } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { chooseStatecardRequest, licesensRequest, loginRequest, loginsiginRequest, verifyRequest } from '../../Redux/Reducers/AuthReducer';
import Loader from '../../Utils/Helpers/Loader';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import Imagepath from '../../Themes/Imagepath';
import { processPhoneNumberUSA } from '../../Utils/Helpers/UsaPhone';
import { dashboardRequest, mainprofileRequest } from '../../Redux/Reducers/DashboardReducer';
import { AppContext } from '../GlobalSupport/AppContext';
import InputField from '../../Components/CellInput';
/**
 * Status string constant.
 * @returns {string}
 */
let status = "";
/**
 * Status1 string constant.
 * @returns {string}
 */
let status1 = "";
import { SafeAreaView } from 'react-native-safe-area-context'
import { generateDeviceToken } from '../../Utils/Helpers/FirebaseToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { getCountryAndDialCode } from '../../Utils/Helpers/IPServer';
import { isNonUsaAccount, readNonUsaFlowState, readNonUsaPermanentFlags, writeNonUsaFlowState, clearNonUsaFlowState } from '../../Utils/Helpers/nonUsaFlow';
import styles from './Login.styles';

/**
 * Main Login Screen component.
 * 
 * **Purpose:** Handles user authentication via email or mobile number, manages non-USA user flows, and dispatches Redux login actions.
 * 
 * **Parameters:**
 * @param {Object} props - React Navigation props.
 * @param {Object} props.navigation - Navigation object.
 * @param {Object} props.route - Route object containing params like `isNonUsaUser`, `email`, `phone`, etc.
 * 
 * **Return Value:**
 * @returns {JSX.Element} The Login screen UI.
 * 
 * **Throws:** None
 * 
 * **Example Usage:**
 * ```jsx
 * <Stack.Screen name="Login" component={Login} />
 * ```
 * 
 * **Notes:**
 * - Relies heavily on Redux state (`AuthReducer`, `DashboardReducer`).
 * - Contains complex conditional routing based on user verification status and profession.
 */
const Login = (props) => {
  const {
    setFulldashbaord,
    setGtprof
  } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const DashboardReducer = useSelector(state => state.DashboardReducer);
  const [isPasswordFieldVisible, setIsPasswordFieldVisible] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [wholeD, setWholeD] = useState("");
  const [Usph, setUsph] = useState("")
  const [mobileHd, setMobileHd] = useState("");
  const [nonloader, setNonloader] = useState(false);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const loginSubmissionRef = useRef(false);
  const authRequestSeenRef = useRef(false);
  const dashboardRequestSeenRef = useRef(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [inputBlocked, setInputBlocked] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [choosePr, setChoosePr] = useState(false);
  const isFocus = useIsFocused();
  const [fcm, setFcm] = useState(false);
  const [nonUsaFlowState, setNonUsaFlowState] = useState(null);
  const [nonUsaPermanentFlags, setNonUsaPermanentFlags] = useState({
    professionUpdateRequired: false,
    stateLicenseFlowCompleted: false,
  });
  const [isNonUsaFlow, setIsNonUsaFlow] = useState(Boolean(props?.route?.params?.isNonUsaUser || String(props?.route?.params?.phoneCd?.phoneCd || '').trim() !== "+1"));
    /**
 * Handles input change.
 * @param {*} val - Input value.
 * @returns {void}
 */
const handleInputChange = (val) => {
    const digits = val.replace(/\D/g, '');
    const isPhoneNumber = !isNonUsaFlow && digits.length > 0 && !/[a-zA-Z]/.test(val);
    if (isPhoneNumber) {
      const cappedDigits = digits.slice(0, 10);
      const formatted = (phoneCountryCode || "+1") === "+1" ? formatUsPhone(cappedDigits) : cappedDigits;
      setEmail(formatted);
      setMobileHd(formatted);
      setMobile(true);
      setIsPasswordFieldVisible(false);
    } else {
      setEmail(val);
      setMobileHd("");
      setMobile(false);
      setIsPasswordFieldVisible(true);
    }
  };
    /**
 * Formats phone number.
 * @param {*} input - Input value.
 * @returns {*}
 */
const formatPhoneNumber = (input) => formatUsPhone(input);
    /**
 * Formats indian phone number.
 * @param {*} input - Input value.
 * @returns {*}
 */
const formatIndianPhoneNumber = (input) => {
    if (!input) return "";

    const strInput = String(input);
    const cleaned = strInput.replace(/\D/g, '').slice(0, 10);

    if (cleaned.length == 10) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }

    return strInput;
  };
  useEffect(() => {
    if (props?.route?.params?.isNonUsaUser) {
      setIsNonUsaFlow(true);
      setMobile(false);
      setPhoneCountryCode('');
    } else {
      setPhoneCountryCode(prev => prev || '+1');
    }
    if (props?.route?.params?.email) {
      setEmail(props?.route?.params?.email);
      setIsPasswordFieldVisible(true);
      setMobile(false);
    }
  }, [props?.route?.params?.email])
  useEffect(() => {
    let mounted = true;
    readNonUsaFlowState().then(async (state) => {
      if (!mounted) return;
      setNonUsaFlowState(state);
      const isNonUsa = isNonUsaAccount({}, state);
      
      let geoInfo = null;
      try {
        geoInfo = await getCountryAndDialCode({forceRefresh: true});
      } catch (err) {
        console.log('[Login] IP lookup failed:', err);
      }

      if (!mounted) return;
      const resolvedDialCode = getCountryDialCode(props?.route?.params?.phone, state, geoInfo);
      if (resolvedDialCode) setPhoneCountryCode(resolvedDialCode);

      if (isNonUsa) {
        setIsNonUsaFlow(true);
        setMobile(false);
        setIsPasswordFieldVisible(true);
      } else if (geoInfo) {
        const isNonUsaIp = geoInfo.country && geoInfo.country !== 'US' && geoInfo.country !== 'USA';
        setIsNonUsaFlow(isNonUsaIp);
        if (isNonUsaIp) {
          setMobile(false);
          setIsPasswordFieldVisible(true);
        } else {
          setPhoneCountryCode(geoInfo.dialCode || '+1');
        }
      } else {
        setIsNonUsaFlow(false);
        setPhoneCountryCode('+1');
      }
    });
    return () => {
      mounted = false;
    };
  }, [isFocus]);
  useEffect(() => {
    let mounted = true;
    readNonUsaPermanentFlags().then((flags) => {
      if (mounted) {
        setNonUsaPermanentFlags(flags);
      }
    });
    return () => {
      mounted = false;
    };
  }, [isFocus]);
  useEffect(() => {
    if (isNonUsaFlow) {
      setMobile(false);
      return;
    }
    if (props?.route?.params?.phone && phoneCountryCode == "+1") {
      const formatted = formatPhoneNumber(props?.route?.params?.phone?.phone);
      setMobileHd(formatted);
      setEmail(props?.route?.params?.phone?.phone);
      setPhoneCountryCode(props?.route?.params?.phone?.countryCode)
      setIsPasswordFieldVisible(false);
      setMobile(true);
    } else if (props?.route?.params?.phone && phoneCountryCode == "+91") {
      const formatted = formatIndianPhoneNumber(props?.route?.params?.phone?.phone);
      setMobileHd(formatted);
      setEmail(props?.route?.params?.phone?.phone);
      setPhoneCountryCode(props?.route?.params?.phone?.countryCode)
      setIsPasswordFieldVisible(false);
      setMobile(true);
    }
  }, [props?.route?.params?.phone])

    /**
 * Handles login.
 * @returns {void}
 */
const handleLogin = () => {
    if (loginSubmissionRef.current) return;
    const emailRegex = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
    const mobileRegex = /^\d{10}$/;
    if (!email) {
      showErrorAlert(isNonUsaFlow ? "Please enter your email address!" : "Please enter your email or mobile number!");
    } else if (isNonUsaFlow && !emailRegex.test(email)) {
      showErrorAlert("Please enter a valid email address!");
    } else if (!isNonUsaFlow && !emailRegex.test(email) && !mobileRegex.test(email)) {
      showErrorAlert("Please enter a valid email address or 10 digit mobile number!");
    } else if ((isPasswordFieldVisible || isNonUsaFlow) && !password) {
      showErrorAlert("Please enter your password to continue");
    } else {
      loginSubmissionRef.current = true;
      authRequestSeenRef.current = false;
      dashboardRequestSeenRef.current = false;
      setIsLoginSubmitting(true);
      let formattedEmail = email;
      let finalFormattedPhone = "";
      if (!isNonUsaFlow && phoneCountryCode == "+1" && email) {
        const finalCont = processPhoneNumberUSA(email.trim());
        finalFormattedPhone = finalCont?.formattedNumber || "";
      }
      if (!isNonUsaFlow && mobileRegex.test(email)) {
        formattedEmail = `${phoneCountryCode}${email}`;
      }
      let obj = (isPasswordFieldVisible || isNonUsaFlow) ? {
        "username": formattedEmail.trim(),
        "password": password.trim(),
        "deviceToken": fcm,
        "deviceType": Platform.OS
      } : {
        "phone": phoneCountryCode == "+1" ? `+1${mobileHd}` : formattedEmail.trim()
      };
      connectionrequest()
        .then(() => {
          dispatch((isPasswordFieldVisible || isNonUsaFlow) ? loginRequest(obj) : loginsiginRequest(obj));
        })
        .catch(err => {
          loginSubmissionRef.current = false;
          setIsLoginSubmitting(false);
          showErrorAlert("Please connect to the internet", err);
        });
    }
  };
  useEffect(() => {
    if (!loginSubmissionRef.current) return;
    const authRequestStatuses = [
      'Auth/loginRequest',
      'Auth/loginsiginRequest',
      'Auth/verifyRequest',
      'Auth/chooseStatecardRequest',
      'Auth/licesensRequest',
    ];
    const dashboardRequestStatuses = [
      'Dashboard/dashboardRequest',
      'Dashboard/mainprofileRequest',
    ];
    const authFailedStatuses = [
      'Auth/loginFailure',
      'Auth/loginsiginFailure',
      'Auth/verifyFailure',
      'Auth/chooseStatecardFailure',
      'Auth/licesensFailure',
    ];
    const dashboardFailedStatuses = [
      'Dashboard/dashboardFailure',
      'Dashboard/mainprofileFailure',
    ];
    if (authRequestStatuses.includes(AuthReducer?.status)) authRequestSeenRef.current = true;
    if (dashboardRequestStatuses.includes(DashboardReducer?.status)) dashboardRequestSeenRef.current = true;
    const currentAuthRequestFailed = authRequestSeenRef.current && authFailedStatuses.includes(AuthReducer?.status);
    const currentDashboardRequestFailed = dashboardRequestSeenRef.current && dashboardFailedStatuses.includes(DashboardReducer?.status);
    if (currentAuthRequestFailed || currentDashboardRequestFailed) {
      loginSubmissionRef.current = false;
      setIsLoginSubmitting(false);
      setNonloader(false);
    }
  }, [AuthReducer?.status, DashboardReducer?.status]);
  useEffect(() => {
    if (isFocus) return;
    loginSubmissionRef.current = false;
    authRequestSeenRef.current = false;
    dashboardRequestSeenRef.current = false;
    setIsLoginSubmitting(false);
    setNonloader(false);
  }, [isFocus]);
    /**
 * Verify handle utility.
 * @returns {void}
 */
const verifyHandle = () => {
    let obj = {};
    connectionrequest()
      .then(() => {
        dispatch(verifyRequest(obj));
      })
      .catch((err) => {
        loginSubmissionRef.current = false;
        setIsLoginSubmitting(false);
        showErrorAlert("Please connect to internet", err);
      });
  };

  const validateEmail = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
  const isValidEmail = !mobile && email?.length > 0 && !validateEmail.test(email);
  const mobileReg = /^\d{10}$/;
  const isMobile = !isNonUsaFlow && mobile && email?.length > 0 && !mobileReg.test(email);
    /**
 * Determines whether true flag is true.
 * @param {*} value - Input value.
 * @returns {*}
 */
const isTrueFlag = (value) => value == true || value == 1 || value == "1" || value == "true";
    /**
 * Determines whether false flag is true.
 * @param {*} value - Input value.
 * @returns {*}
 */
const isFalseFlag = (value) => value == false || value == 0 || value == "0" || value == "false";
  const lastHandledSigninResponseRef = useRef(null);
  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/loginRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/loginSuccess':
        status = AuthReducer.status;
        break;
      case 'Auth/loginFailure':
        status = AuthReducer.status;
        showErrorAlert(AuthReducer?.loginResponse?.msg || "Something went wrong!");
        break;
      case 'Auth/loginsiginRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/loginsiginSuccess':
        status = AuthReducer.status;
        break;
      case 'Auth/loginsiginFailure':
        status = AuthReducer.status;
        showErrorAlert(AuthReducer?.loginsiginResponse?.msg || "something went wrong !");
        break;
      case 'Auth/verifyRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/verifySuccess': {
        status = AuthReducer.status;
        const wholeData = AuthReducer?.verifyResponse;
        if (isNonUsaFlow) {
          if (wholeData?.is_verified !== "1") {
            props?.navigation.navigate("LoginEmail", {
              nonUsaUser: true,
              user: {
                emailid: wholeData?.email,
              },
              verifyemail: {
                verifyemail: wholeData,
                isNonUsaUser: true,
              },
            });
          }
        } else if (wholeData?.is_verified !== "1" && wholeData?.phone_verified !== "1") {
          props?.navigation.navigate("LoginEmail", {
            user: {
              emailid: wholeData?.email,
              phoneData: wholeData?.phone,
            },
          });
        }
        break;
      }
      case 'Auth/verifyFailure':
        status = AuthReducer.status;
        break;
    }
  }
  useEffect(() => {
    const loginSignInResponse = AuthReducer?.loginsiginResponse;
    if (!loginSignInResponse || Object.keys(loginSignInResponse).length == 0) return;
    if (lastHandledSigninResponseRef.current == loginSignInResponse) return;
    lastHandledSigninResponseRef.current = loginSignInResponse;

    const normalizedPhoneCode = String(phoneCountryCode || "").trim();
    const isUSUser = normalizedPhoneCode == "+1";
    const isEmailVerified = isTrueFlag(loginSignInResponse?.is_verified);
    const isPhoneVerified = isTrueFlag(loginSignInResponse?.phone_verified);
    const isEmailNotVerified = isFalseFlag(loginSignInResponse?.is_verified);
    const isPhoneNotVerified = isFalseFlag(loginSignInResponse?.phone_verified);
    const isSuccess = isTrueFlag(loginSignInResponse?.success);
    const hasPhoneOtp = !!loginSignInResponse?.phone_otp;
    // OTP generation response often only has success/msg/phone_otp.
    // Handle this first so it always navigates to OTP screen.
    if (isSuccess && hasPhoneOtp) {
      if (isNonUsaFlow) return;
      props.navigation.navigate("MobileLoginOTP", {
        "mobileNo": {
          mobileNo: isUSUser ? mobileHd : email,
          phoneCode: normalizedPhoneCode
        }
      });
      return;
    }
    if (isNonUsaFlow) {
      if (isEmailNotVerified) {
        props.navigation.navigate("LoginEmail", {
          nonUsaUser: true,
          user: {
            emailid: loginSignInResponse?.email || email,
          },
          verifyemail: {
            verifyemail: loginSignInResponse,
            isNonUsaUser: true,
          },
        });
        return;
      }
      if (isEmailVerified) {
        let objToken = { "token": loginSignInResponse?.token, "key": {} };
        dispatch(dashboardRequest(objToken));
        setNonloader(true);
        setGtprof(false);
        return;
      }
    }
    if (isEmailNotVerified && isPhoneNotVerified) {
      verifyHandle();
      return;
    }
    if (isEmailVerified && isPhoneNotVerified) {
      props?.navigation.navigate("LoginMobile", { validPh: { cellno: email, phonecode: normalizedPhoneCode } });
      return;
    }
      if (isPhoneVerified) {
        if (isUSUser) {
          let objToken = { "token": loginSignInResponse?.token, "key": {} }
          dispatch(dashboardRequest(objToken));
          setNonloader(true);
          setGtprof(false);
        } else {
          props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }));
        }
        return;
      }
    if (isSuccess) {
      props.navigation.navigate("MobileLoginOTP", {
        "mobileNo": {
          mobileNo: isUSUser ? mobileHd : email,
          phoneCode: normalizedPhoneCode
        }
      });
      return;
    }
    loginSubmissionRef.current = false;
    setIsLoginSubmitting(false);
    showErrorAlert(loginSignInResponse?.msg || "something went wrong !");
  }, [AuthReducer?.loginsiginResponse, phoneCountryCode, email, mobileHd, dispatch]);
  const loginResponse = AuthReducer?.loginResponse || {};
  const user = loginResponse?.user || {};
  const isGuestPrimeUser = useMemo(() => {
    const subscriptionUser = String(user?.subscription_user || '').trim().toLowerCase();
    const subscriptions = Array.isArray(user?.subscriptions) ? user.subscriptions : [];
    return subscriptionUser == 'non-subscribed' && subscriptions.length == 0;
  }, [user?.subscription_user, user?.subscriptions]);
  console.log(isGuestPrimeUser, "isGuestPrimeUser=====", props?.route?.name)
  const chooseStatecardResponse = AuthReducer?.chooseStatecardResponse || {};
  const currentMainProfile = DashboardReducer?.mainprofileResponse;

  // Memoized derived values
  const profFromDashboard = useMemo(() => {
    const professionalInformation = currentMainProfile?.professional_information || {};
    const profession = String(professionalInformation?.profession || '').trim();
    const professionType = String(professionalInformation?.profession_type || '').trim();
    return profession && professionType && !profession.includes('-')
      ? `${profession} - ${professionType}`
      : profession || null;
  }, [currentMainProfile]);

  const allProfTake = useMemo(() => (
    ['physician-md', 'physician-do', 'physician-dpm'].includes(
      String(profFromDashboard || '').toLowerCase().replace(/\s+/g, '')
    )
  ), [profFromDashboard]);

  const token = useMemo(() => loginResponse?.token, [loginResponse]);
  const tokenObj = useMemo(() => ({ token, key: {} }), [token]);
  const prevToken = useRef(null);
  const prevLicensureProfession = useRef(null);
  const profileRequestPending = useRef(false);
  const profileClearedForRequest = useRef(false);
  const [isCurrentProfileReady, setIsCurrentProfileReady] = useState(false);

  // Track if we have valid state license data
  const hasStateLicenseData = useRef(false);
  const stateLicenseCheckComplete = useRef(false);

  // If Physician with no profession_type set, dispatch verifyRequest once on loginSucces

  // Dispatch license request on token change
  useEffect(() => {
    if (token && token !== prevToken.current) {
      // Reset flags when token changes
      hasStateLicenseData.current = false;
      stateLicenseCheckComplete.current = false;
      profileRequestPending.current = true;
      profileClearedForRequest.current = false;
      setIsCurrentProfileReady(false);
      dispatch(chooseStatecardRequest(tokenObj));
      dispatch(mainprofileRequest(tokenObj));
      prevToken.current = token;
    }
    if (token && profFromDashboard && profFromDashboard !== prevLicensureProfession.current) {
      dispatch(licesensRequest(profFromDashboard));
      prevLicensureProfession.current = profFromDashboard;
    }
  }, [token, tokenObj, dispatch, profFromDashboard]);

  useEffect(() => {
    if (!profileRequestPending.current) return;
    if (currentMainProfile === null) {
      profileClearedForRequest.current = true;
      return;
    }
    if (
      DashboardReducer?.status === 'Dashboard/mainprofileSuccess' &&
      currentMainProfile &&
      typeof currentMainProfile === 'object'
    ) {
      profileRequestPending.current = false;
      setIsCurrentProfileReady(true);
    }
  }, [currentMainProfile, DashboardReducer?.status]);

  // Monitor when state license response is valid
  useEffect(() => {
    if (chooseStatecardResponse?.state_licensures !== undefined) {
      hasStateLicenseData.current = true;
    }
  }, [chooseStatecardResponse]);

  // Main navigation logic
  useEffect(() => {
    if (!token || !isCurrentProfileReady) return;
    AsyncStorage.setItem(constants.GUEST_PRIME_USER, JSON.stringify(isGuestPrimeUser)).catch(err => {
      console.log('Error storing guest prime flag', err);
    });
    const isEmailNotVerified = loginResponse.is_verified == "0";
    const isPhoneNotVerified = loginResponse.phone_verified == "0";
    const isEmailVerified = loginResponse.is_verified == "1";
    const nophone = !loginResponse.phone
    const isUsaFlow = !isNonUsaFlow;
    const primaryLicense =
      user?.licensures?.[0] ||
      DashboardReducer?.mainprofileResponse?.licensures?.[0] ||
      {};
    const hasLicense = !!String(primaryLicense?.license_number || '').trim();
    // noLicense: true when license_number is null or "" (API returns "" when not yet added)
    const availableLicensureStates = AuthReducer?.licesensResponse?.licensure_states;
    const licensureStatesCheckComplete = AuthReducer?.licesensRequestedProfession === profFromDashboard &&
      Array.isArray(availableLicensureStates);
    const hasStateLicense = hasLicense || (chooseStatecardResponse?.state_licensures?.length > 0);

    // Track navigation state to prevent duplicate calls
    let navigationHandled = false;

        /**
 * Handles navigation.
 * @param {*} destination - Input value.
 * @param {Object} params - Input value.
 * @returns {void}
 */
const handleNavigation = (destination, params = {}) => {
      if (!navigationHandled) {
        props?.navigation.navigate(destination, params);
        navigationHandled = true;
        stateLicenseCheckComplete.current = true;
      }
    };

    const isNonUsa = isNonUsaAccount(user) || isNonUsaFlow;
    if (isNonUsa) {
      if (isEmailNotVerified) {
        handleNavigation("LoginEmail", {
          nonUsaUser: true,
          user: {
            emailid: loginResponse?.email,
          },
          verifyemail: {
            verifyemail: loginResponse,
            isNonUsaUser: true,
          },
        });
        return;
      }
            /**
 * Proceed non usa login utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const proceedNonUsaLogin = async () => {
        try {
          await writeNonUsaFlowState({
            userType: 'non_usa',
            isNonUsa: true,
            emailVerified: true,
            professionCompleted: true,
          });
        } catch (e) {
          console.log('Error writing nonUsaFlowState:', e);
        }
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'TabNav' }],
          })
        );
      };
      proceedNonUsaLogin();
      return;
    } else {
      clearNonUsaFlowState().catch(err => console.log('clearNonUsaFlowState error', err));
    }

    if (isEmailNotVerified && isPhoneNotVerified) {
      handleNavigation("LoginEmail", {
        user: {
          emailid: loginResponse?.email,
          phoneData: loginResponse?.phone,
        }
      });
      return;
    }
    if (isEmailVerified && nophone) {
      handleNavigation("AddMobileLogin");
      return;
    }
    if (isEmailVerified && isPhoneNotVerified) {
      handleNavigation("LoginMobile", { validPh: { cellno: loginResponse?.phone, phonecode: phoneCountryCode } });
      return;
    }
    if (isUsaFlow && allProfTake && !licensureStatesCheckComplete) {
      return;
    }

    if (isUsaFlow && allProfTake) {
      if (hasStateLicense) {
        setNonloader(true);
        dispatch(dashboardRequest(tokenObj));
        setGtprof(true);
      }
      else {
        setNonloader(true);
        handleNavigation("CreateStateInfor", { dataVerify: { dataVerify: "Nodasta", allDat: loginResponse?.user } });
      }
    }
    else if (loginResponse.success) {
      setNonloader(true);
      dispatch(dashboardRequest(tokenObj));
      setGtprof(false);
    }
    else {
      showErrorAlert(loginResponse.msg || "Something went wrong!");
    }
  }, [
    token,
    currentMainProfile,
    isCurrentProfileReady,
    allProfTake,
    loginResponse,
    user?.license_number,
    user?.licensures,
    chooseStatecardResponse,
    AuthReducer?.licesensResponse,
    AuthReducer?.licesensRequestedProfession,
    nonUsaPermanentFlags,
    phoneCountryCode,
    tokenObj,
    AuthReducer?.verifyResponse,
    isGuestPrimeUser,
    isNonUsaFlow
  ]);
  useEffect(() => {
    if (DashboardReducer?.dashboardResponse?.data?.licensures?.length > 0 && allProfTake) {
      const uniqueStates = DashboardReducer?.dashboardResponse?.data?.licensures?.filter((state, index, self) => {
        return index === self.findIndex((s) =>
          s.state_id === state.state_id &&
          s.board_id === state.board_id
        );
      });
      dispatch(mainprofileRequest({}))
      setGtprof(true);
      setFulldashbaord(uniqueStates);
      props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }));
    } else if (DashboardReducer?.dashboardResponse?.data?.licensures?.length > 0 && !allProfTake) {
      const uniqueStates = DashboardReducer?.dashboardResponse?.data?.licensures?.filter((state, index, self) => {
        return index === self.findIndex((s) =>
          s.state_id === state.state_id &&
          s.board_id === state.board_id
        );
      });
      dispatch(mainprofileRequest({}))
      setGtprof(false);
      setNonloader(false);
      setFulldashbaord(uniqueStates);
      props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }));
    } else if (DashboardReducer?.dashboardResponse?.data?.licensures?.length == 0 && !allProfTake) {
      setFulldashbaord(0);
      setGtprof(false);
      setNonloader(false);
      dispatch(mainprofileRequest({}))
      props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }));
    }
  }, [DashboardReducer?.dashboardResponse?.data, allProfTake])
  if (status1 == '' || DashboardReducer.status != status1) {
    switch (DashboardReducer.status) {
      case 'Dashboard/dashboardRequest':
        status1 = DashboardReducer.status;
        setNonloader(true);
        break;
      case 'Dashboard/dashboardSuccess':
        status1 = DashboardReducer.status;
        setNonloader(false);
        const uniqueStates = DashboardReducer?.dashboardResponse?.data?.licensures?.filter((state, index, self) => {
          return index === self.findIndex((s) =>
            s.state_id === state.state_id &&
            s.board_id === state.board_id
          );
        });
        dispatch(mainprofileRequest({}))
        setFulldashbaord(uniqueStates);
        props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav",params: { detectmain:isGuestPrimeUser ? "Prime" : "main" } }] }));
        break;
      case 'Dashboard/dashboardFailure':
        status1 = DashboardReducer.status;
        setNonloader(false);
        break;
    }
  }
    /**
 * Back era utility.
 * @returns {void}
 */
const backEra = () => {
    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
    } else {
      props.navigation.navigate("Onboard");
    }
  }
    /**
 * Go to guest page utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const goToGuestPage = async () => {
    try {
      const session = await AsyncStorage.getItem('PLAYERSESSION');
      if (!session) {
        const guestSessionId = String(Math.floor(10000000000 + Math.random() * 90000000000));
        await AsyncStorage.setItem('PLAYERSESSION', guestSessionId);
      }
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'GuestUser' }],
        })
      );
    } catch (err) {
      console.log('goToGuestPage error', err);
      props.navigation.navigate("Onboard");
    }
  }
  useEffect(() => {
        /**
 * On back press utility.
 * @returns {boolean}
 */
const onBackPress = () => {
      backEra();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => backHandler.remove();
  }, []);
  const emailRegex = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
  const mobileRegex = /^\d{10}$/;
  const isButtonEnabled = isNonUsaFlow
    ? emailRegex.test(email)
    : (emailRegex.test(email) || mobileRegex.test(email));
  useEffect(() => {
    if (DashboardReducer?.dashboardResponse?.data) {
      setNonloader(false);
    }
  }, [DashboardReducer?.dashboardResponse])
  const phoneInputRef = useRef(null);
  useEffect(() => {
    if (mobile && phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, [mobile])

  useLayoutEffect(() => {
    props.navigation.setOptions({ gestureEnabled: false });
  }, []);
  useEffect(() => {
    if (!isFocus) return;
    let active = true;
    let hasRequested = false;
    let interactionTask = null;

    const requestToken = () => {
      if (!active || hasRequested) return;
      hasRequested = true;
      interactionTask = InteractionManager.runAfterInteractions(() => {
        if (!active) return;
        generateDeviceToken()
          .then(token => {
            if (active && token) setFcm(token);
          })
          .catch(err => {
            if (active) showErrorAlert("Unable to enable notifications", err);
          });
      });
    };

    const unsubscribe = typeof props.navigation?.addListener === 'function'
      ? props.navigation.addListener('transitionEnd', (e) => {
          if (!e?.data?.closing) {
            requestToken();
          }
        })
      : null;

    if (!unsubscribe) {
      requestToken();
    }

    return () => {
      active = false;
      interactionTask?.cancel();
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [isFocus, props.navigation]);
  return (
    <>
      <MyStatusBar
        barStyle={'light-content'}
        backgroundColor={Colorpath.Pagebg}
      />
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? normalize(10) : 0}
        >
          <ScrollView 
            keyboardShouldPersistTaps="always" 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <View style={[styles.logoContainer, Platform.OS === 'ios' ? styles.logoContainerIos : styles.logoContainerAndroid]}>
              <Image source={Imagepath.eMedfulllogo} style={styles.logoImage} />
            </View>
            <View style={[styles.headerContainer]}>
              <Text style={styles.headerText}>{"Hello Again!"}</Text>
              <Text style={styles.subHeaderText}>
                {"Welcome back we’re always \n    happy to see you again"}
              </Text>
            </View>
            <View>
              <View style={styles.sectionContainer}>

            <View style={styles.content}>
                  <View style={styles.formContainer}>
                    {mobile && !isNonUsaFlow ? <InputField
                      ref={phoneInputRef}
                      label="Email / Cell Number"
                      value={mobileHd}
                      onChangeText={(val) => {
                        if (/[a-zA-Z@]/.test(val)) {
                          handleInputChange(val);
                          return;
                        }
                        const digits = val.replace(/\D/g, '').slice(0, 10);
                        if (phoneCountryCode == "+1") {
                          const formatted = formatPhoneNumber(digits);
                          setMobileHd(formatted);
                          handleInputChange(digits);
                          setEmail(digits);
                        } else {
                          setMobileHd(digits);
                          handleInputChange(digits);
                          setEmail(digits);
                        }
                      }}
                      placeholder=""
                      placeholderTextColor="#949494"
                      keyboardType="default"
                      showCountryCode={true}
                      countryCode={phoneCountryCode || "+1"}
                      maxlength={phoneCountryCode == "+1" ? 14 : 10}
                    /> : <InputField
                      label={isNonUsaFlow ? "Email Address" : "Email / Cell Number"}
                      value={email}
                      onChangeText={handleInputChange}
                      placeholder=""
                      placeholderTextColor="#949494"
                      keyboardType="default"
                      showCountryCode={false}
                      maxlength={100}
                    />}
                    {isValidEmail && (
                      <View style={styles.validationContainer}>
                        <Text style={styles.validationText}>
                          {"Please enter a valid email address (e.g., abc@gmail.com)"}
                        </Text>
                      </View>
                    )}
                    {isMobile && (
                      <View style={styles.validationContainer}>
                        <Text style={styles.validationText}>
                          {"Please enter a valid cell number"}
                        </Text>
                      </View>
                    )}
                    {isPasswordFieldVisible && <InputField
                      label="Password"
                      value={password}
                      onChangeText={setPassword}
                      placeholder=""
                      placeholderTextColor="#949494"
                      isPassword={true}
                      keyboardType="default"
                      showCountryCode={false}
                    />}
                    {password && password?.length < 5 && (
                      <View style={styles.validationContainer}>
                        <Text style={styles.validationText}>
                          {"Please enter your password to continue"}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                {(isNonUsaFlow || (!mobile && phoneCountryCode)) ? <View style={[styles.forgotContainer, styles.forgotContainerOffset]}>
                  <TouchableOpacity onPress={() => { props.navigation.navigate("ForgotMPIN", { phoneCode: phoneCountryCode || "+1", isNonUsaUser: isNonUsaFlow }) }}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View> : <></>}
              </View>
              <Buttons
                onPress={handleLogin}
                height={normalize(45)}
                width={normalize(290)}
                backgroundColor={isButtonEnabled ? Colorpath.ButtonColr : "#CCC"}
                borderRadius={normalize(9)}
                text={(isPasswordFieldVisible || isNonUsaFlow) ? "Sign In" : "Proceed"}
                color={Colorpath.white}
                fontSize={18}
                fontFamily={Fonts.InterSemiBold}
                marginTop={normalize(0)}
                disabled={!isButtonEnabled || isLoginSubmitting}
                loading={isLoginSubmitting || AuthReducer?.status == 'Auth/loginRequest' || AuthReducer?.status == 'Auth/loginsiginRequest'}
              />
            </View>
            <View style={styles.footerRow}>
              <View>
                <Text style={styles.footerText}>
                  {"New user?"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => {
                if (isNonUsaFlow) {
                  props.navigation.navigate('SignUp', { phoneCd: { phoneCd: '' }, isNonUsaUser: true });
                } else {
                  props.navigation.navigate('SignUp', { phoneCd: { phoneCd: phoneCountryCode || '' } });
                }
              }}>
                <Text style={styles.footerLinkText}>
                  {" Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={goToGuestPage} style={styles.guestButton}>
              <Text style={styles.guestButtonText}>
                {"Back to Guest Page"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
        <Loader visible={isLoginSubmitting || nonloader || AuthReducer?.status == 'Auth/loginRequest' || AuthReducer?.status == 'Auth/loginsiginRequest' || AuthReducer?.status == 'Auth/verifyRequest'} />
      </SafeAreaView>
    </>
  );
};

/**
 * Login default export.
 *
 * @returns {*}
 */
export default Login;
