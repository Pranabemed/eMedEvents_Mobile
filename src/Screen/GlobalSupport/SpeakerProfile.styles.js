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
 */
export const speakerProfileTagsStyles = {
  b: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 14,
    color: '#0F172A',
    marginVertical: 0,
  },
  strong: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 14,
    color: '#0F172A',
    marginVertical: 0,
  },
  p: {
    fontFamily: Fonts.InterRegular,
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 20,
    marginVertical: 2,
  },
  ul: {
    fontFamily: Fonts.InterRegular,
    fontSize: 13.5,
    color: '#334155',
    marginVertical: 2,
  },
  li: {
    fontFamily: Fonts.InterRegular,
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 19,
    marginVertical: 1,
  },
};

/**
 * Speaker profile styles.
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
    marginTop: normalize(12),
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: normalize(14),
    marginVertical: normalize(6),
    borderRadius: normalize(14),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: normalize(16),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    height: normalize(64),
    width: normalize(64),
    borderRadius: normalize(32),
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
    overflow: 'hidden',
  },
  avatarImage: {
    height: normalize(64),
    width: normalize(64),
    borderRadius: normalize(32),
  },
  avatarFallbackText: {
    fontFamily: Fonts.InterBold,
    fontSize: 22,
    color: Colorpath.ButtonColr,
  },
  profileContent: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: normalize(4),
  },
  nameText: {
    fontFamily: Fonts.InterBold,
    fontSize: 17.5,
    color: '#0F172A',
    lineHeight: 23,
    flexShrink: 1,
  },
  subtitleText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginTop: normalize(2),
    flexShrink: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(4),
    gap: normalize(4),
    flexShrink: 1,
  },
  locationIcon: {
    height: normalize(13),
    width: normalize(13),
    resizeMode: 'contain',
    tintColor: '#64748B',
  },
  locationText: {
    fontFamily: Fonts.InterRegular,
    fontSize: 12.5,
    color: '#64748B',
    flexShrink: 1,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: normalize(12),
  },
  aboutContainer: {
    marginTop: normalize(2),
    width: '100%',
    overflow: 'hidden',
    paddingHorizontal: normalize(2),
  },
  aboutHeading: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 13.5,
    color: '#0F172A',
    marginBottom: normalize(4),
  },
  aboutReadMoreButton: {
    alignSelf: 'flex-start',
    marginTop: normalize(8),
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(8),
    backgroundColor: '#EFF6FF',
    borderRadius: normalize(6),
  },
  aboutReadMoreText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 12.5,
    color: Colorpath.ButtonColr,
  },
  sectionHeadingWrapper: {
    paddingHorizontal: normalize(14),
    marginTop: normalize(14),
    marginBottom: normalize(8),
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionAccent: {
    width: normalize(3.5),
    height: normalize(16),
    borderRadius: normalize(2),
    backgroundColor: Colorpath.ButtonColr,
    marginRight: normalize(8),
  },
  sectionHeadingText: {
    fontFamily: Fonts.InterBold,
    fontSize: 15,
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  sectionSubheadingText: {
    fontFamily: Fonts.InterRegular,
    fontSize: 12.5,
    color: '#64748B',
    marginTop: normalize(2),
  },
  conferenceList: {
    paddingBottom: normalize(16),
  },
  conferenceCardTouch: {
    marginHorizontal: normalize(14),
    marginVertical: normalize(5),
  },
  conferenceCardBody: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: normalize(14),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  conferenceTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(3),
    borderRadius: normalize(6),
    marginBottom: normalize(8),
    gap: normalize(5),
  },
  conferenceTypeIcon: {
    height: normalize(13),
    width: normalize(13),
    resizeMode: 'contain',
    tintColor: Colorpath.ButtonColr,
  },
  conferenceTypeText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 12,
    color: Colorpath.ButtonColr,
  },
  conferenceTitle: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 21,
    marginBottom: normalize(6),
    flexShrink: 1,
  },
  conferenceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(4),
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataIcon: {
    height: normalize(13),
    width: normalize(13),
    resizeMode: 'contain',
    tintColor: '#64748B',
  },
  metadataText: {
    fontFamily: Fonts.InterRegular,
    fontSize: 12.5,
    color: '#64748B',
    marginLeft: normalize(5),
    flexShrink: 1,
  },
  emptyStateWrapper: {
    alignItems: 'center',
    marginTop: normalize(20),
    paddingHorizontal: normalize(14),
    paddingBottom: normalize(40),
  },
  emptyStateCard: {
    width: '100%',
    borderRadius: normalize(12),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(20),
    alignItems: 'center',
  },
  emptyStateContent: {
    width: '100%',
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: Fonts.InterRegular,
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  viewAllButton: {
    marginHorizontal: normalize(14),
    marginTop: normalize(6),
    marginBottom: normalize(40),
    height: normalize(44),
    borderRadius: normalize(10),
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 14.5,
    color: Colorpath.ButtonColr,
  },
});

/**
 * Speaker profile.styles default export.
 *
 * @returns {*}
 */
export default styles;
