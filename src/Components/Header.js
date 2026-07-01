/**
 * Header reusable component module. Provides a React Native UI building block used across screens.
 */

import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types'; 
import normalize from '../Utils/Helpers/Dimen';
import { useNavigation } from '@react-navigation/native';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons'; 

/**
 * Reusable Header component.
 * 
 * **Purpose:** Provides a consistent header for screens, typically including a back button or left/right actions.
 * 
 * **Parameters:**
 * @param {Object} props - The component props.
 * @param {Function} props.onPress - Callback executed when the header (or back button) is pressed.
 * @param {string} props.justifyContent - Flexbox justify-content for the header layout.
 * @param {string} props.tintColor - Color for the back arrow icon.
 * 
 * **Return Value:**
 * @returns {JSX.Element} A React Native TouchableOpacity containing a view with an arrow icon.
 * 
 * **Throws:** None
 * 
 * **Example Usage:**
 * ```jsx
 * <Header onPress={() => navigation.goBack()} tintColor="#333" />
 * ```
 * 
 * **Notes:**
 * - The component adapts its layout depending on whether the platform is iOS or Android.
 * - Uses `MaterialIcons` for the back arrow.
 */

export default function Header(props) {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity onPress={()=>props.onPress()} style={Platform.OS === 'ios' ? {
      flexDirection: 'row',
      justifyContent: props.justifyContent ? props.justifyContent : 'space-between',
      paddingHorizontal: normalize(10),
      alignItems: 'center',
    } : {
      flexDirection: 'row',
      padding: normalize(20),
      marginTop: normalize(40),
      alignItems: 'center',
      marginLeft:normalize(-8),
      justifyContent: props.justifyContent ? props.justifyContent : 'space-between',
    }}>
      
      <View style={{
        alignItems: 'center',
      }}>
        <TouchableOpacity
          onPress={() => props.onPress()}
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {Platform.OS ==='ios' ?<ArrowIcons
            name="keyboard-arrow-left"
            size={35}
            color={props.tintColor ? props.tintColor : '#000000'}
            style={{top:25}}
          />:<ArrowIcons
          name="keyboard-arrow-left"
          size={35}
          color={props.tintColor ? props.tintColor : '#000000'}
        />}
        </TouchableOpacity>
      </View>

    </TouchableOpacity>
  );
}

Header.propTypes = {
  height: PropTypes.number,
  backgroundColor: PropTypes.string,
  paddingLeft: PropTypes.number,
  iheight: PropTypes.number,
  iwidth: PropTypes.number,
  tintColor: PropTypes.string,
  position: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  leftText: PropTypes.bool,
  lText: PropTypes.string,
  rText: PropTypes.string,
  onPressRight: PropTypes.func,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  topWidth: PropTypes.any,
  search: PropTypes.bool,
  color: PropTypes.string,
  fsize: PropTypes.number,
  fontFamilyLeft: PropTypes.string,
  justifyContent: PropTypes.string
};
