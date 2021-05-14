import React from 'react';
import {StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens';
import {NavigationContainer} from '@react-navigation/native';

import {WorkletsAndSharedValues} from './src';

import {styleGuide} from './src/constants';

enableScreens();

type AppNavigatorStackNavigatorType = {
  WorkletsAndSharedValues: undefined;
};

const Stack = createStackNavigator<AppNavigatorStackNavigatorType>();

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
