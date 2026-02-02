import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import VerifiedCheck from 'react-native-vector-icons/AntDesign';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
const CartPay = ({setPaymentcardfree, dataPayemnt, maindata, isVisible,content, navigation, name, setGocertificate, gocertificate }) => {
    const [pdfsee, setPdfsee] = useState(false);
    const onPress = async () => {
        try {
            // Ensure the URL is available
            const url = dataPayemnt?.invoice;
            if (!url || !url.startsWith("http")) {
                Alert.alert("Error", "Invoice URL is invalid or not available.");
                return;
            }

            const fileName = url.split("/").pop(); // Extract the file name
            const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
            const options = {
                fromUrl: url,
                toFile: localFile,
            };
            const downloadResult = await RNFS.downloadFile(options).promise;
            if (downloadResult.statusCode === 200) {
                await FileViewer.open(localFile);
            } else {
                Alert.alert("Error", "Failed to download the file.");
            }
        } catch (error) {
            console.error("Error downloading file:", error);

            // Handle specific errors
            if (error.message.includes("ENOENT")) {
                Alert.alert("Error", "File path issue detected.");
            } else if (error.message.includes("Network")) {
                Alert.alert("Error", "Network error occurred. Please check your internet connection.");
            } else {
                Alert.alert("Error", "An unexpected error occurred.");
            }
        }
    };

    return (
        <Modal
            isVisible={isVisible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropTransitionOutTiming={0}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            style={styles.modal}
        >
            {dataPayemnt?.ButtonArr ? (<View style={styles.container}>
                <TouchableOpacity onPress={() => {
                    navigation?.navigate(name);
                    setPaymentcardfree(false);
                }} style={styles.closeIcon}>
                    <CloseIcon name="close" size={24} color={Colorpath.white} />
                </TouchableOpacity>

                <VerifiedCheck name="checkcircleo" size={75} color={"#009E38"} />
                <View style={{ marginTop: normalize(20) }}>
                    <Text style={styles.content}>{content}</Text>
                </View>
                <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    {/* Single Button */}
                    <TouchableOpacity
                        onPress={() => {
                            setPaymentcardfree(false);
                            navigation.navigate("StartTest", { startCourse: maindata });
                        }}
                        style={styles.singlebutton}
                    >
                        <Text style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: Colorpath.white,
                            alignSelf: "center"
                        }}>
                            {"Start Course Now"}
                        </Text>
                    </TouchableOpacity>
                     <View style={[styles.buttonContainer, { marginTop: normalize(7) }]}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation?.navigate(name);
                                setPaymentcardfree(false);
                            }}
                            style={dataPayemnt?.invoice ? styles.button:styles.singlebutton}
                        >
                           <Text style={dataPayemnt?.invoice ?styles.buttonText:{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: Colorpath.white,
                            alignSelf: "center"
                        }}>{"Start Course Later"}</Text>
                        </TouchableOpacity>
                        {dataPayemnt?.invoice &&<TouchableOpacity
                            onPress={() => {
                                setPaymentcardfree(false);
                                onPress();
                            }}
                            style={[styles.button, { marginLeft: normalize(20) }]}
                        >
                            <Text style={styles.buttonText}>{"Print Ticket"}</Text>
                        </TouchableOpacity>}
                    </View>
                </View>

            </View>) : typeof dataPayemnt == "object" ? (<View style={styles.container}>
                <VerifiedCheck name="checkcircleo" size={75} color={"#009E38"} />
                <View style={{ marginTop: normalize(20) }}>
                    <Text style={styles.content}>{content}</Text>
                </View>
                <View style={[styles.buttonContainer, { marginTop: normalize(7) }]}>
                    <TouchableOpacity
                        onPress={() => {
                            setPaymentcardfree(false);
                            navigation?.navigate(name);
                        }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{"Go to Dashboard"}</Text>
                    </TouchableOpacity>
                    {dataPayemnt?.invoice && <TouchableOpacity
                        onPress={() => {
                            setPaymentcardfree(false);
                            onPress();
                        }}
                        style={[styles.button, { marginLeft: normalize(20) }]}
                    >
                        <Text style={styles.buttonText}>{"Print Ticket"}</Text>
                    </TouchableOpacity>}
                </View>
            </View>) : (<View style={styles.container}>
                <VerifiedCheck name="checkcircleo" size={75} color={"#009E38"} />
                <View style={{ marginTop: normalize(20) }}>
                    <Text style={styles.content}>{content}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    setPaymentcardfree(false);
                    navigation?.navigate(name);
                    if (gocertificate) {
                        setGocertificate(!gocertificate);
                    }
                }} style={styles.button}>
                    <Text style={styles.buttonText}>{"Done"}</Text>
                </TouchableOpacity>
            </View>)}


        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        flex:1
    },
    container: {
        width: normalize(300),
        backgroundColor: Colorpath.white,
        borderRadius: normalize(10),
        padding: normalize(30),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: "center",
    },
    closeIcon: {
        position: 'absolute',
        top: normalize(10),
        right: normalize(10),
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        height: normalize(25),
        width: normalize(25),
        borderRadius: normalize(25),
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        fontFamily: Fonts.InterMedium,
        fontSize: 20,
        color: Colorpath.black,
        textAlign: 'center',
        marginBottom: normalize(20),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        width: normalize(280),
        paddingVertical: normalize(10),
        marginTop: normalize(15),
    },
    button: {
        backgroundColor: Colorpath.white,
        borderRadius: normalize(5),
        height: normalize(40),
        width: normalize(140),
        justifyContent: 'center',
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2C4DB9",
    },
    singlebutton: {
        backgroundColor: Colorpath.ButtonColr,
        borderRadius: normalize(5),
        height: normalize(40),
        width: normalize(295),
        justifyContent: 'center',
        alignSelf: "center",
    },
    buttonText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 16,
        color: Colorpath.ButtonColr,
        textAlign: "center",
    },
});


export default CartPay;
