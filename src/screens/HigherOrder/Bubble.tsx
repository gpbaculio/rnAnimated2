import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {styleGuide} from '../constants';

const size = 32;
const styles = StyleSheet.create({
  bubble: {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: styleGuide.palette.primary,
  },
});

interface BubbleProps {
  progress: Animated.SharedValue<number | null>;
  start: number;
  end: number;
}

const Bubble = ({progress, start, end}: BubbleProps) => {
  const style = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value ? progress.value : 0,
      [start, end],
      [0.5, 1],
      Extrapolate.CLAMP,
    );
    const scale = interpolate(
      progress.value ? progress.value : 0,
      [start, end],
      [1, 1.5],
      Extrapolate.CLAMP,
    );
    return {opacity, transform: [{scale}]};
  });
  return <Animated.View style={[styles.bubble, style]} />;
};

export default Bubble;
