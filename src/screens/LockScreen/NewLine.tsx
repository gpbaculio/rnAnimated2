import React, {useEffect} from 'react';
import Animated, {
  useAnimatedProps,
  withTiming,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import {AnimatedLine} from './LockScreen';

interface NewLineProps {
  focusX: Animated.SharedValue<number>;
  focusY: Animated.SharedValue<number>;
  start: {x: number; y: number};
  end: {x: number; y: number};
  error: boolean;
}

const NewLine = ({focusX, focusY, start, end, error}: NewLineProps) => {
  const startX = useSharedValue(start.x);
  const starty = useSharedValue(start.y);
  const eX = useSharedValue(end.x);
  const eY = useSharedValue(end.y);
  const endX = useSharedValue(focusX.value);
  endX.value = withTiming(eX.value);
  const endY = useSharedValue(focusY.value);
  endY.value = withTiming(eY.value);
  const progress = useSharedValue(0);
  useEffect(() => {
    if (error) {
      progress.value = withTiming(1, {duration: 1500});
    }
  }, [error]);
  const animProps = useAnimatedProps(() => {
    const getFillOpacity = () => {
      if (error) {
        return interpolate(progress.value, [0, 0.3, 0.6, 1], [0, 1, 0, 1]);
      }
      return 1;
    };
    return {
      x1: startX.value,
      y1: starty.value,
      x2: endX.value,
      y2: endY.value,
      strokeOpacity: getFillOpacity(),
    };
  });
  return (
    <AnimatedLine
      animatedProps={animProps}
      stroke={error ? 'red' : 'white'}
      strokeWidth="2"
    />
  );
};

export default NewLine;
