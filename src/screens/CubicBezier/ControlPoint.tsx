import React from 'react';
import {View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';

export const CONTROL_POINT_RADIUS = 20;

interface ControlPointProps {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  min: number;
  max: number;
}

type Offset = {
  x: number;
  y: number;
};

const ControlPoint = ({x, y, min, max}: ControlPointProps) => {
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    Offset
  >({});

  const style = useAnimatedStyle(() => ({
    transform: [{translateX: x.value}, {translateY: y.value}],
  }));

  return (
    <PanGestureHandler {...{onGestureEvent}}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: CONTROL_POINT_RADIUS * 2,
            height: CONTROL_POINT_RADIUS * 2,
          },
          style,
        ]}
      />
    </PanGestureHandler>
  );
};

export default ControlPoint;
