import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Svg, G, Text as SVGText, Rect} from 'react-native-svg';
import * as d3 from 'd3';

import {ZoomableSvg} from './components';

const width = Dimensions.get('window').width - 15;

const App = () => (
  <View style={styles.container}>
    <ZoomableSvg
      width={width}
      height={width / 3 + 30}
      doubleTapThreshold={300}
      constrain={{
        scaleExtent: [1, 3],
        translateExtent: [
          [0, 0],
          [width, width / 3 + 30],
        ],
      }}
      svgRoot={({transform}) => {
        const zoomIdentity = d3.zoomIdentity
          .translate(transform.translateX, transform.translateY)
          .scale(transform.scaleX);

        const xRange = [0, width].map(d => zoomIdentity.applyX(d));
        const x = d3.scaleBand().range(xRange).padding(0.25);
        const height = width / 3;
        const y = d3.scaleLinear().range([height, 0]);
        let testData = [];

        data.forEach((d, i) => {
          const keys = Object.keys(d);
          keys.forEach(k => {
            if (k !== 'State') {
              testData.push({
                key: `${i}${k}`,
                value: d[k],
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
          }),
        ]);
        const color = d3.scaleLinear(
          [
            d3.min(testData, function (d) {
              return d.value;
            }),
            d3.max(testData, function (d) {
              return d.value;
            }) / 2,
            d3.max(testData, function (d) {
              return d.value;
            }),
          ],
          [
            'rgba(27, 255, 173, 1)',
            'rgba(65, 139, 250, 1)',
            'rgba(19, 77, 164, 1)',
          ],
        );
        return (
          <Svg width={width} height={width / 3 + 30}>
            <G>
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
                    fontSize={8.5}
                    transform={`translate(${xState(d.State)},${height + 20})`}
                    fill="green">
                    {d.State}
                  </SVGText>
                );
              })}
            </G>
          </Svg>
        );
      }}
    />
  </View>
);

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'yellow',
    padding: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

var data = [
  {
    State: 'SEEDS',
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
    State: 'FERTILIZERS',
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
    State: 'DISINFECTANTS',
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
