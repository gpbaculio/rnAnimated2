import React, {useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import Animated, {runOnUI, useSharedValue} from 'react-native-reanimated';
import {Button} from '../components';
import {ReText} from '../components';
import Text from '../components/Text';

const formatDatetime = (datetime: Date) => {
  'worklet';
  return datetime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const sayHello = (
  text: Animated.SharedValue<string>,
  from: string,
  cb: (str: string) => void,
) => {
  'worklet';
  text.value = `Hello from ${from} on ${Platform.OS} at ${formatDatetime(
    new Date(),
  )}`;
  cb(`Hello from ${from} on ${Platform.OS} at ${formatDatetime(new Date())}`);
};

const WorkletsAndSharedValues = () => {
  const [jsText, setJsText] = useState('');
  const text = useSharedValue('');
  return (
    <View style={styles.container}>
      <ReText text={text} />
      <Text>{jsText}</Text>
      <Button
        label="asd"
        primary
        onPress={() => runOnUI(sayHello)(text, 'UI', text => setJsText(text))}
      />
    </View>
  );
};

export default WorkletsAndSharedValues;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
});
