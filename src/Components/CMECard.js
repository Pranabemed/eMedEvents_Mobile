import { View, Text, Platform, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import Colorpath from '../Themes/Colorpath'
import normalize from '../Utils/Helpers/Dimen';
import Modal from 'react-native-modal';
import Fonts from '../Themes/Fonts';
const CMECard = ({expiryno, allProfTake, CMEcard, setCMECard, styles, item, windowWidth, manWrng,genWrng,finalSumCred }) => {
 function formatRenewalYears(renewal_cycle, to_date) {
    const date = new Date(to_date);
    const endYear = date.getFullYear();
    const startYear = endYear - parseInt(renewal_cycle);
    return `${startYear} to ${endYear}`;
}

    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating={true}
            isVisible={CMEcard}
            style={{ width: '100%', alignSelf: 'center', margin: 0 }}
            animationInTiming={800}
            animationOutTiming={1000}
            onBackdropPress={() => { setCMECard(false); }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderTopRightRadius: normalize(20),
                    borderTopLeftRadius: normalize(20),
                    paddingVertical: normalize(15),
                    paddingBottom: normalize(25)
                }}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <TouchableOpacity onPress={()=>setCMECard(!CMECard)} style={{ justifyContent: "center", alignItems: "center", marginBottom: normalize(5)}}>
                    <View style={{ height: 5, width: normalize(50), backgroundColor: "#DDDDDD", borderRadius: normalize(5) }} />
                </TouchableOpacity>
                <View>
                    <View style={styles.infoRow}>
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 20, color: "#000000" }}>{`${item?.state_name} Requirements`}</Text>
                    </View>
                    {allProfTake && <View style={{
                        flexDirection: 'row',
                        //  justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(5),
                        gap: normalize(5)
                    }}>
                        <View style={{ height: 5, width: 5, backgroundColor: "#000000", borderRadius: 5 }} />
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#999" }}>{`Licensing Cycle - ${formatRenewalYears(item?.renewal_cycle, item?.to_date)}`}</Text>
                    </View>}
                    <View style={{
                        flexDirection: 'row',
                        //  justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(0),
                        gap: normalize(5)
                    }}>
                        <View style={{ height: 5, width: 5, backgroundColor: "#000000", borderRadius: 5 }} />

                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#999" }}>{`Required Credits - ${item?.credits_data?.total_renewal_credits}`}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#000000" }}>{allProfTake ? "AMA PRA Category 1 Credits™" : "CE credits required for license renewal"}</Text>
                        <View style={{ height: normalize(40), width: normalize(40), borderRadius: normalize(40), backgroundColor: "#FFF8E2", justifyContent: "center", alignContent: "center" }}>
                            <Text style={{
                                alignSelf: "center", fontFamily: Fonts.InterBold,
                                fontSize: 23,
                                color: '#000000',
                                fontWeight: 'bold'
                            }}>{parseInt(item?.credits_data?.total_credits)}</Text>
                        </View>
                    </View>
                    <View style={styles.progressContainer}>
                        {Array.from({ length: 24 }).map((_, index) => (
                            <View key={index} style={{
                                height: 2,
                                width: (windowWidth * 0.4 - 40) / 12, backgroundColor: "#DADADA"
                            }} />
                        ))}
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop:normalize(10),
                        marginLeft:normalize(9)
                    }}>
                        <Text style={{fontFamily:Fonts.InterBold,fontSize:16,color:Colorpath.ButtonColr}}>{`Total Credits Earned - ${finalSumCred}`}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(5),
                    }}>
                        <Text style={styles.labelText}>{"Mandatory Credits"}</Text>
                        <View style={styles.creditsContainer}>
                            <Text style={styles.creditsText}>
                                {(item?.credits_data?.topic_earned_credits === 0 && item?.credits_data?.topic_credits === 0)
                                    ? 'No requirement'
                                    : `${item?.credits_data?.topic_earned_credits} / ${item?.credits_data?.topic_credits} earned`}
                            </Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(5),
                    }}>
                        <Text style={styles.labelText}>{"General Credits"}</Text>
                        <View style={styles.creditsContainer}>
                            <Text style={styles.creditsText}>
                                {
                                    parseFloat(item?.credits_data?.total_general_earned_credits) === 0 &&
                                        parseFloat(item?.credits_data?.total_general_credits) === 0
                                        ? "No requirement"
                                        : `${item?.credits_data?.total_general_earned_credits} / ${item?.credits_data?.total_general_credits} earned`
                                }
                            </Text>
                        </View>
                    </View>
                </View>

            </View>
        </Modal>
    )
}

export default CMECard
const styles = StyleSheet.create({
    container: {
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(10),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(5),
    },
    image: {
        height: normalize(20),
        width: normalize(20),
        resizeMode: 'contain',
    },
    title: {
        fontFamily: Fonts.InterMedium,
        fontSize: 18,
        color: Colorpath.ButtonColr,
        marginLeft: normalize(5),
    },
    description: {
        fontFamily: Fonts.InterRegular,
        fontSize: 14,
        color: "#000000",
        lineHeight: 20, // Adjust line height if needed
    },
})