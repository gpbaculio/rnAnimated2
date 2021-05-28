import React, {ReactElement} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import {calculateLayout, lastOrder, Offset, remove, reOrder} from './Layout';
import Placeholder, {MARGIN_TOP, MARGIN_LEFT} from './components/Placeholder';
import {useVector, between} from '../constants';

interface SortableWordProps {
  offsets: Offset[];
  children: ReactElement<{id: number}>;
  index: number;
  containerWidth: number;
}

const SortableWord = ({
  offsets,
  index,
  children,
  containerWidth,
}: SortableWordProps) => {
  const offset = offsets[index];

  const translation = useVector();

  const isGestureActive = useSharedValue(false);

  // isInBank means the word is below the lines, at the gray container
  const isInBank = useDerivedValue(() => offset.order.value === -1);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      x: number;
      y: number;
    }
  >({
    onStart: (_, ctx) => {
      if (isInBank.value) {
        translation.x.value = offset.originalX.value - MARGIN_LEFT;

        translation.y.value = offset.originalY.value + MARGIN_TOP;
      } else {
        translation.x.value = offset.x.value;

        translation.y.value = offset.y.value;
      }

      ctx.x = translation.x.value;

      ctx.y = translation.y.value;

      isGestureActive.value = true;
    },
    onActive: ({translationX, translationY}, ctx) => {
      translation.x.value = ctx.x + translationX;

      translation.y.value = ctx.y + translationY;

      // puts word on lines
      if (isInBank.value && translation.y.value < 100) {
        // assigns last order animationg the word to last item on lines
        offset.order.value = lastOrder(offsets);

        calculateLayout(offsets, containerWidth);
      }
      // puts word on wordbank
      else if (!isInBank.value && translation.y.value > 100) {
        offset.order.value = -1;

        remove(offsets, index);

        calculateLayout(offsets, containerWidth);
      }

      for (let i = 0; i < offsets.length; i++) {
        // o is current offset from the loop
        const o = offsets[i];

        if (i === index && o.order.value !== -1) continue;

        if (
          between(translation.x.value, o.x.value, o.x.value + o.width.value) &&
          between(translation.y.value, o.y.value, o.y.value + o.height.value)
        ) {
          // offset is the current word being dragged
          reOrder(offsets, offset.order.value, o.order.value);

          calculateLayout(offsets, containerWidth);

          break;
        }
      }
    },
    onEnd: () => {
      isGestureActive.value = false;

      translation.x.value = withSpring(offset.x.value);

      translation.y.value = withSpring(offset.y.value);
    },
  });

  const translateX = useDerivedValue(() => {
    if (isGestureActive.value) return translation.x.value;

    return withSpring(
      isInBank.value ? offset.originalX.value - MARGIN_LEFT : offset.x.value,
    );
  });

  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) return translation.y.value;

    return withSpring(
      isInBank.value ? offset.originalY.value + MARGIN_TOP : offset.y.value,
    );
  });

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: offset.width.value,
    height: offset.height.value,
    zIndex: isGestureActive.value ? 1 : 0,
    transform: [{translateX: translateX.value}, {translateY: translateY.value}],
  }));

  return (
    <>
      <Placeholder offset={offset} />
      <Animated.View style={style}>
        <PanGestureHandler {...{onGestureEvent}}>
          <Animated.View style={StyleSheet.absoluteFill}>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </>
  );
};

export default SortableWord;
