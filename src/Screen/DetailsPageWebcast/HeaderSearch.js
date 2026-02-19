import { View, Text, Platform, TouchableOpacity, FlatList, ScrollView, Image, KeyboardAvoidingView, Alert, BackHandler } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import PageHeader from '../../Components/PageHeader'
import Colorpath from '../../Themes/Colorpath'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Fonts from '../../Themes/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { webcastsearchRequest } from '../../Redux/Reducers/WebcastReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Buttons from '../../Components/Button';
import Loader from '../../Utils/Helpers/Loader';
import Imagepath from '../../Themes/Imagepath';
import TextFieldIn from '../../Components/Textfield';
import GlobalSearchAll from '../GlobalSupport/GlobalSearchAll';
import WrongGlobalData from '../GlobalSupport/WrongGlobalData';
import { BrowseSpecialtyRequest } from '../../Redux/Reducers/BrowsReducer';
// import VoiceSearchBar from '../GlobalSupport/Voice';
import VoiceIcn from 'react-native-vector-icons/MaterialIcons'
// import NativeIOSVoice from '../GlobalSupport/NativeIOSVoice';
// import NativeVoice from '../GlobalSupport/NativeVoice';
import { ConfActRequest } from '../../Redux/Reducers/CMEReducer';
import { SafeAreaView } from 'react-native-safe-area-context'
import VoiceSearchBar from '../GlobalSupport/Voice';
import { trackScreen } from '../../Utils/Helpers/Analytics';
let status = "";
const HeaderSearch = (props) => {
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const [webcast, setWebcast] = useState(null);
    const [searchText, setSearchText] = useState("")
    const [searchEn, setSearchEn] = useState(false);
    const [searchkey, setSearchkey] = useState("");
    const [hadtr, setHadtr] = useState(false);
    console.log(props?.route?.params?.taskData, "fdmlsdklmg------1233344", searchText, WebcastReducer?.webcastsearchResponse)
    const placeholders = [
        "Search for CME/CE courses",
        "Search for your state required courses ",
        "Search for topic",
        "Search for specialty",
        "Search for medical conferences",
        "Search for conferences by location "
    ];
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {
    //         setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    //     }, 3000);

    //     return () => clearTimeout(timeoutId);
    // }, [placeholderIndex]);
    useEffect(() => {
        if (searchText == "") {
            connectionrequest()
                .then(() => {
                    dispatch(webcastsearchRequest({}));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err);
                });
        }
    }, [searchText]);

    const checkoutClear = () => {
        props.navigation.replace("TabNav", { initialRoute: "Home" });
    }
    // const inputRef = useRef(null);

    // useEffect(() => {
    //     if (inputRef.current) {
    //         inputRef.current.focus();
    //     }
    // }, [isFocus]);
    const handleUrl = (data) => {
        const url = data?.url;
        const result = url.split('/').pop();
        console.log(result, "webcast url=======", data);
        let obj = {
            "conference_id": data?.id,
            "action_type": "view",
            "status": 1
        }
        connectionrequest()
            .then(() => {
                dispatch(ConfActRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
            });
        if (result) {
            setSearchText("");
            props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: result, creditData: props?.route?.params?.taskData } })
        }
    }
    const SearchCont = text => {
        if (text) {
            let textObj = {
                "searchKeyword": text
            };
            connectionrequest()
                .then(() => {
                    dispatch(webcastsearchRequest(textObj));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err);
                });
            setSearchText(text);
        } else {
            let textObjtc = {
                "searchKeyword": searchText,
                "searchRequestType": "insertSearchKeyword"
            };
            connectionrequest()
                .then(() => {
                    dispatch(webcastsearchRequest(textObjtc));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err);
                });
            setSearchText("");
        }
    };
    useEffect(() => {
        if (WebcastReducer?.webcastsearchResponse) {
            const updatedCourses = WebcastReducer?.webcastsearchResponse;
            setWebcast(updatedCourses);
        }
    }, [WebcastReducer?.webcastsearchResponse])
    if (status !== WebcastReducer.status) {
        switch (WebcastReducer.status) {
            case 'WebCast/webcastsearchRequest':
                status = WebcastReducer.status;
                setHadtr(true);
                console.log("gfghgghh")
                break;
            case 'WebCast/webcastsearchSuccess':
                status = WebcastReducer.status;
                setHadtr(false);
                if (searchText == "") {
                    const updatedCourses = WebcastReducer?.webcastsearchResponse;
                    setWebcast(updatedCourses);
                } else {
                    const updatedCourses = WebcastReducer?.webcastsearchResponse;
                    setWebcast(updatedCourses);
                }
                break;
            case 'WebCast/webcastsearchFailure':
                status = WebcastReducer.status;
                setHadtr(false);
                break;
        }
    }

    useEffect(() => {
        const onBackPress = () => {
            checkoutClear();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);

    // ── Analytics: manually track VoiceSearchBar since it mounts
    // ── as a component (not a screen), so onStateChange never fires for it.
    useEffect(() => {
        if (searchEn) {
            // Voice screen is now visible → fire analytics
            trackScreen('VoiceSearchBar');
        } else {
            // Voice screen closed → restore HeaderSearch as current screen
            trackScreen('HeaderSearch');
        }
    }, [searchEn]);

    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            {searchEn ? <VoiceSearchBar SearchCont={SearchCont} searchEn={searchEn} setSearchEn={setSearchEn} searchText={searchkey} setSearchText={setSearchkey} /> : <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }} behavior={Platform.OS === 'ios' ? "height" : undefined}>
                    {Platform.OS === 'ios' ? (
                        <View style={{ paddingHorizontal: normalize(10), flexDirection: "row" }}>
                            <View style={{ alignItems: 'center' }}>
                                <View
                                    style={{
                                        borderBottomColor: '#000000',
                                        borderBottomWidth: 0.5,
                                        marginTop: normalize(2)
                                    }}>
                                    <TextFieldIn
                                        value={searchText}
                                        onChangeText={SearchCont}
                                        height={normalize(40)}
                                        width={normalize(275)}
                                        backgroundColor={Colorpath.Pagebg}
                                        color={"#000000"}
                                        placeholder={placeholders[placeholderIndex]}
                                        placeholderTextColor="#AAAAAA"
                                        fontSize={16}
                                        fontFamily={Fonts.InterRegular}
                                        searchIcon={true}
                                        leftIcon={VoiceIcn}
                                        leftIconName="keyboard-arrow-left"
                                        leftIconSize={35}
                                        leftIconColor="#63748b"
                                        leftIconStyle={{ marginLeft: normalize(-4), top: normalize(7) }}
                                        onPressLeftIcon={() => { checkoutClear() }}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => {
                                setSearchText("");
                                setSearchEn(true);
                            }} style={{ justifyContent: "center", alignContent: "center", marginTop: normalize(10), height: normalize(30), width: normalize(30), borderRadius: normalize(30), backgroundColor: "rgba(0,0,0,0.5)", }}>
                                <VoiceIcn style={{ alignSelf: "center" }} name="keyboard-voice" size={24} color={"#fff"} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ marginTop: normalize(0), paddingHorizontal: normalize(3), flexDirection: "row", gap: 10 }}>
                            <View style={{ alignItems: 'center' }}>
                                <View
                                    style={{
                                        borderBottomColor: '#000000',
                                        borderBottomWidth: 0.5,
                                        marginTop: normalize(2)
                                    }}>
                                    <TextFieldIn
                                        value={searchText}
                                        onChangeText={SearchCont}
                                        height={normalize(40)}
                                        width={normalize(275)}
                                        backgroundColor={Colorpath.Pagebg}
                                        color={"#000000"}
                                        placeholder={placeholders[placeholderIndex]}
                                        placeholderTextColor="#AAAAAA"
                                        fontSize={16}
                                        fontFamily={Fonts.InterRegular}
                                        searchIcon={true}
                                        leftIcon={VoiceIcn}
                                        leftIconName="keyboard-arrow-left"
                                        leftIconSize={35}
                                        leftIconColor="#63748b"
                                        leftIconStyle={{ marginLeft: normalize(0), top: normalize(5) }}
                                        onPressLeftIcon={() => { checkoutClear() }}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => {
                                setSearchText("");
                                setSearchEn(true);
                            }} style={{ justifyContent: "center", alignContent: "center", marginTop: normalize(10), height: normalize(30), width: normalize(30), borderRadius: normalize(30), backgroundColor: "rgba(0,0,0,0.5)", }}>
                                <VoiceIcn style={{ alignSelf: "center" }} name="keyboard-voice" size={24} color={"#fff"} />
                            </TouchableOpacity>
                        </View>
                    )}
                    {/* <Loader
                        visible={hadtr} /> */}
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: normalize(15) }}>
                        {!searchText || searchText == "" ? <WrongGlobalData setSearchText={setSearchText} setPlaceholderIndex={setPlaceholderIndex} nav={props.navigation} creditDataAll={props?.route?.params?.taskData} wrongData={webcast} handleUrl={handleUrl} />
                            : <GlobalSearchAll creditDataAll={props?.route?.params?.taskData} setSearchText={setSearchText} nav={props.navigation} searchText={searchText} data={webcast} handleUrl={handleUrl} />}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>}

        </>
    )
}
export default HeaderSearch
