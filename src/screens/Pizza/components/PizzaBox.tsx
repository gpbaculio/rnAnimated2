import React from 'react';
import {View, Image} from 'react-native';
import {useModel} from '../constants';
const topGltf = require('../assets/Pizza_Box_Top3.gltf');
const bottomGltf = require('../assets/Pizza_Box_Bottom3.gltf');

const PizzaBox = () => {
  const {uri: topUri} = Image.resolveAssetSource(topGltf);
  const {uri: bottomUri} = Image.resolveAssetSource(bottomGltf);
  const top = useModel(topUri);
  const bottom = useModel(bottomUri);
  return null;
};

export default PizzaBox;
