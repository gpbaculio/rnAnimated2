import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {Button, cards} from '../components';
import {styleGuide} from '../constants';

import AnimatedCard from './AnimatedCard';

const UseTransition = () => {
  const [btnLabel, setBtnLabel] = useState('Start');

  const toggled = useSharedValue(0);

  const transition = useDerivedValue(() => {
    return withSpring(toggled.value);
  });

  return (
    <View style={styles.container}>
      {cards.slice(0, 3).map((card, index) => (
        <AnimatedCard key={card} {...{index, card, transition}} />
      ))}
      <Button
        label={btnLabel}
        primary
        onPress={() => {
          toggled.value = toggled.value ? 0 : 1;
          setBtnLabel(btnLabel === 'Start' ? 'Reset' : 'Start');
        }}
      />
    </View>
  );
};

export default UseTransition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleGuide.palette.background,
    justifyContent: 'flex-end',
  },
});
