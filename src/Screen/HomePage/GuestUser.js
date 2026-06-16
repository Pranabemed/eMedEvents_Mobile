/**
 * File Name: GuestUser.js
 * Module: Guest User
 * Purpose: Container screen for guest home state, Redux orchestration, and modal/checklist coordination.
 * Author: Codex
 * Created Date: 2026-06-03
 * Last Modified: 2026-06-03
 * Dependencies: react, react-native, @react-navigation/native, react-redux, ../../Utils/Helpers/NetInfo, ../../Utils/Helpers/Toast, ../../Redux/Reducers/GuestReducer, ../../Redux/Reducers/AuthReducer, ../../Redux/Reducers/CreditVaultReducer, ../../Redux/Reducers/CMEReducer, ./GuestUserView, ../../Themes/Colorpath
 */
import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler } from 'react-native';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { getApi } from '../../Utils/Helpers/ApiRequest';
import { getPublicIP } from '../../Utils/Helpers/IPServer';
import { AboutusRequest, HomelistRequest } from '../../Redux/Reducers/GuestReducer';
import { professionvaultRequest } from '../../Redux/Reducers/CreditVaultReducer';
import { clearCmeCourseData } from '../../Redux/Reducers/CMEReducer';
import GuestUserView from './GuestUserView';
import { StyleSheet, View } from 'react-native';
import Colorpath from '../../Themes/Colorpath';
import { AppContext } from '../GlobalSupport/AppContext';
import IntOff from '../../Utils/Helpers/IntOff';

const getStateId = stateObj => stateObj?.id ?? stateObj?.state_id;

const getCountryFromIP = async ip => {
  try {
    if (!ip) {
      return 'unknown';
    }

    const res = await fetch(`https://ipinfo.io/${ip}/json`);
    const text = await res.text();
    if (text.startsWith('<')) {
      throw new Error('HTML response');
    }

    const data = JSON.parse(text);
    return String(data?.country || 'unknown').trim().toUpperCase();
  } catch (e) {
    console.log('GuestUser geo lookup failed:', e);
    return 'unknown';
  }
};

/**
 * Description: Guest user home container screen.
 * Purpose: Owns Redux integration, guest selection state, and request orchestration for the guest home flow.
 *
 * Params:
 * @param {Object} props
 *
 * Returns:
 * @returns {JSX.Element}
 *
 * Flow:
 * 1. Fetch base guest home, about-us, and state data.
 * 2. Sync checklist request state with Redux reducer statuses.
 * 3. Build a `guest` view-model for `GuestUserView`.
 * 4. Reset stale guest selections across navigation cycles.
 *
 * API Used:
 * Guest home list, about us, state list, profession vault APIs
 *
 * Redux Actions:
 * `HomelistRequest`, `AboutusRequest`, `stateRequest`, `professionvaultRequest`, `clearCmeCourseData`
 *
 * Error Handling:
 * Uses `showErrorAlert` for connectivity failures and guards checklist-open timing.
 */
const GuestUser = props => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { isConnected } = useContext(AppContext);
  const GuestReducer = useSelector(state => state.GuestReducer);
  const CreditVaultReducer = useSelector(state => state.CreditVaultReducer);

  const [profModalVisible, setProfModalVisible] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [stateSearchText, setStateSearchText] = useState('');
  const [cmeModalVisible, setCmeModalVisible] = useState(false);
  const [allProfessionData, setAllProfessionData] = useState(null);
  const [shouldOpenCmeChecklist, setShouldOpenCmeChecklist] = useState(false);
  const [cmeRequestKey, setCmeRequestKey] = useState('');
  const [handledCmeRequestKey, setHandledCmeRequestKey] = useState('');
  const [cmeRequestStarted, setCmeRequestStarted] = useState(false);
  const [isGuestHomeLoading, setIsGuestHomeLoading] = useState(true);
  const [handledGuestResetAt, setHandledGuestResetAt] = useState(null);
  const [guestUsaStates, setGuestUsaStates] = useState([]);
  const [isUsaUser, setIsUsaUser] = useState(true);

  const shouldResetRef = useRef(false);
  const guestHomeRequestInFlightRef = useRef(false);
  const guestProtectedRoutes = useMemo(() => new Set([
    'Statewebcast',
    'Globalresult',
    'BrowseScreen',
    'GuestSpecialitySearch',
    'SearchScreen',
    'SearchResult',
    'SpeakerProfile',
    'CMERequirement',
    'CheckMembership',
  ]), []);

  const canUseGuestNetworkFlow = isConnected !== false;

  const navigateIfOnline = useCallback((screenName, params) => {
    if (!screenName) return false;

    if (!canUseGuestNetworkFlow && guestProtectedRoutes.has(screenName)) {
      return false;
    }

    props.navigation.navigate(screenName, params);
    return true;
  }, [canUseGuestNetworkFlow, guestProtectedRoutes, props.navigation]);

  /** Description: Resets guest-only UI state. Purpose: Prevents stale selections across navigation sessions. */
  const resetGuestSelections = useCallback(() => {
    setProfModalVisible(false);
    setStateModalVisible(false);
    setCmeModalVisible(false);
    setSelectedProfession('');
    setSelectedState(null);
    setStateSearchText('');
    setAllProfessionData(null);
    setShouldOpenCmeChecklist(false);
    setCmeRequestKey('');
    setHandledCmeRequestKey('');
    setCmeRequestStarted(false);
    dispatch(clearCmeCourseData());
  }, [dispatch]);

  useEffect(() => {
    const unsubscribeBlur = props.navigation.addListener('blur', () => {
      if (selectedProfession || selectedState) {
        shouldResetRef.current = true;
      }
    });
    const unsubscribeFocus = props.navigation.addListener('focus', () => {
      if (shouldResetRef.current) {
        resetGuestSelections();
        shouldResetRef.current = false;
      }
    });
    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, [props.navigation, selectedProfession, selectedState, resetGuestSelections]);

  useEffect(() => {
    const initPlayerSession = async () => {
      try {
        const session = await AsyncStorage.getItem('PLAYERSESSION');
        if (!session) {
          const guestSessionId = String(Math.floor(10000000000 + Math.random() * 90000000000));
          await AsyncStorage.setItem('PLAYERSESSION', guestSessionId);
        }
      } catch (err) {
        console.log('Error initializing guest player session ID:', err);
      }
    };
    if (isFocused) {
      initPlayerSession();
    }
  }, [isFocused]);

  useEffect(() => {
    const onBackPress = () => {
      if (props.navigation.canGoBack()) {
        props.navigation.goBack();
      } else {
        props.navigation.navigate('Onboard');
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [props.navigation]);

  useEffect(() => {
    let isMounted = true;

    const fetchGuestUsaStates = async () => {
      if (!canUseGuestNetworkFlow) {
        if (isMounted) {
          setGuestUsaStates([]);
          setIsUsaUser(true);
        }
        return;
      }

      try {
        await connectionrequest();
        if (isMounted) {
          setIsUsaUser(true);
        }

        const response = await getApi('master/states?country_id=1');
        const states = Array.isArray(response?.data?.states) ? response.data.states : [];

        if (isMounted) {
          setGuestUsaStates(states);
        }
      } catch (err) {
        if (isMounted) {
          setGuestUsaStates([]);
          setIsUsaUser(true);
        }
        console.warn('Failed to fetch guest USA states:', err);
      }
    };

    fetchGuestUsaStates();

    return () => {
      isMounted = false;
    };
  }, [canUseGuestNetworkFlow]);

  useEffect(() => {
    if (
      shouldOpenCmeChecklist &&
      cmeRequestKey &&
      cmeRequestStarted &&
      handledCmeRequestKey !== cmeRequestKey &&
      CreditVaultReducer?.status === 'CreditVault/professionvaultSuccess'
    ) {
      setAllProfessionData(CreditVaultReducer?.professionvaultResponse);
      setCmeModalVisible(true);
      setHandledCmeRequestKey(cmeRequestKey);
      setShouldOpenCmeChecklist(false);
      setCmeRequestStarted(false);
    }
  }, [
    CreditVaultReducer?.status,
    CreditVaultReducer?.professionvaultResponse,
    cmeRequestKey,
    cmeRequestStarted,
    handledCmeRequestKey,
    shouldOpenCmeChecklist,
  ]);

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
    if (!isFocused) return;
    if (!canUseGuestNetworkFlow) {
      guestHomeRequestInFlightRef.current = false;
      setIsGuestHomeLoading(false);
      return;
    }
    setIsGuestHomeLoading(true);
    guestHomeRequestInFlightRef.current = true;
    connectionrequest()
      .then(() => {
        dispatch(HomelistRequest({ is_mobile: 1 }));
        dispatch(AboutusRequest({}));
      })
      .catch(err => {
        guestHomeRequestInFlightRef.current = false;
        setIsGuestHomeLoading(false);
        showErrorAlert('Please connect to internet', err);
      });
  }, [canUseGuestNetworkFlow, dispatch, isFocused]);
  useEffect(() => {
    if (GuestReducer?.status === 'Guest/HomelistRequest' && guestHomeRequestInFlightRef.current) {
      setIsGuestHomeLoading(true);
      return;
    }
    if (
      guestHomeRequestInFlightRef.current &&
      (
        GuestReducer?.status === 'Guest/HomelistSuccess' ||
        GuestReducer?.status === 'Guest/HomelistFailure'
      )
    ) {
      guestHomeRequestInFlightRef.current = false;
      setIsGuestHomeLoading(false);
    }
  }, [GuestReducer?.status]);

  useEffect(() => {
    const resetAt = props?.route?.params?.resetGuestSelectionsAt;
    if (!isFocused || !resetAt || handledGuestResetAt === resetAt) return;

    resetGuestSelections();
    setHandledGuestResetAt(resetAt);
    props.navigation.setParams({ resetGuestSelectionsAt: null });
  }, [
    handledGuestResetAt,
    isFocused,
    props.navigation,
    props?.route?.params?.resetGuestSelectionsAt,
    resetGuestSelections,
  ]);

  useEffect(() => {
    const stateId = getStateId(selectedState);
    if (shouldOpenCmeChecklist && selectedProfession && stateId != null) {
      const didNavigate = navigateIfOnline('CMERequirement', {
        initialState: selectedState,
        initialProfession: selectedProfession,
      });
      if (didNavigate) {
        resetGuestSelections();
      }
    }
  }, [navigateIfOnline, selectedProfession, selectedState, shouldOpenCmeChecklist, resetGuestSelections]);

  /** Description: Opens the featured activity detail screen. Purpose: Centralizes guest activity routing. */
  const openFeaturedActivity = detailpageUrl => {
    if (!canUseGuestNetworkFlow) return;
    if (!detailpageUrl) return;
    const slug = String(detailpageUrl).split('/').pop();
    if (!slug) return;
    navigateIfOnline('Statewebcast', {
      webCastURL: { webCastURL: slug, shareUrl: detailpageUrl, detailpage_url: detailpageUrl, Realback: 'guest' },
    });
  };

  const guestNavigation = useMemo(() => ({
    ...props.navigation,
    navigate: (screenName, params) => navigateIfOnline(screenName, params),
  }), [navigateIfOnline, props.navigation]);

  const homeData =
    GuestReducer?.HomelistResponse?.data && typeof GuestReducer?.HomelistResponse?.data === 'object'
      ? GuestReducer?.HomelistResponse?.data
      : GuestReducer?.HomelistResponse || {};
  const aboutUsData =
    GuestReducer?.AboutusResponse?.data && typeof GuestReducer?.AboutusResponse?.data === 'object'
      ? GuestReducer?.AboutusResponse?.data
      : GuestReducer?.AboutusResponse || {};

  const stateList = guestUsaStates;

  const guest = {
    navigation: guestNavigation,
    homeData,
    aboutUsData,
    homeStatus: GuestReducer?.status,
    isGuestHomeLoading,
    stateList,
    isUsaUser,
    selectedProfession,
    selectedState,
    stateSearchText,
    setStateSearchText,
    profModalVisible,
    setProfModalVisible,
    stateModalVisible,
    setStateModalVisible,
    handleProfessionSelect: prof => {
      setHandledCmeRequestKey('');
      setCmeRequestStarted(false);
      setShouldOpenCmeChecklist(true);
      setSelectedProfession(prof);
      setProfModalVisible(false);
    },
    handleStateSelect: (stateObj, source) => {
      if (source === 'profile') {
        setHandledCmeRequestKey('');
        setCmeRequestStarted(false);
      }
      setShouldOpenCmeChecklist(source === 'profile');
      setSelectedState(stateObj);
      setStateModalVisible(false);
      setStateSearchText('');
    },
    handleStatePress: () => {
      setStateSearchText('');
      setStateModalVisible(true);
    },
    cmeModalVisible,
    allProfessionData,
    setAllProfessionData,
    allProfession: selectedProfession,
    certificatedata: { state_id: getStateId(selectedState) },
    onCMEClose: () => setCmeModalVisible(false),
    onSaved: () => setCmeModalVisible(false),
    cmeRealback: 'guest',
    onFeaturedActivityPress: openFeaturedActivity,
  };

  return (
    <View style={styles.container}>
      {canUseGuestNetworkFlow ? <GuestUserView guest={guest} /> : <IntOff />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colorpath.Pagebg,
  },
});

export default GuestUser;
