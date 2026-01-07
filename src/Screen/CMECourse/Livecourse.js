import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl, StyleSheet, Platform } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Fonts from '../../Themes/Fonts'
import IconDot from 'react-native-vector-icons/Entypo';
import Colorpath from '../../Themes/Colorpath';
import Imagepath from '../../Themes/Imagepath';
import Calender from 'react-native-vector-icons/EvilIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { cmeCourseRequest } from '../../Redux/Reducers/CMEReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import moment from 'moment';
import Modal from 'react-native-modal';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { normalizeColor } from 'react-native-reanimated/lib/typescript/Colors';
import { AppContext } from '../GlobalSupport/AppContext';
import { FormatDateZone } from '../../Utils/Helpers/Timezone';
let status = "";
const Livecourse = ({ fetchnamelive, creditwholelive, setLoadingdownstlv, loadingdownstlv }) => {
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
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [limit, setLimit] = useState(100);
    const [refreshing, setRefreshing] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [pendingall, setPendingall] = useState([]);
    const [compltall, setCompltall] = useState([]);
    const [dataAll, setDataAll] = useState([]);
    const [modalviewlive, setModalviewlive] = useState(false);
    const [needReviewlive, setNeedReviewlive] = useState(0);
    const [onlineNamelive, setOnlineNamelive] = useState("");
    const threeDotDatalive = [{ id: 0, name: "Rate & Review" }, { id: 1, name: "Download Certificate" }]
    const duplicateDatalive = [{ id: 1, name: "Download Certificate" }]
    const duplicateDataReviewlive = [{ id: 0, name: "Rate & Review" }]
    const [pdfUrist, setPdfUrist] = useState("");
    const [certificatelive, setCertificatelive] = useState("");
    const Fulldatalive = (needReviewlive == 1 && certificatelive) ? threeDotDatalive :
        (needReviewlive == 1 && !certificatelive) ? duplicateDataReviewlive :
            (needReviewlive == 0 && certificatelive) ? duplicateDatalive : null;
    useEffect(() => {
        fetchHandle();
    }, [fetchnamelive, isFocus]);

    console.log(fetchnamelive, "loading----------", creditwholelive, Fulldatalive?.length, dataAll?.length);
    const fullActionlive = (dataItem) => {
        const url = dataItem?.detailpage_url;
        const result = url.split('/').pop();
        console.log(result, "webcast url=======", dataItem);
        if (dataItem?.current_activity_api == "activitysession") {
            navigation.navigate("VideoComponent", { RoleData: dataItem });
        } else if (dataItem?.current_activity_api == "introduction") {
            navigation.navigate("StartTest", { conference: dataItem?.id })
        } else if (dataItem?.current_activity_api == "startTest") {
            navigation.navigate("PreTest", { activityID: { activityID: dataItem?.current_activity_id, conference_id: dataItem?.id } })
        } else if (dataItem?.button_display_text == "Add Credits") {
            navigation.navigate("AddCredits", { mainAdd: creditwholelive })
        } else if (result) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: creditwholelive } })
        }
    }
    const titlhandleUrllive = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = urltitle.split('/').pop();
        console.log(resulttitle, "webcast url=======", make);
        if (resulttitle) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, creditData: creditwholelive } })
        }
    }
    const handleLinkst = (link) => {
        if (link) {
            const showPDF = async () => {
                setLoadingdownstlv(true);
                try {
                    const cleanedPath = link.replace(/\s+/g, '');
                    const url = `https://static.emedevents.com/uploads/conferences/certificates/${cleanedPath}`;
                    console.log(url, "url---------");
                    const fileName = url.split("/").pop();
                    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
                    console.log('Downloading file from:', url);
                    console.log('Saving file to:', localFile);
                    const options = {
                        fromUrl: url,
                        toFile: localFile,
                    };
                    const downloadResult = await RNFS.downloadFile(options).promise;
                    console.log('Download result:', downloadResult);
                    setPdfUrist(localFile);
                    console.log('File downloaded successfully to:', localFile);
                } catch (error) {
                    console.error('Error during file download:', error);
                } finally {
                    setLoadingdownstlv(false);
                }
            };
            showPDF();
        }
    };

    useEffect(() => {
        if (pdfUrist) {
            const openFileViewerst = async () => {
                try {
                    console.log('Opening file viewer for:', pdfUrist);
                    await FileViewer.open(pdfUrist);
                    setPdfUrist(null);
                } catch (error) {
                    console.error('Error opening file viewer:', error);
                }
            };
            openFileViewerst();
        }
    }, [pdfUrist]);
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

    const fetchMore = useCallback(() => {
        if (!apiReq && !CMEReducer?.cmeCourseResponse?.conferences) {
            setPageNum(pageNum + 1);
            fetchHandle();
        }
        console.log("hello")
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
                console.log(CMEReducer?.cmeCourseResponse?.conferences?.length, "helooo========")
                if (CMEReducer?.cmeCourseResponse?.conferences?.length > 0) {
                    let modifiedData = [
                        ...storeAlldata,
                        ...CMEReducer?.cmeCourseResponse?.conferences,
                    ]?.filter(
                        (value, index, self) =>
                            index === self.findIndex(t => t?.id === value?.id),
                    );
                    setStoreAlldata(modifiedData);
                } else if (CMEReducer?.cmeCourseResponse?.conferences?.length == 0) {
                    setApiReq(false);
                    setLoading(false);
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
                const targetTypes = [1, 6, 34];
                return targetTypes?.includes(type);
            });
            setFilteredItems(filteredData);
        }
    }, [storeAlldata]);
    useEffect(() => {
        if (filteredItems?.length > 0) {
            const filteredDataComplt = filteredItems?.filter(item => {
                return item?.event_happening_text == "";
            });
            setCompltall(filteredDataComplt);
        }
    }, [fetchnamelive])
    useEffect(() => {
        if (filteredItems?.length > 0) {
            const filteredDataPending = filteredItems?.filter(item => {
                return item?.event_happening_text;
            });
            setPendingall(filteredDataPending);
        }
    }, [fetchnamelive])
    console.log(pendingall, compltall, "pendingall1111111", filteredItems, dataAll);
    useEffect(() => {
        const resultData = fetchnamelive === "All" ? filteredItems :
            fetchnamelive === "Pending" ? pendingall :
                fetchnamelive === "Completed" ? compltall :
                    [];
        setDataAll(resultData);
    }, [fetchnamelive, filteredItems, pendingall, compltall]);
    const courserenderData = ({ item, index }) => {
        const formatDate = (dateStr) => {
            const date = moment(dateStr, "DD MMM'YY");
            return date.format("MMM  D").replace(' ', '');
        };
        const formattedDate = formatDate(item?.startdate);
        const formatDateEnd = (dateStr) => {
            const date = moment(dateStr, "DD MMM'YY");
            return date.format("MMM D, YYYY").replace('', '');
        };
        const formattedDateend = formatDateEnd(item?.enddate);
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
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%', paddingVertical: normalize(2), paddingHorizontal: normalize(2) }}>
                            <TouchableOpacity onPress={() => { titlhandleUrllive(item) }}>
                                <Text numberOfLines={2}
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 16,
                                        color: "#000000",
                                        fontWeight: "bold",
                                        flex: 1,
                                        flexWrap: 'wrap',
                                        width: normalize(210)
                                    }}
                                >
                                    {item?.title}
                                </Text>
                            </TouchableOpacity>
                            {(item?.certificate?.certificate || item?.needReview) ? (
                                <TouchableOpacity onPress={() => {
                                    setModalviewlive(!modalviewlive);
                                    setNeedReviewlive(item?.needReview);
                                    setOnlineNamelive(item);
                                    setCertificatelive(item?.certificate?.certificate)
                                }}>
                                    <IconDot name="dots-three-vertical" size={25} color={"#848484"} />
                                </TouchableOpacity>
                            ) : <></>}
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: normalize(0), paddingVertical: normalize(8) }}>
                            <Calender name="calendar" size={25} color={"#000000"} />
                            {/* <Image source={item.id === 3 ?Imagepath.Pending: Imagepath.Complt} style={{ height: normalize(15), width: normalize(15), resizeMode: "contain" }} /> */}
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 12,
                                    color: "#666",
                                    fontWeight: "bold",
                                    marginLeft: normalize(10),
                                }}
                            >
                                {`${formattedDate} - ${formattedDateend}`}
                            </Text>
                        </View>
                        <View style={{ marginTop: normalize(10), height: 1, width: normalize(270), backgroundColor: "#DDD" }} />
                        {item?.display_cme ? <View style={{ alignSelf: 'flex-start', top: 10 }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#666" }}>
                                {`${item?.display_cme
                                    ? item?.display_cme?.toLowerCase()?.includes("contact hour")
                                        ? item?.display_cme.replace(/contact hour/i, "Contact Hour(s)")
                                        : item?.display_cme
                                    : ""
                                    }`}
                            </Text>
                        </View> : null}
                        {item?.location && <View style={{ alignSelf: 'flex-start', top: 10 }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#666" }}>
                                {item?.location}
                            </Text>
                        </View>}
                        {item?.button_display_text ? <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(15), width: '100%' }}>
                            <TouchableOpacity onPress={() => {
                                setStatepush(creditwholelive);
                                if (item?.buttonText === "Revise Course") {
                                    navigation.navigate("VideoComponent", { RoleData: item });
                                } else {
                                    fullActionlive(item);
                                }
                            }} style={{ height: normalize(30), width: normalize(270), borderRadius: normalize(5), justifyContent: "center", alignItems: "center", borderColor: Colorpath.ButtonColr, borderWidth: 0.5 }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 15,
                                        color: "#2C4DB9",
                                    }}
                                >
                                    {item?.button_display_text}
                                </Text>
                            </TouchableOpacity>
                        </View> : null}
                    </View>
                </View>
            </View>
        )
    }
    return (
        <View>
            <FlatList
                data={dataAll}
                renderItem={courserenderData}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={fetchMore}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{ paddingBottom: normalize(270) }}
                // onScroll={()=>{console.log("hello")}}
                scrollEventThrottle={16}
                ListFooterComponent={
                    (loading && dataAll?.length > 1 || loading) ? <ActivityIndicator color={Colorpath.ButtonColr} size="large" /> : null
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fullDataRefresh}
                    />
                }
                ListEmptyComponent={!loading &&
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
            <Modal
                animationIn={'slideInUp'}
                animationOut={'slideOutDown'}
                isVisible={modalviewlive}
                backdropColor={Colorpath.black}
                style={{
                    width: '100%',
                    alignSelf: 'center',
                    margin: 0,
                }}
                onBackdropPress={() => setModalviewlive(false)}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setModalviewlive(false)}>

                    <View
                        style={{
                            borderRadius: normalize(7),
                            height: Fulldatalive?.length == 1
                                ? normalize(80)
                                : Fulldatalive?.length == 2
                                    ? normalize(140)
                                    : normalize(140)
                            ,
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
                            data={Fulldatalive}
                            renderItem={({ item }) => {
                                const handlePress = () => {
                                    setModalviewlive(false);
                                    if (item?.id === 1) {
                                        if (certificatelive) {
                                            // Add a small delay to ensure the component is ready
                                            const timer = setTimeout(() => {
                                                handleLinkst(certificatelive);
                                            }, 500); // 100ms delay

                                            return () => clearTimeout(timer); // Cleanup the timer
                                        }
                                    } else if (item?.id === 0) {
                                        navigation?.navigate("RateReview", { onlineName: onlineNamelive });
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
    )
}

export default Livecourse
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