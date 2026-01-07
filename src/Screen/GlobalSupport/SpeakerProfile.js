import { View, Text, ImageBackground, ScrollView, ActivityIndicator, RefreshControl, Platform, Image, TouchableOpacity, FlatList, useWindowDimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import Imagepath from '../../Themes/Imagepath'
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import { CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { searchSpeakerRequest, speakerProfileRequest } from '../../Redux/Reducers/TransReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import Loader from '../../Utils/Helpers/Loader';
import moment from 'moment';
import RenderHTML from 'react-native-render-html';
import NetInfo from '@react-native-community/netinfo';
import { AppContext } from './AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'

let status = "";

const SpeakerProfile = (props) => {
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
    const { width } = useWindowDimensions();
    const SearchProf = () => {
        if (props?.route?.params?.fullUrl?.textHo == "fs") {
            props.navigation.goBack();
        } else if (props?.route?.params?.fullUrl?.speaks == "speaker") {
            props.navigation.navigate("Speaker", { highText: { speaks: props?.route?.params?.fullUrl?.speaks == "speaker" ? "speaker" : "organ", highText: props?.route?.params?.fullUrl?.hitDat } })
        } else {
            props.navigation.goBack();
        }
    }
    const TransReducer = useSelector(state => state.TransReducer);
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState(false);
    const [speakerconf, setSpeakerconf] = useState("");
    console.log(props?.route?.params?.fullUrl, "fulluyrl===========", props?.route?.params);
    useEffect(() => {
        if (props?.route?.params?.fullUrl?.fullUrl) {
            let obj = props?.route?.params?.fullUrl?.speaks == "speaker" ? {
                "user_url": props?.route?.params?.fullUrl?.fullUrl,
                "speak": ""
            } : {
                "user_url": props?.route?.params?.fullUrl?.fullUrl
            }
            connectionrequest()
                .then(() => {
                    dispatch(speakerProfileRequest(obj))
                })
                .catch((err) => showErrorAlert("Please conenct to internet", err))
        }
    }, [props?.route?.params])
    const toggleExpansion = () => {
        if (!expanded) {
            setSpeakerconf(prevContent => prevContent);
        }
        setExpanded(!expanded);
    };
    const cutoff = speakerconf ? Math.floor(speakerconf.length / 2) : 0;
    const source = {
        html: expanded
            ? speakerconf
            : speakerconf && (speakerconf.length > cutoff
                ? speakerconf.substring(0, cutoff) + "..."
                : speakerconf)
    };
    const handleUrl = (onlineName) => {
        const url = onlineName?.detailpage_url;
        if (!url) {
            console.warn("Invalid or missing URL:", onlineName);
            return;
        }
        try {
            const result = url.split('/').pop() || '';
            if (result) {
                props.navigation.navigate("Statewebcast", {
                    webCastURL: {
                        webCastURL: result,
                        creditData: props?.route?.params?.fullUrl?.creditData,
                        takeUrl: props?.route?.params?.fullUrl?.hitDat ? props?.route?.params?.fullUrl?.fullUrl : "",
                        speaks: props?.route?.params?.fullUrl?.speaks == "speaker" ? "speaker" : "organ",
                        highText: props?.route?.params?.fullUrl?.hitDat,
                        textHo: props?.route?.params?.fullUrl?.textHo
                    }
                });
            }
        } catch (error) {
            console.error("URL processing error:", error);
        }
    };
    const SpeakerConfItem = ({ item, index }) => {
        const renderLocationAndDates = () => {
            if (item?.date && item?.location) {
                return (
                    <View style={{ flexDirection: "row", marginLeft: normalize(1.5) }}>
                        <Image
                            source={Imagepath.WrongCal}
                            style={{ height: normalize(15), width: normalize(15), resizeMode: "contain", tintColor: "#000" }}
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
                            {`${item?.date} | ${item?.location}`}
                        </Text>
                    </View>
                );
            } else if (item?.date) {
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
                                marginLeft: normalize(5)
                            }}
                        >
                            {`${item?.date}`}
                        </Text>
                    </View>
                );
            } else if (item?.location) {
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
            <TouchableOpacity onPress={handleUrl}>
                <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                    <View
                        style={{
                            flexDirection: "column",
                            width: normalize(290),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.2,
                            shadowRadius: 2,
                            elevation: 5
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
                                    <TouchableOpacity onPress={() => { handleUrl(item) }}>
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
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 5,
                                paddingVertical: normalize(4),
                                // right:normalize(1)
                            }}>
                            <Image
                                source={
                                    item?.eventType === "Text-Based CME"
                                        ? Imagepath.Textbased
                                        : item?.eventType === "In-Person Event"
                                            ? Imagepath.InPerson
                                            : item?.eventType === "Hybrid Event"
                                                ? Imagepath.Hybrid
                                                : item?.eventType === "Webcast"
                                                    ? Imagepath.VideoCam
                                                    : item?.eventType === "Journal CME"
                                                        ? Imagepath.Journal
                                                        : item?.eventType === "Podcast"
                                                            ? Imagepath.PodCast
                                                            : item?.eventType === "Live Webinar"
                                                                ? Imagepath.LiveWebinar
                                                                : null
                                }
                                style={{
                                    height: normalize(15),
                                    width: normalize(15),
                                    tintColor: '#000000',
                                    resizeMode: 'contain',
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000"
                                }}>
                                {item?.eventType}
                            </Text>
                        </View>
                        {(item?.date || item?.location) && (<View style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row", paddingVertical: normalize(4) }}>
                            {renderLocationAndDates()}
                        </View>)}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    if (status === '' || TransReducer.status !== status) {
        switch (TransReducer.status) {
            case 'Transaction/speakerProfileRequest':
                status = TransReducer.status;
                break;
            case 'Transaction/speakerProfileSuccess':
                status = TransReducer.status;
                setSpeakerconf(TransReducer?.speakerProfileResponse?.about);
                console.log(TransReducer?.speakerProfileResponse, "dsfgndksgkjdf----")
                break;
            case 'Transaction/speakerProfileFailure':
                status = TransReducer.status;
                break;
        }
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
                            title={(props?.route?.params?.fullUrl?.speaks == "organ" || props?.route?.params?.fullUrl?.showtext == "organ") ? "Organizer Profile" : "Speaker Profile"}
                            onBackPress={SearchProf}
                        />
                    ) : (
                        <PageHeader
                            title={(props?.route?.params?.fullUrl?.speaks == "organ" || props?.route?.params?.fullUrl?.showtext == "organ") ? "Organizer Profile" : "Speaker Profile"}
                            onBackPress={SearchProf}
                        />

                    )}
                </View>
                <Loader visible={TransReducer?.status == 'Transaction/speakerProfileRequest'} />
                <ScrollView>
                    <View style={{ marginTop: normalize(30) }}>
                        <View style={{
                            backgroundColor: Colorpath.white,
                            margin: normalize(10),
                            borderRadius: normalize(10),
                        }}>
                            <View style={{
                                position: 'absolute',
                                top: -normalize(33),
                                left: normalize(15),
                                zIndex: 1,
                                height: normalize(70),
                                width: normalize(70),
                                borderRadius: normalize(35),
                                backgroundColor: Colorpath.white,
                                justifyContent: 'center',
                                alignItems: 'center',
                                elevation: 5,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4
                            }}>
                                <ImageBackground
                                    source={TransReducer?.speakerProfileResponse?.image ? { uri: TransReducer?.speakerProfileResponse?.image } : Imagepath.HumanIcn}
                                    style={{
                                        height: normalize(70),
                                        width: normalize(70),
                                    }}
                                    imageStyle={{ borderRadius: normalize(35) }}
                                />
                            </View>

                            <View style={{
                                padding: normalize(13),
                                marginTop: normalize(30),
                                flexDirection: "column" // Space for the avatar
                            }}>
                                {TransReducer?.speakerProfileResponse?.name && <Text style={{
                                    fontFamily: Fonts.InterBold,
                                    fontSize: 24,
                                    color: "#000000",
                                    lineHeight: normalize(24),
                                    // marginBottom: normalize(4),
                                    fontWeight: "bold"
                                }}>
                                    {TransReducer?.speakerProfileResponse?.name}
                                </Text>}

                                {(TransReducer?.speakerProfileResponse?.qualification || TransReducer?.speakerProfileResponse?.specialities) && (
                                    <Text style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16,
                                        color: "#666",
                                        lineHeight: normalize(20),
                                    }}>
                                        {[
                                            TransReducer?.speakerProfileResponse?.qualification,
                                            TransReducer?.speakerProfileResponse?.specialities,
                                            // Add more fields here as needed
                                        ]
                                            .filter(item => item && item.trim() !== "")
                                            .join(", ")}
                                    </Text>
                                )}
                                {TransReducer?.speakerProfileResponse?.location && <View style={{ flexDirection: "row", gap: 2, marginTop: normalize(5), right: normalize(2) }}>
                                    <Image source={Imagepath.MapPin} style={{ height: normalize(18), width: normalize(18), resizeMode: "contain" }} />
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#333" }}>{TransReducer?.speakerProfileResponse?.location}</Text>
                                </View>}
                                {/* {(props?.route?.params?.fullUrl?.speaks == "organ" || props?.route?.params?.fullUrl?.showtext == "organ")? "": <TouchableOpacity onPress={()=> props.navigation.navigate("ContactUs",{makeIt:{speaker_id:TransReducer?.speakerProfileResponse?.id,specialities_All:TransReducer?.speakerProfileResponse?.specialities,Name:TransReducer?.speakerProfileResponse?.name}})} style={{ justifyContent: "center", alignContent: "center", height: normalize(45), width: normalize(270), backgroundColor: "#F1EBFF", borderRadius: normalize(5), marginTop: normalize(10) }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignContent: "space-evenly", gap: 10 }}>
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#333" }}>{"Connect with speaker?"}</Text>
                                        <Text style={{ fontFamily: Fonts.InterBold, fontWeight: "bold", fontSize: 18, color: Colorpath.ButtonColr }}>{"Contact US"}</Text>
                                    </View>
                                </TouchableOpacity>} */}
                                {speakerconf && <View style={{ height: 1, width: normalize(300), backgroundColor: "#DDD", marginTop: normalize(10), right: normalize(13) }} />}
                                {speakerconf && <View style={{ marginTop: normalize(10) }}>
                                    <RenderHTML
                                        contentWidth={width}
                                        source={source}
                                        tagsStyles={{
                                            b: {
                                                fontFamily: Fonts.InterMedium,
                                                fontSize: 16,
                                                color: '#333',
                                                marginVertical: 0
                                            },
                                            p: {
                                                fontFamily: Fonts.InterMedium,
                                                fontSize: 16,
                                                color: '#000000',
                                                marginVertical: 0
                                            },
                                            ul: {
                                                fontFamily: Fonts.InterMedium,
                                                fontSize: 16,
                                                color: '#000000',
                                                marginVertical: 0
                                            },
                                            li: {
                                                fontFamily: Fonts.InterMedium,
                                                fontSize: 16,
                                                color: "#000000",
                                                marginVertical: 0
                                            }
                                        }}
                                    />
                                    {/* <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#333" }}>{source}</Text> */}
                                    <TouchableOpacity
                                        onPress={toggleExpansion}
                                        style={{
                                            marginTop: normalize(5),
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 16,
                                                color: Colorpath.ButtonColr,
                                            }}>
                                            {expanded ? 'Read Less' : 'Read More'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>}
                            </View>
                        </View>
                    </View>
                    {TransReducer?.speakerProfileResponse?.conferences?.length > 0 && <View style={{ paddingHorizontal: normalize(13), marginTop: normalize(10), paddingVertical: normalize(5), flexDirection: "column" }}>
                        {(props?.route?.params?.fullUrl?.speaks == "organ" || props?.route?.params?.fullUrl?.showtext == "organ") ? <Text style={{ fontFamily: Fonts.InterBold, fontWeight: "bold", fontSize: 18, color: "#000000" }}>{"CONFERENCES & COURSES"}</Text> : <Text style={{ fontFamily: Fonts.InterBold, fontWeight: "bold", fontSize: 18, color: "#000000" }}>{"EVENTS & ACTIVITIES "}</Text>}
                        {(props?.route?.params?.fullUrl?.speaks == "organ" || props?.route?.params?.fullUrl?.showtext == "organ") ? "" : <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 18, color: "#000000" }}>{"(Speaking, Spoken, and Authored)"}</Text>}
                    </View>}
                    {TransReducer?.speakerProfileResponse?.conferences?.length > 0 && <View>
                        <FlatList
                            data={TransReducer?.speakerProfileResponse?.conferences && TransReducer?.speakerProfileResponse?.conferences?.slice(0, 6)}
                            renderItem={SpeakerConfItem}
                            keyExtractor={(item) => item?.id}
                            onEndReachedThreshold={0.1}
                            contentContainerStyle={{ paddingBottom: normalize(50) }}
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
                    </View>}

                    {TransReducer?.speakerProfileResponse?.total_conferences > 6 && <TouchableOpacity onPress={() => props.navigation.navigate("Globalresult", { trig: { speaker: props?.route?.params?.fullUrl?.speaks == "speaker" ? [TransReducer?.speakerProfileResponse?.name] : "", newAdd: "user_url", trig: props?.route?.params?.fullUrl?.fullUrl, beforetake: "1", rqstType: "normallist", mainKey: "need_past_conferences", creditAll: props?.route?.params?.fullUrl?.creditData, organ: props?.route?.params?.fullUrl?.speaks == "speaker" ? "" : [TransReducer?.speakerProfileResponse?.name], speaks: props?.route?.params?.fullUrl?.speaks == "speaker" ? "speaker" : "organ", highText: props?.route?.params?.fullUrl?.hitDat, textHo: props?.route?.params?.fullUrl?.textHo, "back": "goBack", refreshKey: Date.now(), Realback: props?.route?.params?.fullUrl?.Realback } })} style={{ justifyContent: "center", alignItems: "center", marginBottom: normalize(50) }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 16, color: Colorpath.ButtonColr, fontWeight: "bold" }}>{`View All (${TransReducer?.speakerProfileResponse?.total_conferences})`}</Text>
                    </TouchableOpacity>}
                </ScrollView>
            </SafeAreaView>}
        </>
    )
}

export default SpeakerProfile