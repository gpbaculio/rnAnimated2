import * as React from 'react';
import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {RectButton} from 'react-native-gesture-handler';

import {styleGuide} from '../constants';
import {AppStackNavigatorType} from '../../navigation/Navigation';

const duolingoIcon = require('../../../assets/duolingo.png');

export const examples: {
  screen: string;
  title: string;
  icon?: ImageSourcePropType;
}[] = [
  {
    screen: 'WorkletsAndSharedValues',
    title: '👩‍🏭  Worklets And SharedValues',
  },
  {
    screen: 'PanGesture',
    title: '💳  Pan Gesture',
  },
  {
    screen: 'Transitions',
    title: '🔁  Transitions',
  },
  {
    screen: 'HigherOrder',
    title: '🐎  Higher Order',
  },
  {
    screen: 'CircularSlider',
    title: '⭕️  Circular Slider',
  },
  {
    screen: 'GraphInteractions',
    title: '📈  Graph Interactions',
  },
  {
    screen: 'Swiping',
    title: '💚  Swiping',
  },
  {
    screen: 'DynamicSprings',
    title: '👨‍🔬  Dynamic Springs',
  },
  {
    screen: 'DragToSort',
    title: '📤  Drag To Sort',
  },
  {
    screen: 'CubicBezier',
    title: '⤴️  Cubic Bézier',
  },
  {
    screen: 'MorphingShapes',
    title: '☺️ Morphing Shapes',
  },
  {
    screen: 'Duolingo',
    title: 'Duolingo',
    icon: duolingoIcon,
  },
  {screen: 'Rainbow', title: '🌈  Rainbow Charts'},
];

const Examples = () => {
  const {navigate} =
    useNavigation<StackNavigationProp<AppStackNavigatorType, 'Examples'>>();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {examples.map(thumbnail => (
        <RectButton
          key={thumbnail.screen}
          onPress={() =>
            navigate(thumbnail.screen as keyof AppStackNavigatorType)
          }>
          <View style={styles.thumbnail}>
            {!!thumbnail.icon && (
              <Image source={thumbnail.icon} style={styles.icon} />
            )}
            <Text style={styles.title}>{thumbnail.title}</Text>
          </View>
        </RectButton>
      ))}
    </ScrollView>
  );
};

export default Examples;

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleGuide.palette.background,
  },
  content: {
    paddingBottom: 32,
  },
  thumbnail: {
    backgroundColor: 'white',
    padding: styleGuide.spacing * 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: styleGuide.palette.background,
    flexDirection: 'row',
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  title: {
    ...styleGuide.typography.headline,
  },
});
