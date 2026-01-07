import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Imagepath from '../Themes/Imagepath';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';
const Noboardfound = ({navigation}) => {
    return (
        <View style={styles.containercontex}>
            <View style={styles.parentCardex}>
                <View style={styles.innerCardex}>
                    <View style={styles.iconContainerex}>
                        <Image
                            source={Imagepath.Docment}
                            style={styles.iconex}
                        />
                    </View>
                    <View style={styles.textContainerex}>
                        <View style={styles.headerRowex}>
                            <Text style={styles.titleex}>{"Keep track of all Board Certifications"}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("AddCertificate")
                }}>
                    <View style={styles.innerCardex}>
                        <View style={styles.iconContainerex}>
                            <Image
                                source={Imagepath.Crown}
                                style={styles.iconex}
                            />
                        </View>
                        <View style={styles.textContainerex}>
                            <View style={styles.headerRowex}>
                                <Text style={styles.titleex}>{"Add your board certification(s)"}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    containercontex: {
        justifyContent: 'center',
        alignItems: 'center',
        padding:normalize(10)
    },
    parentCardex: {
        width: normalize(290),
        borderRadius: normalize(10),
        backgroundColor: '#FFFFFF',
        padding: normalize(10),
        shadowColor: '#c3e9ff',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0.1,
        elevation: 5,
        marginBottom: normalize(10), 
      },
      innerCardex: {
        flexDirection: 'row',
        height: normalize(60),
        borderRadius: normalize(10),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10),
        alignItems: 'center',
        marginBottom: normalize(10),
        borderWidth:0.5,
        borderColor:"#AAAAAA" 
      },
    iconContainerex: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(10),
    },
    iconex: {
        height: normalize(35),
        width: normalize(35),
        resizeMode: 'contain',
    },
    textContainerex: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRowex: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleex: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
    crownIconex: {
        marginLeft: normalize(5),
        height: normalize(15),
        width: normalize(15),
        resizeMode: 'contain',
    },
    infoRowex: {
        flexDirection: 'row',
        marginTop: normalize(5),
    },
    infoTextex: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#999',
        fontWeight: 'bold',
    },
    infoCountex: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#000000',
        fontWeight: 'bold',
        paddingHorizontal: normalize(5),
    },
    infoButtonex: {
        position: 'absolute',
        top: 0,
        right: 25,
    },
    infoIconex: {
        height: normalize(18),
        width: normalize(18),
        resizeMode: 'contain',
    },
});
export default Noboardfound