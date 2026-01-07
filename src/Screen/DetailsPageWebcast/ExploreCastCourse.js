import { View, Text, Platform, FlatList, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import PageHeader from '../../Components/PageHeader'
import Colorpath from '../../Themes/Colorpath'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Fonts from '../../Themes/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { webcastStateRequest, webcastviewallRequest } from '../../Redux/Reducers/WebcastReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import LocationComponent from './LocationComponent';
import ProfessionModal from './ProfessionModal';
import FiltersTopic from './FiltersTopic';
import Tooltip from 'react-native-walkthrough-tooltip';
import ExplorecastComponent from './ExplorecastComponent';
import ExploreInput from './ExploreInput';
import ExpolrecastFlatlist from './ExpolrecastFlatlist';
import StateRequiredCourse from './StaterequiredComponent';
import StateRequiredCast from './StaterequiredCast';
import Imagepath from '../../Themes/Imagepath';
import DownIcn from 'react-native-vector-icons/Feather';
import CatlogDownload from './CatlogDownload';
import Loader from '../../Utils/Helpers/Loader';
import Modal from 'react-native-modal';
import { all } from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
const ExploreCastCourse = (props) => {
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const [isScrolling, setIsScrolling] = useState(false);
    const [webcastview, setWebcastview] = useState(null);
    const [webcastviewcourse, setWebcastviewcourse] = useState(null);
    const [paginatedData, setPaginatedData] = useState([]);
    const [pagecourseData, setPagecourseData] = useState([]);
    const [statepick, setStatepick] = useState(false);
    const [statewise, setStatewise] = useState("");
    const [loadingMore, setLoadingMore] = useState(false);
    const [courseMore, setCourseMore] = useState(false);
    const [page, setPage] = useState(1);
    const [pagecourse, setPagecourse] = useState(1);
    const [clisttopic, setClisttopic] = useState('');
    const [selectCountrytopic, setSelectCountrytopic] = useState([]);
    const [searchtexttopic, setSearchtexttopic] = useState('');
    const [stateid, setStateid] = useState("");
    const [creditModal, setCreditModal] = useState(false);
    const [particular, setParticular] = useState("");
    const [profesions, setProfessions] = useState("");
    const [profesionstype, setProfessionstype] = useState("");
    const [webcastall, setWebcastall] = useState(null);
    const [filtering, setFiltering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tooltip, setTootip] = useState(false);
    const [allSpecial, setAllSpecial] = useState(null);
    const [downlink, setDownlink] = useState(false);
    const [loadingdown, setLoadingdown] = useState(false);
    const [pdfUri, setPdfUri] = useState("");
    const [again, setAgain] = useState("");
    console.log(props?.route?.params?.clearDat == "clearDat", "props?.route?.params?.clearDat========");
    console.log(props?.route?.params?.creditData, "props?.route?.params?.clearDat========");
    useEffect(() => {
        if (props?.route?.params?.clearDat == "clearDat") {
            setParticular("");
            setStatewise("");
        }
    }, [props?.route?.params?.clearDat, isFocus])
    console.log("pros", props?.route?.params?.clearDat, particular)
    const downData = [{ id: 1, name: "Physician (MD/DO)", Path: "https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-04-02/global_pediatric_images/State%20Wise%20CME%20Course%20Bundle%20For%20Physicians-4.pdf" }, { id: 2, name: "Registered Nurse (RN)", Path: "https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-12-30/State%20Wise%20CME%20Course%20Bundle%20For%20RN-4.pdf" }, { id: 3, name: "Nurse Practitioner (NP/APRN)", Path: "https://emedeventslive.s3.us-west-2.amazonaws.com/uploads/newsletters/2024-12-30/State%20Wise%20CME%20Course%20Bundle%20For%20NP.pdf" }]
    const allProfession = [{ id: 0, name: "All Professions", profesions_type: "" }, { id: 1, name: "Physicians - MD", profession: "Physician", profesions_type: "" }, { id: 2, name: "Nurses - RN", profession: "Nursing", profesions_type: "RN" }, { id: 3, name: "Nurses - NP", profession: "Nursing", profesions_type: "NP" }]
    const allProfessionDp = [{ id: 1, name: "Physicians - MD", profession: "Physician", profesions_type: "" }, { id: 2, name: "Nurses - RN", profession: "Nursing", profesions_type: "RN" }, { id: 3, name: "Nurses - NP", profession: "Nursing", profesions_type: "NP" }]
    const searchTopicName = text => {
        console.log(text, 'text12333');
        if (text) {
            const listAllData = selectCountrytopic?.filter(function (item) {
                console.log('item+++++++++++++++++++1111', item?.state_name);
                const itemDataTopic = item?.state_name
                    ? item?.state_name?.toUpperCase()
                    : ''.toUpperCase();
                const textDataTopic = text.trim().toUpperCase();
                const AllDataFilter = itemDataTopic.indexOf(textDataTopic) > -1;
                console.log('AllDataFilter', AllDataFilter);
                return AllDataFilter;
            });
            setClisttopic(listAllData);
            setSearchtexttopic(text);
        } else {
            setClisttopic(selectCountrytopic);
            setSearchtexttopic(text);
        }
    };
    const searchWebcastTopic = text => {
        console.log(text, 'text12333');
        if (text) {
            const listAllData_topic = rolesdata?.filter(function (item) {
                console.log('item+++++++++++++++++++1111', item?.name);
                const itemDataTopic_Webcasttopic = item?.name
                    ? item?.name?.toUpperCase()
                    : ''.toUpperCase();
                const textDataTopic_webcast = text.trim().toUpperCase();
                const AllDataFilter_web = itemDataTopic_Webcasttopic.indexOf(textDataTopic_webcast) > -1;
                console.log('AllDataFilter_web', AllDataFilter_web);
                return AllDataFilter_web;
            });
            setWebcasttopic(listAllData_topic);
            setTopicfetched(text);
        } else {
            setWebcasttopic(rolesdata);
            setTopicfetched(text);
        }
    };
    console.log(stateid, "statewise==========122", profesions)
    useEffect(() => {
        if (stateid && profesions && stateid !== "" && profesions !== "") {
            let obj = {
                "profession": profesions,
                "mandate_state": stateid,
                "mandate_topic": "",
                "profession_type": profesionstype ? profesionstype : ""
            };
            connectionrequest()
                .then(() => {
                    dispatch(webcastviewallRequest(obj));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to the internet", err);
                });
        }
    }, [stateid, profesions]);
    useEffect(() => {
        let obj = {
            "profession": "",
            "mandate_state": "",
            "mandate_topic": "",
            "profession_type": ""
        }
        connectionrequest()
            .then(() => {
                dispatch(webcastviewallRequest(obj))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }, [isFocus])
    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(webcastStateRequest({}))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }, [isFocus])
    const checkoutClear = () => {
        props.navigation.goBack();
    }

    const handleUrl = (dataurl) => {
        const url_webcast = dataurl?.detailpage_url;
        const result_final = url_webcast.split('/').pop();
        console.log(result_final, "webcast url=======");
        if (result_final) {
            setPagecourseData([]);
            setPaginatedData([]);
            setParticular("");
            setStatewise("");
            setWeekname("");
            props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result_final, price: dataurl?.ticketprice, creditData: props?.route?.params?.creditData } })
        }
    }

    if (status == '' || WebcastReducer.status != status) {
        switch (WebcastReducer.status) {
            case 'WebCast/webcastviewallRequest':
                status = WebcastReducer.status;
                setLoading(true);
                break;
            case 'WebCast/webcastviewallSuccess':
                status = WebcastReducer.status;
                setLoading(false);
                const responseTake = WebcastReducer?.webcastviewallResponse ;                 
                setWebcastall(responseTake);
                if (responseTake?.course_bundle_conferences) {
                    const fullData = responseTake?.course_bundle_conferences;
                    setWebcastview(fullData);
                    
                    const filteredCourse = weekname 
                        ? fullData.filter(item => weekname.includes(item.topic)) 
                        : fullData;
                    
                    setPaginatedData(filteredCourse.slice(0, 3));
                }
    
                // Process state_mandate_conferences
                if (responseTake?.state_mandate_conferences) {
                    const fullDataCourse = responseTake?.state_mandate_conferences;
                    setWebcastviewcourse(fullDataCourse);
                    
                    const filteredState = weekname 
                        ? fullDataCourse.filter(item => weekname.includes(item.topic)) 
                        : fullDataCourse;
                    
                    setPagecourseData(filteredState.slice(0, 3));
                }
                break;
            case 'WebCast/webcastviewallFailure':
                status = WebcastReducer.status;
                setLoading(false);
                break;
        }
    }
    const [activeList, setActiveList] = useState(null);
    const [isTouching, setIsTouching] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [rolesdata, setRolesdata] = useState(null);
    const [webcasttopic, setWebcasttopic] = useState(null);
    const [weekname, setWeekname] = useState("");
    const [topicfetched, setTopicfetched] = useState("");
    console.log(activeList, "activeList======", isTouching, lastScrollY)
    const checkoutCleartopic = () => {
        setFiltering(false);
    }
    useEffect(() => {
        if (webcastall?.topics) {
            const finalDataTopic = webcastall?.topics
            const topicsWithId = finalDataTopic?.map((topic, index) => ({
                name: topic,
                id: index
            }));
            setRolesdata(topicsWithId);
            setWebcasttopic(topicsWithId);
            console.log(topicsWithId, "topicsWithId=========");
        }
    }, [webcastall?.topics])
    const toggleWeekSelection = (item) => {
        console.log(item, "autofetched")
        let updatedWeekname;
        if (weekname.includes(item.name)) {
            updatedWeekname = weekname.filter(week => week !== item.name);
        } else {
            updatedWeekname = [...weekname, item.name];
        }
        setWeekname(updatedWeekname);
        console.log(updatedWeekname, "updatedWeekname====")
        if (updatedWeekname?.length > 0) {
            const obj = {
                "profession": profesions ? profesions : "",
                "mandate_state": stateid ? stateid : "",
                "mandate_topic": updatedWeekname?.length > 0  ? updatedWeekname : "",
                "profession_type": profesionstype ? profesionstype : ""
            };
            connectionrequest()
                .then(() => {
                    dispatch(webcastviewallRequest(obj));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to the internet", err);
                });
        } else {
            // setLoading(true);
            // const obj = {
            //     profession: "",
            //     mandate_state: "",
            //     mandate_topic: ""
            // };
            // connectionrequest()
            //     .then(() => {
            //         dispatch(webcastviewallRequest(obj));
            //     })
            //     .catch((err) => {
            //         showErrorAlert("Please connect to the internet", err);
            //     });
        }
    };
    useEffect(() => {
        if (typeof weekname == "string") {
            const obj = {
                profession: "",
                mandate_state: "",
                mandate_topic: "",
                profession_type: ""
            };
            connectionrequest()
                .then(() => {
                    dispatch(webcastviewallRequest(obj));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to the internet", err);
                });
        }
    }, [typeof weekname == "string"])
    useFocusEffect(
        useCallback(() => {
            const obj = {
                "profession": profesions ? profesions : "",
                "mandate_state": stateid ? stateid : "",
                "mandate_topic": weekname?.length > 0 ? weekname : "",
                "profession_type": profesionstype ? profesionstype : ""
            };

            connectionrequest()
                .then(() => {
                    dispatch(webcastviewallRequest(obj));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to the internet", err);
                });

            // Clean-up function (optional)
            return () => {
                // Any necessary clean-up logic can go here
            };
        }, [profesions, stateid, weekname, profesionstype])
    );
    console.log(typeof weekname == "string", "weekname===111=", typeof stateid == "string",weekname)
    // useEffect(() => {
    //     if (WebcastReducer?.webcastviewallResponse?.course_bundle_conferences) {
    //         const fullData = WebcastReducer?.webcastviewallResponse?.course_bundle_conferences;
    //         setWebcastview(fullData);
    //         if (!weekname) {
    //             // setLoading(true);
    //             setTimeout(() => {
    //                 setPaginatedData(fullData.slice(0, 3));
    //                 setLoading(false);
    //             }, 1000);
    //         } else {
    //             const filteredData = fullData.filter(item => weekname.includes(item.topic));
    //             setPaginatedData(filteredData.slice(0, 3));
    //         }
    //     }
    // }, [WebcastReducer?.webcastviewallResponse?.course_bundle_conferences]);
    // useEffect(() => {
    //     if (WebcastReducer?.webcastviewallResponse?.state_mandate_conferences) {
    //         const fullDataCourse = WebcastReducer?.webcastviewallResponse?.state_mandate_conferences;
    //         setWebcastviewcourse(fullDataCourse);
    //         if (!weekname) {
    //             // setLoading(true);
    //             setTimeout(() => {
    //                 setPagecourseData(fullDataCourse.slice(0, 3));
    //                 setLoading(false);
    //             }, 1000);
    //         } else {
    //             const filteredData = fullDataCourse.filter(item => weekname.includes(item.topic));
    //             setPagecourseData(filteredData.slice(0, 3));
    //         }
    //     }
    // }, [WebcastReducer?.webcastviewallResponse?.state_mandate_conferences]);
    const statewiseFetch = (fullID) => {
        const obj = {
            profession: "",
            mandate_state: fullID ? fullID : "",
            mandate_topic: "",
            profession_type: ""
        };
        connectionrequest()
            .then(() => {
                dispatch(webcastviewallRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to the internet", err);
            });
    }
    const professionFetch = (prof) => {
        const obj = {
            profession: prof?.profession ? prof?.profession : "",
            mandate_state: "",
            mandate_topic: "",
            profession_type: prof?.profesions_type ? prof?.profesions_type : ""
        };
        connectionrequest()
            .then(() => {
                dispatch(webcastviewallRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to the internet", err);
            });
    }
    useEffect(() => {
        const stateData = WebcastReducer?.webcastStateResponse?.states;
        if (stateData || stateid) {
            const stateDataArray = Object.keys(stateData).map(key => ({
                state_name: stateData[key],
                state_id: key,
            }));
            const allStatesItem = { state_name: stateid ? "All States" : "", state_id: "" };
            const updatedStateDataArray = [allStatesItem, ...stateDataArray];
            setSelectCountrytopic(updatedStateDataArray);
            setClisttopic(updatedStateDataArray);
            console.log(updatedStateDataArray, "updatedStateDataArray=========", allStatesItem, stateid);
        }
    }, [WebcastReducer?.webcastStateResponse?.states, stateid]);
    const loadMoreData = () => {
        if (loadingMore) return;
        if (paginatedData?.length < webcastview?.length) {
            setLoadingMore(true);
            const nextPage = page + 1;
            const itemsPerPage = 3;
            const newData = webcastview.slice(0, nextPage * itemsPerPage);
            setTimeout(() => {
                setPaginatedData(newData);
                setPage(nextPage);
                setLoadingMore(false);
            }, 1000);
        }
    };
    
    useEffect(() => {
        if (allSpecial) {
            const highText =  typeof allSpecial == "object"? allSpecial : allSpecial.split(',');
            setAgain(highText);
        }
    }, [allSpecial])
    const loadMoreDataCourse = () => {
        if (courseMore) return;
        if (pagecourseData?.length < webcastviewcourse?.length) {
            setCourseMore(true);
            const nextPage = pagecourse + 1;
            const itemsPerPage = 3;
            const Course = webcastviewcourse.slice(0, nextPage * itemsPerPage);
            setTimeout(() => {
                setPagecourseData(Course);
                setPagecourse(nextPage);
                setCourseMore(false);
            }, 1000);
        }
    };
    const Handlestate = (role) => {
        setStateid(role?.state_id)
        setStatewise(role?.state_name);
        setStatepick(false);
        statewiseFetch(role.state_id);
    }
    const renderFooter = () => {
        return loadingMore ? (
            <View style={{ marginTop: normalize(80) }}>
                <ActivityIndicator size="small" color={Colorpath.ButtonColr} />
            </View>
        ) : null;
    };
    const renderFooterCourse = () => {
        return courseMore ? (
            <View style={{ marginTop: normalize(80), justifyContent: "center", alignSelf: "center" }}>
                <ActivityIndicator style={{ alignSelf: "center" }} size="small" color={Colorpath.ButtonColr} />
            </View>
        ) : null;
    };
    console.log(stateid, "whole data", profesions);
    useEffect(() => {
        if (statewise) {
            setSearchtexttopic("");
        }
    }, [statewise])

    useEffect(() => {
        if (filtering) {
            setTopicfetched("");
        }
        if (webcastall?.topics) {
            const finalDataTopic = webcastall?.topics
            const topicsWithId = finalDataTopic?.map((topic, index) => ({
                name: topic,
                id: index
            }));
            setRolesdata(topicsWithId);
            setWebcasttopic(topicsWithId);
            console.log(topicsWithId, "topicsWithId=========");
        }
    }, [filtering, webcastall?.topics])
    useEffect(() => {
        const stateData = WebcastReducer?.webcastStateResponse?.states;
        if (stateData || stateid) {
            const stateDataArray = Object.keys(stateData).map(key => ({
                state_name: stateData[key],
                state_id: key,
            }));
            const allStatesItem = { state_name: stateid ? "All States" : "", state_id: "" };
            const updatedStateDataArray = [allStatesItem, ...stateDataArray];
            console.log(updatedStateDataArray, "updatedStateDataArray=========");
            if (!searchtexttopic && updatedStateDataArray) {
                setClisttopic(updatedStateDataArray);
            }
        }
    }, [searchtexttopic, stateid]);

    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {filtering ? (
                    <FiltersTopic
                        checkoutCleartopic={checkoutCleartopic}
                        topicfetched={topicfetched}
                        setTopicfetched={setTopicfetched}
                        weekname={weekname}
                        setWeekname={setWeekname}
                        rolesdata={rolesdata}
                        setRolesdata={setRolesdata}
                        webcastall={webcastall}
                        setWebcastall={setWebcastall}
                        toggleWeekSelection={toggleWeekSelection}
                        searchWebcastTopic={searchWebcastTopic}
                        webcasttopic={webcasttopic}
                        setWebcasttopic={setWebcasttopic}
                    />
                ) : statepick ? (
                    <LocationComponent
                        searchTopicName={searchTopicName}
                        clisttopic={clisttopic}
                        Handlestate={Handlestate}
                        setStatepick={setStatepick}
                        setDownlink={setDownlink}
                        searchtexttopic={searchtexttopic}
                    />) : (
                    <>
                        {Platform.OS === 'ios' ? (
                            <PageHeader
                                title="State Mandate CME/CE Courses for MD/DO, RNs & NPs"
                                onBackPress={checkoutClear}
                            />
                        ) : (
                            <View style={{ marginTop: normalize(40) }}>
                                <PageHeader
                                    title="State Mandate CME/CE Courses for MD/DO, RNs & NPs"
                                    onBackPress={checkoutClear}
                                />
                            </View>
                        )}
                        <Loader visible={loadingdown} />
                        <ExploreInput setDownlink={setDownlink} setStatepick={setStatepick} setCreditModal={setCreditModal} particular={particular} statewise={statewise} setFiltering={setFiltering} />
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) :
                            (
                                <>
                                    {pagecourseData?.length > 0 && lastScrollY == "0" ? <StateRequiredCourse
                                        paginatedData={pagecourseData}
                                        ExplorecastComponent={StateRequiredCast}
                                        renderFooter={renderFooterCourse}
                                        loadMoreData={loadMoreDataCourse}
                                        setAllSpecial={setAllSpecial}
                                        setTootip={setTootip}
                                        handleUrl={handleUrl}
                                        statewise={statewise}
                                        activeList={activeList}
                                        setActiveList={setActiveList}
                                        isTouching={isTouching}
                                        profesions={profesions}
                                        stateid={stateid}
                                        setIsTouching={setIsTouching}
                                        paginatedDataDpl={paginatedData} /> : <>
                                        {pagecourseData?.length == "0" && <View >
                                            <View style={{ marginLeft: normalize(6), paddingVertical: normalize(5) }}>
                                                <Text numberOfLines={1} style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: Colorpath.ButtonColr, marginBottom: normalize(5) }}>{`State-required Courses ${stateid || profesions ? "for" : ""} ${statewise == "All States" ? "" : statewise} ${profesions == "Nursing" ? "Nurses" : `${!profesions ? "" : `${profesions}s`}`}`}</Text>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    // height: normalize(83),
                                                    width: normalize(290),
                                                    borderRadius: normalize(10),
                                                    backgroundColor: "#FFFFFF",
                                                    paddingHorizontal: normalize(10),
                                                    paddingVertical: normalize(10),
                                                    alignSelf: "center",
                                                }}
                                            >
                                                <View style={{ flex: 1, justifyContent: "center" }}>
                                                    <Text
                                                        style={{
                                                            fontFamily: Fonts.InterSemiBold,
                                                            fontSize: 16,
                                                            color: "#000000",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {"There are no state-required topics courses found with your search criteria."}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>}
                                        {paginatedData?.length == "0" && <View style={{ marginTop: normalize(10) }}>
                                            <View style={{ paddingVertical: normalize(5), marginLeft: normalize(6) }}>
                                                <Text numberOfLines={2} style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: Colorpath.ButtonColr, marginBottom: normalize(5) }}>{`State-required Courses Bundle ${stateid || profesions ? "for" : ""} ${statewise == "All States" ? "" : statewise} ${profesions == "Nursing" ? "Nurses" : `${!profesions ? "" : `${profesions}s`}`}`}</Text>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    // height: normalize(83),
                                                    width: normalize(290),
                                                    borderRadius: normalize(10),
                                                    backgroundColor: "#FFFFFF",
                                                    paddingHorizontal: normalize(10),
                                                    paddingVertical: normalize(10),
                                                    alignSelf: "center",
                                                }}
                                            >
                                                <View style={{ flex: 1, justifyContent: "center" }}>
                                                    <Text
                                                        style={{
                                                            fontFamily: Fonts.InterSemiBold,
                                                            fontSize: 16,
                                                            color: "#000000",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {"There are no state-required topics courses found with your search criteria."}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        }

                                    </>

                                    }
                                    {paginatedData?.length > 0 ? <ExpolrecastFlatlist
                                        paginatedData={paginatedData}
                                        ExplorecastComponent={ExplorecastComponent}
                                        renderFooter={renderFooter()}
                                        loadMoreData={loadMoreData()}
                                        setAllSpecial={setAllSpecial}
                                        setTootip={setTootip}
                                        handleUrl={handleUrl}
                                        statewise={statewise}
                                        isScrolling={isScrolling}
                                        activeList={activeList}
                                        setActiveList={setActiveList}
                                        setIsScrolling={setIsScrolling}
                                        isTouching={isTouching}
                                        setIsTouching={setIsTouching}
                                        setLastScrollY={setLastScrollY}
                                        lastScrollY={lastScrollY}
                                        stateid={stateid}
                                        profesions={profesions} /> :
                                        pagecourseData?.length > 0 && <View style={{ marginBottom: normalize(90) }}>
                                            <View style={{ paddingVertical: normalize(5), marginLeft: normalize(17) }}>
                                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: Colorpath.ButtonColr, marginBottom: normalize(5) }}>{`State-required Courses Bundle ${stateid || profesions ? "for" : ""} ${statewise == "All States" ? "" : statewise} ${profesions == "Nursing" ? "Nurses" : `${!profesions ? "" : `${profesions}s`}`}`}</Text>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    // height: normalize(83),
                                                    width: normalize(290),
                                                    borderRadius: normalize(10),
                                                    backgroundColor: "#FFFFFF",
                                                    paddingHorizontal: normalize(10),
                                                    paddingVertical: normalize(10),
                                                    alignSelf: "center",
                                                }}
                                            >
                                                <View style={{ flex: 1, justifyContent: "center" }}>
                                                    <Text
                                                        style={{
                                                            fontFamily: Fonts.InterSemiBold,
                                                            fontSize: 16,
                                                            color: "#000000",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {"There are no state-required topics courses found with your search criteria."}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>}
                                </>
                            )}
                        <ProfessionModal
                            setProfessions={setProfessions}
                            profesions={profesions}
                            setProfessionstype={setProfessionstype}
                            profesionstype={profesionstype}
                            setParticular={setParticular}
                            particular={particular}
                            creditModal={creditModal}
                            setCreditModal={setCreditModal}
                            dommyData={profesions ? allProfession : allProfessionDp}
                            professionFetch={professionFetch}
                        />
                        <View style={{
                            position: 'absolute',
                            bottom:Platform.OS ==='ios'? 60: 40,
                            right: 0,
                            paddingHorizontal: normalize(25),
                            zIndex: 999,
                            justifyContent:"center",
                            alignItems:"center",
                            alignSelf:"center",
                            
                        }}>
                            <TouchableOpacity onPress={() => { setDownlink(true) }} style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                height: normalize(50),
                                width:  normalize(50),
                                backgroundColor: Colorpath.ButtonColr,
                                borderWidth: 0.5,
                                borderColor: "#AAAAAA",
                                borderRadius: normalize(55),
                            }}>
                                <DownIcn name="download" color={"#FFFFFF"} size={25} />
                            </TouchableOpacity>
                        </View>
                        <CatlogDownload
                            setDownlink={setDownlink}
                            downlink={downlink}
                            downData={downData}
                            setLoadingdown={setLoadingdown}
                            loadingdown={loadingdown}
                            pdfUri={pdfUri}
                            setPdfUri={setPdfUri} />
                        <Modal
                            animationIn={'slideInUp'}
                            animationOut={'slideOutDown'}
                            isVisible={tooltip}
                            backdropColor="rgba(0, 0, 0, 0.5)"
                            style={{
                                width: '100%',
                                position: "absolute",
                                top: 0,
                                righ: 0,
                                left: 0,
                                bottom: 0,
                            }}
                            onBackdropPress={() => setTootip(false)}>
                            <View style={{
                                width: normalize(130),
                                backgroundColor: "#FFFFFF",
                                borderRadius: normalize(10),
                                padding: normalize(5),
                                marginLeft: normalize(110),
                                marginBottom: normalize(160)
                            }}>
                                {again && again.map((topic, index) => (
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#000" }}>
                                        {topic}
                                    </Text>
                                ))}
                            </View>
                        </Modal>
                    </>
                )}
            </SafeAreaView>
        </>
    )
}
export default ExploreCastCourse
