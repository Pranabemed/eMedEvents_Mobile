import React, { memo, useState, useEffect, useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View, Modal, FlatList, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colorpath from '../../../../Themes/Colorpath';
import Imagepath from '../../../../Themes/Imagepath';
import Fonts from '../../../../Themes/Fonts';
import styles from '../../GuestUser.styles';
import { scale, getStateSlug, getStateName } from '../utils/guestUserCore';
import normalize from '../../../../Utils/Helpers/Dimen';
import { getApi } from '../../../../Utils/Helpers/ApiRequest';
import getUserAgentJSON from '../../../../Utils/Helpers/UserAgent';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Description: Guest home header component.
 * Purpose: Displays logo, state selector, sign-in action, and search CTA.
 */
const GuestHomeHeaderComponent = ({ width, navigation, selectedState, stateCode, onOpenStatePicker, isUsaUser, renderTopOnly, renderSearchOnly }) => {
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [statesList, setStatesList] = useState([]);

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

  useEffect(() => {
    if (isUsaUser === false) return;
    const fetchStates = async () => {
      try {
        getUserAgentJSON();
        const response = await getApi('master/states?country_id=1');
        if (response?.data?.states) {
          setStatesList(response.data.states);
        }
      } catch (err) {
        console.warn('Failed to fetch states list:', err);
      }
    };
    fetchStates();
  }, [isUsaUser]);

  const filteredStates = (statesList || []).filter(item => {
    const name = String(item?.name || item?.state_name || item?.title || '').toLowerCase();
    return name.includes(stateSearch.toLowerCase().trim());
  });

  const handleStateSelect = (stateObj) => {
    setStateModalVisible(false);
    setStateSearch('');
    
    const stateName = getStateName(stateObj).toLowerCase().trim().replace(/\s+/g, '-');

    navigation.navigate('Globalresult', {
      trig: {
        "pageno": 1,
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
        "searchKeyword": "",
        "request_type": "stateconferences",
        "country": "usa-medical-conferences",
        "state": stateName,
        "": ""
      }
    });
  };

  const handleSignInPress = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('GUEST_REGISTRATION_FLOW'),
        AsyncStorage.removeItem('GUEST_PRIME_VERIFICATION_PENDING'),
        AsyncStorage.removeItem('CHECK_MEMBERSHIP_FORCE_NEW_PROFESSION'),
      ]);
    } catch (err) {
      console.warn('Failed to clear guest sign-in flags:', err);
    }

    navigation.navigate('Login');
  };

  if (renderTopOnly) {
    return (
      <>
        <View style={styles.topBar}>
          <Image
            source={Imagepath.Logo}
            style={[styles.logo, { width: scale(width, 40), height: scale(width, 40) }]}
            resizeMode="contain"
          />
          <View style={styles.topActions}>
            {isUsaUser !== false && (
              <TouchableOpacity style={styles.langPill} onPress={() => setStateModalVisible(true)}>
                <Text style={styles.langText}>{stateCode || 'State'}</Text>
                <Icon name="keyboard-arrow-down" size={20} color={Colorpath.black} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.signInButton} onPress={handleSignInPress}>
              <Text style={styles.signInText}>SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={stateModalVisible} transparent animationType="slide">
          <SafeAreaView style={modalStyles.stateModalContainer}>
            <View style={modalStyles.stateModalHeader}>
              <TouchableOpacity
                onPress={() => {
                  setStateModalVisible(false);
                  setStateSearch('');
                }}
                style={modalStyles.backButton}
              >
                <Icon name="close" size={normalize(24)} color="#333333" />
              </TouchableOpacity>
              <Text style={modalStyles.stateModalTitle}>Select State</Text>
              <View style={{ width: normalize(24) }} />
            </View>

            <View style={modalStyles.searchBarContainer}>
              <Icon
                name="search"
                size={normalize(20)}
                color="#9CA3AF"
                style={modalStyles.searchIcon}
              />
              <TextInput
                style={modalStyles.searchInput}
                placeholder="Search State"
                placeholderTextColor="#9CA3AF"
                value={stateSearch}
                onChangeText={setStateSearch}
              />
              {stateSearch.length > 0 ? (
                <TouchableOpacity onPress={() => setStateSearch('')}>
                  <Icon name="clear" size={normalize(20)} color="#9CA3AF" />
                </TouchableOpacity>
              ) : null}
            </View>

            <FlatList
              data={filteredStates}
              keyExtractor={(item, index) => String(item?.id ?? item?.state_id ?? index)}
              contentContainerStyle={modalStyles.stateList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={<Text style={modalStyles.emptyText}>No states found</Text>}
              renderItem={({ item }) => {
                const name = getStateName(item);
                return (
                  <TouchableOpacity
                    style={modalStyles.stateItem}
                    onPress={() => handleStateSelect(item)}
                  >
                    <Text style={modalStyles.stateItemText}>{name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </SafeAreaView>
        </Modal>
      </>
    );
  }

  if (renderSearchOnly) {
    return (
      <Pressable
        style={styles.searchBar}
        onPress={() =>
          navigation.navigate('GuestSpecialitySearch', {
            taskData: {
              statid: selectedState?.id ?? '',
              creditID: selectedState ?? null,
              isGuest: true,
            },
          })
        }
      >
        <SearchIcon name="search" size={20} color="#9CA3AF" />
        <View style={styles.searchTextScroll}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.searchText}>
            {placeholders[placeholderIndex]}
          </Text>
        </View>
        <Icon name="mic-none" size={20} color="#9CA3AF" />
      </Pressable>
    );
  }

  return (
    <>
      <View style={styles.topBar}>
        <Image
          source={Imagepath.Logo}
          style={[styles.logo, { width: scale(width, 40), height: scale(width, 40) }]}
          resizeMode="contain"
        />
        <View style={styles.topActions}>
          {isUsaUser !== false && (
            <TouchableOpacity style={styles.langPill} onPress={() => setStateModalVisible(true)}>
              <Text style={styles.langText}>{stateCode || 'State'}</Text>
              <Icon name="keyboard-arrow-down" size={20} color={Colorpath.black} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.signInButton} onPress={handleSignInPress}>
            <Text style={styles.signInText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Pressable
        style={styles.searchBar}
        onPress={() =>
          navigation.navigate('GuestSpecialitySearch', {
            taskData: {
              statid: selectedState?.id ?? '',
              creditID: selectedState ?? null,
              isGuest: true,
            },
          })
        }
      >
        <SearchIcon name="search" size={20} color="#9CA3AF" />
        <View style={styles.searchTextScroll}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.searchText}>
            {placeholders[placeholderIndex]}
          </Text>
        </View>
        <Icon name="mic-none" size={20} color="#9CA3AF" />
      </Pressable>

      <Modal visible={stateModalVisible} transparent animationType="slide">
        <SafeAreaView style={modalStyles.stateModalContainer}>
          <View style={modalStyles.stateModalHeader}>
            <TouchableOpacity
              onPress={() => {
                setStateModalVisible(false);
                setStateSearch('');
              }}
              style={modalStyles.backButton}
            >
              <Icon name="close" size={normalize(24)} color="#333333" />
            </TouchableOpacity>
            <Text style={modalStyles.stateModalTitle}>Select State</Text>
            <View style={{ width: normalize(24) }} />
          </View>

          <View style={modalStyles.searchBarContainer}>
            <Icon
              name="search"
              size={normalize(20)}
              color="#9CA3AF"
              style={modalStyles.searchIcon}
            />
            <TextInput
              style={modalStyles.searchInput}
              placeholder="Search State"
              placeholderTextColor="#9CA3AF"
              value={stateSearch}
              onChangeText={setStateSearch}
            />
            {stateSearch.length > 0 ? (
              <TouchableOpacity onPress={() => setStateSearch('')}>
                <Icon name="clear" size={normalize(20)} color="#9CA3AF" />
              </TouchableOpacity>
            ) : null}
          </View>

          <FlatList
            data={filteredStates}
            keyExtractor={(item, index) => String(item?.id ?? item?.state_id ?? index)}
            contentContainerStyle={modalStyles.stateList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={modalStyles.emptyText}>No states found</Text>}
            renderItem={({ item }) => {
              const name = getStateName(item);
              return (
                <TouchableOpacity
                  style={modalStyles.stateItem}
                  onPress={() => handleStateSelect(item)}
                >
                  <Text style={modalStyles.stateItemText}>{name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

const modalStyles = StyleSheet.create({
  stateModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stateModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(14),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: normalize(4),
  },
  stateModalTitle: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(18),
    color: '#111827',
    fontWeight: 'bold',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: normalize(8),
    marginHorizontal: normalize(16),
    marginVertical: normalize(12),
    paddingHorizontal: normalize(12),
    height: normalize(44),
  },
  searchIcon: {
    marginRight: normalize(8),
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(14),
    color: '#111827',
    padding: 0,
  },
  stateList: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(20),
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(14),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stateItemText: {
    fontFamily: Fonts.InterRegular,
    fontSize: 16,
    color: '#374151',
  },
  emptyText: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(14),
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: normalize(20),
  },
});

export const GuestHomeHeader = memo(GuestHomeHeaderComponent);
