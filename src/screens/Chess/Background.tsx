import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const WHITE = 'rgb(100,133,68)';

const BLACK = 'rgb(230,233,198)';

interface BackgroundProps {}
interface SquareProps extends RowProps {
  col: number;
}

const Square = ({row, col}: SquareProps) => {
  const offset = row % 2 === 0 ? 1 : 0;
  const backgroundColor = (col + offset) % 2 === 0 ? WHITE : BLACK;
  const color = (col + offset) % 2 === 0 ? BLACK : WHITE;
  return (
    <View
      {...{
        style: [
          styles.container,
          {backgroundColor, padding: 4, justifyContent: 'space-between'},
        ],
      }}>
      <Text
        {...{style: {color, fontWeight: '500', opacity: col === 0 ? 1 : 0}}}>
        {8 - row}
      </Text>
      <Text
        {...{
          style: {
            color,
            fontWeight: '500',
            alignSelf: 'flex-end',
            opacity: row === 7 ? 1 : 0,
          },
        }}>
        {String.fromCharCode('a'.charCodeAt(0) + col)}
      </Text>
    </View>
  );
};
interface RowProps {
  row: number;
}

const Row = ({row}: RowProps) => {
  return (
    <View {...{style: styles.rowContainer}}>
      {new Array(8).fill(0).map((_, col) => (
        <Square {...{key: `row:${col}`, row, col}} />
      ))}
    </View>
  );
};

const Background = () => {
  return (
    <View {...{style: styles.container}}>
      {new Array(8).fill(0).map((_, row) => (
        <Row {...{key: `background:${row}`, row}} />
      ))}
    </View>
  );
};

export default Background;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});
