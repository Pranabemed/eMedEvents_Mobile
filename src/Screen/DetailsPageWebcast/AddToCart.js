import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Fonts from '../../Themes/Fonts';
import DeletIcon from 'react-native-vector-icons/AntDesign';
import Buttons from '../../Components/Button';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { cancelcouponRequest, cartCheckoutRequest, cartcountWebcastRequest, cartdeleteWebcastRequest, cartdetailsWebcastRequest, couponWebcastRequest, FreeCartRequest } from '../../Redux/Reducers/WebcastReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import CartPay from '../../Components/CartPay';
import CartFd from '../../Components/CartFd';
import { AppContext } from '../GlobalSupport/AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context'

let status = "";
const AddToCart = (props) => {
    const {
        cartcount,
        setCartcount,
        isConnected
    } = useContext(AppContext);
    console.log("props.route", props?.route?.params?.addtocart?.addtocart == "startcallapi", props?.route?.params);
    console.log(props?.route?.params, "cupon======");
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const dispatch = useDispatch();
    const [couponapp, setCouponapp] = useState("");
    const [cartdetails, setCartdetails] = useState(null);
    const [addtocartview, setAddtocartview] = useState(null);
    const [paginatedDatacart, setPaginatedDatacart] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [codeText, setCodeText] = useState("");
    const [cart, setCart] = useState("");
    const [paymentcardfreecart, setPaymentcardfreecart] = useState(false);
    const [paymentfdfreecart, setPaymentfdfreecart] = useState(false);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const toggleModalPaymentfreecart = (ddf) => {
        setPaymentcardfreecart(ddf);
    };
    const toggleModalFailedfreecart = (tikg) => {
        setPaymentfdfreecart(tikg);
    };
    const cartPress = () => {
        props.navigation.navigate("Statewebcast", { newCast: props?.route?.params?.addtocart?.urlneedTake });
    }
    useEffect(() => {
        if (props?.route?.params?.addtocart?.addtocart == "startcallapi") {
            let obj = {};
            connectionrequest()
                .then(() => {
                    dispatch(cartcountWebcastRequest(obj))
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }, [props?.route?.params?.addtocart?.addtocart])
    useEffect(() => {
        if (props?.route?.params?.addtocart?.addtocart == "startcallapi") {
            let obj = {};
            connectionrequest()
                .then(() => {
                    dispatch(cartdetailsWebcastRequest(obj))
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }, [props?.route?.params?.addtocart])
    const applyCoupon = () => {
        if (!couponapp) {
            showErrorAlert("Please enter a valid coupon ")
        } else {
            let obj = {
                "invoice": props?.route?.params?.addtocart?.coupon?.invoice,
                "couponcode": couponapp
            }
            let objrm = {
                "invoice": props?.route?.params?.addtocart?.coupon?.invoice,
            }
            connectionrequest()
                .then(() => {
                    if (couponapp) {
                        dispatch(couponWebcastRequest(obj))
                    } else {
                        dispatch(cancelcouponRequest(objrm))
                    }
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }
    const cartPayId = cart?.cartData?.tickets || [];
    const CheckCart = () => {
        let objcart = {
            "payment_id": cartPayId?.length > 0 && cartPayId?.map(item => item?.payment_id),
        }
        connectionrequest()
            .then(() => {
                dispatch(cartCheckoutRequest(objcart))
            })
            .catch((err) => {
                showErrorAlert(err, "Please connect to internet");
            })
    }
    const cartFreeTake = (invcz) => {
        const objinvc = {
            "invoice": invcz
        }
        connectionrequest()
            .then(() => {
                dispatch(FreeCartRequest(objinvc))
            })
            .catch((err) => {
                showErrorAlert(err, "Please connect to internet");
            })
    }

    if (status == '' || WebcastReducer.status != status) {
        switch (WebcastReducer.status) {
            case 'WebCast/cartdetailsWebcastRequest':
                status = WebcastReducer.status;
                setLoading(true);
                break;
            case 'WebCast/cartdetailsWebcastSuccess':
                status = WebcastReducer.status;
                setLoading(false);
                console.log("cartdetails followed>>>>", WebcastReducer?.cartdetailsWebcastResponse);
                setCart(WebcastReducer?.cartdetailsWebcastResponse);
                const seen = new Set();
                const uniqueWebcastReducer = WebcastReducer?.cartdetailsWebcastResponse?.cartData?.tickets && WebcastReducer?.cartdetailsWebcastResponse?.cartData?.tickets.filter(item => {
                    if (seen.has(item.payment_ticket_id)) {
                        return false;
                    }
                    seen.add(item.payment_ticket_id);
                    return true;
                });

                setCartdetails(uniqueWebcastReducer);
                break;
            case 'WebCast/cartdetailsWebcastFailure':
                status = WebcastReducer.status;
                setLoading(false);
                break;
            case 'WebCast/cartdeleteWebcastRequest':
                status = WebcastReducer.status;
                break;
            case 'WebCast/cartdeleteWebcastSuccess':
                status = WebcastReducer.status;
                if (WebcastReducer?.cartdeleteWebcastResponse?.msg == "Item deleted in cart successfully.") {
                    showErrorAlert("Item deleted from cart successfully.");
                    dispatch(cartdetailsWebcastRequest({}));
                    dispatch(cartcountWebcastRequest({}));
                }
                break;
            case 'WebCast/cartdeleteWebcastFailure':
                status = WebcastReducer.status;
                break;
            case 'WebCast/couponWebcastRequest':
                status = WebcastReducer.status;
                break;
            case 'WebCast/couponWebcastSuccess':
                status = WebcastReducer.status;
                if (WebcastReducer?.couponWebcastResponse?.discount_value) {
                    setCodeText(WebcastReducer?.couponWebcastResponse);
                }
                console.log(WebcastReducer?.couponWebcastResponse, "Item deleted from cart successfully.")
                break;
            case 'WebCast/couponWebcastFailure':
                status = WebcastReducer.status;
                setCodeText("Please check the code");
                break;
            case 'WebCast/cartCheckoutRequest':
                status = WebcastReducer.status;
                break;
            case 'WebCast/cartCheckoutSuccess':
                status = WebcastReducer.status;
                if (WebcastReducer?.cartCheckoutResponse?.invoiceNumber) {
                    cartFreeTake(WebcastReducer?.cartCheckoutResponse?.invoiceNumber);
                }
                break;
            case 'WebCast/cartCheckoutFailure':
                status = WebcastReducer.status;
                break;
            case 'WebCast/FreeCartRequest':
                status = WebcastReducer.status;
                break;
            case 'WebCast/FreeCartSuccess':
                status = WebcastReducer.status;
                if (WebcastReducer?.FreeCartResponse?.payment_status == 'already paid') {
                    toggleModalFailedfreecart(true);
                } else if (WebcastReducer?.FreeCartResponse?.payment_status == "failed") {
                    toggleModalFailedfreecart(true);
                } else if (WebcastReducer?.FreeCartResponse?.payment_status == 'success') {
                    toggleModalPaymentfreecart(true);
                }
                console.log("payment12222=====", WebcastReducer?.FreeCartResponse)
                break;
            case 'WebCast/FreeCartFailure':
                status = WebcastReducer.status;
                break;
        }
    }
    const takeCountde = useMemo(() => (
        WebcastReducer?.cartcountWebcastResponse?.cartItemsCount || 0
    ), [WebcastReducer?.cartcountWebcastResponse?.cartItemsCount]);
    useEffect(() => {
        setCartcount(takeCountde);
    }, [takeCountde]);
    console.log(cart, "card>>>>>======>>>>>>>123", cartdetails, WebcastReducer?.couponWebcastResponse?.code == "Successfully applied.")
    useEffect(() => {
        if (cartdetails) {
            const fullData = cartdetails;
            setAddtocartview(fullData);
            const dataToShow = fullData;
            setPaginatedDatacart(dataToShow);
            setLoading(false);
        }
    }, [cartdetails]);

    const loadMoreData = () => {
        if (loadingMore) return;
        if (addtocartview?.length && paginatedDatacart?.length < addtocartview.length) {
            setLoadingMore(true);
            const nextPage = page + 1;
            const itemsPerPage = 0;
            const newData = addtocartview.slice(0, nextPage * itemsPerPage);
            setPaginatedDatacart(newData);
            setPage(nextPage);
            setLoadingMore(false);
        }
    };
    const renderFooter = () => {
        return loadingMore ? (
            <View style={{ paddingVertical: normalize(20) }}>
                <ActivityIndicator size="small" color={Colorpath.ButtonColr} />
            </View>
        ) : null;
    };
    const [showLoader, setShowLoader] = useState(true);
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(false);
        }, 4000);

        return () => clearTimeout(timeout);
    }, []);
    const handleDeletecart = (dataid) => {
        console.log('Data ID to delete:', dataid, 'Type:', typeof dataid);
        console.log('Current Data Full:', cartdetails);
        if (!Array.isArray(cartdetails) || cartdetails?.length === 0) {
            console.error('cartdetails is not an array or is empty:', cartdetails);
            return;
        }
        const normalizedDataId = String(dataid).trim();
        const index = cartdetails.findIndex(item => String(item?.payment_id).trim() === normalizedDataId);
        console.log('Index of item to delete:', index);
        if (index !== -1) {
            const updatedData = [...cartdetails.slice(0, index), ...cartdetails.slice(index + 1)];
            console.log('Updated Data After Removal:', updatedData);
            const wrappedData = updatedData;
            console.log('Wrapped Data:', wrappedData);
            setPaginatedDatacart(wrappedData.slice(0, 3))
            setCartdetails(wrappedData);
        } else {
            console.log('Item not found');
        }
    };
    const exploreCart = ({ item, index }) => {
        console.log(item, index, "ietmexpolor---------")
        return (
            <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: Colorpath.Pagebg }}>
                <View style={{
                    flexDirection: "column",
                    width: normalize(300),
                    paddingHorizontal: normalize(10),
                    paddingVertical: normalize(5),
                    alignItems: "flex-start"
                }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                        <Text numberOfLines={2}
                            style={{
                                fontFamily: Fonts.InterSemiBold,
                                fontSize: 16,
                                color: "#000",
                                fontWeight: "bold",
                                flexShrink: 1,
                                flexWrap: 'wrap',
                            }}>
                            {item?.conference_name}
                        </Text>
                    </View>
                    <View style={{ paddingVertical: normalize(5), alignSelf: 'flex-start', marginTop: normalize(3) }}>
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#666666" }}>
                            {`${+(item?.credits[0]?.points)} ${item?.credits[0]?.name}`}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%', paddingVertical: normalize(5) }}>
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: Colorpath.ButtonColr, fontWeight: "bold" }}>
                            {`${item?.ticket_qty} X US$${item?.paid_amount}`}
                        </Text>
                        <TouchableOpacity onPress={() => {
                            Alert.alert('eMedEvents', 'Are you sure you want to delete this item from your cart?', [{ text: "No", onPress: () => { console.log("hello") }, style: "cancel" }, {
                                text: "Yes", onPress: () => {
                                    handleDeletecart(item?.payment_id);
                                    let obj = {
                                        "paymentId": item?.payment_id
                                    }
                                    dispatch(cartdeleteWebcastRequest(obj));
                                }, style: "default"
                            }])
                        }}>
                            <DeletIcon name="delete" size={20} color={Colorpath.black} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: normalize(10), height: 1, width: '100%', backgroundColor: "#DDD" }} />
                </View>
            </View>
        )
    }
    const hasFreeTicket = cart && cart?.cartData?.tickets?.length > 0 && cart?.cartData?.tickets.some((ticket) => ticket.paid_amount == "0");
    const allTicketsFree = cart && cart?.cartData?.tickets?.length > 0 && cart?.cartData?.tickets.every((ticket) => ticket.paid_amount == "0");
    const isFree = allTicketsFree || (cart?.cartData?.tickets?.length == 1 && hasFreeTicket);
    const grossValue = WebcastReducer?.couponWebcastResponse?.gross_value ?? 0;
    const totalPaid = WebcastReducer?.cartdetailsWebcastResponse?.cartData?.total_paid_amount ?? 0;
    const totalValue = WebcastReducer?.couponWebcastResponse?.total_value ?? 0;
    useLayoutEffect(() => {
            props.navigation.setOptions({ gestureEnabled: false });
        }, []);
    return (
        <>
            <MyStatusBar
                barStyle={"light-content"}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn == false ? <IntOff /> : <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.white }}>
                {Platform.OS === "ios" ? (
                    <PageHeader
                        title="Cart"
                        onBackPress={cartPress}
                    />
                ) : (
                    <View>
                        <PageHeader
                            title="Cart"
                            onBackPress={cartPress}
                        />
                    </View>
                )}
                <Loader
                    visible={WebcastReducer?.status == 'WebCast/couponWebcastRequest' || WebcastReducer?.status == 'WebCast/cartCheckoutRequest' || WebcastReducer?.status == 'WebCast/FreeCartRequest'} />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "height" : undefined}>
                    <ScrollView contentContainerStyle={{ paddingBottom: normalize(120) }}>
                        <View>
                            {loading && !showLoader ? (
                                <ActivityIndicator size="large" color="#0000ff" />
                            ) : (<FlatList
                                data={paginatedDatacart}
                                renderItem={exploreCart}
                                keyExtractor={item => item.id}
                                ListFooterComponent={renderFooter}
                                onEndReached={loadMoreData}
                                onEndReachedThreshold={0.5}
                                ListEmptyComponent={
                                    <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(5) }}>
                                        {showLoader ? <ActivityIndicator size={"small"} color={"green"} /> : <View
                                            style={{
                                                flexDirection: "row",
                                                // height: normalize(83),
                                                width: normalize(290),
                                                borderRadius: normalize(10),
                                                backgroundColor: Colorpath.Pagebg,
                                                paddingHorizontal: normalize(10),
                                                paddingVertical: normalize(10),
                                                alignItems: "center",
                                            }}
                                        >
                                            <View style={{ flex: 1, justifyContent: "center" }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterSemiBold,
                                                        fontSize: 16,
                                                        color: "#000000",
                                                        fontWeight: "bold",
                                                        alignSelf: "center"
                                                    }}
                                                >
                                                    {"There are no records located."}
                                                </Text>
                                            </View>
                                        </View>}

                                    </View>
                                }
                            />)}

                        </View>
                        {(props?.route?.params?.addtocart?.coupon?.discounts == true && props?.route?.params?.addtocart?.cart !== "remove") ? (
                            <View style={{ flexDirection: "column", paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#666666" }}>{"Apply Coupon"}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: "#666", borderRadius: normalize(10), width: normalize(250), height: normalize(45) }}>
                                    <TextInput
                                        maxLength={10}
                                        value={couponapp}
                                        placeholder='Enter Coupon'
                                        placeholderTextColor={"#666"}
                                        onChangeText={(val) => { setCouponapp(val) }}
                                        keyboardType="visible-password"
                                        style={{ height: normalize(55), width: normalize(180), paddingLeft: normalize(10) }}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (WebcastReducer?.couponWebcastResponse?.code == "Successfully applied.") {
                                                setCouponapp("");
                                                applyCoupon();
                                            } else {
                                                applyCoupon();
                                            }
                                        }}
                                        style={{ height: normalize(45), width: normalize(120), justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', borderTopRightRadius: normalize(10), borderBottomRightRadius: normalize(10) }}
                                    >
                                        {WebcastReducer?.couponWebcastResponse?.code === "Successfully applied." ? (
                                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: '#FFFFFF' }}>
                                                {"Apply"}
                                            </Text>
                                        ) : (
                                            couponapp ? (
                                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: '#FFFFFF' }}>
                                                    {"Apply"}
                                                </Text>
                                            ) : (
                                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: '#FFFFFF' }}>
                                                    {"Cancel"}
                                                </Text>
                                            )
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null}

                        {couponapp ? (
                            <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                <Text style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: WebcastReducer?.couponWebcastResponse?.code === "Successfully applied." ? '#009E38' : "red"
                                }}>
                                    {WebcastReducer?.couponWebcastResponse?.code === "Successfully applied."
                                        ? "Successfully applied."
                                        : WebcastReducer?.couponWebcastResponse?.code === "Please check the code."
                                            ? "Please check the code."
                                            : "Please enter a valid coupon"
                                    }
                                </Text>
                            </View>
                        ) : null}

                        {cartdetails?.length == 0 ? null : (
                            <>
                                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: '100%',
                                        paddingVertical: normalize(5)
                                    }}>
                                        <Text style={{
                                            fontFamily: Fonts.InterSemiBold,
                                            fontSize: 14,
                                            color: Colorpath.black,
                                            fontWeight: "bold"
                                        }}>
                                            {`Cart Total (${WebcastReducer?.cartdetailsWebcastResponse?.cartData?.total_qty})`}
                                        </Text>
                                        <Text style={{
                                            fontFamily: Fonts.InterSemiBold,
                                            fontSize: 14,
                                            color: Colorpath.black,
                                            fontWeight: "bold"
                                        }}>
                                            {WebcastReducer?.couponWebcastResponse?.discount_value
                                                ? `US$${grossValue}`
                                                : `US$${totalPaid}`}
                                            {/* {WebcastReducer?.couponWebcastResponse?.discount_value ? `US$${WebcastReducer?.couponWebcastResponse?.gross_value}` : `US$${WebcastReducer?.cartdetailsWebcastResponse?.cartData?.total_paid_amount}`} */}
                                        </Text>
                                    </View>
                                    {WebcastReducer?.couponWebcastResponse?.discount_value ? (<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%', paddingVertical: normalize(5) }}>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: Colorpath.black, fontWeight: "bold" }}>
                                            {"Discount (-)"}
                                        </Text>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: Colorpath.black, fontWeight: "bold" }}>
                                            {`US$${WebcastReducer?.couponWebcastResponse?.discount_value}`}
                                        </Text>
                                    </View>) : null}
                                    <View style={{ marginTop: normalize(10), height: 1, width: '100%', backgroundColor: "#DDD" }} />
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: '100%',
                                        paddingVertical: normalize(5)
                                    }}>
                                        <Text style={{
                                            fontFamily: Fonts.InterSemiBold,
                                            fontSize: 18,
                                            color: Colorpath.black,
                                            fontWeight: "bold"
                                        }}>
                                            {"Total Amount"}
                                        </Text>
                                        <Text style={{
                                            fontFamily: Fonts.InterSemiBold,
                                            fontSize: 18,
                                            color: Colorpath.black,
                                            fontWeight: "bold"
                                        }}>
                                            {WebcastReducer?.couponWebcastResponse?.discount_value
                                                ? `US$${totalValue}`
                                                : `US$${totalPaid}`}
                                            {/* {WebcastReducer?.couponWebcastResponse?.discount_value ? `US$${WebcastReducer?.couponWebcastResponse?.total_value}` : `US$${WebcastReducer?.cartdetailsWebcastResponse?.cartData?.total_paid_amount}`} */}
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    <Buttons
                                        onPress={() => {
                                            if (isFree) {
                                                CheckCart();
                                            } else {
                                                props.navigation.navigate("Checkout", { checkoutSpan: cart });
                                            }
                                        }}
                                        height={normalize(45)}
                                        width={normalize(300)}
                                        backgroundColor={Colorpath.ButtonColr}
                                        borderRadius={normalize(9)}
                                        text="Proceed"
                                        color={Colorpath.white}
                                        fontSize={18}
                                        fontFamily={Fonts.InterSemiBold}
                                        marginTop={normalize(30)}
                                        disabled={false}
                                    />
                                </View>
                            </>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>}
            <CartPay
                isVisible={paymentcardfreecart}
                setPaymentcardfree={setPaymentcardfreecart}
                content={isFree ? "Your registration has been \n successfully confirmed." : "Your payment has been \n successfully completed."}
                navigation={props.navigation}
                name={"TabNav"}
                dataPayemnt={WebcastReducer?.FreeCartResponse}
                maindata={props?.route?.params?.addtocart.webcast}
            />
            <CartFd
                isVisible={paymentfdfreecart}
                setPaymentfdfreecart={setPaymentfdfreecart}
                content={isFree ? "Your registration has been \n successfully confirmed." : "Your payment has been \n successfully completed."}
                navigation={props.navigation}
                name={"TabNav"} />
        </>
    )
}

export default AddToCart