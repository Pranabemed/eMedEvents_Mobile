import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Slider } from '@rneui/themed';
import normalize from '../Utils/Helpers/Dimen';
const Sliders = ({ value, max, valChange, handleSlidingComplete,fullscreen }) => {
    const styles = StyleSheet.create({
    contentView:fullscreen ? {
        padding: normalize(10),
        width: normalize(498),
        justifyContent: 'center',
        alignItems: 'stretch',
        // backgroundColor:"rgba(0,0,0,0.5)",
        marginLeft:Platform.OS === 'ios'? normalize(-10): normalize(0),
        bottom:Platform.OS ==='android'? normalize(50):normalize(20)
    }:{ 
        width: normalize(300),
        justifyContent: 'center',
        alignItems: 'stretch',
        marginLeft:normalize(10)
    },
});
    return (
        <>
            <View style={styles.contentView}>
                <Slider
                    value={value}
                    onValueChange={valChange}
                    onSlidingComplete={handleSlidingComplete}
                    maximumValue={max}
                    minimumValue={0}
                    step={1}
                    minimumTrackTintColor="red"
                    maximumTrackTintColor="#bdc3c7"
                    thumbStyle={{
                        height: 12,
                        width: 12,
                        backgroundColor: 'red'
                    }}
                    trackStyle={{ height: 4 }}
                />
            </View>
        </>
    );
};



export default Sliders;
