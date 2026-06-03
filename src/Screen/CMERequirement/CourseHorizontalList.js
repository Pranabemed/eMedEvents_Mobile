/**
 * File Name: CourseHorizontalList.js
 * Module: CME Requirement
 * Purpose: Renders ordered course bundle cards for standard and mandatory CME bundle sections.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, react-native, @react-navigation/native, react-native-star-rating-widget, ../../Themes/Fonts, ../../Utils/Helpers/Dimen, ../../Themes/Colorpath
 */

import React, { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';

const starStyle = { marginHorizontal: 0.5 };

const conferenceTypeMap = {
  '1': 'Inperson',
  '2': 'Text Based',
  '3': 'Webcast',
  '4': 'Journey',
  '5': 'Podcasts',
  '6': 'Live webinar',
  '34': 'Hybrid',
};

/**
 * Description: Separator component between stacked course cards.
 * Purpose: Keeps vertical spacing centralized inside the course list.
 *
 * Params:
 * @param {void} none
 *
 * Returns:
 * @returns {JSX.Element}
 *
 * Flow:
 * 1. Render spacer view.
 * 2. Apply module spacing style.
 * 3. Return reusable separator.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Pure render helper with no side effects.
 */
const Separator = () => <View style={styles.separator} />;

/**
 * Description: Normalizes CME credit text for consistent card display.
 * Purpose: Preserves source credit text while standardizing "Contact Hour" labeling.
 *
 * Params:
 * @param {string|number} value
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Guard against empty values.
 * 2. Convert incoming value to string.
 * 3. Replace singular contact hour label with normalized label.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns empty string when value is missing.
 */
const normalizeDisplayCme = value => {
  if (!value) {
    return '';
  }

  const text = String(value);
  return text.toLowerCase().includes('contact hour')
    ? text.replace(/contact hour/i, 'Contact Hour(s)')
    : text;
};

/**
 * Description: Builds the display price string for a course card.
 * Purpose: Combines currency symbol and visible price from supported payload fields.
 *
 * Params:
 * @param {Object} item
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Resolve currency symbol fallback chain.
 * 2. Resolve amount fallback chain.
 * 3. Concatenate and return display string.
 *
 * API Used:
 * Course bundle payload fields
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Falls back to `US$0`-style output when price data is missing.
 */
const getPriceText = item => {
  const symbol = item?.currency_code || item?.display_currency_code || 'US$';
  const amount = item?.display_price || item?.ticketprice || '0';
  return `${symbol}${amount}`;
};

/**
 * Description: Resolves the course/conference type label.
 * Purpose: Standardizes type text into uppercase based on bundle payload priorities.
 *
 * Params:
 * @param {Object} item
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Check mapped conference type values first.
 * 2. Fall back to event type or activity format.
 * 3. Return uppercase text for single-line rendering.
 *
 * API Used:
 * Course bundle payload fields
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns empty string when no type source exists.
 */
const getConferenceTypeText = item => {
  if (item?.conference_type && conferenceTypeMap[String(item.conference_type)]) {
    return conferenceTypeMap[String(item.conference_type)].toUpperCase();
  }

  if (item?.eventType) {
    return String(item.eventType).toUpperCase();
  }

  if (item?.activity_format) {
    return String(item.activity_format).toUpperCase();
  }

  if (item?.conference_type) {
    return String(item.conference_type).toUpperCase();
  }

  return '';
};

/**
 * Description: Renders a single course card.
 * Purpose: Displays course metadata, rating, pricing, and register action in a fixed sequence.
 *
 * Purpose:
 * Presents one bundle item with title, type/credits, course count, rating, and action row.
 *
 * Props:
 * 1. `item`
 * 2. `featured`
 * 3. `onPress`
 *
 * State:
 * Stateless render component
 *
 * Events:
 * 1. Card press
 * 2. Register button press
 *
 * Dependencies:
 * `StarRatingDisplay`
 *
 * Usage Example:
 * `<CourseCard item={item} featured={false} onPress={handleCoursePress} />`
 *
 * Params:
 * @param {Object} props
 * @param {Object} props.item
 * @param {boolean} props.featured
 * @param {Function} props.onPress
 *
 * Returns:
 * @returns {JSX.Element}
 *
 * Flow:
 * 1. Derive text and rating values from API payload.
 * 2. Render required rows in fixed order.
 * 3. Trigger parent navigation callback from card or button.
 *
 * API Used:
 * Course bundle payload fields
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Hides optional rows when API values are missing.
 */
const CourseCard = ({ item, featured, onPress }) => {
  const creditsText = normalizeDisplayCme(item?.display_cme || item?.credits);
  const typeText = getConferenceTypeText(item);
  const courseCount = Number(item?.bundle_sub_conf_count) || 0;
  const rawRatingValue = Number(item?.average_rating) || 0;
  const ratingValue = Math.floor(rawRatingValue * 2) / 2;
  const ratingCount = Number(item?.rating_users_count) || 0;
  const hasRating = ratingValue > 0;

  return (
    <TouchableOpacity
      style={[styles.card, featured ? styles.featuredCard : styles.standardCard]}
      activeOpacity={0.92}
      onPress={() => onPress(item)}
    >
      <View style={[styles.cardBody, featured && styles.featuredCardBody]}>
        <Text
          style={[styles.cardTitle, featured && styles.featuredCardTitle]}
          numberOfLines={2}
        >
          {item?.title}
        </Text>

        {(typeText || creditsText) ? (
          <View style={styles.infoRow}>
            <Text
              style={[styles.infoText, featured && styles.featuredInfoText]}
              numberOfLines={1}
            >
              {[typeText, creditsText].filter(Boolean).join(' | ')}
            </Text>
          </View>
        ) : null}

        {courseCount > 0 ? (
          <Text
            style={[styles.courseCountText, featured && styles.featuredCourseCountText]}
            numberOfLines={1}
          >
            {`${courseCount} COURSE(S)`}
          </Text>
        ) : null}

        {hasRating ? (
          <View style={styles.ratingRow}>
            <Text style={[styles.ratingLabel, featured && styles.featuredRatingLabel]}>
              RATINGS:
            </Text>
            <View pointerEvents="none">
              <StarRatingDisplay
                rating={ratingValue}
                starSize={normalize(14)}
                starStyle={starStyle}
                step={0.5}
                color={'#FF8A00'}
                emptyColor={featured ? 'rgba(255,255,255,0.45)' : '#D1D5DB'}
              />
            </View>
            {ratingCount > 0 ? (
              <Text style={[styles.ratingCountText, featured && styles.featuredRatingCountText]}>
                {`(${ratingCount})`}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={styles.bottomRow}>
          <Text style={[styles.priceText, featured && styles.featuredPriceText]}>
            {getPriceText(item)}
          </Text>

          <TouchableOpacity
            style={[styles.registerButton, featured && styles.featuredRegisterButton]}
            activeOpacity={0.85}
            onPress={() => onPress(item)}
          >
            <Text
              style={[
                styles.registerButtonText,
                featured && styles.featuredRegisterButtonText,
              ]}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Description: Course bundle list component for the CME requirement module.
 * Purpose: Renders bundle items while preserving existing featured/non-featured behavior and navigation flow.
 *
 * Purpose:
 * Shows either a featured first card plus stacked remainder, or a simple mandatory list.
 *
 * Props:
 * 1. `data`
 * 2. `isMandatory`
 *
 * State:
 * Uses memoized derived arrays only.
 *
 * Events:
 * Opens `Statewebcast` screen on course selection.
 *
 * Dependencies:
 * `useNavigation`, `CourseCard`
 *
 * Usage Example:
 * `<CourseHorizontalList data={section.data} isMandatory={section.isMandatory} />`
 *
 * Params:
 * @param {Object} props
 * @param {Array} props.data
 * @param {boolean} props.isMandatory
 *
 * Returns:
 * @returns {JSX.Element|null}
 *
 * Flow:
 * 1. Normalize incoming data array.
 * 2. Split into featured and remaining items when applicable.
 * 3. Navigate to course detail screen when item is selected.
 *
 * API Used:
 * Course bundle payload fields and detail URLs
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns null when data array is empty or invalid.
 */
const CourseHorizontalList = ({ data, isMandatory }) => {
  const navigation = useNavigation();
  const items = useMemo(() => (Array.isArray(data) ? data.filter(Boolean) : []), [data]);
  const featuredItem = !isMandatory && items.length > 0 ? items[0] : null;
  const listItems = !isMandatory && items.length > 1 ? items.slice(1) : isMandatory ? items : [];

  if (items.length === 0) {
    return null;
  }

  /**
   * Description: Opens the selected course detail screen.
   * Purpose: Converts detail URL into the slug required by `Statewebcast`.
   *
   * Params:
   * @param {Object} item
   *
   * Returns:
   * @returns {void}
   *
   * Flow:
   * 1. Resolve detail URL from supported payload fields.
   * 2. Extract slug from URL.
   * 3. Navigate to `Statewebcast` when slug exists.
   *
   * API Used:
   * Course bundle detail URL fields
   *
   * Redux Actions:
   * None
   *
   * Error Handling:
   * Safely skips navigation when slug is not available.
   */
  const handleCoursePress = item => {
    const detailUrl = item?.detailpage_url || item?.emed_url || '';
    const slug = detailUrl.split('/').pop();
    if (slug) {
      navigation.navigate('Statewebcast', {
        webCastURL: { webCastURL: slug, Realback: 'guest' },
      });
    }
  };

  /**
   * Description: Renders one FlatList item.
   * Purpose: Passes current item into the shared course card renderer.
   *
   * Params:
   * @param {Object} listProps
   * @param {Object} listProps.item
   *
   * Returns:
   * @returns {JSX.Element}
   *
   * Flow:
   * 1. Receive FlatList item payload.
   * 2. Render `CourseCard` with standard styling.
   * 3. Forward card press callback.
   *
   * API Used:
   * None
   *
   * Redux Actions:
   * None
   *
   * Error Handling:
   * Delegates optional-field handling to `CourseCard`.
   */
  const renderItem = ({ item }) => {
    return <CourseCard item={item} featured={false} onPress={handleCoursePress} />;
  };

  return (
    <View style={styles.container}>
      {featuredItem ? (
        <CourseCard item={featuredItem} featured onPress={handleCoursePress} />
      ) : null}

      {listItems.length > 0 ? (
        <FlatList
          data={listItems}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            String(item?.id ?? item?.detailpage_url ?? item?.emed_url ?? index)
          }
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={Separator}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: normalize(4),
    marginBottom: normalize(10),
    paddingHorizontal: normalize(16),
  },
  listContent: {
    paddingTop: normalize(0),
  },
  separator: {
    height: normalize(14),
  },
  card: {
    borderRadius: normalize(16),
    borderWidth: 1,
  },
  featuredCard: {
    backgroundColor: '#fff4ef',
    borderColor: '#FF7A00',
    borderStyle: 'dashed',
    marginBottom: normalize(14),
  },
  standardCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  cardBody: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(14),
  },
  featuredCardBody: {
    paddingTop: normalize(16),
    paddingBottom: normalize(16),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: normalize(8),
  },
  infoText: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(12),
    lineHeight: normalize(18),
    color: '#6B7280',
  },
  featuredInfoText: {
    color: 'rgba(0, 0, 0, 0.82)',
  },
  cardTitle: {
    fontFamily: Fonts.InterBold,
    fontSize: normalize(15),
    lineHeight: normalize(22),
    color: '#111827',
  },
  featuredCardTitle: {
    color: '#000000',
  },
  courseCountText: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
    lineHeight: normalize(18),
    color: '#6B7280',
    marginTop: normalize(8),
  },
  featuredCourseCountText: {
    color: 'rgba(0, 0, 0, 0.82)',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(8),
  },
  ratingLabel: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(12),
    color: '#374151',
    marginRight: normalize(6),
  },
  featuredRatingLabel: {
    color: 'rgba(0, 0, 0, 0.86)',
  },
  ratingCountText: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
    color: '#6B7280',
    marginLeft: normalize(6),
  },
  featuredRatingCountText: {
    color: 'rgba(0, 0, 0, 0.82)',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalize(14),
  },
  priceText: {
    fontFamily: Fonts.InterExtraBold,
    fontSize: normalize(16),
    color: '#FF6A00',
  },
  featuredPriceText: {
    color: '#000000',
  },
  registerButton: {
    minWidth: normalize(98),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(10),
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: '#FF6A00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredRegisterButton: {
    backgroundColor: Colorpath.ButtonColr,
    borderColor: Colorpath.ButtonColr,
  },
  registerButtonText: {
    fontFamily: Fonts.InterBold,
    fontSize: normalize(13),
    color: '#FF6A00',
  },
  featuredRegisterButtonText: {
    color: '#FFFFFF',
  },
});

export default CourseHorizontalList;
