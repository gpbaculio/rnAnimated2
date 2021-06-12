import React from 'react';
import Animated, {useAnimatedProps} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import {addCurve, addLine, createPath, mix, serialize} from '../constants';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SquareProps {
  progress: Animated.SharedValue<number>;
}

export const SIZE = 150;
const V_FACTOR = 2.5;
const H_FACTOR = 0.3;
export const MAX_HEIGHT = SIZE * V_FACTOR;

const Square = ({progress}: SquareProps) => {
  const animatedProps = useAnimatedProps(() => {
    const distortion = {
      x: mix(progress.value, 0, SIZE * H_FACTOR),
      y: mix(progress.value, 1, V_FACTOR),
    };
    const p1 = {x: 0, y: 0};
    const p2 = {x: SIZE, y: 0};
    const p3 = {x: SIZE - distortion.x, y: SIZE * distortion.y};
    const p4 = {x: distortion.x, y: SIZE * distortion.y};
    const path = createPath(p1);
    addLine(path, p2);
    addCurve(path, {c1: {x: p2.x, y: 0}, c2: {x: p3.x, y: 0}, to: p3});
    addLine(path, p4);
    addCurve(path, {c1: {x: p4.x, y: 0}, c2: {x: p1.x, y: 0}, to: p1});
    return {
      d: serialize(path),
      fill: '#000000',
    };
  });
  return (
    <Svg>
      <AnimatedPath {...{animatedProps}} />
    </Svg>
  );
};

export default Square;
