import React, { useState, forwardRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import normalize from '../Utils/Helpers/Dimen';
import EyeIcon from 'react-native-vector-icons/Entypo';
import VoiceIcon from 'react-native-vector-icons/MaterialIcons';

const CustomTextField = forwardRef((props, ref) => {
  const [eyeVisible, setEyeVisible] = useState(true);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.focus();
    }
  }, [ref]);

  const onChangeText = (text) => {
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

  const renderRightIcon = () => {
    if (props.eye) {
      return (
        <TouchableOpacity disabled={props.onDisable}
          onPress={() => setEyeVisible(!eyeVisible)}
          style={
            Platform.OS === 'ios'
              ? {
                  position: 'absolute',
                  right: normalize(12),
                }
              : {
                  position: 'absolute',
                  right: normalize(16),
                  top: normalize(9),
                }
          }
        >
          <EyeIcon
            name={eyeVisible ? 'eye-with-line' : 'eye'}
            color="#848484"
            size={25}
          />
        </TouchableOpacity>
      );
    } else if (props.rightIcon) {
      return (
        <TouchableOpacity disabled={props.onDisable}
          style={
            Platform.OS === 'ios'
              ? {
                  position: 'absolute',
                  right: normalize(0),
                }
              : {
                  position: 'absolute',
                  right: normalize(0),
                  top: normalize(9),

                }
          }
          onPress={props.onRightIconPress}
        >
          <props.rightIcon
            name={props.rightIconName}
            size={props.rightIconSize}
            color={props.rightIconColor}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View
      style={{
        justifyContent: 'space-between',
        height: props.height,
        flexDirection: 'row',
        width: props.width,
        borderRadius: props.borderRadius,
        backgroundColor: props.backgroundColor,
        marginBottom: props.marginBottom,
        marginTop: props.marginTop,
        marginLeft: props.marginLeft,
        alignSelf: props.alignTextField ? props.alignTextField : 'center',
        alignItems: props.alignItems ? props.alignItems : 'center',
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        borderTopRightRadius: props.borderTopRightRadius,
        borderBottomRightRadius: props.borderBottomRightRadius,
        borderTopLeftRadius: props.borderTopLeftRadius,
        borderBottomLeftRadius: props.borderBottomLeftRadius,
        shadowOpacity: props.shadowOpacity,
        shadowRadius: props.shadowRadius,
        shadowOffset: props.shadowOffset,
        shadowColor: props.shadowColor,
        elevation: props.elevation,
        paddingVertical: props.paddingVertical,
        paddingHorizontal: props.paddingHorizontal,
        borderWidth: props.borderWidth,
        borderColor: props.borderColor,
        marginRight:props.marginRight
      }}
      pointerEvents="auto"
    >
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
        }}
      >
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
          secureTextEntry={eyeVisible ? props.isSecure : !props.isSecure}
          keyboardType={props.keyboardType}
          autoCapitalize={props.autoCapitalize}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          maxLength={props.maxLength}
          value={props.value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          onFocus={onFocus}
          multiline={props.multiline}
          textAlignVertical={props.textAlignVertical}
          editable={props.editable}
          style={{
            textTransform: props.textTransform ? props.textTransform : 'none',
            paddingHorizontal: props.paddingHorizontal
              ? props.paddingHorizontal
              : normalize(0),
            width: props.textWidth ? props.textWidth : '90%',
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            textAlign: props.textAlign,
            paddingLeft: props.paddingLeft,
            color: props.color,
            marginTop: props.marginTopInput ? props.marginTopInput : null
          }}
        />

        {renderRightIcon()}
      </View>
    </View>
  );
});

CustomTextField.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  widthText: PropTypes.number,
  borderRadius: PropTypes.number,
  borderWidth: PropTypes.number,
  backgroundColor: PropTypes.string,
  marginTop: PropTypes.number,
  color: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  paddingTop: PropTypes.number,
  borderColor: PropTypes.string,
  paddingLeft: PropTypes.number,
  paddingRight: PropTypes.number,
  marginLeft: PropTypes.number,
  borderTopRightRadius: PropTypes.number,
  borderBottomRightRadius: PropTypes.number,
  borderTopLeftRadius: PropTypes.number,
  borderBottomLeftRadius: PropTypes.number,
  maxLength: PropTypes.number,
  image: PropTypes.bool,
  textAlign: PropTypes.number,
  paddingLeft: PropTypes.number,
  marginRight: PropTypes.number,
  keyboardType: PropTypes.number,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  multiline: PropTypes.bool,
  textAlignVertical: PropTypes.string,
  numberOfLines: PropTypes.number,
  editable: PropTypes.bool,
  calender: PropTypes.bool,
  date: PropTypes.string,
  datePlaceholder: PropTypes.string,
  onPress: PropTypes.func,
  marginTopInput: PropTypes.number,
  keyboardType: PropTypes.string,
  source: PropTypes.string,
  tintColor: PropTypes.string,
  iheight: PropTypes.number,
  iwidth: PropTypes.number,
  borderWidth: PropTypes.number,
  image2: PropTypes.bool,
  right2: PropTypes.number,
  left2: PropTypes.number,
  source2: PropTypes.string,
  tintColor2: PropTypes.string,
  iheight2: PropTypes.number,
  iwidth2: PropTypes.number,
  shadowOpacity: PropTypes.number,
  shadowRadius: PropTypes.number,
  shadowOffset: PropTypes.number,
  shadowColor: PropTypes.string,
  elevation: PropTypes.number,
  fontFamily: PropTypes.string,
  autoCapitalize: PropTypes.string,
  isSecure: PropTypes.bool,
  isRightIconVisible: PropTypes.bool,
  rightimage: PropTypes.string,
  rightimageheight: PropTypes.number,
  rightimagewidth: PropTypes.number,
  eye: PropTypes.bool,
  textWidth: PropTypes.number,
  disabled: PropTypes.bool,
  paddingVertical: PropTypes.number,
  paddingHorizontal: PropTypes.number,
  alignTextField: PropTypes.string,
  onPressCamera: PropTypes.func,
  disabledCamera: PropTypes.bool,
  textTransform: PropTypes.string,
  leftIcon: PropTypes.elementType,
  leftIconName: PropTypes.string,
  leftIconSize: PropTypes.number,
  leftIconColor: PropTypes.string,
  rightIcon: PropTypes.elementType, 
  rightIconName: PropTypes.string,
  rightIconSize: PropTypes.number, 
  rightIconColor: PropTypes.string, 
  onRightIconPress: PropTypes.func,
  onDisable:PropTypes.bool 
};

export default CustomTextField;
