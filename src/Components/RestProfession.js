/**
 * Rest profession reusable component module. Provides a React Native UI building block used across screens. Exported members: RestProfession, token_error, handleRot, handleUrl, searchGlobalitem, formatDate, formatDateEnd, renderLocationAndDates, getFullName, getFirstTruthyProfession.
 */

import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, Pressable, StyleSheet, Dimensions, Platform } from 'react-native'
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react'
import moment from 'moment';
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';
import Colorpath from '../Themes/Colorpath';
import { CommonActions } from '@react-navigation/native';
import ArrowIconsAnt from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import Buttons from './Button';
import { ConfActRequest, clearCmeCourseData } from '../Redux/Reducers/CMEReducer';
import connectionrequest from '../Utils/Helpers/NetInfo';
import ProfessionCourseShimmer from './ProfessionCourseShimmer';
import showErrorAlert from '../Utils/Helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../Utils/Helpers/constants';
import NetInfo from '@react-native-community/netinfo';
import StackNav from '../Navigator/StackNav';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
import Carousel from 'react-native-snap-carousel';
import ResumeDash from './ResumeDash';

/**
 * Reusable RestProfession component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const RestProfession = ({ finalProfessionmain, CMEReducer, navigation, setPrimeadd, enables, addit, takestate, completedCount, pendingCount, DashboardReducer, profileType, hideGreeting = false }) => {
    const getResolvedActivities = useCallback(() => {
        const responses = [
            DashboardReducer?.dashPerResponse,
            DashboardReducer?.dashMbResponse,
            DashboardReducer?.dashboardResponse,
        ];
        const activities = responses
            .map(response => response?.data?.my_activities)
            .find(Array.isArray) || [];
        return activities.filter(
            (value, index, self) => index === self.findIndex(t => t?.id === value?.id),
        );
    }, [
        DashboardReducer?.dashPerResponse,
        DashboardReducer?.dashMbResponse,
        DashboardReducer?.dashboardResponse,
    ]);

    const initialActivities = getResolvedActivities();
    const recentlyViewedCourses =
        DashboardReducer?.dashboardResponse?.data?.my_recently_viewed ||
        DashboardReducer?.dashPerResponse?.data?.my_recently_viewed ||
        DashboardReducer?.dashMbResponse?.data?.my_recently_viewed ||
        [];
    const [storeAlldata, setStoreAlldata] = useState(initialActivities);
    const [loading, setLoading] = useState(initialActivities.length === 0);
    const [wholeDa, setWholeDa] = useState("");
    // Tracks whether the list can render its result or empty state.
    const hasReceivedResponse = React.useRef(initialActivities.length > 0);
    const DASHBOARD_LOADING_TIMEOUT_MS = 10000;
    const AuthReducer = useSelector(state => state.AuthReducer);
    const dispatch = useDispatch();
    const {
        setIsConnected,
        isConnected,
        setStatepush
    } = useContext(AppContext);
    const [nettrue, setNettrue] = useState("");
    const [valcourse, setValcourse] = useState(0);
    const carouselRef = useRef(null);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
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
    useEffect(() => {
        const activities = getResolvedActivities();
        if (activities.length > 0) {
            setStoreAlldata(activities);
            hasReceivedResponse.current = true;
            setLoading(false);
        } else if (
            DashboardReducer?.status === 'Dashboard/dashPerSuccess' ||
            DashboardReducer?.status === 'Dashboard/dashMbSuccess' ||
            DashboardReducer?.status === 'Dashboard/dashboardSuccess'
        ) {
            hasReceivedResponse.current = true;
            setLoading(false);
            setStoreAlldata([]);
        } else if (
            DashboardReducer?.status === 'Dashboard/dashPerFailure' ||
            DashboardReducer?.status === 'Dashboard/dashMbFailure' ||
            DashboardReducer?.status === 'Dashboard/dashboardFailure'
        ) {
            hasReceivedResponse.current = true;
            setLoading(false);
        }
    }, [
        getResolvedActivities,
        DashboardReducer?.status,
    ]);

    // Keep existing activities displayed during background refetches so tab switching does not clear them
    useEffect(() => {
        if (
            DashboardReducer?.status === 'Dashboard/dashPerRequest' ||
            DashboardReducer?.status === 'Dashboard/dashMbRequest' ||
            DashboardReducer?.status === 'Dashboard/dashboardRequest'
        ) {
            const activities = getResolvedActivities();
            if (activities.length > 0) {
                setStoreAlldata(activities);
                hasReceivedResponse.current = true;
                setLoading(false);
            } else {
                setLoading(true);
            }
        }
    }, [DashboardReducer?.status, getResolvedActivities]);

    // Dashboard endpoints are requested in parallel and share a single Redux
    // status field. If another request overwrites that status, or an endpoint
    // does not settle, the returning-user Home page used to shimmer forever.
    // Stop blocking the page; late responses still populate the list above.
    useEffect(() => {
        if (!loading || hasReceivedResponse.current) return undefined;

        const timeout = setTimeout(() => {
            hasReceivedResponse.current = true;
            setLoading(false);
            setStoreAlldata(current => Array.isArray(current) ? current : []);
        }, DASHBOARD_LOADING_TIMEOUT_MS);

        return () => clearTimeout(timeout);
    }, [loading]);
    /**
* Returns full name.
* @param {*} obj - Input value.
* @returns {*}
*/
    const getLastName = (obj) => obj?.lastname || undefined;

    const nameShow =
        getLastName(DashboardReducer?.mainprofileResponse?.personal_information) ||
        getLastName(wholeDa) ||
        getLastName(finalProfessionmain?.user) ||
        getLastName(AuthReducer?.loginResponse?.user) ||
        getLastName(AuthReducer?.againloginsiginResponse?.user) ||
        getLastName(AuthReducer?.signupResponse?.user) ||
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
            {profileType !== 'SkipProfile' && !hideGreeting && (
                <View style={{ marginTop: normalize(5) }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 24, color: Colorpath.ButtonColr }}>{`Hey, ${nameShow}`}</Text>
                </View>
            )}
            {(completedCount > 0 || pendingCount > 0 || completedCount == 1) ? (
                <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(10), paddingHorizontal: normalize(10) }}>
                    <TouchableOpacity
                        onPress={() => {
                            setStatepush?.(addit);
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{
                                        name: "Course",
                                        params: {
                                            taskData: { statid: takestate, creditID: addit },
                                        },
                                    }],
                                })
                            );
                        }}
                        style={{
                            flexDirection: "row",
                            minHeight: normalize(110),
                            width: normalize(300),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(15),
                            paddingVertical: normalize(10),
                            alignItems: "center",
                            borderWidth: 0.5,
                            borderColor: "#DADADA",
                        }}
                    >
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        flex: 1,
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 14,
                                        color: "#000000",
                                        fontWeight: "bold",
                                        marginRight: normalize(8),
                                    }}
                                >
                                    {"Your Registered Activities"}
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: Colorpath.ButtonColr,
                                        height: normalize(20),
                                        width: normalize(20),
                                        borderRadius: normalize(20),
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    onPress={() => {
                                        setStatepush?.(addit);
                                        navigation.dispatch(
                                            CommonActions.reset({
                                                index: 0,
                                                routes: [{
                                                    name: "Course",
                                                    params: {
                                                        taskData: { statid: takestate, creditID: addit },
                                                    },
                                                }],
                                            })
                                        );
                                    }}
                                >
                                    <ArrowIconsAnt
                                        name="arrowright"
                                        size={18}
                                        color={Colorpath.white}
                                        style={{ alignSelf: "center" }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", gap: normalize(5), marginTop: normalize(4) }}>
                                <View style={{
                                    flexDirection: "row",
                                    height: normalize(60),
                                    width: normalize(88),
                                    borderRadius: normalize(8),
                                    backgroundColor: "#EAF5FF",
                                    marginTop: normalize(5),
                                    justifyContent: "center",
                                    alignItems: "center",
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
                                    backgroundColor: "#E7F5E8",
                                    marginTop: normalize(5),
                                    justifyContent: "center",
                                    alignItems: "center",
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
                                    marginTop: normalize(5),
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: normalize(3) }}>
                                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000", fontWeight: "bold" }}>{String(pendingCount).padStart(pendingCount == 0 ? 1 : 2, '0')}</Text>
                                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "#000" }}>{"Pending"}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : null}
            <View>
                <ScrollView contentContainerStyle={{ paddingBottom: normalize(70) }}>
                    {/* ── Shimmer while data is in-flight ── */}
                    {loading && !hasReceivedResponse.current && storeAlldata?.length === 0 ? (
                        <ProfessionCourseShimmer count={1} />
                    ) : storeAlldata?.length > 0 ? (
                        <View style={{ paddingVertical: normalize(10) }}>
                            <Pressable
                                onPress={() => {
                                    setStatepush?.(addit);
                                    navigation.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [
                                                {
                                                    name: "Course",
                                                    params: {
                                                        myact: {
                                                            realdata: storeAlldata,
                                                            creditData: addit || DashboardReducer?.mainprofileResponse?.licensures?.[0],
                                                        },
                                                    },
                                                },
                                            ],
                                        })
                                    );
                                }}
                                style={{
                                    width: normalize(295),
                                    alignSelf: "center",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    marginBottom: normalize(4),
                                }}
                            >
                                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#000", fontWeight: "bold" }}>
                                    {"Start or Resume Courses"}
                                </Text>
                                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: Colorpath.ButtonColr, fontWeight: "bold" }}>
                                    {"View All"}
                                </Text>
                            </Pressable>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Carousel
                                    ref={carouselRef}
                                    layout={'default'}
                                    data={storeAlldata}
                                    marginTop={normalize(0)}
                                    sliderWidth={normalize(300)}
                                    itemWidth={normalize(295)}
                                    scrollAnimationDuration={1000}
                                    renderItem={({ item, index }) => (
                                        <ResumeDash
                                            item={item}
                                            index={index}
                                            addit={addit}
                                        />
                                    )}
                                    firstItem={0}
                                    onSnapToItem={(index) => {
                                        setValcourse(index);
                                    }}
                                />
                            </View>
                            {storeAlldata && storeAlldata.length >= 2 && (
                                <View style={styles.paginationContainer}>
                                    {storeAlldata.map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.dot,
                                                valcourse === index ? styles.activeDot : styles.inactiveDot
                                            ]}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                    ) : null}
                    {/* Browse Courses button */}
                    {(!loading || hasReceivedResponse.current) && (
                        <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(10) }}>
                            <TouchableOpacity onPress={() => {
                                dispatch(clearCmeCourseData());
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [
                                            {
                                                name: "Globalresult",
                                                params: { trig: { rqstType: "normallist", mainKey: "listby_type", beforetake: "recommended", creditData: addit || DashboardReducer?.mainprofileResponse?.licensures?.[0] || null } },
                                            }
                                        ]
                                    })
                                );
                            }}
                                style={{
                                    flexDirection: "row",
                                    height: normalize(105),
                                    width: normalize(300),
                                    borderRadius: normalize(5),
                                    borderWidth: 1,
                                    borderColor: Colorpath.bordercolor,
                                    backgroundColor: Colorpath.white,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: normalize(10)
                                }}
                            >
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <View style={{ width: normalize(270) }}>
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 13, color: Colorpath.Gray, textAlign: "center" }}>{"Recommendations are based on your profession, primary area of practice and state requirements."}</Text>
                                    </View>
                                    <View style={{ marginTop: normalize(10) }}>
                                        <Buttons
                                            onPress={() => {
                                                dispatch(clearCmeCourseData());
                                                navigation.dispatch(
                                                    CommonActions.reset({
                                                        index: 0,
                                                        routes: [
                                                            {
                                                                name: "Globalresult",
                                                                params: { trig: { rqstType: "normallist", mainKey: "listby_type", beforetake: "recommended", creditData: addit || DashboardReducer?.mainprofileResponse?.licensures?.[0] || null, backProps: "yes" } },
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
                    )}
                    {recentlyViewedCourses?.length > 0 && (
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
                                                            realdata: recentlyViewedCourses,
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
                                    height: normalize(105),
                                    width: normalize(300),
                                    borderRadius: normalize(5),
                                    backgroundColor: Colorpath.white,
                                    borderWidth: 1,
                                    borderColor: Colorpath.bordercolor,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: normalize(10)
                                }}
                            >
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <View style={{ width: normalize(270) }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterMedium,
                                                fontSize: 13,
                                                color: Colorpath.Gray,
                                                textAlign: "center"
                                            }}
                                        >
                                            {"Your recently viewed courses are listed below for easy access and continued learning."}
                                        </Text>
                                    </View>
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
                                                                        realdata: recentlyViewedCourses,
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

const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(8),
        marginBottom: normalize(4),
    },
    dot: {
        height: 7,
        marginHorizontal: 3,
    },
    inactiveDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: 'transparent',
        borderColor: '#2C4DB9',
        borderWidth: 1,
    },
    activeDot: {
        width: 22,
        height: 7,
        borderRadius: 5,
        backgroundColor: '#2C4DB9',
    },
});

/**
 * Rest profession default export.
 *
 * @returns {*}
 */
export default RestProfession
