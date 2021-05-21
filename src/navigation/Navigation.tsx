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
} from '../screens';
import {styleGuide} from '../screens/constants';

export type AppStackNavigatorType = {
  Examples: undefined;
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
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
