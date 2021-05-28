import Animated from 'react-native-reanimated';

import {move} from '../constants';

export type SharedValues<T extends Record<string, string | number | boolean>> =
  {
    [K in keyof T]: Animated.SharedValue<T[K]>;
  };

export type Offset = SharedValues<{
  order: number;
  width: number;
  height: number;
  x: number;
  y: number;
  originalX: number;
  originalY: number;
}>;

const isNotInWordBank = (offset: Offset) => {
  'worklet';
  return offset.order.value !== -1;
};

const byOrder = (a: Offset, b: Offset) => {
  'worklet';
  return a.order.value > b.order.value ? 1 : -1;
};

export const reOrder = (offsets: Offset[], from: number, to: number) => {
  'worklet';
  const sortedOffsets = offsets.filter(isNotInWordBank).sort(byOrder);

  const newOffsets = move(sortedOffsets, from, to);

  newOffsets.map((offset, index) => (offset.order.value = index));
};

export const calculateLayout = (input: Offset[], containerWidth: number) => {
  'worklet';

  const offsets = input.filter(isNotInWordBank).sort(byOrder);

  if (offsets.length === 0) {
    return;
  }

  const height = offsets[0].height.value;

  let lineNumber = 0;

  let lineBreak = 0;

  offsets.forEach((offset, index) => {
    // calculate width on each offset
    const total = offsets
      .slice(lineBreak, index)
      .reduce((acc, o) => acc + o.width.value, 0);

    // if true, make lineBreak, puts word in next line
    if (total + offset.width.value > containerWidth) {
      lineNumber += 1;
      lineBreak = index;
      offset.x.value = 0;
    } else {
      offset.x.value = total;
    }
    offset.y.value = height * lineNumber;
  });
};

export const lastOrder = (offsets: Offset[]) => {
  'worklet';
  return offsets.filter(isNotInWordBank).length;
};

export const remove = (offsets: Offset[], index: number) => {
  'worklet';

  const sortedOffsets = offsets
    .filter((o, i) => i !== index)
    .filter(isNotInWordBank)
    .sort(byOrder);

  sortedOffsets.map((offset, i) => (offset.order.value = i));
};
