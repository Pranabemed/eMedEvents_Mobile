/**
 * Statevault screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, status1, Statevault.
 */

import { Platform, Dimensions, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { stateCourseRequest, stateMandatoryRequest, stateReportingRequest } from '../../Redux/Reducers/DashboardReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Statevaultcomponet from './Statevaultcomponet';
import { styles } from './Statevaultstyes';
import moment from 'moment';
import CMEChecklistModal from './CMEChecklistModal';
import { professionvaultRequest } from '../../Redux/Reducers/CreditVaultReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../Utils/Helpers/constants';
import Colorpath from '../../Themes/Colorpath';
import StateVaultModal from './StateVaultModal';

/**
 * Reusable Statevault component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
let status = "";
/**
 * Status1 string constant.
 * @returns {string}
 */
let status1 = "";
/**
 * Statevault component.
 * @param {Object} props - Input object.
 * @param {*} props.modalshow - Nested property value.
 * @param {*} props.setModalShow - Nested property value.
 * @param {*} props.renewalCheck - Nested property value.
 * @param {*} props.allProfession - Nested property value.
 * @param {*} props.count - Nested property value.
 * @param {*} props.onhandle - Nested property value.
 * @param {*} props.oncmeModalclose - Nested property value.
 * @param {*} props.searchTopicName - Nested property value.
 * @param {*} props.isfocused - Nested property value.
 * @param {*} props.setStatepick - Nested property value.
 * @param {*} props.statepick - Nested property value.
 * @param {*} props.navigation - Nested property value.
 * @param {*} props.dispatch - Nested property value.
 * @param {*} props.DashboardReducer - Nested property value.
 * @param {*} props.CreditVaultReducer - Nested property value.
 * @param {*} props.AuthReducer - Nested property value.
 * @param {*} props.statewise - Nested property value.
 * @param {*} props.setStatewise - Nested property value.
 * @param {*} props.clisttopic - Nested property value.
 * @param {*} props.setClisttopic - Nested property value.
 * @param {*} props.selectCountrytopic - Nested property value.
 * @param {*} props.setSelectCountrytopic - Nested property value.
 * @param {*} props.searchtexttopic - Nested property value.
 * @param {*} props.setSearchtexttopic - Nested property value.
 * @param {*} props.stateid - Nested property value.
 * @param {*} props.setStateid - Nested property value.
 * @param {*} props.creditwise - Nested property value.
 * @param {*} props.setCreditwise - Nested property value.
 * @param {*} props.expireDatecredit - Nested property value.
 * @param {*} props.setExpireDatecredit - Nested property value.
 * @param {*} props.countdownMessagecredit - Nested property value.
 * @param {*} props.setCountdownMessagecredit - Nested property value.
 * @param {*} props.loadingCreditwise - Nested property value.
 * @param {*} props.setLoadingCreditwise - Nested property value.
 * @param {*} props.loadingStatewise - Nested property value.
 * @param {*} props.setLoadingStatewise - Nested property value.
 * @param {*} props.boardname - Nested property value.
 * @param {*} props.setBoardname - Nested property value.
 * @param {*} props.licesense - Nested property value.
 * @param {*} props.setLicesense - Nested property value.
 * @param {*} props.totalCredit - Nested property value.
 * @param {*} props.setTotalCredit - Nested property value.
 * @param {*} props.mancredit - Nested property value.
 * @param {*} props.setMancredit - Nested property value.
 * @param {*} props.mantopiccredit - Nested property value.
 * @param {*} props.setMantopiccredit - Nested property value.
 * @param {*} props.gencredit - Nested property value.
 * @param {*} props.setGencredit - Nested property value.
 * @param {*} props.gentopiccredit - Nested property value.
 * @param {*} props.setGentopiccredit - Nested property value.
 * @param {*} props.expirelicno - Nested property value.
 * @param {*} props.setExpirelicno - Nested property value.
 * @param {*} props.certificatedata - Nested property value.
 * @param {*} props.setCertificatedata - Nested property value.
 * @param {*} props.cmemodal - Nested property value.
 * @param {*} props.setCmemodal - Nested property value.
 * @param {*} props.allProfessionData - Nested property value.
 * @param {*} props.setAllProfessionData - Nested property value.
 * @param {*} props.renewalvault - Nested property value.
 * @param {*} props.setRenewalvault - Nested property value.
 * @param {*} props.vaultState - Nested property value.
 * @returns {JSX.Element}
 */
const Statevault = ({ modalshow,
    setModalShow,renewalCheck,allProfession,count,onhandle,oncmeModalclose,searchTopicName,isfocused, setStatepick, statepick,navigation,
    dispatch,
    DashboardReducer,
    CreditVaultReducer,
    AuthReducer,
    statewise,
    setStatewise,
    clisttopic,
    setClisttopic,
     selectCountrytopic,
     setSelectCountrytopic,
     searchtexttopic,
     setSearchtexttopic,
     stateid,
     setStateid,
     creditwise,
     setCreditwise,
     expireDatecredit,
     setExpireDatecredit,
     countdownMessagecredit,
     setCountdownMessagecredit,
     loadingCreditwise,
     setLoadingCreditwise,
     loadingStatewise,
     setLoadingStatewise,
     boardname,
     setBoardname,
     licesense,
     setLicesense,
     totalCredit,
     setTotalCredit,
     mancredit,
     setMancredit,
     mantopiccredit,
     setMantopiccredit,
     gencredit,
     setGencredit,
     gentopiccredit,
     setGentopiccredit,
     expirelicno,
     setExpirelicno,
     certificatedata,
     setCertificatedata,
     cmemodal,
     setCmemodal,
     allProfessionData,
     setAllProfessionData,
     renewalvault,
     setRenewalvault,vaultState }) => {
  
    return (
        <>
        { (
            <Statevaultcomponet
                modalshow={modalshow}
                setModalShow={setModalShow}
                renewalCheck={renewalCheck}
                count={count}
                navigation={navigation}
                clisttopic={clisttopic}
                setStatepick={setStatepick}
                styles={styles}
                statewise={statewise}
                statepick={statepick}
                searchtexttopic={searchtexttopic}
                searchTopicName={searchTopicName}
                setStateid={setStateid}
                creditwise={creditwise}
                setStatewise={setStatewise}
                stateCourseRequest={stateCourseRequest}
                dispatch={dispatch}
                stateid={stateid}
                countdownMessagecredit={countdownMessagecredit}
                expireDatecredit={expireDatecredit}
                setCreditwise={setCreditwise}
                loadingCreditwise={loadingCreditwise}
                setLoadingCreditwise={setLoadingCreditwise}
                setLoadingStatewise={setLoadingStatewise}
                loadingStatewise={loadingStatewise}
                isfocused={isfocused}
                boardname={boardname}
                setBoardname={setBoardname}
                licesense={licesense}
                totalCredit={totalCredit}
                mancredit={mancredit}
                mantopiccredit={mantopiccredit}
                gencredit={gencredit}
                gentopiccredit={gentopiccredit}
                expirelicno={expirelicno}
                setExpirelicno={setExpirelicno}
                setCertificatedata={setCertificatedata}
                certificatedata={certificatedata}
                setCmemodal={setCmemodal}
                cmemodal={cmemodal}
                renewalvault={renewalvault}
                vaultState={vaultState}
            />
        )}
    
        <CMEChecklistModal
            allProfessionData={allProfessionData}
            setAllProfessionData={setAllProfessionData}
            onCMEClose={oncmeModalclose}
            onSaved={onhandle}
            isVisibelCME={cmemodal}
            allProfession={allProfession}
            certificatedata={certificatedata}
        />
    </>
    
    )
}
/**
 * Statevault default export.
 *
 * @returns {*}
 */
export default Statevault