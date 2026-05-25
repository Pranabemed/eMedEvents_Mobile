import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BrowseSpecialtyRequest } from '../../Redux/Reducers/BrowsReducer';
import { ConfActRequest } from '../../Redux/Reducers/CMEReducer';
import { webcastsearchRequest } from '../../Redux/Reducers/WebcastReducer';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import MyStatusBar from '../../Utils/MyStatusBar';
import normalize from '../../Utils/Helpers/Dimen';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import GlobalSearchAll from '../GlobalSupport/GlobalSearchAll';
import VoiceSearchBar from '../GlobalSupport/Voice';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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

const getSlug = item =>
  getLabel(item)
    .toLowerCase()
    .replace(/\s+/g, '-');

const SpecialtyItem = ({ item, onPress }) => {
  const label = getLabel(item);
  if (!label) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.specialtyRow}
      onPress={() => onPress(item)}
    >
      <Text numberOfLines={1} style={styles.specialtyText}>
        {label}
      </Text>
      <Icon name="keyboard-arrow-right" size={24} color="#111111" />
    </TouchableOpacity>
  );
};

const GuestSpecialitySearch = props => {
  const dispatch = useDispatch();
  const BrowsReducer = useSelector(state => state.BrowsReducer);
  const WebcastReducer = useSelector(state => state.WebcastReducer);
  const taskData = props?.route?.params?.taskData || {};
  const [searchText, setSearchText] = useState('');
  const [browseData, setBrowseData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [browseLoading, setBrowseLoading] = useState(true);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [isAlphabetDragging, setIsAlphabetDragging] = useState(false);

  const specialtyData = useMemo(() => {
    const list = browseData?.allspecialities || browseData?.allSpecialities;
    return Array.isArray(list) ? list.filter(item => getLabel(item)) : [];
  }, [browseData?.allSpecialities, browseData?.allspecialities]);

  const topSpecialties = useMemo(() => {
    const list = browseData?.topspecialities;
    const topList = Array.isArray(list) ? list.filter(item => getLabel(item)) : [];
    return (topList.length > 0 ? topList : specialtyData).slice(0, 5);
  }, [browseData?.topspecialities, specialtyData]);

  const availableLetters = useMemo(
    () =>
      new Set(
        specialtyData
          .map(item => getLabel(item)[0]?.toUpperCase())
          .filter(letter => LETTERS.includes(letter)),
      ),
    [specialtyData],
  );

  const firstAvailableLetter =
    LETTERS.find(letter => availableLetters.has(letter)) || 'A';

  const alphaSpecialties = specialtyData.filter(item =>
    getLabel(item).toUpperCase().startsWith(selectedLetter),
  );

  useEffect(() => {
    if (!availableLetters.has(selectedLetter)) {
      setSelectedLetter(firstAvailableLetter);
    }
  }, [availableLetters, firstAvailableLetter, selectedLetter]);

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

  const goBack = () => {
    props.navigation.goBack();
  };

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
      },
    });
  };

  const handleUrl = data => {
    const result = data?.url?.split('/')?.pop();
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
        creditData: taskData,
        Realback: 'guest',
      },
    });
  };

  const searchContent = text => {
    setSearchText(text);
    setIsLoading(true);

    connectionrequest()
      .then(() => {
        dispatch(
          webcastsearchRequest(
            text
              ? { searchKeyword: text }
              : {
                searchKeyword: searchText,
                searchRequestType: 'insertSearchKeyword',
              },
          ),
        );
      })
      .catch(err => {
        setIsLoading(false);
        showErrorAlert('Please connect to internet', err);
      });
  };

  const renderDefaultContent = () => {
    if (browseLoading && specialtyData.length === 0) {
      return (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="small" color={Colorpath.ButtonColr} />
        </View>
      );
    }

    return (
      <FlatList
        data={alphaSpecialties}
        keyExtractor={(item, index) => `alpha-${getLabel(item)}-${index}`}
        renderItem={({ item }) => (
          <SpecialtyItem item={item} onPress={openSpecialityResult} />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isAlphabetDragging}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
        contentContainerStyle={styles.defaultContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.sectionTitle}>Top Specialities</Text>
            {topSpecialties.map((item, index) => (
              <SpecialtyItem
                key={`top-${getLabel(item)}-${index}`}
                item={item}
                onPress={openSpecialityResult}
              />
            ))}

            <Text style={[styles.sectionTitle, styles.alphaTitle]}>
              Browse Alphabetically
            </Text>
            <View
              onTouchStart={() => setIsAlphabetDragging(true)}
              onTouchEnd={() => setIsAlphabetDragging(false)}
              onTouchCancel={() => setIsAlphabetDragging(false)}
            >
              <GestureScrollView
                horizontal
                bounces={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                contentContainerStyle={styles.letterContent}
                nestedScrollEnabled
                directionalLockEnabled
                onScrollBeginDrag={() => setIsAlphabetDragging(true)}
                onScrollEndDrag={() => setIsAlphabetDragging(false)}
                onMomentumScrollEnd={() => setIsAlphabetDragging(false)}
              >
                {LETTERS.map(letter => {
                  const active = selectedLetter === letter;
                  const unavailable = !availableLetters.has(letter);
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setSelectedLetter(letter)}
                      style={[
                        styles.letterButton,
                        active && styles.letterButtonActive,
                        unavailable && styles.letterButtonDisabled,
                      ]}
                      key={letter}
                    >
                      <Text
                        style={[
                          styles.letterText,
                          active && styles.letterTextActive,
                          unavailable && styles.letterTextDisabled,
                        ]}
                      >
                        {letter}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </GestureScrollView>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No specialities found</Text>
        }
      />
    );
  };

  if (voiceOpen) {
    return (
      <VoiceSearchBar
        SearchCont={searchContent}
        searchEn={voiceOpen}
        setSearchEn={setVoiceOpen}
        searchText={voiceText}
        setSearchText={setVoiceText}
      />
    );
  }

  return (
    <>
      <MyStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.screen}
          behavior={Platform.OS === 'ios' ? 'height' : undefined}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={goBack}
              style={[styles.backButton, { flexDirection: "row", alignItems: "center", gap: normalize(5) }]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="keyboard-arrow-left" size={34} color="#111111" />
              <Text style={styles.headerTitle}>All Specialities</Text>
            </TouchableOpacity >
          </View>

          <View style={styles.searchContent}>
            <View style={styles.searchBox}>
              <SearchIcon name="search" size={24} color="#6B7280" />
              <TextInput
                value={searchText}
                onChangeText={searchContent}
                placeholder="Search Specialities"
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
              />
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                  setVoiceOpen(true);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="keyboard-voice" size={26} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={searchText ? styles.resultContent : styles.content}>
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
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    backgroundColor: '#EAF4FF',
  },
  header: {
    minHeight: normalize(52),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(5),
  },
  backButton: {
    marginRight: normalize(8),
  },
  headerTitle: {
    fontFamily: Fonts.InterBold,
    fontSize: 22,
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: normalize(18),
  },
  searchContent: {
    paddingHorizontal: normalize(18),
    paddingTop: normalize(14),
  },
  resultContent: {
    flex: 1,
    width: normalize(330),
    paddingHorizontal: normalize(18),
  },
  searchBox: {
    minHeight: normalize(40),
    borderRadius: normalize(10),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(5),
    marginBottom: normalize(25),
  },
  searchInput: {
    flex: 1,
    marginHorizontal: normalize(10),
    paddingVertical: normalize(5),
    fontFamily: Fonts.InterMedium,
    fontSize: 15,
    color: '#111111',
  },
  defaultContent: {
    flexGrow: 1,
    paddingBottom: normalize(80),
  },
  sectionTitle: {
    fontFamily: Fonts.InterBold,
    fontSize: 18,
    color: '#000000',
    marginBottom: normalize(10),
  },
  specialtyRow: {
    minHeight: normalize(38),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  specialtyText: {
    flex: 1,
    fontFamily: Fonts.InterRegular,
    fontSize: 15,
    color: '#000000',
    marginRight: normalize(12),
  },
  alphaTitle: {
    marginTop: normalize(26),
  },
  letterContent: {
    paddingBottom: normalize(12),
    paddingRight: normalize(18),
  },
  letterButton: {
    height: normalize(38),
    width: normalize(38),
    borderRadius: normalize(38),
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalize(12),
  },
  letterButtonActive: {
    backgroundColor: '#0888D8',
    borderColor: '#0888D8',
  },
  letterButtonDisabled: {
    opacity: 0.35,
  },
  letterText: {
    fontFamily: Fonts.InterBold,
    fontSize: 14,
    color: '#000000',
  },
  letterTextActive: {
    color: '#FFFFFF',
  },
  letterTextDisabled: {
    color: '#6B7280',
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

export default GuestSpecialitySearch;
