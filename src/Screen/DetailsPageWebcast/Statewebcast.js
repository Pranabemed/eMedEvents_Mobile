/**
 * Statewebcast screen module. Renders a React Native screen or a screen-scoped support component. Exported members: GOOGLE_API_KEY, Statewebcast, handleSnapToItem, scrollToReviews, toggleExpansion, toggleTopic, toggleExpansionacc, refundExpand, conferShows, specailityChange, targetChange, reviewChange, onBackPress, handleTicketsCart, cartHand, calculatePrice, styles.
 */

import { Image, Text, View, Platform, ScrollView, Dimensions, useWindowDimensions, Alert, StyleSheet, BackHandler, Linking } from 'react-native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import PageHeader from '../../Components/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { cartcountWebcastRequest, saveTicketCartRequest, webcastDeatilsRequest } from '../../Redux/Reducers/WebcastReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import StatewebcastSpeciality from './StatewebcastSpeciality';
import StatewebcastOverview from './StatewebcastOverview';
import StatewebcastAcc from './StatewebcastAcc';
import StatewebcastFaculty from './StatewebcastFaculty';
import StatewebcastCheckout, { getCheckoutCtaFlags } from './StatewebcastCheckout';
import StatewebcastReviews from './StatewebcastReviews';
import StatewebcastRefund from './StatewebcastRefund';
import StatewebcastText from './StatewebcastText';
import StatewebcastAddTocart from './StatewebcastAddTocart';
import StatewebcastPrice from './StatewebcastPrice';
import Loader from '../../Utils/Helpers/Loader';
import StatewebcastShimmer from '../../Components/StatewebcastShimmer';
import { CommonActions, useFocusEffect, useIsFocused } from '@react-navigation/native';
import InpersonKeydates from './InpersonKeydates';
import Imagepath from '../../Themes/Imagepath';
import Fonts from '../../Themes/Fonts';
import MapScreen from './ConferenceVenue';
import CourseOutline from './CourseOutline';
import TopicCast from './TopicCast';
import CatlogDownload from './CatlogDownload';
import { AppContext } from '../GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isNonUsaAccount, readNonUsaFlowState } from '../../Utils/Helpers/nonUsaFlow';
import { ConfActRequest } from '../../Redux/Reducers/CMEReducer';

/**
 * Legacy API key constant preserved for module compatibility.
 */
const GOOGLE_API_KEY = 'AIzaSyBDnBivN-fdP6JxOcQFIyvhxIJSArru6Nk';
/**
 * Statewebcast component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const Statewebcast = props => {
    const {
        cartcount,
        setCartcount,
        setStatepush,
        setAddit,
        statepush,
        setGtprof
    } = useContext(AppContext);
    const { width } = useWindowDimensions();
    const contentWidth = useMemo(() => Math.max(width - normalize(60), 220), [width]);
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const lastCartDeletionRef = useRef(WebcastReducer?.cartdeleteWebcastResponse);
    const lastCartAdditionRef = useRef(WebcastReducer?.addtoCartWebcastResponse);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const browserFallbackInProgressRef = useRef(false);
    const browserFallbackCompletedRef = useRef(false);
    const [refID, setRefID] = useState(props?.route?.params?.webCastURL?.refID || null);
    const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
    const [val, setval] = useState(0);
    const [webcastdeatils, setWebcastdeatils] = useState(null);
    const [finalprice, setFinalprice] = useState(0);
    const [addtocartload, setAddtocartload] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    const [downlinkdt, setDownlinkdt] = useState(false);
    const [loadingdowndt, setLoadingdowndt] = useState(false);
    const [pdfUridt, setPdfUridt] = useState("");
    const downDt = useMemo(() => [
        { id: 1, name: "Physician (MD/DO)", Path: "https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-04-02/global_pediatric_images/State%20Wise%20CME%20Course%20Bundle%20For%20Physicians-4.pdf" },
        { id: 2, name: "Registered Nurse (RN)", Path: "https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-12-30/State%20Wise%20CME%20Course%20Bundle%20For%20RN-4.pdf" },
        { id: 3, name: "Nurse Practitioner (NP/APRN)", Path: "https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-12-30/State%20Wise%20CME%20Course%20Bundle%20For%20NP.pdf" }
    ], []);
    const validHandles = useMemo(() => new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]), []);
    const profFromDashboard =
        DashboardReducer?.mainprofileResponse?.professional_information?.profession != null &&
            DashboardReducer?.mainprofileResponse?.professional_information?.profession_type != null
            ? `${DashboardReducer?.mainprofileResponse?.professional_information?.profession} - ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type}`
            : null;
    const allProfTake = validHandles.has(profFromDashboard);

    const resolvedShareUrl = useMemo(() => {
        return (
            props?.route?.params?.webCastURL?.shareUrl ||
            props?.route?.params?.webCastURL?.detailpage_url ||
            WebcastReducer?.webcastDeatilsResponse?.canonical_link ||
            WebcastReducer?.webcastDeatilsResponse?.data?.canonical_link ||
            webcastdeatils?.canonical_link ||
            webcastdeatils?.detailpage_url ||
            webcastdeatils?.emed_url ||
            props?.route?.params?.webCastURL?.shareUrl ||
            props?.route?.params?.webCastURL?.detailpage_url ||
            props?.route?.params?.newCast ||
            props?.route?.params?.webCastURL?.webCastURL ||
            ""
        );
    }, [WebcastReducer?.webcastDeatilsResponse, webcastdeatils?.canonical_link, webcastdeatils?.detailpage_url, webcastdeatils?.emed_url, props?.route?.params?.webCastURL, props?.route?.params?.newCast]);
    const hasAuthToken = Boolean(String(AuthReducer?.token || AuthReducer?.loginResponse?.token || '').trim());
    const hideGuestCartIcon = Boolean(
        !hasAuthToken ||
        props?.route?.params?.webCastURL?.Realback === "guest" ||
        props?.route?.params?.webCastURL?.guestOrigin === "guest" ||
        props?.route?.params?.webCastURL?.fromGuestSpecialitySearch === true ||
        props?.route?.params?.webCastURL?.guestCmeFlow === true
    );
    const isGuestWebcastFlow = props?.route?.params?.webCastURL?.Realback === "guest";
    const [showStickyTitle, setShowStickyTitle] = useState(false);
    const handleMainScroll = useCallback((event) => {
        const offsetY = event?.nativeEvent?.contentOffset?.y ?? 0;
        const shouldStick = offsetY > 90;
        setShowStickyTitle((prev) => (prev === shouldStick ? prev : shouldStick));
    }, []);

    const normalizeUrlCandidate = useCallback((value) => {
        if (typeof value !== "string") return "";

        const trimmedValue = value.trim();
        if (!trimmedValue) return "";

        if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmedValue)) {
            return trimmedValue;
        }

        return `https://${trimmedValue}`;
    }, []);

    const isMeaningfulWebcastPayload = useCallback((payload) => {
        if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
            return false;
        }

        if (payload?.success === false) {
            return false;
        }

        return Boolean(
            payload?.conferenceId ||
            payload?.conferenceTypeText ||
            payload?.detailpage_url ||
            payload?.emed_url ||
            payload?.conference_url ||
            payload?.title ||
            payload?.course_title ||
            payload?.overView ||
            (Array.isArray(payload?.registrationTickets) && payload.registrationTickets.length > 0) ||
            (Array.isArray(payload?.topics) && payload.topics.length > 0) ||
            (Array.isArray(payload?.speakers) && payload.speakers.length > 0)
        );
    }, []);

    const getValidatedWebcastPayload = useCallback((responsePayload) => {
        const candidates = [responsePayload?.data, responsePayload];

        for (const candidate of candidates) {
            if (isMeaningfulWebcastPayload(candidate)) {
                return candidate;
            }
        }

        return null;
    }, [isMeaningfulWebcastPayload]);

    const resetToHome = useCallback(() => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "TabNav", params: { initialRoute: "Home" } }],
            })
        );
    }, [props.navigation]);

    const goBackToGuestUser = useCallback(() => {
        if (props.navigation.canGoBack?.()) {
            props.navigation.goBack();
            return;
        }

        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'GuestUser' }],
            })
        );
    }, [props.navigation]);

    const guestFallbackUrl = useMemo(() => {
        return normalizeUrlCandidate(
            props?.route?.params?.webCastURL?.detailpage_url ||
            props?.route?.params?.webCastURL?.shareUrl ||
            props?.route?.params?.webCastURL?.webCastURL ||
            props?.route?.params?.newCast ||
            webcastdeatils?.detailpage_url ||
            webcastdeatils?.emed_url ||
            ""
        );
    }, [normalizeUrlCandidate, props?.route?.params?.newCast, props?.route?.params?.webCastURL, webcastdeatils?.detailpage_url, webcastdeatils?.emed_url]);

    const openGuestFallbackInBrowser = useCallback(async () => {
        if (!isGuestWebcastFlow || !guestFallbackUrl) {
            setLoading(false);
            goBackToGuestUser();
            return;
        }

        if (browserFallbackInProgressRef.current || browserFallbackCompletedRef.current) {
            return;
        }

        browserFallbackInProgressRef.current = true;

        try {
            const supported = await Linking.canOpenURL(guestFallbackUrl);

            if (!supported) {
                throw new Error("Unsupported webcast URL");
            }

            if (Platform.OS === 'android') {
                const intentUrl = `intent://${guestFallbackUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
                try {
                    await Linking.openURL(intentUrl);
                } catch (e) {
                    await Linking.openURL(guestFallbackUrl);
                }
            } else {
                await Linking.openURL(guestFallbackUrl);
            }
        } catch (error) {
            console.log("Guest webcast fallback failed:", error);
            showErrorAlert("Unable to open conference link", error?.message || error);
        } finally {
            browserFallbackCompletedRef.current = true;
            browserFallbackInProgressRef.current = false;
            setLoading(false);
            goBackToGuestUser();
        }
    }, [goBackToGuestUser, guestFallbackUrl, isGuestWebcastFlow]);

    const isBoardCastNavigatingRef = useRef(false);
    const boardCast = useCallback(() => {
        if (isBoardCastNavigatingRef.current) return;
        isBoardCastNavigatingRef.current = true;
        setTimeout(() => {
            isBoardCastNavigatingRef.current = false;
        }, 1000);

        const navigationState = props.navigation.getState();
        const previousRoute = navigationState.routes[navigationState.index - 1];
        const isRecentlyViewed = previousRoute?.name === 'NonMain' && previousRoute?.params?.myact?.recnt;
        if ((previousRoute?.name === 'Globalresult' || previousRoute?.name === 'StateSpecification' || previousRoute?.name === 'CourseRelevant' || previousRoute?.name === 'StateCourse' || previousRoute?.name === 'SpecialityCourseSlide' || previousRoute?.name === 'BoardCourseSlide' || isRecentlyViewed) && props.navigation.canGoBack()) {
            props.navigation.goBack();
            return;
        }
        if (props?.route?.params?.webCastURL?.Realback === "guest") {
            goBackToGuestUser();
            return;
        }
        if (props?.route?.params?.webCastURL?.speaks === "speaker" || props?.route?.params?.webCastURL?.speaks === "organ") {
            if (props.navigation.canGoBack?.()) {
                props.navigation.goBack();
                return;
            }
        }
        if (props?.route?.params?.webCastURL?.takeUrl) {
            props.navigation.navigate("SpeakerProfile", { fullUrl: { textHo: props?.route?.params?.webCastURL?.textHo, speaks: props?.route?.params?.webCastURL?.speaks, hitDat: props?.route?.params?.webCastURL?.highText, fullUrl: props?.route?.params?.webCastURL?.takeUrl, creditData: props?.route?.params?.webCastURL?.creditData } })
        } else if (props?.route?.params?.webCastURL?.acrBack == "listing") {
            props.navigation.navigate("InterestCard", { invoiceTxt: { invoiceTxt: props?.route?.params?.webCastURL?.backDat } });
        } else if (props?.route?.params?.webCastURL?.Realback === "cont") {
            props.navigation.goBack();
        } else if (props?.route?.params?.webCastURL?.Realback === "mytasks" || previousRoute?.name === "Mytasks") {
            if (props.navigation.canGoBack?.()) {
                props.navigation.goBack();
                return;
            }
            resetToHome();
        } else if (allProfTake) {
            setGtprof(true);
            setAddit(statepush);
            setAddit(props?.route?.params?.webCastURL?.creditData);
            resetToHome();
        } else {
            setAddit(statepush);
            setAddit(props?.route?.params?.webCastURL?.creditData);
            resetToHome();
        }
    }, [allProfTake, goBackToGuestUser, props.navigation, props?.route?.params?.webCastURL, resetToHome, setAddit, setGtprof, statepush]);
        /**
 * Handles snap to item.
 * @param {number} index - Input value.
 * @returns {void}
 */
const handleSnapToItem = (index) => {
        setval(index);
    };
    const shouldRenderAddToCartAndDownload = useMemo(() => {
        return (

            webcastdeatils && webcastdeatils?.conference_active !== 0 &&
            webcastdeatils?.buttonType?.toLowerCase() !== "interest" &&
            webcastdeatils?.is_cart_applicable == 1 &&
            webcastdeatils?.isHavingActivity !== 1
        );
    }, [webcastdeatils]);

    const isBundleAddToCart = useMemo(() => {
        return webcastdeatils?.bundle_add_cart == "1";
    }, [webcastdeatils]);
    const hideTopAddToCart = useMemo(
        () => getCheckoutCtaFlags(webcastdeatils, finalprice).hasBottomCart,
        [webcastdeatils, finalprice],
    );
    const scrollViewRef = useRef(null);
    const [reviewsPosition, setReviewsPosition] = useState(0);
    /**
     * Scroll to reviews utility.
     * @returns {void}
     */
    const scrollToReviews = useCallback(() => {
        setExpandreview(true);
        scrollViewRef.current?.scrollTo({
            y: Math.max(reviewsPosition - normalize(12), 0),
            animated: true,
        });
    }, [reviewsPosition]);
    useEffect(() => {
        if (props?.route?.params?.webCastURL?.creditData?.creditID) {
            setStatepush(props?.route?.params?.webCastURL?.creditData?.creditID);
        }
    }, [props?.route?.params?.webCastURL?.creditData?.creditID]);
    const requestedConferenceUrl = props?.route?.params?.webCastURL?.webCastURL || props?.route?.params?.newCast || "";
    const lastFetchedConferenceUrlRef = useRef("");
    const hasLoadedOnceRef = useRef(false);
    const isSilentRefreshRef = useRef(false);
    const isWaitingForResponseRef = useRef(false);
    const openGuestFallbackRef = useRef(openGuestFallbackInBrowser);
    useEffect(() => {
        isWaitingForResponseRef.current = isWaitingForResponse;
    }, [isWaitingForResponse]);
    useEffect(() => {
        openGuestFallbackRef.current = openGuestFallbackInBrowser;
    }, [openGuestFallbackInBrowser]);

    useEffect(() => {
        if (!requestedConferenceUrl) return;
        if (lastFetchedConferenceUrlRef.current === requestedConferenceUrl && webcastdeatils) {
            return;
        }
        lastFetchedConferenceUrlRef.current = requestedConferenceUrl;
        isSilentRefreshRef.current = false;
        setLoading(true);
        setWebcastdeatils(null);
        let obj = {
            "conference_url": requestedConferenceUrl
        };
        // Also grab a persisted refID from AsyncStorage if not available in route (e.g. app was cold-started)
        if (!refID) {
            AsyncStorage.getItem('REFID').then(storedRefID => {
                if (storedRefID) setRefID(storedRefID);
            }).catch(() => { });
        }
        connectionrequest()
            .then(() => {
                isWaitingForResponseRef.current = true;
                setIsWaitingForResponse(true);
                dispatch(webcastDeatilsRequest(obj));
            })
            .catch((err) => {
                if (isGuestWebcastFlow) {
                    openGuestFallbackRef.current?.();
                    return;
                }
                setLoading(false);
                showErrorAlert("Please connect to internet", err)
            });
    }, [dispatch, isGuestWebcastFlow, requestedConferenceUrl]);
    useEffect(() => {
        if (requestedConferenceUrl) return;
        const cachedDetails = getValidatedWebcastPayload(WebcastReducer?.webcastDeatilsResponse);
        if (cachedDetails) {
            setWebcastdeatils(cachedDetails);
            hasLoadedOnceRef.current = true;
        }
        setLoading(false);
    }, [getValidatedWebcastPayload, requestedConferenceUrl, WebcastReducer?.webcastDeatilsResponse]);

    useEffect(() => {
        const addition = WebcastReducer?.addtoCartWebcastResponse;
        const hasNewAddition = lastCartAdditionRef.current !== addition;
        lastCartAdditionRef.current = addition;
        if (hasNewAddition && addition?.success === true) {
            setWebcastdeatils(prev => (
                prev && prev.already_in_cart !== 1 ? { ...prev, already_in_cart: 1 } : prev
            ));
        } else if (
            WebcastReducer?.status === 'WebCast/cartcountWebcastSuccess' &&
            Number(WebcastReducer?.cartcountWebcastResponse?.cartItemsCount ?? -1) === 0
        ) {
            setWebcastdeatils(prev => (
                prev && prev.already_in_cart === 1 ? { ...prev, already_in_cart: 0 } : prev
            ));
        }
    }, [
        WebcastReducer?.status,
        WebcastReducer?.addtoCartWebcastResponse,
        WebcastReducer?.cartcountWebcastResponse?.cartItemsCount,
    ]);

    useEffect(() => {
        const deletion = WebcastReducer?.cartdeleteWebcastResponse;
        if (lastCartDeletionRef.current === deletion) return;
        lastCartDeletionRef.current = deletion;
        if (
            deletion?.msg === "Item deleted in cart successfully." &&
            hasLoadedOnceRef.current && requestedConferenceUrl
        ) {
            // Update the mounted detail screen while the cart is still visible.
            isSilentRefreshRef.current = true;
            dispatch(webcastDeatilsRequest({ conference_url: requestedConferenceUrl }));
        }
    }, [WebcastReducer?.cartdeleteWebcastResponse, requestedConferenceUrl, dispatch]);

    const [nonUsaFlowState, setNonUsaFlowState] = useState(null);
    useEffect(() => {
        let mounted = true;
        readNonUsaFlowState().then(state => {
            if (mounted) {
                setNonUsaFlowState(state);
            }
        });
        return () => {
            mounted = false;
        };
    }, []);

    const userObj = DashboardReducer?.mainprofileResponse || AuthReducer?.loginResponse?.user || AuthReducer?.againloginsiginResponse?.user || AuthReducer?.verifymobileResponse?.user;
    const isNonUsaUser = nonUsaFlowState?.isNonUsa === true || isNonUsaAccount(userObj || {}, nonUsaFlowState);

    useEffect(() => {
        if (webcastdeatils?.conferenceId && isNonUsaUser) {
            let obj = {
                "conference_id": webcastdeatils.conferenceId,
                "action_type": "view",
                "status": 1
            };
            connectionrequest()
                .then(() => {
                    dispatch(ConfActRequest(obj));
                })
                .catch((err) => {
                    console.log("ConfActRequest error: ", err);
                });
        }
    }, [webcastdeatils?.conferenceId, isNonUsaUser, dispatch]);

    // useEffect(() => {
    //     if (webcastdeatils) {
    //         const checkoutSpan = webcastdeatils?.conferenceId;
    //         let obj = {
    //             "conference_id": checkoutSpan,
    //             "tickets": webcastdeatils?.registrationTickets?.map(ticket => ({
    //                 "id": ticket?.id,
    //                 "quantity": 1
    //             }))
    //         };
    //         connectionrequest()
    //             .then(() => {
    //                 dispatch(saveTicketRequest(obj));
    //             })
    //             .catch((err) => {
    //                 showErrorAlert("Please connect to internet", err)
    //             })
    //     }
    // }, [webcastdeatils])
    const htmlContents = webcastdeatils?.overView || "";
    const viewmore = webcastdeatils?.cme_accreditation || "";
    const viewmoreac = webcastdeatils?.refund_policy || "";
    const viewmorepolicy = webcastdeatils?.disclaimer || "";
    const conferenceText = webcastdeatils?.seo_content || null;
    const topiccast = webcastdeatils?.topics?.length > 0 ? webcastdeatils.topics : false;
    const allSpecailities = webcastdeatils?.specialities || null;
    const reviewpost = webcastdeatils?.userReviews || null;
    const ratingsall = useMemo(() => {
        const userReviews = webcastdeatils?.userReviews;
        if (!Array.isArray(userReviews) || userReviews.length === 0) {
            return { totalRatingsCount: 0, totalAverageRating: 0 };
        }
        const ratedReviews = userReviews.filter(
            review => review.averageRating !== null && review.averageRating !== "" && !isNaN(parseFloat(review.averageRating))
        );
        const totalRatingsCount = ratedReviews.length;
        const totalAverageRating = totalRatingsCount > 0
            ? ratedReviews.reduce((sum, review) => sum + parseFloat(review.averageRating), 0) / totalRatingsCount
            : 0;
        return { totalRatingsCount, totalAverageRating };
    }, [webcastdeatils?.userReviews]);
    const sharetrue = true;

    // Reset status on focus so webcast details refresh silently when returning from cart
    useFocusEffect(
        useCallback(() => {
            connectionrequest()
                .then(() => {
                    dispatch(cartcountWebcastRequest({}));
                    // Silent background refresh — don't blank screen (no setLoading/setWebcastdeatils null)
                    if (
                        hasLoadedOnceRef.current &&
                        requestedConferenceUrl &&
                        !isWaitingForResponseRef.current &&
                        !isSilentRefreshRef.current &&
                        !browserFallbackCompletedRef.current &&
                        !browserFallbackInProgressRef.current
                    ) {
                        isSilentRefreshRef.current = true;
                        dispatch(webcastDeatilsRequest({ "conference_url": requestedConferenceUrl }));
                    }
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err);
                });
        }, [requestedConferenceUrl, dispatch])
    );

    const [expanded, setExpanded] = useState(false);
    const [expandedtopic, setExpandedtopic] = useState(false);
    const [expandedacc, setExpandedacc] = useState(false);
    const [refunded, setRefunded] = useState(false);
    const [expandspecail, setExpandspecail] = useState(false);
    const [expandspecailtar, setExpandspecailtar] = useState(false);
    const [expandreview, setExpandreview] = useState(false);
    const [expandcon, setExpandcon] = useState(false);
    const [conn, setConn] = useState(null);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, []);
    const toggleExpansion = useCallback(() => {
        setExpanded(prev => !prev);
    }, []);
    const toggleTopic = useCallback(() => {
        setExpandedtopic(prev => !prev);
    }, []);
    const toggleExpansionacc = useCallback(() => {
        setExpandedacc(prev => !prev);
    }, []);
    const refundExpand = useCallback(() => {
        setRefunded(prev => !prev);
    }, []);
    const conferShows = useCallback(() => {
        setExpandcon(prev => !prev);
    }, []);
    const specailityChange = useCallback(() => {
        setExpandspecail(prev => !prev);
    }, []);
    const targetChange = useCallback(() => {
        setExpandspecailtar(prev => !prev);
    }, []);
    const reviewChange = useCallback(() => {
        setExpandreview(prev => !prev);
    }, []);
    const stripHtmlForPreview = useCallback((html = '') => {
        return String(html)
            .replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<table[\s\S]*?<\/table>/gi, ' ')
            .replace(/<\/?[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }, []);
    const overviewHasTable = useMemo(() => htmlContents.toLowerCase().includes('<table'), [htmlContents]);
    const overviewPreviewText = useMemo(() => {
        if (!htmlContents) return '';
        if (expanded) return stripHtmlForPreview(htmlContents);
        return stripHtmlForPreview(htmlContents).slice(0, 1000);
    }, [expanded, htmlContents, stripHtmlForPreview]);
    const source = useMemo(() => {
        if (!htmlContents) {
            return { html: '' };
        }
        if (expanded) {
            return { html: htmlContents };
        }

        const lowerHtml = htmlContents.toLowerCase();
        if (lowerHtml.includes('<table')) {
            const preview = stripHtmlForPreview(htmlContents);
            return { html: preview ? `${preview.slice(0, 1000)}...` : '' };
        }

        return { html: htmlContents.length > 1010 ? `${htmlContents.substring(0, 1010)}...` : htmlContents };
    }, [expanded, htmlContents, stripHtmlForPreview]);
    const acc_source = useMemo(() => ({
        html: expandedacc
            ? viewmore
            : (viewmore.length > 1300 ? `${viewmore.substring(0, 1300)}...` : viewmore),
    }), [expandedacc, viewmore]);
    const refundtext = useMemo(() => ({
        html: refunded
            ? viewmoreac
            : (viewmoreac.length > 1300 ? `${viewmoreac.substring(0, 1300)}...` : viewmoreac),
    }), [refunded, viewmoreac]);
    const disclaimerText = useMemo(() => ({
        html: viewmorepolicy,
    }), [viewmorepolicy]);
    const conferenceHtml = useMemo(() => ({
        html: expandcon
            ? (conferenceText || '')
            : (conferenceText ? (conferenceText.length > 300 ? `${conferenceText.substring(0, 300)}...` : conferenceText) : ''),
    }), [expandcon, conferenceText]);
    const urltrack = props?.route?.params?.webCastURL?.webCastURL || props?.route?.params?.newCast;
    // const isWebcastLoading = WebcastReducer?.status === 'WebCast/webcastDeatilsRequest' || 
    //                      WebcastReducer?.status === 'WebCast/saveTicketRequest';
    useFocusEffect(
        useCallback(() => {
                        /**
 * On back press utility.
 * @returns {boolean}
 */
const onBackPress = () => {
                boardCast();
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );

            return () => backHandler.remove();
        }, [boardCast])
    );
    const takeCount = useMemo(() => (
        WebcastReducer?.cartcountWebcastResponse?.cartItemsCount || 0
    ), [WebcastReducer?.cartcountWebcastResponse?.cartItemsCount]);
    useEffect(() => {
        setCartcount(takeCount);
    }, [takeCount]);
        /**
 * Handles tickets cart.
 * @returns {void}
 */
const handleTicketsCart = () => {
        if (webcastdeatils?.registrationTickets?.length > 0) {
            const checkoutSpan = webcastdeatils?.conferenceId;
            const obj = {
                "conference_id": checkoutSpan,
                "tickets": webcastdeatils?.registrationTickets?.map(ticket => ({
                    "id": ticket?.id,
                    "quantity": 1
                }))
            };

            if (refID) {
                obj["refer_params"] = refID;
            }

            connectionrequest()
                .then(() => {
                    dispatch(saveTicketCartRequest(obj));
                })
                .catch((err) => showErrorAlert("Please connect to internet", err));
        } else {
            props.navigation.navigate("AddToCartNo", { addtocart: { addtocart: "startcallapi", coupon: WebcastReducer?.saveTicketCartResponse || "", webcast: webcastdeatils, urlneedTake: urltrack } });
        }
    };

        /**
 * Cart hand utility.
 * @returns {void}
 */
const cartHand = () => {
        const latestCartCount = Number(
            WebcastReducer?.cartcountWebcastResponse?.cartItemsCount ?? cartcount ?? 0
        );
        const navPayload = {
            addtocart: {
                addtocart: "startcallapi",
                coupon: WebcastReducer?.saveTicketCartResponse || {},
                webcast: webcastdeatils || {},
                urlneedTake: urltrack,
                cart: "remove"
            }
        };

        if (latestCartCount > 0) {
            props.navigation.navigate("AddToCart", navPayload);
            return;
        }

        props.navigation.navigate("AddToCartNo", navPayload);
    }
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);

        /**
 * Calculate price utility.
 * @param {*} price - Input value.
 * @param {*} commission - Input value.
 * @returns {*}
 */
const calculatePrice = (price, commission) => {
        const amount = Number(price);
        const comm = Number(commission);
        if (!comm) {
            return Math.trunc(amount); // 34 (not 34.00)
        }
        const commissionAmount = (amount * comm) / 100;
        const finalPrice = amount - commissionAmount;
        return Number.isInteger(finalPrice)
            ? finalPrice
            : Number(finalPrice.toFixed(2));
    };
    const hasValidWebcastData = useMemo(() => {
        return Boolean(getValidatedWebcastPayload(webcastdeatils));
    }, [getValidatedWebcastPayload, webcastdeatils]);
    useEffect(() => {
        if (webcastdeatils?.registrationTickets?.length > 0) {
            const ticket = webcastdeatils.registrationTickets?.[0];
            const price = calculatePrice(
                ticket?.amount,
                ticket?.emed_commission
            );
            setFinalprice(price);
        }
    }, [webcastdeatils?.registrationTickets]);
    useEffect(() => {
        if (!isFocused && !(
            isSilentRefreshRef.current &&
            ['WebCast/webcastDeatilsSuccess', 'WebCast/webcastDeatilsFailure'].includes(WebcastReducer.status)
        )) return;

        switch (WebcastReducer.status) {
            case 'WebCast/webcastDeatilsRequest':
                if (isWaitingForResponse && !isSilentRefreshRef.current) {
                    setLoading(true);
                }
                break;
            case 'WebCast/webcastDeatilsSuccess': {
                if (!isWaitingForResponse && !isSilentRefreshRef.current) break;
                const wasSilentRefresh = isSilentRefreshRef.current;
                isSilentRefreshRef.current = false;
                console.log("webcastdeatilsfollowed>>>>", WebcastReducer?.webcastDeatilsResponse);
                const validatedWebcastPayload = getValidatedWebcastPayload(WebcastReducer?.webcastDeatilsResponse);
                if (validatedWebcastPayload) {
                    setWebcastdeatils(validatedWebcastPayload);
                    hasLoadedOnceRef.current = true;
                    setLoading(false);
                    isWaitingForResponseRef.current = false;
                    setIsWaitingForResponse(false);
                } else if (isGuestWebcastFlow && !wasSilentRefresh) {
                    openGuestFallbackInBrowser();
                    isWaitingForResponseRef.current = false;
                    setIsWaitingForResponse(false);
                } else {
                    setLoading(false);
                    isWaitingForResponseRef.current = false;
                    setIsWaitingForResponse(false);
                }
                break;
            }
            case 'WebCast/webcastDeatilsFailure':
                if (!isWaitingForResponse && !isSilentRefreshRef.current) break;
                if (isSilentRefreshRef.current) {
                    isSilentRefreshRef.current = false;
                    break;
                }
                isWaitingForResponseRef.current = false;
                setIsWaitingForResponse(false);
                if (isGuestWebcastFlow) {
                    openGuestFallbackInBrowser();
                    break;
                }
                setLoading(false);
                Alert.alert('eMedEvents', 'This confernece have no data ', [{ text: "Cancel",                 /**
 * On press utility.
 * @returns {void}
 */
onPress: () => { props.navigation.goBack() }, style: "cancel" }, { text: "Save",                 /**
 * On press utility.
 * @returns {void}
 */
onPress: () => { props.navigation.goBack() }, style: "cancel" }]);
                break;
            case 'WebCast/saveTicketCartSuccess':
                if (cartcount !== 0) {
                    props.navigation.navigate("AddToCart", { addtocart: { addtocart: "startcallapi", coupon: WebcastReducer?.saveTicketCartResponse, webcast: webcastdeatils, urlneedTake: urltrack, "cart": "remove" } });
                } else {
                    props.navigation.navigate("AddToCartNo", { addtocart: { addtocart: "startcallapi", coupon: WebcastReducer?.saveTicketCartResponse, webcast: webcastdeatils, urlneedTake: urltrack } });
                }
                break;
        }
    }, [isFocused, WebcastReducer.status, WebcastReducer?.webcastDeatilsResponse, WebcastReducer?.saveTicketCartResponse, cartcount, getValidatedWebcastPayload, isGuestWebcastFlow, openGuestFallbackInBrowser, webcastdeatils, urltrack, props.navigation, isWaitingForResponse]);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <PageHeader
                    title={showStickyTitle ? (webcastdeatils?.title || "") : ""}
                    showTitle={showStickyTitle}
                    onBackPress={boardCast}
                    sharetrue={sharetrue}
                    searchPress={resolvedShareUrl}
                    cartcount={cartcount}
                    cartHand={cartHand}
                    hideCart={hideGuestCartIcon}
                />
                <Loader
                    visible={addtocartload || loadingdowndt} />
                {/* Content wrapper */}
                <View style={{ flex: 1, backgroundColor: '#F4F7FC' }}>
                    {loading || !hasValidWebcastData ? (
                        <View style={{ flex: 1, backgroundColor: '#F4F7FC' }}>
                            <StatewebcastShimmer />
                        </View>
                    ) : (
                        <>
                            <ScrollView
                                ref={scrollViewRef}
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={false}
                                onScroll={handleMainScroll}
                                scrollEventThrottle={16}
                                contentContainerStyle={styles.scrollContent}
                            >
                                <View style={styles.heroBand}>
                                    <View style={styles.heroCard}>
                                        <StatewebcastPrice
                                            refID={refID}
                                            calculatePrice={finalprice || "0"}
                                            nav={props.navigation}
                                            webcastdeatils={webcastdeatils}
                                            ratingsall={ratingsall}
                                            scrollToReviews={scrollToReviews}
                                        />
                                        <StatewebcastAddTocart
                                            refID={refID}
                                            urlneed={urltrack}
                                            downlinkdt={downlinkdt}
                                            setDownlinkdt={setDownlinkdt}
                                            webcastdeatils={webcastdeatils}
                                            setAddtocartload={setAddtocartload}
                                            addtocartload={addtocartload}
                                            status={WebcastReducer?.status}
                                            WebcastReducer={WebcastReducer}
                                            bundle_conference_id={webcastdeatils?.conferenceId}
                                            conferenceIDs={webcastdeatils?.bundle_add_cart_conf_ids}
                                            dispatch={dispatch}
                                            shouldRenderAddToCartAndDownload={shouldRenderAddToCartAndDownload}
                                            nav={props.navigation}
                                            isBundleAddToCart={isBundleAddToCart}
                                            hideAddToCart={hideTopAddToCart}
                                        />
                                    </View>
                                </View>

                                <StatewebcastOverview
                                    width={contentWidth}
                                    source={source}
                                    previewText={overviewPreviewText}
                                    hasTable={overviewHasTable}
                                    toggleExpansion={toggleExpansion}
                                    expanded={expanded}
                                    navigation={props.navigation}
                                    webcastdeatils={webcastdeatils}
                                    creditData={props?.route?.params?.webCastURL?.creditData}
                                />

                                {(webcastdeatils?.conferenceTypeText === "In-Person Event" ||
                                    webcastdeatils?.conferenceTypeText === "Hybrid Event" ||
                                    webcastdeatils?.conferenceTypeText === "Live Webinar") &&
                                    webcastdeatils?.key_dates &&
                                    "registrationOpen" in webcastdeatils?.key_dates &&
                                    (
                                        webcastdeatils?.key_dates?.registrationOpen ||
                                        webcastdeatils?.key_dates?.registrationEnd ||
                                        webcastdeatils?.key_dates?.conferenceStartdate ||
                                        webcastdeatils?.key_dates?.conferenceEnddate
                                    ) ? (
                                    <View style={styles.sectionCard}>
                                        <View style={styles.sectionHeaderRow}>
                                            <View style={styles.sectionAccent} />
                                            <Text style={styles.sectionHeading}>{"Key Dates"}</Text>
                                        </View>
                                        <InpersonKeydates wholedata={webcastdeatils.key_dates} />
                                    </View>
                                ) : null}

                                {webcastdeatils?.conferenceTypeText !== "Webcast" && webcastdeatils?.confSchedule && webcastdeatils?.confSchedule?.length > 0 ? (
                                    <View style={styles.sectionCard}>
                                        <View style={styles.sectionHeaderRow}>
                                            <View style={styles.sectionAccent} />
                                            <Text style={styles.sectionHeading}>{"Course Outline"}</Text>
                                        </View>
                                        <CourseOutline wholedata={webcastdeatils?.confSchedule} />
                                    </View>
                                ) : null}

                                {webcastdeatils?.topics?.length > 0 ? (
                                    <TopicCast
                                        topics={webcastdeatils?.topics}
                                        topiccast={topiccast}
                                        expandedtopic={expandedtopic}
                                        toggleTopic={toggleTopic}
                                    />
                                ) : null}

                                {webcastdeatils?.cmeCreditsData?.length > 0 ? (
                                    <StatewebcastAcc
                                        width={contentWidth}
                                        acc_source={acc_source}
                                        expandedacc={expandedacc}
                                        webcastdeatils={webcastdeatils}
                                        toggleExpansionacc={toggleExpansionacc}
                                    />
                                ) : null}

                                {webcastdeatils?.speakers?.length > 0 ? (
                                    <StatewebcastFaculty
                                        datawhole={props?.route?.params?.webCastURL?.Realback}
                                        creditData={props?.route?.params?.webCastURL?.creditData}
                                        nav={props.navigation}
                                        webcastdeatils={webcastdeatils}
                                        windowWidth={windowWidth}
                                        windowHeight={windowHeight}
                                        handleSnapToItem={handleSnapToItem}
                                        val={val}
                                    />
                                ) : null}

                                <StatewebcastText
                                    allSpecailities={allSpecailities}
                                    expandspecailtar={expandspecailtar}
                                    targetChange={targetChange}
                                    webcastdeatils={webcastdeatils}
                                />

                                {allSpecailities?.length > 0 ? (
                                    <StatewebcastSpeciality
                                        allSpecailities={allSpecailities}
                                        expandspecail={expandspecail}
                                        specailityChange={specailityChange}
                                    />
                                ) : null}

                                {webcastdeatils?.conferenceTypeText !== "Webcast" &&
                                    webcastdeatils?.latitude &&
                                    webcastdeatils?.longitude &&
                                    (webcastdeatils?.venue || webcastdeatils?.address) ? (
                                    <View style={styles.sectionCard}>
                                        <View style={styles.sectionHeaderRow}>
                                            <View style={styles.sectionAccent} />
                                            <Text style={styles.sectionHeading}>{"Conference Venue"}</Text>
                                        </View>
                                        <View style={styles.venueCardInner}>
                                            <View style={styles.mapContainer}>
                                                <MapScreen navto={props.navigation} webcastdeatils={webcastdeatils} />
                                            </View>
                                            <View style={styles.venueDetailsRow}>
                                                <View style={styles.venuePinBadge}>
                                                    <Image
                                                        source={Imagepath.MapPin}
                                                        style={styles.venuePinIcon}
                                                    />
                                                </View>
                                                <View style={styles.venueTextCol}>
                                                    {webcastdeatils?.venue ? (
                                                        <Text numberOfLines={3} style={styles.venueTitle}>
                                                            {webcastdeatils?.venue}
                                                        </Text>
                                                    ) : null}
                                                    {webcastdeatils?.address ? (
                                                        <Text numberOfLines={2} style={styles.venueAddress}>
                                                            {webcastdeatils?.address}
                                                        </Text>
                                                    ) : null}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                ) : null}

                                <StatewebcastRefund
                                    conferenceText={conferenceText}
                                    conferenceHtml={conferenceHtml}
                                    expandcon={expandcon}
                                    conferShows={conferShows}
                                    width={contentWidth}
                                    webcastdeatils={webcastdeatils}
                                    refundtext={refundtext}
                                    disclaimerText={disclaimerText}
                                    refunded={refunded}
                                    refundExpand={refundExpand}
                                />

                                {webcastdeatils?.userReviews?.length > 0 ? (
                                    <View
                                        onLayout={(event) => {
                                            setReviewsPosition(event.nativeEvent.layout.y);
                                        }}
                                    >
                                        <StatewebcastReviews
                                            webcastdeatils={webcastdeatils}
                                            ratingsall={ratingsall}
                                            reviewpost={reviewpost}
                                            expandreview={expandreview}
                                            reviewChange={reviewChange}
                                        />
                                    </View>
                                ) : null}
                            </ScrollView>
                            <StatewebcastCheckout
                                refID={refID}
                                takePrice={finalprice}
                                urlneed={urltrack}
                                creditData={props?.route?.params?.webCastURL?.creditData}
                                isBundleAddToCart={isBundleAddToCart}
                                setAddtocartload={setAddtocartload}
                                conferenceIDs={webcastdeatils?.bundle_add_cart_conf_ids}
                                bundle_conference_id={webcastdeatils?.conferenceId}
                                navigation={props.navigation}
                                webcastdeatils={webcastdeatils}
                                guestOrigin={props?.route?.params?.webCastURL?.Realback}
                            />
                            <CatlogDownload
                                setDownlink={setDownlinkdt}
                                downlink={downlinkdt}
                                downData={downDt}
                                setLoadingdown={setLoadingdowndt}
                                loadingdown={loadingdowndt}
                                pdfUri={pdfUridt}
                                setPdfUri={setPdfUridt}
                            />
                        </>
                    )}
                </View>
                {conn === false && <IntOff />}
            </SafeAreaView>
        </>
    );
};

/**
 * Statewebcast default export.
 *
 * @returns {*}
 */
export default Statewebcast;

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: normalize(24),
        backgroundColor: '#F4F7FC',
        flexGrow: 1,
    },
    heroBand: {
        backgroundColor: Colorpath.Pagebg,
        paddingHorizontal: normalize(12),
        paddingTop: normalize(6),
        paddingBottom: normalize(14),
        borderBottomLeftRadius: normalize(20),
        borderBottomRightRadius: normalize(20),
    },
    heroCard: {
        backgroundColor: Colorpath.white,
        borderRadius: normalize(16),
        borderWidth: 1,
        borderColor: '#DCE7F7',
        paddingHorizontal: normalize(14),
        paddingTop: normalize(14),
        paddingBottom: normalize(12),
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionCard: {
        backgroundColor: Colorpath.white,
        borderRadius: normalize(14),
        borderWidth: 1,
        borderColor: '#E5ECF6',
        marginHorizontal: normalize(12),
        marginTop: normalize(12),
        padding: normalize(14),
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(10),
    },
    sectionAccent: {
        width: normalize(3.5),
        height: normalize(16),
        borderRadius: normalize(2),
        backgroundColor: Colorpath.ButtonColr,
        marginRight: normalize(8),
    },
    sectionHeading: {
        fontFamily: Fonts.InterBold,
        fontWeight: '700',
        fontSize: 16,
        color: '#0F172A',
    },
    venueCardInner: {
        borderRadius: normalize(12),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFD',
        overflow: 'hidden',
    },
    mapContainer: {
        height: normalize(155),
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#E2E8F0',
    },
    venueDetailsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(12),
    },
    venuePinBadge: {
        width: normalize(32),
        height: normalize(32),
        borderRadius: normalize(16),
        backgroundColor: '#EAF1FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(10),
    },
    venuePinIcon: {
        height: normalize(16),
        width: normalize(16),
        resizeMode: 'contain',
        tintColor: Colorpath.ButtonColr,
    },
    venueTextCol: {
        flex: 1,
        gap: normalize(3),
    },
    venueTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        lineHeight: 20,
        color: '#0F172A',
    },
    venueAddress: {
        fontFamily: Fonts.InterRegular,
        fontSize: 13,
        lineHeight: 18,
        color: '#475569',
    },
});
