import React, { useState, useRef, useEffect, forwardRef } from 'react';
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

// ---------------------------------------------------------------------------
// CellInput – floating-label TextInput
//
// Key fix for "Cannot add a new property" crash:
//   labelTop / labelLeft are Animated.Node interpolations.
//   Passing them inside a plain <View> style causes RN's animation system
//   to try attaching tracking metadata to a frozen native node → crash.
//   Solution: use <Animated.View pointerEvents="none"> as the label
//   container. Animated.View properly handles animated style values AND
//   pointerEvents="none" works reliably on it for both iOS & Android.
//
// Single-tap fix:
//   Outer / inner TouchableOpacity wrappers in the leftIcon path are
//   replaced with plain <View> when onwholePress is absent, so the first
//   touch always reaches the TextInput directly.
// ---------------------------------------------------------------------------

const InputField = forwardRef((
    {
        spaceneeded,
        label,
        value,
        onChangeText,
        placeholder,
        placeholderTextColor = '#949494',
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
        underlineColor = '#000000',
        activeUnderlineColor,
        outlineColor,
        activeOutlineColor,
        underlineHeight = 0.6,
        labelColor = '#999999',
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
    },
    ref
) => {
    const [isFocused, setIsFocused] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(!!isPassword);
    const animated = useRef(new Animated.Value(value ? 1 : 0)).current;

    const isActive = isFocused || !!value;

    useEffect(() => {
        Animated.timing(animated, {
            toValue: isActive ? 1 : 0,
            duration: 150,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,   // required – we animate layout props
        }).start();
    }, [isFocused, value]);

    const toggleSecureEntry = () => setSecureTextEntry(prev => !prev);

    // ── Animated interpolations ───────────────────────────────────────────────
    const labelTop = animated.interpolate({
        inputRange: [0, 1],
        outputRange: [normalize(22), normalize(0)],
    });
    const labelFontSize = animated.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 14],
    });
    const labelColorAnimated = animated.interpolate({
        inputRange: [0, 1],
        outputRange: ['#999999', '#333333'],
    });
    // Country-code fields: label rests after "+91 -" and sweeps to left:0 on focus.
    const labelLeft = animated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            showCountryCode && countryCode ? normalize(50) : 0,
            0,
        ],
    });

    // ── Floating label ─────────────────────────────────────────────────────────
    // MUST be Animated.View (not plain View) so that animated style values
    // (labelTop, labelLeft) are handled correctly by RN without crashing.
    // pointerEvents="none" on Animated.View works reliably on Android & iOS.
    const floatingLabelNode = (text) => (
        <Animated.View
            pointerEvents="none"
            style={[
                staticStyles.labelContainer,
                { top: labelTop, left: labelLeft },
                labelStyle,
            ]}
        >
            <Animated.Text
                style={{
                    fontSize: labelFontSize,
                    fontFamily: Fonts.InterRegular,
                    color: labelColorAnimated,
                }}
            >
                {text}
            </Animated.Text>
        </Animated.View>
    );

    // ── Country-code prefix ───────────────────────────────────────────────────
    const countryCodeNode = countryCode ? (
        <TouchableOpacity
            style={staticStyles.countryCodeContainer}
            onPress={onCountryCodePress}
            disabled={!onCountryCodePress}
            hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
        >
            <Text style={staticStyles.countryCodeText}>
                {countryCode} {'-'}
            </Text>
        </TouchableOpacity>
    ) : null;

    // ── Eye toggle ────────────────────────────────────────────────────────────
    const eyeToggle = isPassword ? (
        <TouchableOpacity
            style={staticStyles.iconContainer}
            onPress={toggleSecureEntry}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.6}
        >
            <EyeIcon
                name={secureTextEntry ? 'eye-with-line' : 'eye'}
                color="#949494"
                size={22}
            />
        </TouchableOpacity>
    ) : null;

    // ── Simple input (no leftIcon) ────────────────────────────────────────────
    if (!leftIcon) {
        return (
            <View style={[staticStyles.inputGroup, containerStyle]}>
                <View style={[staticStyles.inputWrapper, wrapperStyle]}>

                    {floatingLabelNode(label)}

                    {countryCodeNode}

                    <TextInput
                        ref={ref}
                        style={[
                            icondisable && bgv
                                ? staticStyles.inputDisabled
                                : staticStyles.input,
                            addnewtyle,
                        ]}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder=""
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

                    {eyeToggle}
                </View>
            </View>
        );
    }

    // ── Input WITH leftIcon ───────────────────────────────────────────────────
    // Build the TextInput node once; used in both branches below.
    const textInputNode = (
        <TextInput
            ref={ref}
            style={[
                staticStyles.input,
                addnewtyle,
                icondisable && bgv && {
                    backgroundColor: '#E6ECF2',
                    width: normalize(270),
                    height: normalize(45),
                },
                onlyfor && { width: normalize(270) },
            ]}
            value={icondisable && bgv ? notext : value}
            onChangeText={onChangeText}
            placeholder=""
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
    );

    // Inner wrapper: TouchableOpacity only when onwholePress provided.
    // A TouchableOpacity with no meaningful onPress still delays the first
    // touch by one gesture cycle → field requires two taps to focus.
    const innerWrapper = onwholePress ? (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onwholePress}
            disabled={icondisable}
            style={{ flex: 1 }}
        >
            {textInputNode}
        </TouchableOpacity>
    ) : (
        <View style={{ flex: 1 }}>
            {textInputNode}
        </View>
    );

    // Shared row content
    const rowContent = (
        <View style={[staticStyles.inputWrapper, wrapperStyle]}>

            {floatingLabelNode(icondisable && bgv ? '' : label)}

            {countryCodeNode}

            <TouchableOpacity
                onPress={onLeftIconPress}
                disabled={icondisable}
                style={[
                    icondisable && bgv
                        ? staticStyles.leftIconContainerDisabled
                        : staticStyles.leftIconContainer,
                    { marginLeft: marginleft || 0 },
                ]}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                {leftIcon}
            </TouchableOpacity>

            {innerWrapper}

            {eyeToggle}
        </View>
    );

    // Outer container: TouchableOpacity only when onwholePress provided.
    if (onwholePress) {
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onwholePress}
                disabled={icondisable}
                style={[staticStyles.inputGroup, containerStyle]}
            >
                {rowContent}
            </TouchableOpacity>
        );
    }

    return (
        <View style={[staticStyles.inputGroup, containerStyle]}>
            {rowContent}
        </View>
    );
});

InputField.displayName = 'InputField';

// ---------------------------------------------------------------------------
// Static styles – created once at module load, never inside render.
// ---------------------------------------------------------------------------
const staticStyles = StyleSheet.create({
    inputGroup: {
        marginBottom: normalize(16),
        width: '100%',
        position: 'relative',
    },
    inputWrapper: {
        borderBottomWidth: 0.8,
        borderBottomColor: '#000000',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: normalize(24),
        paddingBottom: normalize(6),
        position: 'relative',
    },
    labelContainer: {
        position: 'absolute',
    },
    countryCodeContainer: {
        paddingRight: 4,
        paddingBottom: 0,
    },
    countryCodeText: {
        fontSize: 15,
        fontFamily: Fonts.InterRegular,
        color: '#000000',
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: Fonts.InterRegular,
        color: '#000000',
        padding: 0,
        paddingHorizontal: 0,
        minHeight: Platform.OS === 'android' ? normalize(24) : undefined,
    },
    inputDisabled: {
        flex: 1,
        fontSize: 14,
        fontFamily: Fonts.InterRegular,
        color: '#999',
        padding: 0,
        paddingHorizontal: 0,
    },
    iconContainer: {
        position: 'absolute',
        right: 0,
        bottom: normalize(8),
    },
    leftIconContainer: {
        position: 'absolute',
        bottom: normalize(8),
    },
    leftIconContainerDisabled: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#E6ECF2',
        height: normalize(45),
        width: normalize(20),
    },
});

export default InputField;
