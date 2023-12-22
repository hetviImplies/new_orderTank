import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  Vibration,
  Platform,
} from 'react-native';
import GestureRecognizer from '../SwipeGesture';
import {wp} from '../../../../styles/responsiveScreen';

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // shadowColor: 'rgba(0, 0, 0, 0.2)',
    // shadowOffset: {
    //   width: 0,
    //   height: 12,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 14,
    // elevation: 10,
    borderRadius: wp(4),
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    marginTop: 5,
    marginLeft: 10,
  },
  icon: {
    resizeMode: 'contain',
    width: 38,
    height: 38,
  },
  textContainer: {
    alignSelf: 'center',
    width: wp(65),
    marginLeft: 10,
  },
  title: {
    color: '#000',
    fontWeight: 'bold',
  },
  message: {
    color: '#000',
    marginTop: 5,
  },
  leftIcon: {
    width: 35,
    height: 35,
    alignItems: 'center',
    marginRight: 10,
  },
};

class DefaultNotificationBody extends React.Component {
  constructor() {
    super();

    this.onNotificationPress = this.onNotificationPress.bind(this);
    this.onSwipe = this.onSwipe.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {vibrate, isOpen} = this.props;
    if ((prevProps.vibrate || vibrate) && isOpen && !prevProps.isOpen) {
      Vibration.vibrate();
    }
  }

  onNotificationPress() {
    const {onPress, onClose} = this.props;

    onClose();
    onPress();
  }

  onSwipe() {
    const {onClose} = this.props;
    onClose();
  }

  render() {
    const {title, message, iconApp, icon, leftIcon} = this.props;

    return (
      <GestureRecognizer onSwipe={this.onSwipe} style={styles.container}>
        <TouchableOpacity
          style={styles.content}
          activeOpacity={0.3}
          underlayColor="transparent"
          onPress={this.onNotificationPress}>
          <View style={styles.iconContainer}>
            {(icon || iconApp) && (
              <Image source={icon || iconApp} style={styles.icon} />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text numberOfLines={4} style={styles.title}>
              {title}
            </Text>
            <Text numberOfLines={1} style={styles.message}>
              {message}
            </Text>
          </View>
          {/* <View style={styles.iconContainer}>
            {(leftIcon) && <FastImage source={{uri:leftIcon}} style={styles.leftIcon} resizeMode={FastImage.resizeMode.contain} fallback={Platform.OS === 'android'} />}
          </View> */}
        </TouchableOpacity>
      </GestureRecognizer>
    );
  }
}

DefaultNotificationBody.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  vibrate: PropTypes.bool,
  isOpen: PropTypes.bool,
  onPress: PropTypes.func,
  onClose: PropTypes.func,
  iconApp: Image.propTypes.source,
  icon: Image.propTypes.source,
  leftIcon: Image.propTypes.source,
};

DefaultNotificationBody.defaultProps = {
  title: 'Notification',
  message: 'This is a test notification',
  vibrate: true,
  isOpen: false,
  iconApp: null,
  icon: null,
  onPress: () => null,
  onClose: () => null,
  leftIcon: null,
};

export default DefaultNotificationBody;
