import { View, Text, FlatList, Alert } from 'react-native'
import React, { useRef } from 'react'
import Fonts from '../../Themes/Fonts'
import Colorpath from '../../Themes/Colorpath'
import normalize from '../../Utils/Helpers/Dimen';
const ExpolrecastFlatlist = ({stateid, profesions,lastScrollY, setLastScrollY, isTouching, setIsTouching, activeList, setActiveList, setIsScrolling, paginatedData, ExplorecastComponent, renderFooter, loadMoreData, setAllSpecial, setTootip, handleUrl, statewise }) => {
    const handleScroll = (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        console.log(currentScrollY, "currentScrollY====")
        if (currentScrollY < lastScrollY.current) {
            setActiveList("list1");;
        } else {
            setLastScrollY(currentScrollY);
        }

    };
    return (
        <View style={{ flex: 0.90}}>
            {paginatedData?.length > 0 && <View style={{ marginLeft: normalize(6)}}>
                <Text numberOfLines={2} style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: Colorpath.ButtonColr }}>{`State-required Courses Bundle ${stateid || profesions ? "for":"" } ${statewise == "All States" ? "":statewise} ${profesions == "Nursing"? "Nurses":`${!profesions ? "" :`${profesions}s`}`}`}</Text>
            </View>}
            <FlatList
                data={paginatedData}
                horizontal
                contentContainerStyle={{paddingBottom:normalize(100)}}
                renderItem={({ item, index }) => <ExplorecastComponent item={item} index={index} setAllSpecial={setAllSpecial} setTootip={setTootip} handleUrl={handleUrl} />}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5}
                onScroll={paginatedData?.length > 2 && handleScroll}
                onTouchStart={() => {
                    setActiveList("list2");
                    setIsTouching(true);
                }}
                onTouchEnd={() => setIsTouching(false)}
            />
        </View>
    )
}

export default ExpolrecastFlatlist