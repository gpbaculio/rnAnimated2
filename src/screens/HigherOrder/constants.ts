import Animated from 'react-native-reanimated';

export interface AnimationState {
  current: number;
}

declare let _WORKLET: boolean;

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

interface PausableAnimation extends AnimationState {
  lastTimestamp: number;
  elapsed: number;
}

export type AnimationParameter<State extends AnimationState = AnimationState> =
  | Animation<State>
  | (() => Animation<State>)
  | number;

/**
 *  @summary Access animations passed as parameters safely on both the UI and JS thread with the proper static types.
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
 *  @summary Make an animation pausable. The state of the animation (paused or not)
 *  is controlled by a boolean shared value.
 *  @example
    const progress = useSharedValue(0);
    const paused = useSharedValue(false);
    useEffect(() => {
      progress.value = withPause(withLoop(withTiming(1)), paused);
    }, []);
  * @worklet
 */
export const withPause = (
  animationParam: AnimationParameter,
  paused: Animated.SharedValue<boolean>,
) => {
  'worklet';
  return defineAnimation<PausableAnimation>(() => {
    'worklet';
    const nextAnimation = animationParameter(animationParam);
    const onFrame = (state: PausableAnimation, now: number) => {
      const {lastTimestamp, elapsed} = state;
      if (paused.value) {
        state.elapsed = now - lastTimestamp;
        return false;
      }
      const dt = now - elapsed;
      const finished = nextAnimation.onFrame(nextAnimation, dt);
      state.current = nextAnimation.current;
      state.lastTimestamp = dt;
      return finished;
    };
    const onStart = (
      state: PausableAnimation,
      value: number,
      now: number,
      previousState: AnimationState,
    ) => {
      state.lastTimestamp = now;
      state.elapsed = 0;
      nextAnimation.onStart(nextAnimation, value, now, previousState);
    };
    return {
      onFrame,
      onStart,
      callback: nextAnimation.callback,
    };
  });
};
