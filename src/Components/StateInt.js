import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import {
    View,
    Platform,
    Dimensions,
    TouchableOpacity,
    Image,
    Text
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Colorpath from '../Themes/Colorpath';
import normalize from '../Utils/Helpers/Dimen';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import HomeShimmer from './DashBoardShimmer';
import Carouselcarditem from './Carouselcarditem';
import { AppContext } from '../Screen/GlobalSupport/AppContext';
import Imagepath from '../Themes/Imagepath';
import NetInfo from '@react-native-community/netinfo';
import Fonts from '../Themes/Fonts';
import Buttons from './Button';
import StackNav from '../Navigator/StackNav';
export default function StateIntData({ setRenewal, renewal, setStateid, stateid, setTotalCred, totalcard, finalProfessionmain, setPrimeadd, enables, setStateCount, fetcheddt, stateCount, fulldashbaord, setFulldashbaord, cmecourse, setTakestate, takestate, setAddit, addit }) {
    const dispatch = useDispatch();
    const {
        setIsConnected
    } = useContext(AppContext);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation();
    const [val, setval] = useState(0);
    const carouselRef = useRef(null);
    const [nettrue, setNettrue] = useState("");

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setNettrue(state.isConnected);
        });

        return () => unsubscribe();
    }, []);
      const handleRot =()=>{
         const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                <StackNav/>
            }
        });

        return () => unsubscribe();
    }
    return (
        <>

            <View>
                {fulldashbaord?.length > 0 ?
                    <View key={`dashboard-${fulldashbaord.length}`}>
                        <View style={{ height: normalize(260), width: normalize(320), alignSelf: "center", backgroundColor: Colorpath.ButtonColr }}>
                            <TouchableOpacity
                                style={{
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                    marginTop: Platform.OS === 'ios' ? normalize(18) : normalize(8),
                                    flexDirection: "row",
                                    gap: normalize(3)
                                }}
                            >
                                <Image source={Imagepath.PlusNew} style={{ height: normalize(16), width: normalize(17), resizeMode: 'contain' }} />
                                <Text style={Platform.OS === 'ios' ? {
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                    // marginTop: normalize(8),
                                    bottom: normalize(1),
                                    flexDirection: "row",
                                    gap: normalize(3),
                                    marginRight: normalize(22),
                                    color: "#FFFFFF"
                                } : {
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                    marginTop: normalize(10),
                                    // bottom:normalize(1),
                                    flexDirection: "row",
                                    gap: normalize(3),
                                    marginRight: normalize(22),
                                    color: "#FFFFFF"
                                }}>{"Add Licenses"}</Text>
                            </TouchableOpacity>
                            <Carousel
                                ref={carouselRef}
                                layout={'default'}
                                data={fulldashbaord}
                                marginTop={normalize(0)}
                                sliderWidth={windowWidth}
                                itemWidth={
                                    Platform.OS === 'ios' ? windowWidth - normalize(20) : windowWidth - normalize(20)
                                }
                                itemHeight={windowHeight * 0.9}
                                sliderHeight={windowHeight * 0.9}
                                renderItem={({ item, index }) => <Carouselcarditem setPrimeadd={setPrimeadd} enables={enables} setStateCount={setStateCount} fetcheddt={fetcheddt} stateCount={stateCount} renewal={renewal} val={val} index={index} item={item} stateid={stateid} navigation={navigation} />}
                                firstItem={0}
                            />
                        </View>
                        {nettrue === false ?
                            <View style={{ justifyContent: "center", alignItems: "center", marginTop: normalize(40) }}>
                                <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 20, color: "#000000" }}>{"No Internet Connection"}</Text>
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 16, color: "#000000",marginTop:normalize(7) }}>{"Please check your internet connection \n                    and try again"}</Text>
                                <Buttons
                                    onPress={handleRot}
                                    height={normalize(45)}
                                    width={normalize(240)}
                                    backgroundColor={Colorpath.ButtonColr}
                                    borderRadius={normalize(5)}
                                    text="Retry"
                                    color={Colorpath.white}
                                    fontSize={16}
                                    fontFamily={Fonts.InterSemiBold}
                                    fontWeight="bold"
                                    marginTop={normalize(25)}
                                />
                            </View>
                            : null}
                    </View> : <HomeShimmer />}

            </View>
        </>
    );
}
