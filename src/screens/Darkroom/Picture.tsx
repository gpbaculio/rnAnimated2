import React, {useCallback, useMemo, useRef} from 'react';
import {Dimensions, Image} from 'react-native';
import {Surface} from 'gl-react-expo';
import {Node, Shaders, GLSL} from 'gl-react';

import {Path as RePath, serialize} from '../constants';
import Animated, {runOnJS, useAnimatedReaction} from 'react-native-reanimated';
import {MATH, shaderPath} from './Constants';

const {width} = Dimensions.get('window');

const shaders = Shaders.create({
  picture: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D source;
      uniform vec2 c1[4];
      uniform vec2 c2[4];
      uniform vec2 c3[4];
      uniform vec2 c4[4];

      ${MATH}

      float f(float x) { 
        if(x <= 0.25) { 
          return cubicBezierYForX(x, c1[0], c1[1], c1[2], c1[3]);
        } else if(x <= 0.5) { 
          return cubicBezierYForX(x, c2[0], c2[1], c2[2], c2[3]);
        } else if(x <= 0.75) { 
          return cubicBezierYForX(x, c3[0], c3[1], c3[2], c3[3]);
        } else { 
          return cubicBezierYForX(x, c4[0], c4[1], c4[2], c4[3]);
        }
      }

      void main() {
        vec4 color = texture2D(source, uv);
        gl_FragColor=vec4(f(color.x), f(color.y), f(color.z), 1.0);
      }
    `,
  },
});

interface PictureProps {
  source: ReturnType<typeof require>;
  path: Animated.SharedValue<RePath>;
}

const Picture = ({path, source}: PictureProps) => {
  const node = useRef<any>(null);
  const aspectRatio = useMemo(() => {
    const dim = Image.resolveAssetSource(source);
    return dim.height / dim.width;
  }, [source]);
  const uniforms = useCallback(
    (p: RePath) => {
      return {
        source,
        ...shaderPath(p),
      };
    },
    [source],
  );
  const update = useCallback(
    (p: RePath) => {
      node.current?.setDrawProps({
        uniforms: uniforms(p),
      });
    },
    [uniforms],
  );
  useAnimatedReaction(
    () => serialize(path.value),
    () => {
      runOnJS(update)(path.value);
    },
  );
  return (
    <Surface style={{width, height: width * aspectRatio}}>
      <Node
        ref={node}
        shader={shaders.picture!}
        uniforms={uniforms(path.value)}
      />
    </Surface>
  );
};

export default Picture;
