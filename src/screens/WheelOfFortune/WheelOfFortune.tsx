import React from 'react';
import {View, Text} from 'react-native';
import {Path, G, Text as RNSVGText, TSpan} from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import color from 'randomcolor';
import {snap} from '@popmotion/popcorn';

const numberOfSequence = 10;

const WheelOfFortune = () => {
  return (
    <View>
      <Text>WheelOfFortune</Text>
    </View>
  );
};

export default WheelOfFortune;
