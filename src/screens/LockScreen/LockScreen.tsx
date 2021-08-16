import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedProps,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Svg, {Line} from 'react-native-svg';
import styled from 'styled-components/native';
import {
  getDotIndex,
  getHorizontalIntermediate,
  getIntermediateDotIndexes,
  isAlreadyInPattern,
  populateDotsCoordinate,
} from './helpers';
import NewLine from './NewLine';
import Dot from './Dot';

const {width} = Dimensions.get('window');

export const svgWidth = width - 24;

interface Coordinate {
  x: number;
  y: number;
  isIntermediate?: boolean;
}

export const AnimatedLine = Animated.createAnimatedComponent(Line);

const containerDimension = 3;

const correctPattern = [
  {x: 0, y: 0},
  {x: 1, y: 0},
  {x: 2, y: 0},
  {x: 1, y: 1},
  {x: 0, y: 2},
  {x: 1, y: 2},
  {x: 2, y: 2},
];

const NewLockScreen = () => {
  const [pattern, setPattern] = useState<Coordinate[]>([]);
  const [error, setError] = useState(false);
  const show = useSharedValue(false);

  const {screenCoordinates, mappedIndex} = populateDotsCoordinate(
    containerDimension,
    svgWidth,
    svgWidth,
  );
  const focusX = useSharedValue(0);
  const focusY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const activelineStart = useSharedValue<Coordinate>({x: 0, y: 0});

  const activelineEnd = useSharedValue<Coordinate>({x: 0, y: 0});

  const isPatternMatched = (currentPattern: Coordinate[]) => {
    'worklet';
    if (currentPattern.length !== correctPattern.length) return false;
    let matched = true;
    for (let index = 0; index < currentPattern.length; index++) {
      let correctDot = correctPattern[index];
      let currentDot = currentPattern[index];
      if (correctDot.x !== currentDot.x || correctDot.y !== currentDot.y) {
        matched = false;
        break;
      }
    }
    return matched;
  };

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
        focusX.value = e.x;
        focusY.value = e.y;
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
        const matchedDotIndex = getDotIndex(value, screenCoordinates);
        const matchedDot =
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
            if (
              mappedDot &&
              typeof mappedDot.x === 'number' &&
              typeof mappedDot.y === 'number'
            ) {
              patterns.push({
                x: mappedDot.x,
                y: mappedDot.y,
                isIntermediate: true,
              });
            }
          });
          runOnJS(setPattern)([...pattern, ...patterns, newPattern]);
          activelineStart.value = activeCoordinate;

          startX.value = focusX.value;
          startX.value = withTiming(activeCoordinate.x, {duration: 350});

          startY.value = focusY.value;
          startY.value = withTiming(activeCoordinate.y, {duration: 350});
        }
        activelineEnd.value = value;
      },
      onEnd: () => {
        show.value = false;
        if (pattern.length) {
          if (isPatternMatched(pattern)) {
            runOnJS(setError)(false);
            console.log('pattern success');
          } else {
            runOnJS(setError)(true);
          }
        }
      },
    });

  const animatedProps = useAnimatedProps(() => ({
    x1: startX.value,
    y1: startY.value,
    x2: activelineEnd.value.x,
    y2: activelineEnd.value.y,
    opacity: show.value ? 1 : 0,
  }));

  return (
    <Container>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View>
          <SvgContainer width={svgWidth} height={svgWidth}>
            {pattern.map((startCoordinate, index) => {
              if (
                (startCoordinate && startCoordinate.isIntermediate) ||
                index === pattern.length - 1
              )
                return null;

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

              //const actualEndDot = screenCoordinates[endIndex];

              const endCoordinates = pattern[pattern.length - 1];

              const endCoordinatesIndex = mappedIndex.findIndex(
                dot =>
                  (dot && dot.x) === (endCoordinates && endCoordinates.x) &&
                  (dot && dot.y) === (endCoordinates && endCoordinates.y),
              );

              const actualEndDots = screenCoordinates[endCoordinatesIndex];

              return (
                <NewLine
                  key={`n:${index}`}
                  error={error}
                  focusX={focusX}
                  focusY={focusY}
                  start={actualStartDot}
                  end={actualEndDots}
                />
              );
            })}
            {screenCoordinates.map(({x, y}, i) => (
              <Dot
                mappedIndex={mappedIndex}
                pattern={pattern}
                index={i}
                error={error}
                key={`dot:${i}`}
                coordinates={{x, y}}
                screenCoordinates={screenCoordinates}
                startX={startX}
                startY={startY}
                activelineStart={activelineStart}
                activelineEnd={activelineEnd}
              />
            ))}
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
  background-color: rgba(0, 0, 0, 0.5);
`;
