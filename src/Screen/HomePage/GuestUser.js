import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { AboutusRequest, HomelistRequest } from '../../Redux/Reducers/GuestReducer';
import { stateRequest } from '../../Redux/Reducers/AuthReducer';
import { professionvaultRequest } from '../../Redux/Reducers/CreditVaultReducer';
import { clearCmeCourseData } from '../../Redux/Reducers/CMEReducer';
import GuestUserView from './GuestUserView';
import { View } from 'react-native';
import Colorpath from '../../Themes/Colorpath';

const getStateId = stateObj => stateObj?.id ?? stateObj?.state_id;

const GuestUser = props => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const GuestReducer = useSelector(state => state.GuestReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);
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

  const shouldResetRef = useRef(false);

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
    dispatch(stateRequest(1));
  }, [dispatch]);

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
    setIsGuestHomeLoading(true);
    connectionrequest()
      .then(() => {
        dispatch(HomelistRequest({ is_mobile: 1 }));
        dispatch(AboutusRequest({}));
      })
      .catch(err => showErrorAlert('Please connect to internet', err));
  }, [dispatch, isFocused]);
  useEffect(() => {
    if (GuestReducer?.status === 'Guest/HomelistRequest') {
      setIsGuestHomeLoading(true);
      return;
    }
    if (
      GuestReducer?.status === 'Guest/HomelistSuccess' ||
      GuestReducer?.status === 'Guest/HomelistFailure'
    ) {
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
      const requestKey = `${selectedProfession}-${stateId}`;
      setCmeRequestKey(requestKey);
      dispatch(
        professionvaultRequest({
          profession: selectedProfession,
          stateId: String(stateId),
        }),
      );
    }
  }, [dispatch, selectedProfession, selectedState, shouldOpenCmeChecklist]);

  const openFeaturedActivity = detailpageUrl => {
    if (!detailpageUrl) return;
    const slug = String(detailpageUrl).split('/').pop();
    if (!slug) return;
    props.navigation.navigate('Statewebcast', {
      webCastURL: { webCastURL: slug, Realback: 'guest' },
    });
  };

  const homeData =
    GuestReducer?.HomelistResponse?.data && typeof GuestReducer?.HomelistResponse?.data === 'object'
      ? GuestReducer?.HomelistResponse?.data
      : GuestReducer?.HomelistResponse || {};
  const aboutUsData =
    GuestReducer?.AboutusResponse?.data && typeof GuestReducer?.AboutusResponse?.data === 'object'
      ? GuestReducer?.AboutusResponse?.data
      : GuestReducer?.AboutusResponse || {};

  const stateList = Array.isArray(AuthReducer?.stateResponse?.data)
    ? AuthReducer?.stateResponse?.data
    : Array.isArray(AuthReducer?.stateResponse?.states)
      ? AuthReducer?.stateResponse?.states
      : [];

  const guest = {
    navigation: props.navigation,
    homeData,
    aboutUsData,
    homeStatus: GuestReducer?.status,
    isGuestHomeLoading,
    stateList,
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
      dispatch(stateRequest(1));
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
    <View style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
      <GuestUserView guest={guest} />
    </View>
  );
};

export default GuestUser;
