import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Button, FontText} from '..';
import {
  fontSize,
  iconSize,
  mediumFont,
  mediumLarge1Font,
  mediumLargeFont,
  smallFont,
  tabIcon,
} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import commonStyle from '../../styles';
import SvgIcons from '../../assets/SvgIcons';

const Popup = (props: any) => {
  const {
    title,
    description,
    leftBtnText,
    rightBtnText,
    leftBtnPress,
    rightBtnPress,
    onTouchPress,
    visible,
    onBackPress,
    onOpen,
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
    rightBtnColor
  } = props;
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={visible}
      onRequestClose={onBackPress}>
      <TouchableNativeFeedback style={{flex: 1}} onPress={onTouchPress}>
        <View style={styles.background}>
          <Pressable style={[styles.container, style]} onPress={onOpen}>
            <TouchableOpacity
              onPress={onBackPress}
              style={{alignSelf: 'flex-end'}}>
              <SvgIcons.Close
                width={tabIcon}
                height={tabIcon}
                style={{alignSelf: 'flex-end'}}
              />
            </TouchableOpacity>
            {image}
            <FontText
              color="black"
              name="lexend-semibold"
              size={mediumLarge1Font}
              pTop={wp(1)}
              pBottom={wp(2)}
              style={titleStyle}
              textAlign={'center'}>
              {title}
            </FontText>
            {description ? (
              <FontText
                color="black"
                name="lexend-regular"
                size={smallFont}
                pTop={wp(2)}
                textAlign={'center'}>
                {description}
              </FontText>
            ) : null}
            {children}
            <View
              style={[btnConatiner, commonStyle.rowJB, commonStyle.marginT2]}>
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
                  bgColor={rightBtnColor}
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
          </Pressable>
        </View>
      </TouchableNativeFeedback>
    </Modal>
  );
};

export default Popup;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
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
});
