import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
    Alert,
    Platform
} from 'react-native';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';
import EyeIcon from 'react-native-vector-icons/Entypo';

const InputField = ({
    spaceneeded,
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
    activeUnderlineColor,
    outlineColor,
    activeOutlineColor,
    underlineHeight = 0.6,
    labelColor = "#999999",
    activeLabelColor,
    rippleColor,
    onLeftIconPress,
    leftIcon,
    marginleft,
    icondisable,
    addnewtyle,
    onwholePress,
    secureTrue,
    bgv,
    notext,
    onlyfor,
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
            spaceneeded ? Platform.OS === 'android' ? {
                translateY: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, multiline ? -30 : -23],
                }),
            }:{
                translateY: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, multiline ? -27 : -29],
                }),
            } : {
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
        label: {
            fontSize: 14,
            fontFamily: Fonts.InterRegular,
            color: '#999999',
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
            fontSize: icondisable && bgv ? 14:16,
            fontFamily: Fonts.InterRegular,
            color: icondisable && bgv ? "#999" : '#000000',
            paddingHorizontal: -10,
        },
        inputWithCountryCode: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
        },
        inputWithRightIcon: {
            paddingRight: 40,
        },
        disabledInput: {
            opacity: 0.6,
        },
        iconContainer: {
            position: 'absolute',
            right: 10,
            bottom: 6,
        },
        eyeIcon: {
            fontSize: 16,
            fontFamily: Fonts.InterRegular,
            color: '#000000',
        },
        leftIconContainer: icondisable && bgv ? {
            position: 'absolute',
            marginLeft: marginleft || 0,
            bottom:0,
            backgroundColor:"#E6ECF2",
            height:normalize(45),
            width:normalize(20),
        }:{ position: 'absolute',
            marginLeft: marginleft || 0,
            bottom: 10,},
    });

    const InputContent = (
        <View style={[styles.inputGroup]}>
            <View style={[styles.inputWrapper, wrapperStyle]}>

                {countryCode && (
                    <TouchableOpacity
                        style={styles.countryCodeContainer}
                        onPress={onCountryCodePress}
                        disabled={!onCountryCodePress}
                    >
                        {countryCode && <Text style={styles.countryCodeText}>{countryCode} {"-"}</Text>}
                    </TouchableOpacity>
                )}

                <Animated.Text style={[labelAnimatedStyle, labelStyle, { bottom: 30 }]}>
                    {label}
                </Animated.Text>
                <TouchableOpacity onPress={onLeftIconPress}
                    disabled={icondisable}>
                    <TextInput
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
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    />
                </TouchableOpacity>
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

                {leftIcon && (
                    <View style={styles.leftIconContainer}>
                        {leftIcon}
                    </View>
                )}
            </View>
        </View>
    );
    const InputContentTch = (
        <View style={[styles.inputGroup]}>
            <View style={[styles.inputWrapper, wrapperStyle]}>

                {countryCode && (
                    <TouchableOpacity
                        style={styles.countryCodeContainer}
                        onPress={onCountryCodePress}
                        disabled={!onCountryCodePress}
                    >
                        {countryCode && <Text style={styles.countryCodeText}>{countryCode} {"-"}</Text>}
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
                <TextInput
                    ref={ref}
                    style={[styles.input, addnewtyle]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    maxLength={maxlength}
                    editable={editable}
                    secureTextEntry={secureTrue ? secureTrue : secureTextEntry}
                    keyboardType={keyboardType}
                    multiline={multiline}
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
        </View>
    );
    // ✅ Wrap with TouchableOpacity when leftIcon exists
    if (leftIcon) {
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

                    <Animated.Text style={[labelAnimatedStyle, labelStyle, { bottom: Platform.OS === "ios" ? 20 : 30 }]}>
                        {icondisable && bgv ? "":label}
                    </Animated.Text>

                    {/* ✅ Left Icon with its own press */}
                    {leftIcon && (
                        <TouchableOpacity
                            onPress={onLeftIconPress}
                            disabled={icondisable}
                            style={styles.leftIconContainer}
                            activeOpacity={0.7}
                        >
                            {leftIcon}
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity activeOpacity={onwholePress ? 0.7 : 1}
                        onPress={onwholePress}
                        disabled={icondisable}>
                        <TextInput
                            ref={ref}
                            style={[styles.input, addnewtyle, icondisable && bgv &&  { backgroundColor: "#E6ECF2", width: normalize(270),height:normalize(45) },onlyfor && {width:normalize(270)}]}
                            value={icondisable && bgv ? notext :value}
                            onChangeText={onChangeText}
                            placeholder={placeholder}
                            placeholderTextColor={placeholderTextColor}
                            maxLength={maxlength}
                            editable={editable}
                            secureTextEntry={secureTextEntry}
                            keyboardType={keyboardType}
                            multiline={multiline}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            {...props}
                        />
                    </TouchableOpacity>

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
    }

    return InputContentTch;
};

export default InputField;
