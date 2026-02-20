import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert, StyleSheet, ActivityIndicator, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import DropDownHeader from '../../Components/DropDownHeader'
import PageHeader from '../../Components/PageHeader'
import { SafeAreaView } from 'react-native-safe-area-context'

const ProfessionComponent = ({ handleProfession, clist, setcountrypicker, searchCountryName, searchtext, setSearchtext }) => {
    console.log(clist, "wekknamecustome");
    const [showLoader, setShowLoader] = useState(false);
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(true);
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);
    useEffect(() => {
        const onBackPress = () => {
            setSearchtext("");
            setcountrypicker(false);
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );
        return () => backHandler.remove();
    }, []);
    const weekFilterProfession = ({ item, index }) => {
        return (
            <>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => {
                            handleProfession(item);
                            setcountrypicker(false);
                        }}
                        style={{
                            // borderWidth: 0.5,
                            marginTop: normalize(10),
                            justifyContent: 'center',
                            alignContent: 'center',
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
                                lineHeight: 14
                                // textTransform: 'capitalize',
                            }}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                    <View style={{ height: 0.8, width: '94%', backgroundColor: "#DADADA" }} />
                </View>
            </>
        );
    };
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? (
                    <PageHeader title="Select Profession" onBackPress={() => {
                        setSearchtext("");
                        setcountrypicker(false);
                    }} />
                ) : (
                    <View>
                        <PageHeader title="Select Profession" onBackPress={() => {
                            setSearchtext("");
                            setcountrypicker(false);
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
                                backgroundColor: '#ffffff',
                                marginTop: normalize(10),
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <TextInput
                                editable
                                maxLength={40}
                                onChangeText={searchCountryName}
                                value={searchtext}
                                style={{
                                    height: normalize(45),
                                    width: normalize(300),
                                    paddingLeft: normalize(13),
                                    borderWidth: 0.8,
                                    borderColor: "#DADADA"
                                }}
                                placeholder="Search Profession*"
                                placeholderTextColor={"RGB(170, 170, 170)"}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={clist}
                            renderItem={weekFilterProfession}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingBottom: normalize(50) }}
                            keyboardShouldPersistTaps="always"
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

export default ProfessionComponent
