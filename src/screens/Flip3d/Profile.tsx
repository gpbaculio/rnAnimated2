import React from 'react';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {alpha, perspective} from './Constants';
import Content, {width} from './Content';
import {TouchableOpacity, View} from 'react-native';

const MIN = -width * Math.tan(alpha);
const MAX = 0;
const PADDING = 100;

interface ProfileProps {
  progress: Animated.SharedValue<number>;
  onPress: () => void;
}

export default ({progress, onPress}: ProfileProps) => {
  const onGestureEvent = useAnimatedGestureHandler({});
  const style = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [MIN, MAX]);
    return {
      transform: [{perspective: 1000}, {translateX}],
    };
  });

  return (
    <Animated.View style={style}>
      <TouchableOpacity {...{onPress}}>
        <Content />
      </TouchableOpacity>
    </Animated.View>
  );
};
