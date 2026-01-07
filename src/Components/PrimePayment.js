import { View, Text, Platform, Linking, TouchableOpacity, Image, Alert, BackHandler } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Colorpath from '../Themes/Colorpath';
import PageHeader from '../Components/PageHeader';
import MyStatusBar from '../Utils/MyStatusBar';
import normalize from '../Utils/Helpers/Dimen';
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native';
import MaskInput, { Masks } from 'react-native-mask-input';
import Fonts from '../Themes/Fonts';
import TextFieldIn from '../Components/Textfield';
import Imagepath from '../Themes/Imagepath';
import TickMark from 'react-native-vector-icons/Ionicons';
import Buttons from '../Components/Button';
import connectionrequest from '../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import showErrorAlert from '../Utils/Helpers/Toast';
import Loader from '../Utils/Helpers/Loader';
import moment from 'moment';
import { PrimePaymentRequest } from '../Redux/Reducers/WebcastReducer';
import PrimeSuccess from './PrimeSuccess';
import InputField from './CellInput';
import MaskField from './Mask';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'

let status1 = "";
const PrimePayment = (props) => {
    const {
        isConnected
    } = useContext(AppContext);
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [maskedEx, setmaskedEx] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [cvv, setCvv] = useState('');
    const [click, setClick] = useState(false);
    const [click2, setClick2] = useState(false);
    const [checked, setChecked] = useState(false);
    const [socheck, setSocheck] = useState(false);
    const alphaspace = /^[A-Za-z\s]*$/;
    const cvvRegex = /^[0-9]{3,4}$/
    const [finalex, setFinalex] = useState("");
    const navigate = useNavigation();
    const [primesc, setPrimesc] = useState(false);
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const paymentPress = () => {
        navigate.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }))
    }
    useEffect(() => {
        if (maskedEx && maskedEx.includes('/')) {
            const [month, year] = maskedEx.split('/');
            if (!month || !year) {
                showErrorAlert("Invalid format. Please enter the expiry date in MM/YYYY format.");
                return;
            }
            const formattedYear = year;
            const apiFormattedDate = `${month}/${formattedYear}`;
            if (apiFormattedDate) {
                setFinalex(apiFormattedDate);
            }
            console.log(apiFormattedDate);
        }
    }, [maskedEx])
    function primepaymentHandle() {
        const errors = {
            nameEmpty: 'Enter the cardholder name.',
            nameInvalid: 'Enter a valid cardholder name ',
            cardNoEmpty: 'Enter your credit/debit card number.',
            cardNoInvalid: 'Enter a valid card number',
            expiryEmpty: 'Enter your card expiry date',
            expiryInvalidMonth: "Invalid month. Please enter a value between 01 and 12.",
            expiryInvalidYear: "Expiry year must be in the future.",
            expiryInvalidDate: "The expiry date is invalid for the selected year.",
            invalidFormat: "Use MM/YYYY format (e.g., 06/2030) for card expiry date",
            cvvEmpty: 'Enter your card CVV',
            cvvInvalid: 'CVV must be 3 or 4 digits.',
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
        if (maskedEx?.length !== 7) {
            showErrorAlert(errors.invalidFormat);
            return;
        }
        if (!name) {
            showErrorAlert(errors.nameEmpty);
            return;
        }
        if (!alphaspace.test(name)) {
            showErrorAlert(errors.nameInvalid);
            return;
        }
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
        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
        if (year < nextYear || (year === nextYear && month < nextMonth)) {
            showErrorAlert(errors.expiryInvalidDate);
            return;
        }
        const res = cardNo.replace(/ /g, '');
        const obj = {
            "frequency": "year",
            "card_holder_name": name,
            "card_number": Number(res),
            "card_cvv": cvv,
            "card_expiry": finalex || finalex,
            "referral_code": ""
        };
        console.log('obj', obj);
        connectionrequest()
            .then(() => {
                dispatch(PrimePaymentRequest(obj))
            })
            .catch(() => {
                showErrorAlert(errors.noInternet);
            });
    }
    if (status1 == '' || WebcastReducer.status != status1) {
        switch (WebcastReducer.status) {
            case 'WebCast/PrimePaymentRequest':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/PrimePaymentSuccess':
                status1 = WebcastReducer.status;
                if (WebcastReducer?.PrimePaymentResponse?.msg == 'You are now enrolled for subscription successfully.') {
                    setPrimesc(true);
                    showErrorAlert("You are now enrolled for subscription successfully.")
                } else {
                    showErrorAlert("Payment failed, try again.!")
                    navigate.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }))
                }
                console.log("payment")
                break;
            case 'WebCast/PrimePaymentFailure':
                status1 = WebcastReducer.status;
                setPrimesc(false)
                navigate.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }))
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
    return (
        <>
            <MyStatusBar
                barStyle={"light-content"}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn == false ? <IntOff /> :  <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === "ios" ? (
                    <PageHeader
                        title="Prime Payment"
                        onBackPress={paymentPress}
                    />
                ) : (
                    <View>
                        <PageHeader
                            title="Prime Payment"
                            onBackPress={paymentPress}
                        />
                    </View>
                )}
                <Loader
                    visible={WebcastReducer?.status == 'WebCast/PrimePaymentRequest'} />
                <View style={{ paddingHorizontal: normalize(20), paddingVertical: normalize(10) }}>
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
                <View style={{ flexDirection: "column", justifyContent: "center", paddingHorizontal: normalize(17), paddingVertical: normalize(10) }}>
                    <View style={{ flexDirection: "row", }}>
                        <View style={{ flexDirection: "row", gap: normalize(10) }}>
                            <TouchableOpacity onPress={() => { setChecked(!checked) }}>
                                {!checked ? <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colorpath.ButtonColr, borderColor: Colorpath.ButtonColr, height: normalize(20), width: normalize(20), borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }}>
                                    <TickMark name="checkmark" color={Colorpath.white} size={20} />
                                </View> :
                                    <View style={{ borderColor: Colorpath.black, height: normalize(20), width: normalize(20), borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }} />
                                }
                            </TouchableOpacity>
                            <View style={{ flexDirection: "row", marginTop: normalize(8) }}>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 13, color: "#666666" }}>
                                    {"I accept the"}
                                </Text>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity onPress={(() => props.navigation.navigate("TermsAndConditions"))}>
                                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: Colorpath.ButtonColr }}>
                                            {" Terms of Use"}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#666666" }}>
                                        {" and"}
                                    </Text>
                                    <TouchableOpacity onPress={(() => props.navigation.navigate("PrivacyPolicy"))}>
                                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: Colorpath.ButtonColr }}>
                                            {" Privacy Policy"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: normalize(15) }}>
                        <View style={{ flexDirection: "row", gap: normalize(10) }}>
                            <TouchableOpacity onPress={() => { setSocheck(!socheck) }} >
                                {!socheck ? <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colorpath.ButtonColr, borderColor: Colorpath.ButtonColr, height: normalize(20), width: normalize(20), borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }}>
                                    <TickMark name="checkmark" color={Colorpath.white} size={20} />
                                </View> :
                                    <View style={{ height: normalize(20), width: normalize(20), borderColor: Colorpath.black, borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }} />
                                }
                            </TouchableOpacity>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#666666" }}>
                                    {"I agree to receive messages and OTPs for\nsecure account access from eMedEvents."}
                                </Text>
                            </View>

                        </View>
                    </View>
                </View>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignContent: "space-around",
                    gap: normalize(20)
                }}>
                    <View style={{ flexDirection: "column" }}>
                        <Text
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 14,
                                color: '#333',
                            }}>
                            {`Total Price`}
                        </Text>
                        <Text
                            style={{
                                fontFamily: Fonts.InterBold,
                                fontSize: 18,
                                color: '#333',
                                marginLeft: normalize(1)
                            }}>
                            {`US$99`}
                        </Text>
                    </View>
                    <Buttons onPress={() => primepaymentHandle()}
                        height={normalize(45)}
                        width={normalize(175)}
                        backgroundColor={(checked || socheck) ? "#DADADA" : Colorpath.ButtonColr}
                        borderRadius={normalize(9)}
                        text="Submit"
                        color={Colorpath.white}
                        fontSize={18}
                        fontFamily={Fonts.InterSemiBold}
                        disabled={checked || socheck}
                    />
                </View>
                {/* <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <Buttons onPress={() => primepaymentHandle()}
                        height={normalize(45)}
                        width={normalize(140)}
                        backgroundColor={(checked || socheck) ? "#DADADA" : Colorpath.ButtonColr}
                        borderRadius={normalize(9)}
                        text="Submit"
                        color={Colorpath.white}
                        fontSize={18}
                        fontFamily={Fonts.InterSemiBold}
                        disabled={checked || socheck}
                    />
                </View> */}
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: normalize(17),
                    paddingVertical: normalize(10)
                }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterRegular,
                            fontSize: 14,
                            color: "#CCC",
                            flex: 1,
                        }}
                    >
                        {"We offer a secure online payment process that does not store or share your information with any third party companies."}
                    </Text>
                    <Image
                        source={Imagepath.Authorize}
                        style={{
                            height: normalize(50),
                            width: normalize(90),
                            resizeMode: "contain"
                        }}
                    />
                </View>
                {primesc && <PrimeSuccess email={DashboardReducer?.mainprofileResponse?.personal_information?.email} endDate={WebcastReducer?.PrimePaymentResponse?.auto_renew_date} startDate={WebcastReducer?.PrimePaymentResponse?.prime_start_date} primesc={primesc} setPrimesc={setPrimesc} nav={navigate} />}
            </SafeAreaView>}
        </>
    )
}

export default PrimePayment