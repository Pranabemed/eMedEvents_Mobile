/**
 * Cmechecklist modal screen module. Renders a React Native screen or a screen-scoped support component. Exported members: CMEChecklistModal, handleOptionSelect, handleTabLayout, StateCMEChekck, styles.
 */

import { View, Text, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, Pressable, ActivityIndicator } from 'react-native';
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

    const allOptions = Object.keys(allProfessionData?.cme_data || {});
    const firstOption = allOptions?.[0];
    const [selectedOption, setSelectedOption] = useState(firstOption);
    const [tabWidths, setTabWidths] = useState({});
    const navigation = useNavigation();
    useEffect(() => {
        if (firstOption && (!selectedOption || !allProfessionData?.cme_data?.[selectedOption])) {
            setSelectedOption(firstOption);
        }
    }, [firstOption, allProfessionData]);
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
    const { height: screenHeight, width } = useWindowDimensions();
    const modalHeight = Math.min(screenHeight * 0.85, normalize(620));
    const optionCount = allOptions.length || 1;
    const tabItemWidth = width / optionCount;
    const activeOption = (selectedOption && allProfessionData?.cme_data?.[selectedOption]) ? selectedOption : firstOption;
    const selectedData = allProfessionData?.cme_data?.[activeOption];
    if (!isVisibelCME && !selectedData) {
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
            hideModalContentWhileAnimating={false}
            isVisible={Boolean(isVisibelCME)}
            style={{ width: '100%', alignSelf: 'center', margin: 0 }}
            animationInTiming={350}
            animationOutTiming={300}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            statusBarTranslucent={true}
            onBackdropPress={onCMEClose}
            onBackButtonPress={onCMEClose}
        >
            <View style={[styles.modalView, { height: modalHeight }]}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Pressable onPress={() => {
                        onSaved();
                        onCMEClose();
                    }}>
                        <View style={styles.modalIndicator} />
                    </Pressable>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <Text style={styles.headerTitle} numberOfLines={2}>
                            {"Know Your State CME Requirements"}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                onSaved();
                                onCMEClose();
                            }}
                            style={styles.closeButton}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    {selectedData ? (
                        <ScrollView contentContainerStyle={{ paddingBottom: normalize(120) }}>
                        {allOptions?.length > 1 && (
                            <View style={{ marginHorizontal: normalize(16), marginBottom: normalize(8) }}>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: "#F1F5F9",
                                    borderRadius: normalize(8),
                                    padding: normalize(3),
                                }}>
                                    {allOptions.map((optionKey) => {
                                        const isSelected = selectedOption === optionKey;
                                        return (
                                            <TouchableOpacity
                                                key={optionKey}
                                                onPress={() => handleOptionSelect(optionKey)}
                                                style={{
                                                    flex: 1,
                                                    paddingVertical: normalize(7),
                                                    borderRadius: normalize(6),
                                                    backgroundColor: isSelected ? "#FFFFFF" : "transparent",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    shadowColor: isSelected ? "#000" : "transparent",
                                                    shadowOffset: { width: 0, height: 1 },
                                                    shadowOpacity: isSelected ? 0.08 : 0,
                                                    shadowRadius: 2,
                                                    elevation: isSelected ? 2 : 0,
                                                }}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        fontFamily: Fonts.InterSemiBold,
                                                        fontSize: normalize(12.5),
                                                        color: isSelected ? Colorpath.ButtonColr : "#64748B",
                                                        fontWeight: isSelected ? "700" : "500",
                                                    }}
                                                >
                                                    {optionKey}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        )}
                        <View style={{ paddingHorizontal: normalize(16), marginTop: normalize(4), marginBottom: normalize(6) }}>
                            <Text numberOfLines={2} style={{ fontFamily: Fonts.InterBold, fontSize: normalize(15), color: "#1E293B", fontWeight: "700" }}>
                                {selectedData?.name}
                            </Text>
                        </View>
                        <View style={{
                            marginHorizontal: normalize(16),
                            marginTop: normalize(4),
                            marginBottom: normalize(12),
                            padding: normalize(12),
                            backgroundColor: "#F0F7FF",
                            borderRadius: normalize(10),
                            borderWidth: 1,
                            borderColor: "#C8DDFB",
                        }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "stretch", gap: normalize(8) }}>
                                <View style={{
                                    flex: 1,
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: normalize(8),
                                    borderWidth: 1,
                                    borderColor: "#DBEAFE",
                                    paddingVertical: normalize(8),
                                    paddingHorizontal: normalize(4),
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <Text numberOfLines={1} style={{ fontFamily: Fonts.InterMedium, fontSize: normalize(10.5), color: "#2563EB", fontWeight: "600", textAlign: "center", marginBottom: normalize(2) }}>
                                        {allProfessionData?.creditRequiredText ? String(allProfessionData.creditRequiredText).replace(':', '') : "Required"}
                                    </Text>
                                    <Text numberOfLines={1} style={{ fontFamily: Fonts.InterBold, fontSize: normalize(15), color: "#1E3A8A", fontWeight: "700" }}>
                                        {selectedData?.credits ?? "--"}
                                    </Text>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: normalize(9.5), color: "#64748B" }}>
                                        {"Credits"}
                                    </Text>
                                </View>

                                <View style={{
                                    flex: 1,
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: normalize(8),
                                    borderWidth: 1,
                                    borderColor: "#D1FAE5",
                                    paddingVertical: normalize(8),
                                    paddingHorizontal: normalize(4),
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <Text numberOfLines={1} style={{ fontFamily: Fonts.InterMedium, fontSize: normalize(10.5), color: "#059669", fontWeight: "600", textAlign: "center", marginBottom: normalize(2) }}>
                                        {"Cycle"}
                                    </Text>
                                    <Text numberOfLines={1} style={{ fontFamily: Fonts.InterBold, fontSize: normalize(15), color: "#065F46", fontWeight: "700" }}>
                                        {selectedData?.term ? `${selectedData.term} Yr` : "--"}
                                    </Text>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: normalize(9.5), color: "#64748B" }}>
                                        {"Licensing"}
                                    </Text>
                                </View>

                                <View style={{
                                    flex: 1,
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: normalize(8),
                                    borderWidth: 1,
                                    borderColor: "#E0E7FF",
                                    paddingVertical: normalize(8),
                                    paddingHorizontal: normalize(4),
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <Text numberOfLines={1} style={{ fontFamily: Fonts.InterMedium, fontSize: normalize(10.5), color: "#4F46E5", fontWeight: "600", textAlign: "center", marginBottom: normalize(2) }}>
                                        {allProfessionData?.creditCategory ? String(allProfessionData.creditCategory).replace(':', '') : "Category"}
                                    </Text>
                                    <Text numberOfLines={1} style={{ fontFamily: Fonts.InterBold, fontSize: normalize(15), color: "#3730A3", fontWeight: "700" }}>
                                        {selectedData?.amapra_cat_credits ?? "--"}
                                    </Text>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: normalize(9.5), color: "#64748B" }}>
                                        {"Category 1"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {selectedData?.additional_notes ? (
                            <View style={{
                                marginHorizontal: normalize(16),
                                backgroundColor: "#F8FAFC",
                                borderRadius: normalize(10),
                                borderWidth: 1,
                                borderColor: "#E2E8F0",
                                padding: normalize(14),
                            }}>
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: normalize(10), gap: normalize(6) }}>
                                    <View style={{ width: 3, height: normalize(14), backgroundColor: Colorpath.ButtonColr, borderRadius: 2 }} />
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: normalize(13), color: "#1E293B", fontWeight: "600" }}>
                                        {"State Board Requirements & Guidelines"}
                                    </Text>
                                </View>
                                <RenderHTML
                                    contentWidth={width - normalize(60)}
                                    source={{ html: selectedData?.additional_notes }}
                                    renderersProps={{
                                        a: {
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
                                            color: '#334155',
                                            fontSize: normalize(12),
                                            lineHeight: normalize(18),
                                            marginVertical: normalize(3),
                                            fontFamily: Fonts.InterRegular,
                                        },
                                        div: {
                                            color: '#334155',
                                            fontSize: normalize(12),
                                            lineHeight: normalize(18),
                                            marginVertical: normalize(3),
                                            fontFamily: Fonts.InterRegular,
                                        },
                                        a: {
                                            color: Colorpath.ButtonColr,
                                            fontSize: normalize(12),
                                            textDecorationLine: 'underline',
                                            fontFamily: Fonts.InterMedium,
                                        },
                                        u: {
                                            textDecorationLine: 'underline',
                                        },
                                        b: {
                                            fontFamily: Fonts.InterSemiBold,
                                            color: '#1E293B',
                                        },
                                        strong: {
                                            fontFamily: Fonts.InterSemiBold,
                                            color: '#1E293B',
                                        }
                                    }}
                                />
                            </View>
                        ) : null}
                        <View style={{ paddingVertical: normalize(14), alignItems: "center" }}>
                            <Buttons
                                onPress={() => {
                                    StateCMEChekck(allProfession, certificatedata?.state_id, "professionlandingpage", "listby_type", "state_id", "profession_name", "medicalresourselanding");
                                    onCMEClose();
                                }}
                                height={normalize(40)}
                                width={normalize(180)}
                                backgroundColor={Colorpath.ButtonColr}
                                borderRadius={normalize(8)}
                                text="Browse Courses"
                                color={Colorpath.white}
                                fontSize={normalize(13)}
                                fontFamily={Fonts.InterSemiBold}
                            />
                        </View>
                    </ScrollView>
                    ) : (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: normalize(40) }}>
                            <ActivityIndicator size="large" color={Colorpath.ButtonColr} />
                            <Text style={{ marginTop: normalize(12), fontFamily: Fonts.InterMedium, fontSize: normalize(13), color: "#64748B" }}>
                                {"Loading CME requirements..."}
                            </Text>
                        </View>
                    )}
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
        paddingHorizontal: normalize(16),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        flex: 1,
        fontFamily: Fonts.InterBold,
        fontSize: normalize(14.5),
        color: "#1E293B",
        fontWeight: "bold",
        marginRight: normalize(10),
    },
    closeButton: {
        paddingVertical: normalize(6),
        paddingHorizontal: normalize(12),
        borderRadius: normalize(6),
        backgroundColor: "#F1F5F9",
        alignItems: "center",
        justifyContent: "center",
    },
    closeButtonText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: normalize(12.5),
        color: "#64748B",
    },
    modalView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopRightRadius: normalize(16),
        borderTopLeftRadius: normalize(16),
        paddingTop: normalize(8),
    },
    modalIndicator: {
        height: 4,
        width: normalize(44),
        backgroundColor: "#CBD5E1",
        borderRadius: 2,
        marginTop: normalize(2),
    },
    tagsStyles: {
        ul: {
            marginVertical: normalize(4),
            paddingLeft: normalize(16),
        },
        li: {
            fontFamily: Fonts.InterRegular,
            marginBottom: normalize(4),
            fontSize: normalize(12),
            lineHeight: normalize(17),
            color: '#334155',
        },
    },
});
