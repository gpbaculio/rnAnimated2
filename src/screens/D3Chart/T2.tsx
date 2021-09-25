import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import * as d3 from 'd3';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {Svg, G, Path, Circle, Text as SVGText, Rect} from 'react-native-svg';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
} from 'react-native-reanimated';

interface DataType {
  State: string;
  test: number;
  test1: number;
  test2: number;
  test3: number;
  test4: number;
  test5: number;
  test6: number;
  test7: number;
  test8: number;
  test9: number;
  test10: number;
  test11: number;
  test12: number;
  test13: number;
  test16: number;
  test17: number;
  test18: number;
  test19: number;
  test20: number;
  test21: number;
  test22: number;
  test23: number;
  test24: number;
  test25: number;
}
var data = [
  {
    State: 'BIG SCREEN + STAGE',
    test: 1,
    test1: 2,
    test2: 3,
    test3: 4,
    test4: 5,
    test5: 6,
    test6: 7,
    test7: 8,
    test8: 9,
    test9: 10,
    test10: 11,
    test11: 12,
    test12: 13,
    test13: 14,
    test16: 11,
    test17: 12,
    test18: 13,
    test19: 14,
    test20: 10,
    test21: 11,
    test22: 12,
    test23: 13,
    test24: 14,
    test25: 14,
  },
  {
    State: 'OCCASIONAL BINGER',
    test: 15,
    test1: 16,
    test2: 17,
    test3: 18,
    test4: 19,
    test5: 20,
    test6: 21,
    test7: 22,
    test8: 23,
    test9: 24,
    test10: 25,
    test11: 26,
    test12: 27,
    test13: 28,
    test16: 11,
    test17: 12,
    test18: 13,
    test19: 14,
    test20: 10,
    test21: 11,
    test22: 12,
    test23: 13,
    test24: 14,
    test25: 14,
  },
  {
    State: 'SMALL SCREEN STREAMER',
    test: 8,
    test1: 30,
    test2: 31,
    test3: 32,
    test4: 33,
    test5: 34,
    test6: 35,
    test7: 36,
    test8: 37,
    test9: 38,
    test10: 39,
    test11: 40,
    test12: 41,
    test13: 42,
    test16: 11,
    test17: 12,
    test18: 13,
    test19: 14,
    test20: 10,
    test21: 11,
    test22: 12,
    test23: 13,
    test24: 14,
    test25: 14,
  },
];

var keys: [
  'test',
  'test1',
  'test2',
  'test3',
  'test4',
  'test5',
  'test6',
  'test7',
  'test8',
  'test9',
  'test10',
  'test11',
  'test12',
  'test13',
  'test16',
  'test17',
  'test18',
  'test19',
  'test20',
  'test21',
  'test22',
  'test23',
  'test24',
  'test25',
] = [
  'test',
  'test1',
  'test2',
  'test3',
  'test4',
  'test5',
  'test6',
  'test7',
  'test8',
  'test9',
  'test10',
  'test11',
  'test12',
  'test13',
  'test16',
  'test17',
  'test18',
  'test19',
  'test20',
  'test21',
  'test22',
  'test23',
  'test24',
  'test25',
];

const {width} = Dimensions.get('window');
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
interface CountiesProps {
  handleScroll: (b: boolean) => void;
}
const Counties = ({handleScroll}: CountiesProps) => {
  const [xRange, setXRange] = useState([0, width]);
  var x = d3.scaleBand().range(xRange).padding(0.25);
  const height = width / 3;
  var y = d3.scaleLinear().range([height, 0]);
  let testData: {key: string; value: number}[] = [];

  data.forEach((d, i) => {
    const keys = Object.keys(d);
    keys.forEach(k => {
      if (k !== 'State') {
        const el = {
          key: `${i}${k}`,
          value: d[k as keyof typeof d] as number,
        };
        testData.push(el);
      }
    });
  });

  const xState = d3.scaleBand().range(xRange);

  xState.domain(data.map(d => d.State));
  x.domain(
    testData.map(function (d) {
      return d.key;
    }),
  );
  y.domain([
    0,
    d3.max(testData, function (d) {
      return d.value;
    }) as number,
  ]);
  const color = d3.scaleLinear(
    [
      d3.min(testData, function (d) {
        return d.value;
      }) as number,
      (d3.max(testData, function (d) {
        return d.value;
      }) as number) / 2,
      d3.max(testData, function (d) {
        return d.value;
      }) as number,
    ],
    ['rgba(27, 255, 173, 1)', 'rgba(65, 139, 250, 1)', 'rgba(19, 77, 164, 1)'],
  );
  const rescaledX = useSharedValue(0);
  const rescaledY = useSharedValue(0);
  const onGestureEvent =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onActive: e => {
        console.log('e213: ', e);
        // const zoomIdentity = d3.zoomIdentity.translate(e.focalX, e.focalY);
        // // x.range([0, width].map(d => zoomIdentity.applyX(d)));
        // // xState.range([0, width].map(d => zoomIdentity.applyX(d)));
        // // console.log('zoomIdentity: ', zoomIdentity);
        // setXRange([0, width].map(d => zoomIdentity.applyX(d)));
      },
    });
  const [xBandWidth, setXBandWidth] = useState(x.bandwidth());
  console.log('x', x);
  return (
    <PinchGestureHandler
      onGestureEvent={e => {
        console.log('e', e.nativeEvent);
        const zoomIdentity = d3.zoomIdentity.translate(
          e.nativeEvent.focalX,
          e.nativeEvent.focalY,
        );
        console.log('zoomIdentity', zoomIdentity);

        // x.range([0, width].map(d => zoomIdentity.applyX(d)));
        // xState.range([0, width].map(d => zoomIdentity.applyX(d)));
        // console.log('zoomIdentity: ', zoomIdentity);
        // setXBandWidth(x.bandwidth());
        setXRange(xRange.map(d => zoomIdentity.applyX(d)));
      }}>
      <Svg style={styles.svg} width={width} height={width}>
        {testData.map((d, index) => {
          return (
            <Rect
              key={`rect:${index}`}
              rx={5}
              x={x(d.key)}
              y={y(d.value)}
              fill={color(d.value)}
              width={xBandWidth}
              height={height - y(d.value)}
            />
          );
        })}
        {data.map((d, index) => {
          return (
            <SVGText
              key={`label:${index}`}
              fontSize={10}
              transform={`translate(${xState(d.State) as number},${
                height + 20
              })`}
              fill="green">
              {d.State}
            </SVGText>
          );
        })}
      </Svg>
    </PinchGestureHandler>
  );
};

export default Counties;
const styles = StyleSheet.create({
  svg: {
    backgroundColor: 'red',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#5569ff',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
  zoomWrapper: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'green',
  },
  zoomableView: {
    backgroundColor: 'yellow',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '80%',
    marginBottom: 10,
  },
  caption: {
    fontSize: 10,
    color: '#444',
    alignSelf: 'center',
  },
});
