/**
 * Speaker profile screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, SpeakerProfile, SearchProf, toggleExpansion, handleUrl, SpeakerConfItem, renderLocationAndDates.
 */

import { View, Text, ImageBackground, ScrollView, Image, TouchableOpacity, useWindowDimensions, BackHandler } from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useLayoutEffect, useMemo, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { useFocusEffect } from '@react-navigation/native';
import Colorpath from '../../Themes/Colorpath';
import Imagepath from '../../Themes/Imagepath';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import { useDispatch, useSelector } from 'react-redux';
import { speakerProfileRequest } from '../../Redux/Reducers/TransReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import Loader from '../../Utils/Helpers/Loader';
import RenderHTML from 'react-native-render-html';
import NetInfo from '@react-native-community/netinfo';
import { AppContext } from './AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context';
import normalize from '../../Utils/Helpers/Dimen';
import styles, { speakerProfileTagsStyles } from './SpeakerProfile.styles';

/**
 * Status string constant.
 * @returns {string}
 */


/**
 * Speaker conference card.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.item - Conference item data.
 * @param {Function} props.handleUrl - Press handler for opening a conference.
 * @param {Function} props.renderLocationAndDates - Renderer for location/date metadata.
 * @returns {JSX.Element}
 */
const SpeakerConfItem = ({ item, handleUrl, renderLocationAndDates }) => (
  <TouchableOpacity onPress={() => handleUrl(item)} activeOpacity={0.8} style={styles.conferenceCardTouch}>
    <View style={styles.conferenceCardBody}>
      {item?.eventType ? (
        <View style={styles.conferenceTypePill}>
          <Image
            source={
              item?.eventType === 'Text-Based CME'
                ? Imagepath.Textbased
                : item?.eventType === 'In-Person Event'
                  ? Imagepath.InPerson
                  : item?.eventType === 'Hybrid Event'
                    ? Imagepath.Hybrid
                    : item?.eventType === 'Webcast'
                      ? Imagepath.VideoCam
                      : item?.eventType === 'Journal CME'
                        ? Imagepath.Journal
                        : item?.eventType === 'Podcast'
                          ? Imagepath.PodCast
                          : item?.eventType === 'Live Webinar'
                            ? Imagepath.LiveWebinar
                            : null
            }
            style={styles.conferenceTypeIcon}
          />
          <Text style={styles.conferenceTypeText}>{item?.eventType}</Text>
        </View>
      ) : null}

      <Text style={styles.conferenceTitle}>
        {item?.title}
      </Text>

      {(item?.date || item?.location) ? (
        <View style={styles.conferenceMetaRow}>{renderLocationAndDates(item)}</View>
      ) : null}
    </View>
  </TouchableOpacity>
);

/**
 * Truncates HTML or plain text content to approximately 50% of its readable text length
 * while safely maintaining tag hierarchy and properly closing open tags.
 * @param {string} htmlString - Source HTML or plain text string.
 * @returns {string} Safe 50% truncated HTML with ellipsis.
 */
const getHalfContent = (htmlString) => {
  if (!htmlString || typeof htmlString !== 'string') return '';

  const plainText = htmlString.replace(/<[^>]*>/g, '').trim();
  if (plainText.length <= 160) {
    return htmlString;
  }

  const targetLength = Math.max(Math.floor(plainText.length * 0.5), 80);
  let textCount = 0;
  let cutIndex = htmlString.length;
  let inTag = false;

  for (let i = 0; i < htmlString.length; i++) {
    if (htmlString[i] === '<') {
      inTag = true;
    } else if (htmlString[i] === '>') {
      inTag = false;
    } else if (!inTag) {
      textCount++;
      if (textCount >= targetLength) {
        let wordEnd = i;
        while (wordEnd < htmlString.length && htmlString[wordEnd] !== ' ' && htmlString[wordEnd] !== '<') {
          wordEnd++;
        }
        cutIndex = wordEnd;
        break;
      }
    }
  }

  let truncated = htmlString.slice(0, cutIndex).trim();

  // Ensure all opened tags are safely closed
  const openTags = [];
  const tagRegex = /<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g;
  let match;
  while ((match = tagRegex.exec(truncated)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const isClosing = fullTag.startsWith('</');
    const isSelfClosing = fullTag.endsWith('/>') || ['br', 'img', 'hr', 'input'].includes(tagName);

    if (!isSelfClosing) {
      if (isClosing) {
        const lastIdx = openTags.lastIndexOf(tagName);
        if (lastIdx !== -1) {
          openTags.splice(lastIdx, 1);
        }
      } else {
        openTags.push(tagName);
      }
    }
  }

  truncated += '...';
  while (openTags.length > 0) {
    const tag = openTags.pop();
    truncated += `</${tag}>`;
  }

  return truncated;
};

/**
 * Speaker profile screen component.
 *
 * @param {Object} props - React Navigation props.
 * @returns {JSX.Element}
 */
const SpeakerProfile = props => {
  const { isConnected } = useContext(AppContext);
  const { width } = useWindowDimensions();
  const TransReducer = useSelector(state => state.TransReducer);
  const dispatch = useDispatch();
  const [conn, setConn] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [speakerconf, setSpeakerconf] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const profileRequestRef = useRef(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection State:', state.isConnected);
      setConn(state.isConnected);
    });
    return () => unsubscribe();
  }, [isConnected]);

  useEffect(() => {
    const requestId = nanoid();
    profileRequestRef.current = requestId;
    setLoading(true);
    setProfile(null);
    setSpeakerconf('');
    setExpanded(false);
    if (props?.route?.params?.fullUrl?.fullUrl) {
      const obj =
      props?.route?.params?.fullUrl?.speaks === 'speaker'
          ? {
              user_url: props?.route?.params?.fullUrl?.fullUrl,
              speak: '',
            }
          : {
              user_url: props?.route?.params?.fullUrl?.fullUrl,
            };
      connectionrequest()
        .then(() => {
          if (profileRequestRef.current !== requestId) return;
          dispatch({ ...speakerProfileRequest(obj), meta: { requestId } });
        })
        .catch(err => {
          if (profileRequestRef.current !== requestId) return;
          setLoading(false);
          showErrorAlert('Please connect to internet', err);
        });
    }
    else setLoading(false);
    return () => { profileRequestRef.current = null; };
  }, [dispatch, props?.route?.params?.fullUrl?.fullUrl, props?.route?.params?.fullUrl?.speaks]);

    /**
 * Search prof component.
 * @returns {void}
 */
const SearchProf = useCallback(() => {
    if (props.navigation.canGoBack()) props.navigation.goBack();
  }, [props.navigation]);

  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!props.navigation.canGoBack()) return false;
      SearchProf();
      return true;
    });
    return () => subscription.remove();
  }, [props.navigation, SearchProf]));

  /**
   * Toggle expansion utility for dynamic 50/100% about view.
   * @returns {void}
   */
  const toggleExpansion = () => {
    setExpanded(prev => !prev);
  };

  const fullAboutText = speakerconf || '';
  const plainAboutLength = fullAboutText.replace(/<[^>]*>/g, '').trim().length;
  const isDynamicContent = plainAboutLength > 160;
  const halfAboutContent = useMemo(() => getHalfContent(fullAboutText), [fullAboutText]);
  const displayedAboutHtml = expanded || !isDynamicContent ? fullAboutText : halfAboutContent;

    /**
 * Handles url.
 * @param {*} onlineName - Input value.
 * @returns {void}
 */
const handleUrl = onlineName => {
    const url = onlineName?.detailpage_url;
    if (!url) {
      console.warn('Invalid or missing URL:', onlineName);
      return;
    }

    try {
      const result = url.split('/').pop() || '';
      if (result) {
        props.navigation.navigate('Statewebcast', {
          webCastURL: {
            webCastURL: result,
            shareUrl: url,
            detailpage_url: url,
            creditData: props?.route?.params?.fullUrl?.creditData,
            takeUrl: props?.route?.params?.fullUrl?.hitDat ? props?.route?.params?.fullUrl?.fullUrl : '',
            speaks: props?.route?.params?.fullUrl?.speaks === 'speaker' ? 'speaker' : 'organ',
            highText: props?.route?.params?.fullUrl?.hitDat,
            textHo: props?.route?.params?.fullUrl?.textHo,
            Realback: props?.route?.params?.fullUrl?.Realback,
          },
        });
      }
    } catch (error) {
      console.error('URL processing error:', error);
    }
  };

    /**
 * Render location and dates utility.
 * @param {*} item - Input value.
 * @returns {*}
 */
const renderLocationAndDates = item => {
    if (item?.date && item?.location) {
      return (
        <View style={styles.metadataRow}>
          <Image source={Imagepath.WrongCal} style={styles.metadataIcon} />
          <Text style={styles.metadataText}>{`${item?.date} | ${item?.location}`}</Text>
        </View>
      );
    }

    if (item?.date) {
      return (
        <View style={styles.metadataRow}>
          <Image source={Imagepath.WrongCal} style={styles.metadataIcon} />
          <Text style={styles.metadataText}>{`${item?.date}`}</Text>
        </View>
      );
    }

    if (item?.location) {
      return (
        <View style={styles.metadataRow}>
          <Image source={Imagepath.WrongCal} style={styles.metadataIcon} />
          <Text style={styles.metadataText}>{item?.location}</Text>
        </View>
      );
    }

    return null;
  };

  useEffect(() => {
    if (!profileRequestRef.current || TransReducer.speakerProfileRequestId !== profileRequestRef.current) return;
    if (TransReducer.status === 'Transaction/speakerProfileSuccess') {
      setProfile(TransReducer.speakerProfileResponse);
      setSpeakerconf(TransReducer.speakerProfileResponse?.about || '');
      setLoading(false);
    } else if (TransReducer.status === 'Transaction/speakerProfileFailure') {
      setLoading(false);
    }
  }, [TransReducer.status, TransReducer.speakerProfileRequestId, TransReducer.speakerProfileResponse]);

  useLayoutEffect(() => {
    props.navigation.setOptions({ gestureEnabled: false });
  }, [props.navigation]);

  return (
    <>
      <MyStatusBar barStyle="light-content" backgroundColor={Colorpath.Pagebg} />
      {conn === false ? (
        <IntOff />
      ) : (
        <SafeAreaView style={styles.screen}>
          <View style={styles.headerWrapper}>
            <PageHeader
              title={
                props?.route?.params?.fullUrl?.speaks === 'organ' || props?.route?.params?.fullUrl?.showtext === 'organ'
                  ? 'Organizer Profile'
                  : 'Speaker Profile'
              }
              onBackPress={SearchProf}
            />
          </View>

          <Loader visible={loading} />

          {!loading && <ScrollView>
            <View style={styles.pageContent}>
              <View style={styles.profileCard}>
                <View style={styles.profileHeaderRow}>
                  <View style={styles.avatarWrapper}>
                    <Image
                      source={profile?.image ? { uri: profile?.image } : Imagepath.HumanIcn}
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                  </View>

                  <View style={styles.profileContent}>
                    {profile?.name ? (
                      <Text style={styles.nameText}>{profile?.name}</Text>
                    ) : null}

                    {(profile?.qualification || profile?.specialities) ? (
                      <Text style={styles.subtitleText}>
                        {[
                          profile?.qualification,
                          profile?.specialities,
                        ]
                          .filter(item => item && item.trim() !== '')
                          .join(', ')}
                      </Text>
                    ) : null}

                    {profile?.location ? (
                      <View style={styles.locationRow}>
                        <Image source={Imagepath.MapPin} style={styles.locationIcon} />
                        <Text style={styles.locationText}>{profile?.location}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                {speakerconf ? (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.aboutContainer}>
                      <Text style={styles.aboutHeading}>About</Text>
                      <RenderHTML
                        contentWidth={Math.max(width - normalize(64), 220)}
                        source={{ html: displayedAboutHtml }}
                        tagsStyles={speakerProfileTagsStyles}
                      />
                      {isDynamicContent ? (
                        <TouchableOpacity onPress={toggleExpansion} style={styles.aboutReadMoreButton} activeOpacity={0.7}>
                          <Text style={styles.aboutReadMoreText}>{expanded ? 'Read Less' : 'Read More'}</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </>
                ) : null}
              </View>
            </View>

            {profile?.conferences?.length > 0 && (
              <View style={styles.sectionHeadingWrapper}>
                <View style={styles.sectionHeadingRow}>
                  <View style={styles.sectionAccent} />
                  <Text style={styles.sectionHeadingText}>
                    {props?.route?.params?.fullUrl?.speaks === 'organ' || props?.route?.params?.fullUrl?.showtext === 'organ'
                      ? 'CONFERENCES & COURSES'
                      : 'EVENTS & ACTIVITIES'}
                  </Text>
                </View>
                {props?.route?.params?.fullUrl?.speaks === 'organ' || props?.route?.params?.fullUrl?.showtext === 'organ' ? null : (
                  <Text style={styles.sectionSubheadingText}>(Speaking, Spoken, and Authored)</Text>
                )}
              </View>
            )}

            {profile?.conferences?.length > 0 ? (
              <View style={styles.conferenceList}>
                {profile?.conferences?.slice(0, 6).map((item, index) => (
                    <SpeakerConfItem key={item?.id || index} item={item} handleUrl={handleUrl} renderLocationAndDates={renderLocationAndDates} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateWrapper}>
                <View style={styles.emptyStateCard}>
                  <View style={styles.emptyStateContent}>
                    <Text style={styles.emptyStateText}>
                      There are no matches available for your search criteria. Please change the criteria and try again.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {profile?.total_conferences > 6 && (
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('Globalresult', {
                    trig: {
                      speaker: props?.route?.params?.fullUrl?.speaks === 'speaker' ? [profile?.name] : '',
                      newAdd: 'user_url',
                      trig: props?.route?.params?.fullUrl?.fullUrl,
                      beforetake: '1',
                      rqstType: 'normallist',
                      mainKey: 'need_past_conferences',
                      creditAll: props?.route?.params?.fullUrl?.creditData,
                      organ: props?.route?.params?.fullUrl?.speaks === 'speaker' ? '' : [profile?.name],
                      speaks: props?.route?.params?.fullUrl?.speaks === 'speaker' ? 'speaker' : 'organ',
                      highText: props?.route?.params?.fullUrl?.hitDat,
                      textHo: props?.route?.params?.fullUrl?.textHo,
                      back: 'goBack',
                      refreshKey: Date.now(),
                      Realback: props?.route?.params?.fullUrl?.Realback,
                    },
                  })
                }
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>{`View All (${profile?.total_conferences})`}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>}
        </SafeAreaView>
      )}
    </>
  );
};

/**
 * Speaker profile default export.
 *
 * @returns {*}
 */
export default SpeakerProfile;
