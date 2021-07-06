import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDerivedValue, useSharedValue} from 'react-native-reanimated';

import Picture from './Picture';
import Controls from './Controls';
import Cursor from './Cursor';
import {HEIGHT, WIDTH, PADDING} from './Constants';
import {curveLines} from '../constants';
const img1 = require('./assets/1.jpg');
const img2 = require('./assets/2.jpg');
const img3 = require('./assets/3.jpg');
const img4 = require('./assets/4.jpg');
const img5 = require('./assets/5.jpg');
const img6 = require('./assets/6.jpg');
const img7 = require('./assets/7.jpg');
const img8 = require('./assets/8.jpg');
export const assets = [img1, img2, img3, img4, img5, img6];

const Darkroom = () => {
  const v1 = useSharedValue(1);
  const v2 = useSharedValue(0.75);
  const v3 = useSharedValue(0.5);
  const v4 = useSharedValue(0.25);
  const v5 = useSharedValue(0);
  const points = [v1, v2, v3, v4, v5];
  const STEP = WIDTH / 4;
  const path = useDerivedValue(() => {
    return curveLines(
      points.map((point, i) => {
        return {
          x: PADDING + i * STEP,
          y: point.value * HEIGHT,
        };
      }),
      0.1,
      'complex',
    );
  });
  return (
    <SafeAreaView style={styles.container}>
      <Picture {...{path}} source={assets[1]} />
      <View>
        <Controls {...{path}} />
        <View style={styles.cursors}>
          <Cursor value={v1} />
          <Cursor value={v2} />
          <Cursor value={v3} />
          <Cursor value={v4} />
          <Cursor value={v5} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Darkroom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-evenly',
  },
  cursors: {
    ...StyleSheet.absoluteFillObject,
    left: PADDING / 2,
    right: PADDING / 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
