import { View, Text, KeyboardAvoidingView, TouchableOpacity, TextInput, FlatList, ScrollView, Platform } from 'react-native'
import React from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import { SafeAreaView } from 'react-native-safe-area-context'
const HospitalList  = ({hosppicker,hospAll,setSearchhosp, searchhosp,handlehospShows, setHosppicker, searchHospName}) => {
const hospFilterTake = ({ item}) => {
    return (
        <TouchableOpacity onPress={()=>{
            handlehospShows(item);
            setHosppicker(!hosppicker);
            setSearchhosp("");
        }}
            style={{
                borderWidth: 2,
                borderColor:  Colorpath.Pagebg,
                marginTop: normalize(10),
                justifyContent: 'center',
                alignItems: 'center',
                height: normalize(40),
                width: '85%',
                alignSelf: 'center',
                backgroundColor: "#D3D3D3",
                opacity:  1,
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
    );
};
    return (
        <>
        <MyStatusBar
            barStyle={'light-content'}
            backgroundColor={Colorpath.Pagebg}
        />
        <SafeAreaView style={{ height:normalize(800),width:normalize(320),justifyContent:"center",alignSelf:"center", backgroundColor: Colorpath.Pagebg }}>
            {Platform.OS === 'ios' ? (
                <PageHeader title="Hospital List*" onBackPress={()=>{
                    setHosppicker(!hosppicker);
                    setSearchhosp("");
                    // handleSpecialitySelect(selectedSpecialities, formData);
                }} />
            ) : (
                <View style={{ marginTop: normalize(40) }}>
                    <PageHeader title="Hospital List*" onBackPress={()=>{
                        setHosppicker(!hosppicker);
                        setSearchhosp("");
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
                            backgroundColor: searchhosp ? '#f0f0f0' : '#ffffff',
                            borderBottomColor: '#000000',
                            borderBottomWidth: 0.5,
                            marginTop: normalize(10),
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <TextInput
                            editable
                            maxLength={40}
                            onChangeText={text => searchHospName(text)}
                            value={searchhosp}
                            style={{
                                height: normalize(50),
                                width: normalize(300),
                                paddingLeft: normalize(10),
                            }}
                            placeholder="Search Hospital Name*"
                            placeholderTextColor={"RGB(170, 170, 170)"}
                        />
                    </View>
                </View>
                    <FlatList
                        data={hospAll}
                        renderItem={hospFilterTake}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{paddingBottom:normalize(200)}}
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    </>
      
    )
}

export default HospitalList 