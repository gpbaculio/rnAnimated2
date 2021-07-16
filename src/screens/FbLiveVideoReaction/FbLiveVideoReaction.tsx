import React, {useEffect, useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  runOnJS,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {Dimensions} from 'react-native';
import AnimatedEmoji from './AnimatedEmoji';

const {width} = Dimensions.get('window');
export const PADDING = 24;

export const getRandXFromContainer = () =>
  Math.random() * (width - PADDING * 2);

const FbLiveVideoReaction = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [currentX, setCurrentX] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (shouldAnimate) {
      progress.value = withDelay(
        Math.random() * 200,
        withTiming(1, {duration: 5000}, () => {
          runOnJS(setShouldAnimate)(false);
          progress.value = 0;
        }),
      );
    }
  }, [shouldAnimate]);

  const onPress = () => {
    const x = getRandXFromContainer();
    setCurrentX(x);
    setShouldAnimate(true);
  };

  return (
    <>
      <AnimatedEmoji
        {...{
          progress,
          x: currentX,
        }}
      />
      <Container>
        <LikeButton {...{onPress, disabled: shouldAnimate}}>
          <FontAwesome
            name="thumbs-up"
            color="blue"
            size={18}
            style={styles.likeIcon}
          />
          <Text>Like</Text>
        </LikeButton>
      </Container>
    </>
  );
};

export default FbLiveVideoReaction;

const Container = styled.View`
  padding: ${PADDING}px;
  align-items: center;
  flex: 1;
`;

const LikeButton = styled.Pressable<{disabled: boolean}>`
  ${({disabled}) => `opacity: ${disabled ? 0.5 : 1};`}
  border: solid blue 1px;
  padding: 8px 12px;
  align-items: center;
  margin-top: auto;
  margin-bottom: 12px;
  flex-direction: row;
  justify-content: center;
`;

const styles = StyleSheet.create({
  likeIcon: {
    marginRight: 8,
  },
});
