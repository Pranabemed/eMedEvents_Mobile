/**
 * Choose specailization screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, ChooseSpecailization, handleBackPress, onBackPress, cleanNumber, renderData.
 */

import { View, Text, TouchableOpacity, FlatList, ScrollView, Platform, BackHandler, StyleSheet } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
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
import { CommonActions, useFocusEffect } from '@react-navigation/native';
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
    useFocusEffect(useCallback(() => {
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
    }, [dispatch, selectedStateId]));
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
        const totalCourses = (item?.registered_cources?.length || 0) + (item?.suggested_cources?.length || 0);
        const earned = cleanNumber(item?.earned_credits);
        const required = cleanNumber(item?.credits);
        const isCreditsComplete = earned >= required && required > 0;
        const showCourseCount = Boolean(item?.registered_cources || item?.registered_cource || item?.suggested_cources) && totalCourses >= 0;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { props.navigation.navigate("StateSpecification", { complianceStateId: selectedStateId, fullData: { fullData: item, addCreds: CMEData?.state_data } }) }}
            >
                <View style={styles.cardWrapper}>
                    <View style={styles.topicCard}>
                        <View style={styles.cardBody}>
                            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.cardTitle}>
                                {item?.name}
                            </Text>

                            <View style={styles.cardMetaRow}>
                                {showCourseCount && (
                                    <Text style={styles.coursesCountText}>
                                        {`${totalCourses} Course${totalCourses !== 1 ? 's' : ''}`}
                                    </Text>
                                )}
                                {(item?.earned_credits || item?.credits) && (
                                    <View style={[
                                        styles.creditsBadge,
                                        { backgroundColor: isCreditsComplete ? "#D6F9E2" : "#FFF2E0" },
                                    ]}>
                                        <Text style={styles.creditsBadgeText}>
                                            {`${item?.earned_credits} / ${item?.credits} Credits Earned`}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <ArrowIcons
                            name="keyboard-arrow-right"
                            size={28}
                            color={Colorpath.ButtonColr}
                        />
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
                ) : <ScrollView contentContainerStyle={{ paddingBottom: normalize(30) }}>
                    {props?.route?.params?.stateID?.state_name ? (
                        <View style={styles.stateHeaderContainer}>
                            <Text style={styles.stateHeaderTitle}>
                                {props?.route?.params?.stateID?.state_name}
                            </Text>
                        </View>
                    ) : null}
                    {CMEData?.state_data?.topics?.length > 0 ? (
                        <>
                            <View style={styles.sectionBanner}>
                                <Text style={styles.sectionTitle}>
                                    {"State Mandatory Topics"}
                                </Text>
                            </View>
                            <View>
                                {CMEData?.state_data?.topics?.length > 0 ? (
                                    <FlatList
                                        data={CMEData?.state_data?.topics}
                                        renderItem={renderData}
                                        scrollEnabled={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListEmptyComponent={
                                            <View style={styles.emptyWrap}>
                                                <Text style={styles.emptyText}>
                                                    {"No data found"}
                                                </Text>
                                            </View>
                                        }
                                    />
                                ) : (
                                    <View style={styles.cardWrapper}>
                                        <View style={styles.topicCard}>
                                            <View style={styles.cardBody}>
                                                <Text style={styles.cardTitle}>
                                                    {"Your state board does not have any mandatory credit requirements."}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </>
                    ) : null}
                    <View style={styles.sectionBanner}>
                        <Text style={styles.sectionTitle}>
                            {"General Credits"}
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => { props.navigation.navigate("CourseRelevant", { complianceStateId: selectedStateId, mainData: CMEData }) }}>
                        <View style={styles.cardWrapper}>
                            <View style={styles.topicCard}>
                                <View style={styles.cardBody}>
                                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.cardTitle}>
                                        {"Relevant to your primary area \nof practice or specialty"}
                                    </Text>
                                    <View style={styles.cardMetaRow}>
                                        {(() => {
                                            const registered = CMEData?.speciality_cources?.registered_cources || [];
                                            const suggested = CMEData?.speciality_cources?.suggested_cources || [];
                                            const total = registered.length + suggested.length;

                                            return total > 0 && (
                                                <Text style={styles.coursesCountText}>
                                                    {`${total} Course${total !== 1 ? 's' : ''}`}
                                                </Text>
                                            );
                                        })()}
                                        {(genralErndCrd === 0 && genTotalCrd === 0) ? null : (
                                            (genralErndCrd || genTotalCrd) ? (
                                                <View style={[
                                                    styles.creditsBadge,
                                                    { backgroundColor: genralErndCrd >= genTotalCrd ? "#D6F9E2" : "#FFF2E0" },
                                                ]}>
                                                    <Text style={styles.creditsBadgeText}>
                                                        {`${genralErndCrd} / ${genTotalCrd} Credits Earned`}
                                                    </Text>
                                                </View>
                                            ) : null
                                        )}
                                    </View>
                                </View>

                                <ArrowIcons
                                    name="keyboard-arrow-right"
                                    size={28}
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

const styles = StyleSheet.create({
    stateHeaderContainer: {
        width: normalize(290),
        alignSelf: 'center',
        paddingTop: normalize(10),
        paddingBottom: normalize(4),
    },
    stateHeaderTitle: {
        fontFamily: Fonts.InterBold,
        fontSize: 17,
        color: '#142B5B',
        fontWeight: 'bold',
    },
    sectionBanner: {
        width: normalize(290),
        alignSelf: 'center',
        marginTop: normalize(8),
        marginBottom: normalize(4),
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(10),
        borderRadius: normalize(8),
        backgroundColor: '#142B5B',
    },
    sectionTitle: {
        fontFamily: Fonts.InterBold,
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 21,
        color: '#FFD08A',
    },
    cardWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: normalize(5),
    },
    topicCard: {
        flexDirection: 'row',
        width: normalize(290),
        minHeight: normalize(78),
        borderRadius: normalize(10),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(11),
        alignItems: 'center',
    },
    cardBody: {
        flex: 1,
        justifyContent: 'center',
        marginRight: normalize(6),
    },
    cardTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 15,
        lineHeight: 20,
        color: '#000000',
        fontWeight: 'bold',
    },
    cardMetaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginTop: normalize(8),
        gap: normalize(6),
    },
    coursesCountText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 13.5,
        color: '#666666',
        fontWeight: '600',
    },
    creditsBadge: {
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(3),
        borderRadius: normalize(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    creditsBadgeText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12.5,
        color: '#333333',
        fontWeight: 'bold',
    },
    emptyWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: Colorpath.grey,
        fontWeight: 'bold',
        fontFamily: Fonts.InterMedium,
        fontSize: normalize(20),
        paddingTop: normalize(30),
    },
});

/**
 * Choose specailization default export.
 *
 * @returns {*}
 */
export default ChooseSpecailization;
