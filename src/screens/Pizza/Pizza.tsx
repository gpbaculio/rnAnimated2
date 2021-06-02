import React from 'react';
import {StyleSheet, Image, View, Dimensions} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {assets, BREAD_PADDING, PIZZA_SIZE} from './Config';

const {width} = Dimensions.get('window');

interface PizzaProps {
  id: string;
  index: number;
  asset: ReturnType<typeof require>;
  x: Animated.SharedValue<number>;
}

const Pizza = ({id, index, asset, x}: PizzaProps) => {
  const {navigate} = useNavigation();

  const style = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = interpolate(
      x.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP,
    );

    const translateX = interpolate(
      x.value,
      inputRange,
      [-width / 2, 0, width / 2],
      Extrapolate.CLAMP,
    );

    const translateY = interpolate(
      x.value,
      inputRange,
      [width / 2, 0, width / 2],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{translateX}, {translateY}, {scale}],
    };
  });

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => navigate('Pizza', {id})}>
        <Animated.View style={[styles.pizza, style]}>
          <Image source={assets.plate} style={[styles.plate]} />
          <Image source={asset} style={styles.bread} />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Pizza;

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: 'center',
  },
  pizza: {
    width: PIZZA_SIZE,
    height: PIZZA_SIZE,
  },
  plate: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  bread: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    top: BREAD_PADDING,
    left: BREAD_PADDING,
    right: BREAD_PADDING,
    bottom: BREAD_PADDING,
  },
});
