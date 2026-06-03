import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import MyStatusBar from '../../Utils/MyStatusBar';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import { getApi } from '../../Utils/Helpers/ApiRequest';
import { StateBundleLandingRequest } from '../../Redux/Reducers/GuestReducer';
import {SafeAreaView} from 'react-native-safe-area-context';
import ProfessionDropdown from './ProfessionDropdown';
import RequirementCard from './RequirementCard';
import CourseHorizontalList from './CourseHorizontalList';

const professionMapping = {
  Physician: 167,
  Nursing: 169,
  Dentist: 171,
  Pharmacist: 173,
};

const getDynamicCourseSections = responseData => {
  if (!responseData || typeof responseData !== 'object') {
    return [];
  }

  return Object.entries(responseData)
    .filter(([key, value]) => Array.isArray(value) && value.length > 0 && key.includes('_bundle'))
    .map(([key, value]) => ({
      key,
      data: value,
      isMandatory: key.includes('_bundle_conference'),
    }));
};

const getSectionGroupKey = key =>
  String(key)
    .replace(/_bundle_conferences$/i, '')
    .replace(/_bundle_conference$/i, '')
    .replace(/_bundle$/i, '');

const getPairedCourseSections = sections => {
  const grouped = new Map();

  sections.forEach(section => {
    const groupKey = getSectionGroupKey(section.key);
    const existing = grouped.get(groupKey) || {
      key: groupKey || section.key,
      bundle: null,
      conference: null,
      extras: [],
    };

    if (section.isMandatory && !existing.conference) {
      existing.conference = section;
    } else if (!section.isMandatory && !existing.bundle) {
      existing.bundle = section;
    } else {
      existing.extras.push(section);
    }

    grouped.set(groupKey, existing);
  });

  return Array.from(grouped.values());
};

const CMERequirement = (props) => {
  const dispatch = useDispatch();
  const GuestReducer = useSelector(state => state.GuestReducer);

  // Retrieve initial values if passed from navigation
  const initialPassedState = props?.route?.params?.initialState;
  const initialPassedProf = props?.route?.params?.initialProfession;

  // Local state management
  const [selectedProfession, setSelectedProfession] = useState(
    initialPassedProf || 'Physician'
  );
  const [selectedState, setSelectedState] = useState(
    initialPassedState || { name: 'Alabama', state_id: 1, id: 1 }
  );
  const [statesList, setStatesList] = useState([]);
  const [cmeRequirementData, setCmeRequirementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAllPairs, setShowAllPairs] = useState(false);

  // Helper to fetch list of US states dynamically
  const fetchStates = useCallback(async () => {
    try {
      const response = await getApi('master/states?country_id=1');
      if (response?.data?.states) {
        setStatesList(response.data.states);
        // Sync selected state if initialPassedState is just a string or partial
        if (initialPassedState) {
          const match = response.data.states.find(
            s =>
              String(s.name).toLowerCase() ===
              String(initialPassedState.name || initialPassedState).toLowerCase()
          );
          if (match) setSelectedState(match);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch states list:', err);
    }
  }, [initialPassedState]);

  // Fetch the CME requirements and recommended courses
  const fetchRequirements = useCallback((profession, stateObj) => {
    const profId = professionMapping[profession] || 167;
    const stateName = stateObj?.name || stateObj?.state_name || stateObj?.title || 'Alabama';

    dispatch(
      StateBundleLandingRequest({
        profession_id: profId,
        state: stateName,
      }),
    );
  }, [dispatch]);

  // Initialize States List
  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  // Fetch data on state/profession change
  useEffect(() => {
    if (selectedState) {
      fetchRequirements(selectedProfession, selectedState);
    }
  }, [fetchRequirements, selectedProfession, selectedState]);

  useEffect(() => {
    if (GuestReducer?.status === 'Guest/StateBundleLandingRequest') {
      setLoading(true);
      setError(false);
      return;
    }

    if (GuestReducer?.status === 'Guest/StateBundleLandingSuccess') {
      const responseData =
        GuestReducer?.StateBundleLandingResponse?.data &&
        typeof GuestReducer?.StateBundleLandingResponse?.data === 'object'
          ? GuestReducer?.StateBundleLandingResponse?.data
          : GuestReducer?.StateBundleLandingResponse || {};

      const hasRequirementData =
        responseData?.cme_data && Object.keys(responseData.cme_data).length > 0;
      const hasCourseData = getDynamicCourseSections(responseData).length > 0;
      const hasData = hasRequirementData || hasCourseData;

      setCmeRequirementData(hasData ? responseData : null);
      setError(!hasData);
      setLoading(false);
      setShowAllPairs(false);
      return;
    }

    if (GuestReducer?.status === 'Guest/StateBundleLandingFailure') {
      setCmeRequirementData(null);
      setError(true);
      setLoading(false);
      setShowAllPairs(false);
    }
  }, [GuestReducer?.StateBundleLandingResponse, GuestReducer?.status]);

  const handleBack = () => {
    props.navigation.goBack();
  };

  const handleMenuPress = () => {
    Alert.alert(
      'CME Requirements',
      'Choose a profession and state to review the latest licensure requirements and related courses.',
    );
  };

  const getStateName = item => item?.name || item?.state_name || item?.title || 'Alabama';
  const pageTitle = `${getStateName(selectedState)} CME Requirements`;
  const dynamicCourseSections = getDynamicCourseSections(cmeRequirementData);
  const pairedCourseSections = getPairedCourseSections(dynamicCourseSections);
  const visiblePairedSections = showAllPairs ? pairedCourseSections : pairedCourseSections.slice(0, 1);

  // Render Skeleton Shimmer Loading state
  const renderShimmer = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <SkeletonPlaceholder backgroundColor="#F3F4F6" highlightColor="#E5E7EB">
        <View style={{ paddingHorizontal: normalize(16), paddingTop: normalize(16) }}>
          {/* Dropdown Container Shimmer */}
          <View style={{ height: normalize(52), borderRadius: normalize(8), marginBottom: normalize(20) }} />
          
          {/* Requirements Card Shimmer */}
          <View style={{ height: normalize(220), borderRadius: normalize(12), marginBottom: normalize(20) }} />
          
          {/* Section 1 Title Shimmer */}
          <View style={{ width: normalize(180), height: normalize(18), borderRadius: normalize(4), marginBottom: normalize(12) }} />
          
          {/* Horiz list placeholders */}
          <View style={styles.shimmerRow}>
            <View style={{ width: normalize(240), height: normalize(240), borderRadius: normalize(12), marginRight: normalize(16) }} />
            <View style={{ width: normalize(240), height: normalize(240), borderRadius: normalize(12) }} />
          </View>

          {/* Section 2 Title Shimmer */}
          <View style={{ width: normalize(200), height: normalize(18), borderRadius: normalize(4), marginBottom: normalize(12) }} />
          
          {/* Horiz list placeholders */}
          <View style={styles.shimmerRow}>
            <View style={{ width: normalize(240), height: normalize(240), borderRadius: normalize(12), marginRight: normalize(16) }} />
            <View style={{ width: normalize(240), height: normalize(240), borderRadius: normalize(12) }} />
          </View>
        </View>
      </SkeletonPlaceholder>
    </ScrollView>
  );

  return (
    <>
      <MyStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerSideButton}>
            <Icon name="arrow-back-ios-new" size={normalize(18)} color="#111827" />
          </TouchableOpacity>

          <Text numberOfLines={1} style={styles.headerTitle}>{pageTitle}</Text>

          <TouchableOpacity onPress={handleMenuPress} style={styles.headerSideButton}>
            <Icon name="info-outline" size={normalize(20)} color="#64748B" />
          </TouchableOpacity>
        </View>

        {loading ? (
          renderShimmer()
        ) : (
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Dropdown Section */}
            <View style={styles.dropdownWrap}>
              <ProfessionDropdown
                selectedProfession={selectedProfession}
                onSelectProfession={setSelectedProfession}
                selectedState={selectedState}
                onSelectState={setSelectedState}
                statesList={statesList}
              />
            </View>

            {/* CME Requirement Content / Empty State / Error Screen */}
            {error || !cmeRequirementData ? (
              <View style={styles.emptyContainer}>
                <Icon name="error-outline" size={normalize(48)} color="#9CA3AF" />
                <Text style={styles.emptyText}>No CME requirements found</Text>
              </View>
            ) : (
              <View>
                {/* Requirements Card */}
                <View style={styles.cardWrap}>
                  <RequirementCard
                    stateName={getStateName(selectedState)}
                    professionName={selectedProfession}
                    cmeData={cmeRequirementData.cme_data}
                    creditCategory={cmeRequirementData.creditCategory}
                  />
                </View>

                {visiblePairedSections.map(group => (
                  <View key={group.key}>
                    {group.bundle ? (
                      <CourseHorizontalList
                        data={group.bundle.data}
                        isMandatory={group.bundle.isMandatory}
                      />
                    ) : null}

                    {group.conference ? (
                      <CourseHorizontalList
                        data={group.conference.data}
                        isMandatory={group.conference.isMandatory}
                      />
                    ) : null}

                    {group.extras.map(section => (
                      <CourseHorizontalList
                        key={section.key}
                        data={section.data}
                        isMandatory={section.isMandatory}
                      />
                    ))}
                  </View>
                ))}

                {pairedCourseSections.length > 1 ? (
                  <TouchableOpacity
                    style={styles.toggleButton}
                    activeOpacity={0.85}
                    onPress={() => setShowAllPairs(prev => !prev)}
                  >
                    <Text style={styles.toggleButtonText}>
                      {showAllPairs ? 'View less' : 'View more'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  shimmerRow: {
    flexDirection: 'row',
    marginBottom: normalize(25),
  },
  header: {
    height: normalize(52),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(10),
    backgroundColor: '#FFFFFF',
  },
  headerSideButton: {
    width: normalize(34),
    height: normalize(34),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.InterBold,
    flex: 1,
    fontSize: normalize(15),
    color: '#0F172A',
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: normalize(10),
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: normalize(40),
  },
  dropdownWrap: {
    paddingHorizontal: normalize(16),
    paddingTop: normalize(12),
    paddingBottom: normalize(10),
  },
  cardWrap: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(6),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(80),
    paddingHorizontal: normalize(20),
  },
  emptyText: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(14),
    color: '#9CA3AF',
    marginTop: normalize(12),
    textAlign: 'center',
  },
  toggleButton: {
    alignSelf: 'center',
    marginTop: normalize(4),
    marginBottom: normalize(16),
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(10),
    borderRadius: normalize(20),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8E3F4',
  },
  toggleButtonText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(12),
    color: '#2C4DB9',
  },
});

export default CMERequirement;
