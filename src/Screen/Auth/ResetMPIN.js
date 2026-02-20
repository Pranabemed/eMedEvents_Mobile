import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, ScrollView, StyleSheet, Animated, Easing, TextInput, Image, BackHandler } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import CustomModal from '../../Components/Modal';
import TextFieldIn from '../../Components/Textfield';
import { useDispatch, useSelector } from 'react-redux';
import { resetRequest } from '../../Redux/Reducers/AuthReducer';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import TextInputPlain from '../../Components/PlainyTextInput';
import Imagepath from '../../Themes/Imagepath';
import Header from '../../Components/Header';
import InputField from '../../Components/CellInput';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
const ResetMPIN = (props) => {
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const [resetmpin, setResetmpin] = useState("");
    const [cellno, setCellno] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const resetHandle = () => {
        console.log(cellno)
        if (!cellno) {
            showErrorAlert("New password is required !")
        } else if (!resetmpin) {
            showErrorAlert("Confirm password is required !")
        } else if (cellno != resetmpin) {
            showErrorAlert("New password and confirm password should be same required !")
        } else {
            let obj = {
                "token": AuthReducer?.forgotResponse?.token,
                "new_password": cellno,
                "confirm_password": resetmpin
            }
            connectionrequest()
                .then(() => {
                    dispatch(resetRequest(obj));
                })
                .catch(err => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }
    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/resetRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/resetSuccess':
                status = AuthReducer.status;
                props.navigation.navigate("Login");
                break;
            case 'Auth/resetFailure':
                status = AuthReducer.status;
                showErrorAlert("Something went wrong ! Please try again later")
                break;
        }
    }
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
    }, [resetmpin]);
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
    }, [cellno]);
    const passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    const isPasswordValid = cellno?.length > 0 && passwordregex.test(cellno); // removed !
    const cnfrmPasswordValid = resetmpin?.length > 0 && passwordregex.test(resetmpin);
    const isPasswordValidch = cellno?.length > 0 && !passwordregex.test(cellno); // removed !
    const cnfrmPasswordValidch = resetmpin?.length > 0 && !passwordregex.test(resetmpin);// removed ! and renamed variable
    const passwordsMatch = cellno === resetmpin;
    const final = !(isPasswordValid && cnfrmPasswordValid && passwordsMatch); // button should be disabled if NOT valid
 useEffect(() => {
            const onBackPress = () => {
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );
            return () => backHandler.remove();
        }, []);
        useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                    <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ paddingBottom: normalize(60) }}>
                        <Loader
                            visible={AuthReducer?.status == 'Auth/resetRequest'} />
                        <View style={{marginTop:normalize(80)}}>
                            {/* <Header
                                onPress={() => props.navigation.goBack()}
                                tintColor={Colorpath.black}
                            /> */}
                            {/* <View style={{ top: normalize(18), marginRight: normalize(10), justifyContent: "center", alignContent: "center" }}>
                                <Image
                                    source={Imagepath.eMedfulllogo}
                                    style={{ alignSelf: "center", height: normalize(40), width: normalize(212), resizeMode: "contain" }}
                                />
                            </View> */}

                            <View style={{ width: normalize(40) }} />
                        </View>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText}>{"Reset Password"}</Text>
                            <Text style={styles.subHeaderText}>
                                {"Your new Password must be different from \n     the previous one"}
                            </Text>
                        </View>
                        <View style={{ paddingHorizontal: normalize(20), paddingVertical: normalize(20) }}>
                            <View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>
                                <View style={{
                                    flex: 1,
                                    paddingRight: normalize(0)
                                }}>
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
                                </View>
                            </View>
                            {isPasswordValidch &&
                                <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "red" }}>
                                        {"Minimum 8+ chars, with 1 uppercase , 1 special character and 1 number."}
                                    </Text>
                                </View>}
                            <View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>
                                <View style={{
                                    flex: 1,
                                    paddingRight: normalize(0)
                                }}>
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
                                </View>
                            </View>
                            {cnfrmPasswordValidch &&
                                <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "red" }}>
                                        {"Minimum 8+ chars, with 1 uppercase , 1 special character and 1 number."}
                                    </Text>
                                </View>}
                            <TouchableOpacity disabled={final}>
                                <Buttons
                                    disabled={final}
                                    onPress={resetHandle}
                                    height={normalize(45)}
                                    width={normalize(280)}
                                    backgroundColor={final ? "#DADADA" : Colorpath.ButtonColr}
                                    borderRadius={normalize(9)}
                                    text="Reset"
                                    color={Colorpath.white}
                                    fontSize={18}
                                    fontFamily={Fonts.InterSemiBold}
                                    marginTop={normalize(10)}
                                />
                                {/* <CustomModal
                                isVisible={isModalVisible}
                                onClose={toggleModal}
                                content={"Your MPIN has been \n   successfully updated"}
                            /> */}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: normalize(50)
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 32,
        color: "#000000",
    },
    subHeaderText: {
        marginTop: normalize(8),
        color: "#666666",
        fontSize: 18,
        fontFamily: Fonts.InterRegular,
        textAlign: 'center',
    },
    inputContainer: {
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10)
        // alignItems: 'center',
    },
    forgotContainer: {
        alignSelf: 'center',
        width: normalize(280),
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    forgotText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        color: Colorpath.ButtonColr,
    },
});

export default ResetMPIN;
