/**
 * Resume dash reusable component module. Provides a React Native UI building block used across screens. Exported members: ResumeDash, handleUrl, titlhandleUrl, fullAction, handleLinkst, showPDF, openFileViewerst, cmehit, handlePress, styles.
 */

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

/**
 * Reusable ResumeDash component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const ResumeDash = ({ allProfTake, allNoDetData, item, index, addit }) => {
    const rawProgress = Number(item?.completed_percentage ?? 0);
    const courseProgress = Number.isFinite(rawProgress) ? Math.max(0, Math.min(100, rawProgress)) : 0;
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
        /**
 * Handles url.
 * @returns {void}
 */
const handleUrl = () => {
        const url = onlineName?.detailpage_url;
        const result = url.split('/').pop();
        if (result) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, shareUrl: url, detailpage_url: url, creditData: addit } })
        }
    }
        /**
 * Titlhandle url utility.
 * @param {*} make - Input value.
 * @returns {void}
 */
const titlhandleUrl = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = urltitle.split('/').pop();
        if (resulttitle) {
            navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, shareUrl: urltitle, detailpage_url: urltitle, creditData: addit } })
        }
    }
        /**
 * Full action utility.
 * @param {*} dataItem - Input value.
 * @returns {void}
 */
const fullAction = (dataItem) => {
        const url = dataItem?.detailpage_url;
        const result = url ? url.split('/').pop() : '';
        const btnText = String(dataItem?.button_display_text || dataItem?.buttonText || '').trim().toLowerCase();
        const currentApi = String(dataItem?.current_activity_api || '').trim().toLowerCase();
        const currentActivityText = String(dataItem?.current_activity_text || '').trim().toLowerCase();

        const isStart =
            btnText.includes("start") ||
            btnText.includes("pre test") ||
            btnText.includes("pre-test") ||
            btnText.includes("pre assessment") ||
            btnText.includes("pre-assessment") ||
            btnText.includes("introduction") ||
            currentApi === "introduction" ||
            currentApi === "starttest" ||
            currentApi === "pretest" ||
            currentActivityText.includes("pre test") ||
            currentActivityText.includes("pre-test") ||
            currentActivityText.includes("pre assessment") ||
            currentActivityText.includes("pre-assessment") ||
            currentActivityText.includes("introduction") ||
            dataItem?.is_course_started === 0 ||
            dataItem?.is_course_started === false ||
            dataItem?.is_started === 0;

        if (isStart || dataItem?.current_activity_api == "startTest") {
            navigation.navigate("StartTest", {
                conference: dataItem?.id || dataItem?.conferenceId,
                startCourse: dataItem,
                webcastDetails: dataItem,
            });
        } else if (dataItem?.current_activity_api == "activitysession") {
            navigation.navigate("VideoComponent", { RoleData: dataItem });
        } else if (dataItem?.button_display_text == "Add Credits") {
            navigation.navigate("AddCredits", { mainAdd: addit });
        } else if (result) {
            navigation.navigate("Statewebcast", {
                webCastURL: {
                    webCastURL: result,
                    shareUrl: url,
                    detailpage_url: url,
                    creditData: addit,
                },
            });
        } else {
            navigation.navigate("StartTest", {
                conference: dataItem?.id || dataItem?.conferenceId,
                startCourse: dataItem,
                webcastDetails: dataItem,
            });
        }
    }
        /**
 * Handles linkst.
 * @param {*} link - Input value.
 * @returns {void}
 */
const handleLinkst = (link) => {
        if (link) {
                        /**
 * Show pdf utility.
 *
 * @async
 * @returns {Promise<*>}
 */
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
                        /**
 * Open file viewerst utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const openFileViewerst = async () => {
                try {
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
        /**
 * Cmehit utility.
 * @returns {*}
 */
const cmehit = () => {
        if (allProfTake && item?.display_cme) {
            return (
                <View>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: Fonts.InterSemiBold, fontSize: 13, color: "#333333", fontWeight: "600"
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
                                    fontSize: 13,
                                    color: "#333333",
                                    fontWeight: "600",
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
                                        fontFamily: Fonts.InterSemiBold, fontSize: 13, color: "#333333",
                                        paddingVertical: normalize(0),
                                        fontWeight: "600"
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
                            fontFamily: Fonts.InterSemiBold, fontSize: 13, color: "#333333",
                            paddingVertical: normalize(0),
                            fontWeight: "600",
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
            <View style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(8) }}>
                <View
                    style={{
                        flexDirection: "column",
                        width: normalize(295),
                        borderRadius: normalize(12),
                        backgroundColor: "#FFFFFF",
                        paddingHorizontal: normalize(14),
                        paddingVertical: normalize(14),
                        alignItems: "flex-start",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 3,
                        elevation: 2,
                    }}
                >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", width: '100%' }}>
                        <TouchableOpacity style={{ flex: 1, marginRight: (item?.certificate?.certificate || item?.needReview) ? normalize(6) : 0 }} onPress={() => { titlhandleUrl(item); }}>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={{
                                    fontFamily: Fonts.InterBold,
                                    fontSize: 15,
                                    color: "#000000",
                                    fontWeight: "bold",
                                    lineHeight: 21,
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
                                <IconDot name="dots-three-vertical" size={22} color={"#848484"} />
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    <View style={{ marginTop: normalize(12), marginBottom: normalize(10), height: 1, width: '100%', backgroundColor: "#EEEEEE" }} />

                    <View style={{ paddingHorizontal: normalize(0), alignSelf: 'flex-start', marginBottom: normalize(10) }}>
                        {cmehit()}
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                        <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1, marginRight: normalize(10) }}>
                            <View style={{ flexDirection: "column", paddingHorizontal: normalize(0), gap: normalize(6) }}>
                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#000000", fontWeight: "600" }}>{`${courseProgress}% Completed`}</Text>
                                <ProgressBarLine progress={courseProgress} height={6} fillColor={Colorpath.green} />
                            </View>
                        </View>

                        {(item?.button_display_text || item?.buttonText) ? <TouchableOpacity
                            onPress={() => {
                                setStatepush?.(addit);
                                if (item?.button_display_text === "Revise Course" || item?.buttonText === "Revise Course") {
                                    setStatepush?.(addit);
                                    navigation.navigate("VideoComponent", { RoleData: item });
                                } else {
                                    setStatepush?.(addit);
                                    fullAction(item);
                                }
                            }}
                            style={{
                                height: normalize(34),
                                minWidth: normalize(115),
                                paddingHorizontal: normalize(14),
                                borderRadius: normalize(6),
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: "#2C4DB9",
                                borderWidth: 1,
                                backgroundColor: "#FFFFFF",
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 14,
                                    color: "#2C4DB9",
                                    fontWeight: "600"
                                }}
                            >
                                {item?.button_display_text || item?.buttonText}
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
                                                                /**
 * Handles press.
 * @returns {void}
 */
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
/**
 * Styles value.
 * @returns {*}
 */
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
/**
 * Resume dash default export.
 *
 * @returns {*}
 */
export default ResumeDash
