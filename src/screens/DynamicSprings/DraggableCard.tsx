import React from 'react';
import {View, StyleSheet, Dimensions, Platform} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withDecay,
} from 'react-native-reanimated';

import {Card, Cards, CARD_HEIGHT, CARD_WIDTH} from '../components';
import {clamp} from '../constants';

const {width, height} = Dimensions.get('window');
interface GestureProps {
  translateX: Animated.SharedValue<number>;
  translateY: Animated.SharedValue<number>;
}
const Gesture = ({translateX, translateY}: GestureProps) => {
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
      (translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [0, boundX],
      })),
        (translateY.value = withDecay({
          velocity: event.velocityY,
          clamp: [0, boundY],
        }));
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
