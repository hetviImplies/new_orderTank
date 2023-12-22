/* eslint-disable no-else-return */
import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StatusBar,
  View,
  Text,
  Image,
  Vibration,
} from 'react-native';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';
import GestureRecognizer from '../SwipeGesture';
import {isiPAD, wp} from '../../../../styles/responsiveScreen';

const styles = {
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
    // shadowRadius: 1,
    // shadowOpacity: 1,
    // shadowColor: 'rgba(0,0,0,0.21)',
    // shadowOffset: {width: 0, height: 5},
    borderRadius: isiPAD ? wp(1) : wp(4),
    marginTop: isiPAD ? wp(4) : wp(15),
  },
  container: {
    position: 'absolute',
    // top: isIphoneX() && getStatusBarHeight(),
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: isiPAD ? wp(0) : wp(2),
    alignItems: 'center',
  },
  iconApp: {
    marginTop: 10,
    marginLeft: 20,
    resizeMode: 'contain',
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  icon: {
    marginTop: 0,
    marginLeft: 10,
    resizeMode: 'contain',
    width: 40,
    height: 40,
  },
  textContainer: {
    alignSelf: 'center',
    marginLeft: 10,
    // flex: 1,
    width: wp(64),
  },
  title: {
    color: '#000000',
    fontWeight: 'bold',
  },
  message: {
    color: '#000000',
    marginTop: 5,
  },
  footer: {
    backgroundColor: '#E06732',
    borderRadius: 5,
    alignSelf: 'center',
    height: 5,
    width: 35,
    margin: 5,
  },
  leftIcon: {
    marginRight: 20,
    width: 38,
    height: 38,
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
    if (isOpen !== prevProps.isOpen) {
      StatusBar.setHidden(isOpen);
    }

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

  renderIcon() {
    const {iconApp, icon} = this.props;

    if (icon) {
      return <Image source={icon} style={styles.icon} />;
    } else if (iconApp) {
      return <Image source={iconApp} style={styles.iconApp} />;
    }

    return null;
  }

  render() {
    const {title, message} = this.props;

    return (
      <View style={styles.root}>
        <GestureRecognizer onSwipe={this.onSwipe} style={styles.container}>
          <TouchableOpacity
            style={styles.content}
            activeOpacity={0.3}
            underlayColor="transparent"
            onPress={this.onNotificationPress}>
            {this.renderIcon()}
            <View style={styles.textContainer}>
              <Text numberOfLines={4} style={styles.title}>
                {title}
              </Text>
              <Text numberOfLines={1} style={styles.message}>
                {message}
              </Text>
            </View>
          </TouchableOpacity>

          {/* <View style={styles.footer} /> */}
        </GestureRecognizer>
      </View>
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
