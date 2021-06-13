import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {clamp, mix, polar2Canvas} from '../constants';

const R = Dimensions.get('window').width / 4;

interface CircleProps {
  index: number;
  progress: Animated.SharedValue<number>;
  goesDown: Animated.SharedValue<boolean>;
}
const transform = (progress: number, index: number) => {
  'worklet';
  const theta = index * (Math.PI / 3);

  const {x, y} = polar2Canvas({theta, radius: R}, {x: 0, y: 0});

  const translateX = mix(progress, 0, x);

  const translateY = mix(progress, 0, y);

  const scale = mix(progress, 0.3, 1);
  return [{translateX}, {translateY}, {scale}];
};

const Circle = ({index, progress, goesDown}: CircleProps) => {
  const style = useAnimatedStyle(() => {
    return {
      transform: transform(progress.value, index),
    };
  });

  const style1 = useAnimatedStyle(() => {
    const progress1 = goesDown.value
      ? clamp(progress.value + 0.1, 0, 1)
      : progress.value;

    const opacity = interpolate(
      progress1,
      [0.6, 1],
      [0, 0.5],
      Extrapolate.CLAMP,
    );

    return {
      opacity,
      transform: transform(progress1, index),
    };
  });

  return (
    <>
      <Animated.View
        {...{
          style: [styles.container, style1],
        }}>
        <View {...{style: styles.circle}} />
      </Animated.View>
      <Animated.View
        {...{
          style: [styles.container, style],
        }}>
        <View {...{style: styles.circle}} />
      </Animated.View>
    </>
  );
};

export default Circle;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: '#64bee6',
    width: 2 * R,
    height: 2 * R,
    borderRadius: R,
    opacity: 0.6,
  },
});
