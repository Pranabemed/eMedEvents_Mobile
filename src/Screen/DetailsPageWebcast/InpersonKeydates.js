import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Fonts from '../../Themes/Fonts'
import Colorpath from '../../Themes/Colorpath'
import DropIcon from 'react-native-vector-icons/AntDesign';
import normalize from '../../Utils/Helpers/Dimen';
const InpersonKeydates = ({wholedata}) => {
    const [show, setShow] = useState(false);
    const [showend, setShowend] = useState(false);
    const [showstart, setShowstart] = useState(false);
    const [showending, setShowending] = useState(false);
console.log(wholedata?.registrationOpen, "wholedata?.registrationOpen")
    return (
        <View style={{ paddingHorizontal: normalize(15), paddingVertical: normalize(5) }}>
            <View style={{ flexDirection: "column" }}>
                {wholedata?.registrationOpen ? <>
                <TouchableOpacity
                    onPress={() => setShow(!show)}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: normalize(5),
                    }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 16, color: "#000000" }}>
                        {"Registrations Open"}
                    </Text>
                    <DropIcon name={show ? "up":"down"}color="#000000" size={20} />
                </TouchableOpacity>
                <View style={{ height: 1, width: "100%", backgroundColor: "#DADADA" }} />
                {show  ? (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <View style={{ height: 6, width: 6, borderRadius: 5, backgroundColor: "#000000" }} />
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#999999", marginLeft: normalize(5) }}>
                            {wholedata?.registrationOpen}
                        </Text>
                    </View>
                ):null}
                </>:null}
                {wholedata?.registrationEnd ?   <>
                 <TouchableOpacity
                    onPress={() => setShowend(!showend)}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: normalize(5),
                    }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 16, color: "#000000" }}>
                        {"Registrations End"}
                    </Text>
                    <DropIcon name={showend ? "up":"down"}color="#000000" size={20} />
                </TouchableOpacity>
                <View style={{ height: 1, width: "100%", backgroundColor: "#DADADA" }} />
                {showend ? (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <View style={{ height: 6, width: 6, borderRadius: 5, backgroundColor: "#000000" }} />
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#999999", marginLeft: normalize(5) }}>
                            {wholedata?.registrationEnd}
                        </Text>
                    </View>
                ):null}
                </>:null}
                 {wholedata?.conferenceStartdate ? <>
                 <TouchableOpacity
                    onPress={() => setShowstart(!showstart)}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: normalize(5),
                    }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 16, color: "#000000" }}>
                        {"Conference Start Date"}
                    </Text>
                    <DropIcon name={showstart ? "up":"down"} color="#000000" size={20} />
                </TouchableOpacity>
                <View style={{ height: 1, width: "100%", backgroundColor: "#DADADA" }} />
                {showstart ? (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <View style={{ height: 6, width: 6, borderRadius: 5, backgroundColor: "#000000" }} />
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#999999", marginLeft: normalize(5) }}>
                            {wholedata?.conferenceStartdate}
                        </Text>
                    </View>
                ):null}
                 </>:null}
                {wholedata?.conferenceEnddate ? <>
                 <TouchableOpacity
                    onPress={() => setShowending(!showending)}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: normalize(5),
                    }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 16, color: "#000000" }}>
                    {"Conference End Date"}
                    </Text>
                    <DropIcon name={showending ? "up":"down"} color="#000000" size={20} />
                </TouchableOpacity>
                <View style={{ height: 1, width: "100%", backgroundColor: "#DADADA" }} />
                {showending ? (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <View style={{ height: 6, width: 6, borderRadius: 5, backgroundColor: "#000000" }} />
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#999999", marginLeft: normalize(5) }}>
                            {wholedata?.conferenceEnddate}
                        </Text>
                    </View>
                ):null}
                 </>:null}
            </View>
        </View>

    )
}

export default InpersonKeydates