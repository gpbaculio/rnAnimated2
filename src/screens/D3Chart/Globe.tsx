import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import {feature} from 'topojson-client';
import {GeometryObject, Topology} from 'topojson-specification';
import {ExtendedFeatureCollection} from 'd3';
import * as d3 from 'd3';
import {Svg, G, Circle, Path} from 'react-native-svg';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import countries from './data/countries-110m.json';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

const COUNTRIES = feature(
  countries as unknown as Topology,
  countries.objects.countries as GeometryObject,
) as ExtendedFeatureCollection;

const {width: SVG_WIDTH, height} = Dimensions.get('window');
const SVG_HEIGHT = height / 2;
const clipAngle = 90;

const Globe = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const mapExtent = SVG_WIDTH > SVG_HEIGHT ? SVG_HEIGHT : SVG_WIDTH;

  const projection = d3
    .geoOrthographic()
    .rotate([x, -y])
    .scale(mapExtent / 2)
    .clipAngle(clipAngle)
    .translate([SVG_WIDTH / 2, mapExtent / 2]);

  const geoPath = d3.geoPath().projection(projection);

  //first should be longitude
  const coordinates = [
    [19.744822, -34.633016],
    [80.229349, 9.818078],
    [-98.862052, 37.848794],
  ];

  const centerPos = projection.invert
    ? projection.invert([SVG_WIDTH / 2, mapExtent / 2])
    : [0, 0];

  const pointers = coordinates.map(data => {
    //calculate xy position from coordinates (long,lat)
    const lang = data[0];
    const lat = data[1];
    const coordinate = projection([lang, lat]);

    const xdata = (coordinate as [number, number])[0]; //first should be longitude
    const ydata = (coordinate as [number, number])[1];

    //if marker out of circle or back side marker will hide

    const d = d3.geoDistance([lang, lat], centerPos as [number, number]);

    const opacity = d > 1.57 ? 0 : 1;

    return [xdata, ydata, opacity];
  });

  const scale = useSharedValue(1);

  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      x: number;
      y: number;
    }
  >({
    onStart: (_, ctx) => {
      ctx.x = translateX.value;
      ctx.y = translateY.value;
    },
    onActive: ({translationX, translationY}, ctx) => {
      translateX.value = ctx.x + translationX;
      translateY.value = ctx.y + translationY;
    },
  });

  useAnimatedReaction(
    () => ({x: translateX.value, y: translateY.value}),
    ({x, y}) => {
      runOnJS(setX)(x);
      runOnJS(setY)(y);
    },
    [translateX, translateY],
  );

  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    {scale: number}
  >({
    onStart: (_, ctx) => {
      ctx.scale = scale.value;
    },
    onActive: (event, ctx) => {
      scale.value = event.scale;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    },
  });

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: focalX.value},
        {translateY: focalY.value},
        {translateX: -SVG_WIDTH / 2},
        {translateY: -SVG_HEIGHT / 2},
        {scale: scale.value},
        {translateX: -focalX.value},
        {translateY: -focalY.value},
        {translateX: SVG_WIDTH / 2},
        {translateY: SVG_HEIGHT / 2},
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View>
        <PinchGestureHandler onGestureEvent={onPinchGesture}>
          <Animated.View style={style}>
            <Svg width={SVG_WIDTH} height={SVG_HEIGHT}>
              <G>
                <Circle
                  cx={SVG_WIDTH / 2}
                  cy={mapExtent / 2}
                  r={mapExtent / 2}
                  fill={'#0099FF'}
                />
                <Path
                  d={`${geoPath(COUNTRIES)}`}
                  stroke={'#666666'}
                  strokeOpacity={0.3}
                  strokeWidth={0.6}
                  fill={'#DDDDDD'}
                  opacity={1}
                />
                {pointers.map((d, i) => (
                  <Circle
                    key={`circle:${i}`}
                    cx={d[0]}
                    cy={d[1]}
                    r={6}
                    fillOpacity={0.5}
                    opacity={d[2]}
                    fill="red"
                  />
                ))}
              </G>
            </Svg>
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Globe;
