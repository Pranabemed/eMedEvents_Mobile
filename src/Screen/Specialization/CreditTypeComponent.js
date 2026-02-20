import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert, BackHandler, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import DropDownHeader from '../../Components/DropDownHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
const CreditTypeComponent = ({ handleCreditType, clist, setcountrypicker, searchCreditName, searchtext }) => {
    console.log(clist, "wekknamecustome")
    const weekFilterProfession = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    handleCreditType(item);
                    setcountrypicker(false);
                }}
                style={{
                    borderWidth: 0.5,
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
                        lineHeight: normalize(14),
                        textAlign: 'center',
                        color: Colorpath.black,
                        // textTransform: 'capitalize',
                    }}
                >
                    {item?.name}
                </Text>
            </TouchableOpacity>
        );
    };
    const [showloader, setShowLoader] = useState(false);

    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(true);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);
    useEffect(() => {
        const onBackPress = () => {
            setcountrypicker(false);
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
                    <DropDownHeader title="Credit Type*" onClosePress={() => { setcountrypicker(false) }} />
                ) : (
                    <View>
                        <DropDownHeader title="Credit Type*" onClosePress={() => { setcountrypicker(false) }} />
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
                                backgroundColor: searchtext ? '#f0f0f0' : '#ffffff',
                                borderBottomColor: '#000000',
                                borderBottomWidth: 0.5,
                                marginTop: normalize(10),
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <TextInput
                                editable
                                maxLength={40}
                                onChangeText={searchCreditName}
                                value={searchtext}
                                style={{
                                    height: normalize(50),
                                    width: normalize(300),
                                    paddingLeft: normalize(10),
                                }}
                                placeholder="Search Credit Name*"
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
                            ListEmptyComponent={!showloader ? <ActivityIndicator size={"small"} color={"green"} /> :
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

export default CreditTypeComponent