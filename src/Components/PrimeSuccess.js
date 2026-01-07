import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import VerifiedCheck from 'react-native-vector-icons/AntDesign';
import { CommonActions } from '@react-navigation/native';
const PrimeSuccess = ({ primesc, setPrimesc, nav, endDate, startDate, email }) => {
    return (
        <Modal
            isVisible={primesc}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropTransitionOutTiming={0}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            style={styles.modal}
            onBackdropPress={() => setPrimesc(false)}
        >
            <View style={styles.container}>
                <VerifiedCheck name="checkcircleo" size={75} color={"#009E38"} />
                <View style={{ marginTop: normalize(10), flexDirection: "column" }}>
                    <Text style={styles.content}>{"Thank you for subscribing to the"}</Text>
                    <Text style={styles.contentanoth}>{"Prime Membership"}</Text>
                </View>
                <View style={{ flexDirection: "row", paddingVertical: normalize(4), flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#000000", textAlign: "center" }}>{"You will receive a confirmation email at "}</Text>
                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: Colorpath.ButtonColr, textAlign: "center" }}>{email}</Text>
                </View>
                <View
                    style={{
                        height: normalize(60),
                        width: normalize(240),
                        borderWidth: 1,
                        borderColor: "#DADADA",
                        borderRadius: normalize(5),
                        marginTop: normalize(2),
                        justifyContent: "center",
                        backgroundColor: "#fff",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                            paddingHorizontal: normalize(10),
                        }}
                    >
                        {startDate && (
                            <View style={{ alignItems: "center" }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterBold,
                                        fontSize: 16,
                                        fontWeight: "bold",
                                        color: "#FF773D",
                                    }}
                                >
                                    {startDate}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 13,
                                        color: "#000000",
                                    }}
                                >
                                    Plan Start Date
                                </Text>
                            </View>
                        )}

                        {/* Divider */}
                        <View
                            style={{
                                height: normalize(40),
                                width: normalize(1),
                                backgroundColor: "#DADADA",
                            }}
                        />

                        {endDate && (
                            <View style={{ alignItems: "center" }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterBold,
                                        fontSize: 16,
                                        fontWeight: "bold",
                                        color: "#FF773D",
                                    }}
                                >
                                    {endDate}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 13,
                                        color: "#000000",
                                    }}
                                >
                                    Plan End Date
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <TouchableOpacity onPress={() => {
                    nav.dispatch(CommonActions.reset({
                        index: 0, routes: [
                            { name: "TabNav", params: { initialRoute: "Home" } }
                        ]
                    }));
                    setPrimesc(false)
                }} style={styles.button}>
                    <Text style={styles.buttonText}>{"Go To Dashboard"}</Text>
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
        fontSize: 18,
        color: Colorpath.black,
        width: normalize(260),
        textAlign: 'center',
        // marginBottom: normalize(20),
    },
    contentanoth: {
        fontFamily: Fonts.InterMedium,
        fontSize: 18,
        color: "#FF773D",
        textAlign: 'center',
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
        marginTop: normalize(10)
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


export default PrimeSuccess;
