import React from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import Svg, {Defs, Mask, Path} from 'react-native-svg';

import {SIZE, STROKE, R, PI, CENTER, arc, absoluteDuration} from './Constants';
import Cursor from './Cursor';
import Gesture from './Gesture';
import Quadrant from './components/Quadrant';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface CircularProps {
  start: Animated.SharedValue<number>;
  end: Animated.SharedValue<number>;
}

const CircularSlider = ({start, end}: CircularProps) => {
  return <View />;
};

export default CircularSlider;
