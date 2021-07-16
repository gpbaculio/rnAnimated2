import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Reactions from './Reactions';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {between} from '../constants';

const FbPostReaction = () => {
  const [hasLiked, setHasLiked] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState('thumb-up');
  const [shouldShowReactions, setShouldShowReactions] = useState(false);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      x: number;
      y: number;
    }
  >({
    onStart: e => {
      x.value = e.x;
      y.value = e.y;
    },
    onActive: e => {
      x.value = e.x;
      y.value = e.y;
    },
    onEnd: e => {
      if (between(e.x, -65, -30) && between(e.y, -48, -5)) {
        runOnJS(setCurrentEmoji)('thumb-up');
        runOnJS(setHasLiked)(true);
      } else if (between(e.x, -30.1, 15) && between(e.y, -48, -5)) {
        runOnJS(setCurrentEmoji)('heart');
        runOnJS(setHasLiked)(true);
      } else if (between(e.x, 15.1, 60) && between(e.y, -48, -5)) {
        runOnJS(setCurrentEmoji)('emoticon-angry');
        runOnJS(setHasLiked)(true);
      } else if (between(e.x, 60.1, 100) && between(e.y, -48, -5)) {
        runOnJS(setCurrentEmoji)('emoticon-lol');
        runOnJS(setHasLiked)(true);
      } else if (between(e.x, 100.1, 145) && between(e.y, -48, -5)) {
        runOnJS(setCurrentEmoji)('emoticon-cry');
        runOnJS(setHasLiked)(true);
      }
      runOnJS(setShouldShowReactions)(false);
    },
  });
  const getText = () => {
    if (currentEmoji === 'thumb-up') {
      return 'Like';
    } else if (currentEmoji === 'heart') {
      return 'Heart';
    } else if (currentEmoji === 'emoticon-angry') {
      return 'Angry';
    } else if (currentEmoji === 'emoticon-lol') {
      return 'Haha';
    } else if (currentEmoji === 'emoticon-cry') {
      return 'Sad';
    }
  };
  return (
    <Container>
      <PanGestureHandler {...{onGestureEvent}}>
        <Animated.View style={{marginTop: 'auto'}}>
          <LikeButton
            hasLiked={hasLiked}
            onPress={() => {
              if (hasLiked) {
                setCurrentEmoji('thumb-up');
              }
              setHasLiked(status => !status);
            }}
            onLongPress={() => {
              setShouldShowReactions(true);
            }}
            disabled={false}>
            {shouldShowReactions && (
              <Reactions
                setCurrentEmoji={setCurrentEmoji}
                currentX={x}
                currentY={y}
              />
            )}
            <MaterialCommunityIcons
              name={currentEmoji}
              color={hasLiked ? 'blue' : 'black'}
              size={18}
              style={styles.likeIcon}
            />
            <Text style={{color: hasLiked ? 'blue' : 'black'}}>
              {getText()}
            </Text>
          </LikeButton>
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
};

export default FbPostReaction;

const Container = styled.View`
  flex: 1;
  padding: 24px;
  align-items: center;
`;

const LikeButton = styled.Pressable<{hasLiked: boolean}>`
  ${({hasLiked}) => `border: solid ${hasLiked ? 'blue' : 'black'} 1px;`}
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
