import { View, Text, FlatList, Platform } from 'react-native'
import React from 'react'
import Fonts from '../../Themes/Fonts'
import Colorpath from '../../Themes/Colorpath'
import normalize from '../../Utils/Helpers/Dimen';
const StateRequiredCourse = ({stateid,profesions,paginatedDataDpl,setIsTouching, isTouching, activeList, setActiveList, paginatedData, ExplorecastComponent, renderFooter, loadMoreData, setAllSpecial, setTootip, handleUrl, statewise }) => {
    return (
        <View style={Platform.OS === 'ios' ? { flex: 0.87}:{flex:0.60}}>
            <View style={{ marginLeft: normalize(5) }}>
                <Text numberOfLines={1} style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: Colorpath.ButtonColr }}>{`State-required Courses ${stateid || profesions ? "for":"" } ${statewise == "All States" ? "":statewise} ${profesions == "Nursing"?"Nurses":`${!profesions ? "" :`${profesions}s`}`}`}</Text>
            </View>
            <FlatList
                data={paginatedData}
                renderItem={({ item, index }) => <ExplorecastComponent item={item} index={index} setAllSpecial={setAllSpecial} setTootip={setTootip} handleUrl={handleUrl} />}
                ListFooterComponent={renderFooter}
                contentContainerStyle={{paddingBottom:normalize(100)}}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5}
                keyExtractor={(item, index) => `list1-${index}`}
                scrollEnabled={activeList === "list1" || activeList === null}
                onTouchStart={() => {
                    setActiveList("list1");
                    setIsTouching(true);
                }}
                onTouchEnd={() => setIsTouching(false)}
                onScroll={() => setActiveList("list1")}
                onMomentumScrollEnd={() => {
                    if (!isTouching) setActiveList(null);
                }}
                horizontal
                ListEmptyComponent={
                    <View style={{ justifyContent: "center", alignItems: "center", marginLeft: normalize(15) }}>
                        <View
                            style={{
                                flexDirection: "row",
                                // height: normalize(83),
                                width: normalize(290),
                                borderRadius: normalize(10),
                                backgroundColor: "#FFFFFF",
                                paddingHorizontal: normalize(10),
                                paddingVertical: normalize(10),
                                alignSelf: "center",
                            }}
                        >
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Text
                                    style={{
                                        fontFamily: Fonts.InterSemiBold,
                                        fontSize: 16,
                                        color: "#000000",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {"There are no state-required topics courses found with your search criteria."}
                                </Text>
                            </View>
                        </View>
                       {paginatedDataDpl?.length == "0" && <View style={{ marginTop: normalize(10) }}>
                            <View style={{paddingVertical: normalize(5) }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: Colorpath.ButtonColr, marginBottom: normalize(5) }}>{`State-required Courses Bundle ${stateid || profesions ? "for":"" } ${statewise == "All States" ? "":statewise}${profesions == "Nursing"? "Nurses":`${!profesions ? "" :`${profesions}s`}`}`}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    // height: normalize(83),
                                    width: normalize(290),
                                    borderRadius: normalize(10),
                                    backgroundColor: "#FFFFFF",
                                    paddingHorizontal: normalize(10),
                                    paddingVertical: normalize(10),
                                    alignSelf: "center",
                                }}
                            >
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    <Text
                                        style={{
                                            fontFamily: Fonts.InterSemiBold,
                                            fontSize: 16,
                                            color: "#000000",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {"There are no state-required topics courses found with your search criteria."}
                                    </Text>
                                </View>
                            </View>
                        </View>}

                    </View>
                }
            />

        </View>
    )
}

export default StateRequiredCourse