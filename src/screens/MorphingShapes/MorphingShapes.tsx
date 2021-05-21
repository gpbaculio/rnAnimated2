import React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import Eye from './Eye';
import Mouth from './Mouth';
import Slider, {SLIDER_WIDTH} from './Slider';

const bad = '#FDBEEB';
const normal = '#FDEEBE';
const good = '#BEFDE5';

const PathMorphing = () => {
  const translateX = useSharedValue(0);

  const progress = useDerivedValue(() => translateX.value / SLIDER_WIDTH);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 0.5, 1],
      [bad, normal, good],
    ),
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.face}>
        <View style={styles.eyes}>
          <Eye progress={progress} />
          <Eye flip progress={progress} />
        </View>
        <Mouth progress={progress} />
      </View>
      <Slider {...{translateX}} />
    </Animated.View>
  );
};

export default PathMorphing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: bad,
  },
  face: {
    width: 150,
    height: 150,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 32,
  },
  eyes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
