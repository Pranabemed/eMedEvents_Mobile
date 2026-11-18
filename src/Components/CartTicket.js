/**
 * Cart ticket reusable component module. Provides a React Native UI building block used across screens. Exported members: PayModalCart, onPress, styles.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import VerifiedCheck from 'react-native-vector-icons/AntDesign';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";

/**
 * Reusable PayModalCart component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const PayModalCart = ({ dataPayemnt, maindata, isVisible, setPaymentcard, content, navigation, name }) => {
    console.log(maindata, "maindata======", dataPayemnt, dataPayemnt === undefined);
    const [pdfsee, setPdfsee] = useState(false);
        /**
 * On press utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const onPress = async () => {
        try {
            // Ensure the URL is available
            const url = dataPayemnt?.invoice;
            if (!url || !url.startsWith("http")) {
                console.log("Invalid URL:", url); // Debug the URL value
                Alert.alert("Error", "Invoice URL is invalid or not available.");
                return;
            }

            const fileName = url.split("/").pop(); // Extract the file name
            const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
            const options = {
                fromUrl: url,
                toFile: localFile,
            };

            const downloadResult = await RNFS.downloadFile(options).promise;

            if (downloadResult.statusCode === 200) {
                console.log("File downloaded successfully:", localFile);

                // Open the downloaded file
                await FileViewer.open(localFile);
            } else {
                console.log("Download failed:", downloadResult);
                Alert.alert("Error", "Failed to download the file.");
            }
        } catch (error) {
            console.error("Error downloading file:", error);

            // Handle specific errors
            if (error.message.includes("ENOENT")) {
                Alert.alert("Error", "File path issue detected.");
            } else if (error.message.includes("Network")) {
                Alert.alert("Error", "Network error occurred. Please check your internet connection.");
            } else {
                Alert.alert("Error", "An unexpected error occurred.");
            }
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
            <TouchableOpacity onPress={() => {
                setPaymentcard(false);
                navigation?.navigate(name);
            }} style={styles.closeIcon}>
                <CloseIcon name="close" size={20} color={Colorpath.white} />
            </TouchableOpacity>

            <View style={styles.iconBadge}>
                <VerifiedCheck name="checkcircle" size={normalize(38)} color="#10B981" />
            </View>
            <View style={{ marginBottom: normalize(16) }}>
                <Text style={styles.content}>{content}</Text>
            </View>

            <View style={[styles.buttonContainer, { marginTop: normalize(8) }]}>
                <TouchableOpacity
                    onPress={() => {
                        navigation?.navigate(name);
                        setPaymentcard(false);
                    }}
                    style={dataPayemnt?.invoice ? styles.buttonHalfPrimary : styles.doneButton}
                >
                    <Text style={styles.doneButtonText}>{"Go to Dashboard"}</Text>
                </TouchableOpacity>
                {dataPayemnt?.invoice && <TouchableOpacity
                    onPress={() => {
                        setPaymentcard(false);
                        onPress();
                    }}
                    style={[styles.buttonTicket, { marginLeft: normalize(12) }]}
                >
                    <Text style={styles.buttonTicketText}>{"Print Ticket"}</Text>
                </TouchableOpacity>}
            </View>
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
        zIndex: 10,
    },
    iconBadge: {
        width: normalize(64),
        height: normalize(64),
        borderRadius: normalize(32),
        backgroundColor: "#ECFDF5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: normalize(14),
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
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    buttonHalfPrimary: {
        backgroundColor: Colorpath.ButtonColr || "#003B6D",
        borderRadius: normalize(10),
        height: normalize(40),
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        shadowColor: Colorpath.ButtonColr || "#003B6D",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonTicket: {
        backgroundColor: "#EFF6FF",
        borderWidth: 1,
        borderColor: "#93C5FD",
        borderRadius: normalize(10),
        height: normalize(40),
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    buttonTicketText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(13),
        color: Colorpath.ButtonColr || "#003B6D",
        fontWeight: "600",
        textAlign: "center",
    },
    doneButton: {
        backgroundColor: Colorpath.ButtonColr || "#003B6D",
        borderRadius: normalize(10),
        height: normalize(40),
        minWidth: normalize(120),
        paddingHorizontal: normalize(22),
        justifyContent: 'center',
        alignItems: "center",
        shadowColor: Colorpath.ButtonColr || "#003B6D",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    doneButtonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(13.5),
        color: Colorpath.white,
        fontWeight: "600",
        textAlign: "center",
    },
    button: {
        backgroundColor: Colorpath.white,
        borderRadius: normalize(10),
        height: normalize(40),
        width: normalize(140),
        justifyContent: 'center',
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2C4DB9",
    },
    buttonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(13.5),
        color: Colorpath.ButtonColr,
        textAlign: "center",
    },
});


/**
 * Cart ticket default export.
 *
 * @returns {*}
 */
export default PayModalCart;
