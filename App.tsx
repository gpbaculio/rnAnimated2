import React from 'react';
import {StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens';
import {NavigationContainer} from '@react-navigation/native';

import {WorkletsAndSharedValues} from './src';
import {styleGuide} from './src/constants';
import Examples from './src/Examples';

enableScreens();

export type AppStackNavigatorType = {
  Examples: undefined;
  WorkletsAndSharedValues: undefined;
};

const Stack = createStackNavigator<AppStackNavigatorType>();

const AppNavigator = () => (
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
  </Stack.Navigator>
);

const App = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" />
    <AppNavigator />
  </NavigationContainer>
);

export default App;
