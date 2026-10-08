import DropDownHeader, { DropdownSearch, DropdownOption, DropdownList, dropdownStyles } from '../../Components/DropDownHeader';
/**
 * Board customed screen module. Renders a React Native screen or a screen-scoped support component. Exported members: BoardCustomed, weekFilterProfession.
 */

import { View, Text, Platform, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';

/**
 * Reusable BoardCustomed component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const BoardCustomed = ({setsearchboardname, handleBoardname, boardnamereal,setBoardnamepick, searchBoardNameFinal, searchboardname }) => {

    const[showLoader,setShowLoader] = useState(false)
    useEffect(() => {
                // Simulate 2-second loading time
                const timeout = setTimeout(() => {
                    setShowLoader(true);
                }, 2000);

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
            <DropdownOption
            onPress={() => {
                handleBoardname(item);
                setBoardnamepick(false);
            }}

        >
            <Text numberOfLines={1}
                style={dropdownStyles.optionText}
            >
                {item?.name}
            </Text>
        </DropdownOption>
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
                    <View >
                    <DropDownHeader standardized title="Certification Board*" onClosePress={()=>{
                        setBoardnamepick(false);
                        setsearchboardname("");
                        }} />
                </View>
                ) : (
                    <View>
                        <DropDownHeader standardized title="Certification Board*" onClosePress={()=>{
                            setBoardnamepick(false);
                            setsearchboardname("");
                            }} />
                    </View>
                )}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <DropdownSearch editable
                            maxLength={50}
                            onChangeText={searchBoardNameFinal}
                            value={searchboardname}
                            placeholder="Search Board name" />
                    <View style={{flex:1}}>
                        <DropdownList
                            data={boardnamereal}
                            renderItem={weekFilterProfession}
                            contentContainerStyle={{paddingBottom:normalize(120)}}
                            keyExtractor={(item, index) => index.toString()}
                            keyboardShouldPersistTaps="always"
                            ListEmptyComponent={!showLoader ? <ActivityIndicator size={"small"} color={"green"}/> :
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    backgroundColor: "#DADADA",
                                    alignSelf: 'center',
                                    justifyContent:"center",
                                    alignItems:"center",
                                    borderRadius:normalize(10)
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
 * Board customed default export.
 *
 * @returns {*}
 */
export default BoardCustomed
