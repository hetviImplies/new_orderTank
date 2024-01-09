import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Button, FontText} from '..';
import commonStyle, {mediumFont, fontSize} from '../../styles';
import {wp, hp, normalize} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';

const CartCountModule = (props: any) => {
  const {cartData, onPress, btnText, btnColor, isShow, showText, total} = props;
  return (
    <View>
      {cartData && cartData?.length !== 0 && (
        <>
          <View style={[styles.totalContainer]}>
            <View style={{padding: wp(3)}}>
              <View style={[commonStyle.rowJB, {marginBottom: hp(1)}]}>
                <FontText
                  color="black2"
                  name="lexend-regular"
                  size={mediumFont}
                  textAlign={'left'}>
                  {`Sub Total (${cartData?.length} items)`}
                </FontText>
                <FontText
                  color="black2"
                  name="lexend-regular"
                  size={mediumFont}
                  textAlign={'left'}>
                  {'₹'}{`${total}`}
                </FontText>
              </View>
              <View style={[commonStyle.rowJB, {marginBottom: hp(1)}]}></View>
              <View style={[commonStyle.rowJB]}>
                <FontText
                  color="black2"
                  name="lexend-regular"
                  size={mediumFont}
                  textAlign={'left'}>
                  {'Shipping Charge'}
                </FontText>
                <FontText
                  color="black2"
                  name="lexend-regular"
                  size={mediumFont}
                  textAlign={'left'}>
                  {'₹'}{`0`}
                </FontText>
              </View>
            </View>
            <View style={[commonStyle.rowJB, styles.totalSubContainer]}>
              <FontText
                color="white"
                name="lexend-regular"
                size={mediumFont}
                textAlign={'left'}>
                {'Total Amount'}
              </FontText>
              <FontText
                color="white"
                name="lexend-regular"
                size={mediumFont}
                textAlign={'left'}>
                {'₹'}{`${total}`}
              </FontText>
            </View>
            {showText}
            {isShow ? (
              <Button
                onPress={onPress}
                bgColor={btnColor}
                style={[styles.buttonContainer]}>
                <FontText
                  name={'lexend-medium'}
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
    backgroundColor: colors.white2,
    marginTop: hp(1),
    width: '100%',
  },
  totalSubContainer: {
    backgroundColor: colors.orange,
    padding: wp(3),
  },
  buttonContainer: {
    borderRadius: normalize(6),
    marginVertical: hp(3),
    width: '88%',
    alignSelf: 'center',
  },
});
