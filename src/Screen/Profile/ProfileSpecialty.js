import { View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, FlatList, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import Buttons from '../../Components/Button';
import TickMark from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context'

const ProfileSpeciality = ({ setSpeids, speids, controlled, setFormData, statepicker, previousSpec, handleSpecialityChange, selectedSpecialities, setSelectedSpecialities, handleSpecialitySelect, formData, setstatepicker, setSearchState, searchState, searchStateName, slist }) => {
    console.log(selectedSpecialities, "selectedSpecialitieqwwww12233s--------", formData, previousSpec)
    const [checked, setChecked] = useState(false);
    const [showLoader,setShowLoader] = useState(false);
    const weekFilterProfession = ({ item }) => {
        const isSelected = selectedSpecialities.some(speciality => speciality.id === item?.id);
        const isPreviouslySelected = formData?.speciality_ids?.some(id => id === item.id)
        console.log("isPreviouslySelected=====", formData);
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
                        text: "Cancel", onPress: () => {
                            setstatepicker(!statepicker);
                            setSearchState("")
                        }, style: "default"
                    }, {
                        text: "Save", onPress: () => {
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
                <TouchableOpacity onPress={() => {
                    setSpeids(item?.id);
                    handlePress();
                }} style={{ justifyContent: "center", alignItems: "center" }}>

                    <View style={{
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
                                <TouchableOpacity onPress={() => {
                                    handlePress();
                                    setSpeids(item?.id);
                                }}>
                                    {formData?.speciality_ids?.includes(item.id) ? (
                                        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: Colorpath.black, borderColor: Colorpath.black, height: normalize(17), width: normalize(17), borderRadius: normalize(2), marginTop: normalize(5), borderWidth: 0.8 }}>
                                            <TickMark name="checkmark" color={Colorpath.white} size={17} />
                                        </View>
                                    ) : (
                                        <View style={{ borderColor: Colorpath.black, height: normalize(17), width: normalize(17), borderRadius: normalize(2), marginTop: normalize(5), borderWidth: 0.8}} />
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", paddingHorizontal: normalize(4), paddingVertical: normalize(6), width: normalize(280) }}>
                                <Text numberOfLines={2}
                                    style={{
                                        fontSize: 16,
                                        lineHeight: normalize(14),
                                        textAlign: 'left',
                                        color: Colorpath.black,
                                        textTransform: 'capitalize',
                                        fontFamily: Fonts.InterRegular,
                                    }}
                                >
                                    {item?.name}
                                </Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ height: 0.8, width: normalize(300), backgroundColor: "#DADADA" }} />
                </TouchableOpacity>
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
            <SafeAreaView style={{ height: normalize(800), width: normalize(320), justifyContent: "center", alignSelf: "center", backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? (
                    <PageHeader title="Select Specialty(ies)" onBackPress={() => {
                        setstatepicker(!statepicker);
                        setSearchState("");
                    }} />
                ) : (
                    <View>
                        <PageHeader title="Select Specialty(ies)" onBackPress={() => {
                            setstatepicker(!statepicker);
                            setSearchState("");
                        }} />
                    </View>
                )}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                                backgroundColor:  '#ffffff',
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
                        position: 'absolute',
                        height: normalize(120),
                        bottom: Platform.OS === 'ios' ? normalize(124) : normalize(98),
                        left: 0,
                        right: 0,
                        backgroundColor: Colorpath.white,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingBottom: normalize(20),
                        borderColor: "#DADADA",
                        borderWidth: 0.8
                        // paddingBottom: normalize(20),
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

export default ProfileSpeciality