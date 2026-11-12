/**
 * Wallets screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, Wallets, toggleDrawerModal, registBaack, walletsVal, fetchHandle, fullDataRefresh, onBackPress, searchTopicName, renderItem, renderMonthItem.
 */

import { View, Text, Platform, TouchableOpacity, FlatList, Image, ActivityIndicator, RefreshControl, ImageBackground, TextInput, KeyboardAvoidingView, BackHandler, StyleSheet } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
import { AppContext } from '../GlobalSupport/AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context'
import { TransactionEmptyState, TransactionListSkeleton } from './TransactionUiHelpers';

const MONTH_ORDER = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
};

const groupWalletItemsByMonth = (items = []) => {
    const updatedStoreData = {};
    items.forEach(item => {
        if (item?.transactionDate) {
            const dateString = item.transactionDate;
            const monthYearMatch = dateString.match(/^([A-Za-z]+) \d{1,2}, (\d{4})$/);
            let monthYear = '';
            if (monthYearMatch) {
                monthYear = `${monthYearMatch[1]} ${monthYearMatch[2]}`;
            } else {
                const parsed = moment(dateString, ["MMM DD, YYYY", "MMM D, YYYY", "MMMM DD, YYYY", "YYYY-MM-DD"]);
                if (parsed.isValid()) {
                    monthYear = parsed.format('MMM YYYY');
                }
            }
            if (monthYear) {
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
            }
        }
    });
    return Object.keys(updatedStoreData)
        .map((monthYear) => {
            const data = updatedStoreData[monthYear];
            return {
                monthYear,
                data: data.map((item) => ({ ...item, dataLength: data.length })),
            };
        })
        .sort((a, b) => {
            const [aMonth, aYear] = a.monthYear.split(' ');
            const [bMonth, bYear] = b.monthYear.split(' ');
            if (aYear !== bYear) {
                return parseInt(bYear, 10) - parseInt(aYear, 10);
            }
            return (MONTH_ORDER[bMonth] || 0) - (MONTH_ORDER[aMonth] || 0);
        });
};

/**
 * Reusable Wallets component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
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
        props.navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: 'TabNav', params: { initialRoute: 'Home' } }] })
        );
    };

    const TransReducer = useSelector(state => state.TransReducer);
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const handledStatusRef = useRef(TransReducer.status);
    const pendingResetRef = useRef(true);
    const [storeAlldata, setStoreAlldata] = useState({});
    const [apiReq, setApiReq] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [walletLoading, setWalletLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const limit = 8;
    const [final, setFinal] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [provideName, setProvideName] = useState("");
    const [selectCountrytopic, setSelectCountrytopic] = useState([]);
    const [wallettake, setWallettake] = useState(false);
    const [walletdate, setWalletdate] = useState(false);
    const [walletndate, setWalletndate] = useState(false);
    const [sdate, setSdate] = useState("");
    const [ndate, setNdate] = useState("");
    const [conn, setConn] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);

    const walletsVal = useCallback(() => {
        connectionrequest()
            .then(() => {
                dispatch(walletsgetRequest({}));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
                setWalletLoading(false);
            });
    }, [dispatch]);

    const fetchHandle = useCallback((targetPage = 0, fromDate = sdate, toDate = ndate, isReset = false) => {
        if (isReset) {
            pendingResetRef.current = true;
        }
        const obj = {
            "limit": limit,
            "offset": targetPage,
            "searchFromDate": "",
            "searchKeyword": "",
            "searchToDate": ""
        };
        const walletsobj = {
            "offset": 0,
            "searchKeyword": "",
            "searchFromDate": fromDate,
            "searchToDate": toDate
        };
        connectionrequest()
            .then(() => {
                dispatch(walletsTransRequest(fromDate && toDate ? walletsobj : obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
                setApiReq(false);
                setInitialLoading(false);
                setLoadingMore(false);
                setRefreshing(false);
            });
    }, [dispatch, sdate, ndate]);

    useFocusEffect(
        useCallback(() => {
            setPageNum(0);
            fetchHandle(0, sdate, ndate, true);
            walletsVal();
        }, [fetchHandle, walletsVal])
    );

    const fetchMore = useCallback(() => {
        if (sdate && ndate) return;
        const totalCount = TransReducer?.walletsTransResponse?.count || 0;
        const totalDataLength = final?.reduce((acc, item) => acc + (item?.data?.length || 0), 0) || 0;
        if (totalDataLength >= totalCount || apiReq || loadingMore || initialLoading || provideName.trim() !== '') {
            return;
        }
        if (TransReducer?.walletsTransResponse?.walletPayments?.length > 0) {
            const nextPage = pageNum + 1;
            setPageNum(nextPage);
            setLoadingMore(true);
            fetchHandle(nextPage, sdate, ndate, false);
        }
    }, [apiReq, loadingMore, initialLoading, final, TransReducer, pageNum, fetchHandle, sdate, ndate, provideName]);

    const fullDataRefresh = () => {
        setRefreshing(true);
        setPageNum(0);
        fetchHandle(0, sdate, ndate, true);
        walletsVal();
    };

    useEffect(() => {
        const onBackPress = () => {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'TabNav', params: { initialRoute: 'Home' } }],
                })
            );
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, [props.navigation]);

    useEffect(() => {
        if (!isFocus) return;
        if (handledStatusRef.current === TransReducer.status) return;
        handledStatusRef.current = TransReducer.status;

        switch (TransReducer.status) {
            case 'Transaction/walletsTransRequest':
                setApiReq(true);
                break;
            case 'Transaction/walletsTransSuccess': {
                setApiReq(false);
                setInitialLoading(false);
                setLoadingMore(false);
                setRefreshing(false);
                const newData = TransReducer?.walletsTransResponse?.walletPayments || [];
                const shouldReset = pendingResetRef.current;
                pendingResetRef.current = false;

                setStoreAlldata(prev => {
                    const updatedStoreData = shouldReset ? {} : { ...(prev || {}) };
                    Object.keys(updatedStoreData).forEach(k => {
                        updatedStoreData[k] = [...updatedStoreData[k]];
                    });
                    newData.forEach(item => {
                        if (item?.transactionDate) {
                            const dateString = item.transactionDate;
                            const monthYearMatch = dateString.match(/^([A-Za-z]+) \d{1,2}, (\d{4})$/);
                            let monthYear = '';
                            if (monthYearMatch) {
                                monthYear = `${monthYearMatch[1]} ${monthYearMatch[2]}`;
                            } else {
                                const parsed = moment(dateString, ["MMM DD, YYYY", "MMM D, YYYY", "MMMM DD, YYYY", "YYYY-MM-DD"]);
                                if (parsed.isValid()) {
                                    monthYear = parsed.format('MMM YYYY');
                                }
                            }
                            if (monthYear) {
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
                            }
                        }
                    });
                    return updatedStoreData;
                });
                break;
            }
            case 'Transaction/walletsTransFailure':
                pendingResetRef.current = false;
                setApiReq(false);
                setInitialLoading(false);
                setLoadingMore(false);
                setRefreshing(false);
                break;
            case 'Transaction/walletsgetRequest':
                break;
            case 'Transaction/walletsgetSuccess':
            case 'Transaction/walletsgetFailure':
                setWalletLoading(false);
                break;
        }
    }, [TransReducer.status, TransReducer?.walletsTransResponse, isFocus]);

    useEffect(() => {
        if (storeAlldata && !Array.isArray(storeAlldata)) {
            const storetakeAll = Object.keys(storeAlldata)
                .map((monthYear) => {
                    const data = storeAlldata[monthYear] || [];
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
                        return parseInt(bYear, 10) - parseInt(aYear, 10);
                    }
                    return (MONTH_ORDER[bMonth] || 0) - (MONTH_ORDER[aMonth] || 0);
                });

            setSelectCountrytopic(storetakeAll);
            if (!provideName.trim()) {
                setFinal(storetakeAll);
            }
        }
    }, [storeAlldata, provideName]);

    const searchTopicName = (text) => {
        setProvideName(text);
        if (text.trim() === '') {
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
        if (listAllData?.length > 0) {
            setFinal(groupWalletItemsByMonth(listAllData));
        } else {
            setFinal([]);
        }
    };

    const renderTransactionCard = (item, index) => {
        return (
            <View key={String(item?.conferenceName || '') + String(item?.transactionDate || '') + index} style={localStyles.card}>
                <Text numberOfLines={2} style={localStyles.cardTitle}>
                    {item?.conferenceName}
                </Text>
                <View style={localStyles.divider} />
                <View style={localStyles.cardFooterRow}>
                    <Text style={localStyles.metaText}>
                        {`Trans Date: ${moment(item?.transactionDate, "MMM DD,YYYY").format("MM-DD-YYYY")}`}
                    </Text>
                    <Text style={localStyles.amountText}>
                        {`${item?.currencyCode || ''}${item?.walletAmount ?? ''}`}
                    </Text>
                </View>
            </View>
        );
    };

    const renderMonthItem = ({ item }) => {
        return (
            <View key={item.monthYear} style={localStyles.monthSection}>
                <View style={localStyles.monthHeaderRow}>
                    <Text style={localStyles.monthTitle}>{item.monthYear}</Text>
                </View>
                {(item?.data || []).map((entry, idx) => renderTransactionCard(entry, idx))}
            </View>
        );
    };

    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);

    const walletInfo = TransReducer?.walletsgetResponse || {};
    const hasWalletData = walletInfo?.walletBalance !== undefined && walletInfo?.walletBalance !== null;
    const isWalletCardLoading = walletLoading && !hasWalletData;

    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            <SafeAreaView style={localStyles.container}>
                <PageHeader
                    title={props?.route?.params?.name || "Wallet Transactions"}
                    onBackPress={registBaack}
                />
                {conn == false ? <IntOff /> : (
                    <KeyboardAvoidingView style={localStyles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <View style={localStyles.heroWrapper}>
                            <ImageBackground
                                source={Imagepath.HomeUser}
                                style={localStyles.heroBg}
                                imageStyle={localStyles.heroBgImage}
                                resizeMode="stretch"
                            >
                                {isWalletCardLoading ? (
                                    <View style={localStyles.heroLoaderContainer}>
                                        <ActivityIndicator color="#FFFFFF" size="small" />
                                    </View>
                                ) : (
                                    <View style={localStyles.heroContent}>
                                        <View>
                                            <Text style={localStyles.heroLabel}>{"Available Balance"}</Text>
                                            <Text style={localStyles.heroBalance}>
                                                {`${walletInfo?.currencyCode || 'US$'}${walletInfo?.walletBalance ?? 0}`}
                                            </Text>
                                        </View>
                                        <View style={localStyles.heroStatsRow}>
                                            <View>
                                                <Text style={localStyles.heroLabel}>{"Spent"}</Text>
                                                <Text style={localStyles.heroSubValue}>
                                                    {`${walletInfo?.currencyCode || 'US$'}${walletInfo?.walletSpendAmount ?? 0}`}
                                                </Text>
                                            </View>
                                            <View style={localStyles.heroRightStat}>
                                                <Text style={localStyles.heroLabel}>{"Expiry"}</Text>
                                                <Text style={localStyles.heroSubValue}>
                                                    {walletInfo?.walletExpirydate
                                                        ? `${moment(walletInfo?.walletExpirydate, "MMM DD, YYYY").format("DD/MM/YYYY")}`
                                                        : "NA"}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </ImageBackground>
                        </View>

                        <View style={localStyles.filterPanel}>
                            <View style={localStyles.filterTopRow}>
                                <Text style={localStyles.sectionTitle}>{"Transactions"}</Text>
                                <View style={localStyles.filterActions}>
                                    {sdate && ndate ? (
                                        <View style={localStyles.activeDateChip}>
                                            <Text style={localStyles.activeDateChipText}>
                                                {`${sdate} to ${ndate}`}
                                            </Text>
                                        </View>
                                    ) : null}
                                    <TouchableOpacity
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        onPress={() => setWallettake(!wallettake)}
                                        style={localStyles.filterButton}
                                    >
                                        <Image source={Imagepath.Filter} style={localStyles.filterIcon} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={localStyles.searchBox}>
                                <TextInput
                                    editable={true}
                                    onChangeText={searchTopicName}
                                    value={provideName}
                                    style={localStyles.searchInput}
                                    placeholder="Search transactions"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="default"
                                />
                                {provideName ? (
                                    <TouchableOpacity onPress={() => searchTopicName('')}>
                                        <Text style={localStyles.clearSearchText}>{"Clear"}</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>

                        <View style={localStyles.listContainer}>
                            {initialLoading && final.length === 0 ? (
                                <TransactionListSkeleton count={3} />
                            ) : (
                                <FlatList
                                    data={final}
                                    renderItem={renderMonthItem}
                                    contentContainerStyle={localStyles.listContent}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => `${item?.monthYear || 'month'}_${index}`}
                                    onEndReached={fetchMore}
                                    onEndReachedThreshold={0.5}
                                    scrollEventThrottle={16}
                                    ListFooterComponent={
                                        loadingMore ? (
                                            <View style={localStyles.footerLoader}>
                                                <ActivityIndicator color={Colorpath.ButtonColr} size="small" />
                                            </View>
                                        ) : null
                                    }
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={fullDataRefresh}
                                            colors={[Colorpath.ButtonColr]}
                                            tintColor={Colorpath.ButtonColr}
                                        />
                                    }
                                    ListEmptyComponent={<TransactionEmptyState message="No data found" />}
                                />
                            )}
                        </View>

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
                            <View style={localStyles.modalCard}>
                                <Text style={localStyles.modalTitle}>{"Filter by Date"}</Text>
                                <View style={localStyles.dateInputsRow}>
                                    <View style={localStyles.dateField}>
                                        <TouchableOpacity onPress={() => setWalletdate(!walletdate)}>
                                            <View style={localStyles.dateFieldInner}>
                                                <Text style={[localStyles.dateValueText, !sdate && localStyles.datePlaceholder]}>
                                                    {sdate ? sdate : "From Date"}
                                                </Text>
                                                <CalenderIcon name={'calendar'} size={18} color="#475569" />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={localStyles.dateField}>
                                        <TouchableOpacity onPress={() => setWalletndate(!walletndate)}>
                                            <View style={localStyles.dateFieldInner}>
                                                <Text style={[localStyles.dateValueText, !ndate && localStyles.datePlaceholder]}>
                                                    {ndate ? ndate : "To Date"}
                                                </Text>
                                                <CalenderIcon name={'calendar'} size={18} color="#475569" />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={localStyles.modalActionsRow}>
                                    <Buttons
                                        onPress={() => {
                                            setWallettake(false);
                                            setNdate("");
                                            setSdate("");
                                            setPageNum(0);
                                            setInitialLoading(true);
                                            setFinal([]);
                                            fetchHandle(0, "", "", true);
                                        }}
                                        height={normalize(36)}
                                        width={normalize(105)}
                                        backgroundColor={Colorpath.white}
                                        borderRadius={normalize(8)}
                                        text="Cancel"
                                        color="#64748B"
                                        fontSize={14}
                                        fontFamily={Fonts.InterMedium}
                                        marginTop={normalize(14)}
                                        borderBottomWidth={0.8}
                                        borderColor="#CBD5E1"
                                        borderWidth={1}
                                    />
                                    <Buttons
                                        onPress={() => {
                                            if (!sdate) {
                                                showErrorAlert("Please select From Date")
                                            } else if (!ndate) {
                                                showErrorAlert("Please select To Date")
                                            } else {
                                                setWallettake(false);
                                                setPageNum(0);
                                                setInitialLoading(true);
                                                setFinal([]);
                                                fetchHandle(0, sdate, ndate, true);
                                            }
                                        }}
                                        height={normalize(36)}
                                        width={normalize(105)}
                                        backgroundColor={Colorpath.ButtonColr}
                                        borderRadius={normalize(8)}
                                        text="Submit"
                                        color={Colorpath.white}
                                        fontSize={14}
                                        fontFamily={Fonts.InterMedium}
                                        marginTop={normalize(14)}
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
                                minimumDate={sdate ? moment(sdate, 'YYYY-MM-DD').toDate() : undefined}
                                date={
                                    (() => {
                                        const today = new Date();
                                        if (ndate) {
                                            const picked = moment(ndate, 'YYYY-MM-DD').toDate();
                                            if (sdate && picked < moment(sdate, 'YYYY-MM-DD').toDate()) {
                                                return moment(sdate, 'YYYY-MM-DD').toDate();
                                            }
                                            return picked;
                                        }
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
                    </KeyboardAvoidingView>
                )}
            </SafeAreaView>
        </>
    )
}

const localStyles = StyleSheet.create({
    container: {
        backgroundColor: '#F4F7FC',
        flex: 1,
    },
    flex1: {
        flex: 1,
    },
    heroWrapper: {
        paddingHorizontal: normalize(12),
        paddingTop: normalize(10),
        paddingBottom: normalize(8),
    },
    heroBg: {
        height: normalize(138),
        width: '100%',
        justifyContent: 'center',
    },
    heroBgImage: {
        borderRadius: normalize(12),
    },
    heroLoaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContent: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(16),
    },
    heroLabel: {
        fontFamily: Fonts.InterMedium,
        fontSize: 11,
        color: 'rgba(255,255,255,0.85)',
    },
    heroBalance: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 22,
        color: '#FFFFFF',
        marginTop: normalize(2),
    },
    heroStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    heroRightStat: {
        alignItems: 'flex-end',
    },
    heroSubValue: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#FFFFFF',
        marginTop: normalize(2),
    },
    filterPanel: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5ECF6',
        paddingHorizontal: normalize(14),
        paddingVertical: normalize(10),
    },
    filterTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: normalize(8),
    },
    sectionTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#0F172A',
    },
    filterActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalize(8),
    },
    activeDateChip: {
        backgroundColor: '#EEF4FF',
        borderRadius: normalize(12),
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(3),
    },
    activeDateChipText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 11,
        color: Colorpath.ButtonColr,
    },
    filterButton: {
        padding: normalize(4),
    },
    filterIcon: {
        height: normalize(18),
        width: normalize(18),
        resizeMode: 'contain',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#D5E0EE',
        borderRadius: normalize(8),
        height: normalize(38),
        paddingHorizontal: normalize(10),
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 13,
        color: '#0F172A',
        fontFamily: Fonts.InterRegular,
    },
    clearSearchText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12,
        color: Colorpath.ButtonColr,
        paddingLeft: normalize(8),
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: normalize(12),
        paddingTop: normalize(10),
        paddingBottom: normalize(28),
    },
    monthSection: {
        marginBottom: normalize(12),
    },
    monthHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: normalize(8),
        paddingHorizontal: normalize(2),
    },
    monthTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#0F172A',
    },
    monthCountBadge: {
        backgroundColor: '#E0ECFF',
        borderRadius: normalize(12),
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(2),
    },
    monthCountText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 11,
        color: Colorpath.ButtonColr,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(10),
        borderWidth: 1,
        borderColor: '#E5ECF6',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(10),
        marginBottom: normalize(8),
    },
    cardTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        lineHeight: 19,
        color: '#0F172A',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: normalize(8),
    },
    cardFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 11,
        color: '#64748B',
    },
    amountText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: Colorpath.ButtonColr,
    },
    footerLoader: {
        paddingVertical: normalize(14),
        alignItems: 'center',
    },
    modalCard: {
        width: normalize(296),
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(12),
        borderWidth: 1,
        borderColor: '#E5ECF6',
        padding: normalize(18),
        alignSelf: 'center',
    },
    modalTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#0F172A',
        marginBottom: normalize(14),
    },
    dateInputsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: normalize(10),
    },
    dateField: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D5E0EE',
        borderRadius: normalize(8),
        backgroundColor: '#F8FAFC',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(8),
    },
    dateFieldInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateValueText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 12,
        color: '#0F172A',
    },
    datePlaceholder: {
        color: '#94A3B8',
    },
    modalActionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: normalize(10),
    },
});

export default Wallets
