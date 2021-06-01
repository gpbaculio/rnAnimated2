import React, {memo, useEffect} from 'react';
import {Image} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {mix, polar2Canvas} from '../../constants';

import {INGREDIENT_SCALE, MIN_RADIUS, MAX_RADIUS, PIZZA_SIZE} from '../Config';

interface IngredientProps {
  asset: ReturnType<typeof require>;
  index: number;
  total: number;
  zIndex: number;
}

const Ingredient = ({asset, index, total, zIndex}: IngredientProps) => {
  const progresss = useSharedValue(0);

  useEffect(() => {
    progresss.value = withDelay(
      Math.random() * 200,
      withTiming(1, {duration: 500}),
    );
  }, []);

  const dimension = Image.resolveAssetSource(asset);

  const width = dimension.width * INGREDIENT_SCALE;

  const height = dimension.height * INGREDIENT_SCALE;

  //total is number of images
  const theta = (index * (2 * Math.PI)) / total;

  // randomly selects 30% or 60% inside pizza, spread ingredients within
  const radius = Math.round(Math.random()) ? MIN_RADIUS : MAX_RADIUS;

  // base on theta and radius, each ingredient is asssigned x + y
  const {x, y} = polar2Canvas(
    {theta, radius},
    {x: PIZZA_SIZE / 2 - width / 2, y: PIZZA_SIZE / 2 - height / 2},
  );

  const sign1 = Math.round(Math.random()) ? -1 : 1;

  const sign2 = Math.round(Math.random()) ? -1 : 1;

  const style = useAnimatedStyle(() => {
    const opacity = interpolate(
      progresss.value,
      [0, 0.1],
      [0, 1],
      Extrapolate.CLAMP,
    );

    const translateX = mix(progresss.value, (sign1 * PIZZA_SIZE) / 2, 0);

    const translateY = mix(progresss.value, (sign2 * PIZZA_SIZE) / 2, 0);

    const scale = mix(progresss.value, 3, 1);

    return {
      opacity,
      transform: [
        {translateX: x},
        {translateY: y},
        {translateX},
        {translateY},
        {scale},
      ],
    };
  });

  return (
    <Animated.Image
      source={asset}
      style={[
        style,
        {
          zIndex,
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height,
        },
      ]}
    />
  );
};

export default memo(Ingredient);
