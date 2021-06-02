import {useEffect, useState} from 'react';
import {Group} from 'three';
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
