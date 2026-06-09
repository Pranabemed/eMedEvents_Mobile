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
  return (
    <View style={styles.carouselContainer}>
      <SectionTitle title={title} action={action} onAction={onAction} width={width} />
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
        containerStyle={styles.paginationContainer}
        dotStyle={styles.activeDot}
        inactiveDotStyle={styles.inactiveDot}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.8}
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

export const CarouselSection = memo(CarouselSectionComponent);
export const LiveConferenceSection = memo(LiveConferenceSectionComponent);
