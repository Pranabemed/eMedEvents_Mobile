/**
 * Search result screen module. Renders a React Native screen or a screen-scoped support component. Exported members: dommyResult, SearchResult, FilterBack, intenalMedItem.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Platform, Image, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { postApi } from '../../Utils/Helpers/ApiRequest';
import getUserAgentJSON from '../../Utils/Helpers/UserAgent';
import { getPublicIP } from '../../Utils/Helpers/IPServer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { getCmeLabel, getDateRange } from './GuestUserModule/utils/guestUserContentParsers';

/**
 * Reusable SearchResult component.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const dommyResult = [{ id: 0, name: 'PRP and Microneedling Training in Washington DC (Falls Church, VA) ', price: 'US$2,195' }, { id: 1, name: 'COPD: Review of Current Treatment Guidelines', price: 'US$42' }, { id: 2, name: 'Unconscious Bias and Healthcare Part I', price: 'US$42' }, { id: 3, name: 'Antidiabetic Pharmacology Part 3: Insulin', price: 'US$42' }, { id: 4, name: 'Safe, Effective and Judicious Use of Antibiotics in the Outpatient Setting', price: 'US$42' }];

const normalizeHomeListingItem = (item, index) => {
    const title = item?.title || item?.course_title || item?.conference_name || item?.name || item?.banner_title || item?.heading || '';
    const priceValue = item?.display_price ?? item?.price ?? item?.ticketprice ?? item?.displayPrice ?? '';
    const currency = item?.display_currency_code || item?.currency_code || 'US$';
    const normalizedPrice = String(priceValue).trim();
    const price = !normalizedPrice
        ? ''
        : normalizedPrice.toUpperCase() === 'FREE'
            ? 'FREE'
            : `${currency}${normalizedPrice}`;

    const cme = getCmeLabel(item) || item?.cmeLabel || item?.credits || item?.credit || item?.total_credits || '';
    const format = item?.format || item?.conference_type_text || item?.type || item?.event_type || item?.eventType || '';
    let cmeLabel = cme && format ? `${cme} | ${format}` : (cme || format || '');
    const dateRange = getDateRange(item) || (item?.startdate && item?.enddate ? `${item.startdate} - ${item.enddate}` : '');
    const eventType = String(format || item?.event_type || item?.eventType || '').trim();

    return {
        id: item?.id ?? item?.conference_id ?? item?.detailpage_url ?? index,
        name: title,
        price: price || item?.buttonText || item?.button_text || item?.button || '',
        raw: item,
        organization: item?.organization_name || item?.organizer_name || item?.organizer || '',
        startdate: item?.startdate || '',
        enddate: item?.enddate || '',
        dateRange: dateRange,
        location: item?.location || item?.course_location || item?.venue || '',
        buttonText: item?.buttonText || item?.button_text || item?.button || 'Register',
        detailpageUrl: item?.detailpage_url || item?.detailpageUrl || item?.url || item?.banner_url || '',
        cmeLabel: cmeLabel,
        eventType,
    };
};

const parseListingDateValue = item => {
    const candidates = [
        item?.raw?.startdate,
        item?.startdate,
        item?.raw?.enddate,
        item?.enddate,
        item?.dateRange,
    ];

    for (const candidate of candidates) {
        if (!candidate) continue;
        const parsed = Date.parse(candidate);
        if (!Number.isNaN(parsed)) {
            return parsed;
        }
    }

    return 0;
};

const extractHomeListItems = (homeResponse, sectionTitle = '') => {
    const root = homeResponse?.data?.data
        ? homeResponse.data.data
        : homeResponse?.data
        ? homeResponse.data
        : homeResponse || {};

    let candidates = [];
    if (sectionTitle === 'Most Popular Conferences') {
        candidates = [
            root?.inperson_hybrid,
            root?.inPersonHybrid,
            root?.popular_courses,
            root?.popularCourses,
            root?.conferences,
            root?.featured_conferences,
            root?.featuredConferences,
            root?.free_conferences,
            root?.freeConferences,
            root?.data,
            root?.items,
            root?.results,
        ];
    } else if (sectionTitle === 'Free Conferences') {
        candidates = [
            root?.free_conferences,
            root?.freeConferences,
            root?.conferences,
            root?.popular_courses,
            root?.popularCourses,
            root?.featured_conferences,
            root?.featuredConferences,
            root?.inperson_hybrid,
            root?.inPersonHybrid,
            root?.data,
            root?.items,
            root?.results,
        ];
    } else {
        candidates = [
            root?.conferences,
            root?.popular_courses,
            root?.popularCourses,
            root?.featured_conferences,
            root?.featuredConferences,
            root?.free_conferences,
            root?.freeConferences,
            root?.inperson_hybrid,
            root?.inPersonHybrid,
            root?.data,
            root?.items,
            root?.results,
        ];
    }

    const rawList = candidates.find(value => Array.isArray(value) && value.length > 0) || candidates.find(Array.isArray) || [];
    const flattenedList = rawList.flatMap(entry => (Array.isArray(entry?.data) ? entry.data : entry));

    return flattenedList.map(normalizeHomeListingItem).filter(item => item.name || item.price);
};

/**
 * Search result component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const SearchResult = (props) => {
    const sectionTitle = props?.route?.params?.sectionTitle || 'Search Results';
    const homeListPayload = props?.route?.params?.homeListPayload || null;
    const itemsPerPage = Number(homeListPayload?.limit || 9);
    const resolvedHomeListPayload = useMemo(
        () =>
            homeListPayload || (
                sectionTitle === 'Most Popular Conferences'
                    ? {
                        is_mobile: 1,
                        view: 'all',
                        pageno: 0,
                        limit: 9,
                    }
                    : null
            ),
        [homeListPayload, sectionTitle],
    );
    const homeListPayloadKey = JSON.stringify(resolvedHomeListPayload || {});
    const [page, setPage] = useState(0);
    const [allApiResults, setAllApiResults] = useState([]);
    const [isLoading, setIsLoading] = useState(Boolean(resolvedHomeListPayload));
    const [hasLoaded, setHasLoaded] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    const [sortType, setSortType] = useState('');
    const [sortedFall, setSortedFall] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [isFreeOnly, setIsFreeOnly] = useState(false);
    const [eventTypeFilter, setEventTypeFilter] = useState('');

    const FilterBack = () => {
        props.navigation.goBack();
    };

    useEffect(() => {
        let isMounted = true;

        const fetchHomeList = async () => {
            if (!resolvedHomeListPayload) {
                setIsLoading(false);
                setHasLoaded(true);
                return;
            }

            if (page === 0) setIsLoading(true);
            try {
                getUserAgentJSON();
                const ipAddress = getPublicIP();
                const header = {
                    Accept: 'application/json',
                    contenttype: 'application/json',
                    IPADDRESS: ipAddress ? ipAddress : '',
                };

                const currentPayload = {
                    ...resolvedHomeListPayload,
                    pageno: page,
                    limit: itemsPerPage,
                };

                const response = await postApi('Home/list', currentPayload, header);
                if (isMounted) {
                    const responseData = response?.status === 200 ? response?.data : response?.data || null;
                    const newItems = extractHomeListItems(responseData, sectionTitle);
                    setHasMore(newItems.length >= itemsPerPage);
                    setAllApiResults(prev => {
                        if (page === 0) return newItems;
                        const existingIds = new Set(prev.map(item => String(item?.id)));
                        const uniqueNewItems = newItems.filter(item => !existingIds.has(String(item?.id)));
                        return [...prev, ...uniqueNewItems];
                    });
                }
            } catch (error) {
                if (isMounted && page === 0) {
                    setAllApiResults([]);
                    showErrorAlert('Unable to load listings');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                    setHasLoaded(true);
                }
            }
        };

        fetchHomeList();

        return () => {
            isMounted = false;
        };
    }, [homeListPayloadKey, page, resolvedHomeListPayload, sectionTitle, itemsPerPage]);

    const sourceResults = resolvedHomeListPayload ? allApiResults : dommyResult;
    
    const filteredAndSortedResults = useMemo(() => {
        let results = [...sourceResults];
        
        if (isFreeOnly) {
            results = results.filter(item => String(item?.price).toUpperCase() === 'FREE');
        }

        if (eventTypeFilter) {
            const needle = eventTypeFilter.toLowerCase();
            results = results.filter(item => String(item?.eventType || '').toLowerCase().includes(needle));
        }
        
        if (sortType) {
            results.sort((a, b) => {
                const getPrice = (item) => {
                    if (!item?.price) return 0;
                    if (String(item.price).toUpperCase() === 'FREE') return 0;
                    return parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
                };
                
                if (sortType === 'PRICE_ASC') return getPrice(a) - getPrice(b);
                if (sortType === 'PRICE_DESC') return getPrice(b) - getPrice(a);
                if (sortType === 'DATE_DESC') return parseListingDateValue(b) - parseListingDateValue(a);
                if (sortType === 'DATE_ASC') return parseListingDateValue(a) - parseListingDateValue(b);
                if (sortType === 'TITLE_ASC') return String(a?.name || '').localeCompare(String(b?.name || ''));
                if (sortType === 'TITLE_DESC') return String(b?.name || '').localeCompare(String(a?.name || ''));
                return 0;
            });
        }
        return results;
    }, [sourceResults, sortType, isFreeOnly, eventTypeFilter]);

    const paginatedResults = useMemo(
        () => filteredAndSortedResults,
        [filteredAndSortedResults],
    );
    useEffect(() => {
        setPage(0);
        setAllApiResults([]);
        setHasMore(true);
    }, [homeListPayloadKey]);

    /**
 * Intenal med item utility.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.index - Nested property value.
 * @returns {JSX.Element}
 */
const intenalMedItem = ({ item, index }) => {
        const handlePress = () => {
            const url = item?.detailpageUrl;
            if (!url) return;
            const result = String(url).split('/').pop();
            if (result) {
                props.navigation.navigate('Statewebcast', {
                    webCastURL: {
                        webCastURL: result,
                        shareUrl: url,
                        detailpage_url: url,
                        Realback: 'guest',
                    },
                });
            }
        };
        const cardWidth = Math.max(Dimensions.get('window').width - normalize(32), normalize(300));

        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: normalize(8), width: '100%' }}>
                <TouchableOpacity
                    onPress={handlePress}
                    disabled={!item?.detailpageUrl}
                    style={{
                        width: cardWidth,
                        borderRadius: normalize(12),
                        backgroundColor: '#FFFFFF',
                        padding: normalize(16),
                        alignItems: 'flex-start',
                        borderWidth: 1,
                        borderColor: '#E6E6E6',
                        elevation: 0,
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                        <View style={{ flex: 1, paddingRight: normalize(10) }}>
                            <Text
                                numberOfLines={2}
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: normalize(16),
                                    color: '#111111',
                                    fontWeight: 'bold',
                                    flexShrink: 1,
                                    lineHeight: normalize(22),
                                }}
                            >
                                {item?.name}
                            </Text>
                        </View>
                    </View>

                    {item?.organization ? (
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: normalize(13), color: '#A3A3A3', marginTop: normalize(6) }}>
                            {item.organization}
                        </Text>
                    ) : (
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: normalize(13), color: '#A3A3A3', marginTop: normalize(6) }}>
                            {'By eMedEd'}
                        </Text>
                    )}

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: normalize(12) }}>
                        <Image source={Imagepath.WrongCal} style={{ height: normalize(16), width: normalize(16), resizeMode: 'contain', tintColor: '#7C7C7C' }} />
                        <Text
                            style={{
                                fontSize: normalize(13),
                                color: '#374151',
                                fontFamily: Fonts.InterMedium,
                                marginLeft: normalize(8),
                                flex: 1,
                            }}
                        >
                            {item?.dateRange
                                ? item.dateRange
                                : item?.location
                                    ? item.location
                                    : 'Apr 30 - May 25, 2025 - Drexel, USA '}
                        </Text>
                    </View>

                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: normalize(13),
                            color: '#6B7280',
                            marginTop: normalize(8),
                        }}
                    >
                        {item?.cmeLabel || item?.buttonText || ''}
                    </Text>

                    <View style={{ height: 1, width: '100%', backgroundColor: '#E6E6E6', marginTop: normalize(12) }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: normalize(10) }}>
                        <Text numberOfLines={1} style={{ fontFamily: Fonts.InterSemiBold, fontSize: normalize(15), color: '#111111' }}>
                            {item?.buttonText || 'Register'}
                        </Text>
                        <Text style={{ color: '#E0E0E0', fontSize: normalize(16) }}>
                            |
                        </Text>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: normalize(15), color: Colorpath.ButtonColr }}>
                            {item?.price}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <>
            <MyStatusBar barStyle={'light-content'} backgroundColor={Colorpath.Pagebg} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: '#FFFFFF', marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(0) }}>
                    <PageHeader title={sectionTitle} onBackPress={FilterBack} />
                </View>
                <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: '#333', marginBottom: 0 }}>
                            {`Showing (${filteredAndSortedResults.length}) Results for`}
                        </Text>
                        <TouchableOpacity onPress={() => setSortedFall(true)} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: '#333' }}>Sort By</Text>
                            <Image source={Imagepath.SortedPng} style={{ height: normalize(18), width: normalize(18), resizeMode: 'contain', marginLeft: normalize(8) }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ paddingHorizontal: normalize(10), paddingTop: 0 }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 24, color: Colorpath.ButtonColr }}>
                        {sectionTitle}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    {isLoading && !hasLoaded ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={Colorpath.ButtonColr} />
                        </View>
                    ) : (
                        <FlatList
                            data={paginatedResults}
                            renderItem={intenalMedItem}
                            keyExtractor={(item, index) => String(item?.id ?? item?.detailpageUrl ?? index)}
                            onEndReached={() => {
                                if (resolvedHomeListPayload && hasMore && !isLoading) {
                                    setPage(prev => prev + 1);
                                }
                            }}
                            onEndReachedThreshold={0.2}
                            ListFooterComponent={
                                hasMore ? (
                                    <View style={{ paddingVertical: normalize(16), alignItems: 'center' }}>
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: '#666666' }}>
                                            Loading more results...
                                        </Text>
                                    </View>
                                ) : null
                            }
                        />
                    )}
                </View>

                {/* Floating Filter Button */}
                <View style={{
                    position: 'absolute',
                    bottom: 70,
                    right: 0,
                    paddingHorizontal: normalize(20),
                    zIndex: 999
                }}>
                    <TouchableOpacity onPress={() => {
                        setFilterVisible(true);
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
                        <Image source={Imagepath.WrongFil} style={{ height: normalize(18), width: normalize(18), resizeMode: "contain" }} />
                    </TouchableOpacity>
                </View>

                {/* Sort Modal */}
                <Modal
                    isVisible={sortedFall}
                    onBackdropPress={() => setSortedFall(false)}
                    style={{
                        width: '100%',
                        alignSelf: 'center',
                        margin: 0,
                    }}
                >
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setSortedFall(false)}
                    >
                        <View style={{
                            borderRadius: normalize(7),
                            height: normalize(340),
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
                            data={[
                                { name: "Price - Low to High", type: "PRICE_ASC", id: 0 },
                                { name: "Price - High to Low", type: "PRICE_DESC", id: 1 },
                                { name: "Date - Newest First", type: "DATE_DESC", id: 2 },
                                { name: "Date - Oldest First", type: "DATE_ASC", id: 3 },
                                { name: "Title - A to Z", type: "TITLE_ASC", id: 4 },
                                { name: "Title - Z to A", type: "TITLE_DESC", id: 5 },
                            ]}
                            renderItem={({ item }) => {
                                const handlePress = (dd) => {
                                    setSortType(dd?.type);
                                    setSortedFall(false);
                                };

                                return (
                                    <TouchableOpacity
                                        onPress={() => { handlePress(item) }}
                                        style={{
                                            paddingVertical: normalize(15),
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#eee'
                                        }}
                                    >
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: sortType === item.type ? Colorpath.ButtonColr : '#333' }}>
                                            {item?.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Filter Modal */}
                <Modal
                    isVisible={filterVisible}
                    onBackdropPress={() => setFilterVisible(false)}
                    style={{
                        width: '100%',
                        alignSelf: 'center',
                        margin: 0,
                    }}
                >
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setFilterVisible(false)}
                    >
                        <View style={{
                            borderRadius: normalize(7),
                            height: normalize(340),
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
                            keyExtractor={item => item.id}
                            data={[
                                { id: 'free_only', label: 'Free Courses Only', value: 'free' },
                                { id: 'all_type', label: 'All Conference Types', value: '' },
                                { id: 'webcast', label: 'Webcast', value: 'webcast' },
                                { id: 'inperson', label: 'In-Person', value: 'in-person' },
                                { id: 'hybrid', label: 'Hybrid', value: 'hybrid' },
                            ]}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (item.id === 'free_only') {
                                            setIsFreeOnly(!isFreeOnly);
                                        } else {
                                            setEventTypeFilter(item.value);
                                        }
                                        setFilterVisible(false);
                                    }}
                                    style={{
                                        paddingVertical: normalize(15),
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#eee',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: (item.id === 'free_only' ? isFreeOnly : eventTypeFilter === item.value) ? Colorpath.ButtonColr : '#333' }}>
                                        {item.label}
                                    </Text>
                                    {(item.id === 'free_only' ? isFreeOnly : eventTypeFilter === item.value) ? <Text style={{ color: Colorpath.ButtonColr }}>✓</Text> : null}
                                </TouchableOpacity>
                            )}
                        />
                        </View>
                    </TouchableOpacity>
                </Modal>
                </SafeAreaView>
        </>
    );
};

/**
 * Search result default export.
 *
 * @returns {*}
 */
export default SearchResult;
