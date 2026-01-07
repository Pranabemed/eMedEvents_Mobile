import React from 'react';
import { ActivityIndicator, Dimensions, Image, View } from 'react-native';
import PropTypes from 'prop-types';
import normalize from '../Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Imagepath from '../../Themes/Imagepath';

export default function Loader(props) {
  return props.visible ? (
    <View
      style={[
        {
          position: 'absolute',
          backgroundColor: Colorpath.Pagebg,
          zIndex: 1000001,
          top: 0,
          left: 0,
          height: Dimensions.get('screen').height,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1,
          // margin:0,bottom:-30
        },
        props.modal == true
          ? { height: '133%', width: '116.5%', borderRadius: normalize(15) }
          : null,
      ]}>
      <View
        style={{
          height: normalize(80),
          width: normalize(80),
          // borderRadius: normalize(10),
          // borderWidth: 1,
          // borderColor: "#DADADA",
          // alignItems: 'center',
          justifyContent: 'center',
          alignItems: "center",
          backgroundColor: Colorpath.Pagebg,
          // shadowColor: "#000",
          // shadowOffset: { height: 3, width: 0 },
          // shadowOpacity: 10,
          // shadowRadius: 10,
          // elevation: 10,
        }}>
{/* <ActivityIndicator size={"large"} color={"black"}/> */}
        <Image source={require('../../Assets/Images/gifemed.gif')} style={{ height: normalize(50), width: normalize(50), resizeMode: "contain", alignSelf: "center" }} />
      </View>
    </View>
  ) : null;
}

Loader.propTypes = {
  visible: PropTypes.bool,
  modal: PropTypes.bool,
};

Loader.defaultProps = {
  modal: false,
  visible: false,
};
