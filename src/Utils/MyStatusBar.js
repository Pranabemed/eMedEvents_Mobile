import React from 'react';
import { StatusBar } from 'react-native';
import propTypes from 'prop-types';

const MyStatusBar = ({ backgroundColor, barStyle, translucent = false, ...props }) => (
    <StatusBar
      translucent={translucent}
      backgroundColor={backgroundColor}
      barStyle={'dark-content'}
      hidden={false}
      animated={true}
      showHideTransition={'fade'}
      {...props}
    />
);

export default MyStatusBar;
MyStatusBar.propTypes = {
  backgroundColor: propTypes.string,
  barStyle: propTypes.string,
  translucent: propTypes.bool,
};
