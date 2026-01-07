import { View, Text, FlatList, TouchableOpacity, Alert, Platform, StyleSheet } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/AntDesign'
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { boardListDeleteRequest, boardListProfileRequest, stateLicenseDeleteRequest, stateLicenseListRequest } from '../../Redux/Reducers/ProfileReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
let statusd = "";
const ProfileModal = ({setTicktry, board, main, setPaginatedData, paginatedData, profiletakeshow, setProfiletakeshow, remove, detectdata, nav }) => {
    const profileData = [{ id: 0, name: "Edit", Icon: "edit" }, { id: 1, name: "View", Icon: "eye" }, { id: 2, name: "Delete", Icon: "delete" }];
    const deletTake = [{ id: 0, name: "Edit", Icon: "edit" }, { id: 2, name: "Delete", Icon: "delete" }];
    const deletTakef = [{ id: 0, name: "Edit", Icon: "edit" }, { id: 1, name: "View", Icon: "eye" }];
    const deletT = [{ id: 0, name: "Edit", Icon: "edit"}];
    const profMemb = [{ id: 0, name: "Edit", Icon: "edit" }, { id: 1, name: "Delete", Icon: "delete" }];
    console.log(detectdata, "detectdata--------------", paginatedData);
    const dispatch = useDispatch();
    const ProfileReducer = useSelector(state => state.ProfileReducer);
    const deletLic = () => {
        let obj = {
            "id": detectdata?.id
        }
        connectionrequest()
            .then(() => {
                dispatch(board ? boardListDeleteRequest(obj) : stateLicenseDeleteRequest(obj))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }

    function detectFileType() {
        if (!main) {
            return Alert.alert('!eMedEvents', 'Application error: png or pdf  not found .', [{ text: "Ok", onPress: () => { setCreditModal(false) } }, { text: "Close", onPress: () => { setCreditModal(false) } }]);
        }
        const fileName = detectdata?.license_file ? detectdata?.license_file : detectdata?.certification_file;
        console.log(fileName, "filename=======123",fileName.endsWith('.jpg'), main)
        if (fileName.toLowerCase().endsWith('.png')) {
            setProfiletakeshow(!profiletakeshow);
            return nav.navigate("DownloadImage", { 
                PngFIle: { 
                    PngFIle: detectdata?.license_file ? detectdata?.license_file : detectdata?.certification_file, 
                    Path: main, 
                    notrq: "not" 
                } 
            });
        } else if (fileName.toLowerCase().endsWith('.jpg')) {
            setProfiletakeshow(!profiletakeshow);
            return nav.navigate("DownloadImage", { PngFIle: { PngFIle: detectdata?.license_file ? detectdata?.license_file : detectdata?.certification_file, Path: main, notrq: "not" } });
        } else if (fileName.toLowerCase().endsWith('.pdf')) {
            setProfiletakeshow(!profiletakeshow);
            return nav.navigate("DownloadCertificate", { 
                PngFIle: { 
                    PngFIle: detectdata?.license_file ? detectdata?.license_file : detectdata?.certification_file, 
                    Path: main, 
                    notrq: "not" 
                } 
            });
        } else {
            return 'unknown';
        }
    }
    if (statusd == '' || ProfileReducer.status != statusd) {
        switch (ProfileReducer.status) {
            case 'Profile/stateLicenseDeleteRequest':
                statusd = ProfileReducer.status;
                break;
            case 'Profile/stateLicenseDeleteSuccess':
                statusd = ProfileReducer.status;
                setTicktry(true)
                console.log(ProfileReducer?.stateLicenseDeleteResponse, "log-----------");
                if (ProfileReducer?.stateLicenseDeleteResponse?.msg == "Licensure information deleted successfully.") {
                    showErrorAlert("Licensure information deleted successfully.");
                    dispatch(stateLicenseListRequest({}));
                    setProfiletakeshow(!profiletakeshow);
                }
                break;
            case 'Profile/stateLicenseDeleteFailure':
                statusd = ProfileReducer.status;
                setTicktry(false);
                break;
            case 'Profile/boardListDeleteRequest':
                statusd = ProfileReducer.status;
                break;
            case 'Profile/boardListDeleteSuccess':
                statusd = ProfileReducer.status;
                console.log(ProfileReducer?.boardListDeleteResponse, "log-----------");
                if (ProfileReducer?.boardListDeleteResponse?.msg == "Certification information deleted successfully.") {
                    showErrorAlert("Certification information deleted successfully.");
                    dispatch(boardListProfileRequest({}));
                    setProfiletakeshow(!profiletakeshow);
                }
                break;
            case 'Profile/boardListDeleteFailure':
                statusd = ProfileReducer.status;
                break;
        }
    }
    const removeIdFromState = () => {
        const updatedRemvoe = paginatedData.filter(item => item.id !== detectdata?.id);
        setPaginatedData(updatedRemvoe);
    };
    const to_date = detectdata?.to_date;
    const currentDate = new Date();
    let status = "Active"; 
    if (to_date == "0000-00-00") {
        status = "Invalid Date"; 
    } else {
        const toDateObj = new Date(to_date);
    
        // Compare the to_date with the current date
        if (
            toDateObj.getFullYear() < currentDate.getFullYear() || // Year is in the past
            (toDateObj.getFullYear() === currentDate.getFullYear() && toDateObj.getMonth() < currentDate.getMonth()) || // Same year but past month
            (toDateObj.getFullYear() === currentDate.getFullYear() &&
                toDateObj.getMonth() === currentDate.getMonth() &&
                toDateObj.getDate() <= currentDate.getDate()) // Same year, same month, but past or same day
        ) {
            status = "Expiry"; // Update status if conditions match
        }
    }
    const containerStyle = detectdata?.license_file && status == "Active" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(120) : normalize(120),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    }: detectdata?.license_file == "" && status == "Active" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(90) : normalize(90),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    } : typeof detectdata?.license_file == 'object' && status == "Active" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(90) : normalize(90),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    } : status == "Expiry" && detectdata?.license_file == "" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(120) : normalize(120),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    } : status == "Expiry" && detectdata?.license_file ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(200) : normalize(200),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    } :detectdata?.license_file == "" && status == "Invalid Date" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(90) : normalize(90),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    }:detectdata?.license_file && status == "Invalid Date" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(90) : normalize(90),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    }: status == "Expiry" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(120) : normalize(120),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    } : detectdata?.license_file == "" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(120) : normalize(120),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    } : status == "Invalid Date" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(90) : normalize(90),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    }: {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(200) : normalize(200),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    };
    const containerStyleboard = detectdata?.certification_file && status == "Active" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(120) : normalize(120),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    } :detectdata?.certification_file == "" && status == "Active" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(90) : normalize(90),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    }: typeof detectdata?.certification_file == 'object' && status == "Active" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(90) : normalize(90),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    } : status == "Expiry" && detectdata?.certification_file == "" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(120) : normalize(120),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    } : status == "Expiry" && detectdata?.certification_file ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(200) : normalize(200),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    }:detectdata?.certification_file && status == "Invalid Date" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(90) : normalize(90),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    }:detectdata?.certification_file == "" && status == "Invalid Date" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(90) : normalize(90),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    }:  status == "Expiry" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(120) : normalize(120),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    }  : detectdata?.certification_file == "" ? {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(120) : normalize(120),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    }: {
        borderRadius: normalize(7),
        height: Platform.OS === 'ios' ? normalize(200) : normalize(200),
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    };
    return (
        <Modal
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            isVisible={profiletakeshow}
            backdropColor={"rgba(0, 0, 0, 0.5)"}
            statusBarTranslucent={true}
            hardwareAccelerated={true}
            style={{
                width: '100%',
                alignSelf: 'center',
                margin: 0,
            }}
            onBackdropPress={() => setProfiletakeshow(false)}>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setProfiletakeshow(false)}>

                {board ? <View
                    style={containerStyleboard}>
                    <FlatList
                        contentContainerStyle={{
                            paddingBottom: normalize(70),
                            paddingTop: normalize(7),
                        }}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => item.id.toString()}
                        data={detectdata?.certification_file && status == "Active" ? deletTakef :  detectdata?.certification_file == "" && status == "Active" ? deletT :typeof detectdata?.certification_file == 'object' && status == "Active" ? deletT : status == "Expiry" && detectdata?.certification_file ? profileData : status == "Expiry" && detectdata?.certification_file == "" ? deletTake :detectdata?.certification_file && status =="Invalid Date" ? deletT :detectdata?.certification_file == "" && status =="Invalid Date" ? deletT : detectdata?.certification_file == "" ? deletTakef : status == "Expiry" ? deletTake : status =="Invalid Date" ? deletT : remove ? profMemb : profileData}
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    <TouchableOpacity onPress={() => {
                                        if (item?.id == 0) {
                                            setProfiletakeshow(!profiletakeshow);
                                            nav.navigate("AddCertificate", { profiledet: detectdata })
                                        } else if (item?.id == 2) {
                                            Alert.alert("eMedEvents", "Are you sure you want to Delete this ?", [{
                                                text: "No", onPress: () => {
                                                    removeIdFromState();
                                                    setProfiletakeshow(!profiletakeshow);
                                                }, style: "default"
                                            }, { text: "Yes", onPress: () => { deletLic(); }, style: "default" }])
                                        } else if (item?.id == 1) {
                                            detectFileType();
                                        } else {
                                            setProfiletakeshow(!profiletakeshow);
                                        }
                                    }}
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
                </View> : <View
                    style={containerStyle}>
                    <FlatList
                        contentContainerStyle={{
                            paddingBottom: normalize(70),
                            paddingTop: normalize(7),
                        }}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => item.id.toString()}
                        data={detectdata?.license_file && status == "Active" ? deletTakef :detectdata?.license_file == "" && status == "Active" ? deletT : typeof detectdata?.license_file == 'object' && status == "Active" ? deletT : status == "Expiry" && detectdata?.license_file ? profileData : status == "Expiry" && detectdata?.license_file == "" ? deletTake:detectdata?.license_file == ""&& status =="Invalid Date" ? deletT : detectdata?.license_file && status =="Invalid Date" ? deletT : detectdata?.license_file == "" ? deletTakef : status == "Expiry" ? deletTake :status =="Invalid Date" ? deletT: remove ? profMemb : profileData}
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    <TouchableOpacity onPress={() => {
                                        if (item?.id == 0) {
                                            setProfiletakeshow(false);
                                            nav.navigate("AddLicense", { profiledet: detectdata })
                                        } else if (item?.id == 2) {
                                            Alert.alert("eMedEvents", "Are you sure you want to Delete this ?", [{
                                                text: "No", onPress: () => {
                                                    removeIdFromState();
                                                    setProfiletakeshow(!profiletakeshow);
                                                }, style: "default"
                                            }, { text: "Yes", onPress: () => { deletLic(); }, style: "default" }])
                                        } else if (item?.id == 1) {
                                            detectFileType();
                                            setProfiletakeshow(!profiletakeshow);
                                        } else {
                                            setProfiletakeshow(!profiletakeshow);
                                        }
                                    }}
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
                </View>}
            </TouchableOpacity>
        </Modal>
    )
}

export default ProfileModal
const styles = StyleSheet.create({
    dropDownItem: {
        borderWidth: 1,
        marginTop: normalize(10),
        justifyContent: 'center',
        alignItems: 'center',
        height: normalize(40),
        width: '85%',
        alignSelf: 'center',
        flexDirection: "row"
    },
    dropDownItemText: {
        fontSize: 16,
        lineHeight: normalize(14),
        textAlign: 'center',
        color: Colorpath.black,
        textTransform: 'capitalize',
        fontFamily: Fonts.InterMedium
    }
});