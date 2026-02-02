import { View, Text, Platform, TouchableOpacity, StyleSheet, FlatList, Animated, Easing, BackHandler, Alert, Image } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import PageHeader from '../../Components/PageHeader';
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import GradientButton from '../../Components/LinearButton';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import OnlineCourse from './OnlineCourse';
import Livecourse from './Livecourse';
import { CommonActions } from '@react-navigation/native';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import Loader from '../../Utils/Helpers/Loader';
import { useSelector } from 'react-redux';
import Imagepath from '../../Themes/Imagepath';
import NetInfo from '@react-native-community/netinfo';
import { AppContext } from '../GlobalSupport/AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'
const Course = (props) => {
    const {
        isConnected,
        fulldashbaord,
        setAddit,
        statepush
    } = useContext(AppContext);
    console.log(props?.route?.params?.taskData, "taskData====",statepush);
    const CMEReducer = useSelector(state => state.CMEReducer);
    const CMEPress = () => {
        setAddit(statepush);
        props.navigation.replace("TabNav");
        // props.navigation.goBack();
    }
    const [linearText, setLinearText] = useState(true);
    const cmecourseData = [{ id: 0, name: "All" }, { id: 1, name: "Pending" }, { id: 2, name: "Completed" }];
    const [fetchname, setFetchname] = useState("All");
    const [fetchnamechnage, setFetchnamechange] = useState("All");
    const [modalShow, setModalShow] = useState(false);
    const [loadingdownst, setLoadingdownst] = useState(false);
    const [loadingdownstlv, setLoadingdownstlv] = useState(false);
    const handleLinearTextChange = (isOnline) => {
        setLinearText(isOnline);
        setFetchname("All");
        setFetchnamechange("All");
    };
    const animatedboardname = useRef(new Animated.Value(1)).current;
    const scalvaluesboard = useRef(new Animated.Value(0)).current;
    const [filteredItems, setFilteredItems] = useState([]);
    const [pendingall, setPendingall] = useState([]);
    const [compltall, setCompltall] = useState([]);
    const [dataAll, setDataAll] = useState([]);
    const [loading, setLoading] = useState(false);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    useEffect(() => {
        const targetImg = fetchname ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedboardname, {
                toValue: fetchname ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scalvaluesboard, {
                toValue: targetImg,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [fetchname]);
    const animatedboardnamelive = useRef(new Animated.Value(1)).current;
    const scalvaluesboardlive = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const livecourse = fetchnamechnage ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedboardnamelive, {
                toValue: fetchnamechnage ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scalvaluesboardlive, {
                toValue: livecourse,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [fetchnamechnage]);
    useEffect(() => {
        const onBackPress = () => {
            CMEPress();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    console.log(dataAll?.length == 0 && linearText && fetchname == "All", "dataalll========", dataAll, loading)
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn == false ? <IntOff /> : <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                {Platform.OS === 'ios' ? <PageHeader
                    title="My CME/CE Courses"
                    onBackPress={CMEPress}
                /> : <View>
                    <PageHeader
                        title="My CME/CE Courses"
                        onBackPress={CMEPress}
                    />
                </View>}
                <Loader visible={dataAll?.length == 0 && linearText && fetchname == "All" && loading} />
                <View style={{ marginTop: normalize(10) }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: normalize(300),
                        height: normalize(38),
                        backgroundColor: "#FFFFFF",
                        borderRadius: normalize(5),
                        alignSelf: 'center',
                    }}>
                        <TouchableOpacity style={linearText ? { justifyContent: "center", alignItems: "center", width: normalize(145), height: normalize(30), borderRadius: normalize(5), marginTop: normalize(4), marginLeft: normalize(5), backgroundColor: "#DCE4FF" } : { justifyContent: "center", alignItems: "center", width: normalize(130) }} onPress={() => handleLinearTextChange(true)}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: linearText ? Colorpath.ButtonColr : "#000000" }}>
                                {"Online"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={!linearText ? { justifyContent: "center", alignItems: "center", width: normalize(145), height: normalize(30), borderRadius: normalize(5), marginTop: normalize(4), marginRight: normalize(5), backgroundColor: "#DCE4FF" } : { justifyContent: "center", alignItems: "center", width: normalize(180) }} onPress={() => handleLinearTextChange(false)}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: !linearText ? Colorpath.ButtonColr : "#000000" }}>
                                {"Live"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <View style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                        {linearText ? (
                            <View>
                                <Animated.View style={{ opacity: animatedboardname, transform: [{ scale: scalvaluesboard }] }}>
                                    {fetchname ? (
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000", fontWeight: "bold", marginLeft: normalize(0) }}>
                                            {"Online Course"}
                                        </Text>
                                    ) : null}
                                </Animated.View>
                                <View style={{ width: normalize(279), marginTop: normalize(5) }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setModalShow(!modalShow);
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000000", paddingVertical: 0 }}>
                                                {fetchname ? fetchname : "Online Course"}
                                            </Text>
                                            <TouchableOpacity style={{ bottom: normalize(17) }} onPress={() => { setModalShow(!modalShow); }}>
                                                <Image source={Imagepath.SortedPng} style={{ height: normalize(20), width: normalize(20), resizeMode: "contain" }} />
                                                {/* <ArrowIcon name={fetchname ? 'arrow-drop-up' : 'arrow-drop-down'} size={28} color={"#000000"} /> */}
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            // <TouchableOpacity onPress={() => { setModalShow(!modalShow) }} style={{ height: normalize(45), width: normalize(290), borderRadius: normalize(10), borderWidth: 0.5, borderColor: "#DDDDDD", backgroundColor: "#FFFFFF", justifyContent: "space-between", flexDirection: "row" }}>
                            //     <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000000", paddingVertical: normalize(13), marginLeft: normalize(10) }}>
                            //         {fetchname}
                            //     </Text>
                            //     <ArrowIcons
                            //         name="keyboard-arrow-down"
                            //         size={30}
                            //         color={Colorpath.black}
                            //         style={{ paddingVertical: normalize(10), marginLeft: normalize(10) }}
                            //     />
                            // </TouchableOpacity>
                        ) : (
                            // <TouchableOpacity onPress={() => { setModalShow(!modalShow) }} style={{ height: normalize(45), width: normalize(290), borderRadius: normalize(10), borderWidth: 0.5, borderColor: "#DDDDDD", backgroundColor: "#FFFFFF", justifyContent: "space-between", flexDirection: "row" }}>
                            //     <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000000", paddingVertical: normalize(13), marginLeft: normalize(10) }}>
                            //         {fetchnamechnage}
                            //     </Text>
                            //     <ArrowIcons
                            //         name="keyboard-arrow-down"
                            //         size={30}
                            //         color={Colorpath.black}
                            //         style={{ paddingVertical: normalize(10), marginLeft: normalize(10) }}
                            //     />
                            // </TouchableOpacity>
                            <View>
                                <Animated.View style={{ opacity: animatedboardnamelive, transform: [{ scale: scalvaluesboardlive }] }}>
                                    {fetchnamechnage ? (
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000", fontWeight: "bold", marginLeft: normalize(0) }}>
                                            {"Live Course"}
                                        </Text>
                                    ) : null}
                                </Animated.View>
                                <View style={{ width: normalize(279), marginTop: normalize(5) }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setModalShow(!modalShow);
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000000", paddingVertical: 0 }}>
                                                {fetchnamechnage ? fetchnamechnage : "Live Course"}
                                            </Text>
                                            <TouchableOpacity style={{ bottom: normalize(17) }} onPress={() => { setModalShow(!modalShow); }}>
                                                <Image source={Imagepath.SortedPng} style={{ height: normalize(20), width: normalize(20), resizeMode: "contain" }} />
                                                {/* <ArrowIcon name={fetchnamechnage ? 'arrow-drop-up' : 'arrow-drop-down'} size={28} color={"#000000"} /> */}
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                    <View style={{ bottom: normalize(10) }}>
                        {linearText && <OnlineCourse loading={loading} setLoading={setLoading} filteredItems={filteredItems} setFilteredItems={setFilteredItems} setPendingall={setPendingall} pendingall={pendingall} setCompltall={setCompltall} compltall={compltall} dataAll={dataAll} setDataAll={setDataAll} setLoadingdownst={setLoadingdownst} loadingdownst={loadingdownst} crediwhole={props?.route?.params?.taskData} fetchname={fetchname} />}
                    </View>
                    <View style={{ bottom: normalize(10) }}>
                        {!linearText && <Livecourse setLoadingdownstlv={setLoadingdownstlv} loadingdownstlv={loadingdownstlv} creditwholelive={props?.route?.params?.taskData} fetchnamelive={fetchnamechnage} />}
                    </View>
                </View>
                <Modal
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    isVisible={modalShow}
                    backdropColor={Colorpath.black}
                    style={{
                        width: '100%',
                        alignSelf: 'center',
                        margin: 0,
                    }}
                    onBackdropPress={() => setModalShow(false)}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setModalShow(false)}>

                        <View
                            style={{
                                borderRadius: normalize(7),
                                height: Platform.OS === 'ios' ? normalize(180) : normalize(180),
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                backgroundColor: '#fff',
                            }}>
                            <FlatList
                                contentContainerStyle={{
                                    // paddingBottom: normalize(70),
                                    paddingTop: normalize(7),
                                }}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={item => item.id}
                                data={cmecourseData}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                if (linearText) {
                                                    setFetchname(item?.name);
                                                } else {
                                                    setFetchnamechange(item?.name);
                                                }
                                                setModalShow(false);
                                            }}
                                            style={[styles.dropDownItem]}>
                                            <Text style={[styles.dropDownItemText]}>
                                                {item?.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </SafeAreaView>}
        </>
    )
}

export default Course

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
