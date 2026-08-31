/**
 * Wrong global data screen module. Renders a React Native screen or a screen-scoped support component. Exported members: wrongRenderData, letters, getItemLabel, openSpecialityResult, SpecialtyRow, GuestSpecialities, WrongGlobalData, handleRot, styles.
 */

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import Buttons from '../../Components/Button';
import Colorpath from '../../Themes/Colorpath';
import { AppContext } from './AppContext';
import NetInfo from '@react-native-community/netinfo';
import StackNav from '../../Navigator/StackNav';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable wrongRenderData component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const wrongRenderData = (title, data, onPressHandler, creditDataAll, nav, setPlaceholderIndex) => {

    return (
        data && data.length > 0 && (
            <View style={{ marginBottom: normalize(20) }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 20,
                            color: "#000000"
                        }}>
                            {title}
                        </Text>
                    </View>
                    <View>
                        <Buttons
                            onPress={() => {
                                if (title == "State mandatory courses") {
                                    setPlaceholderIndex(0);
                                    nav.navigate("ExploreCastCourse", { creditData: creditDataAll })
                                } else {
                                    setPlaceholderIndex(0);
                                    nav.navigate("BrowseScreen", { creditData: creditDataAll });
                                }
                            }}
                            height={normalize(30)}
                            width={normalize(100)}
                            borderRadius={normalize(5)}
                            text="Browse All"
                            color={Colorpath.ButtonColr}
                            fontSize={16}
                            fontFamily={Fonts.InterSemiBold}
                        />
                    </View>
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
                                if (title == "State mandatory courses") {
                                    onPressHandler(item);
                                } else {
                                    const formattedText = item.toLowerCase().replace(/\s+/g, '-');
                                    nav.navigate("Globalresult", { trig: { trig: formattedText, rqstType: "specialityconferences", mainKey: "conference_specialitiy", creditData: creditDataAll, Realback: "cont" } });
                                }
                            }
                            }
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
                                <Text
                                    numberOfLines={2}
                                    style={styles.text}
                                >
                                    {item.label || item}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        )
    );
};

/**
 * Letters value.
 * @returns {*}
 */
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Returns item label.
 * @param {*} item - Input value.
 * @returns {*}
 */
const getItemLabel = item => {
    if (item == null) return '';
    if (typeof item === 'string') return item.trim();
    return String(item.label || item.name || item.title || item.specialty_name || item.speciality_name || '').trim();
};

/**
 * Open speciality result utility.
 * @param {*} item - Input value.
 * @param {*} nav - Input value.
 * @param {*} creditDataAll - Input value.
 * @returns {void}
 */
const openSpecialityResult = (item, nav, creditDataAll) => {
    const label = getItemLabel(item);
    if (!label) return;
    const formattedText = label.toLowerCase().replace(/\s+/g, '-');
    nav.navigate("Globalresult", {
        trig: {
            trig: formattedText,
            rqstType: "specialityconferences",
            mainKey: "conference_specialitiy",
            creditData: creditDataAll,
            Realback: "cont"
        }
    });
};

/**
 * Specialty row component.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.nav - Nested property value.
 * @param {*} props.creditDataAll - Nested property value.
 * @returns {JSX.Element}
 */
const SpecialtyRow = ({ item, nav, creditDataAll }) => {
    const label = getItemLabel(item);
    if (!label) return null;

    return (
        <TouchableOpacity
            onPress={() => openSpecialityResult(item, nav, creditDataAll)}
            style={styles.guestSpecialtyRow}
            activeOpacity={0.75}
        >
            <Text numberOfLines={1} style={styles.guestSpecialtyText}>
                {label}
            </Text>
            <Text style={styles.guestChevron}>{'>'}</Text>
        </TouchableOpacity>
    );
};

/**
 * Guest specialities component.
 * @param {Object} props - Input object.
 * @param {*} props.data - Nested property value.
 * @param {*} props.nav - Nested property value.
 * @param {*} props.creditDataAll - Nested property value.
 * @returns {JSX.Element}
 */
const GuestSpecialities = ({ data, nav, creditDataAll }) => {
    const [selectedLetter, setSelectedLetter] = useState('A');
    const specialtyData = useMemo(
        () => (Array.isArray(data) ? data.filter(item => getItemLabel(item)) : []),
        [data],
    );
    const availableLetters = useMemo(
        () =>
            new Set(
                specialtyData
                    .map(item => getItemLabel(item)[0]?.toUpperCase())
                    .filter(letter => letters.includes(letter)),
            ),
        [specialtyData],
    );
    const firstAvailableLetter =
        letters.find(letter => availableLetters.has(letter)) || 'A';
    const topSpecialties = specialtyData.slice(0, 5);
    const visibleAlphaSpecialties = specialtyData.filter(item =>
        getItemLabel(item).toUpperCase().startsWith(selectedLetter),
    );

    useEffect(() => {
        if (!availableLetters.has(selectedLetter)) {
            setSelectedLetter(firstAvailableLetter);
        }
    }, [availableLetters, firstAvailableLetter, selectedLetter]);

    return (
        <ScrollView
            style={styles.guestScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={styles.guestContent}
        >
            <Text style={styles.guestSectionTitle}>Top Specialities</Text>
            {topSpecialties.map((item, index) => (
                <SpecialtyRow
                    key={`${getItemLabel(item)}-${index}`}
                    item={item}
                    nav={nav}
                    creditDataAll={creditDataAll}
                />
            ))}

            <Text style={[styles.guestSectionTitle, styles.guestAlphaTitle]}>
                Browse Alphabetically
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.guestLettersContent}
                keyboardShouldPersistTaps="always"
            >
                {letters.map(letter => {
                    const active = selectedLetter === letter;
                    const disabled = !availableLetters.has(letter);
                    return (
                        <TouchableOpacity
                            key={letter}
                            onPress={() => setSelectedLetter(letter)}
                            disabled={disabled}
                            style={[
                                styles.guestLetterButton,
                                active && styles.guestLetterButtonActive,
                                disabled && styles.guestLetterButtonDisabled,
                            ]}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.guestLetterText,
                                    active && styles.guestLetterTextActive,
                                    disabled && styles.guestLetterTextDisabled,
                                ]}
                            >
                                {letter}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {visibleAlphaSpecialties.length > 0 ? (
                visibleAlphaSpecialties.map((item, index) => (
                    <SpecialtyRow
                        key={`alpha-${getItemLabel(item)}-${index}`}
                        item={item}
                        nav={nav}
                        creditDataAll={creditDataAll}
                    />
                ))
            ) : (
                <Text style={styles.guestEmptyText}>No specialities found</Text>
            )}
        </ScrollView>
    );
};

/**
 * Wrong global data component.
 * @param {Object} props - Input object.
 * @param {*} props.wrongData - Nested property value.
 * @param {*} props.handleUrl - Nested property value.
 * @param {*} props.creditDataAll - Nested property value.
 * @param {*} props.nav - Nested property value.
 * @param {*} props.setPlaceholderIndex - Nested property value.
 * @param {*} props.isLoading - Nested property value.
 * @returns {JSX.Element}
 */
const WrongGlobalData = ({ wrongData, handleUrl, creditDataAll, nav, setPlaceholderIndex, isLoading = false }) => {
    const [conn, setConn] = useState(null);
    const {
        isConnected,
        setIsConnected,
    } = useContext(AppContext);
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
    console.log(creditDataAll, "creditDataAll====", wrongData, conn)
    const hasDataWrong = wrongData?.stateMandateCourses?.length > 0 || wrongData?.popularSpecialties?.length > 0;
    const shouldShowLoader = isLoading || conn === null;
    const isGuestEntry = !!creditDataAll?.isGuest;
    if (isGuestEntry && wrongData?.popularSpecialties?.length > 0) {
        return (
            <GuestSpecialities
                data={wrongData?.popularSpecialties}
                nav={nav}
                creditDataAll={creditDataAll}
            />
        );
    }
    return hasDataWrong ? (
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ padding: normalize(10), paddingBottom: normalize(70) }}>
            {wrongData?.popularSpecialties?.length > 0 && wrongRenderData('Popular specialities', wrongData?.popularSpecialties, handleUrl, creditDataAll, nav, setPlaceholderIndex)}
        </ScrollView>
    ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: normalize(25) }}>
            {shouldShowLoader ? (
                <ActivityIndicator size={"small"} color={"green"} />
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
                <View style={{
                    width: normalize(290),
                    borderRadius: normalize(10),
                    backgroundColor: '#FFFFFF',
                    padding: normalize(10),
                    alignItems: 'center',
                    borderStyle: 'dotted',
                    borderWidth: 1,
                }}>
                    <Text style={{
                        fontFamily: Fonts.InterMedium,
                        fontSize: 16,
                        color: '#000000',
                        textAlign: 'center',
                    }}>
                        Sorry! no data found
                    </Text>
                </View>
            )}
        </View>
    );
};


/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    sectionTitle: {
        fontFamily: Fonts.InterBold,
        fontSize: 18,
        color: '#444',
        marginBottom: normalize(10),
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
        height: normalize(12),
        width: normalize(12),
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
    guestContent: {
        width: '100%',
        paddingHorizontal: normalize(18),
        paddingTop: normalize(14),
        paddingBottom: normalize(90),
    },
    guestScroll: {
        width: '100%',
    },
    guestSectionTitle: {
        fontFamily: Fonts.InterBold,
        fontSize: 20,
        color: '#000000',
        marginBottom: normalize(12),
    },
    guestSpecialtyRow: {
        minHeight: normalize(44),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    guestSpecialtyText: {
        flex: 1,
        fontFamily: Fonts.InterRegular,
        fontSize: 18,
        color: '#000000',
        marginRight: normalize(16),
    },
    guestChevron: {
        fontFamily: Fonts.InterRegular,
        fontSize: 34,
        color: '#111111',
        lineHeight: normalize(36),
    },
    guestAlphaTitle: {
        marginTop: normalize(24),
    },
    guestLettersContent: {
        paddingBottom: normalize(12),
    },
    guestLetterButton: {
        height: normalize(44),
        width: normalize(44),
        borderRadius: normalize(44),
        borderWidth: 1,
        borderColor: '#CBD5E1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: normalize(14),
    },
    guestLetterButtonActive: {
        backgroundColor: '#0888D8',
        borderColor: '#0888D8',
    },
    guestLetterButtonDisabled: {
        opacity: 0.35,
    },
    guestLetterText: {
        fontFamily: Fonts.InterBold,
        fontSize: 16,
        color: '#000000',
    },
    guestLetterTextActive: {
        color: '#FFFFFF',
    },
    guestLetterTextDisabled: {
        color: '#6B7280',
    },
    guestEmptyText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 15,
        color: '#6B7280',
        paddingTop: normalize(10),
    },
});

/**
 * Wrong global data default export.
 *
 * @returns {*}
 */
export default WrongGlobalData;
