import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
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

export default CustomInput;