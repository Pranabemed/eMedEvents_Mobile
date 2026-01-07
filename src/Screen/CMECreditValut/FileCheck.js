import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image, Platform, ImageBackground, Animated, Alert, Linking, KeyboardAvoidingView } from 'react-native';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import CalIcon from 'react-native-vector-icons/Octicons';
import Imagepath from '../../Themes/Imagepath';
import IconDot from 'react-native-vector-icons/Entypo';
import PageHeader from '../../Components/PageHeader';
import CustomTextField from '../../Components/CustomTextfiled';
import Search from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/AntDesign'
import CMEChecklistModal from './CMEChecklistModal';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { creditvaultRequest, downloadTranscriptRequest } from '../../Redux/Reducers/CreditVaultReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import CertificatModal from './CertificatModal';
import Loader from '../../Utils/Helpers/Loader';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import DownloadIcn from 'react-native-vector-icons/Feather';
import moment from 'moment';
import IntOff from '../../Utils/Helpers/IntOff';
import { AppContext } from '../GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
const dommyData = [{ id: 0, name: "Edit", Icon: "edit" }, { id: 2, name: "Delete", Icon: "delete" }, { id: 1, name: "View & Download", Icon: "eye" }]
const fakedata = [{ id: 1, name: "View & Download", Icon: "eye" }]
const CertficateHandle = (props) => {
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
    const [zippath, setZippath] = useState("");
    const dispatch = useDispatch();
    const CreditVaultReducer = useSelector(state => state.CreditVaultReducer);
    console.log(props?.route?.params?.boardID, props?.route?.params?.boardCert, "route=========");
    // console.log(props?.route?.params?.boardID?.certificates,"array of data " ,typeof props?.route?.params?.boardID?.certificates);
    const wrapDataInDoubleArray = () => {
        const certificates = props?.route?.params?.boardCert ? props?.route?.params?.boardCert?.certificates : props?.route?.params?.boardCert?.certificate;
        if (certificates) {
            return [[certificates]];
        }
        return [[]];
    };
    useEffect(() => {
        let obj = {
            "board_id": props?.route?.params?.boardCert ? props?.route?.params?.boardCert?.board_id : props?.route?.params?.boardCert?.board_id,
            "type": "certificate"
        }
        let objState = {
            "state_id": props?.route?.params?.boardID?.state_id
        }
        connectionrequest()
            .then(() => {
                dispatch(creditvaultRequest(props?.route?.params?.boardID ? objState : obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to ineternet", err)
            })
    }, [props?.route?.params?.boardID, props?.route?.params?.boardCert])
    const certificatpress = () => {
        props.navigation.goBack();
    }
    const [showMore, setShowMore] = useState({});
    const [searchText, setSearchText] = useState("");
    const [creditModal, setCreditModal] = useState(false);
    const [certificatefecthed, setCertificatefecthed] = useState(null);
    const [particular, setParticular] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(-1);
    const [dataFull, setDataFull] = useState([]);
    const [cmemodal, setCmemodal] = useState(false);
    const onhandle = () => {
        setCmemodal(false);
    }
    const oncmeModalclose = () => {
        setCmemodal(!cmemodal)
    }

    const toggleShowMore = (year, category) => {
        setShowMore(prev => ({
            ...prev,
            [year]: {
                ...prev[year],
                [category]: !prev[year]?.[category]
            }
        }));
    };
    if (status == '' || CreditVaultReducer.status != status) {
        switch (CreditVaultReducer.status) {
            case 'CreditVault/creditvaultRequest':
                status = CreditVaultReducer.status;
                break;
            case 'CreditVault/creditvaultSuccess':
                status = CreditVaultReducer.status;
                console.log(CreditVaultReducer?.creditVaultResponse, ">>>>>>>CreditVaultReducer1233");
                setCertificatefecthed(CreditVaultReducer?.creditVaultResponse);
                console.log(certificatefecthed, "certddificatefecthed?.stddate_data[1]?.renewal_date")
                break;
            case 'CreditVault/creditvaultFailure':
                status = CreditVaultReducer.status;
                break;
            case 'CreditVault/downloadTranscriptRequest':
                status = CreditVaultReducer.status;
                break;
            case 'CreditVault/downloadTranscriptSuccess':
                status = CreditVaultReducer.status;
                setZippath(CreditVaultReducer?.downloadTranscriptResponse);
                console.log(CreditVaultReducer?.downloadTranscriptResponse, "CreditVaultReducer?.downloadTranscriptResponse")
                if (CreditVaultReducer?.downloadTranscriptResponse?.msg == "There are no certificates.") {
                    showErrorAlert(CreditVaultReducer?.downloadTranscriptResponse?.msg)
                }
                break;
            case 'CreditVault/downloadTranscriptFailure':
                status = CreditVaultReducer.status;
                break;
        }
    }

    useEffect(() => {
        if (CreditVaultReducer?.downloadTranscriptResponse?.archive_file) {
            downloadZipFile();
        }
    }, [CreditVaultReducer?.downloadTranscriptResponse])
    const downloadZipFile = async () => {
        const fileUrl = `${zippath?.archive_file_path}${zippath?.archive_file}`
        const filePath = `${RNFS.DocumentDirectoryPath}/${zippath?.archive_file}`;
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const fileContent = await response.blob();
            const base64Data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(fileContent);
            });
            const base64 = base64Data.split(',')[1];
            await RNFS.writeFile(filePath, base64, 'base64');
            Alert.alert('Download successful', 'ZIP file has been downloaded to: ' + filePath);
            await openZipFile(filePath);
        } catch (error) {
            console.error('Download error:', error);
            // Alert.alert('Download failed', error.message);
        }
    };
    const openZipFile = async (filePath) => {
        try {
            const isFileExist = await RNFS.exists(filePath);
            if (!isFileExist) {
                Alert.alert('Error', 'File does not exist at the specified path.');
                return;
            }
            if (Platform.OS === 'android') {
                try {
                    await FileViewer.open(filePath, { showOpenWithDialog: true });
                } catch (e) {
                    console.log('No ZIP viewer app available:', e);
                    Alert.alert(
                        'No App Found',
                        'It seems there is no app installed to open ZIP files. Please download one from the Play Store.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Go to Play Store', onPress: () => Linking.openURL('market://details?id=com.winzip.android') }
                        ]
                    );
                }
            } else if (Platform.OS === 'ios') {
                try {
                    await FileViewer.open(filePath);
                } catch (e) {
                    console.log('No ZIP viewer app available:', e);
                    Alert.alert(
                        'No App Found',
                        'It seems there is no app installed to open ZIP files. Please download one from the App Store.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Go to App Store', onPress: () => Linking.openURL('itms-apps://apps.apple.com/us/app/winzip/id500637987') }
                        ]
                    );
                }
            }
        } catch (error) {
            console.error('Error opening file:', error);
            Alert.alert('Error', 'Unable to open the file. Please check if a ZIP file viewer app is installed.');
        }
    };
    const downloadTrans = () => {
        let obj = {
            "board_id": props?.route?.params?.boardID?.board_data?.board_id || props?.route?.params?.boardCert?.board_data?.board_id,
            "type": props?.route?.params?.boardCert?.board_data?.board_id ? "certificate" : "licensure"
        }
        connectionrequest()
            .then(() => {
                dispatch(downloadTranscriptRequest(obj))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    const stateTranscript = (data, range) => {
        console.log(data, range, "transcript-------");
        let statedown = {
            "board_id": props?.route?.params?.boardID?.board_data?.board_id,
            "type": "licensure",
            "range": range
        }
        connectionrequest()
            .then(() => {
                dispatch(downloadTranscriptRequest(statedown))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    useEffect(() => {
        const doubleArrayCertificates = wrapDataInDoubleArray();
        const fulFinal = doubleArrayCertificates[0];
        setDataFull(fulFinal);
    }, [props?.route?.params?.boardCert]);
    const categorizeDataDynamically = (data) => {
        const result = {};
        Object.keys(data).forEach((yearRange) => {
            if (!result[yearRange]) {
                result[yearRange] = {
                    state_mandatory: [],
                    speciality: [],
                    date_range: ""
                };
            }
            const yearData = data[yearRange];
            if (yearData.state_mandatory) {
                result[yearRange].state_mandatory.push(...yearData.state_mandatory);
            }
            if (yearData.speciality) {
                result[yearRange].speciality.push(...yearData.speciality);
            }
            if (yearData.date_range) {
                result[yearRange].date_range = yearData.date_range;
            }

        });

        return result;
    };

    useEffect(() => {
        const stateId = props?.route?.params?.boardID?.state_id;
        const isDataFetched = certificatefecthed && certificatefecthed.state_data && stateId;
        if (isDataFetched) {
            const stateData = certificatefecthed.state_data[stateId]?.certificates;
            if (stateData) {
                const takeData = { ...stateData };
                const dynamicYearData = categorizeDataDynamically(takeData);
                if (dynamicYearData !== stateget) {
                    setStategetdt(dynamicYearData)
                    setStateget(dynamicYearData);
                }
            }
        }
    }, [props?.route?.params?.boardID?.state_id, certificatefecthed]);


    const [stateget, setStateget] = useState("");
    const [stategetdt, setStategetdt] = useState("");
    const categorizeData = (data) => {
        console.log(data, "data1222");
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        const yearRange = `${currentYear}-${nextYear}`;
        console.log(yearRange, "yearRange------")
        const result = {
            [yearRange]: {
                state_mandatory: [],
                speciality: []
            }
        };

        if (data && data[0]?.length > 0) {
            data[0].forEach(item => {
                if (item.mandated_course == "1") {
                    result[yearRange].state_mandatory.push(item);
                } else if (item.mandated_course == "0") {
                    result[yearRange].speciality.push(item);
                }
            });
        }

        return result;
    };

    const [boardTake, setboardTake] = useState("");
    const [boardTakedt, setboardTakedt] = useState("");
    function mergeData(existingData, newTransformedData) {
        Object.keys(newTransformedData).forEach(year => {
            if (!existingData[year]) {
                existingData[year] = newTransformedData[year];
            } else {
                existingData[year].state_mandatory = [
                    ...(existingData[year].state_mandatory || []),
                    ...newTransformedData[year].state_mandatory
                ];
                existingData[year].speciality = [
                    ...(existingData[year].speciality || []),
                    ...newTransformedData[year].speciality
                ];
            }
        });

        return existingData;
    }
    useEffect(() => {
        const data = certificatefecthed?.certificates
        console.log(data, "data----------", certificatefecthed?.certificates)
        const newData = dataFull?.length > 0 ? dataFull : [];
        if (newData) {
            const transformedData = categorizeData(newData);
            const fullTrans = AnothcategorizeData(data)
            const finalData = mergeData(fullTrans, transformedData);
            if (transformedData !== boardTake) {
                setboardTakedt(finalData)
                setboardTake(finalData);
            }
        }
    }, [props?.route?.params?.boardCert, certificatefecthed, dataFull]);
    useEffect(() => {
        if (stateget) {
            const stateFull = stateget;
            console.log(stateFull, "sattef----------")
        }
    }, [stateget])
    const AnothcategorizeData = (data) => {
        console.log(data, "data1222");
        const result = {};
        if (data) {
            Object.keys(data).forEach(year => {
                const startYear = parseInt(year) - 1;
                const endYear = parseInt(year);
                const yearRange = `${startYear}-${endYear}`;

                result[yearRange] = {
                    state_mandatory: data[year].state_mandatory || [],
                    speciality: data[year].speciality || []
                };
            });
        }
        return result;
    };
    const searchCredit = (searchTerm) => {
        const result = {};
        const isYearSearch = /^[0-9-]+$/.test(searchTerm);
        Object.entries(stategetdt).forEach(([yearRange, details]) => {
            if (isYearSearch && yearRange.includes(searchTerm)) {
                result[yearRange] = details;
            } else {
                const cleanedSearch = searchTerm.toLowerCase().replace(/\s+/g, "");

                const filteredStateMandatory = details.state_mandatory.filter(program =>
                    program.program_title.toLowerCase().replace(/\s+/g, "").includes(cleanedSearch)
                );
                const filteredSpeciality = details.speciality.filter(program =>
                    program.program_title.toLowerCase().replace(/\s+/g, "").includes(cleanedSearch)
                );
                if (filteredStateMandatory.length > 0 || filteredSpeciality.length > 0) {
                    result[yearRange] = {
                        state_mandatory: filteredStateMandatory,
                        speciality: filteredSpeciality,
                        date_range: details.date_range
                    };
                }
            }
        });
        setSearchText(searchTerm);
        return Object.keys(result).length ? setStateget(result) : setStateget({});
    };
    const searchBoard = (searchTerm) => {
        const result = {};
        const isYearSearch = /^[0-9-]+$/.test(searchTerm);
        Object.entries(boardTakedt).forEach(([yearRange, details]) => {
            if (isYearSearch && yearRange.includes(searchTerm)) {
                result[yearRange] = details;
            } else {
                const cleanedSearch = searchTerm.toLowerCase().replace(/\s+/g, "");

                const filteredStateMandatory = details.state_mandatory.filter(program =>
                    program.program_title.toLowerCase().replace(/\s+/g, "").includes(cleanedSearch)
                );

                const filteredSpeciality = details.speciality.filter(program =>
                    program.program_title.toLowerCase().replace(/\s+/g, "").includes(cleanedSearch)
                );
                if (filteredStateMandatory.length > 0 || filteredSpeciality.length > 0) {
                    result[yearRange] = {
                        state_mandatory: filteredStateMandatory,
                        speciality: filteredSpeciality,
                        date_range: details.date_range
                    };
                }
            }
        });
        setSearchText(searchTerm);
        return Object.keys(result).length == 0 ? setboardTake("") : setboardTake(result);
    };
    console.log(boardTakedt, "boardTakedt", boardTake)
    const renderCertificateCard = (item, category) => {
        console.log(item, "state_mandatory=====>>>>>>")
        return (
            <View>
                <View style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(8) }}>
                    <View
                        style={{
                            flexDirection: "column",
                            width: normalize(297),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            alignItems: "flex-start",
                            borderWidth: 0.5,
                            borderColor: "#AAAAAA"
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                                <Image source={Imagepath.VaultCer} style={{ height: normalize(20), width: normalize(20), resizeMode: "contain" }} />
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 16,
                                        color: "#000000",
                                        fontWeight: "bold",
                                        flexShrink: 1,
                                        flexWrap: 'wrap',
                                        marginLeft: normalize(10)
                                    }}
                                >
                                    {item?.program_title}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => {
                                setCreditModal(true);
                                setParticular(item)
                            }}>
                                <IconDot name="dots-three-vertical" size={25} color={"#848484"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    useEffect(() => {
        Object.keys(stateget).forEach((year) => {
            const hasMandatory = stateget[year]?.state_mandatory?.length > 0;
            const hasSpeciality = stateget[year]?.speciality?.length > 0;
            setShowMore(prev => ({
                ...prev,
                [year]: {
                    state_mandatory: hasMandatory ? true : prev[year]?.state_mandatory,
                    speciality: !hasMandatory && hasSpeciality ? true : prev[year]?.speciality,
                }
            }));
        });
    }, [stateget]);
useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            {Platform.OS === 'ios' ? (
                <PageHeader nol={props?.route?.params?.boardCert ? "yes" : "no"} title={props?.route?.params?.boardCert ? props?.route?.params?.boardCert?.board_data?.board_name : props?.route?.params?.boardID?.board_data?.board_name} onBackPress={certificatpress} />
            ) : (
                <View>
                    <PageHeader nol={props?.route?.params?.boardCert ? "yes" : "no"} title={props?.route?.params?.boardCert ? props?.route?.params?.boardCert?.board_data?.board_name : props?.route?.params?.boardID?.board_data?.board_name} onBackPress={certificatpress} />
                </View>
            )}
            {conn == false ? <IntOff /> : <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Loader visible={CreditVaultReducer?.status == 'CreditVault/downloadTranscriptRequest'} />
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={{ alignItems: 'center' }}>
                        <View
                            style={{
                                borderBottomColor: '#000000',
                                borderBottomWidth: 0.5,
                                marginTop: normalize(5)
                            }}>
                            {props?.route?.params?.boardCert ? <CustomTextField
                                value={searchText}
                                onChangeText={searchBoard}
                                color={"#000000"}
                                height={normalize(35)}
                                width={normalize(300)}
                                // backgroundColor={Colorpath.white}
                                alignSelf={'center'}
                                placeholder={'Type a Year or Title to Find Results'}
                                placeholderTextColor="#AAAAAA"
                                fontSize={16}
                                fontFamily={Fonts.InterRegular}
                                // marginTop={normalize(15)}
                                autoCapitalize="none"
                                keyboardType='default'
                                // borderWidth={1}
                                borderColor={"#DDDDDD"}
                                rightIcon={Search}
                                rightIconName={searchText ? "search1" : ""}
                                rightIconSize={22}
                                rightIconColor="#63748b"
                                editable={true}
                            /> : stateget && stateget ? <CustomTextField
                                value={searchText}
                                onChangeText={searchCredit}
                                color={"#000000"}
                                height={normalize(35)}
                                width={normalize(300)}
                                // backgroundColor={Colorpath.white}
                                alignSelf={'center'}
                                placeholder={'Type a Year or Title to Find Results'}
                                placeholderTextColor="#AAAAAA"
                                fontSize={16}
                                fontFamily={Fonts.InterRegular}
                                // marginTop={normalize(15)}
                                autoCapitalize="none"
                                keyboardType='default'
                                // borderWidth={1}
                                borderColor={"#DDDDDD"}
                                rightIcon={Search}
                                rightIconName={searchText ? "search1" : ""}
                                rightIconSize={22}
                                rightIconColor="#63748b"
                                editable={true}
                            /> : null}
                        </View>
                    </View>

                    {props?.route?.params?.boardID?.state_id && certificatefecthed ? (
                        <>
                            {Object.keys(stateget).length > 0 ? (
                                Object.keys(stateget)
                                    .sort((a, b) => parseInt(b) - parseInt(a))
                                    .map((year, index, array) => {
                                        const dateRange = stateget[year]?.date_range;
                                        console.log(year, dateRange, "year and date_range");
                                        return (
                                            <View key={year} style={styles.yearContainer}>
                                                <View style={styles.headerContainer}>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <CalIcon name="calendar" size={25} color={Colorpath.ButtonColr} />
                                                        <TouchableOpacity style={styles.yearButton}>
                                                            <Text style={styles.yearText}>
                                                                {index == 0
                                                                    ? `${certificatefecthed?.state_data[props?.route?.params?.boardID?.state_id ? props?.route?.params?.boardID?.state_id : props?.route?.params?.boardID?.state_id].renewal_date}(${year})`
                                                                    : year}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <TouchableOpacity onPress={() => { stateTranscript(index, dateRange) }} style={styles.button}>
                                                        <DownloadIcn name="download" size={25} color={Colorpath.ButtonColr} />
                                                        <Text style={styles.buttonText}>{"All Transcripts"}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                {stateget[year]?.state_mandatory?.length > 0 && <View style={{ flexDirection: "column" }}>
                                                    <TouchableOpacity
                                                        onPress={() => toggleShowMore(year, 'state_mandatory')}
                                                        style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#000000" }}>
                                                            {"State Mandatory Course Certificates"}
                                                        </Text>
                                                        <ArrowIcon name={showMore[year]?.state_mandatory ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={25} color={"#000000"} />
                                                    </TouchableOpacity>
                                                    <View style={{ height: 1, width: normalize(295), marginLeft: normalize(10), backgroundColor: "#AAAAAA", justifyContent: "center", alignItems: "center" }} />
                                                </View>}

                                                {showMore[year]?.state_mandatory && stateget[year]?.state_mandatory?.length > 0 && (
                                                    <FlatList
                                                        data={stateget[year]?.state_mandatory || []}
                                                        renderItem={({ item }) => renderCertificateCard(item, 'state_mandatory')}
                                                        keyExtractor={(item) => item.id.toString()}
                                                        ListEmptyComponent={
                                                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                                <ImageBackground source={Imagepath.DottedImg} style={{ height: normalize(65), width: normalize(300), resizeMode: "contain", justifyContent: 'center' }}>
                                                                    <View style={{ alignItems: 'center' }}>
                                                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#AAAAAA" }}>
                                                                            {"You don't have any certificate"}
                                                                        </Text>
                                                                    </View>
                                                                </ImageBackground>
                                                            </View>
                                                        }
                                                    />
                                                )}

                                                {/* Specialty Course Section */}
                                                {stateget[year]?.speciality?.length > 0 && <View style={{ flexDirection: "column" }}>
                                                    <TouchableOpacity
                                                        onPress={() => toggleShowMore(year, 'speciality')}
                                                        style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#000000" }}>
                                                            {"Specialty Course Certificates"}
                                                        </Text>
                                                        <ArrowIcon name={showMore[year]?.speciality ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={25} color={"#000000"} />
                                                    </TouchableOpacity>
                                                    <View style={{ height: 1, width: normalize(295), marginLeft: normalize(10), backgroundColor: "#AAAAAA", justifyContent: "center", alignItems: "center" }} />
                                                </View>}

                                                {showMore[year]?.speciality && stateget[year]?.speciality?.length > 0 && (
                                                    <FlatList
                                                        data={stateget[year]?.speciality || []}
                                                        renderItem={({ item }) => renderCertificateCard(item, 'speciality')}
                                                        keyExtractor={(item) => item.id.toString()}
                                                        ListEmptyComponent={
                                                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                                <ImageBackground source={Imagepath.DottedImg} style={{ height: normalize(65), width: normalize(300), resizeMode: "contain", justifyContent: 'center' }}>
                                                                    <View style={{ alignItems: 'center' }}>
                                                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#AAAAAA" }}>
                                                                            {"You don't have any certificate"}
                                                                        </Text>
                                                                    </View>
                                                                </ImageBackground>
                                                            </View>
                                                        }
                                                    />
                                                )}
                                            </View>
                                        );
                                    })
                            ) : (
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <ImageBackground source={Imagepath.DottedImg} style={{ height: normalize(65), width: normalize(300), resizeMode: "contain", justifyContent: 'center' }}>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#AAAAAA" }}>
                                                {"No data found"}
                                            </Text>
                                        </View>
                                    </ImageBackground>
                                </View>
                            )}
                        </>
                    ) : (
                        <>
                            {Object.keys(boardTake).length > 0 ? (
                                Object.keys(boardTake)
                                    .sort((a, b) => parseInt(b) - parseInt(a))
                                    .map((year, index, array) => {
                                        return (
                                            <View key={year} style={styles.yearContainer}>
                                                <View>
                                                    {index == 0 ? <View style={styles.headerContainer}>
                                                        <CalIcon name="calendar" size={25} color={Colorpath.ButtonColr} />
                                                        <TouchableOpacity>
                                                            <Text style={styles.yearText}>
                                                                {index == 0
                                                                    ? props?.route?.params?.boardCert?.board_data?.expiry_date
                                                                        ? `${moment(props?.route?.params?.boardCert?.board_data?.expiry_date, "YYYY-MM-DD").format("MMM DD")}(${year})`
                                                                        : year
                                                                    : year}

                                                            </Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={downloadTrans} style={styles.button}>
                                                            <DownloadIcn name="download" size={25} color={Colorpath.ButtonColr} />
                                                            <Text style={styles.buttonText}>{"All Transcripts"}</Text>
                                                        </TouchableOpacity>
                                                    </View> : <View style={styles.headerContainer}>
                                                        <CalIcon name="calendar" size={25} color={Colorpath.ButtonColr} />
                                                        <Text style={[styles.yearText, { marginRight: normalize(70) }]}>
                                                            {index == 0
                                                                ? props?.route?.params?.boardCert?.board_data?.expiry_date
                                                                    ? `${moment(props?.route?.params?.boardCert?.board_data?.expiry_date, "YYYY-MM-DD").format("MMM DD")}(${year})`
                                                                    : year
                                                                : year}

                                                        </Text>
                                                        <TouchableOpacity onPress={downloadTrans} style={styles.button}>
                                                            <DownloadIcn name="download" size={25} color={Colorpath.ButtonColr} />
                                                            <Text style={styles.buttonText}>{"All Transcripts"}</Text>
                                                        </TouchableOpacity>
                                                    </View>}
                                                </View>
                                                {boardTake[year].state_mandatory?.length > 0 && <View>
                                                    <View style={{ flexDirection: "column" }}>
                                                        <TouchableOpacity onPress={() => toggleShowMore(year, 'state_mandatory')} style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#000000" }}>
                                                                {"State Mandatory Course Certificates"}
                                                            </Text>
                                                            <ArrowIcon name={showMore[year]?.state_mandatory ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={25} color={"#000000"} />
                                                        </TouchableOpacity>
                                                        <View style={{ height: 1, width: normalize(295), marginLeft: normalize(10), backgroundColor: "#AAAAAA", justifyContent: "center", alignItems: "center" }} />
                                                    </View>
                                                </View>}
                                                <View>
                                                    {showMore[year]?.state_mandatory && boardTake[year].state_mandatory?.length > 0 ? (
                                                        <FlatList
                                                            data={boardTake[year].state_mandatory}
                                                            renderItem={({ item }) => renderCertificateCard(item, 'state_mandatory')}
                                                            keyExtractor={(item) => item.id.toString()}
                                                            ListEmptyComponent={
                                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                                    <ImageBackground source={Imagepath.DottedImg} style={{ height: normalize(65), width: normalize(300), resizeMode: "contain", justifyContent: 'center' }}>
                                                                        <View style={{ alignItems: 'center' }}>
                                                                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#AAAAAA" }}>
                                                                                {"You don't have any certificate"}
                                                                            </Text>
                                                                        </View>
                                                                    </ImageBackground>
                                                                </View>
                                                            }
                                                        />
                                                    ) : null}
                                                </View>
                                                {boardTake[year].speciality?.length > 0 && <View>
                                                    <View style={{ flexDirection: "column" }}>
                                                        <TouchableOpacity onPress={() => toggleShowMore(year, 'speciality')} style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#000000" }}>
                                                                {"Specialty Course Certificates"}
                                                            </Text>
                                                            <ArrowIcon name={showMore[year]?.speciality ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={25} color={"#000000"} />
                                                        </TouchableOpacity>
                                                        <View style={{ height: 1, width: normalize(295), marginLeft: normalize(10), backgroundColor: "#AAAAAA", justifyContent: "center", alignItems: "center" }} />
                                                    </View>
                                                </View>}
                                                <View>
                                                    {showMore[year]?.speciality && boardTake[year].speciality?.length > 0 ? (
                                                        <FlatList
                                                            data={boardTake[year].speciality}
                                                            renderItem={({ item }) => renderCertificateCard(item, 'speciality')}
                                                            keyExtractor={(item) => item.id.toString()}
                                                            ListEmptyComponent={
                                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                                    <ImageBackground source={Imagepath.DottedImg} style={{ height: normalize(65), width: normalize(300), resizeMode: "contain", justifyContent: 'center' }}>
                                                                        <View style={{ alignItems: 'center' }}>
                                                                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#AAAAAA" }}>
                                                                                {"You don't have any certificate"}
                                                                            </Text>
                                                                        </View>
                                                                    </ImageBackground>
                                                                </View>
                                                            }
                                                        />
                                                    ) : null}
                                                </View>
                                            </View>
                                        );
                                    })
                            ) : (
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <ImageBackground source={Imagepath.DottedImg} style={{ height: normalize(65), width: normalize(300), resizeMode: "contain", justifyContent: 'center' }}>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#AAAAAA" }}>
                                                {"No data found"}
                                            </Text>
                                        </View>
                                    </ImageBackground>
                                </View>
                            )}
                        </>
                    )}
                    <CertificatModal setStateget={setStateget} stateget={stateget} statename={props?.route?.params?.boardID} takeboard={props?.route?.params?.boardCert} fakedata={fakedata} setDataFull={setDataFull} dataFull={dataFull} CreditVaultReducer={CreditVaultReducer} setDeleteIndex={setDeleteIndex} deleteIndex={deleteIndex} dispatch={dispatch} certificatefecthed={certificatefecthed} setCertificatefecthed={setCertificatefecthed} navigation={props.navigation} setParticular={setParticular} particular={particular} styles={styles} creditModal={creditModal} setCreditModal={setCreditModal} dommyData={dommyData} />
                </ScrollView>
                <View style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 0,
                    paddingHorizontal: normalize(20),
                    zIndex: 999
                }}>
                    <TouchableOpacity onPress={() => {
                        if (props?.route?.params?.boardID) {
                            props.navigation.navigate("AddCredits", { creditvalutstate: props?.route?.params?.boardID });
                        } else if (props?.route?.params?.boardCert) {
                            props.navigation.navigate("AddCredits", { creditvalutboard: props?.route?.params?.boardCert });
                        }
                    }} style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        height: normalize(50),
                        width: normalize(50),
                        backgroundColor: Colorpath.ButtonColr,
                        borderWidth: 0.5,
                        borderColor: "#AAAAAA",
                        borderRadius: normalize(50),
                        paddingHorizontal: normalize(15)
                    }}>
                        <Search name="plus" style={{ alignSelf: "center", marginLeft: normalize(1) }} color={Colorpath.white} size={25} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>}
            {/* <CMEChecklistModal onCMEClose={oncmeModalclose} onSaved={onhandle} isVisibelCME={cmemodal} /> */}
        </SafeAreaView>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colorpath.Pagebg,
    },
    scrollContent: {
        paddingBottom: normalize(140),
    },
    yearContainer: {
        marginBottom: normalize(10),
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(8),
        justifyContent: "space-between"
    },
    yearButton: {
        marginLeft: normalize(5),
        marginTop: normalize(3)
    },
    yearText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: Colorpath.ButtonColr,
        fontWeight: "600"
    },
    sectionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(8),
    },
    sectionTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 16,
        color: '#000',
    },
    emptyText: {
        textAlign: 'center',
        paddingVertical: normalize(10),
        color: '#999',
    },
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
    },
    button: {
        width: normalize(140),
        height: normalize(40),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row"
    },
    buttonText: {
        color: '#2C4DB9',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 5
    },
});



export default CertficateHandle;
