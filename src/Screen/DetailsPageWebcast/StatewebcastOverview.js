import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import RenderHTML from 'react-native-render-html'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
const StatewebcastOverview = ({width,source,toggleExpansion,expanded}) => {
    return (
        <View>
            <View
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
                    {'Overview'}
                </Text>
            </View>
            <View style={{ paddingHorizontal: normalize(15), paddingVertical: normalize(2), width: "100%" }}>
                <RenderHTML
                    contentWidth={width}
                    source={source}
                    tagsStyles={{
                        p: {
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: '#000000',
                            marginVertical: 0
                        },
                        ul: {
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: '#000000',
                            marginVertical: 0
                        },
                        li: {
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: "#000000",
                            marginVertical: 0
                        }
                    }}
                />

                <TouchableOpacity
                    onPress={toggleExpansion}
                    style={{
                        marginTop: normalize(5),
                    }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 16,
                            color: Colorpath.ButtonColr,
                        }}>
                        {expanded ? 'View less' : 'View more'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default StatewebcastOverview