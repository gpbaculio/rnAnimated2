import React from 'react';
import {StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {useAnimatedGestureHandler} from 'react-native-reanimated';
import {canvas2Polar, Vector} from '../constants';

import {CENTER, containedInSquare, normalize, STROKE} from './Constants';
import CursorOverlay from './CursorOverlay';

enum Region {
  START,
  END,
  MAIN,
}

interface GestureProps {
  start: Animated.SharedValue<number>;
  end: Animated.SharedValue<number>;
  startPos: Animated.SharedValue<Vector>;
  endPos: Animated.SharedValue<Vector>;
}

const Gesture = ({start, end, startPos, endPos}: GestureProps) => {
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      offset: number;
      region: Region;
    }
  >({
    onStart: ({x, y}, ctx) => {
      const value = {x, y};
      if (containedInSquare(value, startPos.value, STROKE)) {
        ctx.region = Region.START;
        ctx.offset = start.value;
      } else if (containedInSquare(value, endPos.value, STROKE)) {
        ctx.region = Region.END;
        ctx.offset = end.value;
      } else {
        const {theta} = canvas2Polar(value, CENTER);
        ctx.offset = theta;
        ctx.region = Region.MAIN;
      }
    },
    onActive: ({x, y}, ctx) => {
      const value = {x, y};
      const {theta} = canvas2Polar(value, CENTER);
      const delta = theta - ctx.offset;
      ctx.offset = theta;
      if (ctx.region === Region.START) {
        start.value = normalize(start.value + delta);
      } else if (ctx.region === Region.END) {
        end.value = normalize(end.value + delta);
      } else {
        start.value = normalize(start.value + delta);
        end.value = normalize(end.value + delta);
      }
    },
  });
  return (
    <PanGestureHandler {...{onGestureEvent}}>
      <Animated.View {...{style: StyleSheet.absoluteFill}}></Animated.View>
    </PanGestureHandler>
  );
};

export default Gesture;
