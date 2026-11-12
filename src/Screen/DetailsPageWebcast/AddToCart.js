/**
 * Add to cart screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, AddToCart, toggleModalPaymentfreecart, toggleModalFailedfreecart, cartPress, applyCoupon, CheckCart, cartFreeTake, loadMoreData, renderFooter, handleDeletecart, exploreCart, cleanNumber, formatPrice, buildCartRoutePayload, formatNumberWithCommas.
 */

import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
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
import { SafeAreaView } from 'react-native-safe-area-context';
import AddToCartShimmer from '../../Components/AddToCartShimmer';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

/**
 * Reusable AddToCart component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

/**
 * Add to cart component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const AddToCart = (props) => {
    const {
        cartcount,
        setCartcount,
        isConnected
    } = useContext(AppContext);
    console.log("props.route", props?.route?.params?.addtocart?.addtocart == "startcallapi", props?.route?.params);
    console.log(props?.route?.params, "cupon======");
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const isFocused = useIsFocused();
    const handledCartStatus = useRef(WebcastReducer.status);
    const pendingFreeCheckout = useRef(false);
    const isSilentRefreshRef = useRef(false);
    const hasInitializedSelectionRef = useRef(false);
    const dispatch = useDispatch();
    const [couponapp, setCouponapp] = useState("");
    const [cartdetails, setCartdetails] = useState(null);
    const [selectedItemKeys, setSelectedItemKeys] = useState([]);
    const [addtocartview, setAddtocartview] = useState(null);
    const [paginatedDatacart, setPaginatedDatacart] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [codeText, setCodeText] = useState("");
    const [cart, setCart] = useState("");
    const [paymentcardfreecart, setPaymentcardfreecart] = useState(false);
    const [paymentfdfreecart, setPaymentfdfreecart] = useState(false);
    const returnConferenceUrl = props?.route?.params?.addtocart?.urlneedTake || props?.route?.params?.newCast || "";
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
        /**
 * Toggle modal paymentfreecart utility.
 * @param {*} ddf - Input value.
 * @returns {void}
 */
const toggleModalPaymentfreecart = (ddf) => {
        setPaymentcardfreecart(ddf);
    };
        /**
 * Toggle modal failedfreecart utility.
 * @param {*} tikg - Input value.
 * @returns {void}
 */
const toggleModalFailedfreecart = (tikg) => {
        setPaymentfdfreecart(tikg);
    };
        /**
 * Cart press utility.
 * @returns {void}
 */
const cartPress = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack();
            return;
        }
        if (returnConferenceUrl) {
            props.navigation.navigate("Statewebcast", { newCast: returnConferenceUrl });
            return;
        }
        props.navigation.goBack();
    }
    useFocusEffect(
        React.useCallback(() => {
            isSilentRefreshRef.current = false;
            hasInitializedSelectionRef.current = false;
            setCart('');
            setCartdetails(null);
            setSelectedItemKeys([]);
            setPaginatedDatacart([]);
            setCodeText('');
            setCouponapp('');
            pendingFreeCheckout.current = false;
            let obj = {};
            connectionrequest()
                .then(() => {
                    dispatch(cartcountWebcastRequest(obj));
                    dispatch(cartdetailsWebcastRequest(obj));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                });
        }, [dispatch])
    );
        /**
 * Apply coupon utility.
 * @returns {void}
 */
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
    const getCartItemKey = (item, fallbackIndex = '') => String(item?.payment_ticket_id || item?.payment_id || item?.id || fallbackIndex);
    const toggleCartItemSelection = (itemKey) => {
        setSelectedItemKeys(prevKeys =>
            prevKeys.includes(itemKey)
                ? prevKeys.filter(key => key !== itemKey)
                : [...prevKeys, itemKey]
        );
    };
    const cartPayId = (Array.isArray(cartdetails) ? cartdetails : (cart?.cartData?.tickets || []))
        .filter((item, index) => selectedItemKeys.includes(getCartItemKey(item, index)));
        /**
 * Check cart component.
 * @returns {void}
 */
const CheckCart = () => {
        if (!cartPayId.length) {
            return;
        }
        let objcart = {
            "payment_id": cartPayId.map(item => item?.payment_id),
        }
        connectionrequest()
            .then(() => {
                pendingFreeCheckout.current = true;
                dispatch(cartCheckoutRequest(objcart))
            })
            .catch((err) => {
                pendingFreeCheckout.current = false;
                showErrorAlert(err, "Please connect to internet");
            })
    }
        /**
 * Cart free take utility.
 * @param {*} invcz - Input value.
 * @returns {void}
 */
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
    // ── Move switch-case into useEffect to avoid setState during render ─────
    useEffect(() => {
        if (!isFocused) return;
        let status = handledCartStatus.current;
        if (status == '' || WebcastReducer.status != status) {
            handledCartStatus.current = WebcastReducer.status;
            switch (WebcastReducer.status) {
                case 'WebCast/cartdetailsWebcastRequest':
                    status = WebcastReducer.status;
                    if (!isSilentRefreshRef.current) {
                        setLoading(true);
                    }
                    break;
                case 'WebCast/cartdetailsWebcastSuccess':
                    status = WebcastReducer.status;
                    isSilentRefreshRef.current = false;
                    setLoading(false);
                    console.log("cartdetails followed>>>>", WebcastReducer?.cartdetailsWebcastResponse);
                    setCart(WebcastReducer?.cartdetailsWebcastResponse);
                    const seen = new Set();
                    const uniqueWebcastReducer = WebcastReducer?.cartdetailsWebcastResponse?.cartData?.tickets &&
                        WebcastReducer?.cartdetailsWebcastResponse?.cartData?.tickets.filter(item => {
                            if (seen.has(item.payment_ticket_id)) return false;
                            seen.add(item.payment_ticket_id);
                            return true;
                        });
                    const resolvedCartItems = uniqueWebcastReducer || [];
                    const resolvedKeys = resolvedCartItems.map((item, idx) => getCartItemKey(item, idx));
                    if (!hasInitializedSelectionRef.current) {
                        hasInitializedSelectionRef.current = true;
                        setSelectedItemKeys(resolvedKeys);
                    } else {
                        setSelectedItemKeys(prevKeys => {
                            const prevSet = new Set(prevKeys);
                            return resolvedKeys.filter(key => prevSet.has(key));
                        });
                    }
                    setCartdetails(resolvedCartItems);
                    setPaginatedDatacart(resolvedCartItems);
                    break;
                case 'WebCast/cartdetailsWebcastFailure':
                    status = WebcastReducer.status;
                    isSilentRefreshRef.current = false;
                    setLoading(false);
                    break;
                case 'WebCast/cartdeleteWebcastRequest':
                    status = WebcastReducer.status;
                    break;
                case 'WebCast/cartdeleteWebcastSuccess':
                    status = WebcastReducer.status;
                    if (WebcastReducer?.cartdeleteWebcastResponse?.msg == "Item deleted in cart successfully.") {
                        showErrorAlert("Item deleted from cart successfully.");
                        isSilentRefreshRef.current = true;
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
                    console.log(WebcastReducer?.couponWebcastResponse, "Item deleted from cart successfully.");
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
                    if (!pendingFreeCheckout.current) break;
                    pendingFreeCheckout.current = false;
                    if (WebcastReducer?.cartCheckoutResponse?.invoiceNumber) {
                        cartFreeTake(WebcastReducer?.cartCheckoutResponse?.invoiceNumber);
                    }
                    break;
                case 'WebCast/cartCheckoutFailure':
                    status = WebcastReducer.status;
                    pendingFreeCheckout.current = false;
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
                    console.log("payment12222=====", WebcastReducer?.FreeCartResponse);
                    break;
                case 'WebCast/FreeCartFailure':
                    status = WebcastReducer.status;
                    break;
            }
        }
    }, [WebcastReducer.status, isFocused]);
    const takeCountde = useMemo(() => (
        WebcastReducer?.cartcountWebcastResponse?.cartItemsCount || 0
    ), [WebcastReducer?.cartcountWebcastResponse?.cartItemsCount]);
    useEffect(() => {
        setCartcount(takeCountde);
    }, [takeCountde]);
    console.log(cart, "card>>>>>======>>>>>>>123", paginatedDatacart, cartdetails, WebcastReducer?.couponWebcastResponse?.code == "Successfully applied.")
    useEffect(() => {
        if (cartdetails) {
            const fullData = cartdetails;
            setAddtocartview(fullData);
            const dataToShow = fullData;
            setPaginatedDatacart(dataToShow);
            setLoading(false);
        }
    }, [cartdetails]);

        /**
 * Load more data utility.
 * @returns {void}
 */
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
        /**
 * Render footer utility.
 * @returns {*}
 */
const renderFooter = () => {
        return loadingMore ? (
            <View style={{ paddingVertical: normalize(20) }}>
                <ActivityIndicator size="small" color={Colorpath.ButtonColr} />
            </View>
        ) : null;
    };
    const [showLoader, setShowLoader] = useState(true);
    useEffect(() => {
        // Removed arbitrary 4s spinner — shimmer now handles initial load
        setShowLoader(false);
    }, []);
        /**
 * Handles deletecart.
 * @param {*} dataid - Input value.
 * @returns {void}
 */
const handleDeletecart = (dataid) => {
        if (!Array.isArray(cartdetails) || cartdetails?.length === 0) {
            return;
        }
        const normalizedDataId = String(dataid).trim();
        const deletedKeys = new Set(
            cartdetails
                .filter(item => String(item?.payment_id).trim() === normalizedDataId)
                .map((item, idx) => getCartItemKey(item, idx))
        );
        const updatedData = cartdetails.filter(item => String(item?.payment_id).trim() !== normalizedDataId);
        if (updatedData.length !== cartdetails.length) {
            setSelectedItemKeys(prevKeys => prevKeys.filter(key => !deletedKeys.has(key)));
            setPaginatedDatacart(updatedData);
            setCartdetails(updatedData);
            setCart(prev => {
                if (!prev?.cartData) return prev;
                const tickets = prev.cartData.tickets || [];
                const removedTickets = tickets.filter(
                    item => String(item?.payment_id).trim() === normalizedDataId
                );
                const remainingTickets = tickets.filter(
                    item => String(item?.payment_id).trim() !== normalizedDataId
                );
                const removedAmount = removedTickets.reduce(
                    (sum, ticket) => sum + cleanNumber(ticket?.paid_amount),
                    0
                );
                const remainingQty = remainingTickets.reduce(
                    (sum, ticket) => sum + cleanNumber(ticket?.ticket_qty ?? 1),
                    0
                );
                const nextSubtotal = Math.max(
                    0,
                    cleanNumber(prev.cartData.subtotal_amount ?? prev.cartData.total_paid_amount) - removedAmount
                );
                return {
                    ...prev,
                    cartData: {
                        ...prev.cartData,
                        tickets: remainingTickets,
                        total_qty: remainingQty,
                        subtotal_amount: nextSubtotal,
                        total_paid_amount: nextSubtotal,
                    },
                };
            });
        }
    };
        /**
 * Explore cart utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const exploreCart = ({ item, index }) => {
        const creditPoints = Number(item?.credits?.[0]?.points);
        const creditName = item?.credits?.[0]?.name;
        const hasCreditBadge = item?.credits?.length > 0 && !Number.isNaN(creditPoints) && creditPoints > 0 && Boolean(creditName);
        const unitAmount = cleanNumber(item?.paid_amount);
        const itemKey = getCartItemKey(item, index);
        const isSelected = selectedItemKeys.includes(itemKey);
        return (
            <View style={[styles.cartItemCard, !isSelected && styles.cartItemCardUnselected]}>
                <View style={styles.cartItemHeaderRow}>
                    <TouchableOpacity
                        accessibilityRole="checkbox"
                        accessibilityLabel={`Select ${item?.conference_name || 'item'}`}
                        accessibilityState={{ checked: isSelected }}
                        activeOpacity={0.75}
                        onPress={() => toggleCartItemSelection(itemKey)}
                        style={[styles.checkboxButton, isSelected && styles.checkboxButtonChecked]}
                    >
                        {isSelected ? (
                            <DeletIcon name="check" size={normalize(11)} color="#FFFFFF" />
                        ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => toggleCartItemSelection(itemKey)}
                        style={styles.cartItemTitleTouch}
                    >
                        <Text numberOfLines={2} style={styles.cartItemTitle}>
                            {item?.conference_name}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        accessibilityLabel="Remove item from cart"
                        activeOpacity={0.75}
                        style={styles.deleteButton}
                        onPress={() => {
                            Alert.alert('eMedEvents', 'Are you sure you want to delete this item from your cart?', [{
                                text: "No",
                                /**
                                 * On press utility.
                                 * @returns {void}
                                 */
                                onPress: () => { console.log("hello") },
                                style: "cancel"
                            }, {
                                text: "Yes",
                                /**
                                 * On press utility.
                                 * @returns {void}
                                 */
                                onPress: () => {
                                    handleDeletecart(item?.payment_id);
                                    let obj = {
                                        "paymentId": item?.payment_id
                                    }
                                    dispatch(cartdeleteWebcastRequest(obj));
                                },
                                style: "default"
                            }])
                        }}>
                        <DeletIcon name="delete" size={normalize(16)} color="#DC2626" />
                    </TouchableOpacity>
                </View>

                {hasCreditBadge ? (
                    <View style={styles.creditBadge}>
                        <Text style={styles.creditBadgeText}>
                            {`${creditPoints} ${creditName}`}
                        </Text>
                    </View>
                ) : null}

                <View style={styles.cardDivider} />

                <View style={styles.cartItemFooterRow}>
                    <View style={styles.qtyPill}>
                        <Text style={styles.qtyPillText}>
                            {`Qty: ${item?.ticket_qty ?? 1}`}
                        </Text>
                    </View>
                    <Text style={styles.cartItemPriceText}>
                        {`${item?.ticket_qty} × US$${formatNumberWithCommas(formatPrice(unitAmount))}`}
                    </Text>
                </View>
            </View>
        )
    }
    const grossValue = codeText?.gross_value ?? 0;
    const totalPaid = cart?.cartData?.total_paid_amount ?? 0;
    const totalValue = codeText?.total_value ?? 0;
    const totalQty = cart?.cartData?.total_qty ?? 0;
        /**
 * Clean number utility.
 * @param {*} value - Input value.
 * @returns {number}
 */
const cleanNumber = (value) => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const num = parseFloat(value.replace(/,/g, ''));
            return isNaN(num) ? 0 : num;
        }
        return 0;
    };
        /**
 * Formats price.
 * @param {*} price - Input value.
 * @returns {*}
 */
const formatPrice = (price) => {
        let num = parseFloat(price);
        if (isNaN(num)) {
            return price;
        }
        let truncated = Math.floor(num * 100) / 100;
        return truncated % 1 == 0 ? truncated.toString() : truncated.toFixed(2);
    };
    const allCartItems = Array.isArray(cartdetails) ? cartdetails : (cart?.cartData?.tickets || []);
    const selectedCartItems = allCartItems.filter((item, index) => selectedItemKeys.includes(getCartItemKey(item, index)));
    const allCartItemsSelected = allCartItems.length > 0 && selectedCartItems.length === allCartItems.length;
    const hasFreeTicket = selectedCartItems.length > 0 && selectedCartItems.some((ticket) => cleanNumber(ticket?.paid_amount) === 0);
    const allTicketsFree = selectedCartItems.length > 0 && selectedCartItems.every((ticket) => cleanNumber(ticket?.paid_amount) === 0);
    const isFree = allTicketsFree || (selectedCartItems.length === 1 && hasFreeTicket);
    const ticketItems = cart?.cartData?.tickets || [];
    const selectedQty = selectedCartItems.reduce((sum, ticket) => sum + cleanNumber(ticket?.ticket_qty ?? 1), 0);
    const allItemsPaidSum = ticketItems.reduce((sum, ticket) => sum + cleanNumber(ticket?.paid_amount), 0);
    const selectedItemsPaidSum = selectedCartItems.reduce((sum, ticket) => sum + cleanNumber(ticket?.paid_amount), 0);
    const fullCartSubtotal = cleanNumber(
        codeText?.discount_value
            ? grossValue
            : cart?.cartData?.subtotal_amount ?? totalPaid
    );
    const fullCartBaseAmount = cleanNumber(
        codeText?.discount_value
            ? totalValue
            : cart?.cartData?.subtotal_amount ?? totalPaid
    );
    const fullCartProcessingFeeAmount = cleanNumber(
        cart?.cartData?.overall_transaction_fee ??
        ticketItems.reduce((sum, ticket) => sum + cleanNumber(ticket?.transaction_fee || 0), 0)
    );
    const fullCartTotalAmount = cleanNumber(
        codeText?.discount_value
            ? codeText?.total_amount_with_fee ?? (fullCartBaseAmount + fullCartProcessingFeeAmount)
            : cart?.cartData?.total_amount_with_fee ?? (fullCartBaseAmount + fullCartProcessingFeeAmount)
    );
    const selectedDiscountAmount = allCartItemsSelected
        ? cleanNumber(codeText?.discount_value)
        : (selectedCartItems.length > 0 && codeText?.discount_value && allItemsPaidSum > 0
            ? Math.min(selectedItemsPaidSum, Math.round((cleanNumber(codeText?.discount_value) * (selectedItemsPaidSum / allItemsPaidSum)) * 100) / 100)
            : 0);
    const latestCartBaseAmount = allCartItemsSelected
        ? fullCartBaseAmount
        : (selectedCartItems.length === 0 ? 0 : Math.max(0, selectedItemsPaidSum - selectedDiscountAmount));
    const selectedTicketsFeeSum = selectedCartItems.reduce((sum, ticket) => sum + cleanNumber(ticket?.transaction_fee || 0), 0);
    const latestCartProcessingFeeAmount = allCartItemsSelected
        ? fullCartProcessingFeeAmount
        : (selectedCartItems.length === 0
            ? 0
            : (selectedTicketsFeeSum > 0
                ? selectedTicketsFeeSum
                : (fullCartProcessingFeeAmount > 0 && allItemsPaidSum > 0
                    ? Math.round((fullCartProcessingFeeAmount * (selectedItemsPaidSum / allItemsPaidSum)) * 100) / 100
                    : 0)));
    const latestCartTotalAmount = allCartItemsSelected
        ? fullCartTotalAmount
        : (selectedCartItems.length === 0 ? 0 : latestCartBaseAmount + latestCartProcessingFeeAmount);
        /**
 * Build cart route payload utility.
 * @returns {Object}
 */
const buildCartRoutePayload = () => ({
        ...cart,
        cartData: {
            ...(cart?.cartData || {}),
            tickets: selectedCartItems,
            total_qty: selectedQty,
            subtotal_amount: latestCartBaseAmount,
            overall_transaction_fee: latestCartProcessingFeeAmount,
            total_amount_with_fee: latestCartTotalAmount,
            total_paid_amount: latestCartTotalAmount,
        },
        subtotalAmount: latestCartBaseAmount,
        processingFeeAmount: latestCartProcessingFeeAmount,
        totalTicketPrice: latestCartTotalAmount,
    });
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);
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
    const displayedCartSubtotal = allCartItemsSelected
        ? fullCartSubtotal
        : (selectedCartItems.length === 0 ? 0 : selectedItemsPaidSum);
    const formattedCartTotal = `US$${formatNumberWithCommas(formatPrice(latestCartBaseAmount))}`;
    const itemCount = selectedQty;
    const summaryQty = allCartItemsSelected ? (totalQty || selectedQty) : selectedQty;
    return (
        <>
            <MyStatusBar
                barStyle={"light-content"}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn == false ? <IntOff /> : <SafeAreaView style={styles.screenContainer}>
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
                <KeyboardAvoidingView
                    style={styles.keyboardContainer}
                    behavior={Platform.OS === 'ios' ? "padding" : undefined}>
                    {/* ── Shimmer while cart data loads ── */}
                    {!cartdetails ? (
                        <AddToCartShimmer />
                    ) : (
                        <View style={styles.contentWrapper}>
                            <ScrollView
                                style={styles.scrollView}
                                contentContainerStyle={styles.scrollContent}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled">
                                {cartdetails?.length > 0 ? (
                                    <View style={styles.sectionHeaderRow}>
                                        <Text style={styles.sectionHeaderTitle}>{"Cart Items"}</Text>
                                        <View style={styles.countBadge}>
                                            <Text style={styles.countBadgeText}>
                                                {`${itemCount} ${Number(itemCount) === 1 ? 'Item' : 'Items'}`}
                                            </Text>
                                        </View>
                                    </View>
                                ) : null}

                                <View>
                                    <FlatList
                                        data={cartdetails}
                                        renderItem={exploreCart}
                                        scrollEnabled={false}
                                        keyExtractor={(item, index) => String(item?.payment_ticket_id || item?.payment_id || item?.id || index)}
                                        ListFooterComponent={renderFooter}
                                        ListEmptyComponent={
                                            !loading && !showLoader ? (
                                                <View style={styles.emptyWrapper}>
                                                    <View style={styles.emptyCard}>
                                                        <Text style={styles.emptyTitle}>
                                                            {"There are no records located."}
                                                        </Text>
                                                    </View>
                                                </View>
                                            ) : null
                                        }
                                    />
                                </View>

                                {(props?.route?.params?.addtocart?.coupon?.discounts == true && props?.route?.params?.addtocart?.cart !== "remove") ? (
                                    <View style={styles.sectionCard}>
                                        <Text style={styles.cardSectionTitle}>{"Apply Coupon"}</Text>
                                        <View style={styles.couponRow}>
                                            <TextInput
                                                maxLength={10}
                                                value={couponapp}
                                                placeholder='Enter Coupon'
                                                placeholderTextColor={"#94A3B8"}
                                                onChangeText={(val) => { setCouponapp(val) }}
                                                keyboardType="visible-password"
                                                style={styles.couponInput}
                                            />
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    if (codeText?.code == "Successfully applied.") {
                                                        setCouponapp("");
                                                        applyCoupon();
                                                    } else {
                                                        applyCoupon();
                                                    }
                                                }}
                                                style={styles.couponButton}
                                            >
                                                {codeText?.code === "Successfully applied." ? (
                                                    <Text style={styles.couponButtonText}>
                                                        {"Apply"}
                                                    </Text>
                                                ) : (
                                                    couponapp ? (
                                                        <Text style={styles.couponButtonText}>
                                                            {"Apply"}
                                                        </Text>
                                                    ) : (
                                                        <Text style={styles.couponButtonText}>
                                                            {"Cancel"}
                                                        </Text>
                                                    )
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                        {couponapp ? (
                                            <Text style={[
                                                styles.couponFeedbackText,
                                                { color: codeText?.code === "Successfully applied." ? '#059669' : "#DC2626" }
                                            ]}>
                                                {codeText?.code === "Successfully applied."
                                                    ? "Successfully applied."
                                                    : codeText?.code === "Please check the code."
                                                        ? "Please check the code."
                                                        : "Please enter a valid coupon"
                                                }
                                            </Text>
                                        ) : null}
                                    </View>
                                ) : (
                                    couponapp ? (
                                        <View style={styles.couponMessageOnly}>
                                            <Text style={[
                                                styles.couponFeedbackText,
                                                { color: codeText?.code === "Successfully applied." ? '#059669' : "#DC2626" }
                                            ]}>
                                                {codeText?.code === "Successfully applied."
                                                    ? "Successfully applied."
                                                    : codeText?.code === "Please check the code."
                                                        ? "Please check the code."
                                                        : "Please enter a valid coupon"
                                                }
                                            </Text>
                                        </View>
                                    ) : null
                                )}

                                {cartdetails?.length == 0 ? null : (
                                    <View style={styles.sectionCard}>
                                        <Text style={styles.cardSectionTitle}>{"Order Summary"}</Text>
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>
                                                {`Cart Total (${summaryQty})`}
                                            </Text>
                                            <Text style={styles.summaryValue}>
                                                {`US$${formatNumberWithCommas(formatPrice(displayedCartSubtotal))}`}
                                            </Text>
                                        </View>
                                        {selectedDiscountAmount > 0 ? (
                                            <View style={styles.summaryRow}>
                                                <Text style={styles.discountLabel}>
                                                    {"Discount (-)"}
                                                </Text>
                                                <Text style={styles.discountValue}>
                                                    {`-US$${formatNumberWithCommas(formatPrice(selectedDiscountAmount))}`}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </View>
                                )}
                            </ScrollView>

                            {cartdetails?.length == 0 ? null : (
                                <View style={styles.footerBar}>
                                    <View style={styles.footerPriceCol}>
                                        <Text style={styles.footerPriceLabel}>{"Total Amount"}</Text>
                                        <Text style={styles.footerPriceValue}>{formattedCartTotal}</Text>
                                    </View>
                                    <Buttons
                                        onPress={() => {
                                            if (selectedCartItems.length === 0) {
                                                return;
                                            }
                                            if (isFree) {
                                                CheckCart();
                                            } else {
                                                props.navigation.push("Checkout", { checkoutSpan: buildCartRoutePayload() });
                                            }
                                        }}
                                        height={normalize(44)}
                                        width={normalize(155)}
                                        backgroundColor={selectedCartItems.length === 0 ? '#94A3B8' : Colorpath.ButtonColr}
                                        borderRadius={normalize(10)}
                                        text="Proceed"
                                        color={Colorpath.white}
                                        fontSize={14}
                                        fontFamily={Fonts.InterSemiBold}
                                        marginTop={0}
                                        disabled={selectedCartItems.length === 0}
                                    />
                                </View>
                            )}
                        </View>
                    )}
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

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#F4F7FC',
    },
    keyboardContainer: {
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: normalize(12),
        paddingTop: normalize(10),
        paddingBottom: normalize(16),
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: normalize(6),
    },
    sectionHeaderTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#0F172A',
    },
    countBadge: {
        backgroundColor: '#E0ECFF',
        borderRadius: normalize(20),
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(3),
    },
    countBadgeText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 11,
        color: Colorpath.ButtonColr,
    },
    centerLoader: {
        marginVertical: normalize(20),
    },
    cartItemCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: '#E5ECF6',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(10),
        marginBottom: normalize(8),
    },
    cartItemCardUnselected: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
    },
    cartItemHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    checkboxButton: {
        width: normalize(18),
        height: normalize(18),
        borderRadius: normalize(4),
        borderWidth: 1.5,
        borderColor: '#94A3B8',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(8),
        marginTop: normalize(2),
    },
    checkboxButtonChecked: {
        borderColor: Colorpath.ButtonColr,
        backgroundColor: Colorpath.ButtonColr,
    },
    cartItemTitleTouch: {
        flex: 1,
        marginRight: normalize(8),
    },
    cartItemTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        lineHeight: 19,
        color: '#0F172A',
    },
    deleteButton: {
        width: normalize(28),
        height: normalize(28),
        borderRadius: normalize(8),
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    creditBadge: {
        alignSelf: 'flex-start',
        marginTop: normalize(5),
        backgroundColor: '#ECFDF5',
        borderRadius: normalize(6),
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(3),
    },
    creditBadgeText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 11,
        color: '#047857',
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: normalize(7),
    },
    cartItemFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    qtyPill: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: normalize(6),
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(3),
    },
    qtyPillText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 11,
        color: '#475569',
    },
    cartItemPriceText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: Colorpath.ButtonColr,
    },
    emptyWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: normalize(20),
    },
    emptyCard: {
        width: '100%',
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: '#E5ECF6',
        backgroundColor: '#FFFFFF',
        paddingVertical: normalize(22),
        paddingHorizontal: normalize(14),
        alignItems: 'center',
    },
    emptyTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#334155',
        textAlign: 'center',
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: '#E5ECF6',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(10),
        marginBottom: normalize(8),
    },
    cardSectionTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
        color: '#0F172A',
        marginBottom: normalize(6),
    },
    couponRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D5E0EE',
        borderRadius: normalize(8),
        backgroundColor: '#F8FAFC',
        height: normalize(40),
        overflow: 'hidden',
    },
    couponInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: normalize(10),
        fontFamily: Fonts.InterMedium,
        fontSize: 13,
        color: '#0F172A',
    },
    couponButton: {
        height: '100%',
        paddingHorizontal: normalize(16),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colorpath.ButtonColr,
    },
    couponButtonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
        color: '#FFFFFF',
    },
    couponFeedbackText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 12,
        marginTop: normalize(6),
    },
    couponMessageOnly: {
        paddingHorizontal: normalize(4),
        marginBottom: normalize(8),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: normalize(3),
    },
    summaryLabel: {
        fontFamily: Fonts.InterMedium,
        fontSize: 13,
        color: '#475569',
    },
    summaryValue: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
        color: '#0F172A',
    },
    discountLabel: {
        fontFamily: Fonts.InterMedium,
        fontSize: 13,
        color: '#059669',
    },
    discountValue: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
        color: '#059669',
    },
    footerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5ECF6',
        paddingHorizontal: normalize(14),
        paddingVertical: normalize(10),
    },
    footerPriceCol: {
        flex: 1,
        marginRight: normalize(12),
    },
    footerPriceLabel: {
        fontFamily: Fonts.InterMedium,
        fontSize: 11,
        color: '#64748B',
    },
    footerPriceValue: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 15,
        color: '#0F172A',
        marginTop: normalize(2),
    },
});

/**
 * Add to cart default export.
 *
 * @returns {*}
 */
export default AddToCart
