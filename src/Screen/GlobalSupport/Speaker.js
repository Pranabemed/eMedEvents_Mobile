/**
 * Speaker screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, Speaker, speakerItem, SearchBack, handleLoadMore.
 */

import { View, Text, ActivityIndicator, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Colorpath from '../../Themes/Colorpath';
import Imagepath from '../../Themes/Imagepath';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import { useDispatch, useSelector } from 'react-redux';
import { searchSpeakerRequest } from '../../Redux/Reducers/TransReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { AppContext } from './AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Reusable Speaker component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

let status = "";
/**
 * Speaker component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const Speaker = (props) => {
       const {
        isConnected
    } = useContext(AppContext);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const TransReducer = useSelector(state => state.TransReducer);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(0);
    const [hasmore, setHasMore] = useState(false);
    const [wholeData, setWholeData] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const hasScrolled = useRef(false);
    const perPage = 5;
    const handleScroll = useCallback(() => {
        hasScrolled.current = true;
    }, []);
    console.log(props?.route?.params, "get---------")
        /**
 * Speaker item utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const speakerItem = ({ item, index }) => {
        const isOrganizer = props?.route?.params?.highText?.organ === "organ";
        const displayName = String(item?.firstname || item?.label || item?.name || '').trim();
        const initialChar = displayName ? displayName.charAt(0).toUpperCase() : (isOrganizer ? 'O' : 'S');
        const baseUrl = TransReducer?.searchSpeakerResponse?.ImagePath
            ?? TransReducer?.searchSpeakerResponse?.imagePath;
        const imagePath = item?.image_path;
        const imageUri = baseUrl && imagePath ? `${baseUrl}${imagePath}` : null;
        const subtitle = item?.designation || item?.location || '';
        const locationDetails = [item?.state_name, item?.country_code].filter(Boolean).join(', ');
        const isSelected = selectedIndex === index;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    props.navigation.navigate("SpeakerProfile", {
                        fullUrl: {
                            hitDat: props?.route?.params?.highText?.highText,
                            fullUrl: item?.user_url || item?.url,
                            creditData: props?.route?.params?.highText?.CreditData,
                            speaks: isOrganizer ? "organ" : "speaker",
                        }
                    });
                    setSelectedIndex(isSelected ? null : index);
                }}
                style={[
                    styles.card,
                    isSelected && styles.cardSelected,
                ]}
            >
                <View style={styles.cardInner}>
                    <View style={styles.avatarWrap}>
                        {imageUri ? (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.avatarImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <Text style={styles.avatarFallbackText}>{initialChar}</Text>
                        )}
                    </View>
                    <View style={styles.infoCol}>
                        <Text style={styles.nameText} numberOfLines={2}>
                            {displayName}
                        </Text>
                        {subtitle ? (
                            <Text style={styles.designationText} numberOfLines={2}>
                                {subtitle}
                            </Text>
                        ) : null}
                        {locationDetails ? (
                            <View style={styles.locationRow}>
                                <Image source={Imagepath.MapPin} style={styles.locationPinIcon} />
                                <Text style={styles.locationText} numberOfLines={1}>
                                    {locationDetails}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                    <View style={styles.chevronWrap}>
                        <Feather name="chevron-right" size={16} color={Colorpath.ButtonColr} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
        /**
 * Search back component.
 * @returns {void}
 */
const SearchBack = () => {
        props.navigation.goBack();
    }
    useEffect(() => {
        if (props?.route?.params?.highText) {
            let obj = props?.route?.params?.highText?.speaks == "speaker" ? {
                "name": props?.route?.params?.highText?.highText.trim(),
                "speaker":""
            } : {
                "name": props?.route?.params?.highText?.highText.trim(),
            }
            connectionrequest()
                .then(() => {
                    dispatch(searchSpeakerRequest(obj));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err);
                });
        }
    }, [props?.route?.params])
    if (status === '' || TransReducer.status !== status) {
        switch (TransReducer.status) {
            case 'Transaction/searchSpeakerRequest':
                status = TransReducer.status;
                break;
            case 'Transaction/searchSpeakerSuccess':
                status = TransReducer.status;
                const speakerDataRaw = TransReducer?.searchSpeakerResponse?.Search_speakerlist ||
                    TransReducer?.searchSpeakerResponse?.searchOrganizerList;
                const speakerData = speakerDataRaw
                    ? Array.isArray(speakerDataRaw)
                        ? speakerDataRaw
                        : [speakerDataRaw]  
                    : [];

                const mergedData = [...speakerData].filter(Boolean);  
                if (mergedData.length > 0) {
                    const uniqueData = Array.from(
                        new Map(
                            mergedData.map((item, index) => {
                                const key = item?.id || [
                                    item.firstname?.substring(0, 20) || 'fn', 
                                    item.lastname?.substring(0, 20) || 'ln',
                                    item.user_url || 'url',
                                    Date.now() 
                                ].join('_');

                                return [key, item];
                            })
                        ).values()
                    );
                    const safeEnd = Math.max(
                        (currentPage + 1) * perPage,
                        1 
                    );

                    setWholeData(
                        uniqueData.length > 0
                            ? uniqueData.slice(0, safeEnd)
                            : [] 
                    );
                } else {
                    setWholeData([]); 
                }
                break;
            case 'Transaction/searchSpeakerFailure':
                status = TransReducer.status;
                break;
        }
    }
        /**
 * Handles load more.
 * @returns {void}
 */
const handleLoadMore = () => {
        const startIndex = currentPage * perPage;
        const endIndex = startIndex + perPage;
        const newData = TransReducer?.searchSpeakerResponse?.Search_speakerlist && TransReducer?.searchSpeakerResponse?.Search_speakerlist.slice(startIndex, endIndex) || TransReducer?.searchSpeakerResponse?.searchOrganizerList && TransReducer?.searchSpeakerResponse?.searchOrganizerList.slice(startIndex, endIndex);

        if (newData?.length > 0) {
            setWholeData([...wholeData, ...newData]);
            setCurrentPage(currentPage + 1);
        } else {
            setHasMore(false); // Disable onEndReached
        }
    };
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    const isOrganizer = props?.route?.params?.highText?.organ === "organ";
    const headerTitle = isOrganizer ? "Search Organizers" : "Search Speakers";
    const totalResults = TransReducer?.searchSpeakerResponse?.Speakercount || TransReducer?.searchSpeakerResponse?.organizerCount || (Array.isArray(wholeData) ? wholeData.length : 0);
    const searchKeyword = props?.route?.params?.highText?.highText;

    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn == false ? <IntOff /> : (
                <SafeAreaView style={styles.screen}>
                    <View style={styles.headerWrapper}>
                        <PageHeader
                            title={headerTitle}
                            onBackPress={SearchBack}
                        />
                    </View>
                    <View style={styles.resultsBanner}>
                        <View style={styles.resultsPill}>
                            <Text style={styles.resultsPillText}>
                                {`${totalResults} ${isOrganizer ? 'Organizers' : 'Speakers'}`}
                            </Text>
                        </View>
                        {searchKeyword ? (
                            <View style={styles.keywordRow}>
                                <Text style={styles.resultsForLabel}>Results for: </Text>
                                <Text style={styles.keywordText} numberOfLines={1}>
                                    {`"${searchKeyword}"`}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                    <FlatList
                        data={wholeData}
                        renderItem={speakerItem}
                        keyExtractor={(item, index) => item.id ? `${item.id}_${index}` : index.toString()}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        onScroll={handleScroll}
                        ListFooterComponent={() =>
                            hasmore ? (
                                <View style={styles.footerLoader}>
                                    <ActivityIndicator size="small" color={Colorpath.ButtonColr} />
                                </View>
                            ) : null
                        }
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyCard}>
                                    <Text style={styles.emptyText}>
                                        There are no matches available for your search criteria. Please change the criteria and try again.
                                    </Text>
                                </View>
                            </View>
                        }
                    />
                </SafeAreaView>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colorpath.Pagebg,
    },
    headerWrapper: {
        backgroundColor: '#FFFFFF',
    },
    resultsBanner: {
        paddingHorizontal: normalize(14),
        paddingTop: normalize(12),
        paddingBottom: normalize(8),
    },
    resultsPill: {
        alignSelf: 'flex-start',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(4),
        borderRadius: normalize(14),
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    resultsPillText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12.5,
        color: Colorpath.ButtonColr,
    },
    keywordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: normalize(6),
    },
    resultsForLabel: {
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        color: '#64748B',
    },
    keywordText: {
        fontFamily: Fonts.InterBold,
        fontSize: 16,
        color: '#0F172A',
        flexShrink: 1,
    },
    listContent: {
        paddingBottom: normalize(120),
        paddingTop: normalize(4),
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: normalize(14),
        marginVertical: normalize(5),
        padding: normalize(12),
        borderRadius: normalize(12),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    cardSelected: {
        borderColor: Colorpath.ButtonColr,
    },
    cardInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarWrap: {
        height: normalize(56),
        width: normalize(56),
        borderRadius: normalize(28),
        backgroundColor: '#EFF6FF',
        borderWidth: 1.5,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(12),
        overflow: 'hidden',
    },
    avatarImage: {
        height: normalize(56),
        width: normalize(56),
        borderRadius: normalize(28),
    },
    avatarFallbackText: {
        fontFamily: Fonts.InterBold,
        fontSize: 20,
        color: Colorpath.ButtonColr,
    },
    infoCol: {
        flex: 1,
        justifyContent: 'center',
    },
    nameText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 15.5,
        color: '#0F172A',
        lineHeight: 20,
    },
    designationText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 13,
        color: '#475569',
        marginTop: normalize(2),
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: normalize(4),
        gap: normalize(4),
    },
    locationPinIcon: {
        height: normalize(13),
        width: normalize(13),
        resizeMode: 'contain',
        tintColor: '#64748B',
    },
    locationText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 12.5,
        color: '#64748B',
        flexShrink: 1,
    },
    chevronWrap: {
        height: normalize(28),
        width: normalize(28),
        borderRadius: normalize(14),
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: normalize(8),
    },
    footerLoader: {
        paddingVertical: normalize(20),
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(30),
        paddingHorizontal: normalize(16),
    },
    emptyCard: {
        width: '100%',
        borderRadius: normalize(12),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(20),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    emptyText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 13.5,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
    },
});

/**
 * Speaker default export.
 *
 * @returns {*}
 */
export default Speaker