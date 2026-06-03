/**
 * File Name: ProfessionDropdown.js
 * Module: CME Requirement
 * Purpose: Provides profession and state selectors for the CME requirement screen.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, react-native, react-native-vector-icons/MaterialIcons, react-native-safe-area-context, ../../Themes/Colorpath, ../../Themes/Fonts, ../../Utils/Helpers/Dimen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Description: Profession and state dropdown component.
 * Purpose: Lets the user change requirement context without leaving the CME requirement screen.
 *
 * Purpose:
 * Provides dual selectors for profession and state using modal-based pickers.
 *
 * Props:
 * 1. `selectedProfession`
 * 2. `onSelectProfession`
 * 3. `selectedState`
 * 4. `onSelectState`
 * 5. `statesList`
 *
 * State:
 * 1. Profession modal visibility
 * 2. State modal visibility
 * 3. State search text
 *
 * Events:
 * 1. Open/close profession modal
 * 2. Open/close state modal
 * 3. Search states
 * 4. Select profession/state
 *
 * Dependencies:
 * `MaterialIcons`, `SafeAreaView`
 *
 * Usage Example:
 * `<ProfessionDropdown {...props} />`
 *
 * Params:
 * @param {Object} props
 * @param {string} props.selectedProfession
 * @param {Function} props.onSelectProfession
 * @param {Object} props.selectedState
 * @param {Function} props.onSelectState
 * @param {Array} props.statesList
 *
 * Returns:
 * @returns {JSX.Element}
 *
 * Flow:
 * 1. Render profession and state selector triggers.
 * 2. Open dedicated modal for each selector.
 * 3. Filter states by search text and return selection to parent.
 *
 * API Used:
 * None directly; consumes parent-provided states list.
 *
 * Redux Actions:
 * None
 *
 * Error Handling:
 * Safely handles empty states list and missing display fields.
 */
const ProfessionDropdown = ({
  selectedProfession,
  onSelectProfession,
  selectedState,
  onSelectState,
  statesList,
}) => {
  const [profModalVisible, setProfModalVisible] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [stateSearch, setStateSearch] = useState('');

  const professions = ['Physician', 'Nursing', 'Dentist', 'Pharmacist'];

  const filteredStates = (statesList || []).filter(item => {
    const name = String(item?.name || item?.state_name || item?.title || '').toLowerCase();
    return name.includes(stateSearch.toLowerCase().trim());
  });

  /**
   * Description: Resolves state display name from supported payload shapes.
   * Purpose: Centralizes state label fallbacks for dropdown and list rendering.
   *
   * Params:
   * @param {Object} item
   *
   * Returns:
   * @returns {string}
   *
   * Flow:
   * 1. Read possible state-name fields.
   * 2. Return first valid value.
   * 3. Fall back to empty string.
   *
   * API Used:
   * None
   *
   * Redux Actions:
   * None
   *
   * Error Handling:
   * Uses fallback text for incomplete objects.
   */
  const getStateName = item => item?.name || item?.state_name || item?.title || '';

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownHalf}
        activeOpacity={0.7}
        onPress={() => setProfModalVisible(true)}
      >
        <View style={styles.dropdownTextContainer}>
          <Text style={styles.label}>Profession</Text>
          <Text numberOfLines={1} style={styles.value}>
            {selectedProfession || 'Select Profession'}
          </Text>
        </View>
        <Icon
          name="keyboard-arrow-down"
          style={styles.dropdownIcon}
          size={normalize(20)}
          color="#4B5563"
        />
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.dropdownHalf}
        activeOpacity={0.7}
        onPress={() => {
          setStateSearch('');
          setStateModalVisible(true);
        }}
      >
        <View style={styles.dropdownTextContainer}>
          <Text style={styles.label}>State</Text>
          <Text numberOfLines={1} style={styles.value}>
            {getStateName(selectedState) || 'Select State'}
          </Text>
        </View>
        <Icon
          name="keyboard-arrow-down"
          style={styles.dropdownIcon}
          size={normalize(20)}
          color="#4B5563"
        />
      </TouchableOpacity>

      <Modal visible={profModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setProfModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Profession</Text>
            {professions.map(prof => (
              <TouchableOpacity
                key={prof}
                style={styles.modalItem}
                onPress={() => {
                  onSelectProfession(prof);
                  setProfModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    selectedProfession === prof && styles.selectedItemText,
                  ]}
                >
                  {prof}
                </Text>
                {selectedProfession === prof ? (
                  <Icon name="check" size={normalize(18)} color={Colorpath.ButtonColr} />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={stateModalVisible} transparent animationType="slide">
        <SafeAreaView style={styles.stateModalContainer}>
          <View style={styles.stateModalHeader}>
            <TouchableOpacity
              onPress={() => {
                setStateModalVisible(false);
                setStateSearch('');
              }}
              style={styles.backButton}
            >
              <Icon name="close" size={normalize(24)} color="#333333" />
            </TouchableOpacity>
            <Text style={styles.stateModalTitle}>Select State</Text>
            <View style={{ width: normalize(24) }} />
          </View>

          <View style={styles.searchBarContainer}>
            <Icon
              name="search"
              size={normalize(20)}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search State"
              placeholderTextColor="#9CA3AF"
              value={stateSearch}
              onChangeText={setStateSearch}
            />
            {stateSearch.length > 0 ? (
              <TouchableOpacity onPress={() => setStateSearch('')}>
                <Icon name="clear" size={normalize(20)} color="#9CA3AF" />
              </TouchableOpacity>
            ) : null}
          </View>

          <FlatList
            data={filteredStates}
            keyExtractor={(item, index) => String(item?.id ?? item?.state_id ?? index)}
            contentContainerStyle={styles.stateList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={styles.emptyText}>No states found</Text>}
            renderItem={({ item }) => {
              const name = getStateName(item);
              return (
                <TouchableOpacity
                  style={styles.stateItem}
                  onPress={() => {
                    onSelectState(item);
                    setStateModalVisible(false);
                    setStateSearch('');
                  }}
                >
                  <Text style={styles.stateItemText}>{name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: '#D9E2EC',
    height: normalize(50),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(12),
    padding: 10,
    width: '100%',
  },
  dropdownHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '90%',
    paddingHorizontal: normalize(0),
  },
  dropdownTextContainer: {
    width: '90%',
  },
  dropdownIcon: {
    alignSelf: 'center',
    marginTop: normalize(5),
  },
  label: {
    fontFamily: Fonts.InterRegular,
    fontSize: 11,
    color: '#94A3B8',
  },
  value: {
    fontFamily: Fonts.InterMedium,
    fontSize: 11,
    color: '#2C4DB9',
    width: '100%',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E2E8F0',
    marginHorizontal: normalize(17),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    padding: normalize(20),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(16),
    color: '#111827',
    fontWeight: 'bold',
    marginBottom: normalize(15),
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemText: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(14),
    color: '#374151',
  },
  selectedItemText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  stateModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stateModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(14),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: normalize(4),
  },
  stateModalTitle: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(18),
    color: '#111827',
    fontWeight: 'bold',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: normalize(8),
    marginHorizontal: normalize(16),
    marginVertical: normalize(12),
    paddingHorizontal: normalize(12),
    height: normalize(44),
  },
  searchIcon: {
    marginRight: normalize(8),
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(14),
    color: '#111827',
    padding: 0,
  },
  stateList: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(20),
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(14),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stateItemText: {
    fontFamily: Fonts.InterRegular,
    fontSize: 16,
    color: '#374151',
  },
  emptyText: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(14),
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: normalize(20),
  },
});

export default ProfessionDropdown;
