/**
 * File check screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, dommyData, fakedata, CertficateHandle, wrapDataInDoubleArray, checkPrimeSkipped, certificatpress, onhandle, oncmeModalclose, toggleShowMore, downloadZipFile, openZipFile, downloadTrans, stateTranscript, categorizeDataDynamically, categorizeData, mergeData, AnothcategorizeData, searchCredit, searchBoard, renderCertificateCard, styles.
 */

import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image, Platform, ImageBackground, Animated, Alert, Linking, KeyboardAvoidingView, StatusBar } from 'react-native';
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
import { boardvaultRequest, creditvaultRequest, downloadTranscriptRequest, downloadTranscriptNonUsaRequest } from '../../Redux/Reducers/CreditVaultReducer';
import { stateMandatoryRequest } from '../../Redux/Reducers/DashboardReducer';
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
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { isNonUsaAccount, readNonUsaFlowState } from '../../Utils/Helpers/nonUsaFlow';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Reusable CertficateHandle component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
let status = "";
/**
 * Dommy data array.
 * @returns {Array}
 */
const dommyData = [{ id: 0, name: "Edit", Icon: "edit" }, { id: 2, name: "Delete", Icon: "delete" }, { id: 1, name: "View & Download", Icon: "eye" }]
/**
 * Fakedata array.
 * @returns {Array}
 */
const fakedata = [{ id: 1, name: "View & Download", Icon: "eye" }]
/**
 * Certficate handle component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
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
    const pendingTranscript = useRef(null);
    const isFocused = useIsFocused();
    const hasLoadedCredits = useRef(false);
    const creditsRefreshInFlight = useRef(false);
    const nonUsaUserRef = useRef(false);
    const pendingCreditsRequest = useRef(null);
    const pendingCreditsBaseline = useRef(null);
    const latestCreditsResponses = useRef({});
    const [isCreditsLoading, setIsCreditsLoading] = useState(true);
    const [isBoardCreditsLoading, setIsBoardCreditsLoading] = useState(false);
    const pendingBoardResponse = useRef(null);
    const latestBoardResponse = useRef(null);
    const isNavigatingRef = useRef(false);
    const dispatch = useDispatch();
    const CreditVaultReducer = useSelector(state => state.CreditVaultReducer);
    latestBoardResponse.current = CreditVaultReducer?.boardvaultResponse;
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    latestCreditsResponses.current = {
        usa: CreditVaultReducer?.creditVaultResponse,
        nonUsa: DashboardReducer?.stateMandatoryResponse,
    };
    const AuthReducer = useSelector(state => state.AuthReducer);
    console.log(props?.route?.params?.boardID, props?.route?.params?.boardCert, "route=========");
    // console.log(props?.route?.params?.boardID?.certificates,"array of data " ,typeof props?.route?.params?.boardID?.certificates);
    /**
* Wrap data in double array utility.
* @returns {Array}
*/
    const wrapDataInDoubleArray = () => {
        const board = props?.route?.params?.boardCert;
        const boardId = board?.board_id || board?.board_data?.board_id;
        const currentBoard = CreditVaultReducer?.boardvaultResponse?.board_data?.[boardId] ||
            CreditVaultReducer?.boardvaultResponse?.board_data?.[String(boardId)] ||
            board;
        const certificates = currentBoard?.certificates ?? currentBoard?.certificate ?? CreditVaultReducer?.creditVaultResponse?.certificates;
        if (certificates) {
            return [[certificates]];
        }
        return [[]];
    };
    const [nonUsaFlowState, setNonUsaFlowState] = useState(null);
    const [isNonUsaLoading, setIsNonUsaLoading] = useState(true);
    const [primeSkipped, setPrimeSkipped] = useState(false);
    useEffect(() => {
        /**
* Check prime skipped utility.
*
* @async
* @returns {Promise<*>}
*/
        const checkPrimeSkipped = async () => {
            try {
                const skipped = await AsyncStorage.getItem("PrimeMembershipSkipped");
                setPrimeSkipped(skipped === 'true');
            } catch (e) {
                console.log(e);
            }
        };
        checkPrimeSkipped();
    }, [props?.route?.params]);
    const userObj = DashboardReducer?.mainprofileResponse || AuthReducer?.signupResponse?.user || AuthReducer?.loginResponse?.user || AuthReducer?.againloginsiginResponse?.user || AuthReducer?.verifymobileResponse?.user;
    const stateData = DashboardReducer?.stateMandatoryResponse?.state_data;
    const hasUsaData = stateData && Object.keys(stateData).some(key => key !== '-1');
    const hasNonUsaParam = props?.route?.params?.isNonUsaUser === true || props?.route?.params?.boardID?.state_id === '-1' || Boolean(DashboardReducer?.stateMandatoryResponse?.state_data?.['-1']);
    const hasBoardOrState = Boolean((props?.route?.params?.boardID && props?.route?.params?.boardID?.state_id !== '-1') || props?.route?.params?.boardCert);
    const isNonUsaUser = hasNonUsaParam || (!hasBoardOrState && ((nonUsaFlowState?.isNonUsa === true || isNonUsaAccount(userObj || {}, nonUsaFlowState)) && !hasUsaData));
    nonUsaUserRef.current = isNonUsaUser;
    const fetchCreditVaultData = useCallback((resolvedIsNonUsaUser = nonUsaUserRef.current) => {
        if (creditsRefreshInFlight.current) return;
        creditsRefreshInFlight.current = true;
        setIsCreditsLoading(true);
        if (resolvedIsNonUsaUser) {
            connectionrequest()
                .then(() => {
                    setIsNonUsaLoading(true);
                    pendingCreditsRequest.current = 'nonUsa';
                    pendingCreditsBaseline.current = latestCreditsResponses.current.nonUsa;
                    dispatch(stateMandatoryRequest({}));
                })
                .catch((err) => {
                    setIsNonUsaLoading(false);
                    setIsCreditsLoading(false);
                    showErrorAlert("Please connect to ineternet", err)
                });
            return;
        }
        let obj = {
            "board_id": props?.route?.params?.boardCert ? props?.route?.params?.boardCert?.board_id : props?.route?.params?.boardCert?.board_id,
            "type": "certificate"
        };
        let objState = {
            "state_id": props?.route?.params?.boardID?.state_id
        };
        if (!props?.route?.params?.boardID && !props?.route?.params?.boardCert) {
            setIsCreditsLoading(false);
            return;
        }
        connectionrequest()
            .then(() => {
                pendingCreditsRequest.current = 'usa';
                pendingCreditsBaseline.current = latestCreditsResponses.current.usa;
                if (props?.route?.params?.boardCert) {
                    pendingBoardResponse.current = latestBoardResponse.current;
                    setIsBoardCreditsLoading(true);
                    dispatch(boardvaultRequest({}));
                }
                dispatch(creditvaultRequest(props?.route?.params?.boardID ? objState : obj));
            })
            .catch((err) => {
                setIsCreditsLoading(false);
                showErrorAlert("Please connect to ineternet", err)
            });
    }, [dispatch, props?.route?.params?.boardID, props?.route?.params?.boardCert]);

    useFocusEffect(
        useCallback(() => {
            let mounted = true;
            isNavigatingRef.current = false;
            if (!hasLoadedCredits.current) setIsCreditsLoading(true);
            readNonUsaFlowState().then(async state => {
                if (mounted) {
                    setNonUsaFlowState(state);
                    status = "";
                    const resolvedUserObj = DashboardReducer?.mainprofileResponse || AuthReducer?.loginResponse?.user || AuthReducer?.againloginsiginResponse?.user || AuthReducer?.verifymobileResponse?.user;
                    const stateDataTemp = DashboardReducer?.stateMandatoryResponse?.state_data;
                    const hasUsaDataTemp = stateDataTemp && Object.keys(stateDataTemp).some(key => key !== '-1');
                    const skipped = await AsyncStorage.getItem("PrimeMembershipSkipped");
                    if (!mounted) return;
                    const resolvedIsNonUsaUser = !hasBoardOrState && ((props?.route?.params?.isNonUsaUser === true) || ((state?.isNonUsa === true || isNonUsaAccount(resolvedUserObj || {}, state)) && !hasUsaDataTemp));
                    fetchCreditVaultData(resolvedIsNonUsaUser);
                }
            }).catch(err => {
                if (!mounted) return;
                setIsCreditsLoading(false);
                showErrorAlert("Unable to load earned credits. Please try again.", err);
            });
            return () => {
                mounted = false;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [fetchCreditVaultData, props?.route?.params?.isNonUsaUser, hasBoardOrState])
    );
    /**
* Certificatpress utility.
* @returns {void}
*/
    const certificatpress = () => {
        props.navigation.goBack();
    }
    const [showMore, setShowMore] = useState({});
    const [searchText, setSearchText] = useState("");
    const [creditModal, setCreditModal] = useState(false);
    const [certificatefecthed, setCertificatefecthed] = useState(CreditVaultReducer?.creditVaultResponse || null);
    useEffect(() => {
        setCertificatefecthed(CreditVaultReducer?.creditVaultResponse);
    }, [CreditVaultReducer?.creditVaultResponse]);
    const lastSavedCreditsResponse = useRef(DashboardReducer?.addCreditVaultResponse);
    useEffect(() => {
        const response = DashboardReducer?.addCreditVaultResponse;
        if (response === lastSavedCreditsResponse.current) return;
        lastSavedCreditsResponse.current = response;
        if (response?.success === true && isFocused) fetchCreditVaultData();
    }, [DashboardReducer?.addCreditVaultResponse, fetchCreditVaultData, isFocused]);
    useEffect(() => {
        const emitter = require('react-native').DeviceEventEmitter;
        const sub = emitter.addListener('CREDIT_VAULT_UPDATED', () => {
            if (isFocused) fetchCreditVaultData();
        });
        return () => sub.remove();
    }, [fetchCreditVaultData, isFocused]);
    const [particular, setParticular] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(-1);
    const [dataFull, setDataFull] = useState([]);
    const [cmemodal, setCmemodal] = useState(false);
    /**
* Onhandle utility.
* @returns {void}
*/
    const onhandle = () => {
        setCmemodal(false);
    }
    /**
* Oncme modalclose utility.
* @returns {void}
*/
    const oncmeModalclose = () => {
        setCmemodal(!cmemodal)
    }

    /**
* Toggle show more utility.
* @param {*} year - Input value.
* @param {*} category - Input value.
* @returns {void}
*/
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

                console.log(certificatefecthed, "certddificatefecthed?.stddate_data[1]?.renewal_date")
                break;
            case 'CreditVault/creditvaultFailure':
                status = CreditVaultReducer.status;
                break;
            case 'CreditVault/downloadTranscriptRequest':
            case 'CreditVault/downloadTranscriptNonUsaRequest':
                status = CreditVaultReducer.status;
                break;
            case 'CreditVault/downloadTranscriptSuccess':
                status = CreditVaultReducer.status;
                setZippath(CreditVaultReducer?.downloadTranscriptResponse);
                console.log(CreditVaultReducer?.downloadTranscriptResponse, "CreditVaultReducer?.downloadTranscriptResponse")
                if (pendingTranscript.current === "usa" && CreditVaultReducer?.downloadTranscriptResponse?.msg == "There are no certificates.") {
                    showErrorAlert(CreditVaultReducer?.downloadTranscriptResponse?.msg)
                }
                break;
            case 'CreditVault/downloadTranscriptNonUsaSuccess':
                status = CreditVaultReducer.status;
                setZippath(CreditVaultReducer?.downloadTranscriptNonUsaResponse);
                console.log(CreditVaultReducer?.downloadTranscriptNonUsaResponse, "CreditVaultReducer?.downloadTranscriptNonUsaResponse")
                if (pendingTranscript.current === "nonUsa" && CreditVaultReducer?.downloadTranscriptNonUsaResponse?.msg == "There are no certificates.") {
                    showErrorAlert(CreditVaultReducer?.downloadTranscriptNonUsaResponse?.msg)
                }
                break;
            case 'CreditVault/downloadTranscriptFailure':
            case 'CreditVault/downloadTranscriptNonUsaFailure':
                pendingTranscript.current = null;
                status = CreditVaultReducer.status;
                break;
        }
    }

    useEffect(() => {
        if (pendingTranscript.current !== "usa") return;
        pendingTranscript.current = null;
        if (CreditVaultReducer?.downloadTranscriptResponse?.archive_file) {
            downloadZipFile(CreditVaultReducer?.downloadTranscriptResponse);
        }
    }, [CreditVaultReducer?.downloadTranscriptResponse])

    useEffect(() => {
        if (pendingTranscript.current !== "nonUsa") return;
        pendingTranscript.current = null;
        if (CreditVaultReducer?.downloadTranscriptNonUsaResponse?.archive_file) {
            downloadZipFile(CreditVaultReducer?.downloadTranscriptNonUsaResponse);
        }
    }, [CreditVaultReducer?.downloadTranscriptNonUsaResponse])
    /**
* Download zip file utility.
*
* @async
* @param {*} data - Input value.
* @returns {Promise<*>}
*/
    const downloadZipFile = async (data = zippath) => {
        const fileUrl = `${data?.archive_file_path}${data?.archive_file}`
        const filePath = `${RNFS.DocumentDirectoryPath}/${data?.archive_file}`;
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
            Alert.alert(
                'Download successful',
                `Your file name: ${data?.archive_file}\nPlease check your device.`
            );
            await openZipFile(filePath);
        } catch (error) {
            console.error('Download error:', error);
            // Alert.alert('Download failed', error.message);
        }
    };
    /**
* Open zip file utility.
*
* @async
* @param {*} filePath - Input value.
* @returns {Promise<*>}
*/
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
                            {
                                text: 'Go to Play Store',                             /**
 * On press utility.
 * @returns {*}
 */
                                onPress: () => Linking.openURL('market://details?id=com.winzip.android')
                            }
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
                            {
                                text: 'Go to App Store',                             /**
 * On press utility.
 * @returns {*}
 */
                                onPress: () => Linking.openURL('itms-apps://apps.apple.com/us/app/winzip/id500637987')
                            }
                        ]
                    );
                }
            }
        } catch (error) {
            console.error('Error opening file:', error);
            Alert.alert('Error', 'Unable to open the file. Please check if a ZIP file viewer app is installed.');
        }
    };
    /**
* Download trans utility.
* @returns {void}
*/
    const downloadTrans = () => {
        if (isNonUsaUser) {
            const statedown = {
                "board_id": 0,
                "type": "licensure"
            }
            connectionrequest()
                .then(() => {
                    pendingTranscript.current = "nonUsa";
                    dispatch(downloadTranscriptNonUsaRequest(statedown))
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
            return;
        }
        let obj = {
            "board_id": props?.route?.params?.boardID?.board_data?.board_id || props?.route?.params?.boardCert?.board_data?.board_id,
            "type": props?.route?.params?.boardCert?.board_data?.board_id ? "certificate" : "licensure"
        }
        connectionrequest()
            .then(() => {
                pendingTranscript.current = "usa";
                dispatch(downloadTranscriptRequest(obj))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    /**
* State transcript utility.
* @param {*} data - Input value.
* @param {*} range - Input value.
* @returns {void}
*/
    const stateTranscript = (data, range) => {
        console.log(data, range, "transcript-------");
        const boardId = props?.route?.params?.boardID?.board_data?.board_id ||
            props?.route?.params?.boardID?.board_id;
        const statedown = {
            "board_id": isNonUsaUser ? 0 : boardId,
            "type": "licensure",
            ...(!isNonUsaUser && range ? { "range": range } : {})
        };

        if (!isNonUsaUser && !boardId) {
            showErrorAlert("Unable to download transcript because the licensing board is unavailable.");
            return;
        }

        connectionrequest()
            .then(() => {
                pendingTranscript.current = isNonUsaUser ? "nonUsa" : "usa";
                dispatch(isNonUsaUser
                    ? downloadTranscriptNonUsaRequest(statedown)
                    : downloadTranscriptRequest(statedown));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    const nonUsaCertificateRows = useMemo(() => {
        const routeCertificates =
            props?.route?.params?.boardID?.certificates ||
            props?.route?.params?.boardCert?.certificates ||
            props?.route?.params?.boardCert?.certificate;

        const allCertificates = [];

        if (Array.isArray(routeCertificates) && routeCertificates.length > 0) {
            allCertificates.push(...routeCertificates);
        } else if (routeCertificates && typeof routeCertificates === 'object') {
            allCertificates.push(...Object.values(routeCertificates).flatMap((val) => (Array.isArray(val) ? val : [val])).filter(Boolean));
        }

        const stateData = DashboardReducer?.stateMandatoryResponse?.state_data || DashboardReducer?.stateMandatorySuccess?.state_data;
        if (stateData && typeof stateData === 'object') {
            Object.keys(stateData).forEach((key) => {
                const certs = stateData[key]?.certificates;
                if (certs) {
                    if (Array.isArray(certs)) {
                        allCertificates.push(...certs);
                    } else if (typeof certs === 'object') {
                        allCertificates.push(...Object.values(certs).flatMap((val) => (Array.isArray(val) ? val : [val])).filter(Boolean));
                    }
                }
            });
        }

        const uniqueCerts = allCertificates.filter((item, index, self) =>
            index === self.findIndex((c) => (
                (c?.id && item?.id && c?.id === item?.id) ||
                (c?._id && item?._id && c?._id === item?._id) ||
                (c?.certificate && item?.certificate && c?.certificate === item?.certificate) ||
                (c?.activity_name && item?.activity_name && c?.activity_name === item?.activity_name)
            ))
        );

        return uniqueCerts;
    }, [
        DashboardReducer?.stateMandatoryResponse?.state_data,
        DashboardReducer?.stateMandatorySuccess?.state_data,
        props?.route?.params?.boardID,
        props?.route?.params?.boardCert,
        primeSkipped
    ]);
    const hasNonUsaCertificateRows = nonUsaCertificateRows.length > 0;
    useEffect(() => {
        if (!isNonUsaUser) {
            setIsNonUsaLoading(false);
            return;
        }
        if (DashboardReducer?.status === 'Dashboard/stateMandatoryRequest') {
            setIsNonUsaLoading(true);
        } else {
            setIsNonUsaLoading(false);
        }
    }, [DashboardReducer?.status, DashboardReducer?.stateMandatoryResponse, DashboardReducer?.stateMandatorySuccess, isNonUsaUser]);
    useEffect(() => {
        const doubleArrayCertificates = wrapDataInDoubleArray();
        const fulFinal = doubleArrayCertificates[0];
        setDataFull(fulFinal);
    }, [
        props?.route?.params?.boardCert,
        CreditVaultReducer?.boardvaultResponse,
        CreditVaultReducer?.creditVaultResponse,
        certificatefecthed,
        nonUsaCertificateRows,
        DashboardReducer?.stateMandatoryResponse,
        DashboardReducer?.stateMandatorySuccess,
        props?.route?.params?.isNonUsaUser
    ]);
    /**
* Categorize data dynamically utility.
* @param {*} data - Input value.
* @returns {*}
*/
    const categorizeDataDynamically = (data) => {
        const result = {};
        if (!data) return result;

        const processItem = (item) => {
            if (!item || typeof item !== 'object') return;
            const dateStr = item?.program_date || item?.created_date || item?.expiry_date || '';
            const itemYear = dateStr ? new Date(String(dateStr).replace(' ', 'T')).getFullYear() : new Date().getFullYear();
            const yearVal = isNaN(itemYear) ? new Date().getFullYear() : itemYear;
            const yearRangeKey = `${yearVal}-${yearVal + 1}`;

            if (!result[yearRangeKey]) {
                result[yearRangeKey] = {
                    state_mandatory: [],
                    speciality: [],
                    date_range: `${yearVal}-${yearVal + 1}`
                };
            }

            if (String(item.mandated_course) === "1") {
                result[yearRangeKey].state_mandatory.push(item);
            } else {
                result[yearRangeKey].speciality.push(item);
            }
        };

        if (Array.isArray(data)) {
            data.forEach(processItem);
            return result;
        }

        Object.keys(data).forEach((key) => {
            const yearData = data[key];
            if (yearData && (Array.isArray(yearData.state_mandatory) || Array.isArray(yearData.speciality))) {
                if (!result[key]) {
                    result[key] = {
                        state_mandatory: [],
                        speciality: [],
                        date_range: yearData.date_range || key
                    };
                }
                if (yearData.state_mandatory) {
                    result[key].state_mandatory.push(...yearData.state_mandatory);
                }
                if (yearData.speciality) {
                    result[key].speciality.push(...yearData.speciality);
                }
            } else if (yearData && typeof yearData === 'object') {
                processItem(yearData);
            }
        });

        return result;
    };

    useEffect(() => {
        const stateId = props?.route?.params?.boardID?.state_id || props?.route?.params?.boardID?.id;
        const vaultResp = CreditVaultReducer?.creditVaultResponse || certificatefecthed;
        const vaultStateData = vaultResp?.state_data || vaultResp?.data?.state_data;
        const dashStateData = DashboardReducer?.stateMandatoryResponse?.state_data ||
            DashboardReducer?.stateMandatorySuccess?.state_data;
        const sourceData = vaultStateData || dashStateData;

        let stateData = null;

        if (sourceData && typeof sourceData === 'object') {
            const targetStateId = (stateId && sourceData[stateId])
                ? stateId
                : (stateId && sourceData[String(stateId)])
                ? String(stateId)
                : (stateId && sourceData[Number(stateId)])
                ? Number(stateId)
                : (sourceData['-1'] ? '-1' : Object.keys(sourceData).find(key => key !== '-1') || Object.keys(sourceData)[0]);

            const vaultCerts = vaultStateData?.[targetStateId]?.certificates ||
                vaultStateData?.[String(targetStateId)]?.certificates ||
                vaultStateData?.[Number(targetStateId)]?.certificates ||
                vaultResp?.certificates ||
                vaultResp?.data?.certificates ||
                vaultResp?.certificate;

            const dashCerts = dashStateData?.[targetStateId]?.certificates ||
                dashStateData?.[String(targetStateId)]?.certificates ||
                dashStateData?.[Number(targetStateId)]?.certificates ||
                dashStateData?.['-1']?.certificates;

            if (vaultCerts && Array.isArray(vaultCerts) && dashCerts && Array.isArray(dashCerts)) {
                stateData = vaultCerts.length >= dashCerts.length ? vaultCerts : dashCerts;
            } else {
                stateData = vaultCerts || dashCerts || sourceData[targetStateId]?.certificates || sourceData['-1']?.certificates;
            }
        } else if (vaultResp?.certificates || vaultResp?.data?.certificates || certificatefecthed?.certificates) {
            stateData = vaultResp?.certificates || vaultResp?.data?.certificates || certificatefecthed?.certificates;
        }

        if (!stateData && props?.route?.params?.boardID?.certificates) {
            stateData = props?.route?.params?.boardID?.certificates;
        }

        if (stateData) {
            const dynamicYearData = categorizeDataDynamically(stateData);
            if (JSON.stringify(dynamicYearData) !== JSON.stringify(stateget)) {
                setStategetdt(dynamicYearData);
                setStateget(dynamicYearData);
            }
        }
    }, [
        props?.route?.params?.boardID?.state_id,
        props?.route?.params?.boardID?.id,
        props?.route?.params?.boardID?.certificates,
        certificatefecthed,
        CreditVaultReducer?.creditVaultResponse,
        DashboardReducer?.stateMandatoryResponse?.state_data,
        DashboardReducer?.stateMandatorySuccess?.state_data
    ]);


    const [stateget, setStateget] = useState("");
    const [stategetdt, setStategetdt] = useState("");
    /**
* Categorize data utility.
* @param {*} data - Input value.
* @returns {*}
*/
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
    /**
* Merge data helper.
* @param {*} existingData - Input value.
* @param {*} newTransformedData - Input value.
* @returns {*}
*/
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
        const boardId = props?.route?.params?.boardCert?.board_id || props?.route?.params?.boardCert?.board_data?.board_id;
        const boardCerts = CreditVaultReducer?.boardvaultResponse?.board_data?.[boardId]?.certificates ||
            CreditVaultReducer?.boardvaultResponse?.board_data?.[String(boardId)]?.certificates ||
            CreditVaultReducer?.boardvaultResponse?.board_data?.[boardId]?.certificate ||
            CreditVaultReducer?.boardvaultResponse?.board_data?.[String(boardId)]?.certificate;
        const data = CreditVaultReducer?.creditVaultResponse?.certificates || certificatefecthed?.certificates || boardCerts;
        const newData = dataFull?.length > 0 ? dataFull : (boardCerts || []);
        if (newData || data) {
            const transformedData = categorizeData(newData);
            const fullTrans = AnothcategorizeData(data);
            const finalData = mergeData(fullTrans, transformedData);
            setboardTakedt(finalData);
            setboardTake(finalData);
        }
    }, [props?.route?.params?.boardCert, certificatefecthed, dataFull, CreditVaultReducer?.boardvaultResponse, CreditVaultReducer?.creditVaultResponse]);
    useEffect(() => {
        if (stateget) {
            const stateFull = stateget;
            console.log(stateFull, "sattef----------")
        }
    }, [stateget])
    /**
* Anothcategorize data component.
* @param {*} data - Input value.
* @returns {JSX.Element}
*/
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
    /**
* Search credit utility.
* @param {*} searchTerm - Input value.
* @returns {*}
*/
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
    /**
* Search board utility.
* @param {*} searchTerm - Input value.
* @returns {*}
*/
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
    /**
* Render certificate card utility.
* @param {*} item - Input value.
* @param {*} category - Input value.
* @returns {JSX.Element}
*/
    const renderCertificateCard = (item, category) => {
        return (
            <View style={styles.cardWrapper}>
                <View style={styles.certificateCard}>
                    <View style={styles.cardHeaderRow}>
                        <Image source={Imagepath.VaultCer} style={styles.certIcon} />
                        <Text
                            numberOfLines={2}
                            style={styles.certificateTitle}
                        >
                            {item?.program_title}
                        </Text>
                        <TouchableOpacity
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            onPress={() => {
                                setCreditModal(true);
                                setParticular(item);
                            }}
                            style={styles.moreButton}
                        >
                            <IconDot name="dots-three-vertical" size={20} color={"#848484"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

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
    // Clear each loader only after its fresh data has reached the grouping effects.
    useEffect(() => {
        const boardId = props?.route?.params?.boardCert?.board_id || props?.route?.params?.boardCert?.board_data?.board_id;
        const board = CreditVaultReducer?.boardvaultResponse?.board_data?.[boardId] ||
            CreditVaultReducer?.boardvaultResponse?.board_data?.[String(boardId)];
        const certificates = board?.certificates ?? board?.certificate;
        const failed = CreditVaultReducer?.status === 'CreditVault/boardvaultFailure';
        const boardReady = failed || (CreditVaultReducer?.boardvaultResponse !== pendingBoardResponse.current &&
            (!certificates || dataFull?.[0] === certificates));
        if (isBoardCreditsLoading && boardReady) {
            setIsBoardCreditsLoading(false);
        }
    }, [CreditVaultReducer?.boardvaultResponse, CreditVaultReducer?.status, isBoardCreditsLoading, dataFull, props?.route?.params?.boardCert]);
    useEffect(() => {
        const kind = pendingCreditsRequest.current;
        if (!kind) return;
        const requestStatus = kind === 'nonUsa' ? DashboardReducer?.status : CreditVaultReducer?.status;
        const failed = requestStatus === 'CreditVault/creditvaultFailure' || requestStatus === 'Dashboard/stateMandatoryFailure';
        const response = kind ? latestCreditsResponses.current[kind] : null;
        const ready = failed || (response && response !== pendingCreditsBaseline.current &&
            (kind === 'nonUsa' || certificatefecthed === response));
        if (ready) {
            pendingCreditsRequest.current = null;
            setIsCreditsLoading(false);
        }
    }, [CreditVaultReducer?.status, CreditVaultReducer?.creditVaultResponse, DashboardReducer?.status, DashboardReducer?.stateMandatoryResponse, certificatefecthed]);
    useEffect(() => {
        if (!isCreditsLoading && !isBoardCreditsLoading) {
            creditsRefreshInFlight.current = false;
            hasLoadedCredits.current = true;
        }
    }, [isCreditsLoading, isBoardCreditsLoading]);
    const showInitialCreditsLoader = !hasLoadedCredits.current && (isCreditsLoading || isBoardCreditsLoading);
    const isInitialNonUsaLoading = showInitialCreditsLoader;

    if (isNonUsaUser) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                {Platform.OS === 'ios' ? (
                    <PageHeader nol="yes" title={props?.route?.params?.boardCert ? props?.route?.params?.boardCert?.board_data?.board_name : props?.route?.params?.boardID?.board_data?.board_name || "Credit Vault"} onBackPress={certificatpress} />
                ) : (
                    <View>
                        <PageHeader nol="yes" title={props?.route?.params?.boardCert ? props?.route?.params?.boardCert?.board_data?.board_name : props?.route?.params?.boardID?.board_data?.board_name || "Credit Vault"} onBackPress={certificatpress} />
                    </View>
                )}
                {conn === false ? <IntOff /> : <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {(isInitialNonUsaLoading || CreditVaultReducer?.status == 'CreditVault/downloadTranscriptNonUsaRequest') && (
                        <View style={styles.nonUsaLoader}>
                            <Image
                                source={require('../../Assets/Images/gifemed.gif')}
                                style={styles.nonUsaLoaderImage}
                            />
                        </View>
                    )}
                    <ScrollView contentContainerStyle={[
                        styles.scrollContent,
                        (!stateget || Object.keys(stateget).length === 0) && styles.nonUsaEmptyScrollContent,
                    ]}>
                        <View style={{ flex: 1 }}>
                            {!isInitialNonUsaLoading && (
                                <View style={{ marginTop: normalize(10), flex: 1 }}>
                                    {stateget && Object.keys(stateget).length > 0 ? (
                                        Object.keys(stateget)
                                            .sort((a, b) => parseInt(b) - parseInt(a))
                                            .map((year, index) => {
                                                const dateRange = stateget[year]?.date_range;
                                                return (
                                                    <View key={year} style={styles.yearContainer}>
                                                        <View style={styles.headerContainer}>
                                                            <View style={{ flexDirection: "row" }}>
                                                                <CalIcon name="calendar" size={20} color={Colorpath.ButtonColr} />
                                                                <TouchableOpacity style={styles.yearButton}>
                                                                    <Text style={styles.yearText}>
                                                                        {index == 0
                                                                            ? (() => {
                                                                                const renewalVal =
                                                                                    DashboardReducer?.stateMandatoryResponse?.state_data?.['-1']?.renewal_date ||
                                                                                    props?.route?.params?.boardID?.renewal_date ||
                                                                                    '';
                                                                                return renewalVal ? `${renewalVal}(${year})` : year;
                                                                            })()
                                                                            : year}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <TouchableOpacity onPress={() => { stateTranscript(index, dateRange) }} style={styles.button}>
                                                                <DownloadIcn name="download" size={16} color={Colorpath.ButtonColr} />
                                                                <Text style={styles.buttonText}>{"All Transcripts"}</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                        {stateget[year]?.state_mandatory?.length > 0 && (
                                                            <View style={{ flexDirection: "column" }}>
                                                                <TouchableOpacity
                                                                    onPress={() => toggleShowMore(year, 'state_mandatory')}
                                                                    style={{
                                                                        flexDirection: "row",
                                                                        justifyContent: "space-between",
                                                                        alignItems: "center",
                                                                        paddingHorizontal: normalize(12),
                                                                        paddingVertical: normalize(9),
                                                                        backgroundColor: '#142B5B',
                                                                        borderRadius: normalize(8),
                                                                        borderWidth: 1,
                                                                        borderColor: '#243F7A',
                                                                        marginHorizontal: normalize(10),
                                                                        marginTop: normalize(6),
                                                                        marginBottom: normalize(4)
                                                                    }}>
                                                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: normalize(13), color: "#FFD08A" }}>
                                                                        {"State Mandatory Course Certificates"}
                                                                    </Text>
                                                                    <ArrowIcon name={showMore[year]?.state_mandatory ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color={"#FFD08A"} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        )}

                                                        {showMore[year]?.state_mandatory && stateget[year]?.state_mandatory?.length > 0 && (
                                                            <FlatList
                                                                data={stateget[year]?.state_mandatory || []}
                                                                renderItem={({ item }) => renderCertificateCard(item, 'state_mandatory')}
                                                                keyExtractor={(item, idx) => String(item?.id ?? item?._id ?? idx)}
                                                            />
                                                        )}

                                                        {stateget[year]?.speciality?.length > 0 && (
                                                            <View style={{ flexDirection: "column" }}>
                                                                <TouchableOpacity
                                                                    onPress={() => toggleShowMore(year, 'speciality')}
                                                                    style={{
                                                                        flexDirection: "row",
                                                                        justifyContent: "space-between",
                                                                        alignItems: "center",
                                                                        paddingHorizontal: normalize(12),
                                                                        paddingVertical: normalize(9),
                                                                        backgroundColor: '#142B5B',
                                                                        borderRadius: normalize(8),
                                                                        borderWidth: 1,
                                                                        borderColor: '#243F7A',
                                                                        marginHorizontal: normalize(10),
                                                                        marginTop: normalize(6),
                                                                        marginBottom: normalize(4)
                                                                    }}>
                                                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: normalize(13), color: "#FFD08A" }}>
                                                                        {"Specialty Course Certificates"}
                                                                    </Text>
                                                                    <ArrowIcon name={showMore[year]?.speciality ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color={"#FFD08A"} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        )}

                                                        {showMore[year]?.speciality && stateget[year]?.speciality?.length > 0 && (
                                                            <FlatList
                                                                data={stateget[year]?.speciality || []}
                                                                renderItem={({ item }) => renderCertificateCard(item, 'speciality')}
                                                                keyExtractor={(item, idx) => String(item?.id ?? item?._id ?? idx)}
                                                            />
                                                        )}
                                                    </View>
                                                );
                                            })
                                    ) : (
                                        <FlatList
                                            data={nonUsaCertificateRows}
                                            style={{ flex: 1 }}
                                            contentContainerStyle={nonUsaCertificateRows.length === 0 ? styles.nonUsaEmptyListContent : undefined}
                                            renderItem={({ item }) => renderCertificateCard(item, 'certificate')}
                                            keyExtractor={(item, index) => String(item?.id ?? item?._id ?? index)}
                                            ListEmptyComponent={
                                                <View style={styles.nonUsaContainer}>
                                                    <View style={styles.nonUsaCard}>
                                                        <View style={styles.nonUsaBanner}>
                                                            <Text style={styles.nonUsaBannerText}>Credit Vault</Text>
                                                        </View>
                                                        <View style={styles.nonUsaBody}>
                                                            <Text style={styles.nonUsaDescription}>
                                                                You can view credits and certificates of all the activities you fulfilled at eMedEvents.{"\n\n"}
                                                                You can also add credits and certificates of activities you attended elsewhere.
                                                            </Text>
                                                            <TouchableOpacity
                                                                style={styles.nonUsaButton}
                                                                onPress={() => {
                                                                    if (isNavigatingRef.current) return;
                                                                    isNavigatingRef.current = true;
                                                                    setTimeout(() => { isNavigatingRef.current = false; }, 1000);
                                                                    props.navigation.navigate("AddCredits", {
                                                                        isNonUsaUser: true,
                                                                    });
                                                                }}
                                                            >
                                                                <Text style={styles.nonUsaButtonText}>Add Credits</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            }
                                        />
                                    )}
                                </View>
                            )}
                        </View>
                    </ScrollView>
                    {hasNonUsaCertificateRows && (
                        <View style={styles.nonUsaAddButtonContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (isNavigatingRef.current) return;
                                    isNavigatingRef.current = true;
                                    setTimeout(() => { isNavigatingRef.current = false; }, 1000);
                                    props.navigation.navigate("AddCredits", {
                                        isNonUsaUser: true,
                                    });
                                }}
                                style={styles.nonUsaAddButton}
                            >
                                <Search name="plus" color={Colorpath.white} size={25} />
                            </TouchableOpacity>
                        </View>
                    )}
                    <CertificatModal
                        isNonUsaUser={isNonUsaUser}
                        setStateget={setStateget}
                        stateget={stateget}
                        statename={props?.route?.params?.boardID}
                        takeboard={props?.route?.params?.boardCert}
                        fakedata={fakedata}
                        setDataFull={setDataFull}
                        dataFull={dataFull}
                        CreditVaultReducer={CreditVaultReducer}
                        setDeleteIndex={setDeleteIndex}
                        deleteIndex={deleteIndex}
                        dispatch={dispatch}
                        certificatefecthed={isNonUsaUser ? DashboardReducer?.stateMandatoryResponse : certificatefecthed}
                        setCertificatefecthed={setCertificatefecthed}
                        navigation={props.navigation}
                        setParticular={setParticular}
                        particular={particular}
                        styles={styles}
                        creditModal={creditModal}
                        setCreditModal={setCreditModal}
                        dommyData={dommyData}
                    />
                </KeyboardAvoidingView>}
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {Platform.OS === 'ios' ? (
                <PageHeader nol={props?.route?.params?.boardCert ? "yes" : "no"} title={props?.route?.params?.boardCert ? props?.route?.params?.boardCert?.board_data?.board_name : props?.route?.params?.boardID?.board_data?.board_name} onBackPress={certificatpress} />
            ) : (
                <View>
                    <PageHeader nol={props?.route?.params?.boardCert ? "yes" : "no"} title={props?.route?.params?.boardCert ? props?.route?.params?.boardCert?.board_data?.board_name : props?.route?.params?.boardID?.board_data?.board_name} onBackPress={certificatpress} />
                </View>
            )}
            {conn === false ? <IntOff /> : <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Loader visible={showInitialCreditsLoader || CreditVaultReducer?.status == 'CreditVault/downloadTranscriptRequest'} />
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={{ alignItems: 'center' }}>
                        <View
                            style={{
                                borderBottomColor: '#000000',
                                borderBottomWidth: 0.5,
                                marginTop: normalize(5),
                                marginBottom: normalize(5),
                            }}>
                            {props?.route?.params?.boardCert ? <CustomTextField
                                value={searchText}
                                onChangeText={searchBoard}
                                color={"#000000"}
                                height={normalize(35)}
                                width={normalize(300)}
                                alignSelf={'center'}
                                placeholder={'Type a Year or Title to Find Results'}
                                placeholderTextColor="#AAAAAA"
                                fontSize={normalize(12.5)}
                                fontFamily={Fonts.InterRegular}
                                autoCapitalize="none"
                                keyboardType='default'
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
                                alignSelf={'center'}
                                placeholder={'Type a Year or Title to Find Results'}
                                placeholderTextColor="#AAAAAA"
                                fontSize={normalize(12.5)}
                                fontFamily={Fonts.InterRegular}
                                autoCapitalize="none"
                                keyboardType='default'
                                borderColor={"#DDDDDD"}
                                rightIcon={Search}
                                rightIconName={searchText ? "search1" : ""}
                                rightIconSize={22}
                                rightIconColor="#63748b"
                                editable={true}
                            /> : null}
                        </View>
                    </View>

                    {(props?.route?.params?.boardID?.state_id || props?.route?.params?.boardID?.id || props?.route?.params?.boardID) && !props?.route?.params?.boardCert ? (
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
                                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                        <CalIcon name="calendar" size={20} color={Colorpath.ButtonColr} />
                                                        <TouchableOpacity style={styles.yearButton}>
                                                            <Text style={styles.yearText}>
                                                                {index == 0
                                                                    ? (() => {
                                                                        const targetStateId = props?.route?.params?.boardID?.state_id;
                                                                        const renewalVal =
                                                                            (targetStateId && certificatefecthed?.state_data?.[targetStateId]?.renewal_date) ||
                                                                            (targetStateId && DashboardReducer?.stateMandatoryResponse?.state_data?.[targetStateId]?.renewal_date) ||
                                                                            DashboardReducer?.stateMandatoryResponse?.state_data?.['-1']?.renewal_date ||
                                                                            props?.route?.params?.boardID?.renewal_date ||
                                                                            '';
                                                                        return renewalVal ? `${renewalVal}(${year})` : year;
                                                                    })()
                                                                    : year}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <TouchableOpacity onPress={() => { stateTranscript(index, dateRange) }} style={styles.button}>
                                                        <DownloadIcn name="download" size={16} color={Colorpath.ButtonColr} />
                                                        <Text style={styles.buttonText}>{"All Transcripts"}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ flexDirection: "column" }}>
                                                    <TouchableOpacity
                                                        onPress={() => toggleShowMore(year, 'state_mandatory')}
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            paddingHorizontal: normalize(12),
                                                            paddingVertical: normalize(9),
                                                            backgroundColor: '#142B5B',
                                                            borderRadius: normalize(8),
                                                            borderWidth: 1,
                                                            borderColor: '#243F7A',
                                                            marginHorizontal: normalize(10),
                                                            marginTop: normalize(6),
                                                            marginBottom: normalize(4)
                                                        }}>
                                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: normalize(13), color: "#FFD08A" }}>
                                                            {"State Mandatory Course Certificates"}
                                                        </Text>
                                                        <ArrowIcon name={showMore[year]?.state_mandatory ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color={"#FFD08A"} />
                                                    </TouchableOpacity>
                                                </View>

                                                {showMore[year]?.state_mandatory && (
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
                                                <View style={{ flexDirection: "column" }}>
                                                    <TouchableOpacity
                                                        onPress={() => toggleShowMore(year, 'speciality')}
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            paddingHorizontal: normalize(12),
                                                            paddingVertical: normalize(9),
                                                            backgroundColor: '#142B5B',
                                                            borderRadius: normalize(8),
                                                            borderWidth: 1,
                                                            borderColor: '#243F7A',
                                                            marginHorizontal: normalize(10),
                                                            marginTop: normalize(6),
                                                            marginBottom: normalize(4)
                                                        }}>
                                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: normalize(13), color: "#FFD08A" }}>
                                                            {"Specialty Course Certificates"}
                                                        </Text>
                                                        <ArrowIcon name={showMore[year]?.speciality ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color={"#FFD08A"} />
                                                    </TouchableOpacity>
                                                </View>

                                                {showMore[year]?.speciality && (
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
                                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                            <CalIcon name="calendar" size={20} color={Colorpath.ButtonColr} />
                                                            <TouchableOpacity style={styles.yearButton}>
                                                                <Text style={styles.yearText}>
                                                                    {index == 0
                                                                        ? props?.route?.params?.boardCert?.board_data?.expiry_date
                                                                            ? `${moment(props?.route?.params?.boardCert?.board_data?.expiry_date, "YYYY-MM-DD").format("MMM DD")}(${year})`
                                                                            : year
                                                                        : year}

                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <TouchableOpacity onPress={downloadTrans} style={styles.button}>
                                                            <DownloadIcn name="download" size={16} color={Colorpath.ButtonColr} />
                                                            <Text style={styles.buttonText}>{"All Transcripts"}</Text>
                                                        </TouchableOpacity>
                                                    </View> : <View style={styles.headerContainer}>
                                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                            <CalIcon name="calendar" size={20} color={Colorpath.ButtonColr} />
                                                            <Text style={[styles.yearText, { marginRight: normalize(70) }]}>
                                                                {index == 0
                                                                    ? props?.route?.params?.boardCert?.board_data?.expiry_date
                                                                        ? `${moment(props?.route?.params?.boardCert?.board_data?.expiry_date, "YYYY-MM-DD").format("MMM DD")}(${year})`
                                                                        : year
                                                                    : year}

                                                            </Text>
                                                        </View>
                                                        <TouchableOpacity onPress={downloadTrans} style={styles.button}>
                                                            <DownloadIcn name="download" size={16} color={Colorpath.ButtonColr} />
                                                            <Text style={styles.buttonText}>{"All Transcripts"}</Text>
                                                        </TouchableOpacity>
                                                    </View>}
                                                </View>
                                                <View>
                                                    <View style={{ flexDirection: "column" }}>
                                                        <TouchableOpacity
                                                            onPress={() => toggleShowMore(year, 'state_mandatory')}
                                                            style={{
                                                                flexDirection: "row",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                paddingHorizontal: normalize(12),
                                                                paddingVertical: normalize(9),
                                                                backgroundColor: '#142B5B',
                                                                borderRadius: normalize(8),
                                                                borderWidth: 1,
                                                                borderColor: '#243F7A',
                                                                marginHorizontal: normalize(10),
                                                                marginTop: normalize(6),
                                                                marginBottom: normalize(4)
                                                            }}>
                                                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: normalize(13), color: "#FFD08A" }}>
                                                                {"State Mandatory Course Certificates"}
                                                            </Text>
                                                            <ArrowIcon name={showMore[year]?.state_mandatory ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color={"#FFD08A"} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <View>
                                                    {showMore[year]?.state_mandatory ? (
                                                        <FlatList
                                                            data={boardTake[year]?.state_mandatory || []}
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
                                                <View>
                                                    <View style={{ flexDirection: "column" }}>
                                                        <TouchableOpacity
                                                            onPress={() => toggleShowMore(year, 'speciality')}
                                                            style={{
                                                                flexDirection: "row",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                paddingHorizontal: normalize(12),
                                                                paddingVertical: normalize(9),
                                                                backgroundColor: '#142B5B',
                                                                borderRadius: normalize(8),
                                                                borderWidth: 1,
                                                                borderColor: '#243F7A',
                                                                marginHorizontal: normalize(10),
                                                                marginTop: normalize(6),
                                                                marginBottom: normalize(4)
                                                            }}>
                                                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: normalize(13), color: "#FFD08A" }}>
                                                                {"Specialty Course Certificates"}
                                                            </Text>
                                                            <ArrowIcon name={showMore[year]?.speciality ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color={"#FFD08A"} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <View>
                                                    {showMore[year]?.speciality ? (
                                                        <FlatList
                                                            data={boardTake[year]?.speciality || []}
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
                        if (isNavigatingRef.current) return;
                        isNavigatingRef.current = true;
                        setTimeout(() => { isNavigatingRef.current = false; }, 1000);
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

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colorpath.Pagebg,
    },
    scrollContent: {
        paddingBottom: normalize(140),
    },
    nonUsaEmptyScrollContent: {
        flexGrow: 1,
        paddingBottom: 0,
    },
    nonUsaEmptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    nonUsaLoader: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colorpath.Pagebg,
        zIndex: 1000001,
    },
    nonUsaLoaderImage: {
        height: normalize(50),
        width: normalize(50),
        resizeMode: 'contain',
    },
    nonUsaAddButtonContainer: {
        position: 'absolute',
        bottom: 70,
        right: 0,
        paddingHorizontal: normalize(20),
        zIndex: 999,
    },
    nonUsaAddButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: normalize(50),
        width: normalize(50),
        backgroundColor: Colorpath.ButtonColr,
        borderWidth: 0.5,
        borderColor: '#AAAAAA',
        borderRadius: normalize(50),
    },
    yearContainer: {
        marginBottom: normalize(12),
        marginHorizontal: normalize(4),
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(8),
        justifyContent: "space-between"
    },
    yearButton: {
        marginLeft: normalize(6),
        justifyContent: 'center',
    },
    yearText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(13.5),
        color: '#1E60F2',
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
        fontSize: normalize(13),
        color: Colorpath.ButtonColr,
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
        height: normalize(32),
        paddingHorizontal: normalize(10),
        borderRadius: normalize(8),
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row"
    },
    buttonText: {
        color: '#1E60F2',
        fontSize: normalize(12),
        fontFamily: Fonts.InterSemiBold,
        fontWeight: '600',
        marginLeft: normalize(4),
    },
    cardWrapper: {
        justifyContent: 'center',
        alignSelf: 'center',
        paddingVertical: normalize(4),
    },
    certificateCard: {
        width: normalize(300),
        borderRadius: normalize(8),
        backgroundColor: '#F4F8FC',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(7),
        borderWidth: 0.8,
        borderColor: '#DCE6F1',
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    certIcon: {
        height: normalize(18),
        width: normalize(18),
        resizeMode: 'contain',
    },
    certificateTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(13.5),
        color: '#000000',
        fontWeight: 'bold',
        flex: 1,
        marginLeft: normalize(10),
        marginRight: normalize(6),
    },
    moreButton: {
        padding: normalize(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    nonUsaContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(40),
        minHeight: normalize(400),
    },
    nonUsaCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(8),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
    },
    nonUsaBanner: {
        backgroundColor: '#E8F0FE',
        paddingVertical: normalize(16),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D3E2FD',
    },
    nonUsaBannerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 18,
        color: '#1E60F2',
        fontWeight: '600',
    },
    nonUsaBody: {
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(24),
        alignItems: 'center',
    },
    nonUsaDescription: {
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        color: '#4A5568',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: normalize(24),
    },
    nonUsaButton: {
        backgroundColor: '#1E60F2',
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(24),
        borderRadius: normalize(6),
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
    },
    nonUsaButtonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '600',
    },
});



/**
 * File check default export.
 *
 * @returns {*}
 */
export default CertficateHandle;
