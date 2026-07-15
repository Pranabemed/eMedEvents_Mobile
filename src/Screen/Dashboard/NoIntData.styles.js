/**
 * Dashboard no-internet data screen styles.
 *
 * Provides the screen, safe area, header, logo, and scroll container styles used by the dashboard fallback screen.
 * Exported members: screen, safeArea, androidHeader, iosHeader, logo, scrollContent.
 */

import { StyleSheet } from 'react-native';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colorpath.Pagebg,
  },
  androidHeader: {
    marginTop: normalize(0),
    paddingHorizontal: normalize(6),
  },
  iosHeader: {
    paddingHorizontal: normalize(10),
  },
  logo: {
    height: normalize(40),
    width: normalize(40),
  },
  scrollContent: {
    paddingBottom: normalize(90),
  },
});

/**
 * No int data.styles default export.
 *
 * @returns {*}
 */
export default styles;
