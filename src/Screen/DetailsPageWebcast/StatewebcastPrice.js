import { View, Text, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Imagepath from '../../Themes/Imagepath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Buttons from '../../Components/Button';
import moment from 'moment';
import CalIcon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { FormatDateZone } from '../../Utils/Helpers/Timezone';
import { saveTicketRequest } from '../../Redux/Reducers/WebcastReducer';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { useDispatch, useSelector } from 'react-redux';
let status3 = "";
const StatewebcastPrice = ({ nav, webcastdeatils, ratingsall, scrollToReviews, calculatePrice }) => {
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const dispatch = useDispatch();
    const handleTickets = () => {
        if (webcastdeatils?.registrationTickets?.length > 0) {
            const checkoutSpan = webcastdeatils?.conferenceId;
            let obj = {
                "conference_id": checkoutSpan,
                "tickets": webcastdeatils?.registrationTickets?.map(ticket => ({
                    "id": ticket?.id,
                    "quantity": 1
                }))
            };
            connectionrequest()
                .then(() => {
                    dispatch(saveTicketRequest(obj));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }
    const formatNumberWithCommas = (value) => {
        if (value == null || value == undefined) return '';
        const stringValue = value.toString().replace(/,/g, '');
        const parts = stringValue.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };
    function formatPrice(price) {
        let num = parseFloat(price);
        if (isNaN(num)) {
            return price;
        }
        let truncated = Math.floor(num * 100) / 100;

        return truncated % 1 == 0 ? truncated.toString() : truncated.toFixed(2);
    }
    let requiredStyle = webcastdeatils?.buttonType &&
        webcastdeatils?.buttonType?.toLowerCase() === "register" &&
        webcastdeatils?.registered_allow === 1 && webcastdeatils?.conference_active !== 0 && !webcastdeatils?.bundle_conf_taken_msg;
    if (status3 == '' || WebcastReducer.status != status3) {
        switch (WebcastReducer.status) {
            case 'WebCast/saveTicketRequest':
                status3 = WebcastReducer.status;
                break;
            case 'WebCast/saveTicketSuccess':
                status3 = WebcastReducer.status;
                nav.navigate("InPersonStatewebcast", { realData: { realData: webcastdeatils, ticketall: WebcastReducer?.saveTicketResponse?.tickets } });
                break;
            case 'WebCast/saveTicketFailure':
                status3 = WebcastReducer.status;
                break;
        }
    }
    const renderCmeCredits = () => {
        const credits = webcastdeatils?.cmeCreditsData;

        if (Array.isArray(credits) && credits.length > 0) {
            return (
                <Text
                    style={{
                        fontFamily: Fonts.InterMedium,
                        fontSize: 16,
                        color: '#000000',
                        marginLeft: normalize(7),
                        marginTop: normalize(6),
                    }}
                >
                    {credits
                        .map(item => {
                            const points = +(item?.points) || 0;
                            const name = item?.name || "";

                            // Check for "Contact Hour" and apply special formatting
                            if (name.toLowerCase() == "contact hour") {
                                return `${points} Contact Hour(s)`;
                            }

                            // Default formatting
                            return `${points} ${name}`;
                        })
                        .join(" | ")}
                </Text>
            );
        }
        return null;
    };

    return (
        <View>
            {webcastdeatils?.conferenceTypeText ?
                <View style={{
                    paddingHorizontal: normalize(10),
                    marginTop: normalize(10),
                }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 12,
                            color: '#000000',
                            backgroundColor: "#FFCE96",
                            borderRadius: normalize(5),
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(4),
                            alignSelf: 'flex-start',
                            textTransform: "uppercase"
                        }}>
                        {webcastdeatils?.conferenceTypeText}
                    </Text>
                </View>
                : null}
            <View
                style={{
                    paddingHorizontal: normalize(10),
                    marginTop: normalize(5)
                }}>
                <Text
                    style={{
                        fontFamily: Fonts.InterRegular,
                        fontSize: 24,
                        color: '#000000',
                        fontWeight: 'bold',
                    }}>
                    {webcastdeatils?.title}
                </Text>
            </View>
            <View
                style={{
                    paddingHorizontal: normalize(10),
                    paddingVertical: normalize(10),
                }}>
                <Text numberOfLines={2}
                    style={{
                        fontFamily: Fonts.InterRegular,
                        fontSize: 14,
                        color: '#000000',
                    }}>
                    {`Course by ${webcastdeatils?.organizerName}`}
                </Text>
            </View>

            {ratingsall?.totalRatingsCount !== 0 ? <View
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: normalize(0),
                    paddingVertical: normalize(0),
                }}>
                {/* <Image
                    source={Imagepath.Star}
                    style={{
                        height: normalize(13),
                        width: normalize(13),
                        resizeMode: 'contain',
                        top: -1
                    }}
                /> */}
                <Text
                    style={{
                        fontFamily: Fonts.InterSemiBold,
                        fontSize: 18,
                        color: '#333',
                        marginLeft: normalize(10),
                        lineHeight: normalize(15), // Match star height
                        height: normalize(15)
                    }}>
                    {`${(webcastdeatils?.conferenceAverageRating) || (ratingsall?.totalAverageRating.toFixed(1))}`}
                </Text>
                <TouchableOpacity onPress={scrollToReviews}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 16,
                            color: Colorpath.ButtonColr,
                            marginLeft: normalize(5),
                            lineHeight: normalize(14),
                        }}>
                        ({(`${ratingsall?.totalRatingsCount} ratings`)})
                    </Text>
                </TouchableOpacity>
            </View> : null}
            {webcastdeatils?.conferenceTypeText !== "Webcast" && webcastdeatils?.startdate && webcastdeatils?.enddate ? <View
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: normalize(4),
                    paddingVertical: webcastdeatils?.location ? normalize(0) : normalize(5)

                }}>
                {/* <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: normalize(30),
                        width: normalize(30),
                        borderRadius: normalize(40),
                        backgroundColor: '#FFFFFF',
                        shadowColor: '#000',
                        shadowOffset: { height: 2, width: 0 },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 5,
                        alignSelf: "center"
                    }}>
                    <CalIcon size={22} color={"#666"} name="calendar" />
                </View> */}

                <Text
                    style={{
                        fontFamily: Fonts.InterMedium,
                        fontSize: 16,
                        color: '#000000',
                        marginLeft: normalize(6),
                        marginTop: normalize(6),
                    }}>
                    {`${FormatDateZone(webcastdeatils?.startdate, webcastdeatils?.enddate)}`}
                </Text>
            </View> : null}
            {(webcastdeatils?.location == "" || !webcastdeatils?.conferenceTypeText) ? null : <View
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: normalize(3),
                    paddingVertical: normalize(3),

                }}>
                {/* <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: normalize(30),
                        width: normalize(30),
                        borderRadius: normalize(40),
                        backgroundColor: '#FFFFFF',
                        shadowColor: '#000',
                        shadowOffset: { height: 2, width: 0 },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 5,
                    }}>
                    {webcastdeatils?.conferenceTypeText !== "Webcast" ? <Image source={Imagepath.MapPin} style={{ height: normalize(22), width: normalize(22), resizeMode: "contain", tintColor: "#666" }} /> : null}
                </View> */}

                <Text
                    style={{
                        fontFamily: Fonts.InterMedium,
                        fontSize: 16,
                        color: '#000000',
                        marginLeft: normalize(6),
                        marginTop: normalize(6),
                    }}>
                    {webcastdeatils?.location ? webcastdeatils?.location : webcastdeatils?.location}
                </Text>
            </View>}
            {webcastdeatils?.cmeCreditsData?.length > 0 ? <View
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: normalize(3),
                    paddingVertical: 0,
                }}>
                {/* <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: normalize(30),
                        width: normalize(30),
                        borderRadius: normalize(40),
                        backgroundColor: '#FFFFFF',
                        shadowColor: '#000',
                        shadowOffset: { height: 2, width: 0 },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 5,
                    }}>
                    <Image
                        source={Imagepath.CreditValut}
                        style={{
                            height: normalize(21),
                            width: normalize(21),
                            tintColor: '#666',
                            resizeMode: 'contain',
                        }}
                    />
                </View> */}
                {Array.isArray(webcastdeatils?.cmeCreditsData) && webcastdeatils.cmeCreditsData.length > 1 ? (
                    <View>
                        {renderCmeCredits()}
                    </View>
                ) : (
                    <View>
                        <Text
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 16,
                                color: '#000000',
                                marginLeft: normalize(7),
                                marginTop: normalize(6),
                            }}>
                            {`${+(webcastdeatils?.cmeCreditsData?.[0]?.points || 0)} ${webcastdeatils?.cmeCreditsData?.[0]?.name &&
                                webcastdeatils?.cmeCreditsData?.[0]?.name?.toLowerCase() == "contact hour"
                                ? "Contact Hour(s)"
                                : webcastdeatils?.cmeCreditsData?.[0]?.name || ""
                                }`}
                        </Text>
                    </View>
                )}
            </View> : null}
            {/* <Modal
                animationIn={'slideInUp'}
                animationOut={'slideOutDown'}
                isVisible={tooltip}
                backdropColor="rgba(0, 0, 0, 0.5)"
                onBackdropPress={() => setTootip(false)}>
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    borderRadius: normalize(10),
                    padding: normalize(5),
                    marginRight: normalize(150),
                    marginBottom: normalize(280),
                    left: normalize(160)
                }}>
                    {webcastdeatils?.cmeCreditsData?.length > 1 ? (
                        webcastdeatils?.cmeCreditsData?.slice(1).map((d, index) => (
                            <Text
                                key={index}
                                style={{ alignSelf: "center", fontFamily: Fonts.InterMedium, fontSize: 12, color: "#000", textAlign: "center" }}
                            >
                                {`${+(d?.points)} ${d?.name}`}
                            </Text>
                        ))
                    ) : null}
                </View>
            </Modal> */}
            {webcastdeatils?.buttonType &&
                webcastdeatils?.buttonType?.toLowerCase() === "register" &&
                webcastdeatils?.registered_allow === 1 && webcastdeatils?.conference_active != 0 && !webcastdeatils?.bundle_conf_taken_msg ? (
                <View
                    style={{
                        paddingHorizontal: normalize(7),
                        paddingVertical: normalize(10),
                    }}>
                    {webcastdeatils?.registrationTickets?.length > 0 && <Text
                        style={{
                            fontFamily: Fonts.InterBold,
                            fontSize: 24,
                            color: '#000000',
                            fontWeight: 'bold',
                        }}>
                        {` ${webcastdeatils?.currency_code || "US$"}${formatNumberWithCommas(formatPrice(calculatePrice || "0"))}`}
                    </Text>}
                </View>
            ) : null}
            {webcastdeatils?.registered_allow == 1 &&
                webcastdeatils?.conference_active == 1 &&
                (webcastdeatils?.conferenceTypeText == "In-Person Event" ||
                    webcastdeatils?.conferenceTypeText == "Hybrid Event" ||
                    webcastdeatils?.conferenceTypeText == "Live Webinar") && (
                    <View style={{ marginTop: !requiredStyle ? normalize(10) : 0 }}>
                        <Buttons
                            onPress={() => {
                                handleTickets();
                            }}
                            height={normalize(45)}
                            width={normalize(286)}
                            backgroundColor={Colorpath.ButtonColr}
                            borderRadius={normalize(9)}
                            text={"Register"}
                            color={Colorpath.white}
                            fontSize={16}
                            fontFamily={Fonts.InterSemiBold}
                        //   marginTop={normalize(30)}
                        />
                    </View>
                )}


        </View>
    )
}

export default StatewebcastPrice