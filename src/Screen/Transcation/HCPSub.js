/**
 * Hcpsub screen module. Renders a React Native screen or a screen-scoped support component. Exported members: HCPSub, toggleDrawerModal, HCPBack, handleLinearTextChange, onBackPress.
 */

import { View, Text, TouchableOpacity, BackHandler, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Fonts from '../../Themes/Fonts';
import HcpContent from './HcpContent';
import UserSub from './UserSub';
import DrawerModal from '../../Components/DrawerModal';
import NetInfo from '@react-native-community/netinfo';
import { AppContext } from '../GlobalSupport/AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'
import { CommonActions } from '@react-navigation/native';

/**
 * Reusable HCPSub component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const HCPSub = (props) => {
    const { isConnected } = useContext(AppContext);
    const [linearText, setLinearText] = useState(true);
    const [visible, setVisible] = useState(false);
    const [nodata, setNodata] = useState("drawerclose");
    const [idget, setIdget] = useState("6");
    const [storeAlldata, setStoreAlldata] = useState({});
    const [storeAlldatas, setStoreAlldatas] = useState({});
    const [valuttext, setValuttext] = useState(false);
    const [conn, setConn] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);

    const toggleDrawerModal = () => {
        setVisible(!visible);
        setNodata("drawerclose");
        setIdget("6");
    };

    const HCPBack = () => {
        props.navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: 'TabNav', params: { initialRoute: 'Home' } }] })
        );
    };

    const handleLinearTextChange = (isOnline) => {
        setLinearText(isOnline);
    };

    useEffect(() => {
        if (storeAlldatas && Object.keys(storeAlldatas)?.length > 0) {
            handleLinearTextChange(true);
        } else {
            handleLinearTextChange(false);
        }
    }, [storeAlldata, storeAlldatas]);

    useEffect(() => {
        const onBackPress = () => {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'TabNav', params: { initialRoute: 'Home' } }],
                })
            );
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, [props.navigation]);

    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);

    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            {conn == false ? <IntOff /> : (
                <SafeAreaView style={localStyles.container}>
                    <PageHeader
                        title="My Subscriptions"
                        onBackPress={HCPBack}
                    />
                    <View style={localStyles.segmentWrapper}>
                        <View style={localStyles.segmentBar}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    localStyles.segmentTab,
                                    valuttext && localStyles.segmentTabActive
                                ]}
                                onPress={() => setValuttext(true)}
                            >
                                <Text style={[
                                    localStyles.segmentText,
                                    valuttext && localStyles.segmentTextActive
                                ]}>
                                    {"HCP"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    localStyles.segmentTab,
                                    !valuttext && localStyles.segmentTabActive
                                ]}
                                onPress={() => setValuttext(false)}
                            >
                                <Text style={[
                                    localStyles.segmentText,
                                    !valuttext && localStyles.segmentTextActive
                                ]}>
                                    {"User"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={localStyles.contentContainer}>
                        {valuttext ? (
                            <HcpContent storeAlldata={storeAlldata} setStoreAlldata={setStoreAlldata} />
                        ) : (
                            <UserSub storeAlldatas={storeAlldatas} setStoreAlldatas={setStoreAlldatas} />
                        )}
                    </View>
                </SafeAreaView>
            )}
            <DrawerModal
                expandId={idget}
                handel={nodata}
                isVisible={visible}
                onBackdropPress={() => setVisible(!visible)}
                onRequestClose={() => setVisible(false)}
                backButton={() => setVisible(!visible)}
                rentalNavigate={() => setVisible(!visible)}
                watchlistNavigate={() => setVisible(!visible)}
                subscribeNavigate={() => setVisible(!visible)}
                rewardNavigate={() => setVisible(!visible)}
                homeNavigate={() => setVisible(!visible)}
                expensesNav={() => setVisible(!visible)}
                interestedNav={() => setVisible(!visible)}
                drawerPress={() => setVisible(!visible)}
            />
        </>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEF5FF',
    },
    segmentWrapper: {
        paddingHorizontal: normalize(12),
        paddingTop: normalize(10),
        paddingBottom: normalize(4),
    },
    segmentBar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(12),
        borderWidth: 1,
        borderColor: '#D6E4FF',
        padding: normalize(4),
    },
    segmentTab: {
        flex: 1,
        height: normalize(36),
        borderRadius: normalize(9),
        justifyContent: 'center',
        alignItems: 'center',
    },
    segmentTabActive: {
        backgroundColor: Colorpath.ButtonColr,
    },
    segmentText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        color: '#475569',
    },
    segmentTextActive: {
        fontFamily: Fonts.InterSemiBold,
        color: '#FFFFFF',
    },
    contentContainer: {
        flex: 1,
    },
});

export default HCPSub
