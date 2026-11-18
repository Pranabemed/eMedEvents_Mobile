/**
 * Prime success reusable component module. Provides a React Native UI building block used across screens. Exported members: PrimeSuccess, styles.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import VerifiedCheck from 'react-native-vector-icons/AntDesign';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Reusable PrimeSuccess component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const PrimeSuccess = ({ primesc, setPrimesc, nav, navigation, endDate, startDate, email, ...rest }) => {
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
                <View style={styles.iconBadge}>
                    <VerifiedCheck name="checkcircle" size={normalize(38)} color="#10B981" />
                </View>
                <View style={{ marginTop: normalize(8), flexDirection: "column" }}>
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
                    (async () => {
                        try {
                            await AsyncStorage.setItem('activeProfile', 'PrimeCard');
                            await AsyncStorage.removeItem('ExploreTrialClicked');
                            await AsyncStorage.setItem('PrimeCardFlowComplete', 'true');
                            await AsyncStorage.setItem('PrimeMembershipSkipped', 'false');
                            await AsyncStorage.removeItem('SessionPrimeSkipped');
                            require('react-native').DeviceEventEmitter.emit('ACTIVE_PROFILE_CHANGED', 'PrimeCard');
                        } catch (e) {
                            console.log(e);
                        }
                    })();
                    const targetNav = nav || navigation || rest?.navigation;
                    if (targetNav?.dispatch) {
                        targetNav.dispatch(CommonActions.reset({
                            index: 0, routes: [
                                { name: "TabNav", params: { initialRoute: "Home", exploreTrialClicked: false, subscriptionDataExists: true, detectmain: "newadd" } }
                            ]
                        }));
                    } else if (targetNav?.navigate) {
                        targetNav.navigate("TabNav", { initialRoute: "Home", exploreTrialClicked: false, subscriptionDataExists: true, detectmain: "newadd" });
                    }
                    setPrimesc(false);
                }} style={styles.button}>
                    <Text style={styles.buttonText}>{"Go To Dashboard"}</Text>
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
        justifyContent: 'center',
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
    },
    iconBadge: {
        width: normalize(64),
        height: normalize(64),
        borderRadius: normalize(32),
        backgroundColor: "#ECFDF5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: normalize(10),
    },
    closeIcon: {
        position: 'absolute',
        top: normalize(10),
        right: normalize(10),
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        height: normalize(26),
        width: normalize(26),
        borderRadius: normalize(13),
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(15),
        color: "#1E293B",
        width: normalize(260),
        textAlign: 'center',
    },
    contentanoth: {
        fontFamily: Fonts.InterBold,
        fontSize: normalize(15),
        color: "#FF773D",
        textAlign: 'center',
        marginTop: normalize(2),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        width: normalize(280),
        paddingVertical: normalize(10),
        marginTop: normalize(15),
    },
    button: {
        backgroundColor: Colorpath.ButtonColr || "#003B6D",
        borderRadius: normalize(10),
        height: normalize(40),
        minWidth: normalize(140),
        paddingHorizontal: normalize(24),
        justifyContent: 'center',
        alignItems: "center",
        shadowColor: Colorpath.ButtonColr || "#003B6D",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginTop: normalize(14),
    },
    singlebutton: {
        backgroundColor: Colorpath.ButtonColr,
        borderRadius: normalize(10),
        height: normalize(40),
        width: normalize(275),
        justifyContent: 'center',
        alignSelf: "center",
    },
    buttonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(13.5),
        color: Colorpath.white,
        fontWeight: "600",
        textAlign: "center",
    },
});


/**
 * Prime success default export.
 *
 * @returns {*}
 */
export default PrimeSuccess;
