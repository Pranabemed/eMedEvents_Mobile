/**
 * Non main screen module. Renders a React Native screen or a screen-scoped support component. Exported members: NonMain, handleUrl, titlhandleUrl, downCredit, fullAction, handleLinkst, showPDF, openFileViewerst, fetchHandle, onBackPress, courserenderData, handlePress, styles.
 */

import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Platform, BackHandler, Animated } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Fonts from '../../Themes/Fonts';
import IconDot from 'react-native-vector-icons/Entypo';
import Colorpath from '../../Themes/Colorpath';
import Imagepath from '../../Themes/Imagepath';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import normalize from '../../Utils/Helpers/Dimen';
import { cmeCourseRequest } from '../../Redux/Reducers/CMEReducer';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import { AppContext } from '../GlobalSupport/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable NonMain component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const NonMainListSkeleton = ({ count = 4 }) => {
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
                    key={`nonmain-skeleton-${index}`}
                    style={[styles.skeletonCard, { opacity: pulseAnim }]}
                >
                    <View style={styles.skeletonTitleBar} />
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

const NonMain = (props) => {
    const {
        statepush,
        setStatepush
    } = useContext(AppContext);
    const navigation = useNavigation();
    const [modalview, setModalview] = useState(false);
    const [needReview, setNeedReview] = useState(0);
    const [onlineName, setOnlineName] = useState("");
    const [certificate, setCertificate] = useState("");
    const [pdfUrist, setPdfUrist] = useState("");
    const [loadingdownst, setLoadingdownst] = useState(false);
    const threeDotData = [{ id: 0, name: "Rate & Review" }, { id: 1, name: "Download Certificate" }]
    const duplicateData = [{ id: 1, name: "Download Certificate" }]
    const duplicateDataReview = [{ id: 0, name: "Rate & Review" }]
    const CMEReducer = useSelector(state => state.CMEReducer);
    const dispatch = useDispatch();
    const recentRequestRef = useRef(null);
    const [recentCourses, setRecentCourses] = useState([]);
    const [recentLoading, setRecentLoading] = useState(true);
    const Fulldata = (needReview == 1 && certificate) ? threeDotData :
        (needReview == 1 && !certificate) ? duplicateDataReview :
            (needReview == 0 && certificate) ? duplicateData : null;
        /**
 * Handles url.
 * @returns {void}
 */
const handleUrl = () => {
        const url = onlineName?.detailpage_url;
        const result = url.split('/').pop();
        console.log(result, "webcast url=======", onlineName);
        if (result) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: props?.route?.params?.myact?.creditData } })
        }
    }
        /**
 * Titlhandle url utility.
 * @param {*} make - Input value.
 * @returns {void}
 */
const titlhandleUrl = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = urltitle.split('/').pop();
        console.log(resulttitle, "webcast url=======", make);
        if (resulttitle) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, creditData: props?.route?.params?.myact?.creditData } })
        }
    }
        /**
 * Down credit utility.
 * @returns {void}
 */
const downCredit = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: "TabNav", params: { initialRoute: "Home" } }
                ],
            })
        );

    }
        /**
 * Full action utility.
 * @param {*} dataItem - Input value.
 * @returns {void}
 */
const fullAction = (dataItem) => {
        const url = dataItem?.detailpage_url;
        const result = url.split('/').pop();
        console.log(result, "webcast url=======", dataItem);
        if (dataItem?.current_activity_api == "activitysession") {
            navigation.navigate("VideoComponent", { RoleData: dataItem });
        } else if (dataItem?.current_activity_api == "introduction") {
            navigation.navigate("StartTest", { conference: dataItem?.id })
        } else if (dataItem?.current_activity_api == "startTest") {
            navigation.navigate("PreTest", { activityID: { activityID: dataItem?.current_activity_id, conference_id: dataItem?.id } })
        } else if (dataItem?.button_display_text == "Add Credits") {
            navigation.navigate("AddCredits", { mainAdd: props?.route?.params?.myact?.creditData })
        } else if (result) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: props?.route?.params?.myact?.creditData } })
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
                setLoadingdownst(true);
                try {
                    const cleanedPath = link.replace(/\s+/g, '');
                    const url = `https://static.emedevents.com/uploads/conferences/certificates/${cleanedPath}`;
                    console.log(url, "url---------");
                    const fileName = url.split("/").pop();
                    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
                    console.log('Downloading file from:', url);
                    console.log('Saving file to:', localFile);
                    const options = {
                        fromUrl: url,
                        toFile: localFile,
                    };
                    const downloadResult = await RNFS.downloadFile(options).promise;
                    console.log('Download result:', downloadResult);
                    setPdfUrist(localFile);
                    console.log('File downloaded successfully to:', localFile);
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
                    console.log('Opening file viewer for:', pdfUrist);
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
 * @returns {void}
 */
const fetchHandle = () => {
        const requestId = nanoid();
        recentRequestRef.current = requestId;
        setRecentLoading(true);
        setRecentCourses([]);
        let obj = {
            "pageno": 0,
            "limit": 9,
            "request_type": "normallist",
            "listby_type": "view"
        };
        connectionrequest()
            .then(() => {
                if (recentRequestRef.current !== requestId) return;
                dispatch({ ...cmeCourseRequest(obj), meta: { globalResultRequestId: requestId } });
            })
            .catch((err) => {
                if (recentRequestRef.current !== requestId) return;
                setRecentLoading(false);
                showErrorAlert("Please connect to internet", err);
            });
    };
    useEffect(() => {
        if (props?.route?.params?.myact?.recnt == "recnt") {
            fetchHandle();
        }
        return () => { recentRequestRef.current = null; };
    }, [props?.route?.params?.myact?.recnt]);
    useEffect(() => {
        if (!recentRequestRef.current || CMEReducer?.cmeCourseRequestId !== recentRequestRef.current) return;
        if (CMEReducer?.status === 'CME/cmeCourseSuccess') {
            const conferences = CMEReducer?.cmeCourseResponse?.conferences;
            setRecentCourses(Array.isArray(conferences) ? conferences : []);
            setRecentLoading(false);
        } else if (CMEReducer?.status === 'CME/cmeCourseFailure') {
            setRecentLoading(false);
        }
    }, [CMEReducer?.status, CMEReducer?.cmeCourseRequestId, CMEReducer?.cmeCourseResponse]);
    useEffect(() => {
                /**
 * On back press utility.
 * @returns {boolean}
 */
const onBackPress = () => {
            downCredit();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
        /**
 * Courserender data utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const courserenderData = ({ item, index }) => {
        const isRecentlyViewed = Boolean(props?.route?.params?.myact?.recnt);
        const priceText = String(item?.display_price ?? item?.price ?? item?.ticketprice ?? '').trim();
        const isFreePrice = priceText.toUpperCase() === 'FREE' || priceText === '0';
        const priceLabel = isFreePrice
            ? 'Free'
            : (priceText ? `${item?.display_currency_code || item?.currency_code || 'US$'}${priceText}` : '');
        const hasCompletedPct = item?.completed_percentage != null && item?.completed_percentage !== '';
        const rawProgress = Number(item?.completed_percentage ?? 0);
        const progressPercent = Number.isFinite(rawProgress)
            ? Math.min(100, Math.max(0, Math.round(rawProgress)))
            : 0;
        const isCourseCompleted = progressPercent === 100;
        const cmeLabel = item?.display_cme
            ? (item.display_cme.toLowerCase().includes("contact hour")
                ? item.display_cme.replace(/contact hour/i, "Contact Hour(s)")
                : item.display_cme)
            : "";

        return (
            <View style={styles.cardOuter}>
                <View style={styles.courseCard}>
                    <View style={styles.cardHeaderRow}>
                        <TouchableOpacity style={styles.titleTouch} onPress={() => { titlhandleUrl(item); }}>
                            <Text numberOfLines={2} style={styles.cardTitle}>
                                {item?.title}
                            </Text>
                        </TouchableOpacity>
                        {(item?.certificate?.certificate || item?.needReview) ? (
                            <TouchableOpacity
                                style={styles.moreButton}
                                onPress={() => {
                                    setModalview(!modalview);
                                    setNeedReview(item?.needReview);
                                    setOnlineName(item);
                                    setCertificate(item?.certificate?.certificate);
                                }}
                            >
                                <IconDot name="dots-three-vertical" size={20} color={"#64748B"} />
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    {(cmeLabel || item?.average_rating) ? (
                        <View style={styles.recentMetadata}>
                            {cmeLabel ? (
                                <View style={styles.cmeBadge}>
                                    <Text style={styles.cmeBadgeText}>{cmeLabel}</Text>
                                </View>
                            ) : null}
                            {item?.average_rating ? (
                                <View style={styles.recentRating}>
                                    <Image source={Imagepath.Star} style={styles.starIcon} />
                                    <Text style={styles.ratingText}>{item.average_rating}</Text>
                                </View>
                            ) : null}
                        </View>
                    ) : null}

                    <View style={styles.cardDivider} />

                    <View style={styles.cardFooterRow}>
                        <View style={styles.footerInfoCol}>
                            {isRecentlyViewed && priceText ? (
                                <Text style={[styles.priceText, isFreePrice && styles.freePriceText]}>
                                    {priceLabel}
                                </Text>
                            ) : null}
                            {hasCompletedPct ? (
                                <View style={styles.progressWrap}>
                                    <View style={styles.progressLabelRow}>
                                        {isCourseCompleted ? (
                                            <Image source={Imagepath.Complt} style={styles.completeIcon} />
                                        ) : null}
                                        <Text style={[styles.progressText, isCourseCompleted && styles.progressTextComplete]}>
                                            {isCourseCompleted ? "Completed" : `${progressPercent}% Completed`}
                                        </Text>
                                    </View>
                                    <View style={styles.progressTrack}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                {
                                                    width: `${progressPercent}%`,
                                                    backgroundColor: isCourseCompleted ? "#16A34A" : Colorpath.ButtonColr,
                                                },
                                            ]}
                                        />
                                    </View>
                                </View>
                            ) : null}
                        </View>

                        {(item?.button_display_text || item?.buttonText) ? (
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => {
                                    setStatepush(props?.route?.params?.myact?.creditData);
                                    if (item?.buttonText === "Revise Course") {
                                        navigation.navigate("VideoComponent", { RoleData: item });
                                    } else {
                                        fullAction(item);
                                    }
                                }}
                                style={styles.ctaButton}
                            >
                                <Text numberOfLines={1} style={styles.ctaButtonText}>
                                    {item?.button_display_text || item?.buttonText}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
        );
    };
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    const isRecentlyViewedScreen = Boolean(props?.route?.params?.myact?.recnt);
    const listData = isRecentlyViewedScreen
        ? recentCourses
        : (props?.route?.params?.myact?.realdata ?? []);
    const isLoadingRecent = isRecentlyViewedScreen && recentLoading;

    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={styles.screenContainer}>
                <View style={styles.headerContainer}>
                    <PageHeader
                        title={props?.route?.params?.myact?.recnt ? "Recently Viewed" : "My Activities"}
                        onBackPress={downCredit}
                    />
                </View>
                <View style={styles.listWrapper}>
                    {isLoadingRecent ? (
                        <NonMainListSkeleton count={4} />
                    ) : (
                        <FlatList
                            data={listData}
                            renderItem={courserenderData}
                            keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
                            onEndReachedThreshold={0.5}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContentContainer}
                            ListEmptyComponent={
                                !isLoadingRecent ? (
                                    <View style={styles.emptyWrapper}>
                                        <View style={styles.emptyCard}>
                                            <Text style={styles.emptyTitle}>No data found</Text>
                                        </View>
                                    </View>
                                ) : null
                            }
                        />
                    )}
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
            </SafeAreaView>
        </>
    );
}

/**
 * Non main default export.
 *
 * @returns {*}
 */
export default NonMain;
/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#F4F7FC',
    },
    headerContainer: {
        backgroundColor: Colorpath.white,
    },
    listWrapper: {
        flex: 1,
    },
    listContentContainer: {
        paddingHorizontal: normalize(12),
        paddingTop: normalize(10),
        paddingBottom: normalize(60),
    },
    cardOuter: {
        marginBottom: normalize(10),
    },
    courseCard: {
        flexDirection: 'column',
        width: '100%',
        borderRadius: normalize(10),
        backgroundColor: Colorpath.white,
        borderWidth: 1,
        borderColor: '#E5ECF6',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(11),
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
    },
    titleTouch: {
        flex: 1,
        minWidth: 0,
        paddingRight: normalize(8),
    },
    cardTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14.5,
        lineHeight: 20,
        color: '#0F172A',
    },
    moreButton: {
        padding: normalize(2),
    },
    recentMetadata: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '100%',
        marginTop: normalize(8),
        gap: normalize(8),
    },
    cmeBadge: {
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(4),
        borderRadius: normalize(6),
        backgroundColor: '#FFF2E0',
    },
    cmeBadgeText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 11.5,
        color: '#9A3412',
    },
    recentRating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: normalize(6),
        paddingHorizontal: normalize(7),
        paddingVertical: normalize(3),
    },
    starIcon: {
        height: normalize(11),
        width: normalize(11),
        resizeMode: 'contain',
        marginRight: normalize(4),
    },
    ratingText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12,
        color: '#334155',
        includeFontPadding: false,
    },
    cardDivider: {
        marginTop: normalize(9),
        marginBottom: normalize(9),
        height: 1,
        width: '100%',
        backgroundColor: '#EEF2F7',
    },
    cardFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: normalize(10),
    },
    footerInfoCol: {
        flex: 1,
        alignItems: 'flex-start',
    },
    priceText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#0F172A',
    },
    freePriceText: {
        color: '#059669',
    },
    progressWrap: {
        width: '100%',
        marginTop: normalize(5),
    },
    progressLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalize(4),
        marginBottom: normalize(4),
    },
    completeIcon: {
        height: normalize(12),
        width: normalize(12),
        resizeMode: 'contain',
    },
    progressText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 11.5,
        color: '#475569',
    },
    progressTextComplete: {
        color: '#16A34A',
    },
    progressTrack: {
        width: '100%',
        height: 5,
        borderRadius: 3,
        backgroundColor: '#E2E8F0',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    ctaButton: {
        minHeight: normalize(30),
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(5),
        borderRadius: normalize(6),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        borderColor: '#DBEAFE',
        borderWidth: 1,
    },
    ctaButtonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12.5,
        color: Colorpath.ButtonColr,
        textAlign: 'center',
        includeFontPadding: false,
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
        paddingVertical: normalize(22),
        paddingHorizontal: normalize(14),
        alignItems: 'center',
    },
    emptyTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 15,
        color: '#334155',
        textAlign: 'center',
    },
    skeletonContainer: {
        paddingHorizontal: normalize(12),
        paddingTop: normalize(10),
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
        width: '80%',
        borderRadius: 6,
        backgroundColor: '#E8EEF5',
    },
    skeletonMetaBar: {
        height: 11,
        width: '44%',
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
        height: normalize(28),
        width: normalize(96),
        borderRadius: 6,
        backgroundColor: '#E8EEF5',
    },
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
