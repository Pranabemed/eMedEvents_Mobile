import React from 'react';
import { TouchableOpacity, Text, View, Image, ActivityIndicator } from 'react-native';
import propstype from 'prop-types';
import normalize from '../Utils/Helpers/Dimen';
import Colorpath from '../Themes/Colorpath';
import ArrowNeed from 'react-native-vector-icons/Feather';
export default function Buttons(props) {
  return (
    <TouchableOpacity
      onPress={() => props?.onPress()}
      disabled={props.disabled}
      activeOpacity={0.8}
      style={{
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
        alignSelf: props.alignSelf ? props.alignSelf : 'center',
        marginBottom: props.marginBottom,
        borderBottomLeftRadius: props.borderBottomLeftRadius,
        borderBottomRightRadius: props.borderBottomRightRadius,
        shadowOpacity: props.shadowOpacity,
        shadowRadius: props.shadowRadius,
        shadowOffset: props.shadowOffset,
        shadowColor: props.shadowColor,
        elevation: props.elevation,
      }}>

      {props.image && !props.loading && (
        <View style={{ position: 'absolute', justifyContent: "center", alignItems: "center", marginLeft: props.imageMarginLeft  }}>
          <TouchableOpacity onPress={()=>props?.iconPress()}>
            <ArrowNeed name={props.source} color="#FFFFFF" size={props.size} />
            {/* <Image source={props.source} style={{ resizeMode: 'contain', height: props.iheight, width: props.iwidth, tintColor: props.tintColor, transform: props.transform }} /> */}
          </TouchableOpacity>
        </View>
      )}
      {props.loading ? <ActivityIndicator size={"small"} color={props.loaderColor ? props.loaderColor : Colorpath.white} />
        : <Text style={{fontSize: props.fontSize, color: props.color, textAlign: props.textAlign ? props.textAlign : 'center',fontWeight:props.fontWeight, fontFamily: props.fontFamily, paddingLeft: props.paddingLeft ? props.paddingLeft : null,marginRight:props.imarginRight }}>
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