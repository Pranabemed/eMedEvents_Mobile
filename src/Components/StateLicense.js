import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import {
    View,
    Platform,
    Dimensions,
    TouchableOpacity,
    Image,
    Text,
    StyleSheet
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Colorpath from '../Themes/Colorpath';
import normalize from '../Utils/Helpers/Dimen';
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native';
import TextModal from './TextModal';
import Cmemodal from './Cmemodal';
import CreditValult from './CreditValult';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../Utils/Helpers/NetInfo';
import { dashboardRequest, stateDashboardRequest, stateReportingRequest } from '../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../Utils/Helpers/Toast';
import HomeShimmer from './DashBoardShimmer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../Utils/Helpers/constants';
import Carouselcarditem from './Carouselcarditem';
import Dashboardmain from './Dashboardmain';
import { staticdataRequest } from '../Redux/Reducers/AuthReducer';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
import { cmeCourseRequest } from '../Redux/Reducers/CMEReducer';
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import Buttons from './Button';
import moment from 'moment';
let status = "";
export default function StateLicense({ propsData, setRenewal, renewal, setStateid, stateid, setTotalCred, totalcard, finalProfessionmain, setPrimeadd, enables, setStateCount, fetcheddt, stateCount, fulldashbaord, setFulldashbaord, cmecourse, setTakestate, takestate, setAddit, addit }) {
    const DASHBOARD_REFRESH_MS = 60000;
    const dispatch = useDispatch();
    const {
        setTakedata,
        expireDate,
        setFinddata,
        finddata,
        setStatepush,
        statepush,
        gtprof
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
    const carouselRef = useRef(null);
    const initialSyncDoneRef = useRef(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pageNum, setPageNum] = useState(0);
    const [limit, setLimit] = useState(9);
    const [wholeNo, setWholeNo] = useState(false);
    const [cachedLastName, setCachedLastName] = useState('');
    const lastDashboardSyncRef = useRef(0);
    const lastStateSyncRef = useRef(null);
    const dashboardFetchInFlightRef = useRef(false);
    const getCurrentItem = () => {
        if (!fulldashbaord?.length) return null;
        return fulldashbaord[currentIndex];
    };
    const modalFalse = () => {
        setDetailsmodal(true);
    }
    const cmeModalFalse = () => {
        setCmemodal(true);
    }
    const cmeValult = () => {
        setVaultmodal(!vaultModal);
    }
    const firstData = DashboardReducer?.mainprofileResponse?.personal_information?.lastname || AuthReducer?.loginResponse?.user?.lastname || DashboardReducer?.dashboardResponse?.data?.user_information?.lastname || DashboardReducer?.dashPerResponse?.data?.user_information?.lastname || cachedLastName;
    const isFocus = useIsFocused();
    useEffect(() => {
        const hydrateCachedName = async () => {
            try {
                const raw = await AsyncStorage.getItem(constants.PRODATA);
                if (!raw) return;
                const parsed = JSON.parse(raw);
                if (parsed?.lastname) {
                    setCachedLastName(parsed.lastname);
                }
            } catch (error) {
                // ignore cache parse issues; live API data will still render
            }
        };
        hydrateCachedName();
    }, [isFocus]);
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
    const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
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
    const allProfTake = gtprof || validHandles.has(profFromDashboard) || validHandles.has(authProfession);
    const derivedRemainingStates = useMemo(() => {
        const licensureStates = AuthReducer?.licesensResponse?.licensure_states;
        if (!Array.isArray(licensureStates) || !licensureStates.length) return [];

        const existingStateIds = new Set(
            Array.isArray(fulldashbaord) ? fulldashbaord.map((dash) => dash?.state_id) : []
        );
        const stateMap = new Map();
        licensureStates.forEach((state) => {
            if (state?.id != null && !stateMap.has(state.id)) {
                stateMap.set(state.id, state);
            }
        });
        return Array.from(stateMap.values()).filter((state) => !existingStateIds.has(state.id));
    }, [AuthReducer?.licesensResponse?.licensure_states, fulldashbaord]);

    const canAddLicenses =
        allProfTake &&
        (() => {
            const contextHasRemaining = Array.isArray(stateCount) && stateCount.length > 0;
            const licensureHasRemaining = derivedRemainingStates.length > 0;

            // Secondary source available earlier in many flows.
            const existingStateIds = new Set(
                Array.isArray(fulldashbaord) ? fulldashbaord.map((dash) => dash?.state_id) : []
            );
            const chooseStateLicensures = Array.isArray(AuthReducer?.chooseStatecardResponse?.state_licensures)
                ? AuthReducer.chooseStatecardResponse.state_licensures
                : [];
            const chooseStateRemaining = chooseStateLicensures.filter((item) => {
                const stateId = item?.id ?? item?.state_id;
                return stateId != null && !existingStateIds.has(stateId);
            });
            const chooseStateHasRemaining = chooseStateRemaining.length > 0;

            const contextLoaded = Array.isArray(stateCount);
            const licensureLoaded = Array.isArray(AuthReducer?.licesensResponse?.licensure_states);
            const chooseStateLoaded = Array.isArray(AuthReducer?.chooseStatecardResponse?.state_licensures);

            const hasRemaining =
                contextHasRemaining || licensureHasRemaining || chooseStateHasRemaining;

            // Keep CTA visible during partial loading; hide only when all sources are loaded
            // and all of them confirm there are no remaining states.
            const allSourcesLoaded = contextLoaded && licensureLoaded && chooseStateLoaded;
            const confirmedNoRemaining = allSourcesLoaded && !hasRemaining;

            return !confirmedNoRemaining;
        })();

    useEffect(() => {
        // Keep context in sync even when Splash hasn't populated stateCount yet.
        if ((!Array.isArray(stateCount) || stateCount.length == 0) && derivedRemainingStates.length > 0) {
            setStateCount(derivedRemainingStates);
        }
    }, [stateCount, derivedRemainingStates, setStateCount]);

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
                // setFinddata(DashboardReducer?.stateDashboardResponse?.data);
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
        if (DashboardReducer?.stateDashboardResponse?.data) {
            setFinddata(DashboardReducer?.stateDashboardResponse?.data);
        }
    }, [DashboardReducer?.stateDashboardResponse])
    useEffect(() => {
        if (fulldashbaord?.length == 0) {
            setWholeNo(true);
            restOfProfession();
        }
    }, [fulldashbaord])
    const useActivityCounts = () => {
        const responseData = DashboardReducer?.stateDashboardResponse?.data;

        return useMemo(() => {
            const activities = responseData?.my_activities || [];
            let completed = 0;

            // Pre-calculate length to avoid prototype lookup
            const len = activities.length;
            for (let i = 0; i < len; i++) {
                if (activities[i]?.completed_percentage === 100) completed++;
            }

            return [completed, len - completed];
        }, [responseData]); // Only changes when whole response updates 280
    };
    const [completedCount, pendingCount] = useActivityCounts();
    const tasksData = DashboardReducer?.stateDashboardResponse?.data?.tasks_data;
    const hasTasks = useMemo(() => (
        tasksData?.due_in_30_days?.length > 0 ||
        tasksData?.due_in_60_days?.length > 0 ||
        tasksData?.due_in_90_days?.length > 0
    ), [tasksData]);
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
    const hidetext = (!enables && !bothNoRequirement);
    const getDynamicHeight = () => {
        if (enables) {
            return normalize(325)
        }
        if ((!enables && bothNoRequirement)) {
            return normalize(240);
        }
        if (allProfTake && !expireDate) {
            return normalize(320);
        }
        if (allProfTake && expireDate && bothNoRequirement) {
            return normalize(235);
        }
        if (allProfTake && expireDate) {
            return normalize(320);
        }
        if ((!enables && !bothNoRequirement)) {
            return normalize(280);
        }
        return normalize(220);
    };

    const handleAllIndex = (index) => {
        const getDtaa = fulldashbaord?.[index] || fulldashbaord?.[0];
        if (getDtaa) {
            const nextStateId = getDtaa.state_id;
            const hasStateChanged = lastStateSyncRef.current !== nextStateId;
            setval(index);
            setCurrentIndex(index);
            if (hasStateChanged) {
                dispatch(stateDashboardRequest({ "state_id": getDtaa.state_id }))
                dispatch(stateReportingRequest({ "state_id": getDtaa.state_id }));
                lastStateSyncRef.current = nextStateId;
            }
            setStatepush(getDtaa);
            const responseData = DashboardReducer?.stateDashboardResponse?.data;
            setFinddata(responseData);
            setAddit(getDtaa);
            setTakedata(getDtaa);
            setTakestate(getDtaa.board_id);
            setStateid(getDtaa.state_id);
            const { topic_earned_credits = 0, total_general_earned_credits = 0 } = getDtaa.credits_data || {};
            setTotalCred(topic_earned_credits + total_general_earned_credits);
        }
    }
    const resolvedStateId =
        statepush?.creditID?.state_id ?? statepush?.state_id;

    const matchedIndex =
        resolvedStateId != null
            ? fulldashbaord?.findIndex(item => item.state_id == resolvedStateId)
            : -1;

    const initialIndex = matchedIndex >= 0 ? matchedIndex : 0;

    useEffect(() => {
        if (matchedIndex >= 0 && carouselRef?.current) {
            carouselRef.current.snapToItem(matchedIndex, false);
        }
    }, [matchedIndex]);
    useEffect(() => {
        if (!fulldashbaord?.length) {
            initialSyncDoneRef.current = false;
            lastStateSyncRef.current = null;
            return;
        }
        if (initialSyncDoneRef.current) return;
        initialSyncDoneRef.current = true;
        handleAllIndex(initialIndex);
    }, [fulldashbaord?.length, initialIndex]);
    const finalDatCD =  statepush?.state_code || statepush?.creditID?.state_code || addit?.state_code || fulldashbaord?.[0]?.state_code;
    return (
        <>

            <View>
                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 20, color: Colorpath.ButtonColr, marginTop: normalize(10), fontWeight: "bold" }}>{`Hello, Dr. ${firstData || ''}`}</Text>
                </View>
                {fulldashbaord?.length > 0 ?
                    <View key={`dashboard-${fulldashbaord.length}`}>
                        <View style={{ height: getDynamicHeight(), width: normalize(320), alignSelf: "center", backgroundColor: Colorpath.ButtonColr }}>
                            {canAddLicenses && <TouchableOpacity
                                onPress={() => {
                                    if (enables) {
                                        setStatepush(addit);
                                        setPrimeadd(true);
                                    } else {
                                        setStatepush(addit);
                                        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "AddLicense" }] }));
                                    }
                                }}
                                style={{
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                    marginTop: Platform.OS === 'ios' ? normalize(18) : normalize(8),
                                    flexDirection: "row",
                                    gap: normalize(3)
                                }}
                            >
                                <Image source={Imagepath.PlusNew} style={{ height: normalize(16), width: normalize(17), resizeMode: 'contain' }} />
                                <Text style={Platform.OS === 'ios' ? {
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                    bottom: normalize(1),
                                    flexDirection: "row",
                                    gap: normalize(3),
                                    marginRight: normalize(15),
                                    color: "#FFFFFF",
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 14,
                                    fontWeight: "bold"
                                } : {
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                    marginTop: normalize(10),
                                    flexDirection: "row",
                                    gap: normalize(3),
                                    marginRight: normalize(12),
                                    color: "#FFFFFF",
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 14,
                                    fontWeight: "bold"
                                }}>{"Add Licenses"}</Text>
                            </TouchableOpacity>}
                            <Carousel
                                ref={carouselRef}
                                layout={'default'}
                                data={fulldashbaord}
                                marginTop={normalize(0)}
                                sliderWidth={windowWidth}
                                itemWidth={
                                    Platform.OS === 'ios' ? windowWidth - normalize(20) : windowWidth - normalize(20)
                                }
                                itemHeight={windowHeight * 0.9}
                                sliderHeight={windowHeight * 0.9}
                                scrollAnimationDuration={1000}
                                renderItem={({ item, index }) => <Carouselcarditem hidetext={hidetext} setPrimeadd={setPrimeadd} enables={enables} setStateCount={setStateCount} fetcheddt={fetcheddt} stateCount={stateCount} renewal={renewal} val={val} index={index} item={item} stateid={stateid} navigation={navigation} />}
                                firstItem={initialIndex || 0}
                                onSnapToItem={(index) => {
                                    handleAllIndex(index);
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
                            {(!enables && !bothNoRequirement) ? <View>
                                <Buttons
                                    onPress={() => {
                                        if (enables) {
                                            setPrimeadd(true);
                                        } else {
                                            setStatepush(addit);
                                            navigation.dispatch(
                                                CommonActions.reset({
                                                    index: 0,
                                                    routes: [
                                                        {
                                                            name: "ChooseSpecailization",
                                                            params: { stateID: getCurrentItem() }
                                                        }
                                                    ]
                                                })
                                            );
                                        }
                                    }}
                                    height={normalize(40)}
                                    width={normalize(300)}
                                    backgroundColor={"#2896CD"}
                                    borderRadius={normalize(5)}
                                    text={`View Courses for ${finalDatCD} State Compliance`}
                                    color={Colorpath.white}
                                    fontSize={16}
                                    fontFamily={Fonts.InterSemiBold}
                                    fontWeight={"bold"}
                                    marginBottom={normalize(10)}
                                    source={"arrow-right"}
                                    image={true}
                                    size={20}
                                    imageMarginLeft={normalize(277)}
                                    loading={false}
                                    imarginRight={normalize(20)}
                                    iconPress={() => {
                                        if (enables) {
                                            setPrimeadd(true);
                                        } else {
                                            navigation.dispatch(
                                                CommonActions.reset({
                                                    index: 0,
                                                    routes: [
                                                        {
                                                            name: "ChooseSpecailization",
                                                            params: { stateID: getCurrentItem() }
                                                        }
                                                    ]
                                                })
                                            );
                                        }
                                    }}
                                />
                            </View> : (!bothNoRequirement && enables) ? <View>
                                <Buttons
                                    onPress={() => {
                                        if (enables) {
                                            setPrimeadd(true);
                                        } else {
                                            setStatepush(addit);
                                            navigation.dispatch(
                                                CommonActions.reset({
                                                    index: 0,
                                                    routes: [
                                                        {
                                                            name: "ChooseSpecailization",
                                                            params: { stateID: getCurrentItem() }
                                                        }
                                                    ]
                                                })
                                            );
                                        }
                                    }}
                                    height={normalize(40)}
                                    width={normalize(300)}
                                    backgroundColor={"#2896CD"}
                                    borderRadius={normalize(5)}
                                    text={`View Courses for ${finalDatCD} State Compliance`}
                                    color={Colorpath.white}
                                    fontSize={16}
                                    fontFamily={Fonts.InterSemiBold}
                                    fontWeight={"bold"}
                                    marginBottom={normalize(10)}
                                    source={"arrow-right"}
                                    image={true}
                                    size={20}
                                    imageMarginLeft={normalize(277)}
                                    loading={false}
                                    imarginRight={normalize(20)}
                                    iconPress={() => {
                                        if (enables) {
                                            setPrimeadd(true);
                                        } else {
                                            navigation.dispatch(
                                                CommonActions.reset({
                                                    index: 0,
                                                    routes: [
                                                        {
                                                            name: "ChooseSpecailization",
                                                            params: { stateID: getCurrentItem() }
                                                        }
                                                    ]
                                                })
                                            );
                                        }
                                    }}
                                />
                            </View> : null}
                        </View>
                        {allProfTake ? <View
                            style={{
                                width: normalize(320),
                                alignSelf: 'center',
                            }}>
                            <Dashboardmain statepush={statepush} allProfTake={allProfTake} finddata={finddata} setPrimeadd={setPrimeadd} enables={enables} handleButtonPress={getCurrentItem()} setAddit={setAddit} addit={addit} setTakestate={setTakestate} takestate={takestate} cmecourse={cmecourse} tasksData={tasksData} cmeValult={cmeValult} navigation={navigation} completedCount={completedCount} pendingCount={pendingCount} hasTasks={hasTasks} DashboardReducer={DashboardReducer} totalcard={totalcard} />
                        </View> : null}

                        <TextModal setDetailsmodal={setDetailsmodal} isVisible={detailsmodal} onFalse={modalFalse} />
                        <Cmemodal setCmemodal={setCmemodal} isModal={cmemodal} onCmeFalse={cmeModalFalse} />
                        <CreditValult isVault={vaultModal} onVaultFalse={cmeValult} />
                    </View> : <HomeShimmer />}
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: Platform.OS === 'ios' ? normalize(18) : normalize(10)
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
        backgroundColor: Colorpath.white, // make active dot longer for effect
    }
})
