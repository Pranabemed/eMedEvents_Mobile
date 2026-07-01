/**
 * State required reusable component module. Provides a React Native UI building block used across screens. Exported members: COURSE_CARD_WIDTH, COURSE_CARD_HEIGHT, COURSE_CARD_GAP, StateRequireditem, titlhandleUrl, formatDate, formatDateEnd, renderLocationAndDates, cmehit, styles.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import Fonts from '../Themes/Fonts';
import moment from 'moment';
import normalize from '../Utils/Helpers/Dimen';
import { FormatDateZone } from '../Utils/Helpers/Timezone';

/**
 * Reusable StateRequireditem component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const COURSE_CARD_WIDTH = normalize(230);
/**
 * Course card height constant.
 * @returns {*}
 */
const COURSE_CARD_HEIGHT = normalize(165);
/**
 * Course card gap constant.
 * @returns {*}
 */
const COURSE_CARD_GAP = normalize(4);

/**
 * State requireditem component.
 * @param {Object} props - Input object.
 * @param {*} props.allNoDetData - Nested property value.
 * @param {*} props.allProfTake - Nested property value.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @param {*} props.addit - Nested property value.
 * @param {*} props.navigation - Nested property value.
 * @returns {JSX.Element}
 */
const StateRequireditem = ({ allNoDetData, allProfTake, item, index, addit, navigation }) => {
        /**
 * Titlhandle url utility.
 * @param {*} make - Input value.
 * @returns {void}
 */
const titlhandleUrl = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = urltitle.split('/').pop();
        console.log(resulttitle, "webcast url=======", make, allNoDetData);
        if (resulttitle) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, shareUrl: urltitle, detailpage_url: urltitle, creditData: addit } })
        }
    }
        /**
 * Formats date.
 * @param {*} dateStr - Input value.
 * @returns {*}
 */
const formatDate = (dateStr) => {
        const date = moment(dateStr, "DD MMM'YY");
        return date.format("MMM  D").replace(' ', '');
    };
    const formattedDate = formatDate(item?.startdate);
        /**
 * Formats date end.
 * @param {*} dateStr - Input value.
 * @returns {*}
 */
const formatDateEnd = (dateStr) => {
        const date = moment(dateStr, "DD MMM'YY");
        return date.format("D, YYYY").replace('', '');
    };
    const formattedDateend = formatDateEnd(item?.enddate);
        /**
 * Render location and dates utility.
 * @returns {*}
 */
const renderLocationAndDates = () => {
        if (item?.startdate && item?.enddate) {
            return (
                <View style={{ flexDirection: "row" }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 14,
                            color: "#333",
                        }}
                    >
                        {`${formattedDate} - ${formattedDateend}`}
                    </Text>
                </View>
            );
        } else if (item?.startdate) {
            return (
                <View style={{ flexDirection: "row" }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 14,
                            color: "#333",
                        }}
                    >
                        {`${formattedDate}`}
                    </Text>
                </View>
            );
        } else if (item?.enddate) {
            return (
                <View style={{ flexDirection: "row" }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 14,
                            color: "#333",
                        }}
                    >
                        {`${formattedDateend}`}
                    </Text>
                </View>
            );
        }
        return null;
    };
        /**
 * Cmehit utility.
 * @returns {*}
 */
const cmehit = () => {
        if (allProfTake && item?.display_cme) {
            return (
                <View style={styles.cmeContainer}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.cmeText}
                    >
                        {item?.display_cme}
                    </Text>
                </View>
            )
        } else if (allNoDetData && item?.cme_points_popovar?.length > 0) {
            return (
                <View style={styles.cmeContainer}>
                    {item?.cme_points_popovar?.map((d, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.cmeText}
                            >
                                {`${parseFloat(d?.points) || 0} ${d?.name &&
                                    d?.name?.toLowerCase() == "contact hour"
                                    ? "Contact Hour(s)"
                                    : d?.name || ""
                                    }`}
                            </Text>
                        </View>
                    ))}
                </View>
            )
        } else if (item?.cme_points_popovar?.length > 0 && item?.display_cme) {
            return (
                <View style={[styles.cmeContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                    {/* Render CME points with commas */}
                    <View>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 14,
                                color: '#000000',
                                paddingVertical: normalize(0),
                                width: normalize(120),
                                fontWeight: "bold",
                            }}
                        >
                            {item?.display_cme}
                        </Text>
                    </View>

                    {/* Add vertical separator stick */}
                    <Text style={{
                        marginHorizontal: 8,
                        color: '#000000',
                        fontSize: 14
                    }}>|</Text>
                    {item.cme_points_popovar.map((d, index, array) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', width: normalize(50) }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 14,
                                    color: '#000000',
                                    paddingVertical: normalize(0),
                                    width: normalize(50),
                                    fontWeight: "bold",
                                }}
                            >
                                {`${parseFloat(d?.points) || 0} ${d?.name &&
                                    d?.name?.toLowerCase() == "contact hour"
                                    ? "Contact Hour(s)"
                                    : d?.name || ""
                                    }`}
                            </Text>
                        </View>
                    ))}
                    {/* Display CME text */}

                </View>
            );
        } else if (item.cme_points_popovar) {
            return (
                <View style={styles.cmeContainer}>
                    {
                        item.cme_points_popovar.map((d, index, array) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={styles.cmeText}
                                >
                                    {`${parseFloat(d?.points) || 0} ${d?.name &&
                                        d?.name?.toLowerCase() == "contact hour"
                                        ? "Contact Hour(s)"
                                        : d?.name || ""
                                        }`}
                                </Text>

                            </View>
                        ))
                    }
                </View>
            )

        } else if (item?.display_cme) {
            return (
                <View style={styles.cmeContainer}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.cmeText}
                    >
                        {`${item?.display_cme
                            ? item?.display_cme?.toLowerCase()?.includes("contact hour")
                                ? item?.display_cme.replace(/contact hour/i, "Contact Hour(s)")
                                : item?.display_cme
                            : ""
                            }`}
                    </Text>
                </View>
            )
        }
        return null;
    };

    return (
        <View style={styles.cardOuter}>
            <Pressable style={styles.card} onPress={() => titlhandleUrl(item)}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
                    {item?.title}
                </Text>
                <View style={styles.cardBody}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.subtitle}>
                        {item?.organization_name}
                    </Text>
                    {(item?.startdate !== null || item?.enddate !== null) ? <Text numberOfLines={1} ellipsizeMode="tail" style={styles.date}>
                        {FormatDateZone(item?.startdate, item?.enddate)}
                    </Text> : <View style={styles.datePlaceholder} />}
                    <View style={styles.infoRow}>
                        {cmehit()}
                    </View>
                </View>
                <View style={styles.bottomRow}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.freeText}>{item?.display_price == "FREE" ? `${item?.display_price}` : `${item?.display_currency_code}${item?.display_price}`}</Text>
                    <Pressable onPress={() => titlhandleUrl(item)}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.registerText}>{item?.buttonText}</Text>
                    </Pressable>
                </View>
            </Pressable>
        </View>
    );
};

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    cardOuter: {
        width: COURSE_CARD_WIDTH + (COURSE_CARD_GAP * 2),
        height: COURSE_CARD_HEIGHT + (COURSE_CARD_GAP * 2),
        margin: COURSE_CARD_GAP,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: normalize(15),
        width: COURSE_CARD_WIDTH,
        height: COURSE_CARD_HEIGHT,
        overflow: 'hidden',
    },
    title: {
        fontSize: 16,
        fontFamily: Fonts.InterBold,
        color: '#000',
        marginBottom: 4,
        width: '100%',
        fontWeight: "bold"
    },
    cardBody: {
        flex: 1,
    },
    subtitle: {
        fontSize: 12,
        color: '#999',
        fontFamily: Fonts.InterMedium,
        marginBottom: 8,
        fontWeight: "bold"
    },
    date: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
        fontFamily: Fonts.InterMedium,
        fontWeight: "bold"
    },
    datePlaceholder: {
        height: normalize(18),
        marginBottom: 6,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: normalize(20),
        // bottom:10
    },
    cmeContainer: {
        maxHeight: normalize(22),
        overflow: 'hidden',
        width: '100%',
    },
    cmeText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        color: '#000000',
        paddingVertical: normalize(0),
        fontWeight: "bold",
        width: '100%',
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        fontFamily: Fonts.InterMedium,
        fontWeight: "bold"
    },
    divider: {
        width: 1,
        height: 14,
        backgroundColor: '#ccc',
        marginHorizontal: 8
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
        gap: normalize(8),
    },
    freeText: {
        fontSize: 14,
        fontFamily: Fonts.InterBold,
        color: '#000000',
        fontWeight: "bold",
        flexShrink: 1,
        maxWidth: normalize(90),
    },
    registerText: {
        fontSize: 14,
        fontFamily: Fonts.InterBold,
        color: '#2C4DB9',
        fontWeight: "bold",
        maxWidth: normalize(100),
    }
});

/**
 * State required default export.
 *
 * @returns {*}
 */
export default StateRequireditem;
