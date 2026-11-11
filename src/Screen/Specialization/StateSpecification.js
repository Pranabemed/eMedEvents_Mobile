/**
 * State specification screen module. Renders a React Native screen or a screen-scoped support component. Exported members: StateSpecification, StateHeader, stateAction, getStatusText, handleLinkst, showPDF, openFileViewerst, courserenderData, getStatePrice, handleUrlPage, registercourserenderData, onBackPress, cleanNumber, handlePress, styles.
 */

import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, Platform, StyleSheet, Alert, BackHandler, useWindowDimensions } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import useComplianceRefresh from '../../Utils/Hooks/useComplianceRefresh';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import IconDot from 'react-native-vector-icons/Entypo';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import AuthReducer from '../../Redux/Reducers/AuthReducer';
import { useSelector } from 'react-redux';
import CourseShimmer from '../../Components/CourseShimmer';
import Modal from 'react-native-modal';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import Loader from '../../Utils/Helpers/Loader';
import { AppContext } from '../GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable StateSpecification component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const StateSpecification = (props) => {
    useComplianceRefresh(props.navigation, props.route?.params, true);
    const { isConnected } = useContext(AppContext);
    const { fontScale } = useWindowDimensions();
    const AuthReducer = useSelector(state => state.AuthReducer);
    console.log(AuthReducer?.loginResponse, "AuthReducer?.loginResponse?")
    console.log(props?.route?.params?.fullData?.fullData?.suggested_cources, props?.route?.params?.fullData, "ndata1223333ew======", props?.route?.params?.fullData?.addCreds);
    const [modalviewstate, setModalviewstate] = useState(false);
    const [onlineName, setOnlineName] = useState("");
    const [certificatestate, setCertificatestate] = useState("");
    const [needReview, setNeedReview] = useState(0);
    // const Fulldata = [{ id: 0, name: "Download" },{id:1,name: "Rate & Review"}]
    const [loadingdownst, setLoadingdownst] = useState(false);
    const [pdfUrist, setPdfUrist] = useState("");
    const [textget, setTextget] = useState("");
    const [loads, setLoads] = useState(false);
    const threeDotData = [{ id: 0, name: "Rate & Review" }, { id: 1, name: "Download" }]
    const duplicateData = [{ id: 1, name: "Download" }]
    const duplicateDataReview = [{ id: 0, name: "Rate & Review" }]
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const Fulldata = (needReview == 1 && certificatestate) ? threeDotData :
        (needReview == 1 && !certificatestate) ? duplicateDataReview :
            (needReview == 0 && certificatestate) ? duplicateData : null;
        /**
 * State header component.
 * @returns {void}
 */
const StateHeader = () => {
        props.navigation.goBack();
    }
        /**
 * State action utility.
 * @param {*} stateRole - Input value.
 * @returns {void}
 */
const stateAction = (stateRole) => {
        console.log(stateRole, "stateRole===============");
        if (stateRole?.current_activity_api == "activitysession") {
            props?.navigation.navigate("VideoComponent", { RoleData: stateRole });
        } else if (stateRole?.current_activity_api == "introduction") {
            props?.navigation.navigate("StartTest", { conference: stateRole?.id })
        } else if (stateRole?.current_activity_api == "startTest") {
            props?.navigation.navigate("PreTest", { activityID: { activityID: stateRole?.current_activity_id, conference_id: stateRole?.id } });
        } else if (stateRole?.button_display_text == "Add Credits") {
            props.navigation.navigate("AddCredits", { mainAdd: props?.route?.params?.fullData?.addCreds });
        }
    }
    useEffect(() => {
                /**
 * Returns status text.
 * @param {*} courses - Input value.
 * @returns {*}
 */
const getStatusText = (courses) => {
            return courses.every(course => course.completed_percentage == 100) ? "Suggestedtext" : "nottrue";
        };
        if (props?.route?.params?.fullData?.fullData?.registered_cources?.length > 0) {
            const makeitCorr = getStatusText(props?.route?.params?.fullData?.fullData?.registered_cources);
            setTextget(makeitCorr);
            console.log("makeitcorr=======", makeitCorr)
        }

    }, [props?.route?.params?.fullData])
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
                    setTimeout(async () => {
                        setLoads(false);
                        await FileViewer.open(pdfUrist);
                    }, 2000);
                    setPdfUrist(null);
                } catch (error) {
                    console.error('Error opening file viewer:', error);
                }
            };
            openFileViewerst();
        }
    }, [pdfUrist]);
    const cardHeight = Math.max(normalize(108), 132) * Math.max(1, fontScale);

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
     * Returns original price before Prime discount.
     * @param {number} swipe - Discount ratio (0..1).
     * @param {string|number} down - Discounted price.
     * @returns {number|null}
     */
    const getStatePrice = (swipe, down) => {
        const price = Number(String(down ?? '').replace(/,/g, ''));
        return Number.isFinite(price) && swipe > 0 && swipe < 1
            ? Math.round(price / (1 - swipe)) : null;
    };

    /**
     * Courserender data utility.
     * @param {Object} props - Input object.
     * @param {*} props.item - Nested property value.
     * @param {*} props.index - Nested property value.
     * @returns {JSX.Element}
     */
    const courserenderData = ({ item, index }) => {
        const statePercentage = Math.min(100, Math.max(0, Number(item?.emed_commission) || 0));
        const formattedPct = Number(statePercentage.toFixed(1));
        const statePrice = getStatePrice(statePercentage / 100, item?.display_price);
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
                            <View style={styles.primeOfferRow}>
                                <Image source={Imagepath.TickMark} style={styles.tickIcon} />
                                <Text numberOfLines={1} style={styles.primeOfferText}>
                                    {statePercentage > 0 ? `Prime Offer · ${formattedPct}% OFF` : 'Prime Offer'}
                                </Text>
                            </View>
                            <View style={styles.priceValueRow}>
                                {statePercentage > 0 ? (
                                    <Text style={styles.discountPctText}>{`-${formattedPct}%`}</Text>
                                ) : null}
                                <Text style={styles.priceText}>
                                    {`${currencyCode}${item?.display_price ?? ''}`}
                                </Text>
                                {statePrice !== null && (!Number.isFinite(numericDisplayPrice) || statePrice > numericDisplayPrice) ? (
                                    <Text style={styles.strikePriceText}>
                                        {`${currencyCode}${statePrice}`}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        {item?.buttonType ? (
                            <TouchableOpacity onPress={() => { handleUrlPage(item) }} style={styles.cardActionBtn}>
                                <Text numberOfLines={1} style={styles.cardActionText}>
                                    {item.buttonType}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
        );
    };
        /**
 * Handles url page.
 * @param {*} did - Input value.
 * @returns {void}
 */
const handleUrlPage = (did) => {
        const url = did?.detailpage_url;
        const result = url.split('/').pop();
        console.log(result, "webcast url=======", did);
        if (result) {
            props?.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result } })
        }
    }
    /**
     * Registercourserender data utility.
     * @param {Object} props - Input object.
     * @param {*} props.item - Nested property value.
     * @param {*} props.index - Nested property value.
     * @returns {JSX.Element}
     */
    const registercourserenderData = ({ item, index }) => {
        const progress = Math.min(100, Math.max(0, Number(item?.completed_percentage) || 0));
        const isCompleted = progress >= 100;
        const hasMenu = Boolean(item?.certificate?.certificate || item?.needReview);

        return (
            <View style={styles.cardWrapper}>
                <View style={[styles.courseCard, { height: cardHeight }]}>
                    <View style={styles.cardTopSection}>
                        <View style={styles.cardTitleRow}>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={[styles.cardTitle, { flex: 1, marginRight: hasMenu ? normalize(6) : 0 }]}
                            >
                                {item?.title}
                            </Text>
                            {hasMenu ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalviewstate(!modalviewstate);
                                        setNeedReview(item?.needReview);
                                        setOnlineName(item);
                                        setCertificatestate(item?.certificate?.certificate);
                                    }}
                                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                >
                                    <IconDot name="dots-three-vertical" size={20} color={"#848484"} />
                                </TouchableOpacity>
                            ) : null}
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
                                        stateAction(item);
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
            StateHeader();
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
                {Platform.OS === 'ios' ? <PageHeader
                    title=""
                    onBackPress={StateHeader}
                /> : <View>
                    <PageHeader
                        title=""
                        onBackPress={StateHeader}
                    />
                </View>}
                <Loader visible={loadingdownst || loads} />
                {conn == false ? <IntOff/> :<ScrollView contentContainerStyle={{ paddingBottom: normalize(20) }}>
                    <View>
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
                                        {props?.route?.params?.fullData?.fullData?.name}
                                    </Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(8) }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(2), borderRadius: normalize(20), backgroundColor: cleanNumber(props?.route?.params?.fullData?.fullData?.earned_credits) == cleanNumber(props?.route?.params?.fullData?.fullData?.credits) ? "#D6F9E2" : "#FFF2E0", justifyContent: "center", alignItems: "center" }}>
                                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 13, fontWeight: "bold", color: "#000000" }}>
                                                    {`${props?.route?.params?.fullData?.fullData?.earned_credits} / ${props?.route?.params?.fullData?.fullData?.credits}`}
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
                                        {props?.route?.params?.fullData?.fullData?.earned_credits < props?.route?.params?.fullData?.fullData?.credits ? (<TouchableOpacity onPress={() => { props.navigation.navigate("AddCredits", { mainAdd: props?.route?.params?.fullData?.addCreds }) }}>
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
                    </View>
                    {props?.route?.params?.fullData?.fullData?.suggested_cources?.length == 0 && props?.route?.params?.fullData?.fullData?.registered_cources?.length == 0 ? (<View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                        <View
                            style={{
                                flexDirection: "row",
                                // height: normalize(83),
                                width: normalize(290),
                                borderRadius: normalize(10),
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: normalize(10),
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
                                        // width: normalize(160)
                                        paddingVertical: normalize(10),
                                        paddingHorizontal: normalize(0),
                                        alignSelf: "center"
                                    }}
                                >
                                    {"No courses available!"}
                                </Text>

                            </View>
                        </View>
                    </View>) : null}
                    {props?.route?.params?.fullData?.fullData?.registered_cources?.length > 0 ? <View style={styles.sectionBanner}>
                        <Text style={styles.sectionTitle}>
                            {textget == "Suggestedtext" ? `Suggested Courses on ${props?.route?.params?.fullData?.fullData?.name}` : `Registered Courses on ${props?.route?.params?.fullData?.fullData?.name}`}
                        </Text>
                    </View> : null}
                    <View>
                        {props?.route?.params?.fullData?.fullData?.registered_cources?.length > 0 ? <FlatList
                            data={props?.route?.params?.fullData?.fullData?.registered_cources}
                            renderItem={registercourserenderData}
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
                                        fontSize: 20,
                                        paddingTop: normalize(30),
                                        // textTransform: 'uppercase',
                                    }}>
                                    No data found
                                </Text>
                            } /> : <>
                            {/* <Text
                                style={{
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    color: Colorpath.grey,
                                    fontWeight: 'bold',
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 20,
                                    paddingTop: normalize(30),
                                    // textTransform: 'uppercase',
                                }}>
                                No data found
                            </Text> */}
                        </>}

                    </View>
                    {props?.route?.params?.fullData?.fullData?.suggested_cources?.length > 0 ? <View style={styles.sectionBanner}>
                        <Text style={styles.sectionTitle}>
                            {`Suggested Courses on ${props?.route?.params?.fullData?.fullData?.name}`}
                        </Text>
                    </View>
                        : null}
                    <View>
                        {props?.route?.params?.fullData?.fullData?.suggested_cources?.length > 0 ? <FlatList
                            data={props?.route?.params?.fullData?.fullData?.suggested_cources}
                            renderItem={courserenderData}
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
                                        fontSize: 20,
                                        paddingTop: normalize(30),
                                        // textTransform: 'uppercase',
                                    }}>
                                    No data found
                                </Text>
                            } /> : <>
                            {/* <Text
                                style={{
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    color: Colorpath.grey,
                                    fontWeight: 'bold',
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 20,
                                    paddingTop: normalize(30),
                                    // textTransform: 'uppercase',
                                }}>
                                No data found
                            </Text> */}
                        </>}

                    </View>
                </ScrollView>}
                <Modal
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    isVisible={modalviewstate}
                    backdropColor={Colorpath.black}
                    style={{
                        width: '100%',
                        alignSelf: 'center',
                        margin: 0,
                    }}
                    onBackdropPress={() => setModalviewstate(false)}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setModalviewstate(false)}>

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
                                        setModalviewstate(false);
                                        if (item?.id === 1) {
                                            setLoads(true);
                                            handleLinkst(certificatestate);
                                        } else {
                                            props.navigation.navigate("RateReview", { onlineName: onlineName })
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
            </SafeAreaView>
        </>
    )
}

/**
 * State specification default export.
 *
 * @returns {*}
 */
export default StateSpecification
/**
 * Styles value.
 * @returns {*}
 */
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