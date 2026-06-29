import { View, Text, ScrollView, Animated, Dimensions } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import Fonts from '../../Themes/Fonts'
import normalize from '../../Utils/Helpers/Dimen';
import Colorpath from '../../Themes/Colorpath';

/**
 * Reusable StatewebcastText component.
 * 
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element}
 */

const StatewebcastText = ({ webcastdeatils, allSpecailities, expandspecailtar, targetChange }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [showIndicator, setShowIndicator] = useState(false);
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 3,
                duration: 1500,
                useNativeDriver: true,
            })
        ).start();
    }, [animatedValue]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: showIndicator ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [showIndicator, fadeAnim]);

    const opacity1 = animatedValue.interpolate({
        inputRange: [0, 0.5, 1, 3],
        outputRange: [0.3, 1, 0.3, 0.3],
    });
    const opacity2 = animatedValue.interpolate({
        inputRange: [0, 1, 1.5, 2, 3],
        outputRange: [0.3, 0.3, 1, 0.3, 0.3],
    });
    const opacity3 = animatedValue.interpolate({
        inputRange: [0, 2, 2.5, 3],
        outputRange: [0.3, 0.3, 1, 0.3],
    });

    const handleScroll = (event) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const isEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 15;
        setShowIndicator(!isEnd);
    };

    const handleContentSizeChange = (contentWidth) => {
        if (contentWidth > screenWidth - normalize(21)) {
            setShowIndicator(true);
        } else {
            setShowIndicator(false);
        }
    };

    console.log(allSpecailities?.length, "allSpecailities-----", webcastdeatils?.targetAudience);
    const specialityShow = ({ index, item }) => {
        return (
            <View style={{ paddingVertical: normalize(3) }}>
                <View style={{ padding: 10, borderWidth: 0.5, borderColor: "#DDDDDD", paddingVertical: normalize(7), marginLeft: normalize(8), backgroundColor: "#F5FAFF", borderRadius: normalize(5) }}>
                    <Text
                        style={{
                            fontFamily: Fonts.InterMedium,
                            fontSize: 16,
                            color: '#000000',
                            alignSelf: "center"
                        }}>
                        {item}
                    </Text>
                </View>
            </View>
        )
    }
    return (
        <View>
            {webcastdeatils?.targetAudience?.length > 0 ? <><View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: normalize(15),
                    paddingVertical: normalize(10),
                }}>
                <Text
                    style={{
                        fontFamily: Fonts.InterBold,
                        fontWeight: "bold",
                        fontSize: 18,
                        color: '#000000',
                    }}>
                    {'Target Audience'}
                </Text>
                <Animated.View style={{ opacity: fadeAnim, flexDirection: 'row', alignItems: 'center', paddingRight: normalize(5) }}>
                    <Animated.Text style={{ opacity: opacity1, fontSize: 16, fontWeight: 'bold', color: Colorpath.ButtonColr }}>&gt;</Animated.Text>
                    <Animated.Text style={{ opacity: opacity2, fontSize: 16, fontWeight: 'bold', color: Colorpath.ButtonColr, marginLeft: 2 }}>&gt;</Animated.Text>
                    <Animated.Text style={{ opacity: opacity3, fontSize: 16, fontWeight: 'bold', color: Colorpath.ButtonColr, marginLeft: 2 }}>&gt;</Animated.Text>
                </Animated.View>
            </View>
                <View style={{ marginLeft: normalize(6), paddingRight: normalize(15) }}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        onContentSizeChange={handleContentSizeChange}
                    >
                        {webcastdeatils?.targetAudience?.map((item, index) => (
                            <React.Fragment key={`${item}-${index}`}>
                                {specialityShow({ item, index })}
                            </React.Fragment>
                        ))}
                    </ScrollView>
                </View>
            </> : null}
        </View>
    )
}

export default StatewebcastText
