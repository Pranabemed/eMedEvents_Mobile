import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';
/**
 * Profession component screen module. Renders a React Native screen or a screen-scoped support component. Exported members: ProfessionComponent, onBackPress, weekFilterProfession.
 */

import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert, StyleSheet, ActivityIndicator, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';

/**
 * Reusable ProfessionComponent component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const ProfessionComponent = ({ handleProfession, clist, setcountrypicker, searchCountryName, searchtext, setSearchtext }) => {

    const [showLoader, setShowLoader] = useState(false);
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
            setSearchtext("");
            setcountrypicker(false);
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
            <>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <DropdownOption
                        onPress={() => {
                            handleProfession(item);
                            setcountrypicker(false);
                        }}

                    >
                        <Text
                            style={dropdownStyles.optionText}
                        >
                            {item}
                        </Text>
                    </DropdownOption>

                </View>
            </>
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
                    <DropDownHeader standardized title="Select Profession" onClosePress={() => {
                        setSearchtext("");
                        setcountrypicker(false);
                    }} />
                ) : (
                    <View>
                        <DropDownHeader standardized title="Select Profession" onClosePress={() => {
                            setSearchtext("");
                            setcountrypicker(false);
                        }} />
                    </View>
                )}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <DropdownSearch editable
                            maxLength={40}
                            onChangeText={searchCountryName}
                            value={searchtext}
                            placeholder="Search Profession*" />
                    <View style={{ flex: 1 }}>
                        <DropdownList
                            data={clist}
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
 * Profession component default export.
 *
 * @returns {*}
 */
export default ProfessionComponent
