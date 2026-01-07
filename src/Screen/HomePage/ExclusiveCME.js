import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import Fonts from "../../Themes/Fonts";
import CalIcon from 'react-native-vector-icons/FontAwesome5'
import normalize from '../../Utils/Helpers/Dimen';
import Imagepath from "../../Themes/Imagepath";
const CMEExclusive = ({ item, index }) => {
    console.log(item,"item-----------------")
    return (
        <View>
            <View style={{
                justifyContent: "center",
                alignSelf: "center",
                paddingVertical: normalize(10),
                paddingHorizontal: normalize(2),
                margin: 5
            }}>
                <View
                    style={{
                        width: normalize(270),
                        borderRadius: normalize(10),
                        backgroundColor: "#FFFFFF",
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(7),
                    }}
                >
                    <ImageBackground
                        source={{uri:item?.conference_image}}
                        style={{
                            alignSelf: 'center',
                            height: normalize(80),
                            width: normalize(260)
                        }}
                        imageStyle={{
                             borderTopLeftRadius:normalize(10),
                             borderTopRightRadius:normalize(10)
                            }}
                        resizeMode="cover"
                    />
                    <Text
                        numberOfLines={2}
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 16,
                            color: "#000000",
                            fontWeight: "bold",
                            flexShrink: 1,
                            flexWrap: 'wrap',
                            paddingVertical: 2
                        }}
                    >
                        {item?.title}
                    </Text>
                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#999999" }}>
                        {"By eMedEd"}
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: normalize(10) }}>
                        <CalIcon name="calendar" size={20} color="#000000" />
                        <Text style={{
                            fontSize: 14,
                            color: '#000000',
                            fontFamily: Fonts.InterRegular,
                            marginLeft: normalize(5),
                        }}>
                            {`Topics - ${item?.bundle_topic_count} | Courses in bundle - ${item?.bundle_sub_conf_count}`}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: normalize(0) }}>
                        <Image source={Imagepath.CreditValut} style={{ height: normalize(20), width: normalize(17), resizeMode: "contain" }} />
                        <Text style={{
                            fontSize: 14,
                            color: '#000000',
                            fontFamily: Fonts.InterRegular,
                            marginLeft: normalize(5),
                        }}>
                            {`${item?.cme_points_popovar[0]?.name} ...`}
                        </Text>
                    </View>
                    <View style={{ marginTop: normalize(10), height: 1, width: '100%', backgroundColor: "#DDDDDD" }} />

                    <View style={{ alignItems: "flex-end", marginTop: normalize(10) }}>

                        <Text
                            style={{
                                fontFamily: Fonts.InterSemiBold,
                                fontSize: 18,
                                color: "#2C4DB9",
                            }}
                        >
                            {`${item?.display_currency_code}${item?.display_price}`}
                        </Text>

                    </View>
                </View>
            </View>
        </View>

    )
}
export default CMEExclusive 