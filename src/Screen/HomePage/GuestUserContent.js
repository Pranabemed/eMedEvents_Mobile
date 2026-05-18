import React, { useMemo, useState } from 'react';
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

const SPECIALTIES = [
  'Internal medicine',
  'Pediatrics',
  'Oncology',
  'Obstetrics',
  'Orthopedics',
  'Cardiology',
  'Dentist',
  'Pulmonology',
];

const STATS = [
  ['1,520,220', 'Healthcare Professionals'],
  ['101,224', 'Registrations Sold'],
  ['303,671', 'Hosted Conferences'],
  ['15,628', 'Organizers'],
  ['606,654', 'Monthly Visitors'],
  ['24/7', 'Live support'],
];

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
  return getText(item?.date, item?.event_date, item?.startdate, item?.startDate);
};

const getCmeLabel = item => {
  if (Array.isArray(item?.cme_points_popovar) && item.cme_points_popovar.length) {
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

  if (item?.display_cme) {
    return String(item.display_cme).toLowerCase().includes('contact hour')
      ? String(item.display_cme).replace(/contact hour/i, 'Contact Hour(s)')
      : String(item.display_cme);
  }

  return '';
};

const getPriceLabel = item => {
  if (String(item?.display_price || '').toUpperCase() === 'FREE') {
    return 'FREE';
  }
  return `${getText(item?.display_currency_code, item?.currency_code, '')}${getText(
    item?.display_price,
    item?.price,
    item?.amount,
  )}`.trim();
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

const FeaturedConferenceCard = ({ item, width }) => {
  console.log("item====",item)
  const organizationName = getText(item?.organization, item?.organizer_name);
  const organizationLogo = getImageSource(
     item?.organizationLogo
 || item?.organization_imagepath ||
      item?.organization_image ||
      item?.organization_logo ||
      item?.logo ||
      item?.image,
  );
  const detailUrl = getText(item?.detailpageUrl, item?.detailPageUrl, item?.detail_page_url, item?.banner_url);

  const handlePress = () => {
    if (detailUrl) {
      item?.onPress?.(detailUrl);
    }
  };

  return (
    <View style={styles.featureCardOuter}>
      <Pressable onPress={handlePress} style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <View style={styles.featureLogoCircle}>
            {organizationLogo ? (
              <Image source={organizationLogo} style={styles.featureLogoImage} resizeMode="cover" />
            ) : (
              <Text style={styles.featureLogoFallback}>
                {getInitials(organizationName) || ' '}
              </Text>
            )}
          </View>
          <Text numberOfLines={1} style={styles.featureOrgName}>
            {organizationName}
          </Text>
        </View>

        <Text numberOfLines={2} style={styles.featureTitle}>
          {getText(item?.title, item?.course_title, item?.conference_name, item?.name, item?.banner_title, item?.heading)}
        </Text>

        {item?.date ? (
          <View style={styles.featureMetaRow}>
            <Icon name="event" size={17} color="#333333" />
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.featureMetaText}>
              {item.date}
            </Text>
          </View>
        ) : null}

        {item?.location ? (
          <View style={styles.featureMetaRow}>
            <Icon name="place" size={18} color="#333333" />
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.featureMetaText}>
              {item.location}
            </Text>
          </View>
        ) : null}

        <View style={styles.featureBottomRow}>
          {item?.cmeLabel ? (
            <View style={styles.featureCmePill}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.featureCmeText}>
                {item.cmeLabel}
              </Text>
            </View>
          ) : null}

          {item?.price ? (
            <View style={styles.featurePricePill}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.featurePriceText}>
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

const StatsGrid = ({ width }) => (
  <View style={styles.statsGrid}>
    <View style={styles.statTileFull}>
      <Text style={[styles.statValue, { fontSize: scale(width, 24) }]}>
        {STATS[0][0]}
      </Text>
      <Text style={[styles.statLabel, { fontSize: scale(width, 13) }]}>
        {STATS[0][1]}
      </Text>
    </View>
    {STATS.slice(1, 5).map(([value, label]) => (
      <View key={label} style={styles.statTile}>
        <Text style={[styles.statValue, { fontSize: scale(width, 18) }]}>
          {value}
        </Text>
        <Text style={[styles.statLabel, { fontSize: scale(width, 11) }]}>
          {label}
        </Text>
      </View>
    ))}
  </View>
);

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
    <TouchableOpacity style={styles.membershipFeatureText} activeOpacity={0.85}>
      <Text style={styles.moreFeaturesText}>and more features...</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPress} style={styles.membershipButton}>
      <Text style={styles.membershipButtonText}>Explore Now</Text>
    </TouchableOpacity>
  </LinearGradient>
);

const GuestUserContent = ({ guest }) => {
  const {
    navigation,
    homeData,
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
  const { width } = useWindowDimensions();
  const [activeSpecialty, setActiveSpecialty] = useState(0);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

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
  const featuredConferences = firstArray(
    homeData?.featured_conferences,
    homeData?.featuredConferences,
    homeData?.featured,
    homeData?.conferences,
  );
  const filteredStateList = (stateList || []).filter(item => {
    const name = String(
      item?.name || item?.state_name || item?.title || '',
    ).toLowerCase();
    return name.includes(stateSearchText.trim().toLowerCase());
  });

  const cards = useMemo(
    () => [
      {
        title: 'Paediatric Emergency Medicine (PEM) Course',
        kicker: 'By PEM Courses',
        date: 'Sep 04 - 05, 2024',
        location: 'Bali, Bali, ID',
        credit: '1 AMA PRA Category 1 Credit™',
        price: 'US$999.00',
        cta: 'REGISTER NOW',
        image: Imagepath.SpecialityCard,
        badge: 'FEW DAYS LEFT',
        onPress: () => navigation.navigate('SearchResult'),
      },
      {
        title: 'Next-Gen Immuno Oncology Conference',
        kicker: 'By MarketandMarkets',
        date: 'Oct 21 - 22, 2023',
        location: 'UK, San Diego',
        credit: '1 AMA PRA Category 1 Credit™',
        price: 'US$1,165.00',
        cta: 'VIEW',
        image: Imagepath.MainCard,
        onPress: () => navigation.navigate('SearchResult'),
      },
      {
        title: 'Advanced Cardiology Summit 2024',
        kicker: 'By HeartHealth',
        date: 'June 12 - 14, 2024',
        location: 'Chicago, Illinois',
        credit: '12 AMA PRA Category 1 Credit™',
        price: 'US$850.00',
        cta: 'REGISTER',
        image: Imagepath.HomeBanner,
        onPress: () => navigation.navigate('SearchResult'),
      },
      {
        title: 'Global Healthcare Expo 2024',
        kicker: 'By WorldHealth',
        date: 'Aug 20 - 22, 2024',
        location: 'New York, USA',
        credit: '15 AMA PRA Category 1 Credit™',
        price: 'US$1,200.00',
        cta: 'VIEW',
        image: Imagepath.GlobalPng,
        onPress: () => navigation.navigate('SearchResult'),
      },
    ],
    [navigation],
  );

  const mapConference = c => ({
    title: getText(
      c?.course_title,
      c?.title,
      c?.conference_name,
      c?.name,
      c?.banner_title,
      c?.heading,
    ),
    organization: getText(c?.organization_name, c?.organizer_name, c?.organizer),
    organizationLogo: getImageSource(
      c?.organization_imagepath ||
        c?.organization_image ||
        c?.organization_logo ||
        c?.logo ||
        c?.image,
    ),
    date: getDateRange(c),
    location: getText(c?.course_location, c?.location, c?.venue, c?.city),
    cmeLabel: getCmeLabel(c),
    price: getPriceLabel(c),
    button: getText(c?.button, c?.buttonText, c?.button_text, c?.cta_text) || 'Register',
    detailpageUrl: getDetailPageUrl(c),
    onPress: detailUrl => {
      const url = detailUrl || getDetailPageUrl(c);
      if (url) {
        onFeaturedActivityPress?.(url);
      }
    },
  });

  const renderCard = ({ item }) => <ConferenceCard item={item} width={width} />;
  const renderFeaturedCard = ({ item }) => (
    item?.organization || item?.cmeLabel || item?.detailpageUrl ? (
      <FeaturedConferenceCard item={item} width={width} />
    ) : (
      <ConferenceCard item={item} width={width} />
    )
  );
  const renderDarkCard = ({ item }) => (
    <ConferenceCard item={item} width={width} dark />
  );
  const renderCompactCard = ({ item }) => (
    <ConferenceCard item={item} width={width} compact />
  );

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
                  onPress={() => navigation.navigate('BrowseScreen')}
                >
                  <Text style={styles.langText}>FL</Text>
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
              onPress={() => navigation.navigate('SearchScreen')}
            >
              <SearchIcon name="search" size={20} color="#9CA3AF" />
              <Text style={styles.searchText}>
                Search CME, conferences, specialties
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('FilterScreen')}
              >
                <Icon name="mic-none" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </Pressable>

            <Carousel
              layout="default"
              data={topBanners.length > 0 ? topBanners : [{ fallback: true }]}
              onSnapToItem={index => setActiveBannerIndex(index)}
              renderItem={({ item }) => {
                if (item.fallback) {
                  return (
                    <View style={{ width: width - 32, alignItems: 'center' }}>
                      <ImageBackground
                        source={Imagepath.HomeUser}
                        imageStyle={styles.heroRadius}
                        style={styles.hero}
                      >
                        <View style={styles.heroBadge}>
                          <Text style={styles.heroBadgeText}>
                            FEW{'\n'}DAYS{'\n'}LEFT
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.heroKicker}>By PEM Courses</Text>
                          <Text numberOfLines={2} style={styles.heroTitle}>
                            Paediatric Emergency Medicine (PEM) Course
                          </Text>
                        </View>
                        <View style={styles.heroBottomRow}>
                          <View style={styles.heroMeta}>
                            <View style={styles.heroMetaRow}>
                              <Icon
                                name="access-time"
                                size={18}
                                color="#FFFFFF"
                              />
                              <Text style={styles.heroMetaText}>
                                {'Sep 04 - 05, 2024'}
                              </Text>
                            </View>
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
                                  {'Bali, Bali, ID'}
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
                          </View>
                        </View>
                      </ImageBackground>
                    </View>
                  );
                }
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
                  [parsedHtml.creditsCount, (parsedHtml.creditTypes || []).join(' | ')]
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
                      webCastURL: { webCastURL: stateWebcastUrl, Realback: 'guest' },
                    });
                  }
                };

                return (
                  <View style={{ width: width - 32, alignItems: 'center' }}>
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

            <CarouselSection
              title="Featured Activity"
              action="View all"
              data={
                featuredConferences.length > 0
                  ? featuredConferences.map(mapConference)
                  : cards
              }
              renderItem={renderFeaturedCard}
              sliderWidth={width - 20}
              itemWidth={width - 20}
              width={width}
              onAction={() => navigation.navigate('SearchResult')}
            />

            <View style={styles.panel}>
              <Text style={styles.panelTitle}>
                Tell Us Your Profession & Specialty
              </Text>
              <Text style={styles.panelSubTitle}>
                Let us tailor the best courses for you
              </Text>
              <View style={styles.selectorRow}>
                <TouchableOpacity
                  style={styles.selectorBox}
                  onPress={() => setProfModalVisible(true)}
                >
                  <Text style={styles.selectorLabel}>Profession</Text>
                  <View style={styles.selectorValueRow}>
                    <Text style={styles.selectorValue}>
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
                  onPress={handleStatePress}
                >
                  <Text style={styles.selectorLabel}>State</Text>
                  <View style={styles.selectorValueRow}>
                    <Text
                      numberOfLines={1}
                      style={[styles.selectorValue, { maxWidth: '80%' }]}
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

            <CarouselSection
              title="Most Popular Conferences"
              action="View all"
              data={cards}
              renderItem={renderCard}
              sliderWidth={width - 32}
              itemWidth={width - 32}
              width={width}
              onAction={() => navigation.navigate('SearchResult')}
            />

            <SectionTitle
              title="Specialities"
              action="View all"
              width={width}
              onAction={() => {}}
            />
            <View style={styles.chipRow}>
              {(topSpecialities.length > 0
                ? topSpecialities
                    .map(c =>
                      getText(
                        c?.name,
                        c?.specialty_name,
                        c?.speciality_name,
                        c?.title,
                      ),
                    )
                    .filter(Boolean)
                : SPECIALTIES
              ).map((item, index) => (
                <TagChip
                  key={`${item}-${index}`}
                  label={item}
                  active={index === activeSpecialty}
                  width={width}
                  onPress={() => setActiveSpecialty(index)}
                />
              ))}
            </View>

            <CarouselSection
              title="Specialty Featured"
              action="View all"
              data={[cards[1], cards[0], cards[2]]}
              renderItem={renderDarkCard}
              sliderWidth={width - 32}
              itemWidth={width - 32}
              width={width}
              onAction={() => navigation.navigate('SearchResult')}
            />

            <CarouselSection
              title="Live Conferences"
              action="View all"
              data={cards}
              renderItem={renderCompactCard}
              sliderWidth={width - 32}
              itemWidth={width - 32}
              width={width}
              onAction={() => navigation.navigate('SearchResult')}
            />

            <CarouselSection
              title="Free CME/CE"
              action="View all"
              data={cards}
              renderItem={renderCompactCard}
              sliderWidth={width - 32}
              itemWidth={width - 32}
              width={width}
              onAction={() => navigation.navigate('SearchResult')}
            />

            <View style={styles.marketHeader}>
              <Text style={styles.marketTitle}>
                World&apos;s Largest CME/CE Marketplace
              </Text>
            </View>
            <StatsGrid width={width} />

            <MembershipBanner
              width={width}
              onPress={() => navigation.navigate('Testing')}
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

      <Modal visible={stateModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setStateModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: '#FFF',
              borderRadius: 12,
              padding: 16,
              width: '80%',
              maxHeight: '70%',
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
                  onPress={() => handleStateSelect(item)}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#EEE',
                  }}
                >
                  <Text style={{ fontSize: 16, color: '#333' }}>
                    {item.name || item.state_name || item.title}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
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
      />
    </>
  );
};

export default GuestUserContent;
