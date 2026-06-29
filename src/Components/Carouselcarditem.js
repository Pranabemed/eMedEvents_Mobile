import { View, Text, StyleSheet, Dimensions, Platform, Linking, Alert, Image, Pressable, InteractionManager } from 'react-native'
import React, { useCallback, useContext, useEffect, useState, useRef } from 'react'
import Colorpath from '../Themes/Colorpath';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';
import moment from 'moment';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../Utils/Helpers/constants';
import showErrorAlert from '../Utils/Helpers/Toast';
import { licesensRequest } from '../Redux/Reducers/AuthReducer';
import connectionrequest from '../Utils/Helpers/NetInfo';
import Modal from 'react-native-modal'
import CMECard from './CMECard';
import ArrowNeed from 'react-native-vector-icons/Feather';
import { AppContext } from '../Screen/GlobalSupport/AppContext';

/**
 * Reusable Carouselcarditem component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
let status = "";
const Carouselcarditem = ({ setStateCount, fetcheddt, item, navigation, renewal, val, index }) => {
    const {
        setExpireDate,
        setFinddata,
        clearContextData
    } = useContext(AppContext);
    const windowWidth = Dimensions.get('window').width;
    const AuthReducer = useSelector(state => state.AuthReducer);
    const [finalverifyvault, setFinalverifyvault] = useState(null);
    const [finalProfession, setFinalProfession] = useState(null);
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const [CMEcard, setCMECard] = useState(false)
    const [isItemExpired, setIsItemExpired] = useState(false);
    const [isExpiringSoon, setIsExpiringSoon] = useState(false);
    const [dashMod, setDashMod] = useState(false);
    const [countdownMessage, setCountdownMessage] = useState('');
    const [takeName, setTakeName] = useState("");
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const dashboardProfessionInfo = DashboardReducer?.mainprofileResponse?.professional_information;
    const dashboardProfession = String(dashboardProfessionInfo?.profession || '').trim();
    const dashboardProfessionType = String(dashboardProfessionInfo?.profession_type || '').trim();
    const validHandles = new Set(["Physician - MD", "Physician - DO", "Physician - DPM"]);
    const profFromDashboard =
        dashboardProfession && dashboardProfessionType
            ? `${dashboardProfession} - ${dashboardProfessionType}`
            : '';
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
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            }, 100);
        };

        token_handle_vault();
    }, [navigation, isFocus]);
    // Reset status on focus so licesensSuccess is re-processed after tab switch
    useEffect(() => {
        status = "";
    }, [isFocus]);
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
    const isEmptyLike = (value) => {
        if (value == null) return true;
        if (typeof value == 'string') {
            const cleaned = value.trim().toLowerCase();
            if (cleaned == '') return true;
            if (['null', 'undefined', 'n/a', 'na', '-', '--', '0'].includes(cleaned)) return true;
            // Treat strings with no alphanumeric content as empty placeholders.
            if (!/[a-z0-9]/i.test(cleaned)) return true;
        }
        return false;
    };
    const isInvalidExpireDays = (value) => {
        if (isEmptyLike(value)) return true;
        const parsed = Number(value);
        return Number.isNaN(parsed) || parsed <= 0;
    };
    const isZeroDate = (value) =>
        typeof value == 'string' && (value.trim() == '0000-00-00' || value.trim() == '0000-00-00 00:00:00');

    const isMissingLicenseData =
        isEmptyLike(item?.license_number) &&
        (isZeroDate(item?.to_date) || !item?.to_date);

    const isActiveCard = val == index;
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
    const fetchLicenses = useCallback(async () => {
        if (
            !dashboardProfession ||
            !dashboardProfessionType ||
            !fetcheddt ||
            AuthReducer?.licesensResponse?.licensure_states?.length > 0
        ) {
            return;
        }
        const professionString = `${dashboardProfession} - ${dashboardProfessionType}`;
        try {
            await connectionrequest();
            dispatch(licesensRequest(professionString));
        } catch (err) {
            showErrorAlert('Please connect to Internet', err);
        }
    }, [dashboardProfession, dashboardProfessionType, fetcheddt, AuthReducer?.licesensResponse?.licensure_states]);

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
    // --- Derived expiry logic (no useEffect timing issues) ---
    const parsedExpiry = moment(item?.to_date, ["YYYY-MM-DD", "MM-DD-YYYY", "DD-MM-YYYY", "MM/DD/YYYY", moment.ISO_8601], true);
    const isExpiryValid = parsedExpiry.isValid();
    const formattedExpiry = isExpiryValid ? parsedExpiry.format('MMM DD, YYYY') : "N/A";
    useEffect(() => {
        let interactionPromise = null;
        let timeoutId = null;

        if (isActiveCard) {
            const today = moment().startOf('day');
            let isExpired = false;
            let isWarning = false;
            let message = '';

            if (isMissingLicenseData || !item?.to_date || !isExpiryValid) {
                isExpired = true;
                isWarning = true;
            } else {
                const targetDate = parsedExpiry.clone().startOf('day');
                if (today.isAfter(targetDate, 'day')) {
                    isExpired = true;
                    isWarning = true;
                } else {
                    const differenceDays = targetDate.diff(today, 'days');
                    isExpired = false;
                    isWarning = differenceDays < 90;
                    message = differenceDays === 89 ? 'Renew & Update' : `${differenceDays}`;
                }
            }

            setTakeName(item?.board_name || '');
            setIsItemExpired(isExpired);
            setIsExpiringSoon(isWarning);
            setExpireDate(isExpired);
            setCountdownMessage(message);

            if (isExpired) {
                if (isFocus) {
                    interactionPromise = InteractionManager.runAfterInteractions(() => {
                        timeoutId = setTimeout(() => {
                            setDashMod(true);
                        }, Platform.OS === 'ios' ? 800 : 300);
                    });
                }
            } else {
                setDashMod(false);
            }
        } else {
            setIsExpiringSoon(false);
            setDashMod(false);
        }

        return () => {
            if (interactionPromise) {
                interactionPromise.cancel();
            }
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [item?.to_date, item?.from_date, item?.expiry_date, item?.license_number, item?.license_expire_days, item?.board_name, isActiveCard, isExpiryValid, isMissingLicenseData, isFocus, parsedExpiry, setExpireDate]);
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
                    <Text style={[styles.labelText, { marginRight: Platform.OS === 'ios' ? normalize(25) : normalize(20) }]}>{"Expiration"}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={[styles.valueText, { textTransform: "uppercase" }]}>{item?.license_number}</Text>
                    <Text style={styles.valueText}>{formattedExpiry}</Text>
                </View>
                <View style={styles.bottomRow}>
                    {bothNoRequirement ? <></> : <Pressable onPress={() => setCMECard(true)} style={styles.cmeButton}>
                        <Text style={styles.cmeText}>{allProfTake ? "My CME Requirements" : "My CE Requirements"}</Text>
                        <View style={styles.cmeIcon}>
                            <ArrowNeed name="arrow-right" color="#FFFFFF" size={12} />
                        </View>
                    </Pressable>}
                </View>
                {isExpiringSoon ? <View style={{ justifyContent: "center", alignItems: "center", top: normalize(9) }}>
                    <View style={styles.updateRenew}>
                        <Pressable onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "AddLicense", params: { myTaskask: { addLic: item, Back: "TabNav" } } }] }))}>
                            <Text style={styles.update}>{"Update"}</Text>
                        </Pressable>
                        <Pressable style={styles.renewRow} onPress={() => handleOpenRenewalLink(renewal)}>
                            <Text style={styles.renew}>{"Renew State Licenses"}</Text>
                            <View style={styles.arrowCircleBlack}>
                                <ArrowNeed name={"arrow-up-right"} color={"#FFFFFF"} size={12} />
                            </View>
                        </Pressable>
                    </View>
                </View> : <View style={{ justifyContent: "center", alignItems: "center", top: normalize(9) }}>
                    <View style={styles.activebody}>
                        <Text style={styles.renew}>{"License Status"}</Text>
                        <Text style={styles.active}>{"Active"}</Text>
                    </View>
                </View>}
                <Modal
                    isVisible={dashMod && isItemExpired && isActiveCard}
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
                        {!isMissingLicenseData && allProfTake ? <View style={{ marginTop: normalize(5), justifyContent: "center", alignItems: "center", flexWrap: 'nowrap' }}>
                            <Text style={stylesmodal.content}>
                                {"Your state license has expired. To maintain access and meet state board credit requirements, please update your license. "}
                                <Text
                                    style={stylesmodal.underct}
                                    onPress={() => {
                                        clearContextData();
                                        setFinddata("");
                                        setExpireDate(false);
                                        setIsItemExpired(false);
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
                                        setExpireDate(false);
                                        setIsItemExpired(false);
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
                </Modal>

            </View>
            {CMEcard && <CMECard expiryno={isItemExpired} finalSumCred={finalSumCred} manWrng={manWrng} genWrng={genWrng} allProfTake={allProfTake} windowWidth={windowWidth} CMEcard={CMEcard} setCMECard={setCMECard} item={item} styles={styles} />}
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
