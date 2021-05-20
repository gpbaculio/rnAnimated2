import React, {forwardRef, Ref, useImperativeHandle} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {snapPoint} from '../constants';

import Profile, {A, ProfileModel} from './Profile';

const {width} = Dimensions.get('window');
interface SwiperProps {
  onSwipe: () => void;
  profile: ProfileModel;
  onTop: boolean;
  scale: Animated.SharedValue<number>;
}

const snapPoints = [-A, 0, A];

export interface Swiper {
  swipeLeft: () => void;
  swipeRight: () => void;
}

const swipe = (
  translateX: Animated.SharedValue<number>,
  dest: number,
  velocity: number,
  onSwipe: () => void,
) => {
  'worklet';
  translateX.value = withSpring(
    dest,
    {
      velocity,
      restSpeedThreshold: dest === 0 ? 0.01 : 100,
      restDisplacementThreshold: dest === 0 ? 0.01 : 100,
    },
    () => {
      if (dest !== 0) {
        runOnJS(onSwipe)();
      }
    },
  );
};

const Swiper = (
  {profile, onTop, onSwipe, scale}: SwiperProps,
  ref: Ref<Swiper>,
) => {
  const translateX = useSharedValue(0);

  const translateY = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    swipeLeft: () => {
      swipe(translateX, -A, 25, onSwipe);
    },
    swipeRight: () => {
      swipe(translateX, A, 25, onSwipe);
    },
  }));

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {x: number; y: number}
  >({
    onStart: (_, ctx) => {
      ctx.x = translateX.value;

      ctx.y = translateY.value;
    },
    onActive: ({translationX, translationY}, ctx) => {
      translateX.value = translationX + ctx.x;

      translateY.value = translationY + ctx.y;

      scale.value = interpolate(
        translateX.value,
        [-width / 2, 0, width / 2],
        [1, 0.95, 1],
        Extrapolate.CLAMP,
      );
    },
    onEnd: ({velocityX, velocityY}) => {
      const dest = snapPoint(translateX.value, velocityX, snapPoints);

      swipe(translateX, dest, velocityX, onSwipe);

      translateY.value = withSpring(0, {velocity: velocityY});
    },
  });

  return (
    <PanGestureHandler {...{onGestureEvent}}>
      <Animated.View style={StyleSheet.absoluteFill}>
        <Profile {...{profile, onTop, translateX, translateY, scale}} />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default forwardRef(Swiper);
