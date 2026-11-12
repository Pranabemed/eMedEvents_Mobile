/**
 * Interested chekout screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, InterestedChekout, profileBack, fetchHandle, handleUrl, onBackPress, fullDataRefresh, CMEExclusive, formatDate, formatDateEnd, renderLocationAndDates.
 */

import { View, Text, Platform, FlatList, TouchableOpacity, Image, BackHandler, ActivityIndicator, RefreshControl, StyleSheet, Animated } from 'react-native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import PageHeader from '../../Components/PageHeader';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import { cmeCourseRequest, ConfActRequest } from '../../Redux/Reducers/CMEReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, useFocusEffect, useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import { AppContext } from '../GlobalSupport/AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';

const InterestedListSkeleton = ({ count = 4 }) => {
    const pulseAnim = useRef(new Animated.Value(0.45)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.9,
                    duration: 750,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.45,
                    duration: 750,
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [pulseAnim]);

    return (
        <View style={styles.skeletonContainer}>
            {Array.from({ length: count }).map((_, index) => (
                <Animated.View
                    key={`interested-skeleton-${index}`}
                    style={[styles.skeletonCard, { opacity: pulseAnim }]}
                >
                    <View style={styles.skeletonTitleBar} />
                    <View style={styles.skeletonSubtitleBar} />
                    <View style={styles.skeletonMetaBar} />
                    <View style={styles.skeletonDivider} />
                    <View style={styles.skeletonFooterRow}>
                        <View style={styles.skeletonPriceBar} />
                        <View style={styles.skeletonActionPill} />
                    </View>
                </Animated.View>
            ))}
        </View>
    );
};

/**
 * Reusable InterestedChekout component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const InterestedChekout = (props) => {
    const { isConnected } = useContext(AppContext);

    /**
     * Profile back utility.
     * @returns {void}
     */
    const profileBack = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: "TabNav", params: { initialRoute: "Home" } }
                ],
            })
        );
    };

    const dispatch = useDispatch();
    const CMEReducer = useSelector(state => state.CMEReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const isfocus = useIsFocused();
    const statusRef = useRef("");
    const pendingResetRef = useRef(false);
    const requestedPageRef = useRef(0);
    const hasMoreRef = useRef(true);
    const [storeAlldata, setStoreAlldata] = useState([]);
    const [apiReq, setApiReq] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [pageNum, setPageNum] = useState(0);
    const [limit] = useState(9);
    const [refreshing, setRefreshing] = useState(false);
    const [conn, setConn] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);

    /**
     * Fetch handle utility.
     * @param {number} page - Page number to fetch.
     * @returns {void}
     */
    const fetchHandle = useCallback((page = 0) => {
        requestedPageRef.current = page;
        const obj = {
            "limit": limit,
            "listby_type": "interstedconferences",
            "pageno": page,
            "request_type": "normallist"
        };
        setLoading(true);
        connectionrequest()
            .then(() => {
                dispatch(cmeCourseRequest(obj));
            })
            .catch((err) => {
                setLoading(false);
                setInitialLoading(false);
                setRefreshing(false);
                pendingResetRef.current = false;
                showErrorAlert("Please connect to internet", err);
            });
    }, [dispatch, limit]);

    useFocusEffect(
        useCallback(() => {
            statusRef.current = "";
            hasMoreRef.current = true;
            pendingResetRef.current = true;
            setPageNum(0);
            fetchHandle(0);
        }, [fetchHandle])
    );

    /**
     * Handles url.
     * @param {*} onlineName - Input value.
     * @returns {void}
     */
    const handleUrl = (onlineName) => {
        const url = onlineName?.detailpage_url;
        const result = typeof url === 'string' ? url.split('/').pop() : '';
        const obj = {
            "conference_id": onlineName?.id,
            "action_type": "view",
            "status": 1
        };
        connectionrequest()
            .then(() => {
                dispatch(ConfActRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
            });
        if (result) {
            props.navigation.navigate("Statewebcast", {
                webCastURL: {
                    webCastURL: result,
                    creditData: DashboardReducer?.mainprofileResponse?.licensures?.[0]
                }
            });
        }
    };

    useEffect(() => {
        /**
         * On back press utility.
         * @returns {boolean}
         */
        const onBackPress = () => {
            profileBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);

    const fetchMore = useCallback(() => {
        const totalExpected = props?.route?.params?.trig?.count;
        if (totalExpected && storeAlldata.length >= totalExpected) {
            hasMoreRef.current = false;
            return;
        }
        if (!apiReq && !loading && hasMoreRef.current && CMEReducer?.cmeCourseResponse?.conferences?.length >= limit) {
            const nextPage = pageNum + 1;
            pendingResetRef.current = false;
            setPageNum(nextPage);
            fetchHandle(nextPage);
        }
    }, [apiReq, loading, pageNum, limit, storeAlldata.length, props?.route?.params?.trig?.count, CMEReducer?.cmeCourseResponse?.conferences?.length, fetchHandle]);

    /**
     * Full data refresh utility.
     * @returns {void}
     */
    const fullDataRefresh = () => {
        hasMoreRef.current = true;
        pendingResetRef.current = true;
        setRefreshing(true);
        setPageNum(0);
        fetchHandle(0);
    };

    useEffect(() => {
        if (!isfocus) return;
        if (CMEReducer.status && CMEReducer.status !== statusRef.current) {
            statusRef.current = CMEReducer.status;
            if (CMEReducer.status === 'CME/cmeCourseRequest') {
                setApiReq(true);
                setLoading(true);
            } else if (CMEReducer.status === 'CME/cmeCourseSuccess') {
                setApiReq(false);
                setLoading(false);
                setInitialLoading(false);
                setRefreshing(false);
                const incoming = Array.isArray(CMEReducer?.cmeCourseResponse?.conferences)
                    ? CMEReducer.cmeCourseResponse.conferences
                    : [];
                hasMoreRef.current = incoming.length >= limit;
                const shouldReplace = requestedPageRef.current === 0 || pendingResetRef.current;
                pendingResetRef.current = false;
                if (shouldReplace) {
                    setStoreAlldata(incoming);
                } else if (incoming.length > 0) {
                    setStoreAlldata(prevData => {
                        const merged = [...prevData, ...incoming];
                        return merged.filter(
                            (value, index, self) =>
                                index === self.findIndex(t => t?.id === value?.id)
                        );
                    });
                }
            } else if (CMEReducer.status === 'CME/cmeCourseFailure') {
                setApiReq(false);
                setLoading(false);
                setInitialLoading(false);
                setRefreshing(false);
                pendingResetRef.current = false;
                hasMoreRef.current = false;
            }
        } else if (CMEReducer.status === '') {
            statusRef.current = '';
        }
    }, [CMEReducer.status, CMEReducer.cmeCourseResponse, isfocus, limit]);

    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);

    /**
     * Cmeexclusive component.
     * @param {Object} props - Input object.
     * @param {*} props.item - Nested property value.
     * @param {*} props.index - Nested property value.
     * @returns {JSX.Element}
     */
    const CMEExclusive = ({ item }) => {
        const formatDate = (dateStr) => {
            const date = moment(dateStr, "DD MMM'YY");
            return date.isValid() ? date.format("MMM D") : dateStr;
        };
        const formatDateEnd = (dateStr) => {
            const date = moment(dateStr, "DD MMM'YY");
            return date.isValid() ? date.format("MMM D, YYYY") : dateStr;
        };
        const formattedDate = formatDate(item?.startdate);
        const formattedDateend = formatDateEnd(item?.enddate);

        const renderLocationAndDates = () => {
            if (item?.startdate && item?.enddate && item?.location) {
                return (
                    <View style={styles.metaRow}>
                        <Image
                            source={Imagepath.WrongCal}
                            style={styles.metaIcon}
                        />
                        <Text numberOfLines={1} style={styles.metaText}>
                            {`${formattedDate} - ${formattedDateend} | ${item?.location}`}
                        </Text>
                    </View>
                );
            } else if (item?.startdate && item?.enddate) {
                return (
                    <View style={styles.metaRow}>
                        <Image
                            source={Imagepath.CalImg}
                            style={styles.metaIcon}
                        />
                        <Text numberOfLines={1} style={styles.metaText}>
                            {`${formattedDate} - ${formattedDateend}`}
                        </Text>
                    </View>
                );
            } else if (item?.location) {
                return (
                    <View style={styles.metaRow}>
                        <Image
                            source={Imagepath.MapPin}
                            style={styles.metaIcon}
                        />
                        <Text numberOfLines={1} style={styles.metaText}>
                            {item?.location}
                        </Text>
                    </View>
                );
            }
            return null;
        };

        const rawPrice = item?.display_price;
        const isFreePrice = rawPrice === "FREE" || rawPrice === "Free" || rawPrice === 0 || rawPrice === "0";
        const priceDisplay = isFreePrice
            ? "Free"
            : (rawPrice ? `${item?.display_currency_code || ''}${rawPrice}` : "");

        return (
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => { handleUrl(item); }}
                style={styles.cardTouchable}
            >
                <View style={styles.conferenceCard}>
                    <View style={styles.cardHeaderRow}>
                        <Text
                            style={styles.cardTitle}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {item?.title}
                        </Text>
                    </View>

                    {item?.organization_name ? (
                        <Text numberOfLines={1} style={styles.organizationText}>
                            {item?.organization_name}
                        </Text>
                    ) : null}

                    {(item?.startdate || item?.enddate || item?.location) ? (
                        <View style={styles.metaWrapper}>
                            {renderLocationAndDates()}
                        </View>
                    ) : null}

                    <View style={styles.cardDivider} />

                    <View style={styles.cardFooterRow}>
                        <Text style={[styles.priceText, isFreePrice && styles.freePriceText]}>
                            {priceDisplay}
                        </Text>
                        {item?.buttonText ? (
                            <View style={styles.actionBadge}>
                                <Text numberOfLines={1} style={styles.actionBadgeText}>
                                    {item?.buttonText}
                                </Text>
                                <ArrowIcons name="arrow-forward-ios" size={11} color={Colorpath.ButtonColr} />
                            </View>
                        ) : null}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const resultCount = CMEReducer?.cmeCourseResponse?.conferences_count ?? storeAlldata.length ?? 0;

    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn === false ? <IntOff /> : <SafeAreaView style={styles.screenContainer}>
                <View style={styles.headerContainer}>
                    <PageHeader
                        title="Interested Conferences"
                        onBackPress={profileBack}
                    />
                </View>

                {initialLoading && storeAlldata.length === 0 ? (
                    <InterestedListSkeleton count={4} />
                ) : (
                    <View style={styles.listContainer}>
                        {storeAlldata?.length > 0 ? (
                            <View style={styles.summaryHeader}>
                                <View style={styles.resultsHeaderRow}>
                                    <Text style={styles.resultsLabel}>
                                        {`Showing ${resultCount} ${Number(resultCount) === 1 ? 'Result' : 'Results'}`}
                                    </Text>
                                    <View style={styles.resultsPill}>
                                        <Text style={styles.resultsPillText}>{resultCount}</Text>
                                    </View>
                                </View>
                                {CMEReducer?.cmeCourseResponse?.header_title ? (
                                    <Text style={styles.sectionHeadingText}>
                                        {CMEReducer.cmeCourseResponse.header_title}
                                    </Text>
                                ) : null}
                            </View>
                        ) : null}

                        <FlatList
                            data={storeAlldata}
                            renderItem={CMEExclusive}
                            keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
                            contentContainerStyle={styles.listContentContainer}
                            showsVerticalScrollIndicator={false}
                            onEndReached={fetchMore}
                            onEndReachedThreshold={0.5}
                            scrollEventThrottle={16}
                            ListFooterComponent={
                                loading && pageNum > 0 ? (
                                    <ActivityIndicator
                                        color={Colorpath.ButtonColr}
                                        size="small"
                                        style={styles.footerLoader}
                                    />
                                ) : null
                            }
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={fullDataRefresh}
                                    tintColor={Colorpath.ButtonColr}
                                    colors={[Colorpath.ButtonColr]}
                                />
                            }
                            ListEmptyComponent={
                                !initialLoading && !loading && !apiReq ? (
                                    <View style={styles.emptyWrapper}>
                                        <View style={styles.emptyCard}>
                                            <Text style={styles.emptyTitle}>
                                                {"No Interested Conferences"}
                                            </Text>
                                            <Text style={styles.emptySubtitle}>
                                                {"You have not shown interest for any of the conferences or courses."}
                                            </Text>
                                        </View>
                                    </View>
                                ) : null
                            }
                        />
                    </View>
                )}
            </SafeAreaView>}
        </>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#F4F7FC',
    },
    headerContainer: {
        backgroundColor: Colorpath.white,
    },
    listContainer: {
        flex: 1,
    },
    listContentContainer: {
        paddingHorizontal: normalize(12),
        paddingTop: normalize(6),
        paddingBottom: normalize(40),
    },
    summaryHeader: {
        paddingHorizontal: normalize(12),
        paddingTop: normalize(10),
        paddingBottom: normalize(4),
    },
    resultsHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    resultsLabel: {
        fontFamily: Fonts.InterMedium,
        fontSize: 13,
        color: '#475569',
    },
    resultsPill: {
        backgroundColor: '#E0ECFF',
        borderRadius: normalize(20),
        paddingHorizontal: normalize(9),
        paddingVertical: normalize(2),
    },
    resultsPillText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 11,
        color: Colorpath.ButtonColr,
    },
    sectionHeadingText: {
        fontFamily: Fonts.InterBold,
        fontSize: 17,
        color: Colorpath.ButtonColr,
        marginTop: normalize(4),
    },
    cardTouchable: {
        marginBottom: normalize(10),
    },
    conferenceCard: {
        backgroundColor: Colorpath.white,
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: '#E5ECF6',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(11),
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    cardTitle: {
        flex: 1,
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        lineHeight: 20,
        color: '#0F172A',
    },
    organizationText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 12,
        color: '#64748B',
        marginTop: normalize(4),
    },
    metaWrapper: {
        marginTop: normalize(6),
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaIcon: {
        height: normalize(13),
        width: normalize(13),
        resizeMode: 'contain',
        marginRight: normalize(6),
    },
    metaText: {
        flex: 1,
        fontFamily: Fonts.InterMedium,
        fontSize: 12,
        color: '#475569',
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#EEF2F7',
        marginVertical: normalize(8),
    },
    cardFooterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    priceText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#0F172A',
    },
    freePriceText: {
        color: '#059669',
    },
    actionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        borderRadius: normalize(6),
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(5),
        gap: normalize(4),
    },
    actionBadgeText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12,
        color: Colorpath.ButtonColr,
    },
    footerLoader: {
        marginVertical: normalize(14),
    },
    emptyWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: normalize(28),
    },
    emptyCard: {
        width: '100%',
        borderRadius: normalize(10),
        backgroundColor: Colorpath.white,
        borderWidth: 1,
        borderColor: '#E5ECF6',
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(22),
        alignItems: 'center',
    },
    emptyTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 15,
        color: '#0F172A',
        marginBottom: normalize(6),
        textAlign: 'center',
    },
    emptySubtitle: {
        fontFamily: Fonts.InterMedium,
        fontSize: 13,
        lineHeight: 19,
        color: '#64748B',
        textAlign: 'center',
    },
    skeletonContainer: {
        paddingHorizontal: normalize(12),
        paddingTop: normalize(12),
    },
    skeletonCard: {
        backgroundColor: Colorpath.white,
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: '#E5ECF6',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(12),
        marginBottom: normalize(10),
    },
    skeletonTitleBar: {
        height: 14,
        width: '82%',
        borderRadius: 6,
        backgroundColor: '#E8EEF5',
    },
    skeletonSubtitleBar: {
        height: 11,
        width: '48%',
        borderRadius: 5,
        backgroundColor: '#EEF2F7',
        marginTop: 8,
    },
    skeletonMetaBar: {
        height: 11,
        width: '66%',
        borderRadius: 5,
        backgroundColor: '#EEF2F7',
        marginTop: 8,
    },
    skeletonDivider: {
        height: 1,
        width: '100%',
        backgroundColor: '#F1F5F9',
        marginVertical: 10,
    },
    skeletonFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    skeletonPriceBar: {
        height: 14,
        width: normalize(65),
        borderRadius: 5,
        backgroundColor: '#E8EEF5',
    },
    skeletonActionPill: {
        height: normalize(26),
        width: normalize(95),
        borderRadius: 6,
        backgroundColor: '#E8EEF5',
    },
});

/**
 * Interested chekout default export.
 *
 * @returns {*}
 */
export default InterestedChekout;
