import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity, TextInput, Animated, Easing, Image } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import Header from '../../Components/Header';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { changeemailRequest } from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import TextFieldIn from '../../Components/Textfield';
import Imagepath from '../../Themes/Imagepath';
let status = "";
import { SafeAreaView } from 'react-native-safe-area-context'
const LoginChangeMail = (props) => {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
console.log(props?.route?.params,"heollll==========",AuthReducer)
    const handleChangeEmail = () => {
        const validate = /^(?!.*\.\.)([^\s@]+)@([^\s@]+\.[^\s@\.]{2,4})(?<!\.)$/;

        if (!email) {
            showErrorAlert("Email address is required !");
        } else if (!validate.test(email)) {
            showErrorAlert("Email address should be correct format !");
        } else {
            let obj = {
                "verify_type": "email",
                "email": email,
            }
            connectionrequest()
                .then(() => {
                    dispatch(changeemailRequest(obj));
                })
                .catch(err => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }
    const animatedValuesemail = useRef(new Animated.Value(1)).current;
    const scaleValuesemail = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const targetScales = email ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesemail, {
                toValue: email ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesemail, {
                toValue: targetScales,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [email]);
    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/changeemailRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/changeemailSuccess':
                status = AuthReducer.status;
                props.navigation.navigate("LoginEmail", { NewEmail: { "email": email, verifyotp: AuthReducer?.changeemailResponse?.email_otp,returnDat:props?.route?.params?.wholeData } });
                break;
            case 'Auth/changeemailFailure':
                status = AuthReducer.status;
                break;
        }
    }
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
                    <Loader visible={AuthReducer?.status == 'Auth/changeemailRequest'} />
                    <View>
                        <Header
                            onPress={() => props.navigation.navigate("LoginEmail",{NewEmail:props?.route?.params?.wholeData})}
                            tintColor={Colorpath.black}
                        />
                        {/* <View style={{top:normalize(18),marginRight:normalize(10),justifyContent:"center",alignContent:"center" }}>
                            <Image
                                source={Imagepath.eMedfulllogo}
                                style={{alignSelf:"center", height: normalize(40), width: normalize(212), resizeMode: "contain" }}
                            />
                        </View> */}
                        <View style={{ width: normalize(40) }} />
                    </View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{"Change Your Email"}</Text>
                        <Text style={styles.subHeaderText}>
                            {"You've requested to update your\n email address for all communications."}
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={{ flexDirection: "column", paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                            <Animated.View style={{ opacity: animatedValuesemail, transform: [{ scale: scaleValuesemail }] }}>
                                {email ? (
                                    <View>
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000" }}>
                                            {"New Email Address"}
                                        </Text>
                                    </View>
                                ) : null}
                            </Animated.View>
                            <View
                                style={{
                                    borderBottomColor: '#000000',
                                    borderBottomWidth: 0.5,
                                    marginTop: normalize(5)
                                }}>
                                <TextInput
                                    editable
                                    maxLength={50}
                                    onChangeText={val => setEmail(val)}
                                    value={email}
                                    style={{ height: normalize(40), width: normalize(270), paddingVertical: 0, fontSize: 16, color: "#000000", fontFamily: Fonts.InterMedium }}
                                    placeholder="New email address"
                                    placeholderTextColor={"RGB(170, 170, 170)"}
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Buttons
                                onPress={handleChangeEmail}
                                height={normalize(45)}
                                width={normalize(280)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(9)}
                                text="Update Email"
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(30)}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: normalize(20) }}>
                        <TouchableOpacity onPress={() => { props.navigation.navigate("LoginEmail",{NewEmail:props?.route?.params?.wholeData || AuthReducer?.verifyResponse?.email}); }}>
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: Colorpath.ButtonColr }}>
                                Cancel
                            </Text>
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
        marginTop:normalize(50)
        // backgroundColor:"red"
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 32,
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

export default LoginChangeMail;
