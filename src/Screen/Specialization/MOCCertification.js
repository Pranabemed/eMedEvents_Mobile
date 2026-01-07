import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
const MOCCertification = (props) => {
    const [taketrue, setTaketrue] = useState(false);
    const navigation = useNavigation();
    console.log(props?.route?.params?.boardIdMOC, "boardIdMOC===========")
    const MOChandle = () => {
        navigation.navigate("TabNav", { detectmain: "main" });
    }
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
                    title="MOC Course Recommendations"
                    onBackPress={MOChandle}
                /> : <View>
                    <PageHeader
                        title="MOC Course Recommendations"
                        onBackPress={() => {
                            props.navigation.navigate("TabNav", { detectmain: "main" });
                        }}
                    />
                </View>}

                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000" }}>
                        {"Courses relevant to your specialty(s) to \nearn additional CME credits"}
                    </Text>
                </View>
                <View>
                    <View style={{ justifyContent: "center", alignItems: "center", marginRight: normalize(12), paddingVertical: normalize(0) }}>
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
                                <View style={{ flexDirection: "row", marginTop: normalize(10) }}>
                                    <View style={{ height: normalize(20), width: normalize(60), borderRadius: normalize(20), backgroundColor: "#FFF2E0", justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#000000" }}>
                                            {`${(props?.route?.params?.boardIdMOC?.creditfirst)} / ${(props?.route?.params?.boardIdMOC?.creditsec)} `}
                                        </Text>
                                    </View>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterSemiBold,
                                            fontSize: 14,
                                            color: "#999",
                                            fontWeight: "bold",
                                            paddingHorizontal: normalize(10),
                                            paddingVertical: normalize(3)
                                        }}
                                    >
                                        {"Credits Earned"}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => { props.navigation.navigate("BoardCourse", { FullData: props?.route?.params?.boardIdMOC }) }}>
                                <ArrowIcons
                                    name="keyboard-arrow-right"
                                    size={30}
                                    color={Colorpath.ButtonColr}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

export default MOCCertification