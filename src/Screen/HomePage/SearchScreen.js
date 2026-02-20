import { View, Text, Platform, TextInput, TouchableOpacity, KeyboardAvoidingView, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import PageHeader from '../../Components/PageHeader'
import Colorpath from '../../Themes/Colorpath'
import MyStatusBar from '../../Utils/MyStatusBar'
import normalize from '../../Utils/Helpers/Dimen';
import CloseIcn from 'react-native-vector-icons/AntDesign';
import Fonts from '../../Themes/Fonts'
import Imagepath from '../../Themes/Imagepath'
import Buttons from '../../Components/Button'
import { SafeAreaView } from 'react-native-safe-area-context'

const SearchScreen = (props) => {
    const [search, setSearch] = useState(false);
    const [searchtxt, setSearchtxt] = useState("");
    const FilterBack = () => {
        props.navigation.goBack();
    };
    console.log(search, "search000000");
    const specialityData = [{ id: 0, name: "Internal Medicine" }, { id: 1, name: "Family Medicine" }, { id: 2, name: "Obstetrics and Gynecology" }, { id: 3, name: "Oncology" }, { id: 4, name: "Radiology" }, { id: 5, name: "Psychiatry" }];
    const ProfessionData = [{ id: 0, name: "Physician" }, { id: 1, name: "Physician Assistant" }, { id: 2, name: "Nursing" }, { id: 3, name: "Dentist" }, { id: 4, name: "Pharmacist" }, { id: 5, name: "Respiratory Therapist" }];
    const renderSection = ({ item }) => {
        console.log(item,"dfsknfjkndfg1395888")
        if (item.type === 'Popular') {
            return (
                <View>
                    <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: normalize(10),
                    paddingVertical: normalize(10)
                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 20,
                            color: "#000000"
                        }}>
                            {"Popular Specialties"}
                        </Text>
                    </View>
                    <View>
                        <Buttons
                            onPress={() => { props.navigation.navigate("Login") }}
                            height={normalize(30)}
                            width={normalize(100)}
                            borderRadius={normalize(5)}
                            text="Browse All"
                            color={Colorpath.ButtonColr}
                            fontSize={16}
                            fontFamily={Fonts.InterSemiBold}
                        />
                    </View>
                </View>
                {item.data.map((datas,index)=>(<TouchableOpacity onPress={() => { console.log("herhgfgjedg") }} style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(13), paddingHorizontal: normalize(10) }}>
                    <View
                        style={{
                            flexDirection: "row",
                            width: normalize(290),
                            alignItems: "center",
                        }}
                    >
                        <View style={{ marginRight: normalize(13) }}>
                            <Image source={Imagepath.WrongArrw} style={{ height: normalize(18), width: normalize(18), resizeMode: "contain", tintColor: "#99999" }} />
                        </View>
                        <Text
                            style={{
                                fontFamily: Fonts.InterRegular,
                                fontSize: 16,
                                color: "#333333"
                            }}
                        >
                            {datas?.name}
                        </Text>
                    </View>
                </TouchableOpacity>))}
            </View>
            );
        } else if (item.type === 'professions') {
            return (
                <View>
                <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: normalize(10),
                paddingVertical: normalize(10)
            }}>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontFamily: Fonts.InterSemiBold,
                        fontSize: 20,
                        color: "#000000"
                    }}>
                        {"Top Professions"}
                    </Text>
                </View>
                <View>
                    <Buttons
                        onPress={() => { props.navigation.navigate("Login") }}
                        height={normalize(30)}
                        width={normalize(100)}
                        borderRadius={normalize(5)}
                        text="Browse All"
                        color={Colorpath.ButtonColr}
                        fontSize={16}
                        fontFamily={Fonts.InterSemiBold}
                    />
                </View>
            </View>
            {item.data.map((datavb,index)=>(<TouchableOpacity onPress={() => { console.log("herhgfgjedg") }} style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(13), paddingHorizontal: normalize(10) }}>
                    <View
                        style={{
                            flexDirection: "row",
                            width: normalize(290),
                            alignItems: "center",
                        }}
                    >
                        <View style={{ marginRight: normalize(13) }}>
                            <Image source={Imagepath.WrongArrw} style={{ height: normalize(18), width: normalize(18), resizeMode: "contain", tintColor: "#99999" }} />
                        </View>
                        <Text
                            style={{
                                fontFamily: Fonts.InterRegular,
                                fontSize: 16,
                                color: "#333333"
                            }}
                        >
                            {datavb?.name}
                        </Text>
                    </View>
                </TouchableOpacity>))}
        </View>
            );
        }
    };

    const mergedData = [
        { type: 'Popular', data: specialityData },
        { type: 'professions', data: ProfessionData },
    ];

    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    {search ? <View style={{ flexDirection: "row", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40), marginLeft: normalize(5) }}>
                        <View style={{
                            borderBottomColor: '#000000',
                            borderBottomWidth: 0.5,
                        }}>
                            <TextInput editable
                                maxLength={50}
                                onChangeText={(val) => { setSearchtxt(val) }}
                                value={searchtxt}
                                style={{ height: normalize(40), width: normalize(270), paddingHorizontal: 5, fontSize: 14, color: "#000000", fontFamily: Fonts.InterMedium }}
                                placeholder="Search Here"
                                placeholderTextColor={"RGB(170, 170, 170)"}
                                keyboardType="default" />
                        </View>
                        <TouchableOpacity onPress={() => { setSearch(false) }} style={{ paddingLeft: normalize(5), alignSelf: "center" }}>
                            <CloseIcn name="close" size={28} color={"#000000"} />
                        </TouchableOpacity>
                    </View> : <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                        <PageHeader search={true} setSearch={setSearch} title="Search" onBackPress={FilterBack} />
                    </View>}
                    <View style={{flex:1}}>
                        <FlatList
                            data={mergedData}
                            renderItem={renderSection}
                            keyExtractor={(item, index) => `${item.type}-${index}`}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}

export default SearchScreen