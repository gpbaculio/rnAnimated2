import React from 'react';
import {Dimensions} from 'react-native';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {mix, polar2Canvas} from '../constants';

interface AnimatedCircleProps {
  index: number;
  progress: Animated.SharedValue<number>;
  isPause: Animated.SharedValue<boolean>;
}

const R = Dimensions.get('window').width / 5;

const AnimatedCircle = ({index}: AnimatedCircleProps) => {
  const style = useAnimatedStyle(() => {
    const theta = index * Math.PI;
    const {x, y} = polar2Canvas(
      {theta, radius: R},
      {x: index % 2 === 0 ? -60 : 60, y: 0},
    );

    return {
      transform: [{translateX: x}, {translateY: y}],
    };
  });
  return (
    <Animated.View style={[styles.container, style]}>
      <View style={styles.circle} />
    </Animated.View>
  );
};

export default AnimatedCircle;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '-45deg'}],
    opacity: 0.6,
    zIndex: -1,
  },
  circle: {
    backgroundColor: 'rgb(51, 63, 72)',
    width: 2 * R,
    height: 2 * R,
    borderRadius: R,
  },
});
