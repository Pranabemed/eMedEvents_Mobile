import React from 'react';
import {StatusBar, Platform, StyleSheet} from 'react-native';
import propTypes from 'prop-types';
import Colors from '../Themes/Colorpath';
import normalize from '../Utils/Helpers/Dimen';
import { SafeAreaView } from 'react-native-safe-area-context';
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const MyStatusBar = ({backgroundColor, barStyle, ...props}) => (
  // <SafeAreaView style={Platform.OS === 'ios' && [{backgroundColor}]}>
    <StatusBar
      translucent={true}
      backgroundColor={backgroundColor}
      barStyle={'dark-content'}
      hidden={false}
      animated={true}
      showHideTransition ={'fade'}
    />
  // </SafeAreaView>
);

export default MyStatusBar;
MyStatusBar.propTypes = {
  backgroundColor: propTypes.string,
  barStyle: propTypes.string,
  height: propTypes.number,
  translucent: propTypes.bool,
};
const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});