import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AirbnbRating } from 'react-native-ratings';
import Fonts from '../../Themes/Fonts';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
const ExplorecastComponent = ({ item,index, setAllSpecial,setTootip,handleUrl }) => {
    function customRound(price) {
        price = price.replace(/[^0-9.]/g, '');
        price = Number(price);
        if (isNaN(price)) return NaN;
        if (Number.isInteger(price)) return price;
        return price % 1 >= 0.50 ? Math.ceil(price) : Math.floor(price);
    }
    return (
        <View style={{ paddingVertical: normalize(0), alignItems: "center",margin:normalize(5)}}>
            <View style={{
                flexDirection: "column",
                width: normalize(290),
                borderRadius: normalize(5),
                backgroundColor: "#FFFFFF",
                paddingHorizontal: normalize(10),
                paddingVertical: normalize(10),
                alignItems: "flex-start",
                borderColor:"#DADADA",
                borderWidth:0.5
            }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                    <TouchableOpacity onPress={()=>{handleUrl(item)}}>
                    <Text numberOfLines={1}
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: "#000000",
                            fontWeight: "bold",
                            flexShrink: 1,
                            flexWrap: 'wrap',
                        }}>
                        {item?.title}
                    </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: normalize(10), height: 1, width: '100%', backgroundColor: "#DDD" }} />
                <View style={{ padding: normalize(7), borderRadius: normalize(25), backgroundColor: "#FFF2E0", marginTop: normalize(5), alignSelf: 'flex-start' }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, fontWeight: "bold", color: "#666" }}>
                        {`${item?.credits[0]?.points} ${item?.credits[0]?.name}`}
                    </Text>
                </View>

                <View style={{ flexDirection: "row", marginTop: normalize(5), alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#666", fontWeight: "bold", marginRight: normalize(5) }}>
                        {"Ratings:"}
                    </Text>
                    <AirbnbRating
                        count={5}
                        reviews={[]}
                        defaultRating={item?.average_rating}
                        size={15}
                        showRating={false}
                        isDisabled={true}
                    />
                </View>
                {/* <TouchableOpacity onPress={() => {
                    setAllSpecial(item?.specialities);
                    setTootip(true);
                }} style={{ flexDirection: "row", marginTop: normalize(10), alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#666", fontWeight: "bold", marginRight: normalize(5) }}>
                        {"Specailities:"}
                    </Text>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#666", fontWeight: "bold" }}>
                        {`${item?.specialities[0]}...`}
                    </Text>
                </TouchableOpacity> */}
                <View style={{ flexDirection: "row", marginTop: normalize(5), alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#666", fontWeight: "bold", marginRight: normalize(5) }}>
                        {"Courses in Bundle:"}
                    </Text>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#666", fontWeight: "bold" }}>
                        {item?.bundle_sub_conf_count}
                    </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(5), width: '100%' }}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: Colorpath.ButtonColr, fontWeight: "bold" }}>
                        {`${item?.currency_code}${customRound(item?.ticketprice)}`}
                    </Text>
                    <TouchableOpacity onPress={() => handleUrl(item)} style={{ height: normalize(30), width: normalize(120), borderRadius: normalize(5), justifyContent: "center", alignItems: "center", borderColor: Colorpath.ButtonColr, borderWidth: 0.5 }}>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#FC4F04" }}>
                            {item?.buttonText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
export default ExplorecastComponent