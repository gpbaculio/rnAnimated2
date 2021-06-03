import {useEffect, useState} from 'react';
import {Group, Matrix4, Quaternion, Vector3} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {decode, encode} from 'base-64';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

export const useModel = (model: ReturnType<typeof require>) => {
  const [gltfScene, setGltfScene] = useState<Group | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(model, gltf => {
      setGltfScene(gltf.scene);
    });
  }, [model]);

  return gltfScene;
};

export const pivotMatrix = (z: number, angle: number) => {
  const quaternion = new Quaternion();
  quaternion.setFromAxisAngle(new Vector3(1, 0, 0), angle);
  const m = new Matrix4();
  m.compose(new Vector3(0, 0, 0), quaternion, new Vector3(1, 1, 1));
  const pivot = new Vector3(0, 0, z);
  const px = pivot.x,
    py = pivot.y,
    pz = pivot.z;
  const te = m.elements;
  te[12] += px - te[0] * px - te[4] * py - te[8] * pz;
  te[13] += py - te[1] * px - te[5] * py - te[9] * pz;
  te[14] += pz - te[2] * px - te[6] * py - te[10] * pz;
  return m;
};
