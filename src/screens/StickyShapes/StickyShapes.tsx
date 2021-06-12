import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import {useSharedValue} from '../Chrome/Animations';

import Square, {MAX_HEIGHT, SIZE} from './Square';

const {width} = Dimensions.get('window');

const StickyShapes = () => {
  const translateY = useSharedValue(0);
  const progress = useDerivedValue(() => {
    return interpolate(
      translateY.value,
      [0, MAX_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP,
    );
  });
  const onGestureEvent = useAnimatedGestureHandler({
    onActive: ({translationY}) => {
      translateY.value = translationY;
    },
    onEnd: ({velocityY}) => {
      translateY.value = withSpring(0, {velocity: velocityY});
    },
  });
  return (
    <Animated.View {...{style: [styles.container]}}>
      <PanGestureHandler {...{onGestureEvent}}>
        <Animated.View {...{style: StyleSheet.absoluteFill}}>
          <Square {...{progress}} />
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default StickyShapes;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: (width - SIZE) / 2,
    top: 0,
    bottom: 0,
    width: SIZE,
  },
});
