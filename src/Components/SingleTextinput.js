import React, { useState, forwardRef, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
} from 'react-native';
import PropTypes from 'prop-types';
const TextInputSingle = forwardRef((props, ref) => {
  const [textValue, setTextValue] = useState(props.value);
  const animatedLabelValue = useRef(new Animated.Value(0)).current;
  const scaleLabelValue = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedLabelValue, {
        toValue: textValue ? 1 : 0,
        duration: props.animationDuration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scaleLabelValue, {
        toValue: textValue ? 1 : 0.8,
        duration: props.animationDuration,
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
  return (
    <View style={[{ flexDirection: 'column' }, props.containerStyle]}>
      {props.label && (
        <Animated.View
          style={{
            opacity: props.animatedValue,
            transform: [{ scale: props.scaleValue }],
          }}
        >
          <Text style={props.labelStyle}>
            {props.label}
          </Text>
        </Animated.View>
      )}
        <View
          style={props.isDotted ? { marginTop: props.marginTop } : {
            borderBottomColor: props.borderBottomColor,
            borderBottomWidth: props.borderBottomWidth,
            marginTop: props.marginTop,
          }}
        >
          <View style={props.inputstyle}>
            <TouchableOpacity disabled={props.disabledPress} onPress={props.onPressTxt}>
            <Text style={props.value ? props.textStyle: props.textPlaceholder}>{props.value ?props.value: props.placeholder}</Text>
            </TouchableOpacity>
            {props.rightIconComponent && (
              <TouchableOpacity disabled={props.disabledPress}
                onPress={props.onPressRightIcon}
                style={props.rightIconStyle}
              >
                <props.rightIconComponent
                  name={props.rightIconName}
                  color={props.rightIconColor}
                  size={props.rightIconSize}
                />
              </TouchableOpacity>
            )}
          </View>
          {props.isDotted && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginLeft: 1
              }}
            >
              {Array.from({ length: 50 }).map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 4,
                    height: 2,
                    backgroundColor: '#000',
                    borderRadius: 1,
                  }}
                />
              ))}
            </View>
          )}
        </View>
    </View>
  );
});
TextInputSingle.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  editable: PropTypes.bool,
  keyboardType: PropTypes.string,
  leftIcon: PropTypes.elementType,
  leftIconName: PropTypes.string,
  leftIconSize: PropTypes.number,
  leftIconColor: PropTypes.string,
  rightIconComponent: PropTypes.elementType,
  rightIconName: PropTypes.string,
  rightIconColor: PropTypes.string,
  rightIconSize: PropTypes.number,
  onPressRightIcon: PropTypes.func,
  onPressTxt:PropTypes.func,
  labelStyle: PropTypes.object,
  inputstyle: PropTypes.object,
  containerStyle: PropTypes.object,
  rightIconStyle: PropTypes.object,
  iconMargin: PropTypes.number,
  iconPadding: PropTypes.number,
  borderBottomColor: PropTypes.string,
  borderBottomWidth: PropTypes.number,
  marginTop: PropTypes.number,
  animationDuration: PropTypes.number,
  animatedValue: PropTypes.object,
  scaleValue: PropTypes.object,
  isDotted: PropTypes.bool,
  textStyle: PropTypes.object,
  textPlaceholder:PropTypes.object,
  disabledPress:PropTypes.bool
};

export default TextInputSingle;