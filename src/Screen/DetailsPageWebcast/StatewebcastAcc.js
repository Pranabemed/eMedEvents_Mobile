import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import RenderHTML from 'react-native-render-html';
const StatewebcastAcc = ({ width, acc_source, expandedacc, webcastdeatils, toggleExpansionacc }) => {
    return (
        <>
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
                    {'Accreditation & Credits'}
                </Text>
            </View>
            <View style={{ paddingHorizontal: normalize(15), paddingVertical: normalize(2), width: "100%" }}>
                <RenderHTML
                    contentWidth={width}
                    source={acc_source}
                    tagsStyles={{
                        p: {
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: '#000000', marginVertical: 0
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
                <Text
                    style={{
                        fontFamily: Fonts.InterSemiBold,
                        fontSize: 16,
                        color: '#000000',
                        // paddingVertical: normalize(5),
                    }}>
                    {expandedacc &&
                        Array.isArray(webcastdeatils?.cmeCreditsData) &&
                        webcastdeatils.cmeCreditsData
                            .filter(
                                (item) =>
                                    item?.points !== undefined &&
                                    item?.name !== undefined &&
                                    !isNaN(+item.points)
                            )
                            .map((item) => `${+item.points} ${item.name}`)
                            .join(' | ')}
                </Text>

                <TouchableOpacity
                    onPress={toggleExpansionacc}
                    style={{
                        marginTop: normalize(3)
                    }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 16,
                            color: Colorpath.ButtonColr,
                        }}>
                        {expandedacc ? 'View less' : 'View more'}
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default StatewebcastAcc