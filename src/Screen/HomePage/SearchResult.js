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
    };
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
    const [page, setPage] = useState(1);
    const [allApiResults, setAllApiResults] = useState([]);
    const [isLoading, setIsLoading] = useState(Boolean(resolvedHomeListPayload));
    const [hasLoaded, setHasLoaded] = useState(false);

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

            if (page === 1) setIsLoading(true);
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
                    pageno: page - 1,
                    limit: resolvedHomeListPayload.limit || 9
                };

                const response = await postApi('Home/list', currentPayload, header);
                if (isMounted) {
                    const responseData = response?.status === 200 ? response?.data : response?.data || null;
                    const newItems = extractHomeListItems(responseData, sectionTitle);
                    setAllApiResults(prev => page === 1 ? newItems : [...prev, ...newItems]);
                }
            } catch (error) {
                if (isMounted && page === 1) {
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
    }, [homeListPayloadKey, page]);

    const sourceResults = resolvedHomeListPayload ? allApiResults : dommyResult;
    const itemsPerPage = resolvedHomeListPayload ? 9 : 2;
    const paginatedResults = resolvedHomeListPayload ? sourceResults : useMemo(
        () => sourceResults.slice(0, page * itemsPerPage),
        [page, sourceResults, itemsPerPage],
    );
    const hasMore = resolvedHomeListPayload ? (allApiResults.length >= page * itemsPerPage) : paginatedResults.length < sourceResults.length;
    useEffect(() => {
        setPage(1);
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
                                if (hasMore) {
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
