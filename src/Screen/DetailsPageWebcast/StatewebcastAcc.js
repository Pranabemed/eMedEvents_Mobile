/**
 * Statewebcast acc screen module. Renders a React Native screen or a screen-scoped support component. Exported members: StatewebcastAcc.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { memo, useMemo } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import HtmlTableRenderer from './HtmlTableRenderer';

const ACC_TAGS_STYLES = {
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
 * Reusable StatewebcastAcc component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const StatewebcastAcc = memo(({ width, acc_source, expandedacc, webcastdeatils, toggleExpansionacc }) => {
    const viewmore = webcastdeatils?.cme_accreditation || '';
    const showButton = useMemo(
        () => viewmore.replace(/<\/?[^>]+>/g, '').trim().length > 500,
        [viewmore],
    );
    const fallbackSource = useMemo(() => ({ html: viewmore }), [viewmore]);
    const finalSource = showButton ? acc_source : fallbackSource;

    const creditItems = useMemo(() => {
        if (!Array.isArray(webcastdeatils?.cmeCreditsData)) return [];
        return webcastdeatils.cmeCreditsData.filter(
            (item) =>
                item?.points !== undefined &&
                item?.name !== undefined &&
                !isNaN(+item.points),
        );
    }, [webcastdeatils?.cmeCreditsData]);

    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionHeading}>{'Accreditation & Credits'}</Text>
            </View>
            <View style={styles.contentWrap}>
                {viewmore ? (
                    <HtmlTableRenderer
                        width={width}
                        source={finalSource}
                        tagsStyles={ACC_TAGS_STYLES}
                    />
                ) : null}

                {(expandedacc || !showButton) && creditItems.length > 0 ? (
                    <View style={styles.creditChipsWrap}>
                        {creditItems.map((item, idx) => (
                            <View key={`${item?.name || 'credit'}-${idx}`} style={styles.creditChip}>
                                <Feather name="award" size={13} color="#0F766E" />
                                <Text style={styles.creditChipText}>
                                    {`${+item.points} ${item.name}`}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                {showButton ? (
                    <TouchableOpacity
                        onPress={toggleExpansionacc}
                        activeOpacity={0.75}
                        style={styles.toggleButton}
                    >
                        <Text style={styles.toggleButtonText}>
                            {expandedacc ? 'View less' : 'View more'}
                        </Text>
                        <Feather
                            name={expandedacc ? 'chevron-up' : 'chevron-down'}
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
    creditChipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: normalize(8),
        marginTop: normalize(10),
    },
    creditChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDFA',
        borderWidth: 1,
        borderColor: '#CCFBF1',
        borderRadius: normalize(10),
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(6),
        gap: normalize(5),
    },
    creditChipText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
        color: '#0F766E',
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
 * Statewebcast acc default export.
 *
 * @returns {*}
 */
export default StatewebcastAcc;