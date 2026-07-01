/**
 * Add to cart shimmer reusable component module. Provides a React Native UI building block used across screens. Exported members: BG, HL, CartItemShimmer, AddToCartShimmer, styles.
 */

import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import normalize from '../Utils/Helpers/Dimen';

/**
 * Reusable CartItemShimmer component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const { width: W } = Dimensions.get('window');
/**
 * Bg constant.
 * @returns {string}
 */
const BG = '#E8EFF7';
/**
 * Hl constant.
 * @returns {string}
 */
const HL = '#F5F8FF';

/**
 * Cart item shimmer component.
 * @returns {JSX.Element}
 */
const CartItemShimmer = () => (
    <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL}>
        <View style={styles.itemCard}>
            {/* Conference name */}
            <View style={[styles.line, { width: '80%', height: normalize(16) }]} />
            <View style={[styles.line, { width: '55%', height: normalize(14), marginTop: normalize(6) }]} />
            {/* Credits */}
            <View style={[styles.line, { width: '40%', height: normalize(13), marginTop: normalize(8) }]} />
            {/* Price row */}
            <View style={styles.priceRow}>
                <View style={[styles.line, { width: normalize(100), height: normalize(16) }]} />
                <View style={[styles.circle]} />
            </View>
            {/* Divider */}
            <View style={styles.divider} />
        </View>
    </SkeletonPlaceholder>
);

/**
 * Add to cart shimmer component.
 * @returns {JSX.Element}
 */
const AddToCartShimmer = () => (
    <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: normalize(120) }}
    >
        {/* ── 3 Cart Item Skeletons ── */}
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        <CartItemShimmer />
        {/* ── Coupon Section ── */}
        <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL}>
            <View style={styles.couponSection}>
                <View style={[styles.line, { width: normalize(100), height: normalize(13) }]} />
                <View style={styles.couponRow}>
                    <View style={[styles.line, { flex: 1, height: normalize(45), borderRadius: normalize(10) }]} />
                </View>
            </View>
        </SkeletonPlaceholder>

        {/* ── Cart Total / Discount / Total Amount ── */}
        <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL}>
            <View style={styles.summarySection}>
                {/* Cart Total row */}
                <View style={styles.summaryRow}>
                    <View style={[styles.line, { width: normalize(130), height: normalize(14) }]} />
                    <View style={[styles.line, { width: normalize(70), height: normalize(14) }]} />
                </View>
                {/* Divider */}
                <View style={[styles.divider, { marginVertical: normalize(8) }]} />
                {/* Total Amount row */}
                <View style={styles.summaryRow}>
                    <View style={[styles.line, { width: normalize(120), height: normalize(18) }]} />
                    <View style={[styles.line, { width: normalize(80), height: normalize(18) }]} />
                </View>
            </View>
        </SkeletonPlaceholder>

        {/* ── Proceed Button ── */}
        <SkeletonPlaceholder backgroundColor={BG} highlightColor={HL}>
            <View style={styles.buttonWrap}>
                <View style={styles.button} />
            </View>
        </SkeletonPlaceholder>
    </ScrollView>
);

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    itemCard: {
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(12),
        alignItems: 'flex-start',
    },
    line: {
        borderRadius: normalize(6),
        height: normalize(14),
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: normalize(10),
    },
    circle: {
        width: normalize(22),
        height: normalize(22),
        borderRadius: normalize(11),
    },
    divider: {
        marginTop: normalize(12),
        height: 1,
        width: '100%',
        backgroundColor: '#DDD',
        borderRadius: 1,
    },
    couponSection: {
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10),
    },
    couponRow: {
        flexDirection: 'row',
        marginTop: normalize(8),
        gap: normalize(8),
    },
    summarySection: {
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: normalize(5),
    },
    buttonWrap: {
        alignItems: 'center',
        marginTop: normalize(20),
    },
    button: {
        width: normalize(300),
        height: normalize(45),
        borderRadius: normalize(9),
    },
});

/**
 * Add to cart shimmer default export.
 *
 * @returns {*}
 */
export default AddToCartShimmer;
