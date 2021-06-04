import React, {ReactNode} from 'react';
import {Dimensions, View, ViewStyle} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSharedValue} from './Animations';

import {COL, getOrder, getPosition, Positions, SIZE} from './Config';

interface ItemProps {
  children: ReactNode;
  id: string;
  positions: Animated.SharedValue<Positions>;
}

const Item = ({children, positions, id}: ItemProps) => {
  const inset = useSafeAreaInsets();
  const containerHeight =
    Dimensions.get('window').height - inset.top - inset.bottom;
  const contentHeight = (Object.keys(positions.value).length / COL) * SIZE;
  const position = getPosition(positions.value[id]);

  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);

  const style = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: SIZE,
      height: SIZE,
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });
  return <Animated.View {...{style}}>{children}</Animated.View>;
};

export default Item;
