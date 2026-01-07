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
let status = "";
let status1 = "";
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
export default Statevault