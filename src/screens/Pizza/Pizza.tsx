import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  Platform,
  Pressable,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {assets, BREAD_PADDING, PIZZA_SIZE} from './Config';
import {SharedElement} from 'react-navigation-shared-element';

const {width} = Dimensions.get('window');

interface PizzaProps {
  id: string;
  index: number;
  asset: ReturnType<typeof require>;
  x: Animated.SharedValue<number>;
}

const Pizza = ({id, index, asset, x}: PizzaProps) => {
  const navigation = useNavigation();

  const style = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

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
    const scaleOutputRangeItem = Platform.OS === 'ios' ? 0.3 : 0.175;
    const scale = interpolate(
      x.value,
      inputRange,
      [scaleOutputRangeItem, 1, scaleOutputRangeItem],
      Extrapolate.CLAMP,
    );

    const pizzaWidth = interpolate(
      x.value,
      inputRange,
      [PIZZA_SIZE * 2, PIZZA_SIZE, PIZZA_SIZE * 2],
      Extrapolate.CLAMP,
    );

    const pizzaHeight = interpolate(
      x.value,
      inputRange,
      [PIZZA_SIZE * 2, PIZZA_SIZE, PIZZA_SIZE * 2],
      Extrapolate.CLAMP,
    );

    return {
      width: Platform.OS === 'ios' ? PIZZA_SIZE : pizzaWidth,
      height: Platform.OS === 'ios' ? PIZZA_SIZE : pizzaHeight,
      transform: [{translateX}, {translateY}, {scale}],
    };
  });

  //only make the plate visible on current pizza
  const plateStyle = useAnimatedStyle(() => {
    return {
      opacity: x.value === index * width ? 1 : 0,
    };
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate('Pizza', {id})}>
        <SharedElement {...{id}}>
          <>
            <Animated.View {...{style}}>
              <Animated.Image
                source={assets.plate}
                style={[styles.plate, plateStyle]}
              />
              <Image source={asset} style={styles.bread} />
            </Animated.View>
          </>
        </SharedElement>
      </Pressable>
    </View>
  );
};

export default Pizza;

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: 'center',
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
