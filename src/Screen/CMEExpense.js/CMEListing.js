
import { View, Text, Platform, TouchableOpacity, FlatList, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import { CommonActions } from '@react-navigation/native';
import TickMark from 'react-native-vector-icons/Ionicons';
import ShareIcn from 'react-native-vector-icons/AntDesign';
import IconDot from 'react-native-vector-icons/Entypo';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import CalIcn from 'react-native-vector-icons/Entypo';
import { styles } from '../Specialization/SpecialStyle';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context'

const CMEListing = (props) => {
    const [CMEmodal, setCMEModal] = useState(false);
    console.log(props?.route?.params?.headerName, "fkjfkj")
    const profileBack = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: "CMEExDashboard" }
                ],
            })
        );

    }
    const CMEListingData = [{ id: 0, name: "Association Tech" }, { id: 1, name: "Association Technology" }]
    const [socheck, setSocheck] = useState(false);
    const [expandedStates, setExpandedStates] = useState(Array(CMEListingData?.length).fill(false)); // Track expand/collapse state for each day
    const dommyData = [{ id: 0, name: "View ", Icon: "eye" },{ id: 1, name: "Edit", Icon: "edit" },{ id: 2, name: "share", Icon: "sharealt" }, { id: 3, name: "Download", Icon: "download" }]
    const toggleExpand = (index) => {
        const newStates = [...expandedStates];
        newStates[index] = !newStates[index];
        setExpandedStates(newStates);
    };
    const CMEListItem = ({ item, index }) => {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                <View style={{
                    backgroundColor: "#FFFFFF",
                    paddingVertical: normalize(10),
                    paddingHorizontal: normalize(15),
                    width: normalize(300),
                    borderWidth: 1,
                    borderColor: "#DDDDDD",
                    borderRadius: normalize(8),
                    shadowColor: "#000",
                    shadowOffset: { height: 3, width: 0 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 3,
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: normalize(10),
                        }}>
                            <TouchableOpacity onPress={() => toggleExpand(index)}>
                                {!expandedStates[index] ? (
                                    <View style={{
                                        height: normalize(15),
                                        width: normalize(15),
                                        borderColor: Colorpath.black,
                                        borderRadius: normalize(2),
                                        borderWidth: normalize(0.5),
                                    }} />
                                ) : (
                                    <View style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: Colorpath.ButtonColr,
                                        borderColor: Colorpath.ButtonColr,
                                        height: normalize(15),
                                        width: normalize(15),
                                        borderRadius: normalize(2),
                                        borderWidth: normalize(0.5),
                                    }}>
                                        <TickMark name="checkmark" color={Colorpath.white} size={12} />
                                    </View>
                                )}
                            </TouchableOpacity>
                            <Text style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 16,
                                color: "#000000",
                            }}>
                                {item?.name}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={()=>{setCMEModal(!CMEmodal)}} style={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <IconDot name="dots-three-vertical" size={25} color={"#848484"} />
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginTop: normalize(10),
                        paddingHorizontal: normalize(10),
                    }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: normalize(20),
                        }}>
                            <Image source={Imagepath.CreditValut} style={{
                                height: normalize(20),
                                width: normalize(20),
                                resizeMode: "contain",
                                tintColor: "#848484"
                            }} />
                            <Text style={{
                                fontFamily: Fonts.InterSemiBold,
                                color: "#848484",
                                fontSize: 14,
                                marginLeft: normalize(5),
                            }}>
                                {"5.00"}
                            </Text>
                        </View>


                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                            <CalIcn name="calendar" size={25} color={"#848484"} />
                            <Text style={{
                                fontFamily: Fonts.InterSemiBold,
                                color: "#848484",
                                fontSize: 14,
                                marginLeft: normalize(5),
                            }}>
                                {"2023-11-05"}
                            </Text>
                        </View>
                    </View>


                </View>
            </View>
        )
    }
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title={props?.route?.params?.headerName ? props?.route?.params?.headerName : props?.route?.params?.headerName}
                            onBackPress={profileBack}
                        />
                    ) : (
                        <PageHeader
                            title={props?.route?.params?.headerName ? props?.route?.params?.headerName : props?.route?.params?.headerName}
                            onBackPress={profileBack}
                        />

                    )}
                </View>
                <View style={{ paddingHorizontal: normalize(0), paddingVertical: normalize(10) }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#FFFFFF",
                        height: normalize(50),
                        borderWidth: 1,
                        borderColor: "#DDDDDD",
                        // borderRadius: normalize(5)
                    }}>

                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: normalize(10),
                            gap: normalize(10)
                        }}>
                            <TouchableOpacity onPress={() => setSocheck(!socheck)}>
                                {!socheck ? (
                                    <View style={{
                                        height: normalize(15),
                                        width: normalize(15),
                                        borderColor: Colorpath.black,
                                        borderRadius: normalize(2),
                                        borderWidth: normalize(0.5),
                                    }} />
                                ) : (
                                    <View style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: Colorpath.ButtonColr,
                                        borderColor: Colorpath.ButtonColr,
                                        height: normalize(15),
                                        width: normalize(15),
                                        borderRadius: normalize(2),
                                        borderWidth: normalize(0.5),
                                    }}>
                                        <TickMark name="checkmark" color={Colorpath.white} size={14} />
                                    </View>
                                )}
                            </TouchableOpacity>
                            <Text style={{
                                fontFamily: Fonts.InterRegular,
                                fontSize: 14,
                                color: "#040D14"
                            }}>
                                {"Select All"}
                            </Text>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <TouchableOpacity style={{ width: normalize(40) }}>
                                <ShareIcn name="sharealt" color={"#CCCCCC"} size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: normalize(30) }}>
                                <ShareIcn name="download" color={"#CCCCCC"} size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                    <FlatList data={CMEListingData} renderItem={CMEListItem} keyExtractor={(item, index) => index.toString()} />
                </View>
                <View style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 0,
                    paddingHorizontal: normalize(20),
                    zIndex: 999
                }}>
                    <TouchableOpacity onPress={()=>{props.navigation.navigate("AddExpenses")}} style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        height: normalize(50),
                        width: normalize(50),
                        backgroundColor: Colorpath.ButtonColr,
                        borderWidth: 0.5,
                        borderColor: "#AAAAAA",
                        borderRadius: normalize(50),
                        paddingHorizontal: normalize(15)
                    }}>
                        <ShareIcn name="plus" color={Colorpath.white} size={25} />
                    </TouchableOpacity>
                </View>
                <Modal
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    isVisible={CMEmodal}
                    backdropColor={Colorpath.black}
                    style={{
                        width: '100%',
                        alignSelf: 'center',
                        margin: 0,
                    }}
                    onBackdropPress={() => setCMEModal(false)}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setCMEModal(false)}>

                        <View
                            style={{
                                borderRadius: normalize(7),
                                height: Platform.OS === 'ios' ? normalize(230) : normalize(230),
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                backgroundColor: '#fff',
                            }}>
                            <FlatList
                                contentContainerStyle={{
                                    paddingBottom: normalize(70),
                                    paddingTop: normalize(7),
                                }}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={item => item.id.toString()}
                                data={dommyData}
                                renderItem={({ item, index }) => {


                                    return (
                                        <>
                                            <TouchableOpacity
                                                style={[styles.dropDownItem,{flexDirection:"row"}]}
                                            >

                                                <View style={{ paddingHorizontal: normalize(10) }}>
                                                    <ShareIcn name={item.Icon} size={25} color={Colorpath.black} />
                                                </View>
                                                <Text style={styles.dropDownItemText}>
                                                    {item?.name}
                                                </Text>

                                            </TouchableOpacity>
                                        </>
                                    );
                                }}
                            />

                        </View>
                    </TouchableOpacity>
                </Modal>
            </SafeAreaView>
        </>
    )
}

export default CMEListing