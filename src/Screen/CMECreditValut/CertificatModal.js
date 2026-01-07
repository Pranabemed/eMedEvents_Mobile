import { View, Text, FlatList, TouchableOpacity, Alert, Platform } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/AntDesign'
import IconName from 'react-native-vector-icons/MaterialIcons';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import { boardvaultRequest, deletevaultRequest } from '../../Redux/Reducers/CreditVaultReducer';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { stateCourseRequest, stateMandatoryRequest, stateReportingRequest } from '../../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
let status = "";
const CertificatModal = ({takeboard,setStateget,stateget,statename,fakedata, dataFull, setDataFull, deleteIndex, setDeleteIndex, CreditVaultReducer, dispatch, certificatefecthed, setCertificatefecthed, navigation, styles, creditModal, setCreditModal, dommyData, particular, setParticular }) => {
    console.log(particular,stateget, "particular>>>>>>>>>>>", certificatefecthed, deleteIndex, dataFull,statename);
    function detectFileType(file) {
        if (!file?.certificate || file?.certificate == null) {
            return Alert.alert('!eMedEvents', 'Application error: png or pdf  not found .', [{ text: "Ok", onPress: () => { setCreditModal(false) } }, { text: "Close", onPress: () => { setCreditModal(false) } }]);
        }
        const fileName = file?.certificate;
        if (fileName.toLowerCase().endsWith('.png')) {
            return navigation.navigate("DownloadImage", { PngFIle: { PngFIle: file?.certificate, Path: certificatefecthed ,Title:particular?.program_title} });
        } else if (fileName.toLowerCase().endsWith('.jpg')) {
            return navigation.navigate("DownloadImage", { PngFIle: { PngFIle: file?.certificate, Path: certificatefecthed,Title:particular?.program_title } });
        } else if (fileName.toLowerCase().endsWith('.pdf')) {
            return navigation.navigate("DownloadCertificate", { PngFIle: { PngFIle: file?.certificate, Path: certificatefecthed } });;
        } else {
            return 'unknown';
        }
    }
    const handleDelete = (dataid) => {
        console.log('Data ID to delete:', dataid, 'Type:', typeof dataid);
        console.log('Current Data Full:', dataFull);
        if (!Array.isArray(dataFull) || dataFull[0]?.length === 0) {
            console.error('dataFull is not an array or is empty:', dataFull);
            return;
        }
        const normalizedDataId = String(dataid).trim();
        const index = dataFull[0].findIndex(item => String(item.id).trim() === normalizedDataId);
        console.log('Index of item to delete:', index);
        if (index !== -1) {
            const updatedData = [...dataFull[0].slice(0, index), ...dataFull[0].slice(index + 1)];
            console.log('Updated Data After Removal:', updatedData);
            const wrappedData = wrapDataInDoubleArray(updatedData);
            console.log('Wrapped Data:', wrappedData[0]);
            setDataFull(wrappedData[0]);
        } else {
            console.log('Item not found');
        }
    };
    const removeIdFromState = (idToRemove) => {
        const updatedState = { ...stateget };
        Object.keys(updatedState).forEach((yearKey) => {
          const yearData = updatedState[yearKey];
          Object.keys(yearData).forEach((key) => {
            if (Array.isArray(yearData[key])) {
              yearData[key] = yearData[key].filter((item) => item.id !== idToRemove);
            }
          });
        });
    
        setStateget(updatedState); 
      };
    const wrapDataInDoubleArray = (certificates) => {
        if (certificates) {
            return [[certificates]];
        }
        return [[]];
    };
const hanldeState =()=>{
    if (statename) {
        let obj = {
            "state_id": statename?.state_id
        }
        dispatch(stateCourseRequest(obj));
        dispatch(stateReportingRequest(obj))
    }
}
const boardTake=()=>{
    dispatch(boardvaultRequest({}))
}
    if (status == '' || CreditVaultReducer.status != status) {
        switch (CreditVaultReducer.status) {
            case 'CreditVault/deletevaultRequest':
                status = CreditVaultReducer.status;
                break;
            case 'CreditVault/deletevaultSuccess':
                status = CreditVaultReducer.status;
                console.log(CreditVaultReducer, ">>>>>>>deletevaultReducer1233");
                hanldeState();
                boardTake();
                break;
            case 'CreditVault/deletevaultFailure':
                status = CreditVaultReducer.status;
                break;
        }
    }
    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            isVisible={creditModal}
            backdropColor={Colorpath.black}
            style={{
                width: '100%',
                alignSelf: 'center',
                margin: 0,
            }}
            onBackdropPress={() => setCreditModal(false)}>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setCreditModal(false)}>

                <View
                    style={particular?.edit_delete_allowed == '1'  ? {
                        borderRadius: normalize(7),
                        height: Platform.OS === 'ios' ? normalize(210) : normalize(210),
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        backgroundColor: '#fff',
                    }:{
                        borderRadius: normalize(7),
                        height: Platform.OS === 'ios' ? normalize(130) : normalize(130),
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
                        data={particular?.edit_delete_allowed == '1' ?  dommyData :fakedata}
                        renderItem={({ item, index }) => {
                            const handlePress = (data) => {
                                console.log(particular, "id=====122", data)
                                // setCreditModal(false);
                                if (item?.id == 0) {
                                    navigation.navigate("AddCredits", { fulldata: { fulldata: particular, certiPath: certificatefecthed, statenamefull: statename, takeboardall:takeboard} })
                                    setCreditModal(false)
                                } else if (item?.id == 1) {
                                    detectFileType(particular);
                                    setCreditModal(false);
                                } else if (item?.id == 2) {
                                    Alert.alert('eMedEvents', 'Are you sure want to delete this certficate', [{
                                        text: "Yes", onPress: () => {
                                            setDeleteIndex(particular?.id);
                                            setCreditModal(false);
                                            if (stateget) {
                                                removeIdFromState(particular?.id);
                                            } else if (dataFull) {
                                                handleDelete(particular?.id);
                                            }
                                            let obj = {
                                                "id": particular?.id
                                            }
                                            dispatch(deletevaultRequest(obj))
                                        }
                                    }, { text: "No", onPress: () => { console.log("jello") } }])
                                }

                            };

                            return (
                                <>
                                    <TouchableOpacity
                                        onPress={() => { handlePress(item) }}
                                        style={styles.dropDownItem}
                                    >

                                        <View style={{ paddingHorizontal: normalize(10) }}>
                                            <Icon name={item.Icon} size={20} color={Colorpath.black} />
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
    )
}

export default CertificatModal 