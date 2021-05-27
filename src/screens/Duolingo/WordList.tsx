/* eslint-disable react-hooks/rules-of-hooks */
import React, {ReactElement, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  runOnJS,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import SortableWord from './SortableWord';
import Lines from './components/Lines';

const margin = 32;
const containerWidth = Dimensions.get('window').width - margin * 2;

interface WordListProps {
  children: ReactElement<{id: number}>[];
}

const WordList = ({children}: WordListProps) => {
  const [ready, setReady] = useState(false);

  const offsets = children.map(() => ({
    order: useSharedValue(0),
    width: useSharedValue(0),
    height: useSharedValue(0),
    x: useSharedValue(0),
    y: useSharedValue(0),
    originalX: useSharedValue(0),
    originalY: useSharedValue(0),
  }));

  // check if all offsets has been initialized with SharedValues onLayout
  const handleIsReady = (
    currentOffsets: {
      order: Animated.SharedValue<number>;
      width: Animated.SharedValue<number>;
      height: Animated.SharedValue<number>;
      x: Animated.SharedValue<number>;
      y: Animated.SharedValue<number>;
      originalX: Animated.SharedValue<number>;
      originalY: Animated.SharedValue<number>;
    }[],
  ) => {
    const isInitialized = currentOffsets.every(o => o.order.value === -1);

    if (isInitialized) {
      setReady(true);
    }
  };

  useDerivedValue(() => {
    runOnJS(handleIsReady)(offsets);
  });

  if (!ready) {
    return (
      <View style={styles.row}>
        {children.map((child, index) => {
          return (
            <View
              key={index}
              onLayout={({
                nativeEvent: {
                  layout: {x, y, width, height},
                },
              }) => {
                const offset = offsets[index];
                offset.order.value = -1;
                offset.width.value = width;
                offset.height.value = height;
                offset.originalX.value = x;
                offset.originalY.value = y;
              }}>
              {child}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Lines />
      {children.map((child, index) => (
        <SortableWord
          key={index}
          offsets={offsets}
          index={index}
          containerWidth={containerWidth}>
          {child}
        </SortableWord>
      ))}
    </View>
  );
};

export default WordList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
