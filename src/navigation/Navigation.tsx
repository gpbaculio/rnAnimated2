import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';

import {
  Examples,
  PanGesture,
  Transitions,
  WorkletsAndSharedValues,
  HigherOrder,
  CircularSlider,
  GraphInteractions,
  Swiping,
  DynamicSprings,
  DragToSort,
  CubicBezier,
  MorphingShapes,
  Duolingo,
  Rainbow,
  PhilzCoffee,
  Pizza,
  Chrome,
  SnapChat,
  Reflectly,
  StickyShapes,
  Breathe,
  ReflectlyTabBar,
  AppleBedtime,
  Chess,
  LiquidSwipe,
  Dvd,
  Chanel,
  Darkroom,
  ZAnimations,
  FbLiveVideoReaction,
  PlayingAudio,
  FbPostReaction,
  D3Chart,
  LockScreen,
  RotaryLogin,
  WheelOfFortune,
  Flip3d,
  Tarot,
  PhoneWave,
} from '../screens';
import {styleGuide} from '../screens/constants';

export type AppStackNavigatorType = {
  Examples: undefined;
  ZAnimations: undefined;
  WorkletsAndSharedValues: undefined;
  PanGesture: undefined;
  Transitions: undefined;
  HigherOrder: undefined;
  CircularSlider: undefined;
  GraphInteractions: undefined;
  Swiping: undefined;
  DynamicSprings: undefined;
  DragToSort: undefined;
  CubicBezier: undefined;
  MorphingShapes: undefined;
  Duolingo: undefined;
  Rainbow: undefined;
  PhilzCoffee: undefined;
  Pizza: undefined;
  Chrome: undefined;
  SnapChat: undefined;
  Reflectly: undefined;
  StickyShapes: undefined;
  Breathe: undefined;
  ReflectlyTabBar: undefined;
  AppleBedtime: undefined;
  Chess: undefined;
  LiquidSwipe: undefined;
  Dvd: undefined;
  Chanel: undefined;
  Darkroom: undefined;
  FbLiveVideoReaction: undefined;
  FbPostReaction: undefined;
  PlayingAudio: undefined;
  D3Chart: undefined;
  LockScreen: undefined;
  RotaryLogin: undefined;
  WheelOfFortune: undefined;
  Flip3d: undefined;
  Tarot: undefined;
  PhoneWave: undefined;
};

const Stack = createStackNavigator<AppStackNavigatorType>();

const AppNavigator = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" />
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: styleGuide.palette.primary,
          borderBottomWidth: 0,
        },
        headerTintColor: 'white',
      }}>
      <Stack.Screen
        name="Examples"
        component={Examples}
        options={{
          title: 'Learning Reanimated 2',
        }}
      />
      <Stack.Screen
        name="Tarot"
        component={Tarot}
        options={{
          title: 'Tarot',
        }}
      />
      <Stack.Screen
        name="PhoneWave"
        component={PhoneWave}
        options={{
          title: 'PhoneWave',
        }}
      />
      <Stack.Screen
        name="Flip3d"
        component={Flip3d}
        options={{
          title: 'Flip3d',
        }}
      />
      <Stack.Screen
        name="WheelOfFortune"
        component={WheelOfFortune}
        options={{
          title: 'WheelOfFortune',
        }}
      />
      <Stack.Screen
        name="RotaryLogin"
        component={RotaryLogin}
        options={{
          title: 'RotaryLogin',
        }}
      />
      <Stack.Screen
        name="LockScreen"
        component={LockScreen}
        options={{
          title: 'LockScreen',
        }}
      />
      <Stack.Screen
        name="D3Chart"
        component={D3Chart}
        options={{
          title: 'Zoom/Pan D3 Charts',
        }}
      />
      <Stack.Screen
        name="PlayingAudio"
        component={PlayingAudio}
        options={{
          title: 'PlayingAudio',
        }}
      />
      <Stack.Screen
        name="FbPostReaction"
        component={FbPostReaction}
        options={{
          title: 'FbPostReaction',
        }}
      />
      <Stack.Screen
        name="FbLiveVideoReaction"
        component={FbLiveVideoReaction}
        options={{
          title: 'FbLiveVideoReaction',
        }}
      />
      <Stack.Screen
        name="ZAnimations"
        component={ZAnimations}
        options={{
          title: 'ZAnimations',
        }}
      />
      <Stack.Screen
        name="LiquidSwipe"
        component={LiquidSwipe}
        options={{
          title: 'Liquid Swipe',
        }}
      />
      <Stack.Screen
        name="Darkroom"
        component={Darkroom}
        options={{
          title: 'Darkroom',
        }}
      />
      <Stack.Screen
        name="Chanel"
        component={Chanel}
        options={{
          title: 'Chanel',
        }}
      />
      <Stack.Screen
        name="Dvd"
        component={Dvd}
        options={{
          title: 'Dvd',
        }}
      />
      <Stack.Screen
        name="AppleBedtime"
        component={AppleBedtime}
        options={{
          title: 'Apple Bedtime',
        }}
      />
      <Stack.Screen
        name="Chess"
        component={Chess}
        options={{
          title: 'Chess',
        }}
      />
      <Stack.Screen
        name="WorkletsAndSharedValues"
        component={WorkletsAndSharedValues}
        options={{
          title: 'Worklets And SharedValues',
        }}
      />
      <Stack.Screen
        name="PanGesture"
        component={PanGesture}
        options={{
          title: 'Pan Gesture',
        }}
      />
      <Stack.Screen
        name="Transitions"
        component={Transitions}
        options={{
          title: 'Transitions',
        }}
      />
      <Stack.Screen
        name="HigherOrder"
        component={HigherOrder}
        options={{
          title: 'Higher Order',
        }}
      />
      <Stack.Screen
        name="CircularSlider"
        component={CircularSlider}
        options={{
          title: 'Circular Slider',
        }}
      />
      <Stack.Screen
        name="GraphInteractions"
        component={GraphInteractions}
        options={{
          title: 'Graph Interactions',
        }}
      />
      <Stack.Screen
        name="Swiping"
        component={Swiping}
        options={{
          title: 'Swiping',
        }}
      />
      <Stack.Screen
        name="DynamicSprings"
        component={DynamicSprings}
        options={{
          title: 'Dynamic Springs',
        }}
      />
      <Stack.Screen
        name="DragToSort"
        component={DragToSort}
        options={{
          title: 'Drag To Sort',
        }}
      />
      <Stack.Screen
        name="CubicBezier"
        component={CubicBezier}
        options={{
          title: 'Cubic Bezier',
        }}
      />
      <Stack.Screen
        name="MorphingShapes"
        component={MorphingShapes}
        options={{
          title: 'Morphing Shapes',
        }}
      />
      <Stack.Screen
        name="Duolingo"
        component={Duolingo}
        options={{
          title: 'Duolingo',
        }}
      />
      <Stack.Screen
        name="Rainbow"
        component={Rainbow}
        options={{
          title: 'Rainbow',
        }}
      />
      <Stack.Screen
        name="PhilzCoffee"
        component={PhilzCoffee}
        options={{
          title: '??? PhilzCoffee',
        }}
      />
      <Stack.Screen
        name="Pizza"
        component={Pizza}
        options={{
          title: '???? Pizza',
        }}
      />
      <Stack.Screen
        name="Chrome"
        component={Chrome}
        options={{
          title: 'Chrome',
        }}
      />
      <Stack.Screen
        name="SnapChat"
        component={SnapChat}
        options={{
          title: 'SnapChat',
        }}
      />
      <Stack.Screen
        name="Reflectly"
        component={Reflectly}
        options={{
          title: 'Reflectly',
        }}
      />
      <Stack.Screen
        name="ReflectlyTabBar"
        component={ReflectlyTabBar}
        options={{
          title: 'ReflectlyTabBar',
        }}
      />
      <Stack.Screen
        name="StickyShapes"
        component={StickyShapes}
        options={{
          title: 'StickyShapes',
        }}
      />
      <Stack.Screen
        name="Breathe"
        component={Breathe}
        options={{
          title: 'Breathe',
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
