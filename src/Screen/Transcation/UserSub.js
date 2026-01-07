import { View, Text, Platform, TouchableOpacity, FlatList, Image, Dimensions, ActivityIndicator, RefreshControl, Switch, Alert } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { subRenewalRequest, userSubRequest } from '../../Redux/Reducers/TransReducer';
import moment from 'moment';
let status = "";
import { SafeAreaView } from 'react-native-safe-area-context'
const UserSub = ({ storeAlldatas, setStoreAlldatas }) => {
    const windowWidth = Dimensions.get('window').width;
    const TransReducer = useSelector(state => state.TransReducer);
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const navigation = useNavigation();
    // const [storeAlldatas, setStoreAlldatas] = useState([]);
    const [apiReq, setApiReq] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [limit, setLimit] = useState(10);
    const [final, setFinal] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [isEnable, setIsEnable] = useState(0);
    const [exdate, setExdate] = useState(false);
    useEffect(() => {
        fetchuserSub();
        setIsEnable(1);
    }, [isFocus]);
    const [switchStates, setSwitchStates] = useState({});
    const handleSwitchToggle = (index, get) => {
        Alert.alert(
            "eMedEvents",
            "Are you sure you want to cancel this subscription ?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: () => {
                        setSwitchStates((prevStates) => ({
                            ...prevStates,
                            [index]: !prevStates[index],
                        }));
                        let obj = {
                            "subscription_id": get?.id
                        }
                        dispatch(subRenewalRequest(obj));
                    },
                },
            ]
        );
    };
    const fetchuserSub = () => {
        let obj = {
            "limit": limit,
            "page": pageNum,
            "fromDate": "",
            "toDate": "",
            "keyword": ""
        };
        connectionrequest()
            .then(() => {
                dispatch(userSubRequest(obj));

            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
                setLoading(false);
            });
    };
    useFocusEffect(
        useCallback(() => {
            setStoreAlldatas([]);
            setPageNum(0);
            fetchuserSub();
        }, [])
    );
    const fetchMore = useCallback(() => {
        const totalCount = TransReducer?.userSubResponse?.subscription_count || 0;
        const totalDataLength = final?.reduce((acc, item) => acc + item.data.length, 0) || 0;
        console.log(totalDataLength, "totalDataLength-------", final);
        if (totalDataLength >= totalCount) {
            setApiReq(false);
            setLoading(false);
            return;
        }
        if (!apiReq) {
            const hasuserSubData = TransReducer?.userSubResponse?.subscription_data?.length > 0;
            if (hasuserSubData) {
                setPageNum(prevPage => prevPage + 1); // Increment pageNum
                fetchuserSub(); // Trigger fetch
            }
        }
    }, [apiReq, final, TransReducer]);
    const fullDataRefresh = () => {
        setStoreAlldatas([]);
        setPageNum(0);
        setRefreshing(false);
        fetchuserSub();
    };
    if (status === '' || TransReducer.status !== status) {
        switch (TransReducer.status) {
            case 'Transaction/userSubRequest':
                status = TransReducer.status;
                setApiReq(true);
                setLoading(true);
                break;
            case 'Transaction/userSubSuccess':
                status = TransReducer.status;
                setApiReq(false);
                setLoading(false);
                const newData = TransReducer?.userSubResponse?.subscription_data || [];
                const totalCount = TransReducer?.userSubResponse?.subscription_count || 0;
                if (newData.length > 0) {
                    const updatedStoreData = { ...storeAlldatas };
                    newData.forEach(item => {
                        if (item?.created_date) {
                            const dateString = item?.created_date;
                            const monthYearMatch = dateString.match(/^([A-Za-z]+) \d{1,2}, (\d{4})$/);
                            if (monthYearMatch) {
                                const month = monthYearMatch[1];
                                const year = monthYearMatch[2];
                                const monthYear = `${month} ${year}`;
                                if (!updatedStoreData[monthYear]) {
                                    updatedStoreData[monthYear] = [];
                                }
                                const isDuplicate = updatedStoreData[monthYear].some(existingItem => {
                                    return (
                                        existingItem.id === item.id 
                                    );
                                });
                                if (!isDuplicate) {
                                    updatedStoreData[monthYear].push(item);
                                }
                            } else {
                                console.warn(`Invalid created_date format for item:`, item);
                            }
                        }
                    });
                    setStoreAlldatas(updatedStoreData);
                    const totalItemsFetched = Object.values(updatedStoreData).flat().length;
                    console.log(totalItemsFetched, "totalItemsFetched")
                    if (totalItemsFetched >= totalCount) {
                        console.log("All data fetched. Stopping API calls.");
                        setApiReq(false);
                        setLoading(false);
                    }
                }
                break;
            case 'Transaction/userSubFailure':
                status = TransReducer.status;
                setApiReq(false);
                setLoading(false);
                break;
            case 'Transaction/subRenewalRequest':
                status = TransReducer.status;
                break;
            case 'Transaction/subRenewalSuccess':
                status = TransReducer.status;
                setStoreAlldatas([]);
                setPageNum(0);
                setRefreshing(false);
                fetchuserSub();
                break;
            case 'Transaction/subRenewalFailure':
                status = TransReducer.status;
                break;
        }
    }
    useEffect(() => {
        if (storeAlldatas) {
            const storetakeAll = Object.keys(storeAlldatas).map((monthYear) => {
                const data = storeAlldatas[monthYear];
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
    }, [storeAlldatas]);
        const expiredItems = useMemo(() => {
          const result = {};
          final && final.forEach(monthGroup => {
            monthGroup.data.forEach(item => {
              if (!item?.expiry_date) {
                result[item.id] = false;
                return;
              }
              try {
                const endDate = new Date(moment(item?.expiry_date, "MMM DD, YYYY").format("YYYY-MM-DD"));
                const currentDate = new Date();
                endDate.setHours(0, 0, 0, 0);
                currentDate.setHours(0, 0, 0, 0);
                result[item.id] = currentDate > endDate;
              } catch (error) {
                result[item.id] = false;
              }
            });
          });
          return result;
        }, [final]);
    console.log(final, "exdate=========")
    const renderItem = ({ item, index }) => {
        // detectExDate(index, item?.id, item?.start_date);
        console.log(item, "item-----------")
        const isLastItem = index === item?.dataLength - 1;
        const isSwitchOn = switchStates[index] ?? (item?.can_cancel === 1);
        const isItemExpired = expiredItems[item.id] || false;
        console.log(isItemExpired, "isItemExpired--------")
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
                        {item?.subscription_type ? <View
                            style={{
                                paddingHorizontal: normalize(10),
                                paddingVertical: normalize(8),
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
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
                                {"Premium"}
                            </Text>
                            {item?.subscription_status && <View style={{
                                height: normalize(20),
                                width: normalize(50),
                                borderRadius: normalize(15),
                                borderWidth: 1,
                                borderColor: "green",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 10,
                                        color: "green",
                                        alignSelf: "center"
                                    }}
                                >
                                    {item?.subscription_status}
                                </Text>
                            </View>}
                        </View> : null}
                        <View
                            style={{
                                paddingHorizontal: normalize(10),
                                width: "100%",
                                flexDirection: "row", justifyContent: "space-between", alignContent: "space-between"
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 10,
                                    color: "#AAA",
                                }}
                            >
                                {`Trans Date: ${moment(item?.created_date, "MMM DD, YYYY").format("YYYY-MM-DD")}`}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 10,
                                    color: isItemExpired ? "red" : "#AAA",
                                }}
                            >
                                {isItemExpired
                                    ? `Plan Expired on : ${moment(item?.expiry_date, "MMM DD, YYYY").format("YYYY-MM-DD")}`
                                    : `Plan Expires on : ${moment(item?.expiry_date, "MMM DD, YYYY").format("YYYY-MM-DD")}`
                                }
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }}>
                        {item?.can_cancel == 1 && <View style={{ paddingHorizontal: normalize(0), flexDirection: "row", gap: normalize(10) }}>

                            <Switch
                                trackColor={{
                                    false: "#999999",
                                    true: "#008000",
                                }}
                                thumbColor={"#FFFFFF"}
                                onValueChange={() => handleSwitchToggle(index, item)}
                                style={{ marginBottom: normalize(10), marginLeft: normalize(10) }}
                                value={isSwitchOn}
                            />
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000", marginTop: normalize(5) }}>{"Auto Renew"}</Text>
                        </View>}
                        {item?.can_update == 1 && <View style={{ marginRight: normalize(10) }}>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("PaymentSub", { takeid: item?.id });
                            }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#000000", textDecorationLine: "underline" }}>{"Update Payment Details"}</Text>
                            </TouchableOpacity>
                        </View>}
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
                                width: (windowWidth * 0.4 - 20) / 16,
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
const [showLoader, setShowLoader] = useState(true);
          useEffect(() => {
              // Simulate 2-second loading time
              const timeout = setTimeout(() => {
                  setShowLoader(false);
              }, 2000);
      
              return () => clearTimeout(timeout);
          }, []);
    return (
        <>
            <View style={{ paddingVertical: normalize(10) }}>
                <FlatList
                    data={final}
                    renderItem={renderMonthItem}
                    contentContainerStyle={{ paddingBottom: normalize(120) }}
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
                    ListEmptyComponent={showLoader ? <View style={{justifyContent:"center",alignItems:"center",paddingTop:normalize(30)}}>
                        <ActivityIndicator color={"green"} size="small" />
                    </View>  :
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
        </>
    )
}

export default UserSub