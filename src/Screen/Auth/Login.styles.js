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
    paddingBottom: normalize(80),
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainerIos: {
    top: normalize(10),
  },
  logoContainerAndroid: {
    top: normalize(40),
  },
  logoImage: {
    alignSelf: 'center',
    height: normalize(40),
    width: normalize(212),
    resizeMode: 'contain',
  },
  sectionContainer: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(15),
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? normalize(50) : normalize(80),
  },
  headerText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 32,
    color: '#000000',
    fontWeight: 'bold',
  },
  subHeaderText: {
    marginTop: normalize(10),
    color: '#666666',
    fontSize: 18,
    fontFamily: Fonts.InterRegular,
    textAlign: 'center',
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
    alignSelf: 'center',
    width: normalize(280),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotContainerOffset: {
    bottom: normalize(5),
  },
  forgotText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
    color: Colorpath.ButtonColr,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 1,
    marginTop: normalize(10),
  },
  footerText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    color: '#000000',
  },
  footerLinkText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    color: Colorpath.ButtonColr,
    fontWeight: 'bold',
  },
  guestButton: {
    marginTop: normalize(15),
    alignSelf: 'center',
  },
  guestButtonText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 16,
    color: Colorpath.black,
    fontWeight: 'bold',
  },
});

/**
 * Login.styles default export.
 *
 * @returns {*}
 */
export default styles;
