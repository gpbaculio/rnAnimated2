import React from 'react';
import {View, Text} from 'react-native';
import {useModel} from '../constants';

const PizzaBox = () => {
  const top = useModel(require('../assets/Pizza_Box_Top3.gltf'));
  const bottom = useModel(require('../assets/Pizza_Box_Bottom3.gltf'));
  return null;
};

export default PizzaBox;
