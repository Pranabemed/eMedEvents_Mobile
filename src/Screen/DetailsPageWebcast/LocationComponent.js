import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';
/**
 * Location component screen module. Renders a React Native screen or a screen-scoped support component. Exported members: LocationComponent, weekFilterProfession.
 */

import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';

/**
 * Reusable LocationComponent component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const LocationComponent = ({setDownlink,Handlestate,setStatepick,searchtexttopic,searchTopicName,clisttopic}) => {
        /**
 * Week filter profession utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {*}
 */
const weekFilterProfession = ({ item, index }) => {
        return (item?.state_name ?<DropdownOption
            onPress={() => {
                Handlestate(item);
                setStatepick(false);
                setDownlink(false);
            }}

        >
            <Text
                style={dropdownStyles.optionText}
            >
                {item?.state_name}
            </Text>
        </DropdownOption>:null
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
                    <DropDownHeader standardized title="State*" onClosePress={()=>{setStatepick(false)}} />
                ) : (
                    <View>
                        <DropDownHeader standardized title="State*" onClosePress={()=>{setStatepick(false)}} />
                    </View>
                )}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <DropdownSearch editable
                            maxLength={40}
                            onChangeText={searchTopicName}
                            value={searchtexttopic}
                            placeholder="Search State" />
                    <View style={{ flex: 1 }}>
                        <DropdownList
                            data={clisttopic}
                            renderItem={weekFilterProfession}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{paddingBottom:normalize(50)}}
                            keyboardShouldPersistTaps="always"
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    backgroundColor: "#DADADA",
                                    alignSelf: 'center',
                                    justifyContent:"center",
                                    alignItems:"center",
                                    borderRadius:normalize(10)
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
 * Location component default export.
 *
 * @returns {*}
 */
export default LocationComponent
