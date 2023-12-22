/* eslint-disable no-param-reassign */
import React from 'react';
import {View, StyleSheet, Platform, Animated} from 'react-native';
import colors from '../../../assets/colors';
import {hp, isIOS} from '../../../styles/responsiveScreen';

export const navbarXSpace = isIOS ? hp(3) : hp(3);
export const navbarHeight = isIOS ? hp(10) : hp(6.5);

interface NavigationBarProps {
  height: any;
  style: any;
  isFixed: boolean;
  bgColor: string;
  left: any;
  hasLeft: boolean;
  right: any;
  hasRight: boolean;
  center: any;
  hasCenter: boolean;
  leftStyle?: any;
  centerStyle?: any;
  rightStyle?: any;
  sidesWidth: number;
  animated: boolean;
  borderBottomWidth: number;
}

const NavigationBar = ({
  height,
  style,
  isFixed,
  bgColor,
  left,
  hasLeft,
  right,
  hasRight,
  center,
  hasCenter,
  leftStyle,
  centerStyle,
  rightStyle,
  sidesWidth,
  animated,
  borderBottomWidth,
}: NavigationBarProps) => {
  const _wrapperStyle = {
    height: height + navbarXSpace,
    borderBottomWidth,
  };
  const _sideStyle = {
    width: sidesWidth,
  };
  bgColor = bgColor;
  typeof bgColor === 'string';

  if (animated) {
    return (
      <Animated.View
        style={[
          styles.wrapper,
          isFixed ? styles.wrapperFixed : null,
          bgColor,
          styles.wrapper,
          _wrapperStyle,
          style,
        ]}>
        {hasLeft ? (
          <View style={[styles.left, _sideStyle, leftStyle]}>{left}</View>
        ) : null}
        {hasCenter ? (
          <View style={[styles.center, centerStyle]}>{center}</View>
        ) : null}
        {hasRight ? (
          <View style={[styles.right, _sideStyle, rightStyle]}>{right}</View>
        ) : null}
      </Animated.View>
    );
  }

  return (
    <View
      style={[
        styles.wrapper,
        isFixed ? styles.wrapperFixed : null,
        bgColor,
        _wrapperStyle,
        style,
      ]}>
      {hasLeft ? (
        <View style={[styles.left, _sideStyle, leftStyle]}>{left}</View>
      ) : null}
      {hasCenter ? (
        <View style={[styles.center, centerStyle]}>{center}</View>
      ) : null}
      {hasRight ? (
        <View style={[styles.right, _sideStyle, rightStyle]}>{right}</View>
      ) : null}
    </View>
  );
};

NavigationBar.defaultProps = {
  height: navbarHeight,
  isFixed: false,
  bgColor: 'white',
  hasLeft: false,
  hasCenter: false,
  hasRight: false,
  left: null,
  center: null,
  right: null,
  sidesWidth: 88,
  animated: false,
  borderBottomWidth: 1,
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: NavigationBar.height,
    paddingTop: Platform.OS === 'ios' ? 20 + navbarXSpace : 0,
    borderBottomColor: colors.headerBorder,
  },
  wrapperFixed: {
    top: 0,
    left: 0,
    width: '100%',
    position: 'absolute',
  },
  left: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 8,
  },
  center: {
    width: 0,
    flexGrow: 1,
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 8,
  },
});

export default NavigationBar;
