/**
 * Dashoard vault screen module. Renders a React Native screen or a screen-scoped support component. Exported members: parseExpiryDate, DashoardVault, searchTopicNameboard, handleBoardname, onhandle, oncmeModalclose, fetchData, getDisplayProfession, searchTopicName, vaultState, downCredit, handleRot, stylesd.
 */

import { View, Text, Platform, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import PageHeader from '../../Components/PageHeader'
import { CommonActions, useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar'
import GradientButton from '../../Components/LinearButton'
import Statevault from './Statevault'
import Boardvault from './Boardvault'
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { stateCourseRequest, stateMandatoryRequest, stateReportingRequest, mainprofileRequest, dashMbRequest } from '../../Redux/Reducers/DashboardReducer';
import { PrimeCheckRequest } from '../../Redux/Reducers/WebcastReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Statevaultcomponet from './Statevaultcomponet';
import { styles } from './Statevaultstyes';
import moment from 'moment';
import CMEChecklistModal from './CMEChecklistModal';
import { boardvaultRequest, professionvaultRequest } from '../../Redux/Reducers/CreditVaultReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import StateVaultModal from './StateVaultModal';
import BoardVaultModal from './BoardVaultModal';
import Loader from '../../Utils/Helpers/Loader';
import NetInfo from '@react-native-community/netinfo';
import IntIcn from 'react-native-vector-icons/MaterialIcons';
import Buttons from '../../Components/Button';
import { AppContext } from '../GlobalSupport/AppContext';
import StackNav from '../../Navigator/StackNav';
import Imagepath from '../../Themes/Imagepath';
import { SafeAreaView } from 'react-native-safe-area-context'
import { isNonUsaAccount, readNonUsaFlowState, readNonUsaPermanentFlags, clearNonUsaFlowState, isUsaCountryCode } from '../../Utils/Helpers/nonUsaFlow';
import { isPrimeSubscriptionActive } from '../../Utils/Helpers/primeSubscription';
import CertficateHandle from './FileCheck';

/**
 * Reusable parseExpiryDate component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const parseExpiryDate = (value) => moment(value, ["YYYY-MM-DD", "MM-DD-YYYY", "MM/DD/YYYY", "DD-MM-YYYY", moment.ISO_8601], true);

/**
 * Dashoard vault component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const DashoardVault = (props) => {
    const {
        isConnected,
        setIsConnected,
        fulldashbaord,
    } = useContext(AppContext);
    // const [avoid, setAvoid] = useState(false);
    const isfocused = useIsFocused();
    const isFocus = isfocused;
    const [valuttext, setValuttext] = useState(true);
    const [width, setWidth] = useState(true);
    const [statepick, setStatepick] = useState("");
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const CreditVaultReducer = useSelector(state => state.CreditVaultReducer);
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const isAccreditationUser =
        AuthReducer?.dircetloginResponse?.accreditation_user === true ||
        AuthReducer?.directloginResponse?.accreditation_user === true ||
        AuthReducer?.dircetloginResponse?.user?.accreditation_user === true ||
        AuthReducer?.directloginResponse?.user?.accreditation_user === true;
    const [statewise, setStatewise] = useState("");
    const [clisttopic, setClisttopic] = useState('');
    const [selectCountrytopic, setSelectCountrytopic] = useState([]);
    const [searchtexttopic, setSearchtexttopic] = useState('');
    const [stateid, setStateid] = useState("");
    const [creditwise, setCreditwise] = useState(null);
    const [expireDatecredit, setExpireDatecredit] = useState(false);
    const [countdownMessagecredit, setCountdownMessagecredit] = useState('');
    const [loadingCreditwise, setLoadingCreditwise] = useState(false);
    const [loadingStatewise, setLoadingStatewise] = useState(false);
    const [boardname, setBoardname] = useState("");
    const [licesense, setLicesense] = useState("");
    const [totalCredit, setTotalCredit] = useState("");
    const [mancredit, setMancredit] = useState("");
    const [mantopiccredit, setMantopiccredit] = useState("");
    const [gencredit, setGencredit] = useState("");
    const [gentopiccredit, setGentopiccredit] = useState("");
    const [expirelicno, setExpirelicno] = useState("");
    const [certificatedata, setCertificatedata] = useState(null);
    const [cmemodal, setCmemodal] = useState(false);
    const [allProfessionData, setAllProfessionData] = useState(null);
    const [renewalvault, setRenewalvault] = useState("");
    const [renewalCheck, setRenewalCheck] = useState(null);
    const [modalshow, setModalShow] = useState(false);
    const [statepickboard, setStatepickboard] = useState("");
    const [statewiseboard, setStatewiseboard] = useState("");
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const calculatedHeight = Platform.OS === "ios" ? windowHeight * 0.84 : windowHeight * 0.75;
    const calculatedWidth = windowWidth * 0.92;
    const [clisttopicboard, setClisttopicboard] = useState('');
    const [selectCountrytopicboard, setSelectCountrytopicboard] = useState([]);
    const [searchtexttopicboard, setSearchtexttopicboard] = useState('');
    const [stateidboard, setStateidboard] = useState("");
    const [expireDatecreditboard, setExpireDatecreditboard] = useState(false);
    const [countdownMessagecreditboard, setCountdownMessagecreditboard] = useState('');
    const [loadingCreditwiseboard, setLoadingCreditwiseboard] = useState(false);
    const [loadingStatewiseboard, setLoadingStatewiseboard] = useState(false);
    const [boardnameboard, setBoardnameboard] = useState("");
    const [licesenseboard, setLicesenseboard] = useState("");
    const [totalCreditboard, setTotalCreditboard] = useState("");
    const [mancreditboard, setMancreditboard] = useState("");
    const [mantopiccreditboard, setMantopiccreditboard] = useState("");
    const [gencreditboard, setGencreditboard] = useState("");
    const [gentopiccreditboard, setGentopiccreditboard] = useState("");
    const [boardexpiredate, setBoardexpiredate] = useState("");
    const [certificateboard, setCertificatebaord] = useState(null);
    const [lengthcheck, setLengthcheck] = useState("");
    const [conn, setConn] = useState("")
    const [nonUsaPermanentFlags, setNonUsaPermanentFlags] = useState({
        professionUpdateRequired: false,
        stateLicenseFlowCompleted: false,
    });
    const [exploreTrialClicked, setExploreTrialClicked] = useState(false);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    useEffect(() => {
        if (isFocus) {
            connectionrequest()
                .then(() => {
                    dispatch(boardvaultRequest({}));
                    dispatch(mainprofileRequest({}));
                    dispatch(dashMbRequest({}));
                    dispatch(stateMandatoryRequest({}));
                    dispatch(PrimeCheckRequest({}));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet1", err);
                });
        }
    }, [isFocus]);

    useEffect(() => {
        if (CreditVaultReducer.status === 'CreditVault/boardvaultRequest') {
            setLoadingStatewiseboard(true);
        } else if (CreditVaultReducer.status === 'CreditVault/boardvaultSuccess') {
            setLoadingStatewiseboard(false);
            const finalboard = CreditVaultReducer?.boardvaultResponse?.board_data;
            if (finalboard) {
                const takeFinalBoard = Object.keys(finalboard).map(key => ({
                    ...finalboard[key],
                    board_id: key,
                }));
                setSelectCountrytopicboard(takeFinalBoard);
                setClisttopicboard(takeFinalBoard);
            }
        } else if (CreditVaultReducer.status === 'CreditVault/boardvaultFailure') {
            setLoadingStatewiseboard(false);
        }
    }, [CreditVaultReducer.status, CreditVaultReducer?.boardvaultResponse]);
    useEffect(() => {
        if (clisttopicboard?.length > 0) {
            const defaultStated = clisttopicboard[0];
            setLengthcheck(defaultStated);
            // setStatewise(defaultState?.board_data?.board_name); 
            setCertificatebaord(defaultStated);
            setBoardnameboard(defaultStated?.board_data?.board_name);
            setLicesenseboard(defaultStated?.board_data?.certification_id);
            setMancreditboard(defaultStated?.credits_data?.topic_earned_credits);
            setMantopiccreditboard(defaultStated?.credits_data?.topic_credits);
            setGencreditboard(defaultStated?.credits_data?.total_general_earned_credits);
            setGentopiccreditboard(defaultStated?.credits_data?.total_general_credits);
            setTotalCreditboard(defaultStated?.credits_data?.total_credits)
            const parsedExpiry = parseExpiryDate(defaultStated?.board_data?.expiry_date);
            setBoardexpiredate(parsedExpiry.isValid() ? parsedExpiry.format('MMMM DD, YYYY') : "");
            const today = moment().startOf('day');
            const isExpired = parsedExpiry.isValid() ? today.isAfter(parsedExpiry.clone().startOf('day'), 'day') : true;
            if (isExpired) {
                setExpireDatecreditboard(true);
                setCountdownMessagecreditboard('');
            } else {
                const differenceDays = parsedExpiry.clone().startOf('day').diff(today, 'days');
                setExpireDatecreditboard(false);
                setCountdownMessagecreditboard(`${differenceDays}`);
            }
        }
    }, [clisttopicboard]);
    useEffect(() => {
        setBoardnameboard(boardnameboard);
    }, [isfocused])
    useEffect(() => {
        if (stateidboard) {
            const parsedExpiry = parseExpiryDate(stateidboard?.board_data?.expiry_date);
            const today = moment().startOf('day');
            const isExpired = parsedExpiry.isValid() ? today.isAfter(parsedExpiry.clone().startOf('day'), 'day') : true;
            if (isExpired) {
                setExpireDatecreditboard(true);
                setCountdownMessagecreditboard('');
            } else {
                const differenceDays = parsedExpiry.clone().startOf('day').diff(today, 'days');
                setExpireDatecreditboard(false);
                setCountdownMessagecreditboard(`${differenceDays}`);
            }
        }
    }, [stateidboard])
    /**
* Search topic nameboard utility.
* @param {*} text - Input value.
* @returns {void}
*/
    const searchTopicNameboard = text => {
        if (text) {
            const listAllData = selectCountrytopicboard?.filter(function (item) {
                const itemDataTopic = item?.board_data.board_name
                    ? item?.board_data.board_name?.toUpperCase()
                    : ''.toUpperCase();
                const textDataTopic = text.trim().toUpperCase();
                const AllDataFilter = itemDataTopic.indexOf(textDataTopic) > -1;
                return AllDataFilter;
            });
            setClisttopicboard(listAllData);
            setSearchtexttopicboard(text);
        } else {
            setClisttopicboard(selectCountrytopicboard);
            setSearchtexttopicboard(text);
        }
    };
    /**
* Handles boardname.
* @param {*} did - Input value.
* @returns {void}
*/
    const handleBoardname = (did) => {
        setStateidboard(did)
        setBoardnameboard(did?.board_data?.board_name);
        setStatepickboard(false);
        setCertificatebaord(did);
    }



    /////////state--area///////

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
        setCmemodal(false);
    }
    useFocusEffect(
        React.useCallback(() => {
            let obj = {};

            /**
* Fetch data utility.
* @returns {void}
*/
            const fetchData = () => {
                connectionrequest()
                    .then(() => {
                        dispatch(stateMandatoryRequest(obj));
                    })
                    .catch((err) => {
                        showErrorAlert("Please connect to internet2", err);
                    });
            };

            fetchData();

            // Cleanup if needed
            return () => {
                // Cleanup logic here if necessary
            };
        }, [])
    );
    useEffect(() => {
        if (DashboardReducer.status === 'Dashboard/stateMandatoryRequest') {
            setLoadingStatewise(true);
        } else if (DashboardReducer.status === 'Dashboard/stateMandatorySuccess') {
            setLoadingStatewise(false);
        } else if (DashboardReducer.status === 'Dashboard/stateMandatoryFailure') {
            setLoadingStatewise(false);
        }

        if (DashboardReducer.status === 'Dashboard/stateCourseRequest') {
            setLoadingCreditwise(true);
        } else if (DashboardReducer.status === 'Dashboard/stateCourseSuccess') {
            setLoadingCreditwise(false);
            setCreditwise(DashboardReducer?.stateCourseResponse?.data?.state_data);
        } else if (DashboardReducer.status === 'Dashboard/stateCourseFailure') {
            setLoadingCreditwise(false);
        }

        if (DashboardReducer.status === 'Dashboard/stateReportingSuccess') {
            setRenewalCheck(DashboardReducer?.stateReportingResponse?.renewal_report);
            if (DashboardReducer?.stateReportingResponse?.renewal_report?.renewal_link) {
                setRenewalvault(DashboardReducer.stateReportingResponse.renewal_report.renewal_link);
            } else {
                setRenewalvault(null);
            }
        }
    }, [DashboardReducer.status, DashboardReducer?.stateCourseResponse, DashboardReducer?.stateReportingResponse]);

    useEffect(() => {
        if (CreditVaultReducer.status === 'CreditVault/professionvaultSuccess') {
            setAllProfessionData(CreditVaultReducer?.professionvaultResponse);
        }
    }, [CreditVaultReducer.status, CreditVaultReducer?.professionvaultResponse]);
    useEffect(() => {
        const rawStateData =
            DashboardReducer?.stateMandatoryResponse?.state_data ||
            DashboardReducer?.stateMandatorySuccess?.state_data;

        if (rawStateData && typeof rawStateData === 'object') {
            const stateDataArray = Object.keys(rawStateData)
                .filter(key => key !== '-1')
                .map(key => ({
                    ...rawStateData[key],
                    state_id: key,
                }));

            if (stateDataArray.length > 0) {
                setSelectCountrytopic(stateDataArray);
                setClisttopic(stateDataArray);

                const defaultState = stateDataArray[0];
                setCertificatedata(defaultState);
                setStatewise(defaultState?.state_name || "");
                setStateid(defaultState?.state_id || "");
                return;
            }
        }

        const licensures =
            DashboardReducer?.dashMbResponse?.data?.licensures ||
            DashboardReducer?.dashboardResponse?.data?.licensures;

        if (Array.isArray(licensures) && licensures.length > 0) {
            const uniqueStates = licensures.filter((state, index, self) =>
                index === self.findIndex(s => s.state_id === state.state_id && s.board_id === state.board_id)
            );
            setSelectCountrytopic(uniqueStates);
            setClisttopic(uniqueStates);

            const defaultState = uniqueStates[0];
            setCertificatedata(defaultState);
            setStatewise(defaultState?.state_name || defaultState?.board_data?.board_name || "");
            setStateid(defaultState?.state_id || "");
            return;
        }

        if (!rawStateData && (!licensures || licensures.length === 0)) {
            setSelectCountrytopic([]);
            setClisttopic([]);
            setCertificatedata(null);
            setStatewise("");
            setStateid("");
        }
    }, [
        JSON.stringify(DashboardReducer?.stateMandatoryResponse?.state_data),
        JSON.stringify(DashboardReducer?.stateMandatorySuccess?.state_data),
        JSON.stringify(DashboardReducer?.dashMbResponse?.data?.licensures),
        JSON.stringify(DashboardReducer?.dashboardResponse?.data?.licensures),
        DashboardReducer?.status,
    ]);


    const [finalverifyvault, setFinalverifyvault] = useState(null);
    const [finalProfession, setFinalProfession] = useState(null);
    const [storedAuthUser, setStoredAuthUser] = useState(null);
    const [nonUsaFlowState, setNonUsaFlowState] = useState(null);
    const [isAsyncStorageLoaded, setIsAsyncStorageLoaded] = useState(false);
    const [isProfileReady, setIsProfileReady] = useState(false);

    const [currentProfile, setCurrentProfile] = useState(null);

    useEffect(() => {
        let mounted = true;
        if (isFocus) {
            setIsAsyncStorageLoaded(false);
            setIsProfileReady(false);
            Promise.all([
                readNonUsaFlowState(),
                readNonUsaPermanentFlags(),
                AsyncStorage.getItem(constants.AUTH_USER_DATA),
                AsyncStorage.getItem(constants.VERIFYSTATEDATA),
                AsyncStorage.getItem(constants.PROFESSION),
                AsyncStorage.getItem('ExploreTrialClicked'),
                AsyncStorage.getItem('activeProfile')
            ]).then(([state, flags, auth_user, board_special, profession_data, exploreTrialClickedRaw, activeProfile]) => {
                if (!mounted) return;

                const auth_user_json = auth_user ? JSON.parse(auth_user) : null;
                const board_special_json = board_special ? JSON.parse(board_special) : null;
                const profession_data_json = profession_data ? JSON.parse(profession_data) : null;

                setNonUsaFlowState(state);
                setNonUsaPermanentFlags(flags);
                setStoredAuthUser(auth_user_json);
                setFinalverifyvault(board_special_json);
                setFinalProfession(profession_data_json);
                setExploreTrialClicked(exploreTrialClickedRaw === 'true');
                setCurrentProfile(activeProfile);
                setIsAsyncStorageLoaded(true);
                setIsProfileReady(true);
            }).catch(err => {
                console.log('Error loading AsyncStorage vault data', err);
                if (mounted) {
                    setIsAsyncStorageLoaded(true);
                    setIsProfileReady(true);
                }
            });
        }
        return () => {
            mounted = false;
        };
    }, [isFocus]);
    useEffect(() => {
        const emitter = require('react-native').DeviceEventEmitter;
        const sub = emitter.addListener('ACTIVE_PROFILE_CHANGED', (profile) => {
            setCurrentProfile(profile);
            setIsProfileReady(true);
        });
        return () => sub.remove();
    }, []);

    const hasActiveSession =
        AuthReducer?.dircetloginResponse?.user ||
        AuthReducer?.dircetloginResponse ||
        AuthReducer?.directloginResponse?.user ||
        AuthReducer?.directloginResponse ||
        AuthReducer?.signupResponse?.user ||
        AuthReducer?.loginResponse?.user ||
        AuthReducer?.againloginsiginResponse?.user ||
        AuthReducer?.verifymobileResponse?.user ||
        DashboardReducer?.mainprofileResponse ||
        storedAuthUser;

    const resolvedUser = hasActiveSession
        ? (DashboardReducer?.mainprofileResponse || hasActiveSession)
        : null;

    const loginUser = storedAuthUser || AuthReducer?.loginResponse?.user || AuthReducer?.dircetloginResponse?.user || AuthReducer?.dircetloginResponse || resolvedUser;
    const activeUser = loginUser?.user ? loginUser.user : loginUser;
    const isNonSubscribedNoSubscription =
        activeUser?.subscription_user == "non-subscribed" &&
        (!activeUser?.subscription || activeUser?.subscription?.length === 0) &&
        (!activeUser?.subscriptions || activeUser?.subscriptions?.length === 0);
    const isPrimeTrialOrActive = useMemo(() => (
        exploreTrialClicked ||
        isPrimeSubscriptionActive(WebcastReducer?.PrimeCheckResponse) ||
        Boolean(WebcastReducer?.PrimePaymentResponse?.msg === 'You are now enrolled for subscription successfully.')
    ), [exploreTrialClicked, WebcastReducer?.PrimeCheckResponse, WebcastReducer?.PrimePaymentResponse]);
    const shouldHideCertificateAction = isNonSubscribedNoSubscription && !isPrimeTrialOrActive;
    const userObj = DashboardReducer?.mainprofileResponse || AuthReducer?.dircetloginResponse?.user || AuthReducer?.dircetloginResponse || AuthReducer?.directloginResponse?.user || AuthReducer?.directloginResponse || resolvedUser || finalverifyvault || finalProfession;
    const countryName = String(
        userObj?.user_address?.country_name ||
        userObj?.user_address?.country ||
        userObj?.country_name ||
        userObj?.country ||
        ''
    ).trim().toUpperCase();

    const isUsaCountry = countryName === 'UNITED STATES' || countryName === 'US' || countryName === 'USA' || isUsaCountryCode(countryName);

    const isUsaProfile =
        isUsaCountry ||
        userObj?.usa_user === true ||
        userObj?.usa_user === 1 ||
        userObj?.usa_user === '1' ||
        userObj?.is_non_usa === false ||
        userObj?.is_non_usa === 0 ||
        userObj?.is_non_usa === '0';

    const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
    /**
* Returns display profession.
* @param {*} source - Input value.
* @returns {*}
*/
    const getDisplayProfession = (source) => {
        const src = source || DashboardReducer?.mainprofileResponse || AuthReducer?.dircetloginResponse?.user || AuthReducer?.dircetloginResponse || AuthReducer?.loginResponse?.user;
        if (!src) return "";
        const profession = String(
            src?.professional_information?.profession ||
            src?.profession ||
            DashboardReducer?.mainprofileResponse?.professional_information?.profession ||
            ""
        ).trim();
        const professionType = String(
            src?.professional_information?.profession_type ||
            src?.profession_type ||
            DashboardReducer?.mainprofileResponse?.professional_information?.profession_type ||
            ""
        ).trim();
        return profession && professionType ? `${profession} - ${professionType}` : (profession || professionType || "");
    };
    const isPhysicianProf = validHandles.has(getDisplayProfession(userObj));

    const dashboardLicenses = DashboardReducer?.dashMbResponse?.data?.licensures || DashboardReducer?.dashboardResponse?.data?.licensures || DashboardReducer?.dashPerResponse?.data?.licensures || DashboardReducer?.mainprofileResponse?.licensures || [];
    const stateDataVault = DashboardReducer?.stateMandatoryResponse?.state_data || DashboardReducer?.stateMandatorySuccess?.state_data;
    const hasUsaLicenseData =
        (Array.isArray(dashboardLicenses) && dashboardLicenses.length > 0) ||
        (stateDataVault && Object.keys(stateDataVault).some(key => key !== '-1')) ||
        (Array.isArray(selectCountrytopic) && selectCountrytopic.length > 0) ||
        Boolean(AuthReducer?.staticdataResponse?.state) ||
        Boolean(creditwise?.license_number || licesense || DashboardReducer?.mainprofileResponse?.license_number);

    const isNonUsaUser = !isUsaProfile && !hasUsaLicenseData && !(isPhysicianProf && hasUsaLicenseData) && (nonUsaFlowState?.isNonUsa === true || isNonUsaAccount(userObj || {}, nonUsaFlowState));

    useEffect(() => {
        if ((isUsaProfile || hasUsaLicenseData) && nonUsaFlowState?.isNonUsa) {
            clearNonUsaFlowState().catch(err => console.log('clearNonUsaFlowState error', err));
            setNonUsaFlowState(null);
        }
    }, [isUsaProfile, hasUsaLicenseData, nonUsaFlowState]);
    const hasAnyLicenseData = dashboardLicenses.length > 0 || Boolean(creditwise?.license_number || licesense);
    const allProfTake = (isProfileReady && currentProfile !== 'SkipProfile' && validHandles.has(getDisplayProfession(userObj))) || hasUsaLicenseData;
    const shouldShowAddLicenseCard =
        !isNonUsaUser &&
        isPhysicianProf &&
        !fulldashbaord?.length &&
        (currentProfile === 'SkipProfile' || !allProfTake || nonUsaPermanentFlags?.stateLicenseFlowCompleted === true);
    const nonUsaStateData = DashboardReducer?.stateMandatoryResponse?.state_data || DashboardReducer?.stateMandatorySuccess?.state_data;
    const nonUsaCertificates = nonUsaStateData?.['-1']?.certificates;
    let hasNonUsaCertificates = false;
    if (nonUsaCertificates) {
        if (Array.isArray(nonUsaCertificates)) {
            hasNonUsaCertificates = nonUsaCertificates.length > 0;
        } else if (typeof nonUsaCertificates === 'object') {
            hasNonUsaCertificates = Object.values(nonUsaCertificates).flatMap((value) => (Array.isArray(value) ? value : [value])).filter(Boolean).length > 0;
        }
    }

    const allProfession = AuthReducer?.loginResponse?.user?.profession || storedAuthUser?.profession || AuthReducer?.againloginsiginResponse?.user?.profession || AuthReducer?.verifymobileResponse?.user?.profession || finalverifyvault?.profession || finalProfession?.profession;
    useEffect(() => {
        if (certificatedata) {
            let obj = {
                "profession": allProfession,
                "stateId": certificatedata?.state_id
            }
            dispatch(professionvaultRequest(obj))
        }
    }, [certificatedata])
    useEffect(() => {
        if (stateid) {
            let obj = {
                "state_id": stateid
            }
            dispatch(stateCourseRequest(obj));
            dispatch(stateReportingRequest(obj))
        }
    }, [stateid]);
    useEffect(() => {
        if (isAccreditationUser) {
            setModalShow(false);
        }
    }, [isAccreditationUser]);
    useEffect(() => {
        if (isAccreditationUser) {
            setModalShow(false);
        }
        if (creditwise) {
            if (creditwise?.board_data?.expiry_date) {
                const parsedExpiry = parseExpiryDate(creditwise?.board_data?.expiry_date);
                const today = moment().startOf('day');
                if (!parsedExpiry.isValid()) {
                    if (!isAccreditationUser) setModalShow(true);
                    setExpireDatecredit(true);
                    setCountdownMessagecredit('');
                } else {
                    const targetDate = parsedExpiry.clone().startOf('day');
                    const isExpired = today.isAfter(targetDate, 'day');
                    if (isExpired) {
                        if (!isAccreditationUser) setModalShow(true);
                        setExpireDatecredit(true);
                        setCountdownMessagecredit('');
                    } else {
                        const differenceDays = targetDate.diff(today, 'days');
                        if (differenceDays == 89) {
                            // setModalShow(true);
                            setExpireDatecredit(true);
                            setCountdownMessagecredit('');
                        } else if (differenceDays < 89) {
                            // setModalShow(true);
                            setExpireDatecredit(true);
                            setCountdownMessagecredit(`${differenceDays}`);
                        } else {
                            // setModalShow(false);
                            setExpireDatecredit(false);
                            setCountdownMessagecredit(`${differenceDays}`);
                        }
                    }
                }
            }
            if (creditwise?.board_data?.board_name) {
                setBoardname(creditwise?.board_data?.board_name);
            }
            if (creditwise?.board_data?.expiry_date) {
                const parsedExpiry = parseExpiryDate(creditwise?.board_data?.expiry_date);
                setExpirelicno(parsedExpiry.isValid() ? parsedExpiry.format('MMMM DD, YYYY') : '')
            }
            if (creditwise?.license_number) {
                setLicesense(creditwise?.license_number);
            }
            if (creditwise?.credits_data?.total_credits) {
                setTotalCredit(creditwise?.credits_data?.total_credits);
            }
            if (creditwise?.credits_data?.topic_earned_credits) {
                setMancredit(creditwise?.credits_data?.topic_earned_credits)
            }
            if (creditwise?.credits_data?.topic_credits) {
                setMantopiccredit(creditwise?.credits_data?.topic_credits);
            }
            if (creditwise?.credits_data?.total_general_earned_credits) {
                setGencredit(creditwise?.credits_data?.total_general_earned_credits);
            }
            if (creditwise?.credits_data?.total_general_credits) {
                setGentopiccredit(creditwise?.credits_data?.total_general_credits);
            }
        }

    }, [creditwise]);
    /**
* Search topic name utility.
* @param {*} text - Input value.
* @returns {void}
*/
    const searchTopicName = text => {
        if (text) {
            const listAllData = selectCountrytopic?.filter(function (item) {
                const itemDataTopic = item?.state_name
                    ? item?.state_name?.toUpperCase()
                    : ''.toUpperCase();
                const textDataTopic = text.trim().toUpperCase();
                const AllDataFilter = itemDataTopic.indexOf(textDataTopic) > -1;
                return AllDataFilter;
            });
            setClisttopic(listAllData);
            setSearchtexttopic(text);
        } else {
            setClisttopic(selectCountrytopic);
            setSearchtexttopic(text);
        }
    };
    /**
* Vault state utility.
* @param {*} vault - Input value.
* @returns {void}
*/
    const vaultState = (vault) => {
        setStateid(vault?.state_id)
        setStatewise(vault?.state_name);
        setCertificatedata(vault);
        setStatepick(false);
        setCreditwise(null);
        if (stateid) {
            let obj = {
                "state_id": stateid
            }
            dispatch(stateCourseRequest(obj));
        }
    }
    useEffect(() => {
        if (statewise) {
            setSearchtexttopic("");
        }
    }, [statewise])
    useEffect(() => {
        const stateData = DashboardReducer?.stateMandatoryResponse?.state_data;
        if (stateData) {
            const stateDataArray = Object.keys(stateData).map(key => ({
                ...stateData[key],
                state_id: key,
            }));
            if (!searchtexttopic && stateDataArray) {
                setClisttopic(stateDataArray);
            }
        }
    }, [searchtexttopic])
    useEffect(() => {
        setStatewise(statewise);

    }, [isfocused])
    useEffect(() => {
        // setAvoid(true);
        setWidth(true);
    }, [isfocused])
    /**
* Down credit utility.
* @returns {void}
*/
    const downCredit = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: "TabNav", params: { initialRoute: "Home" } }
                ],
            })
        );

    }
    /**
* Handles rot.
* @returns {*}
*/
    const handleRot = () => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                <StackNav />
            }
        });

        return () => unsubscribe();
    }
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn === false ? <SafeAreaView style={stylesd.container}>
                <View style={stylesd.centerContainer}>
                    <View style={{ height: normalize(100), width: normalize(120), borderRadius: normalize(20), bottom: normalize(50), justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { height: 3, width: 0 }, elevation: 10, backgroundColor: "#FFFFFF" }}>
                        <Image source={Imagepath.NoWifi} style={{ height: normalize(40), width: normalize(40), resizeMode: "contain" }} />
                    </View>
                    <Buttons
                        onPress={handleRot}
                        height={normalize(45)}
                        width={normalize(240)}
                        backgroundColor={Colorpath.ButtonColr}
                        borderRadius={normalize(5)}
                        text="Retry"
                        color={Colorpath.white}
                        fontSize={16}
                        fontFamily={Fonts.InterSemiBold}
                        fontWeight="bold"
                        marginTop={normalize(65)}
                    />
                </View>
                <View style={stylesd.internetCard}>
                    <Text style={stylesd.internetText}>{"No Internet Connection"}</Text>
                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000" }}>{"Please check your internet connection \n                    and try again"}</Text>
                </View>
            </SafeAreaView> : <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {statepick ? (
                    <StateVaultModal
                        vaultState={vaultState}
                        setStatepick={setStatepick}
                        searchtexttopic={searchtexttopic}
                        searchTopicName={searchTopicName}
                        clisttopic={clisttopic}
                    />
                ) : statepickboard ? (<BoardVaultModal
                    handleBoardname={handleBoardname}
                    setStatepickboard={setStatepickboard}
                    statepickboard={statepickboard}
                    searchtexttopicboard={searchtexttopicboard}
                    searchTopicNameboard={searchTopicNameboard}
                    clisttopicboard={clisttopicboard} />) : (<>
                        {!(isNonUsaUser && hasNonUsaCertificates) && (
                            <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                                {Platform.OS === "ios" ? (
                                    <PageHeader
                                        title="Credit Vault"
                                        onBackPress={downCredit}
                                    />
                                ) : (
                                    <PageHeader
                                        title="Credit Vault"
                                        onBackPress={downCredit}
                                    />
                                )}
                            </View>
                        )}
                        <Loader visible={!isAsyncStorageLoaded || loadingCreditwise || (isNonUsaUser && loadingStatewise)} />
                        {shouldShowAddLicenseCard ? (
                            <View style={stylesd.nonUsaContainer}>
                                <View style={stylesd.nonUsaCard}>
                                    <View style={stylesd.nonUsaBanner}>
                                        <Text style={stylesd.nonUsaBannerText}>Add License</Text>
                                    </View>
                                    <View style={stylesd.nonUsaBody}>
                                        <Text style={stylesd.nonUsaDescription}>
                                            Add at least one valid state license to unlock Credit Vault access.
                                        </Text>
                                        <TouchableOpacity
                                            style={stylesd.nonUsaButton}
                                            onPress={() => {
                                                navigation.navigate("AddLicense", { profile: "main" });
                                            }}
                                        >
                                            <Text style={stylesd.nonUsaButtonText}>Add License</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ) : (!hasUsaLicenseData && !isPhysicianProf && (!isNonUsaUser || !hasNonUsaCertificates)) ? (
                            <View style={stylesd.nonUsaContainer}>
                                <View style={stylesd.nonUsaCard}>
                                    <View style={stylesd.nonUsaBanner}>
                                        <Text style={stylesd.nonUsaBannerText}>Credit Vault</Text>
                                    </View>
                                    <View style={stylesd.nonUsaBody}>
                                        <Text style={stylesd.nonUsaDescription}>
                                            You can view credits and certificates of all the activities you fulfilled at eMedEvents.{"\n\n"}
                                            You can also add credits and certificates of activities you attended elsewhere.
                                        </Text>
                                        <TouchableOpacity
                                            style={stylesd.nonUsaButton}
                                            onPress={() => {
                                                navigation.navigate("AddCredits", { isNonUsaUser: isNonUsaUser });
                                            }}
                                        >
                                            <Text style={stylesd.nonUsaButtonText}>Add Credits</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ) : isNonUsaUser ? (
                            <CertficateHandle navigation={navigation} route={{ params: { isNonUsaUser: isNonUsaUser } }} />
                        ) : (
                            <>
                                <View style={{ marginTop: normalize(10) }}>
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between", // Changed from space-evenly to space-between
                                        width: normalize(300),
                                        height: normalize(48),
                                        backgroundColor: "#FFFFFF",
                                        borderRadius: normalize(5),
                                        paddingHorizontal: normalize(2), // Added padding to prevent overflow
                                        alignSelf: 'center',
                                    }}>
                                        <TouchableOpacity
                                            style={[
                                                {
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    flex: 1,
                                                    height: normalize(41),
                                                    borderRadius: normalize(5),
                                                    marginTop: normalize(3),
                                                    marginHorizontal: normalize(2),
                                                },
                                                valuttext && {
                                                    backgroundColor: "#DCE4FF"
                                                }
                                            ]}
                                            onPress={() => { setValuttext(true); }}
                                        >
                                            <Text style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 16,
                                                color: valuttext ? Colorpath.ButtonColr : "#000000",
                                                fontWeight: "500"
                                            }}>
                                                State License{
                                                    selectCountrytopic && selectCountrytopic.length > 0 ? ` (${selectCountrytopic.length})` :
                                                        AuthReducer?.staticdataResponse?.state ? ` (${AuthReducer.staticdataResponse.state})` :
                                                            ''
                                                }
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[
                                                {
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    flex: 1,
                                                    height: normalize(41),
                                                    borderRadius: normalize(5),
                                                    marginTop: normalize(3),
                                                    marginHorizontal: normalize(-1),
                                                },
                                                !valuttext && {
                                                    backgroundColor: "#DCE4FF"
                                                }
                                            ]}
                                            onPress={() => { setValuttext(false) }}
                                        >
                                            <Text style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 16,
                                                color: !valuttext ? Colorpath.ButtonColr : "#000000",
                                                fontWeight: "500"
                                            }}>
                                                Board Certifications{DashboardReducer?.dashboardResponse?.data?.boards ? `(${Object.keys(DashboardReducer?.dashboardResponse?.data?.boards || {}).length})` :
                                                    AuthReducer?.staticdataResponse?.board && AuthReducer.staticdataResponse.board.length > 0
                                                        ? ` (${AuthReducer.staticdataResponse.board})`
                                                        : DashboardReducer?.dashboardResponse?.data?.board_certifications &&
                                                            DashboardReducer.dashboardResponse.data.board_certifications.length > 0
                                                            ? ` (${DashboardReducer.dashboardResponse.data.board_certifications.length})`
                                                            : '(0)'
                                                }
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <ScrollView contentContainerStyle={{ paddingBottom: normalize(0) }}>
                                    <View>
                                        <View style={{ bottom: normalize(10) }}>
                                            {valuttext && <Statevault
                                                modalshow={modalshow}
                                                setModalShow={setModalShow}
                                                allProfession={allProfession}
                                                count={AuthReducer?.staticdataResponse?.state}
                                                onhandle={onhandle}
                                                oncmeModalclose={oncmeModalclose}
                                                navigation={navigation}
                                                dispatch={dispatch}
                                                DashboardReducer={DashboardReducer}
                                                CreditVaultReducer={CreditVaultReducer}
                                                AuthReducer={AuthReducer}
                                                statewise={statewise}
                                                setStatewise={setStatewise}
                                                clisttopic={clisttopic}
                                                setClisttopic={setClisttopic}
                                                statepick={statepick}
                                                selectCountrytopic={selectCountrytopic}
                                                setSelectCountrytopic={setSelectCountrytopic}
                                                searchtexttopic={searchtexttopic}
                                                setSearchtexttopic={setSearchtexttopic}
                                                searchTopicName={searchTopicName}
                                                stateid={stateid}
                                                setStateid={setStateid}
                                                creditwise={creditwise}
                                                setCreditwise={setCreditwise}
                                                expireDatecredit={expireDatecredit}
                                                setExpireDatecredit={setExpireDatecredit}
                                                countdownMessagecredit={countdownMessagecredit}
                                                setCountdownMessagecredit={setCountdownMessagecredit}
                                                loadingCreditwise={loadingCreditwise}
                                                setLoadingCreditwise={setLoadingCreditwise}
                                                loadingStatewise={loadingStatewise}
                                                setLoadingStatewise={setLoadingStatewise}
                                                boardname={boardname}
                                                setBoardname={setBoardname}
                                                licesense={licesense}
                                                setLicesense={setLicesense}
                                                totalCredit={totalCredit}
                                                setTotalCredit={setTotalCredit}
                                                mancredit={mancredit}
                                                setMancredit={setMancredit}
                                                mantopiccredit={mantopiccredit}
                                                setMantopiccredit={setMantopiccredit}
                                                gencredit={gencredit}
                                                setGencredit={setGencredit}
                                                gentopiccredit={gentopiccredit}
                                                setGentopiccredit={setGentopiccredit}
                                                expirelicno={expirelicno}
                                                setExpirelicno={setExpirelicno}
                                                certificatedata={certificatedata}
                                                setCertificatedata={setCertificatedata}
                                                cmemodal={cmemodal}
                                                setCmemodal={setCmemodal}
                                                allProfessionData={allProfessionData}
                                                setAllProfessionData={setAllProfessionData}
                                                renewalvault={renewalvault}
                                                setRenewalvault={setRenewalvault}
                                                isfocused={isfocused}
                                                setStatepick={setStatepick}
                                                vaultState={vaultState}
                                                renewalCheck={renewalCheck}
                                                hideCertificateAction={shouldHideCertificateAction} />}
                                        </View>
                                        <View style={{ bottom: normalize(10) }}>
                                            {!valuttext && <Boardvault
                                                isfocused={isfocused}
                                                navigation={navigation}
                                                dispatch={dispatch}
                                                statepickboard={statepickboard}
                                                setStatepickboard={setStatepickboard}
                                                statewiseboard={statewiseboard}
                                                setStatewiseboard={setStatewiseboard}
                                                clisttopicboard={clisttopicboard}
                                                setClisttopicboard={setClisttopicboard}
                                                selectCountrytopicboard={selectCountrytopicboard}
                                                setSelectCountrytopicboard={setSelectCountrytopicboard}
                                                searchtexttopicboard={searchtexttopicboard}
                                                setSearchtexttopicboard={setSearchtexttopicboard}
                                                stateidboard={stateidboard}
                                                setStateidboard={setStateidboard}
                                                expireDatecreditboard={expireDatecreditboard}
                                                setExpireDatecreditboard={setExpireDatecreditboard}
                                                countdownMessagecreditboard={countdownMessagecreditboard}
                                                setCountdownMessagecreditboard={setCountdownMessagecreditboard}
                                                loadingCreditwiseboard={loadingCreditwiseboard}
                                                setLoadingCreditwiseboard={setLoadingCreditwiseboard}
                                                loadingStatewiseboard={loadingStatewiseboard}
                                                setLoadingStatewiseboard={setLoadingStatewiseboard}
                                                boardnameboard={boardnameboard}
                                                setBoardnameboard={setBoardnameboard}
                                                licesenseboard={licesenseboard}
                                                setLicesenseboard={setLicesenseboard}
                                                totalCreditboard={totalCreditboard}
                                                setTotalCreditboard={setTotalCreditboard}
                                                mancreditboard={mancreditboard}
                                                setMancreditboard={setMancreditboard}
                                                mantopiccreditboard={mantopiccreditboard}
                                                setMantopiccreditboard={setMantopiccreditboard}
                                                gencreditboard={gencreditboard}
                                                setGencreditboard={setGencreditboard}
                                                gentopiccreditboard={gentopiccreditboard}
                                                setGentopiccreditboard={setGentopiccreditboard}
                                                boardexpiredate={boardexpiredate}
                                                setBoardexpiredate={setBoardexpiredate}
                                                certificateboard={certificateboard}
                                                setCertificatebaord={setCertificatebaord}
                                                lengthcheck={lengthcheck}
                                                setLengthcheck={setLengthcheck}
                                                searchTopicNameboard={searchTopicNameboard}
                                                handleBoardname={handleBoardname}
                                                styles={styles}
                                                takeID={CreditVaultReducer?.boardvaultResponse?.board_data}
                                                hideCertificateAction={shouldHideCertificateAction}
                                            />}
                                        </View>
                                    </View>
                                </ScrollView>
                            </>
                        )}
                    </>)}

            </SafeAreaView>}


        </>
    )
}

/**
 * Dashoard vault default export.
 *
 * @returns {*}
 */
export default DashoardVault
/**
 * Stylesd value.
 * @returns {*}
 */
const stylesd = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colorpath.Pagebg,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        padding: normalize(10),
        flex: 1
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(20),
        zIndex: 2,
    },
    icon: {
        marginBottom: normalize(20),
    },
    internetCard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colorpath.Pagebg,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        padding: normalize(10),
        marginTop: normalize(10),
        flex: 1,
        gap: normalize(5)
    },
    internetText: {
        color: "#000000",
        fontFamily: Fonts.InterSemiBold,
        fontSize: 20,
    },
    nonUsaContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(20),
        backgroundColor: Colorpath.Pagebg,
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
