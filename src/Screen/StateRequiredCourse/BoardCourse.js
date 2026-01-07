import { View, Text, Platform, TouchableOpacity, Image, FlatList, ScrollView, ImageBackground, StyleSheet, Alert, BackHandler } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import PageHeader from '../../Components/PageHeader'
import Colorpath from '../../Themes/Colorpath'
import MyStatusBar from '../../Utils/MyStatusBar'
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts'
import Imagepath from '../../Themes/Imagepath';
import IconDot from 'react-native-vector-icons/Entypo';
import FilterModal from '../../Components/Filter';
import CloseIcon from 'react-native-vector-icons/EvilIcons';
import { CommonActions, useNavigation } from '@react-navigation/native'
import { AirbnbRating } from 'react-native-ratings'
import { useDispatch, useSelector } from 'react-redux'
import { object } from 'prop-types'
import connectionrequest from '../../Utils/Helpers/NetInfo'
import { stateDashboardRequest } from '../../Redux/Reducers/DashboardReducer'
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader'
import Tooltip from 'react-native-walkthrough-tooltip'
import { AppContext } from '../GlobalSupport/AppContext'
import DrawerModal from '../../Components/DrawerModal';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff'
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
const BoardCourseSlide = (props) => {
    const { takestate, addit, isConnected, fulldashbaord, setAddit } = useContext(AppContext);
    const [visible, setVisible] = useState(false);
    const [nodata, setNodata] = useState("drawerclose");
    const [filtermodal, setFiltermodal] = useState(false);
    const [filterName, setFilterName] = useState("");
    const [acivityformat, setAcivityformat] = useState("");
    const [filtermonth, setFiltermonth] = useState("");
    const [stateFiltered, setStateFiltered] = useState([]);
    const [activity, setActivity] = useState([]);
    const [month, setMonth] = useState([]);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [tooltip, setTootip] = useState(false);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    console.log(DashboardReducer?.dashboardResponse?.data?.boards, "finaltake------------------", takestate, addit);
    const [filterstate, setFilterstate] = useState(null);
    const [finalData, setFinalData] = useState("");
    const [stateid, setStateid] = useState("");
    const [handle, setHandle] = useState(null);
    const [servetextbr, setServetextbr] = useState(false);
    const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
    const authHigh = AuthReducer?.loginResponse?.user?.profession != null &&
        AuthReducer?.loginResponse?.user?.profession_type != null
        ? `${AuthReducer?.loginResponse?.user?.profession} - ${AuthReducer?.loginResponse?.user?.profession_typ}`
        : null;
    const profFromDashboard =
        DashboardReducer?.mainprofileResponse?.professional_information?.profession != null &&
            DashboardReducer?.mainprofileResponse?.professional_information?.profession_type != null
            ? `${DashboardReducer?.mainprofileResponse?.professional_information?.profession} - ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type}`
            : null;
    const allProfTake = validHandles.has(authHigh) || validHandles.has(profFromDashboard);
    console.log(finalData?.length, "handle=======", finalData)
    const openFilterModal = () => {
        setFiltermodal(!filtermodal);
    }
    const toggleDrawerModal = () => {
        setVisible(!visible);
        setNodata("drawerclose");
    };
    const addCreditBack = () => {
        const getAda = fulldashbaord?.[0];
        setAddit(getAda);
        toggleDrawerModal();
    }
    const handleSave = () => {
        console.log("Selected Filter Name: ", filterName);
        setFiltermodal(false);
    };
    console.log(filterName, "jdjfjjjj")
    useEffect(() => {
        const states = DashboardReducer?.dashboardResponse?.data?.boards;
        if (states && typeof states === 'object' && Object.keys(states).length > 0) {
            const convertData = Object.entries(states).map(([key, val]) => ({ id: key, name: val }));
            setFilterstate(convertData);
        }
    }, [DashboardReducer]);
    const titlhandleUrl = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = urltitle.split('/').pop();
        console.log(resulttitle, "webcast url=======", make);
        if (resulttitle) {
            props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, creditData: addit } })
        }
    }
    useEffect(() => {
        if (stateid) {
            stateDashboardData();
        }
    }, [stateid])
    const stateDashboardData = () => {
        let obj = {
            "board_id": stateid
        }
        connectionrequest()
            .then(() => {
                dispatch(stateDashboardRequest(obj));
            })
            .catch(err => { showErrorAlert("Please connect to internet", err) })
    }
    if (status == '' || DashboardReducer.status != status) {
        switch (DashboardReducer.status) {
            case 'Dashboard/stateDashboardRequest':
                status = DashboardReducer.status;
                setServetextbr(false);
                break;
            case 'Dashboard/stateDashboardSuccess':
                status = DashboardReducer.status;
                setServetextbr(true);
                setFinalData(DashboardReducer?.stateDashboardResponse?.data?.board_recommendations);
                console.log(DashboardReducer?.stateDashboardResponse?.data?.board_recommendations, "stateDashboardRespons===========")
                break;
            case 'Dashboard/stateDashboardFailure':
                status = DashboardReducer.status;
                setServetextbr(true);
                break;
        }
    }
    useEffect(() => {
        const onBackPress = () => {
            addCreditBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    const RequiredCourses = ({ item, index }) => {
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
                            alignItems: "flex-start",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.2,
                            shadowRadius: 2,
                            elevation: 3
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                                <TouchableOpacity onPress={() => { titlhandleUrl(item) }}>
                                    <Text
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
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={{ marginTop: normalize(-8) }}>
                  <IconDot name="dots-three-vertical" size={25} color={"#848484"} />
                </TouchableOpacity> */}
                            </View>
                            <View style={{ flexDirection: "row", marginTop: normalize(10), alignItems: "center" }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#666", fontWeight: "bold", marginRight: normalize(5) }}>
                                    {"Ratings:"}
                                </Text>
                                <AirbnbRating
                                    count={5}
                                    reviews={[]}
                                    defaultRating={item?.average_rating}
                                    size={15}
                                    showRating={false}
                                    isDisabled={true}
                                />
                            </View>
                            {Array.isArray(item?.cme_points_popovar) && item?.cme_points_popovar?.length > 0 ? (
                                <TouchableOpacity onPress={() => {
                                    setTootip(!tooltip);
                                    setHandle(item);
                                }}>
                                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), borderRadius: normalize(20), backgroundColor: "#FFF2E0", marginTop: normalize(10), alignSelf: 'flex-start' }}>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#666" }}>
                                            {`${item?.display_cme}...`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ) : item?.display_cme && (
                                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), borderRadius: normalize(20), backgroundColor: "#FFF2E0", marginTop: normalize(10), alignSelf: 'flex-start' }}>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#666" }}>
                                        {`${item?.display_cme
                                            ? item?.display_cme?.toLowerCase()?.includes("contact hour")
                                                ? item?.display_cme.replace(/contact hour/i, "Contact Hour(s)")
                                                : item?.display_cme
                                            : ""
                                            }`}
                                    </Text>
                                </View>
                            )}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(10), width: '100%' }}>
                                <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                                    {item?.display_price == "FREE" ? (
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterSemiBold,
                                                    fontSize: 18,
                                                    color: "#000000",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {"FREE"}
                                            </Text>
                                        </View>
                                    ) : (
                                        <>
                                            <View style={{ alignItems: "center" }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterSemiBold,
                                                        fontSize: 18,
                                                        color: "#000000",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {` ${item?.display_currency_code}${item?.display_price}`}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                </View>
                                {item?.buttonText && <TouchableOpacity onPress={() => { titlhandleUrl(item) }} style={{ height: normalize(30), width: normalize(80), borderRadius: normalize(5), justifyContent: "center", alignItems: "center", borderColor: Colorpath.ButtonColr, borderWidth: 0.5 }}>
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
                                </TouchableOpacity>}
                            </View>
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
                <Loader visible={DashboardReducer?.status == 'Dashboard/stateDashboardRequest'} />

                {Platform.OS === 'ios' ? <PageHeader
                    title="Board Review Courses"
                    onBackPress={addCreditBack}
                /> : <View>
                    <PageHeader
                        title="Board Review Courses"
                        onBackPress={addCreditBack}
                    />
                </View>}
                {conn == false ? <IntOff /> : <ScrollView contentContainerStyle={{ paddingBottom: normalize(50) }}>
                    {filterstate?.length > 0 && <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", paddingHorizontal: normalize(8), paddingVertical: normalize(10) }}>
                            {!filterName ? <View>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: "#000000" }}>
                                    {"Filters"}
                                </Text>
                            </View> : <>
                                <View
                                    style={{
                                        paddingHorizontal: normalize(10),
                                        paddingVertical: normalize(8),
                                        borderWidth: 0.5,
                                        borderColor: "#000000",
                                        borderRadius: normalize(25),
                                        backgroundColor: "#FFFFFF",
                                        alignSelf: 'flex-start',
                                        flexDirection: "row"
                                    }}
                                >
                                    <Text numberOfLines={1} style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#000000", width: normalize(250) }}>
                                        {filterName ? filterName : filterName}
                                    </Text>
                                    {/* <View style={{ marginLeft: normalize(10), marginBottom: normalize(4) }}>
                    {filterName && <CloseIcon name="close" size={22} color={"#000000"} />}
                  </View> */}
                                </View>
                            </>}

                            {filterstate?.length > 1 && <TouchableOpacity onPress={openFilterModal}>
                                <Image source={Imagepath.Filter} style={{ height: normalize(20), width: normalize(20), resizeMode: "contain", marginTop: normalize(6) }} />
                            </TouchableOpacity>}
                        </View>
                    </View>}
                    {filterstate?.length > 0 && <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10), justifyContent: "center", alignItems: "center" }}>
                        <View style={{ height: 0.8, width: normalize(300), backgroundColor: "#CCC" }} />
                    </View>}
                    {finalData?.length > 0 && <View style={{ paddingHorizontal: normalize(9), paddingVertical: normalize(5), marginLeft: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: "#000000" }}>
                            {`${filterName} - Board Review Courses`}
                        </Text>
                    </View>}
                    <View>
                        {filterstate?.length > 0 ? <FlatList
                            data={finalData}
                            renderItem={RequiredCourses}
                            keyExtractor={(item, index) => index.toString()}
                            // contentContainerStyle={{ paddingBottom: normalize(170) }}
                            ListEmptyComponent={servetextbr &&
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <View style={{
                                        height: normalize(30),
                                        width: normalize(310),
                                        alignItems: 'center',
                                        borderStyle: 'dotted',
                                        borderWidth: 1,
                                        borderRadius: 1,
                                        borderColor: "#000000",
                                        backgroundColor: "#FFFFFF"
                                    }}>
                                        <Text
                                            style={{
                                                alignContent: 'center',
                                                alignItems: 'center',
                                                alignSelf: 'center',
                                                color: "#AAAAAA",
                                                fontWeight: 'bold',
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 18,
                                                paddingTop: normalize(5),
                                                paddingHorizontal: normalize(10)
                                                // textTransform: 'uppercase',
                                            }}>
                                            {"No courses found!"}
                                        </Text>
                                    </View>
                                </View>

                            } /> : !allProfTake ? <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(20) }}>
                                <View style={{
                                    height: normalize(30),
                                    width: normalize(310),
                                    alignItems: 'center',
                                    borderStyle: 'dotted',
                                    borderWidth: 1,
                                    borderRadius: 1,
                                    borderColor: "#000000",
                                    backgroundColor: "#FFFFFF"
                                }}>
                                    <Text
                                        style={{
                                            alignContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            color: "#AAAAAA",
                                            fontWeight: 'bold',
                                            fontFamily: Fonts.InterSemiBold,
                                            fontSize: 18,
                                            paddingTop: normalize(5),
                                            paddingHorizontal: normalize(10)
                                            // textTransform: 'uppercase',
                                        }}>
                                        {"No courses found!"}
                                    </Text>
                                </View>
                            </View> : <View style={stylefalse.containercontex}>
                            <View style={stylefalse.parentCardex}>
                                <View style={stylefalse.innerCardex}>
                                    <View style={stylefalse.iconContainerex}>
                                        <Image
                                            source={Imagepath.Docment}
                                            style={stylefalse.iconex}
                                        />
                                    </View>
                                    <View style={stylefalse.textContainerex}>
                                        <View style={stylefalse.headerRowex}>
                                            <Text style={stylefalse.titleex}>{"Keep track of all Board Certifications"}</Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => { props.navigation.navigate("AddCertificate") }}>
                                    <View style={stylefalse.innerCardex}>
                                        <View style={stylefalse.iconContainerex}>
                                            <Image
                                                source={Imagepath.Crown}
                                                style={stylefalse.iconex}
                                            />
                                        </View>
                                        <View style={stylefalse.textContainerex}>
                                            <View style={stylefalse.headerRowex}>
                                                <Text style={stylefalse.titleex}>{"Add your board certification(s)"}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>}


                    </View>
                    <Tooltip
                        isVisible={tooltip}
                        content={
                            <View style={{ flexGrow: 1, width: normalize(260) }}>
                                {handle?.cme_points_popovar?.length > 0 ? (
                                    handle?.cme_points_popovar?.map((d, index) => (
                                        <Text
                                            key={index}
                                            style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#000" }}
                                        >
                                            {`${parseFloat(d?.points) || 0} ${d?.name &&
                                                d?.name?.toLowerCase() == "contact hour"
                                                ? "Contact Hour(s)"
                                                : d?.name || ""
                                                }`}
                                        </Text>
                                    ))
                                ) : null}
                            </View>
                        }
                        placement="center"
                        onClose={() => setTootip(false)}
                    >
                    </Tooltip>
                    <FilterModal
                        isfilterVisible={filtermodal}
                        onfilterFalse={openFilterModal}
                        filterName={filterName}
                        setFilterName={setFilterName}
                        setStateid={setStateid}
                        stateid={stateid}
                        setAcivityformat={setAcivityformat}
                        acivityformat={acivityformat}
                        setFiltermonth={setFiltermonth}
                        filtermonth={filtermonth}
                        stateFiltered={stateFiltered}
                        setStateFiltered={setStateFiltered}
                        activity={activity}
                        setActivity={setActivity}
                        month={month}
                        setMonth={setMonth}
                        onSave={handleSave}
                        filterState={filterstate}
                        board={"text"}
                    />
                </ScrollView>}
            </SafeAreaView>
            <DrawerModal
                handel={nodata}
                isVisible={visible}
                onBackdropPress={() => setVisible(!visible)}
                onRequestClose={() => setVisible(false)}
                backButton={() => setVisible(!visible)}
                rentalNavigate={() => setVisible(!visible)}
                watchlistNavigate={() => setVisible(!visible)}
                subscribeNavigate={() => setVisible(!visible)}
                rewardNavigate={() => setVisible(!visible)}
                homeNavigate={() => setVisible(!visible)}
                expensesNav={() => setVisible(!visible)}
                interestedNav={() => setVisible(!visible)}
                drawerPress={() => setVisible(!visible)}
            />
        </>
    )
}

export default BoardCourseSlide
const stylefalse = StyleSheet.create({
    containercontex: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: normalize(10)
    },
    parentCardex: {
        width: normalize(290),
        borderRadius: normalize(10),
        backgroundColor: '#FFFFFF',
        padding: normalize(10),
        shadowColor: '#c3e9ff',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0.1,
        elevation: 5,
        marginBottom: normalize(10),
    },
    innerCardex: {
        flexDirection: 'row',
        height: normalize(60),
        borderRadius: normalize(10),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10),
        alignItems: 'center',
        marginBottom: normalize(10),
        borderWidth: 0.5,
        borderColor: "#AAAAAA"
    },
    iconContainerex: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(10),
    },
    iconex: {
        height: normalize(35),
        width: normalize(35),
        resizeMode: 'contain',
    },
    textContainerex: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRowex: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleex: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
    crownIconex: {
        marginLeft: normalize(5),
        height: normalize(15),
        width: normalize(15),
        resizeMode: 'contain',
    },
    infoRowex: {
        flexDirection: 'row',
        marginTop: normalize(5),
    },
    infoTextex: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#999',
        fontWeight: 'bold',
    },
    infoCountex: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#000000',
        fontWeight: 'bold',
        paddingHorizontal: normalize(5),
    },
    infoButtonex: {
        position: 'absolute',
        top: 0,
        right: 25,
    },
    infoIconex: {
        height: normalize(18),
        width: normalize(18),
        resizeMode: 'contain',
    },
})