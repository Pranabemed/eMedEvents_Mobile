import { View, Platform, Alert, BackHandler } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import normalize from '../../Utils/Helpers/Dimen';
import MaskInput, { Masks } from 'react-native-mask-input';
import Fonts from '../../Themes/Fonts';
import TextFieldIn from '../../Components/Textfield';
import Imagepath from '../../Themes/Imagepath';
import Buttons from '../../Components/Button';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import moment from 'moment';
import { subPaymentcardRequest } from '../../Redux/Reducers/TransReducer';
import InputField from '../../Components/CellInput';
import MaskField from '../../Components/Mask';
import { AppContext } from '../GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
let status1 = "";
import { SafeAreaView } from 'react-native-safe-area-context'
const PaymentSub = (props) => {
    const {
        isConnected
    } = useContext(AppContext);
    const TransReducer = useSelector(state => state.TransReducer);
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [maskedEx, setmaskedEx] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [cvv, setCvv] = useState('');
    const [click, setClick] = useState(false);
    const [click2, setClick2] = useState(false);
    const alphaspace = /^[A-Za-z\s]*$/;
    const cvvRegex = /^[0-9]{3,4}$/;
    const [finalex, setFinalex] = useState("");
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    console.log(props?.route?.params?.takeid, "props?.route?.params?.takeid", finalex, maskedEx);
    const paymentPress = () => {
        props.navigation.goBack();
    }
    useEffect(() => {
        if (maskedEx && maskedEx.includes('/')) {
            const [month, year] = maskedEx.split('/');
            if (!month || !year) {
                showErrorAlert("Invalid format. Please enter the expiry date in MM/YYYY format.");
                return;
            }
            const formattedYear = year.slice(-2);
            const apiFormattedDate = `${month}/${formattedYear}`;
            if (apiFormattedDate) {
                setFinalex(apiFormattedDate);
            }
            console.log(apiFormattedDate);
        }
    }, [maskedEx])
    function paymentwalletHandle() {
        const errors = {
            nameEmpty: 'Please enter cardholder name',
            nameInvalid: 'Please enter cardholder name correctly',
            cardNoEmpty: 'Please enter your card number',
            cardNoInvalid: 'Please enter a valid card number',
            expiryEmpty: 'Please enter your card expiry date',
            expiryInvalidMonth: "Invalid month. Please enter a value between 01 and 12.",
            expiryInvalidYear: "The expiry year must be greater than the current year.",
            expiryInvalidDate: "The expiry date is invalid for the selected year.",
            invalidFormat: "Invalid format. Please enter the expiry date in MM/YYYY format.",
            cvvEmpty: 'Please enter your card CVV number',
            cvvInvalid: 'CVC number should be 3 or 4 digits',
            noInternet: 'Please connect to Internet',
        };
        if (!cardNo) {
            showErrorAlert(errors.cardNoEmpty);
            return;
        }
        if (cardNo?.length !== 19) {
            showErrorAlert(errors.cardNoInvalid);
            return;
        }
        if (!cvv) {
            showErrorAlert(errors.cvvEmpty);
            return;
        }
        if (!cvvRegex.test(cvv)) {
            showErrorAlert(errors.cvvInvalid);
            return;
        }
        if (!maskedEx) {
            showErrorAlert(errors.expiryEmpty);
            return;
        }
        if (maskedEx?.length === 7) {
            const [monthStr, yearStr] = maskedEx.split('/');
            const month = Number(monthStr);
            const year = Number(yearStr);
            const currentYear = Number(moment().format('YYYY'));
            const currentMonth = Number(moment().format('MM'));
            if (month < 1 || month > 12) {
                showErrorAlert(errors.expiryInvalidMonth);
                return;
            }
            if (year < currentYear) {
                showErrorAlert(errors.expiryInvalidYear);
                return;
            }
            if (currentMonth === 1 && year === currentYear && month <= currentMonth) {
                showErrorAlert(errors.expiryInvalidDate);
                return;
            }
            if (currentMonth === 12 && year === currentYear && month <= currentMonth) {
                showErrorAlert(errors.expiryInvalidDate);
                return;
            }
            if (year === currentYear && month < currentMonth) {
                showErrorAlert(errors.expiryInvalidDate);
                return;
            }
        } else {
            showErrorAlert(errors.invalidFormat);
        } if (!name) {
            showErrorAlert(errors.nameEmpty);
            return;
        }
        if (!alphaspace.test(name)) {
            showErrorAlert(errors.nameInvalid);
            return;
        }
        const res = cardNo.replace(/ /g, '');
        const walletobj = {
            "subscription_id": props?.route?.params?.takeid,
            "card_holder_name": name,
            "card_number": Number(res),
            "card_cvv": cvv,
            "card_expiry": maskedEx ? maskedEx : maskedEx,
        };
        console.log(walletobj, "12333objs---");
        connectionrequest()
            .then(() => {
                dispatch(subPaymentcardRequest(walletobj));
            })
            .catch(() => {
                showErrorAlert(errors.noInternet);
            });
    }
    if (status1 == '' || TransReducer.status != status1) {
        switch (TransReducer.status) {
            case 'Transaction/subPaymentcardRequest':
                status1 = TransReducer.status;
                break;
            case 'Transaction/subPaymentcardSuccess':
                status1 = TransReducer.status;
                if (TransReducer?.subPaymentcardResponse?.msg === "Subscription not updated, try again.") {
                    showErrorAlert("Your subscription payment details are not updated due to invalid credit/debit card information. Please try again with a valid credit/debit card.");
                } else {
                    showErrorAlert("Your subscription payment details updated successfully.");
                    props.navigation.goBack();
                }
                console.log(TransReducer?.subPaymentcardResponse, "----1111111111111")
                break;
            case 'Transaction/subPaymentcardFailure':
                status1 = TransReducer.status;
                break;
        }
    }
    useEffect(() => {
        const onBackPress = () => {
            paymentPress();
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
                barStyle={"light-content"}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn == false ? <IntOff /> : <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === "ios" ? (
                    <PageHeader
                        title="Subscription Payment"
                        onBackPress={paymentPress}
                    />
                ) : (
                    <View>
                        <PageHeader
                            title="Subscription Payment"
                            onBackPress={paymentPress}
                        />
                    </View>
                )}
                <Loader
                    visible={TransReducer?.status == 'Transaction/subPaymentcardRequest'} />
                <View style={{ paddingHorizontal: normalize(20), paddingVertical: normalize(0) }}>
                    <View>
                        <View>
                            <MaskField
                                label='Card number*'
                                value={cardNo}
                                onChangeText={setCardNo}
                                placeholder=''
                                placeholderTextColor="#949494"
                                showCountryCode={false}
                                maxlength={19}
                                keyboardType="numeric"
                                mask={Masks.CREDIT_CARD}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", gap: normalize(5) }}>
                        <View style={{ flex: 0.4, paddingRight: 0 }}>
                            <View>
                                <InputField
                                    label='CVV*'
                                    value={cvv}
                                    onChangeText={setCvv}
                                    placeholder=''
                                    placeholderTextColor="#949494"
                                    showCountryCode={false}
                                    maxlength={4}
                                    keyboardType="numeric"
                                    secureTrue={true}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 0.6, paddingRight: 0 }}>
                            <View>
                                <InputField
                                    label='Expiry date(MM/YYYY)*'
                                    value={maskedEx}
                                    onChangeText={val => {
                                        const formatted = val.replace(
                                            /^(\d{0,2})\/?(\d{0,4})$/,
                                            (_, month, year) => {
                                                const cleanMonth = month.slice(0, 2);
                                                const cleanYear = year.slice(0, 4);
                                                return cleanMonth + (cleanYear ? `/${cleanYear}` : '');
                                            },
                                        );
                                        if (formatted.length <= 7) {
                                            setmaskedEx(formatted);
                                        }
                                    }}
                                    placeholder=''
                                    placeholderTextColor="#949494"
                                    showCountryCode={false}
                                    maxlength={7}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <View>
                            <InputField
                                label='Name of card holder*'
                                value={name}
                                onChangeText={setName}
                                placeholder=''
                                placeholderTextColor="#949494"
                                showCountryCode={false}
                                maxlength={100}
                                keyboardType="default"
                                editable={Boolean(cardNo || cvv || maskedEx)}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <Buttons
                        onPress={() => {
                            paymentwalletHandle();
                        }}
                        height={normalize(45)}
                        width={normalize(299)}
                        backgroundColor={
                            Colorpath.ButtonColr
                        }
                        borderRadius={normalize(9)}
                        text="Submit"
                        color={Colorpath.white}
                        fontSize={18}
                        fontFamily={Fonts.InterSemiBold}
                    />
                </View>
                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <Buttons
                        onPress={() => {
                            props.navigation.goBack();
                        }}
                        height={normalize(45)}
                        width={normalize(299)}
                        backgroundColor={
                            Colorpath.white
                        }
                        borderRadius={normalize(9)}
                        text="Cancel"
                        color={"#999999"}
                        fontSize={18}
                        fontFamily={Fonts.InterSemiBold}
                        borderBottomWidth={0.8}
                        borderColor={"#999999"}
                        borderWidth={0.6}
                    />
                </View>
            </SafeAreaView>}
        </>
    )
}

export default PaymentSub