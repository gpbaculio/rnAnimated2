import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import Svg, {Path, G, Text as RNSVGText, TSpan} from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withDecay,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import color from 'randomcolor';
import {StyleSheet} from 'react-native';
const {width} = Dimensions.get('screen');
const oneTurn = 360;
const numberOfSegments = 10;
const wheelSize = width * 0.9;
const fontSize = 26;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;
const colors = color({
  luminosity: 'random',
  count: numberOfSegments,
});

const pinSvgD =
  'M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z';

const data = Array.from({length: numberOfSegments}).fill(1);
const makeWheel = () => {
  const pie = d3Shape.pie()(data as number[]);
  return pie.map((a, i) => {
    const arc = d3Shape
      .arc<d3Shape.PieArcDatum<number | {valueOf(): number}>>()
      .padAngle(0.01)
      .outerRadius(width / 2)
      .innerRadius(20);
    return {
      path: arc(a),
      color: colors[i],
      value: Math.round(Math.random() * 10 + 1) * 200,
      centroid: arc.centroid(a),
    };
  });
};

const paths = makeWheel();

var snap = (a: number) => {
  'worklet';
  return (b: number) => {
    'worklet';
    return Math.round(b / a) * a;
  };
};

const getSnapValue = (angle: number) => {
  'worklet';
  const a = angle % oneTurn;
  const snapTo = snap(oneTurn / numberOfSegments);
  return snapTo(a);
};

const getWinnerIndex = (a: number) => {
  'worklet';
  const deg = Math.abs(Math.round(a % oneTurn));
  return Math.floor(deg / angleBySegment);
};

const WheelOfFortune = () => {
  const angle = useSharedValue(0);
  const [enabled, setEnabled] = useState(true);
  const isVelocityDirectionLeft = useSharedValue(true);
  const style3 = useAnimatedStyle(() => {
    const rotate = interpolate(
      Math.round(
        Math.abs(
          (Math.abs(angle.value - (angleOffset % oneTurn)) / angleBySegment) %
            1,
        ),
      ),
      [-1, 0, 1],
      [0, isVelocityDirectionLeft.value ? 35 : -35, 0],
    );
    return {
      transform: [
        {
          rotate: `${rotate}deg`,
        },
      ],
    };
  });
  const renderKnob = () => {
    const kSize = 30;

    return (
      <Animated.View
        style={[
          style3,
          {
            zIndex: 1,
          },
        ]}>
        <Svg
          fill="green"
          width={kSize}
          height={(kSize * 100) / 57}
          viewBox="0 0 57 100"
          style={{transform: [{translateY: 8}]}}>
          <Path d={pinSvgD} />
        </Svg>
      </Animated.View>
    );
  };

  const onGestureEvent = useAnimatedGestureHandler(
    {
      onStart: () => {
        if (!enabled) return;
      },
      onActive: ({velocityY}) => {
        if (!enabled) return;
        runOnJS(setEnabled)(false);
        console.log('velocityY: ', velocityY);
        isVelocityDirectionLeft.value = velocityY < 0 ? true : false;
        angle.value = withDecay(
          {velocity: velocityY * 2.5, deceleration: 0.999},
          isFinished => {
            if (isFinished) {
              angle.value = getSnapValue(angle.value);
              angle.value = withTiming(angle.value, {duration: 5000});
              const winnerIndex = getWinnerIndex(angle.value);
              const winner = paths[winnerIndex].value;
              console.log('winner = ', winner);

              runOnJS(setEnabled)(true);
            }
          },
        );
      },
    },

    [enabled, setEnabled],
  );

  const style = useAnimatedStyle(() => {
    const rotate = interpolate(
      angle.value,
      [-oneTurn, 0, oneTurn],
      [-oneTurn, 0, oneTurn],
    );

    return {
      transform: [
        {
          rotate: `${rotate}deg`,
        },
      ],
    };
  });
  return (
    <PanGestureHandler enabled={enabled} onGestureEvent={onGestureEvent}>
      <Animated.View style={styles.container}>
        {renderKnob()}
        <Animated.View style={style}>
          <Svg
            width={wheelSize}
            height={wheelSize}
            viewBox={`0 0 ${width} ${width}`}
            style={{
              transform: [{rotate: `-${angleOffset}deg`}],
            }}>
            <G x={width / 2} y={width / 2}>
              {paths.map((a, i) => {
                const [x, y] = a.centroid;
                const n = a.value.toString();
                return (
                  <G key={`a:${i}`}>
                    <Path d={a.path as string} fill={a.color} />
                    <G
                      rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                      origin={`${x}, ${y}`}>
                      <RNSVGText
                        fontSize={26}
                        x={x}
                        y={y - 50}
                        fill="white"
                        textAnchor="middle">
                        {Array.from({length: n.length}).map((_, j) => {
                          return (
                            <TSpan x={x} dy={fontSize} key={`a:${i}:${j}`}>
                              {n.charAt(j)}
                            </TSpan>
                          );
                        })}
                      </RNSVGText>
                    </G>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default WheelOfFortune;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
