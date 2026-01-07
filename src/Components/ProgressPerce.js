import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import normalize from "../Utils/Helpers/Dimen";

const ProgressBarLine = ({needwidth,textadd, progress, height = 10, backgroundColor = '#e0e0e0', fillColor = '#3b5998', tasks }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: progress,
            duration: 500, // Adjust the duration for smoothness
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const widthInterpolated = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    const styles = StyleSheet.create({
        outerContainer: {
            flexDirection: tasks ? "column" : 'row',
            alignItems: 'center',
            justifyContent: tasks ? "center" : 'space-between',
            width:needwidth ? normalize(285) :normalize(120),
            marginTop: tasks ? normalize(10) : 0
        },
        container: {
            flex: 1,
            borderRadius: 10,
            overflow: 'hidden',
            width: tasks ? "100%" : 0
        },
        fill: {
            borderRadius: 10,
        },
        percentageText: {
            fontFamily: Fonts.InterMedium,
            fontSize: 12,
            color: tasks ? Colorpath.ButtonColr : Colorpath.green,
            marginLeft: tasks ? 0 : 10,
            marginTop: tasks ? normalize(10) : 0
        },
    });

    return (
        <View style={styles.outerContainer}>
           
                <>
                    <View style={[styles.container, { height, backgroundColor }]}>
                        <Animated.View
                            style={[
                                styles.fill,
                                {
                                    height,
                                    width: widthInterpolated,
                                    backgroundColor: fillColor,
                                },
                            ]}
                        />
                    </View>
                    {textadd == "yes" ?<Text style={styles.percentageText}>
                        {`${progress}% completed`}
                    </Text>:null}
                </>
            
        </View>
    );
};

export default ProgressBarLine;
