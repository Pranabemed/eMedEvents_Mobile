
import { View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, FlatList, ScrollView, Platform } from 'react-native'
import React from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import { SafeAreaView } from 'react-native-safe-area-context'
const SpecialityComponent = ({handleSpecialitySelect,formData, setstatepicker, setSearchState, searchState, searchStateName, slist }) => {
    return (
        <>
        <MyStatusBar
            barStyle={'light-content'}
            backgroundColor={Colorpath.Pagebg}
        />
        <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
            {Platform.OS === 'ios' ? (
                <PageHeader title="Speciality" onBackPress={()=>{
                    setstatepicker(false);
                    setSearchState("");
                }} />
            ) : (
                <View>
                    <PageHeader title="Speciality" onBackPress={()=>{
                        setstatepicker(false);
                        setSearchState("");
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
                            backgroundColor: searchState ? '#f0f0f0' : '#ffffff',
                            borderBottomColor: '#000000',
                            borderBottomWidth: 0.5,
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
                                paddingLeft: normalize(10),
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
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleSpecialitySelect(item,formData)}
                                style={{
                                    borderWidth: 1,
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
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {item?.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{paddingBottom:normalize(120)}}
                        keyboardShouldPersistTaps="always"
                        keyExtractor={(item, index) => index.toString()}
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

export default SpecialityComponent