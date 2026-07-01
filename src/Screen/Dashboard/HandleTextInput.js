/**
 * Handle text input screen module. Renders a React Native screen or a screen-scoped support component. Exported members: HandleTextInput.
 */

import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import TextFieldIn from '../../Components/Textfield';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import VoiceIcon from 'react-native-vector-icons/MaterialIcons';
import styles from './HandleTextInput.styles';

/**
 * Reusable HandleTextInput component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const HandleTextInput = ({ showLine, nav, takestate, addit, setFocusedInput, focusedInput }) => {
  return (showLine ? <TouchableOpacity onPress={() => {
    nav.navigate("HeaderSearch", {
      taskData: { statid: takestate, creditID: addit },
    })
  }} style={[styles.searchWrapper, Platform.OS === 'ios' ? styles.searchWrapperIos : styles.searchWrapperAndroid]}>
    <TextFieldIn
      height={normalize(38)}
      width={normalize(300)}
      backgroundColor={"#f9fafc"}
      alignSelf={'center'}
      borderRadius={normalize(8)}
      placeholder={"Search for CME/CE courses"}
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
        nav.navigate("HeaderSearch", {
          taskData: { statid: takestate, creditID: addit },
        })
      }}
      SearchLeft={() => {
        nav.navigate("HeaderSearch", {
          taskData: { statid: takestate, creditID: addit },
        });
      }}
      searchIconName={'keyboard-voice'}
      searchIconColor={"#999"}
      editable={false} />
  </TouchableOpacity> : <TouchableOpacity onPress={() => {
    nav.navigate("HeaderSearch", {
      taskData: { statid: takestate, creditID: addit },
    });
  }} style={[styles.searchWrapper, Platform.OS === 'ios' ? styles.searchWrapperIosCompact : styles.searchWrapperAndroidCompact]}>
    <View style={styles.searchCard}>
      <SearchIcon
        name="search"
        color={"#63748b"}
        size={25}
      />
      <Text style={styles.searchText}>
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
        nav.navigate("HeaderSearch", {
          taskData: { statid: takestate, creditID: addit },
        })
      }}
      SearchLeft={() => {
        nav.navigate("HeaderSearch", {
          taskData: { statid: takestate, creditID: addit },
        });
      }}
      searchIconName={'keyboard-voice'}
      searchIconColor={"#999"}
      editable={false} /> */}
    </TouchableOpacity>
  )
}

/**
 * Handle text input default export.
 *
 * @returns {*}
 */
export default HandleTextInput
