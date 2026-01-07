import { View, Text, ImageBackground, ActivityIndicator, RefreshControl, Platform, Image, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Colorpath from '../../Themes/Colorpath'
import Imagepath from '../../Themes/Imagepath'
import normalize from '../../Utils/Helpers/Dimen';
import Fonts from '../../Themes/Fonts';
import PageHeader from '../../Components/PageHeader';
import MyStatusBar from '../../Utils/MyStatusBar';
import { CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { searchSpeakerRequest } from '../../Redux/Reducers/TransReducer';
import showErrorAlert from '../../Utils/Helpers/Toast';
import connectionrequest from '../../Utils/Helpers/NetInfo';
import { AppContext } from './AppContext';
import NetInfo from '@react-native-community/netinfo';
import IntOff from '../../Utils/Helpers/IntOff';
import { SafeAreaView } from 'react-native-safe-area-context'

let status = "";
const Speaker = (props) => {
       const {
        isConnected
    } = useContext(AppContext);
    const [conn, setConn] = useState("")
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection State:', state.isConnected);
            setConn(state.isConnected);
        });
        return () => unsubscribe();
    }, [isConnected]);
    const TransReducer = useSelector(state => state.TransReducer);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(0);
    const [hasmore, setHasMore] = useState(false);
    const [wholeData, setWholeData] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const hasScrolled = useRef(false);
    const perPage = 5;
    const handleScroll = useCallback(() => {
        hasScrolled.current = true;
    }, []);
    console.log(props?.route?.params, "get---------")
    const speakerItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => {
                props.navigation.navigate("SpeakerProfile", { fullUrl: { hitDat: props?.route?.params?.highText?.highText, fullUrl: item?.user_url || item?.url, creditData: props?.route?.params?.highText?.CreditData, speaks: props?.route?.params?.highText?.organ ? "organ" : "speaker" } });
                setSelectedIndex(selectedIndex === index ? null : index);
            }} style={{
                backgroundColor: Colorpath.white,
                paddingHorizontal: normalize(10),
                paddingVertical: normalize(10),
                margin: normalize(10),
                borderBottomRightRadius: normalize(10),
                borderBottomLeftRadius: normalize(10),
                borderTopStartRadius: normalize(10),
                borderTopEndRadius: normalize(10),
                borderWidth: 0.8,
                borderColor: selectedIndex === index ? Colorpath.ButtonColr : "#DADADA"
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <View style={{
                        height: normalize(70),
                        width: normalize(70),
                        backgroundColor: 'white',
                        borderRadius: normalize(35),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: normalize(10),
                    }}>
                        <ImageBackground
                            source={
                                (() => {
                                    const baseUrl = TransReducer?.searchSpeakerResponse?.ImagePath
                                        ?? TransReducer?.searchSpeakerResponse?.imagePath;

                                    const imagePath = item?.image_path;
                                    if (baseUrl && imagePath) {
                                        return { uri: `${baseUrl}${imagePath}` };
                                    }
                                    return Imagepath.HumanIcn;
                                })()
                            }
                            style={{
                                height: normalize(60),
                                width: normalize(60),
                            }}
                            imageStyle={{ borderRadius: normalize(50) }}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: "column" }}>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 18, color: "#000000", fontWeight: "bold" }}>{item?.firstname || item?.label}</Text>
                        {(item?.designation || item?.location) && <Text style={{ paddingVertical: normalize(5), fontFamily: Fonts.InterRegular, fontSize: 14, color: "#333" }}>{item?.designation || item?.location}</Text>}
                        {(item?.state_name || item?.country_code) && <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#333" }}>{item?.state_name + "," + item?.country_code}</Text>}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    const SearchBack = () => {
        props.navigation.goBack();
    }
    useEffect(() => {
        if (props?.route?.params?.highText) {
            let obj = props?.route?.params?.highText?.speaks == "speaker" ? {
                "name": props?.route?.params?.highText?.highText.trim(),
                "speaker":""
            } : {
                "name": props?.route?.params?.highText?.highText.trim(),
            }
            connectionrequest()
                .then(() => {
                    dispatch(searchSpeakerRequest(obj));
                })
                .catch((err) => {
                    showErrorAlert("Please connect to internet", err);
                });
        }
    }, [props?.route?.params])
    if (status === '' || TransReducer.status !== status) {
        switch (TransReducer.status) {
            case 'Transaction/searchSpeakerRequest':
                status = TransReducer.status;
                break;
            case 'Transaction/searchSpeakerSuccess':
                status = TransReducer.status;
                const speakerDataRaw = TransReducer?.searchSpeakerResponse?.Search_speakerlist ||
                    TransReducer?.searchSpeakerResponse?.searchOrganizerList;
                const speakerData = speakerDataRaw
                    ? Array.isArray(speakerDataRaw)
                        ? speakerDataRaw
                        : [speakerDataRaw]  
                    : [];

                const mergedData = [...speakerData].filter(Boolean);  
                if (mergedData.length > 0) {
                    const uniqueData = Array.from(
                        new Map(
                            mergedData.map((item, index) => {
                                const key = item?.id || [
                                    item.firstname?.substring(0, 20) || 'fn', 
                                    item.lastname?.substring(0, 20) || 'ln',
                                    item.user_url || 'url',
                                    Date.now() 
                                ].join('_');

                                return [key, item];
                            })
                        ).values()
                    );
                    const safeEnd = Math.max(
                        (currentPage + 1) * perPage,
                        1 
                    );

                    setWholeData(
                        uniqueData.length > 0
                            ? uniqueData.slice(0, safeEnd)
                            : [] 
                    );
                } else {
                    setWholeData([]); 
                }
                break;
            case 'Transaction/searchSpeakerFailure':
                status = TransReducer.status;
                break;
        }
    }
    const handleLoadMore = () => {
        const startIndex = currentPage * perPage;
        const endIndex = startIndex + perPage;
        const newData = TransReducer?.searchSpeakerResponse?.Search_speakerlist && TransReducer?.searchSpeakerResponse?.Search_speakerlist.slice(startIndex, endIndex) || TransReducer?.searchSpeakerResponse?.searchOrganizerList && TransReducer?.searchSpeakerResponse?.searchOrganizerList.slice(startIndex, endIndex);

        if (newData?.length > 0) {
            setWholeData([...wholeData, ...newData]);
            setCurrentPage(currentPage + 1);
        } else {
            setHasMore(false); // Disable onEndReached
        }
    };
    useLayoutEffect(() => {
                props.navigation.setOptions({ gestureEnabled: false });
            }, []);
    return (
        <>
            <MyStatusBar
                barStyle={'light-content'}
                backgroundColor={Colorpath.Pagebg}
            />
            {conn == false ? <IntOff/> :<SafeAreaView style={{ flex: 1, backgroundColor: Colorpath.Pagebg }}>
                <View style={{ backgroundColor: "#FFFFFF", marginTop: Platform.OS === 'ios' ? normalize(0) : normalize(40) }}>
                    {Platform.OS === "ios" ? (
                        <PageHeader
                            title={props?.route?.params?.highText?.organ == "organ" ? "Search Organizers" : "Search Speakers"}
                            onBackPress={SearchBack}
                        />
                    ) : (
                        <PageHeader
                            title={props?.route?.params?.highText?.organ == "organ" ? "Search Organizers" : "Search Speakers"}
                            onBackPress={SearchBack}
                        />

                    )}
                </View>
                <TouchableOpacity style={{ paddingHorizontal: normalize(10), paddingVertical: normalize(10) }}>
                    <View style={{ justifyContent: "space-between", alignContent: "space-between", flexDirection: "row" }}>
                        <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 16, color: "#333" }}>{`Showing (${TransReducer?.searchSpeakerResponse?.Speakercount || TransReducer?.searchSpeakerResponse?.organizerCount}) Results for`}</Text>
                    </View>
                </TouchableOpacity>
                {props?.route?.params?.highText?.highText && <View style={{ paddingHorizontal: normalize(10), marginTop: normalize(-10), paddingVertical: normalize(5) }}>
                    <Text style={{ fontFamily: Fonts.InterBold, fontSize: 24, color: Colorpath.ButtonColr }}>{props?.route?.params?.highText?.highText}</Text>
                </View>}
                <View>
                    <FlatList
                        data={wholeData}
                        renderItem={speakerItem}
                        keyExtractor={(item, index) => item.id + index.toString()}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        onScroll={handleScroll}
                        ListFooterComponent={() =>
                            hasmore ? (
                                <View style={{ paddingVertical: 20 }}>
                                    <ActivityIndicator size="small" color={Colorpath.ButtonColr} />
                                </View>
                            ) : null
                        }
                        contentContainerStyle={{ paddingBottom: normalize(170) }}
                        ListEmptyComponent={
                            <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(25) }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        // height: normalize(83),
                                        width: normalize(290),
                                        borderRadius: normalize(10),
                                        backgroundColor: "#FFFFFF",
                                        paddingHorizontal: normalize(10),
                                        paddingVertical: normalize(10),
                                        alignItems: "center",
                                        borderStyle: 'dotted',
                                        borderWidth: 1,
                                    }}
                                >
                                    <View style={{ flex: 1, justifyContent: "center" }}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.InterSemiBold,
                                                fontSize: 16,
                                                color: Colorpath.ButtonColr,
                                                fontWeight: "bold",
                                                alignSelf: "center"
                                            }}
                                        >
                                            {"There are no matches available for your search criteria. Please change the criteria and try again."}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        } />
                </View>
            </SafeAreaView>}
        </>

    )
}

export default Speaker