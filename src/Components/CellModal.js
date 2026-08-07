/**
 * Cell modal reusable component module. Provides a React Native UI building block used across screens. Exported members: CellModal, resetToTabHome, handleDone, styles.
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, InteractionManager } from 'react-native';
import Modal from 'react-native-modal';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import VerifiedCheck from 'react-native-vector-icons/AntDesign';
import { CommonActions } from '@react-navigation/native';
import { readNonUsaPermanentFlags } from '../Utils/Helpers/nonUsaFlow';
import { useSelector } from 'react-redux';

/**
 * Reusable CellModal component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const CellModal = ({ isVisible, onClose, content, navigation, name, key, profMerge }) => {
    console.log(profMerge, "profiletake=====", key,name)
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const pressed = useRef(false);
    useEffect(() => {
        if (isVisible) {
            pressed.current = false;
        }
    }, [isVisible]);

        /**
 * Reset to tab home utility.
 * @returns {void}
 */
const resetToTabHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "TabNav", params: { initialRoute: "Home", detectmain: "newadd", refreshLicensesAt: Date.now() } }]
            })
        );
    };

        /**
 * Handles done.
 *
 * @async
 * @returns {Promise<*>}
 */
    const handleDone = async () => {
        if (pressed.current) return;
        pressed.current = true;

        try {
            await AsyncStorage.setItem('GUEST_VERIFICATION_COMPLETED', 'true');
            await AsyncStorage.removeItem('GUEST_PRIME_VERIFICATION_PENDING');
        } catch (e) {
            console.log(e);
        }

        try {
            onClose();
        } catch (e) {
            console.log(e);
        }

        try {
            const permanentFlags = await readNonUsaPermanentFlags();
            const primaryLic = DashboardReducer?.mainprofileResponse?.licensures?.[0] || AuthReducer?.verifymobileResponse?.user || {};
            const licNum = String(primaryLic?.license_number || '').trim();
            const fromDt = String(primaryLic?.from_date || primaryLic?.renewal_date || '').trim();
            const hasExistingLicenseData = Boolean(licNum && (fromDt || primaryLic?.to_date) && fromDt !== '0000-00-00');

            if (name == "CreateStateInfor" || name == "ChooseState" || name == "TabNav") {
                if (hasExistingLicenseData || permanentFlags?.stateLicenseFlowCompleted) {
                    resetToTabHome();
                } else {
                    navigation?.navigate(name);
                }
                return;
            }

            if (profMerge == "freetrail") {
                navigation.navigate("TabNav");
            } else if (profMerge == "duplicate") {
                resetToTabHome();
            } else if (name == "TabNav") {
                resetToTabHome();
            } else if (name == "text") {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            {
                                name: "BoardProfile",
                                params: {
                                    board: "nodata",
                                }
                            }
                        ]
                    })
                );
            } else if (name == "Contact") {
                navigation.navigate("TabNav", { initialRoute: "Contact" });
            } else if (name == "goBack") {
                navigation.goBack();
            } else if (name == "DashoardVault") {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "TabNav", params: { initialRoute: "Contact", detectmain: "main" } }],
                    })
                );
            } else if (name == "CertficateHandle") {
                navigation.navigate("CertficateHandle", { isNonUsaUser: true });
            } else {
                navigation?.navigate(name || "TabNav");
            }
        } catch (error) {
            console.log("handleDone error:", error);
            resetToTabHome();
        }
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


/**
 * Cell modal default export.
 *
 * @returns {*}
 */
export default CellModal;
