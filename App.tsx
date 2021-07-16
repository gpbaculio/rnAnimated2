import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppLoading from 'expo-app-loading';
import {Asset} from 'expo-asset';
import {Image} from 'react-native';

import {assets} from './src/screens/Darkroom';

function cacheImages(images: any) {
  return images.map((image: any) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
MaterialCommunityIcons.loadFont();
Feather.loadFont();
AntDesign.loadFont();
FontAwesome.loadFont();

import AppNavigation from './src/navigation';

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const _loadAssetsAsync = async () => {
    const imageAssets = cacheImages([...assets]);

    await Promise.all([...imageAssets]);
  };
  if (!isReady)
    return (
      <AppLoading
        startAsync={_loadAssetsAsync}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  return <AppNavigation />;
};

export default App;
