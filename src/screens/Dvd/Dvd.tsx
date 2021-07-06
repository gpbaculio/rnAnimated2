import React, {useCallback, useEffect} from 'react';
import {View, Dimensions, StyleSheet, processColor} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {useSharedValue} from '../Chrome/Animations';

import Logo, {LOGO_HEIGHT, LOGO_WIDTH} from './Logo';
import {withBouncing} from './withBouncing';

const {width, height} = Dimensions.get('window');

const VELOCITY = 200;
const COLORS = [
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#00ffff',
  '#ff00ff',
].map(c => processColor(c) as number);

const Dvd = () => {
  const color = useSharedValue(COLORS[0]);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const onBounce = useCallback(() => {
    'worklet';
    const colorsLeft = [...COLORS];
    colorsLeft.splice(colorsLeft.indexOf(color.value), 1);
    color.value =
      colorsLeft[Math.round(Math.random() * (colorsLeft.length - 1))];
  }, []);
  useEffect(() => {
    // SOLUTION 1
    // translateX.value = withBouncing(VELOCITY, 0, width - LOGO_WIDTH, onBounce);
    // translateY.value = withBouncing(
    //   VELOCITY,
    //   0,
    //   height - LOGO_HEIGHT - 64,
    //   onBounce,
    // );

    // SOLUTION 2
    translateX.value = withRepeat(
      withTiming(
        width - LOGO_WIDTH,
        {
          duration: (1000 * (width - LOGO_WIDTH)) / VELOCITY,
          easing: Easing.linear,
        },
        onBounce,
      ),
      -1,
      true,
    );
    translateY.value = withRepeat(
      withTiming(
        height - LOGO_HEIGHT - 64,
        {
          duration: (1000 * (height - LOGO_HEIGHT - 64)) / VELOCITY,
          easing: Easing.linear,
        },
        onBounce,
      ),
      -1,
      true,
    );
  });

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });
  return (
    <View {...{style: styles.container}}>
      <Animated.View {...{style}}>
        <Logo color={color} />
      </Animated.View>
    </View>
  );
};

export default Dvd;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
