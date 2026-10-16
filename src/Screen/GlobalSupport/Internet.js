/**
 * Internet screen module. Renders a React Native screen or a screen-scoped support component. Exported members: Internet, handleReload, styles.
 */

import { View, Text, StyleSheet, Modal } from 'react-native';
import React, { useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import Buttons from '../../Components/Button';
import Fonts from '../../Themes/Fonts';
import IntIcn from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from './AppContext';
import MyStatusBar from '../../Utils/MyStatusBar';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable Internet component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const Internet = () => {
    const {
        setIsConnected,
    } = useContext(AppContext);
        /**
 * Handles reload.
 * @returns {void}
 */
const handleReload = () => {
        NetInfo.fetch().then(state => {
            setIsConnected(Boolean(state.isConnected && state.isInternetReachable !== false));
        });
    };

    return (
        <Modal
            visible={true}
            animationType="none"
            presentationStyle="fullScreen"
            statusBarTranslucent={false}
            onRequestClose={() => {}}
        >
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <IntIcn
                        name="signal-wifi-connected-no-internet-4"
                        style={styles.icon}
                        size={100}
                        color={Colorpath.ButtonColr}
                    />
                    <Text style={styles.internetText}>{"No Internet Connection"}</Text>
                    <Text style={styles.internetDescription}>{"Please check your internet connection and try again"}</Text>
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
            </SafeAreaView>
        </Modal>
    );
};

/**
 * Internet default export.
 *
 * @returns {*}
 */
export default Internet;

/**
 * Styles value.
 * @returns {*}
 */
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
        marginBottom: normalize(7),
    },
    internetText: {
        color: Colorpath.black,
        fontFamily: Fonts.InterSemiBold,
        fontWeight: 'bold',
        fontSize: 20,
    },
    internetDescription: {
        marginTop: normalize(5),
        color: Colorpath.black,
        fontFamily: Fonts.InterRegular,
        fontSize: 16,
        textAlign: 'center',
    },
});
