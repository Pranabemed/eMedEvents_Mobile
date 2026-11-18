/**
 * Register modal reusable component module. Provides a React Native UI building block used across screens. Exported members: GUEST_PROMPT_KEYS, RegisterModal, handleDismiss, styles.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import VerifiedCheck from 'react-native-vector-icons/AntDesign';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../Utils/Helpers/constants';

/**
 * Reusable RegisterModal component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const GUEST_PROMPT_KEYS = [
    'GUEST_PRIME_VERIFICATION_PENDING',
    'CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION',
];

/**
 * Register modal component.
 * @param {Object} props - Input object.
 * @param {*} props.isVisible - Nested property value.
 * @param {*} props.onClose - Nested property value.
 * @param {*} props.navigation - Nested property value.
 * @returns {JSX.Element}
 */
const RegisterModal = ({ isVisible, onClose, navigation }) => {
        /**
 * Handles dismiss.
 *
 * @async
 * @returns {Promise<*>}
 */
const handleDismiss = async () => {
        try {
            await AsyncStorage.multiRemove(GUEST_PROMPT_KEYS);
            const token = await AsyncStorage.getItem(constants.TOKEN);

            if (token) {
                navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [{ name: "TabNav" }]
                }));
            }
        } catch (error) {
            console.log('[RegisterModal] guest prompt cleanup error', error);
        }

        onClose();
    };

    return (
        <Modal
            isVisible={isVisible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropTransitionOutTiming={0}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            onBackButtonPress={handleDismiss}
            onBackdropPress={handleDismiss}
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
                
                <Text style={styles.titleText}>{"Thank you for your interest!"}</Text>
                
                <Text style={styles.descriptionText}>
                    {"We’ve noted your request and will notify you as soon as registration opens for this conference."}
                </Text>
                
                <TouchableOpacity
                    onPress={handleDismiss}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>{"Done"}</Text>
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
        width: normalize(310),
        backgroundColor: Colorpath.white,
        borderRadius: normalize(16),
        paddingVertical: normalize(24),
        paddingHorizontal: normalize(20),
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
    },
    titleText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(16),
        color: "#0F172A",
        textAlign: 'center',
        marginTop: normalize(5),
        marginBottom: normalize(8),
        fontWeight: "600",
    },
    descriptionText: {
        fontFamily: Fonts.InterRegular,
        fontSize: normalize(13),
        color: "#64748B",
        textAlign: 'center',
        marginBottom: normalize(20),
        lineHeight: normalize(19),
        paddingHorizontal: normalize(6),
    },
    button: {
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
    },
    buttonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(13.5),
        color: Colorpath.white,
        fontWeight: "600",
    },
});

/**
 * Register modal default export.
 *
 * @returns {*}
 */
export default RegisterModal;
