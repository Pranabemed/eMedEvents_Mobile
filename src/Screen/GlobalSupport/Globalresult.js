import { View, Text, Platform, Image, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator, StyleSheet, BackHandler, TextInput, Dimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import PageHeader from '../../Components/PageHeader';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import { useDispatch, useSelector } from 'react-redux';
import { cmeCourseRequest, ConfActRequest, clearCmeCourseData } from '../../Redux/Reducers/CMEReducer';
import { stateRequest } from '../../Redux/Reducers/AuthReducer';
import { professionvaultRequest } from '../../Redux/Reducers/CreditVaultReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import moment from 'moment';
import Modal from 'react-native-modal';
import Loader from '../../Utils/Helpers/Loader';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { FormatDateZone } from '../../Utils/Helpers/Timezone';
import { AppContext } from './AppContext';
import IntOff from '../../Utils/Helpers/IntOff';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialIcons';
import CMEChecklistModal from '../CMECreditValut/CMEChecklistModal';

const getStateId = stateObj => stateObj?.id ?? stateObj?.state_id;

const getStateLabel = stateObj =>
    stateObj?.name || stateObj?.state_name || stateObj?.title || '';

const getResultButtonLabel = item =>
    item?.buttonText ||
    item?.button_text ||
    item?.buttonType ||
    item?.buttontype ||
    item?.button_type ||
    item?.button ||
    item?.cta_text ||
    '';

const getResultPriceLabel = item => {
    const rawPrice = item?.display_price ?? item?.price ?? item?.ticketprice ?? '';
    const priceText = String(rawPrice).trim();

    if (!priceText) {
        return '';
    }

    if (priceText.toUpperCase() === 'FREE') {
        return 'FREE';
    }

    return `${item?.display_currency_code || item?.currency_code || 'US$'}${priceText}`;
};

const getResultTypeLabel = item => {
    const rawType = String(
        item?.eventType ||
        item?.event_type ||
        item?.conference_type ||
        item?.conference_type_text ||
        item?.type ||
        ''
    ).trim();

    const lower = rawType.toLowerCase();
    if (lower === 'webcst' || lower === 'webcast') {
        return 'Webcast';
    }
    if (lower === 'in-person' || lower === 'inperson') {
        return 'In-person';
    }
    return rawType;
};

const getResultCreditLabel = item => {
    const rawCme = item?.display_cme || item?.cmeLabel || item?.credit || item?.credits || '';
    if (rawCme) {
        const cleaned = String(rawCme).trim();
        if (/^\d+(\.\d+)?$/.test(cleaned)) {
            return `${cleaned} CME / CE Credit(s)`;
        }
        return cleaned.replace(/contact hours?(\(s\))?/ig, 'Contact Hour(s)').trim();
    }
    if (Array.isArray(item?.cme_points_popovar) && item.cme_points_popovar.length) {
        return item.cme_points_popovar
            .map(point => {
                const count = parseFloat(point?.points) || 0;
                const name = point?.name && /contact\s*hours?(\(s\))?/i.test(point.name)
                    ? 'Contact Hour(s)'
                    : point?.name || '';
                return `${count} ${name}`.trim();
            })
            .filter(Boolean)
            .join(' | ');
    }
    return '';
};

const Globalresult = (props) => {
    const CMEReducer = useSelector(state => state.CMEReducer);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const CreditVaultReducer = useSelector(state => state.CreditVaultReducer);
    const dispatch = useDispatch();
    const {
        isConnected
    } = useContext(AppContext);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const [storeAlldata, setStoreAlldata] = useState([]);
    const [apiReq, setApiReq] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasFetchedResults, setHasFetchedResults] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [limit, setLimit] = useState(9);
    const [refreshing, setRefreshing] = useState(false);
    const [sortedFall, setSortedFall] = useState(false);
    const [sortType, setSortType] = useState("");
    const [profModalVisible, setProfModalVisible] = useState(false);
    const [stateModalVisible, setStateModalVisible] = useState(false);
    const [stateSearchText, setStateSearchText] = useState('');
    const [selectedProfession, setSelectedProfession] = useState('');
    const [selectedState, setSelectedState] = useState(null);
    const [cmeModalVisible, setCmeModalVisible] = useState(false);
    const [allProfessionData, setAllProfessionData] = useState(null);
    const [shouldOpenCmeChecklist, setShouldOpenCmeChecklist] = useState(false);
    const [cmeRequestKey, setCmeRequestKey] = useState('');
    const [handledCmeRequestKey, setHandledCmeRequestKey] = useState('');
    const [cmeRequestStarted, setCmeRequestStarted] = useState(false);
    const [displayedHeaderTitle, setDisplayedHeaderTitle] = useState('');
    const [displayedResultsCount, setDisplayedResultsCount] = useState(0);
    const [displayedAggregations, setDisplayedAggregations] = useState(null);
    const hasFocusedOnceRef = useRef(false);
    const requestStatusRef = useRef("");
    const lastTrigRef = useRef();
    const lastFilterRef = useRef();
    const sortedData = [{ id: 0, name: "Price- Low to High", type: "PRICE_ASC" }, { id: 1, name: "Price- High to Low", type: "PRICE_DESC" }, { id: 2, name: "By Date- Newest to Oldest", type: "STARTDATE_DESC" }, { id: 3, name: "By Date- Oldest to Newest", type: "STARTDATE_ASC" }, { id: 4, name: "By CME Point- Low to High", type: "CMEPOINTS_ASC" }, { id: 5, name: "By CME Point- High to Low", type: "CMEPOINTS_DESC" }];
    const sorteddataforCity = [{ id: 2, name: "By Date- Newest to Oldest", type: "STARTDATE_DESC" }, { id: 3, name: "By Date- Oldest to Newest", type: "STARTDATE_ASC" }, { id: 4, name: "By CME Point- Low to High", type: "CMEPOINTS_ASC" }, { id: 5, name: "By CME Point- High to Low", type: "CMEPOINTS_DESC" }]
    const isFreeOnlyResults = useMemo(() => {
        if (!Array.isArray(storeAlldata) || storeAlldata.length === 0) {
            return false;
        }

        return storeAlldata.every(item => {
            const rawPrice = item?.display_price ?? item?.price ?? item?.ticketprice ?? item?.displayPrice ?? '';
            const normalizedPrice = String(rawPrice).trim().toLowerCase();

            return (
                !normalizedPrice ||
                normalizedPrice === '0' ||
                normalizedPrice === '0.0' ||
                normalizedPrice === '0.00' ||
                normalizedPrice === 'free'
            );
        });
    }, [storeAlldata]);
    const sortOptions = useMemo(() => {
        const baseOptions = props?.route?.params?.trig?.newCt ? sorteddataforCity : sortedData;

        if (!isFreeOnlyResults) {
            return baseOptions;
        }

        return baseOptions.filter(option => !option?.type?.startsWith('PRICE_'));
    }, [isFreeOnlyResults, props?.route?.params?.trig?.newCt]);
    const sortModalHeight = useMemo(() => {
        const maxHeight = props?.route?.params?.trig?.newCt ? normalize(240) : normalize(340);
        const itemHeight = normalize(50);
        const paddingHeight = normalize(28);
        const calculatedHeight = paddingHeight + (sortOptions.length * itemHeight);

        return Math.max(normalize(160), Math.min(calculatedHeight, maxHeight));
    }, [props?.route?.params?.trig?.newCt, sortOptions.length]);
    const hasAuthToken = Boolean(String(AuthReducer?.token || AuthReducer?.loginResponse?.token || '').trim());
    const guestSelection = props?.route?.params?.guestSelection;
    const isGuestCmeRouteType = props?.route?.params?.trig?.rqstType === 'professionlandingpage';
    const hasGuestSelectionData = Boolean(
        guestSelection?.profession ||
        guestSelection?.stateId ||
        guestSelection?.stateName ||
        guestSelection?.state,
    );
    const isGuestCmeFlow = Boolean(
        !hasAuthToken && (
            isGuestCmeRouteType ||
            props?.route?.params?.guestCmeFlow === true ||
            props?.route?.params?.trig?.guestCmeFlow === true ||
            hasGuestSelectionData
        )
    );
    const isGuestSpecialityFlow = Boolean(
        !hasAuthToken && (
            props?.route?.params?.trig?.fromGuestSpecialitySearch ||
            props?.route?.params?.trig?.creditData?.fromGuestSpecialitySearch ||
            props?.route?.params?.trig?.CreditData?.fromGuestSpecialitySearch ||
            (props?.route?.params?.trig?.Realback === 'guest' && props?.route?.params?.trig?.rqstType === 'specialityconferences')
        )
    );
    const isGuestFlow = Boolean(
        isGuestCmeFlow ||
        isGuestSpecialityFlow ||
        props?.route?.params?.trig?.Realback === 'guest' ||
        props?.route?.params?.Realback === 'guest' ||
        !hasAuthToken
    );
    const stateList = Array.isArray(AuthReducer?.stateResponse?.data)
        ? AuthReducer?.stateResponse?.data
        : Array.isArray(AuthReducer?.stateResponse?.states)
            ? AuthReducer?.stateResponse?.states
            : [];
    const filteredStateList = stateList.filter(item =>
        String(getStateLabel(item)).toLowerCase().includes(stateSearchText.trim().toLowerCase()),
    );
    const totalResults = Number(
        CMEReducer?.cmeCourseResponse?.conferences_count ??
        props?.route?.params?.trig?.totalDaa?.count ??
        0,
    );
    const canLoadMore = totalResults > 0 && storeAlldata.length < totalResults;
    const routeQueryKey = useMemo(
        () =>
            JSON.stringify({
                trig: props?.route?.params?.trig ?? null,
                filterDatSh: props?.route?.params?.filterDatSh ?? null,
            }),
        [props?.route?.params?.filterDatSh, props?.route?.params?.trig],
    );
    const [displayedRouteQueryKey, setDisplayedRouteQueryKey] = useState(routeQueryKey);
    const isRouteRefreshing = displayedRouteQueryKey !== routeQueryKey;
    const resetResultsView = useCallback((options = {}) => {
        const {
            clearSort = false,
            loadingState = false,
            routeKey,
        } = options;

        setStoreAlldata([]);
        setPageNum(0);
        setHasFetchedResults(false);
        setDisplayedHeaderTitle('');
        setDisplayedResultsCount(0);
        setDisplayedAggregations(null);
        setRefreshing(false);
        setLoading(loadingState);
        setApiReq(false);

        if (clearSort) {
            setSortType('');
        }

        if (routeKey) {
            setDisplayedRouteQueryKey(routeKey);
        }
        dispatch(clearCmeCourseData());
    }, [dispatch]);
    useEffect(() => {
        const currentTrig = props?.route?.params?.trig;
        if (currentTrig) {
            const currentTrigStr = JSON.stringify(currentTrig);
            if (currentTrigStr !== lastTrigRef.current) {
                lastTrigRef.current = currentTrigStr;
                resetResultsView({ clearSort: true, loadingState: true });
                fetchHandle(undefined, { pageNum: 0, sortType: '' });
            }
        }
    }, [props?.route?.params?.trig, resetResultsView, fetchHandle]);
    useEffect(() => {
        const currentFilter = props?.route?.params?.filterDatSh?.filterDatSh;
        if (currentFilter) {
            const currentFilterStr = JSON.stringify(currentFilter);
            if (currentFilterStr !== lastFilterRef.current) {
                lastFilterRef.current = currentFilterStr;
                resetResultsView({ loadingState: true });
                fetchHandle(undefined, { pageNum: 0, sortType });
            }
        }
    }, [props?.route?.params?.filterDatSh, resetResultsView, sortType, fetchHandle]);
    useEffect(() => {
        if (!isGuestCmeFlow) return;

        setSelectedProfession(guestSelection?.profession || '');
        if (guestSelection?.state) {
            setSelectedState(guestSelection.state);
            return;
        }
        if (guestSelection?.stateId || guestSelection?.stateName) {
            setSelectedState({
                state_id: guestSelection?.stateId,
                name: guestSelection?.stateName,
            });
        }
    }, [
        guestSelection?.profession,
        guestSelection?.state,
        guestSelection?.stateId,
        guestSelection?.stateName,
        isGuestCmeFlow,
    ]);
    useEffect(() => {
        if (!isGuestCmeFlow) return;
        dispatch(stateRequest(1));
    }, [dispatch, isGuestCmeFlow]);
    useEffect(() => {
        if (
            shouldOpenCmeChecklist &&
            cmeRequestKey &&
            CreditVaultReducer?.status === 'CreditVault/professionvaultRequest'
        ) {
            setCmeRequestStarted(true);
        }
    }, [CreditVaultReducer?.status, cmeRequestKey, shouldOpenCmeChecklist]);
    useEffect(() => {
        if (
            shouldOpenCmeChecklist &&
            cmeRequestKey &&
            cmeRequestStarted &&
            handledCmeRequestKey !== cmeRequestKey &&
            (CreditVaultReducer?.status === 'CreditVault/professionvaultSuccess' ||
                CreditVaultReducer?.status === 'CreditVault/professionvaultFailure')
        ) {
            if (CreditVaultReducer?.status === 'CreditVault/professionvaultSuccess') {
                setAllProfessionData(CreditVaultReducer?.professionvaultResponse);
                setCmeModalVisible(true);
            }
            setHandledCmeRequestKey(cmeRequestKey);
            setShouldOpenCmeChecklist(false);
            setCmeRequestStarted(false);
        }
    }, [
        CreditVaultReducer?.professionvaultResponse,
        CreditVaultReducer?.status,
        cmeRequestKey,
        cmeRequestStarted,
        handledCmeRequestKey,
        shouldOpenCmeChecklist,
    ]);
    useEffect(() => {
        const stateId = getStateId(selectedState);
        if (!isGuestCmeFlow || !shouldOpenCmeChecklist || !selectedProfession || stateId == null) {
            return;
        }

        const requestKey = `${selectedProfession}-${stateId}`;
        setCmeModalVisible(false);
        setAllProfessionData(null);
        resetResultsView({ clearSort: true });
        setCmeRequestKey(requestKey);
        dispatch(
            professionvaultRequest({
                profession: selectedProfession,
                stateId: String(stateId),
            }),
        );
    }, [dispatch, isGuestCmeFlow, resetResultsView, selectedProfession, selectedState, shouldOpenCmeChecklist]);
    console.log(props?.route?.params, "props?.route?.params?.filterDatSh------")
    const goBackToGuestUser = useCallback(() => {
        setProfModalVisible(false);
        setStateModalVisible(false);
        setCmeModalVisible(false);
        setSortedFall(false);

        const navigationState = props.navigation.getState();
        const previousRoute = navigationState?.routes?.[navigationState.index - 1];
        const resetGuestSelectionsAt = Date.now();

        if (previousRoute?.name === 'GuestUser' && previousRoute?.key) {
            props.navigation.dispatch({
                ...CommonActions.setParams({
                    resetGuestSelectionsAt,
                }),
                source: previousRoute.key,
            });
            props.navigation.goBack();
            return;
        }

        props.navigation.navigate('GuestUser', {
            resetGuestSelectionsAt,
        });
    }, [props.navigation]);
    const SearchBack = useCallback(() => {
        if (props.navigation.canGoBack?.()) {
            props.navigation.goBack();
        } else if (isGuestCmeFlow) {
            goBackToGuestUser();
        } else if (props?.route?.params?.trig?.Realback == "cont") {
            props.navigation.goBack();
        } else if (props?.route?.params?.trig?.backProps == "yes") {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: "TabNav", params: { initialRoute: "Home" } }
                    ],
                })
            );
        } else if (props?.route?.params?.trig?.speaker) {
            props.navigation.goBack();
        } else if (props?.route?.params?.trig?.back == "goBack") {
            props.navigation.goBack();
        } else {
            props.navigation.goBack();
        }
    }, [goBackToGuestUser, isGuestCmeFlow, props.navigation, props?.route?.params?.trig]);
    useEffect(() => {
        return () => {
            dispatch(clearCmeCourseData());
        };
    }, [dispatch]);
    useEffect(() => {
        const onBackPress = () => {
            SearchBack()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, [SearchBack]);
    const fetchHandle = useCallback((d, options = {}) => {
        const requestedPageNum = options?.pageNum ?? pageNum;
        const requestedSortType = options?.sortType ?? d?.type ?? sortType ?? "";
        if (requestedPageNum === 0) {
            setLoading(true);
            setHasFetchedResults(false);
        }
        const mainKey = props?.route?.params?.trig?.mainKey ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.mainKey ?? "";
        const stateKey = props?.route?.params?.trig?.newAdd ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.newAdd ?? "";
        const newCt = props?.route?.params?.trig?.newCt ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.newCt ?? "";
        const rqstType =
            props?.route?.params?.trig?.rqstType ??
            props?.route?.params?.filterDatSh?.returnTake?.trig?.rqstType ??
            "";
        const finalKey =
            rqstType == "specialityconferences"
                ? `m${rqstType}`
                : rqstType;

        let obj = {
            "pageno": requestedPageNum,
            "limit": limit,
            "search_speciality": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.count_specilaities)?.map(d => d?.count_specilaities).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.count_specilaities)?.map(d => d?.count_specilaities).flat()
                : "",
            "conference_type_text":
                props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.conf_types)?.map(d => d?.conf_types).flat().length > 0
                    ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.conf_types)?.map(d => d?.conf_types).flat()
                    : "",
            "cme_from": props?.route?.params?.filterDatSh?.minVal ? props?.route?.params?.filterDatSh?.minVal : "",
            "cme_to": props?.route?.params?.filterDatSh?.maxVal ? props?.route?.params?.filterDatSh?.maxVal : "",
            "organization": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.organizers_types)?.map(d => d?.organizers_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.organizers_types)?.map(d => d?.organizers_types).flat()
                : props?.route?.params?.trig?.organ ? props?.route?.params?.trig?.organ : "",
            "price_from": props?.route?.params?.filterDatSh?.minValP ? props?.route?.params?.filterDatSh?.minValP : "",
            "price_to": props?.route?.params?.filterDatSh?.maxValp ? props?.route?.params?.filterDatSh?.maxValp : "",
            "startdate": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.date_types)?.map(d => d?.date_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.date_types)?.map(d => d?.date_types).flat()
                : "",
            "location": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.location_types)?.map(d => d?.location_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.location_types)?.map(d => d?.location_types).flat()
                : "",
            "free_conf": props?.route?.params?.filterDatSh?.selectedIt?.length > 0 ? props?.route?.params?.filterDatSh?.selectedIt?.find(item => item === "Free Courses") == "Free Courses" ? 1 : "" : "",
            "noncme": props?.route?.params?.filterDatSh?.selectedIt?.length > 0 ? props?.route?.params?.filterDatSh?.selectedIt?.find(item => item === "Non-CME Courses") == "Non-CME Courses" ? 1 : "" : "",
            "speaker": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.speakers_types)?.map(d => d?.speakers_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.speakers_types)?.map(d => d?.speakers_types).flat()
                : props?.route?.params?.trig?.speaker ? props?.route?.params?.trig?.speaker : "",
            "search_mandate_states": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.mandate_states)?.map(d => d?.mandate_states).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.mandate_states)?.map(d => d?.mandate_states).flat()
                : [],
            "search_topic": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.topic_types)?.map(d => d?.topic_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.topic_types)?.map(d => d?.topic_types).flat()
                : "",
            "search_profession": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.profession_types)?.map(d => d?.profession_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.profession_types)?.map(d => d?.profession_types).flat()
                : "",
            "credittype": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.credit_types)?.map(d => d?.credit_types).flat().length > 0
                ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.credit_types)?.map(d => d?.credit_types).flat()
                : "",
            "sort_type": requestedSortType,
            "searchKeyword": props?.route?.params?.trig?.searchTxt ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.searchTxt ?? "",
            "request_type": finalKey ?? props?.route?.params?.trig?.rqstType ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.rqstType ?? "",
            [mainKey]:
                props?.route?.params?.trig?.beforetake ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.beforetake
                ?? props?.route?.params?.trig?.beforetakecity?.[0] ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.beforetakecity?.[0]
                ?? props?.route?.params?.trig?.monthAds ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.monthAds ?? props?.route?.params?.trig?.trig ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.trig ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.datamainkey
                ?? props?.route?.params?.trig?.datamainkey ?? "",
            [stateKey]:
                (props?.route?.params?.trig?.newAdd ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.newAdd)
                    ? (
                        props?.route?.params?.trig?.trig ??
                        props?.route?.params?.filterDatSh?.returnTake?.trig?.trig ??
                        props?.route?.params?.trig?.beforetakecity?.[1] ??
                        props?.route?.params?.filterDatSh?.returnTake?.trig?.beforetakecity?.[1] ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.stateID ?? props?.route?.params?.trig?.stateID
                    )
                    : "",
            [newCt]:
                (props?.route?.params?.trig?.newCt ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.newCt)
                    ? (props?.route?.params?.trig?.beforetakecity?.[2] ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.beforetakecity?.[2] ?? props?.route?.params?.filterDatSh?.returnTake?.trig?.allProfessionMain ?? props?.route?.params?.trig?.allProfessionMain)
                    : "",
        };

        if (props?.route?.params?.trig?.request_type === 'stateconferences') {
            obj = {
                "pageno": requestedPageNum,
                "limit": limit,
                "search_speciality": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.count_specilaities)?.map(d => d?.count_specilaities).flat().length > 0
                    ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.count_specilaities)?.map(d => d?.count_specilaities).flat()
                    : props?.route?.params?.trig?.search_speciality ?? "",
                "conference_type_text": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.conf_types)?.map(d => d?.conf_types).flat().length > 0
                    ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.conf_types)?.map(d => d?.conf_types).flat()
                    : props?.route?.params?.trig?.conference_type_text ?? "",
                "cme_from": props?.route?.params?.filterDatSh?.minVal ? props?.route?.params?.filterDatSh?.minVal : props?.route?.params?.trig?.cme_from ?? "",
                "cme_to": props?.route?.params?.filterDatSh?.maxVal ? props?.route?.params?.filterDatSh?.maxVal : props?.route?.params?.trig?.cme_to ?? "",
                "organization": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.organizers_types)?.map(d => d?.organizers_types).flat().length > 0
                    ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.organizers_types)?.map(d => d?.organizers_types).flat()
                    : props?.route?.params?.trig?.organization ?? "",
                "price_from": props?.route?.params?.filterDatSh?.minValP ? props?.route?.params?.filterDatSh?.minValP : props?.route?.params?.trig?.price_from ?? "",
                "price_to": props?.route?.params?.filterDatSh?.maxValp ? props?.route?.params?.filterDatSh?.maxValp : props?.route?.params?.trig?.price_to ?? "",
                "startdate": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.date_types)?.map(d => d?.date_types).flat().length > 0
                    ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.date_types)?.map(d => d?.date_types).flat()
                    : props?.route?.params?.trig?.startdate ?? "",
                "location": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.location_types)?.map(d => d?.location_types).flat().length > 0
                    ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.location_types)?.map(d => d?.location_types).flat()
                    : props?.route?.params?.trig?.location ?? "",
                "free_conf": props?.route?.params?.filterDatSh?.selectedIt?.length > 0 ? props?.route?.params?.filterDatSh?.selectedIt?.find(item => item === "Free Courses") == "Free Courses" ? 1 : "" : props?.route?.params?.trig?.free_conf ?? "",
                "noncme": props?.route?.params?.filterDatSh?.selectedIt?.length > 0 ? props?.route?.params?.filterDatSh?.selectedIt?.find(item => item === "Non-CME Courses") == "Non-CME Courses" ? 1 : "" : props?.route?.params?.trig?.noncme ?? "",
                "speaker": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.speakers_types)?.map(d => d?.speakers_types).flat().length > 0
                    ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.speakers_types)?.map(d => d?.speakers_types).flat()
                    : props?.route?.params?.trig?.speaker ?? "",
                "search_mandate_states": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.mandate_states)?.map(d => d?.mandate_states).flat().length > 0
                    ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.mandate_states)?.map(d => d?.mandate_states).flat()
                    : props?.route?.params?.trig?.search_mandate_states ?? [],
                "search_topic": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.topic_types)?.map(d => d?.topic_types).flat().length > 0
                    ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.topic_types)?.map(d => d?.topic_types).flat()
                    : props?.route?.params?.trig?.search_topic ?? "",
                "search_profession": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.profession_types)?.map(d => d?.profession_types).flat().length > 0
                    ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.profession_types)?.map(d => d?.profession_types).flat()
                    : props?.route?.params?.trig?.search_profession ?? "",
                "credittype": props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.credit_types)?.map(d => d?.credit_types).flat().length > 0
                    ? props?.route?.params?.filterDatSh?.filterDatSh?.filter(d => d?.credit_types)?.map(d => d?.credit_types).flat()
                    : props?.route?.params?.trig?.credittype ?? "",
                "sort_type": requestedSortType || props?.route?.params?.trig?.sort_type || "",
                "searchKeyword": props?.route?.params?.trig?.searchKeyword ?? "",
                "request_type": "stateconferences",
                "country": props?.route?.params?.trig?.country ?? "usa-medical-conferences",
                "state": props?.route?.params?.trig?.state ?? "",
                "": ""
            };
        }
        connectionrequest()
            .then(() => {
                dispatch(cmeCourseRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
                setLoading(false);
            });
    }, [dispatch, limit, pageNum, props?.route?.params?.filterDatSh, props?.route?.params?.trig, sortType]);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            if (!hasFocusedOnceRef.current) {
                hasFocusedOnceRef.current = true;
                return;
            }

            if (isGuestFlow) {
                resetResultsView({ loadingState: true });
                fetchHandle(undefined, { pageNum: 0, sortType });
                return;
            }

            if (props?.route?.params?.trig?.Realback === "cont") {
                resetResultsView({ loadingState: true });
                fetchHandle(undefined, { pageNum: 0 });
            }
        });
        return unsubscribe;
    }, [fetchHandle, isGuestFlow, props.navigation, props?.route?.params?.trig, resetResultsView, sortType]);

    const fetchMore = useCallback(() => {
        if (!apiReq && !loading && canLoadMore && CMEReducer?.cmeCourseResponse?.conferences?.length > 0) {
            const nextPage = pageNum + 1;
            setPageNum(nextPage);
            fetchHandle(undefined, { pageNum: nextPage });
        }
    }, [apiReq, canLoadMore, loading, pageNum, CMEReducer?.cmeCourseResponse?.conferences?.length, fetchHandle]);

    const fullDataRefresh = () => {
        resetResultsView({ loadingState: true });
        setRefreshing(true);
        fetchHandle(undefined, { pageNum: 0 });
    };
    const handleUrl = (onlineName) => {
        const url = onlineName?.detailpage_url;
        if (!url) {
            return;
        }
        const result = url.split('/').pop();
        console.log(result, "webcast url=======", onlineName);
        let obj = {
            "conference_id": onlineName?.id,
            "action_type": "view",
            "status": 1
        }
        connectionrequest()
            .then(() => {
                dispatch(ConfActRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
        });
        if (result) {
            const resolvedRealback =
                props?.route?.params?.trig?.Realback ||
                props?.route?.params?.filterDatSh?.returnTake?.trig?.Realback ||
                props?.route?.params?.filterDatSh?.returnTake?.webCastURL?.Realback ||
                (isGuestFlow ? 'guest' : undefined);

            props.navigation.navigate("Statewebcast", {
                webCastURL: {
                    webCastURL: result,
                    shareUrl: url,
                    creditData: props?.route?.params?.trig?.creditData || props?.route?.params?.trig?.creditAll || props?.route?.params?.filterDatSh?.returnTake?.trig?.creditAll,
                    Realback: resolvedRealback
                }
            })
        }
    }

    useEffect(() => {
        if (!CMEReducer.status || requestStatusRef.current === CMEReducer.status) {
            return;
        }

        requestStatusRef.current = CMEReducer.status;

        switch (CMEReducer.status) {
            case 'CME/cmeCourseRequest':
                setApiReq(true);
                setLoading(true);
                break;
            case 'CME/cmeCourseSuccess':
                setApiReq(false);
                setLoading(false);
                setHasFetchedResults(true);
                setRefreshing(false);
                setDisplayedRouteQueryKey(routeQueryKey);
                if (CMEReducer?.cmeCourseResponse?.conferences?.length > 0) {
                    if (pageNum === 0) {
                        setStoreAlldata(CMEReducer?.cmeCourseResponse?.conferences);
                    } else {
                        let modifiedData = [
                            ...storeAlldata,
                            ...CMEReducer?.cmeCourseResponse?.conferences,
                        ]?.filter(
                            (value, index, self) =>
                                index === self.findIndex(t => t?.id === value?.id),
                        );
                        setStoreAlldata(modifiedData);
                    }
                } else if (CMEReducer?.cmeCourseResponse?.conferences?.length == 0) {
                    if (pageNum === 0) setStoreAlldata([]);
                    setApiReq(false);
                    setLoading(false);
                }
                break;
            case 'CME/cmeCourseFailure':
                setPageNum(0);
                setApiReq(false);
                setLoading(false);
                setHasFetchedResults(true);
                setRefreshing(false);
                setDisplayedRouteQueryKey(routeQueryKey);
                break;
        }
    }, [CMEReducer.status, CMEReducer?.cmeCourseResponse, pageNum, routeQueryKey, storeAlldata]);
    const searchGlobalitem = ({ item, index }) => {
        const buttonLabel = getResultButtonLabel(item);
        const priceLabel = getResultPriceLabel(item);
        const guestCreditLabel = getResultCreditLabel(item);
        const guestTypeLabel = getResultTypeLabel(item);
        const guestPrimaryLabel = guestCreditLabel;
        const guestSecondaryLabel = guestTypeLabel;
        const hasBottomRow = Boolean(buttonLabel || priceLabel);
        const formatDate = (dateStr) => {
            const date = moment(dateStr, "DD MMM'YY");
            return date.format("MMM  D").replace(' ', '');
        };
        const formattedDate = formatDate(item?.startdate);
        const formatDateEnd = (dateStr) => {
            const date = moment(dateStr, "DD MMM'YY");
            return date.format("MMM D, YYYY").replace('', '');
        };
        const formattedDateend = formatDateEnd(item?.enddate);
        const renderLocationAndDates = () => {
            if (item?.startdate && item?.enddate && item?.location) {
                return (
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={Imagepath.WrongCal}
                            style={{ height: normalize(15), width: normalize(15), resizeMode: "contain" }}
                        />
                        <Text
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 14,
                                color: "#333",
                                bottom: normalize(1),
                                marginLeft: normalize(5),
                                width: normalize(220),
                                lineHeight: normalize(15)
                            }}
                        >
                            {`${FormatDateZone(item?.startdate, item?.enddate)} | ${item?.location}`}
                        </Text>
                    </View>
                );
            } else if (item?.startdate && item?.enddate) {
                return (
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={Imagepath.CalImg}
                            style={{ height: normalize(15), width: normalize(15), resizeMode: "contain" }}
                        />
                        <Text
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 14,
                                color: "#333",
                                marginLeft: normalize(5),
                                lineHeight: normalize(15)
                            }}
                        >
                            {`${FormatDateZone(item?.startdate, item?.enddate)}`}
                        </Text>
                    </View>
                );
            } else if (item?.location) {
                return (
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={Imagepath.MapPin}
                            style={{ height: normalize(15), width: normalize(15), resizeMode: "contain" }}
                        />
                        <Text
                            style={{
                                fontFamily: Fonts.InterMedium,
                                fontSize: 14,
                                color: "#333",
                                lineHeight: normalize(15)
                            }}
                        >
                            {item?.location}
                        </Text>
                    </View>
                );
            }
            return null;
        };
        return (
            <View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(isGuestFlow ? 8 : 10) }}>
                    <TouchableOpacity onPress={() => { handleUrl(item) }}>
                        <View
                            style={isGuestFlow ? styles.guestResultCard : {
                                flexDirection: "column",
                                width: normalize(290),
                                borderRadius: normalize(10),
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: normalize(10),
                                paddingVertical: normalize(5),
                                borderColor: "#DADADA",
                                borderWidth: 0.8
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: isGuestFlow ? '100%' : '106%'
                                }}>
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        <View>
                                            <Text
                                                style={isGuestFlow ? styles.guestResultTitle : {
                                                    fontFamily: Fonts.InterSemiBold,
                                                    fontSize: 16,
                                                    color: "#000000",
                                                    fontWeight: "bold",
                                                    flexWrap: 'wrap',
                                                    lineHeight: 20,
                                                }}
                                                numberOfLines={2}
                                                ellipsizeMode="tail"
                                            >
                                                {item?.title}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ justifyContent: "flex-start", alignItems: "flex-start", paddingVertical: normalize(4) }}>
                                <Text style={isGuestFlow ? styles.guestResultOrg : { fontFamily: Fonts.InterMedium, fontSize: 14, color: "#999999" }}>{item?.organization_name}</Text>
                            </View>
                            {(item?.startdate || item?.enddate || item?.location) && (<View style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row", paddingVertical: normalize(4) }}>
                                {renderLocationAndDates()}
                            </View>)}
                            {(guestCreditLabel || guestTypeLabel) ? (
                                <View style={{ paddingVertical: normalize(4) }}>
                                    <Text style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        color: '#666666',
                                        lineHeight: 20
                                    }}>
                                        {guestCreditLabel}
                                        {guestCreditLabel && guestTypeLabel ? '  |  ' : ''}
                                        {guestTypeLabel}
                                    </Text>
                                </View>
                            ) : null}
                            {hasBottomRow && <View style={isGuestFlow ? styles.guestResultDivider : { height: 0.8, width: normalize(273), backgroundColor: "#DADADA", marginTop: normalize(5) }} />}
                            {!hasBottomRow ? null : <View style={isGuestFlow ? styles.guestResultPriceRow : { flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", alignItems: "center", marginTop: normalize(3) }}>
                                <View style={isGuestFlow ? styles.guestResultPrimaryWrap : { flex: 1, justifyContent: 'center' }}>
                                    {buttonLabel ? (
                                        <Text
                                            numberOfLines={1}
                                            style={isGuestFlow ? styles.guestResultButtonText : { fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000", fontWeight: "bold" }}
                                        >
                                            {buttonLabel}
                                        </Text>
                                    ) : null}
                                </View>
                                {(buttonLabel && priceLabel) ? (
                                    <Text style={isGuestFlow ? styles.guestResultPipe : { marginHorizontal: normalize(10), fontFamily: Fonts.InterBold, fontSize: 16, color: "#9CA3AF", fontWeight: "bold", textAlign: "center" }}>
                                        |
                                    </Text>
                                ) : null}
                                <View style={isGuestFlow ? styles.guestResultSecondaryWrap : { flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    {priceLabel ? (
                                        <Text numberOfLines={1} style={isGuestFlow ? styles.guestResultPrice : { fontFamily: Fonts.InterBold, fontSize: 16, color: Colorpath.ButtonColr, fontWeight: "bold" }}>
                                            {priceLabel}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };
    const handleGuestProfessionSelect = profession => {
        setCmeModalVisible(false);
        setAllProfessionData(null);
        setHandledCmeRequestKey('');
        setCmeRequestStarted(false);
        setShouldOpenCmeChecklist(false);
        resetResultsView({ clearSort: true });
        setStateSearchText('');
        setProfModalVisible(false);

        setSelectedProfession(profession);
        if (getStateId(selectedState) != null && profession) {
            setShouldOpenCmeChecklist(true);
        }
    };
    const handleGuestStateSelect = stateObj => {
        setCmeModalVisible(false);
        setAllProfessionData(null);
        setHandledCmeRequestKey('');
        setCmeRequestStarted(false);
        setShouldOpenCmeChecklist(false);
        resetResultsView({ clearSort: true });
        setStateModalVisible(false);
        setStateSearchText('');

        setSelectedState(stateObj);
        if (selectedProfession && getStateId(stateObj) != null) {
            setShouldOpenCmeChecklist(true);
        }
    };
    const handleGuestBrowseCourses = params => {
        setCmeModalVisible(false);
        setSortedFall(false);
        resetResultsView({ clearSort: true, routeKey: '' });
        props.navigation.replace('Globalresult', params);
    };
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, [props.navigation]);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn == false ? <IntOff /> : <SafeAreaView style={{ flex: 1, backgroundColor: isGuestFlow ? '#DCEBFA' : Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title="Search Results"
                            onBackPress={SearchBack}
                        />
                    ) : (
                        <PageHeader
                            title="Search Results"
                            onBackPress={SearchBack}
                        />

                    )}
                </View>
                <Loader visible={isRouteRefreshing || (loading && storeAlldata?.length === 0) || shouldOpenCmeChecklist} />
                {isGuestCmeFlow && (
                    <View style={styles.guestTopSection}>
                        <View style={styles.guestSelectorCard}>
                            <TouchableOpacity
                                style={styles.guestSelectorCell}
                                onPress={() => setProfModalVisible(true)}
                            >
                                <Text style={styles.guestSelectorLabel}>Profession</Text>
                                <View style={styles.guestSelectorValueRow}>
                                    <Text style={styles.guestSelectorValue} numberOfLines={1}>
                                        {selectedProfession || 'Select Profession'}
                                    </Text>
                                    <Icon name="keyboard-arrow-down" size={20} color={Colorpath.ButtonColr} />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.guestSelectorDivider} />
                            <TouchableOpacity
                                style={styles.guestSelectorCell}
                                onPress={() => {
                                    dispatch(stateRequest(1));
                                    setStateSearchText('');
                                    setStateModalVisible(true);
                                }}
                            >
                                <Text style={styles.guestSelectorLabel}>State</Text>
                                <View style={styles.guestSelectorValueRow}>
                                    <Text style={styles.guestSelectorValue} numberOfLines={1}>
                                        {getStateLabel(selectedState) || 'Select State'}
                                    </Text>
                                    <Icon name="keyboard-arrow-down" size={20} color={Colorpath.ButtonColr} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {!isRouteRefreshing && storeAlldata?.length > 0 && (
                    <>
                        <TouchableOpacity
                            onPress={() => {
                                setPageNum(0);
                                setSortedFall(!sortedFall);
                            }}
                            style={isGuestFlow ? styles.guestSummaryWrap : { paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}
                        >
                            <View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: 'center' }}>
                                <Text style={[
                                    isGuestFlow ? styles.guestSummaryText : { fontFamily: Fonts.InterMedium, fontSize: 16, color: "#333" },
                                    { marginBottom: 0 }
                                ]}>
                                    {`Showing (${totalResults || ""}) Results for`}
                                </Text>
                                <View style={[styles.guestSortWrap, { paddingTop: 0, alignItems: 'center' }]}>
                                    <Text style={isGuestFlow ? styles.guestSortText : { fontFamily: Fonts.InterMedium, fontSize: 16, color: "#333" }}>Sort By</Text>
                                    <Image source={Imagepath.SortedPng} style={{ height: normalize(18), width: normalize(18), resizeMode: "contain", marginLeft: normalize(8) }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        {isGuestFlow && CMEReducer?.cmeCourseResponse?.header_title ? (
                            <View style={{ paddingHorizontal: normalize(14), marginTop: normalize(-4), marginBottom: normalize(8) }}>
                                <Text style={styles.guestSummaryTitle}>
                                    {CMEReducer?.cmeCourseResponse?.header_title}
                                </Text>
                            </View>
                        ) : null}
                    </>
                )}
                {!isRouteRefreshing && !isGuestFlow && CMEReducer?.cmeCourseResponse?.header_title && storeAlldata?.length > 0 && (
                    <View style={{ paddingHorizontal: normalize(10), marginTop: normalize(-10), paddingVertical: normalize(5) }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 24, color: Colorpath.ButtonColr }}>
                            {CMEReducer?.cmeCourseResponse?.header_title}
                        </Text>
                    </View>
                )}
                <View style={{ flex: 1 }}>
                    <FlatList
                        style={{ flex: 1 }}
                        key={`results-${routeQueryKey}-${selectedProfession || 'none'}-${getStateId(selectedState) || 'none'}`}
                        data={isRouteRefreshing ? [] : storeAlldata}
                        renderItem={searchGlobalitem}
                        keyExtractor={(item, index) => String(item?.id ?? item?.detailpage_url ?? index)}
                        onEndReached={fetchMore}
                        onEndReachedThreshold={0.3}
                        contentContainerStyle={isGuestFlow ? styles.guestListContent : { paddingBottom: normalize(200) }}
                        scrollEventThrottle={16}
                        ListFooterComponent={
                            loading ? <ActivityIndicator color={Colorpath.ButtonColr} size="large" /> : null
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={fullDataRefresh}
                            />
                        }
                        ListEmptyComponent={!isRouteRefreshing && hasFetchedResults && !loading &&
                            <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(25) }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        // height: normalize(83),
                                        width: normalize(290),
                                        borderRadius: normalize(10),
                                        backgroundColor: "#FFFFFF",
                                        paddingHorizontal: normalize(10),
                                        paddingVertical: normalize(10),
                                        alignItems: "center",
                                        borderStyle: 'dotted',
                                        borderWidth: 1,
                                    }}
                                >
                                    <View style={{ flex: 1, justifyContent: "center" }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 16,
                                                color: Colorpath.ButtonColr,
                                                fontWeight: "bold",
                                                alignSelf: "center"
                                            }}
                                        >
                                            {"There are no matches available for your search criteria. Please change the criteria and try again."}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        } />
                </View>
                <Modal
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    isVisible={sortedFall}
                    backdropColor={Colorpath.black}
                    style={{
                        width: '100%',
                        alignSelf: 'center',
                        margin: 0,
                    }}
                    onBackdropPress={() => setSortedFall(false)}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setSortedFall(false)}>

                        <View
                            style={props?.route?.params?.trig?.newCt ? {
                                borderRadius: normalize(7),
                                height: sortModalHeight,
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                backgroundColor: '#fff',
                            } : {
                                borderRadius: normalize(7),
                                height: sortModalHeight,
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                backgroundColor: '#fff',
                            }}>
                            <FlatList
                                contentContainerStyle={{
                                    paddingBottom: normalize(12),
                                    paddingTop: normalize(7),
                                }}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={item => item.id.toString()}
                                data={sortOptions}
                                renderItem={({ item }) => {
                                    const handlePress = (dd) => {
                                        fetchHandle(dd, { pageNum: 0, sortType: dd?.type });
                                        setPageNum(0);
                                        setSortType(dd?.type);
                                        setSortedFall(false);
                                        setStoreAlldata([]);
                                    };

                                    return (
                                        <TouchableOpacity
                                            onPress={() => { handlePress(item) }}
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
                {CMEReducer?.cmeCourseResponse?.aggregations && storeAlldata?.length > 0 && <View style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 0,
                    paddingHorizontal: normalize(20),
                    zIndex: 999
                }}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate("FilterScreen", { wholeDats: { wholeDats: CMEReducer?.cmeCourseResponse?.aggregations, mainKeyAll: props?.route?.params?.trig ? props?.route?.params : props?.route?.params?.filterDatSh?.returnTake, ClearText: props?.route?.params?.filterDatSh?.filterDatSh, takeTrue: props?.route?.params?.filterDatSh?.selectedItem, PriceDrop: { minget: props?.route?.params?.filterDatSh?.minVal, maxget: props?.route?.params?.filterDatSh?.maxVal, mingetp: props?.route?.params?.filterDatSh?.minValP, maxgetp: props?.route?.params?.filterDatSh?.maxValp, CME: props?.route?.params?.filterDatSh?.selectedIt } } });
                    }} style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        height: normalize(50),
                        width: normalize(50),
                        backgroundColor: Colorpath.ButtonColr,
                        borderWidth: 0.5,
                        borderColor: "#AAAAAA",
                        borderRadius: normalize(50),
                        paddingHorizontal: normalize(15)
                    }}>
                        <Image source={Imagepath.Filter} style={{ height: normalize(18), width: normalize(18), resizeMode: "contain", alignSelf: "center", tintColor: "#FFFFFF" }} />
                    </TouchableOpacity>
                </View>}
                <Modal
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    isVisible={profModalVisible}
                    onBackdropPress={() => setProfModalVisible(false)}
                    style={styles.centerModal}
                >
                    <View style={styles.choiceModalCard}>
                        <Text style={styles.choiceModalTitle}>Select Profession</Text>
                        {['Physician', 'Nursing', 'Dentist', 'Pharmacist'].map(prof => (
                            <TouchableOpacity
                                key={prof}
                                onPress={() => handleGuestProfessionSelect(prof)}
                                style={styles.choiceModalItem}
                            >
                                <Text style={styles.choiceModalItemText}>{prof}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Modal>
                <Modal
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    isVisible={stateModalVisible}
                    onBackdropPress={() => setStateModalVisible(false)}
                    style={styles.bottomModal}
                >
                    <View style={styles.stateModalCard}>
                        <Text style={styles.choiceModalTitle}>Select State</Text>
                        <TextInput
                            value={stateSearchText}
                            onChangeText={setStateSearchText}
                            placeholder="Search state"
                            placeholderTextColor="#9CA3AF"
                            style={styles.stateSearchInput}
                        />
                        <FlatList
                            data={filteredStateList}
                            keyExtractor={(item, index) => String(item?.id ?? item?.state_id ?? item?.name ?? index)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleGuestStateSelect(item)}
                                    style={styles.choiceModalItem}
                                >
                                    <Text style={styles.choiceModalItemText}>{getStateLabel(item)}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyStateText}>No states found</Text>
                            }
                        />
                    </View>
                </Modal>
                <CMEChecklistModal
                    allProfessionData={allProfessionData}
                    setAllProfessionData={setAllProfessionData}
                    onCMEClose={() => setCmeModalVisible(false)}
                    onSaved={() => setCmeModalVisible(false)}
                    isVisibelCME={cmeModalVisible}
                    allProfession={selectedProfession}
                    certificatedata={{ state_id: getStateId(selectedState) }}
                    selectedState={selectedState}
                    cmeRealback="guest"
                    onBrowseCourses={handleGuestBrowseCourses}
                />
            </SafeAreaView>}
        </>
    )
}

export default Globalresult
const styles = StyleSheet.create({
    guestTopSection: {
        paddingHorizontal: normalize(14),
        paddingTop: normalize(12),
        paddingBottom: normalize(6),
    },
    guestSelectorCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(10),
        paddingHorizontal: normalize(14),
        paddingVertical: normalize(10),
        flexDirection: 'row',
        alignItems: 'center',
    },
    guestSelectorCell: {
        flex: 1,
    },
    guestSelectorDivider: {
        width: 1,
        alignSelf: 'stretch',
        backgroundColor: '#E5E7EB',
        marginHorizontal: normalize(12),
        borderStyle: 'dashed',
    },
    guestSelectorLabel: {
        fontSize: 12,
        color: '#8C8C8C',
        fontFamily: Fonts.InterMedium,
        marginBottom: normalize(4),
    },
    guestSelectorValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    guestSelectorValue: {
        flex: 1,
        color: Colorpath.ButtonColr,
        fontSize: 16,
        fontFamily: Fonts.InterSemiBold,
        marginRight: normalize(4),
    },
    guestSummaryWrap: {
        paddingHorizontal: normalize(14),
        paddingTop: normalize(12),
        paddingBottom: normalize(8),
    },
    guestSummaryText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 15,
        color: '#333333',
        marginBottom: normalize(4),
    },
    guestSummaryTitle: {
        fontFamily: Fonts.InterBold,
        fontSize: 22,
        color: Colorpath.ButtonColr,
    },
    guestSortWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: normalize(6),
    },
    guestSortText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 16,
        color: '#333333',
    },
    guestListContent: {
        paddingHorizontal: normalize(14),
        paddingBottom: normalize(200),
        alignItems: 'center',
    },
    guestResultCard: {
        flexDirection: 'column',
        width: Dimensions.get('window').width - normalize(28),
        borderRadius: normalize(12),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: normalize(14),
        paddingVertical: normalize(8),
        borderColor: '#DADADA',
        borderWidth: 0.8,
    },
    guestResultTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 16,
        color: "#111111",
        fontWeight: "bold",
        flexWrap: 'wrap',
        lineHeight: 22,
    },
    guestResultOrg: {
        fontFamily: Fonts.InterMedium,
        fontSize: 14,
        color: "#999999",
    },
    guestResultDivider: {
        height: 1,
        width: '100%',
        backgroundColor: "#DADADA",
        marginTop: normalize(6),
    },
    guestResultPriceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: normalize(10),
    },
    guestResultPrimaryWrap: {
        flex: 1,
        justifyContent: 'center',
        minWidth: 0,
    },
    guestResultSecondaryWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        minWidth: 0,
    },
    guestResultPrice: {
        fontFamily: Fonts.InterBold,
        fontSize: 15,
        color: Colorpath.ButtonColr,
        flexShrink: 1,
        textAlign: 'right',
    },
    guestResultPipe: {
        marginHorizontal: normalize(8),
        fontFamily: Fonts.InterBold,
        fontSize: 18,
        color: '#9CA3AF',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: normalize(20),
    },
    guestResultButtonText: {
        marginRight: normalize(8),
        fontFamily: Fonts.InterSemiBold,
        fontSize: 15,
        color: '#111827',
        fontWeight: 'bold',
        flexShrink: 1,
    },
    centerModal: {
        justifyContent: 'center',
        margin: 0,
        paddingHorizontal: normalize(20),
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    choiceModalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(16),
        padding: normalize(16),
    },
    stateModalCard: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: normalize(18),
        borderTopRightRadius: normalize(18),
        padding: normalize(16),
        maxHeight: '78%',
    },
    choiceModalTitle: {
        fontSize: 18,
        color: '#111111',
        fontFamily: Fonts.InterSemiBold,
        marginBottom: normalize(12),
    },
    choiceModalItem: {
        paddingVertical: normalize(12),
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    choiceModalItemText: {
        fontSize: 16,
        color: '#333333',
        fontFamily: Fonts.InterMedium,
    },
    stateSearchInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: normalize(10),
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(10),
        marginBottom: normalize(12),
        color: '#111827',
    },
    emptyStateText: {
        color: '#6B7280',
        textAlign: 'center',
        paddingVertical: normalize(16),
        fontFamily: Fonts.InterMedium,
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
