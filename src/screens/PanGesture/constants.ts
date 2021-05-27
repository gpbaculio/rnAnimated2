import Animated from 'react-native-reanimated';
import {clamp} from '../constants';
declare let _WORKLET: boolean;
export interface AnimationState {
  current: number;
}

interface PhysicsAnimationState extends AnimationState {
  velocity: number;
}

export type Animation<
  State extends AnimationState = AnimationState,
  PrevState = State,
> = {
  onFrame: (animation: State, now: number) => boolean;
  onStart: (
    animation: State,
    value: number,
    now: number,
    lastAnimation: PrevState,
  ) => void;
  callback?: () => void;
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
/**
 *  @summary Add a bouncing behavior to a physics-based animation.
 *  An animation is defined as being physics-based if it contains a velocity in its state.
 *  @example
    // will bounce if the animations hits the position 0 or 100
    withBouncing(withDecay({ velocity }), 0, 100)
 * @worklet
 */
export const withBounce = (
  animationParam: AnimationParameter<PhysicsAnimationState>,
  lowerBound: number,
  upperBound: number,
): number => {
  'worklet';
  return defineAnimation<PhysicsAnimationState, PhysicsAnimationState>(() => {
    'worklet';
    const nextAnimation = animationParameter(animationParam);
    const onFrame = (state: PhysicsAnimationState, now: number) => {
      const finished = nextAnimation.onFrame(nextAnimation, now);
      const {velocity, current} = nextAnimation;
      state.current = current;
      if (
        (velocity < 0 && state.current <= lowerBound) ||
        (velocity > 0 && state.current >= upperBound)
      ) {
        state.current = velocity < 0 ? lowerBound : upperBound;
        nextAnimation.velocity *= -0.5;
      }
      return finished;
    };
    const onStart = (
      _state: PhysicsAnimationState,
      value: number,
      now: number,
      previousState: PhysicsAnimationState,
    ) => {
      nextAnimation.onStart(nextAnimation, value, now, previousState);
    };
    return {
      onFrame,
      onStart,
      callback: nextAnimation.callback,
    };
  });
};
