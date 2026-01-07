import { View, Text, TouchableOpacity, FlatList, Platform, Alert } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import ShareIcn from 'react-native-vector-icons/AntDesign';
import { styles } from '../CMECreditValut/Statevaultstyes';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import Dynamicmodal from './Dynamicmodal';
const GlobalModal = ({gettitle,title ,typewise, globaldrop, setGloabaldrop, maindata ,travelmodal,setTravelmodal}) => {
    console.log(maindata, "maindata---")
    const dommyData = [{ id: 0, name: "View ", Icon: "eye" }, { id: 1, name: "Edit", Icon: "edit" }, { id: 2, name: "share", Icon: "sharealt" }, { id: 3, name: "Download", Icon: "download" }];
    const onPressUrl = async () => {
        try {
            const url = `https://static.emedevents.com/uploads/invoices/${maindata?.documents}`;
            console.log(url, "url========");
            if (!url || !url.startsWith("http")) {
                console.log("Invalid URL:", url);
                Alert.alert("Error", "Image URL is invalid or not available.");
                return;
            }
            const fileName = url.split("/").pop(); 
            const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`; 
            const options = {
                fromUrl: url,
                toFile: localFile,
            };
            const downloadResult = await RNFS.downloadFile(options).promise;
            if (downloadResult.statusCode === 200) {
                console.log("Image downloaded successfully:", localFile);
                try {
                    await FileViewer.open(localFile, { showOpenWithDialog: true });
                } catch (fileOpenError) {
                    console.error("Error opening image:", fileOpenError);

                    if (fileOpenError.message.includes("No app associated")) {
                        Alert.alert(
                            "Error",
                            "No application is available to open this file type. Please install a compatible app."
                        );
                    } else {
                        Alert.alert("Error", "An error occurred while opening the file.");
                    }
                }
            } else {
                console.log("Download failed:", downloadResult);
                Alert.alert("Error", "Failed to download the image.");
            }
        } catch (error) {
            console.error("Error downloading file:", error);
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
        <>
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            isVisible={globaldrop}
            backdropColor={Colorpath.black}
            style={{
                width: '100%',
                alignSelf: 'center',
                margin: 0,
            }}
            onBackdropPress={() => setGloabaldrop(false)}>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setGloabaldrop(false)}>

                <View
                    style={{
                        borderRadius: normalize(7),
                        height: Platform.OS === 'ios' ? normalize(230) : normalize(230),
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
                        data={dommyData}
                        renderItem={({ item, index }) => {


                            return (
                                <>
                                    <TouchableOpacity onPress={() => {
                                        if (item?.name == "View ") {
                                            onPressUrl();
                                            setGloabaldrop(false);
                                        }else if(item?.name == "Edit"){
                                            setGloabaldrop(false);
                                               setTravelmodal(!travelmodal);
                                        }  
                                    }}
                                        style={[styles.dropDownItem, { flexDirection: "row" }]}
                                    >
                                        <View style={{ paddingHorizontal: normalize(10) }}>
                                            <ShareIcn name={item.Icon} size={25} color={Colorpath.black} />
                                        </View>
                                        <Text style={styles.dropDownItemText}>
                                            {item?.name}
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            );
                        }}
                    />

                </View>
            </TouchableOpacity>
        </Modal>
             <Dynamicmodal gettitle={gettitle} title={title} typewise={typewise} maindata={maindata} travelmodal={travelmodal} setTravelmodal={setTravelmodal}/> 

        </>
    )
}

export default GlobalModal