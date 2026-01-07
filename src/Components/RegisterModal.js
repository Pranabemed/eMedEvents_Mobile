import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import VerifiedCheck from 'react-native-vector-icons/AntDesign';
import { CommonActions } from '@react-navigation/native';

const RegisterModal = ({ isVisible, onClose, navigation }) => {
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
                <VerifiedCheck name="checkcircleo" size={normalize(75)} color={"#009E38"} />
                
                <Text style={styles.titleText}>{"Thank you for your interest!"}</Text>
                
                <Text style={styles.descriptionText}>
                    {"We’ve noted your request and will notify you as soon as registration opens for this conference."}
                </Text>
                
                <TouchableOpacity
                    onPress={() => {
                        navigation.dispatch(CommonActions.reset({
                            index: 0,
                            routes: [{ name: "TabNav" }]
                        }));
                        onClose();
                    }}
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
