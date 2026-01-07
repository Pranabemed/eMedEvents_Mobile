import { View, Text, Platform, Animated, Easing, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import { CommonActions } from '@react-navigation/native';
import Fonts from '../../Themes/Fonts';
import DeleteIcon from 'react-native-vector-icons/MaterialIcons';
import ScanIcon from 'react-native-vector-icons/AntDesign';
import CustomTextField from '../../Components/CustomTextfiled';
import CalenderIcon from 'react-native-vector-icons/Feather';
import Buttons from '../../Components/Button';
import { SafeAreaView } from 'react-native-safe-area-context'

const AddExpenses = (props) => {
    const [cmeimg, setCmeimg] = useState(null);
    const [membership, setMembership] = useState("");
    const [mbperiod, setMbperiod] = useState("");
    const [amount,setAmount] = useState("");
    const profileBack = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: "CMEListing" }
                ],
            })
        );
    }
    const animatedValuesimg = useRef(new Animated.Value(1)).current;
    const scaleValuesesimg = useRef(new Animated.Value(0)).current;
    const animatedValuesemail = useRef(new Animated.Value(1)).current;
    const scaleValuesemail = useRef(new Animated.Value(0)).current;
    const animatedValuesyear = useRef(new Animated.Value(1)).current;
    const scaleValuesesyear = useRef(new Animated.Value(0)).current;
    const animatedValuesamount = useRef(new Animated.Value(1)).current;
    const scaleValuesamount = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const targetImg = cmeimg ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesimg, {
                toValue: cmeimg ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesimg, {
                toValue: targetImg,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [cmeimg]);
    useEffect(() => {
        const targetScales = membership ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesemail, {
                toValue: membership ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesemail, {
                toValue: targetScales,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [membership]);
    useEffect(() => {
        const targetScaleIssueex = mbperiod ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesyear, {
                toValue: mbperiod ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesesyear, {
                toValue: targetScaleIssueex,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [mbperiod]);
    useEffect(() => {
        const targetamount = amount ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuesamount, {
                toValue: amount ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesamount, {
                toValue: targetamount,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [amount]);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="Add Expenses"
                            onBackPress={profileBack}
                        />
                    ) : (
                        <PageHeader
                            title="Add Expenses"
                            onBackPress={profileBack}
                        />

                    )}
                </View>
                <View style={{ justifyContent: "center", alignContent: "center", flexDirection: "column", paddingHorizontal: normalize(8), paddingVertical: normalize(10) }}>
                    <Animated.View style={{ opacity: animatedValuesimg, transform: [{ scale: scaleValuesesimg }] }}>
                        {cmeimg ? (
                            <View>
                                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#000000" }}>
                                    {"Upload File*"}
                                </Text>
                            </View>
                        ) : null}
                    </Animated.View>
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            // backgroundColor:"red"
                        }}>
                            <TouchableOpacity style={styles.textContainer}>
                                <Text style={[styles.uploadText, { color: cmeimg ? Colorpath.ButtonColr : "#000000" }]}>
                                    {cmeimg
                                        ? cmeimg.uri
                                            ? cmeimg.uri.split('/').pop().replace(/-/g, '').slice(-16)
                                            : cmeimg.split('/').pop()
                                        : "Upload File*"}
                                </Text>
                            </TouchableOpacity>
                            {!cmeimg && <View style={styles.separatorLine} />}
                            {cmeimg ? <TouchableOpacity onPress={() => {
                                setCmeimg("");
                            }} style={styles.iconContainer}>
                                <DeleteIcon name="delete" size={30} color={"#DDDDDD"} />
                            </TouchableOpacity> : <TouchableOpacity style={styles.iconContainer}>
                                <ScanIcon name="scan1" size={30} color={Colorpath.black} />
                            </TouchableOpacity>}
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 2,
                            }}
                        >
                            {Array.from({ length: 50 }).map((_, index) => (
                                <View
                                    key={index}
                                    style={{
                                        width: 4,
                                        height: 2,
                                        backgroundColor: '#000',
                                        borderRadius: 1,
                                        marginHorizontal: 0,
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                </View>
                <View style={{ justifyContent: "center", alignContent: "center", flexDirection: "column", paddingHorizontal: normalize(8), paddingVertical: membership ? normalize(5) : 0 }}>
                    <Animated.View style={{ opacity: animatedValuesemail, transform: [{ scale: scaleValuesemail }] }}>
                        {membership ? (
                            <View>
                                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#000000" }}>
                                    {"Membership Association*"}
                                </Text>
                            </View>
                        ) : null}
                    </Animated.View>
                    <View
                        style={{
                            borderBottomColor: '#000000',
                            borderBottomWidth: 0.5,
                        }}>
                        <TextInput
                            editable
                            maxLength={290}
                            onChangeText={(val) => setMembership(val)}
                            value={membership}
                            style={{ height: normalize(35), width: normalize(290), paddingVertical: 0, fontSize: 14, color: "#000000", fontFamily: Fonts.InterBold }}
                            placeholder="Membership Association*"
                            placeholderTextColor={"black"}
                            keyboardType="default"
                        />
                    </View>
                </View>
                <View style={{ paddingHorizontal: normalize(9), paddingVertical: mbperiod ? 0 : normalize(10) }}>
                    <Animated.View style={{ opacity: animatedValuesyear, transform: [{ scale: scaleValuesesyear }] }}>
                        {mbperiod ? (
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#000000", marginLeft: normalize(0) }}>
                                    {"Membership Period*"}
                                </Text>
                            </View>
                        ) : null}
                    </Animated.View>
                    <View
                        style={{
                            borderBottomColor: '#000000',
                            borderBottomWidth: 0.5,
                        }}>
                        <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}>
                            <CustomTextField
                                value={mbperiod}
                                height={normalize(35)}
                                width={normalize(300)}
                                placeholder={'Membership Period*'}
                                placeholderTextColor={"#000000"}
                                fontSize={14}
                                fontFamily={Fonts.InterBold}
                                // borderWidth={1}
                                color={"#000000"}
                                borderColor={"#DDDDDD"}
                                rightIcon={CalenderIcon}
                                rightIconName={"calendar"}
                                rightIconSize={25}
                                rightIconColor="#63748b"
                                editable={false}
                                onRightIconPress={() => { console.log("jhfgjhjh") }}
                                marginRight={normalize(2)}
                                marginTop={normalize(2)}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ justifyContent: "center", alignContent: "center", flexDirection: "column", paddingHorizontal: normalize(8), paddingVertical: amount ? normalize(5) : 0 }}>
                    <Animated.View style={{ opacity: animatedValuesamount, transform: [{ scale: scaleValuesamount }] }}>
                        {amount ? (
                            <View>
                                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#000000" }}>
                                    {"Amount*"}
                                </Text>
                            </View>
                        ) : null}
                    </Animated.View>
                    <View
                        style={{
                            borderBottomColor: '#000000',
                            borderBottomWidth: 0.5,
                        }}>
                        <TextInput
                            editable
                            maxLength={290}
                            onChangeText={(val) => setAmount(val)}
                            value={amount}
                            style={{ height: normalize(35), width: normalize(290), paddingVertical: 0, fontSize: 14, color: "#000000", fontFamily: Fonts.InterBold }}
                            placeholder="Amount*"
                            placeholderTextColor={"black"}
                            keyboardType="default"
                        />
                    </View>
                </View>
                <Buttons
                            onPress={()=>{console.log("dgjslfdkg")}}
                            height={normalize(45)}
                            width={normalize(310)}
                            backgroundColor={Colorpath.ButtonColr}
                            borderRadius={normalize(9)}
                            text="Save"
                            color={Colorpath.white}
                            fontSize={18}
                            fontFamily={Fonts.InterSemiBold}
                            marginTop={normalize(30)}
                        />
                        <Buttons
                            onPress={() => { props.navigation.navigate("TabNav") }}
                            height={normalize(45)}
                            width={normalize(280)}
                            backgroundColor={Colorpath.Pagebg}
                            borderRadius={normalize(9)}
                            text="Cancel"
                            color={Colorpath.ButtonColr}
                            fontSize={14}
                            fontFamily={Fonts.InterSemiBold}
                            marginTop={normalize(10)}
                        />
            </SafeAreaView>
        </>
    )
}

export default AddExpenses
const styles = StyleSheet.create({
    imageBackground: {
        height: normalize(65),
        width: normalize(300),
        resizeMode: "contain",
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(10),
    },
    textContainer: {
        paddingVertical: normalize(10),
    },
    uploadText: {
        fontFamily: Fonts.InterBold,
        fontSize: 14,
    },
    separatorLine: {
        height: normalize(35),
        width: 1,
        marginLeft: normalize(160),
        backgroundColor: "#DDDDDD",
    },
    iconContainer: {
        paddingVertical: normalize(5),
    },
    headerText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 18,
        color: "#000000",
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        height: normalize(65),
        width: normalize(308),
        resizeMode: 'contain',
    },
});