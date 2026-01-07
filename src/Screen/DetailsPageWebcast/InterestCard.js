import { View, Text, Platform, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useLayoutEffect } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import Imagepath from '../../Themes/Imagepath'
import Fonts from '../../Themes/Fonts'
import moment from 'moment'
import { ConfActRequest } from '../../Redux/Reducers/CMEReducer'
import connectionrequest from '../../Utils/Helpers/NetInfo'
import showErrorAlert from '../../Utils/Helpers/Toast'
import { useDispatch } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
const InterestCard = (props) => {
    const dispatch = useDispatch();
    const thanksBack = () => {
        props.navigation.replace("TabNav");
    }
    console.log(props?.route?.params, "fdfgfdg========");
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
                props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData:props?.route?.params?.invoiceTxt?.creditDs,acrBack:"listing",backDat:props?.route?.params?.invoiceTxt?.invoiceTxt  } })
            }
        }
     const searchGlobalitem = ({ item, index }) => {
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
                                bottom: normalize(1),
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
                            borderColor:"#DADADA",
                            borderWidth:0.8
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
                        {item?.display_price && <View style={{ height: 0.8, width: normalize(273), backgroundColor: "#DADADA", marginTop: normalize(5) }} />}
                        {!item?.display_price ? null : <View style={{ justifyContent: "flex-end", alignItems: "flex-end", marginTop: normalize(3) }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 20, color: Colorpath.ButtonColr }}>{item?.display_price == "FREE" ? `${item?.display_price}` : `${item?.display_currency_code}${item?.display_price}`}</Text>
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
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>

                {Platform.OS === 'ios' ? (
                    <PageHeader title="Thank you for showing interest" onBackPress={thanksBack} />
                ) : (
                    <View>
                        <PageHeader title="Thank you for showing interest" onBackPress={thanksBack} />
                    </View>
                )
                }

                <View>
                    <FlatList
                        data={props?.route?.params?.invoiceTxt?.invoiceTxt}
                        renderItem={searchGlobalitem}
                        keyExtractor={(item, index) => item.id}
                        onEndReachedThreshold={0.5}
                        contentContainerStyle={{ paddingBottom: normalize(200) }}
                        scrollEventThrottle={16}
                        ListEmptyComponent={
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

            </SafeAreaView>
        </>
    )
}

export default InterestCard