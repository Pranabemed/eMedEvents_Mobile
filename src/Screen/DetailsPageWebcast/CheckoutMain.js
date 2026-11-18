/**
 * Checkout main screen module. Renders a React Native screen or a screen-scoped support component. Exported members: CheckoutMain, formatNumberWithCommas, handleToggleExpand, handleSoftDelete, parseDate, formatPrice.
 */

import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, StyleSheet, Platform, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import TickMark from 'react-native-vector-icons/Ionicons';
import CheckoutInputbox from './CheckoutInputbox';
import Buttons from '../../Components/Button';
import CheckoutModalone from './CheckoutModalone';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';

import moment from 'moment';
import { FormatDateZone } from '../../Utils/Helpers/Timezone';
import { useSelector } from 'react-redux';

/**
 * Reusable CheckoutMain component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const CheckoutMain = ({
    markPersonalizationEdited,
    savefull,
    setSavefull,
    setNotadded,
    notadded,
    codesave,
    setCodesave,
    WebcastReducer,
    setCouponapp,
    couponapp,
    applyCoupon,
    dobindex,
    setDobindex,
    setDobchoose,
    dobchoose,
    setDateofbirth,
    dateofbirth,
    dialcode,
    SetDialcode,
    setPaymentcardfree,
    setPaymentfdfree,
    handleInputChange,
    isEmailTouched,
    setIsEmailTouched,
    isCellNoTouched,
    setIsCellNoTouched,
    setAllmsg,
    allmsg,
    setProfindex,
    profindex,
    handlecityShows,
    handleStateshows,
    handleCountrySet,
    cityAll,
    slistpratice,
    countryall,
    handleInputChangeeamilad,
    activeIndexc,
    activeIndexct,
    activeIndexs,
    setActiveIndexc,
    setActiveindexs,
    searchpratice,
    errorFlags,
    handleProfession,
    countrypickerprof,
    setcountrypickerprof,
    searchpraticelic,
    licstatepratice,
    setLicstatepratice,
    activeIndexslic,
    slistpraticelic,
    license_expiry_date,
    setLicense_expiry_date,
    license_state_id,
    setLicense_state_id,
    license_number,
    setLicense_number,
    handleLicStateshows,
    setActiveIndexslic,
    medicallics,
    setMedicallics,
    opendatelicyall,
    setOpendatelicyall,
    dateindex,
    setDateindex,
    errors,
    setErrors,
    customFields,
    setCustomFields,
    customFieldsLabels,
    setCustomFieldsLabels,
    iseMededDo,
    checkoutBaseAmount,
    checkoutProcessingFeeAmount,
    checkoutTotalAmount,
    setActiveIndexct, pratice, cityPicker, city_id, state_id, country_id, countrypicker, speciality_id, selectedSpecialities, removeSpeciality, setSelectedSpecialities, handleSpecialitySelect, formData, setFormData, activeIndex, setActiveIndex, setSearchState, searchState, searchStateName, slist, setSpeciality, setSpeciality_id, statepicker, cartPayment, proceedPayment, fullAccess, spanroute, ticketSave, firstname, setFirstname, lastname, setLastname, emailad, setEmailad, professionad, setProfessionad, setstatepicker, allProfession, specaillized, speciality, npino, setNpino, address, setAddress, setCountrypicker, countryReq, country, PraticingState, setPratice, state, setCityPicker, cityReq, city, zipcode, setZipcode, cellno, setCellno }) => {
    console.log(spanroute, statepicker, ticketSave, "spanroute=========", country_id, fullAccess, spanroute?.checkoutSpan?.cmeCreditsData);
    const getInitialTotalCount = () => {
        let totalQuantity = 0;
        if (spanroute?.inPersonTicket?.tickets) {
            totalQuantity += spanroute.inPersonTicket.tickets.reduce((total, ticket) => total + Number(ticket.quantity || 0), 0);
        }
        if (spanroute?.finalTicket?.tickets) {
            totalQuantity += spanroute.finalTicket.tickets.reduce((total, ticket) => total + ticket.quantity, 0);
        }
        if (spanroute?.cartData?.total_qty) {
            totalQuantity = spanroute?.cartData?.total_qty;
        } else if (Array.isArray(spanroute?.cartData?.tickets)) {
            totalQuantity = spanroute?.cartData?.tickets?.length;
        }
        return totalQuantity;
    };
    const [totalcount, setTotalcount] = useState(getInitialTotalCount);
    const [checked, setChecked] = useState(false);
    const [formDate, setFormDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const allPickersAreFalse = !licstatepratice && !statepicker && !countrypicker && !pratice && !cityPicker && !countrypickerprof;
    const [isExpanded, setIsExpanded] = useState(false); // State to control the collapse/expand
    const [displayedTickets, setDisplayedTickets] = useState(spanroute?.inPersonTicket?.tickets || []); // Track tickets to display
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
     console.log(ticketSave, "spanroute22222=========")
    const feeAwareBaseAmount = Number(
        checkoutBaseAmount != null
            ? checkoutBaseAmount
            : (savefull?.discount_value && savefull?.total_value != null
                ? savefull?.total_value
                : ticketSave?.tickets?.[0]?.itemamt || 0)
    );
    const feeAwareProcessingAmount = Number(checkoutProcessingFeeAmount || 0);
    const feeAwareTotalAmount = Number(
        checkoutTotalAmount != null
            ? checkoutTotalAmount
            : feeAwareBaseAmount + feeAwareProcessingAmount
    );
    const feeAwareDisplayAmount = feeAwareTotalAmount > 0 ? feeAwareTotalAmount : feeAwareBaseAmount;
    const hasPriceContent = feeAwareBaseAmount > 0;
    const hasTicketList = Boolean(displayedTickets?.length > 0);
    const guestOrigin =
        spanroute?.guestOrigin ||
        spanroute?.checkoutSpan?.Realback ||
        spanroute?.inpersonSpanrole?.Realback;
    const hasAuthToken = useSelector(state => Boolean(String(
        state.AuthReducer?.token || state.AuthReducer?.loginResponse?.token || ''
    ).trim()));
    const isGuestCheckout = !hasAuthToken || ['guest', 'guestuser'].includes(
        String(guestOrigin || '').trim().toLowerCase()
    );
        /**
 * Handles toggle expand.
 * @returns {void}
 */
const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    const isErrorsEmpty = Object.keys(errors).length == 0;
    const hasAnyError = Object.values(errors).includes(true);
    const allFalse = !hasAnyError && !isErrorsEmpty; // If `errors` is not empty and contains only `false`
    let isDisabled;
    if (isErrorsEmpty) {
        isDisabled = !fullAccess; // If errors are empty, rely on fullAccess
    } else if (hasAnyError) {
        isDisabled = true; // If any error exists, disable the button
    } else if (allFalse) {
        isDisabled = !fullAccess; // If all values are false, require both fullAccess and otherKey
    }
    const conferenceTypeText = spanroute?.checkoutSpan?.conferenceTypeText || spanroute?.inpersonSpanrole?.conferenceTypeText;
    const points1 = spanroute?.checkoutSpan?.cmeCreditsData?.[0]?.points || spanroute?.inpersonSpanrole?.cmeCreditsData?.[0]?.points;
    const points2 = spanroute?.checkoutSpan?.cmeCreditsData?.[1]?.points || spanroute?.inpersonSpanrole?.cmeCreditsData?.[1]?.points;
    const name1 = spanroute?.checkoutSpan?.cmeCreditsData?.[0]?.name || spanroute?.inpersonSpanrole?.cmeCreditsData?.[0]?.name;
    const name2 = spanroute?.checkoutSpan?.cmeCreditsData?.[1]?.name || spanroute?.inpersonSpanrole?.cmeCreditsData?.[1]?.name;
    const activeConference = spanroute?.checkoutSpan || spanroute?.inpersonSpanrole || {};
    const conferenceStartDate =
        activeConference?.startdate ||
        activeConference?.start_date ||
        activeConference?.startDate ||
        activeConference?.key_dates?.conferenceStartdate ||
        '';
    const conferenceEndDate =
        activeConference?.enddate ||
        activeConference?.end_date ||
        activeConference?.endDate ||
        activeConference?.key_dates?.conferenceEnddate ||
        '';
        /**
 * Handles soft delete.
 * @param {number} index - Input value.
 * @returns {void}
 */
const handleSoftDelete = (index) => {
        // Use slice to remove only the selected index
        setDisplayedTickets((prevTickets) => [
            ...prevTickets.slice(0, index),
            ...prevTickets.slice(index + 1),
        ]);
    };
    useEffect(() => {
        let totalQuantity = 0;
        if (spanroute?.inPersonTicket?.tickets) {
            totalQuantity += spanroute.inPersonTicket.tickets.reduce((total, ticket) => total + Number(ticket.quantity || 0), 0);
        }

        if (spanroute?.finalTicket?.tickets) {
            totalQuantity += spanroute.finalTicket.tickets.reduce((total, ticket) => total + ticket.quantity, 0);
        }
        if (spanroute?.cartData?.total_qty) {
            totalQuantity = spanroute?.cartData?.total_qty;
        } else if (Array.isArray(spanroute?.cartData?.tickets)) {
            totalQuantity = spanroute?.cartData?.tickets?.length;
        }
        console.log("Total Quantity: main", totalQuantity);
        setTotalcount(totalQuantity); // Update state with totalQuantity
    }, [spanroute]);
    useEffect(() => {
        if (spanroute?.inPersonTicket?.tickets) {
            setDisplayedTickets(spanroute.inPersonTicket.tickets);
        }
    }, [spanroute?.inPersonTicket?.tickets]);
    useEffect(() => {
                /**
 * Parses date.
 * @param {*} dateStr - Input value.
 * @returns {*}
 */
const parseDate = (dateStr) => {
            if (!dateStr) return null;
            const parsed = moment(dateStr, [
                "DD MMM, YYYY",
                "DD MMM YYYY",
                "DD MMM'YY",
                "D MMM, YYYY",
                "D MMM YYYY",
                "DMMM,YYYY",
                moment.ISO_8601,
            ], true);
            return parsed.isValid() ? parsed : null;
        };

        const startMoment = parseDate(conferenceStartDate);
        const endMoment = parseDate(conferenceEndDate);

        setFormDate(startMoment ? startMoment.format("MMM D") : "");
        setEndDate(endMoment ? endMoment.format("MMM D, YYYY") : "");
    }, [conferenceEndDate, conferenceStartDate])

    const conferenceDateLabel = (() => {
        if (conferenceStartDate && conferenceEndDate) {
            const formattedRange = FormatDateZone(conferenceStartDate, conferenceEndDate);
            if (formattedRange) return formattedRange;
            if (formDate && endDate) return `${formDate} - ${endDate}`;
        }
        if (conferenceStartDate) {
            const parsed = moment(conferenceStartDate, [
                "DD MMM, YYYY",
                "DD MMM YYYY",
                "DD MMM'YY",
                "D MMM, YYYY",
                "D MMM YYYY",
                "DMMM,YYYY",
                moment.ISO_8601,
            ], true);
            if (parsed.isValid()) return parsed.format("MMM DD, YYYY");
        }
        if (conferenceEndDate) {
            const parsed = moment(conferenceEndDate, [
                "DD MMM, YYYY",
                "DD MMM YYYY",
                "DD MMM'YY",
                "D MMM, YYYY",
                "D MMM YYYY",
                "DMMM,YYYY",
                moment.ISO_8601,
            ], true);
            if (parsed.isValid()) return parsed.format("MMM DD, YYYY");
        }
        return "";
    })();
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
    // const WebcastReducer = useSelector(state => state.WebcastReducer)
    const isValidWhatsappNo = couponapp?.length > 0 && codesave == "Successfully applied.";
    console.log(couponapp?.length, codesave, "codesave=======", isValidWhatsappNo)
    return (
        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled={true} contentContainerStyle={{ paddingBottom: normalize(70) }}>
            {spanroute?.cartData && allPickersAreFalse ? <View style={{
                backgroundColor: '#F0F7FF',
                borderRadius: normalize(12),
                borderWidth: 1,
                borderColor: '#BAE6FD',
                padding: normalize(14),
                marginHorizontal: normalize(10),
                marginTop: normalize(10),
                marginBottom: normalize(8),
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <View style={{
                        height: normalize(52),
                        width: normalize(52),
                        backgroundColor: '#EFF6FF',
                        borderRadius: normalize(26),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: normalize(12),
                    }}>
                        <Image
                            source={Imagepath.CartPng}
                            style={{
                                height: normalize(28),
                                width: normalize(28),
                                resizeMode: "contain"
                            }}

                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 16, color: Colorpath.ButtonColr }}>{`Total Fee: US$${spanroute?.cartData?.subtotal_amount || spanroute?.cartData?.total_paid_amount || 0}`}</Text>
                        <View style={{ flexDirection: "row", marginTop: normalize(2) }}>
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 13, color: "#64748B" }}>{`Total Courses: `}</Text>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 13, color: "#0F172A" }}>{`${spanroute?.cartData?.total_qty}`}</Text>
                        </View>
                    </View>
                </View>
            </View> : null}
            {(spanroute?.checkoutSpan || spanroute?.inpersonSpanrole) && allPickersAreFalse ? <View style={{
                backgroundColor: '#F0F7FF',
                borderRadius: normalize(12),
                borderWidth: 1,
                borderColor: '#BAE6FD',
                padding: normalize(14),
                marginHorizontal: normalize(10),
                marginTop: normalize(10),
                marginBottom: normalize(8),
            }}>
                <View style={{ paddingVertical: normalize(2) }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 16,
                            lineHeight: 22,
                            color: '#0F172A',
                            textTransform: "capitalize"
                        }}>
                        {spanroute?.checkoutSpan?.title || spanroute?.inpersonSpanrole?.title}
                    </Text>
                </View>

                {(spanroute?.checkoutSpan?.organizerName || spanroute?.inpersonSpanrole?.organizerName) ? (
                    <View style={{ paddingVertical: normalize(2) }}>
                        <Text numberOfLines={1}
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 13,
                                color: '#2563EB',
                                textTransform: "capitalize"
                            }}>
                            {`${spanroute?.checkoutSpan?.organizerName || spanroute?.inpersonSpanrole?.organizerName}`}
                        </Text>
                    </View>
                ) : null}
                {conferenceDateLabel ? <View style={{ paddingVertical: normalize(2) }}>
                    <Text numberOfLines={1}
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 13,
                            color: '#475569',
                        }}>
                        {conferenceDateLabel}
                    </Text>
                </View> : null}
                {spanroute?.inpersonSpanrole?.location ? <View style={{ paddingVertical: normalize(2) }}>
                    <Text numberOfLines={1}
                        style={{
                            fontFamily: Fonts.InterRegular,
                            fontSize: 13,
                            color: '#64748B',
                        }}>
                        {`${spanroute?.inpersonSpanrole?.location}`}
                    </Text>
                </View> : null}

                {((conferenceTypeText || points1 || points2) && conferenceTypeText !== "Webcast" && conferenceTypeText !== "Text-Based CME") ?
                    (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: normalize(6), marginTop: normalize(6) }}>
                            {conferenceTypeText ? (
                                <View style={{
                                    backgroundColor: '#EFF6FF',
                                    borderWidth: 1,
                                    borderColor: '#BFDBFE',
                                    paddingHorizontal: normalize(8),
                                    paddingVertical: normalize(3),
                                    borderRadius: normalize(6),
                                }}>
                                    <Text numberOfLines={1} style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 12,
                                        color: '#1D4ED8',
                                    }}>
                                        {conferenceTypeText}
                                    </Text>
                                </View>
                            ) : null}
                            {points1 ? (
                                <View style={{
                                    backgroundColor: '#ECFDF5',
                                    borderWidth: 1,
                                    borderColor: '#A7F3D0',
                                    paddingHorizontal: normalize(8),
                                    paddingVertical: normalize(3),
                                    borderRadius: normalize(6),
                                }}>
                                    <Text numberOfLines={1}>
                                        <Text style={{
                                            fontFamily: Fonts.InterBold,
                                            fontSize: 13,
                                            color: '#059669',
                                        }}>
                                            {`${+(points1)} `}
                                        </Text>
                                        <Text style={{
                                            fontFamily: Fonts.InterMedium,
                                            fontSize: 12,
                                            color: '#065F46',
                                        }}>
                                            {name1}
                                        </Text>
                                    </Text>
                                </View>
                            ) : null}
                            {points2 ? (
                                <View style={{
                                    backgroundColor: '#ECFDF5',
                                    borderWidth: 1,
                                    borderColor: '#A7F3D0',
                                    paddingHorizontal: normalize(8),
                                    paddingVertical: normalize(3),
                                    borderRadius: normalize(6),
                                }}>
                                    <Text numberOfLines={1}>
                                        <Text style={{
                                            fontFamily: Fonts.InterBold,
                                            fontSize: 13,
                                            color: '#059669',
                                        }}>
                                            {`${+(points2)} `}
                                        </Text>
                                        <Text style={{
                                            fontFamily: Fonts.InterMedium,
                                            fontSize: 12,
                                            color: '#065F46',
                                        }}>
                                            {name2}
                                        </Text>
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    ) : (
                        <View style={{ flexDirection: "row", flexWrap: 'wrap', gap: normalize(6), marginTop: normalize(6) }}>
                            {conferenceTypeText ? (
                                <View style={{
                                    backgroundColor: '#EFF6FF',
                                    borderWidth: 1,
                                    borderColor: '#BFDBFE',
                                    paddingHorizontal: normalize(8),
                                    paddingVertical: normalize(3),
                                    borderRadius: normalize(6),
                                }}>
                                    <Text numberOfLines={1} style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 12,
                                        color: '#1D4ED8',
                                    }}>
                                        {conferenceTypeText}
                                    </Text>
                                </View>
                            ) : null}
                            {spanroute?.checkoutSpan?.cmeCreditsData?.length > 1 ? (
                                spanroute?.checkoutSpan?.cmeCreditsData?.map((d, index, array) => {
                                    const points = parseFloat(d?.points) || 0;
                                    const name = d?.name || "";
                                    const displayName = name.toLowerCase() == "contact hour" ? "Contact Hour(s)" : name;
                                    return (
                                        <View key={index} style={{
                                            backgroundColor: '#ECFDF5',
                                            borderWidth: 1,
                                            borderColor: '#A7F3D0',
                                            paddingHorizontal: normalize(8),
                                            paddingVertical: normalize(3),
                                            borderRadius: normalize(6),
                                        }}>
                                            <Text numberOfLines={1}>
                                                <Text style={{
                                                    fontFamily: Fonts.InterBold,
                                                    fontSize: 13,
                                                    color: '#059669',
                                                }}>
                                                    {`${points} `}
                                                </Text>
                                                <Text style={{
                                                    fontFamily: Fonts.InterMedium,
                                                    fontSize: 12,
                                                    color: '#065F46',
                                                }}>
                                                    {displayName}
                                                </Text>
                                            </Text>
                                        </View>
                                    );
                                })
                            ) : (spanroute?.inpersonSpanrole?.cmeCreditsData?.map((d, index, array) => {
                                const points = parseFloat(d?.points) || 0;
                                const name = d?.name || "";
                                const displayName = name.toLowerCase() == "contact hour" ? "Contact Hour(s)" : name;
                                return (
                                    <View key={index} style={{
                                        backgroundColor: '#ECFDF5',
                                        borderWidth: 1,
                                        borderColor: '#A7F3D0',
                                        paddingHorizontal: normalize(8),
                                        paddingVertical: normalize(3),
                                        borderRadius: normalize(6),
                                    }}>
                                        <Text numberOfLines={1}>
                                            <Text style={{
                                                fontFamily: Fonts.InterBold,
                                                fontSize: 13,
                                                color: '#059669',
                                            }}>
                                                {`${points} `}
                                            </Text>
                                            <Text style={{
                                                fontFamily: Fonts.InterMedium,
                                                fontSize: 12,
                                                color: '#065F46',
                                            }}>
                                                {displayName}
                                            </Text>
                                        </Text>
                                    </View>
                                );
                            }))}
                        </View>
                    )}


                {(spanroute?.checkoutSpan?.conferenceTypeText !== "Webcast" || spanroute?.inpersonSpanrole?.conferenceTypeText !== "Webcast") && (hasPriceContent || hasTicketList) ? (<>
                    <View style={{ height: 1, width: '100%', backgroundColor: '#BAE6FD', marginTop: normalize(12), marginBottom: normalize(8) }} />
                    {(hasPriceContent || (spanroute?.inPersonTicket?.tickets && displayedTickets?.length > 1)) ? (
                        <View style={{ paddingTop: normalize(4), paddingBottom: normalize(4), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View>
                                {(spanroute?.inPersonTicket?.tickets) ? (
                                    <View style={{ paddingVertical: normalize(2) }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterMedium,
                                                fontSize: 13,
                                                color: '#64748B'
                                            }}>
                                            {`Total (${totalcount} tickets)`}
                                        </Text>
                                    </View>
                                ) : null}
                                {(hasPriceContent && (spanroute?.checkoutSpan?.buttonType?.toLowerCase() === "register" &&
                                    spanroute?.checkoutSpan?.registered_allow === 1 || spanroute?.inpersonSpanrole?.buttonType?.toLowerCase() === "register" &&
                                    spanroute?.inpersonSpanrole?.registered_allow === 1)) ? (
                                    <View style={{ paddingVertical: normalize(2) }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterBold,
                                                fontSize: 18,
                                                color: Colorpath.ButtonColr,
                                            }}
                                        >
                                            {`US$${formatNumberWithCommas(formatPrice(feeAwareBaseAmount))}`}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                            {displayedTickets?.length > 1 && (
                                <TouchableOpacity
                                    onPress={handleToggleExpand}
                                    style={{
                                        height: normalize(28),
                                        width: normalize(28),
                                        borderRadius: normalize(14),
                                        backgroundColor: '#EFF6FF',
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <ArrowIcon
                                        name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                        color={"#1D4ED8"}
                                        size={20}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : null}
                    {hasPriceContent && hasTicketList && (
                        <View style={{ height: 1, width: '100%', backgroundColor: "#BAE6FD", marginVertical: normalize(8) }} />
                    )}
                    {displayedTickets?.length === 1 && (
                        <View style={{ paddingVertical: normalize(4) }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        flex: 1,
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 13.5,
                                        color: "#1E293B",
                                        paddingRight: normalize(8),
                                    }}
                                >
                                    {`${displayedTickets[0]?.description}`}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 14.5,
                                        color: "#0F172A",
                                    }}
                                >
                                    {`$${formatNumberWithCommas(formatPrice(displayedTickets[0]?.itemamt))}`}
                                </Text>
                            </View>
                        </View>
                    )}
                    {isExpanded && displayedTickets?.length > 0 && (
                        <View style={{ paddingVertical: normalize(4) }}>
                            {displayedTickets.map((ticket, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingVertical: normalize(4),
                                    }}
                                >
                                    <Text style={{
                                        flex: 1,
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 13.5,
                                        color: '#1E293B',
                                        paddingRight: normalize(8),
                                    }}>
                                        {`${ticket?.description}`}
                                    </Text>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14.5, color: "#0F172A" }}>
                                        {`$${formatNumberWithCommas(formatPrice(ticket?.itemamt))}`}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </>) : null}

            </View> : null}

            {allPickersAreFalse && !spanroute?.cartData && (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#F0F9FF',
                    borderRadius: normalize(8),
                    borderWidth: 1,
                    borderColor: '#BAE6FD',
                    paddingHorizontal: normalize(12),
                    paddingVertical: normalize(10),
                    marginHorizontal: normalize(10),
                    marginTop: normalize(4),
                    marginBottom: normalize(6),
                }}>
                    <Image source={Imagepath.Info} style={{ height: normalize(16), width: normalize(16), resizeMode: "contain", marginRight: normalize(8) }} />
                    <Text style={{
                        flex: 1,
                        fontFamily: Fonts.InterRegular,
                        fontSize: 12.5,
                        lineHeight: 18,
                        color: "#0369A1",
                    }}>
                        {"Please fill in the registrant information, mailing address, and billing information and proceed to complete the payment."}
                    </Text>
                </View>
            )}
            {allPickersAreFalse && (spanroute?.checkoutSpan?.conferenceTypeText == "Webcast" || spanroute?.inpersonSpanrole?.conferenceTypeText == "Webcast") ? <View style={{ paddingHorizontal: normalize(12), paddingTop: normalize(8), paddingBottom: normalize(4) }}>
                <Text
                    style={{
                        fontFamily: Fonts.InterSemiBold,
                        fontSize: 15,
                        color: '#0F172A',
                    }}>
                    {"Primary Registrant Information"}
                </Text>
            </View> : null}
            <CheckoutInputbox
                markPersonalizationEdited={markPersonalizationEdited}
                handleInputChanged={handleInputChange}
                isEmailTouched={isEmailTouched}
                setIsEmailTouched={setIsEmailTouched}
                isCellNoTouched={isCellNoTouched}
                setIsCellNoTouched={setIsCellNoTouched}
                setAllmsg={setAllmsg}
                allmsg={allmsg}
                setProfindex={setProfindex}
                profindex={profindex}
                handleProfession={handleProfession}
                countrypickerprof={countrypickerprof}
                setcountrypickerprof={setcountrypickerprof}
                errorFlags={errorFlags}
                handlecityShows={handlecityShows}
                handleStateshows={handleStateshows}
                handleCountrySet={handleCountrySet}
                cityAll={cityAll}
                slistpratice={slistpratice}
                countryall={countryall}
                handleInputChangeeamilad={handleInputChangeeamilad}
                countrypicker={countrypicker}
                removeSpeciality={removeSpeciality}
                selectedSpecialities={selectedSpecialities}
                setSelectedSpecialities={setSelectedSpecialities}
                handleSpecialitySelect={handleSpecialitySelect}
                formData={formData}
                setFormData={setFormData}
                activeIndexc={activeIndexc}
                activeIndexct={activeIndexct}
                activeIndexs={activeIndexs}
                setActiveIndexc={setActiveIndexc}
                setActiveindexs={setActiveindexs}
                setActiveIndexct={setActiveIndexct}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                setSearchState={setSearchState}
                searchState={searchState}
                searchStateName={searchStateName}
                slist={slist}
                speciality_id={speciality_id}
                setSpeciality={setSpeciality}
                setSpeciality_id={setSpeciality_id}
                speciality={speciality}
                statepicker={statepicker}
                totalQuantity={totalcount}
                spanroute={spanroute}
                searchpratice={searchpratice}
                firstname={firstname}
                setFirstname={setFirstname}
                lastname={lastname}
                setLastname={setLastname}
                emailad={emailad}
                setEmailad={setEmailad}
                country_id={country_id}
                state_id={state_id}
                city_id={city_id}
                pratice={pratice}
                cityPicker={cityPicker}
                searchpraticelic={searchpraticelic}
                licstatepratice={licstatepratice}
                setLicstatepratice={setLicstatepratice}
                activeIndexslic={activeIndexslic}
                slistpraticelic={slistpraticelic}
                license_expiry_date={license_expiry_date}
                setLicense_expiry_date={setLicense_expiry_date}
                license_state_id={license_state_id}
                setLicense_state_id={setLicense_state_id}
                license_number={license_number}
                setLicense_number={setLicense_number}
                handleLicStateshows={handleLicStateshows}
                setActiveIndexslic={setActiveIndexslic}
                medicallics={medicallics}
                setMedicallics={setMedicallics}
                opendatelicyall={opendatelicyall}
                setOpendatelicyall={setOpendatelicyall}
                dateindex={dateindex}
                setDateindex={setDateindex}
                errors={errors}
                setErrors={setErrors}
                customFields={customFields}
                setCustomFields={setCustomFields}
                customFieldsLabels={customFieldsLabels}
                setCustomFieldsLabels={setCustomFieldsLabels}
                dialcode={dialcode}
                SetDialcode={SetDialcode}
                setDateofbirth={setDateofbirth}
                dateofbirth={dateofbirth}
                dobindex={dobindex}
                setDobindex={setDobindex}
                setDobchoose={setDobchoose}
                dobchoose={dobchoose}
                isGuestCheckout={isGuestCheckout}
                iseMededDo={iseMededDo}
                professionad={professionad} setProfessionad={setProfessionad} setstatepicker={setstatepicker} allProfession={allProfession} specaillized={specaillized} npino={npino} setNpino={setNpino} address={address} setAddress={setAddress} ticketSave={ticketSave} setCountrypicker={setCountrypicker} countryReq={countryReq} country={country} PraticingState={PraticingState} setPratice={setPratice} state={state} setCityPicker={setCityPicker} cityReq={cityReq} city={city} zipcode={zipcode} setZipcode={setZipcode} cellno={cellno} setCellno={setCellno} />

            {
                !spanroute?.cartData &&
                    (spanroute?.finalTicket?.tickets || spanroute?.inPersonTicket?.tickets) &&
                    (spanroute?.finalTicket?.tickets?.some(ticket => ticket?.ticket_type == "Paid") ||
                        spanroute?.inPersonTicket?.tickets?.some(ticket => ticket?.ticket_type == "Paid")) ? (
                    <View style={{ paddingHorizontal: normalize(12), paddingTop: normalize(10), paddingBottom: normalize(4) }}>
                        <Text
                            style={{
                                fontFamily: Fonts.InterSemiBold,
                                fontSize: 15,
                                color: '#0F172A',
                            }}>
                            {"Billing Information"}
                        </Text>
                    </View>
                ) : null
            }

            {
                allPickersAreFalse &&
                    !spanroute?.cartData &&
                    (spanroute?.finalTicket?.tickets || spanroute?.inPersonTicket?.tickets) &&
                    (spanroute?.finalTicket?.tickets?.some(ticket => ticket?.ticket_type == "Paid") ||
                        spanroute?.inPersonTicket?.tickets?.some(ticket => ticket?.ticket_type == "Paid")) ? (
                    <View style={{ flexDirection: "row", alignItems: 'center', paddingHorizontal: normalize(12), paddingVertical: normalize(6) }}>
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: Colorpath.ButtonColr,
                            borderColor: Colorpath.ButtonColr,
                            height: normalize(18),
                            width: normalize(18),
                            borderRadius: normalize(5),
                            borderWidth: normalize(0.5),
                            marginRight: normalize(8),
                        }}>
                            <TickMark name="checkmark" color={Colorpath.white} size={14} />
                        </View>
                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 13.5, color: "#475569" }}>
                            {"Same as primary registrant information"}
                        </Text>
                    </View>
                ) : null
            }

            {iseMededDo ? (
                <View style={{ flexDirection: "row", alignItems: 'flex-start', paddingHorizontal: normalize(12), paddingVertical: normalize(8) }}>
                    <TouchableOpacity onPress={() => { setChecked(!checked) }} style={{ marginRight: normalize(8), marginTop: normalize(2) }}>
                        {!checked ? (
                            <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colorpath.ButtonColr, borderColor: Colorpath.ButtonColr, height: normalize(18), width: normalize(18), borderRadius: normalize(5), borderWidth: normalize(0.5) }}>
                                <TickMark name="checkmark" color={Colorpath.white} size={14} />
                            </View>
                        ) : (
                            <View style={{ borderColor: "#94A3B8", height: normalize(18), width: normalize(18), borderRadius: normalize(5), borderWidth: 1 }} />
                        )}
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 13, lineHeight: 18, color: "#475569" }}>
                            {"I authorize reporting my credits to ACCME and the State Medical Board."}
                        </Text>
                    </View>
                </View>
            ) : null}
            {(ticketSave?.discounts == true && !spanroute?.inPersonTicket) ? (<>
                <View style={{ flexDirection: "column", paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <View style={{ paddingHorizontal: normalize(0), paddingBottom: normalize(8) }}>
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#334155" }}>{"Apply Coupon"}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: "#CBD5E1",
                        borderRadius: normalize(10),
                        backgroundColor: '#FFFFFF',
                        overflow: 'hidden',
                        height: normalize(44),
                    }}>
                        <TextInput
                            maxLength={30}
                            value={couponapp}
                            placeholder='Enter Coupon'
                            placeholderTextColor={"#94A3B8"}
                            onChangeText={(val) => { setCouponapp(val) }}
                            keyboardType="visible-password"
                            style={{
                                flex: 1,
                                height: normalize(44),
                                paddingHorizontal: normalize(12),
                                color: "#0F172A",
                                fontFamily: Fonts.InterMedium,
                                fontSize: 14,
                                textTransform: "uppercase"
                            }}
                            editable={!notadded}
                        />
                        <View style={{ height: normalize(44), width: normalize(95) }}>
                            {!notadded ? (
                                <TouchableOpacity
                                    style={{
                                        height: normalize(44),
                                        width: normalize(95),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: !couponapp ? "#E2E8F0" : Colorpath.ButtonColr
                                    }}
                                    disabled={!couponapp}
                                    onPress={() => {
                                        applyCoupon();
                                        setNotadded(true);
                                    }}
                                >
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: !couponapp ? "#94A3B8" : '#FFFFFF' }}>
                                        {"Apply"}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={{
                                        height: normalize(44),
                                        width: normalize(95),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: "#EF4444"
                                    }}
                                    onPress={() => {
                                        setCouponapp("");
                                        setCodesave("");
                                        setSavefull("")
                                        setNotadded(false);
                                    }}
                                >
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: '#FFFFFF' }}>
                                        {"Remove"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
                {codesave && (
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(4) }}>
                        <Text style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 13,
                            color: codesave == "Successfully applied." ? '#16A34A' : "#DC2626"
                        }}>
                            {codesave}
                        </Text>
                    </View>
                )}
                <View style={{
                    backgroundColor: '#F0F7FF',
                    borderRadius: normalize(12),
                    borderWidth: 1,
                    borderColor: '#BAE6FD',
                    padding: normalize(14),
                    marginHorizontal: normalize(10),
                    marginVertical: normalize(8),
                }}>
                    <Text style={{
                        fontFamily: Fonts.InterSemiBold,
                        fontSize: 15,
                        color: "#0F172A",
                        marginBottom: normalize(8),
                    }}>
                        {"Order Summary"}
                    </Text>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: '100%',
                        paddingVertical: normalize(4)
                    }}>
                        <Text style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 14,
                            color: "#475569",
                        }}>
                            {ticketSave?.tickets?.[0]?.ticket_name}
                        </Text>
                        <Text style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 14,
                            color: "#0F172A",
                        }}>
                            {savefull?.discount_value ? `US$${savefull?.gross_value}` : `US$${ticketSave?.tickets?.[0]?.itemamt}`}
                        </Text>
                    </View>
                    {savefull?.discount_value ? (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%', paddingVertical: normalize(4) }}>
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#16A34A" }}>
                                {"Discount (-)"}
                            </Text>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#16A34A" }}>
                                {`US$${savefull?.discount_value}`}
                            </Text>
                        </View>
                    ) : null}
                    <View style={{ marginVertical: normalize(8), height: 1, width: '100%', backgroundColor: "#E2E8F0" }} />
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: '100%',
                        paddingVertical: normalize(2)
                    }}>
                        <Text style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 16,
                            color: "#0F172A",
                        }}>
                            {"Total Amount"}
                        </Text>
                        <Text style={{
                            fontFamily: Fonts.InterBold,
                            fontSize: 18,
                            color: Colorpath.ButtonColr,
                        }}>
                            {`US$${formatNumberWithCommas(formatPrice(feeAwareBaseAmount))}`}
                        </Text>
                    </View>
                </View>

            </>) : null}
            {allPickersAreFalse ? (
                <View style={{ paddingHorizontal: normalize(10), marginTop: normalize(14), marginBottom: normalize(10) }}>
                    <Buttons
                        onPress={() => {
                            if (spanroute?.cartData) {
                                cartPayment();
                                setPaymentcardfree(false);
                                setPaymentfdfree(false);
                            } else {
                                setPaymentcardfree(false);
                                setPaymentfdfree(false);
                                proceedPayment(ticketSave);
                            }
                        }}
                        height={normalize(46)}
                        width={'100%'}
                        backgroundColor={isDisabled ? "#DADADA" : Colorpath.ButtonColr}
                        borderRadius={normalize(10)}
                        text="Proceed"
                        color={Colorpath.white}
                        fontSize={16}
                        fontFamily={Fonts.InterSemiBold}
                        disabled={isDisabled}
                    />
                </View>
            ) : null}

        </ScrollView>
    )
}

/**
 * Checkout main default export.
 *
 * @returns {*}
 */
export default CheckoutMain
