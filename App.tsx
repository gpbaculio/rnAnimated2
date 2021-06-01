import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

Feather.loadFont();
AntDesign.loadFont();

import AppNavigation from './src/navigation';

const App = () => <AppNavigation />;

export default App;
