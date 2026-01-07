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
const CustomModal = ({ isVisible, onClose, content, navigation, phoneno, countrycode, norq, profession }) => {
    const dispatch = useDispatch();
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
                <VerifiedCheck name="checkcircleo" size={75} color={"#009E38"} />
                <View style={{ marginTop: normalize(20) }}>
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

                }} style={{ justifyContent: "center", alignItems: "center", height: normalize(50), width: normalize(120), borderRadius: normalize(10), borderWidth: 1, borderColor: "#DDDDDD" }}>
                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: normalize(18), color: "#999999" }}>{"Done"}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center', // Centers the modal vertically
        alignItems: 'center', // Centers the modal horizontally
        margin: 0, // Removes default margin
    },
    container: {
        width: normalize(300),
        backgroundColor: Colorpath.white,
        borderRadius: normalize(10),
        padding: normalize(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        fontFamily: Fonts.InterMedium,
        fontSize: normalize(20),
        color: Colorpath.black,
        textAlign: 'center',
        marginBottom: normalize(20),
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

export default CustomModal;
