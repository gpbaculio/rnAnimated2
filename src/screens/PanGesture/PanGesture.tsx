import React from 'react';
import {View, StyleSheet, Dimensions, Platform} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

import {Card, Cards, CARD_HEIGHT, CARD_WIDTH} from '../components';
import {clamp} from '../constants';
import {withBounce} from './constants';

const {width, height} = Dimensions.get('window');

const Gesture = () => {
  const translateX = useSharedValue(0);

  const translateY = useSharedValue(0);

  const boundX = width - CARD_WIDTH;

  const boundY = height - CARD_HEIGHT - (Platform.OS === 'ios' ? 90 : 80);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {offsetX: number; offsetY: number}
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = translateX.value;

      ctx.offsetY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = clamp(ctx.offsetX + event.translationX, 0, boundX);

      translateY.value = clamp(ctx.offsetY + event.translationY, 0, boundY);
    },
    onEnd: event => {
      translateX.value = withBounce(
        withDecay({
          velocity: event.velocityX,
          clamp: [0, boundX],
        }),
        0,
        boundX,
      );

      translateY.value = withBounce(
        withDecay({
          velocity: event.velocityY,
          clamp: [0, boundY],
        }),
        0,
        boundY,
      );
    },
  });

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <PanGestureHandler {...{onGestureEvent}}>
        <Animated.View {...{style}}>
          <Card card={Cards.Card1} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Gesture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
