// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="constants.d.ts"/>
import {interpolate, Extrapolate} from 'react-native-reanimated';

import parseSVG from 'parse-svg-path';
import absSVG from 'abs-svg-path';
import normalizeSVG from 'normalize-svg-path';

interface Curve {
  to: Vector;
  c1: Vector;
  c2: Vector;
}

export type Path = {
  move: Vector;
  curves: Curve[];
  close: boolean;
};

/**
 * @summary Add a cubic Bèzier curve command to a path.
 * @worklet
 */
export const addCurve = (path: Path, c: Curve) => {
  'worklet';
  path.curves.push({
    c1: c.c1,
    c2: c.c2,
    to: c.to,
  });
};

/**
 * @summary Select a point where the animation should snap to given the value of the gesture and it's velocity.
 * @worklet
 */
export const snapPoint = (
  value: number,
  velocity: number,
  points: ReadonlyArray<number>,
): number => {
  'worklet';
  const point = value + 0.2 * velocity;
  const deltas = points.map(p => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return points.filter(p => Math.abs(point - p) === minDelta)[0];
};

/**
 * @summary Computes animation node rounded to precision.
 * @worklet
 */
export const round = (value: number, precision = 0) => {
  'worklet';
  const p = Math.pow(10, precision);
  return Math.round(value * p) / p;
};

export const scale = (v: number, d: number[], r: number[]) => {
  'worklet';
  return interpolate(v, d, r, Extrapolate.CLAMP);
};

export const scaleInvert = (y: number, d: number[], r: number[]) => {
  'worklet';
  return interpolate(y, r, d, Extrapolate.CLAMP);
};

export const clamp = (
  value: number,
  lowerBound: number,
  upperBound: number,
) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
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

type SVGMove = ['M', number, number];
type SVGCurve = ['C', number, number, number, number, number, number];
type SVGPath = [SVGMove, ...SVGCurve[]];

export interface BezierCurvePath {
  curves: BezierCurve[];
  length: number;
}

export interface BezierCurve {
  from: Vector;
  to: Vector;
  c1: Vector;
  c2: Vector;
  start: number;
  end: number;
}

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

type CtrlPoint = [number, number, number, number];

// LUT for binomial coefficient arrays per curve order 'n'
const binomialCoefficients = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]];

// Look up what the binomial coefficient is for pair {n,k}
const binomials = (n: number, k: number) => binomialCoefficients[n][k];

const getDerivative = (derivative: number, t: number, vs: number[]): number => {
  // the derivative of any 't'-less function is zero.
  const n = vs.length - 1;
  let value;
  let k;
  if (n === 0) {
    return 0;
  }

  // direct values? compute!
  if (derivative === 0) {
    value = 0;
    for (k = 0; k <= n; k += 1) {
      value += binomials(n, k) * (1 - t ** n - k) * t ** k * vs[k];
    }
    return value;
  }
  // Still some derivative? go down one order, then try
  // for the lower order curve's.
  const vs1 = new Array(n);
  for (k = 0; k < n; k += 1) {
    vs1[k] = n * (vs[k + 1] - vs[k]);
  }
  return getDerivative(derivative - 1, t, vs1);
};

function B(xs: CtrlPoint, ys: CtrlPoint, t: number) {
  const xbase = getDerivative(1, t, xs);
  const ybase = getDerivative(1, t, ys);
  const combined = xbase * xbase + ybase * ybase;
  return Math.sqrt(combined);
}

// Cubic bezier curve length from http://bl.ocks.org/hnakamur/e7efd0602bfc15f66fc5
// Legendre-Gauss abscissae (xi values, defined at i=n as the roots of the nth order Legendre polynomial Pn(x))
const tValues = [
  [],
  [],
  [
    -0.5773502691896257645091487805019574556476,
    0.5773502691896257645091487805019574556476,
  ],
  [
    0, -0.7745966692414833770358530799564799221665,
    0.7745966692414833770358530799564799221665,
  ],
  [
    -0.3399810435848562648026657591032446872005,
    0.3399810435848562648026657591032446872005,
    -0.8611363115940525752239464888928095050957,
    0.8611363115940525752239464888928095050957,
  ],
  [
    0, -0.5384693101056830910363144207002088049672,
    0.5384693101056830910363144207002088049672,
    -0.9061798459386639927976268782993929651256,
    0.9061798459386639927976268782993929651256,
  ],
  [
    0.6612093864662645136613995950199053470064,
    -0.6612093864662645136613995950199053470064,
    -0.2386191860831969086305017216807119354186,
    0.2386191860831969086305017216807119354186,
    -0.9324695142031520278123015544939946091347,
    0.9324695142031520278123015544939946091347,
  ],
  [
    0, 0.4058451513773971669066064120769614633473,
    -0.4058451513773971669066064120769614633473,
    -0.7415311855993944398638647732807884070741,
    0.7415311855993944398638647732807884070741,
    -0.9491079123427585245261896840478512624007,
    0.9491079123427585245261896840478512624007,
  ],
  [
    -0.1834346424956498049394761423601839806667,
    0.1834346424956498049394761423601839806667,
    -0.5255324099163289858177390491892463490419,
    0.5255324099163289858177390491892463490419,
    -0.7966664774136267395915539364758304368371,
    0.7966664774136267395915539364758304368371,
    -0.9602898564975362316835608685694729904282,
    0.9602898564975362316835608685694729904282,
  ],
  [
    0, -0.8360311073266357942994297880697348765441,
    0.8360311073266357942994297880697348765441,
    -0.9681602395076260898355762029036728700494,
    0.9681602395076260898355762029036728700494,
    -0.3242534234038089290385380146433366085719,
    0.3242534234038089290385380146433366085719,
    -0.6133714327005903973087020393414741847857,
    0.6133714327005903973087020393414741847857,
  ],
  [
    -0.1488743389816312108848260011297199846175,
    0.1488743389816312108848260011297199846175,
    -0.4333953941292471907992659431657841622,
    0.4333953941292471907992659431657841622,
    -0.6794095682990244062343273651148735757692,
    0.6794095682990244062343273651148735757692,
    -0.8650633666889845107320966884234930485275,
    0.8650633666889845107320966884234930485275,
    -0.9739065285171717200779640120844520534282,
    0.9739065285171717200779640120844520534282,
  ],
  [
    0, -0.2695431559523449723315319854008615246796,
    0.2695431559523449723315319854008615246796,
    -0.5190961292068118159257256694586095544802,
    0.5190961292068118159257256694586095544802,
    -0.7301520055740493240934162520311534580496,
    0.7301520055740493240934162520311534580496,
    -0.8870625997680952990751577693039272666316,
    0.8870625997680952990751577693039272666316,
    -0.9782286581460569928039380011228573907714,
    0.9782286581460569928039380011228573907714,
  ],
  [
    -0.1252334085114689154724413694638531299833,
    0.1252334085114689154724413694638531299833,
    -0.3678314989981801937526915366437175612563,
    0.3678314989981801937526915366437175612563,
    -0.587317954286617447296702418940534280369,
    0.587317954286617447296702418940534280369,
    -0.7699026741943046870368938332128180759849,
    0.7699026741943046870368938332128180759849,
    -0.9041172563704748566784658661190961925375,
    0.9041172563704748566784658661190961925375,
    -0.9815606342467192506905490901492808229601,
    0.9815606342467192506905490901492808229601,
  ],
  [
    0, -0.2304583159551347940655281210979888352115,
    0.2304583159551347940655281210979888352115,
    -0.4484927510364468528779128521276398678019,
    0.4484927510364468528779128521276398678019,
    -0.6423493394403402206439846069955156500716,
    0.6423493394403402206439846069955156500716,
    -0.8015780907333099127942064895828598903056,
    0.8015780907333099127942064895828598903056,
    -0.9175983992229779652065478365007195123904,
    0.9175983992229779652065478365007195123904,
    -0.9841830547185881494728294488071096110649,
    0.9841830547185881494728294488071096110649,
  ],
  [
    -0.1080549487073436620662446502198347476119,
    0.1080549487073436620662446502198347476119,
    -0.3191123689278897604356718241684754668342,
    0.3191123689278897604356718241684754668342,
    -0.5152486363581540919652907185511886623088,
    0.5152486363581540919652907185511886623088,
    -0.6872929048116854701480198030193341375384,
    0.6872929048116854701480198030193341375384,
    -0.8272013150697649931897947426503949610397,
    0.8272013150697649931897947426503949610397,
    -0.928434883663573517336391139377874264477,
    0.928434883663573517336391139377874264477,
    -0.986283808696812338841597266704052801676,
    0.986283808696812338841597266704052801676,
  ],
  [
    0, -0.2011940939974345223006283033945962078128,
    0.2011940939974345223006283033945962078128,
    -0.3941513470775633698972073709810454683627,
    0.3941513470775633698972073709810454683627,
    -0.5709721726085388475372267372539106412383,
    0.5709721726085388475372267372539106412383,
    -0.7244177313601700474161860546139380096308,
    0.7244177313601700474161860546139380096308,
    -0.8482065834104272162006483207742168513662,
    0.8482065834104272162006483207742168513662,
    -0.9372733924007059043077589477102094712439,
    0.9372733924007059043077589477102094712439,
    -0.9879925180204854284895657185866125811469,
    0.9879925180204854284895657185866125811469,
  ],
  [
    -0.0950125098376374401853193354249580631303,
    0.0950125098376374401853193354249580631303,
    -0.281603550779258913230460501460496106486,
    0.281603550779258913230460501460496106486,
    -0.45801677765722738634241944298357757354,
    0.45801677765722738634241944298357757354,
    -0.6178762444026437484466717640487910189918,
    0.6178762444026437484466717640487910189918,
    -0.7554044083550030338951011948474422683538,
    0.7554044083550030338951011948474422683538,
    -0.8656312023878317438804678977123931323873,
    0.8656312023878317438804678977123931323873,
    -0.9445750230732325760779884155346083450911,
    0.9445750230732325760779884155346083450911,
    -0.9894009349916499325961541734503326274262,
    0.9894009349916499325961541734503326274262,
  ],
  [
    0, -0.1784841814958478558506774936540655574754,
    0.1784841814958478558506774936540655574754,
    -0.3512317634538763152971855170953460050405,
    0.3512317634538763152971855170953460050405,
    -0.5126905370864769678862465686295518745829,
    0.5126905370864769678862465686295518745829,
    -0.6576711592166907658503022166430023351478,
    0.6576711592166907658503022166430023351478,
    -0.7815140038968014069252300555204760502239,
    0.7815140038968014069252300555204760502239,
    -0.8802391537269859021229556944881556926234,
    0.8802391537269859021229556944881556926234,
    -0.9506755217687677612227169578958030214433,
    0.9506755217687677612227169578958030214433,
    -0.9905754753144173356754340199406652765077,
    0.9905754753144173356754340199406652765077,
  ],
  [
    -0.0847750130417353012422618529357838117333,
    0.0847750130417353012422618529357838117333,
    -0.2518862256915055095889728548779112301628,
    0.2518862256915055095889728548779112301628,
    -0.4117511614628426460359317938330516370789,
    0.4117511614628426460359317938330516370789,
    -0.5597708310739475346078715485253291369276,
    0.5597708310739475346078715485253291369276,
    -0.6916870430603532078748910812888483894522,
    0.6916870430603532078748910812888483894522,
    -0.8037049589725231156824174550145907971032,
    0.8037049589725231156824174550145907971032,
    -0.8926024664975557392060605911271455154078,
    0.8926024664975557392060605911271455154078,
    -0.9558239495713977551811958929297763099728,
    0.9558239495713977551811958929297763099728,
    -0.9915651684209309467300160047061507702525,
    0.9915651684209309467300160047061507702525,
  ],
  [
    0, -0.1603586456402253758680961157407435495048,
    0.1603586456402253758680961157407435495048,
    -0.3165640999636298319901173288498449178922,
    0.3165640999636298319901173288498449178922,
    -0.4645707413759609457172671481041023679762,
    0.4645707413759609457172671481041023679762,
    -0.6005453046616810234696381649462392798683,
    0.6005453046616810234696381649462392798683,
    -0.7209661773352293786170958608237816296571,
    0.7209661773352293786170958608237816296571,
    -0.8227146565371428249789224867127139017745,
    0.8227146565371428249789224867127139017745,
    -0.9031559036148179016426609285323124878093,
    0.9031559036148179016426609285323124878093,
    -0.960208152134830030852778840687651526615,
    0.960208152134830030852778840687651526615,
    -0.9924068438435844031890176702532604935893,
    0.9924068438435844031890176702532604935893,
  ],
  [
    -0.0765265211334973337546404093988382110047,
    0.0765265211334973337546404093988382110047,
    -0.227785851141645078080496195368574624743,
    0.227785851141645078080496195368574624743,
    -0.3737060887154195606725481770249272373957,
    0.3737060887154195606725481770249272373957,
    -0.5108670019508270980043640509552509984254,
    0.5108670019508270980043640509552509984254,
    -0.6360536807265150254528366962262859367433,
    0.6360536807265150254528366962262859367433,
    -0.7463319064601507926143050703556415903107,
    0.7463319064601507926143050703556415903107,
    -0.8391169718222188233945290617015206853296,
    0.8391169718222188233945290617015206853296,
    -0.9122344282513259058677524412032981130491,
    0.9122344282513259058677524412032981130491,
    -0.963971927277913791267666131197277221912,
    0.963971927277913791267666131197277221912,
    -0.9931285991850949247861223884713202782226,
    0.9931285991850949247861223884713202782226,
  ],
  [
    0, -0.1455618541608950909370309823386863301163,
    0.1455618541608950909370309823386863301163,
    -0.288021316802401096600792516064600319909,
    0.288021316802401096600792516064600319909,
    -0.4243421202074387835736688885437880520964,
    0.4243421202074387835736688885437880520964,
    -0.551618835887219807059018796724313286622,
    0.551618835887219807059018796724313286622,
    -0.667138804197412319305966669990339162597,
    0.667138804197412319305966669990339162597,
    -0.7684399634756779086158778513062280348209,
    0.7684399634756779086158778513062280348209,
    -0.8533633645833172836472506385875676702761,
    0.8533633645833172836472506385875676702761,
    -0.9200993341504008287901871337149688941591,
    0.9200993341504008287901871337149688941591,
    -0.9672268385663062943166222149076951614246,
    0.9672268385663062943166222149076951614246,
    -0.9937521706203895002602420359379409291933,
    0.9937521706203895002602420359379409291933,
  ],
  [
    -0.0697392733197222212138417961186280818222,
    0.0697392733197222212138417961186280818222,
    -0.2078604266882212854788465339195457342156,
    0.2078604266882212854788465339195457342156,
    -0.3419358208920842251581474204273796195591,
    0.3419358208920842251581474204273796195591,
    -0.4693558379867570264063307109664063460953,
    0.4693558379867570264063307109664063460953,
    -0.5876404035069115929588769276386473488776,
    0.5876404035069115929588769276386473488776,
    -0.6944872631866827800506898357622567712673,
    0.6944872631866827800506898357622567712673,
    -0.7878168059792081620042779554083515213881,
    0.7878168059792081620042779554083515213881,
    -0.8658125777203001365364256370193787290847,
    0.8658125777203001365364256370193787290847,
    -0.9269567721871740005206929392590531966353,
    0.9269567721871740005206929392590531966353,
    -0.9700604978354287271239509867652687108059,
    0.9700604978354287271239509867652687108059,
    -0.994294585482399292073031421161298980393,
    0.994294585482399292073031421161298980393,
  ],
  [
    0, -0.1332568242984661109317426822417661370104,
    0.1332568242984661109317426822417661370104,
    -0.264135680970344930533869538283309602979,
    0.264135680970344930533869538283309602979,
    -0.390301038030290831421488872880605458578,
    0.390301038030290831421488872880605458578,
    -0.5095014778460075496897930478668464305448,
    0.5095014778460075496897930478668464305448,
    -0.6196098757636461563850973116495956533871,
    0.6196098757636461563850973116495956533871,
    -0.7186613631319501944616244837486188483299,
    0.7186613631319501944616244837486188483299,
    -0.8048884016188398921511184069967785579414,
    0.8048884016188398921511184069967785579414,
    -0.8767523582704416673781568859341456716389,
    0.8767523582704416673781568859341456716389,
    -0.9329710868260161023491969890384229782357,
    0.9329710868260161023491969890384229782357,
    -0.9725424712181152319560240768207773751816,
    0.9725424712181152319560240768207773751816,
    -0.9947693349975521235239257154455743605736,
    0.9947693349975521235239257154455743605736,
  ],
  [
    -0.0640568928626056260850430826247450385909,
    0.0640568928626056260850430826247450385909,
    -0.1911188674736163091586398207570696318404,
    0.1911188674736163091586398207570696318404,
    -0.3150426796961633743867932913198102407864,
    0.3150426796961633743867932913198102407864,
    -0.4337935076260451384870842319133497124524,
    0.4337935076260451384870842319133497124524,
    -0.5454214713888395356583756172183723700107,
    0.5454214713888395356583756172183723700107,
    -0.6480936519369755692524957869107476266696,
    0.6480936519369755692524957869107476266696,
    -0.7401241915785543642438281030999784255232,
    0.7401241915785543642438281030999784255232,
    -0.8200019859739029219539498726697452080761,
    0.8200019859739029219539498726697452080761,
    -0.8864155270044010342131543419821967550873,
    0.8864155270044010342131543419821967550873,
    -0.9382745520027327585236490017087214496548,
    0.9382745520027327585236490017087214496548,
    -0.9747285559713094981983919930081690617411,
    0.9747285559713094981983919930081690617411,
    -0.9951872199970213601799974097007368118745,
    0.9951872199970213601799974097007368118745,
  ],
];

// Legendre-Gauss weights (wi values, defined by a function linked to in the Bezier primer article)
const cValues = [
  [],
  [],
  [1.0, 1.0],
  [
    0.8888888888888888888888888888888888888888,
    0.5555555555555555555555555555555555555555,
    0.5555555555555555555555555555555555555555,
  ],
  [
    0.6521451548625461426269360507780005927646,
    0.6521451548625461426269360507780005927646,
    0.3478548451374538573730639492219994072353,
    0.3478548451374538573730639492219994072353,
  ],
  [
    0.5688888888888888888888888888888888888888,
    0.4786286704993664680412915148356381929122,
    0.4786286704993664680412915148356381929122,
    0.2369268850561890875142640407199173626432,
    0.2369268850561890875142640407199173626432,
  ],
  [
    0.3607615730481386075698335138377161116615,
    0.3607615730481386075698335138377161116615,
    0.4679139345726910473898703439895509948116,
    0.4679139345726910473898703439895509948116,
    0.1713244923791703450402961421727328935268,
    0.1713244923791703450402961421727328935268,
  ],
  [
    0.4179591836734693877551020408163265306122,
    0.3818300505051189449503697754889751338783,
    0.3818300505051189449503697754889751338783,
    0.2797053914892766679014677714237795824869,
    0.2797053914892766679014677714237795824869,
    0.1294849661688696932706114326790820183285,
    0.1294849661688696932706114326790820183285,
  ],
  [
    0.3626837833783619829651504492771956121941,
    0.3626837833783619829651504492771956121941,
    0.3137066458778872873379622019866013132603,
    0.3137066458778872873379622019866013132603,
    0.2223810344533744705443559944262408844301,
    0.2223810344533744705443559944262408844301,
    0.1012285362903762591525313543099621901153,
    0.1012285362903762591525313543099621901153,
  ],
  [
    0.3302393550012597631645250692869740488788,
    0.1806481606948574040584720312429128095143,
    0.1806481606948574040584720312429128095143,
    0.0812743883615744119718921581105236506756,
    0.0812743883615744119718921581105236506756,
    0.3123470770400028400686304065844436655987,
    0.3123470770400028400686304065844436655987,
    0.2606106964029354623187428694186328497718,
    0.2606106964029354623187428694186328497718,
  ],
  [
    0.295524224714752870173892994651338329421,
    0.295524224714752870173892994651338329421,
    0.2692667193099963550912269215694693528597,
    0.2692667193099963550912269215694693528597,
    0.2190863625159820439955349342281631924587,
    0.2190863625159820439955349342281631924587,
    0.1494513491505805931457763396576973324025,
    0.1494513491505805931457763396576973324025,
    0.0666713443086881375935688098933317928578,
    0.0666713443086881375935688098933317928578,
  ],
  [
    0.272925086777900630714483528336342189156,
    0.2628045445102466621806888698905091953727,
    0.2628045445102466621806888698905091953727,
    0.2331937645919904799185237048431751394317,
    0.2331937645919904799185237048431751394317,
    0.1862902109277342514260976414316558916912,
    0.1862902109277342514260976414316558916912,
    0.1255803694649046246346942992239401001976,
    0.1255803694649046246346942992239401001976,
    0.0556685671161736664827537204425485787285,
    0.0556685671161736664827537204425485787285,
  ],
  [
    0.2491470458134027850005624360429512108304,
    0.2491470458134027850005624360429512108304,
    0.2334925365383548087608498989248780562594,
    0.2334925365383548087608498989248780562594,
    0.2031674267230659217490644558097983765065,
    0.2031674267230659217490644558097983765065,
    0.160078328543346226334652529543359071872,
    0.160078328543346226334652529543359071872,
    0.1069393259953184309602547181939962242145,
    0.1069393259953184309602547181939962242145,
    0.047175336386511827194615961485017060317,
    0.047175336386511827194615961485017060317,
  ],
  [
    0.2325515532308739101945895152688359481566,
    0.2262831802628972384120901860397766184347,
    0.2262831802628972384120901860397766184347,
    0.2078160475368885023125232193060527633865,
    0.2078160475368885023125232193060527633865,
    0.1781459807619457382800466919960979955128,
    0.1781459807619457382800466919960979955128,
    0.1388735102197872384636017768688714676218,
    0.1388735102197872384636017768688714676218,
    0.0921214998377284479144217759537971209236,
    0.0921214998377284479144217759537971209236,
    0.0404840047653158795200215922009860600419,
    0.0404840047653158795200215922009860600419,
  ],
  [
    0.2152638534631577901958764433162600352749,
    0.2152638534631577901958764433162600352749,
    0.2051984637212956039659240656612180557103,
    0.2051984637212956039659240656612180557103,
    0.1855383974779378137417165901251570362489,
    0.1855383974779378137417165901251570362489,
    0.1572031671581935345696019386238421566056,
    0.1572031671581935345696019386238421566056,
    0.1215185706879031846894148090724766259566,
    0.1215185706879031846894148090724766259566,
    0.0801580871597602098056332770628543095836,
    0.0801580871597602098056332770628543095836,
    0.0351194603317518630318328761381917806197,
    0.0351194603317518630318328761381917806197,
  ],
  [
    0.2025782419255612728806201999675193148386,
    0.1984314853271115764561183264438393248186,
    0.1984314853271115764561183264438393248186,
    0.1861610000155622110268005618664228245062,
    0.1861610000155622110268005618664228245062,
    0.1662692058169939335532008604812088111309,
    0.1662692058169939335532008604812088111309,
    0.1395706779261543144478047945110283225208,
    0.1395706779261543144478047945110283225208,
    0.1071592204671719350118695466858693034155,
    0.1071592204671719350118695466858693034155,
    0.0703660474881081247092674164506673384667,
    0.0703660474881081247092674164506673384667,
    0.0307532419961172683546283935772044177217,
    0.0307532419961172683546283935772044177217,
  ],
  [
    0.1894506104550684962853967232082831051469,
    0.1894506104550684962853967232082831051469,
    0.1826034150449235888667636679692199393835,
    0.1826034150449235888667636679692199393835,
    0.1691565193950025381893120790303599622116,
    0.1691565193950025381893120790303599622116,
    0.1495959888165767320815017305474785489704,
    0.1495959888165767320815017305474785489704,
    0.1246289712555338720524762821920164201448,
    0.1246289712555338720524762821920164201448,
    0.0951585116824927848099251076022462263552,
    0.0951585116824927848099251076022462263552,
    0.0622535239386478928628438369943776942749,
    0.0622535239386478928628438369943776942749,
    0.0271524594117540948517805724560181035122,
    0.0271524594117540948517805724560181035122,
  ],
  [
    0.1794464703562065254582656442618856214487,
    0.1765627053669926463252709901131972391509,
    0.1765627053669926463252709901131972391509,
    0.1680041021564500445099706637883231550211,
    0.1680041021564500445099706637883231550211,
    0.1540457610768102880814315948019586119404,
    0.1540457610768102880814315948019586119404,
    0.1351363684685254732863199817023501973721,
    0.1351363684685254732863199817023501973721,
    0.1118838471934039710947883856263559267358,
    0.1118838471934039710947883856263559267358,
    0.0850361483171791808835353701910620738504,
    0.0850361483171791808835353701910620738504,
    0.0554595293739872011294401653582446605128,
    0.0554595293739872011294401653582446605128,
    0.0241483028685479319601100262875653246916,
    0.0241483028685479319601100262875653246916,
  ],
  [
    0.1691423829631435918406564701349866103341,
    0.1691423829631435918406564701349866103341,
    0.1642764837458327229860537764659275904123,
    0.1642764837458327229860537764659275904123,
    0.1546846751262652449254180038363747721932,
    0.1546846751262652449254180038363747721932,
    0.1406429146706506512047313037519472280955,
    0.1406429146706506512047313037519472280955,
    0.1225552067114784601845191268002015552281,
    0.1225552067114784601845191268002015552281,
    0.1009420441062871655628139849248346070628,
    0.1009420441062871655628139849248346070628,
    0.0764257302548890565291296776166365256053,
    0.0764257302548890565291296776166365256053,
    0.0497145488949697964533349462026386416808,
    0.0497145488949697964533349462026386416808,
    0.0216160135264833103133427102664524693876,
    0.0216160135264833103133427102664524693876,
  ],
  [
    0.1610544498487836959791636253209167350399,
    0.1589688433939543476499564394650472016787,
    0.1589688433939543476499564394650472016787,
    0.152766042065859666778855400897662998461,
    0.152766042065859666778855400897662998461,
    0.1426067021736066117757461094419029724756,
    0.1426067021736066117757461094419029724756,
    0.1287539625393362276755157848568771170558,
    0.1287539625393362276755157848568771170558,
    0.1115666455473339947160239016817659974813,
    0.1115666455473339947160239016817659974813,
    0.0914900216224499994644620941238396526609,
    0.0914900216224499994644620941238396526609,
    0.0690445427376412265807082580060130449618,
    0.0690445427376412265807082580060130449618,
    0.0448142267656996003328381574019942119517,
    0.0448142267656996003328381574019942119517,
    0.0194617882297264770363120414644384357529,
    0.0194617882297264770363120414644384357529,
  ],
  [
    0.1527533871307258506980843319550975934919,
    0.1527533871307258506980843319550975934919,
    0.1491729864726037467878287370019694366926,
    0.1491729864726037467878287370019694366926,
    0.1420961093183820513292983250671649330345,
    0.1420961093183820513292983250671649330345,
    0.1316886384491766268984944997481631349161,
    0.1316886384491766268984944997481631349161,
    0.118194531961518417312377377711382287005,
    0.118194531961518417312377377711382287005,
    0.1019301198172404350367501354803498761666,
    0.1019301198172404350367501354803498761666,
    0.0832767415767047487247581432220462061001,
    0.0832767415767047487247581432220462061001,
    0.0626720483341090635695065351870416063516,
    0.0626720483341090635695065351870416063516,
    0.040601429800386941331039952274932109879,
    0.040601429800386941331039952274932109879,
    0.0176140071391521183118619623518528163621,
    0.0176140071391521183118619623518528163621,
  ],
  [
    0.1460811336496904271919851476833711882448,
    0.1445244039899700590638271665537525436099,
    0.1445244039899700590638271665537525436099,
    0.1398873947910731547221334238675831108927,
    0.1398873947910731547221334238675831108927,
    0.132268938633337461781052574496775604329,
    0.132268938633337461781052574496775604329,
    0.1218314160537285341953671771257335983563,
    0.1218314160537285341953671771257335983563,
    0.1087972991671483776634745780701056420336,
    0.1087972991671483776634745780701056420336,
    0.0934444234560338615532897411139320884835,
    0.0934444234560338615532897411139320884835,
    0.0761001136283793020170516533001831792261,
    0.0761001136283793020170516533001831792261,
    0.0571344254268572082836358264724479574912,
    0.0571344254268572082836358264724479574912,
    0.0369537897708524937999506682993296661889,
    0.0369537897708524937999506682993296661889,
    0.0160172282577743333242246168584710152658,
    0.0160172282577743333242246168584710152658,
  ],
  [
    0.1392518728556319933754102483418099578739,
    0.1392518728556319933754102483418099578739,
    0.1365414983460151713525738312315173965863,
    0.1365414983460151713525738312315173965863,
    0.1311735047870623707329649925303074458757,
    0.1311735047870623707329649925303074458757,
    0.1232523768105124242855609861548144719594,
    0.1232523768105124242855609861548144719594,
    0.1129322960805392183934006074217843191142,
    0.1129322960805392183934006074217843191142,
    0.1004141444428809649320788378305362823508,
    0.1004141444428809649320788378305362823508,
    0.0859416062170677274144436813727028661891,
    0.0859416062170677274144436813727028661891,
    0.0697964684245204880949614189302176573987,
    0.0697964684245204880949614189302176573987,
    0.0522933351526832859403120512732112561121,
    0.0522933351526832859403120512732112561121,
    0.0337749015848141547933022468659129013491,
    0.0337749015848141547933022468659129013491,
    0.0146279952982722006849910980471854451902,
    0.0146279952982722006849910980471854451902,
  ],
  [
    0.1336545721861061753514571105458443385831,
    0.132462039404696617371642464703316925805,
    0.132462039404696617371642464703316925805,
    0.1289057221880821499785953393997936532597,
    0.1289057221880821499785953393997936532597,
    0.1230490843067295304675784006720096548158,
    0.1230490843067295304675784006720096548158,
    0.1149966402224113649416435129339613014914,
    0.1149966402224113649416435129339613014914,
    0.1048920914645414100740861850147438548584,
    0.1048920914645414100740861850147438548584,
    0.0929157660600351474770186173697646486034,
    0.0929157660600351474770186173697646486034,
    0.0792814117767189549228925247420432269137,
    0.0792814117767189549228925247420432269137,
    0.0642324214085258521271696151589109980391,
    0.0642324214085258521271696151589109980391,
    0.0480376717310846685716410716320339965612,
    0.0480376717310846685716410716320339965612,
    0.0309880058569794443106942196418845053837,
    0.0309880058569794443106942196418845053837,
    0.0134118594871417720813094934586150649766,
    0.0134118594871417720813094934586150649766,
  ],
  [
    0.1279381953467521569740561652246953718517,
    0.1279381953467521569740561652246953718517,
    0.1258374563468282961213753825111836887264,
    0.1258374563468282961213753825111836887264,
    0.121670472927803391204463153476262425607,
    0.121670472927803391204463153476262425607,
    0.1155056680537256013533444839067835598622,
    0.1155056680537256013533444839067835598622,
    0.1074442701159656347825773424466062227946,
    0.1074442701159656347825773424466062227946,
    0.0976186521041138882698806644642471544279,
    0.0976186521041138882698806644642471544279,
    0.086190161531953275917185202983742667185,
    0.086190161531953275917185202983742667185,
    0.0733464814110803057340336152531165181193,
    0.0733464814110803057340336152531165181193,
    0.0592985849154367807463677585001085845412,
    0.0592985849154367807463677585001085845412,
    0.0442774388174198061686027482113382288593,
    0.0442774388174198061686027482113382288593,
    0.0285313886289336631813078159518782864491,
    0.0285313886289336631813078159518782864491,
    0.0123412297999871995468056670700372915759,
    0.0123412297999871995468056670700372915759,
  ],
];

const getArcLength = (xs: CtrlPoint, ys: CtrlPoint, t = 1, n = 20) => {
  if (xs.length >= tValues.length) {
    throw new Error('too high n bezier');
  }
  const z = t / 2;
  let sum = 0;
  let i;
  for (i = 0; i < n; i += 1) {
    const correctedT = z * tValues[n][i] + z;
    sum += cValues[n][i] * B(xs, ys, correctedT);
  }
  return z * sum;
};

export const cubicBezierLength = (
  p0: Vector,
  p1: Vector,
  p2: Vector,
  p3: Vector,
): number => {
  const xs: CtrlPoint = [p0.x, p1.x, p2.x, p3.x];
  const ys: CtrlPoint = [p0.y, p1.y, p2.y, p3.y];
  return getArcLength(xs, ys);
};

export const parsePath = (d: string): BezierCurvePath => {
  let length = 0;
  const [move, ...rawCurves]: SVGPath = normalizeSVG(absSVG(parseSVG(d)));
  const curves: BezierCurve[] = rawCurves.map((curve, index) => {
    const prevCurve = rawCurves[index - 1];
    const from =
      index === 0
        ? {x: move[1], y: move[2]}
        : {x: prevCurve[5], y: prevCurve[6]};
    const c1 = {x: curve[1], y: curve[2]};
    const c2 = {x: curve[3], y: curve[4]};
    const to = {x: curve[5], y: curve[6]};
    const start = length;
    length += cubicBezierLength(from, c1, c2, to);
    const end = length;
    return {
      from,
      c1,
      c2,
      to,
      start,
      end,
    };
  });
  return {
    length,
    curves,
  };
};

/**
 * @description Returns the coordinate of a cubic bezier curve. t is the length of the curve from 0 to 1.
 * cubicBezier(0, p0, p1, p2, p3) equals p0 and cubicBezier(1, p0, p1, p2, p3) equals p3.
 * p0 and p3 are respectively the starting and ending point of the curve. p1 and p2 are the control points.
 * @worklet
 */
export const cubicBezier = (
  t: number,
  from: number,
  c1: number,
  c2: number,
  to: number,
) => {
  'worklet';
  const term = 1 - t;
  const a = 1 * term ** 3 * t ** 0 * from;
  const b = 3 * term ** 2 * t ** 1 * c1;
  const c = 3 * term ** 1 * t ** 2 * c2;
  const d = 1 * term ** 0 * t ** 3 * to;
  return a + b + c + d;
};

export const getPointAtLength = (path: BezierCurvePath, length: number) => {
  'worklet';
  const c = path.curves.find(
    curve => length >= curve.start && length <= curve.end,
  );
  if (!c) {
    throw new Error('Curve not found');
  }
  const t = (length - c.start) / (c.end - c.start);
  return {
    x: cubicBezier(t, c.from.x, c.c1.x, c.c2.x, c.to.x),
    y: cubicBezier(t, c.from.y, c.c1.y, c.c2.y, c.to.y),
  };
};
