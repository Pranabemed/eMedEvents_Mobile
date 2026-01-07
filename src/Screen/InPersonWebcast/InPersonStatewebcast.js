import { View, Platform, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, Alert, BackHandler } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
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

let status1 = "";
const InPersonStatewebcast = (props) => {
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
    const [isfilterVisible, setIssfilterVisible] = useState(false);
    const [finalamount, setFinalamount] = useState("");
    const [inpersonticket, setInpersonticket] = useState(null)
    const [modalHeight, setModalHeight] = useState(300);
    useEffect(() => {
        if (props?.route?.params?.realData?.realData) {
            setIssfilterVisible(true);
        }
    }, [props?.route?.params?.realData?.realData])
    useEffect(() => {
        const registrationTickets = props?.route?.params?.realData?.ticketall || [];
        const baseHeight = 400; 
        const heightPerTicket = 300; 
        const calculatedHeight = registrationTickets.length > 0 
            ? baseHeight + (registrationTickets.length - 1) * heightPerTicket 
            : baseHeight;
    
        setModalHeight(calculatedHeight);
    }, [props?.route?.params?.realData?.registrationTickets,isfilterVisible]);
    
    const { ticketall } = props?.route?.params?.realData || { ticketall: [] };
    console.log(ticketall,"ticketall-----------")
    const inPersonSaveTicket = () => {
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

            connectionrequest()
                .then(() => {
                    dispatch(saveTicketInpersonRequest(obj));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err);
                });
        }
    };

    const [clickHistory, setClickHistory] = useState(Array(ticketall?.length).fill([]));
    const [totalAmounts, setTotalAmounts] = useState(Array(ticketall?.length).fill([]));
    const [totalQuantity, setTotalQuantity] = useState(0); // New state for total quantity
    useEffect(() => {
        const totalPerIndex = clickHistory.map((quantity, index) => quantity);
        const totalLength = totalPerIndex.reduce((acc, curr) => acc + curr.length, 0);
        setTotalQuantity(totalLength);
        console.log(totalLength); // Map each quantity for every index
    }, [clickHistory]);

    const handleIncrement = (index, item) => {
        console.log(ticketall, "totalQuantity========")
        if (!ticketall[index]) {
            console.log(`No ticket found for index ${index}`);
            return;
        }

        const maxTickets = 10;
        const currentClickHistory = clickHistory[index];

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
const formatNumberWithCommas = (value) => {
  if (value == null || value == undefined) return '';
  const stringValue = value.toString().replace(/,/g, '');
  const parts = stringValue.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};
    const stateDataFilter = ({ item, index }) => {
        const minTickets =  0;
        const maxTickets = 10;
        const clickCount = clickHistory[index]?.length || 0;
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
                        <View style={{ flex: 1}}>
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
                                    {item?.ticket_name}
                                </Text>
                            </View>

                            {item?.key_value ?<View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(5), alignSelf: 'flex-start' }}>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: '#333' }}>{item?.key_value}</Text>
                            </View>:null}

                            {/* {item?.enddate ? <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(0), alignSelf: 'flex-start' }}>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: '#333' }}>
                                    {`Last Day: ${item?.enddate}`}
                                </Text>
                            </View>:null} */}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: normalize(10), width: '100%' }}>
                                {+(item?.itemamt) == 0 ? (
                                    <View style={{ flexDirection: 'column' }}>
                                        <View style={{ paddingVertical: normalize(5),paddingHorizontal:normalize(2) }}>
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
                                        disabled={clickCount <= minTickets} // Disable if count is at or below minTickets
                                    >
                                        <Image
                                            source={Imagepath.MinusImg}
                                            style={{
                                                height: normalize(30),
                                                width: normalize(30),
                                                resizeMode: 'contain',
                                                tintColor: clickCount > minTickets ? '#666666' : '#cccccc', // Disable color logic
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
                                        disabled={clickCount >= maxTickets} 
                                    >
                                        <Image
                                            source={Imagepath.PlusImg}
                                            style={{
                                                height: normalize(30),
                                                width: normalize(30),
                                                resizeMode: 'contain',
                                                tintColor: clickCount < maxTickets ? '#666666' : '#cccccc', 
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
                    props.navigation.navigate("Checkout", { inPersonTicket: { inPersonTicket: WebcastReducer?.saveTicketInpersonResponse, inpersonSpanrole: props?.route?.params?.realData?.realData, totalTicketPrice: finalamount } });
                    // props.navigation.navigate("Checkout",  { checkoutSpan: { checkoutSpan: props?.route?.params?.realData, finalTicket: WebcastReducer?.saveTicketInpersonResponse }});
                }
                console.log("saveTicketfollowed>>>>", WebcastReducer?.saveTicketInpersonResponse);
                break;
            case 'WebCast/saveTicketInpersonFailure':
                status1 = WebcastReducer.status;
                break;
        }
    }
    const backPressIn=()=>{
        props.navigation.navigate("Statewebcast");
        setIssfilterVisible(false);
    }
    useEffect(() => {
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
                    style={{ width: '100%', alignSelf: 'center', margin: 0 }}
                    animationInTiming={800}
                    animationOutTiming={1000}
                    onBackdropPress={() => { 
                        props.navigation.navigate("Statewebcast");
                        setIssfilterVisible(false);
                     }}
                >
                    <View style={{backgroundColor: Colorpath.white, borderTopRightRadius: normalize(20),
                borderTopLeftRadius: normalize(20),bottom:0,height:normalize(470)}}>
                        <View style={{ justifyContent: "center", alignItems: "center",marginTop:normalize(10)}}>
                            <View style={styles.modalIndicator} />
                        </View>
                        <View>
                            {/* <ScrollView contentContainerStyle={{ paddingBottom: normalize(120) }}> */}
                                <View style={styles.container}>
                                    <FlatList
                                        data={props?.route?.params?.realData?.ticketall}
                                        renderItem={stateDataFilter}
                                        keyExtractor={(item, index) => index.toString()}
                                        contentContainerStyle={{paddingBottom:normalize(120)}}
                                    />
                                </View>
                            {/* </ScrollView> */}
                        </View>
                        <View style={{
                            position: 'absolute',
                            height: normalize(100),
                            bottom:0,
                            left: 0,
                            right: 0,
                            backgroundColor: Colorpath.white,
                            borderColor: "#DDDDDD",
                            borderWidth: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom:Platform.OS === 'ios'? normalize(-60):normalize(-90),
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignContent: "space-around",
                            gap:normalize(50)
                        }}>
                            <View style={{ flexDirection: "column", marginLeft: normalize(5) }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 14,
                                        color: '#333',
                                        // width:normalize(299)
                                    }}>
                                    {`${totalQuantity} Tickets Selected`}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterBold,
                                        fontSize: 18,
                                        color: '#333',
                                        // width:normalize(299)
                                    }}>
                                    {`US$${formatNumberWithCommas(cutomPrice(finalamount))}`}
                                </Text>
                            </View>
                            <Buttons
                                onPress={() => {
                                    setIssfilterVisible(false);
                                    inPersonSaveTicket();
                                }}
                                height={normalize(45)}
                                width={normalize(140)}
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
                </Modal>
            </SafeAreaView>
        </>
    )
}

export default InPersonStatewebcast

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