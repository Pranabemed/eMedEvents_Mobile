import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    View,
    Platform,
    Dimensions,
    TouchableOpacity,
    Text,
    StyleSheet
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Colorpath from '../Themes/Colorpath';
import normalize from '../Utils/Helpers/Dimen';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../Utils/Helpers/NetInfo';
import { dashboardRequest, stateDashboardRequest, stateReportingRequest } from '../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../Utils/Helpers/Toast';
import HomeShimmer from './DashBoardShimmer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../Utils/Helpers/constants';
import Carouselcarditem from './Carouselcarditem';
import { staticdataRequest } from '../Redux/Reducers/AuthReducer';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
import Nonphysicianprofile from './Nonphysicianprofile';
import { cmeCourseRequest } from '../Redux/Reducers/CMEReducer';
import Buttons from './Button';
import Fonts from '../Themes/Fonts';
import NetInfo from '@react-native-community/netinfo';
import RestProfession from './RestProfession';

const normalizeProfessionHandle = (professionHandle) =>
    String(professionHandle || '')
        .toLowerCase()
        .replace(/\s+/g, '')
        .trim();

let status = "";
export default function NonPhysicianCat({ finalProfessionmain, setPrimeadd, enables, setStateCount, fetcheddt, stateCount, fulldashbaord, setFulldashbaord, cmecourse, setTakestate, takestate, setAddit, addit }) {
    const DASHBOARD_REFRESH_MS = 60000;
    const dispatch = useDispatch();
    const {
        setTakedata,
        setIsConnected,
        expireDate,
        setFinddata,
        finddata
    } = useContext(AppContext);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const CMEReducer = useSelector(state => state.CMEReducer);
    const navigation = useNavigation();
    const [val, setval] = useState(0);
    const [detailsmodal, setDetailsmodal] = useState(false);
    const [cmemodal, setCmemodal] = useState(false);
    const [vaultModal, setVaultmodal] = useState(false);
    const [totalcard, setTotalCred] = useState();
    const [stateid, setStateid] = useState();
    const [renewal, setRenewal] = useState("");
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pageNum, setPageNum] = useState(0);
    const [limit, setLimit] = useState(9);
    const [wholeNo, setWholeNo] = useState(false);
    const lastDashboardSyncRef = useRef(0);
    const lastStateSyncRef = useRef(null);
    const dashboardFetchInFlightRef = useRef(false);
    // Get the current item without scrolling
    const getCurrentItem = () => {
        if (!fulldashbaord?.length) return null;
        return fulldashbaord[currentIndex]; // <-- Uses state-tracked index
    };
    const isFocus = useIsFocused();
    useEffect(() => {
        const tokenHandle = async () => {
            try {
                if (!isFocus) return;
                const loginHandle = await AsyncStorage.getItem(constants.TOKEN);
                if (!loginHandle) return;
                const hasDashboardData = Array.isArray(DashboardReducer?.dashboardResponse?.data?.licensures);
                const isStale = (Date.now() - lastDashboardSyncRef.current) > DASHBOARD_REFRESH_MS;
                if (!hasDashboardData || isStale) {
                    dashBoarData();
                }
            } catch (error) {
                console.log(error);
            }
        };
        tokenHandle();
    }, [isFocus, DashboardReducer?.dashboardResponse?.data?.licensures?.length]);
    useEffect(() => {
        if (DashboardReducer?.dashboardResponse?.data) {
            lastDashboardSyncRef.current = Date.now();
        }
    }, [DashboardReducer?.dashboardResponse?.data]);
    useEffect(() => {
        if (DashboardReducer.status === 'Dashboard/dashboardSuccess' || DashboardReducer.status === 'Dashboard/dashboardFailure') {
            dashboardFetchInFlightRef.current = false;
        }
    }, [DashboardReducer.status]);
    const dashBoarData = () => {
        if (dashboardFetchInFlightRef.current) return;
        dashboardFetchInFlightRef.current = true;
        connectionrequest()
            .then(() => {
                dispatch(dashboardRequest({}))
            })
            .catch(err => {
                dashboardFetchInFlightRef.current = false;
                showErrorAlert("Please connect to internet", err)
            })

    }
    const restOfProfession = () => {
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
        let obj =
        {
            "pageno": 0,
            "limit": 9,
            "search_speciality": "",
            "conference_type_text": "",
            "cme_from": "",
            "cme_to": "",
            "organization": "",
            "price_from": "",
            "price_to": "",
            "startdate": "",
            "location": "",
            "free_conf": "",
            "noncme": "",
            "speaker": "",
            "search_mandate_states": [],
            "search_topic": "",
            "search_profession": "",
            "credittype": "",
            "sort_type": "",
            "request_type": "professionconferences",
            "conference_profession": handleProf
        }
        connectionrequest()
            .then(() => {
                dispatch(cmeCourseRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
                setLoading(false);
            });
    }
    const stateTake = (toklen, anoth) => {
        let obj = {
            "state": toklen ? toklen?.length : 0,
            "board": anoth ? anoth?.length : 0
        };
        connectionrequest()
            .then(() => {
                dispatch(staticdataRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to the internet", err);
            });
    }
    const validHandles = new Set(["physician-md", "physician-do", "physician-dpm"]);
    const otherRestrict = new Set(["nursing-aprn", "nursing-cna", "nursing-lpn", "nursing-rn", "dentist-dds", "dentist-rda", "dentist-rdh"]);
    const authProfession =
        AuthReducer?.loginResponse?.user?.profession && AuthReducer?.loginResponse?.user?.profession_type
            ? `${AuthReducer?.loginResponse?.user?.profession} - ${AuthReducer?.loginResponse?.user?.profession_type}`
            : AuthReducer?.againloginsiginResponse?.user?.profession && AuthReducer?.againloginsiginResponse?.user?.profession_type
                ? `${AuthReducer?.againloginsiginResponse?.user?.profession} - ${AuthReducer?.againloginsiginResponse?.user?.profession_type}`
                : AuthReducer?.signupResponse?.user?.profession && AuthReducer?.signupResponse?.user?.profession_type
                    ? `${AuthReducer?.signupResponse?.user?.profession} - ${AuthReducer?.signupResponse?.user?.profession_type}`
                    : finalProfessionmain?.profession && finalProfessionmain?.profession_type
                        ? `${finalProfessionmain?.profession} - ${finalProfessionmain?.profession_type}`
                        : null;
    const profFromDashboard =
        DashboardReducer?.mainprofileResponse?.professional_information?.profession != null &&
            DashboardReducer?.mainprofileResponse?.professional_information?.profession_type != null
            ? `${DashboardReducer?.mainprofileResponse?.professional_information?.profession} - ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type}`
            : null;
    const resolvedProfessionHandle = normalizeProfessionHandle(profFromDashboard || authProfession);
    const allProfTake = validHandles.has(resolvedProfessionHandle);
    const allNoDetData = otherRestrict.has(resolvedProfessionHandle);
    if (status == '' || DashboardReducer.status != status) {
        switch (DashboardReducer.status) {
            case 'Dashboard/dashboardRequest':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/dashboardSuccess':
                status = DashboardReducer.status;
                if (DashboardReducer?.dashboardResponse?.data?.licensures == 0) {
                    setWholeNo(true);
                } else {
                    setWholeNo(false);
                }
                const uniqueStates = DashboardReducer?.dashboardResponse?.data?.licensures?.filter((state, index, self) => {
                    return index === self.findIndex((s) =>
                        s.state_id === state.state_id &&
                        s.board_id === state.board_id
                    );
                });
                const mainDataCheck = DashboardReducer?.dashboardResponse?.data?.board_certifications;
                if (mainDataCheck) {
                    const uniqueMainDatacheck = mainDataCheck.filter(
                        (item, index, self) => index === self.findIndex((t) => t.board_id === item.board_id)
                    );
                    if (uniqueStates?.length > 0 || uniqueMainDatacheck?.length > 0) {
                        stateTake(uniqueStates, uniqueMainDatacheck);
                    }
                }
                setFulldashbaord(uniqueStates);
                break;
            case 'Dashboard/dashboardFailure':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/stateDashboardRequest':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/stateDashboardSuccess':
                status = DashboardReducer.status;
                setFinddata(DashboardReducer?.stateDashboardResponse?.data);
                break;
            case 'Dashboard/stateDashboardFailure':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/stateReportingRequest':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/stateReportingSuccess':
                status = DashboardReducer.status;
                if (DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link) {
                    setRenewal(DashboardReducer.stateReportingResponse.renewal_report.renewal_link);
                } else {
                    setRenewal(null);
                }
                break;
            case 'Dashboard/stateReportingFailure':
                status = DashboardReducer.status;
                break;
        }
    }
    useEffect(() => {
        if (fulldashbaord?.length == 0) {
            lastStateSyncRef.current = null;
            setWholeNo(true);
            restOfProfession();
        }
    }, [fulldashbaord])
    const [completedCount, setCompletedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const activities = DashboardReducer?.stateDashboardResponse?.data?.my_activities || [];
        let total = 0;
        let completed = 0;
        activities?.forEach((d) => {
            if (d?.completed_percentage !== undefined) {
                total++;
                if (d?.completed_percentage === 100) {
                    completed++;
                }
            }
        });
        setCompletedCount(completed);
        setPendingCount(total - completed);

    }, [DashboardReducer?.stateDashboardResponse?.data]);
    const [nettrue, setNettrue] = useState("");
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setNettrue(state.isConnected);
        });

        return () => unsubscribe();
    }, []);
    const handleRot = () => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                navigation.navigate("TabNav")
            }
        });
        return () => unsubscribe();
    }
    const cleanNumber = (value) => {
        if (typeof value == 'number') return value;
        if (typeof value == 'string') {
            const num = parseFloat(value.replace(/,/g, ''));
            return isNaN(num) ? 0 : num;
        }
        return 0;
    };
    const getDtaa = fulldashbaord?.[0];
    const topicEarned = cleanNumber(
        addit?.credits_data?.topic_earned_credits !== undefined && addit?.credits_data?.topic_earned_credits !== null
            ? (addit.credits_data.topic_earned_credits == "0.00" ? 0 : addit.credits_data.topic_earned_credits)
            : getDtaa?.credits_data?.topic_earned_credits
    );
    const topicTotal = cleanNumber(
        addit?.credits_data?.topic_credits !== undefined && addit?.credits_data?.topic_credits !== null
            ? (addit.credits_data.topic_credits == "0.00" ? 0 : addit.credits_data.topic_credits)
            : getDtaa?.credits_data?.topic_credits
    );
    const generalEarned = cleanNumber(
        addit?.credits_data?.total_general_earned_credits !== undefined && addit?.credits_data?.total_general_earned_credits !== null
            ? (addit.credits_data.total_general_earned_credits == "0.00" ? 0 : addit.credits_data.total_general_earned_credits)
            : getDtaa?.credits_data?.total_general_earned_credits
    );
    const generalTotal = cleanNumber(
        addit?.credits_data?.total_general_credits !== undefined && addit?.credits_data?.total_general_credits !== null
            ? (addit.credits_data.total_general_credits == "0.00" ? 0 : addit.credits_data.total_general_credits)
            : getDtaa?.credits_data?.total_general_credits
    );
    const bothNoRequirement = (
        topicEarned == 0 && topicTotal == 0 &&
        generalEarned == 0 && generalTotal == 0
    );
    const firstData =
        AuthReducer?.loginResponse?.user?.firstname ||
        AuthReducer?.againloginsiginResponse?.user?.firstname ||
        AuthReducer?.signupResponse?.user?.firstname ||
        DashboardReducer?.dashboardResponse?.data?.user_information?.firstname ||
        DashboardReducer?.dashPerResponse?.data?.user_information?.firstname ||
        DashboardReducer?.mainprofileResponse?.personal_information?.firstname;
    const hasLicensureCards = Array.isArray(fulldashbaord) && fulldashbaord.length > 0;
    const hasResolvedDashboard =
        fulldashbaord == 0 ||
        Array.isArray(fulldashbaord) ||
        DashboardReducer.status == 'Dashboard/dashboardFailure';

    return (
        <>

            <View>
                {hasResolvedDashboard && <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 20, color: Colorpath.ButtonColr, marginTop: normalize(10) }}>{`Hello, ${firstData || ''}`}</Text>
                </View>}
                {hasLicensureCards ?
                    <View key={`dashboard-${fulldashbaord.length}`}>
                        <View style={{ height: allProfTake ? normalize(260) : bothNoRequirement ? normalize(210) : expireDate && !allProfTake ? normalize(250) : normalize(255), width: normalize(320), alignSelf: "center", backgroundColor: Colorpath.ButtonColr }}>
                            <Carousel
                                ref={carouselRef}
                                layout={'default'}
                                data={fulldashbaord}
                                marginTop={normalize(10)}
                                sliderWidth={windowWidth}
                                itemWidth={
                                    Platform.OS === 'ios' ? windowWidth - normalize(20) : windowWidth - normalize(20)
                                }
                                itemHeight={windowHeight * 0.9}
                                sliderHeight={windowHeight * 0.9}
                                renderItem={({ item, index }) => <Carouselcarditem setPrimeadd={setPrimeadd} enables={enables} setStateCount={setStateCount} fetcheddt={fetcheddt} stateCount={stateCount} renewal={renewal} val={val} index={index} item={item} stateid={stateid} navigation={navigation} />}
                                firstItem={0}
                                onSnapToItem={(index) => {
                                    setval(index);
                                    setCurrentIndex(index);
                                    const getDtaa = fulldashbaord?.[index] || fulldashbaord?.[0];
                                    if (getDtaa) {
                                        const nextStateId = getDtaa.state_id;
                                        if (lastStateSyncRef.current !== nextStateId) {
                                            dispatch(stateDashboardRequest({ "state_id": nextStateId }))
                                            dispatch(stateReportingRequest({ "state_id": nextStateId }))
                                            lastStateSyncRef.current = nextStateId;
                                        }
                                        // stateDashboardData(getDtaa.state_id);
                                        // stateReport(getDtaa.state_id);
                                        const responseData = DashboardReducer?.stateDashboardResponse?.data;
                                        setFinddata(responseData);
                                        setAddit(getDtaa);
                                        setTakedata(getDtaa);
                                        setTakestate(getDtaa.board_id);
                                        setStateid(getDtaa.state_id);
                                        const { topic_earned_credits = 0, total_general_earned_credits = 0 } = getDtaa.credits_data || {};
                                        setTotalCred(topic_earned_credits + total_general_earned_credits);
                                    }
                                }}
                            />
                            <View style={styles.paginationContainer}>
                                {fulldashbaord && fulldashbaord?.length >= 2 && fulldashbaord?.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.dot,
                                            currentIndex === index ? styles.activeDot : styles.inactiveDot
                                        ]}
                                    />
                                ))}
                            </View>
                        </View>
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
                        <Nonphysicianprofile allNoDetData={allNoDetData} addit={addit} finddata={finddata} handleButtonPress={getCurrentItem()} navigation={navigation} DashboardReducer={DashboardReducer} />
                    </View> : hasResolvedDashboard ? (
                        <View style={{ flex: 1 }}>
                            <View style={{
                                width: '92%',
                                alignSelf: 'center',
                                marginTop: normalize(15),
                                backgroundColor: '#F0F8FF',
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: '#E1EDFB',
                                paddingHorizontal: normalize(15),
                                paddingVertical: normalize(15),
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                shadowColor: '#2C4DB9',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 4,
                                elevation: 2,
                            }}>
                                {/* Left Column: Text & Button */}
                                <View style={{ flex: 1.8, paddingRight: normalize(8) }}>
                                    <Text style={{
                                        fontFamily: Fonts.InterBold || 'System',
                                        fontSize: normalize(15),
                                        fontWeight: '700',
                                        color: '#1E293B',
                                        marginBottom: normalize(6),
                                    }}>
                                        ADD ALL YOUR STATE LICENSES
                                    </Text>
                                    <Text style={{
                                        fontFamily: Fonts.InterRegular || 'System',
                                        fontSize: normalize(12),
                                        color: '#475569',
                                        lineHeight: 18,
                                        marginBottom: normalize(15),
                                    }}>
                                        Easily monitor CME requirements across states — all in one dashboard.
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate("AddLicense", { newData: "yes" });
                                        }}
                                        style={{
                                            backgroundColor: '#2C4DB9',
                                            paddingVertical: normalize(10),
                                            paddingHorizontal: normalize(10),
                                            borderRadius: 6,
                                            width: '100%',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            adjustsFontSizeToFit={true}
                                            minimumFontScale={0.8}
                                            style={{
                                                color: '#FFFFFF',
                                                fontFamily: Fonts.InterSemiBold || 'System',
                                                fontSize: normalize(13),
                                                fontWeight: '600',
                                                textAlign: 'center',
                                            }}
                                        >
                                            + Add my License(s)
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Right Column: Graphic Mockup */}
                                <View style={{ flex: 0.8, alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <View style={{ position: 'relative', width: normalize(110), height: normalize(80) }}>
                                        {/* Soft background glow */}
                                        <View style={{
                                            position: 'absolute',
                                            width: normalize(70),
                                            height: normalize(70),
                                            borderRadius: normalize(35),
                                            backgroundColor: '#E0EEFF',
                                            opacity: 0.6,
                                            left: normalize(15),
                                            top: normalize(5),
                                        }} />

                                        {/* Background card stacked behind */}
                                        <View style={{
                                            position: 'absolute',
                                            width: normalize(85),
                                            height: normalize(55),
                                            borderRadius: 6,
                                            backgroundColor: '#FFFFFF',
                                            borderWidth: 1,
                                            borderColor: '#E2E8F0',
                                            left: normalize(10),
                                            top: normalize(15),
                                            opacity: 0.7,
                                        }} />

                                        {/* Main Foreground Card Mockup */}
                                        <View style={{
                                            position: 'absolute',
                                            width: normalize(85),
                                            height: normalize(55),
                                            borderRadius: 6,
                                            backgroundColor: '#FFFFFF',
                                            borderWidth: 1,
                                            borderColor: '#E2E8F0',
                                            left: normalize(15),
                                            top: normalize(10),
                                            padding: 6,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.05,
                                            shadowRadius: 3,
                                            elevation: 1,
                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                                {/* Tiny Avatar/Profile placeholder */}
                                                <View style={{
                                                    width: 14,
                                                    height: 14,
                                                    borderRadius: 7,
                                                    backgroundColor: '#93C5FD',
                                                    marginRight: 4,
                                                }} />
                                                {/* Header bar */}
                                                <View style={{
                                                    width: 35,
                                                    height: 4,
                                                    borderRadius: 2,
                                                    backgroundColor: '#93C5FD',
                                                }} />
                                            </View>
                                            {/* Horizontal line placeholders */}
                                            <View style={{ width: '90%', height: 3, borderRadius: 1.5, backgroundColor: '#E2E8F0', marginBottom: 4 }} />
                                            <View style={{ width: '75%', height: 3, borderRadius: 1.5, backgroundColor: '#E2E8F0', marginBottom: 4 }} />
                                            <View style={{ width: '50%', height: 3, borderRadius: 1.5, backgroundColor: '#E2E8F0' }} />
                                        </View>

                                        {/* Blue Plus Button on top-right of main card */}
                                        <View style={{
                                            position: 'absolute',
                                            right: normalize(5),
                                            top: normalize(2),
                                            width: 24,
                                            height: 24,
                                            borderRadius: 12,
                                            backgroundColor: '#0084FF',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            elevation: 3,
                                        }}>
                                            <Text style={{
                                                color: '#FFFFFF',
                                                fontSize: 15,
                                                fontWeight: 'bold',
                                                lineHeight: 16,
                                            }}>+</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <RestProfession
                                finalProfessionmain={finalProfessionmain}
                                setPrimeadd={setPrimeadd}
                                enables={enables}
                                addit={addit}
                                takestate={takestate}
                                navigation={navigation}
                                completedCount={completedCount}
                                pendingCount={pendingCount}
                                DashboardReducer={DashboardReducer}
                                CMEReducer={CMEReducer}
                            />
                        </View>
                    ) : <HomeShimmer />}
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 15
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 3
    },
    inactiveDot: {
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: Colorpath.ButtonColr,
        borderColor: "#FFFFFF",
        borderWidth: 1,
    },
    activeDot: {
        width: 25,
        height: 8,
        borderRadius: 10,
        backgroundColor: Colorpath.white,
    }
})
