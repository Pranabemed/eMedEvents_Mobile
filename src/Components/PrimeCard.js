import { View, Text, Platform, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'
import Colorpath from '../Themes/Colorpath'
import normalize from '../Utils/Helpers/Dimen';
import Modal from 'react-native-modal';
import Fonts from '../Themes/Fonts';
import Imagepath from '../Themes/Imagepath';
import ArrowIconsAnt from 'react-native-vector-icons/AntDesign';
import { CommonActions, useNavigation } from '@react-navigation/native';
const PrimeCard = ({
  primeadd,
  setPrimeadd,
  primaryButtonText,
  onPrimaryAction,
  secondaryButtonText,
  onSecondaryAction,
  showSkip = false,
  onSkip,
}) => {
  const navigate = useNavigation();
  const handlePrimaryAction = () => {
    if (typeof onPrimaryAction === 'function') {
      onPrimaryAction();
      return;
    }
    setPrimeadd(false);
    navigate.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "PrimePayment" }] }))
  };
  const handleSecondaryAction = () => {
    if (typeof onSecondaryAction === 'function') {
      onSecondaryAction();
      return;
    }
    setPrimeadd(false);
    navigate.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "PrimePayment" }] }))
  };
  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating={true}
      isVisible={primeadd}
      style={{
        width: '100%',
        margin: 0,
        justifyContent: 'flex-end',
      }}
      animationInTiming={800}
      animationOutTiming={1000}
      onBackdropPress={() => {
        if (!showSkip) {
          setPrimeadd(false);
        }
      }}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      coverScreen={true}
    >
      <ImageBackground
        source={Imagepath.NonPrime}
        style={{
          width: '100%',
          height: showSkip ? normalize(500) : normalize(455),
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: normalize(28),
          paddingBottom: Platform.OS === 'ios' ? normalize(24) : normalize(18),
        }}
        imageStyle={{
          width: '100%',
          height: '100%',
          resizeMode: "stretch",
          backgroundColor: '#FFF7EA',
        }}
      >
        <View style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: '100%',
          paddingHorizontal: normalize(24),
        }}>
          <Text style={{ fontFamily: Fonts.InterBold,fontWeight:"bold", fontSize: 32, color: "#000000" }}>
            {"Prime Subscription"}
          </Text>
          <Text style={{
            fontFamily: Fonts.InterMedium,
            fontSize: 14,
            color: "#000000",
            textAlign: 'center',
            lineHeight: normalize(22),
            marginTop: normalize(8),
          }}>
            {"Get Prime for state-specific courses & \n exclusive discounts!"}
          </Text>
             <View style={{marginTop: normalize(10),backgroundColor:"#FF8800",height:normalize(40),width:normalize(63),borderRadius:normalize(20),borderWidth:1.5,borderColor:"#FFFFFF",justifyContent:"center",alignItems:"center"}}>
              <Text style={{fontFamily:Fonts.InterMedium,fontSize:28,color:"#FFFFFF"}}>{"$99"}</Text>
             </View>
          {/* <Image
            source={Imagepath.CrownDone}
            style={{
              marginTop: Platform.OS === "ios" ? normalize(27): normalize(18),
              height: normalize(45),
              width: normalize(45),
              resizeMode: "contain"
            }}
          /> */}

          <View style={{
            flexDirection: "row",
            alignItems: "center",
            width: '100%',
            justifyContent: 'center'
          }}>
            <Image
              source={Imagepath.LineLeft}
              style={{
                height: normalize(10),
                width: normalize(70),
                resizeMode: "contain"
              }}
            />
            <Text style={{
              fontFamily: Fonts.InterRegular,
              fontSize: 16,
              color: "#000000",
              marginHorizontal: normalize(5)
            }}>
              {"Prime Features"}
            </Text>
            <Image
              source={Imagepath.LineRight}
              style={{
                height: normalize(10),
                width: normalize(70),
                resizeMode: "contain"
              }}
            />
          </View>
        </View>

        <View style={{
          width: normalize(270),
          backgroundColor: "#FFFAEF",
          borderRadius: normalize(10),
          marginTop: normalize(16),
          paddingVertical: normalize(12),
          paddingHorizontal: normalize(15),
          gap: normalize(10),
        }}>
          {[
            "Multi State Licensure Tracking",
            "Centralized CME/CE Credit Vault",
            "Add Credits earned elsewhere",
            "Exclusive Discounts on Courses"
          ].map((feature, index) => (
            <View key={index} style={{
              flexDirection: "row",
              alignItems: "center",
              gap: normalize(10),
            }}>
              <Image source={Imagepath.PrimeTick} style={{ height: normalize(18), width: normalize(18), resizeMode: "contain" }} />
              <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000" }}>{feature}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity onPress={handlePrimaryAction} style={{ justifyContent: "center", alignItems: "center", gap:normalize(10),flexDirection: "row", height: normalize(42), width: normalize(270), marginTop: normalize(16), backgroundColor: Colorpath.ButtonColr, borderRadius: normalize(5) }}>
          <Text style={{ fontFamily: Fonts.InterSemiBold,fontWeight:"bold", fontSize: 16, color: "#FFFFFF" }}>{primaryButtonText || "Get Prime Membership"}</Text>
          {!secondaryButtonText && <View style={{ backgroundColor: Colorpath.white, height: normalize(20), width: normalize(20), borderRadius: normalize(20), justifyContent: "center", alignItems: "center" }}
          >
            <ArrowIconsAnt
              name="arrowright"
              size={17}
              color={Colorpath.ButtonColr}
              style={{ alignSelf: "center" }}
            />
          </View>}
        </TouchableOpacity>
        {secondaryButtonText ? (
          <TouchableOpacity onPress={handleSecondaryAction} style={{ justifyContent: "center", alignItems: "center", gap:normalize(10),flexDirection: "row", height: normalize(42), width: normalize(270), marginTop: normalize(10), backgroundColor: Colorpath.ButtonColr, borderRadius: normalize(5) }}>
            <Text style={{ fontFamily: Fonts.InterSemiBold,fontWeight:"bold", fontSize: 16, color: "#FFFFFF" }}>{secondaryButtonText}</Text>
            <View style={{ backgroundColor: Colorpath.white, height: normalize(20), width: normalize(20), borderRadius: normalize(20), justifyContent: "center", alignItems: "center" }}
            >
              <ArrowIconsAnt
                name="arrowright"
                size={17}
                color={Colorpath.ButtonColr}
                style={{ alignSelf: "center" }}
              />
            </View>
          </TouchableOpacity>
        ) : null}
        {showSkip ? (
          <TouchableOpacity onPress={onSkip} style={{ marginTop: normalize(16), width: '100%', alignItems: 'center', backgroundColor: '#FFF7EA', paddingVertical: normalize(10) }}>
            <Text style={{ fontFamily: Fonts.InterSemiBold, fontWeight: "bold", fontSize: 16, color: "#000000" }}>{"Skip"}</Text>
          </TouchableOpacity>
        ) : null}
      </ImageBackground>
    </Modal>
  )
}
export default PrimeCard
