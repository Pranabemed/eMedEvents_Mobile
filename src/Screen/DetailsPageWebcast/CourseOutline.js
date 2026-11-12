/**
 * Course outline screen module. Renders a React Native screen or a screen-scoped support component. Exported members: CourseOutline, toggleExpand, courseOutlineItem.
 */

import { View, Text, TouchableOpacity, useWindowDimensions, StyleSheet } from 'react-native';
import React, { memo, useState, useCallback, useMemo } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import moment from 'moment';
import HtmlTableRenderer from './HtmlTableRenderer';

const OUTLINE_TAGS_STYLES = {
    p: {
        fontFamily: Fonts.InterRegular,
        fontSize: 13.5,
        lineHeight: 20,
        color: '#475569',
        marginVertical: 2,
    },
};

/**
 * Reusable CourseOutline component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const CourseOutline = memo(({ wholedata }) => {
    const { width } = useWindowDimensions();
    const contentWidth = useMemo(() => Math.max(width - normalize(76), 200), [width]);
    const [expandedMap, setExpandedMap] = useState({});

    /**
     * Toggle expand utility.
     * @param {number} index - Input value.
     * @returns {void}
     */
    const toggleExpand = useCallback((index) => {
        setExpandedMap((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    }, []);

    if (!Array.isArray(wholedata) || wholedata.length === 0) {
        return (
            <Text style={styles.emptyText}>
                {"No data found"}
            </Text>
        );
    }

    return (
        <View style={styles.listContainer}>
            {wholedata.map((item, index) => {
                const isExpanded = Boolean(expandedMap[index]);
                const formattedDate = item?.sessionDate ? moment(item.sessionDate).format('LL') : '';
                const sessionsCount = item?.sessionsCount;
                return (
                    <View key={`${item?.sessionDate || 'day'}-${index}`} style={styles.dayCard}>
                        <TouchableOpacity
                            onPress={() => toggleExpand(index)}
                            activeOpacity={0.75}
                            style={styles.dayHeader}
                        >
                            <View style={styles.dayHeaderLeft}>
                                <View style={styles.dayBadge}>
                                    <Text style={styles.dayBadgeText}>{`Day ${index + 1}`}</Text>
                                </View>
                                <View style={styles.dayMetaCol}>
                                    {formattedDate ? (
                                        <Text style={styles.dayDateText} numberOfLines={1}>
                                            {formattedDate}
                                        </Text>
                                    ) : null}
                                    {sessionsCount !== undefined && sessionsCount !== null ? (
                                        <Text style={styles.sessionCountText}>
                                            {`${sessionsCount} ${Number(sessionsCount) === 1 ? 'Session' : 'Sessions'}`}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                            <Feather
                                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                size={18}
                                color="#475569"
                            />
                        </TouchableOpacity>

                        {isExpanded ? (
                            <View style={styles.dayBody}>
                                {(item?.startingTime || item?.endingTime) ? (
                                    <View style={styles.timePill}>
                                        <Feather name="clock" size={12} color={Colorpath.ButtonColr} />
                                        <Text style={styles.timeText}>
                                            {`${item?.startingTime || ''} - ${item?.endingTime || ''}`}
                                        </Text>
                                    </View>
                                ) : null}
                                {item?.title ? (
                                    <Text style={styles.sessionTitle}>{item.title}</Text>
                                ) : null}
                                {item?.description ? (
                                    <HtmlTableRenderer
                                        width={contentWidth}
                                        source={{ html: item.description }}
                                        tagsStyles={OUTLINE_TAGS_STYLES}
                                    />
                                ) : null}
                            </View>
                        ) : null}
                    </View>
                );
            })}
        </View>
    );
});

const styles = StyleSheet.create({
    listContainer: {
        gap: normalize(10),
    },
    dayCard: {
        backgroundColor: '#F8FAFD',
        borderRadius: normalize(12),
        borderWidth: 1,
        borderColor: '#E6EEF8',
        overflow: 'hidden',
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(10),
    },
    dayHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: normalize(8),
    },
    dayBadge: {
        backgroundColor: '#EAF1FF',
        borderRadius: normalize(8),
        paddingHorizontal: normalize(9),
        paddingVertical: normalize(5),
        marginRight: normalize(10),
    },
    dayBadgeText: {
        fontFamily: Fonts.InterBold,
        fontSize: 12,
        color: Colorpath.ButtonColr,
    },
    dayMetaCol: {
        flex: 1,
    },
    dayDateText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#0F172A',
    },
    sessionCountText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 12,
        color: '#64748B',
        marginTop: normalize(1),
    },
    dayBody: {
        borderTopWidth: 1,
        borderTopColor: '#E6EEF8',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(10),
        backgroundColor: Colorpath.white,
        gap: normalize(6),
    },
    timePill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#EEF4FF',
        borderRadius: normalize(16),
        paddingHorizontal: normalize(9),
        paddingVertical: normalize(4),
        gap: normalize(5),
    },
    timeText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12,
        color: Colorpath.ButtonColr,
    },
    sessionTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        lineHeight: 20,
        color: '#0F172A',
    },
    emptyText: {
        alignSelf: 'center',
        color: '#64748B',
        fontFamily: Fonts.InterMedium,
        fontSize: 15,
        paddingVertical: normalize(16),
    },
});

/**
 * Course outline default export.
 *
 * @returns {*}
 */
export default CourseOutline;
