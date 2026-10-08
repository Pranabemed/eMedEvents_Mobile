/**
 * Custom input touchable x screen module. Renders a React Native screen or a screen-scoped support component. Exported members: CustomInputTouchableX.
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
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import Icon from 'react-native-vector-icons/Entypo';
import StandardDropdownField from '../../Components/IconTextIn';

/**
 * Reusable CustomInputTouchableX component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const CustomInputTouchableX = ({
    standardized = false,
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
    newFont,
    chipData = [], // New prop for chip data
    onRemoveChip // New prop for chip removal
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const animated = useRef(new Animated.Value(value || chipData.length > 0 ? 1 : 0)).current;
    useEffect(() => {
        if (standardized) return;
        Animated.timing(animated, {
            toValue: isFocused || value || chipData.length > 0 ? 1 : 0,
            duration: 100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [animated, isFocused, value, chipData, standardized]);
    console.log(chipData?.length,"chipdata=======");
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
    },
    textTouchable: {
        flex: 1,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 5,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0E0E0',
        padding: normalize(5),
        borderRadius: normalize(5),
        marginVertical: 2,
    },
    chipText: {
        fontSize: 14,
        color: '#000',
        marginRight: 5,
    },
    iconContainer: {
        left: 20,
        top:chipData?.length == 5 ? 30:chipData?.length == 4 ? 30 :chipData?.length == 3 ? 30 :10,
        height: 30,
        width: 45
    },
});
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
        return <StandardDropdownField standardized label={label} value={value} placeholder={placeholder}
            onPress={onPress} onIconpres={onIconpres} disabled={disabled}>
            {chipData.length > 0 && <View style={styles.chipContainer}>
                {chipData.map((chip, index) => <View key={index} style={styles.chip}>
                    <Text style={styles.chipText}>{chip}</Text>
                    <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Remove ${chip}`}
                        onPress={() => onRemoveChip?.(index)} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="cross" size={18} color="#667085" />
                    </TouchableOpacity>
                </View>)}
            </View>}
        </StandardDropdownField>;
    }

    return (
        <View style={[styles.inputGroup, containerStyle]}>
            <Animated.Text style={[labelAnimatedStyle, labelStyle]}>
                {label}
            </Animated.Text>

            <View style={[
                styles.inputWrapper,
                wrapperStyle,
                newstyle == "No" && { backgroundColor: "#E6ECF2" },
                { borderBottomWidth: 0.5, borderBottomColor: "#000000" }
            ]}>
                <Pressable
                    style={[styles.textTouchable, { bottom: 2 }]}
                    onPress={() => {
                        onPress?.();
                        setIsFocused(true);
                    }}
                    disabled={disabled}
                >
                    {chipData && chipData.length > 0 ? (
                        <View style={styles.chipContainer}>
                            {chipData.map((chip, index) => (
                                <View key={index} style={styles.chip}>
                                    <Text style={styles.chipText}>{chip}</Text>
                                    <TouchableOpacity onPress={() => onRemoveChip?.(index)}>
                                        <Icon name="cross" size={15} color="#000" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text
                            style={[
                                {
                                    color: value ? '#000000' : placeholderTextColor,
                                    fontSize: value ? 16 : 14,
                                    fontFamily: Fonts.InterRegular,
                                    top: 5
                                },
                                textStyle
                            ]}
                            numberOfLines={6}
                        >
                            {value || placeholder}
                        </Text>
                    )}
                </Pressable>

                {rightIcon && (
                    <TouchableOpacity
                        disabled={disabled}
                        style={styles.iconContainer}
                        onPress={() => {
                            onIconpres?.();
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
 * Custom input touchable x default export.
 *
 * @returns {*}
 */
export default CustomInputTouchableX;