import { View, Text, Platform, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import PageHeader from '../../Components/PageHeader';
import IconDot from 'react-native-vector-icons/Feather';
import Search from 'react-native-vector-icons/AntDesign';
import Fonts from '../../Themes/Fonts';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { mainprofileRequest } from '../../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import Imagepath from '../../Themes/Imagepath';
import { SafeAreaView } from 'react-native-safe-area-context'

let status1 = "";
const EmpInfo = (props) => {
    const SearchBack = () => {
        props.navigation.goBack();
    }
    const [webcastview, setWebcastview] = useState(null);
    const [paginatedData, setPaginatedData] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const isFoucus = useIsFocused();
    const dispatch = useDispatch();
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    useEffect(() => {
        if (props?.route?.params?.EmpData?.employment?.length > 0) {
            const mainData = props?.route?.params?.EmpData?.employment;
            setWebcastview(mainData);
            setPaginatedData(mainData.slice(0, 5));
        }
    }, [props?.route?.params?.EmpData])
    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(mainprofileRequest({}))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }, [isFoucus])
    if (status1 == '' || DashboardReducer.status != status1) {
        switch (DashboardReducer.status) {
            case 'Dashboard/mainprofileRequest':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/mainprofileSuccess':
                status1 = DashboardReducer.status;
                const mainDataY = DashboardReducer?.mainprofileResponse?.employment;
                console.log(mainDataY, "pl----------")
                setWebcastview(mainDataY);
                setPaginatedData(mainDataY.slice(0, 5));
                console.log(DashboardReducer?.mainprofileResponse, "log-----------");
                break;
            case 'Dashboard/mainprofileFailure':
                status1 = DashboardReducer.status;
                break;
        }
    }
    const stateTakeItemEmp = ({ item, index }) => {
        function formatUSPhoneNumber(input) {
            // Remove all non-digit characters
            const digits = input.replace(/\D/g, '');

            // Format based on the number of digits
            if (digits.length <= 3) {
                return `(${digits}`;
            } else if (digits.length <= 6) {
                return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
            } else {
                return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
            }
        }
        return (
            <View>
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
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", alignSelf: 'flex-start', gap: 5 }}>
                            {item?.currently_held == 1 && <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), borderRadius: normalize(20), backgroundColor: "#c4eeff", marginTop: normalize(5) }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#666" }}>
                                    {"Current"}
                                </Text>
                            </View>}
                            {item?.emp_status && <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), borderRadius: normalize(20), backgroundColor: "#fee4be", marginTop: normalize(5) }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#666" }}>
                                    {item?.emp_status}
                                </Text>
                            </View>}
                            {item?.employment_type && <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), borderRadius: normalize(20), backgroundColor: Colorpath.ButtonColr, marginTop: normalize(5) }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#FFFFFF" }}>
                                    {item?.employment_type}
                                </Text>
                            </View>}
                        </View>
                        <View style={{ flex: 1, paddingVertical: normalize(10) }}>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: '100%'
                            }}>
                                <View style={{ flex: 1, marginRight: 10 }}>
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
                                        {item?.name}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => { props.navigation.navigate("AddEmpInfo", { editDats: item }); }} style={{ marginTop: normalize(-8) }}>
                                    <IconDot name="edit" size={22} color={"#848484"} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row",width:"87%",marginTop:normalize(5) }}>
                            {item?.state_name && <View style={{ flexDirection: "column" }}>
                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"State"}</Text>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>{item?.state_name}</Text>
                            </View>}
                            {item?.city_name && <View style={{ flexDirection: "column"}}>
                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"City"}</Text>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000",width:normalize(97)}}>{item?.city_name}</Text>
                            </View>}
                        </View>
                        <View style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row", width: "87%", paddingVertical: normalize(5) }}>
                            {item?.emp_status && <View style={{ flexDirection: "column" }}>
                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"Employment Status"}</Text>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>{item?.emp_status}</Text>
                            </View>}
                            {item?.contact_no && <View style={{ flexDirection: "column" }}>
                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"Phone Number"}</Text>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>{formatUSPhoneNumber(item?.contact_no)}</Text>
                            </View>}
                        </View>
                        <View style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row", width: "80%" }}>
                            {item?.from_date && <View style={{ flexDirection: "column" }}>
                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"From Date"}</Text>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>{item?.from_date}</Text>
                            </View>}
                            {item?.to_date && <View style={{ flexDirection: "column" }}>
                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"To Date"}</Text>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>{item?.to_date}</Text>
                            </View>}
                        </View>
                        {item?.allowance_limit && item?.employment_type == "Hospitalist" && <View style={{ justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column",marginTop:normalize(5) }}>
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"Annual CME Allowance Limit"}</Text>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>{`$${item?.allowance_limit}`}</Text>
                        </View>}
                        {item?.position_description && <View style={item?.allowance_limit && item?.position_description ?{ justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column",marginTop: normalize(10) }:{justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column"}}>
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"Position Description"}</Text>
                            <View style={{ flex: 1, marginRight: 10 }}>
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
                                    {item?.position_description}
                                </Text>
                            </View>
                        </View>}
                    </View>
                </View>
            </View>
        )
    }
    const loadMoreData = () => {
        if (loadingMore) return;
        if (paginatedData?.length < webcastview?.length) {
            setLoadingMore(true);
            const nextPage = page + 1;
            const itemsPerPage = 3;
            const newData = webcastview.slice(0, nextPage * itemsPerPage);
            setTimeout(() => {
                setPaginatedData(newData);
                setPage(nextPage);
                setLoadingMore(false);
            }, 1000);
        }
    };
    const renderFooter = () => {
        return loadingMore ? (
            <View style={{ paddingVertical: normalize(20) }}>
                <ActivityIndicator size="small" color={Colorpath.ButtonColr} />
            </View>
        ) : null;
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
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="Employment Information"
                            onBackPress={SearchBack}
                        />
                    ) : (
                        <PageHeader
                            title="Employment Information"
                            onBackPress={SearchBack}
                        />
                    )}
                </View>
                <View>
                    <Loader visible={DashboardReducer?.status == 'Dashboard/mainprofileRequest'} />
                    <FlatList
                        data={paginatedData}
                        renderItem={stateTakeItemEmp}
                        keyExtractor={(index, item) => index.toString()}
                        ListFooterComponent={renderFooter}
                        onEndReached={loadMoreData}
                        onEndReachedThreshold={0.5}
                        contentContainerStyle={{ paddingBottom: normalize(210) }}
                        ListEmptyComponent={
                            <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(25) }}>
                                <TouchableOpacity onPress={() => {
                                    props.navigation.navigate("AddEmpInfo", { profile: "text" });
                                }}
                                    style={{
                                        flexDirection: "row",
                                        // height: normalize(83),
                                        width: normalize(290),
                                        borderRadius: normalize(5),
                                        backgroundColor: "#FFFFFF",
                                        paddingHorizontal: normalize(10),
                                        paddingVertical: normalize(10),
                                        justifyContent: "center",
                                        borderStyle: 'dotted',
                                        borderWidth: 1,
                                        gap: normalize(5)
                                    }}
                                >
                                    <Image source={Imagepath.PlusNew} style={{height:normalize(24),width:normalize(24),resizeMode:"contain",tintColor:Colorpath.ButtonColr}}/>
                                    <View>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 22,
                                                color: Colorpath.ButtonColr,
                                                fontWeight: "bold",
                                                alignSelf: "center",
                                            }}
                                        >
                                            {"Add"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        } />
                </View>
                {paginatedData?.length > 0 && <View style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 0,
                    paddingHorizontal: normalize(20),
                    zIndex: 999
                }}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate("AddEmpInfo", { profile: "text" });
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
                        <Search name="plus" color={Colorpath.white} size={25} />
                    </TouchableOpacity>
                </View>}
            </SafeAreaView>
        </>
    )
}
export default EmpInfo