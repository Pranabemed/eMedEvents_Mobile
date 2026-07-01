/**
 * Button style module.
 *
 * Defines reusable button, icon, and label styles for the shared button
 * component.
 */

import { StyleSheet } from 'react-native';
import Colorpath from '../Themes/Colorpath';

/**
 * Creates button styles from the current props.
 *
 * @param {Object} props - Button props used to derive the style values.
 * @returns {ReturnType<typeof StyleSheet.create>} Button style map.
 */
export const createButtonStyles = props =>
  StyleSheet.create({
    button: {
      height: props.height,
      width: props.width,
      borderRadius: props.borderRadius,
      backgroundColor: props.backgroundColor,
      marginTop: props.marginTop,
      marginLeft: props.marginLeft,
      borderWidth: props.borderWidth,
      borderColor: props.borderColor,
      borderTopWidth: props.borderTopWidth,
      justifyContent: 'center',
      alignSelf: props.alignSelf || 'center',
      marginBottom: props.marginBottom,
      borderBottomLeftRadius: props.borderBottomLeftRadius,
      borderBottomRightRadius: props.borderBottomRightRadius,
      shadowOpacity: props.shadowOpacity,
      shadowRadius: props.shadowRadius,
      shadowOffset: props.shadowOffset,
      shadowColor: props.shadowColor,
      elevation: props.elevation,
    },
    iconContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: props.imageMarginLeft,
    },
    iconButton: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      fontSize: props.fontSize,
      color: props.color,
      textAlign: props.textAlign || 'center',
      fontWeight: props.fontWeight,
      fontFamily: props.fontFamily,
      paddingLeft: props.paddingLeft || null,
      marginRight: props.imarginRight,
    },
    loader: {
      color: props.loaderColor || Colorpath.white,
    },
  });
