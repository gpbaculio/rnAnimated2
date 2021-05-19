import React from 'react';
import {StyleSheet, Dimensions, ViewStyle} from 'react-native';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';

import {Card, Cards} from '../components';
import {styleGuide} from '../constants';

const {width} = Dimensions.get('window');
const origin = -(width / 2 - styleGuide.spacing * 2);
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: styleGuide.spacing * 4,
  },
});

interface AnimatedCardProps {
  transition: Animated.SharedValue<number>;
  index: number;
  card: Cards;
}

const AnimatedCard = ({card, transition, index}: AnimatedCardProps) => {
  const style = useAnimatedStyle(() => {
    const rotate = interpolate(
      transition.value,
      [0, 1],
      [0, ((index - 1) * Math.PI) / 6],
    );
    return {
      transform: [{translateX: origin}, {rotate}, {translateX: -origin}],
    } as ViewStyle;
  });
  return (
    <Animated.View key={card} style={[styles.overlay, style]}>
      <Card {...{card}} />
    </Animated.View>
  );
};

export default AnimatedCard;
