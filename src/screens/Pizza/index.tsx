import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

import PizzaChallenge from './PizzaChallenge';
import Pizzas from './Pizzas';

export type PizzaChallengeRoutes = {
  Pizzas: undefined;
  Pizza: {id: string};
};

const Stack = createSharedElementStackNavigator<PizzaChallengeRoutes>();

const Navigator = () => {
  return (
    <Stack.Navigator
      {...{
        mode: 'modal',
        screenOptions: {
          gestureEnabled: false,
          headerShown: false,
          cardOverlayEnabled: true,
          cardStyle: {
            backgroundColor: 'transparent',
          },
        },
      }}>
      <Stack.Screen {...{name: 'Pizzas', component: Pizzas}} />
      <Stack.Screen
        {...{
          name: 'Pizza',
          component: PizzaChallenge,
          sharedElementsConfig: route => {
            const {id} = route.params;
            return [id];
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default Navigator;
