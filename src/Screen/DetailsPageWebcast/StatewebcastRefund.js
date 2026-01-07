import { View, Text } from 'react-native'
import React from 'react'
import ConferenceSummary from './ConferenceSummary'
import RefundHtml from './Refund'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
const StatewebcastRefund = ({conferenceText,conferenceHtml,expandcon,conferShows,width,webcastdeatils,refundtext,disclaimerText,refunded,refundExpand}) => {
  return (
    <View>
     {conferenceText ? (<>
                        <View
                            style={{
                                paddingHorizontal: normalize(15),
                                paddingVertical: normalize(10),
                            }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterBold,
                                    fontSize: 18,
                                    color: '#000000',
                                    fontWeight:"bold"
                                }}>
                                {"Conference & Summary"}
                            </Text>
                        </View>
                        <ConferenceSummary conferenceHtml={conferenceHtml} expandcon={expandcon} conferShows={conferShows} width={width} />
                    </>) : null}
                    {webcastdeatils?.refund_policy && webcastdeatils?.disclaimer ? (<>
                        <View
                            style={{
                                paddingHorizontal: normalize(15),
                                paddingVertical: normalize(10),
                            }}>
                            <Text
                                style={{
                                    fontFamily: Fonts.InterBold,
                                    fontSize: 18,
                                    color: '#000000',
                                    fontWeight:"bold"
                                }}>
                                {"Refund,Cancellation Policy & Disclaimer"}
                            </Text>
                        </View>
                        <RefundHtml refundtext={refundtext} disclaimerText={disclaimerText} refunded={refunded} refundExpand={refundExpand} width={width} />
                    </>) : null}
    </View>
  )
}

export default StatewebcastRefund