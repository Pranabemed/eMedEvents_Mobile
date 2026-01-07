import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colorpath from '../Themes/Colorpath';
import normalize from '../Utils/Helpers/Dimen';
import Modal from 'react-native-modal';
import Fonts from '../Themes/Fonts';
import Buttons from './Button';
const FilterModal = ({
    isfilterVisible,
    onfilterFalse,
    filterName,
    setFilterName,
    onSave,
    stateFiltered,
    setStateFiltered,
    filterState,
    setStateid,
    stateid,
    board,
    specaility
}) => {
    const [modalHeight, setModalHeight] = useState(300);
    console.log(filterState, "filterState-------", filterName, stateFiltered?.length, board)
    const heightConfig = {
        1: 300,
        2: 300,
        3: 300,
        4: 450,
        5: 450,
        6: 500,
        7: 500,
        default: 600
    };
    const finalLength = heightConfig[stateFiltered?.length] || heightConfig.default;
    useEffect(() => {
        const initializedData = filterState?.map(item => ({ ...item, isShow: false }));
        setStateFiltered(initializedData);
    }, []);
    useEffect(() => {
        setModalHeight(isfilterVisible ? finalLength : 300);
    }, [isfilterVisible]);

    const pendingshow = (index) => {
        console.log(index, "index------")
        setStateFiltered((prev) => {
            const newState = prev.map((item, idx) => ({
                ...item,
                isShow: idx === index ? !item.isShow : false
            }));
            adjustModalHeight(newState);
            return newState;
        });
    };
    const adjustModalHeight = (data) => {
        const visibleItems = data.filter(item => item.isShow).length;
        setModalHeight(visibleItems > 0 ? finalLength : 300);
    };
    useEffect(() => {
        if (filterState && filterState.length > 0) {
            const selectedData = filterState.find(item => item.id === stateid) || filterState[0];
            const initializedData = filterState.map(item => ({
                ...item,
                isShow: item.id === selectedData.id,
            }));
            setStateFiltered(initializedData);
            setFilterName(selectedData.name);
            setStateid(selectedData.id);
        }
    }, [stateid, filterState]);
    const stateDataFilter = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    pendingshow(index);
                    setFilterName(item?.name);
                    setStateid(item?.id);
                    onfilterFalse();
                }}
                style={{
                    paddingHorizontal: normalize(10),
                    paddingVertical: normalize(10),
                    borderWidth: 0.5,
                    borderColor: "#000000",
                    borderRadius: normalize(25),
                    backgroundColor: item?.isShow ? Colorpath.ButtonColr : "#FFFFFF",
                    margin: normalize(5),
                    justifyContent: "center", alignContent: "center"
                }}
            >
                <Text style={board ? { fontFamily: Fonts.InterRegular, fontSize: 16, color: item?.isShow ? Colorpath.white : "#333333" } : { alignSelf: "center", fontFamily: Fonts.InterRegular, fontSize: 16, color: item?.isShow ? Colorpath.white : "#333333" }}>
                    {item?.name}
                </Text>
            </TouchableOpacity>
        );
    };
    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={isfilterVisible}
            style={{ width: '100%', alignSelf: 'center', margin: 0 }}
            animationInTiming={800}
            animationOutTiming={1000}
            onBackdropPress={() => {
                onfilterFalse();
            }}
            onBackButtonPress={() => {
                onfilterFalse();
            }}
        >
            <View style={[styles.modalView, { height: modalHeight }]}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    {/* <View style={styles.modalIndicator} /> */}
                </View>
                <View>
                    {/* <View style={styles.container}>
                        <Buttons
                            onPress={() => { onfilterFalse(); }}
                            height={normalize(45)}
                            width={normalize(110)}
                            backgroundColor={Colorpath.white}
                            borderRadius={normalize(5)}
                            text="Cancel"
                            color={"#666666"}
                            fontSize={16}
                            fontFamily={Fonts.InterSemiBold}
                            fontWeight={"bold"}
                        />
                        <Buttons
                            onPress={() => {
                                onSave();
                                onfilterFalse();
                            }}
                            height={normalize(45)}
                            width={normalize(110)}
                            backgroundColor={filterName ? Colorpath.ButtonColr : "#CCC"}
                            borderRadius={normalize(5)}
                            text="Submit"
                            color={Colorpath.white}
                            fontSize={16}
                            fontFamily={Fonts.InterMedium}
                            fontWeight={"bold"}
                            disabled={filterName ? false : true}
                        />
                    </View> */}
                    <ScrollView>
                        <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(10) }}>
                            <Text style={{ fontFamily: Fonts.InterBold, fontSize: 14, color: "#999999", textTransform: "uppercase" }}>
                                {board ? "SORT BY BOARD" : specaility ? "SORT BY SPECIALTY" : "SORT BY STATE"}
                            </Text>
                        </View>
                        <View style={styles.container}>
                            <FlatList
                                data={stateFiltered}
                                renderItem={stateDataFilter}
                                contentContainerStyle={{ paddingBottom: normalize(10) }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
export default FilterModal;
const styles = StyleSheet.create({
    container: {
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(10),
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "space-between",
    },
    modalView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopRightRadius: normalize(20),
        borderTopLeftRadius: normalize(20),
        paddingVertical: normalize(10),
    },
    modalIndicator: {
        height: 5,
        width: normalize(100),
        backgroundColor: "#DDDDDD",
        borderRadius: 5,
    }
});
