import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Image, ImageBackground, LogBox, Text, View } from 'react-native';
import Imagepath from '../../Themes/Imagepath';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants.js';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import { AppContext } from '../GlobalSupport/AppContext';
export default function SplashInt(props) {
  const {
    setFulldashbaord,
    setGtprof,
    setAddit,
  } = useContext(AppContext);
  const isFocus = useIsFocused();

  useEffect(() => {
    let timeoutId;
    const handleNavigation = async () => {
      if (!isFocus) return; // Only run when actively in focus
      try {
        const [wholeDashData, profdatset] = await Promise.all([
          AsyncStorage.getItem(constants.WHOLEDATA),
          AsyncStorage.getItem(constants.PRODATA)
        ]);
        const parsedDashData = wholeDashData ? JSON.parse(wholeDashData) : null;
        const parsedProfData = profdatset ? JSON.parse(profdatset) : null;

        const navigateTo = () => {
          if (parsedDashData !== null) {
            setAddit(wholeDashData);
            setFulldashbaord([parsedDashData]);
            setGtprof(true);
            return "TabNav";
          } else if (parsedProfData !== null) {
            setFulldashbaord(0);
            return "TabNav";
          } else {
            return "Onboard";
          }
        };

        timeoutId = setTimeout(() => {
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: navigateTo() }],
            })
          );
        }, 5000);
      } catch (error) {
        console.error('Error handling navigation:', error);
      }
    };

    handleNavigation();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isFocus]);

  useLayoutEffect(() => {
    props.navigation.setOptions({ gestureEnabled: false });
  }, []);
  return (
    <>
      <MyStatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <ImageBackground
        source={Imagepath.SpalshNew}
        resizeMode="cover"
        style={{ flex: 1, backgroundColor: Colorpath.ButtonColr }}
      >
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
          <Image source={Imagepath.NewLogo} style={{ justifyContent: "center", alignItems: "center", height: normalize(50), width: normalize(250), resizeMode: "contain" }} />
          {/* <Text style={{fontFamily:Fonts.InterMedium,fontSize:14,color:"#FFFFFF",alignSelf:"center",marginTop:normalize(10),marginLeft:normalize(10)}}>{"The Global Marketplace for CME/CE"}</Text> */}
        </View>
      </ImageBackground>
    </>
  );
}
