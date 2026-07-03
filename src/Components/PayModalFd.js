/**
 * Pay modal fd reusable component module. Provides a React Native UI building block used across screens. Exported members: PayModalFd, styles.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import VerifiedCheck from 'react-native-vector-icons/AntDesign';

/**
 * Reusable PayModalFd component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const PayModalFd = ({ dataPayemnt, maindata, isVisible, setPaymentfd, content, navigation, name, setGocertificate, gocertificate }) => {
    const route = useRoute();
    const WebcastReducer = useSelector(state => state.WebcastReducer);

    const getMergedParams = (extraParams = {}) => {
        return {
            ...(route?.params || {}),
            ...extraParams,
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
                <TouchableOpacity onPress={() => {
                    navigation?.navigate(name, getMergedParams());
                    if (gocertificate) {
                        setGocertificate(!gocertificate);
                    }
                    setPaymentfd(false)
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
 * Pay modal fd default export.
 *
 * @returns {*}
 */
export default PayModalFd;
