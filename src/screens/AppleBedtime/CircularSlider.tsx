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
import {polar2Canvas} from '../constants';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface CircularProps {
  start: Animated.SharedValue<number>;
  end: Animated.SharedValue<number>;
}

const CircularSlider = ({start, end}: CircularProps) => {
  const startPos = useDerivedValue(() =>
    polar2Canvas({theta: start.value, radius: R}, CENTER),
  );
  const endPos = useDerivedValue(() =>
    polar2Canvas({theta: end.value, radius: R}, CENTER),
  );
  const animatedProps = useAnimatedProps(() => {
    const duration = absoluteDuration(start.value, end.value);
    return {
      d: `M ${startPos.value.x} ${startPos.value.y} A ${R} ${R} 0 ${
        duration < PI ? 0 : 1
      } 0 ${endPos.value.x} ${endPos.value.y}`,
    };
  });
  return (
    <View>
      <Svg {...{width: SIZE, height: SIZE}}>
        <Defs>
          <Mask {...{id: 'mask'}}>
            <AnimatedPath
              {...{animatedProps, stroke: 'white', strokeWidth: STROKE}}
            />
          </Mask>
        </Defs>
        <Quadrant />
        <Cursor {...{pos: startPos}} />
        <Cursor {...{pos: endPos}} />
      </Svg>
      <Gesture {...{start, end, startPos, endPos}} />
    </View>
  );
};

export default CircularSlider;
