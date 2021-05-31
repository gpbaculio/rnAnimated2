import React from 'react';
import {View, Text} from 'react-native';
import Animated, {useAnimatedProps} from 'react-native-reanimated';
import {Path as SvgPath} from 'react-native-svg';
import {Path, serialize} from '../constants';

const AnimatedSvgPath = Animated.createAnimatedComponent(SvgPath);

interface AnimatedPathProps {
  data: Animated.SharedValue<{
    label: string;
    minPrice: number;
    maxPrice: number;
    percentChange: number;
    path: Path;
  }>;
}

const AnimatedPath = ({data}: AnimatedPathProps) => {
  console.log('data.valu: ', data.value);
  const animatedProps = useAnimatedProps(() => ({
    d: serialize(data.value.path),
  }));
  return (
    <AnimatedSvgPath
      animatedProps={animatedProps}
      fill="transparent"
      stroke="red"
      strokeWidth={3}
    />
  );
};

export default AnimatedPath;
