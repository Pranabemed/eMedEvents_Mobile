import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Colorpath from '../../Themes/Colorpath';
import Imagepath from '../../Themes/Imagepath';
import MyStatusBar from '../../Utils/MyStatusBar';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { HomelistRequest } from '../../Redux/Reducers/GuestReducer';
import { countryRequest, stateRequest } from '../../Redux/Reducers/AuthReducer';
import { professionvaultRequest } from '../../Redux/Reducers/CreditVaultReducer';
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

const scale = (width, value) =>
  Math.round((Math.min(width, 430) / 390) * value);

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

const GuestUser = props => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { width } = useWindowDimensions();
  const [activeSpecialty, setActiveSpecialty] = useState(0);

  const AuthReducer = useSelector(state => state.AuthReducer);
  const GuestReducer = useSelector(state => state.GuestReducer);
  const CreditVaultReducer = useSelector(state => state.CreditVaultReducer);

  const [profModalVisible, setProfModalVisible] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [cmeModalVisible, setCmeModalVisible] = useState(false);
  const [allProfessionData, setAllProfessionData] = useState(null);

  const PROFESSIONS = ['Physician', 'Nursing', 'Dentist', 'Pharmacist'];

  useEffect(() => {
    dispatch(countryRequest({}));
  }, [dispatch]);

  useEffect(() => {
    if (AuthReducer?.countryResponse?.data) {
      const us = AuthReducer.countryResponse.data.find(c => c.name === 'United States');
      if (us) {
        dispatch(stateRequest(us.id));
      }
    }
  }, [AuthReducer?.countryResponse?.data, dispatch]);

  useEffect(() => {
    if (CreditVaultReducer?.status === 'CreditVault/professionvaultSuccess') {
      setAllProfessionData(CreditVaultReducer?.professionvaultResponse);
      setCmeModalVisible(true);
    }
  }, [CreditVaultReducer?.status, CreditVaultReducer?.professionvaultResponse]);

  const handleProfStateSubmit = (prof, stateObj) => {
    if (prof && stateObj) {
      dispatch(professionvaultRequest({ profession: prof, stateId: stateObj.id }));
    }
  };

  const handleProfessionSelect = (prof) => {
    setSelectedProfession(prof);
    setProfModalVisible(false);
    if (selectedState) {
      handleProfStateSubmit(prof, selectedState);
    }
  };

  const handleStateSelect = (stateObj) => {
    setSelectedState(stateObj);
    setStateModalVisible(false);
    if (selectedProfession) {
      handleProfStateSubmit(selectedProfession, stateObj);
    }
  };

  useEffect(() => {
    if (!isFocused) return;
    connectionrequest()
      .then(() => dispatch(HomelistRequest({})))
      .catch(err => showErrorAlert('Please connect to internet', err));
  }, [dispatch, isFocused]);

  const homeData = GuestReducer?.HomelistResponse?.data || {};
  const topBanners = homeData?.mobile_top_banners || [];
  const topSpecialities = homeData?.topSpecialities || [];
  const featuredConferences = homeData?.featured_conferences || [];

  const mapConference = (c) => ({
    title: c.course_title || c.title || c.name || '',
    kicker: c.organizer_name ? `By ${c.organizer_name}` : '',
    date: c.course_start_date || c.start_date || '',
    location: c.course_location || c.location || '',
    credit: c.credits ? `${c.credits} Credits` : '',
    price: c.price ? `US$${c.price}` : '',
    cta: 'VIEW',
    image: c.image_path || c.course_image ? { uri: c.image_path || c.course_image } : Imagepath.MainCard,
    onPress: () => props.navigation.navigate('SearchResult'),
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
        onPress: () => props.navigation.navigate('SearchResult'),
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
        onPress: () => props.navigation.navigate('SearchResult'),
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
        onPress: () => props.navigation.navigate('SearchResult'),
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
        onPress: () => props.navigation.navigate('SearchResult'),
      },
    ],
    [props.navigation],
  );

  const renderCard = ({ item }) => <ConferenceCard item={item} width={width} />;
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
          <View style={[styles.page, { width: width }]}>
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
                  onPress={() => props.navigation.navigate('BrowseScreen')}
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
                  onPress={() => props.navigation.navigate('Login')}
                >
                  <Text style={styles.signInText}>SIGN IN</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Pressable
              style={styles.searchBar}
              onPress={() => props.navigation.navigate('SearchScreen')}
            >
              <SearchIcon name="search" size={20} color="#9CA3AF" />
              <Text style={styles.searchText}>
                Search CME, conferences, specialties
              </Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('FilterScreen')}
              >
                <Icon name="mic-none" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </Pressable>
           {/*Top banner with conference details and register button*/}
            <Carousel
              layout="stack"
              data={topBanners.length > 0 ? topBanners : [ { fallback: true } ]}
              renderItem={({ item }) => {
                if (item.fallback) {
                  return (
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
                                <Icon name="access-time" size={18} color="#FFFFFF" />
                                <Text style={styles.heroMetaText}>
                                  {'Sep 04 - 05, 2024'}
                                </Text>
                              </View>
                              <View style={styles.heroMetaRow}>
                                <Icon name="location-on" size={18} color="#FFFFFF" />
                                <Text style={styles.heroMetaText}>{'Bali, Bali, ID'}</Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={styles.heroButton}
                              onPress={() => props.navigation.navigate('SearchResult')}
                            >
                              <Text style={styles.heroButtonText}>REGISTER NOW</Text>
                            </TouchableOpacity>
                          </View>
                        </ImageBackground>
                  );
                }
                return (
                  <ImageBackground
                    source={{ uri: item.banner_image || item.image_path || item.mobile_image }}
                    imageStyle={styles.heroRadius}
                    style={styles.hero}
                  >
                    {item.badge ? (
                    <View style={styles.heroBadge}>
                      <Text style={styles.heroBadgeText}>{item.badge}</Text>
                    </View>
                    ) : null}
                    <View>
                      <Text style={styles.heroKicker}>{item.organizer_name ? `By ${item.organizer_name}` : ''}</Text>
                      <Text numberOfLines={2} style={styles.heroTitle}>
                        {item.title || item.course_title || item.name || ''}
                      </Text>
                    </View>
                    <View style={styles.heroBottomRow}>
                      <View style={styles.heroMeta}>
                        {item.start_date || item.course_start_date ? (
                        <View style={styles.heroMetaRow}>
                          <Icon name="access-time" size={18} color="#FFFFFF" />
                          <Text style={styles.heroMetaText}>
                            {item.start_date || item.course_start_date}
                          </Text>
                        </View>
                        ) : null}
                        {item.location || item.course_location ? (
                        <View style={styles.heroMetaRow}>
                          <Icon name="location-on" size={18} color="#FFFFFF" />
                          <Text style={styles.heroMetaText}>{item.location || item.course_location}</Text>
                        </View>
                        ) : null}
                      </View>
                      <TouchableOpacity
                        style={styles.heroButton}
                        onPress={() => props.navigation.navigate('SearchResult')}
                      >
                        <Text style={styles.heroButtonText}>REGISTER NOW</Text>
                      </TouchableOpacity>
                    </View>
                  </ImageBackground>
                );
              }}
              sliderWidth={width}
              itemWidth={width - 32}
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
            />

            <CarouselSection
              title="Featured Conferences"
              action="View all"
              data={featuredConferences.length > 0 ? featuredConferences.map(mapConference) : cards}
              renderItem={renderCard}
              sliderWidth={width - 32}
              itemWidth={width - 32}
              width={width}
              onAction={() => props.navigation.navigate('SearchResult')}
            />

            <View style={styles.panel}>
              <Text style={styles.panelTitle}>
                Tell Us Your Profession & Specialty
              </Text>
              <Text style={styles.panelSubTitle}>
                Let us tailor the best courses for you
              </Text>
              <View style={styles.selectorRow}>
                <TouchableOpacity style={styles.selectorBox} onPress={() => setProfModalVisible(true)}>
                  <Text style={styles.selectorLabel}>Profession</Text>
                  <View style={styles.selectorValueRow}>
                    <Text style={styles.selectorValue}>{selectedProfession || 'Select Profession'}</Text>
                    <Icon name="keyboard-arrow-down" size={18} color="#4B5563" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.selectorBox} onPress={() => setStateModalVisible(true)}>
                  <Text style={styles.selectorLabel}>State</Text>
                  <View style={styles.selectorValueRow}>
                    <Text numberOfLines={1} style={[styles.selectorValue, { maxWidth: '80%' }]}>{selectedState?.name || 'Select State'}</Text>
                    <Icon name="keyboard-arrow-down" size={18} color="#4B5563" />
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
              onAction={() => props.navigation.navigate('SearchResult')}
            />

            <SectionTitle
              title="Specialties"
              action="View all"
              width={width}
              onAction={() => {}}
            />
            <View style={styles.chipRow}>
              {(topSpecialities.length > 0 ? topSpecialities.map(c => c.name || c.specialty_name) : SPECIALTIES).map((item, index) => (
                <TagChip
                  key={index.toString()}
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
              onAction={() => props.navigation.navigate('SearchResult')}
            />

            <CarouselSection
              title="Live Conferences"
              action="View all"
              data={cards}
              renderItem={renderCompactCard}
              sliderWidth={width - 32}
              itemWidth={width - 32}
              width={width}
              onAction={() => props.navigation.navigate('SearchResult')}
            />

            <CarouselSection
              title="Free CME/CE"
              action="View all"
              data={cards}
              renderItem={renderCompactCard}
              sliderWidth={width - 32}
              itemWidth={width - 32}
              width={width}
              onAction={() => props.navigation.navigate('SearchResult')}
            />

            <View style={styles.marketHeader}>
              <Text style={styles.marketTitle}>
                World's Largest CME/CE Marketplace
              </Text>
            </View>
            <StatsGrid width={width} />

            <MembershipBanner
              width={width}
              onPress={() => props.navigation.navigate('Testing')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={profModalVisible} transparent animationType="fade">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setProfModalVisible(false)}>
          <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, width: '80%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#000' }}>Select Profession</Text>
            {PROFESSIONS.map((prof) => (
              <TouchableOpacity key={prof} onPress={() => handleProfessionSelect(prof)} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' }}>
                <Text style={{ fontSize: 16, color: '#333' }}>{prof}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={stateModalVisible} transparent animationType="fade">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setStateModalVisible(false)}>
          <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, width: '80%', maxHeight: '70%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#000' }}>Select State</Text>
            <FlatList
              data={AuthReducer?.stateResponse?.data || []}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleStateSelect(item)} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' }}>
                  <Text style={{ fontSize: 16, color: '#333' }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <CMEChecklistModal
        allProfessionData={allProfessionData}
        setAllProfessionData={setAllProfessionData}
        onCMEClose={() => setCmeModalVisible(false)}
        onSaved={() => setCmeModalVisible(false)}
        isVisibelCME={cmeModalVisible}
        allProfession={selectedProfession}
        certificatedata={{state_id: selectedState?.id}}
      />
    </>
  );
};

export default GuestUser;
