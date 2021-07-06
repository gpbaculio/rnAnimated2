declare let _WORKLET: boolean;

export interface AnimationState {
  current: number;
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

interface BouncingAnimationState extends AnimationState {
  lastTimestamp: number;
  direction: -1 | 1;
}

export const withBouncing = (
  velocity: number,
  lowerBound: number,
  upperBound: number,
  onBounce?: () => void,
): number => {
  'worklet';
  return defineAnimation<BouncingAnimationState>(() => {
    'worklet';

    const onFrame = (state: BouncingAnimationState, now: number) => {
      const dt = now - state.lastTimestamp;
      const translation = (dt / 1000) * velocity;
      state.current += state.direction * translation;
      if (state.current >= upperBound || state.current < lowerBound) {
        state.direction *= -1;
        if (onBounce) onBounce();
      }
      state.lastTimestamp = now;
      return false;
    };

    const onStart = (
      state: BouncingAnimationState,
      value: number,
      now: number,
    ) => {
      state.current = lowerBound + Math.random() * upperBound;
      state.lastTimestamp = now;
      state.direction = 1;
    };

    return {
      onFrame,
      onStart,
    };
  });
};
