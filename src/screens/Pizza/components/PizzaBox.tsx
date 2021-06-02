import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Canvas } from 'react-three-fiber';
import { Group } from 'three';
import { useModel } from '../constants';
const topGltf = require('../assets/Pizza_Box_Top3.gltf');
const bottomGltf = require('../assets/Pizza_Box_Bottom3.gltf');

interface BoxProps {
  object: Group
}

const Box = ({ object }: BoxProps) => {
  return <primitive {...{ object }} />
}

const PizzaBox = () => {
  const { uri: topUri } = Image.resolveAssetSource(topGltf);

  const { uri: bottomUri } = Image.resolveAssetSource(bottomGltf);

  const top = useModel(topUri);

  const bottom = useModel(bottomUri);

  if (!top || !bottom) return null

  return (
    <Canvas style={styles.container}>
      <Box object={top} />
      <Box object={bottom} />
    </Canvas>
  );
};

export default PizzaBox;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  }
})
