import { View, Text, Platform, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useLayoutEffect } from 'react'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import Fonts from '../../Themes/Fonts';
import ShareIcn from 'react-native-vector-icons/AntDesign';
import Imagepath from '../../Themes/Imagepath';
import { CommonActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'
const DashboardTrans = (props) => {
    const profileBack = () => {
        props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: "TabNav" }
              ],
            }))
    }
    const transData =[{id:0,name:"Registration"},{id:1,name:"Subscriptions Transaction"},{id:2,name:"Wallet Transactions"},{id:3,name:"Subscription"}]
    const tarnsListing = ({ item, index }) => {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    height: normalize(50),
                    width: normalize(300),
                    borderWidth: 1,
                    borderColor: "#DDDDDD",
                    borderRadius: normalize(8),
                    shadowColor: "#000",
                    shadowOffset: { height: 3, width: 0 },
                    shadowOpacity: 10,
                    shadowRadius: 10,
                    elevation: 3,
                }}>

                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: normalize(10),
                        gap: normalize(10)
                    }}>
                        <Text style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: "#000000"
                        }}>
                            {item?.name}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        if(item?.id == 2 ){
                           props.navigation.navigate("Wallets",{name:item?.name})
                        }else if(item?.id == 3){
                            props.navigation.navigate("HCPSub");
                        } else {
                            props.navigation.navigate("Registration",{name:item?.name});
                        }
                    }} style={{ width: normalize(40) }}>
                        <ShareIcn name="right" color={"#000000"} size={25} />
                    </TouchableOpacity>
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
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="Transaction"
                            onBackPress={profileBack}
                        />
                    ) : (
                        <PageHeader
                            title="Transaction"
                            onBackPress={profileBack}
                        />

                    )}
                </View>
                <View style={{justifyContent:"center",alignItems:"center",paddingVertical:normalize(10)}}>
                <Image source={Imagepath.eMedfulllogo} style={{ alignSelf: "center", height: normalize(40), width: normalize(212) }} resizeMode="contain" />
                </View>
                <View>
                    <FlatList 
                    data={transData} 
                    renderItem={tarnsListing} 
                    keyExtractor={(item, index) => index.toString()} />
                </View>
            </SafeAreaView>
        </>
    )
}

export default DashboardTrans