import React from 'react';
import Animated, {
  useAnimatedProps,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import {AnimatedLine} from './LockScreen';

interface NewLineProps {
  focusX: Animated.SharedValue<number>;
  focusY: Animated.SharedValue<number>;
  start: {x: number; y: number};
  end: {x: number; y: number};
}

const NewLine = ({focusX, focusY, start, end}: NewLineProps) => {
  const startX = useSharedValue(start.x);
  const starty = useSharedValue(start.y);
  const eX = useSharedValue(end.x);
  const eY = useSharedValue(end.y);
  const endX = useSharedValue(focusX.value);
  endX.value = withTiming(eX.value);
  const endY = useSharedValue(focusY.value);
  endY.value = withTiming(eY.value);
  const animProps = useAnimatedProps(() => {
    return {
      x1: startX.value,
      y1: starty.value,
      x2: endX.value,
      y2: endY.value,
    };
  });
  return (
    <AnimatedLine animatedProps={animProps} stroke="white" strokeWidth="2" />
  );
};

export default NewLine;
