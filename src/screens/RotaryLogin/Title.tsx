import React from 'react';
import {Matrix3, processTransform2d} from 'react-native-redash';
import {G, Text} from 'react-native-svg';

import {RADIUS, center} from './Quadrant';

const serializeToSVGMatrix = (m: Matrix3) => {
  'worklet';
  return `matrix(${m[0][0]}, ${m[1][0]}, ${m[0][1]}, ${m[1][1]}, ${m[0][2]}, ${m[1][2]})`;
};

const fontSize = 26;

const Title = () => {
  return (
    <G
      transform={serializeToSVGMatrix(
        processTransform2d([{translateY: -RADIUS - 100}]),
      )}>
      <Text
        fontWeight="800"
        fontSize={fontSize}
        fill="black"
        x={center.x - RADIUS}
        y={center.y - fontSize / 2}>
        ENTER
      </Text>
      <Text
        fontWeight="800"
        fontSize={fontSize}
        fill="black"
        x={center.x - RADIUS}
        y={center.y + fontSize / 2}>
        PASSCODE
      </Text>
    </G>
  );
};

export default Title;
