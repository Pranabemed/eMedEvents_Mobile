import DropDownHeader, { DropdownSearch, DropdownList, DropdownOption, dropdownStyles } from './DropDownHeader';
/**
 * State data component reusable component module. Provides a React Native UI building block used across screens. Exported members: StateDataComponent, courseRole.
 */

import { View, Text, Keyboard, KeyboardAvoidingView, Platform, FlatList, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import Colorpath from '../Themes/Colorpath';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';
import { styles } from '../Screen/CMECreditValut/Statevaultstyes';
import MyStatusBar from '../Utils/MyStatusBar';
import PageHeader from './PageHeader';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable StateDataComponent component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const StateDataComponent = ({navigation,searchpratice, searchStateNamePratice, setSearchState, Icon, slistpratice, setStatepratice, setSpecailidpratice }) => {
        /**
 * Course role utility.
 * @returns {void}
 */
const courseRole =()=>{
        navigation.goBack();
    }
    return (
  <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
                    <SafeAreaView
                        style={{
                            backgroundColor: Colorpath.white,
                            flex: 1,
                            width: '100%',
                        }}
                    >
                <DropDownHeader standardized title="State" onClosePress={courseRole} />
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : undefined} keyboardVerticalOffset={normalize(70)}>
                    <DropdownSearch placeholder="Search State" required value={searchpratice} onChangeText={searchStateNamePratice} />
                                <DropdownList
                                    contentContainerStyle={{
                                        paddingBottom: normalize(90),
                                        paddingTop: normalize(7),
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={item => item.id}
                                    data={slistpratice}
                                    ListEmptyComponent={
                                        <View
                                            style={{
                                                height: Platform.select({
                                                    ios: normalize(500),
                                                    android: normalize(390),
                                                }),
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    alignContent: 'center',
                                                    alignItems: 'center',
                                                    alignSelf: 'center',
                                                    color: Colorpath.grey,
                                                    fontWeight: 'bold',
                                                    fontFamily: Fonts.InterSemiBold,
                                                    fontSize: 20,
                                                    paddingTop: normalize(30),
                                                }}
                                            >
                                                No state found
                                            </Text>
                                        </View>
                                    }
                                    renderItem={({ item, index }) => {
                                        return (
                                            <DropdownOption
                                                key={index}
                                                onPress={() => {
                                                    setStatepratice(item?.name);
                                                    setSpecailidpratice(item.id);
                                                    Keyboard.dismiss();
                                                }}
                                            >
                                                <Text style={dropdownStyles.optionText}>
                                                    {item?.name}
                                                </Text>
                                            </DropdownOption>
                                        );
                                    }}
                                />
                    </KeyboardAvoidingView>
                </SafeAreaView>

            </>
            )
}

                        /**
             * State data component default export.
             *
             * @returns {*}
             */
export default StateDataComponent