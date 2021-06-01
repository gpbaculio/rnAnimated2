import React, {Dispatch, SetStateAction, useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
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
}

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

const IngredientSelection = ({
  asset,
  state: [state, setState],
  ingredient,
}: IngredientSelectionProps) => {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const {width, height} = Image.resolveAssetSource(asset);
  const aspectRatio = height / width;
  const setIngredient = useCallback(
    () =>
      setState({...state, [ingredient]: Math.max(...Object.values(state)) + 1}),
    [state, setState],
  );
  const onGestureEvent = useAnimatedGestureHandler({
    onActive: ({translationX, translationY}) => {
      translateX.value = translationX;
      translateY.value = translationY;
    },
    onEnd: ({velocityY}) => {
      const dest = snapPoint(translateY.value, velocityY, [0, -HEADER_HEIGHT]);
      translateX.value = withTiming(0);
      translateY.value = withTiming(0, {}, () => {
        opacity.value = 1;
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
      <PanGestureHandler {...{onGestureEvent}}>
        <Animated.View {...{style}}>
          <Image source={asset} style={{width: 50, height: 50 * aspectRatio}} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default IngredientSelection;
