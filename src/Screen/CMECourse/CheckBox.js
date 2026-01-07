import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Install if not already: npm install react-native-vector-icons

const CustomCheckBox = ({ selected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.checkBox,
        { backgroundColor: selected ? '#4caf50' : '#fff', borderColor: selected ? '#4caf50' : '#ccc' },
      ]}
    >
      {selected && <Icon name="check" size={18} color="#fff" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomCheckBox;
