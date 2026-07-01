/**
 * Payment screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status1, Payment, formatPrice, handleSelect, toggleModalPayment, toggleModalFailed, takeStatus, walletpayemnthand, paymentHandle, paymentwalletHandle, paymentPress, onBackPress, cutomPrice, formatNumberWithCommas, cleanNumber, getCartTransactionFeeValue, getRegisterTransactionFeeValue.
 */

import { View, Text, Platform, Linking, TouchableOpacity, Image, Alert, BackHandler, ScrollView } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import normalize from '../../Utils/Helpers/Dimen';
import { useIsFocused } from '@react-navigation/native';
import MaskInput, { Masks } from 'react-native-mask-input';
import Fonts from '../../Themes/Fonts';
import TextFieldIn from '../../Components/Textfield';
import Imagepath from '../../Themes/Imagepath';
import TickMark from 'react-native-vector-icons/Ionicons';
import CustomPaymentradio from '../../Components/CustomRadio';
import Buttons from '../../Components/Button';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { cartPaymentRequest, PaymentCheckRequest, walletCheckRequest, webcastPaymentRequest } from '../../Redux/Reducers/WebcastReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import moment from 'moment';
import PayModal from '../../Components/PayModal';
import PayModalFd from '../../Components/PayModalFd';
import { dashboardRequest, stateDashboardRequest } from '../../Redux/Reducers/DashboardReducer';
import MaskField from '../../Components/Mask';
import InputField from '../../Components/CellInput';
import showDur from '../../Utils/Helpers/Duration';
import { AppContext } from '../GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable Payment component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
let status1 = "";
/**
 * Payment component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const Payment = (props) => {
    const {
        isConnected,
        fulldashbaord,
        setAddit
    } = useContext(AppContext);
    const WebcastReducer = useSelector(state => state.WebcastReducer);
        /**
 * Formats price.
 * @param {*} price - Input value.
 * @returns {*}
 */
function formatPrice(price) {
        let num = parseFloat(price);
        if (isNaN(num)) {
            return price;
        }
        let truncated = Math.floor(num * 100) / 100;

        return truncated % 1 == 0 ? truncated.toString() : truncated.toFixed(2);
    }
    const dispatch = useDispatch();
    const [remind, setRemind] = useState("");
    const [name, setName] = useState("");
    const isFocus = useIsFocused();
    const [maskedEx, setmaskedEx] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [cvv, setCvv] = useState('');
    const [click, setClick] = useState(false);
    const [click2, setClick2] = useState(false);
    const [checked, setChecked] = useState(false);
    const [socheck, setSocheck] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [wallettrue, setWallettrue] = useState(false);
    const [printgo, setPrintgo] = useState("");
    const expiryDate = [/\d/, /\d/, '/', /\d/, /\d/];
    const alphaspace = /^[A-Za-z\s]*$/;
    const cvvRegex = /^[0-9]{3,4}$/;
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    useEffect(() => {
        setRemind("Credit Card");
        let obj = {}
        connectionrequest()
            .then(() => {
                dispatch(walletCheckRequest({ obj }))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }, [isFocus])
    // Options are defined dynamically based on wallet balance availability below
        /**
 * Handles select.
 * @param {*} option - Input value.
 * @returns {void}
 */
const handleSelect = (option) => {
        setRemind(option);
    };
    const [paymentcard, setPaymentcard] = useState(false);
    const [finalex, setFinalex] = useState("")
    const [paymentfd, setPaymentfd] = useState(false);
        /**
 * Toggle modal payment utility.
 * @param {*} tick - Input value.
 * @returns {void}
 */
const toggleModalPayment = (tick) => {
        setPaymentcard(tick);
    };
        /**
 * Toggle modal failed utility.
 * @param {*} vlk - Input value.
 * @returns {void}
 */
const toggleModalFailed = (vlk) => {
        setPaymentfd(vlk);
    };
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
        }
    }, [maskedEx])
        /**
 * Take status utility.
 * @returns {void}
 */
const takeStatus = () => {
        const routeParams = props?.route?.params;

        const takeCourse =
            routeParams?.invoiceTxt?.invoiceTxt ||
            WebcastReducer?.addtoCartWebcastResponse?.invoice;

        const cartCourse =
            routeParams?.cartInvoice?.cartInvoice ||
            WebcastReducer?.cartCheckoutResponse?.invoiceNumber;

        // choose first available invoice
        const finalInvoice = takeCourse || cartCourse;

        if (!finalInvoice) return;

        const obj = { invoice: finalInvoice };

        connectionrequest()
            .then(() => {
                dispatch(PaymentCheckRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
            });
    };

        /**
 * Walletpayemnthand utility.
 * @returns {void}
 */
const walletpayemnthand = () => {
        if (checked) {
            showErrorAlert("Please accept terms and conditions");
            return;
        }
        const obj = props?.route?.params?.invoiceTxt?.emeded_acc == 'added' ? {
            "invoice": props?.route?.params?.invoiceTxt?.invoiceTxt ? props?.route?.params?.invoiceTxt?.invoiceTxt : props?.route?.params?.cartInvoice?.cartInvoice,
            "wallet_amount": 1,
            "card_holder_name": "",
            "card_number": "",
            "card_cvv": "",
            "card_expiry": "",
            "accept_updates": 1,
            "reporting_consent": "1"
        } : {
            "invoice": props?.route?.params?.invoiceTxt?.invoiceTxt ? props?.route?.params?.invoiceTxt?.invoiceTxt : props?.route?.params?.cartInvoice?.cartInvoice,
            "wallet_amount": 1,
            "card_holder_name": "",
            "card_number": "",
            "card_cvv": "",
            "card_expiry": "",
            "accept_updates": 1,
        }
        connectionrequest()
            .then(() => {
                if (props?.route?.params?.cartInvoice?.cartInvoice) {
                    dispatch(cartPaymentRequest(obj));
                } else {
                    dispatch(webcastPaymentRequest(obj));
                }
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
        /**
 * Payment handle utility.
 * @returns {void}
 *
 * @remarks Does not return a value.
 */
function paymentHandle() {
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
        if (checked) {
            showErrorAlert("Please accept terms and conditions");
            return;
        }
        const res = cardNo.replace(/ /g, '');
        const obj = props?.route?.params?.invoiceTxt?.emeded_acc == 'added' ? {
            "invoice": props?.route?.params?.invoiceTxt?.invoiceTxt
                ? props?.route?.params?.invoiceTxt?.invoiceTxt
                : props?.route?.params?.cartInvoice?.cartInvoice,
            "wallet_amount": 0,
            "card_holder_name": name,
            "card_number": Number(res),
            "card_cvv": cvv,
            "card_expiry": finalex || finalex,
            "reporting_consent": "1"
        } : {
            "invoice": props?.route?.params?.invoiceTxt?.invoiceTxt
                ? props?.route?.params?.invoiceTxt?.invoiceTxt
                : props?.route?.params?.cartInvoice?.cartInvoice,
            "wallet_amount": 0,
            "card_holder_name": name,
            "card_number": Number(res),
            "card_cvv": cvv,
            "card_expiry": finalex || finalex
        };
        connectionrequest()
            .then(() => {
                if (props?.route?.params?.cartInvoice?.cartInvoice) {
                    dispatch(cartPaymentRequest(obj));
                } else {
                    dispatch(webcastPaymentRequest(obj));
                }
            })
            .catch(() => {
                showErrorAlert(errors.noInternet);
            });
    }
        /**
 * Paymentwallet handle utility.
 * @returns {void}
 *
 * @remarks Does not return a value.
 */
function paymentwalletHandle() {
        const errors = {
            nameEmpty: 'Please enter card holder name',
            nameInvalid: 'Please enter card holder name correctly',
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
        if (checked) {
            showErrorAlert("Please accept terms and conditions");
            return;
        }
        const res = cardNo.replace(/ /g, '');
        const walletobj = props?.route?.params?.invoiceTxt?.emeded_acc == 'added' ? {
            "invoice": props?.route?.params?.invoiceTxt?.invoiceTxt ? props?.route?.params?.invoiceTxt?.invoiceTxt : props?.route?.params?.cartInvoice?.cartInvoice,
            "wallet_amount": 1,
            "card_holder_name": name,
            "card_number": Number(res),
            "card_cvv": cvv,
            "card_expiry": finalex ? finalex : finalex,
            "accept_updates": 1,
            "reporting_consent": "1"
        } : {
            "invoice": props?.route?.params?.invoiceTxt?.invoiceTxt ? props?.route?.params?.invoiceTxt?.invoiceTxt : props?.route?.params?.cartInvoice?.cartInvoice,
            "wallet_amount": 1,
            "card_holder_name": name,
            "card_number": Number(res),
            "card_cvv": cvv,
            "card_expiry": finalex ? finalex : finalex,
            "accept_updates": 1
        };
        connectionrequest()
            .then(() => {
                if (props?.route?.params?.cartInvoice?.cartInvoice) {
                    dispatch(cartPaymentRequest(walletobj));
                } else {
                    dispatch(webcastPaymentRequest(walletobj));
                }
            })
            .catch(() => {
                showErrorAlert(errors.noInternet);
            });

    }
    if (status1 == '' || WebcastReducer.status != status1) {
        switch (WebcastReducer.status) {
            case 'WebCast/webcastPaymentRequest':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/webcastPaymentSuccess':
                status1 = WebcastReducer.status;
                if (WebcastReducer?.webcastPaymentResponse?.payment_status == 'already paid') {
                    showErrorAlert("Oops !! Your payment already paid .")
                } else if (WebcastReducer?.webcastPaymentResponse?.payment_status == "failed") {
                    showErrorAlert("Oops !! Your payment has been failed .")
                } else if (WebcastReducer?.webcastPaymentResponse?.payment_status == 'success') {
                    const difGet = props?.route?.params?.invoiceTxt?.paymentprice?.inPersonTicket?.billing_address?.state_id || props?.route?.params?.cartInvoice?.paymentprice?.user_billing_address?.state_id || props?.route?.params?.invoiceTxt?.ticketShow?.license_state_id;
                    dispatch(stateDashboardRequest({ "state_id": difGet }))
                    takeStatus();
                }
                break;
            case 'WebCast/webcastPaymentFailure':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/cartPaymentRequest':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/cartPaymentSuccess':
                status1 = WebcastReducer.status;
                if (WebcastReducer?.cartPaymentResponse?.payment_status == 'already paid') {
                    showErrorAlert("Oops !! Your payment already paid .")
                } else if (WebcastReducer?.cartPaymentResponse?.payment_status == "failed") {
                    showErrorAlert("Oops !! Your payment has been failed .")
                } else if (WebcastReducer?.cartPaymentResponse?.payment_status == 'success') {
                    const difGet = props?.route?.params?.invoiceTxt?.paymentprice?.inPersonTicket?.billing_address?.state_id || props?.route?.params?.cartInvoice?.paymentprice?.user_billing_address?.state_id || props?.route?.params?.invoiceTxt?.ticketShow?.license_state_id;
                    dispatch(stateDashboardRequest({ "state_id": difGet }))
                    takeStatus();
                }
                break;
            case 'WebCast/cartPaymentFailure':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/PaymentCheckRequest':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/PaymentCheckSuccess':
                status1 = WebcastReducer.status;
                if (WebcastReducer?.PaymentCheckResponse?.payment_status == 'already paid') {
                    toggleModalFailed(true);
                } else if (WebcastReducer?.PaymentCheckResponse?.payment_status == "failed") {
                    toggleModalFailed(true);
                } else if (WebcastReducer?.PaymentCheckResponse?.payment_status == 'success') {
                    const difGet = props?.route?.params?.invoiceTxt?.paymentprice?.inPersonTicket?.billing_address?.state_id || props?.route?.params?.cartInvoice?.paymentprice?.user_billing_address?.state_id || props?.route?.params?.invoiceTxt?.ticketShow?.license_state_id;
                    dispatch(stateDashboardRequest({ "state_id": difGet }))
                    toggleModalPayment(true);
                }
                break;
            case 'WebCast/PaymentCheckFailure':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/walletCheckRequest':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/walletCheckSuccess':
                status1 = WebcastReducer.status;
                const bal = Number(WebcastReducer?.walletCheckResponse?.balance || 0);
                if (bal > 0) {
                    setSelectedOption(2);
                    setRemind({ id: 2, label: 'Wallet Balance' });
                } else {
                    setSelectedOption(1);
                    setRemind({ id: 1, label: 'Credit Card' });
                }
                break;
            case 'WebCast/walletCheckFailure':
                status1 = WebcastReducer.status;
                setSelectedOption(1);
                setRemind({ id: 1, label: 'Credit Card' });
                break;
        }
    }
    const handlePayemnt = WebcastReducer?.webcastPaymentResponse?.payment_status == 'success' || WebcastReducer?.cartPaymentResponse?.payment_status == 'success' || WebcastReducer?.PaymentCheckResponse?.payment_status == 'success';
        /**
 * Payment press utility.
 * @returns {void}
 */
const paymentPress = () => {
        if (handlePayemnt) {
            const fullDta = fulldashbaord?.[0];
            setAddit(fullDta);
            props.navigation.navigate("TabNav");
        } else {
            props.navigation.goBack();
        }
    }
    useEffect(() => {
                /**
 * On back press utility.
 * @returns {boolean}
 */
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
    useEffect(() => {
        if (printgo == "go") {
            setPrintgo("no");
            setTimeout(() => {
                props.navigation.navigate("TabNav");
            }, 10000);
        }
    }, [printgo])
        /**
 * Cutom price helper.
 * @param {*} price - Input value.
 * @returns {*}
 */
function cutomPrice(price) {
        let num = parseFloat(price);
        if (isNaN(num)) {
            return price;
        }
        let truncated = Math.floor(num * 100) / 100;

        return truncated % 1 == 0 ? truncated.toString() : truncated.toFixed(2);
    }
        /**
 * Formats number with commas.
 * @param {*} value - Input value.
 * @returns {*}
 */
const formatNumberWithCommas = (value) => {
        if (value == null || value == undefined) return '';
        const stringValue = value.toString().replace(/,/g, '');
        const parts = stringValue.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };
        /**
 * Clean number utility.
 * @param {*} value - Input value.
 * @returns {number}
 */
const cleanNumber = (value) => {
        if (typeof value == 'number') return value;
        if (typeof value == 'string') {
            const num = parseFloat(value.replace(/,/g, ''));
            return isNaN(num) ? 0 : num;
        }
        return 0;
    };
    const invoiceTxt = props?.route?.params?.invoiceTxt;
    const cartInvoice = props?.route?.params?.cartInvoice;
    console.log(invoiceTxt, cartInvoice, "invoiceTxtinvoiceTxt");
    const paymentPrice = invoiceTxt?.paymentprice || cartInvoice?.paymentprice || {};
    const isCartFlow = !!cartInvoice || !!paymentPrice?.cartData;

        /**
 * Returns cart transaction fee value.
 * @returns {number}
 */
const getCartTransactionFeeValue = () => {
        if (paymentPrice?.transaction_fee !== undefined) {
            return cleanNumber(paymentPrice.transaction_fee);
        }
        if (paymentPrice?.cartData) {
            if (paymentPrice.cartData.overall_transaction_fee !== undefined) {
                return cleanNumber(paymentPrice.cartData.overall_transaction_fee);
            }
            if (Array.isArray(paymentPrice.cartData.tickets)) {
                return paymentPrice.cartData.tickets.reduce((sum, t) => sum + cleanNumber(t?.transaction_fee), 0);
            }
        }
        if (paymentPrice?.processingFeeAmount !== undefined) {
            return cleanNumber(paymentPrice.processingFeeAmount);
        }
        if (paymentPrice?.processing_fee_amount !== undefined) {
            return cleanNumber(paymentPrice.processing_fee_amount);
        }
        return 0;
    };

        /**
 * Returns register transaction fee value.
 * @returns {number}
 */
const getRegisterTransactionFeeValue = () => {
        if (paymentPrice?.transaction_fee !== undefined) {
            return cleanNumber(paymentPrice.transaction_fee);
        }
        if (invoiceTxt?.ticketShow) {
            if (invoiceTxt.ticketShow.transaction_fee !== undefined) {
                return cleanNumber(invoiceTxt.ticketShow.transaction_fee);
            }
            if (Array.isArray(invoiceTxt.ticketShow.tickets)) {
                const feeSum = invoiceTxt.ticketShow.tickets.reduce((sum, t) => sum + cleanNumber(t?.transaction_fee), 0);
                if (feeSum > 0) return feeSum;
            }
        }
        if (paymentPrice?.inPersonTicket) {
            if (paymentPrice.inPersonTicket.transaction_fee !== undefined) {
                return cleanNumber(paymentPrice.inPersonTicket.transaction_fee);
            }
            if (Array.isArray(paymentPrice.inPersonTicket.tickets)) {
                const feeSum = paymentPrice.inPersonTicket.tickets.reduce((sum, t) => sum + cleanNumber(t?.transaction_fee), 0);
                if (feeSum > 0) return feeSum;
            }
        }
        if (paymentPrice?.processingFeeAmount !== undefined) {
            return cleanNumber(paymentPrice.processingFeeAmount);
        }
        if (paymentPrice?.processing_fee_amount !== undefined) {
            return cleanNumber(paymentPrice.processing_fee_amount);
        }
        return 0;
    };

    const transactionFeeValue = isCartFlow ? getCartTransactionFeeValue() : getRegisterTransactionFeeValue();
    const baseAmount = cleanNumber(
        paymentPrice?.subtotalAmount ??
        paymentPrice?.ticketAmount ??
        invoiceTxt?.ticketShow?.tickets?.[0]?.itemamt ??
        paymentPrice?.cartData?.subtotal_amount ??
        paymentPrice?.cartData?.total_paid_amount ??
        0
    );
    const subtotalAmount = baseAmount;
    const storedTotalAmountWithFee = cleanNumber(
        paymentPrice?.total_amount_with_fee ??
        paymentPrice?.totalTicketPrice ??
        paymentPrice?.cartData?.total_amount_with_fee ??
        (baseAmount + transactionFeeValue)
    );
    const isTransactionFeeApplicable = transactionFeeValue > 0;
    const feeRate = isTransactionFeeApplicable && baseAmount > 0
        ? cleanNumber((transactionFeeValue / baseAmount).toFixed(6))
        : 0.035;

    const walletBalance = cleanNumber(WebcastReducer?.walletCheckResponse?.balance || 0);
    const isWalletOptionAvailable = walletBalance > 0;
    const options = isWalletOptionAvailable
        ? [
            { id: 2, label: 'Wallet Balance' },
            { id: 1, label: 'Credit Card' },
          ]
        : [
            { id: 1, label: 'Credit Card' },
            { id: 2, label: 'Wallet Balance' },
          ];
    const isOnlyCardOption = walletBalance == 0;
    const walletAppliedAmount = isWalletOptionAvailable
        ? cleanNumber(Math.min(walletBalance, baseAmount).toFixed(2))
        : 0;
    const cardPayableAmount = cleanNumber(Math.max(baseAmount - walletAppliedAmount, 0).toFixed(2));

    let processingFeeAmount = 0;
    if (isTransactionFeeApplicable) {
        if (isWalletOptionAvailable && selectedOption == 2) {
            if (cardPayableAmount <= 0) {
                processingFeeAmount = 0;
            } else {
                processingFeeAmount = cleanNumber((cardPayableAmount * feeRate).toFixed(2));
            }
        } else {
            processingFeeAmount = transactionFeeValue;
        }
    }

    const finalAmnt = cleanNumber(
        (!isWalletOptionAvailable || selectedOption != 2)
            ? storedTotalAmountWithFee
            : (cardPayableAmount + processingFeeAmount).toFixed(2)
    );
    const summaryTotalAmount = (
        isWalletOptionAvailable &&
        selectedOption == 2 &&
        cardPayableAmount <= 0
    )
        ? subtotalAmount
        : finalAmnt;
    const totalPaidAmount = finalAmnt;
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
                        title="Payment"
                        onBackPress={paymentPress}
                    />
                ) : (
                    <View>
                        <PageHeader
                            title="Payment"
                            onBackPress={paymentPress}
                        />
                    </View>
                )}
                <Loader
                    visible={printgo == "pdf" || printgo == "go" || printgo == "no" || WebcastReducer?.status == 'WebCast/webcastPaymentRequest' || WebcastReducer?.status == 'WebCast/cartPaymentRequest'} />
                <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ paddingBottom: normalize(80) }}>
                    {Number(isWalletOptionAvailable) && Number(walletBalance) >= Number(baseAmount) ? (
                        // Scenario 1: Wallet balance is enough to cover the full ticket price
                        <View>
                            <View
                                style={{
                                    paddingVertical: normalize(5),
                                    paddingHorizontal: normalize(10),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <CustomPaymentradio
                                    walletmo={walletBalance}
                                    selectedOption={selectedOption}
                                    setSelectedOption={setSelectedOption}
                                    stylechange={remind}
                                    options={options}
                                    onSelect={handleSelect}
                                />
                                {selectedOption == 2 && <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 14,
                                        color: Colorpath.black,
                                        textAlign: 'center',
                                    }}
                                >
                                    {`You can use US$${formatNumberWithCommas(cutomPrice(walletAppliedAmount))} from your wallet.`}
                                </Text>}
                            </View>
                            {selectedOption == 1 && <View>
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
                            </View>}
                        </View>
                    ) : Number(isWalletOptionAvailable) && Number(walletBalance) < Number(baseAmount) ? (
                        // Scenario 2: Wallet balance is not enough, but still show wallet option with card option
                        <>
                            <View
                                style={{
                                    alignSelf: 'center',
                                    marginTop: '5%',
                                    padding: normalize(8),
                                }}
                            >
                                <CustomPaymentradio
                                    walletmo={walletBalance}
                                    selectedOption={selectedOption}
                                    setSelectedOption={setSelectedOption}
                                    stylechange={remind}
                                    options={options}
                                    onSelect={handleSelect}
                                />
                                <View style={{ paddingVertical: normalize(5) }}>
                                    {selectedOption == 2 && <Text
                                        style={{
                                            fontFamily: Fonts.InterMedium,
                                            fontSize: 14,
                                            color: Colorpath.black,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {`You can use US$${formatNumberWithCommas(cutomPrice(walletAppliedAmount))} from your wallet and pay the balance amount of US$${formatNumberWithCommas(cutomPrice(finalAmnt))} using your credit card.`}
                                    </Text>}
                                </View>
                            </View>
                            <View>
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
                            </View>
                        </>
                    ) : Number(walletBalance) == 0 ? (
                        <>
                            <View style={{ marginLeft: normalize(17), paddingVertical: normalize(10) }}>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#666666" }}>{"Please enter your credit/debit card information"}</Text>
                            </View>
                            <View>
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
                            </View>
                        </>

                    ) : (
                        <>

                        </>
                    )}


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
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <View style={{ marginTop: normalize(10), height: 0.8, width: '89%', backgroundColor: "#DADADA" }} />
                        <View style={{
                            width: '89%',
                            paddingTop: normalize(12),
                            paddingBottom: normalize(6),
                        }}>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingBottom: normalize(6),
                            }}>
                                <Text style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 13,
                                    color: "#666666",
                                }}>
                                    {"Price"}
                                </Text>
                                <Text style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 13,
                                    color: "#666666",
                                }}>
                                    {"Amount"}
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingVertical: normalize(4),
                            }}>
                                <Text style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: Colorpath.black,
                                }}>
                                    {"Price"}
                                </Text>
                                <Text style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: Colorpath.black,
                                }}>
                                    {`US$${formatNumberWithCommas(cutomPrice(subtotalAmount))}`}
                                </Text>
                            </View>
                            {processingFeeAmount > 0 ? (
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingVertical: normalize(4),
                                }}>
                                    <Text style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 14,
                                        color: Colorpath.black,
                                    }}>
                                        {"Transaction Fee : 3.5%"}
                                    </Text>
                                    <Text style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 14,
                                        color: Colorpath.black,
                                    }}>
                                        {`US$${formatNumberWithCommas(cutomPrice(processingFeeAmount))}`}
                                    </Text>
                                </View>
                            ) : null}
                            <View style={{ marginVertical: normalize(6), height: 0.8, width: '100%', backgroundColor: "#DADADA" }} />
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingVertical: normalize(4),
                            }}>
                                <Text style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 16,
                                    color: Colorpath.black
                                }}>
                                    {"Total Amount"}
                                </Text>
                                <Text style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 18,
                                    color: Colorpath.black,
                                }}>
                                    {`US$${formatNumberWithCommas(cutomPrice(summaryTotalAmount))}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Buttons
                            onPress={() => {
                                if (isWalletOptionAvailable && selectedOption == 2 && Number(walletBalance) >= Number(totalPaidAmount)) {
                                    // Scenario 1: Wallet balance is enough to cover the full ticket price
                                    walletpayemnthand();
                                } else if (isWalletOptionAvailable && selectedOption == 2 && Number(walletBalance) < Number(totalPaidAmount)) {
                                    // Scenario 2: Wallet balance + Card payment
                                    paymentwalletHandle(); // Handle partial payment using wallet and card
                                } else if (isOnlyCardOption || selectedOption !== 2) {
                                    // Scenario 3: Card payment only
                                    paymentHandle();
                                }
                            }}
                            height={normalize(45)}
                            width={normalize(300)}
                            backgroundColor={
                                // Disable button if wallet balance is insufficient and wallet is selected
                                (selectedOption == 2 && isOnlyCardOption) ? "#DADADA" : Colorpath.ButtonColr
                            }
                            borderRadius={normalize(9)}
                            text="Submit"
                            color={Colorpath.white}
                            fontSize={18}
                            fontFamily={Fonts.InterSemiBold}
                            disabled={
                                // Disable button when wallet is selected, but balance is 0 or insufficient
                                selectedOption == 2 && isOnlyCardOption
                            }
                        />
                    </View>
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>

                    </View>
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
                                // backgroundColor:"red"
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
                    <PayModal
                        isVisible={paymentcard}
                        setPaymentcard={setPaymentcard}
                        content={"Your payment has been \n successfully completed."}
                        navigation={props.navigation}
                        name={"TabNav"}
                        dataPayemnt={WebcastReducer?.PaymentCheckResponse}
                        maindata={props?.route?.params?.invoiceTxt ? props?.route?.params?.invoiceTxt?.webcastTake : props?.route?.params?.cartInvoice?.webcastTake}
                        cartData={props?.route?.params?.cartInvoice?.cartInvoice ? "hit" : null}
                        setPrintgo={setPrintgo}
                        printgo={printgo}
                    />
                    <PayModalFd
                        isVisible={paymentfd}
                        setPaymentfd={setPaymentfd}
                        content={"Your payment has been \n successfully completed"}
                        navigation={props.navigation}
                        name={"TabNav"} />
                </ScrollView>
            </SafeAreaView>}
        </>
    )
}

/**
 * Payment default export.
 *
 * @returns {*}
 */
export default Payment
