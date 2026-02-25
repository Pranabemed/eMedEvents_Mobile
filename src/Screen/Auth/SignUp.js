import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, ScrollView, Alert, StyleSheet, Image, BackHandler } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { emailexistRequest } from '../../Redux/Reducers/AuthReducer';
import { useDispatch, useSelector } from 'react-redux';
import showErrorAlert from '../../Utils/Helpers/Toast';
import TextFieldIn from '../../Components/Textfield';
import TickMark from 'react-native-vector-icons/Ionicons';
import TextInputPlain from '../../Components/PlainyTextInput';
import Imagepath from '../../Themes/Imagepath';
import { processPhoneNumber } from '../../Utils/Helpers/PhoneNormalize';
import InputField from '../../Components/CellInput';
let status = "";
import { SafeAreaView } from 'react-native-safe-area-context'
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
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  console.log(AuthReducer, "Auth========", props?.route?.params?.phoneCd)
  const CreateAccount = () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;;
    const validate = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;
    const mobilePattern = /^\d{10}$/;
    if (!fname || fname?.length < 3) {
      showErrorAlert("Please enter your first name.");
    } else if (!lname || lname?.length < 3) {
      showErrorAlert("Please enter your last name.");
    } else if (!cellno) {
      showErrorAlert("Please enter your cell number.");
    } else if (!mobilePattern.test(cellno)) {
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
      props.navigation.navigate("AllSpecial", {
        Alldata: {
          "first_name": fname.trim(),
          "last_name": lname.trim(),
          "phone": cellno.trim(),
          "email": email.trim(),
          "password": password.trim(),
          "countryCode": props?.route?.params?.phoneCd?.phoneCd
        }
      })
    }
  }
  const handleInput = (val) => {
    setPassword(val);
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (regexPass.test(val)) {
      setError(false);
    }
  };

  const setMobileNo = (text) => {
    setCellno(text);
    setGettrue(true);
    const mobilePattern = /^\d{10}$/;
    if (mobilePattern.test(text)) {
      let obj = { phone: `${props?.route?.params?.phoneCd?.phoneCd}${text}` };
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
  console.log(gettrue, "hgfgfgj----------", cellno)
  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/emailexistRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/emailexistSuccess':
        status = AuthReducer.status;
        console.log(AuthReducer?.emailexistResponse?.success === false, "email existwww=====")
        if (AuthReducer?.emailexistResponse?.success === false) {
          if (gettrue) {
            Alert.alert('eMedEvents', 'This cell number already exists in eMedEvents.', [
              {
                text: 'Cancel', onPress: () => {
                  setMobileHd("");
                  setCellno("")
                }, style: 'cancel'
              },
              { text: 'OK', onPress: () => props.navigation.navigate("Login", { "phone": { phone: cellno, countryCode: props?.route?.params?.phoneCd?.phoneCd, "pranab": "ff" } }) },
            ]);
          } else if (!gettrue) {
            Alert.alert('eMedEvents', 'This email already exists in eMedEvents.', [
              { text: 'Cancel', onPress: () => setEmail(""), style: 'cancel' },
              { text: 'OK', onPress: () => props.navigation.navigate("Login", { "email": email }) },
            ]);
          }
        }
        break;
      case 'Auth/emailexistFailure':
        status = AuthReducer.status;
        break;
    }
  }
  const backSingUp = () => {
    props.navigation.goBack();
  }
  useEffect(() => {
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
      <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ paddingBottom: normalize(60) }}>
            <View style={Platform.OS === 'ios' ? { top: normalize(10), justifyContent: "center", alignItems: "center" } : { top: normalize(40), justifyContent: "center", alignItems: "center" }}>
              <Image source={Imagepath.eMedfulllogo} style={{ alignSelf: "center", height: normalize(40), width: normalize(212), resizeMode: "contain" }} />
            </View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>{"Sign Up"}</Text>
              <Text style={styles.subHeaderText}>
                {"Please sign up to continue"}
              </Text>
            </View>
            <View>
              <View style={{ paddingHorizontal: normalize(20), paddingVertical: normalize(10) }}>

                <View style={{
                  flexDirection: 'row',
                  flex: 1
                }}>
                  <View style={{
                    flex: 1,
                    paddingRight: normalize(0)
                  }}>
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
                  <View style={{ paddingHorizontal: normalize(1), bottom: normalize(10) }}>
                    <Text
                      style={{
                        fontFamily: Fonts.InterRegular,
                        fontSize: 12,
                        color: 'red',
                      }}>
                      {"Please enter your first name."}
                    </Text>
                  </View>
                )}
                <View style={{
                  flexDirection: 'row',
                  flex: 1
                }}>
                  <View style={{
                    flex: 1,
                    paddingRight: normalize(0)
                  }}>
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
                  <View style={{ paddingHorizontal: normalize(1), bottom: normalize(10) }}>
                    <Text
                      style={{
                        fontFamily: Fonts.InterRegular,
                        fontSize: 12,
                        color: 'red',
                      }}>
                      {"Please enter your last name."}
                    </Text>
                  </View>
                )}
                <View style={{
                  flexDirection: 'row',
                  flex: 1
                }}>
                  <View style={{
                    flex: 1,
                    paddingRight: normalize(0)
                  }}>
                    <InputField
                      label="Cell Number*"
                      value={mobileHd}
                      onChangeText={(text) => {
                        if (props?.route?.params?.phoneCd?.phoneCd == "+1") {
                          const formatted = formatPhoneNumber(text);
                          setMobileHd(formatted);
                          const rawDigits = formatted.replace(/\D/g, '');
                          setMobileNo(rawDigits);
                        } else if (props?.route?.params?.phoneCd?.phoneCd == "+91") {
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
                      countryCode={props?.route?.params?.phoneCd?.phoneCd}
                      maxlength={14}
                    />
                  </View>
                </View>
                {isValidWhatsappNodd && (
                  <View style={{ paddingHorizontal: normalize(1), bottom: normalize(10) }}>
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
                <View style={{
                  flexDirection: 'row',
                  flex: 1
                }}>
                  <View style={{
                    flex: 1,
                    paddingRight: normalize(0)
                  }}>
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
                  <View style={{ paddingHorizontal: normalize(1), bottom: normalize(10) }}>
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
                <View style={{
                  flexDirection: 'row',
                  flex: 1
                }}>
                  <View style={{
                    flex: 1,
                    paddingRight: normalize(0)
                  }}>
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
                  <View style={{ paddingHorizontal: normalize(1), bottom: normalize(10) }}>
                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "red" }}>
                      {"Password must be 8+ chars, with 1 uppercase , 1 special character and 1 number."}
                    </Text>
                  </View>}
              </View>
            </View>
            <View style={{ paddingHorizontal: normalize(21) }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row", gap: normalize(10) }}>
                  <TouchableOpacity onPress={() => { setChecked(!checked) }}>
                    {!checked ? <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colorpath.ButtonColr, borderColor: Colorpath.ButtonColr, height: normalize(20), width: normalize(20), borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }}>
                      <TickMark name="checkmark" color={Colorpath.white} size={20} />
                    </View> :
                      <View style={{ borderColor: Colorpath.black, height: normalize(20), width: normalize(20), borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }} />
                    }
                  </TouchableOpacity>

                  <View style={{ flexDirection: "column" }}>
                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 13, color: "#666666" }}>
                      {"I agree with eMedEvents"}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      <TouchableOpacity onPress={(() => props.navigation.navigate("TermsAndConditions"))}>
                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: Colorpath.ButtonColr }}>
                          {"Terms of Use"}
                        </Text>
                      </TouchableOpacity>
                      <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#666666" }}>
                        {"and"}
                      </Text>
                      <TouchableOpacity onPress={(() => props.navigation.navigate("PrivacyPolicy"))}>
                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: Colorpath.ButtonColr }}>
                          {"Privacy Policy"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: normalize(15) }}>
                <View style={{ flexDirection: "row", gap: normalize(10) }}>
                  <TouchableOpacity onPress={() => { setSocheck(!socheck) }} >
                    {!socheck ? <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colorpath.ButtonColr, borderColor: Colorpath.ButtonColr, height: normalize(20), width: normalize(20), borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }}>
                      <TickMark name="checkmark" color={Colorpath.white} size={20} />
                    </View> :
                      <View style={{ height: normalize(20), width: normalize(20), borderColor: Colorpath.black, borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }} />
                    }
                  </TouchableOpacity>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#666666" }}>
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
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 1, marginTop: normalize(10) }}>
              <View>
                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#000000" }}>
                  {"Already a member?"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => { props.navigation.navigate('Login') }}>
                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: Colorpath.ButtonColr, fontWeight: "bold" }}>
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

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === 'ios' ? normalize(40) : normalize(60)
    // flex: 0.6
    // backgroundColor:"red"
  },
  headerText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 32,
    color: "#000000",
    fontWeight: "bold"

  },
  subHeaderText: {
    paddingVertical: normalize(10),
    color: "#666666",
    fontSize: 18,
    fontFamily: Fonts.InterRegular,
    textAlign: 'center',
  },
  inputContainer: {
    alignItems: 'center',
    marginTop: normalize(20)
  },
  forgotContainer: {
    marginTop: normalize(10),
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
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(16),
  },
});

export default SignUp;
