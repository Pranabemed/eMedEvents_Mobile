import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';
/**
 * Customized year screen module. Renders a React Native screen or a screen-scoped support component. Exported members: CustomizedYear, weekFilterProfession, onBackPress.
 */

import { View, Text, Platform, FlatList, TouchableOpacity, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';

/**
 * Reusable CustomizedYear component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const CustomizedYear = ({ handleYearcust, yearRange, setCitypickeryear }) => {

        /**
 * Week filter profession utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const weekFilterProfession = ({ item, index }) => {
        return (
            <DropdownOption
                onPress={() => {
                    handleYearcust(item);
                    setCitypickeryear(false);
                }}

            >
                <Text
                    style={dropdownStyles.optionText}
                >
                    {item}
                </Text>
            </DropdownOption>
        );
    };
    useEffect(() => {
                /**
 * On back press utility.
 * @returns {boolean}
 */
const onBackPress = () => {
            setCitypickeryear(false);
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
                    <DropDownHeader standardized title="Year" onClosePress={() => { setCitypickeryear(false) }} />
                ) : (
                    <View>
                        <DropDownHeader standardized title="Year" onClosePress={() => { setCitypickeryear(false) }} />
                    </View>
                )}


                <View style={{ flex: 1 }}>
                    <DropdownList
                        data={yearRange}
                        renderItem={weekFilterProfession}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: normalize(50) }}
                        keyboardShouldPersistTaps="always"
                        ListEmptyComponent={
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
                                        fontSize: normalize(14),
                                    }}>
                                    No data found
                                </Text>
                            </View>
                        }
                    />
                </View>
            </View>
        </>
    )
}

/**
 * Customized year default export.
 *
 * @returns {*}
 */
export default CustomizedYear
