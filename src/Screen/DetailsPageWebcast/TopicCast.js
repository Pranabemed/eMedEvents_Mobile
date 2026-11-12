
/**
 * Topic cast screen module. Renders a React Native screen or a screen-scoped support component. Exported members: TopicCast, styles.
 */

import React, { memo, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from "../../Themes/Fonts";
import Colorpath from "../../Themes/Colorpath";

/**
 * Reusable TopicCast component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const TopicCast = memo(({ topics, expandedtopic, toggleTopic }) => {
  const totalTopics = Array.isArray(topics) ? topics.length : 0;
  const initialTopicCount = Math.ceil(totalTopics / 2);
  const remainingTopicCount = Math.max(totalTopics - initialTopicCount, 0);

  const visibleTopics = useMemo(() => {
    if (!Array.isArray(topics)) return [];
    if (expandedtopic || remainingTopicCount === 0) return topics;
    return topics.slice(0, initialTopicCount);
  }, [topics, expandedtopic, initialTopicCount, remainingTopicCount]);

  if (totalTopics === 0) {
    return null;
  }

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionAccent} />
        <Text style={styles.sectionHeading}>{'State-required Topic(s)'}</Text>
      </View>

      <View style={styles.infoBanner}>
        <Feather name="info" size={14} color={Colorpath.ButtonColr} style={styles.infoIcon} />
        <Text style={styles.infoText}>
          {"This course fulfills the state-required mandatory topic(s) credit requirements for license renewal."}
        </Text>
      </View>

      <View style={styles.topicsList}>
        {visibleTopics.map((item, idx) => (
          <View key={`${item?.topicName || 'topic'}-${idx}`} style={styles.topicContainer}>
            <Text style={styles.topicTitle}>{item?.topicName}</Text>
            {Array.isArray(item?.professionStatedata) && item.professionStatedata.length > 0 ? (
              item.professionStatedata.map((data, pIdx) => (
                <View key={`${data?.profession || 'prof'}-${pIdx}`} style={styles.professionContainer}>
                  <Text style={styles.professionText}>{data?.profession}</Text>
                  {Array.isArray(data?.states) && data.states.length > 0 ? (
                    <View style={styles.statesWrap}>
                      {data.states.map((state, sIdx) => (
                        <View key={`${state}-${sIdx}`} style={styles.stateChip}>
                          <Text style={styles.stateChipText}>{state}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))
            ) : null}
          </View>
        ))}
      </View>

      {remainingTopicCount > 0 ? (
        <TouchableOpacity onPress={toggleTopic} activeOpacity={0.75} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {expandedtopic ? "View less" : `View more (${remainingTopicCount} more)`}
          </Text>
          <Feather
            name={expandedtopic ? 'chevron-up' : 'chevron-down'}
            size={15}
            color={Colorpath.ButtonColr}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

/**
 * Styles value.
 * @returns {*}
 */
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF4FF',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(9),
    marginBottom: normalize(10),
    gap: normalize(8),
  },
  infoIcon: {
    marginTop: normalize(2),
  },
  infoText: {
    flex: 1,
    fontFamily: Fonts.InterMedium,
    fontSize: 13,
    lineHeight: 19,
    color: '#1E3A8A',
  },
  topicsList: {
    gap: normalize(10),
  },
  topicContainer: {
    backgroundColor: '#F8FAFD',
    borderRadius: normalize(12),
    borderColor: '#E6EEF8',
    borderWidth: 1,
    padding: normalize(12),
  },
  topicTitle: {
    fontSize: 15,
    color: '#0F172A',
    marginBottom: normalize(8),
    fontFamily: Fonts.InterBold,
  },
  professionContainer: {
    marginBottom: normalize(8),
  },
  professionText: {
    fontSize: 13,
    fontFamily: Fonts.InterSemiBold,
    color: '#334155',
    marginBottom: normalize(5),
  },
  statesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: normalize(6),
  },
  stateChip: {
    backgroundColor: Colorpath.white,
    borderWidth: 1,
    borderColor: '#D9E4F2',
    borderRadius: normalize(14),
    paddingHorizontal: normalize(9),
    paddingVertical: normalize(4),
  },
  stateChipText: {
    fontSize: 12,
    color: '#475569',
    fontFamily: Fonts.InterMedium,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: normalize(10),
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
 * Topic cast default export.
 *
 * @returns {*}
 */
export default TopicCast;
