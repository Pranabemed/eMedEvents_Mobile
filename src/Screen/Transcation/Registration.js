import { View, Text, Platform, TouchableOpacity, FlatList, Image, Dimensions, ActivityIndicator, RefreshControl, Alert, BackHandler } from 'react-native'
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
import { registPaymentRequest } from '../../Redux/Reducers/TransReducer';
import moment from 'moment';
import DrawerModal from '../../Components/DrawerModal';
import { AppContext } from '../GlobalSupport/AppContext';
import IconDot from 'react-native-vector-icons/Entypo';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import Loader from '../../Utils/Helpers/Loader';
import { styles } from '../Specialization/SpecialStyle';
import Modal from 'react-native-modal';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'
let status = "";
const Registration = (props) => {
    const { takestate, addit, isConnected } = useContext(AppContext);
    console.log(props?.route?.params?.name, "dddddd------", takestate, addit);
    const [visible, setVisible] = useState(false);
    const [nodata, setNodata] = useState("drawerclose");
    const [idget, setIdget] = useState("6");
    const [loadingg, setLoadingg] = useState(false);
    const DownData = [{ id: 0, name: "Download Payment Receipt" }]
    const [modalShow, setModalShow] = useState(false);
    const [showLoad, setShowLoad] = useState(false);
    const [save, setSave] = useState();
    const toggleDrawerModal = () => {
        setVisible(!visible);
        setNodata("drawerclose");
        setIdget("6");
    };
    const windowWidth = Dimensions.get('window').width;
    const registBaack = () => {
        toggleDrawerModal();
    }
    const TransReducer = useSelector(state => state.TransReducer);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const titlhandleUrl = (make) => {
        const urltitle = make?.conferenceURL;
        const resulttitle = urltitle.split('/').pop();
        console.log(resulttitle, "webcast url=======", make);
        if (resulttitle) {
            props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, creditData: addit } })
        }
    }
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const [storeAlldata, setStoreAlldata] = useState([]);
    const [apiReq, setApiReq] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [limit, setLimit] = useState(10);
    const [final, setFinal] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    useEffect(() => {
        fetchHandle();
    }, [isFocus, props?.route?.params?.name]);
    const fetchHandle = () => {
        // let obj = {
        //     "limit": limit,
        //     "offset": pageNum,
        //     "searchFromDate": "",
        //     "searchToDate": ""
        // };
        let obj = {
            "offset": limit * pageNum,
            "searchKeyword": "",
            "searchFromDate": "",
            "searchToDate": ""
        }
        connectionrequest()
            .then(() => {
                dispatch(registPaymentRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
                setLoading(false);
            });
    };
    useFocusEffect(
        useCallback(() => {
            if (props?.route?.params?.name == "Registrations") {
                setStoreAlldata([]); // Reset stored data on focus
                setPageNum(0); // Reset pagination
                fetchHandle(); // Fetch fresh data
            }
        }, [])
    );
    const fetchMore = useCallback(() => {
        const totalCount = TransReducer?.registPaymentResponse?.count || 0;
        const totalDataLength = final?.reduce((acc, item) => acc + item.data.length, 0) || 0;
        console.log(totalDataLength, "totalDataLength-------", final);
        if (totalDataLength >= totalCount) {
            setApiReq(false);
            setLoading(false);
            return;
        }
        if (!apiReq) {
            const hasRegistPaymentData = TransReducer?.registPaymentResponse?.data?.length > 0;
            if (hasRegistPaymentData) {
                setPageNum(prevPage => prevPage + 1); // Increment pageNum
                fetchHandle(); // Trigger fetch
            }
        }
    }, [apiReq, final, TransReducer]);
    const fullDataRefresh = () => {
        if (props?.route?.params?.name == "Registrations") {
            setStoreAlldata([]);
            setPageNum(0);
            setRefreshing(false);
            fetchHandle();
        }
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
    const [showLoader, setShowLoader] = useState(true);
    useEffect(() => {
        // Simulate 2-second loading time
        const timeout = setTimeout(() => {
            setShowLoader(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);
    if (status === '' || TransReducer.status !== status) {
        switch (TransReducer.status) {
            case 'Transaction/registPaymentRequest':
                status = TransReducer.status;
                setApiReq(true);
                setLoading(true);
                break;
            case 'Transaction/registPaymentSuccess':
                status = TransReducer.status;
                setApiReq(false);
                setLoading(false);
                const newData = TransReducer?.registPaymentResponse?.data || [];
                const totalCount = TransReducer?.registPaymentResponse?.count || 0;
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
                                if (!updatedStoreData[monthYear].some(existingItem => existingItem.invoiceNumber === item.invoiceNumber)) {
                                    updatedStoreData[monthYear].push(item);
                                }
                            } else {
                                console.warn(`Invalid transactionDate format for item:`, item);
                            }
                        }
                    });
                    setStoreAlldata(updatedStoreData);
                    const totalItemsFetched = Object.values(updatedStoreData).flat().length;
                    console.log(totalItemsFetched, "totalItemsFetched")
                    if (totalItemsFetched >= totalCount) {
                        console.log("All data fetched. Stopping API calls.");
                        setApiReq(false);
                        setLoading(false);
                    }
                }
                break;
            case 'Transaction/registPaymentFailure':
                status = TransReducer.status;
                setApiReq(false);
                setLoading(false);
                break;
        }
    }
    useEffect(() => {
        if (storeAlldata) {
            const storetakeAll = Object.keys(storeAlldata).map((monthYear) => {
                const data = storeAlldata[monthYear];
                const updatedData = data.map((item) => ({
                    ...item,
                    dataLength: data.length,
                }));
                return {
                    monthYear,
                    data: updatedData,
                };
            });
            setFinal(storetakeAll);
            console.log(storetakeAll, "storetakeAl", final);
        }
    }, [storeAlldata]);

    const openPDF = async (finalurl) => {
        if (!finalurl) return;
        try {
            const url = finalurl;
            console.log(url, "url---------");
            // Ensure valid filename
            let fileName = url.split("/").pop();
            if (!fileName || !fileName.includes(".")) {
                fileName = "download.pdf";  // fallback
            }
            const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
            console.log('Downloading file from:', url);
            console.log('Saving file to:', localFile);

            // If file exists, skip downloading
            const exists = await RNFS.exists(localFile);
            if (!exists) {
                const options = { fromUrl: url, toFile: localFile };
                await RNFS.downloadFile(options).promise;
                console.log("File downloaded.");
            } else {
                console.log("File already exists, skipping download.");
            }
            console.log('Opening file viewer for:', localFile);
            setTimeout(async () => {
                setShowLoad(false);
                setLoadingg(false);
                await FileViewer.open(localFile);
            }, 2000);
        } catch (error) {
            console.error('Error during file download or opening:', error);
        } finally {
            setLoadingg(false);
        }
    };
    const renderItem = ({ item, index }) => {
        const isLastItem = index === item?.dataLength - 1;
        return (
            <View>
                <View style={{ justifyContent: "center", alignSelf: "center", marginTop: normalize(0), backgroundColor: "#FFFFFF" }}>
                    <View
                        style={{
                            flexDirection: "column",
                            width: normalize(290),
                            borderRadius: normalize(5),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                            alignItems: "flex-start",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            {/* Payment Mode Tag */}
                            {(item?.paymentMode && item?.paymentMode !== "-") ||
                                (item?.payment_method && item?.payment_method !== "-") ? (
                                <View
                                    style={{
                                        paddingHorizontal: normalize(10),
                                        paddingVertical: normalize(5),
                                        marginLeft: normalize(5),
                                        borderRadius: normalize(20),
                                        backgroundColor: "#FFF2E0",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterSemiBold,
                                            fontSize: 14,
                                            fontWeight: "bold",
                                            color: "#666",
                                        }}
                                    >
                                        {item?.paymentMode || item?.payment_method}
                                    </Text>
                                </View>
                            ) : (
                                <View /> // keeps spacing balanced
                            )}

                            {/* Middle Section (Image + Invoice Icon) */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                {/* Image */}
                                {item?.paymentMode && (
                                    <Image
                                        source={Imagepath.Complt}
                                        style={{
                                            height: normalize(20),
                                            width: normalize(20),
                                            resizeMode: "contain",
                                            marginRight: item?.invoice ? normalize(10) : 0, // small gap before dots icon
                                        }}
                                    />
                                )}

                                {/* Dots Icon */}
                                {item?.invoice && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setModalShow(!modalShow);
                                            setSave(item?.invoice);
                                        }}
                                    >
                                        <IconDot
                                            name="dots-three-vertical"
                                            size={23}
                                            color={"#848484"}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {item?.conferenceName ? <View
                            style={{
                                paddingHorizontal: normalize(10),
                                paddingVertical: normalize(8),
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "106%",
                            }}
                        >
                            <TouchableOpacity onPress={() => { titlhandleUrl(item) }}>
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
                        </View> : <View
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
                                    {`Invoice #: ${item?.invoice_number}`}
                                </Text>
                            </TouchableOpacity>
                        </View>}
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
                                    fontSize: 10,
                                    color: "#AAA",
                                }}
                            >
                                {item?.invoiceNumber ? `Trans Id: ${item?.invoiceNumber}` : `Trans Date: ${moment(item?.payment_date, "MMM DD,YYYY").format("DD-MM-YYYY")}`}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 14,
                                    color: item?.total_amount === 0 || item?.paidAmount == "US$0.00" ? "#fd7e14" : "#333"
                                }}
                            >
                                {item?.total_amount === 0 || item?.paidAmount == "US$0.00" ? "Free" : item?.total_amount ? `US$${item?.total_amount}` : item?.paidAmount}
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
                                width: (windowWidth * 0.4 - 20) / 17,
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
                        color: '#333',
                        marginBottom: normalize(10)
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
                <Loader visible={showLoad} />
                {conn == false ? <IntOff/> :<View style={{ paddingVertical: normalize(10) }}>
                    <FlatList
                        data={final}
                        renderItem={renderMonthItem}
                        contentContainerStyle={{ paddingBottom: normalize(120) }}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={fetchMore}
                        onEndReachedThreshold={0.5}
                        // onScroll={()=>{console.log("hello")}}
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
                        ListEmptyComponent={
                            showLoader ? <ActivityIndicator size={"small"} color={"green"} /> :
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
                </View>}
            </SafeAreaView>
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
                            height: Platform.OS === 'ios' ? normalize(100) : normalize(100),
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
                            data={DownData}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setModalShow(!modalShow);
                                            openPDF(save);
                                            setShowLoad(true);
                                        }}
                                        style={[styles.dropDownItem]}>
                                        <Text style={{
                                            fontSize: 16,
                                            lineHeight: normalize(14),
                                            textAlign: 'center',
                                            color: Colorpath.black,
                                            // textTransform: 'capitalize',
                                            fontFamily: Fonts.InterMedium
                                        }}>
                                            {item?.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </TouchableOpacity>
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
        </>
    )
}

export default Registration