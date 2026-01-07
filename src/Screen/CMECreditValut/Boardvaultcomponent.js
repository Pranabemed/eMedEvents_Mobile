import { View, Text, TouchableOpacity, Linking, ActivityIndicator, StyleSheet, Image, Animated, Easing, Platform, Pressable } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Colorpath from '../../Themes/Colorpath';
import CustomTextField from '../../Components/CustomTextfiled';
import normalize from '../../Utils/Helpers/Dimen';
import Buttons from '../../Components/Button';
import Fonts from '../../Themes/Fonts';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import ErrorIcon from 'react-native-vector-icons/MaterialIcons';;
import moment from 'moment';
import BoardVaultModal from './BoardVaultModal';
import { CommonActions } from '@react-navigation/native';
import Imagepath from '../../Themes/Imagepath';
import { useSelector } from 'react-redux';
import ArrowNeed from 'react-native-vector-icons/Feather';
import Search from 'react-native-vector-icons/AntDesign';
const Boardvaultcomponent = ({ takeID, handleBoardname, lengthcheck, certificateboard, setCertificatebaord, setBoardname, setBoardexpiredate, boardexpiredate, gencredit, gentopiccredit, mantopiccredit, mancredit, totalCredit, licesense, boardname, isfocused, loadingStatewise, setLoadingStatewise, loadingCreditwise, setLoadingCreditwise, expireDatecredit, countdownMessagecredit, stateid, navigation, statewise, searchtexttopic, searchTopicName, clisttopic, setStatepick, styles, statepick, setStateid, setStatewise, dispatch }) => {
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const cleanNumber = (value) => {
        if (typeof value == 'number') return value;
        if (typeof value == 'string') {
            const num = parseFloat(value.replace(/,/g, ''));
            return isNaN(num) ? 0 : num;
        }
        return 0;
    };
    const topicEarned = cleanNumber(stateid?.credits_data?.topic_earned_credits || certificateboard?.credits_data?.topic_earned_credits);
    const topicTotal = cleanNumber(stateid?.credits_data?.topic_credits || certificateboard?.credits_data?.topic_credits);
    const generalEarned = cleanNumber(stateid?.credits_data?.total_general_earned_credits || certificateboard?.credits_data?.total_general_earned_credits);
    const generalTotal = cleanNumber(stateid?.credits_data?.total_general_credits || certificateboard?.credits_data?.total_general_credits);
    const showTotal = !!(stateid?.credits_data?.total_credits || totalCredit);
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
                    <TouchableOpacity onPress={() => { navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "AddCertificate", params: { takeback: "back" } }] })); }}>
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
                            <View style={{ paddingVertical: normalize(10), paddingHorizontal: normalize(2), marginTop: normalize(10), marginLeft: normalize(15) }}>
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
                                            <View style={{ flexDirection: "row", gap: normalize(5), paddingHorizontal: normalize(10), paddingVertical: normalize(20), top: normalize(5) }}>
                                                <Image source={Imagepath.CreditValut} style={{ height: normalize(20), width: normalize(20), resizeMode: "contain", tintColor: "#FFFFFF" }} />
                                                <Text style={[stylefalse.footerTitle, { marginTop: Platform.OS === "ios" ? normalize(4) : normalize(0) }]}>{"MOC Credits"}</Text>
                                            </View>
                                            <View style={[stylefalse.creditsRow, { top: Platform.OS === "ios" ? normalize(8) : 0 }]}>
                                                {showTotal && (
                                                    <View style={{ width: normalize(85) }}>
                                                        <Text style={[stylefalse.creditLabel, { marginLeft: normalize(10),fontWeight:"500" }]}>{"Total Required"}</Text>
                                                        <Text style={[stylefalse.creditValue, { marginLeft: normalize(10),fontWeight:"500" }]} numberOfLines={1}>
                                                            {stateid?.credits_data?.total_credits || totalCredit}
                                                        </Text>
                                                    </View>
                                                )}

                                                {showMandatory && (
                                                    <>
                                                        <View style={[stylefalse.verticalDivider, { marginRight: normalize(10) }]} />
                                                        <View style={stylefalse.creditItem}>
                                                            <Text style={stylefalse.creditLabel}>{"Mandatory"}</Text>
                                                            <View style={{ flexDirection: "row", gap: normalize(3) }}>
                                                                <Text style={stylefalse.creditValue} numberOfLines={1}>
                                                                    {`${stateid?.credits_data?.topic_earned_credits || mancredit} / ${stateid?.credits_data?.topic_credits || mantopiccredit}`}
                                                                </Text>
                                                                <Text style={[stylefalse.earned, { marginTop: normalize(4) }]}>
                                                                    {`earned`}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </>
                                                )}

                                                {showGeneral && (
                                                    <>
                                                        <View style={[stylefalse.verticalDivider, { marginRight: normalize(10) }]} />
                                                        <View style={stylefalse.creditItem}>
                                                            <Text style={stylefalse.creditLabel}>{"General"}</Text>
                                                            <View style={{ flexDirection: "row", gap: normalize(3) }}>
                                                                <Text style={stylefalse.creditValue} numberOfLines={1}>
                                                                    {`${stateid?.credits_data?.total_general_earned_credits || gencredit} / ${(stateid?.credits_data?.total_general_credits || gentopiccredit)}`}
                                                                </Text>
                                                                <Text style={[stylefalse.earned, { marginTop: normalize(4) }]}>
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
                                {certificateboard?.certificates?.length > 0 && <Buttons
                                    onPress={() => { navigation.navigate("CertficateHandle", { boardCert: certificateboard }); }}
                                    height={normalize(45)}
                                    width={normalize(273)}
                                    backgroundColor={Colorpath.white}
                                    borderRadius={normalize(7)}
                                    text="View Earned Certificates"
                                    color={Colorpath.ButtonColr}
                                    fontSize={16}
                                    fontFamily={Fonts.InterSemiBold}
                                    borderWidth={0}
                                    borderColor={Colorpath.ButtonColr}
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
                                        height: normalize(35),
                                        width: normalize(140),
                                        backgroundColor: "#2896CD",
                                        borderWidth: 0.5,
                                        borderColor: "#AAAAAA",
                                        borderRadius: normalize(10),
                                        paddingHorizontal: normalize(0)
                                    }}>
                                        <View style={{ gap: normalize(5), flexDirection: "row" }}>
                                            <Search name="plus" style={{ alignSelf: "center", marginLeft: normalize(1) }} color={Colorpath.white} size={20} />
                                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 15, color: "#FFFFFF" }}>{"Add Credits"}</Text>
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
export default Boardvaultcomponent
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
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderTopStartRadius: normalize(15),
        borderTopEndRadius: normalize(15),
        borderBottomStartRadius: normalize(15),
        borderBottomEndRadius: normalize(15),
        padding: 16,
        zIndex: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 48,
        height: 48,
        marginRight: 12,
        resizeMode: 'contain',
    },
    headerText: {
        flex: 1,
    },
    stateText: {
        fontSize: 12,
        color: '#777777',
        fontFamily: Fonts.InterMedium,
    },
    boardText: {
        fontSize: 18,
        fontFamily: Fonts.InterBold,
        color: '#000000',
        fontWeight: "bold"
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        color: '#777777',
        fontFamily: Fonts.InterMedium,
    },
    value: {
        fontSize: 14,
        color: '#000000',
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
        marginTop: normalize(2),
        height: normalize(40),
        width: normalize(295),
        backgroundColor: "#FFE0E0",
        borderBottomStartRadius: normalize(15),
        borderBottomEndRadius: normalize(15),
        paddingHorizontal: normalize(15),
    },
    renewRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: normalize(5),
    },
    checklistText: {
        color: '#1A4DB3',
        fontSize: 14,
        fontFamily: Fonts.InterSemiBold,
    },
    expireAlert: {
        color: 'red',
        fontSize: 10,
        fontFamily: Fonts.InterMedium,
        width: normalize(165),
    },
    update: {
        color: Colorpath.ButtonColr,
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
    },
    renew: {
        color: Colorpath.black,
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
    },
    footer: {
        backgroundColor: '#264092',
        marginTop: -15, // Overlap effect
        borderBottomStartRadius: normalize(15),
        borderBottomEndRadius: normalize(15),
        paddingBottom: Platform.OS === "ios" ? normalize(15) : normalize(20),
        zIndex: 1,
    },
    footerTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: Fonts.InterSemiBold,
    },
    creditsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    creditItem: {
        flex: 1, // all columns same width
        // alignItems: "center",
        // backgroundColor:"red" 
    },
    creditLabel: {
        color: "#FFFFFF",
        fontSize: 12,
        marginBottom: 4,
        fontFamily: Fonts.InterMedium,
        fontWeight:"500"
        // marginLeft:normalize(3),
        // textAlign: "center",
    },
    creditValue: {
        color: "#FFFFFF",
        fontSize: 10, // fixed size
        fontFamily: Fonts.InterSemiBold,
        fontWeight:"500"
        // textAlign: "center",
    },
    earned: {
        color: "#FFFFFF",
        fontSize: 8, // fixed size
        fontFamily: Fonts.InterSemiBold,
        textAlign: "center",
        fontWeight:"500"
    },
    verticalDivider: {
        height: "100%",
        width: 1,
        backgroundColor: "#FFFFFF",
        marginHorizontal: normalize(2),
    }
})