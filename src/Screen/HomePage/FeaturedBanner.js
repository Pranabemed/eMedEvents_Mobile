import { Alert, Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import React from 'react';
import normalize from '../../Utils/Helpers/Dimen'
import Fonts from "../../Themes/Fonts";
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from "moment";
const FeaturedComponent = ({ item, index }) => {
    const formatDate = (dateStr) => {
        const date = moment(dateStr, "DD MMM'YY");
        return date.format("D  MMM").replace(' ', '');
    };
    const formattedDate = formatDate(item?.startdate);
    console.log(item, formattedDate, "full item ===========");
    const facultyImages = item?.speakers;
    console.log(facultyImages,"facultyImages=====",facultyImages?.map((d)=>{return d?.userImage}));
    return (
        <View style={{ marginTop: normalize(60), justifyContent: "center", alignItems: "center" }}>
            <View
                style={{
                    width: normalize(290),
                    borderRadius: normalize(10),
                    backgroundColor: "#FFF8E2",
                    paddingHorizontal: normalize(10),
                    paddingVertical: normalize(10),
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: normalize(260),
                        borderRadius: normalize(15),
                        borderWidth: 0.5,
                        borderColor: "#EDEDED",
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(15),
                        shadowOffset: { height: 3, width: 0 },
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowRadius: 10,
                        elevation: 5,
                        backgroundColor: "#FFFFFF",
                        position: 'relative',
                        marginTop: normalize(-65),
                        zIndex: 1,
                    }}
                >
                    <Text
                        numberOfLines={3}
                        style={{
                            fontSize: 18,
                            color: '#000000',
                            fontFamily: Fonts.InterMedium,
                            textAlign: 'left',
                            lineHeight: normalize(22),
                            textTransform: "capitalize"
                        }}
                    >
                        {item?.title}
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: normalize(10),
                            paddingHorizontal: normalize(5),
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                color: "#333333",
                                fontFamily: Fonts.InterRegular,
                            }}
                        >
                            {`By ${item?.organization_name}`}
                        </Text>

                        <Text
                            style={{
                                fontSize: 18,
                                color: '#000000',
                                fontFamily: Fonts.InterExtraBold,
                            }}
                        >
                            {`${item?.display_currency_code}${item?.display_price}`}
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: normalize(10) }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon name="event" size={20} color="#000000" />
                            <Text style={{
                                fontSize: 14,
                                color: '#000000',
                                fontFamily: Fonts.InterSemiBold,
                                marginLeft: normalize(5),
                            }}>
                                {`${formattedDate} - ${item?.enddate}`}
                            </Text>
                        </View>

                        {item?.display_cme ? <View style={{
                            borderWidth: 0.5,
                            borderColor: "#DDDDDD",
                            borderRadius: 20,
                            height: normalize(30),
                            width: normalize(100),
                            backgroundColor: "#FFFFFF",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: normalize(5), 
                        }}>
                            <Text numberOfLines={1} ellipsizeMode="tail"  style={{
                                fontSize: 12,
                                color: '#000000',
                                fontFamily: Fonts.InterSemiBold,
                                textAlign: "center", 
                                width: "70%", 
                                flexWrap: "wrap", 
                                overflow: "hidden", 
                                textOverflow: "ellipsis", 
                            }}>
                                {item?.display_cme}
                            </Text>
                        </View>:null}
                    </View>
                    {item?.location ? <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                        <Icon name="location-on" size={20} color="#000000" />
                        <Text style={{
                            fontSize: 14,
                            color: '#000000',
                            fontFamily: Fonts.InterSemiBold,
                            marginLeft: normalize(5),
                        }}>
                            {item?.location}
                        </Text>
                    </View>:null}
                    <View style={{ marginTop: item?.location ? normalize(73):normalize(53), height: 0.5, width: '100%', backgroundColor: "#E9E0C8", position: "absolute" }} />
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: normalize(20), width: '100%' }}>
                        <View style={{ flexDirection: "column", alignItems: "center", marginBottom: normalize(14) }}>
                            {item?.speakers?.length > 0 &&<Text
                                style={{
                                    fontFamily: Fonts.InterRegular,
                                    fontSize: 12,
                                    color: "#666666",
                                    textTransform: "uppercase",
                                    marginRight: normalize(3),
                                }}
                            >
                                {"FACULTY"}
                            </Text>}

                            <View style={{ flexDirection: 'row', width: normalize(50), paddingVertical: normalize(5) }}>
                                {facultyImages.map((image, index) => (
                                    <ImageBackground imageStyle={{borderRadius:20}} source={{uri:image?.userImage}} style={{
                                        height: normalize(33),
                                        width: normalize(33),
                                        marginLeft: index === 0 ? 0 : normalize(-10)
                                    }} resizeMode="contain" />
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity
                            style={{
                                height: normalize(45),
                                width: normalize(124),
                                borderRadius: normalize(10),
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#FF773D"
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: Fonts.InterBold,
                                    fontSize: 18,
                                    color: "#FFFFFF",
                                    textTransform:"capitalize"
                                }}
                            >
                                {item?.buttonText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};
export default FeaturedComponent;