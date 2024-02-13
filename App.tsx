import * as React from 'react';
import {
  LogBox,
  PermissionsAndroid,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import {Provider} from 'react-redux';
import('./src/helper/ReactotronConfig');
import Config from 'react-native-config';
import {NavigationContainer} from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {store} from './src/redux/store/store';
import RootNavigator from './src/navigation/RootNavigator';
import colors from './src/assets/colors';
import {requestPermission} from './src/helper/PushNotification';
import {InAppNotificationProvider} from './src/components/Common/InAppNotification';

const firebaseConfig = {
  apiKey: 'AIzaSyCox_mnUgKk88Xr-0iKqR5bR8QNUIkiFg0',
  authDomain: 'order-tank.firebaseapp.com',
  databaseURL: 'https://order-tank-default-rtdb.firebaseio.com',
  messagingSenderId: '374521811510',
  projectId: 'order-tank',
  appId: '1:374521811510:android:0822f02343c2ddf4243e97',
  storageBucket: 'gs://order-tank.appspot.com',
};

export default () => {
  React.useEffect(() => {
    console.log('Config.API_URL', Config.API_URL);
    requestNotificationPermission();
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    try {
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Notification handled in the background!', remoteMessage);
      });
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('Notification handled in the fourground!', remoteMessage);
      });
      return unsubscribe;
    } catch (error) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    requestPermission();
  });

  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, []);

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'Allow the app to receive notifications.',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
          // Handle notification logic here
        } else {
          console.log('Notification permission denied');
          // Handle denial or show a message to the user
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  LogBox.ignoreAllLogs();
  return (
    <Provider store={store}>
      <InAppNotificationProvider>
        <View style={{flex: 1}}>
          <StatusBar
            backgroundColor={colors.white}
            barStyle={'dark-content'}
          />
          <NavigationContainer>
            <RootNavigator />
            <FlashMessage position="top" />
          </NavigationContainer>
        </View>
      </InAppNotificationProvider>
    </Provider>
  );
};
