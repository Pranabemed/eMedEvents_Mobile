import { View, Text, Platform } from 'react-native'
import React from 'react'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import StatewebcastComponent from './StatewebcastComponent'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
const StatewebcastFaculty = ({webcastdeatils,windowWidth,windowHeight,handleSnapToItem,val,nav,creditData,datawhole}) => {
  return (
    <View>
       {webcastdeatils?.speakers?.length > 0 && <><View style={{ paddingHorizontal: normalize(10), width: "100%",paddingHorizontal:normalize(15) }}>
                  <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: "#000000" }}>
                  {webcastdeatils?.conferenceTypeId == "1" ||
                        webcastdeatils?.conferenceTypeId == "6" ||
                        webcastdeatils?.conferenceTypeId == "34"
                          ? `Speakers (${(webcastdeatils?.speakers?.length)})`
                          :`Faculty (${(webcastdeatils?.speakers?.length)})`}
                  </Text>
              </View><View>
                  <Carousel
                      layout={'default'}
                      data={webcastdeatils?.speakers}
                      sliderWidth={windowWidth}
                      itemWidth={Platform.OS === 'ios' ? windowWidth : windowWidth}
                      itemHeight={windowHeight * 0.9}
                      sliderHeight={windowHeight * 0.9}
                      renderItem={({ item, index }) => (
                          <StatewebcastComponent datawhole={datawhole} creditData={creditData} nav={nav} item={item} index={index} />
                      )}
                      firstItem={0}
                      onSnapToItem={handleSnapToItem} />
                  <View
                      style={{
                          width: normalize(40),
                          alignSelf: 'center',
                      }}>
                      <Pagination
                          dotsLength={webcastdeatils?.speakers?.length}
                          activeDotIndex={val}
                          dotStyle={{
                              width: 10,
                              height: 10,
                              borderRadius: 10,
                              //  marginHorizontal: 2,
                              backgroundColor: Colorpath.ButtonColr,
                          }}
                          inactiveDotStyle={{
                              width: 10,
                              height: 10,
                              borderRadius: 10,
                              opacity: 0.7,
                          }}
                          inactiveDotScale={0.9} />
                  </View>
              </View></>}
    </View>
  )
}

export default StatewebcastFaculty