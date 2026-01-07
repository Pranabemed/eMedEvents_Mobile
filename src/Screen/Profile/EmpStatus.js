import { View, Text, FlatList, TouchableOpacity, Alert, Platform, StyleSheet } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
const EmpStatusModal = ({ setEmpstatusname, empstatusname, profiletakeshow, setProfiletakeshow }) => {
    const profileData = [{ id: 0, name: "Full-Time" }, { id: 1, name: "Part-Time" }, { id: 2, name: "Locum Tenens" }, { id: 3, name: "Telemedicine" }, { id: 4, name: "Volunteer" }, { id: 5, name: "Non-Clinical/Others" }];
    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            isVisible={profiletakeshow}
            backdropColor={Colorpath.black}
            style={{
                width: '100%',
                alignSelf: 'center',
                margin: 0,
            }}
            onBackdropPress={() => setProfiletakeshow(false)}>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setProfiletakeshow(false)}>

                <View
                    style={{
                        borderRadius: normalize(7),
                        height: Platform.OS === 'ios' ? normalize(320) : normalize(320),
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
                        data={profileData}
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    <TouchableOpacity onPress={() => {
                                        setProfiletakeshow(!profiletakeshow);
                                        setEmpstatusname(item?.name);
                                    }}
                                        style={styles.dropDownItem}
                                    >
                                        <Text style={styles.dropDownItemText}>
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

export default EmpStatusModal
const styles = StyleSheet.create({
    dropDownItem: {
        borderWidth: 1,
        marginTop: normalize(10),
        justifyContent: 'center',
        alignItems: 'center',
        height: normalize(40),
        width: '85%',
        alignSelf: 'center',
        flexDirection: "row"
    },
    dropDownItemText: {
        fontSize: 16,
        lineHeight: normalize(14),
        textAlign: 'center',
        color: Colorpath.black,
        textTransform: 'capitalize',
        fontFamily: Fonts.InterMedium
    }
});