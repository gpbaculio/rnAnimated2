import {Dimensions} from 'react-native';
import {Easing} from 'react-native-reanimated';

export interface Positions {
  [id: string]: number;
}

const {width} = Dimensions.get('window');
export const MARGIN = 8;
export const SIZE = width / 2 - MARGIN;
export const COL = 2;

export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 350,
};

export const getPosition = (order: number) => {
  'worklet';
  return {
    x: (order % COL) * SIZE,
    y: Math.floor(order / COL) * SIZE,
  };
};

export const getOrder = (x: number, y: number) => {
  'worklet';
  const col = Math.round(x / SIZE);
  const row = Math.round(y / SIZE);

  return row * COL + col;
};
