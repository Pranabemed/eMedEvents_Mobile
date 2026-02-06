import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Image,
    ImageBackground,
    Text,
    View,
    StyleSheet,
    Alert,
    Platform,
    BackHandler,
    Easing,
    Animated,
    Linking,
    PermissionsAndroid,
    InteractionManager
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import normalize from '../../Utils/Helpers/Dimen';
import Imagepath from '../../Themes/Imagepath';
import Fonts from '../../Themes/Fonts';
import Buttons from '../../Components/Button';
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import { getPublicIP } from '../../Utils/Helpers/IPServer';
import analytics from '@react-native-firebase/analytics';
const Onboard = (props) => {
    const [codegt, setCodegt] = useState("");
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
            hText: 'Build Your Medical Network,Expand Your Impact',
            id: 3,
            img: Imagepath.FourOnboard
        },
        {
            hText: 'Your CME/CE, Tailored to Your Specialty',
            id: 4,
            img: Imagepath.FiveOnboard
        },
    ];
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);
    const timerRef = useRef(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        startAutoScroll();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [sliderData]);
    useEffect(() => {
        startAutoScroll();
        return () => clearTimer();
    }, []);
    const handleSlideChange = (index) => {
        setCurrentIndex(index);
        startAutoScroll(); // Reset timer on manual slide change
    };
    const startAutoScroll = () => {
        clearTimer();
        timerRef.current = setInterval(() => {
            // Forward scrolling that loops back to start
            const nextIndex = (currentIndex + 1) % sliderData.length;

            // Fade out animation
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start(() => {
                // Change slide and fade back in
                sliderRef.current?.goToSlide(nextIndex, true);
                setCurrentIndex(nextIndex);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }).start();
            });
        }, 4000);
    };

    const _renderItem = ({ item }) => {
        const lines = item.hText.split('\n');
        return (
            <Animated.View style={[styles.slide, { opacity: fadeAnim }]}>
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
            </Animated.View>
        );
    };

    const BackToback = () => {
        props.navigation.goBack();
    }

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
    }, []);
    const clearTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);
    const COUNTRY_DIAL_CODES = {
        IN: '+91',
        US: '+1',
        GB: '+44',
        AU: '+61',
        CA: '+1',
        SG: '+65',
    };
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
                    <Image source={Imagepath.eMedfulllogo} style={{ height: normalize(40), width: normalize(260), resizeMode: "contain", marginTop: normalize(70), alignSelf: "center" }} />
                    <AppIntroSlider
                        ref={sliderRef}
                        activeDotStyle={styles.activeDotStyle}
                        dotStyle={styles.dotStyle}
                        renderItem={_renderItem}
                        data={sliderData}
                        keyExtractor={(item) => item.id.toString()}
                        onSlideChange={handleSlideChange}
                        showNextButton={false}
                        showDoneButton={false}
                        showSkipButton={false}
                        onTouchStart={clearTimer}
                        onTouchEnd={startAutoScroll}
                    />
                </View>

                {/* Fixed Buttons */}
                <View style={styles.buttonContainer}>
                    <Buttons
                        onPress={async() => {
                            await analytics().logEvent('emedevents', {
                                id: 3745092,
                                item: 'onboardingpage',
                                description: "successfully join",
                                size: 'L',
                            }),
                                props.navigation.navigate("Login")
                        }}
                        height={normalize(38)}
                        width={normalize(130)}
                        loading={''}
                        backgroundColor={Colorpath.ButtonColr}
                        borderRadius={normalize(5)}
                        text={"Sign In"}
                        color={Colorpath.white}
                        fontSize={18}
                        fontFamily={Fonts.InterSemiBold}
                        marginTop={normalize(10)}
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
                        height={normalize(38)}
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
                    {/* <Buttons
                        onPress={() => {
                            props.navigation.navigate("SignUp", {
                                phoneCd: {
                                    phoneCd: "+91",
                                }
                            });
                        }}
                        height={normalize(38)}
                        width={normalize(290)}
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
                    /> */}
                </View>
                {/* <Pressable onPress={()=>props.navigation.navigate("Login")} style={{justifyContent:"center",alignItems:"center"}}>
                   <Text style={{fontFamily:Fonts.InterMedium,fontSize:16,color:"#666666"}}>{"Skip"}</Text>
                </Pressable> */}
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
    buttonContainer: {
        paddingBottom: normalize(30),
        // alignItems: 'center',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: normalize(10)
    },
    activeDotStyle: {
        width: normalize(10),
        height: normalize(10),
        borderRadius: normalize(12),
        backgroundColor: '#A39D9D',
        marginHorizontal: normalize(7),
    },
    dotStyle: {
        backgroundColor: '#FFFFFF',
        width: normalize(10),
        height: normalize(10),
        borderRadius: normalize(10),
        marginHorizontal: normalize(7),
        borderWidth: 2,
        borderColor: "#A39D9D",
    },
    textContainer: {
        paddingHorizontal: normalize(15), // 15 padding on both sides
        width: '100%',  // Take full width
    },
});

export default Onboard;