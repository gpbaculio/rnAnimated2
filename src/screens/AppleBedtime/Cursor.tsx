import React from 'react';
import Animated, {useAnimatedProps} from 'react-native-reanimated';

import {Circle} from 'react-native-svg';
import {Vector} from '../constants';

import {STROKE, R, CENTER} from './Constants';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CursorProps {
  pos: Animated.SharedValue<Vector>;
}

const Cursor = ({pos}: CursorProps) => {
  const animatedProps = useAnimatedProps(() => {
    return {cx: pos.value.x, cy: pos.value.y};
  });
  return <AnimatedCircle {...{r: STROKE / 2, animatedProps, fill: 'blue'}} />;
};

export default Cursor;
