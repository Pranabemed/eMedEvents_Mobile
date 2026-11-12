/**
 * Statewebcast reviews screen module. Renders a React Native screen or a screen-scoped support component. Exported members: StatewebcastReviews, reviewsShows.
 */

import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { memo, useMemo } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Imagepath from '../../Themes/Imagepath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import StarRating from 'react-native-star-rating-widget';

/**
 * Reusable StatewebcastReviews component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const StatewebcastReviews = memo(({ webcastdeatils, ratingsall, reviewpost, expandreview, reviewChange }) => {
    const reviewsList = useMemo(() => {
        if (Array.isArray(reviewpost) && reviewpost.length > 0) return reviewpost;
        if (Array.isArray(webcastdeatils?.userReviews)) return webcastdeatils.userReviews;
        return [];
    }, [reviewpost, webcastdeatils?.userReviews]);

    const initialVisibleCount = Math.ceil(reviewsList.length / 2);
    const remainingCount = Math.max(reviewsList.length - initialVisibleCount, 0);

    const visibleReviews = useMemo(() => {
        if (expandreview || remainingCount === 0) {
            return reviewsList;
        }
        return reviewsList.slice(0, initialVisibleCount);
    }, [expandreview, initialVisibleCount, remainingCount, reviewsList]);

    if (reviewsList.length === 0) {
        return null;
    }

    const avgRating = (Number(ratingsall?.totalAverageRating) || 0).toFixed(1);
    const totalCount = Number(ratingsall?.totalRatingsCount) || 0;

    return (
        <View style={styles.sectionCard}>
            <View style={styles.headerRow}>
                <View style={styles.headerTitleGroup}>
                    <View style={styles.sectionAccent} />
                    <Text style={styles.sectionHeading}>{"Reviews"}</Text>
                </View>
                <View style={styles.summaryPill}>
                    <Image source={Imagepath.Star} style={styles.starIcon} />
                    <Text style={styles.ratingValue}>{avgRating}</Text>
                    <Text style={styles.ratingCount}>{`(${totalCount} ${totalCount === 1 ? 'rating' : 'ratings'})`}</Text>
                </View>
            </View>

            <View style={styles.reviewsList}>
                {visibleReviews.map((item, index) => {
                    const userName = String(item?.userName || 'Anonymous').trim();
                    const initial = userName ? userName.charAt(0).toUpperCase() : 'A';
                    return (
                        <View
                            key={`${userName}-${index}`}
                            style={[
                                styles.reviewItem,
                                index < visibleReviews.length - 1 && styles.reviewDivider,
                            ]}
                        >
                            <View style={styles.reviewerRow}>
                                <View style={styles.avatarCircle}>
                                    <Text style={styles.avatarText}>{initial}</Text>
                                </View>
                                <View style={styles.reviewerMeta}>
                                    <Text style={styles.reviewerName} numberOfLines={1}>
                                        {userName}
                                    </Text>
                                    <View pointerEvents="none" style={styles.starsWrap}>
                                        <StarRating
                                            rating={Number(item?.averageRating) || 0}
                                            onChange={() => { }}
                                            starSize={14}
                                            color="#FF773D"
                                            starStyle={styles.starItem}
                                        />
                                    </View>
                                </View>
                            </View>
                            {item?.comment ? (
                                <Text style={styles.commentText}>{item.comment}</Text>
                            ) : null}
                        </View>
                    );
                })}
            </View>

            {remainingCount > 0 ? (
                <TouchableOpacity
                    onPress={reviewChange}
                    activeOpacity={0.75}
                    style={styles.toggleButton}
                >
                    <Text style={styles.toggleButtonText}>
                        {expandreview ? "View less" : `View more (${remainingCount} more)`}
                    </Text>
                    <Feather
                        name={expandreview ? 'chevron-up' : 'chevron-down'}
                        size={15}
                        color={Colorpath.ButtonColr}
                    />
                </TouchableOpacity>
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: normalize(8),
        marginBottom: normalize(10),
        paddingBottom: normalize(10),
        borderBottomWidth: 1,
        borderBottomColor: '#E6EEF8',
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
    summaryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF7ED',
        borderWidth: 1,
        borderColor: '#FED7AA',
        borderRadius: normalize(16),
        paddingHorizontal: normalize(9),
        paddingVertical: normalize(4),
        gap: normalize(4),
    },
    starIcon: {
        height: normalize(13),
        width: normalize(13),
        resizeMode: 'contain',
    },
    ratingValue: {
        fontFamily: Fonts.InterBold,
        fontSize: 13.5,
        color: '#9A3412',
    },
    ratingCount: {
        fontFamily: Fonts.InterMedium,
        fontSize: 12,
        color: '#C2410C',
    },
    reviewsList: {
        gap: normalize(10),
    },
    reviewItem: {
        paddingBottom: normalize(10),
    },
    reviewDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    reviewerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(6),
    },
    avatarCircle: {
        width: normalize(34),
        height: normalize(34),
        borderRadius: normalize(17),
        backgroundColor: '#EAF1FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(10),
    },
    avatarText: {
        fontFamily: Fonts.InterBold,
        fontSize: 14,
        color: Colorpath.ButtonColr,
    },
    reviewerMeta: {
        flex: 1,
    },
    reviewerName: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14.5,
        color: '#0F172A',
        textTransform: 'capitalize',
        marginBottom: normalize(2),
    },
    starsWrap: {
        alignSelf: 'flex-start',
    },
    starItem: {
        marginHorizontal: 1,
    },
    commentText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 13.5,
        lineHeight: 20,
        color: '#334155',
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: normalize(8),
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
 * Statewebcast reviews default export.
 *
 * @returns {*}
 */
export default StatewebcastReviews;