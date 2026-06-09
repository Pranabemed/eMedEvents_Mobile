/**
 * File Name: CMERequirement.js
 * Module: CME Requirement
 * Purpose: Renders the CME requirement screen with profession/state filters, requirement details, and course bundle sections.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, react-native, react-redux, react-native-vector-icons/MaterialIcons, react-native-skeleton-placeholder, react-native-safe-area-context, ../../Utils/MyStatusBar, ../../Themes/Fonts, ../../Utils/Helpers/Dimen, ../../Utils/Helpers/ApiRequest, ../../Redux/Reducers/GuestReducer, ./ProfessionDropdown, ./RequirementCard, ./CourseHorizontalList
 */

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
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfessionDropdown from './ProfessionDropdown';
import RequirementCard from './RequirementCard';
import CourseHorizontalList from './CourseHorizontalList';

const professionMapping = {
  Physician: 167,
  Nursing: 169,
  Dentist: 171,
  Pharmacist: 173,
};

/**
 * Description: Extracts valid course bundle sections from the API payload while preserving response order.
 * Purpose: Converts raw API bundle keys into a render-friendly section list for the CME requirement screen.
 *
 * Params:
 * @param {Object} responseData
 *
 * Returns:
 * @returns {Array}
 *
 * Flow:
 * 1. Guard against invalid payloads.
 * 2. Filter keys that contain non-empty bundle arrays.
 * 3. Map each bundle entry to a normalized section object.
 *
 * API Used:
 * Guest State Bundle Landing response payload
 *
 * Redux Actions:
 * Used after Guest/StateBundleLandingSuccess response is stored.
 *
 * Error Handling:
 * Returns an empty array when payload shape is invalid.
 */
const getDynamicCourseSections = responseData => {
  if (!responseData || typeof responseData !== 'object') {
    return [];
  }

  const supportedSectionKeyPatterns = [
    '_bundle',
    'other_courses_list',
    'flag',
    'parameter',
  ];

  return Object.entries(responseData)
    .filter(
      ([key, value]) =>
        Array.isArray(value) &&
        value.length > 0 &&
        supportedSectionKeyPatterns.some(pattern => key.includes(pattern)),
    )
    .map(([key, value]) => ({
      key,
      data: value,
      isMandatory: key.includes('_bundle_conference'),
    }));
};

/**
 * Description: Normalizes related bundle keys into a shared grouping key.
 * Purpose: Helps pair standard bundles with conference bundles that belong to the same specialty/state section.
 *
 * Params:
 * @param {string} key
 *
 * Returns:
 * @returns {string}
 *
 * Flow:
 * 1. Convert the incoming key to string.
 * 2. Strip conference and bundle suffixes.
 * 3. Return the shared group key.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Handles non-string values through safe string conversion.
 */
const getSectionGroupKey = key =>
  String(key)
    .replace(/_bundle_conferences$/i, '')
    .replace(/_bundle_conference$/i, '')
    .replace(/_bundle$/i, '');

const isBundleConferenceKey = key =>
  String(key).includes('_bundle_conference');

const isPrimaryBundleKey = key =>
  String(key).includes('_bundle') &&
  !String(key).includes('_bundle_conference') &&
  !String(key).includes('other_courses_list');

const getCourseIdentity = item =>
  String(
    item?.id ||
    item?.detailpage_url ||
    item?.emed_url ||
    item?.course_id ||
    item?.conference_id ||
    item?.title ||
    '',
  )
    .trim()
    .toLowerCase();

const filterUniqueSection = (section, seenItems) => {
  if (!section || !Array.isArray(section.data)) {
    return null;
  }

  const isBundle = isPrimaryBundleKey(section.key);

  const uniqueItems = section.data.filter(item => {
    const identity = getCourseIdentity(item);
    if (!identity) {
      return false;
    }
    if (!isBundle && seenItems.has(identity)) {
      return false;
    }
    seenItems.add(identity);
    return true;
  });

  return uniqueItems.length > 0 ? { ...section, data: uniqueItems } : null;
};

const removeDuplicateCourseSections = sections => {
  const seenItems = new Set();

  return sections
    .map(group => {
      const bundle = filterUniqueSection(group.bundle, seenItems);
      const conference = filterUniqueSection(group.conference, seenItems);
      const extras = group.extras
        .map(section => filterUniqueSection(section, seenItems))
        .filter(Boolean);

      return {
        ...group,
        conference,
        bundle,
        extras,
      };
    })
    .filter(group => group.conference || group.bundle || group.extras.length > 0);
};

const prioritizeBundleGroups = groups =>
  [...groups].sort((firstGroup, secondGroup) => {
    const firstHasBundle = Boolean(firstGroup?.bundle?.data?.length);
    const secondHasBundle = Boolean(secondGroup?.bundle?.data?.length);

    if (firstHasBundle === secondHasBundle) {
      return 0;
    }

    return firstHasBundle ? -1 : 1;
  });

/**
 * Description: Groups bundle sections into paired bucket objects.
 * Purpose: Keeps standard bundle and conference bundle sections visually associated on the screen.
 *
 * Params:
 * @param {Array} sections
 *
 * Returns:
 * @returns {Array}
 *
 * Flow:
 * 1. Create a grouping map keyed by normalized bundle name.
 * 2. Attach each section to bundle, conference, or extras.
 * 3. Return grouped values for rendering.
 *
 * API Used:
 * None
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Safely initializes missing group buckets before assignment.
 */
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

    if (isPrimaryBundleKey(section.key) && !existing.bundle) {
      existing.bundle = section;
    } else if (isBundleConferenceKey(section.key) && !existing.conference) {
      existing.conference = section;
    } else {
      existing.extras.push(section);
    }

    grouped.set(groupKey, existing);
  });

  return Array.from(grouped.values());
};

/**
 * Description: CME requirement screen component.
 * Purpose: Shows state-specific CME licensure requirements and related course bundles for guest users.
 *
 * Screen Purpose:
 * Provides requirement details and bundle recommendations based on selected profession and state.
 *
 * Navigation Flow:
 * 1. User lands on CMERequirement screen.
 * 2. User can go back using header action.
 * 3. User can open course detail screens from nested course cards.
 *
 * API Dependencies:
 * 1. `master/states?country_id=1`
 * 2. Guest state bundle landing API via Redux action `StateBundleLandingRequest`
 *
 * Redux Dependencies:
 * 1. `GuestReducer.status`
 * 2. `GuestReducer.StateBundleLandingResponse`
 * 3. `StateBundleLandingRequest`
 *
 * Component Dependencies:
 * 1. `ProfessionDropdown`
 * 2. `RequirementCard`
 * 3. `CourseHorizontalList`
 * 4. `MyStatusBar`
 *
 * State Management Logic:
 * 1. Tracks selected profession/state locally.
 * 2. Fetches state list from API.
 * 3. Dispatches Redux action for bundle payload when filters change.
 * 4. Derives loading, empty, and render states from reducer status.
 *
 * User Actions:
 * 1. Change profession
 * 2. Change state
 * 3. View more/view less bundle pairs
 * 4. Open course details from nested list items
 *
 * Validation Rules:
 * 1. Falls back to default state/profession when navigation params are missing.
 * 2. Only renders course sections when bundle arrays contain items.
 *
 * Error Handling:
 * 1. Shows empty-state UI when API returns no requirement or course data.
 * 2. Logs state-list fetch warnings without blocking the screen.
 *
 * Params:
 * @param {Object} props
 *
 * Returns:
 * @returns {JSX.Element}
 *
 * Flow:
 * 1. Load states and initialize selected filters.
 * 2. Dispatch requirement request when filters change.
 * 3. Transform reducer payload into grouped course sections.
 * 4. Render skeleton, empty state, or full screen content.
 *
 * API Used:
 * `master/states?country_id=1`
 *
 * Redux Actions:
 * `StateBundleLandingRequest`
 *
 * Error Handling:
 * Handles request, success, and failure UI states through reducer status checks.
 */
const CMERequirement = props => {
  const dispatch = useDispatch();
  const GuestReducer = useSelector(state => state.GuestReducer);

  const initialPassedState = props?.route?.params?.initialState;
  const initialPassedProf = props?.route?.params?.initialProfession;

  const [selectedProfession, setSelectedProfession] = useState(
    initialPassedProf || 'Physician',
  );
  const [selectedState, setSelectedState] = useState(
    initialPassedState || { name: 'Alabama', state_id: 1, id: 1 },
  );
  const [statesList, setStatesList] = useState([]);
  const [cmeRequirementData, setCmeRequirementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAllPairs, setShowAllPairs] = useState(false);

  /**
   * Description: Fetches the master state list from API.
   * Purpose: Populates the state selector and aligns incoming navigation state with canonical state objects.
   *
   * Params:
   * @param {void} none
   *
   * Returns:
   * @returns {Promise<void>}
   *
   * Flow:
   * 1. Request the US states master API.
   * 2. Store the states list for dropdown use.
   * 3. Match and sync initial passed state when available.
   *
   * API Used:
   * `master/states?country_id=1`
   *
   * Redux Actions:
   * None
   *
   * Error Handling:
   * Logs warnings without interrupting UI rendering.
   */
  const fetchStates = useCallback(async () => {
    try {
      const response = await getApi('master/states?country_id=1');
      if (response?.data?.states) {
        setStatesList(response.data.states);
        if (initialPassedState) {
          const match = response.data.states.find(
            s =>
              String(s.name).toLowerCase() ===
              String(initialPassedState.name || initialPassedState).toLowerCase(),
          );
          if (match) {
            setSelectedState(match);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to fetch states list:', err);
    }
  }, [initialPassedState]);

  /**
   * Description: Dispatches the guest bundle landing request for the active profession/state.
   * Purpose: Retrieves licensure requirement and course bundle data used by this screen.
   *
   * Params:
   * @param {string} profession
   * @param {Object} stateObj
   *
   * Returns:
   * @returns {void}
   *
   * Flow:
   * 1. Convert selected profession to backend profession ID.
   * 2. Resolve state name from supported object shapes.
   * 3. Dispatch the Redux request action.
   *
   * API Used:
   * Guest State Bundle Landing API via Redux Saga
   *
   * Redux Actions:
   * `StateBundleLandingRequest`
   *
   * Error Handling:
   * Uses safe fallbacks for unknown professions and incomplete state payloads.
   */
  const fetchRequirements = useCallback(
    (profession, stateObj) => {
      const profId = professionMapping[profession] || 167;
      const stateName =
        stateObj?.name || stateObj?.state_name || stateObj?.title || 'Alabama';

      dispatch(
        StateBundleLandingRequest({
          profession_id: profId,
          state: stateName,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

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

  /**
   * Description: Navigates back from the CME requirement screen.
   * Purpose: Supports header back action.
   *
   * Params:
   * @param {void} none
   *
   * Returns:
   * @returns {void}
   *
   * Flow:
   * 1. Trigger navigation back.
   * 2. Return control to previous screen.
   * 3. Preserve current logic without side effects.
   *
   * API Used:
   * None
   *
   * Redux Actions:
   * None
   *
   * Error Handling:
   * Relies on React Navigation stack behavior.
   */
  const handleBack = () => {
    props.navigation.goBack();
  };

  /**
   * Description: Opens an informational alert for the screen.
   * Purpose: Explains how the profession/state selector affects requirement results.
   *
   * Params:
   * @param {void} none
   *
   * Returns:
   * @returns {void}
   *
   * Flow:
   * 1. Open native alert.
   * 2. Show instructional message.
   * 3. Wait for user dismissal.
   *
   * API Used:
   * None
   *
   * Redux Actions:
   * None
   *
   * Error Handling:
   * Uses native alert API without custom error handling.
   */
  const handleMenuPress = () => {
    Alert.alert(
      'CME Requirements',
      'Choose a profession and state to review the latest licensure requirements and related courses.',
    );
  };

  /**
   * Description: Resolves a display-safe state name from multiple possible payload shapes.
   * Purpose: Avoids repeated state-name fallback logic across the screen.
   *
   * Params:
   * @param {Object} item
   *
   * Returns:
   * @returns {string}
   *
   * Flow:
   * 1. Read supported state name fields.
   * 2. Fall back to Alabama if nothing exists.
   * 3. Return a user-facing title value.
   *
   * API Used:
   * None
   *
   * Redux Actions:
   * None
   *
   * Error Handling:
   * Uses fallback text for incomplete objects.
   */
  const getStateName = item => item?.name || item?.state_name || item?.title || 'Alabama';

  const pageTitle = `${getStateName(selectedState)} CME Requirements`;
  const dynamicCourseSections = getDynamicCourseSections(cmeRequirementData);
  const pairedCourseSections = removeDuplicateCourseSections(
    prioritizeBundleGroups(getPairedCourseSections(dynamicCourseSections)),
  );
  const visiblePairedSections = showAllPairs
    ? pairedCourseSections
    : pairedCourseSections.slice(0, 1);

  /**
   * Description: Renders shimmer placeholders for loading state.
   * Purpose: Keeps the screen structure stable while requirement data is loading.
   *
   * Params:
   * @param {void} none
   *
   * Returns:
   * @returns {JSX.Element}
   *
   * Flow:
   * 1. Render dropdown placeholder.
   * 2. Render requirement card placeholder.
   * 3. Render course-list placeholders.
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
  const renderShimmer = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <SkeletonPlaceholder backgroundColor="#F3F4F6" highlightColor="#E5E7EB">
        <View style={{ paddingHorizontal: normalize(16), paddingTop: normalize(16) }}>
          <View
            style={{
              height: normalize(52),
              borderRadius: normalize(8),
              marginBottom: normalize(20),
            }}
          />

          <View
            style={{
              height: normalize(220),
              borderRadius: normalize(12),
              marginBottom: normalize(20),
            }}
          />

          <View
            style={{
              width: normalize(180),
              height: normalize(18),
              borderRadius: normalize(4),
              marginBottom: normalize(12),
            }}
          />

          <View style={styles.shimmerRow}>
            <View
              style={{
                width: normalize(240),
                height: normalize(240),
                borderRadius: normalize(12),
                marginRight: normalize(16),
              }}
            />
            <View
              style={{
                width: normalize(240),
                height: normalize(240),
                borderRadius: normalize(12),
              }}
            />
          </View>

          <View
            style={{
              width: normalize(200),
              height: normalize(18),
              borderRadius: normalize(4),
              marginBottom: normalize(12),
            }}
          />

          <View style={styles.shimmerRow}>
            <View
              style={{
                width: normalize(240),
                height: normalize(240),
                borderRadius: normalize(12),
                marginRight: normalize(16),
              }}
            />
            <View
              style={{
                width: normalize(240),
                height: normalize(240),
                borderRadius: normalize(12),
              }}
            />
          </View>
        </View>
      </SkeletonPlaceholder>
    </ScrollView>
  );

  return (
    <>
      <MyStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerSideButton}>
            <Icon name="arrow-back-ios-new" size={normalize(18)} color="#111827" />
          </TouchableOpacity>

          <Text numberOfLines={1} style={styles.headerTitle}>
            {pageTitle}
          </Text>

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
            <View style={styles.dropdownWrap}>
              <ProfessionDropdown
                selectedProfession={selectedProfession}
                onSelectProfession={setSelectedProfession}
                selectedState={selectedState}
                onSelectState={setSelectedState}
                statesList={statesList}
              />
            </View>

            {error || !cmeRequirementData ? (
              <View style={styles.emptyContainer}>
                <Icon name="error-outline" size={normalize(48)} color="#9CA3AF" />
                <Text style={styles.emptyText}>No CME requirements found</Text>
              </View>
            ) : (
              <View>
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
                        highlightFirstItem={isPrimaryBundleKey(group.bundle.key)}
                      />
                    ) : null}

                    {group.conference ? (
                      <CourseHorizontalList
                        data={group.conference.data}
                        isMandatory={group.conference.isMandatory}
                        highlightFirstItem={false}
                      />
                    ) : null}

                    {group.extras.map(section => (
                      <CourseHorizontalList
                        key={section.key}
                        data={section.data}
                        isMandatory={section.isMandatory}
                        highlightFirstItem={false}
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
