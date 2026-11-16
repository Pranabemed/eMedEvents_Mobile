/**
 * Custom radio reusable component module. Provides a React Native UI building block used across screens. Exported members: CustomPaymentradio, handleSelect.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import normalize from '../Utils/Helpers/Dimen';
import Colorpath from '../Themes/Colorpath';

/**
 * Reusable CustomPaymentradio component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const CustomPaymentradio = ({walletmo, options, onSelect, stylechange,selectedOption,setSelectedOption}) => {
    console.log(stylechange, "stylechange======")
    useEffect(() => {
        if (options.length > 0 && selectedOption === null) {
            setSelectedOption(options[0].id);
            onSelect(options[0]); 
        }
    }, []);
        /**
 * Handles select.
 * @param {*} option - Input value.
 * @returns {void}
 */
const handleSelect = (option) => {
        console.log(option, '0000otp')
        setSelectedOption(option.id);
        onSelect(option);
    };
    const styles = StyleSheet.create({
        container: {
            flexDirection: "column",
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems:"center"
        },
        radioButton: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: normalize(4),
            width: normalize(295),
            paddingHorizontal: normalize(14),
            height: normalize(40),
            borderWidth: 0.8,
            borderColor: "#D1D5DB",
            backgroundColor: Colorpath.white,
            borderRadius: normalize(8)
        },
        radioCircle: {
            height: normalize(18),
            width: normalize(18),
            borderRadius: normalize(9),
            borderWidth: 1.8,
            borderColor: '#2C4DB9',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: normalize(10),
        },
        selectedRbCircle: {
            height: normalize(9),
            width: normalize(9),
            borderRadius: normalize(4.5),
            backgroundColor: '#2C4DB9',
        },
        radioText: {
            fontSize: normalize(14.5),
            color: '#1E293B',
        },
    });
    return (
        <View style={styles.container}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={option.id}
                    style={[
                        styles.radioButton,
                        selectedOption === option.id && { borderColor: Colorpath.ButtonColr }
                    ]}
                    onPress={() => handleSelect(option)}
                >
                    <View style={styles.radioCircle}>
                        {selectedOption === option.id && <View style={styles.selectedRbCircle} />}
                    </View>
                    <Text style={[styles.radioText, { marginRight: normalize(10) }]}>{option.label}</Text>
                    {option?.label === "Wallet Balance"? (
                        <><View style={{ flex: 1 }}/><Text style={styles.radioText}>{`$${walletmo}`}</Text></>
                    ) : null}
                </TouchableOpacity>
            ))}
        </View>

    );
};

/**
 * Custom radio default export.
 *
 * @returns {*}
 */
export default CustomPaymentradio;


