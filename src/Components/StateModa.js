
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
const StateModa = ({ isVisible, onClose, content, navigation, profile }) => {
    const pressed = useRef(false);
    useEffect(() => {
        if (isVisible) {
            pressed.current = false;
        }
    }, [isVisible]);

    const handleDone = () => {
        if (pressed.current) return;   // block double-tap
        pressed.current = true;

        if (profile == "text") {
            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "StateProfile", params: { state: "nodata" } }] }));
        } else {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "TabNav", params: { initialRoute: "Home", detectmain: "newadd", refreshLicensesAt: Date.now() } }]
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
                <VerifiedCheck name="checkcircleo" size={75} color={"#009E38"} />
                <View style={{ marginTop: normalize(20) }}>
                    <Text style={styles.content}>{content}</Text>
                </View>
                <TouchableOpacity onPress={handleDone} style={{ justifyContent: "center", alignItems: "center", height: normalize(50), width: normalize(120), borderRadius: normalize(10), borderWidth: 1, borderColor: "#DDDDDD" }}>
                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: normalize(18), color: "#999999" }}>{"Done"}</Text>
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
        width: normalize(300),
        backgroundColor: Colorpath.white,
        borderRadius: normalize(10),
        padding: normalize(30),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: "center",
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
        fontFamily: Fonts.InterMedium,
        fontSize: 20,
        color: Colorpath.black,
        textAlign: 'center',
        marginBottom: normalize(20),
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


export default StateModa;
