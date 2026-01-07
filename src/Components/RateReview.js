import { View, Text, Platform, Image, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Colorpath from '../Themes/Colorpath'
import MyStatusBar from '../Utils/MyStatusBar'
import PageHeader from './PageHeader'
import Imagepath from '../Themes/Imagepath'
import Fonts from '../Themes/Fonts'
import normalize from '../Utils/Helpers/Dimen'
import { AirbnbRating, Rating } from 'react-native-ratings'
import TextFieldIn from './Textfield'
import Loader from '../Utils/Helpers/Loader'
import Buttons from './Button'
import connectionrequest from '../Utils/Helpers/NetInfo'
import { useDispatch, useSelector } from 'react-redux'
import { cmereviewRequest } from '../Redux/Reducers/CMEReducer'
import showErrorAlert from '../Utils/Helpers/Toast';
import { AppContext } from '../Screen/GlobalSupport/AppContext'
import { stateDashboardRequest } from '../Redux/Reducers/DashboardReducer';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
let status1 = "";
const RateReview = (props) => {
    const {
        statepush,
        setStatepush,
        setFinddata,
        fulldashbaord,
        setAddit
    } = useContext(AppContext);
    console.log("propsalll======", props?.route?.params?.onlineName);
    const CMEReducer = useSelector(state => state.CMEReducer);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [ratingex, setRatingex] = useState(0);
    const [ratingct, setRatingct] = useState(0);
    const [comment, setComment] = useState("");
    const Ratingpage = () => {
        const getAda = fulldashbaord?.[0];
        setAddit(getAda);
        props.navigation.navigate("TabNav");
    }
    const isButtonEnabled = rating && ratingct && ratingex && comment;
    const rateReviewSave = () => {
        let obj = {
            "conference_id": props?.route?.params?.onlineName?.id || props?.route?.params?.reviewCon,
            "overall_experience": ratingex,
            "speaker_experience": ratingct,
            "venue_experience": 0,
            "content_experience": rating,
            "comment": comment
        }
        connectionrequest()
            .then(() => {
                dispatch(cmereviewRequest(obj));
            })
            .catch((err) => { showErrorAlert("Please connect to internet", err) })
    }
    useEffect(() => {
        if (statepush) {
            connectionrequest()
                .then(() => {
                    dispatch(stateDashboardRequest({ "state_id": statepush?.state_id }))
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) })
        }
    }, [statepush])
    if (status === '' || CMEReducer.status !== status) {
        switch (CMEReducer.status) {
            case 'CME/cmereviewRequest':
                status = CMEReducer.status;
                break;
            case 'CME/cmereviewSuccess':
                status = CMEReducer.status;
                if (props?.route?.params?.reviewCon) {
                    props.navigation.navigate("TabNav");
                } else {
                    props.navigation.goBack();
                }
                break;
            case 'CME/cmereviewFailure':
                status = CMEReducer.status;
                break;
        }
    }
    if (status1 == '' || DashboardReducer.status != status1) {
        switch (DashboardReducer.status) {
            case 'Dashboard/stateDashboardRequest':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/stateDashboardSuccess':
                status1 = DashboardReducer.status;
                setFinddata(DashboardReducer?.stateDashboardResponse?.data);
                break;
            case 'Dashboard/stateDashboardFailure':
                status1 = DashboardReducer.status;
                break;
        }
    }
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? <PageHeader
                    title="Rate Your Experience"
                    onBackPress={Ratingpage}
                /> : <View>
                    <PageHeader
                        title="Rate Your Experience"
                        onBackPress={Ratingpage}
                    />
                </View>}
                <Loader visible={CMEReducer?.status == 'CME/cmereviewRequest'} />

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView contentContainerStyle={{ paddingBottom: normalize(40) }}>
                        {/* <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", width: '100%', paddingHorizontal: normalize(17), paddingVertical: normalize(10) }}>
                            <Text numberOfLines={2}
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 16,
                                    color: "#000000",
                                    fontWeight: "bold",
                                    flex: 1,
                                    flexWrap: 'wrap',
                                }}
                            >
                                {props?.route?.params?.onlineName?.title || "Rate Your Experience"}
                            </Text>
                        </View> */}
                        <View>
                            <View style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(10) }}>
                                <View
                                    style={{
                                        flexDirection: "column",
                                        width: normalize(290),
                                        borderRadius: normalize(10),
                                        backgroundColor: "#FFFFFF",
                                        paddingHorizontal: normalize(10),
                                        paddingVertical: normalize(10),
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                                        <Text numberOfLines={2}
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 16,
                                                color: "#000000",
                                                fontWeight: "bold",
                                                flex: 1,
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            {"Overall Experience"}
                                        </Text>
                                    </View>
                                    <View style={{ alignSelf: 'flex-start' }}>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#666" }}>
                                            {"Rate your overall experience for this activity"}
                                        </Text>
                                    </View>
                                    <View style={{ marginTop: normalize(10), height: 1, width: normalize(270), backgroundColor: "#DDD" }} />
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(10), width: '100%' }}>
                                        <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterSemiBold,
                                                        fontSize: 12,
                                                        color: "#666",
                                                        fontWeight: "bold",
                                                        marginLeft: normalize(10),
                                                    }}
                                                >
                                                    {"Rate"}
                                                </Text>

                                                <View style={{ alignItems: 'center', paddingHorizontal: normalize(5) }}>
                                                    <AirbnbRating
                                                        count={5}
                                                        reviews={[]}
                                                        defaultRating={ratingex}
                                                        size={15}
                                                        showRating={false}
                                                        onFinishRating={(val) => setRatingex(val)}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(10) }}>
                                <View
                                    style={{
                                        flexDirection: "column",
                                        width: normalize(290),
                                        borderRadius: normalize(10),
                                        backgroundColor: "#FFFFFF",
                                        paddingHorizontal: normalize(10),
                                        paddingVertical: normalize(10),
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                                        <Text numberOfLines={2}
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 16,
                                                color: "#000000",
                                                fontWeight: "bold",
                                                flex: 1,
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            {"Speaker Experience"}
                                        </Text>
                                    </View>
                                    <View style={{ alignSelf: 'flex-start' }}>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#666" }}>
                                            {"Rate your overall experience for this activity"}
                                        </Text>
                                    </View>
                                    <View style={{ marginTop: normalize(10), height: 1, width: normalize(270), backgroundColor: "#DDD" }} />
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(10), width: '100%' }}>
                                        <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterSemiBold,
                                                        fontSize: 12,
                                                        color: "#666",
                                                        fontWeight: "bold",
                                                        marginLeft: normalize(10),
                                                    }}
                                                >
                                                    {"Rate"}
                                                </Text>

                                                <View style={{ alignItems: 'center', paddingHorizontal: normalize(5) }}>
                                                    <AirbnbRating
                                                        count={5}
                                                        reviews={[]}
                                                        defaultRating={ratingct}
                                                        size={15}
                                                        showRating={false}
                                                        onFinishRating={(val) => setRatingct(val)}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(10) }}>
                                <View
                                    style={{
                                        flexDirection: "column",
                                        width: normalize(290),
                                        borderRadius: normalize(10),
                                        backgroundColor: "#FFFFFF",
                                        paddingHorizontal: normalize(10),
                                        paddingVertical: normalize(10),
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                                        <Text numberOfLines={2}
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 16,
                                                color: "#000000",
                                                fontWeight: "bold",
                                                flex: 1,
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            {"Content  Experience"}
                                        </Text>
                                    </View>
                                    <View style={{ alignSelf: 'flex-start' }}>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#666" }}>
                                            {"Rate your overall experience for this activity"}
                                        </Text>
                                    </View>
                                    <View style={{ marginTop: normalize(10), height: 1, width: normalize(270), backgroundColor: "#DDD" }} />
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(10), width: '100%' }}>
                                        <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterSemiBold,
                                                        fontSize: 12,
                                                        color: "#666",
                                                        fontWeight: "bold",
                                                        marginLeft: normalize(10),
                                                    }}
                                                >
                                                    {"Rate"}
                                                </Text>

                                                <View style={{ alignItems: 'center', paddingHorizontal: normalize(5) }}>
                                                    <AirbnbRating
                                                        count={5}
                                                        reviews={[]}
                                                        defaultRating={rating}
                                                        size={15}
                                                        showRating={false}
                                                        onFinishRating={(val) => setRating(val)}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", width: '100%', paddingHorizontal: normalize(17), paddingVertical: normalize(5) }}>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterMedium,
                                            fontSize: 16,
                                            color: "#000000",
                                        }}
                                    >
                                        {"Any comments*"}
                                    </Text>
                                </View>
                                <TextFieldIn
                                    value={comment}
                                    onChangeText={val => setComment(val)}
                                    height={normalize(110)}
                                    width={normalize(290)}
                                    backgroundColor={Colorpath.textField}
                                    alignSelf={'center'}
                                    borderRadius={normalize(9)}
                                    placeholder={'Type here*'}
                                    placeholderTextColor={Colorpath.placeholder}
                                    fontSize={14}
                                    multiline={true}
                                    textAlignVertical={'top'}
                                    alignItems={'flex-start'}
                                    marginTopInput={normalize(7)}
                                    fontFamily={Fonts.InterRegular}
                                    color={Colorpath.black}
                                    paddingHorizontal={normalize(5)}
                                />
                            </View>
                            <Buttons
                                onPress={() => { rateReviewSave(); }}
                                height={normalize(45)}
                                width={normalize(290)}
                                backgroundColor={isButtonEnabled ? Colorpath.ButtonColr : "#CCC"}
                                borderRadius={normalize(9)}
                                text={"Submit Review"}
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(30)}
                                disabled={!isButtonEnabled}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}

export default RateReview;