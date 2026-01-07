import { View, Text, KeyboardAvoidingView, Platform, FlatList, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import Colorpath from '../Themes/Colorpath';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';
import { styles } from '../Screen/CMECreditValut/Statevaultstyes';
import MyStatusBar from '../Utils/MyStatusBar';
import PageHeader from './PageHeader';
import { SafeAreaView } from 'react-native-safe-area-context'
const StateDataComponent = ({navigation,searchpratice, searchStateNamePratice, setSearchState, Icon, slistpratice, setStatepratice, setSpecailidpratice }) => {
    const courseRole =()=>{
        navigation.goBack();
    }
    return (
  <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
                    <SafeAreaView
                        style={{
                            backgroundColor: Colorpath.Pagebg,
                            flex: 1,
                            width: '100%',
                        }}
                    >
                {Platform.OS == 'ios' ? <PageHeader
                    title="Search State ..."
                    onBackPress={courseRole}
                /> : <View>
                    <PageHeader
                        title="Search State ..."
                        onBackPress={courseRole}
                    />
                </View>}
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS == 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={normalize(70)}
                    >
                        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: normalize(20) }}>
                            {/* <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSearchState("");
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: '50%',
                                        transform: [{ translateX: -normalize(25) }],
                                        zIndex: 1,
                                        backgroundColor: "white",
                                        height: normalize(50),
                                        width: normalize(50),
                                        borderRadius: normalize(30),
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                </TouchableOpacity>
                            </View> */}

                            <View
                                style={{
                                    borderRadius: normalize(7),
                                    height: Platform.select({
                                        ios: normalize(500),
                                        android: normalize(390),
                                    }),
                                    width: '100%',
                                    backgroundColor: Colorpath.Pagebg,
                                    marginTop: normalize(60)
                                }}
                            >
                                <View
                                    style={{
                                        paddingHorizontal: normalize(10),
                                        alignItems: 'center',
                                        borderRadius: normalize(9),
                                        alignSelf: 'center',
                                        marginTop: normalize(15),
                                    }}
                                >
                                    <TextInput
                                        placeholder={'Search State*'}
                                        value={searchpratice}
                                        onChangeText={searchStateNamePratice}
                                        style={{
                                            height: normalize(45),
                                            width: normalize(270),
                                            alignSelf: 'center',
                                            borderRadius: normalize(9),
                                            paddingHorizontal: normalize(10),
                                            fontSize: 12,
                                            color: Colorpath.black,
                                            backgroundColor: Colorpath.textField,
                                            borderWidth: 0.5,
                                            borderColor: "#999"
                                        }}
                                        placeholderTextColor={Colorpath.placeholder}
                                    />
                                </View>

                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: normalize(90),
                                        paddingTop: normalize(7),
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={item => item.id}
                                    data={slistpratice}
                                    ListEmptyComponent={
                                        <View
                                            style={{
                                                height: Platform.select({
                                                    ios: normalize(500),
                                                    android: normalize(390),
                                                }),
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    alignContent: 'center',
                                                    alignItems: 'center',
                                                    alignSelf: 'center',
                                                    color: Colorpath.grey,
                                                    fontWeight: 'bold',
                                                    fontFamily: Fonts.InterSemiBold,
                                                    fontSize: 20,
                                                    paddingTop: normalize(30),
                                                }}
                                            >
                                                No state found
                                            </Text>
                                        </View>
                                    }
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                    setStatepratice(item?.name);
                                                    setSpecailidpratice(item.id);
                                                    Keyboard.dismiss();
                                                }}
                                                style={[styles.dropDownItem]}
                                            >
                                                <Text style={[styles.dropDownItemText]}>
                                                    {item?.name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>

            </>
            )
}

            export default StateDataComponent