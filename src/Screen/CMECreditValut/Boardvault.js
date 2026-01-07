import { Platform, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Boardvaultcomponent from './Boardvaultcomponent';
import { boardvaultRequest } from '../../Redux/Reducers/CreditVaultReducer';
import moment from 'moment';
let status = "";
const Boardvault = ({takeID, isfocused,
    navigation,
    dispatch,
    statepickboard,
    setStatepickboard,
    statewiseboard,
    setStatewiseboard,
    clisttopicboard,
    setClisttopicboard,
    selectCountrytopicboard,
    setSelectCountrytopicboard,
    searchtexttopicboard,
    setSearchtexttopicboard,
    stateidboard,
    setStateidboard,
    expireDatecreditboard,
    setExpireDatecreditboard,
    countdownMessagecreditboard,
    setCountdownMessagecreditboard,
    loadingCreditwiseboard,
    setLoadingCreditwiseboard,
    loadingStatewiseboard,
    setLoadingStatewiseboard,
    boardnameboard,
    setBoardnameboard,
    licesenseboard,
    setLicesenseboard,
    totalCreditboard,
    setTotalCreditboard,
    mancreditboard,
    setMancreditboard,
    mantopiccreditboard,
    setMantopiccreditboard,
    gencreditboard,
    setGencreditboard,
    gentopiccreditboard,
    setGentopiccreditboard,
    boardexpiredate,
    setBoardexpiredate,
    certificateboard,
    setCertificatebaord,
    lengthcheck,
    setLengthcheck,
    searchTopicNameboard,
    handleBoardname,
    styles}) => {
   
    return (
       <Boardvaultcomponent
       takeID={takeID}
        navigation={navigation}
        clisttopic={clisttopicboard}
        setClisttopic={setClisttopicboard}
        setStatepick={setStatepickboard}
        styles={styles}
        statewise={statewiseboard}
        statepick={statepickboard}
        searchtexttopic={searchtexttopicboard}
        searchTopicName={searchTopicNameboard}
        setStateid={setStateidboard}
        setStatewise={setStatewiseboard}
        dispatch={dispatch}
        stateid={stateidboard}
        countdownMessagecredit={countdownMessagecreditboard}
        expireDatecredit={expireDatecreditboard}
        loadingCreditwise={loadingCreditwiseboard}
        setLoadingCreditwise={setLoadingCreditwiseboard}
        setLoadingStatewise={setLoadingStatewiseboard}
        loadingStatewise={loadingStatewiseboard}
        isfocused={isfocused}
        boardname={boardnameboard}
        licesense={licesenseboard}
        totalCredit={totalCreditboard}
        mancredit={mancreditboard}
        mantopiccredit={mantopiccreditboard}
        gencredit={gencreditboard}
        gentopiccredit={gentopiccreditboard}
        boardexpiredate={boardexpiredate}
        setBoardexpiredate={setBoardexpiredate}
        setBoardname={setBoardnameboard}
        certificateboard={certificateboard}
        setCertificatebaord={setCertificatebaord}
        setLengthcheck={setLengthcheck}
        lengthcheck={lengthcheck}
        handleBoardname={handleBoardname}
         />
    )
}
export default Boardvault