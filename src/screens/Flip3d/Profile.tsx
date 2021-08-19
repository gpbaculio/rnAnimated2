import React from 'react';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {alpha} from './Constants';
import Content, {width as profileWidth} from './Content';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {useSharedValue} from '../Chrome/Animations';
import {clamp} from '../constants';

const MIN = -profileWidth * Math.tan(alpha);
const MAX = 0;

interface ProfileProps {
  progress: Animated.SharedValue<number>;
  onPress: () => void;
}

const d = Dimensions.get('window');

export default ({progress, onPress}: ProfileProps) => {
  const x = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const isMoving = useSharedValue(false);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {x: number}
  >({
    onStart: (_, ctx) => {
      isMoving.value = true;
      ctx.x = x.value;
    },
    onActive: (e, ctx) => {
      const boundX = d.width - profileWidth;

      x.value = clamp(ctx.x + e.translationX, MIN / 2, boundX);

      rotateY.value = interpolate(
        x.value,
        [MIN / 2, 0, boundX],
        [alpha, 0, -alpha],
      );
    },
    onEnd: () => {
      isMoving.value = false;
      if (x.value < 0) {
        progress.value = withTiming(0, {}, () => {
          x.value = 0;
          rotateY.value = 0;
        });
      } else {
        x.value = withTiming(0);
        rotateY.value = withTiming(0);
      }
    },
  });

  const style = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [MIN, MAX]);
    return {
      transform: [
        {perspective: 1000},
        {translateX: translateX},
        {rotateY: `${rotateY.value}rad`},
        {translateX: x.value},
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={style}>
        <TouchableOpacity {...{onPress}}>
          <Content />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};
