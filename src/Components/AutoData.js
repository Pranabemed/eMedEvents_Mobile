import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';
import Colorpath from '../Themes/Colorpath';

const AddressField = ({
    label,
    value,
    placeholder,
    placeholderTextColor,
    onChangeText,
    onPlaceSelected,
    apiKey,
    containerStyle,
    labelStyle,
    wrapperStyle,
    inputStyle,
    needsbg = "no"
}) => {
    const styles = StyleSheet.create({
    inputGroup: {
        // paddingVertical:normalize(4),
        marginBottom:16,
        width: '100%',
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
    autoCompleteContainer: {
        flex: 1,
    },
    autoCompleteTextInputContainer: {
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: Fonts.InterRegular,
        color: '#000000',
        paddingVertical: normalize(8),
        paddingHorizontal:-10,
        backgroundColor:needsbg == "yes"?Colorpath.white : Colorpath.Pagebg || Colorpath.Pagebg,
    },
});
    return (
        <View style={[styles.inputGroup, containerStyle]}>
            {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
            <View style={[styles.inputWrapper, wrapperStyle]}>
                <GooglePlacesAutocomplete
                    placeholder={placeholder}
                    textInputProps={{
                        value: value,
                        onChangeText: onChangeText,
                        placeholderTextColor: value ? '#000000' : placeholderTextColor,
                        style: [styles.textInput, inputStyle],
                    }}
                    onPress={(data, details = null) => {
                        if (onPlaceSelected) {
                            onPlaceSelected(data, details);
                        }
                    }}
                    query={{
                        key: apiKey,
                        language: 'en',
                    }}
                    fetchDetails={true}
                    enablePoweredByContainer={false}
                    styles={{
                        container: styles.autoCompleteContainer,
                        textInputContainer: styles.autoCompleteTextInputContainer,
                    }}
                />
            </View>
        </View>
    );
};



export default AddressField;
