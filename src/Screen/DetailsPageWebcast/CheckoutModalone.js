import { View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, FlatList, ScrollView, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import Buttons from '../../Components/Button';
import TickMark from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context'
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
    const weekFilterProfession = ({ item }) => {
        const isSelected = selectedSpecialities.some(speciality => speciality.id === item?.id);
        const isPreviouslySelected = formData[activeIndex]?.speciality_ids?.some(id => id === item.id)
        console.log("isPreviouslySelected=====", activeIndex);
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

        const determineIndexToMerge = () => {
            return 0;
        };

        return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>

                <TouchableOpacity onPress={handlePress} style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: normalize(43),
                    width: normalize(295),
                    margin: normalize(5),
                    gap: normalize(10)
                }}>
                    <View style={{ flexDirection: "row", marginLeft: normalize(15), gap: normalize(5) }}>
                        <View>
                            <TouchableOpacity onPress={handlePress}>
                                {formData[activeIndex]?.speciality_ids?.includes(item.id) ? (
                                    <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colorpath.black, borderColor: Colorpath.black, height: normalize(17), width: normalize(17), borderRadius: normalize(2), marginTop: normalize(5), borderWidth: 0.8 }}>
                                        <TickMark name="checkmark" color={Colorpath.white} size={17} />
                                    </View>
                                ) : (
                                    <View style={{ borderColor: Colorpath.black, height: normalize(17), width: normalize(17), borderRadius: normalize(2), marginTop: normalize(5), borderWidth: 0.8 }} />
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", paddingHorizontal: normalize(4), paddingVertical: normalize(8), width: normalize(280) }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    lineHeight: normalize(14),
                                    textAlign: 'center',
                                    color: Colorpath.black,
                                    textTransform: 'capitalize',
                                    fontFamily: Fonts.InterRegular,
                                }}
                            >
                                {item?.name}
                            </Text>
                        </View>
                    </View>

                </TouchableOpacity>
                <View style={{ height: 0.8, width: normalize(300), backgroundColor: "#DADADA" }} />
            </View>
        );
    };
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ height: normalize(800), width: normalize(320), justifyContent: "center", alignSelf: "center", backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? (
                    <PageHeader title="Select Specialty(ies)" onBackPress={() => {
                        setstatepicker(!statepicker);
                        setSearchState("");
                        // handleSpecialitySelect(selectedSpecialities, formData);
                    }} />
                ) : (
                    <View>
                        <PageHeader title="Select Specialty(ies)" onBackPress={() => {
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
                    <View style={{
                        flexDirection: "row",
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(10),
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <View
                            style={{
                                backgroundColor:'#ffffff',
                                // borderBottomColor: '#000000',
                                // borderBottomWidth: 0.5,
                                marginTop: normalize(10),
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <TextInput
                                editable
                                maxLength={40}
                                onChangeText={text => searchStateName(text)}
                                value={searchState}
                                style={{
                                    height: normalize(50),
                                    width: normalize(300),
                                    paddingLeft: normalize(13),
                                    borderWidth:0.8,
                                    borderColor:"#DADADA"
                                }}
                                placeholder="Search and choose your specialties*"
                                placeholderTextColor={"RGB(170, 170, 170)"}
                            />
                        </View>
                    </View>
                    <FlatList
                        data={slist}
                        renderItem={weekFilterProfession}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: normalize(250) }}
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
                        position: 'absolute',
                        height: normalize(120),
                        bottom: Platform.OS === 'ios' ? normalize(124) : normalize(89),
                        left: 0,
                        right: 0,
                        backgroundColor: Colorpath.white,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingBottom: normalize(20),
                        borderColor: "#DADADA",
                        borderWidth: 0.8
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
                            marginTop={normalize(-15)}
                        />
                    </View>}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>

    )
}

export default CheckoutModalone