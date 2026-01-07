import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../../Themes/Fonts';
import Colorpath from '../../Themes/Colorpath';
import normalize from '../../Utils/Helpers/Dimen';
import MandatoryCertificate from './MandatoryCertificate';
const Certficatecomponent = ({ certificateData,navigation }) => {
   const [showMore, setShowMore] = useState(false); 
    const [maxToShow, setMaxToShow] = useState(3);

    const toggleShowMore = () => {
        setShowMore(!showMore);
        setMaxToShow(showMore ? 3 : certificateData.length); 
    };

    return (
        <View>
            <View>
                <View style={{ flexDirection: "column" }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10)
                        }}
                        onPress={toggleShowMore} 
                    >
                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, fontWeight: "bold", color: "#000000" }}>
                            {"State Mandatory Course Certificates"}
                        </Text>
                        <ArrowIcon name={showMore ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={25} color={"#000000"} />
                    </TouchableOpacity>
                    <View style={{ height: 1, width: normalize(295), marginLeft: normalize(10), backgroundColor: "#AAAAAA", justifyContent: "center", alignItems: "center" }} />
                </View>
            </View>
            <View>
                <FlatList
                    data={certificateData.slice(0, maxToShow)} 
                    renderItem={({ item }) => <MandatoryCertificate item={item} />}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={
                        <Text
                            style={{
                                alignContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                color: Colorpath.grey,
                                fontWeight: 'bold',
                                fontFamily: Fonts.InterMedium,
                                fontSize: normalize(20),
                                paddingTop: normalize(30),
                            }}>
                            No data found
                        </Text>
                    }
                />
            </View>
        </View>
    );
}

export default Certficatecomponent