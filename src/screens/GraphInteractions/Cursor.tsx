/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withDecay,
} from 'react-native-reanimated';
import {Path} from '../constants';

const CURSOR = 100;
const styles = StyleSheet.create({
  cursorContainer: {
    width: CURSOR,
    height: CURSOR,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: "rgba(100, 200, 300, 0.4)",
  },
  cursor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: '#367be2',
    borderWidth: 4,
    backgroundColor: 'white',
  },
});

interface CursorProps {
  path: Path;
  point: Animated.SharedValue<{
    coord: {
      x: number;
      y: number;
    };
    data: {
      x: number;
      y: number;
    };
  }>;
  length: Animated.SharedValue<number>;
}

const {width} = Dimensions.get('window');

const Cursor = ({length, point, path}: CursorProps) => {
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {offsetX: number}
  >({
    onStart: (event, ctx) => {
      ctx.offsetX = interpolate(
        length.value,
        [0, path.length],
        [0, width],
        Extrapolate.CLAMP,
      );
    },
    onActive: (event, ctx) => {
      length.value = interpolate(
        ctx.offsetX + event.translationX,
        [0, width],
        [0, path.length],
        Extrapolate.CLAMP,
      );
    },
    onEnd: ({velocityX}) => {
      length.value = withDecay({
        velocity: velocityX,
        clamp: [0, path.length],
      });
    },
  });

  const style = useAnimatedStyle(() => {
    const translateX = point.value.coord.x - CURSOR / 2;
    const translateY = point.value.coord.y - CURSOR / 2;
    return {
      transform: [{translateX}, {translateY}],
    };
  });
  return (
    <View style={StyleSheet.absoluteFill}>
      <PanGestureHandler {...{onGestureEvent}}>
        <Animated.View style={[styles.cursorContainer, style]}>
          <View style={styles.cursor} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Cursor;
