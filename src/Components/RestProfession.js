/**
 * Rest profession reusable component module. Provides a React Native UI building block used across screens. Exported members: RestProfession, token_error, handleRot, handleUrl, searchGlobalitem, formatDate, formatDateEnd, renderLocationAndDates, getFullName, getFirstTruthyProfession.
 */

import { View, Text, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
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
import ProfessionCourseShimmer from './ProfessionCourseShimmer';
import showErrorAlert from '../Utils/Helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../Utils/Helpers/constants';
import NetInfo from '@react-native-community/netinfo';
import StackNav from '../Navigator/StackNav';
import { AppContext } from '../Screen/GlobalSupport/AppContext';

/**
 * Reusable RestProfession component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const RestProfession = ({ finalProfessionmain, CMEReducer, navigation, setPrimeadd, enables, addit, takestate, completedCount, pendingCount, DashboardReducer, profileType }) => {
    const [storeAlldata, setStoreAlldata] = useState([]);
    // Start as true so shimmer shows immediately on mount (before API fires)
    const [loading, setLoading] = useState(true);
    const [wholeDa, setWholeDa] = useState("");
    // Tracks whether at least one CME response has come back (success or failure)
    // so we never show the empty-state text prematurely
    const hasReceivedResponse = React.useRef(false);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const dispatch = useDispatch();
    const {
        setIsConnected,
        isConnected
    } = useContext(AppContext);
    const [nettrue, setNettrue] = useState("");
    console.log(isConnected, "isConnected=========")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setNettrue(state.isConnected)
            console.log('Connection State:', state.isConnected);
            /**
* Token error utility.
* @returns {void}
*/
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
    /**
* Handles rot.
* @returns {*}
*/
    const handleRot = () => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                <StackNav />
                // showErrorAlert("Internet is back!");
            }
        });

        return () => unsubscribe();
    }
    /**
* Handles url.
* @param {*} onlineName - Input value.
* @returns {void}
*/
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
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, shareUrl: url, detailpage_url: url, creditData: DashboardReducer?.mainprofileResponse?.licensures?.[0] } })
        }
    }
    console.log(completedCount, pendingCount, "fdgd0000------")
    /**
* Search globalitem utility.
* @param {Object} props - Input object.
* @param {*} props.item - Nested property value.
* @param {*} props.index - Nested property value.
* @returns {JSX.Element}
*/
    const searchGlobalitem = ({ item, index }) => {
        /**
* Formats date.
* @param {*} dateStr - Input value.
* @returns {*}
*/
        const formatDate = (dateStr) => {
            const date = moment(dateStr, "DD MMM'YY");
            return date.format("MMM  D").replace(' ', '');
        };
        const formattedDate = formatDate(item?.startdate);
        /**
* Formats date end.
* @param {*} dateStr - Input value.
* @returns {*}
*/
        const formatDateEnd = (dateStr) => {
            const date = moment(dateStr, "DD MMM'YY");
            return date.format("MMM D, YYYY").replace('', '');
        };
        const formattedDateend = formatDateEnd(item?.enddate);
        /**
* Render location and dates utility.
* @returns {*}
*/
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
    useEffect(() => {
        switch (CMEReducer.status) {
            case 'CME/cmeCourseRequest':
                hasReceivedResponse.current = false;
                setLoading(true);
                setStoreAlldata([]);
                break;
            case 'CME/cmeCourseSuccess': {
                hasReceivedResponse.current = true;
                setLoading(false);
                const conferences = CMEReducer?.cmeCourseResponse?.conferences || [];
                const uniqueConferences = conferences.filter(
                    (value, index, self) => index === self.findIndex(t => t?.id === value?.id),
                );
                setStoreAlldata(uniqueConferences);
                break;
            }
            case 'CME/cmeCourseFailure':
                hasReceivedResponse.current = true;
                setLoading(false);
                setStoreAlldata([]);
                break;
        }
    }, [CMEReducer.status, CMEReducer?.cmeCourseResponse?.conferences]);
    /**
* Returns full name.
* @param {*} obj - Input value.
* @returns {*}
*/
    const getFullName = (obj) => {
        const first = obj?.firstname;
        const last = obj?.lastname;
        return (first != null && last != null) ? `${first} ${last}` : undefined;
    };

    const nameShow =
        getFullName(wholeDa) ||
        getFullName(finalProfessionmain?.user) ||
        getFullName(AuthReducer?.loginResponse?.user) ||
        getFullName(AuthReducer?.againloginsiginResponse?.user) ||
        getFullName(AuthReducer?.signupResponse?.user) ||
        getFullName(DashboardReducer?.mainprofileResponse?.personal_information) ||
        '';
    /**
* Returns first truthy profession.
* @param {Array} sources - Input values.
* @returns {*}
*/
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
        <View style={{ paddingHorizontal: normalize(10), paddingVertical: profileType === 'SkipProfile' ? 0 : normalize(10) }}>
            {profileType !== 'SkipProfile' && (
                <View style={{ marginTop: normalize(5) }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 24, color: Colorpath.ButtonColr }}>{`Hey, ${nameShow}`}</Text>
                </View>
            )}
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
                        height: normalize(110),
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
                                height: normalize(60),
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
                                height: normalize(60),
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
                                height: normalize(60),
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
                    <TouchableOpacity style={{ alignSelf: 'center', backgroundColor: Colorpath.ButtonColr, height: normalize(20), width: normalize(20), borderRadius: normalize(20), justifyContent: "center", alignItems: "center" }} onPress={() => {
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
            {profileType !== 'SkipProfile' && CMEReducer?.cmeCourseResponse?.header_title && storeAlldata?.length > 0 && <View style={{ paddingHorizontal: normalize(0), paddingVertical: (completedCount == 0 && pendingCount == 0) ? normalize(10) : normalize(5) }}>
                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 24, color: Colorpath.ButtonColr }}>{CMEReducer?.cmeCourseResponse?.header_title}</Text>
            </View>}
            <View>
                <ScrollView contentContainerStyle={{ paddingBottom: normalize(70) }}>
                    {/* ── Shimmer while cmeCourseRequest is in-flight ── */}
                    {loading ? (
                        <ProfessionCourseShimmer count={3} />
                    ) : (
                        <FlatList
                            scrollEnabled={false}
                            data={storeAlldata?.slice(0, 2)}
                            renderItem={searchGlobalitem}
                            keyExtractor={(item, index) => item.id}
                            onEndReachedThreshold={0.5}
                            contentContainerStyle={{ paddingBottom: normalize(10) }}
                            scrollEventThrottle={16}
                            ListEmptyComponent={
                                hasReceivedResponse.current ? (
                                    <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(25) }}>
                                        <View
                                            style={{
                                                flexDirection: "row",
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
                                ) : null
                            }
                        />
                    )}
                    {/* Browse Courses button – hidden while shimmer is showing */}
                    {!loading && (
                        enables ? (
                            <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(10) }}>
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
                                        flexDirection: "row",
                                        height: normalize(95),
                                        width: normalize(300),
                                        borderRadius: normalize(10),
                                        backgroundColor: "#FFFFFF",
                                        paddingHorizontal: normalize(10),
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
                                            {"Recommendations are based on your profession, primary area of practice and state requirements."}
                                        </Text>
                                        <View style={{ marginTop: normalize(10) }}>
                                            <Buttons
                                                onPress={() => {
                                                    navigation.dispatch(
                                                        CommonActions.reset({
                                                            index: 0,
                                                            routes: [
                                                                {
                                                                    name: "Globalresult",
                                                                    params: { trig: { rqstType: "normallist", mainKey: "listby_type", beforetake: "recommended", creditData: DashboardReducer?.mainprofileResponse?.licensures?.[0], backProps: "yes" } },
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
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ) : (
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
                        )
                    )}
                    {DashboardReducer?.dashboardResponse?.data?.my_recently_viewed?.length > 0 && (
                        <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                            <TouchableOpacity
                                onPress={() => {
                                    const creditData = addit || DashboardReducer?.mainprofileResponse?.licensures?.[0] || null;
                                    navigation.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [
                                                {
                                                    name: "NonMain",
                                                    params: {
                                                        myact: {
                                                            realdata: DashboardReducer?.dashboardResponse?.data?.my_recently_viewed,
                                                            creditData: creditData,
                                                            recnt: "recnt"
                                                        }
                                                    },
                                                }
                                            ]
                                        })
                                    );
                                }}
                                style={{
                                    flexDirection: "row",
                                    height: normalize(95),
                                    width: normalize(300),
                                    borderRadius: normalize(10),
                                    backgroundColor: "#FFFFFF",
                                    paddingHorizontal: normalize(10),
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
                                        {"Your recently viewed courses are listed below for easy access and continued learning."}
                                    </Text>
                                    <View style={{ marginTop: normalize(10) }}>
                                        <Buttons
                                            onPress={() => {
                                                const creditData = addit || DashboardReducer?.mainprofileResponse?.licensures?.[0] || null;
                                                navigation.dispatch(
                                                    CommonActions.reset({
                                                        index: 0,
                                                        routes: [
                                                            {
                                                                name: "NonMain",
                                                                params: {
                                                                    myact: {
                                                                        realdata: DashboardReducer?.dashboardResponse?.data?.my_recently_viewed,
                                                                        creditData: creditData,
                                                                        recnt: "recnt"
                                                                    }
                                                                },
                                                            }
                                                        ]
                                                    })
                                                );
                                            }}
                                            height={normalize(40)}
                                            width={normalize(270)}
                                            backgroundColor={Colorpath.ButtonColr}
                                            borderRadius={normalize(5)}
                                            text="Recently viewed"
                                            color={Colorpath.white}
                                            fontSize={16}
                                            fontFamily={Fonts.InterSemiBold}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                    {nettrue === false ?
                        <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(70) }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 20, color: "#000000" }}>{"No Internet Connection"}</Text>
                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000", marginTop: normalize(7) }}>{"Please check your internet connection \n                    and try again"}</Text>
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
                </ScrollView>
            </View>
        </View>
    )
}

/**
 * Rest profession default export.
 *
 * @returns {*}
 */
export default RestProfession
