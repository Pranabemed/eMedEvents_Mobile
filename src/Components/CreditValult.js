import { View, Text, Platform, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import Colorpath from '../Themes/Colorpath'
import normalize from '../Utils/Helpers/Dimen';
import Modal from 'react-native-modal';
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import ShareIcon from 'react-native-vector-icons/Entypo';
const CreditValult = ({ isVault, onVaultFalse }) => {
    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={isVault}
            style={{ width: '100%', alignSelf: 'center', margin: 0 }}
            animationInTiming={800}
            animationOutTiming={1000}
            onBackdropPress={onVaultFalse}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderTopRightRadius: normalize(20),
                    borderTopLeftRadius: normalize(20),
                    paddingVertical: normalize(10),
                }}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <View style={{ height: 10, width: normalize(100), backgroundColor: "#DDDDDD", borderRadius: normalize(10) }} />
                </View>
                <View>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Image source={Imagepath.Certificate} style={styles.image} />
                            <Text style={styles.title}>{"CME Allowance Tracking"}</Text>
                        </View>
                        <Text style={styles.description}>
                            {"Securely store and manage all your certificates and \n credits in a centralized credit vault with lifetime \n access."}
                        </Text>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <ShareIcon name="share" size={30} color={Colorpath.ButtonColr}/>
                            <Text style={styles.title}>{"Share for Reimbursement"}</Text>
                        </View>
                        <Text style={styles.description}>
                            {"Effortlessly share your certifications with employers \n or certification bodies, enhancing professional \n   credibility and job mobility."}
                        </Text>
                    </View>
                </View>

            </View>
        </Modal>
    )
}

export default CreditValult
const styles = StyleSheet.create({
    container: {
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(10),
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(5),
      },
      image: {
        height: normalize(20),
        width: normalize(20),
        resizeMode: 'contain',
      },
      title: {
        fontFamily: Fonts.InterMedium,
        fontSize: 18,
        color: Colorpath.ButtonColr,
        marginLeft: normalize(5),
      },
      description: {
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        color: "#000000",
        lineHeight: 20, 
      },
})

