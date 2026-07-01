/**
 * Loader utility module. Collects reusable helper functions and constants for shared application behavior.
 */

import React from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './Loader.styles';

/**
 * Loader default export.
 *
 * @returns {*}
 */
export default function Loader(props) {
  return props.visible ? (
    <View style={[styles.overlay, props.modal === true ? styles.overlayModal : null]}>
      <View style={styles.loaderBox}>
{/* <ActivityIndicator size={"large"} color={"black"}/> */}
        <Image source={require('../../Assets/Images/gifemed.gif')} style={styles.loaderImage} />
      </View>
    </View>
  ) : null;
}

Loader.propTypes = {
  visible: PropTypes.bool,
  modal: PropTypes.bool,
};

Loader.defaultProps = {
  modal: false,
  visible: false,
};
