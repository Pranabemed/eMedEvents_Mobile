// CustomRadioButton.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import normalize from '../Utils/Helpers/Dimen';
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

export default CustomRadioButton;
