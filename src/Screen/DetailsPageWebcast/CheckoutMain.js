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
// import { useSelector } from 'react-redux';
const CheckoutMain = ({
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
    setActiveIndexct, pratice, cityPicker, city_id, state_id, country_id, countrypicker, speciality_id, selectedSpecialities, removeSpeciality, setSelectedSpecialities, handleSpecialitySelect, formData, setFormData, activeIndex, setActiveIndex, setSearchState, searchState, searchStateName, slist, setSpeciality, setSpeciality_id, statepicker, cartPayment, proceedPayment, fullAccess, spanroute, ticketSave, firstname, setFirstname, lastname, setLastname, emailad, setEmailad, professionad, setProfessionad, setstatepicker, allProfession, specaillized, speciality, npino, setNpino, address, setAddress, setCountrypicker, countryReq, country, PraticingState, setPratice, state, setCityPicker, cityReq, city, zipcode, setZipcode, cellno, setCellno }) => {
    console.log(spanroute, statepicker, ticketSave, "spanroute=========", country_id, fullAccess, spanroute?.checkoutSpan?.cmeCreditsData);
    const [totalcount, setTotalcount] = useState("");
    const [checked, setChecked] = useState(false);
    const [formDate, setFormDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const allPickersAreFalse = !licstatepratice && !statepicker && !countrypicker && !pratice && !cityPicker && !countrypickerprof;
    const [isExpanded, setIsExpanded] = useState(false); // State to control the collapse/expand
    const [displayedTickets, setDisplayedTickets] = useState(spanroute?.inPersonTicket?.tickets || []); // Track tickets to display
    const formatNumberWithCommas = (value) => {
        if (value == null || value == undefined) return '';
        const stringValue = value.toString().replace(/,/g, '');
        const parts = stringValue.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };
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
    const points1 = spanroute?.checkoutSpan?.cmeCreditsData[0]?.points || spanroute?.inpersonSpanrole?.cmeCreditsData[0]?.points;
    const points2 = spanroute?.checkoutSpan?.cmeCreditsData[1]?.points || spanroute?.inpersonSpanrole?.cmeCreditsData[1]?.points;
    const name1 = spanroute?.checkoutSpan?.cmeCreditsData[0]?.name || spanroute?.inpersonSpanrole?.cmeCreditsData[0]?.name;
    const name2 = spanroute?.checkoutSpan?.cmeCreditsData[1]?.name || spanroute?.inpersonSpanrole?.cmeCreditsData[1]?.name;
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
            totalQuantity += spanroute.inPersonTicket.tickets.reduce((total, ticket) => total + ticket.quantity, 0);
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
        if (spanroute?.inpersonSpanrole) {
            const formatDate = (dateStr) => {
                const date = moment(dateStr, "DD MMM'YY");
                return date.format("MMM  D").replace(' ', '');
            };
            const formattedDate = formatDate(spanroute?.inpersonSpanrole?.startdate);
            const formatDateEnd = (dateStr) => {
                console.log(dateStr, "datestr-------");
                const date = moment(dateStr, "DMMM,YYYY");
                return date.format("MMM D, YYYY");
            };
            const formattedDateend = formatDateEnd(spanroute?.inpersonSpanrole?.enddate);
            setFormDate(formattedDate);
            setEndDate(formattedDateend);
        }
    }, [spanroute?.inpersonSpanrole])
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
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: normalize(70) }}>
            {spanroute?.cartData && allPickersAreFalse ? <View style={{
                backgroundColor: Colorpath.Pagebg
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <View style={{
                        height: normalize(70),
                        width: normalize(70),
                        backgroundColor: '#e9f5f9',
                        borderRadius: normalize(35),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: normalize(10),
                    }}>
                        <Image
                            source={Imagepath.CartPng}
                            style={{
                                height: normalize(40),
                                width: normalize(40),
                                resizeMode: "contain"
                            }}

                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: "#FF773D", fontWeight: "bold" }}>{`Total Fee: US$${spanroute?.cartData?.total_paid_amount}`}</Text>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ paddingHorizontal: normalize(3), paddingVertical: normalize(5), fontFamily: Fonts.InterBold, fontSize: 14, color: "#333" }}>{`Total Courses: `}</Text>
                            <Text style={{ paddingVertical: normalize(5), fontFamily: Fonts.InterBold, fontSize: 14, color: "#FF773D" }}>{`${spanroute?.cartData?.total_qty}`}</Text>
                        </View>
                    </View>
                </View>
            </View> : null}
            {(spanroute?.checkoutSpan || spanroute?.inpersonSpanrole) && allPickersAreFalse ? <View style={{ backgroundColor: Colorpath.Pagebg }}>
                <View
                    style={{
                        paddingHorizontal: normalize(7),
                        paddingVertical: normalize(3),
                    }}>
                    <Text numberOfLines={2}
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 18,
                            color: '#000000',
                            fontWeight: 'bold',
                            textTransform: "capitalize"
                        }}>
                        {spanroute?.checkoutSpan?.title || spanroute?.inpersonSpanrole?.title}
                    </Text>
                </View>

                <View
                    style={{
                        paddingHorizontal: normalize(7), paddingVertical: normalize(5)
                    }}>
                    <Text numberOfLines={1}
                        style={{
                            fontFamily: Fonts.InterRegular,
                            fontSize: 14,
                            color: '#000000',
                            textTransform: "capitalize"
                        }}>
                        {`${spanroute?.checkoutSpan?.organizerName || spanroute?.inpersonSpanrole?.organizerName}`}
                    </Text>
                </View>
                {spanroute?.inpersonSpanrole?.startdate ? <View
                    style={{
                        paddingVertical: normalize(3)
                    }}>
                    <Text numberOfLines={1}
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: '#000000',
                            paddingHorizontal: normalize(7),
                        }}>
                        {spanroute?.inpersonSpanrole?.startdate ? `${formDate} - ${endDate}` : null}
                    </Text>
                </View> : null}
                {spanroute?.inpersonSpanrole?.location ? <View
                    style={{
                        paddingVertical: normalize(5)
                    }}>
                    <Text numberOfLines={1}
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: '#000000',
                            paddingHorizontal: normalize(7),
                        }}>
                        {`${spanroute?.inpersonSpanrole?.location}`}
                    </Text>
                </View> : null}

                {((conferenceTypeText || points1 || points2) && conferenceTypeText !== "Webcast" && conferenceTypeText !== "Text-Based CME") ?
                    (
                        <View style={{ flexDirection: 'row' }}>
                            <Text numberOfLines={1} style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 16,
                                color: '#000000',
                                paddingHorizontal: normalize(7),
                            }}>
                                {points1 ? `${+(points1)} ${name1}` : null}
                            </Text>
                        </View>
                    ) : (
                        <>
                            <View style={{ flexDirection: "column" }}>
                                <View style={{ paddingHorizontal: normalize(7), paddingVertical: normalize(3) }}>
                                    <Text numberOfLines={2} style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16,
                                        color: '#000000',
                                        width: normalize(120)
                                    }}>
                                        {conferenceTypeText ? `${conferenceTypeText}  ` : null}
                                    </Text>
                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    flexWrap: 'wrap',
                                    paddingHorizontal: normalize(7), paddingVertical: normalize(3)
                                }}>
                                    {spanroute?.checkoutSpan?.cmeCreditsData?.length > 1 ? (
                                        spanroute?.checkoutSpan?.cmeCreditsData?.map((d, index, array) => {
                                            const points = parseFloat(d?.points) || 0;
                                            const name = d?.name || "";

                                            // Special formatting for "Contact Hour"
                                            const displayName =
                                                name.toLowerCase() == "contact hour" ? "Contact Hour(s)" : name;

                                            return (
                                                <View key={index}>
                                                    <Text
                                                        numberOfLines={5}
                                                        style={{
                                                            fontFamily: Fonts.InterMedium,
                                                            fontSize: 16,
                                                            color: "#000000",
                                                            paddingVertical: normalize(0),
                                                        }}
                                                    >
                                                        {`${points} ${displayName}${index < array.length - 1 ? ', ' : ''}`}
                                                    </Text>
                                                </View>
                                            );
                                        })

                                    ) : (spanroute?.inpersonSpanrole?.cmeCreditsData?.map((d, index, array) => {
                                        const points = parseFloat(d?.points) || 0;
                                        const name = d?.name || "";

                                        // ✅ If the credit name is "Contact Hour", change it to "Contact Hour(s)"
                                        const displayName =
                                            name.toLowerCase() == "contact hour" ? "Contact Hour(s)" : name;

                                        return (
                                            <React.Fragment key={index}>
                                                <Text
                                                    numberOfLines={5}
                                                    style={{
                                                        fontFamily: Fonts.InterMedium,
                                                        fontSize: 16,
                                                        color: "#000000",
                                                        paddingVertical: normalize(5),
                                                        paddingHorizontal: normalize(8),
                                                    }}
                                                >
                                                    {`${points} ${displayName}${index < array.length - 1 ? ', ' : ''}`}
                                                </Text>
                                            </React.Fragment>
                                        );
                                    }))}
                                </View>
                            </View>
                        </>

                    )}


                {(spanroute?.checkoutSpan?.conferenceTypeText !== "Webcast" || spanroute?.inpersonSpanrole?.conferenceTypeText !== "Webcast") && <>
                    <View style={{ paddingVertical: normalize(10), flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }}>
                        <View>
                            {(spanroute?.inPersonTicket?.tickets) ? (
                                <View
                                    style={{
                                        paddingHorizontal: normalize(4),
                                        paddingVertical: normalize(5),
                                        // marginTop: normalize(10)
                                    }}>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterSemiBold,
                                            fontSize: 14,
                                            color: '#000000'
                                        }}>
                                        {` Total (${spanroute?.inPersonTicket?.tickets?.length} tickets)`}
                                    </Text>
                                </View>
                            ) : null}
                            {(spanroute?.checkoutSpan?.buttonType?.toLowerCase() === "register" &&
                                spanroute?.checkoutSpan?.registered_allow === 1 || spanroute?.inpersonSpanrole?.buttonType?.toLowerCase() === "register" &&
                                spanroute?.inpersonSpanrole?.registered_allow === 1) ? (
                                <View
                                    style={{
                                        paddingHorizontal: normalize(7),
                                        // paddingVertical: normalize(10),
                                    }}>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterBold,
                                            fontSize: 18,
                                            color: "#000000",
                                        }}
                                    >
                                        {spanroute?.totalTicketPrice != null
                                            ? spanroute.totalTicketPrice > 0
                                                ? `US$${formatNumberWithCommas(formatPrice(spanroute.totalTicketPrice))}`
                                                : null
                                            : ticketSave?.tickets[0]?.itemamt > 0
                                                ? `US$${formatNumberWithCommas(formatPrice(ticketSave.tickets[0].itemamt))}`
                                                : null}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                        {displayedTickets?.length > 1 && (
                            <TouchableOpacity
                                onPress={handleToggleExpand}
                                style={{
                                    height: normalize(30),
                                    width: normalize(30),
                                    borderRadius: normalize(30),
                                    borderColor: "#000000",
                                    borderWidth: 2,
                                    justifyContent: "center", // Center icon vertically
                                    alignItems: "center", // Center icon horizontally
                                    marginRight: normalize(10),
                                    marginTop: normalize(10),
                                }}
                            >
                                <ArrowIcon
                                    name={"keyboard-arrow-down"}
                                    style={{ alignSelf: "center" }}
                                    color={"#000000"}
                                    size={30}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(0) }}>
                        <View style={{ height: 0.5, width: normalize(300), backgroundColor: "#DADADA", alignSelf: "center" }} />
                    </View>
                    {displayedTickets?.length === 1 && (
                        <View
                            style={{
                                paddingHorizontal: normalize(10),
                                paddingVertical: normalize(10),
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 14,
                                        color: "#666666",
                                        width: normalize(235)
                                    }}
                                >
                                    {`${displayedTickets[0]?.description}`}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-evenly",
                                        alignContent: "space-evenly",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterSemiBold,
                                            fontSize: 14,
                                            color: "#000000",
                                        }}
                                    >
                                        {`$${formatNumberWithCommas(formatPrice(displayedTickets[0]?.itemamt))}`}
                                    </Text>
                                    {/* <TouchableOpacity
                                        style={{ marginLeft: normalize(10) }}
                                        onPress={() => handleSoftDelete(0)}
                                    >
                                        <ArrowIcon name="delete" color={"#000000"} size={24} />
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                        </View>
                    )}
                    {isExpanded && displayedTickets?.length > 0 && (
                        <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                            {displayedTickets.map((ticket, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: normalize(5),
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 14,
                                        color: '#666666',
                                        width: normalize(235)
                                    }}>
                                        {`${ticket?.description}`}
                                    </Text>

                                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignContent: "space-evenly" }}>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#000000" }}>{`$${formatNumberWithCommas(formatPrice(ticket?.itemamt))}`}</Text>
                                        {/* <TouchableOpacity style={{ marginLeft: normalize(10) }} onPress={() => handleSoftDelete(index)}>
                                            <ArrowIcon name="delete" color={"#000000"} size={24} />
                                        </TouchableOpacity> */}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </>}

            </View> : null}

            {allPickersAreFalse && !spanroute?.cartData && <View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: normalize(10),
                    paddingVertical: normalize(10)
                }}>
                    <TouchableOpacity onPress={() => { console.log("helo") }}>
                        <Image source={Imagepath.Info} style={{ height: normalize(18), width: normalize(18), resizeMode: "contain" }} />
                    </TouchableOpacity>
                    <Text style={Platform.OS === "ios" ? {
                        fontFamily: Fonts.InterMedium,
                        fontSize: 12,
                        color: "#333",
                        marginLeft: normalize(5),
                        width: normalize(270)
                    } : {
                        fontFamily: Fonts.InterMedium,
                        fontSize: 12,
                        color: "#333",
                        marginLeft: normalize(5),
                        width: normalize(290)
                    }}>
                        {"Please fill in the registrant information, mailing address, and billing information and proceed to complete the payment."}
                    </Text>
                </View>
            </View>}
            {allPickersAreFalse && (spanroute?.checkoutSpan?.conferenceTypeText == "Webcast" || spanroute?.inpersonSpanrole?.conferenceTypeText == "Webcast") ? <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                <Text
                    style={{
                        fontFamily: Fonts.InterMedium,
                        fontSize: 16,
                        color: '#333',
                        fontWeight: 'bold',
                    }}>
                    {"Primary Registrant Information"}
                </Text>
            </View> : null}
            <CheckoutInputbox
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
                iseMededDo={iseMededDo}
                professionad={professionad} setProfessionad={setProfessionad} setstatepicker={setstatepicker} allProfession={allProfession} specaillized={specaillized} npino={npino} setNpino={setNpino} address={address} setAddress={setAddress} ticketSave={ticketSave} setCountrypicker={setCountrypicker} countryReq={countryReq} country={country} PraticingState={PraticingState} setPratice={setPratice} state={state} setCityPicker={setCityPicker} cityReq={cityReq} city={city} zipcode={zipcode} setZipcode={setZipcode} cellno={cellno} setCellno={setCellno} />

            {
                !spanroute?.cartData &&
                    (spanroute?.finalTicket?.tickets || spanroute?.inPersonTicket?.tickets) &&
                    (spanroute?.finalTicket?.tickets?.some(ticket => ticket?.ticket_type == "Paid") ||
                        spanroute?.inPersonTicket?.tickets?.some(ticket => ticket?.ticket_type == "Paid")) ? (
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                        <Text
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 16,
                                color: '#333',
                                fontWeight: 'bold',
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
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flexDirection: "row", marginLeft: normalize(10), paddingVertical: normalize(5) }}>
                            <View>
                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: Colorpath.ButtonColr,
                                    borderColor: Colorpath.ButtonColr,
                                    height: normalize(17),
                                    width: normalize(17),
                                    borderRadius: normalize(5),
                                    borderWidth: normalize(0.5)
                                }}>
                                    <TickMark name="checkmark" color={Colorpath.white} size={17} />
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", paddingHorizontal: normalize(4) }}>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000000" }}>
                                    {"Same as primary registrant information"}
                                </Text>
                            </View>
                        </View>
                    </View>
                ) : null
            }

            {iseMededDo ? <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row", marginLeft: normalize(10), paddingVertical: normalize(5) }}>
                    <View>
                        <TouchableOpacity onPress={() => { setChecked(!checked) }}>
                            {!checked ? <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colorpath.ButtonColr, borderColor: Colorpath.ButtonColr, height: normalize(17), width: normalize(17), borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }}>
                                <TickMark name="checkmark" color={Colorpath.white} size={17} />
                            </View> :
                                <View style={{ borderColor: Colorpath.black, height: normalize(17), width: normalize(17), borderRadius: normalize(5), marginTop: normalize(5), borderWidth: normalize(0.5) }} />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", paddingHorizontal: normalize(4), width: normalize(280) }}>
                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000000", flexWrap: "wrap" }}>
                            {"I authorize reporting my credits to ACCME and the State Medical Board."}
                        </Text>
                    </View>
                </View>
            </View> : null}
            {(ticketSave?.discounts == true && !spanroute?.inPersonTicket) ? (<>
                <View style={{ flexDirection: "column", paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#666666" }}>{"Apply Coupon"}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: "#666", borderRadius: normalize(10), width: normalize(250), height: normalize(45) }}>
                        <TextInput
                            maxLength={30}
                            value={couponapp}
                            placeholder='Enter Coupon'
                            placeholderTextColor={"#666"}
                            onChangeText={(val) => { setCouponapp(val) }}
                            keyboardType="visible-password"
                            style={{ height: normalize(55), width: normalize(180), paddingLeft: normalize(10), color: "#8f8f8f", fontFamily: Fonts.InterMedium, fontSize: 16, textTransform: "uppercase" }}
                            editable={!notadded}
                        />
                        <View
                            style={{ height: normalize(45), width: normalize(120), justifyContent: 'center', alignItems: 'center', borderTopRightRadius: normalize(10), borderBottomRightRadius: normalize(10) }}
                        >
                            {!notadded ? (
                                <TouchableOpacity style={{ height: normalize(45), width: normalize(120), justifyContent: 'center', alignItems: 'center', borderTopRightRadius: normalize(10), borderBottomRightRadius: normalize(10), backgroundColor: !couponapp ? "#DADADA" : Colorpath.ButtonColr }} disabled={!couponapp} onPress={() => {
                                    applyCoupon();
                                    setNotadded(true);
                                }}>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: '#FFFFFF' }}>
                                        {"Apply"}
                                    </Text>
                                </TouchableOpacity>
                            ) :
                                (
                                    <TouchableOpacity style={{ height: normalize(45), width: normalize(120), justifyContent: 'center', alignItems: 'center', borderTopRightRadius: normalize(10), borderBottomRightRadius: normalize(10), backgroundColor: "#ff4d4f" }} onPress={() => {
                                        setCouponapp("");
                                        setCodesave("");
                                        setSavefull("")
                                        setNotadded(false);
                                    }}>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: '#FFFFFF' }}>
                                            {"Remove"}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                </View>
                {codesave && (
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                        <Text style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 14,
                            color: codesave == "Successfully applied." ? '#009E38' : "red"
                        }}>
                            {codesave}
                        </Text>
                    </View>
                )}
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
                            {ticketSave?.tickets?.[0]?.ticket_name}
                        </Text>
                        <Text style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 14,
                            color: Colorpath.black,
                            fontWeight: "bold"
                        }}>
                            {savefull?.discount_value ? `US$${savefull?.gross_value}` : `US$${ticketSave?.tickets?.[0]?.itemamt}`}
                        </Text>
                    </View>
                    {savefull?.discount_value ? (<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%', paddingVertical: normalize(5) }}>
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: Colorpath.black, fontWeight: "bold" }}>
                            {"Discount (-)"}
                        </Text>
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: Colorpath.black, fontWeight: "bold" }}>
                            {`US$${savefull?.discount_value}`}
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
                            {savefull?.discount_value ? `US$${savefull?.total_value}` : `US$${ticketSave?.tickets?.[0]?.itemamt}`}
                        </Text>
                    </View>
                </View>

            </>) : null}
            {allPickersAreFalse ? <Buttons
                onPress={() => {
                    if (spanroute?.cartData) {
                        cartPayment();
                        setPaymentcardfree(false);
                        setPaymentfdfree(false);
                    } else {
                        setPaymentcardfree(false);
                        setPaymentfdfree(false);
                        proceedPayment();
                    }
                }}
                height={normalize(45)}
                width={normalize(300)}
                backgroundColor={isDisabled ? "#DADADA" : Colorpath.ButtonColr}
                borderRadius={normalize(9)}
                text="Proceed"
                color={Colorpath.white}
                fontSize={18}
                fontFamily={Fonts.InterSemiBold}
                marginTop={normalize(10)}
                disabled={isDisabled}
            /> : null}

        </ScrollView>
    )
}

export default CheckoutMain
