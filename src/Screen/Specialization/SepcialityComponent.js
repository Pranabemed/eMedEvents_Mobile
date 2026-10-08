import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';

/**
 * Sepciality component screen module. Renders a React Native screen or a screen-scoped support component. Exported members: SepcialityComponent, onBackPress.
 */

import { View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, FlatList, ScrollView, Platform, ActivityIndicator, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';

/**
 * Reusable SepcialityComponent component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const SepcialityComponent = ({ handleStateSelect, formData, setstatepicker, setSearchState, searchState, searchStateName, slist }) => {
    const [showLoader, setShowLoader] = useState(false);
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(true);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);
    useEffect(() => {
                /**
 * On back press utility.
 * @returns {boolean}
 */
const onBackPress = () => {
            setstatepicker(false);
            setSearchState("")
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );
        return () => backHandler.remove();
    }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <View style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? (
                    <DropDownHeader standardized title="Speciality" onClosePress={() => {
                        setstatepicker(false);
                        setSearchState("")
                    }} />
                ) : (
                    <View>
                        <DropDownHeader standardized title="Speciality" onClosePress={() => {
                            setstatepicker(false);
                            setSearchState("")
                        }} />
                    </View>
                )}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <DropdownSearch editable
                            maxLength={40}
                            onChangeText={text => searchStateName(text)}
                            value={searchState}
                            placeholder="Search Speciality*" />
                    <View style={{ flex: 1 }}>
                        <DropdownList
                            data={slist}
                            renderItem={({ item, index }) => (
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <DropdownOption
                                        key={index}
                                        onPress={() => handleStateSelect(item, formData)}

                                    >
                                        <Text
                                            style={dropdownStyles.optionText}
                                        >
                                            {item?.name}
                                        </Text>
                                    </DropdownOption>

                                </View>
                            )}
                            contentContainerStyle={{ paddingBottom: normalize(50) }}
                            keyboardShouldPersistTaps="always"
                            keyExtractor={(item, index) => index.toString()}
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
 * Sepciality component default export.
 *
 * @returns {*}
 */
export default SepcialityComponent
