/**
 * Choose specailization screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, ChooseSpecailization, handleBackPress, onBackPress, cleanNumber, renderData.
 */

import { View, Text, TouchableOpacity, FlatList, ScrollView, Platform, BackHandler, Alert } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import PageHeader from '../../Components/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { nanoid } from '@reduxjs/toolkit';
import { stateCourseRequest } from '../../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { CommonActions } from '@react-navigation/native';
import Loader from '../../Utils/Helpers/Loader';
import NetInfo from '@react-native-community/netinfo';
import { AppContext } from '../GlobalSupport/AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable ChooseSpecailization component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const ChooseSpecailization = (props) => {
    const {
        isConnected,
        fulldashbaord,
        setAddit
    } = useContext(AppContext);
    console.log(props?.route?.params, "fghkjhrgkj")
    const selectedStateId = props?.route?.params?.stateID?.state_id;
    const [request, setRequest] = useState(null);
    const [connectionFailed, setConnectionFailed] = useState(false);
    const dispatch = useDispatch();
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    useLayoutEffect(() => {
        let active = true;
        const nextRequest = {id: nanoid(), stateId: selectedStateId};
        setRequest(nextRequest);
        setConnectionFailed(false);
        connectionrequest()
            .then(() => {
                if (!active) return;
                dispatch({...stateCourseRequest({state_id: selectedStateId}), meta: {complianceRequestId: nextRequest.id}});
            })
            .catch(err => {
                if (!active) return;
                setConnectionFailed(true);
                showErrorAlert("Please connect to internet", err);
            });
        return () => { active = false; };
    }, [dispatch, selectedStateId]);
    const ownsResponse = request?.stateId === selectedStateId &&
        request?.id === DashboardReducer.stateCourseRequestId;
    const isLoading = !connectionFailed && (!ownsResponse || DashboardReducer.stateCourseLoading);
    const CMEData = ownsResponse && !isLoading && !connectionFailed
        ? DashboardReducer.stateCourseResponse?.data : null;
        /**
 * Handles back press.
 * @returns {void}
 */
const handleBackPress = () => {
        const getAda = fulldashbaord?.[0];
        setAddit(getAda);
        props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav" }] }));
    };
    useEffect(() => {
                /**
 * On back press utility.
 * @returns {boolean}
 */
const onBackPress = () => {
            handleBackPress();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
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
        /**
 * Render data utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const renderData = ({ item, index }) => {
        console.log(item, "itemgetingn---------", cleanNumber(item?.earned_credits), cleanNumber(item?.credits))
        return (
            <TouchableOpacity onPress={() => { props.navigation.navigate("StateSpecification", { fullData: { fullData: item, addCreds: CMEData?.state_data } }) }}>
                <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(5) }}>
                    <View
                        style={{
                            flexDirection: "row",
                            // height: normalize(83),
                            width: normalize(290),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            alignItems: "center",
                        }}
                    >
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 16,
                                    color: "#000000",
                                    fontWeight: "bold",
                                    paddingVertical: 10,  // Adjust the vertical padding as needed
                                    paddingHorizontal: 0
                                }}
                            >
                                {item?.name}
                            </Text>

                            <View style={{ flexDirection: "row", marginTop: normalize(10), gap: normalize(5) }}>
                                {(item?.registered_cource || item?.suggested_cources) && <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 14,
                                        color: "#999",
                                        // fontWeight: "bold",
                                        paddingHorizontal: normalize(1),
                                        paddingVertical: normalize(3)
                                    }}
                                >
                                    {`${item?.registered_cources?.length + item?.suggested_cources?.length} Courses`}
                                </Text>}
                                {(item?.earned_credits || item?.credits) && <View style={{ paddingHorizontal: normalize(10), borderRadius: normalize(20), backgroundColor: cleanNumber(item?.earned_credits) == cleanNumber(item?.credits) ? "#D6F9E2" : "#FFF2E0", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#666" }}>
                                        {`${item?.earned_credits} / ${item?.credits} Credits Earned`}
                                    </Text>
                                </View>}

                            </View>
                        </View>
                        {/* <TouchableOpacity onPress={() => { props.navigation.navigate("StateSpecification", { fullData: {fullData:item,addCreds:CMEData?.state_data} }) }}> */}
                        <ArrowIcons
                            name="keyboard-arrow-right"
                            size={30}
                            color={Colorpath.ButtonColr}
                        />
                        {/* </TouchableOpacity> */}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    const genralErndCrd = cleanNumber(CMEData?.state_data?.credits_data?.total_general_earned_credits);
    const genTotalCrd = cleanNumber(CMEData?.state_data?.credits_data?.total_general_credits);
    console.log(genralErndCrd, genTotalCrd, "gfdghdfh========");
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? <PageHeader
                    title="CME/CE Course Recommendations"
                    onBackPress={handleBackPress}
                /> : <View>
                    <PageHeader
                        title="CME/CE Course Recommendations"
                        onBackPress={handleBackPress}
                    />
                </View>}

                <Loader visible={Boolean(isLoading) && conn !== false} />
                {conn === false ? <IntOff /> : isLoading ? null : !CMEData ? (
                    <Text style={{padding: normalize(20)}}>Unable to load compliance data. Please go back and try again.</Text>
                ) : <ScrollView contentContainerStyle={{ paddingBottom: normalize(50) }}>
                    <View style={{ paddingHorizontal: normalize(15), paddingVertical: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: "#000000", fontWeight: "bold" }}>
                            {props?.route?.params?.stateID?.state_name}
                        </Text>
                    </View>
                    {CMEData?.state_data?.topics?.length > 0 ? (
                        <>
                            <View style={{ paddingHorizontal: normalize(15), paddingVertical: normalize(10) }}>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000" }}>
                                    {"State Mandatory Topics"}
                                </Text>
                            </View>
                            <View>
                                {CMEData?.state_data?.topics?.length > 0 ? (
                                    <FlatList
                                        data={CMEData?.state_data?.topics}
                                        renderItem={renderData}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListEmptyComponent={
                                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Text
                                                    style={{
                                                        color: Colorpath.grey,
                                                        fontWeight: 'bold',
                                                        fontFamily: Fonts.InterMedium,
                                                        fontSize: normalize(20),
                                                        paddingTop: normalize(30),
                                                    }}>
                                                    {"No data found"}
                                                </Text>
                                            </View>
                                        }
                                    />
                                ) : (
                                    <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(5) }}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                width: normalize(290),
                                                borderRadius: normalize(10),
                                                backgroundColor: "#FFFFFF",
                                                paddingHorizontal: normalize(10),
                                                paddingVertical: normalize(10),
                                                alignItems: "center",
                                            }}
                                        >
                                            <View style={{ flex: 1, justifyContent: "center" }}>
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterSemiBold,
                                                        fontSize: 16,
                                                        color: "#000000",
                                                        fontWeight: "bold",
                                                        paddingVertical: 10,
                                                        paddingHorizontal: 0
                                                    }}
                                                >
                                                    {"Your state board does not have any mandatory credit requirements."}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </>
                    ) : null}
                    <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000" }}>
                            {"General Credits"}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => { props.navigation.navigate("CourseRelevant", { mainData: CMEData }) }}>
                        <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(0) }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    // height: normalize(79),
                                    width: normalize(290),
                                    borderRadius: normalize(10),
                                    backgroundColor: "#FFFFFF",
                                    paddingHorizontal: normalize(10),
                                    paddingVertical: normalize(10),
                                    alignItems: "center",
                                }}
                            >
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterSemiBold,
                                            fontSize: 16,
                                            color: "#000000",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {"Relevant to your primary area \nof practice or specialty"}
                                    </Text>
                                    <View style={{ flexDirection: "row", marginTop: normalize(10), gap: normalize(5) }}>
                                        {(() => {
                                            const registered = CMEData?.speciality_cources?.registered_cources || [];
                                            const suggested = CMEData?.speciality_cources?.suggested_cources || [];
                                            const total = registered.length + suggested.length;

                                            return total > 0 && (
                                                <Text
                                                    style={{
                                                        fontFamily: Fonts.InterMedium,
                                                        fontSize: 14,
                                                        color: "#999",
                                                        paddingHorizontal: normalize(1),
                                                        paddingVertical: normalize(3)
                                                    }}
                                                >
                                                    {`${total} Course${total !== 1 ? 's' : ''}`}
                                                </Text>
                                            );
                                        })()}
                                        {(genralErndCrd === 0 && genTotalCrd === 0) ? null : (
                                            (genralErndCrd || genTotalCrd) ? (
                                                <View style={{
                                                    paddingHorizontal: normalize(10),
                                                    borderRadius: normalize(20),
                                                    backgroundColor: genralErndCrd === genTotalCrd ? "#D6F9E2" : "#FFF2E0",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>
                                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#666" }}>
                                                        {`${genralErndCrd} / ${genTotalCrd} Credits Earned`}
                                                    </Text>
                                                </View>
                                            ) : null
                                        )}
                                    </View>
                                </View>

                                <ArrowIcons
                                    name="keyboard-arrow-right"
                                    size={30}
                                    color={Colorpath.ButtonColr}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>}
            </SafeAreaView>
        </>
    )
}

/**
 * Choose specailization default export.
 *
 * @returns {*}
 */
export default ChooseSpecailization;
