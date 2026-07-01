/**
 * Drop down header reusable component module. Provides a React Native UI building block used across screens. Exported members: DropDownHeader.
 */

import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import CloseIcon from 'react-native-vector-icons/AntDesign';
import Colorpath from '../Themes/Colorpath';
import Fonts from '../Themes/Fonts';
import normalize from '../Utils/Helpers/Dimen';

/**
 * Reusable DropDownHeader component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const DropDownHeader = ({title,onClosePress}) => {
    return (
        <View style={{
            height: normalize(40),
            width: normalize(330),
            backgroundColor: "#FFFFFF",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between', 
            paddingHorizontal: normalize(10) 
        }}>
            <Text numberOfLines={1} style={{
                fontFamily: Fonts.InterSemiBold,
                fontSize: 20,
                color: "#000000",
                fontWeight: "bold",
                width: normalize(250), 
                marginLeft: normalize(10)  
            }}>
                {title}
            </Text>
            <TouchableOpacity onPress={onClosePress} style={{
                padding: normalize(5),
                marginRight:normalize(15)
            }}> 
                <CloseIcon
                    name="close"
                    size={25} 
                    color={Colorpath.black}
                />
            </TouchableOpacity>
        </View>
        
    )
}

/**
 * Drop down header default export.
 *
 * @returns {*}
 */
export default DropDownHeader