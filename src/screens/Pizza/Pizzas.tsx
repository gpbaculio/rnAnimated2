import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import Pizza from './Pizza';
import Background from './components/Background';
import {assets} from './Config';
import {ScrollView} from 'react-native-gesture-handler';

const {width} = Dimensions.get('window');
const pizza = [
  {
    asset: assets.pizza[0],
  },
  {
    asset: assets.pizza[1],
  },
  {
    asset: assets.pizza[2],
  },
  {
    asset: assets.pizza[3],
  },
  {
    asset: assets.pizza[4],
  },
];
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F5F2',
  },
});

const Pizzas = () => {
  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: ({contentOffset}) => {
      x.value = contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <Background />
      <Animated.ScrollView
        {...{
          onScroll,
          scrollEventThrottle: 16,
          decelerationRate: 'fast',
          snapToInterval: width,
          showsHorizontalScrollIndicator: false,
          contentContainerStyle: {
            alignItems: 'center',
          },
          horizontal: true,
        }}>
        {pizza.map(({asset}, index) => (
          <Pizza
            {...{id: `${index}`, x, key: index, index: index, asset: asset}}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default Pizzas;
