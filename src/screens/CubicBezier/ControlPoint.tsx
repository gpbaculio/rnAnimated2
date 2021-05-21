import React from 'react';
import {View} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';

export const CONTROL_POINT_RADIUS = 20;

interface ControlPointProps {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  min: number;
  max: number;
}

const ControlPoint = ({x, y, min, max}: ControlPointProps) => {
  const style = useAnimatedStyle(() => ({
    transform: [{translateX: x.value}, {translateY: y.value}],
  }));

  return (
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
  );
};

export default ControlPoint;
