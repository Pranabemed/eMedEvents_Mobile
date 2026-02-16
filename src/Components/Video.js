import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform, Text, ActivityIndicator, Image, Alert, ScrollView, StatusBar, BackHandler, Pressable } from 'react-native';
import Video from 'react-native-video';
import PlayIcon from 'react-native-vector-icons/AntDesign';
import FullIcon from 'react-native-vector-icons/Feather';
import MyStatusBar from '../Utils/MyStatusBar';
import Orientation from 'react-native-orientation-locker';
import Colorpath from '../Themes/Colorpath';
import PageHeader from './PageHeader';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import Imagepath from '../Themes/Imagepath';
import connectionrequest from '../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { cmeactivityRequest, cmenextactionRequest } from '../Redux/Reducers/CMEReducer';
import showErrorAlert from '../Utils/Helpers/Toast';
import Buttons from './Button';
import { useIsFocused } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import Sliders from './SliderRef';
import FlipbookComponent from './FlipbookComponent';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
import { stateDashboardRequest } from '../Redux/Reducers/DashboardReducer';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../Utils/Helpers/IntOff';
let status = "";
let status1 = "";
import { SafeAreaView } from 'react-native-safe-area-context'

const VideoComponent = (props) => {
    const {
        statepush,
        setStatepush,
        setFinddata,
        isConnected,
        setAddit
    } = useContext(AppContext);
    const isFocus = useIsFocused();
    const CMEReducer = useSelector(state => state.CMEReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const dispatch = useDispatch();
    const [nextAction, setNextAction] = useState(null);
    const sliderValueRef = useRef(currentTime);
    const [showLoader, setShowLoader] = useState(true);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    useEffect(() => {
        if (statepush) {
            const takeID = statepush?.state_id || statepush?.creditID?.state_id;
            connectionrequest()
                .then(() => {
                    dispatch(stateDashboardRequest({ "state_id": takeID }))
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) })
        }
    }, [statepush])
    const takeCourseVideo = () => {
        if (statepush) {
            const takeIDST = statepush?.state_id || statepush?.creditID?.state_id;
            connectionrequest()
                .then(() => {
                    dispatch(stateDashboardRequest({ "state_id": takeIDST }))
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) })
        }
    }
    useEffect(() => {
        const ActivityId = props?.route?.params?.postdata?.next_activity_id
            || props?.route?.params?.RoleData?.current_activity_id
            || props?.route?.params?.activityID?.next_activity_id
            || props?.route?.params?.FullID?.previous_activity_id;
        let obj = {
            "ActivityId": ActivityId
            // "ActivityId":props?.route?.params?.postdata?.next_activity_id || props?.route?.params?.RoleData?.current_activity_id ? props?.route?.params?.RoleData?.current_activity_id : props?.route?.params?.FullID?.next_activity_id || props?.route?.params?.activityID?.next_activity_id
        }
        connectionrequest()
            .then(() => {
                dispatch(cmeactivityRequest(obj));
            })
            .catch((err) => { showErrorAlert("Please connect to internet", err) })
    }, [isFocus])
    useEffect(() => {
        const reviseText = props?.route?.params?.RoleData?.completed_percentage == 100 || props?.route?.params?.FullID?.percentage == 100
        let revisebj = {
            "conference_id": props?.route?.params?.RoleData?.id
                || props?.route?.params?.RoleData?.conferenceId
                || props?.route?.params?.FullID?.conferenceId
                || props?.route?.params?.activityID?.conferenceId
                || props?.route?.params?.postdata?.conferenceId,
            "ActivityId": props?.route?.params?.RoleData?.current_activity_id
                || props?.route?.params?.FullID?.previous_activity_id
                || props?.route?.params?.postdata?.next_activity_id
                || props?.route?.params?.activityID?.next_activity_id,
            "revise_activity": 1
        }
        let obj = {
            "conference_id": props?.route?.params?.RoleData?.id
                || props?.route?.params?.RoleData?.conferenceId
                || props?.route?.params?.FullID?.conferenceId
                || props?.route?.params?.activityID?.conferenceId
                || props?.route?.params?.postdata?.conferenceId,
            "ActivityId": props?.route?.params?.RoleData?.current_activity_id
                || props?.route?.params?.FullID?.previous_activity_id
                || props?.route?.params?.postdata?.next_activity_id
                || props?.route?.params?.activityID?.next_activity_id,
        }
        connectionrequest()
            .then(() => {
                dispatch(cmenextactionRequest(reviseText ? revisebj : obj));
            })
            .catch((err) => { showErrorAlert("Please connect to internet", err) })
    }, [isFocus])
    const videoRef = useRef(null);
    const [paused, setPaused] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showThumb, setShowThumb] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [videoHeight, setVideoHeight] = useState(normalize(200));
    const [videoDic, setVideoDic] = useState([]);
    const [videoUrl, setVideoUrl] = useState(null);
    const [loadingdown, setLoadingdown] = useState(false);
    const [pdfUri, setPdfUri] = useState("");
    const { width, height } = Dimensions.get('window');
    useEffect(() => {
        if (fullscreen) {
            Orientation.lockToLandscape();
            setVideoHeight(height);
        } else {
            Orientation.lockToPortrait();
            setVideoHeight(normalize(200));
        }
    }, [fullscreen]);
    const styles = StyleSheet.create({
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
        container: {
            // flex: 1,
        },
        fullscreenContainer: {
            position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
        },
        videoContainer: {
            width: "100%",
            height: videoHeight,
            justifyContent: 'center',
            alignItems: 'center',
        },
        fullscreenVideoContainer: {
            position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        video: {
            width: '100%',
            height: "100%",
        },
        fullscreenVideo: {
            width: "100%",
            height: "100%",
            backgroundColor: "#211c16",
        },
        playText: {
            position: 'absolute',
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: fullscreen ? 50 : 30,
            height: fullscreen ? 60 : 40,
            width: fullscreen ? 60 : 40,
            zIndex: 999,
        },
        fullscreencontrols: {
            width: "80%",
            top: Platform.OS === 'ios' ? normalize(273) : 340,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: Platform.OS === 'ios' ? normalize(70) : normalize(90)
        },
        controls: {
            width: "100%",
            top: Platform.OS === 'ios' ? -30 : -21,
            flexDirection: 'row',
            alignItems: 'center',
        },
        // controlsandroid: {
        //     width: "100%",
        //     top: Platform.OS === 'ios' ? -60 : -21,
        //     flexDirection: 'row',
        //     alignItems: 'center',
        // },
        slider: {
            flex: 0.94,
            marginHorizontal: -2,
        },
        fullscreenButton: Platform.OS === 'ios' ? {
            position: 'absolute',
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            bottom: fullscreen ? 55 : 12,
            right: fullscreen ? 25 : 0,
            zIndex: 1000,
            height: normalize(35),
            width: normalize(35),
            borderRadius: normalize(35),
            justifyContent: "center",
            alignItems: "center"
        } : {
            position: 'absolute',
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            bottom: fullscreen ? 40 : 12,
            right: fullscreen ? 17 : 0,
            zIndex: 1000,
            height: normalize(35),
            width: normalize(35),
            borderRadius: normalize(35),
            justifyContent: "center",
            alignItems: "center"
        },
        nfullmode: Platform.OS === 'ios' ? {
            position: 'absolute',
            // backgroundColor:  "rgba(0, 0, 0, 0.5)",
            bottom: fullscreen ? 5 : 12,
            right: fullscreen ? 17 : 0,
            zIndex: 1000,
            height: normalize(35),
            width: normalize(35),
            // borderRadius:normalize(5),
            justifyContent: "center",
            alignItems: "center"
        } : {
            position: 'absolute',
            // backgroundColor: "rgba(0, 0, 0, 0.5)",
            bottom: fullscreen ? 40 : 12,
            right: fullscreen ? 17 : 4,
            zIndex: 1000,
            height: normalize(35),
            width: normalize(35),
            // borderRadius:normalize(35),
            justifyContent: "center",
            alignItems: "center"
        },
        timeBalance: Platform.OS === 'ios' ? {
            position: 'absolute',
            bottom: 23,
            right: showThumb ? normalize(35) : 5,
            zIndex: 1000,
            color: Colorpath.black,
            fontFamily: Fonts.InterMedium,
            fontSize: 14,
        } : {
            position: 'absolute',
            bottom: 18,
            right: showThumb ? normalize(65) : 5,
            zIndex: 1000,
            color: Colorpath.black,
            fontFamily: Fonts.InterMedium,
            fontSize: 14,
        },
        fulltimeBalance: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 54 : 54,
            right: Platform.OS === 'ios' ? normalize(123) : normalize(120),
            zIndex: 1000,
            color: Colorpath.black,
            fontFamily: Fonts.InterMedium,
            fontSize: 14,
            height: normalize(20),
            width: normalize(155),
            overflow: 'hidden',
            textAlign: 'center',
            includeFontPadding: false,
        },
        timer: {
            color: '#000000',
            marginLeft: 10,
        },
    });
    const onLoad = (data) => {
        setDuration(data.duration); // Set video duration

        // Determine the initial time
        const initialTime = videoDic && videoDic?.video_play_time ? parseFloat(videoDic.video_play_time) : 0;

        if (videoRef.current) {
            // Use a timeout or wait for the video to be fully loaded before seeking
            setTimeout(() => {
                videoRef.current.seek(initialTime);
                setCurrentTime(initialTime); // Update current time to last played time
            }, 100); // Adjust the delay if necessary
        }

        setLoading(false); // Stop loading
    };

    // Additional guard to ensure `videoDic?.video_play_time` is always prioritized
    useEffect(() => {
        if (videoDic && videoDic?.video_play_time) {
            const playbackTime = parseFloat(videoDic.video_play_time);

            if (videoRef.current) {
                // Ensure the video seeks to the correct time when videoDic changes
                videoRef.current.seek(playbackTime);
                setCurrentTime(playbackTime);
            }
        }
    }, [videoDic]); // Runs whenever `videoDic` changes


    const onProgress = (data) => {
        setCurrentTime(data.currentTime);
    };

    const onEnd = () => {
        setPaused(true);
        videoRef.current.seek(0);
    };

    const onReadyForDisplay = () => {
        setLoading(false);
    };

    const toggleFullscreen = () => {
        setFullscreen(!fullscreen);
    };

    const videoPress = () => {
        setAddit(statepush);
        takeCourseVideo();
        props.navigation.goBack();
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    useEffect(() => {
        if (CMEReducer?.cmeactivityResponse) {
            setVideoDic(CMEReducer?.cmeactivityResponse);
        }
    }, [CMEReducer?.cmeactivityResponse])
    useEffect(() => {
        if (CMEReducer?.cmenextactionResponse) {
            setNextAction(CMEReducer?.cmenextactionResponse);
        }
    }, [CMEReducer?.cmenextactionResponse])
    if (status === '' || CMEReducer.status !== status) {
        switch (CMEReducer.status) {
            case 'CME/cmeactivityRequest':
                status = CMEReducer.status;
                break;
            case 'CME/cmeactivitySuccess':
                status = CMEReducer.status;
                setVideoDic(CMEReducer?.cmeactivityResponse);
            case 'CME/cmeactivityFailure':
                status = CMEReducer.status;
                break;
            case 'CME/cmenextactionRequest':
                status = CMEReducer.status;
                break;
            case 'CME/cmenextactionSuccess':
                status = CMEReducer.status;
                setNextAction(CMEReducer?.cmenextactionResponse);
            case 'CME/cmenextactionFailure':
                status = CMEReducer.status;
                break;
            case 'CME/nextactionagainRequest':
                status = CMEReducer.status;
                break;
            case 'CME/nextactionagainSuccess':
                status = CMEReducer.status;
            case 'CME/nextactionagainFailure':
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
    const [nonVideoContent, setNonVideoContent] = useState(null);
    const handleSliderChange = (value) => {
        setPaused(true);
        const currentTime = videoRef.current.currentTime;
        const threshold = 2; // Seconds
        if (Math.abs(value - currentTime) > threshold) {
            sliderValueRef.current = value;
            setPaused(true);
            setCurrentTime(value);
            videoRef.current.seek(value);
        }
    };
    const handleSeek = useCallback((time) => {
        setPaused(true);
        if (!videoRef.current) {
            console.warn('Video reference not available');
            return;
        }
        const seekMethods = [
            () => videoRef.current?.seek?.(time),
            () => videoRef.current?.seek(time),
            () => videoRef.current?.player?.seek(time)
        ];
        for (const method of seekMethods) {
            try {
                if (typeof method() === 'function') {
                    method();
                    break;
                }
            } catch (e) {
                console.warn('Seek attempt failed:', e);
            }
        }
        setTimeout(() => setPaused(false), 100);
    }, []);
    const handleSlidingComplete = useCallback((value) => {
        handleSeek(value);
    }, [handleSeek]);
    useEffect(() => {
        if (Platform.OS === 'android') {
            setTimeout(() => {
                if (videoRef.current && !videoRef.current.seek) {
                    console.log('Attempting Android workaround');
                    videoRef.current.seek = (time) => {
                        videoRef.current?.player?.seek(time);
                    };
                }
            }, 1000);
        }
    }, []);

    useEffect(() => {
        if (!videoDic || !videoDic.activityData || videoDic.activityData.length === 0) {
            console.error('No video description found in videoDic.');
            return;
        }
        const videoId = videoDic.activityData[0]?.description;
        if (videoId) {
            const extractedUrl = extractVideoUrl(videoId);
            if (extractedUrl) {
                setVideoUrl(extractedUrl);
            } else {
                console.warn('No valid video URL found. Pushing content to non-video state.');
                setNonVideoContent(videoId); // Push content to non-video state
            }
        } else {
            console.error('Video description is null.');
        }
    }, [videoDic]);
    function extractVideoUrl(htmlString) {
        const videoUrlMatch = htmlString.match(/<iframe[^>]+src=["']([^"']+\.mp4)["']|<source[^>]+src=["']([^"']+\.(m4v|mp4))["']/i);
        if (videoUrlMatch) {
            return videoUrlMatch[1] || videoUrlMatch[2];
        } else {
            console.error('No video URL found in the provided HTML string.');
            return null;
        }
    }
    const videoId = videoDic && videoDic?.activityData && videoDic?.activityData?.length > 0
        ? videoDic?.activityData[0]?.youtube_video_id
        : null;
    const pdfAll = videoDic && videoDic?.activityData && videoDic?.activityData?.length > 0
        ? videoDic?.activityData[0]?.document
        : null;
    const completedPercentage = props?.route?.params?.RoleData?.completed_percentage
    const fullIDPercentage = props?.route?.params?.FullID?.percentage;
    const postDataPer = props?.route?.params?.postdata?.completed_percentage;
    const actPerc = props?.route?.params?.activityID?.completed_percentage;
    const validPercentage = [completedPercentage, fullIDPercentage, postDataPer, actPerc]
        .find(p => typeof p == 'number' && !isNaN(p));
    const isCompleted = [completedPercentage, fullIDPercentage, postDataPer, actPerc]
        .some(p => Number(p) == 100);
    const statusMessage = isCompleted
        ? "Completed"
        : `${validPercentage ?? 0}% Pending`;
    const { RoleData, FullID, activityID } = props?.route?.params || {};
    const conferenceIdAll = RoleData?.id || FullID?.conferenceId || activityID?.conferenceId || nextAction?.conferenceId || CMEReducer?.cmenextactionResponse?.conferenceId;
    const handleLink = (link, path) => {
        if (link && path) {
            const showPDF = async () => {
                setLoadingdown(true);
                try {
                    // Remove any spaces from the link and path
                    const cleanedLink = link.replace(/\s+/g, '');
                    const cleanedPath = path.replace(/\s+/g, '');
                    const url = `${cleanedLink}${cleanedPath}`;
                    const fileName = url.split("/").pop();
                    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
                    const options = {
                        fromUrl: url,
                        toFile: localFile,
                    };

                    const downloadResult = await RNFS.downloadFile(options).promise;
                    console.log('Download result:', downloadResult);
                    setPdfUri(localFile);
                } catch (error) {
                    console.error('Error during file download:', error);
                } finally {
                    setLoadingdown(false);
                }
            };
            showPDF();
        }
    };

    useEffect(() => {
        if (pdfUri) {
            const openFileViewer = async () => {
                try {
                    await FileViewer.open(pdfUri);
                    setPdfUri(null);
                } catch (error) {
                    console.error('Error opening file viewer:', error);
                }
            };
            openFileViewer();
        }
    }, [pdfUri]);
    useEffect(() => {
        const onBackPress = () => {
            if (fullscreen) {
                toggleFullscreen();
            } else {
                videoPress();
            }
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );
        return () => backHandler.remove();
    }, [fullscreen]);
    useEffect(() => {
        if (videoId) {
            setFullscreen(!fullscreen);
        }
    }, [videoId])
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, [fullscreen]);
    const finalText = CMEReducer?.cmeactivityResponse?.activityData?.[0]?.flipbook && !fullscreen;
    const isValidCme = (value) =>
        value && value.replace(/\s/g, "") !== "-0";
    const cmeValue =
        isValidCme(props?.route?.params?.RoleData?.display_cme)
            ? props.route.params.RoleData.display_cme
            : isValidCme(props?.route?.params?.FullID?.conferenceCmePoints)
                ? props.route.params.FullID.conferenceCmePoints
                : isValidCme(props?.route?.params?.postdata?.conferenceCmePoints)
                    ? props.route.params.postdata.conferenceCmePoints
                    : isValidCme(props?.route?.params?.activityID?.conferenceCmePoints)
                        ? props.route.params.activityID.conferenceCmePoints
                        : null;
    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            <StatusBar hidden={fullscreen} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {!fullscreen && (
                    Platform.OS === 'ios' ? (
                        <PageHeader title={props?.route?.params?.RoleData?.completed_percentage === 100 || props?.route?.params?.FullID?.percentage === 100 ? "Revise Course" : "Resume Course"} onBackPress={videoPress} />
                    ) : (
                        <View>
                            <PageHeader title={props?.route?.params?.RoleData?.completed_percentage === 100 || props?.route?.params?.FullID?.percentage === 100 ? "Revise Course" : "Resume Course"} onBackPress={videoPress} />
                        </View>
                    )
                )}
                {loadingdown && <View
                    style={[
                        {
                            position: 'absolute',
                            zIndex: 1000001,
                            top: 0,
                            left: 0,
                            height: Dimensions.get('screen').height,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}>
                    <View
                        style={{
                            height: normalize(80),
                            width: normalize(80),
                            justifyContent: 'center',
                            alignItems: "center",
                        }}>
                        <ActivityIndicator size={"small"} color={"green"} style={{ marginTop: normalize(30) }} />
                    </View>
                </View>}

                {conn == false ? <IntOff /> : <ScrollView scrollEnabled={!fullscreen} contentContainerStyle={{ paddingBottom: fullscreen ? normalize(320) : normalize(120) }}>
                    {videoId ? <View style={fullscreen ? styles.fullscreenContainer : styles.container}>
                        <Pressable
                            style={fullscreen ? styles.fullscreenVideoContainer : styles.videoContainer}
                            onPress={() => setShowThumb(!showThumb)}
                        >
                            {videoUrl ? <Video
                                ref={videoRef}
                                source={{ uri: videoUrl }}
                                style={fullscreen ? styles.fullscreenVideo : styles.video}
                                paused={paused}
                                onLoad={onLoad}
                                onProgress={onProgress}
                                onEnd={onEnd}
                                onReadyForDisplay={onReadyForDisplay}
                                bufferConfig={{
                                    minBufferMs: 15000,
                                    maxBufferMs: 50000,
                                    bufferForPlaybackMs: 2500,
                                    bufferForPlaybackAfterRebufferMs: 5000,
                                }}
                                resizeMode="contain"
                                onVideoLoadStart={() => setLoading(true)}
                            /> : <Video
                                ref={videoRef}
                                source={{ uri: videoId }}
                                style={fullscreen ? styles.fullscreenVideo : styles.video}
                                paused={paused}
                                onLoad={onLoad}
                                onProgress={onProgress}
                                onEnd={onEnd}
                                onReadyForDisplay={onReadyForDisplay}
                                bufferConfig={{
                                    minBufferMs: 15000,
                                    maxBufferMs: 50000,
                                    bufferForPlaybackMs: 2500,
                                    bufferForPlaybackAfterRebufferMs: 5000,
                                }}
                                resizeMode="contain"
                                onVideoLoadStart={() => setLoading(true)}
                            />}
                            {loading && (
                                <ActivityIndicator
                                    style={styles.playText}
                                    size="large"
                                    color={Colorpath.white}
                                />
                            )}
                            {showThumb && !loading && (
                                <>
                                    <Pressable onPress={() => setPaused(!paused)} style={styles.playText}>
                                        <PlayIcon style={{ top: 0, left: 0 }} name={paused ? "playcircleo" : "pausecircleo"} size={fullscreen ? 60 : 40} color="#FFFFFF" />
                                    </Pressable>
                                    <Pressable style={fullscreen ? styles.fullscreenButton : styles.nfullmode} onPress={toggleFullscreen}>
                                        <FullIcon style={{ alignSelf: "center" }} name={fullscreen ? "minimize" : "maximize"} size={25} color={fullscreen ? "#FFFFFF" : "#000000"} />
                                    </Pressable>
                                </>
                            )}
                            <View style={{
                                justifyContent: "flex-start", alignContent: "flex-start", position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 10
                            }}>
                                {showThumb && !loading && <Text style={fullscreen ? styles.fulltimeBalance : styles.timeBalance}>
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </Text>}
                            </View>
                        </Pressable>
                        {!fullscreen && !loading ? (
                            <View style={styles.controls}>

                                <Sliders
                                    value={currentTime}
                                    max={duration} valChange={handleSliderChange}
                                    handleSlidingComplete={handleSlidingComplete}
                                />
                            </View>
                        ) : !loading && showThumb && (
                            <View style={styles.fullscreencontrols}>
                                <Sliders
                                    value={currentTime}
                                    max={duration} valChange={handleSliderChange}
                                    handleSlidingComplete={handleSlidingComplete}
                                    fullscreen={true}
                                />
                            </View>
                        )}
                    </View> : nonVideoContent && !fullscreen ? <><RenderHTML
                        contentWidth={300}
                        source={{ html: nonVideoContent }}
                        tagsStyles={{
                            p: { marginLeft: normalize(5), fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#000000" },
                            h3: { marginLeft: normalize(5), fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#000000" },
                            h4: { marginLeft: normalize(5), fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#000000" },
                            h1: { marginLeft: normalize(5), fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#000000" },
                            h2: { marginLeft: normalize(5), fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#000000" }
                        }}
                    />

                    </> : CMEReducer?.cmeactivityResponse?.activityData?.[0]?.flipbook && !fullscreen ? (<View>
                        <FlipbookComponent path={CMEReducer?.cmeactivityResponse?.onlineDisplayPath} link={CMEReducer?.cmeactivityResponse?.activityData?.[0]?.flipbook} />
                    </View>
                    ) : showLoader ? <ActivityIndicator style={{ paddingVertical: normalize(12) }} size={"small"} color={"green"} /> : <View style={{ height: normalize(50), width: normalize(290), paddingVertical: normalize(10) }}><Text style={{ justifyContent: "center", alignSelf: "center", fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>{"No content available"}</Text></View>
                    }

                    {!fullscreen && <><View>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingVertical: finalText ? normalize(25) : normalize(10) }}>
                            <Buttons
                                onPress={() => {
                                    setAddit(statepush);
                                    setStatepush(statepush);
                                    takeCourseVideo();
                                    setPaused(true);
                                    props.navigation.navigate("TabNav");
                                }}
                                height={normalize(45)}
                                width={normalize(150)}
                                backgroundColor={Colorpath.white}
                                borderRadius={normalize(5)}
                                text={CMEReducer?.cmenextactionResponse?.next_activity_button_text ? "Continue Later" : "Course Revision Completed... "}
                                color={CMEReducer?.cmenextactionResponse?.next_activity_button_text ? Colorpath.ButtonColr : Colorpath.black}
                                fontSize={16}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(-15)}
                                borderWidth={0.5}
                                borderColor={"#DDD"}
                                disabled={CMEReducer?.cmenextactionResponse?.next_activity_button_text ? false : true} />
                            <Buttons
                                onPress={() => {
                                    if (CMEReducer?.cmenextactionResponse?.next_activity_button_text == "Proceed to Post Test" || CMEReducer?.cmenextactionResponse?.next_activity_button_text == "Proceed to Feedback/Evaluation" || !CMEReducer?.cmenextactionResponse?.next_activity_button_text) {
                                        if (CMEReducer?.cmenextactionResponse?.next_activity_button_text) {
                                            takeCourseVideo();
                                            setPaused(true);
                                            props.navigation.navigate("PreTest", {
                                                activityID: { activityID: nextAction?.next_activity_id, conference_id: conferenceIdAll, text: CMEReducer?.cmenextactionResponse?.next_activity_text }
                                            });
                                        } else {
                                            setAddit(statepush);
                                            setStatepush(statepush);
                                            takeCourseVideo();
                                            setPaused(true);
                                            props.navigation.navigate("TabNav");
                                        }
                                    } else {
                                        takeCourseVideo();
                                        setPaused(true);
                                        const reviseTextagain = CMEReducer?.cmenextactionResponse?.percentage == 100 || props?.route?.params?.RoleData?.completed_percentage == 100 || props?.route?.params?.FullID?.percentage == 100;
                                        let obj = {
                                            "conference_id": CMEReducer?.cmenextactionResponse?.conferenceId,
                                            "ActivityId": CMEReducer?.cmenextactionResponse?.next_activity_id,
                                        }
                                        let reviseobj = {
                                            "conference_id": CMEReducer?.cmenextactionResponse?.conferenceId,
                                            "ActivityId": CMEReducer?.cmenextactionResponse?.next_activity_id,
                                            "revise_activity": 1
                                        }
                                        let objact = {
                                            "ActivityId": CMEReducer?.cmenextactionResponse?.next_activity_id
                                        }
                                        connectionrequest()
                                            .then(() => {
                                                dispatch(cmenextactionRequest(reviseTextagain ? reviseobj : obj));
                                                dispatch(cmeactivityRequest(objact));
                                            })
                                            .catch((err) => { showErrorAlert("Please connect to internet", err) })
                                    }
                                }}
                                height={normalize(45)}
                                width={normalize(150)}
                                backgroundColor={CMEReducer?.cmenextactionResponse?.next_activity_button_text ? Colorpath.white : Colorpath.ButtonColr}
                                borderRadius={normalize(5)}
                                text={CMEReducer?.cmenextactionResponse?.next_activity_button_text ? nextAction?.next_activity_button_text : " Go back to Dashboard "}
                                color={CMEReducer?.cmenextactionResponse?.next_activity_button_text ? Colorpath.ButtonColr : Colorpath.white}
                                fontSize={16}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(-15)} />
                        </View>
                    </View><View>
                            {pdfAll && <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                                <Pressable onPress={() => { handleLink(videoDic?.onlineDisplayPath, pdfAll) }} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: '100%', gap: normalize(3) }}>
                                    <Image source={Imagepath.PdfFile} style={{ height: normalize(20), width: normalize(20), resizeMode: "contain" }} />
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterMedium,
                                            fontSize: 16,
                                            color: "#000000",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {"Click here to view the PDF Presentation"}
                                    </Text>
                                </Pressable>
                            </View>}
                        </View></>
                    }
                </ScrollView>}
            </SafeAreaView>
        </>
    );
};

export default VideoComponent;
const pageViewPositionSlider = {
    trackColor: '#ABABAB',
    thumbColor: '#1411AB',
    style: {
        width: '100%',
        height: 20,
        borderRadius: 10
    },
};