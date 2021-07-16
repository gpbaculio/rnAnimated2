import React, {useState} from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';

import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import * as d3 from 'd3';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import {Prices, DataPoints, SIZE} from './Model';
import Header from './Header';
import Cursor from './Cursor';
import data from './data.json';
import {parse, mixPath} from '../constants';

const {width} = Dimensions.get('window');

const values = data.data.prices as Prices;

const POINTS = 60;

const buildGraph = (datapoints: DataPoints, label: string) => {
  const priceList = datapoints.prices.slice(0, POINTS);

  const formattedValues = priceList.map(
    price => [parseFloat(price[0]), price[1]] as [number, number],
  );

  const prices = formattedValues.map(value => value[0]);

  const dates = formattedValues.map(value => value[1]);

  const scaleX = d3
    .scaleLinear()
    .domain([Math.min(...dates), Math.max(...dates)])
    .range([0, SIZE]);

  const minPrice = Math.min(...prices);

  const maxPrice = Math.max(...prices);

  const scaleY = d3.scaleLinear().domain([minPrice, maxPrice]).range([SIZE, 0]);

  return {
    label,
    minPrice,
    maxPrice,
    percentChange: datapoints.percent_change,
    path: parse(
      d3
        .line()
        .x(([, x]) => scaleX(x) as number)
        .y(([y]) => scaleY(y) as number)
        .curve(d3.curveBasis)(formattedValues) as string,
    ),
  };
};

const graphs = [
  {
    label: '1H',
    value: 0,
    data: buildGraph(values.hour, 'Last Hour'),
  },
  {
    label: '1D',
    value: 1,
    data: buildGraph(values.day, 'Today'),
  },
  {
    label: '1M',
    value: 2,
    data: buildGraph(values.month, 'Last Month'),
  },
  {
    label: '1Y',
    value: 3,
    data: buildGraph(values.year, 'This Year'),
  },
  {
    label: 'all',
    value: 4,
    data: buildGraph(values.all, 'All time'),
  },
];

const SELECTION_WIDTH = width - 32;

const BUTTON_WIDTH = (width - 32) / graphs.length;

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Graph = () => {
  const y = useSharedValue(0);

  const transition = useSharedValue(0);

  const selected = useSharedValue(0);

  const previous = useSharedValue({data: graphs[0].data});

  const current = useSharedValue({data: graphs[0].data});

  const style = useAnimatedStyle(() => ({
    transform: [{translateX: BUTTON_WIDTH * selected.value}],
  }));

  const animatedProps = useAnimatedProps(() => {
    const d = mixPath(
      transition.value,
      previous.value.data.path,
      current.value.data.path,
    );

    return {
      d,
    };
  });

  return (
    <View style={styles.container}>
      <Header data={current} y={y} />
      <View>
        <Svg width={SIZE} height={SIZE}>
          <AnimatedPath
            animatedProps={animatedProps}
            fill="transparent"
            stroke="black"
            strokeWidth={3}
          />
        </Svg>
        <Cursor data={current} y={y} />
      </View>
      <View style={styles.selection}>
        <View style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.backgroundSelection, style]} />
        </View>
        {graphs.map((graph, index) => {
          return (
            <TouchableWithoutFeedback
              key={graph.label}
              onPress={() => {
                previous.value = current.value;
                current.value = {data: graphs[index].data};
                selected.value = withTiming(index);
                transition.value = 0;
                transition.value = withTiming(1);
              }}>
              <View style={[styles.labelContainer]}>
                <Text style={styles.label}>{graph.label}</Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
};

export default Graph;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundSelection: {
    backgroundColor: '#f3f3f3',
    ...StyleSheet.absoluteFillObject,
    width: BUTTON_WIDTH,
    borderRadius: 8,
  },
  selection: {
    flexDirection: 'row',
    width: SELECTION_WIDTH,
    alignSelf: 'center',
  },
  labelContainer: {
    padding: 16,
    width: BUTTON_WIDTH,
  },
  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
