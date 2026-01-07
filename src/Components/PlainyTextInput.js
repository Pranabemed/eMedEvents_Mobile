
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
import Fonts from '../Themes/Fonts'; // Import Fonts if needed

const TextInputPlain = forwardRef((props, ref) => {
  const [eyeVisible, setEyeVisible] = useState(true);
  const [textValue, setTextValue] = useState(props.value || ''); // Controlled input state
  const animatedLabelValue = useRef(new Animated.Value(0)).current; // For label opacity
  const scaleLabelValue = useRef(new Animated.Value(0.8)).current; // For label scale

  useEffect(() => {
    // Focus the input if the ref is provided
    if (ref && ref.current) {
      ref.current.focus();
    }

    // Animate the label based on text value
    Animated.parallel([
      Animated.timing(animatedLabelValue, {
        toValue: textValue ? 1 : 0,
        duration: 300, // Duration for the fade effect
        easing: Easing.out(Easing.quad), // Easing for smooth transition
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
    setTextValue(text); // Update local state
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
    <View style={{ flexDirection: 'column'}}>
      {/* Label */}
      <Animated.View style={{ opacity: animatedLabelValue, transform: [{ scale: scaleLabelValue }] }}>
        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#666666" }}>
          {props.label} {/* Default to 'Label' if no label is provided */}
        </Text>
      </Animated.View>

      {/* Text Input Container */}
      <View
        style={{
          borderBottomColor: '#000000',
          borderBottomWidth: 0.5,
          marginTop: normalize(5),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Optional Left Icon */}
          {props.leftIcon && (
            <props.leftIcon
              name={props.leftIconName}
              size={props.leftIconSize}
              color={props.leftIconColor}
              style={{ marginLeft: normalize(12) }}
            />
          )}

          {/* Text Input */}
          <TextInput
            ref={ref}
            secureTextEntry={eyeVisible ? props.isSecure : !props.isSecure}
            keyboardType={props.keyboardType}
            autoCapitalize={props.autoCapitalize}
            placeholder={props.placeholder || 'Enter text'}
            placeholderTextColor={props.placeholderTextColor || 'RGB(170, 170, 170)'}
            maxLength={props.maxLength || 50}
            value={textValue} // Controlled input state
            onChangeText={onChangeText}
            onBlur={onBlur}
            onFocus={onFocus}
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
              backgroundColor:props.backgroundColor
            }}
          />

          {/* Eye Icon for Password Visibility */}
          {props.eye && (
            <TouchableOpacity
              onPress={() => setEyeVisible(!eyeVisible)}
              style={{ paddingRight: normalize(12) }}
            >
              <EyeIcon
                name={eyeVisible ? 'eye-with-line' : 'eye'}
                color="#848484"
                size={25}
              />
            </TouchableOpacity>
          )}

          {/* Optional Image */}
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

          {/* Search Icon */}
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
  label: PropTypes.string, // New prop for label
};

export default TextInputPlain;
