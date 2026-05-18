import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import { HomelistRequest } from '../../Redux/Reducers/GuestReducer';
import { stateRequest } from '../../Redux/Reducers/AuthReducer';
import { professionvaultRequest } from '../../Redux/Reducers/CreditVaultReducer';
import GuestUserView from './GuestUserView';

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

  useEffect(() => {
    dispatch(stateRequest(1));
  }, [dispatch]);

  useEffect(() => {
    if (CreditVaultReducer?.status === 'CreditVault/professionvaultSuccess') {
      setAllProfessionData(CreditVaultReducer?.professionvaultResponse);
      setCmeModalVisible(true);
    }
  }, [CreditVaultReducer?.status, CreditVaultReducer?.professionvaultResponse]);

  useEffect(() => {
    if (!isFocused) return;
    connectionrequest()
      .then(() => dispatch(HomelistRequest({})))
      .catch(err => showErrorAlert('Please connect to internet', err));
  }, [dispatch, isFocused]);

  useEffect(() => {
    if (selectedProfession && selectedState) {
      dispatch(
        professionvaultRequest({
          profession: selectedProfession,
          stateId: String(selectedState.id),
        }),
      );
    }
  }, [dispatch, selectedProfession, selectedState]);

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

  const stateList = Array.isArray(AuthReducer?.stateResponse?.data)
    ? AuthReducer?.stateResponse?.data
    : Array.isArray(AuthReducer?.stateResponse?.states)
      ? AuthReducer?.stateResponse?.states
      : [];

  const guest = {
    navigation: props.navigation,
    homeData,
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
      setSelectedProfession(prof);
      setProfModalVisible(false);
    },
    handleStateSelect: stateObj => {
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
    certificatedata: { state_id: selectedState?.id },
    onCMEClose: () => setCmeModalVisible(false),
    onSaved: () => setCmeModalVisible(false),
    onFeaturedActivityPress: openFeaturedActivity,
  };

  return <GuestUserView guest={guest} />;
};

export default GuestUser;
