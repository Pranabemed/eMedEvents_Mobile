import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import Fonts from '../Themes/Fonts';
import moment from 'moment';
import normalize from '../Utils/Helpers/Dimen';
import { FormatDateZone } from '../Utils/Helpers/Timezone';
const StateRequireditem = ({ allNoDetData, allProfTake, item, index, addit, navigation }) => {
    const titlhandleUrl = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = urltitle.split('/').pop();
        console.log(resulttitle, "webcast url=======", make, allNoDetData);
        if (resulttitle) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, creditData: addit } })
        }
    }
    const formatDate = (dateStr) => {
        const date = moment(dateStr, "DD MMM'YY");
        return date.format("MMM  D").replace(' ', '');
    };
    const formattedDate = formatDate(item?.startdate);
    const formatDateEnd = (dateStr) => {
        const date = moment(dateStr, "DD MMM'YY");
        return date.format("D, YYYY").replace('', '');
    };
    const formattedDateend = formatDateEnd(item?.enddate);
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
    const cmehit = () => {
        if (allProfTake && item?.display_cme) {
            return (
                <View>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 14,
                            color: '#000000',
                            paddingVertical: normalize(0),
                            fontWeight: "bold",
                            // width: normalize(140)
                        }}
                    >
                        {item?.display_cme}
                    </Text>
                </View>
            )
        } else if (allNoDetData && item?.cme_points_popovar?.length > 0) {
            return (
                <View>
                    {item?.cme_points_popovar?.map((d, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                                numberOfLines={3}
                                style={{
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 14,
                                    color: '#000000',
                                    paddingVertical: normalize(0),
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
                </View>
            )
        } else if (item?.cme_points_popovar?.length > 0 && item?.display_cme) {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Render CME points with commas */}
                    <View>
                        <Text
                            numberOfLines={1}
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
                <>
                    {
                        item.cme_points_popovar.map((d, index, array) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 14,
                                        color: '#000000',
                                        paddingVertical: normalize(0),
                                        width: normalize(120),
                                        fontWeight: "bold"
                                    }}
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
                </>
            )

        } else if (item?.display_cme) {
            return (
                <View>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 14,
                            color: '#000000',
                            paddingVertical: normalize(0),
                            fontWeight: "bold"
                            // width: normalize(120)
                        }}
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
        <View style={{ margin: normalize(10) }}>
            <View style={styles.card}>
                <Pressable onPress={() => titlhandleUrl(item)}>
                    <Text numberOfLines={2} style={styles.title}>
                        {item?.title}
                    </Text>
                </Pressable>
                <Text numberOfLines={2} style={[styles.subtitle, { width: normalize(190) }]}>
                    {item?.organization_name}
                </Text>
                {(item?.startdate !== null || item?.enddate !== null) ? <Text style={styles.date}>
                    {FormatDateZone(item?.startdate, item?.enddate)}
                </Text> : null}
                <View style={styles.infoRow}>
                    {cmehit()}
                </View>
                <View style={styles.bottomRow}>
                    <Text style={styles.freeText}>{item?.display_price == "FREE" ? `${item?.display_price}` : `${item?.display_currency_code}${item?.display_price}`}</Text>
                    <Pressable onPress={() => titlhandleUrl(item)}>
                        <Text style={styles.registerText}>{item?.buttonText}</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: normalize(15),
    },
    title: {
        fontSize: 16,
        fontFamily: Fonts.InterBold,
        color: '#000',
        marginBottom: 4,
        width: normalize(200),
        fontWeight: "bold"
    },
    subtitle: {
        fontSize: 12,
        color: '#999',
        fontFamily: Fonts.InterMedium,
        marginBottom: 12,
        fontWeight: "bold"
    },
    date: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        fontFamily: Fonts.InterMedium,
        fontWeight: "bold"
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        // bottom:10
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
        paddingTop: 12
    },
    freeText: {
        fontSize: 14,
        fontFamily: Fonts.InterBold,
        color: '#000000',
        fontWeight: "bold"
    },
    registerText: {
        fontSize: 14,
        fontFamily: Fonts.InterBold,
        color: '#2C4DB9',
        fontWeight: "bold"
    }
});

export default StateRequireditem;