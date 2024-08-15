import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Button, FontText} from '..';
import commonStyle, {mediumFont, fontSize} from '../../styles';
import {wp, hp, normalize} from '../../styles/responsiveScreen';
import {colors} from '../../assets';

const CartCountModule = (props: any) => {
  const {
    cartData,
    onPress,
    btnText,
    btnColor,
    isShow,
    showText,
    total,
    isShowButtons,
    btnText1,
    btnText2,
    btnColor1,
    btnColor2,
    onBtn1Press,
    onBtn2Press,
    clickDisable
  } = props;
  return (
    <View>
      {cartData && cartData?.length !== 0 && (
        <>
          <View style={[styles.totalContainer]}>
            <View style={{padding: wp(3)}}>
              <View style={[commonStyle.rowJB, {marginBottom: hp(1)}]}>
                <FontText
                  color="darkGray"
                  name="mont-medium"
                  size={mediumFont}
                  textAlign={'left'}>
                  {`Sub Total`}
                </FontText>
                <FontText
                  color="black2"
                  name="mont-semibold"
                  size={mediumFont}
                  textAlign={'left'}>
                  {'₹ '}
                  {`${total}`}
                </FontText>
              </View>
              <View style={[commonStyle.rowJB, {marginBottom: hp(1)}]}></View>
              <View style={[commonStyle.rowJB, {marginBottom: hp(1)}]}>
                <FontText
                  color="darkGray"
                  name="mont-medium"
                  size={mediumFont}
                  textAlign={'left'}>
                  {`Tax`}
                </FontText>
                <FontText
                  color="black2"
                  name="mont-semibold"
                  size={mediumFont}
                  textAlign={'left'}>
                  {'₹ '}
                  {`0.00`}
                </FontText>
              </View>
              <View style={[commonStyle.rowJB, {marginBottom: hp(1)}]}></View>
              <View style={[commonStyle.rowJB]}>
                <FontText
                  color="darkGray"
                  name="mont-medium"
                  size={mediumFont}
                  textAlign={'left'}>
                  {'Shipping Fee'}
                </FontText>
                <FontText
                  color="black2"
                  name="mont-semibold"
                  size={mediumFont}
                  textAlign={'left'}>
                  {'₹'}
                  {`0.00`}
                </FontText>
              </View>
            </View>
            <View style={[styles.dashedLine]} />
            <View style={[commonStyle.rowJB, styles.totalSubContainer]}>
              <FontText
                color="black2"
                name="mont-medium"
                size={mediumFont}
                textAlign={'left'}>
                {`Total (${cartData?.length} items)`}
              </FontText>
              <FontText
                color="orange"
                name="mont-bold"
                size={mediumFont}
                textAlign={'left'}>
                {'₹'}
                {`${total}`}
              </FontText>
            </View>
            {showText}
            {isShowButtons ? (
              <View style={styles.rowConatiner}>
                <Button
                  onPress={onBtn1Press}
                  bgColor={btnColor1}
                  style={[styles.buttonContainer]}>
                  <FontText
                    name={'mont-semibold'}
                    size={fontSize}
                    color={'orange'}>
                    {btnText1}
                  </FontText>
                </Button>
                <Button
                  onPress={onBtn2Press}
                  bgColor={btnColor2}
                  style={[styles.buttonContainer]}>
                  <FontText
                    name={'mont-semibold'}
                    size={fontSize}
                    color={'white'}>
                    {btnText2}
                  </FontText>
                </Button>
              </View>
            ) : null}
            {isShow ? (
              <Button
                onPress={onPress}
                bgColor={btnColor}
                disabled={clickDisable}
                style={[
                  styles.buttonContainer,
                  {width: '90%', marginVertical:hp(3),borderRadius:normalize(100)},
                ]}>
                <FontText
                  name={'mont-semibold'}
                  size={fontSize}
                  color={'white'}>
                  {btnText}
                </FontText>
              </Button>
            ) : null}
          </View>
        </>
      )}
    </View>
  );
};

export default CartCountModule;

const styles = StyleSheet.create({
  totalContainer: {
    marginTop: hp(1),
    width: '100%',
  },
  totalSubContainer: {
    padding: wp(3),
  },
  buttonContainer: {
    borderRadius: normalize(100),
    width: '48%',
    alignSelf: 'center',
  },
  rowConatiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: hp(2),
    marginVertical: hp(3),
  },
  dashedLine: {
    marginTop: wp(1),
    borderTopWidth: 1,
    borderColor: colors.gray6,
    marginHorizontal: wp(3),
  },
});
