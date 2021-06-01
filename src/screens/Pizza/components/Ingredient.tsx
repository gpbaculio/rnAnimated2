import React, {memo, useEffect} from 'react';
import {Image} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
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

const randomSign = () => {
  'worklet';
  return Math.round(Math.random()) === 0 ? -1 : 1;
};

const Ingredient = ({asset, index, total, zIndex}: IngredientProps) => {
  const dimension = Image.resolveAssetSource(asset);
  const width = dimension.width * INGREDIENT_SCALE;
  const height = dimension.height * INGREDIENT_SCALE;
  return (
    <Image
      source={asset}
      style={[
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
