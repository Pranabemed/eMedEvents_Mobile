import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import normalize from '../Utils/Helpers/Dimen';

/**
 * ProfessionCourseShimmer
 * Mimics the exact card layout rendered by RestProfession's FlatList items.
 * Show this while CME/cmeCourseRequest is in-flight.
 */
const ProfessionCourseShimmer = ({ count = 3 }) => {
    return (
        <View style={styles.wrapper}>
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
                            {/* Title line – short (second line for long titles) */}
                            <View style={styles.titleLineShort} />
                            {/* Organisation name */}
                            <View style={styles.orgLine} />
                            {/* Date / location row */}
                            <View style={styles.dateLine} />
                            {/* Divider */}
                            <View style={styles.divider} />
                            {/* Price */}
                            <View style={styles.priceLine} />
                        </View>
                    </SkeletonPlaceholder>
                </View>
            ))}
        </View>
    );
};

export default ProfessionCourseShimmer;

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: normalize(5),
        alignItems: 'center',
    },
    cardContainer: {
        marginVertical: normalize(5),
        width: normalize(300),
        borderRadius: normalize(10),
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        // subtle shadow to match real cards
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    card: {
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10),
    },
    // Title – full width
    titleLine: {
        height: normalize(16),
        width: normalize(240),
        borderRadius: 4,
        marginBottom: normalize(7),
    },
    // Title – second line (shorter)
    titleLineShort: {
        height: normalize(16),
        width: normalize(160),
        borderRadius: 4,
        marginBottom: normalize(12),
    },
    // Organisation subtitle
    orgLine: {
        height: normalize(13),
        width: normalize(150),
        borderRadius: 4,
        marginBottom: normalize(10),
    },
    // Date / location row
    dateLine: {
        height: normalize(13),
        width: normalize(220),
        borderRadius: 4,
        marginBottom: normalize(12),
    },
    // Separator
    divider: {
        height: normalize(1),
        width: normalize(273),
        borderRadius: 4,
        marginBottom: normalize(8),
    },
    // Price
    priceLine: {
        height: normalize(18),
        width: normalize(60),
        borderRadius: 4,
        alignSelf: 'flex-end',
    },
});
