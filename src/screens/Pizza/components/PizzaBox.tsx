import React, {useRef} from 'react';
import {Image, StyleSheet} from 'react-native';
import {Canvas, useFrame} from 'react-three-fiber';
import {Group, Vector3} from 'three';
import {pivotMatrix, useModel} from '../constants';
const SIZE = new Vector3(263.2, 29.606, 257.882);
const TOTAL_FRAMES = 30;
interface BoxProps {
  object: Group;
  animation?: {from: number; to: number; active: boolean};
}

const Box = ({object, animation}: BoxProps) => {
  const primitiveRef = useRef<any>(null);

  const init = useRef(false);

  const frames = useRef(0);

  useFrame(() => {
    if (
      primitiveRef &&
      primitiveRef.current &&
      primitiveRef.current.applyMatrix4
    ) {
      if (!animation || frames.current > TOTAL_FRAMES) {
        return;
      }
      const {from, to, active} = animation;
      if (!init.current) {
        const m = pivotMatrix(SIZE.z / 2, from);
        primitiveRef.current.applyMatrix4(m);
        init.current = true;
      }
      if (!active) return;
      frames.current += 1;
      const delta = (to - from) / TOTAL_FRAMES;
      const m = pivotMatrix(SIZE.z / 2, delta);
      primitiveRef.current.applyMatrix4(m);
    }
  });

  return (
    <primitive
      {...{ref: primitiveRef, object, rotation: [-Math.PI / 6, 0, 0]}}
    />
  );
};
interface PizzaBoxProps {
  active: boolean;
}
const PizzaBox = ({active}: PizzaBoxProps) => {
  const {uri: topUri} = Image.resolveAssetSource(
    require('../assets/Pizza_Box_Top3.gltf'),
  );

  const {uri: bottomUri} = Image.resolveAssetSource(
    require('../assets/Pizza_Box_Bottom3.gltf'),
  );

  const top = useModel(topUri);

  const bottom = useModel(bottomUri);

  if (top && bottom)
    return (
      <Canvas style={styles.container} camera={{position: [0, 0, -300]}}>
        <directionalLight position={[0, 0, -300]} />
        <Box
          {...{object: top, animation: {from: Math.PI / 4, to: 0, active}}}
        />
        <Box object={bottom} />
      </Canvas>
    );
  else return null;
};

export default PizzaBox;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
