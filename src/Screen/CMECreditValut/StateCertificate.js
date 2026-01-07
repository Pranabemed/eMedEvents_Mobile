import { View, Text, ScrollView, Platform, KeyboardAvoidingView, TouchableOpacity, FlatList, Image, StatusBar } from 'react-native'
import React, { useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
// import MyStatusBar from '../../Utils/MyStatusBar'
import normalize from '../../Utils/Helpers/Dimen';
import CustomTextField from '../../Components/CustomTextfiled';
import Search from 'react-native-vector-icons/AntDesign';
import Fonts from '../../Themes/Fonts';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import IconDot from 'react-native-vector-icons/Entypo';
import Imagepath from '../../Themes/Imagepath';
import MyStatusBar from '../../Utils/MyStatusBar';
import Certficatecomponent from './Certficatecomponent';
import { SafeAreaView } from 'react-native-safe-area-context'
const StateCertificate = (props) => {
    const certificatpress = () => {
        props.navigation.goBack();
    }
    const [searchText, setSearchText] = useState("");
    const certificateData = [
        { id: 0, name: "Pranab" },
        { id: 1, name: "Shaym" },
        { id: 2, name: "Fana" },
        { id: 3, name: "Pranab" },
        { id: 4, name: "Shaym" },
        { id: 5, name: "Fana" },
        { id: 6, name: "Pranab" },
        { id: 7, name: "Shaym" },
        { id: 8, name: "Fana" }
    ]
    const certificateDatas = [{ id: 0, name: "Pranab" }, { id: 1, name: "Shaym" }, { id: 2, name: "Fana" }]
    const SpecificCertificates = ({ item, index }) => {
        console.log("jhhbj")
        return (
            <View>
                <View style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(8) }}>
                    <View
                        style={{
                            flexDirection: "column",
                            width: normalize(297),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            alignItems: "flex-start",
                            borderWidth: 0.5,
                            borderColor: "#AAAAAA"
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                                <Image source={Imagepath.VaultCer} style={{ height: normalize(20), width: normalize(20), resizeMode: "contain" }} />
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 16,
                                        color: "#000000",
                                        fontWeight: "bold",
                                        flexShrink: 1,
                                        flexWrap: 'wrap',
                                        marginLeft: normalize(10)
                                    }}
                                >
                                    {"Pediatric Nephrology: Recognition and Initial Management of Common Renal..."}
                                </Text>
                            </View>
                            <TouchableOpacity>
                                <IconDot name="dots-three-vertical" size={25} color={"#848484"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

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
                    <PageHeader title="Alaska State Medical Board" onBackPress={certificatpress} />
                ) : (
                    <View style={{ backgroundColor: "#FFFFFF", marginTop: normalize(40) }}>
                        <PageHeader title="Alaska State Medical Board" onBackPress={certificatpress} />
                    </View>
                )}

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <CustomTextField
                            value={searchText}
                            onChangeText={setSearchText}
                            height={normalize(40)}
                            width={normalize(300)}
                            backgroundColor={Colorpath.white}
                            alignSelf={'center'}
                            borderRadius={normalize(9)}
                            placeholder={'Search here '}
                            placeholderTextColor={"#000000"}
                            fontSize={normalize(12)}
                            marginTop={normalize(5)}
                            autoCapitalize="none"
                            color={"#000000"}
                            keyboardType='default'
                            borderWidth={1}
                            borderColor={"#DDDDDD"}
                            rightIcon={Search}
                            rightIconName={"search1"}
                            rightIconSize={23}
                            rightIconColor="#000000"
                            editable={true}
                        />
                      
                        <Certficatecomponent navigation={props.navigation} certificateData={certificateData} />
                        <View>
                            <View style={{ flexDirection: "column" }}>
                                <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#000000" }}>
                                        {"Specialty Specific Certificates"}
                                    </Text>
                                    <ArrowIcon name="keyboard-arrow-down" size={25} color={"#000000"} />
                                </TouchableOpacity>
                                <View style={{ height: 1, width: normalize(295), marginLeft: normalize(10), backgroundColor: "#AAAAAA", justifyContent: "center", alignItems: "center" }} />
                            </View>
                        </View>
                        <View>
                            <FlatList
                                data={certificateDatas}
                                renderItem={SpecificCertificates}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={
                                    <Text
                                        style={{
                                            alignContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            color: Colorpath.grey,
                                            fontWeight: 'bold',
                                            fontFamily: Fonts.InterMedium,
                                            fontSize: normalize(20),
                                            paddingTop: normalize(30),
                                        }}>
                                        No data found
                                    </Text>
                                }
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>

    )
}

export default StateCertificate