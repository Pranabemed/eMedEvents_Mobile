import { View, Text, Platform, FlatList, TouchableOpacity, ActivityIndicator, Image, BackHandler } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import PageHeader from '../../Components/PageHeader';
import IconDot from 'react-native-vector-icons/Entypo';
import Search from 'react-native-vector-icons/AntDesign';
import Fonts from '../../Themes/Fonts';
import ProfileModal from './ProfileModal';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { stateLicenseListRequest } from '../../Redux/Reducers/ProfileReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import moment from 'moment';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import { AppContext } from '../GlobalSupport/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { dashboardRequest } from '../../Redux/Reducers/DashboardReducer';
import { licesensRequest } from '../../Redux/Reducers/AuthReducer';
import Imagepath from '../../Themes/Imagepath';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'

let status = "";
let status2 = "";
let status3 = "";
const StateProfile = (props) => {
    const {
        stateCount,
        pushnew,
        isConnected
      } = useContext(AppContext);
    const SearchBack = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: "TabNav",
                        params: { initialRoute: "Profiles" }
                    }
                ]
            })
        );
    }
     const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const [profiletakeshow, setProfiletakeshow] = useState(false);
    const ProfileReducer = useSelector(state => state.ProfileReducer);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const [webcastviewpr, setWebcastviewpr] = useState(null);
    const [paginatedDatapr, setPaginatedDatapr] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [detectdata, setDetectdata] = useState("");
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    console.log(props?.route?.params?.state, "props?.route?.params?.state======",pushnew);
    const [finalverifyvaultpr, setFinalverifyvaultpr] = useState(null);
    const [finalProfessionpr, setFinalProfessionpr] = useState(null);
    const [fetcheddtpr, setFetchdtpr] = useState(null);
    const [stateCountpr, setStateCountpr] = useState(null);
    const [ticktry, setTicktry] = useState(false);
    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(dashboardRequest({}))
            })
            .catch(err => {
                showErrorAlert("Please connect to internet", err)
            })

    }, [isFocus, ticktry]);
    useEffect(() => {
        const token_handle_vault = () => {
            setTimeout(async () => {
                try {
                    const [board_special, profession_data] = await Promise.all([
                        AsyncStorage.getItem(constants.VERIFYSTATEDATA),
                        AsyncStorage.getItem(constants.PROFESSION)
                    ]);
                    const board_special_json = board_special ? JSON.parse(board_special) : null;
                    const profession_data_json = profession_data ? JSON.parse(profession_data) : null;
                    setFinalverifyvaultpr(board_special_json);
                    setFinalProfessionpr(profession_data_json);
                    console.log(board_special_json, "statelicesene=================");
                    console.log(profession_data_json, "profession=================");
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            }, 100);
        };

        token_handle_vault();
    }, [isFocus, ticktry]);
    const [allProfessionpr, setAllProfessionpr] = useState(null);

    useEffect(() => {
        const professionDataProf =
            AuthReducer?.loginResponse?.user ||
            AuthReducer?.againloginsiginResponse?.user ||
            AuthReducer?.verifymobileResponse?.user ||
            finalverifyvaultpr ||
            finalProfessionpr;
        setAllProfessionpr(professionDataProf);
    }, [
        AuthReducer?.loginResponse?.user,
        AuthReducer?.againloginsiginResponse?.user,
        AuthReducer?.verifymobileResponse?.user,
        finalverifyvaultpr,
        finalProfessionpr,
        isFocus,
        ticktry
    ]);
    useEffect(() => {
        if (props?.route?.params?.state) {
            connectionrequest()
                .then(() => {
                    dispatch(stateLicenseListRequest({}))
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
    }, [props?.route?.params?.state])
    if (status == '' || ProfileReducer.status != status) {
        switch (ProfileReducer.status) {
            case 'Profile/stateLicenseListRequest':
                status = ProfileReducer.status;
                break;
            case 'Profile/stateLicenseListSuccess':
                status = ProfileReducer.status;
                console.log(ProfileReducer?.stateLicenseListResponse?.licensures, "log-----------");
                if (ProfileReducer?.stateLicenseListResponse?.licensures?.length > 0) {
                    const uniqueStatesFinal = ProfileReducer?.stateLicenseListResponse?.licensures?.filter((state, index, self) =>
                        index === self.findIndex((s) => s.id === state.id)
                    );
                    const fullData = uniqueStatesFinal;
                    const sortedData = [...fullData].sort((a, b) =>
                        a.state_name.localeCompare(b.state_name)
                    );
                    setWebcastviewpr(sortedData);
                    setPaginatedDatapr(sortedData.slice(0, 5));
                }
                break;
            case 'Profile/stateLicenseListFailure':
                status = ProfileReducer.status;
                break;

        }
    }
    if (status2 == '' || DashboardReducer.status != status2) {
        switch (DashboardReducer.status) {
            case 'Dashboard/dashboardRequest':
                status2 = DashboardReducer.status;
                break;
            case 'Dashboard/dashboardSuccess':
                status2 = DashboardReducer.status;
                setFetchdtpr(DashboardReducer?.dashboardResponse?.data?.licensures);
                break;
            case 'Dashboard/dashboardFailure':
                status2 = DashboardReducer.status;
                break;
        }
    }
    useEffect(() => {
        const onBackPress = () => {
            SearchBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    const loadMoreData = () => {
        if (loadingMore) return;
        if (paginatedDatapr?.length < webcastviewpr?.length) {
            setLoadingMore(true);
            const nextPage = page + 1;
            const itemsPerPage = 5;
            const newData = webcastviewpr.slice(0, nextPage * itemsPerPage);
            setTimeout(() => {
                setPaginatedDatapr(newData);
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
    const stateProfileget = ({ item, index }) => {
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
                            borderWidth: 0.8,
                            borderColor: "#DADADA"
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
                                width: '100%'
                            }}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <TouchableOpacity>
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
                                            {item?.board_name}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    setDetectdata(item);
                                    setProfiletakeshow(!profiletakeshow);
                                }} style={{ marginTop: normalize(-8) }}>
                                    <IconDot name="dots-three-vertical" size={22} color={"#848484"} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ height: 0.8, width: normalize(273), backgroundColor: "#DADADA", marginTop: normalize(5) }} />
                        <View style={{ justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column", marginTop: normalize(5) }}>
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"License Number"}</Text>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000", textTransform: "uppercase" }}>{item?.license_number}</Text>
                        </View>
                        <View style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row", width: "70%", marginTop: normalize(6) }}>
                            {item?.to_date && item?.to_date == "0000-00-00" ? (<View style={{ flexDirection: "column" }}>
                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"Expiry Date & Expiry Year"}</Text>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: item?.to_date && item?.to_date !== "0000-00-00" ? "#000000" : "red" }}>{item?.to_date && item?.to_date !== "0000-00-00" ? moment(item?.to_date, "YYYY-MM-DD").format("DD MMM") : "Update license info"}</Text>
                            </View>) : <>
                                {item?.to_date && <View style={{ flexDirection: "column" }}>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"Expiry Date"}</Text>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: item?.to_date && item?.to_date !== "0000-00-00" ? "#000000" : "red" }}>{item?.to_date && item?.to_date !== "0000-00-00" ? moment(item?.to_date, "YYYY-MM-DD").format("DD MMM") : "Update license info"}</Text>
                                </View>}
                                {item?.to_date && <View style={{ flexDirection: "column" }}>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"Expiry Year"}</Text>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: item?.to_date && item?.to_date !== "0000-00-00" ? "#000000" : "red" }}>{item?.to_date && item?.to_date !== "0000-00-00" ? moment(item?.to_date, "YYYY-MM-DD").format("YYYY") : "Update license info"}</Text>
                                </View>}
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
            {conn == false ? <IntOff/>: <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="State Licenses"
                            onBackPress={SearchBack}
                        />
                    ) : (
                        <PageHeader
                            title="State Licenses"
                            onBackPress={SearchBack}
                        />
                    )}
                </View>
                <Loader visible={ProfileReducer?.status == 'Profile/stateLicenseListRequest'} />
                <View>
                    <FlatList
                        data={paginatedDatapr}
                        renderItem={stateProfileget}
                        keyExtractor={(item, index) => item.id || index.toString()}
                        ListFooterComponent={renderFooter}
                        onEndReached={loadMoreData}
                        onEndReachedThreshold={0.5}
                        contentContainerStyle={{ paddingBottom: normalize(190) }}
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
                                            {"No Data Found"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        } />
                </View>
                {stateCount?.length > 0 &&! pushnew && <View style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 0,
                    paddingHorizontal: normalize(20),
                    zIndex: 999
                }}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate("AddLicense", { profile: "text" });
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
                        <Search style={{ alignSelf: "center" }} name="plus" color={Colorpath.white} size={25} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={()=>props.navigation.navigate("AddLicense",{profile:"text"})}>
                    <Image source={Imagepath.PlusNew} style={{height:normalize(55),width:normalize(55),resizeMode:"contain",tintColor:Colorpath.ButtonColr}}/>
                    </TouchableOpacity> */}
                </View>}
            </SafeAreaView>}
            <ProfileModal setTicktry={setTicktry} main={ProfileReducer?.stateLicenseListResponse?.lisensure_file_path} setPaginatedData={setPaginatedDatapr} paginatedData={paginatedDatapr} nav={props.navigation} detectdata={detectdata} setProfiletakeshow={setProfiletakeshow} profiletakeshow={profiletakeshow} />
        </>
    )
}
export default StateProfile