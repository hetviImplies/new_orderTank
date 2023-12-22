import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {store} from './src/redux/store/store';
import RootNavigator from './src/navigation/RootNavigator';
import colors from './src/assets/colors';
import {LogBox, StatusBar, View} from 'react-native';
// import {CustomToast} from './src/components';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
import('./src/helper/ReactotronConfig');

export default () => {
  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, []);

  LogBox.ignoreAllLogs();
  return (
    <Provider store={store}>
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={colors.black} barStyle={'light-content'} />
        <NavigationContainer>
          <RootNavigator />
          <FlashMessage position="top" />
        </NavigationContainer>
      </View>
    </Provider>
  );
};
