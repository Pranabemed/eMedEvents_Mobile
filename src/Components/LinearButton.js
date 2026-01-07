import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import normalize from '../Utils/Helpers/Dimen';

const GradientButton = ({width,take}) => {
    const styles = StyleSheet.create({
        buttonContainertake: {
            marginRight:normalize(20),
            borderRadius: normalize(10),
        },
        buttonContainer: {
            borderRadius: normalize(10),
        },
        gradient: {
             height:normalize(5),
             width: width ? normalize(60):normalize(80),
            borderRadius: normalize(5),
        },
    });
    return (
        <View style={take ? styles.buttonContainertake:styles.buttonContainer}>
            <LinearGradient
                colors={['#2444A8', '#01AEEF']} 
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
            </LinearGradient>
        </View>
    );
};



export default GradientButton;
