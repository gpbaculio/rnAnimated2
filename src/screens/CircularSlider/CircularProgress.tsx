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
    const strokeDashoffset = theta.value * radius;
    console.log('strokeDashoffset: ', Math.round(strokeDashoffset));
    // 930 is max value
    const range = 0 - 930;
    const correctedStartValue = strokeDashoffset - 930;
    const percentage = (correctedStartValue * 100) / range;
    console.log('percentage: ', Math.round(percentage));
    //Our number.
    var number = 300;

    //The percent that we want to get.
    //i.e. We want to get 50% of 120.
    var percentToGet = percentage;

    //Calculate the percent.
    var percent = (percentToGet / 100) * number;

    //Alert it out for demonstration purposes.
    console.log(
      Math.round((percentToGet + Number.EPSILON) * 100) / 100 +
        '% of ' +
        number +
        ' is ' +
        Math.round((percent + Number.EPSILON) * 100) / 100,
    );

    //The result: 50% of 120 is 60
    return {
      strokeDashoffset,
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
        strokeLinecap="round"
        animatedProps={props}
        stroke={styleGuide.palette.primary}
        strokeDasharray={`${circumference}, ${circumference}`}
        {...{strokeWidth}}
      />
    </Svg>
  );
};

export default CircularProgress;
