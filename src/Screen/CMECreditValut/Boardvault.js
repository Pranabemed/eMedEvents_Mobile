/**
 * Boardvault screen module. Renders a React Native screen or a screen-scoped support component. Exported members: status, Boardvault.
 */

import { Platform, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import showErrorAlert from '../../Utils/Helpers/Toast';
import Boardvaultcomponent from './Boardvaultcomponent';
import { boardvaultRequest } from '../../Redux/Reducers/CreditVaultReducer';
import moment from 'moment';

/**
 * Reusable Boardvault component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */
let status = "";
/**
 * Boardvault component.
 * @param {Object} props - Input object.
 * @param {*} props.takeID - Nested property value.
 * @param {*} props.isfocused - Nested property value.
 * @param {*} props.navigation - Nested property value.
 * @param {*} props.dispatch - Nested property value.
 * @param {*} props.statepickboard - Nested property value.
 * @param {*} props.setStatepickboard - Nested property value.
 * @param {*} props.statewiseboard - Nested property value.
 * @param {*} props.setStatewiseboard - Nested property value.
 * @param {*} props.clisttopicboard - Nested property value.
 * @param {*} props.setClisttopicboard - Nested property value.
 * @param {*} props.selectCountrytopicboard - Nested property value.
 * @param {*} props.setSelectCountrytopicboard - Nested property value.
 * @param {*} props.searchtexttopicboard - Nested property value.
 * @param {*} props.setSearchtexttopicboard - Nested property value.
 * @param {*} props.stateidboard - Nested property value.
 * @param {*} props.setStateidboard - Nested property value.
 * @param {*} props.expireDatecreditboard - Nested property value.
 * @param {*} props.setExpireDatecreditboard - Nested property value.
 * @param {*} props.countdownMessagecreditboard - Nested property value.
 * @param {*} props.setCountdownMessagecreditboard - Nested property value.
 * @param {*} props.loadingCreditwiseboard - Nested property value.
 * @param {*} props.setLoadingCreditwiseboard - Nested property value.
 * @param {*} props.loadingStatewiseboard - Nested property value.
 * @param {*} props.setLoadingStatewiseboard - Nested property value.
 * @param {*} props.boardnameboard - Nested property value.
 * @param {*} props.setBoardnameboard - Nested property value.
 * @param {*} props.licesenseboard - Nested property value.
 * @param {*} props.setLicesenseboard - Nested property value.
 * @param {*} props.totalCreditboard - Nested property value.
 * @param {*} props.setTotalCreditboard - Nested property value.
 * @param {*} props.mancreditboard - Nested property value.
 * @param {*} props.setMancreditboard - Nested property value.
 * @param {*} props.mantopiccreditboard - Nested property value.
 * @param {*} props.setMantopiccreditboard - Nested property value.
 * @param {*} props.gencreditboard - Nested property value.
 * @param {*} props.setGencreditboard - Nested property value.
 * @param {*} props.gentopiccreditboard - Nested property value.
 * @param {*} props.setGentopiccreditboard - Nested property value.
 * @param {*} props.boardexpiredate - Nested property value.
 * @param {*} props.setBoardexpiredate - Nested property value.
 * @param {*} props.certificateboard - Nested property value.
 * @param {*} props.setCertificatebaord - Nested property value.
 * @param {*} props.lengthcheck - Nested property value.
 * @param {*} props.setLengthcheck - Nested property value.
 * @param {*} props.searchTopicNameboard - Nested property value.
 * @param {*} props.handleBoardname - Nested property value.
 * @param {*} props.styles - Nested property value.
 * @returns {JSX.Element}
 */
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
/**
 * Boardvault default export.
 *
 * @returns {*}
 */
export default Boardvault