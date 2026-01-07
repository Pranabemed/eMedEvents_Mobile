import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import Fonts from '../Themes/Fonts';
import Imagepath from '../Themes/Imagepath';
import Colorpath from '../Themes/Colorpath';
import IconDot from 'react-native-vector-icons/Entypo';
import normalize from '../Utils/Helpers/Dimen';
import ProgressBarLine from './ProgressPerce';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
const ResumeDash = ({ allProfTake, allNoDetData, item, index, addit }) => {
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
    const [loadingdownst, setLoadingdownst] = useState(false);
    const threeDotData = [{ id: 0, name: "Rate & Review" }, { id: 1, name: "Download Certificate" }]
    const duplicateData = [{ id: 1, name: "Download Certificate" }]
    const duplicateDataReview = [{ id: 0, name: "Rate & Review" }]
    const Fulldata = (needReview == 1 && certificate) ? threeDotData :
        (needReview == 1 && !certificate) ? duplicateDataReview :
            (needReview == 0 && certificate) ? duplicateData : null;
    console.log(needReview, "loading----------", addit, item);
    const handleUrl = () => {
        const url = onlineName?.detailpage_url;
        const result = url.split('/').pop();
        console.log(result, "webcast url=======", onlineName);
        if (result) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: addit } })
        }
    }
    const titlhandleUrl = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = urltitle.split('/').pop();
        console.log(resulttitle, "webcast url=======", make);
        if (resulttitle) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, creditData: addit } })
        }
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
            navigation.navigate("AddCredits", { mainAdd: addit })
        } else if (result) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: addit } })
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
                    setTimeout(async () => {
                        await FileViewer.open(pdfUrist);
                    }, 2000);
                    setPdfUrist(null);
                } catch (error) {
                    console.error('Error opening file viewer:', error);
                }
            };
            openFileViewerst();
        }
    }, [pdfUrist]);
    const cmehit = () => {
        if (allProfTake && item?.display_cme) {
            return (
                <View>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#666666", fontWeight: "bold"
                        }}
                    >
                        {item?.display_cme}
                    </Text>
                </View>
            )
        } else if (allNoDetData && item?.cme_points_popovar?.length > 0) {
            return (
                <View>
                    {item?.cme_points_popovar?.map((d, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                                numberOfLines={3}
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 12,
                                    color: "#666666",
                                    fontWeight: "bold",
                                }}
                            >
                                {`${parseFloat(d?.points) || 0} ${d?.name &&
                                        d?.name?.toLowerCase() == "contact hour"
                                        ? "Contact Hour(s)"
                                        : d?.name || ""
                                    }`}
                            </Text>
                        </View>
                    ))}

                </View>
            )
        } else if (item.cme_points_popovar) {
            return (
                <>
                    {
                        item.cme_points_popovar.map((d, index, array) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#666666",
                                        paddingVertical: normalize(0),
                                        width: normalize(120),
                                        fontWeight: "bold"
                                    }}
                                >
                                    {`${parseFloat(d?.points)} ${d?.name}`}
                                </Text>

                            </View>
                        ))
                    }
                </>
            )

        } else if (item?.display_cme) {
            return (
                <View>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#666666",
                            paddingVertical: normalize(0),
                            fontWeight: "bold",
                            // width: normalize(120)
                        }}
                    >
                        {item?.display_cme}
                    </Text>
                </View>
            )
        }
        return null;
    };
    return (
        <View>
            <View style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(10) }}>
                <View
                    style={{
                        flexDirection: "column",
                        width: normalize(300),
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

                    <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(5), alignSelf: 'flex-start', top: 5 }}>
                        {/* <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#666666" }}>
                            {item?.display_cme}
                        </Text> */}
                        {cmehit()}
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", paddingVertical: normalize(5), width: '100%' }}>
                        <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                            <View style={{ flexDirection: "column", paddingHorizontal: normalize(0), gap: normalize(8) }}>
                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 11, color: "#000000", fontWeight: "bold" }}>{`${item?.completed_percentage || 0}% Completed`}</Text>
                                <ProgressBarLine progress={item?.completed_percentage || 0} height={6} fillColor={Colorpath.green} />
                            </View>
                        </View>

                        {item?.button_display_text ? <TouchableOpacity
                            onPress={() => {
                                setStatepush(addit);
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
                                borderWidth: 0.5,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 15,
                                    color: "#2C4DB9",
                                    fontWeight: "bold"
                                }}
                            >
                                {item?.button_display_text}
                            </Text>
                        </TouchableOpacity> : null}
                    </View>
                </View>
            </View>
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
};
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
export default ResumeDash