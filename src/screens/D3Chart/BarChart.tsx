import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import * as d3 from 'd3';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {Svg, G, Text as SVGText, Rect} from 'react-native-svg';

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

const {width} = Dimensions.get('window');
interface CountiesProps {
  handleScroll: (b: boolean) => void;
}
const Counties = ({handleScroll}: CountiesProps) => {
  const xRange = [0, width];
  const x = d3.scaleBand().range(xRange).padding(0.25);
  const height = width / 3;
  const y = d3.scaleLinear().range([height, 0]);
  let testData: {key: string; value: number}[] = [];

  data.forEach((d, i) => {
    const keys = Object.keys(d);
    keys.forEach(k => {
      if (k !== 'State') {
        testData.push({
          key: `${i}${k}`,
          value: d[k as keyof typeof d] as number,
        });
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

  return (
    <View style={styles.container}>
      <View style={styles.zoomWrapper}>
        <ReactNativeZoomableView
          zoomEnabled={true}
          maxZoom={4}
          minZoom={1}
          zoomStep={0.25}
          initialZoom={1}
          bindToBorders={true}
          style={styles.zoomableView}
          onZoomBefore={() => {
            handleScroll(false);
          }}
          onZoomEnd={(_: any, __: any, e: any) => {
            if (e.zoomLevel !== 1) {
              handleScroll(false);
            } else {
              handleScroll(true);
            }
          }}>
          <Svg style={styles.svg} width={width} height={width}>
            <G scale={1} translateY={width / 4}>
              {testData.map((d, index) => {
                return (
                  <Rect
                    key={`rect:${index}`}
                    rx={5}
                    x={x(d.key)}
                    y={y(d.value)}
                    fill={color(d.value)}
                    width={x.bandwidth()}
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
            </G>
          </Svg>
        </ReactNativeZoomableView>
      </View>
    </View>
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
