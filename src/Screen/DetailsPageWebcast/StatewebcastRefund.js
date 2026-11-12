/**
 * Statewebcast refund screen module. Renders a React Native screen or a screen-scoped support component. Exported members: StatewebcastRefund.
 */

import { View, Text, StyleSheet } from 'react-native';
import React, { memo } from 'react';
import ConferenceSummary from './ConferenceSummary';
import RefundHtml from './Refund';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';

/**
 * Reusable StatewebcastRefund component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const StatewebcastRefund = memo(({ conferenceText, conferenceHtml, expandcon, conferShows, width, webcastdeatils, refundtext, disclaimerText, refunded, refundExpand }) => {
    const showRefundCard = Boolean(webcastdeatils?.refund_policy && webcastdeatils?.disclaimer);

    if (!conferenceText && !showRefundCard) {
        return null;
    }

    return (
        <View>
            {conferenceText ? (
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={styles.sectionAccent} />
                        <Text style={styles.sectionHeading}>{"Conference & Summary"}</Text>
                    </View>
                    <ConferenceSummary
                        conferenceHtml={conferenceHtml}
                        expandcon={expandcon}
                        conferShows={conferShows}
                        width={width}
                        conferenceText={conferenceText}
                    />
                </View>
            ) : null}
            {showRefundCard ? (
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={styles.sectionAccent} />
                        <Text style={styles.sectionHeading}>{"Refund, Cancellation Policy & Disclaimer"}</Text>
                    </View>
                    <RefundHtml
                        refundtext={refundtext}
                        disclaimerText={disclaimerText}
                        refunded={refunded}
                        refundExpand={refundExpand}
                        width={width}
                        webcastdeatils={webcastdeatils}
                    />
                </View>
            ) : null}
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
        flex: 1,
    },
});

/**
 * Statewebcast refund default export.
 *
 * @returns {*}
 */
export default StatewebcastRefund;