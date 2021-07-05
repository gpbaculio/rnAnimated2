import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

Feather.loadFont();
AntDesign.loadFont();
FontAwesome.loadFont();

import AppNavigation from './src/navigation';

const App = () => <AppNavigation />;

export default App;
