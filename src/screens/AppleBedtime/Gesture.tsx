import React from 'react';
import {StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {useAnimatedGestureHandler} from 'react-native-reanimated';

import {CENTER, containedInSquare, normalize, STROKE} from './Constants';
import CursorOverlay from './CursorOverlay';

enum Region {
  START,
  END,
  MAIN,
}

interface GestureProps {}

const Gesture = ({}: GestureProps) => {
  return null;
};

export default Gesture;
