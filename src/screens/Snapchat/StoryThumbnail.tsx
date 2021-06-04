import * as React from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SharedElement} from 'react-navigation-shared-element';
import {View, Image, StyleSheet, Dimensions, Pressable} from 'react-native';

import {Story} from './Model';

const margin = 16;
const borderRadius = 5;
const width = Dimensions.get('window').width / 2 - margin * 2;

interface StoryThumbnailProps {
  story: Story;
}

const StoryThumbnail = ({story}: StoryThumbnailProps) => {
  const [opacity, setOpacity] = React.useState(0);

  const navigation = useNavigation();

  useFocusEffect(() => {
    if (navigation.isFocused()) {
      setOpacity(1);
    }
  });

  return (
    <Pressable
      style={({pressed}) => ({opacity: pressed ? 0.5 : 1})}
      onPress={() => {
        navigation.navigate('Story', {story});
        setOpacity(0);
      }}>
      <View style={[styles.container, {opacity}]}>
        <SharedElement {...{id: story.id, style: [styles.container]}}>
          <Image source={story.source} style={styles.image} />
        </SharedElement>
      </View>
    </Pressable>
  );
};

export default StoryThumbnail;

const styles = StyleSheet.create({
  container: {
    width,
    height: width * 1.77,
    marginTop: 16,
    borderRadius,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
    borderRadius,
  },
});
