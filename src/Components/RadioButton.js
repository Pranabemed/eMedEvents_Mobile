/**
 * Radio button reusable component module. Provides a React Native UI building block used across screens. Exported members: CustomRadioButton, styles.
 */

// CustomRadioButton.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import normalize from '../Utils/Helpers/Dimen';

/**
 * Reusable CustomRadioButton component.
 * 
 * **Purpose:** Renders a customizable radio button with a label, reflecting selected state.
 * 
 * **Parameters:**
 * @param {Object} props - The component props.
 * @param {boolean} props.selected - Whether the radio button is currently selected.
 * @param {Function} props.onPress - Callback executed when the radio button is pressed.
 * @param {string} props.label - The text label displayed next to the radio button.
 * 
 * **Return Value:**
 * @returns {JSX.Element} A React Native TouchableOpacity containing a stylized radio circle and a text label.
 * 
 * **Throws:** None
 * 
 * **Example Usage:**
 * ```jsx
 * <CustomRadioButton 
 *   label="Option 1" 
 *   selected={isSelected} 
 *   onPress={() => setIsSelected(true)} 
 * />
 * ```
 * 
 * **Notes:**
 * - The selected state changes the border and fill color to `#2C4DB9`.
 */
const CustomRadioButton = ({ selected, onPress, label }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.radioCircle, selected && styles.selectedCircle]}>
        {selected && <View style={styles.selectedDot} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:normalize(85)
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom:10
  },
  selectedCircle: {
    borderColor: '#2C4DB9',
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2C4DB9',
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
});

/**
 * Radio button default export.
 *
 * @returns {*}
 */
export default CustomRadioButton;
