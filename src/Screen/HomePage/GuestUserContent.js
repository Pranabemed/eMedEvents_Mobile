import React, { useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import MyStatusBar from '../../Utils/MyStatusBar';
import normalize from '../../Utils/Helpers/Dimen';
import { FormatDateZone } from '../../Utils/Helpers/Timezone';
import CMEChecklistModal from '../CMECreditValut/CMEChecklistModal';
import styles from './GuestUser.styles';
const MEMBERSHIP_POINTS = [
  'Multi State & Board Licensure Tracking',
  'Personalized CME/CE Recommendations',
  'Centralized CME/CE Credit Vault',
  'CME & CE Expenses',
];

const firstArray = (...values) =>
  values.find(value => Array.isArray(value) && value.length > 0) ||
  values.find(Array.isArray) ||
  [];

const scale = (width, value) =>
  Math.round((Math.min(width, 430) / 390) * value);

const getText = (...values) => {
  for (const value of values) {
    if (value == null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
};

const getSpecialityLabel = item =>
  typeof item === 'string'
    ? item
    : getText(item?.name, item?.specialty_name, item?.speciality_name, item?.title);

const normalizeSpecialities = value => {
  if (Array.isArray(value)) {
    return value.map(getSpecialityLabel).filter(Boolean);
  }
  return String(value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
};

const chunkArray = (items, size) =>
  items.reduce((chunks, item, index) => {
    if (index % size === 0) {
      chunks.push([]);
    }
    chunks[chunks.length - 1].push(item);
    return chunks;
  }, []);

const getImageSource = value => {
  if (!value) return undefined;
  if (typeof value === 'object') return value;
  const uri = String(value).trim();
  return uri ? { uri } : undefined;
};

const getInitials = value =>
  String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase())
    .join('');

const getCountValue = (...values) => {
  for (const value of values) {
    if (value == null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
};

const getBannerUrl = item => {
  const rawUrl =
    item?.banner_url ||
    item?.bannerUrl ||
    item?.url ||
    item?.link ||
    item?.conference_url ||
    item?.conferenceUrl;

  if (rawUrl) {
    const url = String(rawUrl).trim();
    if (!url) return '';
    return url.startsWith('/') ? `https://www.emedevents.com${url}` : url;
  }

  const html = String(item?.html_content || '');
  const hrefMatch = html.match(/<a[^>]*href=['"]([^'"]+)['"]/i);
  if (!hrefMatch?.[1]) return '';

  const href = hrefMatch[1].trim();
  if (!href) return '';
  return href.startsWith('/') ? `https://www.emedevents.com${href}` : href;
};

const getDetailPageUrl = item =>
  getText(
    item?.detailpage_url,
    item?.detailPageUrl,
    item?.detail_page_url,
    item?.banner_url,
    item?.url,
    item?.link,
    item?.conference_url,
  );

const getDateRange = item => {
  const formatted = FormatDateZone(
    item?.startdate || item?.startDate,
    item?.enddate || item?.endDate || item?.endate,
  );
  if (formatted) return formatted;
  return getText(
    item?.date,
    item?.event_date,
    item?.startdate,
    item?.startDate,
  );
};

const getCmeLabel = item => {
  if (item?.display_cme) {
    return String(item.display_cme).toLowerCase().includes('contact hour')
      ? String(item.display_cme).replace(/contact hour/i, 'Contact Hour(s)')
      : String(item.display_cme);
  }
  if (
    Array.isArray(item?.cme_points_popovar) &&
    item.cme_points_popovar.length
  ) {
    return item.cme_points_popovar
      .map(point => {
        const count = Number.parseFloat(point?.points) || 0;
        const name =
          point?.name && point?.name.toLowerCase() === 'contact hour'
            ? 'Contact Hour(s)'
            : point?.name || '';
        return `${count} ${name}`.trim();
      })
      .filter(Boolean)
      .join(' | ');
  }
  return '';
};

const getPriceLabel = item => {
  if (String(item?.display_price || '').toUpperCase() === 'FREE') {
    return 'FREE';
  }
  return `${getText(
    item?.display_currency_code,
    item?.currency_code,
    '',
  )}${getText(item?.display_price, item?.price, item?.amount)}`.trim();
};

const stripHtml = value =>
  String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const matchGroup = (html, regex) => {
  const match = html.match(regex);
  return match ? stripHtml(match[1]) : null;
};

const parseBannerMeta = html => {
  const metaHtmlMatch = html.match(
    /<p[^>]*class=['"][^'"]*sliderthreecredits[^'"]*['"][^>]*>([\s\S]*?)<\/p>/i,
  );
  const metaHtml = metaHtmlMatch ? metaHtmlMatch[1] : '';
  const creditsBlockMatch = html.match(
    /<p[^>]*class=['"][^'"]*\bcredits\b[^'"]*['"][^>]*>([\s\S]*?)<\/p>/i,
  );
  const creditsBlock = creditsBlockMatch ? creditsBlockMatch[1] : '';

  if (!metaHtml && !creditsBlock) {
    return {
      date: '',
      credits: '',
    };
  }

  const dateMatch =
    metaHtml.match(
      /<img[^>]*alt=['"](?:Calendar|calendar)['"][^>]*>\s*([\s\S]*?)(?=<img[^>]*alt=['"](?:Credits|credits)['"]|<span[^>]*class=['"]textmogento['"]|$)/i,
    ) ||
    metaHtml.match(
      /Calendar\.png[^>]*>\s*([\s\S]*?)(?=<img[^>]*alt=['"](?:Credits|credits)['"]|<span[^>]*class=['"]textmogento['"]|$)/i,
    );

  const creditsMatch =
    metaHtml.match(
      /<img[^>]*alt=['"](?:Credits|credits)['"][^>]*>\s*<span[^>]*>\s*([\d.]+)\s*<\/span>\s*([\s\S]*?)(?=<img[^>]*alt=['"][^>]*Hybrid|<span[^>]*class=['"]textmogento['"]|$)/i,
    ) ||
    metaHtml.match(
      /<img[^>]*alt=['"](?:Credits|credits)['"][^>]*>\s*([\s\S]*?)(?=<img[^>]*alt=['"][^>]*Hybrid|<span[^>]*class=['"]textmogento['"]|$)/i,
    ) ||
    metaHtml.match(
      /credits\.png[^>]*>\s*([\s\S]*?)(?=<img[^>]*alt=['"][^>]*Hybrid|<span[^>]*class=['"]textmogento['"]|$)/i,
    ) ||
    creditsBlock.match(
      /<span[^>]*>\s*([\d.]+)\s*<\/span>\s*([\s\S]*?)(?=<\/p>|$)/i,
    );

  const date = stripHtml(dateMatch?.[1]);
  const credits = creditsMatch
    ? creditsMatch[2]
      ? `${stripHtml(creditsMatch[1])} ${stripHtml(creditsMatch[2])}`.trim()
      : stripHtml(creditsMatch[1])
    : '';

  return {
    date: date || '',
    credits: credits || '',
  };
};

const splitMetaLine = value => {
  const parts = String(value || '')
    .split('|')
    .map(part => part.trim())
    .filter(Boolean);

  return {
    date: parts[0] || '',
    credits: parts.slice(1).join(' | ') || '',
  };
};

const getHtmlTitle = item => matchGroup(String(item?.html_content || ''), /<h2[^>]*>([\s\S]*?)<\/h2>/i);

const getHtmlLocation = item => {
  const html = String(item?.html_content || '');
  return matchGroup(
    html,
    /<p[^>]*class=['"][^'"]*\bcredits\b[^'"]*['"][^>]*>[\s\S]*?(?:location|loc)[^>]*>\s*([\s\S]*?)<\/p>/i,
  );
};

const getDetailSlug = value => {
  const cleanUrl = String(value || '').split('#')[0];
  const segments = cleanUrl.split('/').filter(Boolean);
  if (!segments.length) return '';
  return segments[segments.length - 1] === 'registration'
    ? segments[segments.length - 2] || ''
    : segments[segments.length - 1];
};

const getHtmlButtonText = item =>
  matchGroup(String(item?.html_content || ''), /<button[^>]*>([\s\S]*?)<\/button>/i);

const SHIMMER_BG = '#EAF4FB';
const SHIMMER_HL = '#FFFFFF';

const SectionTitle = ({ title, action, onAction, width }) => (
  <View style={styles.sectionHeader}>
    <Text style={[styles.sectionTitle, { fontSize: scale(width, 20) }]}>
      {title}
    </Text>
    {action ? (
      <TouchableOpacity onPress={onAction} hitSlop={10}>
        <Text style={[styles.sectionAction, { fontSize: scale(width, 12) }]}>
          {action}
        </Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const TagChip = ({ label, active, width, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={[
      styles.chip,
      active && styles.chipActive,
      { paddingHorizontal: scale(width, 14), paddingVertical: scale(width, 9) },
    ]}
  >
    <Text
      style={[
        styles.chipText,
        active && styles.chipTextActive,
        { fontSize: scale(width, 12) },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const InfoRow = ({ icon, text, width, iconColor = '#666666' }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={scale(width, 16)} color={iconColor} />
    <Text style={[styles.infoText, { fontSize: scale(width, 12) }]}>
      {text}
    </Text>
  </View>
);

const FreeConferenceCard = ({ item }) => {
  const handlePress = () => {
    item?.onPress?.(item?.detailpageUrl);
  };

  return (
    <View style={styles.freeCardWrap}>
      <Pressable onPress={handlePress} style={styles.freeCard}>
        <View style={styles.freeTopRow}>
          {item?.eventType ? (
            <View style={styles.freeTypePill}>
              <Icon name="keyboard-voice" size={13} color="#FFFFFF" />
              <Text numberOfLines={1} style={styles.freeTypeText}>
                {item.eventType}
              </Text>
            </View>
          ) : null}
          {item?.date ? (
            <Text numberOfLines={1} style={styles.freeDateText}>
              {item.date}
            </Text>
          ) : null}
        </View>

        {item?.organization ? (
          <Text numberOfLines={1} style={styles.freeOrgText}>
            {item.organization}
          </Text>
        ) : null}

        <Text numberOfLines={2} style={styles.freeTitleText}>
          {item.title}
        </Text>

        <View style={styles.freeBottomRow}>
          {item?.cmeLabel ? (
            <View style={styles.freeCreditPill}>
              <Text numberOfLines={1} style={styles.freeCreditText}>
                {item.cmeLabel}
              </Text>
            </View>
          ) : null}
          {item?.price ? (
            <Text numberOfLines={1} style={styles.freePriceText}>
              {item.price}
            </Text>
          ) : null}
        </View>

        {item?.buttonText ? (
          <TouchableOpacity onPress={handlePress} style={styles.freeButton}>
            <Text numberOfLines={1} style={styles.freeButtonText}>
              {item.buttonText}
            </Text>
          </TouchableOpacity>
        ) : null}
      </Pressable>
    </View>
  );
};

const FeaturedConferenceCard = ({ item, width }) => {
  console.log('item====', item);
  const organizationName = getText(item?.organization, item?.organizer_name);
  const visibleSpecialities = item?.showSpecialities
    ? normalizeSpecialities(item?.specialities).slice(0, 4)
    : [];
  const hasMoreSpecialities =
    item?.showSpecialities &&
    normalizeSpecialities(item?.specialities).length > visibleSpecialities.length;
  const organizationLogo = getImageSource(
    item?.organizationLogo ||
      item?.organization_imagepath ||
      item?.organization_image ||
      item?.organization_logo ||
      item?.logo ||
      item?.image,
  );
  const detailUrl = getText(
    item?.detailpageUrl,
    item?.detailPageUrl,
    item?.detail_page_url,
    item?.banner_url,
  );

  const handlePress = () => {
    if (detailUrl) {
      item?.onPress?.(detailUrl);
    }
  };
  const handleOrganizerPress = () => {
    item?.onOrganizerPress?.();
  };

  return (
    <View style={styles.featureCardOuter}>
      <Pressable onPress={handlePress} style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <TouchableOpacity
            onPress={handleOrganizerPress}
            disabled={!item?.organizationUrl}
            activeOpacity={0.8}
            style={styles.featureLogoCircle}
          >
            {organizationLogo ? (
              <Image
                source={organizationLogo}
                style={styles.featureLogoImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.featureLogoFallback}>
                {getInitials(organizationName) || ' '}
              </Text>
            )}
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.featureOrgName}>
            {organizationName}
          </Text>
        </View>

        {visibleSpecialities.length ? (
          <View style={styles.featureSpecialityWrap}>
            {visibleSpecialities.map(label => (
              <View key={label} style={styles.featureSpecialityPill}>
                <Icon name="favorite-border" size={13} color="#111827" />
                <Text numberOfLines={1} style={styles.featureSpecialityText}>
                  {label}
                </Text>
              </View>
            ))}
            {hasMoreSpecialities ? (
              <View style={styles.featureSpecialityMore}>
                <Text style={styles.featureSpecialityMoreText}>...</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <Text numberOfLines={3} style={styles.featureTitle}>
          {getText(
            item?.title,
            item?.course_title,
            item?.conference_name,
            item?.name,
            item?.banner_title,
            item?.heading,
          )}
        </Text>

        {item?.date ? (
          <View style={styles.featureMetaRow}>
            <Icon name="event" size={17} color="#333333" />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.featureMetaText}
            >
              {item.date}
            </Text>
          </View>
        ) : null}

        {item?.location ? (
          <View style={styles.featureMetaRow}>
            <Icon name="place" size={18} color="#333333" />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.featureMetaText}
            >
              {item.location}
            </Text>
          </View>
        ) : null}

        <View style={styles.featureBottomRow}>
          {item?.cmeLabel ? (
            <View style={styles.featureCmePill}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.featureCmeText}
              >
                {item.cmeLabel}
              </Text>
            </View>
          ) : null}

          {item?.price ? (
            <View style={styles.featurePricePill}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.featurePriceText}
              >
                {item.price}
              </Text>
            </View>
          ) : null}
        </View>

        {item?.button ? (
          <TouchableOpacity onPress={handlePress} style={styles.featureButton}>
            <Text numberOfLines={1} style={styles.featureButtonText}>
              {item.button}
            </Text>
          </TouchableOpacity>
        ) : null}
      </Pressable>
    </View>
  );
};

const ConferenceCard = ({ item, width, dark = false, compact = false }) => (
  <View style={styles.cardWrap}>
    <View
      style={[
        styles.card,
        dark ? styles.cardDark : styles.cardLight,
        compact && styles.cardCompact,
      ]}
    >
      <View
        style={[styles.cardImageWrap, compact && styles.cardImageWrapCompact]}
      >
        <ImageBackground
          source={item.image}
          style={styles.cardImage}
          imageStyle={styles.cardImageRadius}
          resizeMode="cover"
        />
        {item.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        ) : null}
      </View>
      {item.kicker ? (
        <Text
          style={[
            styles.cardMeta,
            dark && styles.cardMetaDark,
            { fontSize: scale(width, 11) },
          ]}
        >
          {item.kicker}
        </Text>
      ) : null}
      <Text
        numberOfLines={2}
        style={[
          styles.cardTitle,
          dark && styles.cardTitleDark,
          { fontSize: scale(width, 16) },
        ]}
      >
        {item.title}
      </Text>
      {!item.kicker && (
        <Text
          style={[
            styles.cardMeta,
            dark && styles.cardMetaDark,
            { fontSize: scale(width, 11) },
          ]}
        >
          {item.by}
        </Text>
      )}
      <View style={styles.metaGroup}>
        <InfoRow
          icon="calendar-today"
          text={item.date}
          width={width}
          iconColor={dark ? '#FFFFFF' : '#666666'}
        />
        <InfoRow
          icon="place"
          text={item.location}
          width={width}
          iconColor={dark ? '#FFFFFF' : '#666666'}
        />
        <View style={styles.creditRow}>
          <Image
            source={Imagepath.CreditValut}
            style={[styles.creditIcon, dark && styles.creditIconDark]}
          />
          <Text
            style={[
              styles.cardMeta,
              dark && styles.cardMetaDark,
              { fontSize: scale(width, 11) },
            ]}
          >
            {item.credit}
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.priceRow}>
        <Text
          style={[
            styles.priceText,
            dark && styles.priceTextDark,
            { fontSize: scale(width, 18) },
          ]}
        >
          {item.price}
        </Text>
        <TouchableOpacity
          onPress={item.onPress}
          style={[styles.ctaPill, dark && styles.ctaPillDark]}
        >
          <Text style={[styles.ctaText, { fontSize: scale(width, 12) }]}>
            {item.cta}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const PopularConferenceCard = ({ item, width }) => {
  const handlePress = () => {
    item?.onPress?.(item?.detailpageUrl);
  };

  return (
    <View style={styles.popularCardWrap}>
      <Pressable onPress={handlePress} style={styles.popularCard}>
        {item?.kicker ? (
          <Text numberOfLines={1} style={styles.popularByText}>
            {item.kicker}
          </Text>
        ) : null}

        <Text
          numberOfLines={2}
          style={[styles.popularTitle, { fontSize: scale(width, 16) }]}
        >
          {item.title}
        </Text>

        <View style={styles.popularMetaGroup}>
          {item?.date ? (
            <InfoRow icon="calendar-today" text={item.date} width={width} />
          ) : null}
          {item?.location ? (
            <InfoRow icon="place" text={item.location} width={width} />
          ) : null}
          {item?.credit ? (
            <InfoRow icon="place" text={item.credit} width={width} />
          ) : null}
        </View>

        <View style={styles.popularDivider} />

        <View style={styles.popularFooterRow}>
          {item?.price ? (
            <Text style={[styles.popularPrice, { fontSize: scale(width, 18) }]}>
              {item.price}
            </Text>
          ) : null}
          {item?.buttonText ? (
            <TouchableOpacity onPress={handlePress} style={styles.popularButton}>
              <Text style={styles.popularButtonText}>{item.buttonText}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
};

const LiveConferenceCard = ({ item }) => {
  const handlePress = () => {
    item?.onPress?.(item?.detailpageUrl);
  };
  const handleOrganizerPress = () => {
    item?.onOrganizerPress?.();
  };

  return (
    <View style={styles.liveCardWrap}>
      <Pressable onPress={handlePress} style={styles.liveCard}>
        <View style={styles.liveCardTop}>
          {item?.location ? (
            <View style={styles.liveLocationPill}>
              <Icon name="location-on" size={13} color="#FFFFFF" />
              <Text numberOfLines={1} style={styles.liveLocationText}>
                {item.location}
              </Text>
            </View>
          ) : null}
          <Text numberOfLines={2} style={styles.liveTitle}>
            {item.title}
          </Text>
          {item?.organization ? (
            <View style={styles.liveOrgRow}>
              <TouchableOpacity
                onPress={handleOrganizerPress}
                disabled={!item?.organizerUrl}
                activeOpacity={0.8}
                style={styles.liveOrgLogo}
              >
                {item?.organizationLogo ? (
                  <Image
                    source={item.organizationLogo}
                    style={styles.liveOrgLogoImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.liveOrgLogoFallback}>
                    {getInitials(item.organization) || ' '}
                  </Text>
                )}
              </TouchableOpacity>
              <Text numberOfLines={1} style={styles.liveOrg}>
                By {item.organization}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.liveCardBottom}>
          {item?.date ? (
            <View style={styles.liveDateRow}>
              <Icon name="calendar-today" size={16} color="#333333" />
              <Text numberOfLines={1} style={styles.liveDateText}>
                {item.date}
              </Text>
            </View>
          ) : null}

          <View style={styles.liveFooterRow}>
            {item?.cmeLabel ? (
              <View style={styles.liveCreditPill}>
                <Text numberOfLines={1} style={styles.liveCreditText}>
                  {item.cmeLabel}
                </Text>
              </View>
            ) : null}
            {item?.price ? (
              <Text numberOfLines={1} style={styles.livePriceText}>
                {item.price}
              </Text>
            ) : null}
          </View>

          {item?.buttonText ? (
            <TouchableOpacity onPress={handlePress} style={styles.liveButton}>
              <Text numberOfLines={1} style={styles.liveButtonText}>
                {item.buttonText}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
};

const LiveConferenceSection = ({
  data,
  renderItem,
  sliderWidth,
  itemWidth,
  onAction,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!data.length) return null;

  return (
    <View style={styles.liveSection}>
      <View style={styles.liveHeader}>
        <Text style={styles.liveSectionTitle}>Live Conferences</Text>
        <TouchableOpacity onPress={onAction} hitSlop={10}>
          <Text style={styles.liveViewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <Carousel
        layout="default"
        data={data}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        onSnapToItem={index => setActiveIndex(index)}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.livePaginationContainer}
        dotStyle={styles.liveActiveDot}
        inactiveDotStyle={styles.liveInactiveDot}
        inactiveDotOpacity={0.8}
        inactiveDotScale={1}
      />
    </View>
  );
};

const CarouselSection = ({
  data,
  renderItem,
  sliderWidth,
  itemWidth,
  title,
  action,
  onAction,
  width,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <View style={styles.carouselContainer}>
      <SectionTitle
        title={title}
        action={action}
        onAction={onAction}
        width={width}
      />
      <Carousel
        layout="stack"
        data={data}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        onSnapToItem={index => setActiveIndex(index)}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.activeDot}
        inactiveDotStyle={styles.inactiveDot}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.8}
      />
    </View>
  );
};

const GuestHeroShimmer = ({ width }) => (
  <View style={styles.shimmerHeroWrap}>
    <SkeletonPlaceholder
      backgroundColor={SHIMMER_BG}
      highlightColor={SHIMMER_HL}
      speed={1200}
    >
      <View style={[styles.shimmerHero, { width: width - 32 }]}>
        <View style={styles.shimmerLineShort} />
        <View style={styles.shimmerLineWide} />
        <View style={styles.shimmerLineMedium} />
        <View style={styles.shimmerHeroBottom}>
          <View style={styles.shimmerLineMedium} />
          <View style={styles.shimmerButtonSmall} />
        </View>
      </View>
    </SkeletonPlaceholder>
  </View>
);

const GuestCarouselShimmer = ({ title, width, variant = 'feature' }) => (
  <View style={styles.carouselContainer}>
    <SectionTitle title={title} width={width} />
    <View style={styles.shimmerCardWrap}>
      <SkeletonPlaceholder
        backgroundColor={SHIMMER_BG}
        highlightColor={SHIMMER_HL}
        speed={1200}
      >
        <View
          style={[
            styles.shimmerCard,
            variant === 'live' && styles.shimmerLiveCard,
            variant === 'free' && styles.shimmerFreeCard,
          ]}
        >
          <View style={styles.shimmerRow}>
            <View style={styles.shimmerCircle} />
            <View style={styles.shimmerLineMedium} />
          </View>
          <View style={styles.shimmerLineWide} />
          <View style={styles.shimmerLineWide} />
          <View style={styles.shimmerLineMedium} />
          <View style={styles.shimmerFooterRow}>
            <View style={styles.shimmerPill} />
            <View style={styles.shimmerPrice} />
          </View>
        </View>
      </SkeletonPlaceholder>
    </View>
  </View>
);

const GuestChipsShimmer = ({ width }) => (
  <View style={styles.shimmerChipsSection}>
    <SectionTitle title="Specialities" width={width} />
    <SkeletonPlaceholder
      backgroundColor={SHIMMER_BG}
      highlightColor={SHIMMER_HL}
      speed={1200}
    >
      <View style={styles.shimmerChipRow}>
        {[0, 1, 2, 3, 4, 5].map(item => (
          <View key={item} style={styles.shimmerChip} />
        ))}
      </View>
    </SkeletonPlaceholder>
  </View>
);

const StatsGrid = ({ width, stats }) => {
  if (!stats?.length) return null;

  return (
    <View style={styles.statsGrid}>
      {stats.slice(1, 5).map(item => (
        <View key={item.label} style={styles.statTile}>
          <Text style={[styles.statValue, { fontSize: scale(width, 18) }]}>
            {item.value}
          </Text>
          <Text style={[styles.statLabel, { fontSize: scale(width, 11) }]}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const MembershipBanner = ({ width, onPress }) => (
  <LinearGradient
    colors={['#1E40AF', '#1D4ED8']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.membershipCard}
  >
    <Text style={styles.membershipTitle}>Prime Membership</Text>
    <View style={styles.membershipHeader}>
      <View style={styles.membershipArtwork}>
        <Image
          source={Imagepath.GuestPrime}
          style={styles.membershipImage}
          resizeMode="contain"
        />
      </View>
    </View>
    <View style={styles.membershipPointsList}>
      {MEMBERSHIP_POINTS.map(point => (
        <View key={point} style={styles.membershipPoint}>
          <Icon name="check" size={scale(width, 18)} color="#FFFFFF" />
          <Text style={styles.membershipPointText}>{point}</Text>
        </View>
      ))}
    </View>
    <TouchableOpacity onPress={onPress} style={styles.membershipButton}>
      <Text style={styles.membershipButtonText}>Explore Now</Text>
    </TouchableOpacity>
  </LinearGradient>
);

const GuestUserContent = ({ guest }) => {
  const {
    navigation,
    homeData,
    aboutUsData,
    homeStatus,
    stateList,
    selectedProfession,
    selectedState,
    stateSearchText,
    setStateSearchText,
    profModalVisible,
    setProfModalVisible,
    stateModalVisible,
    setStateModalVisible,
    handleProfessionSelect,
    handleStateSelect,
    handleStatePress,
    cmeModalVisible,
    allProfessionData,
    setAllProfessionData,
    certificatedata,
    allProfession,
    onCMEClose,
    onSaved,
    onFeaturedActivityPress,
  } = guest;
  console.log(aboutUsData,'stateList====', guest?.homeData);
  const { width } = useWindowDimensions();
  const [activeSpecialty, setActiveSpecialty] = useState(0);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [statePickerMode, setStatePickerMode] = useState('listing');
  const isHomeLoading =
    homeStatus === 'Guest/HomelistRequest' ||
    homeStatus === '' ||
    homeStatus == null;

  const topBanners = firstArray(
    homeData?.mobile_top_banners,
    homeData?.mobile_top_banner,
    homeData?.top_banners,
    homeData?.banners,
  );
  const topSpecialities = firstArray(
    homeData?.topSpecialities,
    homeData?.top_specialities,
    homeData?.specialities,
    homeData?.specialties,
  );
  console.log('topSpecialities====', topSpecialities);
  const featuredConferences = firstArray(
    homeData?.featured_conferences,
    homeData?.featuredConferences,
    homeData?.featured,
    homeData?.conferences,
  );
  const specialtyCourseBundles = firstArray(
    homeData?.specialty_course_bundles,
    homeData?.specialtyCourseBundles,
    homeData?.specialty_course_bundle,
  );
  const freeConferences = firstArray(
    homeData?.free_conferences,
    homeData?.freeConferences,
    homeData?.free_conference,
  );
  const liveWebinars = firstArray(
    homeData?.live_webinar,
    homeData?.liveWebinar,
    homeData?.live_webinars,
    homeData?.liveWebinars,
  );
  const popularCourses = firstArray(
    homeData?.popular_courses,
    homeData?.popularCourses,
    homeData?.popular_course,
  );
  const filteredStateList = (stateList || []).filter(item => {
    const name = String(
      item?.name || item?.state_name || item?.title || '',
    ).toLowerCase();
    return name.includes(stateSearchText.trim().toLowerCase());
  });

  const getStateName = stateObj =>
    getText(stateObj?.name, stateObj?.state_name, stateObj?.title);

  const getStateCode = stateObj =>
    getText(stateObj?.state_code, stateObj?.code, stateObj?.abbr, stateObj?.short_name);

  const getStateSlug = stateObj => {
    const rawUrl = getText(stateObj?.url, stateObj?.state_url);
    if (rawUrl) return rawUrl;
    return getStateName(stateObj).toLowerCase().replace(/\s+/g, '-');
  };

  const openStateResults = stateObj => {
    const stateUrl = getStateSlug(stateObj);
    const [countrySlug = 'united-states', stateSlug = stateUrl] = stateUrl.split('/');

    handleStateSelect(stateObj, 'listing');
    navigation.navigate('Globalresult', {
      trig: {
        beforetake: countrySlug,
        trig: stateSlug,
        rqstType: 'stateconferences',
        mainKey: 'country',
        newAdd: 'state',
        totalDaa: stateObj,
        creditAll: '',
        Realback: 'cont',
      },
    });
  };

  const openStatePicker = mode => {
    setStatePickerMode(mode);
    handleStatePress();
  };

  const handleStateItemPress = stateObj => {
    if (statePickerMode === 'profile') {
      handleStateSelect(stateObj, 'profile');
      return;
    }

    openStateResults(stateObj);
  };

  const mapConference = c => ({
    title: getText(
      c?.course_title,
      c?.title,
      c?.conference_name,
      c?.name,
      c?.banner_title,
      c?.heading,
    ),
    organization: getText(
      c?.organization_name,
      c?.organizer_name,
      c?.organizer,
    ),
    organizationLogo: getImageSource(
      c?.organization_imagepath ||
        c?.organization_image ||
        c?.organization_logo ||
        c?.logo ||
        c?.image,
    ),
    specialities: c?.specialities,
    organizationUrl: getText(c?.organization_url, c?.organizer_url, c?.user_url),
    date: getDateRange(c),
    location: getText(c?.course_location, c?.location, c?.venue, c?.city),
    cmeLabel: getCmeLabel(c),
    price: getPriceLabel(c),
    button:
      getText(c?.button, c?.buttonText, c?.button_text, c?.cta_text) ||
      'Register',
    detailpageUrl: getDetailPageUrl(c),
    onPress: detailUrl => {
      const url = detailUrl || getDetailPageUrl(c);
      if (url) {
        onFeaturedActivityPress?.(url);
      }
    },
    onOrganizerPress: () => {
      const organizationUrl = getText(c?.organization_url, c?.organizer_url, c?.user_url);
      const slug = getDetailSlug(organizationUrl);
      if (slug) {
        navigation.navigate('SpeakerProfile', {
          fullUrl: {
            fullUrl: slug,
            creditData: '',
            organ: 'organ',
            textHo: 'fs',
            showtext: 'organ',
            Realback: 'guest',
            organization_url: organizationUrl,
            organization_imagepath: getText(
              c?.organization_imagepath,
              c?.organization_image,
              c?.organization_logo,
            ),
            organization_name: getText(c?.organization_name, c?.organizer_name),
          },
        });
      }
    },
  });

  const mapFreeConference = c => {
    const detailpageUrl = getDetailPageUrl(c) || getBannerUrl(c);
    return {
      title: getText(
        c?.course_title,
        c?.title,
        c?.conference_name,
        c?.name,
        c?.banner_title,
        c?.heading,
      ),
      organization: getText(
        c?.organization_name,
        c?.organizer_name,
        c?.organizer,
        c?.provider,
      ),
      eventType: getText(
        c?.eventType,
        c?.event_type,
        c?.conference_type,
        c?.conference_type_text,
        c?.type,
      ),
      buttonText: getText(c?.buttonText, c?.button_text, c?.button),
      date: getDateRange(c),
      cmeLabel: getCmeLabel(c),
      price: getPriceLabel(c),
      detailpageUrl,
      onPress: detailUrl => {
        const slug = getDetailSlug(detailUrl);
        if (slug) {
          navigation.navigate('Statewebcast', {
            webCastURL: { webCastURL: slug, Realback: 'guest' },
          });
        }
      },
    };
  };

  const mapLiveWebinar = c => {
    const parsedHtml = parseBannerMeta(String(c?.html_content || ''));
    const detailpageUrl = getDetailPageUrl(c) || getBannerUrl(c);
    return {
      title:
        getText(
          c?.course_title,
          c?.title,
          c?.conference_name,
          c?.name,
          c?.banner_title,
          c?.heading,
        ) ||
        getHtmlTitle(c) ||
        getText(c?.banner_name),
      organization: getText(
        c?.organization_name,
        c?.organizer_name,
        c?.organizer,
        c?.provider,
      ),
      organizationLogo: getImageSource(
        c?.organization_imagepath ||
          c?.organization_image ||
          c?.organization_logo ||
          c?.logo,
      ),
      organizerUrl: getText(c?.organization_url, c?.organizer_url, c?.user_url),
      date: getDateRange(c) || parsedHtml.date,
      location: getText(
        c?.course_location,
        c?.location,
        c?.venue,
        c?.city,
        getHtmlLocation(c),
      ),
      cmeLabel: getCmeLabel(c) || parsedHtml.credits,
      price: getPriceLabel(c),
      buttonText:
        getText(c?.buttonText, c?.button_text, c?.button, c?.cta_text) ||
        getHtmlButtonText(c) ||
        'Register Now',
      detailpageUrl,
      onOrganizerPress: () => {
        const slug = getDetailSlug(
          getText(c?.organization_url, c?.organizer_url, c?.user_url),
        );
        if (slug) {
          navigation.navigate('SpeakerProfile', {
            fullUrl: {
              fullUrl: slug,
              creditData: '',
              organ: 'organ',
              textHo: 'fs',
              showtext: 'organ',
              Realback: 'guest',
              organization_url: getText(c?.organization_url, c?.organizer_url, c?.user_url),
              organization_imagepath: getText(
                c?.organization_imagepath,
                c?.organization_image,
                c?.organization_logo,
              ),
              organization_name: getText(c?.organization_name, c?.organizer_name),
            },
          });
        }
      },
      onPress: detailUrl => {
        const slug = getDetailSlug(detailUrl);
        if (slug) {
          navigation.navigate('Statewebcast', {
            webCastURL: { webCastURL: slug, Realback: 'guest' },
          });
        }
      },
    };
  };

  const mapPopularConference = c => {
    const detailpageUrl = getDetailPageUrl(c) || getBannerUrl(c);
    const organization = getText(
      c?.organization_name,
      c?.organizer_name,
      c?.organizer,
      c?.provider,
    );

    return {
      title: getText(
        c?.course_title,
        c?.title,
        c?.conference_name,
        c?.name,
        c?.banner_title,
        c?.heading,
      ),
      kicker: organization ? `By ${organization}` : '',
      date: getDateRange(c),
      location: getText(c?.course_location, c?.location, c?.venue, c?.city),
      credit: getCmeLabel(c),
      price: getPriceLabel(c),
      buttonText:
        getText(c?.buttonText, c?.button_text, c?.button, c?.cta_text) ||
        'REGISTER NOW',
      detailpageUrl,
      onPress: detailUrl => {
        const slug = getDetailSlug(detailUrl);
        if (slug) {
          navigation.navigate('Statewebcast', {
            webCastURL: { webCastURL: slug, Realback: 'guest' },
          });
        }
      },
    };
  };

  const renderCard = ({ item }) => <ConferenceCard item={item} width={width} />;
  const renderPopularCard = ({ item }) => (
    <PopularConferenceCard item={item} width={width} />
  );
  const renderFeaturedCard = ({ item }) =>
    item?.organization || item?.cmeLabel || item?.detailpageUrl ? (
      <FeaturedConferenceCard item={item} width={width} />
    ) : (
      <ConferenceCard item={item} width={width} />
    );
  const renderDarkCard = ({ item }) => (
    <ConferenceCard item={item} width={width} dark />
  );
  const renderFreeCard = ({ item }) => <FreeConferenceCard item={item} />;
  const renderLiveCard = ({ item }) => <LiveConferenceCard item={item} />;
  const specialityItems = (topSpecialities.length > 0 ? topSpecialities : [])
    .map(getSpecialityLabel)
    .filter(Boolean);
  const specialityColumns = chunkArray(
    specialityItems.map((label, index) => ({ label, index })),
    2,
  );
  const aboutUsRoot =
    aboutUsData?.eMedEventsStats && typeof aboutUsData?.eMedEventsStats === 'object'
      ? aboutUsData.eMedEventsStats
      : {};
  const marketplaceStats = [
    {
      value: getCountValue(
        aboutUsRoot?.hcpcount,
      ),
      label: 'Healthcare Professionals',
    },
    {
      value: getCountValue(
        aboutUsRoot?.hcpcount,
      ),
      label: 'Healthcare Professionals',
    },
    {
      value: getCountValue(
        aboutUsRoot?.specialties,
      ),
      label: 'Specialities',
    },
    {
      value: getCountValue(
        aboutUsRoot?.hosted_conferences,
      ),
      label: 'Online Activities',
    },
    {
      value: getCountValue(
        aboutUsRoot?.live_conferences,
      ),
      label: 'Live Activities',
    },
  ].filter(item => item.value);

  return (
    <>
      <MyStatusBar
        barStyle="dark-content"
        backgroundColor={Colorpath.Pagebg}
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.page, { width }]}>
            <View style={styles.topBar}>
              <Image
                source={Imagepath.Logo}
                style={[
                  styles.logo,
                  { width: scale(width, 40), height: scale(width, 40) },
                ]}
                resizeMode="contain"
              />
              <View style={styles.topActions}>
                <TouchableOpacity
                  style={styles.langPill}
                  onPress={() => openStatePicker('listing')}
                >
                  <Text style={styles.langText}>
                    {getStateCode(selectedState) || 'State'}
                  </Text>
                  <Icon
                    name="keyboard-arrow-down"
                    size={20}
                    color={Colorpath.black}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.signInText}>SIGN IN</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Pressable
              style={styles.searchBar}
              onPress={() => navigation.navigate('GuestSpecialitySearch', {
                taskData: {
                  statid: selectedState?.id ?? '',
                  creditID: selectedState ?? null,
                  isGuest: true,
                },
              })}
            >
              <SearchIcon name="search" size={20} color="#9CA3AF" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.searchTextScrollContent}
                style={styles.searchTextScroll}
              >
                <Text numberOfLines={1} style={styles.searchText}>
                  Search CME, conferences, specialties
                </Text>
              </ScrollView>
              <Icon name="mic-none" size={20} color="#9CA3AF" />
            </Pressable>

            {topBanners.length > 0 ? (
              <>
            <Carousel
              layout="default"
              data={topBanners}
              onSnapToItem={index => setActiveBannerIndex(index)}
              renderItem={({ item }) => {
                let parsedHtml = {};
                if (item.html_content) {
                  const html = item.html_content;
                  const cleanHtml = html.replace(/\n/g, ' ');

                  // Credits count
                  const creditsCountMatch =
                    cleanHtml.match(/<span>(\d+)<\/span>/i);

                  // Accreditation types
                  const creditTypesMatch = cleanHtml.match(/\b(CME|CE|MOC)\b/g);
                  const titleMatch = matchGroup(
                    html,
                    /<h2[^>]*>([\s\S]*?)<\/h2>/i,
                  );
                  const subtitleMatch = matchGroup(
                    html,
                    /<p[^>]*class=['"][^'"]*headingpara[^'"]*['"][^>]*>([\s\S]*?)<\/p>/i,
                  );
                  const locationMatch = matchGroup(
                    html,
                    /<span[^>]*class=['"][^'"]*location[^'"]*['"][^>]*>([\s\S]*?)<\/span>/i,
                  );
                  const imageMatch = html.match(
                    /<div[^>]*class=['"][^'"]*slideright[^'"]*['"][^>]*>[\s\S]*?<img[^>]*src=['"]([^'"]+)['"]/i,
                  );
                  const bannerMeta = parseBannerMeta(html);
                  const dateMatch =
                    bannerMeta.date ||
                    matchGroup(
                      html,
                      /Calendar\.png[^>]*>\s*([^<]+)(?:<|&nbsp;|$)/i,
                    );
                  parsedHtml = {
                    title: titleMatch,
                    subtitle: subtitleMatch,
                    location: locationMatch,
                    image: imageMatch ? imageMatch[1] : null,
                    date: dateMatch,
                    credits: bannerMeta.credits,
                    creditsCount: creditsCountMatch?.[1] || '',
                    creditTypes: creditTypesMatch || [],
                  };
                }
                const displayTitle =
                  parsedHtml.title ||
                  item.title ||
                  item.course_title ||
                  item.name ||
                  item.banner_title ||
                  item.heading ||
                  '';
                const displayKicker =
                  parsedHtml.subtitle ||
                  (item.organizer_name || item.organizer
                    ? `By ${item.organizer_name || item.organizer}`
                    : '');
                const displayMeta = splitMetaLine(
                  parsedHtml.date ||
                    item.start_date ||
                    item.course_start_date ||
                    item.event_date ||
                    item.banner_date,
                );
                const displayDate = displayMeta.date;
                const displayCredits =
                  parsedHtml.credits ||
                  [
                    parsedHtml.creditsCount,
                    (parsedHtml.creditTypes || []).join(' | '),
                  ]
                    .filter(Boolean)
                    .join(' ')
                    .trim() ||
                  displayMeta.credits;
                const displayLocation =
                  parsedHtml.location ||
                  item.location ||
                  item.course_location ||
                  item.venue ||
                  item.city;
                const stateWebcastUrl = getBannerUrl(item);
                const handleRegisterPress = () => {
                  if (stateWebcastUrl) {
                    navigation.navigate('Statewebcast', {
                      webCastURL: {
                        webCastURL: stateWebcastUrl,
                        Realback: 'guest',
                      },
                    });
                  }
                };

                return (
                  <View style={{ width: width-30, alignItems: 'center' }}>
                    <ImageBackground
                      source={Imagepath.HomeUser}
                      imageStyle={styles.heroRadius}
                      style={styles.hero}
                    >
                      {/* <View style={styles.heroBadge}>
                        <Text style={styles.heroBadgeText}>{"10 Days Left"}</Text>
                      </View> */}

                      <View>
                        <Text style={styles.heroKicker}>{displayKicker}</Text>
                        <Text numberOfLines={2} style={styles.heroTitle}>
                          {displayTitle}
                        </Text>
                      </View>
                      <View style={styles.heroBottomRow}>
                        <View style={styles.heroMeta}>
                          {displayDate ? (
                            <View style={styles.heroMetaRow}>
                              <Icon
                                name="access-time"
                                size={18}
                                color="#FFFFFF"
                              />
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.heroMetaText}
                              >
                                {displayDate}
                              </Text>
                            </View>
                          ) : null}
                          {displayCredits ? (
                            <View style={styles.heroMetaRow}>
                              <Image
                                source={Imagepath.CreditValut}
                                style={styles.heroCreditIcon}
                                resizeMode="contain"
                              />
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.heroMetaText}
                              >
                                {displayCredits} Credits
                              </Text>
                            </View>
                          ) : null}
                          {displayLocation ? (
                            <View style={styles.heroLocationRow}>
                              <View style={styles.heroLocationTextWrap}>
                                <Icon
                                  name="location-on"
                                  size={18}
                                  color="#FFFFFF"
                                />
                                <Text
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                                  style={styles.heroMetaText}
                                >
                                  {displayLocation}
                                </Text>
                              </View>
                              <TouchableOpacity
                                style={styles.heroRegisterButton}
                                onPress={handleRegisterPress}
                              >
                                <Text style={styles.heroButtonText}>
                                  REGISTER NOW
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <TouchableOpacity
                              style={styles.heroButton}
                              onPress={handleRegisterPress}
                            >
                              <Text style={styles.heroButtonText}>
                                REGISTER NOW
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </ImageBackground>
                  </View>
                );
              }}
              sliderWidth={width}
              itemWidth={width}
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
            />
            <View style={styles.bannerCounterWrap}>
              <Text style={styles.bannerCounterText}>
                {`${Math.min(activeBannerIndex + 1, topBanners.length || 1)}/${
                  topBanners.length || 1
                }`}
              </Text>
            </View>
              </>
            ) : isHomeLoading ? (
              <GuestHeroShimmer width={width} />
            ) : null}

            {featuredConferences.length > 0 ? (
              <CarouselSection
                title="Featured Activities"
                action="View all"
                data={featuredConferences.map(mapConference)}
                renderItem={renderFeaturedCard}
                sliderWidth={width - 20}
                itemWidth={width - 20}
                width={width}
                onAction={() => navigation.navigate('SearchResult')}
              />
            ) : isHomeLoading ? (
              <GuestCarouselShimmer title="Featured Activity" width={width} />
            ) : null}

            <View style={styles.panel}>
              <Text style={styles.panelTitle}>
                Tell Us Your Profession & Specialty
              </Text>
              <Text style={styles.panelSubTitle}>
                Let us tailor the best courses for you
              </Text>
              <View style={[styles.selectorRow, { gap: 12 }]}>
                <TouchableOpacity
                  style={styles.selectorBox}
                  onPress={() => setProfModalVisible(true)}
                >
                  <Text style={styles.selectorLabel}>Profession</Text>
                  <View style={styles.selectorValueRow}>
                    <Text
                      numberOfLines={1}
                      style={[styles.selectorValue, { flex: 1, marginRight: 4 }]}
                    >
                      {selectedProfession || 'Select Profession'}
                    </Text>
                    <Icon
                      name="keyboard-arrow-down"
                      size={18}
                      color="#4B5563"
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.selectorBox}
                  onPress={() => openStatePicker('profile')}
                >
                  <Text style={styles.selectorLabel}>State</Text>
                  <View style={styles.selectorValueRow}>
                    <Text
                      numberOfLines={1}
                      style={[styles.selectorValue, { flex: 1, marginRight: 4 }]}
                    >
                      {selectedState?.name ||
                        selectedState?.state_name ||
                        selectedState?.title ||
                        'Select State'}
                    </Text>
                    <Icon
                      name="keyboard-arrow-down"
                      size={18}
                      color="#4B5563"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {popularCourses.length > 0 ? (
              <CarouselSection
                title="Most Popular Conferences"
                action="View all"
                data={popularCourses.map(mapPopularConference)}
                renderItem={renderPopularCard}
                sliderWidth={width - 20}
                itemWidth={width - 20}
                width={width}
                onAction={() => navigation.navigate('SearchResult')}
              />
            ) : isHomeLoading ? (
              <GuestCarouselShimmer title="Most Popular Conferences" width={width} />
            ) : null}

            {specialityItems.length > 0 ? (
              <>
                <SectionTitle
                  title="Specialities"
                  action="View all"
                  width={width}
                  onAction={() =>
                    navigation.navigate('BrowseScreen', {
                      highText: {
                        highText: 'Specialty',
                        CreditData: '',
                        isGuest: true,
                        Realback: 'guest',
                      },
                    })
                  }
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipScrollContent}
                >
                  {specialityColumns.map((column, columnIndex) => (
                    <View
                      key={`speciality-column-${columnIndex}`}
                      style={styles.chipColumn}
                    >
                      {column.map(item => {
                        return (
                          <TagChip
                            key={`${item.label}-${item.index}`}
                            label={item.label}
                            active={item.index === activeSpecialty}
                            width={width}
                            onPress={() => {
                              setActiveSpecialty(item.index);
                              navigation.navigate('Globalresult', {
                                trig: {
                                  trig: item.label
                                    .toLowerCase()
                                    .replace(/\s+/g, '-'),
                                  rqstType: 'specialityconferences',
                                  mainKey: 'conference_specialitiy',
                                  CreditData: '',
                                  Realback: 'cont',
                                },
                              });
                            }}
                          />
                        );
                      })}
                    </View>
                  ))}
                </ScrollView>
              </>
            ) : isHomeLoading ? (
              <GuestChipsShimmer width={width} />
            ) : null}

            {specialtyCourseBundles.length > 0 ? (
              <CarouselSection
                title="Specialty Featured"
                action="View all"
                data={specialtyCourseBundles.map(item => ({
                  ...mapConference(item),
                  showSpecialities: true,
                }))}
                renderItem={renderFeaturedCard}
                sliderWidth={width - 20}
                itemWidth={width - 20}
                width={width}
                onAction={() =>
                  navigation.navigate('BrowseScreen', {
                    highText: {
                      highText: 'Specialty',
                      CreditData: '',
                      isGuest: true,
                      Realback: 'guest',
                    },
                  })
                }
              />
            ) : isHomeLoading ? (
              <GuestCarouselShimmer title="Specialty Featured" width={width} />
            ) : null}

            {liveWebinars.length > 0 ? (
              <LiveConferenceSection
                data={liveWebinars.map(mapLiveWebinar)}
                renderItem={renderLiveCard}
                sliderWidth={width}
                itemWidth={width}
                onAction={() =>
                  navigation.navigate('Globalresult', {
                    trig: {
                      trig: 'webinar',
                      rqstType: 'typebasedconferences',
                      mainKey: 'conference_type',
                      Realback: 'cont',
                    },
                  })
                }
              />
            ) : isHomeLoading ? (
              <GuestCarouselShimmer
                title="Live Conferences"
                width={width}
                variant="live"
              />
            ) : null}

            {freeConferences.length > 0 ? (
              <CarouselSection
                title="Free CME/CE"
                action="View all"
                data={freeConferences.map(mapFreeConference)}
                renderItem={renderFreeCard}
                sliderWidth={width - 20}
                itemWidth={width - 20}
                width={width}
                onAction={() =>
                  navigation.navigate('Globalresult', {
                    trig: {
                      trig: 'free',
                      rqstType: 'typebasedconferences',
                      mainKey: 'conference_type',
                      Realback: 'guest',
                    },
                  })
                }
              />
            ) : isHomeLoading ? (
              <GuestCarouselShimmer
                title="Free CME/CE"
                width={width}
                variant="free"
              />
            ) : null}

            <View style={styles.marketHeader}>
              <Text style={styles.marketTitle}>
                World&apos;s Largest CME/CE Marketplace
              </Text>
            </View>
            <StatsGrid width={width} stats={marketplaceStats} />

            <MembershipBanner
              width={width}
              onPress={() =>
                navigation.navigate('CheckMembership', { fromGuestUser: true })
              }
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={profModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setProfModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: '#FFF',
              borderRadius: 12,
              padding: 16,
              width: '80%',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: '#000',
              }}
            >
              Select Profession
            </Text>
            {['Physician', 'Nursing', 'Dentist', 'Pharmacist'].map(prof => (
              <TouchableOpacity
                key={prof}
                onPress={() => handleProfessionSelect(prof)}
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#EEE',
                }}
              >
                <Text style={{ fontSize: 16, color: '#333' }}>{prof}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={stateModalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          onPress={() => setStateModalVisible(false)}
        >
          <Pressable
            style={{
              backgroundColor: '#FFF',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              padding: 16,
              width: '100%',
              maxHeight: '78%',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: '#000',
              }}
            >
              Select State
            </Text>
            <TextInput
              value={stateSearchText}
              onChangeText={setStateSearchText}
              placeholder="Search state"
              placeholderTextColor="#9CA3AF"
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 12,
                color: '#111827',
              }}
            />
            <FlatList
              data={filteredStateList}
              keyExtractor={(item, index) =>
                String(item?.id ?? item?.state_id ?? item?.name ?? index)
              }
              ListEmptyComponent={
                <Text
                  style={{
                    color: '#6B7280',
                    textAlign: 'center',
                    paddingVertical: 16,
                  }}
                >
                  No states found
                </Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleStateItemPress(item)}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#EEE',
                  }}
                >
                  <Text style={{ fontSize: 16, color: '#333' }}>
                    {getStateName(item)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </TouchableOpacity>
      </Modal>

      <CMEChecklistModal
        allProfessionData={allProfessionData}
        setAllProfessionData={setAllProfessionData}
        onCMEClose={onCMEClose}
        onSaved={onSaved}
        isVisibelCME={cmeModalVisible}
        allProfession={allProfession}
        certificatedata={certificatedata}
        cmeRealback={guest?.cmeRealback}
      />
    </>
  );
};

export default GuestUserContent;
