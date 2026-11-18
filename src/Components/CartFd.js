/**
 * Cart fd reusable component module. Provides a React Native UI building block used across screens. Exported members: CartFd, styles.
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
 * Reusable CartFd component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const CartFd = ({dataPayemnt, maindata, isVisible, setPaymentfdfreecart, content, navigation, name, setGocertificate, gocertificate }) => {
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
                <View style={styles.iconBadge}>
                    <VerifiedCheck name="checkcircle" size={normalize(38)} color="#10B981" />
                </View>
                <View style={{ marginBottom: normalize(16) }}>
                    <Text style={styles.content}>{content}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    navigation?.navigate(name, getMergedParams());
                    if (gocertificate) {
                        setGocertificate(!gocertificate);
                    }
                    setPaymentfdfreecart(false);
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
        marginBottom: normalize(14),
    },
    content: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(14.5),
        color: "#1E293B",
        textAlign: 'center',
        lineHeight: normalize(21),
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
 * Cart fd default export.
 *
 * @returns {*}
 */
export default CartFd;
