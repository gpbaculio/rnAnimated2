import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {useAnimatedProps} from 'react-native-reanimated';
import Svg, {Circle} from 'react-native-svg';
import {styleGuide} from '../constants';

const {PI} = Math;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  theta: Animated.SharedValue<number>;
  r: number;
  strokeWidth: number;
}

const CircularProgress = ({r, strokeWidth, theta}: CircularProgressProps) => {
  const radius = r - strokeWidth / 2;
  const circumference = radius * 2 * PI;
  const props = useAnimatedProps(() => {
    return {
      strokeDashoffset: theta.value * radius,
    };
  });
  return (
    <Svg style={StyleSheet.absoluteFill}>
      <Circle
        cx={r}
        cy={r}
        fill="transparent"
        stroke="white"
        r={radius}
        {...{strokeWidth}}
      />
      <AnimatedCircle
        cx={r}
        cy={r}
        fill="transparent"
        r={radius}
        animatedProps={props}
        stroke={styleGuide.palette.primary}
        strokeDasharray={`${circumference}, ${circumference}`}
        {...{strokeWidth}}
      />
    </Svg>
  );
};

export default CircularProgress;
