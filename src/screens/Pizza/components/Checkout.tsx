import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import {mix} from '../../constants';

const SIZE = 20;

interface CheckoutProps {
  progress: Animated.SharedValue<number>;
}

const Checkout = ({progress}: CheckoutProps) => {
  const bubble = useAnimatedStyle(() => ({
    position: 'absolute',
    top: SIZE / 2,
    right: SIZE / 2,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: interpolate(progress.value, [0.5, 1], [0, 1], Extrapolate.CLAMP),
    transform: [{scale: mix(progress.value, 0, 1)}],
  }));
  const icon = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          progress.value,
          [1, 0.5, 1],
          [1, 1.2, 1],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));
  return (
    <View style={styles.container}>
      <Animated.View {...{style: icon}}>
        <AntDesign size={32} name="shoppingcart" />
      </Animated.View>
      <Animated.View {...{style: bubble}}>
        <Text style={styles.bubble}>1</Text>
      </Animated.View>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-end',
    padding: 16,
  },
  bubble: {
    color: 'white',
  },
});
