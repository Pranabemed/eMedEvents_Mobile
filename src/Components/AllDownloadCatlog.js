import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, StyleSheet, ScrollView } from "react-native";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import Colorpath from "../Themes/Colorpath";
import PageHeader from "./PageHeader";
import MyStatusBar from "../Utils/MyStatusBar";
import Fonts from "../Themes/Fonts";
import normalize from "../Utils/Helpers/Dimen";
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context'
const AllDownloadCatalog = (props) => {
    const [loading, setLoading] = useState(false);
    const [pdfUri, setPdfUri] = useState(null);
    const [pdftrue, setPdftrue] = useState(false);
    const [pDFPath, setPDFPath] = useState(null);

    useEffect(() => {
        if (props?.route?.params?.mainPDF) {
            const finalPath = `${props?.route?.params?.mainPDF}`;
            setPDFPath(finalPath);
        }
    }, [props?.route?.params?.mainPDF]);

    useEffect(() => {
        if (pDFPath) {
            const showPDF = async () => {
                setLoading(true);
                try {
                    const url = pDFPath;
                    const fileName = url.split("/").pop();
                    const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
                    const options = {
                        fromUrl: url,
                        toFile: localFile,
                    };
                    setPdfUri(localFile);
                } catch (error) {
                    console.error('Error during file download:', error); // Enhanced error logging
                } finally {
                    setLoading(false);
                }
            };
            showPDF();
        }
    }, [pDFPath]);

    useEffect(() => {
        if (pdftrue) {
            const openFileViewer = async () => {
                try {
                    await FileViewer.open(pdfUri);
                } catch (error) {
                    console.error('Error opening file viewer:', error); // Enhanced error logging
                }
            };
            openFileViewer();
        }
    }, [pdftrue, pdfUri]);

    const downPress = () => {
        props.navigation.goBack();
    };

    return (
        <>
            <MyStatusBar
                barStyle={"light-content"}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === "ios" ? (
                    <PageHeader
                        title="State Wise CME Course Bundle For Physicians-4.pdf"
                        onBackPress={downPress}
                    />
                ) : (
                    <View>
                        <PageHeader
                            title="State Wise CME Course Bundle For Physicians-4.pdf"
                            onBackPress={downPress}
                        />
                    </View>
                )}
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        {loading ? (
                            <ActivityIndicator
                                size="large"
                                color={Colorpath.ButtonColr}
                            />
                        ) : pdfUri ? (
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
                                    onPress={() => setPdftrue(true)}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>
                                        {"View Certificate"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text style={styles.errorText}>
                                {"Unable to load PDF."}
                            </Text>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(10),
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colorpath.Pagebg,
        paddingBottom: normalize(20), // Added padding at the bottom for spacing
    },
    button: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        width: normalize(310),
        height: normalize(50),
        zIndex: 1,
        position: "absolute",
        bottom: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 20,
        fontFamily: Fonts.InterMedium,
        color: Colorpath.white,
    },
    pdfContainer: {
        width: '100%',
        height: normalize(500), // Increase height to make it more scrollable
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: Colorpath.grey,
        overflow: 'hidden',
        marginTop: normalize(20),
    },
    pdf: {
        width: '100%',
        height: '100%',
    },
    errorText: {
        color: Colorpath.red,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default AllDownloadCatalog;
