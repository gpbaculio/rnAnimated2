import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Chess} from 'chess.js';
import {useConst} from '../constants';
import Piece from './Piece';

import Background from './Background';
import {SIZE} from './Notation';

const {width} = Dimensions.get('window');

const Board = () => {
  const chess = useConst(() => new Chess());
  const [state, setState] = useState({
    player: 'w',
    board: chess.board(),
  });
  const onTurn = useCallback(() => {
    setState({
      player: state.player === 'w' ? 'b' : 'w',
      board: chess.board(),
    });
  }, [state.player, chess]);
  return (
    <View style={styles.container}>
      <Background />
      {state.board.map((row, i) =>
        row.map((square, j) => {
          if (square === null) return null;
          return (
            <Piece
              {...{
                enabled: state.player === square.color,
                onTurn,
                chess,
                id: `${square.color}${square.type}` as const,
                position: {
                  x: j * SIZE,
                  y: i * SIZE,
                },
              }}
            />
          );
        }),
      )}
    </View>
  );
};

export default Board;

const styles = StyleSheet.create({
  container: {
    width,
    height: width,
  },
});
