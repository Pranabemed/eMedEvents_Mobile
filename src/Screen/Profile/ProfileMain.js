import { View, Text, Platform, Image, FlatList, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import CircleLoader from '../Profile/CircleLoader.js'
import Fonts from '../../Themes/Fonts.js';
import Imagepath from '../../Themes/Imagepath.js';
import RightIcn from 'react-native-vector-icons/AntDesign.js';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo.js';
import { dashPerRequest, mainprofileRequest } from '../../Redux/Reducers/DashboardReducer.js';
import showErrorAlert from '../../Utils/Helpers/Toast.js';
import constants from '../../Utils/Helpers/constants.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrimeCheckRequest } from '../../Redux/Reducers/WebcastReducer.js';
import PrimeCard from '../../Components/PrimeCard.js';
import Loader from '../../Utils/Helpers/Loader.js';
import { AppContext } from '../GlobalSupport/AppContext.js';
import NetInfo from '@react-native-community/netinfo';
import { tokenRequest } from '../../Redux/Reducers/AuthReducer.js';
import Buttons from '../../Components/Button.js';
import StackNav from '../../Navigator/StackNav.js';
import { SafeAreaView } from 'react-native-safe-area-context'

let status1 = "";
const ProfileMain = (props) => {
    const {
        setFulldashbaord,
        setGtprof,
        setIsConnected,
        isConnected
    } = useContext(AppContext);
    const dispatch = useDispatch();
    const isFoucs = useIsFocused();
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const [allHandle, setAllHandle] = useState(null);
    const [finalverifyvaultprof, setFinalverifyvaultprof] = useState(null);
    const [finalProfessionprof, setFinalProfessionprof] = useState(null);
    const [primeitprof, setPrimeitprof] = useState(false);
    const [primeitprofs, setPrimeitprofs] = useState(false);
    const [subitprof, setSubitprof] = useState(false);
    const [allProf, setAllProf] = useState("");
    const [nettrue, setNettrue] = useState("");
    useEffect(() => {
        const token_error = () => {
            setTimeout(() => {
                AsyncStorage.getItem(constants.TOKEN).then((loginHandleProccess) => {
                    if (loginHandleProccess) {
                        console.log(loginHandleProccess, "loginHandleProccess--------")
                        let objToken = { "token": loginHandleProccess, "key": {} }
                        connectionrequest()
                            .then(() => {
                                dispatch(tokenRequest(objToken))
                                dispatch(mainprofileRequest(objToken))
                                dispatch(dashPerRequest(objToken))
                            })
                            .catch((err) => showErrorAlert("Please connect to internet", err))
                    }
                });
            }, 500);
        };
        try {
            token_error();
        } catch (error) {
            console.log(error);
        }
    }, [isFoucs]);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setNettrue(state.isConnected);
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, [isFoucs]);
    const profileBack = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: "TabNav", params: { initialRoute: "Home" } }
                ],
            })
        );

    }
    if (status1 == '' || DashboardReducer.status != status1) {
        switch (DashboardReducer.status) {
            case 'Dashboard/mainprofileRequest':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/mainprofileSuccess':
                status1 = DashboardReducer.status;
                setAllHandle(DashboardReducer?.mainprofileResponse);
                console.log(DashboardReducer?.mainprofileResponse, "log-----------");
                break;
            case 'Dashboard/mainprofileFailure':
                status1 = DashboardReducer.status;
                break;
        }
    }
    const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
    const otherRestrict = new Set(["Nursing - APRN", "Nursing - CNA", "Nursing - LPN", "Nursing - RN", "Dentist - DDS", "Dentist - RDA", "Dentist - RDH"]);
    const profFromDashboard =
        DashboardReducer?.mainprofileResponse?.professional_information?.profession != null &&
            DashboardReducer?.mainprofileResponse?.professional_information?.profession_type != null
            ? `${DashboardReducer?.mainprofileResponse?.professional_information?.profession} - ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type}`
            : null;
    const allProfTake = validHandles.has(profFromDashboard);
    const allNoDetData = otherRestrict.has(profFromDashboard);
    const profileData = allProfTake ? [
        { id: 0, name: "Contact Information", Img: Imagepath.Profile },
        { id: 1, name: "Professional Information", Img: Imagepath.ProfImg },
        { id: 2, name: "State Licenses", Img: Imagepath.StateImg },
        { id: 3, name: "Certification Boards", Img: Imagepath.BoardImg },
        { id: 5, name: "Change Password", Img: Imagepath.PassChange }
        // { id: 4, name: "Employment Information", Img: Imagepath.EmpImg }
    ] : allNoDetData ?
        [
            { id: 0, name: "Contact Information", Img: Imagepath.Profile },
            { id: 1, name: "Professional Information", Img: Imagepath.ProfImg },
            { id: 2, name: "State Licenses", Img: Imagepath.StateImg },
            { id: 5, name: "Change Password", Img: Imagepath.PassChange }

        ]
        : [
            { id: 0, name: "Contact Information", Img: Imagepath.Profile },
            { id: 1, name: "Professional Information", Img: Imagepath.ProfImg },
            { id: 5, name: "Change Password", Img: Imagepath.PassChange }

            // { id: 4, name: "Employment Information", Img: Imagepath.EmpImg }
        ]
    const [text, setText] = useState('');

    useEffect(() => {
        if (allHandle?.specialities) {
            const myObject = allHandle?.specialities
            const valuesArray = Object.values(myObject);
            setText(valuesArray.join(', '));
        }
    }, [allHandle]);
    useEffect(() => {
        if (allProfTake) {
            setGtprof(true);
        } else {
            setGtprof(false);
        }
    }, [allProfTake])
    useEffect(() => {
        if (DashboardReducer?.dashPerResponse?.data) {
            const uniqueStates = DashboardReducer?.dashPerResponse?.data?.licensures?.filter((state, index, self) => {
                return index === self.findIndex((s) =>
                    s.state_id === state.state_id &&
                    s.board_id === state.board_id
                );
            });
            setFulldashbaord(uniqueStates);
        }

    }, [DashboardReducer?.dashPerResponse])
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
                    setFinalverifyvaultprof(board_special_json);
                    setFinalProfessionprof(profession_data_json);
                    console.log(board_special_json, "statelicesene=================");
                    console.log(profession_data_json, "profession=================");
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            }, 100);
        };

        token_handle_vault();
    }, [isFoucs]);
    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(PrimeCheckRequest({}))
            })
            .catch((err) => showErrorAlert("Please connect to internet", err))
    }, [isFoucs])
    useEffect(() => {
        if (allHandle) {
            const profession = allHandle?.professional_information?.profession;
            const profession_type = allHandle?.professional_information?.profession_type;
            const clean = (value) => {
                if (value == null) return '';
                return String(value).trim();
            };
            const cleanedProfession = clean(profession);
            const cleanedProfessionType = clean(profession_type);
            const combinedValue =
                cleanedProfession && cleanedProfessionType
                    ? `${cleanedProfession} - ${cleanedProfessionType}`
                    : cleanedProfession || cleanedProfessionType;

            setAllProf(combinedValue || '');
        }
    }, [allHandle])
    const isPrimeTrial = useMemo(() => {
            return !WebcastReducer?.PrimeCheckResponse?.subscription;
        }, [WebcastReducer?.PrimeCheckResponse?.subscription]);
    const takeSub = isPrimeTrial || finalProfessionprof?.subscription_user == "free" || AuthReducer?.loginResponse?.user?.subscription_user == "free" || AuthReducer?.againloginsiginResponse?.user?.subscription_user == "free" || finalverifyvaultprof?.subscription_user == "non-subscribed";
    console.log(takeSub, "yakegfjghjf-------", allProfTake, "sfgdjkghf=====");
    const endDateStringProfile =
        WebcastReducer?.PrimeCheckResponse?.subscription?.end_date || AuthReducer?.againloginsiginResponse?.user?.subscriptions?.[0]?.end_date ||
        AuthReducer?.loginResponse?.user?.subscriptions?.[0]?.end_date || finalProfessionprof?.subscriptions?.[0]?.end_date;
    useEffect(() => {
        if (endDateStringProfile) {
            const endDateString =
                WebcastReducer?.PrimeCheckResponse?.subscription?.end_date || AuthReducer?.againloginsiginResponse?.user?.subscriptions?.[0]?.end_date ||
                AuthReducer?.loginResponse?.user?.subscriptions?.[0]?.end_date || finalProfessionprof?.subscriptions?.[0]?.end_date;
            if (!endDateString) return;
            try {
                const endDate = new Date(endDateString);
                const currentDate = new Date();
                const normalizedEndDate = new Date(endDate.setHours(0, 0, 0, 0));
                const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
                if (normalizedCurrentDate >= normalizedEndDate) {
                    setPrimeitprof(true);
                } else {
                    setPrimeitprof(false);
                }
                const timeDifference = normalizedEndDate - normalizedCurrentDate;
                const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
                if (daysDifference <= 30) {
                    setPrimeitprofs(true);
                } else {
                    setPrimeitprofs(false);
                }
            } catch (error) {
                console.error('Error parsing date:', error);
                // Handle error case appropriately (maybe setEnables(false))
            }
        } else if (takeSub) {
            setPrimeitprofs(true);
        }
    }, [WebcastReducer?.PrimeCheckResponse, AuthReducer, finalverifyvaultprof, finalProfessionprof, takeSub, endDateStringProfile]);
    const profileItem = ({ item, index }) => {
        return (
            <View style={{ margin: 15 }}>
                <TouchableOpacity onPress={() => {
                    if (item?.id == 0) {
                        props.navigation.navigate("ContactProfile", { wholedata: allHandle });
                    } else if (item?.id == 1) {
                        dispatch(dashPerRequest())
                        props.navigation.navigate("PersonalInfo", { personal: allHandle });
                    } else if (item?.id == 2) {
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: "StateProfile",
                                        params: { state: allHandle }
                                    }
                                ]
                            })
                        );
                    } else if (item?.id == 3) {
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: "BoardProfile",
                                        params: { board: allHandle }
                                    }
                                ]
                            })
                        );
                    } else if (item?.id == 4) {
                        props.navigation.navigate("EmpInfo", { EmpData: allHandle });
                    }else if (item?.id == 5) {
                        props.navigation.navigate("ChangePassword");
                    }

                }}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: normalize(15),
                        paddingVertical: normalize(10),
                        borderRadius: normalize(8),
                        backgroundColor: "#FFFFFF",
                        marginBottom: normalize(-15),
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        elevation: 3
                    }}
                >
                    <View
                        style={{
                            height: normalize(30),
                            width: normalize(30),
                            borderRadius: normalize(15),
                            backgroundColor: Colorpath.Pagebg,
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: normalize(10),
                        }}
                    >
                        <Image
                            source={item?.Img}
                            style={{
                                height: normalize(18),
                                width: normalize(18),
                                resizeMode: "contain",
                                alignSelf: "center",
                                tintColor: "#000000"
                            }}
                        />
                    </View>
                    <Text
                        style={{
                            flex: 1,
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 16,
                            color: "#333",
                            fontWeight:"bold"
                        }}
                    >
                        {item?.name}
                    </Text>
                    <RightIcn
                        name="right"
                        size={20}
                        color="#000000"
                    />
                </TouchableOpacity>
            </View>

        )
    }
    const handleRot = () => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                <StackNav />
                console.log("Internet is back!");
            }
        });

        return () => unsubscribe();
    }
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    console.log(allHandle?.personal_information?.firstname, "allHandle?.personal_information?.firstname-----")
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            {nettrue === false ? <SafeAreaView style={stylesd.container}>
                <View style={stylesd.centerContainer}>
                    <View style={{ height: normalize(100), width: normalize(120), borderRadius: normalize(20), bottom: normalize(50), justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { height: 3, width: 0 }, elevation: 10, backgroundColor: "#FFFFFF" }}>
                        <Image source={Imagepath.NoWifi} style={{ height: normalize(40), width: normalize(40), resizeMode: "contain" }} />
                    </View>
                    <Buttons
                        onPress={handleRot}
                        height={normalize(45)}
                        width={normalize(240)}
                        backgroundColor={Colorpath.ButtonColr}
                        borderRadius={normalize(5)}
                        text="Retry"
                        color={Colorpath.white}
                        fontSize={16}
                        fontFamily={Fonts.InterSemiBold}
                        fontWeight="bold"
                        marginTop={normalize(65)}
                    />
                </View>
                <View style={stylesd.internetCard}>
                    <Text style={stylesd.internetText}>{"No Internet Connection"}</Text>
                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000" }}>{"Please check your internet connection \n                    and try again"}</Text>
                </View>
            </SafeAreaView> : <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="Profile"
                            onBackPress={profileBack}
                        />
                    ) : (
                        <PageHeader
                            title="Profile"
                            onBackPress={profileBack}
                        />

                    )}
                </View>
                <Loader visible={DashboardReducer?.status == 'Dashboard/mainprofileRequest'} />
                <ScrollView>
                    <View style={{ backgroundColor: Colorpath.ButtonColr, justifyContent: "center", alignContent: "center", paddingVertical: normalize(10) }}>
                        <CircleLoader allProfTake={allProfTake} percentage={DashboardReducer?.mainprofileResponse?.profile_complete_percentage} mainData={DashboardReducer?.mainprofileResponse} />
                        {(allHandle?.personal_information?.firstname && allHandle?.personal_information?.lastname) && <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#FFFFFF",fontWeight:"bold" }}>{`${allHandle?.personal_information?.firstname} ${allHandle?.personal_information?.lastname}`}</Text>
                            <View style={{
                                width: "60%",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 14,
                                        color: "#FFFFFF",
                                        textAlign: "center",
                                        lineHeight: 20,
                                        fontWeight:"bold"
                                    }}
                                >
                                    {allProf}
                                </Text>
                                {text && (
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: Fonts.InterMedium,
                                            fontSize: 14,
                                            color: "#FFFFFF",
                                            textAlign: "center",
                                            lineHeight: 20,
                                            fontWeight:"700"
                                        }}
                                    >
                                        {text}
                                    </Text>
                                )}
                            </View>
                        </View>}
                        {allProfTake && <View style={{ paddingVertical: normalize(5), justifyContent: 'center', alignItems: "center" }}>
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#6a82ce", textAlign: "center",fontWeight:"5s00" }}>{`${DashboardReducer?.mainprofileResponse?.profile_complete_percentage || "0"}% Profile Completed`}</Text>
                        </View>}
                        {allProfTake && <TouchableOpacity disabled={primeitprof ? !primeitprof : !primeitprofs} onPress={() => setSubitprof(true)}>
                            <View
                                style={{
                                    height: normalize(40),
                                    width: primeitprof ? normalize(220) : primeitprofs && !WebcastReducer?.PrimeCheckResponse?.subscription?.end_date ? normalize(220) : normalize(170),
                                    borderRadius: normalize(40),
                                    shadowColor: "#000",
                                    shadowOffset: { height: 3, width: 0 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 10,
                                    elevation: 10,
                                    backgroundColor: "#FF773D",
                                    alignSelf: "center",
                                    position: "relative",
                                    zIndex: 999,
                                    marginBottom: normalize(-25),
                                    justifyContent: "center",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <View
                                    style={{
                                        height: normalize(30),
                                        width: normalize(30),
                                        borderRadius: normalize(15),
                                        backgroundColor: "#FFFFFF",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: normalize(10),
                                    }}
                                >
                                    <Image
                                        source={Imagepath.CrownHome}
                                        style={{
                                            height: normalize(20),
                                            width: normalize(20),
                                            resizeMode: "contain",
                                            tintColor: "#FF773D",
                                        }}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterBold,
                                        fontSize: 16,
                                        color: "#FFFFFF",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {primeitprof ? "Become a Prime Member" : primeitprofs && !WebcastReducer?.PrimeCheckResponse?.subscription?.end_date ? "Become a Prime Member" : "Prime Member"}
                                </Text>
                            </View>
                        </TouchableOpacity>}
                    </View>
                    <View style={{ paddingVertical: allProfTake ? normalize(20) : normalize(5) }}>
                        <FlatList
                            data={profileData}
                            renderItem={profileItem}
                            contentContainerStyle={{ paddingBottom: normalize(20) }}
                            keyExtractor={(item, index) => index.toString()} />
                    </View>
                </ScrollView>
            </SafeAreaView>}

            {subitprof && <PrimeCard primeadd={subitprof} setPrimeadd={setSubitprof} />}
        </>
    )
}

export default ProfileMain
const stylesd = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colorpath.Pagebg,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        padding: normalize(10),
        flex: 1
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(20),
        zIndex: 2,
    },
    icon: {
        marginBottom: normalize(20),
    },
    internetCard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colorpath.Pagebg,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        padding: normalize(10),
        marginTop: normalize(10),
        flex: 1,
        gap: normalize(5)
    },
    internetText: {
        color: "#000000",
        fontFamily: Fonts.InterSemiBold,
        fontSize: 20,
    },
});