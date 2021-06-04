import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

import Snapchat, {stories} from './Snapchat';
import StoryComp from './Story';
import {SnapchatRoutes} from './Model';
import {RouteProp} from '@react-navigation/core';

export const assets = stories.map(story => [story.avatar, story.source]).flat();

const Stack = createSharedElementStackNavigator<SnapchatRoutes>();
const Navigator = () => (
  <Stack.Navigator
    screenOptions={{
      gestureEnabled: false,
      headerShown: false,
      cardOverlayEnabled: true,
      cardStyle: {backgroundColor: 'transparent'},
    }}
    mode="modal">
    <Stack.Screen name="Snapchat" component={Snapchat} />
    <Stack.Screen
      {...{
        name: 'Story',
        component: StoryComp,
        sharedElementsConfig: route => {
          const {id} = route.params.story;
          return [id];
        },
      }}
    />
  </Stack.Navigator>
);

export default Navigator;
