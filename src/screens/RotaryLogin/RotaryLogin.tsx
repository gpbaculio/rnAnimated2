import React from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Circle, Defs, G, Mask, TransformObject} from 'react-native-svg';
import Animated, {useAnimatedProps} from 'react-native-reanimated';

import Quadrant, {
  STROKE_WIDTH,
  RADIUS,
  center,
  DIGITS,
  PADDING,
} from './Quadrant';
import Gesture from './Gesture';
import Title from './Title';
import Status from './Status';
import {useSharedValue} from '../Chrome/Animations';
import {transformOrigin} from 'react-native-redash';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
});

interface DigitProps {
  cx: number;
  cy: number;
  i: number;
}

const Digit = ({cx, cy, i}: DigitProps) => {
  return (
    <Circle
      key={i}
      cx={cx}
      cy={cy}
      r={STROKE_WIDTH / 2 - PADDING}
      fill="white"
    />
  );
};

const RotaryLogin = () => {
  const theta = useSharedValue(0);
  const passcode = useSharedValue('');
  const r = RADIUS - STROKE_WIDTH / 2;
  const circumference = 2 * Math.PI * r;
  const animProps = useAnimatedProps(() => {
    return {
      transform: transformOrigin(center, [
        {rotate: `${-theta.value}rad`},
      ]) as TransformObject,
    };
  });
  const animProps2 = useAnimatedProps(() => {
    return {
      transform: transformOrigin(center, [
        {rotate: `${-theta.value}rad`},
      ]) as TransformObject,
    };
  });
  return (
    <View style={{flex: 1}}>
      <Svg style={styles.container}>
        <Defs>
          <Mask id="mask">
            <AnimatedG animatedProps={animProps2}>
              {DIGITS.slice(0, 10).map(({x, y}, i) => (
                <Digit key={i} i={i} cx={x} cy={y} />
              ))}
            </AnimatedG>
          </Mask>
        </Defs>
        <Quadrant />
        <Circle
          fill="white"
          cx={center.x}
          cy={center.y}
          r={RADIUS - STROKE_WIDTH}
        />
        <AnimatedCircle
          cx={center.x}
          cy={center.y}
          r={r}
          strokeWidth={STROKE_WIDTH - PADDING}
          stroke="white"
          strokeDasharray={[circumference, circumference]}
          strokeDashoffset={-0.305 * circumference}
          strokeLinecap="round"
          animatedProps={animProps}
        />
        <Title />
        <Status passcode={passcode} />
        <G mask="url(#mask)">
          <Quadrant />
        </G>
      </Svg>
      <Gesture theta={theta} passcode={passcode} />
    </View>
  );
};

export default RotaryLogin;
