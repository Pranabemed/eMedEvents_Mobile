import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import { NativeEventEmitter, NativeModules } from 'react-native';
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import PageHeader from '../../Components/PageHeader';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import PhoneRing from './Ring';
import { SafeAreaView } from 'react-native-safe-area-context'

const { SpeechRecognition } = NativeModules;
const speechRecognitionEmitter = new NativeEventEmitter(SpeechRecognition);

const NativeIOSVoice = ({ SearchCont, searchText, setSearchText, searchEn, setSearchEn }) => {
    const [isListening, setIsListening] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSpeechDetected, setIsSpeechDetected] = useState(false);
    const timeoutRef = useRef(null);
    const speechEndTimeoutRef = useRef(null);
    const timerRef = useRef(null);
    const [speechResult, setSpeechResult] = useState("");

    useEffect(() => {
        startRecording(); // Start mic automatically when screen loads

        const onSpeechResults = (event) => {
            if (event.transcript) {
                console.log(event,"event===========")
                SearchCont(event.transcript);
                // setSearchText(event.transcript);
                setTimeout(() => {
                    setSearchEn(false);
                    stopRecording(); 
                }, 2000);
                // setIsSpeechDetected(true);
                // clearTimeout(timeoutRef.current);
                // clearTimeout(speechEndTimeoutRef.current);
                // stopRecording(); 
              }
        };

        const subscription = speechRecognitionEmitter.addListener('onSpeechResults', onSpeechResults);

        return () => {
            subscription.remove();
            stopRecording();
            // clearTimeout(timeoutRef.current);
            // clearTimeout(speechEndTimeoutRef.current);
            // clearInterval(timerRef.current);
        };
    }, []);
    const startRecording = async () => {
        try {
            await SpeechRecognition.startRecording();
            setIsListening(true);
            // setIsSpeechDetected(false);

            // // Stop listening automatically after 9.76 seconds if no speech is detected
            // timeoutRef.current = setTimeout(() => {
            //     if (!isSpeechDetected) {
            //         setErrorMessage("No speech detected. Stopping microphone...");
            //         stopRecording();
            //     }
            // }, 10060); 

        } catch (error) {
            console.error('Error starting voice recognition:', error);
            Alert.alert('Error', 'Failed to start voice recognition. Please try again.');
        }
    };

    const stopRecording = async () => {
        try {
            await SpeechRecognition.stopRecording();
            setIsListening(false);
            // setIsSpeechDetected(false);
            // clearTimeout(timeoutRef.current);
            // clearTimeout(speechEndTimeoutRef.current);
        } catch (error) {
            console.error('Error stopping voice recognition:', error);
        }
    };

    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <PageHeader title={"Voice"} onBackPress={() => { setSearchEn(false) }} />
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
                <View style={{ flex: 0.8, justifyContent: "center", alignItems: "center" }}>
                    <PhoneRing isListening={isListening} stopListening={stopRecording} startListening={startRecording} />
                </View>
                {errorMessage || !isListening ? (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#333" }}>{"Tap the microphone to try again "}</Text>
                    </View>
                ) : null}
            </SafeAreaView>
        </>
    );
};

export default NativeIOSVoice;
