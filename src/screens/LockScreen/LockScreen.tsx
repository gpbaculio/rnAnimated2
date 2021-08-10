import React from 'react';
import {Dimensions} from 'react-native';
import Animated, {
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
import {getDotIndex} from './helpers';

const {width} = Dimensions.get('window');

const svgWidth = width - 24;

const radius = 20;

const c1 = {
  x: radius,
  y: radius,
};

const c2 = {
  x: (svgWidth - 5) / 2,
  y: radius,
};

const c3 = {
  x: svgWidth - radius,
  y: radius,
};

const c4 = {
  x: radius,
  y: (svgWidth - 5) / 2,
};

const c5 = {
  x: (svgWidth - 5) / 2,
  y: (svgWidth - 5) / 2,
};

const c6 = {
  x: svgWidth - radius,
  y: (svgWidth - 5) / 2,
};

const c7 = {
  x: radius,
  y: svgWidth - radius,
};

const c8 = {
  x: (svgWidth - 5) / 2,
  y: svgWidth - radius,
};

const c9 = {
  x: svgWidth - radius,
  y: svgWidth - radius,
};

const recWidth = 50;

const coordinates = [c1, c2, c3, c4, c5, c6, c7, c8, c9];

interface Coordinate {
  x: number;
  y: number;
}

const AnimatedLine = Animated.createAnimatedComponent(Line);

const NewLockScreen = () => {
  const show = useSharedValue(false);

  const activelineStart = useSharedValue<Coordinate>({x: 0, y: 0});

  const activelineEnd = useSharedValue<Coordinate>({x: 0, y: 0});

  const onGestureEvent =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onStart: () => {
        show.value = true;
      },
      onActive: e => {
        const value = {
          x: e.x,
          y: e.y,
        };

        const matchedDotIndex = getDotIndex(value, coordinates);

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
            {new Array(9).fill(0).map((_e, i) => (
              <G key={i}>
                <Rect
                  onPressIn={() => {
                    activelineStart.value = coordinates[i];
                    activelineEnd.value = coordinates[i];
                  }}
                  x={coordinates[i].x - recWidth / 2}
                  y={coordinates[i].y - recWidth / 2}
                  width={recWidth}
                  height={recWidth}
                />
                <Circle
                  fill="blue"
                  r={radius - 10}
                  cx={coordinates[i].x}
                  cy={coordinates[i].y}
                />
              </G>
            ))}
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
