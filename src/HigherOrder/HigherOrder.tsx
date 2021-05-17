import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  withTiming,
  withRepeat,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';

import {Button} from '../components';
import {styleGuide} from '../constants';
import ChatBubble from './ChatBubble';
import {withPause} from './constants';

const easing = Easing.inOut(Easing.ease);

const Timing = () => {
  const [play, setPlay] = useState(false);

  const paused = useSharedValue(!play);

  const progress = useSharedValue<null | number>(null);

  return (
    <View style={styles.container}>
      <ChatBubble progress={progress} />
      <Button
        label={play ? 'Pause' : 'Play'}
        primary
        onPress={() => {
          setPlay(prev => !prev);
          paused.value = !paused.value;
          if (progress.value === null) {
            progress.value = withPause(
              withRepeat(withTiming(1, {duration: 1000, easing}), -1, true),
              paused,
            );
          }
        }}
      />
    </View>
  );
};

export default Timing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: styleGuide.palette.background,
  },
});
