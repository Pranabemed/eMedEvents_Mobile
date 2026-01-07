import { View, Text, Platform, TouchableOpacity, FlatList, Image, Dimensions, ActivityIndicator, RefreshControl, ImageBackground, TextInput, KeyboardAvoidingView, ScrollView, Keyboard, TouchableWithoutFeedback, Alert, BackHandler } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar'
import Colorpath from '../../Themes/Colorpath'
import normalize from '../../Utils/Helpers/Dimen';
import PageHeader from '../../Components/PageHeader';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, useFocusEffect, useIsFocused } from '@react-navigation/native';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { walletsgetRequest, walletsTransRequest } from '../../Redux/Reducers/TransReducer';
import moment from 'moment';
import Modal from 'react-native-modal';
import CalenderIcon from 'react-native-vector-icons/Feather';
import Buttons from '../../Components/Button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DrawerModal from '../../Components/DrawerModal';
import Loader from '../../Utils/Helpers/Loader';
import { AppContext } from '../GlobalSupport/AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
const Wallets = (props) => {
    const { isConnected } = useContext(AppContext);
    const [visible, setVisible] = useState(false);
    const [nodata, setNodata] = useState("drawerclose");
    const [idget, setIdget] = useState("6");
    const toggleDrawerModal = () => {
        setVisible(!visible);
        setNodata("drawerclose");
        setIdget("6");
    };
    const registBaack = () => {
        toggleDrawerModal();
    }
    const TransReducer = useSelector(state => state.TransReducer);
    const windowWidth = Dimensions.get('window').width;
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const [storeAlldata, setStoreAlldata] = useState([]);
    const [apiReq, setApiReq] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [limit, setLimit] = useState(8);
    const [final, setFinal] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [showLine, setShowLine] = useState(false);
    const [provideName, setProvideName] = useState("");
    const [selectCountrytopic, setSelectCountrytopic] = useState([]);
    const [wallettake, setWallettake] = useState(false);
    const [walletdate, setWalletdate] = useState(false);
    const [walletndate, setWalletndate] = useState(false);
    const [sdate, setSdate] = useState("");
    const [ndate, setNdate] = useState("");
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    useEffect(() => {
        if (props?.route?.params?.name == "Wallet Transactions") {
            fetchHandle();
            walletsVal();
        }
    }, [props?.route?.params?.name]);
    const walletsVal = () => {
        let obj = {};
        connectionrequest()
            .then(() => {
                dispatch(walletsgetRequest(obj))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }
    const fetchHandle = () => {
        let obj = {
            "limit": limit,
            "offset": pageNum,
            "searchFromDate": "",
            "searchKeyword": "",
            "searchToDate": ""
        };
        let walletsobj = {
            "offset": 0,
            "searchKeyword": "",
            "searchFromDate": sdate,
            "searchToDate": ndate
        }
        connectionrequest()
            .then(() => {
                dispatch(walletsTransRequest(sdate && ndate ? walletsobj : obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
                setLoading(false);
            });
    };
    useFocusEffect(
        useCallback(() => {
            setFinal([]);
            setSelectCountrytopic([]);
            setStoreAlldata([]); // Reset stored data on focus
            setPageNum(0); // Reset pagination
            fetchHandle(); // Fetch fresh data
        }, [])
    );
    const fetchMore = useCallback(() => {
        const totalCount = TransReducer?.walletsTransResponse?.count || 0;
        const totalDataLength = final?.reduce((acc, item) => acc + item?.data?.length, 0) || 0;
        console.log(totalDataLength, "totalDataLength-------", final, totalCount);
        if (totalDataLength >= totalCount) {
            setApiReq(false);
            setLoading(false);
            return;
        }
        if (!apiReq && TransReducer?.walletsTransResponse?.walletPayments?.length > 0) {
            setPageNum(prevPage => prevPage + 1);
            fetchHandle();
        }
    }, [apiReq, final, TransReducer]);
    const fullDataRefresh = () => {
        setFinal([]);
        setSelectCountrytopic([]);
        setStoreAlldata([]);
        setPageNum(0);
        setRefreshing(false);
        fetchHandle();
    };
    useEffect(() => {
        const onBackPress = () => {
            registBaack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    if (status === '' || TransReducer.status !== status) {
        switch (TransReducer.status) {
            case 'Transaction/walletsTransRequest':
                status = TransReducer.status;
                setApiReq(true);
                setLoading(true);
                break;
            case 'Transaction/walletsTransSuccess':
                status = TransReducer.status;
                setApiReq(false);
                setLoading(false);
                const newData = TransReducer?.walletsTransResponse?.walletPayments || [];
                const totalCount = TransReducer?.walletsTransResponse?.count || 0;

                if (newData.length > 0) {
                    const updatedStoreData = { ...storeAlldata };

                    newData.forEach(item => {
                        if (item?.transactionDate) {
                            const dateString = item.transactionDate;
                            const monthYearMatch = dateString.match(/^([A-Za-z]+) \d{1,2}, (\d{4})$/);
                            if (monthYearMatch) {
                                const month = monthYearMatch[1];
                                const year = monthYearMatch[2];
                                const monthYear = `${month} ${year}`;
                                if (!updatedStoreData[monthYear]) {
                                    updatedStoreData[monthYear] = [];
                                }
                                const isDuplicate = updatedStoreData[monthYear].some(existingItem =>
                                    existingItem.conferenceName === item.conferenceName &&
                                    existingItem.transactionDate === item.transactionDate &&
                                    existingItem.walletAmount === item.walletAmount
                                );
                                if (!isDuplicate) {
                                    updatedStoreData[monthYear].push(item);
                                }
                            } else {
                                console.warn(`Invalid transactionDate format for item:`, item);
                            }
                        }
                    });

                    setStoreAlldata(updatedStoreData);

                    const totalItemsFetched = Object.values(updatedStoreData).flat().length;
                    console.log(totalItemsFetched, "totalItemsFetched");

                    if (totalItemsFetched >= totalCount) {
                        console.log("All data fetched. Stopping API calls.");
                        setApiReq(false);
                        setLoading(false);
                    }
                }

                break;

            case 'Transaction/walletsTransFailure':
                status = TransReducer.status;
                setApiReq(false);
                setLoading(false);
                break;
            case 'Transaction/walletsgetRequest':
                status = TransReducer.status;
                break;
            case 'Transaction/walletsgetSuccess':
                status = TransReducer.status;
                break;
            case 'Transaction/walletsgetFailure':
                status = TransReducer.status;
                break;
        }
    }
    useEffect(() => {
        if (storeAlldata) {
            const monthOrder = {
                'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
            };
            const storetakeAll = Object.keys(storeAlldata)
                .map((monthYear) => {
                    const data = storeAlldata[monthYear];
                    const updatedData = data.map((item) => ({
                        ...item,
                        dataLength: data.length,
                    }));
                    return { monthYear, data: updatedData };
                })
                .sort((a, b) => {
                    const [aMonth, aYear] = a.monthYear.split(' ');
                    const [bMonth, bYear] = b.monthYear.split(' ');
                    if (aYear !== bYear) {
                        return parseInt(bYear) - parseInt(aYear);
                    }
                    return monthOrder[bMonth] - monthOrder[aMonth];
                });

            setSelectCountrytopic(storetakeAll);
            setFinal(storetakeAll);
            console.log(storetakeAll, "storetakeAll", final);
        }
    }, [storeAlldata]);
    const searchTopicName = (text) => {
        console.log(text, 'Input Text');
        setProvideName(text);
        if (text.trim() == '') {
            setFinal(selectCountrytopic);
            return;
        }
        const listAllData = selectCountrytopic
            ?.flatMap(item => item?.data || [item])
            ?.filter(subItem => {
                const itemDataTopic = subItem?.conferenceName?.toUpperCase() || '';
                const textDataTopic = text.trim().toUpperCase();
                return itemDataTopic.includes(textDataTopic);
            });
        console.log(listAllData, 'Filtered List');
        if (listAllData.length > 0) {
            const updatedStoreData = {};
            listAllData.forEach(item => {
                if (item?.transactionDate) {
                    const dateString = item.transactionDate;
                    const monthYearMatch = dateString.match(/^([A-Za-z]+) \d{1,2}, (\d{4})$/);
                    if (monthYearMatch) {
                        const monthYear = `${monthYearMatch[1]} ${monthYearMatch[2]}`;
                        if (!updatedStoreData[monthYear]) {
                            updatedStoreData[monthYear] = [];
                        }
                        const isDuplicate = updatedStoreData[monthYear].some(existingItem =>
                            existingItem.conferenceName === item.conferenceName &&
                            existingItem.transactionDate === item.transactionDate &&
                            existingItem.walletAmount === item.walletAmount
                        );
                        if (!isDuplicate) {
                            updatedStoreData[monthYear].push(item);
                        }
                    } else {
                        console.warn(`Invalid transactionDate format for item:`, item);
                    }
                }
            });
            console.log(updatedStoreData, 'Updated Store Data');
            const storetakeAll = Object.keys(updatedStoreData).map(monthYear => {
                const data = updatedStoreData[monthYear];
                return {
                    monthYear,
                    data: data.map(item => ({ ...item, dataLength: data.length })),
                };
            });
            console.log(storetakeAll, 'Final Data');
            setFinal(storetakeAll);
        } else {
            setFinal([]);
        }
    };
    const renderItem = ({ item, index }) => {
        const isLastItem = index === item?.dataLength - 1;
        return (
            <View>
                <View style={{
                    justifyContent: "center",
                    alignSelf: "center",
                    marginTop: normalize(0),
                    width: normalize(315),
                    backgroundColor: "#FFFFFF",
                }}>
                    <View
                        style={{
                            flexDirection: "column",
                            paddingHorizontal: normalize(10),
                            // paddingVertical: normalize(10),
                            alignItems: "flex-start",
                            backgroundColor: "#FFFFFF",
                            width: normalize(315),


                        }}
                    >
                        <View
                            style={{
                                paddingHorizontal: normalize(10),
                                paddingVertical: normalize(8),
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "106%",
                            }}
                        >
                            <TouchableOpacity>
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 14,
                                        color: "#000000",
                                        flexShrink: 1,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {item?.conferenceName}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                paddingHorizontal: normalize(10),
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 12,
                                    color: "#AAA",
                                }}
                            >
                                {`Trans Date: ${moment(item?.transactionDate, "MMM DD,YYYY").format("MM-DD-YYYY")}`}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: "#333",
                                }}
                            >
                                {`${item?.currencyCode}${item?.walletAmount}`}
                            </Text>
                        </View>
                    </View>
                    {!isLastItem && <View style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 5,
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(5)
                    }}>
                        {Array.from({ length: 24 }).map((_, index) => (
                            <View key={index} style={{
                                height: 2,
                                width: (windowWidth * 0.4 - 25) / 13.5,
                                backgroundColor: "#DDDDDD"
                            }} />
                        ))}
                    </View>}
                </View>
            </View>
        );
    }


    const renderMonthItem = ({ item }) => {
        return (
            <View key={item.monthYear} style={{ paddingHorizontal: normalize(20), marginTop: normalize(10) }}>
                <Text
                    style={{
                        fontFamily: Fonts.InterSemiBold,
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#000000',
                        marginBottom: normalize(10),
                    }}
                >
                    {item.monthYear} {/* Display month and year */}
                </Text>

                <FlatList
                    data={item?.data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
    const [showLoader, setShowLoader] = useState(true);
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg} />
            <SafeAreaView style={{ backgroundColor: Colorpath.Pagebg, flex: 1 }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title={props?.route?.params?.name ? props?.route?.params?.name : props?.route?.params?.name}
                            onBackPress={registBaack}
                        />
                    ) : (
                        <PageHeader
                            title={props?.route?.params?.name ? props?.route?.params?.name : props?.route?.params?.name}
                            onBackPress={registBaack}
                        />

                    )}
                </View>
                {/* <Loader visible={TransReducer.status == 'Transaction/walletsTransRequest'}/>  */}
                {conn == false ? <IntOff /> : <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'height' : undefined}>
                    <ScrollView refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={fullDataRefresh}
                    />} contentContainerStyle={{ paddingBottom: normalize(130) }}>
                        <View styyle={{ flex: 1 }}>
                            {showLoader ?
                                <View style={{ justifyContent: "center", alignContent: "center" }}>
                                    <ImageBackground source={Imagepath.HomeUser} style={{ height: normalize(170), width: normalize(300) }} imageStyle={{ borderRadius: 5 }} resizeMode="stretch">
                                        <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(80) }}>
                                            <ActivityIndicator color={"white"} size="small" />
                                        </View>
                                    </ImageBackground>
                                </View>
                                : !showLine && <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(10) }}>
                                    <ImageBackground source={Imagepath.HomeUser} style={{ height: normalize(170), width: normalize(300) }} imageStyle={{ borderRadius: 5 }} resizeMode="stretch">
                                        <View style={{ flexDirection: "column", paddingVertical: normalize(30), paddingLeft: normalize(20) }}>
                                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#FFFFFF" }}>{"Available Balance"}</Text>
                                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 24, color: "#FFFFFF" }}>{`${TransReducer?.walletsgetResponse?.currencyCode}${TransReducer?.walletsgetResponse?.walletBalance}`}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <View style={{ flexDirection: "column", paddingLeft: normalize(20) }}>
                                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#FFFFFF" }}>{"Spent"}</Text>
                                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#FFFFFF" }}>{`${TransReducer?.walletsgetResponse?.currencyCode}${TransReducer?.walletsgetResponse?.walletSpendAmount}`}</Text>
                                            </View>
                                            <View style={{ flexDirection: "column", paddingRight: normalize(20) }}>
                                                <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#FFFFFF" }}>{"Expiry"}</Text>
                                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#FFFFFF" }}>{TransReducer?.walletsgetResponse?.walletExpirydate ? `${moment(TransReducer?.walletsgetResponse?.walletExpirydate, "MMM DD, YYYY").format("DD/MM/YYYY")}` : "NA"}</Text>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </View>}
                            <View style={{
                                backgroundColor: "#FFFFFF",
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            }}>
                                {!showLine && <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 20 }}>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000" }}>{"Transaction"}</Text>
                                    <TouchableOpacity onPress={() => { setWallettake(!wallettake) }}>
                                        <Image source={Imagepath.Filter} style={{ height: normalize(20), width: normalize(20), resizeMode: "contain" }} />
                                    </TouchableOpacity>
                                </View>}
                                <View style={{ justifyContent: "center", alignSelf: "center", width: normalize(290) }}>
                                    <View
                                        style={{
                                            borderBottomColor: '#000000',
                                            borderBottomWidth: 0.5,
                                            // marginTop: normalize(5)
                                        }}>
                                        <TextInput
                                            editable={true}
                                            onChangeText={searchTopicName}
                                            value={provideName}
                                            style={{ height: normalize(35), width: normalize(290), fontSize: 16, color: "#000000", fontFamily: Fonts.InterRegular }}
                                            placeholder="Search Transactions here"
                                            placeholderTextColor={"#000000"}
                                            keyboardType="default"
                                        />
                                    </View>
                                </View>
                                <FlatList
                                    data={final}
                                    renderItem={renderMonthItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    onEndReached={fetchMore}
                                    onEndReachedThreshold={0.5}
                                    scrollEventThrottle={16}
                                    ListFooterComponent={
                                        loading && !showLoader ? <ActivityIndicator color={Colorpath.ButtonColr} size="large" /> : null
                                    }
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={fullDataRefresh}
                                        />
                                    }
                                    ListEmptyComponent={showLoader ? <ActivityIndicator color={"green"} size="small" /> :
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
                            </View>
                        </View>
                    </ScrollView>
                    <Modal
                        animationIn={'slideInUp'}
                        animationOut={'slideOutDown'}
                        isVisible={wallettake}
                        backdropColor={Colorpath.black}
                        style={{
                            width: '100%',
                            alignSelf: 'center',
                            margin: 0,
                            justifyContent: "center",
                            alignContent: "center"
                        }}
                        onBackdropPress={() => setWallettake(false)}>
                        <View style={{
                            width: normalize(300),
                            backgroundColor: Colorpath.white,
                            borderRadius: normalize(10),
                            padding: normalize(30),
                            justifyContent: "center",
                            alignSelf: "center"
                        }}>
                            <View style={{ bottom: normalize(15) }}>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#999999" }}>{"Filter by Date"}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }}>
                                <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5, width: "47%" }}>
                                    <TouchableOpacity onPress={() => {
                                        setWalletdate(!walletdate)
                                    }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 0 }}>
                                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000000", paddingHorizontal: 2 }}>
                                                {sdate ? sdate : "Select Date"}
                                            </Text>
                                            <View style={{ bottom: 4 }}>
                                                <CalenderIcon name={'calendar'} size={25} color={"#000000"} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5, width: "47%" }}>
                                    <TouchableOpacity onPress={() => {
                                        setWalletndate(!walletndate)
                                    }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 0 }}>
                                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000000", paddingHorizontal: 2 }}>
                                                {ndate ? ndate : "Select Date"}
                                            </Text>
                                            <View style={{ bottom: 4 }}>
                                                <CalenderIcon name={'calendar'} size={25} color={"#000000"} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ justifyContent: "flex-end", alignContent: "flex-end", flexDirection: "row", gap: normalize(10) }}>
                                <Buttons
                                    onPress={() => {
                                        setWallettake(!wallettake);
                                        setNdate("");
                                        setSdate("");
                                        setStoreAlldata([]);
                                        setSelectCountrytopic([]);
                                        setFinal([]);
                                        // setShowLine(true);
                                        fetchHandle();
                                    }}
                                    height={normalize(35)}
                                    width={normalize(100)}
                                    backgroundColor={Colorpath.white}
                                    borderRadius={normalize(5)}
                                    text="Cancel"
                                    color={"#999999"}
                                    fontSize={16}
                                    fontFamily={Fonts.InterMedium}
                                    marginTop={normalize(10)}
                                    borderBottomWidth={0.8}
                                    borderColor={"#999999"}
                                    borderWidth={1}
                                />
                                <Buttons
                                    onPress={() => {
                                        if (!sdate) {
                                            showErrorAlert("Please select From Date")
                                        } else if (!ndate) {
                                            showErrorAlert("Please select To Date")
                                        } else {
                                            fullDataRefresh();
                                            setWallettake(!wallettake);
                                            // setNdate("");
                                            // setSdate("");
                                            setStoreAlldata([]);
                                            setSelectCountrytopic([]);
                                            setFinal([]);
                                            // setShowLine(true);
                                            fetchHandle();
                                        }
                                    }}
                                    height={normalize(35)}
                                    width={normalize(100)}
                                    backgroundColor={Colorpath.ButtonColr}
                                    borderRadius={normalize(5)}
                                    text="Submit"
                                    color={Colorpath.white}
                                    fontSize={16}
                                    fontFamily={Fonts.InterMedium}
                                    marginTop={normalize(10)}
                                />
                            </View>
                        </View>
                        <DateTimePickerModal
                            isVisible={walletdate}
                            mode="date"
                            date={sdate ? new Date(sdate) : undefined}
                            maximumDate={ndate ? new Date(ndate) : undefined}
                            onConfirm={val => {
                                setSdate(moment(val).format('YYYY-MM-DD'));
                                setWalletdate(false);
                            }}
                            onCancel={() => setWalletdate(false)}
                            textColor="black"
                        />
                        <DateTimePickerModal
                            isVisible={walletndate}
                            mode="date"
                            // never allow selecting before sdate (if sdate exists)
                            minimumDate={sdate ? moment(sdate, 'YYYY-MM-DD').toDate() : undefined}
                            // open To picker with previously chosen ndate (if exists),
                            // otherwise default to today.
                            // Also ensure the initial date is not before minimumDate:
                            date={
                                (() => {
                                    const today = new Date();
                                    if (ndate) {
                                        const picked = moment(ndate, 'YYYY-MM-DD').toDate();
                                        // if picked is earlier than sdate (shouldn't happen normally), clamp to min
                                        if (sdate && picked < moment(sdate, 'YYYY-MM-DD').toDate()) {
                                            return moment(sdate, 'YYYY-MM-DD').toDate();
                                        }
                                        return picked;
                                    }
                                    // no previous ndate; default to today but clamp to sdate if needed
                                    if (sdate && today < moment(sdate, 'YYYY-MM-DD').toDate()) {
                                        return moment(sdate, 'YYYY-MM-DD').toDate();
                                    }
                                    return today;
                                })()
                            }
                            onConfirm={val => {
                                setNdate(moment(val).format('YYYY-MM-DD'));
                                setWalletndate(false);
                            }}
                            onCancel={() => setWalletndate(false)}
                            textColor="black"
                        />
                    </Modal>
                    <DrawerModal
                        expandId={idget}
                        handel={nodata}
                        isVisible={visible}
                        onBackdropPress={() => setVisible(!visible)}
                        onRequestClose={() => setVisible(false)}
                        backButton={() => setVisible(!visible)}
                        rentalNavigate={() => setVisible(!visible)}
                        watchlistNavigate={() => setVisible(!visible)}
                        subscribeNavigate={() => setVisible(!visible)}
                        rewardNavigate={() => setVisible(!visible)}
                        homeNavigate={() => setVisible(!visible)}
                        expensesNav={() => setVisible(!visible)}
                        interestedNav={() => setVisible(!visible)}
                        drawerPress={() => setVisible(!visible)}
                    />
                </KeyboardAvoidingView>}
            </SafeAreaView>
        </>
    )
}

export default Wallets