import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
const StatewebcastSpeciality = ({ allSpecailities, specailityChange, expandspecail }) => {
    const specialityShow = ({ index, item }) => {
        return (
            <View style={{paddingVertical:normalize(5)}}>
                <View style={{ padding: 10, borderWidth: 0.5, borderColor: "#DDDDDD", paddingVertical: normalize(7), marginLeft: normalize(8), backgroundColor: "#F5FAFF", borderRadius: normalize(5) }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: '#000000',
                            alignSelf: "center"
                        }}>
                        {item}
                    </Text>
                </View>
            </View>
        )
    }
    return (
        <View style={{ paddingVertical: normalize(0),marginLeft:normalize(6) }}>
            {!expandspecail && <FlatList
                horizontal
                data={allSpecailities?.slice(0, 3)}
                renderItem={specialityShow}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={
                    allSpecailities?.length > 4 &&<TouchableOpacity onPress={specailityChange}>
                        <View style={{
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            width: "100%",
                        }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 16,
                                    color: Colorpath.ButtonColr,
                                }}>
                                {"View more"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }

            />}
            {allSpecailities?.length > 4 && expandspecail && <FlatList
                data={expandspecail ? allSpecailities : []}
                renderItem={specialityShow}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <TouchableOpacity onPress={specailityChange}>
                        <View style={{
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            width: "100%"
                        }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 16,
                                    color: Colorpath.ButtonColr,
                                }}>
                                {expandspecail ? "View less" : null}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            />}
        </View>
    )
}

export default StatewebcastSpeciality