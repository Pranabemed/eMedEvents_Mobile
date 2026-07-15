/**
 * File Name: GuestCarouselSections.js
 * Module: Guest User
 * Purpose: Reusable carousel section wrappers for Guest User home content.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, react-native, react-native-snap-carousel, ../../HomePage/GuestUser.styles, ./GuestUserShared
 */

import React, { memo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import styles from '../../GuestUser.styles';
import { SectionTitle } from './GuestUserShared';

/**
 * Reusable CarouselSectionComponent component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

/**
 * Description: Generic carousel section wrapper.
 * Purpose: Standardizes heading, carousel, and pagination for card-based sections.
 */
const CarouselSectionComponent = ({
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
  const viewportWidth = Math.max(width || sliderWidth || 0, 0);
  const cardWidth = Math.max(itemWidth || viewportWidth - 32, 0);

  return (
    <View style={styles.carouselContainer}>
      <SectionTitle title={title} action={action} onAction={onAction} width={width} />
      <View style={{ marginHorizontal: -16, width: viewportWidth, overflow: 'visible' }}>
        <Carousel
          layout="default"
          data={data}
          renderItem={renderItem}
          sliderWidth={viewportWidth}
          itemWidth={cardWidth}
          onSnapToItem={index => setActiveIndex(index)}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          useScrollView={false}
          removeClippedSubviews={false}
          activeSlideAlignment="center"
          containerCustomStyle={{ overflow: 'visible' }}
          contentContainerCustomStyle={{ overflow: 'visible' }}
        />
      </View>
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

/**
 * Description: Specialized live-conference section wrapper.
 * Purpose: Preserves the existing live section heading and pagination behavior.
 */
const LiveConferenceSectionComponent = ({
  data,
  renderItem,
  sliderWidth,
  itemWidth,
  onAction,
  width,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!data.length) return null;
  const viewportWidth = Math.max(width || sliderWidth || 0, 0);
  const cardWidth = Math.max(itemWidth || viewportWidth - 32, 0);

  return (
    <View style={styles.liveSection}>
      <View style={styles.liveHeader}>
        <Text style={styles.liveSectionTitle}>Live Conferences</Text>
        <TouchableOpacity onPress={onAction} hitSlop={10}>
          <Text style={styles.liveViewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginHorizontal: -16, width: viewportWidth, overflow: 'visible' }}>
        <Carousel
          layout="default"
          data={data}
          renderItem={renderItem}
          sliderWidth={viewportWidth}
          itemWidth={cardWidth}
          onSnapToItem={index => setActiveIndex(index)}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          useScrollView={false}
          removeClippedSubviews={false}
          activeSlideAlignment="center"
          containerCustomStyle={{ overflow: 'visible' }}
          contentContainerCustomStyle={{ overflow: 'visible' }}
        />
      </View>
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

/**
 * Carousel section value.
 * @returns {*}
 */
export const CarouselSection = memo(CarouselSectionComponent);
/**
 * Live conference section value.
 * @returns {*}
 */
export const LiveConferenceSection = memo(LiveConferenceSectionComponent);
