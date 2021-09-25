import React from 'react';
import {Dimensions, StyleSheet, Animated, View, Text} from 'react-native';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import {Svg, G, Path, Circle, Text as SVGText} from 'react-native-svg';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {GeometryObject, Topology} from 'topojson-specification';
import {ExtendedFeatureCollection} from 'd3';

import us from './data/counties-albers-10m.json';

import population from './data/population.json';
import {useRef} from 'react';

const {width} = Dimensions.get('window');
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
interface CountiesProps {
  handleScroll: (b: boolean) => void;
}
const Counties = ({handleScroll}: CountiesProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePinch = Animated.event([{nativeEvent: {scale}}], {
    useNativeDriver: true,
  });
  const path = d3.geoPath();

  const mapData = topojson.feature(
    us as unknown as Topology,
    us.objects.nation as GeometryObject,
  ) as ExtendedFeatureCollection;

  const mapDataBorders = topojson.mesh(
    us as unknown as Topology,
    us.objects.states as GeometryObject,
    (a, b) => a !== b,
  );

  const features = new Map(
    (
      topojson.feature(
        us as unknown as Topology,
        us.objects.counties as GeometryObject,
      ) as ExtendedFeatureCollection
    ).features.map(d => [d.id, d]),
  );

  const data = population.slice(1).map(([population, state, county]) => {
    const id = state + county;
    const feature = features.get(id);
    return {
      id,
      position: feature && path.centroid(feature),
      title: feature && feature.properties!.name,
      value: +population,
    };
  });

  const radius = d3.scaleSqrt(
    [0, d3.max(data, d => d.value) as number],
    [8, 40],
  );

  const scaleText = d3.scaleSqrt(
    [0, d3.max(data, d => d.value) as number],
    [6, 14],
  );

  const sortedData = data
    .filter(d => d.position)
    .sort((a, b) => d3.descending(a.value, b.value));

  return (
    <View style={styles.container}>
      <View style={styles.zoomWrapper}>
        <ReactNativeZoomableView
          zoomEnabled={true}
          maxZoom={1.5}
          minZoom={1}
          zoomStep={0.25}
          initialZoom={1}
          bindToBorders={true}
          style={styles.zoomableView}>
          <Svg width={width} height={width}>
            <G scale={0.385} translateX={18} translateY={(width * 0.33) / 2}>
              <Path d={path(mapData) as string} stroke="blue" fill="green" />
              <Path
                d={path(mapDataBorders) as string}
                stroke="blue"
                fill="none"
              />
              {sortedData.map((d, index) => {
                return (
                  <Circle
                    key={`circle:${index}`}
                    r={radius(d.value)}
                    transform={`translate(${d.position})`}
                    fillOpacity={0.4}
                    stroke={'white'}
                  />
                );
              })}
              {sortedData.map((d, index) => {
                return (
                  <SVGText
                    key={`label:${index}`}
                    textAnchor="middle"
                    fontSize={`${scaleText(d.value)}px`}
                    alignmentBaseline="middle"
                    x={(d.position as [number, number])[0]}
                    y={(d.position as [number, number])[1]}
                    fill="red">
                    {d.value}
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
    backgroundColor: 'yellow',
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
