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

const GUEST_PROMPT_KEYS = [
    'GUEST_REGISTRATION_FLOW',
    'GUEST_PRIME_VERIFICATION_PENDING',
    'PrimeMembershipSkipped',
    'CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION',
    'PrimeCardFlowComplete',
];

const RegisterModal = ({ isVisible, onClose, navigation }) => {
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
                <VerifiedCheck name="checkcircleo" size={normalize(75)} color={"#009E38"} />
                
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

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    container: {
        width: normalize(310),
        backgroundColor: Colorpath.white,
        borderRadius: normalize(10),
        paddingVertical: normalize(30),
        paddingHorizontal: normalize(20),
        alignItems: 'center',
    },
    titleText: {
        fontFamily: Fonts.InterMedium,
        fontSize: normalize(20),
        color: Colorpath.black,
        textAlign: 'center',
        marginTop: normalize(15),
        marginBottom: normalize(10),
    },
    descriptionText: {
        fontFamily: Fonts.InterRegular,
        fontSize: normalize(14),
        color: "#666666",
        textAlign: 'center',
        marginBottom: normalize(25),
        lineHeight: normalize(20),
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        height: normalize(50),
        width: normalize(120),
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: "#DDDDDD",
    },
    buttonText: {
        fontFamily: Fonts.InterMedium,
        fontSize: normalize(18),
        color: "#999999",
    },
});

export default RegisterModal;
