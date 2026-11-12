/**
 * Statewebcast overview screen module. Renders a React Native screen or a screen-scoped support component. Exported members: StatewebcastOverview, handleOverviewLink.
 */

import { Linking, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { memo, useMemo, useCallback } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import HtmlTableRenderer from './HtmlTableRenderer';

const HTML_TAGS_STYLES = {
    p: {
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        lineHeight: 21,
        color: '#334155',
        marginVertical: 3,
    },
    ul: {
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        lineHeight: 21,
        color: '#334155',
        marginVertical: 4,
    },
    li: {
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        lineHeight: 21,
        color: '#334155',
        marginVertical: 2,
    },
};

/**
 * Reusable StatewebcastOverview component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const StatewebcastOverview = memo(({ width, source, previewText, hasTable, toggleExpansion, expanded, navigation, webcastdeatils, creditData }) => {
    /**
     * Normalizes a link into an absolute URL.
     * @param {*} href - Input value.
     * @returns {string}
     */
    const normalizeAbsoluteUrl = useCallback((href) => {
        const value = String(href || '').trim();
        if (!value) return '';

        if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
            return value;
        }

        if (value.startsWith('/')) {
            return `https://www.emedevents.com${value}`;
        }

        return `https://${value}`;
    }, []);

    /**
     * Handles overview link.
     * @param {*} href - Input value.
     * @returns {void}
     */
    const handleOverviewLink = useCallback((href) => {
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
                Realback: webcastdeatils,
            },
        });
    }, [creditData, navigation, normalizeAbsoluteUrl, webcastdeatils]);

    const htmlText = webcastdeatils?.overView || '';
    const cleanText = useMemo(() => htmlText.replace(/<\/?[^>]+>/g, '').trim(), [htmlText]);
    const showButton = cleanText.length > 500 || htmlText.toLowerCase().includes('<table');
    const fallbackSource = useMemo(() => ({ html: htmlText }), [htmlText]);

    if (!cleanText && !htmlText) {
        return null;
    }

    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionHeading}>{'Overview'}</Text>
            </View>
            <View style={styles.contentWrap}>
                {(!expanded && hasTable) ? (
                    <Text
                        numberOfLines={7}
                        ellipsizeMode="tail"
                        style={styles.previewText}
                    >
                        {previewText || ' '}
                    </Text>
                ) : (
                    <HtmlTableRenderer
                        width={width}
                        source={showButton ? source : fallbackSource}
                        onLinkPress={handleOverviewLink}
                        tagsStyles={HTML_TAGS_STYLES}
                    />
                )}

                {showButton ? (
                    <TouchableOpacity
                        onPress={toggleExpansion}
                        activeOpacity={0.75}
                        style={styles.toggleButton}
                    >
                        <Text style={styles.toggleButtonText}>
                            {expanded ? 'View less' : 'View more'}
                        </Text>
                        <Feather
                            name={expanded ? 'chevron-up' : 'chevron-down'}
                            size={15}
                            color={Colorpath.ButtonColr}
                        />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    sectionCard: {
        backgroundColor: Colorpath.white,
        borderRadius: normalize(14),
        borderWidth: 1,
        borderColor: '#E5ECF6',
        marginHorizontal: normalize(12),
        marginTop: normalize(12),
        padding: normalize(14),
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(8),
    },
    sectionAccent: {
        width: normalize(3.5),
        height: normalize(16),
        borderRadius: normalize(2),
        backgroundColor: Colorpath.ButtonColr,
        marginRight: normalize(8),
    },
    sectionHeading: {
        fontFamily: Fonts.InterBold,
        fontWeight: '700',
        fontSize: 16,
        color: '#0F172A',
    },
    contentWrap: {
        width: '100%',
    },
    previewText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        color: '#334155',
        lineHeight: 21,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: normalize(10),
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(6),
        borderRadius: normalize(20),
        backgroundColor: '#EEF4FF',
        gap: normalize(4),
    },
    toggleButtonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
        color: Colorpath.ButtonColr,
    },
});

/**
 * Statewebcast overview default export.
 *
 * @returns {*}
 */
export default StatewebcastOverview;
