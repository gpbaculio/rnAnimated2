import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Animated from 'react-native-reanimated';

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
  toggled: boolean;
  index: number;
  card: Cards;
}

const AnimatedCard = ({card, toggled, index}: AnimatedCardProps) => {
  const alpha = toggled ? ((index - 1) * Math.PI) / 6 : 0;
  const style = {
    transform: [
      {translateX: origin},
      {rotate: `${alpha}rad`},
      {translateX: -origin},
    ],
  };
  return (
    <Animated.View key={card} style={[styles.overlay, style]}>
      <Card {...{card}} />
    </Animated.View>
  );
};

export default AnimatedCard;
