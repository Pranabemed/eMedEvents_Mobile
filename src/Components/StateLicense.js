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
import { licesensRequest, staticdataRequest } from '../Redux/Reducers/AuthReducer';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
import { cmeCourseRequest } from '../Redux/Reducers/CMEReducer';
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import Buttons from './Button';
import moment from 'moment';

const normalizeProfessionHandle = (professionHandle) =>
    String(professionHandle || '')
        .toLowerCase()
        .replace(/\s+/g, '')
        .trim();

const findMatchedProfessionHandle = (candidates, supportedHandles) => {
    for (const candidate of candidates) {
        const normalizedCandidate = normalizeProfessionHandle(candidate);
        if (!normalizedCandidate) continue;

        for (const handle of supportedHandles) {
            if (normalizedCandidate === handle || normalizedCandidate.includes(handle)) {
                return handle;
            }
        }
    }

    return '';
};

const buildProfessionLabel = (profession, professionType) => {
    const cleanProfession = String(profession || '').trim();
    const cleanProfessionType = String(professionType || '').trim();

    if (!cleanProfession) return '';
    if (!cleanProfessionType) return cleanProfession;

    const normalizedProfession = normalizeProfessionHandle(cleanProfession);
    const normalizedProfessionType = normalizeProfessionHandle(cleanProfessionType);

    if (normalizedProfession.endsWith(`-${normalizedProfessionType}`)) {
        return cleanProfession;
    }

    return `${cleanProfession} - ${cleanProfessionType}`;
};

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
    const ProfileReducer = useSelector(state => state.ProfileReducer);
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
    const stableNameRef = useRef({ first: '', last: '' });
    const lastDashboardSyncRef = useRef(0);
    const lastStateSyncRef = useRef(null);
    const dashboardFetchInFlightRef = useRef(false);
    const lastLicensureProfessionRef = useRef('');
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
    const cleanText = (val) => (typeof val == "string" ? val.trim() : "");
    const resolvedLastName = cleanText(
        DashboardReducer?.mainprofileResponse?.personal_information?.lastname,
    );
    const fallbackLastName = cleanText(
        AuthReducer?.loginResponse?.user?.lastname ||
        AuthReducer?.againloginsiginResponse?.user?.lastname ||
        AuthReducer?.signupResponse?.user?.lastname ||
        DashboardReducer?.dashboardResponse?.data?.user_information?.lastname ||
        DashboardReducer?.dashPerResponse?.data?.user_information?.lastname ||
        finalProfessionmain?.lastname ||
        cachedLastName
    );
    const resolvedFirstName = cleanText(
        DashboardReducer?.mainprofileResponse?.personal_information?.firstname,
    );
    const fallbackFirstName = cleanText(
        AuthReducer?.loginResponse?.user?.firstname ||
        AuthReducer?.againloginsiginResponse?.user?.firstname ||
        AuthReducer?.signupResponse?.user?.firstname ||
        DashboardReducer?.dashboardResponse?.data?.user_information?.firstname ||
        DashboardReducer?.dashPerResponse?.data?.user_information?.firstname ||
        finalProfessionmain?.firstname
    );
    const nextLastName = resolvedLastName || fallbackLastName;
    const nextFirstName = resolvedFirstName || fallbackFirstName;
    if (nextLastName) stableNameRef.current.last = nextLastName;
    if (nextFirstName) stableNameRef.current.first = nextFirstName;
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
    const latestProfessionLabel = buildProfessionLabel(
        ProfileReducer?.latestProfessionInfo?.profession,
        ProfileReducer?.latestProfessionInfo?.profession_type
    );
    const latestProfileProfession =
        latestProfessionLabel || null;
    const dashboardProfessionLabel = buildProfessionLabel(
        DashboardReducer?.mainprofileResponse?.professional_information?.profession,
        DashboardReducer?.mainprofileResponse?.professional_information?.profession_type
    );
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
        dashboardProfessionLabel || null;
    const latestLicensureProfessionLabel =
        latestProfessionLabel ||
        dashboardProfessionLabel ||
        authProfession ||
        buildProfessionLabel(finalProfessionmain?.profession, finalProfessionmain?.profession_type) ||
        buildProfessionLabel(
            DashboardReducer?.dashPerResponse?.data?.user_information?.profession,
            DashboardReducer?.dashPerResponse?.data?.user_information?.profession_type
        );
    const resolvedProfessionHandle = findMatchedProfessionHandle(
        [
            latestProfileProfession,
            ProfileReducer?.latestProfessionInfo?.profession,
            `${ProfileReducer?.latestProfessionInfo?.profession || ''} ${ProfileReducer?.latestProfessionInfo?.profession_type || ''}`,
            profFromDashboard,
            DashboardReducer?.mainprofileResponse?.professional_information?.profession,
            `${DashboardReducer?.mainprofileResponse?.professional_information?.profession || ''} ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type || ''}`,
            authProfession,
            AuthReducer?.loginResponse?.user?.profession,
            `${AuthReducer?.loginResponse?.user?.profession || ''} ${AuthReducer?.loginResponse?.user?.profession_type || ''}`,
            AuthReducer?.againloginsiginResponse?.user?.profession,
            `${AuthReducer?.againloginsiginResponse?.user?.profession || ''} ${AuthReducer?.againloginsiginResponse?.user?.profession_type || ''}`,
            AuthReducer?.signupResponse?.user?.profession,
            `${AuthReducer?.signupResponse?.user?.profession || ''} ${AuthReducer?.signupResponse?.user?.profession_type || ''}`,
            finalProfessionmain?.profession,
            `${finalProfessionmain?.profession || ''} ${finalProfessionmain?.profession_type || ''}`,
            DashboardReducer?.dashPerResponse?.data?.user_information?.profession,
            `${DashboardReducer?.dashPerResponse?.data?.user_information?.profession || ''} ${DashboardReducer?.dashPerResponse?.data?.user_information?.profession_type || ''}`,
        ],
        [...validHandles]
    );
    const allProfTake = gtprof || validHandles.has(resolvedProfessionHandle);
    const isPhysicianGreeting = Boolean(gtprof || allProfTake);
    const displayLastName = stableNameRef.current.last || nextLastName;
    const displayFirstName = stableNameRef.current.first || nextFirstName;
    const greetingText = isPhysicianGreeting
        ? `Hello, Dr.${displayLastName ? ` ${displayLastName}` : ""}`
        : `Hello, ${displayFirstName}`;
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
            const isGlobalLoading =
                AuthReducer?.status?.toLowerCase().includes('dashboardrequest') ||
                AuthReducer?.status?.toLowerCase().includes('licesensrequest') ||
                DashboardReducer?.status?.toLowerCase().includes('dashboardrequest');

            // Bias towards TRUE only while GLOBAL related API is in flight
            if (isGlobalLoading) return true;

            const contextLoaded = Array.isArray(stateCount);
            const licensureLoaded = !!AuthReducer?.licesensResponse?.licensure_states;
            const chooseStateLoaded = !!AuthReducer?.chooseStatecardResponse?.state_licensures;

            const existingStateIds = new Set(
                Array.isArray(fulldashbaord) ? fulldashbaord.map((dash) => dash?.state_id) : []
            );

            const contextHasRemaining = contextLoaded && stateCount.length > 0;
            const licensureHasRemaining = licensureLoaded && derivedRemainingStates.length > 0;

            const chooseStateLicensures = Array.isArray(AuthReducer?.chooseStatecardResponse?.state_licensures)
                ? AuthReducer.chooseStatecardResponse.state_licensures
                : [];
            const chooseStateRemaining = chooseStateLicensures.filter((item) => {
                const stateId = item?.id ?? item?.state_id;
                return stateId != null && !existingStateIds.has(stateId);
            });
            const chooseStateHasRemaining = chooseStateLoaded && chooseStateRemaining.length > 0;

            const hasRemaining =
                contextHasRemaining || licensureHasRemaining || chooseStateHasRemaining;

            // Wait until ALL primary sources have responded at least once
            const allSourcesLoaded = contextLoaded && licensureLoaded && chooseStateLoaded;

            // IF we aren't loaded yet, default to TRUE (keeps button visible during refresh)
            if (!allSourcesLoaded) return true;

            const result = hasRemaining;
            if (!result) {
                console.log(`[StateLicense/canAddLicenses] ${Date.now()} - Hiding`, {
                    context: stateCount?.length,
                    licensure: derivedRemainingStates.length,
                    chooseState: chooseStateRemaining.length
                });
            }
            return result;
        })();

    useEffect(() => {
        // Keep context in sync even when Splash hasn't populated stateCount yet.
        if ((!Array.isArray(stateCount) || stateCount.length == 0) && derivedRemainingStates.length > 0) {
            setStateCount(derivedRemainingStates);
        }
    }, [stateCount, derivedRemainingStates, setStateCount]);
    console.log(canAddLicenses, "canAddLicenses-=====", AuthReducer?.chooseStatecardResponse?.state_licensures, AuthReducer?.licesensResponse?.licensure_states);


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
            return normalize(355)
        }
        if ((!enables && bothNoRequirement)) {
            return normalize(270);
        }
        if (allProfTake && !expireDate) {
            return normalize(350);
        }
        if (allProfTake && expireDate && bothNoRequirement) {
            return normalize(265);
        }
        if (allProfTake && expireDate) {
            return normalize(350);
        }
        if ((!enables && !bothNoRequirement)) {
            return normalize(310);
        }
        return normalize(250);
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
    console.log(fulldashbaord, "fulldashbaord=====")
    const finalDatCD = statepush?.state_code || statepush?.creditID?.state_code || addit?.state_code || fulldashbaord?.[0]?.state_code;
    return (
        <>

            <View>
                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 20, color: Colorpath.ButtonColr, marginTop: normalize(10), fontWeight: "bold" }}>{greetingText}</Text>
                </View>
                {fulldashbaord?.length > 0 ?
                    <View key={`dashboard-${fulldashbaord.length}`}>
                        <View style={{ height: getDynamicHeight(), width: normalize(320), alignSelf: "center", backgroundColor: Colorpath.ButtonColr }}>
                            <View style={{ height: normalize(40), justifyContent: 'center' }}>
                                {canAddLicenses ? (
                                    <TouchableOpacity
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
                                            flexDirection: "row",
                                            gap: normalize(3),
                                            marginTop: normalize(5)
                                        }}
                                    >
                                        <Image source={Imagepath.PlusNew} style={{ height: normalize(16), width: normalize(17), resizeMode: 'contain' }} />
                                        <Text style={Platform.OS === 'ios' ? {
                                            marginRight: normalize(15),
                                            color: "#FFFFFF",
                                            fontFamily: Fonts.InterMedium,
                                            fontSize: 14,
                                            fontWeight: "bold"
                                        } : {
                                            marginRight: normalize(12),
                                            color: "#FFFFFF",
                                            fontFamily: Fonts.InterMedium,
                                            fontSize: 14,
                                            fontWeight: "bold"
                                        }}>{"Add Licenses"}</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
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
                    </View>
                 : (wholeNo || (!fulldashbaord || fulldashbaord.length === 0)) ? (
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
                ) : <HomeShimmer />}
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
