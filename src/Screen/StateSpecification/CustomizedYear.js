/**
 * Customized year screen module. Renders a React Native screen or a screen-scoped support component. Exported members: CustomizedYear, weekFilterProfession, onBackPress.
 */

import { View, Text, Platform, FlatList, TouchableOpacity, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import DropDownHeader from '../../Components/DropDownHeader'
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable CustomizedYear component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const CustomizedYear = ({ handleYearcust, yearRange, setCitypickeryear }) => {
    console.log(yearRange, "wekknamecustome")
        /**
 * Week filter profession utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const weekFilterProfession = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    handleYearcust(item);
                    setCitypickeryear(false);
                }}
                style={{
                    borderWidth: 0.5,
                    marginTop: normalize(10),
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: normalize(40),
                    width: '85%',
                    alignSelf: 'center',
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        lineHeight: normalize(14),
                        textAlign: 'center',
                        color: Colorpath.black,
                        textTransform: 'capitalize',
                    }}
                >
                    {item}
                </Text>
            </TouchableOpacity>
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
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? (
                    <DropDownHeader title="Year" onClosePress={() => { setCitypickeryear(false) }} />
                ) : (
                    <View>
                        <DropDownHeader title="Year" onClosePress={() => { setCitypickeryear(false) }} />
                    </View>
                )}


                <View style={{ flex: 1 }}>
                    <FlatList
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
            </SafeAreaView>
        </>
    )
}

/**
 * Customized year default export.
 *
 * @returns {*}
 */
export default CustomizedYear