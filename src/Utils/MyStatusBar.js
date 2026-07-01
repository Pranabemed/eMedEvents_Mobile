/**
 * My status bar module. Contains application logic, configuration, or shared helpers. Exported members: MyStatusBar.
 */

import React from 'react';
import { StatusBar } from 'react-native';
import propTypes from 'prop-types';

/**
 * My status bar component.
 * @param {Object} props - Input object.
 * @param {*} props.backgroundColor - Nested property value.
 * @param {*} props.barStyle - Nested property value.
 * @param {*} props.translucent - Nested property value.
 * @returns {JSX.Element}
 */
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

/**
 * My status bar default export.
 *
 * @returns {*}
 */
export default MyStatusBar;
MyStatusBar.propTypes = {
  backgroundColor: propTypes.string,
  barStyle: propTypes.string,
  translucent: propTypes.bool,
};
