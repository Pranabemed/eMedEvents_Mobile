/**
 * Login screen styles.
 *
 * Holds the external stylesheet for the login flow.
 */

import { StyleSheet, Platform } from 'react-native';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';

/**
 * Login screen styles.
 *
 * @type {ReturnType<typeof StyleSheet.create>}
 */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colorpath.Pagebg,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colorpath.Pagebg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? normalize(16) : normalize(24),
    paddingBottom: normalize(60),
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? normalize(10) : normalize(16),
  },
  logoContainerIos: {},
  logoContainerAndroid: {},
  logoImage: {
    alignSelf: 'center',
    height: normalize(42),
    width: normalize(215),
    resizeMode: 'contain',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(28),
    marginBottom: normalize(28),
    paddingHorizontal: normalize(20),
  },
  headerText: {
    fontFamily: Fonts.InterBold,
    fontSize: normalize(24),
    lineHeight: normalize(30),
    color: '#0F172A',
    textAlign: 'center',
  },
  subHeaderText: {
    marginTop: normalize(6),
    color: '#64748B',
    fontSize: normalize(13.5),
    lineHeight: normalize(19),
    fontFamily: Fonts.InterRegular,
    textAlign: 'center',
  },
  sectionContainer: {
    paddingHorizontal: normalize(20),
    paddingTop: normalize(6),
    paddingBottom: normalize(10),
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },
  formContainer: {
    flex: 1,
    paddingRight: normalize(0),
  },
  validationContainer: {
    bottom: normalize(10),
  },
  validationText: {
    fontFamily: Fonts.InterRegular,
    fontSize: 12,
    color: 'red',
  },
  forgotContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: normalize(4),
  },
  forgotContainerOffset: {
    marginBottom: normalize(4),
  },
  forgotText: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(13),
    color: Colorpath.ButtonColr,
  },
  buttonWrapper: {
    paddingHorizontal: normalize(20),
    marginTop: normalize(8),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: normalize(20),
  },
  footerText: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(13.5),
    color: '#334155',
  },
  footerLinkText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(13.5),
    color: Colorpath.ButtonColr,
  },
  guestButton: {
    marginTop: normalize(12),
    alignSelf: 'center',
    paddingVertical: normalize(6),
  },
  guestButtonText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(13.5),
    color: Colorpath.black,
  },
});

/**
 * Login.styles default export.
 *
 * @returns {*}
 */
export default styles;
