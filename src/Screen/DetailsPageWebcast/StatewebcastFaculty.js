/**
 * Statewebcast faculty screen module. Renders a React Native screen or a screen-scoped support component. Exported members: StatewebcastFaculty.
 */

import { View, Text, StyleSheet } from 'react-native';
import React, { memo, useMemo } from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import StatewebcastComponent from './StatewebcastComponent';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';

/**
 * Reusable StatewebcastFaculty component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const StatewebcastFaculty = memo(({ webcastdeatils, windowWidth, handleSnapToItem, val, nav, creditData, datawhole }) => {
    const speakers = webcastdeatils?.speakers;
    const cardWidth = useMemo(() => Math.max((windowWidth || 360) - normalize(52), 240), [windowWidth]);

    if (!Array.isArray(speakers) || speakers.length === 0) {
        return null;
    }

    const headingLabel =
        webcastdeatils?.conferenceTypeId == "1" ||
        webcastdeatils?.conferenceTypeId == "6" ||
        webcastdeatils?.conferenceTypeId == "34"
            ? `Speakers (${speakers.length})`
            : `Faculty (${speakers.length})`;

    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionHeading}>{headingLabel}</Text>
            </View>
            <Carousel
                layout={'default'}
                data={speakers}
                sliderWidth={cardWidth}
                itemWidth={cardWidth}
                renderItem={({ item, index }) => (
                    <StatewebcastComponent
                        datawhole={datawhole}
                        creditData={creditData}
                        nav={nav}
                        item={item}
                        index={index}
                    />
                )}
                firstItem={0}
                onSnapToItem={handleSnapToItem}
            />
            {speakers.length > 1 ? (
                <View style={styles.paginationWrap}>
                    <Pagination
                        dotsLength={speakers.length}
                        activeDotIndex={val}
                        containerStyle={styles.paginationContainer}
                        dotStyle={styles.activeDot}
                        inactiveDotStyle={styles.inactiveDot}
                        inactiveDotOpacity={0.45}
                        inactiveDotScale={0.85}
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
        marginBottom: normalize(10),
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
    paginationWrap: {
        alignItems: 'center',
        marginTop: normalize(6),
    },
    paginationContainer: {
        paddingVertical: normalize(4),
        paddingHorizontal: 0,
    },
    activeDot: {
        width: normalize(18),
        height: normalize(7),
        borderRadius: normalize(4),
        backgroundColor: Colorpath.ButtonColr,
        marginHorizontal: normalize(3),
    },
    inactiveDot: {
        width: normalize(7),
        height: normalize(7),
        borderRadius: normalize(4),
        backgroundColor: '#94A3B8',
        marginHorizontal: normalize(3),
    },
});

/**
 * Statewebcast faculty default export.
 *
 * @returns {*}
 */
export default StatewebcastFaculty;