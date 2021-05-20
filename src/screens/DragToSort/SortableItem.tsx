import React, {ReactNode} from 'react';
import {View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface SortableItemProps {
  index: number;
  offsets: {y: Animated.SharedValue<number>}[];
  children: ReactNode;
  width: number;
  height: number;
}

const SortableItem = ({
  index,
  offsets,
  children,
  width,
  height,
}: SortableItemProps) => {
  const activeCard = useSharedValue(-1);

  const isGestureActive = useSharedValue(false);

  const x = useSharedValue(0);

  const currentOffset = offsets[index];

  const y = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {offsetX: number; offsetY: number}
  >({
    onStart: (event, ctx) => {
      isGestureActive.value = true;
      activeCard.value = index;
      ctx.offsetY = currentOffset.y.value;
    },
    onActive: ({translationX, translationY}, ctx) => {
      x.value = translationX;
      y.value = translationY + ctx.offsetY;
      const offsetY = Math.round(y.value / height) * height;
      offsets.forEach((offset, i) => {
        if (offset.y.value === offsetY && index !== i) {
          offset.y.value = currentOffset.y.value;
          currentOffset.y.value = offsetY;
        }
      });
    },
    onEnd: () => {
      activeCard.value = -1;
      isGestureActive.value = false;
      x.value = withSpring(0);
      y.value = withSpring(currentOffset.y.value);
    },
  });

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    zIndex: activeCard.value === index ? 100 : 1,
    transform: [
      {
        translateY: isGestureActive.value
          ? y.value
          : withSpring(currentOffset.y.value),
      },
      {translateX: x.value},
      {scale: withSpring(isGestureActive.value ? 1.05 : 1)},
    ],
  }));

  return (
    <PanGestureHandler {...{onGestureEvent}}>
      <Animated.View style={style}>{children}</Animated.View>
    </PanGestureHandler>
  );
};

export default SortableItem;
