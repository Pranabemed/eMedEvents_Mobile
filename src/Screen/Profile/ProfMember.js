import { View, Text, Platform, FlatList, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import PageHeader from '../../Components/PageHeader';
import IconDot from 'react-native-vector-icons/Entypo';
import Search from 'react-native-vector-icons/AntDesign';
import Fonts from '../../Themes/Fonts';
import ProfileModal from './ProfileModal';
import { SafeAreaView } from 'react-native-safe-area-context'
const ProfMember = (props) => {
    const SearchBack = () => {
        props.navigation.goBack();
    }
    const stateTake = [{ id: 0, name: "American Academy of Allergy Asthma and Immunology - AAAAI" }, { id: 1, name: "Alpha Omega Alpha Honor Medical Society - AOA" }];
    const [profiletakeshow, setProfiletakeshow] = useState(false);
    const stateTakeItem = ({ item, index }) => {
        return (
            <View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                    <View
                        style={{
                            flexDirection: "column",
                            width: normalize(290),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.2,
                            shadowRadius: 2,
                            elevation: 5
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: '100%'
                            }}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 16,
                                                color: "#000000",
                                                fontWeight: "bold",
                                                flexWrap: 'wrap',
                                                lineHeight: 20, 
                                            }}
                                            numberOfLines={2} 
                                            ellipsizeMode="tail" 
                                        >
                                            {item?.name}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => setProfiletakeshow(!profiletakeshow)} style={{ marginTop: normalize(-8) }}>
                                    <IconDot name="dots-three-vertical" size={22} color={"#848484"} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ height: 0.8, width: normalize(273), backgroundColor: "#DADADA", marginTop: normalize(5) }} />
                        <View style={{ justifyContent: "flex-start", alignItems: "flex-start"}}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>{"Member"}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="Professional Memberships"
                            onBackPress={SearchBack}
                        />
                    ) : (
                        <PageHeader
                            title="Professional Memberships"
                            onBackPress={SearchBack}
                        />
                    )}
                </View>
                <View>
                    <FlatList
                        data={stateTake}
                        renderItem={stateTakeItem}
                        keyExtractor={(index, item) => index.toString()} />
                </View>
                <View style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 0,
                    paddingHorizontal: normalize(20),
                    zIndex: 999
                }}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate("AddProfMemb", { profile: "text" });
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
                        <Search name="plus" color={Colorpath.white} size={25} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <ProfileModal setProfiletakeshow={setProfiletakeshow} profiletakeshow={profiletakeshow} remove={"text"}/>
        </>
    )
}
export default ProfMember