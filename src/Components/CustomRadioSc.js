
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import normalize from '../Utils/Helpers/Dimen'; 

const CustomRadioButtons = ({ options, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleSelect = (option) => {
        setSelectedOption(option.id);
        onSelect(option);
    };

    return (
        <View style={styles.container}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={option.id}
                    style={[
                        styles.radioButton,
                        selectedOption === option.id ,
                        index % 2 === 0 && { marginRight: normalize(10) } 
                    ]}
                    onPress={() => handleSelect(option)}
                >
                    <View style={styles.radioCircle}>
                        {selectedOption === option.id && <View style={styles.selectedRbCircle} />}
                    </View>
                    <Text style={styles.radioText}>{option.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default CustomRadioButtons;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: normalize(5),
        width: '48%', 
        paddingHorizontal: normalize(15),
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
    selectedRadioButton: {
        // borderColor: '#2C4DB9',
        // backgroundColor: '#E0EFFF',
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
