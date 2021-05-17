import Animated from 'react-native-reanimated';
import {clamp} from './PanGesture';

declare let _WORKLET: boolean;
export interface AnimationState {
  current: number;
}

interface PhysicsAnimationState extends AnimationState {
  velocity: number;
}

export type Animation<
  State extends AnimationState = AnimationState,
  PrevState extends AnimationState = AnimationState,
> = {
  animation: (animation: State, now: number) => boolean;
  start: (
    animation: State,
    value: number,
    now: number,
    lastAnimation: PrevState,
  ) => void;
} & State;

export type AnimationParameter<State extends AnimationState = AnimationState> =
  | Animation<State>
  | (() => Animation<State>)
  | number;

/**
 *    @summary Access animations passed as parameters safely on both the UI and JS thread with the proper static types.
 *  Animations can receive other animations as parameter.
 */
export const animationParameter = <
  State extends AnimationState = AnimationState,
>(
  animationParam: AnimationParameter<State>,
) => {
  'worklet';
  if (typeof animationParam === 'number') {
    throw new Error('Expected Animation as parameter');
  }
  return typeof animationParam === 'function'
    ? animationParam()
    : animationParam;
};
/**
 *  @summary Declare custom animations that can be invoked on both the JS and UI thread.
 *  @example
 *  defineAnimation(() => {
      "worklet";
      // ...animation code
      return {
        animation,
       start
      }
    });
 * @worklet
 */
export const defineAnimation = <
  S extends AnimationState = AnimationState,
  Prev extends AnimationState = AnimationState,
>(
  factory: () => Omit<Animation<S, Prev>, keyof S>,
) => {
  'worklet';
  if (_WORKLET) {
    return factory() as unknown as number;
  }
  return factory as unknown as number;
};

interface DecayAnimationState extends PhysicsAnimationState {
  lastTimestamp: number;
}
export const VELOCITY_EPS = 5;
export const deceleration = 0.997;
export const withDecay = (initialVelocity: number) => {
  'worklet';
  return defineAnimation<DecayAnimationState>(() => {
    'worklet';
    const animation = (state: DecayAnimationState, now: number) => {
      const {velocity, lastTimestamp, current} = state;
      const dt = now - lastTimestamp;
      const v0 = velocity / 1000;
      const kv = Math.pow(deceleration, dt);
      const v = v0 * kv * 1000;
      const x = current + (v0 * (deceleration * (1 - kv))) / (1 - deceleration);
      state.velocity = v;
      state.current = x;
      state.lastTimestamp = now;
      if (Math.abs(v) < VELOCITY_EPS) {
        return true;
      }
      return false;
    };
    const start = (
      state: DecayAnimationState,
      current: number,
      now: number,
    ) => {
      state.current = current;
      state.velocity = initialVelocity;
      state.lastTimestamp = now;
    };
    return {
      animation,
      start,
    };
  });
};
export const withBounce = (
  animationParam: AnimationParameter<PhysicsAnimationState>,
  lowerBound: number,
  upperBound: number,
) => {
  'worklet';
  return defineAnimation<PhysicsAnimationState, AnimationState>(() => {
    'worklet';
    const nextAnimation = animationParameter(animationParam);
    const animation = (state: PhysicsAnimationState, now: number) => {
      const finished = nextAnimation.animation(nextAnimation, now);
      const {velocity, current} = nextAnimation;
      if (
        (velocity < 0 && current < lowerBound) ||
        (velocity > 0 && current > upperBound)
      ) {
        nextAnimation.velocity *= -0.5;
        nextAnimation.current = clamp(current, lowerBound, upperBound);
      }
      state.current = current;
      return finished;
    };
    const start = (
      state: PhysicsAnimationState,
      value: number,
      now: number,
      previousAnimation: AnimationState,
    ) => {
      nextAnimation.start(nextAnimation, value, now, previousAnimation);
    };
    return {
      animation,
      start,
    };
  });
};
interface PausableAnimationState extends AnimationState {
  lastTimestamp: number;
  elapsed: number;
}
export const withPause = (
  animationParam: AnimationParameter,
  paused: Animated.SharedValue<boolean>,
) => {
  'worklet';
  return defineAnimation<PausableAnimationState, AnimationState>(() => {
    'worklet';
    const nextAnimation = animationParameter(animationParam);
    const animation = (state: PausableAnimationState, now: number) => {
      if (paused.value) {
        state.elapsed = now - state.lastTimestamp;
        return false;
      }
      const finished = nextAnimation.animation(
        nextAnimation,
        now - state.elapsed,
      );
      state.current = nextAnimation.current;
      state.lastTimestamp = now;
      return finished;
    };
    const start = (
      state: PausableAnimationState,
      value: number,
      now: number,
      previousAnimation: AnimationState,
    ) => {
      state.elapsed = 0;
      state.lastTimestamp = now;
      nextAnimation.start(nextAnimation, value, now, previousAnimation);
    };
    return {
      animation,
      start,
    };
  });
};
