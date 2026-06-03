/**
 * File Name: RequirementCard.js
 * Module: CME Requirement
 * Purpose: Displays licensure requirement details for the selected profession and state.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, react-native, react-native-vector-icons/MaterialIcons, react-native-render-html, @react-navigation/native, ../../Themes/Fonts, ../../Utils/Helpers/Dimen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RenderHTML from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';

/**
 * Description: Requirement detail card.
 * Purpose: Shows licensure tabs, credit requirements, cycle duration, and mandatory notes for a selected state/profession.
 *
 * Purpose:
 * Provides a collapsible summary/detail view of CME requirement data.
 *
 * Props:
 * 1. `stateName`
 * 2. `professionName`
 * 3. `cmeData`
 * 4. `creditCategory`
 *
 * State:
 * 1. `activeTab`
 * 2. `isExpanded`
 *
 * Events:
 * 1. Switch licensure tab
 * 2. Expand/collapse card
 * 3. Open linked topic/specialty search
 *
 * Dependencies:
 * `RenderHTML`, `useNavigation`
 *
 * Usage Example:
 * `<RequirementCard stateName="Alabama" cmeData={payload} />`
 *
 * Params:
 * @param {Object} props
 * @param {string} props.stateName
 * @param {string} props.professionName
 * @param {Object} props.cmeData
 * @param {string} props.creditCategory
 *
 * Returns:
 * @returns {JSX.Element|null}
 *
 * Flow:
 * 1. Build licensure tabs from `cmeData`.
 * 2. Keep active tab aligned with available keys.
 * 3. Render collapsed summary and expandable details.
 *
 * API Used:
 * Consumes guest requirement payload returned by state bundle landing API.
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Returns null when no requirement tab data exists.
 */
const RequirementCard = ({
  stateName,
  professionName,
  cmeData,
  creditCategory,
}) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const tabKeys = Object.keys(cmeData || {});
  const [activeTab, setActiveTab] = useState(tabKeys[0] || '');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (tabKeys.length > 0 && !tabKeys.includes(activeTab)) {
      setActiveTab(tabKeys[0]);
    }
  }, [activeTab, tabKeys]);

  if (tabKeys.length === 0) {
    return null;
  }

  const selectedData = cmeData[activeTab];
  if (!selectedData) {
    return null;
  }

  /**
   * Description: Handles link taps inside HTML notes.
   * Purpose: Routes topic and specialty links into the shared guest search result flow.
   *
   * Params:
   * @param {Object} event
   * @param {string} href
   *
   * Returns:
   * @returns {void}
   *
   * Flow:
   * 1. Extract slug or keyword from tapped link.
   * 2. Map supported URL patterns to search request payloads.
   * 3. Navigate to `Globalresult`.
   *
   * API Used:
   * None directly; prepares data for downstream course search flow.
   *
   * Redux Actions:
   * None
   *
   * Error Handling:
   * Skips navigation when href is missing.
   */
  const handleLinkPress = (event, href) => {
    if (href) {
      const resultTopic = href.substring(href.lastIndexOf('/') + 1);
      if (href.includes('/topic/')) {
        navigation.navigate('Globalresult', {
          trig: {
            trig: resultTopic,
            rqstType: 'topicbasedconferences',
            mainKey: 'topic',
            CreditData: '',
            Realback: 'guest',
          },
        });
      } else if (href.includes('/specialty/')) {
        navigation.navigate('Globalresult', {
          trig: {
            trig: resultTopic,
            rqstType: 'specialityconferences',
            mainKey: 'conference_specialitiy',
            CreditData: '',
            Realback: 'guest',
          },
        });
      } else {
        const keyword = href.split('/').pop();
        navigation.navigate('Globalresult', {
          trig: {
            trig: keyword,
            rqstType: 'topicbasedconferences',
            mainKey: 'topic',
            CreditData: '',
            Realback: 'guest',
          },
        });
      }
    }
  };

  /**
   * Description: Formats credit strings into rounded integer display text.
   * Purpose: Prevents long decimal values from cluttering the requirement summary grid.
   *
   * Params:
   * @param {string|number} credits
   *
   * Returns:
   * @returns {string}
   *
   * Flow:
   * 1. Guard missing values.
   * 2. Parse numeric value.
   * 3. Round and return string output.
   *
   * API Used:
   * None
   *
   * Redux Actions:
   * None
   *
   * Error Handling:
   * Falls back to `'0'` for invalid numeric input.
   */
  const formatCredits = credits => {
    if (!credits) {
      return '0';
    }
    const val = parseFloat(credits);
    return isNaN(val) ? '0' : String(Math.round(val));
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <Icon name="assignment" size={normalize(22)} color="#2C4DB9" />
          </View>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>{stateName} Requirements</Text>
            <Text style={styles.subtitle}>{activeTab} Licensure</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.detailsButton}
          activeOpacity={0.7}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.detailsButtonText}>
            {isExpanded ? 'Hide Details' : 'View Details'}
          </Text>
          <Icon
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-right'}
            size={normalize(17)}
            color="#2C4DB9"
          />
        </TouchableOpacity>
      </View>

      {isExpanded ? (
        <View style={styles.expandedContent}>
          <View style={styles.tabContainer}>
            {tabKeys.map(tab => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTabButton,
                ]}
                activeOpacity={0.7}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === tab && styles.activeTabButtonText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{formatCredits(selectedData.credits)}</Text>
              <Text style={styles.statLabel}>CME Credits Required</Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.statCol}>
              <Text style={styles.statValue}>
                {selectedData.term}{' '}
                {parseInt(selectedData.term, 10) === 1 ? 'Year' : 'Years'}
              </Text>
              <Text style={styles.statLabel}>Licensing Cycle</Text>
            </View>

            {selectedData.amapra_cat_credits &&
            parseFloat(selectedData.amapra_cat_credits) > 0 ? (
              <>
                <View style={styles.verticalDivider} />
                <View style={styles.statCol}>
                  <Text style={styles.statValue}>
                    {formatCredits(selectedData.amapra_cat_credits)}
                  </Text>
                  <Text style={styles.statLabel}>
                    {creditCategory || 'AMA PRA Category 1 Credits™'}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.verticalDivider} />
                <View style={styles.statCol}>
                  <Text style={styles.statValue}>
                    {formatCredits(selectedData.credits)}
                  </Text>
                  <Text style={styles.statLabel}>Contact Hours Required</Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.horizontalDivider} />

          <Text style={styles.mandatoryTitle}>Mandatory Requirements</Text>

          <View style={styles.htmlContainer}>
            <RenderHTML
              contentWidth={width - normalize(48)}
              source={{
                html:
                  selectedData.additional_notes ||
                  '<p>No specific mandatory requirements stated.</p>',
              }}
              renderersProps={{
                a: {
                  onPress: handleLinkPress,
                },
              }}
              tagsStyles={htmlTagsStyles}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const htmlTagsStyles = {
  ul: {
    marginVertical: normalize(4),
    paddingLeft: normalize(16),
  },
  li: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(12),
    lineHeight: normalize(18),
    color: '#374151',
    marginBottom: normalize(8),
  },
  p: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
    lineHeight: normalize(18),
    color: '#374151',
    marginVertical: normalize(4),
  },
  a: {
    color: '#2C4DB9',
    textDecorationLine: 'underline',
    fontFamily: Fonts.InterMedium,
  },
  strong: {
    fontFamily: Fonts.InterBold,
    fontWeight: 'bold',
  },
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(14),
    borderWidth: 1,
    borderColor: '#D8E3F4',
    padding: normalize(14),
    marginBottom: normalize(14),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: normalize(38),
    height: normalize(38),
    borderRadius: normalize(12),
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#C7D7FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalize(10),
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(14),
    color: '#0F172A',
    fontWeight: 'bold',
    marginBottom: normalize(1),
  },
  subtitle: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(11),
    color: '#475569',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    borderRadius: normalize(18),
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(10),
    borderWidth: 1,
    borderColor: '#D5E4FF',
  },
  detailsButtonText: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(11),
    color: '#2C4DB9',
    marginRight: normalize(4),
  },
  expandedContent: {
    marginTop: normalize(14),
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: normalize(14),
  },
  tabButton: {
    paddingVertical: normalize(10),
    marginRight: normalize(24),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#FF773D',
  },
  tabButtonText: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(14),
    color: '#6B7280',
  },
  activeTabButtonText: {
    color: '#FF773D',
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: normalize(8),
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Fonts.InterBold,
    fontSize: normalize(18),
    color: '#2C4DB9',
    fontWeight: 'bold',
    marginBottom: normalize(4),
  },
  statLabel: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(10),
    color: '#6B7280',
    textAlign: 'center',
  },
  verticalDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#E5E7EB',
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: normalize(16),
  },
  mandatoryTitle: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(14),
    color: '#111827',
    fontWeight: 'bold',
    marginBottom: normalize(12),
  },
  htmlContainer: {
    paddingHorizontal: normalize(4),
  },
});

export default RequirementCard;
