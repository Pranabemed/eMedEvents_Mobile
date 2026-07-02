/**
 * File Name: GuestHeroSection.js
 * Module: Guest User
 * Purpose: Renders the guest home top-banner carousel and its loading state.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-15
 * Dependencies: react, react-native, react-native-snap-carousel, react-native-vector-icons/MaterialIcons, react-native-linear-gradient, ../../../Themes/Imagepath, ../../HomePage/GuestUser.styles, ../utils/guestUserContentParsers
 */

import React, { memo, useState, useMemo } from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Imagepath from '../../../../Themes/Imagepath';
import styles from '../../GuestUser.styles';
import normalize from '../../../../Utils/Helpers/Dimen';
import {
  getBannerUrl,
  matchGroup,
  parseBannerMeta,
  splitMetaLine,
} from '../utils/guestUserContentParsers';
import { GuestHeroShimmer } from './GuestUserShimmers';

/**
 * Reusable GuestHeroSectionComponent component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

/**
 * Description: Guest hero carousel section.
 * Purpose: Preserves the current hero-banner UI and navigation behavior in an isolated component.
 */
const GuestHeroSectionComponent = ({ topBanners, isHomeLoading, navigation, width }) => {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const carouselViewportStyle = useMemo(() => [styles.carouselViewport, { width }], [width]);

  if (isHomeLoading) {
    return <GuestHeroShimmer width={width} />;
  }

  if (!topBanners.length) {
    return null;
  }

  const slideWidth = normalize(300);

  return (
    <>
      <View style={carouselViewportStyle}>
        <Carousel
          layout="default"
          data={topBanners}
          onSnapToItem={index => setActiveBannerIndex(index)}
          sliderWidth={width}
          itemWidth={slideWidth}
          firstItem={0}
          activeSlideAlignment="center"
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          useScrollView={false}
          nestedScrollEnabled
          removeClippedSubviews={false}
          containerCustomStyle={carouselViewportStyle}
          contentContainerCustomStyle={carouselViewportStyle}
          renderItem={({ item }) => {
            let parsedHtml = {};
            if (item.html_content) {
              const html = item.html_content;
              const cleanHtml = html.replace(/\n/g, ' ');
              const creditsCountMatch = cleanHtml.match(/<span>(\d+)<\/span>/i);
              const creditTypesMatch = cleanHtml.match(/\b(CME|CE|MOC)\b/g);
              const titleMatch = matchGroup(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i);
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
                matchGroup(html, /Calendar\.png[^>]*>\s*([^<]+)(?:<|&nbsp;|$)/i);
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
                        /**
 * Handles register press.
 * @returns {void}
 */
const handleRegisterPress = () => {
              if (stateWebcastUrl) {
                navigation.navigate('Statewebcast', {
                  webCastURL: { webCastURL: stateWebcastUrl, shareUrl: stateWebcastUrl, detailpage_url: stateWebcastUrl, Realback: 'guest' },
                });
              }
            };

            return (
              <View style={styles.heroSlideWrap}>
                <LinearGradient
                  colors={['#2C4DB9', '#7A22B8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.heroCard, Platform.OS === 'ios' ? styles.heroCardIos : styles.heroCardAndroid]}
                >
                  <View style={Platform.OS === 'ios' ? styles.heroTopSpacerIos : styles.heroTopSpacerDefault}>
                    <Text style={styles.heroKicker}>{displayKicker}</Text>
                    <Text numberOfLines={2} style={styles.heroTitle}>{displayTitle}</Text>
                  </View>
                  <View style={styles.heroBottomRow}>
                    <View style={styles.heroMeta}>
                      {displayDate ? (
                        <View style={styles.heroMetaRow}>
                          <Icon name="access-time" size={18} color="#FFFFFF" />
                          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.heroMetaText}>{displayDate}</Text>
                        </View>
                      ) : null}
                      {displayCredits ? (
                        <View style={styles.heroMetaRow}>
                          <Image source={Imagepath.CreditValut} style={styles.heroCreditIcon} resizeMode="contain" />
                          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.heroMetaText}>
                            {displayCredits} Credits
                          </Text>
                        </View>
                      ) : null}
                      {displayLocation ? (
                        <View style={styles.heroLocationRow}>
                          <View style={styles.heroLocationTextWrap}>
                            <Icon name="location-on" size={18} color="#FFFFFF" />
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.heroMetaText}>{displayLocation}</Text>
                          </View>
                          <TouchableOpacity style={styles.heroRegisterButton} onPress={handleRegisterPress}>
                            <Text style={styles.heroButtonText}>REGISTER NOW</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity style={styles.heroButton} onPress={handleRegisterPress}>
                          <Text style={styles.heroButtonText}>REGISTER NOW</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </View>
            );
          }}
        />
      </View>
      <View style={styles.bannerCounterWrap}>
        <Text style={styles.bannerCounterText}>
          {`${Math.min(activeBannerIndex + 1, topBanners.length || 1)}/${topBanners.length || 1}`}
        </Text>
      </View>
    </>
  );
};

/**
 * Guest hero section value.
 * @returns {*}
 */
export const GuestHeroSection = memo(GuestHeroSectionComponent);
