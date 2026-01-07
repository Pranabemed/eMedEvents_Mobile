import { View, Text, Platform, TouchableOpacity, Alert, BackHandler } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import GradientButton from '../../Components/LinearButton';
import Fonts from '../../Themes/Fonts';
import HcpContent from './HcpContent';
import UserSub from './UserSub';
import DrawerModal from '../../Components/DrawerModal';
import { object } from 'prop-types';
import NetInfo from '@react-native-community/netinfo';
import { AppContext } from '../GlobalSupport/AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'
const HCPSub = (props) => {
    const { isConnected } = useContext(AppContext);
    const [linearText, setLinearText] = useState(true);
    const [visible, setVisible] = useState(false);
    const [nodata, setNodata] = useState("drawerclose");
    const [idget, setIdget] = useState("6");
    const [storeAlldata, setStoreAlldata] = useState([]);
    const [storeAlldatas, setStoreAlldatas] = useState([]);
    const [valuttext, setValuttext] = useState(false);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
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
        toggleDrawerModal();
    }
    useEffect(() => {
        if (Object.keys(storeAlldatas)?.length > 0) {
            handleLinearTextChange(true);
        } else {
            handleLinearTextChange(false);
        }
    }, [storeAlldata])
    const handleLinearTextChange = (isOnline) => {
        setLinearText(isOnline);
    };
    useEffect(() => {
        const onBackPress = () => {
            HCPBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    console.log(storeAlldatas, "storeAlldata-----hcp", Object.keys(storeAlldatas).length);
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn == false ? <IntOff/>:<SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="My Subscriptions"
                            onBackPress={HCPBack}
                        />
                    ) : (
                        <PageHeader
                            title="My Subscriptions"
                            onBackPress={HCPBack}
                        />

                    )}
                </View>
                <View style={{ marginTop: normalize(10) }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between", // Changed from space-evenly to space-between
                        width: normalize(300),
                        height: normalize(48),
                        backgroundColor: "#FFFFFF",
                        borderRadius: normalize(5),
                        paddingHorizontal: normalize(2), // Added padding to prevent overflow
                        alignSelf: 'center',
                    }}>
                        <TouchableOpacity
                            style={[
                                {
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flex: 1,
                                    height: normalize(41),
                                    borderRadius: normalize(5),
                                    marginTop: normalize(3),
                                    marginHorizontal: normalize(2),
                                },
                                valuttext && {
                                    backgroundColor: "#DCE4FF"
                                }
                            ]}
                            onPress={() => { setValuttext(true); }}
                        >
                            <Text style={{
                                fontFamily: Fonts.InterSemiBold,
                                fontSize: 16,
                                color: valuttext ? Colorpath.ButtonColr : "#000000"
                            }}>
                                {"HCP"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                {
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flex: 1,
                                    height: normalize(41),
                                    borderRadius: normalize(5),
                                    marginTop: normalize(3),
                                    marginHorizontal: normalize(-1),
                                },
                                !valuttext && {
                                    backgroundColor: "#DCE4FF"
                                }
                            ]}
                            onPress={() => { setValuttext(false) }}
                        >
                            <Text style={{
                                fontFamily: Fonts.InterSemiBold,
                                fontSize: 16,
                                color: !valuttext ? Colorpath.ButtonColr : "#000000"
                            }}>
                                {"User"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingVertical: normalize(5) }}>
                    { <TouchableOpacity onPress={() => { handleLinearTextChange(true); }}>
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: linearText ? "#2C4DB9" : "#555555" }}>
                            {"HCP"}
                        </Text>
                    </TouchableOpacity>}
                    <TouchableOpacity onPress={() => { handleLinearTextChange(false) }}>
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: !linearText ? "#2C4DB9" : "#555555" }}>
                            {"User"}
                        </Text>
                    </TouchableOpacity>
                </View> */}

                <View>
                    {/* <View style={{ zIndex: 999, position: "relative", top: 1, flexDirection: "row", justifyContent: "space-evenly", marginRight: linearText ? normalize(39) : undefined, marginLeft: !linearText ? normalize(60) : undefined }}>
                        {Object.keys(storeAlldatas)?.length > 0  &&<View>
                            {linearText && <GradientButton width={60} />}
                        </View>}
                        <View style={{marginRight:Object.keys(storeAlldatas)?.length > 0 ? 0 :normalize(50)}}>
                            {!linearText && <GradientButton width={60} />}
                        </View>
                    </View> */}
                    <View style={{ bottom: normalize(10) }}>
                        {valuttext && <HcpContent storeAlldata={storeAlldata} setStoreAlldata={setStoreAlldata} />}
                    </View>
                    <View style={{ bottom: normalize(10) }}>
                        {!valuttext && <UserSub storeAlldatas={storeAlldatas} setStoreAlldatas={setStoreAlldatas} />}
                    </View>
                </View>
            </SafeAreaView>}
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

export default HCPSub