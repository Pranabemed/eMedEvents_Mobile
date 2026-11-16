/**
 * Sign up screen styles.
 *
 * Holds the external stylesheet for the sign up flow.
 */

import { StyleSheet, Platform } from 'react-native';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';

/**
 * Sign up screen styles.
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
  },
  scrollContent: {
    paddingBottom: normalize(60),
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? normalize(18) : normalize(24),
  },
  logoContainerIos: {},
  logoContainerAndroid: {},
  logoImage: {
    alignSelf: 'center',
    height: normalize(40),
    width: normalize(212),
    resizeMode: 'contain',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(18),
    marginBottom: normalize(4),
  },
  headerText: {
    fontFamily: Fonts.InterBold,
    fontSize: normalize(20),
    lineHeight: normalize(24),
    color: '#000000',
    textAlign: 'center',
  },
  subHeaderText: {
    marginTop: normalize(6),
    color: '#64748B',
    fontSize: normalize(13),
    lineHeight: normalize(18),
    fontFamily: Fonts.InterRegular,
    textAlign: 'center',
  },
  sectionContainer: {
    paddingHorizontal: normalize(20),
    paddingTop: normalize(6),
    paddingBottom: normalize(10),
  },
  inputRow: {
    flexDirection: 'row',
    flex: 1,
  },
  inputColumn: {
    flex: 1,
    paddingRight: normalize(0),
  },
  validationContainer: {
    paddingHorizontal: normalize(1),
    bottom: normalize(10),
  },
  validationText: {
    fontFamily: Fonts.InterRegular,
    fontSize: 12,
    color: 'red',
  },
  termsContainer: {
    paddingHorizontal: normalize(20),
    marginTop: normalize(4),
  },
  termsRow: {
    flexDirection: 'row',
  },
  termsInnerRow: {
    flexDirection: 'row',
    gap: normalize(10),
  },
  checkboxChecked: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colorpath.ButtonColr,
    borderColor: Colorpath.ButtonColr,
    height: normalize(20),
    width: normalize(20),
    borderRadius: normalize(5),
    marginTop: normalize(5),
    borderWidth: normalize(0.5),
  },
  checkboxEmpty: {
    height: normalize(20),
    width: normalize(20),
    borderColor: Colorpath.black,
    borderRadius: normalize(5),
    marginTop: normalize(5),
    borderWidth: normalize(0.5),
  },
  consentColumn: {
    flexDirection: 'column',
  },
  consentText: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
    color: '#666666',
  },
  consentLinksRow: {
    flexDirection: 'row',
    gap: 10,
  },
  consentLinkText: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12.5),
    color: Colorpath.ButtonColr,
  },
  consentBodyText: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12.5),
    color: '#666666',
  },
  optInRow: {
    flexDirection: 'row',
    marginTop: normalize(15),
  },
  optInText: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
    color: '#666666',
  },
  optInTextContainer: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    paddingHorizontal: normalize(20),
    marginTop: normalize(10),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: normalize(14),
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
    fontWeight: 'bold',
  },
});

/**
 * Sign up.styles default export.
 *
 * @returns {*}
 */
export default styles;
