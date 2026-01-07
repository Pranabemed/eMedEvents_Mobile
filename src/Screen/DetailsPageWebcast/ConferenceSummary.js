import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RenderHTML from 'react-native-render-html';
import Fonts from '../../Themes/Fonts';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
const ConferenceSummary = ({ conferenceHtml, expandcon,conferShows, width }) => {

    return (
        <>
        <View style={{ paddingHorizontal: normalize(8), paddingVertical: normalize(2), width: "100%" }}>
            <RenderHTML
                contentWidth={width}
                source={conferenceHtml}
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
        </View>
        </>
    );
};

export default ConferenceSummary;
