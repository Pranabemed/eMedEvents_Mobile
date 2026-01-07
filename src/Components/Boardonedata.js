import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import CapIcon from 'react-native-vector-icons/Entypo';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';
import { useSelector } from 'react-redux';
import Colorpath from '../Themes/Colorpath';
const Boardonedata = ({completedCountboard,pendingCountboard,finalShow}) => {
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    return (
        <>
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: finalShow?.length == 1 ? normalize(10) : 0 }}>
                <View
                    style={{
                        flexDirection: "row",
                        height: normalize(60),
                        width: normalize(290),
                        borderRadius: normalize(10),
                        backgroundColor: "#FFFFFF",
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(10),
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: normalize(40),
                            width: normalize(40),
                            borderRadius: normalize(40),
                            backgroundColor: "#FFFFFF",
                            shadowColor: "#c3e9ff",
                            shadowOffset: { height: 0, width: 0 },
                            shadowOpacity: 10,
                            elevation: 5,
                            marginRight: normalize(10),
                        }}
                    >
                        <CapIcon name="graduation-cap" color={"#000000"} size={30} />
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text
                            style={{
                                fontFamily: Fonts.InterSemiBold,
                                fontSize: 16,
                                color: "#000000",
                                fontWeight: "bold",
                            }}
                        >
                            {"My MOC Courses"}
                        </Text>
                        {completedCountboard == 0 || pendingCountboard == 0 ? null : (<View style={{ flexDirection: "row", marginTop: normalize(5) }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: "#999",
                                    fontWeight: "bold",
                                }}
                            >
                                {"Completed-"}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: "#000000",
                                    fontWeight: "bold",
                                    paddingHorizontal: normalize(5),
                                }}
                            >
                                {completedCountboard}
                            </Text>
                            <View style={{ height: 20, width: 1, backgroundColor: "#DDDDDD" }} />
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: "#999",
                                    fontWeight: "bold",
                                    paddingHorizontal: normalize(5),
                                }}
                            >
                                {"Pending-"}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: "#000000",
                                    fontWeight: "bold",
                                }}
                            >
                                {pendingCountboard}
                            </Text>
                        </View>)}
                    </View>
                    {/* <TouchableOpacity>
                                    <ArrowIcons
                                        name="keyboard-arrow-right"
                                        size={30}
                                        color={Colorpath.ButtonColr}
                                    />
                                </TouchableOpacity> */}
                </View>
            </View>
            {DashboardReducer?.stateDashboardResponse?.data?.tasks_data?.due_in_30_days?.length > 0 && <View style={{ justifyContent: "space-evenly", alignContent: "space-evenly", flexDirection: "row", margin: normalize(10) }}>
                <View
                    style={{
                        flexDirection: "row",
                        height: normalize(60),
                        width: normalize(140),
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
                            {`${DashboardReducer?.stateDashboardResponse?.data?.tasks_data?.due_in_30_days?.length} Task(s)`}
                        </Text>
                        <View style={{ marginTop: normalize(5) }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 14,
                                    color: "#FF5E62",
                                    fontWeight: "bold",
                                }}
                            >
                                {"Due in 30 Days"}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <ArrowIcons
                            name="keyboard-arrow-right"
                            size={30}
                            color={Colorpath.ButtonColr}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        height: normalize(60),
                        width: normalize(140),
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
                            {`${DashboardReducer?.stateDashboardResponse?.data?.tasks_data?.due_in_60_days?.length} Task(s)`}
                        </Text>
                        <View style={{ marginTop: normalize(5) }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterMedium,
                                    fontSize: 14,
                                    color: "#F1AC4B",
                                    fontWeight: "bold",
                                }}
                            >
                                {"Due in 60 Days"}
                            </Text>
                        </View>
                    </View>
                    {DashboardReducer?.stateDashboardResponse?.data?.tasks_data?.due_in_60_days?.length > 0 ? <TouchableOpacity>
                        <ArrowIcons
                            name="keyboard-arrow-right"
                            size={30}
                            color={Colorpath.ButtonColr}
                        />
                    </TouchableOpacity> : undefined}
                </View>
            </View>}
        </>
    )
}

export default Boardonedata