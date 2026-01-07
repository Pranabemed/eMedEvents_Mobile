import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, Animated, Easing, TextInput, Image, BackHandler } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import Header from '../../Components/Header';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { changephoneRequest } from '../../Redux/Reducers/AuthReducer';
import Loader from '../../Utils/Helpers/Loader';
import TextFieldIn from '../../Components/Textfield';
import Imagepath from '../../Themes/Imagepath';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
const AddMobile = (props) => {
    const [phone, setPhone] = useState("");
    const [mobileHd, setMobileHd] = useState("");
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const handleMobilNOchange = () => {
        const mobilePattern = /^\d{10,15}$/;
        if (!phone) {
            showErrorAlert("Cell no is required !")
        } else if (!mobilePattern.test(phone)) {
            showErrorAlert("Cell no should be 10 - 15 digit ");
        } else {
            const getPhCd = "+91";
            let obj = {
                "verify_type": "phone",
                "phone": `${getPhCd}${phone}`,
            }
            connectionrequest()
                .then(() => {
                    dispatch(changephoneRequest(obj));
                })
                .catch(err => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }
    const animatedValuesphone = useRef(new Animated.Value(1)).current;
    const scaleValuesphone = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const targetScales = phone ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesphone, {
                toValue: phone ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesphone, {
                toValue: targetScales,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [phone]);
    const mobileRegex = /^\d{10,15}$/;
    const isButtonEnabled = mobileRegex.test(phone);
    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/changephoneRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/changephoneSuccess':
                status = AuthReducer.status;
                const getPhCdSent = "+91";
                props.navigation.navigate("SplashMobile", { Newphone: { "phone": phone, "Verifycell": AuthReducer?.changephoneResponse?.phone_otp, phoneCode: `${getPhCdSent}${phone}` } });
                break;
            case 'Auth/changephoneFailure':
                status = AuthReducer.status;
                break;
        }
    }
    const formatPhoneNumber = (input) => {
        const cleaned = input.replace(/\D/g, '').slice(0, 10);
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

        if (match) {
            let formatted = '';
            if (match[1]) formatted = `(${match[1]}`;
            if (match[2]) formatted += `) ${match[2]}`;
            if (match[3]) formatted += `-${match[3]}`;
            return formatted;
        }
        return input;
    };
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
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                    <Loader visible={AuthReducer?.status == 'Auth/changephoneRequest'} />
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        {/* <Header
                            onPress={finalBack}
                            tintColor={Colorpath.black}
                        /> */}
                        <View style={{ marginTop: normalize(60), marginRight: normalize(10), justifyContent: "center", alignContent: "center" }}>
                            <Image
                                source={Imagepath.eMedfulllogo}
                                style={{ alignSelf: "center", height: normalize(40), width: normalize(212), resizeMode: "contain" }}
                            />
                        </View>

                        <View style={{ width: normalize(40) }} />
                    </View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{"Add your cell number"}</Text>
                        {/* <Text style={styles.subHeaderText}>
                            {"You've requested to update your \nCell number for all communications."}
                        </Text> */}
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={{ flexDirection: "column", paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                            <Animated.View style={{ opacity: animatedValuesphone, transform: [{ scale: scaleValuesphone }] }}>
                                {phone ? (
                                    <View>
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000" }}>
                                            {"Cell Number"}
                                        </Text>
                                    </View>
                                ) : null}
                            </Animated.View>
                            <View
                                style={{
                                    borderBottomColor: '#000000',
                                    borderBottomWidth: 0.5,
                                    marginTop: normalize(5),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                }}>
                                <TextInput
                                    editable={false}
                                    maxLength={5}
                                    value={`${"+91"} -`}
                                    style={{ height: normalize(40), width: normalize(48), paddingVertical: 0, fontSize: 14, color: "#000000", fontFamily: Fonts.InterMedium }}
                                    keyboardType="default"
                                />
                                <TextInput
                                    editable
                                    maxLength={15}
                                    onChangeText={text => {
                                        const formatted = formatPhoneNumber(text);
                                        setMobileHd(formatted);
                                        const rawDigits = formatted.replace(/\D/g, '');
                                        setPhone(rawDigits);
                                    }}
                                    value={mobileHd}
                                    style={{ height: normalize(40), width: normalize(228), paddingVertical: 0, fontSize: 14, color: "#000000", fontFamily: Fonts.InterMedium }}
                                    placeholder={'Cell Number*'}
                                    placeholderTextColor={"RGB(170, 170, 170)"}
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Buttons
                                onPress={handleMobilNOchange}
                                height={normalize(45)}
                                width={normalize(280)}
                                backgroundColor={isButtonEnabled ? Colorpath.ButtonColr : "#CCC"}
                                borderRadius={normalize(9)}
                                text="Send verification code"
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(30)}
                                disabled={!isButtonEnabled}
                            />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </>
    );
};

const styles = {
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: normalize(50)
        // backgroundColor:"red"
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 30,
        color: "#000000",
    },
    subHeaderText: {
        marginTop: normalize(13),
        color: "#666666",
        fontSize: 18,
        fontFamily: Fonts.InterRegular,
        textAlign: 'center',
    },
    inputContainer: {
        alignItems: 'center',
        marginTop: normalize(20)
    },
    forgotContainer: {
        marginTop: normalize(10),
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
};

export default AddMobile;

