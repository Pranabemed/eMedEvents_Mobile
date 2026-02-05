import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Animated, Easing, Image, BackHandler, PermissionsAndroid, Linking, Keyboard } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { chooseStatecardRequest, loginRequest, loginsiginRequest, verifyRequest } from '../../Redux/Reducers/AuthReducer';
import Loader from '../../Utils/Helpers/Loader';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import Imagepath from '../../Themes/Imagepath';
import { processPhoneNumberUSA } from '../../Utils/Helpers/UsaPhone';
import { dashboardRequest, mainprofileRequest } from '../../Redux/Reducers/DashboardReducer';
import { AppContext } from '../GlobalSupport/AppContext';
import InputField from '../../Components/CellInput';
let status = "";
let status1 = "";
import { SafeAreaView } from 'react-native-safe-area-context'
import { getPublicIP } from '../../Utils/Helpers/IPServer';
import { generateDeviceToken }from '../../Utils/Helpers/FirebaseToken';
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
  const [phoneCountryCode, setPhoneCountryCode] = useState('');
  const [wholeD, setWholeD] = useState("");
  const [Usph, setUsph] = useState("")
  const [mobileHd, setMobileHd] = useState("");
  const [nonloader, setNonloader] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [inputBlocked, setInputBlocked] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [choosePr, setChoosePr] = useState(false);
  const isFocus = useIsFocused();
   const [fcm, setFcm] = useState(false);
  const handleInputChange = (val) => {
    const emailRegex = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
    const mobileRegex = /^\d{10}$/;
    setEmail(val);
    // Block input after first digit if no location permission
    if (mobile && !locationPermission && val.length > 0) {
      setEmail(val);
      setInputBlocked(true);
    }
    if (val.trim() === '') {
      setMobile(false);
      setIsPasswordFieldVisible(false);
      return;
    }
    if (emailRegex.test(val)) {
      setIsPasswordFieldVisible(true);
    } else if (mobileRegex.test(val)) {
      setIsPasswordFieldVisible(false);
    } else if (/^\d+$/.test(val)) {
      setMobile(true);
      setIsPasswordFieldVisible(false);
    } else if (/^[a-zA-Z]/.test(val)) {
      setIsPasswordFieldVisible(false);
    } else {
      setIsPasswordFieldVisible(false);
      setMobile(false);
    }
  };
  const formatPhoneNumber = (input) => {
    const cleaned = input.replace(/\D/g, '').slice(0, 10);
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (match) {
      let formatted = '';
      if (match[1]) formatted = `(${match[1]}`;
      if (match[2]) formatted += `) ${match[2]}`;
      if (match[3]) formatted += `-${match[3]}`;
      return formatted;
    }
    return input;
  };
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
    if (props?.route?.params?.email) {
      setEmail(props?.route?.params?.email);
      setIsPasswordFieldVisible(true);
      setMobile(false);
    }
  }, [props?.route?.params?.email])
  useEffect(() => {
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
  const handleLogin = () => {
    const emailRegex = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
    const mobileRegex = /^\d{10}$/;
    if (!email) {
      showErrorAlert("Please enter your email or mobile number!");
    } else if (!emailRegex.test(email) && !mobileRegex.test(email)) {
      showErrorAlert("Please enter a valid email address or 10 digit mobile number!");
    } else if (isPasswordFieldVisible && !password) {
      showErrorAlert("Please enter your password to continue");
    } else {
      let formattedEmail = email;
      let finalFormattedPhone = "";
      if (phoneCountryCode == "+1" && email) {
        const finalCont = processPhoneNumberUSA(email.trim());
        finalFormattedPhone = finalCont?.formattedNumber || "";
      }
      if (mobileRegex.test(email)) {
        formattedEmail = `${phoneCountryCode}${email}`;
      }
      let obj = isPasswordFieldVisible ? {
        "username": formattedEmail.trim(),
        "password": password.trim(),
        "usa_user": 1
      } : {
        "phone": phoneCountryCode == "+1" ? `+1${mobileHd}` : formattedEmail.trim()
      };
      connectionrequest()
        .then(() => {
          dispatch(isPasswordFieldVisible ? loginRequest(obj) : loginsiginRequest(obj));
        })
        .catch(err => {
          showErrorAlert("Please connect to the internet", err);
        });
    }
  };
  const animatedValuesemail = useRef(new Animated.Value(1)).current;
  const scaleValuesemail = useRef(new Animated.Value(0)).current;
  const animatedValuespass = useRef(new Animated.Value(1)).current;
  const scaleValuesespass = useRef(new Animated.Value(0)).current;
  const verifyHandle = () => {
    let obj = {};
    connectionrequest()
      .then(() => {
        dispatch(verifyRequest(obj));
      })
      .catch((err) => {
        showErrorAlert("Please connect to internet", err);
      });
  };
  useEffect(() => {
    const targetScales = email ? 1 : 0.8;
    Animated.parallel([
      Animated.timing(animatedValuesemail, {
        toValue: email ? 1 : 0,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValuesemail, {
        toValue: targetScales,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [email]);
  useEffect(() => {
    const targetScale = password ? 1 : 0.8;
    Animated.parallel([
      Animated.timing(animatedValuespass, {
        toValue: password ? 1 : 0,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValuesespass, {
        toValue: targetScale,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [password]);
  const validateEmail = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
  const isValidEmail = !mobile && email?.length > 0 && !mobile && !validateEmail.test(email);
  const mobileReg = /^\d{10}$/;
  const isMobile = mobile && email?.length > 0 && mobile && !mobileReg.test(email);
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
        if (phoneCountryCode !== "+1") {
          if (AuthReducer?.loginsiginResponse?.is_verified == "0" && AuthReducer?.loginsiginResponse?.phone_verified == "0") {
            verifyHandle();
          } else if (AuthReducer?.loginsiginResponse?.is_verified == "1") {
            props?.navigation.navigate("LoginMobile", { validPh: { cellno: email, phonecode: phoneCountryCode } });
          } else if (AuthReducer?.loginsiginResponse?.phone_verified == "1") {
            props?.navigation.navigate("CreateStateInfor");
          } else if (AuthReducer?.loginsiginResponse?.success == true) {
            props.navigation.navigate("MobileLoginOTP", { "mobileNo": { mobileNo: phoneCountryCode == "+1" ? mobileHd : email, phoneCode: phoneCountryCode } });
          } else {
            showErrorAlert(AuthReducer?.loginsiginResponse?.msg || "something went wrong !");
          }
        } else {
          if (AuthReducer?.loginsiginResponse?.is_verified == "0" && AuthReducer?.loginsiginResponse?.phone_verified == "0") {
            verifyHandle();
          } else if (AuthReducer?.loginsiginResponse?.is_verified == "1") {
            props?.navigation.navigate("LoginMobile", { validPh: { cellno: email, phonecode: phoneCountryCode } });
          } else if (AuthReducer?.loginsiginResponse?.phone_verified == "1") {
            let objToken = { "token": AuthReducer?.loginsiginResponse?.token, "key": {} }
            dispatch(dashboardRequest(objToken));
            setNonloader(true);
            setGtprof(false);
          } else if (AuthReducer?.loginsiginResponse?.success == true) {
            props.navigation.navigate("MobileLoginOTP", { "mobileNo": { mobileNo: phoneCountryCode == "+1" ? mobileHd : email, phoneCode: phoneCountryCode } });
          } else {
            showErrorAlert(AuthReducer?.loginsiginResponse?.msg || "something went wrong !");
          }
        }
        break;
      case 'Auth/loginsiginFailure':
        status = AuthReducer.status;
        showErrorAlert(AuthReducer?.loginsiginResponse?.msg || "something went wrong !");
        break;
      case 'Auth/verifyRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/verifySuccess':
        status = AuthReducer.status;
        const wholeData = AuthReducer?.verifyResponse;
        if (wholeData?.is_verified !== "1" && wholeData?.phone_verified !== "1") {
          Alert.alert("fggf")
          props?.navigation.navigate("LoginEmail", {
            user: {
              emailid: wholeData?.email,
              phoneData: wholeData?.phone,
            },
          });
        }
        break;
      case 'Auth/verifyFailure':
        status = AuthReducer.status;
        break;
    }
  }
  const COUNTRY_DIAL_CODES = {
    IN: '+91',
    US: '+1',
    GB: '+44',
    AU: '+61',
    CA: '+1',
    SG: '+65',
  };
  const getCountryFromIP = async (ip) => {
    try {
      const res = await fetch(`https://ipinfo.io/${ip}/json`);
      const text = await res.text();
      if (text.startsWith('<')) {
        throw new Error('HTML response');
      }
      const data = JSON.parse(text);
      return data?.country || null; // "IN"
    } catch (e) {
      console.log('Geo lookup failed:', e);
      return null;
    }
  };
  const ipAddress = getPublicIP(); // global value
  useEffect(() => {
    if (!ipAddress) return; // ⛔ wait until IP exists
    const fetchCountry = async () => {
      const countryCode = await getCountryFromIP(ipAddress);
      if (countryCode) {
        const dialCode = COUNTRY_DIAL_CODES[countryCode] || '';
        setPhoneCountryCode(dialCode); // ✅ push dial code instead of country code
      }
    };
    fetchCountry();
  }, [ipAddress]);
  const validHandles = useMemo(() => new Set([
    "Physician - MD",
    "Physician - DO",
    "Physician - DPM"
  ]), []);

  const loginResponse = AuthReducer?.loginResponse || {};
  const user = loginResponse?.user || {};
  const chooseStatecardResponse = AuthReducer?.chooseStatecardResponse || {};

  // Memoized derived values
  const profFromDashboard = useMemo(() => (
    user?.profession && user?.profession_type
      ? `${user.profession} - ${user.profession_type}`
      : null
  ), [user.profession, user.profession_type]);

  const allProfTake = useMemo(() => (
    validHandles.has(profFromDashboard)
  ), [validHandles, profFromDashboard]);

  const token = useMemo(() => loginResponse?.token, [loginResponse]);
  const tokenObj = useMemo(() => ({ token, key: {} }), [token]);
  const prevToken = useRef(null);

  // Track if we have valid state license data
  const hasStateLicenseData = useRef(false);
  const stateLicenseCheckComplete = useRef(false);

  // Dispatch license request on token change
  useEffect(() => {
    if (token && token !== prevToken.current) {
      // Reset flags when token changes
      hasStateLicenseData.current = false;
      stateLicenseCheckComplete.current = false;
      dispatch(chooseStatecardRequest(tokenObj));
      prevToken.current = token;
    }
  }, [token, tokenObj, dispatch]);

  // Monitor when state license response is valid
  useEffect(() => {
    if (chooseStatecardResponse?.state_licensures !== undefined) {
      hasStateLicenseData.current = true;
    }
  }, [chooseStatecardResponse]);

  // Main navigation logic
  useEffect(() => {

    if (!token) return;

    const isEmailNotVerified = loginResponse.is_verified == "0";
    const isPhoneNotVerified = loginResponse.phone_verified == "0";
    const isEmailVerified = loginResponse.is_verified == "1";
    const nophone = !loginResponse.phone
    const hasLicense = !!user.license_number;
    // Get state licenses only if we have valid data
    const stateLicenses = hasStateLicenseData.current
      ? chooseStatecardResponse?.state_licensures || []
      : [];

    const hasStateLicensures = stateLicenses.length > 0;

    // Track navigation state to prevent duplicate calls
    let navigationHandled = false;

    const handleNavigation = (destination, params = {}) => {
      if (!navigationHandled) {
        props?.navigation.navigate(destination, params);
        navigationHandled = true;
        stateLicenseCheckComplete.current = true;
      }
    };
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

    if (allProfTake && !hasLicense && !hasStateLicenseData.current) {
      return;
    }
    if (allProfTake) {
      if (hasLicense) {
        setNonloader(true);
        dispatch(dashboardRequest(tokenObj));
        setGtprof(true);
      }
      else if (hasStateLicensures) {
        setNonloader(true);
        handleNavigation("ChooseState", {
          dataVr: { dataVr: stateLicenses, Loc: loginResponse?.user?.user_location }
        });
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
    allProfTake,
    loginResponse,
    user?.license_number,
    chooseStatecardResponse, // Now watching the entire response object
    phoneCountryCode,
    tokenObj
  ]);
  useEffect(() => {
    if (DashboardReducer?.dashboardResponse?.data?.licensures?.length > 0) {
      const uniqueStates = DashboardReducer?.dashboardResponse?.data?.licensures?.filter((state, index, self) => {
        return index === self.findIndex((s) =>
          s.state_id === state.state_id &&
          s.board_id === state.board_id
        );
      });
      dispatch(mainprofileRequest({}))
      setFulldashbaord(uniqueStates);
      props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }));
    }
  }, [DashboardReducer?.dashboardResponse?.data])
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
        props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }));
        break;
      case 'Dashboard/dashboardFailure':
        status1 = DashboardReducer.status;
        setNonloader(false);
        break;
    }
  }
  const backEra = () => {
    props.navigation.navigate("Onboard");
  }
  useEffect(() => {
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
  const isButtonEnabled = emailRegex.test(email) || mobileRegex.test(email);
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
    const ipAddress = getPublicIP();
    console.log(ipAddress, "ipAddress+======")
  }, [])
  useEffect(() => {
    generateDeviceToken()
      .then((res) => {
        console.log("resd=====",res)
        setFcm(res)
      })
      .catch((err) => {
        showErrorAlert("Please connect to Interne11t", err)
      })
  }, [isFocus, fcm])
  console.log("fcm=====",fcm)
  return (
    <>
      <MyStatusBar
        barStyle={'light-content'}
        backgroundColor={Colorpath.Pagebg}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
        <Loader visible={nonloader || AuthReducer?.status == 'Auth/loginRequest' || AuthReducer?.status == 'Auth/loginsiginRequest' || AuthReducer?.status == 'Auth/verifyRequest'} />
        {/* <Loader visible={AuthReducer?.status == 'Auth/loginRequest' || nonloader || AuthReducer?.status == 'Auth/loginsiginRequest' || AuthReducer?.status == 'Auth/verifyRequest'} /> */}
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ paddingBottom: normalize(80) }}>
            <View style={Platform.OS === 'ios' ? { top: normalize(10), justifyContent: "center", alignItems: "center" } : { top: normalize(40), justifyContent: "center", alignItems: "center" }}>
              <Image source={Imagepath.eMedfulllogo} style={{ alignSelf: "center", height: normalize(40), width: normalize(212), resizeMode: "contain" }} />
            </View>
            <View style={[styles.headerContainer]}>
              <Text style={styles.headerText}>{"Hello Again!"}</Text>
              <Text style={styles.subHeaderText}>
                {"Welcome back we’re always \n    happy to see you again"}
              </Text>
            </View>
            <View>
              <View style={{ paddingHorizontal: normalize(20), paddingVertical: normalize(15) }}>

                <View style={styles.content}>
                  <View style={styles.formContainer}>
                    {mobile ? <InputField
                      ref={phoneInputRef}
                      label="Email / Cell Number"
                      value={mobileHd}
                      onChangeText={(val) => {
                        if (phoneCountryCode == "+91") {
                          const formatted = formatIndianPhoneNumber(val);
                          setMobileHd(formatted);
                          const rawDigits = formatted.replace(/\D/g, '');
                          handleInputChange(rawDigits);
                          setEmail(rawDigits);
                        } else if (phoneCountryCode == "+1") {
                          const formatted = formatPhoneNumber(val);
                          setMobileHd(formatted);
                          const rawDigits = formatted.replace(/\D/g, '');
                          handleInputChange(rawDigits);
                          setEmail(rawDigits);
                        }
                      }}
                      placeholder=""
                      placeholderTextColor="#949494"
                      keyboardType="number-pad"
                      showCountryCode={true}
                      countryCode={phoneCountryCode || "+91"}
                      maxlength={14}
                      labelStyle={{ top: 10 }}
                    /> : <InputField
                      label="Email / Cell Number"
                      value={email}
                      onChangeText={handleInputChange}
                      placeholder=""
                      placeholderTextColor="#949494"
                      keyboardType="default"
                      showCountryCode={false}
                      maxlength={100}
                    />}
                    {isValidEmail && (
                      <View style={{ bottom: normalize(10) }}>
                        <Text
                          style={{
                            fontFamily: Fonts.InterRegular,
                            fontSize: 12,
                            color: 'red',
                          }}>
                          {"Please enter a valid email address (e.g., abc@gmail.com)"}
                        </Text>
                      </View>
                    )}
                    {isMobile && (
                      <View style={{ bottom: normalize(10) }}>
                        <Text
                          style={{
                            fontFamily: Fonts.InterRegular,
                            fontSize: 12,
                            color: 'red',
                          }}>
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
                      <View style={{ bottom: normalize(10) }}>
                        <Text
                          style={{
                            fontFamily: Fonts.InterRegular,
                            fontSize: 12,
                            color: 'red',
                          }}>
                          {"Please enter your password to continue"}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                {(!mobile && phoneCountryCode) ? <View style={[styles.forgotContainer, { bottom: normalize(5) }]}>
                  <TouchableOpacity onPress={() => { props.navigation.navigate("ForgotMPIN", { phoneCode: phoneCountryCode }) }}>
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
                text={isPasswordFieldVisible ? "Sign In" : "Proceed"}
                color={Colorpath.white}
                fontSize={18}
                fontFamily={Fonts.InterSemiBold}
                marginTop={normalize(0)}
                disabled={!isButtonEnabled}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 1, marginTop: normalize(10) }}>
              <View>
                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#000000" }}>
                  {"New user?"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => {
                if (phoneCountryCode) {
                  props.navigation.navigate('SignUp', { phoneCd: { phoneCd: phoneCountryCode } });
                } else {
                  setInputBlocked(true);
                }
              }}>
                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: Colorpath.ButtonColr, fontWeight: "bold" }}>
                  {" Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === 'ios' ? normalize(50) : normalize(80)
    // flex: 0.6,
  },
  headerText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 32,
    color: "#000000",
    fontWeight: "bold"
  },
  subHeaderText: {
    marginTop: normalize(10),
    color: "#666666",
    fontSize: 18,
    fontFamily: Fonts.InterRegular,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: normalize(15),
    alignItems: 'center',
  },
  forgotContainer: {
    // marginTop: normalize(10),
    alignSelf: 'center',
    width: normalize(280),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
    color: Colorpath.ButtonColr,
  },
  input: {
    height: normalize(45),
    width: normalize(280), padding: 10,
    backgroundColor: Colorpath.white,
    borderRadius: normalize(9),
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: normalize(5),
    elevation: normalize(5),
    fontFamily: Fonts.InterMedium,
    fontSize: 15,
    color: "#000"
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },
  formContainer: {
    flex: 1,
    paddingRight: normalize(0),
  }
});

export default Login;
