//@ts-ignore
import {Chess, ChessInstance, Position} from 'chess.js';
import React, {useCallback} from 'react';
import {StyleSheet, Image} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Vector} from '../constants';

import {SIZE, toPosition, toTranslation} from './Notation';

export type Player = 'b' | 'w';
type Type = 'q' | 'r' | 'n' | 'b' | 'k' | 'p';
type Piece = `${Player}${Type}`;
type Pieces = Record<Piece, ReturnType<typeof require>>;
export const PIECES: Pieces = {
  br: require('./assets/br.png'),
  bp: require('./assets/bp.png'),
  bn: require('./assets/bn.png'),
  bb: require('./assets/bb.png'),
  bq: require('./assets/bq.png'),
  bk: require('./assets/bk.png'),
  wr: require('./assets/wr.png'),
  wn: require('./assets/wn.png'),
  wb: require('./assets/wb.png'),
  wq: require('./assets/wq.png'),
  wk: require('./assets/wk.png'),
  wp: require('./assets/wp.png'),
};

interface PieceProps {
  id: Piece;
  position: Vector;
  chess: ChessInstance;
  onTurn: () => void;
  enabled: boolean;
}

const Piece = ({id, position, chess, onTurn, enabled}: PieceProps) => {
  const isGestureActive = useSharedValue(false);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);
  const movePiece = useCallback(
    (from: Position, to: Position) => {
      const move = chess
        .moves({verbose: true})
        .find(m => m.from === from && m.to === to);
      const {x, y} = toTranslation(move ? to : from);
      translateX.value = withTiming(x);
      translateY.value = withTiming(y, {}, () => {
        isGestureActive.value = false;
      });
      if (move) {
        chess.move(move);
        onTurn();
      }
    },
    [chess, translateX, translateY, enabled, isGestureActive],
  );
  const piece = useAnimatedStyle(() => ({
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    zIndex: isGestureActive.value ? 100 : 10,
    transform: [{translateX: translateX.value}, {translateY: translateY.value}],
  }));
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: () => {
      isGestureActive.value = true;
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    },
    onActive: ({translationX, translationY}) => {
      translateX.value = translationX + offsetX.value;
      translateY.value = translationY + offsetY.value;
    },
    onEnd: () => {
      const from = toPosition({
        x: offsetX.value,
        y: offsetY.value,
      });
      const to = toPosition({
        x: translateX.value,
        y: translateY.value,
      });
      runOnJS(movePiece)(from, to);
    },
  });
  const from = useAnimatedStyle(() => {
    const tr = toTranslation(
      toPosition({x: translateX.value, y: translateY.value}),
    );
    return {
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      opacity: isGestureActive.value ? 1 : 0,
      zIndex: isGestureActive.value ? 100 : 10,
      backgroundColor: 'rgba(255,255,0,0.5)',
      transform: [{translateX: tr.x}, {translateY: tr.y}],
    };
  });
  const to = useAnimatedStyle(() => ({
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    opacity: isGestureActive.value ? 1 : 0,
    zIndex: isGestureActive.value ? 100 : 10,
    backgroundColor: 'rgba(255,255,0,0.5)',
    transform: [{translateX: offsetX.value}, {translateY: offsetY.value}],
  }));
  return (
    <>
      <Animated.View {...{style: to}} />
      <Animated.View {...{style: from}} />
      <PanGestureHandler {...{onGestureEvent, enabled}}>
        <Animated.View {...{style: piece}}>
          <Image source={PIECES[id]} style={styles.piece} />
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

export default Piece;

const styles = StyleSheet.create({
  piece: {
    width: SIZE,
    height: SIZE,
  },
});
