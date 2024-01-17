import {
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {Button, FontText} from '..';
import commonStyle, {
  fontSize,
  mediumLarge1Font,
  smallFont,
  tabIcon,
} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {colors, SvgIcons} from '../../assets';

const Popup = (props: any) => {
  const {
    title,
    description,
    leftBtnText,
    rightBtnText,
    leftBtnPress,
    rightBtnPress,
    visible,
    onBackPress,
    btnConatiner,
    rightBtnStyle,
    leftBtnStyle,
    children,
    image,
    titleStyle,
    style,
    leftBtnTextStyle,
    rightBtnTextStyle,
    disabled,
    rightBtnColor,
  } = props;

  // useEffect(() => {
  //   if (!visible) Keyboard.dismiss();
  // }, [visible]);

  // if (!visible) return null;

  return (
    <Modal transparent visible={visible}>
      <View style={styles.fullScreen}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Animated.View style={[styles.backdrop]} />
        </TouchableWithoutFeedback>
        <View style={[styles.container, style]}>
          {onBackPress ? (
            <TouchableOpacity
              onPress={onBackPress}
              style={{alignSelf: 'flex-end'}}>
              <SvgIcons.Close
                width={tabIcon}
                height={tabIcon}
                style={{alignSelf: 'flex-end'}}
              />
            </TouchableOpacity>
          ) : null}
          {image}
          {title ? (
            <FontText
              color="black"
              name="lexend-semibold"
              size={mediumLarge1Font}
              pTop={wp(1)}
              pBottom={wp(4)}
              style={titleStyle}
              textAlign={'center'}>
              {title}
            </FontText>
          ) : null}
          {description ? (
            <FontText
              color="black"
              name="lexend-regular"
              size={smallFont}
              textAlign={'center'}>
              {description}
            </FontText>
          ) : null}
          {children}
          <View style={[btnConatiner, commonStyle.rowJB, commonStyle.marginT2]}>
            {leftBtnPress && (
              <Button
                onPress={leftBtnPress}
                bgColor={'transparent'}
                style={[styles.leftBtn, leftBtnStyle]}>
                <FontText
                  name={'lexend-semibold'}
                  size={fontSize}
                  style={leftBtnTextStyle}
                  color={'orange'}>
                  {leftBtnText}
                </FontText>
              </Button>
            )}
            {rightBtnPress && (
              <Button
                onPress={rightBtnPress}
                bgColor={rightBtnColor ? rightBtnColor : 'orange'}
                disabled={disabled}
                style={[styles.rightBtn, rightBtnStyle]}>
                <FontText
                  name={'lexend-semibold'}
                  size={fontSize}
                  style={rightBtnTextStyle}
                  color={'white'}>
                  {rightBtnText}
                </FontText>
              </Button>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Popup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingVertical: hp(2),
    paddingHorizontal: wp(6),
    borderRadius: 15,
    width: '88%',
  },
  leftBtn: {
    borderRadius: normalize(6),
    width: '46%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.brown,
    height: hp(6),
  },
  rightBtn: {
    borderRadius: normalize(6),
    width: '46%',
    alignSelf: 'center',
    height: hp(6),
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
});
