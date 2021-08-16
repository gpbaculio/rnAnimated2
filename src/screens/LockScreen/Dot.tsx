import React, {useEffect} from 'react';
import Animated, {
  useAnimatedProps,
  withTiming,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import {G, Rect, Circle} from 'react-native-svg';

export const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const recWidth = 50;

interface DotProps {
  index: number;
  coordinates: {
    x: number;
    y: number;
  };
  startX: Animated.SharedValue<number>;
  startY: Animated.SharedValue<number>;
  activelineStart: Animated.SharedValue<{x: number; y: number}>;
  activelineEnd: Animated.SharedValue<{x: number; y: number}>;
  screenCoordinates: {
    x: number;
    y: number;
  }[];
  pattern: {
    x: number;
    y: number;
  }[];
  mappedIndex: {
    x: number;
    y: number;
  }[];
  error: boolean;
}

const Dot = ({
  coordinates: {x, y},
  startX,
  startY,
  activelineStart,
  activelineEnd,
  screenCoordinates,
  index,
  pattern,
  mappedIndex,
  error,
}: DotProps) => {
  const progress = useSharedValue(0);

  const activeCoordinates = pattern.map(p => {
    const i = mappedIndex.findIndex(
      dot => (dot && dot.x) === (p && p.x) && (dot && dot.y) === (p && p.y),
    );
    return screenCoordinates[i];
  });

  const isActive = activeCoordinates.some(p => p.x === x && p.y === y);

  useEffect(() => {
    if (error && isActive) {
      progress.value = withTiming(1, {
        duration: 1500,
      });
    }
  }, [error, isActive]);

  useEffect(() => {
    if (isActive && !error) {
      progress.value = withTiming(1, {}, () => {
        progress.value = 0;
      });
    }
  }, [isActive, error]);

  const props = useAnimatedProps(() => {
    const getFillOpacity = () => {
      if (error && isActive) {
        return interpolate(progress.value, [0, 0.3, 0.6, 1], [0, 1, 0, 1]);
      } else if (isActive && !error) {
        return withTiming(1);
      } else return 0.5;
    };
    return {
      fillOpacity: getFillOpacity(),
      r: withTiming(isActive ? 9 : 7),
    };
  });

  const bgCircleProps = useAnimatedProps(() => {
    return {
      fillOpacity:
        error || !isActive ? 0 : interpolate(progress.value, [0, 1], [0.5, 0]),
      r: withTiming(isActive && !error ? 12 : 7),
    };
  });

  const fadingBgCircleProps = useAnimatedProps(() => {
    return {
      fillOpacity:
        error || !isActive ? 0 : interpolate(progress.value, [0, 1], [0.5, 0]),
      r: interpolate(progress.value, [0, 1], [7, 20]),
    };
  });

  return (
    <G>
      <AnimatedCircle
        animatedProps={fadingBgCircleProps}
        fill="white"
        cx={x}
        cy={y}
      />
      <AnimatedCircle
        animatedProps={props}
        fill={error && isActive ? 'red' : 'white'}
        cx={x}
        cy={y}
      />
      <AnimatedCircle
        animatedProps={bgCircleProps}
        fill="white"
        cx={x}
        cy={y}
      />
      <Rect
        onPressIn={() => {
          startX.value = screenCoordinates[index].x;
          startY.value = screenCoordinates[index].y;
          activelineStart.value = screenCoordinates[index];
          activelineEnd.value = screenCoordinates[index];
        }}
        x={x - recWidth / 2}
        y={y - recWidth / 2}
        width={recWidth}
        height={recWidth}
        fill="none"
        fillOpacity={0.4}
      />
    </G>
  );
};

export default Dot;
