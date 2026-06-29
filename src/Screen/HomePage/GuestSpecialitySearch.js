import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
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
import TextFieldIn from '../../Components/Textfield';

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
      <Image
        source={Imagepath.WrongArrw}
        style={styles.specialtyIcon}
      />
      <Text numberOfLines={1} style={styles.specialtyText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

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

  const placeholders = useMemo(() => [
    "Search for CME/CE courses",
    "Search for your state required courses ",
    "Search for topic",
    "Search for specialty",
    "Search for medical conferences",
    "Search for conferences by location "
  ], []);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prevIndex => (prevIndex + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);

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
        fromGuestSpecialitySearch: true,
      },
    });
  };

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

  const navigateToBrowse = () => {
    props.navigation.navigate('BrowseScreen', { creditData: taskData });
  };

  const renderDefaultContent = () => {
    if (browseLoading && topSpecialties.length === 0) {
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
        renderItem={({ item }) => (
          <SpecialtyItem item={item} onPress={openSpecialityResult} />
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
        contentContainerStyle={styles.defaultContent}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Popular specialties</Text>
            <TouchableOpacity onPress={navigateToBrowse}>
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
        <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
          <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}
            behavior={Platform.OS === 'ios' ? 'height' : undefined}
          >
            {Platform.OS === 'ios' ? (
              <View style={{ paddingHorizontal: normalize(10), flexDirection: 'row' }}>
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      borderBottomColor: '#000000',
                      borderBottomWidth: 0.5,
                      marginTop: normalize(2),
                    }}
                  >
                    <TextFieldIn
                      value={searchText}
                      onChangeText={searchContent}
                      height={normalize(40)}
                      width={normalize(275)}
                      backgroundColor={Colorpath.Pagebg}
                      color="#000000"
                      placeholder={placeholders[placeholderIndex]}
                      placeholderTextColor="#AAAAAA"
                      fontSize={16}
                      fontFamily={Fonts.InterRegular}
                      searchIcon={true}
                      leftIcon={Icon}
                      leftIconName="keyboard-arrow-left"
                      leftIconSize={35}
                      leftIconColor="#63748b"
                      leftIconStyle={{ marginLeft: normalize(-4), top: normalize(7) }}
                      onPressLeftIcon={goBack}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSearchText('');
                    setVoiceOpen(true);
                  }}
                  style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginTop: normalize(10),
                    height: normalize(30),
                    width: normalize(30),
                    borderRadius: normalize(30),
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                >
                  <Icon
                    style={{ alignSelf: 'center' }}
                    name="keyboard-voice"
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  marginTop: normalize(0),
                  paddingHorizontal: normalize(3),
                  flexDirection: 'row',
                  gap: 10,
                }}
              >
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      borderBottomColor: '#000000',
                      borderBottomWidth: 0.5,
                      marginTop: normalize(2),
                    }}
                  >
                    <TextFieldIn
                      value={searchText}
                      onChangeText={searchContent}
                      height={normalize(40)}
                      width={normalize(275)}
                      backgroundColor={Colorpath.Pagebg}
                      color="#000000"
                      placeholder={placeholders[placeholderIndex]}
                      placeholderTextColor="#AAAAAA"
                      fontSize={16}
                      fontFamily={Fonts.InterRegular}
                      searchIcon={true}
                      leftIcon={Icon}
                      leftIconName="keyboard-arrow-left"
                      leftIconSize={35}
                      leftIconColor="#63748b"
                      leftIconStyle={{ marginLeft: normalize(0), top: normalize(5) }}
                      onPressLeftIcon={goBack}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSearchText('');
                    setVoiceOpen(true);
                  }}
                  style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginTop: normalize(10),
                    height: normalize(30),
                    width: normalize(30),
                    borderRadius: normalize(30),
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                >
                  <Icon
                    style={{ alignSelf: 'center' }}
                    name="keyboard-voice"
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            )}

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

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: normalize(18),
  },
  defaultContent: {
    flexGrow: 1,
    paddingBottom: normalize(80),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalize(15),
    marginBottom: normalize(15),
  },
  sectionTitle: {
    fontFamily: Fonts.InterBold,
    fontSize: 20,
    color: '#000000',
  },
  browseAllText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 16,
    color: Colorpath.ButtonColr,
  },
  specialtyRow: {
    minHeight: normalize(34),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(4),
  },
  specialtyIcon: {
    height: normalize(14),
    width: normalize(14),
    tintColor: '#7F8C8D',
    resizeMode: 'contain',
    marginRight: normalize(10),
  },
  specialtyText: {
    flex: 1,
    fontFamily: Fonts.InterRegular,
    fontSize: 16,
    color: '#2C3E50',
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
