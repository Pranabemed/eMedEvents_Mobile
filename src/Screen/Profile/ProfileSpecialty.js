import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';
/**
 * Profile specialty screen module. Renders a React Native screen or a screen-scoped support component. Exported members: ProfileSpeciality, weekFilterProfession, handlePress.
 */

import { View, Text, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';
import Buttons from '../../Components/Button';
import TickMark from 'react-native-vector-icons/Ionicons';

/**
 * Memoized specialty option item component for maximum render performance.
 */
const SpecialtyOptionItem = React.memo(({ item, isCurrentlySelected, onToggle }) => {
    return (
        <DropdownOption
            selected={isCurrentlySelected}
            onPress={onToggle}
        >
            <View style={{ marginRight: normalize(10) }}>
                {isCurrentlySelected ? (
                    <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colorpath.black, borderColor: Colorpath.black, height: normalize(17), width: normalize(17), borderRadius: normalize(2), borderWidth: 0.8 }}>
                        <TickMark name="checkmark" color={Colorpath.white} size={17} />
                    </View>
                ) : (
                    <View style={{ borderColor: Colorpath.black, height: normalize(17), width: normalize(17), borderRadius: normalize(2), borderWidth: 0.8 }} />
                )}
            </View>
            <View style={{ flex: 1 }}>
                <Text numberOfLines={2} style={dropdownStyles.optionText}>
                    {item?.name}
                </Text>
            </View>
        </DropdownOption>
    );
});

/**
 * Reusable ProfileSpeciality component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const ProfileSpeciality = ({
    required = true,
    setSpeids,
    speids,
    controlled,
    setFormData,
    statepicker,
    previousSpec,
    handleSpecialityChange,
    selectedSpecialities,
    setSelectedSpecialities,
    handleSpecialitySelect,
    formData,
    setstatepicker,
    setSearchState,
    searchState,
    searchStateName,
    slist,
    onSubmit
}) => {
    const selectedIdSet = useMemo(() => {
        const ids = Array.isArray(formData?.speciality_ids) ? formData.speciality_ids : [];
        return new Set(ids.map(String));
    }, [formData?.speciality_ids]);

    const handlePress = useCallback((item) => {
        const currentSelections = Array.isArray(formData?.speciality_ids) ? formData.speciality_ids : [];
        const currentSpecialities = formData?.speciality
            ? formData.speciality.split(', ').map(s => s.trim()).filter(Boolean)
            : [];

        const itemSelected = currentSelections.some(id => String(id) === String(item?.id));
        if (!itemSelected && currentSelections.length >= 5 && controlled !== "close") {
            Alert.alert("eMedEvents", "You can select upto 5 specialities.", [{
                text: "Cancel",
                onPress: () => {
                    setstatepicker(!statepicker);
                    setSearchState("");
                },
                style: "default"
            }, {
                text: "Save",
                onPress: () => {
                    setstatepicker(!statepicker);
                    setSearchState("");
                },
                style: "default"
            }]);
            return;
        }

        let newSelections = [...currentSelections];
        let newSpecialities = [...currentSpecialities];

        if (itemSelected) {
            newSelections = newSelections.filter(id => String(id) !== String(item?.id));
            newSpecialities = newSpecialities.filter(name => name.trim() !== item?.name?.trim());
        } else {
            newSelections.push(String(item?.id));
            newSpecialities.push(item?.name);
        }

        const uniqueSpecialities = [...new Set(newSpecialities)];
        const uniqueSelections = [...new Set(newSelections.map(String))];
        const specialityString = uniqueSpecialities.join(', ');
        const updatedFormData = {
            ...(formData || {}),
            speciality_ids: uniqueSelections,
            speciality: specialityString
        };

        if (handleSpecialityChange) {
            handleSpecialityChange(uniqueSpecialities, uniqueSelections);
        } else if (setFormData) {
            setFormData(updatedFormData);
        }
    }, [formData, controlled, statepicker, setstatepicker, setSearchState, handleSpecialityChange, setFormData]);

    const weekFilterProfession = useCallback(({ item }) => {
        const isCurrentlySelected = selectedIdSet.has(String(item?.id));
        return (
            <SpecialtyOptionItem
                item={item}
                isCurrentlySelected={isCurrentlySelected}
                onToggle={() => {
                    setSpeids?.(item?.id);
                    handlePress(item);
                }}
            />
        );
    }, [selectedIdSet, setSpeids, handlePress]);

    const isEnable = (formData?.speciality_ids?.length || 0) > 0;

    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <View style={dropdownStyles.panel}>
                <DropDownHeader
                    standardized
                    title="Select Specialty(s)"
                    onClosePress={() => {
                        setstatepicker(!statepicker);
                        setSearchState("");
                    }}
                />
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <DropdownSearch
                        required={required}
                        editable
                        maxLength={40}
                        onChangeText={text => searchStateName(text)}
                        value={searchState}
                        placeholder="Search and choose your specialties*"
                    />
                    <DropdownList
                        data={slist}
                        renderItem={weekFilterProfession}
                        keyExtractor={(item, index) => String(item?.id ?? index)}
                        style={{ flex: 1, minHeight: 0 }}
                        keyboardShouldPersistTaps="always"
                        initialNumToRender={20}
                        maxToRenderPerBatch={25}
                        windowSize={7}
                        removeClippedSubviews={Platform.OS === 'android'}
                        ListEmptyComponent={
                            !slist ? (
                                <ActivityIndicator size={"small"} color={"green"} style={{ marginTop: normalize(20) }} />
                            ) : (
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    backgroundColor: "#DADADA",
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10),
                                    marginTop: normalize(20)
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
                            )
                        }
                    />
                    {isEnable && (
                        <View style={{
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
                                    } else {
                                        setstatepicker(!statepicker);
                                        setSearchState("");
                                    }
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
                        </View>
                    )}
                </KeyboardAvoidingView>
            </View>
        </>
    );
};

/**
 * Profile specialty default export.
 *
 * @returns {*}
 */
export default ProfileSpeciality;
