import { View, Text, Platform, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import Colorpath from '../Themes/Colorpath'
import normalize from '../Utils/Helpers/Dimen';
import Modal from 'react-native-modal';
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import EyeIcon from 'react-native-vector-icons/Entypo';
const TextModal = ({ isVisible, onFalse,setDetailsmodal }) => {
    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={isVisible}
            style={{ width: '100%', alignSelf: 'center', margin: 0 }}
            animationInTiming={800}
            animationOutTiming={1000}
            onBackdropPress={()=>{setDetailsmodal(false);}}>
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
                    <View style={{ height: 5, width: normalize(100), backgroundColor: "#DDDDDD", borderRadius: normalize(5) }} />
                </View>
                <View>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Image source={Imagepath.FileImg} style={styles.image} />
                            <Text style={styles.title}>{"File Cabinet"}</Text>
                        </View>
                        <Text style={styles.description}>
                            {"Safely store essential documents like Academic \nCertificates, Residency Certificates, State Licenses,\nBoard Certificates, and other necessary certificates.\nEasily retrieve and share them with authorities when \n needed."}
                        </Text>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.header}>
                           <EyeIcon color={Colorpath.ButtonColr} size={30} name="eye" />
                            <Text style={styles.title}>{"Document Access Logs"}</Text>
                        </View>
                        <Text style={styles.description}>
                            {"Maintain transparency with detailed access logs,\n tracking when and by whom your documents have \n been accessed"}
                        </Text>
                    </View>
                </View>

            </View>
        </Modal>
    )
}

export default TextModal
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
        lineHeight: 20, // Adjust line height if needed
      },
})