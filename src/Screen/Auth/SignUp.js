/**
 * Sign up screen module. Renders a React Native screen or a screen-scoped support component. Exported members: SignUp, detectCountry, CreateAccount, handleInput, setMobileNo, setEmailExist, formatPhoneNumber, formatIndianPhoneNumber, backSingUp, onBackPress, styles.
 */

import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, ScrollView, Alert, Image, BackHandler } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { clearEmailexistState, emailexistRequest } from '../../Redux/Reducers/AuthReducer';
import { useDispatch, useSelector } from 'react-redux';
import showErrorAlert from '../../Utils/Helpers/Toast';
import TextFieldIn from '../../Components/Textfield';
import TickMark from 'react-native-vector-icons/Ionicons';
import TextInputPlain from '../../Components/PlainyTextInput';
import Imagepath from '../../Themes/Imagepath';
import { processPhoneNumber } from '../../Utils/Helpers/PhoneNormalize';
import InputField from '../../Components/CellInput';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native';
import { writeNonUsaFlowState } from '../../Utils/Helpers/nonUsaFlow';
import { getPublicIP, getCountryAndDialCode } from '../../Utils/Helpers/IPServer';
import styles from './SignUp.styles';

/**
 * Reusable SignUp component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const SignUp = (props) => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("")
  const [cellno, setCellno] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [socheck, setSocheck] = useState(false);
  const [error, setError] = useState(false);
  const [gettrue, setGettrue] = useState(false);
  const [mobileHd, setMobileHd] = useState("");
  const [signupCountryCode, setSignupCountryCode] = useState(props?.route?.params?.phoneCd?.phoneCd || '');
  const [isNonUsaFlow, setIsNonUsaFlow] = useState(
    props?.route?.params?.phoneCd?.phoneCd 
      ? String(props?.route?.params?.phoneCd?.phoneCd).trim() !== "+1"
      : true
  );
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  console.log(AuthReducer, "Auth========", props?.route?.params?.phoneCd)
  useEffect(() => {
        /**
 * Detect country utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const detectCountry = async () => {
      try {
        const geoInfo = await getCountryAndDialCode();
        if (geoInfo) {
          const ipCountry = String(geoInfo.country || '').trim().toUpperCase();
          const isNonUsaIp = ipCountry && ipCountry !== 'US' && ipCountry !== 'USA';
          setIsNonUsaFlow(isNonUsaIp);
          if (!signupCountryCode) {
            setSignupCountryCode(geoInfo.dialCode || '+1');
          }
        }
      } catch (error) {
        console.log('SignUp geo lookup failed', error);
      }
    };
    detectCountry();
  }, []);
    /**
 * Create account component.
 * @returns {void}
 */
const CreateAccount = () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;;
    const validate = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
    const mobilePattern = /^\d{10}$/;
    if (!fname || fname?.length < 3) {
      showErrorAlert("Please enter your first name.");
    } else if (!lname || lname?.length < 3) {
      showErrorAlert("Please enter your last name.");
    } else if (!isNonUsaFlow && !cellno) {
      showErrorAlert("Please enter your cell number.");
    } else if (!isNonUsaFlow && !mobilePattern.test(cellno)) {
      showErrorAlert("Cell number must be 10 digits ");
    } else if (!email) {
      showErrorAlert("Please enter your email address.");
    } else if (!validate.test(email)) {
      showErrorAlert("Please enter a valid email address (e.g., abc@gmail.com)");
    } else if (!password) {
      showErrorAlert("Please create a password.");
    } else if (!regex.test(password)) {
      setError(true);
      // showErrorAlert("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
    } else if (checked) {
      showErrorAlert("You must accept the Terms & Privacy Policy to continue.");
    } else {
      if (isNonUsaFlow) {
        writeNonUsaFlowState({
          userType: 'non_usa',
          isNonUsa: true,
          signupCompleted: false,
          professionCompleted: false,
          emailVerified: false,
          signupDraft: {
            first_name: fname.trim(),
            last_name: lname.trim(),
            email: email.trim(),
            password: password.trim(),
            countryCode: signupCountryCode || '',
          },
        });
      }
      props.navigation.navigate("AllSpecial", {
        Alldata: {
          "first_name": fname.trim(),
          "last_name": lname.trim(),
          "phone": isNonUsaFlow ? "" : cellno.trim(),
          "email": email.trim(),
          "password": password.trim(),
          "countryCode": signupCountryCode,
          "isNonUsaUser": isNonUsaFlow,
        }
      })
    }
  }
    /**
 * Handles input.
 * @param {*} val - Input value.
 * @returns {void}
 */
const handleInput = (val) => {
    setPassword(val);
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (regexPass.test(val)) {
      setError(false);
    }
  };

    /**
 * Set mobile no utility.
 * @param {*} text - Input value.
 * @returns {void}
 */
const setMobileNo = (text) => {
    setCellno(text);
    setGettrue(true);
    const mobilePattern = /^\d{10}$/;
    if (mobilePattern.test(text)) {
      let obj = { phone: `${signupCountryCode}${text}` };
      connectionrequest()
        .then(() => {
          dispatch(emailexistRequest(obj));
        })
        .catch(err => {
          showErrorAlert("Please connect to the Internet", err);
        });
    } else {
      console.log("Invalid cell no");
    }
  }
    /**
 * Set email exist utility.
 * @param {*} text - Input value.
 * @returns {void}
 */
const setEmailExist = (text) => {
    setEmail(text);
    setGettrue(false);
    const emailPattern = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
    console.log(emailPattern, "emailPattern-----")
    if (emailPattern.test(text)) {
      let obj = { email: text };
      connectionrequest()
        .then(() => {
          dispatch(emailexistRequest(obj));
        })
        .catch(err => {
          showErrorAlert("Please connect to the Internet", err);
        });
    } else {
      console.log("Invalid email format");
    }
  }
    /**
 * Formats phone number.
 * @param {*} input - Input value.
 * @returns {*}
 */
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
  console.log(gettrue, "hgfgfgj----------", cellno)
  const lastHandledStatusRef = React.useRef("");
  useFocusEffect(
    React.useCallback(() => {
      lastHandledStatusRef.current = "";
      dispatch(clearEmailexistState());
      return () => {
        lastHandledStatusRef.current = "";
      };
    }, [dispatch])
  );
  useEffect(() => {
    if (AuthReducer.status === 'Auth/emailexistSuccess' && lastHandledStatusRef.current !== "Auth/emailexistSuccess") {
      if (AuthReducer?.emailexistResponse?.success === false) {
        lastHandledStatusRef.current = "Auth/emailexistSuccess";
        const isPhoneCheck = AuthReducer?.emailexistType === 'phone';
        if (isPhoneCheck) {
          Alert.alert('eMedEvents', 'This cell number already exists in eMedEvents.', [
            {
              text: 'Cancel',               /**
 * On press utility.
 * @returns {void}
 */
onPress: () => {
                setMobileHd("");
                setCellno("");
                dispatch(clearEmailexistState());
                lastHandledStatusRef.current = "";
              }, style: 'cancel'
            },
            {
              text: 'OK',               /**
 * On press utility.
 * @returns {void}
 */
onPress: () => {
                dispatch(clearEmailexistState());
                lastHandledStatusRef.current = "";
                props.navigation.navigate("Login", { "phone": { phone: cellno, countryCode: signupCountryCode, "pranab": "ff" }, isNonUsaUser: isNonUsaFlow })
              }
            },
          ]);
        } else if (AuthReducer?.emailexistType === 'email') {
          Alert.alert('eMedEvents', 'This email already exists in eMedEvents.', [
            {
              text: 'Cancel',               /**
 * On press utility.
 * @returns {void}
 */
onPress: () => {
                setEmail("");
                dispatch(clearEmailexistState());
                lastHandledStatusRef.current = "";
              }, style: 'cancel'
            },
            {
              text: 'OK',               /**
 * On press utility.
 * @returns {void}
 */
onPress: () => {
                dispatch(clearEmailexistState());
                lastHandledStatusRef.current = "";
                props.navigation.navigate("Login", { "email": email, isNonUsaUser: isNonUsaFlow })
              }
            },
          ]);
        }
      }
    } else if (AuthReducer.status === 'Auth/emailexistRequest') {
      lastHandledStatusRef.current = "";
    }
  }, [AuthReducer.status, AuthReducer.emailexistResponse, AuthReducer.emailexistType, cellno, email]);
    /**
 * Back sing up utility.
 * @returns {void}
 */
const backSingUp = () => {
    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
    } else {
      props.navigation.navigate('Login', { isNonUsaUser: isNonUsaFlow });
    }
  }
  useEffect(() => {
        /**
 * On back press utility.
 * @returns {boolean}
 */
const onBackPress = () => {
      backSingUp();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => backHandler.remove();
  }, []);
  console.log(cellno?.length > 0 && cellno !== 10, "=========poooo")
  const cellNoRegexwpdd = /^\d{10}$/;
  const isValidWhatsappNodd = cellno?.length > 0 && !cellNoRegexwpdd.test(cellno);
  const validateEmail = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
  const isValidEmail = email?.length > 0 && !validateEmail.test(email);
  const passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
  const isPasswordValid = password?.length > 0 && !passwordregex.test(password);
  useLayoutEffect(() => {
    props.navigation.setOptions({ gestureEnabled: false });
  }, []);
  return (
    <>
      <MyStatusBar
        barStyle={'light-content'}
        backgroundColor={Colorpath.Pagebg}
      />
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={styles.scrollContent}>
            <View style={[styles.logoContainer, Platform.OS === 'ios' ? styles.logoContainerIos : styles.logoContainerAndroid]}>
              <Image source={Imagepath.eMedfulllogo} style={styles.logoImage} />
            </View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>{"Sign Up"}</Text>
              <Text style={styles.subHeaderText}>
                {"Please sign up to continue"}
              </Text>
            </View>
            <View>
              <View style={styles.sectionContainer}>

                <View style={styles.inputRow}>
                  <View style={styles.inputColumn}>
                    <InputField
                      label='First Name*'
                      value={fname}
                      onChangeText={setFname}
                      placeholder=''
                      placeholderTextColor="#949494"
                      keyboardType="default"
                      showCountryCode={false}
                      maxlength={100}
                    />
                  </View>
                </View>
                {fname && fname?.length < 3 && (
                  <View style={styles.validationContainer}>
                    <Text style={styles.validationText}>
                      {"Please enter your first name."}
                    </Text>
                  </View>
                )}
                <View style={styles.inputRow}>
                  <View style={styles.inputColumn}>
                    <InputField
                      label='Last Name*'
                      value={lname}
                      onChangeText={setLname}
                      placeholder=''
                      placeholderTextColor="#949494"
                      keyboardType="default"
                      showCountryCode={false}
                      maxlength={100}
                    />
                  </View>
                </View>
                {lname && lname?.length < 3 && (
                  <View style={styles.validationContainer}>
                    <Text style={styles.validationText}>
                      {"Please enter your last name."}
                    </Text>
                  </View>
                )}
                {!isNonUsaFlow && (
                  <View style={styles.inputRow}>
                    <View style={styles.inputColumn}>
                      <InputField
                        label="Cell Number*"
                        value={mobileHd}
                        onChangeText={(text) => {
                          if (signupCountryCode == "+1") {
                            const formatted = formatPhoneNumber(text);
                            setMobileHd(formatted);
                            const rawDigits = formatted.replace(/\D/g, '');
                            setMobileNo(rawDigits);
                          } else if (signupCountryCode == "+91") {
                            const formatted = formatIndianPhoneNumber(text);
                            setMobileHd(formatted);
                            const rawDigits = formatted.replace(/\D/g, '');
                            setMobileNo(rawDigits);
                          }
                        }}
                        placeholder=""
                        placeholderTextColor="#949494"
                        keyboardType="phone-pad"
                        showCountryCode={true}
                        countryCode={signupCountryCode}
                        maxlength={14}
                      />
                    </View>
                  </View>
                )}
                {!isNonUsaFlow && isValidWhatsappNodd && (
                  <View style={styles.validationContainer}>
                    <Text style={styles.validationText}>
                      {"Please enter a valid cell number"}
                    </Text>
                  </View>
                )}
                <View style={styles.inputRow}>
                  <View style={styles.inputColumn}>
                    <InputField
                      label='Email Address*'
                      value={email}
                      onChangeText={setEmailExist}
                      placeholder=''
                      placeholderTextColor="#949494"
                      keyboardType="default"
                      showCountryCode={false}
                      maxlength={100}
                    />
                  </View>
                </View>
                {isValidEmail && (
                  <View style={styles.validationContainer}>
                    <Text style={styles.validationText}>
                      {"Please enter a valid email address (e.g., abc@gmail.com)"}
                    </Text>
                  </View>
                )}
                <View style={styles.inputRow}>
                  <View style={styles.inputColumn}>
                    <InputField
                      label="Password*"
                      value={password}
                      onChangeText={handleInput}
                      placeholder=""
                      placeholderTextColor="#949494"
                      isPassword={true}
                      keyboardType="default"
                      showCountryCode={false}
                    />
                  </View>
                </View>
                {(isPasswordValid || error && password) &&
                  <View style={styles.validationContainer}>
                    <Text style={styles.validationText}>
                      {"Password must be 8+ chars, with 1 uppercase , 1 special character and 1 number."}
                    </Text>
                  </View>}
              </View>
            </View>
            <View style={styles.termsContainer}>
              <View style={styles.termsRow}>
                <View style={styles.termsInnerRow}>
                  <TouchableOpacity onPress={() => { setChecked(!checked) }}>
                    {!checked ? <View style={styles.checkboxChecked}>
                      <TickMark name="checkmark" color={Colorpath.white} size={20} />
                    </View> :
                      <View style={styles.checkboxEmpty} />
                    }
                  </TouchableOpacity>

                  <View style={styles.consentColumn}>
                    <Text style={styles.consentText}>
                      {"I agree with eMedEvents"}
                    </Text>
                    <View style={styles.consentLinksRow}>
                      <TouchableOpacity onPress={(() => props.navigation.navigate("TermsAndConditions"))}>
                        <Text style={styles.consentLinkText}>
                          {"Terms of Use"}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.consentBodyText}>
                        {"and"}
                      </Text>
                      <TouchableOpacity onPress={(() => props.navigation.navigate("PrivacyPolicy"))}>
                        <Text style={styles.consentLinkText}>
                          {"Privacy Policy"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.optInRow}>
                <View style={styles.termsInnerRow}>
                  <TouchableOpacity onPress={() => { setSocheck(!socheck) }} >
                    {!socheck ? <View style={styles.checkboxChecked}>
                      <TickMark name="checkmark" color={Colorpath.white} size={20} />
                    </View> :
                      <View style={styles.checkboxEmpty} />
                    }
                  </TouchableOpacity>
                  <View style={styles.optInTextContainer}>
                    <Text style={styles.optInText}>
                      {"I agree to receive messages and OTPs for\nsecure account access from eMedEvents."}
                    </Text>
                  </View>

                </View>
              </View>
            </View>
            <TouchableOpacity>
              <Buttons
                onPress={CreateAccount}
                height={normalize(45)}
                width={normalize(280)}
                backgroundColor={Colorpath.ButtonColr}
                borderRadius={normalize(9)}
                text="Proceed"
                color={Colorpath.white}
                fontSize={18}
                fontFamily={Fonts.InterSemiBold}
                marginTop={normalize(20)}
              />
            </TouchableOpacity>
            <View style={styles.footerRow}>
              <View>
                <Text style={styles.footerText}>
                  {"Already a member?"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => { props.navigation.navigate('Login') }}>
                <Text style={styles.footerLinkText}>
                  {"Log In"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

/**
 * Sign up default export.
 *
 * @returns {*}
 */
export default SignUp;
