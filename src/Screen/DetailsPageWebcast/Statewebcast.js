import { Image, Text, View, Platform, TouchableOpacity, ScrollView, Dimensions, useWindowDimensions, Alert, StyleSheet, TextInput, BackHandler } from 'react-native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import PageHeader from '../../Components/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { cartcountWebcastRequest, saveTicketCartRequest, saveTicketRequest, webcastDeatilsRequest, refIDRequest } from '../../Redux/Reducers/WebcastReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import StatewebcastSpeciality from './StatewebcastSpeciality';
import StatewebcastOverview from './StatewebcastOverview';
import StatewebcastPratcing from './StatewebcastPratcing';
import StatewebcastAcc from './StatewebcastAcc';
import StatewebcastFaculty from './StatewebcastFaculty';
import StatewebcastCheckout from './StatewebcastCheckout';
import StatewebcastReviews from './StatewebcastReviews';
import StatewebcastRefund from './StatewebcastRefund';
import StatewebcastText from './StatewebcastText';
import StatewebcastAddTocart from './StatewebcastAddTocart';
import StatewebcastPrice from './StatewebcastPrice';
import Loader from '../../Utils/Helpers/Loader';
import StatewebcastShimmer from '../../Components/StatewebcastShimmer';
import { CommonActions, useFocusEffect, useIsFocused } from '@react-navigation/native';
import InpersonKeydates from './InpersonKeydates';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Imagepath from '../../Themes/Imagepath';
import Fonts from '../../Themes/Fonts';
import IconSh from 'react-native-vector-icons/Feather';
import MapScreen from './ConferenceVenue';
import CourseOutline from './CourseOutline';
import TopicCast from './TopicCast';
import CatlogDownload from './CatlogDownload';
import { AppContext } from '../GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'
const GOOGLE_API_KEY = 'AIzaSyBDnBivN-fdP6JxOcQFIyvhxIJSArru6Nk';
const Statewebcast = props => {
    const {
        cartcount,
        setCartcount,
        setStatepush,
        isConnected,
        fulldashbaord,
        setAddit,
        statepush,
        setGtprof
    } = useContext(AppContext);
    const { width } = useWindowDimensions();
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const isFocused = useIsFocused();
    console.log(statepush, props?.route?.params?.webCastURL, "fullcast=================", props?.route?.params, WebcastReducer?.cartcountWebcastResponse?.cartItemsCount);
    const dispatch = useDispatch();
    const [refID, setRefID] = useState(props?.route?.params?.webCastURL?.refID || null);
    const [viewmore, setViewmore] = useState("");
    const [viewmoreac, setViewmoreac] = useState("");
    const [viewmorepolicy, setViewmorepolicy] = useState("");
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [val, setval] = useState(0);
    const [webcastdeatils, setWebcastdeatils] = useState(null);
    const [htmlContents, setHtmlContents] = useState("");
    const [topiccast, setTopiccast] = useState(false);
    const [sharetrue, setSharetrue] = useState(true);
    const [finalprice, setFinalprice] = useState(0);
    const [ratingsall, setRatingsall] = useState({
        totalRatingsCount: 0,
        totalAverageRating: 0
    });
    const [allSpecailities, setAllSpecailities] = useState(null);
    const [reviewpost, setReviewpost] = useState(null);
    const [conferenceText, setConferenceText] = useState(null);
    const [addtocartload, setAddtocartload] = useState(false);
    const [loading, setLoading] = useState(true);
    const [downlinkdt, setDownlinkdt] = useState(false);
    const [loadingdowndt, setLoadingdowndt] = useState(false);
    const [pdfUridt, setPdfUridt] = useState("");
    const downDt = [{ id: 1, name: "Physician (MD/DO)", Path: "https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-04-02/global_pediatric_images/State%20Wise%20CME%20Course%20Bundle%20For%20Physicians-4.pdf" }, { id: 2, name: "Registered Nurse (RN)", Path: "https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-12-30/State%20Wise%20CME%20Course%20Bundle%20For%20RN-4.pdf" }, { id: 3, name: "Nurse Practitioner (NP/APRN)", Path: "https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-12-30/State%20Wise%20CME%20Course%20Bundle%20For%20NP.pdf" }]
    const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
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
            webcastdeatils?.detailpage_url ||
            webcastdeatils?.emed_url ||
            props?.route?.params?.newCast ||
            props?.route?.params?.webCastURL?.webCastURL ||
            ""
        );
    }, [webcastdeatils?.detailpage_url, webcastdeatils?.emed_url, props?.route?.params?.webCastURL, props?.route?.params?.newCast]);
    const hideGuestCartIcon = props?.route?.params?.webCastURL?.Realback === "guest";

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

        props.navigation.navigate('GuestUser');
    }, [props.navigation]);

    const boardCast = useCallback(() => {
        if (props?.route?.params?.webCastURL?.Realback === "guest") {
            goBackToGuestUser();
            return;
        }
        if (props?.route?.params?.webCastURL?.takeUrl) {
            props.navigation.navigate("SpeakerProfile", { fullUrl: { textHo: props?.route?.params?.webCastURL?.textHo, speaks: props?.route?.params?.webCastURL?.speaks, hitDat: props?.route?.params?.webCastURL?.highText, fullUrl: props?.route?.params?.webCastURL?.takeUrl, creditData: props?.route?.params?.webCastURL?.creditData } })
        } else if (props?.route?.params?.webCastURL?.acrBack == "listing") {
            props.navigation.navigate("InterestCard", { invoiceTxt: { invoiceTxt: props?.route?.params?.webCastURL?.backDat } });
        } else if (props?.route?.params?.webCastURL?.Realback === "cont") {
            props.navigation.goBack();
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
    const handleSnapToItem = (index) => {
        setval(index);
    };
    const shouldRenderAddToCartAndDownload = useMemo(() => {
        return (

            webcastdeatils && webcastdeatils?.conference_active !== 0 &&
            webcastdeatils?.buttonType?.toLowerCase() !== "interest" &&
            webcastdeatils?.is_cart_applicable == 1 &&
            webcastdeatils?.already_in_cart === 0 &&
            webcastdeatils?.isHavingActivity !== 1
        );
    }, [webcastdeatils]);

    const isBundleAddToCart = useMemo(() => {
        return webcastdeatils?.bundle_add_cart == "1";
    }, [webcastdeatils]);
    const scrollViewRef = useRef(null);
    const [reviewsPosition, setReviewsPosition] = useState(0);
    console.log(reviewsPosition, "reviewsPosition=========")
    const scrollToReviews = () => {
        setExpandreview(true);
        scrollViewRef.current?.scrollTo({
            y: 2000,
            animated: true,
        });
    };
    useEffect(() => {
        if (props?.route?.params?.webCastURL?.creditData?.creditID) {
            setStatepush(props?.route?.params?.webCastURL?.creditData?.creditID);
        }
    }, [props?.route?.params?.webCastURL?.creditData?.creditID])
    console.log("webcastuser=====", webcastdeatils?.conferenceTypeText == "Webcast", viewmore);
    const requestedConferenceUrl = props?.route?.params?.webCastURL?.webCastURL || props?.route?.params?.newCast || "";
    useEffect(() => {
        if (!requestedConferenceUrl) return;
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
                dispatch(webcastDeatilsRequest(obj));
            })
            .catch((err) => {
                setLoading(false);
                showErrorAlert("Please connect to internet", err)
            });
    }, [dispatch, requestedConferenceUrl]);
    useEffect(() => {
        if (requestedConferenceUrl) return;
        const cachedDetails = WebcastReducer?.webcastDeatilsResponse;
        if (cachedDetails && Object.keys(cachedDetails).length > 0) {
            setWebcastdeatils(cachedDetails);
        }
        setLoading(false);
    }, [requestedConferenceUrl, WebcastReducer?.webcastDeatilsResponse]);

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
    useEffect(() => {
        if (webcastdeatils?.overView) {
            setHtmlContents(webcastdeatils?.overView);
        }
    }, [webcastdeatils?.overView])
    useEffect(() => {
        if (webcastdeatils?.cme_accreditation) {
            setViewmore(webcastdeatils?.cme_accreditation);
        }
    }, [webcastdeatils?.cme_accreditation])
    useEffect(() => {
        if (webcastdeatils?.refund_policy) {
            setViewmoreac(webcastdeatils?.refund_policy);
        }
    }, [webcastdeatils?.refund_policy])
    useEffect(() => {
        if (webcastdeatils?.seo_content) {
            setConferenceText(webcastdeatils?.seo_content);
        }
    }, [webcastdeatils?.seo_content])
    useEffect(() => {
        if (webcastdeatils?.disclaimer) {
            setViewmorepolicy(webcastdeatils?.disclaimer);
        }
    }, [webcastdeatils?.disclaimer])
    useEffect(() => {
        if (webcastdeatils?.topics?.length > 0) {
            setTopiccast(webcastdeatils?.topics);
        }
    }, [webcastdeatils?.topics])
    useEffect(() => {
        if (webcastdeatils?.userReviews) {
            const userReviews = webcastdeatils?.userReviews
            const totalRatingsCount = userReviews?.filter(review => review.averageRating !== null && review.averageRating !== "").length;
            const totalAverageRating = userReviews?.reduce((sum, review) => {
                return sum + parseFloat(review.averageRating);
            }, 0) / totalRatingsCount;
            setRatingsall({
                totalRatingsCount,
                totalAverageRating
            });
        }
    }, [webcastdeatils?.userReviews])
    useEffect(() => {
        if (webcastdeatils?.specialities) {
            setAllSpecailities(webcastdeatils?.specialities);
        }
    }, [webcastdeatils?.specialities])
    useEffect(() => {
        if (webcastdeatils?.userReviews) {
            setReviewpost(webcastdeatils?.userReviews);
        }
    }, [webcastdeatils?.userReviews])
    useEffect(() => {
        let obj = {};
        connectionrequest()
            .then(() => {
                dispatch(cartcountWebcastRequest(obj))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })

    }, [props?.route?.params])

    // Reset status on focus so webcast details reload correctly when returning from cart
    useFocusEffect(
        useCallback(() => {
            connectionrequest()
                .then(() => {
                    dispatch(cartcountWebcastRequest({}));
                    // Silent background refresh — don't blank screen (no setLoading/setWebcastdeatils null)
                    if (requestedConferenceUrl) {
                        dispatch(webcastDeatilsRequest({ "conference_url": requestedConferenceUrl }));
                    }
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err);
                });
        }, [requestedConferenceUrl, dispatch])
    );

    console.log(webcastdeatils, "webcastdetails============");
    const [expanded, setExpanded] = useState(false);
    const [expandedtopic, setExpandedtopic] = useState(false);
    const [expandedacc, setExpandedacc] = useState(false);
    const [refunded, setRefunded] = useState(false);
    const [expandspecail, setExpandspecail] = useState(false);
    const [expandspecailtar, setExpandspecailtar] = useState(false);
    const [expandreview, setExpandreview] = useState(false);
    const [expandcon, setExpandcon] = useState(false);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const toggleExpansion = () => {
        if (!expanded) {
            setHtmlContents(prevContent => prevContent);
        }
        setExpanded(!expanded);
    };
    const toggleTopic = () => {
        setExpandedtopic(!expandedtopic);
    };
    const toggleExpansionacc = () => {
        if (!expandedacc) {
            setViewmore(prevContent => prevContent);
        }
        setExpandedacc(!expandedacc);
    };
    const refundExpand = () => {
        if (!refunded) {
            setViewmoreac(prevContent => prevContent);
        }
        setRefunded(!refunded);
    };
    const conferShows = () => {
        if (!expandcon) {
            setConferenceText(prevContent => prevContent);
        }
        setExpandcon(!expandcon);
    };
    const specailityChange = () => {
        setExpandspecail(!expandspecail);
    };
    const targetChange = () => {
        setExpandspecailtar(!expandspecailtar);
    };
    const reviewChange = () => {
        setExpandreview(!expandreview)
    }
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

        return { html: htmlContents.substring(0, 1010) + '...' };
    }, [expanded, htmlContents, stripHtmlForPreview]);
    const acc_source = {
        html: expandedacc ? viewmore : viewmore.substring(0, 1300) + '...',
    };
    const refundtext = {
        html: refunded ? viewmoreac : viewmoreac.substring(0, 1300) + '...',
    };
    const disclaimerText = {
        html: viewmorepolicy
    };
    const conferenceHtml = {
        html: expandcon
            ? conferenceText
            : (conferenceText ? conferenceText.substring(0, 300) + '...' : ''),
    };
    const urltrack = props?.route?.params?.webCastURL?.webCastURL || props?.route?.params?.newCast;
    // const isWebcastLoading = WebcastReducer?.status === 'WebCast/webcastDeatilsRequest' || 
    //                      WebcastReducer?.status === 'WebCast/saveTicketRequest';
    useFocusEffect(
        useCallback(() => {
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
        return Boolean(webcastdeatils && typeof webcastdeatils === "object" && Object.keys(webcastdeatils).length > 0);
    }, [webcastdeatils]);
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
        if (!isFocused) return;

        switch (WebcastReducer.status) {
            case 'WebCast/webcastDeatilsRequest':
                setLoading(true);
                break;
            case 'WebCast/webcastDeatilsSuccess':
                console.log("webcastdeatilsfollowed>>>>", WebcastReducer?.webcastDeatilsResponse);
                setLoading(false);
                if (WebcastReducer?.webcastDeatilsResponse && Object.keys(WebcastReducer?.webcastDeatilsResponse).length > 0) {
                    setWebcastdeatils(WebcastReducer?.webcastDeatilsResponse);
                }
                break;
            case 'WebCast/webcastDeatilsFailure':
                setLoading(false);
                Alert.alert('eMedEvents', 'This confernece have no data ', [{ text: "Cancel", onPress: () => { props.navigation.goBack() }, style: "cancel" }, { text: "Save", onPress: () => { props.navigation.goBack() }, style: "cancel" }]);
                break;
            case 'WebCast/saveTicketCartSuccess':
                if (cartcount !== 0) {
                    props.navigation.navigate("AddToCart", { addtocart: { addtocart: "startcallapi", coupon: WebcastReducer?.saveTicketCartResponse, webcast: webcastdeatils, urlneedTake: urltrack, "cart": "remove" } });
                } else {
                    props.navigation.navigate("AddToCartNo", { addtocart: { addtocart: "startcallapi", coupon: WebcastReducer?.saveTicketCartResponse, webcast: webcastdeatils, urlneedTake: urltrack } });
                }
                break;
        }
    }, [isFocused, WebcastReducer.status, WebcastReducer?.webcastDeatilsResponse, WebcastReducer?.saveTicketCartResponse, cartcount, webcastdeatils, urltrack, props.navigation]);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn == false ? <IntOff /> : <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? (
                    <PageHeader title="" onBackPress={boardCast} sharetrue={sharetrue} searchPress={resolvedShareUrl} cartcount={cartcount} cartHand={cartHand} hideCart={hideGuestCartIcon} />
                ) : (
                    <View>
                        <PageHeader title="" onBackPress={boardCast} sharetrue={sharetrue} searchPress={resolvedShareUrl} cartcount={cartcount} cartHand={cartHand} hideCart={hideGuestCartIcon} />
                    </View>
                )}
                <Loader
                    visible={addtocartload || loadingdowndt} />
                {/* Content wrapper - shimmer overlays absolutely while loading */}
                <View style={{ flex: 1 }}>
                    {loading || !hasValidWebcastData ? (
                        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                            <StatewebcastShimmer />
                        </View>
                    ) : (
                        <>
                            <ScrollView ref={scrollViewRef} contentContainerStyle={{ paddingBottom: normalize(100), backgroundColor: Colorpath.white }}>
                                <View style={{ backgroundColor: Colorpath.Pagebg, padding: 10 }}>
                                    <StatewebcastPrice refID={refID} calculatePrice={finalprice || "0"} nav={props.navigation} webcastdeatils={webcastdeatils} ratingsall={ratingsall} scrollToReviews={scrollToReviews} />
                                    <StatewebcastAddTocart refID={refID} urlneed={urltrack} downlinkdt={downlinkdt} setDownlinkdt={setDownlinkdt} webcastdeatils={webcastdeatils} setAddtocartload={setAddtocartload} addtocartload={addtocartload} status={WebcastReducer?.status} WebcastReducer={WebcastReducer} bundle_conference_id={webcastdeatils?.conferenceId} conferenceIDs={webcastdeatils?.bundle_add_cart_conf_ids} dispatch={dispatch} shouldRenderAddToCartAndDownload={shouldRenderAddToCartAndDownload} nav={props.navigation} isBundleAddToCart={isBundleAddToCart} />
                                </View>
            <StatewebcastOverview
                width={width}
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
                                    <>
                                        <View
                                            style={{
                                                paddingHorizontal: normalize(15),
                                                paddingVertical: normalize(0),
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterBold,
                                                    fontWeight: "bold",
                                                    fontSize: 18,
                                                    color: "#000000",
                                                }}
                                            >
                                                {"Key Dates"}
                                            </Text>
                                        </View>
                                        <InpersonKeydates wholedata={webcastdeatils.key_dates} />
                                    </>
                                ) : null}

                                {webcastdeatils?.conferenceTypeText !== "Webcast" && webcastdeatils?.confSchedule && webcastdeatils?.confSchedule?.length > 0 ? (
                                    <>
                                        <View style={{ paddingVertical: normalize(15), paddingHorizontal: normalize(7) }}>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterBold,
                                                    fontWeight: "bold",
                                                    fontSize: 18,
                                                    color: '#000000',
                                                }}>
                                                {"Course Outline"}
                                            </Text>
                                        </View>
                                        <CourseOutline wholedata={webcastdeatils?.confSchedule} />
                                    </>
                                ) : null}
                                {/* due to bundle remove form apk *Tushar sir changes {webcastdeatils?.is_state_bundle == 1 &&
                        webcastdeatils?.organizerName == "eMedEd, Inc." ? (<View style={{ paddingVertical: normalize(10) }}>
                            <StatewebcastPratcing navigate={props.navigation} />
                        </View>) : null} */}
                                {webcastdeatils?.topics?.length > 0 && <TopicCast topics={webcastdeatils?.topics} topiccast={topiccast} expandedtopic={expandedtopic} toggleTopic={toggleTopic} />}
                                {webcastdeatils?.cmeCreditsData?.length > 0 ? <StatewebcastAcc width={width} acc_source={acc_source} expandedacc={expandedacc} webcastdeatils={webcastdeatils} toggleExpansionacc={toggleExpansionacc} /> : null}
                                {webcastdeatils?.speakers?.length > 0 ? <View style={{ paddingVertical: webcastdeatils?.speakers?.length > 0 ? normalize(15) : 0, backgroundColor: "" }}>
                                    <StatewebcastFaculty datawhole={props?.route?.params?.webCastURL?.Realback} creditData={props?.route?.params?.webCastURL?.creditData} nav={props.navigation} webcastdeatils={webcastdeatils} windowWidth={windowWidth} windowHeight={windowHeight} handleSnapToItem={handleSnapToItem} val={val} />
                                </View> : null}
                                <StatewebcastText allSpecailities={allSpecailities} expandspecailtar={expandspecailtar} targetChange={targetChange} webcastdeatils={webcastdeatils} />
                                {allSpecailities?.length > 0 ? <View style={{ paddingVertical: normalize(5) }}>
                                    <StatewebcastSpeciality allSpecailities={allSpecailities} expandspecail={expandspecail} specailityChange={specailityChange} />
                                </View> : null}
                                <View>
                                    {webcastdeatils?.conferenceTypeText !== "Webcast" && webcastdeatils?.latitude && webcastdeatils?.longitude && <>
                                        <View
                                            style={{
                                                paddingHorizontal: normalize(15),
                                                paddingVertical: normalize(10),
                                            }}>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterBold,
                                                    fontWeight: "bold",
                                                    fontSize: 18,
                                                    color: '#000000',
                                                }}>
                                                {"Conference Venue"}
                                            </Text>
                                        </View>
                                        {webcastdeatils?.venue || webcastdeatils?.address ? <View style={{ margin: 5 }}>
                                            <View style={{ justifyContent: "center", alignContent: "center", borderWidth: 0.5, borderColor: "#666" }}>
                                                <View style={{ justifyContent: "center", alignSelf: "center", height: normalize(150), width: normalize(300), borderRadius: 50, borderWidth: 0.5, borderColor: "#000000" }}>
                                                    <MapScreen navto={props.navigation} webcastdeatils={webcastdeatils} />
                                                </View>
                                                <View style={{ justifyContent: "center", alignContent: "center", paddingHorizontal: normalize(15), paddingVertical: normalize(10) }}>
                                                    <View style={{ flexDirection: 'row', gap: normalize(2) }}>
                                                        <Image
                                                            source={Imagepath.MapPin}
                                                            style={{ height: normalize(20), width: normalize(20), resizeMode: 'contain', top: 3, tintColor: "#666" }}
                                                        />
                                                        <View style={{ flexDirection: 'column', gap: normalize(5) }}>
                                                            {webcastdeatils?.venue && <Text numberOfLines={3} style={{ fontFamily: Fonts.InterMedium, fontSize: 18, color: "#333", width: normalize(280) }}>
                                                                {webcastdeatils?.venue}
                                                            </Text>}
                                                            {webcastdeatils?.address && <Text numberOfLines={1} style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#666" }}>
                                                                {webcastdeatils?.address}
                                                            </Text>}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View> : null}
                                    </>}
                                </View>
                                <View>
                                    <StatewebcastRefund conferenceText={conferenceText} conferenceHtml={conferenceHtml} expandcon={expandcon} conferShows={conferShows} width={width} webcastdeatils={webcastdeatils} refundtext={refundtext} disclaimerText={disclaimerText} refunded={refunded} refundExpand={refundExpand} />
                                </View>
                                {webcastdeatils?.userReviews?.length > 0 && <View style={webcastdeatils?.seo_content || webcastdeatils?.refund_policy || webcastdeatils?.disclaimer ? { paddingVertical: !expandreview ? normalize(10) : 0 } : {}}>
                                    <StatewebcastReviews setReviewsPosition={setReviewsPosition} webcastdeatils={webcastdeatils} ratingsall={ratingsall} reviewpost={reviewpost} expandreview={expandreview} reviewChange={reviewChange} />
                                </View>}
                            </ScrollView>
                            <StatewebcastCheckout refID={refID} takePrice={finalprice} urlneed={urltrack} creditData={props?.route?.params?.webCastURL?.creditData} isBundleAddToCart={isBundleAddToCart} setAddtocartload={setAddtocartload} conferenceIDs={webcastdeatils?.bundle_add_cart_conf_ids} bundle_conference_id={webcastdeatils?.conferenceId} navigation={props.navigation} webcastdeatils={webcastdeatils} guestOrigin={props?.route?.params?.webCastURL?.Realback} />
                            <CatlogDownload
                                setDownlink={setDownlinkdt}
                                downlink={downlinkdt}
                                downData={downDt}
                                setLoadingdown={setLoadingdowndt}
                                loadingdown={loadingdowndt}
                                pdfUri={pdfUridt}
                                setPdfUri={setPdfUridt} />
                        </>
                    )}
                </View>
            </SafeAreaView>}
        </>
    );
};

export default Statewebcast;

const styles = StyleSheet.create({
    textInputContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderColor: "#000000"
    },
    textInput: {
        height: normalize(30),
        color: '#000000',
        fontSize: 16,
        fontFamily: Fonts.InterSemiBold
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        // backgroundColor:"yellow",
        paddingVertical: normalize(10), // Increased padding for better touch area
        paddingHorizontal: normalize(10),
    },
    icon: {
        width: normalize(30),
        height: normalize(30),
        marginRight: normalize(5),
        //   backgroundColor:Colorpath.Pagebg
    },
    placeName: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 16,
        color: Colorpath.ButtonColr
    },
    address: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: "#6A84DB"
    },
});
