/**
 * Guest speciality search screen module. Renders a React Native screen or a screen-scoped support component. Exported members: getLabel, getSlug, SpecialtyItem, GuestSpecialitySearch, goBack, openSpecialityResult, handleUrl, searchContent, navigateToBrowse, renderDefaultContent, styles.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BrowseSpecialtyRequest } from '../../Redux/Reducers/BrowsReducer';
import { ConfActRequest } from '../../Redux/Reducers/CMEReducer';
import { webcastsearchRequest } from '../../Redux/Reducers/WebcastReducer';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import Imagepath from '../../Themes/Imagepath';
import MyStatusBar from '../../Utils/MyStatusBar';
import normalize from '../../Utils/Helpers/Dimen';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import GlobalSearchAll from '../GlobalSupport/GlobalSearchAll';
import VoiceSearchBar from '../GlobalSupport/Voice';

const SEARCH_DEBOUNCE_MS = 280;

/**
 * Reusable SpecialtyItem component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const getLabel = item => {
  if (item == null) return '';
  if (typeof item === 'string') return item.trim();
  return String(
    item?.label ||
    item?.name ||
    item?.title ||
    item?.specialty_name ||
    item?.speciality_name ||
    '',
  ).trim();
};

/**
 * Returns slug.
 * @param {*} item - Input value.
 * @returns {*}
 */
const getSlug = item =>
  getLabel(item)
    .toLowerCase()
    .replace(/\s+/g, '-');

/**
 * Specialty item component.
 * @param {Object} props - Input object.
 * @param {*} props.item - Nested property value.
 * @param {*} props.onPress - Nested property value.
 * @returns {JSX.Element}
 */
const SpecialtyItem = ({ item, onPress, isLast }) => {
  const label = getLabel(item);
  if (!label) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.touchableContainer,
        isLast && styles.touchableContainerLast,
      ]}
      onPress={() => onPress(item)}
    >
      <View style={styles.row}>
        <View style={styles.rowIconBadge}>
          <Image
            source={Imagepath.WrongArrw}
            style={styles.specialtyIcon}
          />
        </View>
        <Text numberOfLines={2} style={styles.specialtyText}>
          {label}
        </Text>
        <Icon name="chevron-right" size={20} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );
};

/**
 * Guest speciality search component.
 * @param {*} props - Input value.
 * @returns {JSX.Element}
 */
const GuestSpecialitySearch = props => {
  const dispatch = useDispatch();
  const BrowsReducer = useSelector(state => state.BrowsReducer);
  const WebcastReducer = useSelector(state => state.WebcastReducer);
  const taskData = useMemo(() => {
    const base = props?.route?.params?.taskData || {};
    return {
      ...base,
      fromGuestSpecialitySearch: true,
    };
  }, [props?.route?.params?.taskData]);
  const [searchText, setSearchText] = useState('');
  const [browseData, setBrowseData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [browseLoading, setBrowseLoading] = useState(true);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const searchTextRef = useRef('');
  searchTextRef.current = searchText;

  const dispatchWebcastSearch = useCallback(
    payload => {
      setIsLoading(true);
      connectionrequest()
        .then(() => {
          dispatch(webcastsearchRequest(payload));
        })
        .catch(err => {
          setIsLoading(false);
          showErrorAlert('Please connect to internet', err);
        });
    },
    [dispatch],
  );

  const placeholders = useMemo(() => [
    "Search for CME/CE courses",
    "Search state-required courses",
    "Search by topic",
    "Search by specialty",
    "Search medical conferences",
    "Search conferences by location"
  ], []);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (searchText || voiceOpen) return;
    const interval = setInterval(() => {
      setPlaceholderIndex(prevIndex => (prevIndex + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders, searchText, voiceOpen]);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const specialtyData = useMemo(() => {
    const list = browseData?.allspecialities || browseData?.allSpecialities;
    return Array.isArray(list) ? list.filter(item => getLabel(item)) : [];
  }, [browseData?.allSpecialities, browseData?.allspecialities]);

  const topSpecialties = useMemo(() => {
    const list = browseData?.topspecialities;
    const filtered = Array.isArray(list) ? list.filter(item => getLabel(item)) : [];

    const required = ['Gastroenterology', 'Orthopaedics', 'Pulmonology'];
    const existingLabels = new Set(filtered.map(item => getLabel(item).toLowerCase()));
    const missing = required.filter(req => !existingLabels.has(req.toLowerCase()));

    if (missing.length === 0) {
      return filtered;
    }

    const extraItems = [];
    missing.forEach(reqName => {
      const found = specialtyData.find(item => getLabel(item).toLowerCase() === reqName.toLowerCase());
      if (found) {
        extraItems.push(found);
      } else {
        extraItems.push({
          label: reqName,
          name: reqName,
          specialty_name: reqName,
          speciality_name: reqName,
        });
      }
    });

    return [...filtered, ...extraItems];
  }, [browseData?.topspecialities, specialtyData]);

  useEffect(() => {
    setBrowseLoading(true);
    connectionrequest()
      .then(() => {
        dispatch(
          BrowseSpecialtyRequest({
            apikey: 'Specialty',
            appurl: {},
          }),
        );
      })
      .catch(err => {
        setBrowseLoading(false);
        showErrorAlert('Please connect to internet', err);
      });
  }, [dispatch]);

  useEffect(() => {
    if (searchText === '' && !browseData) {
      setIsLoading(false);
      connectionrequest()
        .then(() => {
          dispatch(webcastsearchRequest({}));
        })
        .catch(err => {
          setIsLoading(false);
          showErrorAlert('Please connect to internet', err);
        });
    }
  }, [browseData, dispatch, searchText]);

  useEffect(() => {
    if (BrowsReducer?.status === 'Browse/BrowseSpecialtyRequest') {
      setBrowseLoading(true);
    } else if (BrowsReducer?.status === 'Browse/BrowseSpecialtySuccess') {
      setBrowseData(BrowsReducer.BrowseSpecialtyResponse);
      setBrowseLoading(false);
    } else if (BrowsReducer?.status === 'Browse/BrowseSpecialtyFailure') {
      setBrowseLoading(false);
    }
  }, [BrowsReducer?.BrowseSpecialtyResponse, BrowsReducer?.status]);

  useEffect(() => {
    if (WebcastReducer?.webcastsearchResponse) {
      setSearchData(WebcastReducer.webcastsearchResponse);
      setIsLoading(false);
    }
  }, [WebcastReducer?.webcastsearchResponse]);

  /**
* Go back utility.
* @returns {void}
*/
  const goBack = () => {
    props.navigation.goBack();
  };

  /**
* Open speciality result utility.
* @param {*} item - Input value.
* @returns {void}
*/
  const openSpecialityResult = item => {
    const slug = getSlug(item);
    if (!slug) return;

    props.navigation.navigate('Globalresult', {
      trig: {
        trig: slug,
        rqstType: 'specialityconferences',
        mainKey: 'conference_specialitiy',
        creditData: taskData,
        Realback: 'guest',
        fromGuestSpecialitySearch: true,
      },
    });
  };

  /**
* Handles url.
* @param {*} data - Input value.
* @returns {void}
*/
  const handleUrl = data => {
    const detailUrl = data?.detailpage_url || data?.url || data?.emed_url || '';
    const result = detailUrl.split('/')?.pop();
    if (!result) return;

    connectionrequest()
      .then(() => {
        dispatch(
          ConfActRequest({
            conference_id: data?.id,
            action_type: 'view',
            status: 1,
          }),
        );
      })
      .catch(err => {
        showErrorAlert('Please connect to internet', err);
      });

    setSearchText('');
    props.navigation.navigate('Statewebcast', {
      webCastURL: {
        webCastURL: result,
        shareUrl: detailUrl,
        detailpage_url: detailUrl,
        creditData: taskData,
        Realback: 'guest',
      },
    });
  };

  /**
* Search content utility.
* @param {*} text - Input value.
* @returns {void}
*/
  const searchContent = (text, immediate = false) => {
    const nextText = typeof text === 'string' ? text : '';
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }

    if (nextText) {
      const payload = { searchKeyword: nextText };
      searchTextRef.current = nextText;
      setSearchText(nextText);
      if (immediate) {
        dispatchWebcastSearch(payload);
      } else {
        searchDebounceRef.current = setTimeout(() => {
          dispatchWebcastSearch(payload);
        }, SEARCH_DEBOUNCE_MS);
      }
    } else {
      const prevKeyword = searchTextRef.current;
      searchTextRef.current = '';
      setSearchText('');
      if (prevKeyword) {
        dispatchWebcastSearch({
          searchKeyword: prevKeyword,
          searchRequestType: 'insertSearchKeyword',
        });
      }
    }
  };

  /**
* Navigate to browse utility.
* @returns {void}
*/
  const navigateToBrowse = () => {
    props.navigation.navigate('BrowseScreen', { creditData: taskData });
  };

  /**
* Render default content utility.
* @returns {JSX.Element}
*/
  const renderDefaultContent = () => {
    if (browseLoading) {
      return (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="small" color={Colorpath.ButtonColr} />
        </View>
      );
    }

    const listData = topSpecialties.length > 0 ? topSpecialties : specialtyData;

    return (
      <FlatList
        data={listData}
        keyExtractor={(item, index) => `popular-${getLabel(item)}-${index}`}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.listCardRowWrap,
              index === 0 && styles.listCardRowFirst,
              index === listData.length - 1 && styles.listCardRowLast,
            ]}
          >
            <SpecialtyItem
              item={item}
              onPress={openSpecialityResult}
              isLast={index === listData.length - 1}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
        contentContainerStyle={styles.defaultContent}
        ListHeaderComponent={
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderTitleWrap}>
              <Text style={styles.sectionTitle}>Popular specialties</Text>
            </View>
            <TouchableOpacity
              style={styles.browseAllPill}
              activeOpacity={0.75}
              onPress={navigateToBrowse}
            >
              <Text style={styles.browseAllText}>Browse All</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No specialities found</Text>
        }
      />
    );
  };
  return (
    <>
      <MyStatusBar
        barStyle="light-content"
        backgroundColor={Colorpath.Pagebg}
      />
      {voiceOpen ? (
        <VoiceSearchBar
          SearchCont={searchContent}
          searchEn={voiceOpen}
          setSearchEn={setVoiceOpen}
          searchText={voiceText}
          setSearchText={setVoiceText}
        />
      ) : (
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.flexContainer}
            behavior={Platform.OS === 'ios' ? 'height' : undefined}
          >
            <View style={styles.searchHeaderRow}>
              <View style={[styles.searchInputBar, isInputFocused && styles.searchInputBarFocused]}>
                <TouchableOpacity
                  onPress={goBack}
                  activeOpacity={0.65}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 6 }}
                  style={styles.backButton}
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                >
                  <Icon name="keyboard-arrow-left" size={30} color="#63748b" />
                </TouchableOpacity>
                <TextInput
                  ref={inputRef}
                  value={searchText}
                  onChangeText={text => searchContent(text)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onSubmitEditing={() => searchContent(searchText, true)}
                  placeholder={placeholders[placeholderIndex]}
                  placeholderTextColor="#94A3B8"
                  multiline={false}
                  numberOfLines={1}
                  returnKeyType="search"
                  autoCorrect={false}
                  autoCapitalize="none"
                  allowFontScaling={false}
                  underlineColorAndroid="transparent"
                  selectionColor="#475569"
                  style={styles.searchInput}
                />
                {searchText.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      searchContent('', true);
                      inputRef.current?.focus?.();
                    }}
                    activeOpacity={0.65}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.clearButton}
                    accessibilityRole="button"
                    accessibilityLabel="Clear search"
                  >
                    <Icon name="close" size={16} color="#475569" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  searchContent('');
                  setVoiceOpen(true);
                }}
                activeOpacity={0.75}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.voiceButton}
                accessibilityRole="button"
                accessibilityLabel="Voice search"
              >
                <Icon name="keyboard-voice" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={searchText ? { justifyContent: 'center', alignItems: 'center', marginTop: normalize(15) } : styles.content}>
              {searchText ? (
                <GlobalSearchAll
                  isLoading={isLoading}
                  creditDataAll={taskData}
                  setSearchText={setSearchText}
                  nav={props.navigation}
                  searchText={searchText}
                  data={searchData}
                  handleUrl={handleUrl}
                />
              ) : (
                renderDefaultContent()
              )}
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </>
  );
};

/**
 * Styles value.
 * @returns {*}
 */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colorpath.Pagebg,
  },
  flexContainer: {
    flex: 1,
    backgroundColor: Colorpath.Pagebg,
  },
  searchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(12),
    paddingTop: Platform.OS === 'ios' ? normalize(4) : normalize(8),
    paddingBottom: normalize(4),
    gap: normalize(10),
  },
  searchInputBar: {
    flex: 1,
    height: normalize(42),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    paddingRight: normalize(4),
  },
  searchInputBarFocused: {
    borderBottomColor: '#334155',
    borderBottomWidth: 1.5,
  },
  backButton: {
    width: normalize(30),
    height: normalize(36),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  searchInput: {
    flex: 1,
    height: normalize(40),
    fontSize: 14.5,
    fontFamily: Fonts.InterRegular,
    color: '#000000',
    paddingVertical: 0,
    paddingHorizontal: normalize(2),
  },
  clearButton: {
    width: normalize(24),
    height: normalize(24),
    borderRadius: normalize(12),
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: normalize(4),
  },
  voiceButton: {
    height: normalize(34),
    width: normalize(34),
    borderRadius: normalize(17),
    backgroundColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: normalize(16),
  },
  defaultContent: {
    flexGrow: 1,
    paddingTop: normalize(12),
    paddingBottom: normalize(80),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: normalize(10),
  },
  sectionHeaderTitleWrap: {
    flex: 1,
    paddingRight: normalize(8),
  },
  sectionTitle: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 16,
    color: '#0F172A',
  },
  browseAllPill: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: normalize(20),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  browseAllText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 12.5,
    color: Colorpath.ButtonColr,
  },
  listCardRowWrap: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5ECF6',
  },
  listCardRowFirst: {
    borderTopWidth: 1,
    borderTopLeftRadius: normalize(10),
    borderTopRightRadius: normalize(10),
    overflow: 'hidden',
  },
  listCardRowLast: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
    overflow: 'hidden',
  },
  touchableContainer: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(11),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  touchableContainerLast: {
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  rowIconBadge: {
    width: normalize(28),
    height: normalize(28),
    borderRadius: normalize(7),
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(10),
  },
  specialtyIcon: {
    height: normalize(12),
    width: normalize(12),
    tintColor: Colorpath.ButtonColr,
    resizeMode: 'contain',
  },
  specialtyText: {
    flex: 1,
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
    color: '#1E293B',
    marginRight: normalize(8),
  },
  emptyText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
    color: '#6B7280',
    paddingTop: normalize(8),
  },
  loaderWrap: {
    paddingTop: normalize(24),
    alignItems: 'center',
  },
});

/**
 * Guest speciality search default export.
 *
 * @returns {*}
 */
export default GuestSpecialitySearch;
