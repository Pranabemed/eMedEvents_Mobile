import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';
/**
 * Checkout modalone screen module. Renders a React Native screen or a screen-scoped support component. Exported members: CheckoutModalone, weekFilterProfession, handlePress, determineIndexToMerge.
 */

import { View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, FlatList, ScrollView, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import TickMark from 'react-native-vector-icons/Ionicons';

/**
 * Reusable CheckoutModalone component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const CheckoutModalone = ({ statepicker, previousSpec, speciality, speciality_id, setFormData, removeSpeciality, activeIndex, handleSpecialityChange, selectedSpecialities, setSelectedSpecialities, handleSpecialitySelect, formData, setstatepicker, setSearchState, searchState, searchStateName, slist }) => {
    console.log(selectedSpecialities, "selectedSpecialitieqwwww12233s--------", formData, previousSpec);
     const[showLoader,setShowLoader] = useState(false)
            useEffect(() => {
                        // Simulate 2-second loading time
                        const timeout = setTimeout(() => {
                            setShowLoader(true);
                        }, 2000);

                        return () => clearTimeout(timeout);
                    }, []);
        /**
 * Week filter profession utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @returns {JSX.Element}
 */
const weekFilterProfession = ({ item }) => {
        const isSelected = selectedSpecialities.some(speciality => speciality.id === item?.id);
        const isPreviouslySelected = formData[activeIndex]?.speciality_ids?.some(id => id === item.id)
        console.log("isPreviouslySelected=====", activeIndex);
                /**
 * Handles press.
 * @returns {void}
 */
const handlePress = () => {
            setSelectedSpecialities(prev => {
                const newSelections = prev.map((item, index) =>
                    index === activeIndex ? [...item] : []
                );
                const currentSelections = newSelections[activeIndex] || [];
                if (!Array.isArray(currentSelections)) {
                    console.error("Expected currentSelections to be an array:", currentSelections);
                    return prev;
                }
                const isCurrentlySelected = currentSelections.some(speciality => speciality.id === item.id);
                const hasPreviousSpecData = previousSpec && previousSpec.length > 0;
                if (isCurrentlySelected) {
                    newSelections[activeIndex] = currentSelections.filter(speciality => speciality.id !== item.id);
                } else {
                    if (hasPreviousSpecData && activeIndex === determineIndexToMerge()) {
                        newSelections[activeIndex] = [
                            ...currentSelections,
                            item,
                            ...previousSpec
                        ].filter((s, index, self) =>
                            index === self.findIndex((t) => (t.id === s.id))
                        );
                    } else {
                        newSelections[activeIndex] = [...currentSelections, item];
                    }
                }
                const updatedSpecialities = newSelections[activeIndex].map(s => s.name);
                const updatedSpecialityIds = newSelections[activeIndex].map(s => s.id);
                handleSpecialityChange(activeIndex, updatedSpecialities, updatedSpecialityIds);

                return newSelections;
            });
        };

                /**
 * Determine index to merge utility.
 * @returns {number}
 */
const determineIndexToMerge = () => {
            return 0;
        };

        return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <DropdownOption selected={Boolean(isPreviouslySelected)} onPress={handlePress} >
                    <View style={{ marginRight: normalize(10) }}>
                        {formData[activeIndex]?.speciality_ids?.includes(item.id) ? (
                            <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colorpath.black, borderColor: Colorpath.black, height: normalize(17), width: normalize(17), borderRadius: normalize(2), borderWidth: 0.8 }}>
                                <TickMark name="checkmark" color={Colorpath.white} size={17} />
                            </View>
                        ) : (
                            <View style={{ borderColor: Colorpath.black, height: normalize(17), width: normalize(17), borderRadius: normalize(2), borderWidth: 0.8 }} />
                        )}
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={dropdownStyles.optionText}
                        >
                            {item?.name}
                        </Text>
                    </View>
                </DropdownOption>

            </View>
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
                    <DropDownHeader standardized title="Select Specialty(ies)" onClosePress={() => {
                        setstatepicker(!statepicker);
                        setSearchState("");
                        // handleSpecialitySelect(selectedSpecialities, formData);
                    }} />
                ) : (
                    <View>
                        <DropDownHeader standardized title="Select Specialty(ies)" onClosePress={() => {
                            setstatepicker(!statepicker);
                            setSearchState("");
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
                            onChangeText={text => searchStateName(text)}
                            value={searchState}
                            placeholder="Search and choose your specialties*" />
                    <DropdownList
                        data={slist}
                        renderItem={weekFilterProfession}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ flex: 1, minHeight: 0 }}
                        keyboardShouldPersistTaps="always"
                        ListEmptyComponent={!showLoader ? <ActivityIndicator size={"small"} color={"green"} />:
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
                    {formData[activeIndex]?.speciality?.length > 0 && <View style={{
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
 * Checkout modalone default export.
 *
 * @returns {*}
 */
export default CheckoutModalone
