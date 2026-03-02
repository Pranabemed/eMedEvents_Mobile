import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Slider } from '@rneui/themed';
import normalize from '../Utils/Helpers/Dimen';
const Sliders = ({
    value,
    max,
    valChange,
    onSlidingStart,
    handleSlidingComplete,
    fullscreen,
    containerStyle,
    minimumTrackTintColor = 'red',
    maximumTrackTintColor = '#bdc3c7',
    thumbStyle,
    trackStyle,
}) => {
    const styles = StyleSheet.create({
        contentView: fullscreen ? {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'stretch',
            paddingHorizontal: normalize(8),
            paddingVertical: normalize(4),
            bottom: Platform.OS === 'android' ? normalize(2) : 0,
        } : {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'stretch',
            paddingHorizontal: normalize(4),
        },
    });
    return (
        <>
            <View style={[styles.contentView, containerStyle]}>
                <Slider
                    value={value}
                    onValueChange={valChange}
                    onSlidingStart={onSlidingStart}
                    onSlidingComplete={handleSlidingComplete}
                    maximumValue={max}
                    minimumValue={0}
                    step={0}
                    minimumTrackTintColor={minimumTrackTintColor}
                    maximumTrackTintColor={maximumTrackTintColor}
                    thumbStyle={thumbStyle || {
                        height: 12,
                        width: 12,
                        backgroundColor: 'red',
                    }}
                    trackStyle={trackStyle || { height: 4, borderRadius: 4 }}
                />
            </View>
        </>
    );
};



export default Sliders;
