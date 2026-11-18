/**
 * Boardvaultcomponent screen module. Renders a React Native screen or a screen-scoped support component. Exported members: Boardvaultcomponent, checkProfile, cleanNumber, stylefalse.
 */

import { View, Text, TouchableOpacity, Linking, ActivityIndicator, StyleSheet, Image, Animated, Easing, Platform, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colorpath from '../../Themes/Colorpath';
import CustomTextField from '../../Components/CustomTextfiled';
import normalize from '../../Utils/Helpers/Dimen';
import Buttons from '../../Components/Button';
import Fonts from '../../Themes/Fonts';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import ErrorIcon from 'react-native-vector-icons/MaterialIcons';;
import moment from 'moment';
import BoardVaultModal from './BoardVaultModal';
import Imagepath from '../../Themes/Imagepath';
import { useSelector } from 'react-redux';
import ArrowNeed from 'react-native-vector-icons/Feather';
import Search from 'react-native-vector-icons/AntDesign';

/**
 * Reusable Boardvaultcomponent component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const Boardvaultcomponent = ({ takeID, handleBoardname, lengthcheck, certificateboard, setCertificatebaord, setBoardname, setBoardexpiredate, boardexpiredate, gencredit, gentopiccredit, mantopiccredit, mancredit, totalCredit, licesense, boardname, isfocused, loadingStatewise, setLoadingStatewise, loadingCreditwise, setLoadingCreditwise, expireDatecredit, countdownMessagecredit, stateid, navigation, statewise, searchtexttopic, searchTopicName, clisttopic, setStatepick, styles, statepick, setStateid, setStatewise, dispatch, hideCertificateAction }) => {
    const [currentProfile, setCurrentProfile] = useState('');
    useEffect(() => {
                /**
 * Check profile utility.
 *
 * @async
 * @returns {Promise<*>}
 */
const checkProfile = async () => {
            try {
                const profile = await AsyncStorage.getItem("activeProfile");
                setCurrentProfile(profile || '');
            } catch (e) {
                console.log(e);
            }
        };
        if (isfocused) {
            checkProfile();
        }
    }, [isfocused]);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
        /**
 * Clean number utility.
 * @param {*} value - Input value.
 * @returns {number}
 */
const cleanNumber = (value) => {
        if (typeof value == 'number') return value;
        if (typeof value == 'string') {
            const num = parseFloat(value.replace(/,/g, ''));
            return isNaN(num) ? 0 : num;
        }
        return 0;
    };
    const topicEarned = Math.max(cleanNumber(certificateboard?.credits_data?.topic_earned_credits), cleanNumber(stateid?.credits_data?.topic_earned_credits));
    const topicTotal = cleanNumber(certificateboard?.credits_data?.topic_credits || stateid?.credits_data?.topic_credits);
    const generalEarned = Math.max(cleanNumber(certificateboard?.credits_data?.total_general_earned_credits), cleanNumber(stateid?.credits_data?.total_general_earned_credits));
    const generalTotal = cleanNumber(certificateboard?.credits_data?.total_general_credits || stateid?.credits_data?.total_general_credits);
    const showTotal = !!(stateid?.credits_data?.total_credits || certificateboard?.credits_data?.total_credits || totalCredit);
    const showMandatory = !((topicEarned == 0 && topicTotal == 0) || (mancredit == 0 && mantopiccredit == 0));
    const showGeneral = !((generalEarned == 0 && generalTotal == 0) || (gencredit == 0 && gentopiccredit == 0));
    // console.log(certificateboard, "1", stateid, "certificateboard", mancredit, mantopiccredit, topicEarned, topicTotal, showMandatory)


    useEffect(() => {
        if (statewise) {
            setLoadingCreditwise(true);
            setTimeout(() => {
                setStateid(stateid);
                setLoadingCreditwise(false);
            }, 1000);
        }
    }, [statewise]);
    useEffect(() => {
        setTimeout(() => {
            setStatewise(statewise);
            setLoadingStatewise(false);
        }, 1000);
    }, [isfocused]);
    const animatedboardname = useRef(new Animated.Value(1)).current;
    const scalvaluesboard = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const targetImg = boardname ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedboardname, {
                toValue: boardname ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scalvaluesboard, {
                toValue: targetImg,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [boardname]);
    console.log(stateid?.board_data, boardname, lengthcheck, "clistopic11========");
    console.log(statewise, setBoardexpiredate, boardexpiredate, "statewise==============>>>>>>>>", stateid, certificateboard)
    return (
        <View>
            {lengthcheck?.length == 0 ? (<View style={stylefalse.containercontex}>
                <View style={stylefalse.parentCardex}>
                    <View style={stylefalse.innerCardex}>
                        <View style={stylefalse.iconContainerex}>
                            <Image
                                source={Imagepath.Docment}
                                style={stylefalse.iconex}
                            />
                        </View>
                        <View style={stylefalse.textContainerex}>
                            <View style={stylefalse.headerRowex}>
                                <Text style={[stylefalse.titleex,{fontWeight:"500"}]}>{"Keep track of all Board Certifications"}</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("AddCertificate", { takeback: "back" })}>
                        <View style={stylefalse.innerCardex}>
                            <View style={stylefalse.iconContainerex}>
                                <Image
                                    source={Imagepath.Crown}
                                    style={stylefalse.iconex}
                                />
                            </View>
                            <View style={stylefalse.textContainerex}>
                                <View style={stylefalse.headerRowex}>
                                    <Text style={[stylefalse.titleex,{fontWeight:"500"}]}>{"Add your board certification(s)"}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>) : (<>
                {loadingStatewise ?
                    <ActivityIndicator
                        size="large"
                        color={Colorpath.ButtonColr}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(65)
                        }} /> : (<>
                            <View style={{ paddingVertical: normalize(10), paddingHorizontal: normalize(2), marginTop: normalize(8), marginLeft: normalize(15) }}>
                                <Animated.View style={{ opacity: animatedboardname, transform: [{ scale: scalvaluesboard }] }}>
                                    {boardname ? (
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000", fontWeight: "bold", marginLeft: normalize(0) }}>
                                            {"Licensure Board*"}
                                        </Text>
                                    ) : null}
                                </Animated.View>
                                <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5, width: "97%", marginTop: normalize(5) }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setStatepick(!statepick);
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000000", paddingVertical: 0 }}>
                                                {boardname ? boardname : "Licensure Board*"}
                                            </Text>
                                            <TouchableOpacity onPress={() => { setStatepick(!statepick); }}>
                                                <ArrowIcon name={boardname ? 'arrow-drop-up' : 'arrow-drop-down'} size={28} color={"#000000"} />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                {loadingCreditwise ? (
                                    <ActivityIndicator size="small" color={Colorpath.ButtonColr} style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: normalize(10), paddingVertical: normalize(10) }} />
                                ) : (
                                    <View style={stylefalse.cardContainer}>
                                        <View style={stylefalse.card}>
                                            {/* Header Section */}
                                            <View style={stylefalse.header}>
                                                <Image
                                                    source={{ uri: `${DashboardReducer?.dashboardResponse?.data?.cerification_logo_path}${stateid?.board_data?.certificate_logo || certificateboard?.board_data?.certificate_logo}` }}
                                                    style={stylefalse.logo}
                                                />
                                                <View style={stylefalse.headerText}>
                                                    <Text style={[stylefalse.stateText,{fontWeight:"500"}]}>{"Board"}</Text>
                                                    <Text style={stylefalse.boardText}>{stateid?.board_data?.board_name || boardname}</Text>
                                                </View>
                                            </View>

                                            <View style={stylefalse.divider} />

                                            {(stateid?.board_data?.certification_id || licesense) && <View style={stylefalse.infoRow}>
                                                <View style={{ gap: normalize(2) }}>
                                                    <Text style={[stylefalse.label,{fontWeight:"500"}]}>{"Board Certification Id #"}</Text>
                                                    <Text style={[stylefalse.value, { width: normalize(120),fontWeight:"bold",textTransform:"uppercase" }]}>{stateid?.board_data?.certification_id || licesense}</Text>
                                                </View>
                                                <View style={{ marginRight: normalize(20), gap: normalize(2) }}>
                                                    <Text style={[stylefalse.label,{fontWeight:"500"}]}>{"Expiration"}</Text>
                                                    <Text style={[stylefalse.value,{fontWeight:"bold"}]}>{stateid?.board_data?.expiry_date
                                                        ? moment(stateid.board_data.expiry_date).format('MMM DD, YYYY')
                                                        : boardexpiredate
                                                    }</Text>
                                                </View>
                                            </View>}

                                            {/* <View style={stylefalse.checklistButton}>

                                                {!expireDatecredit && <View style={{ flexDirection: "row", gap: normalize(4), right: Platform.OS === "ios" ? normalize(0) : normalize(0) }}>
                                                    <Image source={Imagepath.WarnImg} style={{ height: normalize(15), width: normalize(15), resizeMode: "contain" }} />
                                                    <Text style={[stylefalse.expireAlert, { lineHeight: normalize(12), top: Platform.OS === "ios" ? normalize(4) : normalize(2) }]}> {`Board Certification Expires in ${countdownMessagecredit} Days`}</Text>
                                                </View>}
                                            </View> */}
                                            {/* {expireDatecredit ? <View style={{ justifyContent: "center", alignItems: "center", top: normalize(12) }}>
                                                <View style={stylefalse.updateRenew}>
                                                    <Pressable style={stylefalse.renewRow} onPress={() => { Linking.openURL("https://healthri.mylicense.com/Login.aspx") }}>
                                                        <Text style={stylefalse.renew}>{"Renewal Link"}</Text>
                                                        <View style={stylefalse.arrowCircleBlack}>
                                                            <ArrowNeed name={"arrow-up-right"} color={"#FFFFFF"} size={12} />
                                                        </View>
                                                    </Pressable>
                                                </View>
                                            </View> : null} */}
                                        </View>
                                        <View style={stylefalse.footer}>
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(6), marginBottom: normalize(8) }}>
                                                <Image source={Imagepath.CreditValut} style={{ height: normalize(18), width: normalize(18), resizeMode: "contain", tintColor: "#FFFFFF" }} />
                                                <Text style={stylefalse.footerTitle}>{"MOC Credits"}</Text>
                                            </View>
                                            <View style={stylefalse.creditsRow}>
                                                {showTotal && (
                                                    <View style={{ minWidth: normalize(75), maxWidth: normalize(85), paddingRight: normalize(4) }}>
                                                        <Text style={stylefalse.creditLabel}>{"Total Required"}</Text>
                                                        <Text style={stylefalse.creditValue} numberOfLines={1}>
                                                            {stateid?.credits_data?.total_credits || certificateboard?.credits_data?.total_credits || totalCredit}
                                                        </Text>
                                                    </View>
                                                )}

                                                {showMandatory && (
                                                    <>
                                                        <View style={stylefalse.verticalDivider} />
                                                        <View style={stylefalse.creditItem}>
                                                            <Text style={stylefalse.creditLabel}>{"Mandatory"}</Text>
                                                            <View style={{ flexDirection: "row", alignItems: "baseline", flexWrap: "wrap", gap: normalize(2) }}>
                                                                <Text style={stylefalse.creditValue} numberOfLines={1}>
                                                                    {`${topicEarned} / ${topicTotal || mantopiccredit || 0}`}
                                                                </Text>
                                                                <Text style={stylefalse.earned}>
                                                                    {`earned`}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </>
                                                )}

                                                {showGeneral && (
                                                    <>
                                                        <View style={stylefalse.verticalDivider} />
                                                        <View style={stylefalse.creditItem}>
                                                            <Text style={stylefalse.creditLabel}>{"General"}</Text>
                                                            <View style={{ flexDirection: "row", alignItems: "baseline", flexWrap: "wrap", gap: normalize(2) }}>
                                                                <Text style={stylefalse.creditValue} numberOfLines={1}>
                                                                    {`${generalEarned} / ${(generalTotal || gentopiccredit || 0)}`}
                                                                </Text>
                                                                <Text style={stylefalse.earned}>
                                                                    {`earned`}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                )}
                                {!hideCertificateAction && certificateboard?.certificates?.length > 0 && <Buttons
                                    onPress={() => { navigation.navigate("CertficateHandle", { boardCert: certificateboard }); }}
                                    height={normalize(38)}
                                    width={normalize(273)}
                                    backgroundColor={Colorpath.white}
                                    borderRadius={normalize(8)}
                                    text="View Earned Credits"
                                    color={Colorpath.ButtonColr}
                                    fontSize={normalize(13)}
                                    fontFamily={Fonts.InterSemiBold}
                                    borderWidth={1}
                                    borderColor={"#BFDBFE"}
                                />}
                                <View style={{
                                    bottom: 0,
                                    right: 0,
                                    marginLeft: normalize(170),
                                    left: 0,
                                    top: 10
                                }}>
                                    <Pressable onPress={() => navigation.navigate("AddCredits", { creditvalutboard: certificateboard })} style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: normalize(34),
                                        width: normalize(130),
                                        backgroundColor: "#2896CD",
                                        borderWidth: 0.5,
                                        borderColor: "#AAAAAA",
                                        borderRadius: normalize(8),
                                        paddingHorizontal: normalize(0)
                                    }}>
                                        <View style={{ gap: normalize(5), flexDirection: "row", alignItems: "center" }}>
                                            <Search name="plus" style={{ alignSelf: "center", marginLeft: normalize(1) }} color={Colorpath.white} size={18} />
                                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: normalize(13), color: "#FFFFFF" }}>{"Add Credits"}</Text>
                                        </View>
                                    </Pressable>
                                </View>
                            </View>
                        </>
                    )}
            </>
            )}
        </View>
    )
}
/**
 * Boardvaultcomponent default export.
 *
 * @returns {*}
 */
export default Boardvaultcomponent
/**
 * Stylefalse value.
 * @returns {*}
 */
const stylefalse = StyleSheet.create({
    containercontex: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: normalize(25)
    },
    parentCardex: {
        width: normalize(290),
        borderRadius: normalize(10),
        backgroundColor: '#FFFFFF',
        padding: normalize(10),
        shadowColor: '#c3e9ff',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0.1,
        elevation: 5,
        marginBottom: normalize(10),
    },
    innerCardex: {
        flexDirection: 'row',
        height: normalize(60),
        borderRadius: normalize(10),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10),
        alignItems: 'center',
        marginBottom: normalize(10),
        borderWidth: 0.5,
        borderColor: "#AAAAAA"
    },
    iconContainerex: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(10),
    },
    iconex: {
        height: normalize(35),
        width: normalize(35),
        resizeMode: 'contain',
    },
    textContainerex: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRowex: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleex: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
    crownIconex: {
        marginLeft: normalize(5),
        height: normalize(15),
        width: normalize(15),
        resizeMode: 'contain',
    },
    infoRowex: {
        flexDirection: 'row',
        marginTop: normalize(5),
    },
    infoTextex: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#999',
        fontWeight: 'bold',
    },
    infoCountex: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#000000',
        fontWeight: 'bold',
        paddingHorizontal: normalize(5),
    },
    infoButtonex: {
        position: 'absolute',
        top: 0,
        right: 25,
    },
    infoIconex: {
        height: normalize(18),
        width: normalize(18),
        resizeMode: 'contain',
    },
    cardContainer: {
        margin: 16,
        borderRadius: normalize(12),
        overflow: 'hidden',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderTopStartRadius: normalize(12),
        borderTopEndRadius: normalize(12),
        borderBottomStartRadius: 0,
        borderBottomEndRadius: 0,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderBottomWidth: 0,
        padding: normalize(14),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: normalize(44),
        height: normalize(44),
        marginRight: normalize(12),
        resizeMode: 'contain',
    },
    headerText: {
        flex: 1,
    },
    stateText: {
        fontSize: normalize(11),
        color: '#64748B',
        fontFamily: Fonts.InterMedium,
    },
    boardText: {
        fontSize: normalize(14.5),
        fontFamily: Fonts.InterBold,
        color: '#1E293B',
        fontWeight: "600"
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: normalize(10),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(8),
    },
    label: {
        fontSize: normalize(11),
        color: '#64748B',
        fontFamily: Fonts.InterMedium,
    },
    value: {
        fontSize: normalize(13),
        color: '#1E293B',
        fontFamily: Fonts.InterSemiBold,
    },
    checklistButton: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: normalize(6),
    },
    arrowCircleBlack: {
        backgroundColor: Colorpath.black,
        height: normalize(15),
        width: normalize(15),
        borderRadius: normalize(15),
        justifyContent: "center",
        alignItems: "center",
    },
    updateRenew: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        height: normalize(38),
        width: "100%",
        backgroundColor: "#FFE0E0",
        borderRadius: normalize(8),
        paddingHorizontal: normalize(12),
    },
    renewRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: normalize(5),
    },
    checklistText: {
        color: '#1A4DB3',
        fontSize: normalize(12.5),
        fontFamily: Fonts.InterSemiBold,
    },
    expireAlert: {
        color: 'red',
        fontSize: normalize(10),
        fontFamily: Fonts.InterMedium,
        width: normalize(165),
    },
    update: {
        color: Colorpath.ButtonColr,
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(12.5),
    },
    renew: {
        color: Colorpath.black,
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(12.5),
    },
    footer: {
        backgroundColor: '#264092',
        borderBottomStartRadius: normalize(12),
        borderBottomEndRadius: normalize(12),
        paddingHorizontal: normalize(14),
        paddingVertical: normalize(12),
        overflow: 'hidden',
    },
    footerTitle: {
        color: '#fff',
        fontSize: normalize(13.5),
        fontFamily: Fonts.InterSemiBold,
    },
    creditsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
    },
    creditItem: {
        flex: 1,
        paddingHorizontal: normalize(2),
    },
    creditLabel: {
        color: "#FFFFFF",
        fontSize: normalize(10.5),
        marginBottom: normalize(2),
        fontFamily: Fonts.InterMedium,
        fontWeight: "500",
    },
    creditValue: {
        color: "#FFFFFF",
        fontSize: normalize(10.5),
        fontFamily: Fonts.InterSemiBold,
        fontWeight: "600",
    },
    earned: {
        color: "#CBD5E1",
        fontSize: normalize(8.5),
        fontFamily: Fonts.InterMedium,
        fontWeight: "500",
    },
    verticalDivider: {
        height: "80%",
        width: 1,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        marginHorizontal: normalize(4),
        alignSelf: "center",
    }
})
