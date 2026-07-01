/**
 * Speaker profile screen styles.
 *
 * Defines layout, card, text, and empty-state styles for the speaker profile
 * screen and its nested conference card.
 */

import { StyleSheet } from 'react-native';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';

/**
 * RenderHTML tag styles for speaker bios.
 *
 * @type {{ b: Object, p: Object, ul: Object, li: Object }}
 */
export const speakerProfileTagsStyles = {
  b: {
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    color: '#333',
    marginVertical: 0,
  },
  p: {
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    color: '#000000',
    marginVertical: 0,
  },
  ul: {
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    color: '#000000',
    marginVertical: 0,
  },
  li: {
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    color: '#000000',
    marginVertical: 0,
  },
};

/**
 * Speaker profile styles.
 *
 * @type {ReturnType<typeof StyleSheet.create>}
 */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colorpath.Pagebg,
  },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
  },
  pageContent: {
    marginTop: normalize(30),
  },
  profileCard: {
    backgroundColor: Colorpath.white,
    margin: normalize(10),
    borderRadius: normalize(10),
  },
  avatarWrapper: {
    position: 'absolute',
    top: -normalize(33),
    left: normalize(15),
    zIndex: 1,
    height: normalize(70),
    width: normalize(70),
    borderRadius: normalize(35),
    backgroundColor: Colorpath.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarImage: {
    height: normalize(70),
    width: normalize(70),
  },
  avatarImageRadius: {
    borderRadius: normalize(35),
  },
  profileContent: {
    padding: normalize(13),
    marginTop: normalize(30),
    flexDirection: 'column',
  },
  nameText: {
    fontFamily: Fonts.InterBold,
    fontSize: 24,
    color: '#000000',
    lineHeight: normalize(24),
    fontWeight: 'bold',
  },
  subtitleText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    color: '#666',
    lineHeight: normalize(20),
  },
  locationRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: normalize(5),
    right: normalize(2),
  },
  locationIcon: {
    height: normalize(18),
    width: normalize(18),
    resizeMode: 'contain',
  },
  locationText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    width: normalize(300),
    backgroundColor: '#DDD',
    marginTop: normalize(10),
    right: normalize(13),
  },
  aboutContainer: {
    marginTop: normalize(10),
  },
  aboutReadMoreButton: {
    marginTop: normalize(5),
  },
  aboutReadMoreText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 16,
    color: Colorpath.ButtonColr,
  },
  sectionHeadingWrapper: {
    paddingHorizontal: normalize(13),
    marginTop: normalize(10),
    paddingVertical: normalize(5),
    flexDirection: 'column',
  },
  sectionHeadingText: {
    fontFamily: Fonts.InterBold,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000000',
  },
  sectionSubheadingText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 18,
    color: '#000000',
  },
  conferenceList: {
    paddingBottom: normalize(50),
  },
  emptyStateWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(25),
    paddingBottom: normalize(50),
  },
  emptyStateCard: {
    flexDirection: 'row',
    width: normalize(290),
    borderRadius: normalize(10),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),
    alignItems: 'center',
    borderStyle: 'dotted',
    borderWidth: 1,
  },
  emptyStateContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyStateText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 16,
    color: Colorpath.ButtonColr,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  viewAllButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(50),
  },
  viewAllText: {
    fontFamily: Fonts.InterBold,
    fontSize: 16,
    color: Colorpath.ButtonColr,
    fontWeight: 'bold',
  },
  conferenceCard: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(10),
  },
  conferenceCardBody: {
    flexDirection: 'column',
    width: normalize(290),
    borderRadius: normalize(10),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  conferenceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '106%',
  },
  conferenceTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  conferenceTitle: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    lineHeight: 20,
  },
  conferenceTypeRow: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: normalize(4),
  },
  conferenceTypeIcon: {
    height: normalize(15),
    width: normalize(15),
    tintColor: '#000000',
    resizeMode: 'contain',
  },
  conferenceTypeText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
    color: '#000000',
  },
  conferenceMetaRow: {
    justifyContent: 'space-between',
    alignContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: normalize(4),
  },
  metadataRow: {
    flexDirection: 'row',
  },
  metadataIcon: {
    height: normalize(15),
    width: normalize(15),
    resizeMode: 'contain',
  },
  metadataText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
    color: '#333',
    bottom: normalize(3),
    marginLeft: normalize(5),
  },
});

export default styles;
