/**
 * Dashboard header search input styles.
 *
 * Defines the wrapper, card, and label styles used by the dashboard search prompt.
 * Exported members: searchWrapper, searchWrapperIos, searchWrapperAndroid, searchWrapperIosCompact, searchWrapperAndroidCompact, searchCard, searchText.
 */

import { StyleSheet } from 'react-native';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
  searchWrapper: {
    backgroundColor: '#FFFFFF',
  },
  searchWrapperIos: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),
    marginTop: normalize(10),
  },
  searchWrapperAndroid: {
    paddingVertical: normalize(10),
    marginTop: normalize(35),
  },
  searchWrapperIosCompact: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),
    marginTop: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrapperAndroidCompact: {
    paddingVertical: normalize(10),
    marginTop: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchCard: {
    height: normalize(35),
    width: normalize(290),
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: normalize(5),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafc',
    gap: normalize(10),
    paddingHorizontal: normalize(10),
  },
  searchText: {
    flex: 1,
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    color: '#798492',
  },
});

/**
 * Handle text input.styles default export.
 *
 * @returns {*}
 */
export default styles;
