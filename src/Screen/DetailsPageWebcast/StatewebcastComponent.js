import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import React from 'react';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
const StatewebcastComponent = ({ item, index, nav,creditData,datawhole }) => {
    console.log(item, "item=======1233",datawhole)
    return (
        <>
            <TouchableOpacity onPress={() => {
                const separateLineorgan = item?.speaker_url;
                const slugOrgan = separateLineorgan.split('/').pop();
                nav.navigate("SpeakerProfile", { fullUrl: { fullUrl: slugOrgan, creditData: creditData, speaks:"speaker", textHo: "fs",Realback:datawhole } });
            }} style={{
                backgroundColor: Colorpath.Pagebg,
                paddingHorizontal: normalize(10),
                paddingVertical: normalize(10),
                margin: normalize(14),
                borderBottomRightRadius: normalize(10),
                borderBottomLeftRadius: normalize(10),
                borderTopStartRadius: normalize(10),
                borderTopEndRadius: normalize(10),
                // shadowColor: "#000",
                // shadowOffset: { height: 2, width: 0 },
                // shadowOpacity: 0.1,
                // elevation: 5,
                // shadowRadius: 5,
                // backgroundColor:"red"
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <View style={{
                        height: normalize(70),
                        width: normalize(70),
                        backgroundColor: '#e9f5f9',
                        borderRadius: normalize(35),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: normalize(10),
                    }}>
                        <ImageBackground
                            source={{ uri: item?.userImage }}
                            style={{
                                height: normalize(70),
                                width: normalize(70),
                            }}
                            imageStyle={{ borderRadius: normalize(60) }}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 18, color: "#000000", fontWeight: "bold" }}>{item?.name}</Text>
                        <Text style={{ paddingVertical: normalize(5), fontFamily: Fonts.InterRegular, fontSize: 14, color: "#333" }}>{item?.designation}</Text>
                        <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#333" }}>{item?.specialities}</Text>
                    </View>
                </View>
            </TouchableOpacity>


        </>
    );
}

export default StatewebcastComponent