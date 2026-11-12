/**
 * Conference summary screen module. Renders a React Native screen or a screen-scoped support component. Exported members: ConferenceSummary.
 */

import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import HtmlTableRenderer from './HtmlTableRenderer';
import Fonts from '../../Themes/Fonts';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';

const SUMMARY_TAGS_STYLES = {
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
 * Reusable ConferenceSummary component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const ConferenceSummary = memo(({ conferenceHtml, expandcon, conferShows, width, conferenceText }) => {
    const showButton = useMemo(
        () => Boolean(conferenceText && conferenceText.replace(/<\/?[^>]+>/g, '').trim().length > 300),
        [conferenceText],
    );
    const fallbackHtml = useMemo(() => ({ html: conferenceText || '' }), [conferenceText]);
    const finalHtml = showButton ? conferenceHtml : fallbackHtml;

    return (
        <View style={styles.container}>
            <HtmlTableRenderer
                width={width}
                source={finalHtml}
                tagsStyles={SUMMARY_TAGS_STYLES}
            />
            {showButton ? (
                <TouchableOpacity
                    onPress={conferShows}
                    activeOpacity={0.75}
                    style={styles.toggleButton}
                >
                    <Text style={styles.toggleButtonText}>
                        {expandcon ? 'View less' : 'View more'}
                    </Text>
                    <Feather
                        name={expandcon ? 'chevron-up' : 'chevron-down'}
                        size={15}
                        color={Colorpath.ButtonColr}
                    />
                </TouchableOpacity>
            ) : null}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
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
 * Conference summary default export.
 *
 * @returns {*}
 */
export default ConferenceSummary;
