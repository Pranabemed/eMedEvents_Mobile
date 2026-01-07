import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import Modal from 'react-native-modal';
import Fonts from '../../Themes/Fonts';
import Buttons from '../../Components/Button';
import RenderHTML from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';

const CMEChecklistModal = ({ certificatedata, allProfession, allProfessionData, setAllProfessionData, isVisibelCME, onCMEClose, onSaved }) => {
    // const firstOption = Object.keys(allProfessionData?.cme_data || {})[0] || "";

    const allOptions = Object.keys(allProfessionData?.cme_data || {}) || "";
    const firstOption = allOptions?.[0];
    const [selectedOption, setSelectedOption] = useState(firstOption);
    const [modalHeightcme, setModalHeightcme] = useState(300);
    const [colortrue, setColortrue] = useState(false);
    const navigation = useNavigation();
    useEffect(() => {
        if (allOptions?.length > 0) {
            setSelectedOption(firstOption);
            setColortrue(prev => !prev);
        }
    }, [allProfessionData]);
    useEffect(() => {
        setModalHeightcme(isVisibelCME ? 600 : 300);
        console.log("Modal visibility changed:", isVisibelCME);
    }, [isVisibelCME]);
    useEffect(() => {
        setColortrue(!colortrue);
        setSelectedOption(firstOption);
    }, [allProfessionData]);
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setColortrue(prev => !prev);
        console.log("Option selected:", option);
    };
    const { width } = useWindowDimensions();
    const selectedData = allProfessionData?.cme_data?.[selectedOption];
    if (!selectedData) {
        console.log("No selected data available for:", selectedOption);
        return null;
    }
    console.log(firstOption)
    const StateCMEChekck = (allProfession, stateID, rqsttype, mainkey, newState, anothKey, keySmain) => {
        navigation.navigate("Globalresult", { trig: { allProfessionMain: allProfession, stateID: stateID, rqstType: rqsttype, mainKey: mainkey, newAdd: newState, newCt: anothKey, datamainkey: keySmain } });
    }
    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={isVisibelCME}
            style={{ width: '100%', alignSelf: 'center', margin: 0 }}
            animationInTiming={800}
            animationOutTiming={1000}
        >
            <View style={[styles.modalView, { height: modalHeightcme }]}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Pressable onPress={() => {
                        onSaved();
                        onCMEClose();
                    }}>
                        <View style={styles.modalIndicator} />
                    </Pressable>
                </View>
                <View>
                    <View style={styles.container}>
                        <Buttons
                            onPress={() => { onCMEClose(); }}
                            height={normalize(45)}
                            width={normalize(160)}
                            backgroundColor={Colorpath.white}
                            borderRadius={normalize(5)}
                            text="Know Your State CME Requirements"
                            color={"#000000"}
                            fontSize={18}
                            fontFamily={Fonts.InterSemiBold}
                            fontWeight={"bold"}
                        />
                        <Buttons
                            onPress={() => {
                                onSaved();
                                onCMEClose();
                            }}
                            height={normalize(45)}
                            width={normalize(110)}
                            backgroundColor={Colorpath.white}
                            borderRadius={normalize(5)}
                            text="Close"
                            color={"#666666"}
                            fontSize={16}
                            fontFamily={Fonts.InterMedium}
                            fontWeight={"bold"}
                            disabled={false}
                        />
                    </View>
                    <ScrollView contentContainerStyle={{ paddingBottom: normalize(120) }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignContent: "space-evenly" }}>
                            {Object.keys(allProfessionData?.cme_data || {}).map((optionKey) => (
                                <TouchableOpacity
                                    key={optionKey}
                                    onPress={() => handleOptionSelect(optionKey)}
                                    style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(0) }}
                                >
                                    <Text style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 16,
                                        color: selectedOption === optionKey ? "#FF773D" : "#000000",
                                        fontWeight: "bold"
                                    }}>
                                        {optionKey}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View
                            style={{
                                justifyContent: "center",
                                alignSelf: "center",
                                margin: normalize(10),
                                height: 1,
                                width: normalize(290),
                                backgroundColor: "#AAAAAA"
                            }}
                        >
                            <View style={{ justifyContent: "center", alignSelf: "center", margin: normalize(10), height: 1, width: normalize(290), backgroundColor: "#AAAAAA", position: 'relative' }}>
                                {selectedOption && (
                                    <View
                                        style={{
                                            height: 1,
                                            backgroundColor: "#FF773D",
                                            width: normalize(290 / allOptions.length),
                                            position: 'absolute',
                                            left: normalize(
                                                (290 / allOptions.length) *
                                                allOptions.indexOf(selectedOption)
                                            ),
                                        }}
                                    />
                                )}
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(0) }}>
                            <Text numberOfLines={2} style={{ flex: 1, fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000", fontWeight: "bold" }}>
                                {selectedData?.name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: normalize(16), paddingVertical: normalize(10), width: "100%" }}>
                            <Text numberOfLines={2} style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000" }}>
                                {`${allProfessionData?.creditRequiredText} ${selectedData?.credits} credits | Licensing Cycle: ${selectedData?.term} Year(s) | ${allProfessionData?.creditCategory} ${selectedData?.amapra_cat_credits}`}
                            </Text>
                        </View>
                        <View style={{ width: "100%", paddingHorizontal: normalize(5), paddingVertical: normalize(0) }}>
                            <View style={{ paddingHorizontal: normalize(8), paddingVertical: normalize(2), width: "100%" }}>
                                <RenderHTML
                                    contentWidth={width}
                                    source={{ html: selectedData?.additional_notes }}
                                    tagsStyles={{
                                        ...styles.tagsStyles,
                                        p: {
                                            color: '#000',
                                            marginVertical: normalize(5),
                                            paddingHorizontal: normalize(5),
                                        },
                                        div: {
                                            color: '#000',
                                            marginVertical: normalize(5),
                                            paddingHorizontal: normalize(5),
                                        }
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ paddingVertical: normalize(10) }}>
                            <Buttons
                                onPress={() => {
                                    StateCMEChekck(allProfession, certificatedata?.state_id, "professionlandingpage", "listby_type", "state_id", "profession_name", "medicalresourselanding");
                                    onCMEClose();
                                }}
                                height={normalize(45)}
                                width={normalize(200)}
                                backgroundColor={Colorpath.white}
                                borderRadius={normalize(5)}
                                text="Browse Courses"
                                color={Colorpath.ButtonColr}
                                fontSize={16}
                                fontFamily={Fonts.InterMedium}
                                borderWidth={0.5}
                                borderColor={Colorpath.ButtonColr}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default CMEChecklistModal;

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
    },
    tagsStyles: {
        ul: {
            marginVertical: 10,
            paddingLeft: 20
        },
        li: {
            fontFamily: Fonts.InterSemiBold,
            marginBottom: 5,
            fontSize: 16,
            color: '#000',
        },
    },
});
