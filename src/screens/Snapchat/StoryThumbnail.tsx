import * as React from 'react';
import {useNavigation} from '@react-navigation/native';
import {SharedElement} from 'react-navigation-shared-element';
import {View, Image, StyleSheet, Dimensions, Pressable} from 'react-native';

import {Story} from './Model';

const margin = 16;
const borderRadius = 5;
const width = Dimensions.get('window').width / 2 - margin * 2;

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

interface StoryThumbnailProps {
  story: Story;
}

const StoryThumbnail = ({story}: StoryThumbnailProps) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={({pressed}) => ({opacity: pressed ? 0.5 : 1})}
      onPress={() => {
        navigation.navigate('Story', {story});
      }}>
      <View style={[styles.container]}>
        <Image source={story.source} style={styles.image} />
      </View>
    </Pressable>
  );
};

export default StoryThumbnail;
