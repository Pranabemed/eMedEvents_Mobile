import { View, Text, Image, TouchableOpacity, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Imagepath from '../../Themes/Imagepath';
import CustomTextField from '../../Components/CustomTextfiled';
import ArrowIcon from 'react-native-vector-icons/MaterialIcons';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
const ExploreInput = ({setDownlink, setStatepick, setCreditModal, particular, statewise, setFiltering }) => {
    const animatedValuestatedate = useRef(new Animated.Value(1)).current;
    const scaleValuesestatedate = useRef(new Animated.Value(0)).current;
    const animatedValuestatedatesatte = useRef(new Animated.Value(1)).current;
    const scaleValuesestatedatesatte = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const targetScaleprofddff = particular ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuestatedate, {
                toValue: particular ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesestatedate, {
                toValue: targetScaleprofddff,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [particular]);
    useEffect(() => {
        const targetScaleprofddffee = statewise ? 1 : 0.8;
        Animated.parallel([
            Animated.timing(animatedValuestatedatesatte, {
                toValue: statewise ? 1 : 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(scaleValuesestatedatesatte, {
                toValue: targetScaleprofddffee,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    }, [statewise]);
    return (
        <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: normalize(6) }}>
                <View style={{ flex: 0.54, justifyContent: "center", paddingVertical: particular ? normalize(10) : normalize(0) }}>
                    <Animated.View style={{ opacity: animatedValuestatedate, transform: [{ scale: scaleValuesestatedate }] }}>
                        {particular == "All Professions" ? "" : (
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000", fontWeight: "bold", marginBottom: normalize(-2)}}>
                                {"Choose your profession"}
                            </Text>
                        )}
                    </Animated.View>
                    <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5, width: "100%",marginTop:normalize(10) }}>
                        <TouchableOpacity
                            onPress={() => {
                                setStatepick(false);
                                setCreditModal(true);
                                setDownlink(false);
                            }}
                        >
                            <View style={{ flexDirection: "row", justifyContent: "space-between"}}>  
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000000", paddingVertical: 0 }}>  
                                    {particular == "All Professions" ? "Choose your profession":particular ? particular : "Choose your profession"}
                                </Text>
                                <TouchableOpacity onPress={() => { setCreditModal(true);
                                    setDownlink(false);
                                 }}>
                                    <ArrowIcon style={{marginRight:normalize(3)}} name={particular ?'arrow-drop-down':'arrow-drop-up' } size={28} color={"#000000"} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 0.43, justifyContent: "center", paddingVertical: statewise ? normalize(10) : normalize(0) }}>
                    <Animated.View style={{ opacity: animatedValuestatedatesatte, transform: [{ scale: scaleValuesestatedatesatte }] }}>
                        {statewise == "All States"? "":(
                            <Text style={{ fontFamily: Fonts.InterMedium, fontSize: 14, color: "#000000", fontWeight: "bold", marginBottom: normalize(-2), lineHeight: 16 }}>
                                {"Choose your State"}
                            </Text>
                        )}
                    </Animated.View>
                    <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5, width: "100%",marginTop:normalize(10) }}>
                        <TouchableOpacity
                            onPress={() => {
                                setStatepick(true);
                                setCreditModal(false);
                                setDownlink(false);
                            }}
                        >
                            <View style={{ flexDirection: "row", justifyContent: "space-between"}}>  
                                <Text style={{ fontFamily: Fonts.InterRegular, fontSize: 14, color: "#000000", paddingVertical: 0 }}>  
                                    {statewise == "All States" ? "Choose your State" :statewise ? statewise : "Choose your State"}
                                </Text>
                                <TouchableOpacity onPress={() => { 
                                    setStatepick(true);
                                    setDownlink(false); }}>
                                    <ArrowIcon name={statewise ?  'arrow-drop-down':'arrow-drop-up'} size={28} color={"#000000"} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </View>
            <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent:"space-between",paddingVertical:normalize(10)}}>
                    <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 18, color: "#000000",marginLeft:normalize(5)}}>
                        {"Topic Filters"}
                    </Text>
                    <TouchableOpacity 
                        onPress={() => {
                            setFiltering(true);
                        }}
                    >
                        <Image
                            source={Imagepath.Filter}
                            style={{left:10,height: normalize(20), width: normalize(50), resizeMode: "contain" }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default ExploreInput