import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {ReText} from '../components';
import {Path, round} from '../constants';

import ETH from './components/ETH';
import {SIZE} from './Model';

interface HeaderProps {
  y: Animated.SharedValue<number>;
  data: Animated.SharedValue<{
    data: {
      label: string;
      minPrice: number;
      maxPrice: number;
      percentChange: number;
      path: Path;
    };
  }>;
}

const Header = ({data, y}: HeaderProps) => {
  const price = useDerivedValue(
    () =>
      `$ ${round(
        interpolate(
          y.value,
          [SIZE, 0],
          [data.value.data.minPrice, data.value.data.maxPrice],
        ),
        2,
      ).toLocaleString('en-US', {
        currency: 'USD',
      })}`,
  );

  const percentChange = useDerivedValue(
    () => `${round(data.value.data.percentChange, 3)}%`,
  );

  const label = useDerivedValue(() => data.value.data.label);

  const style = useAnimatedStyle(() => ({
    fontWeight: '500',
    fontSize: 24,
    color: data.value.data.percentChange > 0 ? 'green' : 'red',
  }));

  return (
    <View style={styles.container}>
      <ETH />
      <View style={styles.values}>
        <View>
          <ReText style={styles.value} text={price} />
          <Text style={styles.label}>Etherum</Text>
        </View>
        <View>
          <ReText style={style} text={percentChange} />
          <ReText style={styles.label} text={label} />
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  values: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  value: {
    fontWeight: '500',
    fontSize: 24,
  },
  label: {
    fontSize: 18,
  },
});
