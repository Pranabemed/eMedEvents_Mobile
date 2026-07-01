/**
 * Ring screen module. Renders a React Native screen or a screen-scoped support component. Exported members: COLOR, SIZE, PhoneRing, styles.
 */

import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Ring from './RingSupport';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colorpath from '../../Themes/Colorpath';
import normalize from '.././../Utils/Helpers/Dimen';

/**
 * Reusable PhoneRing component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const COLOR = Colorpath.ButtonColr;
/**
 * Size constant.
 * @returns {number}
 */
const SIZE = 100;

/**
 * Phone ring component.
 * @param {Object} props - Input object.
 * @param {*} props.isListening - Nested property value.
 * @param {*} props.stopListening - Nested property value.
 * @param {*} props.startListening - Nested property value.
 * @returns {JSX.Element}
 */
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

/**
 * Styles value.
 * @returns {*}
 */
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

/**
 * Ring default export.
 *
 * @returns {*}
 */
export default PhoneRing;
