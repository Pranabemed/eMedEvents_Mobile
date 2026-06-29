import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import HtmlTableRenderer from './HtmlTableRenderer';
import Fonts from '../../Themes/Fonts';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';

/**
 * Reusable ConferenceSummary component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const ConferenceSummary = ({ conferenceHtml, expandcon, conferShows, width, conferenceText }) => {
    const showButton = conferenceText && conferenceText.replace(/<\/?[^>]+>/g, '').trim().length > 300;
    const finalHtml = showButton ? conferenceHtml : { html: conferenceText || '' };

    return (
        <>
        <View style={{ paddingHorizontal: normalize(8), paddingVertical: normalize(2), width: "100%" }}>
            <HtmlTableRenderer
                width={width}
                source={finalHtml}
                tagsStyles={{
                    p: {
                        fontFamily: Fonts.InterMedium,
                        fontSize: 16,
                        color: '#000000', 
                        marginVertical: normalize(5)
                    },
                    ul: {
                        fontFamily: Fonts.InterMedium,
                        fontSize: 16,
                        color: '#000000'
                    },
                    li: {
                        fontFamily: Fonts.InterMedium,
                        fontSize: 16,
                        color: "#000000"
                    }
                }}
            />
            {showButton ? (
                <TouchableOpacity
                    onPress={conferShows}
                    style={{
                        paddingHorizontal: normalize(0),
                        paddingVertical: normalize(10),
                    }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 16,
                            color: Colorpath.ButtonColr,
                        }}>
                        {expandcon ? 'View less' : 'View more'}
                    </Text>
                </TouchableOpacity>
            ) : null}
        </View>
        </>
    );
};

export default ConferenceSummary;
