/**
 * Drop down header reusable component module. Provides a React Native UI building block used across screens. Exported members: DropDownHeader.
 */

import { View, Text, TouchableOpacity, TextInput, FlatList, Keyboard, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React, { memo, useState, useDeferredValue } from 'react'
import CloseIcon from 'react-native-vector-icons/AntDesign';
import Colorpath from '../Themes/Colorpath';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';

/**
 * Reusable DropDownHeader component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const DropDownHeader = ({ title, onClosePress, standardized = false }) => {
    const cleanTitle = title === 'Select Specialty(s)' ? title : dropdownPlaceholder(title);
    if (standardized) {
        return (
            <View style={dropdownStyles.header}>
                <Text numberOfLines={2} style={dropdownStyles.title}>{cleanTitle}</Text>
                <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close dropdown" onPress={() => { Keyboard.dismiss(); onClosePress?.(); }} style={dropdownStyles.close}>
                    <CloseIcon name="close" size={22} color={Colorpath.black} />
                </TouchableOpacity>
            </View>
        );
    }
    return (
        <View style={{
            height: normalize(40),
            width: normalize(330),
            backgroundColor: "#FFFFFF",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: normalize(10)
        }}>
            <Text numberOfLines={1} style={{
                fontFamily: Fonts.InterSemiBold,
                fontSize: 20,
                color: "#000000",
                fontWeight: "bold",
                width: normalize(250),
                marginLeft: normalize(10)
            }}>
                {title}
            </Text>
            <TouchableOpacity onPress={onClosePress} style={{
                padding: normalize(5),
                marginRight: normalize(15)
            }}>
                <CloseIcon
                    name="close"
                    size={25}
                    color={Colorpath.black}
                />
            </TouchableOpacity>
        </View>

    )
}

/**
 * Drop down header default export.
 *
 * @returns {*}
 */
export default DropDownHeader

// Presentation helpers shared by dropdowns; never applied to normal text inputs.
export const dropdownFieldName = label => String(label || '')
    .replace(/\*/g, '').trim()
    .replace(/^(?:Select|Selelct|Choose)\s+(?:your\s+)?/i, '')
    .replace(/Special(?:i)?t(?:y|ies)(?:\(s\)|\(ies\))?/gi, 'Specialty')
    .replace(/^(profession|country|state|city|year)$/i, name => name[0].toUpperCase() + name.slice(1).toLowerCase());
export const dropdownPlaceholder = label => `Select ${dropdownFieldName(label) || 'an option'}`;

// Opt-in dropdown controls. Existing consumers retain the legacy header.
export const DropdownSearch = memo(function DropdownSearch({ value, onChangeText, placeholder, required, ...props }) {
    const [focused, setFocused] = useState(false);
    const cleanPlaceholder = placeholder ? placeholder.replace(/\s*\*+\s*$/, '').trim()
        .replace(/Search and choose your specialties/i, 'Search Specialty')
        .replace(/Speciality/gi, 'Specialty').replace(/\s+Name$/i, '') : '';

    return (
        <View style={dropdownStyles.searchContainer}>
            <View style={[dropdownStyles.searchBox, focused && dropdownStyles.searchFocused]}>
                <CloseIcon name="search1" size={18} color="#667085" />
                <TextInput
                    {...props}
                    accessibilityLabel={cleanPlaceholder || 'Search options'}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={cleanPlaceholder}
                    placeholderTextColor="#667085"
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="search"
                    onSubmitEditing={Keyboard.dismiss}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={dropdownStyles.searchInput}
                />
                {Boolean(value) && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear search"
                    onPress={() => onChangeText?.('')} style={dropdownStyles.clear}>
                    <CloseIcon name="close" size={18} color="#667085" />
                </TouchableOpacity>}
            </View>
        </View>
    );
});

export const DropdownOption = memo(function DropdownOption({ children, onPress, selected = false, ...props }) {
    return (
        <TouchableOpacity {...props} accessibilityRole="button" accessibilityState={{ selected }}
            onPress={onPress} activeOpacity={0.7}
            style={[dropdownStyles.option, selected && dropdownStyles.selected]}>
            {children}
        </TouchableOpacity>
    );
});

export const DropdownList = memo(function DropdownList({ data, ...props }) {
    const visibleData = useDeferredValue(data);
    return <FlatList {...props} data={visibleData} keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag" initialNumToRender={16} maxToRenderPerBatch={16}
        windowSize={7} contentContainerStyle={dropdownStyles.list} />;
});

export const dropdownStyles = StyleSheet.create({
    panel: { flex: 1, backgroundColor: '#FFFFFF' },
    fieldGroup: { marginBottom: 16 },
    fieldLabel: { fontFamily: Fonts.InterRegular, fontSize: 13, color: '#667085', marginBottom: 6 },
    field: { flexDirection: 'row', alignItems: 'center', minHeight: 48, borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 10, backgroundColor: '#FFFFFF' },
    fieldDisabled: { backgroundColor: '#F2F4F7' },
    fieldValueTouch: { flex: 1, minHeight: 48, paddingHorizontal: 12, paddingVertical: 10, justifyContent: 'center' },
    placeholder: { color: '#667085' },
    header: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 8, backgroundColor: '#FFFFFF' },
    title: { flex: 1, fontFamily: Fonts.InterSemiBold, fontSize: 20, color: '#101828' },
    close: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
    searchContainer: { paddingHorizontal: 16, paddingVertical: 12 },
    searchBox: { flexDirection: 'row', alignItems: 'center', minHeight: 48, paddingHorizontal: 12, borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 10, backgroundColor: '#FFFFFF' },
    clear: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    searchFocused: { borderColor: Colorpath.ButtonColr },
    searchInput: { flex: 1, minWidth: 0, minHeight: 48, marginLeft: 10, paddingVertical: 10, paddingHorizontal: 0, fontFamily: Fonts.InterRegular, fontSize: 15, color: '#101828', textAlignVertical: 'center' },
    list: { paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1 },
    option: { flexDirection: 'row', alignItems: 'center', width: '100%', minHeight: 48, paddingHorizontal: 12, paddingVertical: 14, marginVertical: 3, justifyContent: 'flex-start', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EAECF0' },
    optionText: { fontFamily: Fonts.InterRegular, fontSize: 15, lineHeight: 22, color: '#101828', textAlign: 'left', flexShrink: 1 },
    selected: { backgroundColor: '#EEF2FF', borderRadius: 8, marginVertical: 3 },
});

// For selectors also used by protected screens: callers explicitly opt in.
export function DropdownPanel({ title, onClose, value, onChangeText, placeholder, required, data, onSelect, getLabel, ListEmptyComponent }) {
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <DropDownHeader standardized title={title} onClosePress={onClose} />
            <DropdownSearch required={required} value={value} onChangeText={onChangeText} placeholder={placeholder} maxLength={40} />
            <DropdownList data={data} keyExtractor={(item, index) => String(item?.id ?? item?.state_id ?? index)}
                ListEmptyComponent={ListEmptyComponent}
                renderItem={({ item }) => <DropdownOption onPress={() => onSelect(item)}><Text style={dropdownStyles.optionText}>{getLabel(item)}</Text></DropdownOption>} />
        </KeyboardAvoidingView>
    );
}
