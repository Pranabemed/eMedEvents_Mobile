/**
 * Change password screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status1, ChangePassword, clearAllAsyncStorage, Passback, finalHit, backTo.
 */

import { View, Text, Platform, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import PageHeader from '../../Components/PageHeader';
import Loader from '../../Utils/Helpers/Loader';
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import normalize from '../../Utils/Helpers/Dimen';
import InputField from '../../Components/CellInput';
import Buttons from '../../Components/Button';
import Fonts from '../../Themes/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { changePasswordRequest } from '../../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { allreducerRequest, logoutRequest } from '../../Redux/Reducers/AuthReducer';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import { NON_USA_PROFESSION_UPDATE_REQUIRED_KEY, NON_USA_STATE_LICENSE_FLOW_COMPLETED_KEY } from '../../Utils/Helpers/nonUsaFlow';
import { navigationRef } from '../../Navigator/RootNavigation';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable ChangePassword component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
let status1 = "";
/**
 * Change password component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const ChangePassword = (props) => {

    const [oldpass, setOldpass] = useState("");
    const [newpass, setNewpass] = useState("");
    const [cnfmpass, setCnfmpass] = useState("");
    const passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    const isPasswordValid = newpass?.length > 0 && passwordregex.test(newpass);
    const cnfrmPasswordValid = cnfmpass?.length > 0 && passwordregex.test(cnfmpass);
    const isPasswordValidch = newpass?.length > 0 && !passwordregex.test(newpass);
    const cnfrmPasswordValidch = cnfmpass?.length > 0 && !passwordregex.test(cnfmpass);
    const passwordsMatch = newpass === cnfmpass;
    const dontMatch = oldpass === newpass;
    const oldPasswordExists = oldpass?.length > 0;
    const final = !(oldPasswordExists && isPasswordValid && cnfrmPasswordValid && passwordsMatch && !dontMatch);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    const dispatch = useDispatch();
    /**
* Clear all async storage utility.
*
* @async
* @returns {Promise<*>}
*/
    const clearAllAsyncStorage = async () => {
        try {
            const keepKeys = [
                'PRIME_CARD_SKIPPED_ONCE',
                'PrimeMembershipSkipped',
                constants.NON_USA_FLOW_STATE,
                NON_USA_PROFESSION_UPDATE_REQUIRED_KEY,
                NON_USA_STATE_LICENSE_FLOW_COMPLETED_KEY,
            ];
            const preservedEntries = await AsyncStorage.multiGet(keepKeys);
            await AsyncStorage.removeItem('lastActiveTab')
            await AsyncStorage.removeItem('WHOLEDATA');
            await AsyncStorage.removeItem('PRODATA');
            await AsyncStorage.clear();
            for (const [key, value] of preservedEntries) {
                if (value !== null) {
                    await AsyncStorage.setItem(key, value);
                }
            }
            console.log('All AsyncStorage keys cleared successfully!');
        } catch (e) {
            console.error('Error clearing AsyncStorage:', e);
        }
    };
    /**
* Passback component.
* @returns {void}
*/
    const Passback = () => {
        clearAllAsyncStorage()
            .then(() => dispatch(logoutRequest()))
            .then(() => dispatch(allreducerRequest({ "obj": "" })))
            .then(() => {
                navigationRef.current?.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    })
                );
            })
            .catch(err => console.log("Logout flow error:", err));
    }
    /**
* Final hit utility.
* @returns {void}
*/
    const finalHit = () => {
        let obj = {
            "current_password": oldpass,
            "new_password": cnfmpass
        }
        connectionrequest()
            .then(() => {
                dispatch(changePasswordRequest(obj))
            })
            .catch((err) => showErrorAlert("Please connect to internet", err))
    }
    if (status1 == '' || DashboardReducer.status != status1) {
        switch (DashboardReducer.status) {
            case 'Dashboard/changePasswordRequest':
                status1 = DashboardReducer.status;
                break;
            case 'Dashboard/changePasswordSuccess':
                status1 = DashboardReducer.status;
                if (DashboardReducer?.changePasswordResponse?.msg == "Password changed successfully.") {
                    showErrorAlert("Password changed successfully.");
                    Passback()
                }
                console.log(DashboardReducer?.changePasswordResponse, "log-----------");
                break;
            case 'Dashboard/changePasswordFailure':
                status1 = DashboardReducer.status;
                showErrorAlert("Your current password is incorrect.,Please try again !")
                break;
        }
    }
    /**
* Back to utility.
* @returns {void}
*/
    const backTo = () => {
        props?.navigation.goBack();
    }
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>

                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="Change Password"
                            onBackPress={backTo}
                        />
                    ) : (
                        <PageHeader
                            title="Change Password"
                            onBackPress={backTo}
                        />
                    )}
                </View>
                <Loader visible={DashboardReducer?.status == 'Dashboard/changePasswordRequest'} />
                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }} behavior={Platform.OS === 'ios' ? 'height' : undefined}>
                    <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ paddingBottom: normalize(50) }}>
                        <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                            <View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>
                                <View style={{
                                    flex: 1,
                                    paddingRight: normalize(0)
                                }}>
                                    <InputField
                                        label="Current Password*"
                                        value={oldpass}
                                        onChangeText={setOldpass}
                                        placeholder=""
                                        placeholderTextColor="#949494"
                                        isPassword={true}
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxlength={35}
                                    />
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>
                                <View style={{
                                    flex: 1,
                                    paddingRight: normalize(0)
                                }}>
                                    <InputField
                                        label="Enter New Password*"
                                        value={newpass}
                                        onChangeText={setNewpass}
                                        placeholder=""
                                        placeholderTextColor="#949494"
                                        isPassword={true}
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxlength={35}
                                    />
                                </View>
                            </View>
                            {dontMatch && oldPasswordExists ? (
                                <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "red" }}>
                                        {"New password must be different"}
                                    </Text>
                                </View>
                            ) : isPasswordValidch ? (
                                <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "red" }}>
                                        {"New password must be 8+ chars, with 1 uppercase, 1 special character and 1 number."}
                                    </Text>
                                </View>
                            ) : ""}
                            <View style={{
                                flexDirection: 'row',
                                flex: 1
                            }}>
                                <View style={{
                                    flex: 1,
                                    paddingRight: normalize(0)
                                }}>
                                    <InputField
                                        label="Confirm Password*"
                                        value={cnfmpass}
                                        onChangeText={setCnfmpass}
                                        placeholder=""
                                        placeholderTextColor="#949494"
                                        isPassword={true}
                                        keyboardType="default"
                                        showCountryCode={false}
                                        maxlength={35}
                                    />
                                </View>
                            </View>
                            {cnfrmPasswordValidch &&
                                <View style={{ paddingHorizontal: normalize(0), bottom: normalize(10) }}>
                                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 12, color: "red" }}>
                                        {"Minimum 8 chars, 1 uppercase and 1 number."}
                                    </Text>
                                </View>}
                            <Buttons
                                onPress={finalHit}
                                height={normalize(45)}
                                width={normalize(310)}
                                backgroundColor={final ? "#DADADA" : Colorpath.ButtonColr}
                                borderRadius={normalize(9)}
                                text="Reset"
                                color={Colorpath.white}
                                fontSize={18}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(10)}
                                disabled={final}
                            />
                            <Buttons
                                onPress={backTo}
                                height={normalize(45)}
                                width={normalize(310)}
                                backgroundColor={Colorpath.Pagebg}
                                borderRadius={normalize(9)}
                                text="Cancel"
                                color={Colorpath.ButtonColr}
                                fontSize={14}
                                fontFamily={Fonts.InterSemiBold}
                                marginTop={normalize(0)}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}

/**
 * Change password default export.
 *
 * @returns {*}
 */
export default ChangePassword
