/**
 * Refund screen module. Renders a React Native screen or a screen-scoped support component. Exported members: RefundHtml.
 */

import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import HtmlTableRenderer from './HtmlTableRenderer';
import Fonts from '../../Themes/Fonts';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';

const POLICY_TAGS_STYLES = {
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
 * Reusable RefundHtml component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const RefundHtml = memo(({ refundtext, disclaimerText, refunded, refundExpand, width, webcastdeatils }) => {
    const viewmoreac = webcastdeatils?.refund_policy || '';
    const showButton = useMemo(
        () => viewmoreac.replace(/<\/?[^>]+>/g, '').trim().length > 500,
        [viewmoreac],
    );
    const fallbackRefundText = useMemo(() => ({ html: viewmoreac }), [viewmoreac]);
    const finalRefundText = showButton ? refundtext : fallbackRefundText;

    return (
        <View style={styles.container}>
            <HtmlTableRenderer
                width={width}
                source={finalRefundText}
                tagsStyles={POLICY_TAGS_STYLES}
            />

            {(refunded || !showButton) ? (
                <View style={styles.disclaimerWrap}>
                    <Text style={styles.disclaimerHeading}>{"Disclaimer"}</Text>
                    <HtmlTableRenderer
                        width={width}
                        source={disclaimerText}
                        tagsStyles={POLICY_TAGS_STYLES}
                    />
                </View>
            ) : null}

            {showButton ? (
                <TouchableOpacity
                    onPress={refundExpand}
                    activeOpacity={0.75}
                    style={styles.toggleButton}
                >
                    <Text style={styles.toggleButtonText}>
                        {refunded ? 'View less' : 'View more'}
                    </Text>
                    <Feather
                        name={refunded ? 'chevron-up' : 'chevron-down'}
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
    disclaimerWrap: {
        marginTop: normalize(12),
        paddingTop: normalize(12),
        borderTopWidth: 1,
        borderTopColor: '#E5ECF6',
    },
    disclaimerHeading: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#0F172A',
        marginBottom: normalize(4),
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
 * Refund default export.
 *
 * @returns {*}
 */
export default RefundHtml;
