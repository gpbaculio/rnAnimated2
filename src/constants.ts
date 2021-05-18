export const styleGuide = {
  spacing: 8,
  palette: {
    primary: '#3884ff',
    secondary: '#FF6584',
    tertiary: '#38ffb3',
    backgroundPrimary: '#d5e5ff', // === rgba(primary, 0.1)
    background: '#f2f2f2',
    border: '#f2f2f2',
  },
  typography: {
    body: {
      fontSize: 17,
      lineHeight: 20,
      fontFamily: 'SFProText-Regular',
    },
    callout: {
      fontSize: 16,
      lineHeight: 20,
      fontFamily: 'SFProText-Regular',
    },
    caption: {
      fontSize: 11,
      lineHeight: 13,
      fontFamily: 'SFProText-Regular',
    },
    footnote: {
      fontSize: 13,
      lineHeight: 18,
      fontFamily: 'SFProText-Regular',
      color: '#999999',
    },
    headline: {
      fontSize: 17,
      lineHeight: 22,
      fontFamily: 'SFProText-Semibold',
    },
    subhead: {
      fontSize: 15,
      lineHeight: 20,
      fontFamily: 'SFProText-Bold',
    },
    title1: {
      fontSize: 34,
      lineHeight: 41,
      fontFamily: 'SFProText-Bold',
    },
    title2: {
      fontSize: 28,
      lineHeight: 34,
      fontFamily: 'SFProText-Bold',
    },
    title3: {
      fontSize: 22,
      lineHeight: 26,
      fontFamily: 'SFProText-Bold',
    },
  },
};

/**
 * @summary Type representing a vector
 * @example
   export interface Vector<T = number> {
    x: T;
    y: T;
  }
 */
export interface Vector<T = number> {
  x: T;
  y: T;
}

/**
 * @worklet
 */
export const canvas2Cartesian = (v: Vector, center: Vector) => {
  'worklet';
  return {
    x: v.x - center.x,
    y: -1 * (v.y - center.y),
  };
};

/**
 * @worklet
 */
export const cartesian2Polar = (v: Vector) => {
  'worklet';
  return {
    theta: Math.atan2(v.y, v.x),
    radius: Math.sqrt(v.x ** 2 + v.y ** 2),
  };
};

/**
 * @worklet
 */
export const canvas2Polar = (v: Vector, center: Vector) => {
  'worklet';
  return cartesian2Polar(canvas2Cartesian(v, center));
};

export interface PolarPoint {
  theta: number;
  radius: number;
}
/**
 * @worklet
 */
export const polar2Cartesian = (p: PolarPoint) => {
  'worklet';
  return {
    x: p.radius * Math.cos(p.theta),
    y: p.radius * Math.sin(p.theta),
  };
};

/**
 * @worklet
 */
export const cartesian2Canvas = (v: Vector, center: Vector) => {
  'worklet';
  return {
    x: v.x + center.x,
    y: -1 * v.y + center.y,
  };
};

/**
 * @worklet
 */
export const polar2Canvas = (p: PolarPoint, center: Vector) => {
  'worklet';
  return cartesian2Canvas(polar2Cartesian(p), center);
};
