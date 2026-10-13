/**
 * Icon text in reusable component module. Provides a React Native UI building block used across screens. Exported members: CustomInputTouchable, styles.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
    Pressable
} from 'react-native';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import DropdownIcon from 'react-native-vector-icons/MaterialIcons';
import { dropdownStyles, dropdownFieldName, dropdownPlaceholder } from './DropDownHeader';

/**
 * Reusable CustomInputTouchable component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const CustomInputTouchable = ({
    standardized = false,
    children,
    label,
    value,
    placeholder,
    placeholderTextColor = "#949494",
    rightIcon,
    onPress,
    containerStyle,
    labelStyle,
    wrapperStyle,
    textStyle,
    disabled,
    onIconpres,
    newstyle,
    newFont
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const animated = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        if (standardized) return;
        Animated.timing(animated, {
            toValue: isFocused || value ? 1 : 0,
            duration: 100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [animated, isFocused, value, standardized]);

    const labelAnimatedStyle = {
        position: 'absolute',
        left: 0,
        top: 20,
        transform: [
            {
                translateY: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, -19],
                }),
            },
        ],
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        color: "#999999",
    };


    if (standardized) {
        const cleanLabel = dropdownFieldName(label);
        const formattedPlaceholder = dropdownPlaceholder(cleanLabel);
        return (
            <View style={[dropdownStyles.fieldGroup, containerStyle]}>
                <Text style={dropdownStyles.fieldLabel}>{cleanLabel}</Text>
                <View style={[dropdownStyles.field, disabled && dropdownStyles.fieldDisabled, wrapperStyle]}>
                    <TouchableOpacity accessibilityRole="button" accessibilityLabel={label}
                        accessibilityState={{ disabled: Boolean(disabled) }} disabled={disabled}
                        onPress={onPress} style={dropdownStyles.fieldValueTouch}>
                        {children || <Text style={[dropdownStyles.optionText, !value && dropdownStyles.placeholder]} numberOfLines={2}>
                            {value || formattedPlaceholder}
                        </Text>}
                    </TouchableOpacity>
                    <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Open ${label || 'options'}`}
                        disabled={disabled} onPress={onIconpres || onPress} style={dropdownStyles.close}>
                        <DropdownIcon name="keyboard-arrow-down" size={22} color="#667085" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const isDropdown = /down/i.test(rightIcon?.props?.name || '');
    const displayLabel = isDropdown ? (value || isFocused ? dropdownFieldName(label) : dropdownPlaceholder(label)) : label;
    const displayText = value ? value : (isFocused || !label ? (isDropdown ? dropdownPlaceholder(label) : placeholder) : '');

    return (
        <View style={[styles.inputGroup, containerStyle]}>
            <Animated.Text style={[labelAnimatedStyle, labelStyle]}>
                {displayLabel}
            </Animated.Text>

            <View style={newstyle == "No" ? [
                styles.inputWrapper,
                wrapperStyle, { backgroundColor: "#E6ECF2" },
                {
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#000000"
                }
            ] : [
                styles.inputWrapper,
                wrapperStyle,
                {
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#000000"
                }
            ]}>
                <Pressable
                    style={[styles.textTouchable, { justifyContent: 'center' }]}
                    onPress={() => {
                        onPress && onPress();
                        setIsFocused(true);
                    }}
                    disabled={disabled}
                >
                    <Text
                        style={[
                            {
                                color: value ? '#000000' : placeholderTextColor,
                                fontSize: value ? 16 : 14,
                                fontFamily: Fonts.InterRegular,
                                includeFontPadding: false,
                            },
                            textStyle
                        ]}
                        numberOfLines={6}
                    >
                        {displayText}
                    </Text>
                </Pressable>

                {rightIcon && (
                    <TouchableOpacity
                        disabled={disabled}
                        style={styles.iconContainer}
                        onPress={() => {
                            onIconpres && onIconpres();
                            setIsFocused(true);
                        }}
                        activeOpacity={0.7}
                    >
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 10,
        position: 'relative',
        paddingTop: 15,
    },
    label: {
        fontSize: 14,
        fontFamily: Fonts.InterRegular,
        color: '#999999',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        height: normalize(45),
    },
    textTouchable: {
        flex: 1,
    },
    displayText: {
        fontSize: 14,
        fontFamily: Fonts.InterRegular,
        top: 5
    },
    iconContainer: {
        left: 20,
        top: 5,
        height: 30,
        width: 45
    },
});

/**
 * Icon text in default export.
 *
 * @returns {*}
 */
export default CustomInputTouchable;
