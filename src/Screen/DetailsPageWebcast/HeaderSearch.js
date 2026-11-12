/**
 * Header search screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, HeaderSearch, checkoutClear, handleUrl, SearchCont, onBackPress.
 */

import { View, Platform, TouchableOpacity, TextInput, KeyboardAvoidingView, BackHandler, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react'
import Colorpath from '../../Themes/Colorpath'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import Fonts from '../../Themes/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { webcastsearchRequest } from '../../Redux/Reducers/WebcastReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
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

/**
 * Reusable HeaderSearch component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const SEARCH_DEBOUNCE_MS = 280;
/**
 * Header search component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const HeaderSearch = (props) => {
    const WebcastReducer = useSelector(state => state.WebcastReducer);
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const [webcast, setWebcast] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [searchEn, setSearchEn] = useState(false);
    const [searchkey, setSearchkey] = useState("");
    const [hadtr, setHadtr] = useState(true);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const inputRef = useRef(null);
    const statusRef = useRef("");
    const searchDebounceRef = useRef(null);
    const searchTextRef = useRef("");
    searchTextRef.current = searchText;

    const dispatchWebcastSearch = useCallback((payload) => {
        setHadtr(true);
        connectionrequest()
            .then(() => {
                dispatch(webcastsearchRequest(payload));
            })
            .catch((err) => {
                setHadtr(false);
                showErrorAlert("Please connect to internet", err);
            });
    }, [dispatch]);

    const placeholders = useMemo(() => [
        "Search for CME/CE courses",
        "Search state-required courses",
        "Search by topic",
        "Search by specialty",
        "Search medical conferences",
        "Search conferences by location"
    ], []);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    useEffect(() => {
        if (searchText || searchEn) return;
        const interval = setInterval(() => {
            setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [placeholders, searchText, searchEn]);
    useEffect(() => {
        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, []);
    useEffect(() => {
        if (searchText == "") {
            dispatchWebcastSearch({});
        }
    }, [searchText, dispatchWebcastSearch]);

        /**
 * Checkout clear utility.
 * @returns {void}
 */
const checkoutClear = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack();
        } else {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: "TabNav",
                            params: {
                                initialRoute: "Home",
                                screen: "Home",
                            },
                        },
                    ],
                })
            );
        }
    }
    // const inputRef = useRef(null);

    // useEffect(() => {
    //     if (inputRef.current) {
    //         inputRef.current.focus();
    //     }
    // }, [isFocus]);
        /**
 * Handles url.
 * @param {*} data - Input value.
 * @returns {void}
 */
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
            props.navigation.navigate("Statewebcast", {
                webCastURL: {
                    webCastURL: result,
                    shareUrl: url,
                    creditData: props?.route?.params?.taskData,
                    Realback: "cont"
                }
            })
        }
    }
        /**
 * Search cont component.
 * @param {*} text - Input value.
 * @returns {void}
 */
const SearchCont = (text, immediate = false) => {
        const nextText = typeof text === 'string' ? text : '';
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
            searchDebounceRef.current = null;
        }
        if (nextText) {
            const textObj = { searchKeyword: nextText };
            searchTextRef.current = nextText;
            setSearchText(nextText);
            if (immediate) {
                dispatchWebcastSearch(textObj);
            } else {
                searchDebounceRef.current = setTimeout(() => {
                    dispatchWebcastSearch(textObj);
                }, SEARCH_DEBOUNCE_MS);
            }
        } else {
            const prevKeyword = searchTextRef.current;
            searchTextRef.current = "";
            setSearchText("");
            if (prevKeyword) {
                dispatchWebcastSearch({
                    searchKeyword: prevKeyword,
                    searchRequestType: "insertSearchKeyword"
                });
            }
        }
    };
    useEffect(() => {
        if (WebcastReducer?.webcastsearchResponse) {
            setWebcast(WebcastReducer.webcastsearchResponse);
        }
    }, [WebcastReducer?.webcastsearchResponse]);
    useEffect(() => {
        if (statusRef.current !== WebcastReducer.status) {
            statusRef.current = WebcastReducer.status;
            switch (WebcastReducer.status) {
                case 'WebCast/webcastsearchRequest':
                    setHadtr(true);
                    break;
                case 'WebCast/webcastsearchSuccess':
                    setHadtr(false);
                    setWebcast(WebcastReducer?.webcastsearchResponse);
                    break;
                case 'WebCast/webcastsearchFailure':
                    setHadtr(false);
                    break;
            }
        }
    }, [WebcastReducer?.status, WebcastReducer?.webcastsearchResponse]);

    useEffect(() => {
                /**
 * On back press utility.
 * @returns {boolean}
 */
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
            {searchEn ? <VoiceSearchBar SearchCont={SearchCont} searchEn={searchEn} setSearchEn={setSearchEn} searchText={searchkey} setSearchText={setSearchkey} /> : <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView style={styles.flexContainer} behavior={Platform.OS === 'ios' ? "height" : undefined}>
                    <View style={styles.searchHeaderRow}>
                        <View style={[styles.searchInputBar, isInputFocused && styles.searchInputBarFocused]}>
                            <TouchableOpacity
                                onPress={() => checkoutClear()}
                                activeOpacity={0.65}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 6 }}
                                style={styles.backButton}
                                accessibilityRole="button"
                                accessibilityLabel="Go back"
                            >
                                <VoiceIcn name="keyboard-arrow-left" size={30} color="#63748b" />
                            </TouchableOpacity>
                            <TextInput
                                ref={inputRef}
                                value={searchText}
                                onChangeText={(text) => SearchCont(text)}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                onSubmitEditing={() => SearchCont(searchText, true)}
                                placeholder={placeholders[placeholderIndex]}
                                placeholderTextColor="#94A3B8"
                                multiline={false}
                                numberOfLines={1}
                                returnKeyType="search"
                                autoCorrect={false}
                                autoCapitalize="none"
                                allowFontScaling={false}
                                underlineColorAndroid="transparent"
                                selectionColor="#475569"
                                style={styles.searchInput}
                            />
                            {searchText.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => {
                                        SearchCont("", true);
                                        inputRef.current?.focus?.();
                                    }}
                                    activeOpacity={0.65}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                    style={styles.clearButton}
                                    accessibilityRole="button"
                                    accessibilityLabel="Clear search"
                                >
                                    <VoiceIcn name="close" size={16} color="#475569" />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                SearchCont("");
                                setSearchEn(true);
                            }}
                            activeOpacity={0.75}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            style={styles.voiceButton}
                            accessibilityRole="button"
                            accessibilityLabel="Voice search"
                        >
                            <VoiceIcn name="keyboard-voice" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    {/* <Loader
                        visible={hadtr} /> */}
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: normalize(15) }}>
                        {!searchText || searchText == "" ? <WrongGlobalData isLoading={hadtr} setSearchText={setSearchText} setPlaceholderIndex={setPlaceholderIndex} nav={props.navigation} creditDataAll={props?.route?.params?.taskData} wrongData={webcast} handleUrl={handleUrl} />
                            : <GlobalSearchAll isLoading={hadtr} creditDataAll={props?.route?.params?.taskData} setSearchText={setSearchText} nav={props.navigation} searchText={searchText} data={webcast} handleUrl={handleUrl} />}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>}

        </>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colorpath.Pagebg,
    },
    flexContainer: {
        flex: 1,
        backgroundColor: Colorpath.Pagebg,
    },
    searchHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: normalize(12),
        paddingTop: Platform.OS === 'ios' ? normalize(4) : normalize(8),
        paddingBottom: normalize(4),
        gap: normalize(10),
    },
    searchInputBar: {
        flex: 1,
        height: normalize(42),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#CBD5E1',
        paddingRight: normalize(4),
    },
    searchInputBarFocused: {
        borderBottomColor: '#334155',
        borderBottomWidth: 1.5,
    },
    backButton: {
        width: normalize(30),
        height: normalize(36),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    searchInput: {
        flex: 1,
        height: normalize(40),
        fontSize: 14.5,
        fontFamily: Fonts.InterRegular,
        color: '#000000',
        paddingVertical: 0,
        paddingHorizontal: normalize(2),
    },
    clearButton: {
        width: normalize(24),
        height: normalize(24),
        borderRadius: normalize(12),
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: normalize(4),
    },
    voiceButton: {
        height: normalize(34),
        width: normalize(34),
        borderRadius: normalize(17),
        backgroundColor: '#64748B',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
/**
 * Header search default export.
 *
 * @returns {*}
 */
export default HeaderSearch
