/**
 * Online course screen module. Renders a React Native screen or a screen-scoped support component. Exported members: OnlineCourse, openFilterModal, handleSave, handleUrl, titlhandleUrl, fullAction, fetchHandle, fullDataRefresh, handleLinkst, showPDF, openFileViewerst, courserenderData, handlePress, styles.
 */

import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl, StyleSheet, Platform, Alert, Animated } from 'react-native';
import React, { useEffect, useState, useCallback, useContext, useRef, useMemo } from 'react';
import Fonts from '../../Themes/Fonts';
import IconDot from 'react-native-vector-icons/Entypo';
import Colorpath from '../../Themes/Colorpath';
import Imagepath from '../../Themes/Imagepath';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { CommonActions, useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { cmeCourseRequest, clearCmeCourseData } from '../../Redux/Reducers/CMEReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Modal from 'react-native-modal';
import ScheduleCourse from './ScheduleCourse';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import Calend from 'react-native-vector-icons/AntDesign';
import Loader from '../../Utils/Helpers/Loader';
import { AppContext } from '../GlobalSupport/AppContext';
import normalize from '../../Utils/Helpers/Dimen';

/**
 * Reusable OnlineCourse component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const CourseListSkeleton = ({ count = 4 }) => {
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
                    key={`course-skeleton-${index}`}
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
                    <View style={{ height: 12, width: '52%', borderRadius: 6, backgroundColor: '#EEF2F7', marginTop: 8 }} />
                    <View style={{ marginTop: 12, height: 1, width: '100%', backgroundColor: '#F1F5F9' }} />
                    <View style={{ height: 11, width: '40%', borderRadius: 5, backgroundColor: '#EEF2F7', marginTop: 10 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        <View style={{ flex: 1, marginRight: normalize(12) }}>
                            <View style={{ height: 11, width: '55%', borderRadius: 5, backgroundColor: '#E8EEF5' }} />
                            <View style={{ height: 6, width: '100%', borderRadius: 3, backgroundColor: '#E8EEF5', marginTop: 8 }} />
                        </View>
                        <View style={{ height: normalize(28), width: normalize(105), borderRadius: normalize(5), backgroundColor: '#E8EEF5' }} />
                    </View>
                </Animated.View>
            ))}
        </View>
    );
};

const OnlineCourse = ({ loading, setLoading, fetchname, crediwhole, loadingdownst, setLoadingdownst, filteredItems, setFilteredItems, setPendingall, pendingall, setCompltall, compltall, dataAll, setDataAll }) => {
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
    const [pageNum, setPageNum] = useState(0);
    const [limit, setLimit] = useState(9);
    const [refreshing, setRefreshing] = useState(false);
    const [modalview, setModalview] = useState(false);
    const [needReview, setNeedReview] = useState(0);
    const [onlineName, setOnlineName] = useState("");
    const [certificate, setCertificate] = useState("");
    const [filtermodal, setFiltermodal] = useState(false);
    const [pdfUrist, setPdfUrist] = useState("");
        /**
 * Open filter modal utility.
 * @returns {void}
 */
const openFilterModal = () => {
        setFiltermodal(!filtermodal);
    }
        /**
 * Handles save.
 * @returns {void}
 */
const handleSave = () => {
        setFiltermodal(false);
    };
    const threeDotData = [{ id: 0, name: "Rate & Review" }, { id: 1, name: "Download Certificate" }]
    const duplicateData = [{ id: 1, name: "Download Certificate" }]
    const duplicateDataReview = [{ id: 0, name: "Rate & Review" }]
    const Fulldata = (needReview == 1 && certificate) ? threeDotData :
        (needReview == 1 && !certificate) ? duplicateDataReview :
            (needReview == 0 && certificate) ? duplicateData : null;

        /**
 * Handles url.
 * @returns {void}
 */
const handleUrl = () => {
        const url = onlineName?.detailpage_url;
        const result = typeof url === 'string' ? url.split('/').pop() : '';
        if (result) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, shareUrl: url, creditData: crediwhole } })
        }
    }
        /**
 * Titlhandle url utility.
 * @param {*} make - Input value.
 * @returns {void}
 */
const titlhandleUrl = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = typeof urltitle === 'string' ? urltitle.split('/').pop() : '';
        if (resulttitle) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, shareUrl: urltitle, creditData: crediwhole } })
        }
    }
        /**
 * Full action utility.
 * @param {*} dataItem - Input value.
 * @returns {void}
 */
const fullAction = (dataItem) => {
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
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, shareUrl: url, creditData: crediwhole } })
        }
    }
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
        if (typeof setLoading === 'function') {
            setLoading(true);
        }
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
                if (typeof setLoading === 'function') {
                    setLoading(false);
                }
                setInitialLoading(false);
                setRefreshing(false);
                pendingResetRef.current = false;
                isFetchingMoreRef.current = false;
            });
    };
    useFocusEffect(
        useCallback(() => {
            statusRef.current = "";
            hasMoreRef.current = true;
            isFetchingMoreRef.current = false;
            onEndReachedCalledDuringMomentum.current = true;
            pendingResetRef.current = true;
            setPageNum(0);
            fetchHandle(0);
            return () => { requestIdRef.current = null; };
        }, [dispatch])
    );
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
                if (typeof setLoading === 'function') {
                    setLoading(true);
                }
            } else if (CMEReducer.status === 'CME/cmeCourseSuccess') {
                setApiReq(false);
                setInitialLoading(false);
                setRefreshing(false);
                if (typeof setLoading === 'function') {
                    setLoading(false);
                }
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
                if (typeof setLoading === 'function') {
                    setLoading(false);
                }
                isFetchingMoreRef.current = false;
                hasMoreRef.current = false;
            }
        } else if (CMEReducer.status === '') {
            statusRef.current = '';
        }
    }, [isFocus, CMEReducer.cmeCourseRequestId, CMEReducer.status, CMEReducer.cmeCourseResponse, pageNum, limit, setLoading]);

    const memoFilteredItems = useMemo(() => {
        return storeAlldata?.filter(item => {
            const type = parseInt(item?.conference_type);
            const excludedTypes = [1, 6, 34];
            return !excludedTypes.includes(type);
        }) || [];
    }, [storeAlldata]);

    const memoCompltall = useMemo(() => {
        return memoFilteredItems.filter(item => item?.completed_percentage === 100);
    }, [memoFilteredItems]);

    const memoPendingall = useMemo(() => {
        return memoFilteredItems.filter(item => item?.completed_percentage >= 0 && item?.completed_percentage <= 99);
    }, [memoFilteredItems]);

    const memoDataAll = useMemo(() => {
        if (fetchname === "Pending") {
            return memoPendingall;
        }
        if (fetchname === "Completed") {
            return memoCompltall;
        }
        return memoFilteredItems;
    }, [fetchname, memoFilteredItems, memoPendingall, memoCompltall]);

    useEffect(() => {
        if (typeof setDataAll === 'function') {
            setDataAll(memoDataAll);
        }
        if (typeof setFilteredItems === 'function') {
            setFilteredItems(memoFilteredItems);
        }
        if (typeof setCompltall === 'function') {
            setCompltall(memoCompltall);
        }
        if (typeof setPendingall === 'function') {
            setPendingall(memoPendingall);
        }
    }, [memoDataAll, memoFilteredItems, memoCompltall, memoPendingall, setDataAll, setFilteredItems, setCompltall, setPendingall]);
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
                setLoadingdownst(true);
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
                    setLoadingdownst(false);
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
 * Courserender data utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const courserenderData = ({ item, index }) => {
        const rawPercent = Number(item?.completed_percentage ?? 0);
        const progressPercent = Number.isFinite(rawPercent)
            ? Math.min(100, Math.max(0, Math.round(rawPercent)))
            : 0;
        const isCourseCompleted = progressPercent === 100;

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
                            <TouchableOpacity style={{ flex: 1, paddingRight: normalize(8) }} onPress={() => { titlhandleUrl(item); }}>
                                <Text
                                    numberOfLines={2}
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
                                    setModalview(!modalview);
                                    setNeedReview(item?.needReview);
                                    setOnlineName(item);
                                    setCertificate(item?.certificate?.certificate);
                                }}>
                                    <IconDot name="dots-three-vertical" size={22} color={"#848484"} />
                                </TouchableOpacity>
                            ) : null}
                        </View>

                        <View style={{ marginTop: normalize(8), height: 1, width: '100%', backgroundColor: "#EEF2F7" }} />

                        {item?.display_cme ? <View style={{ marginTop: normalize(6), alignSelf: 'flex-start' }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#666666" }}>
                                {`${item?.display_cme
                                    ? item?.display_cme?.toLowerCase()?.includes("contact hour")
                                        ? item?.display_cme.replace(/contact hour/i, "Contact Hour(s)")
                                        : item?.display_cme
                                    : ""
                                    }`}
                            </Text>
                        </View> : null}

                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: normalize(8), width: '100%', gap: normalize(10) }}>
                            <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: '100%', marginBottom: normalize(5) }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(4) }}>
                                        {isCourseCompleted ? (
                                            <Image source={Imagepath.Complt} style={{ height: normalize(12), width: normalize(12), resizeMode: "contain" }} />
                                        ) : null}
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 12,
                                                color: isCourseCompleted ? "#16A34A" : "#475569",
                                            }}
                                        >
                                            {isCourseCompleted ? "Completed" : `${progressPercent}% Completed`}
                                        </Text>
                                    </View>
                                    {item?.average_rating ? <View style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: normalize(3)
                                    }}>
                                        <Image
                                            source={Imagepath.Star}
                                            style={{
                                                height: normalize(10),
                                                width: normalize(10),
                                                resizeMode: "contain",
                                                top: -1
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterBold,
                                                fontSize: 13,
                                                color: "#666666",
                                                lineHeight: normalize(14),
                                                height: normalize(14),
                                                textAlignVertical: "center",
                                                includeFontPadding: false
                                            }}
                                        >
                                            {item?.average_rating}
                                        </Text>
                                    </View> : null}
                                </View>
                                <View
                                    style={{
                                        width: '100%',
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: "#E2E8F0",
                                        overflow: "hidden",
                                    }}
                                >
                                    <View
                                        style={{
                                            width: `${progressPercent}%`,
                                            height: '100%',
                                            borderRadius: 3,
                                            backgroundColor: isCourseCompleted ? "#16A34A" : Colorpath.ButtonColr,
                                        }}
                                    />
                                </View>
                            </View>

                            {item?.button_display_text ? <TouchableOpacity
                                onPress={() => {
                                    setStatepush(statepush);
                                    if (item?.buttonText === "Revise Course") {
                                        setStatepush(statepush);
                                        navigation.navigate("VideoComponent", { RoleData: item });
                                    } else {
                                        setStatepush(statepush);
                                        fullAction(item);
                                    }
                                }}
                                style={{
                                    height: normalize(28),
                                    minWidth: normalize(110),
                                    paddingHorizontal: normalize(10),
                                    borderRadius: normalize(5),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderColor: Colorpath.ButtonColr,
                                    borderWidth: 0.8
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 13,
                                        color: "#2C4DB9",
                                    }}
                                >
                                    {item?.button_display_text}
                                </Text>
                            </TouchableOpacity> : null}
                        </View>
                    </View>
                </View>
            </View>

        );
    };
    return (
        <View style={{ flex: 1 }}>
            {initialLoading && storeAlldata.length === 0 ? (
                <CourseListSkeleton count={4} />
            ) : (
                <FlatList
                    data={memoDataAll}
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
            {/* {This code for Schedule a course button,please don't remove} */}
            {/* <View style={{
                position: "absolute",
                bottom: 0,
                top: 350,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center"
            }}>
                <TouchableOpacity onPress={() => { navigation.navigate("CMEPlanner"); }} style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    height: normalize(50),
                    width: normalize(170),
                    backgroundColor: Colorpath.white,
                    borderWidth: 0.5,
                    borderColor: "#AAAAAA",
                    borderRadius: normalize(50),
                    paddingHorizontal: normalize(15)
                }}>
                    <Calend name="calendar" size={25} color={Colorpath.black} style={{ marginRight: normalize(10) }} />
                    <Text style={{
                        fontFamily: Fonts.InterMedium,
                        fontSize: 14,
                        color: Colorpath.black,
                    }}>
                        {"Schedule a Course "}
                    </Text>
                </TouchableOpacity>
            </View> */}
            <ScheduleCourse
                isfilterVisible={filtermodal}
                onfilterFalse={openFilterModal}
                onSave={handleSave}
            />
            <Modal
                animationIn={'slideInUp'}
                animationOut={'slideOutDown'}
                isVisible={modalview}
                backdropColor={Colorpath.black}
                style={{
                    width: '100%',
                    alignSelf: 'center',
                    margin: 0,
                }}
                onBackdropPress={() => setModalview(false)}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setModalview(false)}>

                    <View
                        style={{
                            borderRadius: normalize(7),
                            height: Fulldata?.length == 1
                                ? normalize(80)
                                : Fulldata?.length == 2
                                    ? normalize(140)
                                    : normalize(140),
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
                            data={Fulldata}
                            renderItem={({ item }) => {
                                                                /**
 * Handles press.
 * @returns {void}
 */
const handlePress = () => {
                                    setModalview(false);
                                    if (item?.id === 1) {
                                        if (certificate) {
                                            // Add a small delay to ensure the component is ready
                                            const timer = setTimeout(() => {
                                                handleLinkst(certificate);
                                            }, 500); // 100ms delay

                                            return () => clearTimeout(timer); // Cleanup the timer
                                        }
                                    } else if (item?.id === 0) {
                                        navigation?.navigate("RateReview", { onlineName: onlineName });
                                    } else if (item?.id === 2) {
                                        handleUrl();
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
    );
}

/**
 * Online course default export.
 *
 * @returns {*}
 */
export default OnlineCourse;
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
