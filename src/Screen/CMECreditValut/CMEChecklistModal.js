/**
 * Cmechecklist modal screen module. Renders a React Native screen or a screen-scoped support component. Exported members: CMEChecklistModal, handleOptionSelect, handleTabLayout, StateCMEChekck, styles.
 */

import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import Modal from 'react-native-modal';
import Fonts from '../../Themes/Fonts';
import Buttons from '../../Components/Button';
import RenderHTML from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';

/**
 * Reusable CMEChecklistModal component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const CMEChecklistModal = ({ certificatedata, allProfession, allProfessionData, setAllProfessionData, isVisibelCME, onCMEClose, onSaved, cmeRealback, selectedState, onBrowseCourses }) => {
    // const firstOption = Object.keys(allProfessionData?.cme_data || {})[0] || "";

    const allOptions = Object.keys(allProfessionData?.cme_data || {}) || "";
    const firstOption = allOptions?.[0];
    const [selectedOption, setSelectedOption] = useState(firstOption);
    const [modalHeightcme, setModalHeightcme] = useState(300);
    const [tabWidths, setTabWidths] = useState({});
    const navigation = useNavigation();
    useEffect(() => {
        if (firstOption) {
            setSelectedOption(firstOption);
        }
    }, [firstOption]);
    useEffect(() => {
        setModalHeightcme(isVisibelCME ? 600 : 300);
        console.log("Modal visibility changed:", isVisibelCME);
    }, [isVisibelCME]);
        /**
 * Handles option select.
 * @param {*} option - Input value.
 * @returns {void}
 */
const handleOptionSelect = (option) => {
        setSelectedOption(option);
        console.log("Option selected:", option);
    };
        /**
 * Handles tab layout.
 * @param {*} optionKey - Input value.
 * @param {*} widthValue - Input value.
 * @returns {void}
 */
const handleTabLayout = (optionKey, widthValue) => {
        setTabWidths(prev => {
            if (prev[optionKey] === widthValue) return prev;
            return { ...prev, [optionKey]: widthValue };
        });
    };
    const { width } = useWindowDimensions();
    const optionCount = Object.keys(allProfessionData?.cme_data || {}).length || 1;
    const tabItemWidth = width / optionCount;
    const selectedData = allProfessionData?.cme_data?.[selectedOption];
    if (!selectedData) {
        console.log("No selected data available for:", selectedOption);
        return null;
    }
    console.log(firstOption)
        /**
 * State cmechekck component.
 * @param {*} professionValue - Input value.
 * @param {*} stateID - Input value.
 * @param {*} rqsttype - Input value.
 * @param {*} mainkey - Input value.
 * @param {*} newState - Input value.
 * @param {*} anothKey - Input value.
 * @param {*} keySmain - Input value.
 * @returns {void}
 */
const StateCMEChekck = (professionValue, stateID, rqsttype, mainkey, newState, anothKey, keySmain) => {
        const params = {
            trig: {
                allProfessionMain: professionValue,
                stateID: stateID,
                rqstType: rqsttype,
                mainKey: mainkey,
                newAdd: newState,
                newCt: anothKey,
                datamainkey: keySmain,
                Realback: cmeRealback,
                guestCmeFlow: cmeRealback === 'guest',
                refreshKey: Date.now(),
            },
            guestCmeFlow: cmeRealback === 'guest',
            guestSelection: cmeRealback === 'guest' ? {
                profession: professionValue,
                stateId: stateID,
                state: selectedState || null,
                stateName: selectedState?.name || selectedState?.state_name || selectedState?.title || '',
            } : undefined,
        };

        if (onBrowseCourses) {
            onBrowseCourses(params);
            return;
        }

        navigation.navigate("Globalresult", params);
    }
    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={isVisibelCME}
            style={{ width: '100%', alignSelf: 'center', margin: 0 }}
            animationInTiming={400}
            animationOutTiming={400}
            useNativeDriver={true}
            onBackdropPress={onCMEClose}
            onBackButtonPress={onCMEClose}
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
                    <ScrollView contentContainerStyle={{ paddingBottom: normalize(120)}}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: normalize(8), alignItems: 'center' }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center", width: width - normalize(16) }}>
                                {Object.keys(allProfessionData?.cme_data || {}).map((optionKey) => (
                                    <TouchableOpacity
                                        key={optionKey}
                                        onPress={() => handleOptionSelect(optionKey)}
                                    style={{
                                        flex: 1,
                                        paddingVertical: normalize(6),
                                        borderBottomWidth: 1,
                                        borderBottomColor: selectedOption === optionKey ? '#FF773D' : '#cccccc',
                                        alignItems: 'center',
                                    }}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 16,
                                                color: selectedOption === optionKey ? "#FF773D" : "#000000",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {optionKey}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                        <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(0), marginTop: normalize(10) }}>
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
                                    renderersProps={{
                                        a: {
                                                                                        /**
 * On press helper.
 * @param {*} event - Input value.
 * @param {*} href - Input value.
 * @returns {void}
 */
onPress: (event, href) => {
                                                if (href) {
                                                    let resultTopic = href.substring(href.lastIndexOf('/') + 1);
                                                    if (href.includes('/topic/')) {
                                                        navigation.navigate("Globalresult", { trig: { trig: resultTopic, rqstType: "topicbasedconferences", mainKey: "topic", CreditData: "", Realback: cmeRealback } });
                                                    } else if (href.includes('/specialty/')) {
                                                        navigation.navigate("Globalresult", { trig: { trig: resultTopic, rqstType: "specialityconferences", mainKey: "conference_specialitiy", CreditData: "", Realback: cmeRealback } });
                                                    } else {
                                                        // fallback to topicbasedconferences
                                                        let keyword = href.split('/').pop();
                                                        navigation.navigate("Globalresult", { trig: { trig: keyword, rqstType: "topicbasedconferences", mainKey: "topic", CreditData: "", Realback: cmeRealback } });
                                                    }
                                                }
                                                onSaved();
                                                onCMEClose();
                                            }
                                        }
                                    }}
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
                                        },
                                        a: {
                                            color: Colorpath.ButtonColr,
                                            textDecorationLine: 'underline',
                                        },
                                        u: {
                                            textDecorationLine: 'underline',
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

/**
 * Cmechecklist modal default export.
 *
 * @returns {*}
 */
export default CMEChecklistModal;

/**
 * Styles value.
 * @returns {*}
 */
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
