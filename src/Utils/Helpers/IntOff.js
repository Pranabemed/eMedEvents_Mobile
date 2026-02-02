import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useContext } from 'react'
import Buttons from '../../Components/Button'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import Imagepath from '../../Themes/Imagepath'
import normalize from '../Helpers/Dimen';
import StackNav from '../../Navigator/StackNav'
import { AppContext } from '../../Screen/GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
const IntOff = (props) => {
    const {
        isConnected,
        setIsConnected,
    } = useContext(AppContext);
    const navi = useNavigation();
    const handleRot = () => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                <StackNav />
            }else{
              navi.navigate("TabNav");
            }
        });

        return () => unsubscribe();
    }
    return (
        <SafeAreaView style={stylesd.container}>
            <View style={stylesd.centerContainer}>
                <View style={{ height: normalize(100), width: normalize(120), borderRadius: normalize(20), bottom: normalize(50), justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { height: 3, width: 0 }, elevation: 10, backgroundColor: "#FFFFFF" }}>
                    <Image source={Imagepath.NoWifi} style={{ height: normalize(40), width: normalize(40), resizeMode: "contain" }} />
                </View>
                <Buttons
                    onPress={handleRot}
                    height={normalize(45)}
                    width={normalize(240)}
                    backgroundColor={Colorpath.ButtonColr}
                    borderRadius={normalize(5)}
                    text="Retry"
                    color={Colorpath.white}
                    fontSize={16}
                    fontFamily={Fonts.InterSemiBold}
                    fontWeight="bold"
                    marginTop={normalize(65)}
                />
            </View>
            <View style={stylesd.internetCard}>
                <Text style={stylesd.internetText}>{"No Internet Connection"}</Text>
                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000" }}>{"Please check your internet connection \n                    and try again"}</Text>
            </View>
        </SafeAreaView>
    )
}

export default IntOff
const stylesd = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colorpath.Pagebg,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        padding: normalize(10),
        flex: 1
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(20),
        zIndex: 2,
    },
    icon: {
        marginBottom: normalize(20),
    },
    internetCard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colorpath.Pagebg,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        padding: normalize(10),
        marginTop: normalize(10),
        flex: 1,
        gap: normalize(5)
    },
    internetText: {
        color: "#000000",
        fontFamily: Fonts.InterSemiBold,
        fontSize: 20,
    },
});