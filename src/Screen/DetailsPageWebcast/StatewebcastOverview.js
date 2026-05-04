import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import HtmlTableRenderer from './HtmlTableRenderer';

const StatewebcastOverview = ({ width, source, previewText, hasTable, toggleExpansion, expanded, navigation, webcastdeatils, creditData }) => {
    const handleOverviewLink = (href) => {
        if (!href || !navigation) return;

        const normalizedHref = String(href).trim();
        const cleanedHref = normalizedHref.toLowerCase();
        const urlParts = normalizedHref.split('?')[0].split('#')[0].split('/').filter(Boolean);
        const slug = urlParts[urlParts.length - 1] || normalizedHref;

        const isSpeaker = cleanedHref.includes('speaker');

        navigation.navigate("SpeakerProfile", {
            fullUrl: {
                fullUrl: slug,
                creditData,
                speaks: isSpeaker ? "speaker" : "organ",
                showtext: isSpeaker ? "speaker" : "organ",
                textHo: "fs",
                hitDat: webcastdeatils?.conferenceId,
                Realback: webcastdeatils
            }
        });
    };

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
                {(!expanded && hasTable) ? (
                    <View style={{ paddingVertical: normalize(2) }}>
                        <Text
                            numberOfLines={7}
                            ellipsizeMode="tail"
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 16,
                                color: '#000000',
                                lineHeight: 22,
                            }}
                        >
                            {previewText || ' '}
                        </Text>
                    </View>
                ) : (
                    <HtmlTableRenderer
                        width={width}
                        source={source}
                        onLinkPress={handleOverviewLink}
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
                )}

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
