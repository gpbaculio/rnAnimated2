import React, {ReactNode} from 'react';
import {Dimensions, StyleSheet, View, ViewStyle} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
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
}

const Item = ({children, positions, id}: ItemProps) => {
  const inset = useSafeAreaInsets();
  const isGestureActive = useSharedValue(false);
  const containerHeight =
    Dimensions.get('window').height - inset.top - inset.bottom;
  const contentHeight = (Object.keys(positions.value).length / COL) * SIZE;
  const position = getPosition(positions.value[id]);

  const translateX = useSharedValue(position.x);

  const translateY = useSharedValue(position.y);

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
