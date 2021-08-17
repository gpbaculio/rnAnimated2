import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
import {alpha, perspective} from './Constants';

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F6F5F9',
  },
  button: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});

interface ScreenProps {
  onPress: () => void;
  progress: Animated.SharedValue<number>;
}

export default ({progress, onPress}: ScreenProps) => {
  const style = useAnimatedStyle(() => {
    const rotateY = interpolate(progress.value, [0, 1], [0, -alpha]);
    const scale = interpolate(progress.value, [0, 1], [1, 0.9]);
    const borderRadius = interpolate(progress.value, [0, 1], [0, 20]);
    return {
      borderRadius,
      transform: [
        {perspective: 1000},
        {translateX: width / 2},
        {rotateY: `${rotateY}rad`},
        {translateX: -width / 2},
        {scale},
      ],
    };
  });
  const style2 = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0, 0.5]);
    return {
      opacity,
    };
  });
  return (
    <>
      <Animated.View style={[styles.container, style]}>
        <TouchableOpacity {...{onPress}}>
          <View style={styles.button}>
            <Text style={styles.label}>Show Menu</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'black',
          },
          style2,
        ]}
      />
    </>
  );
};
