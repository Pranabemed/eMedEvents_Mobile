import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Platform, BackHandler } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import Fonts from '../../Themes/Fonts';
import IconDot from 'react-native-vector-icons/Entypo';
import Colorpath from '../../Themes/Colorpath';
import Imagepath from '../../Themes/Imagepath';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import normalize from '../../Utils/Helpers/Dimen';
import { cmeCourseRequest } from '../../Redux/Reducers/CMEReducer';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import { AppContext } from '../GlobalSupport/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context'

const NonMain = (props) => {
    const {
        statepush,
        setStatepush
    } = useContext(AppContext);
    const navigation = useNavigation();
    const [modalview, setModalview] = useState(false);
    const [needReview, setNeedReview] = useState(0);
    const [onlineName, setOnlineName] = useState("");
    const [certificate, setCertificate] = useState("");
    const [pdfUrist, setPdfUrist] = useState("");
    const threeDotData = [{ id: 0, name: "Rate & Review" }, { id: 1, name: "Download Certificate" }]
    const duplicateData = [{ id: 1, name: "Download Certificate" }]
    const duplicateDataReview = [{ id: 0, name: "Rate & Review" }]
    const CMEReducer = useSelector(state => state.CMEReducer);
    const dispatch = useDispatch();
    const Fulldata = (needReview == 1 && certificate) ? threeDotData :
        (needReview == 1 && !certificate) ? duplicateDataReview :
            (needReview == 0 && certificate) ? duplicateData : null;
    const handleUrl = () => {
        const url = onlineName?.detailpage_url;
        const result = url.split('/').pop();
        console.log(result, "webcast url=======", onlineName);
        if (result) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: props?.route?.params?.myact?.creditData } })
        }
    }
    const titlhandleUrl = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = urltitle.split('/').pop();
        console.log(resulttitle, "webcast url=======", make);
        if (resulttitle) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, creditData: props?.route?.params?.myact?.creditData } })
        }
    }
    const downCredit = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: "TabNav", params: { initialRoute: "Home" } }
                ],
            })
        );

    }
    const fullAction = (dataItem) => {
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
            navigation.navigate("AddCredits", { mainAdd: props?.route?.params?.myact?.creditData })
        } else if (result) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: props?.route?.params?.myact?.creditData } })
        }
    }
    const handleLinkst = (link) => {
        if (link) {
            const showPDF = async () => {
                setLoadingdownst(true);
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
            "pageno": 0,
            "limit": 9,
            "request_type": "normallist",
            "listby_type": "view"
        };
        connectionrequest()
            .then(() => {
                dispatch(cmeCourseRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
            });
    };
    useEffect(() => {
        if (props?.route?.params?.myact?.recnt == "recnt") {
            fetchHandle();
        }
    }, [props?.route?.params?.myact?.recnt])
    useEffect(() => {
        const onBackPress = () => {
            downCredit();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    const courserenderData = ({ item, index }) => {
        console.log(item, "item-=---------")
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
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
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
                                        width: normalize(250)
                                    }}
                                >
                                    {item?.title}
                                </Text>
                            </TouchableOpacity>
                            {(item?.certificate?.certificate || item?.needReview) ? (
                                <TouchableOpacity onPress={() => {
                                    console.log(item?.needReview, "item?.needReview")
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

                        {item?.display_cme ? <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), borderRadius: normalize(20), backgroundColor: "#FFF2E0", marginTop: normalize(10), alignSelf: 'flex-start' }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, fontWeight: "bold", color: "#666" }}>
                                {`${item?.display_cme
                                    ? item?.display_cme?.toLowerCase()?.includes("contact hour")
                                        ? item?.display_cme.replace(/contact hour/i, "Contact Hour(s)")
                                        : item?.display_cme
                                    : ""
                                    }`}
                            </Text>
                        </View> : null}

                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(10), width: '100%' }}>
                            <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    {item?.completed_percentage ? <>
                                        <Image source={item?.completed_percentage === 100 ? Imagepath.Complt : Imagepath.Pending} style={{ height: normalize(15), width: normalize(15), resizeMode: "contain" }} />
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 12,
                                                color: "#666",
                                                fontWeight: "bold",
                                                marginLeft: normalize(10),
                                            }}
                                        >
                                            {item?.completed_percentage === 100 ? "Completed" : `${item?.completed_percentage != null ? item?.completed_percentage : 0}% Completed`}
                                        </Text>
                                    </> : null}
                                    {item?.average_rating ? <View style={{ flexDirection: "row", marginLeft: normalize(10) }}>
                                        <Image source={Imagepath.Star} style={{ height: normalize(10), width: normalize(10), resizeMode: "contain", top: 2 }} />
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 12,
                                                color: "#666",
                                                fontWeight: "bold",
                                                marginLeft: normalize(5),
                                                top: 1
                                            }}
                                        >
                                            {item?.average_rating}
                                        </Text>
                                    </View> : null}
                                </View>
                            </View>

                            {(item?.button_display_text || item?.buttonText) ? <TouchableOpacity
                                onPress={() => {
                                    setStatepush(props?.route?.params?.myact?.creditData);
                                    if (item?.buttonText === "Revise Course") {
                                        navigation.navigate("VideoComponent", { RoleData: item });
                                    } else {
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
                                        fontSize: 16,
                                        color: "#2C4DB9",
                                    }}
                                >
                                    {item?.button_display_text || item?.buttonText}
                                </Text>
                            </TouchableOpacity> : null}
                        </View>
                    </View>
                </View>
            </View>

        );
    };
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title={props?.route?.params?.myact?.recnt ? "Recently Viewed" : "My Activities"}
                            onBackPress={downCredit}
                        />
                    ) : (
                        <PageHeader
                            title={props?.route?.params?.myact?.recnt ? "Recently Viewed" : "My Activities"}
                            onBackPress={downCredit}
                        />

                    )}
                </View>
                <Loader
                    visible={CMEReducer?.status == 'CME/cmeCourseRequest'} />
                <View>

                    <FlatList
                        data={props?.route?.params?.myact?.recnt ? CMEReducer?.cmeCourseResponse?.conferences : props?.route?.params?.myact?.realdata}
                        renderItem={courserenderData}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReachedThreshold={0.5}
                        contentContainerStyle={{ paddingBottom: normalize(280) }}
                        ListEmptyComponent={!props?.route?.params?.myact?.realdata &&
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
            </SafeAreaView>
        </>
    );
}

export default NonMain;
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