
import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import DropDownHeader from '../../Components/DropDownHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
const BoardVaultModal = ({ handleBoardname, clisttopicboard, setStatepickboard, searchTopicNameboard, searchtexttopicboard }) => {
    console.log(clisttopicboard, "wekknamecustome");
    const [showLoader,setShowLoader] = useState(false);
     useEffect(() => {
            // Simulate 2-second loading time
            const timeout = setTimeout(() => {
                setShowLoader(true);
            }, 5000);
    
            return () => clearTimeout(timeout);
        }, []);
    const weekFilterProfession = ({ item, index }) => {
        return (
            <View style={{justifyContent:"center",alignItems:"center"}}> 
                <TouchableOpacity
                    onPress={() => {
                        handleBoardname(item);
                        setStatepickboard(false);
                    }}
                    style={{
                        // borderWidth: 0.5,
                        marginTop: normalize(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: normalize(40),
                        width: '87%',
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
                        {item?.board_data?.board_name}
                    </Text>
                </TouchableOpacity>
                <View style={{ height: 0.8, width: '94%', backgroundColor: "#DADADA" }} />
            </View>
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
                    <DropDownHeader title="Board name*" onClosePress={() => { setStatepickboard(false) }} />
                ) : (
                    <View>
                        <DropDownHeader title="Board name*" onClosePress={() => { setStatepickboard(false) }} />
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
                                backgroundColor: searchtexttopicboard ? '#f0f0f0' : '#ffffff',
                                borderBottomColor: '#000000',
                                borderBottomWidth: 0.5,
                                marginTop: normalize(10),
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <TextInput
                                editable
                                maxLength={40}
                                onChangeText={searchTopicNameboard}
                                value={searchtexttopicboard}
                                style={{
                                    height: normalize(50),
                                    width: normalize(300),
                                    paddingLeft: normalize(10),
                                }}
                                placeholder="Search board name"
                                placeholderTextColor={"RGB(170, 170, 170)"}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={clisttopicboard}
                            renderItem={weekFilterProfession}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingBottom: normalize(50) }}
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
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}

export default BoardVaultModal