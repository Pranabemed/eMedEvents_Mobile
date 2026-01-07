import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
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
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { primeTrailRequest } from '../../Redux/Reducers/AuthReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { SafeAreaView } from 'react-native-safe-area-context'
const CheckMembership = (props) => {
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);
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
    const handleClk = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: "TabNav" }
                ],
            })
        );
    }
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
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
                        <ScrollView contentContainerStyle={{ paddingBottom: normalize(95) }}>

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
                    <View style={styles.buttonContainer}>
                        <Buttons
                            onPress={handleClk}
                            height={normalize(45)}
                            width={normalize(288)}
                            backgroundColor={Colorpath.ButtonColr}
                            borderRadius={normalize(5)}
                            text="Start Your  30-Day Free Trial Today!"
                            color={Colorpath.white}
                            fontSize={16}
                            fontFamily={Fonts.InterSemiBold}
                            marginTop={normalize(-15)}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}
const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: Platform.OS === 'ios' ? normalize(20) : normalize(40),
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
export default CheckMembership;

