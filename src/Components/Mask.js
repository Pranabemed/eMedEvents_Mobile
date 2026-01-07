import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';
import EyeIcon from 'react-native-vector-icons/Entypo';
import MaskInput from 'react-native-mask-input';

const MaskField = ({
    label,
    value,
    onChangeText,
    placeholder,
    placeholderTextColor = "#949494",
    maxlength,
    editable = true,
    multiline,
    containerStyle,
    labelStyle,
    wrapperStyle,
    inputStyle,
    isPassword,
    keyboardType,
    countryCode,
    showCountryCode,
    onCountryCodePress,
    ref,
    underlineColor = "#000000",
    underlineHeight = 0.6,
    labelColor = "#999999",
    onLeftIconPress,
    leftIcon,
    marginleft,
    icondisable,
    addnewtyle,
    onwholePress,
    mask, // ✅ Added mask prop
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(isPassword);
    const animated = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animated, {
            toValue: isFocused || value || countryCode ? 1 : 0,
            duration: 100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [isFocused, value, countryCode]);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const labelAnimatedStyle = {
        position: 'absolute',
        left: 0,
        transform: [
            {
                translateY: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, multiline ? -37 : -17],
                }),
            },
        ],
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        color: '#999999'
    };

    const styles = StyleSheet.create({
        inputGroup: {
            marginBottom: 16,
            width: '100%',
            position: 'relative',
        },
        inputWrapper: {
            borderBottomWidth: 0.5,
            borderBottomColor: "#000000",
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: normalize(20),
            position: 'relative',
        },
        countryCodeContainer: {
            paddingRight: 5,
            paddingVertical: 10,
        },
        countryCodeText: {
            fontSize: 16,
            fontFamily: Fonts.InterRegular,
            color: '#000000',
        },
        input: showCountryCode ? {
            flex: 1,
            padding: 10,
            fontSize: 16,
            fontFamily: Fonts.InterRegular,
            color: '#000000',
            paddingHorizontal: 5,
        } : {
            flex: 1,
            padding: 10,
            fontSize: 16,
            fontFamily: Fonts.InterRegular,
            color: '#000000',
            paddingHorizontal: -10,
        },
        iconContainer: {
            position: 'absolute',
            right: 10,
            bottom: 6,
        },
        leftIconContainer: {
            position: 'absolute',
            marginLeft: marginleft || 0,
            bottom: 10
        },
    });

    // ✅ Choose InputComponent based on mask
    const InputComponent = mask ? MaskInput : require('react-native').TextInput;

    return (
        <TouchableOpacity
            activeOpacity={onwholePress ? 0.7 : 1}
            onPress={onwholePress}
            disabled={icondisable}
            style={styles.inputGroup}
        >
            <View style={[styles.inputWrapper, wrapperStyle]}>

                {countryCode && (
                    <TouchableOpacity
                        style={styles.countryCodeContainer}
                        onPress={onCountryCodePress}
                        disabled={!onCountryCodePress}
                    >
                        <Text style={styles.countryCodeText}>{countryCode} -</Text>
                    </TouchableOpacity>
                )}

                <Animated.Text style={[labelAnimatedStyle, labelStyle, { bottom: 30 }]}>
                    {label}
                </Animated.Text>

                {leftIcon && (
                    <TouchableOpacity
                        onPress={onLeftIconPress}
                        disabled={icondisable}
                        style={styles.leftIconContainer}
                    >
                        {leftIcon}
                    </TouchableOpacity>
                )}

                <InputComponent
                    ref={ref}
                    style={[styles.input, addnewtyle]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    maxLength={maxlength}
                    editable={editable}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    mask={mask} // ✅ Only works for MaskInput
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {isPassword && (
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={toggleSecureEntry}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <EyeIcon
                            name={secureTextEntry ? 'eye-with-line' : 'eye'}
                            color="#949494"
                            size={25}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default MaskField;
