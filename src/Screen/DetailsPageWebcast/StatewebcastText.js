import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
const StatewebcastText = ({ webcastdeatils, allSpecailities, expandspecailtar, targetChange }) => {
    console.log(allSpecailities?.length, "allSpecailities-----", webcastdeatils?.targetAudience);
    const specialityShow = ({ index, item }) => {
        return (
            <View style={{paddingVertical:normalize(3)}}>
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
        <View>
            {webcastdeatils?.targetAudience?.length > 0 ? <><View
                style={{
                    paddingHorizontal: normalize(15),
                    paddingVertical: normalize(10),
                }}>
                <Text
                    style={{
                        fontFamily: Fonts.InterBold,
                        fontWeight:"bold",
                        fontSize: 18,
                        color: '#000000',
                    }}>
                    {'Target Audience'}
                </Text>
            </View>
                <View style={{marginLeft:normalize(6)}}>
                    {!expandspecailtar && <FlatList
                        data={webcastdeatils?.targetAudience?.slice(0, 3)}
                        horizontal
                        renderItem={specialityShow}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        ListFooterComponent={
                            webcastdeatils?.targetAudience?.length > 4 &&<TouchableOpacity onPress={targetChange}>
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
                    {webcastdeatils?.targetAudience?.length > 4 && expandspecailtar && <FlatList
                        data={expandspecailtar ? webcastdeatils?.targetAudience : []}
                        renderItem={specialityShow}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={
                            <TouchableOpacity onPress={targetChange}>
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
                                        {expandspecailtar ? "View less" : null}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        }
                    />}
                </View>
            </> : null}
            {allSpecailities?.length > 0 ? <View
                style={{
                    paddingHorizontal: normalize(15),
                    marginTop: normalize(10),
                }}>
                <Text
                    style={{
                        fontFamily: Fonts.InterBold,
                        fontWeight:"bold",
                        fontSize: 18,
                        color: '#000000',
                    }}>
                    {"Specialties"}
                </Text>
            </View> : null}
        </View>
    )
}

export default StatewebcastText