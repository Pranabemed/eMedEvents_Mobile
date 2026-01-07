import { View, Text, Platform, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'
import Colorpath from '../Themes/Colorpath'
import normalize from '../Utils/Helpers/Dimen';
import Modal from 'react-native-modal';
import Fonts from '../Themes/Fonts';
import Imagepath from '../Themes/Imagepath';
import ArrowIconsAnt from 'react-native-vector-icons/AntDesign';
import { CommonActions, useNavigation } from '@react-navigation/native';
const PrimeCard = ({ primeadd, setPrimeadd }) => {
  const navigate = useNavigation();
  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating={true}
      isVisible={primeadd}
      style={{
        width: '100%',
        alignSelf: 'center',
        margin: 0,
        justifyContent: 'center',
      }}
      animationInTiming={800}
      animationOutTiming={1000}
      onBackdropPress={() => setPrimeadd(false)}
    >
      <ImageBackground
        source={Imagepath.NonPrime}
        style={{
          width: '100%',
          height: normalize(460),
          justifyContent: 'flex-start',
          alignItems: 'center',
          bottom: Platform.OS === "ios" ? normalize(-140): normalize(-120),
        }}
        imageStyle={{
          width: '100%',
          height: '100%',
          resizeMode: "contain",
        }}
      >
        <View style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: '100%',
          marginTop: normalize(45)
        }}>
          <Text style={{ fontFamily: Fonts.InterBold,fontWeight:"bold", fontSize: 32, color: "#000000" }}>
            {"Prime Subscription"}
          </Text>
          <Text style={{
            fontFamily: Fonts.InterMedium,
            fontSize: 14,
            color: "#000000",
            textAlign: 'center'
          }}>
            {"Get Prime for state-specific courses & \n exclusive discounts!"}
          </Text>
             <View style={{marginTop: Platform.OS === "ios" ? normalize(27): normalize(23),backgroundColor:"#FF8800",height:normalize(40),width:normalize(63),borderRadius:normalize(20),borderWidth:1.5,borderColor:"#FFFFFF",justifyContent:"center",alignItems:"center"}}>
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
          height: normalize(155),
          width: normalize(270),
          backgroundColor: "#FFFAEF",
          borderRadius: normalize(10),
          marginTop: normalize(10),
        }}>
          <View style={{
            marginTop: normalize(10), justifyContent: "center",
            flexDirection: "row",
            gap: normalize(5),
            marginRight: normalize(12)
          }}>
            <Image source={Imagepath.PrimeTick} style={{ height: normalize(25), width: normalize(25), resizeMode: "contain" }} />
            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#000000", paddingVertical: normalize(3) }}>{"Multi State Licensure Tracking"}</Text>
          </View>
          <View style={{
            marginTop: normalize(10), justifyContent: "center",
            flexDirection: "row",
            gap: normalize(5)
          }}>
            <Image source={Imagepath.PrimeTick} style={{ height: normalize(25), width: normalize(25), resizeMode: "contain" }} />
            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#000000", paddingVertical: normalize(3) }}>{"Centralized CME/CE Credit Vault"}</Text>
          </View>
          <View style={{
            marginTop: normalize(10), justifyContent: "center",
            flexDirection: "row",
            gap: normalize(5),
            marginRight: normalize(12)
          }}>
            <Image source={Imagepath.PrimeTick} style={{ height: normalize(25), width: normalize(25), resizeMode: "contain" }} />
            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#000000", paddingVertical: normalize(3) }}>{"Add Credits earned elsewhere"}</Text>
          </View>
          <View style={{
            marginTop: normalize(10), justifyContent: "center",
            flexDirection: "row",
            gap: normalize(5),
            marginRight: normalize(4)
          }}>
            <Image source={Imagepath.PrimeTick} style={{ height: normalize(25), width: normalize(25), resizeMode: "contain" }} />
            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#000000", paddingVertical: normalize(3) }}>{"Exclusive Discounts on Courses"}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={()=>{
          setPrimeadd(false);
          navigate.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "PrimePayment" }] }))}} style={{ justifyContent: "center", alignItems: "center", gap:normalize(10),flexDirection: "row", height: normalize(40), width: normalize(270), marginTop: normalize(10), backgroundColor: Colorpath.ButtonColr, borderRadius: normalize(5) }}>
          <Text style={{ fontFamily: Fonts.InterSemiBold,fontWeight:"bold", fontSize: 16, color: "#FFFFFF" }}>{"Get Prime Membership"}</Text>
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
      </ImageBackground>
    </Modal>
  )
}
export default PrimeCard
