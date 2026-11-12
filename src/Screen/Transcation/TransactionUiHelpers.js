/**
 * Shared flat UI helpers and smooth loading components for Menu -> Transactions screens.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';

/**
 * Smooth pulsing flat skeleton cards matching the transaction card layout.
 * @param {Object} props
 * @param {number} [props.count=4]
 * @returns {JSX.Element}
 */
export const TransactionListSkeleton = ({ count = 4 }) => {
    const pulse = useRef(new Animated.Value(0.45)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 750,
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 0.45,
                    duration: 750,
                    useNativeDriver: true,
                }),
            ]),
        );
        animation.start();
        return () => animation.stop();
    }, [pulse]);

    return (
        <View style={styles.skeletonContainer}>
            <Animated.View style={[styles.skeletonMonthHeader, { opacity: pulse }]} />
            {Array.from({ length: count }).map((_, index) => (
                <View key={index} style={styles.skeletonCard}>
                    <View style={styles.skeletonTopRow}>
                        <Animated.View style={[styles.skeletonBadge, { opacity: pulse }]} />
                        <Animated.View style={[styles.skeletonSmallBadge, { opacity: pulse }]} />
                    </View>
                    <Animated.View style={[styles.skeletonTitleLine, { opacity: pulse }]} />
                    <Animated.View style={[styles.skeletonTitleLineShort, { opacity: pulse }]} />
                    <View style={styles.skeletonDivider} />
                    <View style={styles.skeletonBottomRow}>
                        <Animated.View style={[styles.skeletonMetaLine, { opacity: pulse }]} />
                        <Animated.View style={[styles.skeletonAmountLine, { opacity: pulse }]} />
                    </View>
                </View>
            ))}
        </View>
    );
};

/**
 * Clean flat empty state card for transaction and subscription lists.
 * @param {Object} props
 * @param {string} [props.message="No data found"]
 * @returns {JSX.Element}
 */
export const TransactionEmptyState = ({ message = 'No data found' }) => (
    <View style={styles.emptyWrapper}>
        <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{message}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    skeletonContainer: {
        paddingHorizontal: normalize(12),
        paddingTop: normalize(8),
    },
    skeletonMonthHeader: {
        width: normalize(95),
        height: normalize(14),
        borderRadius: normalize(6),
        backgroundColor: '#DCE4F0',
        marginBottom: normalize(10),
    },
    skeletonCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: '#E5ECF6',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(10),
        marginBottom: normalize(8),
    },
    skeletonTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(8),
    },
    skeletonBadge: {
        width: normalize(74),
        height: normalize(18),
        borderRadius: normalize(10),
        backgroundColor: '#E8EEF7',
    },
    skeletonSmallBadge: {
        width: normalize(24),
        height: normalize(18),
        borderRadius: normalize(8),
        backgroundColor: '#E8EEF7',
    },
    skeletonTitleLine: {
        width: '92%',
        height: normalize(13),
        borderRadius: normalize(6),
        backgroundColor: '#E8EEF7',
        marginBottom: normalize(6),
    },
    skeletonTitleLineShort: {
        width: '62%',
        height: normalize(13),
        borderRadius: normalize(6),
        backgroundColor: '#E8EEF7',
    },
    skeletonDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: normalize(8),
    },
    skeletonBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    skeletonMetaLine: {
        width: normalize(110),
        height: normalize(11),
        borderRadius: normalize(5),
        backgroundColor: '#E8EEF7',
    },
    skeletonAmountLine: {
        width: normalize(56),
        height: normalize(13),
        borderRadius: normalize(5),
        backgroundColor: '#DCE4F0',
    },
    emptyWrapper: {
        paddingHorizontal: normalize(12),
        paddingTop: normalize(20),
    },
    emptyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: '#E5ECF6',
        paddingVertical: normalize(24),
        paddingHorizontal: normalize(14),
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
});

