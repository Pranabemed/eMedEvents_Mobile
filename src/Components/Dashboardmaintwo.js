import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';
const Dashboardmaintwo = ({ cmeModalFalse, modalFalse, DashboardReducer }) => {
    console.log(DashboardReducer?.dashboardResponse?.data?.user_information?.documents_count,"limi11eet")
    return (
        <View>
            <View style={{ justifyContent: "center", alignItems: "center", margin: normalize(10) }}>
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
                        justifyContent: "space-between",
                        // shadowColor:"#000",
                        // shadowOffset:{height:0,width:0},
                        // elevation:5,
                        // shadowOpacity:4,
                        // shadowRadius:5,
                        borderWidth:0.5,
                        borderColor:"#DADADA"
                    }}
                >
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: normalize(10),
                        }}
                    >
                        <Image source={Imagepath.Money} style={{ height: normalize(35), width: normalize(35), resizeMode: "contain" }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <View style={{ flexDirection: "row",gap:normalize(5)}}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 16,
                                    color: "#000000",
                                    fontWeight: "bold",
                                }}
                            >
                                {"My CE Expenses"}
                            </Text>
                            <Image source={Imagepath.Crown} style={{marginTop:normalize(2),height: normalize(15), width: normalize(15), resizeMode: "contain" }} />
                        </View>
                        {DashboardReducer?.dashboardResponse?.data?.user_information?.allowance_limit == 0  || DashboardReducer?.dashboardResponse?.data?.user_information?.total_expenses == 0 ? null :(<View style={{ flexDirection: "row", marginTop: normalize(5) }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: "#999",
                                    fontWeight: "bold",
                                }}
                            >
                                {"Limit-"}
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
                                ${`${DashboardReducer?.dashboardResponse?.data?.user_information?.allowance_limit}`}
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
                                {"Spend-"}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: "#000000",
                                    fontWeight: "bold",
                                }}
                            >
                                ${`${Number(DashboardReducer?.dashboardResponse?.data?.user_information?.total_expenses).toFixed(2)}`}
                            </Text>
                        </View>)}
                        
                    </View>
                    <TouchableOpacity onPress={cmeModalFalse} style={{ position: "absolute", top: 0, right: 0 }}>
                        <Image source={Imagepath.Info} style={{ height: normalize(18), width: normalize(18), resizeMode: 'contain' }} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", margin: 0 }}>
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
                        // shadowColor:"#000",
                        // shadowOffset:{height:0,width:0},
                        // elevation:5,
                        // shadowOpacity:4,
                        // shadowRadius:5,
                        position:"relative",
                        borderWidth:0.5,
                        borderColor:"#DADADA"
                         
                    }}
                >
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: normalize(10),
                        }}
                    >
                        <Image
                            source={Imagepath.Docment}
                            style={{ height: normalize(35), width: normalize(35), resizeMode: "contain" }}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 16,
                                    color: "#000000",
                                    fontWeight: "bold",
                                }}
                            >
                                {"My Document Vault"}
                            </Text>
                            <Image
                                source={Imagepath.Crown}
                                style={{ marginLeft: normalize(5), height: normalize(15), width: normalize(15), resizeMode: "contain" }}
                            />
                        </View>
                        {DashboardReducer?.dashboardResponse?.data?.user_information?.documents_count == 0  ? null :(<View style={{ flexDirection: "row", marginTop: normalize(5) }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: "#999",
                                    fontWeight: "bold",
                                }}
                            >
                                {"Documents Uploaded-"}
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
                                {DashboardReducer?.dashboardResponse?.data?.user_information?.documents_count}
                            </Text>
                        </View>) }
                        
                    </View>
                    <TouchableOpacity onPress={modalFalse} style={{ position: "absolute", top: 0, right: 0 }}>
                        <Image
                            source={Imagepath.Info}
                            style={{ height: normalize(18), width: normalize(18), resizeMode: 'contain' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

export default Dashboardmaintwo