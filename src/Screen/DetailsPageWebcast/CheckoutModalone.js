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
        const hasSelectedSpec = Array.isArray(selectedSpecialities) && Array.isArray(selectedSpecialities[activeIndex]);
        const isPreviouslySelected = hasSelectedSpec
            ? selectedSpecialities[activeIndex].some(speciality => String(speciality?.id) === String(item?.id))
            : Boolean(formData[activeIndex]?.speciality_ids?.some(id => String(id) === String(item?.id)));

        const handlePress = () => {
            const itemIdStr = String(item?.id);
            if (hasSelectedSpec) {
                const currentList = selectedSpecialities[activeIndex] || [];
                const isSelected = currentList.some(s => String(s?.id) === itemIdStr);
                let nextList = [];
                if (isSelected) {
                    nextList = currentList.filter(s => String(s?.id) !== itemIdStr);
                } else {
                    if (currentList.length >= 5) {
                        Alert.alert("eMedEvents", "You can select up to 5 specialities.");
                        return;
                    }
                    nextList = [...currentList, item];
                }
                const updatedNames = nextList.map(s => s?.name);
                const updatedIds = nextList.map(s => s?.id);
                if (setSelectedSpecialities) {
                    setSelectedSpecialities(prev => {
                        if (!Array.isArray(prev)) return prev;
                        return prev.map((list, idx) => idx === activeIndex ? nextList : list);
                    });
                }
                handleSpecialityChange(activeIndex, updatedNames, updatedIds);
                return;
            }
            const currentIds = formData[activeIndex]?.speciality_ids ? formData[activeIndex].speciality_ids.map(id => String(id)) : [];
            const currentNames = formData[activeIndex]?.speciality ? formData[activeIndex].speciality.split(', ').map(s => s.trim()).filter(Boolean) : [];

            let updatedIds = [];
            let updatedNames = [];

            if (currentIds.includes(itemIdStr)) {
                const indicesToKeep = currentIds.map((id, idx) => id !== itemIdStr ? idx : -1).filter(idx => idx !== -1);
                updatedIds = indicesToKeep.map(idx => currentIds[idx]);
                updatedNames = indicesToKeep.map(idx => currentNames[idx] || '');
            } else {
                if (currentIds.length >= 5) {
                    Alert.alert("eMedEvents", "You can select up to 5 specialities.");
                    return;
                }
                updatedIds = [...currentIds, itemIdStr];
                updatedNames = [...currentNames, item?.name];
            }
            handleSpecialityChange(activeIndex, updatedNames, updatedIds);
        };

        return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <DropdownOption selected={Boolean(formData[activeIndex]?.speciality_ids?.some(id => String(id) === String(item?.id)))} onPress={handlePress} >
                    <View style={{ marginRight: normalize(10) }}>
                        {formData[activeIndex]?.speciality_ids?.some(id => String(id) === String(item?.id)) ? (
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
            <View style={dropdownStyles.panel}>
                {Platform.OS === 'ios' ? (
                    <DropDownHeader standardized title="Select Specialty(s)" onClosePress={() => {
                        setstatepicker(!statepicker);
                        setSearchState("");
                        // handleSpecialitySelect(selectedSpecialities, formData);
                    }} />
                ) : (
                    <View>
                        <DropDownHeader standardized title="Select Specialty(s)" onClosePress={() => {
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
