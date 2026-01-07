import { View, Text, Platform, FlatList, TouchableOpacity, ScrollView, BackHandler } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
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
const Mytasks = (props) => {
    console.log(props?.route?.params?.taskData, "props?.route?.params?.taskData?.taskData", props?.route?.params?.backget?.taskData)
        const { isConnected,fulldashbaord,setAddit } = useContext(AppContext);
    const taskPress = () => {
        const getAda = fulldashbaord?.[0];
        setAddit(getAda);
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: "TabNav", params: { initialRoute: "Home" } }
                ],
            })
        );
        // props.navigation.goBack();
    };
     const [conn, setConn] = useState("")
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
    }, [isfocused])
    const [tasks, setTasks] = useState(false);
    const [finalTask, setFinalTask] = useState([]);
    useEffect(() => {
        if (props?.route?.params?.taskData?.taskData) {
            const taskData = props?.route?.params?.taskData?.taskData;
            const allStatesItem = { title: props?.route?.params?.taskData?.creditID?.state_name, button_display_text: "Update" };
            const updatedStateDataArray = [...taskData, allStatesItem];
            setFinalTask(updatedStateDataArray);
        }
    }, [props?.route?.params?.taskData])
    useEffect(() => {
        if (props?.route?.params?.backget?.taskData?.taskData) {
            const backgetAll = props?.route?.params?.backget?.taskData?.taskData;
            const allStatesItem = { title: props?.route?.params?.backget?.creditID?.state_name, button_display_text: "Update" };
            const updatedStateDataArray = [...backgetAll, allStatesItem];
            setFinalTask(updatedStateDataArray);
        }
    }, [props?.route?.params?.backget])
    const taskAction = (taskID) => {
        const url_webcast = taskID?.detailpage_url;
        const result_final = url_webcast.split('/').pop();
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
            props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result_final, creditData: props?.route?.params?.taskData || props?.route?.params?.backget?.taskData } })
        }
    }
    const mytasktitleUrl = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = urltitle.split('/').pop();
        console.log(resulttitle, "webcast url=======", make);
        if (resulttitle) {
            props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, creditData: props?.route?.params?.taskData || props?.route?.params?.backget?.taskData } })
        }
    }
    console.log(finalTask, "finalTask------")
    const mytaskparticularData = ({ item, index }) => {
        console.log(item, "item?.completed_percentage======")
        const formatDatetask = (taskrole) => {
            const date = moment(taskrole, "DD MMM'YY");
            return date.format("MMM D").replace(' ', '');
        };
        const finalDataTasking = formatDatetask(item?.startdate);
        const formatDateEndtask = (taskrole) => {
            const date = moment(taskrole, "DD MMM'YY");
            return date.format("MMM D, YY").replace('', '');
        };
        const finalEndDateTasking = formatDateEndtask(item?.enddate);
        return (
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
                        {item?.organization_name && <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), marginLeft: normalize(5), borderRadius: normalize(20), backgroundColor: "#FFF2E0" }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#666" }}>
                                {item?.organization_name}
                            </Text>
                        </View>}
                        <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                            <TouchableOpacity onPress={() => {
                                if (item?.button_display_text !== "Update") {
                                    mytasktitleUrl(item);
                                }
                            }}>
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 16,
                                        color: "#000000",
                                        fontWeight: "bold",
                                        flexShrink: 1,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {item?.button_display_text == "Update" ? `Renew ${props?.route?.params?.taskData?.creditID?.state || props?.route?.params?.backget?.creditID?.state_name} State License` : item?.title}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {(item?.startdate || item?.enddate) && <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(5), flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: "#848484",
                                }}
                            >
                                {`Exp: ${FormatDateZone(item?.startdate,item?.enddate)}`}
                            </Text>
                        </View>}
                        {item?.display_cme && <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(5), flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                            <Text

                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 12,
                                    color: "#848484",
                                }}
                            >
                                {item?.display_cme}
                            </Text>
                        </View>}
                        <View style={{ marginTop: normalize(10), height: 1, width: '100%', backgroundColor: "#DDD" }} />
                        {item?.button_display_text == "Update" ? <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", marginTop: normalize(10), width: "100%" }}>
                            <TouchableOpacity
                                onPress={() => {
                                    props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "AddLicense", params: { myTaskask: { addLic: props?.route?.params?.taskData?.creditID || props?.route?.params?.backget?.taskData?.creditID, backData: props?.route?.params?.taskData || props?.route?.params?.backget?.taskData, BackMyTask: "TabNav", backState: props?.route?.params?.taskData?.creditID?.state || props?.route?.params?.backget?.creditID?.state_name } } }] }));
                                }}
                                style={{
                                    height: normalize(30),
                                    width: normalize(180),
                                    borderRadius: normalize(5),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderColor: Colorpath.ButtonColr,
                                    borderWidth: 0.5
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16,
                                        color: "#2C4DB9",
                                    }}
                                >
                                    {item?.button_display_text}
                                </Text>
                            </TouchableOpacity>
                        </View> : <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(10), width: '100%' }}>
                            <View>
                                {item?.completed_percentage === undefined ? <></> : <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                                    <ProgressBarLine tasks={tasks} progress={item?.completed_percentage} height={6} fillColor={"#2C4DB9"} />
                                </View>}
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    if (item?.buttonText === "Revise Course") {
                                        props.navigation.navigate("VideoComponent", { RoleData: item });
                                    } else {
                                        taskAction(item);
                                    }
                                }}
                                style={{
                                    height: normalize(30),
                                    width: normalize(120),
                                    borderRadius: normalize(5),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderColor: Colorpath.ButtonColr,
                                    borderWidth: 0.5
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 16,
                                        color: "#2C4DB9",
                                    }}
                                >
                                    {item?.button_display_text}
                                </Text>
                            </TouchableOpacity>
                        </View>}
                    </View>
                </View>
            </View>

        );
    };
    useEffect(() => {
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
                {conn == false ? <IntOff/> :<View>
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

export default Mytasks 