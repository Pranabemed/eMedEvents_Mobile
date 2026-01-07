import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, TextInput, KeyboardAvoidingView, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import PageHeader from '../../Components/PageHeader';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import PriceSlider from './PriceSlider';
import { cmeCourseRequest } from '../../Redux/Reducers/CMEReducer';
import { useDispatch, useSelector } from 'react-redux';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import Loader from '../../Utils/Helpers/Loader';
import CreditPrice from './CreditPrice';
import { CommonActions } from '@react-navigation/native';
import { AppContext } from '../GlobalSupport/AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
let status = "";
import { SafeAreaView } from 'react-native-safe-area-context'

const FilterScreen = (props) => {
    const { isConnected } = useContext(AppContext);
    const [search, setSearch] = useState('');
    const [selectedFilter, setSelectedFilter] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const CMEReducer = useSelector(state => state.CMEReducer);
    const dispatch = useDispatch();
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const [minValue, setMinValue] = useState("");
    const [maxValue, setMaxValue] = useState("");
    const [minValuep, setMinValuep] = useState("");
    const [maxValuep, setMaxValuep] = useState("");
    const [filtertake, setFiltertake] = useState(null);
    const [combinedData, setCombinedData] = useState([]);
    const [selectedItm, setSelectedItm] = useState([]);
    const [resetOn, setResetOn] = useState(false);
    const [finalds, setFinalds] = useState(false);
    const [cmetype, setCmetype] = useState(null);
    const MIN_DEFAULT = filtertake?.get_cme_points_from_stat;
    const MIN_PMin = filtertake?.get_price_from_stat
    const Max_Price = filtertake?.get_price_to_stat;
    const Min_DPrice = filtertake?.get_cme_points_to_stat
    const [slider1Min, setSlider1Min] = useState(MIN_PMin);
    const [slider1Max, setSlider1Max] = useState(Max_Price);
    const [slider2Min, setSlider2Min] = useState(MIN_DEFAULT);
    const [slider2Max, setSlider2Max] = useState(Min_DPrice);
    const FilterBack = () => {
        if (props?.route?.params?.wholeDats?.norm == "ghgh") {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: "TabNav"
                        }
                    ],
                }));
        } else if (selectedItems?.length > 0) {
            props.navigation.navigate("Globalresult", { filterDatSh: { filterDatSh: selectedItems, returnTake: props?.route?.params?.wholeDats?.mainKeyAll, selectedIt: selectedItm, minVal: minValue, maxVal: maxValue, minValP: minValuep, maxValp: maxValuep, selectedItem: selectedFilter } })
        } else {
            props.navigation.goBack();
        }
    };
    useEffect(() => {
        const initialData = props?.route?.params?.wholeDats?.ClearText || [];
        setSelectedItems(initialData);
    }, [props?.route?.params?.wholeDats?.ClearText]);
    console.log(props?.route?.params, "props--------------", selectedFilter, selectedItems)

    useEffect(() => {
        if (props?.route?.params?.wholeDats?.wholeDats) {
            setFiltertake(props?.route?.params?.wholeDats?.wholeDats);
            const keys = Object.keys(props?.route?.params?.wholeDats?.wholeDats);
            const wholeDats = props?.route?.params?.wholeDats?.wholeDats || {};
            const availableKeys = [];
            const oneKeys = props?.route?.params?.wholeDats?.takeTrue || []
            if (keys?.length > 0) {
                keys.forEach(key => {
                    const value = wholeDats[key];
                    if (value !== undefined && value !== null && value !== "" && value !== 0 && !(Array.isArray(value) && value.length === 0)) {
                        availableKeys.push({ key, value });
                    }
                });
                const matchingKeys = availableKeys
                    .map(({ key }) => key)
                    .filter(key => oneKeys.includes(key));
                setSelectedFilter(
                    matchingKeys.length > 0
                        ? matchingKeys[0]
                        : (availableKeys.length > 0 ? availableKeys[0].key : null)
                );
            }
        }
    }, [props?.route?.params?.wholeDats?.wholeDats])
    const againHand = () => {
        const mainKey = props?.route?.params?.wholeDats?.mainKeyAll?.trig?.mainKey ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.mainKey ?? "";
        const stateKey = props?.route?.params?.wholeDats?.mainKeyAll?.trig?.newAdd ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.newAdd ?? "";
        const newCt = props?.route?.params?.wholeDats?.mainKeyAll?.trig?.newCt ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.newCt ?? "";
        let obj = {
            "pageno": 0,
            "limit": 9,
            "search_speciality": "",
            "conference_type_text": "",
            "cme_from": "",
            "cme_to": "",
            "organization": "",
            "price_from": "",
            "price_to": "",
            "startdate": "",
            "location": "",
            "free_conf": "",
            "noncme": "",
            "speaker": "",
            "search_mandate_states": [],
            "search_topic": "",
            "search_profession": "",
            "credittype": "",
            "sort_type": "",
            "searchKeyword": props?.route?.params?.wholeDats?.mainKeyAll?.trig?.searchTxt ? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.searchTxt : "",
            "request_type": props?.route?.params?.wholeDats?.mainKeyAll?.trig?.rqstType ? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.rqstType : "",
            [mainKey]:
                props?.route?.params?.wholeDats?.mainKeyAll?.trig?.beforetake ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.beforetake
                ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.beforetakecity?.[0] ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.beforetakecity?.[0]
                ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.monthAds ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.monthAds ?? props?.route?.params?.trig?.trig ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.trig ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.datamainkey
                ?? "",
            [stateKey]:
                (props?.route?.params?.wholeDats?.mainKeyAll?.trig?.newAdd ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.newAdd)
                    ? (
                        props?.route?.params?.wholeDats?.mainKeyAll?.trig?.trig ??
                        props?.route?.params?.wholeDats?.mainKeyAll?.trig?.trig ??
                        props?.route?.params?.wholeDats?.mainKeyAll?.trig?.beforetakecity?.[1] ??
                        props?.route?.params?.wholeDats?.mainKeyAll?.trig?.beforetakecity?.[1] ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.stateID
                    )
                    : "",
            [newCt]:
                (props?.route?.params?.wholeDats?.mainKeyAll?.trig?.newCt ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.newCt)
                    ? (props?.route?.params?.wholeDats?.mainKeyAll?.trig?.beforetakecity?.[2] ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.beforetakecity?.[2] ?? props?.route?.params?.wholeDats?.mainKeyAll?.trig?.allProfessionMain)
                    : "",
        };
        connectionrequest()
            .then(() => {
                dispatch(cmeCourseRequest(obj));
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err);
            });
    };
    if (status == '' || CMEReducer.status !== status) {
        switch (CMEReducer.status) {
            case 'CME/cmeCourseRequest':
                status = CMEReducer.status;
                break;
            case 'CME/cmeCourseSuccess':
                status = CMEReducer.status;
                const handlAgain = CMEReducer?.cmeCourseResponse?.aggregations
                if (handlAgain) {
                    setFiltertake(handlAgain);
                    const keys = Object.keys(handlAgain);
                    for (let key of keys) {
                        if (Array.isArray(handlAgain[key]) && handlAgain[key].length > 0 && selectedFilter) {
                            setSelectedFilter(selectedFilter);
                            break;
                        }
                    }
                }
                break;
            case 'CME/cmeCourseFailure':
                status = CMEReducer.status;
                break;
        }
    }
    // const generateFilterToKeyMap = (wholeDat) => {
    //     const filterToKeyMap = {};
    //     for (const key in wholeDat) {
    //         if (Array.isArray(wholeDat[key])) {
    //             const filterName = key
    //                 .replace(/_/g, ' ')
    //                 .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
    //             filterToKeyMap[filterName] = key;
    //         } else if (typeof wholeDat[key] == 'number') {
    //             if (key.includes('price')) {
    //                 const getPriceFromStat = wholeDat["get_price_from_stat"];
    //                 const getPriceToStat = wholeDat["get_price_to_stat"];
    //                 const havingFreeCme = wholeDat["having_freecme"];
    //                 const havingNonCme = wholeDat["having_noncme"];
    //                 if (!(getPriceFromStat == 0 && getPriceToStat == 0 && havingFreeCme == 0 && havingNonCme == 0)) {
    //                     filterToKeyMap['Price range Start'] = key.replace('_from_', '_start_');
    //                     filterToKeyMap['Price range End'] = key.replace('_from_', '_end_');
    //                 }
    //                 filterToKeyMap['Price range Start'] = key.replace('_from_', '_start_');
    //                 filterToKeyMap['Price range End'] = key.replace('_from_', '_end_');
    //             } else if (key.includes('cme_points')) {
    //                 filterToKeyMap['No. of credits Start'] = key.replace('_from_', '_start_');
    //                 filterToKeyMap['No. of credits End'] = key.replace('_from_', '_end_');
    //             }
    //         }
    //     }
    //     return filterToKeyMap;
    // };
    const generateFilterToKeyMap = (wholeDat) => {
        const filterToKeyMap = {};
        const getPriceFromStat = wholeDat["get_price_from_stat"];
        const getPriceToStat = wholeDat["get_price_to_stat"];
        const havingFreeCme = wholeDat["get_cme_points_from_stat"];
        const havingNonCme = wholeDat["get_cme_points_to_stat"];
        const havingFreeCmereal = wholeDat["having_freecme"];
        const havingNonCmereal = wholeDat["having_noncme"];
        for (const key in wholeDat) {
            if (Array.isArray(wholeDat[key])) {
                const filterName = key
                    .replace(/_/g, ' ')
                    .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
                filterToKeyMap[filterName] = key;
            } else if (typeof wholeDat[key] == 'number') {
                if (key.includes('price')) {
                    if (!(getPriceFromStat == 0 && getPriceToStat == 0)) {
                        if (key.includes("_from_")) {
                            filterToKeyMap['Price range Start'] = key.replace('_from_', '_start_');
                        }
                        if (key.includes("_to_")) {
                            filterToKeyMap['Price range End'] = key.replace('_from_', '_end_');
                        }
                    }
                } else if (key.includes('cme_points')) {
                    if (!(havingFreeCme == 0 && havingNonCme == 0)) {
                        if (key.includes("_from_")) {
                            filterToKeyMap['No. of credits Start'] = key.replace('_from_', '_start_');
                        }
                        if (key.includes("_to_")) {
                            filterToKeyMap['No. of credits End'] = key.replace('_from_', '_end_');
                        }
                    }
                }
            }
        }
        if (havingFreeCmereal == 1 && havingNonCmereal == 1) {
            filterToKeyMap['CME Type'] = 'cme_type_flags';
        }
        return filterToKeyMap;
    };



    // const filterToKeyMap = filtertake ? generateFilterToKeyMap(filtertake) : {};
    // const filters = Object.keys(filterToKeyMap);
    // const validFilters = filters.filter(filter => {
    //     const key = filterToKeyMap[filter];
    //     return filtertake && filtertake[key] && filtertake[key].length > 0;
    // });
    const updateSearch = (text) => setSearch(text);
    const toggleSelection = (item, types) => {
        console.log(item, types, "---------itemtypes1122");
        setSelectedItems(prevSelectedItems => {
            const updatedItems = [...prevSelectedItems];
            const typeIndex = updatedItems.findIndex(i => i[types]);
            if (typeIndex !== -1) {
                const existingType = updatedItems[typeIndex];
                existingType[types] = existingType[types] || [];
                if (existingType[types].includes(item)) {
                    existingType[types] = existingType[types].filter(i => i !== item);
                    if (existingType[types].length == 0) {
                        updatedItems.splice(typeIndex, 1);
                    }
                } else {
                    existingType[types].push(item);
                }
            } else {
                updatedItems.push({ [types]: [item] });
            }

            return updatedItems;
        });
    };
    const filterToKeyMapd = filtertake
        ? generateFilterToKeyMap(filtertake)
        : {};
    const validFiltersd = Array.from(
        new Set(
            Object.values(filterToKeyMapd).filter(
                (key) =>
                    (filtertake && filtertake[key] && filtertake[key].length > 0) || key == 'cme_type_flags' || typeof filtertake[key] === "number"
            )
        )
    );
    console.log(validFiltersd, "validFiltersd---------", selectedItems)
    const renderFilterOption = ({ item, index }) => (
        <>
            {index === 0 && (
                <>
                    <View
                        style={{
                            height: normalize(12),
                            width: normalize(120),
                            backgroundColor: Colorpath.Pagebg,
                        }}
                    />
                    <View style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#E3E3E3'
                    }} />
                </>
            )}
            <TouchableOpacity
                style={[styles.filterOption, selectedFilter === item && styles.selectedFilterOption]}
                onPress={() => setSelectedFilter(item)}
            >
                <Text style={styles.filterOptionText}>{item == "conf_types" ? "Course Format" : item == "organizers_types" ? "Organizers" : item == "speakers_types" ? "Speakers" : item == "profession_types" ? "Choose Profession" : item == "get_cme_points_to_stat" ? 'No. of credits' : item == "get_price_to_stat" ? "Price range" : item == "cme_type_flags" ? "Course Type" : item == "date_types" ? "Dates" : item == "location_types" ? "Location" : item == "mandate_states" ? 'State-required Courses' : item == 'credit_types' ? 'Credit type' : item == 'topic_types' ? "Topics" : item == 'count_specilaities' ? "Choose Specailities" : item}</Text>
            </TouchableOpacity>
        </>
    );
    useEffect(() => {
        if (selectedFilter) {
            setCombinedData([
                { type: "search", data: search },
                { type: selectedFilter, data: filtertake[selectedFilter] },
            ]);
        }
    }, [selectedFilter, filtertake, search])
    const renderProfessionItem = ({ item, index, types, selectedFilters, reqItem }) => {
        console.log(reqItem, "reqitem======", item)
        const hasReqItem = reqItem && reqItem.length > 0;

        // Check if item exists in any array within reqItem objects (only if reqItem has data)
        const isItemInReqItem = hasReqItem ? reqItem.some(reqObj => {
            return Object.values(reqObj).some(arr =>
                Array.isArray(arr) && arr.includes(item)
            );
        }) : false;

        const getIconName = (item, selectedItems) => {
            return selectedItems.some(i => {
                return Object.values(i).some(arr => Array.isArray(arr) && arr.includes(item));
            }) ? 'check' : 'check';
        };

        const getIconColor = (item, selectedItems) => {
            // If reqItem has data and item is in reqItem, always return orange color
            if (hasReqItem && isItemInReqItem) {
                return '#FF5733'; // Orange color
            }

            // Otherwise, use the original logic
            return selectedItems.some(i => {
                return Object.values(i).some(arr => Array.isArray(arr) && arr.includes(item));
            }) ? '#FF5733' : '#FFFFFF';
        };

        // Determine if the item should be disabled (only if reqItem has data and contains the item)
        const shouldDisableItem = hasReqItem && isItemInReqItem;
        return (
            <TouchableOpacity
                style={styles.professionItem}
                onPress={shouldDisableItem ? null : () => toggleSelection(item, types, selectedFilters)}
                disabled={shouldDisableItem}
            >
                <View style={styles.professionRow}>
                    <Icon
                        name={getIconName(item, selectedItems)}
                        size={20}
                        color={getIconColor(item, selectedItems)}
                    />
                    <Text numberOfLines={4} style={styles.professionText}>{item}</Text>
                </View>
            </TouchableOpacity>
        )

    };
    const hitData = ["Free Courses", "Non-CME Courses"];
    const SliderTick = (item) => {
        setSelectedItm(prevSelectedItems => {
            if (prevSelectedItems.includes(item)) {
                return prevSelectedItems.filter(i => i !== item);
            } else {
                return [...prevSelectedItems, item];
            }
        });
    };
    useEffect(() => {
        if (props?.route?.params?.wholeDats?.PriceDrop?.CME?.length > 0) {
            setCmetype(props?.route?.params?.wholeDats?.PriceDrop?.CME)
        }
    }, [props?.route?.params?.wholeDats?.PriceDrop?.CME])
    console.log(selectedItm, "itempo--------selectedItm")
    const hitItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={styles.professionItem}
                onPress={() => {
                    setSelectedFilter(selectedFilter);
                    SliderTick(item);
                }}
            >
                <View style={styles.professionRow}>
                    {cmetype?.includes(item) ? <Icon
                        name={cmetype.includes(item) ? 'check' : 'check'}
                        size={20}
                        color={cmetype.includes(item) ? '#FF5733' : '#CCCCCC'}
                    /> : <Icon
                        name={selectedItm.includes(item) ? 'check' : 'check'}
                        size={20}
                        color={selectedItm.includes(item) ? '#FF5733' : '#CCCCCC'}
                    />}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", gap: Platform.OS === "ios" ? normalize(5) : normalize(10) }}>
                        <Text style={[styles.professionText, { width: normalize(90) }]}>{item}</Text>
                        {cmetype?.includes(item) && <TouchableOpacity onPress={() => {
                            const updatedCmeType = cmetype.filter(val => val !== item);
                            setCmetype(updatedCmeType);
                            setSelectedItm(prevSelectedItems => {
                                // Combine rest of active items with previous selectedItm
                                const combined = [...updatedCmeType];

                                // Remove duplicates
                                const uniqueItems = Array.from(new Set(combined));

                                return uniqueItems;
                            });
                            againHand();
                        }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#ff773d" }}>{cmetype.includes(item) ? "Clear" : ""}</Text>
                        </TouchableOpacity>}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    const renderItem = ({ item, index }) => {
        if (item?.type === 'search') {
            return (
                <View>
                    <TextInput
                        placeholderTextColor={"#999999"}
                        placeholder='Search here'
                        style={{
                            height: normalize(40),
                            width: normalize(160),
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: "#DADADA",
                            paddingHorizontal: normalize(8),
                        }}
                        onChangeText={updateSearch}
                        value={search}
                    />
                </View>
            );
        } else if (item?.type == selectedFilter) {
            const type = selectedFilter;
            const hitDat = finalds ? "" : props?.route?.params?.wholeDats?.ClearText || props?.route?.params?.wholeDats?.PriceDrop?.minget || props?.route?.params?.wholeDats?.PriceDrop?.maxget || props?.route?.params?.wholeDats?.PriceDrop?.mingetp || props?.route?.params?.wholeDats?.PriceDrop?.maxgetp;
            const hasData = typeof hitDat == "object" && hitDat.some(item => {
                return item.hasOwnProperty(type) && Array.isArray(item[type]) && item[type].length > 0;
            });
            console.log(hasData, "hasData-----", item, hitDat);
            return (
                <View>
                    <View style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row" }}>
                        <Text style={styles.professionHeader}>{item?.type == "conf_types" ? "Course Format" : item?.type == "organizers_types" ? "Organizers" : item?.type == "speakers_types" ? "Speakers" : item?.type == "profession_types" ? "Choose Profession" : item?.type == "get_cme_points_to_stat" ? 'No. of credits' : item?.type == "get_price_to_stat" ? "Price range" : item?.type == "cme_type_flags" ? "Course Type" : item?.type == "date_types" ? "Dates" : item?.type == "location_types" ? "Location" : item?.type == "mandate_states" ? 'State-required Courses' : item?.type == 'credit_types' ? 'Credit type' : item?.type == 'topic_types' ? "Topics" : item?.type == 'count_specilaities' ? "Choose Specailities" : item?.type}</Text>
                        <TouchableOpacity onPress={() => {
                            setFinalds(true);
                            againHand();
                            setSelectedItems([]);
                        }}>
                            {hasData && <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#ff773d", marginTop: normalize(16) }}>{"Clear"}</Text>}
                        </TouchableOpacity>
                    </View>
                    {Array.isArray(item?.data) && item?.data.length > 0 ? (
                        item.data
                            .filter(p =>
                                (typeof p == "string" ? p : p?.key)?.toLowerCase().includes(search.toLowerCase())
                            )
                            .length > 0 ? (
                            item.data
                                .filter(p =>
                                    (typeof p == "string" ? p : p?.key)?.toLowerCase().includes(search.toLowerCase())
                                )
                                .map((profession, index) =>
                                    renderProfessionItem({
                                        item: typeof profession == "string" ? profession : profession?.key,
                                        index,
                                        types: item?.type,
                                        selectedFilters: selectedFilter,
                                        reqItem: hitDat || []
                                    })
                                )
                        ) : (
                            <View style={{ paddingVertical: normalize(5), paddingHorizontal: normalize(10) }}>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#333" }}>{"No data found"}</Text>
                            </View>
                        )
                    ) : (
                        <View style={{ paddingVertical: normalize(5), paddingHorizontal: normalize(10) }}>
                            <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#333" }}>{"No data found"}</Text>
                        </View>
                    )}
                </View>
            );
        }
        return null;
    };
    const renderContent = () => {
        switch (selectedFilter) {
            case 'conf_types':
                return (
                    <>
                        <FlatList
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.type}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>
                                </View>
                            }
                        />
                    </>
                );
            case 'organizers_types':
                return (
                    <>
                        <FlatList
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.type}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>
                                </View>
                            }
                        />
                    </>
                );
            case 'profession_types':
                return (
                    <>
                        <FlatList
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.type}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>
                                </View>
                            }
                        />
                    </>
                );
            case 'speakers_types':
                return (
                    <>
                        <FlatList
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.type}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>
                                </View>
                            }
                        />
                    </>
                );
            case 'credit_types':
                return (
                    <>
                        <FlatList
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.type}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>
                                </View>
                            }
                        />
                    </>
                );
            case 'get_cme_points_to_stat':
                return (
                    <CreditPrice
                        minValue={minValue}
                        maxValue={maxValue}
                        setMinValue={setMinValue}
                        setMaxValue={setMaxValue}
                        text={"No. of credits"}
                        sliderWidth={190}
                        min={MIN_DEFAULT}
                        resetEnable={resetOn}
                        max={filtertake?.get_cme_points_to_stat}
                        currentMin={slider2Min}
                        currentMax={slider2Max}
                        setCurrentMin={setSlider2Min}
                        setCurrentMax={setSlider2Max}
                        step={1}
                        trigmin={props?.route?.params?.wholeDats?.PriceDrop?.maxget || props?.route?.params?.wholeDats?.PriceDrop?.minget}
                        againHand={againHand}
                        onValueChange={range => {
                            setMinValue(range.min);
                            setMaxValue(range.max);
                        }}
                    />
                );
            case 'date_types':
                return (
                    <>
                        <FlatList
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.type}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>
                                </View>
                            }
                        />
                    </>
                );
            case 'get_price_to_stat':
                return (
                    <PriceSlider
                        selectedFilter={selectedFilter}
                        setSelectedFilter={setSelectedFilter}
                        selectedItm={selectedItm}
                        CMEText={props?.route?.params?.wholeDats?.PriceDrop?.CME?.length > 0 ? props?.route?.params?.wholeDats?.PriceDrop?.CME : props?.route?.params?.wholeDats?.PriceDrop?.CME}
                        setSelectedItm={setSelectedItm}
                        sliderWidth={190}
                        min={MIN_PMin}
                        currentMin={slider1Min}
                        currentMax={slider1Max}
                        setCurrentMin={setSlider1Min}
                        setCurrentMax={setSlider1Max}
                        resetEnable={resetOn}
                        trigmin={props?.route?.params?.wholeDats?.PriceDrop?.maxgetp || props?.route?.params?.wholeDats?.PriceDrop?.mingetp}
                        againHand={againHand}
                        max={filtertake?.get_price_to_stat || Max_Price}
                        step={1}
                        onValueChange={range => {
                            setMinValuep(range.min);
                            setMaxValuep(range.max);
                        }}
                    />
                );
            case 'cme_type_flags':
                return (
                    <>
                        <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: normalize(5) }}>
                            <Text style={{ fontFamily: Fonts.InterBold, fontSize: 16, color: "#000000", textDecorationLine: "underline" }}>{"Course Type"}</Text>
                            <FlatList
                                data={hitData}
                                renderItem={hitItem}
                                keyExtractor={(item) => item}
                                ListHeaderComponent={<View />}
                                showsVerticalScrollIndicator={false}
                                ListEmptyComponent={
                                    <View style={{
                                        height: normalize(50),
                                        width: normalize(170),
                                        alignSelf: 'center',
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: normalize(10)
                                    }}>
                                        <Text
                                            style={{
                                                color: Colorpath.grey,
                                                fontFamily: Fonts.InterRegular,
                                                fontSize: 10,
                                            }}>
                                            No data found
                                        </Text>
                                    </View>
                                } />
                        </View>
                    </>
                );
            case 'location_types':
                return (
                    <>
                        <FlatList
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.type}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>
                                </View>
                            }
                        />
                    </>
                );
            case 'mandate_states':
                return (
                    <>
                        <FlatList
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.type}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>
                                </View>
                            }
                        />
                    </>
                );
            case 'topic_types':
                return (
                    <>
                        <FlatList
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.type}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>
                                </View>
                            }
                        />
                    </>
                );
            case 'count_specilaities':
                return (
                    <>
                        <FlatList
                            data={combinedData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.type}
                            ListHeaderComponent={<View />}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={{
                                    height: normalize(50),
                                    width: normalize(170),
                                    alignSelf: 'center',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(10)
                                }}>
                                    <Text
                                        style={{
                                            color: Colorpath.grey,
                                            fontFamily: Fonts.InterRegular,
                                            fontSize: 10,
                                        }}>
                                        No data found
                                    </Text>
                                </View>
                            }
                        />
                    </>
                );
            default:
                return null;
        }
    };
useLayoutEffect(() => {
            props.navigation.setOptions({ gestureEnabled: false });
        }, []);
    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            {conn == false ? <IntOff/> :<SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                    <PageHeader title="Filter Results" onBackPress={FilterBack} />
                </View>
                <Loader visible={CMEReducer?.status == 'CME/cmeCourseRequest'} />
                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }} behavior={Platform.OS === 'ios' ? "padding" : undefined}>
                    <View style={styles.content}>
                        <FlatList
                            data={validFiltersd}
                            renderItem={renderFilterOption}
                            keyExtractor={(item) => item}
                            style={styles.filterList}
                        />
                        <View style={styles.professionContainer}>
                            {renderContent()}
                        </View>
                    </View>
                </KeyboardAvoidingView>
                <View style={styles.footer}>
                    <TouchableOpacity disabled={selectedItems?.length > 0 || selectedItm?.length > 0 || minValue || maxValue || minValuep || maxValuep ? false : true} onPress={() => {
                        Alert.alert('eMedEvent', 'Are you sure want to clear all the data ?', [{
                            text: "Yes", onPress: () => {
                                setResetOn(!resetOn);
                                setSelectedItems([]);
                                setSelectedItm([]);
                                setMinValue("");
                                setMaxValue("");
                                setMinValuep("");
                                setMaxValuep("");
                            }, style: "cancel"
                        }, {
                            text: "No", onPress: () => {
                                console.log("regjnjregjtr");
                            }, style: "cancel"
                        }])
                    }} style={styles.footerButton}>
                        <Text style={{
                            fontSize: 18,
                            color: selectedItems?.length > 0 ? '#999999' : '#CCC',
                            fontFamily: Fonts.InterSemiBold
                        }}>{"Reset"}</Text>
                    </TouchableOpacity>
                    <View style={{ height: normalize(20), width: 1, backgroundColor: "#ECECEC" }} />
                    <TouchableOpacity onPress={() => { props.navigation.navigate("Globalresult", { filterDatSh: { filterDatSh: selectedItems, returnTake: props?.route?.params?.wholeDats?.mainKeyAll, selectedIt: selectedItm, minVal: minValue, maxVal: maxValue, minValP: minValuep, maxValp: maxValuep, selectedItem: selectedFilter } }) }} disabled={selectedItems?.length > 0 || selectedItm?.length > 0 || minValue || maxValue || minValuep || maxValuep ? false : true} style={styles.footerButton}>
                        <Text style={{
                            fontSize: 18,
                            color: selectedItems?.length > 0 || selectedItm?.length > 0 || minValue || maxValue || minValuep || maxValuep ? Colorpath.ButtonColr : "#000",
                            fontFamily: Fonts.InterSemiBold
                        }}>{"Apply"}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>}
        </>
    );
};

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        flex: 1,
    },
    filterList: {
        width: '40%',
        backgroundColor: '#EAF5FF',
    },
    filterOption: {
        paddingVertical: normalize(13),
        paddingHorizontal: normalize(10),
        borderBottomWidth: 1,
        borderBottomColor: '#E3E3E3',
    },
    alphabetSection: {
        marginBottom: normalize(15),
        paddingVertical: normalize(5)
    },
    alphabetHeader: {
        fontSize: 18,
        fontFamily: Fonts.InterMedium,
        color: '#000000',
        marginBottom: 5,
        alignSelf: "center"
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    itemText: {
        marginLeft: 10,
        fontSize: 14,
        color: "#000000",
        fontFamily: Fonts.InterMedium
    },
    selectedFilterOption: {
        backgroundColor: '#FFFFFF',
    },
    filterOptionText: {
        fontSize: 14,
        fontFamily: Fonts.InterMedium,
        color: "#000000"
    },
    professionContainer: {
        width: '60%',
        paddingHorizontal: normalize(15),
        backgroundColor: "#FFFFFF"
    },
    professionHeader: {
        fontSize: 14,
        fontFamily: Fonts.InterMedium,
        color: '#000000',
        marginTop: normalize(16),
        // marginBottom: normalize(8),
    },
    professionItem: {
        paddingVertical: normalize(8),
    },
    professionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    professionText: {
        fontSize: 14,
        fontFamily: Fonts.InterMedium,
        color: "#000000",
        marginLeft: normalize(8),
        width: normalize(130),
        flexWrap: "wrap",
        // backgroundColor:"red"
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: normalize(18),
        borderTopWidth: 0.5,
        borderTopColor: '#E3E3E3',
        backgroundColor: "#FFFFFF"
    },
    footerButton: {
        height: normalize(20),
        width: normalize(140),
        alignItems: 'center',
    },
    separator: {
        height: 0.8,
        width: normalize(200),
        backgroundColor: "#999999",
        alignSelf: 'center',
    },
});

export default FilterScreen;
