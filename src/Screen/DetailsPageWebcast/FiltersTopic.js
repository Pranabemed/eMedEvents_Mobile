import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import TickMark from 'react-native-vector-icons/Ionicons';
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context'
const FiltersTopic = ({ webcasttopic, searchWebcastTopic, checkoutCleartopic, topicfetched, setTopicfetched, weekname, setWeekname, rolesdata, setRolesdata, webcastall, setWebcastall, toggleWeekSelection }) => {
    console.log(weekname,"wekknamecustome",topicfetched)
    const weekFilter = ({ item, index }) => {
        const isSelectedWeek = weekname.includes(item.name);
        return (
            <TouchableOpacity onPress={()=>{
                toggleWeekSelection(item);
            }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "row", marginLeft: normalize(10), margin: normalize(10) }}>
                        <TouchableOpacity onPress={() => {
                             toggleWeekSelection(item); }}>
                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: isSelectedWeek ? Colorpath.ButtonColr : 'transparent',
                                borderColor: isSelectedWeek ? Colorpath.ButtonColr : Colorpath.black,
                                height: normalize(17),
                                width: normalize(17),
                                borderRadius: normalize(5),
                                borderWidth: normalize(0.5)
                            }}>
                                {isSelectedWeek && <TickMark name="checkmark" color={Colorpath.white} size={17} />}
                            </View>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", paddingHorizontal: normalize(4) }}>
                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#333" }}>
                                {item?.name}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
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
                    <PageHeader title="Topics" onBackPress={checkoutCleartopic} />
                ) : (
                    <View>
                        <PageHeader title="Topics" onBackPress={checkoutCleartopic} />
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
                                backgroundColor: topicfetched ? '#f0f0f0' : '#ffffff',
                                borderBottomColor: '#000000',
                                borderBottomWidth: 0.5,
                                marginTop: normalize(10),
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <TextInput
                                editable
                                maxLength={40}
                                onChangeText={text => searchWebcastTopic(text)}
                                value={topicfetched}
                                style={{
                                    height: normalize(50),
                                    width: weekname ? normalize(280):normalize(300),
                                    paddingLeft: normalize(10),
                                }}
                                placeholder="Search Topic(s)"
                                placeholderTextColor={"RGB(170, 170, 170)"}
                            />
                            {weekname ? (<TouchableOpacity onPress={() => {
                            Alert.alert("eMEdEvents","Are you sure want to clear all topics ?",[{text:"No",onPress:()=>{console.log("hello")},style:"cancel"},{text:"Yes",onPress:()=>{
                                // setTopicfetched("");
                                setWeekname("");},style:"default"}]);
                            }}>
                                <CloseIcon name="close" color="#000000" size={normalize(20)} />
                            </TouchableOpacity>):null}
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={webcasttopic}
                            renderItem={weekFilter}
                            keyExtractor={(item, index) => index.toString()}
                            keyboardShouldPersistTaps="always"
                            ListEmptyComponent={
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
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}

export default FiltersTopic