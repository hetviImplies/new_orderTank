import {
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
  } from 'react-native';
  import React from 'react';
  import {Button, CartCountModule, FontText} from '..';
  import commonStyle, {
    fontSize,
    iconSize,
    mediumFont,
    mediumLarge1Font,
    smallFont,
    tabIcon,
  } from '../../styles';
  import {hp, normalize, wp} from '../../styles/responsiveScreen';
  import {colors, SvgIcons} from '../../assets';

  const ModalComponente = (props: any) => {
    const {
      title,
      from,
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
    const content = (
      <View style={[styles.container, style]}>
        <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 0, justifyContent: "space-between" }}>
          {title ? (
            <FontText
              color="black2"
              name="mont-semibold"
              size={fontSize}
              pTop={wp(1)}
              pBottom={wp(6)}
              style={titleStyle}
              textAlign={''}
            >
              {title}
            </FontText>
          ) : null}
          {image}
          {onBackPress ? (
            <TouchableOpacity
              style={{ bottom: wp(3) }}
              onPress={onBackPress}
            >
              <SvgIcons.New_Close
                width={iconSize}
                height={iconSize}
                style={{ alignSelf: 'flex-end' }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {description ? (
          <FontText
            color="black"
            name="mont-semibold"
            size={mediumFont}
            textAlign={'center'}
          >
            {description}
          </FontText>
        ) : null}
        {children}
        <View style={[btnConatiner, commonStyle.rowJB, commonStyle.marginT2]}>
          {leftBtnPress && (
            <Button
              onPress={leftBtnPress}
              bgColor={'transparent'}
              style={[styles.leftBtn, leftBtnStyle]}
            >
              <FontText
                name={'mont-bold'}
                size={fontSize}
                style={leftBtnTextStyle}
                color={'orange'}
              >
                {leftBtnText}
              </FontText>
            </Button>
          )}
          {rightBtnPress && (
            <Button
              onPress={rightBtnPress}
              bgColor={rightBtnColor ? rightBtnColor : 'orange'}
              disabled={disabled}
              style={[styles.rightBtn, rightBtnStyle]}
            >
              <FontText
                name={'mont-bold'}
                size={fontSize}
                style={rightBtnTextStyle}
                color={'white'}
              >
                {rightBtnText}
              </FontText>
            </Button>
          )}
        </View>
      </View>
    );

    return (
      <Modal transparent visible={visible}>
      <View style={styles.fullScreen}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Animated.View style={[styles.backdrop, {
            backgroundColor: from === 'Floating' ? 'rgba(52, 52, 52, 0.2)' : 'rgba(52, 52, 52, 0.5)'
          }]} />
        </TouchableWithoutFeedback>
        {from === 'Floating' ? (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
            {content}
          </KeyboardAvoidingView>
        ) : (
          content
        )}
      </View>
    </Modal>
    );
  };

  export default ModalComponente;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      paddingVertical: hp(2),
      paddingHorizontal: wp(6),
      borderTopRightRadius:30,
      borderTopLeftRadius:30,
      width: '100%',
    },
    leftBtn: {
      borderRadius: normalize(6),
      width: '46%',
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: colors.brown,
    },
    rightBtn: {
      borderRadius: normalize(100),
      width: '46%',
      alignSelf: 'center',
    },
    fullScreen: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: 'center',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  });
