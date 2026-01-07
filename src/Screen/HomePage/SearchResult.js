import { View, Text, Platform, Image, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import PageHeader from '../../Components/PageHeader'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts'
import Imagepath from '../../Themes/Imagepath'
import { SafeAreaView } from 'react-native-safe-area-context'

const SearchResult = (props) => {
    const FilterBack = () => {
        props.navigation.goBack();
    };
    const dommyResult = [{ id: 0, name: "PRP and Microneedling Training in Washington DC (Falls Church, VA) ", price: "US$2,195" }, { id: 1, name: "COPD: Review of Current Treatment Guidelines", price: "US$42" }, { id: 2, name: "Unconscious Bias and Healthcare Part I", price: "US$42" }, { id: 3, name: "Antidiabetic Pharmacology Part 3: Insulin", price: "US$42" }, { id: 4, name: "Safe, Effective and Judicious Use of Antibiotics in the Outpatient Setting", price: "US$42" }];
    const intenalMedItem = ({ item, index }) => {

        console.log(item, "full item ===========", item?.certificate?.conference_id)
        return (
       
            <View style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(10) }}>
            <View
                style={{
                    flexDirection: "column",
                    width: normalize(300),
                    borderRadius: normalize(10),
                    backgroundColor: "#FFFFFF",
                    paddingHorizontal: normalize(10),
                    paddingVertical: normalize(10),
                    alignItems: "flex-start",
                }}
            >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                    <Text
                        numberOfLines={2}
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 18,
                            color: "#000000",
                            fontWeight: "bold",
                            flexShrink: 1,
                            flexWrap: 'wrap',
                        }}
                    >
                        {item?.name}
                    </Text>
                </View>
                
                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999", marginTop: normalize(8) }}>
                    {"By eMedEd"}
                </Text>
                
                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: normalize(10) }}>
                    <Image source={Imagepath.WrongCal} style={{ height: normalize(18), width: normalize(18), resizeMode: "contain", tintColor: "#848484" }} />
                    <Text style={{
                        fontSize: 14,
                        color: '#000000',
                        fontFamily: Fonts.InterMedium,
                        marginLeft: normalize(5),
                    }}>
                        {"Apr 30 - May 25, 2025  |  Drexel, USA "}
                    </Text>
                </View>
                
                <View style={{ height: 1, width: '100%', backgroundColor: "#DDDDDD" }} />
                
                <View style={{ justifyContent: "flex-end", alignSelf: "flex-end", paddingVertical: normalize(5) }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 20,
                            color: Colorpath.ButtonColr,
                        }}
                    >
                        {item?.price}
                    </Text>
                </View>
            </View>
        </View>
        
        );
    };
    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                    <PageHeader title="Search Results" onBackPress={FilterBack} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", margin: normalize(10), marginBottom: 0 }}>
                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#333333" }}>{"Showing (657) Results for"}</Text>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: normalize(8) }}>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#333333" }}>{"Sort By"}</Text>
                        <Image source={Imagepath.SortedPng} style={{ height: normalize(20), width: normalize(20), resizeMode: "contain" }} />
                    </View>
                </View>
                <View style={{ paddingHorizontal: normalize(10), paddingTop: 0 }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 24, color: Colorpath.ButtonColr }}>{"Internal Medicine"}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={dommyResult}
                        renderItem={intenalMedItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View style={{
                position: 'absolute',
                bottom: 70,
                right: 0,
                paddingHorizontal: normalize(20),
                zIndex: 999
            }}>
                <TouchableOpacity onPress={() => {
                    props.navigation.navigate("FilterScreen");
                }} style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    height: normalize(50),
                    width: normalize(50),
                    backgroundColor: Colorpath.ButtonColr,
                    borderWidth: 0.5,
                    borderColor: "#AAAAAA",
                    borderRadius: normalize(50),
                    paddingHorizontal: normalize(15)
                }}>
                    <Image source={Imagepath.WrongFil} style={{height:normalize(18),width:normalize(18),resizeMode:"contain"}}/>
                </TouchableOpacity>
            </View>
            </SafeAreaView>
        </>
    )
}

export default SearchResult