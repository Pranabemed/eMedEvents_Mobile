import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
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

    const isActive = isFocused || !!value || !!countryCode;

    useEffect(() => {
        Animated.timing(animated, {
            toValue: isActive ? 1 : 0,
            duration: 180,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [isFocused, value, countryCode]);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    // Floating label: starts at input level, moves UP when active, shrinks font
    const labelTop = animated.interpolate({
        inputRange: [0, 1],
        outputRange: [normalize(22), normalize(0)],   // starts at input level, floats to top
    });

    const labelFontSize = animated.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 12],   // shrinks when floating
    });

    const labelColor2 = animated.interpolate({
        inputRange: [0, 1],
        outputRange: ['#999999', '#333333'],
    });

    const labelAnimatedStyle = {
        position: 'absolute',
        left: showCountryCode && countryCode ? normalize(50) : 0,
        top: labelTop,
        fontSize: labelFontSize,
        fontFamily: Fonts.InterRegular,
        color: labelColor2,
        zIndex: 1,
    };

    const styles = StyleSheet.create({
        inputGroup: {
            marginBottom: normalize(16),
            width: '100%',
            position: 'relative',
        },
        inputWrapper: {
            borderBottomWidth: 0.8,
            borderBottomColor: "#000000",
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingTop: normalize(24),   // space for the floating label above
            paddingBottom: normalize(6),
            position: 'relative',
        },
        countryCodeContainer: {
            paddingRight: 5,
            paddingBottom: 2,
        },
        countryCodeText: {
            fontSize: 15,
            fontFamily: Fonts.InterRegular,
            color: '#000000',
        },
        input: showCountryCode ? {
            flex: 1,
            fontSize: 15,
            fontFamily: Fonts.InterRegular,
            color: '#000000',
            padding: 0,
            paddingHorizontal: 5,
        } : {
            flex: 1,
            fontSize: icondisable && bgv ? 14 : 15,
            fontFamily: Fonts.InterRegular,
            color: icondisable && bgv ? "#999" : '#000000',
            padding: 0,
            paddingHorizontal: 0,
        },
        iconContainer: {
            position: 'absolute',
            right: 0,
            bottom: normalize(8),
        },
        leftIconContainer: icondisable && bgv ? {
            position: 'absolute',
            marginLeft: marginleft || 0,
            bottom: 0,
            backgroundColor: "#E6ECF2",
            height: normalize(45),
            width: normalize(20),
        } : {
            position: 'absolute',
            marginLeft: marginleft || 0,
            bottom: normalize(8),
        },
    });

    // ─── Simple input (no leftIcon) ────────────────────────────────────────────
    const InputContentTch = (
        <View style={[styles.inputGroup, containerStyle]}>
            <View style={[styles.inputWrapper, wrapperStyle]}>

                {/* Floating label */}
                <Animated.Text style={[labelAnimatedStyle, labelStyle]}>
                    {label}
                </Animated.Text>

                {/* Country code prefix */}
                {countryCode && (
                    <TouchableOpacity
                        style={styles.countryCodeContainer}
                        onPress={onCountryCodePress}
                        disabled={!onCountryCodePress}
                    >
                        <Text style={styles.countryCodeText}>{countryCode} {"-"}</Text>
                    </TouchableOpacity>
                )}

                <TextInput
                    ref={ref}
                    style={[styles.input, addnewtyle]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={''}
                    placeholderTextColor="transparent"
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
                            size={22}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    // ─── Input WITH leftIcon (wrapped in TouchableOpacity) ─────────────────────
    if (leftIcon) {
        return (
            <TouchableOpacity
                activeOpacity={onwholePress ? 0.7 : 1}
                onPress={onwholePress}
                disabled={icondisable}
                style={[styles.inputGroup, containerStyle]}
            >
                <View style={[styles.inputWrapper, wrapperStyle]}>

                    {/* Floating label */}
                    <Animated.Text style={[labelAnimatedStyle, labelStyle]}>
                        {icondisable && bgv ? "" : label}
                    </Animated.Text>

                    {/* Country code prefix */}
                    {countryCode && (
                        <TouchableOpacity
                            style={styles.countryCodeContainer}
                            onPress={onCountryCodePress}
                            disabled={!onCountryCodePress}
                        >
                            <Text style={styles.countryCodeText}>{countryCode} -</Text>
                        </TouchableOpacity>
                    )}

                    {/* Left Icon */}
                    <TouchableOpacity
                        onPress={onLeftIconPress}
                        disabled={icondisable}
                        style={styles.leftIconContainer}
                        activeOpacity={0.7}
                    >
                        {leftIcon}
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={onwholePress ? 0.7 : 1}
                        onPress={onwholePress}
                        disabled={icondisable}
                        style={{ flex: 1 }}
                    >
                        <TextInput
                            ref={ref}
                            style={[
                                styles.input,
                                addnewtyle,
                                icondisable && bgv && { backgroundColor: "#E6ECF2", width: normalize(270), height: normalize(45) },
                                onlyfor && { width: normalize(270) }
                            ]}
                            value={icondisable && bgv ? notext : value}
                            onChangeText={onChangeText}
                            placeholder={''}
                            placeholderTextColor="transparent"
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
                                size={22}
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
