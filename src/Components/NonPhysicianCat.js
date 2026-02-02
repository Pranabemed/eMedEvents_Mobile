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
let status = "";
export default function NonPhysicianCat({ finalProfessionmain, setPrimeadd, enables, setStateCount, fetcheddt, stateCount, fulldashbaord, setFulldashbaord, cmecourse, setTakestate, takestate, setAddit, addit }) {
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
    // Get the current item without scrolling
    const getCurrentItem = () => {
        if (!fulldashbaord?.length) return null;
        return fulldashbaord[currentIndex]; // <-- Uses state-tracked index
    };
    const isFocus = useIsFocused();
    useEffect(() => {
        const token_handle = () => {
            setTimeout(async () => {
                const loginHandle = await AsyncStorage.getItem(constants.TOKEN);
                if (loginHandle) {
                    dashBoarData()
                }
            }, 100);
        };
        try {
            token_handle();
        } catch (error) {
            console.log(error);
        }
    }, [isFocus]);
    const dashBoarData = () => {
        connectionrequest()
            .then(() => {
                dispatch(dashboardRequest({}))
            })
            .catch(err => {
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
    const otherRestrict = new Set(["Nursing - APRN", "Nursing - CNA", "Nursing - LPN", "Nursing - RN", "Dentist - DDS", "Dentist - RDA", "Dentist - RDH"]);
    const profFromDashboard =
        DashboardReducer?.mainprofileResponse?.professional_information?.profession != null &&
            DashboardReducer?.mainprofileResponse?.professional_information?.profession_type != null
            ? `${DashboardReducer?.mainprofileResponse?.professional_information?.profession} - ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type}`
            : null;
    const allProfTake = validHandles.has(profFromDashboard);
    const allNoDetData = otherRestrict.has(profFromDashboard);
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
    const firstData = AuthReducer?.loginResponse?.user?.firstname || DashboardReducer?.dashboardResponse?.data?.user_information?.firstname || DashboardReducer?.dashPerResponse?.data?.user_information?.firstname || DashboardReducer?.mainprofileResponse?.personal_information?.firstname;

    return (
        <>

            <View>
                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 20, color: Colorpath.ButtonColr, marginTop: normalize(10) }}>{`Hello, ${firstData || ''}`}</Text>
                </View>
                {fulldashbaord?.length > 0 ?
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
                                        dispatch(stateDashboardRequest({ "state_id": getDtaa.state_id }))
                                        dispatch(stateReportingRequest({ "state_id": getDtaa.state_id }))
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
                    </View> : <HomeShimmer />}
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