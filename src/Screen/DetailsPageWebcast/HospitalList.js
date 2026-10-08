import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';
/**
 * Hospital list screen module. Renders a React Native screen or a screen-scoped support component. Exported members: HospitalList, hospFilterTake.
 */

import { View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, FlatList, ScrollView, Platform } from 'react-native'
import React from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';

/**
 * Reusable HospitalList component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const HospitalList  = ({hosppicker,hospAll,setSearchhosp, searchhosp,handlehospShows, setHosppicker, searchHospName}) => {
/**
 * Hosp filter take utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @returns {JSX.Element}
 */
const hospFilterTake = ({ item}) => {
    return (
        <DropdownOption onPress={()=>{
            handlehospShows(item);
            setHosppicker(!hosppicker);
            setSearchhosp("");
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
                <DropDownHeader standardized title="Hospital List*" onClosePress={()=>{
                    setHosppicker(!hosppicker);
                    setSearchhosp("");
                    // handleSpecialitySelect(selectedSpecialities, formData);
                }} />
            ) : (
                <View style={{ marginTop: normalize(40) }}>
                    <DropDownHeader standardized title="Hospital List*" onClosePress={()=>{
                        setHosppicker(!hosppicker);
                        setSearchhosp("");
                        // handleSpecialitySelect(selectedSpecialities, formData);
                        }} />
                </View>
            )}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <DropdownSearch editable
                            maxLength={40}
                            onChangeText={text => searchHospName(text)}
                            value={searchhosp}
                            placeholder="Search Hospital Name*" />
                    <DropdownList
                        data={hospAll}
                        renderItem={hospFilterTake}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{paddingBottom:normalize(200)}}
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
            </KeyboardAvoidingView>
        </View>
    </>

    )
}

/**
 * Hospital list default export.
 *
 * @returns {*}
 */
export default HospitalList
