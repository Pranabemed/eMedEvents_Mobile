/**
 * Check membership screen module. Renders a React Native screen or a screen-scoped support component. Exported members: PRIME_MEMBERSHIP_SKIPPED_KEY, CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION_KEY, getCountryFromIP, normalizeProfessionHandle, findMatchedProfessionHandle, buildProfessionLabel, isUsaBasedUser, CheckMembership, checkEligibility, parseStoredJson, handleClk, handlePrimeMembership, handleSkip, styles.
 */

import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform, ActivityIndicator } from 'react-native';
import React, { useLayoutEffect, useState, useContext, useEffect, useRef } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import Imagepath from '../../Themes/Imagepath';
import GradientButton from '../../Components/LinearButton';
import CrossIcon from 'react-native-vector-icons/EvilIcons';
import Buttons from '../../Components/Button';
import { CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { primeTrailRequest } from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPublicIP } from '../../Utils/Helpers/IPServer';
import constants from '../../Utils/Helpers/constants';
import { clearNonUsaFlowState } from '../../Utils/Helpers/nonUsaFlow';
import Loader from '../../Utils/Helpers/Loader';

/**
 * Reusable normalizeProfessionHandle component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const PRIME_MEMBERSHIP_SKIPPED_KEY = 'PrimeMembershipSkipped';
const PRIME_MEMBERSHIP_PROMPT_PENDING_KEY = 'PrimeMembershipPromptPending';
/**
 * Check membership force new profession key constant.
 * @returns {string}
 */
const CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION_KEY = 'CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION';

/**
 * Returns country from ip.
 *
 * @async
 * @param {*} ip - Input value.
 * @returns {Promise<*>}
 */
const getCountryFromIP = async (ip) => {
    try {
        const res = await fetch(`https://ipinfo.io/${ip}/json`);
        const text = await res.text();
        if (text.startsWith('<')) {
            throw new Error('HTML response');
        }
        const data = JSON.parse(text);
        return String(data?.country || 'unknown').trim().toUpperCase();
    } catch (e) {
        console.log('CheckMembership geo lookup failed:', e);
        return 'unknown';
    }
};

/**
 * Normalizes profession handle.
 * @param {*} professionHandle - Input value.
 * @returns {*}
 */
const normalizeProfessionHandle = (professionHandle) =>
    String(professionHandle || '')
        .toLowerCase()
        .replace(/\s+/g, '')
        .trim();

/**
 * Find matched profession handle utility.
 * @param {*} candidates - Input value.
 * @param {*} supportedHandles - Input value.
 * @returns {string}
 */
const findMatchedProfessionHandle = (candidates, supportedHandles) => {
    for (const candidate of candidates) {
        const normalizedCandidate = normalizeProfessionHandle(candidate);
        if (!normalizedCandidate) continue;

        for (const handle of supportedHandles) {
            if (normalizedCandidate === handle || normalizedCandidate.includes(handle)) {
                return handle;
            }
        }
    }
    return '';
};

/**
 * Build profession label utility.
 * @param {*} profession - Input value.
 * @param {*} professionType - Input value.
 * @returns {string}
 */
const buildProfessionLabel = (profession, professionType) => {
    const cleanProfession = String(profession || '').trim();
    const cleanProfessionType = String(professionType || '').trim();

    if (!cleanProfession || !cleanProfessionType) {
        return '';
    }

    return `${cleanProfession} - ${cleanProfessionType}`;
};

/**
 * Determines whether usa based user is true.
 * @param {*} user - Input value.
 * @param {string} ipCountryCode - Input value.
 * @returns {*}
 */
const isUsaBasedUser = (user, ipCountryCode = '') => {
    const countryId = String(
        user?.country_id ||
        user?.billing_address?.country_id ||
        user?.user_billing_address?.country_id ||
        user?.user_address?.country_id ||
        ''
    ).trim();
    const countryName = String(
        user?.country_name ||
        user?.billing_address?.country_name ||
        user?.user_billing_address?.country_name ||
        user?.user_address?.country_name ||
        ''
    ).trim().toLowerCase();
    const usaUser = String(user?.usa_user || '').trim().toLowerCase();
    const ipCountry = String(user?.ip_country || user?.country_code || '').trim().toLowerCase();
    const callingCode = String(user?.callingCode || user?.countryCode || '').trim();
    const normalizedResolvedIpCountry = String(ipCountryCode || '').trim().toLowerCase();

    if (countryId && countryId !== '1' && countryId !== '233' && countryId !== '0') {
        return false;
    }
    if (countryName && !countryName.includes('usa') && !countryName.includes('united states') && !countryName.includes('us')) {
        return false;
    }

    return (
        usaUser === '1' ||
        usaUser === 'true' ||
        countryId === '1' ||
        countryName.includes('usa') ||
        countryName.includes('united states') ||
        callingCode === '+1' ||
        normalizedResolvedIpCountry === 'us' ||
        normalizedResolvedIpCountry === 'usa' ||
        ipCountry === 'us' ||
        ipCountry === 'usa'
    );
};

/**
 * Check membership component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const CheckMembership = (props) => {
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const isGuestUserFlow = props?.route?.params?.fromGuestUser === true;
    const [isEligible, setIsEligible] = useState(props?.route?.params?.isEligible === true ? true : null);
    const pendingFreeTrialNavigationRef = useRef(false);

    useEffect(() => {
        let isMounted = true;
        /**
* Check eligibility utility.
*
* @async
* @returns {Promise<*>}
*/
        const checkEligibility = async () => {
            try {
                const skipped = await AsyncStorage.getItem(PRIME_MEMBERSHIP_SKIPPED_KEY);
                const dashboardProfessionInfo = DashboardReducer?.mainprofileResponse?.professional_information;
                const authProfessionInfo =
                    AuthReducer?.loginResponse?.user ||
                    AuthReducer?.againloginsiginResponse?.user ||
                    AuthReducer?.signupResponse?.user ||
                    AuthReducer?.verifymobileResponse?.user ||
                    AuthReducer?.verifyemailResponse?.user ||
                    {};

                const ipAddress = getPublicIP();
                const countryCode = await getCountryFromIP(ipAddress);

                const [verifyRaw, professionRaw] = await Promise.all([
                    AsyncStorage.getItem(constants.VERIFYSTATEDATA),
                    AsyncStorage.getItem(constants.PROFESSION),
                ]);

                /**
* Parses stored json.
* @param {*} value - Input value.
* @returns {void}
*/
                const parseStoredJson = (value) => {
                    if (!value) return null;
                    try {
                        return JSON.parse(value);
                    } catch (error) {
                        return null;
                    }
                };

                const verifyData = parseStoredJson(verifyRaw);
                const professionData = parseStoredJson(professionRaw);
                const verifyResponseData = AuthReducer?.verifyResponse?.user || AuthReducer?.verifyResponse || null;
                const user = verifyResponseData || verifyData || professionData || authProfessionInfo;

                const rawProfession =
                    verifyData?.profession ||
                    professionData?.profession ||
                    user?.profession ||
                    dashboardProfessionInfo?.profession ||
                    authProfessionInfo?.profession ||
                    '';
                const rawProfessionType =
                    verifyData?.profession_type ||
                    professionData?.profession_type ||
                    user?.profession_type ||
                    authProfessionInfo?.profession_type ||
                    '';

                const userProfession = (
                    rawProfession.includes(' - ')
                        ? rawProfession
                        : rawProfession && rawProfessionType
                            ? `${rawProfession} - ${rawProfessionType}`
                            : rawProfession || rawProfessionType
                ).trim();

                const allowedProfessions = [
                    "Physician - MD",
                    "Physician - DO",
                    "Physician - DPM"
                ];

                const physicianHandles = new Set(["physician-md", "physician-do", "physician-dpm"]);
                const supportedHandles = [...physicianHandles];

                const dashboardProfessionTypeStr = String(dashboardProfessionInfo?.profession_type || '').trim().toUpperCase();
                const authProfessionTypeStr = String(authProfessionInfo?.profession_type || '').trim().toUpperCase();
                const professionType = String(
                    verifyData?.profession_type ||
                    professionData?.profession_type ||
                    user?.profession_type ||
                    dashboardProfessionTypeStr ||
                    authProfessionTypeStr ||
                    ''
                ).trim().toUpperCase();

                const profFromDashboard = buildProfessionLabel(
                    String(dashboardProfessionInfo?.profession || '').trim(),
                    String(dashboardProfessionInfo?.profession_type || '').trim()
                );
                const profFromAuth = buildProfessionLabel(
                    authProfessionInfo?.profession,
                    authProfessionInfo?.profession_type
                );

                const resolvedProfessionHandle = profFromDashboard
                    ? findMatchedProfessionHandle(
                        [
                            profFromDashboard,
                            String(dashboardProfessionInfo?.profession || '').trim(),
                            `${String(dashboardProfessionInfo?.profession || '').trim()} ${String(dashboardProfessionInfo?.profession_type || '').trim()}`.trim(),
                        ],
                        supportedHandles
                    )
                    : findMatchedProfessionHandle(
                        [
                            profFromAuth,
                            `${authProfessionInfo?.profession || ''} ${authProfessionInfo?.profession_type || ''}`.trim(),
                        ],
                        supportedHandles
                    );

                const isEligibleGuestPhysician =
                    allowedProfessions.includes(userProfession) ||
                    (resolvedProfessionHandle ? physicianHandles.has(resolvedProfessionHandle) : false) ||
                    ['MD', 'DO', 'DPM'].includes(professionType);

                const isEligibleCountry =
                    countryCode === "US" ||
                    countryCode === "USA" ||
                    isUsaBasedUser(user, countryCode);

                const eligible = isEligibleCountry && isEligibleGuestPhysician;

                if (isMounted) {
                    setIsEligible(true);
                }
            } catch (error) {
                console.log('CheckMembership eligibility check error', error);
                if (isMounted) {
                    setIsEligible(true);
                }
            }
        };

        checkEligibility();
        return () => {
            isMounted = false;
        };
    }, [AuthReducer, DashboardReducer, isGuestUserFlow, props.navigation]);

    const features = [
        {
            title: 'Multi State & Board Licensure Tracking',
            regular: '4 State Boards + 2 Certification Boards'
        },
        { title: 'Personalized CME/CE Recommendations', regular: 'Curated Platform Recommendations as per Board requirements and personal preferences' },
        { title: 'CME/CE Credit reporting to State Board(s)' },
        { title: 'Centralized CME/CE Credit Vault' },
        { title: 'Credentialing Document Vault' },
        { title: 'CME/CE Expense Manager for Allowance Reimbursement' },
        { title: 'Add Credits earned elsewhere' },
        { title: 'CME/CE Planning Tool & Scheduler' },
        { title: 'Seamless Personal Calendar Integration' },
        { title: 'Exclusive discounts on selective CME/CE programs' },
        { title: 'Get license renewal & CE deadline reminders', regular: 'Email, SMS, RCS, Whatsapp' },
        { title: 'Priority Customer Service' },
    ];

    const normalfeatures = [
        {
            normaltitle: 'Multi State & Board Licensure Tracking',
            normaltext: '1 State Board + 1 Certification Board'
        },
        { normaltitle: 'Personalized CME/CE Recommendations', normaltext: 'Self-discovery' },
        { normaltitle: 'CME/CE Credit reporting to State Board(s)' },
        { normaltitle: 'Centralized CME/CE Credit Vault' },
        { normaltitle: 'Credentialing Document Vault' },
        { normaltitle: 'CME/CE Expense Manager for Allowance Reimbursement' },
        { normaltitle: 'Add Credits earned elsewhere' },
        { normaltitle: 'CME/CE Planning Tool & Scheduler' },
        { normaltitle: 'Seamless Personal Calendar Integration' },
        { normaltitle: 'Exclusive discounts on selective CME/CE programs' },
        { normaltitle: 'Get license renewal & CE deadline reminders', normaltext: 'Email' },
        { normaltitle: 'Priority Customer Service' },
    ]
    const [linearText, setLinearText] = useState(true);
    /**
* Handles clk.
* @returns {void}
*/
    const handleClk = async () => {
        pendingFreeTrialNavigationRef.current = true;
        try {
            await AsyncStorage.setItem('GuestPrimeVerificationPending', 'true');
            await AsyncStorage.removeItem('activeProfile');
            await AsyncStorage.setItem('ExploreTrialClicked', 'true');
        } catch (error) {
            console.log('handleClk flag error', error);
        }
        dispatch(primeTrailRequest({}));
    };
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, [props.navigation]);
    /**
* Handles prime membership.
* @returns {void}
*/
    const handlePrimeMembership = () => {
        (async () => {
            await AsyncStorage.setItem('activeProfile', 'PrimeCard');
            await AsyncStorage.setItem('ExploreTrialClicked', 'true');
            await AsyncStorage.setItem('PrimeCardFlowComplete', 'true');
            await AsyncStorage.setItem('PrimeMembershipSkipped', 'false');
            await AsyncStorage.removeItem('SessionPrimeSkipped');
            await AsyncStorage.removeItem(PRIME_MEMBERSHIP_PROMPT_PENDING_KEY);
            require('react-native').DeviceEventEmitter.emit('ACTIVE_PROFILE_CHANGED', 'PrimeCard');
            await clearNonUsaFlowState();
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "PrimePayment" }],
                })
            );
        })().catch(error => {
            console.log('CheckMembership prime flag error', error);
        });
    };
    /**
* Handles skip.
*
* @async
* @returns {Promise<*>}
*/
    const handleSkip = async () => {
        try {
            await AsyncStorage.setItem('PrimeCardFlowComplete', 'true');
            await AsyncStorage.setItem(PRIME_MEMBERSHIP_SKIPPED_KEY, 'true');
            await AsyncStorage.removeItem(PRIME_MEMBERSHIP_PROMPT_PENDING_KEY);
            await AsyncStorage.setItem('SessionPrimeSkipped', 'true');
            await AsyncStorage.setItem(CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION_KEY, '1');
            await AsyncStorage.setItem('activeProfile', 'SkipProfile');
            require('react-native').DeviceEventEmitter.emit('ACTIVE_PROFILE_CHANGED', 'SkipProfile');
            await clearNonUsaFlowState();
        } catch (error) {
            console.log('CheckMembership skip flag error', error);
        }

        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "TabNav", params: { initialRoute: "Home", detectmain: "newadd" } }],
            })
        );
    };

    useEffect(() => {
        if (!pendingFreeTrialNavigationRef.current) return;
        if (AuthReducer?.status !== 'Auth/primeTrailSuccess') return;
        pendingFreeTrialNavigationRef.current = false;
        (async () => {
            try {
                await AsyncStorage.setItem('activeProfile', 'PrimeCard');
                await AsyncStorage.setItem('ExploreTrialClicked', 'true');
                await AsyncStorage.setItem('PrimeCardFlowComplete', 'true');
                await AsyncStorage.setItem('PrimeMembershipSkipped', 'false');
                await AsyncStorage.removeItem('SessionPrimeSkipped');
                await AsyncStorage.removeItem(PRIME_MEMBERSHIP_PROMPT_PENDING_KEY);
                require('react-native').DeviceEventEmitter.emit('ACTIVE_PROFILE_CHANGED', 'PrimeCard');
                await clearNonUsaFlowState();
            } catch (e) {
                console.log(e);
            }
        })();
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "PrimeCard", params: { ...props?.route?.params, exploreTrialClicked: true } }],
            })
        );
    }, [AuthReducer?.status, props.navigation, props?.route?.params]);

    if (isEligible === null) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.white, justifyContent: 'center', alignItems: 'center' }}>
                <MyStatusBar barStyle={'dark-content'} backgroundColor={Colorpath.white} />
                <Loader visible={true} />
            </SafeAreaView>
        );
    }

    if (isEligible === false) {
        return null;
    }

    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.white}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.white }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{"Discover the Value of Your"}</Text>
                    <View style={{ flexDirection: "row", paddingVertical: normalize(5) }}>
                        <Image source={Imagepath.TickMark} style={{ height: normalize(20), width: normalize(30), resizeMode: "contain" }} />
                        <Text style={styles.headerText}>{"Prime Membership:"}</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingVertical: normalize(5) }}>
                        <TouchableOpacity onPress={() => { setLinearText(true); }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: normalize(16), color: linearText ? "#2C4DB9" : "#555555" }}>
                                {"Prime Member"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setLinearText(false) }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: normalize(16), color: !linearText ? "#2C4DB9" : "#555555" }}>
                                {"Regular Member"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View style={{ zIndex: 999, position: "relative", top: 3, flexDirection: "row", justifyContent: "space-evenly", marginRight: linearText ? normalize(100) : undefined, marginLeft: !linearText ? normalize(100) : undefined }}>
                            <View>
                                {linearText && <GradientButton />}
                            </View>
                            <View>
                                {!linearText && <GradientButton />}
                            </View>
                        </View>
                        <View style={{ height: 0.5, width: normalize(320), backgroundColor: "#DDDDDD" }} />
                    </View>
                    <View>
                        <ScrollView contentContainerStyle={{ paddingBottom: normalize(205) }}>

                            {linearText && <View style={styles.table}>
                                {features?.map((feature, index) => (
                                    <View key={index}>
                                        <View style={[styles.tableRow, { borderBottomWidth: 0.5, borderBottomColor: '#DDDDDD' }]}>
                                            <Text style={styles.featureTitle}>{feature?.title}</Text>
                                            <View style={styles.featureDescriptions}>
                                                {feature?.regular ? (
                                                    <Text style={[styles.feature, styles.highlight]}>{feature?.regular}</Text>
                                                ) : (
                                                    <View style={[styles.highlight, { justifyContent: 'center', alignItems: 'center' }]}>
                                                        <Image source={Imagepath.TickMark} style={{ height: normalize(10), width: normalize(20), resizeMode: 'contain' }} />
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                        <View style={{ backgroundColor: "#EAF5FF", height: 10, position: 'absolute', top: -10, right: 0, bottom: 0, width: normalize(140) }} />
                                    </View>
                                ))}
                            </View>}

                            {!linearText && <View style={styles.table}>
                                {normalfeatures?.map((feature, index) => (
                                    <View key={index}>
                                        <View style={[styles.tableRow, { borderBottomWidth: 0.5, borderBottomColor: '#DDDDDD' }]}>
                                            <Text style={styles.featureTitle}>{feature?.normaltitle}</Text>
                                            <View style={styles.featureDescriptions}>
                                                {feature?.normaltext ? (
                                                    <Text style={[styles.feature, styles.highlightnormal]}>{feature?.normaltext}</Text>
                                                ) : (
                                                    <View style={[styles.highlightnormal, { justifyContent: 'center', alignItems: 'center' }]}>
                                                        <CrossIcon name="close" color={"#000000"} size={25} />
                                                    </View>

                                                )}
                                            </View>
                                        </View>
                                        <View style={{ backgroundColor: "#F8F8F8", height: 10, position: 'absolute', top: -10, right: 0, bottom: 0, width: normalize(140) }} />
                                    </View>
                                ))}
                            </View>}
                        </ScrollView>
                    </View>
                    {!isGuestUserFlow ? (
                        <View style={styles.buttonContainer}>
                            <Buttons
                                onPress={handleClk}
                                height={normalize(45)}
                                width={normalize(288)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(5)}
                                text={isGuestUserFlow ? "Back To Home" : "Start Your  30-Day Free Trial Today!"}
                                color={Colorpath.white}
                                fontSize={16}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(-15)}
                            />
                            <Buttons
                                onPress={handlePrimeMembership}
                                height={normalize(45)}
                                width={normalize(288)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(5)}
                                text={"Get Prime Membership"}
                                color={Colorpath.white}
                                fontSize={16}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(12)}
                            />
                            <TouchableOpacity onPress={handleSkip} style={{ marginTop: normalize(16) }}>
                                <Text style={styles.skipText}>{"Skip"}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.buttonContainerOriginal}>
                            <Buttons
                                onPress={handleClk}
                                height={normalize(45)}
                                width={normalize(288)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(5)}
                                text={isGuestUserFlow ? "Back To Home" : "Start Your  30-Day Free Trial Today!"}
                                color={Colorpath.white}
                                fontSize={16}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(-15)}
                            />
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </>
    )
}
/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: Platform.OS === 'ios' ? normalize(20) : normalize(10),
        flexDirection: 'column'
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(24),
        color: "#171717",
        fontWeight: "bold"
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    membershipTypes: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    membershipType: {
        fontSize: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: 'gray',
    },
    activeMember: {
        color: 'blue',
        fontWeight: 'bold',
    },
    tabIndicator: {
        height: 2,
        width: '100%',
        backgroundColor: '#ddd',
        marginTop: -5,
        marginBottom: 15,
        position: 'relative',
    },
    table: {
        width: '100%',
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(20),
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    featureTitle: {
        flex: 2,
        fontSize: 14,
        color: 'black',
        textAlign: 'left',
    },
    featureDescriptions: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    feature: {
        fontSize: 14,
        color: "#000000",
        textAlign: 'center',
        fontFamily: Fonts.InterMedium
    },
    highlight: {
        backgroundColor: '#E8F3FF',
        padding: normalize(20),
        color: 'black',
        textAlign: 'center',
        flex: 1,
    },
    highlightnormal: {
        backgroundColor: '#F8F8F8',
        padding: normalize(20),
        color: 'black',
        textAlign: 'center',
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        height: normalize(180),
        bottom: -20,
        left: 0,
        right: 0,
        backgroundColor: Colorpath.white,
        borderColor: "#DDDDDD",
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: normalize(20),
    },
    skipText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(18),
        color: "#000000",
        fontWeight: "bold",
    },
    buttonContainerOriginal: {
        position: 'absolute',
        height: normalize(100),
        bottom: -40,
        left: 0,
        right: 0,
        backgroundColor: Colorpath.white,
        borderColor: "#DDDDDD",
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: normalize(20),
    },
    loadingContainer: {
        position: 'absolute',
        height: normalize(100),
        bottom: -40,
        left: 0,
        right: 0,
        backgroundColor: Colorpath.white,
        borderColor: "#DDDDDD",
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: normalize(20),
    },
});
/**
 * Check membership default export.
 *
 * @returns {*}
 */
export default CheckMembership;
