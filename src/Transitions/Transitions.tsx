import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Button, cards} from '../components';
import {styleGuide} from '../constants';

import AnimatedCard from './AnimatedCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleGuide.palette.background,
    justifyContent: 'flex-end',
  },
});

const UseTransition = () => {
  const [toggled, setToggle] = useState(false);
  return (
    <View style={styles.container}>
      {cards.slice(0, 3).map((card, index) => (
        <AnimatedCard key={card} {...{index, card, toggled}} />
      ))}
      <Button
        label={toggled ? 'Reset' : 'Start'}
        primary
        onPress={() => setToggle(prev => !prev)}
      />
    </View>
  );
};

export default UseTransition;
