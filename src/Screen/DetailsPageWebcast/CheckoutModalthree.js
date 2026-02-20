
import { View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, FlatList, ScrollView, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import { SafeAreaView } from 'react-native-safe-area-context'
const CheckStateShow = ({ pratice, setSearchState, activeIndex, searchpratice, handleStateshows, setPratice, searchStateNamePratice, slistpratice }) => {
    console.log("selectedSpecialitieqwwww12233s--------");
     const[showLoader,setShowLoader] = useState(false)
            useEffect(() => {
                        // Simulate 2-second loading time
                        const timeout = setTimeout(() => {
                            setShowLoader(true);
                        }, 2000);
                
                        return () => clearTimeout(timeout);
                    }, []);
    const weekFilterProfession = ({ item }) => {
        console.log("isPreviouslySelected=====", activeIndex);
        return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={() => {
                    handleStateshows(item, activeIndex);
                    setPratice(!pratice);
                    setSearchState("");
                }}
                    style={{
                        // borderWidth: 2,
                        // borderColor:  Colorpath.Pagebg,
                        marginTop: normalize(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: normalize(40),
                        width: '87%',
                        alignSelf: 'center',
                        // backgroundColor: "#D3D3D3",
                        // opacity:  1,
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
                        {item?.name}

                    </Text>
                </TouchableOpacity >
                <View style={{ height: 0.8, width: '94%', backgroundColor: "#DADADA" }} />
            </View>
        );
    };
    const handleBackPress = () => {
        setPratice(!pratice);
        setSearchState("");
    };
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ height: normalize(800), width: normalize(320), justifyContent: "center", alignSelf: "center", backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? (
                    <PageHeader title="State*" onBackPress={() => {
                        handleBackPress();
                    }} />
                ) : (
                    <View>
                        <PageHeader title="State*" onBackPress={() => {
                            handleBackPress();
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
                                onChangeText={text => searchStateNamePratice(text, activeIndex)}
                                value={searchpratice}
                                style={{
                                    height: normalize(50),
                                    width: normalize(300),
                                    paddingLeft: normalize(13),
                                    borderWidth:0.8,
                                    borderColor:"#DADADA"
                                }}
                                placeholder="Search State Name"
                                placeholderTextColor={"RGB(170, 170, 170)"}
                            />
                        </View>
                    </View>
                    <FlatList
                        data={slistpratice}
                        renderItem={weekFilterProfession}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: normalize(200) }}
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
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>

    )
}

export default CheckStateShow