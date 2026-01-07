import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { Easing, useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import Fonts from '../Themes/Fonts';
import Colorpath from '../Themes/Colorpath';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressBarCircle = ({
  duration, 
  size , 
  strokeWidth, 
  backgroundColor, 
  fillColor  
}) => {
  const progress = useSharedValue(0);
  const [timeLeft, setTimeLeft] = useState(duration / 1000); 
  useEffect(() => {
    progress.value = withTiming(1, {
      duration: duration,
      easing: Easing.linear,
    });
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  const circumference = 2 * Math.PI * (size / 2 - strokeWidth / 2);
  
  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progress.value),
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth / 2}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke={fillColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth / 2}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontFamily: Fonts.InterMedium,
    fontSize: 12,
    color: Colorpath.black,
  },
});

export default ProgressBarCircle;
