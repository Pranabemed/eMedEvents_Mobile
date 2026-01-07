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

const CustomInputTouchable = ({
    label,
    value,
    placeholder,
    placeholderTextColor,
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
        Animated.timing(animated, {
            toValue: isFocused || value ? 1 : 0,
            duration: 100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);
    console.log(newFont, "newFont======")
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


    return (
        <View style={[styles.inputGroup, containerStyle]}>
            <Animated.Text style={[labelAnimatedStyle, labelStyle]}>
                {label}
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
                    style={[styles.textTouchable, { bottom: 2 }]}
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
                                top: 12
                            },
                            textStyle
                        ]}
                        numberOfLines={6}
                    >
                        {value ? value : placeholder}
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

export default CustomInputTouchable;