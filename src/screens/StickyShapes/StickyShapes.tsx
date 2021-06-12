import React, {useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';

import {useSharedValue} from '../Chrome/Animations';
import {snapPoint} from '../constants';

import Square, {MAX_HEIGHT, SIZE} from './Square';

const {width, height} = Dimensions.get('window');

export const HEADER_HEIGHT = 91;

const StickyShapes = () => {
  const dimensionHeight = height - HEADER_HEIGHT;

  const isOnTop = useSharedValue(true);

  const sticked = useSharedValue(true);

  const sticking = useDerivedValue(() => {
    return withSpring(sticked.value ? 1 : 0);
  });

  const translateY = useSharedValue(0);

  const progress = useDerivedValue(() => {
    return (
      sticking.value *
      interpolate(translateY.value, [0, MAX_HEIGHT], [0, 1], Extrapolate.CLAMP)
    );
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onActive: ({translationY}) => {
      translateY.value = translationY;
      if (translateY.value > MAX_HEIGHT) {
        sticked.value = false;
      }
    },
    onEnd: ({velocityY}) => {
      const dest = snapPoint(translateY.value, velocityY, [
        0,
        dimensionHeight - SIZE,
      ]);

      translateY.value = withSpring(dest, {velocity: velocityY}, () => {
        sticked.value = true;
        if (dest !== 0) {
          isOnTop.value = !isOnTop.value;
          translateY.value = 0;
        }
      });
    },
  });

  const container = useAnimatedStyle(() => {
    return {
      transform: [{rotate: isOnTop.value ? '0deg' : '180deg'}],
    };
  });

  const square = useAnimatedStyle(() => {
    return {
      transform: [{translateY: (1 - sticking.value) * translateY.value}],
    };
  });

  return (
    <Animated.View {...{style: [styles.container, container]}}>
      <PanGestureHandler {...{onGestureEvent}}>
        <Animated.View {...{style: [StyleSheet.absoluteFill, square]}}>
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
