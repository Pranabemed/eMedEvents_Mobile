import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import DropDownHeader from '../../Components/DropDownHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
const BoardCustomed = ({setsearchboardname, handleBoardname, boardnamereal,setBoardnamepick, searchBoardNameFinal, searchboardname }) => {
    console.log(boardnamereal,"wekknamecustome");
    const[showLoader,setShowLoader] = useState(false)
    useEffect(() => {
                // Simulate 2-second loading time
                const timeout = setTimeout(() => {
                    setShowLoader(true);
                }, 2000);
        
                return () => clearTimeout(timeout);
            }, []);
    const weekFilterProfession = ({ item, index }) => {
        return (
            <TouchableOpacity
            onPress={() => {
                handleBoardname(item);
                setBoardnamepick(false);
            }}
            style={{
                borderWidth: 0.5,
                marginTop: normalize(8),
                justifyContent: 'center',
                alignItems: 'center',
                height: normalize(40),
                width: '89%',
                alignSelf: 'center',
            }}
        >
            <Text numberOfLines={1}
                style={{
                    fontSize: 14,
                    lineHeight: normalize(14),
                    textAlign: 'center',
                    color: Colorpath.black,
                    fontFamily:Fonts.InterMedium,
                    // textTransform: 'capitalize',
                }}
            >
                {item?.name}
            </Text>
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
                    <View style={{ marginTop: normalize(20) }}>
                    <DropDownHeader title="Certification Board*" onClosePress={()=>{
                        setBoardnamepick(false);
                        setsearchboardname("");
                        }} />
                </View>
                ) : (
                    <View>
                        <DropDownHeader title="Certification Board*" onClosePress={()=>{
                            setBoardnamepick(false);
                            setsearchboardname("");
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
                                backgroundColor: searchboardname ? '#f0f0f0' : '#ffffff',
                                borderBottomColor: '#000000',
                                borderBottomWidth: 0.5,
                                marginTop: normalize(10),
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <TextInput
                                editable
                                maxLength={50}
                                onChangeText={searchBoardNameFinal}
                                value={searchboardname}
                                style={{
                                    height: normalize(50),
                                    width: normalize(300),
                                    paddingLeft: normalize(10),
                                }}
                                placeholder="Search Board name"
                                placeholderTextColor={"RGB(170, 170, 170)"}
                            />
                        </View>
                    </View>
                    <View style={{flex:1}}>
                        <FlatList
                            data={boardnamereal}
                            renderItem={weekFilterProfession}
                            contentContainerStyle={{paddingBottom:normalize(120)}}
                            keyExtractor={(item, index) => index.toString()}
                            keyboardShouldPersistTaps="always"
                            ListEmptyComponent={!showLoader ? <ActivityIndicator size={"small"} color={"green"}/> : 
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

export default BoardCustomed