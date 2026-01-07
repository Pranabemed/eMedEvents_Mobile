import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, Linking, Alert, Image, ImageBackground, Pressable } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Buttons from './Button';
import Colorpath from '../Themes/Colorpath';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';
import moment from 'moment';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import CircularProgress from './ProgressBar';
import ErrorIcon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../Utils/Helpers/constants';
import showErrorAlert from '../Utils/Helpers/Toast';
import { licesensRequest } from '../Redux/Reducers/AuthReducer';
import connectionrequest from '../Utils/Helpers/NetInfo';
import Imagepath from '../Themes/Imagepath';
import Modal from 'react-native-modal'
import LinearGradient from 'react-native-linear-gradient';
import CMECard from './CMECard';
import ArrowNeed from 'react-native-vector-icons/Feather';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
let status = "";
const Carouselcarditem = ({ hidetext, setPrimeadd, enables, setStateCount, fetcheddt, stateCount, item, navigation, stateid, renewal, val, index }) => {
    console.log(item, "rwsejkdhfhdsd")
    const {
        expireDate,
        setExpireDate,
        setFinddata,
        finddata,
        clearContextData
    } = useContext(AppContext);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const calculatedHeight = Platform.OS === "ios" ? windowHeight * 0.84 : windowHeight * 0.73;
    const calculatedWidth = windowWidth * 0.9;
    const [countdownMessage, setCountdownMessage] = useState('');
    const AuthReducer = useSelector(state => state.AuthReducer);
    const [finalverifyvault, setFinalverifyvault] = useState(null);
    const [finalProfession, setFinalProfession] = useState(null);
    const [dashMod, setDashMod] = useState(false);
    const [takeName, setTakeName] = useState("");
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const [CMEcard, setCMECard] = useState(false)
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
    const profFromDashboard =
        DashboardReducer?.mainprofileResponse?.professional_information?.profession != null &&
            DashboardReducer?.mainprofileResponse?.professional_information?.profession_type != null
            ? `${DashboardReducer?.mainprofileResponse?.professional_information?.profession} - ${DashboardReducer?.mainprofileResponse?.professional_information?.profession_type}`
            : null;
    const allProfTake = validHandles.has(profFromDashboard);
    useEffect(() => {
        const token_handle_vault = () => {
            setTimeout(async () => {
                try {
                    const [board_special, profession_data] = await Promise.all([
                        AsyncStorage.getItem(constants.VERIFYSTATEDATA),
                        AsyncStorage.getItem(constants.PROFESSION)
                    ]);
                    const board_special_json = board_special ? JSON.parse(board_special) : null;
                    const profession_data_json = profession_data ? JSON.parse(profession_data) : null;
                    setFinalverifyvault(board_special_json);
                    setFinalProfession(profession_data_json);
                    console.log(board_special_json, "statelicesene=================");
                    console.log(profession_data_json, "profession=================");
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            }, 100);
        };

        token_handle_vault();
    }, [navigation, isFocus]);
    const [allProfession, setAllProfession] = useState(null);

    const cleanNumber = (value) => {
        if (typeof value == 'number') return value;
        if (typeof value == 'string') {
            const num = parseFloat(value.replace(/,/g, ''));
            return isNaN(num) ? 0 : num;
        }
        return 0;
    };
    const topicEarned = cleanNumber(item?.credits_data?.topic_earned_credits);
    const topicTotal = cleanNumber(item?.credits_data?.topic_credits);
    const generalEarned = cleanNumber(item?.credits_data?.total_general_earned_credits);
    const generalTotal = cleanNumber(item?.credits_data?.total_general_credits);
    const manWrng = (topicEarned === 0 && topicTotal === 0);
    const genWrng = (generalEarned === 0 && generalTotal === 0);
    const bothNoRequirement =
        (topicEarned === 0 && topicTotal === 0 &&
            generalEarned === 0 && generalTotal === 0);
    const finalSumCred = topicEarned + generalEarned
    useEffect(() => {
        const professionData =
            AuthReducer?.loginResponse?.user ||
            AuthReducer?.againloginsiginResponse?.user ||
            AuthReducer?.verifymobileResponse?.user ||
            finalverifyvault ||
            finalProfession;

        setAllProfession(professionData);
    }, [
        AuthReducer?.loginResponse?.user,
        AuthReducer?.againloginsiginResponse?.user,
        AuthReducer?.verifymobileResponse?.user,
        finalverifyvault,
        finalProfession,
        navigation,
        isFocus
    ]);
    console.log(CMEcard, val, index, "AuthReducer?.licesensResponse?.licensure_states?.length", allProfession, fetcheddt)
    const fetchLicenses = useCallback(async () => {
        if (!allProfession || !fetcheddt || AuthReducer?.licesensResponse?.licensure_states?.length > 0) {
            return;
        }
        const professionString = `${allProfession.profession} - ${allProfession.profession_type}`;
        console.log(professionString, "professionString--------");
        try {
            await connectionrequest();
            dispatch(licesensRequest(professionString));
        } catch (err) {
            showErrorAlert('Please connect to Internet', err);
        }
    }, [allProfession, fetcheddt, AuthReducer?.licesensResponse?.licensure_states]);

    useEffect(() => {
        fetchLicenses();
    }, [fetchLicenses]);
    if (status == '' || AuthReducer.status != status) {
        switch (AuthReducer.status) {
            case 'Auth/licesensRequest':
                status = AuthReducer.status;
                break;
            case 'Auth/licesensSuccess':
                status = AuthReducer.status;
                const uniqueStates = AuthReducer?.licesensResponse?.licensure_states?.filter((state, index, self) =>
                    index === self.findIndex((s) => s.id === state.id)
                );
                const filteredStates = uniqueStates?.filter((state) =>
                    !fetcheddt?.some((dash) => dash.state_id === state.id)
                );
                setStateCount(filteredStates);
                break;
            case 'Auth/licesensFailure':
                status = AuthReducer.status;
                break;
        }
    }
    const styles = StyleSheet.create({
        container: {
            width: normalize(300),
            marginTop: normalize(10),
            backgroundColor: "#FFFFFF",
            borderRadius: normalize(12),
            alignSelf: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
            overflow: 'hidden',
            paddingVertical: normalize(10)
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: normalize(15),
            paddingVertical: normalize(1),
        },
        sectionLabel: {
            fontFamily: Fonts.InterRegular,
            fontSize: 12,
            color: "#777777",
            // fontWeight: "bold"
        },
        stateName: {
            fontFamily: Fonts.InterSemiBold,
            fontSize: 18,
            color: "#000",
            fontWeight: "bold"
        },
        logo: {
            height: normalize(40),
            width: normalize(40),
            resizeMode: "contain",
        },
        divider: {
            height: 1,
            backgroundColor: '#F0F0F0',
            marginVertical: 10,
        },
        labelText: {
            fontFamily: Fonts.InterMedium,
            fontSize: 12,
            color: '#777',
            // fontWeight: "bold"
        },

        valueText: {
            fontFamily: Fonts.InterSemiBold,
            fontSize: 14,
            color: '#000',
            fontWeight: "bold"
        },
        bottomRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        cmeButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#EAF5FF",
            paddingHorizontal: normalize(15),
            paddingVertical: normalize(10),
            borderBottomLeftRadius: normalize(12),
            borderBottomRightRadius: normalize(12),
            borderTopEndRadius: normalize(12),
            top: normalize(10)
        },
        cmeText: {
            color: '#264092',
            fontSize: 13,
            fontFamily: Fonts.InterSemiBold,
            fontWeight: "bold"
        },
        cmeIcon: {
            backgroundColor: Colorpath.ButtonColr,
            height: normalize(18),
            width: normalize(18),
            borderRadius: normalize(9),
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 6,
        },
        expiryWarning: {
            flexDirection: "row",
            alignItems: "center",
        },
        warnIcon: {
            height: normalize(15),
            width: normalize(15),
            resizeMode: "contain",
        },
        countdownText: {
            fontFamily: Fonts.InterSemiBold,
            fontSize: 12,
            color: '#FF0000',
            marginLeft: 4,
            width: normalize(80),
            fontWeight: "bold"

        },
        update: {
            color: Colorpath.ButtonColr,
            fontFamily: Fonts.InterSemiBold,
            fontSize: 13,
            fontWeight: "bold"
        },
        active: {
            color: "#2cad21",
            fontFamily: Fonts.InterSemiBold,
            fontSize: 13,
            fontWeight: "bold"
        },
        renew: {
            color: Colorpath.black,
            fontFamily: Fonts.InterSemiBold,
            fontSize: 13,
            fontWeight: "bold"
        },
        updateRenew: {
            flexDirection: 'row',
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: normalize(2),
            height: normalize(40),
            width: normalize(300),
            backgroundColor: "#FFE0E0",
            borderBottomStartRadius: normalize(12),
            borderBottomEndRadius: normalize(12),
            paddingHorizontal: normalize(15),
        },
        activebody: {
            flexDirection: 'row',
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: normalize(2),
            height: normalize(40),
            width: normalize(300),
            backgroundColor: "#deefd9",
            borderBottomStartRadius: normalize(12),
            borderBottomEndRadius: normalize(12),
            paddingHorizontal: normalize(15),
        },
        renewRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: normalize(5),
        },
        arrowCircleBlack: {
            backgroundColor: Colorpath.black,
            height: normalize(15),
            width: normalize(15),
            borderRadius: normalize(15),
            justifyContent: "center",
            alignItems: "center",
        },
        progressContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
            marginLeft: normalize(15),
            paddingVertical: normalize(5),
        },
        progressBar: {
            height: 2,
            width: (windowWidth * 0.3 - 40) / 10,
            // backgroundColor: "#DADADA",
        },
    });
    const handleOpenRenewalLink = (renewallink) => {
        if (renewallink && typeof renewallink === 'string' && renewallink.trim() !== '') {
            Linking.openURL(renewallink)
                .catch(err => Alert.alert('Error', 'Failed to open the URL: ' + err.message));
        } else {
            Alert.alert('Invalid URL', 'The renewal link is not available or is invalid.');
        }
    };
    console.log("item------allll", expireDate,finddata)
    useEffect(() => {
        if (val == index) {
            const targetDate = item?.to_date ? new Date(item.to_date) : null;
            const today = new Date();
            console.log(targetDate, today, "dfgrfghfh--------,", item, (moment(today).format("YYYY-MM-DD") > "2025-03-11"))
            if (targetDate) {
                const ninetyDaysBefore = new Date(targetDate);
                ninetyDaysBefore.setDate(targetDate.getDate() - 90);
                if (moment(today).format("YYYY-MM-DD") > item.to_date) {
                    setDashMod(true);
                }
                if (today > targetDate) {
                    setTakeName(item?.board_name);
                    setExpireDate(true);
                    setCountdownMessage('');
                } else {
                    const differenceMs = targetDate - today;
                    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
                    if (differenceDays == 89) {
                        // setDashMod(true);
                        setTakeName(item?.board_name);
                        setExpireDate(true);
                        setCountdownMessage('Renew & Update');
                    } else if (differenceDays < 89) {
                        // setDashMod(true);
                        setTakeName(item?.board_name);
                        setExpireDate(true);
                        setCountdownMessage(`${differenceDays}`);
                    } else {
                        // setDashMod(false);
                        setExpireDate(false);
                        setCountdownMessage(`${differenceDays}`);
                    }
                }
            } else {
                // setDashMod(true);
                setTakeName(item?.board_name);
                // setExpireDate(false);
                setCountdownMessage('');
            }
        }
    }, [item?.to_date, val, index]);
    console.log(item, item?.credits_data?.total_general_credits, "item------allll", expireDate)
    return (
        <>
            <View style={styles.container}>
                <View style={styles.infoRow}>
                    <View>
                        <Text style={styles.sectionLabel}>{allProfTake ? "State Medical Board" : "State Nursing Board"}</Text>
                        <Text style={styles.stateName}>{item?.state_name}</Text>
                    </View>
                    <Image
                        source={{ uri: `${DashboardReducer?.dashboardResponse?.data?.licensure_logo_path}${item?.licensure_logo}` }}
                        style={styles.logo}
                    />
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <Text style={styles.labelText}>{"License #"}</Text>
                    <Text style={[styles.labelText, { marginRight:Platform.OS === 'ios'?normalize(25):normalize(20) }]}>{"Expiration"}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={[styles.valueText, { textTransform: "uppercase" }]}>{item?.license_number}</Text>
                    <Text style={styles.valueText}>{moment(item?.to_date).format('MMM DD, YYYY')}</Text>
                </View>
                <View style={styles.bottomRow}>
                    {bothNoRequirement ? <></> : <Pressable onPress={() => setCMECard(true)} style={styles.cmeButton}>
                        <Text style={styles.cmeText}>{allProfTake ? "My CME Requirements" : "My CE Requirements"}</Text>
                        <View style={styles.cmeIcon}>
                            <ArrowNeed name="arrow-right" color="#FFFFFF" size={12} />
                        </View>
                    </Pressable>}
                    {/* {!expireDate ? <View style={[styles.expiryWarning, { marginLeft: bothNoRequirement ? normalize(198) : 0 }]}>
                        <Image source={Imagepath.WarnImg} style={styles.warnIcon} />
                        <Text style={styles.countdownText}>{`License Expires in ${countdownMessage} Days`}</Text>
                    </View> : null} */}
                </View>
                {expireDate ? <View style={{ justifyContent: "center", alignItems: "center", top: normalize(9) }}>
                    <View style={styles.updateRenew}>
                        <Pressable onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "AddLicense", params: { myTaskask: { addLic: item, Back: "TabNav" } } }] }))}>
                            <Text style={styles.update}>{"Update"}</Text>
                        </Pressable>
                        <Pressable style={styles.renewRow} onPress={() => handleOpenRenewalLink(renewal)}>
                            <Text style={styles.renew}>{"Renew State License"}</Text>
                            <View style={styles.arrowCircleBlack}>
                                <ArrowNeed name={"arrow-up-right"} color={"#FFFFFF"} size={12} />
                            </View>
                        </Pressable>
                    </View>
                </View> : <View style={{ justifyContent: "center", alignItems: "center", top: normalize(9) }}>
                    <View style={styles.activebody}>
                        <Text style={styles.renew}>{"License Status"}</Text>
                        <Text style={styles.active}>{"Active"}</Text>
                        {/* <View style={styles.arrowCircleBlack}>
                                <ArrowNeed name={"arrow-up-right"} color={"#FFFFFF"} size={12} />
                            </View> */}
                    </View>
                </View>}
                {expireDate ? <Modal
                    isVisible={dashMod}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    backdropTransitionOutTiming={0}
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    style={stylesmodal.modal}
                >
                    <View style={stylesmodal.container}>
                        <View style={{ justifyContent: "center", alignItems: "center", flexWrap: 'nowrap' }}>
                            <Text style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 16,
                                color: Colorpath.black,
                                textAlign: 'center',
                                fontWeight: "bold"
                            }}>
                                {takeName}
                            </Text>
                        </View>
                        <View style={{ marginTop: normalize(5) }}>
                            <View style={{ height: Platform.OS === "ios" ? 1 : 0.4, width: normalize(280), backgroundColor: Colorpath.ButtonColr }} />
                        </View>
                        {allProfTake ? <View style={{ marginTop: normalize(5), justifyContent: "center", alignItems: "center", flexWrap: 'nowrap' }}>
                            <Text style={stylesmodal.content}>
                                {"Your state license has expired. To maintain access and meet state board credit requirements, please update your license. "}
                                <Text
                                    style={stylesmodal.underct}
                                    onPress={() => {
                                        clearContextData();
                                        setFinddata("");
                                        setExpireDate(!expireDate);
                                        setDashMod(false);
                                        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "AddLicense", params: { myTaskask: { addLic: item, Back: "TabNav" } } }] }));
                                    }}
                                >
                                    {"Click here"}
                                </Text>
                                {" to upload your updated license."}
                            </Text>
                        </View> : <View style={{ marginTop: normalize(5), justifyContent: "center", alignItems: "center", flexWrap: 'nowrap' }}>
                            <Text style={stylesmodal.content}>
                                {"You haven't added your state license yet. To maintain access and meet state board credit requirements, please add your license."}
                                <Text
                                    style={stylesmodal.underct}
                                    onPress={() => {
                                        setExpireDate(!expireDate);
                                        setDashMod(false);
                                        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "AddLicense", params: { myTaskask: { addLic: item, Back: "TabNav" } } }] }));
                                    }}
                                >
                                    {"Click here"}
                                </Text>
                                {" to add your license."}
                            </Text>
                        </View>}
                    </View>
                </Modal> : null}
            </View>
            {/* {bothNoRequirement ? <></> : <View style={{ justifyContent: "center", alignItems: "center", marginLeft: normalize(0) }}>
                <TouchableOpacity onPress={() => setCMECard(true)} style={{ flexDirection: "row", gap: normalize(10), justifyContent: "center", alignItems: "center", height: normalize(41), width: normalize(250), backgroundColor: "#FFEDCA", borderBottomLeftRadius: normalize(20), borderBottomRightRadius: normalize(20) }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: Colorpath.ButtonColr, fontWeight: "bold", alignItems: "center" }}>{allProfTake ? "Check CME Requirements" : "Check CE Requirements"}</Text>
                    <Image source={Imagepath.WrongArrw} style={{ height: normalize(13), width: normalize(13), resizeMode: "contain", tintColor: Colorpath.ButtonColr }} />
                </TouchableOpacity>
            </View>} */}
            {CMEcard && <CMECard expiryno={expireDate} finalSumCred={finalSumCred} manWrng={manWrng} genWrng={genWrng} allProfTake={allProfTake} windowWidth={windowWidth} CMEcard={CMEcard} setCMECard={setCMECard} item={item} styles={styles} />}
        </>
    );
}

export default Carouselcarditem
const stylesmodal = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    container: {
        width: normalize(280),
        backgroundColor: Colorpath.white,
        borderRadius: normalize(10),
        padding: normalize(20),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: "center",
        borderWidth: 1,
        borderColor: Colorpath.ButtonColr
    },
    content: {
        fontFamily: Fonts.InterMedium,
        fontSize: 16,
        color: Colorpath.black,
        textAlign: 'center',
    },
    underct: {
        fontFamily: Fonts.InterMedium,
        fontSize: 16,
        color: Colorpath.ButtonColr,
        textAlign: 'center',
        textDecorationLine: "underline"
    }
});