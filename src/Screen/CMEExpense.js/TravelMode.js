import DropDownHeader, { DropdownList, DropdownOption, dropdownStyles } from '../../Components/DropDownHeader';
/**
 * Travel mode screen module. Renders a React Native screen or a screen-scoped support component. Exported members: TravelMode.
 */

import { View, Text, TouchableOpacity, FlatList, Platform } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import { styles } from '../CMECreditValut/Statevaultstyes';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';

/**
 * Reusable TravelMode component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const TravelMode = ({ expenspicker, setExpenspicker, dommyData, traveltake, setTraveltake }) => {
    console.log(traveltake,"traveltake====")
    return (
        <>
            <Modal
                animationIn={'slideInUp'}
                animationOut={'slideOutDown'}
                isVisible={expenspicker}
                backdropColor={Colorpath.black}
                style={{
                    width: '100%',
                    alignSelf: 'center',
                    margin: 0,
                }}
                onBackdropPress={() => setExpenspicker(false)}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setExpenspicker(false)}>

                    <View
                        style={{
                            borderRadius: normalize(7),
                            height: Platform.OS === 'ios' ? normalize(230) : normalize(230),
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            backgroundColor: '#fff',
                        }}>
                        <DropDownHeader standardized title="Travel Mode" onClosePress={() => setExpenspicker(false)} />
                    <DropdownList
                            contentContainerStyle={{
                                paddingBottom: normalize(70),
                                paddingTop: normalize(7),
                            }}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item => item.toString()}
                            data={dommyData}
                            renderItem={({ item, index }) => {
                                return (
                                    <>
                                        <DropdownOption onPress={() => {
                                            setTraveltake(item);
                                            setExpenspicker(false);
                                        }}
                                            selected={traveltake === item}
                                        >
                                            <Text style={dropdownStyles.optionText}>
                                                {item}
                                            </Text>
                                        </DropdownOption>
                                    </>
                                );
                            }}
                        />

                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    )
}

/**
 * Travel mode default export.
 *
 * @returns {*}
 */
export default TravelMode