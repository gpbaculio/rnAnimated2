import React from 'react';
import {Dimensions} from 'react-native';
import Animated, {useAnimatedProps} from 'react-native-reanimated';
import Svg, {Line, Path} from 'react-native-svg';

import {Path as RePath, serialize} from '../constants';
import {HEIGHT, PADDING, STROKE, WIDTH} from './Constants';

const {width} = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);
interface CursorProps {
  path: Animated.SharedValue<RePath>;
}

const Controls = ({path}: CursorProps) => {
  const STEPS = 4;
  const STEP = WIDTH / STEPS;
  const animatedProps = useAnimatedProps(() => {
    return {
      d: serialize(path.value),
    };
  });
  return (
    <Svg width={width} height={HEIGHT}>
      {Array.from({length: STEPS + 1})
        .fill(0)
        .map((_, i) => {
          const x = PADDING + STEP * i;
          return (
            <Line
              key={i}
              x1={x}
              y1={0}
              x2={x}
              y2={HEIGHT}
              stroke="white"
              strokeWidth={STROKE}
            />
          );
        })}
      <Line
        x1={PADDING}
        y1={HEIGHT}
        x2={PADDING + WIDTH}
        y2={0}
        stroke="grey"
        strokeWidth={STROKE}
        strokeDasharray="10 10"
      />
      <AnimatedPath
        {...{animatedProps, stroke: 'white', strokeWidth: STROKE}}
      />
    </Svg>
  );
};

export default Controls;
