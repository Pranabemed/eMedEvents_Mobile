import { View, Text, StyleSheet } from 'react-native';
import React, { useContext, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import Buttons from '../../Components/Button';
import Fonts from '../../Themes/Fonts';
import IntIcn from 'react-native-vector-icons/MaterialIcons';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { AppContext } from './AppContext';
import StackNav from '../../Navigator/StackNav';
import MyStatusBar from '../../Utils/MyStatusBar';
import { SafeAreaView } from 'react-native-safe-area-context'
const Internet = () => {
    const {
        isConnected,
        setIsConnected,
    } = useContext(AppContext);
    const handleReload = () => {
        if (isConnected) {
            <StackNav/>
            console.log('Internet is back, navigating...');
            showErrorAlert("Please again open the app");
        } else {
            console.log('Still no connection, retrying...');
        }
    };
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                <StackNav/>
                console.log("Internet is back!");
            }
        });

        return () => unsubscribe();
    }, [isConnected]);

    return (
        <>
            {/* <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <IntIcn
                        name="signal-wifi-connected-no-internet-4"
                        style={styles.icon}
                        size={100}
                        color={Colorpath.black}
                    />
                    <Buttons
                        onPress={handleReload}
                        height={normalize(45)}
                        width={normalize(310)}
                        backgroundColor={Colorpath.ButtonColr}
                        borderRadius={normalize(5)}
                        text="Reload the Page"
                        color={Colorpath.white}
                        fontSize={16}
                        fontFamily={Fonts.InterSemiBold}
                        fontWeight="bold"
                        marginTop={normalize(30)}
                    />
                </View>
                <View style={styles.internetCard}>
                    <Text style={styles.internetText}>{"No Internet Connection"}</Text>
                </View>
            </SafeAreaView> */}
        </>
    );
};

export default Internet;

const styles = StyleSheet.create({
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
        flex: 1 
    },
    internetText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
