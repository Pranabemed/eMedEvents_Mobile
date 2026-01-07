import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import normalize from '.././../Utils/Helpers/Dimen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RingIndicatorWave = ({ isListening, stopListening, startListening }) => {
    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Mic Button */}
            <View style={styles.micContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        console.log("Button Pressed, isListening:", isListening);
                        isListening ? stopListening() : startListening();
                    }}
                >
                    <Icon name={isListening ? 'mic-off' : 'mic'} size={44} color="#000" />
                </TouchableOpacity>
            </View>

            {/* MotiView Rings */}
            {isListening &&
                [0, 1, 2].map((index) => (
                    <MotiView
                        key={index}
                        from={{ scale: 1, opacity: 0.7 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{
                            type: 'timing',
                            duration: 2000,
                            loop: true,
                            delay: index * 500,
                        }}
                        style={[styles.ring, { borderColor: `rgba(0, 0, 0, ${0.7 - index * 0.2})` }]}
                    />
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: "box-none", // 👈 Ensures touches pass through parent
    },
    micContainer: {
        position: 'absolute',
        zIndex: 1,
        height: normalize(80),
        width: normalize(80),
        borderRadius: normalize(80),
        backgroundColor: "#DADADA",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "box-none", // 👈 Ensures TouchableOpacity is clickable
    },
    ring: {
        width: normalize(90),
        height: normalize(90),
        borderRadius: normalize(80),
        borderWidth: 0.5,
        position: 'absolute',
    },
});

export default RingIndicatorWave;
