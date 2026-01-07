import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native'
import React from 'react'
import Buttons from './Button';
import CircularProgress from './ProgressBar';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';
import normalize from '../Utils/Helpers/Dimen';
import ErrorIcon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment';
import { CommonActions } from '@react-navigation/native';
const  BoardCarousel = ({setBoardnamereal,setTotalboardname,totalboardname, item, index ,boardnamereal,navigation,stateid,boardtake}) =>{
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const calculatedHeight = Platform.OS === "ios" ? windowHeight * 0.84 : windowHeight * 0.75;
    const calculatedWidth = windowWidth * 0.9;
    console.log(item?.board_name)
    const text = item?.board_name;
    const abpmMatch = text.match(/\((.*?)\)/);
    const abpm = abpmMatch ? abpmMatch[1] : "";
    console.log(abpm);
    function daysLeftCountdown(targetDate) {
        const today = new Date();
        const endDate = new Date(targetDate);
        const differenceMs = endDate - today;
        const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
        const countdownMessage = differenceDays;
        return countdownMessage;
    }
    const targetDate = item?.to_date;
    const countdownMessage = daysLeftCountdown(targetDate);
    console.log(countdownMessage);
    console.log(item?.state_id, "item------")
    const styles = StyleSheet.create({
        container: {
            paddingHorizontal: normalize(10),
            paddingVertical: normalize(10),
            backgroundColor: "#FFFFFF",
            borderRadius: normalize(9),
            alignSelf: 'center',
        },
        addButton: {
            justifyContent: "flex-end",
            alignItems: "flex-end",
            paddingHorizontal: normalize(10),
            paddingVertical: normalize(10),
        },
        addButtonText: {
            fontFamily: Fonts.InterMedium,
            fontSize: 14,
            color: Colorpath.ButtonColr,
        },
        centerContent: {
            justifyContent: "center",
            alignItems: "center",
        },
        stateNameContainer: {
            paddingVertical: normalize(5),
        },
        stateNameText: {
            fontFamily: Fonts.InterSemiBold,
            fontSize: 20,
            fontWeight: "bold",
            color: "#000000",
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: normalize(10),
            paddingVertical: normalize(5),
        },
        labelText: {
            fontFamily: Fonts.InterMedium,
            fontSize: 16,
            color: '#666',
        },
        valueText: {
            fontFamily: Fonts.InterSemiBold,
            fontSize: 16,
            color: '#000000',
            fontWeight: 'bold',
        },
        countdownRow: {
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingHorizontal: normalize(15),
        },
        countdownText: {
            fontFamily: Fonts.InterSemiBold,
            fontSize: 12,
            color: '#FF5E62',
            marginLeft: 3,
        },
        progressContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
            paddingHorizontal: normalize(10),
            paddingVertical: normalize(5),
        },
        progressBar: {
            height: 2,
            width: (windowWidth * 0.3 - 40) / 10,
            backgroundColor: "#DDDDDD",
        },
        creditsContainer: {
            backgroundColor: "#FFF2E0",
            padding:10,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
        },
        creditsText: {
            fontFamily: Fonts.InterSemiBold,
            fontSize: 16,
            color: '#000000',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        buttonContainer: {
            // marginTop:normalize(20),
            paddingVertical: normalize(10),
        },
        containercontex: {
            justifyContent: 'center',
            alignItems: 'center',
            padding:normalize(10)
        },
        parentCardex: {
            width: normalize(290),
            borderRadius: normalize(10),
            backgroundColor: '#FFFFFF',
            padding: normalize(10),
            shadowColor: '#c3e9ff',
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 0.1,
            elevation: 5,
            marginBottom: normalize(10), 
          },
          innerCardex: {
            flexDirection: 'row',
            height: normalize(60),
            borderRadius: normalize(10),
            backgroundColor: '#FFFFFF',
            paddingHorizontal: normalize(10),
            paddingVertical: normalize(10),
            alignItems: 'center',
            marginBottom: normalize(10),
            borderWidth:0.5,
            borderColor:"#AAAAAA" 
          },
        iconContainerex: {
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: normalize(10),
        },
        iconex: {
            height: normalize(35),
            width: normalize(35),
            resizeMode: 'contain',
        },
        textContainerex: {
            flex: 1,
            justifyContent: 'center',
        },
        headerRowex: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        titleex: {
            fontFamily: Fonts.InterSemiBold,
            fontSize: 16,
            color: '#000000',
            fontWeight: 'bold',
        },
        crownIconex: {
            marginLeft: normalize(5),
            height: normalize(15),
            width: normalize(15),
            resizeMode: 'contain',
        },
        infoRowex: {
            flexDirection: 'row',
            marginTop: normalize(5),
        },
        infoTextex: {
            fontFamily: Fonts.InterSemiBold,
            fontSize: 14,
            color: '#999',
            fontWeight: 'bold',
        },
        infoCountex: {
            fontFamily: Fonts.InterSemiBold,
            fontSize: 14,
            color: '#000000',
            fontWeight: 'bold',
            paddingHorizontal: normalize(5),
        },
        infoButtonex: {
            position: 'absolute',
            top: 0,
            right: 25,
        },
        infoIconex: {
            height: normalize(18),
            width: normalize(18),
            resizeMode: 'contain',
        },
    });
    return (
        <>
        <View style={styles.container}>
                 {boardnamereal?.length == 0 ? null :<TouchableOpacity
                    onPress={() => {
                        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "AddCertificate",params: { someKey: 'someValue' } }] }));
                    }
                    }
                    style={styles.addButton}
                >
                    <Text style={styles.addButtonText}>{"+ Add Certification"}</Text>
                </TouchableOpacity>}
                <View style={styles.centerContent}>
                    <View style={styles.stateNameContainer}>
                        <Text style={styles.stateNameText}>{abpm ? abpm : "No Board"}</Text>
                    </View>
                    <CircularProgress percentage={item?.credits_data?.percentage} />
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.labelText}> {"Board Certification Id #"}</Text>
                    <Text style={styles.valueText}>{item?.certification_id}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.labelText}>{"Expiry Date#"}</Text>
                    <Text style={styles.valueText}>{moment(item?.to_date).format('MMMM DD, YYYY')}</Text>
                </View>
                <View style={styles.countdownRow}>
                    <ErrorIcon name="error-outline" color={"#FF5E62"} size={20} />
                    <Text style={styles.countdownText}>{`${countdownMessage} days left`}</Text>
                </View>
                <View style={styles.progressContainer}>
                    {Array.from({ length: 24 }).map((_, index) => (
                        <View key={index} style={styles.progressBar} />
                    ))}
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.labelText}>{"Required CME/CE Credits"}</Text>
                    <Text style={styles.valueText}>{item?.credits_data?.total_credits}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.labelText}>{"Mandatory Credits"}</Text>
                    <View style={styles.creditsContainer}>
                        <Text style={styles.creditsText}>
                            {(item?.credits_data?.topic_earned_credits === 0 && item?.credits_data?.topic_credits === 0 )? 'No requirement' :`${item?.credits_data?.topic_earned_credits} / ${item?.credits_data?.topic_credits} earned `}
                        </Text>
                    </View>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.labelText}>{"MOC Credits"}</Text>
                    <View style={styles.creditsContainer}>
                        <Text style={styles.creditsText}>
                            {(`${Math.floor(item?.credits_data?.total_general_earned_credits === 0 )}` && item?.credits_data?.total_general_credits === 0)? 'No requirement':`${(item?.credits_data?.total_general_earned_credits)} / ${(item?.credits_data?.total_general_credits)} earned `}
                        </Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Buttons
                        onPress={() => {
                            navigation.navigate("MOCCertification", {
                                "boardIdMOC": {
                                    stateid: stateid ? stateid : stateid,
                                    creditfirst: Math.floor(item?.credits_data?.total_general_earned_credits),
                                    creditsec: item?.credits_data?.total_general_credits,
                                    Boardname: abpm,
                                    boardtakefinal:boardtake
                                }
                            })
                        }}
                        height={normalize(45)}
                        width={normalize(270)}
                        backgroundColor={Colorpath.ButtonColr}
                        borderRadius={normalize(5)}
                        text="MOC Course Recommendations"
                        color={Colorpath.white}
                        fontSize={16}
                        fontFamily={Fonts.InterSemiBold}
                        fontWeight={"bold"} />
                </View>
            </View>
            
        </>
    );
}
export default BoardCarousel