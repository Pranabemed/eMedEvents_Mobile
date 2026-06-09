import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Image,
    ImageBackground,
    Text,
    View,
    StyleSheet,
    BackHandler
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { CommonActions } from '@react-navigation/native';
import normalize from '../../Utils/Helpers/Dimen';
import Imagepath from '../../Themes/Imagepath';
import Fonts from '../../Themes/Fonts';
import Buttons from '../../Components/Button';
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import { getPublicIP } from '../../Utils/Helpers/IPServer';
import { useIsFocused } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sliderData = [
    {
        hText: 'Your Gateway to\n CME/CE Opportunities',
        id: 0,
        img: Imagepath.OneOnboard
    },
    {
        hText: 'Meet State CME/CE Requirements — Stress-Free',
        id: 1,
        img: Imagepath.TwoOnboard
    },
    {
        hText: 'Your Personal Digital Vault for All Certificates',
        id: 2,
        img: Imagepath.ThreeOnboard
    },
    {
        hText: 'Build Your Medical Network, Expand Your Impact',
        id: 3,
        img: Imagepath.FourOnboard
    },
    {
        hText: 'Your CME/CE, Tailored to Your Specialty',
        id: 4,
        img: Imagepath.FiveOnboard
    },
];

const COUNTRY_DIAL_CODES = {
    IN: '+91',
    US: '+1',
    GB: '+44',
    AU: '+61',
    CA: '+1',
    SG: '+65',
};

const Onboard = (props) => {
    const [codegt, setCodegt] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);
    const autoScrollRef = useRef(null);
    const currentIndexRef = useRef(0);
    const isFocused = useIsFocused();
    // const isLastSlide = currentIndex === sliderData.length - 1;
    const SLIDE_INTERVAL = 4000;

    const clearAutoScroll = useCallback(() => {
        if (autoScrollRef.current) {
            clearTimeout(autoScrollRef.current);
            autoScrollRef.current = null;
        }
    }, []);

    const scheduleAutoScroll = useCallback(() => {
        clearAutoScroll();
        autoScrollRef.current = setTimeout(() => {
            const nextIndex = (currentIndexRef.current + 1) % sliderData.length;
            sliderRef.current?.goToSlide(nextIndex, false);
            currentIndexRef.current = nextIndex;
            setCurrentIndex(nextIndex);
            scheduleAutoScroll();
        }, SLIDE_INTERVAL);
    }, [clearAutoScroll]);

    useEffect(() => {
        if (isFocused) {
            scheduleAutoScroll();
        } else {
            clearAutoScroll();
        }
        return () => clearAutoScroll();
    }, [isFocused, clearAutoScroll, scheduleAutoScroll]);

    const handleSlideChange = useCallback((index) => {
        currentIndexRef.current = index;
        setCurrentIndex(index);
    }, []);

    const _renderItem = ({ item }) => {
        const lines = item.hText.split('\n');
        return (
            <View style={styles.slide}>
                <View style={styles.logoContainer}>
                    <Image
                        source={item?.img}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <View style={{ top: normalize(80) }}>
                    <View style={styles.textContainer}>
                        {lines.map((line, index) => (
                            <Text key={index} style={styles.hText}>
                                {line}
                            </Text>
                        ))}
                    </View>
                </View>
            </View>
        );
    };

    const BackToback = useCallback(() => {
        props.navigation.goBack();
    }, [props.navigation]);

    const continueAsGuest = useCallback(() => {
        const guestSessionId = `guest_session_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
        AsyncStorage.setItem('PLAYERSESSION', guestSessionId)
            .then(() => {
                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'GuestUser' }],
                    })
                );
            })
            .catch(err => {
                console.log('Error setting player session:', err);
                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'GuestUser' }],
                    })
                );
            });
    }, [props.navigation]);

    useEffect(() => {
        const onBackPress = () => {
            BackToback();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, [BackToback]);

    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, [props.navigation]);
    const getCountryFromIP = async (ip) => {
        try {
            const res = await fetch(`https://ipinfo.io/${ip}/json`);
            const text = await res.text();
            if (text.startsWith('<')) {
                throw new Error('HTML response');
            }
            const data = JSON.parse(text);
            return data?.country || null; // "IN"
        } catch (e) {
            console.log('Geo lookup failed:', e);
            return null;
        }
    };
    const ipAddress = getPublicIP(); // global value
    useEffect(() => {
        if (!ipAddress) return; // ⛔ wait until IP exists
        const fetchCountry = async () => {
            const countryCode = await getCountryFromIP(ipAddress);
            if (countryCode) {
                const dialCode = COUNTRY_DIAL_CODES[countryCode] || '';
                setCodegt(dialCode); // ✅ push dial code instead of country code
            }
        };
        fetchCountry();
    }, [ipAddress]);

    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.white}
            />
            <ImageBackground
                source={Imagepath.Onboard}
                style={styles.imageBackground}
            >
                <View style={styles.sliderContainer}>
                    <Image source={Imagepath.eMedfulllogo} style={styles.headerLogo} />
                    <AppIntroSlider
                        ref={sliderRef}
                        renderPagination={() => null}
                        renderItem={_renderItem}
                        data={sliderData}
                        keyExtractor={(item) => item.id.toString()}
                        onSlideChange={handleSlideChange}
                        showNextButton={false}
                        showDoneButton={false}
                        showSkipButton={false}
                    />
                </View>

                <View style={styles.footerContainer}>
                    <View style={styles.pagerRow}>
                        {sliderData.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.pagerDot,
                                    index === currentIndex ? styles.pagerDotActive : styles.pagerDotInactive
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.guestButtonSlot}>
                        <Buttons
                            onPress={continueAsGuest}
                            height={normalize(44)}
                            width={'100%'}
                            loading={''}
                            backgroundColor={Colorpath.ButtonColr}
                            borderRadius={normalize(5)}
                            text={"Start Exploring CME/CE"}
                            color={Colorpath.white}
                            fontSize={17}
                            fontFamily={Fonts.InterSemiBold}
                            marginTop={normalize(12)}
                            fontWeight={"500"}
                        />
                    </View>
                    <View style={styles.authRow}>
                        <Buttons
                            onPress={() => {
                                analytics().logEvent('emedevents', {
                                    id: 3745092,
                                    item: 'onboardingpage',
                                    description: "successfully join",
                                    size: 'L',
                                });
                                props.navigation.navigate("Login");
                            }}
                            height={normalize(42)}
                            width={normalize(130)}
                            loading={''}
                            backgroundColor={Colorpath.white}
                            borderRadius={normalize(5)}
                            text={"Sign In"}
                            color={Colorpath.black}
                            fontSize={18}
                            fontFamily={Fonts.InterSemiBold}
                            marginTop={normalize(10)}
                            borderColor={"#333333"}
                            borderWidth={normalize(0.5)}
                            fontWeight={"500"}
                        />
                        <Buttons
                            onPress={() => {
                                if (codegt) {
                                    props.navigation.navigate("SignUp", {
                                        phoneCd: {
                                            phoneCd: codegt,
                                        }
                                    });
                                } else {
                                    props.navigation.navigate("Login");
                                }
                            }}
                            height={normalize(42)}
                            width={normalize(130)}
                            loading={''}
                            backgroundColor={Colorpath.white}
                            borderRadius={normalize(5)}
                            text="Sign Up"
                            color={Colorpath.black}
                            fontSize={18}
                            fontFamily={Fonts.InterSemiBold}
                            marginTop={normalize(10)}
                            borderColor={"#333333"}
                            borderWidth={normalize(0.5)}
                            fontWeight={"500"}
                        />
                    </View>
                </View>
            </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: normalize(60),
        height: normalize(50),
    },
    logo: {
        height: normalize(170),
        width: normalize(224),
    },
    headerLogo: {
        height: normalize(40),
        width: normalize(260),
        resizeMode: "contain",
        marginTop: normalize(70),
        alignSelf: "center",
    },
    sliderContainer: {
        flex: 0.9,
        justifyContent: 'center',
        // alignItems:"center"
    },
    slide: {
        flex: 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        width: normalize(330),
        paddingho: normalize(10)
    },
    hText: {
        color: '#000000',
        textAlign: 'center',
        fontSize: 24,
        fontFamily: Fonts.InterBold,
        // width: normalize(330), // Remove fixed width
        lineHeight: normalize(30),
        fontWeight: "bold"
    },
    footerContainer: {
        marginTop: 'auto',
        paddingTop: normalize(12),
        paddingBottom: normalize(28),
        paddingHorizontal: normalize(18),
        justifyContent: "center",
        alignItems: "center",
        gap: normalize(10)
    },
    authRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: normalize(12),
        width: '100%',
    },
    guestButtonSlot: {
        width: '100%',
        minHeight: normalize(56),
        marginTop: normalize(6),
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagerRow: {
        marginTop: normalize(2),
        marginBottom: normalize(38),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: normalize(8),
    },
    pagerDot: {
        width: normalize(10),
        height: normalize(10),
        borderRadius: normalize(10),
        borderWidth: 1.5,
    },
    pagerDotActive: {
        backgroundColor: '#A39D9D',
        borderColor: '#A39D9D',
    },
    pagerDotInactive: {
        backgroundColor: '#FFFFFF',
        borderColor: '#A39D9D',
    },
    textContainer: {
        paddingHorizontal: normalize(15), // 15 padding on both sides
        width: '100%',  // Take full width
    },
});

export default Onboard;
