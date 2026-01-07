import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import normalize from '../../Utils/Helpers/Dimen'; // adjust your import path

const CustomInputTouchableZ = ({
    label,
    value,
    placeholder,
    placeholderTextColor = '#949494',
    rightIcon,
    onPress,
    onIconpres,
    children, // 👈 new addition: for chips or dynamic child content
    containerStyle,
    inputStyle,
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {/* Touchable input area */}
            <TouchableOpacity
                style={[inputStyle]}
                activeOpacity={0.8}
                onPress={onPress}
            >
                {label ? (
                    <Text style={styles.labelText}>{label}</Text>
                ) : null}

                <Text
                    style={[
                        styles.valueText,
                        { color: value ? '#000' : placeholderTextColor },
                    ]}
                    numberOfLines={1}
                >
                    {value || placeholder}
                </Text>
            </TouchableOpacity>

            {/* Right icon pinned top-right */}
            {rightIcon && (
                <TouchableOpacity
                    style={styles.iconContainer}
                    activeOpacity={0.8}
                    onPress={onIconpres || onPress}
                >
                    {rightIcon}
                </TouchableOpacity>
            )}

            {/* Children (chips or sub-content) below input */}
            {children ? <View style={styles.childContainer}>{children}</View> : null}
        </View>
    );
};

export default CustomInputTouchableZ;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
    },
    inputBox: {
        // borderWidth: 1,
        // borderColor: '#ccc',
        // borderRadius: normalize(5),
        // padding: normalize(10),
        // paddingRight: normalize(35), // space for icon
    },
    labelText: {
        fontSize: normalize(12),
        color: '#000',
        marginBottom: normalize(4),
    },
    valueText: {
        fontSize: normalize(12),
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
    },
});
