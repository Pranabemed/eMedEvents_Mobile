import { View, Text } from 'react-native'
import React from 'react'
import Buttons from '../../Components/Button';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
const StatewebcastPratcing = ({navigate}) => {
  return (
    <View
    style={{
        backgroundColor: Colorpath.Pagebg,
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10),
        margin: normalize(10),
        borderBottomRightRadius: normalize(10),
        borderBottomLeftRadius: normalize(10),
        borderTopStartRadius: normalize(10),
        borderTopEndRadius: normalize(10),
        shadowColor: "#000",
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.1,
        elevation: 5,
        shadowRadius: 5
    }}>
    <View
        style={{
            paddingHorizontal: normalize(10),
            paddingVertical: normalize(10),
        }}>
        <Text
            style={{
                fontFamily: Fonts.InterSemiBold,
                fontSize: 16,
                color: '#000000',
                fontWeight: 'bold',
                width: "90%"
            }}>
            {'Practicing in different states? No Problem! We provide course bundles designed for every state'}
        </Text>
    </View>
    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
        <Buttons
            onPress={() => {
                navigate.navigate('ExploreCastCourse',{clearDat:"clearDat"});
            }}
            height={normalize(45)}
            width={normalize(270)}
            backgroundColor={Colorpath.ButtonColr}
            borderRadius={normalize(9)}
            text="Click here to course bundle of all the states"
            color={Colorpath.white}
            fontSize={16}
            fontFamily={Fonts.InterSemiBold}

        //   marginTop={normalize(30)}
        />
    </View>

</View>
  )
}

export default StatewebcastPratcing