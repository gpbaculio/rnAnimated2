import React, {useEffect} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import {LinearGradient} from 'expo-linear-gradient';

const RADIUS = 45;

interface BackgroundProps {
  colorSelection: {
    previous: {
      id: number;
      start: string;
      end: string;
    };
    current: {
      id: number;
      start: string;
      end: string;
    };
    position: {
      x: number;
      y: number;
    };
  };
}

const {width, height} = Dimensions.get('window');

const Background = ({colorSelection}: BackgroundProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 650,
      easing: Easing.inOut(Easing.ease),
    });
  }, [colorSelection]);

  const MAX_RADIUS =
    (Math.SQRT2 *
      Math.max(
        width + colorSelection.position.x,
        height + colorSelection.position.y,
      )) /
    2;

  const style = useAnimatedStyle(() => {
    if (!colorSelection.position.x) return {};
    return {
      top: -RADIUS + colorSelection.position.y - 84,
      left: -RADIUS + colorSelection.position.x,
      borderRadius: RADIUS,
      width: RADIUS * 2,
      height: RADIUS * 2,
      transform: [{scale: progress.value * (MAX_RADIUS / RADIUS)}],
      backgroundColor: colorSelection.current.start,
      shadowColor: colorSelection.current.end,
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 5,
    };
  });

  return (
    <LinearGradient
      {...{
        colors: [colorSelection.previous.start, colorSelection.previous.end],
        style: StyleSheet.absoluteFillObject,
      }}>
      <Animated.View style={[style]}>
        <LinearGradient
          colors={[colorSelection.current.start, colorSelection.current.end]}
          style={styles.linearGradient}
        />
      </Animated.View>
    </LinearGradient>
  );
};

export default Background;

const styles = StyleSheet.create({
  linearGradient: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS,
  },
});
