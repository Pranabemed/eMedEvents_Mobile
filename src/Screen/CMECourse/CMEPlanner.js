import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Fonts from '../../Themes/Fonts';
import IconDot from 'react-native-vector-icons/Entypo';
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import Loader from '../../Utils/Helpers/Loader';
import PageHeader from '../../Components/PageHeader';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { CMEPlannerRequest } from '../../Redux/Reducers/CMEReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import ScheduleCourse from './ScheduleCourse';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
const CMEPlanner = (props) => {
    const CMEReducer = useSelector(state => state.CMEReducer);
    const dispatch = useDispatch();
    const [planner, setPlanner] = useState(false);
    const [courseplan, setCourseplan] = useState([]);
    const [filtermodal, setFiltermodal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const handleSave = () => {
        setFiltermodal(false);
    };
    const PlannerPress = () => {
        props.navigation.goBack();
    };
    const openFilterModal = (data) => {
        setFiltermodal(!filtermodal);
        setSelectedItem(data);
    }
    const isFoucus = useIsFocused();
    useEffect(() => {
        const cmePlan = () => {
            connectionrequest()
                .then(() => {
                    dispatch(CMEPlannerRequest())
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err)
                })
        }
        cmePlan();
    }, [isFoucus])
    if (status === '' || CMEReducer.status !== status) {
        switch (CMEReducer.status) {
            case 'CME/CMEPlannerRequest':
                status = CMEReducer.status;
                break;
            case 'CME/CMEPlannerSuccess':
                status = CMEReducer.status;
                console.log(CMEReducer?.CMEPlannerResponse, "CMEPlannerResponse::::::::>>>>>>>>>>>");
                setCourseplan(CMEReducer?.CMEPlannerResponse?.cme_reports);
                break;
            case 'CME/CMEPlannerFailure':
                status = CMEReducer.status;
                break;
        }
    }
    const deletData = [{ id: 0, name: "Edit" }, { id: 1, name: "Delete" }]
    const plannerDataRender = ({ item, index }) => {

        return (
            <View>
                <View style={{ justifyContent: "center", alignSelf: "center", paddingVertical: normalize(10) }}>
                    <View
                        style={{
                            flexDirection: "column",
                            width: normalize(290),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            alignItems: "flex-start",
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                            <Text
                                numberOfLines={2}
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 16,
                                    color: "#000000",
                                    fontWeight: "bold",
                                    flexShrink: 1,
                                    flexWrap: 'wrap',
                                }}
                            >
                                {item?.title}
                            </Text>
                            <TouchableOpacity onPress={() => {
                                console.log("item?.needReview")
                                setPlanner(true);
                            }}>
                                <IconDot name="dots-three-vertical" size={25} color={"#848484"} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: normalize(10), height: 1, width: '100%', backgroundColor: "#DDD" }} />

                        <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(8), borderRadius: normalize(20), backgroundColor: "#FFF2E0", marginTop: normalize(10), alignSelf: 'flex-start' }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#666" }}>
                                {item?.credit?.length > 0 && item?.credit?.map((d) => { return d?.name })}
                            </Text>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(10), width: '100%' }}>
                            <TouchableOpacity onPress={() => { openFilterModal(item) }}
                                style={{
                                    height: normalize(30),
                                    width: normalize(170),
                                    borderRadius: normalize(5),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderColor: Colorpath.ButtonColr,
                                    borderWidth: 0.5
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: 12,
                                        color: "#2C4DB9",
                                    }}
                                >
                                    {"Plan Now !"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

        );
    };

    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {/* <Loader
                    visible={CMEReducer?.status == 'CME/startTestRequest' || CMEReducer?.status == 'CME/evaulateexamRequest'} /> */}
                {Platform.OS === 'ios' ? (
                    <PageHeader
                        title={"Course Planner"}
                        onBackPress={PlannerPress}
                    />
                ) : (
                    <View>
                        <PageHeader
                            title={"Course Planner"}
                            onBackPress={PlannerPress}
                        />
                    </View>
                )}
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: normalize(60) }}>
                    <View>
                        <FlatList
                            data={courseplan}
                            renderItem={plannerDataRender}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingBottom: normalize(20) }}
                            ListEmptyComponent={
                                <Text
                                    style={{
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        color: Colorpath.grey,
                                        fontWeight: 'bold',
                                        fontFamily: Fonts.InterMedium,
                                        fontSize: normalize(20),
                                        paddingTop: normalize(30),
                                    }}>
                                    No data found
                                </Text>
                            }
                        />


                        <Modal
                            animationIn={'slideInUp'}
                            animationOut={'slideOutDown'}
                            isVisible={planner}
                            backdropColor={Colorpath.black}
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                                margin: 0,
                            }}
                            onBackdropPress={() => setPlanner(false)}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={() => setPlanner(false)}>

                                <View
                                    style={{
                                        borderRadius: normalize(7),
                                        height: Platform.OS === 'ios' ? normalize(140) : normalize(140),
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
                                        data={deletData}
                                        renderItem={({ item }) => {
                                            const handlePress = () => {
                                                setPlanner(false);
                                            };

                                            return (
                                                <TouchableOpacity
                                                    onPress={handlePress}
                                                    style={styles.dropDownItem}
                                                >
                                                    <Text style={styles.dropDownItemText}>
                                                        {item?.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        }}
                                    />

                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </View>
                    <ScheduleCourse
                        isfilterVisible={filtermodal}
                        onfilterFalse={openFilterModal}
                        onSave={handleSave}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                    />
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

export default CMEPlanner;
const styles = StyleSheet.create({
    dropDownItem: {
        borderWidth: 1,
        marginTop: normalize(10),
        justifyContent: 'center',
        alignItems: 'center',
        height: normalize(40),
        width: '85%',
        alignSelf: 'center',
    },
    dropDownItemText: {
        fontSize: 16,
        lineHeight: normalize(14),
        textAlign: 'center',
        color: Colorpath.black,
        textTransform: 'capitalize',
        fontFamily: Fonts.InterMedium
    },
})