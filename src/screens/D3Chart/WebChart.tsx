import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import * as d3 from 'd3';
import {PieArcDatum} from 'd3';
import {Svg, G, Path, Text as SVGText} from 'react-native-svg';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
const {width} = Dimensions.get('window');
const height = 300;
const Circle = ({cx, cy, color}: {cx: number; cy: number; color: string}) => {
  return (
    <Path
      onPress={() => {
        console.log('${cx}, ${cy}', {cx, cy});
      }}
      fill={color}
      d={`
    M ${cx}, ${cy}
    m -5, 0
    a 5,5 0 1,0 10,0
    a 5,5 0 1,0 -10,0
    `}
    />
  );
};
const userPurchases = [
  {
    itemName: 'Mountain Dew',
    price: 23,
  },
  {
    itemName: 'Shoes',
    price: 50,
  },
  {
    itemName: 'Kit Kat',
    price: 14,
  },
  {
    itemName: 'Taxi',
    price: 24,
  },
  {
    itemName: 'Watch',
    price: 100,
  },
  {
    itemName: 'Headphones',
    price: 15,
  },
  {
    itemName: 'Wine',
    price: 16,
  },
];
interface MockDataType {
  itemName: string;
  price: number;
}
const NUM_OF_SIDES = 9,
  NUM_OF_LEVEL = 4,
  size = 350,
  offset = Math.PI,
  polyangle = (Math.PI * 2) / NUM_OF_SIDES,
  r = 0.8 * size,
  r_0 = r / 2,
  center = [size / 2, size / 2];
interface WebChartProps {
  handleScroll: (b: boolean) => void;
}
const WebChart = ({handleScroll}: WebChartProps) => {
  const scale = d3.scaleLinear().domain([0, 100]).range([0, r_0]);
  const generatePoint = ({
    length,
    angle,
  }: {
    length: number;
    angle: number;
  }): [number, number] => {
    return [
      center[0] + length * Math.sin(offset - angle),
      center[1] + length * Math.cos(offset - angle),
    ];
  };

  const sectionAngles = d3.pie<void, MockDataType>().value(d => d.price)(
    userPurchases,
  );

  const path = d3
    .arc<PieArcDatum<MockDataType>>()
    .outerRadius(120) //must be less than 1/2 the chart's height/width
    .padAngle(0.05) //defines the amount of whitespace between sections
    .innerRadius(80); //the size of the inner 'donut' whitespace

  const color = d3
    .scaleOrdinal()
    .range([
      '#2b5eac',
      '#0dadd3',
      '#ffea61',
      '#ff917e',
      '#ff3e41',
      '#ffe341',
      'blue',
      'pink',
      'purple',
    ]);

  const generateData = (length: number) => {
    const data = [];
    const min = 25;
    const max = 100;

    for (let i = 0; i < length; i++) {
      data.push({
        name: `Item:${i}`,
        value: Math.round(min + (max - min) * Math.random()),
      });
    }

    return data;
  };

  const dataset = generateData(NUM_OF_SIDES);
  const points = dataset.map((d, i) => {
    const len = scale(d.value);
    const theta = i * ((2 * Math.PI) / NUM_OF_SIDES);

    return generatePoint({length: len, angle: theta});
  });
  const dataset2 = generateData(NUM_OF_SIDES);
  const points2 = dataset2.map((d, i) => {
    const len = scale(d.value);
    const theta = i * ((2 * Math.PI) / NUM_OF_SIDES);

    return generatePoint({length: len, angle: theta});
  });
  const dataset3 = generateData(NUM_OF_SIDES);
  const points3 = dataset3.map((d, i) => {
    const len = scale(d.value);
    const theta = i * ((2 * Math.PI) / NUM_OF_SIDES);

    return generatePoint({length: len, angle: theta});
  });

  const lineGenerator = d3
    .line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveCardinalClosed.tension(0.4));

  const generateAndDrawLevels = (levelsCount: number, sideCount: number) => {
    const totalPoints = [];
    for (let level = 1; level <= levelsCount; level++) {
      let points: [number, number][] = [];
      const hyp = (level / levelsCount) * r_0;

      for (let vertex = 0; vertex < sideCount; vertex++) {
        const theta = vertex * polyangle;

        points.push(generatePoint({length: hyp, angle: theta}));
      }
      totalPoints.push(points);
    }
    return totalPoints;
  };

  const generateAndDrawLevelsPoints = generateAndDrawLevels(
    NUM_OF_LEVEL,
    NUM_OF_SIDES,
  );
  const generateAndDrawLines = (sideCount: number) => {
    const totalPoints = [];
    for (let vertex = 1; vertex <= sideCount; vertex++) {
      const theta = vertex * polyangle;
      const point = generatePoint({length: r_0, angle: theta});
      const points = [[size / 2, size / 2] as [number, number], point];
      totalPoints.push(points);
    }
    return totalPoints;
  };
  const generateAndDrawLinesPoints = generateAndDrawLines(NUM_OF_SIDES);

  const getLabelTextPoints = (
    dataset: {
      name: string;
      value: number;
    }[],
    sideCount: number,
  ) => {
    const totalPoints = [];
    for (let vertex = 0; vertex < sideCount; vertex++) {
      const angle = vertex * polyangle;
      const label = dataset[vertex].name;
      const point = generatePoint({length: 0.93 * (size / 2), angle});
      totalPoints.push({point, label});
    }
    return totalPoints;
  };

  const labelData = getLabelTextPoints(dataset, NUM_OF_SIDES);

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
          style={{backgroundColor: 'red'}}
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
          <Svg width={width} height={width}>
            <G x={width / 2} y={width / 2}>
              {sectionAngles.map((section, index) => (
                <Path
                  key={section.index}
                  d={path(section) as string}
                  stroke="yellow"
                  fill={`${color(`${index}`)}`}
                  strokeWidth={1}
                />
              ))}
            </G>
          </Svg>
        </ReactNativeZoomableView>
      </View>
      <View style={styles.zoomWrapper}>
        <ReactNativeZoomableView
          zoomEnabled={true}
          maxZoom={4}
          minZoom={1}
          zoomStep={0.25}
          initialZoom={1}
          bindToBorders={true}
          style={{backgroundColor: 'green'}}
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
          <Svg
            style={{backgroundColor: 'green'}}
            fill="#f5f5f5"
            width={400}
            height={400}>
            <G x={20} y={20} scale={1}>
              {labelData.map((ld, id) => {
                return (
                  <SVGText
                    onPress={() => {
                      console.log('pressed label id ', id);
                    }}
                    key={`label:${id}`}
                    x={ld.point[0] - 15}
                    y={ld.point[1] + 5}
                    fill="red">
                    {ld.label}
                  </SVGText>
                );
              })}
              {generateAndDrawLinesPoints.map((gadPoints, index) => (
                <Path
                  key={`gadPoints:${index}`}
                  d={lineGenerator(gadPoints as [number, number][]) as string}
                  stroke="red"
                  fill={'none'}
                  strokeLinejoin="round"
                  strokeWidth={1}
                />
              ))}
              {generateAndDrawLevelsPoints.map((glPoints, index) => (
                <Path
                  key={`glPoints:${index}`}
                  d={lineGenerator(glPoints as [number, number][]) as string}
                  stroke="red"
                  fill={'none'}
                  strokeLinejoin="round"
                  strokeWidth={1}
                />
              ))}
              <Path
                d={lineGenerator(points) as string}
                stroke="yellow"
                fill="none"
                strokeWidth={3}
              />
              <Path
                d={lineGenerator(points2) as string}
                stroke="white"
                fill="none"
                strokeWidth={3}
              />
              <Path
                d={lineGenerator(points3) as string}
                stroke="blue"
                fill="none"
                strokeWidth={3}
              />
              {points.map((p, i) => {
                return (
                  <Circle
                    key={`k1:${i}`}
                    color={'yellow'}
                    cx={p[0]}
                    cy={p[1]}
                  />
                );
              })}
              {points2.map((p, i) => {
                return (
                  <Circle key={`k2:${i}`} color={'white'} cx={p[0]} cy={p[1]} />
                );
              })}
              {points3.map((p, i) => {
                return (
                  <Circle key={`k3:${i}`} color="blue" cx={p[0]} cy={p[1]} />
                );
              })}
            </G>
          </Svg>
        </ReactNativeZoomableView>
      </View>
    </View>
  );
};

export default WebChart;

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
