import { View, Text, FlatList, TouchableOpacity, ScrollView, TextInput, Image, Platform, KeyboardAvoidingView, ActivityIndicator, BackHandler } from 'react-native';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import TextFieldIn from '../../Components/Textfield';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import CustomRadioButton from '../../Components/RadioButton';
import Buttons from '../../Components/Button';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { chooseStatecardRequest } from '../../Redux/Reducers/AuthReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { useIsFocused } from '@react-navigation/native';
import Imagepath from '../../Themes/Imagepath';
import Loader from '../../Utils/Helpers/Loader';
let status = "";
import { SafeAreaView } from 'react-native-safe-area-context'
const ChooseState = (props) => {
  const AuthReducer = useSelector(state => state.AuthReducer);
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [finalverify, setFinalverify] = useState(null);
  const [npilook, setNpilook] = useState(null);
  const [npisave, setNpisave] = useState(null);
  const isFocus = useIsFocused();
  useEffect(() => {
    if (props?.route?.params?.dataVr) {
      setNpilook(props?.route?.params?.dataVr?.dataVr);
      setNpisave(props?.route?.params?.dataVr?.dataVr);
    }
  }, [props?.route?.params?.dataVr])
  useEffect(() => {
    const token_handle = () => {
      setTimeout(async () => {
        const loginHandle_verifyfd = await AsyncStorage.getItem(constants.VERIFYSTATEDATA);
        console.log(loginHandle_verifyfd, "statelicesene=================");
        const jsonObject = JSON.parse(loginHandle_verifyfd);
        setFinalverify(jsonObject);
      }, 100);
    };

    try {
      token_handle();
    } catch (error) {
      console.log(error);
    }
  }, [isFocus]);
  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(chooseStatecardRequest({}))
      })
      .catch((err) => { showErrorAlert("Please connect to internet", err) })
  }, [])
  const transformData = (oldData) => {
    if (Array.isArray(oldData)) {
      return oldData.map(name => name);
    } else if (typeof oldData === 'object') {
      return Object.values(oldData);
    } else {
      return [oldData];
    }
  };
  const userLocation = AuthReducer?.verifymobileResponse?.user?.user_location || finalverify?.user_location;
  const removeLastWord = (text) => {
    const words = text.split(',')[0].trim();
    return words;
  };
  const result = useMemo(() => {
    return userLocation ? removeLastWord(userLocation) : "Alabama, USA";
  }, [userLocation]);
  const SearchCont = text => {
    if (text?.length > 3) {
      let textObj = {
        "zip_code": text
      }
      connectionrequest()
        .then(() => {
          dispatch(chooseStatecardRequest(textObj));
        })
        .catch((err) => {
          showErrorAlert("Please connect to internet", err);
        });
      setSearchText(text);
    } else {
      dispatch(chooseStatecardRequest({}));
      setSearchText(text);
    }
  };
  console.log(npilook, npisave, "fghifh--------")
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    // Simulate 2-second loading time
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);
  const stateAllNPIData = ({ item, index }) => {
    const oldData = item?.specialities || "Family";
    const transformedData = transformData(oldData);
    return (
      <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: normalize(300),
            borderRadius: normalize(10),
            backgroundColor: "#FFFFFF",
            paddingHorizontal: normalize(10),
            paddingVertical: normalize(10),
          }}
        >
          <CustomRadioButton
            label=""
            selected={selectedValue === item}
            onPress={() => {
              setSelectedValue(item);
            }}
          />
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => {
              setSelectedValue(item);
            }} >
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: Fonts.InterSemiBold,
                  fontSize: 20,
                  color: "#000000",
                  fontWeight: "bold",
                  flex: 1,
                  flexWrap: 'wrap',
                  textTransform: "capitalize",
                }}
              >
                {`${item?.firstname ?? ''} ${item?.lastname ?? ''}`}
                {item?.designation && (
                  <Text style={{ textTransform: 'uppercase' }}>
                    {`, ${item.designation}`}
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: Fonts.InterMedium,
                fontSize: 16,
                color: "#999999",
                // fontWeight: "bold",
                flex: 1,
                flexWrap: 'wrap',
                // marginBottom: normalize(8),
              }}
            >
              {transformedData?.length > 0 && transformedData?.map((d) => { return d })}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: Fonts.InterMedium,
                fontSize: 16,
                color: "#999999",
                // fontWeight: "bold",
                flex: 1,
                flexWrap: 'wrap',
                marginBottom: normalize(8),
              }}
            >
              {`${item?.state_name}, ${item?.zipcode}`}
            </Text>
            <View
              style={{
                paddingHorizontal: normalize(10),
                paddingVertical: normalize(8),
                borderRadius: normalize(10),
                backgroundColor: "#CBECFF",
                flexDirection: "column",
              }}
            >
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",

              }}>
                <Text style={{
                  fontFamily: Fonts.InterSemiBold,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#666666",
                  flex: 1,
                  textAlign: 'left'
                }}>
                  {`NPI#`}
                </Text>
                <Text style={{
                  fontFamily: Fonts.InterSemiBold,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#666666",
                  flex: 1,
                }}>
                  {`License#`}
                </Text>
              </View>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <Text style={{
                  fontFamily: Fonts.InterBold,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#263D80",
                  flex: 1
                }}>
                  {item?.npi_number || 'N/A'}
                </Text>
                <Text style={{
                  fontFamily: Fonts.InterBold,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#263D80",
                  flex: 1
                }}>
                  {item?.license_number || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/chooseStatecardRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/chooseStatecardSuccess':
        status = AuthReducer.status;
        setNpisave(AuthReducer?.chooseStatecardResponse?.state_licensures);
        setNpilook(AuthReducer?.chooseStatecardResponse?.state_licensures)
        // console.log(AuthReducer?.chooseStatecardResponse?.state_licensures, "AuthReducer?.chooseStatecardResponse?.state_licensures");
        break;
      case 'Auth/chooseStatecardFailure':
        status = AuthReducer.status;
        break;
    }
  }
  useEffect(() => {
    const onBackPress = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => backHandler.remove();
  }, []);
  useLayoutEffect(() => {
              props.navigation.setOptions({ gestureEnabled: false });
          }, []);
  return (
    <>
      <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
      <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Loader visible={AuthReducer?.status == 'Auth/chooseStatecardRequest'} />
          <View style={Platform.OS === 'ios' ? { top: normalize(10), justifyContent: "center", alignItems: "center" } : { top: normalize(40), marginRight: normalize(10), justifyContent: "center", alignContent: "center" }}>
            <Image
              source={Imagepath.eMedfulllogo}
              style={{ alignSelf: "center", height: normalize(40), width: normalize(212), resizeMode: "contain" }}
            />
          </View>
          <View style={{ marginTop: normalize(70), justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 22, color: '#000000' }}>
              {`Choose your ${props?.route?.params?.dataVr?.Loc || result} State License`}
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: normalize(10),
              alignItems: 'center',
              borderRadius: normalize(9),
              alignSelf: 'center',
              marginTop: normalize(15),
            }}
          >
            <TextFieldIn
              value={searchText}
              onChangeText={SearchCont}
              height={normalize(50)}
              width={normalize(300)}
              backgroundColor={"#f9fafc"}
              alignSelf={'center'}
              borderRadius={normalize(8)}
              placeholder={'Filter results by entering your ZIP Code'}
              placeholderTextColor={"RGB(170, 170, 170)"}
              fontSize={normalize(11)}
              fontFamily={Fonts.InterMedium}
              color={"#798492"}
              marginTop={normalize(5)}
              autoCapitalize="none"
              onPress={''}
              searchIcon={true}
              borderColor={"#DADADA"}
              borderWidth={0.8}
              // shadowColor="#000"
              // shadowOffset={{ height: 2, width: 0 }}
              // shadowOpacity={0.1}
              // shadowRadius={5}
              // elevation={5}
              paddingHorizontal={normalize(5)}
              searchIconName="search"
              searchIconColor={"#999999"}
            />
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: normalize(80) }}>
            <View>
              <FlatList
                data={npisave}
                renderItem={stateAllNPIData}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={showLoader ? <ActivityIndicator style={{ marginTop: normalize(10) }} size={"small"} color={"green"} /> :
                  <Text
                    style={{
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      color: Colorpath.grey,
                      fontWeight: 'bold',
                      fontFamily: Fonts.InterMedium,
                      fontSize: normalize(20),
                      paddingTop: normalize(30),
                    }}
                  >
                    No data found
                  </Text>
                }
              />
            </View>
            <TouchableOpacity onPress={() => { props.navigation.navigate("CreateStateInfor",{newData:"yes"}) }} style={{ paddingVertical: normalize(10), paddingHorizontal: normalize(10), justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: Colorpath.ButtonColr }}>
                {"Don’t see your name?"}
              </Text>
            </TouchableOpacity>
            <Buttons
              onPress={() => { props.navigation.navigate("StateInformation", { "InvokedData": selectedValue }) }}
              height={normalize(45)}
              width={normalize(300)}
              backgroundColor={selectedValue ? Colorpath.ButtonColr : "#CCC"}
              borderRadius={normalize(9)}
              text={"Submit"}
              color={Colorpath.white}
              fontSize={18}
              fontFamily={Fonts.InterSemiBold}
              marginTop={normalize(30)}
              disabled={!selectedValue}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default ChooseState;
