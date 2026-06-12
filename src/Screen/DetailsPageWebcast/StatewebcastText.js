import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
const StatewebcastText = ({ webcastdeatils, allSpecailities, expandspecailtar, targetChange }) => {
    console.log(allSpecailities?.length, "allSpecailities-----", webcastdeatils?.targetAudience);
    const specialityShow = ({ index, item }) => {
        return (
            <View style={{ paddingVertical: normalize(3) }}>
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
                        fontWeight: "bold",
                        fontSize: 18,
                        color: '#000000',
                    }}>
                    {'Target Audience'}
                </Text>
            </View>
                <View style={{ marginLeft: normalize(6), paddingRight: normalize(15) }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {webcastdeatils?.targetAudience?.map((item, index) => (
                            <React.Fragment key={`${item}-${index}`}>
                                {specialityShow({ item, index })}
                            </React.Fragment>
                        ))}
                    </ScrollView>
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
                        fontWeight: "bold",
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
