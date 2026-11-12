/**
 * Mytasks screen module. Renders a React Native screen or a screen-scoped support component. Exported members: Mytasks, resolveLicenseStateName, resolveLicenseExpiryDate, taskPress, taskHandle, taskAction, mytasktitleUrl, mytaskparticularData, formatDatetask, formatDateEndtask, onBackPress.
 */

import { View, Text, Platform, FlatList, TouchableOpacity, BackHandler, StyleSheet } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import normalize from '.././../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import ProgressBarLine from '../../Components/ProgressPerce';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import { AppContext } from '../GlobalSupport/AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import { FormatDateZone } from '../../Utils/Helpers/Timezone';
import { SafeAreaView } from 'react-native-safe-area-context'
import { stateDashboardRequest, stateDashboardSuccess } from '../../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch } from 'react-redux';
import { syncBucketTasksWithLicense } from '../../Utils/Helpers/LicenseTaskHelper';

/**
 * Reusable Mytasks component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const Mytasks = (props) => {
    console.log(props?.route?.params?.taskData, "props?.route?.params?.taskData?.taskData", props?.route?.params?.backget?.taskData)
    const { isConnected, fulldashbaord, setAddit, statepush } = useContext(AppContext);
    const dispatch = useDispatch();
    const routeCreditID = useMemo(() => {
        return (
            props?.route?.params?.taskData?.creditID ||
            props?.route?.params?.backget?.taskData?.creditID ||
            props?.route?.params?.backget?.creditID ||
            statepush?.creditID ||
            statepush ||
            null
        );
    }, [props?.route?.params?.taskData, props?.route?.params?.backget, statepush]);

    const activeCreditID = useMemo(() => {
        if (Array.isArray(fulldashbaord) && fulldashbaord.length > 0 && routeCreditID) {
            const targetStateId = routeCreditID?.state_id;
            const targetId = routeCreditID?.id;
            const liveLicense = fulldashbaord.find(item =>
                (targetStateId != null && String(item?.state_id) === String(targetStateId)) ||
                (targetId != null && String(item?.id) === String(targetId))
            );
            if (liveLicense) return liveLicense;
        }
        return routeCreditID;
    }, [fulldashbaord, routeCreditID]);

    /**
* Resolve license state name utility.
* @returns {*}
*/
    const resolveLicenseStateName = useCallback(() => (
        activeCreditID?.state ||
        activeCreditID?.state_name ||
        props?.route?.params?.taskData?.statid ||
        props?.route?.params?.backget?.taskData?.statid ||
        props?.route?.params?.backget?.creditID?.state_name ||
        ""
    ), [activeCreditID, props?.route?.params]);
    /**
* Task press utility.
* @returns {void}
*/
    const taskPress = () => {
        setAddit(statepush);
        stateDashboardSuccess(null)
        if (props.navigation.canGoBack()) {
            props.navigation.goBack();
            return;
        }
        taskHandle();
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: "TabNav",
                        params: {
                            initialRoute: "Home",
                            detectmain: "main",
                            refreshLicensesAt: Date.now()
                        }
                    }
                ],
            })
        );
        // props.navigation.goBack();
    };
    /**
* Task handle utility.
* @returns {void}
*/
    const taskHandle = () => {
        if (statepush) {
            const takeIDST = statepush?.state_id || statepush?.creditID?.state_id;
            connectionrequest()
                .then(() => {
                    dispatch(stateDashboardRequest({ "state_id": takeIDST }))
                })
                .catch((err) => { showErrorAlert("Please connect to internet", err) })
        }
    }
    const [conn, setConn] = useState(true)
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const isfocused = useIsFocused();
    useEffect(() => {
        setTasks(true);
    }, [isfocused]);
    const [tasks, setTasks] = useState(false);

    const bucketKey =
        props?.route?.params?.taskData?.tasksKey ||
        props?.route?.params?.backget?.taskData?.tasksKey ||
        null;

    const rawTasks = useMemo(() => {
        const t1 = props?.route?.params?.taskData?.taskData;
        if (Array.isArray(t1) && t1.length > 0) return t1;
        const t2 = props?.route?.params?.backget?.taskData?.taskData;
        if (Array.isArray(t2) && t2.length > 0) return t2;
        const t3 = props?.route?.params?.backget?.taskData;
        if (Array.isArray(t3) && t3.length > 0) return t3;
        return [];
    }, [props?.route?.params?.taskData, props?.route?.params?.backget]);

    const finalTask = useMemo(() => {
        return syncBucketTasksWithLicense(rawTasks, activeCreditID, resolveLicenseStateName(), bucketKey);
    }, [rawTasks, activeCreditID, resolveLicenseStateName, bucketKey]);

    /**
* Task action utility.
* @param {*} taskID - Input value.
* @returns {void}
*/
    const taskAction = (taskID) => {
        const url_webcast = taskID?.detailpage_url;
        const result_final = url_webcast ? url_webcast.split('/').pop() : '';
        console.log(result_final, "webcast url=======");
        console.log(taskID, "taskID===============");
        if (taskID?.current_activity_api == "activitysession") {
            props.navigation.navigate("VideoComponent", { RoleData: taskID });
        } else if (taskID?.current_activity_api == "introduction") {
            props.navigation.navigate("StartTest", { conference: taskID?.id })
        } else if (taskID?.current_activity_api == "startTest") {
            props.navigation.navigate("PreTest", { activityID: { activityID: taskID?.current_activity_id, conference_id: taskID?.id } })
        } else if (taskID?.button_display_text == "Add Credits") {
            props.navigation.navigate("AddCredits", { mainAdd: props?.route?.params?.taskData || props?.route?.params?.backget?.taskData })
        } else if (result_final) {
            props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result_final, creditData: props?.route?.params?.taskData || props?.route?.params?.backget?.taskData, Realback: "mytasks" } })
        }
    }
    /**
* Mytasktitle url utility.
* @param {*} make - Input value.
* @returns {void}
*/
    const mytasktitleUrl = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = urltitle ? urltitle.split('/').pop() : '';
        console.log(resulttitle, "webcast url=======", make);
        if (resulttitle) {
            props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, creditData: props?.route?.params?.taskData || props?.route?.params?.backget?.taskData, Realback: "mytasks" } })
        }
    }
    console.log(finalTask, "finalTask------")
    /**
* Mytaskparticular data utility.
* @param {Object} props - Input object.
* @param {*} props.item - Nested property value.
* @param {*} props.index - Nested property value.
* @returns {JSX.Element}
*/
    const mytaskparticularData = ({ item, index }) => {
        const isUpdateCard = item?.button_display_text === "Update";
        const rawPct = item?.completed_percentage !== undefined && item?.completed_percentage !== null
            ? Number(item.completed_percentage)
            : null;
        const safeProgress = rawPct !== null && Number.isFinite(rawPct)
            ? Math.max(0, Math.min(100, Math.round(rawPct)))
            : null;

        return (
            <View style={styles.cardOuter}>
                <View style={styles.card}>
                    {isUpdateCard ? (
                        <View style={[styles.orgBadge, styles.renewalBadge]}>
                            <Text style={[styles.orgBadgeText, styles.renewalBadgeText]}>
                                {"License Renewal"}
                            </Text>
                        </View>
                    ) : item?.organization_name ? (
                        <View style={styles.orgBadge}>
                            <Text numberOfLines={1} style={styles.orgBadgeText}>
                                {item?.organization_name}
                            </Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        activeOpacity={isUpdateCard ? 1 : 0.75}
                        disabled={isUpdateCard}
                        onPress={() => {
                            if (!isUpdateCard) {
                                mytasktitleUrl(item);
                            }
                        }}
                        style={styles.titleWrap}
                    >
                        <Text numberOfLines={2} style={styles.cardTitle}>
                            {isUpdateCard ? `Renew ${resolveLicenseStateName()} State License` : item?.title}
                        </Text>
                    </TouchableOpacity>

                    {(item?.startdate || item?.enddate) ? (
                        <Text style={styles.metaText}>
                            {`Exp: ${FormatDateZone(item?.startdate, item?.enddate)}`}
                        </Text>
                    ) : null}

                    {item?.display_cme ? (
                        <Text style={styles.cmeMetaText}>
                            {item?.display_cme}
                        </Text>
                    ) : null}

                    <View style={styles.cardDivider} />

                    {isUpdateCard ? (
                        <View style={styles.updateFooterRow}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    props.navigation.dispatch(CommonActions.reset({
                                        index: 0,
                                        routes: [{
                                            name: "AddLicense",
                                            params: {
                                                myTaskask: {
                                                    addLic: activeCreditID || props?.route?.params?.taskData?.creditID || props?.route?.params?.backget?.taskData?.creditID,
                                                    backData: props?.route?.params?.taskData || props?.route?.params?.backget?.taskData,
                                                    BackMyTask: "TabNav",
                                                    backState: resolveLicenseStateName() || props?.route?.params?.taskData?.creditID?.state || props?.route?.params?.backget?.creditID?.state_name
                                                }
                                            }
                                        }]
                                    }));
                                }}
                                style={styles.updateButton}
                            >
                                <Text style={styles.actionButtonText}>
                                    {item?.button_display_text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.courseFooterRow}>
                            <View style={styles.progressCol}>
                                {safeProgress !== null ? (
                                    <ProgressBarLine
                                        tasks={tasks}
                                        textadd="yes"
                                        progress={safeProgress}
                                        height={6}
                                        fillColor={"#2C4DB9"}
                                    />
                                ) : null}
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    if (item?.buttonText === "Revise Course") {
                                        props.navigation.navigate("VideoComponent", { RoleData: item });
                                    } else {
                                        taskAction(item);
                                    }
                                }}
                                style={styles.courseActionButton}
                            >
                                <Text numberOfLines={1} style={styles.actionButtonText}>
                                    {item?.button_display_text}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        );
    };
    useEffect(() => {
        /**
* On back press utility.
* @returns {boolean}
*/
        const onBackPress = () => {
            taskPress();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
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
                {Platform.OS === 'ios' ? (
                    <PageHeader
                        title={"My Tasks"}
                        onBackPress={taskPress}
                    />
                ) : (
                    <View>
                        <PageHeader
                            title={"My Tasks"}
                            onBackPress={taskPress}
                        />
                    </View>
                )}
                {conn === false ? <IntOff /> : <View style={{ flex: 1 }}>
                    <FlatList
                        data={finalTask}
                        renderItem={mytaskparticularData}
                        contentContainerStyle={{ paddingBottom: normalize(120) }}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={
                            <Text
                                style={{
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    color: Colorpath.grey,
                                    fontWeight: 'bold',
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: normalize(20),
                                    paddingTop: normalize(30),
                                }}>
                                No data found
                            </Text>
                        }
                    />
                </View>}
            </SafeAreaView>
        </>

    )
}

const styles = StyleSheet.create({
    cardOuter: {
        width: '100%',
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(7),
    },
    card: {
        width: '100%',
        borderRadius: normalize(12),
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5ECF6',
        paddingHorizontal: normalize(14),
        paddingVertical: normalize(14),
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    orgBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(4),
        borderRadius: normalize(16),
        backgroundColor: '#FFF2E0',
        marginBottom: normalize(8),
    },
    orgBadgeText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12.5,
        color: '#9A3412',
    },
    renewalBadge: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    renewalBadgeText: {
        color: Colorpath.ButtonColr,
    },
    titleWrap: {
        width: '100%',
        marginBottom: normalize(6),
    },
    cardTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 15.5,
        lineHeight: 22,
        color: '#0F172A',
        fontWeight: 'bold',
    },
    metaText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 13,
        color: '#64748B',
        marginBottom: normalize(3),
    },
    cmeMetaText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 12,
        color: '#64748B',
    },
    cardDivider: {
        marginTop: normalize(10),
        marginBottom: normalize(10),
        height: 1,
        width: '100%',
        backgroundColor: '#F1F5F9',
    },
    updateFooterRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    updateButton: {
        height: normalize(34),
        width: normalize(180),
        borderRadius: normalize(8),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colorpath.ButtonColr,
        borderWidth: 1,
        backgroundColor: '#EFF6FF',
    },
    courseFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    progressCol: {
        flex: 1,
        paddingRight: normalize(10),
        justifyContent: 'center',
    },
    courseActionButton: {
        height: normalize(34),
        minWidth: normalize(112),
        paddingHorizontal: normalize(12),
        borderRadius: normalize(8),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colorpath.ButtonColr,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
    },
    actionButtonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#2C4DB9',
    },
});

/**
 * Mytasks default export.
 *
 * @returns {*}
 */
export default Mytasks 
