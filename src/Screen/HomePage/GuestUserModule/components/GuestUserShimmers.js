/**
 * File Name: GuestUserShimmers.js
 * Module: Guest User
 * Purpose: Loading-state shimmer components for Guest User home sections.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, react-native, react-native-skeleton-placeholder, ../../HomePage/GuestUser.styles, ../utils/guestUserContentParsers, ../utils/guestUserCore, ./GuestUserShared
 */

import React, { memo } from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import styles from '../../GuestUser.styles';
import { SHIMMER_BG, SHIMMER_HL } from '../utils/guestUserContentParsers';
import { SectionTitle } from './GuestUserShared';

/**
 * Reusable GuestHeroShimmerComponent component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

/**
 * Description: Hero/banner loading placeholder.
 * Purpose: Preserves top banner layout while guest home data is loading.
 */
const GuestHeroShimmerComponent = ({ width }) => (
  <View style={styles.shimmerHeroWrap}>
    <SkeletonPlaceholder backgroundColor={SHIMMER_BG} highlightColor={SHIMMER_HL} speed={1200}>
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

/**
 * Description: Card-carousel loading placeholder.
 * Purpose: Reuses one shimmer shell for featured, live, and free conference sections.
 */
const GuestCarouselShimmerComponent = ({
  title,
  width,
  variant = 'feature',
  showTitle = false,
}) => (
  <View style={styles.carouselContainer}>
    {showTitle ? <SectionTitle title={title} width={width} /> : null}
    <View style={styles.shimmerCardWrap}>
      <SkeletonPlaceholder backgroundColor={SHIMMER_BG} highlightColor={SHIMMER_HL} speed={1200}>
        <View
          style={[
            styles.shimmerCard,
            variant === 'live' && styles.shimmerLiveCard,
            variant === 'free' && styles.shimmerFreeCard,
            { width: width - 40 },
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

/**
 * Description: Specialty-chip loading placeholder.
 * Purpose: Preserves the specialties strip while API data is loading.
 */
const GuestChipsShimmerComponent = () => (
  <View style={styles.shimmerChipsSection}>
    <SkeletonPlaceholder backgroundColor={SHIMMER_BG} highlightColor={SHIMMER_HL} speed={1200}>
      <View style={styles.shimmerChipRow}>
        {[0, 1, 2, 3, 4, 5].map(item => (
          <View key={item} style={styles.shimmerChip} />
        ))}
      </View>
    </SkeletonPlaceholder>
  </View>
);

/**
 * Description: Requirements panel loading placeholder.
 * Purpose: Mimics the profession/state input card while guest data is still loading.
 */
const GuestRequirementsShimmerComponent = () => (
  <View style={styles.panel}>
    <View style={styles.requirementsCard}>
      <SkeletonPlaceholder backgroundColor={SHIMMER_BG} highlightColor={SHIMMER_HL} speed={1200}>
        <View style={styles.requirementsShimmerHeader}>
          <View style={styles.requirementsShimmerIcon} />
          <View style={styles.requirementsShimmerHeaderText}>
            <View style={styles.requirementsShimmerTitle} />
            <View style={styles.requirementsShimmerSubtitle} />
          </View>
        </View>
        <View style={styles.requirementsShimmerRow}>
          <View style={styles.requirementsShimmerField} />
          <View style={styles.requirementsShimmerField} />
        </View>
      </SkeletonPlaceholder>
    </View>
  </View>
);

/**
 * Guest hero shimmer value.
 * @returns {*}
 */
/**
 * Guest hero shimmer value.
 * @returns {*}
 */
export const GuestHeroShimmer = memo(GuestHeroShimmerComponent);
/**
 * Guest carousel shimmer value.
 * @returns {*}
 */
/**
 * Guest carousel shimmer value.
 * @returns {*}
 */
export const GuestCarouselShimmer = memo(GuestCarouselShimmerComponent);
/**
 * Guest chips shimmer value.
 * @returns {*}
 */
/**
 * Guest chips shimmer value.
 * @returns {*}
 */
export const GuestChipsShimmer = memo(GuestChipsShimmerComponent);
/**
 * Guest requirements shimmer value.
 * @returns {*}
 */
/**
 * Guest requirements shimmer value.
 * @returns {*}
 */
export const GuestRequirementsShimmer = memo(GuestRequirementsShimmerComponent);
