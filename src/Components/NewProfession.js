import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    View,
    Platform,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Colorpath from '../Themes/Colorpath';
import normalize from '../Utils/Helpers/Dimen';
import { useIsFocused, useNavigation } from '@react-navigation/native';
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
import NetInfo from '@react-native-community/netinfo';
let status = "";
export default function NewProfession({ finalProfessionmain, setPrimeadd, enables, setStateCount, fetcheddt, stateCount, fulldashbaord, setFulldashbaord, cmecourse, setTakestate, takestate, setAddit, addit }) {
    const dispatch = useDispatch();
    const {
        setTakedata
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
    // const logger = (() => {
    //     let oldConsole = {};
    //     return {
    //         disableLogger: () => {
    //             if (oldConsole.log) return; // Already disabled
    //             oldConsole.log = console.log;
    //             oldConsole.info = console.info;
    //             oldConsole.warn = console.warn;
    //             oldConsole.error = console.error;
    //             oldConsole.debug = console.debug;
    //             console.log = () => { };
    //             console.info = () => { };
    //             console.warn = () => { };
    //             console.error = () => { };
    //             console.debug = () => { };
    //         },
    //     };
    // })();
    // useEffect(() => {
    //     const unsubscribe = NetInfo.addEventListener(state => {
    //         console.log('Connection State:', state.isConnected);
    //         if (state.isConnected === false) {
    //             logger.disableLogger();
    //             console.log = function () { };
    //         }
    //     });

    //     return () => unsubscribe();
    // }, []);
    const getCurrentItem = () => {
        if (!fulldashbaord?.length) return null;
        return fulldashbaord[currentIndex]; // <-- Uses state-tracked index
    };
    console.log(fulldashbaord, AuthReducer?.loginResponse?.user?.profession, "statelicesene=================", getCurrentItem())

    const modalFalse = () => {
        setDetailsmodal(true);
    }
    const cmeModalFalse = () => {
        setCmemodal(true);
    }
    const cmeValult = () => {
        setVaultmodal(!vaultModal);
    }
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
    const profFromDashboard =
        DashboardReducer?.mainprofileResponse?.professional_information?.profession != null &&
            DashboardReducer?.mainprofileResponse?.professional_information?.profession_type != null
            ? `${DashboardReducer?.mainprofileResponse?.professional_information?.profession} - ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type}`
            : null;
    const allProfTake = validHandles.has(profFromDashboard);
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
    console.log(fulldashbaord, "fulldata--------", DashboardReducer.dashboardResponse.data?.licensures)
    useEffect(() => {
        if (fulldashbaord?.length == 0) {
            setWholeNo(true);
            restOfProfession();
        }
    }, [fulldashbaord])
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

    const data = DashboardReducer.dashboardResponse.data?.licensures;
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
        console.log(total, "toatl=========>>>>=======")
        setCompletedCount(completed);
        setPendingCount(total - completed);

    }, [DashboardReducer?.stateDashboardResponse?.data]);
    const tasksData = DashboardReducer?.stateDashboardResponse?.data?.tasks_data;
    const hasTasks = tasksData?.due_in_30_days?.length > 0 ||
        tasksData?.due_in_60_days?.length > 0 ||
        tasksData?.due_in_90_days?.length > 0;
    useEffect(() => {
        if (val == currentIndex) {
            const getDtaa = fulldashbaord?.[val];
            if (getDtaa) {
                stateDashboardData(getDtaa?.state_id);
                stateReport(getDtaa?.state_id);
                setAddit(getDtaa);
                setTakedata(getDtaa);
                setTakestate(getDtaa?.board_id)
                setTotalCred(getDtaa?.credits_data?.topic_earned_credits + getDtaa?.credits_data?.total_general_earned_credits);
                setStateid(getDtaa?.state_id);
            }
        }
    }, [val, currentIndex, fulldashbaord])
    return (
        <>

            <View>
                <RestProfession finalProfessionmain={finalProfessionmain} setPrimeadd={setPrimeadd} enables={enables} addit={addit} takestate={takestate} navigation={navigation} completedCount={completedCount} pendingCount={pendingCount} DashboardReducer={DashboardReducer} CMEReducer={CMEReducer} />
            </View>
        </>
    );
}
