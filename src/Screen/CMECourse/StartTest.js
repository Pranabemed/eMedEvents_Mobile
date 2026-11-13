/**
 * Start test screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, status1, StartTest, startPress, getFirstIncompleteModule, takeCourse, handleLinkst, showPDF, openFileViewerst, onBackPress, styles.
 */

import { View, Text, Platform, ImageBackground, StyleSheet, TouchableOpacity, Image, ScrollView, useWindowDimensions, Alert, BackHandler, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import MyStatusBar from '../../Utils/MyStatusBar'
import PageHeader from '../../Components/PageHeader'
import Imagepath from '../../Themes/Imagepath'
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts'
import TimeIcon from 'react-native-vector-icons/Ionicons';
import ProgressBarLine from '../../Components/ProgressPerce'
import { connect, useDispatch, useSelector } from 'react-redux'
import connectionrequest from '../../Utils/Helpers/NetInfo'
import { activityfulfilmentRequest, actvityBreakupRequest, cmenextactionRequest } from '../../Redux/Reducers/CMEReducer'
import showErrorAlert from '../../Utils/Helpers/Toast';
import RenderHTML from 'react-native-render-html'
import Buttons from '../../Components/Button'
import { useIsFocused } from '@react-navigation/native'
import Loader from '../../Utils/Helpers/Loader'
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { AppContext } from '../GlobalSupport/AppContext'
import { stateDashboardRequest } from '../../Redux/Reducers/DashboardReducer';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff'
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable StartTest component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
let status = "";
/**
 * Status1 string constant.
 * @returns {string}
 */
let status1 = "";
/**
 * Start test component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const StartTest = (props) => {
    const {
        statepush,
        setStatepush,
        setFinddata,
        isConnected,
        fulldashbaord,
        setAddit,
        setFulldashbaord,
        addit
    } = useContext(AppContext);
    /**
* Start press utility.
* @returns {void}
*/
    const startPress = () => {
        // const fullDta = fulldashbaord?.[0];
        setAddit(statepush);
        // setFulldashbaord(addit)
        takeCourse();
        if (props.navigation.canGoBack()) {
            props.navigation.goBack();
        } else {
            props.navigation.navigate("TabNav");
        }
    }
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const [progress, setProgress] = useState(50);
    const [mainData, setMainData] = useState([]);
    const [actvityData, setActvityData] = useState([]);
    const [actvityDatas, setActvityDatas] = useState([]);
    const [htmlContents, setHtmlContents] = useState("")
    const [overviewExpanded, setOverviewExpanded] = useState(false);
    const [dataactivity, setDataactivity] = useState();
    const [dataactivitymain, setDataactivitymain] = useState();
    const CMEReducer = useSelector(state => state.CMEReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const dispatch = useDispatch();
    const { width } = useWindowDimensions();
    const isFocus = useIsFocused();
    const [loadingdownst, setLoadingdownst] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const loadingRequestRef = useRef(null);
    const [pdfUrist, setPdfUrist] = useState("");
    /**
* Returns first incomplete module.
* @param {*} modules - Input value.
* @returns {*}
*/
    const getFirstIncompleteModule = (modules) => {
        if (!Array.isArray(modules)) return null;
        return modules.find((item) => Number(item?.completedSection) === 0) || null;
    };
    useEffect(() => {
        if (statepush) {
            const takeIDST = statepush?.state_id || statepush?.creditID?.state_id;
            connectionrequest()
                .then(() => {
                    dispatch(stateDashboardRequest({ "state_id": takeIDST }))
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) })
        }
    }, [statepush])
    /**
* Take course utility.
* @returns {void}
*/
    const takeCourse = () => {
        if (statepush) {
            const takeIDST = statepush?.state_id || statepush?.creditID?.state_id;
            connectionrequest()
                .then(() => {
                    dispatch(stateDashboardRequest({ "state_id": takeIDST }))
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) })
        }
    }
    // const activityId = actvityData?.courseModules["Pre-Assessment"]?.activity_id || null;
    console.log(actvityData?.courseHandout, props?.route?.params, statepush, "props?.route?.params?.conference=====================", dataactivity, dataactivitymain, props?.route?.params?.startCourse?.conferenceId);
    const resolvedConferenceId = useMemo(() => {
        const raw =
            props?.route?.params?.conference ||
            props?.route?.params?.conferenceId ||
            props?.route?.params?.startCourse?.conferenceId ||
            props?.route?.params?.startCourse?.id ||
            props?.route?.params?.webcastDetails?.conferenceId ||
            props?.route?.params?.webcastDetails?.id ||
            props?.route?.params?.maindata?.conferenceId ||
            props?.route?.params?.maindata?.id;
        if (typeof raw === 'object' && raw !== null) {
            return raw?.conferenceId || raw?.id || raw?.conference || null;
        }
        return raw || null;
    }, [props?.route?.params]);

    useEffect(() => {
        setShowLoader(Boolean(resolvedConferenceId));
        loadingRequestRef.current = null;
        if (resolvedConferenceId) {
            let obj = {
                "conference_id": resolvedConferenceId
            }
            connectionrequest()
                .then(() => {
                    loadingRequestRef.current = {
                        fulfilment: CMEReducer?.activityfulfilmentResponse,
                        nextAction: CMEReducer?.cmenextactionResponse,
                    };
                    dispatch(activityfulfilmentRequest(obj))
                    dispatch(actvityBreakupRequest(obj))
                })
                .catch((err) => { setShowLoader(false); showErrorAlert("Please connect to internet", err) })
        }
    }, [resolvedConferenceId])
    useEffect(() => {
        if (CMEReducer?.activityfulfilmentResponse?.courseModules) {
            const activityId = CMEReducer?.activityfulfilmentResponse?.courseModules["Pre-Assessment"]?.activity_id || null;

            if (activityId) {
                console.log("Activity ID:", activityId);
                setDataactivitymain(activityId);
            } else {
                console.log("No activity_id found.");
            }
        } else {
            console.log("CourseModules data not available yet.");
        }
    }, [CMEReducer?.activityfulfilmentResponse]);
    useEffect(() => {
        if (CMEReducer?.activityfulfilmentResponse?.courseModules) {
            const courseModules = CMEReducer?.activityfulfilmentResponse?.courseModules;
            const activityIdmain =
                courseModules["Course"]?.activity_id ||
                courseModules["Post-Assessment"]?.activity_id ||
                courseModules["Survey & Feedback"]?.activity_id ||
                courseModules["Certificate"]?.activity_id ||
                null;
            if (activityIdmain) {
                console.log("Activity ID:", activityIdmain);
                setDataactivity(activityIdmain);
            } else {
                console.log("No activity_id found.");
            }
        } else {
            console.log("CourseModules data not available yet.");
        }
    }, [CMEReducer?.activityfulfilmentResponse]);

    useEffect(() => {
        const fullData = actvityData;
        const extractedData = fullData?.cmeCreditsData?.map(d => ({
            name: d?.name || "",
            points: parseFloat(d?.points) || 0
        }));
        setMainData(extractedData);
        console.log(extractedData, "Extracted Data", mainData);
        const htmlContent = actvityData?.overView
        setHtmlContents(htmlContent);
    }, [actvityData]);

    const plainOverviewText = useMemo(() => {
        return String(htmlContents || '').replace(/<[^>]*>/g, '').trim();
    }, [htmlContents]);
    const isLongOverview = plainOverviewText.length > 250;
    const [speakerName, setSpeakerName] = useState('');
    const [speakerQualification, setSpeakerQualification] = useState('');
    const [speakerSpecialities, setSpeakerSpecialities] = useState('');
    const [speakerImage, setSpeakerImage] = useState('');

    useEffect(() => {
        if (actvityData?.speakers?.length > 0) {
            const speaker = actvityData?.speakers[0];
            setSpeakerName(speaker.name || '');
            setSpeakerQualification(speaker?.qualification || '');
            setSpeakerSpecialities(speaker?.specialities || '');
            setSpeakerImage(speaker?.userImage || '');
        }
    }, [actvityData]);
    if (status === '' || CMEReducer.status !== status) {
        switch (CMEReducer.status) {
            case 'CME/activityfulfilmentRequest':
                status = CMEReducer.status;
                break;
            case 'CME/activityfulfilmentSuccess':
                status = CMEReducer.status;
                setActvityData(CMEReducer?.activityfulfilmentResponse);
                console.log("setActvityData ======>", CMEReducer?.activityfulfilmentResponse)
                break;
            case 'CME/activityfulfilmentFailure':
                status = CMEReducer.status;
                break;
            case 'CME/actvityBreakupRequest':
                status = CMEReducer.status;
                break;
            case 'CME/actvityBreakupSuccess':
                status = CMEReducer.status;
                let obj = {
                    "conference_id": CMEReducer?.actvityBreakupResponse?.conferenceId,
                    "ActivityId": CMEReducer?.actvityBreakupResponse?.current_activity_id,
                }
                console.log("StartTest.js-------", obj)
                connectionrequest()
                    .then(() => {
                        dispatch(cmenextactionRequest(obj));
                    })
                    .catch((err) => { setShowLoader(false); showErrorAlert("Please connect to internet", err) })
                console.log("activity fullfill ======>", CMEReducer?.actvityBreakupResponse, CMEReducer?.cmenextactionResponse)
                break;
            case 'CME/actvityBreakupFailure':
                status = CMEReducer.status;
                break;
            case 'CME/cmenextactionRequest':
                status = CMEReducer.status;
                break;
            case 'CME/cmenextactionSuccess':
                status = CMEReducer.status;
                setActvityDatas(CMEReducer?.cmenextactionResponse);
                console.log("activity fullfills ======>", CMEReducer?.cmenextactionResponse)
                break;
            case 'CME/cmenextactionFailure':
                status = CMEReducer.status;
                break;
        }
    }
    if (status1 == '' || DashboardReducer.status != status1) {
        switch (DashboardReducer.status) {
            case 'Dashboard/stateDashboardRequest':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/stateDashboardSuccess':
                status1 = DashboardReducer.status;
                setFinddata(DashboardReducer?.stateDashboardResponse?.data);
                break;
            case 'Dashboard/stateDashboardFailure':
                status1 = DashboardReducer.status;
                break;
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
                    const url = `${link}`;
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
    useEffect(() => {
        /**
* On back press utility.
* @returns {boolean}
*/
        const onBackPress = () => {
            takeCourse();
            startPress();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    const acivityData =
        actvityDatas?.conferenceCmePoints &&
        actvityDatas?.conferenceCmePoints.replace(/\s/g, "") !== "-0";
    useEffect(() => {
        const request = loadingRequestRef.current;
        if (!request) return;
        const failed = [
            'CME/activityfulfilmentFailure',
            'CME/actvityBreakupFailure',
            'CME/cmenextactionFailure',
        ].includes(CMEReducer.status);
        const receivedDetails = CMEReducer.activityfulfilmentResponse !== request.fulfilment;
        const receivedNextAction = CMEReducer.cmenextactionResponse !== request.nextAction;
        if (failed || (receivedDetails && receivedNextAction)) {
            setShowLoader(false);
            loadingRequestRef.current = null;
        }
    }, [CMEReducer.status, CMEReducer.activityfulfilmentResponse, CMEReducer.cmenextactionResponse]);
    console.log(mainData, "maindata--------", actvityData, actvityDatas, props?.route?.params);
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.white }}>
                <Loader visible={showLoader} />
                {Platform.OS === 'ios' ? <PageHeader
                    title="Activity Fulfillment"
                    onBackPress={startPress}
                /> : <View>
                    <PageHeader
                        title="Activity Fulfillment"
                        onBackPress={startPress}
                    />
                </View>}
                {conn == false ? <IntOff /> : showLoader ? null : <ScrollView contentContainerStyle={{ paddingBottom: normalize(60) }}>
                    <View>
                        <View style={styles.container}>
                            <View style={styles.imageBackground}>
                                <View style={styles.contentContainer}>
                                    <View style={styles.header}>
                                        <Text style={styles.title}>
                                            {actvityData?.title || actvityDatas?.conferenceName}
                                        </Text>
                                    </View>
                                    {(actvityData?.organizerName || actvityDatas?.organizationName) ? (
                                        <View style={styles.subHeader}>
                                            <Text style={styles.subText}>
                                                {actvityData?.organizerName || actvityDatas?.organizationName}
                                            </Text>
                                        </View>
                                    ) : null}
                                    <View style={styles.details}>
                                        <View style={styles.pillRow}>
                                            {(actvityData?.conferenceDuration || actvityDatas?.conferenceDuration) ? (
                                                <View style={styles.durationBadge}>
                                                    <TimeIcon name="time-outline" size={14} color="#2C4DB9" />
                                                    <Text style={styles.durationText}>
                                                        {actvityData?.conferenceDuration || actvityDatas?.conferenceDuration}
                                                    </Text>
                                                </View>
                                            ) : null}
                                            {mainData?.length > 0 || acivityData ? (
                                                <View style={styles.cmeBadge}>
                                                    <Text style={styles.cmeText}>
                                                        {mainData?.length > 0
                                                            ? `${mainData?.[0]?.points || 0} ${mainData?.[0]?.name &&
                                                                mainData?.[0]?.name?.toLowerCase() == "contact hour"
                                                                ? "Contact Hour(s)"
                                                                : mainData?.[0]?.name || ""
                                                            }`
                                                            : acivityData || ""}
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    </View>
                                    {actvityData?.courseHandout ? (
                                        <View style={styles.handoutRow}>
                                            <View style={{ flex: 1, marginRight: normalize(10) }}>
                                                <Text style={styles.handoutTitle}>
                                                    {"Course Handout"}
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => handleLinkst(actvityData?.courseHandout)}
                                                disabled={loadingdownst}
                                                style={[styles.downloadButton, { opacity: loadingdownst ? 0.6 : 1 }]}
                                                activeOpacity={0.7}
                                            >
                                                {loadingdownst ? (
                                                    <ActivityIndicator
                                                        style={{ marginRight: normalize(6) }}
                                                        size="small"
                                                        color={Colorpath.ButtonColr}
                                                    />
                                                ) : null}
                                                <Text style={styles.downloadButtonText}>
                                                    {loadingdownst ? "Downloading..." : "Download"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                        </View>
                        {htmlContents ? (
                            <View style={styles.sectionCard}>
                                <Text style={styles.sectionTitle}>
                                    {"Overview"}
                                </Text>
                                <View style={styles.overviewCard}>
                                    <View style={isLongOverview && !overviewExpanded ? { maxHeight: normalize(120), overflow: 'hidden' } : null}>
                                        <RenderHTML
                                            contentWidth={width - normalize(48)}
                                            source={{ html: htmlContents }}
                                            tagsStyles={styles.tagsStyles}
                                        />
                                    </View>
                                    {isLongOverview ? (
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={() => setOverviewExpanded(!overviewExpanded)}
                                            style={styles.viewMoreButton}
                                        >
                                            <Text style={styles.viewMoreText}>
                                                {overviewExpanded ? "View less" : "View more"}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                            </View>
                        ) : null}


                        {actvityData?.speakers?.length > 0 ? (
                            <View style={styles.sectionCard}>
                                <Text style={styles.sectionTitle}>
                                    {"Faculty"}
                                </Text>
                                <View style={styles.facultyCard}>
                                    <View style={styles.facultyAvatar}>
                                        {speakerImage ? (
                                            <Image
                                                source={{ uri: speakerImage }}
                                                style={{
                                                    height: normalize(56),
                                                    width: normalize(56),
                                                    borderRadius: normalize(28),
                                                }}
                                            />
                                        ) : (
                                            <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: '#0284C7' }}>
                                                {speakerName ? speakerName.charAt(0) : "F"}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.facultyNameText}>{speakerName}</Text>
                                        {speakerQualification ? (
                                            <Text style={styles.facultyQualText}>{speakerQualification}</Text>
                                        ) : null}
                                        {speakerSpecialities ? (
                                            <Text style={styles.facultySpecText}>{speakerSpecialities}</Text>
                                        ) : null}
                                    </View>
                                </View>
                            </View>
                        ) : null}

                        <View style={styles.actionButtonContainer}>
                            <Buttons
                                onPress={() => {
                                    const courseModuleList = Array.isArray(CMEReducer?.cmenextactionResponse?.courseModule)
                                        ? CMEReducer?.cmenextactionResponse?.courseModule
                                        : Array.isArray(CMEReducer?.cmenextactionResponse?.courseModules)
                                            ? CMEReducer?.cmenextactionResponse?.courseModules
                                            : [];
                                    const nextIncompleteModule = getFirstIncompleteModule(courseModuleList);
                                    const nextModuleId =
                                        nextIncompleteModule?.activity_id ||
                                        nextIncompleteModule?.current_activity_id ||
                                        nextIncompleteModule?.next_activity_id ||
                                        nextIncompleteModule?.id ||
                                        CMEReducer?.cmenextactionResponse?.next_activity_id;
                                    const nextModuleName = nextIncompleteModule?.name || CMEReducer?.cmenextactionResponse?.next_activity_text;

                                    const preAssessmentModule =
                                        CMEReducer?.activityfulfilmentResponse?.courseModules?.["Pre-Assessment"] ||
                                        CMEReducer?.activityfulfilmentResponse?.courseModules?.["Pre Assessment"] ||
                                        CMEReducer?.activityfulfilmentResponse?.courseModules?.["Pre-Test"] ||
                                        CMEReducer?.activityfulfilmentResponse?.courseModules?.["Pre Test"] ||
                                        courseModuleList.find(m => {
                                            const n = String(m?.name || '').toLowerCase();
                                            return n.includes('pre assessment') || n.includes('pre-assessment') || n.includes('pre test') || n.includes('pre-test');
                                        });
                                    const isPreAssessmentPending = (dataactivitymain || preAssessmentModule) && Number(preAssessmentModule?.completedSection ?? 0) === 0;

                                    if (!isPreAssessmentPending && (CMEReducer?.cmenextactionResponse?.next_activity_api === "activitysession" || nextModuleName?.toLowerCase()?.includes("section"))) {
                                        takeCourse();
                                        props.navigation.navigate("VideoComponent", {
                                            ...(props?.route?.params || {}),
                                            webcastDetails: props?.route?.params?.webcastDetails || props?.route?.params?.maindata?.webcastDetails || props?.route?.params?.startCourse,
                                            activityID: {
                                                ...CMEReducer?.cmenextactionResponse,
                                                current_activity_id: nextModuleId,
                                                next_activity_id: nextModuleId,
                                                next_activity_text: nextModuleName,
                                                courseModule: courseModuleList,
                                                webcastDetails: props?.route?.params?.webcastDetails || props?.route?.params?.maindata?.webcastDetails || props?.route?.params?.startCourse,
                                                webcastdeatils: props?.route?.params?.webcastDetails || props?.route?.params?.maindata?.webcastDetails || props?.route?.params?.startCourse,
                                            },
                                            preserveVideoContent: false,
                                        });
                                    } else {
                                        takeCourse();
                                        const targetActivityId =
                                            dataactivitymain ||
                                            preAssessmentModule?.activity_id ||
                                            nextModuleId ||
                                            CMEReducer?.actvityBreakupResponse?.current_activity_id ||
                                            CMEReducer?.cmenextactionResponse?.next_activity_id;
                                        props.navigation.navigate("PreTest", { 
                                            ...(props?.route?.params || {}),
                                            webcastDetails: props?.route?.params?.webcastDetails || props?.route?.params?.maindata?.webcastDetails || props?.route?.params?.startCourse,
                                            testFlowType: "pre", 
                                            videoContentData: CMEReducer?.cmenextactionResponse, 
                                            activityID: {
                                                activityID: targetActivityId,
                                                conference_id: resolvedConferenceId,
                                                text: "Pre Assessment",
                                                courseModule: courseModuleList,
                                            },
                                            FullID: { 
                                                FullID: targetActivityId, 
                                                startTest: "startTest", 
                                                wholedata: CMEReducer?.cmenextactionResponse || CMEReducer?.actvityBreakupResponse, 
                                                Wktext: "Pre Assessment",
                                                conferenceId: resolvedConferenceId,
                                                webcastDetails: props?.route?.params?.webcastDetails || props?.route?.params?.maindata?.webcastDetails || props?.route?.params?.startCourse,
                                                webcastdeatils: props?.route?.params?.webcastDetails || props?.route?.params?.maindata?.webcastDetails || props?.route?.params?.startCourse,
                                            } 
                                        });
                                    }
                                }}
                                height={normalize(46)}
                                width={Math.min(width - normalize(32), 480)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(10)}
                                text={CMEReducer?.actvityBreakupResponse?.button_text || actvityDatas?.buttonText || "Start Pre-Test"}
                                color={Colorpath.white}
                                fontSize={16}
                                fontFamily={Fonts.InterSemiBold}
                                fontWeight={"600"}
                            />
                        </View>
                    </View>
                </ScrollView>}
            </SafeAreaView>
        </>
    )
}

/**
 * Start test default export.
 *
 * @returns {*}
 */
export default StartTest
/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: normalize(12),
        paddingTop: normalize(10),
    },
    imageBackground: {
        width: '100%',
        paddingHorizontal: normalize(14),
        paddingVertical: normalize(14),
        borderRadius: normalize(12),
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    contentContainer: {
        width: '100%',
    },
    header: {
        width: '100%',
    },
    title: {
        fontFamily: Fonts.InterBold,
        fontSize: 18,
        color: '#0F172A',
        fontWeight: 'bold',
        lineHeight: 24,
    },
    subHeader: {
        width: '100%',
        paddingTop: normalize(4),
        paddingBottom: normalize(6),
    },
    subText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 13,
        color: '#475569',
    },
    details: {
        width: '100%',
        paddingTop: normalize(4),
    },
    pillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: normalize(6),
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF4FF',
        borderRadius: normalize(8),
        paddingHorizontal: normalize(9),
        paddingVertical: normalize(4),
        borderWidth: 1,
        borderColor: '#D6E4FF',
    },
    durationText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12,
        color: '#2C4DB9',
        marginLeft: normalize(4),
    },
    cmeBadge: {
        backgroundColor: '#ECFDF5',
        borderRadius: normalize(8),
        paddingHorizontal: normalize(9),
        paddingVertical: normalize(4),
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    cmeText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12,
        color: '#059669',
    },
    handoutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: normalize(12),
        paddingTop: normalize(10),
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    handoutTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#0F172A',
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(6),
        borderRadius: normalize(8),
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    downloadButtonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
        color: Colorpath.ButtonColr,
    },
    sectionCard: {
        width: '100%',
        paddingHorizontal: normalize(12),
        marginTop: normalize(12),
    },
    sectionTitle: {
        fontFamily: Fonts.InterBold,
        fontSize: 16,
        color: '#0F172A',
        fontWeight: 'bold',
        marginBottom: normalize(8),
    },
    overviewCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(12),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(10),
    },
    viewMoreButton: {
        marginTop: normalize(8),
        alignSelf: 'flex-start',
        paddingVertical: normalize(4),
    },
    viewMoreText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: Colorpath.ButtonColr,
        fontWeight: '600',
    },
    tagsStyles: {
        p: {
            fontSize: 14,
            lineHeight: 21,
            color: '#334155',
            fontFamily: Fonts.InterRegular,
            marginVertical: normalize(3),
        },
        ul: {
            marginVertical: normalize(4),
            paddingLeft: 18,
        },
        li: {
            marginBottom: 4,
            fontSize: 14,
            lineHeight: 20,
            color: '#334155',
            fontFamily: Fonts.InterRegular,
        },
    },
    facultyCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: normalize(12),
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(12),
        flexDirection: 'row',
        alignItems: 'center',
    },
    facultyAvatar: {
        height: normalize(56),
        width: normalize(56),
        borderRadius: normalize(28),
        backgroundColor: '#E0F2FE',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(12),
    },
    facultyNameText: {
        fontFamily: Fonts.InterBold,
        fontSize: 15,
        color: '#0F172A',
        fontWeight: 'bold',
    },
    facultyQualText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 13,
        color: '#475569',
        marginTop: normalize(2),
    },
    facultySpecText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 12,
        color: '#64748B',
        marginTop: normalize(2),
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    actionButtonContainer: {
        width: '100%',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(16),
        alignItems: 'center',
    },
});
