import {MotiView} from '@motify/components';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Easing} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
const color = '#6e01ef';
const size = 100;
const PhoneWave = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.dot, styles.center]}>
        {[...Array(3).keys()].map(index => {
          return (
            <MotiView
              from={{opacity: 0.7, scale: 1}}
              animate={{opacity: 0, scale: 4}}
              transition={{
                type: 'timing',
                duration: 2000,
                easing: Easing.out(Easing.ease),
                loop: true,
                repeatReverse: false,
                delay: index * 400,
              }}
              key={index}
              style={[StyleSheet.absoluteFillObject, styles.dot]}
            />
          );
        })}
        <Feather name="phone-outgoing" size={32} color={'#fff'} />
      </View>
    </View>
  );
};

export default PhoneWave;
const styles = StyleSheet.create({
  dot: {
    width: size,
    height: size,
    borderRadius: size,
    backgroundColor: color,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
