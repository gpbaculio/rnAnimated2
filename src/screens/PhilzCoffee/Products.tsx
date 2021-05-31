import React from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';

import {products} from './Model';

const {width} = Dimensions.get('window');
const SIZE = 200;

interface ProductsProps {
  x: Animated.SharedValue<number>;
}

const Products = ({x}: ProductsProps) => {
  return (
    <View style={styles.container} pointerEvents="none">
      {products.map((product, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          const inputRange = [
            width * (index - 1),
            width * index,
            width * (index + 1),
          ];

          const translateX = interpolate(x.value, inputRange, [
            width / 2,
            0,
            -width / 2,
          ]);

          const scale = interpolate(x.value, inputRange, [0.75, 1, 0.75]);

          return {
            transform: [{translateX}, {scale}],
          };
        });

        return (
          <Animated.View key={index} style={[styles.container, animatedStyle]}>
            <Image
              source={product.picture}
              style={{width: SIZE, height: SIZE * product.aspectRatio}}
            />
          </Animated.View>
        );
      })}
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
