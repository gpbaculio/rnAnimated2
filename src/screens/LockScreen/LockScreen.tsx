import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Svg, {Circle, G, Line, Rect} from 'react-native-svg';
import styled from 'styled-components/native';
import {useSharedValue} from '../Chrome/Animations';
import {
  getDotIndex,
  getHorizontalIntermediate,
  getIntermediateDotIndexes,
  isAlreadyInPattern,
  populateDotsCoordinate,
} from './helpers';

const {width} = Dimensions.get('window');

export const svgWidth = width - 24;

const radius = 20;

const recWidth = 50;

interface Coordinate {
  x: number;
  y: number;
}

const AnimatedLine = Animated.createAnimatedComponent(Line);

const containerDimension = 3;

const NewLockScreen = () => {
  const [pattern, setPattern] = useState<Coordinate[]>([]);

  const show = useSharedValue(false);

  const {screenCoordinates, mappedIndex} = populateDotsCoordinate(
    containerDimension,
    svgWidth,
    svgWidth,
  );
  //petterin is
  //const CORRECT_UNLOCK_PATTERN = [
  //   {x: 0, y: 0},
  //   {x: 1, y: 0},
  //   {x: 2, y: 0},
  //   {x: 1, y: 1},
  //   {x: 0, y: 2},
  //   {x: 1, y: 2},
  //   {x: 2, y: 2}
  // ];

  const activelineStart = useSharedValue<Coordinate>({x: 0, y: 0});

  const activelineEnd = useSharedValue<Coordinate>({x: 0, y: 0});

  const onGestureEvent =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onStart: e => {
        const activeDotIndex = getDotIndex(
          {
            x: e.x,
            y: e.y,
          },
          screenCoordinates,
        );
        if (activeDotIndex !== null) {
          show.value = true;
          let firstDot = mappedIndex[activeDotIndex];
          runOnJS(setPattern)([firstDot]);
        }
      },
      onActive: e => {
        const value = {
          x: e.x,
          y: e.y,
        };

        if (pattern.length > 0) {
          const p = pattern[pattern.length - 1];
          const index = mappedIndex.findIndex(
            dot =>
              (dot && dot.x) === (p && p.x) && (dot && dot.y) === (p && p.y),
          );
          const screenC = screenCoordinates[index];
          const test = getHorizontalIntermediate(
            screenC,
            {x: e.x, y: e.y},
            3,
            screenCoordinates,
          );
        }
        let matchedDotIndex = getDotIndex(value, screenCoordinates);
        let matchedDot =
          matchedDotIndex !== null && mappedIndex[matchedDotIndex];

        if (
          matchedDotIndex !== null &&
          matchedDot &&
          !isAlreadyInPattern(matchedDot, pattern)
        ) {
          // console.log('matchedDotIndex: ', matchedDotIndex);
          const activeCoordinate = screenCoordinates[matchedDotIndex];
          const newPattern = {
            x: matchedDot.x,
            y: matchedDot.y,
          };

          let intermediateDotIndexes: number[] = [];
          if (pattern.length > 0) {
            intermediateDotIndexes = getIntermediateDotIndexes(
              pattern[pattern.length - 1],
              newPattern,
              3,
            );
          }
          const patterns: Coordinate[] = [];
          const filteredIntermediateDotIndexes = intermediateDotIndexes.filter(
            index => {
              'worklet';
              return !isAlreadyInPattern(mappedIndex[index], pattern);
            },
          );
          filteredIntermediateDotIndexes.forEach(index => {
            'worklet';
            const mappedDot = mappedIndex[index];
            console.log('mappedDot: ', mappedDot);
            if (
              mappedDot &&
              typeof mappedDot.x === 'number' &&
              typeof mappedDot.y === 'number'
            ) {
              patterns.push({x: mappedDot.x, y: mappedDot.y});
            }
          });
          runOnJS(setPattern)([...pattern, ...patterns, newPattern]);
          activelineStart.value = activeCoordinate;
        }
        activelineEnd.value = value;
      },
      onEnd: () => {
        show.value = false;
      },
    });

  const animatedProps = useAnimatedProps(() => ({
    x1: activelineStart.value.x,
    y1: activelineStart.value.y,
    x2: activelineEnd.value.x,
    y2: activelineEnd.value.y,
    opacity: withTiming(show.value ? 1 : 0),
  }));

  return (
    <Container>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View>
          <SvgContainer width={svgWidth} height={svgWidth}>
            {screenCoordinates.map(({x, y}, i) => (
              <G key={`g:${i}`}>
                <Circle fill="blue" r={radius - 10} cx={x} cy={y} />
                <Rect
                  onPressIn={() => {
                    activelineStart.value = screenCoordinates[i];
                    activelineEnd.value = screenCoordinates[i];
                  }}
                  x={x - recWidth / 2}
                  y={y - recWidth / 2}
                  width={recWidth}
                  height={recWidth}
                  fill="red"
                  fillOpacity={0.4}
                />
              </G>
            ))}
            {pattern.map((startCoordinate, index) => {
              if (index === pattern.length - 1) return;

              const startIndex = mappedIndex.findIndex(
                dot =>
                  (dot && dot.x) === (startCoordinate && startCoordinate.x) &&
                  (dot && dot.y) === (startCoordinate && startCoordinate.y),
              );

              const endCoordinate = pattern[index + 1];

              const endIndex = mappedIndex.findIndex(
                dot =>
                  (dot && dot.x) === (endCoordinate && endCoordinate.x) &&
                  (dot && dot.y) === (endCoordinate && endCoordinate.y),
              );

              if (startIndex < 0 || endIndex < 0) return;

              const actualStartDot = screenCoordinates[startIndex];

              const actualEndDot = screenCoordinates[endIndex];

              return (
                <Line
                  key={`l:${index}`}
                  x1={actualStartDot.x}
                  y1={actualStartDot.y}
                  x2={actualEndDot.x}
                  y2={actualEndDot.y}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
            <AnimatedLine
              animatedProps={animatedProps}
              stroke="white"
              strokeWidth="2"
            />
          </SvgContainer>
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
};

export default NewLockScreen;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const SvgContainer = styled(Svg)`
  background-color: green;
`;
