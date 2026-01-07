import { View, Text, Platform, TouchableOpacity, StyleSheet, ImageBackground, Image, Dimensions, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MyStatusBar from '../../Utils/MyStatusBar';
import Colorpath from '../../Themes/Colorpath';
import PageHeader from '../../Components/PageHeader';
import normalize from '../../Utils/Helpers/Dimen';
import LinearGradient from 'react-native-linear-gradient';
import NotifyIcn from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchIcn from 'react-native-vector-icons/Ionicons';
import Imagepath from '../../Themes/Imagepath';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Fonts from '../../Themes/Fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CalIcon from 'react-native-vector-icons/FontAwesome5'
import Buttons from '../../Components/Button';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { HomelistRequest } from '../../Redux/Reducers/GuestReducer';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import showErrorAlert from '../../Utils/Helpers/Toast';
import RenderHTML from 'react-native-render-html';
import BannerComponent from './TopBanner';
import { parseHtmlContent } from './DuplicateContent';
import FeaturedComponent from './FeaturedBanner';
import CMEExclusive from './ExclusiveCME';
import { SafeAreaView } from 'react-native-safe-area-context'

let status = "";
const GuestUser = (props) => {
    const [val, setval] = useState(0);
    const carouselRef = useRef(null);
    const [vals, setvals] = useState(0);
    const [valcmmnt, setvalcmmnt] = useState(0);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeIndexspe, setActiveIndexspe] = useState(0);
    const [activeIndexspein, setActiveIndexspein] = useState(0);
    const [wholecontent, setWholecontent] = useState([]);
    const [topbanner, setTopbanner] = useState(0);
    const isfocused = useIsFocused();
    const dispatch = useDispatch();
    const GuestReducer = useSelector(state => state.GuestReducer);
    console.log(topbanner, "GutopbannerestReducer---------", activeIndex)
    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(HomelistRequest({}))
            })
            .catch((err) => {
                showErrorAlert("Please connect to internet", err)
            })
    }, [isfocused])
    useEffect(() => {
        setActiveIndex(0);
    }, []);
    useEffect(() => {
        setActiveIndexspe(0);
    }, []);
    useEffect(() => {
        setActiveIndexspein(0);
    }, []);
    if (status == '' || GuestReducer.status != status) {
        switch (GuestReducer.status) {
            case 'Guest/HomelistRequest':
                status = GuestReducer.status;
                break;
            case 'Guest/HomelistSuccess':
                status = GuestReducer.status;
                setWholecontent(GuestReducer?.HomelistResponse);
                break;
            case 'Guest/HomelistFailure':
                status = GuestReducer.status;
                break;
        }
    }
    console.log(wholecontent, "regndhgg090000")

    const handleSnapToItem = (index) => {
        setval(index);
    };
    const handleSnapToItems = (index) => {
        setvals(index);
    };
    const handlecmmnt = (index) => {
        setvalcmmnt(index);
    };
    const handleNext = () => {
        if (carouselRef.current && val < filteredBanners.length - 1) {
            carouselRef.current.snapToItem(val + 1);
        }
    };
    const commentDataItem = ({ item, index }) => {
        console.log(item, "full item ===========");
        return (
            <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: normalize(10) }}>
                <View
                    style={{
                        width: normalize(290),
                        borderRadius: normalize(15),
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(10),
                        alignItems: "center",
                        backgroundColor: "#FFF8E2",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 3,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                            height: normalize(70),
                            width: normalize(70),
                            backgroundColor: '#FFF8E2',
                            borderRadius: normalize(35),
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: normalize(10),
                        }}>
                            <ImageBackground
                                source={Imagepath.Man}
                                style={{
                                    height: normalize(50),
                                    width: normalize(50),
                                }}
                                imageStyle={{ borderRadius: normalize(60) }}
                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', marginTop: normalize(0), marginLeft: normalize(-10) }}>
                            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: "#000000", fontWeight: "bold" }}>{"Luther Park, MD"}</Text>
                            <Text style={{ paddingVertical: normalize(0), fontFamily: Fonts.InterRegular, fontSize: 12, color: "#666666" }}>{"Internal Medicine"}</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: "center", alignContent: "center" }}>
                        <Text
                            numberOfLines={5}
                            style={{
                                fontFamily: Fonts.InterRegular,
                                fontSize: 12,
                                color: "#000000",
                                flexShrink: 1,
                                flexWrap: 'wrap',
                                textAlign: "center",
                            }}
                        >
                            {"Lorem ipsum dolor sit amet consectetur. Habitasse libero dolor sit dui condimentum ac sed tempus potenti. Amet imperdiet viverra nam sed id nisl malesuada commodo. Interdum ac tristique risus ultrices neque porta elit"}
                        </Text>
                    </View>
                    <View style={{ justifyContent: "center", alignContent: "center", paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                        <Text
                            numberOfLines={5}
                            style={{
                                fontFamily: Fonts.InterRegular,
                                fontSize: 12,
                                color: "#000000",
                                flexShrink: 1,
                                flexWrap: 'wrap',
                                textAlign: "center",
                            }}
                        >
                            {"Felis nunc at fermentum pellentesque venenatis quis turpis."}
                        </Text>
                    </View>
                    <View style={{ alignSelf: "flex-end" }}>
                        <Image source={Imagepath.CommaImg} style={{ height: normalize(25), width: normalize(25), resizeMode: "contain" }} />
                    </View>
                </View>
            </View>

        );
    };
    const exclusiveItem = ({ item, index }) => {
        const isActive = index === activeIndex;
        return (
            <TouchableOpacity onPress={() => { setActiveIndex(index) }}
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: normalize(10),
                    paddingVertical: normalize(10),
                    borderRadius: normalize(20),
                    borderWidth: 0.5,
                    borderColor: isActive ? Colorpath.ButtonColr : "#D9D9D9",
                    margin: 5
                }}
            >
                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: isActive ? Colorpath.ButtonColr : "#999999" }}>
                    {item?.Statename}
                </Text>
            </TouchableOpacity>
        )
    }
    const exclusiveItemspe = ({ item, index }) => {
        const isActive = index === activeIndexspe;
        return (
            <TouchableOpacity onPress={() => { setActiveIndexspe(index) }}
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: normalize(10),
                    paddingVertical: normalize(10),
                    borderRadius: normalize(20),
                    borderWidth: 0.5,
                    borderColor: isActive ? Colorpath.ButtonColr : "#D9D9D9",
                    margin: 5
                }}
            >
                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: isActive ? Colorpath.ButtonColr : "#999999" }}>
                    {item?.Statename}
                </Text>
            </TouchableOpacity>
        )
    }
    const exclusiveItemsInperson = ({ item, index }) => {
        const isActive = index === activeIndexspein;
        return (
            <TouchableOpacity onPress={() => { setActiveIndexspein(index) }}
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: normalize(10),
                    paddingVertical: normalize(10),
                    borderRadius: normalize(20),
                    borderWidth: 0.5,
                    borderColor: isActive ? Colorpath.ButtonColr : "#D9D9D9",
                    margin: 5
                }}
            >
                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 14, color: isActive ? Colorpath.ButtonColr : "#999999" }}>
                    {item?.Statename}
                </Text>
            </TouchableOpacity>
        )
    }
    const exclusiveItemsmany = ({ item, index }) => {
        return (
            <View>
                <View style={{
                    justifyContent: "center",
                    alignSelf: "center",
                    paddingVertical: normalize(10),
                    paddingHorizontal: normalize(2),
                    margin: 5
                }}>
                    <View
                        style={{
                            width: normalize(270),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                        }}
                    >
                        <Image
                            source={item.Image}
                            style={{
                                alignSelf: "center",
                                height: normalize(80),
                                width: normalize(270),
                                resizeMode: "contain"
                            }}
                        />
                        <Text
                            numberOfLines={2}
                            style={{
                                fontFamily: Fonts.InterSemiBold,
                                fontSize: 16,
                                color: "#000000",
                                fontWeight: "bold",
                                flexShrink: 1,
                                flexWrap: 'wrap',
                                paddingVertical: 2
                            }}
                        >
                            {item?.Statename}
                        </Text>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#999999" }}>
                            {"By eMedEd"}
                        </Text>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: normalize(10) }}>
                            <CalIcon name="calendar" size={20} color="#000000" />
                            <Text style={{
                                fontSize: 14,
                                color: '#000000',
                                fontFamily: Fonts.InterRegular,
                                marginLeft: normalize(5),
                            }}>
                                {"Topics - 3 | Courses in bundle -3"}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: normalize(0) }}>
                            <Image source={Imagepath.CreditValut} style={{ height: normalize(20), width: normalize(17), resizeMode: "contain" }} />
                            <Text style={{
                                fontSize: 14,
                                color: '#000000',
                                fontFamily: Fonts.InterRegular,
                                marginLeft: normalize(5),
                            }}>
                                {"1 AMA PRA Category 1 Credit™ ..."}
                            </Text>
                        </View>
                        <View style={{ marginTop: normalize(10), height: 1, width: '100%', backgroundColor: "#DDDDDD" }} />

                        <View style={{ alignItems: "flex-end", marginTop: normalize(10) }}>

                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 18,
                                    color: "#2C4DB9",
                                }}
                            >
                                {"US$800"}
                            </Text>

                        </View>
                    </View>
                </View>
            </View>

        )
    }
    const exclusiveItemsmanyin = ({ item, index }) => {
        return (
            <View>
                <View style={{
                    justifyContent: "center",
                    alignSelf: "center",
                    paddingVertical: normalize(10),
                    paddingHorizontal: normalize(2),
                    margin: 5
                }}>
                    <View
                        style={{
                            width: normalize(270),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                        }}
                    >
                        <Image
                            source={item.Image}
                            style={{
                                alignSelf: "center",
                                height: normalize(80),
                                width: normalize(270),
                                resizeMode: "contain"
                            }}
                        />
                        <Text
                            numberOfLines={2}
                            style={{
                                fontFamily: Fonts.InterSemiBold,
                                fontSize: 16,
                                color: "#000000",
                                fontWeight: "bold",
                                flexShrink: 1,
                                flexWrap: 'wrap',
                                paddingVertical: 2
                            }}
                        >
                            {item?.Statename}
                        </Text>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#999999" }}>
                            {"By eMedEd"}
                        </Text>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: normalize(10) }}>
                            <CalIcon name="calendar" size={20} color="#000000" />
                            <Text style={{
                                fontSize: 14,
                                color: '#000000',
                                fontFamily: Fonts.InterRegular,
                                marginLeft: normalize(5),
                            }}>
                                {"Topics - 3 | Courses in bundle -3"}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: normalize(0) }}>
                            <Image source={Imagepath.CreditValut} style={{ height: normalize(20), width: normalize(17), resizeMode: "contain" }} />
                            <Text style={{
                                fontSize: 14,
                                color: '#000000',
                                fontFamily: Fonts.InterRegular,
                                marginLeft: normalize(5),
                            }}>
                                {"1 AMA PRA Category 1 Credit™ ..."}
                            </Text>
                        </View>
                        <View style={{ marginTop: normalize(10), height: 1, width: '100%', backgroundColor: "#DDDDDD" }} />

                        <View style={{ alignItems: "flex-end", marginTop: normalize(10) }}>

                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 18,
                                    color: "#2C4DB9",
                                }}
                            >
                                {"US$800"}
                            </Text>

                        </View>
                    </View>
                </View>
            </View>

        )
    }
    const exclusiveItemsmanyinlive = ({ item, index }) => {
        return (
            <View>
                <View style={{
                    justifyContent: "center",
                    alignSelf: "center",
                    paddingVertical: normalize(0),
                    paddingHorizontal: normalize(2),
                    margin: 5
                }}>
                    <View
                        style={{
                            width: normalize(270),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                        }}
                    >
                        <Image
                            source={item.Image}
                            style={{
                                alignSelf: "center",
                                height: normalize(80),
                                width: normalize(270),
                                resizeMode: "contain"
                            }}
                        />
                        <Text
                            numberOfLines={2}
                            style={{
                                fontFamily: Fonts.InterSemiBold,
                                fontSize: 16,
                                color: "#000000",
                                fontWeight: "bold",
                                flexShrink: 1,
                                flexWrap: 'wrap',
                                paddingVertical: 2
                            }}
                        >
                            {item?.Statename}
                        </Text>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#999999" }}>
                            {"By eMedEd"}
                        </Text>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: normalize(10) }}>
                            <CalIcon name="calendar" size={20} color="#000000" />
                            <Text style={{
                                fontSize: 14,
                                color: '#000000',
                                fontFamily: Fonts.InterRegular,
                                marginLeft: normalize(5),
                            }}>
                                {"Topics - 3 | Courses in bundle -3"}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: normalize(0) }}>
                            <Image source={Imagepath.CreditValut} style={{ height: normalize(20), width: normalize(17), resizeMode: "contain" }} />
                            <Text style={{
                                fontSize: 14,
                                color: '#000000',
                                fontFamily: Fonts.InterRegular,
                                marginLeft: normalize(5),
                            }}>
                                {"1 AMA PRA Category 1 Credit™ ..."}
                            </Text>
                        </View>
                        <View style={{ marginTop: normalize(10), height: 1, width: '100%', backgroundColor: "#DDDDDD" }} />

                        <View style={{ alignItems: "flex-end", marginTop: normalize(10) }}>

                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 18,
                                    color: "#2C4DB9",
                                }}
                            >
                                {"US$42"}
                            </Text>

                        </View>
                    </View>
                </View>
            </View>

        )
    }
    const exclusiveItemsmanyinlivefree = ({ item, index }) => {
        return (
            <View>
                <View style={{
                    justifyContent: "center",
                    alignSelf: "center",
                    paddingVertical: normalize(0),
                    paddingHorizontal: normalize(2),
                    margin: 5
                }}>
                    <View
                        style={{
                            width: normalize(270),
                            borderRadius: normalize(10),
                            backgroundColor: "#FFFFFF",
                            paddingHorizontal: normalize(10),
                            paddingVertical: normalize(10),
                        }}
                    >
                        <Text
                            numberOfLines={2}
                            style={{
                                fontFamily: Fonts.InterSemiBold,
                                fontSize: 16,
                                color: "#000000",
                                fontWeight: "bold",
                                flexShrink: 1,
                                flexWrap: 'wrap',
                                paddingVertical: 2
                            }}
                        >
                            {item?.Statename}
                        </Text>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#999999" }}>
                            {"By eMedEd"}
                        </Text>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: normalize(10) }}>
                            <CalIcon name="calendar" size={20} color="#000000" />
                            <Text style={{
                                fontSize: 14,
                                color: '#000000',
                                fontFamily: Fonts.InterRegular,
                                marginLeft: normalize(5),
                            }}>
                                {"Topics - 3 | Courses in bundle -3"}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingVertical: normalize(0) }}>
                            <Image source={Imagepath.CreditValut} style={{ height: normalize(20), width: normalize(17), resizeMode: "contain" }} />
                            <Text style={{
                                fontSize: 14,
                                color: '#000000',
                                fontFamily: Fonts.InterRegular,
                                marginLeft: normalize(3),
                            }}>
                                {"1 AMA PRA Category 1 Credit™ ..."}
                            </Text>
                        </View>
                        <View style={{ marginTop: normalize(10), height: 1, width: '100%', backgroundColor: "#DDDDDD" }} />

                        <View style={{ alignItems: "flex-end", marginTop: normalize(10) }}>

                            <Text
                                style={{
                                    fontFamily: Fonts.InterSemiBold,
                                    fontSize: 18,
                                    color: "#2C4DB9",
                                }}
                            >
                                {"Free"}
                            </Text>

                        </View>
                    </View>
                </View>
            </View>

        )
    }
    const commentData = [
        {
            "id": 0,
            "Statename": "ABFM",
            "work": "Unilogic",
            "email": "adam.carter@unilogic.com",
            "dob": "1978",
            "address": "83 Warner Street",
            "city": "Boston",
            "optedin": true
        },
        {
            "id": 1,
            "Statename": "AAFP",
            "work": "Connic",
            "email": "leanne.brier@connic.org",
            "dob": "1987",
            "address": "9 Coleman Avenue",
            "city": "Toronto",
            "optedin": false
        },
        {
            "id": 2,
            "Statename": "ABFM",
            "work": "Unilogic",
            "email": "adam.carter@unilogic.com",
            "dob": "1978",
            "address": "83 Warner Street",
            "city": "Boston",
            "optedin": true
        },
        {
            "id": 3,
            "Statename": "AAFP",
            "work": "Connic",
            "email": "leanne.brier@connic.org",
            "dob": "1987",
            "address": "9 Coleman Avenue",
            "city": "Toronto",
            "optedin": false
        }
    ]
    const flatData = [
        {
            "id": 0,
            "Statename": "State-required"

        },
        {
            "id": 1,
            "Statename": "Speciality Bundles"
        },
    ]
    const Inpersonhybrid = [
        {
            "id": 0,
            "Statename": "2024"

        },
        {
            "id": 1,
            "Statename": "2025"
        },
        {
            "id": 2,
            "Statename": "2026"
        },
    ]
    const flatDataspecaility = [
        {
            "id": 0,
            "Statename": "Internal Medicine"

        },
        {
            "id": 1,
            "Statename": "Family Medicine"
        },
        {
            "id": 2,
            "Statename": "Psychiatry"

        },
        {
            "id": 3,
            "Statename": "Oncology"
        },
        {
            "id": 4,
            "Statename": "Radiology"

        },
        {
            "id": 5,
            "Statename": "Neurology"
        },
        {
            "id": 6,
            "Statename": "Cardiology"

        },
        {
            "id": 7,
            "Statename": "Dermatology"
        },
    ]
    const flatDatasinperson = [
        {
            "id": 0,
            "Statename": "Paediatric Emergency Medicine (PEM) Course",
            "Image": Imagepath.SpecialityCard

        },
        {
            "id": 1,
            "Statename": "Recognition and Response: Violence and Abuse in the..",
            "Image": Imagepath.GlobalPng
        },
        {
            "id": 2,
            "Statename": "Paediatric Emergency Medicine (PEM) Course",
            "Image": Imagepath.SpecialityCard
        },
    ]
    const flatDatasinpersonlive = [
        {
            "id": 0,
            "Statename": "Paediatric Emergency Medicine (PEM) Course",
            "Image": Imagepath.SpecialityCard

        },
        {
            "id": 1,
            "Statename": "Recognition and Response: Violence and Abuse in the..",
            "Image": Imagepath.GlobalPng
        },
        {
            "id": 2,
            "Statename": "Paediatric Emergency Medicine (PEM) Course",
            "Image": Imagepath.SpecialityCard
        },
    ]
    const flatDatasinpersonlivefree = [
        {
            "id": 0,
            "Statename": "Paediatric Emergency Medicine (PEM) Course",
            "Image": Imagepath.SpecialityCard

        },
        {
            "id": 1,
            "Statename": "Recognition and Response:\nViolence and Abuse in the..",
            "Image": Imagepath.GlobalPng
        },
        {
            "id": 2,
            "Statename": "Paediatric Emergency Medicine (PEM) Course",
            "Image": Imagepath.SpecialityCard
        },
    ]
    const flatDatamanyspecaility = [
        {
            "id": 0,
            "Statename": "Paediatric Emergency Medicine (PEM) Course",
            "Image": Imagepath.SpecialityCard

        },
        {
            "id": 1,
            "Statename": "Recognition and Response: Violence and Abuse in the..",
            "Image": Imagepath.GlobalPng
        },
        {
            "id": 2,
            "Statename": "Paediatric Emergency Medicine (PEM) Course",
            "Image": Imagepath.SpecialityCard
        },
        {
            "id": 3,
            "Statename": "Recognition and Response: Violence and Abuse in the..",
            "Image": Imagepath.GlobalPng
        },
        {
            "id": 4,
            "Statename": "Paediatric Emergency Medicine (PEM) Course",
            "Image": Imagepath.SpecialityCard

        },
        {
            "id": 5,
            "Statename": "Recognition and Response: Violence and Abuse in the..",
            "Image": Imagepath.GlobalPng
        },
        {
            "id": 6,
            "Statename": "Paediatric Emergency Medicine (PEM) Course",
            "Image": Imagepath.SpecialityCard
        },
        {
            "id": 7,
            "Statename": "Paediatric Emergency Medicine (PEM) Course",
            "Image": Imagepath.SpecialityCard
        },

    ]
    console.log(wholecontent?.mobile_top_banners, "wholeciomtgee=====", activeIndex)
    const filterBannersWithContent = (banners) => {
        return banners.filter((item) => {
            const parsedData = parseHtmlContent(item.html_content);
            return parsedData.content.length > 0;
        });
    };
    const filteredBanners = filterBannersWithContent(wholecontent?.mobile_top_banners || []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40) }}>
                    <TouchableOpacity onPress={() => { props.navigation.navigate("SearchScreen") }}>
                        <Image source={Imagepath.Logo} style={{ height: normalize(35), width: normalize(35), resizeMode: "contain" }} />
                    </TouchableOpacity>
                    <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        width: normalize(80), paddingHorizontal: normalize(10)
                    }}>
                        <TouchableOpacity onPress={() => { props.navigation.navigate("BrowseScreen") }}>
                            <NotifyIcn name="bell-ring-outline" size={23} color={Colorpath.black} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { props.navigation.navigate("FilterScreen") }}>
                            <SearchIcn name="search" size={23} color={Colorpath.black} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: normalize(20) }}>
                    {wholecontent?.mobile_top_banners?.length > 0 ? <View>
                        <Carousel
                            ref={carouselRef}
                            layout={'default'}
                            data={filteredBanners}
                            marginTop={normalize(10)}
                            sliderWidth={windowWidth}
                            itemWidth={
                                Platform.OS === 'ios' ? windowWidth : windowWidth
                            }
                            itemHeight={windowHeight * 0.4}
                            sliderHeight={windowHeight * 0.9}
                            renderItem={({ item }) => <BannerComponent val={val} handleNext={handleNext} setTopbanner={setTopbanner} topbanner={topbanner} bannerHtmlContent={filteredBanners} htmlContent={item?.html_content} />}
                            firstItem={0}
                            onSnapToItem={handleSnapToItem}
                        />
                        <View
                            style={{
                                width: normalize(40),
                                alignSelf: 'center'
                            }}>
                            <Pagination
                                dotsLength={topbanner}
                                activeDotIndex={val}
                                dotStyle={{
                                    width: normalize(20),
                                    height: 10,
                                    borderRadius: 10,
                                    backgroundColor: "#999999",
                                    marginHorizontal: normalize(30)
                                }}
                                inactiveDotStyle={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 10,
                                    opacity: 0.7,
                                    borderWidth: 1,
                                    borderColor: "#999999",
                                    backgroundColor: Colorpath.Pagebg
                                }}
                                containerStyle={{
                                    gap: 10,
                                }}
                                inactiveDotScale={0.9}
                            />
                        </View>
                    </View> :
                        <View style={{ marginTop: normalize(30), justifyContent: "center", alignSelf: "center" }}>
                            <ActivityIndicator
                                size="small"
                                color={Colorpath.white}
                                style={{
                                    position: 'absolute',
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    borderRadius: 30,
                                    height: 40,
                                    width: 40,
                                    zIndex: 999
                                }}
                            />
                        </View>}
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000000" }}>{"Featured"}</Text>
                    </View>
                    {wholecontent?.featured_conferences?.length > 0 ? <View>
                        <Carousel
                            layout={'default'}
                            data={wholecontent?.featured_conferences}
                            marginTop={normalize(10)}
                            sliderWidth={windowWidth}
                            itemWidth={
                                Platform.OS === 'ios' ? windowWidth : windowWidth
                            }
                            itemHeight={windowHeight * 0.4}
                            sliderHeight={windowHeight * 0.9}
                            renderItem={({ item }) => <FeaturedComponent item={item} />}
                            firstItem={0}
                            onSnapToItem={handleSnapToItems}
                        />
                        <View
                            style={{
                                width: normalize(40),
                                alignSelf: 'center'
                            }}>
                            <Pagination
                                dotsLength={wholecontent?.featured_conferences?.length}
                                activeDotIndex={vals}
                                dotStyle={{
                                    width: normalize(20),
                                    height: 10,
                                    borderRadius: 10,
                                    backgroundColor: "#999999",
                                    marginHorizontal: normalize(30)
                                }}
                                inactiveDotStyle={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 10,
                                    opacity: 0.7,
                                    borderWidth: 1,
                                    borderColor: "#999999",
                                    backgroundColor: Colorpath.Pagebg
                                }}
                                containerStyle={{
                                    gap: 10,
                                }}
                                inactiveDotScale={0.9}
                            />
                        </View>
                    </View> : null}

                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000000" }}>{"Exclusive CME & CE Course Bundles"}</Text>
                    </View>
                    <View>
                        <FlatList
                            horizontal
                            data={flatData}
                            renderItem={exclusiveItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <FlatList
                            horizontal
                            data={activeIndex === 0
                                ? wholecontent?.state_course_bundles
                                : wholecontent?.specialty_course_bundles || []}
                            renderItem={({ item, index }) =>
                                item ? <CMEExclusive item={item} index={index} /> : null}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={
                                activeIndex === 1 && !wholecontent?.specialty_course_bundles?.length
                                    ? <Text>No courses available</Text>
                                    : null
                            }
                        />
                    </View>
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000000" }}>{"By Specialty"}</Text>
                    </View>
                    <View>
                        <FlatList
                            horizontal
                            data={flatDataspecaility}
                            renderItem={exclusiveItemspe}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <FlatList
                            horizontal
                            data={[flatDatamanyspecaility[activeIndexspe]]}
                            renderItem={exclusiveItemsmany}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10), justifyContent: "center", alignItems: "center" }}>
                        <ImageBackground source={Imagepath.HomeBanner} style={{ height: normalize(130), width: normalize(300) }} imageStyle={{ borderRadius: 30 }} resizeMode="stretch">
                            <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: Fonts.InterBold,
                                        fontSize: 18,
                                        color: "#FFFFFF",
                                        flexShrink: 1,
                                        flexWrap: 'wrap',
                                        paddingVertical: 2,
                                        alignSelf: "center",
                                        lineHeight: normalize(20),
                                        textAlign: "center"
                                    }}
                                >
                                    {"Recognition and Response:\nViolence and Abuse in the Healthcare"}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignContent: "space-evenly" }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Image source={Imagepath.CreditValut} style={{ tintColor: "#FFFFFF", height: normalize(15), width: normalize(15), resizeMode: "contain" }} />
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#FFFFFF", marginLeft: normalize(10) }}>{"9 CME Credits"}</Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Icon name="access-time" size={20} color="#FFFFFF" />
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#FFFFFF", marginLeft: normalize(10) }}>{"9 Contact Hours"}</Text>
                                </View>
                            </View>
                            <Buttons
                                onPress={() => {
                                    props.navigation.navigate("SearchResult")
                                }}
                                height={normalize(35)}
                                width={normalize(140)}
                                backgroundColor={"#FF773D"}
                                borderRadius={normalize(5)}
                                text="REGISTER NOW"
                                color={Colorpath.white}
                                fontSize={16}
                                fontFamily={Fonts.InterBold}
                                marginTop={normalize(10)}
                            />
                        </ImageBackground>
                    </View>
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000000" }}>{"In-Person & Hybrid"}</Text>
                    </View>
                    <View>
                        <FlatList
                            horizontal
                            data={Inpersonhybrid}
                            renderItem={exclusiveItemsInperson}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <FlatList
                            horizontal
                            data={[flatDatasinperson[activeIndexspein]]}
                            renderItem={exclusiveItemsmanyin}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000000" }}>{"Live Webinars"}</Text>
                    </View>
                    <View>
                        <FlatList
                            horizontal
                            data={flatDatasinpersonlive}
                            renderItem={exclusiveItemsmanyinlive}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10), justifyContent: "center", alignItems: "center" }}>
                        <ImageBackground source={Imagepath.HomeBanner} style={{ height: normalize(130), width: normalize(300) }} imageStyle={{ borderRadius: 30 }} resizeMode="stretch">
                            <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: Fonts.InterBold,
                                        fontSize: 18,
                                        color: "#FFFFFF",
                                        flexShrink: 1,
                                        flexWrap: 'wrap',
                                        paddingVertical: 2,
                                        alignSelf: "center",
                                        lineHeight: normalize(20),
                                        textAlign: "center"
                                    }}
                                >
                                    {"Recognition and Response:\nViolence and Abuse in the Healthcare"}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignContent: "space-evenly" }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Image source={Imagepath.CreditValut} style={{ tintColor: "#FFFFFF", height: normalize(15), width: normalize(15), resizeMode: "contain" }} />
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#FFFFFF", marginLeft: normalize(10) }}>{"9 CME Credits"}</Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Icon name="access-time" size={20} color="#FFFFFF" />
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 12, color: "#FFFFFF", marginLeft: normalize(10) }}>{"9 Contact Hours"}</Text>
                                </View>
                            </View>
                            <Buttons
                                onPress={() => {
                                    console.log("dsfkdkgkdj")
                                }}
                                height={normalize(35)}
                                width={normalize(140)}
                                backgroundColor={"#FF773D"}
                                borderRadius={normalize(5)}
                                text="REGISTER NOW"
                                color={Colorpath.white}
                                fontSize={16}
                                fontFamily={Fonts.InterBold}
                                marginTop={normalize(10)}
                            />
                        </ImageBackground>
                    </View>
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000000" }}>{"Sponsored & Free"}</Text>
                    </View>
                    <View>
                        <FlatList
                            horizontal
                            data={flatDatasinpersonlivefree}
                            renderItem={exclusiveItemsmanyinlivefree}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10), justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000000" }}>{"World’s Largest"}</Text>
                        <Text style={{ fontStyle: "italic", fontFamily: Fonts.InterExtraBold, fontSize: 28, color: Colorpath.ButtonColr }}>{"CME/CE marketplace"}</Text>
                    </View>
                    <View style={{ justifyContent: "center", alignSelf: "center" }}>
                        <ImageBackground
                            source={Imagepath.HomeUser}
                            style={{
                                height: normalize(175),
                                width: normalize(310)
                            }}
                            imageStyle={{ borderRadius: 10 }}
                            resizeMode="stretch"
                        >
                            <View style={{ paddingVertical: normalize(20), paddingHorizontal: normalize(30) }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={{ width: "48%" }}>
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#FFFFFF" }}>{"Hosted Conferences"}</Text>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 26, color: "#FFFFFF" }}>{"256,968 +"}</Text>
                                    </View>
                                    <View style={{ width: "48%" }}>
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#FFFFFF" }}>{"Registrations Sold"}</Text>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 26, color: "#FFFFFF" }}>{"85,656 +"}</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: normalize(5) }}>
                                    <View style={{ width: "48%" }}>
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#FFFFFF" }}>{"Monthly Visitors"}</Text>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 26, color: "#FFFFFF" }}>{"395,811 +"}</Text>
                                    </View>
                                    <View style={{ width: "48%" }}>
                                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#FFFFFF" }}>{"Healthcare Professionals"}</Text>
                                        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 26, color: "#FFFFFF" }}>{"1,435,627 +"}</Text>
                                    </View>
                                </View>

                                <View style={{ marginTop: normalize(5) }}>
                                    <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 12, color: "#FFFFFF" }}>{"Organizers"}</Text>
                                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 26, color: "#FFFFFF" }}>{"14,307 +"}</Text>
                                </View>
                            </View>

                        </ImageBackground>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center", alignSelf: "center", marginTop: normalize(40) }}>
                        <ImageBackground
                            source={Imagepath.MainCard}
                            style={{
                                height: normalize(580),
                                width: normalize(325)
                            }}
                            imageStyle={{ borderRadius: 10 }}
                            resizeMode="stretch"
                        >
                            <View style={{
                                height: normalize(70),
                                width: normalize(70),
                                borderRadius: normalize(40),
                                shadowColor: "#000",
                                shadowOffset: { height: 3, width: 0 },
                                shadowOpacity: 5,
                                shadowRadius: 10,
                                elevation: 10,
                                backgroundColor: "#FF773D",
                                alignSelf: "center",
                                position: 'relative',
                                marginTop: normalize(-35),
                                zIndex: 999,
                                justifyContent: "center"
                            }}>
                                <Image source={Imagepath.CrownHome} style={{ height: normalize(38), width: normalize(38), resizeMode: "contain", alignSelf: "center" }} />
                            </View>
                            <View style={{ width: normalize(320), alignItems: "center", paddingVertical: normalize(10) }}>
                                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#FFFFFF", textAlign: "center" }}>
                                    {"Discover the Value of Your"}
                                </Text>

                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: normalize(5) }}>
                                    <Image
                                        source={Imagepath.TickMark}
                                        style={{ height: normalize(35), width: normalize(35), resizeMode: "contain" }}
                                    />
                                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 30, color: "#FFFFFF", textAlign: "center" }}>
                                        {"Prime Membership"}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: normalize(20) }}>
                                <Image
                                    source={Imagepath.CrownHome}
                                    style={{ height: normalize(25), width: normalize(25), resizeMode: "contain" }}
                                />
                                <Text style={{ marginLeft: normalize(10), fontFamily: Fonts.InterRegular, fontSize: 16, color: "#FFFFFF", textAlign: "center" }}>
                                    {"Multi State & Board Licensure Tracking"}
                                </Text>
                            </View>
                            <View style={{ width: "105%", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: normalize(20) }}>
                                <Image
                                    source={Imagepath.CrownHome}
                                    style={{ height: normalize(25), width: normalize(25), resizeMode: "contain" }}
                                />
                                <Text style={{ marginLeft: normalize(10), fontFamily: Fonts.InterRegular, fontSize: 16, color: "#FFFFFF", textAlign: "center" }}>
                                    {"Personalized CME/CE Recommendations"}
                                </Text>
                            </View>
                            <View style={{ width: "90%", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: normalize(20) }}>
                                <Image
                                    source={Imagepath.CrownHome}
                                    style={{ height: normalize(25), width: normalize(25), resizeMode: "contain" }}
                                />
                                <Text style={{ marginLeft: normalize(10), fontFamily: Fonts.InterRegular, fontSize: 16, color: "#FFFFFF", textAlign: "center" }}>
                                    {"Centralized CME/CE Credit Vault"}
                                </Text>
                            </View>
                            <View style={{ width: "85%", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: normalize(20) }}>
                                <Image
                                    source={Imagepath.CrownHome}
                                    style={{ height: normalize(25), width: normalize(25), resizeMode: "contain" }}
                                />
                                <Text style={{ marginLeft: normalize(10), fontFamily: Fonts.InterRegular, fontSize: 16, color: "#FFFFFF", textAlign: "center" }}>
                                    {"Credentialing Document Vault"}
                                </Text>
                            </View>
                            <View style={{ width: "86%", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: normalize(20) }}>
                                <Image
                                    source={Imagepath.CrownHome}
                                    style={{ height: normalize(25), width: normalize(25), resizeMode: "contain" }}
                                />
                                <Text style={{ marginLeft: normalize(10), fontFamily: Fonts.InterRegular, fontSize: 16, color: "#FFFFFF", textAlign: "center" }}>
                                    {"Add Credits earned elsewhere"}
                                </Text>
                            </View>
                            <View style={{ width: "96%", flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: normalize(20) }}>
                                <Image
                                    source={Imagepath.CrownHome}
                                    style={{ height: normalize(25), width: normalize(25), resizeMode: "contain" }}
                                />
                                <Text style={{ marginLeft: normalize(10), fontFamily: Fonts.InterRegular, fontSize: 16, color: "#FFFFFF", textAlign: "center" }}>
                                    {"CME/CE Planning Tool & Scheduler"}
                                </Text>
                            </View>
                            <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10), justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#FFFFFF", textDecorationLine: "underline" }}>{"and more features..."}</Text>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                                <Text
                                    numberOfLines={3}
                                    style={{
                                        fontFamily: Fonts.InterRegular,
                                        fontSize: 16,
                                        color: "#FFFFFF",
                                        flexShrink: 1,
                                        flexWrap: 'wrap',
                                        textAlign: "center",
                                    }}
                                >
                                    {"Join eMedEvents Prime and elevate your \n professional journey with unmatched \n features and support"}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => { props.navigation.navigate("Testing") }} style={{ justifyContent: "center", alignSelf: "center", alignItems: "center", paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                                <ImageBackground
                                    source={Imagepath.StartBg}
                                    style={{ height: normalize(50), width: normalize(310), justifyContent: "center", alignItems: "center" }}
                                    resizeMode="stretch"
                                    imageStyle={{ borderRadius: 10 }}
                                >
                                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignContent: "space-evenly" }}>
                                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 18, color: "#FFFFFF", textAlign: "center" }}>
                                            {"Start Your 30-Day Free Trial Today!"}
                                        </Text>
                                        <TouchableOpacity style={styles.iconContainer}>
                                            <Icon name="chevron-right" size={24} color="#FFFFFF" />
                                        </TouchableOpacity>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                            <View style={{ paddingHorizontal: normalize(10), justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontFamily: Fonts.InterLight, fontSize: 12, color: "#FFFFFF" }}>{"No credit card is needed to get started"}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10), justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontFamily: Fonts.InterBold, fontSize: 20, color: "#000000" }}>{"Customer Chronicles"}</Text>
                        <Text style={{ fontFamily: Fonts.InterExtraBold, fontSize: 28, color: Colorpath.ButtonColr, fontStyle: 'italic' }}>{"real stories, real impact"}</Text>
                    </View>
                    <View>
                        <Carousel
                            layout={'default'}
                            data={commentData}
                            sliderWidth={windowWidth}
                            itemWidth={
                                Platform.OS === 'ios' ? windowWidth : windowWidth
                            }
                            itemHeight={windowHeight * 0.4}
                            sliderHeight={windowHeight * 0.9}
                            renderItem={commentDataItem}
                            firstItem={0}
                            onSnapToItem={handlecmmnt}
                        />
                        <View
                            style={{
                                width: normalize(40),
                                alignSelf: 'center'
                            }}>
                            <Pagination
                                dotsLength={4}
                                activeDotIndex={valcmmnt}
                                dotStyle={{
                                    width: normalize(20),
                                    height: 10,
                                    borderRadius: 10,
                                    backgroundColor: "#999999",
                                    marginHorizontal: normalize(30)
                                }}
                                inactiveDotStyle={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 10,
                                    opacity: 0.7,
                                    borderWidth: 1,
                                    borderColor: "#999999",
                                    backgroundColor: Colorpath.Pagebg
                                }}
                                containerStyle={{
                                    gap: 10,
                                }}
                                inactiveDotScale={0.9}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default GuestUser
const styles = StyleSheet.create({
    imageBackground: {
        height: normalize(170),
        width: normalize(310),
        justifyContent: 'space-between',
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(10),
    },
    courseTitle: {
        fontSize: 24,
        fontFamily: Fonts.InterSemiBold,
        color: '#FFFFFF',
        marginBottom: normalize(4),
    },
    courseProvider: {
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 12,
        fontFamily: Fonts.InterMedium,
    },
    infoContainer: {
        flexDirection: 'column',
        marginBottom: normalize(8),
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(4),
    },
    infoText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginLeft: normalize(6),
        fontFamily: Fonts.InterMedium,
    },
    iconContainer: {
        marginLeft: normalize(5), // aligns icon to the end of the row
        // paddingLeft: normalize(8),
        borderWidth: 2,
        borderColor: "#FFFFFF",
        borderRadius: 20
    },
});