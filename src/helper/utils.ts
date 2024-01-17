import {showMessage} from 'react-native-flash-message';
import {wp, normalize} from '../styles/responsiveScreen';

const showToast = (title = 'Error!', message: any, type: any = 'error') => {
  showMessage({
    message: title,
    description: message,
    type,
    duration: 3000,
    textStyle: {
      fontFamily: 'Lexend-Medium',
      fontSize: normalize(14),
    },
    backgroundColor:
      type == 'error'
        ? '#D7443E'
        : type == 'warning'
        ? '#F5A623'
        : type == 'success'
        ? '#2D8A4E'
        : '#0A4EAF',
    icon: {
      icon: type === 'error' ? '#D7443E' : type,
      position: 'left',
      style: {marginTop: wp(2)},
    } as any,
  });
};

const showSuccessToast = (message: any) => {
  showToast('Success!', message, 'success');
};

const showErrorToast = (message: any) => {
  showToast('Error!', message, 'error');
};

const showWarningToast = (message: any, title = 'Warning!') => {
  showToast(title, message, 'warning');
};

export default {
  showToast,
  showSuccessToast,
  showErrorToast,
  showWarningToast
};
