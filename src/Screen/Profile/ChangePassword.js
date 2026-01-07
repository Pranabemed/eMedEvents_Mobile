import { View, Text, Platform, KeyboardAvoidingView, ScrollView, PermissionsAndroid } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import PageHeader from '../../Components/PageHeader';
import Loader from '../../Utils/Helpers/Loader';
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import normalize from '../../Utils/Helpers/Dimen';
import InputField from '../../Components/CellInput';
import Buttons from '../../Components/Button';
import Fonts from '../../Themes/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { changePasswordRequest } from '../../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { allreducerRequest, logoutRequest } from '../../Redux/Reducers/AuthReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context'
import { getCountryCallingCode } from 'libphonenumber-js';
import Geolocation from 'react-native-geolocation-service';
const GOOGLE_API_KEY = 'AIzaSyBDnBivN-fdP6JxOcQFIyvhxIJSArru6Nk';
let status1 = "";
const ChangePassword = (props) => {

    const [oldpass, setOldpass] = useState("");
    const [newpass, setNewpass] = useState("");
    const [cnfmpass, setCnfmpass] = useState("");
    const passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    const isPasswordValid = newpass?.length > 0 && passwordregex.test(newpass);
    const cnfrmPasswordValid = cnfmpass?.length > 0 && passwordregex.test(cnfmpass);
    const isPasswordValidch = newpass?.length > 0 && !passwordregex.test(newpass);
    const cnfrmPasswordValidch = cnfmpass?.length > 0 && !passwordregex.test(cnfmpass);
    const passwordsMatch = newpass === cnfmpass;
    const dontMatch = oldpass === newpass;
    const oldPasswordExists = oldpass?.length > 0;
    const final = !(oldPasswordExists && isPasswordValid && cnfrmPasswordValid && passwordsMatch && !dontMatch);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const dispatch = useDispatch();
    const clearAllAsyncStorage = async () => {
        try {
            await AsyncStorage.removeItem('lastActiveTab')
            await AsyncStorage.removeItem('WHOLEDATA');
            await AsyncStorage.removeItem('PRODATA');
            await AsyncStorage.clear();
            console.log('All AsyncStorage keys cleared successfully!');
        } catch (e) {
            console.error('Error clearing AsyncStorage:', e);
        }
    };
    const Passback = () => {
        clearAllAsyncStorage()
            .then(() => dispatch(logoutRequest()))
            .then(() => dispatch(allreducerRequest({ "obj": "" })))
            .catch(err => console.log("Logout flow error:", err));
    }
    const finalHit = () => {
        let obj = {
            "current_password": oldpass,
            "new_password": cnfmpass
        }
        connectionrequest()
            .then(() => {
                dispatch(changePasswordRequest(obj))
            })
            .catch((err) => showErrorAlert("Please connect to internet", err))
    }
    if (status1 == '' || DashboardReducer.status != status1) {
        switch (DashboardReducer.status) {
            case 'Dashboard/changePasswordRequest':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/changePasswordSuccess':
                status1 = DashboardReducer.status;
                if (DashboardReducer?.changePasswordResponse?.msg == "Password changed successfully.") {
                    showErrorAlert("Password changed successfully.");
                    Passback()
                }
                console.log(DashboardReducer?.changePasswordResponse, "log-----------");
                break;
            case 'Dashboard/changePasswordFailure':
                status1 = DashboardReducer.status;
                showErrorAlert("Your current password is incorrect.,Please try again !")
                break;
        }
    }
    const backTo = () => {
        props?.navigation.goBack();
    }
    const getCurrentLocation = async () => {
          try {
              if (Platform.OS === 'ios') {
                  const status = await Geolocation.requestAuthorization('whenInUse');
                  if (status !== 'granted') {
                      throw { code: 1, message: 'Location permission denied' };
                  }
              }
              const position = await new Promise((resolve, reject) => {
                  let timeoutFallback;
                  Geolocation.getCurrentPosition(
                      resolve,
                      (error) => {
                          // Fallback to network-based location on Wi-Fi
                          if (error.code == 3 || error.code == 2) { // TIMEOUT or POSITION_UNAVAILABLE
                              console.log('Trying network-based location...');
                              Geolocation.getCurrentPosition(
                                  resolve,
                                  (fallbackError) => {
                                      clearTimeout(timeoutFallback);
                                      reject(fallbackError);
                                  },
                                  {
                                      enableHighAccuracy: false,
                                      timeout: 25000, // Longer timeout for network-based
                                      maximumAge: 0
                                  }
                              );
                          } else {
                              reject(error);
                          }
                      },
                      {
                          enableHighAccuracy: true,
                          timeout: 15000,
                          maximumAge: 10000
                      }
                  );
  
                  // Additional timeout safety
                  timeoutFallback = setTimeout(() => {
                      reject({ code: 3, message: 'Final location timeout' });
                  }, 40000);
              });
  
              // 3. Direct Google Geocoding API Call (More Reliable)
              const { latitude, longitude } = position.coords;
              const API_KEY = GOOGLE_API_KEY;
              const response = await fetch(
                  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
              );
  
              if (!response.ok) throw new Error('Geocoding API failure');
  
              const geoData = await response.json();
              if (geoData?.results?.length > 0) {
                  const address = geoData.results[0];
                  const components = address.address_components;
                  const countryComponent = components.find(c => c.types.includes('country'));
                  const isoCountryCode = countryComponent?.short_name || '';
                  if (isoCountryCode) {
                      try {
                          const phoneCode = `+${getCountryCallingCode(isoCountryCode)}`;
                          setCodegt(phoneCode);
                      } catch (error) {
                          console.warn('Phone code error:', error);
                      }
                  }
              }
              console.log(geoData, "geoata----------")
              // 4. Handle Oppo Device Restrictions
              if (!geoData?.results?.length) {
                  if (Platform.OS === 'android') {
                      Alert.alert(
                          'Device Restrictions Detected',
                          'Please ensure:\n1. Battery Optimization is disabled\n2. Background activity allowed\n3. Location set to "Always"',
                          [
                              {
                                  text: 'Open Settings',
                                  onPress: () => Linking.openSettings()
                              },
                              { text: 'Cancel' }
                          ]
                      );
                  }
                  throw new Error('No geocoding results');
              }
              // ... rest of your country code logic ...
  
          } catch (error) {
              console.error('Full Error:', JSON.stringify(error, null, 2));
  
              // Special handling for Oppo timeout issues
              if (error.code == 3 || error.message.includes('timeout')) {
                  Alert.alert(
                      'Connection Issue',
                      'Wi-Fi location detection requires:\n' +
                      '1. Strong network connection\n' +
                      '2. Location enabled in device settings\n' +
                      '3. Google Play Services updated'
                  );
              }
              // Optional: Retry logic
              if (error.code == 3) { // TIMEOUT
                  setTimeout(() => {
                      Alert.alert('Retry?', 'Would you like to try location detection again?', [
                          { text: 'Yes', onPress: () => getCurrentLocation() },
                          { text: 'No' }
                      ]);
                  }, 1000);
              }
          }
      };
  
      useEffect(() => {
          const unsubscribe = props.navigation.addListener('focus', () => {
              getCurrentLocation();
          });
          return unsubscribe;
      }, [props?.navigation]);
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

                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="Change Password"
                            onBackPress={backTo}
                        />
                    ) : (
                        <PageHeader
                            title="Change Password"
                            onBackPress={backTo}
                        />
                    )}
                </View>
                <Loader visible={DashboardReducer?.status == 'Dashboard/changePasswordRequest'} />
                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }} behavior={Platform.OS === 'ios' ? 'height' : undefined}>
                    <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ paddingBottom: normalize(50) }}>
                        <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                            <View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>
                                <View style={{
                                    flex: 1,
                                    paddingRight: normalize(0)
                                }}>
                                    <InputField
                                        label="Current Password*"
                                        value={oldpass}
                                        onChangeText={setOldpass}
                                        placeholder=""
                                        placeholderTextColor="#949494"
                                        isPassword={true}
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxlength={35}
                                    />
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>
                                <View style={{
                                    flex: 1,
                                    paddingRight: normalize(0)
                                }}>
                                    <InputField
                                        label="Enter New Password*"
                                        value={newpass}
                                        onChangeText={setNewpass}
                                        placeholder=""
                                        placeholderTextColor="#949494"
                                        isPassword={true}
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxlength={35}
                                    />
                                </View>
                            </View>
                            {dontMatch && oldPasswordExists ? (
                                <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "red" }}>
                                        {"New password must be different"}
                                    </Text>
                                </View>
                            ) : isPasswordValidch ? (
                                <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "red" }}>
                                        {"New password must be 8+ chars, with 1 uppercase, 1 special character and 1 number."}
                                    </Text>
                                </View>
                            ) : ""}
                            <View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>
                                <View style={{
                                    flex: 1,
                                    paddingRight: normalize(0)
                                }}>
                                    <InputField
                                        label="Confirm Password*"
                                        value={cnfmpass}
                                        onChangeText={setCnfmpass}
                                        placeholder=""
                                        placeholderTextColor="#949494"
                                        isPassword={true}
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxlength={35}
                                    />
                                </View>
                            </View>
                            {cnfrmPasswordValidch &&
                                <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "red" }}>
                                        {"Minimum 8 chars, 1 uppercase and 1 number."}
                                    </Text>
                                </View>}
                            <Buttons
                                onPress={finalHit}
                                height={normalize(45)}
                                width={normalize(310)}
                                backgroundColor={final ? "#DADADA" : Colorpath.ButtonColr}
                                borderRadius={normalize(9)}
                                text="Reset"
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(10)}
                                disabled={final}
                            />
                            <Buttons
                                onPress={backTo}
                                height={normalize(45)}
                                width={normalize(310)}
                                backgroundColor={Colorpath.Pagebg}
                                borderRadius={normalize(9)}
                                text="Cancel"
                                color={Colorpath.ButtonColr}
                                fontSize={14}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(0)}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}

export default ChangePassword