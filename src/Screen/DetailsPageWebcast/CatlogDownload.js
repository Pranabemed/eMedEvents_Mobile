import { View, Text, FlatList, TouchableOpacity, Alert, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import { styles } from '../CMECreditValut/Statevaultstyes';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
const CatlogDownload = ({setDownlink,downlink,downData, setLoadingdown,loadingdown,pdfUri,setPdfUri}) => {
  const handleLink =(link)=>{
    if (link) {
        const showPDF = async () => {
            setLoadingdown(true);
            try {
                const url = link?.Path;
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
                setPdfUri(localFile);
                console.log('File downloaded successfully to:', localFile);
            } catch (error) {
                console.error('Error during file download:', error); 
            } finally {
                setLoadingdown(false);
            }
        };
        showPDF();
    }
  }
  useEffect(() => {
    if (pdfUri) {
        const openFileViewer = async () => {
            try {
                console.log('Opening file viewer for:', pdfUri);
                await FileViewer.open(pdfUri);
                setPdfUri(null); 
            } catch (error) {
                console.error('Error opening file viewer:', error); // Enhanced error logging
            }
        };
        openFileViewer();
    }
}, [pdfUri]);
    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            isVisible={downlink}
            backdropColor={Colorpath.black}
            style={{
                width: '100%',
                alignSelf: 'center',
                margin: 0,
            }}
            onBackdropPress={() => setDownlink(false)}>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setDownlink(false)}>

                <View
                    style={{
                        borderRadius: normalize(7),
                        height: Platform.OS === 'ios' ? normalize(180) : normalize(180),
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
                        data={downData}
                        renderItem={({ item, index }) => {
                            const handlePress = (data) => {
                                handleLink(data);
                                setDownlink(false);
                            };

                            return (
                                <>
                                    <TouchableOpacity
                                        onPress={() => { handlePress(item) }}
                                        style={styles.dropDownItem}
                                    >
                                        <Text style={[styles.dropDownItemText]}>
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
    )
}

export default CatlogDownload 