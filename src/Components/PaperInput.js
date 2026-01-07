import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    Animated,
    StyleSheet,
    Easing,
    Pressable,
    Text,
    TouchableOpacity,
} from 'react-native';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';

const CustomInputs = ({
    mode,
    label,
    value,
    onChangeText,
    placeholder,
    underlineColor,
    activeUnderlineColor,
    outlineColor,
    activeOutlineColor,
    underlineHeight,
    labelColor,
    activeLabelColor,
    rippleColor,
    style,
    maxLength,
    countryCode,
    showCountryCode,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const animated = useRef(new Animated.Value(value ? 1 : 0)).current;
    const rippleScale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animated, {
            toValue: isFocused || value ? 1 : 0,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);

    const labelStyle = {
        position: 'absolute',
        left: 0,
        transform: [
            {
                translateY: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, -2],
                }),
            },
        ],
        fontFamily: Fonts.InterRegular,
        fontSize: 16,
        color: '#999999',
    };

    return (
        <Pressable
            style={[
                styles.container,
                mode === 'outlined'
                    ? {
                        borderBottomWidth: 0.5,
                        borderBottomColor: '#000000',
                        paddingTop: 10,
                    }
                    : { paddingTop: 10 },
            ]}
        >
            <Animated.Text style={labelStyle}>{label}</Animated.Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isFocused ? placeholder : ''}
                placeholderTextColor="#949494"
                maxLength={maxLength}
                keyboardType="number-pad"
                {...props}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        // alignItems: 'center',
    },
    countryCode: {
        fontSize: 16,
        fontFamily: Fonts.InterRegular,
        color: '#000',
        borderBottomWidth: 0.5,
        borderBottomColor: '#000000',
    },
    input: {
        height: 50,
        fontSize: 16,
        fontFamily: Fonts.InterRegular,
        borderBottomWidth: 0.5,
        borderBottomColor: '#000000',
        paddingHorizontal: 0,
        flex: 1, // take remaining width
    },
});

export default CustomInputs;
