/**
 * User sub screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, UserSub, handleSwitchToggle, fetchuserSub, fullDataRefresh, renderItem, renderMonthItem.
 */

import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Switch, Alert, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { subRenewalRequest, userSubRequest } from '../../Redux/Reducers/TransReducer';
import moment from 'moment';
import { computeNonOverlappingSubscriptions } from '../../Utils/Helpers/primeSubscription';
import { TransactionEmptyState, TransactionListSkeleton } from './TransactionUiHelpers';

/**
 * Reusable UserSub component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const UserSub = ({ storeAlldatas, setStoreAlldatas }) => {
    const TransReducer = useSelector(state => state.TransReducer);
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const navigation = useNavigation();
    const handledStatusRef = useRef(TransReducer.status);
    const pendingResetRef = useRef(true);
    const [apiReq, setApiReq] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const limit = 10;
    const [final, setFinal] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
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
                        const obj = {
                            "subscription_id": get?.id
                        };
                        dispatch(subRenewalRequest(obj));
                    },
                },
            ]
        );
    };

    const fetchuserSub = useCallback((targetPage = 0, isReset = false) => {
        if (isReset) {
            pendingResetRef.current = true;
        }
        const obj = {
            "limit": limit,
            "page": targetPage,
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
                setApiReq(false);
                setInitialLoading(false);
                setLoadingMore(false);
                setRefreshing(false);
            });
    }, [dispatch]);

    useFocusEffect(
        useCallback(() => {
            setPageNum(0);
            fetchuserSub(0, true);
        }, [fetchuserSub])
    );

    const fetchMore = useCallback(() => {
        const totalCount = TransReducer?.userSubResponse?.subscription_count || 0;
        const totalDataLength = final?.reduce((acc, item) => acc + item.data.length, 0) || 0;
        if (totalDataLength >= totalCount || apiReq || loadingMore || initialLoading) {
            return;
        }
        if (TransReducer?.userSubResponse?.subscription_data?.length > 0) {
            const nextPage = pageNum + 1;
            setPageNum(nextPage);
            setLoadingMore(true);
            fetchuserSub(nextPage, false);
        }
    }, [apiReq, loadingMore, initialLoading, final, TransReducer, pageNum, fetchuserSub]);

    const fullDataRefresh = () => {
        setRefreshing(true);
        setPageNum(0);
        fetchuserSub(0, true);
    };

    useEffect(() => {
        if (!isFocus) return;
        if (handledStatusRef.current === TransReducer.status) return;
        handledStatusRef.current = TransReducer.status;

        switch (TransReducer.status) {
            case 'Transaction/userSubRequest':
                setApiReq(true);
                break;
            case 'Transaction/userSubSuccess': {
                setApiReq(false);
                setInitialLoading(false);
                setLoadingMore(false);
                setRefreshing(false);
                const newData = TransReducer?.userSubResponse?.subscription_data || [];
                const shouldReset = pendingResetRef.current;
                pendingResetRef.current = false;

                setStoreAlldatas(prev => {
                    const updatedStoreData = shouldReset ? {} : { ...(prev || {}) };
                    Object.keys(updatedStoreData).forEach(k => {
                        updatedStoreData[k] = [...updatedStoreData[k]];
                    });
                    newData.forEach(item => {
                        if (item?.created_date) {
                            const dateString = item.created_date;
                            const monthYearMatch = dateString.match(/^([A-Za-z]+) \d{1,2}, (\d{4})$/);
                            let monthYear = '';
                            if (monthYearMatch) {
                                monthYear = `${monthYearMatch[1]} ${monthYearMatch[2]}`;
                            } else {
                                const parsed = moment(dateString, ['DD-MMM-YYYY', 'MMM DD, YYYY', 'MMMM DD, YYYY', 'YYYY-MM-DD']);
                                if (parsed.isValid()) {
                                    monthYear = parsed.format('MMM YYYY');
                                }
                            }
                            if (monthYear) {
                                if (!updatedStoreData[monthYear]) {
                                    updatedStoreData[monthYear] = [];
                                }
                                const isDuplicate = updatedStoreData[monthYear].some(
                                    existingItem => existingItem.id === item.id
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
            case 'Transaction/userSubFailure':
                pendingResetRef.current = false;
                setApiReq(false);
                setInitialLoading(false);
                setLoadingMore(false);
                setRefreshing(false);
                break;
            case 'Transaction/subRenewalRequest':
                break;
            case 'Transaction/subRenewalSuccess':
                setPageNum(0);
                setRefreshing(false);
                fetchuserSub(0, true);
                break;
            case 'Transaction/subRenewalFailure':
                break;
        }
    }, [TransReducer.status, TransReducer?.userSubResponse, isFocus, setStoreAlldatas, fetchuserSub]);

    useEffect(() => {
        if (storeAlldatas && !Array.isArray(storeAlldatas)) {
            const allItems = Object.values(storeAlldatas).flat();
            const chainedItems = computeNonOverlappingSubscriptions(allItems);
            const chainedMap = new Map();
            chainedItems.forEach((cItem) => {
                if (cItem?.id != null) {
                    chainedMap.set(cItem.id, cItem);
                }
            });

            const storetakeAll = Object.keys(storeAlldatas).map((monthYear) => {
                const data = storeAlldatas[monthYear] || [];
                const updatedData = data.map((item) => {
                    const chained = (item?.id != null && chainedMap.get(item.id)) || item;
                    return {
                        ...item,
                        ...chained,
                        dataLength: data.length,
                    };
                });
                return {
                    monthYear,
                    data: updatedData,
                };
            });
            setFinal(storetakeAll);
        }
    }, [storeAlldatas]);

    const expiredItems = useMemo(() => {
        const result = {};
        final && final.forEach(monthGroup => {
            monthGroup.data.forEach(item => {
                const expDateVal = item?.effectiveExpiryDate || item?.expiry_date;
                if (!expDateVal) {
                    result[item.id] = false;
                    return;
                }
                try {
                    const endDate = item?.effectiveExpiryDate
                        ? new Date(item.effectiveExpiryDate)
                        : new Date(moment(item?.expiry_date, ["DD-MMM-YYYY", "MMM DD, YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD"));
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

    const renderSubscriptionCard = (item, index) => {
        const isSwitchOn = switchStates[index] ?? (item?.can_cancel === 1);
        const isItemExpired = expiredItems[item.id] || false;

        const startDisplay = item?.displayStartDate || (item?.start_date
            ? moment(item.start_date, ["DD-MMM-YYYY", "MMM DD, YYYY", "YYYY-MM-DD"]).format("DD-MMM-YYYY")
            : (item?.created_date ? moment(item?.created_date, ["DD-MMM-YYYY", "MMM DD, YYYY", "YYYY-MM-DD"]).format("DD-MMM-YYYY") : ""));
        const expiryDisplay = item?.displayExpiryDate || (item?.expiry_date
            ? moment(item.expiry_date, ["DD-MMM-YYYY", "MMM DD, YYYY", "YYYY-MM-DD"]).format("DD-MMM-YYYY")
            : "");
        const periodDisplay = item?.periodString || (startDisplay && expiryDisplay ? `${startDisplay} to ${expiryDisplay}` : '');
        const hasFooterActions = item?.can_cancel == 1 || item?.can_update == 1;

        const isActive = String(item?.subscription_status || '').toLowerCase() === 'active';

        return (
            <View
                key={String(item?.id || index)}
                style={[
                    localStyles.card,
                    isActive ? localStyles.cardActive : localStyles.cardInactive
                ]}
            >
                {item?.subscription_type ? (
                    <View style={localStyles.cardTopRow}>
                        <Text numberOfLines={2} style={localStyles.titleText}>
                            {"Premium"}
                        </Text>
                        {item?.subscription_status ? (
                            <View style={[
                                localStyles.statusPill,
                                isItemExpired ? localStyles.statusPillExpired : localStyles.statusPillActive
                            ]}>
                                <Text style={[
                                    localStyles.statusText,
                                    { color: isItemExpired ? '#DC2626' : '#15803D' }
                                ]}>
                                    {isItemExpired ? "Expired" : item?.subscription_status}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                ) : null}

                {periodDisplay ? (
                    <View style={localStyles.periodBadge}>
                        <Text style={localStyles.periodText}>
                            {`Subscription: ${periodDisplay}`}
                        </Text>
                    </View>
                ) : null}

                <View style={localStyles.metaRow}>
                    <Text style={localStyles.metaText}>
                        {`Trans Date: ${moment(item?.created_date, ["MMM DD, YYYY", "YYYY-MM-DD", "DD-MMM-YYYY"]).format("YYYY-MM-DD")}`}
                    </Text>
                    <Text style={[
                        localStyles.metaText,
                        isItemExpired && localStyles.expiredDateText
                    ]}>
                        {isItemExpired
                            ? `Plan Expired on : ${expiryDisplay || moment(item?.expiry_date, ["MMM DD, YYYY", "YYYY-MM-DD", "DD-MMM-YYYY"]).format("YYYY-MM-DD")}`
                            : `Plan Expires on : ${expiryDisplay || moment(item?.expiry_date, ["MMM DD, YYYY", "YYYY-MM-DD", "DD-MMM-YYYY"]).format("YYYY-MM-DD")}`}
                    </Text>
                </View>

                {hasFooterActions ? (
                    <>
                        <View style={localStyles.divider} />
                        <View style={localStyles.actionsRow}>
                            {item?.can_cancel == 1 ? (
                                <View style={localStyles.switchRow}>
                                    <Switch
                                        trackColor={{
                                            false: "#CBD5E1",
                                            true: "#16A34A",
                                        }}
                                        thumbColor="#FFFFFF"
                                        onValueChange={() => handleSwitchToggle(index, item)}
                                        value={isSwitchOn}
                                    />
                                    <Text style={localStyles.autoRenewText}>{"Auto Renew"}</Text>
                                </View>
                            ) : <View />}

                            {item?.can_update == 1 ? (
                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    style={localStyles.updatePaymentBtn}
                                    onPress={() => navigation.navigate("PaymentSub", { takeid: item?.id })}
                                >
                                    <Text style={localStyles.updatePaymentText}>
                                        {"Update Payment Details"}
                                    </Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </>
                ) : null}
            </View>
        );
    };

    const renderMonthItem = ({ item }) => {
        return (
            <View key={item.monthYear} style={localStyles.monthSection}>
                <View style={localStyles.monthHeaderRow}>
                    <View style={localStyles.monthPill}>
                        <Text style={localStyles.monthTitle}>{item.monthYear}</Text>
                    </View>
                </View>
                {(item?.data || []).map((entry, idx) => renderSubscriptionCard(entry, idx))}
            </View>
        );
    };

    return (
        <View style={localStyles.container}>
            {initialLoading && final.length === 0 ? (
                <TransactionListSkeleton count={4} />
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
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: normalize(12),
        paddingTop: normalize(8),
        paddingBottom: normalize(32),
    },
    monthSection: {
        marginBottom: normalize(12),
    },
    monthHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(8),
        paddingHorizontal: normalize(2),
    },
    monthPill: {
        backgroundColor: '#E0ECFF',
        borderRadius: normalize(14),
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(4),
    },
    monthTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
        color: Colorpath.ButtonColr,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(12),
        borderWidth: 1,
        borderColor: '#DCE7FB',
        borderLeftWidth: 4,
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(10),
        marginBottom: normalize(10),
    },
    cardActive: {
        borderLeftColor: '#16A34A',
        backgroundColor: '#FFFFFF',
    },
    cardInactive: {
        borderLeftColor: '#EF4444',
        backgroundColor: '#FFFFFF',
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(6),
    },
    titleText: {
        flex: 1,
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        color: '#0F172A',
        marginRight: normalize(8),
    },
    statusPill: {
        paddingHorizontal: normalize(9),
        paddingVertical: normalize(3),
        borderRadius: normalize(12),
        borderWidth: 1,
    },
    statusPillActive: {
        backgroundColor: '#F0FDF4',
        borderColor: '#BBF7D0',
    },
    statusPillExpired: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
    },
    statusText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 11,
    },
    periodBadge: {
        backgroundColor: '#F3E8FF',
        borderWidth: 1,
        borderColor: '#E9D5FF',
        borderRadius: normalize(8),
        paddingHorizontal: normalize(9),
        paddingVertical: normalize(4),
        marginBottom: normalize(7),
        alignSelf: 'flex-start',
    },
    periodText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 11,
        color: '#6B21A8',
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: normalize(4),
    },
    metaText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 11,
        color: '#64748B',
    },
    expiredDateText: {
        color: '#DC2626',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: normalize(8),
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: normalize(8),
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalize(8),
    },
    autoRenewText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 13,
        color: '#0F172A',
    },
    updatePaymentBtn: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        borderRadius: normalize(8),
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(5),
    },
    updatePaymentText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12,
        color: Colorpath.ButtonColr,
    },
    footerLoader: {
        paddingVertical: normalize(14),
        alignItems: 'center',
    },
});

export default UserSub
