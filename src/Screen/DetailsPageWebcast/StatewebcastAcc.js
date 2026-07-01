/**
 * Statewebcast acc screen module. Renders a React Native screen or a screen-scoped support component. Exported members: StatewebcastAcc.
 */

import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import HtmlTableRenderer from './HtmlTableRenderer';

/**
 * Reusable StatewebcastAcc component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const StatewebcastAcc = ({ width, acc_source, expandedacc, webcastdeatils, toggleExpansionacc }) => {
    const viewmore = webcastdeatils?.cme_accreditation || '';
    const showButton = viewmore.replace(/<\/?[^>]+>/g, '').trim().length > 500;
    const finalSource = showButton ? acc_source : { html: viewmore };

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
                <HtmlTableRenderer
                    width={width}
                    source={finalSource}
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
                    {(expandedacc || !showButton) &&
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

                {showButton ? (
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
                ) : null}
            </View>
        </>
    )
}

/**
 * Statewebcast acc default export.
 *
 * @returns {*}
 */
export default StatewebcastAcc