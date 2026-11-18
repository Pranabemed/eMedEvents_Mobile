
/**
 * State moda reusable component module. Provides a React Native UI building block used across screens. Exported members: StateModa, handleDone, styles.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import VerifiedCheck from 'react-native-vector-icons/AntDesign';
import { CommonActions } from '@react-navigation/native';

/**
 * Reusable StateModa component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const StateModa = ({ isVisible, onClose, content, navigation, profile, isEditLicenseFlow = false }) => {
    const pressed = useRef(false);
    useEffect(() => {
        if (isVisible) {
            pressed.current = false;
        }
    }, [isVisible]);

        /**
 * Handles done.
 * @returns {void}
 */
const handleDone = () => {
        if (pressed.current) return;   // block double-tap
        pressed.current = true;

        if (profile == "text") {
            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "StateProfile", params: { state: "nodata" } }] }));
        } else {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "TabNav", params: { initialRoute: "Home", detectmain: "newadd", refreshLicensesAt: Date.now(), suppressAutomaticPrimePrompt: isEditLicenseFlow } }]
                })
            );
        }

        // Delay closing the modal internally so it remains visible over the parent screen just long enough 
        // to cover the native React Navigation animation transition, preventing the under-screen flash!
        setTimeout(() => {
            onClose();
        }, 400);
    };
    return (
        <Modal
            isVisible={isVisible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropTransitionOutTiming={0}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            style={styles.modal}
        >
            <View style={styles.container}>
                <View style={{
                    width: normalize(64),
                    height: normalize(64),
                    borderRadius: normalize(32),
                    backgroundColor: "#ECFDF5",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: normalize(14)
                }}>
                    <VerifiedCheck name="checkcircle" size={normalize(38)} color="#10B981" />
                </View>
                <View style={{ marginBottom: normalize(18) }}>
                    <Text style={styles.content}>{content}</Text>
                </View>
                <TouchableOpacity onPress={handleDone} style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: normalize(40),
                    minWidth: normalize(120),
                    paddingHorizontal: normalize(22),
                    borderRadius: normalize(10),
                    backgroundColor: Colorpath.ButtonColr || "#003B6D",
                    shadowColor: Colorpath.ButtonColr || "#003B6D",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: normalize(13.5), color: Colorpath.white, fontWeight: "600" }}>{"Done"}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    container: {
        width: normalize(300),
        backgroundColor: Colorpath.white,
        borderRadius: normalize(16),
        paddingVertical: normalize(24),
        paddingHorizontal: normalize(20),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
    },
    closeIcon: {
        position: 'absolute',
        top: normalize(10),
        right: normalize(10),
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        height: normalize(25),
        width: normalize(25),
        borderRadius: normalize(25),
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(14.5),
        color: "#1E293B",
        textAlign: 'center',
        lineHeight: normalize(21),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        width: normalize(280),
        paddingVertical: normalize(10),
        marginTop: normalize(15),
    },
    button: {
        backgroundColor: Colorpath.white,
        borderRadius: normalize(5),
        height: normalize(40),
        width: normalize(140),
        justifyContent: 'center',
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2C4DB9",
    },
    singlebutton: {
        backgroundColor: Colorpath.ButtonColr,
        borderRadius: normalize(5),
        height: normalize(40),
        width: normalize(295),
        justifyContent: 'center',
        alignSelf: "center",
    },
    buttonText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 16,
        color: Colorpath.ButtonColr,
        textAlign: "center",
    },
});


/**
 * State moda default export.
 *
 * @returns {*}
 */
export default StateModa;
