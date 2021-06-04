import React, {ReactNode} from 'react';
import {Dimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {COL, Positions, SIZE} from './Config';

interface ItemProps {
  children: ReactNode;
  id: string;
  positions: Positions;
}

const Item = ({children, positions}: ItemProps) => {
  const inset = useSafeAreaInsets();
  const containerHeight =
    Dimensions.get('window').height - inset.top - inset.bottom;
  // const contentHeight = (Object.keys(positions.value).length / COL) * SIZE;
  return <View>{children}</View>;
};

export default Item;
