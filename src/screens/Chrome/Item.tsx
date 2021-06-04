import React, {ReactNode, RefObject} from 'react';
import {Dimensions, StyleSheet, View, ViewStyle} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSharedValue} from './Animations';

import {
  animationConfig,
  COL,
  getOrder,
  getPosition,
  Positions,
  SIZE,
} from './Config';

interface ItemProps {
  children: ReactNode;
  id: string;
  positions: Animated.SharedValue<Positions>;
  scrollRef: RefObject<Animated.ScrollView>;
  scrollY: Animated.SharedValue<number>;
}

const Item = ({children, positions, id, scrollRef, scrollY}: ItemProps) => {
  const inset = useSafeAreaInsets();

  const isGestureActive = useSharedValue(false);

  const containerHeight =
    Dimensions.get('window').height - inset.top - inset.bottom;

  const contentHeight = (Object.keys(positions.value).length / COL) * SIZE;

  const position = getPosition(positions.value[id]);

  const translateX = useSharedValue(position.x);

  const translateY = useSharedValue(position.y);

  useAnimatedReaction(
    () => positions.value[id],
    newOrder => {
      const newPosition = getPosition(newOrder);
      translateX.value = withTiming(newPosition.x, animationConfig);
      translateY.value = withTiming(newPosition.y, animationConfig);
    },
  );

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {x: number; y: number}
  >({
    onStart: (_, ctx) => {
      ctx.x = translateX.value;
      ctx.y = translateY.value;
      isGestureActive.value = true;
    },
    onActive: ({translationX, translationY}, ctx) => {
      translateX.value = ctx.x + translationX;
      translateY.value = ctx.y + translationY;
      const oldOrder = positions.value[id];
      const newOrder = getOrder(translateX.value, translateY.value);
      if (oldOrder !== newOrder) {
        const idToSwap = Object.keys(positions.value).find(
          k => positions.value[k] === newOrder,
        );
        if (idToSwap) {
          const newPositions = JSON.parse(JSON.stringify(positions.value));
          newPositions[id] = newOrder;
          newPositions[idToSwap] = oldOrder;
          positions.value = newPositions;
        }
      }
      const lowerBound = scrollY.value;
      const upperBound = lowerBound + containerHeight - SIZE;
      const maxScroll = contentHeight - containerHeight;
      const scrollLeft = maxScroll - scrollY.value;
      if (translateY.value < lowerBound) {
        const diff = Math.min(lowerBound - translateY.value, lowerBound);
        scrollY.value -= diff;
        ctx.y -= diff;
        translateY.value = ctx.y + translationY;
        scrollTo(scrollRef, 0, scrollY.value, false);
      }
      if (translateY.value > upperBound) {
        const diff = Math.min(translateY.value - upperBound, scrollLeft);
        scrollY.value += diff;
        ctx.y += diff;
        translateY.value = ctx.y + translationY;
        scrollTo(scrollRef, 0, scrollY.value, false);
      }
    },
    onEnd: () => {
      const destination = getPosition(positions.value[id]);
      translateX.value = withTiming(destination.x, animationConfig, () => {
        isGestureActive.value = false;
      });
      translateY.value = withTiming(destination.y, animationConfig);
    },
  });

  const style = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0;
    const scale = isGestureActive.value ? 1.1 : 1;
    return {
      zIndex,
      position: 'absolute',
      top: 0,
      left: 0,
      width: SIZE,
      height: SIZE,
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale},
      ],
    };
  });

  return (
    <Animated.View {...{style}}>
      <PanGestureHandler {...{onGestureEvent}}>
        <Animated.View style={StyleSheet.absoluteFill}>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default Item;
