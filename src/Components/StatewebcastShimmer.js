import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import normalize from '../Utils/Helpers/Dimen';

/**
 * Reusable StatewebcastShimmer component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const { width: windowWidth } = Dimensions.get('window');

const StatewebcastShimmer = () => {
    const BG = '#E8EFF7';
    const HL = '#F5F8FF';

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: normalize(100) }}
        >
            {/* ── TOP SECTION (blue background card) ── */}
            <View style={styles.topSection}>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL}>
                    {/* Badge: HYBRID EVENT */}
                    <View style={styles.badge} />

                    {/* Title – 2 lines */}
                    <View style={[styles.titleLine, { marginTop: normalize(12), width: '90%' }]} />
                    <View style={[styles.titleLine, { marginTop: normalize(8), width: '70%' }]} />

                    {/* Course by organizer */}
                    <View style={[styles.subLine, { marginTop: normalize(12), width: '75%' }]} />

                    {/* Date */}
                    <View style={[styles.subLine, { marginTop: normalize(12), width: '55%' }]} />

                    {/* Location */}
                    <View style={[styles.subLine, { marginTop: normalize(8), width: '65%' }]} />

                    {/* Credits */}
                    <View style={[styles.subLine, { marginTop: normalize(8), width: '72%' }]} />

                    {/* Price */}
                    <View style={[styles.priceLine, { marginTop: normalize(14) }]} />

                    {/* Register button */}
                    <View style={[styles.registerBtn, { marginTop: normalize(14) }]} />
                </SkeletonPlaceholder>
            </View>

            {/* ── OVERVIEW SECTION ── */}
            <View style={styles.whiteSection}>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL}>
                    {/* "Overview" heading */}
                    <View style={[styles.sectionTitle, { width: '35%' }]} />

                    {/* Overview body text – 6 lines */}
                    <View style={[styles.textLine, { marginTop: normalize(14), width: '100%' }]} />
                    <View style={[styles.textLine, { marginTop: normalize(8), width: '95%' }]} />
                    <View style={[styles.textLine, { marginTop: normalize(8), width: '100%' }]} />
                    <View style={[styles.textLine, { marginTop: normalize(8), width: '90%' }]} />
                    <View style={[styles.textLine, { marginTop: normalize(8), width: '97%' }]} />
                    <View style={[styles.textLine, { marginTop: normalize(8), width: '80%' }]} />

                    {/* "View more" link placeholder */}
                    <View style={[styles.viewMoreLine, { marginTop: normalize(14) }]} />
                </SkeletonPlaceholder>
            </View>

            {/* ── ACCREDITATION SECTION skeleton ── */}
            <View style={[styles.whiteSection, { marginTop: normalize(10) }]}>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL}>
                    <View style={[styles.sectionTitle, { width: '45%' }]} />
                    <View style={[styles.textLine, { marginTop: normalize(14), width: '100%' }]} />
                    <View style={[styles.textLine, { marginTop: normalize(8), width: '85%' }]} />
                    <View style={[styles.textLine, { marginTop: normalize(8), width: '92%' }]} />
                </SkeletonPlaceholder>
            </View>

            {/* ── FACULTY SECTION skeleton ── */}
            <View style={[styles.whiteSection, { marginTop: normalize(10) }]}>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL}>
                    <View style={[styles.sectionTitle, { width: '30%' }]} />

                    {/* Faculty cards row */}
                    <View style={{ flexDirection: 'row', marginTop: normalize(14), gap: normalize(12) }}>
                        <View style={styles.facultyCard} />
                        <View style={styles.facultyCard} />
                        <View style={styles.facultyCard} />
                    </View>
                </SkeletonPlaceholder>
            </View>

            {/* ── BOTTOM CHECKOUT BAR skeleton ── */}
            <View style={styles.checkoutBar}>
                <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Total price on the left */}
                        <View>
                            <View style={{ width: normalize(50), height: normalize(12), borderRadius: 4 }} />
                            <View style={{ width: normalize(80), height: normalize(20), borderRadius: 4, marginTop: normalize(6) }} />
                        </View>
                        {/* Register button on the right */}
                        <View style={styles.checkoutBtn} />
                    </View>
                </SkeletonPlaceholder>
            </View>
        </ScrollView>
    );
};

export default StatewebcastShimmer;

const CONTENT_PADDING = normalize(14);

const styles = StyleSheet.create({
    /* ── Top blue-ish card ── */
    topSection: {
        backgroundColor: '#EEF4FB',
        paddingHorizontal: CONTENT_PADDING,
        paddingTop: normalize(14),
        paddingBottom: normalize(20),
    },
    badge: {
        width: normalize(110),
        height: normalize(24),
        borderRadius: normalize(5),
    },
    titleLine: {
        height: normalize(22),
        borderRadius: 5,
    },
    subLine: {
        height: normalize(15),
        borderRadius: 4,
    },
    priceLine: {
        width: normalize(100),
        height: normalize(28),
        borderRadius: 5,
    },
    registerBtn: {
        width: '100%',
        height: normalize(46),
        borderRadius: normalize(9),
    },

    /* ── White content sections ── */
    whiteSection: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: CONTENT_PADDING,
        paddingVertical: normalize(18),
    },
    sectionTitle: {
        height: normalize(20),
        borderRadius: 5,
    },
    textLine: {
        height: normalize(13),
        borderRadius: 4,
    },
    viewMoreLine: {
        width: normalize(80),
        height: normalize(14),
        borderRadius: 4,
    },

    /* ── Faculty ── */
    facultyCard: {
        width: normalize(80),
        height: normalize(100),
        borderRadius: normalize(8),
    },

    /* ── Bottom checkout bar ── */
    checkoutBar: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(12),
        marginTop: normalize(10),
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    checkoutBtn: {
        width: normalize(130),
        height: normalize(44),
        borderRadius: normalize(9),
    },
});
