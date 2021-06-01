import React, {Dispatch, SetStateAction, useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {snapPoint} from '../../constants';

import {State} from '../Config';
import {HEADER_HEIGHT} from './Header';

interface IngredientSelectionProps {
  asset: ReturnType<typeof require>;
  ingredient: keyof State;
  state: [State, Dispatch<SetStateAction<State>>];
  selected: Animated.SharedValue<boolean>;
}

const IngredientSelection = ({
  asset,
  state: [state, setState],
  ingredient,
  selected,
}: IngredientSelectionProps) => {
  const opacity = useSharedValue(1);

  const translateX = useSharedValue(0);

  const translateY = useSharedValue(0);

  const {width, height} = Image.resolveAssetSource(asset);

  const aspectRatio = height / width;

  const setIngredient = useCallback(
    () =>
      setState({
        ...state,
        [ingredient]:
          state[ingredient] === 0 ? Math.max(...Object.values(state)) + 1 : 0,
      }),
    [ingredient, state, setState],
  );

  const onTapEvent = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onEnd: () => {
      // tapping removes the ingredient
      runOnJS(setIngredient)();
    },
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onActive: ({translationX, translationY}) => {
      // move the ingredient
      translateX.value = translationX;
      translateY.value = translationY;
      selected.value = translateY.value < -HEADER_HEIGHT;
    },
    onEnd: ({velocityY}) => {
      const dest = snapPoint(translateY.value, velocityY, [0, -HEADER_HEIGHT]);

      // always return the ingredient to the button container
      translateX.value = withTiming(0);
      // after ingredient has been returned, show opacity
      translateY.value = withTiming(0, {}, () => {
        opacity.value = 1;
        selected.value = false;
      });

      if (dest !== 0) {
        opacity.value = 0;
        runOnJS(setIngredient)();
      }
    },
  });

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateX: translateX.value}, {translateY: translateY.value}],
  }));

  return (
    <View style={styles.container}>
      <TapGestureHandler {...{onGestureEvent: onTapEvent}}>
        <Animated.View>
          <PanGestureHandler {...{onGestureEvent}}>
            <Animated.View {...{style}}>
              <Image
                source={asset}
                style={{width: 50, height: 50 * aspectRatio}}
              />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

export default IngredientSelection;

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3E9C6',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
});
