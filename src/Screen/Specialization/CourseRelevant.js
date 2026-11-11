/**
 * Course relevant screen module. Renders a React Native screen or a screen-scoped support component. Exported members: CourseRelevant, courseRele, stateActionCourse, handleUrl, courserenderDataMain, getActualPrice, registercourserenderDataMain, onBackPress, cleanNumber.
 */

import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, Platform, BackHandler, StyleSheet, useWindowDimensions } from 'react-native';
import useComplianceRefresh from '../../Utils/Hooks/useComplianceRefresh';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import IconDot from 'react-native-vector-icons/Entypo';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import { useSelector } from 'react-redux';
import CourseShimmer from '../../Components/CourseShimmer';
import { AppContext } from '../GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable CourseRelevant component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const CourseRelevant = (props) => {
    useComplianceRefresh(props.navigation, props.route?.params, false);
    const { isConnected } = useContext(AppContext);
    const { fontScale } = useWindowDimensions();
    const cardHeight = Math.max(normalize(108), 132) * Math.max(1, fontScale);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const [specalty, setSpecalty] = useState(null);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    console.log(AuthReducer, "helolo5555", props?.route?.params?.mainData?.state_data?.id, props?.route?.params?.mainData?.speciality_cources?.registered_cources);
        /**
 * Course rele utility.
 * @returns {void}
 */
const courseRele = () => {
        props.navigation.goBack();
    }
        /**
 * State action course utility.
 * @param {*} courserole - Input value.
 * @returns {void}
 */
const stateActionCourse = (courserole) => {
        console.log(courserole, "courserole===============");
        if (courserole?.current_activity_api == "activitysession") {
            props?.navigation.navigate("VideoComponent", { RoleData: courserole });
        } else if (courserole?.current_activity_api == "introduction") {
            props?.navigation.navigate("StartTest", { conference: courserole?.id })
        } else if (courserole?.current_activity_api == "startTest") {
            props?.navigation.navigate("PreTest", { activityID: { activityID: courserole?.current_activity_id, conference_id: courserole?.id } });
        } else if (courserole?.button_display_text == "Add Credits") {
            props.navigation.navigate("AddCredits", { mainAdd: props?.route?.params?.mainData })
        }
    }
    useEffect(() => {
        const states = DashboardReducer?.mainprofileResponse?.specialities;
        if (states && typeof states == 'object' && Object.keys(states).length > 0) {
            const convertData = Object.entries(states).map(([key, val]) => ({ id: key, name: val }));
            setSpecalty(convertData);
        }
    }, [DashboardReducer]);
        /**
 * Handles url.
 * @param {*} did - Input value.
 * @returns {void}
 */
const handleUrl = (did) => {
        const url = did?.detailpage_url;
        const result = url.split('/').pop();
        console.log(result, "webcast url=======", did);
        if (result) {
            props?.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result } })
        }
    }
    const registeredParams = props?.route?.params?.mainData?.speciality_cources?.registered_cources || [];
    const suggestedParams = props?.route?.params?.mainData?.speciality_cources?.suggested_cources || [];
    const totalParams = registeredParams.length + suggestedParams.length;
    /**
     * Renders CME credits and event type cleanly on a single non-breaking row.
     * @param {Object} item - Course item.
     * @returns {JSX.Element|null}
     */
    const renderCourseMeta = (item) => {
        const cmeText = String(item?.display_cme || '').trim();
        const eventTypeText = String(item?.eventType || '').trim();
        if (!cmeText && !eventTypeText) return null;

        return (
            <View style={styles.metaRow}>
                {cmeText ? (
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.metaText, { flexShrink: 1 }]}
                    >
                        {cmeText}
                    </Text>
                ) : null}
                {cmeText && eventTypeText ? (
                    <View style={styles.metaSeparator} />
                ) : null}
                {eventTypeText ? (
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                            styles.metaText,
                            { flexShrink: cmeText ? 0 : 1, maxWidth: cmeText ? '46%' : '100%' },
                        ]}
                    >
                        {eventTypeText}
                    </Text>
                ) : null}
            </View>
        );
    };

    /**
     * Returns actual price before Prime discount.
     * @param {number} percent - Discount ratio (0..1).
     * @param {string|number} discountPrice - Discounted price.
     * @returns {number|null}
     */
    const getActualPrice = (percent, discountPrice) => {
        const price = Number(String(discountPrice ?? '').replace(/,/g, ''));
        return Number.isFinite(price) && percent > 0 && percent < 1
            ? Math.round(price / (1 - percent)) : null;
    };

    /**
     * Courserender data main utility.
     * @param {Object} props - Input object.
     * @param {*} props.item - Nested property value.
     * @param {*} props.index - Nested property value.
     * @returns {JSX.Element}
     */
    const courserenderDataMain = ({ item, index }) => {
        const discountPercentage = Math.min(100, Math.max(0, Number(item?.emed_commission) || 0));
        const formattedPct = Number(discountPercentage.toFixed(1));
        const actualPrice = getActualPrice(discountPercentage / 100, item?.display_price);
        const numericDisplayPrice = Number(String(item?.display_price ?? '').replace(/,/g, ''));
        const currencyCode = item?.display_currency_code || '';

        return (
            <View style={styles.cardWrapper}>
                <View style={[styles.courseCard, { height: cardHeight }]}>
                    <View style={styles.cardTopSection}>
                        <View style={styles.cardTitleRow}>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={[styles.cardTitle, { flex: 1 }]}
                            >
                                {item?.title}
                            </Text>
                        </View>
                        {renderCourseMeta(item)}
                    </View>
                    <View style={styles.cardBottomRow}>
                        <View style={styles.priceColumn}>
                            {item?.display_price !== 0 ? (
                                <>
                                    <View style={styles.primeOfferRow}>
                                        <Image source={Imagepath.TickMark} style={styles.tickIcon} />
                                        <Text numberOfLines={1} style={styles.primeOfferText}>
                                            {discountPercentage > 0 ? `Prime Offer · ${formattedPct}% OFF` : 'Prime Offer'}
                                        </Text>
                                    </View>
                                    <View style={styles.priceValueRow}>
                                        {discountPercentage > 0 ? (
                                            <Text style={styles.discountPctText}>{`-${formattedPct}%`}</Text>
                                        ) : null}
                                        <Text style={styles.priceText}>
                                            {`${currencyCode}${item?.display_price ?? ''}`}
                                        </Text>
                                        {actualPrice !== null && (!Number.isFinite(numericDisplayPrice) || actualPrice > numericDisplayPrice) ? (
                                            <Text style={styles.strikePriceText}>
                                                {`${currencyCode}${actualPrice}`}
                                            </Text>
                                        ) : null}
                                    </View>
                                </>
                            ) : null}
                        </View>
                        {item?.buttonText ? (
                            <TouchableOpacity onPress={() => { handleUrl(item); }} style={styles.cardActionBtn}>
                                <Text numberOfLines={1} style={[styles.cardActionText, { textTransform: 'capitalize' }]}>
                                    {item.buttonText}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
        );
    };

    /**
     * Registercourserender data main utility.
     * @param {Object} props - Input object.
     * @param {*} props.item - Nested property value.
     * @param {*} props.index - Nested property value.
     * @returns {JSX.Element}
     */
    const registercourserenderDataMain = ({ item, index }) => {
        const progress = Math.min(100, Math.max(0, Number(item?.completed_percentage) || 0));
        const isCompleted = progress >= 100;

        return (
            <View style={styles.cardWrapper}>
                <View style={[styles.courseCard, { height: cardHeight }]}>
                    <View style={styles.cardTopSection}>
                        <View style={styles.cardTitleRow}>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={[styles.cardTitle, { flex: 1 }]}
                            >
                                {item?.title}
                            </Text>
                        </View>
                        {renderCourseMeta(item)}
                    </View>
                    <View style={styles.cardBottomRow}>
                        <View style={styles.progressColumn}>
                            <View style={styles.progressHeaderRow}>
                                <Text style={styles.progressPctText}>
                                    {`${Math.round(progress)}% completed`}
                                </Text>
                            </View>
                            <View
                                accessibilityRole="progressbar"
                                accessibilityLabel="Course progress"
                                accessibilityValue={{ min: 0, max: 100, now: progress }}
                                style={styles.progressTrack}
                            >
                                <View
                                    style={[
                                        styles.progressFill,
                                        {
                                            width: `${progress}%`,
                                            backgroundColor: isCompleted ? Colorpath.green : Colorpath.ButtonColr,
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                        {item?.button_display_text ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (item?.buttonText === "Revise Course") {
                                        props.navigation.navigate("VideoComponent", { RoleData: item });
                                    } else {
                                        stateActionCourse(item);
                                    }
                                }}
                                style={[styles.cardActionBtn, styles.registerActionBtn]}
                            >
                                <Text numberOfLines={1} style={styles.cardActionText}>
                                    {item.button_display_text}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
        );
    };
    useEffect(() => {
                /**
 * On back press utility.
 * @returns {boolean}
 */
const onBackPress = () => {
            courseRele();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
        /**
 * Clean number utility.
 * @param {*} value - Input value.
 * @returns {number}
 */
const cleanNumber = (value) => {
        if (typeof value == 'number') return value;
        if (typeof value == 'string') {
            const num = parseFloat(value.replace(/,/g, ''));
            return isNaN(num) ? 0 : num;
        }
        return 0;
    };
    const earnedCreditsd = cleanNumber(props?.route?.params?.mainData?.state_data?.credits_data?.total_general_earned_credits);
    const totalCreditsd = cleanNumber(props?.route?.params?.mainData?.state_data?.credits_data?.total_general_credits);
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS == 'ios' ? <PageHeader
                    title="Courses relevant to your specia..."
                    onBackPress={courseRele}
                /> : <View>
                    <PageHeader
                        title="Courses relevant to your specia..."
                        onBackPress={courseRele}
                    />
                </View>}

                {conn == false ? <IntOff/> :<ScrollView contentContainerStyle={{ paddingBottom: normalize(20) }}>
                    {(earnedCreditsd === 0 && totalCreditsd === 0) ? null : <View>
                        <View style={{ justifyContent: "center", alignItems: "center", paddingTop: normalize(10), paddingBottom: normalize(6) }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    width: normalize(290),
                                    borderRadius: normalize(10),
                                    backgroundColor: "#FFFFFF",
                                    paddingHorizontal: normalize(12),
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
                                            paddingVertical: normalize(2),
                                        }}
                                    >
                                        {"Relevant to your primary area \nof practice or specialty"}
                                    </Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(8) }}>
                                        {(() => {
                                            const earnedCredits = cleanNumber(props?.route?.params?.mainData?.state_data?.credits_data?.total_general_earned_credits);
                                            const totalCredits = cleanNumber(props?.route?.params?.mainData?.state_data?.credits_data?.total_general_credits);

                                            // Don't render anything if both are zero
                                            if (earnedCredits === 0 && totalCredits === 0) {
                                                return null;
                                            }

                                            return (
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <View style={{
                                                        paddingHorizontal: normalize(10),
                                                        paddingVertical: normalize(2),
                                                        borderRadius: normalize(20),
                                                        backgroundColor: earnedCredits === totalCredits ? "#D6F9E2" : "#FFF2E0",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>
                                                        <Text style={{
                                                            fontFamily: Fonts.InterSemiBold,
                                                            fontSize: 13,
                                                            fontWeight: "bold",
                                                            color: "#000000"
                                                        }}>
                                                            {`${earnedCredits} / ${totalCredits}`}
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        style={{
                                                            fontFamily: Fonts.InterSemiBold,
                                                            fontSize: 13,
                                                            color: "#999",
                                                            fontWeight: "bold",
                                                            marginLeft: normalize(8),
                                                        }}
                                                    >
                                                        {"Credits Earned"}
                                                    </Text>
                                                </View>
                                            );
                                        })()}
                                        {props?.route?.params?.mainData?.state_data?.credits_data?.total_general_earned_credits < (+(props?.route?.params?.mainData?.state_data?.credits_data?.total_general_credits)) ? (<TouchableOpacity onPress={() => { props.navigation.navigate("AddCredits", { mainAdd: props?.route?.params?.mainData }) }}>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterMedium,
                                                    fontSize: 13.5,
                                                    color: "#2C4DB9",
                                                    marginLeft: normalize(8),
                                                }}
                                            >
                                                {"+ Add Credits"}
                                            </Text>
                                        </TouchableOpacity>) : null}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>}
                    {totalParams == 0 && <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                        <View
                            style={{
                                flexDirection: "row",
                                width: normalize(290),
                                borderRadius: normalize(10),
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: normalize(12),
                                paddingVertical: normalize(12),
                                alignItems: "center",
                            }}
                        >
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 15,
                                        lineHeight: 21,
                                        color: "#000000",
                                    }}
                                >
                                    {`Our catalog currently does not include course(s) on ${specalty ? specalty.map((sd) => sd.name).join(', ') : ''}`}
                                </Text>

                            </View>
                        </View>
                    </View>}
                    {props?.route?.params?.mainData?.speciality_cources?.registered_cources?.length > 0 ? <>
                        <View style={styles.sectionBanner}>
                            <Text style={styles.sectionTitle}>
                                {"Registered Specialty Courses"}
                            </Text>
                        </View>
                        <View>
                            {props?.route?.params?.mainData?.speciality_cources?.registered_cources?.length > 0 ? <FlatList
                                data={props?.route?.params?.mainData?.speciality_cources?.registered_cources}
                                renderItem={registercourserenderDataMain}
                                scrollEnabled={false}
                                keyExtractor={(item, index) => index.toString()}
                                // contentContainerStyle={{ paddingBottom: normalize(170) }}
                                ListEmptyComponent={
                                    <Text
                                        style={{
                                            alignContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            color: Colorpath.grey,
                                            fontWeight: 'bold',
                                            fontFamily: Fonts.InterMedium,
                                            fontSize: normalize(20),
                                            paddingTop: normalize(30),
                                            // textTransform: 'uppercase',
                                        }}>
                                        No data found
                                    </Text>
                                } /> : <>
                                <Text
                                    style={{
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        color: Colorpath.grey,
                                        fontWeight: 'bold',
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: normalize(20),
                                        paddingTop: normalize(30),
                                        // textTransform: 'uppercase',
                                    }}>
                                    No data found
                                </Text>
                            </>
                            }
                        </View>
                    </> : null}
                    {props?.route?.params?.mainData?.speciality_cources?.suggested_cources?.length > 0 ?
                        <>
                            <View style={styles.sectionBanner}>
                                <Text style={styles.sectionTitle}>
                                    {"Suggested Specialty Courses"}
                                </Text>
                            </View>
                            <View>
                                {props?.route?.params?.mainData?.speciality_cources?.suggested_cources?.length > 0 ? <FlatList
                                    data={props?.route?.params?.mainData?.speciality_cources?.suggested_cources}
                                    renderItem={courserenderDataMain}
                                    scrollEnabled={false}
                                    keyExtractor={(item, index) => index.toString()}
                                    // contentContainerStyle={{ paddingBottom: normalize(170) }}
                                    ListEmptyComponent={
                                        <Text
                                            style={{
                                                alignContent: 'center',
                                                alignItems: 'center',
                                                alignSelf: 'center',
                                                color: Colorpath.grey,
                                                fontWeight: 'bold',
                                                fontFamily: Fonts.InterMedium,
                                                fontSize: normalize(20),
                                                paddingTop: normalize(30),
                                                // textTransform: 'uppercase',
                                            }}>
                                            No data found
                                        </Text>
                                    } /> : <>
                                    <Text
                                        style={{
                                            alignContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            color: Colorpath.grey,
                                            fontWeight: 'bold',
                                            fontFamily: Fonts.InterMedium,
                                            fontSize: normalize(20),
                                            paddingTop: normalize(30),
                                            // textTransform: 'uppercase',
                                        }}>
                                        No data found
                                    </Text>
                                </>}

                            </View>
                        </> : null
                    }


                </ScrollView>}
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    sectionBanner: {
        width: normalize(290),
        alignSelf: 'center',
        marginTop: normalize(8),
        marginBottom: normalize(4),
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(10),
        borderRadius: normalize(8),
        backgroundColor: '#142B5B',
    },
    sectionTitle: {
        fontFamily: Fonts.InterBold,
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 21,
        color: '#FFD08A',
    },
    cardWrapper: {
        justifyContent: 'center',
        alignSelf: 'center',
        paddingVertical: normalize(5),
    },
    courseCard: {
        flexDirection: 'column',
        width: normalize(290),
        justifyContent: 'space-between',
        borderRadius: normalize(10),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(9),
        alignItems: 'flex-start',
    },
    cardTopSection: {
        width: '100%',
    },
    cardTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
    },
    cardTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 15,
        lineHeight: 20,
        color: '#000000',
        fontWeight: 'bold',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: normalize(4),
    },
    metaText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
        lineHeight: 18,
        fontWeight: 'bold',
        color: '#666666',
    },
    metaSeparator: {
        backgroundColor: Colorpath.ButtonColr,
        height: normalize(10),
        width: 1,
        marginHorizontal: normalize(6),
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: normalize(6),
        width: '100%',
    },
    priceColumn: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        flex: 1,
        marginRight: normalize(8),
    },
    primeOfferRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tickIcon: {
        height: normalize(13),
        width: normalize(13),
        resizeMode: 'contain',
    },
    primeOfferText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 11.5,
        color: '#FF5D18',
        fontWeight: 'bold',
        marginLeft: normalize(4),
        flexShrink: 1,
    },
    priceValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: normalize(2),
    },
    discountPctText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12.5,
        color: '#EB5757',
        fontWeight: 'bold',
        marginRight: normalize(4),
    },
    priceText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13.5,
        color: '#000000',
        fontWeight: 'bold',
    },
    strikePriceText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 11.5,
        color: '#999999',
        marginLeft: normalize(5),
        textDecorationLine: 'line-through',
        fontStyle: 'italic',
    },
    progressColumn: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        flex: 1,
        marginRight: normalize(10),
    },
    progressHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressPctText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12,
        color: '#666666',
        fontWeight: 'bold',
    },
    progressTrack: {
        width: '100%',
        height: normalize(5),
        marginTop: normalize(5),
        borderRadius: normalize(3),
        backgroundColor: '#E1E7F2',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: normalize(3),
    },
    cardActionBtn: {
        height: normalize(30),
        minWidth: normalize(84),
        paddingHorizontal: normalize(10),
        borderRadius: normalize(6),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colorpath.ButtonColr,
        borderWidth: 0.8,
    },
    registerActionBtn: {
        minWidth: normalize(96),
    },
    cardActionText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 13.5,
        color: '#2C4DB9',
    },
});

/**
 * Course relevant default export.
 *
 * @returns {*}
 */
export default CourseRelevant;