import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform, Text, ActivityIndicator, Image, ScrollView, StatusBar, BackHandler, Pressable, Linking } from 'react-native';
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
import { extractVttCandidates, findCueForTime, parseThumbnailVtt, resolveUrl } from '../Utils/Helpers/VttPreview';
let status = "";
let status1 = "";
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview';

const normalizeVideoSource = (url) => {
    if (!url) return null;
    return url.trim().replace(/&amp;/g, '&');
};

const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0`;
    }
    return null;
};



const getExternalVideoUrl = (source) => {
    if (!source) return null;
    const normalized = normalizeVideoSource(source);
    if (/^https?:\/\//i.test(normalized)) return normalized;
    if (/^[\w-]{11}$/.test(normalized)) {
        return `https://www.youtube.com/watch?v=${normalized}`;
    }
    return null;
};

const isPlayableVideoSource = (source) => {
    const normalized = normalizeVideoSource(source);
    return /\.(mp4|m4v|mov|webm|m3u8)(\?|$)/i.test(normalized);
};

const extractVideoUrl = (htmlString) => {
    if (!htmlString) return null;
    const videoUrlMatch = htmlString.match(/<iframe[^>]+src=["']([^"']+\.(m3u8|mp4|m4v|mov|webm)[^"']*)["']|<source[^>]+src=["']([^"']+\.(m4v|mp4|mov|webm|m3u8)[^"']*)["']/i);
    if (videoUrlMatch) {
        return videoUrlMatch[1] || videoUrlMatch[3];
    }
    return null;
};

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
    const routeVttParam = props?.route?.params?.vttUrl;
    const [nextAction, setNextAction] = useState(null);
    const [paused, setPaused] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [sliderDragTime, setSliderDragTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const sliderValueRef = useRef(0);
    const [showLoader, setShowLoader] = useState(true);
    const [conn, setConn] = useState("")
    const [showThumb, setShowThumb] = useState(true);
    const [fullscreen, setFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [videoHeight, setVideoHeight] = useState(normalize(200));
    const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9);
    const [videoDic, setVideoDic] = useState(props?.route?.params?.RoleData || []);
    const [videoUrl, setVideoUrl] = useState(null);
    const [externalVideoUrl, setExternalVideoUrl] = useState(null);
    const [loadingdown, setLoadingdown] = useState(false);
    const [pdfUri, setPdfUri] = useState("");
    const [nonVideoContent, setNonVideoContent] = useState(null);
    const [thumbnailVttCandidates, setThumbnailVttCandidates] = useState([]);
    const [thumbnailCues, setThumbnailCues] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewTime, setPreviewTime] = useState(0);
    const [previewFrame, setPreviewFrame] = useState(null);
    const [previewVideoReady, setPreviewVideoReady] = useState(false);
    const [initialVideoThumbnail, setInitialVideoThumbnail] = useState(null);
    const [showTransitionCover, setShowTransitionCover] = useState(false);
    const [transitionCoverFrame, setTransitionCoverFrame] = useState(null);
    const controlsTimerRef = useRef(null);
    const wasPausedBeforeSeekRef = useRef(false);
    const lastPreviewCueIndexRef = useRef(-1);
    const previewTokenRef = useRef(0);
    const spriteSizeCacheRef = useRef({});
    const cueFrameCacheRef = useRef({});
    const previewVideoRef = useRef(null);
    const pendingPreviewSeekRef = useRef(null);
    const previewSeekRafRef = useRef(null);
    const latestPreviewTargetRef = useRef(0);
    const fullscreenTransitionRef = useRef(false);
    const fullscreenTransitionTimerRef = useRef(null);
    const hideTransitionCoverTimerRef = useRef(null);
    const [isSeeking, setIsSeeking] = useState(false);
    const didSetInitialFullscreenRef = useRef(false);
    const [useBlackFullscreenTimer, setUseBlackFullscreenTimer] = useState(true);
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
    const { width, height } = Dimensions.get('window');
    useEffect(() => {
        if (fullscreen) {
            Orientation.lockToLandscape();
            setVideoHeight(height);
        } else {
            Orientation.lockToPortrait();
            const calculatedHeight = width / (videoAspectRatio || (16 / 9));
            const minHeight = normalize(180);
            const maxHeight = height * 0.62;
            setVideoHeight(Math.max(minHeight, Math.min(calculatedHeight, maxHeight)));
        }
    }, [fullscreen, height, width, videoAspectRatio]);
    useEffect(() => {
        return () => {
            Orientation.lockToPortrait();
        };
    }, []);
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
            borderRadius: normalize(10),
            overflow: 'hidden',
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
        },
        loadingThumbWrap: {
            ...StyleSheet.absoluteFillObject,
            zIndex: 890,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
        },
        loadingThumbImage: {
            width: '100%',
            height: '100%',
        },
        transitionCoverWrap: {
            ...StyleSheet.absoluteFillObject,
            zIndex: 980,
            backgroundColor: '#101010',
            justifyContent: 'center',
            alignItems: 'center',
        },
        transitionCoverImage: {
            width: '100%',
            height: '100%',
        },
        transitionCoverCropWrap: {
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: '#101010',
        },
        transitionCoverCropImage: {
            position: 'absolute',
            left: 0,
            top: 0,
        },
        playText: {
            position: 'absolute',
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: fullscreen ? 50 : 30,
            height: fullscreen ? 60 : 40,
            width: fullscreen ? 60 : 40,
            zIndex: 999,
            justifyContent: 'center',
            alignItems: 'center',
        },
        fullscreencontrols: {
            width: "100%",
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? normalize(18) : normalize(12),
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: normalize(10),
            zIndex: 1000,
        },
        controls: {
            width: "100%",
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: normalize(10),
            paddingTop: normalize(4),
            paddingBottom: normalize(8),
        },
        sliderWrap: {
            flex: 1,
            paddingHorizontal: normalize(4),
            paddingVertical: 0,
            bottom: 0,
        },
        sliderWithPreview: {
            flex: 1,
            position: 'relative',
            justifyContent: 'center',
        },
        previewBubble: {
            position: 'absolute',
            bottom: normalize(28),
            width: normalize(120),
            borderRadius: normalize(8),
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            padding: normalize(4),
            overflow: 'hidden',
            zIndex: 2000,
        },
        fullscreenPreviewBubble: {
            bottom: normalize(32),
            width: normalize(138),
        },
        previewImage: {
            width: '100%',
            height: normalize(68),
            borderRadius: normalize(6),
            backgroundColor: '#222222',
        },
        previewCropWrap: {
            width: '100%',
            height: normalize(68),
            borderRadius: normalize(6),
            backgroundColor: '#222222',
            overflow: 'hidden',
        },
        previewCropImage: {
            position: 'absolute',
            left: 0,
            top: 0,
        },
        previewTimeText: {
            marginTop: normalize(4),
            color: '#FFFFFF',
            textAlign: 'center',
            fontFamily: Fonts.InterSemiBold,
            fontSize: 11,
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
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            bottom: fullscreen ? normalize(48) : normalize(10),
            right: fullscreen ? 17 : 10,
            zIndex: 1000,
            height: normalize(35),
            width: normalize(35),
            borderRadius: normalize(35),
            justifyContent: "center",
            alignItems: "center"
        } : {
            position: 'absolute',
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            bottom: fullscreen ? normalize(48) : normalize(10),
            right: fullscreen ? 17 : 10,
            zIndex: 1000,
            height: normalize(35),
            width: normalize(35),
            borderRadius: normalize(35),
            justifyContent: "center",
            alignItems: "center"
        },
        timeLabel: {
            color: '#111111',
            fontFamily: Fonts.InterMedium,
            fontSize: 13,
            textAlignVertical: 'center',
        },
        leftTime: {
            minWidth: normalize(46),
            textAlign: 'left',
            marginRight: normalize(6),
        },
        rightTime: {
            minWidth: normalize(46),
            textAlign: 'right',
            marginLeft: normalize(6),
        },
        fullscreenTimeLabel: {
            fontWeight: '600',
        },
        fullscreenTimeBlack: {
            color: '#000000',
            textShadowColor: 'rgba(255,255,255,0.9)',
            textShadowRadius: 3,
            textShadowOffset: { width: 0, height: 0 },
        },
        fullscreenTimeWhite: {
            color: '#FFFFFF',
            textShadowColor: 'rgba(0,0,0,0.9)',
            textShadowRadius: 3,
            textShadowOffset: { width: 0, height: 0 },
        },
        timer: {
            color: '#000000',
            marginLeft: 10,
        },
        openExternalButton: {
            marginTop: normalize(12),
            marginHorizontal: normalize(12),
            backgroundColor: '#E53935',
            borderRadius: normalize(8),
            paddingVertical: normalize(11),
            paddingHorizontal: normalize(12),
            alignItems: 'center',
        },
        openExternalButtonText: {
            color: '#FFFFFF',
            fontFamily: Fonts.InterSemiBold,
            fontSize: 14,
        },
    });
    const onLoad = (data) => {
        setDuration(data.duration || 0);
        const naturalWidth = Number(data?.naturalSize?.width) || 0;
        const naturalHeight = Number(data?.naturalSize?.height) || 0;
        if (naturalWidth > 0 && naturalHeight > 0) {
            setVideoAspectRatio(naturalWidth / naturalHeight);
        }

        const initialTime = videoDic && videoDic?.video_play_time ? parseFloat(videoDic.video_play_time) : 0;

        if (videoRef.current) {
            setTimeout(() => {
                videoRef.current.seek(initialTime);
                setCurrentTime(initialTime);
            }, 100);
        }

        setLoading(false);
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
        if (isSeeking) return;
        setCurrentTime(data.currentTime);
        setSliderDragTime(data.currentTime);
    };

    const onEnd = () => {
        setPaused(true);
        setCurrentTime(0);
        videoRef.current?.seek(0);
        setShowThumb(true);
    };

    const onReadyForDisplay = () => {
        setLoading(false);
        if (fullscreenTransitionRef.current && showTransitionCover) {
            if (hideTransitionCoverTimerRef.current) {
                clearTimeout(hideTransitionCoverTimerRef.current);
            }
            hideTransitionCoverTimerRef.current = setTimeout(() => {
                setShowTransitionCover(false);
            }, 160);
        }
    };

    const getTransitionCoverFrame = useCallback(() => {
        if (previewFrame?.uri) {
            return previewFrame;
        }
        const cueHit = findCueForTime(thumbnailCues, currentTime);
        if (cueHit?.cue?.uri) {
            const cue = cueHit.cue;
            return {
                ...cue,
                spriteSize: cue?.uri ? spriteSizeCacheRef.current[cue.uri] : null,
            };
        }
        const activity = videoDic?.activityData?.[0] || {};
        const posterUri = activity?.poster
            || activity?.thumbnail
            || activity?.thumb
            || activity?.video_thumbnail
            || activity?.image
            || null;
        if (!posterUri) return null;
        return {
            uri: resolveUrl(videoDic?.onlineDisplayPath || videoUrl, posterUri),
            crop: null,
            spriteSize: null,
        };
    }, [previewFrame, thumbnailCues, currentTime, videoDic, videoUrl]);

    const toggleFullscreen = () => {
        const cover = getTransitionCoverFrame();
        if (cover?.uri) {
            setTransitionCoverFrame(cover);
            setShowTransitionCover(true);
        } else if (transitionCoverFrame?.uri) {
            setShowTransitionCover(true);
        }
        fullscreenTransitionRef.current = true;
        if (fullscreenTransitionTimerRef.current) {
            clearTimeout(fullscreenTransitionTimerRef.current);
        }
        fullscreenTransitionTimerRef.current = setTimeout(() => {
            fullscreenTransitionRef.current = false;
            setShowTransitionCover(false);
        }, 700);
        setFullscreen(!fullscreen);
    };

    const clearControlsTimer = useCallback(() => {
        if (controlsTimerRef.current) {
            clearTimeout(controlsTimerRef.current);
            controlsTimerRef.current = null;
        }
    }, []);

    const showControlsBriefly = useCallback(() => {
        setShowThumb(true);
        clearControlsTimer();
        if (!paused && !loading) {
            controlsTimerRef.current = setTimeout(() => {
                setShowThumb(false);
            }, 2600);
        }
    }, [clearControlsTimer, paused, loading]);

    useEffect(() => {
        if (showThumb) {
            showControlsBriefly();
        } else {
            clearControlsTimer();
        }
    }, [showThumb, paused, loading, showControlsBriefly, clearControlsTimer]);

    useEffect(() => () => clearControlsTimer(), [clearControlsTimer]);
    useEffect(() => {
        return () => {
            if (fullscreenTransitionTimerRef.current) {
                clearTimeout(fullscreenTransitionTimerRef.current);
                fullscreenTransitionTimerRef.current = null;
            }
            if (hideTransitionCoverTimerRef.current) {
                clearTimeout(hideTransitionCoverTimerRef.current);
                hideTransitionCoverTimerRef.current = null;
            }
        };
    }, []);

    const videoPress = () => {
        setAddit(statepush);
        takeCourseVideo();
        props.navigation.goBack();
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? '0' : ''}${minutes}.${seconds < 10 ? '0' : ''}${seconds}`;
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
                break; // ← fixed fall-through
            case 'CME/cmeactivityFailure':
                status = CMEReducer.status;
                break;
            case 'CME/cmenextactionRequest':
                status = CMEReducer.status;
                break;
            case 'CME/cmenextactionSuccess':
                status = CMEReducer.status;
                setNextAction(CMEReducer?.cmenextactionResponse);
                break; // ← fixed fall-through
            case 'CME/cmenextactionFailure':
                status = CMEReducer.status;
                break;
            case 'CME/nextactionagainRequest':
                status = CMEReducer.status;
                break;
            case 'CME/nextactionagainSuccess':
                status = CMEReducer.status;
                break; // ← fixed fall-through
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
    const schedulePreviewSeek = useCallback((targetValue) => {
        if (!previewVideoRef.current || !previewVideoReady) return;
        latestPreviewTargetRef.current = targetValue;
        if (previewSeekRafRef.current) return;
        previewSeekRafRef.current = requestAnimationFrame(() => {
            previewSeekRafRef.current = null;
            const target = Math.max(0, Number(latestPreviewTargetRef.current) || 0);
            pendingPreviewSeekRef.current = target;
            try {
                previewVideoRef.current?.seek(target);
            } catch (err) {
                // no-op: preview seek is best effort only
            }
        });
    }, [previewVideoReady]);

    const warmCueAsset = useCallback((cue) => {
        if (!cue?.uri) return;
        const uri = cue.uri;
        if (/^https?:\/\//i.test(uri)) {
            Image.prefetch(uri).catch(() => { });
        }
        if (cue?.crop && !spriteSizeCacheRef.current[uri]) {
            Image.getSize(
                uri,
                (w, h) => {
                    spriteSizeCacheRef.current[uri] = { width: w, height: h };
                },
                () => { },
            );
        }
    }, []);

    const setTwoCueCache = useCallback((currentIndex, currentCue, nextCue) => {
        const nextIndex = currentIndex + 1;
        const nextCache = {};
        if (currentCue) {
            nextCache[currentIndex] = currentCue;
        }
        if (nextCue) {
            nextCache[nextIndex] = nextCue;
        }
        cueFrameCacheRef.current = nextCache;
    }, []);

    const handleSliderChange = (value) => {
        sliderValueRef.current = value;
        setSliderDragTime(value);
        setPreviewTime(value);
        // Some slider implementations may skip onSlidingStart during quick drags.
        // This keeps preview visible and seek-state stable.
        if (!isSeeking) {
            wasPausedBeforeSeekRef.current = paused;
            setIsSeeking(true);
            setPaused(true);
        }
        if (!previewVisible) {
            setPreviewVisible(true);
        }
        if (!previewFrame?.uri && videoUrl && (previewVisible || isSeeking)) {
            schedulePreviewSeek(value);
        }
    };

    const syncPreviewForTime = useCallback((timeValue) => {
        if (!thumbnailCues.length) {
            setPreviewFrame(null);
            return;
        }
        const found = findCueForTime(thumbnailCues, timeValue);
        if (!found) {
            setPreviewFrame(null);
            return;
        }

        const currentCue = found.cue;
        const currentIndex = found.index;
        const nextCue = thumbnailCues[currentIndex + 1] || null;

        // Keep a tiny persistent cache of the current + next cue.
        setTwoCueCache(currentIndex, currentCue, nextCue);
        warmCueAsset(currentCue);
        warmCueAsset(nextCue);

        if (found.index === lastPreviewCueIndexRef.current) return;
        lastPreviewCueIndexRef.current = found.index;
        const cue = cueFrameCacheRef.current[currentIndex] || currentCue;
        const thisToken = previewTokenRef.current + 1;
        previewTokenRef.current = thisToken;
        const applyCue = (spriteSize = null) => {
            if (previewTokenRef.current !== thisToken) return;
            setPreviewFrame({ ...cue, spriteSize });
        };
        const cachedSize = cue?.uri ? spriteSizeCacheRef.current[cue.uri] : null;
        // Show frame immediately for responsive scrubbing; loading continues in background.
        applyCue(cachedSize || null);

        if (cue?.crop && cue?.uri && !cachedSize) {
            Image.getSize(
                cue.uri,
                (imgWidth, imgHeight) => {
                    const size = { width: imgWidth, height: imgHeight };
                    spriteSizeCacheRef.current[cue.uri] = size;
                    applyCue(size);
                },
                () => { },
            );
        }
        if (cue?.uri && /^https?:\/\//i.test(cue.uri)) {
            Image.prefetch(cue.uri).catch(() => { });
        }
    }, [thumbnailCues, setTwoCueCache, warmCueAsset]);

    useEffect(() => {
        if (isSeeking) {
            syncPreviewForTime(previewTime);
        }
    }, [previewTime, isSeeking, syncPreviewForTime]);

    useEffect(() => {
        if (!videoUrl) return;
        pendingPreviewSeekRef.current = currentTime || 0;
        latestPreviewTargetRef.current = currentTime || 0;
    }, [videoUrl, currentTime]);

    useEffect(() => {
        if (!previewVisible || !isSeeking) return;
        if (!!previewFrame?.uri || !videoUrl) return;
        if (!previewVideoRef.current || !previewVideoReady) return;
        schedulePreviewSeek(previewTime);
    }, [previewTime, previewVisible, isSeeking, previewFrame, videoUrl, previewVideoReady, schedulePreviewSeek]);

    const handleSlidingStart = useCallback(() => {
        showControlsBriefly();
        wasPausedBeforeSeekRef.current = paused;
        setIsSeeking(true);
        setPaused(true);
        setPreviewVisible(true);
        setPreviewTime(currentTime);
        setSliderDragTime(currentTime);
        syncPreviewForTime(currentTime);
    }, [paused, showControlsBriefly, currentTime, syncPreviewForTime]);
    const handleSeek = useCallback((time) => {
        showControlsBriefly();
        if (!videoRef.current) {
            console.warn('Video reference not available');
            return;
        }
        try {
            if (typeof videoRef.current?.seek === 'function') {
                videoRef.current.seek(time);
            } else if (typeof videoRef.current?.player?.seek === 'function') {
                videoRef.current.player.seek(time);
            }
            setCurrentTime(time);
        } catch (e) {
            console.warn('Seek attempt failed:', e);
        }
    }, [showControlsBriefly]);
    const handleSlidingComplete = useCallback((value) => {
        handleSeek(value);
        setSliderDragTime(value);
        setIsSeeking(false);
        setPreviewVisible(false);
        if (!wasPausedBeforeSeekRef.current) {
            setPaused(false);
        }
    }, [handleSeek]);
    useEffect(() => {
        return () => {
            if (previewSeekRafRef.current) {
                cancelAnimationFrame(previewSeekRafRef.current);
                previewSeekRafRef.current = null;
            }
        };
    }, []);
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
        const activeDic = (videoDic && videoDic.activityData && videoDic.activityData.length > 0)
            ? videoDic
            : (props?.route?.params?.RoleData && props?.route?.params?.RoleData.activityData && props?.route?.params?.RoleData.activityData.length > 0)
                ? props.route.params.RoleData
                : null;

        if (!activeDic) {
            setVideoUrl(null);
            setExternalVideoUrl(null);
            setThumbnailVttCandidates([]);
            setThumbnailCues([]);
            setPreviewVideoReady(false);
            setInitialVideoThumbnail(null);
            setShowLoader(false);
            return;
        }

        const descriptionHtml = activeDic?.activityData?.[0]?.description || '';
        const descriptionUrl = extractVideoUrl(descriptionHtml);
        const rawVideoId = activeDic?.activityData?.[0]?.youtube_video_id
            || props?.route?.params?.RoleData?.activityData?.[0]?.youtube_video_id
            || props?.route?.params?.RoleData?.video_audio_details?.[0]?.youtube_video_id
            || '';
        const candidateSource = descriptionUrl || rawVideoId;

        if (!candidateSource && !activeDic?.activityData?.[0]?.flipbook) {
            setShowLoader(false);
        }

        // The baseUrl for VTT resolution: prefer a real HTTP URL (from description
        // or onlineDisplayPath) so that relative VTT paths can be resolved.
        // A bare YouTube video ID is NOT a valid base URL, so we skip it.
        const onlineBase = activeDic?.onlineDisplayPath || '';
        const isYouTubeId = candidateSource && /^[\w-]{11}$/.test(candidateSource.trim());
        const vttBaseUrl = /^https?:\/\//i.test(onlineBase)
            ? onlineBase
            : !isYouTubeId && /^https?:\/\//i.test(candidateSource)
                ? candidateSource
                : '';

        let resolvedVideoUrl = null;
        if (candidateSource && isPlayableVideoSource(candidateSource)) {
            resolvedVideoUrl = normalizeVideoSource(candidateSource);
            setVideoUrl(resolvedVideoUrl);
            setExternalVideoUrl(null);
            setNonVideoContent(null);
        } else {
            setVideoUrl(null);
            resolvedVideoUrl = null;
            setNonVideoContent(descriptionHtml || null);
            setExternalVideoUrl(getExternalVideoUrl(candidateSource));
        }

        const activityData = activeDic?.activityData?.[0] || {};
        const posterUri = activityData?.poster
            || activityData?.thumbnail
            || activityData?.thumb
            || activityData?.video_thumbnail
            || activityData?.image
            || null;
        if (posterUri) {
            setInitialVideoThumbnail(resolveUrl(activeDic?.onlineDisplayPath || resolvedVideoUrl || candidateSource, posterUri));
        } else {
            setInitialVideoThumbnail(null);
        }
        const vttCandidates = extractVttCandidates({
            routeVtt: routeVttParam,
            activityData,
            descriptionHtml,
            baseUrl: vttBaseUrl,
            videoUrl: resolvedVideoUrl || (!isYouTubeId ? candidateSource : null),
        });
        setThumbnailVttCandidates(vttCandidates);
        setPreviewVideoReady(false);
    }, [videoDic, routeVttParam, props?.route?.params?.RoleData]);

    useEffect(() => {
        let isActive = true;
        if (!thumbnailVttCandidates?.length) {
            setThumbnailCues([]);
            setPreviewFrame(null);
            lastPreviewCueIndexRef.current = -1;
            return () => { };
        }

        const loadVtt = async () => {
            for (let idx = 0; idx < thumbnailVttCandidates.length; idx += 1) {
                const candidateUrl = thumbnailVttCandidates[idx];
                try {
                    const response = await fetch(candidateUrl);
                    const text = await response.text();
                    if (!isActive) return;
                    const cues = parseThumbnailVtt(text, candidateUrl);
                    if (cues.length > 0) {
                        setThumbnailCues(cues);
                        lastPreviewCueIndexRef.current = -1;
                        return;
                    }
                } catch (err) {
                    if (!isActive) return;
                }
            }

            if (!isActive) return;
            console.log('Thumbnail VTT load failed for all candidates.');
            setThumbnailCues([]);
            setPreviewFrame(null);
            lastPreviewCueIndexRef.current = -1;
        };

        loadVtt();
        return () => {
            isActive = false;
        };
    }, [thumbnailVttCandidates]);

    useEffect(() => {
        if (!thumbnailCues?.length) return;
        const uniqueUris = [...new Set(thumbnailCues.map((c) => c?.uri).filter(Boolean))];

        uniqueUris.forEach((uri) => {
            if (/^https?:\/\//i.test(uri)) {
                Image.prefetch(uri).catch(() => { });
            }
            if (!spriteSizeCacheRef.current[uri]) {
                Image.getSize(
                    uri,
                    (w, h) => {
                        spriteSizeCacheRef.current[uri] = { width: w, height: h };
                    },
                    () => { },
                );
            }
        });
    }, [thumbnailCues]);

    useEffect(() => {
        if (!thumbnailCues?.length || !isSeeking) return;
        const found = findCueForTime(thumbnailCues, previewTime);
        if (!found) return;
        const curr = found.cue;
        const next = thumbnailCues[found.index + 1] || null;
        setTwoCueCache(found.index, curr, next);
        warmCueAsset(curr);
        warmCueAsset(next);
    }, [thumbnailCues, isSeeking, previewTime, setTwoCueCache, warmCueAsset]);

    const hasVideoSource = !!videoUrl;
    useEffect(() => {
        if (hasVideoSource && !didSetInitialFullscreenRef.current) {
            didSetInitialFullscreenRef.current = true;
            setFullscreen(true);
            setShowThumb(true);
        }
    }, [hasVideoSource]);
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
    const displayedTime = isSeeking ? sliderDragTime : currentTime;
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
    const renderThumbnailPreview = (isFullscreen = false) => {
        if (!duration) return null;
        const ratio = Math.max(0, Math.min(1, (duration > 0 ? previewTime / duration : 0)));
        const previewWidth = isFullscreen ? normalize(138) : normalize(120);
        const left = ratio * 100;
        const crop = previewFrame?.crop;
        const spriteSize = previewFrame?.spriteSize;
        const hasImageFrame = !!(previewFrame?.uri);
        // Only use the video mini-player fallback when we have a valid playable URL
        const shouldUseVideoFallback = !hasImageFrame && !!videoUrl && typeof videoUrl === 'string' && videoUrl.length > 0;

        if (!hasImageFrame && !shouldUseVideoFallback) return null;

        return (
            <View
                pointerEvents="none"
                style={[
                    styles.previewBubble,
                    isFullscreen && styles.fullscreenPreviewBubble,
                    {
                        left: `${left}%`,
                        marginLeft: -(previewWidth / 2),
                        opacity: previewVisible ? 1 : 0,
                    }
                ]}
            >
                {hasImageFrame && crop && spriteSize?.width && spriteSize?.height ? (
                    <View style={styles.previewCropWrap}>
                        <Image
                            source={{ uri: previewFrame.uri }}
                            style={[
                                styles.previewCropImage,
                                {
                                    width: spriteSize.width,
                                    height: spriteSize.height,
                                    transform: [{ translateX: -(crop.x || 0) }, { translateY: -(crop.y || 0) }],
                                }
                            ]}
                        />
                    </View>
                ) : hasImageFrame ? (
                    <Image
                        source={{ uri: previewFrame.uri }}
                        style={styles.previewImage}
                        resizeMode="cover"
                        onError={() => { /* silently ignore broken VTT thumbnail images */ }}
                    />
                ) : shouldUseVideoFallback ? (
                    <Video
                        ref={previewVideoRef}
                        source={{ uri: videoUrl }}
                        style={styles.previewImage}
                        paused={!isSeeking}
                        muted={true}
                        repeat={false}
                        resizeMode="cover"
                        onLoad={() => {
                            setPreviewVideoReady(true);
                            const target = pendingPreviewSeekRef.current;
                            if (typeof target === 'number' && isFinite(target)) {
                                try { previewVideoRef.current?.seek(target); } catch (_) { }
                            }
                        }}
                        onReadyForDisplay={() => {
                            setPreviewVideoReady(true);
                            const target = pendingPreviewSeekRef.current;
                            if (typeof target === 'number' && isFinite(target)) {
                                try { previewVideoRef.current?.seek(target); } catch (_) { }
                            }
                        }}
                        onError={() => {
                            // Preview video failed; reset so we don't keep retrying
                            setPreviewVideoReady(false);
                        }}
                        onProgress={() => {
                            // Keep decoder warm while scrubbing.
                        }}
                    />
                ) : null}
                <Text style={styles.previewTimeText}>{formatTime(previewTime)}</Text>
            </View>
        );
    };
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
                    {(hasVideoSource || (externalVideoUrl && getEmbedUrl(externalVideoUrl))) ? <View style={fullscreen ? styles.fullscreenContainer : styles.container}>
                        {hasVideoSource ? (
                            <Pressable
                                style={fullscreen ? styles.fullscreenVideoContainer : styles.videoContainer}
                                onPress={() => {
                                    setShowThumb((prev) => !prev);
                                    if (!showThumb) {
                                        showControlsBriefly();
                                    }
                                }}
                            >
                                <Video
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
                                    shutterColor="transparent"
                                    hideShutterView={true}
                                    onVideoLoadStart={() => {
                                        if (!fullscreenTransitionRef.current) {
                                            setLoading(true);
                                        }
                                    }}
                                />
                                {loading && initialVideoThumbnail && (
                                    <View pointerEvents="none" style={styles.loadingThumbWrap}>
                                        <Image
                                            source={{ uri: initialVideoThumbnail }}
                                            style={styles.loadingThumbImage}
                                            resizeMode="contain"
                                        />
                                    </View>
                                )}
                                {showTransitionCover && transitionCoverFrame?.uri && (
                                    <View pointerEvents="none" style={styles.transitionCoverWrap}>
                                        {transitionCoverFrame?.crop && transitionCoverFrame?.spriteSize?.width && transitionCoverFrame?.spriteSize?.height ? (
                                            <View style={styles.transitionCoverCropWrap}>
                                                <Image
                                                    source={{ uri: transitionCoverFrame.uri }}
                                                    style={[
                                                        styles.transitionCoverCropImage,
                                                        {
                                                            width: transitionCoverFrame.spriteSize.width,
                                                            height: transitionCoverFrame.spriteSize.height,
                                                            transform: [
                                                                { translateX: -(transitionCoverFrame.crop.x || 0) },
                                                                { translateY: -(transitionCoverFrame.crop.y || 0) },
                                                            ],
                                                        },
                                                    ]}
                                                />
                                            </View>
                                        ) : (
                                            <Image
                                                source={{ uri: transitionCoverFrame.uri }}
                                                style={styles.transitionCoverImage}
                                                resizeMode="contain"
                                            />
                                        )}
                                    </View>
                                )}
                                {loading && (
                                    <ActivityIndicator
                                        style={styles.playText}
                                        size="large"
                                        color={Colorpath.white}
                                    />
                                )}
                                {showThumb && !loading && (
                                    <Pressable onPress={() => {
                                        setPaused(!paused);
                                        showControlsBriefly();
                                    }} style={styles.playText}>
                                        <PlayIcon style={{ top: 0, left: 0 }} name={paused ? "playcircleo" : "pausecircleo"} size={fullscreen ? 60 : 40} color="#FFFFFF" />
                                    </Pressable>
                                )}
                                {!loading && (
                                    <Pressable style={fullscreen ? styles.fullscreenButton : styles.nfullmode} onPress={toggleFullscreen}>
                                        <FullIcon style={{ alignSelf: "center" }} name={fullscreen ? "minimize" : "maximize"} size={22} color="#FFFFFF" />
                                    </Pressable>
                                )}
                            </Pressable>
                        ) : (
                            <View style={fullscreen ? styles.fullscreenVideoContainer : styles.videoContainer}>
                                <WebView
                                    style={fullscreen ? styles.fullscreenVideo : styles.video}
                                    source={{ uri: getEmbedUrl(externalVideoUrl) }}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    allowsFullscreenVideo={true}
                                />
                            </View>
                        )}
                        {!fullscreen && !loading && hasVideoSource ? (
                            <View style={styles.controls}>
                                <Text style={[styles.timeLabel, styles.leftTime]}>
                                    {formatTime(displayedTime)}
                                </Text>
                                <View style={styles.sliderWithPreview}>
                                    {renderThumbnailPreview(false)}
                                    <Sliders
                                        value={displayedTime}
                                        max={duration}
                                        valChange={handleSliderChange}
                                        onSlidingStart={handleSlidingStart}
                                        handleSlidingComplete={handleSlidingComplete}
                                        containerStyle={styles.sliderWrap}
                                        thumbStyle={{
                                            height: 14,
                                            width: 14,
                                            backgroundColor: '#1F1F1F',
                                            borderWidth: 1,
                                            borderColor: '#1F1F1F',
                                        }}
                                    />
                                </View>
                                <Text style={[styles.timeLabel, styles.rightTime]}>
                                    {formatTime(duration)}
                                </Text>
                            </View>
                        ) : !loading && showThumb && hasVideoSource && (
                            <View style={styles.fullscreencontrols}>
                                <Pressable onPress={() => setUseBlackFullscreenTimer((prev) => !prev)} hitSlop={8}>
                                    <Text style={[
                                        styles.timeLabel,
                                        styles.fullscreenTimeLabel,
                                        styles.leftTime,
                                        useBlackFullscreenTimer ? styles.fullscreenTimeBlack : styles.fullscreenTimeWhite
                                    ]}>
                                        {formatTime(displayedTime)}
                                    </Text>
                                </Pressable>
                                <View style={styles.sliderWithPreview}>
                                    {renderThumbnailPreview(true)}
                                    <Sliders
                                        value={displayedTime}
                                        max={duration}
                                        valChange={handleSliderChange}
                                        onSlidingStart={handleSlidingStart}
                                        handleSlidingComplete={handleSlidingComplete}
                                        fullscreen={true}
                                        containerStyle={styles.sliderWrap}
                                    />
                                </View>
                                <Pressable onPress={() => setUseBlackFullscreenTimer((prev) => !prev)} hitSlop={8}>
                                    <Text style={[
                                        styles.timeLabel,
                                        styles.fullscreenTimeLabel,
                                        styles.rightTime,
                                        useBlackFullscreenTimer ? styles.fullscreenTimeBlack : styles.fullscreenTimeWhite
                                    ]}>
                                        {formatTime(duration)}
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                    </View> : (nonVideoContent || externalVideoUrl) && !fullscreen ? <View style={{ padding: normalize(15) }}>
                        {nonVideoContent && (
                            <RenderHTML
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
                        )}

                        {externalVideoUrl ? (
                            <Pressable
                                onPress={() => Linking.openURL(externalVideoUrl)}
                                style={styles.openExternalButton}
                            >
                                <Text style={styles.openExternalButtonText}>Open Video in Browser</Text>
                            </Pressable>
                        ) : null}
                    </View> : CMEReducer?.cmeactivityResponse?.activityData?.[0]?.flipbook && !fullscreen ? (<View>
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
