/* eslint-disable import/prefer-default-export */
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import utils from './utils';

PushNotification.createChannel({
  channelId: 'default-channel-id',
  channelName: 'Default channel',
  importance: 5,
});

const saveToken = async token => {
  await AsyncStorage.setItem('NotiToken', token);
};

export function requestPermission() {
  messaging()
    .hasPermission()
    .then(enabled => {
      if (
        enabled === messaging.AuthorizationStatus.AUTHORIZED ||
        enabled === messaging.AuthorizationStatus.PROVISIONAL
      ) {
        messaging()
          .getToken()
          .then(token => {
            saveToken(token);
          });
      } else {
        messaging()
          .requestPermission()
          .then(() => {
            messaging()
              .getToken()
              .then(token => {
                saveToken(token);
              })
              .catch(error => utils.showErrorToast(error));
          })
          .catch(error => {
            utils.showErrorToast(error?.message);
          });
      }
    });
}
