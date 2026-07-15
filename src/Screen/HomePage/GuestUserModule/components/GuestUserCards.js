/**
 * File Name: GuestUserCards.js
 * Module: Guest User
 * Purpose: Presentational card components for guest home conference sections.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, react-native, react-native-vector-icons/MaterialIcons, ../../../Themes/Imagepath, ../../HomePage/GuestUser.styles, ../utils/guestUserCore, ./GuestUserShared
 */

import React, { memo } from 'react';
import { Image, ImageBackground, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Imagepath from '../../../../Themes/Imagepath';
import styles from '../../GuestUser.styles';
import {
  getImageSource,
  getInitials,
  getSpecialityLabel,
  getText,
  normalizeSpecialities,
  scale,
} from '../utils/guestUserCore';
import { InfoRow } from './GuestUserShared';

/**
 * Reusable FreeConferenceCardComponent component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const getFreeEventTypeIcon = eventType => {
  const normalizedType = String(eventType || '').trim().toLowerCase();

  if (!normalizedType) return null;
  if (normalizedType.includes('text')) return Imagepath.Textbased;
  if (normalizedType.includes('podcast')) return Imagepath.PodCast;
  if (normalizedType.includes('journal')) return Imagepath.Journal;
  if (normalizedType.includes('live webinar')) return Imagepath.LiveWebinar;
  if (normalizedType.includes('hybrid')) return Imagepath.Hybrid;
  if (normalizedType.includes('in-person')) return Imagepath.InPerson;
  if (normalizedType.includes('webcast')) return Imagepath.VideoCam;

  return Imagepath.VideoCam;
};

/**
 * Free conference card component component.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @returns {JSX.Element}
 */
const FreeConferenceCardComponent = ({ item }) => {
    /**
 * Handles press.
 * @returns {*}
 */
const handlePress = () => item?.onPress?.(item?.detailpageUrl);
  const eventTypeIcon = getFreeEventTypeIcon(item?.eventType);

  return (
    <View style={styles.freeCardWrap}>
      <Pressable onPress={handlePress} style={styles.freeCard}>
        <View style={styles.freeTopRow}>
          {item?.eventType ? (
            <View style={styles.freeTypePill}>
              {eventTypeIcon ? (
                <Image source={eventTypeIcon} style={styles.freeTypeIcon} resizeMode="contain" />
              ) : (
                <Icon name="keyboard-voice" size={13} color="#FFFFFF" />
              )}
              <Text numberOfLines={1} style={styles.freeTypeText}>{item.eventType}</Text>
            </View>
          ) : null}
          {item?.date ? <Text numberOfLines={1} style={styles.freeDateText}>{item.date}</Text> : null}
        </View>
        {item?.organization ? <Text numberOfLines={1} style={styles.freeOrgText}>{item.organization}</Text> : null}
        <Text numberOfLines={2} style={styles.freeTitleText}>{item.title}</Text>
        <View style={styles.freeBottomRow}>
          {item?.cmeLabel ? (
            <View style={styles.freeCreditPill}>
              <Text numberOfLines={1} style={styles.freeCreditText}>{item.cmeLabel}</Text>
            </View>
          ) : null}
          {item?.price ? <Text numberOfLines={1} style={styles.freePriceText}>{item.price}</Text> : null}
        </View>
        {item?.buttonText ? (
          <TouchableOpacity onPress={handlePress} style={styles.freeButton}>
            <Text numberOfLines={1} style={styles.freeButtonText}>{item.buttonText}</Text>
          </TouchableOpacity>
        ) : null}
      </Pressable>
    </View>
  );
};

/**
 * Featured conference card component component.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.width - Nested property value.
 * @returns {JSX.Element}
 */
const FeaturedConferenceCardComponent = ({ item, width }) => {
  const organizationName = getText(item?.organization, item?.organizer_name);
  const showOrganization = item?.showOrganization !== false;
  const allSpecialities = normalizeSpecialities(item?.specialities);
  const visibleSpecialities = item?.showSpecialities ? allSpecialities.slice(0, 4) : [];
  const organizationLogo = getImageSource(
    item?.organizationLogo ||
    item?.organization_imagepath ||
    item?.organization_image ||
    item?.organization_logo ||
    item?.logo ||
    item?.image,
  );
  const detailUrl = getText(
    item?.detailpageUrl,
    item?.detailPageUrl,
    item?.detail_page_url,
    item?.banner_url,
  );

    /**
 * Handles press.
 * @returns {void}
 */
const handlePress = () => {
    if (detailUrl) {
      item?.onPress?.(detailUrl);
    }
  };

  return (
    <View style={styles.featureCardOuter}>
      <Pressable onPress={handlePress} style={styles.specailtyfeatureCard}>
        <View style={{ flex: 1 }}>
          {showOrganization ? (
            <View style={styles.featureHeader}>
              <TouchableOpacity
                onPress={item?.onOrganizerPress}
                disabled={!item?.organizationUrl}
                activeOpacity={0.8}
                style={styles.featureLogoCircle}
              >
                {organizationLogo ? (
                  <Image source={organizationLogo} style={styles.featureLogoImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.featureLogoFallback}>{getInitials(organizationName) || ' '}</Text>
                )}
              </TouchableOpacity>
              <Text numberOfLines={1} style={styles.featureOrgName}>{organizationName}</Text>
            </View>
          ) : null}

          {visibleSpecialities.length ? (
            <View style={styles.featureSpecialityWrap}>
              {visibleSpecialities.map(label => (
                <View key={label} style={styles.featureSpecialityPill}>
                  <Icon name="favorite-border" size={13} color="#111827" />
                  <Text numberOfLines={1} style={styles.featureSpecialityText}>{getSpecialityLabel(label)}</Text>
                </View>
              ))}
              {item?.showSpecialities && allSpecialities.length > visibleSpecialities.length ? (
                <View style={styles.featureSpecialityMore}>
                  <Text style={styles.featureSpecialityMoreText}>...</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          <Text numberOfLines={2} style={styles.featureTitle}>
            {getText(item?.title, item?.course_title, item?.conference_name, item?.name, item?.banner_title, item?.heading)}
          </Text>
          {item?.date ? (
            <View style={styles.featureMetaRow}>
              <Icon name="event" size={17} color="#333333" />
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.featureMetaText}>{item.date}</Text>
            </View>
          ) : null}
          {item?.location ? (
            <View style={styles.featureMetaRow}>
              <Icon name="place" size={18} color="#333333" />
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.featureMetaText}>{item.location}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.featureBottomRow}>
          {item?.cmeLabel ? (
            <View style={styles.featureCmePill}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.featureCmeText}>{item.cmeLabel}</Text>
            </View>
          ) : null}
          {item?.price ? (
            <View style={styles.featurePricePill}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.featurePriceText}>{item.price}</Text>
            </View>
          ) : null}
        </View>

        {item?.button ? (
          <TouchableOpacity onPress={handlePress} style={styles.featureButton}>
            <Text numberOfLines={1} style={styles.featureButtonText}>{item.button}</Text>
          </TouchableOpacity>
        ) : null}
      </Pressable>
    </View>
  );
};

/**
 * Conference card component component.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.width - Nested property value.
 * @param {*} props.dark - Nested property value.
 * @param {*} props.compact - Nested property value.
 * @returns {JSX.Element}
 */
const ConferenceCardComponent = ({ item, width, dark = false, compact = false }) => (
  <View style={styles.cardWrap}>
    <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, compact && styles.cardCompact]}>
      <View style={[styles.cardImageWrap, compact && styles.cardImageWrapCompact]}>
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
      {item.kicker ? <Text style={[styles.cardMeta, dark && styles.cardMetaDark, { fontSize: scale(width, 11) }]}>{item.kicker}</Text> : null}
      <Text numberOfLines={2} style={[styles.cardTitle, dark && styles.cardTitleDark, { fontSize: scale(width, 16) }]}>{item.title}</Text>
      {!item.kicker ? <Text style={[styles.cardMeta, dark && styles.cardMetaDark, { fontSize: scale(width, 11) }]}>{item.by}</Text> : null}
      <View style={styles.metaGroup}>
        <InfoRow icon="calendar-today" text={item.date} width={width} iconColor={dark ? '#FFFFFF' : '#666666'} />
        <InfoRow icon="place" text={item.location} width={width} iconColor={dark ? '#FFFFFF' : '#666666'} />
        <View style={styles.creditRow}>
          <Image source={Imagepath.CreditValut} style={[styles.creditIcon, dark && styles.creditIconDark]} />
          <Text style={[styles.cardMeta, dark && styles.cardMetaDark, { fontSize: scale(width, 11) }]}>{item.credit}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.priceRow}>
        <Text style={[styles.priceText, dark && styles.priceTextDark, { fontSize: scale(width, 18) }]}>{item.price}</Text>
        <TouchableOpacity onPress={item.onPress} style={[styles.ctaPill, dark && styles.ctaPillDark]}>
          <Text style={[styles.ctaText, { fontSize: scale(width, 12) }]}>{item.cta}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

/**
 * Popular conference card component component.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.width - Nested property value.
 * @returns {JSX.Element}
 */
const PopularConferenceCardComponent = ({ item, width }) => {
    /**
 * Handles press.
 * @returns {*}
 */
const handlePress = () => item?.onPress?.(item?.detailpageUrl);
  return (
    <View style={styles.popularCardWrap}>
      <Pressable onPress={handlePress} style={styles.popularCard}>
        {item?.kicker ? <Text numberOfLines={1} style={styles.popularByText}>{item.kicker}</Text> : null}
        <Text numberOfLines={2} style={[styles.popularTitle, { fontSize: scale(width, 16) }]}>{item.title}</Text>
        <View style={styles.popularMetaGroup}>
          {item?.date ? <InfoRow icon="calendar-today" text={item.date} width={width} /> : null}
          {item?.location ? <InfoRow icon="place" text={item.location} width={width} /> : null}
          {item?.credit ? (
            <View style={styles.creditRow}>
              <Image
                source={Imagepath.CreditValut}
                style={[styles.creditIcon, { tintColor: '#000000' }]}
                resizeMode="contain"
              />
              <Text numberOfLines={1} style={styles.infoText}>{item.credit}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.popularDivider} />
        <View style={styles.popularFooterRow}>
          {item?.price ? <Text style={[styles.popularPrice, { fontSize: scale(width, 18) }]}>{item.price}</Text> : null}
          {item?.buttonText ? (
            <TouchableOpacity onPress={handlePress} style={styles.popularButton}>
              <Text style={styles.popularButtonText}>{item.buttonText}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
};

/**
 * Live conference card component component.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @returns {JSX.Element}
 */
const LiveConferenceCardComponent = ({ item }) => {
    /**
 * Handles press.
 * @returns {*}
 */
const handlePress = () => item?.onPress?.(item?.detailpageUrl);
  const organizationLogo = getImageSource(item?.organizationLogo);

  return (
    <View style={styles.liveCardWrap}>
      <Pressable onPress={handlePress} style={styles.liveCard}>
        <View style={styles.liveCardTop}>
          {item?.location ? (
            <View style={styles.liveLocationPill}>
              <Icon name="location-on" size={13} color="#FFFFFF" />
              <Text numberOfLines={1} style={styles.liveLocationText}>{item.location}</Text>
            </View>
          ) : null}
          <Text numberOfLines={2} style={styles.liveTitle}>{item.title}</Text>
          {item?.organization ? (
            <View style={styles.liveOrgRow}>
              <TouchableOpacity
                onPress={item?.onOrganizerPress}
                disabled={!item?.organizerUrl}
                activeOpacity={0.8}
                style={styles.liveOrgLogo}
              >
                {organizationLogo ? (
                  <Image source={organizationLogo} style={styles.liveOrgLogoImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.liveOrgLogoFallback}>{getInitials(item.organization) || ' '}</Text>
                )}
              </TouchableOpacity>
              <Text numberOfLines={1} style={styles.liveOrg}>By {item.organization}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.liveCardBottom}>
          {item?.date ? (
            <View style={styles.liveDateRow}>
              <Icon name="calendar-today" size={16} color="#333333" />
              <Text numberOfLines={1} style={styles.liveDateText}>{item.date}</Text>
            </View>
          ) : null}
          <View style={styles.liveFooterRow}>
            {item?.cmeLabel ? (
              <View style={styles.liveCreditPill}>
                <Text numberOfLines={1} style={styles.liveCreditText}>{item.cmeLabel}</Text>
              </View>
            ) : null}
            {item?.price ? <Text numberOfLines={1} style={styles.livePriceText}>{item.price}</Text> : null}
          </View>
          {item?.buttonText ? (
            <TouchableOpacity onPress={handlePress} style={styles.liveButton}>
              <Text numberOfLines={1} style={styles.liveButtonText}>{item.buttonText}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
};

/**
 * Free conference card value.
 * @returns {*}
 */
/**
 * Free conference card value.
 * @returns {*}
 */
export const FreeConferenceCard = memo(FreeConferenceCardComponent);
/**
 * Featured conference card value.
 * @returns {*}
 */
/**
 * Featured conference card value.
 * @returns {*}
 */
export const FeaturedConferenceCard = memo(FeaturedConferenceCardComponent);
/**
 * Conference card value.
 * @returns {*}
 */
/**
 * Conference card value.
 * @returns {*}
 */
export const ConferenceCard = memo(ConferenceCardComponent);
/**
 * Popular conference card value.
 * @returns {*}
 */
/**
 * Popular conference card value.
 * @returns {*}
 */
export const PopularConferenceCard = memo(PopularConferenceCardComponent);
/**
 * Live conference card value.
 * @returns {*}
 */
/**
 * Live conference card value.
 * @returns {*}
 */
export const LiveConferenceCard = memo(LiveConferenceCardComponent);
