/**
 * Menu screen module. Renders a React Native screen or a screen-scoped support component. Exported members: Menu, toggleDrawerModal.
 */

import { View, Text, BackHandler, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import DrawerModal from '../../Components/DrawerModal';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable Menu component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const Menu = () => {
    const [visible, setVisible] = useState(false);
    const [care, setCare] = useState("closeit");
    const navigation = useNavigation();

    /**
     * Close drawer modal utility and return to last route.
     * @returns {void}
     */
    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate('Home');
            }
        }, 220);
    };

    useFocusEffect(
        useCallback(() => {
            setVisible(true);
            setCare("closeit");
            return () => {
                setVisible(false);
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
                    onBackdropPress={handleClose}
                    onRequestClose={handleClose}
                    backButton={handleClose}
                    rentalNavigate={handleClose}
                    watchlistNavigate={handleClose}
                    subscribeNavigate={handleClose}
                    rewardNavigate={handleClose}
                    homeNavigate={handleClose}
                    expensesNav={handleClose}
                    interestedNav={handleClose}
                    drawerPress={handleClose}
                />
            </SafeAreaView>
        </>
    )
}

/**
 * Menu default export.
 *
 * @returns {*}
 */
export default Menu