import React from 'react';
import styled from 'styled-components/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';
import FastImage, {
  FastImageProps,
  ResizeMode,
  Priority,
  Source,
} from 'react-native-fast-image';

const likeGif = require('../../../assets/postreaction/like.gif');
const loveGif = require('../../../assets/postreaction/love.gif');
const angryGif = require('../../../assets/postreaction/angry.gif');
const hahaGif = require('../../../assets/postreaction/haha.gif');
const sadGif = require('../../../assets/postreaction/sad.gif');
interface FastImageStaticProperties {
  resizeMode: ResizeMode;
  priority: Priority;
  cacheControl: 'immutable' | 'web' | 'cacheOnly';
  preload: (sources: Source[]) => void;
}

interface ReactionsProps {
  currentX: Animated.SharedValue<number>;
  currentY: Animated.SharedValue<number>;
  setCurrentEmoji: React.Dispatch<React.SetStateAction<string>>;
}

export const between = (x: number, min: number, max: number) => {
  'worklet';
  return x >= min && x <= max;
};
const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);
const Reactions = ({currentX, currentY}: ReactionsProps) => {
  const style1 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale:
            between(currentX.value, -65, -30) &&
            between(currentY.value, -48, -5)
              ? 1.5
              : 1,
        },
      ],
    };
  });
  const style2 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale:
            between(currentX.value, -30.1, 15) &&
            between(currentY.value, -48, -5)
              ? 1.5
              : 1,
        },
      ],
    };
  });
  const style3 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale:
            between(currentX.value, 15.1, 60) &&
            between(currentY.value, -48, -5)
              ? 1.5
              : 1,
        },
      ],
    };
  });
  const style4 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale:
            between(currentX.value, 60.1, 100) &&
            between(currentY.value, -48, -5)
              ? 1.5
              : 1,
        },
      ],
    };
  });
  const style5 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale:
            between(currentX.value, 100.1, 145) &&
            between(currentY.value, -48, -5)
              ? 1.5
              : 1,
        },
      ],
    };
  });
  return (
    <Container>
      <Animated.Image style={[styles.icon, style1]} source={likeGif} />
      <Animated.Image style={[styles.icon, style2]} source={loveGif} />
      <Animated.Image style={[styles.icon, style3]} source={angryGif} />
      <Animated.Image style={[styles.icon, style4]} source={hahaGif} />
      <Animated.Image style={[styles.icon, style5]} source={sadGif} />
    </Container>
  );
};

export default Reactions;

const Container = styled.View`
  position: absolute;
  top: -50px;
  background-color: green;
  padding-vertical: 12px;
  flex-direction: row;
  border-radius: 12px;
`;

const styles = StyleSheet.create({
  icon: {
    position: 'relative',
    width: 33,
    height: 33,
    marginHorizontal: 4,
  },
});
