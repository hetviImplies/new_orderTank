/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Animated, StyleSheet, Image, Platform} from 'react-native';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';

import DefaultNotificationBody from './DefaultNotificationBody';
import {isiPAD, isX, wp} from '../../../styles/responsiveScreen';

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    width: '95%',
    borderRadius: isiPAD ? wp(1) : wp(4),
    marginTop: Platform.OS === 'ios' ? (isX ? wp(10) : wp(4)) : wp(4),
    alignSelf: 'center',
    paddingVertical: wp(2),
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
  },
});

class Notification extends Component {
  constructor() {
    super();

    this.heightOffset = isIphoneX() ? getStatusBarHeight() : 0;

    this.show = this.show.bind(this);
    this.showNotification = this.showNotification.bind(this);
    this.closeNotification = this.closeNotification.bind(this);

    this.state = {
      animatedValue: new Animated.Value(0),
      isOpen: false,
    };
  }

  show(
    {title, message, onPress, icon, vibrate, additionalProps, leftIcon} = {
      title: '',
      message: '',
      onPress: null,
      icon: null,
      vibrate: true,
      additionalProps: {},
      leftIcon: null,
    },
  ) {
    const {closeInterval} = this.props;
    const {isOpen} = this.state;

    // Clear any currently showing notification timeouts so the new one doesn't get prematurely
    // closed
    clearTimeout(this.currentNotificationInterval);

    const showNotificationWithStateChanges = () => {
      this.setState(
        {
          isOpen: true,
          title,
          message,
          onPress,
          icon,
          vibrate,
          additionalProps,
          leftIcon,
        },
        () =>
          this.showNotification(() => {
            this.currentNotificationInterval = setTimeout(() => {
              this.setState(
                {
                  isOpen: false,
                  title: '',
                  message: '',
                  onPress: null,
                  icon: null,
                  vibrate: true,
                  additionalProps,
                  leftIcon: null,
                },
                this.closeNotification,
              );
            }, closeInterval);
          }),
      );
    };

    if (isOpen) {
      this.setState({isOpen: false}, () => {
        this.closeNotification(showNotificationWithStateChanges);
      });
    } else {
      showNotificationWithStateChanges();
    }
  }

  showNotification(done) {
    const {animatedValue} = this.state;
    const {openCloseDuration} = this.props;
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: openCloseDuration,
      useNativeDriver: true,
    }).start(done);
  }

  closeNotification(done) {
    const {animatedValue} = this.state;
    const {openCloseDuration} = this.props;
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: openCloseDuration,
      useNativeDriver: true,
    }).start(done);
  }

  render() {
    const {
      height: baseHeight,
      topOffset,
      backgroundColour,
      iconApp,
      notificationBodyComponent: NotificationBody,
    } = this.props;

    const {
      animatedValue,
      title,
      message,
      onPress,
      isOpen,
      icon,
      vibrate,
      additionalProps,
      leftIcon,
    } = this.state;

    const height = baseHeight;

    return (
      <Animated.View
        style={[
          styles.notification,
          {backgroundColor: backgroundColour},
          {
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-height - 50 + topOffset, 0],
                }),
              },
            ],
          },
        ]}>
        <NotificationBody
          title={title}
          message={message}
          onPress={onPress}
          isOpen={isOpen}
          iconApp={iconApp}
          leftIcon={leftIcon}
          icon={icon}
          vibrate={vibrate}
          onClose={() => this.setState({isOpen: false}, this.closeNotification)}
          additionalProps={additionalProps}
        />
      </Animated.View>
    );
  }
}

Notification.propTypes = {
  closeInterval: PropTypes.number,
  openCloseDuration: PropTypes.number,
  height: PropTypes.number,
  topOffset: PropTypes.number,
  backgroundColour: PropTypes.string,
  notificationBodyComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  iconApp: Image.propTypes.source,
  leftIcon: Image.propTypes.source,
};

Notification.defaultProps = {
  closeInterval: 2500,
  openCloseDuration: 800,
  height: 80,
  topOffset: 0,
  backgroundColour: 'white',
  notificationBodyComponent: DefaultNotificationBody,
  iconApp: null,
  leftIcon: null,
};

export default Notification;
