/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {ReText} from '../components';

import {styleGuide} from '../constants';

const styles = StyleSheet.create({
  date: {
    ...styleGuide.typography.title3,
    textAlign: 'center',
  },
  price: {
    ...styleGuide.typography.title2,
    textAlign: 'center',
  },
});

export interface DataPoint {
  coord: {
    x: number;
    y: number;
  };
  data: {
    x: number;
    y: number;
  };
}

interface LabelProps {
  point: Animated.SharedValue<{
    coord: {
      x: number;
      y: number;
    };
    data: {
      x: number;
      y: number;
    };
  }>;
}

/**
 * @summary Computes animation node rounded to precision.
 * @worklet
 */
export const round = (value: number, precision = 0) => {
  'worklet';
  const p = Math.pow(10, precision);
  return Math.round(value * p) / p;
};

const Label = ({point}: LabelProps) => {
  const date = useDerivedValue(() => {
    return new Date(point.value.data.x).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  const price = useDerivedValue(() => {
    return `$ ${round(point.value.data.y, 2).toLocaleString('en-US', {
      currency: 'USD',
    })}`;
  });

  return (
    <View>
      <ReText style={styles.date} text={date} />
      <ReText style={styles.price} text={price} />
    </View>
  );
};

export default Label;
