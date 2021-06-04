import {LinearGradient} from 'expo-linear-gradient';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

const {width} = Dimensions.get('window');

export const COLOR_WIDTH = width / 3;

const RADIUS = 45;

interface ColorProps {
  index: number;
  color: {
    id: number;
    start: string;
    end: string;
  };
}

const Color = ({index, color}: ColorProps) => {
  return (
    <View {...{style: styles.container}}>
      <LinearGradient
        {...{colors: [color.start, color.end], style: styles.gradient}}
      />
    </View>
  );
};

export default Color;

const styles = StyleSheet.create({
  container: {
    width: COLOR_WIDTH,
    alignItems: 'center',
  },
  gradient: {
    borderRadius: RADIUS,
    width: RADIUS * 2,
    height: RADIUS * 2,
    borderWidth: 6,
    borderColor: '#ffffff',
  },
});
