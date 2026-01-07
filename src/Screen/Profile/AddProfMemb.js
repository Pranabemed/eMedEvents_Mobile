import { View, Text, Platform, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import TextFieldIn from '../../Components/Textfield'
import CustomTextField from '../../Components/CustomTextfiled';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../../Themes/Fonts'
import Buttons from '../../Components/Button';
import { SafeAreaView } from 'react-native-safe-area-context'

const AddProfMemb = (props) => {
    const SearchBack = () => {
        props.navigation.goBack();
    }
    const [take, setTake] = useState("")
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
                            title="Add Professional Memberships"
                            onBackPress={SearchBack}
                        />
                    ) : (
                        <PageHeader
                            title="Add Professional Memberships"
                            onBackPress={SearchBack}
                        />

                    )}
                </View>
                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }} behavior={Platform.OS === 'ios' ? 'height' : undefined}>
                    <ScrollView contentContainerStyle={{ paddingBottom: normalize(50) }}>
                    <View style={{ alignItems: 'center' }}>
                            <View
                                style={{
                                    borderBottomColor: '#000000',
                                    borderBottomWidth: 0.5,
                                    marginTop: normalize(5)
                                }}>
                                <TouchableOpacity>
                                    <CustomTextField
                                        value={take}
                                        onChangeText={(val) => setTake(val)}
                                        color={"#000000"}
                                        height={normalize(50)}
                                        width={normalize(300)}
                                        backgroundColor={Colorpath.Pagebg}
                                        alignSelf={'center'}
                                        placeholder={'Association Name*'}
                                        placeholderTextColor="#AAAAAA"
                                        fontSize={16}
                                        fontFamily={Fonts.InterRegular}
                                        // marginTop={normalize(15)}
                                        autoCapitalize="none"
                                        keyboardType='default'
                                        // borderWidth={1}
                                        borderColor={"#DDDDDD"}
                                        rightIcon={ArrowIcon}
                                        rightIconName={"keyboard-arrow-down"}
                                        rightIconSize={25}
                                        rightIconColor="#63748b"
                                        editable={false}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <View
                                style={{
                                    borderBottomColor: '#000000',
                                    borderBottomWidth: 0.5,
                                    marginTop: normalize(5)
                                }}>
                                <TouchableOpacity>
                                    <CustomTextField
                                        value={take}
                                        onChangeText={(val) => setTake(val)}
                                        color={"#000000"}
                                        height={normalize(50)}
                                        width={normalize(300)}
                                        backgroundColor={Colorpath.Pagebg}
                                        alignSelf={'center'}
                                        placeholder={'Membership type*'}
                                        placeholderTextColor="#AAAAAA"
                                        fontSize={16}
                                        fontFamily={Fonts.InterRegular}
                                        // marginTop={normalize(15)}
                                        autoCapitalize="none"
                                        keyboardType='default'
                                        // borderWidth={1}
                                        borderColor={"#DDDDDD"}
                                        rightIcon={ArrowIcon}
                                        rightIconName={"keyboard-arrow-down"}
                                        rightIconSize={25}
                                        rightIconColor="#63748b"
                                        editable={false}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <View
                                style={{
                                    borderBottomColor: '#000000',
                                    borderBottomWidth: 0.5,
                                    marginTop: normalize(5)
                                }}>
                                <TouchableOpacity>
                                    <CustomTextField
                                        value={take}
                                        onChangeText={(val) => setTake(val)}
                                        color={"#000000"}
                                        height={normalize(50)}
                                        width={normalize(300)}
                                        backgroundColor={Colorpath.Pagebg}
                                        alignSelf={'center'}
                                        placeholder={'Membership Other*'}
                                        placeholderTextColor="#AAAAAA"
                                        fontSize={16}
                                        fontFamily={Fonts.InterRegular}
                                        // marginTop={normalize(15)}
                                        autoCapitalize="none"
                                        keyboardType='default'
                                        // borderWidth={1}
                                        borderColor={"#DDDDDD"}
                                        rightIcon={ArrowIcon}
                                        rightIconName={"keyboard-arrow-down"}
                                        rightIconSize={25}
                                        rightIconColor="#63748b"
                                        editable={false}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Buttons
                            onPress={() => { props.navigation.goBack() }}
                            height={normalize(45)}
                            width={normalize(310)}
                            backgroundColor={Colorpath.ButtonColr}
                            borderRadius={normalize(9)}
                            text="Save"
                            color={Colorpath.white}
                            fontSize={18}
                            fontFamily={Fonts.InterSemiBold}
                            marginTop={normalize(30)}
                        />
                        <Buttons
                            onPress={() => { props.navigation.goBack() }}
                            height={normalize(45)}
                            width={normalize(310)}
                            borderRadius={normalize(9)}
                            text="Cancel"
                            color={Colorpath.ButtonColr}
                            fontSize={14}
                            fontFamily={Fonts.InterSemiBold}
                            marginTop={normalize(10)}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}

export default AddProfMemb