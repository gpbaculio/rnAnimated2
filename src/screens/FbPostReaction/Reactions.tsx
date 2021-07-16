import React from 'react';
import styled from 'styled-components/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';

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
      <AnimatedIcon
        style={[styles.icon, style1]}
        name="thumb-up"
        color="blue"
        size={18}
      />
      <AnimatedIcon
        style={[styles.icon, style2]}
        name="heart"
        color="blue"
        size={18}
      />
      <AnimatedIcon
        style={[styles.icon, style3]}
        name="emoticon-angry"
        color="blue"
        size={18}
      />
      <AnimatedIcon
        style={[styles.icon, style4]}
        name="emoticon-lol"
        color="blue"
        size={18}
      />
      <AnimatedIcon
        style={[styles.icon, style5]}
        name="emoticon-cry"
        color="blue"
        size={18}
      />
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
    marginHorizontal: 12,
    backgroundColor: 'red',
    transform: [{scale: 1.8}],
  },
});
