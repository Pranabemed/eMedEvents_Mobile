import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';

/**
 * State contact screen module. Renders a React Native screen or a screen-scoped support component. Exported members: CheckStateShowCont, weekFilterProfession, handleBackPress.
 */

import { View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, FlatList, ScrollView, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';

/**
 * Reusable CheckStateShowCont component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const CheckStateShowCont = ({ statepicker, setStatepicker, pratice, setSearchState, activeIndex, searchpratice, handleStateshows, setPratice, searchStateNamePratice, slistpratice }) => {
    console.log("selectedSpecialitieqwwww12233s--------");
    const [showLoader,setShowLoader] = useState(false);
     useEffect(() => {
            // Simulate 2-second loading time
            const timeout = setTimeout(() => {
                setShowLoader(true);
            }, 5000);

            return () => clearTimeout(timeout);
        }, []);
        /**
 * Week filter profession utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @returns {JSX.Element}
 */
const weekFilterProfession = ({ item }) => {
        console.log("isPreviouslySelected=====", activeIndex);
        return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <DropdownOption onPress={() => {
                    handleStateshows(item, activeIndex);
                    setPratice(!pratice);
                    setSearchState("");
                    setStatepicker(!statepicker);
                }}

                >
                    <Text
                        style={dropdownStyles.optionText}
                    >
                        {item?.name}
                    </Text>
                </DropdownOption >

            </View>
        );
    };
        /**
 * Handles back press.
 * @returns {void}
 */
const handleBackPress = () => {
        setPratice(!pratice);
        setSearchState("");
        setStatepicker(!statepicker);
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
                        handleBackPress();
                    }} />
                ) : (
                    <View>
                        <DropDownHeader standardized title="State*" onClosePress={() => {
                            handleBackPress();
                        }} />
                    </View>
                )}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <DropdownSearch editable
                            maxLength={40}
                            onChangeText={text => searchStateNamePratice(text, activeIndex)}
                            value={searchpratice}
                            placeholder="Search State Name" />
                    <DropdownList
                        data={slistpratice}
                        renderItem={weekFilterProfession}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: normalize(200) }}
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
                </KeyboardAvoidingView>
            </View>
        </>

    )
}

/**
 * State contact default export.
 *
 * @returns {*}
 */
export default CheckStateShowCont
