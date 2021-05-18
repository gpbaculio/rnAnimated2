import * as React from 'react';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {canvas2Polar, styleGuide, polar2Canvas} from '../constants';

interface CursorProps {
  r: number;
  strokeWidth: number;
  theta: any;
}

const Cursor = ({strokeWidth, theta, r}: CursorProps) => {
  const center = {x: r, y: r};
  const onGestureEvent = useAnimatedGestureHandler({
    onActive: (event, ctx) => {
      const {translationX, translationY} = event;
      theta.value = canvas2Polar(
        {x: translationX, y: translationY},
        center,
      ).theta;
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
