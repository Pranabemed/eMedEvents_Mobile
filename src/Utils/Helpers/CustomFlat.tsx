import { useCustomFlatListHook } from "./CustomHooksFlat";
import React, { forwardRef, useRef, useImperativeHandle, JSX } from "react";
import { Animated, FlatListProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CustomFlatListProps<T> = Omit<FlatListProps<T>, "ListHeaderComponent"> & {
  HeaderComponent: JSX.Element;
  StickyElementComponent: JSX.Element;
  TopListElementComponent: JSX.Element;
};

function CustomFlatListInner<T>(
  {
    style,
    ...props
  }: CustomFlatListProps<T>,
  ref: React.Ref<Animated.FlatList<T>>
): React.ReactNode {
  const internalRef = useRef<Animated.FlatList<T>>(null);

  // Expose internal ref to external via useImperativeHandle
  useImperativeHandle(ref, () => internalRef.current as Animated.FlatList<T>);

  const [
    scrollY,
    styles,
    onLayoutHeaderElement,
    onLayoutTopListElement,
    onLayoutStickyElement,
  ] = useCustomFlatListHook();

  return (
    <SafeAreaView edges={["bottom"]} style={style}>
      <Animated.View
        style={styles.stickyElement}
        onLayout={onLayoutStickyElement}
      >
        {props.StickyElementComponent}
      </Animated.View>

      <Animated.View
        style={styles.topElement}
        onLayout={onLayoutTopListElement}
      >
        {props.TopListElementComponent}
      </Animated.View>

      <Animated.FlatList<any>
        ref={internalRef}
        {...props}
        ListHeaderComponent={
          <Animated.View onLayout={onLayoutHeaderElement}>
            {props.HeaderComponent}
          </Animated.View>
        }
        ListHeaderComponentStyle={[
          props.ListHeaderComponentStyle,
          styles.header,
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          }
        )}
      />
    </SafeAreaView>
  );
}

const CustomFlatList = forwardRef(CustomFlatListInner) as <T>(
  props: CustomFlatListProps<T> & { ref?: React.Ref<Animated.FlatList<T>> }
) => React.ReactElement;

export default CustomFlatList;
