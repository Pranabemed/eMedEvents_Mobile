/**
 * File Name: GuestUserShared.js
 * Module: Guest User
 * Purpose: Shared small presentational components for the Guest User home module.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, react-native, react-native-linear-gradient, react-native-vector-icons/MaterialIcons, ../../../Themes/Imagepath, ../../../Screen/HomePage/GuestUser.styles, ../utils/guestUserCore
 */

import React, { memo } from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Imagepath from '../../../../Themes/Imagepath';
import styles from '../../GuestUser.styles';
import { scale } from '../utils/guestUserCore';

/**
 * Reusable SectionTitleComponent component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const MEMBERSHIP_POINTS = [
  'Multi State & Board Licensure Tracking',
  'Personalized CME/CE Recommendations',
  'Centralized CME/CE Credit Vault',
  'CME & CE Expenses',
];

/**
 * Description: Reusable title row for guest home sections.
 * Purpose: Standardizes section heading and optional action layout.
 */
const SectionTitleComponent = ({ title, action, onAction, width }) => (
  <View style={styles.sectionHeader}>
    <Text style={[styles.sectionTitle, { fontSize: scale(width, 20) }]}>{title}</Text>
    {action ? (
      <TouchableOpacity onPress={onAction} hitSlop={10}>
        <Text style={[styles.sectionAction, { fontSize: scale(width, 12) }]}>{action}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

/**
 * Description: Reusable chip used by the specialties section.
 * Purpose: Provides a consistent active/inactive chip UI.
 */
const TagChipComponent = ({ label, active, width, onPress }) => (
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

/**
 * Description: Small icon-text metadata row.
 * Purpose: Keeps card metadata rendering consistent across card variants.
 */
const InfoRowComponent = ({ icon, text, width, iconColor = '#666666' }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={scale(width, 16)} color={iconColor} />
    <Text style={[styles.infoText, { fontSize: scale(width, 12) }]}>{text}</Text>
  </View>
);

/**
 * Description: Marketplace stats tile grid.
 * Purpose: Displays static marketplace counters in a compact grid.
 */
const StatsGridComponent = ({ width, stats }) => {
  if (!stats?.length) return null;

  return (
    <View style={styles.statsGrid}>
      {stats.slice(1, 5).map(item => (
        <View key={item.label} style={styles.statTile}>
          <Text style={[styles.statValue, { fontSize: scale(width, 18) }]}>{item.value}</Text>
          <Text style={[styles.statLabel, { fontSize: scale(width, 11) }]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

/**
 * Description: Prime membership banner.
 * Purpose: Promotes membership benefits and routes the guest user to the membership screen.
 */
const MembershipBannerComponent = ({ width }) => (
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
  </LinearGradient>
);

/**
 * Section title value.
 * @returns {*}
 */
export const SectionTitle = memo(SectionTitleComponent);
/**
 * Tag chip value.
 * @returns {*}
 */
export const TagChip = memo(TagChipComponent);
/**
 * Info row value.
 * @returns {*}
 */
export const InfoRow = memo(InfoRowComponent);
/**
 * Stats grid value.
 * @returns {*}
 */
export const StatsGrid = memo(StatsGridComponent);
/**
 * Membership banner value.
 * @returns {*}
 */
export const MembershipBanner = memo(MembershipBannerComponent);
