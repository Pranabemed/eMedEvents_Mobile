/**
 * Pay modal reusable component module. Provides a React Native UI building block used across screens. Exported members: subscription, PayModal, onPress, handleAppStateChange, styles.
 */

import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, AppState, DeviceEventEmitter } from 'react-native';
import Modal from 'react-native-modal';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import VerifiedCheck from 'react-native-vector-icons/AntDesign';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import { AppContext } from '../Screen/GlobalSupport/AppContext';

/**
 * Reusable PayModal component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
let subscription = null;
/**
 * Pay modal component.
 * @param {Object} props - Input object.
 * @param {*} props.setPrintgo - Nested property value.
 * @param {*} props.printgo - Nested property value.
 * @param {*} props.cartData - Nested property value.
 * @param {*} props.dataPayemnt - Nested property value.
 * @param {*} props.maindata - Nested property value.
 * @param {*} props.isVisible - Nested property value.
 * @param {*} props.setPaymentcard - Nested property value.
 * @param {*} props.content - Nested property value.
 * @param {*} props.navigation - Nested property value.
 * @param {*} props.name - Nested property value.
 * @param {*} props.setGocertificate - Nested property value.
 * @param {*} props.gocertificate - Nested property value.
 * @returns {JSX.Element}
 */
const PayModal = ({ setPrintgo, printgo, cartData, dataPayemnt, maindata, isVisible, setPaymentcard, content, navigation, name, onDashboardPress, setGocertificate, gocertificate }) => {
    const route = useRoute();
    const WebcastReducer = useSelector(state => state.WebcastReducer);

    /**
* Returns merged params.
* @param {Object} extraParams - Input value.
* @returns {Object}
*/
    const getMergedParams = (extraParams = {}) => {
        return {
            ...(route?.params || {}),
            ...extraParams,
            refreshLicensesAt: Date.now(),
            detectmain: 'checkoutDone_' + Date.now(),
            maindata: {
                checkoutSpan: route?.params?.checkoutSpan?.checkoutSpan,
                inpersonSpanrole: route?.params?.inPersonTicket?.inpersonSpanrole,
                invoiceWebcast: route?.params?.invoiceTxt?.webcastTake,
                cartInvoiceWebcast: route?.params?.cartInvoice?.webcastTake,
                addToCartWebcast: route?.params?.addtocart?.webcast,
                webcastDetails: WebcastReducer?.webcastDeatilsResponse,
                paymentCheck: WebcastReducer?.PaymentCheckResponse,
                statusPayment: WebcastReducer?.StatusPaymentResponse,
                freeCart: WebcastReducer?.FreeCartResponse,
            },
            webcastDetails: WebcastReducer?.webcastDeatilsResponse,
            paymentResponse: WebcastReducer?.PaymentCheckResponse || WebcastReducer?.StatusPaymentResponse || WebcastReducer?.FreeCartResponse,
        };
    };

    const goToDashboard = () => {
        DeviceEventEmitter.emit('CHECKOUT_COMPLETED', { timestamp: Date.now() });
        setPaymentcard(false);
        const fullDta = fulldashbaord?.[0];
        setAddit(fullDta);
        if (typeof onDashboardPress === 'function') {
            onDashboardPress(getMergedParams());
            return;
        }
        navigation?.navigate(name || "TabNav", getMergedParams());
    };

    console.log(maindata, "maindata======", dataPayemnt, dataPayemnt === undefined);
    const {
        fulldashbaord,
        setAddit
    } = useContext(AppContext);
    const [pdfsee, setPdfsee] = useState(false);
    const appState = useRef(AppState.currentState);
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
                /**
* Handles app state change.
* @param {*} nextAppState - Input value.
* @returns {void}
*/
                const handleAppStateChange = (nextAppState) => {
                    if (
                        appState.current.match(/inactive|background/) &&
                        nextAppState === 'active'
                    ) {
                        if (subscription?.remove) {
                            subscription.remove();
                            DeviceEventEmitter.emit('CHECKOUT_COMPLETED', { timestamp: Date.now() });
                            navigation.navigate('TabNav', getMergedParams());
                        }
                    }
                    appState.current = nextAppState;
                };
                subscription = AppState.addEventListener('change', handleAppStateChange);
                setTimeout(async () => {
                    setPrintgo("go");
                    await FileViewer.open(localFile);
                }, 1000);
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

    return (cartData == "hit" ? <Modal
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
                goToDashboard();
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
                        goToDashboard();
                    }}
                    style={dataPayemnt?.invoice ? styles.buttonHalfPrimary : styles.doneButton}
                >
                    <Text style={styles.doneButtonText}>{"Go to Dashboard"}</Text>
                </TouchableOpacity>
                {dataPayemnt?.invoice && <TouchableOpacity
                    onPress={() => {
                        setPaymentcard(false);
                        onPress();
                        setPrintgo("pdf");
                        const fullDta = fulldashbaord?.[0];
                        setAddit(fullDta);
                    }}
                    style={[styles.buttonTicket, { marginLeft: normalize(12) }]}
                >
                    <Text style={styles.buttonTicketText}>{"Print Ticket"}</Text>
                </TouchableOpacity>}
            </View>
        </View>
    </Modal> :
        <Modal
            isVisible={isVisible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropTransitionOutTiming={0}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            style={styles.modal}
        >
            {dataPayemnt?.ButtonArr ? (<View style={styles.container}>
                <TouchableOpacity onPress={() => {
                    goToDashboard();
                }} style={styles.closeIcon}>
                    <CloseIcon name="close" size={20} color={Colorpath.white} />
                </TouchableOpacity>

                <View style={styles.iconBadge}>
                    <VerifiedCheck name="checkcircle" size={normalize(38)} color="#10B981" />
                </View>
                <View style={{ marginBottom: normalize(16) }}>
                    <Text style={styles.content}>{content}</Text>
                </View>
                <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    {/* Single Button */}
                    <TouchableOpacity
                        onPress={() => {
                            setPaymentcard(false);
                            navigation.navigate("StartTest", getMergedParams({ startCourse: maindata }));
                            const fullDta = fulldashbaord?.[0];
                            setAddit(fullDta);
                        }}
                        style={styles.singlebutton}
                    >
                        <Text style={styles.singlebuttonText}>
                            {"Start Course Now"}
                        </Text>
                    </TouchableOpacity>
                    <View style={dataPayemnt?.invoice ? [styles.buttonContainer, { marginTop: normalize(8) }] : [styles.buttonContainerg, { marginTop: normalize(8) }]}>
                        <TouchableOpacity
                            onPress={() => {
                                goToDashboard();
                            }}
                            style={dataPayemnt?.invoice ? styles.buttonOutline : styles.singlebuttonSecondary}
                        >
                            <Text style={dataPayemnt?.invoice ? styles.buttonOutlineText : styles.singlebuttonSecondaryText}>{"Start Course Later"}</Text>
                        </TouchableOpacity>
                        {dataPayemnt?.invoice && <TouchableOpacity
                            onPress={() => {
                                setPaymentcard(false);
                                onPress();
                                setPrintgo("pdf");
                                const fullDta = fulldashbaord?.[0];
                                setAddit(fullDta);

                            }}
                            style={[styles.buttonTicket, { marginLeft: normalize(12) }]}
                        >
                            <Text style={styles.buttonTicketText}>{"Print Ticket"}</Text>
                        </TouchableOpacity>}
                    </View>
                </View>

            </View>) : typeof dataPayemnt == "object" ? (<View style={styles.container}>
                <View style={styles.iconBadge}>
                    <VerifiedCheck name="checkcircle" size={normalize(38)} color="#10B981" />
                </View>
                <View style={{ marginBottom: normalize(16) }}>
                    <Text style={styles.content}>{content}</Text>
                </View>
                <View style={[styles.buttonContainer, { marginTop: normalize(8) }]}>
                    <TouchableOpacity
                        onPress={() => {
                            goToDashboard();
                        }}
                        style={dataPayemnt?.invoice ? styles.buttonHalfPrimary : styles.doneButton}
                    >
                        <Text style={styles.doneButtonText}>{"Go to Dashboard"}</Text>
                    </TouchableOpacity>
                    {dataPayemnt?.invoice && <TouchableOpacity
                        onPress={() => {
                            setPaymentcard(false);
                            onPress();
                            setPrintgo("pdf");
                            const fullDta = fulldashbaord?.[0];
                            setAddit(fullDta);
                        }}
                        style={[styles.buttonTicket, { marginLeft: normalize(12) }]}
                    >
                        <Text style={styles.buttonTicketText}>{"Print Ticket"}</Text>
                    </TouchableOpacity>}
                </View>
            </View>) : (<View style={styles.container}>
                <View style={styles.iconBadge}>
                    <VerifiedCheck name="checkcircle" size={normalize(38)} color="#10B981" />
                </View>
                <View style={{ marginBottom: normalize(16) }}>
                    <Text style={styles.content}>{content}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    goToDashboard();
                    if (gocertificate) {
                        setGocertificate(!gocertificate);
                    }
                }} style={styles.doneButton}>
                    <Text style={styles.doneButtonText}>{"Done"}</Text>
                </TouchableOpacity>
            </View>)}
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
    buttonContainerg: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    singlebutton: {
        backgroundColor: Colorpath.ButtonColr || "#003B6D",
        borderRadius: normalize(10),
        height: normalize(40),
        width: "100%",
        justifyContent: 'center',
        alignItems: "center",
        shadowColor: Colorpath.ButtonColr || "#003B6D",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    singlebuttonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(13.5),
        color: Colorpath.white,
        fontWeight: "600",
        textAlign: "center",
    },
    singlebuttonSecondary: {
        backgroundColor: "#F1F5F9",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: normalize(10),
        height: normalize(40),
        width: "100%",
        justifyContent: 'center',
        alignItems: "center",
    },
    singlebuttonSecondaryText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(13.5),
        color: "#334155",
        fontWeight: "600",
        textAlign: "center",
    },
    buttonOutline: {
        backgroundColor: "#F1F5F9",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: normalize(10),
        height: normalize(40),
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    buttonOutlineText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(13),
        color: "#334155",
        fontWeight: "600",
        textAlign: "center",
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
    // Legacy support
    button: {
        backgroundColor: Colorpath.white,
        borderRadius: normalize(10),
        height: normalize(40),
        width: normalize(130),
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
    buttoncart: {
        backgroundColor: Colorpath.ButtonColr,
        borderRadius: normalize(10),
        height: normalize(40),
        width: normalize(130),
        justifyContent: 'center',
        alignItems: "center",
    },
    buttonTextcart: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(13.5),
        color: Colorpath.white,
        textAlign: "center",
    },
});


/**
 * Pay modal default export.
 *
 * @returns {*}
 */
export default PayModal;
