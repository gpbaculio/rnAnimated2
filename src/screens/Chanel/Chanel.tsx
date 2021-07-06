import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  withSpring,
} from 'react-native-reanimated';
import {useSharedValue} from '../Chrome/Animations';
import {clamp, snapPoint} from '../constants';

import Item, {MAX_HEIGHT} from './Item';
import {items} from './Model';

const snapPoints = items.map((_, i) => i * -MAX_HEIGHT);
const Channel = () => {
  const y = useSharedValue(0);
  // SOLUTION 1
  // const onScroll = useAnimatedScrollHandler({
  //   onScroll: ({contentOffset: {y: yValue}}) => {
  //     y.value = yValue;
  //   },
  // });
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      y: number;
    }
  >({
    onStart: (_, ctx) => {
      ctx.y = y.value;
    },
    onActive: ({translationY}, ctx) => {
      y.value = clamp(
        ctx.y + translationY,
        -(items.length - 1) * MAX_HEIGHT,
        0,
      );
    },
    onEnd: ({velocityY}) => {
      const dest = snapPoint(y.value, velocityY, snapPoints);
      y.value = withSpring(dest, {velocity: velocityY});
    },
  });

  return (
    <>
      <StatusBar hidden />
      {/* 
      // SOLUTION 1
      <Animated.ScrollView
        {...{
          onScroll,
          scrollEventThrottle: 16,
          style: styles.scrollView,
          contentContainerStyle: {
            height: (items.length + 1) * MAX_HEIGHT,
          },
          snapToInterval: MAX_HEIGHT,
          decelerationRate: 'fast',
        }}> */}
      <PanGestureHandler {...{onGestureEvent}}>
        <Animated.View>
          {items.map((item, index) => (
            <Item {...{key: index, index, item, y}} />
          ))}
        </Animated.View>
      </PanGestureHandler>
      {/* </Animated.ScrollView> */}
    </>
  );
};

export default Channel;

const styles = StyleSheet.create({
  container: {
    height: items.length * MAX_HEIGHT,
    backgroundColor: 'black',
  },
  scrollView: {
    backgroundColor: 'black',
  },
});
