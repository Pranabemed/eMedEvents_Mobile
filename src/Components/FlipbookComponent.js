import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import Colorpath from '../Themes/Colorpath';
import Pdf from 'react-native-pdf';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
const FlipbookComponent = ({ link, path }) => {
    const [loadingdown, setLoadingdown] = useState(false);
    const [pdfUri, setPdfUri] = useState(null);
    const [pdftrue, setPdftrue] = useState(false);
    const [pDFPath, setPDFPath] = useState(null);
    const [loading,setLoading] = useState(false);
    const openPDF = async (link, path) => {
        if (!link || !path) return;
        setLoadingdown(true);
        try {
            const cleanedLink = link.replace(/\s+/g, '');
            const cleanedPath = path.replace(/\s+/g, '');
            const url = `${cleanedPath}${cleanedLink}`;
            console.log(url, "url---------");

            // Ensure valid filename
            let fileName = url.split("/").pop();
            if (!fileName || !fileName.includes(".")) {
                fileName = "download.pdf";  // fallback
            }

            const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
            console.log('Downloading file from:', url);
            console.log('Saving file to:', localFile);

            // If file exists, skip downloading
            const exists = await RNFS.exists(localFile);
            if (!exists) {
                const options = { fromUrl: url, toFile: localFile };
                await RNFS.downloadFile(options).promise;
                console.log("File downloaded.");
            } else {
                console.log("File already exists, skipping download.");
            }

            // Open file directly
            console.log('Opening file viewer for:', localFile);
            await FileViewer.open(localFile);

        } catch (error) {
            console.error('Error during file download or opening:', error);
        } finally {
            setLoadingdown(false);
        }
    };

    useEffect(() => {
        const cleanedLink = link.replace(/\s+/g, '');
        const cleanedPath = path.replace(/\s+/g, '');
        const url = `${cleanedPath}${cleanedLink}`;
        if (url) {
            setPDFPath(url);
        }
    }, [link, path])
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
                    await FileViewer.open(localFile);
                } catch (error) {
                    setLoading(false);
                    console.log(error, "error");
                }
            };
            onPress()
        }
    }, [pdftrue])

    return (
     
            <View style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:"redß"
                // backgroundColor: Colorpath.Pagebg,
            }}>
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
                            onPress={() => { openPDF(link, path); }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>
                                {"View Mode"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    : <ActivityIndicator
                        size="small"
                        color={Colorpath.ButtonColr}
                    />}
            </View>
    );
};

export default FlipbookComponent;
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
        height:normalize(400) ,
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: Colorpath.grey,
        overflow: 'hidden',
        marginTop: normalize(10),
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