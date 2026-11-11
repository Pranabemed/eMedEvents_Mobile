/**
 * Speciality course screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, SpecialityCourseSlide, openFilterModal, toggleDrawerModal, addCreditBack, handleSave, titlhandleUrl, stateDashboardData, toggleSpecial, onBackPress, RequiredCourses, getActualPrice.
 */

import { View, Text, Platform, TouchableOpacity, Image, FlatList, ScrollView, BackHandler, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import PageHeader from '../../Components/PageHeader'
import Colorpath from '../../Themes/Colorpath'
import MyStatusBar from '../../Utils/MyStatusBar'
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts'
import Imagepath from '../../Themes/Imagepath';
import ArrowIcons from 'react-native-vector-icons/MaterialIcons';
import FilterModal from '../../Components/Filter';
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native'
import StarRating from 'react-native-star-rating-widget';
import { useDispatch, useSelector } from 'react-redux'
import { object } from 'prop-types'
import connectionrequest from '../../Utils/Helpers/NetInfo'
import { mainprofileRequest, specailtyRequest, stateDashboardRequest } from '../../Redux/Reducers/DashboardReducer'
import showErrorAlert from '../../Utils/Helpers/Toast';
import Loader from '../../Utils/Helpers/Loader'
import Tooltip from 'react-native-walkthrough-tooltip'
import { AppContext } from '../GlobalSupport/AppContext'
import DrawerModal from '../../Components/DrawerModal';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff'
import { SafeAreaView } from 'react-native-safe-area-context'
/**
 * Status string constant.
 * @returns {string}
 */
let status = "";
// import { GestureHandlerRootView } from 'react-native-gesture-handler'

/**
 * Reusable SpecialityCourseSlide component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
const SpecialityCourseSlide = (props) => {
    const { takestate, addit, isConnected, fulldashbaord, setAddit } = useContext(AppContext);
    const [visible, setVisible] = useState(false);
    const [nodata, setNodata] = useState("drawerclose");
    const [filtermodal, setFiltermodal] = useState(false);
    const [filterName, setFilterName] = useState("");
    const [acivityformat, setAcivityformat] = useState("");
    const [filtermonth, setFiltermonth] = useState("");
    const [stateFiltered, setStateFiltered] = useState([]);
    const [activity, setActivity] = useState([]);
    const [month, setMonth] = useState([]);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [tooltip, setTootip] = useState(false);
    const DashboardReducer = useSelector(state => state.DashboardReducer);
    console.log(DashboardReducer, "finaltake------------------", takestate, addit);
    const [filterstate, setFilterstate] = useState(null);
    const [finalData, setFinalData] = useState("");
    const [stateid, setStateid] = useState("");
    const [handle, setHandle] = useState(null);
    const [viewmore, setViewmore] = useState(false);
    const [servetextsp, setServetextsp] = useState(false);
    const isFocus = useIsFocused();
    console.log(filterstate, "handle=======", filterstate?.length);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const filtermodalRef = useRef(filtermodal);
    const visibleRef = useRef(visible);

    useEffect(() => {
        filtermodalRef.current = filtermodal;
    }, [filtermodal]);

    useEffect(() => {
        visibleRef.current = visible;
    }, [visible]);

        /**
 * Open filter modal utility.
 * @returns {void}
 */
const openFilterModal = () => {
        setFiltermodal(true);
        setViewmore(false);
    }
const closeFilterModal = () => {
        setFiltermodal(false);
    }
        /**
 * Toggle drawer modal utility.
 * @returns {void}
 */
const toggleDrawerModal = () => {
        setVisible(!visible);
        setNodata("drawerclose");
    };
        /**
 * Add credit back utility.
 * @returns {void}
 */
const addCreditBack = () => {
        const getAda = fulldashbaord?.[0];
        setAddit(getAda);
        if (props?.route?.params?.back == "tabnav") {
            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "TabNav", params: { initialRoute: "Home" } }] }))
        } else {
            toggleDrawerModal();
        }
    }

    const handleBackPress = () => {
        if (filtermodalRef.current) {
            setFiltermodal(false);
            return;
        }
        if (visibleRef.current) {
            setVisible(false);
            setNodata("drawerclose");
            return;
        }
        addCreditBack();
    };
    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(mainprofileRequest({}))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }, [isFocus])
        /**
 * Handles save.
 * @returns {void}
 */
const handleSave = () => {
        console.log("Selected Filter Name: ", filterName);
        setFiltermodal(false);
    };
    console.log(filterName, "jdjfjjjj")
    useEffect(() => {
        const states = DashboardReducer?.mainprofileResponse?.specialities;
        console.log(states, "states=======")
        if (states && typeof states === 'object' && Object.keys(states).length > 0) {
            const convertData = Object.entries(states).map(([key, val]) => ({ id: key, name: val }));
            setFilterstate(convertData);
        }
    }, [DashboardReducer]);
        /**
 * Titlhandle url utility.
 * @param {*} make - Input value.
 * @returns {void}
 */
const titlhandleUrl = (make) => {
        const urltitle = make?.detailpage_url;
        const resulttitle = urltitle.split('/').pop();
        console.log(resulttitle, "webcast url=======", make);
        if (resulttitle) {
            props.navigation.navigate("Statewebcast", { webCastURL: { webCastURL: resulttitle, creditData: addit } })
        }
    }
    useEffect(() => {
        if (stateid) {
            stateDashboardData();
        }
    }, [stateid])
        /**
 * State dashboard data utility.
 * @returns {void}
 */
const stateDashboardData = () => {
        let obj = {
            "speciality": filterName
        }
        connectionrequest()
            .then(() => {
                dispatch(specailtyRequest(obj));
            })
            .catch(err => { showErrorAlert("Please connect to internet", err) })
    }
        /**
 * Toggle special utility.
 * @returns {void}
 */
const toggleSpecial = () => {
        setViewmore(!viewmore)
    }
    if (status == '' || DashboardReducer.status != status) {
        switch (DashboardReducer.status) {
            case 'Dashboard/specailtyRequest':
                status = DashboardReducer.status;
                setServetextsp(false);
                break;
            case 'Dashboard/specailtySuccess':
                status = DashboardReducer.status;
                setServetextsp(true);
                setFinalData(DashboardReducer?.specailtyResponse?.data?.specialty_courses);
                console.log(DashboardReducer?.specailtyResponse?.data?.specialty_courses, "mainprofileRespons===========")
                break;
            case 'Dashboard/mainprofileFailure':
                status = DashboardReducer.status;
                setServetextsp(true);
                break;
        }
    }
    useEffect(() => {
                /**
 * On back press utility.
 * @returns {boolean}
 */
const onBackPress = () => {
            if (filtermodalRef.current) {
                setFiltermodal(false);
                return true;
            }
            if (visibleRef.current) {
                setVisible(false);
                setNodata("drawerclose");
                return true;
            }
            addCreditBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);
    useLayoutEffect(() => {
        props.navigation.setOptions({ gestureEnabled: false });
    }, []);
        /**
 * Required courses component.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const RequiredCourses = ({ item, index }) => {
        /**
         * Returns actual price before Prime discount.
         * @param {number} percent - Discount ratio (0..1).
         * @param {string|number} discountPrice - Discounted price.
         * @returns {number|null}
         */
        const getActualPrice = (percent, discountPrice) => {
            if (!discountPrice || percent <= 0 || percent >= 1) return null;
            const price = parseFloat(String(discountPrice).replace(/,/g, ""));
            return Number.isFinite(price) ? Math.round(price / (1 - percent)) : null;
        };

        const discountPercentage = +item?.emed_commission || 0;
        const actualPrice = getActualPrice(discountPercentage / 100, item?.display_price);
        const currencyCode = item?.display_currency_code ?? '';
        const hasPopoverCme = Array.isArray(item?.cme_points_popovar) && item?.cme_points_popovar?.length > 0;
        const formattedCme = item?.display_cme
            ? item.display_cme.toLowerCase().includes("contact hour")
                ? item.display_cme.replace(/contact hour/i, "Contact Hour(s)")
                : item.display_cme
            : "";

        return (
            <View style={styles.cardWrapper}>
                <View style={styles.courseCard}>
                    <View style={styles.cardTitleRow}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => { titlhandleUrl(item) }}>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={styles.cardTitle}
                            >
                                {item?.title}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ratingBundleRow}>
                        <View style={styles.inlineMetaGroup}>
                            <Text style={styles.ratingLabel}>{"Ratings:"}</Text>
                            <View pointerEvents="none">
                                <StarRating
                                    rating={Number(item?.average_rating) || 0}
                                    onChange={() => { }}
                                    starSize={13}
                                    starStyle={{ marginHorizontal: 0.5 }}
                                />
                            </View>
                        </View>
                        {item?.bundle_sub_conf_count ? (
                            <View style={styles.inlineMetaGroup}>
                                <View style={styles.metaDivider} />
                                <Text style={styles.bundleText}>
                                    {`Course Bundle: ${item.bundle_sub_conf_count}`}
                                </Text>
                            </View>
                        ) : null}
                    </View>

                    {hasPopoverCme ? (
                        <TouchableOpacity
                            onPress={() => {
                                setTootip(!tooltip);
                                setHandle(item);
                            }}
                            style={styles.cmeBadge}
                        >
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cmeBadgeText}>
                                {`${item?.display_cme}...`}
                            </Text>
                        </TouchableOpacity>
                    ) : formattedCme ? (
                        <View style={styles.cmeBadge}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cmeBadgeText}>
                                {formattedCme}
                            </Text>
                        </View>
                    ) : null}

                    <View style={styles.cardBottomRow}>
                        <View style={styles.priceColumn}>
                            {!discountPercentage ? (
                                <View style={styles.priceValueRow}>
                                    <Text style={styles.priceText}>
                                        {`${currencyCode}${item?.display_price ?? ''}`}
                                    </Text>
                                </View>
                            ) : (
                                <>
                                    <View style={styles.primeOfferRow}>
                                        <Image source={Imagepath.TickMark} style={styles.tickIcon} />
                                        <Text numberOfLines={1} style={styles.primeOfferText}>
                                            {"Prime Offer"}
                                        </Text>
                                    </View>
                                    <View style={styles.priceValueRow}>
                                        <Text style={styles.discountPctText}>
                                            {`-${discountPercentage}%`}
                                        </Text>
                                        <Text style={styles.priceText}>
                                            {`${currencyCode}${item?.display_price ?? ''}`}
                                        </Text>
                                        {actualPrice !== null ? (
                                            <Text style={styles.strikePriceText}>
                                                {`${currencyCode}${actualPrice}`}
                                            </Text>
                                        ) : null}
                                    </View>
                                </>
                            )}
                        </View>
                        {item?.buttonText ? (
                            <TouchableOpacity onPress={() => { titlhandleUrl(item) }} style={styles.cardActionBtn}>
                                <Text numberOfLines={1} style={styles.cardActionText}>
                                    {item.buttonText}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
        )
    }
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <Loader visible={DashboardReducer?.status == 'Dashboard/specailtyRequest'} />

                {Platform.OS === 'ios' ? <PageHeader
                    title=""
                    onBackPress={handleBackPress}
                /> : <View>
                    <PageHeader
                        title=""
                        onBackPress={handleBackPress}
                    />
                </View>}
                {conn == false ? <IntOff /> : <ScrollView contentContainerStyle={{ paddingBottom: normalize(30) }}>
                    {filterstate?.length > 0 && (
                        <View style={styles.filterBar}>
                            {!filterName ? (
                                <Text style={styles.filterPlaceholderText}>
                                    {"Filters"}
                                </Text>
                            ) : (
                                <TouchableOpacity
                                    activeOpacity={filterstate?.length > 1 ? 0.75 : 1}
                                    disabled={filterstate?.length <= 1}
                                    onPress={openFilterModal}
                                    style={styles.selectedStatePill}
                                >
                                    <Text numberOfLines={1} style={styles.selectedStatePillText}>
                                        {filterName}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {filterstate?.length > 1 && (
                                <TouchableOpacity
                                    onPress={openFilterModal}
                                    style={styles.dropdownTriggerBtn}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <ArrowIcons
                                        name={filtermodal ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                        size={24}
                                        color="#000000"
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    <View style={styles.sectionDivider} />
                    {finalData?.length > 0 && (
                        <View style={styles.sectionHeaderWrap}>
                            <Text style={styles.sectionHeaderTitle}>
                                {`${filterName} Specialty Courses`}
                            </Text>
                        </View>
                    )}
                    <View>
                        <FlatList
                            scrollEnabled={false}
                            data={finalData?.slice(0, 3)}
                            renderItem={RequiredCourses}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={servetextsp &&
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <View style={{
                                        height: normalize(50),
                                        width: normalize(310),
                                        alignItems: 'center',
                                        borderStyle: 'dotted',
                                        borderWidth: 1,
                                        borderRadius: 1,
                                        borderColor: "#000000",
                                        backgroundColor: "#FFFFFF"
                                    }}>
                                        <Text
                                            style={{
                                                alignContent: 'center',
                                                alignItems: 'center',
                                                alignSelf: 'center',
                                                color: "#AAAAAA",
                                                fontWeight: 'bold',
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 14,
                                                paddingTop: normalize(8),
                                                paddingHorizontal: normalize(10)
                                                // textTransform: 'uppercase',
                                            }}>
                                            {`Our catalog currently does not include course(s) on ${filterName}.`}
                                        </Text>
                                    </View>
                                </View>

                            }
                            showsHorizontalScrollIndicator={false}
                        />
                        {finalData?.length > 3 && <FlatList
                            scrollEnabled={false}
                            data={viewmore ? finalData?.slice(3) : []}
                            renderItem={RequiredCourses}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={
                                <TouchableOpacity onPress={toggleSpecial}>
                                    <View style={{
                                        justifyContent: "flex-end",
                                        alignItems: "flex-end",
                                        width: "95%"
                                    }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 16,
                                                color: Colorpath.ButtonColr,
                                            }}>
                                            {viewmore ? "View less" : "View more"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        />}
                    </View>
                    <Tooltip
                        isVisible={tooltip}
                        content={
                            <View style={{ flexGrow: 1, width: normalize(260) }}>
                                {handle?.cme_points_popovar?.length > 0 ? (
                                    handle?.cme_points_popovar?.map((d, index) => (
                                        <Text
                                            key={index}
                                            style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#000" }}
                                        >
                                            {`${parseFloat(d?.points) || 0} ${d?.name &&
                                                d?.name?.toLowerCase() == "contact hour"
                                                ? "Contact Hour(s)"
                                                : d?.name || ""
                                                }`}
                                        </Text>
                                    ))
                                ) : null}
                            </View>
                        }
                        placement="center"
                        onClose={() => setTootip(false)}
                    >
                    </Tooltip>
                    <FilterModal
                        isfilterVisible={filtermodal}
                        onfilterFalse={closeFilterModal}
                        filterName={filterName}
                        setFilterName={setFilterName}
                        setStateid={setStateid}
                        stateid={stateid}
                        setAcivityformat={setAcivityformat}
                        acivityformat={acivityformat}
                        setFiltermonth={setFiltermonth}
                        filtermonth={filtermonth}
                        stateFiltered={stateFiltered}
                        setStateFiltered={setStateFiltered}
                        activity={activity}
                        setActivity={setActivity}
                        month={month}
                        setMonth={setMonth}
                        onSave={handleSave}
                        filterState={filterstate}
                        specaility={"text"}
                    />
                </ScrollView>}
            </SafeAreaView>
            <DrawerModal
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

const styles = StyleSheet.create({
    filterBar: {
        width: normalize(290),
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: normalize(8),
    },
    filterPlaceholderText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 16,
        color: '#000000',
    },
    selectedStatePill: {
        paddingHorizontal: normalize(14),
        paddingVertical: normalize(6),
        borderWidth: 0.6,
        borderColor: '#000000',
        borderRadius: normalize(20),
        backgroundColor: '#FFFFFF',
        alignSelf: 'flex-start',
        maxWidth: '82%',
    },
    selectedStatePillText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13.5,
        color: '#000000',
    },
    dropdownTriggerBtn: {
        padding: normalize(4),
        borderRadius: normalize(6),
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionDivider: {
        height: 0.8,
        width: normalize(290),
        alignSelf: 'center',
        backgroundColor: '#CCCCCC',
        marginBottom: normalize(8),
    },
    sectionHeaderWrap: {
        width: normalize(290),
        alignSelf: 'center',
        marginTop: normalize(2),
        marginBottom: normalize(4),
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(10),
        borderRadius: normalize(8),
        backgroundColor: '#142B5B',
    },
    sectionHeaderTitle: {
        fontFamily: Fonts.InterBold,
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 21,
        color: '#FFD08A',
    },
    cardWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: normalize(5),
    },
    courseCard: {
        flexDirection: 'column',
        width: normalize(290),
        borderRadius: normalize(10),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(10),
        alignItems: 'flex-start',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.14,
        shadowRadius: 2,
        elevation: 2,
    },
    cardTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
    },
    cardTitle: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 15,
        lineHeight: 20,
        color: '#000000',
        fontWeight: 'bold',
    },
    ratingBundleRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginTop: normalize(5),
        gap: normalize(6),
    },
    inlineMetaGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingLabel: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12.5,
        color: '#666666',
        fontWeight: 'bold',
        marginRight: normalize(4),
    },
    metaDivider: {
        width: 1,
        height: normalize(10),
        backgroundColor: Colorpath.ButtonColr,
        marginRight: normalize(6),
    },
    bundleText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12.5,
        color: '#666666',
        fontWeight: 'bold',
    },
    cmeBadge: {
        paddingHorizontal: normalize(9),
        paddingVertical: normalize(3),
        borderRadius: normalize(14),
        backgroundColor: '#FFF2E0',
        marginTop: normalize(6),
        alignSelf: 'flex-start',
        maxWidth: '100%',
    },
    cmeBadgeText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#555555',
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: normalize(8),
        width: '100%',
    },
    priceColumn: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        flex: 1,
        marginRight: normalize(8),
    },
    primeOfferRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tickIcon: {
        height: normalize(12),
        width: normalize(12),
        resizeMode: 'contain',
    },
    primeOfferText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 11.5,
        color: '#FF5D18',
        fontWeight: 'bold',
        marginLeft: normalize(4),
    },
    priceValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: normalize(2),
    },
    discountPctText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 12,
        color: '#EB5757',
        fontWeight: 'bold',
        marginRight: normalize(4),
    },
    priceText: {
        fontFamily: Fonts.InterSemiBold,
        fontSize: 13.5,
        color: '#000000',
        fontWeight: 'bold',
    },
    strikePriceText: {
        fontFamily: Fonts.InterRegular,
        fontSize: 11.5,
        fontStyle: 'italic',
        color: '#999999',
        marginLeft: normalize(5),
        textDecorationLine: 'line-through',
    },
    cardActionBtn: {
        height: normalize(30),
        minWidth: normalize(82),
        paddingHorizontal: normalize(10),
        borderRadius: normalize(6),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colorpath.ButtonColr,
        borderWidth: 0.8,
    },
    cardActionText: {
        fontFamily: Fonts.InterMedium,
        fontSize: 13.5,
        color: '#2C4DB9',
        textTransform: 'capitalize',
    },
});

/**
 * Speciality course default export.
 *
 * @returns {*}
 */
export default SpecialityCourseSlide
