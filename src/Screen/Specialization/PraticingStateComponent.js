import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';
/**
 * Praticing state component screen module. Renders a React Native screen or a screen-scoped support component. Exported members: PraticingStateComponent, onBackPress, weekFilterProfession.
 */

import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert, ActivityIndicator, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';

/**
 * Reusable PraticingStateComponent component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const PraticingStateComponent = ({ handlePratcing, slistpratice, setPratice, searchStateNamePratice, searchpratice, setSearchpratice }) => {

    const [showLoader, setShowLoader] = useState(false)
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(true);
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);
    useEffect(() => {
                /**
 * On back press utility.
 * @returns {boolean}
 */
const onBackPress = () => {
            setPratice(false);
            setSearchpratice("");
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );
        return () => backHandler.remove();
    }, []);
        /**
 * Week filter profession utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const weekFilterProfession = ({ item, index }) => {
        return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <DropdownOption
                    onPress={() => {
                        handlePratcing(item);
                        setPratice(false);
                    }}

                >
                    <Text
                        style={dropdownStyles.optionText}
                    >
                        {item?.state_name ? item?.state_name : item?.name}

                    </Text>
                </DropdownOption >

            </View >

        );
    };
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <View style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? (
                    <DropDownHeader standardized title="State*" onClosePress={() => {
                        setPratice(false);
                        setSearchpratice("");
                    }} />
                ) : (
                    <View>
                        <DropDownHeader standardized title="State*" onClosePress={() => {
                            setPratice(false);
                            setSearchpratice("");
                        }} />
                    </View>
                )}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <DropdownSearch editable
                            maxLength={40}
                            onChangeText={searchStateNamePratice}
                            value={searchpratice}
                            placeholder="Search State" />
                    <View style={{ flex: 1 }}>
                        <DropdownList
                            data={slistpratice}
                            renderItem={weekFilterProfession}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingBottom: normalize(50) }}
                            keyboardShouldPersistTaps="always"
                            ListEmptyComponent={!showLoader ? <ActivityIndicator size={"small"} color={"green"} /> :
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    backgroundColor: "#DADADA",
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: normalize(20),
                                        }}>
                                        No data found
                                    </Text>
                                </View>
                            }
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        </>
    )
}

/**
 * Praticing state component default export.
 *
 * @returns {*}
 */
export default PraticingStateComponent
