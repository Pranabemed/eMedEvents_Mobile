import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import Svg, { Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
const CircularProgress = ({ percentage }) => {
    const size = 150;
    const strokeWidth = 7;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * percentage) / 100;

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
            <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#009E38" stopOpacity="1" />
            <Stop offset="100%" stopColor="#A3FFC3" stopOpacity="1" />
          </LinearGradient>
        </Defs>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    <Circle
                        stroke="#FFFFFF"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        stroke="url(#grad)" 
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                    />
                </G>
            </Svg>
            <View style={styles.textView}>
                <View style={{flexDirection:"row"}}>
                <Text style={styles.text}>{`${percentage}`}</Text>
                <Text style={{color:"#666",fontFamily:Fonts.InterBold,fontSize:22,paddingVertical:normalize(8)}}>
                    {"%"}
                </Text>
                </View>
                
                <Text style={styles.label}>{"Compliant"}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textView: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: normalize(0.5),
        shadowRadius: normalize(8),
        shadowOffset: { width: 0, height: 0 },
        shadowColor: Platform.OS === 'ios' ? "#009E38" : "#009E38",
        elevation: normalize(5),
        backgroundColor:"#FFFFFF",
        height:normalize(90),
        width:normalize(90),
        borderRadius:normalize(90)
    },
    text: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
    },
    label: {
        fontSize: 14,
        color: '#666',
        fontFamily:Fonts.InterMedium,
      fontWeight:"bold"
    },
});

export default CircularProgress;
