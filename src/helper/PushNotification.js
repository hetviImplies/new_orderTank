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

const getToken = async () => {
  try {
    const token = await messaging().getToken()
    saveToken(token);
    console.log('Token:', token);
  } catch (error) {
    console.error('Error getting token:', error);
  }
};

export const removeToken = async () => {
  try {
    // Remove token from storage
    await AsyncStorage.removeItem('NotiToken');
    // Remove token from device
    await messaging().deleteToken();
    console.log('Token removed successfully');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export function requestPermission() {
  messaging()
    .requestPermission()
    .then(() => {
      console.log('Permission granted');
      getToken(); // Get token after permission is granted
    })
    .catch(error => {
      console.error('Permission request failed:', error);
      utils.showErrorToast(error?.message);
    });

  // Set up token refresh listener to update token
  messaging().onTokenRefresh(getToken);
}
