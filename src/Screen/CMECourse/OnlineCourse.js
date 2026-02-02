import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl, StyleSheet, Platform, Alert } from 'react-native';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import Fonts from '../../Themes/Fonts';
import IconDot from 'react-native-vector-icons/Entypo';
import Colorpath from '../../Themes/Colorpath';
import Imagepath from '../../Themes/Imagepath';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { cmeCourseRequest } from '../../Redux/Reducers/CMEReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Modal from 'react-native-modal';
import ScheduleCourse from './ScheduleCourse';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import Calend from 'react-native-vector-icons/AntDesign';
import Loader from '../../Utils/Helpers/Loader';
import { AppContext } from '../GlobalSupport/AppContext';
let status = "";
const OnlineCourse = ({ loading, setLoading, fetchname, crediwhole, loadingdownst, setLoadingdownst, filteredItems, setFilteredItems, setPendingall, pendingall, setCompltall, compltall, dataAll, setDataAll }) => {
    const {
        statepush,
        setStatepush
    } = useContext(AppContext);
    const navigation = useNavigation();
    const CMEReducer = useSelector(state => state.CMEReducer);
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const [storeAlldata, setStoreAlldata] = useState([]);
    const [apiReq, setApiReq] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [limit, setLimit] = useState(9);
    const [refreshing, setRefreshing] = useState(false);
    const [modalview, setModalview] = useState(false);
    const [needReview, setNeedReview] = useState(0);
    const [onlineName, setOnlineName] = useState("");
    const [certificate, setCertificate] = useState("");
    const [filtermodal, setFiltermodal] = useState(false);
    const [pdfUrist, setPdfUrist] = useState("");
    const [showloader, setShowLoader] = useState(false);
    const openFilterModal = () => {
        setFiltermodal(!filtermodal);
    }
    const handleSave = () => {
        setFiltermodal(false);
    };
    const threeDotData = [{ id: 0, name: "Rate & Review" }, { id: 1, name: "Download Certificate" }]
    const duplicateData = [{ id: 1, name: "Download Certificate" }]
    const duplicateDataReview = [{ id: 0, name: "Rate & Review" }]
    const Fulldata = (needReview == 1 && certificate) ? threeDotData :
        (needReview == 1 && !certificate) ? duplicateDataReview :
            (needReview == 0 && certificate) ? duplicateData : null;
    useEffect(() => {
        fetchHandle();
    }, [fetchname, isFocus]);
    const handleUrl = () => {
        const url = onlineName?.detailpage_url;
        const result = url.split('/').pop();
        if (result) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: crediwhole } })
        }
    }
    const titlhandleUrl = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = urltitle.split('/').pop();
        if (resulttitle) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, creditData: crediwhole } })
        }
    }
    const fullAction = (dataItem) => {
        const url = dataItem?.detailpage_url;
        const result = url.split('/').pop();
        if (dataItem?.current_activity_api == "activitysession") {
            navigation.navigate("VideoComponent", { RoleData: dataItem });
        } else if (dataItem?.current_activity_api == "introduction") {
            navigation.navigate("StartTest", { conference: dataItem?.id })
        } else if (dataItem?.current_activity_api == "startTest") {
            navigation.navigate("PreTest", { activityID: { activityID: dataItem?.current_activity_id, conference_id: dataItem?.id } })
        } else if (dataItem?.button_display_text == "Add Credits") {
            navigation.navigate("AddCredits", { mainAdd: crediwhole })
        } else if (result) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: crediwhole } })
        }
    }
    const fetchHandle = () => {
        let obj = {
            "pageno": pageNum,
            "limit": limit,
            "request_type": "normallist",
            "listby_type": "myactivities"
        };
        connectionrequest()
            .then(() => {
                dispatch(cmeCourseRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
                setLoading(false);
            });
    };
    useFocusEffect(
        useCallback(() => {
            setStoreAlldata([]); // Reset stored data on focus
            setPageNum(0); // Reset pagination
            fetchHandle(); // Fetch fresh data
        }, [])
    );
    const fetchMore = useCallback(() => {
        if (!apiReq && CMEReducer?.cmeCourseResponse?.conferences?.length > 0) {
            setPageNum(pageNum + 1);
            fetchHandle();
        }
    }, [apiReq]);

    const fullDataRefresh = () => {
        setStoreAlldata([]);
        setPageNum(0);
        setRefreshing(false);
        fetchHandle();
    };

    if (status === '' || CMEReducer.status !== status) {
        switch (CMEReducer.status) {
            case 'CME/cmeCourseRequest':
                status = CMEReducer.status;
                setApiReq(true);
                setLoading(true);
                break;
            case 'CME/cmeCourseSuccess':
                status = CMEReducer.status;
                setApiReq(false);
                setLoading(false);
                const newData = CMEReducer?.cmeCourseResponse?.conferences || [];
                if (newData.length > 0) {
                    const modifiedData = [
                        ...storeAlldata,
                        ...newData,
                    ]?.filter(
                        (value, index, self) =>
                            index === self.findIndex(t => t?.id === value?.id),
                    );
                    setStoreAlldata(modifiedData);
                }
                break;
            case 'CME/cmeCourseFailure':
                status = CMEReducer.status;
                setApiReq(false);
                setLoading(false);
                break;
        }
    }
    useEffect(() => {
        if (storeAlldata?.length > 0) {
            const filteredData = storeAlldata?.filter(item => {
                const type = parseInt(item?.conference_type);
                const excludedTypes = [1, 6, 34];
                return !excludedTypes.includes(type);
            });
            setFilteredItems(filteredData);
        }
    }, [storeAlldata]);
    useEffect(() => {
        if (storeAlldata?.length > 0) {
            const filteredDataComplt = filteredItems?.filter(item => {
                return item?.completed_percentage === 100;
            });
            setCompltall(filteredDataComplt);
        }
    }, [fetchname, storeAlldata])
    useEffect(() => {
        if (storeAlldata?.length > 0) {
            const filteredDataPending = filteredItems?.filter(item => {
                return item?.completed_percentage >= 0 && item?.completed_percentage <= 99;
            });
            setPendingall(filteredDataPending);
        }
    }, [fetchname, storeAlldata])
    useEffect(() => {
        const resultData = fetchname === "All" ? filteredItems :
            fetchname === "Pending" ? pendingall :
                fetchname === "Completed" ? compltall :
                    [];
        setDataAll(resultData);
    }, [fetchname, storeAlldata, pendingall, compltall]);
    const handleLinkst = (link) => {
        if (link) {
            const showPDF = async () => {
                setLoadingdownst(true);
                try {
                    const cleanedPath = link.replace(/\s+/g, '');
                    const url = `https://static.emedevents.com/uploads/conferences/certificates/${cleanedPath}`;
                    const fileName = url.split("/").pop();
                    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
                    const options = {
                        fromUrl: url,
                        toFile: localFile,
                    };
                    const downloadResult = await RNFS.downloadFile(options).promise;
                    console.log('Download result:', downloadResult);
                    setPdfUrist(localFile);
                } catch (error) {
                    console.error('Error during file download:', error);
                } finally {
                    setLoadingdownst(false);
                }
            };
            showPDF();
        }
    };

    useEffect(() => {
        if (pdfUrist) {
            const openFileViewerst = async () => {
                try {
                    await FileViewer.open(pdfUrist);
                    setPdfUrist(null);
                } catch (error) {
                    console.error('Error opening file viewer:', error);
                }
            };
            openFileViewerst();
        }
    }, [pdfUrist]);
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(true);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);
    const courserenderData = ({ item, index }) => {
        return (
            <View>
                <View style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(10) }}>
                    <View
                        style={{
                            flexDirection: "column",
                            width: normalize(290),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            alignItems: "flex-start",
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%', paddingVertical: normalize(2), paddingHorizontal: normalize(0) }}>
                            <TouchableOpacity onPress={() => { titlhandleUrl(item); }}>
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 16,
                                        color: "#000000",
                                        fontWeight: "bold",
                                        flexShrink: 1,
                                        flexWrap: 'wrap',
                                        width: normalize(210)
                                    }}
                                >
                                    {item?.title}
                                </Text>
                            </TouchableOpacity>
                            {(item?.certificate?.certificate || item?.needReview) ? (
                                <TouchableOpacity onPress={() => {
                                    setModalview(!modalview);
                                    setNeedReview(item?.needReview);
                                    setOnlineName(item);
                                    setCertificate(item?.certificate?.certificate);
                                }}>
                                    <IconDot name="dots-three-vertical" size={25} color={"#848484"} />
                                </TouchableOpacity>
                            ) : null}
                        </View>

                        <View style={{ marginTop: normalize(10), height: 1, width: '100%', backgroundColor: "#DDD" }} />

                        {item?.display_cme ? <View style={{ paddingHorizontal: normalize(0), marginTop: normalize(5), alignSelf: 'flex-start', top: 5 }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#666666" }}>
                                {`${item?.display_cme
                                    ? item?.display_cme?.toLowerCase()?.includes("contact hour")
                                        ? item?.display_cme.replace(/contact hour/i, "Contact Hour(s)")
                                        : item?.display_cme
                                    : ""
                                    }`}
                            </Text>
                        </View> : null}

                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(5), width: '100%' }}>
                            <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                                <View style={{ flexDirection: "row", paddingHorizontal: normalize(0), gap: normalize(8) }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(4) }}>
                                        <Image source={item?.completed_percentage === 100 ? Imagepath.Complt : Imagepath.Pending} style={{ height: normalize(13), width: normalize(13), resizeMode: "contain" }} />
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 12,
                                                color: "#666666",
                                                // fontWeight: "bold",
                                            }}
                                        >
                                            {item?.completed_percentage === 100 ? "Completed" : `${item?.completed_percentage != null ? item?.completed_percentage : 0}% Completed`}
                                        </Text>
                                    </View>
                                    {item?.average_rating ? <View style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: normalize(3)
                                    }}>
                                        <Image
                                            source={Imagepath.Star}
                                            style={{
                                                height: normalize(10),
                                                width: normalize(10),
                                                resizeMode: "contain",
                                                // Adjust vertical position if needed:
                                                top: -1 // Fine-tune if necessary
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterBold,
                                                fontSize: 14,
                                                color: "#666666",
                                                // fontWeight: "bold",
                                                // Better vertical alignment for text:
                                                lineHeight: normalize(15), // Match star height
                                                height: normalize(15), // Explicit height
                                                textAlignVertical: "center", // Android
                                                includeFontPadding: false
                                            }}
                                        >
                                            {item?.average_rating}
                                        </Text>
                                    </View> : null}
                                </View>
                            </View>

                            {item?.button_display_text ? <TouchableOpacity
                                onPress={() => {
                                    setStatepush(statepush);
                                    if (item?.buttonText === "Revise Course") {
                                        setStatepush(statepush);
                                        navigation.navigate("VideoComponent", { RoleData: item });
                                    } else {
                                        setStatepush(statepush);
                                        fullAction(item);
                                    }
                                }}
                                style={{
                                    height: normalize(30),
                                    width: normalize(120),
                                    borderRadius: normalize(5),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderColor: Colorpath.ButtonColr,
                                    borderWidth: 0.5
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 15,
                                        color: "#2C4DB9",
                                    }}
                                >
                                    {item?.button_display_text}
                                </Text>
                            </TouchableOpacity> : null}
                        </View>

                        {/* <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(10), width: '100%' }}>
                            <TouchableOpacity onPress={openFilterModal}
                                style={{
                                    height: normalize(30),
                                    width: normalize(220),
                                    borderRadius: normalize(5),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderColor: Colorpath.ButtonColr,
                                    borderWidth: 0.5
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16,
                                        color: "#2C4DB9",
                                    }}
                                >
                                    {"Schedule a Course"}
                                </Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
            </View>

        );
    };
    return (
        <View>
            <FlatList
                data={dataAll}
                renderItem={courserenderData}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={fetchMore}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{ paddingBottom: normalize(280) }}
                scrollEventThrottle={16}
                ListFooterComponent={
                    showloader && loading && dataAll?.length > 1 ? <ActivityIndicator color={Colorpath.ButtonColr} size="large" /> : null
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fullDataRefresh}
                    />
                }
                ListEmptyComponent={!showloader ? <ActivityIndicator size={"small"} color={"green"} /> : !loading &&
                    <Text
                        style={{
                            alignContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            color: Colorpath.grey,
                            fontWeight: 'bold',
                            fontFamily: Fonts.InterMedium,
                            fontSize: normalize(20),
                            paddingTop: normalize(30),
                        }}>
                        No data found
                    </Text>
                }
            />
            {/* {This code for Schedule a course button,please don't remove} */}
            {/* <View style={{
                position: "absolute",
                bottom: 0,
                top: 350,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center"
            }}>
                <TouchableOpacity onPress={() => { navigation.navigate("CMEPlanner"); }} style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    height: normalize(50),
                    width: normalize(170),
                    backgroundColor: Colorpath.white,
                    borderWidth: 0.5,
                    borderColor: "#AAAAAA",
                    borderRadius: normalize(50),
                    paddingHorizontal: normalize(15)
                }}>
                    <Calend name="calendar" size={25} color={Colorpath.black} style={{ marginRight: normalize(10) }} />
                    <Text style={{
                        fontFamily: Fonts.InterMedium,
                        fontSize: 14,
                        color: Colorpath.black,
                    }}>
                        {"Schedule a Course "}
                    </Text>
                </TouchableOpacity>
            </View> */}
            <ScheduleCourse
                isfilterVisible={filtermodal}
                onfilterFalse={openFilterModal}
                onSave={handleSave}
            />
            <Modal
                animationIn={'slideInUp'}
                animationOut={'slideOutDown'}
                isVisible={modalview}
                backdropColor={Colorpath.black}
                style={{
                    width: '100%',
                    alignSelf: 'center',
                    margin: 0,
                }}
                onBackdropPress={() => setModalview(false)}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setModalview(false)}>

                    <View
                        style={{
                            borderRadius: normalize(7),
                            height: Fulldata?.length == 1
                                ? normalize(80)
                                : Fulldata?.length == 2
                                    ? normalize(140)
                                    : normalize(140),
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            backgroundColor: '#fff',
                        }}>
                        <FlatList
                            contentContainerStyle={{
                                paddingBottom: normalize(70),
                                paddingTop: normalize(7),
                            }}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item => item.id.toString()}
                            data={Fulldata}
                            renderItem={({ item }) => {
                                const handlePress = () => {
                                    setModalview(false);
                                    if (item?.id === 1) {
                                        if (certificate) {
                                            // Add a small delay to ensure the component is ready
                                            const timer = setTimeout(() => {
                                                handleLinkst(certificate);
                                            }, 500); // 100ms delay

                                            return () => clearTimeout(timer); // Cleanup the timer
                                        }
                                    } else if (item?.id === 0) {
                                        navigation?.navigate("RateReview", { onlineName: onlineName });
                                    } else if (item?.id === 2) {
                                        handleUrl();
                                    }
                                };

                                return (
                                    <TouchableOpacity
                                        onPress={handlePress}
                                        style={styles.dropDownItem}
                                    >
                                        <Text style={styles.dropDownItemText}>
                                            {item?.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />

                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

export default OnlineCourse;
const styles = StyleSheet.create({
    dropDownItem: {
        borderWidth: 1,
        marginTop: normalize(10),
        justifyContent: 'center',
        alignItems: 'center',
        height: normalize(40),
        width: '85%',
        alignSelf: 'center',
    },
    dropDownItemText: {
        fontSize: 16,
        lineHeight: normalize(14),
        textAlign: 'center',
        color: Colorpath.black,
        textTransform: 'capitalize',
        fontFamily: Fonts.InterMedium
    },
})