import React, { useContext, useEffect, useState } from 'react';
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
                                    nav.navigate("Globalresult", { trig: { trig: formattedText, rqstType: "specialityconferences", mainKey: "conference_specialitiy", creditData: creditDataAll,Realback:"cont" } });
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
const WrongGlobalData = ({ wrongData, handleUrl, creditDataAll, nav, setPlaceholderIndex }) => {
    const [showLoader, setShowLoader] = useState(true);
    const [conn, setConn] = useState("");
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
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(false);
        }, 4000);

        return () => clearTimeout(timeout);
    }, []);
    console.log(creditDataAll, "creditDataAll====", wrongData, conn)
    const hasDataWrong = wrongData?.stateMandateCourses?.length > 0 || wrongData?.popularSpecialties?.length > 0;
    return hasDataWrong ? (
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ padding: normalize(10), paddingBottom: normalize(70) }}>
            {wrongData?.popularSpecialties?.length > 0 && wrongRenderData('Popular specialities', wrongData?.popularSpecialties, handleUrl, creditDataAll, nav, setPlaceholderIndex)}
        </ScrollView>
    ) :  (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: normalize(25) }}>
            {showLoader ? (
                <ActivityIndicator size={"small"} color={"green"} />
            ):conn == false ? ( // Changed from conn === false to !conn for better readability
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
});

export default WrongGlobalData;
