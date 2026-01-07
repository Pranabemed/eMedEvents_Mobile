import { View, Text, BackHandler, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import DrawerModal from '../../Components/DrawerModal';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import { SafeAreaView } from 'react-native-safe-area-context'
const Menu = () => {
    const [visible, setVisible] = useState(false);
    const[care,setCare] = useState("closeit");
    const navigation = useNavigation()
    const toggleDrawerModal = () => {
        setVisible(!visible);
        setCare("closeit")
    };
    useFocusEffect(
        useCallback(() => {
            toggleDrawerModal();
            return () => {
                console.log('Screen unfocused');
            };
        }, [])
    );
    return (
        <>
            <MyStatusBar barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg} />
            <SafeAreaView style={{ backgroundColor: Colorpath.Pagebg, flex: 1 }}>
                <DrawerModal
                    handel={care}
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
                    drawerPress={()=> setVisible(!visible)}
                />
            </SafeAreaView>
        </>
    )
}

export default Menu