import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';

/**
 * Board vault modal screen module. Renders a React Native screen or a screen-scoped support component. Exported members: BoardVaultModal, weekFilterProfession.
 */

import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';

/**
 * Reusable BoardVaultModal component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const BoardVaultModal = ({ handleBoardname, clisttopicboard, setStatepickboard, searchTopicNameboard, searchtexttopicboard }) => {

    const [showLoader,setShowLoader] = useState(false);
     useEffect(() => {
            // Simulate 2-second loading time
            const timeout = setTimeout(() => {
                setShowLoader(true);
            }, 5000);

            return () => clearTimeout(timeout);
        }, []);
        /**
 * Week filter profession utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const weekFilterProfession = ({ item, index }) => {
        return (
            <View style={{justifyContent:"center",alignItems:"center"}}>
                <DropdownOption
                    onPress={() => {
                        handleBoardname(item);
                        setStatepickboard(false);
                    }}

                >
                    <Text
                        style={dropdownStyles.optionText}
                    >
                        {item?.board_data?.board_name}
                    </Text>
                </DropdownOption>

            </View>
        );
    };
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <View style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? (
                    <DropDownHeader standardized title="Board name*" onClosePress={() => { setStatepickboard(false) }} />
                ) : (
                    <View>
                        <DropDownHeader standardized title="Board name*" onClosePress={() => { setStatepickboard(false) }} />
                    </View>
                )}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <DropdownSearch editable
                            maxLength={40}
                            onChangeText={searchTopicNameboard}
                            value={searchtexttopicboard}
                            placeholder="Search board name" />
                    <View style={{ flex: 1 }}>
                        <DropdownList
                            data={clisttopicboard}
                            renderItem={weekFilterProfession}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingBottom: normalize(50) }}
                            keyboardShouldPersistTaps="always"
                            ListEmptyComponent={!showLoader ? <ActivityIndicator size={"small"} color={"green"}/> :
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    backgroundColor: "#DADADA",
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: normalize(20),
                                        }}>
                                        No data found
                                    </Text>
                                </View>
                            }
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        </>
    )
}

/**
 * Board vault modal default export.
 *
 * @returns {*}
 */
export default BoardVaultModal
