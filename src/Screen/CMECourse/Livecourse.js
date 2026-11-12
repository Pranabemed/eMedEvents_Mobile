/**
 * Livecourse screen module. Renders a React Native screen or a screen-scoped support component. Exported members: Livecourse, fullActionlive, titlhandleUrllive, handleLinkst, showPDF, openFileViewerst, fetchHandle, fullDataRefresh, courserenderData, formatDate, formatDateEnd, handlePress, styles.
 */

import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl, StyleSheet, Platform, Animated } from 'react-native'
import React, { useCallback, useContext, useEffect, useState, useRef, useMemo } from 'react'
import Fonts from '../../Themes/Fonts'
import IconDot from 'react-native-vector-icons/Entypo';
import Colorpath from '../../Themes/Colorpath';
import Imagepath from '../../Themes/Imagepath';
import Calender from 'react-native-vector-icons/EvilIcons';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { cmeCourseRequest, clearCmeCourseData } from '../../Redux/Reducers/CMEReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import moment from 'moment';
import Modal from 'react-native-modal';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import normalize from '../../Utils/Helpers/Dimen';
import { AppContext } from '../GlobalSupport/AppContext';
import { FormatDateZone } from '../../Utils/Helpers/Timezone';

/**
 * Reusable Livecourse component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const LiveCourseListSkeleton = ({ count = 4 }) => {
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
        <View style={{ paddingTop: normalize(10), paddingHorizontal: normalize(10) }}>
            {Array.from({ length: count }).map((_, index) => (
                <Animated.View
                    key={`live-skeleton-${index}`}
                    style={{
                        opacity: pulseAnim,
                        backgroundColor: Colorpath.white,
                        borderRadius: normalize(8),
                        borderWidth: 1,
                        borderColor: '#E5ECF6',
                        paddingHorizontal: normalize(12),
                        paddingVertical: normalize(12),
                        marginBottom: normalize(10),
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ height: 14, width: '78%', borderRadius: 6, backgroundColor: '#E8EEF5' }} />
                        <View style={{ height: 18, width: 10, borderRadius: 4, backgroundColor: '#EEF2F7' }} />
                    </View>
                    <View style={{ height: 12, width: '58%', borderRadius: 6, backgroundColor: '#EEF2F7', marginTop: 10 }} />
                    <View style={{ marginTop: 12, height: 1, width: '100%', backgroundColor: '#F1F5F9' }} />
                    <View style={{ height: 11, width: '44%', borderRadius: 5, backgroundColor: '#EEF2F7', marginTop: 10 }} />
                    <View style={{ height: normalize(28), width: '100%', borderRadius: normalize(5), backgroundColor: '#E8EEF5', marginTop: 12 }} />
                </Animated.View>
            ))}
        </View>
    );
};

const Livecourse = ({ fetchnamelive, creditwholelive, setLoadingdownstlv, loadingdownstlv }) => {
    const {
        statepush,
        setStatepush
    } = useContext(AppContext);
    const navigation = useNavigation();
    const CMEReducer = useSelector(state => state.CMEReducer);
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const statusRef = useRef("");
    const requestIdRef = useRef(null);
    const hasMoreRef = useRef(true);
    const isFetchingMoreRef = useRef(false);
    const onEndReachedCalledDuringMomentum = useRef(true);
    const pendingResetRef = useRef(false);
    const requestedPageRef = useRef(0);
    const [storeAlldata, setStoreAlldata] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [apiReq, setApiReq] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [limit, setLimit] = useState(100);
    const [refreshing, setRefreshing] = useState(false);
    const [modalviewlive, setModalviewlive] = useState(false);
    const [needReviewlive, setNeedReviewlive] = useState(0);
    const [onlineNamelive, setOnlineNamelive] = useState("");
    const threeDotDatalive = [{ id: 0, name: "Rate & Review" }, { id: 1, name: "Download Certificate" }]
    const duplicateDatalive = [{ id: 1, name: "Download Certificate" }]
    const duplicateDataReviewlive = [{ id: 0, name: "Rate & Review" }]
    const [pdfUrist, setPdfUrist] = useState("");
    const [certificatelive, setCertificatelive] = useState("");
    const Fulldatalive = (needReviewlive == 1 && certificatelive) ? threeDotDatalive :
        (needReviewlive == 1 && !certificatelive) ? duplicateDataReviewlive :
            (needReviewlive == 0 && certificatelive) ? duplicateDatalive : null;
    useEffect(() => {
        if (isFocus) {
            statusRef.current = "";
            hasMoreRef.current = true;
            isFetchingMoreRef.current = false;
            onEndReachedCalledDuringMomentum.current = true;
            pendingResetRef.current = true;
            setPageNum(0);
            fetchHandle(0);
        }
        return () => { requestIdRef.current = null; };
    }, [isFocus, dispatch]);
        /**
 * Full actionlive utility.
 * @param {*} dataItem - Input value.
 * @returns {void}
 */
const fullActionlive = (dataItem) => {
        const url = dataItem?.detailpage_url;
        const result = typeof url === 'string' ? url.split('/').pop() : '';
        if (dataItem?.current_activity_api == "activitysession") {
            navigation.navigate("VideoComponent", { RoleData: dataItem });
        } else if (dataItem?.current_activity_api == "introduction") {
            navigation.navigate("StartTest", { conference: dataItem?.id })
        } else if (dataItem?.current_activity_api == "startTest") {
            navigation.navigate("PreTest", { activityID: { activityID: dataItem?.current_activity_id, conference_id: dataItem?.id } })
        } else if (dataItem?.button_display_text == "Add Credits") {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{
                        name: "TabNav",
                        params: {
                            initialRoute: "Contact",
                            detectmain: "main",
                            refreshLicensesAt: Date.now()
                        }
                    }],
                })
            );
        } else if (result) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, shareUrl: url, creditData: creditwholelive } })
        }
    }
        /**
 * Titlhandle urllive utility.
 * @param {*} make - Input value.
 * @returns {void}
 */
const titlhandleUrllive = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = typeof urltitle === 'string' ? urltitle.split('/').pop() : '';
        if (resulttitle) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, shareUrl: urltitle, creditData: creditwholelive } })
        }
    }
        /**
 * Handles linkst.
 * @param {*} link - Input value.
 * @returns {void}
 */
const handleLinkst = (link) => {
        if (link) {
                        /**
 * Show pdf utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const showPDF = async () => {
                setLoadingdownstlv(true);
                try {
                    const cleanedPath = link.replace(/\s+/g, '');
                    const url = `https://static.emedevents.com/uploads/conferences/certificates/${cleanedPath}`;
                    const fileName = url.split("/").pop();
                    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
                    const options = {
                        fromUrl: url,
                        toFile: localFile,
                    };
                    const downloadResult = await RNFS.downloadFile(options).promise;
                    console.log('Download result:', downloadResult);
                    setPdfUrist(localFile);
                } catch (error) {
                    console.error('Error during file download:', error);
                } finally {
                    setLoadingdownstlv(false);
                }
            };
            showPDF();
        }
    };

    useEffect(() => {
        if (pdfUrist) {
                        /**
 * Open file viewerst utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const openFileViewerst = async () => {
                try {
                    await FileViewer.open(pdfUrist);
                    setPdfUrist(null);
                } catch (error) {
                    console.error('Error opening file viewer:', error);
                }
            };
            openFileViewerst();
        }
    }, [pdfUrist]);
        /**
 * Fetch handle utility.
 * @param {*} page - Input value.
 * @returns {void}
 */
const fetchHandle = (page = pageNum) => {
        const requestId = nanoid();
        requestIdRef.current = requestId;
        statusRef.current = "";
        requestedPageRef.current = page;
        if (page === 0) {
            setInitialLoading(true);
            setStoreAlldata([]);
        }
        let obj = {
            "pageno": page,
            "limit": limit,
            "request_type": "normallist",
            "listby_type": "myactivities"
        };
        setLoading(true);
        connectionrequest()
            .then(() => {
                if (requestIdRef.current !== requestId) return;
                dispatch({
                    ...cmeCourseRequest(obj),
                    meta: { globalResultRequestId: requestId },
                });
            })
            .catch((err) => {
                if (requestIdRef.current !== requestId) return;
                showErrorAlert("Please connect to internet", err);
                setLoading(false);
                setInitialLoading(false);
                setRefreshing(false);
                pendingResetRef.current = false;
                isFetchingMoreRef.current = false;
            });
    };

    const fetchMore = useCallback(() => {
        if (isFetchingMoreRef.current || !hasMoreRef.current || apiReq || loading) {
            return;
        }
        const currentConferences = CMEReducer?.cmeCourseResponse?.conferences;
        if (!Array.isArray(currentConferences) || currentConferences.length < limit) {
            hasMoreRef.current = false;
            return;
        }
        isFetchingMoreRef.current = true;
        pendingResetRef.current = false;
        const nextPage = pageNum + 1;
        setPageNum(nextPage);
        fetchHandle(nextPage);
    }, [apiReq, loading, pageNum, CMEReducer?.cmeCourseResponse?.conferences, limit]);

        /**
 * Full data refresh utility.
 * @returns {void}
 */
const fullDataRefresh = () => {
        hasMoreRef.current = true;
        isFetchingMoreRef.current = false;
        onEndReachedCalledDuringMomentum.current = true;
        pendingResetRef.current = true;
        setRefreshing(true);
        setPageNum(0);
        fetchHandle(0);
    };

    useEffect(() => {
        if (!isFocus || !requestIdRef.current ||
            CMEReducer.cmeCourseRequestId !== requestIdRef.current) return;
        if (CMEReducer.status && CMEReducer.status !== statusRef.current) {
            statusRef.current = CMEReducer.status;
            if (CMEReducer.status === 'CME/cmeCourseRequest') {
                setApiReq(true);
                setLoading(true);
            } else if (CMEReducer.status === 'CME/cmeCourseSuccess') {
                setApiReq(false);
                setInitialLoading(false);
                setRefreshing(false);
                setLoading(false);
                isFetchingMoreRef.current = false;
                const conferences = CMEReducer?.cmeCourseResponse?.conferences;
                const newData = Array.isArray(conferences) ? conferences : [];
                if (newData.length < limit) {
                    hasMoreRef.current = false;
                } else {
                    hasMoreRef.current = true;
                }
                const shouldReplace = requestedPageRef.current === 0 || pendingResetRef.current;
                pendingResetRef.current = false;
                if (shouldReplace) {
                    setStoreAlldata(newData);
                } else {
                    setStoreAlldata(prevData => {
                        const merged = [...prevData, ...newData];
                        return merged.filter(
                            (value, index, self) =>
                                index === self.findIndex(t => t?.id === value?.id)
                        );
                    });
                }
            } else if (CMEReducer.status === 'CME/cmeCourseFailure') {
                setApiReq(false);
                setInitialLoading(false);
                setRefreshing(false);
                pendingResetRef.current = false;
                setLoading(false);
                isFetchingMoreRef.current = false;
                hasMoreRef.current = false;
            }
        } else if (CMEReducer.status === '') {
            statusRef.current = '';
        }
    }, [isFocus, CMEReducer.cmeCourseRequestId, CMEReducer.status, CMEReducer.cmeCourseResponse, pageNum, limit]);

    const filteredItems = useMemo(() => {
        return storeAlldata?.filter(item => {
            const type = parseInt(item?.conference_type);
            const targetTypes = [1, 6, 34];
            return targetTypes?.includes(type);
        }) || [];
    }, [storeAlldata]);

    const compltall = useMemo(() => {
        return filteredItems.filter(item => item?.event_happening_text == "");
    }, [filteredItems]);

    const pendingall = useMemo(() => {
        return filteredItems.filter(item => Boolean(item?.event_happening_text));
    }, [filteredItems]);

    const dataAll = useMemo(() => {
        if (fetchnamelive === "Completed") {
            return compltall;
        }
        if (fetchnamelive === "Pending") {
            return pendingall;
        }
        return filteredItems;
    }, [fetchnamelive, filteredItems, pendingall, compltall]);
        /**
 * Courserender data utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const courserenderData = ({ item, index }) => {
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
            return date.format("MMM D, YYYY").replace('', '');
        };
        const formattedDateend = formatDateEnd(item?.enddate);
        const hasCompletionPct = item?.completed_percentage != null;
        const rawLivePct = Number(item?.completed_percentage ?? 0);
        const liveProgressPct = Number.isFinite(rawLivePct)
            ? Math.min(100, Math.max(0, Math.round(rawLivePct)))
            : 0;
        const isLiveCompleted = liveProgressPct === 100;

        return (
            <View>
                <View style={{ justifyContent: "center", alignSelf: "center", paddingTop: normalize(8), paddingBottom: normalize(2) }}>
                    <View
                        style={{
                            flexDirection: "column",
                            width: normalize(296),
                            borderRadius: normalize(8),
                            backgroundColor: "#FFFFFF",
                            borderWidth: 1,
                            borderColor: "#E5ECF6",
                            paddingHorizontal: normalize(12),
                            paddingVertical: normalize(10),
                            alignItems: "flex-start",
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%', paddingVertical: normalize(2) }}>
                            <TouchableOpacity style={{ flex: 1, paddingRight: normalize(8) }} onPress={() => { titlhandleUrllive(item) }}>
                                <Text numberOfLines={2}
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 15,
                                        color: "#000000",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {item?.title}
                                </Text>
                            </TouchableOpacity>
                            {(item?.certificate?.certificate || item?.needReview) ? (
                                <TouchableOpacity onPress={() => {
                                    setModalviewlive(!modalviewlive);
                                    setNeedReviewlive(item?.needReview);
                                    setOnlineNamelive(item);
                                    setCertificatelive(item?.certificate?.certificate)
                                }}>
                                    <IconDot name="dots-three-vertical" size={22} color={"#848484"} />
                                </TouchableOpacity>
                            ) : <></>}
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: normalize(6) }}>
                            <Calender name="calendar" size={22} color={"#000000"} />
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 12,
                                    color: "#666",
                                    fontWeight: "bold",
                                    marginLeft: normalize(8),
                                }}
                            >
                                {`${formattedDate} - ${formattedDateend}`}
                            </Text>
                        </View>
                        <View style={{ marginTop: normalize(6), height: 1, width: '100%', backgroundColor: "#EEF2F7" }} />
                        {item?.display_cme ? <View style={{ alignSelf: 'flex-start', marginTop: normalize(8) }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#666" }}>
                                {`${item?.display_cme
                                    ? item?.display_cme?.toLowerCase()?.includes("contact hour")
                                        ? item?.display_cme.replace(/contact hour/i, "Contact Hour(s)")
                                        : item?.display_cme
                                    : ""
                                    }`}
                            </Text>
                        </View> : null}
                        {item?.location && <View style={{ alignSelf: 'flex-start', marginTop: normalize(4) }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 13, color: "#666" }}>
                                {item?.location}
                            </Text>
                        </View>}
                        {hasCompletionPct ? (
                            <View style={{ width: '100%', marginTop: normalize(8) }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(4), marginBottom: normalize(4) }}>
                                    {isLiveCompleted ? (
                                        <Image source={Imagepath.Complt} style={{ height: normalize(12), width: normalize(12), resizeMode: "contain" }} />
                                    ) : null}
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: isLiveCompleted ? "#16A34A" : "#475569" }}>
                                        {isLiveCompleted ? "Completed" : `${liveProgressPct}% Completed`}
                                    </Text>
                                </View>
                                <View style={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: "#E2E8F0", overflow: "hidden" }}>
                                    <View style={{ width: `${liveProgressPct}%`, height: '100%', borderRadius: 3, backgroundColor: isLiveCompleted ? "#16A34A" : Colorpath.ButtonColr }} />
                                </View>
                            </View>
                        ) : null}
                        {item?.button_display_text ? <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(10), width: '100%' }}>
                            <TouchableOpacity onPress={() => {
                                setStatepush(creditwholelive);
                                if (item?.buttonText === "Revise Course") {
                                    navigation.navigate("VideoComponent", { RoleData: item });
                                } else {
                                    fullActionlive(item);
                                }
                            }} style={{ height: normalize(28), width: '100%', borderRadius: normalize(5), justifyContent: "center", alignItems: "center", borderColor: Colorpath.ButtonColr, borderWidth: 0.8 }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 13,
                                        color: "#2C4DB9",
                                    }}
                                >
                                    {item?.button_display_text}
                                </Text>
                            </TouchableOpacity>
                        </View> : null}
                    </View>
                </View>
            </View>
        )
    }
    return (
        <View style={{ flex: 1 }}>
            {initialLoading && storeAlldata.length === 0 ? (
                <LiveCourseListSkeleton count={4} />
            ) : (
                <FlatList
                    data={dataAll}
                    renderItem={courserenderData}
                    keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
                    onMomentumScrollBegin={() => {
                        onEndReachedCalledDuringMomentum.current = false;
                    }}
                    onEndReached={() => {
                        if (!onEndReachedCalledDuringMomentum.current) {
                            fetchMore();
                            onEndReachedCalledDuringMomentum.current = true;
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    contentContainerStyle={{ paddingBottom: normalize(140) }}
                    scrollEventThrottle={16}
                    ListFooterComponent={
                        loading && pageNum > 0 ? (
                            <ActivityIndicator color={Colorpath.ButtonColr} size="small" style={{ marginVertical: normalize(15) }} />
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
                            <Text
                                style={{
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    color: Colorpath.grey,
                                    fontWeight: 'bold',
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 16,
                                    paddingTop: normalize(30),
                                }}>
                                No data found
                            </Text>
                        ) : null
                    }
                />
            )}
            <Modal
                animationIn={'slideInUp'}
                animationOut={'slideOutDown'}
                isVisible={modalviewlive}
                backdropColor={Colorpath.black}
                style={{
                    width: '100%',
                    alignSelf: 'center',
                    margin: 0,
                }}
                onBackdropPress={() => setModalviewlive(false)}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setModalviewlive(false)}>

                    <View
                        style={{
                            borderRadius: normalize(7),
                            height: Fulldatalive?.length == 1
                                ? normalize(80)
                                : Fulldatalive?.length == 2
                                    ? normalize(140)
                                    : normalize(140)
                            ,
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            backgroundColor: '#fff',
                        }}>
                        <FlatList
                            contentContainerStyle={{
                                paddingBottom: normalize(70),
                                paddingTop: normalize(7),
                            }}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item => item.id.toString()}
                            data={Fulldatalive}
                            renderItem={({ item }) => {
                                                                /**
 * Handles press.
 * @returns {void}
 */
const handlePress = () => {
                                    setModalviewlive(false);
                                    if (item?.id === 1) {
                                        if (certificatelive) {
                                            // Add a small delay to ensure the component is ready
                                            const timer = setTimeout(() => {
                                                handleLinkst(certificatelive);
                                            }, 500); // 100ms delay

                                            return () => clearTimeout(timer); // Cleanup the timer
                                        }
                                    } else if (item?.id === 0) {
                                        navigation?.navigate("RateReview", { onlineName: onlineNamelive });
                                    }
                                };
                                return (
                                    <TouchableOpacity
                                        onPress={handlePress}
                                        style={styles.dropDownItem}
                                    >
                                        <Text style={styles.dropDownItemText}>
                                            {item?.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

        </View>
    )
}

/**
 * Livecourse default export.
 *
 * @returns {*}
 */
export default Livecourse
/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    dropDownItem: {
        borderWidth: 1,
        marginTop: normalize(10),
        justifyContent: 'center',
        alignItems: 'center',
        height: normalize(40),
        width: '85%',
        alignSelf: 'center',
    },
    dropDownItemText: {
        fontSize: 16,
        lineHeight: normalize(14),
        textAlign: 'center',
        color: Colorpath.black,
        textTransform: 'capitalize',
        fontFamily: Fonts.InterMedium
    },
})
