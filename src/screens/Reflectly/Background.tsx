import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

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
    return {
      top: -RADIUS + colorSelection.position.y - 84,
      left: -RADIUS + colorSelection.position.x,
      borderRadius: RADIUS,
      width: RADIUS * 2,
      height: RADIUS * 2,
      backgroundColor: colorSelection.current.start,
      transform: [{scale: progress.value * (MAX_RADIUS / RADIUS)}],
    };
  });

  return (
    <View
      {...{
        style: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colorSelection.previous.start,
        },
      }}>
      <Animated.View {...{style}} />
    </View>
  );
};

export default Background;
