/**
 * Hcp content screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, HcpContent, handleSwitchToggle, fetchHCPSub, fullDataRefresh, renderItem, renderMonthItem.
 */

import { View, Text, FlatList, ActivityIndicator, RefreshControl, Switch, Alert, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { HCPSubRequest, subRenewalRequest } from '../../Redux/Reducers/TransReducer';
import moment from 'moment';
import { TransactionEmptyState, TransactionListSkeleton } from './TransactionUiHelpers';

/**
 * Reusable HcpContent component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const HcpContent = ({ storeAlldata, setStoreAlldata }) => {
    const TransReducer = useSelector(state => state.TransReducer);
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
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
                            "subscription_id": get?.subscription_id
                        };
                        dispatch(subRenewalRequest(obj));
                    },
                },
            ]
        );
    };

    const fetchHCPSub = useCallback((targetPage = 0, isReset = false) => {
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
                dispatch(HCPSubRequest(obj));
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
            fetchHCPSub(0, true);
        }, [fetchHCPSub])
    );

    const fetchMore = useCallback(() => {
        const totalCount = TransReducer?.HCPSubResponse?.bundle_subscriptions || 0;
        const totalDataLength = final?.reduce((acc, item) => acc + item.data.length, 0) || 0;
        if (totalDataLength >= totalCount || apiReq || loadingMore || initialLoading) {
            return;
        }
        if (TransReducer?.HCPSubResponse?.subscriptions?.length > 0) {
            const nextPage = pageNum + 1;
            setPageNum(nextPage);
            setLoadingMore(true);
            fetchHCPSub(nextPage, false);
        }
    }, [apiReq, loadingMore, initialLoading, final, TransReducer, pageNum, fetchHCPSub]);

    const fullDataRefresh = () => {
        setRefreshing(true);
        setPageNum(0);
        fetchHCPSub(0, true);
    };

    useEffect(() => {
        if (!isFocus) return;
        if (handledStatusRef.current === TransReducer.status) return;
        handledStatusRef.current = TransReducer.status;

        switch (TransReducer.status) {
            case 'Transaction/HCPSubRequest':
                setApiReq(true);
                break;
            case 'Transaction/HCPSubSuccess': {
                setApiReq(false);
                setInitialLoading(false);
                setLoadingMore(false);
                setRefreshing(false);
                const newData = TransReducer?.HCPSubResponse?.subscriptions || [];
                const shouldReset = pendingResetRef.current;
                pendingResetRef.current = false;

                setStoreAlldata(prev => {
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
                                const parsed = moment(dateString, ["MMM DD, YYYY", "MMM D, YYYY", "MMMM DD, YYYY", "YYYY-MM-DD"]);
                                if (parsed.isValid()) {
                                    monthYear = parsed.format('MMM YYYY');
                                }
                            }
                            if (monthYear) {
                                if (!updatedStoreData[monthYear]) {
                                    updatedStoreData[monthYear] = [];
                                }
                                const isDuplicate = updatedStoreData[monthYear].some(
                                    existingItem => existingItem.subscription_id === item.subscription_id
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
            case 'Transaction/HCPSubFailure':
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
                fetchHCPSub(0, true);
                break;
            case 'Transaction/subRenewalFailure':
                break;
        }
    }, [TransReducer.status, TransReducer?.HCPSubResponse, isFocus, setStoreAlldata, fetchHCPSub]);

    useEffect(() => {
        if (storeAlldata && !Array.isArray(storeAlldata)) {
            const storetakeAll = Object.keys(storeAlldata).map((monthYear) => {
                const data = storeAlldata[monthYear] || [];
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
        }
    }, [storeAlldata]);

    const renderSubscriptionCard = (item, index) => {
        const isSwitchOn = switchStates[index] ?? (item?.can_cancel === 1);
        const isActive = String(item?.subscription_status || '').toLowerCase() === 'active';

        return (
            <View
                key={String(item?.subscription_id || index)}
                style={[
                    localStyles.card,
                    isActive ? localStyles.cardActive : localStyles.cardInactive
                ]}
            >
                <View style={localStyles.cardTopRow}>
                    <Text numberOfLines={2} style={localStyles.titleText}>
                        {item?.plan_name}
                    </Text>
                    {item?.subscription_status ? (
                        <View style={[
                            localStyles.statusPill,
                            isActive ? localStyles.statusPillActive : localStyles.statusPillInactive
                        ]}>
                            <Text style={[
                                localStyles.statusText,
                                { color: isActive ? '#15803D' : '#DC2626' }
                            ]}>
                                {item?.subscription_status}
                            </Text>
                        </View>
                    ) : null}
                </View>

                <View style={localStyles.metaRow}>
                    <Text style={localStyles.metaText}>
                        {`Trans Date: ${moment(item?.created_date, ["MMM DD, YYYY", "YYYY-MM-DD", "DD-MMM-YYYY"]).format("YYYY-MM-DD")}`}
                    </Text>
                    {item?.total_amount ? (
                        <View style={localStyles.amountPill}>
                            <Text style={localStyles.amountText}>
                                {`US$${item?.total_amount}`}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {item?.can_cancel == 1 ? (
                    <>
                        <View style={localStyles.divider} />
                        <View style={localStyles.actionsRow}>
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
        alignItems: 'flex-start',
        marginBottom: normalize(6),
    },
    titleText: {
        flex: 1,
        fontFamily: Fonts.InterSemiBold,
        fontSize: 14,
        lineHeight: 19,
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
    statusPillInactive: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
    },
    statusText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 11,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 11,
        color: '#64748B',
    },
    amountPill: {
        backgroundColor: '#EFF6FF',
        borderColor: '#DBEAFE',
        borderWidth: 1,
        borderRadius: normalize(8),
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(3),
    },
    amountText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13,
        color: Colorpath.ButtonColr,
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
    footerLoader: {
        paddingVertical: normalize(14),
        alignItems: 'center',
    },
});

export default HcpContent
