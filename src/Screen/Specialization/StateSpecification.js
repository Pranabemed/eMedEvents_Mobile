import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, Platform, StyleSheet, Alert, BackHandler } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
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
const StateSpecification = (props) => {
    const { isConnected } = useContext(AppContext);
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
    const StateHeader = () => {
        props.navigation.goBack();
    }
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
        const getStatusText = (courses) => {
            return courses.every(course => course.completed_percentage == 100) ? "Suggestedtext" : "nottrue";
        };
        if (props?.route?.params?.fullData?.fullData?.registered_cources?.length > 0) {
            const makeitCorr = getStatusText(props?.route?.params?.fullData?.fullData?.registered_cources);
            setTextget(makeitCorr);
            console.log("makeitcorr=======", makeitCorr)
        }

    }, [props?.route?.params?.fullData])
    const handleLinkst = (link) => {
        if (link) {
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
    const courserenderData = ({ item, index }) => {
        console.log(item, "courserenderData--------")
        const getStatePrice = (swipe, down) => {
            let price = parseFloat(down?.replace(/,/g, ""));
            return Math.round(price / (1 - swipe));
        };
        let statePercentage = +item?.emed_commission;
        let statePrice = getStatePrice(statePercentage / 100, item?.display_price);
        return (
            <View>
                <View style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(10) }}>
                    <View
                        style={{
                            flexDirection: "column",
                            width: normalize(290),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            alignItems: "flex-start",
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                            <Text numberOfLines={2}
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 16,
                                    color: "#000000",
                                    fontWeight: "bold",
                                    flex: 1,
                                    flexWrap: 'wrap',
                                }}
                            >
                                {item?.title}
                            </Text>
                            {/* <TouchableOpacity>
                                <IconDot name="dots-three-vertical" size={25} color={"#848484"} />
                            </TouchableOpacity> */}
                        </View>
                        {/* <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), borderRadius: normalize(20), backgroundColor: "#FFF2E0", marginTop: normalize(10), alignSelf: 'flex-start' }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, fontWeight: "bold", color: "#666" }}>
                                {item?.display_cme}
                            </Text>
                        </View> */}
                        <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(10) }}>
                            {/* Display CME if available */}
                            {item?.display_cme && (
                                <View style={{ marginTop: normalize(10) }}>
                                    <Text style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        color: "#666666"
                                    }}>
                                        {item.display_cme}
                                    </Text>
                                </View>
                            )}

                            {/* Show separator only if both values exist */}
                            {item?.display_cme && item?.eventType && (
                                <View style={{
                                    backgroundColor: Colorpath.ButtonColr,
                                    height: normalize(10),
                                    width: normalize(1),
                                    marginTop: normalize(13)
                                }} />
                            )}

                            {/* Display Event Type if available */}
                            {item?.eventType && (
                                <View style={{ marginTop: normalize(10), flex: 1 }}>
                                    <Text style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        color: "#666666",
                                        flexWrap: "wrap"
                                    }}>
                                        {item.eventType}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(10), width: '100%' }}>
                            <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                                {AuthReducer?.loginResponse?.user?.subscription_user == "premium" ? (
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Image source={Imagepath.TickMark} style={{ height: normalize(15), width: normalize(15), resizeMode: "contain" }} />
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 14,
                                                color: "#FF5D18",
                                                fontWeight: "bold",
                                                marginLeft: normalize(10),
                                            }}
                                        >
                                            {"Prime Offer"}
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Image source={Imagepath.TickMark} style={{ height: normalize(15), width: normalize(15), resizeMode: "contain" }} />
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 14,
                                                color: "#FF5D18",
                                                fontWeight: "bold",
                                                marginLeft: normalize(10),
                                            }}
                                        >
                                            {"Prime Offer"}
                                        </Text>
                                    </View>
                                )}
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterSemiBold,
                                            fontSize: 18,
                                            color: "#000000",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {`${item?.display_currency_code}${item?.display_price}`}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 14,
                                            color: "#999",
                                            // paddingVertical: normalize(2),
                                            paddingHorizontal: normalize(6),
                                            textDecorationLine: "line-through",
                                            fontStyle: "italic"
                                        }}
                                    >
                                        {`${item?.display_currency_code}${statePrice}`}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => { handleUrlPage(item) }} style={{ height: normalize(30), width: normalize(80), borderRadius: normalize(5), justifyContent: "center", alignItems: "center", borderColor: Colorpath.ButtonColr, borderWidth: 0.5 }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16,
                                        color: "#2C4DB9",
                                    }}
                                >
                                    {item?.buttonType}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    const handleUrlPage = (did) => {
        const url = did?.detailpage_url;
        const result = url.split('/').pop();
        console.log(result, "webcast url=======", did);
        if (result) {
            props?.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result } })
        }
    }
    const registercourserenderData = ({ item, index }) => {
        console.log(item, "itemregisterid--------")
        return (
            <View>
                <View style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(10) }}>
                    <View
                        style={{
                            flexDirection: "column",
                            width: normalize(290),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            alignItems: "flex-start",
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                            <Text
                                numberOfLines={2}
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 16,
                                    color: "#000000",
                                    fontWeight: "bold",
                                    flexShrink: 1,
                                    flexWrap: 'wrap',
                                    width: normalize(210)
                                }}
                            >
                                {item?.title}
                            </Text>
                            {(item?.certificate?.certificate || item?.needReview) ? (
                                <TouchableOpacity onPress={() => {
                                    console.log(item, ">>>>>certificate")
                                    setModalviewstate(!modalviewstate);
                                    setNeedReview(item?.needReview);
                                    setOnlineName(item);
                                    setCertificatestate(item?.certificate?.certificate);
                                }}>
                                    <IconDot name="dots-three-vertical" size={25} color={"#848484"} />
                                </TouchableOpacity>
                            ) : null}
                        </View>

                        {/* <View
                            style={{
                                paddingHorizontal: normalize(10),
                                paddingVertical: normalize(8),
                                borderRadius: normalize(20),
                                backgroundColor: "#FFF2E0",
                                marginTop: normalize(10),
                                alignSelf: 'flex-start',
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 12,
                                    fontWeight: "bold",
                                    color: "#666",
                                }}
                            >
                                {item?.display_cme}
                            </Text>
                        </View> */}
                        <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(10) }}>
                            {/* Display CME if available */}
                            {item?.display_cme && (
                                <View style={{ marginTop: normalize(10) }}>
                                    <Text numberOfLines={1} style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        color: "#666666"
                                    }}>
                                        {item.display_cme}
                                    </Text>
                                </View>
                            )}

                            {/* Show separator only if both values exist */}
                            {item?.display_cme && item?.eventType && (
                                <View style={{
                                    backgroundColor: Colorpath.ButtonColr,
                                    height: normalize(10),
                                    width: normalize(1),
                                    marginTop: normalize(13)
                                }} />
                            )}

                            {/* Display Event Type if available */}
                            {item?.eventType && (
                                <View style={{ marginTop: normalize(10), flex: 1 }}>
                                    <Text style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        color: "#666666",
                                        flexWrap: "wrap"
                                    }}>
                                        {item.eventType}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(10), width: '100%' }}>
                            <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(4) }}>
                                    <Image
                                        source={item?.completed_percentage === 100 ? Imagepath.Complt : Imagepath.Pending}
                                        style={{ height: normalize(13), width: normalize(13), resizeMode: "contain" }}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterSemiBold,
                                            fontSize: 12,
                                            color: "#666",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {item?.completed_percentage === 100 ? "Completed" : `${item?.completed_percentage != null ? item?.completed_percentage : 0}% Complete`}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => {
                                if (item?.buttonText === "Revise Course") {
                                    props.navigation.navigate("VideoComponent", { RoleData: item });
                                } else {
                                    stateAction(item);
                                }
                            }}
                                style={{
                                    height: normalize(30),
                                    width: normalize(120),
                                    borderRadius: normalize(5),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderColor: Colorpath.ButtonColr,
                                    borderWidth: 0.5,
                                    marginLeft: normalize(10),
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16,
                                        color: "#2C4DB9",
                                    }}
                                >
                                    {item?.button_display_text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
    useEffect(() => {
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
                    title="State required CME courses"
                    onBackPress={StateHeader}
                /> : <View>
                    <PageHeader
                        title="State required CME courses"
                        onBackPress={StateHeader}
                    />
                </View>}
                <Loader visible={loadingdownst || loads} />
                {conn == false ? <IntOff/> :<ScrollView>
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
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
                                            paddingHorizontal: normalize(0)
                                        }}
                                    >
                                        {props?.route?.params?.fullData?.fullData?.name}
                                    </Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(10) }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <View style={{ paddingHorizontal: normalize(10), borderRadius: normalize(20), backgroundColor: cleanNumber(props?.route?.params?.fullData?.fullData?.earned_credits) == cleanNumber(props?.route?.params?.fullData?.fullData?.credits) ? "#D6F9E2" : "#FFF2E0", justifyContent: "center", alignItems: "center" }}>
                                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#000000" }}>
                                                    {`${props?.route?.params?.fullData?.fullData?.earned_credits} / ${props?.route?.params?.fullData?.fullData?.credits}`}
                                                </Text>
                                            </View>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterSemiBold,
                                                    fontSize: 14,
                                                    color: "#999",
                                                    fontWeight: "bold",
                                                    marginLeft: normalize(10),
                                                }}
                                            >
                                                {"Credits Earned"}
                                            </Text>
                                        </View>
                                        {props?.route?.params?.fullData?.fullData?.earned_credits < props?.route?.params?.fullData?.fullData?.credits ? (<TouchableOpacity onPress={() => { props.navigation.navigate("AddCredits", { mainAdd: props?.route?.params?.fullData?.addCreds }) }}>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterMedium,
                                                    fontSize: 14,
                                                    color: "#2C4DB9",
                                                    marginLeft: normalize(10),
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
                    {props?.route?.params?.fullData?.fullData?.registered_cources?.length > 0 ? <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000", width: normalize(290) }}>
                            {textget == "Suggestedtext" ? `Suggested Courses on ${props?.route?.params?.fullData?.fullData?.name}` : `Registered Courses on ${props?.route?.params?.fullData?.fullData?.name}`}
                        </Text>
                    </View> : null}
                    <View>
                        {props?.route?.params?.fullData?.fullData?.registered_cources?.length > 0 ? <FlatList
                            data={props?.route?.params?.fullData?.fullData?.registered_cources}
                            renderItem={registercourserenderData}
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
                    {props?.route?.params?.fullData?.fullData?.suggested_cources?.length > 0 ? <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(10)
                    }}>
                        <Text
                            style={{
                                fontFamily: Fonts.InterRegular,
                                fontSize: 16,
                                color: "#000000",
                                width: normalize(290)
                                // textAlign: "center", 
                            }}
                        >
                            {`Suggested Courses on ${props?.route?.params?.fullData?.fullData?.name}`}
                        </Text>
                    </View>
                        : null}
                    <View>
                        {props?.route?.params?.fullData?.fullData?.suggested_cources?.length > 0 ? <FlatList
                            data={props?.route?.params?.fullData?.fullData?.suggested_cources}
                            renderItem={courserenderData}
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

export default StateSpecification
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