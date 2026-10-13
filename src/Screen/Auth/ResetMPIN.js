/**
 * Reset mpin screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, ResetMPIN, toggleModal, resetHandle, onBackPress, styles.
 */

import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, ScrollView, StyleSheet, Animated, Easing, BackHandler, Modal } from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { resetRequest } from '../../Redux/Reducers/AuthReducer';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import Header from '../../Components/Header';
import InputField from '../../Components/CellInput';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable ResetMPIN component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const ResetMPIN = (props) => {
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const [resetmpin, setResetmpin] = useState("");
    const [cellno, setCellno] = useState("");
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const resetRequestPendingRef = useRef(false);
        /**
 * Reset handle utility.
 * @returns {void}
 */
const resetHandle = () => {
        console.log(cellno)
        if (!cellno) {
            showErrorAlert("New password is required !")
        } else if (!resetmpin) {
            showErrorAlert("Confirm password is required !")
        } else if (cellno !== resetmpin) {
            showErrorAlert("New password and confirm password should be same required !")
        } else {
            let obj = {
                "token": AuthReducer?.forgotResponse?.token,
                "new_password": cellno,
                "confirm_password": resetmpin
            }
            connectionrequest()
                .then(() => {
                    resetRequestPendingRef.current = true;
                    dispatch(resetRequest(obj));
                })
                .catch(err => {
                    resetRequestPendingRef.current = false;
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }
    useEffect(() => {
        if (!resetRequestPendingRef.current) return;
        if (AuthReducer.status === 'Auth/resetSuccess') {
            resetRequestPendingRef.current = false;
            setSuccessModalVisible(true);
        } else if (AuthReducer.status === 'Auth/resetFailure') {
            resetRequestPendingRef.current = false;
            showErrorAlert("Something went wrong ! Please try again later");
        }
    }, [AuthReducer.status]);
    const animatedValuempin = useRef(new Animated.Value(1)).current;
    const scaleValuesempin = useRef(new Animated.Value(0)).current;
    const animatedValuereset = useRef(new Animated.Value(1)).current;
    const scaleValuereset = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const targetScales = resetmpin ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuereset, {
                toValue: resetmpin ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuereset, {
                toValue: targetScales,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [animatedValuereset, resetmpin, scaleValuereset]);
    useEffect(() => {
        const targetScale = cellno ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuempin, {
                toValue: cellno ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesempin, {
                toValue: targetScale,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [animatedValuempin, cellno, scaleValuesempin]);
    const passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    const isPasswordValid = cellno?.length > 0 && passwordregex.test(cellno); // removed !
    const cnfrmPasswordValid = resetmpin?.length > 0 && passwordregex.test(resetmpin);
    const isPasswordValidch = cellno?.length > 0 && !passwordregex.test(cellno); // removed !
    const passwordsMatch = cellno === resetmpin;
    const final = !(isPasswordValid && cnfrmPasswordValid && passwordsMatch); // button should be disabled if NOT valid
    const backToLogin = useCallback(() => {
        props.navigation.navigate('Login');
    }, [props.navigation]);
    useFocusEffect(useCallback(() => {
                        /**
 * On back press utility.
 * @returns {boolean}
 */
const onBackPress = () => {
                backToLogin();
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );
            return () => backHandler.remove();
        }, [backToLogin]));
        useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, [props.navigation]);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Header
                        onPress={backToLogin}
                        tintColor={Colorpath.black}
                    />
                </View>
                <KeyboardAvoidingView
                    style={styles.keyboardAvoidingView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        style={styles.scrollView}
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps="always"
                        keyboardDismissMode="none"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <View style={styles.content}>
                            <View style={styles.iconContainer}>
                                <ArrowIcons name="lock-reset" size={44} color={Colorpath.ButtonColr} />
                            </View>
                            <View style={styles.headerContainer}>
                                <Text style={styles.headerText}>Reset Password</Text>
                                <Text style={styles.subHeaderText}>
                                    Create a strong new password that is different from your previous password.
                                </Text>
                            </View>
                            <View style={styles.form}>
                                <InputField
                                    label="New Password"
                                    value={cellno}
                                    onChangeText={setCellno}
                                    placeholder=""
                                    placeholderTextColor="#949494"
                                    isPassword={true}
                                    keyboardType="default"
                                    showCountryCode={false}
                                />
                                {isPasswordValidch && (
                                    <View style={styles.helperContainer}>
                                        <Text style={[styles.helperText, styles.errorText]}>
                                            Password must be 8+ chars, with 1 uppercase , 1 special character and 1 number.
                                        </Text>
                                    </View>
                                )}
                                <InputField
                                    label="Confirm New Password"
                                    value={resetmpin}
                                    onChangeText={setResetmpin}
                                    placeholder=""
                                    placeholderTextColor="#949494"
                                    isPassword={true}
                                    keyboardType="default"
                                    showCountryCode={false}
                                />
                                {resetmpin?.length > 0 && (!cnfrmPasswordValid || !passwordsMatch) && (
                                    <View style={styles.helperContainer}>
                                        <Text style={[styles.helperText, styles.errorText]}>
                                            {!cnfrmPasswordValid
                                                ? 'Password must be 8+ chars, with 1 uppercase , 1 special character and 1 number.'
                                                : 'Passwords do not match.'}
                                        </Text>
                                    </View>
                                )}
                                <Buttons
                                    disabled={final}
                                    onPress={resetHandle}
                                    height={normalize(48)}
                                    width="100%"
                                    backgroundColor={final ? "#DADADA" : Colorpath.ButtonColr}
                                    borderRadius={normalize(10)}
                                    text="Reset Password"
                                    color={final ? "#667085" : Colorpath.white}
                                    fontSize={16}
                                    fontFamily={Fonts.InterSemiBold}
                                    marginTop={normalize(20)}
                                />
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    onPress={backToLogin}
                                    style={styles.backToLoginButton}
                                >
                                    <ArrowIcons name="arrow-back" size={18} color={Colorpath.ButtonColr} />
                                    <Text style={styles.backToLoginText}>Back to Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <Loader visible={AuthReducer?.status === 'Auth/resetRequest'} />
                <Modal
                    visible={isSuccessModalVisible}
                    transparent={true}
                    animationType="fade"
                    statusBarTranslucent={true}
                    onRequestClose={() => {}}
                >
                    <View style={styles.modalBackdrop}>
                        <View style={styles.modalContainer}>
                            <ArrowIcons name="check-circle-outline" size={72} color="#009E38" />
                            <Text style={styles.modalText}>Your password has been updated successfully.</Text>
                            <TouchableOpacity
                                accessibilityRole="button"
                                onPress={() => {
                                    setSuccessModalVisible(false);
                                    backToLogin();
                                }}
                                style={styles.doneButton}
                            >
                                <Text style={styles.doneButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
    );
};

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colorpath.Pagebg,
    },
    header: {
        paddingHorizontal: normalize(5),
        marginTop: normalize(-4),
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: normalize(120),
    },
    content: {
        width: '100%',
        maxWidth: 480,
        alignSelf: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(24),
        paddingTop: normalize(0),
    },
    iconContainer: {
        width: normalize(76),
        height: normalize(76),
        borderRadius: normalize(38),
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: normalize(20),
    },
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 26,
        color: "#101828",
        textAlign: 'center',
    },
    subHeaderText: {
        marginTop: normalize(10),
        color: "#667085",
        fontSize: 14,
        lineHeight: 22,
        fontFamily: Fonts.InterRegular,
        textAlign: 'center',
    },
    form: {
        width: '100%',
        marginTop: normalize(24),
    },
    helperContainer: {
        marginTop: normalize(-8),
        marginBottom: normalize(10),
    },
    helperText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 12,
        lineHeight: 18,
        color: '#667085',
    },
    errorText: {
        color: '#B42318',
    },
    backToLoginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        marginTop: normalize(12),
    },
    backToLoginText: {
        marginLeft: normalize(8),
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        color: Colorpath.ButtonColr,
    },
    modalBackdrop: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        paddingHorizontal: normalize(24),
    },
    modalContainer: {
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colorpath.white,
        borderRadius: normalize(14),
        paddingHorizontal: normalize(28),
        paddingVertical: normalize(30),
    },
    modalText: {
        marginTop: normalize(18),
        marginBottom: normalize(24),
        fontFamily: Fonts.InterMedium,
        fontSize: 18,
        lineHeight: 26,
        color: '#101828',
        textAlign: 'center',
    },
    doneButton: {
        minWidth: normalize(120),
        height: normalize(48),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colorpath.ButtonColr,
        borderRadius: normalize(10),
    },
    doneButtonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 16,
        color: Colorpath.white,
    },
});

/**
 * Reset mpin default export.
 *
 * @returns {*}
 */
export default ResetMPIN;
