import React, {ReactElement, useRef} from 'react';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

import Item from './Item';
import {COL, Positions, SIZE} from './Config';
import {useSharedValue} from './Animations';

interface ListProps {
  children: ReactElement<{id: string}>[];
}

const List = ({children}: ListProps) => {
  const positions = useSharedValue<Positions>(
    Object.assign(
      {},
      ...children.map((child, index) => ({[child.props.id]: index})),
    ),
  );

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: ({contentOffset: {y}}) => {
      scrollY.value = y;
    },
  });

  return (
    <Animated.ScrollView
      {...{ref: scrollRef, onScroll}}
      contentContainerStyle={{
        height: Math.ceil(children.length / COL) * SIZE,
      }}
      showsVerticalScrollIndicator={false}
      bounces={false}
      scrollEventThrottle={16}>
      {children.map(child => {
        return (
          <Item
            {...{scrollRef, scrollY}}
            key={child.props.id}
            id={child.props.id}
            positions={positions}>
            {child}
          </Item>
        );
      })}
    </Animated.ScrollView>
  );
};

export default List;
