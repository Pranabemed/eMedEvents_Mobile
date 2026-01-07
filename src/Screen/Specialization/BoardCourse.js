import React, { useContext, useEffect, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, Platform } from 'react-native';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import IconDot from 'react-native-vector-icons/Entypo';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { stateDashboardRequest } from '../../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import CourseShimmer from '../../Components/CourseShimmer';
import { AppContext } from '../GlobalSupport/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
const BoardCourse = (props) => {
    const dispatch = useDispatch();
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    console.log(props?.route?.params?.FullData, "course=======", DashboardReducer)
    const boardCourseHandle = () => {
        props.navigation.goBack();
    }
    const {
        statepush,
        setStatepush
    } = useContext(AppContext);
    const fullAction = (dataItem) => {
        const url = dataItem?.detailpage_url;
        const result = url.split('/').pop();
        console.log(result, "webcast url=======", dataItem);
        if (dataItem?.current_activity_api == "activitysession") {
            props.navigation.navigate("VideoComponent", { RoleData: dataItem });
        } else if (dataItem?.current_activity_api == "introduction") {
            props.navigation.navigate("StartTest", { conference: dataItem?.id })
        } else if (dataItem?.current_activity_api == "startTest") {
            props.navigation.navigate("PreTest", { activityID: { activityID: dataItem?.current_activity_id, conference_id: dataItem?.id } })
        } else if (dataItem?.button_display_text == "Add Credits") {
            props.navigation.navigate("AddCredits", { mainAdd: props?.route?.params?.FullData })
        } else if (result) {
            props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: props?.route?.params?.FullData } })
        }
    }
    useEffect(() => {
        const boardCourse = () => {
            let obj = {
                "board_id": props?.route?.params?.FullData?.stateid,
                "compliance": 1
            }
            connectionrequest()
                .then(() => {
                    dispatch(stateDashboardRequest(obj))
                })
                .catch(err => { showErrorAlert("Please connect to internet", err) })
        }
        boardCourse();
    }, [props?.route?.params?.FullData])
    if (status == '' || DashboardReducer.status != status) {
        switch (DashboardReducer.status) {
            case 'Dashboard/stateDashboardRequest':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/stateDashboardSuccess':
                status = DashboardReducer.status;
                console.log(DashboardReducer?.stateDashboardResponse?.data?.speciality_cources?.suggested_cources, "stateDashboardRespons===========")
                // props.navigation.navigate("Login");
                break;
            case 'Dashboard/stateDashboardFailure':
                status = DashboardReducer.status;
                break;
        }
    }
    const courserenderDataBoard = ({ item, index }) => {
        return (
            <View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                    <View
                        style={{
                            flexDirection: "column", // Changed to column to allow vertical expansion
                            width: normalize(290),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            alignItems: "flex-start",  // Align all children to the top
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                                <Text numberOfLines={2}
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 16,
                                        color: "#000000",
                                        fontWeight: "bold",
                                        flex: 1,
                                        flexWrap: 'wrap',  // Allow text to wrap
                                    }}
                                >
                                    {item?.title}
                                </Text>
                            </View>
                            {item?.display_cme ? <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), borderRadius: normalize(20), backgroundColor: "#FFF2E0", marginTop: normalize(10), alignSelf: 'flex-start' }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, fontWeight: "bold", color: "#666" }}>
                                    {item?.display_cme}
                                </Text>
                            </View> : null}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(10), width: '100%' }}>
                                <View style={{ flexDirection: "column" }}>
                                    {item?.display_price === "FREE" ? null : <View style={{ paddingVertical: normalize(0) }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterMedium,
                                                fontSize: 14,
                                                color: "#000000",
                                            }}
                                        >
                                            {item?.display_currency_code ? item?.display_currency_code : item?.display_currency_code}
                                        </Text>
                                    </View>}

                                    <View style={{ paddingVertical: normalize(5) }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 18,
                                                color: item?.display_price === "FREE" ? Colorpath.ButtonColr : "#000000",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {item?.display_price === "FREE"
                                                ? "FREE"
                                                : item?.display_price
                                                    ? `${item.display_price}.00`
                                                    : ""}

                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    setStatepush(props?.route?.params?.FullData);
                                     fullAction(item);
                                      }} style={{ height: normalize(30), width: normalize(100), borderRadius: normalize(5), justifyContent: "center", alignItems: "center", borderColor: Colorpath.ButtonColr, borderWidth: 0.5 }}>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterMedium,
                                            fontSize: 16,
                                            color: "#2C4DB9",
                                            textTransform: "uppercase"
                                        }}
                                    >
                                        {item?.buttonText}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>


            </View>
        )
    }

    const registercourserenderDataBoard = ({ item, index }) => {
        console.log(item, "item--------")
        return (
            <View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                    <View
                        style={{
                            flexDirection: "column", // Changed to column to allow vertical expansion
                            width: normalize(290),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            alignItems: "flex-start",  // Align all children to the top
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                                <Text numberOfLines={2}
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 16,
                                        color: "#000000",
                                        fontWeight: "bold",
                                        flex: 1,
                                        flexWrap: 'wrap',  // Allow text to wrap
                                    }}
                                >
                                    {item?.title}
                                </Text>
                            </View>
                            <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), borderRadius: normalize(20), backgroundColor: "#FFF2E0", marginTop: normalize(10), alignSelf: 'flex-start' }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, fontWeight: "bold", color: "#666" }}>
                                    {item?.display_cme}
                                </Text>
                            </View>
                            {item?.buttonText == "Registered" ? <></> : <>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(10), width: '100%' }}>
                                    <View style={{ flexDirection: "column" }}>
                                        {item?.display_price === "FREE" ? null : <View style={{ paddingVertical: normalize(0) }}>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterMedium,
                                                    fontSize: 14,
                                                    color: "#000000",
                                                }}
                                            >
                                                {item?.display_currency_code ? item?.display_currency_code : item?.display_currency_code}
                                            </Text>
                                        </View>}

                                        <View style={{ paddingVertical: normalize(5) }}>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterSemiBold,
                                                    fontSize: 18,
                                                    color: item?.display_price === "FREE" ? Colorpath.ButtonColr : "#000000",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {item?.display_price === "FREE"
                                                    ? "FREE"
                                                    : item?.display_price
                                                        ? `${item.display_price}.00`
                                                        : ""}

                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => { fullAction(item) }} style={{ height: normalize(30), width: normalize(100), borderRadius: normalize(5), justifyContent: "center", alignItems: "center", borderColor: Colorpath.ButtonColr, borderWidth: 0.5 }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterMedium,
                                                fontSize: 16,
                                                color: "#2C4DB9",
                                                textTransform: "uppercase"
                                            }}
                                        >
                                            {item?.buttonText}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>}

                        </View>
                    </View>
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
                {Platform.OS === 'ios' ? <PageHeader
                    title="Courses relevant to your specia..."
                    onBackPress={boardCourseHandle}
                /> : <View>
                    <PageHeader
                        title="Courses relevant to your specia..."
                        onBackPress={boardCourseHandle}
                    />
                </View>}

                <ScrollView contentContainerStyle={{ paddingBottom: normalize(50) }}>
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
                                        }}
                                    >
                                        {"Relevant to your primary area \nof practice or speciality"}
                                    </Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(10) }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <View style={{ height: normalize(20), width: normalize(80), borderRadius: normalize(20), backgroundColor: "#FFF2E0", justifyContent: "center", alignItems: "center" }}>
                                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#000000" }}>
                                                    {`${(props?.route?.params?.FullData?.creditfirst)} / ${(props?.route?.params?.FullData?.creditsec)} `}
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
                                        <TouchableOpacity onPress={() => { props.navigation.navigate("AddCredits", { FullBoard: props?.route?.params?.FullData }) }}>
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
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {DashboardReducer?.stateDashboardResponse?.data?.speciality_cources?.registered_cources?.length > 0 ?
                        <>
                            {DashboardReducer?.stateDashboardResponse?.data?.speciality_cources?.registered_cources?.length > 0 &&
                                DashboardReducer?.stateDashboardResponse?.data?.speciality_cources?.registered_cources?.length > 0 ? <View style={{ paddingHorizontal: normalize(17), paddingVertical: normalize(10) }}>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000" }}>
                                    {"Registered Specialty Courses"}
                                </Text>
                            </View> : <></>}
                            <View>
                                {DashboardReducer?.stateDashboardResponse?.data?.speciality_cources?.registered_cources?.length > 0 ? <FlatList
                                    data={DashboardReducer?.stateDashboardResponse?.data?.speciality_cources?.registered_cources}
                                    renderItem={registercourserenderDataBoard}
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
                                    } /> : <></>}

                            </View>
                        </> : null
                    }
                    {DashboardReducer?.stateDashboardResponse?.data?.speciality_cources?.suggested_cources?.length > 0 ? <>
                        {DashboardReducer?.stateDashboardResponse?.data?.speciality_cources?.suggested_cources?.length > 0 &&
                            DashboardReducer?.stateDashboardResponse?.data?.speciality_cources?.suggested_cources?.length > 0 ? <View style={{ paddingHorizontal: normalize(18), paddingVertical: normalize(10) }}>
                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000" }}>
                                {"Suggested Specialty Courses"}
                            </Text>
                        </View> : <></>}

                        <View>
                            {DashboardReducer?.stateDashboardResponse?.data?.speciality_cources?.suggested_cources?.length > 0 ? <FlatList
                                data={DashboardReducer?.stateDashboardResponse?.data?.speciality_cources?.suggested_cources}
                                renderItem={courserenderDataBoard}
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
                                } /> : <></>}
                        </View>
                    </> : null}



                    {DashboardReducer?.stateDashboardResponse?.data?.speciality_cources?.suggested_cources?.length === 0 &&
                        DashboardReducer?.stateDashboardResponse?.data?.speciality_cources?.registered_cources?.length === 0 && (
                            <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(5) }}>
                                <View
                                    style={{
                                        flexDirection: "row",
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
                                                paddingVertical: 10,
                                            }}
                                        >
                                            {"Our catalog currently does not include course(s) on Abdominal Radiology, Addiction Medicine, Aesthetic Medicine, Age Management Medicine."}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default BoardCourse
