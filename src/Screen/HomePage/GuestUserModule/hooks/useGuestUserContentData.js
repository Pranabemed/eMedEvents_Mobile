/**
 * File Name: useGuestUserContentData.js
 * Module: Guest User
 * Purpose: Derives guest home UI data, mapped section items, and section-level handlers.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, ../utils/guestUserCore, ../utils/guestUserContentParsers
 */

import { useCallback, useMemo, useState } from 'react';
import {
  chunkArray,
  firstArray,
  getCountValue,
  getDetailSlug,
  getSpecialityLabel,
  getStateCode,
  getStateSlug,
  getText,
} from '../utils/guestUserCore';
import {
  getBannerUrl,
  getCmeLabel,
  getDateRange,
  getDetailPageUrl,
  getHtmlButtonText,
  getHtmlLocation,
  getHtmlTitle,
  getPriceLabel,
  parseBannerMeta,
} from '../utils/guestUserContentParsers';

/**
 * Description: Guest user content data hook.
 * Purpose: Moves data derivation and section mapping out of the large UI component.
 */
export const useGuestUserContentData = guest => {
  const {
    navigation,
    homeData,
    aboutUsData,
    homeStatus,
    isGuestHomeLoading,
    stateList,
    selectedState,
    stateSearchText,
    handleStateSelect,
    handleStatePress,
    onFeaturedActivityPress,
  } = guest;

  const [statePickerMode, setStatePickerMode] = useState('listing');

  const isHomeLoading =
    isGuestHomeLoading != null
      ? isGuestHomeLoading
      : homeStatus === 'Guest/HomelistRequest' || homeStatus === '' || homeStatus == null;

  const topBanners = useMemo(
    () =>
      firstArray(
        homeData?.mobile_top_banners,
        homeData?.mobile_top_banner,
        homeData?.top_banners,
        homeData?.banners,
      ),
    [homeData],
  );
  const topSpecialities = useMemo(
    () =>
      firstArray(
        homeData?.topSpecialities,
        homeData?.top_specialities,
        homeData?.specialities,
        homeData?.specialties,
      ),
    [homeData],
  );
  const featuredConferences = useMemo(
    () =>
      firstArray(
        homeData?.featured_conferences,
        homeData?.featuredConferences,
        homeData?.featured,
        homeData?.conferences,
      ),
    [homeData],
  );
  const specialtyCourseBundles = useMemo(
    () =>
      firstArray(
        homeData?.specialty_course_bundles,
        homeData?.specialtyCourseBundles,
        homeData?.specialty_course_bundle,
      ),
    [homeData],
  );
  const freeConferences = useMemo(
    () =>
      firstArray(
        homeData?.free_conferences,
        homeData?.freeConferences,
        homeData?.free_conference,
      ),
    [homeData],
  );
  const liveWebinars = useMemo(
    () =>
      firstArray(
        homeData?.inperson_hybrid,
        homeData?.inPersonHybrid,
        homeData?.liveWebinar,
        homeData?.live_webinars,
        homeData?.liveWebinars,
      ),
    [homeData],
  );
  const popularCourses = useMemo(
    () =>
      firstArray(
        homeData?.popular_courses,
        homeData?.popularCourses,
        homeData?.popular_course,
      ),
    [homeData],
  );

  const filteredStateList = useMemo(
    () =>
      (stateList || []).filter(item => {
        const name = String(item?.name || item?.state_name || item?.title || '').toLowerCase();
        return name.includes(stateSearchText.trim().toLowerCase());
      }),
    [stateList, stateSearchText],
  );

  const openStateResults = useCallback(
    stateObj => {
      const stateUrl = getStateSlug(stateObj);
      const [countrySlug = 'united-states', stateSlug = stateUrl] = stateUrl.split('/');

      handleStateSelect(stateObj, 'listing');
      navigation.navigate('Globalresult', {
        trig: {
          beforetake: countrySlug,
          trig: stateSlug,
          rqstType: 'stateconferences',
          mainKey: 'country',
          newAdd: 'state',
          totalDaa: stateObj,
          creditAll: '',
          Realback: 'cont',
        },
      });
    },
    [handleStateSelect, navigation],
  );

  const openStatePicker = useCallback(
    mode => {
      setStatePickerMode(mode);
      handleStatePress();
    },
    [handleStatePress],
  );

  const handleStateItemPress = useCallback(
    stateObj => {
      if (statePickerMode === 'profile') {
        handleStateSelect(stateObj, 'profile');
        return;
      }
      openStateResults(stateObj);
    },
    [handleStateSelect, openStateResults, statePickerMode],
  );

  const mapConference = useCallback(
    c => ({
      title: getText(c?.course_title, c?.title, c?.conference_name, c?.name, c?.banner_title, c?.heading),
      organization: getText(c?.organization_name, c?.organizer_name, c?.organizer),
      organizationLogo: c?.organization_imagepath || c?.organization_image || c?.organization_logo || c?.logo || c?.image,
      specialities: c?.specialities,
      organizationUrl: getText(c?.organization_url, c?.organizer_url, c?.user_url),
      date: getDateRange(c),
      location: getText(c?.course_location, c?.location, c?.venue, c?.city),
      cmeLabel: getCmeLabel(c),
      price: getPriceLabel(c),
      button: getText(c?.button, c?.buttonText, c?.button_text, c?.cta_text) || 'Register',
      detailpageUrl: getDetailPageUrl(c),
      onPress: detailUrl => {
        const url = detailUrl || getDetailPageUrl(c);
        if (url) onFeaturedActivityPress?.(url);
      },
      onOrganizerPress: () => {
        const organizationUrl = getText(c?.organization_url, c?.organizer_url, c?.user_url);
        const slug = getDetailSlug(organizationUrl);
        if (slug) {
          navigation.navigate('SpeakerProfile', {
            fullUrl: {
              fullUrl: slug,
              creditData: '',
              organ: 'organ',
              textHo: 'fs',
              showtext: 'organ',
              Realback: 'guest',
              organization_url: organizationUrl,
              organization_imagepath: getText(c?.organization_imagepath, c?.organization_image, c?.organization_logo),
              organization_name: getText(c?.organization_name, c?.organizer_name),
            },
          });
        }
      },
    }),
    [navigation, onFeaturedActivityPress],
  );

  const mapFreeConference = useCallback(
    c => {
      const detailpageUrl = getDetailPageUrl(c) || getBannerUrl(c);
      return {
        title: getText(c?.course_title, c?.title, c?.conference_name, c?.name, c?.banner_title, c?.heading),
        organization: getText(c?.organization_name, c?.organizer_name, c?.organizer, c?.provider),
        eventType: getText(c?.eventType, c?.event_type, c?.conference_type, c?.conference_type_text, c?.type),
        buttonText: getText(c?.buttonText, c?.button_text, c?.button),
        date: getDateRange(c),
        cmeLabel: getCmeLabel(c),
        price: getPriceLabel(c),
        detailpageUrl,
        onPress: detailUrl => {
          const slug = getDetailSlug(detailUrl);
          if (slug) {
            navigation.navigate('Statewebcast', {
              webCastURL: { webCastURL: slug, shareUrl: detailUrl, detailpage_url: detailUrl, Realback: 'guest' }
            });
          }
        },
      };
    },
    [navigation],
  );

  const mapLiveWebinar = useCallback(
    c => {
      const parsedHtml = parseBannerMeta(String(c?.html_content || ''));
      const detailpageUrl = getDetailPageUrl(c) || getBannerUrl(c);
      const currencyPrefix = getText(c?.display_currency_code, c?.currency_code, 'US$');
      const rawPrice = getText(c?.display_price, c?.price, c?.amount);
      return {
        title:
          getText(c?.course_title, c?.title, c?.conference_name, c?.name, c?.banner_title, c?.heading) ||
          getHtmlTitle(c) ||
          getText(c?.banner_name),
        organization: getText(c?.organization_name, c?.organizer_name, c?.organizer, c?.provider),
        organizationLogo: c?.organization_imagepath || c?.organization_image || c?.organization_logo || c?.logo,
        organizerUrl: getText(c?.organization_url, c?.organizer_url, c?.user_url),
        date: getDateRange(c) || parsedHtml.date,
        location: getText(c?.course_location, c?.location, c?.venue, c?.city, getHtmlLocation(c)),
        cmeLabel: getCmeLabel(c) || parsedHtml.credits,
        price: String(rawPrice).trim().toUpperCase() === 'FREE'
          ? 'FREE'
          : `${currencyPrefix}${rawPrice}`,
        buttonText: getText(c?.buttonText, c?.button_text, c?.button, c?.cta_text) || getHtmlButtonText(c) || 'Register Now',
        detailpageUrl,
        onOrganizerPress: () => {
          const slug = getDetailSlug(getText(c?.organization_url, c?.organizer_url, c?.user_url));
          if (slug) {
            navigation.navigate('SpeakerProfile', {
              fullUrl: {
                fullUrl: slug,
                creditData: '',
                organ: 'organ',
                textHo: 'fs',
                showtext: 'organ',
                Realback: 'guest',
                organization_url: getText(c?.organization_url, c?.organizer_url, c?.user_url),
                organization_imagepath: getText(c?.organization_imagepath, c?.organization_image, c?.organization_logo),
                organization_name: getText(c?.organization_name, c?.organizer_name),
              },
            });
          }
        },
        onPress: detailUrl => {
          const slug = getDetailSlug(detailUrl);
          if (slug) {
            navigation.navigate('Statewebcast', {
              webCastURL: { webCastURL: slug, shareUrl: detailUrl, detailpage_url: detailUrl, Realback: 'guest' }
            });
          }
        },
      };
    },
    [navigation],
  );

  const mapPopularConference = useCallback(
    c => {
      const detailpageUrl = getDetailPageUrl(c) || getBannerUrl(c);
      const organization = getText(c?.organization_name, c?.organizer_name, c?.organizer, c?.provider);
      return {
        title: getText(c?.course_title, c?.title, c?.conference_name, c?.name, c?.banner_title, c?.heading),
        kicker: organization ? `By ${organization}` : '',
        date: getDateRange(c),
        location: getText(c?.course_location, c?.location, c?.venue, c?.city),
        credit: getCmeLabel(c),
        price: getPriceLabel(c),
        buttonText: getText(c?.buttonText, c?.button_text, c?.button, c?.cta_text) || 'REGISTER NOW',
        detailpageUrl,
        onPress: detailUrl => {
          const slug = getDetailSlug(detailUrl);
          if (slug) {
            navigation.navigate('Statewebcast', {
              webCastURL: { webCastURL: slug, shareUrl: detailUrl, detailpage_url: detailUrl, Realback: 'guest' }
            });
          }
        },
      };
    },
    [navigation],
  );

  const specialityItems = useMemo(
    () => (topSpecialities.length > 0 ? topSpecialities : []).map(getSpecialityLabel).filter(Boolean),
    [topSpecialities],
  );
  const specialityColumns = useMemo(
    () => chunkArray(specialityItems.map((label, index) => ({ label, index })), 2),
    [specialityItems],
  );
  const aboutUsRoot = useMemo(
    () =>
      aboutUsData?.eMedEventsStats && typeof aboutUsData?.eMedEventsStats === 'object'
        ? aboutUsData.eMedEventsStats
        : {},
    [aboutUsData],
  );
  const marketplaceStats = useMemo(
    () =>
      [
        { value: getCountValue(aboutUsRoot?.hcpcount), label: 'Healthcare Professionals' },
        { value: getCountValue(aboutUsRoot?.hcpcount), label: 'Healthcare Professionals' },
        { value: getCountValue(aboutUsRoot?.specialties), label: 'Specialities' },
        { value: getCountValue(aboutUsRoot?.hosted_conferences), label: 'Online Activities' },
        { value: getCountValue(aboutUsRoot?.live_conferences), label: 'Live Activities' },
      ].filter(item => item.value),
    [aboutUsRoot],
  );

  return {
    isHomeLoading,
    stateCode: getStateCode(selectedState),
    topBanners,
    filteredStateList,
    openStatePicker,
    handleStateItemPress,
    featuredConferenceItems: featuredConferences.map(mapConference),
    specialtyFeaturedItems: specialtyCourseBundles.map(item => ({
      ...mapConference(item),
      showSpecialities: true,
      showOrganization: false,
    })),
    freeConferenceItems: freeConferences.map(mapFreeConference),
    liveWebinarItems: liveWebinars.map(mapLiveWebinar),
    popularConferenceItems: popularCourses.map(mapPopularConference),
    specialityItems,
    specialityColumns,
    marketplaceStats,
  };
};
