import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import HtmlTableRenderer from './HtmlTableRenderer';
import Fonts from '../../Themes/Fonts';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';

/**
 * Reusable RefundHtml component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const RefundHtml = ({ refundtext, disclaimerText, refunded, refundExpand, width, webcastdeatils }) => {
    const viewmoreac = webcastdeatils?.refund_policy || '';
    const showButton = viewmoreac.replace(/<\/?[^>]+>/g, '').trim().length > 500;
    const finalRefundText = showButton ? refundtext : { html: viewmoreac };

    return (
        <>
        <View style={{ paddingHorizontal: normalize(15), paddingVertical: normalize(2), width: "100%" }}>
            <HtmlTableRenderer
                width={width}
                source={finalRefundText}
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
             
            {(refunded || !showButton) ?(
                <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 16,
                            color: '#000000',
                        }}>
                        {"Disclaimer"}
                    </Text>
                    <HtmlTableRenderer
                        width={width}
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
            {showButton ? (
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
            ) : null}
        </View>
        </>
    );
};

export default RefundHtml;
