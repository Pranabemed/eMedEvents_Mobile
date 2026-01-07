import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle
} from "react-native";

type ICustomFlatListStyles = {
  header: StyleProp<ViewStyle>;
  stickyElement: StyleProp<ViewStyle>;
  topElement?: StyleProp<ViewStyle>;
};

type TUseCustomFlatListHook=[
  Animated.Value,
  ICustomFlatListStyles,
  (event: LayoutChangeEvent) => void,
  (event: LayoutChangeEvent) => void,
  (event: LayoutChangeEvent) => void
]

const window = Dimensions.get("window");

export const useCustomFlatListHook = (): TUseCustomFlatListHook => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [heights, setHeights] = useState({
    header: 0,
    sticky: 0,
    topList: 0
  });

  const styles: ICustomFlatListStyles = {
    header: {
      marginBottom: heights.sticky + heights.topList // <-- In order for the list to be under other elements
    },
    stickyElement: {
      marginTop: heights.header, // <-- In order for the list to be under Header
      position: "absolute",
      transform: [
        {
          translateY: scrollY.interpolate({
            // <-- To move an element according to the scroll position
            extrapolate: "clamp",
            inputRange: [-window.height, heights.header],
            outputRange: [window.height, -heights.header]
          })
        }
      ],
      zIndex: 2
    },
    topElement: {
      marginTop: heights.header + heights.sticky, // <-- In order for the list to be under other elements
      position: "absolute",
      transform: [
        {
          translateY: scrollY.interpolate({
            // <-- To move an element according to the scroll position
            extrapolate: "clamp",
            inputRange: [
              -window.height,
              heights.header + heights.sticky + heights.topList
            ],
            outputRange: [
              window.height,
              -(heights.header + heights.sticky + heights.topList)
            ]
          })
        }
      ],
      zIndex: 1
    }
  };

  const onLayoutHeaderElement = (event: LayoutChangeEvent): void => {
    setHeights({ ...heights, header: event.nativeEvent.layout.height });
  };

  const onLayoutTopListElement = (event: LayoutChangeEvent): void => {
    setHeights({ ...heights, topList: event.nativeEvent.layout.height });
  };

  const onLayoutTopStickyElement = (event: LayoutChangeEvent): void => {
    setHeights({ ...heights, sticky: event.nativeEvent.layout.height });
  };

  return [
    scrollY,
    styles,
    onLayoutHeaderElement,
    onLayoutTopListElement,
    onLayoutTopStickyElement
  ];
};