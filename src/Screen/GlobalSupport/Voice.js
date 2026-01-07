import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, Alert } from 'react-native';
import Voice from '@dev-amirzubair/react-native-voice';
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import normalize from '.././../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { MotiView } from 'moti';
import PhoneRing from './Ring';
import { SafeAreaView } from 'react-native-safe-area-context'
const VoiceSearchBar = ({ SearchCont, searchText, setSearchText, searchEn, setSearchEn }) => {
    const [isListening, setIsListening] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isManuallyStopped, setIsManuallyStopped] = useState(false);
    const [timer, setTimer] = useState(9.76); 
    const [isSpeechDetected, setIsSpeechDetected] = useState(false); // Track if speech is detected
    const timeoutRef = useRef(null);
    const speechEndTimeoutRef = useRef(null);
    const timerRef = useRef(null);
    const [speechResult, setSpeechResult] = useState("");
    useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechEnd = handleSpeechEnd;
        Voice.onSpeechStart = handleSpeechStart;
        const initTimeout = setTimeout(() => {
            startListening();
        }, 500);
        return () => {
            stopListening();
            clearTimeout(timeoutRef.current);
            clearTimeout(speechEndTimeoutRef.current);
            clearTimeout(initTimeout); 
            clearInterval(timerRef.current);
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    useEffect(() => {
        if (isListening) {
            timerRef.current = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 0) {
                        clearInterval(timerRef.current);
                        stopListening();
                        setErrorMessage("Didn't hear that. Try again.");
                        return 0;
                    }
                    return prevTimer - 0.01; 
                });
            }, 10); 
        } else {
            clearInterval(timerRef.current);
            setTimer(9.76);
        }
    }, [isListening]);

    const handleSpeechStart = () => {
        setErrorMessage('');
        setIsManuallyStopped(false);
        setIsSpeechDetected(true);
    };

    const onSpeechResults = (event) => {
        if (event.value && event.value.length > 0) {
            SearchCont(event.value[0]);
            setSearchText(event.value[0]);
            if (Platform.OS === 'ios') {
                setTimeout(() => {
                    setSearchEn(false);
                }, 2000);
            } else {
                setSearchEn(false);
            }
            clearTimeout(timeoutRef.current);
            clearTimeout(speechEndTimeoutRef.current);
        }
    };
    const handleSpeechEnd = () => {
        console.log("Speech ended===============", searchText);
        setSpeechResult(""); // Update the stored result
        setIsListening(false);
        setIsSpeechDetected(false); 
        setSearchText(searchText);
        clearTimeout(timeoutRef.current);
        if (!isManuallyStopped) {
            speechEndTimeoutRef.current = setTimeout(() => {
                startListening();
            }, 1000);
        }
    };

    const startListening = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
                    title: 'Microphone Permission',
                    message: 'App needs access to your microphone for voice search.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                });
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Microphone permission denied');
                    Alert.alert('Permission Required', 'Microphone permission is required for voice search.');
                    return;
                }
            }
            await Voice.start('en-US');
            setIsListening(true);
            setIsManuallyStopped(false);
            resetFallbackTimeout();
        } catch (error) {
            console.error('Error starting voice recognition:', error);
            Alert.alert('Error', 'Failed to start voice recognition. Please try again.');
        }
    };

    const stopListening = async () => {
        try {
            await Voice.stop();
            setIsListening(false);
            setIsManuallyStopped(true);
            setIsSpeechDetected(false); 
            setSearchText(searchText);
            // setSearchEn(false);
            clearTimeout(timeoutRef.current);
            clearTimeout(speechEndTimeoutRef.current);
        } catch (error) {
            console.error('Error stopping voice recognition:', error);
        }
    };

    const resetFallbackTimeout = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (isListening) {
                setErrorMessage("No speech detected. Stopping microphone...");
                setIsListening(false);
                stopListening();
            }
        }, 500);
    };
    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? (
                    <PageHeader title={"Voice"} onBackPress={() => { setSearchEn(false) }} />
                ) : (
                    <View>
                        <PageHeader title={"Voice"} onBackPress={() => { setSearchEn(false) }} />
                    </View>
                )}
                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#333", fontStyle: "italic" }}>
                        {isListening ? (isSpeechDetected ? 'Speaking Now ...' : "Listening...") : searchText}
                    </Text>
                    {errorMessage ? (
                        <Text style={{ alignSelf: "center", fontFamily: Fonts.InterRegular, fontSize: 14, color: "red", marginTop: normalize(10) }}>
                            {errorMessage}
                        </Text>
                    ) : null}
                </View>
                <View style={{ flex: 0.8, justifyContent: "center", alignItems: "center"}}>
                    <PhoneRing isListening={isListening} stopListening={stopListening} startListening={startListening}/>
                </View>
                {errorMessage || !isListening ?<View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{fontFamily:Fonts.InterMedium,fontSize:14,color:"#333"}}>{"Tap the microphone to try again "}</Text>
                </View>:null}
            </SafeAreaView>
        </>
    );
};

export default VoiceSearchBar;
const styles = StyleSheet.create({
    ring: {
        width: normalize(90),
        height: normalize(90),
        borderRadius: normalize(80),
        borderWidth: 0.5,
        position: 'absolute',
    },
})