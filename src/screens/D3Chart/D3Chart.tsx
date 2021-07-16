import React from 'react';
import {View, Text} from 'react-native';
import {Surface, Group, Shape} from '@react-native-community/art';
import styled from 'styled-components/native';
import * as d3 from 'd3';
import {PieArcDatum} from 'd3';

const width = 300;
const height = 300;
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
  size = 300,
  offset = Math.PI,
  polyangle = (Math.PI * 2) / NUM_OF_SIDES,
  r = 0.8 * size,
  r_0 = r / 2,
  center = [size / 2, size / 2];
const D3Chart = () => {
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
    .outerRadius(100) //must be less than 1/2 the chart's height/width
    .padAngle(0.05) //defines the amount of whitespace between sections
    .innerRadius(60); //the size of the inner 'donut' whitespace

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
        name: 'Label',
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
  return (
    <Container>
      <Surface style={{backgroundColor: 'red'}} width={width} height={height}>
        <Group x={width / 2} y={height / 2}>
          {sectionAngles.map((section, index) => (
            <Shape
              key={section.index}
              d={path(section) as string}
              stroke="#000"
              fill={`${color(`${index}`)}`}
              strokeWidth={1}
            />
          ))}
        </Group>
      </Surface>
      <Surface
        style={{
          backgroundColor: 'green',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        width={390}
        height={390}>
        {generateAndDrawLinesPoints.map((gadPoints, index) => (
          <Group key={`gadPoints:${index}`} x={50} y={50}>
            <Shape
              d={lineGenerator(gadPoints as [number, number][]) as string}
              stroke="black"
              strokeJoin="round"
              strokeWidth={1}
            />
          </Group>
        ))}
        {generateAndDrawLevelsPoints.map((glPoints, index) => (
          <Group key={`glPoints:${index}`} x={50} y={50}>
            <Shape
              d={lineGenerator(glPoints as [number, number][]) as string}
              stroke="red"
              strokeJoin="round"
              strokeWidth={1}
            />
          </Group>
        ))}
        <Group x={50} y={50}>
          <Shape
            d={lineGenerator(points) as string}
            stroke="yellow"
            strokeWidth={1}
          />
        </Group>
        <Group x={50} y={50}>
          <Shape
            d={lineGenerator(points2) as string}
            stroke="blue"
            strokeWidth={1}
          />
        </Group>
        <Group x={50} y={50}>
          <Shape
            d={lineGenerator(points3) as string}
            stroke="white"
            strokeWidth={1}
          />
        </Group>
      </Surface>
    </Container>
  );
};

export default D3Chart;

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;
