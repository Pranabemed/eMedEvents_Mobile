import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';

/**
 * Lic state show dt screen module. Renders a React Native screen or a screen-scoped support component. Exported members: LicStateTakeShow, weekFilterProfessionLic, handleBackPress.
 */

import { View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, FlatList, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';

/**
 * Reusable LicStateTakeShow component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const LicStateTakeShow = ({licstatepratice,setSearchpraticelic,activeIndexslic, searchpraticelic,handleLicStateshows, setLicstatepratice, handlePraticeLicTake, slistpraticelic}) => {
     const[showLoader,setShowLoader] = useState(false);
            useEffect(() => {
                        // Simulate 2-second loading time
                        const timeout = setTimeout(() => {
                            setShowLoader(true);
                        }, 2000);

                        return () => clearTimeout(timeout);
                    }, []);
/**
 * Week filter profession lic utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @returns {JSX.Element}
 */
const weekFilterProfessionLic = ({ item}) => {
    return (
        <View style={{justifyContent:"center",alignItems:"center"}}>
        <DropdownOption onPress={()=>{
            handleLicStateshows(item,activeIndexslic);
            setLicstatepratice(!licstatepratice);
            setSearchpraticelic("");
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
        setLicstatepratice(!licstatepratice);
        setSearchpraticelic("");
};
    return (
        <>
        <MyStatusBar
            barStyle={'light-content'}
            backgroundColor={Colorpath.Pagebg}
        />
        <View style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
            {Platform.OS === 'ios' ? (
                <DropDownHeader standardized title="Medical License State*" onClosePress={()=>{
                    handleBackPress();
                }} />
            ) : (
                <View>
                    <DropDownHeader standardized title="Medical License State*" onClosePress={()=>{
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
                            onChangeText={text => handlePraticeLicTake(text,activeIndexslic)}
                            value={searchpraticelic}
                            placeholder="Search Medical License State Name" />
                    <DropdownList
                        data={slistpraticelic}
                        renderItem={weekFilterProfessionLic}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{paddingBottom:normalize(200)}}
                         keyboardShouldPersistTaps="always"
                        ListEmptyComponent={!showLoader ? <ActivityIndicator size={"small"} color={"green"}/>:
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
 * Lic state show dt default export.
 *
 * @returns {*}
 */
export default LicStateTakeShow
