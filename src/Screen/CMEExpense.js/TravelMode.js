import { View, Text, TouchableOpacity, FlatList, Platform } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import { styles } from '../CMECreditValut/Statevaultstyes';
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';

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
                        <FlatList
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
                                        <TouchableOpacity onPress={() => {
                                            setTraveltake(item);
                                            setExpenspicker(false);
                                        }}
                                            style={[styles.dropDownItem, { flexDirection: "row" }]}
                                        >
                                            <Text style={styles.dropDownItemText}>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
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

export default TravelMode