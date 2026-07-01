/**
 * In person statewebcast screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status1, InPersonStatewebcast, cutomPrice, inPersonSaveTicket, handleIncrement, handleDecrement, formatNumberWithCommas, cleanTicketName, stateDataFilter, backPressIn, onBackPress, styles.
 */

import { View, Platform, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, Alert, BackHandler } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import Buttons from '../../Components/Button'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Modal from 'react-native-modal';
import IconDot from 'react-native-vector-icons/Entypo';
import Imagepath from '../../Themes/Imagepath'
import showErrorAlert from '../../Utils/Helpers/Toast'
import { saveTicketInpersonRequest } from '../../Redux/Reducers/WebcastReducer'
import { useDispatch, useSelector } from 'react-redux'
import connectionrequest from '../../Utils/Helpers/NetInfo'
import Loader from '../../Utils/Helpers/Loader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native';

/**
 * Reusable InPersonStatewebcast component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

let status1 = "";
/**
 * In person statewebcast component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const InPersonStatewebcast = (props) => {
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
    console.log(props?.route?.params?.realData?.ticketall, "props===============");
    const dispatch = useDispatch();
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    console.log(WebcastReducer, "WebcastReducer")
    const isFocused = useIsFocused();
    const [isfilterVisible, setIssfilterVisible] = useState(false);
    const [finalamount, setFinalamount] = useState("");
    const [inpersonticket, setInpersonticket] = useState(null)
    const [modalHeight, setModalHeight] = useState(300);
    const subtotalAmount = parseFloat(finalamount || "0") || 0;
    const listBottomPadding = normalize(150);
    useEffect(() => {
        if (isFocused && props?.route?.params?.realData?.realData) {
            setIssfilterVisible(true);
        }
    }, [isFocused, props?.route?.params?.realData?.realData])
    useEffect(() => {
        const registrationTickets = props?.route?.params?.realData?.ticketall || [];
        const baseHeight = 400;
        const heightPerTicket = 300;
        const calculatedHeight = registrationTickets.length > 0
            ? baseHeight + (registrationTickets.length - 1) * heightPerTicket
            : baseHeight;

        setModalHeight(calculatedHeight);
    }, [props?.route?.params?.realData?.registrationTickets, isfilterVisible]);

    const { ticketall } = props?.route?.params?.realData || { ticketall: [] };
    const isFreeSingleTicketFlow =
        props?.route?.params?.realData?.freeSingleTicket === true ||
        (Array.isArray(ticketall) &&
            ticketall.length > 0 &&
            ticketall.every(ticket => Number(ticket?.itemamt || 0) === 0));
    console.log(ticketall, "ticketall-----------")
        /**
 * In person save ticket utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const inPersonSaveTicket = async () => {
        if (clickHistory?.length > 0) {
            console.log("Hello", clickHistory)
            const checkoutSpan = props?.route?.params?.realData?.realData?.conferenceId;
            let obj = {
                "conference_id": checkoutSpan,
                "tickets": props?.route?.params?.realData?.ticketall
                    ?.map((ticket, index) => ({
                        "id": ticket?.ticket_id,
                        "quantity": clickHistory ? clickHistory[index]?.length : clickHistory[index]?.length
                    }))
                    ?.filter(ticket => ticket.quantity >= 1) // Ensure tickets with quantity >= 1 are added
            };

            // Include refer_params if RefID was captured from a deep link
            try {
                const storedRefID = await AsyncStorage.getItem('REFID');
                if (storedRefID) {
                    obj["refer_params"] = storedRefID;
                }
            } catch (e) {
                console.log('[inPersonSaveTicket] Error reading RefID:', e);
            }

            connectionrequest()
                .then(() => {
                    dispatch(saveTicketInpersonRequest(obj));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err);
                });
        }
    };

    const [clickHistory, setClickHistory] = useState(() =>
        (ticketall || []).map((ticket, index) => (
            isFreeSingleTicketFlow && index === 0 ? [1] : []
        ))
    );
    const [totalAmounts, setTotalAmounts] = useState(() =>
        (ticketall || []).map((ticket, index) => (
            isFreeSingleTicketFlow && index === 0
                ? Number(ticket?.amount || ticket?.itemamt || 0)
                : []
        ))
    );
    const [totalQuantity, setTotalQuantity] = useState(0); // New state for total quantity
    useEffect(() => {
        if (!Array.isArray(ticketall)) return;

        if (isFreeSingleTicketFlow) {
            setClickHistory(ticketall.map((ticket, index) => (index === 0 ? [1] : [])));
            setTotalAmounts(
                ticketall.map((ticket, index) => (
                    index === 0 ? Number(ticket?.amount || ticket?.itemamt || 0) : []
                ))
            );
            return;
        }

        setClickHistory(Array(ticketall.length).fill([]));
        setTotalAmounts(Array(ticketall.length).fill([]));
    }, [isFreeSingleTicketFlow, ticketall]);
    useEffect(() => {
        const totalPerIndex = clickHistory.map((quantity, index) => quantity);
        const totalLength = totalPerIndex.reduce((acc, curr) => acc + curr.length, 0);
        setTotalQuantity(totalLength);
        console.log(totalLength); // Map each quantity for every index
    }, [clickHistory]);

        /**
 * Handles increment.
 * @param {number} index - Input value.
 * @param {*} item - Input value.
 * @returns {void}
 */
const handleIncrement = (index, item) => {
        console.log(ticketall, "totalQuantity========")
        if (!ticketall[index]) {
            console.log(`No ticket found for index ${index}`);
            return;
        }

        const maxTickets = isFreeSingleTicketFlow ? 1 : 10;
        const currentClickHistory = clickHistory[index];

        if (isFreeSingleTicketFlow) {
            return;
        }

        if (currentClickHistory.length >= maxTickets) {
            console.log(`Cannot exceed the maximum limit of ${maxTickets} clicks for index ${index}.`);
            return;
        }

        setClickHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            newHistory[index] = [...newHistory[index], currentClickHistory.length + 1];
            console.log(`Updated click history for index ${index}:`, newHistory[index]);
            return newHistory;
        });

        // Update total amounts
        setTotalAmounts((prevTotals) => {
            const newTotals = [...prevTotals];
            const newTotal = (item?.amount || 0) * (currentClickHistory.length + 1);
            newTotals[index] = newTotal; // Update total for the current index
            return newTotals;
        });
    };

        /**
 * Handles decrement.
 * @param {number} index - Input value.
 * @param {*} item - Input value.
 * @returns {void}
 */
const handleDecrement = (index, item) => {
        setClickHistory((prevHistory) => {
            const currentClickHistory = prevHistory[index];
            if (currentClickHistory.length === 0) return prevHistory;

            const newHistory = [...prevHistory];
            newHistory[index] = currentClickHistory.slice(0, -1);
            return newHistory;
        });

        // Update total amounts
        setTotalAmounts((prevTotals) => {
            const newTotals = [...prevTotals];
            const currentClickHistory = clickHistory[index];
            if (currentClickHistory.length > 0) {
                const newTotal = (item?.amount || 0) * (currentClickHistory.length - 1);
                newTotals[index] = newTotal; // Update total for the current index
            } else {
                newTotals[index] = 0; // Reset to 0 if no clicks
            }
            return newTotals;
        });
    };

    console.log(totalAmounts, "Total Amounts=====", clickHistory);
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
 * Clean ticket name utility.
 * @param {*} value - Input value.
 * @returns {*}
 */
const cleanTicketName = (value) => {
        if (!value) return "";
        return String(value)
            .replace(/<[^>]*>/g, "")
            .replace(/\s+/g, " ")
            .trim();
    };
        /**
 * State data filter utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const stateDataFilter = ({ item, index }) => {
        const minTickets = 0;
        const maxTickets = isFreeSingleTicketFlow ? 1 : 10;
        const clickCount = clickHistory[index]?.length || 0;
        const disableIncrement = isFreeSingleTicketFlow || clickCount >= maxTickets;
        const disableDecrement = isFreeSingleTicketFlow || clickCount <= minTickets;
        return (
            <>


                <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: normalize(10) }}>
                    <View
                        style={{
                            flexDirection: 'column',
                            width: normalize(290),
                            borderRadius: normalize(10),
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            alignItems: 'flex-start',
                            borderWidth: 0.5,
                            borderColor: '#DDDDDD',
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 18,
                                        color: '#000000',
                                        fontWeight: 'bold',
                                        flex: 1,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {cleanTicketName(item?.ticket_name)}
                                </Text>
                            </View>

                            {item?.key_value ? <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(5), alignSelf: 'flex-start' }}>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: '#333' }}>{item?.key_value}</Text>
                            </View> : null}

                            {/* {item?.enddate ? <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(0), alignSelf: 'flex-start' }}>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: '#333' }}>
                                    {`Last Day: ${item?.enddate}`}
                                </Text>
                            </View>:null} */}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: normalize(10), width: '100%' }}>
                                {+(item?.itemamt) == 0 ? (
                                    <View style={{ flexDirection: 'column' }}>
                                        <View style={{ paddingVertical: normalize(5), paddingHorizontal: normalize(2) }}>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterSemiBold,
                                                    fontSize: 18,
                                                    color: '#000000',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {"Free"}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: 'column' }}>
                                        <View style={{ paddingVertical: normalize(5) }}>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterSemiBold,
                                                    fontSize: 18,
                                                    color: '#000000',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {`US$${formatNumberWithCommas(cutomPrice(item?.itemamt))}`}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    {/* Decrement */}
                                    <TouchableOpacity
                                        onPress={() => handleDecrement(index, item)}
                                        disabled={disableDecrement} // Disable if count is at or below minTickets
                                    >
                                        <Image
                                            source={Imagepath.MinusImg}
                                            style={{
                                                height: normalize(30),
                                                width: normalize(30),
                                                resizeMode: 'contain',
                                                tintColor: !disableDecrement ? '#666666' : '#cccccc', // Disable color logic
                                            }}
                                        />
                                    </TouchableOpacity>

                                    {/* Display Quantity */}
                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: normalize(10) }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 24,
                                                color: '#000000',
                                            }}
                                        >
                                            {clickCount}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => handleIncrement(index, item)}
                                        disabled={disableIncrement}
                                    >
                                        <Image
                                            source={Imagepath.PlusImg}
                                            style={{
                                                height: normalize(30),
                                                width: normalize(30),
                                                resizeMode: 'contain',
                                                tintColor: !disableIncrement ? '#666666' : '#cccccc',
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </>
        );
    };
    useEffect(() => {
        if (totalAmounts) {
            const totalSum = totalAmounts?.reduce((acc, curr) => {
                return acc + (Array.isArray(curr) ? 0 : curr); // Sum only numeric values
            }, 0);
            setFinalamount(totalSum);
        }
    }, [totalAmounts])
    if (status1 == '' || WebcastReducer.status != status1) {
        switch (WebcastReducer.status) {
            case 'WebCast/saveTicketInpersonRequest':
                status1 = WebcastReducer.status;
                break;
            case 'WebCast/saveTicketInpersonSuccess':
                status1 = WebcastReducer.status;
                setInpersonticket(WebcastReducer?.saveTicketInpersonResponse);
                if (WebcastReducer?.saveTicketInpersonResponse?.invoice) {
                    setIssfilterVisible(false);
                    props.navigation.navigate("Checkout", {
                        inPersonTicket: {
                            inPersonTicket: WebcastReducer?.saveTicketInpersonResponse,
                            inpersonSpanrole: props?.route?.params?.realData?.realData,
                            guestOrigin: props?.route?.params?.realData?.guestOrigin,
                            subtotalAmount: subtotalAmount,
                            processingFeeAmount: 0,
                            totalTicketPrice: subtotalAmount
                        }
                    });
                    // props.navigation.navigate("Checkout",  { checkoutSpan: { checkoutSpan: props?.route?.params?.realData, finalTicket: WebcastReducer?.saveTicketInpersonResponse }});
                }
                console.log("saveTicketfollowed>>>>", WebcastReducer?.saveTicketInpersonResponse);
                break;
            case 'WebCast/saveTicketInpersonFailure':
                status1 = WebcastReducer.status;
                break;
        }
    }
        /**
 * Back press in utility.
 * @returns {void}
 */
const backPressIn = () => {
        props.navigation.goBack();
        setIssfilterVisible(false);
    }
    useEffect(() => {
                /**
 * On back press utility.
 * @returns {boolean}
 */
const onBackPress = () => {
            backPressIn();
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
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.white }}>
                <Loader visible={WebcastReducer?.status == 'WebCast/saveTicketInpersonRequest'} />
                <Modal
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    backdropTransitionOutTiming={0}
                    hideModalContentWhileAnimating={true}
                    isVisible={isfilterVisible}
                    style={{ width: '100%', alignSelf: 'center', margin: 0, justifyContent: 'flex-end' }}
                    animationInTiming={800}
                    animationOutTiming={1000}
                    onBackdropPress={() => {
                        props.navigation.goBack();
                        setIssfilterVisible(false);
                    }}
                >
                    <View style={{
                        backgroundColor: Colorpath.white, borderTopRightRadius: normalize(20),
                        borderTopLeftRadius: normalize(20), bottom: 0, height: normalize(470)
                    }}>
                        <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(10) }}>
                            <View style={styles.modalIndicator} />
                        </View>
                        <View>
                            {/* <ScrollView contentContainerStyle={{ paddingBottom: normalize(120) }}> */}
                            <View style={styles.container}>
                                <FlatList
                                    data={props?.route?.params?.realData?.ticketall}
                                    renderItem={stateDataFilter}
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={{ paddingBottom: listBottomPadding }}
                                />
                            </View>
                            {/* </ScrollView> */}
                        </View>
                        <View style={{
                            position: 'absolute',
                            height: normalize(108),
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: Colorpath.white,
                            borderColor: "#DDDDDD",
                            borderWidth: 1,
                            paddingHorizontal: normalize(16),
                            paddingTop: normalize(14),
                            paddingBottom: normalize(16),
                        }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: '#333' }}>
                                        {`${totalQuantity} Tickets Selected`}
                                    </Text>
                                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: '#333' }}>
                                        {`US$${formatNumberWithCommas(cutomPrice(subtotalAmount))}`}
                                    </Text>
                                </View>
                                <View style={{ marginTop: normalize(10), borderBottomColor: "#D7D7D7", borderBottomWidth: 1, borderStyle: "dashed" }} />
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: normalize(10) }}>
                                    <View>
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: '#333' }}>
                                            {"Total"}
                                        </Text>
                                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: '#333' }}>
                                            {`US$${formatNumberWithCommas(cutomPrice(subtotalAmount))}`}
                                        </Text>
                                    </View>
                                    <Buttons
                                        onPress={() => {
                                            setIssfilterVisible(false);
                                            inPersonSaveTicket();
                                        }}
                                        height={normalize(48)}
                                        width={normalize(150)}
                                        backgroundColor={clickHistory?.some(arr => arr.length > 0) ? Colorpath.ButtonColr : "#DADADA"}
                                        borderRadius={normalize(5)}
                                        text="Checkout"
                                        color={Colorpath.white}
                                        fontSize={16}
                                        fontFamily={Fonts.InterSemiBold}
                                        disabled={clickHistory?.some(arr => arr.length > 0) ? false : true}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
    )
}

/**
 * In person statewebcast default export.
 *
 * @returns {*}
 */
export default InPersonStatewebcast

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    container: {
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(10),
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "space-between",
    },
    buttonContainer: {
        flexDirection: "row",
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(5),
    },
    modalView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopRightRadius: normalize(20),
        borderTopLeftRadius: normalize(20),
        paddingVertical: normalize(10),
    },
    modalIndicator: {
        height: 5,
        width: normalize(100),
        backgroundColor: "#DDDDDD",
        borderRadius: normalize(10),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(5),
    },
    image: {
        height: normalize(20),
        width: normalize(20),
        resizeMode: 'contain',
    },
    title: {
        fontFamily: Fonts.InterMedium,
        fontSize: 18,
        color: Colorpath.ButtonColr,
        marginLeft: normalize(5),
    },
    description: {
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        color: "#000000",
        lineHeight: 20,
    }
});
