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
const Separator = () => <View style={styles.separator} />;
const conferenceTypeMap = {
  '1': 'Inperson',
  '2': 'Text Based',
  '3': 'Webcast',
  '4': 'Journey',
  '5': 'Podcasts',
  '6': 'Live webinar',
  '34': 'Hybrid',
};

const normalizeDisplayCme = value => {
  if (!value) {
    return '';
  }

  const text = String(value);
  return text.toLowerCase().includes('contact hour')
    ? text.replace(/contact hour/i, 'Contact Hour(s)')
    : text;
};

const getPriceText = item => {
  const symbol = item?.currency_code || item?.display_currency_code || 'US$';
  const amount = item?.display_price || item?.ticketprice || '0';
  return `${symbol}${amount}`;
};

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

const CourseHorizontalList = ({ data, isMandatory }) => {
  const navigation = useNavigation();
  const items = useMemo(() => (Array.isArray(data) ? data.filter(Boolean) : []), [data]);
  const featuredItem = !isMandatory && items.length > 0 ? items[0] : null;
  const listItems = !isMandatory && items.length > 1 ? items.slice(1) : isMandatory ? items : [];

  if (items.length === 0) {
    return null;
  }

  const handleCoursePress = item => {
    const detailUrl = item?.detailpage_url || item?.emed_url || '';
    const slug = detailUrl.split('/').pop();
    if (slug) {
      navigation.navigate('Statewebcast', {
        webCastURL: { webCastURL: slug, Realback: 'guest' },
      });
    }
  };

  const renderItem = ({ item }) => {
    return (
      <CourseCard
        item={item}
        featured={false}
        onPress={handleCoursePress}
      />
    );
  };

  return (
    <View style={styles.container}>
      {featuredItem ? (
        <CourseCard
          item={featuredItem}
          featured
          onPress={handleCoursePress}
        />
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
  infoSeparator: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(12),
    color: '#9CA3AF',
    marginHorizontal: normalize(6),
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
    backgroundColor:Colorpath.ButtonColr,
    borderColor: Colorpath.ButtonColr,
  },
  registerButtonText: {
    fontFamily: Fonts.InterBold,
    fontSize: normalize(13),
    color: '#FF6A00',
  },
  featuredRegisterButtonText: {
    color: "#FFFFFF",
  },
});

export default CourseHorizontalList;
