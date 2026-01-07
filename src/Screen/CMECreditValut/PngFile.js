import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Button, Alert, PermissionsAndroid, Platform, View, TouchableOpacity, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import RNFS from 'react-native-fs';
import Colorpath from '../../Themes/Colorpath';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import Buttons from '../../Components/Button';
import FileViewer from 'react-native-file-viewer';
import { AppContext } from '../GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'
const DownloadImage = (props) => {
       const {
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
    const downPressImage = () => {
        props.navigation.goBack();
    };
    const [imageshow, setImageshow] = useState("")
    const navigation = useNavigation();
    useEffect(() => {
        if (props?.route?.params?.PngFIle) {
            const fileUrl_Image = `${props?.route?.params?.PngFIle?.Path?.certificate_path ? props?.route?.params?.PngFIle?.Path?.certificate_path : props?.route?.params?.PngFIle?.Path}${props?.route?.params?.PngFIle?.PngFIle}`;
            setImageshow(fileUrl_Image);
        }
    }, [props?.route?.params?.PngFIle])
    console.log(props?.route?.params?.PngFIle, "pngfooooopooo=========", imageshow)
    const downloadImageJpg = async () => {
        const fileUrl = `${props?.route?.params?.PngFIle?.Path?.certificate_path}${props?.route?.params?.PngFIle?.PngFIle}`;
        const savefileName = props?.route?.params?.PngFIle?.Title || 'eMedEvents';
        try {
            const downloadDir = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath
            const fileDown = `${downloadDir}/${savefileName}.jpg`;
            const getDown = await RNFS.downloadFile({
                fromUrl: fileUrl,
                toFile: fileDown,
            }).promise;
            if (getDown && getDown.statusCode == 200) {
                Alert.alert(
                    'Download Successful!',
                    `Image saved in file ${fileDown && fileDown.replace('/storage/emulated/0/', '/')}`,
                    [
                        {
                            text: 'Open',
                            onPress: () => openFile(fileDown),
                        },
                        { text: 'OK', style: 'cancel' },
                    ]
                );
            } else {
                Alert.alert('eMedEvents', 'Something went wrong!');
            }
        } catch (error) {
            Alert.alert('eMedEvents', error.message);
        }
    };
    const downloadImagePng = async () => {
        const fileUrl = `${props?.route?.params?.PngFIle?.Path?.certificate_path}${props?.route?.params?.PngFIle?.PngFIle}`;
        const savefileName = props?.route?.params?.PngFIle?.Title || 'eMedEvents';
        try {
            const downloadDir = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath;
            const fileDown = `${downloadDir}/${savefileName}.png`;
    
            const getDown = await RNFS.downloadFile({
                fromUrl: fileUrl,
                toFile: fileDown,
            }).promise;
    
            if (getDown && getDown.statusCode == 200) {
                Alert.alert(
                    'Download Successful!',
                    `Image saved in file ${fileDown && fileDown.replace('/storage/emulated/0/', '/')}`,
                    [
                        {
                            text: 'Open',
                            onPress: () => openFile(fileDown),
                        },
                        { text: 'OK', style: 'cancel' },
                    ]
                );
            } else {
                Alert.alert('eMedEvents', 'Something went wrong!');
            }
        } catch (error) {
            Alert.alert('eMedEvents', error.message);
        }
    };
    
    const openFile = (filePath) => {
        FileViewer.open(filePath)
            .then(() => {
                console.log('File opened successfully');
            })
            .catch((error) => {
                Alert.alert('eMedEvents', `Cannot open file: ${error.message}`);
            });
    };
    const downloadImage = async () => {
        const fileUrl = `${props?.route?.params?.PngFIle?.Path?.certificate_path}${props?.route?.params?.PngFIle?.PngFIle}`;
        console.log(fileUrl, "fileUrl========");

        const fileName = 'downloaded_image.png';
        const downloadDir = `${RNFS.ExternalStorageDirectoryPath}/Download`;

        try {
            const dirExists = await RNFS.exists(downloadDir);
            if (!dirExists) {
                await RNFS.mkdir(downloadDir);
            }
            const destinationPath = `${downloadDir}/${fileName}`;
            RNFS.downloadFile({
                fromUrl: fileUrl,
                toFile: destinationPath,
            })
                .promise.then((result) => {
                    if (result.statusCode === 200) {
                        Alert.alert(
                            'Success',
                            'Image downloaded successfully!',
                            [
                                {
                                    text: 'Done',
                                    onPress: () => { navigation.navigate("ImagePDF", { pdffile: destinationPath }) },
                                },
                            ]
                        );
                    } else {
                        Alert.alert('Failed', 'Failed to download image');
                    }
                })
                .catch((error) => {
                    Alert.alert('Error', 'Error downloading image');
                    console.error('Download error:', error);
                });

        } catch (error) {
            Alert.alert('Error', 'Error creating directory or downloading file');
            console.error('Directory creation/download error:', error);
        }
    }
const fileHandle = props?.route?.params?.PngFIle?.PngFIle;
useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);
    return (

        <>
            <MyStatusBar
                barStyle={"light-content"}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === "ios" ? (
                    <PageHeader
                        title={props?.route?.params?.PngFIle?.notrq ? "View Document" : "Course Certificate Image"}
                        onBackPress={downPressImage}
                    />
                ) : (
                    <View>
                        <PageHeader
                            title={props?.route?.params?.PngFIle?.notrq ? "View Document" : "Course Certificate Image"}
                            onBackPress={downPressImage}
                        />
                    </View>
                )}
                {/* <ScrollView contentContainerStyle={{paddingBottom:normalize(50)}}> */}
                {conn == false ? <IntOff />:<View style={styles.container}>
                    {imageshow ?
                        <View style={styles.pdfContainer}>
                            <Image source={{ uri: imageshow }} style={styles.pdf} resizeMode="contain" />
                            {!props?.route?.params?.PngFIle?.notrq && <TouchableOpacity
                                onPress={() => {
                                    if(fileHandle.toLowerCase().endsWith('.png')){
                                        downloadImagePng();
                                    }else if(fileHandle.toLowerCase().endsWith('.jpg')){
                                        downloadImageJpg();
                                    }else{
                                        downloadImage();
                                    }
                                     }}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>
                                    {"Download Image"}
                                </Text>
                            </TouchableOpacity>}
                        </View>
                        : <ActivityIndicator
                            size="large"
                            color={Colorpath.ButtonColr}
                        />}
                    <Buttons
                        onPress={() => {
                            props.navigation.navigate("TabNav", { initialRoute: "Contact" });
                        }}
                        height={normalize(45)}
                        width={normalize(288)}
                        backgroundColor={Colorpath.white}
                        borderRadius={normalize(5)}
                        text={props?.route?.params?.PngFIle?.notrq ? "Back" : "Back to Credit Vault"}
                        color={Colorpath.ButtonColr}
                        fontSize={18}
                        fontFamily={Fonts.InterSemiBold}
                        marginTop={normalize(15)}
                        borderColor={Colorpath.ButtonColr}
                        borderWidth={0.5}
                    />
                </View>}
            </SafeAreaView>
            {/* </ScrollView> */}
        </>
    );
};

export default DownloadImage;
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