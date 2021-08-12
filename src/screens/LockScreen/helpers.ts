import {svgWidth} from './LockScreen';

export const getDayName = (index: number) => {
  const dayName = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return dayName[index];
};

export const getMonthName = (index: number) => {
  const monthName = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthName[index];
};

// @flow

type Coordinate = {x: number; y: number};

export const getHorizontalIntermediate = (
  anchorCoordinate: Coordinate, // start
  focusCoordinate: Coordinate, // current focus
  dimension: number,
  screenCoordinates: Coordinate[],
  hitSlop = 25,
) => {
  'worklet';
  if (
    focusCoordinate.y + hitSlop >= anchorCoordinate.y &&
    focusCoordinate.y - hitSlop <= anchorCoordinate.y
  ) {
    const xCoords = screenCoordinates.filter(c => {
      if (focusCoordinate.x > anchorCoordinate.x) {
        return (
          focusCoordinate.x > c.x &&
          c.x < focusCoordinate.x &&
          c.y + hitSlop >= anchorCoordinate.y &&
          c.y - hitSlop <= anchorCoordinate.y &&
          c.x !== anchorCoordinate.x
        );
      } else if (anchorCoordinate.x > focusCoordinate.x) {
        return (
          focusCoordinate.x < c.x &&
          c.x > focusCoordinate.x &&
          c.y + hitSlop >= anchorCoordinate.y &&
          c.y - hitSlop <= anchorCoordinate.y &&
          c.x !== anchorCoordinate.x
        );
      }
    });
  } else if (
    focusCoordinate.x + hitSlop >= anchorCoordinate.x &&
    focusCoordinate.x - hitSlop <= anchorCoordinate.x
  ) {
    const yCoords = screenCoordinates.filter(c => {
      if (focusCoordinate.y > anchorCoordinate.y) {
        return (
          focusCoordinate.x > c.y &&
          c.y < focusCoordinate.y &&
          c.x + hitSlop >= anchorCoordinate.x &&
          c.x - hitSlop <= anchorCoordinate.x &&
          c.y !== anchorCoordinate.y
        );
      } else if (focusCoordinate.y < anchorCoordinate.y) {
        return (
          focusCoordinate.y < c.y &&
          c.y > focusCoordinate.y &&
          c.x + hitSlop >= anchorCoordinate.x &&
          c.x - hitSlop <= anchorCoordinate.x &&
          c.y !== anchorCoordinate.y
        );
      }
    });
  } else {
    let dotIndex = [];
    function closest(num: number, arr: number[]) {
      var curr = arr[0];
      var diff = Math.abs(num - curr);
      for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs(num - arr[val]);
        if (newdiff < diff) {
          diff = newdiff;
          curr = arr[val];
        }
      }
      return curr;
    }
    const maxWidth = Math.max.apply(
      Math,
      screenCoordinates.map(c => c.x),
    );
    const coordsSquare = svgWidth - maxWidth;
    const sqrWidth = maxWidth - coordsSquare;
    const sd = (sqrWidth * Math.sqrt(2)) / 3;
    for (let i = 0; i < screenCoordinates.length; i++) {
      const f = screenCoordinates[i];
      // const ff = screenCoordinates[j];
      // console.log('f: ', f);
      // console.log('ff: ', ff);
      // if (
      //   dotX + hitSlop > focusCoordinate.x &&
      //   dotX - hitSlop < focusCoordinate.x &&
      //   dotY + hitSlop > focusCoordinate.y &&
      //   dotY - hitSlop < focusCoordinate.y
      // ) {
      //   dotIndex.push(i);
      // }
    }
    // console.log('dotIndex: ', dotIndex);
  }

  return [];
};

export const getIntermediateDotIndexes = (
  anchorCoordinate: Coordinate,
  focusCoordinate: Coordinate,
  dimension: number,
  hitSlop = 25,
) => {
  'worklet';
  let intermediateDotIndexes = [];
  if (focusCoordinate.y === anchorCoordinate.y) {
    let row = focusCoordinate.y;
    for (
      let col = Math.min(focusCoordinate.x, anchorCoordinate.x) + 1;
      col < Math.max(focusCoordinate.x, anchorCoordinate.x);
      col++
    ) {
      let index = row * dimension + col;
      intermediateDotIndexes.push(index);
    }
  }

  // check vertical
  if (focusCoordinate.x === anchorCoordinate.x) {
    let col = anchorCoordinate.x;
    for (
      let row = Math.min(focusCoordinate.y, anchorCoordinate.y) + 1;
      row < Math.max(focusCoordinate.y, anchorCoordinate.y);
      row++
    ) {
      let index = row * dimension + col;
      intermediateDotIndexes.push(index);
    }
  }

  // check diagonal
  let dx = focusCoordinate.x - anchorCoordinate.x;
  let dy = focusCoordinate.y - anchorCoordinate.y;
  if (Math.abs(dx) === Math.abs(dy)) {
    let loopCount = 1;

    let getCalculatedCol = (iterator: number) => {
      if (dx === dy) {
        // diagonal from top left to bottom right or vice versa
        let col = Math.min(focusCoordinate.x, anchorCoordinate.x);
        return col + iterator;
      } else {
        // diagonal from top right to bottom left or vice versa
        let col = Math.max(focusCoordinate.x, anchorCoordinate.x);
        return col - iterator;
      }
    };

    for (
      let row = Math.min(focusCoordinate.y, anchorCoordinate.y) + 1;
      row < Math.max(focusCoordinate.y, anchorCoordinate.y);
      row++
    ) {
      let index = row * dimension + getCalculatedCol(loopCount);
      intermediateDotIndexes.push(index);
      loopCount++;
    }
  }

  return intermediateDotIndexes;
};

const DEFAULT_HIT_SLOP = 25;

export const isAlreadyInPattern = (
  value: Coordinate,
  pattern: Coordinate[],
): boolean => {
  'worklet';
  return pattern.some(
    dot =>
      (dot && dot.x) === (value && value.x) &&
      (dot && dot.y) === (value && value.y),
  );
};

export const getDotIndex = (
  {x, y}: Coordinate,
  dots: Array<Coordinate>,
  hitSlop: number = DEFAULT_HIT_SLOP,
) => {
  'worklet';
  let dotIndex = null;
  for (let i = 0; i < dots.length; i++) {
    const {x: dotX, y: dotY} = dots[i];
    if (
      dotX + hitSlop >= x &&
      dotX - hitSlop <= x &&
      dotY + hitSlop >= y &&
      dotY - hitSlop <= y
    ) {
      // console.log('{x, y}', {x, y});
      dotIndex = i;
      break;
    }
  }
  return dotIndex;
};

export const populateDotsCoordinate = (
  dotsDimension: number,
  containerWidth: number,
  containerHeight: number,
) => {
  'worklet';
  let mappedIndex = [];
  let screenCoordinates = [];

  for (let rowIndex = 0; rowIndex < dotsDimension; rowIndex++) {
    for (let columnIndex = 0; columnIndex < dotsDimension; columnIndex++) {
      let offsetX = (containerWidth / dotsDimension) * columnIndex;
      let offsetY = (containerHeight / dotsDimension) * rowIndex;

      screenCoordinates.push({
        x: offsetX + containerWidth / dotsDimension / 2,
        y: offsetY + containerWidth / dotsDimension / 2,
      });
      mappedIndex.push({x: columnIndex, y: rowIndex});
    }
  }

  return {
    mappedIndex,
    screenCoordinates,
  };
};
