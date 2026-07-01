/**
 * Speaker profile screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, SpeakerProfile, SearchProf, toggleExpansion, handleUrl, SpeakerConfItem, renderLocationAndDates.
 */

import { View, Text, ImageBackground, ScrollView, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
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

let status = '';

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
  <TouchableOpacity onPress={() => handleUrl(item)}>
    <View style={styles.conferenceCard}>
      <View style={styles.conferenceCardBody}>
        <View style={styles.conferenceTitleRow}>
          <View style={styles.conferenceTitleContainer}>
            <TouchableOpacity onPress={() => handleUrl(item)}>
              <Text style={styles.conferenceTitle} numberOfLines={2} ellipsizeMode="tail">
                {item?.title}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.conferenceTypeRow}>
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

        {(item?.date || item?.location) && <View style={styles.conferenceMetaRow}>{renderLocationAndDates(item)}</View>}
      </View>
    </View>
  </TouchableOpacity>
);

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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection State:', state.isConnected);
      setConn(state.isConnected);
    });
    return () => unsubscribe();
  }, [isConnected]);

  useEffect(() => {
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
          dispatch(speakerProfileRequest(obj));
        })
        .catch(err => showErrorAlert('Please conenct to internet', err));
    }
  }, [dispatch, props?.route?.params]);

  const SearchProf = () => {
    if (props?.route?.params?.fullUrl?.textHo === 'fs') {
      props.navigation.goBack();
    } else if (props?.route?.params?.fullUrl?.speaks === 'speaker') {
      props.navigation.navigate('Speaker', {
        highText: {
          speaks: props?.route?.params?.fullUrl?.speaks === 'speaker' ? 'speaker' : 'organ',
          highText: props?.route?.params?.fullUrl?.hitDat,
        },
      });
    } else {
      props.navigation.goBack();
    }
  };

  const toggleExpansion = () => {
    if (!expanded) {
      setSpeakerconf(prevContent => prevContent);
    }
    setExpanded(!expanded);
  };

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

  const renderLocationAndDates = item => {
    if (item?.date && item?.location) {
      return (
        <View style={[styles.metadataRow, { marginLeft: normalize(1.5) }]}>
          <Image source={Imagepath.WrongCal} style={styles.metadataIcon} />
          <Text style={[styles.metadataText, { width: normalize(220) }]}>{`${item?.date} | ${item?.location}`}</Text>
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

  if (status === '' || TransReducer.status !== status) {
    switch (TransReducer.status) {
      case 'Transaction/speakerProfileRequest':
        status = TransReducer.status;
        break;
      case 'Transaction/speakerProfileSuccess':
        status = TransReducer.status;
        setSpeakerconf(TransReducer?.speakerProfileResponse?.about);
        console.log(TransReducer?.speakerProfileResponse, 'dsfgndksgkjdf----');
        break;
      case 'Transaction/speakerProfileFailure':
        status = TransReducer.status;
        break;
      default:
        break;
    }
  }

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

          <Loader visible={TransReducer?.status === 'Transaction/speakerProfileRequest'} />

          <ScrollView>
            <View style={styles.pageContent}>
              <View style={styles.profileCard}>
                <View style={styles.avatarWrapper}>
                  <ImageBackground
                    source={TransReducer?.speakerProfileResponse?.image ? { uri: TransReducer?.speakerProfileResponse?.image } : Imagepath.HumanIcn}
                    style={styles.avatarImage}
                    imageStyle={styles.avatarImageRadius}
                  />
                </View>

                <View style={styles.profileContent}>
                  {TransReducer?.speakerProfileResponse?.name && <Text style={styles.nameText}>{TransReducer?.speakerProfileResponse?.name}</Text>}

                  {(TransReducer?.speakerProfileResponse?.qualification || TransReducer?.speakerProfileResponse?.specialities) && (
                    <Text style={styles.subtitleText}>
                      {[
                        TransReducer?.speakerProfileResponse?.qualification,
                        TransReducer?.speakerProfileResponse?.specialities,
                      ]
                        .filter(item => item && item.trim() !== '')
                        .join(', ')}
                    </Text>
                  )}

                  {TransReducer?.speakerProfileResponse?.location && (
                    <View style={styles.locationRow}>
                      <Image source={Imagepath.MapPin} style={styles.locationIcon} />
                      <Text style={styles.locationText}>{TransReducer?.speakerProfileResponse?.location}</Text>
                    </View>
                  )}

                  {speakerconf && <View style={styles.divider} />}

                  {speakerconf && (
                    <View style={styles.aboutContainer}>
                      <RenderHTML contentWidth={width} source={{ html: speakerconf }} tagsStyles={speakerProfileTagsStyles} />
                      <TouchableOpacity onPress={toggleExpansion} style={styles.aboutReadMoreButton}>
                        <Text style={styles.aboutReadMoreText}>{expanded ? 'Read Less' : 'Read More'}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {TransReducer?.speakerProfileResponse?.conferences?.length > 0 && (
              <View style={styles.sectionHeadingWrapper}>
                {props?.route?.params?.fullUrl?.speaks === 'organ' || props?.route?.params?.fullUrl?.showtext === 'organ' ? (
                  <Text style={styles.sectionHeadingText}>CONFERENCES & COURSES</Text>
                ) : (
                  <Text style={styles.sectionHeadingText}>EVENTS & ACTIVITIES</Text>
                )}
                {props?.route?.params?.fullUrl?.speaks === 'organ' || props?.route?.params?.fullUrl?.showtext === 'organ' ? null : (
                  <Text style={styles.sectionSubheadingText}>(Speaking, Spoken, and Authored)</Text>
                )}
              </View>
            )}

            {TransReducer?.speakerProfileResponse?.conferences?.length > 0 ? (
              <View style={styles.conferenceList}>
                {TransReducer?.speakerProfileResponse?.conferences?.slice(0, 6).map((item, index) => (
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

            {TransReducer?.speakerProfileResponse?.total_conferences > 6 && (
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('Globalresult', {
                    trig: {
                      speaker: props?.route?.params?.fullUrl?.speaks === 'speaker' ? [TransReducer?.speakerProfileResponse?.name] : '',
                      newAdd: 'user_url',
                      trig: props?.route?.params?.fullUrl?.fullUrl,
                      beforetake: '1',
                      rqstType: 'normallist',
                      mainKey: 'need_past_conferences',
                      creditAll: props?.route?.params?.fullUrl?.creditData,
                      organ: props?.route?.params?.fullUrl?.speaks === 'speaker' ? '' : [TransReducer?.speakerProfileResponse?.name],
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
                <Text style={styles.viewAllText}>{`View All (${TransReducer?.speakerProfileResponse?.total_conferences})`}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default SpeakerProfile;
