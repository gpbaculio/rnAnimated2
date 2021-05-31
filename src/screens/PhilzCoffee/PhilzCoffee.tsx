import React from 'react';
import {Dimensions, View, ScrollView, StyleSheet} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import {products} from './Model';
import Card, {CARD_HEIGHT} from './Card';
import Products from './Products';
import Cards from './components/Cards';

const {width} = Dimensions.get('window');

const snapToOffsets = [0, CARD_HEIGHT];

const PhilzCoffee = () => {
  const translateX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: ({contentOffset: {x}}) => {
      translateX.value = x;
    },
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const inputRange = products.map((_, i) => width * i);

    const outputColorRange = products.map((product, i) => product.color2);

    return {
      backgroundColor: interpolateColor(
        translateX.value,
        inputRange,
        outputColorRange,
      ),
    };
  });

  return (
    <Animated.View {...{style: [styles.container, animatedContainerStyle]}}>
      <ScrollView
        {...{
          decelerationRate: 'fast',
          snapToOffsets,
          bounces: false,
          showsVerticalScrollIndicator: false,
          snapToEnd: false,
        }}>
        <View style={styles.slider}>
          <Animated.ScrollView
            {...{
              onScroll,
              scrollEventThrottle: 16,
              horizontal: true,
              decelerationRate: 'fast',
              snapToInterval: width,
              showsHorizontalScrollIndicator: false,
            }}>
            {products.map((product, index) => (
              <Card {...{key: index, product}} />
            ))}
          </Animated.ScrollView>
          <Products />
        </View>
        <Cards />
      </ScrollView>
    </Animated.View>
  );
};

export default PhilzCoffee;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slider: {height: CARD_HEIGHT},
});
