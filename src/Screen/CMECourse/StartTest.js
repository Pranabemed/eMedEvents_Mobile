import { View, Text, Platform, ImageBackground, StyleSheet, TouchableOpacity, Image, ScrollView, useWindowDimensions, Alert, BackHandler, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
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
let status = "";
let status1 = "";
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
    const startPress = () => {
        // const fullDta = fulldashbaord?.[0];
        setAddit(statepush);
        // setFulldashbaord(addit)
        takeCourse();
        props.navigation.goBack();
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
    const [dataactivity, setDataactivity] = useState();
    const [dataactivitymain, setDataactivitymain] = useState();
    const CMEReducer = useSelector(state => state.CMEReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const dispatch = useDispatch();
    const { width } = useWindowDimensions();
    const isFocus = useIsFocused();
    const [loadingdownst, setLoadingdownst] = useState(false);
    const [pdfUrist, setPdfUrist] = useState("");
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
    useEffect(() => {
        if (props?.route?.params?.conference || props?.route?.params?.startCourse?.conferenceId) {
            let obj = {
                "conference_id": props?.route?.params?.conference || props?.route?.params?.startCourse?.conferenceId
            }
            connectionrequest()
                .then(() => {
                    dispatch(activityfulfilmentRequest(obj))
                    dispatch(actvityBreakupRequest(obj))
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) })
        }
    }, [props?.route?.params?.conference, props?.route?.params?.startCourse?.conferenceId])
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
                    .catch((err) => { showErrorAlert("Please connect to internet", err) })
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
    const handleLinkst = (link) => {
        if (link) {
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
    const [showLoader, setShowLoader] = useState(true);
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);
    console.log(mainData, "maindata--------", actvityData, actvityDatas);
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
                {conn == false ? <IntOff /> : <ScrollView contentContainerStyle={{ paddingBottom: normalize(50) }}>
                    <View>
                        <View style={styles.container}>
                            <ImageBackground source={Imagepath.BannerBig} style={styles.imageBackground}>
                                <View style={styles.contentContainer}>
                                    <View style={styles.header}>
                                        <Text style={styles.title}>
                                            {actvityData?.title || actvityDatas?.conferenceName}
                                        </Text>
                                    </View>
                                    <View style={styles.subHeader}>
                                        <Text style={styles.subText}>
                                            {actvityData?.organizerName || actvityDatas?.organizationName}
                                        </Text>
                                    </View>
                                    <View style={styles.details}>
                                        <View style={styles.column}>
                                            <View style={styles.row}>
                                                {(actvityData?.conferenceDuration || actvityDatas?.conferenceDuration) ? <Text style={styles.detailText}>
                                                    {actvityData?.conferenceDuration || actvityDatas?.conferenceDuration}
                                                </Text> : null}
                                                {(actvityData?.conferenceDuration || actvityDatas?.conferenceDuration) ? <View style={styles.separator} /> : null}
                                                <Text style={styles.detailText}>
                                                    {mainData?.length > 0
                                                        ? `${mainData?.[0]?.points || 0} ${mainData?.[0]?.name &&
                                                            mainData?.[0]?.name?.toLowerCase() == "contact hour"
                                                            ? "Contact Hour(s)"
                                                            : mainData?.[0]?.name || ""
                                                        }`
                                                        : acivityData ? acivityData : "" || ""}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    {actvityData?.courseHandout && <View style={styles.divider} />}
                                </View>
                                {actvityData?.courseHandout ? <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", paddingHorizontal: normalize(0), marginTop: normalize(10) }}>
                                    <View>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#333" }}>
                                            {"Course Handout"}
                                        </Text>
                                    </View>
                                    <View style={{ minWidth: normalize(70) }}>
                                        {loadingdownst ? (
                                            <ActivityIndicator
                                                style={{ marginRight: normalize(15) }}
                                                size="small"
                                                color={Colorpath.green}
                                            />
                                        ) : null}

                                        <TouchableOpacity
                                            onPress={() => handleLinkst(actvityData?.courseHandout)}
                                            disabled={loadingdownst}
                                            style={{ opacity: loadingdownst ? 0.5 : 1 }}
                                        >
                                            <Text style={{
                                                fontFamily: Fonts.InterBold,
                                                fontSize: 16,
                                                color: loadingdownst ? Colorpath.disabled : Colorpath.ButtonColr
                                            }}>
                                                {"Download"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View> : null}

                            </ImageBackground>
                        </View>
                        {htmlContents ? <View style={{ width: "100%", paddingHorizontal: normalize(0), marginTop: normalize(10) }}>
                            <View style={{ paddingHorizontal: normalize(8), width: "100%" }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000", fontWeight: "bold" }}>
                                    {"Overview"}
                                </Text>
                            </View>
                            <View style={{ paddingHorizontal: normalize(8), width: "100%" }}>
                                <RenderHTML
                                    contentWidth={width}
                                    source={{ html: htmlContents }}
                                    tagsStyles={styles.tagsStyles}
                                />
                            </View>
                        </View> : null}
                        <View style={{ width: "100%" }}>
                            <View style={{
                                paddingVertical: normalize(10), paddingHorizontal: normalize(10)
                            }}>
                                <Buttons
                                    onPress={() => {
                                        if (CMEReducer?.cmenextactionResponse?.next_activity_api == "activitysession") {
                                            takeCourse();
                                            props.navigation.navigate("VideoComponent", { activityID: CMEReducer?.cmenextactionResponse })
                                        } else if (CMEReducer?.cmenextactionResponse?.next_activity_api == "startTest") {
                                            takeCourse();
                                            props.navigation.navigate("PreTest", { FullID: { FullID: CMEReducer?.cmenextactionResponse?.next_activity_id, startTest: "startTest", wholedata: CMEReducer?.cmenextactionResponse, Wktext: CMEReducer?.actvityBreakupResponse?.current_activity_text } });
                                        }
                                    }}
                                    height={normalize(45)}
                                    width={normalize(300)}
                                    backgroundColor={Colorpath.ButtonColr}
                                    borderRadius={normalize(9)}
                                    text={CMEReducer?.actvityBreakupResponse?.button_text}
                                    color={Colorpath.white}
                                    fontSize={16}
                                    fontFamily={Fonts.InterBold}
                                    // marginTop={normalize(30)}
                                    fontWeight={"bold"}
                                />
                            </View>
                            {/* <View style={{ paddingHorizontal: normalize(10), width: "100%" }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000", fontWeight: "bold" }}>
                                    {"Course Modules"}
                                </Text>
                            </View>
                            <View style={{ paddingHorizontal: normalize(8), paddingVertical: normalize(6) }}>
                                <View style={{
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    width: '99.99%',
                                    borderWidth: 1,
                                    borderColor: "#DDDDDD",
                                    borderRadius: normalize(10),
                                    paddingHorizontal: normalize(8), paddingVertical: normalize(2)
                                }}>
                                    <View style={styles.View}>
                                        <View style={styles.contentContainer}>
                                            {(actvityData?.title || actvityDatas?.conferenceName) ? <View style={styles.header}>
                                                <Text numberOfLines={2} style={styles.title}>
                                                    {actvityData?.title || actvityDatas?.conferenceName}
                                                </Text>
                                            </View> : null}
                                            {(actvityData?.conferenceDuration || actvityDatas?.conferenceDuration) && <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: '100%',
                                                paddingVertical: normalize(5)
                                            }}>
                                                <TimeIcon name="time-outline" size={25} color={"#999999"} />
                                                <Text style={[styles.subText, { marginLeft: normalize(5) }]}>
                                                    {actvityData?.conferenceDuration || actvityDatas?.conferenceDuration}
                                                </Text>
                                            </View>}
                                            {(actvityData?.courseModules || actvityDatas?.courseModule) && (
                                                <View
                                                    style={{
                                                        width: normalize(280),
                                                        paddingVertical: normalize(5),
                                                        // backgroundColor:"red"
                                                    }}
                                                >
                                                    <View style={styles.column}>
                                                        {(() => {
                                                            // ✅ STEP 1: Decide which dataset to use
                                                            const hasCourseModulesData =
                                                                actvityData?.courseModules &&
                                                                Object.keys(actvityData?.courseModules).length > 0;

                                                            // ✅ STEP 2: Prepare display list (no merge)
                                                            const displayList = hasCourseModulesData
                                                                ? Object.keys(actvityData?.courseModules || {})
                                                                : (actvityDatas?.courseModule || []).map(item => item?.name).filter(Boolean);

                                                            // ✅ STEP 3: Split into chunks of 3 for multi-line layout
                                                            const rows = [];
                                                            for (let i = 0; i < displayList.length; i += 3) {
                                                                rows.push(displayList.slice(i, i + 3));
                                                            }

                                                            // ✅ STEP 4: Render rows
                                                            return rows.map((rowItems, rowIndex) => (
                                                                <View
                                                                    key={`row-${rowIndex}`}
                                                                    style={[styles.row, { marginBottom: rowIndex !== rows.length - 1 ? normalize(5) : 0 }]}
                                                                >
                                                                    {rowItems.map((label, index) => {
                                                                        const cleanLabel = label
                                                                            ?.replace(/-/g, ' ')
                                                                            ?.replace(/&/g, 'and')
                                                                            ?.replace(/\b\w/g, c => c.toUpperCase().trim());

                                                                        return (
                                                                            // <React.Fragment key={`${label}-${index}`}>
                                                                            //     <Text numberOfLines={2} style={styles.detailText}>
                                                                            //         {cleanLabel}
                                                                            //     </Text>
                                                                            //     {index !== rowItems.length - 1 && <View style={styles.separator} />}
                                                                            // </React.Fragment>
                                                                            <React.Fragment key={`${label}-${index}`}>
                                                                                <View style={{ flexShrink: 1, flex: 1, minWidth: '30%' }}>
                                                                                    <Text
                                                                                        numberOfLines={3}
                                                                                        style={[styles.detailText, { flexWrap: 'wrap' }]}
                                                                                        ellipsizeMode="tail"
                                                                                    >
                                                                                        {cleanLabel}
                                                                                    </Text>
                                                                                </View>
                                                                                {index !== rowItems.length - 1 && <View style={styles.separator} />}
                                                                            </React.Fragment>
                                                                        );
                                                                    })}
                                                                </View>
                                                            ));
                                                        })()}
                                                    </View>
                                                </View>
                                            )}



                                            <View>
                                                {actvityDatas?.percentage === undefined ? <></> : <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                                                    <ProgressBarLine needwidth={"yes"} textadd={"yes"} progress={actvityDatas?.percentage} height={6} fillColor={Colorpath.green} />
                                                </View>}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View> */}
                        </View>
                        {actvityData?.speakers?.length > 0 ? <View style={{ width: "100%", paddingHorizontal: normalize(0), paddingVertical: normalize(0) }}>
                            <View style={{ paddingHorizontal: normalize(8), width: "100%" }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000", fontWeight: "bold" }}>
                                    {"Faculty"}
                                </Text>
                            </View>
                            <View style={{ paddingHorizontal: normalize(8), paddingVertical: normalize(6) }}>
                                <View style={{
                                    width: '100%',
                                    borderWidth: 1,
                                    borderColor: "#DDDDDD",
                                    borderRadius: normalize(10),
                                    paddingHorizontal: normalize(8),
                                    paddingVertical: normalize(8),
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <View style={{
                                            height: normalize(70),
                                            width: normalize(70),
                                            backgroundColor: '#e9f5f9',
                                            borderRadius: normalize(35),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: normalize(10),
                                        }}>
                                            <ImageBackground
                                                source={{ uri: speakerImage }}
                                                style={{
                                                    height: normalize(70),
                                                    width: normalize(70),
                                                }}
                                                imageStyle={{ borderRadius: normalize(60) }}
                                            />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 18, color: "#00000", fontWeight: "bold" }}>{speakerName}</Text>
                                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#333" }}>{speakerQualification}</Text>
                                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#333" }}>{speakerSpecialities}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View> : null}
                    </View>
                </ScrollView>}
            </SafeAreaView>
        </>
    )
}

export default StartTest
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignSelf: 'center',
        // paddingVertical: normalize(10),
        width: '100%',
    },
    imageBackground: {
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10),
        alignItems: 'flex-start',
        flexDirection: 'column',
        width: normalize(330),
    },
    contentContainer: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginRight: normalize(0)
    },
    tagsStyles: {
        ul: {
            marginVertical: normalize(5),
            paddingLeft: 20,
        },
        li: {
            marginBottom: 5,
            fontSize: 16,
            color: '#333',
            top: Platform.OS === 'ios' ? 0 : -2,
        },
    },
    title: {
        fontFamily: Fonts.InterBold,
        fontSize: 20,
        color: '#000000',
        fontWeight: 'bold',
        flex: 1,
        flexWrap: 'wrap',
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: normalize(5),
    },
    subText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#666',
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: normalize(5),
    },
    column: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#666',
    },
    separator: {
        height: 15,
        width: 2,
        backgroundColor: '#DDD',
        marginHorizontal: normalize(10),
    },
    divider: {
        marginTop: normalize(10),
        height: 1,
        width: '100%',
        backgroundColor: '#DDD',
    },
    coursedivider: {
        marginTop: normalize(10),
        height: 6,
        width: '90%',
        backgroundColor: 'red',
        borderRadius: normalize(15)
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        fontSize: normalize(14),
        color: '#333',
        marginBottom: normalize(5),
    },
    detailsd: {
        paddingVertical: normalize(6),
        paddingHorizontal: normalize(8),
        borderWidth: 1,
        borderColor: "#DADADA",
        borderRadius: normalize(5),
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    columnd: {
        flexDirection: "column",
    },
    rowd: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    detailTextd: {
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        color: "#000000",
        textAlign: "center",
    },
    separatord: {
        height: normalize(18),
        width: normalize(1),
        backgroundColor: "#DADADA",
        marginHorizontal: normalize(5),
    },
});