/**
 * Loader style module.
 *
 * Provides reusable overlay and content styles for the shared loading helper.
 */

import { StyleSheet, Dimensions } from 'react-native';
import normalize from '../Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';

/**
 * Screen height value.
 * @returns {*}
 */
const screenHeight = Dimensions.get('screen').height;

/**
 * Shared loader styles.
 *
 * @type {ReturnType<typeof StyleSheet.create>}
 */
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    backgroundColor: Colorpath.Pagebg,
    zIndex: 1000001,
    top: 0,
    left: 0,
    height: screenHeight,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
  overlayModal: {
    height: '133%',
    width: '116.5%',
    borderRadius: normalize(15),
  },
  loaderBox: {
    height: normalize(80),
    width: normalize(80),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colorpath.Pagebg,
  },
  loaderImage: {
    height: normalize(50),
    width: normalize(50),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

/**
 * Loader.styles default export.
 *
 * @returns {*}
 */
export default styles;
