import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Value, withSpring, withTiming} from 'react-native-reanimated';
import Screen from './Screen';
import Profile from './Profile';
import {useSharedValue} from '../Chrome/Animations';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
});

export default () => {
  const progress = useSharedValue(0);
  return (
    <View style={styles.container}>
      <Screen
        onPress={() => {
          progress.value = withSpring(1);
        }}
        {...{progress}}
      />
      <View style={styles.layer} pointerEvents="box-none">
        <Profile
          {...{
            progress,
            onPress: () => {
              progress.value = withSpring(0);
            },
          }}
        />
      </View>
    </View>
  );
};
