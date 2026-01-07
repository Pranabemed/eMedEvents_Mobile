import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import normalize from '../Utils/Helpers/Dimen';
import Colorpath from '../Themes/Colorpath';

const CustomPaymentradio = ({walletmo, options, onSelect, stylechange,selectedOption,setSelectedOption}) => {
    console.log(stylechange, "stylechange======")
    useEffect(() => {
        if (options.length > 0 && selectedOption === null) {
            setSelectedOption(options[0].id);
            onSelect(options[0]); 
        }
    }, []);
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
            marginVertical: normalize(5),
            width: normalize(290),
            paddingHorizontal: normalize(15),
            height: normalize(50),
            borderWidth: 0.5,
            borderColor: "#AAAAAA",
            backgroundColor: Colorpath.white,
            borderRadius: normalize(10)
        },
        radioCircle: {
            height: normalize(20),
            width: normalize(20),
            borderRadius: normalize(10),
            borderWidth: 2,
            borderColor: '#2C4DB9',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: normalize(10),
        },
        selectedRbCircle: {
            height: normalize(10),
            width: normalize(10),
            borderRadius: normalize(5),
            backgroundColor: '#2C4DB9',
        },
        radioText: {
            fontSize: 16,
            color: '#333',
        },
    });
    return (
        <View style={styles.container}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={option.id}
                    style={[
                        styles.radioButton,
                        selectedOption === option.id && { borderColor: Colorpath.ButtonColr },
                        index % 2 === 0 && { marginRight: normalize(10) }
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

export default CustomPaymentradio;


