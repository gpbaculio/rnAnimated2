import * as React from 'react';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {canvas2Polar, styleGuide, polar2Canvas, clamp} from '../constants';

interface CursorProps {
  r: number;
  strokeWidth: number;
  theta: Animated.SharedValue<number>;
}

const Cursor = ({strokeWidth, theta, r}: CursorProps) => {
  const center = {x: r, y: r};

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {offset: {x: number; y: number}}
  >({
    onStart: (_event, ctx) => {
      const {x, y} = polar2Canvas(
        {
          theta: theta.value,
          radius: r,
        },
        center,
      );
      ctx.offset = {x, y};
    },
    onActive: (event, ctx) => {
      const {translationX, translationY} = event;
      const x = ctx.offset.x + translationX;
      const y1 = ctx.offset.y + translationY;
      const y =
        x < r
          ? y1
          : theta.value < Math.PI
          ? clamp(y1, 0, r - 0.001)
          : clamp(y1, r, 2 * r);
      const value = canvas2Polar({x, y}, center).theta;
      theta.value = value > 0 ? value : 2 * Math.PI + value;
      // console.log('y: ', y);
      // console.log({
      //   before: value,
      //   after: theta.value,
      // });
    },
  });

  const style = useAnimatedStyle(() => {
    const {x: translateX, y: translateY} = polar2Canvas(
      {
        theta: theta.value,
        radius: r,
      },
      center,
    );
    return {
      transform: [{translateX}, {translateY}],
    };
  });

  return (
    <PanGestureHandler {...{onGestureEvent}}>
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            width: strokeWidth,
            height: strokeWidth,
            borderRadius: strokeWidth / 2,
            borderColor: 'white',
            borderWidth: 5,
            backgroundColor: styleGuide.palette.primary,
          },
          style,
        ]}
      />
    </PanGestureHandler>
  );
};

export default Cursor;
