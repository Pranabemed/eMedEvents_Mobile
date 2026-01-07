import { View, Text, Platform } from 'react-native'
import React from 'react'
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import PageHeader from '../../Components/PageHeader';
import { CommonActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'
const GlobalSearch = (props) => {
    const SearchBack =()=>{
        props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "TabNav",
                }
              ]
            })
          );
    }
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
                    title="Search"
                    onBackPress={SearchBack}
                />
            ) : (
                <PageHeader
                    title="Search"
                    onBackPress={SearchBack}
                />

            )}
        </View>
    </SafeAreaView>
    </>
  )
}

export default GlobalSearch