import { View, Text, Platform, FlatList, TouchableOpacity, BackHandler, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
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
import { boardListProfileRequest } from '../../Redux/Reducers/ProfileReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import { boardSpecialityRequest, dashboardRequest, mainprofileRequest } from '../../Redux/Reducers/DashboardReducer';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { AppContext } from '../GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'

let status = "";
let status2 = "";
const BoardProfile = (props) => {
     const {
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
    const [profiletakeshow, setProfiletakeshow] = useState(false);
    const ProfileReducer = useSelector(state => state.ProfileReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const [webcastview, setWebcastview] = useState(null);
    const [paginatedData, setPaginatedData] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [detectdata, setDetectdata] = useState("");
    const [boardscount, setBoardscount] = useState("");
    const [boardtake, setBoardtake] = useState("");
    const [totalboardname, setTotalboardname] = useState([]);
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    console.log(props?.route?.params?.board, "props?.route?.params?.state======", DashboardReducer?.mainprofileResponse?.professional_information);
    useEffect(() => {
        boardCheck();
        connectionrequest()
            .then(() => {
                dispatch(boardListProfileRequest({}));
                dispatch(mainprofileRequest({}))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }, [props?.route?.params?.board, isFocus, profiletakeshow])
     const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const boardCheck = () => {
        const takeSpecial = Object.keys(DashboardReducer?.mainprofileResponse?.specialities).join(", ");
        let obj = {
            "profession": DashboardReducer?.mainprofileResponse?.professional_information?.profession,
            "specilityid": takeSpecial
        };

        connectionrequest()
            .then(() => {
                dispatch(dashboardRequest({}))
                dispatch(boardSpecialityRequest(obj));
            })
            .catch(err => {
                showErrorAlert("Please connect to internet", err);
            });
    }
    if (status2 == '' || DashboardReducer.status != status2) {
        switch (DashboardReducer.status) {
            case 'Dashboard/dashboardRequest':
                status2 = DashboardReducer.status;
                break;
            case 'Dashboard/dashboardSuccess':
                status2 = DashboardReducer.status;
                const allBoardSpeciality = DashboardReducer?.boardSpecialityResponse?.certification_boards;
                const dynamicDataSpecial = Object.keys(allBoardSpeciality).length;
                setBoardscount(dynamicDataSpecial);
                break;
            case 'Dashboard/dashboardFailure':
                status2 = DashboardReducer.status;
                break;
        }
    }

    if (status == '' || ProfileReducer.status != status) {
        switch (ProfileReducer.status) {
            case 'Profile/boardListProfileRequest':
                status = ProfileReducer.status;
                break;
            case 'Profile/boardListProfileSuccess':
                status = ProfileReducer.status;
                console.log(ProfileReducer?.boardListProfileResponse?.board_certifications, "log-----------");
                if (ProfileReducer?.boardListProfileResponse?.board_certifications?.length > 0) {
                    const specialty = props?.route?.params?.board?.specialities || DashboardReducer?.mainprofileResponse?.specialities;
                    const uniqueStates = ProfileReducer?.boardListProfileResponse?.board_certifications?.filter((state, index, self) =>
                        index === self.findIndex((s) => s.board_id === state.board_id)
                    );
                    const filteredCertifications = uniqueStates.filter(certification => {
                        return Object.values(specialty).includes(certification.speciality);
                    });
                    setWebcastview(filteredCertifications);
                    setPaginatedData(filteredCertifications.slice(0, 5));
                }
                break;
            case 'Profile/boardListProfileFailure':
                status = ProfileReducer.status;
                break;

        }
    }
    const transformDataSpecial = (data) => {
        return Object.keys(data).map(key => {
            const specialities = Object.values(data[key].specialities).map(spec => spec.name);
            return {
                id: parseInt(key, 10),
                name: data[key].name,
                specialities: specialities.join(', ')
            };
        });
    };
    const roleBoardIds = useMemo(() => {
        const roleData = DashboardReducer?.dashboardResponse?.data?.board_certifications || [];
        return roleData
            .filter((item, index, self) =>
                index === self.findIndex((t) => t.board_id === item.board_id)
            )
            .map(item => item.board_id);
    }, [DashboardReducer?.dashboardResponse?.data?.board_certifications]);

    useEffect(() => {
        const allBoardSpeciality = DashboardReducer?.boardSpecialityResponse?.certification_boards;
        if (allBoardSpeciality) {
            const dynamicDataSpecial = transformDataSpecial(allBoardSpeciality);
            const filteredBoards = dynamicDataSpecial.filter(board =>
                !roleBoardIds.includes(board.id.toString())
            );
            if (JSON.stringify(filteredBoards) !== JSON.stringify(totalboardname)) {
                setTotalboardname(filteredBoards);
                setBoardtake(filteredBoards);
            }
        }
    }, [DashboardReducer?.boardSpecialityResponse?.certification_boards, roleBoardIds, totalboardname]);
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
    const stateTakeItemboard = ({ item, index }) => {
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

                        <View style={{ height: 0.8, width: normalize(273), backgroundColor: "#DADADA", marginTop: normalize(8) }} />
                        {item?.certification_id && <View style={{ justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column", marginTop: normalize(5) }}>
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"Board Certification ID"}</Text>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>{item?.certification_id}</Text>
                        </View>}
                        <View style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row", width: "70%", marginTop: normalize(5) }}>
                            {item?.from_date && <View style={{ flexDirection: "column" }}>
                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"Issue Date"}</Text>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>{moment(item?.from_date).format("MM-DD-YYYY")}</Text>
                            </View>}
                            {item?.to_date && <View style={{ flexDirection: "column" }}>
                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{"Expiry Date"}</Text>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>{moment(item?.to_date).format("MM-DD-YYYY")}</Text>
                            </View>}
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    const profession = DashboardReducer?.mainprofileResponse?.professional_information?.profession;
    const isNursingOrDentist = profession == "Nursing" || profession == "Dentist";
    const professionType = DashboardReducer?.mainprofileResponse?.professional_information?.profession_type;
    const isPhysician = professionType == "DO" || professionType == "DPM" || professionType == "MD"
    const renderAddButton = () => (
        <View style={{ justifyContent: "center", alignContent: "center", flexDirection: "row", gap: 5 }}>
            <View style={{
                alignItems: "center",
                justifyContent: "center",
                height: normalize(20),
                width: normalize(20),
                borderWidth: 0.5,
                borderColor: Colorpath.ButtonColr,
                borderRadius: normalize(20),
            }}>
                <Search name="plus" color={Colorpath.ButtonColr} size={18} />
            </View>
            <View>
                <Text style={{
                    fontFamily: Fonts.InterSemiBold,
                    fontSize: 18,
                    color: Colorpath.ButtonColr,
                }}>
                    {"Add"}
                </Text>
            </View>
        </View>
    );

    const renderMessage = (message, underline = false) => (
        <Text style={{
            fontFamily: Fonts.InterSemiBold,
            fontSize: 16,
            color: Colorpath.ButtonColr,
            fontWeight: "bold",
            textDecorationLine: underline ? "underline" : "none",
        }}>
            {message}
        </Text>
    );
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
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
           {conn == false ? <IntOff/>:<SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="Board Certifications"
                            onBackPress={SearchBack}
                        />
                    ) : (
                        <PageHeader
                            title="Board Certifications"
                            onBackPress={SearchBack}
                        />
                    )}
                </View>
                <Loader visible={ProfileReducer?.status == 'Profile/boardListProfileRequest'} />
                <View>
                    <FlatList
                        data={paginatedData}
                        renderItem={stateTakeItemboard}
                        keyExtractor={(item) => item?.board_name}
                        ListFooterComponent={renderFooter}
                        onEndReached={loadMoreData}
                        onEndReachedThreshold={0.5}
                        contentContainerStyle={{ paddingBottom: normalize(120) }}
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
                                        borderStyle: "dashed",
                                        borderWidth: 1,
                                    }}
                                >
                                    <View style={{ flex: 1, justifyContent: "center" }}>
                                        <TouchableOpacity disabled={boardscount <= 0} onPress={() => {
                                            if (boardscount > 0) {
                                                props.navigation.dispatch(
                                                    CommonActions.reset({
                                                        index: 0,
                                                        routes: [
                                                            {
                                                                name: "AddCertificate",
                                                                params: {
                                                                    profile: "text",
                                                                }
                                                            }
                                                        ]
                                                    })
                                                );
                                            }
                                        }}>
                                            <>
                                                {boardscount == 0 ? (
                                                    renderMessage("Certification boards for your specialization are currently unavailable. We're actively working to make them accessible soon.", true)
                                                ) : isNursingOrDentist ? (
                                                    renderAddButton()
                                                ) : isPhysician ? (
                                                    renderMessage("Click here to add your board certification from the dashboard and stay up to date with your credentials.", true)
                                                ) : (
                                                    renderMessage("Certification boards for your specialization are currently unavailable. We're actively working to make them accessible soon.", true)
                                                )}
                                            </>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        } />
                </View>
                {boardtake?.length == 0 ? null : <View style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 0,
                    paddingHorizontal: normalize(20),
                    zIndex: 999
                }}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: "AddCertificate",
                                        params: {
                                            profile: "text",
                                        }
                                    }
                                ]
                            })
                        );
                        // props.navigation.navigate("AddCertificate", { profile: "text" });
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
            </SafeAreaView>}
            <ProfileModal board={"new"} main={ProfileReducer?.boardListProfileResponse?.certification_file_path} setPaginatedData={setPaginatedData} paginatedData={paginatedData} nav={props.navigation} detectdata={detectdata} setProfiletakeshow={setProfiletakeshow} profiletakeshow={profiletakeshow} />
        </>
    )
}
export default BoardProfile