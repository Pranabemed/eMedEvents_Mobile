import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment';
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';
import Colorpath from '../Themes/Colorpath';
import { CommonActions } from '@react-navigation/native';
import ArrowIconsAnt from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import Buttons from './Button';
import { ConfActRequest } from '../Redux/Reducers/CMEReducer';
import connectionrequest from '../Utils/Helpers/NetInfo';
import showErrorAlert from '../Utils/Helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../Utils/Helpers/constants';
import NetInfo from '@react-native-community/netinfo';
import StackNav from '../Navigator/StackNav';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
let status = "";
const RestProfession = ({ finalProfessionmain, CMEReducer, navigation, setPrimeadd, enables, addit, takestate, completedCount, pendingCount, DashboardReducer }) => {
    const [storeAlldata, setStoreAlldata] = useState([]);
    const [loading, setLoading] = useState(false);
    const [wholeDa, setWholeDa] = useState("");
    const AuthReducer = useSelector(state => state.AuthReducer);
    const dispatch = useDispatch();
     const {
            setIsConnected,
            isConnected
        } = useContext(AppContext);
        const [nettrue,setNettrue] = useState("");
        console.log(isConnected,"isConnected=========")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setNettrue(state.isConnected)
            console.log('Connection State:', state.isConnected);
            const token_error = () => {
                setTimeout(() => {
                    AsyncStorage.getItem(constants.PRODATA).then((nondata) => {
                        const parsedDataD = JSON.parse(nondata);
                        setWholeDa(parsedDataD);
                        console.log(parsedDataD, "parsedData---------------")
                    });
                }, 500);
            };
            try {
                if (state.isConnected === false) {
                    token_error();
                }
            } catch (error) {
                console.log(error);
            }
        });
        return () => unsubscribe();
    }, []);
      const handleRot =()=>{
         const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                <StackNav/>
                // showErrorAlert("Internet is back!");
            }
        });

        return () => unsubscribe();
    }
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
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: DashboardReducer?.mainprofileResponse?.licensures?.[0] } })
        }
    }
    console.log(completedCount, pendingCount, "fdgd0000------")
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
                            {`${formattedDate} - ${formattedDateend}`}
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
            <View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(5) }}>
                    <TouchableOpacity onPress={() => { handleUrl(item) }}>
                        <View
                            style={{
                                flexDirection: "column",
                                width: normalize(300),
                                borderRadius: normalize(10),
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: normalize(10),
                                paddingVertical: normalize(10),
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
    if (status == '' || CMEReducer.status !== status) {
        switch (CMEReducer.status) {
            case 'CME/cmeCourseRequest':
                status = CMEReducer.status;
                setLoading(true);
                break;
            case 'CME/cmeCourseSuccess':
                status = CMEReducer.status;
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
                    setLoading(false);
                }
                break;
            case 'CME/cmeCourseFailure':
                status = CMEReducer.status;
                setLoading(false);
                break;
        }
    }
    const getFullName = (obj) => {
        const first = obj?.firstname;
        const last = obj?.lastname;
        return (first != null && last != null) ? `${first} ${last}` : undefined;
    };

    const nameShow =
        getFullName(wholeDa) ||  
        getFullName(finalProfessionmain?.user) ||
        getFullName(AuthReducer?.loginResponse?.user) ||
        getFullName(AuthReducer?.signupResponse?.user) ||
        getFullName(DashboardReducer?.mainprofileResponse?.personal_information) ||
        '';
    const getFirstTruthyProfession = (...sources) =>
        sources.find(val => val) || '';
    const handleProf = String(
        getFirstTruthyProfession(
            DashboardReducer?.mainprofileResponse?.professional_information?.profession,
            AuthReducer?.signupResponse?.user?.profession,
            AuthReducer?.loginResponse?.user?.profession,
            finalProfessionmain?.profession
        )
    )
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-');
    return (
        <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
            <View style={{ marginTop: normalize(5) }}>
                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 24, color: Colorpath.ButtonColr }}>{`Hey, ${nameShow}`}</Text>
            </View>
            {completedCount == 1 ? <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(10), paddingHorizontal: normalize(10) }}>
                <TouchableOpacity onPress={() => {
                    if (enables) {
                        setPrimeadd(true);
                    } else {
                        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Course" }] }));
                    }

                }}
                    style={{
                        flexDirection: "row",
                        height: normalize(95),
                        width: normalize(300),
                        borderRadius: normalize(10),
                        backgroundColor: "#FFFFFF",
                        paddingHorizontal: normalize(15),
                        // paddingVertical: normalize(10),
                        alignItems: "center",
                        borderWidth: 0.5,
                        borderColor: "#DADADA"
                    }}
                >
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 14,
                                color: "#000000",
                                fontWeight: "bold",
                            }}
                        >
                            {"Your Registered Activities"}
                        </Text>
                        <View style={{ flexDirection: "row", gap: normalize(5), marginTop: normalize(4) }}>
                            <View style={{
                                flexDirection: "row",
                                height: normalize(50),
                                width: normalize(88),
                                borderRadius: normalize(8),
                                // paddingHorizontal: normalize(10),
                                backgroundColor: "#EAF5FF",
                                marginTop: normalize(5),
                                justifyContent: "center", alignItems: "center"
                            }}>
                                <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: normalize(3) }}>
                                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000", alignSelf: "center", fontWeight: "bold" }}>{String(completedCount + pendingCount).padStart(2, '0')}</Text>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "#000", alignSelf: "center" }}>{"Registered"}</Text>
                                </View>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                height: normalize(50),
                                width: normalize(88),
                                borderRadius: normalize(8),
                                // paddingHorizontal: normalize(10),
                                backgroundColor: "#E7F5E8",
                                marginTop: normalize(5),
                                justifyContent: "center", alignItems: "center"
                            }}>
                                <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: normalize(3) }}>
                                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000", fontWeight: "bold" }}>{String(completedCount).padStart(completedCount == 0 ? 1 : 2, '0')}</Text>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "#000" }}>{"Completed"}</Text>
                                </View>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                height: normalize(50),
                                width: normalize(88),
                                borderRadius: normalize(8),
                                backgroundColor: "#F1EBFF",
                                // paddingHorizontal: normalize(10),
                                marginTop: normalize(5),
                                justifyContent: "center", alignItems: "center"
                            }}>
                                <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: normalize(3) }}>
                                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000", fontWeight: "bold" }}>{String(pendingCount).padStart(pendingCount == 0 ? 1 : 2, '0')}</Text>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "#000" }}>{"Pending"}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={{ marginBottom: normalize(60), backgroundColor: Colorpath.ButtonColr, height: normalize(20), width: normalize(20), borderRadius: normalize(20), justifyContent: "center", alignItems: "center" }} onPress={() => {
                        if (enables) {
                            setPrimeadd(true);
                        } else {
                            navigation.dispatch(CommonActions.reset({
                                index: 0, routes: [{
                                    name: "Course", params: {
                                        taskData: { statid: takestate, creditID: addit },
                                    }
                                }]
                            }));
                        }
                    }}>
                        <ArrowIconsAnt
                            name="arrowright"
                            size={18}
                            color={Colorpath.white}
                            style={{ alignSelf: "center" }}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View> : null}
            {CMEReducer?.cmeCourseResponse?.header_title && storeAlldata?.length > 0 && <View style={{ paddingHorizontal: normalize(0), paddingVertical: (completedCount == 0 && pendingCount == 0) ? normalize(10) : normalize(5) }}>
                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 24, color: Colorpath.ButtonColr }}>{CMEReducer?.cmeCourseResponse?.header_title}</Text>
            </View>}
            <View>
                <FlatList
                    data={storeAlldata?.slice(0, 2)}
                    renderItem={searchGlobalitem}
                    keyExtractor={(item, index) => item.id}
                    onEndReachedThreshold={0.5}
                    contentContainerStyle={{ paddingBottom: normalize(10) }}
                    scrollEventThrottle={16}
                    ListFooterComponent={
                        loading ? <ActivityIndicator color={Colorpath.ButtonColr} size="large" /> : null
                    }
                    ListEmptyComponent={!loading &&
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
                <View>
                    <TouchableOpacity onPress={() => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: "Globalresult",
                                        params: { trig: { rqstType: "normallist", mainKey: "listby_type", beforetake: "recommended", creditData: DashboardReducer?.mainprofileResponse?.licensures?.[0] } },
                                    }
                                ]
                            })
                        );
                    }}
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: normalize(95),
                            width: normalize(300),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            alignItems: "center",
                            borderWidth: 0.5,
                            borderColor: "#DADADA"
                        }}
                    >
                        <Buttons
                            onPress={() => {
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [
                                            {
                                                name: "Globalresult",
                                                params: { trig: { trig: handleProf, rqstType: "professionconferences", mainKey: "conference_profession", creditAll: DashboardReducer?.mainprofileResponse?.licensures?.[0], backProps: "yes" } },
                                            }
                                        ]
                                    })
                                );
                            }}
                            height={normalize(40)}
                            width={normalize(270)}
                            backgroundColor={Colorpath.ButtonColr}
                            borderRadius={normalize(5)}
                            text="Browse Courses"
                            color={Colorpath.white}
                            fontSize={16}
                            fontFamily={Fonts.InterSemiBold}
                        />
                    </TouchableOpacity>
                </View>
                {nettrue === false ?
                            <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(70) }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 20, color: "#000000" }}>{"No Internet Connection"}</Text>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000",marginTop:normalize(7) }}>{"Please check your internet connection \n                    and try again"}</Text>
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
                                    marginTop={normalize(25)}
                                />
                            </View>
                            : null}
            </View>
        </View>
    )
}

export default RestProfession