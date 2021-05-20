import React, {ReactElement} from 'react';
import {ScrollView} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';

import SortableItem from './SortableItem';

interface SortableListProps {
  children: ReactElement[];
  item: {width: number; height: number};
}

const SortableList = ({children, item: {width, height}}: SortableListProps) => {
  const offsets = children.map((_, i) => ({y: useSharedValue(height * i)}));

  return (
    <ScrollView contentContainerStyle={{height: height * children.length}}>
      {children.map((child, index) => (
        <SortableItem
          {...{
            key: index,
            index,
            offsets,
            width,
            height,
          }}>
          {child}
        </SortableItem>
      ))}
    </ScrollView>
  );
};

export default SortableList;
