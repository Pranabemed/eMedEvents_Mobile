import { View, Text, Platform, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import PageHeader from '../../Components/PageHeader'
import normalize from '../../Utils/Helpers/Dimen';
import MyStatusBar from '../../Utils/MyStatusBar';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import Fonts from '../../Themes/Fonts';
import TickMark from 'react-native-vector-icons/Ionicons';
import ShareIcn from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { CMECEListRequest } from '../../Redux/Reducers/CMECEExpensReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader';
import LinearGradient from 'react-native-linear-gradient';
let status = "";
import { SafeAreaView } from 'react-native-safe-area-context'
const CMEExDashboard = (props) => {
    const [socheck, setSocheck] = useState(false);
    const CMECEExpensReducer = useSelector(state => state.CMECEExpensReducer);
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    // const CMEData = [{ id: 0, name: "CME/CE Activities" }, { id: 1, name: "Licensing and Certification Fees" }, { id: 2, name: "Professional Membership Fees" }, { id: 3, name: "Educational Materials" }, { id: 4, name: "Technology and Equipment" }]
    const profileBack = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: "TabNav" }
                ],
            })
        );
    }
    const [expandedStates, setExpandedStates] = useState([]);
    const [expandedStatescheck, setExpandedStatescheck] = useState([]);

    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(CMECEListRequest())
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }, [isFocus])

    if (status == '' || CMECEExpensReducer.status != status) {
        switch (CMECEExpensReducer.status) {
            case 'Expenses/CMECEListRequest':
                status = CMECEExpensReducer.status;
                break;
            case 'Expenses/CMECEListSuccess':
                status = CMECEExpensReducer.status;
                console.log(CMECEExpensReducer?.CMECEListResponse?.document_types, "cmeceexpense------");
                const newExpense = CMECEExpensReducer?.CMECEListResponse?.document_types;
                const transformedData = newExpense.map((item, index) => ({
                    id: index + 1,
                    name: item
                }));
                setExpandedStates(transformedData);
                setExpandedStatescheck(new Array(transformedData.length).fill(false))
                break;
            case 'Expenses/CMECEListFailure':
                status = CMECEExpensReducer.status;
                break;
        }
    }
    const toggleExpand = (index) => {
        const newStates = [...expandedStatescheck];
        newStates[index] = !newStates[index];
        setExpandedStatescheck(newStates);
    };
    const handleSelectAll = () => {
        setSocheck(!socheck);
        const newStates = expandedStatescheck.map(() => !socheck);
        setExpandedStatescheck(newStates);
    };
    const CMEItem = ({ item, index }) => {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // justifyContent:"center",
                    backgroundColor: "#FFFFFF",
                    height: normalize(50),
                    width: normalize(300),
                    borderWidth: 1,
                    borderColor: "#DDDDDD",
                    borderRadius: normalize(8),
                    shadowColor: "#000",
                    shadowOffset: { height: 3, width: 0 },
                    shadowOpacity: 10,
                    shadowRadius: 10,
                    elevation: 3,
                }}>

                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: normalize(10),
                        gap: normalize(10)
                    }}>
                        <TouchableOpacity onPress={() => toggleExpand(index)}>
                            {!expandedStatescheck[index] ? (
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
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: "#000000"
                        }}>
                            {item?.name}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        if (index === 0) {
                            props.navigation.navigate("CMEActivity", { name: item?.name })
                        } else {
                            props.navigation.navigate("CMEListing", { headerName: item?.name });
                        }
                    }} style={{ width: normalize(40) }}>
                        <ShareIcn name="right" color={"#000000"} size={25} />
                    </TouchableOpacity>
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
                <Loader
                    visible={CMECEExpensReducer?.status == 'Expenses/CMECEListRequest'} />
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="CME/CE Expenses"
                            onBackPress={profileBack}
                        />
                    ) : (
                        <PageHeader
                            title="CME/CE Expenses"
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
                            <TouchableOpacity onPress={() => { handleSelectAll() }}>
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
                    <FlatList data={expandedStates} renderItem={CMEItem} keyExtractor={(item, index) => index.toString()} />
                </View>
                {/* <View style={{  justifyContent:"center",
        alignItems:"center"}}>
                <TouchableOpacity style={styles.button}>
                    <LinearGradient
                        colors={["#2C4DB9", "#C294FF"]} // Exact gradient colors
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }} // Diagonal direction
                        style={styles.gradient}
                    >
                        <Text style={styles.text}>Alabama</Text>
                    </LinearGradient>
                </TouchableOpacity>
                </View> */}
            </SafeAreaView>
        </>
    )
}

export default CMEExDashboard

const styles = StyleSheet.create({
    button: {
        height:40,
        width:300,
        borderRadius: 10, // Adjust based on the image
    },
    gradient: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    text: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});