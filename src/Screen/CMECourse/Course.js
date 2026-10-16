/**
 * Course screen module. Renders a React Native screen or a screen-scoped support component. Exported members: Course, CMEPress, handleLinearTextChange, onBackPress, styles.
 */

import { View, Text, Platform, TouchableOpacity, StyleSheet, FlatList, BackHandler, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import PageHeader from '../../Components/PageHeader';
import Colorpath from '../../Themes/Colorpath';
import MyStatusBar from '../../Utils/MyStatusBar';
import GradientButton from '../../Components/LinearButton';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import OnlineCourse from './OnlineCourse';
import Livecourse from './Livecourse';
import { CommonActions } from '@react-navigation/native';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import Loader from '../../Utils/Helpers/Loader';
import { useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { AppContext } from '../GlobalSupport/AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Reusable Course component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const Course = (props) => {
    const {
        isConnected,
        fulldashbaord,
        setAddit,
        statepush
    } = useContext(AppContext);
    console.log(props?.route?.params?.taskData, "taskData====",statepush);
    const CMEReducer = useSelector(state => state.CMEReducer);
        /**
 * Cmepress component.
 * @returns {void}
 */
const CMEPress = () => {
        setAddit(statepush);
        props.navigation.replace("TabNav");
        // props.navigation.goBack();
    }
    const [linearText, setLinearText] = useState(true);
    const cmecourseData = [{ id: 0, name: "All" }, { id: 1, name: "Pending" }, { id: 2, name: "Completed" }];
    const [fetchname, setFetchname] = useState("All");
    const [fetchnamechnage, setFetchnamechange] = useState("All");
    const [loadingdownst, setLoadingdownst] = useState(false);
    const [loadingdownstlv, setLoadingdownstlv] = useState(false);
        /**
 * Handles linear text change.
 * @param {boolean} isOnline - Input value.
 * @returns {void}
 */
const handleLinearTextChange = (isOnline) => {
        setLinearText(isOnline);
        setFetchname("All");
        setFetchnamechange("All");
    };
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
                /**
 * On back press utility.
 * @returns {boolean}
 */
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
                    <View style={styles.statusRow}>
                        {cmecourseData.map(item => {
                            const selectedStatus = linearText ? fetchname : fetchnamechnage;
                            const isSelected = selectedStatus === item.name;
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.statusTab}
                                    onPress={() => {
                                        if (linearText) {
                                            setFetchname(item.name);
                                        } else {
                                            setFetchnamechange(item.name);
                                        }
                                    }}>
                                    <Text style={[styles.statusText, isSelected && styles.statusTextActive]}>
                                        {item.name}
                                    </Text>
                                    <View style={[styles.statusUnderline, isSelected && styles.statusUnderlineActive]} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View style={{ bottom: normalize(10) }}>
                        {linearText && <OnlineCourse loading={loading} setLoading={setLoading} filteredItems={filteredItems} setFilteredItems={setFilteredItems} setPendingall={setPendingall} pendingall={pendingall} setCompltall={setCompltall} compltall={compltall} dataAll={dataAll} setDataAll={setDataAll} setLoadingdownst={setLoadingdownst} loadingdownst={loadingdownst} crediwhole={props?.route?.params?.taskData} fetchname={fetchname} />}
                    </View>
                    <View style={{ bottom: normalize(10) }}>
                        {!linearText && <Livecourse setLoadingdownstlv={setLoadingdownstlv} loadingdownstlv={loadingdownstlv} creditwholelive={props?.route?.params?.taskData} fetchnamelive={fetchnamechnage} />}
                    </View>
                </View>
            </SafeAreaView>}
        </>
    )
}

/**
 * Course default export.
 *
 * @returns {*}
 */
export default Course

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: normalize(300),
        alignSelf: 'center',
        marginTop: normalize(12),
        marginBottom: normalize(8),
    },
    statusTab: {
        width: normalize(96),
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: normalize(7),
    },
    statusText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        color: '#666666',
    },
    statusTextActive: {
        fontFamily: Fonts.InterSemiBold,
        color: Colorpath.ButtonColr,
        fontWeight: 'bold',
    },
    statusUnderline: {
        width: '100%',
        height: normalize(2),
        marginTop: normalize(7),
        backgroundColor: 'transparent',
    },
    statusUnderlineActive: {
        backgroundColor: Colorpath.ButtonColr,
    },
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
