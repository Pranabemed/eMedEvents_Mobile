import { View, Text, Platform, FlatList, ImageBackground, TouchableOpacity, Image, BackHandler, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import { cmeCourseRequest, ConfActRequest } from '../../Redux/Reducers/CMEReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import { AppContext } from '../GlobalSupport/AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
const InterestedChekout = (props) => {
    const { isConnected } = useContext(AppContext);

    const profileBack = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: "TabNav" }
                ],
            })
        );

    }
    const dispatch = useDispatch();
    const CMEReducer = useSelector(state => state.CMEReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const isfocus = useIsFocused();
    const [storeAlldata, setStoreAlldata] = useState([]);
    const [apiReq, setApiReq] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [limit, setLimit] = useState(9);
    const [refreshing, setRefreshing] = useState(false);
    const [newload, setNewload] = useState(false);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setNewload(true);
        }, 4000);

        return () => clearTimeout(timeout);
    }, []);
    const fetchHandle = () => {
        let obj = {
            "limit": limit,
            "listby_type": "interstedconferences",
            "pageno": pageNum,
            "request_type": "normallist"
        };
        connectionrequest()
            .then(() => {
                dispatch(cmeCourseRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
            });
    };

    useEffect(() => {
        fetchHandle();
        setPageNum(0);
        setStoreAlldata([]);
    }, [isfocus])
    useEffect(() => {
        fetchHandle();
        setPageNum(0);
        setStoreAlldata([]);
    }, [])
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
            props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: DashboardReducer?.mainprofileResponse?.licensures?.[0] } })
        }
    }
    useEffect(() => {
        const onBackPress = () => {
            profileBack()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);

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
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    const CMEExclusive = ({ item, index }) => {
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
                        <Text numberOfLines={1}
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 14,
                                color: "#333",
                                bottom: normalize(3),
                                marginLeft: normalize(5),
                                width: normalize(220)
                            }}
                        >
                            {`${formattedDate} - ${formattedDateend} | ${item?.location}`}
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
                                bottom: normalize(0),
                                marginLeft: normalize(5)
                            }}
                        >
                            {`${formattedDate} - ${formattedDateend}`}
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
                                bottom: normalize(3),
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
                                paddingVertical: normalize(10),
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
                            {<View style={{ height: 0.8, width: normalize(273), backgroundColor: "#DADADA", marginTop: normalize(5) }} />}
                            {<View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", marginTop: normalize(3) }}>
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
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn == false ? <IntOff /> : <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="Interested Conferences"
                            onBackPress={profileBack}
                        />
                    ) : (
                        <PageHeader
                            title="Interested Conferences"
                            onBackPress={profileBack}
                        />
                    )}
                </View>
                {storeAlldata?.length > 0 && <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <View style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row" }}>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#333" }}>{`Showing (${CMEReducer?.cmeCourseResponse?.conferences_count || 0}) Results`}</Text>
                    </View>
                </View>}
                {CMEReducer?.cmeCourseResponse?.header_title && storeAlldata?.length > 0 && <View style={{ paddingHorizontal: normalize(10), marginTop: normalize(-10), paddingVertical: normalize(5) }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 24, color: Colorpath.ButtonColr }}>{CMEReducer?.cmeCourseResponse?.header_title}</Text>
                </View>}
                <View>
                    <FlatList
                        data={storeAlldata}
                        renderItem={CMEExclusive}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: normalize(200) }}
                        onEndReached={fetchMore}
                        onEndReachedThreshold={0.5}
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
                        ListEmptyComponent={!newload ? <ActivityIndicator size={"small"} style={{ top: 2 }} color={"green"} /> :
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
                                            {"You have not shown interest for any of the conferences or courses."}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        }
                    />
                </View>
            </SafeAreaView>}
        </>
    )
}

export default InterestedChekout