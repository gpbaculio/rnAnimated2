import React from 'react';
import Animated, {useAnimatedProps} from 'react-native-reanimated';

import {Circle} from 'react-native-svg';

import {STROKE, R, CENTER} from './Constants';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CursorProps {}

const Cursor = ({}: CursorProps) => {
  return null;
};

export default Cursor;
