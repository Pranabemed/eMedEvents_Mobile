/**
 * Statewebcast overview screen module. Renders a React Native screen or a screen-scoped support component. Exported members: StatewebcastOverview, handleOverviewLink.
 */

import { Linking, View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import HtmlTableRenderer from './HtmlTableRenderer';

/**
 * Reusable StatewebcastOverview component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const StatewebcastOverview = ({ width, source, previewText, hasTable, toggleExpansion, expanded, navigation, webcastdeatils, creditData }) => {
        /**
 * Normalizes a link into an absolute URL.
 * @param {*} href - Input value.
 * @returns {string}
 */
const normalizeAbsoluteUrl = (href) => {
        const value = String(href || '').trim();
        if (!value) return '';

        if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
            return value;
        }

        if (value.startsWith('/')) {
            return `https://www.emedevents.com${value}`;
        }

        return `https://${value}`;
    };

        /**
 * Handles overview link.
 * @param {*} href - Input value.
 * @returns {void}
 */
const handleOverviewLink = (href) => {
        if (!href || !navigation) return;

        const normalizedHref = normalizeAbsoluteUrl(href);
        if (!normalizedHref) return;

        const cleanedHref = normalizedHref.toLowerCase();
        const urlParts = normalizedHref.split('?')[0].split('#')[0].split('/').filter(Boolean);
        const slug = urlParts[urlParts.length - 1] || normalizedHref;

        const isSpeaker = cleanedHref.includes('/speaker/') || cleanedHref.includes('speaker-profile');
        const isOrganizer = cleanedHref.includes('/organizer/') || cleanedHref.includes('/organiser/');
        const isBlogArticle = cleanedHref.includes('/blogs/medblogpage/') || cleanedHref.includes('/blog/');

        if (isBlogArticle) {
            Linking.openURL(normalizedHref).catch(error => {
                console.log('Failed to open blog URL:', error);
            });
            return;
        }

        if (!isSpeaker && !isOrganizer) {
            Linking.openURL(normalizedHref).catch(error => {
                console.log('Failed to open external URL:', error);
            });
            return;
        }

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

    const htmlText = webcastdeatils?.overView || '';
    const cleanText = htmlText.replace(/<\/?[^>]+>/g, '').trim();
    const showButton = cleanText.length > 500 || htmlText.toLowerCase().includes('<table');

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
                        source={showButton ? source : { html: htmlText }}
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

                {showButton ? (
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
                ) : null}
            </View>
        </View>
    )
}

/**
 * Statewebcast overview default export.
 *
 * @returns {*}
 */
export default StatewebcastOverview
