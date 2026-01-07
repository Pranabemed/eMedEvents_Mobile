import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import TextFieldIn from '../../Components/Textfield';
import Fonts from '../../Themes/Fonts';
import { CommonActions } from '@react-navigation/native';
import normalize from '../../Utils/Helpers/Dimen';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import VoiceIcon from 'react-native-vector-icons/MaterialIcons';
const HandleTextInput = ({ showLine, nav, takestate, addit, setFocusedInput, focusedInput }) => {
  const placeholders = [
    "Search for CME/CE courses",
    "Search for your state required courses ",
    "Search for topic",
    "Search for specialty",
    "Search for medical conferences",
    "Search for conferences by location "
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //       setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
  //   }, 3000); 
  //   return () => clearTimeout(timeoutId); 
  // }, [placeholderIndex]);
  return (showLine ? <TouchableOpacity onPress={() => {
    nav.replace("HeaderSearch", {
      taskData: { statid: takestate, creditID: addit },
    })
  }} style={Platform.OS === 'ios' ? { backgroundColor: "#FFFFFF", paddingHorizontal: normalize(10), paddingVertical: normalize(10), marginTop: normalize(10) } : { backgroundColor: "#FFFFFF", paddingVertical: normalize(10), marginTop: normalize(35) }}>
    <TextFieldIn
      height={normalize(38)}
      width={normalize(300)}
      backgroundColor={"#f9fafc"}
      alignSelf={'center'}
      borderRadius={normalize(8)}
      placeholder={placeholders[placeholderIndex]}
      placeholderTextColor={"RGB(170, 170, 170)"}
      fontSize={14}
      fontFamily={Fonts.InterMedium}
      color={"#798492"}
      marginBottom={normalize(3)}
      borderWidth={0.8}
      borderColor={"#DADADA"}
      autoCapitalize="none"
      onPress={''}
      onFocus={() => setFocusedInput("search")}
      onBlur={() => setFocusedInput(null)}
      searchIcon={true}
      leftIcon={SearchIcon}
      leftIconName="search"
      leftIconSize={24}
      leftIconColor="#63748b"
      // shadowColor="#000"
      // shadowOffset={{ height: 2, width: 0 }}
      // shadowOpacity={0.1}
      // shadowRadius={5}
      // elevation={5}
      onPressLeftIcon={() => {
        nav.replace("HeaderSearch", {
          taskData: { statid: takestate, creditID: addit },
        })
      }}
      SearchLeft={() => {
        nav.replace("HeaderSearch", {
          taskData: { statid: takestate, creditID: addit },
        });
      }}
      searchIconName={'keyboard-voice'}
      searchIconColor={"#999"}
      editable={false} />
  </TouchableOpacity> : <TouchableOpacity onPress={() => {
    nav.replace("HeaderSearch", {
      taskData: { statid: takestate, creditID: addit },
    });
  }} style={Platform.OS === 'ios' ? { backgroundColor: "#FFFFFF", paddingHorizontal: normalize(10), paddingVertical: normalize(10), marginTop: normalize(10), justifyContent: "center", alignItems: "center" } : { backgroundColor: "#FFFFFF", paddingVertical: normalize(10), marginTop: normalize(10),justifyContent: "center", alignItems: "center" }}>
    <View
      style={{
        height: normalize(35),
        width: normalize(290),
        borderWidth: 1,
        borderColor: "#DADADA",
        borderRadius: normalize(5),
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9fafc",
        gap: normalize(10),
        paddingHorizontal: normalize(10)
      }}
    >
      <SearchIcon
        name="search"
        color={"#63748b"}
        size={25}
      />
      <Text
        style={{
          fontFamily: Fonts.InterMedium,
          fontSize: 16,
          color: "#798492",
          flex: 1
        }}
      >
        {"Search for CME/CE courses"}
      </Text>

      <VoiceIcon
        name="keyboard-voice"
        color={"#63748b"}
        size={28}
      />
    </View>

    {/* <TextFieldIn
      height={normalize(38)}
      width={normalize(300)}
      backgroundColor={"#f9fafc"}
      alignSelf={'center'}
      borderRadius={normalize(8)}
      placeholder={placeholders[placeholderIndex]}
      placeholderTextColor={"RGB(170, 170, 170)"}
      fontSize={14}
      fontFamily={Fonts.InterMedium}
      color={"#798492"}
      marginBottom={normalize(3)}
      borderWidth={0.8}
      borderColor={"#DADADA"}
      autoCapitalize="none"
      onPress={''}
      onFocus={() => setFocusedInput("search")}
      onBlur={() => setFocusedInput(null)}
      searchIcon={true}
      leftIcon={SearchIcon}
      leftIconName="search"
      leftIconSize={24}
      leftIconColor="#63748b"
      // shadowColor="#000"
      // shadowOffset={{ height: 2, width: 0 }}
      // shadowOpacity={0.1}
      // shadowRadius={5}
      // elevation={5}
      leftIconStyle={{ top: normalize(8) }}
      onPressLeftIcon={() => {
        nav.replace("HeaderSearch", {
          taskData: { statid: takestate, creditID: addit },
        })
      }}
      SearchLeft={() => {
        nav.replace("HeaderSearch", {
          taskData: { statid: takestate, creditID: addit },
        });
      }}
      searchIconName={'keyboard-voice'}
      searchIconColor={"#999"}
      editable={false} /> */}
  </TouchableOpacity>
  )
}

export default HandleTextInput