import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
    Pressable,
    Alert
} from 'react-native';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import Icon from 'react-native-vector-icons/Entypo';

const CustomInputTouchableY = ({
    label,
    value,
    placeholder,
    placeholderTextColor,
    rightIcon,
    onPress,
    onIconpres,
    disabled,
    chipData = [], // array of names
    children,
    index,
    formData
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const animated = useRef(new Animated.Value(value || chipData.length > 0 ? 1 : 0)).current;
    useEffect(() => {
        Animated.timing(animated, {
            toValue: isFocused || value || chipData.length > 0 ? 1 : 0,
            duration: 100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [isFocused, value, chipData]);
    console.log(chipData, "chidate----------", value, formData)
    const styles = StyleSheet.create({
        inputGroup: {
            marginBottom: 10,
            position: 'relative',
            paddingTop: 15,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
            minHeight: normalize(45),
            borderBottomWidth: 0.5,
            borderBottomColor: "#000000",
            // backgroundColor:"red"
        },
        textTouchable: { flex: 1 },
        chipContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 5,
        },
        iconContainer: {
            position: 'absolute',
            bottom: 0,
            right: -10,
            height: 45,
            width: 45,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
        },
        childContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: normalize(8),
            marginRight: normalize(30),
            // backgroundColor:"yellow"
        },
    });
    const getLabelAnimatedStyle = (index, animated) => ({
        position: 'absolute',
        left: 0,
        // Each label gets its own base top offset depending on index
        top: formData[index]?.speciality?.length > 0 ? 0 : 22, // <-- dynamically adjusts (you can tweak 40 to your layout spacing)
        transform: [
            {
                translateY: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 4],
                }),
            },
        ],
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        color: '#999999',
    });

    return (<TouchableOpacity onPress={() => {
        onPress?.(index);
        setIsFocused(true);
    }}>
        <View style={styles.inputGroup}>
            {/* Floating Label */}
            <Animated.Text style={getLabelAnimatedStyle(index, animated)}>
                {label}
            </Animated.Text>

            {/* Touchable Wrapper */}
            <View style={styles.inputWrapper}>
                <Pressable
                    style={[styles.textTouchable, { bottom: 2 }]}
                    onPress={() => {
                        onPress?.(index);
                        setIsFocused(true);
                    }}
                    disabled={disabled}
                >
                    <Text
                        style={{
                            color: value ? '#000000' : placeholderTextColor,
                            fontSize: value ? 16 : 14,
                            fontFamily: Fonts.InterRegular,
                            top: 5,
                        }}

                    >
                        {value || placeholder}
                    </Text>
                </Pressable>
                {children ? <View style={styles.childContainer}>{children}</View> : null}
                {/* Dropdown Icon */}
                {rightIcon && (
                    <TouchableOpacity
                        disabled={disabled}
                        style={styles.iconContainer}
                        onPress={() => {
                            onIconpres?.(index);
                            setIsFocused(true);
                        }}
                        activeOpacity={0.7}
                    >
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    </TouchableOpacity>
    );
};



export default CustomInputTouchableY;
