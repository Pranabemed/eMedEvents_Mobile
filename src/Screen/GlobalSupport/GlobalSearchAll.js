import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import Colorpath from '../../Themes/Colorpath';
import Buttons from '../../Components/Button';
import IntOff from '../../Utils/Helpers/IntOff';
import { AppContext } from './AppContext';
import NetInfo from '@react-native-community/netinfo';
import StackNav from '../../Navigator/StackNav';
import { SafeAreaView } from 'react-native-safe-area-context'

const renderSection = (title, data, onPressHandler, nav, searchTextD, countShow, setSearchText, creditDataAll) => {
    const validTitles = [
        "In-Person Conferences & Online courses",
        "Online courses",
        "Conferences",
    ];
    return (
        data && data.length > 0 && (
            <View style={{ marginBottom: normalize(20) }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }}>
                    <Text style={styles.sectionTitle}>{title}</Text>
                    <TouchableOpacity onPress={() => {
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
                            nav.navigate("Globalresult", { trig: { searchTxt: searchTextD, rqstType: "headerSearch", CreditData: creditDataAll } });
                        }
                    }}
                        style={{
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(8),
                            borderRadius: normalize(5),
                            backgroundColor: Colorpath.ButtonColr,
                            alignSelf: 'flex-start',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: Fonts.InterRegular,
                                fontSize: 12,
                                color: "#fff",
                            }}
                        >
                            {title !== "Topics" && title !== "Speciality" && title !== "Popular specialities" && title !== "Speakers" && title !== "Organizers" ? `View all (${countShow})` : "View all"}
                        </Text>
                    </TouchableOpacity>
                </View>
                {data.map((item, index) => {
                    // Determine event_type dynamically
                    const eventType =
                        item?.dynamicmatchKeyword?.length > 0
                            ? item.dynamicmatchKeyword[0]?.matchKeyword
                            : item?.event_type;

                    return (
                        <TouchableOpacity
                            key={item.id || index}
                            onPress={() => {
                                if (title == "Topics") {
                                    countShow("");
                                    const topicurl = item?.url;
                                    const resultTopic = topicurl.substring(topicurl.lastIndexOf('/') + 1);
                                    nav.navigate("Globalresult", { trig: { trig: resultTopic, rqstType: "topicbasedconferences", mainKey: "topic", CreditData: setSearchText } });
                                } else if (title == "Speciality" && item?.url) {
                                    countShow("");
                                    nav.navigate("Globalresult", { trig: { trig: item?.url, rqstType: "specialityconferences", mainKey: "conference_specialitiy", CreditData: setSearchText } });
                                } else if (title == "Speciality" && item) {
                                    countShow("");
                                    const formattedText = item.toLowerCase().replace(/\s+/g, '-');
                                    nav.navigate("Globalresult", { trig: { trig: formattedText, rqstType: "specialityconferences", mainKey: "conference_specialitiy", CreditData: setSearchText } });
                                } else if (title == "Popular specialities") {
                                    searchTextD("");
                                    const formattedTextAno = item.toLowerCase().replace(/\s+/g, '-');
                                    nav.navigate("Globalresult", { trig: { trig: formattedTextAno, rqstType: "specialityconferences", mainKey: "conference_specialitiy", CreditData: setSearchText } });
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
                            style={styles.touchableContainer}
                        >
                            <View style={styles.row}>
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
                                                                style={{
                                                                    fontFamily: Fonts.InterBold,
                                                                    fontSize: 16,
                                                                    color: Colorpath.ButtonColr
                                                                }}
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
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        )
    );
};
const GlobalSearchAll = ({ data = {}, handleUrl, searchText = '', nav, setSearchText, creditDataAll = {} }) => {
    const {
        setIsConnected,
        isConnected
    } = useContext(AppContext);
    const [showLoader, setShowLoader] = useState(true);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);
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
    return conn == false ? ( // Changed from conn === false to !conn for better readability
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
    ) : hasData ? (
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ padding: normalize(1), paddingBottom: normalize(70) }}>
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
    ) : (
        <>
            <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ padding: normalize(10), paddingBottom: normalize(70) }}>
                {showLoader ? <ActivityIndicator size={"small"} color={"green"} /> : <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: normalize(25) }}>
                    <View
                        style={{
                            flexDirection: 'column',
                            width: normalize(290),
                            borderRadius: normalize(10),
                            backgroundColor: '#FFFFFF',
                            padding: normalize(10),
                            alignItems: 'center',
                            borderStyle: 'dotted',
                            borderWidth: 1,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 16,
                                color: '#000000',
                                textAlign: 'center', // Center-align text
                                flexWrap: 'wrap',
                            }}
                        >
                            {"Sorry! There are no matching results for "}
                            <Text
                                style={{
                                    fontFamily: Fonts.InterBold,
                                    fontSize: 16,
                                    color: Colorpath.ButtonColr,
                                    fontWeight: 'bold',
                                }}
                            >
                                {`"${searchText}"`}
                            </Text>
                        </Text>

                    </View>
                </View>}
                <View style={{ marginTop: normalize(20) }}>
                    {data?.popularSpecialties?.length > 0 && renderSection('Popular specialities', data?.popularSpecialties, handleUrl, nav, setSearchText)}
                </View>
            </ScrollView>
        </>
    );
};


const styles = StyleSheet.create({
    sectionTitle: {
        fontFamily: Fonts.InterBold,
        fontSize: 18,
        color: '#444',
        marginBottom: normalize(10),
        width: normalize(210)
    },
    touchableContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        paddingVertical: normalize(10),
    },
    row: {
        flexDirection: 'row',
        width: normalize(290),
        alignItems: 'center',
    },
    icon: {
        height: normalize(15),
        width: normalize(15),
        tintColor: '#999999',
        resizeMode: 'contain',
        marginRight: normalize(10),
    },
    eventtypeicon: {
        height: normalize(18),
        width: normalize(18),
        tintColor: '#999999',
        resizeMode: 'contain',
        marginRight: normalize(10),
    },
    text: {
        fontFamily: Fonts.InterRegular,
        fontSize: 16,
        color: '#333333',
        flex: 1,
        flexWrap: 'wrap',
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

export default GlobalSearchAll;
