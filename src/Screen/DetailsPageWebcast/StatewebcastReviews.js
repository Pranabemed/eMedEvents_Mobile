import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import Imagepath from '../../Themes/Imagepath';
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';
import { AirbnbRating } from 'react-native-ratings';
const StatewebcastReviews = ({ webcastdeatils, setReviewsPosition, ratingsall, reviewpost, expandreview, reviewChange }) => {
    console.log(reviewpost, "expandreview-------")
    const reviewsShows = ({ item, index }) => {
        return (
            <View
                style={{
                    marginBottom: normalize(10),
                    marginLeft:normalize(6)
                }}
            >
                <View
                    style={{
                        paddingVertical: normalize(5),
                        paddingHorizontal: normalize(9),
                    }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 16,
                            color: "#000000",
                            textTransform: "capitalize",
                        }}>
                        {item?.userName}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: normalize(6),
                        paddingVertical: normalize(0),
                    }}>
                    <AirbnbRating
                        count={5}
                        reviews={[]}
                        defaultRating={item?.averageRating}
                        size={15}
                        showRating={false}
                        isDisabled={true}
                        starStyle={{ tintColor: "#FF773D" }}
                    />
                    {/* <Text
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 12,
                            color: '#999',
                            fontWeight: 'bold',
                            marginLeft: normalize(10),
                        }}>
                        {"2 days ago"}
                    </Text> */}
                </View>
                <View
                    style={{
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(0),
                    }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterRegular,
                            fontSize: 16,
                            color: '#333',
                        }}>
                        {item?.comment}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View>
            {webcastdeatils?.userReviews?.length > 0 ? (<>
                <View onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    setReviewsPosition(layout.y);
                }}
                    style={{
                        paddingHorizontal: normalize(15),
                        paddingVertical: normalize(5),
                    }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterBold,
                            fontWeight:"bold",
                            fontSize: 18,
                            color: '#000000',
                        }}>
                        {"Reviews"}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: normalize(15),
                        paddingVertical: normalize(0),
                    }}>
                    <Image
                        source={Imagepath.Star}
                        style={{
                            height: normalize(15),
                            width: normalize(15),
                            resizeMode: 'contain',
                        }}
                    />
                    <Text
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 18,
                            color: '#333',
                            fontWeight: 'bold',
                            marginLeft: normalize(10),
                        }}>
                        {`${ratingsall?.totalAverageRating.toFixed(1)}`}
                    </Text>
                    <Text
                        style={{
                            fontFamily: Fonts.InterSemiBold,
                            fontSize: 16,
                            color: Colorpath.ButtonColr,
                            fontWeight: 'bold',
                            marginLeft: normalize(5),
                            top: 1,
                        }}>
                        ({(`${ratingsall?.totalRatingsCount} ratings`)})
                    </Text>
                </View>
                <View style={{ height: 1, width: normalize(285), backgroundColor: "#DDDDDD", marginLeft: normalize(15), marginTop: normalize(5) }} />
                <View>
                    {reviewpost?.length > 2 ? (
                        <>
                            <FlatList
                                data={reviewpost?.slice(0, 1)}
                                renderItem={reviewsShows}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            <FlatList
                                data={expandreview ? reviewpost?.slice(1) : []}
                                renderItem={reviewsShows}
                                keyExtractor={(item, index) => index.toString()}
                                ListFooterComponent={
                                    <TouchableOpacity onPress={reviewChange}>
                                        <View
                                            style={{
                                                paddingHorizontal: normalize(10),
                                                paddingVertical: normalize(10),
                                                width: "100%",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.InterSemiBold,
                                                    fontSize: 16,
                                                    color: Colorpath.ButtonColr,
                                                }}
                                            >
                                                {expandreview ? "See less" : "See more reviews"}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                            />
                        </>
                    ) : (
                        <FlatList
                            data={reviewpost}
                            renderItem={reviewsShows}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    )}
                </View>


            </>) : null}
        </View>
    )
}

export default StatewebcastReviews