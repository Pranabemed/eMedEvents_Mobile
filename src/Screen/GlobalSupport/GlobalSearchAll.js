/**
 * Global search all screen module. Renders a React Native screen or a screen-scoped support component. Exported members: renderSection, GlobalSearchAll, handleRot, styles.
 */

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import Colorpath from '../../Themes/Colorpath';
import Buttons from '../../Components/Button';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import IntOff from '../../Utils/Helpers/IntOff';
import { AppContext } from './AppContext';
import NetInfo from '@react-native-community/netinfo';
import StackNav from '../../Navigator/StackNav';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable renderSection component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const renderSection = (title, data, onPressHandler, nav, searchTextD, countShow, setSearchText, creditDataAll) => {
    const validTitles = [
        "In-Person Conferences & Online courses",
        "Online courses",
        "Conferences",
    ];
    const guestRealback = creditDataAll?.isGuest ? "guest" : undefined;
    return (
        data && data.length > 0 && (
            <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                    <View style={styles.sectionTitleWrap}>
                        <Text numberOfLines={1} style={styles.sectionTitle}>{title}</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.78}
                        onPress={() => {
                            if (title == "Topics") {
                                countShow("");
                                nav.navigate("BrowseScreen", { highText: { highText: "Topic", CreditData: setSearchText } });
                            } else if (title == "Speciality") {
                                countShow("");
                                nav.navigate("BrowseScreen", { highText: { highText: "Specialty", CreditData: setSearchText } });
                            } else if (title == "Popular specialities") {
                                searchTextD("");
                                nav.navigate("BrowseScreen", { highText: { highText: "Specialty", CreditData: setSearchText } });
                            } else if (title == "Speakers") {
                                countShow("");
                                nav.navigate("Speaker", { highText: { highText: searchTextD, CreditData: setSearchText, speaks: "speaker" } });
                            } else if (title == "Organizers") {
                                countShow("");
                                nav.navigate("Speaker", { highText: { highText: searchTextD, CreditData: setSearchText, organ: "organ" } });
                            } else {
                                setSearchText("");
                                nav.navigate("Globalresult", { trig: { searchTxt: searchTextD, rqstType: "headerSearch", CreditData: creditDataAll, creditData: creditDataAll, Realback: guestRealback } });
                            }
                        }}
                        style={styles.viewAllPill}
                    >
                        <Text style={styles.viewAllText}>
                            {title !== "Topics" && title !== "Speciality" && title !== "Popular specialities" && title !== "Speakers" && title !== "Organizers" ? `View all (${countShow})` : "View all"}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.listCard}>
                    {data.map((item, index) => {
                        // Determine event_type dynamically
                        const eventType =
                            item?.dynamicmatchKeyword?.length > 0
                                ? item.dynamicmatchKeyword[0]?.matchKeyword
                                : item?.event_type;
                        const isLast = index === data.length - 1;

                        return (
                            <TouchableOpacity
                                key={item.id || index}
                                activeOpacity={0.75}
                                onPress={() => {
                                    if (title == "Topics") {
                                        countShow("");
                                        const topicurl = item?.url;
                                        const resultTopic = topicurl.substring(topicurl.lastIndexOf('/') + 1);
                                        nav.navigate("Globalresult", { trig: { trig: resultTopic, rqstType: "topicbasedconferences", mainKey: "topic", CreditData: creditDataAll, creditData: creditDataAll, Realback: guestRealback } });
                                    } else if (title == "Speciality" && item?.url) {
                                        countShow("");
                                        nav.navigate("Globalresult", { trig: { trig: item?.url, rqstType: "specialityconferences", mainKey: "conference_specialitiy", CreditData: creditDataAll, creditData: creditDataAll, Realback: guestRealback } });
                                    } else if (title == "Speciality" && item) {
                                        countShow("");
                                        const formattedText = item.toLowerCase().replace(/\s+/g, '-');
                                        nav.navigate("Globalresult", { trig: { trig: formattedText, rqstType: "specialityconferences", mainKey: "conference_specialitiy", CreditData: creditDataAll, creditData: creditDataAll, Realback: guestRealback } });
                                    } else if (title == "Popular specialities") {
                                        searchTextD("");
                                        const formattedTextAno = item.toLowerCase().replace(/\s+/g, '-');
                                        nav.navigate("Globalresult", { trig: { trig: formattedTextAno, rqstType: "specialityconferences", mainKey: "conference_specialitiy", CreditData: creditDataAll, creditData: creditDataAll, Realback: guestRealback } });
                                    } else if (title == "Speakers") {
                                        countShow("");
                                        const separateLine = item?.url;
                                        const slug = separateLine.split('/').pop();
                                        nav.navigate("SpeakerProfile", { fullUrl: { fullUrl: slug, creditData: setSearchText, speaks: "speaker", textHo: "fs" } });
                                    } else if (title == "Organizers") {
                                        countShow("");
                                        const separateLineorgan = item?.url;
                                        const slugOrgan = separateLineorgan.split('/').pop();
                                        nav.navigate("SpeakerProfile", { fullUrl: { fullUrl: slugOrgan, creditData: setSearchText, organ: "organ", textHo: "fs", showtext: "organ" } });
                                    } else {
                                        onPressHandler(item);
                                    }
                                }}
                                style={[styles.touchableContainer, isLast && styles.touchableContainerLast]}
                            >
                                <View style={styles.row}>
                                    <View style={styles.rowIconBadge}>
                                        <Image
                                            source={
                                                eventType === "Text-Based CME"
                                                    ? Imagepath.Textbased
                                                    : eventType === "In-Person Event"
                                                        ? Imagepath.InPerson
                                                        : eventType === "Hybrid Event"
                                                            ? Imagepath.Hybrid
                                                            : eventType === "Webcast"
                                                                ? Imagepath.VideoCam
                                                                : eventType === "Journal CME"
                                                                    ? Imagepath.Journal
                                                                    : eventType === "Podcast"
                                                                        ? Imagepath.PodCast
                                                                        : eventType === "Live Webinar"
                                                                            ? Imagepath.LiveWebinar
                                                                            : Imagepath.WrongArrw
                                            }
                                            style={eventType ? styles.eventtypeicon : styles.icon}
                                        />
                                    </View>
                                    {validTitles && validTitles.includes(title) ? <Text
                                        numberOfLines={2}
                                        style={styles.text}
                                    >
                                        {item.label || item}
                                    </Text> :
                                        <Text numberOfLines={2} style={styles.text}>
                                            {(item.label || item).split('\n').map((line, lineIndex) => {
                                                const safeSearchText = (searchTextD || '').toString();
                                                const cleanSearch = safeSearchText.trim().replace(/\s+/g, ' ');
                                                if (!cleanSearch) {
                                                    return <Text style={styles.text} key={lineIndex}>{line}</Text>;
                                                }
                                                const escapedSearch = cleanSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                                const regex = new RegExp(`(${escapedSearch})`, 'gi');
                                                const parts = line.split(regex);
                                                return (
                                                    <Text key={lineIndex}>
                                                        {parts.map((part, partIndex) => {
                                                            if (!part) return null;
                                                            const isMatch = part.toLowerCase() === cleanSearch.toLowerCase();
                                                            return isMatch ? (
                                                                <Text
                                                                    key={`${lineIndex}-${partIndex}`}
                                                                    style={styles.highlightedText}
                                                                >
                                                                    {part}
                                                                </Text>
                                                            ) : (
                                                                <Text style={styles.text} key={`${lineIndex}-${partIndex}`}>
                                                                    {part}
                                                                </Text>
                                                            );
                                                        })}
                                                    </Text>
                                                );
                                            })}
                                        </Text>}
                                    <ArrowIcons name="chevron-right" size={20} color="#94A3B8" />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        )
    );
};
/**
 * Global search all component.
 * @param {Object} props - Input object.
 * @param {*} props.data - Nested property value.
 * @param {*} props.handleUrl - Nested property value.
 * @param {*} props.searchText - Nested property value.
 * @param {*} props.nav - Nested property value.
 * @param {*} props.setSearchText - Nested property value.
 * @param {*} props.creditDataAll - Nested property value.
 * @param {*} props.isLoading - Nested property value.
 * @returns {JSX.Element}
 */
const GlobalSearchAll = ({ data = {}, handleUrl, searchText = '', nav, setSearchText, creditDataAll = {}, isLoading = false }) => {
    const {
        setIsConnected,
        isConnected
    } = useContext(AppContext);
    const [conn, setConn] = useState(null)
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    /**
* Handles rot.
* @returns {*}
*/
    const handleRot = () => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                <StackNav />
                console.log("Internet is back!");
            }
        });

        return () => unsubscribe();
    }
    console.log(data, "data=====")
    const hasData = (data?.topic?.length > 0 || data?.speciality?.length > 0 || data?.conferences?.length > 0 || data?.speaker?.length > 0 || data?.organizer?.length > 0) || data?.conferences_count;
    const shouldShowLoader = isLoading || conn === null;
    return hasData ? (
        <ScrollView
            style={styles.scrollWrap}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {data?.conferences?.length > 0 &&
                renderSection(
                    data?.conferences_text || 'Conferences',
                    data?.conferences?.flatMap(conf => conf.data),
                    handleUrl,
                    nav,
                    searchText,
                    data?.conferences_count,
                    setSearchText,
                    creditDataAll
                )}
            {data?.speciality?.length > 0 && renderSection('Speciality', data?.speciality, handleUrl, nav, searchText, setSearchText, creditDataAll)}
            {data?.topic?.length > 0 && renderSection('Topics', data?.topic, handleUrl, nav, searchText, setSearchText, creditDataAll)}
            {data?.speaker?.length > 0 && renderSection('Speakers', data?.speaker, handleUrl, nav, searchText, setSearchText, creditDataAll)}
            {data?.organizer?.length > 0 && renderSection('Organizers', data?.organizer, handleUrl, nav, searchText, setSearchText, creditDataAll)}
        </ScrollView>
    ) : shouldShowLoader ? (
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={styles.loaderContent}>
            <ActivityIndicator size={"small"} color={Colorpath.ButtonColr} />
        </ScrollView>
    ) : conn === false ? (
        <SafeAreaView style={styles.container}>
            <View style={styles.centerContainer}>
                <View style={{
                    height: normalize(100),
                    width: normalize(120),
                    borderRadius: normalize(20),
                    bottom: normalize(20),
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { height: 3, width: 0 },
                    elevation: 10,
                    backgroundColor: "#FFFFFF"
                }}>
                    <Image source={Imagepath.NoWifi} style={{ height: normalize(40), width: normalize(40), resizeMode: "contain" }} />
                </View>
                <Buttons
                    onPress={handleRot}
                    height={normalize(25)}
                    width={normalize(240)}
                    // backgroundColor={Colorpath.ButtonColr}
                    borderRadius={normalize(5)}
                    text="No Internet Connection"
                    color={Colorpath.black}
                    fontSize={20}
                    fontFamily={Fonts.InterSemiBold}
                    fontWeight="bold"
                // marginTop={normalize(5)}
                />
                <Buttons
                    onPress={handleRot}
                    height={normalize(45)}
                    width={normalize(290)}
                    // backgroundColor={Colorpath.ButtonColr}
                    borderRadius={normalize(5)}
                    text={`Please check your internet connection ${"\n"}and try again`}
                    color={Colorpath.black}
                    fontSize={16}
                    fontFamily={Fonts.InterSemiBold}
                    fontWeight="bold"
                    marginTop={normalize(5)}
                />
                <Buttons
                    onPress={handleRot}
                    height={normalize(45)}
                    width={normalize(240)}
                    backgroundColor={Colorpath.ButtonColr}
                    borderRadius={normalize(5)}
                    text="Retry"
                    color={Colorpath.white}
                    fontSize={16}
                    fontFamily={Fonts.InterSemiBold}
                    fontWeight="bold"
                    marginTop={normalize(15)}
                />
            </View>
        </SafeAreaView>
    ) : (
        <>
            <ScrollView
                style={styles.scrollWrap}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.emptyScrollContent}
            >
                <View style={styles.emptyCardWrap}>
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyMessage}>
                            {"Sorry! There are no matching results for "}
                            <Text style={styles.emptyHighlight}>
                                {`"${searchText}"`}
                            </Text>
                        </Text>
                    </View>
                </View>
                <View style={styles.emptyPopularSection}>
                    {data?.popularSpecialties?.length > 0 && renderSection('Popular specialities', data?.popularSpecialties, handleUrl, nav, setSearchText)}
                </View>
            </ScrollView>
        </>
    );
};


/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    scrollWrap: {
        width: '100%',
    },
    scrollContent: {
        width: '100%',
        paddingHorizontal: normalize(16),
        paddingTop: normalize(4),
        paddingBottom: normalize(80),
    },
    loaderContent: {
        paddingVertical: normalize(20),
        paddingBottom: normalize(70),
        alignItems: 'center',
    },
    emptyScrollContent: {
        width: '100%',
        paddingHorizontal: normalize(16),
        paddingBottom: normalize(80),
    },
    emptyCardWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(18),
    },
    emptyCard: {
        width: '100%',
        borderRadius: normalize(10),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(16),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5ECF6',
    },
    emptyMessage: {
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        lineHeight: 20,
        color: '#334155',
        textAlign: 'center',
    },
    emptyHighlight: {
        fontFamily: Fonts.InterBold,
        fontSize: 14,
        color: Colorpath.ButtonColr,
    },
    emptyPopularSection: {
        marginTop: normalize(18),
    },
    sectionBlock: {
        marginBottom: normalize(18),
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: normalize(10),
    },
    sectionTitleWrap: {
        flex: 1,
        paddingRight: normalize(8),
    },
    sectionTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 15.5,
        color: '#0F172A',
    },
    viewAllPill: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        borderRadius: normalize(20),
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewAllText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12.5,
        color: Colorpath.ButtonColr,
    },
    listCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: '#E5ECF6',
        overflow: 'hidden',
    },
    touchableContainer: {
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(11),
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    touchableContainerLast: {
        borderBottomWidth: 0,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
    rowIconBadge: {
        width: normalize(28),
        height: normalize(28),
        borderRadius: normalize(7),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(10),
    },
    icon: {
        height: normalize(12),
        width: normalize(12),
        tintColor: Colorpath.ButtonColr,
        resizeMode: 'contain',
    },
    eventtypeicon: {
        height: normalize(15),
        width: normalize(15),
        tintColor: Colorpath.ButtonColr,
        resizeMode: 'contain',
    },
    text: {
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        lineHeight: 20,
        color: '#1E293B',
        flex: 1,
        flexWrap: 'wrap',
        marginRight: normalize(8),
    },
    highlightedText: {
        fontFamily: Fonts.InterBold,
        fontSize: 14,
        lineHeight: 20,
        color: Colorpath.ButtonColr,
    },
    container: {
        position: 'absolute',
        top: 200,
        left: 0,
        right: 0,
        bottom: 0,
        // backgroundColor: Colorpath.Pagebg,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        padding: normalize(10),
        // flex: 0.4
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(20),
        zIndex: 2,
    },
    internetCard: {
        // position: 'absolute',
        top: 400,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colorpath.Pagebg,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        padding: normalize(10),
        marginTop: normalize(10),
        flex: 1,
        gap: normalize(5)
    },
    internetText: {
        color: "#000000",
        fontFamily: Fonts.InterSemiBold,
        fontSize: 20,
    },
});

/**
 * Global search all default export.
 *
 * @returns {*}
 */
export default GlobalSearchAll;
