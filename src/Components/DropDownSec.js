import React, { useState, forwardRef, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Animated,
  Easing,
} from 'react-native';
import PropTypes from 'prop-types';
import normalize from '../Utils/Helpers/Dimen';
import DropdownIcon from 'react-native-vector-icons/MaterialIcons'; 
import VoiceIcon from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../Themes/Fonts'; 
import CalIcon from 'react-native-vector-icons/Feather';
const DropdownInputs = forwardRef((props, ref) => {
  const [textValue, setTextValue] = useState(props.value || '');
  const animatedLabelValue = useRef(new Animated.Value(0)).current;
  const scaleLabelValue = useRef(new Animated.Value(0.8)).current; 
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.focus();
    }
    Animated.parallel([
      Animated.timing(animatedLabelValue, {
        toValue: textValue ? 1 : 0,
        duration: 300, 
        easing: Easing.out(Easing.quad), 
        useNativeDriver: true,
      }),
      Animated.timing(scaleLabelValue, {
        toValue: textValue ? 1 : 0.8,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [textValue]);

  const onChangeText = (text) => {
    setTextValue(text); 
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  };
  const onFocus = () => {
    if (props.onFocus) {
      props.onFocus();
    }
  };

  const onBlur = () => {
    if (props.onBlur) {
      props.onBlur();
    }
  };

  return (
    <View style={{ flexDirection: 'column' }}>
      <Animated.View style={{ opacity: animatedLabelValue, transform: [{ scale: scaleLabelValue }] }}>
        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>
          {props.label} 
        </Text>
      </Animated.View>
      <View
        style={{
          borderBottomColor: '#000000',
          borderBottomWidth: 0.5,
          marginTop: normalize(0),
          width:normalize(130)
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {props.leftIcon && (
            <props.leftIcon
              name={props.leftIconName}
              size={props.leftIconSize}
              color={props.leftIconColor}
              style={{ marginLeft: normalize(12) }}
            />
          )}
          <TextInput
            ref={ref}
            keyboardType={props.keyboardType}
            autoCapitalize={props.autoCapitalize}
            placeholder={props.placeholder || 'Enter text'}
            placeholderTextColor={props.placeholderTextColor || '#AAAAAA'}
            maxLength={props.maxLength || 50}
            value={textValue}
            onChangeText={onChangeText}
            onBlur={onBlur}
            onFocus={onFocus}
            multiline={props.multiline}
            textAlignVertical={props.textAlignVertical}
            editable={props.editable}
            style={{
              height: normalize(35),
              width: normalize(100),
              paddingVertical: 0,
              fontSize: 14,
              color: "#000000",
              fontFamily: Fonts.InterSemiBold
            }}
          />
          {props.dropdownIcon && (
            <TouchableOpacity disabled={props.dropdisable}
            onPress={()=>{props.onDropdownPress()}}
              style={{ marginLeft: normalize(10) }}
            >
              <DropdownIcon
                name={props.isDatachange}
                color="#848484"
                size={30}
              />
            </TouchableOpacity>
          )}
          {props.dropdownIcons && (
            <TouchableOpacity disabled={props.dropdisable}
            onPress={()=>{props.onDropdownPress()}}
              style={{ marginLeft: normalize(10) }}
            >
              <CalIcon
                name={props.isDatachange}
                color="#848484"
                size={25}
              />
            </TouchableOpacity>
          )}
          {props.image2 && (
            <TouchableOpacity
              onPress={() => props.onPressCamera()}
              disabled={props.disabledCamera}
              style={{
                paddingRight: normalize(12),
              }}
            >
              <Image
                source={props.source2}
                style={{
                  resizeMode: 'contain',
                  height: props.iheight2,
                  width: props.iwidth2,
                  tintColor: props.tintColor2,
                }}
              />
            </TouchableOpacity>
          )}
          {props.searchIcon && (
            <TouchableOpacity
              style={{ paddingRight: normalize(12) }}
            >
              <VoiceIcon
                name={props.searchIconName}
                color={props.searchIconColor}
                size={28}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
});

DropdownInputs.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  borderRadius: PropTypes.number,
  borderWidth: PropTypes.number,
  marginTop: PropTypes.number,
  color: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  paddingLeft: PropTypes.number,
  paddingRight: PropTypes.number,
  marginLeft: PropTypes.number,
  borderTopRightRadius: PropTypes.number,
  borderBottomRightRadius: PropTypes.number,
  borderTopLeftRadius: PropTypes.number,
  borderBottomLeftRadius: PropTypes.number,
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  textAlignVertical: PropTypes.string,
  editable: PropTypes.bool,
  marginTopInput: PropTypes.number,
  keyboardType: PropTypes.string,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  textAlign: PropTypes.string,
  paddingHorizontal: PropTypes.number,
  textWidth: PropTypes.number,
  alignTextField: PropTypes.string,
  shadowOpacity: PropTypes.number,
  shadowRadius: PropTypes.number,
  shadowOffset: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  shadowColor: PropTypes.string,
  elevation: PropTypes.number,
  isSecure: PropTypes.bool,
  leftIcon: PropTypes.elementType,
  leftIconName: PropTypes.string,
  leftIconSize: PropTypes.number,
  leftIconColor: PropTypes.string,
  searchIcon: PropTypes.bool,
  searchIconName: PropTypes.string,
  searchIconColor: PropTypes.string,
  image2: PropTypes.bool,
  right2: PropTypes.number,
  left2: PropTypes.number,
  source2: PropTypes.string,
  tintColor2: PropTypes.string,
  iheight2: PropTypes.number,
  iwidth2: PropTypes.number,
  label: PropTypes.string, 
  dropdownIcon: PropTypes.bool,
  dropdownIcons: PropTypes.bool,
  onDropdownPress: PropTypes.func,
  dropdisable: PropTypes.bool,
 isDatachange: PropTypes.string
};

export default DropdownInputs;
