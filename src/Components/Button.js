/**
 * Button reusable component module. Provides a React Native UI building block used across screens.
 */

import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import propstype from 'prop-types';
import Colorpath from '../Themes/Colorpath';
import ArrowNeed from 'react-native-vector-icons/Feather';
import { createButtonStyles } from './Button.styles';

/**
 * Reusable Button component that supports text, icons, and loading states.
 * 
 * **Purpose:** Provide a customizable, interactive button for the application, supporting various visual styles, loading states, and icon configurations.
 * 
 * **Parameters:**
 * @param {Object} props - The component props.
 * @param {number} props.height - The height of the button.
 * @param {number} props.width - The width of the button.
 * @param {number} props.borderRadius - The border radius.
 * @param {string} props.backgroundColor - The background color.
 * @param {string} props.color - The text color.
 * @param {string} props.text - The text to display inside the button.
 * @param {Function} props.onPress - Callback executed when the button is pressed.
 * @param {boolean} props.loading - If true, displays a loading indicator instead of text/icon.
 * @param {boolean} props.disabled - If true, the button is disabled.
 * @param {boolean} props.image - If true, displays an icon (requires `source` prop).
 * @param {string} props.source - The icon name for `react-native-vector-icons/Feather`.
 * 
 * **Return Value:**
 * @returns {JSX.Element} A React Native TouchableOpacity containing either an ActivityIndicator, an Icon, or Text.
 * 
 * **Throws:** None
 * 
 * **Example Usage:**
 * ```jsx
 * <Buttons 
 *   text="Submit" 
 *   backgroundColor="#009E38" 
 *   color="#FFF" 
 *   onPress={() => console.log('Pressed')} 
 * />
 * ```
 * 
 * **Notes:**
 * - The component automatically applies `activeOpacity={0.8}`.
 * - Icon support requires `react-native-vector-icons/Feather`.
 */
export default function Buttons(props) {
  const styles = createButtonStyles(props);

  return (
    <TouchableOpacity
      onPress={() => props?.onPress()}
      disabled={props.disabled}
      activeOpacity={0.8}
      style={styles.button}>

      {props.image && !props.loading && (
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={()=>props?.iconPress()} style={styles.iconButton}>
            <ArrowNeed name={props.source} color="#FFFFFF" size={props.size} />
          </TouchableOpacity>
        </View>
      )}
      {props.loading ? <ActivityIndicator size={"small"} color={props.loaderColor ? props.loaderColor : Colorpath.white} />
        : <Text style={styles.label}>
          {props.text}
        </Text>}
    </TouchableOpacity>
  );
}
Buttons.propstype = {
  height: propstype.number,
  width: propstype.number,
  borderRadius: propstype.number,
  backgroundColor: propstype.string,
  marginTop: propstype.number,
  color: propstype.string,
  imarginRight:propstype.number,
  marginLeft: propstype.number,
  borderWidth: propstype.number,
  borderColor: propstype.string,
  borderTopWidth: propstype.number,
  fontSize: propstype.number,
  fontFamily: propstype.string,
  text: propstype.string,
  onPress: propstype.func,
  marginBottom: propstype.number,
  image: propstype.bool,
  right: propstype.number,
  left: propstype.number,
  iheight: propstype.number,
  size:propstype.number,
  iwidth: propstype.number,
  tintColor: propstype.string,
  textAlign: propstype.string,
  alignSelf: propstype.string,
  borderBottomLeftRadius: propstype.number,
  borderBottomRightRadius: propstype.number,
  shadowOpacity: propstype.number,
  shadowRadius: propstype.number,
  shadowOffset: propstype.number,
  shadowColor: propstype.string,
  elevation: propstype.number,
  transform: propstype.array,
  disabled: propstype.bool,
  iconPress:propstype.func

};
