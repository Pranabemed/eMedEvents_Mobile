import { View, Text, TouchableOpacity, Linking, ActivityIndicator, Animated, Easing, Alert, StyleSheet, Image, Platform, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Colorpath from '../../Themes/Colorpath';
import CustomTextField from '../../Components/CustomTextfiled';
import normalize from '../../Utils/Helpers/Dimen';
import Buttons from '../../Components/Button';
import Fonts from '../../Themes/Fonts';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import ErrorIcon from 'react-native-vector-icons/MaterialIcons';;
import moment from 'moment';
import StateVaultModal from './StateVaultModal';
import { CommonActions } from '@react-navigation/native';
import Imagepath from '../../Themes/Imagepath';
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux';
import ArrowNeed from 'react-native-vector-icons/Feather';
import Search from 'react-native-vector-icons/AntDesign';
const Statevaultcomponet = ({ modalshow, setModalShow, renewalCheck, vaultState, renewalvault, cmemodal, setCmemodal, setCertificatedata, certificatedata, setBoardname, expirelicno, gencredit, gentopiccredit, mantopiccredit, mancredit, totalCredit, licesense, boardname, isfocused, loadingStatewise, setLoadingStatewise, loadingCreditwise, setLoadingCreditwise, setCreditwise, expireDatecredit, countdownMessagecredit, stateid, navigation, statewise, searchtexttopic, searchTopicName, clisttopic, setStatepick, styles, statepick, setStateid, setStatewise, creditwise, stateCourseRequest, dispatch }) => {
    const [loads, setLoads] = useState(false);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    useEffect(() => {
        if (statewise) {
            setLoadingCreditwise(true);
            setTimeout(() => {
                // setCreditwise(creditwise);
                setLoadingCreditwise(false);
            }, 1000);
        }
    }, [statewise]);
    useEffect(() => {
        setTimeout(() => {
            // setStatewise(statewise); 
            setLoadingStatewise(false);
        }, 1000);
    }, [isfocused]);
    const handleOpenRenewalLinkCred = (renewallinkf) => {
        if (renewallinkf && typeof renewallinkf === 'string' && renewallinkf.trim() !== '') {
            Linking.openURL(renewallinkf)
                .catch(err => Alert.alert('Error', 'Failed to open the URL: ' + err.message));
        } else {
            Alert.alert('Invalid URL', 'The renewal link is not available or is invalid.');
        }
    };
    const animatedValuespass = useRef(new Animated.Value(1)).current;
    const scaleValuesespass = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const targetImg = statewise ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuespass, {
                toValue: statewise ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesespass, {
                toValue: targetImg,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [statewise]);
    useEffect(() => {
        const targetImg = creditwise?.state_name ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuespass, {
                toValue: creditwise?.state_name ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesespass, {
                toValue: targetImg,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [creditwise?.state_name]);
    const allZero =
        (creditwise?.credits_data?.topic_earned_credits === 0 &&
            creditwise?.credits_data?.topic_credits === 0 &&
            (creditwise?.credits_data?.total_general_earned_credits ?? gencredit) === 0 &&
            parseFloat(creditwise?.credits_data?.total_general_credits || gentopiccredit) === 0);
    console.log(allZero, "allZero--------", creditwise, certificatedata);

    const cleanNumber = (value) => {
        if (typeof value == 'number') return value;
        if (typeof value == 'string') {
            const num = parseFloat(value.replace(/,/g, ''));
            return isNaN(num) ? 0 : num;
        }
        return 0;
    };
    const topicEarned = cleanNumber(creditwise?.credits_data?.topic_earned_credits || certificatedata?.credits_data?.topic_earned_credits);
    const topicTotal = cleanNumber(creditwise?.credits_data?.topic_credits || certificatedata?.credits_data?.topic_credits);
    const generalEarned = cleanNumber(creditwise?.credits_data?.total_general_earned_credits || certificatedata?.credits_data?.total_general_earned_credits);
    const generalTotal = cleanNumber(creditwise?.credits_data?.total_general_credits || certificatedata?.credits_data?.total_general_credits);
    const showTotal = !!(creditwise?.credits_data?.total_credits || totalCredit);
    const showMandatory = !(topicEarned == 0 && topicTotal == 0)
    const showGeneral = !((generalEarned == 0 && generalTotal == 0) || (gencredit == 0 && gentopiccredit == 0));
    return (allZero ? <View>
        <View style={{ justifyContent: "center", alignSelf: "center" }}>
            <View style={{ paddingVertical: normalize(10), marginTop: normalize(10) }}>
                <Animated.View style={{ opacity: animatedValuespass, transform: [{ scale: scaleValuesespass }] }}>
                    {statewise ? (
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000", fontWeight: "bold", marginLeft: normalize(0) }}>
                            {"Licensure State*"}
                        </Text>
                    ) : <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000", fontWeight: "bold", marginLeft: normalize(0) }}>
                        {"Licensure State*"}
                    </Text>}
                </Animated.View>
                <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5, width: "100%", marginTop: normalize(5) }}>
                    <TouchableOpacity
                        onPress={() => {
                            setStatepick(!statepick);
                            setLoads(!loads);
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000000", paddingVertical: 0,fontWeight:"500" }}>
                                {creditwise?.state_name || statewise ? creditwise?.state_name || statewise : "Select State*"}
                            </Text>
                            <TouchableOpacity onPress={() => { setStatepick(!statepick); }}>
                                <ArrowIcon name={statewise ? 'arrow-drop-up' : 'arrow-drop-down'} size={28} color={"#000000"} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    flexDirection: "column",
                    width: normalize(300),
                    borderRadius: normalize(5),
                    backgroundColor: "#FFFFFF",
                    alignItems: "flex-start",
                    shadowColor: "#000",
                    shadowOffset: { height: 0, width: 0 },
                    shadowOpacity: 5,
                    elevation: 10
                }}
            >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%', height: normalize(50), backgroundColor: "#D6EDFF" }}>
                    <Text numberOfLines={2}
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 18,
                            color: "#000000",
                            fontWeight: "bold",
                            flex: 1,
                            flexWrap: 'wrap',
                            marginLeft: normalize(10),
                            fontWeight:"500"
                        }}
                    >
                        {creditwise?.board_data?.board_name}
                    </Text>
                </View>
                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), marginTop: normalize(10), alignSelf: 'flex-start' }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#2d4dba" }}>
                        {"Your state medical board does not have any credit requirements for your license renewal."}
                    </Text>
                </View>

            </View>
        </View>
    </View> : <View>
        <>
            <>
                <View style={{ paddingVertical: normalize(10), paddingHorizontal: normalize(2), marginTop: normalize(10), marginLeft: normalize(15) }}>
                    <Animated.View style={{ opacity: animatedValuespass, transform: [{ scale: scaleValuesespass }] }}>
                        {statewise ? (
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000", fontWeight: "bold", marginLeft: normalize(0) }}>
                                {"Select Licensure State*"}
                            </Text>
                        ) : <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000", fontWeight: "bold", marginLeft: normalize(0) }}>
                            {"Select Licensure State*"}
                        </Text>}
                    </Animated.View>
                    <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5, width: "97%", marginTop: normalize(5) }}>
                        <TouchableOpacity
                            onPress={() => {
                                setStatepick(!statepick);
                            }}
                        >
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000000", paddingVertical: 0,fontWeight:"500" }}>
                                    {creditwise?.state_name || statewise ? creditwise?.state_name || statewise : "Select State*"}
                                </Text>
                                <TouchableOpacity onPress={() => { setStatepick(!statepick); }}>
                                    <ArrowIcon name={statewise ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} size={28} color={"#000000"} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    {/* <View style={styles.container}>
                            <Pressable onPress={() => { setCmemodal(!cmemodal) }} style={styles.addButton}>
                                <View style={styles.leftContent}>
                                    <Text style={styles.stateNameText}>{creditwise?.board_data?.board_name || boardname}</Text>
                                </View>
                                <Text style={[styles.addButtonText, { marginRight: normalize(10) }]}>{"CME Checklist"}</Text>
                            </Pressable>
                             <View style={styles.infoRow}>
                                <Text style={styles.labelText}>{"License #"}</Text>
                                {(creditwise?.license_number || licesense)&&<Text style={[styles.valueText,{textTransform:"uppercase"}]}>{creditwise?.license_number || licesense}</Text>}
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.labelText}>{"Expiry Date"}</Text>
                                {(creditwise?.board_data?.expiry_date || expirelicno)&&<Text style={styles.valueText}>
                                    {creditwise?.board_data?.expiry_date
                                        ? moment(creditwise.board_data.expiry_date).format('MMMM DD, YYYY')
                                        : expirelicno
                                    }
                                </Text>}
                            </View>

                            {expireDatecredit ? (<View style={styles.countdownRowUpdate}>
                                <TouchableOpacity onPress={() => {
                                    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "AddLicense", params: { myTaskask: { addLic: creditwise, creditvault: "TabNav" } } }] }));
                                }}>
                                    <Text style={{
                                        textDecorationLine: "underline",
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 13,
                                        color: "#198754"
                                    }}>{"Update"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { handleOpenRenewalLinkCred(renewalvault) }}>
                                    <Text style={{
                                        textDecorationLine: "underline",
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 13,
                                        color: Colorpath.ButtonColr,
                                        marginLeft: 3,
                                    }}>{"Renewal Link"}</Text>
                                </TouchableOpacity>
                            </View>) : (<View style={styles.countdownRow}>
                                <ErrorIcon name="error-outline" color={"#FF5E62"} size={20} />
                                <Text style={styles.countdownText}>{`${countdownMessagecredit} days left`}</Text>
                            </View>)}
                            <View style={styles.progressContainer}>
                                {Array.from({ length: Platform.OS === "ios" ? 29 : 29 }).map((_, index) => (
                                    <View key={index} style={styles.progressBar} />
                                ))}
                            </View>
                            <View style={[styles.infoRow, { marginRight: normalize(10) }]}>
                                <Text style={styles.labelText}>{"Required CME/CE Credits"}</Text>
                                {(creditwise?.credits_data?.total_credits || totalCredit) &&<Text style={styles.valueText}>{creditwise?.credits_data?.total_credits || totalCredit}</Text>}
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.labelText}>{"Mandatory Credits"}</Text>
                                {(creditwise?.credits_data?.topic_earned_credits || creditwise?.credits_data?.topic_credits || mantopiccredit) &&<View style={styles.creditsContainer}>
                                     <Text style={styles.creditsText}>
                                        {(creditwise?.credits_data?.topic_earned_credits === 0 && creditwise?.credits_data?.topic_credits === 0)
                                            ? 'No requirement'
                                            : `${creditwise?.credits_data?.topic_earned_credits} / ${creditwise?.credits_data?.topic_credits || mantopiccredit} earned`}
                                    </Text>
                                </View>}
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.labelText}>{"General Credits"}</Text>
                      {(creditwise?.credits_data?.total_general_earned_credits ||creditwise?.credits_data?.total_general_credits || gentopiccredit ) && <View style={styles.creditsContainer}>
                                    <Text style={styles.creditsText}>
                                        {
                                            (creditwise?.credits_data?.total_general_earned_credits ?? gencredit) === 0 &&
                                                parseFloat(creditwise?.credits_data?.total_general_credits || gentopiccredit) === 0
                                                ? "No requirement"
                                                : `${creditwise?.credits_data?.total_general_earned_credits ?? gencredit} / ${parseFloat(creditwise?.credits_data?.total_general_credits || gentopiccredit)} earned`
                                        }

                                    </Text>
                                </View>}
                            </View>
                            <View style={styles.buttonContainer}>
                                <Buttons
                                    onPress={() => {
                                        //  navigation.navigate("CertficateHandle");
                                        navigation.navigate("AddCredits", { creditvalut: certificatedata })
                                    }}
                                    height={normalize(45)}
                                    width={normalize(270)}
                                    backgroundColor={Colorpath.ButtonColr}
                                    borderRadius={normalize(10)}
                                    text="ADD CME/CE Credits"
                                    color={Colorpath.white}
                                    fontSize={16}
                                    fontFamily={Fonts.InterSemiBold}
                                    fontWeight={"bold"} />
                            </View>
                            {certificatedata?.certificates?.length > 0 ? <View style={styles.buttonContainer}>
                                <Buttons
                                    onPress={() => { navigation.navigate("CertficateHandle", { boardID: certificatedata }); }}
                                    height={normalize(45)}
                                    width={normalize(270)}
                                    backgroundColor={Colorpath.white}
                                    borderRadius={normalize(10)
                                    text="View All Certificates"
                                    color={Colorpath.ButtonColr}
                                    fontSize={16}
                                    fontFamily={Fonts.InterSemiBold}
                                    borderWidth={1}
                                    borderColor={Colorpath.ButtonColr}
                                />
                            </View> : null}
                        </View> */}
                    <View style={stylesmodal.cardContainer}>
                        <View style={stylesmodal.card}>
                            {/* Header Section */}
                            <View style={stylesmodal.header}>
                                <Image
                                    source={{ uri: `${DashboardReducer?.dashboardResponse?.data?.licensure_logo_path}${creditwise?.board_data?.licensure_logo}` }}
                                    style={stylesmodal.logo}
                                />
                                <View style={stylesmodal.headerText}>
                                    <Text style={stylesmodal.stateText}>{"State Medical Board"}</Text>
                                    <Text style={stylesmodal.boardText}>{creditwise?.board_data?.board_name || boardname}</Text>
                                </View>
                            </View>

                            <View style={stylesmodal.divider} />

                            {((creditwise?.license_number || licesense) || (creditwise?.board_data?.expiry_date || expirelicno)) && <View style={stylesmodal.infoRow}>
                                <View style={{ gap: normalize(4) }}>
                                    <Text style={[stylesmodal.label]}>{"License #"}</Text>
                                    <Text style={[stylesmodal.value, { width: normalize(120),fontWeight:"bold",textTransform:"uppercase" }]}>{creditwise?.license_number || licesense}</Text>
                                </View>
                                <View style={{ marginRight: normalize(20), gap: normalize(4) }}>
                                    <Text style={[stylesmodal.label]}>{"Expiration"}</Text>
                                    <Text style={[stylesmodal.value,{fontWeight:"bold"}]}>{creditwise?.board_data?.expiry_date
                                        ? moment(creditwise.board_data.expiry_date).format('MMM DD, YYYY')
                                        : expirelicno
                                    }</Text>
                                </View>
                            </View>}

                            <View style={stylesmodal.checklistButton}>
                                <Pressable style={{ flexDirection: "row", gap: normalize(5) }} onPress={() => setCmemodal(!cmemodal)}>
                                    <Text style={[stylesmodal.checklistText,{fontWeight:"bold"}]}>{"CME Checklist"}</Text>
                                    <View style={{ backgroundColor: Colorpath.ButtonColr, height: normalize(15), width: normalize(15), borderRadius: normalize(15), justifyContent: "center", alignItems: "center" }}>
                                        <ArrowNeed name={"arrow-right"} color={"#FFFFFF"} size={12} />
                                    </View>
                                </Pressable>
                                {/* {!expireDatecredit && <View style={{ flexDirection: "row", gap: normalize(2), right: Platform.OS === "ios" ? normalize(0) : normalize(10) }}>
                                    <Image source={Imagepath.WarnImg} style={{ height: normalize(15), width: normalize(15), resizeMode: "contain" }} />
                                    <Text style={[stylesmodal.expireAlert, { lineHeight: normalize(12), top: normalize(0) }]}> {`License Expires in ${countdownMessagecredit} Days`}</Text>
                                </View>} */}
                            </View>
                            {expireDatecredit ? <View style={{ justifyContent: "center", alignItems: "center", top: normalize(12) }}>
                                <View style={stylesmodal.updateRenew}>
                                    <Pressable onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "AddLicense", params: { myTaskask: { addLic: creditwise, creditvault: "TabNav" } } }] }))}>
                                        <Text style={stylesmodal.update}>{"Update"}</Text>
                                    </Pressable>
                                    <Pressable style={stylesmodal.renewRow} onPress={() => handleOpenRenewalLinkCred(renewalvault)}>
                                        <Text style={stylesmodal.renew}>{"Renew State License"}</Text>
                                        <View style={stylesmodal.arrowCircleBlack}>
                                            <ArrowNeed name={"arrow-up-right"} color={"#FFFFFF"} size={12} />
                                        </View>
                                    </Pressable>
                                </View>
                            </View> : <View style={{ justifyContent: "center", alignItems: "center", top: normalize(12) }}>
                                <View style={stylesmodal.activebody}>
                                    <Text style={[stylesmodal.renew,{fontWeight:"bold"}]}>{"License Status"}</Text>
                                    <Text style={[stylesmodal.active,{fontWeight:"bold"}]}>{"Active"}</Text>

                                </View>
                            </View>}
                        </View>
                        <View style={stylesmodal.footer}>
                            <View style={{ flexDirection: "row", gap: normalize(5), paddingHorizontal: normalize(5), paddingVertical: normalize(20), top: normalize(5) }}>
                                <Image source={Imagepath.CreditValut} style={{ height: normalize(20), width: normalize(20), resizeMode: "contain", tintColor: "#FFFFFF" }} />
                                <Text style={[stylesmodal.footerTitle, { marginTop: Platform.OS === "ios" ? normalize(4) : normalize(0) }]}>{"CME/CE Credits"}</Text>
                            </View>
                            <View style={[stylesmodal.creditsRow, { top: Platform.OS === "ios" ? normalize(8) : 0 }]}>
                                {showTotal && (
                                    <View style={{ width: normalize(85) }}>
                                        <Text style={[stylesmodal.creditLabel, { marginLeft: normalize(10),fontWeight:"500" }]}>{"Total Required"}</Text>
                                        <Text style={[stylesmodal.creditValue, { marginLeft: normalize(10),fontWeight:"500" }]} numberOfLines={1}>
                                            {creditwise?.credits_data?.total_credits || totalCredit}
                                        </Text>
                                    </View>
                                )}

                                {showMandatory && (
                                    <>
                                        <View style={[stylesmodal.verticalDivider, { marginRight: normalize(10) }]} />
                                        <View style={stylesmodal.creditItem}>
                                            <Text style={[stylesmodal.creditLabel,{fontWeight:"500"}]}>{"Mandatory"}</Text>
                                            <View style={{ flexDirection: "row", gap: normalize(3) }}>
                                                <Text style={[stylesmodal.creditValue,{fontWeight:"500"}]} numberOfLines={1}>
                                                    {`${creditwise?.credits_data?.topic_earned_credits} / ${creditwise?.credits_data?.topic_credits || mantopiccredit
                                                        }`}
                                                </Text>
                                                <Text style={[stylesmodal.earned, { marginTop: normalize(4),fontWeight:"500" }]}>
                                                    {`earned`}
                                                </Text>
                                            </View>
                                        </View>
                                    </>
                                )}

                                {showGeneral && (
                                    <>
                                        <View style={[stylesmodal.verticalDivider, { marginRight: normalize(10) }]} />
                                        <View style={stylesmodal.creditItem}>
                                            <Text style={[stylesmodal.creditLabel,{fontWeight:"500"}]}>{"General"}</Text>
                                            <View style={{ flexDirection: "row", gap: normalize(3) }}>
                                                <Text style={[stylesmodal.creditValue,{fontWeight:"500"}]} numberOfLines={1}>
                                                    {`${creditwise?.credits_data?.total_general_earned_credits ?? gencredit
                                                        } / ${(
                                                            creditwise?.credits_data?.total_general_credits || gentopiccredit
                                                        )
                                                        }`}
                                                </Text>
                                                 <Text style={[stylesmodal.earned, { marginTop: normalize(4),fontWeight:"500" }]}>
                                                    {`earned`}
                                                </Text>
                                            </View>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </View>

                </View>
                {certificatedata?.certificates?.length > 0 && <Buttons
                    onPress={() => { navigation.navigate("CertficateHandle", { boardID: certificatedata }); }}
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
                    top: 9
                }}>
                    <Pressable onPress={() => navigation.navigate("AddCredits", { creditvalut: certificatedata })} style={{
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
                        <View style={{gap:normalize(5),flexDirection:"row"}}>
                        <Search name="plus" style={{ alignSelf: "center", marginLeft: normalize(1) }} color={Colorpath.white} size={20} />
                        <Text style={{fontFamily:Fonts.InterMedium,fontSize:15,color:"#FFFFFF"}}>{"Add Credits"}</Text>
                        </View>
                    </Pressable>
                </View>
            </>
        </>
        {expireDatecredit ? <Modal
            isVisible={modalshow}
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
                        {creditwise?.board_data?.board_name}
                    </Text>
                </View>
                <View style={{ marginTop: normalize(5) }}>
                    <View style={{ height: Platform.OS === "ios" ? 1 : 0.4, width: normalize(280), backgroundColor: Colorpath.ButtonColr }} />
                </View>
                <View style={{ marginTop: normalize(5), justifyContent: "center", alignItems: "center", flexWrap: 'nowrap' }}>
                    <Text style={stylesmodal.content}>
                        {"Your state license has expired. To maintain access and meet state board credit requirements, please update your license. "}
                        <Text
                            style={stylesmodal.underct}
                            onPress={() => {
                                setModalShow(false);
                                navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "AddLicense", params: { myTaskask: { addLic: creditwise, creditvault: "TabNav" } } }] }));
                            }}
                        >
                            {"Click here"}
                        </Text>
                        {" to upload your updated license."}
                    </Text>
                </View>
            </View>
        </Modal> : null}
    </View>

    )
}
export default Statevaultcomponet
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
        fontWeight:"500"
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
        justifyContent: "space-between",
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
        width: normalize(75),
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
        // marginLeft:normalize(3),
        // textAlign: "center",
    },
    creditValue: {
        color: "#FFFFFF",
        fontSize: 10, // fixed size
        fontFamily: Fonts.InterSemiBold,
        // textAlign: "center",
    },
    earned: {
        color: "#FFFFFF",
        fontSize: 8, // fixed size
        fontFamily: Fonts.InterSemiBold,
        textAlign: "center",
    },
    verticalDivider: {
        height: "100%",
        width: 1,
        backgroundColor: "#FFFFFF",
        marginHorizontal: normalize(2),
    },
    activebody: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        height: normalize(40),
        width: normalize(295),
        backgroundColor: "#deefd9",
        borderBottomStartRadius: normalize(12),
        borderBottomEndRadius: normalize(12),
        paddingHorizontal: normalize(15),
    },
    active: {
        color: "#2cad21",
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
    },
});


