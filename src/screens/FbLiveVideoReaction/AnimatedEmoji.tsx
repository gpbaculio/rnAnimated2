import React from 'react';
import {Dimensions} from 'react-native';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
import styled from 'styled-components/native';

import {mix} from '../constants';
const icon = require('../../../assets/Emoji.png');

const {height} = Dimensions.get('window');

const START_POSITION = height - 24;

interface AnimatedEmojiProps {
  progress: Animated.SharedValue<number>;
  x: number;
}

export const isRandomEven = () => {
  'worklet';
  return Math.round(Math.random() * 10) % 2 === 0;
};

export const randomNum = (n: number) => {
  'worklet';
  return Math.random() * n;
};

const handleRandomOutputRange = (x: number) => {
  'worklet';
  return [
    isRandomEven() ? x + randomNum(15) : x - randomNum(15),
    isRandomEven() ? x + randomNum(15) : x - randomNum(15),
    isRandomEven() ? x + randomNum(15) : x - randomNum(15),
  ];
};

const handleRandomScale = (x: number) => {
  'worklet';
  return [
    isRandomEven() ? randomNum(x) : -randomNum(x),
    isRandomEven() ? randomNum(x) : -randomNum(x),
  ];
};

const AnimatedEmoji = ({progress, x}: AnimatedEmojiProps) => {
  const s = handleRandomScale(50);
  const o = handleRandomOutputRange(x);
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.1, 1], [1, 0]),
    transform: [
      {
        translateX: interpolate(progress.value, [1 / 4, (1 / 4) * 2, 1], o),
      },
      {
        translateY: mix(progress.value, START_POSITION, 120),
      },
      {
        rotate: `${interpolate(progress.value, [1 / 4, 1], s)}deg`,
      },
    ],
  }));

  return <StyledAnimatedImage {...{style, source: icon}} />;
};

export default AnimatedEmoji;

const StyledAnimatedImage = styled(Animated.Image)`
  position: absolute;
  width: 48px;
  height: 48px;
`;
