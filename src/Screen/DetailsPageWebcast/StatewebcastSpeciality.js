/**
 * Statewebcast speciality screen module. Renders a React Native screen or a screen-scoped support component. Exported members: StatewebcastSpeciality, HorizontalChipSection.
 */

import { View, Text, ScrollView, Animated, useWindowDimensions, StyleSheet } from 'react-native';
import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';

/**
 * Shared horizontal chip section card with conditional scroll-hint chevron animation.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element|null}
 */
export const HorizontalChipSection = memo(({ title, items }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [showIndicator, setShowIndicator] = useState(false);
    const { width: screenWidth } = useWindowDimensions();

    useEffect(() => {
        if (!showIndicator) {
            animatedValue.stopAnimation();
            animatedValue.setValue(0);
            return undefined;
        }
        const loop = Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 3,
                duration: 1500,
                useNativeDriver: true,
            }),
        );
        loop.start();
        return () => {
            loop.stop();
        };
    }, [animatedValue, showIndicator]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: showIndicator ? 1 : 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [showIndicator, fadeAnim]);

    const opacity1 = animatedValue.interpolate({
        inputRange: [0, 0.5, 1, 3],
        outputRange: [0.3, 1, 0.3, 0.3],
    });
    const opacity2 = animatedValue.interpolate({
        inputRange: [0, 1, 1.5, 2, 3],
        outputRange: [0.3, 0.3, 1, 0.3, 0.3],
    });
    const opacity3 = animatedValue.interpolate({
        inputRange: [0, 2, 2.5, 3],
        outputRange: [0.3, 0.3, 1, 0.3],
    });

    /**
     * Handles scroll.
     * @param {*} event - Input value.
     * @returns {void}
     */
    const handleScroll = useCallback((event) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const isEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 15;
        setShowIndicator(!isEnd);
    }, []);

    /**
     * Handles content size change.
     * @param {*} contentWidth - Input value.
     * @returns {void}
     */
    const handleContentSizeChange = useCallback((contentWidth) => {
        setShowIndicator(contentWidth > screenWidth - normalize(52));
    }, [screenWidth]);

    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    return (
        <View style={styles.sectionCard}>
            <View style={styles.headerRow}>
                <View style={styles.headerTitleGroup}>
                    <View style={styles.sectionAccent} />
                    <Text style={styles.sectionHeading}>{title}</Text>
                </View>
                <Animated.View style={[styles.indicatorRow, { opacity: fadeAnim }]}>
                    <Animated.Text style={[styles.chevronChar, { opacity: opacity1 }]}>&gt;</Animated.Text>
                    <Animated.Text style={[styles.chevronChar, styles.chevronGap, { opacity: opacity2 }]}>&gt;</Animated.Text>
                    <Animated.Text style={[styles.chevronChar, styles.chevronGap, { opacity: opacity3 }]}>&gt;</Animated.Text>
                </Animated.View>
            </View>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                onContentSizeChange={handleContentSizeChange}
                contentContainerStyle={styles.chipsScrollContent}
            >
                {items.map((item, index) => (
                    <View key={`${item}-${index}`} style={styles.chip}>
                        <Text style={styles.chipText}>{item}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
});

/**
 * Reusable StatewebcastSpeciality component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const StatewebcastSpeciality = memo(({ allSpecailities }) => {
    return <HorizontalChipSection title="Specialties" items={allSpecailities} />;
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(10),
    },
    headerTitleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
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
    indicatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chevronChar: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colorpath.ButtonColr,
    },
    chevronGap: {
        marginLeft: 2,
    },
    chipsScrollContent: {
        gap: normalize(8),
        paddingVertical: normalize(2),
    },
    chip: {
        backgroundColor: '#F4F8FF',
        borderWidth: 1,
        borderColor: '#D6E4FF',
        borderRadius: normalize(20),
        paddingHorizontal: normalize(13),
        paddingVertical: normalize(7),
    },
    chipText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 13.5,
        color: '#1E3A8A',
    },
});

/**
 * Statewebcast speciality default export.
 *
 * @returns {*}
 */
export default StatewebcastSpeciality;
