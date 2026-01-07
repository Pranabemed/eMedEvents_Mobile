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

const DropdownInput = forwardRef((props, ref) => {
  console.log(props,"props-----------")
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
      <Animated.View style={{ opacity: animatedLabelValue, transform: [{ scale: scaleLabelValue }], flexDirection: "row" }}>
        <Text style={props.labelStyle || { fontFamily: Fonts.InterSemiBold, fontSize: 22, color: "#000000", fontWeight: "bold" }}>
          {props.label}
        </Text>
        {props.label && <Text style={{ color: 'red', paddingVertical: normalize(2) }}>*</Text>}
      </Animated.View>
      <View
        style={{
          borderBottomColor: props.borderBottomColor || '#000000', // Use prop for border color
          borderBottomWidth: props.borderBottomWidth || 0.5, // Default to 1 if not provided
          borderStyle: props.borderStyle || 'solid', // Default to 'solid' if not provided
          // marginTop: normalize(0),
          width: normalize(290),
          // backgroundColor:"red"
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
         {props.placetext  && <Text style={{
            position: 'absolute',
            top: 8,
            left: 0,
            fontSize: 16,
            color: '#000000'
          }}>
            {props.placeholder } <Text style={{ color: "red" }}>*</Text>
          </Text>}
          <TextInput
            ref={ref}
            keyboardType={props.keyboardType}
            autoCapitalize={props.autoCapitalize}
            placeholder={""}
            placeholderTextColor={""}
            maxLength={props.maxLength}
            value={props.value}
            onChangeText={props.onChangeText}
            onBlur={onBlur}
            onFocus={onFocus}
            multiline={props.multiline}
            textAlignVertical={props.textAlignVertical}
            editable={props.editable}
            style={{
              height: normalize(35),
              width: normalize(250),
              paddingVertical: 0,
              fontSize: 14,
              color: "#000000",
              fontFamily: Fonts.InterRegular
            }}
          />
          {props.dropdownIcon && (
            <TouchableOpacity
              disabled={props.dropdisable}
              onPress={() => { props.onDropdownPress(); }}
              style={{ marginLeft: normalize(10) }}
            >
              {props.dropdownImage ? (
                <Image
                  source={props.dropdownImage}
                  style={{
                    width: props.dropdownImageWidth || 30,
                    height: props.dropdownImageHeight || 30,
                    tintColor: props.dropdownImageTintColor || '#848484',
                  }}
                />
              ) : (
                <DropdownIcon
                  name={props.isDatachange}
                  color="#848484"
                  size={30}
                />
              )}
            </TouchableOpacity>
          )}
          {props.rightIcon ? (
            <TouchableOpacity onPress={() => { props.onDropdownPress(); }} style={{ marginLeft: normalize(5) }}>
              {props.rightIcon}
            </TouchableOpacity>
          ) : null}
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

DropdownInput.propTypes = {
  borderBottomColor: PropTypes.string,
  borderBottomWidth: PropTypes.number,
  borderStyle: PropTypes.string,
  label: PropTypes.string,
  labelStyle: PropTypes.object,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  textAlignVertical: PropTypes.string,
  editable: PropTypes.bool,
  keyboardType: PropTypes.string,
  autoCapitalize: PropTypes.string,
  leftIcon: PropTypes.elementType,
  placetext: PropTypes.bool,
  leftIconName: PropTypes.string,
  leftIconSize: PropTypes.number,
  leftIconColor: PropTypes.string,
  dropdownIcon: PropTypes.bool,
  onDropdownPress: PropTypes.func,
  dropdisable: PropTypes.bool,
  isDatachange: PropTypes.string,
  image2: PropTypes.bool,
  source2: PropTypes.string,
  tintColor2: PropTypes.string,
  iheight2: PropTypes.number,
  iwidth2: PropTypes.number,
  searchIcon: PropTypes.bool,
  searchIconName: PropTypes.string,
  searchIconColor: PropTypes.string,
  dropdownImage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // Supports local or remote images
  dropdownImageWidth: PropTypes.number,
  dropdownImageHeight: PropTypes.number,
  dropdownImageTintColor: PropTypes.string,
  rightIcon: PropTypes.node
};

export default DropdownInput;
