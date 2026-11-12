/**
 * Statewebcast price screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status3, StatewebcastPrice, handleTickets, formatNumberWithCommas, formatPrice, renderCmeCredits.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { memo, useEffect } from 'react'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import CalIcon from 'react-native-vector-icons/Feather';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { FormatDateZone } from '../../Utils/Helpers/Timezone';
import { saveTicketRequest } from '../../Redux/Reducers/WebcastReducer';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Reusable StatewebcastPrice component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
let status3 = "";
/**
 * Statewebcast price component.
 * @param {Object} props - Input object.
 * @param {*} props.refID - Nested property value.
 * @param {*} props.nav - Nested property value.
 * @param {*} props.webcastdeatils - Nested property value.
 * @param {*} props.ratingsall - Nested property value.
 * @param {*} props.scrollToReviews - Nested property value.
 * @param {*} props.calculatePrice - Nested property value.
 * @returns {JSX.Element}
 */
const StatewebcastPrice = ({ refID, nav, webcastdeatils, ratingsall, scrollToReviews, calculatePrice }) => {
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const dispatch = useDispatch();
    /**
 * Handles tickets.
 * @returns {void}
 */
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

            if (refID) {
                obj["refer_params"] = refID;
            }

            connectionrequest()
                .then(() => {
                    dispatch(saveTicketRequest(obj));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err);
                });
        }
    };
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
    useEffect(() => {
        if (status3 === '' || WebcastReducer.status !== status3) {
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
    }, [WebcastReducer.status, WebcastReducer?.saveTicketResponse?.tickets, nav, webcastdeatils]);
    /**
 * Render cme credits utility.
 * @returns {*}
 */
    const renderCmeCredits = () => {
        const credits = webcastdeatils?.cmeCreditsData;

        if (Array.isArray(credits) && credits.length > 0) {
            return credits
                .map(item => {
                    const points = +(item?.points) || 0;
                    const name = item?.name || "";

                    if (name.toLowerCase() == "contact hour") {
                        return `${points} Contact Hour(s)`;
                    }

                    return `${points} ${name}`;
                })
                .join(" | ");
        }
        return "";
    };

    const creditsSummary = renderCmeCredits();
    const showDateRow = Boolean(
        webcastdeatils?.conferenceTypeText !== "Webcast" &&
        webcastdeatils?.startdate &&
        webcastdeatils?.enddate
    );
    const showLocationRow = Boolean(webcastdeatils?.location && webcastdeatils?.conferenceTypeText);
    const numericPrice = parseFloat(calculatePrice || "0") || 0;
    const avgRating = webcastdeatils?.conferenceAverageRating || Number(ratingsall?.totalAverageRating || 0).toFixed(1);

    return (
        <View style={styles.container}>
            <View style={styles.badgeRow}>
                {webcastdeatils?.conferenceTypeText ? (
                    <View style={styles.typePill}>
                        <Text style={styles.typePillText}>{webcastdeatils?.conferenceTypeText}</Text>
                    </View>
                ) : null}
                {numericPrice > 0 ? (
                    <View style={styles.priceBadge}>
                        <Text style={styles.priceBadgeText}>
                            {`${webcastdeatils?.currency_code || "US$"}${formatNumberWithCommas(formatPrice(numericPrice))}`}
                        </Text>
                    </View>
                ) : null}
            </View>

            <Text style={styles.titleText}>{webcastdeatils?.title}</Text>

            {webcastdeatils?.organizerName ? (
                <View style={styles.organizerRow}>
                    <CalIcon name="briefcase" size={14} color={Colorpath.ButtonColr} />
                    <Text numberOfLines={2} style={styles.organizerText}>
                        {`Course by ${webcastdeatils?.organizerName}`}
                    </Text>
                </View>
            ) : null}

            {ratingsall?.totalRatingsCount > 0 ? (
                <TouchableOpacity onPress={scrollToReviews} activeOpacity={0.75} style={styles.ratingPill}>
                    <AntIcon name="star" size={14} color="#F59E0B" />
                    <Text style={styles.ratingScore}>{avgRating}</Text>
                    <View style={styles.ratingDot} />
                    <Text style={styles.ratingCount}>{`${ratingsall?.totalRatingsCount} ratings`}</Text>
                    <CalIcon name="chevron-right" size={14} color={Colorpath.ButtonColr} />
                </TouchableOpacity>
            ) : null}

            {(showDateRow || showLocationRow || Boolean(creditsSummary)) ? (
                <View style={styles.metaCard}>
                    {showDateRow ? (
                        <View style={styles.metaRow}>
                            <View style={styles.metaIconBox}>
                                <CalIcon name="calendar" size={15} color={Colorpath.ButtonColr} />
                            </View>
                            <Text style={styles.metaText}>
                                {FormatDateZone(webcastdeatils?.startdate, webcastdeatils?.enddate)}
                            </Text>
                        </View>
                    ) : null}

                    {showLocationRow ? (
                        <View style={[styles.metaRow, showDateRow && styles.metaRowSpacing]}>
                            <View style={styles.metaIconBox}>
                                <CalIcon name="map-pin" size={15} color={Colorpath.ButtonColr} />
                            </View>
                            <Text style={styles.metaText}>{webcastdeatils?.location}</Text>
                        </View>
                    ) : null}

                    {creditsSummary ? (
                        <View style={[styles.metaRow, (showDateRow || showLocationRow) && styles.metaRowSpacing]}>
                            <View style={[styles.metaIconBox, styles.creditIconBox]}>
                                <CalIcon name="award" size={15} color="#0F766E" />
                            </View>
                            <Text style={styles.creditText}>{creditsSummary}</Text>
                        </View>
                    ) : null}
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: normalize(8),
        marginBottom: normalize(10),
    },
    typePill: {
        backgroundColor: '#FFF2DC',
        borderWidth: 1,
        borderColor: '#FFE0A8',
        borderRadius: normalize(6),
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(4),
    },
    typePillText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 11,
        color: '#92400E',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    priceBadge: {
        backgroundColor: '#EEF4FF',
        borderWidth: 1,
        borderColor: '#D6E4FF',
        borderRadius: normalize(6),
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(4),
    },
    priceBadgeText: {
        fontFamily: Fonts.InterBold,
        fontSize: 13,
        color: Colorpath.ButtonColr,
    },
    titleText: {
        fontFamily: Fonts.InterBold,
        fontSize: 20,
        lineHeight: 27,
        color: '#0F172A',
        fontWeight: 'bold',
    },
    organizerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalize(6),
        marginTop: normalize(8),
    },
    organizerText: {
        flex: 1,
        fontFamily: Fonts.InterMedium,
        fontSize: 13,
        lineHeight: 19,
        color: '#475569',
    },
    ratingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: normalize(5),
        marginTop: normalize(10),
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(5),
        borderRadius: normalize(20),
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    ratingScore: {
        fontFamily: Fonts.InterBold,
        fontSize: 13,
        color: '#1E293B',
    },
    ratingDot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: '#94A3B8',
    },
    ratingCount: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
        color: Colorpath.ButtonColr,
    },
    metaCard: {
        marginTop: normalize(12),
        backgroundColor: '#F8FAFD',
        borderRadius: normalize(12),
        borderWidth: 1,
        borderColor: '#E6EDF7',
        padding: normalize(12),
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalize(10),
    },
    metaRowSpacing: {
        marginTop: normalize(9),
        paddingTop: normalize(9),
        borderTopWidth: 1,
        borderTopColor: '#EDF2F7',
    },
    metaIconBox: {
        width: normalize(28),
        height: normalize(28),
        borderRadius: normalize(8),
        backgroundColor: '#EEF4FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    creditIconBox: {
        backgroundColor: '#E6FFFA',
    },
    metaText: {
        flex: 1,
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        lineHeight: 20,
        color: '#1E293B',
    },
    creditText: {
        flex: 1,
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        lineHeight: 20,
        color: '#0F766E',
    },
});

/**
 * Statewebcast price default export.
 *
 * @returns {*}
 */
export default memo(StatewebcastPrice)