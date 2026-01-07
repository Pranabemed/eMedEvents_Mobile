import { View, Text, Platform, Image, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator, StyleSheet, BackHandler, Alert } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import PageHeader from '../../Components/PageHeader';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import { useDispatch, useSelector } from 'react-redux';
import { cmeCourseRequest, ConfActRequest } from '../../Redux/Reducers/CMEReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import moment from 'moment';
import Modal from 'react-native-modal';
import Loader from '../../Utils/Helpers/Loader';
import { CommonActions } from '@react-navigation/native';
import { FormatDateZone } from '../../Utils/Helpers/Timezone';
import { AppContext } from './AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context'

let status = "";
const Globalresult = (props) => {
    const CMEReducer = useSelector(state => state.CMEReducer);
    const dispatch = useDispatch();
    const {
        isConnected
    } = useContext(AppContext);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const [storeAlldata, setStoreAlldata] = useState([]);
    const [apiReq, setApiReq] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [limit, setLimit] = useState(9);
    const [refreshing, setRefreshing] = useState(false);
    const [sortedFall, setSortedFall] = useState(false);
    const [sortType, setSortType] = useState("");
    const sortedData = [{ id: 0, name: "Price- Low to High", type: "PRICE_ASC" }, { id: 1, name: "Price- High to Low", type: "PRICE_DESC" }, { id: 2, name: "By Date- Newest to Oldest", type: "STARTDATE_DESC" }, { id: 3, name: "By Date- Oldest to Newest", type: "STARTDATE_ASC" }, { id: 4, name: "By CME Point- Low to High", type: "CMEPOINTS_ASC" }, { id: 5, name: "By CME Point- High to Low", type: "CMEPOINTS_DESC" }];
    const sorteddataforCity = [{ id: 2, name: "By Date- Newest to Oldest", type: "STARTDATE_DESC" }, { id: 3, name: "By Date- Oldest to Newest", type: "STARTDATE_ASC" }, { id: 4, name: "By CME Point- Low to High", type: "CMEPOINTS_ASC" }, { id: 5, name: "By CME Point- High to Low", type: "CMEPOINTS_DESC" }]
    useEffect(() => {
        if (props?.route?.params?.trig) {
            fetchHandle();
            setPageNum(0);
            setStoreAlldata([]);
        }
    }, [props?.route?.params?.trig])
    useEffect(() => {
        if (props?.route?.params?.filterDatSh?.filterDatSh) {
            fetchHandle();
            setPageNum(0);
            setStoreAlldata([]);
        }
    }, [props?.route?.params?.filterDatSh])
    console.log(props?.route?.params, "props?.route?.params?.filterDatSh------")
    const SearchBack = () => {
        if (props?.route?.params?.trig?.Realback == "cont") {
            props.navigation.goBack();
        } else if (props?.route?.params?.trig?.backProps == "yes") {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: "TabNav", params: { initialRoute: "Home" } }
                    ],
                })
            );
        } else if (props?.route?.params?.trig?.speaker) {
            props.navigation.navigate("SpeakerProfile", { fullUrl: { textHo: props?.route?.params?.trig?.textHo, hitDat: props?.route?.params?.trig?.highText, fullUrl: props?.route?.params?.trig?.trig, creditData: props?.route?.params?.trig?.creditAll, speaks: "speaker" } })
        } else if (props?.route?.params?.trig?.back == "goBack") {
            props.navigation.navigate("SpeakerProfile", { fullUrl: { textHo: props?.route?.params?.trig?.textHo, hitDat: props?.route?.params?.trig?.highText, fullUrl: props?.route?.params?.trig?.trig, creditData: props?.route?.params?.trig?.creditAll, speaks: props?.route?.params?.trig?.speaks == "organ" ? "organ" : "speaker" } })
        } else {
            props.navigation.goBack();
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: "TabNav", params: { initialRoute: "Home" } }
                    ],
                })
            );
        }
    }
    useEffect(() => {
        const onBackPress = () => {
            SearchBack()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    const fetchHandle = (d) => {
        const mainKey = props?.route?.params?.trig?.mainKey ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.mainKey ?? "";
        const stateKey = props?.route?.params?.trig?.newAdd ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.newAdd ?? "";
        const newCt = props?.route?.params?.trig?.newCt ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.newCt ?? "";
        const rqstType =
            props?.route?.params?.trig?.rqstType ??
            props?.route?.params?.filterDatSh?.returnTake?.trig?.rqstType ??
            "";
        const finalKey =
            rqstType == "specialityconferences"
                ? `m${rqstType}`
                : rqstType;

        let obj = {
            "pageno": pageNum,
            "limit": limit,
            "search_speciality": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.count_specilaities)?.map(d => d?.count_specilaities).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.count_specilaities)?.map(d => d?.count_specilaities).flat()
                : "",
            "conference_type_text":
                props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.conf_types)?.map(d => d?.conf_types).flat().length > 0
                    ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.conf_types)?.map(d => d?.conf_types).flat()
                    : "",
            "cme_from": props?.route?.params?.filterDatSh?.minVal ? props?.route?.params?.filterDatSh?.minVal : "",
            "cme_to": props?.route?.params?.filterDatSh?.maxVal ? props?.route?.params?.filterDatSh?.maxVal : "",
            "organization": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.organizers_types)?.map(d => d?.organizers_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.organizers_types)?.map(d => d?.organizers_types).flat()
                : props?.route?.params?.trig?.organ ? props?.route?.params?.trig?.organ : "",
            "price_from": props?.route?.params?.filterDatSh?.minValP ? props?.route?.params?.filterDatSh?.minValP : "",
            "price_to": props?.route?.params?.filterDatSh?.maxValp ? props?.route?.params?.filterDatSh?.maxValp : "",
            "startdate": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.date_types)?.map(d => d?.date_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.date_types)?.map(d => d?.date_types).flat()
                : "",
            "location": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.location_types)?.map(d => d?.location_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.location_types)?.map(d => d?.location_types).flat()
                : "",
            "free_conf": props?.route?.params?.filterDatSh?.selectedIt?.length > 0 ? props?.route?.params?.filterDatSh?.selectedIt?.find(item => item === "Free Courses") == "Free Courses" ? 1 : "" : "",
            "noncme": props?.route?.params?.filterDatSh?.selectedIt?.length > 0 ? props?.route?.params?.filterDatSh?.selectedIt?.find(item => item === "Non-CME Courses") == "Non-CME Courses" ? 1 : "" : "",
            "speaker": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.speakers_types)?.map(d => d?.speakers_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.speakers_types)?.map(d => d?.speakers_types).flat()
                : props?.route?.params?.trig?.speaker ? props?.route?.params?.trig?.speaker : "",
            "search_mandate_states": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.mandate_states)?.map(d => d?.mandate_states).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.mandate_states)?.map(d => d?.mandate_states).flat()
                : [],
            "search_topic": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.topic_types)?.map(d => d?.topic_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.topic_types)?.map(d => d?.topic_types).flat()
                : "",
            "search_profession": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.profession_types)?.map(d => d?.profession_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.profession_types)?.map(d => d?.profession_types).flat()
                : "",
            "credittype": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.credit_types)?.map(d => d?.credit_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.credit_types)?.map(d => d?.credit_types).flat()
                : "",
            "sort_type": d?.type ?? "",
            "searchKeyword": props?.route?.params?.trig?.searchTxt ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.searchTxt ?? "",
            "request_type": finalKey ?? props?.route?.params?.trig?.rqstType ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.rqstType ?? "",
            [mainKey]:
                props?.route?.params?.trig?.beforetake ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.beforetake
                ?? props?.route?.params?.trig?.beforetakecity?.[0] ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.beforetakecity?.[0]
                ?? props?.route?.params?.trig?.monthAds ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.monthAds ?? props?.route?.params?.trig?.trig ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.trig ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.datamainkey
                ?? props?.route?.params?.trig?.datamainkey ?? "",
            [stateKey]:
                (props?.route?.params?.trig?.newAdd ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.newAdd)
                    ? (
                        props?.route?.params?.trig?.trig ??
                        props?.route?.params?.filterDatSh?.returnTake?.trig?.trig ??
                        props?.route?.params?.trig?.beforetakecity?.[1] ??
                        props?.route?.params?.filterDatSh?.returnTake?.trig?.beforetakecity?.[1] ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.stateID ?? props?.route?.params?.trig?.stateID
                    )
                    : "",
            [newCt]:
                (props?.route?.params?.trig?.newCt ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.newCt)
                    ? (props?.route?.params?.trig?.beforetakecity?.[2] ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.beforetakecity?.[2] ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.allProfessionMain ?? props?.route?.params?.trig?.allProfessionMain)
                    : "",
        };
        connectionrequest()
            .then(() => {
                dispatch(cmeCourseRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
                setLoading(false);
            });
    };

    const fetchMore = useCallback(() => {
        if (CMEReducer?.cmeCourseResponse?.conferences?.length >= props?.route?.params?.trig?.count) {
            setApiReq(false);
            setLoading(false);
            return;
        }
        if (!apiReq && CMEReducer?.cmeCourseResponse?.conferences?.length > 0) {
            setPageNum(pageNum + 1);
            fetchHandle();
        }
    }, [apiReq]);

    const fullDataRefresh = () => {
        setStoreAlldata([]);
        setPageNum(0);
        setRefreshing(false);
        fetchHandle();
    };
    const handleUrl = (onlineName) => {
        const url = onlineName?.detailpage_url;
        const result = url.split('/').pop();
        console.log(result, "webcast url=======", onlineName);
        let obj = {
            "conference_id": onlineName?.id,
            "action_type": "view",
            "status": 1
        }
        connectionrequest()
            .then(() => {
                dispatch(ConfActRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
            });
        if (result) {
            props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: props?.route?.params?.trig?.creditData || props?.route?.params?.trig?.creditAll || props?.route?.params?.filterDatSh?.returnTake?.trig?.creditAll, Realback: props?.route?.params?.trig?.Realback } })
        }
    }
    useEffect(() => {
        if (CMEReducer?.cmeCourseResponse?.conferences?.length > 0) {
            setApiReq(false);
            setLoading(false);
            let modifiedData = [
                ...storeAlldata,
                ...CMEReducer?.cmeCourseResponse?.conferences,
            ]?.filter(
                (value, index, self) =>
                    index === self.findIndex(t => t?.id === value?.id),
            );
            setStoreAlldata(modifiedData);
        } else if (CMEReducer?.cmeCourseResponse?.conferences?.length == 0) {
            setApiReq(false);
            setLoading(false);
        }
    }, [CMEReducer?.cmeCourseResponse?.conferences])
    if (status == '' || CMEReducer.status !== status) {
        switch (CMEReducer.status) {
            case 'CME/cmeCourseRequest':
                status = CMEReducer.status;
                setApiReq(true);
                setLoading(true);
                break;
            case 'CME/cmeCourseSuccess':
                status = CMEReducer.status;
                setApiReq(false);
                setLoading(false);
                if (CMEReducer?.cmeCourseResponse?.conferences?.length > 0) {
                    let modifiedData = [
                        ...storeAlldata,
                        ...CMEReducer?.cmeCourseResponse?.conferences,
                    ]?.filter(
                        (value, index, self) =>
                            index === self.findIndex(t => t?.id === value?.id),
                    );
                    setStoreAlldata(modifiedData);
                } else if (CMEReducer?.cmeCourseResponse?.conferences?.length == 0) {
                    setApiReq(false);
                    setLoading(false);
                }
                break;
            case 'CME/cmeCourseFailure':
                status = CMEReducer.status;
                setPageNum(0);
                setApiReq(false);
                setLoading(false);
                setRefreshing(false);
                break;
        }
    }
    const searchGlobalitem = ({ item, index }) => {
        console.log(item, "item---------")
        const formatDate = (dateStr) => {
            const date = moment(dateStr, "DD MMM'YY");
            return date.format("MMM  D").replace(' ', '');
        };
        const formattedDate = formatDate(item?.startdate);
        const formatDateEnd = (dateStr) => {
            const date = moment(dateStr, "DD MMM'YY");
            return date.format("MMM D, YYYY").replace('', '');
        };
        const formattedDateend = formatDateEnd(item?.enddate);
        const renderLocationAndDates = () => {
            if (item?.startdate && item?.enddate && item?.location) {
                return (
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={Imagepath.WrongCal}
                            style={{ height: normalize(15), width: normalize(15), resizeMode: "contain" }}
                        />
                        <Text
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 14,
                                color: "#333",
                                bottom: normalize(1),
                                marginLeft: normalize(5),
                                width: normalize(220),
                                lineHeight: normalize(15)
                            }}
                        >
                            {`${FormatDateZone(item?.startdate, item?.enddate)} | ${item?.location}`}
                        </Text>
                    </View>
                );
            } else if (item?.startdate && item?.enddate) {
                return (
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={Imagepath.CalImg}
                            style={{ height: normalize(15), width: normalize(15), resizeMode: "contain" }}
                        />
                        <Text
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 14,
                                color: "#333",
                                marginLeft: normalize(5),
                                lineHeight: normalize(15)
                            }}
                        >
                            {`${FormatDateZone(item?.startdate, item?.enddate)}`}
                        </Text>
                    </View>
                );
            } else if (item?.location) {
                return (
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={Imagepath.MapPin}
                            style={{ height: normalize(15), width: normalize(15), resizeMode: "contain" }}
                        />
                        <Text
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 14,
                                color: "#333",
                                // bottom: normalize(3),
                                lineHeight: normalize(15)
                            }}
                        >
                            {item?.location}
                        </Text>
                    </View>
                );
            }
            return null;
        };
        return (
            <View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                    <TouchableOpacity onPress={() => { handleUrl(item) }}>
                        <View
                            style={{
                                flexDirection: "column",
                                width: normalize(290),
                                borderRadius: normalize(10),
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: normalize(10),
                                paddingVertical: normalize(5),
                                borderColor: "#DADADA",
                                borderWidth: 0.8
                                // shadowColor: "#000",
                                // shadowOffset: { width: 0, height: 1 },
                                // shadowOpacity: 0.2,
                                // shadowRadius: 2,
                                // elevation: 5
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: '106%'
                                }}>
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        <View>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterSemiBold,
                                                    fontSize: 16,
                                                    color: "#000000",
                                                    fontWeight: "bold",
                                                    flexWrap: 'wrap',
                                                    lineHeight: 20,
                                                }}
                                                numberOfLines={2}
                                                ellipsizeMode="tail"
                                            >
                                                {item?.title}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ justifyContent: "flex-start", alignItems: "flex-start", paddingVertical: normalize(4) }}>
                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{item?.organization_name}</Text>
                            </View>
                            {(item?.startdate || item?.enddate || item?.location) && (<View style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row", paddingVertical: normalize(4) }}>
                                {renderLocationAndDates()}
                            </View>)}
                            {(item?.display_price !== "" || item?.buttonText == "Register") && <View style={{ height: 0.8, width: normalize(273), backgroundColor: "#DADADA", marginTop: normalize(5) }} />}
                            {(!item?.display_price || !item?.buttonText) ? null : <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", marginTop: normalize(3) }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>{item?.display_price == "FREE" ? `${item?.display_price}` : `${item?.display_currency_code}${item?.display_price}`}</Text>
                                <View style={{ width: 1, height: 20, backgroundColor: "#D9D9D9" }} />
                                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 16, color: Colorpath.ButtonColr }}>{item?.buttonText}</Text>
                            </View>}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn == false ? <IntOff /> : <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="Search Results"
                            onBackPress={SearchBack}
                        />
                    ) : (
                        <PageHeader
                            title="Search Results"
                            onBackPress={SearchBack}
                        />

                    )}
                </View>
                {/* <Loader visible={CMEReducer?.status == 'CME/cmeCourseRequest'} /> */}
                {storeAlldata?.length > 0 && <TouchableOpacity onPress={() => {
                    setPageNum(0);
                    setSortedFall(!sortedFall);
                }} style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <View style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row" }}>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#333" }}>{`Showing (${props?.route?.params?.trig?.totalDaa?.count ?? CMEReducer?.cmeCourseResponse?.conferences_count ?? ""}) Results for`}</Text>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#333" }}>{"Sort By"}</Text>
                            <Image source={Imagepath.SortedPng} style={{ height: normalize(18), width: normalize(18), resizeMode: "contain" }} />
                        </View>
                    </View>
                </TouchableOpacity>}
                {CMEReducer?.cmeCourseResponse?.header_title && storeAlldata?.length > 0 && <View style={{ paddingHorizontal: normalize(10), marginTop: normalize(-10), paddingVertical: normalize(5) }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 24, color: Colorpath.ButtonColr }}>{CMEReducer?.cmeCourseResponse?.header_title}</Text>
                </View>}
                <View>
                    <FlatList
                        data={storeAlldata}
                        renderItem={searchGlobalitem}
                        keyExtractor={(item, index) => item.id}
                        onEndReached={fetchMore}
                        onEndReachedThreshold={0.5}
                        contentContainerStyle={{ paddingBottom: normalize(200) }}
                        scrollEventThrottle={16}
                        ListFooterComponent={
                            loading ? <ActivityIndicator color={Colorpath.ButtonColr} size="large" /> : null
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={fullDataRefresh}
                            />
                        }
                        ListEmptyComponent={!loading &&
                            <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(25) }}>
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
                                        borderStyle: 'dotted',
                                        borderWidth: 1,
                                    }}
                                >
                                    <View style={{ flex: 1, justifyContent: "center" }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 16,
                                                color: Colorpath.ButtonColr,
                                                fontWeight: "bold",
                                                alignSelf: "center"
                                            }}
                                        >
                                            {"There are no matches available for your search criteria. Please change the criteria and try again."}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        } />
                </View>
                <Modal
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    isVisible={sortedFall}
                    backdropColor={Colorpath.black}
                    style={{
                        width: '100%',
                        alignSelf: 'center',
                        margin: 0,
                    }}
                    onBackdropPress={() => setSortedFall(false)}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setSortedFall(false)}>

                        <View
                            style={props?.route?.params?.trig?.newCt ? {
                                borderRadius: normalize(7),
                                height: Platform.OS === 'ios' ? normalize(240) : normalize(240),
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                backgroundColor: '#fff',
                            } : {
                                borderRadius: normalize(7),
                                height: Platform.OS === 'ios' ? normalize(340) : normalize(340),
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
                                data={props?.route?.params?.trig?.newCt ? sorteddataforCity : sortedData}
                                renderItem={({ item }) => {
                                    const handlePress = (dd) => {
                                        fetchHandle(dd);
                                        setPageNum(0);
                                        setSortType(dd?.type);
                                        setSortedFall(false);
                                        setStoreAlldata([]);
                                    };

                                    return (
                                        <TouchableOpacity
                                            onPress={() => { handlePress(item) }}
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
                {CMEReducer?.cmeCourseResponse?.aggregations && storeAlldata?.length > 0 && <View style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 0,
                    paddingHorizontal: normalize(20),
                    zIndex: 999
                }}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate("FilterScreen", { wholeDats: { wholeDats: CMEReducer?.cmeCourseResponse?.aggregations, mainKeyAll: props?.route?.params?.trig ? props?.route?.params : props?.route?.params?.filterDatSh?.returnTake, ClearText: props?.route?.params?.filterDatSh?.filterDatSh, takeTrue: props?.route?.params?.filterDatSh?.selectedItem, PriceDrop: { minget: props?.route?.params?.filterDatSh?.minVal, maxget: props?.route?.params?.filterDatSh?.maxVal, mingetp: props?.route?.params?.filterDatSh?.minValP, maxgetp: props?.route?.params?.filterDatSh?.maxValp, CME: props?.route?.params?.filterDatSh?.selectedIt } } });
                    }} style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        height: normalize(50),
                        width: normalize(50),
                        backgroundColor: Colorpath.ButtonColr,
                        borderWidth: 0.5,
                        borderColor: "#AAAAAA",
                        borderRadius: normalize(50),
                        paddingHorizontal: normalize(15)
                    }}>
                        <Image source={Imagepath.Filter} style={{ height: normalize(18), width: normalize(18), resizeMode: "contain", alignSelf: "center", tintColor: "#FFFFFF" }} />
                    </TouchableOpacity>
                </View>}
            </SafeAreaView>}
        </>
    )
}

export default Globalresult
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