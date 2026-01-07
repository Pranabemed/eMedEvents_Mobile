import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, Platform, Alert, BackHandler } from 'react-native';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import IconDot from 'react-native-vector-icons/Entypo';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import { useSelector } from 'react-redux';
import CourseShimmer from '../../Components/CourseShimmer';
import { AppContext } from '../GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'

const CourseRelevant = (props) => {
    const { isConnected } = useContext(AppContext);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const [specalty, setSpecalty] = useState(null);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    console.log(AuthReducer, "helolo5555", props?.route?.params?.mainData?.state_data?.id, props?.route?.params?.mainData?.speciality_cources?.registered_cources);
    const courseRele = () => {
        props.navigation.goBack();
    }
    const stateActionCourse = (courserole) => {
        console.log(courserole, "courserole===============");
        if (courserole?.current_activity_api == "activitysession") {
            props?.navigation.navigate("VideoComponent", { RoleData: courserole });
        } else if (courserole?.current_activity_api == "introduction") {
            props?.navigation.navigate("StartTest", { conference: courserole?.id })
        } else if (courserole?.current_activity_api == "startTest") {
            props?.navigation.navigate("PreTest", { activityID: { activityID: courserole?.current_activity_id, conference_id: courserole?.id } });
        } else if (courserole?.button_display_text == "Add Credits") {
            props.navigation.navigate("AddCredits", { mainAdd: props?.route?.params?.mainData })
        }
    }
    useEffect(() => {
        const states = DashboardReducer?.mainprofileResponse?.specialities;
        if (states && typeof states == 'object' && Object.keys(states).length > 0) {
            const convertData = Object.entries(states).map(([key, val]) => ({ id: key, name: val }));
            setSpecalty(convertData);
        }
    }, [DashboardReducer]);
    const handleUrl = (did) => {
        const url = did?.detailpage_url;
        const result = url.split('/').pop();
        console.log(result, "webcast url=======", did);
        if (result) {
            props?.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result } })
        }
    }
    const registeredParams = props?.route?.params?.mainData?.speciality_cources?.registered_cources || [];
    const suggestedParams = props?.route?.params?.mainData?.speciality_cources?.suggested_cources || [];
    const totalParams = registeredParams.length + suggestedParams.length;
    const courserenderDataMain = ({ item, index }) => {
        const getActualPrice = (percent, discountPrice) => {
            let price = parseFloat((discountPrice || "0").toString().replace(/,/g, ""));
            return Math.round(price / (1 - percent));
        };

        let discount_percentage = parseFloat(item?.emed_commission) || 0;
        let actualPrice = getActualPrice(discount_percentage / 100, item?.display_price);
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
                                    flexShrink: 1,
                                    flexWrap: 'wrap',
                                    width: normalize(210)
                                }}
                            >
                                {item?.title}
                            </Text>
                            {/* <TouchableOpacity>
                                <IconDot name="dots-three-vertical" size={25} color={"#848484"} />
                            </TouchableOpacity> */}
                        </View>
                        {/* {item?.display_cme && <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), borderRadius: normalize(20), backgroundColor: "#FFF2E0", marginTop: normalize(10), alignSelf: 'flex-start' }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, fontWeight: "bold", color: "#666" }}>
                                {item?.display_cme}
                            </Text>
                        </View>} */}
                        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: normalize(10), width: normalize(270) }}>
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

                            {item?.display_cme && item?.eventType && (
                                <View style={{
                                    backgroundColor: Colorpath.ButtonColr,
                                    height: normalize(10),
                                    width: normalize(1),
                                    marginTop: normalize(13)
                                }} />
                            )}

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
                                {item?.display_price !== 0 ? (
                                    <>
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
                                                    paddingHorizontal: normalize(7),
                                                    textDecorationLine: "line-through",
                                                    fontStyle: "italic"
                                                }}
                                            >
                                                {`${item?.display_currency_code}${actualPrice}`}
                                            </Text>
                                        </View>
                                    </>
                                ) : (
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        {item?.display_price == 0 ? <></> : <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 18,
                                                color: "#000000",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {`${item?.display_currency_code}${item?.display_price}`}
                                        </Text>}
                                        {/* <Text
                                        style={{
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 14,
                                            color: "#999",
                                            paddingVertical: normalize(2),
                                            paddingHorizontal: normalize(10),
                                            textDecorationLine: "line-through"
                                        }}
                                    >
                                        {`${item?.display_currency_code} ${actualPrice}`}
                                    </Text> */}
                                    </View>
                                )}

                            </View>
                            <TouchableOpacity onPress={() => { handleUrl(item); }} style={{ height: normalize(30), width: normalize(80), borderRadius: normalize(5), justifyContent: "center", alignItems: "center", borderColor: Colorpath.ButtonColr, borderWidth: 0.5 }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16,
                                        color: "#2C4DB9",
                                        textTransform: "capitalize"
                                    }}
                                >
                                    {item?.buttonText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const registercourserenderDataMain = ({ item, index }) => {
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
                            {/* <TouchableOpacity>
                            <IconDot name="dots-three-vertical" size={25} color={"#848484"} />
                        </TouchableOpacity> */}
                        </View>
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
                            {item?.button_display_text ? <TouchableOpacity onPress={() => {
                                if (item?.buttonText === "Revise Course") {
                                    props.navigation.navigate("VideoComponent", { RoleData: item });
                                } else {
                                    stateActionCourse(item);
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
                            </TouchableOpacity> : null}
                        </View>
                    </View>
                </View>

            </View>
        )
    }
    useEffect(() => {
        const onBackPress = () => {
            courseRele();
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
    const earnedCreditsd = cleanNumber(props?.route?.params?.mainData?.state_data?.credits_data?.total_general_earned_credits);
    const totalCreditsd = cleanNumber(props?.route?.params?.mainData?.state_data?.credits_data?.total_general_credits);
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
                {Platform.OS == 'ios' ? <PageHeader
                    title="Courses relevant to your specia..."
                    onBackPress={courseRele}
                /> : <View>
                    <PageHeader
                        title="Courses relevant to your specia..."
                        onBackPress={courseRele}
                    />
                </View>}

                {conn == false ? <IntOff/> :<ScrollView>
                    {(earnedCreditsd === 0 && totalCreditsd === 0) ? null : <View>
                        <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    height: normalize(83),
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
                                        }}
                                    >
                                        {"Relevant to your primary area \nof practice or speciality"}
                                    </Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(10) }}>
                                        {(() => {
                                            const earnedCredits = cleanNumber(props?.route?.params?.mainData?.state_data?.credits_data?.total_general_earned_credits);
                                            const totalCredits = cleanNumber(props?.route?.params?.mainData?.state_data?.credits_data?.total_general_credits);

                                            // Don't render anything if both are zero
                                            if (earnedCredits === 0 && totalCredits === 0) {
                                                return null;
                                            }

                                            return (
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <View style={{
                                                        height: normalize(20),
                                                        width: normalize(80),
                                                        borderRadius: normalize(20),
                                                        backgroundColor: earnedCredits === totalCredits ? "#D6F9E2" : "#FFF2E0",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>
                                                        <Text style={{
                                                            fontFamily: Fonts.InterSemiBold,
                                                            fontSize: 14,
                                                            fontWeight: "bold",
                                                            color: "#000000"
                                                        }}>
                                                            {`${earnedCredits} / ${totalCredits}`}
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
                                            );
                                        })()}
                                        {props?.route?.params?.mainData?.state_data?.credits_data?.total_general_earned_credits < (+(props?.route?.params?.mainData?.state_data?.credits_data?.total_general_credits)) ? (<TouchableOpacity onPress={() => { props.navigation.navigate("AddCredits", { mainAdd: props?.route?.params?.mainData }) }}>
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
                    </View>}
                    {totalParams == 0 && <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <View
                            style={{
                                flexDirection: "row",
                                height: normalize(83),
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
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16,
                                        color: "#000000",
                                    }}
                                >
                                    {`Our catalog currently does not include course(s) on ${specalty && specalty.map((sd) => { return sd.name })}`}
                                </Text>

                            </View>
                        </View>
                    </View>}
                    {props?.route?.params?.mainData?.speciality_cources?.registered_cources?.length > 0 ? <>
                        <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                            <Text style={{ fontFamily: Fonts.InterBold, fontSize: 16, color: "#000000" }}>
                                {"Registered Specialty Courses"}
                            </Text>
                        </View>
                        <View>
                            {props?.route?.params?.mainData?.speciality_cources?.registered_cources?.length > 0 ? <FlatList
                                data={props?.route?.params?.mainData?.speciality_cources?.registered_cources}
                                renderItem={registercourserenderDataMain}
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
                                            fontSize: normalize(20),
                                            paddingTop: normalize(30),
                                            // textTransform: 'uppercase',
                                        }}>
                                        No data found
                                    </Text>
                                } /> : <>
                                <Text
                                    style={{
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        color: Colorpath.grey,
                                        fontWeight: 'bold',
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: normalize(20),
                                        paddingTop: normalize(30),
                                        // textTransform: 'uppercase',
                                    }}>
                                    No data found
                                </Text>
                            </>
                            }
                        </View>
                    </> : null}
                    {props?.route?.params?.mainData?.speciality_cources?.suggested_cources?.length > 0 ?
                        <>
                            <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 16, color: "#000000" }}>
                                    {"Suggested Specialty Courses"}
                                </Text>
                            </View>
                            <View>
                                {props?.route?.params?.mainData?.speciality_cources?.suggested_cources?.length > 0 ? <FlatList
                                    data={props?.route?.params?.mainData?.speciality_cources?.suggested_cources}
                                    renderItem={courserenderDataMain}
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
                                                fontSize: normalize(20),
                                                paddingTop: normalize(30),
                                                // textTransform: 'uppercase',
                                            }}>
                                            No data found
                                        </Text>
                                    } /> : <>
                                    <Text
                                        style={{
                                            alignContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            color: Colorpath.grey,
                                            fontWeight: 'bold',
                                            fontFamily: Fonts.InterMedium,
                                            fontSize: normalize(20),
                                            paddingTop: normalize(30),
                                            // textTransform: 'uppercase',
                                        }}>
                                        No data found
                                    </Text>
                                </>}

                            </View>
                        </> : null
                    }


                </ScrollView>}
            </SafeAreaView>
        </>
    )
}

export default CourseRelevant;