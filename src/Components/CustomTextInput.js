import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import Colorpath from '../Themes/Colorpath';
import normalize from '../Utils/Helpers/Dimen';
import Fonts from '../Themes/Fonts';
import Dropdown from 'react-native-vector-icons/MaterialCommunityIcons'
import { useIsFocused } from '@react-navigation/native';

const CustomInputWithDropdown = ({inputdata,setInputdata,texdt,setTextdt}) => {
  const isFocus = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  // const [contextText, setContextText] = useState('Select Time');

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
useEffect(()=>{
  setInputdata("Select Time")
},[isFocus])
  const handleOptionSelect = (option) => {
    // setContextText(option);
    toggleModal();
    setInputdata(option)
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter number"
          keyboardType="phone-pad"
          maxLength={3}
          value={texdt}
          onChangeText={(val)=>{setTextdt(val)}}
        />
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={toggleModal}
        >
          <Text style={styles.dropdownButtonText}>{inputdata}</Text>
          <Dropdown
            name={modalVisible ? 'chevron-up' : 'chevron-down'} 
            size={24}
            color="#fff"
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => handleOptionSelect('Minutes')}
              style={styles.modalItem}
            >
              <Text style={styles.modalItemText}>Minutes Before</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleOptionSelect('Hours')}
              style={styles.modalItem}
            >
              <Text style={styles.modalItemText}>Hours Before</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    height: normalize(50),
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 10,
    width: normalize(145),
    borderRadius: 10,
    color: '#000000',
    fontSize: 14,
    fontFamily: Fonts.InterSemiBold,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colorpath.ButtonColr,
    borderRadius: 5,
    height: normalize(50),
    width: normalize(145),
    paddingHorizontal: 10,
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.InterSemiBold,
    flex: 1,
    textAlign: 'center', 
  },
  dropdownIcon: {
    marginLeft: 10, 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalItem: {
    padding: 10,
  },
  modalItemText: {
    fontSize: 18,
  },
});

export default CustomInputWithDropdown;
