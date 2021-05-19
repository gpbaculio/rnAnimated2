import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';

import {styleGuide} from '../screens/constants';
import {
  Examples,
  PanGesture,
  Transitions,
  WorkletsAndSharedValues,
  HigherOrder,
  CircularSlider,
  GraphInteractions,
} from '../screens';

export type AppStackNavigatorType = {
  Examples: undefined;
  WorkletsAndSharedValues: undefined;
  PanGesture: undefined;
  Transitions: undefined;
  HigherOrder: undefined;
  CircularSlider: undefined;
  GraphInteractions: undefined;
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
          title: 'HigherOrder',
        }}
      />
      <Stack.Screen
        name="CircularSlider"
        component={CircularSlider}
        options={{
          title: 'CircularSlider',
        }}
      />
      <Stack.Screen
        name="GraphInteractions"
        component={GraphInteractions}
        options={{
          title: 'GraphInteractions',
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
