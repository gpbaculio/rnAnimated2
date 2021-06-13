import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {mix} from '../constants';

import Circle from './Circle';

const Breathe = () => {
  const goesDown = useSharedValue(false);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(
        1,
        {duration: 3500, easing: Easing.bezier(0.5, 0, 0.5, 1)},
        () => {
          goesDown.value = !goesDown.value;
        },
      ),
      -1,
      true,
    );
  }, [progress, goesDown]);

  const style = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${mix(progress.value, -Math.PI, 0)}rad`}],
    };
  });

  return (
    <View {...{style: styles.container}}>
      <Animated.View {...{style: [StyleSheet.absoluteFill, style]}}>
        {new Array(6).fill(0).map((_, index) => (
          <Circle {...{key: index, index, progress, goesDown}} />
        ))}
      </Animated.View>
    </View>
  );
};

export default Breathe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
