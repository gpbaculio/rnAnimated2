import React, {ComponentProps} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Animated, {useDerivedValue} from 'react-native-reanimated';
import {ReText} from '../../components';

import {formatDuration, radToMinutes} from '../Constants';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  row: {
    color: '#9D9EA7',
  },
  time: {
    color: 'white',
    fontSize: 24,
  },
  label: {
    fontSize: 14,
  },
});

interface LabelProps {
  theta: Animated.SharedValue<number>;
  label: string;
  icon: ComponentProps<typeof Icon>['name'];
}

const Label = ({theta, label, icon}: LabelProps) => {
  const time = useDerivedValue(() => {
    const minutes = radToMinutes(theta.value);
    return formatDuration(minutes);
  });
  return (
    <View style={styles.container}>
      <Text style={styles.row}>
        <Icon name={icon} size={16} />
        <Text style={styles.label}>{'\u00A0' + label}</Text>
      </Text>
      <ReText style={styles.time} text={time} />
    </View>
  );
};

export default Label;
