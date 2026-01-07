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
import Dashboardmaintwo from './Dashboardmaintwo';
import { staticdataRequest } from '../Redux/Reducers/AuthReducer';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
import { current } from '@reduxjs/toolkit';
import Nonphysicianprofile from './Nonphysicianprofile';
import { cmeCourseRequest } from '../Redux/Reducers/CMEReducer';
import RestProfession from './RestProfession';
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import Buttons from './Button';
let status = "";
export default function StateLicense({ propsData, setRenewal, renewal, setStateid, stateid, setTotalCred, totalcard, finalProfessionmain, setPrimeadd, enables, setStateCount, fetcheddt, stateCount, fulldashbaord, setFulldashbaord, cmecourse, setTakestate, takestate, setAddit, addit }) {
    const dispatch = useDispatch();
    const {
        setTakedata,
        expireDate,
        setFinddata,
        finddata,
        setStatepush
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pageNum, setPageNum] = useState(0);
    const [limit, setLimit] = useState(9);
    const [wholeNo, setWholeNo] = useState(false);
    const getCurrentItem = () => {
        if (!fulldashbaord?.length) return null;
        return fulldashbaord[currentIndex];
    };
    console.log(stateCount, fulldashbaord, AuthReducer?.loginResponse?.user, "122statelicesene=================", getCurrentItem(), propsData)

    const modalFalse = () => {
        setDetailsmodal(true);
    }
    const cmeModalFalse = () => {
        setCmemodal(true);
    }
    const cmeValult = () => {
        setVaultmodal(!vaultModal);
    }
    const firstData = DashboardReducer?.mainprofileResponse?.personal_information?.lastname || AuthReducer?.loginResponse?.user?.lastname || DashboardReducer?.dashboardResponse?.data?.user_information?.lastname || DashboardReducer?.dashPerResponse?.data?.user_information?.lastname;
    const isFocus = useIsFocused();
    useEffect(() => {
        const token_handle = () => {
            setTimeout(async () => {
                const loginHandle = await AsyncStorage.getItem(constants.TOKEN);
                console.log(loginHandle, "statelicesene=================")
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
    // const otherRestrict = new Set(["Nursing - APRN", "Nursing - CNA", "Nursing - LPN", "Nursing - RN", "Dentist - DDS", "Dentist - RDA", "Dentist - RDH"]);
    const profFromDashboard =
        DashboardReducer?.mainprofileResponse?.professional_information?.profession != null &&
            DashboardReducer?.mainprofileResponse?.professional_information?.profession_type != null
            ? `${DashboardReducer?.mainprofileResponse?.professional_information?.profession} - ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type}`
            : null;
    const allProfTake = validHandles.has(profFromDashboard);
    // const allNoDetData = otherRestrict.has(profFromDashboard);
    console.log("DashboardReducer", DashboardReducer);
    if (status == '' || DashboardReducer.status != status) {
        switch (DashboardReducer.status) {
            case 'Dashboard/dashboardRequest':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/dashboardSuccess':
                status = DashboardReducer.status;
                console.log("DashboardReducer9999", DashboardReducer.dashboardResponse.data?.licensures);
                if (DashboardReducer.dashboardResponse.data?.licensures == 0) {
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
                    console.log(uniqueMainDatacheck, "duplicate removed ========");
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
                console.log(DashboardReducer?.stateDashboardResponse?.data?.tasks_data, "stateDashboardRespons===========")
                // props.navigation.navigate("Login");
                break;
            case 'Dashboard/stateDashboardFailure':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/stateReportingRequest':
                status = DashboardReducer.status;
                break;
            case 'Dashboard/stateReportingSuccess':
                status = DashboardReducer.status;
                console.log(DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link, "renwal link -----");
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
    console.log(fulldashbaord, !enables && !bothNoRequirement, enables, bothNoRequirement, DashboardReducer, "fulldata--------", DashboardReducer?.dashboardResponse?.data?.licensures)
    useEffect(() => {
        if (fulldashbaord?.length == 0) {
            setWholeNo(true);
            restOfProfession();
        }
    }, [fulldashbaord])
    useEffect(() => {
        if (propsData?.detectmain == "newadd") {
            stateDashboardData(fulldashbaord?.[0]?.state_id);
            stateReport(fulldashbaord?.[0]?.state_id)
        }
    }, [propsData?.detectmain])
    const stateDashboardData = (id) => {
        let obj = {
            "state_id": id
        }
        connectionrequest()
            .then(() => {
                dispatch(stateDashboardRequest(obj));
            })
            .catch(err => { showErrorAlert("Please connect to internet", err) })
    }
    const stateReport = (did) => {
        let obj = {
            "state_id": did
        }
        connectionrequest()
            .then(() => {
                dispatch(stateReportingRequest(obj))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
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
    console.log("djok-----", bothNoRequirement, enables)
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
    return (
        <>

            <View>
                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 20, color: Colorpath.ButtonColr, marginTop: normalize(10), fontWeight: "bold" }}>{`Hello, Dr. ${firstData || ''}`}</Text>
                </View>
                {fulldashbaord?.length > 0 ?
                    <View key={`dashboard-${fulldashbaord.length}`}>
                        <View style={{ height: getDynamicHeight(), width: normalize(320), alignSelf: "center", backgroundColor: Colorpath.ButtonColr }}>

                            {stateCount?.length > 0 && allProfTake && <TouchableOpacity
                                onPress={() => {
                                    if (enables) {
                                        setPrimeadd(true);
                                    } else {
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
                                    // marginTop: normalize(8),
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
                                    // bottom:normalize(1),
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
                                firstItem={0}
                                onSnapToItem={(index) => {
                                    setval(index);
                                    setCurrentIndex(index);
                                    const getDtaa = fulldashbaord?.[index] || fulldashbaord?.[0];
                                    if (getDtaa) {
                                        dispatch(stateDashboardRequest({ "state_id": getDtaa.state_id }))
                                        dispatch(stateReportingRequest({ "state_id": getDtaa.state_id }));
                                        setStatepush(getDtaa);
                                        // stateDashboardData(getDtaa.state_id);
                                        // stateReport(getDtaa.state_id);
                                        const responseData = DashboardReducer?.stateDashboardResponse?.data;
                                        console.log(responseData, "responseData--------", DashboardReducer);
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

                            {/* <Pagination
                                dotsLength={fulldashbaord?.length || 0}
                                activeDotIndex={val}
                                containerStyle={{ paddingVertical: 0, marginBottom: normalize(10) }}
                                dotStyle={{
                                    width: 25,
                                    height: 7,
                                    borderRadius: 10,
                                    backgroundColor: Colorpath.white,
                                    marginHorizontal: 0
                                }}
                                inactiveDotStyle={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 10,
                                    backgroundColor: Colorpath.ButtonColr,
                                    borderColor: "#FFFFFF",
                                    borderWidth: 3,
                                    marginRight: 0
                                }}
                                inactiveDotScale={0.9}
                                tappableDots={true} // ✅ Make dots clickable
                                carouselRef={carouselRef}
                            /> */}
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
                                    text={`View Courses for ${addit?.state_code} State Compliance`}
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
                                    text={`View Courses for ${addit?.state_code} State Compliance`}
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
                            <Dashboardmain allProfTake={allProfTake} finddata={finddata} setPrimeadd={setPrimeadd} enables={enables} handleButtonPress={getCurrentItem()} setAddit={setAddit} addit={addit} setTakestate={setTakestate} takestate={takestate} cmecourse={cmecourse} tasksData={tasksData} cmeValult={cmeValult} navigation={navigation} completedCount={completedCount} pendingCount={pendingCount} hasTasks={hasTasks} DashboardReducer={DashboardReducer} totalcard={totalcard} />
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