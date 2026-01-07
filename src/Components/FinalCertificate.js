import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, StyleSheet, ScrollView } from "react-native";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import Colorpath from "../Themes/Colorpath";
import PageHeader from "./PageHeader";
import MyStatusBar from "../Utils/MyStatusBar";
import Fonts from "../Themes/Fonts";
import normalize from "../Utils/Helpers/Dimen";
import connectionrequest from "../Utils/Helpers/NetInfo";
import { useDispatch, useSelector } from "react-redux";
import { certificatewiseexamRequest } from "../Redux/Reducers/CMEReducer";
import showErrorAlert from "../Utils/Helpers/Toast";
import Pdf from 'react-native-pdf';
import Buttons from "./Button";
import { stateDashboardRequest } from "../Redux/Reducers/DashboardReducer";
import { AppContext } from "../Screen/GlobalSupport/AppContext";
import NetInfo from '@react-native-community/netinfo';
import IntOff from "../Utils/Helpers/IntOff";
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
let status1 = "";
const DownloadCertificate = (props) => {
    const {
        statepush,
        setFinddata,
        isConnected
    } = useContext(AppContext);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const CMEReducer = useSelector(state => state.CMEReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const dispatch = useDispatch();
    console.log(props?.route?.params, "exmaid ", CMEReducer);
    const [loading, setLoading] = useState(false);
    const [pdfUri, setPdfUri] = useState(null);
    const [pdftrue, setPdftrue] = useState(false);
    const [pDFPath, setPDFPath] = useState(null);
    useEffect(() => {
        if (props?.route?.params?.examID) {
            let obj = {
                "ExamId": props?.route?.params?.examID?.examID,
                "CertificateActivityId": props?.route?.params?.examID?.CertificateActivityId?.next_activity_id,
                "ConferenceId": props?.route?.params?.examID?.CertificateActivityId?.conferenceId
            };
            connectionrequest()
                .then(() => {
                    dispatch(certificatewiseexamRequest(obj));
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) });
        }
    }, [props?.route?.params?.examID]);

    if (status === '' || CMEReducer.status !== status) {
        switch (CMEReducer.status) {
            case 'CME/certificatewiseexamRequest':
                status = CMEReducer.status;
                break;
            case 'CME/certificatewiseexamSuccess':
                status = CMEReducer.status;
                console.log("certificatewiseexam", CMEReducer?.certificatewiseexamResponse?.certificatePath);
                setPDFPath(CMEReducer?.certificatewiseexamResponse?.certificatePath);
                break;
            case 'CME/startTestFailure':
                status = CMEReducer.status;
                break;
        }
    }
    useEffect(() => {
        if (statepush) {
            const takeID = statepush?.state_id || statepush?.creditID?.state_id;
            connectionrequest()
                .then(() => {
                    dispatch(stateDashboardRequest({ "state_id": takeID }))
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) })
        }
    }, [statepush])
    const finalTakePer = () => {
        if (statepush) {
            const takeID = statepush?.state_id || statepush?.creditID?.state_id;
            connectionrequest()
                .then(() => {
                    dispatch(stateDashboardRequest({ "state_id": takeID }))
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) })
        }
    }
    useEffect(() => {
        if (props?.route?.params?.PngFIle) {
            const finalPath = `${props?.route?.params?.PngFIle?.Path?.certificate_path ? props?.route?.params?.PngFIle?.Path?.certificate_path : props?.route?.params?.PngFIle?.Path}${props?.route?.params?.PngFIle?.PngFIle}`
            setPDFPath(finalPath);
        }
    }, [props?.route?.params?.PngFIle])
    useEffect(() => {
        if (pDFPath) {
            const showPDF = async () => {
                setLoading(true);
                try {
                    const url = pDFPath
                    // const url = CMEReducer?.certificatewiseexamResponse?.certificatePath ? CMEReducer?.certificatewiseexamResponse?.certificatePath : CMEReducer?.certificatewiseexamResponse?.certificatePath;
                    const f2 = url.split("/");
                    const fileName = f2[f2.length - 1];
                    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
                    const options = {
                        fromUrl: url,
                        toFile: localFile,
                    };
                    await RNFS.downloadFile(options).promise;
                    setLoading(false);
                    setPdfUri(localFile);
                    // await FileViewer.open(localFile);
                } catch (error) {
                    setLoading(false);
                    console.log(error, "error");
                }
            };
            showPDF();
        }
    }, [pDFPath])
    useEffect(() => {
        if (pdftrue) {
            const onPress = async () => {
                setLoading(true);
                try {
                    const url = pDFPath
                    // const url = CMEReducer?.certificatewiseexamResponse?.certificatePath ? CMEReducer?.certificatewiseexamResponse?.certificatePath : CMEReducer?.certificatewiseexamResponse?.certificatePath;
                    const f2 = url.split("/");
                    const fileName = f2[f2.length - 1];
                    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
                    const options = {
                        fromUrl: url,
                        toFile: localFile,
                    };
                    await RNFS.downloadFile(options).promise;
                    setLoading(false);
                    setPdftrue(false);
                    await FileViewer.open(localFile);
                } catch (error) {
                    setLoading(false);
                    console.log(error, "error");
                }
            };
            onPress()
        }
    }, [pdftrue])
    const downPress = () => {
        finalTakePer();
        props.navigation.goBack();
    };
    if (status1 == '' || DashboardReducer.status != status1) {
        switch (DashboardReducer.status) {
            case 'Dashboard/stateDashboardRequest':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/stateDashboardSuccess':
                status1 = DashboardReducer.status;
                setFinddata(DashboardReducer?.stateDashboardResponse?.data);
                console.log("finddatapostfail====", DashboardReducer?.stateDashboardResponse?.data)
                break;
            case 'Dashboard/stateDashboardFailure':
                status1 = DashboardReducer.status;
                break;
        }
    }
    return (
        <>
            <MyStatusBar
                barStyle={"light-content"}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === "ios" ? (
                    <PageHeader
                        title={props?.route?.params?.PngFIle?.notrq ? "View Document" : "Course Certificate"}
                        onBackPress={downPress}
                    />
                ) : (
                    <View>
                        <PageHeader
                            title={props?.route?.params?.PngFIle?.notrq ? "View Document" : "Course Certificate"}
                            onBackPress={downPress}
                        />
                    </View>
                )}
                {/* <ScrollView contentContainerStyle={{paddingBottom:normalize(50)}}> */}
                {conn == false ? <IntOff />:<View style={styles.container}>
                    {pdfUri ?
                        <View style={styles.pdfContainer}>
                            <Pdf
                                source={{ uri: pdfUri, cache: true }}
                                onLoadComplete={(numberOfPages, filePath) => {
                                    console.log(`number of pages: ${numberOfPages}`);
                                }}
                                onPageChanged={(page, numberOfPages) => {
                                    console.log(`current page: ${page}`);
                                }}
                                onError={(error) => {
                                    console.log(error);
                                }}
                                onPressLink={(uri) => {
                                    console.log(`Link pressed: ${uri}`);
                                }}
                                style={styles.pdf}
                            />
                            <TouchableOpacity
                                onPress={() => { setPdftrue(true) }}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>
                                    {props?.route?.params?.PngFIle?.notrq ? "Download Document" : "Download Certificate"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        : <ActivityIndicator
                            size="large"
                            color={Colorpath.ButtonColr}
                        />}
                    <Buttons
                        onPress={() => {
                            if (props?.route?.params?.PngFIle) {
                                finalTakePer();
                                props.navigation.navigate("TabNav", { initialRoute: "Contact" });
                                // props.navigation.goBack();
                            } else {
                                finalTakePer();
                                props.navigation.navigate("TabNav");
                            }
                        }}
                        height={normalize(45)}
                        width={normalize(288)}
                        backgroundColor={Colorpath.white}
                        borderRadius={normalize(5)}
                        text={props?.route?.params?.PngFIle?.notrq ? "Back" : props?.route?.params?.PngFIle ? "Back to Credit Vault " : "Go to Dashboard"}
                        color={Colorpath.ButtonColr}
                        fontSize={18}
                        fontFamily={Fonts.InterSemiBold}
                        marginTop={normalize(15)}
                        borderColor={Colorpath.ButtonColr}
                        borderWidth={0.5}
                    />
                    {props?.route?.params?.PngFIle ? <></> : <Buttons
                        onPress={() => { props.navigation.navigate("RateReview", { reviewCon: props?.route?.params?.examID?.CertificateActivityId?.conferenceId }) }}
                        height={normalize(45)}
                        width={normalize(288)}
                        backgroundColor={Colorpath.ButtonColr}
                        borderRadius={normalize(5)}
                        text="Review Course"
                        color={Colorpath.white}
                        fontSize={18}
                        fontFamily={Fonts.InterSemiBold}
                        marginTop={normalize(15)}
                    />}
                </View>}
            </SafeAreaView>
            {/* </ScrollView> */}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colorpath.Pagebg,
    },
    button: {
        position: 'absolute',
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        width: normalize(310),
        height: normalize(50),
        zIndex: 1,
        bottom: 0
    },
    buttonText: {
        fontSize: 20,
        fontFamily: Fonts.InterMedium,
        color: Colorpath.white,
        alignSelf: "center",
        paddingVertical: normalize(12)
    },
    pdfContainer: {
        width: '90%',
        height: '70%',
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: Colorpath.grey,
        overflow: 'hidden',
        marginTop: normalize(20),
        position: 'relative',
    },
    pdf: {
        width: '100%',
        height: '100%',
    },
    buttonOverlay: {
        position: 'absolute',
        bottom: normalize(20),
        left: '50%',
        transform: [{ translateX: -normalize(150) }],
        padding: 20,
        borderRadius: normalize(10),
        zIndex: 1,
    },
});

export default DownloadCertificate;
