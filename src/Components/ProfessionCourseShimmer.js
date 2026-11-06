/**
 * Profession course shimmer reusable component module. Provides a React Native UI building block used across screens. Exported members: ProfessionCourseShimmer, styles.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import normalize from '../Utils/Helpers/Dimen';

/**
 * Reusable ProfessionCourseShimmer component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

/**
 * ProfessionCourseShimmer
 * Mimics the exact card layout rendered by RestProfession's FlatList items.
 * Show this while CME/cmeCourseRequest is in-flight.
 */
const ProfessionCourseShimmer = ({ count = 1 }) => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.headerRow}>
                <SkeletonPlaceholder backgroundColor="#E8E8E8" highlightColor="#F5F5F5" speed={1200}>
                    <View style={styles.headerTitle} />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder backgroundColor="#E8E8E8" highlightColor="#F5F5F5" speed={1200}>
                    <View style={styles.headerViewAll} />
                </SkeletonPlaceholder>
            </View>
            {Array.from({ length: count }).map((_, index) => (
                <View key={index} style={styles.cardContainer}>
                    <SkeletonPlaceholder
                        backgroundColor="#E8E8E8"
                        highlightColor="#F5F5F5"
                        speed={1200}
                    >
                        <View style={styles.card}>
                            {/* Title line – long */}
                            <View style={styles.titleLine} />
                            {/* Title line – short */}
                            <View style={styles.titleLineShort} />
                            {/* Divider */}
                            <View style={styles.divider} />
                            {/* Credit info */}
                            <View style={styles.creditLine} />
                            {/* Bottom row */}
                            <View style={styles.bottomRow}>
                                <View style={styles.progressCol}>
                                    <View style={styles.percentLine} />
                                    <View style={styles.progressBar} />
                                </View>
                                <View style={styles.resumeButton} />
                            </View>
                        </View>
                    </SkeletonPlaceholder>
                </View>
            ))}
            <View style={styles.dotsRow}>
                <SkeletonPlaceholder backgroundColor="#E8E8E8" highlightColor="#F5F5F5" speed={1200}>
                    <View style={styles.dotActive} />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder backgroundColor="#E8E8E8" highlightColor="#F5F5F5" speed={1200}>
                    <View style={styles.dotInactive} />
                </SkeletonPlaceholder>
                <SkeletonPlaceholder backgroundColor="#E8E8E8" highlightColor="#F5F5F5" speed={1200}>
                    <View style={styles.dotInactive} />
                </SkeletonPlaceholder>
            </View>
        </View>
    );
};

/**
 * Profession course shimmer default export.
 *
 * @returns {*}
 */
export default ProfessionCourseShimmer;

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: normalize(10),
        alignItems: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: normalize(295),
        marginBottom: normalize(8),
        paddingHorizontal: normalize(2),
    },
    headerTitle: {
        height: normalize(16),
        width: normalize(170),
        borderRadius: 4,
    },
    headerViewAll: {
        height: normalize(16),
        width: normalize(60),
        borderRadius: 4,
    },
    cardContainer: {
        marginVertical: normalize(5),
        width: normalize(295),
        borderRadius: normalize(12),
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    card: {
        paddingHorizontal: normalize(14),
        paddingVertical: normalize(14),
    },
    titleLine: {
        height: normalize(15),
        width: normalize(250),
        borderRadius: 4,
        marginBottom: normalize(6),
    },
    titleLineShort: {
        height: normalize(15),
        width: normalize(180),
        borderRadius: 4,
        marginBottom: normalize(10),
    },
    divider: {
        height: 1,
        width: '100%',
        borderRadius: 1,
        marginBottom: normalize(10),
    },
    creditLine: {
        height: normalize(13),
        width: normalize(160),
        borderRadius: 4,
        marginBottom: normalize(14),
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    progressCol: {
        gap: normalize(6),
    },
    percentLine: {
        height: normalize(11),
        width: normalize(80),
        borderRadius: 3,
    },
    progressBar: {
        height: 6,
        width: normalize(110),
        borderRadius: 3,
    },
    resumeButton: {
        height: normalize(34),
        width: normalize(115),
        borderRadius: normalize(6),
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(10),
        gap: normalize(6),
    },
    dotActive: {
        width: normalize(22),
        height: normalize(7),
        borderRadius: normalize(5),
    },
    dotInactive: {
        width: normalize(7),
        height: normalize(7),
        borderRadius: normalize(3.5),
    },
});
