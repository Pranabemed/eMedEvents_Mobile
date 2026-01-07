import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Ring from './RingSupport';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colorpath from '../../Themes/Colorpath';
import normalize from '.././../Utils/Helpers/Dimen';

const COLOR = Colorpath.ButtonColr;
const SIZE = 100;

const PhoneRing = ({isListening,stopListening,startListening,}) => {
  return (
    <View style={styles.container}>
      {isListening ? <View style={[styles.dot, styles.center]}>
        {[...Array(3).keys()].map((_, index) => (
          <Ring key={index} index={index} />
        ))}
       <TouchableOpacity  onPress={isListening ? stopListening : startListening}>
       <Icon name={isListening ?'mic':'mic-off'} size={44} color="#fff" />
       </TouchableOpacity>
      </View>:<View style={styles.notcenter}>
       <TouchableOpacity  onPress={isListening ? stopListening : startListening}>
       <Icon name={isListening ? 'mic':'mic-off'} size={44} color="#000" />
       </TouchableOpacity>
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: COLOR,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notcenter:{
    justifyContent:"center",
    alignItems:"center",
    height: normalize(80),
    width: normalize(80),
    borderRadius: normalize(80),
    backgroundColor: "#DADADA",
  }
});

export default PhoneRing;
