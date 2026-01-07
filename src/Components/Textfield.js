import React, { useState, forwardRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  Text
} from 'react-native';
import PropTypes from 'prop-types';
import normalize from '../Utils/Helpers/Dimen';
import EyeIcon from 'react-native-vector-icons/Entypo';
import VoiceIcon from 'react-native-vector-icons/MaterialIcons';
import Colorpath from '../Themes/Colorpath';
const TextFieldIn = forwardRef((props, ref) => {
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
        borderWidth: props.borderWidth, // Apply borderWidth
        borderColor: props.borderColor,
      }}
      pointerEvents="auto" // Ensure touches are registered
    >
      <TouchableOpacity
        onPress={props.onPressLeftIcon}
        disabled={!props.onPressLeftIcon} // Disable touch if no function is provided
        style={{
          width: '100%',
          flexDirection: 'row'
        }}
      >
        {props.leftIcon && (
          <props.leftIcon
            name={props.leftIconName}
            size={props.leftIconSize}
            color={props.leftIconColor}
            style={[Platform.OS === 'ios'
              ? { marginLeft: props.marginLeft || normalize(12),top:props.top,marginBottom:normalize(14) }
              : { marginLeft: props.marginLeft || normalize(12), top: props.top},
            props.leftIconStyle]}
          />
        )}
        {props.lefttext && <Text style={Platform.OS === 'ios' ? { marginLeft: normalize(5), top: 1, fontFamily: props.leftfontset, fontSize: props.leftfont, color: props.leftcolor } : { marginLeft: props.marginprops || normalize(5), top: 12, fontFamily: props.leftfontset, fontSize: props.leftfont, color: props.leftcolor }}>{props.leftname ? props.leftname + " - " : props.leftname}</Text>}
        <TextInput
          ref={ref}
          secureTextEntry={eyeVisible ? props.isSecure : !props.isSecure}
          keyboardType={props.keyboardType}
          autoCapitalize={props.autoCapitalize}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor || '#aaa'} // Default to '#aaa' if not provided
          maxLength={props.maxLength}
          value={props.value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          onFocus={onFocus}
          multiline={props.multiline}
          textAlignVertical={props.textAlignVertical}
          editable={props.editable}
          style={{
            textTransform: props.textTransform || 'none',
            paddingHorizontal: props.paddingHorizontal,
            width: props.textWidth || '90%',
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            textAlign: props.textAlign,
            paddingLeft: props.paddingLeft,
            color: props.color,
            marginTop: props.marginTopInput || null,
          }}
        />

        {props.eye && (
          <TouchableOpacity
            onPress={() => setEyeVisible(!eyeVisible)}
            style={
              Platform.OS === 'ios'
                ? { position: 'absolute', right: normalize(12) }
                : { position: 'absolute', right: normalize(16), top: normalize(9) }
            }
          >
            <EyeIcon
              name={eyeVisible ? 'eye-with-line' : 'eye'}
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
              position: 'absolute',
              right: props.right2,
              left: props.left2,

            }}>
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
          <TouchableOpacity onPress={props.SearchLeft}
            style={
              Platform.OS === 'ios'
                ? { position: 'absolute', right: normalize(12), top: normalize(5) }
                : { position: 'absolute', right: normalize(12), top: normalize(8) }
            }
          >
            <VoiceIcon
              name={props.searchIconName}
              color={props.searchIconColor}
              size={28}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
});

TextFieldIn.propTypes = {
  backgroundColor: PropTypes.string,
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
    width: PropTypes.number
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
  lefttext: PropTypes.bool,
  leftname: PropTypes.string,
  leftfont: PropTypes.number,
  leftcolor: PropTypes.string,
  leftfontset: PropTypes.string,
  image2: PropTypes.bool,
  right2: PropTypes.number,
  left2: PropTypes.number,
  source2: PropTypes.string,
  tintColor2: PropTypes.string,
  iheight2: PropTypes.number,
  iwidth2: PropTypes.number,
  leftIconStyle: PropTypes.object,
  onPressLeftIcon: PropTypes.func, 
  leftIconStyle: PropTypes.object,
  SearchLeft:PropTypes.func,
  marginprops:PropTypes.number
};

export default TextFieldIn;
