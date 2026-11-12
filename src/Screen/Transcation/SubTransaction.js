/**
 * Sub transaction screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, SubTransaction, toggleDrawerModal, registBaack, titlhandleUrl, subHandle, fullDataRefresh, onBackPress, openPDF, renderItem, renderMonthItem.
 */

import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, RefreshControl, BackHandler, StyleSheet } from 'react-native'
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
import { subscribeTransRequest } from '../../Redux/Reducers/TransReducer';
import moment from 'moment';
import DrawerModal from '../../Components/DrawerModal';
import { AppContext } from '../GlobalSupport/AppContext';
import IconDot from 'react-native-vector-icons/Entypo';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import Loader from '../../Utils/Helpers/Loader';
import { styles as specialStyles } from '../Specialization/SpecialStyle';
import Modal from 'react-native-modal';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'
import { TransactionEmptyState, TransactionListSkeleton } from './TransactionUiHelpers';

/**
 * Reusable SubTransaction component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const SubTransaction = (props) => {
    const { addit, isConnected } = useContext(AppContext);
    const [visible, setVisible] = useState(false);
    const [nodata, setNodata] = useState("drawerclose");
    const [idget, setIdget] = useState("6");
    const DownData = [{ id: 0, name: "Download Payment Receipt" }]
    const [modalShow, setModalShow] = useState(false);
    const [showLoad, setShowLoad] = useState(false);
    const [save, setSave] = useState();
    const [conn, setConn] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);

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

    const titlhandleUrl = (make) => {
        const urltitle = make?.conferenceURL;
        const resulttitle = urltitle?.split('/').pop();
        if (resulttitle) {
            props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, creditData: addit } })
        }
    };

    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const handledStatusRef = useRef(TransReducer.status);
    const pendingResetRef = useRef(true);
    const [storeAlldata, setStoreAlldata] = useState({});
    const [apiReq, setApiReq] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [final, setFinal] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const subHandle = useCallback((targetPage = 0, isReset = false) => {
        if (isReset) {
            pendingResetRef.current = true;
        }
        const obj = {
            "page": targetPage,
            "fromDate": "",
            "toDate": "",
            "keyword": ""
        };
        connectionrequest()
            .then(() => {
                dispatch(subscribeTransRequest(obj));
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
            subHandle(0, true);
        }, [subHandle])
    );

    const fetchMore = useCallback(() => {
        const totalCount = TransReducer?.subscribeTransResponse?.transaction_count || 0;
        const totalDataLength = final?.reduce((acc, item) => acc + item.data.length, 0) || 0;
        if (totalDataLength >= totalCount || apiReq || loadingMore || initialLoading) {
            return;
        }
        const hasSubscribeTransaction = TransReducer?.subscribeTransResponse?.transaction_data?.length > 0;
        if (hasSubscribeTransaction) {
            const nextPage = pageNum + 1;
            setPageNum(nextPage);
            setLoadingMore(true);
            subHandle(nextPage, false);
        }
    }, [apiReq, loadingMore, initialLoading, final, TransReducer, pageNum, subHandle]);

    const fullDataRefresh = () => {
        setRefreshing(true);
        setPageNum(0);
        subHandle(0, true);
    };

    useEffect(() => {
        if (!isFocus) return;
        if (handledStatusRef.current === TransReducer.status) return;
        handledStatusRef.current = TransReducer.status;

        switch (TransReducer.status) {
            case 'Transaction/subscribeTransRequest':
                setApiReq(true);
                break;
            case 'Transaction/subscribeTransSuccess': {
                setApiReq(false);
                setInitialLoading(false);
                setLoadingMore(false);
                setRefreshing(false);
                const newDatasub = TransReducer?.subscribeTransResponse?.transaction_data || [];
                const shouldReset = pendingResetRef.current;
                pendingResetRef.current = false;

                setStoreAlldata(prev => {
                    const updatedStoreData = shouldReset ? {} : { ...(prev || {}) };
                    Object.keys(updatedStoreData).forEach(k => {
                        updatedStoreData[k] = [...updatedStoreData[k]];
                    });
                    newDatasub.forEach(item => {
                        if (item?.payment_date) {
                            const dateString = item.payment_date;
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
                                if (!updatedStoreData[monthYear].some(existingItem => existingItem.invoice_number === item.invoice_number)) {
                                    updatedStoreData[monthYear].push(item);
                                }
                            }
                        }
                    });
                    return updatedStoreData;
                });
                break;
            }
            case 'Transaction/subscribeTransFailure':
                pendingResetRef.current = false;
                setApiReq(false);
                setInitialLoading(false);
                setLoadingMore(false);
                setRefreshing(false);
                break;
        }
    }, [TransReducer.status, TransReducer?.subscribeTransResponse, isFocus]);

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

    const openPDF = async (finalurl) => {
        if (!finalurl) {
            setShowLoad(false);
            return;
        }
        try {
            const url = finalurl;
            let fileName = url.split("/").pop();
            if (!fileName || !fileName.includes(".")) {
                fileName = "download.pdf";
            }
            const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
            const exists = await RNFS.exists(localFile);
            if (!exists) {
                const options = { fromUrl: url, toFile: localFile };
                await RNFS.downloadFile(options).promise;
            }
            setShowLoad(false);
            await FileViewer.open(localFile);
        } catch (error) {
            console.error('Error during file download or opening:', error);
            setShowLoad(false);
        }
    };

    const renderTransactionCard = (item, index) => {
        const hasMode = Boolean(item?.paymentMode || item?.payment_method);
        const amountLabel = item?.total_amount ? `US$${item?.total_amount}` : item?.paidAmount;

        return (
            <View key={String(item?.invoiceNumber || item?.invoice_number || index)} style={localStyles.card}>
                <View style={localStyles.cardTopRow}>
                    {hasMode ? (
                        <View style={localStyles.modePill}>
                            <Text style={localStyles.modePillText}>
                                {item?.paymentMode || item?.payment_method}
                            </Text>
                        </View>
                    ) : <View />}

                    <View style={localStyles.topRightGroup}>
                        {hasMode ? (
                            <Image
                                source={Imagepath.Complt}
                                style={[
                                    localStyles.completedIcon,
                                    { marginRight: item?.invoice_url ? normalize(8) : 0 }
                                ]}
                            />
                        ) : null}
                        {item?.invoice_url ? (
                            <TouchableOpacity
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                onPress={() => {
                                    setModalShow(true);
                                    setSave(item?.invoice_url);
                                }}
                                style={localStyles.moreButton}
                            >
                                <IconDot
                                    name="dots-three-vertical"
                                    size={18}
                                    color="#64748B"
                                />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>

                {item?.conferenceName ? (
                    <TouchableOpacity activeOpacity={0.75} onPress={() => titlhandleUrl(item)}>
                        <Text numberOfLines={2} style={localStyles.titleText}>
                            {item?.conferenceName}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <Text numberOfLines={2} style={localStyles.titleText}>
                        {`Invoice #: ${item?.invoice_number}`}
                    </Text>
                )}

                <View style={localStyles.divider} />

                <View style={localStyles.cardFooterRow}>
                    <Text style={localStyles.metaText}>
                        {item?.invoiceNumber
                            ? `Trans Id: ${item?.invoiceNumber}`
                            : `Trans Date: ${moment(item?.payment_date, "MMM DD,YYYY").format("DD-MM-YYYY")}`}
                    </Text>
                    {amountLabel ? (
                        <Text style={localStyles.amountText}>
                            {amountLabel}
                        </Text>
                    ) : null}
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

    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            <SafeAreaView style={localStyles.container}>
                <PageHeader
                    title={props?.route?.params?.name || "Subscriptions Transaction"}
                    onBackPress={registBaack}
                />
                <Loader visible={showLoad} />
                {conn == false ? <IntOff /> : (
                    <View style={localStyles.listContainer}>
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
                )}
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
                            borderTopLeftRadius: normalize(14),
                            borderTopRightRadius: normalize(14),
                            height: normalize(90),
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            backgroundColor: '#fff',
                            paddingTop: normalize(10),
                        }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item => String(item.id)}
                            data={DownData}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setModalShow(false);
                                            setShowLoad(true);
                                            openPDF(save);
                                        }}
                                        style={[specialStyles.dropDownItem]}>
                                        <Text style={{
                                            fontSize: 15,
                                            textAlign: 'center',
                                            color: Colorpath.black,
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

const localStyles = StyleSheet.create({
    container: {
        backgroundColor: '#F4F7FC',
        flex: 1,
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: normalize(12),
        paddingTop: normalize(10),
        paddingBottom: normalize(32),
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
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: normalize(6),
    },
    modePill: {
        paddingHorizontal: normalize(9),
        paddingVertical: normalize(3),
        borderRadius: normalize(12),
        backgroundColor: '#FFF4E5',
        borderWidth: 1,
        borderColor: '#FDE6C4',
    },
    modePillText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 11,
        color: '#B45309',
    },
    topRightGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    completedIcon: {
        height: normalize(18),
        width: normalize(18),
        resizeMode: 'contain',
    },
    moreButton: {
        padding: normalize(2),
    },
    titleText: {
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
        flex: 1,
        marginRight: normalize(8),
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
});

export default SubTransaction
