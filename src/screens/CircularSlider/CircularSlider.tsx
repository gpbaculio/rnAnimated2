import React from 'react';
import {Dimensions, PixelRatio, StyleSheet, View} from 'react-native';
import Animated, {useSharedValue} from 'react-native-reanimated';

import Cursor from './Cursor';
import CircularProgress from './CircularProgress';

import CircleSlider from 'react-native-circle-slider';

import {canvas2Polar} from '../constants';

const {width} = Dimensions.get('window');
const size = width - 64;
const STROKE_WIDTH = 30;
const r = PixelRatio.roundToNearestPixel(size / 2);
const defaultTheta = canvas2Polar({x: 0, y: 0}, {x: r, y: r}).theta;

const CircularSlider = () => {
  console.log('defaultTheta: ', defaultTheta);
  const theta = useSharedValue(defaultTheta);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <CircularProgress strokeWidth={STROKE_WIDTH} {...{theta, r}} />
        </Animated.View>
        <Cursor
          {...{theta}}
          strokeWidth={STROKE_WIDTH}
          r={r - STROKE_WIDTH / 2}
        />
      </View>
      <CircleSlider value={90} />
    </View>
  );
};

export default CircularSlider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: r * 2,
    height: r * 2,
  },
});
