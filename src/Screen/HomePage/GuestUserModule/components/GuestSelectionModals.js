/**
 * File Name: GuestSelectionModals.js
 * Module: Guest User
 * Purpose: Modal selectors for profession and state in the Guest User home screen.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, react-native, ../../HomePage/GuestUser.styles, ../utils/guestUserCore
 */

import React, { memo } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getStateName } from '../utils/guestUserCore';

/**
 * Reusable GuestSelectionModalsComponent component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

/**
 * Description: Guest user state/profession modal set.
 * Purpose: Preserves existing bottom-sheet and popup selection behavior outside the main content file.
 */
const GuestSelectionModalsComponent = ({
  profModalVisible,
  setProfModalVisible,
  stateModalVisible,
  setStateModalVisible,
  handleProfessionSelect,
  stateSearchText,
  setStateSearchText,
  filteredStateList,
  handleStateItemPress,
}) => (
  <>
    <Modal visible={profModalVisible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.profOverlay}
        onPress={() => setProfModalVisible(false)}
      >
        <View style={styles.profContent}>
          <Text style={styles.modalTitle}>Select Profession</Text>
          {['Physician', 'Nursing', 'Dentist', 'Pharmacist'].map(prof => (
            <TouchableOpacity
              key={prof}
              onPress={() => handleProfessionSelect(prof)}
              style={styles.profItem}
            >
              <Text style={styles.profItemText}>{prof}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>

    <Modal visible={stateModalVisible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.stateOverlay}
        onPress={() => setStateModalVisible(false)}
      >
        <Pressable style={styles.stateSheet}>
          <Text style={styles.modalTitle}>Select State</Text>
          <TextInput
            value={stateSearchText}
            onChangeText={setStateSearchText}
            placeholder="Search state"
            placeholderTextColor="#9CA3AF"
            style={styles.stateInput}
          />
          <FlatList
            data={filteredStateList}
            keyExtractor={(item, index) => String(item?.id ?? item?.state_id ?? item?.name ?? index)}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No states found</Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleStateItemPress(item)}
                style={styles.stateItem}
              >
                <Text style={styles.profItemText}>{getStateName(item)}</Text>
              </TouchableOpacity>
            )}
          />
        </Pressable>
      </TouchableOpacity>
    </Modal>
  </>
);

const styles = StyleSheet.create({
  profOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  profItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  profItemText: {
    fontSize: 16,
    color: '#333',
  },
  stateOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  stateSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    width: '100%',
    maxHeight: '78%',
  },
  stateInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: '#111827',
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 16,
  },
  stateItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
});

export const GuestSelectionModals = memo(GuestSelectionModalsComponent);
