import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Fonts from '../../Themes/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context'
const AddToCartNo = (props) => {

    const cartPressNo = () => {
        props.navigation.navigate("Statewebcast", { newCast: props?.route?.params?.addtocart?.urlneedTake });
    }
useLayoutEffect(() => {
            props.navigation.setOptions({ gestureEnabled: false });
        }, []);
    return (
        <>
            <MyStatusBar
                barStyle={"light-content"}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.white }}>
                {Platform.OS === "ios" ? (
                    <PageHeader
                        title="Cart"
                        onBackPress={cartPressNo}
                    />
                ) : (
                    <View style={{ marginTop: normalize(40) }}>
                        <PageHeader
                            title="Cart"
                            onBackPress={cartPressNo}
                        />
                    </View>
                )}
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "height" : undefined}>
                    <ScrollView contentContainerStyle={{ paddingBottom: normalize(120) }}>
                        <View>
                            <View style={{ paddingHorizontal:normalize(10),paddingVertical:normalize(10), justifyContent: "center",backgroundColor:Colorpath.Pagebg }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 16,
                                        color: "#000000",
                                        fontWeight: "bold",
                                        alignSelf: "center"
                                    }}
                                >
                                    {"There are no records located."}
                                </Text>
                            </View>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}

export default AddToCartNo