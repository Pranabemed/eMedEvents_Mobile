/**
 * File Name: GuestUserContent.js
 * Module: Guest User
 * Purpose: Orchestrates guest home UI by composing modular child sections and mapped guest data.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, react-native, react-native-safe-area-context, ../../Themes/Colorpath, ../../Utils/MyStatusBar, ../CMECreditValut/CMEChecklistModal, ./GuestUser.styles, ./GuestUserModule/hooks/useGuestUserContentData, ./GuestUserModule/components/*
 */

import React, { useCallback } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import CMEChecklistModal from '../CMECreditValut/CMEChecklistModal';
import styles from './GuestUser.styles';
import { useGuestUserContentData } from './GuestUserModule/hooks/useGuestUserContentData';
import { GuestHomeHeader } from './GuestUserModule/components/GuestHomeHeader';
import { GuestHeroSection } from './GuestUserModule/components/GuestHeroSection';
import { CarouselSection, LiveConferenceSection } from './GuestUserModule/components/GuestCarouselSections';
import {
  FeaturedConferenceCard,
  FreeConferenceCard,
  LiveConferenceCard,
  PopularConferenceCard,
} from './GuestUserModule/components/GuestUserCards';
import {
  GuestCarouselShimmer,
  GuestChipsShimmer,
  GuestRequirementsShimmer,
} from './GuestUserModule/components/GuestUserShimmers';
import {
  GuestMarketplaceSection,
  GuestRequirementsPanel,
  GuestSpecialitySection,
} from './GuestUserModule/components/GuestPanels';
import { GuestSelectionModals } from './GuestUserModule/components/GuestSelectionModals';

/**
 * Description: Guest user home content component.
 * Purpose: Composes the guest landing page from modular child sections without changing existing behavior.
 *
 * Params:
 * @param {Object} props
 * @param {Object} props.guest
 *
 * Returns:
 * @returns {JSX.Element}
 *
 * Flow:
 * 1. Read the guest view-model from the container.
 * 2. Derive section-ready data through `useGuestUserContentData`.
 * 3. Render guest sections, modals, and checklist flow in the existing order.
 * 4. Preserve all navigation and modal behavior.
 *
 * API Used:
 * None directly in this file
 *
 * Redux Actions:
 * None directly in this file
 *
 * Error Handling:
 * Falls back to shimmer or empty-safe rendering when section data is missing.
 */
const GuestUserContent = ({ guest }) => {
  const { width } = useWindowDimensions();
  const contentWidth = Math.max(width - 32, 0);
  const {
    navigation,
    profModalVisible,
    setProfModalVisible,
    stateModalVisible,
    setStateModalVisible,
    selectedProfession,
    selectedState,
    stateSearchText,
    setStateSearchText,
    handleProfessionSelect,
    handleStateSelect,
    stateList,
    cmeModalVisible,
    allProfessionData,
    setAllProfessionData,
    certificatedata,
    allProfession,
    onCMEClose,
    onSaved,
  } = guest;

  const {
    isHomeLoading,
    stateCode,
    topBanners,
    filteredStateList,
    openStatePicker,
    handleStateItemPress,
    featuredConferenceItems,
    specialtyFeaturedItems,
    freeConferenceItems,
    liveWebinarItems,
    popularConferenceItems,
    specialityItems,
    specialityColumns,
    marketplaceStats,
  } = useGuestUserContentData(guest);

  const renderFeaturedCard = useCallback(
    ({ item }) => <FeaturedConferenceCard item={item} width={width} />,
    [width],
  );
  const renderPopularCard = useCallback(
    ({ item }) => <PopularConferenceCard item={item} width={width} />,
    [width],
  );
  const renderFreeCard = useCallback(({ item }) => <FreeConferenceCard item={item} />, []);
  const renderLiveCard = useCallback(({ item }) => <LiveConferenceCard item={item} />, []);

  return (
    <>
      <MyStatusBar barStyle="dark-content" backgroundColor={Colorpath.Pagebg} translucent={false} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} stickyHeaderIndices={[1]}>
          <View style={[styles.page, { width, paddingBottom: 0 }]}>
            <GuestHomeHeader
              width={width}
              navigation={navigation}
              selectedState={selectedState}
              stateCode={stateCode}
              onOpenStatePicker={() => openStatePicker('listing')}
              isUsaUser={guest?.isUsaUser}
              renderTopOnly={true}
            />
          </View>

          <View style={[styles.page, { width, paddingTop: 4, paddingBottom: 4, backgroundColor: Colorpath.Pagebg || '#eaf5ff' }]}>
            <GuestHomeHeader
              width={width}
              navigation={navigation}
              selectedState={selectedState}
              stateCode={stateCode}
              onOpenStatePicker={() => openStatePicker('listing')}
              isUsaUser={guest?.isUsaUser}
              renderSearchOnly={true}
            />
          </View>

          <View style={[styles.page, { width, paddingTop: 0 }]}>
            <GuestHeroSection
              topBanners={topBanners}
              isHomeLoading={isHomeLoading}
              navigation={navigation}
              width={width}
            />
            {/* {api needed} */}
            {isHomeLoading ? (
              <GuestCarouselShimmer title="Featured Activity" width={width} showTitle={false} />
            ) : featuredConferenceItems.length > 0 ? (
              <CarouselSection
                title="Featured Activities"
                action=""
                data={featuredConferenceItems}
                renderItem={renderFeaturedCard}
                sliderWidth={contentWidth}
                itemWidth={contentWidth}
                width={width}
                onAction={() => ''}
              />
            ) : null}

            {isHomeLoading ? (
              guest?.isUsaUser === false ? null : <GuestRequirementsShimmer />
            ) : guest?.isUsaUser ? (
              <GuestRequirementsPanel
                isHomeLoading={isHomeLoading}
                selectedProfession={selectedProfession}
                handleProfessionSelect={handleProfessionSelect}
                selectedState={selectedState}
                handleStateSelect={handleStateSelect}
                stateList={stateList}
                isUsaUser={guest?.isUsaUser}
              />
            ) : null}

            {isHomeLoading ? (
              <GuestCarouselShimmer title="Most Popular Conferences" width={width} />
            ) : popularConferenceItems.length > 0 ? (
              <CarouselSection
                title="Most Popular Conferences"
                action=""
                data={popularConferenceItems}
                renderItem={renderPopularCard}
                sliderWidth={contentWidth}
                itemWidth={contentWidth}
                width={width}
                onAction={() => ''}
              />
            ) : null}

            {isHomeLoading ? (
              <GuestChipsShimmer />
            ) : specialityItems.length > 0 ? (
              <GuestSpecialitySection
                navigation={navigation}
                width={width}
                specialityItems={specialityItems}
                specialityColumns={specialityColumns}
              />
            ) : null}

            {isHomeLoading ? (
              <GuestCarouselShimmer title="Specialty Featured" width={width} />
            ) : specialtyFeaturedItems.length > 0 ? (
              <CarouselSection
                title="Specialty Featured"
                action="View all"
                data={specialtyFeaturedItems}
                renderItem={renderFeaturedCard}
                sliderWidth={contentWidth}
                itemWidth={contentWidth}
                width={width}
                onAction={() =>
                  navigation.navigate('BrowseScreen', {
                    highText: {
                      highText: 'Specialty',
                      CreditData: '',
                      isGuest: true,
                      Realback: 'guest',
                    },
                  })
                }
              />
            ) : null}

            {isHomeLoading ? (
              <GuestCarouselShimmer title="Live Conferences" width={width} variant="live" />
            ) : liveWebinarItems.length > 0 ? (
              <LiveConferenceSection
                data={liveWebinarItems}
                renderItem={renderLiveCard}
                sliderWidth={contentWidth}
                itemWidth={contentWidth}
                onAction={() =>
                  navigation.navigate('Globalresult', {
                    trig: {
                      trig: 'webinar',
                      rqstType: 'typebasedconferences',
                      mainKey: 'conference_type',
                      Realback: 'cont',
                    },
                  })
                }
              />
            ) : null}

            {isHomeLoading ? (
              <GuestCarouselShimmer title="Free CME/CE" width={width} variant="free" />
            ) : freeConferenceItems.length > 0 ? (
              <CarouselSection
                title="Free CME/CE"
                action="View all"
                data={freeConferenceItems}
                renderItem={renderFreeCard}
                sliderWidth={contentWidth}
                itemWidth={contentWidth}
                width={width}
                onAction={() =>
                  navigation.navigate('Globalresult', {
                    trig: { trig: '', rqstType: 'freeconferences', mainKey: '', Realback: 'guest' },
                  })
                }
              />
            ) : null}

            {!isHomeLoading ? (
              <GuestMarketplaceSection width={width} stats={marketplaceStats} navigation={navigation} />
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>

      <GuestSelectionModals
        profModalVisible={profModalVisible}
        setProfModalVisible={setProfModalVisible}
        stateModalVisible={stateModalVisible}
        setStateModalVisible={setStateModalVisible}
        handleProfessionSelect={handleProfessionSelect}
        stateSearchText={stateSearchText}
        setStateSearchText={setStateSearchText}
        filteredStateList={filteredStateList}
        handleStateItemPress={handleStateItemPress}
      />

      <CMEChecklistModal
        allProfessionData={allProfessionData}
        setAllProfessionData={setAllProfessionData}
        onCMEClose={onCMEClose}
        onSaved={onSaved}
        isVisibelCME={cmeModalVisible}
        allProfession={allProfession}
        certificatedata={certificatedata}
        selectedState={selectedState}
        cmeRealback={guest?.cmeRealback}
        onBrowseCourses={() =>
          navigation.navigate('CMERequirement', {
            initialState: selectedState,
            initialProfession: selectedProfession || 'Physician',
          })
        }
      />
    </>
  );
};

export default GuestUserContent;
