import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import IconDot from 'react-native-vector-icons/Entypo';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import Imagepath from '../../Themes/Imagepath';
const MandatoryCertificate = ({ item }) => {
    return (
        <View>
            <View style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(8) }}>
                <View
                    style={{
                        flexDirection: "column",
                        width: normalize(297),
                        borderRadius: normalize(10),
                        backgroundColor: "#FFFFFF",
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(10),
                        alignItems: "flex-start",
                        borderWidth: 0.5,
                        borderColor: "#AAAAAA"
                    }}
                >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                            <Image source={Imagepath.VaultCer} style={{ height: normalize(20), width: normalize(20), resizeMode: "contain" }} />
                            <Text
                                numberOfLines={2}
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 16,
                                    color: "#000000",
                                    fontWeight: "bold",
                                    flexShrink: 1,
                                    flexWrap: 'wrap',
                                    marginLeft: normalize(10)
                                }}
                            >
                                {"Pediatric Nephrology: Recognition and Initial Management of Common Renal..."}
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <IconDot name="dots-three-vertical" size={25} color={"#848484"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </View>
    )
}

export default MandatoryCertificate