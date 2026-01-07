import { View, Text, FlatList, TouchableOpacity, Alert, Platform } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/AntDesign'
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import { styles } from '../CMECreditValut/Statevaultstyes';
const ProfessionModal = ({setProfessionstype,profesionstype,professionFetch,profesions,setProfessions,creditModal, setCreditModal, dommyData, setParticular}) => {
    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            isVisible={creditModal}
            backdropColor={Colorpath.black}
            style={{
                width: '100%',
                alignSelf: 'center',
                margin: 0,
            }}
            onBackdropPress={() => setCreditModal(false)}>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setCreditModal(false)}>

                <View
                    style={profesions ? {
                        borderRadius: normalize(7),
                        height: Platform.OS === 'ios' ? normalize(220) : normalize(220),
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        backgroundColor: '#fff',
                    }:{
                        borderRadius: normalize(7),
                        height: Platform.OS === 'ios' ? normalize(180) : normalize(180),
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
                        keyExtractor={item => item.id.toString()}
                        data={dommyData}
                        renderItem={({ item, index }) => {
                            const handlePress = (data) => {
                                console.log(item,)
                                setParticular(item?.name);
                                setProfessions(item?.profession)
                                setCreditModal(false);
                                professionFetch(item);
                                setProfessionstype(item?.profesions_type);
                            };

                            return (
                                <>
                                    <TouchableOpacity
                                        onPress={() => { handlePress(item) }}
                                        style={styles.dropDownItem}
                                    >

                                        <View style={{ paddingHorizontal: normalize(10) }}>
                                            <Icon name={item.Icon} size={20} color={Colorpath.black} />
                                        </View>
                                        <Text style={[styles.dropDownItemText,{bottom:10}]}>
                                            {item?.name}
                                        </Text>

                                    </TouchableOpacity>
                                </>
                            );
                        }}
                    />

                </View>
            </TouchableOpacity>
        </Modal>
    )
}

export default ProfessionModal 