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
import EyeIcon from 'react-native-vector-icons/Entypo';
import VoiceIcon from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../Themes/Fonts';

// ---------------------------------------------------------------------------
// TextInputPlain – a fully-controlled input with an animated label.
//
// Fix: removed the internal `textValue` shadow state.  When a parent passes
// `value` (controlled mode) the component must NOT maintain its own copy or
// clearing / pre-filling the field won't work.
// ---------------------------------------------------------------------------
const TextInputPlain = forwardRef((props, ref) => {
  const [eyeVisible, setEyeVisible] = useState(true);

  // Animate based on the controlled `value` prop, not a local copy.
  const animatedLabelValue = useRef(
    new Animated.Value(props.value ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.timing(animatedLabelValue, {
      toValue: props.value ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [props.value]);

  return (
    <View style={{ flexDirection: 'column' }}>
      {/* Animated label above the field */}
      <Animated.View style={{ opacity: animatedLabelValue }}>
        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: '#666666' }}>
          {props.label}
        </Text>
      </Animated.View>

      {/* Input row */}
      <View
        style={{
          borderBottomColor: '#000000',
          borderBottomWidth: 0.5,
          marginTop: normalize(5),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Optional left icon */}
          {props.leftIcon && (
            <props.leftIcon
              name={props.leftIconName}
              size={props.leftIconSize}
              color={props.leftIconColor}
              style={{ marginLeft: normalize(12) }}
            />
          )}

          {/* Fully controlled TextInput */}
          <TextInput
            ref={ref}
            secureTextEntry={eyeVisible ? props.isSecure : !props.isSecure}
            keyboardType={props.keyboardType}
            autoCapitalize={props.autoCapitalize}
            placeholder={props.placeholder || ''}
            placeholderTextColor={props.placeholderTextColor || 'RGB(170, 170, 170)'}
            maxLength={props.maxLength || 50}
            value={props.value}
            onChangeText={props.onChangeText}
            onBlur={props.onBlur}
            onFocus={props.onFocus}
            multiline={props.multiline}
            textAlignVertical={props.textAlignVertical}
            editable={props.editable}
            style={{
              height: props.height,
              width: props.width,
              paddingVertical: props.paddingVertical,
              fontSize: props.fontSize,
              color: props.color,
              fontFamily: props.fontFamily,
              backgroundColor: props.backgroundColor,
            }}
          />

          {/* Eye icon for password visibility */}
          {props.eye && (
            <TouchableOpacity
              onPress={() => setEyeVisible(!eyeVisible)}
              style={{ paddingRight: normalize(12) }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <EyeIcon
                name={eyeVisible ? 'eye-with-line' : 'eye'}
                color="#848484"
                size={25}
              />
            </TouchableOpacity>
          )}

          {/* Optional camera/image button */}
          {props.image2 && (
            <TouchableOpacity
              onPress={() => props.onPressCamera()}
              disabled={props.disabledCamera}
              style={{ paddingRight: normalize(12) }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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

          {/* Search / voice icon */}
          {props.searchIcon && (
            <TouchableOpacity
              style={{ paddingRight: normalize(12) }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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

TextInputPlain.displayName = 'TextInputPlain';

TextInputPlain.propTypes = {
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
  eye: PropTypes.bool,
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
  value: PropTypes.string,
  onChangeText: PropTypes.func,
};

export default TextInputPlain;
