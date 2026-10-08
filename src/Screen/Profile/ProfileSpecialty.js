import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';
/**
 * Profile specialty screen module. Renders a React Native screen or a screen-scoped support component. Exported members: ProfileSpeciality, weekFilterProfession, handlePress.
 */

import { View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, FlatList, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import TickMark from 'react-native-vector-icons/Ionicons';

/**
 * Reusable ProfileSpeciality component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const ProfileSpeciality = ({ setSpeids, speids, controlled, setFormData, statepicker, previousSpec, handleSpecialityChange, selectedSpecialities, setSelectedSpecialities, handleSpecialitySelect, formData, setstatepicker, setSearchState, searchState, searchStateName, slist, onSubmit }) => {

    const [checked, setChecked] = useState(false);
    const [showLoader,setShowLoader] = useState(false);
        /**
 * Week filter profession utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @returns {JSX.Element}
 */
const weekFilterProfession = ({ item }) => {
        const isSelected = selectedSpecialities.some(speciality => speciality.id === item?.id);
        const isPreviouslySelected = formData?.speciality_ids?.some(id => id === item.id)

                /**
 * Handles press.
 * @returns {void}
 */
const handlePress = () => {
            setFormData(prevFormData => {
                const currentSelections = prevFormData?.speciality_ids || [];
                const currentSpecialities = prevFormData?.speciality
                    ? prevFormData.speciality.split(', ').filter(s => s)
                    : []; // Split existing specialities into an array

                if (!Array.isArray(currentSelections)) {
                    console.error("Expected currentSelections to be an array:", currentSelections);
                    return prevFormData;
                }

                const isCurrentlySelected = currentSelections.includes(item.id);
                if (currentSelections.length >= 5 && controlled !== "close") {
                    Alert.alert("eMedEvents", "You can select upto 5 specialities.", [{
                        text: "Cancel",                         /**
 * On press utility.
 * @returns {void}
 */
onPress: () => {
                            setstatepicker(!statepicker);
                            setSearchState("")
                        }, style: "default"
                    }, {
                        text: "Save",                         /**
 * On press utility.
 * @returns {void}
 */
onPress: () => {
                            setstatepicker(!statepicker);
                            setSearchState("")
                        }, style: "default"
                    }])
                    return prevFormData; // Prevent adding more items
                }
                let newSelections = [...currentSelections];
                let newSpecialities = [...currentSpecialities];

                if (isCurrentlySelected) {
                    newSelections = newSelections.filter(id => id !== item.id);
                    newSpecialities = newSpecialities.filter(name => name !== item.name);
                } else {
                    newSelections.push(item.id);
                    newSpecialities.push(item.name);
                }
                const uniqueSpecialities = [];
                newSpecialities.forEach(speciality => {
                    if (!uniqueSpecialities.includes(speciality)) {
                        uniqueSpecialities.push(speciality);
                    }
                });
                const specialityString = uniqueSpecialities.join(', ');
                const updatedFormData = {
                    ...prevFormData,
                    speciality_ids: newSelections,
                    speciality: specialityString
                };
                handleSpecialityChange(newSpecialities, newSelections);
                return updatedFormData;
            });
        };

        return (
            <>
                <DropdownOption selected={formData?.speciality_ids?.includes(item.id)}
                    onPress={() => {
                        setSpeids(item?.id);
                        handlePress();
                    }}

                >
                    <View style={{ marginRight: normalize(10) }}>
                        {formData?.speciality_ids?.includes(item.id) ? (
                            <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colorpath.black, borderColor: Colorpath.black, height: normalize(17), width: normalize(17), borderRadius: normalize(2), borderWidth: 0.8 }}>
                                <TickMark name="checkmark" color={Colorpath.white} size={17} />
                            </View>
                        ) : (
                            <View style={{ borderColor: Colorpath.black, height: normalize(17), width: normalize(17), borderRadius: normalize(2), borderWidth: 0.8 }} />
                        )}
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={2}
                            style={dropdownStyles.optionText}
                        >
                            {item?.name}
                        </Text>
                    </View>
                </DropdownOption>

            </>
        );
    };
    const isEnable = formData?.speciality_ids?.length > 0;
      useEffect(() => {
            // Simulate 2-second loading time
            const timeout = setTimeout(() => {
                setShowLoader(true);
            }, 2000);

            return () => clearTimeout(timeout);
        }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <View style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? (
                    <DropDownHeader standardized title="Select Specialty(ies)" onClosePress={() => {
                        setstatepicker(!statepicker);
                        setSearchState("");
                    }} />
                ) : (
                    <View>
                        <DropDownHeader standardized title="Select Specialty(ies)" onClosePress={() => {
                            setstatepicker(!statepicker);
                            setSearchState("");
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
                            placeholder="Search and choose your specialties*" />
                    <DropdownList
                        data={slist}
                        renderItem={weekFilterProfession}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ flex: 1, minHeight: 0 }}
                        keyboardShouldPersistTaps="always"
                        ListEmptyComponent={!showLoader ? <ActivityIndicator size={"small"} color={"green"}/> :
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
                    {isEnable && <View style={{
                        width: "100%",
                        flexShrink: 0,
                        backgroundColor: Colorpath.white,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: normalize(16),
                        borderColor: "#DADADA",
                        borderTopWidth: 0.8
                    }}>
                        <Buttons
                            onPress={() => {
                                if (onSubmit) {
                                    onSubmit();
                                }
                                setstatepicker(!statepicker);
                                setSearchState("");
                            }}
                            height={normalize(45)}
                            width={normalize(288)}
                            backgroundColor={Colorpath.ButtonColr}
                            borderRadius={normalize(5)}
                            text="Submit"
                            color={Colorpath.white}
                            fontSize={16}
                            fontFamily={Fonts.InterSemiBold}
                        />
                    </View>}
                </KeyboardAvoidingView>
            </View>
        </>

    )
}

/**
 * Profile specialty default export.
 *
 * @returns {*}
 */
export default ProfileSpeciality
