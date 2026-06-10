/**
 * File Name: GuestPanels.js
 * Module: Guest User
 * Purpose: Panel-style UI sections for Guest User home content.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, react-native, react-native-vector-icons/MaterialIcons, ../../../Themes/Imagepath, ../../CMERequirement/ProfessionDropdown, ../../HomePage/GuestUser.styles, ./GuestUserShared
 */

import React, { memo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Imagepath from '../../../../Themes/Imagepath';
import ProfessionDropdown from '../../../CMERequirement/ProfessionDropdown';
import styles from '../../GuestUser.styles';
import { MembershipBanner, SectionTitle, StatsGrid, TagChip } from './GuestUserShared';

/**
 * Description: Profession and state requirement input panel.
 * Purpose: Keeps the guest requirement call-to-action isolated from the page container.
 */
const GuestRequirementsPanelComponent = ({
  isHomeLoading,
  selectedProfession,
  handleProfessionSelect,
  selectedState,
  handleStateSelect,
  stateList,
  isUsaUser,
}) => {
  if (isHomeLoading || isUsaUser === false) return null;

  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Tell Us Your Profession & Specialty</Text>
      <Text style={styles.panelSubTitle}>Let us tailor the best courses for you</Text>
      <View style={styles.requirementsCard}>
        <View style={styles.requirementsHeader}>
          <View style={styles.requirementsIconWrap}>
            <Image source={Imagepath.CreditValut} style={localStyles.requirementsIconImage} />
          </View>
          <View style={styles.requirementsHeaderText}>
            <Text style={styles.requirementsTitle}>CME Requirements</Text>
            <Text style={styles.requirementsSubtitle}>Input your state specific CE requirements</Text>
          </View>
        </View>
        <ProfessionDropdown
          selectedProfession={selectedProfession}
          onSelectProfession={handleProfessionSelect}
          selectedState={selectedState}
          onSelectState={stateObj => handleStateSelect(stateObj, 'profile')}
          statesList={stateList}
        />
      </View>
    </View>
  );
};

/**
 * Description: Specialty chip section.
 * Purpose: Displays specialty shortcuts and preserves existing navigation flow.
 */
const GuestSpecialitySectionComponent = ({
  navigation,
  width,
  specialityItems,
  specialityColumns,
}) => {
  const [activeSpecialty, setActiveSpecialty] = useState(0);
  if (!specialityItems.length) return null;

  return (
    <>
      <SectionTitle
        title="Specialities"
        action="View all"
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScrollContent}>
        {specialityColumns.map((column, columnIndex) => (
          <View key={`speciality-column-${columnIndex}`} style={styles.chipColumn}>
            {column.map(item => (
              <TagChip
                key={`${item.label}-${item.index}`}
                label={item.label}
                active={item.index === activeSpecialty}
                width={width}
                onPress={() => {
                  setActiveSpecialty(item.index);
                  navigation.navigate('Globalresult', {
                    trig: {
                      trig: item.label.toLowerCase().replace(/\s+/g, '-'),
                      rqstType: 'specialityconferences',
                      mainKey: 'conference_specialitiy',
                      CreditData: '',
                      Realback: 'cont',
                    },
                  });
                }}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  );
};

/**
 * Description: Marketplace summary section.
 * Purpose: Displays marketplace stats and prime membership banner together.
 */
const GuestMarketplaceSectionComponent = ({ width, stats, navigation }) => (
  <>
    <View style={styles.marketHeader}>
      <Text style={styles.marketTitle}>World&apos;s Largest CME/CE Marketplace</Text>
    </View>
    <StatsGrid width={width} stats={stats} />
    <MembershipBanner
      width={width}
      onPress={() => navigation.navigate('CheckMembership', { fromGuestUser: true })}
    />
  </>
);

export const GuestRequirementsPanel = memo(GuestRequirementsPanelComponent);
export const GuestSpecialitySection = memo(GuestSpecialitySectionComponent);
export const GuestMarketplaceSection = memo(GuestMarketplaceSectionComponent);

const localStyles = StyleSheet.create({
  requirementsIconImage: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
});
