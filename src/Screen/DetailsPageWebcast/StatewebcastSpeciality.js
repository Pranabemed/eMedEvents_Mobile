import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
const StatewebcastSpeciality = ({ allSpecailities, specailityChange, expandspecail }) => {
    const specialityShow = ({ index, item }) => {
        return (
            <View style={{ paddingVertical: normalize(5) }}>
                <View style={{ padding: 10, borderWidth: 0.5, borderColor: "#DDDDDD", paddingVertical: normalize(7), marginLeft: normalize(8), backgroundColor: "#F5FAFF", borderRadius: normalize(5) }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: '#000000',
                            alignSelf: "center"
                        }}>
                        {item}
                    </Text>
                </View>
            </View>
        )
    }
    return (
        <View style={{ paddingVertical: normalize(0), marginLeft: normalize(6), paddingRight: normalize(15) }}>
            {allSpecailities?.length > 0 ? (
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {allSpecailities.map((item, index) => (
                        <React.Fragment key={`${item}-${index}`}>
                            {specialityShow({ item, index })}
                        </React.Fragment>
                    ))}
                </ScrollView>
            ) : null}
        </View>
    )
}

export default StatewebcastSpeciality
