import { StyleSheet, View, TextInput, Text, TouchableOpacity, FlatList, Platform } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Colorpath from '../../Themes/Colorpath';
import Fonts from '../../Themes/Fonts';
import normalize from '../../Utils/Helpers/Dimen';
import Icon from 'react-native-vector-icons/Feather';
const CreditPrice = ({
  selectedFilter,
  setSelectedFilter,
  sliderWidth,
  min,
  max,
  step,
  onValueChange,
  text,
  setSelectedItm,
  selectedItm,
  resetEnable,
  currentMin,
  currentMax,
  setCurrentMin,
  setCurrentMax,
  trigmin,
  againHand,
  CMEText
}) => {
  const position = useSharedValue(0);
  const position2 = useSharedValue(sliderWidth);
  const opacity = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const zIndex = useSharedValue(0);
  const zIndex2 = useSharedValue(0);
  const context = useSharedValue(0);
  const context2 = useSharedValue(0);
  const [pricehard,setPricehard] = useState(false);
  const [newadd,setNewadd] = useState(false);
  useEffect(() => {
    if (resetEnable) {
      position.value = 0;
      position2.value = sliderWidth;
      opacity.value = 0;
      opacity2.value = 0;
      zIndex.value = 0;
      zIndex2.value = 0;

      setCurrentMin(min);
      setCurrentMax(max);

      runOnJS(onValueChange)({
        min: min,
        max: max,
      });
    }
  }, [resetEnable, min, max, sliderWidth, onValueChange, setCurrentMin, setCurrentMax]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      context.value = position.value;
    })
    .onUpdate(e => {
      opacity.value = 1;
      if (context.value + e.translationX < 0) {
        position.value = 0;
      } else if (context.value + e.translationX > position2.value - 10) {
        position.value = position2.value - 10;
      } else {
        position.value = context.value + e.translationX;
      }
    })
    .onEnd(() => {
      opacity.value = 0;
      const newMin =
        min +
        Math.floor(position.value / (sliderWidth / ((max - min) / step))) * step;

      runOnJS(setCurrentMin)(newMin);

      runOnJS(onValueChange)({
        min: newMin,
        max: currentMax,
      });
    });

  const pan2 = Gesture.Pan()
    .onBegin(() => {
      context2.value = position2.value;
    })
    .onUpdate(e => {
      opacity2.value = 1;
      if (context2.value + e.translationX > sliderWidth) {
        position2.value = sliderWidth;
      } else if (context2.value + e.translationX < position.value + 10) {
        position2.value = position.value + 10;
      } else {
        position2.value = context2.value + e.translationX;
      }
    })
    .onEnd(() => {
      opacity2.value = 0;
      const newMax =
        min +
        Math.floor(position2.value / (sliderWidth / ((max - min) / step))) * step;

      runOnJS(setCurrentMax)(newMax);

      runOnJS(onValueChange)({
        min: currentMin,
        max: newMax,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    zIndex: zIndex.value,
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: position2.value }],
    zIndex: zIndex2.value,
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const opacityStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
  }));

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    width: position2.value - position.value,
  }));

  Animated.addWhitelistedNativeProps({ text: true });
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  const minLabelText = useAnimatedProps(() => {
    return {
      text: `${min +
        Math.floor(position.value / (sliderWidth / ((max - min) / step))) * step
        }`,
    };
  });

  const maxLabelText = useAnimatedProps(() => {
    return {
      text: `${min +
        Math.floor(position2.value / (sliderWidth / ((max - min) / step))) *
        step
        }`,
    };
  });

  const hitData = ["Free Courses", "Non-CME Courses"];

  const SliderTick = (item) => {
    setSelectedItm(prevSelectedItems => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter(i => i !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };
console.log(CMEText,"CMEText-------")
  const cmeTack = pricehard ? "" : CMEText?.length > 0 ? CMEText :""
  const hitItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.professionItem}
        onPress={() => {
          setSelectedFilter(selectedFilter);
          SliderTick(item);
        }}
      >
        <View style={styles.professionRow}>
          <Icon
            name={selectedItm.includes(item) ? 'check' : 'check'}
            size={20}
            color={selectedItm.includes(item) ? '#FF5733' : '#CCCCCC'}
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between",gap:Platform.OS === "ios"? normalize(5):normalize(10)}}>
          <Text style={[styles.professionText,{width:normalize(90)}]}>{item}</Text>
          {cmeTack &&<TouchableOpacity onPress={()=>{
            setPricehard(!pricehard);
            againHand();
            }}>
            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#ff773d" }}>{"Clear"}</Text>
          </TouchableOpacity>}
        </View>
         
        </View>
      </TouchableOpacity>
    );
  };
const handleTrue = pricehard ? "":trigmin
console.log(handleTrue,"handleTrue------",pricehard,trigmin)
  return (
    <>
      <View style={{ justifyContent: "center", alignContent: "center", paddingVertical: normalize(10), paddingHorizontal: normalize(10) }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }}>
          <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#000000", textDecorationLine: "underline" }}>{text ? text : "Price Range"}</Text>
          {handleTrue &&<TouchableOpacity onPress={()=>{
            setPricehard(!pricehard);
            againHand();
            setNewadd(true);
            }}>
            <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 16, color: "#ff773d" }}>{"Clear"}</Text>
          </TouchableOpacity>}
        </View>
      </View>
      <View style={[styles.sliderContainer, { width: sliderWidth }]}>
        <View style={[styles.sliderBack, { width: sliderWidth }]} />
        <Animated.View style={[sliderStyle, styles.sliderFront, { marginLeft: normalize(2) }]} />
        <GestureDetector gesture={pan}>
          <Animated.View style={[animatedStyle, styles.thumb]}>
            <Animated.View style={[opacityStyle, styles.label]}>
              <AnimatedTextInput
                style={styles.labelText}
                animatedProps={minLabelText}
                editable={false}
                defaultValue={`${min +
                  Math.floor(
                    position.value / (sliderWidth / ((max - min) / step)),
                  ) *
                  step
                  }`}
              />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
        <GestureDetector gesture={pan2}>
          <Animated.View style={[animatedStyle2, styles.rightside]}>
            <Animated.View style={[opacityStyle2, styles.label]}>
              <AnimatedTextInput
                style={styles.labelText}
                animatedProps={maxLabelText}
                editable={false}
                defaultValue={`${min +
                  Math.floor(
                    position2.value / (sliderWidth / ((max - min) / step)),
                  ) *
                  step
                  }`}
              />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>
      <View style={{ justifyContent: "center", alignContent: "center", paddingVertical: normalize(10), paddingHorizontal: normalize(0) }}>
        <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 20, color: "#000000", marginLeft: normalize(6) }}>{min}</Text>
        <View style={{ alignSelf: "flex-end", bottom: 30, left: 10 }}>
          <Text style={{ fontFamily: Fonts.InterSemiBold, fontSize: 20, color: "#000000" }}>{newadd ? max : trigmin || max}</Text>
        </View>
      </View>
      {/* {!text && <View>
        <FlatList data={cmeTack ? CMEText?.length > 0 ? CMEText :hitData :hitData} renderItem={hitItem} keyExtractor={(item) => item} />
      </View>} */}
    </>
  );
};


export default CreditPrice;

const styles = StyleSheet.create({
  sliderContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: normalize(250)
  },
  sliderBack: {
    height: 8,
    backgroundColor: '#DFEAFB',
    borderRadius: 20,
  },
  sliderFront: {
    height: 8,
    backgroundColor: '#3F4CF6',
    borderRadius: 20,
    position: 'absolute',
  },
  thumb: {
    left: -5,
    width: 20,
    height: 20,
    position: 'absolute',
    backgroundColor: 'white',
    borderColor: '#3F4CF6',
    borderWidth: 5,
    borderRadius: 10,
  },
  rightside: {
    left: -15,
    width: 20,
    height: 20,
    position: 'absolute',
    backgroundColor: 'white',
    borderColor: '#3F4CF6',
    borderWidth: 5,
    borderRadius: 10,
  },
  label: {
    position: 'absolute',
    top: -40,
    bottom: 20,
    backgroundColor: Colorpath.Pagebg,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    color: '#000000',
    padding: 5,
    fontFamily: Fonts.InterBold,
    fontSize: 14,
    width: '100%',
  },
  professionItem: {
    paddingVertical: normalize(8),
  },
  professionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  professionText: {
    fontSize: 14,
    fontFamily: Fonts.InterMedium,
    color: "#000000",
    marginLeft: normalize(8),
  },
});