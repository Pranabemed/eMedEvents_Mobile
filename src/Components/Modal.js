/**
 * Modal reusable component module. Provides a React Native UI building block used across screens. Exported members: CustomModal, resendMobileOTP, styles.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import VerifiedCheck from 'react-native-vector-icons/AntDesign';
import { CommonActions } from '@react-navigation/native';
import connectionrequest from '../Utils/Helpers/NetInfo';
import showErrorAlert from '../Utils/Helpers/Toast';
import { resendmobileotpRequest } from '../Redux/Reducers/AuthReducer';
import { useDispatch } from 'react-redux';

/**
 * Reusable CustomModal component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const CustomModal = ({ isVisible, onClose, content, navigation, phoneno, countrycode, norq, profession }) => {
    const dispatch = useDispatch();
        /**
 * Resend mobile otp utility.
 * @returns {void}
 */
const resendMobileOTP = () => {
        let obj = {
            "verify_type": "phone"
        }
        connectionrequest()
            .then(() => {
                dispatch(resendmobileotpRequest(obj));
            })
            .catch(err => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    return (
        <Modal
            isVisible={isVisible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropTransitionOutTiming={0} // Fixes a flicker issue
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            style={styles.modal}
        >
            <View style={styles.container}>
                <View style={{
                    width: normalize(64),
                    height: normalize(64),
                    borderRadius: normalize(32),
                    backgroundColor: "#ECFDF5",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: normalize(14)
                }}>
                    <VerifiedCheck name="checkcircle" size={normalize(38)} color="#10B981" />
                </View>
                <View style={{ marginBottom: normalize(20) }}>
                    <Text style={styles.content}>{content}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    if (!phoneno) {
                        navigation.dispatch(CommonActions.reset({
                            index: 0, routes: [{
                                name: "AddMobileLogin"
                            }]
                        }));
                        onClose();
                    } else {
                        navigation.dispatch(CommonActions.reset({
                            index: 0, routes: [{
                                name: "VerifyMobileOTP",
                                params: { validPh: { validPh: phoneno, phonecode: countrycode, norq: norq, profall: profession } },
                            }]
                        }));
                        resendMobileOTP();
                        // navigation.navigate("VerifyMobileOTP",{validPh: {validPh:phoneno,phonecode:countrycode,norq:norq,profall:profession}});
                        // navigation?.navigate("VerifyMobileOTP",{validPh: phoneno});
                        onClose();
                    }

                }} style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: normalize(40),
                    minWidth: normalize(120),
                    paddingHorizontal: normalize(22),
                    borderRadius: normalize(10),
                    backgroundColor: Colorpath.ButtonColr || "#003B6D",
                    shadowColor: Colorpath.ButtonColr || "#003B6D",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: normalize(13.5), color: Colorpath.white, fontWeight: "600" }}>{"Done"}</Text>
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
        justifyContent: 'center', // Centers the modal vertically
        alignItems: 'center', // Centers the modal horizontally
        margin: 0, // Removes default margin
    },
    container: {
        width: normalize(300),
        backgroundColor: Colorpath.white,
        borderRadius: normalize(16),
        paddingVertical: normalize(24),
        paddingHorizontal: normalize(20),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
    },
    content: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(14.5),
        color: "#1E293B",
        textAlign: 'center',
        lineHeight: normalize(21),
    },
    button: {
        backgroundColor: Colorpath.ButtonColr,
        borderRadius: normalize(5),
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(20),
    },
    buttonText: {
        fontFamily: Fonts.InterMedium,
        fontSize: normalize(16),
        color: Colorpath.white,
    },
});

/**
 * Modal default export.
 *
 * @returns {*}
 */
export default CustomModal;
