import React from 'react';
import {Dimensions} from 'react-native';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {mix, polar2Canvas} from '../constants';

interface AnimatedCircleProps {
  progress: Animated.SharedValue<number | undefined>;
}

const R = Dimensions.get('window').width / 5;

const AnimatedCircle = ({progress}: AnimatedCircleProps) => {
  const style = useAnimatedStyle(() => {
    const scale =
      progress.value === undefined ? 1 : mix(progress.value, 1.0, 1.2);
    return {
      transform: [{scale}],
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
    opacity: 0.7,
    zIndex: 0,
  },
  circle: {
    backgroundColor: 'rgb(51, 63, 72)',
    width: 2 * R,
    height: 2 * R,
    borderRadius: R,
  },
});
