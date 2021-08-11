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
  getIntermediateDotIndexes,
  isAlreadyInPattern,
  populateDotsCoordinate,
} from './helpers';

const {width} = Dimensions.get('window');

const svgWidth = width - 24;

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

  const activelineStart = useSharedValue<Coordinate>({x: 0, y: 0});

  const activelineEnd = useSharedValue<Coordinate>({x: 0, y: 0});

  const onGestureEvent =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onStart: e => {
        const value = {
          x: e.x,
          y: e.y,
        };
        const matchedDotIndex = getDotIndex(value, screenCoordinates);
        if (matchedDotIndex) {
          const matchedDot = screenCoordinates[matchedDotIndex];
          runOnJS(setPattern)([matchedDot]);
        }
        show.value = true;
      },
      onActive: e => {
        const value = {
          x: e.x,
          y: e.y,
        };

        const matchedDotIndex = getDotIndex(value, screenCoordinates);

        if (matchedDotIndex || typeof matchedDotIndex === 'number') {
          const matchedDot = screenCoordinates[matchedDotIndex];
          const isInPattern = isAlreadyInPattern(matchedDot, pattern);
          if (matchedDotIndex !== null && matchedDot && !isInPattern) {
            let newPattern = {
              x: matchedDot.x,
              y: matchedDot.y,
            };
            activelineStart.value = newPattern;
          }
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
            <AnimatedLine
              animatedProps={animatedProps}
              stroke={'white'}
              strokeWidth="2"
            />
            {screenCoordinates.map(({x, y}, i) => {
              return (
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
              );
            })}
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
