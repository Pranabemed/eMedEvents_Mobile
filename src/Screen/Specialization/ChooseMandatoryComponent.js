import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';

/**
 * Choose mandatory component screen module. Renders a React Native screen or a screen-scoped support component. Exported members: ChooseMandatoryComponent, weekFilterProfession.
 */

import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';

/**
 * Reusable ChooseMandatoryComponent component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const ChooseMandatoryComponent = ({topicwiseStatehand, clisttopic,setStatetopicpicker, searchTopicName, searchtexttopic }) => {

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
                topicwiseStatehand(item);
                setStatetopicpicker(false);
            }}

        >
            <Text
                style={dropdownStyles.optionText}
            >
                {item?.name}
            </Text>
        </DropdownOption>
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
                    <DropDownHeader standardized title="State Mandatory Topic*" onClosePress={()=>{setStatetopicpicker(false)}} />
                ) : (
                    <View>
                        <DropDownHeader standardized title="State Mandatory Topic*" onClosePress={()=>{setStatetopicpicker(false)}} />
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
                            placeholder="Search topic name*" />
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
 * Choose mandatory component default export.
 *
 * @returns {*}
 */
export default ChooseMandatoryComponent
