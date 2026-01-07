import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RenderHTML from 'react-native-render-html';
import Fonts from '../../Themes/Fonts';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
const RefundHtml = ({ refundtext, disclaimerText, refunded, refundExpand, width }) => {

    return (
        <>
        <View style={{ paddingHorizontal: normalize(15), paddingVertical: normalize(2), width: "100%" }}>
            <RenderHTML
                contentWidth={width}
                source={refundtext}
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
             
            {refunded ?(
                <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 16,
                            color: '#000000',
                        }}>
                        {"Disclaimer"}
                    </Text>
                    <RenderHTML
                        contentWidth={width}
                        source={disclaimerText}
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
                </View>
            ):null}
            <TouchableOpacity
                onPress={refundExpand}
                style={{
                    marginTop:normalize(5)
                }}>
                <Text
                    style={{
                        fontFamily: Fonts.InterSemiBold,
                        fontSize: 16,
                        color: Colorpath.ButtonColr,
                    }}>
                    {refunded ? 'View less' : 'View more'}
                </Text>
            </TouchableOpacity>
        </View>
        </>
    );
};

export default RefundHtml;
