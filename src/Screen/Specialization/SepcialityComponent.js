
import { View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, FlatList, ScrollView, Platform, ActivityIndicator, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import { SafeAreaView } from 'react-native-safe-area-context'
const SepcialityComponent = ({ handleStateSelect, formData, setstatepicker, setSearchState, searchState, searchStateName, slist }) => {
    const [showLoader, setShowLoader] = useState(false);
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(true);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);
    useEffect(() => {
        const onBackPress = () => {
            setstatepicker(false);
            setSearchState("")
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );
        return () => backHandler.remove();
    }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? (
                    <PageHeader title="Speciality" onBackPress={() => {
                        setstatepicker(false);
                        setSearchState("")
                    }} />
                ) : (
                    <View>
                        <PageHeader title="Speciality" onBackPress={() => {
                            setstatepicker(false);
                            setSearchState("")
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
                                backgroundColor: '#ffffff',
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
                                    borderWidth: 0.8,
                                    borderColor: "#DADADA"
                                }}
                                placeholder="Search Speciality*"
                                placeholderTextColor={"RGB(170, 170, 170)"}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={slist}
                            renderItem={({ item, index }) => (
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleStateSelect(item, formData)}
                                        style={{
                                            // borderWidth: 1,
                                            marginTop: normalize(10),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: normalize(40),
                                            width: '85%',
                                            alignSelf: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                width: '100%',
                                                textAlign: 'center',
                                                color: Colorpath.black,
                                                flexShrink: 1,
                                                fontFamily: Fonts.InterRegular,
                                                textAlign: "left",
                                                lineHeight: 16
                                                // textTransform: 'capitalize',
                                            }}
                                        >
                                            {item?.name}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{ height: 0.8, width: '94%', backgroundColor: "#DADADA" }} />
                                </View>
                            )}
                            contentContainerStyle={{ paddingBottom: normalize(50) }}
                            keyboardShouldPersistTaps="always"
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={!showLoader ? <ActivityIndicator size={"small"} color={"green"} /> :
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
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>

    )
}

export default SepcialityComponent