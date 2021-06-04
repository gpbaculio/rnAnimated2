import {NavigationProp, RouteProp} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Dimensions, View, Image} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {Video} from 'expo-av';

import {SnapchatRoutes} from './Model';
import {SharedElement} from 'react-navigation-shared-element';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useSharedValue} from '../Chrome/Animations';
import {snapPoint} from '../constants';

interface StoryProps {
  navigation: NavigationProp<SnapchatRoutes, 'Story'>;
  route: RouteProp<SnapchatRoutes, 'Story'>;
}

const {height} = Dimensions.get('window');

const AnimatedVideo = Animated.createAnimatedComponent(Video);

const Story = ({route, navigation}: StoryProps) => {
  const {story} = route.params;

  const isGestureActive = useSharedValue(false);

  const translateX = useSharedValue(0);

  const translateY = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: () => {
      isGestureActive.value = true;
    },
    onActive: ({translationX, translationY}) => {
      translateX.value = translationX;
      translateY.value = translationY;
    },
    onEnd: ({velocityX, velocityY}) => {
      const shouldGoBack =
        snapPoint(translateY.value, velocityY, [0, height]) === height;
      if (shouldGoBack) {
        runOnJS(navigation.goBack)();
      } else {
        translateX.value = withSpring(0, {velocity: velocityX});
        translateY.value = withSpring(0, {velocity: velocityY});
      }

      isGestureActive.value = false;
    },
  });

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    return {
      borderRadius: withTiming(isGestureActive.value ? 24 : 0),
    };
  });

  return (
    <PanGestureHandler {...{onGestureEvent}}>
      <Animated.View style={[styles.container, style]}>
        <SharedElement {...{id: story.id, style: styles.container}}>
          {!story.video && (
            <Animated.Image
              source={story.source}
              style={[borderStyle, styles.image]}
            />
          )}
          {story.video && (
            <AnimatedVideo
              source={story.video}
              rate={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              isLooping
              style={[StyleSheet.absoluteFill, borderStyle]}
            />
          )}
        </SharedElement>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Story;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
});
