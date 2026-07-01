/**
 * New text in reusable component module. Provides a React Native UI building block used across screens. Exported members: CustomInput, handleRightIconPress, styles.
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';

/**
 * Reusable CustomInput component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const CustomInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    placeholderTextColor = "RGB(170, 170, 170)",
    rightIcon,
    onRightIconPress,
    containerStyle,
    inputStyle,
    labelStyle,
    wrapperStyle,
    maxlength,
    editab,
    ...props
}) => {

    const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
        /**
 * Handles right icon press.
 * @returns {void}
 */
const handleRightIconPress = () => {
        if (inputRef.current && isFocused) {
            inputRef.current.blur();
        }
        if (onRightIconPress) {
            onRightIconPress();
        }
    };
   
    return (
        <View style={[styles.inputGroup, containerStyle]}>
            {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
            <View style={[styles.inputWrapper, wrapperStyle]}>
                <TextInput
                    editable={editab}
                    ref={inputRef}
                    style={[styles.inputd, rightIcon && styles.inputWithRightIcon]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    maxLength={maxlength || 100}
                />
                {rightIcon && (
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={handleRightIconPress}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
    },
    label: {
        fontSize: 14,
        fontFamily: Fonts.InterRegular,
        color: '#999999',
    },
    inputWrapper: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#000000',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputd: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        fontFamily: Fonts.InterRegular,
        color: '#000000',
        paddingHorizontal: -10
    },
    iconContainer: {
        padding: 0,
        marginLeft: 8,
    },
});

/**
 * New text in default export.
 *
 * @returns {*}
 */
export default CustomInput;